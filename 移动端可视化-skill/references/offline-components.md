# 离线组件使用与数据合同

v1.3.4-trial.1的指标详情页头和完整排名优先读取[试用版合同](trial-release-1.3.4.md)。手动拼接必须按runtime-manifest.json加载全部CSS/JS；新增trial-components.js须先于yikan.js，trial.css须在基础样式之后。build_page.py已按manifest自动内嵌，不再维护另一套固定文件顺序。

v1.3.0 · 2026-11-03。用户已授权把Figma规范封装成本地代码与资源，日常生成不得要求连接或读取Figma。历史引用中的“定位源节点”在离线模式指查本地来源身份与证据；不要求执行线上API。

## 文件入口

- `assets/offline/yikan.js`：无第三方依赖的组件函数、业务校验与交互。
- `assets/offline/yikan.css`：逐组件样式；`tokens.css`：语义色变量。
- `assets/offline/assets.js`：20个原生SVG图标、原生AI形象与紫色背景，全部内嵌。
- `assets/offline/tokens.json`：66种实测色值、47组字体样式及对应来源，保留不同透明度与原始字体身份。
- `assets/offline/geometry-catalog.json`：6,689条节点记录，用名称/来源查证，不将每个样本尺寸都当通用Token。
- `assets/offline/component-registry.json`：每类组件来源、实现状态、数据规则和缺口。
- `assets/offline/两轮充电-离线六态.html`、`组件目录-离线预览.html`：可直接打开的单文件HTML，无CDN、无需服务器。
- `assets/offline/evidence/`：本次读取的经营两态原始属性、既有主页原始提取；其余原始证据仍在各assets业务目录。

## 生成方法

先分析需求、指标关系和字段去向，再复制 `example-two-wheel.json` 或 `example-gallery.json` 修改页面配置。保持现有组件骨架和角色样式，仅绑定业务字段与数据。不要把示例财务定义、四Tab或六态强加给无关需求。

运行（路径按实际安装位置）：

```sh
python3 scripts/build_page.py --data assets/offline/example-two-wheel.json --out output.html
```

脚本只需Python3标准库；输出HTML把CSS、JS、图标、AI图片与数据全部内嵌。生成和打开阶段无需Figma、Node、npm、CDN或远程字体。`tests/runtime.test.cjs`需要Node仅作维护测试，不是生成依赖。

页面配置：`{title, description, screens:[{name, header?, tabs?, components:[{type, props, section?, caption?}], note?}]}`。

- `section`存在时用白卡包裹该组件；fundingBar、deviceComposition、homeCard、ranking自带容器，不再套section。
- 多屏是设计交付状态集，不是已实现的整页Tab导航。各自的分类、趋势和排名组件交互已本地实现；生成整页导航仍需按真实用户路径接通。
- 不能把原稿占位XX作为正式数据；缺少字段要局部标明，用户允许模拟时统一标模拟。

## 组件合同

