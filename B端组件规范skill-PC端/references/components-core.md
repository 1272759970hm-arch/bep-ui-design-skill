# 基础组件规格

> 只记录"用哪个、什么时候用、参数怎么选"。
> 具体实现见 scripts/bep-components.js；颜色数值见 references/design-tokens.md。

---

## bepButton — 按钮

**层级：** 复合组件

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:1803` / `基础-按钮`；组件路径 `1.Basics/1.Button按钮`。

**公开入口：** `bepButton(label, type, height, opts)`

### 样式属性
- 尺寸：高度支持 `32` 默认、`36` 大按钮（Figma: `Default-Big`）、`28` 小按钮（Figma: `Default-Small`）。
- 宽度：由内容宽度 + 左右 padding 反推，不固定宽度；28px 小按钮左右 padding 为 8px，32/36px 按钮左右 padding 为 16px；内容宽度 = 文字宽度 + 图标宽度 + 图标文字间距。
- 圆角：r=4。
- 字体：PingFang SC Regular，14px，line-height 22。
- primary：背景 `#006D9B`，文字白色，无描边。
- secondary：背景白色，文字黑色 65%，描边黑色 15%，1px inside。
- primary-outline / frame：背景白色，文字 `#006D9B`，描边 `#006D9B`，1px inside；`frame` 为 Figma 类型名兼容别名。
- danger：背景 `#FE5E54`，文字白色，无描边。
- text：无背景、无描边，文字 `#006D9B`。
- dashed：背景白色，文字黑色 65%，描边黑色 15%，1px inside，虚线描边。
- 带图标按钮：28/32/36px 按钮图标均为 16px，图标与文字间距均为 4px；图标颜色跟随按钮文字色。
- 纯图标按钮：宽高相等，默认 `32×32`；图标居中，图标颜色跟随按钮文字色。

### 状态交互
- default：按 type 对应样式展示。
- hover：Figma 真源提供 hover 态；primary 使用 `#338AAF`，primary-outline / secondary / dashed / text 使用 `#338AAF` 作为文字或描边色，danger 使用 `#FE6D65`。
- highlight/高亮态：Figma 真源命名为 `HighLight`，标注为“已选”；primary 使用 `#00628C`，primary-outline / secondary / dashed / text 使用 `#00628C` 作为文字或描边色，danger 使用 `#E5554C`。
- focus：Focus 指键盘 Tab 选中按钮时的焦点样式；当前 Figma 真源未提供独立 focus 外圈，页面生成不得自行编造 focus 样式。
- disabled：Figma 真源中 Primary / Danger / Frame / Secondary / Dashed / Text 均有 Disable 态；通过 `opts.disabled:true` 表达，不得用 opacity 或手写灰色按钮近似。Primary 禁用背景 `#7FB6CD`、白字；Danger 禁用背景 `#FEAEAA`、白字；Frame 禁用文字/描边 `#66A7C3`；Secondary/Dashed 禁用白底、黑色 25% 文字、黑色 10% 描边；Text 禁用文字 `#66A7C3`。
- loading：通过 `opts.loading:true` 表达，自动视作 disabled，不允许点击；内置调用 BeP 图标 `Line/Loading`，图标在交互/前端实现中旋转，Figma 静态稿节点命名为 `LoadingRotating`。

### 内容约束
- `label` 为按钮文字，默认不换行、不截断，按钮宽度随文字反推。
- 按钮文字应是明确命令，不写说明性长句。
- 按钮文字不得用空格撑宽，例如不得写 `查 询`、`重 置`；应写 `查询`、`重置`。
- 同一按钮组内文案粒度保持一致，例如“取消 / 确定”、“重置 / 查询”。
- 图标按钮必须走 `opts.iconKey` 或 `opts.iconOnly`，图标 key 必须存在于 BeP 图标库（`BEP_ICONS`）；引用不到图标时先提出缺口，不得手写图标+按钮结构。
- `opts.iconPosition` 默认 `left`；筛选区“展开/收起”为例外，使用 `iconPosition:'right'`，文字在前、箭头在后。

### 使用场景
- `primary`：每个区域最重要的一个操作，如查询、确定、新增、保存。
- `secondary`：与 primary 配对的次要操作，如取消、重置。
- `primary-outline`：详情页页头标题型中的次主操作，如编辑。
- `danger`：破坏性操作，如删除、终止、下架；单独出现或与 secondary 配对。
- `text`：工具栏文字链接，如展开、收起、详情；无背景无边框。
- `dashed`：上传、导入、添加类轻量操作或需要弱化视觉重量的辅助入口。
- 带图标按钮：按钮文字仍是主识别，图标只辅助识别，例如下载、导出、搜索。
- 纯图标按钮：仅用于空间紧凑且图标语义明确的工具按钮；如图标含义不清，必须使用“图标+文字”。
- `loading`：提交、保存、确认等异步处理中使用。
- `disabled`：无权限、条件未满足、流程不可操作时使用。
- `state:'hover'|'highlight'`：默认只用于组件样例或用户明确要求展示特殊状态；业务页面默认生成 default 态。
- 弹窗/抽屉底部：`[取消 secondary] + [确定 primary]`，间距 8px，右对齐。
- 筛选区按钮组：`[查询 primary] + [重置 secondary]`，间距 8px，右对齐。
- 页头标题型右侧操作：使用 `bepButton`，按钮间距 8px，高 32px。

### 禁止事项
- 表格操作列不用按钮（`bepButton`），必须使用操作列（`bepActionCell`）。
- 不得在页面脚本中手写矩形+文字模拟按钮。
- 不得固定按钮宽度来凑齐布局；按钮宽度由文字和 padding 反推。
- 不得把按钮用于状态展示；状态展示使用状态标签（`bepTag`）。

### 参数/API
```javascript
bepButton('查询', 'primary', 32)
bepButton('重置', 'secondary', 32)
bepButton('编辑', 'primary-outline', 32)
bepButton('删除', 'danger', 32)
bepButton('展开', 'text', 32)
bepButton('导入', 'dashed', 32)
bepButton('下载', 'secondary', 32, { iconKey:'Line/Download' })
bepButton('', 'secondary', 32, { iconKey:'Line/Search', iconOnly:true })
bepButton('保存中', 'primary', 32, { loading:true })
bepButton('提交', 'primary', 32, { disabled:true })
bepButton('已选', 'primary', 32, { state:'highlight' })
bepButton('收起', 'text', 32, { iconKey:'Line/PutAway-Arrow', iconPosition:'right' })
```

---

## bepButtonGroup — 按钮组

**层级：** 复合组件

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:1803` / `按钮组`。

**公开入口：** `bepButtonGroup(actions, opts)`

### 样式属性
- 布局：水平排列，默认间距 8px。
- 高度：默认 32px，可通过 `opts.height` 传入 28/32/36。
- 宽度：默认由子按钮宽度 + 间距反推；传 `opts.width` 时可配合 `align:'right'` 右对齐。
- 子按钮：全部调用 `bepButton`，不在按钮组内重写按钮样式。

### 状态交互
- default：按子按钮各自 type 展示。
- hover/highlight/disabled/loading：由子按钮动作项透传给 `bepButton`。
- focus：按钮组本身无独立 focus；焦点规则由子按钮承载。

### 内容约束
- `actions` 每项为按钮配置对象，可传 `label / type / height / iconKey / iconOnly / iconPosition / loading / disabled / state`。
- 纯图标按钮必须传 `iconKey`。
- 按钮文案不得用空格撑宽。

### 使用场景
- 适用：筛选区查询/重置、弹窗/抽屉底部、页头标题型右侧操作、普通工具栏。
- 不适用：表格操作列；表格操作列必须使用操作列（`bepActionCell`）。
- 常见组合：`[secondary + primary]`、`[primary-outline + primary]`、`[primary + secondary + text]`。

### 禁止事项
- 禁止页面脚本手写按钮组坐标来模拟标准按钮组。
- 禁止把表格行内操作做成按钮组。

### 参数/API
```javascript
bepButtonGroup([
  { label:'重置', type:'secondary' },
  { label:'查询', type:'primary' },
], { align:'right', width:240 })
```

---

## bepInput — 文本输入框

**层级：** 复合组件

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:887` / `输入框`；组件路径 `2.DataEntry/1.Input输入框/单行输入`。

**公开入口：** `bepInput(placeholder, width, height, opts)`

### 样式属性
- 尺寸：Figma Normal 为 `280×32`；页面可按布局传入宽度，高度支持 28/32/36，默认 32。
- 背景：白色 `#FFFFFF`。
- 圆角：r=2。
- 描边：黑色 15%，1px inside。
- 字体：PingFang SC Regular，14px，line-height 22。
- 占位文字：黑色 25%。
- 已输入文字：黑色 85%。
- 内边距：左 12px；右侧图标距右 12px；文字垂直居中，`y = (height - 22) / 2`。
- 右侧图标：16×16，y=8；清除用 `Fill/Close`，异常用 `Fill/Abnormal`，提示用 `Line/Remind`。
- 前缀/后缀：高度 32；默认宽度由文字 + 24px 反推，最小 50/52；前缀文字黑色 65%，后缀文字 `#666666`。

### 状态交互
- default：白底、黑色 15% 描边、占位文字黑色 25%。
- complete：通过 `opts.value` 或 `state:'complete'` 表达；白底、黑色 15% 描边、文字黑色 85%。
- hover：通过 `state:'hover'` 表达；描边主色 `#006D9B`。
- focus：Figma 真源未提供独立 Focus 态；业务页面默认不单独绘制 focus，前端实现可复用 hover 边框色。
- disabled：通过 `opts.disabled:true` 表达；背景黑色 4%，描边黑色 15%，占位文字黑色 25%。
- readonly：Figma 真源未独立定义 Readonly；规范暂不公开 readonly，业务只读展示优先使用描述列表（`bepDescriptions`）。
- error：通过 `opts.error:true` 表达；描边危险色 `#FE5E54`，右侧异常图标 `Fill/Abnormal`。错误说明使用 `opts.errorText`，12px Regular，line-height 16，危险色。

### 内容约束
- `placeholder` 只用于占位提示，默认 `请输入`。
- `opts.value` 用于已输入文字；输入框文字单行显示，超出时截断，不撑宽控件。
- `opts.clearable:true` 仅在存在 `value` 时展示清除图标。
- `opts.prefixText` / `opts.suffixText` 用于固定文本前后缀，例如 `http`、`单位`。
- `opts.suffixIconKey` 仅允许引用 BeP 图标库已有 key；引用不到图标时先提出缺口。
- 自由输入字段使用输入框，如姓名、编号、关键词搜索。
- 有固定枚举值的字段使用选择器（`bepSelect`），不要用输入框。
- 单个日期字段使用单日期（`bepDate`），日期范围字段使用日期区间（`bepDateRange`）。
- 数字 + 步进场景使用数字输入框（`bepInputNumber`）。
- 表单中的字段标题由表单项（`bepFormItem`）负责，输入框本身不包含 label。

