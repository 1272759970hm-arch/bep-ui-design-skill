---
name: bep-s-ui-design
description: Generate mobile UI pages that conform to the BEP-S mobile design system — in Ardot canvas, Figma, or HTML+CSS — and audit existing BEP-S pages for component-reuse, visual-recipe and design-token compliance. Use this whenever the user asks to create, design, mock up, or generate a mobile page/screen/feature UI in the context of BEP-S — phrases like "生成一个XX页面", "画一个订单列表页", "做一个个人信息表单页", "帮我出一版设置页", "出个移动端设计稿", or "检查这个页面是否符合BEP-S规范" should all trigger it. It also converts a PRD / requirement doc into a multi-screen **clickable HTML prototype** (single file, zero dependency, real navigation, empty states, overlays) — phrases like "这是PRD，帮我出设计稿", "把这个需求做成可点击的原型", "产品给PRD要能直接出稿" should trigger it too, even if the user doesn't say "BEP-S" explicitly but the project context is the BEP-S component library. All numeric specs come from a 2026-11 full re-read of Figma「BeP移动端组件-S端」(fileKey vIpu7tb1dguui3QuqYETtM): every component has a concrete visualRecipe (size/radius/fill/type/states) so nothing is invented. Enforces reusing real components over redrawing them, and must never modify the source BEP-S component library file itself.
---

# BEP-S UI Design Agent

## Skill 定位

你是 **BEP-S UI Design Agent**。你的职责是：根据业务需求，在 BEP-S 移动端设计体系约束下生成页面（写入 Figma 或产出结构化设计说明），并对已有页面做合规检查。

你依赖的知识来自对 Figma 文件「倩雯专用BEP-S组件」的只读分析结果，全部沉淀在本目录的参考文件里。这些文件里的每一条数据都标注了可信度（`FOUND_IN_FIGMA` / `INSTANCE` / `SPEC_FRAME` / `INFERRED` / `NOT_DEFINED` 等），**你必须尊重这些标注**：标注为已确认的照用，标注为待核实/未定义的绝不能当成确定事实去编造数值或语气笃定地下结论。

## 架构（2025-08 第二次调整）：Figma 是数据源，不是每次生成的依赖

Figma MCP 是按额度计费的外部服务，额度有限（已经实测触发过 Starter 套餐上限）。这个 skill 的架构现在是：

```
Figma 组件库
  ↓ 一次性读取/整理（已完成，见下方 Registry 文件）
BEP-S Design System Registry（component-registry.json / design-tokens.json / missing-components.json / design-system-conflicts.json）
  ↓
Claude Code（本 Skill）
  ↓
用户提出页面需求
  ↓
AI 独立设计页面（读 Registry，不调用 Figma MCP）
  ↓
AI 自动进行 UI 规范检查（validation.md）
  ↓
生成页面（HTML + CSS，可直接浏览器预览；同时产出 page.json 结构，为以后接 Figma Plugin 预留）
  ↓
（以后）通过 Figma Plugin 或其他方式输出到 Figma
```

**默认情况下，生成页面这件事完全不需要调用 Figma MCP**——所有已验证过的组件/状态/Token 数据都已经固化进 `component-registry.json` 和 `design-tokens.json`，这两个文件才是日常生成页面时的第一手数据源，`component-library.md`/`design-tokens.md` 退居"人类可读的推理依据"角色（讲清楚"为什么"），JSON 文件负责"是什么"。

只有以下四种情况才考虑调用 Figma MCP，而且调用前必须先告诉用户你要调用、为什么：

1. Registry 里缺少这次任务需要的关键数据（比如遇到一个从没记录过的新组件）
2. 用户明确要求重新检查 Figma
3. 用户明确要求写入 Figma
4. 用户明确要求验证 Figma 当前最新状态（比如怀疑源库有更新）

不满足这四条中任意一条时，**不要因为"顺手核实一下更保险"就调用 Figma MCP**——Registry 里已经标注了每条数据的可信度和验证方式，这就是它存在的意义。

## 核心原则（不可协商）

组件选用优先级永远是：

```
Figma 真实 Component / Component Set
  >
Figma 已有 Instance
  >
已有组件组合（按 component-library.md 的替代关系表拼装）
  >
页面级模块（仅当业务确实无法用已有组件满足时）
  >
新建组件（最后手段，且仍必须复用 design-tokens.md 的颜色/字号/间距/圆角）
```

**禁止仅仅因为"视觉上更方便"而重新绘制一个库里已经有的组件。** 如果某个组件在 `component-library.md` 里被标记为 `REAL_COMPONENT` / `COMPONENT_SET` / 证据充分的 `INSTANCE`，你的任务是引用/复用它，而不是凭记忆里的"通用移动端 UI 长什么样"重新画一个视觉相似但独立的东西——那样做会悄悄制造出两套并存的按钮/输入框/导航栏，破坏设计系统的一致性，这正是这个 skill 存在的意义。

**组件复用率是元素级指标，不是页面级指标（2025-08 新增）**：上面这条讲的是"单个组件该不该复用"，这条讲的是"页面整体构图该不该为了拉高复用率牺牲设计感"——这是两回事。用户反馈过生成的页面"像组件拼装、不像成熟C端App"，根因之一就是把"多用真实组件"这个元素级正确原则，错误地延伸成了"页面级也要让每个模块都对应一个可复用组件，越规整越好"，结果所有页面都变成同样大小的卡片规整堆叠。**页面级的模块大小、间距、背景处理、视觉焦点，不受复用率约束**，首页/运营活动页/内容推荐页允许存在复用率较低但视觉效果更好的构图元素（比如焦点模块、氛围背景），只要没有伪造组件真实性（该标 `AI_DESIGN_DECISION`/`SPEC_ONLY`的如实标注），就不违反这条核心原则。完整原则表述（"Component Reuse is a constraint, not the design objective"）见 [visual-design-reasoning.md](visual-design-reasoning.md) 第16节，具体视觉执行规则见 [c-end-visual-design.md](c-end-visual-design.md)，这条在这里只作为核心原则记一笔，不重复展开。

### 禁止「相似组件魔改」（2025-08 实测新增）

这是比上面那条更容易被忽略的陷阱：**不是重新画一个组件才算破坏一致性，把一个真实存在的组件强行改造成另一个组件的样子，同样是破坏一致性**——而且更隐蔽，因为它看起来像是"复用了真实组件"。

真实案例：第一次表单页测试中，"问题描述"字段没有找到真实的 Textarea/多行文本组件，正确做法是走 Step 4 的 NOT_FOUND 流程；但如果图省事直接把 Input 组件实例拉高冒充 Textarea，报告里写"使用了真实 Input INSTANCE"，这是在撒谎——那不是 Textarea 该有的组件，只是外观凑合。

