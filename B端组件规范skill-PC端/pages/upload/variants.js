// BeP Admin Kit · 上传组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:825 / 上传 Upload

var CANVAS_W = 1120;
var CANVAS_H = 720;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Upload Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1040, 640, { name:'上传 Upload', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('上传 Upload', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

function addLabel(text, x, y) {
  var label = bepText(text, B, 14, { lh:22, a:0.45, x:x, y:y });
  card.appendChild(label);
  return label;
}

function addNode(label, node, x, y) {
  addLabel(label, x, y);
  node.x = x;
  node.y = y + 30;
  card.appendChild(node);
}

addNode(
  '点击上传',
  bepUploadClick('点击上传', '仅支持xls、txt、png、jpg格式，大小在500KB以内'),
  32,
  84
);

addNode(
  '点击上传 Hover',
  bepUploadClick('点击上传', '仅支持xls、txt、png、jpg格式，大小在500KB以内', { state:'hover' }),
  360,
  84
);

addNode(
  '上传条 / 文件列表',
  bepUploadFileList([
    { name:'文件名称.txt' },
    { name:'上传中文件.txt', state:'uploading' },
    { name:'Hover文件.txt', state:'hover' },
    { name:'失败文件.txt', state:'error' }
  ], { width:280 }),
  32,
  194
);

addNode(
  '拖拽上传',
  bepUploadDragger({
    title:'点击或将文件拖拽到这里上传',
    desc:'支持扩展名：xls、txt、png、jpg',
    tip:'支持单个或批量上传'
  }),
  360,
  194
);

addNode(
  '拖拽上传 Hover',
  bepUploadDragger({
    state:'hover',
    title:'点击或将文件拖拽到这里上传',
    desc:'支持扩展名：xls、txt、png、jpg',
    tip:'支持单个或批量上传'
  }),
  760,
  194
);

addNode(
  '图片上传',
  bepImageUpload([
    { state:'default' },
    { state:'hover' },
    { state:'uploading' },
    { state:'success' },
    { state:'success-hover' },
    { state:'error' },
    { state:'error-hover' }
  ], { cols:7 }),
  32,
  454
);
