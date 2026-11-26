const assert=require('node:assert/strict');
const y=require('../assets/offline/yikan.js');
const f={funding:38400,charging:24568.56,added:1005.84};
const m=y.fundingModel(f);assert.equal(m.actual,25574.4);assert.equal(m.excluded,12825.6);assert.ok(Math.abs(m.percent-66.6)<1e-9);
const current={funding:4560,charging:3113.52,added:126.48};assert.ok(Math.abs(y.fundingModel(current).percent-71.05263157894737)<1e-9);
assert.throws(()=>y.fundingModel({...f,funding:0}));assert.throws(()=>y.fundingModel({...f,charging:40000}));assert.throws(()=>y.fundingModel({...f,charging:null}));
for(const category of ['charging','added']){const h=y.fundingBar({cumulative:f,current,category});assert.ok(h.includes('66.6'));assert.ok(h.includes('33.4'));assert.ok(h.includes(category));}
assert.throws(()=>y.donut({items:[{value:-1,name:'错误'}]}));
assert.ok(y.donut({items:[{value:0,name:'空'}]}).includes('暂无构成数据'));
assert.ok(y.comparison({value:0}).includes('0.00'));assert.ok(y.comparison({value:null}).includes('-%'));
assert.equal(y.relativeChange(50,40),25);assert.equal(y.relativeChange(50,0),null);
assert.equal(y.risk({metric:'outflow',value:102}), 'yellow');assert.equal(y.risk({metric:'outflow',value:102.1}),'red');assert.equal(y.risk({metric:'unknown',value:50}),null);assert.equal(y.risk({metric:'inflow',value:null}),null);
const malicious=y.aiHint({text:'<img src=x onerror=alert(1)>',detail:'<script>bad</script>'});assert.ok(!malicious.includes('<script>'));assert.ok(malicious.includes('&lt;img'));
assert.ok(y.trend({time:['1月','2月'],series:[{name:'数量',values:[1,2],unit:'桩',axis:'left'},{name:'比率',values:[40,null],unit:'%',axis:'right'}]}).includes('data-series="1"'));
assert.throws(()=>y.trend({time:['1'],series:[{name:'错',values:[1,2]}]}));
assert.ok(!y.assetBundle.includes('https://'));
console.log('runtime: formulas, category binding, invalid inputs, zero/missing, risk boundaries, escaping, trend alignment passed');

assert.match(y.ranking({appearance:'indicatorDetail'}), /data-ranking-appearance="indicatorDetail"/);
assert.doesNotMatch(y.ranking(), /data-ranking-appearance/);
const homeSourceCard=y.homeCard({source:'6671:152814',name:'两轮充电资金流水',value:'94.63',unit:'万',comparisonValue:3.23,comparisonLabel:'同'});
assert.match(homeSourceCard, /data-source="6671:152814"/);
assert.match(homeSourceCard, /<span>同<\/span>/);
assert.throws(()=>y.homeCard({source:'6671:152814',children:[{}]}));

const warningProps={metrics:[{label:'净',name:'示例指标'}],rows:[{rank:2,name:'区域 A',category:'A类',lights:['red']},{rank:2,name:'区域 B',category:'A类',lights:[null]}]};
const warningTable=y.warningRanking(warningProps);
assert.match(warningTable,/data-source="6671:171367"/);
assert.match(warningTable,/aria-label="示例指标：红灯"/);
assert.match(warningTable,/aria-label="示例指标：无数据"/);
assert.match(warningTable,/data-warning-red-count>—</);
assert.throws(()=>y.warningRanking({...warningProps,rows:[{rank:1,name:'区域 A',lights:[]}]}),/预警/);