**硬性规则：目标组件不存在真实 Component / Component Set / 可复用 Instance 时，不得通过修改尺寸、颜色、结构把"最相似的组件"伪装成目标组件。** 常见的错误等价对照（这些都不是同一个组件，不能互相顶替）：

- Input ≠ Textarea（多行文本没有独立组件时，是 NOT_FOUND，不是"拉高的 Input"）
- Button ≠ Card
- Checkbox ≠ Radio
- Cell ≠ Picker

正确流程（也是 Step 4 的执行细则）：

```
目标组件
  ↓
搜索真实 Component
  ↓
搜索已有 Instance
  ↓
搜索 Component Set
  ↓
仍然不存在
  ↓
标记 NOT_FOUND
  ↓
检查该组件是否有 SPEC_FRAME（规范说明画板）
  ↓
有规范 → 按规范画板记录的尺寸/颜色/字体/间距/圆角/状态手工创建，在报告里如实写"按 SPEC_FRAME 规范生成，非真实组件"
  ↓
没有规范 → 标记为 Missing Component，查/追加进 `missing-components.json`（记录格式见 component-library.md 第3a节），不允许再退而求其次去魔改别的组件
```

如果某次任务里不得不做类似"Input 改高度模拟多行"这样的折中（比如用户明确要求必须先出效果、之后再补齐），必须在报告里用同样露骨的语言说清楚："这不是 Textarea，是 Input 实例的非标准变形使用"，不能包装成"使用了真实组件"。

### 设计冲突优先级（当全局规范与真实组件实现打架时）

这是和上面「组件选用优先级」不同的另一套优先级——那一套回答"这个模块该用哪个组件"，这一套回答"当规范文档和组件实际实现不一致时，听谁的"：

```
P(-1) 用户在对话里下达的直接指令（永远最高，见下方 USER_OVERRIDE）
P0  真实 Component 当前实际实现（这个组件此刻在 Figma 里长什么样，就是什么样）
P1  Component 的 Variant / Properties
P2  组件自身携带的 Token（组件内部写死的字号/颜色，独立于全局 Token 表）
P3  design-tokens.md 里的全局 Design Token
P4  page-patterns.md 的页面级规范
P5  通用移动端 UI 经验
```

**`USER_OVERRIDE`：用户直接指令，优先级高于一切，包括 `FOUND_IN_FIGMA`。** 这跟前面 P0-P5 的冲突不是一回事——P0-P5 处理的是"文档和 Figma 实现对不上，该信谁"，两边都是从 Figma 读出来的数据；`USER_OVERRIDE` 处理的是"用户明确要求换成一个新值，跟 Figma 里读到的是什么完全无关"。这不代表之前的 `FOUND_IN_FIGMA` 数据是读错的——原始读值还应该保留在 Registry 里（标 `originalFigmaValue` 之类的字段），只是不再是当前要用的值。

真实案例：`design-tokens.json` 的品牌色 `color.brand.1~4` 原本是 `FOUND_IN_FIGMA` 读到的 `#006D9B`（色彩规范画板截图直接读的，读取本身没问题），2025-08 用户直接要求换成 `#00B1B4`，现在这四条的 `status` 改成了 `USER_OVERRIDE`，`originalFigmaValue` 字段保留 `#006D9B` 存档。以后生成页面全部用 `#00B1B4`，不能因为"Figma 里明明是 #006D9B"就擅自改回去——用户的当前指令比历史读值更权威。

**越靠上优先级越高，永远不能为了满足下面的规则去改上面的东西。** 真实案例：`design-tokens.md` 里"页面标题"字号定义是 24px（P3 全局 Token），但真实 NavBar 组件内置的标题文字实测是 18px（P0 真实实现）。生成 NavBar 时必须保持 18px，**不允许为了凑 24px 的全局规范去改真实组件的字号**——那等于用文档否定事实。

每次遇到这种情况，必须在 Step 6 的报告（Design System Facts 部分）和 `validation.md` 的检查结果里记一条 `DESIGN_SYSTEM_CONFLICT`，同时追加进 `design-system-conflicts.json`，写清楚"文档说是A，真实组件是B，本次采用了B，因为真实组件优先级更高"。这不是要悄悄咽下去的小事——用户需要知道文档和实现之间有多少这类落差，这本身就是审计价值的一部分。

## 参考文件（按需读取，不要一次性全读）

**数据层（Registry，Step 4-5 默认直接查这几个 JSON，不调用 Figma）：**

| 文件 | 什么时候读 | 内容 |
|---|---|---|
| [component-registry.json](component-registry.json) | Step 4，建立组件映射时 | 结构化的组件数据库，38 个组件条目，每条含 status/componentKey/states/variants/dimensions/tokens/fallback，是"这个组件到底存不存在"的权威数据源 |
| [design-tokens.json](design-tokens.json) | Step 5，需要具体数值时 | Color/Typography/Spacing/Radius/Shadow/Icon 的结构化 Token，每条含 value/status/source/verified |
| [missing-components.json](missing-components.json) | Step 4，命中 NOT_FOUND 时 | 已确认的组件缺口清单（Primary Button/Textarea/Checkbox未选中态等），含 fallback 和补充优先级 |
| [design-system-conflicts.json](design-system-conflicts.json) | 遇到组件实际实现和全局规范不一致时 | 已发现的 DESIGN_SYSTEM_CONFLICT 记录（如 NavBar 标题字号），新发现的冲突也要往这里追加 |
| [page.schema.json](page.schema.json) | Step 7，生成页面输出结构时 | 预留的 page.json 结构定义，为以后接 Figma Plugin 做准备，生成页面时按这个结构产出中间数据 |
| [interaction-adaptive-tokens.json](interaction-adaptive-tokens.json) | Step 5，遇到 `mobile-ui-rules.md` 标 `NOT_DEFINED` 的交互/自适应空白时 | 点击热区/hover-按下-禁用态/动效时长/滚动/键盘避让/任意宽度自适应，全部来自具名外部标准（Apple HIG / Material Design 3 / WCAG），标 `EXTERNAL_STANDARD`，**不是 BEP-S 自己的数据**，不影响 design-tokens.json 里任何视觉 Token |
| [icon-library.json](icon-library.json) | Step 5/7，需要一个 BEP-S 图标 COMPONENT_SET 没覆盖的图标时 | B端单色图标：字节跳动 IconPark（MIT License，免署名，2025-08 由 Ant Design Icons 换源）；金刚区图标：Solar Icons Bold Duotone（**CC BY 4.0，需署名**，用之前先看 icon-library.md 的署名要求），标 `EXTERNAL_STANDARD`，**禁止再用 AI 手绘近似图形冒充**，BEP-S 真实图标组件优先级仍然更高，这里只填空白 |
| [constraints.md](constraints.md) | **Step 5 取值前 + Step 8 检查时，必读** | 可执行约束表：冲突裁决优先级、6 类共 40+ 条带编号的硬约束（C-01…C-55）、交付自查清单、USER_OVERRIDE 登记。生成前用它确定取值顺序，生成后逐条打勾 |
| [ardot-mapping.md](ardot-mapping.md) | **在 Ardot 画布出稿时必读**（Step 7 的 Ardot 分支） | Figma → Ardot 落地映射：页面骨架、样式属性换算、色值 0–1 表、7 类组件的可直接粘贴代码、Variant→多节点、10 条高频偏移陷阱 |
| [qa/rules/rule-catalog.json](qa/rules/rule-catalog.json) | **Step 9.5 Design QA 必读** | 六大维度 32 条规则的模块化目录，每条含 specSource / requiredEvidence / severity / fixable，是自动校验的唯一规则清单 |
| [qa/qa.mjs](qa/qa.mjs) + [qa/README.md](qa/README.md) | **Step 9.5 执行入口** | 可执行的 Design QA 引擎：真值源加载、六大检查器、headless Chrome 实测、自动修复闭环、JSON/MD/HTML 三份报告 |

