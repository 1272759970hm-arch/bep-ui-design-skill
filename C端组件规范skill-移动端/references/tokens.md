# C 端商城 Design Tokens

> 凤凰会 C 端商城组件规范。色值取自 **2026-11-05「字体字号配色标准」板块实读**（Figma node `1177:24677`），与 `references/component-registry.md` §1 一致。所有 JS 常量见 `scripts/preamble.js` 中的 `C.*`。
> **色彩命名已切换为 N 系列中性色编号**，C.* 与 N 对照见下表，写代码/文档时优先用 N 编号沟通。

## 中性色 N 系列（1177:24679 实读，唯一真值）

| 编号 | Hex | C.* | 释义 |
|---|---|---|---|
| **N1** | `#F7F8FA` | `C.gray2` | 内容背景色（chip/按钮/输入框底） |
| **N2** | `#F2F3F5` | `C.bg` | 页面背景色 |
| **N3** | `#EBEDF0` | `C.divColor` | 边框、线色 |
| **N5** | `#C8C9CC` | `C.placeholder` / `C.disabled` | 文字色：disable、提示文字 |
| **N6** | `#969799` | `C.t3` | 辅助说明、原价、未选中导航文字 |
| **N7** | `#646566` | `C.t2` / `C.segTextOff` | 主文字2 |
| **N8** | `#262626` | `C.t1` / `C.segTextOn` | 主文字1 |
| **B** | `#000000` | — | 黑色 |
| **W** | `#FFFFFF` | `C.white` | 白色 |

> 旧值替换记录：`C.t2 #666666 → N7 #646566`；`C.disabled #CCCCCC → N5 #C8C9CC`；`C.gray2 #F5F5F5 → N1 #F7F8FA`。

## 配色方案（品牌 / 功能色，1177:24743 实读）

| Hex | C.* | 语义（界面用色规则 1191:2732） |
|---|---|---|
| `#FF6815` | `C.primary` | **主操作、选中项、常规现价** |
| `#ED392B` | `C.danger` | **促销、倒计时、未读角标**（错误/危险操作同色） |
| `#11C770` | `C.success` | **快递代发、成功状态** |
| `#12BFEA` | `C.info` | **门店履约**（极速达/自提/到店）、信息 |
| `#D38D61` | — | **入驻身份**（店铺标签实心底） |
| `#6A4B1F` | `C.brand2` | **会员权益深棕字**（配浅金底） |
| `#FFF1DF` | `C.ext_cream` | **浅金底**（会员权益、专项标签） |
| `#FF8A1D` | `C.warning` | 警告、提醒 |

### 界面用色规则（六条，硬约束）

1. 主操作、选中项、**常规现价**用品牌橙；**订单商品价用 N8**（不用橙）
2. 促销、倒计时、未读角标用红色
3. 快递代发及成功状态用绿色，**门店履约用蓝色**
4. 入驻身份用棕色（#D38D61），会员权益用深棕（#6A4B1F）配浅金底（#FFF1DF）
5. **浅底、描边可取标准色 8%、24% 透明度**（与标签 tinted 款一致）
6. 商品照片、活动插画及原生系统控件沿用素材用色

## 装饰 / 辅助色

| Token | Hex | RGB(0-1) | 用途 |
|---|---|---|---|
| `C.tan` | `#CF9169` | `.812, .569, .412` | 焦糖暖色，头像/标签/装饰 |
| `C.teal` | `#00C3D0` | `0, .765, .816` | 终稿 Accents/Teal，权益/进度点缀 |
| `C.cream` | `#FFE4B9` | `1, .894, .725` | 奶油字，配深底佣金标签（终稿实测） |

## 拓展色（浅色底 / 标签底 / 多层图标）

| Token | Hex | RGB(0-1) | 用途 |
|---|---|---|---|
| `C.ext_cream` | `#FFF1DF` | `1, .945, .875` | 浅奶油底（配 primary 橙）|
| `C.ext_orange` | `#FFF1DF` | `1, .945, .875` | 别名（兼容旧代码）|
| `C.ext_green` | `#E0FBEE` | `.878, .984, .933` | 浅绿底（配 success）|
| `C.ext_blue` | `#E0F8FE` | `.878, .973, .996` | 浅蓝底（配 info）|
| `C.ext_red` | `#FEEAEA` | `.996, .918, .918` | 浅红底（配 danger）|

## 文字灰阶（对照 N 系列）

