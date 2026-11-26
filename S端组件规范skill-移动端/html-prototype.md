# 可点击 HTML 原型输出规范

> **谁用这份文件**：产品经理 / 业务方。目标不是"生成一张好看的页面图"，而是**交付一个双击就能打开、能在浏览器里点着走完主流程的 HTML**，可以直接拿去评审、给开发看交互、给老板演示。
>
> **和 SKILL.md Step 7C 的关系**：7C 定义"这一页怎么画"（组件真实性、Token 取值、`data-bep-status` 标注）；本文件定义"**多个页面怎么串成一个能点的东西**"。两份都要遵守，7C 管单页，本文件管原型整体。
>
> 这份规范的存在理由：此前的示例（`examples/` 下 5 个）都是**静态单页**——只能看不能点。产品拿去做评审时，"点一下会怎样"永远只能靠嘴说，这是原型最大的失效点。

---

## 0. 开工前：产品侧最小输入

不够这四项就不要开始画，先问清楚（拿不到就先按假设做，并在交付说明里列出假设）：

| 必填 | 说明 | 例 |
|---|---|---|
| **屏幕清单** | 要哪几屏、每屏一句话目的 | 工单列表 / 工单详情 / 处理弹层 |
| **主流程** | 从哪进、经过哪、到哪结束 | 列表 → 点卡片 → 详情 → 处理 → 提交 → Toast → 返回列表 |
| **角色与权限** | 谁在用，能看到什么、不能看到什么 | 保洁领班：只能看本班组工单，无删除权限 |
| **真实数据** | 字段名 + 3–5 条真实业务数据（不要截图糊上去） | 工单编号/点位/问题描述/负责人/时间 |

拿到后按「屏幕清单 → 主流程」画一张**连线图**（文字版即可），确认无断头路再写代码。

---

## 1. 交付形态（硬性）

1. **单文件**：一个 `.html`，CSS 与 JS 内联。不许拆成 `.css`/`.js` 多文件——产品发给别人时最常丢的就是附件。
2. **零依赖**：不引 CDN、不引字体文件、不引图标库、不引框架。断网、内网、微信里打开都必须正常。
3. **双击即开**：`file://` 协议下全部功能可用。凡是依赖 `fetch`/`import`/模块化的写法一律禁止（`file://` 下会被 CORS 拦死）。
4. **手机壳视图**：桌面浏览器打开时，页面居中显示一台 **375×812** 的手机（外框 + 圆角 + 状态栏），背景 `#1B1D21`；手机下方一行小字说明"这一屏叫什么、能点哪里"。
5. **满屏开关**：模板里保留一个"满屏/手机壳"切换按钮，交给产品在投屏时用；正式交付可删。
6. **不做真机适配**：不需要响应式断点。真机看效果不是原型的目标，评审看流程才是。

> 尺寸基准 375×812，所有数值来自 `design-tokens.md` / `component-library.md` 的 `visualRecipe`，**不要在 HTML 里另起一套尺寸**。

---

## 2. 文件与命名

```
<项目名>-prototype.html          ← 主交付物，例如 workorder-prototype.html
<项目名>-flow.md / .png          ← 可选：屏幕连线图（产品自留，便于讲流程）
```

- 放 `examples/` 之外的工作目录，不要覆盖 skill 里的示例。
- 文件名用英文小写 + 连字符，不出现空格、中文、版本号（版本用修改时间管理）。
- 一份原型对应**一个业务场景**；要覆盖两个场景就出两个文件，不要塞成一个巨型 HTML。

---

## 3. Token 层：CSS 变量是唯一真值来源

页面里**禁止出现裸色值/裸尺寸**（`#00B1B4`、`16px` 这类只能出现在 `:root` 或组件类里）。这样产品改一个值就能整站换肤，也方便以后脚本扫描。

```css
:root{
  --brand:#00B1B4; --brand-pressed:#00686A;
  --brand-tint14:rgba(0,177,180,.14);   /* 页面级筛选胶囊选中底 */
  --brand-tint16:rgba(0,177,180,.16);   /* 胶囊 Tab 二级选中底（不用于标签） */
  /* —— 语义标签 Tag：底一律 10%，字取同源实色，五档固定 —— */
  --tag-brand-bg:rgba(0,177,180,.10);   --tag-brand-text:#00B1B4;
  --tag-success-bg:rgba(0,180,42,.10);  --tag-success-text:#00B42A;
  --tag-warning-bg:rgba(255,166,69,.10);--tag-warning-text:#FFA645;
  --tag-danger-bg:rgba(245,63,63,.10);  --tag-danger-text:#F53F3F;
  --tag-neutral-bg:rgba(111,135,158,.10);--tag-neutral-text:#6F879E;
  --text-1:#22262F; --text-2:#444F60; --text-3:#9199A2;
  --line:#EEEEEE; --page-bg:#F7F8FA; --fill-2:#F2F3F5; --card:#FFF;
  --danger:#F53F3F; --warning:#FF7D00; --success:#00B42A;
  --r-card:8px; --r-btn:4px; --r-tag:2px;
  --nav-h:44px; --status-h:44px; --tabbar-h:50px; --safe-b:34px;
  --page-x:16px; --gap:12px;
}
```

