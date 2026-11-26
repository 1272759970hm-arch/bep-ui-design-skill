# 复合组件规格

> 页面结构类组件：表格、导航、弹窗、表单等。

---

## bepTableHeader — 表头行

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:988`，组件名 `数据展示-表格`；基础表格实例：`3.DataDisplay/2.Table表格/表头-Default`、`3.DataDisplay/2.Table表格/表头-迷你表格`。
**公开入口：** `bepTableHeader(cols, tableW, opts)`

### 样式属性
- 默认表格：高 48px，背景黑色 4%，底边 1px 黑色 6%，左右 padding 16px。
- 迷你表格：高 40px，背景黑色 4%，底边 1px 黑色 6%，左右 padding 12px。
- 字体：14px Medium，line-height 22，黑色 85%。
- 圆角/描边：表头自身无圆角；表格不画列竖线。
- 对齐：支持 left / center / right，默认 left。

### 状态交互
- default：按以上样式展示。
- hover / active / focus / disabled / selected：表头本身不承载交互态。

### 内容约束
- `cols` 必须按列建模：`label / w / align`。
- 所有列宽之和必须等于 `tableW`；不足时应把剩余宽度分配给 `grow:true` 列或明确为横向滚动表格。
- 表头文字不截断；列宽必须由表头和数据最宽文本共同反推。

### 使用场景
- 适用：标准列表页、详情页内明细表、弹窗/抽屉内轻量明细表。
- 不适用：树状层级表头、筛选表头、多级表头、可拖拽/可设置列等高级表格能力。
- 常见组合：普通数据行（`bepTableRow`）、操作列（`bepActionCell`）、分页器（`bepPagination`）。

### 禁止事项
- 禁止页面脚本手写表头背景、底边、文字坐标或列竖线。
- 禁止用两个普通表头叠放近似多级表头。

### 参数/API
```javascript
bepTableHeader(cols, TABLE_W)
bepTableHeader(cols, TABLE_W, { size:'mini' })
```

**cols 参数：**
```javascript
{ label:'列名', w:列宽, align:'left'|'center'|'right' }
```
- 所有列宽之和必须等于 tableW（不足时用最后一列填满）
- align 默认 left

**外观：** 高 48px，背景 rgba(0,0,0,0.04)，底边 rgba(0,0,0,0.06)，无列竖线

---

## bepTableRow — 普通数据行

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:988`，组件名 `数据展示-表格`；基础表格实例：`3.DataDisplay/2.Table表格/内容-Default`、`3.DataDisplay/2.Table表格/内容-迷你表格`。
**公开入口：** `bepTableRow(cells, cols, tableW, bgColor, opts)`

### 样式属性
- 默认表格：高 48px，白底或透明底，底边 1px 黑色 6%，左右 padding 16px。
- 迷你表格：高 40px，白底或透明底，底边 1px 黑色 6%，左右 padding 12px。
- 字体：14px Regular，line-height 22，普通内容黑色 65%。
- 对齐：继承列 `align`，单元格可用 `cell.align` 覆盖。
- 圆角/描边：数据行自身无圆角；表格不画列竖线。

### 状态交互
- default：按以上样式展示。
- hover / selected：基础表格真源中有行背景表达，但业务静态页面默认不绘制 hover；已选行只在明确需要展示选中结果时使用。
- disabled / focus / loading：普通数据行不公开这些状态。

### 内容约束
- 字符串内容由组件内部转为固定宽表格文字；页面传自定义文字节点时必须用 `bepTableText` / `bepTruncText`。
- 表格单元格不得使用 `bepText`，否则宽度自动扩展会破坏列宽。
- 数值列不可截断，必须右对齐；列宽由表头和最宽数值反推。
- 普通文本默认不截断；只有规范明确的特殊字段才允许在列宽内截断。
- 节点内容可传入状态标签（`bepTag`）、操作列（`bepActionCell`）等标准组件。

### 使用场景
- 适用：标准数据表格普通行。
- 不适用：树状表格行、可展开详情行、快速新增输入态行、高级表格能力。
- 常见组合：表头行（`bepTableHeader`）、分页器（`bepPagination`）。

### 禁止事项
- 禁止页面脚本手写单元格矩形、底边、文字坐标。
- 禁止用 `bepTableRow` 近似树状表格或高级表格。

### 参数/API
```javascript
bepTableRow(cells, cols, TABLE_W)
bepTableRow(cells, cols, TABLE_W, null, { size:'mini' })
```

**cells 参数：**
```javascript
{ content: '字符串' | 节点对象, align: 'left'|'center'|'right' }
```
- content 是字符串时自动创建文字节点（opacity=0.65）
- content 是节点时直接使用（如 bepTag、bepActionCell）

**背景色：** 普通数据行 `bgColor` 不传则透明；树状表格行不要用 `bepTableRow` 近似，统一用 `bepTreeRow`。

**内容颜色：**
- 普通表格内容使用 BeP 默认正文色，不因“只读”自动弱化。
- 金额、库存、数量等数值列只改变对齐方式，不改变颜色。
- SKU 编码、商品编码、编号类文本默认正文色；只有明确为链接/可点击时才使用主色。
- 只有风险、异常、失败、禁用、辅助说明等明确语义可使用警示色或弱化色。
- 编辑页输入态、校验态、低价实时检测等视觉状态不得直接搬到详情页只读表格。

---

## bepTreeRow — 树表格行

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:353`，组件名 `多层级展开表格`；关键实例：`7.Business/2.Table  Advanced高级表格/内容-可展开`、`内容-二级`、`内容-三级`。
**公开入口：** `bepTreeRow(cells, cols, tableW, level, state, bgColor, opts)`

### 样式属性
- 行高：48px。
- 底边：1px 黑色 6%。
- 根节点背景：白色或透明承接容器白底。
- 子级背景：`#F5F7FA`，整行贯通，不只给树状列上色。
- 树状列缩进：每级 16px。
- 展开/折叠图标：16×16，图标与文字 gap 8px。
- 树状列文字：14px Regular，line-height 22，黑色 65%。

### 状态交互
- `expanded`：有子节点且当前展开，显示 `Fill/Arrow-Open`。
- `collapsed`：有子节点且当前折叠，显示 `Fill/Arrow-PutAway`。
- `leaf`：叶子节点，不显示图标，但保留图标占位宽度保证文字对齐。
- hover / selected / drag：只在明确展示对应业务状态时通过 `bgColor` 覆盖背景；默认页面不绘制静态 hover。
- focus / disabled / loading：树表格行不公开这些状态。

### 内容约束
- 树状列通常是名称列；如果第一列是 checkbox，名称列在第二列，必须传 `{ treeCol:1 }`。
- `level` 从 0 开始；0 为根节点，1 为二级，2 为三级。
- 常规文字优先传字符串，让组件内部统一处理缩进和固定宽表格文字。
- 树状列需要图标+名称等复合内容时，可传标准组件/节点，但仍必须交给 `bepTreeRow` 处理缩进。
- 其他列内容规则与普通数据行一致：表格文字固定宽，数值列右对齐，状态用 `bepTag`，操作用 `bepActionCell`。
- Figma 真源包含 checkbox 列，但当前公开入口只定义树状行；单个 checkbox 单元格后续如需单独公开，不得在业务页面手写 checkbox。

### 使用场景
- 适用：菜单权限、组织层级、分类层级、费用科目、权限点树等层级数据。
- 不适用：普通平铺列表；普通列表使用 `bepTableRow`。
- 常见组合：表头行（`bepTableHeader`）、操作列（`bepActionCell`）、分页器（`bepPagination`）。
- 模板位置：列表页表格区域或详情页明细表区域。

### 禁止事项
- 禁止用普通数据行缩进空格近似树状表格。
- 禁止页面脚本手写展开/折叠箭头、缩进、子级背景或底边。
- 禁止把树状表格拆成多个独立表格。

### 参数/API
```javascript
bepTreeRow(cells, cols, TABLE_W, 0, 'expanded')
bepTreeRow(cells, cols, TABLE_W, 1, 'leaf', null, { treeCol:1 })
```

**唯一规范：** BeP 不区分“简单树表格”和“高级树状表格”。`bepTreeRow` 就是树状表格行的唯一实现入口；早期简单树表格视为高级树状表格规范的前身，必须合并到本规范。

**state 参数：**
- `'expanded'`：有子节点，当前展开（显示 ▼ 图标）
- `'collapsed'`：有子节点，当前折叠（显示 ▶ 图标）
- `'leaf'`：叶子节点，无子节点（无图标，但保留缩进对齐）

**opts 参数：**
- `treeCol`：树状层级所在列，默认 `0`。如果第一列是 checkbox，名称列在第二列，则传 `{treeCol:1}`。

**缩进规则：** 每级 16px；图标 16×16；图标与文字间距 8px。Figma 真源位置：一级 icon x=16、text x=40；二级 icon x=32、text x=56；三级叶子 text x=72。

**背景：** 一级行白底；二级/三级等子级行 `#F5F7FA`，整行贯通。`bgColor` 只用于 hover、selected、drag 等明确状态覆盖。

**树状列传自定义节点：** 当树状列需要图标+文字组合时，构建 Frame 节点后传入；但常规文本优先直接传字符串，让 `bepTreeRow` 统一处理缩进和截断。
```javascript
// 菜单权限管理：类型图标 + 菜单名
cells[0] = { content: makeNameCell(rowData.name, rowData.type) }
```

---

## bepComplexTree — 复杂树形

