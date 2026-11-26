# Figma Scripter 规范

---

## 核心原则

**bep-components.js 已实现的，直接调用，禁止重写。**

页面脚本 = bep-components.js 全文 + 页面专有逻辑。
运行方式：粘贴 bep-components.js → 追加页面脚本 → 在 Figma Scripter 中运行。

## 分层边界

BeP 组件按 **原子组件 → 复合组件 → 模块 → 模板** 组织：

| 层级 | 示例 | 页面脚本是否可直接使用 |
|---|---|---|
| 原子组件 | `bepFrame`、`bepRect`、`bepText`、`bepTableText`、`bepIcon` | 仅限 `pageFrame`、页面级 Card、纯布局容器、页面特有图片占位 |
| 复合组件 | `bepButton`、`bepInput`、`bepTag`、`bepTableRow`、`bepDescriptions`、`bepModal`、`bepAlertModal`、`bepDrawer` | 可直接调用，不得重写 |
| 模块 | `bepHeader`、`bepHeaderTitle`、`bepFilterGrid`、`bepSidebarItem`、`bepSelectionBar`、`bepChartCard`、`bepDashboardTableCard`、`bepRankListCard` | 可直接调用，不得拆开手写 |
| 模板 | `page-templates.md` 中的列表页、详情页、表单页 | 页面生成必须先选模板再组装 |

页面脚本禁止直接调用 `figma.createFrame / createRectangle / createText / createNodeFromSvg` 等原生创建 API。发现缺组件时，先补 `scripts/bep-components.js` 和文档，再生成页面。

图标必须使用 BeP 图标（`bepIcon`）并引用 `BEP_ICONS` 已存在 key。页面脚本禁止手绘图标、禁止写自定义 SVG、禁止 `Object.assign(BEP_ICONS, {...})` 注入临时图标。引用不到图标时，先提出缺失图标和候选替代；确认后补进 `scripts/bep-components.js` 和 `references/icons.md`，再用于页面生成。

页面脚本也不得新增 `makeBtn`、`makeSidebarItem`、`makeTableCell`、`makeTag`、`makeStatCard` 等局部组件替身；这类结构如果可复用，应进入 `bep-components.js`，如果只是模板组合，应写入 `page-templates.md`。

## 组件文档完整性

新增或修改任何标准组件时，必须同步补齐文档，且文档至少包含：

| 项 | 内容 |
|---|---|
| 样式属性 | 尺寸、颜色、字体、圆角、描边、阴影、间距、布局 |
| 状态交互 | default、hover、active、focus、disabled、selected、error、loading、open/close、expanded/collapsed 等适用状态 |
| 内容约束 | 文字长度、截断/换行、空值、图标、数量限制、数据类型 |
| 使用场景 | 适用/不适用、组合关系、模板位置、禁止事项 |

未由 Figma 真源确认的状态，不得自行补数值。补充组件规范时发现需要 TODO 的内容，必须先列出缺口给用户确认；用户未补充前，该组件文档视为待补充，不得把 TODO 静默写入文档当作完成。

标准模板：

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

---

## 标准调用清单