| Token | Hex | RGB(0-1) | N 编号 | 用途 |
|---|---|---|---|---|
| `C.t1` | `#262626` | `.149, .149, .149` | N8 | 主文字1（标题/正文） |
| `C.t2` | `#646566` | `.392, .396, .4` | N7 | 主文字2（旧 `#666666` 作废） |
| `C.t3` | `#969799` | `.588, .592, .6` | N6 | 辅助说明、原价、未选中导航 |
| `C.t4` | `#BBBBBB` | `.733, .733, .733` | — | 引导文本 |
| `C.placeholder` | `#C8C9CC` | `.784, .788, .8` | N5 | 提示文字 / disable |
| `C.segTextOn` | `#25211F` | `.145, .129, .122` | — | 分段控件选中文字 |
| `C.segTextOff` | `#646566` | `.392, .396, .4` | N7 | 分段控件未选文字 |
| `C.disabled` | `#C8C9CC` | `.784, .788, .8` | N5 | 禁用（旧 `#CCCCCC` 作废） |
| `C.divColor` | `#EBEDF0` | `.922, .929, .941` | N3 | 白底线 / 分割线 |
| `C.gray2` | `#F7F8FA` | `.969, .973, .98` | N1 | 内容背景 / 三级按钮底（旧 `#F5F5F5` 作废） |

## 背景色

| Token | Hex | RGB(0-1) |
|---|---|---|
| `C.white` | `#FFFFFF` | `1, 1, 1` |
| `C.bg` | `#F2F3F5` | `.949, .953, .961` |
| `C.chipBg` | `#FFF6F0` | `1, .965, .941` |

## Spacing (padding scale)

| Token | px | Common use |
|---|---|---|
| `--css-padding-base` | 4 | tight inline gaps |
| `--css-padding-xs` | 8 | label-control gap, small button |
| `--css-padding-sm` | 12 | cell vertical padding, list item |
| `--css-padding-md` | 16 | **default page side padding**, cell horizontal |
| `--css-padding-lg` | 24 | section spacing |
| `--css-padding-xl` | 32 | rare, page-level top |

### 区块 padding 对称规则（重要）

**任何白底区块（PriceBlock / TitleBlock / Card / etc）内部，top padding 与 bottom padding 必须对称。**

```
✗ 错：top 14，bottom 5    （视觉不平衡，标签贴边）
✓ 对：top 14，bottom 14
✓ 对：top 16，bottom 16
```

计算块高度时：
```
blockH = topPad + contentH + bottomPad
       = 14 + (各内容高 + 各 gap) + 14
```

不要直接定一个"够用"的高度数字，要按内容算并保留对称 padding。

## Typography

| Token | Value |
|---|---|
| `--css-font-size-xs` | 10px |
| `--css-font-size-sm` | 12px |
| `--css-font-size-md` | 14px (body default) |
| `--css-font-size-lg` | 16px (heading) |
| `--css-line-height-xs` | 14px |
| `--css-line-height-sm` | 18px |
| `--css-line-height-md` | 20px |
| `--css-line-height-lg` | 22px |
| `--css-font-bold` | 600 |

**Font family** (`--css-base-font`):
`-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif`

In Figma we use **"PingFang SC"** as the rendered font. Weights: `Regular` (400) and `Medium` (500 — used in headings, button labels). C 端商城 maps `font-bold = 600` but PingFang SC has no 600; Medium is the closest match and what Figma renders.

## Border radius

| Token | px |
|---|---|
| `--css-radius-sm` | 2 |
| `--css-radius-md` | 4 (default — buttons, cards) |
| `--css-radius-lg` | 8 (sheets, dialogs) |
| `--css-radius-max` | 999 (pill/round button) |

## Borders

- 分割线颜色 `#EBEDF0` (`C.divColor`)
- 边框 width `1px` (Figma: `strokeWeight: 1`, `strokeAlign: "INSIDE"`)
- 描边细线（chip / 次要按钮）用 `0.5px`

## Dividers / Hairlines (规范，必须遵守)

| 类型 | 尺寸 | x | 说明 |
|---|---|---|---|
| **Cell 内分割线** (`mkDiv`) | `359 × 0.5` | `16` | 左留 16，**右顶边**（x+w = 375，紧贴屏幕右沿） |
| **Card 内分割线** (`mkCardDiv`) | `327 × 0.5` | `16` | 卡片内分区（如展开 toggle 后），左 16 右顶 card 右边 |
| **区块全宽分割线** (`mkDivFull`) | `375 × 0.5` | `0` | 跨功能区（底栏顶边、Header 与内容之间等） |

- **粗细一律 0.5px**，不用 1px（0.5 在 Retina 屏更精致）
- 颜色 `#EBEDF0` (`C.divColor`)
- **CellGroup 最后一行不画分割线**
- 分割线必须**放在 Cell 内部 y=49.5**（高 0.5），不要放在 Cell 之间——会被下一个 Cell 的白底盖住（z-order 问题）

## Animation

- 标准过渡 `0.3s`
- 快速过渡 `0.2s`
- 缓动函数 `ease-out` / `ease-in`

## iPhone safe-area constants

- Status bar: 44px
- Bottom safe area (home indicator): 34px
- NavBar height: 46px (C 端商城 default, see nav-bar tokens)
- Tabbar height: **84px**（50 内容 + 34 安全区，终稿实测 375×84）

## Component-specific tokens

按钮组 / 标签 / 价格 / chip / 步进器 / 分段控件的尺寸与色值，**全部见 `references/component-registry.md`**（终稿实读，唯一标准）。`scripts/preamble.js` 的 `COMPONENT_TOKENS` 已按此同步。
