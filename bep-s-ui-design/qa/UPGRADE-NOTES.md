# BEP-S UI Design Skill · 能力迭代说明（2026-11-17）

## Design QA 自动质量校验机制

本次迭代的目标不是「再加一段设计自检提示词」，而是建立**可执行、可验证、可修复**的自动化校验流程：让 Skill 不只会生成设计稿，还能像专业设计走查一样自动发现问题、验证规范、修复错误。

---

# 一、本次 Skill 升级说明

## 1.1 保留的部分（没有推翻原有体系）

原有成熟能力**全部原样保留**：

- `SKILL.md` 的 Step 0→10 主流程、Step 8 人工合规清单、Step 8.5 Design Critique、Step 6 八块报告；
- `visual-design-reasoning.md` 的 AI Design Brain（Page Role / Autonomy Level / Layout Hypothesis / Design Quality Score 85 分阈值）；
- `validation.md` 的评分公式与 Design Critique；
- `component-registry.json` / `design-tokens.json` / `missing-components.json` / `design-system-conflicts.json` 全部真值源；
- `constraints.md` C-01…C-100、`html-prototype.md` 12 条交互契约、`prd-to-prototype.md` PRD 覆盖率核对表；
- 组件选用优先级、「禁止相似组件魔改」、冲突裁决优先级、AI 不得自作主张等不可协商原则；
- `assets/empty-states/` 透明底缺省插画资产体系。

## 1.2 新增的部分

| 新增 | 位置 | 作用 |
|---|---|---|
| 可执行的 Design QA 引擎 | `qa/`（18 个文件） | 真值源加载、六大检查器、headless Chrome 实测、修复闭环、报告生成 |
| 模块化规则目录（32 条） | `qa/rules/rule-catalog.json` | 每条含 `specSource` / `requiredEvidence` / `severity` / `fixable`，可独立扩展 |
| 报告结构 schema | `qa/schema/qa-report.schema.json` | 固定 8 章 + 每问题 6 字段 + 条件不足清单 |
| 状态机与 PASS 守卫 | `qa/lib/status.mjs` | PASS / FAIL / WARNING / BLOCKED / NOT CHECKED |
| 运行态探针 | `qa/lib/browser.mjs` + `img_probe.py` | DOM 实测（可点元素 / 溢出 / 契约目标）+ 截图 + 逐像素比对 + PNG alpha 检测 |
| 自动修复器 | `qa/fixers/index.mjs` | 3 类确定性修复 + 禁止清单 |
| 工作流升级 | `SKILL.md` Step 9.5 + 新增「Design QA 自动质量校验工作流」章节 | `设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付` |
| 参考文件表 + 交付要求 | `SKILL.md` 参考文件表 / Step 10 | Step 10 必须附 Design QA 报告，交代总体状态 / 未解决项 / 条件不足 |
| 自检样例 | `qa/fixtures/` | 正例 / 反例 / 两份 PRD / Figma 参考图 |

## 1.3 流程变化

```
旧：产品分析 → 信息架构设计 → UI 视觉设计 → 设计输出 → 交付
新：产品分析 → 信息架构设计 → UI 视觉设计 → 设计输出
    → 自动质量校验 → 问题修复 → 二次校验 → 最终交付
```

Step 8 / 8.5 仍照常跑；新增的 Step 9.5 是**并行的自动化层**，人工清单管判断，脚本管可程序化验证的事实，两份都要有、都写进交付说明。

## 1.4 本次迭代中修正的引擎自身缺陷（都是实测跑出来的）

| 发现 | 修正 |
|---|---|
| CSS 注释写在 `:root` 前面，导致 `:root` 变量全部读不到 | `artifact.mjs` 用等长空格替换注释，保留 offset / 行号 |
| `checkedCount` 被写成"违规数"，修完后规则误判 `NOT CHECKED` | 统一改成"实检对象数"，修复后能正确判 `PASS` |
| `cursor:pointer` 是继承属性，子元素被误判成独立死链 | 探针标记 `inherited`，检查器只验「pointer 根元素」 |
| 静态多机展示板被当成可点击原型，误报 20 个 P0 死链 | 引入产物形态判定（prototype / demo / static），静态稿交互规则标条件不足 |
| 展示板横向排布被当成手机内溢出 | R5-02 只校验单屏 / 设备容器，排除 html/body/board |
| 底部弹层 r12 是已裁决冲突，却被当成非法圆角要求改回 8px | 校验器读 `design-system-conflicts.json` 放行，禁止自动降低设计要求 |
| 圆形 / 胶囊 `radius.pill = 高度÷2` 被判非法 | ≥16px 降为 P2 并注明按 pill 公式需人工确认 |
| 反例里 CDN 外链脚本让 headless 渲染挂起 | 探针副本剥离外链资源 + 重试一次（不改原产物，外链由 R6-06 单独判违规） |
| `'+v.img+'` 这类 JS 模板表达式被误判成外部图片路径 | R4-03 跳过模板表达式并留证据 |