**变量命名与 token 的对应关系固定**：`--text-1..3` = `color.text.5/4/3`，`--page-bg` = `color.fill.1`，`--fill-2` = `color.fill.2`，`--brand` = `color.brand.3`，`--tag-*-bg` = `color.brand.tint10` / `color.tag.neutral` 一族，`--tag-warning-text` = `color.tag.warningText`。新增变量必须能在 `design-tokens.md` 找到出处，否则标 `AI_PROPOSED` 并在报告里说明。

字号不建变量（`font-size` 直接用 11/12/14/16/18/20/24 这七档），但**只用这七档**，出现 13/15/17 就是错。

---

## 4. 多屏组织：一屏一 `section`，hash 当路由

```html
<div class="phone">
  <section class="screen" data-screen="list" data-active="true">…</section>
  <section class="screen" data-screen="detail">…</section>
  <div class="mask" data-mask="handle" data-open="false"></div>
  <div class="sheet" data-sheet="handle" data-open="false">…</div>
  <div class="toast" id="toast" data-open="false"></div>
</div>
```

规则：

1. **所有屏幕都写在同一个 DOM 里**，靠 `data-active="true"` 显隐（`opacity + visibility`，带 180ms 位移过渡），不要用 `innerHTML` 整体替换——那样滚动位置和表单输入会丢。
2. **路由用 `location.hash`**：`#list` / `#detail`。切屏时 `history.pushState`，浏览器**后退键天然可用**，演示时不会卡死在一屏。
3. **弹层与 Toast 挂在手机容器里**（`position:absolute` 相对 `.phone`），不要挂 `body`——否则满屏切换时位置会跑。
4. 每屏结构固定为：`状态栏 → 导航栏 → 内容区(唯一滚动容器) → 可选底部操作栏 / 底部 Tab`。内容区之外一律不滚。
5. 屏幕数量 ≤ 8。超过 8 屏说明这份原型该拆成两份，或者你其实在画流程图。

---

## 5. 交互契约（逐条必须实现，缺一即返工）

| # | 元素 | 行为 | 验收方式 |
|---|---|---|---|
| 1 | 列表卡片 | 点击进详情，且**详情内容跟着走**（不是写死的假详情） | 点第 2 张卡，详情标题应等于第 2 张卡的标题 |
| 2 | 返回 | 返回上一屏，再点浏览器后退键不崩 | 进出 3 次后按后退键，停在合理屏幕 |
| 3 | 底部 Tab | 每项都能切到对应屏，选中态跟着变 | 两个 Tab 来回切 5 次无残留高亮 |
| 4 | 一级文字 Tab / 分段 | 切换选中态 + 下方内容随之变化 | 切到第 2 个 Tab 时内容必须变 |
| 5 | 筛选胶囊 | 选中 = 14% tint 底 + 品牌色字；切换后列表数据变化 | 切到"已完成"应见空态（若无数据） |
| 6 | 底部弹层 | 按钮打开 → 遮罩/取消/ESC 三种方式都能关 | 三种关法各试一次 |
| 7 | 弹层内选项 | 单选互斥、可再次点击切换 | 选 A 再选 B，A 应取消 |
| 8 | 提交类按钮 | 未选必填项 → Toast 提示；已选 → 关闭弹层 + Toast 成功 | 不选直接提交必须有提示，不能静默 |
| 9 | Toast | 2 秒自动消失，连续触发不叠加 | 连点 3 次，只留最后一条 |
| 10 | 输入框 | 能真打字、有 placeholder、聚焦时不跳版 | 输入 20 个字看是否溢出 |
| 11 | 开关 / 单选 / 复选 | 能切态，视觉按 visualRecipe | 逐项点一遍 |
| 12 | 所有可点元素 | **无死链**：每个 `cursor:pointer` 的元素都有反馈（跳转/弹层/Toast/态变化） | 盲点 10 处，不能有"点了没反应" |