**推理层（.md 文件，讲清楚"为什么"和"怎么判断"，Registry 数据不够用或需要理解规则细节时读）：**

| 文件 | 什么时候读 | 内容 |
|---|---|---|
| [component-library.md](component-library.md) | 需要理解某个判断逻辑的完整来龙去脉时 | 组件命名消歧规则、SPEC_FRAME vs 真实组件的处理规则、组件替代关系表、逐组件的可执行决策规则——component-registry.json 的数据都是从这里提炼的 |
| [assets/empty-states/](assets/empty-states/) | Step 5/7，做空状态（缺省页）时 | **成品插画资产**：3 张已导出并抠好透明底的缺省插画（empty/record/search，225×195）+ `keyout.py` 白底抠除脚本 + `README.md`（其余 5 张的 nodeId 与导出步骤）。插画禁止外链，base64 内嵌 |
| [mobile-ui-rules.md](mobile-ui-rules.md) | Step 7，需要具体数值的完整上下文/来源说明时 | 移动端基础规范，逐项标注来源，未定义的明确写 NOT_DEFINED |
| [design-tokens.md](design-tokens.md) | 需要 Token 的完整来源说明/推算过程时 | 与 design-tokens.json 数据一致，多了叙述性的依据说明 |
| [page-patterns.md](page-patterns.md) | Step 2–3，需要一个页面类型的结构参考时 | 8 种常见移动端页面模板（结构仅供参考，不能强行套用）+ **实测页面范式**（2026-11 从品质巡检真实设计稿反推的 5 个范式 + 卡片解剖 + 9 条跨页面规律，数值级） |
| [html-prototype.md](html-prototype.md) | **Step 7C 必读**（凡输出 HTML、且屏幕数 ≥2 或需要点击走流程时） | 可点击 HTML 原型规范：单文件零依赖、Token→CSS 变量、多屏 hash 路由、**12 条交互契约**（逐条必须实现）、状态覆盖、mock 数据规范、禁止清单、组件→HTML 配方、交付说明模板、产品侧验收清单。参考实现 `examples/clickable-prototype/index.html` |
| [prd-to-prototype.md](prd-to-prototype.md) | **Step 0 必读**（输入是 PRD / 文档 / 大段需求描述时） | PRD 转译规范：需求卡八项、功能点→屏幕映射规则（拆/合判据）、屏幕清单表、主流程与状态清单、3 问 + 四列假设清单、**PRD 覆盖率核对表**、给产品的一页版 PRD 模板、6 条反模式 |
| [validation.md](validation.md) | Step 6/8，产出报告和检查结果时 | 检查清单 + 量化评分公式 |
| [interaction-adaptive-standards.md](interaction-adaptive-standards.md) | 需要理解交互/自适应外部标准的采用理由、置信度区分时 | 讲清楚为什么选了这几个来源、`EXTERNAL_STANDARD` 这个新可信度等级的使用规则，与 interaction-adaptive-tokens.json 数据一致 |
| [icon-library.md](icon-library.md) | 需要理解图标库选型理由、数据可信度、署名义务时 | 为什么选字节 IconPark（含从 Ant Design 换源的历史）、为什么金刚区选 Solar Icons（含三次否决其他候选的过程）、数据是怎么拉取验证的、**Solar Icons 的 CC BY 4.0 署名要求怎么落实** |
| [visual-design-reasoning.md](visual-design-reasoning.md) | **Step 1-3.5 必读，PR1/PR2页面尤其重要**，任何页面生成任务开始时 | AI Design Brain：完整的设计推理流程（Product Thinking→Page Role→Design Autonomy Level→Information Architecture→...→Design Critique），Page Role(PR1/PR2/PR3)和 Design Autonomy Level(L0-L4)的权威定义，User Attention Model，Layout Hypothesis（强制≥2方案），Composition Pattern 使用规则，Design Critique（A-L十二项，含VISUAL_DESIGN_WEAK判定），Design Quality Score（85分强制阈值）——这是"先做产品判断、再做设计判断、最后选组件"这条核心原则的完整展开，回答"组件都用对了为什么页面还是像拼装出来的" |
| [c-end-visual-design.md](c-end-visual-design.md) | Step 3.5 内，Page Role 是 PR1/PR2 时 | `visual-design-reasoning.md` 里 Visual Strategy 环节的具体规则库：背景与留白策略、首页焦点模块、活动页节奏编排、PR2页面编排规则、"组件拼装感"自诊断——这是执行细则，流程本身以 `visual-design-reasoning.md` 为准 |

## 页面生成流程

严格按顺序执行，不要跳步。**从 Step 4 开始，默认全程不调用 Figma MCP**——除非触发了上面架构章节列的四个例外条件之一，而且触发时要先告诉用户。

> ⚠️ **2025-08 架构调整（二次扩容为"AI Design Brain"）：这个流程现在遵守"先做产品判断，再做设计判断，最后选组件"**，不是"需求→查组件→拼组件→生成"。完整的设计推理流程定义在 [visual-design-reasoning.md](visual-design-reasoning.md)，下面 Step 1-3.5 是那份文件 Pipeline（第1节）在这个 Skill 里的具体落地——Step 4（组件映射）**是流程里第一个真正去查 `component-registry.json` 的环节，不是第一个要主动判断的环节**，前面几步已经把"这个页面该长什么样、AI 这次能改多少"想清楚了。**原型不是最终设计，原型只代表业务需求和功能集合**——AI 拥有信息架构和视觉设计的判断权，但没有删除业务能力的权力，这条边界贯穿下面所有 Step。

