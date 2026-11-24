# BeP Skill 迭代清单

> 用于记录从 Claude 创建的 BeP skill 转入 Codex 使用后，对 skill 规范、组件实现和参考文档的修改。后续修改按日期追加。

---

## 2026-11-19

### AI 设计质量校验机制（Design QA）

- 新增质量验收层：设计输出 → 六维自动校验 → 自动修复 → 二次校验 → 报告 → 最终交付。
- 六大维度：D1 需求还原 / D2 设计规范 / D3 组件引用 / D4 组件使用 / D5 视觉还原 / D6 交互逻辑；五态 `PASS / FAIL / WARNING / BLOCKED / NOT CHECKED`，未实际检查的不得标 PASS。
- 自动化依据全部动态解析自现有资产（`qa-basis.js`）：140 个组件函数、330 个图标、93 个公开组件、design-tokens.md Token，并与 BEP_C 实现值做自洽校验；不硬编码新标准。
- 复用 `validate-page.js`（891 行）作为 D4 执行层证据，不重写、不重复实现。
- 缺 PRD → D1 记 BLOCKED；缺 Figma 真源 → D5 记 BLOCKED；语义判断层（需求误解/像素还原/交互形态）记 NOT CHECKED，诚实不造假。
- 自动修复闭环：确定性机械替换（如 PingFang TC→SC），修复后自动二次校验，幂等（实测验证）；不改业务逻辑、不降设计要求。
- 报告：`pages/<模块>/dist/design-qa-<页面>.md` + `.json`，含 8 部分与每问题 6 字段。
- 修正误报：组件变体展示页的自定义画布（CANVAS_W/H）降为 WARNING；颜色检测限定"颜色上下文"，避免把示例数据（如库存 '999999'）误判为色值。

涉及文件：
- `scripts/tools/design-qa.js`（新增主编排器）
- `scripts/tools/qa/*.js`（新增 9 个规则模块）
- `references/design-qa.md`（新增机制说明）
- `SKILL.md`（工作流/详细规范/验收清单/项目结构集成）
- `agents/openai.yaml`（default_prompt 加入 Design QA）
- `references/iteration-log.md`

---

## 2026-08-05

### 文本域 Textarea 标准组件

- 基于 Figma 真源 `BeP Admin Kit Sketch V1.1.0 1 / node 0:974 / 文本框-Default` 补充文本域。
- 明确文本域是输入框体系的多行变体，公开入口为 `bepTextarea(placeholder, width, height, opts)`。
- 支持默认尺寸 `682×134`、占位文字、已输入多行文本、字数统计、右下 `Line/Field` 可拉伸图标。
- 状态按普通输入框规则谨慎继承：default、complete、hover、disabled、error；focus/readonly 不公开。
- 新增标准样例 `pages/textarea/variants.js`。
- 校验器补充 `bepTextarea` 参数检查，并拦截页面内自造 Textarea 替身。

涉及文件：
- `scripts/bep-components.js`
- `pages/textarea/variants.js`
- `SKILL.md`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`

### 描述列表 value 类型样例入口补齐

- 将已存在的 `pages/description-list/value-types.js` 纳入 `SKILL.md` 样例索引，作为详情页描述列表 value 类型的优先参考。
- 明确该样例覆盖：
  - 普通文本 value。
  - 内容 + 标签 value。
  - 纯标签 value。
  - 单链接 / 多链接 value。
  - 附件 value。
  - 图片 / 视频 value。
- 校验器新增描述列表边界检查：
  - 详情页描述信息不得页面内手写 label/value、链接、附件、标签或媒体 value 结构。
  - 描述列表 value 类型不得自造 `DescTag / DescLink / AttachmentRow / MediaThumb` 等局部替身。
  - 业务页面直接调用 `bepDesc*` 子组件但未使用 `bepDescriptions` 时给 warning，优先通过 `bepDescriptions` 数据字段承载。

涉及文件：
- `SKILL.md`
- `scripts/tools/validate-page.js`
- `references/iteration-log.md`

### 树形扩展样例入口补齐

- 将已存在的树形扩展样例纳入 `SKILL.md` 样例索引：
  - 复杂树形：`pages/tree-complex/variants.js`。
  - 树形选择器：`pages/tree-select/variants.js`。
  - 复杂树形选择面板：`pages/tree-complex-picker/variants.js`。
- 当前三类树形扩展闭环状态：组件库入口、组件文档、中文术语、Scripter 规则、RAG 真源、RAG 样例、样例页、校验器均已覆盖。
- 使用边界维持不变：
  - 普通层级展示用树形组件。
  - 页面左侧业务树管理用复杂树形。
  - 输入框触发选树用树形选择器。
  - 大型弹窗/浮层内树选择用复杂树形选择面板。

涉及文件：
- `SKILL.md`
- `references/iteration-log.md`
- `scripts/tools/validate-page.js`

---

### 指标数据卡片 MetricCard 标准组件

- 基于三个数据看板真源归纳：`BeP Admin Kit Sketch V1.1.0 1 / node 87:62585、87:64392、87:67004`。
- 明确只将 KPI 摘要、侧栏小指标沉淀为指标数据卡片（`bepMetricCard`）；完整图表、排行榜、表格、新闻列表不并入该组件。
- 新增公开入口 `bepMetricCard(opts)`，支持标题、主数值、单位、BeP 图标、趋势项和轻量迷你图占位。
- 更新数据看板模板：KPI 摘要必须使用 `bepMetricCard`，图表容器后续单独沉淀。
- 后续状态：图表容器已在“图表容器模块级组件补充”中公开为 `bepChartCard`。
- 新增标准样例 `pages/metric-card/variants.js`。
- 校验器补充：禁止页面自造 `makeMetricCard / buildMetricCard`，并限制未公开状态。

涉及文件：
- `scripts/bep-components.js`
- `pages/metric-card/variants.js`
- `SKILL.md`
- `references/components-layout.md`
- `references/page-templates.md`
- `references/component-glossary.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `scripts/tools/validate-page.js`

---

### 警告提示 Alert 标准组件

- 基于 Figma 真源 `BeP Admin Kit Sketch V1.1.0 1 / node 704:28544 / 警告提示 Alert` 补充标准组件。
- 新增公开入口 `bepAlert(title, desc, opts)`，与全局提示 `bepMessage`、提醒弹窗 `bepAlertModal` 区分。
- 支持 `info / success / warning / error` 四类语义，`danger` 作为 error 别名兼容。
- 支持普通形态 `variant:'normal'`（默认 680×40）和大号形态 `variant:'large'`（默认宽 959，高 82；带 actions 高 104）。
- 支持右侧关闭图标和大号形态操作链接。
- 新增标准样例 `pages/alert/variants.js`。
- 校验器补充 `bepAlert` type/variant 检查，并拦截页面手写块状 Alert。

涉及文件：
- `scripts/bep-components.js`
- `pages/alert/variants.js`
- `SKILL.md`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/rag/source-index.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `scripts/tools/validate-page.js`

---

### 全局提示 Message 标准组件

- 读取 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1 / node 704:28544 / 全局提示 Message`。
- 明确同一 Figma 节点中包含两个组件：`全局提示 Message` 与 `警告提示 Alert`；本次只闭环 Message，Alert 后续单独补充。
- 修正 `bepMessage` 公开类型：`info / success / error / loading`；`danger` 作为失败别名兼容旧页面，`warning` 不作为 Message 推荐类型。
- 补齐 loading 形态：白底悬浮卡片、最小宽度 106px、`Line/Loading` 图标节点命名 `LoadingRotating`。
- 新增全局提示标准样例 `pages/message/variants.js`。
- 校验器补充：页面不得自造 `makeMessage`；`bepMessage(..., 'warning')` 提示改用警告提示（`bepAlert`）。

涉及文件：
- `scripts/bep-components.js`
- `pages/message/variants.js`
- `SKILL.md`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `scripts/tools/validate-page.js`

---

## 2026-08-04

### 表单/详情抽屉框架

- 读取 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1 / node 705:28548 / 抽屉 Drawer`。
- 补齐 `bepDrawer` 表单/详情边界：`variant:'form'` 默认显示底部取消/确定按钮；`variant:'detail'` 默认不显示底部按钮，只保留右上关闭；显式 `showFooter` 优先。
- 统一宽度规格：420 / 640 / 800。
- 修正抽屉高度规则：抽屉高度固定等于窗口高度；长内容表现为内容区滚动，不拉高抽屉。
- 修正内容起点：标题栏 56px 内含底部分割线，内容 y = 80。
- 修正底部操作区：高 52px，按钮 y=10，右边距 16，按钮间距 8。
- 修正抽屉根结构：使用完整画布 overlay，抽屉面板作为右侧子节点，不再以左侧遮罩宽度作为根节点。
- 新增抽屉标准样例 `pages/drawer/variants.js`，覆盖 800/640 表单抽屉和 420 详情抽屉。

涉及文件：
- `scripts/bep-components.js`
- `pages/drawer/variants.js`
- `SKILL.md`
- `references/components-layout.md`
- `references/page-layouts.md`
- `references/page-templates.md`
- `references/rag/source-index.md`
- `scripts/tools/validate-page.js`

---

## 2026-07-31

### 组件规范 TODO 处理流程

- 调整组件规范补充流程：补组件规范时如果发现 Figma 真源、状态数值、交互规则或内容约束未确认，必须先列出 TODO 缺口给用户确认。
- 用户未补充前，不得把 TODO 静默写入组件文档当作完成；该组件文档应视为待补充。
- 页面生成仍遵守不编造原则；涉及未确认状态时只能使用已明确规则，并在交付说明中提示缺口。

