// BeP Admin Kit · 日期时间选择器组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:689 / 日期时间选择器

var CANVAS_W = 1280;
var CANVAS_H = 900;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' })
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'日期时间选择器组件样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(1120, 800, { name:'日期时间选择器', x:40, y:40, r:4, clip:true });
  card.fills = bepSolid(BEP_C.white);
  pageFrame.appendChild(card);

  var title = bepText('日期时间选择器 DateTimePicker', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
  card.appendChild(title);

  function addNode(label, node, x, y) {
    var cap = bepText(label, B, 12, { lh:16, a:0.45, x:x, y:y - 22 });
    card.appendChild(cap);
    node.x = x;
    node.y = y;
    card.appendChild(node);
  }

  addNode('日期时间选择器 / Default', bepDateTime('请选择日期', 400, 32), 32, 92);
  addNode('日期时间选择器 / Hover', bepDateTime('请选择日期', 400, 32, { state:'hover' }), 480, 92);
  addNode('日期时间选择器 / Complete', bepDateTime('请选择日期', 400, 32, { value:'2022/04/23 00:00:00' }), 32, 172);
  addNode('日期时间选择器 / Complete-Hover', bepDateTime('请选择日期', 400, 32, { value:'2022/04/23 00:00:00', state:'complete-hover' }), 480, 172);
  addNode('日期时间选择器 / Disabled', bepDateTime('请选择日期', 400, 32, { disabled:true }), 32, 252);

  addNode('日期时间区间 / Default', bepDateTimeRange(400, 32), 32, 352);
  addNode('日期时间区间 / Hover', bepDateTimeRange(400, 32, { state:'hover' }), 480, 352);
  addNode('日期时间区间 / Complete', bepDateTimeRange(400, 32, { start:'2022/04/23 00:00:00', end:'2022/05/16 00:00:00' }), 32, 432);
  addNode('日期时间区间 / Complete-Hover', bepDateTimeRange(400, 32, { start:'2022/04/23 00:00:00', end:'2022/05/16 00:00:00', state:'complete-hover' }), 480, 432);
  addNode('日期时间区间 / Disabled', bepDateTimeRange(400, 32, { disabled:true }), 32, 512);

  addNode('日期时间面板', bepDateTimePanel({ yearMonth:'2015年 1月', selectedDay:17, value:'05:05:05', timeSelected:'04' }), 32, 632);
  addNode('日期时间区间面板', bepDateTimeRangePanel({ yearMonth:'2015年 1月', selectedDay:17, value:'05:05:05', timeSelected:'04' }), 528, 632);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
}

buildPage();