### 使用场景
- 筛选区：由多条件筛选区（`bepFilterGrid`）按 `filter.type:'input'` 自动生成，不需要页面手动计算宽度。
- 抽屉表单：宽度按 `DRW_W - FORM_PAD * 2 - LABEL_W - LABEL_GAP` 计算。
- 弹窗表单：宽度按 `MODAL_W - PAD * 2 - LABEL_W - LABEL_GAP` 计算。
- 普通表单页：与表单项（`bepFormItem`）组合使用，所有行保持统一 label 宽度和控件宽度。

### 禁止事项
- 不得在页面脚本中手写矩形 + 占位文字模拟输入框。
- 不得用输入框近似下拉、日期、日期区间、数字输入框。
- 不得在输入框内部手写单位、清除按钮、异常图标或提示图标；必须通过 `bepInput` 参数表达。
- 不得直接修改输入框描边来模拟错误态；错误态通过 `bepInput(...,{error:true})`，错误说明通过 `bepFormItem` 或 `opts.errorText` 承载。

### 参数/API
```javascript
bepInput('请输入', 200, 32)
bepInput('请输入关键词', 240, 32)
bepInput('请输入', 280, 32, { value:'输入完毕' })
bepInput('请输入', 280, 32, { state:'hover' })
bepInput('请输入', 280, 32, { disabled:true })
bepInput('请输入', 280, 32, { error:true, errorText:'异常说明提示' })
bepInput('请输入', 280, 32, { value:'已输入', clearable:true })
bepInput('请输入', 280, 32, { prefixText:'http' })
bepInput('请输入', 280, 32, { suffixText:'单位' })
bepInput('请输入', 280, 32, { suffixIconKey:'Line/Remind' })
```

---

## bepTextarea — 文本域 / 多行输入框

**层级：** 复合组件

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:974` / `文本框-Default`；组件路径 `2.DataEntry/1.input输入框/多行输入/文本框-Default`。

**公开入口：** `bepTextarea(placeholder, width, height, opts)`

### 样式属性
- 尺寸：Figma Default 为 `682×134`；默认宽高同真源，可按表单布局传入宽高。
- 背景：白色 `#FFFFFF`。
- 圆角：r=2。
- 描边：黑色 15%，1px inside。
- 字体：PingFang SC Regular，14px，line-height 22。
- 占位文字：黑色 25%，x=12，y=4。
- 已输入文字：黑色 85%，x=12，y=4，多行区域内换行。
- 计数：右下角 `0/100`，PingFang SC Regular，10px，line-height 18，黑色 25%。
- 可拉伸图标：右下角 10×10，使用 BeP 图标 `Line/Field`，黑色 25% / `#BBBBBB`。

### 状态交互
- default：白底、黑色 15% 描边、占位文字黑色 25%，显示 `0/100` 和右下可拉伸图标。
- complete：通过 `opts.value` 或 `state:'complete'` 表达；文字黑色 85%，计数按内容长度展示。
- hover：按普通输入框规则继承，描边主色 `#006D9B`；业务页面默认不主动展示静态 hover。
- focus：Figma 真源未提供独立 Focus 态；前端实现可复用 hover 边框色，页面生成不单独绘制 focus。
- disabled：按普通输入框规则继承；背景黑色 4%，描边黑色 15%。
- readonly：不公开；只读长文本优先使用描述列表（`bepDescriptions`）长文本 value。
- error：按普通输入框规则继承；描边危险色 `#FE5E54`，错误说明用 `opts.errorText`。

### 内容约束
- `placeholder` 默认 `请输入`。
- `opts.value` 用于已输入多行文字；长文本在文本域内部换行，不撑宽控件。
- `opts.maxLength` 默认 100；`opts.count` 可显式传入当前计数，否则按 `value` 字符数计算。
- `opts.resizable:false` 可隐藏右下可拉伸图标；默认显示。
- 文本域只承载纯文本多行录入，不承载富文本、图片、附件或标签。

### 使用场景
- 适用：备注、说明、描述、规则内容、长文本录入。
- 不适用：单行关键词/编号/名称输入用文本输入框（`bepInput`）；只读详情长文本用描述列表；富文本编辑用后续富文本组件。
- 常见组合：表单项（`bepFormItem`）、弹窗/抽屉表单、多条件表单页。

### 禁止事项
- 不得在页面脚本中手写矩形 + 占位文字 + 字数统计模拟文本域。
- 不得用拉高的 `bepInput` 近似文本域。
- 不得手写右下角拉伸图标；必须使用 `Line/Field`。
- 不得用文本域展示只读详情长文本。

### 参数/API
```javascript
bepTextarea('请输入', 682, 134)
bepTextarea('请输入', 682, 134, { value:'这是一段多行输入内容' })
bepTextarea('请输入', 320, 104, { state:'hover' })
bepTextarea('请输入', 320, 104, { disabled:true })
bepTextarea('请输入', 682, 104, { error:true, errorText:'异常说明提示', count:120, maxLength:100 })
```

---

## bepInputGroup — 组合输入框

**层级：** 复合组件

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:887` / `组合输入框`；组件路径 `2.DataEntry/1.Input输入框/单行输入/组合输入框-*`。

**公开入口：** `bepInputGroup(selectPlaceholder, inputPlaceholder, width, opts)`

### 样式属性
- 结构：左侧选择器 + 右侧输入框。
- 尺寸：Figma 示例约 `280×32`；左侧选择器默认 86px，右侧输入区占剩余宽度。
- 分割：两个控件描边贴合，交界处重叠 1px，避免双线。
- 图标：左侧选择器使用下拉箭头，右侧输入可带 `Line/Remind` 提示图标。

### 状态交互
- default：两个区域均白底、黑色 15% 描边。
- selector hover：左侧选择器高亮；右侧输入默认。
- input hover：右侧输入高亮；左侧选择器默认。
- expanded：下拉展开选项属于下拉菜单（Dropdown）能力，不在组合输入框内手写。
- disabled/error：Figma 当前节点未给组合输入框完整 disabled/error 形态；如业务需要，先补组合状态真源。

### 内容约束
- 左侧只放选择器文本，右侧只放输入内容。
- 不得把下拉菜单列表绘制在组合输入框组件内部；展开面板应由下拉组件承载。

### 使用场景
- 适用：证件类型 + 证件号、协议前缀 + 地址、类型选择 + 关键字输入。
- 不适用：普通单字段输入；普通输入用文本输入框（`bepInput`）。

### 禁止事项
- 禁止页面内手写两段输入框拼接。
- 禁止用组合输入框替代普通选择器。

### 参数/API
```javascript
bepInputGroup('请选择', '请输入', 280)
bepInputGroup('身份证', '834783297482377', 280, { value:'834783297482377', inputHover:true })
```

---

## bepSelect — 选择器

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:791` / `数据录入-选择器`
**公开入口：** `bepSelect(placeholder, width, height, opts)`

### 样式属性
- 尺寸：默认 `280x32`。
- 颜色：Default/Complete 黑色 15% 描边；Hover/Selected 主色 `#006D9B` 描边；Disabled 黑色 4% 背景，整体 opacity 0.5。
- 字体：14px Regular，line-height 22；placeholder 黑色 25%，已选值黑色 85%。
- 圆角/描边：r=2，1px inside stroke。
- 间距/布局：左内边距 12；右侧图标 16px，x=`width-28`，y=8。
- 图标：收起状态使用 `Line/DropDown-Arrow`；展开/Selected 状态使用 `Line/PutAway-Arrow`。

### 状态交互
- default：占位文字 `请选择`，黑色 15% 描边。
- hover：主色描边，仍使用向下箭头。
- complete：显示已选值，黑色 15% 描边。
- complete-hover：已选值 + 主色描边。
- selected/open：主色描边，箭头向上；下方浮层必须使用下拉菜单（`bepDropdown`）。
- disabled：不可点击，黑色 4% 背景，整体 opacity 0.5。

### 内容约束
- 选择器用于固定枚举值字段；显示单个选中项。
- 文本单行截断，不换行。
- 只有选择器展开态可使用向上箭头；普通 default/hover/complete/disabled 均使用向下箭头。

### 使用场景
- 适用：状态、类型、分类、所属组织等固定枚举字段。
- 不适用：自由文本输入用输入框（`bepInput`）；多选字段用多选选择器（`bepMultiSelect`）；展开选项列表用下拉菜单（`bepDropdown`）。
- 常见组合：表单项、筛选区、组合输入框左侧选择器、组合数字输入框左侧选择器。

### 禁止事项
- 禁止用输入框近似选择器。
- 禁止页面脚本手写矩形和箭头。
- 禁止在选择器内部手写展开选项；展开浮层必须使用下拉菜单。

### 参数/API
```javascript
bepSelect('请选择', 280, 32)
bepSelect('请选择', 280, 32, { value:'已选择' })
bepSelect('请选择', 280, 32, { state:'selected' })
```

---

## bepMultiSelect — 多选选择器

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:791` / `Select多选选择器`
**公开入口：** `bepMultiSelect(placeholder, values, width, height, opts)`

### 样式属性
- 尺寸：默认 `280x32`。
- 颜色/圆角/描边：外框继承选择器；已选项 Tag 默认黑色 6% 背景、`#D9D9D9` 边框、r=2。
- 字体：Tag 文本 14px Regular，line-height 22，黑色 45%。
- 图标：Tag 关闭图标使用 `Fill/Close` 14px；选择器箭头同 `bepSelect`。
- 间距：Tag y=5，Tag 间距 4px，左起 8px。

### 状态交互
- default：无已选项，显示 placeholder。
- hover：外框主色描边。
- complete：显示已选 Tag。
- selected/open：外框主色描边，箭头向上。
- disabled：外框禁用态；Tag 使用禁用样式。

### 内容约束
- 多选值必须以 Tag 呈现；超出可见区域时截断，不撑高单行选择器。
- 删除图标只表达移除单个已选项，不得替代清空全部操作。

### 使用场景
- 适用：多状态、多分类、多门店、多标签等多选字段。
- 不适用：单选字段用选择器（`bepSelect`）；大量已选项需要完整展示时应结合专门的已选列表或弹窗，不在选择器内强行换行。