const stages=[{name:'圈选客户',value:1000},{name:'触达客户',value:800},{name:'已缴费客户',value:240}];
const converted=y.stageConversion({items:stages,unit:'户'});
assert.match(converted,/6695:316711/);
for(const value of ['80%','30%','24%'])assert.ok(converted.includes(value));
assert.match(y.stageConversion({items:stages.map(stage=>({...stage,value:0}))}),/—/);
assert.throws(()=>y.stageConversion({items:[stages[1],stages[0],stages[2]]}),/包含/);
const signed=y.cashflowInline({unit:'万元',groups:[{name:'现金流净额',rows:[{name:'本期',value:60},{name:'差额',value:-30},{name:'零值',value:0},{name:'缺失',value:null}]}]});
assert.match(signed,/6695:315631/);
assert.match(signed,/data-direction="positive"><i style="width:100%/);
assert.match(signed,/data-direction="negative"><i style="width:50%/);
assert.match(signed,/data-direction="zero"/);
assert.match(signed,/data-direction="missing"/);

const amountGoal=y.actualTarget({actual:125,target:100,unit:'万元',segments:[80,45]});
assert.match(amountGoal,/6695:316767/);
assert.match(amountGoal,/125%/);
assert.match(amountGoal,/data-target-marker style="left:80%"/);
assert.match(y.actualTarget({actual:10,target:0}),/完成率：—/);
assert.throws(()=>y.actualTarget({actual:125,target:100,segments:[80,46]}),/合计/);
const chargeGoal=y.chargeRateTarget({rows:[{name:'综合收费率',actual:87.5,target:90},{name:'现金收费率',actual:100,target:85}]});
assert.match(chargeGoal,/6695:316799/);
assert.match(chargeGoal,/缺口 2\.5 个百分点/);
assert.match(chargeGoal,/超目标 15 个百分点/);
assert.doesNotMatch(y.chargeRateTarget({rows:[{name:'缺失',actual:null,target:90}]}),/缺口 90/);

const contractPeriods=[{label:'4月',eligible:1000,signed:600},{label:'5月',eligible:0,signed:0},{label:'6月',eligible:1200,signed:840}];
const contractTrend=y.contractTrend({periods:contractPeriods});
assert.match(contractTrend,/6695:316197/);
assert.match(contractTrend,/data-contract-rate d="M[^L"]+M[^L"]+"/);
assert.match(contractTrend,/70%/);
assert.throws(()=>y.contractTrend({periods:[{label:'4月',eligible:100,signed:101}]}),/分子不能超过分母/);

const analysis=y.withholdingAnalysis({
 signing:{periods:[{label:'7月',eligible:500,signed:300}]},
 cancellation:{periods:[{label:'7月',eligible:300,signed:30}]},
});
assert.match(analysis,/data-withholding-panel="signing"/);
assert.match(analysis,/data-withholding-panel="cancellation" hidden/);
assert.match(analysis,/签约率 60\.00%/);
assert.match(analysis,/解约率 10\.00%/);
assert.match(analysis,/已解约户数/);
assert.throws(()=>y.withholdingAnalysis({signing:{periods:[{label:'7月',eligible:1,signed:0}]},initialView:'cancellation'}),/初始/);

const payment=y.withholdingPayment({expected:500,paid:490.51,unit:'万元',basis:'amount'});
assert.match(payment,/98\.10%/);
assert.match(payment,/应代扣金额/);
assert.match(y.withholdingPayment({expected:0,paid:0}),/缺少数据/);
assert.throws(()=>y.withholdingPayment({expected:12,paid:13,basis:'amount'}),/超过/);
const payRanking=y.withholdingRankings({payment:{scopes:[{id:'all',kind:'subordinates',columns:['名次','项目','扣费成功率'],rows:[{name:'测试',id:'test',rank:1,values:[100]}]}]}});
assert.match(payRanking,/>100%<\/td>/);
assert.match(payRanking,/data-withholding-rank-panel="payment"/);

const satisfactionDims=['保洁','安防','管家','绿化','工程'].map((name,index)=>({name,current:80+index,highest:94,average:76}));
const satisfaction=y.satisfactionRadar({dimensions:satisfactionDims});
assert.match(satisfaction,/6695:316308/);
assert.match(satisfaction,/data-satisfaction-shape="highest"/);
assert.match(satisfaction,/data-satisfaction-axis="0" aria-pressed="true"/);
const partial=y.satisfactionRadar({dimensions:satisfactionDims.map((item,index)=>index===2?{...item,current:null}:item)});
assert.doesNotMatch(partial,/<polygon[^>]+data-satisfaction-shape="current"/);
assert.match(partial,/<path[^>]+data-satisfaction-shape="current"/);
assert.throws(()=>y.satisfactionRadar({dimensions:satisfactionDims.slice(1)}),/五或六/);

const grouped=y.signedPeriodBars({unit:'万元',periods:[{label:'5月',current:-40,previous:20},{label:'7月',current:0,previous:null}]});
assert.match(grouped,/6695:315326/);
assert.match(grouped,/data-period-zero/);
assert.match(grouped,/data-period-series="current" data-sign="negative"/);
assert.match(grouped,/−60万元/);
assert.match(grouped,/>0万元<\/td><td>—<\/td>/);
assert.throws(()=>y.signedPeriodBars({periods:[{label:'4月',current:'20',previous:10}]}),/数值/);

const amounts=y.yearAmountRings({modules:[{title:'预存冲抵',current:444.5,previous:550.1,unit:'亿元'}]});
assert.match(amounts,/6695:316042/);
assert.match(amounts,/994\.6亿元/);
assert.match(amounts,/44\.69%/);
assert.match(amounts,/55\.31%/);
const incompleteAmount=y.yearAmountRings({modules:[{title:'预存余额',current:0,previous:null,unit:'万元'}]});
assert.match(incompleteAmount,/0万元/);
assert.doesNotMatch(incompleteAmount,/data-amount-arc/);
assert.throws(()=>y.yearAmountRings({modules:[{title:'预存余额',current:-1,previous:0,unit:'万元'}]}),/非负/);

const receipt=y.receiptComposition({unit:'万元',items:[{name:'收缴',value:60},{name:'追缴',value:25},{name:'预存',value:15}]});
assert.match(receipt,/6695:315962/);
assert.match(receipt,/data-receipt-total>100万元/);
assert.match(receipt,/data-receipt-share>60%/);
assert.equal((receipt.match(/data-receipt-slice=/g)||[]).length,3);
const receiptPartial=y.receiptComposition({unit:'万元',items:[{name:'收缴',value:null},{name:'追缴',value:20},{name:'预存',value:0}]});
assert.match(receiptPartial,/data-receipt-total>—/);
assert.doesNotMatch(receiptPartial,/data-receipt-slice=/);

const gauge=y.monthlyRevenueGauge({unit:'亿元',annualTarget:50,months:[{month:8,actual:40,status:'below'},{month:9,actual:62.5,status:'met'}],selectedMonth:8});
assert.match(gauge,/6695:316886/);
assert.match(gauge,/data-gauge-month="8" data-status="below"/);
assert.match(gauge,/data-gauge-rate>80%/);
assert.match(gauge,/data-gauge-rate>125%/);
assert.match(gauge,/data-gauge-month="12" data-status="unrated"/);
assert.throws(()=>y.monthlyRevenueGauge({unit:'亿元',months:[{month:13,actual:40}]}),/月份/);
const negativeGauge=y.monthlyRevenueGauge({unit:'亿元',annualTarget:50,months:[{month:1,actual:-2}],selectedMonth:1});
assert.match(negativeGauge,/data-gauge-rate>-4%/);
assert.doesNotMatch(negativeGauge,/data-gauge-progress=/);

const categorical={labels:['保洁','工程'],unit:'%',series:[{name:'满意度',values:[80,null]}]};
assert.match(y.categoryColumns(categorical),/6695:315115/);
assert.match(y.categoryColumns({...categorical,series:[...categorical.series,{name:'目标',values:[100,0]}]}),/6695:315240/);
assert.throws(()=>y.categoryColumns({...categorical,series:[{name:'金额',unit:'元',values:[99,10]}]}),/同一量纲/);
assert.throws(()=>y.categoryColumns({...categorical,series:[{name:'实际',values:[-1,10]}]}),/非负/);

const dailyCurve={time:['1日','2日','3日'],unit:'万元',series:[{name:'实收',values:[10,null,0],previous:[12,8,0]}]};
const singleCurve=y.periodCurves(dailyCurve);
assert.match(singleCurve,/6695:314803/);
assert.match(singleCurve,/data-curve-main d="M[^CL"]+M[^CL"]+"/);
assert.match(singleCurve,/data-curve-previous.*stroke-dasharray/s);
assert.match(y.periodCurves({...dailyCurve,series:[...dailyCurve.series,{name:'预存',values:[1,2,3]}]}),/6695:314937/);
assert.throws(()=>y.periodCurves({...dailyCurve,series:[{name:'金额',unit:'元',values:[1,2,3]}]}),/同量纲/);

const singleRatio=y.ratioRings({items:[{name:'签约率',numerator:463,denominator:560,unit:'户'}]});
assert.match(singleRatio,/6695:315922/);
assert.match(singleRatio,/82\.68%/);
const independent=y.ratioRings({items:[{name:'小业主',numerator:75,denominator:100},{name:'客商',numerator:120,denominator:100},{name:'其他',numerator:0,denominator:0}]});
assert.match(independent,/6695:316135/);
assert.equal((independent.match(/data-ratio-fill=/g)||[]).length,2);
assert.match(independent,/data-ratio-overflow="1"/);
assert.match(independent,/120%/);
assert.match(independent,/缺少有效分母/);
assert.match(y.ratioRings({items:[{name:'冲正',numerator:-10,denominator:100}]}),/scale\(-1 1\)/);
assert.match(y.ratioRings({items:[{name:'超收',numerator:120,denominator:100}]}),/yk-ratio-overflow/);

const homeRevenue=y.homePerformanceCard({source:'6671:164095',scope:'集团整体',value:998.65,unit:'亿元',completion:52.7});
assert.match(homeRevenue,/data-source="6671:164095"/);
assert.match(homeRevenue,/width:52\.7%/);
const homeCashflow=y.homePerformanceCard({source:'6671:164196',scope:'国内＋海外＋股权',value:678.3,unit:'亿元',gap:{value:84.71,unit:'万元'},yoyDelta:{value:-41.71,unit:'万元'}});
assert.match(homeCashflow,/84\.71万元/);
assert.match(homeCashflow,/−41\.71万元/);
assert.doesNotMatch(homeCashflow,/data-performance-fill/);

const profitExplanation=y.homeProfitExplanation({updated:'10月26日',rate:9.03,profit:90.2,revenue:998.65,unit:'亿元',yoy:1.2,mom:-0.4});
assert.match(profitExplanation,/data-source="4424:72991"/);
assert.match(profitExplanation,/9\.03<small>%<\/small>/);
assert.match(profitExplanation,/税前利润（权责）[\s\S]*90\.2<small>亿元/);
assert.match(profitExplanation,/经营性收入（权责）[\s\S]*998\.65<small>亿元/);
assert.match(profitExplanation,/data-state="up"><span>同/);
assert.match(profitExplanation,/data-state="fall"><span>环/);
assert.doesNotMatch(profitExplanation,/完成率|data-performance-fill/);
const noRate=y.homeProfitExplanation({profit:0,revenue:0,unit:'万元'});
assert.match(noRate,/data-profit-rate>—<\/strong>/);
assert.match(noRate,/0<small>万元/);
assert.doesNotMatch(noRate,/更新|yk-comparison/);
assert.throws(()=>y.homeProfitExplanation({rate:'10%'}),/有限数值/);

const cashflowTargets=y.homeCashflowTargets({updated:'25/07 12:38',unit:'万',month:{net:988.2,yoyDelta:138.32},halfYear:{rate:-98.2,net:-123245.87,target:125505,yoyDelta:-38.2},year:{rate:0,net:0,target:220000}});
assert.match(cashflowTargets,/data-source="4424:72760"/);
assert.equal((cashflowTargets.match(/class="yk-home-divider"/g)||[]).length,2);
assert.match(cashflowTargets,/现金流当月净额[\s\S]*半年度达成率[\s\S]*年度达成率/);
assert.match(cashflowTargets,/同<\/span><span>138\.32万/);
assert.match(cashflowTargets,/data-state="fall"><span>同<\/span><span>38\.20万/);
assert.match(cashflowTargets,/-98\.20<small>%/);
assert.match(cashflowTargets,/年度目标<\/dt><dd>220000\.00<small>万/);
assert.match(y.homeCashflowTargets(),/data-cashflow-current>—<\/strong>/);
assert.throws(()=>y.homeCashflowTargets({month:{net:0}}),/金额单位/);
assert.throws(()=>y.homeCashflowTargets({year:{rate:'10%'}}),/有限数值/);

const homepageHead=y.homeHeader({organizations:[{id:'a',name:'当前项目',selectable:true}],value:'a'});
assert.match(homepageHead,/data-component="home-header"/);
assert.match(homepageHead,/data-home-selected>当前项目/);
assert.match(homepageHead,/aria-label="搜索组织"/);
assert.doesNotMatch(homepageHead,/data-home-peer=|年度 · 月度|驾驶舱/);

const homeBody=y.homeDashboard({project:{origin:'集团开发',area:'24万㎡',fee:'商业 4.5'},highlight:{label:'本年累计主营收费率',value:'86.56%'},cards:[{type:'homePerformanceCard',props:{source:'6671:164095',value:10,unit:'亿元'}}]});
assert.match(homeBody,/集团开发[\s\S]*86\.56%[\s\S]*10亿元/);
assert.doesNotMatch(y.homeDashboard({cards:[]}),/项目来源|重点信息/);
assert.throws(()=>y.homeDashboard({cards:[{type:'ranking'}]}),/主页卡/);

const segmentGauge=y.monthlyRevenueGauge({unit:'亿元',annualTarget:50,months:[{month:8,actual:40,sectors:[{name:'住宅',value:30},{name:'车位',value:8},{name:'其他',value:2}],referenceValue:46.5,referenceLabel:'军令状'}],selectedMonth:8});
assert.equal((segmentGauge.match(/data-gauge-sector=/g)||[]).length,3);
assert.match(segmentGauge,/data-gauge-reference="0.93"/);
assert.match(segmentGauge,/军令状 46.5亿元/);
assert.throws(()=>y.monthlyRevenueGauge({unit:'亿元',annualTarget:50,months:[{month:1,actual:10,sectors:[{name:'住宅',value:9}]}]}),/合计/);

const multiOverflow=y.ratioRings({items:[{name:'小业主',numerator:120,denominator:100},{name:'客商',numerator:175,denominator:100},{name:'其他',numerator:250,denominator:100}]});
assert.equal((multiOverflow.match(/data-ratio-overflow=/g)||[]).length,2);
assert.match(multiOverflow,/250%/);
assert.match(multiOverflow,/stroke-opacity=".36"/);

const largeRateCard=y.homeProfitExplanation({rate:9.03,profit:-12345.67,revenue:9999999.99,unit:'万元'});
assert.match(largeRateCard,/-12345.67<small>万元/);
assert.doesNotMatch(largeRateCard,/12,345|9,999/);