|type|props与约束|已提供的本地行为|
|---|---|---|
|fundingBar|current、cumulative均含funding/charging/added，单位万元；category为charging或added。T>0，C/V≥0，C+V≤T|两色块合计R/T、灰色余量、分类切换、本期/累计、精确口径展开|
|deviceComposition|current含owned_new/external_new；cumulative含total/owned/external；total=owned+external；category为owned/external|来源构成、分类选择及本期新增/累计联动|
|progressRing|value独立比率；name；size为完整311宽组件的输出宽度|五个精确样本复用原路径；单圈负值反向、超百overlay；超出已实现范围保留原值，边界见ring-native-states.md|
|multiRing|items最多3项，各有name/value，是三个独立比率，不是加总构成|三个精确读数；开放270°弧是本地实现约定，不冒充所有原稿五态算法已定义|
|donut|items含name/value，可含color/display；center/label/selected；非负且可核对总量|按共同整体计算份额；全零有明确空态；不直接套独立完成率|
|trend|time数组；series各含name/values/unit/axis（left/right），可含color/digits；selectedIndex|所有系列默认显示、显隐、时点选择、选中点、同点明细/上期/环比；缺失断线、单点不造连线；六档、同轴万亿与精度对齐|
|ranking|columns、rows、selfRank、totalPeers、title；每行列数必须一致|完整列横滑、自身强调、指定列搜索、列升降序、完整卡片全屏/退出恢复、横滑边缘阴影；未接生产权限|
|homeCard|name/value/unit/updated/comparisonValue；可含children、second、theme|单值、主子指标、双摘要；主页透明白卡、光晕与比较标签|
|comparison|value（number/null）、label（同/环）、variant（detail/home）、digits|上涨/下降/0/缺失；不以涨跌替代风险判断|
|aiHint|text/detail/demo|原生形象与原生紫底；单行截断，点击展开；演示内容显式标识|
|warning|status为green/yellow/red/neutral，text|语义色提示；容器外观是补充实施样式，不声称源稿完整警告弹窗|
|bars|labels，series(name/values/color/period)，unit，stacked|分组/正负/同期深浅；stacked仅正数且共同整体；精确查询另给明细|
|horizontalBars|items(name/value)，unit|长标签类别比较；建议模板，非原生行内双向条完整复制|
|withholdingPayment|expected、paid、unit、basis:"amount" 或 successRate|扣费金额及成功率摘要，保持明确的分母或上游已确认的成功率|
|withholdingRankings|payment/signing/cancellation、initialView 可选；各指标含 scopes|三项排名独立切换，首个指标为百分数，沿用同级脱敏与各级排名权限|
|withholdingAnalysis|signing/cancellation 各自带 periods、selectedIndex，initialView、expanded 可选|签约／解约环形摘要、户数与趋势联动。仅提供一个视图时显示该视图，提供两套数据时支持切换|
|receiptComposition|items(name/value/comparisonValue)，三项；unit、title、selectedIndex、digits|实收三分类共用整体；环心为所选占比，侧边为所选项金额，整体合计独立显示。null 保留已知金额，暂停构成绘制|
|homePerformanceCard|source、scope、value、unit；收入／利润可给 completion、comparisonValue；现金流给 gap、yoyDelta（各为 value/unit）|经营性收入、税前利润金额、现金流净额三款主页原稿；业务明确给定比率与差额|
|homeProfitExplanation|updated、rate、profit、revenue、unit、yoy、mom|税前利润率与两项权责金额，独立同环比；金额共用单位，率值使用业务口径|
|homeCashflowTargets|updated、unit、month{net,yoyDelta}、halfYear/year{rate,net,target,yoyDelta}|当月净额与半年度、年度达成；各段同比为金额差，共用金额单位；率值由业务输入|
|ratioRings|items(name/numerator/denominator/unit/numeratorLabel/denominatorLabel)，1–3 项；title、selectedIndex|分母独立，单环和多环按项切换；异常显示规则参见原生环图专项|
|yearAmountRings|modules：1–2 项，各自含 title/current/previous/unit、comparisonValue 可选|预存冲抵或余额的本年／往年构成。每项独立合计及占比；0 和 null 分开显示|
|periodCurves|time、series(name/values/previous?)、unit、title、selectedIndex、digits|单轴单／多曲线，选点联动明细；不同量纲使用对应双轴模板；同期须显式对齐|
|categoryColumns|labels、series(name/values/unit) 1–3 组、unit、selectedIndex、digits、title|一组为基础柱，多组为同量纲分组柱；类别切换联动高亮和精确值，null 为缺失|
|signedPeriodBars|periods(label/current/previous)、unit、title、currentLabel、previousLabel、selectedIndex、digits|本期／同期对齐的正负分组柱；共用零基线，null 显示“—”，数据显示原值和差额|
|satisfactionRadar|dimensions(name/current/highest/average)、max、unit、title/subtitle、selectedIndex|五维显示同量纲参照，六维展示当前值及原稿底图。null 为缺失，断开折线并保留“—”读数|
|contractTrend|periods(label/eligible/signed)、selectedIndex、三系列名称可选|同期间、同范围分子包含在分母内时，使用双轴户数柱＋比率线。期间选择联动明细；null 或零分母的比率断开|
|monthlyRevenueGauge|unit、annualTarget、months(month/actual/yoy/status/sectors/referenceValue/referenceLabel)、selectedMonth、title|每月累计对应同一年度目标；status 为 met/below/unrated，独立于完成率计算。超百/负值保留真实读数|
|actualTarget|actual、target、unit、targetLabel、segments（可选，最多两段）、digits|同单位非负实际值与目标，独立标记。目标为零或缺失时不计算完成率；超目标时显示原读数并扩展量程|
|chargeRateTarget|title、rows(name/actual/target) 1–2 项、digits|0–100 百分刻度；目标线、斜纹条、百分点缺口。空值按 null 输入；背景由生成器按需内嵌|
|stageConversion|items(name/value) 恰好三项、unit、valueDigits、rateDigits|同批客户依次经过三个包含阶段，来源 6695:316711。相邻比率逐段计算；全链路单列；分母为零或缺失时显示“—”|
|cashflowInline|groups(name/rows(name/value))、unit、digits、scope|来源 6695:315631 的三列表格与双向行内条。表内须同量纲，差额传入已确认的数值，null 显示“—”，0 保留|
|funnel|items(name/value)|补充示意模板；同批三阶段优先使用 stageConversion|
|radar|items(name/value)，max|同量纲多维；补充建议模板，非已修复原稿全部几何|

