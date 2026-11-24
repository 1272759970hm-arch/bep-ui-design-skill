# CHANGELOG

## 2026.11.19 — Design QA 能力迭代：可执行、可验证、可修复的自动质量校验机制

> 用户要求：不是加自检提示词，而是建立「六维校验 → 识别违规 → 分析规范 → 自动修复 → 二次校验 → 报告」闭环，
> 并升级工作流为「设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付」。

- **新增 `qa/` 模块化引擎**（14 个文件，零第三方 JS 依赖；视觉比对用 Pillow）：
  - `qa/qa-run.mjs` CLI 主入口（六维 + 代码检查 → 修复 → 二次校验 → md/json 报告 → `--strict` 门禁）
  - `qa/rules/01..06-*.mjs` 六大维度 checker；`qa/rules/index.mjs` 模块化扩展点；`qa/rules/legacy.mjs` 已作废形态黑名单
  - `qa/lib/`：`context.mjs` 依据加载、`html-extract.mjs` / `js-extract.mjs` 静态提取、`issue.mjs` 状态语义、
    `report.mjs` 8 章节报告、`code-check.mjs` 代码检查/构建/Figma mock 空跑、`visual-diff.py` 像素比对
  - `qa/fixes/auto-fix.mjs` 确定性修复（写前 `.bak` 备份）；`qa/specs/` 示例规格与 PRD 模板；`qa/README.md` 机制说明
- **工作流升级**：`SKILL.md` 13 步 → **17 步**，新增 Step 14 设计输出 / 15 自动质量校验 / 16 问题修复 /
  17 二次校验+最终交付；File Map 增加质量校验层。每次设计输出必须附 Design QA 报告。
- **状态语义**：PASS / FAIL / WARNING / BLOCKED / NOT CHECKED；**未实际检查不得标 PASS**；
  缺 PRD / Figma 终稿 / 渲染环境 / Shadow Token 一律 `BLOCKED`；产品原型作视觉参考一律拒绝。
- **代码检查落地**（用户明确要求）：JS 交付物按 `INDEX.md` 构建（模板插入 preamble IIFE 占位符，
  修正早期简单拼接导致作用域错误）→ `node --check` → Figma API mock 空跑断言 paint 结构 / 渐变 alpha /
  越界 / 未定位；HTML 做标签配对与 CSS 括号平衡。
- **首轮实测发现并修复校验器自身的 6 类误报**（QA 的 QA）：
  1. `numeric` 把规范全文所有 px/pt 数值（笔画 2.23 / tabbar 84 / 按钮 106×40）当字号白名单 → 改为分域阶梯集合，阶梯外数值汇总 `WARNING` 而非编造标准判 FAIL
  2. `0.45` 裸正则命中 SVG path 坐标与 `opacity=".45"`，且全局替换会破坏 SVG → 收紧为「仅 rgba 第 4 位」+ 精确修复回调
  3. 修复建议把 `0.45` 写成「替换为 0.08」（映射错）→ 按实际命中值给正确映射
  4. `.sheet`（白底吸顶区）被正则误判为弹窗 → 收紧为明确弹窗信号
  5. `I-2` 显示 PASS 但证据写「未检出选中态」→ 通过项不再进问题表，只计统计
  6. `T-IIFE` 对 `tpl-*.js` 片段误报（IIFE 在 preamble 里）→ 技术约束改基于构建后脚本判定
  另修：`.addbtn` r9（registry §4.9 实测特例）被判非规范圆角；`.avatar` 占位底色按规则 6 豁免；
  维度 01/05 的 `BLOCKED` 被 `hasChecked=false` 短路成 `NOT_CHECKED`；数据驱动语义键（`store.shopTag.kind`）
  误判「编造变体」→ 改为核对 DATA 中的候选字面量。
- **实际测试结果**（7 个交付物 + 修复闭环 + 视觉比对 + 需求还原，全绿）：
  - 7 个目标全量校验 `FAIL=0`；剩余 `BLOCKED` 均为如实标注的条件不足
  - 5 个 `tpl-*.js` 的 `node --check` + Figma mock 空跑全绿（`oob=0 / unpos=0 / paintErrors=[]`，111/68/90/63/32 节点）
  - 自动修复闭环：埋入 4 类违规 → 轮次 1→2、`FAIL 4→0`、4 项按映射修正、**SVG path 的 `0.45` 未被误改**、备份已写
  - 视觉比对三分支自测：自身 `diffRatio=0` / 不同页 `0.237` / 尺寸不一致 `sizeMatch=false`；
    `product-prototype` 来源被正确拒绝为 `BLOCKED`
  - 需求还原：样例规格 4 条静态命中 / 1 条语义 `NOT_CHECKED` / `source=sample` 明确警告不可用于验收

