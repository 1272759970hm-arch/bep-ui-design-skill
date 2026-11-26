# 页面模板目录（Figma 实测）

> 本文件负责模板的**落地结构**：使用哪些组件、布局顺序、间距、列宽、注意事项。
> **判断页面属于哪一类、该有哪些模块与顺序**，见 `page-type-rules.md`——先判类型，再来这里选模板。

---

## 一、按任务选模板（两级判断）

不要用「关键词 → 模板」直接跳。先判断**用户任务**，再判断**页面类型**，最后选模板：

| 用户任务 | 页面类型 | 模板 | 常见坑（不要这么做） |
|---|---|---|---|
| 在大量记录里定位并批量处理 | 列表页 | ① 基础表格 / ② 三列筛选 / ③ 页签表格 | 条件 ≥6 仍用 ①（筛选区溢出）；同内容多视图却去新建页面 |
| 已知线索精确找到目标 | 搜索 / 查询结果页 | ① + 结果分组 | 堆重筛选；结果不区分对象与单据，无上下文 |
| 核对一条记录的完整信息 | 详情页 | ③b 详情页（卡片内页签） | 照搬编辑页锚点分区；动态记录塞进描述列表 |
| 录入 / 修改一条记录并提交 | 表单页 | ⑤ 基础表单 | 字段 >20 仍用单页（应拆步骤）；复杂表单塞进弹窗 |
| 完成复杂多步录入 | 多步骤流程 | ⑥ 分步表单 | 拆步后没有自由跳转与前置校验；确认页写死回显 |
| 观察趋势与对比 | 数据看板 | ⑩ 数据看板 | 用指标卡代替图表；指标无口径说明 |
| 定义规则与字典 | 配置页 | ④ 树表格 / ④b 高级表格 / ⑤ | 把配置页做成业务列表（出现批量删除这类业务动作） |
| 判断并做出审批决定 | 审批页 | ③b 详情页 + 审批动作区 | 只有详情没有动作区；不显示流转去向 |
| 维护发布内容 | 内容管理页 | ① 基础表格 + ⑤ 基础表单 | 缺草稿 / 发布 / 下线状态；不可撤回 |
| 局部处理且不离开上下文 | 弹窗 / 抽屉 | ⑦ 弹窗 / ⑧ 抽屉 | 弹窗承载多步流程；弹层层级超过 2 层 |
| 掌握整体状态并进入下一步 | 工作台 / 首页 | ⑩（指标）+ ①（待办） | 做成图表墙，首屏没有行动入口 |
| 说明无数据 / 异常 | 空状态 / 异常状态 | `bepEmptyState` + `bepAlert` | 只做成功态 |
| 展示对象集合入口 | 卡片列表页 | 卡片列表页（⑧ 同名模板） | 用卡片列表承载需要批量处理的数据 |

**硬约束**：同一页面只允许一个主类型；类型判断不清时先回 `page-type-rules.md`，不要靠模板凑结构。

---

## 二、模板清单

> 下文每个模板说明：组件组合、布局结构、间距与列宽规则。
> 编号沿用历史顺序（③b / ④b 为插入项），不代表优先级。

---

## 1. 表格列表页（基础表格）

**适用场景：** 带筛选、操作按钮、表格、分页的标准数据列表页

**组件组合：**
```
pageFrame (1440×900)
├── Sidebar         bepSidebarLogo + bepSidebarItem × N
├── Header          bepHeader(title, crumbs, 1232)
└── Card (white, r=4, no shadow)
    ├── FilterGrid  bepFilterGrid(filters, 1152, false)   ← 多条件筛选
    │   或 FilterRow bepFilterRow(filters, '+新增', 1152)  ← ≤2条件+操作按钮
    ├── Toolbar     bepButton × N（右对齐）
    ├── TableHeader bepTableHeader(cols, 1152)
    ├── DataRow ×N  bepTableRow(cells, cols, 1152)
    └── Pagination  bepPagination('共N条', page, pages, '10条/页')
```

**间距规则：**
- 筛选区 → 工具栏：24px
- 工具栏 → 表格：16px
- 表格末行 → 分页器：16px

**列宽规则：** 见 page-layouts.md §列宽规则

---

## 2. 表格列表页（筛选三列-展开/收起）

**适用场景：** 条件 ≥ 6 个，需要展开/收起的筛选区

**与基础表格的区别：**
- 使用 `bepFilterGrid(filters, 1152, false)` 展开态
- 使用 `bepFilterGrid(filters, 1152, true)` 折叠态（只显示5条，按钮在第2行末）
- 表格带水平滚动 → 冻结操作列：`rightFrozen.effects = [BEP_SHADOW_FREEZE_RIGHT]`

