# 设计令牌（真源）

> 所有数值来自 Figma 实测。修改令牌值必须同步更新 bep-components.js 中的 BEP_C。
> 标注 <!-- TODO --> 的为推断值，待与设计师确认。

---

## 颜色

### JS 格式（bep-components.js 中的 BEP_C）

```javascript
// 品牌色
primary:   '#006D9B'   // 主色，用于主要按钮/链接/激活态
primaryH:  '#338AAF'   // hover 态
primaryA:  '#00628C'   // active/pressed 态

// 语义色
success:   '#3BBB3E'   // 成功/启用
warning:   '#FFA645'   // 警告
danger:    '#FE5E54'   // 危险/删除/错误

// 页面背景
pageBg:    '#F0F2F5'   // 内容区外层大背景（为什么：与白色卡片形成对比，减少视觉疲劳）
secondary: '#F5F7FA'   // 二级背景/子行背景

// 侧边栏
sidebarBg: '#002138'   // 一级菜单背景
sidebarSub:'#00182A'   // 二级菜单背景（为什么：比一级深10%，建立层级感）
```

### 透明度体系（叠加在黑色 #000000 上）

| Token | 值 | 典型用途 |
|---|---|---|
| T85 | rgba(0,0,0,0.85) | 主标题、强调文字 |
| T65 | rgba(0,0,0,0.65) | 表格数据、次要内容 |
| T45 | rgba(0,0,0,0.45) | 占位符、辅助文字 |
| T25 | rgba(0,0,0,0.25) | 极弱提示、disabled 文字 |
| T15 | rgba(0,0,0,0.15) | 边框、分隔线（中等）|
| T06 | rgba(0,0,0,0.06) | 表头背景、分隔线（轻）|
| T04 | rgba(0,0,0,0.04) | 子节点背景（极轻）|

---

## 字体

```
字体族：PingFang SC（简体中文，⚠️ 必须是 SC 不是 TC）
Figma Scripter 中必须先 loadFontAsync 才能使用

常用字号/行高组合：
  标题：  16px / 24px（Medium）
  正文：  14px / 22px（Regular）
  辅助：  12px / 20px（Regular）
  说明：   7px / 10px（Regular，如侧边栏副标题）
```

---

## 间距（常用常量）

```javascript
CANVAS_W   = 1440    // 画布宽
CANVAS_H   = 900     // 画布高（⚠️ 抽屉内容过多时可延伸）
SIDE_W     = 208     // 侧边栏宽
HDR_H      = 96      // 页头总高（TopBar 48 + TitleBar 48）
OUTER_PAD  = 16      // 侧边栏→内容区外边距
CARD_PAD   = 24      // 卡片内边距
TABLE_W    = 1152    // 1440标准页表格宽；实际表格宽按屏幕尺寸与页面布局计算
ROW_H      = 48      // 标准行高（表格数据行/表头行）
```

---

## 圆角

```
页面级卡片（Card）：r = 4
业务组件（Input/Tag）：r = 2
按钮：r = 4
输入框/选择器：r = 2
弹窗（Modal/Drawer）：r = 2
头像：r = 12（圆形，直径24px）

<!-- TODO: Modal/Drawer 圆角为 2px，但部分页面实测为 4px，需确认 -->
```

---

## 分隔线

```
水平分隔线：高1px，rgba(0,0,0,0.06)，用 bepRect 实现
垂直分隔线（用户区）：宽1px，高16px，rgba(0,0,0,0.10)
冻结列竖线：宽1px，rgba(0,0,0,0.15)
```