---

# 二、校验机制说明

## 2.1 六大维度（32 条规则）

| 维度 | 规则数 | 校验内容 | 唯一判据 |
|---|---|---|---|
| R1 需求还原 | 4 | PRD 功能点覆盖率、擅自增删屏幕、需求卡八项、逐条落点 | `prd-to-prototype.md` §6 / C-93 / `--prd` |
| R2 设计规范 | 7 | 色值 / 字号 / 字重 / 圆角 / 行高 / 裸色值 / 裸圆角 | `design-tokens.json` / C-01…C-14 / `html-prototype.md` §3 |
| R3 组件引用 | 5 | 组件存在性、`data-bep-status` 诚实性、NOT_FOUND 冒充、变形使用、Scripter 代码 | `component-registry.json` / `missing-components.json` / Step 7C |
| R4 组件使用 | 5 | 标签 tint 三档、已知冲突裁决、缺省插画外链与透明底、重复造轮子 | C-04/C-97/C-98 / §6.3/§6.17 / `design-system-conflicts.json` |
| R5 视觉还原 | 6 | 渲染非空、溢出、Figma 截图比对、原型边界、375×812 基准、组件比例 | `mobile-ui-rules.md` / `page-patterns.md` / C-95 |
| R6 交互逻辑 | 7 | 死链、悬空跳转 / 弹层目标、12 条契约、空态、禁止清单、触摸热区 | `html-prototype.md` §4–§8/§11 / C-80/C-84 / `interaction-adaptive-tokens.json` |

**不允许凭空编造校验标准**：每条规则都登记 `specSource` 指向本 Skill 既有文件；`interaction-adaptive-tokens.json` 的 `EXTERNAL_STANDARD` 只出 ADVISORY 提示，不参与硬性判定。

## 2.2 自动化手段（不是 AI 文字自评）

| 手段 | 实现 |
|---|---|
| 读取 Token / 组件库做规则比对 | `evidence.mjs` 加载 10 份真值源，展开合法色值 / RGB 族 / 字号 / 圆角 / 组件 status / componentKey |
| 检查组件引用与属性合法 | `r3-component-ref.mjs` 用 `data-bep-component` / `data-bep-status` 对 registry 与缺口表逐条解析 |
| 检查颜色 / 字号 / 间距 / 圆角 | `r2-design-token.mjs` 扫描全部 CSS 声明与行内样式，带行号定位 |
| 检查未定义组件与非规范样式 | R3-01 虚构组件 P0；R4-05 重复造轮子 P2；R2-02 裸色值 P1 |
| 有代码输出时执行代码检查 | `r3-component-ref.mjs` R3-05：Figma Scripter 跑 `node --check`、检测 `mkF(tint(...))` 空白事故写法、校验 `componentKey` |
| 有视觉参考时截图比对 | `browser.mjs` headless Chrome 渲染 → `img_probe.py` 逐像素差异 + 4×4 网格定位偏差区域 |
| 真实运行态校验 | DOM 探针实测 `getComputedStyle` cursor、scrollWidth/clientWidth、data-* 目标是否存在、PNG 四角 alpha |

## 2.3 状态语义与 PASS 守卫

`PASS` / `FAIL` / `WARNING` / `BLOCKED` / `NOT CHECKED`

- **PASS 守卫**：`实检对象数 > 0` 且 `证据记录 > 0`，否则强制降级 `NOT CHECKED`。
- `BLOCKED` = 真值源 / 输入缺失，规则未执行；`NOT CHECKED` = 产物没有可检查对象，实际未检查。
- 没有实际检查的内容绝不标 PASS。
- `canClaimPass` 要求 BLOCKED 与 NOT CHECKED 都为 0；否则交付话术只能是"已完成可校验部分"。
- `deliverable` 只由真实违规（FAIL / P0）决定，条件不足不阻碍交付，但必须进「校验条件不足清单」。

## 2.4 自动修复闭环

```
执行六大维度检查 → 识别违规及位置 → 分析规范依据
→ 自动修复可确定问题 → 重新执行全套校验 → 输出最终报告
（最多 3 轮；本轮无进展即停；规则目录 SHA 每轮校验防篡改）
```

允许 3 类：`TOKEN_SUBSTITUTION`（值不变的 `var()` 替换）、`SPEC_VALUE_NORMALIZATION`（标签 tint 归一 10%）、`ASSET_INLINING`（本地透明底 PNG base64 内联）。

