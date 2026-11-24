# BEP-S UI Design Skill — 给同事的说明

这是一份 Claude Code Skill，用来在 BEP-S 移动端设计体系约束下自动生成/审计页面设计。这份 README 是写给**人看的**（同事你），不是给 AI 看的——AI 实际读取的入口是 [SKILL.md](SKILL.md)，两者分开是有意的：SKILL.md 要保持精炼给 AI 执行，这里放的是背景、心智模型和使用建议。

## 这是什么，能干什么

一句话：**告诉 Claude "生成一个XX页面"，它会自动去查一套已经从 BEP-S 真实 Figma 组件库里核实过的数据，判断该用哪些真实组件、哪些组件库里根本没有，然后产出 HTML+CSS（可以直接浏览器打开看效果），并且诚实报告"这里面多少是真的、多少是我推测的"。**

它解决的核心问题是：以前让 AI "照着设计规范做页面"，AI 经常会编——编一个视觉相似但库里根本没有的组件出来，或者把自己猜的间距/颜色说成是"设计规范"。这份 Skill 的所有规则本质上都是在堵这类漏洞。

## 快速上手

直接跟 Claude 说类似的话就会触发：

- "生成一个XX申请页面"
- "帮我做一个订单列表页"
- "按照这个原型截图，用 BEP-S 的规范给我出一版设计"
- "在画布上出一版移动端设计稿"（走 Ardot 分支）

**2026-11 起，所有数值都来自组件库全量复核**：每个核心组件在 `component-registry.json` 里都有 `visualRecipe`（尺寸/圆角/填充/字级/状态/规则），AI 直接照配方落值，不再"凭经验推断"。这也是这次改版的核心——之前的问题不是规则不够多，而是关键数值不够精确到能直接落成像素。

**默认不需要 Figma 权限/额度**——所有已验证的组件和 Token 数据都固化在本目录的 JSON 文件里了，日常生成页面不会去调用 Figma。只有 Registry 里查不到的新组件、或者你明确要求"去 Figma 里核实一下"/"写入 Figma"时，才会用到 Figma MCP。

## 目录结构

```
bep-s-ui-design/
├── SKILL.md                          AI 的入口文件，核心原则 + 12步生成流程
├── README.md                         就是你在看的这份
├── CHANGELOG.md                      这个 Skill 是怎么一步步被测出来、改出来的
│
├── 数据层（结构化 JSON，AI 生成页面时直接查这些）
│   ├── component-registry.json       38+个组件的真实性数据库（状态/尺寸/状态/变体/fallback）
│   ├── design-tokens.json            颜色/字号/间距/圆角/阴影/Icon Token
│   ├── missing-components.json       已确认"库里没有"的组件缺口清单
│   ├── design-system-conflicts.json  规范文档 vs 真实组件实现打架的记录
│   ├── interaction-adaptive-tokens.json  点击热区/交互状态/动效/自适应（外部标准，非BEP-S原生）
│   ├── icon-library.json             真实开源图标库(Ant Design Icons)的SVG路径数据
│   └── page.schema.json              预留给未来 Figma Plugin 的输出结构定义
│
├── 推理层（.md，解释"为什么"，人和 AI 都能读）
│   ├── component-library.md          组件命名消歧、SPEC_FRAME处理规则、逐组件决策规则
│   ├── mobile-ui-rules.md            移动端基础规范（尺寸/间距/点击区域等），逐项标来源
│   ├── design-tokens.md              跟 design-tokens.json 数据一致，多叙述性说明
│   ├── page-patterns.md              8种页面模板 + 实测页面范式（2026-11 从品质巡检真实设计稿反推：5范式/卡片解剖/9条规律，数值级）
│   ├── visual-design-reasoning.md    【2025-08新增，二次扩容为"AI Design Brain"】完整流程(Product Thinking→Page Role→Design Autonomy Level→Information Architecture→...→Design Critique)，"先做产品判断，再做设计判断，最后选组件"
│   ├── c-end-visual-design.md        【2025-08新增，现为上面那份文件的子集】具体视觉规则：背景策略/首页焦点/活动页节奏
│   ├── validation.md                 生成后检查清单 + 量化评分公式
│   ├── constraints.md                【2026-11新增】可执行约束表：40+条硬约束编号 + 交付自查清单，规则不再散落在正文
│   ├── ardot-mapping.md              【2026-11新增】Figma→Ardot 画布落地映射，含色值换算和可直接粘贴的组件代码
│   ├── html-prototype.md             【2026-11新增】可点击 HTML 原型规范：单文件零依赖/多屏路由/12条交互契约/状态覆盖/交付说明模板，产品直接可用
│   ├── prd-to-prototype.md           【2026-11新增】PRD 转译规范：需求卡八项/功能点→屏幕映射/覆盖率核对表/3问+假设清单，产品给 PRD 就能直接出可点击稿
│   ├── interaction-adaptive-standards.md  为什么选了这几个外部交互标准
│   └── icon-library.md               图标库选型理由（字节IconPark单色 + Solar Icons金刚区彩色，含CC BY署名说明）
│
├── assets/                           【2026-11新增】成品素材，可直接内嵌使用
│   └── empty-states/                 缺省页插画（225×195，已抠透明底）+ keyout.py 白底抠除脚本 + 取图说明
│
├── qa/                              【2026-11新增】Design QA 自动质量校验引擎（详见 qa/README.md）
│   ├── qa.mjs / qa.config.json        CLI 入口 + 阈值 / 状态策略 / 修复白名单
│   ├── rules/ checkers/ fixers/ lib/   33 条规则、六大检查器、自动修复、真值源加载、报告生成
│   ├── fixtures/                      自检样例（正例 / 反例 / PRD / Figma 参考图），selftest 直接用
│   └── UPGRADE-NOTES.md                本次升级说明 + 实测结果 + 尚未解决事项
│
└── examples/                         真实生成测试的产出，直接拿浏览器打开看效果
    ├── repair-request-form/          报修申请（表单页，静态视觉稿）
    ├── task-execution/               任务执行（详情+列表混合页，静态视觉稿）
    ├── fulfillment-detail/           履约任务详情（详情页，静态视觉稿）
    ├── clickable-prototype/          【2026-11新增】可点击原型模板：列表→详情→弹层→Toast，含Tab切换/空态/返回栈，单文件可直接双击
    ├── tag-styles/                   【2026-11新增】标签样式全览：21个带编号检查项，含6档色值/角标几何/4个反例/可复制CSS
    └── empty-states/                 【2026-11新增】空状态规范 + 8场景手机壳内可切换演示（all-states.html）
```