## 2026.11.09 — 图标体系全量切换 Solar 圆润风（icon control 走查反馈）

- 用户反馈：产品侧使用 icon control 时图标「尖锐不圆润、风格不统一」——根因是功能图标走 `lucide:*`（直线尖角），与组件库（Solar 圆角风）不匹配
- **规则定稿（registry §6 重写 + SKILL.md 图标节）**：
  - 来源优先级：① 组件库 icon 组件实例（生成 Figma 脚本时优先实例化）→ ② Iconify `solar:*` 兜底 → ③ 禁用 `lucide:*`
  - 功能图标 `solar:xxx-outline`、选中/强调 `xxx-bold`；TabBar 线性/面性成对
  - registry §6 附 lucide→Solar 对照表（返回/分享/购物车/客服/收藏/更多/关闭/搜索/扫码/筛选/±/地址/关注/券/设置/店铺/社群，全部经 iconify 200 校验）
- **preamble + 5 模板 32 处调用迁移**（chevron→alt-arrow、cart→cart-outline、menu-dots、close-circle、magnifier、scanner、stepper ±→minus/add-outline、金刚区占位→lightning/like/leaf/bottle/heart-pulse/crown/t-shirt/wineglass/gift/battery 等）
- 交付页 `大促商品列表页.html` 10 处内联 lucide SVG 换 Solar（返回/搜索/购物车/下拉×2/筛选 + tabbar 首页面性 bold/分类/购物车/我的），截图复核圆润观感与组件库一致
- registry §4.4 步进器图标同步；§9 替换记录登记
- 回归 5 模板全绿（/tmp/smoke.mjs 已重建）

## 2026.11.06 — 标签首行对齐 + 到手价规则 + 加购圆钮场景映射

> 第三轮补：**商品流加购圆钮 + 按钮场景映射硬约束**（用户两次指正：先纠正自创「加购」pill，再纠正 32×32 / 加号过细）
> - registry 新增 **§4.0 按钮使用场景映射**：任何按钮先按场景查表选组件，表里没有 → 回 Figma 实测，**禁止自创形态**（附 10 个场景映射 + 作废反例）
> - registry 新增 **§4.9 商品流加购圆钮**（**1:6053 Figma 实测定稿**）：**18×18 橙实心圆 + 白「+」10.9×11、笔画 2.23**（臂长≈直径 61%，几乎撑满圆），位置=价格操作行右缘垂直居中；旧「≈56×26 描边 pill」作废
> - ⚠️ 关键教训入库：**加号是全圆角胶囊臂**——用 `rect + rx=笔画/2` 实现；`stroke-linecap="round"` 的圆头会超出 viewBox 被裁成平头（用户第三次指正），lucide:plus 缩放笔画稀释 2.4 倍，两者都禁用
> - 硬约束措辞修正：「文字按钮禁 icon+文字」的**唯一例外**是 + 圆钮（纯图标组件，也不许往里加字）
> - preamble `mkAddBtn` 改自带 SVG 版；SKILL.md 按键组表 + 组件化段落同步
> - 交付页 6 处圆钮按实测值重做，8 倍放大截图复核与设计稿观感一致；mock 回归全绿

> 第二轮补：**到手价规则**（Figma 价格系统规范表实读，用户圈注自查发现整条漏库）
> - registry §3 重排：常规商品卡 / 加购从「大步阶」**改归中步阶**，结构「**到手价 + 现价 + 原价**」，新增**常规 / 特殊（订单页面）双变体**——常规到手价+现价 `#FF6815`，订单页整组 `#262626`（N8），原价一律 `#969799` 删除线
> - SKILL.md 新增「价格（到手价双变体）」速查；01-home.md 价格行补到手价结构
> - 交付页 `大促商品列表页.html` 5 张常规卡价格行加「到手价」前缀（秒杀卡除外），截图复核基线对齐
> - registry §9 替换记录同步

> 第一轮：**标签首行对齐硬规则**（同事版实战反馈）
> - 商品/服务标签只与**品名第一行文字垂直居中**，不随两行文本块整体居中；HTML 行内流 + `vertical-align:top`
> - 入库：registry §2 / SKILL.md / 01-home.md / preamble `mkTagNameRow` 注释；交付页已改并截图复核

## 2026.11.05 — 标签系统二次实读修正 + 快捷筛选 Tabs