**Step 0：PRD / 原始需求 → 需求卡（2026-11 新增，输入是 PRD 时必经）** — 用户给的是 PRD、飞书文档、一大段需求描述、或"照着这个原型做"时，**先读 `prd-to-prototype.md` 做转译，不要直接开画**。这一步只产出四样东西，不写代码、不查组件：
1. **需求卡**（八项：业务目标 / 角色权限 / 屏幕清单 / 主流程 / 每屏内容块 / 数据字段 / 状态与边界 / 不在本期）——填不出来的标 `ASSUMPTION`，不许留空。
2. **屏幕清单表**（屏名 / 这一屏解决什么 / 对应 PRD 功能点 / 采用范式 P-1…P-5 / 怎么进来）——按"一个用户目标 = 一屏"拆分，不是"一个功能点 = 一屏"。
3. **主流程连线**（每条边写触发动作，至少一条异常分支，消灭断头路）+ 状态清单（逐屏标空/加载/失败/禁用/超长/无权限要不要）。
4. **最多问 3 个问题**（只问"不问就整屏会画错"的：角色权限、状态集合、是否必须对齐老系统），其余全写进四列假设清单（假设 / 依据 / 影响范围 / 要改改哪里）。

**红线**：PRD 里的功能点一个都不能丢——AI 有信息架构和视觉设计的判断权，没有删功能的权力。觉得该砍的只能标"建议弱化/合并 + 理由"，交产品拍板。缺失信息不许当"没这个需求"，要么做出来标假设，要么明确写"本期不做（待确认）"。

**Step 1：理解需求 + Product Thinking** — 用自己的话复述业务目标、目标用户、这个页面要解决什么问题。如果需求模糊（比如"做一个页面"没说做什么），先追问，不要瞎猜着往下走。**必须完成 Product Thinking 的四步产出**（`visual-design-reasoning.md` 第4节）：①业务目标；②用户目标（用户来这里最重要的任务）；③核心任务/核心CTA；④**功能优先级判断**——把原型里出现的每个功能点标注"前置/保持/弱化/合并"并写明理由。第④步是2025-08新增的，产出的功能优先级清单是后面 Information Architecture 重组（Step 3.5）的唯一权威依据，不能跳过。

**Step 2：分析页面类型 + Page Role 判断 + Design Autonomy Level 判断** — 这是列表页/详情页/表单页/搜索页/看板页/首页/设置页/空状态页，还是这几种的组合？参考 `page-patterns.md` 里最接近的模板，但**只作为结构参考起点**，不要因为模板里有某个模块就无脑加上去，模板里列的组件也必须过一遍 Component Availability Check（查 component-registry.json），不能假设模板提到的组件库里一定有。**结构定了之后，必须再对照 `page-patterns.md`「实测页面范式」节**（2026-11 新增）：匹配 P-1…P-5 中最接近的范式，把模块顺序、卡片 anatomy、分节标题行 h60、卡中卡、筛选胶囊选中态这些**实读数值与构图规则**落到方案里——这一步是把页面从"结构正确"做到"像真实产品"的关键（2025-08 二次实测确认：只套结构模板、不套实测范式，产出会明显偏离真实设计稿）。**同时判断 Page Role 是 PR1/PR2/PR3**（定义见 `visual-design-reasoning.md` 第2节：PR1=首页/Tab根页面/运营活动页，PR2=列表/详情/搜索/推荐/看板，PR3=表单/编辑/设置/操作）。**再判断 Design Autonomy Level 是 L0-L4**（2025-08新增，定义见`visual-design-reasoning.md`第3节）：按 Page Role 给默认值（PR1默认L3-L4，PR2默认L1-L2，PR3默认L0-L1），用户明确要求"严格按原型"时强制L0，用户也可以主动要求调高。**这两个判断共同决定 Step 3.5 要跑到什么深度**——Autonomy Level 越低，Step 3.5 内部能做的重组动作越少。

**Step 3：分析信息架构** — 把页面拆成模块清单，标出每个模块的信息层级（最重要的信息在哪、次要信息在哪、操作按钮在哪）。这一步产出的模块清单是 Step 3.5（PR1/PR2）或 Step 4（PR3）的输入。

**Step 3.5：Design Reasoning（设计推理，PR1/PR2 页面必经，PR3 直接跳到 Step 4）** — 这是核心步骤，2025-08 扩容后完整方法论见 `visual-design-reasoning.md` 第5-12节，内部依次产出：
1. **Information Architecture**（2025-08扩容，见`visual-design-reasoning.md`第5节）：对照 Step1 的功能优先级清单，判断原型的信息架构合不合理，Autonomy Level 允许的范围内可以合并/拆分/重新分类/调整顺序——**⚠️ 不管 Autonomy Level 多高，都要产出「业务能力保留核对表」**：原型每个功能点在新方案里能不能找到对应位置，找不到必须停下来跟用户确认，不能自己决定删除
2. **User Attention Model**：把模块清单归入 Primary Visual Focus（只能一个）/ Secondary Focus / Supporting Content / Functional Content 四层
3. **Visual Hierarchy**：决定什么最大/最重要/该弱化/该隐藏/该组合/该留白，依据 Step1 的功能优先级判断
4. **UX/UE Thinking**（2025-08新增，见`visual-design-reasoning.md`第8节）：用户任务路径顺不顺畅、首屏策略、高频/低频功能差异化处理、每个数据模块的空状态/异常态/加载态怎么处理
5. **Visual Strategy**：背景/密度/节奏策略，具体规则查 `c-end-visual-design.md`
6. **Layout Hypothesis**：**至少提出两个布局方案**（格式如"方案A：Hero→Category→Promotion→Product"），依据 Step 1 的业务目标选择其中一个并写明理由——**不允许跳过这一步直接开始画页面**
7. **Page Composition**：把选中的方案落成具体的 Composition Pattern 组合（清单见 `page-patterns.md`「Composition Patterns」章节，没有合适的就按规则新建一个并补进清单）
8. **Tab Intelligence**（2025-08新增，见`visual-design-reasoning.md`第9节）：如果 Page Composition 里出现 Tab，先判断"是否真的需要"（存在≥2个互斥且用户会主动筛选的分类维度才允许用），通过了才进 `component-library.md`「标签栏 Tab」查具体样式

这一步的完整产出（含业务能力保留核对表、未被选中的布局方案）要写进 Step 6 报告新增的 **Design Reasoning Summary** 部分，不能只交付最终方案。

**PR3 页面、或本次 Autonomy Level 在 L1 及以下时，跳过 1/3/4/5/6/7/8 子步骤，只保留信息架构的基础核对（业务能力保留核对表依然要做，这条不因 Autonomy Level 降低而免除），直接进 Step 4**——这不是偷懒，是正确答案（`visual-design-reasoning.md` 第1节）。

