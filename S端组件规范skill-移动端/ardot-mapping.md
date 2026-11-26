# Ardot 画布落地映射

> 本文件解决"规范读懂了、画出来还是偏"的最后一公里：把 Figma 的结构与样式翻译成 Ardot 画布的节点属性。
> 适用：在设计画布（不是 Figma）里产出 BEP-S 移动端设计稿时。

---

## 1. 画板与页面骨架

| Figma | Ardot | 说明 |
|---|---|---|
| Frame 375×812 | `I(page, {type:"frame", width:375, height:812, layout:"vertical", gap:0, padding:0, clipsContent:true, fills:[...]})` | 页面根节点，`clipsContent: true` 防止溢出 |
| Auto Layout (vertical) | `layout:"vertical"` + `gap` + `padding` + `primaryAxisAlignItems` | 一一对应 |
| Auto Layout (horizontal) | `layout:"horizontal"` | 同上 |
| Fill container | `width/height: "fill_container"` | 需要父级是 flex |
| Hug contents | `width/height: "hug_contents"` | 默认值 |
| 固定尺寸 | 数字 | 单位 px |
| Space between | `primaryAxisAlignItems:"SPACE_BETWEEN"` | 分页器/导航常用 |
| 垂直居中 | `counterAxisAlignItems:"CENTER"` | 注意不是 `alignItems` |

**页面骨架模板**（375×812）：

```
页面 (vertical, gap 0)
├─ 状态栏 375×44 (horizontal, padding 左24 右16, bg #FFFFFF)
├─ 导航栏 375×44 (horizontal, padding 0 16, bg #FFFFFF)
├─ 内容区 fill_container (vertical, padding 0 16, gap 12, bg #F7F8FA)
└─ 底部导航 375×50 + 安全区 375×34
```

> 内容区 `padding` 只给左右 16，上下留空，由内部第一个模块的 `marginTop` 或父级 `gap` 控制（内容区首模块距导航 12px）。

---

## 2. 样式属性映射

| Figma | Ardot 写法 | 注意 |
|---|---|---|
| Fill (Solid) | `fills:[{type:"SOLID", color:{r,g,b}, opacity:1, visible:true, blendMode:"NORMAL"}]` | **r/g/b 必须是 0–1 小数**，不是 0–255 |
| Fill 透明叠加 | 同上，`opacity: 0.16` | `rgba(0,177,180,0.16)` → `color:{r:0,g:0.694,b:0.706}, opacity:0.16` |
| 圆角 | `cornerRadius: 8` | 逐角用对象 `{topLeft:8,...}` |
| 描边 | `strokes:[{type:"SOLID", color:{...}, opacity:1, visible:true}]` + `strokeWeight: 0.5` | 0.5px 描边要显式给 `strokeWeight` |
| 阴影 | `effects:[{type:"DROP_SHADOW", ...}]` | 默认不加，见 C-33 |
| 文字 | `type:"text", content, fontSize, fontWeight:"500", fontName:{family:"Noto Sans SC", style:"Medium"}, fills:[...]` | **`fill` / `fills` 必须显式设置**，否则文字不可见 |
| 行高 | `lineHeight:{value: 25.2, unit:"PIXELS"}` | 18px × 1.4 = 25.2 |
| 图片填充 | 先建 frame，再用 `G(nodeId,"placeholder","封面图")` 占位 | 没有 image 节点类型，图是 fill |
| SVG 图标 | `I(parent,{type:"frame", svg:"<svg .../>"})` | 不要用图标字体 |

### 色值换算表（BEP-S 常用）

