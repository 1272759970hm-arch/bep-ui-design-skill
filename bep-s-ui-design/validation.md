# BEP-S UI 生成后检查

> 对应 SKILL.md 的 Step 8/8.5/10。每次生成页面后都要跑一遍，检查结果和评分要写进给用户的最终报告里，不要只汇报"完成了"。（⚠️2025-08更正：原文写的是"Step 12"，早期版本遗留的过期引用，当前流程只到Step 10，这里指的是Step 10「返回最终结果」）

> ⚠️ **这份文件检查的是"合规性"（组件真实吗、Token对吗、规范满足吗），不检查"有没有设计感/产品判断对不对"——那是另一件事（2025-08 新增区分，二次扩容见「Design Critique」章节）。** PR1首页/运营活动页、PR2列表/详情/推荐/看板类页面生成后，除了跑完下面这些合规检查项（对应 SKILL.md Step 8），还要额外跑一遍本文件末尾的「Design Critique」章节（对应 Step 8.5，完整方法论见 [visual-design-reasoning.md](visual-design-reasoning.md) 第17-18节）——一个页面完全可能合规检查全过，但因为纯白背景+等高卡片堆叠+无焦点模块+信息架构照抄原型而"看起来不像成熟C端App"，这种情况下面的检查项是查不出来的，必须两份清单都跑。PR3功能页不需要跑 Design Critique。

## 组件检查

- [ ] 每个模块是否都在 `component-library.md` 里核实过，优先用了 `REAL_COMPONENT`/`COMPONENT_SET`/证据充分的 `INSTANCE`？
- [ ] 有没有重复造组件——比如库里已经有 `INSTANCE` 证据充分的 Divider/Input/Switch/Radio/Checkbox/NavBar/TabBar/Grid/Picker族/Upload/Popover/Empty插画，却自己重新画了一个视觉相似的东西？
- [ ] 有没有把 `SPEC_FRAME`/`GROUP` 错当成可以直接实例化的真实组件（比如以为 Card/Tag/Toast/SearchBar 有主组件可以拖，实际上没有）？
- [ ] Variant 选的对不对——尤其是"标签栏"这类命名易混淆的组件，有没有按四维判断（第1节）选对到底是底部导航还是页内Tab？
- [ ] 有没有该走"组件替代关系"（component-library.md 第3节）却自己发明了一个新组件（比如自己设计了一个 Badge 组件而不是用8px圆点+色值组合）？

## 视觉检查

- [ ] 颜色是否全部来自 `design-tokens.md` 的 Color Token，没有引入库外色值？
- [ ] 字体/字号/字重是否来自 Typography Token（14/15/16/18/20/22/24px，Regular/Medium）？
- [ ] 圆角是否来自 Radius Token（按钮4px/卡片~6px/标签2px）？
- [ ] 间距是否来自 Spacing Token（16/12/44/56/34px），没有随意取值？
- [ ] **行高是否设了 `字号 × 1.5`（`mobile-ui-rules.md`，`FOUND_IN_FIGMA`）**？这条规则容易漏——很多写法只在个别文字（比如大字号数字）单独设 line-height，其余文字全部沦为浏览器默认值 `normal`（明显比1.5紧），肉眼看列表/Cell这类紧凑排布的区域会显得"矮"。用浏览器 `getComputedStyle(el).lineHeight` 实测抽查几处正文文字，不要只看代码里写没写。
- [ ] Icon 是否用了库内已有语义的图标（COMPONENT_SET 或图标2画板），没有为已有语义重新画图标？
- [ ] 页面里同时出现一级/二级 Tab 时，**一级（下划线，18px）是否摆在二级（胶囊，16px）上面**？判断依据是"范围更大/更总的分类在上"，不是凭视觉习惯——真实案例里被做反过（胶囊摆上面，下划线摆下面），详见 component-library.md「标签栏 Tab」。
- [ ] 一级Tab 的入口是否**平分整行宽度**（不是左对齐固定间距）？选中指示条是否是**独立于文字的24×2px全圆角小色块**（不是给文字加border-bottom、宽度贴合文字、直角）？用 `getComputedStyle` 实测抽查一下指示条的width/height/border-radius，不要只看代码里写了`border-bottom`就以为对。
- [ ] 页面里的"标签"是否区分了**普通标签**（分类信息，同行内联）和**状态角标**（业务状态，卡片右上角悬挂）？不能把两种都做成同一种内联小色块——真实案例里"到店自提"(分类)和"待自提"(状态)被做成了视觉完全一样的内联胶囊，详见 component-library.md「标签 Tag」。
- [ ] 必填字段的星号是否排在标题文字**后面**（"配送员*"），不是网页惯例的"*配送员"？这条容易凭直觉套用通用网页表单写法，跟 BEP-S 实际规范正好相反，见 component-library.md「表单」章节。
- [ ] **图标颜色是否跟所在语境匹配，没有无脑套用 `color.text.5`（黑色）**？专门过一遍所有"带danger/warning/brand等语义色背景或文字的容器内的图标"，逐个确认图标色是否跟随了那个语义色——这类问题语法上不会报错，代码走查很难自己发现，真实测试里被用户当面指出过两次（不同页面都出现过），必须主动逐个检查，不能只在被问到时才查。