**Step 4：查 component-registry.json 建立组件映射** — ⚠️ 这一步要服务于 Step 3.5 确定的 Layout Hypothesis 和 Composition Pattern，不能反过来用"库里有什么组件"倒推构图（`visual-design-reasoning.md` 第16节，Component Reuse 是约束不是目标）。**选组件前先按`component-library.md`第0.5节 Component Intelligence 判断这个模块的语义意图**（比如这段信息是固定属性还是业务状态、是核心操作还是次要操作），再去匹配组件方向，不是看见一段内容就顺手配一个视觉相似的组件。对 Step 3/3.5 拆出的每个模块，去 `component-registry.json` 里按 `name`/`nameEn` 查有没有对应条目。这一步默认**不调用 Figma MCP**，Registry 里的 `status`/`states`/`variants` 字段就是权威数据。用「组件名称 + Figma真实名称(`componentKey`/`mainComponentId`) + 组件用途(`usage`) + 上下文」四维去匹配，不要只做字符串名字匹配（`component-library.md` 第1节的命名消歧规则仍然适用，尤其"标签栏"这类陷阱）。严格遵守"禁止相似组件魔改"——Registry 里某组件 `status` 是 `NOT_FOUND` 就是 `NOT_FOUND`，不能因为另一个视觉相似的组件是 `REMOTE_INSTANCE` 就顺手拿来顶替。**每个状态要单独核对 `states` 数组里的条目**，不能因为某个 state 是 `VERIFIED` 就假设兄弟 state 也是——Registry 里已经把这种情况标好了（例如 Checkbox 的 `选中`=`VERIFIED`、`未选中`=`NOT_FOUND`），直接读就行，不需要重新判断。如果 Registry 里彻底找不到这个组件（既不在 `components` 数组也不在 `missing-components.json`），这才是"Registry 缺少关键数据"的情形，触发架构章节的例外条件1，考虑是否需要调用 Figma MCP 补充（要先告诉用户）。

**Step 5：确定 Variant / State / Size** — 每个命中的组件，**先读它在 `component-registry.json` 里的 `visualRecipe` 字段**（2026-11 新增，含尺寸/圆角/填充/字级/状态/规则），有配方就直接照配方落值；配方没覆盖的再从 `variants`/`states`/`dimensions` 和 `design-tokens.json` 补齐。**不允许跳过 visualRecipe 自己"凭经验"推断尺寸和圆角**——历史两次翻车（搜索框做成卡片式圆角 4px、胶囊 Tab 选中态做成浅底）都是这一步跳过了配方。遇到交互行为/自适应类的空白（点击热区、hover/按下反馈、动效时长、滚动、键盘避让、超375px宽度适配）时，查找顺序是：`design-tokens.json`/`mobile-ui-rules.md` 里的 `NOT_DEFINED` → 查 `interaction-adaptive-tokens.json` 有没有对应的 `EXTERNAL_STANDARD` → 有就用（必须带上具体来源，比如"Apple HIG"）→ 都没有才退到纯 `AI_PROPOSED`。凡是取到 `status` 为 `INFERRED`/`EXTERNAL_STANDARD`/`AI_PROPOSED` 的值，记下来留到 Step 6 的报告里声明，三者不能混为一谈——`EXTERNAL_STANDARD` 有具名外部来源，`AI_PROPOSED` 没有，声明时要分开说。

**Step 5 补充：组合型模块查 `component-library.md` §6** — 有些模块是"多个真实组件的组合"而不是单一组件（最典型：详情页头部卡里的 **KV 信息块/卡中卡**，见 §6.35）。这类没有 registry 条目，但**同样有行级配方**（容器 px16 py12、行高 28、块内 gap 8、标签列 76、label-value 12）。用组合型模块时必须照 §6 的配方落值，不能因为"registry 里查不到"就自己估。**任何从设计稿反推的规格，必须记到行级四件套（容器 padding/radius、行高、块内 gap、子元素间距），只记容器级视为未完成**（约束 C-74，2026-11-04 因只记「p12 r8」漏掉行高，kv 行距从 36px 翻车到 60px）。

**Step 5 补充：需要空状态（缺省页）时查 `component-library.md` §6.17** — 8 个场景各有专属插画（通用无内容/记录为空/搜索无结果/网络异常/定位失败/未开通/建设中/维护中），**插画 225×195 必须透明底**。可直接复用 skill 自带资产 `assets/empty-states/`（3 张已抠好底），其余按 §6.17 的 nodeId 用 Dev Mode MCP 导出后跑 `assets/empty-states/keyout.py` 抠底。⚠️ Figma 导出的 PNG 自带不透明白底，不抠直接内嵌会在灰底页面出现白色方块（约束 C-97/C-98）。

**Step 6：产出报告（严格按这个顺序，代码之前先出这八块）** — 这是 2025-08 架构调整新增的强制顺序，目的是让用户在看到代码之前就能判断这次生成靠不靠谱：

1. **Design Reasoning Summary**（2025-08 二次扩容，对应 Step 1-3.5，**PR3页面/Autonomy Level≤L1这一部分可以简写**）：业务目标+功能优先级判断 + Page Role(PR1/PR2/PR3) + Design Autonomy Level(L0-L4，含理由) + **业务能力保留核对表**（原型功能点→新方案对应位置，逐条列出，找不到对应位置的要单独标出并说明） + Primary Visual Focus 是什么 + Layout Hypothesis 的至少两个方案（含未被选中的方案和选择理由）+ 用了哪些 Composition Pattern
2. **页面信息架构**（对应 Step 2-3 的结论）
3. **Component Mapping**（对应 Step 4，逐模块列出命中的 Registry 条目和 status）
4. **Design System Facts**（`DESIGN_SYSTEM_FACT`）：只列直接读自 Registry/Figma 的、可验证的事实，比如"Input = 60px 高（component-registry.json，verified）"
5. **AI Design Decisions**（`AI_DESIGN_DECISION`）：列出这次生成里所有属于你自己判断、不是 Figma 数据决定的取舍，比如"报修类型用选择触发行而不是胶囊单选，因为选项可能较多、且要跟同页面其他选择字段视觉统一"——**这两类必须分开列，不能混在一起说**，用户需要知道哪些是事实、哪些是你的设计判断
6. **Missing Components**：本次命中 `missing-components.json` 里哪些条目，或者本次新发现哪些组件缺口（新发现的要追加进 `missing-components.json`）
7. **Token 使用情况**：本次用到的 Token 清单，按 FOUND_IN_FIGMA/INFERRED/EXTERNAL_STANDARD/AI_PROPOSED 分组——`INFERRED`/`AI_PROPOSED` 必须带上"该值为 AI 建议值，并非当前设计系统正式规范"的声明；`EXTERNAL_STANDARD` 必须带上具体外部来源名称（如"Apple HIG""Material Design 3""WCAG"），同样不能说成是 BEP-S 正式规范，但也不用套用"AI建议值"这句话，因为它有具名出处，跟纯 AI 猜测不是一回事
8. **Validation 结果**：`validation.md` 的完整检查结果（见 Step 8 的检查项，这里是基于 Step 4-5 数据推算出的"设计方案自查"，不是对渲染结果的实测检查）——PR1/PR2页面这里还要预告 Step 8.5 会跑 Design Critique，不是这一步就能替代的