涉及文件：
- `SKILL.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`

---

### 输入框组件文档补齐

- 按组件文档完整性规则补齐输入框（`bepInput`）的样式属性、状态交互、内容约束、使用场景、禁止事项和参数/API。
- 明确输入框默认高 32px、默认宽 200px、圆角 r=2、白底、黑色 15% 描边、占位文字黑色 25%、左内边距 12px。
- 明确输入框只用于自由文本输入；下拉、单日期、日期区间、数字输入框必须分别使用对应标准组件，不得用输入框近似。
- input/filled、hover、focus、disabled/readonly 状态保留 TODO，待 Figma 真源确认；错误态由表单项（`bepFormItem`）统一承载。

涉及文件：
- `references/components-core.md`
- `references/iteration-log.md`

---

### 按钮组件文档补齐

- 按组件文档完整性规则补齐按钮（`bepButton`）的样式属性、状态交互、内容约束、使用场景、禁止事项和参数/API。
- 明确按钮宽度由文字实际宽度 + 左右 padding 16px 反推，默认高度 32px，圆角 r=4。
- 明确 `primary / secondary / primary-outline / danger / text` 的使用场景；表格操作列继续禁止使用按钮，必须用操作列（`bepActionCell`）。
- hover、active、focus、disabled、loading 和 28px 紧凑场景保留 TODO，待 Figma 真源确认，不编造状态值。

涉及文件：
- `references/components-core.md`
- `references/iteration-log.md`

---

### 单日期组件公开登记

- 将组件库已有的 `bepDate(placeholder, width, height)` 正式公开为 BeP 标准组件，中文名为“单日期”。
- 同步更新 `SKILL.md` 速查表、组件中文命名表、基础组件规则和 Scripter 标准调用清单。
- 筛选区 `filter.type` 新增 `date`，对应渲染单日期（`bepDate`）。
- 明确单个日期字段使用单日期（`bepDate`），日期范围字段使用日期区间（`bepDateRange`），不得用输入框或日期区间近似单日期。
- 修正弹窗示例中的旧宽度 `400`，统一为当前 Modal 宽度规格 `420 / 640 / 800`。

涉及文件：
- `SKILL.md`
- `references/component-glossary.md`
- `references/components-core.md`
- `references/components-layout.md`
- `references/filter-rules.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`

---

### 时间轴标准组件

- 按 Figma 真源 `BeP Admin Kit Sketch V1.1.0 / node 700:27656` 将时间轴沉淀为正式标准组件 `bepTimeline`。
- 新增基础样式和带描述样式，支持 `success / error / processing / end / default` 状态点，以及 `solid / dashed` 连接线。
- 明确操作记录、审核记录、库存流水、价格变更历史等动态记录必须使用时间轴，不得在页面脚本中手写 `TimelineItem`、`LogRow`、圆点或连线。
- 新增时间轴组件文档、中文术语表、RAG 索引和已校验样例 `pages/timeline/variants.js`。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/scripter-rules.md`
- `references/component-glossary.md`
- `references/page-templates.md`
- `references/rag/source-index.md`
- `references/rag/page-cases.md`
- `references/iteration-log.md`
- `scripts/bep-components.js`
- `pages/timeline/variants.js`

---

### BeP 图标强制引用规则

- 新增铁律：图标必须使用 BeP 图标（`bepIcon`），页面脚本禁止手绘图标、禁止自定义 SVG、禁止注入 `BEP_ICONS`。
- 引用不到图标时必须先提出缺失图标和候选替代；确认后补进 `scripts/bep-components.js` 和 `references/icons.md`，再用于页面生成。
- 更新 `references/scripter-rules.md` 和 `references/icons.md`，移除旧的页面业务图标内联 SVG / `Object.assign(BEP_ICONS, {...})` 方案。
- 校验器新增拦截：页面注入 `BEP_ICONS`、本地图标 SVG 映射、内联 SVG 字符串、未定义 BeP 图标 key 均报错。

涉及文件：
- `SKILL.md`
- `references/scripter-rules.md`
- `references/icons.md`
- `references/iteration-log.md`
- `scripts/tools/validate-page.js`

---

### 内置 RAG 参考层

- 新增 BeP skill 内置 RAG 参考层，入口为 `references/rag/README.md`。
- 明确 RAG 只做检索和参考，不是第二套规范；最终裁决顺序为 `SKILL.md` 铁律、组件文档、组件库实现、校验器优先于 RAG。
- 新增 `references/rag/source-index.md`，记录 Figma 真源摘要、已校验样例、历史样例和正式规则位置。
- 新增 `references/rag/page-cases.md`，沉淀商品详情页、详情页描述列表、普通列表页等判断案例。
- 商品详情页案例明确：有对象标题摘要且“商品信息 / 操作记录”控制整页主内容时，必须使用页头标题型内置 Tabs，不得拆成对象标题摘要 + 卡片内页签。

涉及文件：
- `SKILL.md`
- `references/rag/README.md`
- `references/rag/source-index.md`
- `references/rag/page-cases.md`
- `references/iteration-log.md`

---

### 组件中文命名表

- 新增 `references/component-glossary.md`，作为 BeP skill 内置的团队组件术语表。
- 术语表记录中文组件名、英文函数名、层级、用途和易混淆项，供共享给同事时统一沟通口径。
- `SKILL.md` 的沟通命名规则补充指向该术语表；这属于团队协作规范，不作为个人 memory 存放。

涉及文件：
- `SKILL.md`
- `references/component-glossary.md`
- `references/iteration-log.md`

---

### 对话组件命名规则

- 新增沟通命名规则：与用户讨论 BeP 规范、组件选择、页面结构时，默认使用中文组件名。
- 组件首次出现、涉及修改、涉及校验或需要精确指向代码 API 时，使用“中文组件名（`英文函数名`）”。
- 只有在代码、校验器、文件 API、函数签名中，才单独使用英文函数名。

涉及文件：
- `SKILL.md`
- `references/iteration-log.md`

---

### 对象标题内置 Tabs 与卡片内 Tabs 判定

- 新增 Tabs 使用判定：当前页面应用对象标题摘要，且 Tabs 控制整个页面主内容时，使用 `bepHeaderTitle.tabs`。
- 当前页面应用对象标题摘要，但 Tabs 只控制某个内容卡片内部时，使用 `bepCardTabs`。
- 当前页面不应用对象标题摘要时，只能使用 `bepCardTabs`，不得为了放 Tabs 单独套 `bepHeaderTitle`。
- 明确 `bepObjectTitle` 本体不直接暴露 Tabs 参数；对象标题内置 Tabs 由 `bepHeaderTitle` 承载。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/iteration-log.md`

---

### 对象标题摘要组件拆分

- 新增复合组件 `bepObjectTitle`，用于表达“图片 + 主标题 + 状态 + 标签 + 副标题”的对象标题摘要。
- `bepHeaderTitle` 调整为模块组合：`bepObjectTitle` + 可选右侧操作按钮 + 可选标题型 Tabs。
- 明确 `bepObjectTitle` 不包含右侧操作、Tabs、页头容器或系统页面打开机制，避免后续页面脚本手写对象摘要结构。
- 同步更新组件文档和 Scripter 标准调用清单。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `scripts/bep-components.js`

---

### 页头系统模式语义

- 新增页头系统模式规则：BeP 系统级页头打开机制只能二选一，`TopBar + Breadcrumb` 或 `TopBar + PageTabs`，同一个系统不得混用。
- 明确 `bepTitleBar` 当前是 BreadcrumbBar 的旧名：用于下钻路径展示；平级页面覆盖当前页，不保留上一个页面。
- 明确 `bepTabs` 当前是 PageTabs 的旧名：用于多页签工作台模式；平级/下级页面打开都新增页面页签，并保留上一个页面页签。
- 明确 `bepHeaderTitle` 不是第三种系统打开机制，而是在上述任一系统页头模式下方增加的业务对象标题摘要模块。
- 修正页签语义边界：`bepTabs` 不得用于“待处理/已完成/全部”等业务状态或业务视图切换。
- 本次仅写入规则和语义，不改函数命名，避免破坏现有脚本。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/iteration-log.md`

---

### 页头标题型无 Tabs 底部间距

- 修正 `bepHeaderTitle` 无 Tabs 形态高度：标题、标题+操作按钮两种组合在主标题行下方自动保留 24px 底部内边距。
- 有 Tabs 形态保持原规则：标题行与 Tabs 间距 16px，Tabs 作为组件底部区域。
- 同步更新 `references/components-layout.md`，避免页面生成时靠手动外边距弥补组件内部间距。

涉及文件：
- `references/components-layout.md`
- `scripts/bep-components.js`

---

### 组件规范完整性模板

- 新增全局规则：每个 BeP 标准组件必须同时包含样式属性、状态交互、内容约束、使用场景四类信息。
- 明确不得只记录静态视觉样式；hover、active、focus、disabled、selected、error、loading、open/close、expanded/collapsed 等状态按组件适用性补齐。
- 未经 Figma 真源确认的状态不得编造数值，必须保留 TODO。
- 新增统一组件文档模板，后续新增/修改组件必须同步补文档；只改 `scripts/bep-components.js` 不改文档视为未完成。

涉及文件：
- `SKILL.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`

---

### 组件分层与单独绘制收口

- 明确 BeP 组件按“原子组件 → 复合组件 → 模块 → 模板”组织，页面脚本只负责业务数据、布局摆放和标准组件调用。
- 页面脚本禁止直接 `figma.create*` 绘制节点；已有标准组件必须直接调用，缺组件先补 `bep-components.js`。
- 校验器新增页面原生绘制拦截，并拦截 `makeBtn / makeSidebarItem / makeTableCell / makeTag / makeStatCard` 等疑似局部标准组件替身。
- 组件库内部收口：`bepFilterGrid` 内部 Frame 创建改走 `bepFrame`，描述列表固定宽 value 文本改走 `bepTableText`。
- 将 `pages/contract-management/list.js` 补充列入待同步历史样例，避免误当当前模板。

涉及文件：
- `SKILL.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`

---

### 页头标题型组件

- 按 Figma 真源 `凤凰会后台 / node 1044:10445` 新增组件 `bepHeaderTitle`，组件命名为“页头标题型”。
- 支持四种组合：标题、标题+操作按钮、标题+Tabs、标题+操作按钮+Tabs；操作按钮和 Tabs 均可按具体需求显示/隐藏。
- 标题摘要区位于标准 `bepHeader` 下方，不替代 TopBar/TitleBar；详情页内容 Card 位置需按该组件实际高度后移。
- 操作按钮复用 `bepButton`，并为描边主按钮补充 `primary-outline` 类型；标题型 Tabs 内置于组件，不复用页头页签或卡片内页签样式。
- 新增样例 `pages/header/title-type.js` 覆盖四种组合。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/page-templates.md`
- `references/scripter-rules.md`
- `scripts/bep-components.js`
- `pages/header/title-type.js`

