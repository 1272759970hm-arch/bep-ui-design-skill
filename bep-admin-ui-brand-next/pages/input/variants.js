var CANVAS_W = 960, CANVAS_H = 520;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'输入框公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Input Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('输入框公开 API 样例', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var items = [
    { label:'Default', node:bepInput('请输入', 280, 32) },
    { label:'Hover', node:bepInput('请输入', 280, 32, { state:'hover' }) },
    { label:'Complete', node:bepInput('请输入', 280, 32, { value:'输入完毕' }) },
    { label:'Disable', node:bepInput('请输入', 280, 32, { disabled:true }) },
    { label:'Error', node:bepInput('请输入', 280, 32, { error:true, errorText:'异常说明提示' }) },
    { label:'Clearable', node:bepInput('请输入', 280, 32, { value:'已输入', clearable:true }) },
    { label:'SuffixIcon', node:bepInput('请输入', 280, 32, { suffixIconKey:'Line/Remind' }) },
    { label:'Prefix', node:bepInput('请输入', 280, 32, { prefixText:'http' }) },
    { label:'Suffix', node:bepInput('请输入', 280, 32, { suffixText:'单位' }) },
    { label:'InputGroup', node:bepInputGroup('请选择', '请输入', 280) },
    { label:'InputGroupValue', node:bepInputGroup('身份证', '834783297482377', 280, { value:'834783297482377', inputHover:true }) },
  ];

  var startX = 24;
  var startY = 72;
  var colW = 424;
  var rowH = 64;
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
  figma.notify('输入框公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