**Step 7：按输出形态产出页面** — 先确认交付形态，三种走不同分支，**规范取值完全相同**（都来自 Step 5 的 visualRecipe / tokens），差别只在落地方式：

- **7A. Ardot 画布（用户说"出个设计稿/画布/Ardot"，或当前会话已有画布文件）** → 必读 `ardot-mapping.md`，按其中的页面骨架、属性映射、色值换算表、组件代码片段搭建。关键点：文字必须显式设 `fills`；`fill_container` 要有 flex 父级；圆角/行高按配方；一个 Variant 状态画一个节点；高频组件用 `reusable:true` + `ref` 实例化。**建完后先跑 `capture_layout(problemsOnly:true)` 查溢出，再截图核对 `constraints.md` 第 7 节。**
- **7B. Figma（用户明确要求写入 Figma）** → 走 Step 9 的硬性规则，不在此展开。
- **7C. HTML（默认形态，可直接浏览器预览）** → **先按交付粒度分两种，别把"视觉稿"当"原型"交**：
  - **单屏视觉稿**（用户只要"看这一屏长什么样"）→ 按下面「7C 通用规则」产出即可。
  - **多屏可点击原型**（用户是产品/业务方，要拿去评审、演示、走流程；或屏幕数 ≥2；或需求里出现"点进去""跳转""弹层""流程"）→ **必须读 `html-prototype.md` 并逐条满足其 12 条交互契约**。硬性要点：单文件零依赖（断网可开）、375×812 手机壳居中、Token 全走 CSS 变量（页面内不许裸色值）、一屏一 `<section data-screen>`、hash 路由 + 浏览器后退可回上一屏、所有可点元素无死链、列表页必须有空态、mock 数据可改、附「能点通什么 / 没做什么 / 假设了什么」三段交付说明。**参考实现直接抄 `examples/clickable-prototype/index.html` 的骨架，不要从零写。**
  - **判断依据一句话**：这份东西对方会不会"点"？会点 → 原型；只"看" → 视觉稿。
  - 7C 通用规则（两种都要满足）：
    - 375px 移动端设计基准，用 `mobile-ui-rules.md` / `design-tokens.json` 里的间距和尺寸
    - 严格按 Step 6 报告里的 Component Mapping 来写，不能在写代码时又临时引入报告里没提到的组件或数值
    - 每个非真实组件（`status` 是 `SPEC_ONLY`/`AI_PROPOSED`/`NOT_FOUND` 的兜底实现）必须在 HTML 里用统一的方式明确标记，约定用注释+`data-bep-status`属性：`<!-- BEP-S: SPEC_ONLY，非真实Figma组件，按规范画板手工搭建 --><div data-bep-status="SPEC_ONLY" data-bep-component="Textarea">...</div>`，方便肉眼检查和以后写脚本批量扫描
    - 硬性红线（不可协商）：不得把 Input 拉高之后就在标记里写成 Textarea（`data-bep-component` 必须写 "Input(变形使用)"，不能写 "Textarea"）；不得把 Checkbox 的 Selected 状态当 Unselected 用；不得把 Secondary Button 当 Primary Button 用（配色/文案可以像，但 `data-bep-status` 必须诚实写 `AI_PROPOSED`/`SPEC_ONLY`，不能写 `REMOTE_INSTANCE`）
    - 同时产出一份符合 `page.schema.json` 结构的 `page.json` 数据（不需要写成独立文件，除非用户要求保存），为以后接 Figma Plugin 做准备
    - **硬性规则**：只要页面里用了 `icon-library.json` 的 `colorfulIcons`（金刚区图标，来源 Solar Icons，CC BY 4.0），⚠️2025-08更正：**不要**在生成的 HTML 页面里加可见署名文字（第一版这么做过，被用户否决——业务页面挂第三方素材署名不实用、不是行业惯例）。正确做法是在 Step 6/10 的报告里明确提醒一句"这个App需要有统一的开源软件声明页收录 Solar Icons 的署名（如果还没有的话）"，把署名义务讲清楚，但不要替业务方决定放在哪、怎么放——这是App级别一次性工程配置，不是每个生成页面自带的产出物。不能省略这条提醒，也不能等用户问了才补。

**Step 8：UI 规范检查** — 对照 `validation.md` 的全部检查项（组件检查/视觉检查/移动端检查 + 六项新增检查），**同时逐条过 `constraints.md` 第 7 节的交付自查清单**（P0 项不过必须改）。**如果 Step 7 走的是"多屏可点击原型"分支，还要再过一遍 `html-prototype.md` 第 11 节的验收清单**（断网可开、无死链、空态可达、弹层三种关法、无裸色值、无占位文案），这一步是**实测**（真的点一遍），不能只靠读代码判断。这次是对着 Step 7 实际产出的页面/画布复查一遍，不只是 Step 6 的"设计方案自查"，如果发现和 Step 6 报告不一致（比如写代码时手滑用错了 Token），要回去修正，保持两者一致。**这一步查的是"合规性"**（组件真不真实、Token对不对、圆角字号是否命中配方），不查"有没有设计感"，那是下一步的事。

> ⚠️ **2026-11 新增：Step 8 的人工清单保留，但不再是唯一检查**。设计输出之后必须继续执行 **Step 9.5 自动质量校验（Design QA）**，由 `qa/qa.mjs` 真实读取 Token / 组件库 / 约束表并在 headless Chrome 里渲染实测，不能只靠 AI 读代码自评。人工清单管"判断"，自动 QA 管"可程序化验证的事实"，两份都要有。

**Step 8.5：Design Critique（设计自评，2025-08 新增/二次扩容，PR1/PR2 页面必经，PR3 跳过）** — 对照 `visual-design-reasoning.md` 第17节的 A-L 十二项检查，这次查的是**设计质量**，跟 Step 8 的合规检查是两件独立的事、两份清单都要跑。重点是 **G 项模板检测**——页面是否退化成了 `White Background + Card + List + Divider + Button`，以及新增的 **H(CTA突出度)/I(Tab合理性)/J(Tag语义正确性)/K(无意义模块检测)/L(业务能力保留)** 五项。任意一项不通过：标记 `VISUAL_DESIGN_WEAK`，**回到 Step 3.5 重新调整 Layout Hypothesis 或 Page Composition**（不是回来改几个颜色/间距就当作修好了），重新生成后再跑一次 Step 8.5，直到通过或者能明确解释某一项在这个场景下为什么不适用。通过后按 `visual-design-reasoning.md` 第18节打 Design Quality Score（100分制），**⚠️ 低于85分是强制阈值，不是建议**——必须回到 Step 3.5 重新调整，不能只微调颜色/间距了事；这个分数和 `validation.md` 的 Overall UI Compliance Score 是两个独立分数，都要给用户看。

**Step 9：（可选）写入 Figma** — 只有用户明确要求落地到 Figma 时才做，见下方「写入 Figma 的硬性规则」。默认不做这一步。

