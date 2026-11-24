# BEP-S 设计 Token

> **本文件所有数值均于 2026-11 从 Figma 组件库「BeP移动端组件-S端」（fileKey `vIpu7tb1dguui3QuqYETtM`）通过 Dev Mode MCP 逐画板重新读取核对。**
> 组件生成时的颜色/字号/间距/圆角/阴影/Icon 数值只能从这里取，不允许自创。
> 每条标注来源：`FOUND_IN_FIGMA`（画板实体读值）/ `USER_OVERRIDE`（用户直接指定，覆盖画板）/ `INFERRED`（有依据反推）/ `NOT_DEFINED`（库内缺口，禁止假装存在）。

## Token 可信度使用规则（不可协商）

| 等级 | 能不能当正式设计依据 | 使用方式 |
|---|---|---|
| `FOUND_IN_FIGMA` | 能，直接用 | 正常写入生成结果，无需额外声明 |
| `USER_OVERRIDE` | 能，且优先级高于画板 | 直接用，不要"因为画板是别的值"而改回去 |
| `INFERRED` | 不能当正式 Token，只能当建议值 | 必须原文说明"这是推算值，不是库里明文定义" |
| `NOT_DEFINED` | 禁止发明"官方 Token"填补 | 必须给值时标 `AI_PROPOSED`，并写明"AI 建议值，非设计系统规范" |

---

## 1. Color Token

来源：色彩画板 `1549:6462`。**该文件未绑定 Figma Variables**（`get_variable_defs` 返回空），所有色值为静态 Paint，按静态 Token 使用，不要假设存在可引用的 Variable。

### 1.1 品牌色

| Token | 值 | 状态 | 用法 |
|---|---|---|---|
| `color.brand.1` | #00B1B4 @6%（≈ #F0FAFB） | `USER_OVERRIDE` | 浅品牌底：选中项浅底、信息提示卡、次级按钮底 |
| `color.brand.2` | #00B1B4 @40% | `USER_OVERRIDE` | 一般界面强调、进度条底 |
| `color.brand.3` | **#00B1B4** | `USER_OVERRIDE` | 品牌主色：主按钮、选中文字/图标、链接 |
| `color.brand.4` | #00686A | `USER_OVERRIDE` | 点击态：主按钮按下 |
| `color.brand.disabled` | rgba(0,177,180,0.40) | `FOUND_IN_FIGMA` | 主按钮禁用底 |
| `color.brand.tint16` | rgba(0,177,180,0.16) | `FOUND_IN_FIGMA` | 选中态浅底（胶囊 Tab 二级、轻量选中块）——**不用于标签** |
| `color.brand.tint10` | rgba(0,177,180,0.10) | `FOUND_IN_DRAFT` | **语义标签**品牌态底 |
| `color.brand.soft` | #F0F6F9 | `FOUND_IN_FIGMA` | 辅助按钮默认底 |
| `color.brand.softActive` | #9AC5D8 | `FOUND_IN_FIGMA` | 辅助按钮点击/线框禁用描边 |

> 原 Figma 读值 `#006D9B` 存档于 `design-tokens.json` 的 `originalFigmaValue`。库内仍有少量图层残留旧色（如 `rgba(0,109,155,0.16)`），**按 `#00B1B4` 同法换算使用**，不要照抄旧色。

### 1.2 辅色与语义色

| Token | Hex | 说明 |
|---|---|---|
| `color.auxiliary.6` | #00B42A | 麦苗绿 |
| `color.auxiliary.3` | #4584FF | 鸢尾蓝 |
| `color.auxiliary.2` | #FFCA3E | 鸡蛋黄 |
| `color.auxiliary.1` | #FF7D00 | 海棠橙 |
| `color.auxiliary.red` | #F53F3F | 番茄红 |
| `color.success.6` | #19CC2C | 成功·常规 |
| `color.success.1` | #E8FFEA | 成功·浅底 |
| `color.warning.6` | #FF8000 | 警告·常规 |
| `color.warning.1` | #FFF7E8 | 警告·浅底 |
| `color.danger.6` | #FF3636 | 错误·常规 |
| `color.danger.1` | #FFECE8 | 错误·浅底 |
| `color.danger.7` | #CB2634 | 错误·点击 |