---

## 3. 表格列表页（页签）

**适用场景：** 同一内容区有多个 Tab 视图

**与基础表格的区别：**
- TitleBar 替换为 `bepTabs(tabs, activeIdx, 1232)`
- Header 总高仍为 96px（TopBar 48 + Tabs 48）
- 内容卡片 y 坐标不变（111px）

---

## 3b. 详情页（卡片内页签）

**适用场景：** 详情内容在同一页面 Card 内通过 Tab 切换。

**组件组合：**
```
pageFrame (1440×900)
├── Sidebar
├── Header          bepHeader(title, crumbs, 1232)
├── HeaderTitle     bepHeaderTitle(...)（可选，详情对象摘要）
└── Card (white, r=4, no shadow)
    ├── CardTabs    bepCardTabs(tabs, activeIdx, CARD_W)
    └── Content     bepDescriptions / 表格 / 表单内容
```

**注意：**
- `bepTabs` 是页头页签，只能替代 TitleBar。
- Card 内页签必须使用 `bepCardTabs`。
- `bepCardTabs` 自带 24px 左右内缩；调用时 `tabs.x = 0; tabs.y = 0`，不要再传 `CONTENT_W` 或额外加 `CARD_PAD`。
- Card 内页签必须贴卡片顶部；Tabs 上方不要放返回、摘要、当前系统等额外区块。
- Header 已包含面包屑；不要再在 Card 内放“返回上一页”文字链接，除非用户明确要求保留双入口。
- 商品、门店、人员、合同等对象详情如需要摘要标题区，使用 `bepHeaderTitle` 放在 `bepHeader` 下方、内容 Card 上方；操作按钮和标题型 Tabs 按需求显示/隐藏。此处 Tabs 属于页头标题型内部，不使用 `bepTabs` 或 `bepCardTabs`。
- 存在 `bepHeaderTitle` 时，内容 Card 的 y 坐标应按 `bepHeaderTitle.y + bepHeaderTitle.height + OUTER_PAD` 推导，不得固定写死为 `HDR_H + OUTER_PAD`。
- 详情页字段以查看语义组织，不机械保留编辑页锚点结构。编辑页中的 A/B/C 分区、折叠锚点、提示块、校验文案只作为数据来源参考；如果目标是详情页，应合并到用户查看时合理的描述分组中。
- 详情页存在多个描述分组时，必须先判断分组之间的业务亲近关系，再决定 Card 关系。相近分组放入同一个页面级 Card 内，使用一个 `bepDescriptions` 的多个 `sections` 表达；亲近关系弱的分组拆成独立页面级 Card。
- 分组亲近关系判断：同一业务对象、同一生命周期阶段、同一查看任务、需要连续扫读对比的信息，属于相近；不同业务对象、不同生命周期阶段、不同操作语义、明细/日志/附件等独立查看任务，属于较远。
- 不得因为原型编辑页存在多个锚点分区就机械生成多个 Card；也不得把弱相关信息强行塞进同一个描述列表。Card 是页面层的信息关系，`bepDescriptions` 的 section 是同一卡片内的近关系分组。
- 业务 Tabs 必须按 `activeTab` 分支渲染，页面只显示当前激活页签内容；不得把全部页签内容顺序堆在同一个页面里。
- `商品信息 / 操作记录` 这类对象级 Tabs 中，商品信息页签只展示静态详情、配置、明细；操作记录页签单独展示动态记录。
- 操作记录、审核记录、库存流水、价格变更历史等动态记录必须使用时间轴（`bepTimeline`）标准组件，不得手写 `TimelineItem`、`LogRow`、圆点连线等近似结构。
- 字段只能来自目标原型或用户明确补充。不得把 hint、规则说明、校验说明、接口异常演示、操作引导包装为描述列表字段。
- 如果同一原型同时存在编辑页和查看页，生成详情页时优先使用查看页结构；编辑页只补充查看页缺失但用户明确要求展示的字段。
- 详情页内容高度必须由 `cy` 或内容节点实际高度反推，生成末尾必须执行 `pageFrame.resize(CANVAS_W, Math.max(CANVAS_H, card.y + card.height + OUTER_PAD))`，不得因 `pageFrame.clip=true` 裁掉底部内容。
- 详情页中的 SKU 明细、日志明细等普通表格默认不是横向滚动表格，表格最终宽度必须填满 `CONTENT_W`；如果列自然宽度小于 `CONTENT_W`，必须把剩余宽度分配给 `grow:true` 的弹性列。

---

## 4. 树表格页

**适用场景：** 左侧树导航 + 右侧数据表格