## 移动端检查

- [ ] 是否有横向溢出（内容超出375px设计宽度未做滚动/裁剪处理）？
- [ ] 底部安全区(34px)是否在需要的地方留出（尤其底部有固定按钮/TabBar时）？
- [ ] 底部 TabBar 是否显式设了 `position: sticky; bottom: 0`（或页面确实不需要滚动时可以不设）？不能默认它"应该"会自动吸底——之前在「履约工作台」页实测漏了这条，Tab栏只在页面内容不满一屏时才会看起来贴底，一滚动内容超过一屏就变成跟在正常内容流最后面，紧贴上一块内容，必须用浏览器实测滚动一下确认效果，不能只看代码。
- [ ] 可点击元素尺寸是否合理——Radio/Checkbox/Button 已有的48px规格是否被遵守；对于库内 `NOT_DEFINED` 的通用触控热区，是否已按 `mobile-ui-rules.md` 的说明标注为参考值而非规范值？
- [ ] 是否存在信息拥挤——单屏信息密度是否与 List/Detail/Form 模板里记录的层级结构一致？
- [ ] 信息层级是否清晰——核心信息是否比次要信息更突出（字号/颜色/位置）？
- [ ] 涉及滚动/键盘弹起的场景，是否遵循了平台原生行为（这不是BEP-S定义的规范，是工程常识，不要在报告里说成是库规范）？

---

## 六项新增检查（2025-08 实测后补，针对"看起来合规、实际在撒谎"的情况）

前面三组检查清单查的是"页面看起来对不对"，这六项查的是"报告说的是不是真的"——这是信息登记表单页第一次实测暴露出来的盲区：一个页面可以在视觉上完全达标，但组件复用的说法是假的。

- [ ] **Component Authenticity（组件真实性）**：报告里声称"用了真实组件"的每一处，是不是真的对应一个 `REAL_COMPONENT`/`COMPONENT_SET`/`INSTANCE`？有没有把 SPEC_FRAME 手搭的东西、或者魔改过的相似组件，包装成"真实组件"？
- [ ] **Token Evidence（Token 证据）**：报告里当成正式规范引用的每一个数值，是不是都能在 `design-tokens.md` 里查到对应的 `FOUND_IN_FIGMA` 条目？有没有把 `INFERRED` 或 `AI_PROPOSED` 的值，不加说明地当成正式 Token 使用？
- [ ] **Component State Accuracy（组件状态准确性）**：每个组件的每个具体状态（选中/未选中/禁用/加载中……），是不是都单独验证过，而不是靠"这个组件家族看起来挺完整"推断出来的？
- [ ] **Design System Conflict（设计系统冲突）**：全局规范（design-tokens.md / page-patterns.md）和某个真实组件的实际实现有没有不一致的地方？如果有，是不是按"设计冲突优先级"（真实实现优先）处理的，并且记录成了 `DESIGN_SYSTEM_CONFLICT`？
- [ ] **Missing Component Detection（组件缺失检测）**：所有确认没有真实组件的模块，是不是都进了「组件缺失清单」（component-library.md 第3a节格式），而不是被悄悄魔改成别的组件蒙混过去？
- [ ] **AI Inference Detection（AI 推断检测）**：所有 `AI_PROPOSED` 的数值，是不是都带上了"该值为 AI 建议值，并非当前设计系统正式规范"这句话或等价表述？有没有哪个地方把 AI 自己的判断包装成"BEP-S Token"「BEP-S Design Rule」「BEP-S Official Specification」？所有 `EXTERNAL_STANDARD` 的数值（点击热区/交互状态/动效/自适应，见 `interaction-adaptive-tokens.json`）是不是都带了具体来源名称（Apple HIG / Material Design 3 / WCAG 等），有没有被悄悄说成是 BEP-S 自己的规范？

