# Design QA · AI 设计质量校验机制

> 本文件定义 BeP Skill 的自动化设计质量校验（Design QA）体系。
> 目标：让 Skill 不仅能生成设计稿，还能像专业设计走查与质量验收一样，**自动发现问题、验证规范、修复错误**。
> 核心原则：**可执行、可验证、可修复、不造假**。凡是没实际检查的内容，一律标记 `NOT CHECKED` / `BLOCKED`，绝不标记为 `PASS`。

---

## 一、六大校验维度

| 维度 | 校验内容 | 程序化程度 | 唯一依据 |
|---|---|---|---|
| **D1 需求还原** | 功能/字段/业务流程/交互是否完整覆盖 PRD，有无遗漏、擅增、误解 | 部分（字段文本比对） | 用户 PRD（`--prd` 或 `evidence/**/prd.md`）+ `design-process.md` |
| **D2 设计规范** | 颜色/字号/字重/间距/圆角/阴影/布局是否符合 Token，禁止非规范值 | **高（全自动）** | `design-tokens.md` + `bep-components.js` 的 `BEP_C` |
| **D3 组件引用** | 组件是否来自组件库；名称/路径/API/属性/变体/插槽是否正确；禁止虚构组件 | **高（全自动）** | `bep-components.js` 函数定义 + `components-*.md` 公开入口 + `icons.md` |
| **D4 组件使用** | 是否复用标准组件，有无重复造轮子、错误组合、滥用自定义样式 | **高（全自动）** | `validate-page.js` 执行层规则 + `SKILL.md` 执行铁律 + `scripter-rules.md` |
| **D5 视觉还原** | 布局/尺寸/间距/对齐/信息层级/组件比例/视觉一致性；有 Figma 真源时截图比对 | 部分（尺寸比对） | Figma 参考（`--figma` 或 `evidence/**/figma.json`）+ `page-layouts.md` |
| **D6 交互逻辑** | 按钮/弹窗/表单/下拉/表格/分页/状态切换是否完整，状态与反馈是否合规 | 部分（状态齐备性） | `interaction-design.md` 状态矩阵 + `design-review.md` §三/§六 |

**关键边界**：D1/D5/D6 的"语义判断层"（需求是否误解、像素级还原度、交互形态是否合理）无法靠脚本判定，必须人工确认；脚本只负责其中的**可程序化部分**，并显式声明哪些没查。产品原型只作需求依据，**不得作为 D5 的视觉真源**，也不得照搬其布局。

---

## 二、校验状态（五态）

| 状态 | 含义 | 能否作为交付依据 |
|---|---|---|
| `PASS` | 实际执行检查且通过 | ✅ 可以 |
| `FAIL` | 实际执行检查且发现违规（阻塞/硬性规则） | ❌ 必须修复 |
| `WARNING` | 实际执行检查，发现建议项或证据有限 | ⚠️ 可交付但需说明 |
| `BLOCKED` | 缺少真源/条件，无法执行（如无 PRD、无 Figma 数据） | ⚠️ 不计为 PASS，需补条件 |
| `NOT CHECKED` | 明确未检查（属人工判断层） | ⚠️ 不得当作 PASS |

**铁律**：没有实际检查的内容，禁止标记为 `PASS`。`BLOCKED` 与 `NOT CHECKED` 是诚实结论，不是失败，但必须在报告中列出并说明补充条件。

---

## 三、自动化校验机制

### 3.1 唯一依据原则
所有校验规则**只从现有资产动态解析**，不硬编码新标准，`qa-basis.js` 在运行时加载：

- 组件函数集合 ← `scripts/bep-components.js` 的 `function bep*`（实测 140 个）
- 图标 key 集合 ← `bep-components.js` 的 `BEP_ICONS`（实测 330 个）
- 公开组件集合 ← `components-core.md` / `components-layout.md` 的公开入口与章节标题 + `SKILL.md` 速查表（实测 93 个）
- 设计 Token ← `references/design-tokens.md`（颜色 10+、字号、行高、圆角、布局常量）
- Token 自洽校验 ← 比对文档值（`design-tokens.md`）与实现值（`bep-components.js` 的 `BEP_C`），不一致会标记
- 颜色检测限定"颜色上下文"（`bepHex('...')`、`fills`/`stroke`/`color` 赋值），不把任意 6 位 hex 当颜色，避免误判示例数据（如库存 `999999`）
- 画布尺寸 `CANVAS_W/H` 与组件变体展示页（variants）的差异降为 WARNING；结构常量（SIDE_W/HDR_H/TABLE_W 等）不一致仍为 FAIL

### 3.2 复用现有校验器
`validate-page.js`（891 行成熟规则）保持不动。Design QA 调用它并把 error/warning 解析为 D4 的程序化证据，避免重复实现与规则漂移。

### 3.3 可程序化规则清单

