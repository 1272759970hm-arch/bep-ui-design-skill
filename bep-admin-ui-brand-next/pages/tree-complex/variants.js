// BeP Admin Kit · 复杂树形样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:75 / 复杂树形 ComplexTree

var CANVAS_W = 1120, CANVAS_H = 560;

var TREE_ITEMS = [
  { label:'一级菜单01', level:0, state:'expanded' },
  { label:'二级菜单01', level:1, state:'collapsed' },
  { label:'二级菜单02', level:1, state:'expanded' },
  { label:'三级菜单01', level:2, state:'leaf', selected:true },
  { label:'三级菜单02', level:2, state:'leaf' },
  { label:'三级菜单03', level:2, state:'leaf' },
  { label:'一级菜单02', level:0, state:'collapsed' },
  { label:'一级菜单03', level:0, state:'collapsed' },
];

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'复杂树形公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'ComplexTree Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('复杂树形 ComplexTree', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var normalTitle = bepText('组织树', B, 14, { style:'Medium', lh:22, a:0.85 });
  normalTitle.x = 24;
  normalTitle.y = 76;
  card.appendChild(normalTitle);

  var normalTree = bepComplexTree({
    title:'业务模块名称',
    width:232,
    height:390,
    searchable:true,
    nodeActions:true,
    treeItems:TREE_ITEMS
  });
  normalTree.x = 24;
  normalTree.y = 112;
  card.appendChild(normalTree);

  var loadingTitle = bepText('加载态', B, 14, { style:'Medium', lh:22, a:0.85 });
  loadingTitle.x = 296;
  loadingTitle.y = 76;
  card.appendChild(loadingTitle);

  var loadingTree = bepComplexTree({
    title:'业务模块名称',
    width:232,
    height:390,
    loading:true
  });
  loadingTree.x = 296;
  loadingTree.y = 112;
  card.appendChild(loadingTree);

  var dropdownTitle = bepText('标题下拉', B, 14, { style:'Medium', lh:22, a:0.85 });
  dropdownTitle.x = 568;
  dropdownTitle.y = 76;
  card.appendChild(dropdownTitle);

  var dropdownTree = bepComplexTree({
    title:'业务模块名称',
    width:232,
    height:390,
    searchable:true,
    titleOpen:true,
    selectedOption:'业务模块名称',
    dropdownOptions:['业务模块名称', '业务模块名称', '业务模块名称', '业务模块名称'],
    treeItems:TREE_ITEMS
  });
  dropdownTree.x = 568;
  dropdownTree.y = 112;
  card.appendChild(dropdownTree);

  var checkTitle = bepText('可选组织树', B, 14, { style:'Medium', lh:22, a:0.85 });
  checkTitle.x = 840;
  checkTitle.y = 76;
  card.appendChild(checkTitle);

  var checkTree = bepComplexTree({
    title:'业务模块名称',
    width:232,
    height:390,
    checkable:true,
    searchable:true,
    treeItems:[
      { label:'一级菜单01', level:0, state:'expanded', indeterminate:true },
      { label:'二级菜单01', level:1, state:'collapsed' },
      { label:'二级菜单02', level:1, state:'expanded', checked:true },
      { label:'三级菜单01', level:2, state:'leaf', selected:true, checked:true },
      { label:'三级菜单02', level:2, state:'leaf' },
      { label:'一级菜单02', level:0, state:'collapsed' },
    ]
  });
  checkTree.x = 840;
  checkTree.y = 112;
  card.appendChild(checkTree);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('复杂树形公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