**层级：** 模块
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:75`，组件名 `复杂树形 ComplexTree`；本批先沉淀 `7.Business/1.ComplexTree复杂树形/组织树`。
**公开入口：** `bepComplexTree(opts)`

### 样式属性
- 容器：默认 232×390，白底，1px 黑色 15% 描边，圆角 2px。
- 标题栏：高度 56px；底部分割线 1px 黑色 10%；标题左边距 24px。
- 标题文字：16px Medium，line-height 24，黑色 85%。
- 标题箭头：12×12，右侧 24px 区域内垂直居中；展开态使用 `Fill/Arrow-Open`，收起态使用 `Fill/Arrow-PutAway`。
- 搜索框：默认显示；位于标题栏下方 16px，左右边距 16px，高 32px，圆角 2px，1px 黑色 15% 描边；搜索图标使用 `Line/Search`。
- 树内容：搜索框下方 8px，左右边距 16px；内部必须复用树形组件（`bepTree`）。
- 节点更多操作：使用 `Line/More`，16px，位于对应树节点右侧；不得手绘竖向三点。
- 加载态：容器中部显示 `Line/Loading` + “加载中”，文字 12px Regular，黑色 45%。
- 标题下拉：从标题栏下方展开，宽度等于容器宽，白底，阴影 `0 4 12 rgba(0,0,0,.12)`；选中项背景 `#F5F7FA`，文字主色。

### 状态交互
- default：显示标题栏、搜索框和树内容。
- loading：只显示标题栏和中部加载状态，不展示搜索框与树节点。
- titleOpen：标题栏箭头向下，并在标题栏下方显示标题下拉菜单。
- selected/hover：树节点状态仍由内部 `bepTree` 表达；复杂树形不另设树节点状态。
- nodeActions：节点右侧更多操作只在业务需要时显示，图标必须来自 BeP 图标库。

### 内容约束
- 复杂树形是业务树容器，负责标题、搜索、加载、标题切换和树内容组合；树节点层级仍交给 `bepTree`。
- `treeItems` 使用 `bepTree` 的扁平可见节点数组规则，每项显式传 `level` 和 `state`。
- 标题下拉只用于切换树的业务范围或组织口径，不用于普通下拉选择器。
- 大型选择弹窗、树形选择器下拉不是本批内容；后续基于 `bepTree` 和弹窗/选择器组件组合补充。

### 使用场景
- 适用：组织树、业务模块树、权限范围树、类目树等需要标题栏和搜索的左侧业务树区域。
- 不适用：单纯层级展示用树形组件（`bepTree`）；表格里的层级数据用树表格行（`bepTreeRow`）；输入框触发选树用后续树形选择器。
- 常见组合：左右分栏页面、权限配置页、组织管理页、弹窗/抽屉内的组织树区域。
- 模板位置：内容区左侧面板或弹窗/抽屉内容区，不作为系统侧边栏导航。

### 禁止事项
- 禁止页面脚本手写复杂树形容器、标题栏、搜索框、加载态、标题下拉或节点更多操作。
- 禁止用普通 Card + 输入框 + 手写树节点临时拼装复杂树形。
- 禁止把树表格行（`bepTreeRow`）放入复杂树形容器中近似基础树。

### 参数/API
```javascript
bepComplexTree({
  title:'业务模块名称',
  width:232,
  height:390,
  searchable:true,
  nodeActions:true,
  treeItems:[
    { label:'一级菜单01', level:0, state:'expanded' },
    { label:'二级菜单01', level:1, state:'collapsed' },
    { label:'三级菜单01', level:2, state:'leaf', selected:true }
  ]
})

bepComplexTree({
  title:'业务模块名称',
  loading:true
})

bepComplexTree({
  title:'业务模块名称',
  titleOpen:true,
  selectedOption:'业务模块名称',
  dropdownOptions:['业务模块名称', '业务模块名称', '业务模块名称'],
  treeItems:[{ label:'一级菜单01', level:0, state:'expanded' }]
})
```

---

## bepComplexTreePicker — 复杂树形选择面板

**层级：** 模块
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:75`，组件名 `复杂树形 ComplexTree`；本批沉淀弹窗/浮层内大型树选择形态。
**公开入口：** `bepComplexTreePicker(opts)`

### 样式属性
- 容器：默认 640×440，白底，圆角 2px，浮层阴影 `0 4 16 rgba(0,0,0,.12)`。
- 标题栏：高 56px，底部分割线 1px 黑色 10%；标题左距 24px。
- 标题文字：16px Medium，line-height 24，黑色 85%。
- 搜索框：默认显示在标题栏右侧，高 32px；使用复杂树形搜索框样式和 `Line/Search`。
- 关闭图标：右上 16px，使用 `Line/Close`，主色。
- 主体：默认左右分栏；左侧树区默认 180px，右侧详情区自适应；分割线 1px 黑色 10%。
- 左侧树：内部必须复用树形组件（`bepTree`），默认 x=16、y=16。
- 右侧详情列表：标题 14px Regular，行内 checkbox + 主文案 + 可选说明；选中行背景 `#F5F7FA`。
- 已选区：位于主体下方，可选显示；顶部 1px 分割线，标题 14px Regular，已选项使用选择器 Tag 样式。
- 底部操作区：高 56px，顶部分割线 1px 黑色 10%；右侧按钮必须复用 `bepButton`，取消为 Secondary，确定为 Primary。

### 状态交互
- default：标题栏 + 树区 + 可选详情区 + 可选已选区 + 底部按钮。
- checkable：左侧树节点和右侧详情列表显示 checkbox；checkbox 状态继承树形组件规则。
- selected：树节点、详情行、已选 Tag 根据传入数据展示。
- noDetail：不展示右侧详情列表，仅保留左侧树与右侧内容空白区域。
- noSelected：不展示已选区，主体区域自动增高。
- disabled/loading：本组件不单独公开；加载态应优先在左侧业务树区域使用复杂树形（`bepComplexTree`）或由业务明确后再补充。

### 内容约束
- 左侧树数据使用 `bepTree` 的扁平可见节点数组规则；不得在选择面板里重写树节点。
- 右侧详情列表用于当前选中树节点下的可选明细，不能承载表格列；多列明细应使用表格组件。
- 已选区只展示已选项摘要；超长项按 Tag 内部截断，完整列表应通过业务交互展开，不在页面脚本手写滚动列表。
- 取消/确定按钮文案默认固定为“取消 / 确定”，特殊业务文案通过参数传入。

### 使用场景
- 适用：组织/项目/权限/类目等需要先选树节点、再在节点内勾选明细的大型选择。
- 不适用：普通输入框触发选树用树形选择器（`bepTreeSelect`）；页面左侧业务树管理用复杂树形（`bepComplexTree`）；逐级列式选择用级联选择器。
- 常见组合：弹窗、浮层、抽屉内容区。
- 模板位置：弹窗/抽屉内容区或独立选择浮层；不作为普通页面 Card。

### 禁止事项
- 禁止页面脚本手写树选择弹窗、左右分栏、详情勾选行、已选 Tag 区或底部按钮。
- 禁止用普通 Card + Tree + Button 近似复杂树形选择面板。
- 禁止右侧详情列表手写 checkbox；必须由组件内部统一实现。

### 参数/API
```javascript
bepComplexTreePicker({
  title:'业务模块名称',
  width:640,
  height:520,
  checkable:true,
  treeItems:[
    { label:'一级菜单', level:0, state:'expanded' },
    { label:'二级菜单', level:1, state:'collapsed' }
  ],
  detailTitle:'三级菜单详情（共30条）',
  detailItems:[
    { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容' },
    { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容', checked:true }
  ],
  selectedTitle:'三级菜单名称（已选221）',
  selectedItems:['选项一', '选项二', '选项三']
})

bepComplexTreePicker({
  title:'业务模块名称',
  width:640,
  height:320,
  showDetail:false,
  showSelected:false,
  treeItems:items
})
```

---

## 高级表格 — 业务表格组件族

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 / node 0:89`，组件族 `7.Business/2.Table  Advanced高级表格`。

以下场景必须按 `advanced-table-rules.md` 生成，不得只用基础表格近似：
- 表头筛选/排序/输入筛选
- 可设置列
- 可拖拽排序
- 行内操作
- 多层级展开/权限点树状表格
- 折叠面板展开详情
- 快速新增行/输入态新增行
- 多级表头

**树状表格底色：** `内容-可展开` 一级行白底；`内容-二级`、`内容-三级` 子级行使用 `#F5F7FA`，整行贯通。树状表格统一通过 `bepTreeRow` 实现，不再另设简单树规范。

---

## bepActionCell — 操作列按钮组

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:988`，组件名 `数据展示-表格`。
**公开入口：** `bepActionMetrics(actionRows)` / `bepActionCell(actions, opts)`

### 样式属性
- 操作文字：14px Regular，line-height 22；普通操作主色，危险操作危险色。
- 间距：操作之间 16px；无分隔线。
- 更多：第 3 位替换为 BeP 图标 `Line/More`，16px。

### 状态交互
- default：按普通/危险语义展示。
- hover / focus / disabled / loading：操作列静态组件不公开这些状态；业务页面不得自行画 hover 或禁用操作。

### 内容约束
- 最多显示 3 个操作；超过 3 个时第 3 位替换为更多图标。
- 操作文本不得换行、不得省略。
- 操作列是父级复合列，不拆成多个表格列。
- 子级按第 1/2/3 位操作分别统计实际数据最大宽度；父级列宽由子级列宽之和、间距和左右 16px 组成。

### 使用场景
- 适用：表格行内编辑、查看、删除、终止等操作。
- 不适用：表单按钮、页头按钮、弹窗底部按钮；这些使用按钮（`bepButton`）或按钮组（`bepButtonGroup`）。

### 禁止事项
- 禁止手写文字链接或用按钮组件近似表格操作列。
- 禁止硬编码操作列宽。

**规则：**
- 最多显示 3 个操作；超过 3 个时第 3 位替换为 `Line/More` 图标（⋮）
- 间距 16px，无分隔线
- 操作列是父级复合列，不拆成多个表格列；子级按第1/2/3位操作分别统计实际数据最大宽度
- 操作文本不得换行、不得省略；单行渲染时传入统一的 `slotWidths` 保证每行操作位置对齐
- 表格操作列最终列宽 = `bepActionMetrics(actionRows).width + 左16 + 右16`
- type: `'primary'`（编辑/查看）或 `'danger'`（删除/终止）

**触发更多的场景：** 4+ 个操作（如：编辑、查看、提交审核、删除）

---

## bepEmptyState — 空状态

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 0:988`，组件名 `数据展示-表格`。
**公开入口：** `bepEmptyState(tableW)`