**打分规则（这四项直接影响下面量化评分里的 Component Authenticity / Token Compliance）**：
- 只要发现 AI 使用了一个不存在的组件（把不存在的组件说成存在），**Component Authenticity 直接记 0 分**，不是按比例扣分。
- 只要发现 AI 把 `INFERRED` 当成正式 Token 使用（没有声明就直接引用），**Token Compliance 直接记 0 分**。
- 只要发现 AI 用错了组件状态（比如假设了一个没验证过的状态），**Component State Accuracy 直接记 0 分**。
- 只要发现 AI 修改真实组件来模拟另一个组件（相似组件魔改），**Component Authenticity 直接记 0 分**。

这四条是硬性归零规则，不是"扣一些分"——因为一旦出现这些情况，报告本身就不可信了，量化分数再高也没有意义。

## 组件使用报告格式

Step 10 的输出必须包含逐模块的「组件使用报告」，格式和示例见 `SKILL.md` 的对应章节——每个模块要交代清楚状态（REAL_COMPONENT/REMOTE_COMPONENT/INSTANCE/SPEC_ONLY/AI_PROPOSED/NOT_FOUND）、本地还是远程、具体做法（克隆已有实例/按规范手搭/纯手绘）、有没有在本次会话里实测验证过。不要只说"用了 Input"这种笼统的话。

---

## 量化评分

每次生成页面后按以下四项打分，满分100，取值方式：

### Component Reuse Score（组件复用分，即"Component Authenticity"归零规则的作用对象）
```
= (页面中来自 REAL_COMPONENT / COMPONENT_SET / 证据充分INSTANCE 的模块数)
  ÷ (页面中所有"库里本应有对应组件"的模块总数，不含P4新建部分)
  × 100
```
目标 ≥ 90%。低于目标时，回到 Step 4 重新核实是不是漏检了某个真实组件。

**归零条件（优先于上面的比例计算）**：如果六项新增检查里的 Component Authenticity 检查发现"使用了不存在的组件"或"修改真实组件来模拟另一个组件"（相似组件魔改），这一项**直接记 0 分**，不再按比例算——因为报告里关于组件复用的说法已经不可信，比例数字没有意义。

### Token Compliance Score（Token 合规分，即"Token Evidence"归零规则的作用对象）
```
= (颜色/字号/间距/圆角/阴影/Icon 取值命中 design-tokens.md 的属性个数)
  ÷ (页面用到的相应属性总个数)
  × 100
```
目标 ≥ 95%。任何一处自创数值都会拉低这项分数，先查是不是该属性其实在 Token 表里已经有定义只是没查到。

**归零条件**：如果发现 `INFERRED` 的估算值被当成正式 Token 使用、且没有声明这是推算值，这一项**直接记 0 分**。`INFERRED`/`AI_PROPOSED` 只要按规则明确声明了，不算违规，可以正常参与比例计算（声明清楚的 INFERRED/AI_PROPOSED 项按"未命中 FOUND_IN_FIGMA"计入分母但不计入分子，正常拉低比例即可，不用到归零这么严重）。

### Mobile UI Score（移动端合规分）
```
= (「移动端检查」清单里通过的项数) ÷ (清单总项数) × 100
```
目标 ≥ 95%。