---

### 页头页签 bepTabs 样式重读

- 按 Figma 真源 `BeP Admin Kit Sketch V1.1.0 / node 0:1459` 重写 `bepTabs`。
- 修正旧实现问题：不再使用固定 90px tab、不再使用默认态透明、不再使用选中态下划线。
- 新规则：页头页签为 32px 高白色标签胶囊，r=4，左右 padding 16px，文字与关闭图标 gap=4px；选中态只改文字和关闭图标为主色。
- 左右翻页按钮改为 32×32 白底 r=4，带 `0 0 2 rgba(0,0,0,0.10)` 阴影。
- 同步区分 `bepTabs` 与 `bepCardTabs` 的 Figma 真源和样式边界。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `scripts/bep-components.js`

---

### 详情页描述分组与 Card 关系

- 新增详情页分组关系规则：存在多个描述分组时，先判断业务亲近关系，再决定同卡片或拆卡片。
- 相近分组放入同一个页面级 Card，用一个 `bepDescriptions` 的多个 `sections`；亲近关系弱的分组拆成独立页面级 Card。
- 明确不得机械照搬编辑页锚点分区，也不得把弱相关信息强行塞进同一个描述列表。
- 本次只修改文档规则，不修改组件实现。

涉及文件：
- `SKILL.md`
- `references/page-templates.md`
- `references/components-layout.md`

---

### TopBar 系统切换已选态颜色

- 修正 `bepTopBar` 中“业务系统切换”的文字颜色：该字段是已选值，不是 placeholder，使用 `rgba(0,0,0,0.85)`。
- 同步更新 `references/components-layout.md` 页头规范。

涉及文件：
- `references/components-layout.md`
- `scripts/bep-components.js`

---

### 描述列表 value 类型扩展

- `bepDescriptions` 补充 `tags / link / links / attachments / media` value 类型，仍保持 `label + value` 单一信息结构。
- 新增 `bepDescLink`、`bepDescLinks`、`bepDescTags`、`bepDescAttachments`、`bepDescMedia`，页面脚本不再手写描述列表内的标签、链接、附件、图片/视频结构。
- 明确已有固定组件必须复用：描述列表标签由 `bepDescTags` 调用 `bepTag`，图标由 `bepIcon` 调用。
- 修正图标文档：附件使用组件库实际存在的 `Line/Paperclip`，移除未实现的 `Fill/Document`。
- 同步更新 `SKILL.md`、`references/components-layout.md`、`references/scripter-rules.md`。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/scripter-rules.md`
- `references/icons.md`
- `scripts/bep-components.js`

---

### 描述列表色阶与分组分割线

- `bepDescriptions` label 色阶调整为黑色 45%，value 色阶调整为黑色 85%。
- 描述列表分组间距调整为 `24px + 1px 分割线 + 24px`；分割线黑色 10%，图层名 `SectionDivider`。
- 同步更新 `references/components-layout.md` 与 `scripts/bep-components.js`。

涉及文件：
- `references/components-layout.md`
- `scripts/bep-components.js`

---

### 创建规范更新工作副本

- 从 `bep-admin-ui-brand` 复制出 `bep-admin-ui-brand-next`。
- 旧目录保留为备份；后续 BeP 规范更新优先在 next 目录内进行。
- 更新 `SKILL.md` 元数据，避免与旧 skill 同名。

涉及路径：
- `/Users/dajuweizhong/Documents/Codex/skills/bep-admin-ui-brand`
- `/Users/dajuweizhong/Documents/Codex/skills/bep-admin-ui-brand-next`

---

## 2026-07-31

### Card 圆角、操作列、Modal 宽度与样例同步

- 页面级 Card 圆角统一为 `r=4`；`bepCard` 内容卡片组件同步为 `r=4`。
- Modal 宽度规格统一为 `420 / 640 / 800`。
- 冻结列方向统一：左侧冻结列使用 `BEP_SHADOW_FREEZE_LEFT`，阴影落在当前列右侧；右侧冻结列使用 `BEP_SHADOW_FREEZE_RIGHT`，阴影落在当前列左侧。
- 操作列改为父级复合列规则：第 1/2/3 位操作分别统计实际数据最大宽度，父级列宽由子级列宽之和与间距组成；新增 `bepActionMetrics(actionRows)`，`bepActionCell(actions, {slotWidths})` 支持按统一子级列宽渲染。
- 明确 `bepText` 与 `bepTruncText` 区别：表格单元格统一用固定宽度截断文本，数值右对齐使用 `bepTruncText(..., {alignH:'RIGHT'})`。
- 同步 `pages/hr/list.js` 与 `pages/form-demo/form-demo.js`，两者已通过当前 `build + validate-page`；其他历史样例在 `SKILL.md` 中标记为待同步。

涉及文件：
- `SKILL.md`
- `references/page-layouts.md`
- `references/page-templates.md`
- `references/components-core.md`
- `references/components-layout.md`
- `references/design-tokens.md`
- `references/scripter-rules.md`
- `references/advanced-table-rules.md`
- `scripts/bep-components.js`
- `pages/hr/list.js`
- `pages/form-demo/form-demo.js`

### 文字策略与表单字段标题

- 新增 `bepTableText` 作为表格单元格固定宽文字入口；保留 `bepTruncText` 作为兼容旧名。
- 明确 `bepText` 用于自适应文字：模块标题、页面标题、分组标题、表单字段标题、描述列表字段标题、按钮文字和临时测量。
- 表单字段标题强制固定为 8 个汉字 + 必填星号宽度；超过 8 个汉字必须要求产品/业务简化，不自动扩宽、换行或截断。
- 表格列宽由表头和数据最宽文本反推；不可截断字段、数值列、操作列均按完整内容反推列宽。

### 校验器同步

- `validate-page.js` 支持 `bepTableText` / `bepTruncText` 两个合规表格文字入口。
- 操作列宽校验支持 `bepActionMetrics(actionRows).width + 32`。
- 数值列校验不再把 SKU 编码当作数值列。
- 新增表单字段标题 8 字上限校验；超过 8 个汉字直接报错。

---

## 2026-07-29

### 原型数据源、页面类型映射与视觉语义

- 新增全局铁律：字段必须对齐原型数据源和页面类型，不得把提示文案、规则说明、校验说明包装成业务字段。
- 标准工作流新增“确认数据源和目标页面类型”：如果原型同时存在编辑页、查看页、列表页，必须优先使用目标页面类型对应的原型结构。
- 详情页模板新增规则：编辑页锚点结构不得机械套到详情页；详情页应按查看语义重组字段。
- 描述列表新增颜色规则：普通字段默认使用 `bepDescriptions` 内置 label/value 色阶，不手写灰蓝色或透明度。
- 表格新增颜色规则：普通内容使用 BeP 默认正文色；只读不是自动弱化理由；编辑态输入/校验视觉不得搬到详情页只读表格。

涉及文件：
- `SKILL.md`
- `references/page-templates.md`
- `references/components-layout.md`

---

## 2026-07-02

### Skill 存放目录整理

- 将 BeP skill 真实目录迁移到独立 skills 根目录：`/Users/dajuweizhong/Documents/Codex/skills/bep-admin-ui-brand`。
- 更新全局入口 symlink：`/Users/dajuweizhong/.codex/skills/bep-admin-ui-brand` 指向新的真实目录。
- 原日期归档目录下的 BeP 真实目录已移除，避免把项目归档目录误认为 skill 源目录。

涉及路径：
- `/Users/dajuweizhong/Documents/Codex/skills/bep-admin-ui-brand`
- `/Users/dajuweizhong/.codex/skills/bep-admin-ui-brand`

### 抽屉底部操作栏

- 已被 2026-08-04 的抽屉框架规则替代：当前抽屉高度固定为 `canvasH`，footer y = `canvasH - 52`。
- 修正 `bepDrawer` 底部操作栏定位：底部操作栏必须固定在抽屉最下方，不得跟随内容高度上移。
- 固定规则：footer y = `drawerH - 52`；上方分割线 y = `drawerH - 53`。
- 同步补充组件规范说明，后续所有抽屉生成必须遵守。

涉及文件：
- `references/components-layout.md`
- `scripts/bep-components.js`

## 2026-06-30

### Skill 蒸馏清理

- 删除冗余 `references/quick-reference.md`，以 `SKILL.md` 中的速查表作为唯一入口。
- 将 `quick-reference.md` 中仍有价值的 `BEP_C.secondary`、`W` 常量补回 `SKILL.md`。
- 修正 `references/scripter-rules.md`：模板统一使用 `pageFrame`，新增组件流程改为同步 `SKILL.md` 速查表和相关 references。

涉及文件：
- `SKILL.md`
- `references/scripter-rules.md`
- `references/quick-reference.md`

### 所有表格通用规则

- 写入表格总宽计算规则：表格宽度由屏幕尺寸和页面布局决定，1440 标准页面当前为 `TABLE_W = 1152`。
- 统一基础表格与高级表格列宽规则；高级表格只在基础表格上增加业务能力，不拥有另一套列宽算法。
- 明确表头和数据行高度均为 48；多级表头高度为 80，上层 40 + 子列 40。
- 明确单元格左右内边距为 16 + 16；无特殊要求时单元格内容不得换行。
- 明确 Checkbox 列固定 48。
- 修正操作列规则：不再固定 136，改为根据内容自适应；最多 3 个操作，超过 3 个时第 3 个变为更多；该版本的操作位排布已于 2026-07-31 被“按第1/2/3位分别统计子级列宽”的复合列规则替代。
- 明确序号、编码/工号、日期、状态 Tag、电话不是固定预设宽度，而是按最大内容宽计算，默认不参与弹性。
- 保留既有弹性列、文本截断、超宽表格冻结规则。
- 将高级表格中的 Figma 列宽标为示例参考，不再作为生成固定列宽。

涉及文件：
- `SKILL.md`
- `references/page-layouts.md`
- `references/advanced-table-rules.md`
- `references/components-layout.md`
- `references/quick-reference.md`
- `references/design-tokens.md`
- `references/scripter-rules.md`
- `scripts/bep-components.js`

## 2026-06-29

### Card Tabs

- 补齐卡片内 Tabs 规范：统一使用 `bepCardTabs(tabs, activeIdx, CARD_W)`。
- 写入官方样式：容器高 54px、左右内缩 24px、底部分割线、选中态 `#006D9B` 下划线。
- 明确 Card 内 Tabs 必须贴卡片顶部，Tabs 上方不放返回、摘要、当前系统等额外区块。
- 明确 `bepTabs` 仅用于页头，`bepCardTabs` 仅用于内容卡片内部。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `references/page-templates.md`
- `scripts/bep-components.js`

