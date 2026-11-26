// BeP Admin Kit · 树形选择器样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:75 / 复杂树形 ComplexTree

var CANVAS_W = 980, CANVAS_H = 520;

var TREE_SELECT_ITEMS = [
  { label:'一级菜单', level:0, state:'expanded' },
  { label:'二级菜单', level:1, state:'collapsed' },
  { label:'一级菜单', level:1, state:'collapsed' },
  { label:'一级菜单', level:1, state:'collapsed' },
  { label:'一级菜单', level:0, state:'collapsed' },
  { label:'一级菜单', level:0, state:'collapsed' },
  { label:'一级菜单', level:0, state:'collapsed' },
  { label:'一级菜单', level:0, state:'collapsed' },
];

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'树形选择器公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'TreeSelect Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('树形选择器 TreeSelect', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var label1 = bepText('默认/已选/展开', B, 14, { style:'Medium', lh:22, a:0.85 });
  label1.x = 24;
  label1.y = 76;
  card.appendChild(label1);

  var defaultSelect = bepTreeSelect('请选择', 280, 32);
  defaultSelect.x = 24;
  defaultSelect.y = 112;
  card.appendChild(defaultSelect);

  var completeSelect = bepTreeSelect('请选择', 280, 32, { value:'三级菜单01' });
  completeSelect.x = 24;
  completeSelect.y = 160;
  card.appendChild(completeSelect);

  var openSelect = bepTreeSelect('请选择', 280, 32, { state:'selected' });
  openSelect.x = 24;
  openSelect.y = 208;
  card.appendChild(openSelect);

  var panel = bepTreeSelectPanel(TREE_SELECT_ITEMS, { width:280, height:220, activeIndex:0 });
  panel.x = 24;
  panel.y = 240;
  card.appendChild(panel);

  var label2 = bepText('多选树形选择', B, 14, { style:'Medium', lh:22, a:0.85 });
  label2.x = 360;
  label2.y = 76;
  card.appendChild(label2);

  var multiSelect = bepTreeSelect('请选择', 360, 32, {
    multiple:true,
    state:'selected',
    values:['三级菜单01', '三级菜单02', '三级菜单03'],
    maxVisible:3
  });
  multiSelect.x = 360;
  multiSelect.y = 112;
  card.appendChild(multiSelect);

  var multiPanel = bepTreeSelectPanel([
    { label:'一级菜单', level:0, state:'expanded', indeterminate:true },
    { label:'二级菜单', level:1, state:'collapsed' },
    { label:'二级菜单', level:1, state:'expanded', indeterminate:true },
    { label:'三级菜单01', level:2, state:'leaf', checked:true, selected:true },
    { label:'三级菜单02', level:2, state:'leaf', checked:true },
    { label:'三级菜单03', level:2, state:'leaf' },
    { label:'一级菜单', level:0, state:'collapsed' },
  ], { width:360, height:260, checkable:true });
  multiPanel.x = 360;
  multiPanel.y = 144;
  card.appendChild(multiPanel);

  var label3 = bepText('禁用态', B, 14, { style:'Medium', lh:22, a:0.85 });
  label3.x = 776;
  label3.y = 76;
  card.appendChild(label3);

  var disabledSelect = bepTreeSelect('请选择', 140, 32, { disabled:true });
  disabledSelect.x = 776;
  disabledSelect.y = 112;
  card.appendChild(disabledSelect);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('树形选择器公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
