var CANVAS_W = 1040, CANVAS_H = 680;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'选择器公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Select Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('选择器公开 API 样例', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var items = [
    { label:'Select Default', node:bepSelect('请选择', 280, 32) },
    { label:'Select Hover', node:bepSelect('请选择', 280, 32, { state:'hover' }) },
    { label:'Select Complete', node:bepSelect('请选择', 280, 32, { value:'已选择' }) },
    { label:'Select Complete-Hover', node:bepSelect('请选择', 280, 32, { value:'已选择', state:'complete-hover' }) },
    { label:'Select Selected', node:bepSelect('请选择', 280, 32, { state:'selected' }) },
    { label:'Select Disabled', node:bepSelect('请选择', 280, 32, { disabled:true }) },
    { label:'Multi Default', node:bepMultiSelect('请选择', [], 280, 32) },
    { label:'Multi Complete', node:bepMultiSelect('请选择', ['选项一', '选项二', '选项三'], 280, 32) },
    { label:'Multi Selected', node:bepMultiSelect('请选择', [], 280, 32, { state:'selected' }) },
    { label:'Multi Disabled', node:bepMultiSelect('请选择', ['选项一', '选项二'], 280, 32, { disabled:true }) },
  ];

  var startX = 24;
  var startY = 72;
  var colW = 480;
  var rowH = 56;
  items.forEach(function(item, idx) {
    var col = idx % 2;
    var row = Math.floor(idx / 2);
    var x = startX + col * colW;
    var y = startY + row * rowH;
    var label = bepText(item.label, B, 12, { lh:16, a:0.45 });
    label.x = x;
    label.y = y;
    card.appendChild(label);
    item.node.x = x + 148;
    item.node.y = y - 8;
    card.appendChild(item.node);
  });

  var ddTitle = bepText('Dropdown', B, 12, { lh:16, a:0.45 });
  ddTitle.x = 24;
  ddTitle.y = 388;
  card.appendChild(ddTitle);
  var dropdown = bepDropdown([
    { label:'选项一（hover）', state:'hover' },
    { label:'选项二（常态）' },
    { label:'选项三（禁用）', state:'disabled' },
    { label:'选项四（选中）', state:'selected' },
  ], 280);
  dropdown.x = 172;
  dropdown.y = 380;
  card.appendChild(dropdown);

  var emptyTitle = bepText('Dropdown Empty', B, 12, { lh:16, a:0.45 });
  emptyTitle.x = 504;
  emptyTitle.y = 388;
  card.appendChild(emptyTitle);
  var empty = bepDropdown([], 280, { empty:true });
  empty.x = 652;
  empty.y = 380;
  card.appendChild(empty);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('选择器公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
