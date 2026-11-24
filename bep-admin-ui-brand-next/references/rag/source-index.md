# RAG 真源与样例索引

> 记录可检索参考的来源、用途和风险。此文件不定义新规范，只帮助快速找到应读取的正式文档或样例。

---

## 页头与导航

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 页头标题型 | `凤凰会后台 / node 1044:10445` | 对象标题摘要、右侧操作按钮、对象标题内置 Tabs | 不可拆成对象标题摘要 + 卡片内页签 | `components-layout.md` |
| 系统页签 / 页面页签 | `BeP Admin Kit Sketch V1.1.0 / node 0:1459` | TopBar + PageTabs 模式 | 不用于业务状态切换 | `components-layout.md` |
| 卡片内页签 | `BeP Admin Kit Sketch V1.1.0 / node 87:62879` | 卡片内局部内容切换 | 不用于整页主内容切换 | `components-layout.md` |
| 页头系统模式样例 | `pages/header/variants.js` | TopBar、BreadcrumbBar、TopBar+Breadcrumb、TopBar+PageTabs | 同一系统不得混用 Breadcrumb 与 PageTabs 打开机制 | `components-layout.md` |
| 页头标题型四种组合样例 | `pages/header/title-type.js` | 标题、标题+操作、标题+Tabs、标题+操作+Tabs | 只参考当前已校验样例 | `SKILL.md` 样例索引 |
| 侧边栏菜单项样例 | `pages/sidebar/variants.js` | 一级、二级、三级菜单层级和 active/expanded 状态 | 不得页面手写 `sidebarL3` 或自造菜单函数 | `components-layout.md` |

---

## 描述列表

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 描述列表 value 类型样例 | `pages/description-list/value-types.js` | 内容、标签、链接、附件、图片/视频 value | 不手写 value 子组件 | `components-layout.md` |
| 详情页分组关系 | BeP 规范沉淀 | 判断多个描述分组是否同卡片 | 不机械照搬编辑页锚点 | `SKILL.md` / `page-templates.md` |

---

## 时间轴

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 时间轴 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 / node 700:27656` | 基础样式、带描述样式、状态点、连接线、文字色阶 | 只沉淀为 `bepTimeline`；页面不得手写圆点连线 | `components-layout.md` |
| 时间轴样例 | `pages/timeline/variants.js` | 基础样式、带描述样式、状态与虚线组合 | 只参考当前已校验样例 | `components-layout.md` |

---

## 数据看板

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 数据看板图表结构 | `BeP Admin Kit Sketch V1.1.0 1 / node 87:62585` | KPI 摘要卡、图表容器组合、看板表格、排行榜、上下/左右/等分布局 | KPI 摘要沉淀为 `bepMetricCard`；完整图表区域沉淀为 `bepChartCard`；看板表格沉淀为 `bepDashboardTableCard`；列表型排行榜沉淀为 `bepRankListCard`；新闻列表暂搁置 | `page-templates.md` / `components-layout.md` |
| 数据看板图表布局 | `BeP Admin Kit Sketch V1.1.0 1 / node 87:64392` | 等分、不等分、多列看板组合、侧栏小指标、表格型看板模块、列表型排行模块 | `bepChartCard` 用于完整图表容器；表格型看板模块不得塞进图表容器；新闻列表当前不公开 | `page-templates.md` / `components-layout.md` |
| 数据看板卡片页 | `BeP Admin Kit Sketch V1.1.0 1 / node 87:67004` | 内容卡片 / 新增卡片 / 底部操作区 | 沉淀为 `bepCard` / `bepAddCard`；不并入 `bepMetricCard` | `components-layout.md` |
| 内容卡片样例 | `pages/card/variants.js` | 新增卡片、普通内容卡片、多色图标、2/3 操作底栏 | 只参考当前已校验样例 | `components-layout.md` |
| 指标数据卡片样例 | `pages/metric-card/variants.js` | 基础 KPI、图标 KPI、趋势 KPI、迷你图辅助 | 只参考当前已校验样例 | `components-layout.md` |

---

## 步骤条

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 步骤条 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 700:27657` | 基础横向、带描述横向、竖式步骤条、完成/当前/待处理状态 | 只沉淀为 `bepSteps`；不得手写步骤圆点、数字、对勾或连接线 | `components-layout.md` |
| 步骤条样例 | `pages/steps/variants.js` | 三种形态和当前步骤状态 | 只参考当前已校验样例 | `components-layout.md` |

---

