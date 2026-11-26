// BeP Admin Kit · 级联选择器组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 696:27650 / 级联选择器

var CANVAS_W = 1040, CANVAS_H = 640;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'级联选择器公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Cascader Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('级联选择器 Cascader', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var items = [
    { label:'Default', node:bepCascader('请选择', 280, 32) },
    { label:'Hover', node:bepCascader('请选择', 280, 32, { state:'hover' }) },
    { label:'Selected / Open', node:bepCascader('请选择', 280, 32, { state:'selected' }) },
    { label:'Complete', node:bepCascader('请选择', 280, 32, { value:'海南省/三亚市/吉阳区' }) },
    { label:'Complete Hover', node:bepCascader('请选择', 280, 32, { value:'海南省/吉阳区/吉阳区', state:'complete-hover' }) },
    { label:'Disabled', node:bepCascader('请选择', 280, 32, { disabled:true }) },
  ];

  var startX = 24;
  var startY = 76;
  var colW = 320;
  var rowH = 56;
  items.forEach(function(item, idx) {
    var col = idx % 3;
    var row = Math.floor(idx / 3);
    var x = startX + col * colW;
    var y = startY + row * rowH;
    var label = bepText(item.label, B, 12, { lh:16, a:0.45 });
    label.x = x;
    label.y = y;
    card.appendChild(label);
    item.node.x = x;
    item.node.y = y + 20;
    card.appendChild(item.node);
  });

  var singleTitle = bepText('单选展开面板', B, 12, { lh:16, a:0.45 });
  singleTitle.x = 24;
  singleTitle.y = 216;
  card.appendChild(singleTitle);

  var singleTrigger = bepCascader('请选择', 356, 32, { state:'selected' });
  singleTrigger.x = 24;
  singleTrigger.y = 240;
  card.appendChild(singleTrigger);
  var singlePanel = bepCascaderPanel([
    [
      { label:'广东省', state:'active' },
      { label:'湖南省' },
      { label:'广西省', disabled:true },
      { label:'海南省', state:'selected' },
    ],
    [
      { label:'三亚市', state:'active' },
      { label:'三沙市' },
      { label:'海口市', disabled:true },
      { label:'儋州市', state:'selected' },
    ],
    [
      { label:'海棠区', state:'selected', leaf:true },
      { label:'吉阳区', leaf:true },
      { label:'天涯区', leaf:true },
      { label:'崖州区', leaf:true },
    ],
  ]);
  singlePanel.x = 24;
  singlePanel.y = 276;
  card.appendChild(singlePanel);

  var multiTitle = bepText('多选展开面板', B, 12, { lh:16, a:0.45 });
  multiTitle.x = 420;
  multiTitle.y = 216;
  card.appendChild(multiTitle);

  var multiTrigger = bepCascader('请选择', 364, 32, { value:'已选择8项' });
  multiTrigger.x = 420;
  multiTrigger.y = 240;
  card.appendChild(multiTrigger);
  var multiPanel = bepCascaderPanel([
    [
      { label:'广东省' },
      { label:'湖南省' },
      { label:'广西省', disabled:true },
      { label:'海南省', indeterminate:true },
    ],
    [
      { label:'三亚市' },
      { label:'三沙市' },
      { label:'海口市', disabled:true },
      { label:'儋州市', indeterminate:true },
    ],
    [
      { label:'海棠区', checked:true, leaf:true },
      { label:'吉阳区', leaf:true },
      { label:'天涯区', leaf:true },
      { label:'崖州区', checked:true, leaf:true },
    ],
  ], { multiple:true });
  multiPanel.x = 420;
  multiPanel.y = 276;
  card.appendChild(multiPanel);

  var summaryTitle = bepText('多选已选态', B, 12, { lh:16, a:0.45 });
  summaryTitle.x = 824;
  summaryTitle.y = 216;
  card.appendChild(summaryTitle);
  var summary = bepCascader('请选择', 160, 90, {
    multiple:true,
    values:['选项一', '选项二', '选项三', '选项四', '选项五', '选项六', '选项七', '选项八'],
    state:'selected',
    maxVisible:8
  });
  summary.x = 824;
  summary.y = 240;
  card.appendChild(summary);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('级联选择器公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
