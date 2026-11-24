---
name: bep-admin-ui-brand-next
description: BeP Admin Kit（碧桂园服务后台设计系统）PC 端产品设计 + UX 交互 + UI 视觉 + 组件系统一体化规范，当前默认版。当用户需要做后台系统的产品设计或页面生成时使用，包括需求分析、信息架构与菜单分类、页面清单与流程设计、交互方案（状态与异常）、以及生成 BeP 风格的 Figma 页面/弹窗/抽屉/表单/列表；提到"信息架构"、"菜单分类"、"页面清单"、"交互方案"、"页面结构"、"流程设计"、"BeP规范"、"Figma Scripter脚本"、"BeP规范更新"时也使用。旧版只在用户明确要求"旧版 BeP"、"备份版 BeP"、"bep-admin-ui-brand-backup"时使用。页面输出为完整自包含的 Figma Scripter JS 脚本，用户手动粘贴运行。
---

# BeP Admin UI Brand Next

> 当前默认 BeP skill。除非用户明确要求旧版/备份版，所有 BeP 规范修改和页面生成都使用本目录。

## 定位

本 skill 覆盖 **PC 端产品设计 + UX 交互 + UI 视觉 + 组件系统** 的完整链条：

```
需求 → 产品理解 → 角色 → 信息架构 → 任务流 → 页面类型 → 页面结构 → 交互 → 组件 → UI
     → 设计输出 → 自动质量校验（Design QA）→ 问题修复 → 二次校验 → 最终交付
```

- **设计决策层**（`design-process.md` / `information-architecture.md` / `page-type-rules.md` / `interaction-design.md` / `pc-ux-principles.md` / `design-review.md`）：决定「该画什么」。
- **设计执行层**（组件文档、页面模板、组件库、校验器、样例、RAG）：决定「怎么画对」。
- **质量验收层**（`design-qa.md` + `scripts/tools/design-qa.js`）：设计输出后执行六维自动校验、自动修复与二次校验，产出 Design QA 报告，决定「能否交付」。

> 先走决策层确定页面从哪来，再走执行层把它画规范。只做执行层 = 「用户说需求 → 调组件 → 拼页面」，会产出结构正确但任务不闭环的页面。

## 设计决策铁律（D1–D5 · P0–P3 级，优先于下方执行铁律）

- **D1 · 业务逻辑正确优先于一切**：与信息架构、交互、组件规范、视觉冲突时一律让路（P0 > P1–P5，见 `design-process.md` §五）。
- **D2 · 页面由用户任务推导，不由组件推导**：每页必须能说出「解决谁的什么任务」，说不出的页面不生成；禁止为了展示组件造页面、造菜单。
- **D3 · 状态必须完整，禁止只做 happy path**：列表页至少覆盖 default / loading / empty / error / disabled / permission；批量操作必须覆盖部分成功；异常清单见 `interaction-design.md` §三。
- **D4 · 同一功能只有一个正主入口**：顶部、首页、菜单不得各自实现同一功能；重复入口做快捷方式并指向正主。
- **D5 · 复杂需求先出「设计前置说明卡」并等确认**：判定见 `design-process.md` §七 A 档；简单需求直接执行，但设计判断必须写进交付说明。提出新增建议必须同时具备三依据：用户任务 + 业务场景 + PC 端效率。

## 执行铁律（组件与视觉正确性 · P4–P5 级，任何情况不得违反）

1. **所有标准组件只调用，不重写**——下方速查表有对应函数直接用，没有的先告知用户再补充
2. **表格单元格必须用固定宽表格文字 `bepTableText` / `bepTruncText`**，不得用 `bepText` 渲染单元格（原因：bepText 宽度自动扩展会破坏列宽）
3. **不确定的规范不编造**——页面生成时可打 `<!-- TODO -->` 标注并告知用户；补充组件规范时遇到 TODO 必须先提出缺口给用户确认，不得静默写入文档当作完成
4. **所有元素必须挂在 `pageFrame` 下**——禁止直接 `figma.currentPage.appendChild`，否则各部分在 Figma 中是分离的独立元素
5. **表格必须按列建模**——先定义列的 `label / width / align / render`，再把行数据填入列；不得按单行视觉结果反推布局
6. **表格必须输出 `COL_WIDTH_AUDIT`**——列出每列的表头、最长内容、计算宽、最终宽；操作列宽必须来自 `bepActionMetrics(actionRows).width + 32` 或 `bepActionCell(actions, {slotWidths}).width + 32`，不得手写估算
7. **字段必须对齐原型数据源和页面类型**——字段只能来自原型或用户明确补充；不得把提示文案、规则说明、校验说明包装成业务字段；编辑页锚点结构不得机械套到详情页
8. **图标必须使用 BeP 图标（`bepIcon`）**——页面脚本禁止手绘图标、禁止自定义 SVG、禁止注入 `BEP_ICONS`；引用不到图标时先提出缺口，确认后补进 BeP 图标库和图标文档
9. **构建产物必须保留所有被引用图标**——页面脚本只引用图标 key；`build.js` 必须保留 `bepIcon(...)`、标准组件图标参数（如 `bepSidebarItem(..., iconKey)`）和对象属性（如 `iconKey`）引用的图标；`validate-page.js` 必须校验源码图标 key 在组件库和 dist 中均存在
10. **Tab 内容必须按 `activeTab` 分支渲染**——页面只渲染当前激活页签对应内容；不得把多个页签内容堆在同一页面里。操作记录、日志、流水等动态记录不得放进商品信息、基础信息等静态详情内容中
11. **动态记录必须使用标准时间轴组件**——操作记录、审核记录、库存流水、价格变更历史等时间顺序内容应使用时间轴（`bepTimeline`）；不得用 `TimelineItem`、`LogRow`、圆点连线等局部手写结构近似

---

## 沟通命名规则