> **浅底统一规则（2026-11-05 依真实设计稿 18 处实测更正，取代原"一律 16%"）**：三种浅底按用途分开，**不要混用同一档**——

| 用途 | 透明度 | 依据 |
|---|---|---|
| **语义标签 Tag 底** | **10%** `rgba(r,g,b,0.10)` | 设计稿 11 屏 18 处标签实测，`FOUND_IN_DRAFT` |
| 胶囊 Tab 二级选中底 / 轻量选中块 | 16% `rgba(r,g,b,0.16)` | 组件库画板，`FOUND_IN_FIGMA` |
| 页面级筛选胶囊选中底 | 14% `rgba(0,177,180,0.14)` | 设计稿实测，`FOUND_IN_DRAFT` |
| 品牌极浅底（brand.1） | 6%（`#F0FAFB` 近似） | 组件库画板 |

**语义标签配色表（10% 底 + 同源主色字，实测取值）**：

| 语义 | 底 | 字 |
|---|---|---|
| 品牌/进行中 | `rgba(0,177,180,0.10)` | `#00B1B4` |
| 成功/已完成 | `rgba(0,180,42,0.10)` | `#00B42A` |
| 警告/待处理 | `rgba(255,166,69,0.10)` | `#FFA645` |
| 错误/异常 | `rgba(245,63,63,0.10)` | `#F53F3F` |
| **中性/未开始·已结束** | `rgba(111,135,158,0.10)` | **`#6F879E`**（石板灰，不是 `#F2F3F5`+黑字） |

> ⚠️ 中性标签以前记成"灰底 `#F2F3F5` + 深灰字 `#444F60`"，实测是**石板灰 10% 底 + 石板灰字**，视觉上更轻、更不像"按钮"。

### 1.3 中性色

| Token | Hex | 说明 |
|---|---|---|
| `color.text.5` | #22262F | 正文标题（最常用） |
| `color.text.4` | #444F60 | 次强调正文 / 图标默认 |
| `color.text.3` | #9199A2 | 次要信息 / 描述 / 占位 |
| `color.text.2` | #CCCFD6 | 提示信息 / 禁用文字 |
| `color.line.1` | #EEEEEE | 分割线（0.5px） |
| `color.fill.1` | #F7F8FA | 页面底色（新页面一律用这个，见下方冲突说明） |
| `color.fill.2` | #F2F3F5 | 常规填充 / 未选中胶囊 / 上传占位底 |
| `color.fill.3` | #E5E8EB | 深灰底 |
| `color.fill.4` | #C9CDD4 | 重灰 / 未选中控件描边 |
| `color.white` | #FFFFFF | 卡片、导航、输入框底 |

> ⚠️ **页面底色冲突（2026-11-03 登记为冲突 #6，见 `design-system-conflicts.json`）**：真实设计稿（品质巡检 43 屏中 9 屏）页面底色用 **#F2F3F5**（= `fill.2`），仅 2 屏用 #F7F8FA；组件库规范是 #F7F8FA。按"组件库规范优先"取 **#F7F8FA**；#F2F3F5 只认知为"存量页面底色"，不要从旧稿回抄。另：真实稿正文灰实际混用 `#6F879E`（次强调档），新页面收敛到 `text.4 #444F60`，不要扩散第四种灰。

---

## 2. Typography Token