禁止：改业务逻辑 / 增删功能点 / 增删屏幕消除悬空引用 / 虚构组件改名 / 调阈值降分 / 把 BLOCKED 改 PASS / 为了通过校验降低设计要求。修复前写 `.bak`；不可自动修复项保留 FAIL/WARNING 并写明原因。

## 2.5 报告

固定 8 章：①需求还原 ②设计规范 ③组件引用正确率 ④组件使用 ⑤视觉还原 ⑥交互逻辑 ⑦发现的问题及修复记录 ⑧尚未解决的问题及原因；附「校验条件不足清单」与「校验/修复迭代记录」。每个问题固定 6 字段（问题描述 / 问题位置 / 对应规范 / 严重程度 / 修复建议 / 校验结果）。输出 `*.qa.json` + `*.qa.md` + `*.qa.html`。

详见 `qa/README.md` 与 `qa/schema/qa-report.schema.json`。

---

# 三、实际测试结果

> 全部为真实执行，命令与报告均在 `qa/reports/` 下可复现。除闭环测试用 `/tmp` 副本外，对既有交付物一律用 `check` 只读模式，**未修改任何原始文件**。

## 3.1 引擎自检（`node qa/qa.mjs selftest`）

| 样例 | 结果 | 说明 |
|---|---|---|
| `fixtures/bad.html` | `pass: true` | 预期命中的 6 条 FAIL 全部命中：R2-02 裸色值、R2-03 13px 字号、R3-01 虚构组件、R4-01 标签 16% tint、R4-03 外链图片、R6-06 CDN/alert/Vue |
| `fixtures/good.html` | `pass: true` | 0 个 FAIL，总体 WARNING；BLOCKED 5（R1 无 PRD、R5-03 无参考图），NOT CHECKED 4 |

## 3.2 自动修复闭环测试（`run` 模式，反例副本）

| 项 | 结果 |
|---|---|
| 迭代 | 3 轮（check → 12 项修复 → recheck → 无进展停止） |
| 自动修复 | **12 项**：R2-02 裸色值 8 处、R2-05 裸圆角 2 处、R4-03 外链插画内联 1 处、R4-01 标签 tint 16%→10% 1 处 |
| FAIL 变化 | **6 → 3**；R2-02 / R4-01 / R4-03 修复后由 FAIL 转 PASS |
| 剩余 FAIL | R2-03（13px 字号）、R3-01（虚构组件"不存在组件"）、R6-06（CDN / alert() / Vue）——**全部是不可自动修复项**，按策略保留并写明原因 |
| 修复示例 | `#00B1B4 → var(--brand)`、`4px → var(--r-btn)`、`rgba(0,177,180,.16) → rgba(0,177,180,0.1)`、`https://example.com/empty.png → data:image/png;base64,…`（取 `assets/empty-states/empty.png`，透明底） |

## 3.3 条件齐全 / 条件不足 / 越界三组对照

| 用例 | 输入 | 结果 |
|---|---|---|
| **F 全条件** | 匹配 PRD + Figma 参考图（`--reference-kind figma`） | PASS 28 / FAIL 0 / WARNING 2 / BLOCKED 0 / NOT CHECKED 4；R1-01 覆盖率 **3/3 = 100%**、R1-02 屏幕 **2/2 无增删**、R5-03 **差异率 0**（375×812 逐像素一致）、R5-04 PASS |
| **G 需求不对齐** | PRD 声明 4 屏，产物只有 2 屏 | FAIL 2（P0 4）；R1-01 覆盖率 **2/4 = 50%**（report/history 无落点）、R1-02 报出缺失屏 `report` / `history` |
| **H 原型越界** | 把参考图标成 `--reference-kind prd-prototype` | FAIL 1（P0 1）：R5-04 直接拦截，R5-03 标 BLOCKED，符合「产品原型只作需求依据」 |

## 3.4 五份既有真实交付物（`check` 只读）

| 产物 | 总体 | PASS/FAIL/WARN/BLOCKED/NOT CHECKED | 问题数（P0） | 判定 |
|---|---|---|---|---|
| `品质巡检-四页设计-2026-11-05.html` | FAIL | 8 / 4 / 6 / 5 / 11 | 90（0） | 不可交付 |
| `转场协作工单-衍生三页-2026-11-11.html` | FAIL | 7 / 4 / 6 / 5 / 12 | 70（0） | 不可交付 |
| `examples/empty-states/all-states.html` | FAIL | 9 / 3 / 6 / 5 / 11 | 70（0） | 不可交付 |
| `品质巡检-四页-Scripter-2026-11-05.js` | WARNING | 2 / 0 / 1 / 13 / 18 | 9（0） | 可交付（条件不足 31 项已列） |
| `筛选弹层-Scripter-2026-11-05.js` | WARNING | 2 / 0 / 1 / 13 / 18 | 8（0） | 可交付（条件不足 31 项已列） |