## 基础录入组件

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 文本域 / 多行输入框 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:974` | 多行纯文本输入、字数统计、右下可拉伸图标 | 只沉淀为 `bepTextarea`；不得用拉高的 `bepInput` 或页面手写结构近似 | `components-core.md` |
| 文本域 / 多行输入框样例 | `pages/textarea/variants.js` | default/complete/hover/disabled/error 五种表现 | 只参考当前已校验样例 | `components-core.md` |
| 级联选择器 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 696:27650` | 单选/多选级联触发框、三列展开面板、层级箭头、勾选/半选状态 | 只沉淀为 `bepCascader` / `bepCascaderPanel`；不得用普通选择器或页面手写列面板近似 | `components-core.md` |
| 级联选择器样例 | `pages/cascader/variants.js` | default/complete/hover/selected/disabled、单选展开、多选展开 | 只参考当前已校验样例 | `components-core.md` |
| 树形组件 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 697:27653` | 基础树形、可选树形、展开/折叠、层级缩进、选中背景、checkbox 全选/半选/未选 | 只沉淀为 `bepTree`；不得用树表格行或页面手写树节点近似 | `components-core.md` |
| 树形组件样例 | `pages/tree/variants.js` | 基础树形、可选树形、选中行、半选/全选状态 | 只参考当前已校验样例 | `components-core.md` |
| 复杂树形 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:75` | 组织树卡片、标题栏、搜索、加载中、标题下拉、节点更多操作 | 第一批沉淀为 `bepComplexTree`；大型选择弹窗和树形选择器下拉后续分批补充 | `components-layout.md` |
| 复杂树形样例 | `pages/tree-complex/variants.js` | 组织树、加载态、标题下拉、节点更多操作 | 只参考当前已校验样例；不得页面手写复杂树容器 | `components-layout.md` |
| 树形选择器 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:75` | 选择器触发框 + 树形下拉浮层 | 第二批沉淀为 `bepTreeSelect` / `bepTreeSelectPanel`；大型选择弹窗后续分批补充 | `components-core.md` |
| 树形选择器样例 | `pages/tree-select/variants.js` | default/complete/selected、单选树浮层、多选树浮层 | 只参考当前已校验样例；不得用 Select + 手写 Tree 浮层近似 | `components-core.md` |
| 复杂树形选择面板 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:75` | 弹窗/浮层内树选择、标题搜索关闭、左右分栏、详情列表、已选区、底部按钮 | 第三批沉淀为 `bepComplexTreePicker`；仍必须复用树形组件、按钮和选择 Tag | `components-layout.md` |
| 复杂树形选择面板样例 | `pages/tree-complex-picker/variants.js` | 大型明细选择、普通左右分栏选择、小型可选树面板 | 只参考当前已校验样例；不得页面手写复杂选择面板 | `components-layout.md` |
| 标示 / 标签 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 697:27652` | 底色标示、边框标示、点标示、动态标签、添加标签 | 只沉淀为 `bepTag`；不得手写圆角矩形、状态点、关闭/添加图标 | `components-core.md` |
| 标示 / 标签样例 | `pages/tag/variants.js` | `solid/outline/dot/closable/add` 五种形态和状态色 | 只参考当前已校验样例 | `components-core.md` |
| 日期选择器 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:674` | 单日期、日期区间、日期面板和日期区间面板 | 页面不得手写日历格或双月面板 | `components-core.md` |
| 日期选择器样例 | `pages/date/variants.js` | 单日期、日期区间、展开面板、default/hover/complete/disabled 状态 | 只参考当前已校验样例；业务页面默认不静态绘制 hover | `components-core.md` |
| 时间选择器 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 696:27649` | 单时间、时间区间、时/分/秒列和确认区 | 页面不得手写时间列或确认按钮 | `components-core.md` |
| 时间选择器样例 | `pages/time/variants.js` | 单时间、时间区间、时/分/秒面板、确认区 | 只参考当前已校验样例；不得用普通输入框近似时间选择 | `components-core.md` |
| 日期时间选择器 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:689` | 单日期时间、日期时间区间、复合展开面板、快捷范围 | 只能沉淀为 `bepDateTime*`；不得用输入框、日期、时间组件临时拼接近似 | `components-core.md` |
| 日期时间选择器样例 | `pages/date-time/variants.js` | 单日期时间、日期时间区间、月历 + 时间列复合面板 | 只参考当前已校验样例；不得用日期选择器和时间选择器页面拼接近似 | `components-core.md` |
| 单选组 / 多选组 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 695:27648` | 单选基础样式、单选按钮样式、多选基础样式、default/hover/selected/disabled | 只沉淀为 `bepRadioGroup` / `bepCheckboxGroup`；不得页面手写圆点、勾选框或按钮式单选 | `components-core.md` |
| 上传 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:825` | 点击上传、上传条、拖拽上传、图片上传、上传中/hover/成功/失败状态 | 只沉淀为 `bepUpload*`；不得页面手写上传按钮、文件条、虚线框、图片上传格或操作图标 | `components-core.md` |
| 开关 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:710` | 大/中/小、开/关、禁用、加载、带文字 | 只沉淀为 `bepSwitch`；不得手写轨道、圆点或 loading 图形 | `components-core.md` |
| 评分 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:710` | 5 星、选中/未选中、右侧评价文字 | 只沉淀为 `bepRate`；不得手写星形或用线性星近似 | `components-core.md` |

---