| Token | 值 | 状态 |
|---|---|---|
| `font.family.zh` | 思源黑体 Source Han Sans（Android）／PingFang SC（iOS） | `FOUND_IN_FIGMA` |
| `font.weight` | Regular / Medium / Semibold | `FOUND_IN_FIGMA` |
| `font.size` | 11 / 12 / 14 / 15 / 16 / 17 / 18 / 20 / 22 / 24 (px) | `FOUND_IN_FIGMA` |
| `font.size.careMode` | 20 / 22 / 24 / 26 / 30 / 32 / 36 (px) | `FOUND_IN_FIGMA` |
| `font.lineHeight.ratio` | **×1.4**（画板图层实际行高，如 18→25.2、24→33.6、100→140） | `FOUND_IN_FIGMA` |

> ⚠️ **行高修正（2026-11 复核）**：画板注释文字写"1.5倍"，但图层真实 lineHeight 一律为 **140%**（`leading-[25.2px]` / `33.6px` / `140`）。以渲染实值为准，**用 ×1.4**。历史 skill 记录的 ×1.5 作废。
>
> ⚠️ **行高二次修正（2026-11-03，真实设计稿实读补充）**：×1.4 来自组件库标注类长文；真实页面的行高按**场景配对**落值（来源：品质巡检设计稿 12 屏逐节点统计，`FOUND_IN_DRAFT`）——
>
> | 场景 | 配对 | 依据 |
> |---|---|---|
> | 单行控件（label / 按钮 / Cell / kv 行） | 行高 ≈ 字号（16→16、18→18） | n=12，占单行样本多数 |
> | 多行正文 / 描述 | **14→22（×1.57）** | n=16，最高频配对 |
> | 16px 段落 | 16→20 或 16→22 | n=8 |
> | 长文 / 标注类 | ×1.4（18→25.2 等） | 组件库实读 |
>
> 列表、卡片、详情页场景按前两行配对；**只有长文排版用 ×1.4**。旧记录"一律 ×1.4"已修正。

### 2.1 字号用途速查（画板标注原文）

| 字号 | 用途 |
|---|---|
| 24px | 页面大标题 / 模块标题 |
| 22px | 特殊强调数字 |
| 20px | 弹窗标题 |
| 18px | 页面标题、卡片标题、正文常用字号、商品名称 |
| 17px | 次级正文 |
| 16px | 正文、标签栏、胶囊 Tab、导航标题辅助 |
| 15px | 辅助正文、按钮小字 |
| 14px | 描述文案、标签、底部导航文字 |
| 12px | 弱提示、角标、小标签 |
| 11px | 极小注脚 |

> 当前 Figma MCP 运行环境无 PingFang SC，实际写入用 **Noto Sans SC**（与 Source Han Sans 同源等效；无 Semibold 时用 Medium 顶替）。

---

## 3. Spacing Token

设计基准：**375 × 812**。

| Token | 值 | 状态 | 说明 |
|---|---|---|---|
| `spacing.page.marginX` | 16px | `FOUND_IN_FIGMA` | 左右边距 |
| `spacing.module.gap` | 12px | `FOUND_IN_FIGMA` | 上下模块间距 |
| `spacing.statusbar.height` | 44px | `FOUND_IN_FIGMA` | 状态栏 |
| `spacing.navbar.height` | 44px | `FOUND_IN_FIGMA` | 顶部导航栏（不含状态栏） |
| `spacing.tabbar.height` | **50px** | `FOUND_IN_FIGMA` | 底部导航内容区（iPhone 678） |
| `spacing.tabbar.heightWithSafeArea` | **84px** | `FOUND_IN_FIGMA` | 底部导航 + 34 安全区（iPhone X 及之后） |
| `spacing.safeArea.bottom` | 34px | `FOUND_IN_FIGMA` | 底部安全区 |
| `spacing.kv.row` | **28px** | `FOUND_IN_DRAFT` | KV 信息块字段行高（配合 gap 8，行距 36） |
| `spacing.kv.gap` | 8px | `FOUND_IN_DRAFT` | KV 信息块字段行间距 |
| `spacing.kv.labelGap` | 12px | `FOUND_IN_DRAFT` | KV 标签列与值的间距 |
| `spacing.kv.labelWidth` | 76px | `FOUND_IN_DRAFT` | KV 标签列固定宽 |
| `spacing.kvbox.paddingY` | 12px | `FOUND_IN_DRAFT` | KV 灰块上下内边距（左右为 16） |