- 与用户讨论 BeP 规范、组件选择、页面结构时，默认使用中文组件名。
- 组件首次出现、涉及修改、涉及校验或需要精确指向代码 API 时，使用“中文组件名（`英文函数名`）”。
- 只有在代码、校验器、文件 API、函数签名中，才单独使用英文函数名。
- 示例：页头标题型（`bepHeaderTitle`）、对象标题摘要（`bepObjectTitle`）、卡片内页签（`bepCardTabs`）、系统页签/页面页签（`bepTabs`）、描述列表（`bepDescriptions`）。
- 完整组件中文名、英文函数名、层级、用途和易混淆项见 `references/component-glossary.md`。
- 讨论产品与 IA 时使用中文业务术语：角色、任务流、页面类型、信息架构、状态、异常场景；只在代码与文件 API 中使用英文函数名。

---

## 标准工作流

> 前 6 步是设计决策层（决定画什么），后 6 步是执行层（决定怎么画对）。  
> 简单需求（判定见 `design-process.md` §七 B 档）可快速通过前 6 步，但结论必须写进交付说明。

1. **理解需求**：按 `design-process.md` §二 八问确认业务目标、用户与任务；需求只有一句话或对象不明确时，先出「设计前置说明卡」（D5）。
2. **判断角色**：建角色 × 任务 × 权限矩阵，明确每页主操作与无权限时的表现（`design-process.md` §三）。
3. **建立信息架构**：模块划分、页面清单、导航落位与页面关系（`information-architecture.md`）。涉及多页面、新模块或菜单调整时，必须先出 IA 再动手。
4. **建立任务流**：主路径 + 分支 + 来路/去路，确认无断点（`design-process.md` §四）。
5. **确定页面类型**：按 `page-type-rules.md` 的识别信号定类型，取其结构骨架（每页一个主类型）。
6. **设计交互**：跳转、弹层、反馈、状态与异常（`interaction-design.md`）；存在多种合理形态时给出 A/B/C 对比与选择理由。
7. **确认数据源和字段**：如果有原型，先区分原型中的编辑页、查看页、列表页等结构；以目标页面类型对应的原型为准。字段可按查看/操作语义重组，但不得新增字段。
8. **读取规范并检索参考**：页面结构读 `references/page-templates.md`；涉及表格、筛选、表单、弹窗/抽屉时按「详细规范」表补读；再按 `references/rag/README.md` 找相似参考。RAG 只辅助判断，不得覆盖铁律、组件文档、组件库实现和校验器。
9. **调用标准组件写页面源码**：保存到 `pages/<模块>/<页面>.js`，所有节点统一挂到 `pageFrame`，标准组件优先调用 `bep*` 函数；密度、操作距离、数据量策略按 `pc-ux-principles.md` 校核。
10. **构建**：`node tools/build.js <模块>/<页面>`。
11. **代码校验**：`node tools/validate-page.js <模块>/<页面>`（执行层静态校验）。
12. **自动质量校验（Design QA · 必做）**：`node tools/design-qa.js <模块>/<页面>`（有 PRD/Figma 真源时加 `--prd` / `--figma`）。自动执行 D1~D6 六维校验 → 识别违规 → 自动修复确定项 → 二次校验 → 生成报告。详见 `references/design-qa.md`。**FAIL 项必须处理；BLOCKED / NOT CHECKED 必须按报告补条件或人工确认，禁止当作 PASS。**
13. **人工走查**：按 `design-review.md` 过八维设计自检，重点确认 Design QA 中标记为 `NOT CHECKED` 的语义判断层（需求误解、像素级还原、交互形态合理性）。
14. **交付说明**：按 `design-review.md` §九 的五段模板输出，并附 Design QA 报告路径；如有 TODO、缺失组件、RAG 冲突、手工假设或未解决的 FAIL/BLOCKED，必须明确列出。

> 完整链路：设计输出 → **自动质量校验 → 问题修复 → 二次校验** → 最终交付。Design QA 报告（`pages/<模块>/dist/design-qa-<页面>.md`）是交付的必要组成。

## 内置 RAG 参考层

- RAG 是 BeP skill 内置的检索型参考层，用于查找 Figma 真源摘要、已校验样例、历史业务案例和常见判断案例。
- RAG 不是第二套规范，不具备最终裁决权；当 RAG 与 `SKILL.md`、`references/*.md`、`scripts/bep-components.js` 或校验器冲突时，一律以后者为准。
- 历史页面和业务案例只允许参考字段组织、信息亲近关系、页面类型判断，不得照抄旧布局、旧坐标、旧组件写法。
- 生成页面前，先用规范确定组件和模板，再用 RAG 找相似案例；不能先照 RAG 案例生成后再补规范。
- RAG 中发现新模式时，不能直接当规范使用；必须先沉淀到 `SKILL.md`、组件文档、组件库或校验器，再进入页面生成。
- RAG 入口见 `references/rag/README.md`。

## 信息缺省决策

- 用户未给页面类型：根据关键词判断；仍无法判断时，只问一个必要问题。
- 用户未给模块/页面名：按业务语义生成短横线目录名，例如 `sales-contract/list`。
- 用户未给字段：可生成真实感示例字段和数据，但要在交付说明中标为“示例数据”。
- 用户未给菜单路径：默认使用 `['系统管理', '当前页']`，页面标题用用户需求中的主要对象名。
- 用户要求的组件在 `bep-components.js` 没有：不得重写标准组件；先用 `<!-- TODO -->` 或代码注释标出缺口，并告知用户需要补组件。
- 用户要求的图标在 `BEP_ICONS` 中没有：不得手绘或自定义 SVG；先提出缺失图标和候选替代，确认后补进 `scripts/bep-components.js` 和 `references/icons.md`。
- 用户要求违反 BeP 规范：优先遵守本 skill 铁律，并在交付说明中说明调整点。

---

## 速查表（bep-components.js 函数一览）

> 所有页面脚本 = bep-components.js 全文 + 页面专有逻辑。运行前先粘贴 bep-components.js。

## 组件分层规则

