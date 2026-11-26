// BeP Admin Kit · 步骤条组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 700:27657 / 步骤条 Steps

var CANVAS_W = 1120;
var CANVAS_H = 680;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Steps Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1040, 600, { name:'步骤条 Steps', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('步骤条 Steps', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
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

var basicSteps = [
  { title:'创建活动' },
  { title:'配置规则' },
  { title:'提交审核' },
  { title:'发布完成' }
];

var descSteps = [
  { title:'基础信息', desc:'填写商品基础资料' },
  { title:'销售信息', desc:'配置价格、库存和售卖范围' },
  { title:'提交审核', desc:'确认信息后提交运营审核' }
];

addNode('基础横向', bepSteps(basicSteps, 1, 960, { variant:'basic' }), 32, 84);
addNode('带描述横向', bepSteps(descSteps, 1, 960, { variant:'description' }), 32, 190);
addNode('竖式样式', bepSteps(descSteps, 1, 320, { variant:'vertical' }), 32, 326);
