// BeP Admin Kit · 表单/详情弹窗框架样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 705:28547 / 弹框 PopBox

var CANVAS_W = 1360;
var CANVAS_H = 814;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Modal Variants', clip:true });
pageFrame.fills = bepSolid(B, 0.45);
figma.currentPage.appendChild(pageFrame);

var title = bepText('弹框 PopBox', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:40 });
pageFrame.appendChild(title);

function placeholderContent(w, rows) {
  var wrap = bepFrame(w, rows * 56 - 24, { name:'ModalContentPlaceholder', clip:false });
  for (var i = 0; i < rows; i++) {
    var block = bepRect(w, 32, B, { a:0.04, x:0, y:i * 56 });
    wrap.appendChild(block);
  }
  return wrap;
}

var bigContent = placeholderContent(800 - 24 * 2, 1);
var big = bepModal('标题', bigContent, {
  width:800,
  variant:'form',
  overlay:false
});
big.x = 280;
big.y = 64;
pageFrame.appendChild(big);

var formContent = bepFrame(640 - 24 * 2, 88, { name:'FormContent', clip:false });
var LABEL_W = 90;
var nameItem = bepFormItem('商品名称', bepInput('请输入', 260, 32), { labelW:LABEL_W, required:true });
nameItem.x = 0;
nameItem.y = 0;
formContent.appendChild(nameItem);
var statusItem = bepFormItem('商品状态', bepSelect('请选择', 260, 32), { labelW:LABEL_W });
statusItem.x = 0;
statusItem.y = 56;
formContent.appendChild(statusItem);

var medium = bepModal('标题', formContent, {
  width:640,
  variant:'form',
  overlay:false
});
medium.x = 360;
medium.y = 290;
pageFrame.appendChild(medium);

var detailContent = bepDescriptions([
  {
    title:'',
    items:[
      { label:'商品名称', value:'品质棉质卫衣' },
      { label:'商品状态', tags:[{ label:'已上架', type:'success', style:'outline' }] }
    ]
  }
], 420 - 24 * 2, { columns:1, showSectionTitle:false });

var small = bepModal('标题', detailContent, {
  width:420,
  variant:'detail',
  overlay:false
});
small.x = 470;
small.y = 562;
pageFrame.appendChild(small);