BeP 组件必须按 **原子组件 → 复合组件 → 模块 → 模板** 组织，页面脚本只做业务数据、布局摆放和标准组件调用。

| 层级   | 职责           | 允许内容                                                                    | 禁止内容                                      |
| ---- | ------------ | ----------------------------------------------------------------------- | ----------------------------------------- |
| 原子组件 | 最底层节点创建与基础样式 | `bepFrame`、`bepRect`、`bepText`、`bepTableText`、`bepIcon`                 | 页面脚本直接 `figma.create*`                    |
| 复合组件 | 可复用控件和信息块    | Button、Input、Select、Tag、Table、Descriptions、Modal、Drawer、Tabs、FormItem 等 | 页面内 `makeBtn/makeTableCell/makeTag` 等局部替身 |
| 模块   | 业务区域级结构      | Header、HeaderTitle、Sidebar、FilterGrid、SelectionBar、Card 等               | 在页面中重写页头、侧边栏、筛选区、表格或弹窗结构                  |
| 模板   | 页面级组合方式      | `references/page-templates.md` 中的列表页、详情页、表单页等                           | 直接照抄历史页面坐标和手写结构                           |

**例外：** 页面根容器 `pageFrame`、页面级 `Card` 容器、纯布局包裹 Frame 可以用 `bepFrame`；页面特有图片/商品缩略图占位可以用原子组件临时绘制，但不得替代已有标准组件。

**内部组件：** `bepHeaderTitleTabs`、描述列表 value 子组件等是组件库内部子组件；页面脚本优先调用公开组件入口（如 `bepHeaderTitle`、`bepDescriptions`），不得绕过公开入口直接拼内部结构。

## 组件规范完整性规则

每个 BeP 标准组件的规范必须同时包含 **样式属性、状态交互、内容约束、使用场景** 四类信息；不得只记录静态视觉样式。

| 组成   | 必须说明                                                                                           | 示例                                  |
| ---- | ---------------------------------------------------------------------------------------------- | ----------------------------------- |
| 样式属性 | 尺寸、颜色、字体、圆角、描边、阴影、间距、布局方式                                                                      | Button 高 32、r=4、左右 padding 16       |
| 状态交互 | default、hover、active、focus、disabled、selected、error、loading、open/close、expanded/collapsed 等适用状态 | Input focus 边框、Modal 确认中、Tabs 选中态   |
| 内容约束 | 文字长度、截断/换行、空值、数值对齐、图标/标签/附件/媒体等内容类型                                                            | 表格数值右对齐，描述列表空值显示 `-`                |
| 使用场景 | 什么时候用、什么时候不用、与哪些组件组合、在模板中的位置                                                                   | 操作列用 `bepActionCell`，不用 `bepButton` |

**缺失处理：**

- 如果补充组件规范时发现 Figma 真源、状态数值、交互规则或内容约束未确认，不得直接把 TODO 写入文档；必须先列出待确认项给用户，由用户补充或确认后再写入。
- 用户未补充前，该组件文档视为“待补充”，不能标记为已完整补齐。
- 如果组件已有实现但缺状态规则，页面生成时只能使用已明确的状态；涉及未确认状态时必须在交付说明中提示。
- 新增或修改组件时，必须同步补齐组件文档模板中的各项；只改 `scripts/bep-components.js` 不改文档视为未完成。

**组件文档模板：**

````md
## bepComponentName — 中文组件名

**层级：** 原子组件 / 复合组件 / 模块
**Figma 真源：** 文件名 / node id / 组件名；未确认写 TODO
**公开入口：** `bepComponentName(args)`

### 样式属性
- 尺寸：
- 颜色：
- 字体：
- 圆角/描边/阴影：
- 间距/布局：

### 状态交互
- default：
- hover：
- active/pressed：
- focus：
- disabled：
- selected/open/expanded/error/loading：（按组件适用项填写）

### 内容约束
- 文字：
- 图标：
- 空值：
- 截断/换行：
- 数据类型或数量限制：

### 使用场景
- 适用：
- 不适用：
- 常见组合：
- 模板位置：

### 禁止事项
- 禁止：

### 参数/API
```javascript
bepComponentName(arg1, arg2, { option: value })
```
````

### 基础工具

| 需要                | 函数                                                             |
| ----------------- | -------------------------------------------------------------- |
| 颜色转 RGB           | `bepHex('#006D9B')`                                            |
| 纯色填充数组            | `bepSolid(color, opacity)`                                     |
| 空 Frame           | `bepFrame(w, h, opts)`                                         |
| 矩形                | `bepRect(w, h, color, opts)`                                   |
| 文字（自动宽高）          | `bepText(str, color, size, opts)`                              |
| 文字（**表格专用**，固定宽度） | `bepTableText(str, color, maxW, opts)`；旧名 `bepTruncText` 兼容可用  |
| 图标                | `bepIcon('Line/Close', 16, B)`；只能引用 `BEP_ICONS` 已存在 key，缺图标先提出 |
| 描述列表链接 value      | `bepDescLink(link, {maxW})` / `bepDescLinks(links, {maxW})`    |
| 描述列表标签 value      | `bepDescTags(tags, {maxW})`（内部调用 `bepTag`）                     |
| 描述列表附件 value      | `bepDescAttachments(files, {maxW})`                            |
| 描述列表图片/视频 value   | `bepDescMedia(items, {maxW})`                                  |

### 基础组件

