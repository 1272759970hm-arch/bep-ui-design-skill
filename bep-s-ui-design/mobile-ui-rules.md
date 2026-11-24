# BEP-S 移动端 UI 基础规范

> 逐项标注来源和可信度。`FOUND_IN_FIGMA` 的数值必须照用；`NOT_DEFINED` 的绝不能自己拍一个数字冒充规范——如果实现层非要一个数值不可，可以给一个明确标注"非 BEP-S 定义、行业通用参考"的备选，但要在输出里向用户挑明这不是库里的规范值。**通用 UI 经验永远不能覆盖这里记录的 Figma 实际数据。**

## 页面尺寸 / 安全区域

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 设计基准尺寸 | 375 × 812px | FOUND_IN_FIGMA | 间距规范画板 |
| 页面左右边距 | 16px | FOUND_IN_FIGMA | 间距规范画板 |
| 底部安全区（iPhoneX及以后） | 34px | FOUND_IN_FIGMA | 间距规范画板 |
| 状态栏高度 | 44px | FOUND_IN_FIGMA | 间距规范画板 |

> ⚠️ **CSS 实现提醒（两次真实测试踩过的坑，不是设计规范，是工程写法提醒）**：`spacing.safeArea.bottom`(34px) 这个 Token 只应该在一处生效，且必须是**额外增加**的空间，不能塞进一个已经写死高度的容器里：
> 1. 「报修申请」页测试时，把它同时用在了"内容区底部间距"和"提交按钮容器底部间距"两处，语义重复，页面凭空多撑了一截，后来改成只在最外层容器用一次。
> 2. 「履约工作台」页测试时，底部 Tab 栏容器写了 `height: 56px`（`border-box`），又把 34px 安全区当 `padding-bottom` 塞进同一个盒子，内容区实际可用高度只剩 56-34=22px，图标被 flex 压缩到 0 高度直接消失。改成 `min-height: 56px` 之后安全区才是内容区之外额外加的空间。
>
> 结论：容器涉及固定高度 + 安全区 padding 组合时，优先用 `min-height` 不用 `height`，或者把安全区放在这个容器的**外面**（比如作为 margin 或者外层 wrapper 的 padding），生成页面后务必用浏览器实测量一下关键图标/按钮的 `getBoundingClientRect()`，不能只看代码就认为一定对。
>
> ⚠️ **CSS 实现提醒（第三次踩坑）**：底部 TabBar 容器本身必须显式设 `position: sticky; bottom: 0;`（配合 `z-index` 保证盖在内容之上），不能让它只是 flex 列里排在 `.content` 后面的一个普通元素——那样只有页面内容不满一屏时它才会贴着屏幕底部，一旦内容比屏幕高（几乎所有真实页面都会发生），它就只是跟着正常文档流走，滚到最底才出现，紧贴上一块内容，完全不是"随时吸底"的效果。这条规范本身没有明确写在 BEP-S 画板里（没有 Figma 数值可读，是通用移动端惯例），容易被漏掉，必须每次生成带 TabBar 的页面时都显式加上，不能假设"反正是 TabBar 组件默认就会吸底"。同时注意：如果外层用了类似 `body{display:flex;justify-content:center}` 的方式模拟手机画布居中显示（本地浏览器预览常见做法），TabBar 不能用 `position:fixed`（那是相对浏览器视口定位，会撑满整个浏览器宽度而不是贴着画布宽度），要用 `position:sticky` 相对页面容器自身定位。

## 导航栏 / 底部 Tab

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 顶部导航栏高度 | 44px（+状态栏44px，共88px） | FOUND_IN_FIGMA | 间距规范画板 |
| 底部导航(TabBar)高度 | **50px**（iPhone 678）／**84px**（iPhone X 及之后，含34安全区） | FOUND_IN_FIGMA（2026-11修正） | 底部导航画板组件实体 375×50/84；间距画板注释写 56 属旧值，已按组件实现更正 |
| 页内分段 Tab 高度 | 一级 42px / 独立胶囊 38px / 二级胶囊 32px | FOUND_IN_FIGMA（2026-11补齐） | 标签栏画板；字号为 一级16px / 独立胶囊16px / 二级胶囊14px（旧记录 18/16 作废） |

## 内容区域 / 间距

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 常用模块间距 | 12px | FOUND_IN_FIGMA | 间距规范画板 |
| 内容区与顶部间距 | **12px** | FOUND_IN_FIGMA（2026-11补齐） | 间距规范画板 |