### 禁止事项
- 禁止页面脚本手写多选 Tag、关闭图标或箭头。

### 参数/API
```javascript
bepMultiSelect('请选择', ['选项一', '选项二'], 280, 32)
bepMultiSelect('请选择', ['选项一'], 280, 32, { state:'selected' })
```

---

## bepDropdown — 下拉菜单

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:791` / `Dropdown下拉菜单`
**公开入口：** `bepDropdown(options, width, opts)`

### 样式属性
- 尺寸：默认宽 `280`；选项行高 36；Figma 示例高度 152。
- 颜色：浮层白底 r=2；hover 行背景 `#F5F7FA`，hover/selected 文字主色；默认文字黑色 65%；disabled 行 opacity 0.5。
- 字体：选项文字 14px Regular，line-height 22，x=16，y=7。

### 状态交互
- default：普通选项。
- hover：浅灰背景，文字主色。
- selected：选中项文字主色，可使用浅蓝背景。
- disabled：选项不可选，整体弱化。
- empty：暂无数据状态，显示 `暂无数据`。

### 内容约束
- 选项文本单行截断，不换行。
- 下拉菜单只作为选择器展开浮层，不单独用于页面内容列表。

### 使用场景
- 适用：选择器或多选选择器 selected/open 状态下的展开选项。
- 不适用：页面内普通列表、表格、菜单导航。

### 禁止事项
- 禁止页面脚本手写下拉选项行、hover 背景或暂无数据状态。

### 参数/API
```javascript
bepDropdown([
  { label:'选项一', state:'hover' },
  { label:'选项二' },
  { label:'选项三', state:'disabled' },
  { label:'选项四', state:'selected' }
], 280)
bepDropdown([], 280, { empty:true })
```

---

## bepCascader / bepCascaderPanel — 级联选择器

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `696:27650` / `级联选择器`
**公开入口：** `bepCascader(placeholder, width, height, opts)` / `bepCascaderPanel(columns, opts)`

### 样式属性
- 尺寸：触发框默认 `280x32`，继承选择器外框；单选展开面板 Figma 示例 `356x152`，三列默认宽 `128 / 128 / 100`；多选展开面板 Figma 示例 `364x152`，三列默认宽 `128 / 128 / 108`。
- 颜色：触发框继承选择器；展开面板白底 r=2，列分隔线黑色 10%，当前路径/hover 行背景 `#F5F7FA`，激活文字主色 `#006D9B`。
- 字体：选项文字 14px Regular，line-height 22；默认黑色 65%，激活/选中主色。
- 圆角/描边/阴影：触发框 r=2、1px inside stroke；展开面板 r=2，浮层阴影 `0 4 12 rgba(0,0,0,0.12)`。
- 间距/布局：面板行高 36，上下 padding 4；单选文本左距 16；多选 checkbox x=16，文本 x=42；层级右箭头 12px，右侧约 28px；单选最终列选中勾 16px。
- 多选已选态：当触发框高度大于 32px 时，已选项按 Tag 多行排列，Tag 之间 gap 4，行距 26；选项过多可显示右侧滚动条。
- 图标：触发框使用 `Line/DropDown-Arrow` / `Line/PutAway-Arrow`；层级箭头使用 `Line/Right-Arrow`；单选勾选使用 `Line/Select`；多选半选使用 `Line/Cut`。

### 状态交互
- default：触发框显示 `请选择`，黑色 15% 描边。
- hover：触发框主色描边，箭头向下。
- complete：触发框显示路径值，例如 `海南省/三亚市/吉阳区`。
- complete-hover：已选路径 + 主色描边。
- selected/open：触发框主色描边，箭头向上，下方使用 `bepCascaderPanel`。
- disabled：触发框禁用态，不可点击。
- panel default：普通选项白底。
- panel active/hover：当前路径或 hover 行浅灰底，文字主色。
- panel selected：叶子选中；单选在最终列显示 `Line/Select`，多选显示主色 checkbox。
- panel indeterminate：多选父级部分选中，主色 checkbox + `Line/Cut`。

### 内容约束
- 级联选择器用于有层级关系的数据，如省市区、组织层级、类目层级。
- 已选单选值用 `/` 拼接路径；文本单行截断，不换行。
- 多选值可用 Tag 触发框或汇总文案呈现；展开面板中父级半选必须由数据状态显式传入。
- 面板列数按数据层级决定；Figma 真源确认三列样式，超过三层应由业务确认展示方式，不自行扩展成复杂树。

### 使用场景
- 适用：地址、省市区、商品类目、组织路径等“必须逐级选择”的字段。
- 不适用：无层级枚举用选择器（`bepSelect`）；多选但无层级用多选选择器（`bepMultiSelect`）；树形大数据或需要搜索/懒加载时优先后续树选择器规范。
- 常见组合：表单项、筛选区、弹窗/抽屉表单。
- 模板位置：作为表单控件或筛选控件使用；展开态仅用于样例或用户明确要求展示打开状态。

### 禁止事项
- 禁止用普通选择器 + 手写浮层近似级联选择器。
- 禁止页面脚本手写级联列、行背景、右箭头、checkbox、半选线或选中勾。
- 禁止把级联面板当普通内容列表或导航菜单使用。

### 参数/API
```javascript
bepCascader('请选择', 280, 32)
bepCascader('请选择', 280, 32, { value:'海南省/三亚市/吉阳区' })
bepCascader('请选择', 356, 32, { state:'selected' })
bepCascaderPanel([
  [{ label:'广东省', state:'active' }, { label:'湖南省' }],
  [{ label:'三亚市', state:'active' }, { label:'三沙市' }],
  [{ label:'海棠区', state:'selected', leaf:true }, { label:'吉阳区', leaf:true }]
])
bepCascaderPanel(columns, { multiple:true })
```

---

## bepTree — 树形组件

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `697:27653` / `树形组件 Tree`
**公开入口：** `bepTree(items, opts)`

### 样式属性
- 尺寸：节点行高 28px；基础树形节点随文字宽度展示，可放入固定宽容器；示例完整树容器宽 240px。
- 颜色：节点文字黑色 65%；选中/hover 行背景 `#F5F7FA`，背景贯通容器整行；禁用态整体 opacity 0.5。
- 字体：14px Regular，line-height 22。
- 圆角/描边/阴影：Tree 本身无圆角、无描边、无阴影；checkbox r=2，1px inside stroke。
- 间距/布局：每级缩进 16px；箭头 12px，x=`level*16`，垂直居中；基础树形文字 x=`level*16+16`；可选树形 checkbox x=`level*16+16`，文字 x=`level*16+40`。
- 图标：展开使用 `Fill/Arrow-Open`；折叠使用 `Fill/Arrow-PutAway`；可选树形 checkbox 选中使用 `Line/Select`，半选使用 `Line/Cut`。

### 状态交互
- expanded：有子节点且当前展开，显示向下箭头。
- collapsed：有子节点且当前收起，显示向右箭头。
- leaf：叶子节点不显示箭头，但保留文字起始对齐规则。
- selected/hover：整行 `#F5F7FA` 背景。
- checked：可选树形节点选中，checkbox 主色底 + 白色对勾。
- indeterminate：父级部分选中，checkbox 主色底 + 白色短横。
- disabled：节点不可操作，整体弱化。

### 内容约束
- `items` 使用扁平可见节点数组，每项显式传 `level` 和 `state`；折叠节点的子级不传入渲染数组。
- 节点文本单行截断，不换行。
- Tree 只表达层级结构；复杂字段、多列信息、操作列应使用树表格行（`bepTreeRow`）。
- 树形选择器不是 Tree 本身；后续应由选择器触发框 + 浮层 + `bepTree` 组合。

### 使用场景
- 适用：左侧目录、组织结构、类目结构、权限结构、弹窗/抽屉内层级选择区域。
- 不适用：多列表格层级数据用树表格行（`bepTreeRow`）；逐级列式选择用级联选择器（`bepCascader`）；输入框形式选择树节点用后续树形选择器。
- 常见组合：Card、弹窗/抽屉内容区、树形选择器浮层、权限配置区域。
- 模板位置：页面内容区或弹窗/抽屉内容区；不作为系统侧边栏导航。

### 禁止事项
- 禁止页面脚本手写树节点、缩进、箭头、选中背景、checkbox 或半选线。
- 禁止用树表格行（`bepTreeRow`）近似普通树形组件。
- 禁止用普通列表或侧边栏菜单项近似 Tree。

### 参数/API
```javascript
bepTree([
  { label:'一级菜单01', level:0, state:'expanded' },
  { label:'二级菜单01', level:1, state:'collapsed' },
  { label:'二级菜单02', level:1, state:'expanded' },
  { label:'三级菜单01', level:2, state:'leaf', selected:true }
], { width:240 })

bepTree([
  { label:'一级菜单', level:0, state:'expanded', indeterminate:true },
  { label:'二级菜单', level:1, state:'collapsed', checked:true }
], { width:240, checkable:true })
```

---

## bepTreeSelect / bepTreeSelectPanel — 树形选择器

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:75` / `复杂树形 ComplexTree`，树形选择器下拉形态。
**公开入口：** `bepTreeSelect(placeholder, width, height, opts)` / `bepTreeSelectPanel(items, opts)`

### 样式属性
- 尺寸：触发框默认 `280×32`，继承选择器外框；下拉面板默认 `280×240`。
- 颜色：触发框继承选择器状态；下拉面板白底，树节点选中/hover 背景 `#F5F7FA`。
- 字体：触发框和树节点均为 14px Regular，line-height 22。
- 圆角/描边/阴影：触发框 r=2、1px inside stroke；下拉面板 r=2，浮层阴影 `0 4 12 rgba(0,0,0,0.12)`。
- 间距/布局：触发框文字左距 12，右侧箭头 16px；下拉面板内边距左右 16px、上下 8px；树节点布局完全继承 `bepTree`。
- 图标：触发框使用 `Line/DropDown-Arrow` / `Line/PutAway-Arrow`；树节点展开/折叠/checkbox 图标全部继承 `bepTree`。

### 状态交互
- default：触发框显示 `请选择`，黑色 15% 描边。
- hover：触发框主色描边。
- complete：触发框显示已选节点名称。
- complete-hover：已选值 + 主色描边。
- selected/open：触发框主色描边，箭头向上，下方显示 `bepTreeSelectPanel`。
- disabled：触发框禁用态，不可点击。
- panel selected/hover/checked/indeterminate：由内部 `bepTree` 的节点状态表达。