### 详情页重复导航

- 明确 Header 已包含面包屑时，Card 内不再重复放“返回上一页”入口。
- 只有用户明确要求双入口时，才允许保留 Card 内返回。

涉及文件：
- `references/page-templates.md`
- `references/components-layout.md`

### 描述列表

- 补齐 `bepDescriptions` 规范。
- 描述项先区分短文本和长文本。
- 1440 标准画布默认三列，每列 384px。
- 短文本按 2/3/4 列自动流入。
- 长文本独占整行，超长内容换行，不截断。
- 支持 `items`、`long:true`、`type:'long'`、`span`。

涉及文件：
- `SKILL.md`
- `references/components-layout.md`
- `scripts/bep-components.js`

### 页面级 Card 阴影

- 明确页面级 Card 默认无阴影。
- 只有弹窗、抽屉、冻结列、悬浮层，或用户明确要求强调层级时，才允许使用阴影。
- 禁止把弹窗/浮层阴影复用到普通页面内容卡片上。

涉及文件：
- `SKILL.md`
- `references/page-layouts.md`
- `references/components-layout.md`

### 高级表格规范

- 新增 `references/advanced-table-rules.md`。
- 登记 BeP `7.Business/2.Table  Advanced高级表格` 组件族。
- 写入以下高级表格类型：
  - 带表头功能表格
  - 可设置表格
  - 可拖拽表格
  - 有内联操作的表格
  - 多层级展开表格
  - 折叠面板展开表格
  - 折叠面板展开表格备份
  - 快速新增表格
  - 快速新增表格备份
  - 多级表头表格
- 明确表头筛选、列设置、拖拽、内联操作、树状层级、折叠详情、快速新增、多级表头等场景不得按普通表格自由拼装。

涉及文件：
- `SKILL.md`
- `references/advanced-table-rules.md`
- `references/components-layout.md`
- `references/page-templates.md`
- `references/quick-reference.md`

### 树状表格规范合并

- 确认 BeP 只存在一个树状表格规范，不再区分“简单树”和“高级树”。
- 将早期 `bepTreeRow` 视为高级树状表格规范前身，并合并为唯一入口。
- `bepTreeRow` 升级为 BeP 唯一树状表格行实现：
  - 一级行白底
  - 二级/三级子级行 `#F5F7FA`
  - 子级底色整行贯通 checkbox、内容列、操作列
  - 展开/折叠图标按 Figma 真源改为 16×16
  - 缩进按真源：一级 icon x=16、text x=40；二级 icon x=32、text x=56；三级 text x=72
  - 字符串单元格使用 `bepTruncText`
  - 新增 `opts.treeCol`，支持 checkbox 列后的树状名称列
- 修正此前错误记录：高级树状表格子级不是透明底，而是 `#F5F7FA`。

涉及文件：
- `SKILL.md`
- `references/advanced-table-rules.md`
- `references/components-layout.md`
- `references/quick-reference.md`
- `references/icons.md`
- `scripts/bep-components.js`

### 页面模板选型

- 新增“详情页（卡片内页签）”模板。
- 新增“高级表格页”模板。
- 快速选型表补充：
  - 权限点/菜单/树状业务表格 → 高级表格页
  - 表头筛选/拖拽/快速新增/多级表头 → 高级表格页
- 明确“左侧树导航 + 右侧普通表格”和“表格本身是树状业务数据”不是同一模板。

涉及文件：
- `references/page-templates.md`

### 图标规范

- 修正树状表格展开/折叠箭头尺寸：从 12×12 改为 16×16。
- 保留面包屑、分页等小场景 12×12 图标规则。

涉及文件：
- `references/icons.md`
- `references/advanced-table-rules.md`
- `references/components-layout.md`

### 速查表

- 表格速查中补充高级表格读取规则。
- `bepTreeRow` 参数更新为 `bepTreeRow(cells, cols, tableW, level, state, bgColor, opts)`。
- 说明 checkbox 列后接树状名称列时传 `{treeCol:1}`。

涉及文件：
- `SKILL.md`
- `references/quick-reference.md`

### 按钮 Figma 真源补充

