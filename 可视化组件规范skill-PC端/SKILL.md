---
name: chart-skill
description: 根据需求、PRD或原型完成一看S端移动看板、主页卡片和指标详情的UE分析、图表选型与高保真HTML页面生成，并实际交付可下载.html文件（预览图不能替代）。使用随包本地视觉规则、原始素材和离线组件生成可运行页面，无需连接Figma。不用于PC后台。
---

# 一看移动端设计

2026-11-19 · v1.3.4-trial.2 · HTML产品试用版

**本版生成入口：** 指标详情使用`header.layout:"indicatorDetail"`组合日期控件和摘要；完整排名使用`detailRanking`，不要退回通用排名卡来冒充详情原件。使用前读取[试用版组件合同](references/trial-release-1.3.4.md)，直接从`assets/offline/trial-funding.json`、`trial-ranking.json`或`trial-home.json`取结构并按需求绑定数据。未补齐项明确列出，不能宣称全库完全一致。

设计单位是整页任务。先理解用户要比较的业务关系，再决定信息架构、图表、数值与明细。日常生成直接使用本地规则、资源与代码，**不要求用户提供Figma账号、链接、权限或MCP连接，不因Figma不可用而停止生成。** 来源链接与节点ID是追溯记录，不是运行依赖。

**2026-11-18来源优先级更正：** 用户确认《一看2026交付稿》（coPS7naE76ZG6pErhZZOB8）优先作为视觉与页面标准。脑爆稿（2oSqZAFWhrtQoOytyamFOn）含混杂试验与AI稿，不按文件名称、位置或“规范”字样自动认定为标准；仅用户明确指定的节点或已与交付稿核实一致的内容作为补充。冲突处理与存量复核见[来源与适用范围](references/sources-and-scope.md)。既有提取尚未全部完成交付稿复核，不因新增此规则就视为已符合交付稿。

交付稿的实际读取结果、字体修正及42项运行组件的复核状态见[交付稿复核](references/delivery-recheck-2026-11-18.md)。来源标注不能代替参数与画面核对；“待复核”组件不能宣称已经按交付稿验收。

用户于2026-11-18另指定纯净页7958:101240作为继续提取入口；本批新参数、原始SVG及未接入项见[纯净版来源](references/clean-source-7958.md)。该页面为明确授权的补充范围，不将脑爆文件其他页面自动升级为标准。

当前原始提取状态见[当前状态清单](references/current-extraction-status.md)。17 个图表的保留文字版和转曲版均可从[原稿对照页](assets/offline/一看原稿-图表与主页卡片提取对照.html)打开。

本版提供可运行的离线模板，不宣称全Figma库已逐像素还原。必须读取[离线组件合同与边界](references/offline-components.md)和[覆盖清单](assets/offline/coverage.json)，按来源状态区分“原始素材、实测参数移植、建议模板、待补”。不能把曲面CSS近似、字体回退或未实现弹层称为原生完全一致。

本轮审计的已修正问题与未放行项见[规范执行审计](references/spec-audit-2026-11-18.md)。原始参数已提取、模板已接入、同数据视觉已核对是三种不同状态；对当前使用的组件逐项确认，不能只读规范文档便宣称页面符合规范。

## 原样资源补齐与放行

先读[原样完善验收](references/native-completion.md)。组件状态必须区分原始参数、原始素材、可绑定模板、视觉对照、交互验证；运行正常不能代替视觉一致。单环/多环十态的归档原始参数已拆出到[原始状态快照](assets/offline/ring-original-state-snapshots.json)，不得重复声称这些参数尚未读取；十态文字与转曲SVG均已取得；仍缺任意异常多环/多圈映射的明确规则与完整数据适配、视觉验收。

本轮指定新来源的提取与冲突见[新页面复核](references/new-page-6671.md)，经营分类背景已接入原始路径。日历/筛选已有原始SVG，组织SVG仍有导出异常，已有原始 PNG；品牌间距与图表色序已取得，其他品牌板缺口见当前提取状态。

颜色/布局等基础规范已按1583:6361复核，使用[基础规范差异与来源](references/foundations-1583-audit.md)处理旧版/完善版、候选/实测和业务映射的优先级。

一看主页和指标详情的头部样式见[头部背景](references/header-backgrounds.md)。按页面类型选择源背景，优先保持导航、日期、摘要与底层渐变的实际分区。

## HTML文件交付合同（生成页面时必读）

默认交付必须同时有：**实际HTML文件 + 最终回复中的文件附件或下载链接**。预览图、聊天中的渲染预览、画布、临时预览地址和代码片段均不能替代HTML文件。预览图可附加，不是交付终点。

