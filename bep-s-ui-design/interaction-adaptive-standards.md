# 交互 / 自适应规范（外部行业标准，非 BEP-S 原生数据）

> 这份文件填补的是 `mobile-ui-rules.md` 里标 `NOT_DEFINED` 的空白——点击区域、状态反馈（hover/按下/禁用）、动效时长、滚动行为、键盘避让、任意宽度自适应。这些东西 BEP-S 的 Figma 源文件本身没有定义，这里引入的是外部大厂/标准组织的公开规范，**不是凭空猜的，也不是 BEP-S 自己的规定**。结构化数据在 [interaction-adaptive-tokens.json](interaction-adaptive-tokens.json)。

## 这份文件不做什么

**不修改任何 BEP-S 已验证的视觉 Token。** `design-tokens.json`/`design-tokens.md` 里的颜色、字号、间距、圆角、阴影一个值都没有动，`component-registry.json` 里每个组件的尺寸/状态也没有动。这份文件只是在 BEP-S 没有覆盖的"交互行为"和"任意宽度自适应"这两块新增内容，两者在数据结构上是完全分开的两个文件，不会混到一起。

## 新增一个可信度等级：`EXTERNAL_STANDARD`

之前的四级（`FOUND_IN_FIGMA` / `INFERRED` / `NOT_DEFINED` / `AI_PROPOSED`）回答的都是"BEP-S 自己有没有定义这个"。`EXTERNAL_STANDARD` 是新增的第五级，回答的是另一个问题："BEP-S 没定义，但有没有一个具名的外部权威来源可以参考"。

| 等级 | 含义 | 使用规则 |
|---|---|---|
| `EXTERNAL_STANDARD` | 来自具名的外部规范（Apple HIG / Material Design / WCAG 等），BEP-S 本身没有对应数据 | 可以直接用来填补 `NOT_DEFINED` 的空白，**但每次引用都必须带上 `source` 字段里的具体来源名称**，禁止说成"BEP-S规范""design-tokens""设计系统官方定义"这类话——它就是外部标准，来源必须显性 |

**优先级更新**：遇到 `NOT_DEFINED` 的空白时，查找顺序是 `NOT_DEFINED` → 查 `interaction-adaptive-tokens.json` 有没有 `EXTERNAL_STANDARD` → 有就用（带来源声明）→ 没有才退到纯 `AI_PROPOSED`（自己给一个建议值）。`EXTERNAL_STANDARD` 优先于 `AI_PROPOSED`，因为前者至少有一个可查证的具名来源，后者纯粹是猜的。

## 采用了哪些来源，为什么是这几个

- **Apple Human Interface Guidelines**：BEP-S 的 NavBar/TabBar 已经在用 iPhone678/iPhoneX 两套设备规格做安全区适配，本来就是 iOS 语境，HIG 是自然的配套参考。
- **Material Design 3（Google）**：目前唯一一个把"状态反馈"（hover/focus/pressed 的透明度）和"动效时长/缓动曲线"写成精确数值表的主流规范，Apple 官方文档在这两块反而没有给出像 Material 这么明确的数字，所以这两项主要参照 Material，iOS 部分只能给"平台惯例"级别的描述，标了置信度 `MEDIUM`。
- **WCAG（W3C无障碍规范）**：点击热区尺寸这件事上是最权威、跨平台的标准，2.5.5(AAA)/2.5.8(AA) 两条都写了具体数字，可信度 `HIGH`。

不是所有条目可信度都一样——`interaction-adaptive-tokens.json` 里每条都有 `confidence: HIGH/MEDIUM`，`HIGH` 是官方文档里明确写死的数字，`MEDIUM` 是行业惯例但不同版本/平台间有出入的，用的时候要如实带上这个区分，不能都说成"官方标准"。

## 具体条目速查（详细数值和来源见 JSON）

| 缺口 | 采用的外部标准 | BEP-S 现状 |
|---|---|---|
| 通用最小触控热区 | Apple 44pt / Material 48dp / WCAG AAA 44px / WCAG AA 24px | BEP-S 的 Button/Radio/Checkbox 已经是 48px（FOUND_IN_FIGMA），已经达标，这条只用来补 BEP-S 没单独定义尺寸的其他可点击元素（纯图标按钮、列表行内小图标等） |
| Hover/Focus/Pressed 状态反馈 | Material 的 state layer 透明度（8%/10-12%/10-12%），iOS 给的是"整体降低透明度或轻微缩放"的惯例描述 | BEP-S 组件库里这几个状态基本是 `NOT_VERIFIED`（比如次要按钮的 Hover），这条是唯一能填的依据 |
| 动效时长/缓动曲线 | Material 的 duration token（100-300ms）+ Standard easing 贝塞尔曲线，iOS 给约0.2-0.3s的惯例值 | BEP-S 完全没有动效相关数据 |
| 滚动行为（惯性/下拉刷新） | iOS/Android 平台原生行为 + CSS `overscroll-behavior` | BEP-S 完全没有 |
| 键盘避让 | iOS/Android/Web 通用工程惯例 | BEP-S 完全没有 |
| 任意宽度自适应（非375px设备） | 375px 基准 + `max-width:428px` 流式宽度（行业惯例，覆盖主流iOS机型逻辑宽度范围） | BEP-S 只有 375×812 单一固定尺寸，这条是唯一的宽度自适应依据 |
| 断点体系（平板/折叠屏） | Material Design 3 Window size classes（Compact `<600dp` / Medium `600-840dp`） | BEP-S 目前只做移动端，这两个断点**当前不需要用**，只是留着备用，别在移动端页面里主动套用 |

## 使用时的红线（跟前面所有规则一脉相承，不是新原则）

1. 引用 `EXTERNAL_STANDARD` 的值时，必须原文带上具体来源名字（"Apple HIG""Material Design 3""WCAG 2.5.5"），不能笼统说"参考了行业标准"。
2. 不能因为引入了这些外部规范，就反过来去改 BEP-S 自己已经 `FOUND_IN_FIGMA` 的数值——比如不能因为 Material 说 hover 用 8% 透明度覆盖，就去改 BEP-S 按钮本身的填充色。这份文件只解决 BEP-S 没管的事，不重新裁决 BEP-S 已经管了的事。
3. `confidence: MEDIUM` 的条目输出时要如实说"行业惯例，非单一权威文档强制定值"，不要包装成和 `HIGH` 一样确定的东西。
4. 断点体系（平板/折叠屏）目前标注为"当前不需要用"，除非用户明确说要做非移动端适配，否则不要主动往移动端页面里加断点逻辑。