### 样式属性
- 宽度：与表格宽度一致。
- 高度：120px。
- 背景：白色。
- 文本：`暂无数据`，14px Regular，line-height 22，黑色 45%，水平居中。

### 状态交互
- default：空数据占位。
- hover / focus / selected / loading：不公开。

### 内容约束
- 仅用于表格数据为空时。
- 放在表头行之后；不能替代异常页、搜索无结果页或页面级空状态。

### 禁止事项
- 禁止页面脚本手写空状态图形和文字坐标。

**何时使用：** tableData 为空数组时，放在表头行之后

```javascript
var empty = bepEmptyState(TABLE_W);
empty.y = tblY + 48;   // 表头之后
tblWrap.appendChild(empty);
```

---

## bepPagination — 分页器

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 1390:26247`，组件名 `分页器`。

**公开入口：**
```javascript
bepPagination(totalText, current, pages, pageSize, opts)
```

**结构：**
- 总数文本：可选，14px Regular，line-height 22，黑色 65%。
- 上一页 / 下一页：32×32，r=2，描边黑色 15%，图标 16px；必须使用 BeP 图标 `Line/chevron-left` / `Line/chevron-right`。
- 页码：32×32，r=2；普通态白底 + 黑色 65%；当前页主色底 + 白色文字。
- 每页条数：默认显示，使用 `bepSelect(pageSize, 96, 32, { value:pageSize })`，不得手写下拉箭头。
- 跳页：默认显示，“跳至” + 48×32 输入框 + “页”。

**pages 数组规范：**
```javascript
[1, 2, 3, '…', 20]   // '…' 表示省略号
```
当前页用第二个参数 current 指定，分页器自动高亮。

**opts：**
- `showPageSize:false`：隐藏每页条数选择器。
- `showJump:false`：隐藏跳页区域。
- `pageSizeWidth`：每页条数选择器宽度，默认 96。
- `jumpWidth`：跳页输入框宽度，默认 48。
- `disabledPrev:true` / `disabledNext:true`：禁用上一页 / 下一页。
- `jumpValue`：跳页输入框值，仅用于样例或明确业务值。

**位置：** 表格下方 16px；与表格左边或右边按业务页面既有布局对齐，常规列表页靠右放置。

**状态交互：**
- 静态页面只表达当前页和首尾不可翻页状态。
- Figma 真源未公开 hover / focus / loading，业务页面不得自行补状态。

**禁止事项：**
- 禁止页面脚本手写页码按钮、翻页图标、每页条数选择器或跳页输入框。
- 禁止使用非 BeP 图标或手绘箭头替代 `Line/chevron-left` / `Line/chevron-right`。
- 禁止将分页器当作 Tabs、步骤条或底部操作栏使用。

---

## bepAlertModal — 提醒弹窗 / 对话框 POP

**层级：** 模块
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 704:28546`，页面标题 `对话框 POP`。
**公开入口：** `bepAlertModal(title, message, opts)`

### 样式属性
- 宽度：标准 420px。
- 背景：白色；圆角 2px；带弹窗阴影。
- 结构：左侧 24px 状态图标；标题 16px Medium、line-height 24、黑色 85%；正文 14px Regular、line-height 22、黑色 65%；右上关闭图标 16px 主色。
- 间距：左边距 40px；图标与标题 gap 16px；标题下方到正文 16px；正文下方到按钮区 32px；按钮右对齐，按钮间距 8px。
- 按钮：取消按钮使用 `bepButton(..., 'secondary')`；确认按钮按语义使用主按钮或危险按钮。

### 状态交互
- `type:'danger'`：删除/高风险不可恢复操作；图标 `Fill/Fail`，确认按钮 `danger`。
- `type:'warning'`：禁用、停用、影响同步等警示操作；图标 `Fill/Abnormal`，确认按钮 `primary`。
- `type:'info'`：退出编辑、普通提示；图标 `Fill/Tips`，确认按钮 `primary`。
- `showCancel:false`：单按钮提示，如“知道了”。
- `showClose:false`：极少数强制确认场景；默认显示关闭。
- loading / disabled：提醒弹窗自身不公开全局状态；确认中应通过按钮 loading/disabled 规则扩展，不得页面手写。

### 内容约束
- 只承载短标题 + 简短说明 + 操作按钮，不放表单项、描述列表或复杂内容。
- 标题应是操作对象或结果，例如“删除数据”“禁用数据”“退出编辑”“普通标题”。
- 正文说明操作后果；危险操作必须明确不可恢复或影响范围。
- 普通提示可只有确认按钮；确认操作默认显示取消 + 确认。

### 使用场景
- 适用：删除确认、禁用确认、退出编辑确认、普通短提示。
- 不适用：新增/编辑表单、复杂信息确认、详情查看；这些使用通用弹窗（`bepModal`）或抽屉（`bepDrawer`）。
- 常见组合：页面操作按钮触发后，作为遮罩层挂到 `pageFrame`。

### 禁止事项
- 禁止用通用弹窗标题栏结构近似提醒弹窗。
- 禁止页面脚本手写状态图标、关闭图标、弹窗阴影、按钮排列。
- 禁止不用 BeP 图标而手绘圆形感叹号/叉号。

### 参数/API
```javascript
bepAlertModal('删除数据', '删除后数据将不可恢复，是否删除？', {
  type:'danger',
  confirmLabel:'删 除'
})

bepAlertModal('普通标题', '这是一条普通提示内容表述。', {
  type:'info',
  confirmLabel:'知道了',
  showCancel:false
})
```

---

## bepModal — 弹窗

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 705:28547`，组件名 `弹框 PopBox`。

**宽度选择：** 420（小）/ 640（中）/ 800（大，Figma实测）

**contentNode：** 由调用方创建并传入，Modal 内部只负责框架与 24px 内容边距。内容模块宽度必须为 `modalWidth - 24 * 2`，不得在页面脚本里再额外包一层 24px padding。

**内容构成：** 表单弹窗内容由表单项（`bepFormItem`）组成；详情弹窗内容由描述列表（`bepDescriptions`）组成；复杂明细可使用表格等标准组件。弹窗框架本身不定义业务字段。

**底部操作区：** 高 52px，顶部分割线 1px 黑色 10%，按钮高 32，按钮 y=10，右对齐，按钮间距 8px。

**内容起点：** 标题栏高 56px，标题栏底部分割线包含在 56px 内；内容区 y = 56 + 24 = 80。

**表单/详情边界：**
- 表单弹窗：`variant:'form'`，默认显示底部取消/确定按钮。
- 详情弹窗：`variant:'detail'`，默认不显示底部按钮，只保留右上关闭。
- 显式传 `showFooter` 时优先级高于 `variant` 默认值。

**showFooter=false：** 纯信息展示、详情查看时用；详情弹窗默认即为 `false`。

**删除确认边界：** 删除、禁用、退出编辑、普通短提示等轻量确认优先使用提醒弹窗（`bepAlertModal`）。`bepModal` 只用于需要标题栏、内容区或复杂表单/详情的通用弹窗。

**复杂删除确认示例：**
```javascript
// 内容区：警告图标 + 两行文字
var content = bepFrame(MODAL_CONTENT_W, 48, {name:'DeleteContent'});
var ico = bepIcon('Fill/Abnormal', 20, bepHex('FFA645'));
// 图标 x=0, 文字 x=28
bepModal('删除确认', content, { width:420, confirmLabel:'确认删除' })
```

---

## bepDrawer — 抽屉

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 705:28548`，组件名 `抽屉 Drawer`。

**宽度选择：** 420（轻量）/ 640（默认，新增/编辑）/ 800（详情查看）

**结构规则：**
- 完整遮罩覆盖画布：黑色 45%。
- 抽屉面板从右侧滑入，x = `canvasW - drawerW`，高度固定等于 `canvasH`。
- 标题栏高 56px，标题 16px Medium、line-height 24、黑色 85%，x=24、y=16。
- 关闭图标使用 BeP 图标 `Line/Close`，16px，主色，x = `drawerW - 24 - 16`，y=20。
- 标题栏底部分割线包含在 56px 内：y=55，1px 黑色 10%。
- 内容区内置上下左右 24px padding，内容起点 y = `56 + 24 = 80`，内容宽度 = `drawerW - 24 * 2`。
- 长内容不拉高抽屉，表现为内容区滚动；底部操作区固定在窗口底部。
- 面板阴影沿用 Figma 抽屉真源三层 Drop Shadow，不使用页面级 Card 阴影。

**表单/详情边界：**
- 表单抽屉：`variant:'form'`，默认显示底部取消/确定按钮。
- 详情抽屉：`variant:'detail'`，默认不显示底部按钮，只保留右上关闭。
- 显式传 `showFooter` 时优先级高于 `variant` 默认值。

**底部操作区：** 高 52px，顶部分割线 1px 黑色 10%，按钮高 32，按钮 y=10，右对齐，按钮右边距 16，按钮间距 8px。

**内容区尺寸：**
```javascript
var contentW = DRW_W - 24 * 2;  // 640-48 = 592
```

**禁止事项：**
- 禁止页面脚本手写抽屉遮罩、标题栏、关闭图标、底部按钮或阴影。
- 禁止在 contentNode 内重复包 24px padding。
- 详情抽屉默认不得显示底部按钮。