**布局结构：**
```
pageFrame
├── Sidebar
├── Header（TitleBar 右侧可放操作按钮：opts.rightActions）
└── Card (1200px wide, no shadow)
    ├── 左面板 (w=187)：树形导航 + 标题
    ├── 分隔线 (x=411, w=1, rgba(0,0,0,0.06))
    └── 右面板 (x=440, w=960)
        ├── FilterRow   bepFilterRow(...)
        ├── SelectionBar（勾选行后显示）bepSelectionBar(count, actions, 964)
        ├── TableHeader
        ├── DataRows（含 checkbox 列）
        └── Pagination
```

**注意：** TitleBar 右侧操作按钮用 `bepTitleBar(title, crumbs, w, {rightActions:[...]})`

**不要混淆：** 此模板是“左侧树导航 + 右侧普通表格”。如果表格本身是权限点、菜单、组织等多层级数据，应使用 `references/advanced-table-rules.md` 的“多层级展开表格”，不是本模板。

---

## 4b. 高级表格页

**适用场景：** 表格本身具备表头筛选、列设置、拖拽排序、内联操作、树状层级、折叠详情、快速新增、多级表头等高级能力。

**组件组合：**
```
pageFrame (1440×900)
├── Sidebar
├── Header
└── Card (white, r=4, no shadow)
    ├── CardTabs（详情页可选）bepCardTabs(...)
    ├── FilterRow/Grid（按页面需求）
    └── AdvancedTable（按 advanced-table-rules.md 选型）
```

**注意：**
- 权限管理、菜单树、资源树优先选“多层级展开表格”。
- 多级表头不能用两个普通表头叠放。
- 快速新增行属于表格内部，不应另做 Card。
- 展开详情面板属于表格内部，不应另做 Card。

---

## 5. 表单页（基础表单）

**适用场景：** 新增/编辑表单，单页直接提交

**布局结构：**
```
pageFrame
├── Sidebar
├── Header
└── Card (white, r=4, no shadow)
    ├── 信息展示区（只读）：分组标题 + label:value 网格展示
    ├── 表单区：
    │   ├── 分组标题（16px Medium，无装饰线、无背景）
    │   ├── bepFormItem × N（labelW=90/112，2列时并排）
    │   ├── bepRadioGroup（单选）
    │   ├── bepCheckboxGroup（多选，可含"全选"）
    │   ├── bepSwitch（开关）
    │   ├── bepUploadBtn（文件上传）
    │   └── Textarea（多行输入，带字数限制）
    └── 底部按钮（居中）：返回 secondary + 提交 primary
```

---

## 6. 分步表单页

**适用场景：** 多步骤表单（如注册、申请流程）

**布局结构：**
```
pageFrame
├── Sidebar
├── Header
└── Card (white, r=4, no shadow)
    ├── bepSteps(steps, currentIdx, 1152)   ← 步骤条（y=CARD_PAD）
    ├── 分隔线
    ├── 当前步骤表单内容（2列布局）
    ├── bepMessage('提示', 'success')        ← 可选，浮于顶部
    └── 底部按钮：退出 secondary + 上一步 secondary + 下一步/完成 primary
```

**步骤条状态：** `currentIdx` 指定当前步骤（0-based），之前为已完成（✓），之后为待处理

---

## 7. 弹窗（Modal）

**适用场景：** 表单弹窗、详情弹窗、复杂信息弹窗；删除/禁用/退出编辑等轻量确认使用提醒弹窗（`bepAlertModal`）

| 规格 | 宽度 | 适用 |
|---|---|---|
| 小 | 420px | 短表单、详情查看 |
| 中 | 640px（默认）| 普通表单（1列）|
| 大 | 800px | 复杂表单（2列）、最高610px |

**垂直位置：** 高度 ≤630px 居中；>630px 距顶15%（135px）

**内容边距：** 弹窗框架内置上下左右 24px；传入内容宽度 = 弹窗宽度 - 48，不得重复包 padding。

**底部按钮：** 表单弹窗默认显示底部操作区；详情弹窗默认不显示底部按钮，只保留右上关闭。

```javascript
var modal = bepModal('标题', formContent, { width:640, variant:'form' })
var detail = bepModal('标题', descContent, { width:420, variant:'detail' })
// 挂在 pageFrame 上（覆盖整个画布）
```

**提醒弹窗 / 对话框 POP：** 删除、禁用、退出编辑、普通提示等轻量确认使用 `bepAlertModal`，不使用通用弹窗标题栏结构。

```javascript
var pop = bepAlertModal('删除数据', '删除后数据将不可恢复，是否删除？', {
  type:'danger',
  confirmLabel:'删 除'
})
// 挂在 pageFrame 上（覆盖整个画布）
```

---

## 8. 抽屉（Drawer）