### 内容约束
- 单选值显示节点名称，文本单行截断，不换行。
- 多选值使用触发框 Tag 展示；超过可用宽度按已可见 Tag 截断，业务如需完整已选清单应使用复杂树形选择弹窗。
- 面板中的树数据使用 `bepTree` 的扁平可见节点数组规则，每项显式传 `level` 和 `state`。
- 树形选择器用于树状大数据或需要搜索/懒加载扩展的层级选择；逐级列式选择仍使用级联选择器（`bepCascader`）。

### 使用场景
- 适用：组织、部门、权限节点、类目树等输入框触发的树节点选择。
- 不适用：省市区等必须逐级列式选择用级联选择器；单纯层级展示用树形组件；多列表格层级数据用树表格行。
- 常见组合：表单项、筛选区、弹窗/抽屉表单。
- 模板位置：作为表单控件或筛选控件使用；展开态仅用于样例或用户明确要求展示打开状态。

### 禁止事项
- 禁止用 `bepSelect` + 手写树浮层近似树形选择器。
- 禁止页面脚本手写树形选择器面板、树节点、缩进、箭头、checkbox 或滚动条。
- 禁止把树形选择器当复杂组织树管理区域使用；业务树区域用复杂树形（`bepComplexTree`）。

### 参数/API
```javascript
bepTreeSelect('请选择', 280, 32)
bepTreeSelect('请选择', 280, 32, { value:'三级菜单01' })
bepTreeSelect('请选择', 280, 32, { state:'selected' })
bepTreeSelectPanel([
  { label:'一级菜单', level:0, state:'expanded' },
  { label:'二级菜单', level:1, state:'collapsed' },
  { label:'三级菜单', level:2, state:'leaf', selected:true }
], { width:280, height:240 })

bepTreeSelect('请选择', 280, 32, {
  multiple:true,
  values:['三级菜单01', '三级菜单02']
})
bepTreeSelectPanel(items, { width:280, checkable:true })
```

---

## bepDate — 单日期

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:674` / `日期选择器`
**公开入口：** `bepDate(placeholder, width, height, opts)`

### 样式属性
- 尺寸：默认 `240x32`；Figma 单日期输入框为 `240x32`。
- 颜色：默认白底，黑色 15% 描边；hover/complete-hover 描边为 `#338AAF`；禁用态背景黑色 4%。
- 字体：14px Regular，line-height 22；placeholder 黑色 25%，完成值黑色 85%。
- 圆角/描边：外框 r=2，1px inside stroke。
- 间距/布局：左内边距 12，日历图标 `Line/Date` 16px；文字起点 x=36；完成悬停/可清除时右侧显示 `Fill/Close` 16px。

### 状态交互
- default：显示 placeholder，白底，黑色 15% 描边。
- hover：描边变为 `#338AAF`。
- complete：显示日期值，文字黑色 85%。
- complete-hover：完成态悬停，描边 `#338AAF`，右侧显示清除图标。
- disabled：不可选择，背景黑色 4%，描边黑色 15%，placeholder 黑色 25%。

### 内容约束
- 文字：默认 placeholder 为 `请选择日期`；完成值建议使用 Figma 真源格式 `YYYY/MM/DD`。
- 图标：日历图标必须使用 `Line/Date`；清除图标必须使用 `Fill/Close`。
- 空值：显示 placeholder，不显示清除图标。
- 截断/换行：单行显示，超出容器尾部省略，不换行。
- 数据类型或数量限制：只表达单个日期，不表达日期区间。

### 使用场景
- 适用：生日、入职日期、生效日期、上架日期、审批时间等单个日期选择字段；筛选区 `type:'date'`。
- 不适用：日期范围筛选用日期区间（`bepDateRange`）；普通自由文本输入用输入框（`bepInput`）。
- 常见组合：表单项、筛选区、弹窗/抽屉表单。
- 模板位置：表单字段区域、筛选区域。

### 禁止事项
- 禁止用输入框或日期区间近似单日期。
- 禁止页面脚本手写日历图标、清除图标或输入框状态。

### 参数/API
```javascript
bepDate('请选择日期', 240, 32)
bepDate('请选择日期', 240, 32, { value:'2022/05/08' })
bepDate('请选择日期', 240, 32, { value:'2022/05/08', state:'complete-hover' })
bepDate('请选择日期', 240, 32, { disabled:true })
```

---

## bepDateRange — 日期区间

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:674` / `日期选择器`
**公开入口：** `bepDateRange(width, height, opts)`

### 样式属性
- 尺寸：默认 `300x32`；Figma 范围选择视觉主体约 `287x32`，组件公开宽度按 `300x32` 使用。
- 颜色：默认白底，黑色 15% 描边；hover/complete-hover 描边为 `#338AAF`；禁用态背景黑色 4%。
- 字体：14px Regular，line-height 22；placeholder 黑色 25%，已选日期和分隔符 `至` 黑色 85%。
- 圆角/描边：外框 r=2，1px inside stroke。
- 间距/布局：左侧 `Line/Date` 16px；起始日期、`至`、结束日期横向排列；完成悬停/可清除时右侧显示 `Fill/Close`。

### 状态交互
- default：开始/结束均显示 `选择日期`，黑色 15% 描边。
- hover：描边变为 `#338AAF`。
- complete：开始/结束均显示日期值，日期和 `至` 黑色 85%。
- complete-hover：完成态悬停，描边 `#338AAF`，右侧显示清除图标。
- disabled：不可选择，背景黑色 4%，描边黑色 15%，placeholder 黑色 25%。

### 内容约束
- 文字：未选择时显示 `选择日期 至 选择日期`；完成值建议使用 `YYYY/MM/DD`。
- 图标：日历图标必须使用 `Line/Date`；清除图标必须使用 `Fill/Close`。
- 空值：未传 `start/end` 时显示 placeholder。
- 截断/换行：开始/结束日期各自单行省略，不换行。
- 数据类型或数量限制：只表达起止日期，不表达时间点列表。

### 使用场景
- 适用：创建时间、生效日期到到期日期、查询时间范围等日期范围筛选；筛选区 `type:'daterange'`。
- 不适用：单个日期选择用单日期（`bepDate`）。
- 常见组合：筛选区、表单项、弹窗/抽屉表单。
- 模板位置：筛选区域优先。

### 禁止事项
- 禁止页面脚本手写日历图标、`至` 分隔符、清除图标或输入框状态。
- 禁止用两个单日期控件拼出日期区间，除非产品明确要求独立两个字段。

### 参数/API
```javascript
bepDateRange(300, 32)
bepDateRange(300, 32, { start:'2022/04/23', end:'2022/05/16' })
bepDateRange(300, 32, { start:'2022/04/23', end:'2022/05/16', state:'complete-hover' })
bepDateRange(300, 32, { disabled:true })
```

---

## bepDatePickerPanel — 日期面板

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:674` / `2.DataEntry/8.DatePicker日期选择器/年月日`
**公开入口：** `bepDatePickerPanel(opts)`

### 样式属性
- 尺寸：默认 `280x314`。
- 颜色：白底；选中日期背景主色 `#006D9B`，选中文字白色。
- 字体：月份标题 14px Regular，line-height 22，黑色 85%；星期标题 14px Medium，line-height 22，黑色 85%；日期文字 14px Regular，line-height 22，黑色 65%。
- 圆角/描边/阴影：面板 r=2；选中日期块 `24x24`，r=2。
- 间距/布局：标题居中，左右月份切换图标位于顶部两侧；星期和日期使用 7 列月历网格。

### 状态交互
- default：展示当前月份日期网格。
- selected：选中日期使用主色背景和白色文字。
- disabled：未公开，不得假设。

### 内容约束
- 文字：月份标题格式为 `YYYY年M月`；星期固定为 `日 一 二 三 四 五 六`。
- 图标：月份切换必须复用 BeP 箭头图标，不得手写。
- 空值：无选中日期时由业务决定是否传入 selectedDay。
- 截断/换行：日期格不换行。
- 数据类型或数量限制：单月面板，只表达一个月份。

### 使用场景
- 适用：展示单日期选择器展开态样例或规范说明。
- 不适用：业务页面默认静态展示展开面板，除非用户明确要求展示控件展开态。
- 常见组合：单日期（`bepDate`）的展开浮层。
- 模板位置：组件样例页、交互态说明。

### 禁止事项
- 禁止页面脚本手写日历网格、星期行、选中日期块。

### 参数/API
```javascript
bepDatePickerPanel({ yearMonth:'2022年5月', selectedDay:15 })
```

---

## bepDateRangePanel — 日期区间面板

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:674` / `2.DataEntry/8.DatePicker日期选择器/区间选择-年月日`
**公开入口：** `bepDateRangePanel(opts)`

### 样式属性
- 尺寸：默认 `680x274`。
- 颜色：白底；左右月份内的选中日期沿用日期面板选中态。
- 字体：沿用日期面板。
- 圆角/描边/阴影：外层面板 r=2。
- 间距/布局：左右双月横向排列，左月默认 `2022年4月`，右月默认 `2022年5月`。

### 状态交互
- default：展示左右双月。
- selected：开始日期和结束日期分别在左右月中选中。
- hover/disabled：未公开，不得假设。

### 内容约束
- 文字：月份标题格式为 `YYYY年M月`。
- 图标：月份切换图标必须复用 BeP 图标。
- 空值：无起止日期时由业务决定是否传入 `startDay/endDay`。
- 截断/换行：日期格不换行。
- 数据类型或数量限制：只表达日期区间双月面板。

### 使用场景
- 适用：展示日期区间选择器展开态样例或规范说明。
- 不适用：业务页面默认静态展示展开面板，除非用户明确要求展示控件展开态。
- 常见组合：日期区间（`bepDateRange`）的展开浮层。
- 模板位置：组件样例页、交互态说明。

### 禁止事项
- 禁止页面脚本手写双月日历面板。

### 参数/API
```javascript
bepDateRangePanel({ leftTitle:'2022年4月', rightTitle:'2022年5月', startDay:23, endDay:16 })
```

---

## bepTime — 时间选择器

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `696:27649` / `时间选择器`
**公开入口：** `bepTime(placeholder, width, height, opts)`

### 样式属性
- 尺寸：默认 `240x32`；Figma 单时间输入框为 `240x32`。
- 颜色：默认白底，黑色 15% 描边；hover/complete-hover 描边为 `#338AAF`；禁用态背景黑色 4%。
- 字体：14px Regular，line-height 22；placeholder 黑色 25%，完成值黑色 85%。
- 圆角/描边：外框 r=2，1px inside stroke。
- 间距/布局：左内边距 12，时钟图标 `Line/Clock` 16px；文字起点 x=36；完成悬停/可清除时右侧显示 `Fill/Close` 16px。