### Visual Consistency Score（视觉一致性分）
```
= (「视觉检查」清单里通过的项数) ÷ (清单总项数) × 100
```
目标 ≥ 95%。

### 附加检查项（不折算成独立分数，但任一项不通过都会拒绝整体交付）

- **Component State Accuracy**：只要发现用错了组件状态（假设了没验证过的状态），本项判定 `FAIL`，即使上面四项分数都很高，也要退回 Step 4 补验证，不能交付。
- **Design System Conflict**：记录本次遇到的所有 `DESIGN_SYSTEM_CONFLICT`（数量可以是0），只要记录了、且处理方式符合"真实实现优先"的规则，本项判定 `PASS`；如果发现有冲突但没有记录，或者为了迁就全局规范擅自改了真实组件，判定 `FAIL`。
- **Missing Component Detection**：本次「组件缺失清单」是否完整（对照 Step 4 搜索过程里所有 NOT_FOUND 的模块，是否都进了清单，而不是被魔改掉了），完整判定 `PASS`，有遗漏判定 `FAIL`。
- **AI Inference Detection**：所有 `AI_PROPOSED` 数值是否都带了declare语句，都带了判定 `PASS`，漏了判定 `FAIL`。

### Overall UI Compliance Score（综合分）
```
= (Component Reuse + Token Compliance + Mobile UI + Visual Consistency) ÷ 4
```
**前提条件**：只有当 Component State Accuracy / Design System Conflict / Missing Component Detection / AI Inference Detection 四项附加检查全部是 `PASS` 时，Overall 分数才有意义可以拿去交付；只要有一项 `FAIL`，不管 Overall 数字多高，都必须先回去修正对应问题，不能因为"总分还不错"就放过。

**任意一项低于对应目标阈值时，不要直接把页面交出去**——回到对应的 Step（组件复用分低回 Step 4-5，Token合规分低回 Step 6-7，移动端/视觉分低回 Step 7-8）重新检查修正，修正后再打一次分，直到达标或者你能明确解释为什么这个具体情况下达不到目标也是合理的（比如某个模块本来就是库内空白，只能新建，Component Reuse Score 天然拉低，这种要在报告里说明原因，而不是硬凑分）。

---

## 重要原则：不要为了评分而评分

**评分是用来发现问题的工具，不是生成页面的目标。** 页面应该以业务需求为第一目标，最终追求的不是"用了最多的组件"，而是"用了正确的组件"。

具体来说：
- 不要为了拉高 Component Reuse Score，硬塞一个业务用不上的组件进页面。
- 不要为了凑够四项指标都好看，牺牲信息架构的清晰度。
- 如果某个模块确实是库内空白、必须新建（P4），坦诚地把这部分单独列出来告诉用户，而不是想办法把它伪装成"复用了已有组件"来刷分。

给用户的最终报告应该包含：这次生成用了哪些真实组件（分别是什么优先级 P0/P1/P2/P3/P4）、四项评分及是否达标、如果有没达标或者用了 P4 新建的地方，明确说明原因。

---

## Design Critique（设计自评，2025-08 新增，二次扩容，对应 SKILL.md Step 8.5，PR1/PR2页面必跑）

上面所有检查和评分测的是**合规性**——组件真不真实、Token对不对、移动端规范满不满足。这一节测的是**设计质量**——页面有没有设计感、产品判断对不对，跟合规性是两件独立的事，一个页面完全可能合规检查全部通过，但依然"像组件拼装、不像成熟C端App"。完整方法论见 [visual-design-reasoning.md](visual-design-reasoning.md) 第17-18节，这里是可以直接拿来跑的检查清单。

### 检查项（A-L，2025-08 从A-G扩容到A-L）

