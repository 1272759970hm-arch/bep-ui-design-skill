// BeP Admin Kit · 抽屉样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 705:28548 / 抽屉 Drawer

var CANVAS_W = 1360;
var CANVAS_H = 800;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Drawer Variants', clip:true });
pageFrame.fills = bepSolid(BEP_C.pageBg);
figma.currentPage.appendChild(pageFrame);

var title = bepText('抽屉 Drawer', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:40 });
pageFrame.appendChild(title);

function placeholderContent(w, rows) {
  var wrap = bepFrame(w, rows * 56 - 24, { name:'DrawerContentPlaceholder', clip:false });
  for (var i = 0; i < rows; i++) {
    var block = bepRect(w, 32, B, { a:0.04, x:0, y:i * 56 });
    wrap.appendChild(block);
  }
  return wrap;
}

var bigContent = placeholderContent(800 - 24 * 2, 1);
var big = bepDrawer('带操作功能抽屉', bigContent, {
  width:800,
  variant:'form',
  canvasW:CANVAS_W,
  canvasH:CANVAS_H
});
pageFrame.appendChild(big);

var mediumContent = bepFrame(640 - 24 * 2, 88, { name:'DrawerFormContent', clip:false });
var LABEL_W = 90;
var nameItem = bepFormItem('商品名称', bepInput('请输入', 260, 32), { labelW:LABEL_W, required:true });
nameItem.x = 0;
nameItem.y = 0;
mediumContent.appendChild(nameItem);
var statusItem = bepFormItem('商品状态', bepSelect('请选择', 260, 32), { labelW:LABEL_W });
statusItem.x = 0;
statusItem.y = 56;
mediumContent.appendChild(statusItem);

var medium = bepDrawer('表单抽屉', mediumContent, {
  width:640,
  variant:'form',
  canvasW:960,
  canvasH:520
});
medium.x = 40;
medium.y = 160;
pageFrame.appendChild(medium);

var detailContent = bepDescriptions([
  {
    title:'',
    items:[
      { label:'商品名称', value:'品质棉质卫衣' },
      { label:'商品状态', tags:[{ label:'已上架', type:'success', style:'outline' }] },
      { label:'商品编号', value:'SPU-20260626-00841' }
    ]
  }
], 420 - 24 * 2, { columns:1, showSectionTitle:false });

var small = bepDrawer('详情抽屉', detailContent, {
  width:420,
  variant:'detail',
  canvasW:700,
  canvasH:360
});
small.x = 600;
small.y = 360;
pageFrame.appendChild(small);