### 状态交互
- default：显示 `请选择时间`，白底，黑色 15% 描边。
- hover：描边变为 `#338AAF`。
- complete：显示时间值，文字黑色 85%。
- complete-hover：完成态悬停，描边 `#338AAF`，右侧显示清除图标。
- disabled：不可选择，背景黑色 4%，描边黑色 15%，placeholder 黑色 25%。

### 内容约束
- 文字：默认 placeholder 为 `请选择时间`；完成值使用 `HH:mm:ss`。
- 图标：时钟图标必须使用 `Line/Clock`；清除图标必须使用 `Fill/Close`。
- 空值：显示 placeholder，不显示清除图标。
- 截断/换行：单行显示，超出容器尾部省略，不换行。
- 数据类型或数量限制：只表达单个时间点，不表达时间区间或日期时间。

### 使用场景
- 适用：营业开始时间、执行时间、预约时间等单个时间字段。
- 不适用：起止时间用时间区间（`bepTimeRange`）；日期或日期范围用日期组件；日期+时间组合未公开时不得近似。
- 常见组合：表单项、筛选区、弹窗/抽屉表单。
- 模板位置：表单字段区域、筛选区域。

### 禁止事项
- 禁止用输入框或日期选择器近似时间选择器。
- 禁止页面脚本手写时钟图标、清除图标或输入框状态。

### 参数/API
```javascript
bepTime('请选择时间', 240, 32)
bepTime('请选择时间', 240, 32, { value:'00:00:00' })
bepTime('请选择时间', 240, 32, { value:'00:00:00', state:'complete-hover' })
bepTime('请选择时间', 240, 32, { disabled:true })
```

---

## bepTimeRange — 时间区间

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `696:27649` / `时间选择器`
**公开入口：** `bepTimeRange(width, height, opts)`

### 样式属性
- 尺寸：默认 `240x32`；Figma 时间区间输入框为 `240x32`。
- 颜色：默认白底，黑色 15% 描边；hover/complete-hover 描边为 `#338AAF`；禁用态背景黑色 4%。
- 字体：14px Regular，line-height 22；placeholder 黑色 25%，已选时间和分隔符 `至` 黑色 85%。
- 圆角/描边：外框 r=2，1px inside stroke。
- 间距/布局：左侧 `Line/Clock` 16px；开始时间、`至`、结束时间横向排列；完成悬停/可清除时右侧显示 `Fill/Close`。

### 状态交互
- default：显示 `开始时间 至 结束时间`，黑色 15% 描边。
- hover：描边变为 `#338AAF`。
- complete：开始/结束均显示时间值，时间和 `至` 黑色 85%。
- complete-hover：完成态悬停，描边 `#338AAF`，右侧显示清除图标。
- disabled：不可选择，背景黑色 4%，描边黑色 15%，placeholder 黑色 25%。

### 内容约束
- 文字：未选择时显示 `开始时间 至 结束时间`；完成值使用 `HH:mm:ss`。
- 图标：时钟图标必须使用 `Line/Clock`；清除图标必须使用 `Fill/Close`。
- 空值：未传 `start/end` 时显示 placeholder。
- 截断/换行：开始/结束时间各自单行省略，不换行。
- 数据类型或数量限制：只表达起止时间，不表达日期范围。

### 使用场景
- 适用：营业时间、预约时段、执行时段等起止时间字段。
- 不适用：单个时间点用时间选择器（`bepTime`）；日期范围用日期区间（`bepDateRange`）。
- 常见组合：筛选区、表单项、弹窗/抽屉表单。
- 模板位置：筛选区域、表单字段区域。

### 禁止事项
- 禁止用两个时间选择器拼出时间区间，除非产品明确要求独立两个字段。
- 禁止页面脚本手写时钟图标、`至` 分隔符、清除图标或输入框状态。

### 参数/API
```javascript
bepTimeRange(240, 32)
bepTimeRange(240, 32, { start:'00:00:00', end:'23:59:59' })
bepTimeRange(240, 32, { start:'00:00:00', end:'23:59:59', state:'complete-hover' })
bepTimeRange(240, 32, { disabled:true })
```

---

## bepTimePickerPanel — 时间面板

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `696:27649` / `2.DataEntry/7.TimeSelect时间选择器/选择-时分秒`
**公开入口：** `bepTimePickerPanel(opts)`

### 样式属性
- 尺寸：默认 `168x273`。
- 颜色：白底；列分割线黑色 10%；选中行背景主色 `#006D9B`；普通时间文字黑色 65%，选中文字白色；滚动条 `#D8D8D8`。
- 字体：14px Regular，line-height 22。
- 圆角/描边/阴影：面板 r=2；滚动条 r=4。
- 间距/布局：顶部显示当前时间；下方三列分别为时、分、秒，每列宽 56；顶部与选项区之间 1px 分割线。

### 状态交互
- default：展示时/分/秒三列可滚动选项。
- selected：选中行使用主色背景和白色文字。
- disabled：未公开，不得假设。

### 内容约束
- 文字：顶部时间和选项值使用 `HH:mm:ss` / 两位数字。
- 图标：无图标。
- 空值：由业务决定是否传入当前时间。
- 截断/换行：时间值不换行。
- 数据类型或数量限制：只表达单个时间点的展开面板。

### 使用场景
- 适用：展示时间选择器展开态样例或规范说明。
- 不适用：业务页面默认静态展示展开面板，除非用户明确要求展示控件展开态。
- 常见组合：时间选择器（`bepTime`）的展开浮层。
- 模板位置：组件样例页、交互态说明。

### 禁止事项
- 禁止页面脚本手写时间列、选中行、分割线或滚动条。

### 参数/API
```javascript
bepTimePickerPanel({ value:'05:05:05', selected:'04' })
```

---

## bepTimeRangePanel — 时间区间面板

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `696:27649` / `2.DataEntry/7.TimeSelect时间选择器/区间选择-时分秒`
**公开入口：** `bepTimeRangePanel(opts)`

### 样式属性
- 尺寸：默认 `354x322`。
- 颜色：白底；列分割线和底部分割线黑色 10%；选中行背景主色 `#006D9B`；底部确认按钮复用按钮（`bepButton`）主按钮样式。
- 字体：14px Regular，line-height 22；顶部时间和值普通态黑色 65%。
- 圆角/描边/阴影：外层面板 r=2；滚动条 r=4。
- 间距/布局：左右各一组三列时/分/秒，中间显示 `至`；底部 49px 操作区，右侧放确认按钮。

### 状态交互
- default：展示左右双时间选择列。
- selected：左右选中行分别使用主色背景和白色文字。
- confirm：点击底部确认按钮后提交当前起止时间；按钮使用 `bepButton('确定','primary',32)`。
- disabled：未公开，不得假设。

### 内容约束
- 文字：顶部起止时间使用 `HH:mm:ss`，中间分隔符固定为 `至`。
- 图标：无图标。
- 空值：由业务决定是否传入起止时间。
- 截断/换行：时间值不换行。
- 数据类型或数量限制：只表达时间区间，不表达日期区间。

### 使用场景
- 适用：展示时间区间选择器展开态样例或规范说明。
- 不适用：业务页面默认静态展示展开面板，除非用户明确要求展示控件展开态。
- 常见组合：时间区间（`bepTimeRange`）的展开浮层。
- 模板位置：组件样例页、交互态说明。

### 禁止事项
- 禁止页面脚本手写双时间列、分割线、滚动条或确认按钮。
- 禁止手写确认按钮，必须复用按钮（`bepButton`）。

### 参数/API
```javascript
bepTimeRangePanel({ start:'05:05:05', end:'05:05:05', startSelected:'04', endSelected:'04' })
```

---

## bepDateTime — 日期时间选择器

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:689` / `日期时间选择器`
**公开入口：** `bepDateTime(placeholder, width, height, opts)`

### 样式属性
- 尺寸：Figma 输入框为 `400x32`；默认 `width=400`、`height=32`。
- 颜色：白底；disabled 背景黑色 4%；default/complete 描边黑色 15%；hover/complete-hover 描边主色系；占位文字黑色 25%，已选文字黑色 85%。
- 字体：14px Regular，line-height 22。
- 圆角/描边/阴影：输入框 r=2，1px inside stroke，无阴影。
- 间距/布局：左侧 `Line/Date` 16px，x=12；文字 x=36；complete-hover/clearable 时右侧 `Fill/Close`。

### 状态交互
- default：显示占位文案，Figma 真源默认占位为 `请选择日期`。
- hover：描边高亮。
- complete：显示完整日期时间，格式 `YYYY/MM/DD HH:mm:ss`。
- complete-hover：显示完整日期时间和清除图标。
- disabled：通过 `opts.disabled:true` 表达，不允许交互。
- focus：Figma 真源未提供独立 Focus 态；业务页面默认不单独绘制 focus。
- open：展开态使用日期时间面板（`bepDateTimePanel`）。

### 内容约束
- 文字：`opts.value` 推荐格式 `YYYY/MM/DD HH:mm:ss`。
- 图标：只能使用 `Line/Date` 和 `Fill/Close`。
- 空值：显示 placeholder。
- 截断/换行：单行截断，不撑宽控件。
- 数据类型或数量限制：只表达单个日期+时间点。

### 使用场景
- 适用：创建时间、预约时间、生效时间等单个精确时间点选择；筛选区 `type:'datetime'`。
- 不适用：只需日期用单日期（`bepDate`）；只需时间用时间选择器（`bepTime`）；起止日期时间用日期时间区间（`bepDateTimeRange`）。
- 常见组合：表单项（`bepFormItem`）、多条件筛选区（`bepFilterGrid`）。
- 模板位置：筛选区、弹窗/抽屉表单、普通表单页。

### 禁止事项
- 禁止用输入框、单日期+时间选择器、或手写图标文字近似日期时间选择器。
- 禁止页面脚本手写清除图标或边框状态。

### 参数/API
```javascript
bepDateTime('请选择日期', 400, 32)
bepDateTime('请选择日期', 400, 32, { value:'2022/04/23 00:00:00' })
bepDateTime('请选择日期', 400, 32, { value:'2022/04/23 00:00:00', state:'complete-hover' })
bepDateTime('请选择日期', 400, 32, { disabled:true })
```

---

## bepDateTimeRange — 日期时间区间

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:689` / `日期时间选择器`
**公开入口：** `bepDateTimeRange(width, height, opts)`