| 需要 | 调用 | 禁止做法 |
|---|---|---|
| 页头（TopBar+TitleBar）| `bepHeader(title, crumbs, w)` | 自行拼矩形和文字 |
| 页头系统页签（TopBar+PageTabs）| `bepTopBar(w)` + `bepTabs(tabs, activeIdx, w)` | 把 `bepTabs` 当业务状态切换或与 `bepHeader` 混用 |
| 对象标题摘要 | `bepObjectTitle(opts)` | 手写图片+标题+状态+标签+副标题结构 |
| 页头标题型 | `bepHeaderTitle(opts)` | 手写详情标题摘要、操作按钮或标题型 Tabs |
| 图表容器 | `bepChartCard(opts)` | 手写图表卡片外框、标题分割线、图例、Tabs 或图表占位骨架 |
| 看板表格 | `bepDashboardTableCard(opts)` | 手写看板表格卡片、表头、单元格或用图表容器/内容卡片近似 |
| 排行榜 | `bepRankListCard(opts)` | 手写排名徽标、排行行、进度条或用图表容器/指标卡近似 |
| 按钮 | `bepButton(label, type, h, opts)` | 手写矩形+文字、手写图标按钮、手写 loading/disabled 按钮 |
| 按钮组 | `bepButtonGroup(actions, opts)` | 手写多个按钮的排列坐标来模拟按钮组 |
| 输入框 | `bepInput(placeholder, width, h, opts)` | 手写输入框矩形、占位文字、前后缀、清除/异常/提示图标 |
| 组合输入框 | `bepInputGroup(selectPlaceholder, inputPlaceholder, width, opts)` | 手写两个输入框拼接成组合输入框 |
| 输入框 | `bepInput(placeholder, w, h)` | 手写矩形+占位文字 |
| 选择器 | `bepSelect(placeholder, w, h, opts)` | 手写矩形+箭头 |
| 多选选择器 | `bepMultiSelect(placeholder, values, w, h, opts)` | 手写多选 Tag、关闭图标或箭头 |
| 下拉菜单 | `bepDropdown(options, w, opts)` | 手写下拉浮层、选项行、暂无数据 |
| 级联选择器 | `bepCascader(...)` / `bepCascaderPanel(...)` | 用普通选择器近似级联、手写级联列、右箭头、checkbox、选中勾 |
| 树形组件 | `bepTree(items, opts)` | 手写树节点、缩进、展开/折叠箭头、选中背景或 checkbox |
| 单日期 | `bepDate(placeholder, w, h, opts)` | 用输入框或日期区间近似单日期；手写日历图标或清除图标 |
| 日期区间 | `bepDateRange(w, h, opts)` | 手写日历图标+文字；用两个单日期近似日期区间 |
| 日期面板 | `bepDatePickerPanel(opts)` | 手写月历网格、星期行或选中日期块 |
| 日期区间面板 | `bepDateRangePanel(opts)` | 手写双月日历面板 |
| 时间选择器 | `bepTime(placeholder, w, h, opts)` | 用输入框、选择器或日期选择器近似时间选择器；手写时钟图标 |
| 时间区间 | `bepTimeRange(w, h, opts)` | 手写时钟图标+文字；用两个时间选择器近似时间区间 |
| 时间面板 | `bepTimePickerPanel(opts)` | 手写时/分/秒列、选中行或滚动条 |
| 时间区间面板 | `bepTimeRangePanel(opts)` | 手写双时间列、底部分割线或确认按钮 |
| 日期时间选择器 | `bepDateTime(placeholder, w, h, opts)` | 用输入框、单日期+时间选择器或手写图标文字近似日期时间选择器 |
| 日期时间区间 | `bepDateTimeRange(w, h, opts)` | 用两个日期时间选择器拼区间；手写图标、分隔符或清除图标 |
| 日期时间面板 | `bepDateTimePanel(opts)` | 手写月历网格、时间列、此刻或确认按钮 |
| 日期时间区间面板 | `bepDateTimeRangePanel(opts)` | 手写快捷范围、月历、时间列、分割线或确认按钮 |
| 数字输入框 | `bepInputNumber(val, w, h, opts)` | 手写步进器结构、手写上下箭头 |
| 组合数字输入框 | `bepInputNumberGroup(selectPlaceholder, val, w, opts)` | 手写选择器和数字输入框拼接 |
| 单选组 | `bepRadioGroup(options, activeVal, opts)` | 手写圆点、内点、按钮式单选或用按钮模拟单选组 |
| 多选组 | `bepCheckboxGroup(options, selected, opts)` | 手写勾选框、对勾图标或用本地图标模拟多选组 |
| 上传按钮 | `bepUploadBtn(label, h, opts)` | 用通用按钮、手写上传图标或旧 primary 上传按钮近似 |
| 点击上传 | `bepUploadClick(label, tip, opts)` | 手写上传按钮 + 提示文字坐标 |
| 上传条/文件列表 | `bepUploadFileRow(file, opts)` / `bepUploadFileList(files, opts)` | 手写文件条、附件图标、下载、删除或 loading |
| 拖拽上传 | `bepUploadDragger(opts)` | 手写虚线框、上传云图标、拖拽提示 |
| 图片上传 | `bepImageUpload(items, opts)` | 手写图片上传格、成功遮罩、放大、删除或失败态 |
| 开关 | `bepSwitch(isOn, on, off, opts)` | 手写轨道、圆点、内部文字或 loading 图形 |
| 评分 | `bepRate(value, opts)` | 手写星形、用线性星近似、页面内拼评分文字 |
| 标示 / 标签 | `bepTag(label, type, style)` | 手写圆角矩形+文字、状态点、关闭/添加图标 |
| 图标 | `bepIcon(name, size, color)` | 矩形/emoji 占位、自定义 SVG、注入 BEP_ICONS |
| 描述列表 | `bepDescriptions(sections, width)` | 手写 label/value 坐标 |
| 描述列表标签 value | `tags:[...]` 或 `bepDescTags(tags, opts)` | 手写 Tag 结构；已有 `bepTag` 必须复用 |
| 描述列表链接 value | `link:{...}` / `links:[...]` 或 `bepDescLinks(links, opts)` | 手写主色文字链接 |
| 描述列表附件 value | `attachments:[...]` 或 `bepDescAttachments(files, opts)` | 手写文件图标、文件名、大小 |
| 描述列表图片/视频 value | `media:[...]` 或 `bepDescMedia(items, opts)` | 手写缩略图、播放图标 |
| 步骤条 | `bepSteps(steps, currentIdx, width, opts)` | 手写步骤圆点、数字、对勾或连接线；用时间轴近似步骤进度 |
| 时间轴 | `bepTimeline(items, opts)` | 手写 `TimelineItem`、`LogRow`、圆点连线或操作记录局部结构 |
| 表格文字 | `bepTableText(val, color, maxW)` / `bepTruncText(val, color, maxW)` | bepText（会破坏列宽）|
| 表头行 | `bepTableHeader(cols, tableW, opts)` | 重写表头逻辑、手写底边或列竖线 |
| 高级表头行 | `bepAdvancedTableHeader(cols, tableW, opts)` | 手写筛选/排序表头图标或把表头浮层脱离列宽体系 |
| 多级表头 | `bepMultiLevelTableHeader(cols, tableW)` | 用两个普通表头粗略叠放；手写 rowSpan/colSpan 视觉近似 |
| 数据行 | `bepTableRow(cells, cols, tableW, bgColor, opts)` | 重写行逻辑、用 `bepText` 做单元格文字 |
| 树表格行 | `bepTreeRow(cells, cols, tableW, level, state)` | 手写缩进和图标 |
| 复杂树形 | `bepComplexTree(opts)` | 手写组织树卡片、标题栏、搜索框、加载态、标题下拉或节点更多图标 |
| 树形选择器 | `bepTreeSelect(...)` / `bepTreeSelectPanel(...)` | 用选择器或输入框加手写树浮层近似树节点选择 |
| 复杂树形选择面板 | `bepComplexTreePicker(opts)` | 手写树选择弹窗、左右分栏、详情列表、已选 Tag 区或底部按钮 |
| 表格多选框 | `bepTableCheckbox(checked, opts)` | 手写 checkbox、对勾或用表单多选组近似表格单元格 |
| 表格拖拽柄 | `bepTableDragHandle()` | 手写拖拽点阵或自定义 SVG |
| 表格展开面板 | `bepTableExpandPanel(tableW, items, opts)` | 把行展开内容做成独立 Card 或手写浅色详情块 |
| 表格快速新增行 | `bepQuickAddRow(tableW, opts)` | 把表格内新增入口做成工具栏按钮或手写虚线按钮 |
| 操作列 | `bepActionCell([{label,type}])` | 手写文字链接；操作列需自适应，文本不得换行/省略 |
| 空状态 | `bepEmptyState(tableW)` | 手写占位 |
| 分页器 | `bepPagination(total, current, pages, pageSize, opts)` | 重写分页逻辑、页码按钮、翻页图标、页大小选择器或跳页输入框 |
| 内容卡片 / 新增卡片 | `bepCard(opts)` / `bepAddCard(opts)` | 手写卡片、加号入口、底部操作区或操作分隔线 |
| 弹窗 | `bepModal(title, contentNode, opts)` | 手写遮罩和弹窗 |
| 提醒弹窗 / 对话框 POP | `bepAlertModal(title, message, opts)` | 手写确认弹窗、状态图标、关闭图标、阴影或底部按钮排列 |
| 抽屉 | `bepDrawer(title, contentNode, opts)` | 手写抽屉结构 |
| 全局提示 | `bepMessage(text, type)` | 手写 Toast、`makeMessage` 或把 Alert 样式塞进 Message |
| 警告提示 | `bepAlert(title, desc, opts)` | 手写 Alert、`makeAlert`、用 Message 或 AlertModal 近似页面内提示 |
| 表单项 | `bepFormItem(label, ctrl, opts)` | 手写标签和控件 |
| 侧边栏项 | `bepSidebarItem(label, level, state, iconKey)` | 重写侧边栏、手写三级菜单、`sidebarL3` 局部函数 |
| 面包屑 | `bepBreadcrumb(items)` | 手写文字和箭头 |
| 单行筛选 | `bepFilterRow(filters, addLabel, tableW)` | 重写筛选区 |
| 多条件筛选 | `bepFilterGrid(filters, tableW, collapsed)` | 重写筛选区 |

