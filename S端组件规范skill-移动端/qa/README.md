# BEP-S Design QA · 校验机制说明

> 这份目录不是"设计自检提示词"，而是一套**可执行、可验证、可修复**的自动化校验引擎。
> 它在 Skill 原有「产品分析 → 信息架构设计 → UI 视觉设计」之后新增：
> **设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付**。

---

## 1. 它解决什么问题

以前 Step 8 / `validation.md` 靠 AI 读一遍代码打勾，本质是文字自评。三个老问题：

- 说"符合规范"但没有真的去比 `design-tokens.json` 里的每一个值；
- 说"组件都来自组件库"但没有真的去查 `component-registry.json` 里这个名字存不存在；
- 说"能点通"但没有真的在浏览器里渲染一遍。

Design QA 把能程序化验证的部分交给脚本：读真值源、跑 headless Chrome、逐像素比对、解码 PNG 检查 alpha、跑 `node --check`。AI 只负责判断类结论，不负责伪造事实类结论。

## 2. 目录结构（规则模块化，方便扩）

```
qa/
├── qa.mjs                       CLI 主入口（run / check / fix / selftest）
├── qa.config.json               阈值、状态策略、修复白名单、浏览器（默认 auto 自动探测）
├── rules/
│   └── rule-catalog.json        33 条规则注册表（六大维度），每条带 specSource
├── schema/
│   └── qa-report.schema.json    报告结构（8 章 + 问题 6 字段）
├── lib/
│   ├── status.mjs               状态机 + PASS 守卫
│   ├── evidence.mjs             真值源加载（Token / 组件库 / 缺口 / 冲突 / 约束 / 契约）
│   ├── artifact.mjs             产物解析（HTML / page.json / Scripter JS，保留行号）
│   ├── checker.mjs              规则编写辅助
│   ├── browser.mjs              headless Chrome 运行态探针（DOM 实测 + 截图）
│   ├── img_probe.py             PIL 图像探针（alpha / blank / compare）
│   └── report.mjs               报告生成（JSON + 中文 MD + 单文件 HTML）
├── checkers/
│   ├── index.mjs                六大维度编排
│   ├── r1-requirement.mjs       R1 需求还原（4 条）
│   ├── r2-design-token.mjs      R2 设计规范（7 条）
│   ├── r3-component-ref.mjs     R3 组件引用（5 条）
│   ├── r4-component-usage.mjs   R4 组件使用（6 条，含 R4-06 图标来源）
│   ├── r5-visual.mjs            R5 视觉还原（6 条）
│   └── r6-interaction.mjs       R6 交互逻辑（7 条）
├── fixers/
│   └── index.mjs                自动修复器（仅 3 类确定性修复）
├── fixtures/                    自检样例（正例 / 反例 / PRD / Figma 参考图）
└── reports/                     运行时自动生成的报告（分发包内不含，首次运行自动建目录）
```

**新增规则只需两步**：在 `rule-catalog.json` 登记 + 在对应 checker 实现同名 ID。登记了但没实现的规则会被自动标 `NOT CHECKED`，不会给假 PASS。

## 2.5 运行环境（换台机器也能跑）

引擎源码用 `import.meta.url` 相对定位 Skill 根目录，真值源全是相对路径，**包内没有任何机器绝对路径**。只需：

| 依赖 | 用途 | 缺失时的表现 |
|---|---|---|
| Node.js 18+ | CLI、六大检查器、报告生成 | 无法启动 |
| Python3 + Pillow | `img_probe.py` 做 PNG alpha / 空白 / 逐像素比对 | 相关图像规则标 `BLOCKED`，不影响其余维度 |
| Chrome / Chromium | headless 渲染 DOM 探针 + 截图 | 运行态规则标 `BLOCKED`，报告写进「校验条件不足清单」，不伪报 PASS |

Chrome 自动探测顺序：`CHROME_PATH` / `CHROMIUM_PATH` 环境变量 → macOS / Linux / Windows 常见安装路径 → `PATH`。探测不到又不想改配置时，设一下环境变量即可：

```bash
export CHROME_PATH="/path/to/Chrome"      # macOS 示例：/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
python3 -m pip install pillow              # 没装 Pillow 时
node qa/qa.mjs selftest                    # 换机后先跑这个确认引擎可用
```

也可在 `qa.config.json` 里把 `browser.chrome` 从 `"auto"` 改成绝对路径，团队各人自己覆盖、不必改源码。

## 3. 唯一校验依据（不凭空编标准）