| 需要          | 函数                                                                                    | 关键参数                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 按钮          | `bepButton(label, type, height, opts)`                                                | type: primary/secondary/primary-outline/frame/danger/text/dashed；height 默认 32；opts 支持 iconKey/iconOnly/iconPosition/loading/disabled/state |
| 按钮组         | `bepButtonGroup(actions, opts)`                                                       | 默认 gap=8；支持 `{align:'right', width}`；动作项透传 `bepButton` 参数                                                                                  |
| 输入框         | `bepInput(placeholder, width, height, opts)`                                          | opts 支持 value/state/disabled/error/errorText/prefixText/suffixText/suffixIconKey/clearable                                                 |
| 组合输入框       | `bepInputGroup(selectPlaceholder, inputPlaceholder, width, opts)`                     | 左侧选择器 + 右侧输入框                                                                                                                              |
| 文本域 / 多行输入框 | `bepTextarea(placeholder, width, height, opts)`                                       | 默认 682×134；opts 支持 value/state/disabled/error/errorText/maxLength/count/resizable                                                          |
| 选择器         | `bepSelect(placeholder, width, height, opts)`                                         | 单选；opts 支持 value/state/disabled                                                                                                            |
| 多选选择器       | `bepMultiSelect(placeholder, values, width, height, opts)`                            | 多选 Tag；opts 支持 state/disabled/maxVisible                                                                                                   |
| 下拉菜单        | `bepDropdown(options, width, opts)`                                                   | 选择器展开浮层；options 支持 default/hover/selected/disabled                                                                                         |
| 级联选择器       | `bepCascader(placeholder, width, height, opts)` / `bepCascaderPanel(columns, opts)`   | 单选/多选层级选择；展开面板不得页面手写                                                                                                                       |
| 树形组件        | `bepTree(items, opts)`                                                                | 基础树形/可选树形；opts 支持 checkable/width/activeIndex                                                                                              |
| 复杂树形        | `bepComplexTree(opts)`                                                                | 组织树/业务树容器；内部复用 `bepTree`，支持标题栏、搜索、加载、标题下拉、节点更多操作                                                                                           |
| 树形选择器       | `bepTreeSelect(placeholder, width, height, opts)` / `bepTreeSelectPanel(items, opts)` | 输入框触发树节点选择；浮层内部复用 `bepTree`                                                                                                                |
| 复杂树形选择面板    | `bepComplexTreePicker(opts)`                                                          | 弹窗/浮层内的大型树选择容器；复用 `bepTree`、`bepButton`、选择 Tag                                                                                             |
| 单日期         | `bepDate(placeholder, width, height, opts)`                                           | opts 支持 value/state/disabled/clearable                                                                                                     |
| 日期区间        | `bepDateRange(width, height, opts)`                                                   | opts 支持 start/end/state/disabled/clearable                                                                                                 |
| 日期面板        | `bepDatePickerPanel(opts)`                                                            | 单日期展开月视图，不得页面手写日历格                                                                                                                         |
| 日期区间面板      | `bepDateRangePanel(opts)`                                                             | 日期区间展开双月视图，不得页面手写双月面板                                                                                                                      |
| 时间选择器       | `bepTime(placeholder, width, height, opts)`                                           | opts 支持 value/state/disabled/clearable                                                                                                     |
| 时间区间        | `bepTimeRange(width, height, opts)`                                                   | opts 支持 start/end/state/disabled/clearable                                                                                                 |
| 时间面板        | `bepTimePickerPanel(opts)`                                                            | 时/分/秒三列展开面板，不得页面手写时间列                                                                                                                      |
| 时间区间面板      | `bepTimeRangePanel(opts)`                                                             | 左右双时间展开面板，底部确认按钮复用 `bepButton`                                                                                                             |
| 日期时间选择器     | `bepDateTime(placeholder, width, height, opts)`                                       | opts 支持 value/state/disabled/clearable；默认宽 400                                                                                             |
| 日期时间区间      | `bepDateTimeRange(width, height, opts)`                                               | opts 支持 start/end/state/disabled/clearable；默认宽 400                                                                                         |
| 日期时间面板      | `bepDateTimePanel(opts)`                                                              | 月历 + 时/分/秒三列 + 此刻/确定，不得页面手写                                                                                                                |
| 日期时间区间面板    | `bepDateTimeRangePanel(opts)`                                                         | 快捷范围 + 月历 + 时/分/秒三列 + 确定，不得页面手写                                                                                                            |
| 开关          | `bepSwitch(isOn, labelOn, labelOff, opts)`                                            | opts 支持 size:'large'/'middle'/'small'、disabled、loading、showText                                                                            |
| 评分          | `bepRate(value, opts)`                                                                | opts 支持 count/text/showText；星形必须调用 `Fill/Star`                                                                                             |
| 单选组         | `bepRadioGroup(options, activeVal, opts)`                                             | opts 支持 gap/disabled/state；按钮式传 `{variant:'button'}`                                                                                       |
| 多选组         | `bepCheckboxGroup(options, selected, opts)`                                           | opts 支持 gap/disabled/state；选中项自动主色方框 + BeP 对勾                                                                                              |
| 上传按钮        | `bepUploadBtn(label, height, opts)`                                                   | 边框上传按钮；图标必须用 `Line/upload`                                                                                                                 |
| 点击上传        | `bepUploadClick(label, tip, opts)`                                                    | 上传按钮 + 格式提示                                                                                                                                |
| 上传条/文件列表    | `bepUploadFileRow(file, opts)` / `bepUploadFileList(files, opts)`                     | 支持 default/uploading/hover/error                                                                                                           |
| 拖拽上传        | `bepUploadDragger(opts)`                                                              | 虚线拖拽区域 + 上传图标 + 提示                                                                                                                         |
| 图片上传        | `bepImageUpload(items, opts)`                                                         | 支持 default/hover/uploading/success/success-hover/error/error-hover                                                                         |
| 数字输入框       | `bepInputNumber(value, width, height, opts)`                                          | 默认 width=160；opts 支持 state/disabled/error/errorText/prefixText/suffixText                                                                  |
| 组合数字输入框     | `bepInputNumberGroup(selectPlaceholder, value, width, opts)`                          | 左侧选择器 + 右侧数字输入框                                                                                                                            |
| 标示 / 标签     | `bepTag(label, type, style)`                                                          | type: enabled/disabled/success/warning/danger/info；style: outline/solid/dot/closable/add                                                   |


### 表格

