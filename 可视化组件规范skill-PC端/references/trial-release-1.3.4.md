# v1.3.4-trial.1 · 产品试用版

默认产物是可下载、自包含、离线打开的HTML。此版本优先放行详情页头、经营资金条、AI提示、同级/下辖排名和主页卡片的常用场景；不代表全Figma库已完成提取与验收。

## 生成时使用

- 指标详情的screen.header使用`layout:"indicatorDetail"`，配置明确`query`（value、years、today及可选min/max），不要继续生成简化静态日期头。默认导航为已记录的PingFang16/24业务变体；原模板DM Sans18/24使用`navFont:"dm"`。字体身份必须按来源选择。
- 摘要指标名称、更新时间、释义、主值与单位分别绑定。主值DIN Bold36/44、单位DIN Medium16/30；白色48%内容面和背景分层保留。只传需求明确的同比/环比，缺失不能补造。
- 经营资金条继续使用`fundingBar`完整分类曲面模板。不得用普通进度条、库默认条形图或新绘制样式代替。总流水T＝充电C＋增值V＋未计入U，实际占比(C＋V)/T；切换分类不改总体比例。
- 完整指标排名优先使用`detailRanking`，同级与下辖放在同一卡片。`peer`遵循既有businessRanking的peers合同；`subordinates`为subordinates范围数组。参考trial-ranking.json。未确认并列排名继续报错，不自行拆并列。
- 排名金额、名称、环比PingFang14/22；名次DIN16/24，摘要名次DIN24/24。前三采用原件18px圆形Counter参数。列宽44/90/94，数据行40，表头32，横滑时保留边缘阴影。
- 百分比列用`rateColumns:[3,4]`或单列`rateColumn:3`，传有符号number，按正/负/零/缺失显示；其他列需要单位时传完整显示字符串。排序只重排显示顺序，不重算名次。
- 金额需同时按数值排序和显示单位时，values保留number，配置`valueUnits:["万",""]`，对应名次和名称之后的指标列；`valueDigits`指定精度，默认2位。不要为了显示单位改成字符串排序。
- 同级在生成HTML数据写入前选取邻位并脱敏；下辖仅明确canDrill=true显示入口，派发本地事件，不伪称接入真实路由。

本地示例：`assets/offline/trial-funding.json`、`trial-ranking.json`、`trial-home.json`。执行`python3 scripts/build_page.py --data assets/offline/trial-funding.json --out 输出/经营情况.html`。

## 当前边界

日期控件可确认/取消和切换维度；示例中的金额为固定模拟快照，切换日期不请求或虚构另一期间的数据。页面级Tab若有多个业务页，应绑定真实面板，不可只改选中颜色冒充内容联动。

尚未放行：高级筛选新版全部状态、所有业务页变体、任意多圈/异常值图形、全库同数据逐像素验收。商业字体不随包分发；本机实际字体检查结果随本次验证报告记录，其他同事的电脑可能回退。

试用包用于需求到HTML流程测试及当前组件回归。不要声称完整Figma组件库已100%原样封装。旧版本安装包保留，新增版本单独分发。