API入口还包括 `header`、`tabs`、`icon`、`risk`、`fundingModel`、`relativeChange`。图标使用本地原生SVG，不用Emoji替代奖杯与同环比箭头。

## 警示色与判断

绿#0FD486、黄#FFAC46、红#FF375F。`risk`只计算已有业务矩阵：inflow、outflow、propertyGrowth、livingRevenue、profit。value与阈值都采用百分数表示；前三项进度类传入值需已按目标达成率/时间进度计算。未知业务、缺失值返回null，不自行套阈值。矩阵限2026-07-21来源版本，具体业务优先。两轮充电没有新增预警阈值，不得因颜色像警示灯而宣称预警。

## 字体与原始素材边界

原始字体身份仍按逐槽位参数记录。未复制或重新分发PingFang、DIN等商业字体文件。数字CSS用别名`Yikan DIN`指向准确PostScript名`DIN-Bold`/`DIN-Medium`，防止本机同族`DIN-Euro`被误选而把%画错。缺字重时回退PingFang/系统，须报告。浏览器`document.fonts.check`不是实际字形的充分证据；维护验收需看实际渲染字体与0—9、小数点、%、负号、单位。

AI图片和20个图标SVG是已导出的原资源。2026-11-04已从新指定页面取得经营分类两态完整SVG，原始路径和渐变已接入模板。原始文件及宽度差异见new-page-6671.md，全面视觉验收仍待完成。

## 验收与已知缺口

看`tests/browser-validation.json`和`coverage.json`。已验证本地金额口径、分类联动、五曲线、趋势选点/显隐、排名搜索/排序、375宽无整页横溢出及无外网请求。未完成：全组件逐像素对照、所有字体字重跨平台一致、全部环负值/超百图形算法、完整日历/组织权限/筛选弹层模板、全部宿主系统图标。

现存全部已提取规则仍随references和assets打包，均可本地读取；上述未定义规则不会因为改成离线模式自动变完整。生成器覆盖“可运行组件集合”，不等于所有Figma页面都已完整导出，也不能把离线行为检查说成Skill自主选型或用户验收通过。

2026-11-05实施变化与取整算法边界见[补齐记录](offline-update-2026-11-05.md)，分类板来源及业务边界见[组件分类复核](component-classification-1583.md)。

环图资源新增native-rings.js，手工拼HTML须与assets.js一并先于yikan.js加载；build_page.py已自动内嵌。nativeRingState的十种静态原件与progressRing数据绑定不同，详见[环图原件](ring-native-states.md)。

新增dateControl与organizationControl，可用build_page.py直接生成。Props、默认行为、源稿参数和未实现部分统一见[查询控件](query-controls.md)。日历的完整页面和底部弹层是两套参考；当前动态模板覆盖底部列选择，不宣称完整日历或惯性滚轮已还原。

新增filterControl：字段、单多选、条件显隐、defaults、available和version显式配置；参照[高级筛选合同](advanced-filter.md)。提交发出yikan:filterchange，不等于整页数据已查询。

新增businessRanking业务组合，第一/中间/最后名次、范围与下辖授权按[排名业务合同](business-ranking.md)处理。手工页面需在yikan.js前额外加载business-ranking.js；生成脚本已自动内嵌。


[阶段转化与现金流离线样例](../assets/offline/阶段转化与现金流-离线核对.html)的配置为 `assets/offline/example-native-chart-bindings.json`。阶段图按数量绘制并复用原稿结构，原稿的比例和占位读数保留在独立 SVG 中。现金流每张表使用该表全部行的最大绝对值作为左右半边的共同刻度，板块切换可由整页查询控件提供。

[目标条与收费率离线样例](../assets/offline/目标条与收费率-离线核对.html)的配置为 `assets/offline/example-target-charts.json`。本地生成时使用原稿去除动态内容后的收费率卡背景；数据轨道、目标标记和文案由模板渲染。

月份仪表的分段及参照数据详见 [数据约定](monthly-gauge-data.md)。