1. 先生成页面配置，再执行随包 `scripts/build_page.py --data 页面配置.json --out 交付/页面.html`；工作目录不同则使用脚本绝对路径。输出为自包含HTML，CSS、JS、图片等运行资源内嵌。
2. 文件须保存到当前工具允许交付的输出目录。检查文件真实存在、非空且包含HTML文档与页面内容；有浏览器能力时再检查能否打开。不能只声称“已生成”。
3. 使用宿主工具支持的附件或文件下载机制交付，最终回复明确列出“下载HTML”。本地环境提供可点击本地文件链接；云端环境用其实际附件/下载链接，不把本机路径或不存在的链接当附件。下载文件与预览应是同一个版本。
4. 多状态任务按需求提供各状态HTML，或一个包含全部状态的HTML；静态状态集不能冒充已实现Tab导航。多个文件可另加ZIP，但必须保留HTML交付入口。
5. 最终检查：用户是否不需要再次索要就能取得.html文件？若只有PNG/预览，任务仍未完成，继续导出HTML。
6. 如果环境确实没有文件写入、执行或附件能力，明确说明具体限制，不虚构附件，不把图片称为HTML；可提供完整HTML源码作为临时替代，并明确它还不是文件交付。不得假称测试通过。

推荐最终回复格式：

- 下载HTML：附上实际生成的页面.html附件或其真实文件链接
- 预览图：可选
- 已验证操作及已知差异：简述

## 工作流程

1. **分析需求。** 读[UE分析](references/ue-analysis.md)，确定用户任务、组织/期间、核心问题、指标关系、默认状态、字段去向与缺口。需求明确时自主执行，不新增审批。用户已确认定义优先，缺失数据不能擅自补造为真实数据。
2. **规划整页。** 读[页面布局](references/page-composition.md)、适用的[详情框架](references/indicator-detail-framework.md)或[主页卡片](references/homepage-and-cards.md)。摘要→分析→精确明细/排名有连续关系，避免一值一卡或孤立拼图；交付首屏与完整内容。
3. **选择图表。** 读[选型决策](references/chart-selection.md)，写明“用户问题→总分/并列/时间/目标/排名关系→分母/期间→图形及编码→候选取舍→缺口”。构成必须同整体；独立比率不能加总；不同量纲联合趋势可双轴，不自动拆图。两轮充电五项联合趋势默认同图完整显示。
4. **使用本地组件。** 从[组件注册表](assets/offline/component-registry.json)选适用模板，读[数据合同](references/offline-components.md)。优先通过随包build_page.py内嵌全部资源与模块；手工拼接时按[运行资源清单](assets/offline/runtime-manifest.json)的顺序加载，保留组件层次和视觉参数，只绑定字段、期间、金额、段长/角度/曲线及必要状态。不要换成图表库默认皮肤，也不再到Figma导入组件。
5. **输出与检查。** 优先用`python3 scripts/build_page.py --data 页面配置.json --out 页面.html`生成自包含可离线打开的HTML。可复制`assets/offline/example-two-wheel.json`或`example-gallery.json`，按需求修改，不硬套示例业务。生成阶段只需Python3标准库，无npm/CDN/网络。查看实际页面，检查字体字形、读数、单位、颜色、全部字段、完整排名列、缺失/零值、首屏与长页。实际实现、静态状态、视觉差异和用户验收分别报告。

## 生成后自动校验（默认执行）

生成高保真HTML后必须执行[自动校验与修复流程](references/post-generation-validation.md)。随包`build_page.py`已默认生成同名`.validation.json`、`.validation.md`，并在可用环境中自动尝试浏览器检查和截图；无需用户另发检查口令。手写HTML也须执行`validate_page.py`，没有可核对来源时不得自报通过。

发现失败先按来源修复并重建复检，不随意改规范来迎合校验；未处理的失败不得作为通过稿交付。浏览器、实际字体或视觉对照未执行时保留pending。最终随HTML交付报告，简述通过项、失败项和待验证项；自动结果不等于全页还原度已获保证。

## 必守口径与视觉规则

- 两轮充电资金：实际收益R＝充电收益C＋增值收益V；总流水T＝R＋灰色未计入U；主占比＝(C＋V)/T。66.6%是示例，两色块不铺满100%，不改成单类占比或目标完成率。切分类只更新选择和分类本期/累计，T/R/P/U及虚线不变。读[专项](references/charging-funding-bar.md)。
- 设备总数＝自有＋外拓。启用率＝启用数/总数；启用设备在线率＝启用在线数/启用数，两个指标不混名。
- 同环比按[四态](references/comparison-rules.md)：上涨绿、下降红、0中性、缺失浅灰。方向不等于经营好坏；风险灯另按[业务矩阵](references/business-and-interaction.md)，未知阈值不编造。
- 字体按[逐槽位规范](references/typography.md)与[详情实测](references/indicator-detail-spec.md)，不以通用40/60覆盖环心或排名。实际字体缺失就明示回退，不能只检查CSS字体名称。
- 高／低户效等业务状态使用[带边框状态标签](references/status-tags.md)，来源7952:98702；高户效用正常绿色，低户效用严重橙色（用户已确认）。复用随包五态SVG或对应CSS，不能改成实底胶囊，也不套用同比环比涨跌标签。业务判定阈值不得编造。
- 颜色、透明度、圆角、间距按各业务来源，不全局归一。读[颜色](references/colors.md)、[间距](references/layout.md)、[图形几何](references/visual-specs.md)。品牌色、分类色、涨跌色、风险色分开。
- 紫色AI使用本地原图形象与背景；默认单行、查看详情。模板测试允许演示时要标模拟，不能因没接真实AI删除，也不能拿紫色条当全局数据警告。
- 排名保留第一/前一/自身/后一去重、完整字段、自身强调与精确数值；来源语义见[资金/设备排名](references/charging-self-ranking.md)。本地搜索/排序不代表生产权限已接入。