### 样式属性
- 尺寸：Figma 输入框为 `400x32`；默认 `width=400`、`height=32`。
- 颜色：与日期时间选择器一致；开始/结束占位文字黑色 25%，已选文字黑色 85%，分隔符 `至` 黑色 85%。
- 字体：14px Regular，line-height 22。
- 圆角/描边/阴影：输入框 r=2，1px inside stroke，无阴影。
- 间距/布局：左侧 `Line/Date` 16px；开始值、`至`、结束值在同一输入框内水平排列。

### 状态交互
- default：显示 `选择日期时间 至 选择日期时间`。
- hover：描边高亮。
- complete：显示开始日期时间与结束日期时间。
- complete-hover：显示清除图标。
- disabled：通过 `opts.disabled:true` 表达，不允许交互。
- focus：Figma 真源未提供独立 Focus 态；业务页面默认不单独绘制 focus。
- open：展开态使用日期时间区间面板（`bepDateTimeRangePanel`）。

### 内容约束
- 文字：`opts.start` / `opts.end` 推荐格式 `YYYY/MM/DD HH:mm:ss`。
- 图标：只能使用 `Line/Date` 和 `Fill/Close`。
- 空值：开始/结束分别显示 `选择日期时间`。
- 截断/换行：单行截断，不撑宽控件。
- 数据类型或数量限制：表达一个起止日期+时间区间。

### 使用场景
- 适用：创建时间范围、提交时间范围、生效开始到结束等查询或录入；筛选区 `type:'datetimerange'`。
- 不适用：单个时间点用日期时间选择器（`bepDateTime`）；纯日期范围用日期区间（`bepDateRange`）；纯时间范围用时间区间（`bepTimeRange`）。
- 常见组合：表单项（`bepFormItem`）、多条件筛选区（`bepFilterGrid`）。
- 模板位置：列表筛选区、弹窗/抽屉表单、普通表单页。

### 禁止事项
- 禁止用两个日期时间选择器拼出区间，除非产品明确要求两个独立字段。
- 禁止手写日历图标、分隔文字、清除图标或边框状态。

### 参数/API
```javascript
bepDateTimeRange(400, 32)
bepDateTimeRange(400, 32, { start:'2022/04/23 00:00:00', end:'2022/05/16 00:00:00' })
bepDateTimeRange(400, 32, { start:'2022/04/23 00:00:00', end:'2022/05/16 00:00:00', state:'complete-hover' })
bepDateTimeRange(400, 32, { disabled:true })
```

---

## bepDateTimePanel — 日期时间面板

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:689` / `2.DataEntry/9.DateTimePicker时间日期选择器/年月日时间`
**公开入口：** `bepDateTimePanel(opts)`

### 样式属性
- 尺寸：默认 `448x314`。
- 颜色：白底；选中日期和时间使用主色 `#006D9B`；分割线黑色 10%；`此刻` 为主色文字。
- 字体：14px Regular，line-height 22；月标题主色。
- 圆角/描边/阴影：外层面板 r=2；浮层阴影由组件承载。
- 间距/布局：左侧月历区 280px，右侧时/分/秒三列 168px，底部 48px 操作区；右下角确认按钮复用按钮（`bepButton`）。

### 状态交互
- open：由日期时间选择器展开触发。
- selected：选中日期为主色实底，时间选中行为主色横条。
- confirm：点击 `确定` 确认选择。
- now：点击 `此刻` 选择当前日期时间。
- hover/focus：面板内部单项 hover/focus 真源未独立公开，页面生成不绘制静态 hover/focus。

### 内容约束
- 文字：月标题格式 `YYYY年 M月`；时间格式 `HH:mm:ss`。
- 图标：左右月份切换复用日期面板图标。
- 空值：面板展示当前默认日期和时间。
- 截断/换行：日期数字和时间数字不换行。
- 数据类型或数量限制：只表达单个日期+时间选择浮层。

### 使用场景
- 适用：展示日期时间选择器展开态样例或规范说明。
- 不适用：普通页面内容卡片、详情信息展示。
- 常见组合：日期时间选择器（`bepDateTime`）的展开浮层。
- 模板位置：组件样例页、交互态说明。

### 禁止事项
- 禁止页面脚本手写月历网格、时间三列、滚动条、此刻或确认按钮。

### 参数/API
```javascript
bepDateTimePanel({ yearMonth:'2015年 1月', selectedDay:17, value:'05:05:05', timeSelected:'04' })
```

---

## bepDateTimeRangePanel — 日期时间区间面板

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:689` / `2.DataEntry/9.DateTimePicker时间日期选择器/区间选择-年月日时间`
**公开入口：** `bepDateTimeRangePanel(opts)`

### 样式属性
- 尺寸：默认 `567x314`。
- 颜色：白底；快捷范围黑色 65%；选中日期和时间使用主色 `#006D9B`；分割线黑色 6%/10%。
- 字体：14px Regular，line-height 22；月标题主色。
- 圆角/描边/阴影：外层面板 r=2；浮层阴影由组件承载。
- 间距/布局：左侧快捷范围 119px，中部月历 279px，右侧时/分/秒三列 169px，底部 48px 操作区；右下角确认按钮复用按钮（`bepButton`）。

### 状态交互
- open：由日期时间区间展开触发。
- selected：选中日期和时间使用主色。
- quick：快捷范围点击后更新起止日期时间。
- confirm：点击 `确定` 确认选择。
- hover/focus：面板内部单项 hover/focus 真源未独立公开，页面生成不绘制静态 hover/focus。

### 内容约束
- 文字：快捷范围默认 `最近一周 / 最近一个月 / 最近三个月`；月标题格式 `YYYY年 M月`；时间格式 `HH:mm:ss`。
- 图标：左右月份切换复用日期面板图标。
- 空值：面板展示当前默认日期和时间。
- 截断/换行：快捷范围短文本不换行；日期数字和时间数字不换行。
- 数据类型或数量限制：只表达日期+时间区间选择浮层。

### 使用场景
- 适用：展示日期时间区间展开态样例或规范说明。
- 不适用：纯日期区间用日期区间面板（`bepDateRangePanel`）；纯时间区间用时间区间面板（`bepTimeRangePanel`）。
- 常见组合：日期时间区间（`bepDateTimeRange`）的展开浮层。
- 模板位置：组件样例页、交互态说明。

### 禁止事项
- 禁止页面脚本手写快捷范围、月历、时间列、分割线或确认按钮。

### 参数/API
```javascript
bepDateTimeRangePanel({ yearMonth:'2015年 1月', selectedDay:17, value:'05:05:05', timeSelected:'04' })
```

---

## bepInputNumber — 数字输入框

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:863` / `数字输入框`
**公开入口：** `bepInputNumber(value, width, height, opts)`

### 样式属性
- 尺寸：普通数字输入框默认 `160x32`；带前缀/后缀和组合数字输入框默认 `280x32`。
- 颜色：默认白底，黑色 15% 描边；hover/complete-hover 描边为主色 `#006D9B`；异常态描边为 `#FE5E54`；禁用态背景黑色 4%。
- 字体：数值文字 14px Regular，line-height 22；默认值 `0` 黑色 85%，普通完成态黑色 65%，异常态黑色 85%。
- 圆角/描边：外框 r=2，1px inside stroke。
- 间距/布局：左内边距 12；右侧步进器宽 23px；步进器图标 12px，上箭头 `Line/PutAway-Arrow`，下箭头 `Line/DropDown-Arrow`；异常图标 `Fill/Abnormal` 16px，位于步进器左侧。

### 状态交互
- default：显示 `0`，白底，黑色 15% 描边。
- hover：当前输入区域主色描边。
- complete：显示实际数值；普通数字输入框完成态文字黑色 65%。
- complete-hover：完成态悬停时主色描边。
- disabled：整体不可编辑，黑色 4% 背景，黑色 15% 描边，步进图标弱化。
- error/abnormal：危险色描边，输入区右侧显示 `Fill/Abnormal`，下方错误文案 12px/16 `#FE5E54`。

### 内容约束
- 数值：只用于数字录入；普通文本不得使用数字输入框。
- 前缀/后缀：单位、数量类型等固定文本必须通过 `prefixText` / `suffixText` 传入，不得手写附加文字。
- 截断/换行：输入区域内数值单行显示，超长截断，不换行。
- 图标：步进器和异常提示必须使用 BeP 图标，不得手绘上下箭头。

### 使用场景
- 适用：排序、数量、金额、面积、限额等需要数字输入或上下调整的字段。
- 不适用：纯文本输入用输入框（`bepInput`）；枚举选择用选择器（`bepSelect`）；表格数值展示不用数字输入框。
- 常见组合：表单项（`bepFormItem`）、筛选区、组合数字输入框（`bepInputNumberGroup`）。
- 模板位置：表单页、弹窗/抽屉表单、筛选区域。

### 禁止事项
- 禁止页面脚本手写步进器区域、上下箭头、异常图标或前后缀分段。
- 禁止用输入框（`bepInput`）近似有步进器的数字输入。
- 禁止用数字输入框展示只读详情数值；详情页用描述列表或表格文字。

### 参数/API
```javascript
bepInputNumber('100', 160, 32)
bepInputNumber('100', 280, 32, { suffixText:'单位' })
bepInputNumber('100', 280, 32, { prefixText:'数量' })
bepInputNumber('10000000000', 160, 32, { error:true, errorText:'超出最大限额' })
```

---

## bepInputNumberGroup — 组合数字输入框

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:863` / `组合数字输入框`
**公开入口：** `bepInputNumberGroup(selectPlaceholder, value, width, opts)`

### 样式属性
- 尺寸：默认 `280x32`；左侧选择器默认 86px，右侧数字输入区域 195px。
- 颜色/字体/圆角：继承数字输入框和选择器规范。
- 图标：左侧选择器使用 `Line/DropDown-Arrow` 16px；右侧步进器使用 `Line/PutAway-Arrow` / `Line/DropDown-Arrow` 12px。

### 状态交互
- default：左侧选择器和右侧数字区域均为默认态。
- 选择器 hover/open：只影响左侧选择器；展开选项面板属于下拉菜单组件，不在组合数字输入框内手写。
- 数字选择 hover/complete：只影响右侧数字输入区域。
- error/disabled：按数字输入框对应状态处理。

### 内容约束
- 左侧：选择数字单位或数值类型，如 `平方米`。
- 右侧：只输入数字；超长单行截断。

### 使用场景
- 适用：单位/类型 + 数值的组合录入，如面积单位 + 面积、数量类型 + 数量。
- 不适用：普通“选择器 + 文本输入”用组合输入框（`bepInputGroup`）。

### 禁止事项
- 禁止页面脚本手写左侧下拉和右侧数字输入拼接结构。

### 参数/API
```javascript
bepInputNumberGroup('请选择', '', 280)
bepInputNumberGroup('请选择', '100', 280, { selectValue:'平方米' })
```

---

## bepRadioGroup — 单选组

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `695:27648` / `2.DataEntry/5.Radio单选框`
**公开入口：** `bepRadioGroup(options, activeVal, opts)`

### 样式属性
- 基础样式：组件高 22px；圆圈 `16×16`，视觉圆 `14×14`，r=8；文字 14px Regular，line-height 22，黑色 65%。
- 颜色：默认白底 + 黑色 15% 描边；hover 描边 `#338AAF`；选中为白底 + 主色描边 + 主色内点；禁用整体 opacity 50%。
- 间距/布局：圆圈 y=3；文字距圆圈 8px；选项默认 gap 16px，可通过 `opts.gap` 调整。
- 按钮样式：`variant:'button'`；高 32px；白底；默认描边 `#D9D9D9`、文字 `#666666`；hover 描边/文字 `#338AAF`；选中描边/文字 `#006D9B`；左右 padding 16px，选项连续排列。

