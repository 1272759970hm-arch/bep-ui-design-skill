// BeP Admin Kit · 指标数据卡片 MetricCard 样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 87:62585、87:64392 / 数据看板

var CANVAS_W = 760;
var CANVAS_H = 520;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'MetricCard Variants', clip:true });
pageFrame.fills = bepSolid(BEP_C.pageBg);
figma.currentPage.appendChild(pageFrame);

var title = bepText('指标数据卡片 MetricCard', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:32 });
pageFrame.appendChild(title);

var card1 = bepMetricCard({
  title:'指标一（万）',
  value:'12,986',
  unit:'万',
  iconKey:'Line/bar-chart',
  iconColor:bepHex('#6EA5FF')
});
card1.x = 40; card1.y = 80;
pageFrame.appendChild(card1);

var card2 = bepMetricCard({
  title:'指标二',
  value:'76%',
  iconKey:'Line/bar-chart-2',
  iconColor:bepHex('#52C95A'),
  trendItems:[
    { label:'比上周', value:'+11.3%', status:'up' },
    { label:'1290条', value:'', status:'neutral' }
  ]
});
card2.x = 344; card2.y = 80;
pageFrame.appendChild(card2);

var card3 = bepMetricCard({
  title:'图表标题',
  value:'12',
  unit:'小时',
  miniChart:'sparkline',
  chartColor:bepHex('#FF9C9C'),
  trendItems:[
    { label:'日环比', value:'11.3%', status:'neutral' },
    { label:'日同比', value:'100条', status:'neutral' }
  ]
});
card3.x = 40; card3.y = 224;
pageFrame.appendChild(card3);

var card4 = bepMetricCard({
  title:'图表标题',
  value:'78%',
  miniChart:'donut',
  chartColor:bepHex('#6EA5FF'),
  trendItems:[
    { label:'日环比', value:'11.3%', status:'neutral' },
    { label:'日同比', value:'100条', status:'neutral' }
  ]
});
card4.x = 344; card4.y = 224;
pageFrame.appendChild(card4);

var note = bepText('仅用于 KPI 摘要；完整图表、排行榜、表格、新闻列表不属于指标数据卡片。', B, 14, { lh:22, a:0.45, x:40, y:388 });
pageFrame.appendChild(note);