| Hex | Ardot color |
|---|---|
| #00B1B4 | `{r:0, g:0.694, b:0.706}` |
| #00686A | `{r:0, g:0.408, b:0.416}` |
| #F7F8FA | `{r:0.969, g:0.973, b:0.980}` |
| #F2F3F5 | `{r:0.949, g:0.953, b:0.961}` |
| #22262F | `{r:0.133, g:0.149, b:0.184}` |
| #444F60 | `{r:0.267, g:0.310, b:0.376}` |
| #9199A2 | `{r:0.569, g:0.600, b:0.635}` |
| #CCCFD6 | `{r:0.800, g:0.812, b:0.839}` |
| #EEEEEE | `{r:0.933, g:0.933, b:0.933}` |

---

## 3. 组件配方 → Ardot 代码

### 3.1 一级 Tab（下划线）

```
tabs=I(content,{type:"frame",layout:"horizontal",width:"fill_container",height:42,primaryAxisAlignItems:"SPACE_BETWEEN",fills:[{...白}]})
tab1=I(tabs,{type:"frame",layout:"vertical",width:"fill_container",height:42,counterAxisAlignItems:"CENTER",primaryAxisAlignItems:"MAX"})
t1=I(tab1,{type:"text",content:"全部订单",fontSize:16,fontWeight:"500",fill:"#00B1B4",fontName:{family:"Noto Sans SC",style:"Medium"}})
ind=I(tab1,{type:"frame",width:24,height:2,cornerRadius:1,fills:[{type:"SOLID",color:{r:0,g:0.694,b:0.706}}]})
```
要点：四个入口各 `width:"fill_container"`（平分）；指示条是**独立 24×2 圆角矩形**，不是文字下划线。

### 3.2 独立胶囊 Tab（单层筛选，实心选中）

```
chips=I(content,{type:"frame",layout:"horizontal",gap:16,width:"fill_container"})
c1=I(chips,{type:"frame",layout:"horizontal",height:38,padding:{left:14,right:14,top:0,bottom:0},cornerRadius:19,counterAxisAlignItems:"CENTER",fills:[{type:"SOLID",color:{r:0,g:0.694,b:0.706}}]})
c1t=I(c1,{type:"text",content:"全部",fontSize:16,fill:"#FFFFFF"})
c2=I(chips,{type:"frame",...,cornerRadius:19,fills:[{...白}]})
c2t=I(c2,{type:"text",content:"待响应",fontSize:16,fill:"#22262F"})
```
要点：选中 = **实心 #00B1B4 + 白字**；未选中 = 白底 + 深字；圆角 = 高度 ÷ 2（38 → 19）。**不是浅底彩字。**

### 3.3 二级胶囊（多级标签内，浅底选中）

```
sec=I(wrap,{type:"frame",layout:"horizontal",gap:16})
s1=I(sec,{type:"frame",height:32,padding:{left:12,right:12,top:0,bottom:0},cornerRadius:16,counterAxisAlignItems:"CENTER",fills:[{type:"SOLID",color:{r:0,g:0.694,b:0.706},opacity:0.16}]})
s1t=I(s1,{type:"text",content:"待处理",fontSize:14,fill:"#00B1B4"})
```
要点：仅当它依附在一级 Tab 之下时才用浅底；高度 32、字号 14。

### 3.4 搜索栏

```
sb=I(content,{type:"frame",layout:"horizontal",width:"fill_container",height:36,padding:{left:12,right:12,top:0,bottom:0},gap:4,cornerRadius:18,counterAxisAlignItems:"CENTER",fills:[{...白}]})
```
要点：`cornerRadius = 高度÷2 = 18`。**用 4px 会立刻变成"卡片"。**

### 3.5 卡片

```
card=I(list,{type:"frame",layout:"vertical",width:"fill_container",gap:8,padding:16,cornerRadius:8,fills:[{...白}]})
```
要点：8px 圆角、无 `effects`、无 `strokes`。内部标签用 4px、标签 2px，**不继承 8px**。

### 3.6 按钮

