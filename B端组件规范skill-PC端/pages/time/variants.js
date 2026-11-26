// BeP Admin Kit · 时间选择器组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 696:27649 / 时间选择器

var CANVAS_W = 1120;
var CANVAS_H = 760;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'TimePicker Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1040, 680, { name:'时间选择器', x:40, y:40, r:4, clip:true });
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('时间选择器 TimePicker', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
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

addNode('时间选择器 / Default', bepTime('请选择时间', 240, 32), 32, 84);
addNode('时间选择器 / Hover', bepTime('请选择时间', 240, 32, { state:'hover' }), 304, 84);
addNode('时间选择器 / Complete', bepTime('请选择时间', 240, 32, { value:'00:00:00' }), 576, 84);

addNode('时间选择器 / Complete-Hover', bepTime('请选择时间', 240, 32, { value:'00:00:00', state:'complete-hover' }), 32, 164);
addNode('时间选择器 / Disabled', bepTime('请选择时间', 240, 32, { disabled:true }), 304, 164);

addNode('时间区间 / Default', bepTimeRange(240, 32), 32, 264);
addNode('时间区间 / Hover', bepTimeRange(240, 32, { state:'hover' }), 304, 264);
addNode('时间区间 / Complete', bepTimeRange(240, 32, { start:'00:00:00', end:'23:59:59' }), 576, 264);

addNode('时间区间 / Complete-Hover', bepTimeRange(240, 32, { start:'00:00:00', end:'23:59:59', state:'complete-hover' }), 32, 344);
addNode('时间区间 / Disabled', bepTimeRange(240, 32, { disabled:true }), 304, 344);

addNode('时间面板', bepTimePickerPanel({ value:'05:05:05', selected:'04' }), 32, 444);
addNode('时间区间面板', bepTimeRangePanel({ start:'05:05:05', end:'05:05:05', startSelected:'04', endSelected:'04' }), 304, 444);