---

## bepFormItem — 表单项

**组合使用：** 同一表单所有 formItem 必须用相同 labelW

```javascript
// 典型表单
var LBL = 90;
var CTRL_W = DRW_W - 24*2 - LBL - 12;  // = 490（640px 抽屉）

// 必填字段
bepFormItem('菜单名称', bepInput('请输入', CTRL_W, 32), { labelW:LBL, required:true })

// 禁用字段（创建后不可改）
var typeCtrl = bepSelect('菜单', CTRL_W, 32);
typeCtrl.fills = bepSolid(bepHex('F5F5F5'));  // 灰色背景表示禁用
bepFormItem('菜单类型', typeCtrl, { labelW:LBL, required:true })

// 错误状态
bepFormItem('手机号', bepInput('错误的值', CTRL_W, 32), {
  labelW: LBL, required: true, error: '请输入正确的手机号格式'
})
```

**表单行间距：** 20px（FIELD_GAP）

---

## 页头系统模式 — TopBar + Breadcrumb / TopBar + PageTabs

BeP 系统级页头打开机制只能二选一：

| 模式 | 当前函数 | 语义 | 页面打开行为 |
|---|---|---|---|
| `TopBar + Breadcrumb` | `bepHeader` / `bepTitleBar` | `bepTitleBar` 当前是 BreadcrumbBar 的旧名 | 下钻下级页面时用面包屑展示路径；平级页面覆盖当前页，不保留上一个页面 |
| `TopBar + PageTabs` | `bepTopBar` + `bepTabs` | `bepTabs` 当前是 PageTabs 的旧名 | 无论平级还是下级页面都新增页面页签，保留上一个页面页签 |

**系统级限制：** 同一个系统只能选择一种页头打开机制，不得同时混用 `TopBar + Breadcrumb` 与 `TopBar + PageTabs`。

**命名说明：** 现阶段保留旧 API，不直接改名以避免破坏已有脚本；文档语义上 `bepTitleBar = BreadcrumbBar`，`bepTabs = PageTabs`。

**HeaderTitle 关系：** `bepHeaderTitle` 不是第三种系统打开机制，而是在上述任一系统页头模式基础下方增加的业务对象标题摘要模块。其内部由 `bepObjectTitle` + 可选右侧操作按钮 + 可选标题型 Tabs 组成。

## bepHeader / bepTopBar / bepTitleBar — Breadcrumb 模式页头

**规则：** 使用 `TopBar + Breadcrumb` 打开机制的系统，绝大多数列表页用 `bepHeader`（组合），详情页/特殊页面才拆分使用。

```javascript
// 标准用法
var header = bepHeader('页面标题', ['系统管理', '当前页'], CANVAS_W - SIDE_W);
header.x = SIDE_W; header.y = 0;
```

**totalWidth = CANVAS_W - SIDE_W = 1232**（不是 1440）

**TopBar 系统切换：** “业务系统切换”为已选值，不是 placeholder；文字使用 `rgba(0,0,0,0.85)`，右侧切换图标使用黑色 45%。

## bepObjectTitle — 对象标题摘要

**层级：** 复合组件
**Figma 真源：** `凤凰会后台 / node 1044:10445` 的对象标题摘要区域
**公开入口：** `bepObjectTitle({title, subtitle, imageNode, status, tags, width})`

### 样式属性
- 尺寸：高度 56px；宽度由调用方传入。
- 图片：可选，固定 56×56，r=8，描边黑色 10%；图片与文字间距 16px。
- 主标题：20px Medium，line-height 28，黑色 85%。
- 副标题：14px Regular，line-height 22，黑色 45%，位于 y=34。
- 状态：6×6 圆点，状态文字 14px Regular，line-height 22，黑色 65%；标题与状态间距 12px，圆点与状态文字间距 10px。
- 标签：必须复用 `bepTag`；标签与前一元素间距 12px，标签之间 8px。

### 状态交互
- default：按以上样式展示。
- hover / active / focus / disabled / selected：对象标题摘要本身无交互态。

### 内容约束
- 主标题、状态、标签、副标题均按实际文字宽度反推；组件本身不承担表格列宽控制。
- 当宽度不足时，调用方必须调整布局或业务文案；不得在页面脚本里手写缩放、换行或省略规则。
- `imageNode` 必须由调用方传入已处理好的图片节点或标准占位节点。

### 使用场景
- 适用：详情页、对象概览、业务实体摘要中需要展示“对象身份 + 状态 + 标签 + 辅助信息”的场景。
- 不适用：系统级页头、面包屑、PageTabs、业务状态切换、普通卡片标题。
- 常见组合：在 `bepHeaderTitle` 内与右侧 `bepButton` 操作按钮、标题型 Tabs 组合。

### 禁止事项
- 禁止把右侧操作按钮、Tabs、Header 容器放入 `bepObjectTitle`。
- 禁止页面脚本手写对象标题摘要中的标签矩形；标签必须走 `bepTag`。

### 参数/API
```javascript
bepObjectTitle({
  width: 760,
  title: '品质棉质卫衣',
  subtitle: 'SPU-20260626-00841 · 服装 / 男装 / 卫衣',
  imageNode: productImage,
  status: { label:'已上架', type:'success' },
  tags: [{ label:'实物商品', type:'warning', style:'solid' }],
})
```

## bepHeaderTitle — 页头标题型

**Figma 真源：** `凤凰会后台 / node 1044:10445`，组件名 `4.Navigation/4.Header页头/页头-页头`。

**层级：** 模块

**定位：** 用于详情页 `bepHeader` 下方的标题摘要区，不替代 TopBar/TitleBar。组件宽度使用 `CANVAS_W - SIDE_W = 1232`，贴主内容区左边，从 `x=SIDE_W` 开始。

**组合关系：** `bepHeaderTitle = bepObjectTitle + 右侧操作按钮 + 可选标题型 Tabs`。对象摘要样式由 `bepObjectTitle` 负责；`bepHeaderTitle` 只负责页头标题区容器、操作区、Tabs 区和整体间距。

**组合形态：**
- 标题
- 标题 + 操作按钮
- 标题 + Tabs
- 标题 + 操作按钮 + Tabs

**结构与尺寸：**
- 容器白底；顶部内边距 24px，左右内边距 24px。
- 主标题行高 56px；对象标题摘要调用 `bepObjectTitle`。
- 标题行与 Tabs 间距 16px；无 Tabs 时不保留该间距，但组件底部必须自动保留 24px 内边距。
- Tabs 区高 32px，底部分割线从 x=24 开始，宽度 `contentW - 48`，黑色 10%。

**文字与元素：**
- 主标题：20px Medium，line-height 28，黑色 85%。
- 副标题：14px Regular，line-height 22，黑色 45%。
- 点状态：6×6 圆点，状态文字 14px Regular，line-height 22，黑色 65%。
- 标签必须复用 `bepTag`，不得手写标签矩形。
- 操作按钮必须复用 `bepButton`，右对齐，间距 8px，高 32px；描边主按钮使用 `primary-outline`。
- 标题型 Tabs 是 `bepHeaderTitle` 内置样式，不能用页头页签 `bepTabs`，也不能用卡片内页签 `bepCardTabs` 近似。

**标准调用：**
```javascript
var titleHeader = bepHeaderTitle({
  width: CANVAS_W - SIDE_W,
  title: '品质棉质卫衣',
  subtitle: 'SPU-20260626-00841 · 服装 / 男装 / 卫衣',
  imageNode: productImage,
  status: { label:'已上架', type:'success' },
  tags: [{ label:'实物商品', type:'warning', style:'solid' }],
  actions: [
    { label:'下架', type:'secondary' },
    { label:'编辑', type:'primary-outline' },
    { label:'下发门店', type:'primary' },
  ],
  tabs: ['商品信息', '操作记录'],
  activeTab: 0,
});
titleHeader.x = SIDE_W;
titleHeader.y = 96;
pageFrame.appendChild(titleHeader);
```

## bepMetricCard — 指标数据卡片

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 87:62585、87:64392`，数据看板中的 KPI 摘要卡、右侧小指标卡。

**层级：** 复合组件

**公开入口：** `bepMetricCard(opts)`

### 样式属性

- 尺寸：默认 `288×120`；宽高可通过 `width / height` 调整，用于等分看板网格或侧栏小指标。
- 背景：白色，圆角 `r=4`，默认无阴影。
- 内边距：左右 24px；标题 y=20，主数值 y=48。
- 标题：14px Regular，line-height 22，黑色 45%。
- 主数值：28px Medium，line-height 36，黑色 85%。
- 单位：14px Regular，line-height 22，黑色 45%，紧跟主数值右侧 6px。
- 右侧图标：圆形背景 56×56，默认主色；图标 24×24，必须使用 `bepIcon` 引用 BeP 图标。
- 趋势信息：12px Regular，line-height 20；label 黑色 45%，数值按语义着色。

### 状态交互

- default：静态展示指标标题、数值、单位、图标、趋势信息。
- hover / selected / disabled / loading：Figma 真源未公开，不作为公开状态；业务页面不得绘制这些静态状态。

### 内容约束

- 标题：短标题，不换行；过长标题应由业务简化或增大卡片宽度。
- 主数值：展示核心指标，保留完整数字和单位；不要把多个主指标挤在同一张卡中。
- 趋势：`trendItems` 最多建议 2 项，如“比上周 +11.3%”“日同比 100条”；超过 2 项应改用图表/详情模块。
- 图标：只能传 BeP 图标 key；引用不到图标时先提出缺口，不得手绘或内联 SVG。
- 迷你图：仅支持作为卡片辅助趋势的轻量占位（`bars / sparkline / donut`），不得替代完整图表。

### 使用场景

- 适用：数据看板顶部 KPI、右侧小指标、概览统计摘要。
- 不适用：完整折线图、柱状图、饼图、雷达图、词云、仪表盘、排行榜、新闻列表、表格。
- 常见组合：数据看板页中与图表容器、表格、排行榜模块平铺；卡片之间横向/纵向 gap 通常 16px。
- 模板位置：数据看板页（`page-templates.md` 第 10 类）。

### 禁止事项

- 禁止页面脚本自造 `makeMetricCard / buildMetricCard` 等替身。
- 禁止把完整图表、表格或排行榜塞进 `bepMetricCard`。
- 禁止为了图标效果在页面脚本手写 SVG、圆点、图形图标。

### 参数/API

```javascript
bepMetricCard({
  width: 288,
  height: 120,
  title: '指标一（万）',
  value: '12,986',
  unit: '万',
  iconKey: 'Line/bar-chart',
  iconColor: bepHex('#6EA5FF'),
  trendItems: [
    { label:'比上周', value:'+11.3%', status:'up' },
    { label:'日同比', value:'100条', status:'neutral' },
  ],
  miniChart: 'sparkline',
  chartColor: bepHex('#FF9C9C'),
})
```

## bepChartCard — 图表容器

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 87:62585、87:64392`，数据看板中的完整图表区域、趋势图、分布图、横向柱状对比图、仪表盘/词云占位。