- 登记按钮 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:1803` / `基础-按钮`。
- 明确 `HighLight` 在按钮规范中按 `highlight/高亮态` 表达。
- 确认类型映射：`Primary` = 主按钮、`Frame` = 主描边按钮、`Secondary` = 次按钮、`Danger` = 危险按钮、`Dashed` = 虚线按钮、`Text` = 文字按钮。
- 补充 hover、高亮态、28/32/36 尺寸、图标按钮、加载态的规范记录。
- 已扩展 `bepButton` 公开 API：支持 `dashed`、`iconKey`、`iconOnly`、`loading`、`disabled`、`state:'highlight'`。

涉及文件：
- `references/components-core.md`

### 按钮公开 API 扩展

- `bepButton(label, type, height, opts)` 保持旧调用兼容，并新增第四参数 `opts`。
- `type` 新增 `dashed`。
- `opts` 新增：
  - `iconKey`：按钮内 BeP 图标 key。
  - `iconOnly`：纯图标按钮，宽高相等。
  - `loading`：加载态，内置 `Line/Loading`。
  - `disabled`：禁用态。
  - `state:'hover'|'highlight'`：生成静态 hover / 高亮态样例。
- 修正 design token 中按钮圆角旧值：按钮 r=4。
- 新增按钮样例页用于覆盖公开 API。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `references/components-core.md`
- `references/scripter-rules.md`
- `references/design-tokens.md`
- `references/iteration-log.md`
- `pages/button/variants.js`

### 按钮 Disable、按钮组与校验补充

- 修正此前按钮 Disable 态读取遗漏：Primary / Danger / Frame / Secondary / Dashed / Text 均按 Figma Disable 行定义，不再使用统一禁用近似。
- 明确 Focus 含义：Focus 是键盘焦点态；当前按钮 Figma 真源未提供独立 focus 外圈，页面生成不得自行编造。
- 补充按钮尺寸图标规则：28/32/36px 按钮图标均为 16px，图标与文字 gap 均为 4px。
- loading 自动视作 disabled，不允许点击；静态稿使用 `Line/Loading`，节点命名 `LoadingRotating`，交互/前端实现中旋转。
- 新增按钮组（`bepButtonGroup`）公开组件，用于筛选区、弹窗底部、页头操作和工具栏。
- 筛选区展开/收起明确为例外：文字按钮 + 右侧箭头图标，使用 `iconPosition:'right'`，不得手写局部结构。
- 明确业务页面默认不生成 `state:'hover'|'highlight'` 静态态，除非用户明确要求特殊状态。
- 补充按钮文案规则：不得使用 `查 询`、`重 置` 等空格撑宽写法。
- 修正已校验表单样例中的旧按钮文案：`重 置 / 取 消 / 保 存` 改为 `重置 / 取消 / 保存`。
- 校验器新增：
  - 纯图标按钮必须传 `iconKey`。
  - 业务页面使用按钮 hover/highlight 静态态给 warning。
  - 按钮文案用空格撑宽给 error。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/filter-rules.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `pages/button/variants.js`
- `pages/form-demo/form-demo.js`

### 输入框 Figma 真源与公开 API 补充

- 登记输入框 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:887` / `输入框`。
- 确认输入框状态：`Default / Hover / Disable / Complete / Error`；未发现独立 Focus、Readonly、多行输入。
- `bepInput(placeholder, width, height, opts)` 保持旧调用兼容，并新增第四参数 `opts`：
  - `value`：已输入文字，文字黑色 85%。
  - `state:'hover'|'complete'|'error'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景、黑色 15% 描边。
  - `error` / `errorText`：错误态，危险色描边、异常图标和错误说明。
  - `prefixText` / `suffixText`：前缀、后缀或单位。
  - `suffixIconKey`：右侧提示图标，必须引用 BeP 图标库。
  - `clearable`：有值时显示清除图标。
- 新增组合输入框（`bepInputGroup`）公开组件：左侧选择器 + 右侧输入框。
- 明确组合输入框的下拉展开面板属于下拉菜单（Dropdown）能力，不在组合输入框内手写。
- 校验器新增：
  - `readonly:true` 报错，因 Figma 真源未公开 readonly。
  - 业务页面使用输入框 hover 静态态给 warning。
  - `suffixIconKey` 不存在于 BeP 图标库时报错。
- 新增输入框样例页并通过构建和静态校验。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `pages/input/variants.js`

### 数字输入框 Figma 真源与公开 API 补充

- 登记数字输入框 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:863` / `数字输入框`。
- 确认数字输入框状态：`Default / Hover / Complete / Complete-Hover / Disable / Abnormal`。
- 将中文标准名统一为“数字输入框”，英文 API 保持 `bepInputNumber`，旧调用 `bepInputNumber(value, width, height)` 继续兼容。
- `bepInputNumber(value, width, height, opts)` 新增第四参数 `opts`：
  - `state:'hover'|'complete'|'complete-hover'|'error'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景、黑色 15% 描边。
  - `error` / `errorText`：异常态，危险色描边、异常图标和错误说明。
  - `prefixText` / `suffixText`：前缀、后缀或单位。
- 新增组合数字输入框（`bepInputNumberGroup`）公开组件：左侧选择器 + 右侧数字输入框。
- 明确组合数字输入框的下拉展开面板属于下拉菜单能力，不在组合数字输入框内手写。
- 数字输入框步进器图标改为 Figma 真源图标：上箭头 `Line/PutAway-Arrow`，下箭头 `Line/DropDown-Arrow`；异常图标使用 `Fill/Abnormal`。
- 校验器新增：
  - `readonly:true` 报错，因 Figma 真源未公开 readonly。
  - 业务页面使用数字输入框 hover/complete-hover 静态态给 warning。
- 新增数字输入框样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `pages/input-number/variants.js`

### 选择器 Figma 真源与公开 API 补充

- 登记选择器 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:791` / `数据录入-选择器`。
- 确认单选选择器状态：`Default / Hover / Complete / Complete-Hover / Selected / Disabled`。
- 确认多选选择器状态：`Default / Hover / Complete / Selected / Disabled`，已选项以 Tag 呈现。
- 确认下拉菜单状态：选项 `default / hover / selected / disabled`，支持 `暂无数据`。
- 将中文标准名统一为“选择器”，英文 API 保持 `bepSelect`，旧调用 `bepSelect(placeholder, width, height)` 继续兼容。
- `bepSelect(placeholder, width, height, opts)` 新增第四参数 `opts`：
  - `value`：已选择文案，文字黑色 85%。
  - `state:'hover'|'complete'|'complete-hover'|'selected'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景，整体 opacity 0.5。
- 新增多选选择器（`bepMultiSelect`）公开组件：已选项用选择器内置 Tag + `Fill/Close`。
- 新增下拉菜单（`bepDropdown`）公开组件：用于选择器展开浮层；页面不得手写下拉选项行。
- 选择器图标改为 Figma 真源图标：收起状态 `Line/DropDown-Arrow`，展开/Selected 状态 `Line/PutAway-Arrow`。
- 校验器新增：
  - `readonly:true` 报错，因 Figma 真源未公开 readonly。
  - 业务页面使用选择器 hover/selected/open 静态态给 warning。
- 新增选择器样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `pages/select/variants.js`

### 日期选择器 Figma 真源与公开 API 补充

- 登记日期选择器 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:674` / `日期选择器`。
- 确认单日期状态：`Default / Hover / Complete / Complete-Hover / Disabled`；Figma 内部拼写 `Complere` 按规范统一为 `Complete`。
- 确认日期区间状态：`Default / Hover / Complete / Complete-Hover / Disabled`。
- 将日期面板和日期区间面板沉淀为标准组件：`bepDatePickerPanel(opts)`、`bepDateRangePanel(opts)`，页面不得手写日历格、星期行、双月面板。
- `bepDate(placeholder, width, height, opts)` 新增第四参数 `opts`：
  - `value`：已选择日期，文字黑色 85%。
  - `state:'hover'|'complete'|'complete-hover'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景、黑色 15% 描边。
  - `clearable`：有值时显示清除图标。
- `bepDateRange(width, height, opts)` 新增第三参数 `opts`：
  - `start/end`：起止日期，完成态文字黑色 85%。
  - `state:'hover'|'complete'|'complete-hover'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景、黑色 15% 描边。
  - `clearable`：起止日期都有值时显示清除图标。
- 日期输入 hover/complete-hover 描边按 Figma 真源使用 `#338AAF`；选中日期块使用主色 `#006D9B`。
- 校验器新增：
  - `readonly:true` 报错，因 Figma 真源未公开 readonly。
  - 业务页面使用单日期/日期区间 hover/complete-hover 静态态给 warning。
- 新增日期选择器样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/iteration-log.md`
- `pages/date/variants.js`

### 时间选择器 Figma 真源与公开 API 补充

- 登记时间选择器 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `696:27649` / `时间选择器`。
- 确认单时间状态：`Default / Hover / Complete / Complete-Hover / Disabled`。
- 确认时间区间状态：`Default / Hover / Complete / Complete-Hover / Disabled`。
- 将时间面板和时间区间面板沉淀为标准组件：`bepTimePickerPanel(opts)`、`bepTimeRangePanel(opts)`，页面不得手写时/分/秒列、选中行、分割线、滚动条或确认按钮。
- `bepTime(placeholder, width, height, opts)` 新增公开组件：
  - `value`：已选择时间，文字黑色 85%。
  - `state:'hover'|'complete'|'complete-hover'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景、黑色 15% 描边。
  - `clearable`：有值时显示清除图标。
- `bepTimeRange(width, height, opts)` 新增公开组件：
  - `start/end`：起止时间，完成态文字黑色 85%。
  - `state:'hover'|'complete'|'complete-hover'`：组件样例或明确特殊状态使用。
  - `disabled`：禁用态，黑色 4% 背景、黑色 15% 描边。
  - `clearable`：起止时间都有值时显示清除图标。
- 时间控件图标使用 BeP 图标库已有 `Line/Clock`；补充图标文档登记。
- 筛选区 `filter.type` 新增 `time` 和 `timerange`，分别渲染时间选择器和时间区间。
- 校验器新增：
  - `readonly:true` 报错，因 Figma 真源未公开 readonly。
  - 业务页面使用时间选择器/时间区间 hover/complete-hover 静态态给 warning。
- 新增时间选择器样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/filter-rules.md`
- `references/icons.md`
- `references/iteration-log.md`
- `pages/time/variants.js`

### 日期时间选择器 Figma 真源与公开 API 补充

- 登记日期时间选择器 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:689` / `日期时间选择器`。
- 确认单日期时间状态：`Default / Hover / Complete / Complete-Hover / Disabled`；Figma 内部拼写 `Complere` 按规范统一为 `Complete`。
- 确认日期时间区间状态：`Default / Hover / Complete / Complete-Hover / Disabled`。
- 确认输入框默认：单日期时间默认占位为 `请选择日期`，完整态示例为 `2022/04/23 00:00:00`；日期时间区间默认占位为 `选择日期时间 至 选择日期时间`。
- 将日期时间面板和日期时间区间面板沉淀为标准组件：`bepDateTimePanel(opts)`、`bepDateTimeRangePanel(opts)`，页面不得手写月历、时间列、快捷范围、分割线、此刻或确认按钮。
- 新增公开组件：
  - `bepDateTime(placeholder, width, height, opts)`：支持 `value/state/disabled/clearable`。
  - `bepDateTimeRange(width, height, opts)`：支持 `start/end/state/disabled/clearable`。
  - `bepDateTimePanel(opts)`：月历 + 时/分/秒三列 + 此刻/确定。
  - `bepDateTimeRangePanel(opts)`：快捷范围 + 月历 + 时/分/秒三列 + 确定。
- 筛选区 `filter.type` 新增 `datetime` 和 `datetimerange`，分别渲染日期时间选择器和日期时间区间。
- 校验器新增：
  - `readonly:true` 报错，因 Figma 真源未公开 readonly。
  - 业务页面使用日期时间选择器/日期时间区间 hover/complete-hover 静态态给 warning。