---

## 图标构建策略

Figma Scripter 对超大的 `BEP_ICONS` 对象解析不稳定，因此构建产物可以压缩图标库，但**禁止清空 `BEP_ICONS`**。

构建脚本必须执行以下策略：

1. 从组件库和页面源码中扫描 `bepIcon('...')`、`iconKey:'...'`、`iconSvg:'...'`、`icon:'...'`，以及所有形如 `'Line/...'` / `'Fill/...'` 的 BeP 图标 key 字符串，收集页面直接依赖的图标 key。
   - 标准组件参数也属于图标依赖，例如 `bepSidebarItem(label, level, state, iconKey)`、`bepCard({ iconKey })`。
   - 如果图标 key 先写入数据数组再传入标准组件，也必须被构建保留，例如 `['商品管理', 1, 'expanded', 'Line/box']`。
2. 保留标准组件的最小白名单图标，例如页头、下拉、分页、弹窗关闭、更多、附件、媒体、上传、消息提示等内部动态分支图标。
3. 用收集结果从完整 `BEP_ICONS` 中抽取最小图标对象，替换构建产物中的全量对象。
4. 构建时如果发现所需 key 不在完整 `BEP_ICONS` 中，必须输出 warning；页面生成前应先补齐图标库，不得静默清空、手绘替代或用空对象替代。
5. 静态校验必须检查源码引用图标与 dist 保留图标一致；源码引用的 key 如果存在于完整 `BEP_ICONS`，但构建产物没有保留，必须报错。