**适用场景：** 新增/编辑表单、右侧查看详情、复杂对象的局部处理流程。抽屉从右侧滑入，保留当前页面上下文。

| 规格 | 宽度 | 适用 |
|---|---|---|
| 小 | 420px | 轻量表单、短详情 |
| 中 | 640px（默认）| 新增/编辑表单 |
| 大 | 800px | 详情查看、复杂内容 |

**高度：** 固定等于当前窗口高度；长内容表现为内容区滚动，不拉高抽屉。

**内容边距：** 抽屉框架内置上下左右 24px；传入内容宽度 = 抽屉宽度 - 48，不得重复包 padding。

**底部按钮：** 表单抽屉默认显示底部操作区；详情抽屉默认不显示底部按钮，只保留右上关闭。

```javascript
var drawer = bepDrawer('新增商品', formContent, { width:640, variant:'form' })
var detailDrawer = bepDrawer('商品详情', descContent, { width:800, variant:'detail' })
// 挂在 pageFrame 上（覆盖整个画布）
```

---

## 8. 卡片列表页

**适用场景：** 内容以卡片形式展示，如应用列表、模块列表

**布局结构（4列 grid）：**
```
pageFrame
├── Sidebar
├── Header
└── 内容区（无白色卡片包裹，直接平铺卡片）
    ├── bepCard(opts) × N（w=288, h=255，gap=16px）
    └── 空状态卡片：+ 号 + "新增XX"（居中）
```

**卡片列宽：** 4列 × 288px + 3间距 × 16px = 1200px = 卡片区宽 ✓

---

## 9. 个人信息页

**适用场景：** 用户个人资料、账号设置

**布局结构：**
```
pageFrame
├── Sidebar
├── Header
└── Card（分左右栏）
    ├── 左侧二级导航（~200px）：文字链接，活动项主色文字
    ├── 分隔线（1px）
    └── 右侧内容（表单 + 头像）
        ├── 表单区：分组标题 + bepFormItem
        ├── 头像区（右侧浮动）：圆形占位 + "修改头像"链接
        ├── bepMessage('修改成功', 'success')（可选，操作后显示）
        └── 底部按钮：返 回 + 保 存
```

---

## 10. 数据看板页

**适用场景：** 数据统计、图表展示

**布局特点：**
- 内容区无统一大白色 Card，由多个指标数据卡片、图表容器和业务模块平铺构成
- 图表区必须使用图表容器（`bepChartCard`）统一标题、图例、Tabs、分割线和图表骨架；真实图表数据可由业务图表库填充
- 数字摘要卡：使用指标数据卡片（`bepMetricCard`）展示 KPI 指标
- 此类页面高度通常超出 900px，pageFrame 需纵向延伸

**组件：**
- KPI 摘要、侧栏小指标：使用指标数据卡片（`bepMetricCard`）。
- 完整折线图、柱状图、饼图、雷达图、词云、仪表盘：使用图表容器（`bepChartCard`），不属于 `bepMetricCard`。
- 看板表格：使用看板表格（`bepDashboardTableCard`），内部复用标准表格，不属于 `bepChartCard`。
- 列表型排行榜：使用排行榜（`bepRankListCard`）；横向柱状对比图仍使用 `bepChartCard({type:'horizontal-bar'})`。
- 新闻列表：当前 BeP 未公开标准模块，暂不沉淀；需要时先补真源和组件规范，不得用指标数据卡片近似。

---

## 11. 登录页

**适用场景：** 系统登录入口（账号登录 / 手机号登录 / 验证模式）

**布局特点：**
- **无侧边栏、无标准 Header**
- 左半侧：全屏背景图（蓝色渐变 + 3D 插图）
- 右半侧：白色登录卡片（含 Logo、Tab 切换登录方式、表单、按钮）
- 此页面属于独立页面模板，不共用 sidebar/header 布局

---

## 快速索引

| 页面类型 | 模板 |
|---|---|
| 列表页 | ①②③ |
| 搜索 / 查询结果页 | ①（+ 结果分组） |
| 详情页 / 审批页 | ③b |
| 表单页 | ⑤ |
| 多步骤流程 | ⑥ |
| 配置页 | ④ / ④b / ⑤ |
| 内容管理页 | ① + ⑤ |
| 工作台 / 首页 | ⑩ + ① |
| 数据看板 | ⑩ |
| 卡片列表页 | 卡片列表页模板 |
| 弹窗 / 抽屉 | ⑦ / ⑧ 抽屉 |
| 个人信息页 | ⑨ |
| 登录页 | ⑪ |

> 选型判据与常见坑见本文件 §一；结构骨架与必答问题见 `page-type-rules.md`。