| 真值源 | 用在哪 |
|---|---|
| `design-tokens.json` | 合法色值 / 字号 / 圆角 / 字重 / 行高 / 结构尺寸 |
| `component-registry.json` | 38 个组件的 `status` / `componentKey` / `visualRecipe` / `dimensions` |
| `missing-components.json` | 11 条已确认 NOT_FOUND 缺口 |
| `design-system-conflicts.json` | 14 条已裁决冲突（如底部弹层 r12 必须放行，不许改回 8） |
| `constraints.md` | C-01…C-100 可执行约束与严重度 |
| `html-prototype.md` | 12 条交互契约、禁止清单、Token 变量规则 |
| `prd-to-prototype.md` | PRD 覆盖率核对表、原型边界 C-95 |
| `interaction-adaptive-tokens.json` | `EXTERNAL_STANDARD`，只出 ADVISORY，不当 BEP-S 硬性规则 |
| `assets/empty-states/` | 本地透明底插画，用于外链资产自动内联 |

任何真值源缺失 → 依赖它的规则统一 `BLOCKED`，报告里进「校验条件不足清单」。

## 4. 状态语义

| 状态 | 含义 |
|---|---|
| `PASS` | 规则真的执行了，`实检对象数 > 0` 且 `有证据`，零违规 |
| `FAIL` | 有 P0 / P1 违规 |
| `WARNING` | 只有 P2 / ADVISORY |
| `BLOCKED` | 真值源 / 输入缺失，规则**未执行** |
| `NOT CHECKED` | 产物没有可检查对象（静态稿无交互层、无组件标注、非 Scripter 产物），**实际未检查** |

**PASS 守卫**：`status=PASS` 必须同时满足「实检对象数 > 0」和「有证据记录」，否则强制降级 `NOT CHECKED`。没有实际检查的内容不得标 PASS。

**交付话术**：`canClaimPass = (BLOCKED=0 且 NOT CHECKED=0)`。为假时只能说"已完成可校验部分"，不能说"校验全部通过"。`deliverable` 只由真实违规（FAIL / P0）决定，条件不足不阻碍交付但必须逐条列出。

## 5. 怎么用

```bash
# 完整闭环（会改产物，自动写 <产物>.bak）
node qa/qa.mjs run --target /path/to/design.html \
  --prd /path/to/requirement-card.json \
  --reference /path/to/figma.png --reference-kind figma \
  --out qa/reports

# 只校验不修改
node qa/qa.mjs check --target /path/to/design.html

# 单轮修复 + 二次校验
node qa/qa.mjs fix --target /path/to/design.html

# 引擎自检
node qa/qa.mjs selftest
```

**需求还原校验**需要 `--prd`（需求卡 JSON，字段见 `qa/fixtures/prd-matching.json`）。不给 → R1 四条 `BLOCKED`。
**视觉还原比对**需要 `--reference` + `--reference-kind figma`。不给 → R5-03 `BLOCKED`。
把 `--reference-kind` 标成 `prd-prototype` → R5-04 直接 `FAIL(P0)`：产品原型只能作需求依据，不得照搬布局与视觉。

## 6. 自动修复闭环

```
第 1 轮 check → 定位问题 → 找规范依据 → 只修可确定问题 → 写 .bak → 落盘
第 2 轮 recheck → 再修 → … 最多 3 轮 / 无进展即停 → 最终报告
```

允许（值来自真值源、语义不变）：

- `TOKEN_SUBSTITUTION`：裸色值 / 裸圆角 → 同名 `var()`（**值不变**）
- `SPEC_VALUE_NORMALIZATION`：标签 tint 归一到 10%（C-04）
- `ASSET_INLINING`：外链插画 → `assets/empty-states/` 同名透明底 PNG base64 内嵌

禁止：

- 改业务逻辑、删 / 增功能点、新增删除屏幕来消除悬空引用
- 把虚构组件改名成真实组件
- 调整阈值 / 评分 / 规则目录来降低失败数（每轮用规则目录 SHA 校验防篡改）
- 把 `BLOCKED` / `NOT CHECKED` 改成 `PASS`
- 为了通过校验降低设计要求（例：已裁决的底部弹层 r12 不许自动改回全局 8px）

不可自动修复的问题保留 `FAIL/WARNING` 并写明原因，进报告第 8 章。

## 7. 报告

固定 8 章 + 2 个附加清单。每个问题固定 6 字段：问题描述 / 问题位置 / 对应规范 / 严重程度 / 修复建议 / 校验结果。

- `*.qa.json` — 结构化，供后续脚本消费
- `*.qa.md` — 中文八章报告
- `*.qa.html` — 单文件，双击可看

## 8. 已知边界（诚实声明）

- 组件引用校验依赖产物带 `data-bep-component` / `data-bep-status` 标注；不带标注就是 `NOT CHECKED`，引擎不会假装检查过。
- `page.json` / Figma Scripter 的产物只能跑结构化 / 代码类规则，CSS 与浏览器类规则会明确标 `NOT CHECKED`，不会误判 PASS。
- 视觉截图比对需要真实 Figma 设计稿 PNG；拿产品原型当参考会被 `FAIL(P0)` 拦下。
- 触摸热区来自 `EXTERNAL_STANDARD`（Apple HIG / Material Design 3），只提示，不参与硬性判定。
- 静态多机展示板不是可点击原型：交互类规则标条件不足，`cursor:pointer` 只出 P2 提示，不会误报 P0 死链。