## 2026-11 新增：出稿之后必须跑 Design QA

从这版开始，工作流不再是「出完 HTML 就交付」，而是 **设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付**。在 Skill 根目录执行：

```bash
node qa/qa.mjs selftest                       # 先确认引擎本身没坏
node qa/qa.mjs run --target <你的产物.html>   # 校验 + 可确定问题自动修复 + 二次校验
```

六大维度（需求还原 / 设计规范 / 组件引用 / 组件使用 / 视觉还原 / 交互逻辑）逐条出结论，问题定位到文件 + 行 + 选择器，报告输出 JSON / MD / HTML 三份。三条硬规矩：

- 没真实检查过的对象一律 `NOT CHECKED`，真值源缺失一律 `BLOCKED`，都不许伪装成 `PASS`；
- 只自动修复「可确定」问题（Token 替换 / 规范值归一 / 资产内联），改业务逻辑、增删功能点、调阈值降分一律禁止；
- 交付时必须附上报告，并交代总体状态、未解决问题、校验条件不足清单。

环境只要求 Node 18+、Python3 + Pillow、本机有 Chrome/Chromium（自动探测，也可用 `CHROME_PATH` 环境变量或 `qa.config.json` 的 `browser.chrome` 指定）。完整机制见 [qa/README.md](qa/README.md)。

## 用之前必须知道的几件事

1. **这不是凭空写的规范，是从真实 Figma 文件里一条条核实出来的。** 每条数据都带 `status` 字段（`REMOTE_INSTANCE`/`SPEC_ONLY`/`NOT_FOUND`/`EXTERNAL_STANDARD`/`USER_OVERRIDE`/`AI_PROPOSED`……），意思是"这条数据的可信度和来源"，不是随便标的装饰性字段，生成页面时要认真区分。
2. **BEP-S 库里其实有不少空白**，比如没有真实的"主要按钮"组件、没有独立的"未选中复选框"、没有"多行文本输入框"。这些都记在 `missing-components.json` 里，AI 遇到这些场景会老实说"这块是我按规范手搭的，不是真实组件"，不会硬凑。
3. **不要看到"没有真实组件"就觉得这个 Skill 不好用**——恰恰相反，它存在的意义就是把"哪些是真的、哪些是补的"讲清楚，而不是让页面看起来很规范但其实全是编的。
4. **卡片默认不加投影也不加描边**，这条被人肉核实过两次（细节见 CHANGELOG），纯靠背景色区隔。这是个容易被"通用UI经验"带偏的地方，AI 自己很容易想当然加个投影上去。
5. **图标已经接了真实的开源库**（Ant Design Icons，MIT协议），库里没覆盖到的图标不再是 AI 手绘的丑图形了。BEP-S 真实图标组件（COMPONENT_SET）依然优先，这个开源库只填空白。
6. **主色目前是 `#00B1B4`**，不是 Figma 原始读到的 `#006D9B`——这是团队后来直接要求换的，原始读值还留档在 `design-tokens.json` 的 `originalFigmaValue` 字段里，没有被覆盖丢失。
8. **缺省页插画已经放进 `assets/empty-states/`，不用再去 Figma 找**（2026-11-05新增）：插画 225×195、必须透明底。**Figma 导出的 PNG 自带不透明白底**，直接内嵌会在灰底页面上出现一块白方块——所以目录里放了 `keyout.py`，导出后跑一遍再内嵌。这条是被用户当场指出来的，写进了约束 C-97/C-98。