- 新增日期时间选择器样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/filter-rules.md`
- `references/iteration-log.md`
- `pages/date-time/variants.js`

### 小尺寸按钮左右边距修正

- 修正按钮宽度规则：28px 小尺寸按钮左右 padding 为 8px；32/36px 按钮左右 padding 为 16px。
- 28px 小尺寸按钮无论纯文字、图标+文字，均按左右 8px 计算宽度。
- 保持按钮图标规则：28/32/36px 按钮图标均为 16px，图标与文字 gap 均为 4px。

涉及文件：
- `scripts/bep-components.js`
- `references/components-core.md`
- `references/iteration-log.md`

### 开关 Figma 真源与公开 API 补充

- 登记开关 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:710` / `开关 Switch`。
- 确认开关尺寸：大号 `48×26`、中号 `42×22`、小号 `30×16`；带文字和 loading 只使用中号。
- 确认状态：开启、关闭、禁用、loading、带文字；Figma 真源未公开 hover/focus/active，不自行编造。
- `bepSwitch(isOn, labelOn, labelOff, opts)` 补充公开参数：
  - `size:'large'|'middle'|'small'`：默认中号。
  - `disabled:true`：整体 opacity 50%，不可操作。
  - `loading:true`：圆点内使用 BeP 图标 `Line/Loading`，节点名 `LoadingRotating`。
  - `showText:true`：内部显示固定文字 `开/关`。
- 校验器新增：
  - 页面内 `make/build*Switch` 作为标准组件替身时报错。
  - `readonly:true` 报错，只读二元状态应使用描述列表或状态标签。
  - `state` 参数报错，开关不公开 hover/focus/active。
- 新增开关组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/switch/variants.js`

### 评分 Figma 真源与公开 API 补充

- 登记评分 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:710` / `评分 Rate`。
- 新增 BeP 图标 `Fill/Star`，用于评分实心星；评分组件不得用 `Line/star` 或页面内 SVG 近似。
- 确认评分样式：5 颗星，单颗星 `16×16`，星间 gap 4px，星组与文字 gap 16px，组件高度 22px。
- 确认颜色：选中星 `#FFA645`，未选中星 `#CCCCCC`，右侧评价文字黑色 85%。
- 新增公开组件 `bepRate(value, opts)`：
  - `value`：整数分值，默认 3，限制在 `0..count`。
  - `count`：默认 5；非 5 星场景必须由业务明确要求。
  - `text`：右侧评价文字；真源只确认“一般”，其他文案来自业务数据或用户明确给定。
  - `showText:false`：隐藏右侧评价文字。
- Figma 真源未公开 hover/focus/disabled/readonly/half；校验器对 `state/disabled/readonly/half` 参数报错。
- 新增评分组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/icons.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/rate/variants.js`

### 单选组 / 多选组 Figma 真源与公开 API 补充

- 登记单选组 / 多选组 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `695:27648` / `单选框 Radio + 多选框 CheckBox`。
- 修正单选基础选中态：白底 + 主色描边 + 主色内点；不再使用主色整圆 + 白点。
- 单选组（`bepRadioGroup`）补充：
  - option 支持 `{label, value, state, disabled}`。
  - 第三个参数兼容旧 gap 数字；对象参数支持 `gap/disabled/state`。
  - 支持按钮样式：`{ variant:'button' }`，宽度由文字宽度 + 左右 padding 32px 反推。
- 多选组（`bepCheckboxGroup`）补充：
  - option 支持 `{label, value, state, disabled}`。
  - 第三个参数兼容旧 gap 数字；对象参数支持 `gap/disabled/state`。
  - 选中对勾必须调用 BeP 图标 `Line/check`。
- 校验器新增：
  - 页面内 `make/build*Radio`、`make/build*Checkbox` 作为标准组件替身时报错。
  - `readonly/loading/indeterminate` 等未公开状态报错。
  - 业务页面静态展示 `hover` 状态给 warning，组件样例页 `radio-checkbox` 例外。
- 新增单选组 / 多选组组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/radio-checkbox/variants.js`

### 上传 Figma 真源与公开 API 补充

- 登记上传 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:825` / `2.DataEntry/12.Upload上传`。
- 将上传沉淀为组件族，不再只保留旧上传按钮：
  - 上传按钮（`bepUploadBtn`）：边框按钮，使用 `Line/upload`，不再使用 primary + `Line/upload-cloud`。
  - 点击上传（`bepUploadClick`）：上传按钮 + 格式/大小提示。
  - 上传条（`bepUploadFileRow`）和上传文件列表（`bepUploadFileList`）：支持 `default/uploading/hover/error`。
  - 拖拽上传（`bepUploadDragger`）：虚线拖拽区域 + 上传云图标 + 主/辅说明。
  - 图片上传（`bepImageUpload`）：支持 `default/hover/uploading/success/success-hover/error/error-hover`。
- 图标统一使用 BeP 图标库：`Line/upload`、`Line/upload-cloud`、`Line/Paperclip`、`Line/Loading`、`Line/Download`、`Line/Trash`、`Line/Add`、`Line/zoom-in`。
- 校验器新增：
  - 页面内 `make/build*Upload` 作为标准组件替身时报错。
  - 上传组件 `readonly/disabled` 未公开时报错。
  - 业务页面静态展示 hover 态给 warning，组件样例页 `upload` 例外。
- 新增上传组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/upload/variants.js`

### 步骤条 Figma 真源与公开 API 补充

- 登记步骤条 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `700:27657` / `3.DataDisplay/10.Steps步骤条`。
- 将步骤条沉淀为一个公开组件 `bepSteps(steps, currentIdx, totalWidth, opts)`，支持：
  - 基础横向：`{ variant:'basic' }`。
  - 带描述横向：`{ variant:'description' }`。
  - 竖式步骤条：`{ variant:'vertical' }`。
- 保留旧调用兼容：旧的 `bepSteps(steps, currentIdx, width)` 继续可用；当步骤含 `desc` 时默认使用带描述形态，否则使用基础形态。
- 明确状态只由 `currentIdx` 自动推导：已完成、当前、待处理；Figma 真源未公开 hover/focus/disabled。
- 明确步骤条用于分步流程/阶段进度，动态记录仍必须使用时间轴（`bepTimeline`）。
- 校验器新增：
  - 页面内 `make/build*Step(s)` 作为标准组件替身时报错。
  - `state/hover/focus/disabled` 等未公开参数报错。
  - `variant` 只允许 `basic/description/vertical`。
- 新增步骤条组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/steps/variants.js`

### 标示 / 标签 Figma 真源与公开 API 补充

- 登记标示 / 标签 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `697:27652` / `3.DataDisplay/5.Tag标示`。
- 扩展公开组件 `bepTag(label, type, style)`，支持：
  - 底色标示：`style:'solid'`。
  - 边框标示：`style:'outline'`，默认形态。
  - 点标示：`style:'dot'`。
  - 动态标签：`style:'closable'` 或 `{ closable:true }`。
  - 添加标签：`style:'add'` 或 `{ add:true }`。
- 明确状态色类型：`disabled/inactive`、`info`、`success/enabled`、`warning`、`danger`。
- 动态标签关闭图标使用 BeP 图标 `Fill/Close`；添加标签图标使用 `Line/Add`。
- 校验器新增：
  - 页面内 `make/build*Tag` 作为标准组件替身时报错。
  - `type` 只允许 `enabled/disabled/info/success/warning/danger/inactive`。
  - `style` 只允许 `outline/solid/dot/closable/add`。
  - `state/hover/focus/loading` 等未公开参数报错。
- 新增标示 / 标签组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/tag/variants.js`

### 分页器 Figma 真源与公开 API 补充

- 登记分页器 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `1390:26247` / `分页器`。
- 扩展公开组件 `bepPagination(totalText, current, pages, pageSize, opts)`，支持：
  - 完整分页：总数 + 页码 + 每页条数 + 跳页。
  - 无跳页：`{ showJump:false }`。
  - 仅页码：`{ showPageSize:false, showJump:false }`。
  - 翻页禁用态：`disabledPrev/disabledNext`。
- 修正旧图标引用：上一页 / 下一页统一使用 BeP 图标 `Line/chevron-left` / `Line/chevron-right`，不得手绘箭头。
- 校验器新增：
  - 分页器 `state/hover/focus/loading` 等未公开参数报错。
- 新增分页器组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/pagination/variants.js`

### 标准表格 Figma 真源与公开 API 补充

- 登记标准表格 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:988` / `数据展示-表格`。
- 保留现有组合式表格 API，不新增总表格包装函数：
  - 表头行：`bepTableHeader(cols, tableW, opts)`。
  - 普通数据行：`bepTableRow(cells, cols, tableW, bgColor, opts)`。
  - 操作列：`bepActionMetrics(actionRows)` / `bepActionCell(actions, opts)`。
  - 空状态：`bepEmptyState(tableW)`。
- 扩展表头行和普通数据行支持迷你表格：`{ size:'mini' }`，行高 40px，左右 padding 12px；默认表格保持 48px 和左右 padding 16px。
- 明确标准表格内容约束：表格文字必须使用固定宽表格文字；数值列右对齐；操作列不得硬编码列宽；基础表格不得近似树表格或高级表格。
- 新增标准表格组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `references/components-layout.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/table/variants.js`

### 树状表格 Figma 真源与公开 API 补充

- 登记树状表格 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:353` / `多层级展开表格`。
- 明确树状表格唯一公开入口为 `bepTreeRow(cells, cols, tableW, level, state, bgColor, opts)`：
  - `state:'expanded'` 使用 BeP 图标 `Fill/Arrow-Open`。
  - `state:'collapsed'` 使用 BeP 图标 `Fill/Arrow-PutAway`。
  - `state:'leaf'` 不显示图标但保留图标占位。
- 明确层级缩进：每级 16px，图标 16px，图标与文字 gap 8px；根节点白底，二级/三级子行 `#F5F7FA` 整行贯通。
- 明确 checkbox 列边界：Figma 真源包含 checkbox 列，但本轮不公开单个 checkbox 单元格；业务页面不得手写 checkbox，后续需要时单独补充。
- 校验器新增：
  - `bepTreeRow` 状态只允许 `expanded/collapsed/leaf`。
  - 页面内 `TreeRow/TreeNode/makeTree*` 等局部树状结构替身时报错。