| 规则编码 | 维度 | 检查 | 状态 |
|---|---|---|---|
| `D2-TOKEN-COLOR-001/002` | D2 | 硬编码非规范色 / 规范色未走 Token | FAIL / WARNING |
| `D2-TOKEN-FONT-001` | D2 | 字号不在规范集合 | WARNING |
| `D2-TOKEN-FAMILY-001/002` | D2 | 字体族非 PingFang SC / 用了 TC | FAIL（可自动修复） |
| `D2-TOKEN-RADIUS-001` | D2 | 圆角不在规范集合 | WARNING |
| `D2-TOKEN-LAYOUT-001/002` | D2 | 结构布局常量与 Token 不一致 / 画布尺寸或组件展示页差异 | FAIL / WARNING |
| `D3-COMP-001` | D3 | 调用未定义的 bep* 函数（虚构组件） | FAIL |
| `D3-COMP-002` | D3 | 调用未登记为公开入口的函数 | WARNING |
| `D3-ICON-001` | D3 | 引用图标库不存在的图标 | FAIL |
| `D4-VALIDATE-ERROR/WARN` | D4 | 复用 validate-page 的 error/warning | FAIL / WARNING |
| `D4-REUSE-001` | D4 | 自造标准组件替身函数 | FAIL |
| `D5-DIM-001` | D5 | 页面尺寸与 Figma 参考不一致 | FAIL |
| `D6-STATE-EMPTY/PAGE-001` | D6 | 缺空态 / 缺分页 | FAIL / WARNING |
| `D6-INTERACTION-CONFIRM/FEEDBACK-001` | D6 | 危险操作无二次确认 / 无提交反馈 | WARNING |
| `D1/D5/D6-*-JUDGEMENT` | D1/D5/D6 | 语义判断层，脚本不判定 | NOT CHECKED |

---

## 四、自动修复闭环

```
设计输出 → [D1~D6 六维检查] → 识别违规项及位置 → 分析对应规范
        → 自动修复可确定项 → 二次校验 → 输出报告
        → 若无 FAIL 可修复项则收敛，否则重复（上限 --max-rounds，默认 3）
```

- **只修复确定性项**：目前支持 `PingFang TC → SC`、按钮文案汉字间空格。每条修复是机械可逆替换，记录在报告中。
- **不得为了过校验而改业务逻辑或降要求**：修复策略不含任何绕过或降级逻辑；`BLOCKED` / 不可自动修复的 `FAIL` 必须人工处理，脚本不会"放水"。
- **二次校验验证**：每次修复后自动重新跑六维检查，确认该项确实消失才记为"已修复并通过复检"。
- **幂等**：问题已修复后再次运行不会产生新修复（实测验证）。

---

## 五、校验结果报告

每次设计输出后自动生成两份报告，位于 `pages/<模块>/dist/`：
- `design-qa-<页面>.md`：人读报告，严格含 8 个部分（需求还原 / 设计规范 / 组件引用正确率 / 组件使用 / 视觉还原 / 交互逻辑 / 问题及修复记录 / 未解决问题及原因）。
- `design-qa-<页面>.json`：机器可读，含全部 findings、状态、metrics、修复历史、每轮闭环记录。

每个问题标注 6 项：问题描述、问题位置（文件:行号）、对应规范、严重程度（阻塞/建议/提示）、修复建议、校验结果（五态）。

---

## 六、使用方法

```bash
cd scripts
# 基础校验（六维，缺真源的维度记 BLOCKED）
node tools/design-qa.js <模块>/<页面>

# 提供真源后校验（D1/D5 从 BLOCKED 变为实际检查）
node tools/design-qa.js <模块>/<页面> --prd path/prd.md --figma path/figma.json

# 只校验不修复 / 调整闭环轮次 / 仅输出 JSON 路径
node tools/design-qa.js <模块>/<页面> --no-fix --max-rounds 5 --json
```

**证据放置约定**（也可用 `--prd` / `--figma` 显式指定任意路径）：
```
scripts/tools/qa/evidence/<模块>/<页面>/prd.md        # 需求清单
scripts/tools/qa/evidence/<模块>/<页面>/figma.json    # Figma 尺寸/节点参考
```
`figma.json` 支持 `{"dimensions": {"CANVAS_W": 1440, "SIDE_W": 208, ...}}`，脚本据此比对布局常量。

**退出码**：`FAIL` = 1（阻断交付），其余（PASS/WARNING/BLOCKED/NOT CHECKED）= 0（可交付但需按报告说明）。

---

## 七、模块结构

```
scripts/tools/qa/
├── qa-core.js                    状态枚举 / finding 工厂 / 工具函数
├── qa-basis.js                   唯一依据加载器（动态解析组件/Token/图标，不硬编码标准）
├── qa-dim-spec.js                D2 设计规范校验
├── qa-dim-component.js           D3 组件引用 + D4 组件使用校验
├── qa-dim-interaction.js         D6 交互逻辑校验
├── qa-dim-requirement-visual.js  D1 需求还原 + D5 视觉还原校验
├── qa-fix.js                     自动修复器（确定性修复策略）
├── qa-report.js                  报告生成（Markdown + JSON）
└── evidence/                     真源证据目录（PRD / Figma）
scripts/tools/design-qa.js         主编排器（六维调度 + 闭环 + 报告）
```

扩展方式：新增规则只需在对应 `qa-dim-*.js` 加一条 `finding(...)`；新增自动修复只需在 `qa-fix.js` 的 `FIXERS` 注册机械替换函数。规则集中、模块化，便于维护。

---

## 八、与现有体系的关系

- **不推翻**：`design-review.md`（八维设计自检）与 `validate-page.js`（执行层静态校验）保持不动，继续有效。
- **增强层**：Design QA 是两者之上的自动化编排与验收层。八维自检的人工判断项在 D1/D5/D6 中以 `NOT CHECKED` 显式提示；validate-page 的结果被 D4 复用。
- **裁决顺序不变**：`SKILL.md` 铁律 > 组件文档 > 组件库 > 校验器 > RAG。Design QA 的各维度依据严格落在该顺序内，RAG 不作为校验依据。