| 需要 | 函数 |
|---|---|
| 表头行 | `bepTableHeader(cols, tableW, opts)`；opts 支持 `{size:'mini'}` |
| 高级表头行 | `bepAdvancedTableHeader(cols, tableW, opts)`；支持列级 `filter/iconKey`，用于筛选/排序等表头功能 |
| 多级表头 | `bepMultiLevelTableHeader(cols, tableW)`；支持 `rowSpan:2` 与 `children` 分组列 |
| 普通数据行 | `bepTableRow(cells, cols, tableW, bgColor, opts)`；opts 支持 `{size:'mini'}` |
| 树表格行 | `bepTreeRow(cells, cols, tableW, level, state, bgColor, opts)` — state: expanded/collapsed/leaf；checkbox列后接名称列时传 `{treeCol:1}` |
| 表格多选框 | `bepTableCheckbox(checked, opts)`；表格 checkbox 列专用，页面不得手写勾选框 |
| 表格拖拽柄 | `bepTableDragHandle()`；可拖拽表格控制列专用，图标使用 `Line/Drag` |
| 表格展开面板 | `bepTableExpandPanel(tableW, items, opts)`；行展开后的全宽详情面板，不单独做 Card |
| 表格快速新增行 | `bepQuickAddRow(tableW, opts)`；表头下方首行状态，内部复用 Dashed Button |
| 操作列（复合列，≤3个，超出变⋮）| 先用 `bepActionMetrics(actionRows)` 按第1/2/3位操作分别计算子级列宽，再用 `bepActionCell(actions, {slotWidths:metrics.slotWidths})`；父级列宽 = `metrics.width + 32`；操作文本不得换行/省略 |
| 空状态 | `bepEmptyState(tableW)` |
| 左侧冻结列阴影 | `frame.effects = [BEP_SHADOW_FREEZE_LEFT]`（阴影落在右侧） |
| 右侧冻结列阴影 | `frame.effects = [BEP_SHADOW_FREEZE_RIGHT]`（阴影落在左侧） |

**高级表格必须先读 `references/advanced-table-rules.md`。** 只要出现表头筛选、列设置、拖拽排序、内联操作、树状层级、折叠详情、快速新增、多级表头等能力，不得按普通表格自由拼装。BeP 只有一个树状表格规范，统一使用 `bepTreeRow`，不存在“简单树”和“高级树”两套实现。

**文字使用强制规则**：模块标题、页面标题、分组标题、按钮文字默认用 `bepText`，宽度按实际文字反推；表单字段标题固定为 8 个汉字 + 必填星号宽度，超过 8 个汉字必须要求产品/业务简化；描述列表字段标题按实际文字宽度；表格列宽由表头和数据最宽文本反推，单元格渲染用 `bepTableText`/`bepTruncText` 固定在列宽内。

**表格交付前强制检查**：长编号完整、金额/库存等数值列右对齐、不可截断字段完整、操作列不截断、右侧冻结列阴影在左侧、超宽表格拆成内容视窗 + 冻结操作列。

### 页面结构

| 需要 | 函数 |
|---|---|
| 完整页头（TopBar+TitleBar，总高96px）| `bepHeader(title, crumbs, CANVAS_W - SIDE_W)` |
| TitleBar（含右侧按钮）| `bepTitleBar(title, crumbs, w, {rightActions:[{label,type}]})` |
| 对象标题摘要 | `bepObjectTitle({title, subtitle, imageNode, status, tags, width})` |
| 页头标题型（标题摘要，可选操作按钮/Tabs）| `bepHeaderTitle({title, subtitle, actions, tabs, activeTab, imageNode, status, tags, width})` |
| 页头页签（替代TitleBar）| `bepTabs(['选项一','选项二'], 0, CANVAS_W - SIDE_W)` |
| 卡片内页签 | `bepCardTabs(['选项一','选项二'], 0, CARD_W)` |
| 描述列表 | `bepDescriptions(sections, TABLE_W)`；1440 默认 3 列，短文本自动流入列，长文本独占整行并换行 |
| 已选操作栏 | `bepSelectionBar(2, ['删除','导出'], TABLE_W)` |
| 步骤条 | `bepSteps([{title:'基础信息',desc:'说明文字'},...], 0, TABLE_W, {variant:'description'})` |
| 全局提示 | `bepMessage('保存成功', 'success')`；type: info/success/error/loading，danger 兼容失败别名 |
| 警告提示 | `bepAlert('标题或文案', '说明文字', {type, variant, width})`；type: info/success/warning/error；variant: normal/large |
| 内容卡片 | `bepCard({title:'标题', iconKey:'...', descs:[{label,value}], actions:['操作一','更多']})`；新增入口用 `bepAddCard({title, desc})` |
| 指标数据卡片 | `bepMetricCard({title:'指标一', value:'12,986', unit:'万', iconKey:'Line/bar-chart', trendItems:[...]})`；用于数据看板 KPI 摘要 |
| 图表容器 | `bepChartCard({title:'趋势分析', type:'line', legend:['数据一']})`；用于数据看板完整图表模块，标题、图例、Tabs、图表骨架不得页面手写 |
| 看板表格 | `bepDashboardTableCard({title:'明细排行', cols, rows})`；用于数据看板表格型模块，内部复用标准表格 |
| 排行榜 | `bepRankListCard({title:'排行榜', items})`；用于数据看板列表型 Top N 排行，不用于横向柱状图 |
| 时间轴 | `bepTimeline(items, {width, variant})`；用于操作记录、审核记录、库存流水、价格变更历史；页面不得手写圆点、连线或日志行 |
| 侧边栏 Logo | `bepSidebarLogo(appName, appEnName, 208)` |
| 侧边栏菜单项 | `bepSidebarItem(label, level, state, iconKey)`；level 支持 1/2/3 |
| 分页器 | `bepPagination('共300条', 1, [1,2,3,'…',20], '10条/页')` |
| 面包屑（独立用）| `bepBreadcrumb(['系统管理','当前页'])` |