**层级：** 模块

**公开入口：** `bepChartCard(opts)`

### 样式属性

- 尺寸：默认 `560×320`；宽高可通过 `width / height` 调整，适配全宽、半宽、三等分、不等分看板栅格。
- 背景：白色，圆角 `r=4`，默认无阴影。
- 内边距：左右 24px；标题区高度 48px；标题区底部分割线 1px 黑色 6%。
- 标题：14px Medium，line-height 22，黑色 85%，x=24，y=16。
- 副标题/更新时间：12px Regular，line-height 20，黑色 45%，位于标题右侧 16px。
- 右侧操作：14px Regular 主色文字，右对齐；如需按钮操作，应在卡片外或业务操作区使用 `bepButton`。
- 卡片内 Tabs：可选，调用 `bepCardTabs` 的卡片内样式，不得用页头页签 `bepTabs` 近似。
- 图例：12px Regular，黑色 45%；色点 8×8，圆角 4px。
- 图表区域：组件内置常见骨架；用于表达看板模块结构，不等同于真实图表引擎。

### 状态交互

- default：展示标题、可选副标题、可选操作、可选 Tabs、可选图例和图表骨架。
- 支持图表类型：`line / bar / horizontal-bar / donut / gauge / word-cloud / placeholder`。
- hover / selected / disabled / loading：Figma 真源未公开，不作为公开状态；业务页面不得自行绘制这些静态状态。

### 内容约束

- 标题必须短且明确；过长标题应由业务简化或增大卡片宽度，不在页面脚本里压缩字号。
- 图例建议 2-5 项；超过 5 项应改为筛选/下拉或更宽图表区域。
- `metrics` 只用于图表右侧少量辅助指标，不能替代 `bepMetricCard`。
- 图表骨架只用于设计稿表达结构；如果业务要求真实数据可视化，需要在业务实现中接入图表库，但 BeP 页面脚本仍必须使用 `bepChartCard` 管理容器、标题、图例和布局。
- 表格型看板模块应使用标准表格组件放入页面级 Card 或后续公开的表格模块，不塞进 `bepChartCard`。

### 使用场景

- 适用：数据看板完整折线图、柱状图、横向柱状对比图、环形图、仪表盘、词云、占位图表区域。
- 不适用：KPI 摘要卡片用 `bepMetricCard`；重复业务入口卡片用 `bepCard`；普通业务详情字段用 `bepDescriptions`。
- 常见组合：看板顶部用 `bepMetricCard`，主体图表区域用 `bepChartCard`，图表卡片之间 gap 通常 16px。
- 模板位置：数据看板页（`page-templates.md` 第 10 类）。

### 禁止事项

- 禁止页面脚本自造 `makeChartCard / buildChartCard / makeChartPanel / buildChartPanel` 等替身。
- 禁止页面脚本手写图表卡片外框、标题分割线、图例、Tabs 或图表占位骨架。
- 禁止用 `bepMetricCard` 承载完整图表。
- 禁止为了图标效果在页面脚本手写 SVG；图表操作图标必须走 BeP 图标库。

### 参数/API

```javascript
bepChartCard({
  width: 560,
  height: 320,
  title: '趋势分析',
  subtitle: '更新截止于：2026/08/06',
  action: '更多',
  tabs: ['数据统计', '市场趋势'],
  activeTab: 0,
  type: 'line',
  legend: ['数据一', '数据二'],
  values: [36, 52, 44, 72, 64, 82],
  metrics: [
    { label:'本月销售额', value:'221' },
    { label:'环比增长', value:'+12.8%' }
  ]
})
```

## bepDashboardTableCard — 看板表格

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 87:62585、87:64392`，数据看板中的表格型模块。

**层级：** 模块

**公开入口：** `bepDashboardTableCard(opts)`

### 样式属性

- 尺寸：默认 `560×320`；宽高可通过 `width / height` 调整，适配数据看板全宽、半宽、不等分布局。
- 背景：白色，圆角 `r=4`，默认无阴影。
- 内边距：左右 24px；标题区高度 48px；标题区底部分割线 1px 黑色 6%。
- 标题：14px Medium，line-height 22，黑色 85%，x=24，y=16。
- 副标题/更新时间：12px Regular，line-height 20，黑色 45%，位于标题右侧 16px。
- 右侧操作：14px Regular 主色文字，右对齐。
- 卡片内 Tabs：可选，调用 `bepCardTabs` 的卡片内样式。
- 表格：内部必须调用 `bepTableHeader` 与 `bepTableRow`；默认使用 `size:'mini'`，行高 40px。

### 状态交互

- default：展示标题、可选副标题、可选操作、可选 Tabs、表头和数据行。
- empty：无数据时展示 `bepEmptyState`。
- hover / selected / disabled / loading：Figma 真源未公开，不作为公开状态；业务页面不得自行绘制这些静态状态。

### 内容约束

- `cols` 必须按列建模，包含 `label / key / width或w / align`；未传宽度时由组件等分剩余宽度。
- `rows` 可以是对象数组或数组行；对象行通过 `cols.key` 取值。
- 表格单元格仍必须使用 `bepTableText` / `bepTruncText`，由 `bepTableRow` 内部处理。
- 数值列设置 `align:'right'`；不可截断字段应增大列宽，不在页面脚本里改文字规则。
- 看板表格不放分页器；需要分页、批量操作、冻结列或复杂筛选时，应使用标准列表页/高级表格模板。

### 使用场景

- 适用：数据看板中的小型明细表、Top 明细、统计表格模块。
- 不适用：完整列表页、可操作业务表格、高级表格、树状表格、分页表格。
- 常见组合：与指标数据卡片（`bepMetricCard`）、图表容器（`bepChartCard`）、排行榜（`bepRankListCard`）平铺，模块间 gap 通常 16px。
- 模板位置：数据看板页（`page-templates.md` 第 10 类）。

### 禁止事项

- 禁止页面脚本自造 `makeDashboardTable / buildDashboardTable / makeTableCard` 等替身。
- 禁止页面脚本手写表头、单元格、底边线；必须复用标准表格组件。
- 禁止用 `bepMetricCard`、`bepChartCard` 或 `bepCard` 近似看板表格。

### 参数/API

```javascript
bepDashboardTableCard({
  width: 560,
  height: 320,
  title: '销售明细',
  action: '更多',
  cols: [
    { label:'项目名称', key:'name' },
    { label:'销售额', key:'amount', align:'right', w:120 },
    { label:'占比', key:'rate', align:'right', w:96 }
  ],
  rows: [
    { name:'项目一', amount:'12,986', rate:'36%' },
    { name:'项目二', amount:'8,621', rate:'24%' }
  ]
})
```

## bepRankListCard — 排行榜

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 87:62585、87:64392`，数据看板中的列表型 Top N 排行模块。

**层级：** 模块

**公开入口：** `bepRankListCard(opts)`

### 样式属性

- 尺寸：默认 `360×320`；宽高可通过 `width / height` 调整。
- 背景：白色，圆角 `r=4`，默认无阴影。
- 内边距：左右 24px；标题区高度 48px；标题区底部分割线 1px 黑色 6%。
- 标题：14px Medium，line-height 22，黑色 85%。
- 排名徽标：22×22，圆形；Top 3 使用语义色和白色数字，其他名次使用浅灰底与黑色 45% 数字。
- 排名项文字：14px Regular，line-height 22，黑色 65%；右侧数值 14px Regular，黑色 85%。
- 进度条：可选，6px 高，背景黑色 4%，前景主色。

### 状态交互

- default：展示标题、可选副标题、可选操作、可选 Tabs、排名项。
- hover / selected / disabled / loading：Figma 真源未公开，不作为公开状态；业务页面不得自行绘制这些静态状态。

### 内容约束

- `items` 建议 3-8 条；超出由组件按容器高度裁切，更多内容应进入完整列表页。
- 每项支持 `label/name`、`value`、`rate/percent`；`rate/percent` 为数字时显示进度条。
- 排行项名称使用固定宽文本，超长截断；完整名称应通过详情或完整列表查看。
- 列表型排行榜不等同于横向柱状图；横向柱状图仍使用图表容器（`bepChartCard({type:'horizontal-bar'})`）。

### 使用场景

- 适用：数据看板中的 Top N 项目、门店、商品、人员、指标排行。
- 不适用：完整表格排行、横向柱状排行图、可筛选可分页列表。
- 常见组合：与指标数据卡片、图表容器、看板表格平铺，模块间 gap 通常 16px。
- 模板位置：数据看板页（`page-templates.md` 第 10 类）。

