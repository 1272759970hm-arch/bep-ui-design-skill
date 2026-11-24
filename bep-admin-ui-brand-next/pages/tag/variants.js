// BeP Admin Kit · 标示 / 标签组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 697:27652 / 标示 Tag

var CANVAS_W = 1120;
var CANVAS_H = 420;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Tag Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1040, 340, { name:'标示 Tag', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('标示 Tag', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

function addLabel(text, x, y) {
  var label = bepText(text, B, 14, { lh:22, a:0.45, x:x, y:y });
  card.appendChild(label);
}

function addRow(label, tags, x, y) {
  addLabel(label, x, y);
  var tx = x;
  tags.forEach(function(tag) {
    tag.x = tx;
    tag.y = y + 30;
    card.appendChild(tag);
    tx += tag.width + 24;
  });
}

addRow('底色标示', [
  bepTag('未生效', 'disabled', 'solid'),
  bepTag('提示', 'info', 'solid'),
  bepTag('正常', 'success', 'solid'),
  bepTag('严重', 'warning', 'solid'),
  bepTag('危险', 'danger', 'solid')
], 32, 84);

addRow('边框标示', [
  bepTag('未生效', 'disabled', 'outline'),
  bepTag('提示', 'info', 'outline'),
  bepTag('正常', 'success', 'outline'),
  bepTag('严重', 'warning', 'outline'),
  bepTag('危险', 'danger', 'outline')
], 32, 156);

addRow('点标示', [
  bepTag('未生效', 'disabled', 'dot'),
  bepTag('提示', 'info', 'dot'),
  bepTag('正常', 'success', 'dot'),
  bepTag('严重', 'warning', 'dot'),
  bepTag('危险', 'danger', 'dot')
], 32, 228);

addRow('动态标签', [
  bepTag('标示一', 'info', 'closable'),
  bepTag('标示二', 'info', { closable:true }),
  bepTag('新标示', 'info', 'add')
], 560, 228);
