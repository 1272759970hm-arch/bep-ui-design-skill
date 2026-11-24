// BeP Admin Kit · 图表容器样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 87:62585、87:64392 / 数据看板图表区域

var CANVAS_W = 1240, CANVAS_H = 980;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'图表容器公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'ChartCard Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('图表容器 ChartCard', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var lineChart = bepChartCard({
    width:560,
    height:320,
    title:'趋势分析',
    subtitle:'更新截止于：2026/08/06',
    action:'更多',
    tabs:['数据统计', '市场趋势'],
    activeTab:0,
    type:'line',
    legend:['数据一', '数据二'],
    values:[36, 52, 44, 72, 64, 82, 58, 70],
    metrics:[
      { label:'本月销售额', value:'221' },
      { label:'环比增长', value:'+12.8%' }
    ]
  });
  lineChart.x = 24;
  lineChart.y = 76;
  card.appendChild(lineChart);

  var barChart = bepChartCard({
    width:560,
    height:320,
    title:'销售统计',
    action:'导出',
    type:'bar',
    legend:['线上', '门店', '渠道'],
    values:[42, 68, 54, 86, 62, 76, 48, 70]
  });
  barChart.x = 600;
  barChart.y = 76;
  card.appendChild(barChart);

  var rankChart = bepChartCard({
    width:560,
    height:260,
    title:'项目排行',
    type:'horizontal-bar',
    legend:['完成率'],
    labels:['项目一', '项目二', '项目三', '项目四', '项目五'],
    values:[84, 72, 61, 48, 36]
  });
  rankChart.x = 24;
  rankChart.y = 420;
  card.appendChild(rankChart);

  var donutChart = bepChartCard({
    width:272,
    height:260,
    title:'占比分布',
    type:'donut',
    legend:['已完成', '处理中'],
    centerValue:'68%'
  });
  donutChart.x = 600;
  donutChart.y = 420;
  card.appendChild(donutChart);

  var gaugeChart = bepChartCard({
    width:272,
    height:260,
    title:'达成率',
    type:'gauge',
    centerValue:'72%'
  });
  gaugeChart.x = 888;
  gaugeChart.y = 420;
  card.appendChild(gaugeChart);

  var wordCloud = bepChartCard({
    width:560,
    height:220,
    title:'关键词云',
    type:'word-cloud',
    words:['物业服务', '客户满意', '商机跟进', '门店运营', '履约', '投诉处理', '能耗', '巡检']
  });
  wordCloud.x = 24;
  wordCloud.y = 704;
  card.appendChild(wordCloud);

  var placeholder = bepChartCard({
    width:560,
    height:220,
    title:'自定义图表占位',
    type:'placeholder',
    placeholder:'业务图表区域',
    iconKey:'Line/pie-chart'
  });
  placeholder.x = 600;
  placeholder.y = 704;
  card.appendChild(placeholder);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('图表容器公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
