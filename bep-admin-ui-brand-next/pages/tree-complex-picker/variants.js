// BeP Admin Kit · 复杂树形选择面板样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:75 / 复杂树形 ComplexTree

var CANVAS_W = 1220, CANVAS_H = 780;

var PICKER_TREE_ITEMS = [
  { label:'一级菜单', level:0, state:'expanded', selected:true },
  { label:'二级菜单', level:1, state:'collapsed' },
  { label:'三级菜单', level:2, state:'leaf' },
  { label:'三级菜单', level:2, state:'leaf' },
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

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'复杂树形选择面板公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'ComplexTreePicker Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('复杂树形选择面板 ComplexTreePicker', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var large = bepComplexTreePicker({
    title:'业务模块名称',
    width:560,
    height:500,
    checkable:false,
    treeItems:PICKER_TREE_ITEMS,
    detailTitle:'三级菜单详情（共30条）',
    detailItems:[
      { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容' },
      { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容' },
      { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容', selected:true },
      { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容' },
      { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容', checked:true },
      { title:'三级菜单详细信息内容', desc:'可带详细的解释说明内容', checked:true },
    ],
    selectedTitle:'三级菜单名称（已选221）',
    selectedItems:['选项一', '选项二', '选项三', '选项四', '选项五', '选项六', '选项七', '选项八']
  });
  large.x = 24;
  large.y = 76;
  card.appendChild(large);

  var split = bepComplexTreePicker({
    title:'业务模块名称',
    width:520,
    height:320,
    showDetail:false,
    showSelected:false,
    treeItems:[
      { label:'一级菜单', level:0, state:'expanded', selected:true },
      { label:'一级菜单', level:0, state:'collapsed' },
      { label:'一级菜单', level:0, state:'collapsed' },
      { label:'一级菜单', level:0, state:'collapsed' },
      { label:'一级菜单', level:0, state:'collapsed' },
      { label:'一级菜单', level:0, state:'collapsed' },
      { label:'一级菜单', level:0, state:'collapsed' },
    ]
  });
  split.x = 620;
  split.y = 76;
  card.appendChild(split);

  var small = bepComplexTreePicker({
    title:'业务模块名称',
    width:420,
    height:320,
    leftWidth:420,
    showDetail:false,
    selectedHeight:54,
    checkable:true,
    treeItems:[
      { label:'一级菜单', level:0, state:'expanded', indeterminate:true },
      { label:'二级菜单', level:1, state:'collapsed' },
      { label:'二级菜单', level:1, state:'expanded', indeterminate:true },
      { label:'三级菜单', level:2, state:'leaf' },
      { label:'三级菜单', level:2, state:'leaf', checked:true },
      { label:'三级菜单', level:2, state:'leaf', checked:true },
      { label:'一级菜单', level:0, state:'collapsed' },
    ],
    selectedTitle:'项目（已选221）',
    selectedItems:[]
  });
  small.x = 620;
  small.y = 440;
  card.appendChild(small);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('复杂树形选择面板公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
