// BeP Admin Kit · 分页器组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 1390:26247 / 分页器 Pagination

var CANVAS_W = 1120;
var CANVAS_H = 420;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Pagination Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1040, 340, { name:'分页器 Pagination', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('分页器 Pagination', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

function addLabel(text, x, y) {
  var label = bepText(text, B, 14, { lh:22, a:0.45, x:x, y:y });
  card.appendChild(label);
}

function addNode(label, node, x, y) {
  addLabel(label, x, y);
  node.x = x;
  node.y = y + 30;
  card.appendChild(node);
}

addNode(
  '完整分页器',
  bepPagination('共300条', 1, [1, 2, 3, '…', 20], '10条/页', { disabledPrev:true }),
  32,
  84
);

addNode(
  '无跳页',
  bepPagination('共80条', 3, [1, 2, 3, 4, 5], '20条/页', { showJump:false }),
  32,
  166
);

addNode(
  '仅页码',
  bepPagination('', 2, [1, 2, 3], '10条/页', { showPageSize:false, showJump:false }),
  32,
  248
);
