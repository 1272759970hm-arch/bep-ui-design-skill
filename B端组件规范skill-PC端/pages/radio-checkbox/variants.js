// BeP Admin Kit · 单选组 / 多选组组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 695:27648 / 单选框 Radio + 多选框 CheckBox

var CANVAS_W = 960;
var CANVAS_H = 520;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Radio Checkbox Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(880, 440, { name:'单选组 / 多选组', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('单选组 / 多选组', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
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

addNode(
  'Radio 基础样式',
  bepRadioGroup(['门店', '收衣点', '网上平台'], '门店'),
  32,
  84
);

addNode(
  'Radio Hover / Disabled',
  bepRadioGroup([
    { label:'默认' },
    { label:'Hover', state:'hover' },
    { label:'禁用', disabled:true },
    { label:'选中禁用', disabled:true }
  ], '选中禁用'),
  32,
  164
);

addNode(
  'Radio 按钮样式',
  bepRadioGroup([
    { label:'未选中' },
    { label:'未选中hover', state:'hover' },
    { label:'选中' },
    { label:'禁用', disabled:true },
    { label:'选中禁用', disabled:true }
  ], '选中', { variant:'button' }),
  32,
  244
);

addNode(
  'Checkbox 基础样式',
  bepCheckboxGroup(['洗护', '保洁', '维修'], ['保洁', '维修']),
  520,
  84
);

addNode(
  'Checkbox Hover / Disabled',
  bepCheckboxGroup([
    { label:'默认' },
    { label:'Hover', state:'hover' },
    { label:'禁用', disabled:true },
    { label:'选中禁用', disabled:true }
  ], ['选中禁用']),
  520,
  164
);