> ⚠️ **冲突记录**：间距画板注释写"底部导航 56px"，但底部导航画板真实组件为 **375×50**（iPhone 678）/ **375×84**（iPhone X，含 34 安全区）。按"组件实现优先于页面规范"取 **50/84**。详见 `design-system-conflicts.json`。

---

## 4. Radius Token

| Token | 值 | 状态 | 适用 |
|---|---|---|---|
| `radius.card` | **8px** | `FOUND_IN_FIGMA` | 卡片、对话框、面板容器 |
| `radius.button` | 4px | `FOUND_IN_FIGMA` | 按钮、输入框内小件、小色块 |
| `radius.tag` | 2px | `FOUND_IN_FIGMA` | 标签 Tag |
| `radius.input` | 6px | `FOUND_IN_FIGMA` | 输入框内容框（画板 `09_输入框` 读值） |
| `radius.pill` | 高度 ÷ 2 | `FOUND_IN_FIGMA` | 胶囊按钮（h48→24，画板示例 r20 为 h40 胶囊）、胶囊 Tab（h38→21、h32→21） |

> 卡片圆角统一 **8px**（用户 2026-11 确认，覆盖历史 skill 的 6px 记录）。

---

## 5. Shadow / Line Token

| Token | 值 | 状态 |
|---|---|---|
| `shadow.card` | x:0 y:2 blur:4 #02192A 10% | `FOUND_IN_FIGMA`（投影画板 `107:4826`） |
| `border.hairline` | 0.5px #EEEEEE | `FOUND_IN_FIGMA`（分割线） |
| `border.outline` | 0.5px #00B1B4 | `FOUND_IN_FIGMA`（线框按钮描边） |
| `overlay.mask` | rgba(0,0,0,0.60) | `FOUND_IN_FIGMA`（对话框/弹出层遮罩） |

> **默认不加投影、不加描边**（用户 2026-08 两次确认）：卡片靠白色与 `color.fill.1` 的色差区隔。`shadow.card` 只在用户明确要求"要投影"时使用。

---

## 6. Icon Token

| Token | 值 | 状态 |
|---|---|---|
| `icon.size.default` | 24px | `FOUND_IN_FIGMA` |
| `icon.size.small` | 16px | `FOUND_IN_FIGMA`（单元格/标签内） |
| `icon.size.tabbar` | 24px | `FOUND_IN_FIGMA`（底部导航图标） |
| `icon.size.uploadType` | 30px | `FOUND_IN_FIGMA` |
| `icon.size.grid` | 34px | `FOUND_IN_FIGMA`（宫格 icon 切片 34×34） |
| `icon.size.avatar` | 24 / 48 / 64px | `FOUND_IN_FIGMA` |
| `icon.asset.source` | 组件库 `控件` 页 87 个 `icon/移动端-*` symbol | `FOUND_IN_FIGMA` |
| `icon.badge.dot` | 8px | `FOUND_IN_FIGMA` |

> **图标颜色规则**：跟语境语义色走，不要无脑套 `color.text.5`。语义容器内（danger/warning/brand 底）用对应语义色；中性场景按视觉权重选 `color.text.5 / .4 / .3`。

> **图标来源**：优先用组件库 `控件` 页的真实 icon symbol 清单（见 `icon-library.md`），库里没有的再按 24×24 网格手绘，禁止拉大/改色复用不相关图标冒充。

---

## 7. 尺寸速查（组件级，全部 `FOUND_IN_FIGMA`）