### 状态交互
- default：未选项默认态。
- hover：仅用于组件样例或用户明确要求的状态展示；业务页面默认不静态绘制 hover。
- selected：由 `activeVal` 自动匹配 `label` 或 `value`。
- disabled：通过 `opts.disabled:true` 或 option 级 `disabled:true` 表达，不可操作。
- focus/readonly/loading：Figma 真源未公开，不得自行编造。

### 内容约束
- option 支持字符串或 `{label, value, state, disabled}`。
- 单选组必须有且只能有一个当前选中项；未匹配时全部未选中。
- 按钮样式宽度由文字宽度 + 左右 padding 32px 反推；不得手写固定坐标。

### 使用场景
- 适用：表单、弹窗、抽屉中少量互斥选项。
- 适用：选项需要更强操作感时使用按钮样式单选组。
- 不适用：大量选项或远程检索选项使用选择器（`bepSelect`）。
- 常见组合：表单项（`bepFormItem`）+ 单选组。

### 禁止事项
- 禁止页面脚本手写圆点、内点、按钮式选项或文字坐标。
- 禁止用多个按钮模拟按钮式单选组。
- 禁止用 `readonly:true`、`loading:true` 或未公开状态。

### 参数/API
```javascript
bepRadioGroup(['门店', '收衣点', '网上平台'], '门店')
bepRadioGroup([{label:'启用', value:'on'}, {label:'停用', value:'off', disabled:true}], 'on')
bepRadioGroup(['未选中', '选中'], '选中', { variant:'button' })
```

---

## bepCheckboxGroup — 多选组

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `695:27648` / `2.DataEntry/4.Checkbox多选框`
**公开入口：** `bepCheckboxGroup(options, selected, opts)`

### 样式属性
- 尺寸：组件高 22px；方框 `16×16`，视觉方框 `14×14`，r=2；文字 14px Regular，line-height 22，黑色 65%。
- 颜色：默认白底 + 黑色 15% 描边；hover 描边 `#338AAF`；选中主色填充 + 白色对勾；禁用整体 opacity 50%。
- 图标：选中对勾必须调用 BeP 图标 `Line/check`，10px，白色。
- 间距/布局：方框 y=3；文字距方框 8px；选项默认 gap 16px，可通过 `opts.gap` 调整。

### 状态交互
- default：未选项默认态。
- hover：仅用于组件样例或用户明确要求的状态展示；业务页面默认不静态绘制 hover。
- selected：由 `selected` 数组自动匹配 `label` 或 `value`。
- disabled：通过 `opts.disabled:true` 或 option 级 `disabled:true` 表达，不可操作。
- focus/readonly/loading/indeterminate：Figma 真源未公开，不得自行编造。

### 内容约束
- option 支持字符串或 `{label, value, state, disabled}`。
- `selected` 必须为数组；全选语义由业务数据决定，不在组件内自动推导。
- 多选组只承载少量平铺选项；大量选项使用多选选择器（`bepMultiSelect`）。

### 使用场景
- 适用：表单、弹窗、抽屉中少量多选项。
- 不适用：大量枚举、可搜索多选、跨页选择；这些使用多选选择器或表格选择能力。
- 常见组合：表单项（`bepFormItem`）+ 多选组。

### 禁止事项
- 禁止页面脚本手写勾选框、对勾图标或文字坐标。
- 禁止用本地图标、自定义 SVG 或矩形模拟对勾。
- 禁止用 `readonly:true`、`loading:true`、`indeterminate:true` 或未公开状态。

### 参数/API
```javascript
bepCheckboxGroup(['洗护', '保洁', '维修'], ['保洁', '维修'])
bepCheckboxGroup([{label:'短信'}, {label:'站内信', disabled:true}], ['短信'])
```

---

## bepUpload* — 上传

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:825` / `2.DataEntry/12.Upload上传`
**公开入口：** `bepUploadBtn(label, height, opts)`、`bepUploadClick(label, tip, opts)`、`bepUploadFileRow(file, opts)`、`bepUploadFileList(files, opts)`、`bepUploadDragger(opts)`、`bepImageUpload(items, opts)`

### 样式属性
- 上传按钮：高 32px，r=4，白底，黑色 15% 描边；图标 `Line/upload` 16px；文字 14px Regular，line-height 22，黑色 65%；左右 padding 16px，图标与文字 gap 8px。
- 点击上传：整体默认 `274×60`，按钮在上，格式提示在 y=40；提示文字 12px Regular，line-height 20，黑色 45%。
- 上传条：默认 `280×28`，背景黑色 4% 或 hover `#F5F7FA`；左侧 `Line/Paperclip` 16px；文件名 x=32，14px Regular，line-height 22，黑色 65%；右侧操作图标 16px。
- 拖拽上传：默认宽 360；拖拽区域高 160，r=2，虚线描边 `[4,2]`；上传云图标 `Line/upload-cloud` 48px；主说明 14px，辅助说明 12px。
- 图片上传：单格 `100×100`，r=2；默认/hover/上传中为虚线描边 `[4,2]`；成功态为图片预览；失败态危险色描边。
- 颜色：主色 `#006D9B`，hover `#338AAF`，危险 `#FE5E54`，遮罩黑色 60%。

### 状态交互
- 上传按钮 default：白底 + 黑色 15% 描边。
- 上传按钮 hover：描边、图标、文字使用 `#338AAF`；业务页面默认不静态展示 hover。
- 上传条 default：显示文件名和附件图标。
- 上传条 uploading：右侧显示 `Line/Loading`，节点名 `LoadingRotating`。
- 上传条 hover：右侧显示下载 `Line/Download` 和删除 `Line/Trash`。
- 上传条 error：文件名危险色，右侧只显示删除。
- 拖拽上传 hover：描边使用 `#338AAF`；其他结构不变。
- 图片上传 default/hover：加号 `Line/Add` + “点击上传”；hover 描边 `#338AAF`。
- 图片上传 uploading：loading 图标 + “上传中”。
- 图片上传 success：展示图片预览；success-hover 增加黑色 60% 遮罩 + 放大 `Line/zoom-in` + 删除 `Line/Trash`。
- 图片上传 error：危险色描边 + 危险提示；error-hover 增加黑色 60% 遮罩 + 删除。
- disabled/readonly：Figma 真源未公开；不得自行编造。只读附件应使用描述列表附件 value（`attachments` / `bepDescAttachments`）。

### 内容约束
- 上传文件名单行固定宽，超出尾部省略。
- 格式、大小、数量限制必须来自业务规则或用户明确给定；没有给定时可用示例文案，但交付时说明为示例。
- 图片上传成功态需要真实图片时，页面可传业务图片节点或使用占位色；不得手写图片上传结构。
- 上传中的 loading 只表达进行中，不允许点击；交互实现层应视作不可重复触发。

### 使用场景
- 适用：表单、弹窗、抽屉中的附件上传、图片上传、批量拖拽上传。
- 适用：已上传文件列表用上传条或上传文件列表。
- 不适用：详情页只读附件展示；用描述列表附件 value。
- 不适用：普通按钮上传不得用通用按钮近似；必须使用上传按钮或点击上传。
- 常见组合：表单项（`bepFormItem`）+ 点击上传 / 拖拽上传 / 图片上传。

### 禁止事项
- 禁止页面脚本手写上传按钮、上传条、拖拽区域、图片上传格、遮罩或文件操作图标。
- 禁止用自定义 SVG、本地图标映射、emoji 或矩形占位模拟上传图标。
- 禁止用 `bepButton` 直接替代上传按钮，除非业务只是一个普通命令按钮而非上传控件。
- 禁止上传组件使用未公开的 `readonly` / `disabled` 状态。

### 参数/API
```javascript
bepUploadBtn('点击上传', 32)
bepUploadClick('点击上传', '仅支持xls、txt、png、jpg格式，大小在500KB以内')
bepUploadFileRow({ name:'文件名称.txt', state:'hover' }, { width:280 })
bepUploadFileList([{ name:'文件名称.txt' }, { name:'错误文件.txt', state:'error' }])
bepUploadDragger({ title:'点击或将文件拖拽到这里上传', desc:'支持扩展名：xls、txt、png、jpg' })
bepImageUpload([{ state:'default' }, { state:'uploading' }, { state:'success' }, { state:'error' }])
```

---

## bepSwitch — 开关

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:710` / `开关 Switch`
**公开入口：** `bepSwitch(isOn, labelOn, labelOff, opts)`

### 样式属性
- 尺寸：大号 `48×26`、圆点 `22×22`、r=14；中号 `42×22`、圆点 `18×18`、r=12；小号 `30×16`、圆点 `12×12`、r=8。
- 颜色：开启轨道 `#006D9B`；关闭轨道黑色 25%；圆点白色；禁用态整体 opacity 50%；loading 图标 `#FF0D0D`。
- 字体：带文字开关只使用中号，内部文字 `开/关`，12px Regular，line-height 20，白色。
- 圆角/描边/阴影：轨道为胶囊圆角，无描边、无阴影；圆点为白色圆形。
- 间距/布局：圆点距轨道边缘 2px；开启态圆点在右，关闭态圆点在左；带文字开启态文字 x=8、关闭态文字 x=22。

### 状态交互
- default：按 `isOn` 表达开启/关闭。
- disabled：通过 `opts.disabled:true` 表达，整体 opacity 50%，不可操作。
- loading：通过 `opts.loading:true` 表达，只使用中号；圆点内置 BeP 图标 `Line/Loading`，节点名 `LoadingRotating`，前端交互中旋转。
- hover/focus/active：Figma 真源未公开独立状态；页面生成不得自行编造。