**页面级 Card 默认无阴影。** 只有弹窗、抽屉、冻结列、悬浮层等特殊场景，或用户明确要求强调层级时，才允许显式设置 `effects`。

**页头系统模式：** BeP 系统级页头打开机制只能二选一：`TopBar + Breadcrumb` 或 `TopBar + PageTabs`。`bepTitleBar` 当前是 BreadcrumbBar 的旧名，用于下钻下级页面时展示路径；平级页面打开时覆盖当前页，不保留上一个页面。`bepTabs` 当前是 PageTabs 的旧名，用于多页签工作台模式；无论打开平级还是下级页面都新增页面页签，并保留上一个页面页签。同一个系统内不得同时混用这两种打开机制。

**对象标题摘要：** `bepObjectTitle` 是“图片 + 主标题 + 状态 + 标签 + 副标题”的复合组件，只表达对象摘要本身；不包含右侧操作按钮、Tabs、页头容器或页面打开机制。

**页头标题型定位：** `bepHeaderTitle` 不是第三种系统打开机制，而是在 `TopBar + Breadcrumb` 或 `TopBar + PageTabs` 基础下方增加的业务对象标题摘要模块。其内部由 `bepObjectTitle` + 可选右侧操作按钮 + 可选标题型 Tabs 组成。

**页签边界：** `bepTabs` 是系统级 PageTabs，不是业务状态/业务视图切换控件；不得用于“待处理/已完成/全部”等业务视图切换。`bepCardTabs` 是内容卡片内局部页签，才使用底部分割线和选中态下划线。对象标题内置 Tabs 由 `bepHeaderTitle.tabs` 承载，仅在当前页面应用对象标题摘要且 Tabs 控制整个页面主内容时使用；如果 Tabs 只控制某个内容卡片内部，则必须使用 `bepCardTabs`。当前页面不应用对象标题摘要时，不得使用对象标题内置 Tabs，只能使用 `bepCardTabs` 做内容切换。三者不得混用样式和语义。

**页签内容渲染边界：** 所有业务 Tabs 必须以 `activeTab` 为分支渲染当前页签内容。`activeTab:0` 时只渲染第一个页签内容，`activeTab:1` 时只渲染第二个页签内容；不得为了展示完整信息把多个页签内容连续堆叠在一个页面里。`商品信息 / 操作记录` 这类对象级 Tabs 中，操作记录只属于第二个页签，不能出现在商品信息页签的描述列表或内容 Card 中。

**页头标题型：** `bepHeaderTitle` 用于详情页 Header 下方的标题摘要区，组件名为“页头标题型”。操作按钮和 Tabs 均可按需求显示/隐藏，支持四种组合：标题、标题+操作按钮、标题+Tabs、标题+操作按钮+Tabs。操作按钮必须使用 `bepButton`，Tabs 使用组件内置 32px 标题型 Tabs，不得手写。

**字段与颜色规则：** 只读详情字段默认使用 `bepDescriptions` 内置 label/value 色阶，不手写字段颜色；普通表格内容使用默认正文色。只有链接、状态、风险、禁用、辅助说明可改变颜色；编辑态输入、校验、提示样式不得直接搬到详情态。

**详情页分组关系：** 详情页多个描述分组必须先判断业务亲近关系。相近分组放同一个页面级 Card，用一个 `bepDescriptions` 的多个 `sections`；亲近关系弱的分组拆成独立页面级 Card。不得机械照搬编辑页锚点分区，也不得把弱相关信息强行塞进同一个描述列表。

**描述列表 value 类型：** `bepDescriptions` 仍只有 `label + value` 一种信息结构；`标题：内容 + 标签`、`标题：标签`、`标题：附件/链接`、`标题：图片/视频` 都属于描述列表。页面脚本优先传 `value / tags / link / links / attachments / media`，让组件内部调用 `bepDescTags / bepDescLinks / bepDescAttachments / bepDescMedia`；已有固定组件时不得手写矩形、图标、文字坐标。

**动态记录边界：** 操作记录、审核记录、库存流水、价格变更历史等按时间顺序展示的内容，不属于描述列表或普通内容块，必须使用时间轴（`bepTimeline`）标准组件。时间轴支持基础样式和带描述样式，页面脚本只传 `title / time / desc / status / lineType` 等数据；不得在页面脚本中自造 `TimelineItem`、`LogRow`、圆点、连线或时间轴局部结构。

### 弹窗 / 抽屉 / 表单

| 需要 | 函数 | 宽度规格 |
|---|---|---|
| 表单/详情弹窗（含遮罩，居中）| `bepModal(title, contentNode, opts)`；opts 支持 `{variant:'form'|'detail'}`；form 默认有底部按钮，detail 默认无底部按钮 | 420/640/800px |
| 提醒弹窗 / 对话框 POP | `bepAlertModal(title, message, opts)` | 420px |
| 抽屉（从右侧滑入）| `bepDrawer(title, contentNode, opts)`；opts 支持 `{variant:'form'|'detail'}`；form 默认有底部按钮，detail 默认无底部按钮 | 420/640/800px |
| 表单项（label+控件）| `bepFormItem(label, ctrlNode, {labelW, required, error})` | |

### 筛选区

| 需要 | 函数 |
|---|---|
| 单行筛选+操作按钮（特殊）| `bepFilterRow(filters, '+ 新增', TABLE_W)` |
| 多条件3列网格 | `bepFilterGrid(filters, TABLE_W, collapsed)` |

### 常用颜色常量

```javascript
BEP_C.primary   // #006D9B  主色（按钮/链接/激活）
BEP_C.danger    // #FE5E54  危险/删除
BEP_C.success   // #3BBB3E  成功/启用
BEP_C.warning   // #FFA645  警告
BEP_C.pageBg    // #F0F2F5  页面大背景
BEP_C.white     // #FFFFFF
BEP_C.secondary // #F5F7FA  二级背景/子行
B               // {r:0,g:0,b:0}  黑色快捷引用
W               // {r:1,g:1,b:1}  白色快捷引用
```