### 禁止事项

- 禁止页面脚本自造 `makeRankList / buildRanking / makeRankingCard` 等替身。
- 禁止用 `bepMetricCard`、`bepChartCard` 或 `bepCard` 近似列表型排行榜。
- 禁止手写排名徽标、列表底边线或进度条。

### 参数/API

```javascript
bepRankListCard({
  width: 360,
  height: 320,
  title: '门店排行榜',
  action: '更多',
  items: [
    { label:'项目名称一', value:'12,986', rate:92 },
    { label:'项目名称二', value:'8,621', rate:76 }
  ]
})
```

## bepCard / bepAddCard — 内容卡片 / 新增卡片

**层级：** 复合组件
**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 87:67004`，模板 `6.数据看板/3.卡片页`。
**公开入口：** `bepCard(opts)` / `bepAddCard(opts)`

### 样式属性
- 尺寸：默认 `288×255`；可通过 `width / height` 调整以适配卡片网格。
- 背景：白色，圆角 `r=4`，默认无阴影。
- 图标圆：44×44，x=24、y=24；背景色由 `iconColor` 控制。
- 图标：24×24，必须使用 BeP 图标 key（`iconKey`），不得手写图标。
- 标题：16px Medium，line-height 24，黑色 85%；默认位于图标右侧 x=80、y=34。
- 描述行：14px Regular，line-height 22；label 黑色 45%，value 黑色 65%；label 自动补中文冒号。
- 底部操作区：高度 47px，顶部 1px 黑色 6% 分割线；操作等分排列，文字主色 14px Regular。
- 操作分隔线：列间 1px 黑色 6%，高 24px，垂直居中。
- 新增卡片：同尺寸白底 r=4；中间使用 `Line/Add` 加号图标，标题 16px Medium，描述 14px Regular 黑色 45%。

### 状态交互
- default：展示图标、标题、描述和可选操作区。
- add：新增入口卡片，调用 `bepAddCard`。
- more：操作项 label 为“更多”时，自动追加 `Line/DropDown-Arrow`。
- hover / selected / disabled / loading：Figma 真源未公开，不作为公开状态；业务页面不得自行绘制这些静态状态。

### 内容约束
- 内容卡片用于重复信息摘要，不承载完整表格、复杂图表或长正文。
- 描述行最多建议 3 行；更多字段应改用描述列表或详情页。
- 操作项建议 2-3 个，超出应改为“更多”或进入详情页；底部操作文字不可换行。
- 新增卡片只作为创建入口，不塞业务字段或状态。
- 图标只能传 BeP 图标 key；引用不到图标时先提出缺口。

### 使用场景
- 适用：卡片页、应用入口、业务对象摘要列表、数据看板中的非 KPI 内容卡片。
- 不适用：KPI 数值摘要用指标数据卡片（`bepMetricCard`）；页面大块内容容器用页面级 Card 规则；完整图表/排行榜/表格不用内容卡片承载。
- 常见组合：卡片网格，卡片之间 gap 通常 16px。
- 模板位置：卡片页、数据看板卡片区域、业务入口页。

### 禁止事项
- 禁止页面脚本手写内容卡片、图标圆、底部操作区或操作分隔线。
- 禁止用内容卡片替代指标数据卡片。
- 禁止手写新增卡片加号；新增入口必须使用 `bepAddCard`。

### 参数/API
```javascript
bepCard({
  width:288,
  height:255,
  title:'卡片标题',
  iconKey:'Line/database',
  iconColor:BEP_C.primary,
  descs:[
    { label:'描述项目', value:'项目名称' },
    { label:'描述项目', value:'项目文案' },
    { label:'描述项目', value:'长文案描述长文案描述' }
  ],
  actions:['操作一', '操作二', '更多']
})

bepAddCard({
  width:288,
  height:255,
  title:'新增卡片',
  desc:'卡片描述卡片描述卡片描述'
})
```

## bepTabs / bepCardTabs — 系统页签与内容页签

**bepTabs：** 系统级 PageTabs，仅用于 `TopBar + PageTabs` 打开机制的页头第二行，替代 BreadcrumbBar，宽度为 `CANVAS_W - SIDE_W`，不能放在内容卡片内部，也不能用于业务状态/业务视图切换。

**bepCardTabs：** 用于内容卡片内部的局部页签，宽度必须传卡片外宽 `CARD_W`，组件内部按 BeP 官方样式处理 24px 左右内缩、底边线和选中态下划线。

**对象标题内置 Tabs：** 由 `bepHeaderTitle.tabs` 承载，用于详情对象标题摘要下的对象级内容分区，不等同于系统级 `bepTabs`，也不等同于卡片内 `bepCardTabs`。`bepObjectTitle` 本体只负责对象标题摘要，不直接暴露 Tabs 参数；需要对象标题内置 Tabs 时使用 `bepHeaderTitle({ tabs:[...] })`。

**对象标题内置 Tabs / 卡片内 Tabs 判定：**
- 当前页面应用对象标题摘要，且 Tabs 控制整个页面主内容：使用 `bepHeaderTitle` 内置 Tabs。
- 当前页面应用对象标题摘要，但 Tabs 只控制某个内容卡片内部：使用 `bepCardTabs`。
- 当前页面不应用对象标题摘要：只能使用 `bepCardTabs`，不得为了放 Tabs 单独套 `bepHeaderTitle` 或对象标题内置 Tabs。

**bepTabs Figma 真源：** `BeP Admin Kit Sketch V1.1.0 / node 0:1459`，组件名 `4.Navigation/4.Header页头/页头-带页签`。

**bepTabs 官方样式：**
- 容器高 48px，背景 `#F0F2F5`
- 左右翻页按钮：32×32，x=16 / right=16，白底，r=4，阴影 `0 0 2 rgba(0,0,0,0.10)`
- 标签区：x=52，y=8，gap=4px；标签横向溢出时由容器裁切，翻页按钮覆盖在上层
- 单个标签：高 32px，白底，r=4，左右 padding 16px；文字与关闭图标 gap=4px
- 标签宽度由 `文字宽度 + 16 + 4 + 12 + 16` 反推，不固定 90px
- 文字：PingFang SC Regular，14px，line-height 22px，y=5
- 默认态：文字 `rgba(0,0,0,0.65)`，关闭图标黑色 45%
- 选中态：文字 `#006D9B`，关闭图标 `#006D9B`；无下划线
- Hover 态：文字 `#338AAF`，关闭图标 `#006D9B`

**bepCardTabs Figma 真源：** `BeP Admin Kit Sketch V1.1.0 / node 87:62879`，组件名 `4.Navigation/5.Tabs标签/基础标签/基础标签`。

**bepCardTabs 官方样式：**
- 容器高 54px，透明背景
- 内容左右内缩 24px
- 底部分割线：x=24，w=`CARD_W - 48`，h=1，`rgba(0,0,0,0.10)`
- 标签组从 x=24 开始，gap=16px
- 文字：PingFang SC Regular，14px，line-height 22px，y=16
- 选中态：文字 `#006D9B`，底部 2px `#006D9B` 下划线，标签高 54px
- 默认态：文字 `rgba(0,0,0,0.65)`，左右 padding 1px

```javascript
var tabs = bepCardTabs(['基本信息', '权限管理'], 0, CARD_W);
tabs.x = 0;
tabs.y = 0;
card.appendChild(tabs);
```

## bepDescriptions — 描述列表