> 同日第五轮补：**旧规范清仓审计**（把「新规范替换旧规范」查到底）
> - 决策层 `decision/05-visual-strategy.md`：作废「danger 红 = 价格」，改品牌橙现价 / 订单商品价用 N8；灰阶表改 N 系列
> - 4 个可运行模板去旧写法：`tpl-detail` / `tpl-sheet` 佣金改 `mkDuoTag`；`tpl-cart` / `tpl-checkout` 店铺组头拆为店铺标签 + 服务标签；所有 `mkTag` 旧 4 参调用改语义语法，间隔 6 → 4
> - `tpl-cart` 商品行补营销标签（规格同行右侧、间隔 6，避开 88 行高限制）；registry §2 / §9、SKILL.md、04-cart.md 同步措辞
> - `preamble.js` 分割线注释 `#EEEEEE` → `#EBEDF0 = N3`
> - 回归：5 个模板 mock 空跑全部 `ok / 越界 0 / 未定位 0 / paint 错误 0`

> 同日第四轮补：**配色方案 N 系列定稿**（Figma 1177:24677「字体字号配色标准」实读）
> - 中性色 N1–N8 / B / W 命名体系入库（tokens.md 重写色板，registry §1 改为 N 对照表）
> - 色值替换：`C.t2 #666666 → N7 #646566`、`C.disabled #CCCCCC → N5 #C8C9CC`、`C.gray2 #F5F5F5 → N1 #F7F8FA`（preamble 已同步）
> - 界面用色六条硬规则入库：订单商品价用 N8 不用橙；促销/倒计时/未读用红；快递代发绿、门店履约蓝；入驻棕、会员深棕配浅金底；浅底/描边取标准色 8%/24%；照片插画沿用素材用色

> 同日第三轮补：**应用规范列**（Figma 1164:2724~2729 新增）
> - registry §2「摆放规则」升级为「应用规范」六条实读（商品/服务标签挂品名首行前 4px 间隔、营销标签在价格行下方 4px、店铺标签↔店名 2px、未读角标几何、状态标签暂无应用）
> - preamble 新增 `mkTagNameRow(tags, lines, infoW, parent)`（29 → 30 helpers），实现「标签+品名首行同排、续行 flush 左」
> - SKILL.md 标签速查加「摆放（硬约束）」清单：服务标签每卡 1 个、营销标签不得跟品名等

来源：规范系统设计板块（104:1869~104:1918）+ 分类页 1:5866 / 商品列表 1:6837 实读；大促商品列表页实战反馈修正。

### 标签四款定稿（旧款全部作废，见 registry §2 / §9）
- **服务** tinted 描边：同色 **8%** 底 + **0.86px 同色 24% 描边**（旧 9%+45% 作废）
- **营销** tinted **无描边**：促销红 `rgba(237,57,43,.08)`+`#ED392B` 字；会员金 `#FFF2DF`+`#6A4B1F` 字（旧实心红渐变作废）
- **店铺** 实心白字：自营/官方 `#FF6815`、入驻 `#D38D61`（旧 tinted 描边款作废）
- **商品** 渐变实心白字 10px Semibold：新品 `#FF4F4B→#FF8539` / 爆款 `#FF8A1D→#FFC61D` / 当季 `#13BFEA→#59E4FC`（旧白底角标压图作废，改放信息区）

### 新增
- registry **§4.8 快捷筛选 Tabs** 双变体：白底页（`#F7F8FA` chip / 选中橙 10% 底）/ 灰底页（白 chip / 选中橙 0.5px 描边），h28 r16 gap8，互不可混用
- preamble 新增 `mkFilterTab(text, selected, pageBg, parent)`（28 → 29 helpers）；`mkTag` 重写为语义语法 `mkTag(text,'kind:variant',parent)`，旧 4 参调用兼容保留

### 规则升级：Tabs 底色适配升为硬约束（同日 · 第二轮）
- `SKILL.md` Hard Rules 新增「筛选 Tabs 底色适配」：判定依据是 **chip 所在局部容器底色**（不是整页背景），白底→灰 chip 版，灰底→白 chip 版
- `SKILL.md` 按键组表新增「快捷筛选 Tabs」行 + 独立小节（含双变体表与三条 ❌ 反例）
- `templates/INDEX.md` 新增「通用约束：筛选条随底色换装」；`templates/02-category.md` 补快捷筛选 Tabs 区块（白底变体）与易错点
- `registry §4.8` 补「变体判定规则」表 + 典型归属（分类页/白 sheet→白底变体；灰底列表→灰底变体）