- 新增树状表格组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/tree-table/variants.js`

### 其他高级表格 Figma 真源与公开 API 补充

- 登记高级表格 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:89` / `高级表格`。
- 在基础表格之上补充高级表格公开入口：
  - 高级表头行：`bepAdvancedTableHeader(cols, tableW, opts)`，用于筛选/排序等表头图标能力。
  - 多级表头：`bepMultiLevelTableHeader(cols, tableW)`，用于 `rowSpan:2` 与分组列 `children`。
  - 表格多选框：`bepTableCheckbox(checked, opts)`，表格 checkbox 列专用，避免页面手写勾选框。
  - 表格拖拽柄：`bepTableDragHandle()`，图标统一使用 BeP `Line/Drag`。
  - 表格展开面板：`bepTableExpandPanel(tableW, items, opts)`，行展开内容属于当前表格，不单独做 Card。
  - 表格快速新增行：`bepQuickAddRow(tableW, opts)`，表头下方首行状态，内部复用 Dashed Button。
- 扩展按钮 `bepButton` 支持 `opts.width`，用于全宽虚线按钮时保持图标和文字居中。
- 校验器新增高级表格手写替身检查。
- 新增其他高级表格组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/advanced-table-rules.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/advanced-table/variants.js`

### 提醒弹窗 / 对话框 POP Figma 真源与公开 API 补充

- 登记提醒弹窗 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `704:28546` / `对话框 POP`。
- 新增公开组件 `bepAlertModal(title, message, opts)`，与通用弹窗 `bepModal` 区分：
  - `type:'danger'`：删除/不可恢复操作，图标 `Fill/Fail`，确认按钮为危险按钮。
  - `type:'warning'`：禁用/停用等警示操作，图标 `Fill/Abnormal`，确认按钮为主按钮。
  - `type:'info'`：退出编辑/普通提示，图标 `Fill/Tips`，确认按钮为主按钮。
  - 支持 `showCancel:false` 的单按钮提示。
- 明确提醒弹窗标准宽度 420px，不使用通用弹窗标题栏、分隔线或复杂内容区。
- 校验器新增提醒弹窗手写替身检查。
- 新增提醒弹窗组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/page-templates.md`
- `references/iteration-log.md`
- `pages/alert-modal/variants.js`

### 表单/详情弹窗框架 Figma 真源与规则修正

- 登记表单/详情弹窗框架 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `705:28547` / `弹框 PopBox`。
- 修正通用弹窗（`bepModal`）框架：
  - 弹窗宽度仍为 420 / 640 / 800。
  - 标题栏高 56px，标题栏底部分割线包含在 56px 内；内容起点为 y=80。
  - 内容区由弹窗框架负责上下左右 24px padding；传入内容宽度应为 `modalWidth - 48`。
  - 底部操作区高 52px，按钮高 32px、y=10、右对齐、按钮间距 8px。
  - 新增 `variant:'form'|'detail'`：表单弹窗默认显示底部按钮；详情弹窗默认不显示底部按钮，只保留右上关闭。
- 新增表单/详情弹窗框架样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/page-templates.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/modal/variants.js`

### 级联选择器 Figma 真源与公开 API 补充

- 登记级联选择器 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `696:27650` / `级联选择器`。
- 新增公开组件：
  - 级联选择器触发框：`bepCascader(placeholder, width, height, opts)`，默认继承选择器视觉，支持 `value / values / multiple / state / disabled`。
  - 级联展开面板：`bepCascaderPanel(columns, opts)`，支持单选和多选三列面板。
- 确认单选面板：默认三列 `128 / 128 / 100`，总宽 356，高 152；当前路径/hover 浅灰底，最终列选中显示 `Line/Select`。
- 确认多选面板：默认三列 `128 / 128 / 108`，总宽 364，高 152；多选项使用内置 checkbox，半选使用 `Line/Cut`，选中使用 `Line/Select`。
- 筛选区 `filter.type` 新增 `cascader`，用于省市区、组织层级、类目层级等筛选字段。
- 校验器新增：
  - 页面内 `make/build*Cascader/Cascade` 作为标准组件替身时报错。
  - `readonly:true` 报错，只读层级路径优先使用描述列表。
  - 业务页面使用 `hover / selected / open / complete-hover` 静态态给 warning。
- 新增级联选择器组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/filter-rules.md`
- `references/icons.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/cascader/variants.js`

### 树形组件 Figma 真源与公开 API 补充

- 登记树形组件 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `697:27653` / `树形组件 Tree`。
- 新增公开组件 `bepTree(items, opts)`：
  - 支持基础树形和可选树形，`opts.checkable:true` 时显示 checkbox。
  - 节点行高 28px，每级缩进 16px，展开/折叠图标 12px。
  - 基础树形文字 x=`level*16+16`；可选树形 checkbox x=`level*16+16`，文字 x=`level*16+40`。
  - 展开使用 `Fill/Arrow-Open`，折叠使用 `Fill/Arrow-PutAway`。
  - checkbox 选中使用 `Line/Select`，半选使用 `Line/Cut`。
- 明确 Tree 与树表格行的边界：
  - 普通层级结构展示使用 `bepTree`。
  - 多列、表头、操作列、表格数据中的树状层级使用 `bepTreeRow`。
  - 树形选择器后续应由选择器触发框 + 浮层 + `bepTree` 组合，不在本次混入 Tree。
- 校验器新增普通树形手写替身检查。
- 新增树形组件样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/icons.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/tree/variants.js`

### 复杂树形 Figma 真源与第一批公开 API 补充

- 登记复杂树形 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `0:75` / `复杂树形 ComplexTree`。
- 第一批只沉淀组织树/业务树容器，新增公开组件 `bepComplexTree(opts)`：
  - 默认 232×390，白底，1px 黑色 15% 描边，圆角 2px。
  - 标题栏高 56px，标题 16px Medium，底部分割线黑色 10%。
  - 内部搜索框 32px 高，左右边距 16px，搜索图标使用 `Line/Search`。
  - 树节点内容复用 `bepTree`；不得在复杂树形里手写树节点。
  - 支持 loading、titleOpen、dropdownOptions、nodeActions、checkable。
  - 标题下拉、节点更多操作全部使用 BeP 图标，不手绘。
- 明确复杂树形边界：
  - 复杂树形是业务树容器，不等同于基础树形。
  - 多列表格层级数据仍使用 `bepTreeRow`。
  - 大型选择弹窗和树形选择器下拉后续分批补充，不混入本次 API。
- 校验器新增复杂树形/组织树容器手写替身检查。
- 新增复杂树形样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/tree-complex/variants.js`

### 树形选择器 Figma 真源与公开 API 补充

- 基于复杂树形 Figma 真源 `BeP Admin Kit Sketch V1.1.0 1` / `0:75` 中的树形下拉选择形态，新增树形选择器规范。
- 新增公开组件：
  - `bepTreeSelect(placeholder, width, height, opts)`：选择器触发框，支持 default/hover/complete/complete-hover/selected/disabled，支持单选与多选 Tag。
  - `bepTreeSelectPanel(items, opts)`：树形下拉浮层，内部复用 `bepTree`，支持 checkable/activeIndex/scrollbar。
- 明确边界：
  - 输入框触发树节点选择使用树形选择器。
  - 逐级列式选择仍使用级联选择器（`bepCascader`）。
  - 业务树管理区域使用复杂树形（`bepComplexTree`）。
  - 多列表格层级数据使用树表格行（`bepTreeRow`）。
- 校验器新增树形选择器手写替身检查。
- 新增树形选择器样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-core.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/tree-select/variants.js`

### 复杂树形选择面板 Figma 真源与公开 API 补充

- 基于复杂树形 Figma 真源 `BeP Admin Kit Sketch V1.1.0 1` / `0:75` 中的大型选择面板形态，新增复杂树形选择面板规范。
- 新增公开组件 `bepComplexTreePicker(opts)`：
  - 标题栏 + 搜索框 + 关闭图标。
  - 左侧树区复用 `bepTree`。
  - 可选右侧详情列表，详情行 checkbox 由组件内部统一绘制。
  - 可选已选区，已选项复用选择器 Tag 样式。
  - 底部取消/确定按钮复用 `bepButton`。
- 明确边界：
  - 普通输入框触发选树使用树形选择器（`bepTreeSelect`）。
  - 大型弹窗/浮层内树选择使用复杂树形选择面板。
  - 页面左侧业务树管理使用复杂树形（`bepComplexTree`）。
  - 逐级列式选择使用级联选择器（`bepCascader`）。
- 校验器新增复杂树形选择面板手写替身检查。
- 新增复杂树形选择面板样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/tree-complex-picker/variants.js`

### 内容卡片 Figma 真源与新增卡片公开 API 补充

- 读取并登记内容卡片 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `87:67004` / `模板/6.数据看板/3.卡片页`。
- 保留并补强公开组件 `bepCard(opts)`：
  - 默认 288×255，白底，圆角 4px，无阴影。
  - 图标圆 44px，标题 16px Medium。
  - 描述 label/value 14px，label 黑色 45%，value 黑色 65%。
  - 描述 value 改为固定宽，长文案可换行，避免溢出卡片。
  - 底部操作区高度 47px，操作等分，列间分隔线 1px 黑色 6%。
- 新增公开组件 `bepAddCard(opts)`：
  - 用于卡片页新增入口。
  - 加号必须使用 BeP 图标 `Line/Add`，不得手写。
