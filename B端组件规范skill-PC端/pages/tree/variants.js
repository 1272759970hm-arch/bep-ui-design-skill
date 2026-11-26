// BeP Admin Kit · 树形组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 697:27653 / 树形组件 Tree

var CANVAS_W = 1040, CANVAS_H = 520;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'树形组件公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Tree Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('树形组件 Tree', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var basicTitle = bepText('基础树形', B, 16, { style:'Medium', lh:24, a:0.85 });
  basicTitle.x = 24;
  basicTitle.y = 76;
  card.appendChild(basicTitle);

  var basicTree = bepTree([
    { label:'一级菜单01', level:0, state:'expanded' },
    { label:'二级菜单01', level:1, state:'collapsed' },
    { label:'二级菜单02', level:1, state:'expanded' },
    { label:'三级菜单01', level:2, state:'expanded', selected:true },
    { label:'三级菜单02', level:2, state:'expanded' },
    { label:'三级菜单03', level:2, state:'expanded' },
    { label:'一级菜单02', level:0, state:'collapsed' },
    { label:'一级菜单03', level:0, state:'collapsed' },
  ], { width:260 });
  basicTree.x = 24;
  basicTree.y = 128;
  card.appendChild(basicTree);

  var simpleTree = bepTree([
    { label:'一级菜单', level:0, state:'collapsed' },
    { label:'一级菜单', level:0, state:'collapsed' },
    { label:'一级菜单', level:0, state:'expanded' },
  ], { width:180 });
  simpleTree.x = 328;
  simpleTree.y = 128;
  card.appendChild(simpleTree);

  var checkTitle = bepText('可选树形', B, 16, { style:'Medium', lh:24, a:0.85 });
  checkTitle.x = 552;
  checkTitle.y = 76;
  card.appendChild(checkTitle);

  var checkTree = bepTree([
    { label:'一级菜单', level:0, state:'expanded', indeterminate:true },
    { label:'一级菜单', level:1, state:'collapsed' },
    { label:'一级菜单', level:1, state:'expanded', indeterminate:true },
    { label:'二级菜单', level:2, state:'collapsed', checkboxState:'hover', selected:true },
    { label:'二级菜单', level:2, state:'collapsed', checked:true },
    { label:'二级菜单', level:2, state:'collapsed', checked:true },
    { label:'一级菜单', level:0, state:'collapsed', checked:true },
    { label:'一级菜单', level:0, state:'collapsed' },
  ], { width:300, checkable:true });
  checkTree.x = 552;
  checkTree.y = 128;
  card.appendChild(checkTree);

  var smallCheckTree = bepTree([
    { label:'一级菜单', level:0, state:'collapsed' },
    { label:'一级菜单', level:0, state:'collapsed' },
    { label:'一级菜单', level:0, state:'expanded' },
  ], { width:210, checkable:true });
  smallCheckTree.x = 864;
  smallCheckTree.y = 128;
  card.appendChild(smallCheckTree);

  var note = bepText('规则：Tree 是数据展示树；多列表格层级数据用树表格行，输入框形式选择树节点后续用树形选择器。', B, 14, {
    lh:22,
    a:0.45,
    x:24,
    y:416
  });
  note.resize(920, 22);
  note.textAutoResize = 'NONE';
  card.appendChild(note);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('树形组件公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