### 真实产物里被查出来的具体问题（归纳）

- **R2-01 `:root` 变量不在 Token 真值表**
  - 四页稿 `--text-2:#445060`，而 `design-tokens.json` 是 `color.text.4 = #444F60`（差一位，真实漂移）。
  - 转场稿 9 个变量不在 BEP-S Token：`--brand:#50A8B0`、`--orange:#C26A1E`、`--green:#3F9840`、`--dest-bg:#E4F2F2` 等——这些是当时从用户截图采样后**刻意保留的另一套主色**，属于需要人工裁决的业务偏离，引擎只报事实、不自动改回 `#00B1B4`。
- **R2-02 裸色值**：三份 HTML 分别 20 / 16 / 16 处（`maxIssuesPerRule=20` 截断，报告标 `+N`），含 `#E9EBEF` 这类既不在 Token 表也没走变量的色值。
- **R2-03 非规范字号**：`font-size:13px`，不在 `[11,12,14,15,16,17,18,20,22,24]` 中（分别 5 / 6 / 13 处）。
- **R2-04 非规范圆角**：`3px` / `5px` / `32px`（32px 按 `radius.pill` 降为 P2，需人工确认是否为胶囊/圆形）。
- **R4-02 已知规范冲突**：9 / 8 条 ADVISORY，逐条引用 `design-system-conflicts.json` 的裁决结论，未静默统一。
- **Scripter 两份**：R3-05 **PASS** —— `node --check` 通过、无 `mkF(tint(...))` 空白事故写法、无未登记 `componentKey`。这直接验证了 2026-11 那次「运行后整页空白」的修复已固化成可复现的校验规则。

### 静态稿 / 条件不足的诚实处理

三份 HTML 都是**多机静态展示板**（无 `data-screen` / `data-screen-go` / 契约层），引擎没有把它们误判成"20 个 P0 死链"：交互类规则标 `NOT CHECKED` 并写明「静态视觉稿 / 多机展示板，无交互契约层」；R1 四条（无 PRD）、R5-03（无 Figma 参考图）标 `BLOCKED`。**没有一条被伪装成 PASS。**

## 3.5 复现命令

```bash
cd <解压后的 Skill 目录>          # 命令一律相对 Skill 根目录，不依赖任何机器绝对路径
node qa/qa.mjs selftest              # 引擎自检：反例必须全命中、正例零 FAIL
node qa/qa.mjs check --target qa/fixtures/bad.html --out qa/reports/demo-bad
node qa/qa.mjs check --target qa/fixtures/good.html \
  --prd qa/fixtures/prd-matching.json \
  --reference qa/fixtures/reference-figma.png --reference-kind figma \
  --out qa/reports/demo-good
```

> 历史实测用的业务稿（品质巡检四页、转场协作三页、报事记录页等）不在分发包里，
> 想复现那批结论就把自己的产物路径传给 `--target`。分发包只保留 `qa/fixtures/` 自检样例与源码。

---

# 四、尚未解决 / 需人工裁决（不自动改）

1. **转场稿另一套主色 `#50A8B0`**：来自用户截图采样，与 BEP-S `#00B1B4` 冲突。引擎判定为规范偏离，但**不得自动改**——需要产品/设计确认是保留业务稿自有色，还是对齐 BEP-S。
2. **`--text-2:#445060` vs Token `#444F60`**：1 位色值漂移，需回 Figma 复核后决定改页面还是补登记 Token。
3. **`design-system-conflicts.json` 14 条已裁决冲突**：如一级 Tab 三种读数（§6.2 42/16 Medium、P-1 18 Semibold、实测 48/18）、弹出层圆角 r8 vs r12，仍以 ADVISORY 出现在每次报告里，需设计负责人最终收敛。
4. **静态稿无交互契约层**：若要把三份展示板升级成可点击原型，需补 `data-*` 契约层后重跑 R6，才能拿到交互完整性结论。
5. **Figma 参考图缺失**：R5-03 目前对三份 HTML 都是 BLOCKED；提供真实设计稿 PNG 后即可出逐像素差异与偏差网格。
6. **Scripter / page.json 产物的 CSS 与浏览器规则**：目前诚实标 `NOT CHECKED`（31 项条件不足）；若要全维度覆盖，需为这两类产物补充结构化 `tokenRef` / `componentRef` 校验器。
7. **缺省状态全量替换任务**（另一条未完成需求）：最新组件库 `138:3955「35空状态」` 因 Figma 桌面端活动标签页不是组件库，MCP 读不到，仍需手动切换标签页后继续；`assets/empty-states/` 目前 3 张已抠底、剩 5 张（network / position / fuction / door / wrong）待导出。