## 字体

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 字号 | 14 / 15 / 16 / 18 / 20 / 22 / 24px | FOUND_IN_FIGMA | 字体排版画板 |
| 关怀版(适老化)放大字号 | 20/22/24/26/30/32/36px | FOUND_IN_FIGMA | 字体排版画板；与基础字号的逐一对应关系 NOT_DEFINED，需在 Figma 内核实 |
| 字重 | Regular、Medium | FOUND_IN_FIGMA | 字体排版画板 |
| 行高 | 字号 × **1.4** | FOUND_IN_FIGMA（2026-11修正） | 画板图层 lineHeight 实值 140%（18→25.2、24→33.6）；注释文字"1.5倍"属标注遗留 |
| 中文字体 | 思源黑体 Source Han Sans | FOUND_IN_FIGMA | 字体排版画板原文明确标注 |

> ⚠️ **CSS 实现提醒（第四次踩坑）**：`行高 = 字号 × 1.5` 这条最容易在写 CSS 时被漏掉——「履约工作台」页测试时，只有一个大字号数字组件单独设了 `line-height`，其余正文文字全部没设，沦为浏览器默认的 `line-height: normal`（明显比1.5紧，用 Noto Sans SC/PingFang SC 实测大概是1.15~1.2倍），导致列表/Cell这类紧凑排布的区域看起来"矮"、不透气。最简单的做法是在 `body` 上统一设 `line-height: 1.5`，让它默认往下继承，只在个别确实需要更紧凑行高的地方（比如大字号数字、单行按钮文字）单独覆盖。生成页面后同样建议用 `getComputedStyle(el).lineHeight` 抽查几处正文，不要只凭代码里"应该写了"就当作已经写对。
| 系统回退字体 | iOS系统字体 / Android系统字体 | INFERRED | 只标注平台名，未标注具体字族（如 SF Pro / Roboto） |

## 颜色 / 圆角 / 阴影

详细 token 见 `design-tokens.md`，这里只列关键结论：

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 按钮/小部件圆角 | 4px | FOUND_IN_FIGMA | 圆角画板 |
| 卡片圆角 | **8px** | FOUND_IN_FIGMA（2026-11修正） | 圆角画板"h=220px 圆角为8px"；用户确认统一 8px。卡内子元素 4px、标签 2px |
| 标签圆角 | 2px | FOUND_IN_FIGMA | 标签画板 |
| 卡片投影（数值本身） | x:0 y:2 blur:4 #02192A 10% | FOUND_IN_FIGMA | 投影规范画板；⚠️ 2025-08 用户两次直接更正：卡片默认既不用投影也不用描边（第一次更正后曾改用描边顶替，又被纠正），纯靠卡片背景色跟页面背景色的对比区隔，除非用户明确要求要投影/要描边 |
| 分割线/Border | 0.5px #EEEEEE | FOUND_IN_FIGMA | 投影规范画板 |
| 遮罩层透明度 | #000000 60% | FOUND_IN_FIGMA | 投影规范备份画板 |

## Icon

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 常规线性图标 | 24px | FOUND_IN_FIGMA | 图标画板 |
| 上传文件类型图标 | 30px | FOUND_IN_FIGMA | 图标画板 |
| 宫格入口图标 | 34px | FOUND_IN_FIGMA | 宫格画板 |
| 头像 | 24 / 48 / 64px | FOUND_IN_FIGMA | 图标画板 |
| 图标颜色 | 复用 Text Token（画板标签"文字/图标 Text"） | FOUND_IN_FIGMA | 色彩画板 |
| Badge 圆点尺寸 | 8px | FOUND_IN_FIGMA | 底部导航画板红点标注 |

## 点击区域

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| Radio/Checkbox 默认高度 | 48px | FOUND_IN_FIGMA | 单选框/多选框画板 |
| Button 常规高度 | 48px | FOUND_IN_FIGMA | 按钮规范画板 |
| 通用最小触控热区 | — | NOT_DEFINED | 库内未给出统一"最小触控尺寸"标准；48px 只是 Radio/Checkbox/Button 各自的规格，**不能**当成全局触控热区标准去套用到所有可点击元素上。2025-08 已经把 Apple HIG(44pt)/Material(48dp)/WCAG(24-44px) 几个外部标准整理进 [interaction-adaptive-tokens.json](interaction-adaptive-tokens.json)，标 `EXTERNAL_STANDARD`，遇到这个空白时先查那份文件，不要再临时现编 |