> 第 12 条是最容易被放过的一条。做不到就**别加**这个可点元素——半成品按钮比没有按钮更伤评审。

**实现方式统一走事件代理**（一个 `document.addEventListener('click')` 按 `data-*` 分发），不要给每个元素绑 `onclick`，屏幕一多必乱。

**统一属性约定**（便于产品自查、也便于以后脚本扫描）：

| 属性 | 含义 |
|---|---|
| `data-screen="id"` | 屏幕标识 |
| `data-screen-go="id"` | 点击跳到某屏 |
| `data-back` | 返回上一屏 |
| `data-sheet-open / -close="id"` | 打开/关闭弹层 |
| `data-mask="id"` | 遮罩，点它关闭对应弹层 |
| `data-toast="文案"` | 点了只弹 Toast（功能未实现时用它，别留死链） |
| `data-order / data-id` | 业务数据主键 |

---

## 6. 状态覆盖（不止画正常态）

同一屏至少准备这几态，用一个"切态"开关或筛选条件触达，让评审能看到：

| 状态 | 必须做 | 触达方式（示例） |
|---|---|---|
| 正常 | 是 | 默认 |
| **空态** | 是（列表页必须有） | 筛选到无数据的分类 |
| 加载中 | 可选（有异步感才要） | 顶部骨架/转圈，2s 后出数据 |
| 错误/失败 | 可选 | 一个"模拟失败"开关 |
| 禁用 | 是（若有禁用态按钮） | 表单未填完时的提交按钮 |
| 长文本 | 是 | mock 数据里至少 1 条超长标题/描述，看截断是否正常 |
| 超长列表 | 是 | 至少 8 条数据看滚动与底部栏是否打架 |

> 空态文案要有信息量（说明为什么空、下一步做什么），不要只写"暂无数据"。

---

## 7. 数据规范
**插画 / 缺省页资产（2026-11-05 补）**：空状态等位图插画**禁止外链**——Figma 图片链接带登录态且会过期，第三方图床也不允许。两种合法取法：

1. **首选**：用 Dev Mode MCP `get_image` 按组件 nodeId 导出 PNG（空状态 8 张插画 nodeId 见 `component-registry.json` → 空状态 → `visualRecipe.variantMap`），转 base64 内嵌 `data:image/png;base64,...`；
2. 让设计在 Figma 手动 Export PNG/SVG 后交给你，同样 base64 内嵌。

⚠️ **白底陷阱**：Figma 导出的 PNG 自带不透明白底（instance 框架底色被烘焙），贴到 #F7F8FA 页面上就是一块白色方块。内嵌前必须抠白底成透明——从图片四边做白色连通域（min(rgb)≥244）置 alpha=0，保留插画内部被轮廓包住的白色；页面底色接近白，1px 抗锯齿边无需羽化。