**用途：** 详情页只读信息展示。优先使用 `bepDescriptions`，不要在页面里手写 label/value 坐标。

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 / node 901:7504`，组件名 `3.DataDisplay/8.Descriptions 描述列表/基础样式`。

**官方样式：**
- 外层页面级卡片：1200px 宽，白底，r=4，默认无阴影
- 内容区：x=24，y=24，w=1152
- 标题：PingFang SC Medium，16px，line-height 24px，`rgba(0,0,0,0.85)`
- 标题到第一行：24px
- 描述项先区分短文本和长文本，再决定排布
- 短文本按页面宽度分列：窄内容可 2 列，1440 画布默认 3 列，超宽屏可 4 列
- 当前 1440 标准画布下默认三列布局：每列 384px（1152 / 3）
- 行间距：16px；官方示例行 y=72、110、148，行距 38px
- 每个描述项：横向排列，label 与 value 间距 16px，右侧 padding 16px
- label：PingFang SC Regular，14px，line-height 22px，`rgba(0,0,0,0.45)`，自动补英文冒号 `:`
- value：PingFang SC Regular，14px，line-height 22px，`rgba(0,0,0,0.85)`
- 分组间距：上一分组底部到分割线 24px；分割线 h=1，黑色 10%；分割线到下一分组标题 24px
- 详情页描述字段默认使用组件内置 label/value 色阶；不得给普通字段手写 `color`、`a` 或自定义灰蓝色。
- 只有以下语义允许改变 value 颜色：链接/可点击对象、状态 Tag、风险/异常、禁用、辅助说明。只读字段不是自动弱化理由。
- 编辑页的输入态、校验态、hint、annot、接口异常演示不得直接作为详情页描述项颜色或字段。
- 描述列表只有一种信息结构：`label + value`。`标题：内容 + 标签`、`标题：标签`、`标题：附件/链接`、`标题：图片/视频` 都属于描述列表，只是 value 类型不同。
- value 类型必须走标准组件：标签用 `bepTag`/`bepDescTags`，链接用 `bepDescLink`/`bepDescLinks`，附件用 `bepDescAttachments`，图片/视频用 `bepDescMedia`。页面脚本不得手写这些 value 的矩形、图标、文字坐标；如现有函数不能满足，先补 `bep-components.js`。
- 长文本独占整行：1440 画布下占 3 列，即 1152px；超长时 value 内容可换行，不截断
- 长文本判断：`long:true` / `type:'long'` / `span` 等于当前列数 / 文本超过默认阈值 30 字符
- 跨列：`span:2` 占 768px；`span:3` 占 1152px；长备注、长描述、长 URL 应使用 `long:true` 或 `span:3`
- 推荐使用 `items` 输入，让组件自动把短文本流入 2/3/4 列；兼容旧 `rows` 写法，但组件内部仍会按短/长文本规则重新排布
- `bepDescriptions` 的多个 `sections` 只用于同一卡片内的近关系分组。详情页如果存在多个业务亲近关系较远的描述分组，应由页面层拆成多个页面级 Card，不要强行塞进一个 `bepDescriptions`。
- 图层必须语义化分组：`Descriptions > Section/<标题> > Row/01 > Item/<字段名> > Label + Value`。不得把所有 label/value 文本直接堆在 `Descriptions` 根层。
- 传入 `node` 的值也必须挂在对应 `Item/<字段名>` 的 `Value` 位置，不能散落在 Section 或 Descriptions 根层。已有固定 value 类型时优先使用 `tags / links / attachments / media` 输入，不优先使用 `node` 兜底。

**结构：**
```javascript
bepDescriptions([
  { title:'系统信息', items:[
      { label:'系统编码', value:'MALL_PLATFORM' },
      { label:'系统名称', value:'商城运营平台' },
      { label:'状态', tags:[{ label:'已接入', type:'success' }] },
      { label:'业务范围', value:'社区增值服务', tags:[{ label:'重点', type:'warning' }] },
      { label:'官网', link:{ label:'https://mall.example.com' }, span:2 },
      { label:'附件', attachments:[{ name:'系统接入说明.pdf', size:'2.4MB' }], span:2 },
      { label:'现场照片', media:[{ label:'门头照片', type:'image' }, { label:'巡检视频', type:'video' }], span:3 },
      { label:'系统描述', value:'商城平台运营管理后台，管理商品、订单、会员、营销等核心业务', long:true }
  ]}
], TABLE_W)
```

**value 输入类型：**
```javascript
{ label:'普通文本', value:'内容' }
{ label:'内容加标签', value:'已完成', tags:[{ label:'重点', type:'warning' }] }
{ label:'标签', tags:[{ label:'启用', type:'success' }] }
{ label:'链接', link:{ label:'查看详情' } }
{ label:'多个链接', links:[{ label:'合同详情' }, { label:'付款记录' }] }
{ label:'附件', attachments:[{ name:'合同.pdf', size:'2.4MB' }] }
{ label:'图片视频', media:[{ label:'现场图', type:'image' }, { label:'巡检视频', type:'video' }] }
```

**生成后的图层结构：**
```text
Descriptions
├─ Section/系统信息
│  ├─ SectionTitle
│  ├─ Row/01
│  │  ├─ Item/系统编码
│  │  │  ├─ Label
│  │  │  └─ Value
│  │  ├─ Item/系统名称
│  │  └─ Item/状态
│  └─ Row/02
│     └─ Item/系统描述
│        ├─ Label
│        └─ Value
```

---

## bepSteps — 步骤条

**层级：** 复合组件

**用途：** 展示分步流程的阶段进度。步骤条表达“当前处于第几步、前后步骤是什么”，不是历史记录列表。

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 700:27657`，组件名 `3.DataDisplay/10.Steps步骤条`。

**公开入口：** `bepSteps(steps, currentIdx, totalWidth, opts)`

### 样式属性
- 形态：基础横向 `basic`、带描述横向 `description`、竖式 `vertical`。
- 默认宽度：横向默认 1152px，按步骤数均分；竖式默认使用传入宽度，文字从 x=36 开始。
- 高度：基础横向 54px；带描述横向 78px；竖式每项 54/78px，项间距 24px。
- 步骤圆点：24×24。
- 连接线：横向 x=32、y=12、高 1px；竖式 x=12、从圆点下方连接到下一项；默认黑色 10%，已完成段使用主色。
- 标题：14px，line-height 22；当前态 Medium 黑色 85%，非当前态 Regular 黑色 65%。
- 描述：12px，line-height 20；当前态黑色 85%，非当前态黑色 45%。

### 状态交互
- done/已完成：主色实心圆 + BeP 图标 `Fill/Success`，完成段连接线为主色。
- current/当前：主色实心圆 + 白色数字，标题 Medium 黑色 85%，描述黑色 85%。
- pending/待处理：白底圆圈 + 黑色 15% 描边，数字黑色 25%，标题黑色 65%，描述黑色 45%。
- hover/focus/active/disabled：Figma 真源未公开交互态；业务页面不得自行绘制这些静态态。

### 内容约束
- `steps` 至少 2 项；少于 2 项时不应使用步骤条。
- 每项必须有 `title`；`desc` 仅在 `description` 或 `vertical` 形态显示。
- 标题应简短，不换行；描述为辅助说明，建议控制字数。
- `currentIdx` 为 0-based，之前步骤自动视为已完成，之后步骤自动视为待处理。

### 使用场景
- 适用：分步表单、流程配置、审批提交进度、任务阶段引导。
- 不适用：操作记录、审核记录、库存流水、价格变更历史等时间顺序记录；这些必须使用时间轴（`bepTimeline`）。
- 常见组合：表单页顶部 Card 内步骤引导；抽屉/弹窗内分步流程；详情页只读阶段进度。
- 模板位置：分步表单通常放在内容 Card 顶部，步骤条下方与表单内容保持 24px 间距。

### 禁止事项
- 禁止页面脚本手写步骤圆点、数字、对勾或连接线。
- 禁止用步骤条表达动态历史记录。
- 禁止用 `bepTimeline` 近似分步流程进度。

### 参数/API
```javascript
bepSteps([
  { title: '基础信息', desc: '填写商品基础资料' },
  { title: '销售信息', desc: '配置价格和库存' },
  { title: '提交审核', desc: '确认信息后提交' }
], 1, 1152, { variant: 'description' })

bepSteps([
  { title: '提交申请' },
  { title: '运营审核' },
  { title: '发布完成' }
], 0, 320, { variant: 'vertical' })
```

---

## bepTimeline — 时间轴

**层级：** 复合组件

**用途：** 按时间顺序展示动态记录。操作记录、审核记录、库存流水、价格变更历史、流程记录等必须使用时间轴（`bepTimeline`），不要用描述列表、表格或页面内手写圆点连线近似。

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 / node 700:27656`，组件名 `3.DataDisplay/9.Timeline时间轴`。

**公开入口：** `bepTimeline(items, opts)`

### 样式属性
- 形态：基础样式 `basic`、带描述样式 `description`。
- 默认宽度：624px；可通过 `opts.width` 传入，内容列从 x=24 开始。
- 点：8×8，x=0，y=7；默认/已完成为主色 `#006D9B`，不通过为 `#FE5E54`，当前/处理中为白底主色描边，结束为黑色 25%。
- 连接线：黑色 10%，实线宽 2px；虚线为 1px 分段线。线从当前节点下方连接到下一节点。
- 标题：14px，line-height 22，黑色 85%；基础样式 Regular，带描述样式 Medium。
- 时间：12px，line-height 20，黑色 45%，位于标题下方。
- 描述块：背景黑色 4%，圆角 2，内边距 16；描述文字 14px，line-height 22，黑色 65%。
- 项间距：24px。

### 状态交互
- default/success：蓝色实心点，用于已提交、已通过、已完成等正常记录。
- error/reject/danger：红色实心点，用于不通过、驳回、失败、异常。
- processing/current/pending：白底蓝色描边点，用于当前处理、待处理或再次审批。
- end/disabled/finish：灰色点，用于结束流程、完结、无后续。
- hover/focus/active：时间轴为只读数据展示组件，Figma 真源未定义交互态；页面不得自行补 hover 或点击态。

### 内容约束
- 每条记录至少包含 `title`；推荐包含 `time`。
- `desc` 只用于带描述样式，描述文字可换行，不截断。
- `status` 只表达记录状态，不改变业务文案。
- `lineType:'dashed'` 只用于中断、等待、再次审批等需要表达非连续关系的连接线。
- 空数据不得手写占位时间轴；应使用页面已有空状态规则或先补统一空状态规则。

### 使用场景
- 适用：操作记录、审批记录、流程记录、库存流水、价格变更历史等动态记录。
- 不适用：静态详情字段展示用描述列表（`bepDescriptions`）；阶段进度引导用步骤条（`bepSteps`）；列表型数据用表格。
- 常见组合：对象级 Tabs 中的“操作记录”页签；详情页独立动态记录 Card；抽屉详情中的审批记录区。
- 模板位置：详情页或对象详情页的动态记录内容区，通常位于对应 Tabs 激活内容内。

### 禁止事项
- 禁止页面脚本自造 `TimelineItem`、`LogRow`、圆点、连线、日志行。
- 禁止用描述列表模拟操作记录。
- 禁止用步骤条表达历史记录列表。
- 禁止为了展示多个 Tabs 内容，把操作记录堆到商品信息等静态详情页签里。

### 参数/API
```javascript
bepTimeline([
  {
    title: '提交申请',
    time: '2022/09/08 09:32:08',
    desc: '发起商品上架申请，等待运营审核。',
    status: 'success',
    lineType: 'solid'
  },
  {
    title: '不通过',
    time: '2022/09/08 10:12:31',
    desc: '商品主图不符合平台规范，请调整后重新提交。',
    status: 'error',
    lineType: 'dashed'
  },
  {
    title: '再次审批',
    time: '2022/09/08 14:08:22',
    status: 'processing'
  },
  {
    title: '结束流程',
    time: '2022/09/08 15:32:08',
    status: 'end'
  }
], { width: 624, variant: 'description' })
```

---

## bepSidebarItem — 侧边栏菜单项

