// BeP Admin Kit · 开关组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:710 / 开关 Switch

var CANVAS_W = 960;
var CANVAS_H = 560;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Switch Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(880, 480, { name:'开关 Switch', x:40, y:40, r:4, clip:true });
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('开关 Switch', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
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

addNode('Large / On', bepSwitch(true, '启用', '停用', { size:'large' }), 32, 84);
addNode('Large / Off', bepSwitch(false, '启用', '停用', { size:'large' }), 184, 84);
addNode('Large / On Disabled', bepSwitch(true, '启用', '停用', { size:'large', disabled:true }), 336, 84);
addNode('Large / Off Disabled', bepSwitch(false, '启用', '停用', { size:'large', disabled:true }), 536, 84);

addNode('Middle / On', bepSwitch(true, '启用', '停用'), 32, 164);
addNode('Middle / Off', bepSwitch(false, '启用', '停用'), 184, 164);
addNode('Middle / On Disabled', bepSwitch(true, '启用', '停用', { disabled:true }), 336, 164);
addNode('Middle / Off Disabled', bepSwitch(false, '启用', '停用', { disabled:true }), 536, 164);

addNode('Middle / On Loading', bepSwitch(true, '启用', '停用', { loading:true }), 32, 244);
addNode('Middle / Off Loading', bepSwitch(false, '启用', '停用', { loading:true }), 224, 244);
addNode('Middle / On Loading Disabled', bepSwitch(true, '启用', '停用', { loading:true, disabled:true }), 416, 244);
addNode('Middle / Off Loading Disabled', bepSwitch(false, '启用', '停用', { loading:true, disabled:true }), 656, 244);

addNode('Small / On', bepSwitch(true, '启用', '停用', { size:'small' }), 32, 324);
addNode('Small / Off', bepSwitch(false, '启用', '停用', { size:'small' }), 184, 324);
addNode('Small / On Disabled', bepSwitch(true, '启用', '停用', { size:'small', disabled:true }), 336, 324);
addNode('Small / Off Disabled', bepSwitch(false, '启用', '停用', { size:'small', disabled:true }), 536, 324);

addNode('Text / On', bepSwitch(true, '启用', '停用', { showText:true }), 32, 404);
addNode('Text / Off', bepSwitch(false, '启用', '停用', { showText:true }), 184, 404);
addNode('Text / On Disabled', bepSwitch(true, '启用', '停用', { showText:true, disabled:true }), 336, 404);
addNode('Text / Off Disabled', bepSwitch(false, '启用', '停用', { showText:true, disabled:true }), 536, 404);
