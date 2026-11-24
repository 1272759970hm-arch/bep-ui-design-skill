// BeP Admin Kit · 数据看板模块样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 87:62585、87:64392 / 数据看板表格与排行榜

var CANVAS_W = 1240, CANVAS_H = 760;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'数据看板模块公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Dashboard Modules Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('数据看板模块 Dashboard Modules', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var tableCols = [
    { label:'项目名称', key:'name' },
    { label:'销售额', key:'amount', align:'right', w:120 },
    { label:'占比', key:'rate', align:'right', w:96 }
  ];
  var tableRows = [
    { name:'项目名称一', amount:'12,986', rate:'36%' },
    { name:'项目名称二', amount:'8,621', rate:'24%' },
    { name:'项目名称三', amount:'6,388', rate:'18%' },
    { name:'项目名称四', amount:'3,209', rate:'9%' },
    { name:'项目名称五', amount:'2,106', rate:'6%' }
  ];

  var tableCard = bepDashboardTableCard({
    width:560,
    height:320,
    title:'销售明细',
    subtitle:'更新截止于：2026/08/07',
    action:'更多',
    cols:tableCols,
    rows:tableRows
  });
  tableCard.x = 24;
  tableCard.y = 76;
  card.appendChild(tableCard);

  var tabTableCard = bepDashboardTableCard({
    width:560,
    height:320,
    title:'统计排行',
    action:'导出',
    tabs:['今日', '本周', '本月'],
    activeTab:1,
    cols:[
      { label:'门店', key:'store' },
      { label:'订单数', key:'orders', align:'right', w:96 },
      { label:'成交额', key:'amount', align:'right', w:120 }
    ],
    rows:[
      { store:'凤凰城服务中心', orders:'2,986', amount:'326,800' },
      { store:'城市花园服务中心', orders:'2,121', amount:'286,300' },
      { store:'天玺服务中心', orders:'1,988', amount:'209,640' },
      { store:'云湾服务中心', orders:'1,542', amount:'168,200' }
    ]
  });
  tabTableCard.x = 600;
  tabTableCard.y = 76;
  card.appendChild(tabTableCard);

  var rankCard = bepRankListCard({
    width:360,
    height:280,
    title:'门店排行榜',
    action:'更多',
    items:[
      { label:'凤凰城服务中心', value:'12,986', rate:92 },
      { label:'城市花园服务中心', value:'8,621', rate:76 },
      { label:'天玺服务中心', value:'6,388', rate:61 },
      { label:'云湾服务中心', value:'3,209', rate:48 },
      { label:'湖山服务中心', value:'2,106', rate:36 }
    ]
  });
  rankCard.x = 24;
  rankCard.y = 424;
  card.appendChild(rankCard);

  var rankTabCard = bepRankListCard({
    width:360,
    height:280,
    title:'商品排行榜',
    tabs:['销量', '销售额'],
    activeTab:0,
    items:[
      { label:'品质棉质卫衣', value:'9,821', rate:88 },
      { label:'基础款短袖', value:'8,108', rate:72 },
      { label:'轻薄防晒外套', value:'6,209', rate:58 },
      { label:'运动休闲长裤', value:'4,316', rate:43 },
      { label:'纯色针织衫', value:'2,986', rate:32 }
    ]
  });
  rankTabCard.x = 408;
  rankTabCard.y = 424;
  card.appendChild(rankTabCard);

  var compactTable = bepDashboardTableCard({
    width:392,
    height:280,
    title:'小型统计表',
    cols:[
      { label:'指标', key:'name' },
      { label:'数值', key:'value', align:'right', w:96 }
    ],
    rows:[
      { name:'总订单数', value:'12,986' },
      { name:'有效订单', value:'10,621' },
      { name:'退款订单', value:'318' },
      { name:'客单价', value:'126.8' }
    ]
  });
  compactTable.x = 792;
  compactTable.y = 424;
  card.appendChild(compactTable);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('数据看板模块公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