**层级：** 模块

**公开入口：** `bepSidebarItem(label, level, state, iconKey, sideW)`

### 样式属性

- 高度：48px。
- 宽度：默认 `sideW=208`。
- 背景：一级菜单 `#002138`；二级/三级菜单 `#00182A`。
- 文字：14px Regular，line-height 22，白色；default 透明度 50%，active/expanded 透明度 100%。
- 一级图标：16×16，x=24，y=16，白色，透明度跟随文字。
- 一级文字：有图标 x=48，无图标 x=24。
- 二级文字：有图标 x=56，无图标 x=40。
- 三级文字：有图标 x=72，无图标 x=56。
- 展开箭头：仅一级 expanded 显示 `Line/PutAway-Arrow`，12×12，x=186，y=18。

### 状态交互

- `default`：普通未激活态，文字/图标 50%。
- `active`：当前所在菜单项，文字/图标 100%；不额外增加蓝色竖线或高亮底色。
- `expanded`：展开态，文字/图标 100%；一级菜单显示收起箭头。
- hover / disabled / loading：Figma 真源未公开，不作为公开状态；业务页面不得自行绘制。

### 内容约束

- level 支持 `1 / 2 / 3`；不应继续增加第四级侧边栏。
- 三级菜单用于二级菜单展开后的叶子项，例如“组件管理 > 人员管理 > 员工列表”。
- iconKey 只能引用 BeP 图标库已有 key；引用不到图标时先提出缺口并补图标库，不得页面脚本手绘、内联 SVG 或临时 append 自定义图标。
- 菜单文案过长应由业务简化或调整侧边栏宽度；不得缩小字号。

### 使用场景

- 适用：系统左侧导航一级、二级、三级菜单。
- 不适用：页面内容区树形导航、表格树、级联选择器、复杂树形组件。
- 常见组合：`bepSidebarLogo` + 多个 `bepSidebarItem`。

### 禁止事项

- 禁止页面脚本自造 `sidebarL3 / makeSidebarItem / addSideL1` 等侧边栏菜单替身。
- 禁止 active 态额外绘制蓝色竖线、高亮块或自定义图标。
- 禁止在 BeP 图标库外手绘业务图标。

### 参数/API

```javascript
bepSidebarItem('组件管理', 1, 'expanded', 'Line/layers')
bepSidebarItem('人员管理', 2, 'default')
bepSidebarItem('员工列表', 3, 'active')
```

---

## bepBreadcrumb — 面包屑

**规则：**
- 末项（当前页）opacity=0.85；其余项 opacity=0.45
- 分隔箭头 `Line/Right-Arrow` 12×12，opacity=0.25
- bepHeader 内部已内置面包屑；独立使用时才调用此函数

---

## bepMessage — 全局提示

**层级：** 模块

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 704:28544` 中的 `全局提示 Message`，组件路径 `5.FeedBack/1.Message全局提示`。

**公开入口：** `bepMessage(text, type)`

### 样式属性
- 尺寸：高度固定 40px；`info / success / error` 最小宽度 120px，宽度由文字反推；`loading` 最小宽度 106px。
- 颜色：
  - `info`：背景 `#E6F0F5`，描边 `#CCE2EB`，图标 `Fill/Tips` 主色。
  - `success`：背景 `#EBF8EC`，描边 `#D8F1D8`，图标 `Fill/Success` 成功色。
  - `error` / `danger`：背景 `#FFEEEE`，描边 `#FFDFDD`，图标 `Fill/Fail` 危险色。
  - `loading`：白底，无描边，图标 `Line/Loading`。
- 字体：14px Regular，line-height 22，黑色 65%。
- 圆角/描边/阴影：圆角 r=2；非 loading 有 1px 内描边；loading 为白底悬浮卡片，带轻阴影。
- 间距/布局：左 padding 16；图标 16px，x=16、y=12；图标与文字 gap=8；文字 x=40、y=9；右 padding 16。

### 状态交互
- `info`：普通消息提示。
- `success`：操作成功反馈。
- `error` / `danger`：操作失败反馈；`danger` 仅作为失败别名兼容旧页面。
- `loading`：加载中反馈，图标节点命名为 `LoadingRotating`，表示前端实现需旋转。
- warning：全局提示 Message 不公开 warning；警告类块状内容必须使用警告提示（`bepAlert`），不得用 Message 近似。
- close/action：全局提示 Message 不带关闭按钮和操作链接。
- 自动消失：脚本只生成静态视觉；前端行为通常自动消失，由业务实现承载。

### 内容约束
- 只承载一行短提示文字，不承载标题、说明段落、操作按钮或链接。
- 文案应为操作结果或短反馈，例如“保存成功”“加载中”“操作失败”。
- 长说明、可关闭块状提示、带标题/详情/操作链接的提示属于 Alert，不属于 Message。

### 使用场景
- 适用：保存成功、提交成功、加载中、短失败反馈等浮动顶部轻提示。
- 不适用：页面内常驻警告说明、带标题说明、带关闭按钮或操作链接的提示；这些使用 Alert。
- 常见组合：表单提交后、列表操作后、弹窗/抽屉操作后在页面顶部居中显示。
- 模板位置：通常浮于页面顶部，调用方负责定位，常见为水平居中、距顶部 24px 左右。

### 禁止事项
- 禁止页面脚本自造 `makeMessage`、Toast、手写浅色框、手写状态图标。
- 禁止把 Alert 的 warning/large/close/action 形态塞进 `bepMessage`。
- 禁止用自定义 SVG 或页面注入图标。

### 参数/API
```javascript
bepMessage('消息提示', 'info')
bepMessage('成功提示', 'success')
bepMessage('失败提示', 'error')
bepMessage('加载中', 'loading')
```

---

## bepAlert — 警告提示

**层级：** 模块

**Figma 真源：** `BeP Admin Kit Sketch V1.1.0 1 / node 704:28544` 中的 `警告提示 Alert`，组件路径 `5.FeedBack/2.Alert警告提示`。

**公开入口：** `bepAlert(title, desc, opts)`

### 样式属性
- 尺寸：
  - 普通形态 `variant:'normal'`：默认 `680x40`。
  - 大号形态 `variant:'large'`：默认宽 959；无操作链接高 82，有操作链接高 104。
- 颜色：
  - `info`：背景 `#E6F0F5`，描边 `#CCE2EB`，图标 `Fill/Tips`。
  - `success`：背景 `#EBF8EC`，描边 `#D8F1D8`，图标 `Fill/Success`。
  - `warning`：背景 `#FFF6EC`，描边 `#FFEDDA`，图标 `Fill/Abnormal`。
  - `error` / `danger`：背景 `#FFEEEE`，描边 `#FFDFDD`，图标 `Fill/Fail`。
- 字体：
  - 普通形态：正文 14px Regular，line-height 22，黑色 65%。
  - 大号形态：标题 16px Medium，line-height 24，黑色 85%；说明 14px Regular，line-height 22，黑色 65%。
  - 操作链接 14px Regular，line-height 22，主色。
- 圆角/描边/阴影：圆角 r=2，1px 内描边，无阴影。
- 间距/布局：
  - 图标 24px；普通形态 x=24、y=8；大号形态 x=24、y=20。
  - 文案区 x=64；普通形态 y=9；大号标题 y=16、说明 y=46。
  - 关闭图标 `Line/Close` 16px，x=`width-32`；普通 y=12，大号 y=20。

### 状态交互
- `info`：普通提示，承载一般说明。
- `success`：成功提示，承载成功结果或正向说明。
- `warning`：警告提示，承载风险、注意事项、影响范围。
- `error` / `danger`：出错提示，承载失败、异常或需要处理的错误。
- `closable:true`：默认显示右侧关闭图标；`closable:false` 隐藏。
- `actions`：仅大号形态使用，支持文本链接，如“查看详情”“立即处理”。
- hover/focus/active：Figma 真源未定义独立静态态；页面脚本不得自行补状态。

### 内容约束
- 普通形态只放一行提示文案，不放标题、说明段落或操作链接。
- 大号形态用于标题 + 说明；有操作时放在说明下方。
- 说明文字可换行，不能用全局提示 Message 近似。
- 删除确认、禁用确认、退出编辑确认等需要用户确认的提示，不属于 Alert，必须使用提醒弹窗（`bepAlertModal`）。

### 使用场景
- 适用：页面内容区的常驻提示、表单顶部提示、风险说明、操作前注意事项、可关闭说明条。
- 不适用：顶部自动消失轻提示（用 `bepMessage`）；删除/禁用/退出编辑确认（用 `bepAlertModal`）；表单字段级错误（用 `bepFormItem` error）。
- 常见组合：列表页筛选区下方的说明条、表单页顶部警告、详情页卡片内风险提示、错误说明与操作链接。
- 模板位置：通常位于内容 Card 内顶部，或局部模块标题下方。

### 禁止事项
- 禁止页面脚本自造 `makeAlert`、手写浅色提示框、手写关闭图标或状态图标。
- 禁止用 `bepMessage` 表达 Alert 的 warning/large/close/action 形态。
- 禁止用 `bepAlertModal` 表达页面内常驻说明。

### 参数/API
```javascript
bepAlert('这是一条警告提示的文案', null, { type:'warning', width:680 })

bepAlert('出错提示', '文字说明文字说明文字说明。', {
  type:'error',
  variant:'large',
  width:959,
  actions:[{ label:'查看详情' }, { label:'立即处理' }]
})
```

---

**冻结列模式（BEP_SHADOW_FREEZE_LEFT/RIGHT）：**
```javascript
// 当列总宽 > TABLE_W 时需要冻结列
leftFrozen.effects  = [BEP_SHADOW_FREEZE_LEFT];
rightFrozen.effects = [BEP_SHADOW_FREEZE_RIGHT];
```
