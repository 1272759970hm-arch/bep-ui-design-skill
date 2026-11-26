// BeP Admin Kit · 日期选择器组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:674 / 日期选择器

var CANVAS_W = 1120;
var CANVAS_H = 760;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'DatePicker Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1040, 680, { name:'日期选择器', x:40, y:40, r:4, clip:true });
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('日期选择器', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

function addLabel(text, x, y) {
  var label = bepText(text, B, 14, { lh:22, a:0.45, x:x, y:y });
  card.appendChild(label);
  return label;
}

function addNode(label, node, x, y) {
  addLabel(label, x, y);
  node.x = x;
  node.y = y + 30;
  card.appendChild(node);
}

addNode('单日期 / Default', bepDate('请选择日期', 240, 32), 32, 84);
addNode('单日期 / Hover', bepDate('请选择日期', 240, 32, { state:'hover' }), 304, 84);
addNode('单日期 / Complete', bepDate('请选择日期', 240, 32, { value:'2022/05/08' }), 576, 84);

addNode('单日期 / Complete-Hover', bepDate('请选择日期', 240, 32, { value:'2022/05/08', state:'complete-hover' }), 32, 164);
addNode('单日期 / Disabled', bepDate('请选择日期', 240, 32, { disabled:true }), 304, 164);

addNode('日期区间 / Default', bepDateRange(300, 32), 32, 264);
addNode('日期区间 / Hover', bepDateRange(300, 32, { state:'hover' }), 376, 264);
addNode('日期区间 / Complete', bepDateRange(300, 32, { start:'2022/04/23', end:'2022/05/16' }), 720, 264);

addNode('日期区间 / Complete-Hover', bepDateRange(300, 32, { start:'2022/04/23', end:'2022/05/16', state:'complete-hover' }), 32, 344);
addNode('日期区间 / Disabled', bepDateRange(300, 32, { disabled:true }), 376, 344);

addNode('日期面板', bepDatePickerPanel({ yearMonth:'2022年5月', selectedDay:15 }), 32, 444);
addNode('日期区间面板', bepDateRangePanel({ leftTitle:'2022年4月', rightTitle:'2022年5月', startDay:23, endDay:16 }), 360, 444);