## 输入框 / 表单

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| 输入框高度 | **60px** | FOUND_IN_FIGMA（2026-11补齐） | 输入框画板 375×60，内容框圆角 6px；图层名"18"是字号规格 |
| Cell 单元格高度 | **60px**（带描述 90 / 带大段说明 94） | FOUND_IN_FIGMA（2026-11补齐） | 单元格画板 375×60，与输入框行高对齐 |
| 输入框字数上限展示 | 有示例(0/100、200/100等)，具体上限由业务定 | FOUND_IN_FIGMA(展示形式) | 输入框画板 |

## 列表

| 项目 | 说明 | 状态 |
|---|---|---|
| List 无独立组件 | 用 Cell + Divider 组合，见 component-library.md 第3节 | — |
| Cell 标题长度上限 | ≤12个字符，超出需省略处理 | FOUND_IN_FIGMA |

## 弹窗 / Toast

| 项目 | 数值 | 状态 | 来源 |
|---|---|---|---|
| Dialog 最小高度 | 约148(单位待核实) | FOUND_IN_FIGMA(数值)/待核实(单位) | 对话框画板 |
| Popup 高度范围 | 最小272pt，最大不超内容区80% | FOUND_IN_FIGMA | 弹出层画板 |
| Toast 文案长度建议 | ≤16字 | FOUND_IN_FIGMA | 轻提示画板 |
| Toast 两侧最小内边距 | 16px | FOUND_IN_FIGMA | 轻提示画板 |

## 滚动 / 键盘弹起

| 项目 | 状态 | 说明 |
|---|---|---|
| 滚动行为规范 | NOT_DEFINED | 库内未见相关标注；外部参考见 [interaction-adaptive-tokens.json](interaction-adaptive-tokens.json) `scroll` 分组（`EXTERNAL_STANDARD`） |
| 键盘弹起适配规范 | NOT_DEFINED | 库内未见相关标注，实现层需要遵循平台原生行为（输入框获焦时页面上滚避让），但这属于工程实现常识，不是 BEP-S 定义的设计规范，不要在交付物里声称这是"库里规定的"；外部参考见同一份 JSON 的 `keyboardAvoidance` 分组 |

## 交互状态 / 自适应（NOT_DEFINED，见外部标准补充）

| 项目 | 状态 | 说明 |
|---|---|---|
| Hover / 按下 / 禁用态视觉反馈 | 大多 NOT_VERIFIED（个别如按钮Hover未验证是否存在真实规范） | BEP-S 组件库基本没有这类数据；`interaction-adaptive-tokens.json` 的 `interactionStates` 分组整理了 Material/iOS 的外部惯例，`EXTERNAL_STANDARD` |
| 动效时长/缓动曲线 | NOT_DEFINED | 库内完全没有；外部参考见同一份 JSON 的 `motion` 分组 |
| 超出375px基准的宽度自适应 | NOT_DEFINED（BEP-S只有375×812单一固定尺寸） | 外部参考见同一份 JSON 的 `responsive` 分组，断点体系目前标注"当前不需要用" |

> 以上这几行和上面 `NOT_DEFINED` 的处理原则完全一样：不能自己拍数字，也不能把 `interaction-adaptive-tokens.json` 里的 `EXTERNAL_STANDARD` 值说成是 BEP-S 自己的规范，引用时必须带上具体来源（Apple HIG / Material Design 3 / WCAG 等），详见 [interaction-adaptive-standards.md](interaction-adaptive-standards.md)。

## 空状态 / Loading

| 项目 | 说明 | 状态 |
|---|---|---|
| Empty 空状态 | 8种插画场景(通用无内容/搜索无结果/网络异常/定位失败/功能建设或维护中/记录为空/系统异常/入口相关)，均为真实 INSTANCE | FOUND_IN_FIGMA |
| Loading 无独立组件 | 按场景用 Switch/Toast/Picker 各自的"加载中"状态，或 icon-加载 图标，见 component-library.md 第3节 | — |

---

## 使用这份文件时的红线

1. 表里标 `NOT_DEFINED` 的项，生成页面时如果绕不开，必须在 Step 6/10 的输出里明确告诉用户"这是估算值，BEP-S 库未定义"，不能悄悄用一个数字就过去了。
2. 不要因为"移动端设计一般都这么做"就用通用经验覆盖表里已经 `FOUND_IN_FIGMA` 的数值——哪怕通用经验看起来更"合理"。BEP-S 自己的规范优先级永远更高。
3. 这份文件里的数值都是从静态画板文本标注中读取的，不是绑定的 Figma Variables（该文件本身没有使用 Variables）。如果后续 Figma 库更新并补充了缺失的数值，这份文件需要同步更新，不要死记硬背。