### 常用布局常量

```javascript
CANVAS_W  = 1440;  CANVAS_H = 900
SIDE_W    = 208;   HDR_H    = 96   // TopBar48 + TitleBar48
OUTER_PAD = 16;    CARD_PAD = 24
TABLE_W   = 1152   // 1440标准页：1440-208-16×2-24×2；实际按屏幕和布局计算
ROW_H     = 48     // 表格行高
```

---

## 详细规范（按需读取）

| 任务 | 读哪个文件 |
|---|---|
| **需求理解/角色/优先级/主动发现问题/前置说明卡** | `references/design-process.md` ← 决策层入口，先看这里 |
| **模块划分/导航层级/页面清单/页面关系** | `references/information-architecture.md` |
| **判断页面类型与结构骨架** | `references/page-type-rules.md` |
| **交互形态/状态完整性/异常场景/方案对比** | `references/interaction-design.md` |
| **信息密度/操作距离/PC 效率基线** | `references/pc-ux-principles.md` |
| **交付前八维设计自检与交付说明模板** | `references/design-review.md` |
| **自动质量校验六维机制 / Design QA 报告 / 修复闭环** | `references/design-qa.md` ← 质量验收层入口 |
| **选择模板与组件落地结构** | `references/page-templates.md` ← 执行层入口 |
| 内置 RAG 参考层 | `references/rag/README.md` |
| 组件中文命名/团队沟通口径 | `references/component-glossary.md` |
| 布局坐标/弹窗抽屉尺寸 | `references/page-layouts.md` |
| 组件用法判断（何时用哪种）| `references/components-core.md` / `references/components-layout.md` |
| 高级表格/业务树状表格/多级表头 | `references/advanced-table-rules.md` |
| 筛选区详细规则 | `references/filter-rules.md` |
| 表单标签规则 | `references/form-rules.md` |
| 颜色/字号/间距真源 | `references/design-tokens.md` |
| 图标完整列表 | `references/icons.md` |
| 脚本模板/禁止事项 | `references/scripter-rules.md` |
| skill 迭代清单（按日记录）| `references/iteration-log.md` |

---

## 样例索引

> 优先参考已通过当前 `build + validate-page` 的样例；历史样例只用于理解业务字段组织和交互状态，不得照抄旧布局写法。新页面仍必须优先调用 `scripts/bep-components.js` 中的 `bep*` 标准函数。

| 场景 | 已校验优先参考 |
|---|---|
| 标准列表页 | `pages/hr/list.js` |
| 页头系统模式 | `pages/header/variants.js` |
| 侧边栏菜单项 | `pages/sidebar/variants.js` |
| 描述列表 value 类型 | `pages/description-list/value-types.js` |
| 表单页/校验状态 | `pages/form-demo/form-demo.js` |
| 标准表格 / 迷你表格 | `pages/table/variants.js` |
| 树状表格 | `pages/tree-table/variants.js` |
| 其他高级表格 | `pages/advanced-table/variants.js` |
| 按钮 / 按钮组 | `pages/button/variants.js` |
| 输入框 / 组合输入框 | `pages/input/variants.js` |
| 文本域 / 多行输入框 | `pages/textarea/variants.js` |
| 数字输入框 / 组合数字输入框 | `pages/input-number/variants.js` |
| 选择器 / 多选选择器 / 下拉菜单 | `pages/select/variants.js` |
| 级联选择器 | `pages/cascader/variants.js` |
| 日期选择器 | `pages/date/variants.js` |
| 时间选择器 | `pages/time/variants.js` |
| 日期时间选择器 | `pages/date-time/variants.js` |
| 树形组件 | `pages/tree/variants.js` |
| 复杂树形 | `pages/tree-complex/variants.js` |
| 树形选择器 | `pages/tree-select/variants.js` |
| 复杂树形选择面板 | `pages/tree-complex-picker/variants.js` |
| 开关 | `pages/switch/variants.js` |
| 评分 | `pages/rate/variants.js` |
| 单选组 / 多选组 | `pages/radio-checkbox/variants.js` |
| 上传 | `pages/upload/variants.js` |
| 步骤条 | `pages/steps/variants.js` |
| 标示 / 标签 | `pages/tag/variants.js` |
| 分页器 | `pages/pagination/variants.js` |
| 全局提示 | `pages/message/variants.js` |
| 警告提示 | `pages/alert/variants.js` |
| 内容卡片 / 新增卡片 | `pages/card/variants.js` |
| 指标数据卡片 | `pages/metric-card/variants.js` |
| 图表容器 | `pages/chart-card/variants.js` |
| 看板表格 / 排行榜 | `pages/dashboard-modules/variants.js` |
| 页头标题型 | `pages/header/title-type.js` |
| 时间轴 | `pages/timeline/variants.js` |
| 提醒弹窗 / 对话框 POP | `pages/alert-modal/variants.js` |
| 表单/详情弹窗框架 | `pages/modal/variants.js` |
| 表单/详情抽屉框架 | `pages/drawer/variants.js` |

**待同步历史样例：** `pages/sales-contract/*`、`pages/menu-permission/*`、`pages/physical-product/*`、`pages/contract-management/list.js`、`pages/hr/detail.js`、`pages/hr/list-employee.js`。这些页面早于 `pageFrame`、`COL_WIDTH_AUDIT`、操作列复合列等规则，只能参考业务结构，不能作为代码模板。

---

## 脚本模板

> **铁律**：所有元素必须挂在 `pageFrame` 下，禁止直接 `figma.currentPage.appendChild`（否则各部分在 Figma 中是分离的独立元素）。