- 明确边界：
  - 内容卡片用于重复信息摘要和业务入口卡片。
  - KPI 摘要仍使用指标数据卡片（`bepMetricCard`）。
  - 页面大块容器仍使用页面级 Card 规则，不等同于 `bepCard`。
- 校验器新增新增卡片手写替身检查。
- 新增内容卡片样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/card/variants.js`

### 图表容器模块级组件补充

- 读取并登记数据看板图表区 Figma 真源：`BeP Admin Kit Sketch V1.1.0 1` / `87:62585`、`87:64392`。
- 新增公开模块 `bepChartCard(opts)`：
  - 用于数据看板完整图表区域，统一白底 r=4 卡片、标题区、分割线、可选副标题/操作、可选卡片内 Tabs、图例和图表骨架。
  - 支持 `line / bar / horizontal-bar / donut / gauge / word-cloud / placeholder`。
  - 右侧少量辅助指标可通过 `metrics` 展示，但 KPI 摘要仍必须使用 `bepMetricCard`。
- 明确边界：
  - `bepMetricCard` 只用于 KPI 摘要。
  - `bepChartCard` 用于完整图表模块，不作为真实图表引擎。
  - 表格型看板模块后续单独沉淀，不塞进图表容器。
- 校验器新增图表容器替身检查和 `type` 白名单检查。
- 新增图表容器样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/chart-card/variants.js`

### 看板表格与排行榜模块级组件补充

- 基于数据看板页面真源：`BeP Admin Kit Sketch V1.1.0 1` / `87:62585`、`87:64392`。
- 新增公开模块 `bepDashboardTableCard(opts)`：
  - 用于数据看板中的表格型模块、小型明细表、Top 明细。
  - 模块外框统一白底 r=4、标题区、可选副标题/操作、可选卡片内 Tabs。
  - 内部强制复用标准表格 `bepTableHeader` / `bepTableRow`，不另起一套表格样式。
- 新增公开模块 `bepRankListCard(opts)`：
  - 用于数据看板中的列表型 Top N 排行。
  - 统一排名徽标、排行行、右侧数值和可选进度条。
- 明确边界：
  - 看板表格不属于 `bepChartCard`、`bepMetricCard` 或 `bepCard`。
  - 列表型排行榜用 `bepRankListCard`；横向柱状对比图仍用 `bepChartCard({type:'horizontal-bar'})`。
  - 新闻列表当前 BeP 未公开标准模块，本次暂搁置。
- 校验器新增看板表格、排行榜替身检查和未公开状态检查。
- 新增数据看板模块样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/page-templates.md`
- `references/iteration-log.md`
- `pages/dashboard-modules/variants.js`

### 侧边栏三级菜单公开支持

- 补齐侧边栏菜单项（`bepSidebarItem`）三级菜单能力：
  - `level` 公开支持 `1 / 2 / 3`。
  - 一级菜单可带 BeP 图标和 expanded 箭头；二级、三级用于展开后的子菜单层级。
  - active 仅提升文字透明度，不额外增加蓝色侧边条或自定义高亮。
- 修正旧规则冲突：页面不得为业务菜单手写内联 SVG、不得局部注入 `BEP_ICONS`、不得自造 `sidebarL3`。
- 同步替换 `pages/hr/list.js` 里的局部三级菜单 TODO，改为标准 `bepSidebarItem(label, 3, state)`。
- 校验器新增侧边栏替身函数检查。
- 新增侧边栏菜单项标准样例页。

涉及文件：
- `SKILL.md`
- `scripts/bep-components.js`
- `scripts/tools/validate-page.js`
- `references/components-layout.md`
- `references/component-glossary.md`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`
- `pages/hr/list.js`
- `pages/sidebar/variants.js`

### 页头系统模式样例入口补齐

- 将已存在的 `pages/header/variants.js` 正式纳入样例索引和 RAG 索引，作为页头系统模式的优先参考。
- 明确该样例覆盖：
  - 顶部栏（`bepTopBar`）。
  - 面包屑栏（`bepTitleBar`，旧 API 名）。
  - 完整页头（`bepHeader` = TopBar + Breadcrumb）。
  - 系统页签 / 页面页签（`bepTopBar` + `bepTabs` = TopBar + PageTabs）。
- 校验器新增页头系统模式检查：
  - 业务页面不得混用 `bepHeader` 与 `bepTabs` 两种系统打开机制。
  - 业务页面直接使用 `bepTabs` 但未说明 PageTabs 系统模式时给出 warning，避免把系统页签误作业务 Tabs。

涉及文件：
- `SKILL.md`
- `scripts/tools/validate-page.js`
- `references/scripter-rules.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`

### 日期 / 时间 / 日期时间样例入口补齐

- 将已存在的日期、时间、日期时间选择器样例纳入 `SKILL.md` 样例索引：
  - 日期选择器：`pages/date/variants.js`。
  - 时间选择器：`pages/time/variants.js`。
  - 日期时间选择器：`pages/date-time/variants.js`。
- 同步补齐 RAG 样例索引行，避免只检索到 Figma 真源而漏读已校验样例。
- 明确检索风险：
  - 日期选择器不得手写日历格或双月面板。
  - 时间选择器不得用普通输入框近似。
  - 日期时间选择器不得由日期组件 + 时间组件在页面中临时拼接。

涉及文件：
- `SKILL.md`
- `references/rag/source-index.md`
- `references/iteration-log.md`

### 内容卡片样例入口与校验闭环

- 将已存在的 `pages/card/variants.js` 纳入 `SKILL.md` 样例索引，作为内容卡片 / 新增卡片的优先参考。
- 校验器补充内容卡片替身检查：
  - `makeContentCard / buildInfoCard / makeEntryCard / buildAppCard` 等页面内局部函数不得替代 `bepCard`。
  - 新增卡片仍必须使用 `bepAddCard`。
- 当前内容卡片闭环状态：组件库入口、组件文档、中文术语、Scripter 规则、RAG 样例、样例页、校验器均已覆盖。

涉及文件：
- `SKILL.md`
- `scripts/tools/validate-page.js`
- `references/iteration-log.md`

### 设计决策层升级（L0：产品 / IA / 交互 / 体验 / 校验）

- 补齐原 skill 只有执行层（组件 / 模板 / 校验）而缺「需求 → 页面结构」判断的缺口，新增 6 份决策层规范：
  - `references/design-process.md`：十步决策链、产品理解八问、角色权限矩阵、设计优先级 P0–P5、主动发现问题三依据、执行强度 A/B 两档、设计前置说明卡模板、常见误判反例库。
  - `references/information-architecture.md`：模块划分判据（按对象 → 阶段 → 任务频率）、导航层级与降级规则、页面清单格式（树 + 表）、页面关系（对象型 vs 单据型入口）、导航复述等禁止项、真实系统复盘表。
  - `references/page-type-rules.md`：12 类页面识别信号与结构骨架（列表页骨架按要求给出「标题 → 说明 → 筛选 → 快捷操作 → 表格 → 批量 → 分页 → 行内入口」）、类型→模板映射、常见误用。
  - `references/interaction-design.md`：四条操作路径、状态完整性矩阵（11 态 × 5 类页面）、12 项异常场景、交互形态判据（页面 / 抽屉 / 弹窗、二次确认、批量、分页策略、筛选折叠）、方案 A/B/C 对比与判据权重、反馈与文案规则。
  - `references/pc-ux-principles.md`：反 C 端化红线、信息密度基线（数值引用 design-tokens / filter-rules / form-rules 真源）、操作距离与效率能力清单、多任务与大数据量策略。
  - `references/design-review.md`：交付前八维设计自检（产品逻辑 → IA → 交互 → 页面完整性 → 组件 → 状态 → 视觉 → PC 体验）、阻塞 / 建议分级、交付说明五段模板、常见返工 Top 8。
- `SKILL.md`：
  - 新增「定位」章节，明确决策层（该画什么）与执行层（怎么画对）的分工与顺序。
  - 新增「设计决策铁律 D1–D5」（P0–P3 级，优先于执行铁律）；原「铁律」改名为「执行铁律（组件与视觉正确性 · P4–P5）」，**11 条原文未改**。
  - 标准工作流由 8 步扩为 12 步，前 6 步为设计决策环节（理解需求 / 判断角色 / 建 IA / 建任务流 / 定页面类型 / 设计交互）。
  - 「详细规范」路由表新增 6 行决策层入口；「设计验收清单」改名为「验收清单（执行层：代码与组件）」并新增「设计校验（决策层）」小节；沟通命名规则补充产品与 IA 术语口径。
  - frontmatter description 补充「信息架构 / 菜单分类 / 页面清单 / 交互方案 / 页面结构 / 流程设计」等触发词。
- `references/page-templates.md`：新增 §一「按任务选模板（两级判断）」表（用户任务 → 页面类型 → 模板 + 常见坑），底部「快速选型」改为「快速索引」，消除「关键词 → 模板」式选型。
- `agents/openai.yaml`：`short_description` 与 `default_prompt` 更新，体现「先决策层、后执行层」流程。
- 未改动：11 条执行铁律原文、`scripts/bep-components.js`、`scripts/tools/*`、`design-tokens.md` 等既有规范、RAG 层、全部示例页面。

涉及文件：
- `SKILL.md`
- `references/design-process.md`（新增）
- `references/information-architecture.md`（新增）
- `references/page-type-rules.md`（新增）
- `references/interaction-design.md`（新增）
- `references/pc-ux-principles.md`（新增）
- `references/design-review.md`（新增）
- `references/page-templates.md`
- `agents/openai.yaml`
- `references/iteration-log.md`