### 内容约束
- `labelOn/labelOff` 保留为语义命名和旧调用兼容，不在轨道外额外显示文字。
- 带文字开关只显示固定内部文字 `开/关`，不显示业务长文案。
- 开关不承载说明文字；说明应放在表单字段标题、描述文本或提示文案中。
- 只表达二元可切换状态，不表达多枚举状态。

### 使用场景
- 适用：表单、弹窗、抽屉中的启用/停用、显示/隐藏、开启/关闭等即时二元切换。
- 不适用：表格列的只读状态展示；表格状态展示用状态标签（`bepTag`）。
- 不适用：详情页只读二元状态；详情页只读展示优先使用描述列表（`bepDescriptions`）或状态标签（`bepTag`）。
- 常见组合：表单项（`bepFormItem`）+ 开关。
- 模板位置：表单字段区域、弹窗/抽屉表单。

### 禁止事项
- 禁止页面脚本手写轨道、圆点、内部文字或 loading 图形模拟开关。
- 禁止用开关替代表格状态标签。
- 禁止用 `state` 参数表达 hover/focus/active。
- 禁止用 `readonly:true` 表达只读；只读信息应改用描述列表或状态标签。

### 参数/API
```javascript
bepSwitch(true, '启用', '停用')
bepSwitch(false, '启用', '停用')
bepSwitch(true, '启用', '停用', { size:'large' })
bepSwitch(true, '启用', '停用', { size:'small' })
bepSwitch(true, '启用', '停用', { disabled:true })
bepSwitch(true, '启用', '停用', { loading:true })
bepSwitch(true, '启用', '停用', { showText:true })
```

---

## bepRate — 评分

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1` / `0:710` / `评分 Rate`
**公开入口：** `bepRate(value, opts)`

### 样式属性
- 尺寸：默认 5 颗星；单颗星图标 `16×16`；组件高度 22px。
- 颜色：选中星 `#FFA645`；未选中星 `#CCCCCC`；右侧评价文字黑色 85%。
- 字体：右侧评价文字 14px Regular，line-height 22。
- 圆角/描边/阴影：评分组件本身无背景、无描边、无阴影。
- 间距/布局：星与星之间 gap 4px；星组与右侧评价文字 gap 16px；星图标 y=3，文字 y=0。
- 图标：星形必须使用 BeP 图标 `Fill/Star`，不得用 `Line/star` 或页面内 SVG 近似。

### 状态交互
- default：按 `value` 表达选中星数量；Figma 真源示例为 3/5，右侧文字“一般”。
- selected/unselected：组件内部按每颗星是否小于 `value` 自动使用选中/未选中颜色。
- hover/focus/disabled/readonly/half：Figma 真源未公开，不得自行编造。

### 内容约束
- `value` 为整数分值，默认 3；组件内部限制在 `0..count`。
- `count` 默认 5；非 5 星场景必须由业务明确要求。
- `text` 为右侧评价文字；Figma 真源只确认“一般”，其他文案必须来自业务数据或用户明确给定。
- `showText:false` 可隐藏右侧评价文字，仅展示星级。
- 不支持半星；半星需要先补 Figma 真源。

### 使用场景
- 适用：评分输入、满意度、星级评价等需要用星级表达的字段。
- 适用：详情页或表单中展示评分值时，也用评分组件默认静态形态，不写 `readonly:true`。
- 不适用：普通等级状态、风险等级、审核状态；这些使用状态标签（`bepTag`）或描述列表文本。
- 常见组合：表单项（`bepFormItem`）+ 评分；描述列表 value 需要星级展示时可直接传评分组件节点。
- 模板位置：表单字段区域、详情描述 value、自定义内容块。

### 禁止事项
- 禁止页面脚本手写星形、内联 SVG、矩形占位或用文字星号模拟评分。
- 禁止使用 `Line/star` 近似评分星；评分必须使用实心星 `Fill/Star`。
- 禁止用 `state`、`disabled`、`readonly`、`half` 参数表达未公开状态。

### 参数/API
```javascript
bepRate(3)
bepRate(3, { text:'一般' })
bepRate(5, { text:'非常满意' })
bepRate(4, { showText:false })
bepRate(3, { count:5, text:'一般' })
```

---

## bepTag — 标示 / 标签

**层级：** 复合组件

**用途：** 用于状态标示、点标示、可关闭动态标签和添加标签。表格状态列、描述列表标签 value、对象标题状态标签等必须调用 `bepTag`，不得手写圆角矩形、状态点或关闭/添加图标。

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 697:27652`，组件名 `3.DataDisplay/5.Tag标示`。

**公开入口：** `bepTag(label, type, style)`

### 样式属性
- 高度：22px。
- 圆角：2px。
- 字体：12px Regular，line-height 20；点标示文字为 14px Regular，line-height 22。
- 普通标签 padding：左右 8px，上下 1px。
- 点标示：圆点 6×6，y=8，文字 x=14。
- 动态标签：背景黑色 4%，描边黑色 15%，关闭图标 `Fill/Close` 12px，图标黑色 25%。
- 添加标签：背景黑色 4%，描边黑色 15%，添加图标 `Line/Add` 12px，图标主色。

### 颜色类型
- `disabled` / `inactive`：未生效、禁用、停用；灰色。
- `info`：提示、信息性状态；主色 `#006D9B`。
- `success` / `enabled`：正常、成功、启用、已生效；绿色 `#3BBB3E`。
- `warning`：严重、警告、待审核、进行中；橙色 `#FFA645`。
- `danger`：危险、异常、失败、已终止；红色 `#FE5E54`。

### 形态
- `outline`（默认）：浅底 + 有色描边 + 有色文字，用于常规状态标示。
- `solid`：实色背景 + 白字，用于强调状态。
- `dot`：6px 状态点 + 14px 文字，用于轻量状态说明。
- `closable`：动态标签，带关闭图标，用于标签编辑、筛选条件、可删除标签。
- `add`：添加标签，带添加图标，用于标签编辑入口。

### 状态交互
- default：按 `type/style` 输出对应静态样式。
- close/add click：Figma 真源只定义静态外观；脚本只生成视觉节点，交互由业务实现承载。
- hover/focus/active/loading/disabled：Figma 真源未公开独立状态；不得自行补静态态。禁用语义使用 `type:'disabled'` 或 `type:'inactive'`。

### 内容约束
- 文案按实际文字宽度反推组件宽度，不截断、不换行。
- 表格状态列宽必须按最大标签宽度反推，并写入 `COL_WIDTH_AUDIT`。
- 描述列表中的标签 value 必须通过 `tags:[...]` 或 `bepDescTags(...)`，由内部复用 `bepTag`。
- 动态标签的关闭/添加图标必须使用 BeP 图标，不得手写 SVG。

### 使用场景
- 适用：表格状态列、详情状态、描述列表标签 value、对象标题状态/标签、筛选条件可删除标签、标签新增入口。
- 不适用：普通按钮、业务操作入口、文本链接、时间顺序记录。
- 常见组合：表格单元格、描述列表（`bepDescriptions`）、对象标题摘要（`bepObjectTitle`）、筛选区域。
- 模板位置：列表页表格、详情页头摘要、详情描述 value、筛选条件条。

### 禁止事项
- 禁止页面脚本自造 `makeTag`、`makeTagCell`、圆角矩形 + 文字标签。
- 禁止用本地图标或手写 SVG 代替动态标签关闭/添加图标。
- 禁止用标签代替按钮或页签。
- 禁止使用未公开的 `hover/focus/loading/state` 参数。

### 参数/API
```javascript
bepTag('正常', 'success')
bepTag('危险', 'danger', 'outline')
bepTag('提示', 'info', 'solid')
bepTag('未生效', 'disabled', 'dot')
bepTag('标示一', 'info', 'closable')
bepTag('新标示', 'info', 'add')
bepTag('标示一', 'info', { closable:true })
```

---

## bepIcon — 图标

**必须用 BEP_ICONS 中的图标，不得用矩形代替。**

见 references/icons.md 完整列表。

**着色：** 第三个参数传颜色对象，内部自动对 fills 和 strokes 着色。

---

## bepText / bepTableText / bepTruncText — 文字

### bepText

**自适应宽高文字。** 适用于模块标题、页面标题、分组标题、表单字段标题、描述列表字段标题、按钮文字，以及列宽/按钮宽/操作列宽的临时测量。

规则：
- 模块标题、页面标题、分组标题：宽度按实际文字反推。
- 按钮文字：默认按实际文字宽度反推按钮宽度。
- 表单字段标题：放在固定 label 区内右对齐；字段标题最多 8 个汉字，另加必填星号预留宽度。超过 8 个汉字不得自动扩宽、换行或截断，必须要求产品/业务简化字段名。
- 描述列表字段标题：按实际文字宽度，不强制固定 label 宽。
- 临时测量文字宽度后必须 `remove()`。

### bepTableText / bepTruncText

**固定宽表格文字。** 表格单元格必须用 `bepTableText` 或兼容旧名 `bepTruncText`，不得用 `bepText` 直接渲染单元格（原因：`bepText` 自动宽度会破坏列宽和行内对齐）。

列宽计算规则：
- 默认列宽由 `max(表头文字宽, 数据最宽文本宽) + 左16 + 右16` 反推。
- 特殊字段需要“超过 N 字截断展示”时，先按字段策略处理展示文本，再参与列宽计算和渲染。
- 不可截断字段（如编号、日期、电话、关键编码等）必须按完整文本反推列宽。
- 数值列不可截断，列宽由最宽数值反推，渲染时右对齐。
- 操作列不可截断，列宽由 `bepActionMetrics(actionRows)` 按操作文字反推。

```javascript
// 普通列
bepTableText(val, B, col.w - 32, { a:0.65, x: cx+16, y:13 })
// 主色链接列
bepTableText(val, BEP_C.primary, col.w - 32, { x: cx+16, y:13 })
// maxW = 列宽 - 左内边距(16) - 右内边距(16) = col.w - 32
// 金额右对齐
bepTableText(val, B, col.w - 32, { a:0.65, alignH:'RIGHT', truncate:false })
```

**与 `bepText` 的区别：**
- `bepText` 使用 `WIDTH_AND_HEIGHT` 自动宽高。
- `bepTableText` / `bepTruncText` 使用固定宽度 `textAutoResize='NONE'`，宽度由 `maxW` 控制。
- `bepTruncText` 是旧名，继续兼容；新规范优先写 `bepTableText`。