禁止事项：

- 禁止把 `var BEP_ICONS = {...}` 直接替换为 `var BEP_ICONS = {};`。
- 禁止因为 Figma Scripter 兼容性问题牺牲标准组件图标显示。
- 禁止页面用矩形、emoji、文字、自定义 SVG 或 `Object.assign(BEP_ICONS, {...})` 临时代替标准图标；缺图标应先提出并补入 BeP 图标库。

---

## 脚本文件模板

```javascript
// ── [模块名]-[页面名].js ─────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · [日期]
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件并运行
// ═══════════════════════════════════════════════════════════════

// ── 页面专有数据 ──────────────────────────────────────────────────
var CANVAS_W = 1440, CANVAS_H = 900;
var SIDE_W = 208, HDR_H = 96;
var OUTER_PAD = 16, CARD_PAD = 24;
var TABLE_W = CANVAS_W - SIDE_W - OUTER_PAD*2 - CARD_PAD*2;  // 1152

// ── 主函数 ────────────────────────────────────────────────────────
async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  // 1. 页面根容器
  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'页面标题', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  // 2. 侧边栏（如需业务特有图标，在此定义）
  // ...

  // 3. 页头
  var header = bepHeader('页面标题', ['模块', '当前页'], CANVAS_W - SIDE_W);
  header.x = SIDE_W; header.y = 0;
  pageFrame.appendChild(header);

  // 4. 内容卡片
  var card = bepFrame(CANVAS_W - SIDE_W - OUTER_PAD*2, 0, {name:'Card', clip:true});
  card.fills = bepSolid(BEP_C.white);
  card.cornerRadius = 4;
  card.x = SIDE_W + OUTER_PAD; card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  // 5. 页面内容...

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
```

---

## 禁止事项

1. **禁止重写任何已在 bep-components.js 中实现的组件**
2. **禁止用矩形/emoji/文字/自定义 SVG 代替图标，禁止页面注入 BEP_ICONS**
3. **禁止表格单元格用 bepText**（必须用 bepTableText / bepTruncText）
4. **禁止在 bepSidebarItem 之外另写侧边栏结构**；三级菜单也使用 `bepSidebarItem(label, 3, state)`
5. **禁止随意改变颜色值**（必须用 BEP_C 或 bepHex）
6. **禁止用 `figma.loadFontAsync` 加载 PingFang TC**（必须是 SC）
7. **不确定的规范不得编造**；补组件规范时遇到 TODO 必须先提出给用户确认
8. **禁止把多个 Tabs 内容堆叠在同一页面**，必须按 `activeTab` 分支渲染
9. **禁止手写动态记录时间轴**；操作记录、审核记录、库存流水、价格变更历史必须走时间轴（`bepTimeline`）
10. **禁止手写步骤条**；分步流程、阶段进度必须走步骤条（`bepSteps`），不得用时间轴近似

---

## 新增组件流程

如页面需要 bep-components.js 中没有的组件：
1. 告知用户"此组件库暂无，需要新增"
2. 确认样式规范（不编造数值）
3. 补进 bep-components.js
4. 同步更新 `SKILL.md` 速查表和相关 `references/*.md`
5. 再用于页面生成