```javascript
// 使用方式：运行 node tools/build.js <页面名> 合并后粘贴到 Figma Scripter

var CANVAS_W = 1440, CANVAS_H = 900;
var SIDE_W = 208, HDR_H = 96, OUTER_PAD = 16, CARD_PAD = 24;
var TABLE_W = CANVAS_W - SIDE_W - OUTER_PAD*2 - CARD_PAD*2;  // 1152

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  // 页面根容器（所有元素统一挂在此 Frame 下）
  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'页面名称', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  // 侧边栏 → pageFrame.appendChild(sidebar)
  // 页头   → pageFrame.appendChild(header)
  // 内容卡片 → pageFrame.appendChild(card)

  var header = bepHeader('页面标题', ['模块', '当前页'], CANVAS_W - SIDE_W);
  header.x = SIDE_W; header.y = 0;
  pageFrame.appendChild(header);

  var card = bepFrame(CANVAS_W - SIDE_W - OUTER_PAD*2, 600, {name:'Card', r:4, clip:true});
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD; card.y = HDR_H + OUTER_PAD;
  // 页面级 Card 默认不加 effects 阴影。
  pageFrame.appendChild(card);

  // ... 在 card 内调用 bep* 函数

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 完成');
}
buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
```

---

## 构建与验证

> 生成脚本后必须执行构建，确保输出可直接粘贴到 Figma Scripter。

### 步骤

1. **将页面源码保存到 `pages/<模块>/<页面>.js`**（不是 scripts/ 根目录）
2. **运行构建**：
   ```bash
   cd scripts && node tools/build.js <模块>/<页面>
   ```
   例：`node tools/build.js hr/list`、`node tools/build.js sales-contract/drawer-add`
3. **运行静态校验**：
   ```bash
   node tools/validate-page.js <模块>/<页面>
   ```
4. **验证输出**：检查 `pages/<模块>/dist/<页面>.js` 是否存在且非空
5. **复制到剪贴板**（可选）：
   ```bash
   cat pages/<模块>/dist/<页面>.js | pbcopy
   ```

### 自动质量校验（Design QA · 必做）

代码校验通过后，执行自动化 Design QA（六维校验 + 自动修复 + 二次校验 + 报告）：

```bash
node tools/design-qa.js <模块>/<页面>              # 基础六维校验
node tools/design-qa.js <模块>/<页面> --prd <文件> --figma <文件>  # 带真源
```

- 六维：D1 需求还原 / D2 设计规范 / D3 组件引用 / D4 组件使用 / D5 视觉还原 / D6 交互逻辑。
- 五态：`PASS / FAIL / WARNING / BLOCKED / NOT CHECKED`；**没实际检查的不得标 PASS**。
- 缺 PRD → D1 记 `BLOCKED`；缺 Figma 真源 → D5 记 `BLOCKED`；语义判断层记 `NOT CHECKED`。
- 报告：`pages/<模块>/dist/design-qa-<页面>.md` 与 `.json`，是交付必要组成。
- 完整机制、规则清单与修复策略见 `references/design-qa.md`。

### 设计校验（决策层 · 必做）

Design QA 通过后，按 `references/design-review.md` 过一遍八维自检，顺序不可颠倒：

```
产品逻辑 → 信息架构 → 交互 → 页面完整性 → 组件使用 → 状态完整性 → 视觉层级 → PC 体验
```

阻塞项必须修复（确因外部条件无法修复时，在交付说明中列为已知问题并写清影响范围）；建议项记入交付说明。同时按该文件 §九 模板输出交付说明。

### 验收清单（执行层：代码与组件）

- 页面源码位于 `pages/<模块>/<页面>.js`，构建产物位于 `pages/<模块>/dist/<页面>.js`
- 根容器为 `pageFrame`，除 `figma.currentPage.appendChild(pageFrame)` 外，不直接向 currentPage 添加节点
- 标准组件优先调用 `bep-components.js` 中的 `bep*` 函数
- 表格数据单元格使用 `bepTableText` / `bepTruncText`，操作列使用 `bepActionCell`
- 页面级 Card 默认无阴影；只有弹窗、抽屉、冻结列、悬浮层等特殊场景才加 `effects`
- 高级表格、树状层级、多级表头、列设置、拖拽排序等场景已读取 `references/advanced-table-rules.md`
- 筛选区、表单标签、弹窗/抽屉尺寸符合对应 references
- 生成脚本无未定义 `bep*` 函数调用，dist 文件非空
- 源码中通过 `bepIcon(...)`、标准组件图标参数或 `iconKey` 等对象属性引用的图标，必须存在于 `BEP_ICONS`，并在 dist 构建产物中保留
- 已执行 `node tools/design-qa.js <模块>/<页面>`，Design QA 报告已生成；无未处理的 `FAIL`，`BLOCKED`/`NOT CHECKED` 已按报告补条件或人工确认
- 如存在示例数据、缺失组件或不确定规范，交付说明中明确列出

### 常见问题

- `❌ 格式错误，请使用 <模块>/<页面>` → 参数格式必须是 `hr/list`，不能带 `.js` 后缀
- 构建失败 → 检查源文件是否调用了 bep-components.js 中未定义的函数
- 输出为空 → 确认源文件位于 `pages/` 目录下，而非 `scripts/` 根目录
- 静态校验失败 → 先修复 error；warning 可交付但必须在说明中解释

### 查看所有可构建页面

```bash
node tools/build.js --list
```

---

## 项目结构

```
bep-admin-ui-brand/
├── scripts/bep-components.js     ← 组件库（直接调用）
├── scripts/tools/build.js         ← 合并页面脚本
├── scripts/tools/validate-page.js ← 静态校验页面铁律（执行层）
├── scripts/tools/design-qa.js     ← Design QA 主编排器（质量验收层）
├── scripts/tools/qa/              ← Design QA 规则模块（六维/修复/报告/依据）
├── references/design-qa.md        ← Design QA 机制说明
├── references/                   ← 详细规范（按需读）
└── pages/                        ← 已生成页面（dist/ 下含 design-qa 报告）
    ├── menu-permission/          M-01~M-06
    └── sales-contract/           列表/抽屉/详情等
```