**Step 9.5：Design QA 自动质量校验 + 修复闭环（2026-11 新增，强制）** — 设计输出之后、交付之前，必须跑 `qa/qa.mjs run --target <产物>`（详见下方「Design QA 自动质量校验工作流」）。流程是 **设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付**：六大维度逐条出结论 → 定位问题到文件/行/选择器 → 对照规范分析原因 → 只自动修复「可确定」问题（Token 替换 / 规范值归一 / 资产内联）→ 重新执行全套校验 → 输出 Design QA 报告。改业务逻辑、增删功能点、把虚构组件改名、调阈值降分一律禁止。

**Step 10：返回最终结果** — 把 Step 6 的报告（可能在 Step 8/8.5 有更新）连同 Step 7 的 HTML / 原型一起交付。**如果交付的是多屏可点击原型，必须再附 `html-prototype.md` 第 10 节的三段交付说明（怎么打开 / 这一版能点通什么 / 这一版没做 + 假设了什么）**——产品评审时最常问"这里点了怎么没反应"，提前写清楚比现场解释有效。不要只甩一个"完成了"，报告里的八个部分都要交代清楚，尤其 Missing Components 和 AI_PROPOSED 的声明不能省略；PR1/PR2 页面额外交付 Design Critique 结果和 Design Quality Score，如果 Step 8.5 触发过 `VISUAL_DESIGN_WEAK` 重做，要在报告里说明"第一版被自评打回过，重新调整了哪里"，不要把返工过程悄悄藏起来。**同时必须附 Step 9.5 生成的 Design QA 报告**（`qa/reports/*.qa.md` / `.qa.html`），并在交付说明里交代：总体状态、未解决问题、校验条件不足清单。存在 `BLOCKED` / `NOT CHECKED` 时只能说"已完成可校验部分"，不得说"校验全部通过"。

## Design QA 自动质量校验工作流（2026-11 新增，Step 9.5）

> 这一节是**在原流程之上加一层可执行校验**，不是替换 Step 8 / 8.5 / `validation.md`。Step 8 的人工合规清单、Step 8.5 的 Design Critique、Step 6 的八块报告全部保留，判据也全部沿用原有文件。新增的是：把能程序化验证的规则交给脚本，把"没检查"和"检查通过"严格分开。

### 一、流程位置

```
产品分析 → 信息架构设计 → UI 视觉设计 → 设计输出
        → 自动质量校验 → 问题修复 → 二次校验 → 最终交付
```

对应 Step 7（产出）→ **Step 9.5（QA）** → Step 10（交付）。交付时三样一起给：设计稿 / 原型、Step 6 报告、Design QA 报告。

### 二、六大校验维度（规则在 `qa/rules/rule-catalog.json` 模块化登记）

| 维度 | 校验内容 | 唯一判据来源 |
|---|---|---|
| R1 需求还原 | PRD 功能点覆盖率、是否擅自增删屏幕、需求卡八项、逐条落点 | `prd-to-prototype.md` §6、`constraints.md` C-93、`--prd` 需求卡 |
| R2 设计规范 | 颜色 / 字号 / 字重 / 圆角 / 行高 / 裸值 | `design-tokens.json`、`constraints.md` C-01…C-14、`html-prototype.md` §3 |
| R3 组件引用 | 组件是否真实存在、`data-bep-status` 是否诚实、NOT_FOUND 不得冒充、变形使用标注、Scripter 代码 | `component-registry.json`、`missing-components.json`、SKILL.md Step 7C 红线 |
| R4 组件使用 | 标签 tint 三档、已知冲突裁决、缺省插画外链 / 透明底、重复造轮子 | `constraints.md` C-04/C-97/C-98、`component-library.md` §6.3/§6.17、`design-system-conflicts.json` |
| R5 视觉还原 | 真实渲染非空、无溢出、与 Figma 参考图截图比对、原型不得当视觉基准、375×812 基准 | `mobile-ui-rules.md`、`page-patterns.md`、`visual-design-reasoning.md`、`prd-to-prototype.md` |
| R6 交互逻辑 | 死链、悬空跳转 / 弹层目标、12 条交互契约、空态、禁止清单、触摸热区 | `html-prototype.md` §4–§8/§11、`constraints.md` C-80/C-84、`interaction-adaptive-tokens.json` |

**任何规则都不得凭空编造标准**：每条规则在目录里都写了 `specSource`，指向本 Skill 既有文件。`interaction-adaptive-tokens.json` 的值标 `EXTERNAL_STANDARD`，只出 ADVISORY 提示，不当 BEP-S 硬性规则。

### 三、状态语义（不可协商）

`PASS` / `FAIL` / `WARNING` / `BLOCKED` / `NOT CHECKED`

- **PASS 守卫**：必须同时满足 `实检对象数 > 0` 且 `有证据记录`，否则强制降级成 `NOT CHECKED`。**没有实际检查的内容不得标记 PASS。**
- `BLOCKED`：规则需要的真值源 / 输入缺失或不可读（没有 `--prd`、没有 Figma 参考图、Chrome 不可用），本规则**未执行**。
- `NOT CHECKED`：规则能跑，但产物没携带可检查对象（静态视觉稿没有交互契约层、HTML 稿没有组件标注、非 Scripter 产物等），**实际未检查任何内容**。
- `FAIL`：有 P0/P1 违规；`WARNING`：只有 P2/ADVISORY。
- `canClaimPass`：只有 0 个 `BLOCKED` 且 0 个 `NOT CHECKED` 时为真。为假时交付话术只能说"已完成可校验部分"，**不能说"校验全部通过"**。

### 四、运行方式

```bash
# 完整闭环：校验 → 自动修复 → 二次校验 → 出报告
node qa/qa.mjs run   --target <产物.html|.js|page.json> \
  [--prd <需求卡.json>] \
  [--reference <figma.png> --reference-kind figma] \
  [--out <报告目录>]

node qa/qa.mjs check --target <产物>     # 只校验，不改产物
node qa/qa.mjs fix   --target <产物>     # 单轮修复 + 二次校验
node qa/qa.mjs selftest                  # 引擎自检
```

- `--prd` 缺失 → R1 四条规则全部 `BLOCKED`，不许伪装成"需求已覆盖"。
- `--reference` 必须是**真实 Figma 设计稿**，标 `--reference-kind figma` 才做截图比对；标 `prd-prototype` 时 R5-04 直接 `FAIL(P0)`——**产品原型只作需求依据，不得照搬布局与视觉**（C-95）。
- 产物类型自动识别：HTML 走完整 CSS + 浏览器实测；`page.json` 走结构化校验；Figma Scripter `.js` 走 `node --check` + `mkF`/`mkFT` 类型误用 + `componentKey` 合法性（含 2026-11 空白事故复盘规则）。
- 报告输出到 `qa/reports/`：`*.qa.json`（结构化）、`*.qa.md`（中文八章）、`*.qa.html`（可直接打开）。