- [ ] **A. Visual Focus**：Primary Visual Focus 是否清晰可辨认，是否真的只有一个？
- [ ] **B. Information Hierarchy**：Visual Hierarchy 阶段的判断（什么最大/最重要/该弱化/该隐藏/该组合/该留白）是否在最终产出里真的体现了出来？
- [ ] **C. Composition**：选定的 Composition Pattern 组合是否被完整落地，有没有中途走样变成了简单的组件堆叠？
- [ ] **D. Spatial Rhythm**：是否存在至少两档密度（High/Medium/Low），模块尺寸/性质是否有交替（不是连续3个以上同质模块）？
- [ ] **E. Content Density**：单屏信息密度是否合理，有没有某个区域明显过密或过空？
- [ ] **F. Visual Consistency**：页面内部视觉语言是否统一（圆角/间距体系是否协调）——**这条跟上面"视觉检查"里的 Token 一致性检查不是一回事**，那个查的是"颜色/字号是否来自Token"，这个查的是"页面内部搭配是否协调"，两者都要过。
- [ ] **G. Template Detection（重点项）**：页面是否退化成了 `White Background + Card + List + Divider + Button` 这个固定模式？检测方法：数一下"白底+等宽卡片+内部Cell/List+分割线"这个组合连续出现了几次，如果覆盖页面70%以上内容区域，判定失败。
- [ ] **H. CTA 突出度**（新增）：核心 CTA（对应 `visual-design-reasoning.md` 第4节的核心任务）视觉权重是否明显高于页面里其他可点击元素？
- [ ] **I. Tab 合理性**（新增）：页面里用了 Tab 的地方，是否都经过了 `visual-design-reasoning.md` 第9节 Tab Intelligence 的存在性判断，不是"看着分类清楚就加了"？
- [ ] **J. Tag 语义正确性**（新增）：普通标签（PROPERTY_TAG，固定属性）和状态角标（STATUS_TAG，业务状态）有没有混用？
- [ ] **K. 无意义模块检测**（新增）：有没有不服务于任何 Business Goal/User Task 的模块，纯粹为了"页面看起来更丰富"而存在？
- [ ] **L. 业务能力保留**（新增，重点项）：`visual-design-reasoning.md` 第5节的"业务能力保留核对表"是否完整——原型里的每个功能点是否都能在新方案里找到对应位置，有没有静默丢失的功能点？

**任意一项不通过，尤其是 G/L 两项**：标记 `VISUAL_DESIGN_WEAK`，回到 `SKILL.md` Step 3.5（对应 IA重组或Layout Hypothesis）重新调整（不是回来改颜色/间距），重新生成后再跑一次这份清单，直到通过或者能明确解释某一项为什么在这个场景下不适用。

### Design Quality Score（设计质量评分，独立于上面的合规评分）+ 强制阈值

```
Information Hierarchy   20   （对应 A/B/L 项）
Visual Focus             20   （对应 A/H 项）
Composition               20   （对应 C/G/I/J/K 项）
Spatial Rhythm            15   （对应 D 项）
Content Density           10   （对应 E 项）
Visual Consistency        10   （对应 F 项）
Component Compliance       5   （= 上面 Component Reuse Score × 5%）
──────────────────────────────
合计                      100
```

**权重设计的用意**：前三项占60分，是评分主体，直接对应"有没有设计感"这个核心问题。`Component Compliance` 只占5分——这是刻意的，组件合规与否已经有前面 `validation.md` 的归零规则在严格把关（用假组件直接判0分），这里不需要再用高权重重复强调一次，更不能让"组件复用"变成设计质量的主要衡量标准，那样会反过来鼓励"为了拉分堆组件"，跟 `visual-design-reasoning.md` 第16节的原则冲突。

**⚠️ 强制阈值（2025-08新增，硬性规则，不是建议）**：**低于85分，必须自动进行第二轮优化**——回到 `SKILL.md` Step 3.5（Information Architecture 或 Layout Hypothesis）重新调整，不是"这次先这样交付，下次再改"。重做后重新打分，直到≥85分，或者对每一项不达标都能给出可核实的具体原因（比如某个纯功能性PR2看板，Visual Focus天然不需要PR1级别的强烈程度，这种要在报告里写清楚为什么，不是绕过阈值蒙混过关）。

**这条评分同样遵守"不要为了评分而评分"原则**：目标是发现设计问题，不是让数字好看，更不能靠降低标准去凑够85分。PR3 页面不需要打这个分——合规评分（上面四项）对 PR3 已经足够。