插画规格实测：225×195，居中；插画→16→标题(16/500/lh24)→8→描述(14/lh24/#9199A2，≤2行)→16→可选按钮。完整示例见 `examples/empty-states/index.html`；8 场景全览见 `examples/empty-states/all-states.html`。

**插画 / 缺省页资产（2026-11-05 补）**：空状态等位图插画**禁止外链**——Figma 图片链接带登录态且会过期，第三方图床也不允许。两种合法取法：

1. **首选**：用 Dev Mode MCP `get_image` 按组件 nodeId 导出 PNG（空状态 8 张插画 nodeId 见 `component-registry.json` → 空状态 → `visualRecipe.variantMap`），转 base64 内嵌 `data:image/png;base64,...`；
2. 让设计在 Figma 手动 Export PNG/SVG 后交给你，同样 base64 内嵌。

⚠️ **白底陷阱**：Figma 导出的 PNG 自带不透明白底（instance 框架底色被烘焙），贴到 #F7F8FA 页面上就是一块白色方块。内嵌前必须抠白底成透明——从图片四边做白色连通域（min(rgb)≥244）置 alpha=0，保留插画内部被轮廓包住的白色；页面底色接近白，1px 抗锯齿边无需羽化。

插画规格实测：225×195，居中；插画→16→标题(16/500/lh24)→8→描述(14/lh24/#9199A2，≤2行)→16→可选按钮。完整示例见 `examples/empty-states/index.html`；8 场景全览见 `examples/empty-states/all-states.html`。


- mock 数据**写在 `<script>` 最上方的常量里**，产品能直接改文案重开就看到效果。不要把数据写死在 HTML 标签里。
- 文案必须是真实业务语言：`公区-4栋-单元门`、`单元门口积水且有白色垃圾`。**禁止** `示例`、`标题文字`、`xxxx`、`Lorem ipsum`、`测试数据1`（约束 C-55）。
- 每条数据字段齐全，且**详情页显示的就是列表里那条**——不能列表用一套假数据、详情另写一套。
- 金额/时间/编号按业务真实格式：`WB20231o28-00000001`、`08-12 16:00`。
- 数字类指标要能被"看见变化"：改 mock 数字 → 页面数字跟着变，不要写死成装饰。

---

## 8. 禁止清单

| 禁止 | 原因 |
|---|---|
| CDN / 外链字体 / 外链图片 | 内网、断网、微信里全挂；且评审时图裂 |
| React/Vue/构建工具 | 产品打不开，也没法改 |
| `alert()` / `confirm()` | 浏览器原生弹窗破坏原型观感，用自绘 Toast/弹层 |
| 外部图片（`<img src="http...">`） | 用内联 SVG / CSS 渐变占位，并标 `data-placeholder="true"` |
| 死链按钮 | 见交互契约第 12 条 |
| `target="_blank"` 跳出 | 原型不出手机壳 |
| 自动播放音视频 / 长动画 | 评审场景干扰 |
| 直接写裸色值、裸圆角 | 见第 3 节 |
| 复制粘贴式"假组件"（把 Input 拉高冒充 Textarea 等） | 见 SKILL.md 7C 硬性红线，`data-bep-status` 必须诚实 |

---

## 9. 组件 → HTML 配方速查

只列原型里最高频的六个，细节值以 `component-library.md` §6 的 `visualRecipe` 为准。

### 9.1 筛选胶囊（页面级，注意不是 Tag）
```html
<button class="chip" aria-selected="true">待处理</button>
```
```css
.chip{height:32px;padding:0 12px;border-radius:21px;background:var(--fill-2);
      color:var(--text-2);font-size:14px;display:inline-flex;align-items:center;border:0}
.chip[aria-selected="true"]{background:var(--brand-tint14);color:var(--brand);font-weight:500}
```
> 选中是 **14% tint**，不是实心品牌色（约束 C-68）。实心品牌色是语义 Tag 的用法。

### 9.1b 语义标签 Tag（行内普通标签 + 卡片角标）

**这是最容易画错的一个组件**：底色必须 10%、必须与文字同色相、中性档必须是石板灰而不是灰底黑字。

```html
<!-- 行内普通标签：跟标题同行，不脱离文档流 -->
<span class="tag tag-brand">进行中</span>
<span class="tag tag-neutral">未开始</span>

<!-- 卡片角标：绝对定位贴右上角 -->
<div class="card" style="position:relative">
  <span class="tag-badge tag-danger">超时</span>
</div>
```

```css
/* 行内标签：h22（大字14）/ h20（小字12），圆角2，左右8，上下2 */
.tag{display:inline-flex;align-items:center;justify-content:center;
     height:20px;padding:2px 8px;border-radius:var(--r-tag);
     font-size:12px;line-height:1;white-space:nowrap}
.tag-brand  {background:var(--tag-brand-bg);  color:var(--tag-brand-text)}
.tag-success{background:var(--tag-success-bg);color:var(--tag-success-text)}
.tag-warning{background:var(--tag-warning-bg);color:var(--tag-warning-text)}
.tag-danger {background:var(--tag-danger-bg); color:var(--tag-danger-text)}
.tag-neutral{background:var(--tag-neutral-bg);color:var(--tag-neutral-text)}

/* 卡片角标：h27，p4-8，只在右上+左下各 8px 圆角 */
.tag-badge{position:absolute;top:0;right:0;height:27px;padding:4px 8px;
           border-radius:0 var(--r-card) 0 var(--r-card);
           font-size:12px;line-height:1;display:inline-flex;align-items:center}
.tag-badge.tag-danger{background:var(--tag-danger-bg);color:var(--tag-danger-text)}
```

**五个易错点**：

1. **底色 10%，不是 16%、不是 20%**。写 16% 会明显偏重，用户一眼看出"颜色不对"。
2. **底和字必须同色相**：`rgba(255,166,69,.10)` 配 `#FFA645`，不能配 `#FF7D00`（不同色相，看着像标签里有两种黄）。
3. **中性档不是"灰底黑字"**：用 `rgba(111,135,158,.10)` + `#6F879E`。`#F2F3F5` + `#444F60` 看着像禁用按钮。
4. **角标不是四角统一小圆角**：是 `0 8px 0 8px`，贴着卡片右上角"嵌"进去。四角都 2px 会像浮在卡片外面的贴纸。
5. **标签不可点击**。需要点的是胶囊（chip / tab），别把标签做成按钮手感。

### 9.2 卡片（列表项 / 详情子条目共用一套）
```
白底 r8，内部 px16 pt16 pb12，层间 gap8
角标行（位置 14 灰 … 状态 Tag 右）→ 标题 18 Semibold → 描述 14 灰 leading-22 两行截断
→ kv 行（label 14 灰 + value 14 深）→ 操作行（.5px 分隔线 + 左常规 + 右品牌色带 ›）
```

### 9.3 分节（详情页骨架）
节头 `height:60px;padding:0 16px;font-size:16px;font-weight:600`，右侧辅助字 14 灰；节内容 `padding:0 16px 20px`。**h60 是节奏锚点**，不要用 48/56。

### 9.4 卡中卡
白卡内再包一层 `background:var(--page-bg);border-radius:8px;padding:12px`。不要把 kv 裸排在白底上，也不要再套白卡。

### 9.5 底部弹层
遮罩 `rgba(0,0,0,.6)` + 面板 `白底，border-radius:12px 12px 0 0`，标题行三段式（左操作 16 品牌色 / 中标题 18 Medium / 右操作），`transform:translateY(100%) → 0` 240ms。

### 9.6 Toast
`background:rgba(0,0,0,.8);color:#fff;font-size:14px;border-radius:8px;padding:10px 16px`，居中，2s 自动收。

---

## 9b. 实现陷阱（2026-11-04 实测补）

- **`<dl>`/`<p>`/`<ul>` 的浏览器默认 margin 不会被 flex 布局重置**——kv 行写 `line-height:24 + gap:4` 再叠上 `dl` 默认的 `margin:16px 0`，行距会从设计值 36px 撑到 60px。凡用 `dl/dt/dd` 排 kv，**必须显式 `margin:0`**，且行高用固定 `height` 而不是靠 line-height 顶。
- 自查方法：数值不对时先看是不是默认样式没清（margin/line-height/font），再怀疑自己量错了设计稿。

## 10. 交付说明模板（每次输出必须附）

```markdown
## 怎么打开
双击 <文件名>.html（Chrome / Safari / Edge 均可，无需联网）

## 这一版能点通什么
1. 列表 → 点任意卡片 → 详情（详情内容跟随卡片变化）
2. 详情底部「处理工单」→ 弹层 → 选一项 → 提交 → Toast → 自动回列表
3. 顶部胶囊筛选：待处理 / 处理中 / 已完成（已完成为空态）
4. 底部 Tab：工单 ↔ 我的，可来回切
5. 浏览器后退键可回上一屏

## 这一版没做（别当成 bug）
- 搜索、筛选弹层（点击给"功能待开发"提示）
- 图片上传（用占位块表示）
- 真机适配（只按 375×812 设计）

## 需要你确认的假设
- 提交后是否需要留在详情页（当前是回列表 + Toast）
```

**"没做"和"假设"两段不能省**——产品评审时最容易被问"这里点了怎么没反应"，提前写清楚比现场解释有效。

---

## 11. 验收清单（产品 10 秒自查）

```
[ ] 双击能开，无白屏、无报错（控制台干净）
[ ] 断网状态下依然完整可用
[ ] 手机壳居中，375×812，无横向滚动条
[ ] 主流程从头点到尾不断链
[ ] 每张卡片点进去，详情内容不一样
[ ] 每个可点元素都有反馈，无死链
[ ] 列表页能切到空态
[ ] 弹层能用遮罩/取消/ESC 三种方式关闭
[ ] 文案无「示例/xxxx/占位」
[ ] 页面里没有裸色值（搜索 # 能对上 :root 里的定义）
[ ] 交付说明里写了「能点通什么 / 没做什么 / 假设了什么」
```

---

## 12. 和静态示例的区别（为什么另起一套规范）

`examples/` 下 5 个旧示例是**单页视觉稿**：一个 `index.html` + 一个 `styles.css`，只能看。它们证明了"组件画得对不对"，但证明不了"流程走得通"。

本规范产出的是**原型**：单文件、多屏、可点、有状态。两者不互相替代——
- 要评审"这一屏长得对不对"→ 看旧示例那种视觉稿；
- 要评审"用户走这条路顺不顺"→ 用本规范的可点击原型。

参考实现：`examples/clickable-prototype/index.html`（工单列表 → 详情 → 弹层 → Toast，含 Tab 切换与空态，全部交互契约逐条实现，可直接改 mock 数据复用）。