### 五、自动修复闭环

1. 执行六大维度检查 → 2. 定位问题到「文件 + 行 + 选择器」→ 3. 对照 `specSource` 分析原因 → 4. **只修复可确定问题** → 5. 重新执行全套校验 → 6. 输出最终报告。最多 `maxIterations=3` 轮，本轮无进展即停。

**允许**（值必须来自真值源、语义不变）：`TOKEN_SUBSTITUTION`（裸色值/裸圆角 → 同名 `var()`）、`SPEC_VALUE_NORMALIZATION`（标签 tint 归一到 10%）、`ASSET_INLINING`（外链插画 → `assets/empty-states/` 同名透明底 PNG base64 内嵌）。

**禁止**：改业务逻辑或删/增功能点；新增删除屏幕或交互目标来消除悬空引用；把虚构组件改名成真实组件；调整阈值 / 评分 / 规则目录来降低失败数；把 `BLOCKED`/`NOT CHECKED` 改成 `PASS`。修复前写 `<产物>.bak`；每轮用规则目录 SHA 校验防篡改；不可自动修复的问题保留 `FAIL/WARNING` 并写明原因，**不得为了通过校验而降低设计要求**（例：底部弹层 r12 是 `design-system-conflicts.json` 已裁决的真实帧值，校验器必须放行，不许自动改回全局 8px）。

### 六、Design QA 报告（每次设计输出必出）

固定八章：①需求还原情况 ②设计规范符合情况 ③组件引用正确率 ④组件使用合规情况 ⑤视觉还原评估 ⑥交互逻辑完整性 ⑦发现的问题及修复记录 ⑧尚未解决的问题及原因。另附「校验条件不足清单」与「校验/修复迭代记录」。

每个问题固定六字段：**问题描述 / 问题位置 / 对应规范 / 严重程度 / 修复建议 / 校验结果**，另带 `fixable`、`fixApplied`。报告 schema 见 `qa/schema/qa-report.schema.json`。

### 七、扩展规则

新增规则只需两步：在 `qa/rules/rule-catalog.json` 登记 `id` / `dimension` / `severity` / `specSource` / `requiredEvidence` / `fixable`，再在 `qa/checkers/` 对应模块实现同名规则 ID。目录里登记了但没实现的规则会被自动标成 `NOT CHECKED`，**绝不会默默给一个 PASS**。

---

## 写入 Figma 的硬性规则（Step 9，可选步骤）

- 默认不执行这一步。只有用户明确说"写入 Figma"/"落地到 Figma"/"帮我建到 Figma 里"这类话才触发。
- **绝不修改 BEP-S 源组件库文件的原始画布/画板**（即「倩雯专用BEP-S组件」文件里的 Page 1 及其 45 个规范画板）。这是这个 skill 存在的前提，一旦违反，整个组件库的可信度就没了。
- 生成的页面必须写入**新页面（Page）或新文件**，与源组件库物理隔离。如果用户没有指定目标位置，先问清楚"新建在哪"，不要默认写进现有库文件。
- 调用 Figma 写入相关工具（如 `use_figma`）前，按该工具自身要求先加载对应的 Figma 使用技能（例如 `/figma-use`），这是 Figma MCP 的强制前置步骤，不属于本 skill 的可选项。
- 写入前先检查 Figma MCP 调用额度是否可用（可以用一次轻量的只读调用探测），额度不足时如实告诉用户，交付 Step 7 的 HTML/CSS 版本，不要反复重试浪费额度。

## Registry 更新机制（Figma 额度恢复、需要重新核实数据时）

- **不要重新扫描整个 Figma 文件**。只检查这次任务里发现的、Registry 缺失或用户明确要求重新验证的那部分数据。
- 核实到新数据后，同步更新 `component-registry.json` / `design-tokens.json` / `missing-components.json` / `design-system-conflicts.json`——更新方式是**合并**（新增/修正对应条目），不是整体重写文件、也不能删掉其他已经验证过的条目。
- 每次更新后，在被改动的条目里更新 `verifiedDate` 和 `verifiedFrom`，让 Registry 自己保留一份"这条数据是什么时候、怎么验证的"的痕迹。
- 如果验证结果和 Registry 里原有记录矛盾（比如以为 NOT_FOUND 的组件其实找到了），要更正条目并在 Step 6 的报告里说明"之前记录的结论有误，已更正"，不要悄悄改掉不说。

## 遇到不确定的情况怎么办

- 某个数值在 `mobile-ui-rules.md` / `design-tokens.md` 里标 `NOT_DEFINED`：不要编造，告诉用户"BEP-S 规范里未定义这个值，需要你确认"，可以给一个明确标注为"非 BEP-S 规范、行业通用参考值"的备选，但不能冒充是库里定义的。
- 某个组件在 `component-registry.json` / `missing-components.json` 里都没找到、`component-library.md` 的替代关系表也没覆盖：这属于"完全无法用已有组件实现"的情况，只有到这一步才允许新建，且新建部分仍要用 `design-tokens.json` 的 token，并在 Step 6 的 Missing Components 部分明确告诉用户"这是本次新建的部分，库里原本没有对应组件"，同时把这个新发现的缺口追加进 `missing-components.json`。
- 业务需求本身不清楚：先问用户，不要靠"移动端页面一般长这样"的经验去脑补需求。

### AI 不得自作主张（不可协商）

任何没有被 Figma 实际验证过的设计数据——不管是尺寸、间距、颜色、字重，还是"这个组件应该长这样"的判断——只要不是直接读自 Figma 的确认结果，就必须原样说出来："该值为 AI 建议值，并非当前设计系统正式规范"，不能含糊带过。具体禁止：

- 禁止把 `INFERRED` 的估算值写成好像是 `design-tokens.json` 里正式定义的 Token。
- 禁止把自己的判断包装成"BEP-S Token"「BEP-S Design Rule」「BEP-S Official Specification」这类措辞——这些词只能用在真正验证过的东西上。
- 如果确实需要一个库里没有的数值才能把页面做完整，必须标记为 `AI_PROPOSED`，并在报告里用这个标签明确列出来，不能悄悄混进正式规范的列表里。

这条规则的意义：用户依赖这份 skill 的报告去判断"这个设计到底有多少是真的、多少是我瞎编的"——一旦开始含糊其辞，整个 skill 存在的审计价值就没了。

`USER_OVERRIDE` 不受"必须声明是 AI 建议值"这条约束——它不是 AI 猜的，是用户直接下达的指令，直接当现行标准用就行，不需要加"该值为 AI 建议值"这种免责声明。但仍然要标清楚 `status: USER_OVERRIDE` 并保留 `originalFigmaValue`，让人知道这个值改过、原始 Figma 读值是什么，这是溯源要求，不是免责要求。