### 按钮组件化 + 禁 icon+文字（同日 · 第三轮，实战反馈）
- registry §4 改题「按键组（Buttons 组件登记）」：新增**尺寸家族表**（标准 106×40 15pt / 通栏 351×44 / 紧凑 121×34、90×34 13pt / 列表卡内加购 ≈56×26 11.5pt）
- **硬约束：按钮内部只有文字，禁止 icon+文字组合**（图标+文字只属于图标按钮组 §4.6，纵向排布）
- preamble `mkBtn` 升级：`mkBtn(text, type, w, h, parent)` 支持紧凑/列表卡款，字号随高度（40h→15pt Semibold，<40h→13pt Medium），旧 4 参调用兼容
- HTML 大促列表页「+ 加购」改为纯文字加购（26h 描边 pill）；mock 空跑新旧签名 + 4 模板回归全绿

### 修正
- `mkTag` 渐变 stops 全部带 alpha（防 GRADIENT_LINEAR 报错）；tinted 描边 0.86px INSIDE

## 2026.11.04 — 终稿对齐 + 页面模板化

来源：Figma「2026 凤凰会商城 UI 交付稿」终稿（file `dR4LTubytIFKA9M4br8dXi`，node `1:789`，23 个画板）

### 新增
- `references/component-registry.md`：组件登记表（标签 6 大类 / 价格 4 步阶 / 按键组 / 导航 / 图标 / 画板清单 / 替换记录）
- `templates/`：8 类页面结构模板 + 5 个可运行代码模板
  - `tpl-home.js`（首页 375×1424）、`tpl-detail.js`（详情 375×1817）、`tpl-cart.js`（购物车 375×1245）、
    `tpl-checkout.js`（确认订单 375×902）、`tpl-sheet.js`（购买弹窗 375×812）
- preamble 新增 4 个 helper：`mkCheck` / `mkStepper` / `mkSeg` / `mkBtn`（23 → 27）
- 新增 token：`placeholder` `#C8C9CC`、`teal` `#00C3D0`、`chipBg` `#FFF6F0`、`segTextOn` `#25211F`、`segTextOff` `#646566`

### 替换（旧 → 新）
| 项 | 旧 | 新 |
|---|---|---|
| 一级文字 `C.t1` | `#333333` | `#262626` |
| 三级文字 `C.t3` | `#999999` | `#969799` |
| 背景 `C.bg` | `#F8F8F8` | `#F2F3F5` |
| 分割线 `C.divColor` | `#EEEEEE` | `#EBEDF0` |
| Tabbar 高 | 50 | 84（50 + 34 安全区） |
| 规格 chip | 实心橙底白字 32h r16 | 描边款 34h r18 12pt |
| 底栏按钮 | 48h / 16pt / 3 类型 | 40h / 15pt / 新增 `outline` |
| Dialog 配色表 | 独立章节 | 并入按键组，正文留指针 |
| `references/components/{name}.md` | 死引用 | 指向 component-registry |
| demo-product-detail 色板 | 蓝色 | 终稿橙 |

### 补充（同日 · 4）— 终稿样式全面对账
- 实读 Figma「预估佣金」标签：**双段胶囊**（左 `#333333`+`#FFE4B9` 奶油字 / 右 `#FFF1DF`+`#111`，h15 r2）→ 新增 `mkDuoTag`
- `mkDialog` 按钮 48h/16pt → 40h/15pt，补 `outline` 类型
- **删除 `scripts/demo-product-detail.js`**（整套旧样式重复实现，被 tpl-detail + preamble 取代）
- `tpl-home` 佣金标签改用 `mkDuoTag`；registry §2 定稿三种标签款式；新增 `C.cream`
- helper 27 → 28

### 补充（同日 · 3）
- `mkTag` plain 款改为 **tinted 浅底**（同色 9% 底 + 45% 描边 + 彩字，r4），对齐需求稿样式；registry §2 同步

### 补充（同日 · 2）
- 修复核销记录页/确认订单模板的**渐变 stops 缺 alpha**（Scripter 直接中断的硬错误）；`scripter-api.md` 新增 Fills/Effects 坑位说明

### 补充（同日）
- `mkTag` 色表新增 `info`（蓝），支持「卡券」类服务标签——同屏标签仍守 2 色约束

### 修复
- `preamble.js` 结尾引用未定义变量 `pg`（原样运行会抛 ReferenceError）→ 改为安全收尾
- 模板中图片未 `pos()` 导致 `appendChild` 后跑出容器（Figma 保绝对坐标）

### 验证
- 46 项内容断言全部通过
- 全部 JS `node --check` 通过
- 5 个代码模板经 figma mock 空跑：0 越界、0 未定位，页面高度与终稿一致

## 更早
- 初始版本：13 步工作流（决策 → 执行 → 验收）、6 个 decision 文档、preamble 23 helpers