7. **"先做产品判断，再做设计判断，最后选组件"，不是"查组件→拼组件"**（2025-08新增，三轮迭代）：之前发现即使组件和Token全部用对了，生成的页面也可能"像组件拼装、不像成熟C端App"（纯白背景、所有页面都是同一个模板、首页没有视觉焦点）。这不是靠加更多组件能解决的问题，根因是流程里从来没有一步真正想清楚"页面该长什么样"。现在生成流程在查组件之前，先跑一遍 `visual-design-reasoning.md` 定义的设计推理（Product Thinking→Page Role→Visual Hierarchy→Layout Hypothesis(强制≥2方案)→Page Composition），生成后还要跑 Design Critique 自评，不通过要回去重新调整构图，不是改几个颜色间距应付了事。页面分三级：**PR1**(首页/运营活动页)投入度最高，**PR2**(列表/详情/推荐/看板)需要基本节奏感，**PR3**(表单/设置/操作)维持规整组件化结构就是对的，不需要额外设计投入——判断错了级别，套错了规则，是这套体系最容易出的错。
8. **Skill 不再只是"组件拼装器"，而是"Product + UX/UE + UI + BEP-S Design System"**（2025-08 二次扩容，"AI Design Brain"）：用户反馈过"AI 会用组件，但不会设计页面"——之前的流程里，即使 Visual Hierarchy/Layout Hypothesis 都做了，AI 依然是照抄原型的信息架构、照抄原型的功能取舍，只是把原型里的模块换成真实组件。这次扩容新增了六件事：①**Product Thinking**——生成前先判断每个原型功能该"前置/保持/弱化/合并"，不是原样照搬；②**信息架构判断权**——AI 可以重新分类、重新分组，但必须过「业务能力保留核对表」，原型里的每个功能点在新方案里都要能找到对应位置，找不到必须停下来跟用户确认，这是整个扩容里最重要的一条红线；③**UX/UE Thinking**——任务路径、首屏策略、高低频功能区分、空/错/加载状态设计；④**Design Autonomy Level（L0-L4）**——按 Page Role 给默认的"AI 这次能改多少"（L0=严格还原原型，L4=产品级自主设计），用户说"严格按原型"就强制拉回 L0；⑤**Tab Intelligence**——先判断"这里到底该不该有 Tab"，不是看着像列表就顺手加个 Tab；⑥**Design Critique 从 A-G 扩到 A-L**，新增 CTA突出度/Tab合理性/Tag语义正确性/无意义模块检测/业务能力保留五项检查，Design Quality Score 低于 85 分是**强制**回炉重做的阈值，不是建议。**核心边界没变**：AI 有信息架构和视觉设计的判断权，但没有删除业务能力的权力——原型代表的是业务需求集合，不是最终设计稿。

## Registry 数据从哪来，还需要维护吗

需要。目前的数据是基于两次真实 Figma 连接测试 + 几次页面生成测试积累出来的，覆盖面偏向**表单类和详情类页面**常用的组件（Input、选择器、上传、按钮、卡片、时间轴等）。像列表页/看板页可能用到的一些组件（Tag、Chart等）目前只做过结构层面的核实（`verificationDepth: structural`），没有逐个深度解析过主组件 key。

以后 Figma 额度恢复、需要补充新组件时，**不要重新扫描整个 Figma 文件**，只查缺的那部分，然后把新数据合并进对应 JSON（不要整体重写、不要删掉已经验证过的条目）。这条规则本身也写在 SKILL.md 里，AI 自己知道怎么做，但你人工去核对数据时也建议照这个原则来，保持 Registry 的历史可追溯性。

## 遇到问题/发现新的规范空白怎么办

直接跟 Claude 说就行，比如"这个组件在 Figma 里其实长这样"、"卡片其实不应该有投影"、"主色换成XX"——参考 CHANGELOG 里的历次对话就是这么做出来的。Claude 会自己判断这是要更新 Registry 数据、加一条新规则、还是记一个新的组件缺口，然后写回对应文件。

## 已知局限（老实说）

- Figma MCP 额度有限，深度验证（`getMainComponentAsync` 级别）目前只覆盖了这个 Skill 实际测试过的组件，其余的多数是 `structural` 级别（只确认了节点类型，没解析主组件key）。
- 交互动效（hover/按下/转场时长）目前引用的是外部标准（Material Design 3 / Apple HIG），不是 BEP-S 自己的规范——因为 BEP-S 的 Figma 源文件本身就没有这类数据。
- 目前支持三种产出：**Ardot 画布**（移动端稿）、**HTML+CSS**（浏览器预览）、**写入 Figma**（可选步骤）。还没有直接把结果画回 Figma 的自动化 Plugin——`page.schema.json` 是为这个预留的结构，但消费它的 Plugin 还没做。