## 按需读取专项（全部随包可读）

|任务|本地参考|
|---|---|
|指标详情全部角色/图标/字号/原稿说明|[详情规范](references/indicator-detail-spec.md)、assets/indicator-detail-spec下CSV/JSON/原始SVG|
|整体参照条＋分类详情|[组合条样式](references/profit-composite-chart-pattern.md)、[资金口径](references/charging-funding-bar.md)|
|独立环/多环十态|[环图交互](references/chart-interaction-spec.md)、assets/chart-interaction-spec|
|趋势组合与五系列联合分析|[趋势专项](references/trend-series-pattern.md)|
|实收分类、渠道、账单主体|[实收模式](references/receipt-chart-patterns.md)|
|代扣、收费率、预存、欠费|[四业务模式](references/payment-business-chart-patterns.md)|
|标题/数字/期间/空态|[文案](references/content.md)、[同环比](references/comparison-rules.md)|
|柱、横条、转化、雷达等选型|[类型](references/chart-types.md)、[坐标轴](references/axis-rules.md)；同批三阶段用 `stageConversion`，现金流表内正负金额用 `cashflowInline`，实际与目标用 `actualTarget` 或 `chargeRateTarget`|
|日期与组织查询|[查询控件](references/query-controls.md)；完整日历页用 `picker:"calendar"`，底部选期用 `picker:"sheet"`|
|组织与筛选结构|[组件规则](references/components.md)|
|来源优先级、实施与已知冲突|[来源范围](references/sources-and-scope.md)、[落地核对](references/implementation-conformance.md)|

## 离线模式优先级

本节覆盖历史参考中“必须在线读取/复制原生节点、否则停止”的执行方式：用户已明确授权本地代码封装，因此使用随包模板及原始SVG，不进行常规Figma调用。历史来源要求仍约束视觉和语义；不足之处如实标差异，不靠“离线”掩盖近似实现。只有用户另外要求维护源文件、重新提取或写入Figma时，才使用对应工具。

## 交付

交付实际生成的自包含.html文件，并在最终回复附文件附件或下载链接；预览图仅作补充。另附简要UE/选型理由、数据来源/假设、组件及本地来源对应、验证结果与差异。离线HTML测试证明本地实现可运行，不能替代全组件视觉一致、真实业务接口、生产权限或用户验收。

[2026-11-04 completeness audit](references/completeness-audit-2026-11-04.md) records remaining extraction, implementation, visual and distribution gaps.

继续完善时，先查看 [当前补齐记录](references/offline-update-2026-11-05.md)；选择导航、组织、日历、排名与详情框架时读取 [组件九类边界](references/component-classification-1583.md)。

使用单环/多环及其异常态时，读取[原生环图状态与绑定边界](references/ring-native-states.md)，原件十态可通过nativeRingState离线展示，不将多环静态样本当任意数值算法。

需要日期或组织查询入口时读取[本地查询控件合同](references/query-controls.md)：采用独立草稿/提交状态、显式可选范围及事件绑定，不能把本地控件实现说成整页已查询或后台权限已实现。

高级筛选使用[字段版本与交互合同](references/advanced-filter.md)，区分历史全部选项与2026-02-25删减版本；字段显隐和重置/提交依明确配置，不能只移植静态面板。

同级/下辖排名读取[排名业务合同](references/business-ranking.md)，按明确序位选择邻位，同级先脱敏，无授权不下钻；业务事件与真实路由分开验收。

选取图表及主页卡片前，读取[当前原稿提取目录与选型边界](references/native-chart-extraction-2026-11-05.md)，优先查看原始SVG和逐段字体参数；原始素材已取得不等于运行模板已经原样适配。

主页卡片和预警亮灯说明的原始视觉/版本读取[主页与预警原稿提取](references/native-home-warning-extraction-2026-11-05.md)，旧版警示色与当前语义色分开保留，样本实测字号不擅自统一。用该引用的六款主页卡和 2026/07/21 版预警排名时，从 `example-home-warning.json` 取配置，并按需求替换数据。
