# 页面模板（Page Templates）

> 来源：2026 凤凰会商城 UI 交付稿「终稿」（Figma node `1:789`）23 个画板，实测提取。
> 用法：**Step 2 识别页面类型后，先读对应模板**，按模板的区块序填内容，不要自创结构。
> 尺寸/色值仍以 `references/component-registry.md` 为准；本目录只管「页面怎么排」。

---

## 索引

| # | 页面类型 | 模板 | 画板来源 | 可运行代码 |
|---|---|---|---|---|
| 01 | 首页 / 会場页 | `01-home.md` | 首页、首页导图、默认头图、滑动-橙、金刚区图标 | `tpl-home.js` |
| 02 | 分类页 | `02-category.md` | 分类页、01/02/03 | — |
| 03 | 商品详情 | `03-detail.md` | 详情页一屏、长图、节日、阶梯价 | `tpl-detail.js` |
| 04 | 购物车 | `04-cart.md` | 购物车 | `tpl-cart.js` |
| 05 | 确认订单 / 支付成功 | `05-checkout.md` | 确认订单 ×4、支付成功 | `tpl-checkout.js` |
| 06 | 极速达（门店即时零售） | `06-flash-delivery.md` | 极速达、极速达大图 | — |
| 07 | 底部弹层（购买/加购） | `07-sheet.md` | 购买弹窗、加购 ×3 | `tpl-sheet.js` |
| 08 | 圈子（内容/社区） | `08-circle.md` | 圈子、好货预告模块 | — |

## 三种文件怎么配合

| 文件 | 内容 | 何时读 |
|---|---|---|
| `NN-xxx.md` | 区块顺序、区块内元素、文案规则、变体差异、易错点 | Step 2 / Step 3 定骨架时 |
| `tpl-xxx.js` | **页面主体代码**（不含 preamble）| Step 9 生成代码时 |
| `scripts/preamble.js` | 字体 / Token / 31 个 helper | Step 9 粘在代码最前面 |

## JS 模板的正确用法

```js
// 1. 粘贴 scripts/preamble.js 全文（含 (async () => { 开头）
// 2. 把 preamble 里 "# 在此填入页面代码" 替换为 tpl-xxx.js 的内容
// 3. 运行
```

模板里统一约定：

- 变量名 `screen / topBar / bottomWrap` 与 preamble 一致
- 文案集中在文件头部的 `DATA` 对象，改文案只改这一处
- 区块用 `y` 游标累加（`let y = 90; ... y += blockH + gap;`），不要写死绝对坐标

## 页面通用骨架（所有模板共享）

```
screen (375 × auto, bg #F2F3F5)
├─ topBar        90h   状态栏 44 + 导航 46
├─ [内容区]      y=90 起，区块依次累加
└─ bottomWrap    底部 CTA，顶 0.5px 分割线，留 34 安全区
```

例外：Hero 型页面（首页 / 极速达 / 圈子）用**透明状态栏**，内容从 y=0 开始，`topBar` 背景透明。

## 通用约束：筛选条随底色换装

任何页面出现「快捷筛选 Tabs / 一级筛选 chip 条」，先看它落在什么底色上：

- **白底区**（白 sheet、白卡、白吸顶条）→ 灰 chip `#F7F8FA`，选中橙 10% 底，无边框
- **灰底区**（`#F2F3F5` 直接铺开）→ 白 chip，选中白底 + 橙 0.5px 描边

helper：`mkFilterTab(text, selected, pageBg, parent)`。两套**不可混用**，详见 `component-registry.md §4.8`。