| 组件 | 尺寸 | 备注 |
|---|---|---|
| 状态栏 | 375 × 44 | 含时间/信号/电池 |
| 导航栏 | 375 × 44 | 不含状态栏；含状态栏 88 |
| 底部导航 | 375 × 50 / 84 | 84 含 34 安全区 |
| 单元格 Cell | 375 × **60** | 多行/描述型 90；带大段说明 94 |
| 输入框 | 375 × **60** | 内容框圆角 6 |
| 按钮 | 高 **48**，最小宽 **96** | radius 4；胶囊 r24 |
| 小按钮 | 高 32 | 文字 14 |
| 标签 Tag | 高 **22**（大）/ 20（小） | radius 2；大标签 14px 字，小标签 12px |
| 搜索栏 | 高 **36** | 全圆角胶囊 r18；白底或 `fill.2` 底 |
| 开关 | 52 × 28 | 圆角 14；4 态 |
| 单/多选框行 | 高 48（列表行 60） | 图标 26×26，圆点/方框 |
| 步进器 | 高 32 | 左右按钮 + 中间数值 |
| 对话框 | 最小高 148，宽 内容宽-64 | radius 8，默认带遮罩 |
| 弹出层 | 最小高 272，最高不超内容区 80% | 底部弹出 |
| 轻提示 Toast | 高 38 | radius 4，文案 ≤16 字，距边最小 16 |
| 宫格单元 | 75 × 84（无二级）/ 75 × 106（带二级） | icon 34×34 |
| 折叠面板标题行 | 高 60（大号 112） | 内容 14px/行高22 |
| 下拉菜单行 | 高 48 | 最多 4 项 |
| 分类选择行 | 高 52 | 面板 r4，宽 = 屏宽−32 |
| 日历日期单元 | 30 × 30 | 面板 r8，整体高约 424 |
| 时间轴节点 | 36（大号 48） | 连接线 0.5px |
| 步骤条圆点 | 20 | 连接线 0.5px |
| 图片全屏预览 | 顶栏 48 | 展示区 = 屏高 − 48 |
| 气泡 Popover | 内边距 8/12，箭头 8 | r4 |
| 走马灯指示点 | 8 | 卡片 r6 |

---

## 8. 历史缺口现状（2026-11 复核后）

原 skill 标为 `NOT_DEFINED` 的字段，本次已补齐为 `FOUND_IN_FIGMA`：

| 字段 | 旧状态 | 新状态 | 值 |
|---|---|---|---|
| `cell.height` | NOT_DEFINED | `FOUND_IN_FIGMA` | 60px |
| `input.height` | NOT_DEFINED | `FOUND_IN_FIGMA` | 60px |
| `tab.contentHeight` | NOT_DEFINED | `FOUND_IN_FIGMA` | 一级 42 / 胶囊 38 / 二级胶囊 32 |
| `font.lineHeight.px` | NOT_DEFINED | `FOUND_IN_FIGMA` | 字号 × 1.4 |
| `spacing.contentTop` | NOT_DEFINED | `FOUND_IN_FIGMA` | 12px（导航下方首个模块） |
| `tapTarget.minSize` | NOT_DEFINED | `INFERRED` | 44×44（沿用 iOS HIG，库内无明文） |

仍未定义、需要标 `AI_PROPOSED` 的：Textarea 多行文本高度（库内无此组件）。

---

## 9. 复核覆盖率（如实记录）

| 项 | 数量 | 状态 |
|---|---|---|
| 基础规范页顶层画板 | 46 | 成功读取 44 |
| 读取失败 | 2 | `138:4624 日期选择器`（design_context 超时，尺寸按同族选择器口径推，标 `INFERRED`）；`296:5317 表单`（节点已不存在，改用 `417:5612`） |
| 控件页 symbol | 87 | 已取名称+尺寸清单；图标类归 `icon-library`，组件类（按钮/导航栏/标签栏/开关/分割线/宫格）已在对应规范画板逐个读样式 |
| registry 组件 | 39 | 39 个全部有 `visualRecipe` |

> 覆盖率本身也写进 `component-registry.json` 的 `coverage` 字段，便于以后核对"哪些是真读的、哪些是推的"。