## 表格

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 标准表格 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:988` | 基础表格、迷你表格、表头、数据行、已选操作栏 | 只沉淀为 `bepTableHeader` / `bepTableRow` / `bepActionCell` / `bepEmptyState`；不得手写表格结构 | `components-layout.md` |
| 标准表格样例 | `pages/table/variants.js` | 默认表格、迷你表格、空状态、操作列宽度计算 | 只参考当前已校验样例 | `components-layout.md` |
| 树状表格 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:353` | 多层级展开、根节点、二级/三级子行、缩进、展开/折叠图标、子级背景 | 只沉淀为 `bepTreeRow`；不得手写箭头、缩进或子级底色 | `components-layout.md` |
| 树状表格样例 | `pages/tree-table/variants.js` | 展开、折叠、叶子节点、操作列组合 | 只参考当前已校验样例 | `components-layout.md` |
| 高级表格 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 0:89` | 带表头功能、可设置、可拖拽、内联操作、折叠面板、快速新增、多级表头 | 必须沉淀为高级表格公开入口；不得用普通表格自由拼装 | `advanced-table-rules.md` |
| 其他高级表格样例 | `pages/advanced-table/variants.js` | 高级表头、多级表头、展开面板、快速新增、表格多选框、拖拽柄 | 只参考当前已校验样例；列宽仍必须按业务数据重新审计 | `advanced-table-rules.md` |
| 分页器 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 1390:26247` | 总数、页码、每页条数选择、跳页、翻页禁用态 | 只沉淀为 `bepPagination`；不得手写分页按钮、翻页图标、下拉选择或跳页输入 | `components-layout.md` |
| 分页器样例 | `pages/pagination/variants.js` | 完整分页、无跳页、仅页码三种形态 | 只参考当前已校验样例 | `components-layout.md` |
| 标准列表页样例 | `pages/hr/list.js` | 列表页基本表格、筛选、分页 | 只参考已校验版 | `SKILL.md` 样例索引 |
| 高级表格规则 | `advanced-table-rules.md` | 筛选表头、列设置、拖拽、树层级、多级表头 | 不用普通表格近似 | `advanced-table-rules.md` |
| 历史商品列表 | `pages/physical-product/*` | 商品字段和业务组织 | 历史样例可能含旧布局，不可照抄代码 | `SKILL.md` 待同步历史样例 |

---

## 表单、弹窗、抽屉

| 参考对象 | 来源 | 适合参考 | 风险提示 | 正式规则位置 |
|---|---|---|---|---|
| 全局提示 Message Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 704:28544 / 全局提示 Message` | 短提示、成功、失败、加载中浮动反馈 | 同节点还包含 Alert；Message 不承载 warning 块状提示、关闭按钮或操作链接 | `components-layout.md` |
| 全局提示 Message 样例 | `pages/message/variants.js` | `info / success / error / loading` 四种短提示 | 只参考当前已校验样例 | `components-layout.md` |
| 警告提示 Alert Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 704:28544 / 警告提示 Alert` | 普通/成功/警告/出错、普通 40px 和大号说明提示 | 只沉淀为 `bepAlert`；不得用 `bepMessage` 或 `bepAlertModal` 近似 | `components-layout.md` |
| 警告提示 Alert 样例 | `pages/alert/variants.js` | 普通形态、大号形态、关闭图标、操作链接 | 只参考当前已校验样例 | `components-layout.md` |
| 表单页/校验状态样例 | `pages/form-demo/form-demo.js` | 表单项、必填、错误状态 | 表单字段标题强制 8 个汉字 + 星号宽度 | `form-rules.md` |
| 销售合同抽屉历史样例 | `pages/sales-contract/drawer-*.js` | 业务字段组织和抽屉内容密度 | 旧样例不可作为代码模板 | `page-layouts.md` |
| 表单/详情弹窗 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 705:28547` | 420/640/800 弹窗框架、标题栏、内容边距、底部按钮区 | 内容由表单或描述列表组成；详情默认无底部按钮 | `components-layout.md` |
| 表单/详情弹窗样例 | `pages/modal/variants.js` | 800/640 表单弹窗、420 详情弹窗 | 只参考当前已校验样例 | `components-layout.md` |
| 弹窗规则 | `components-layout.md` | 420/640/800 宽度选择 | 不手写遮罩和底部按钮；内容不得重复包 24px padding | `components-layout.md` |
| 表单/详情抽屉 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 705:28548` | 420/640/800 抽屉框架、右侧滑入、标题栏、内容边距、底部固定按钮区 | 长内容表现为内容区滚动；详情默认无底部按钮 | `components-layout.md` |
| 表单/详情抽屉样例 | `pages/drawer/variants.js` | 800/640 表单抽屉、420 详情抽屉 | 只参考当前已校验样例 | `components-layout.md` |
| 提醒弹窗 Figma 真源 | `BeP Admin Kit Sketch V1.1.0 1 / node 704:28546` | 删除确认、禁用确认、退出编辑、普通提示 | 只沉淀为 `bepAlertModal`；不得用通用弹窗标题栏或手绘状态图标近似 | `components-layout.md` |
| 提醒弹窗样例 | `pages/alert-modal/variants.js` | danger/warning/info/单按钮四种提醒弹窗 | 只参考当前已校验样例 | `components-layout.md` |
