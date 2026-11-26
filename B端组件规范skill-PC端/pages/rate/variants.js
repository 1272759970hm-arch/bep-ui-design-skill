// BeP Admin Kit · 评分组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:710 / 评分 Rate

var CANVAS_W = 800;
var CANVAS_H = 420;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Rate Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(720, 340, { name:'评分 Rate', x:40, y:40, r:4, clip:true });
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('评分 Rate', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
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

addNode('Default / 3星 + 文案', bepRate(3), 32, 84);
addNode('5星 / 业务文案', bepRate(5, { text:'非常满意' }), 296, 84);
addNode('1星 / 业务文案', bepRate(1, { text:'较差' }), 32, 164);
addNode('0星 / 业务文案', bepRate(0, { text:'未评分' }), 296, 164);
addNode('仅星级 / 无文案', bepRate(4, { showText:false }), 32, 244);
