var CANVAS_W = 960, CANVAS_H = 560;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'数字输入框公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'InputNumber Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('数字输入框公开 API 样例', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var items = [
    { label:'Default', node:bepInputNumber('', 160, 32) },
    { label:'Hover', node:bepInputNumber('', 160, 32, { state:'hover' }) },
    { label:'Complete', node:bepInputNumber('1000', 160, 32) },
    { label:'Complete-Hover', node:bepInputNumber('1000', 160, 32, { state:'complete-hover' }) },
    { label:'Disable', node:bepInputNumber('', 160, 32, { disabled:true }) },
    { label:'Error', node:bepInputNumber('10000000000', 160, 32, { error:true, errorText:'超出最大限额' }) },
    { label:'Suffix', node:bepInputNumber('100', 280, 32, { suffixText:'单位', textAlpha:0.85 }) },
    { label:'Prefix', node:bepInputNumber('100', 280, 32, { prefixText:'数量', textAlpha:0.85 }) },
    { label:'Group', node:bepInputNumberGroup('请选择', '', 280) },
    { label:'Group-Complete', node:bepInputNumberGroup('请选择', '100', 280, { selectValue:'平方米', state:'complete', textAlpha:0.85 }) },
  ];

  var startX = 24;
  var startY = 72;
  var colW = 424;
  var rowH = 72;
  items.forEach(function(item, idx) {
    var col = idx % 2;
    var row = Math.floor(idx / 2);
    var x = startX + col * colW;
    var y = startY + row * rowH;
    var label = bepText(item.label, B, 12, { lh:16, a:0.45 });
    label.x = x;
    label.y = y;
    card.appendChild(label);
    item.node.x = x + 112;
    item.node.y = y - 8;
    card.appendChild(item.node);
  });

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('数字输入框公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