```
btn=I(row,{type:"frame",layout:"horizontal",height:48,padding:{left:16,right:16,top:0,bottom:0},cornerRadius:4,primaryAxisAlignItems:"CENTER",counterAxisAlignItems:"CENTER",fills:[{...品牌色}]})
btnt=I(btn,{type:"text",content:"提交",fontSize:15,fontWeight:"500",fill:"#FFFFFF"})
```
要点：高 48、圆角 4、左右 16；胶囊按钮 `cornerRadius: 24`。

### 3.7 标签

```
/* 行内普通标签：底 = 同源色 10%，字 = 该色实色。下面以品牌档为例 */
tag=I(row,{type:"frame",height:22,padding:{left:8,right:8,top:0,bottom:0},cornerRadius:2,counterAxisAlignItems:"CENTER",
  fills:[{type:"SOLID",opacity:0.10,color:{r:0,g:0.694,b:0.706}}]})   // rgba(0,177,180,0.10)
tagt=I(tag,{type:"text",content:"进行中",fontSize:12,fill:"#00B1B4"})

/* 卡片右上角状态角标：h27，p 4/8，圆角 0 8 0 8，absolute 贴 top-0 right-0 */
badge=I(card,{type:"frame",height:27,padding:{left:8,right:8,top:4,bottom:4},
  cornerRadius:{topLeft:0,topRight:8,bottomRight:0,bottomLeft:8},
  x:<卡片宽-角标宽>,y:0,
  fills:[{type:"SOLID",opacity:0.10,color:{r:1,g:0.247,b:0.247}}]})   // rgba(245,63,63,0.10)
badget=I(badge,{type:"text",content:"超时",fontSize:12,fill:"#F53F3F"})
```

---

## 4. Variant / 状态

Ardot 没有 Variant 机制，**一个状态画一个节点**：

- 同一组件的多状态横向排列，命名后缀统一：`chip-全部激活` / `chip-待响应`；
- 需要展示状态对比时，每个状态独立成卡并标注名称；
- 组件级复用：把高频组件（胶囊 Tab、标签、按钮）做成 `reusable: true` 的组件，页面里用 `{type:"ref", ref:"组件ID"}` 实例化，改一处全同步。

> 2026-11 教训：业主群事项列表的 chips 是 4 个独立 frame，改选中态要逐个 `U()`。若一开始做成 reusable 组件 + 实例覆盖，只需改主组件。

---

## 5. 高频偏移陷阱（逐条对照）

| 症状 | 根因 | 正确做法 |
|---|---|---|
| 搜索框像卡片 | 用了 `cornerRadius:4` | 胶囊 `高度÷2` |
| 胶囊 Tab 选中态发白 | 套用了二级胶囊的浅底规则 | 单层筛选用实心品牌色 + 白字 |
| 卡片圆角偏小 | 沿用旧记录 6px | 8px |
| 文字看不见 | 只写了 `content` 没写 `fills` | 每个 text 必须给 `fill` |
| 布局错位 | 父级没设 `layout` 就用了 `fill_container` | 先确认父级 flex |
| 底部导航高 56 | 用了间距画板注释 | 50 内容区 + 34 安全区 |
| 页面总高 ≠ 812 | 各模块高度相加未对齐 | 用 `fill_container` 撑内容区，别写死高度 |
| 颜色偏亮/偏暗 | r/g/b 写成 0–255 | 换成 0–1 小数 |
| 0.5px 描边看不见 | 没给 `strokeWeight` | 显式 `strokeWeight:0.5` |
| 行高过松 | 用了 1.5 倍 | 字号 × 1.4 |

---

## 6. 交付前必做

1. 用 `capture_layout(problemsOnly:true)` 查溢出/裁切/重叠；
2. 对每个页面 `capture_screenshot` 一次，逐条对照 `constraints.md` 第 7 节；
3. 检查所有 text 节点的 `fills` 是否存在（尤其复制出来的节点）；
4. 检查页面总高是否 812、内容区是否 `fill_container`；
5. 记录哪些值来自 `visualRecipe`、哪些是 `AI_PROPOSED`，交付说明里讲清楚。
