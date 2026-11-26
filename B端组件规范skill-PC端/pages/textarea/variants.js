// BeP Admin Kit · 文本域 Textarea 样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:974 / 文本框-Default

var CANVAS_W = 860;
var CANVAS_H = 720;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Textarea Variants', clip:true });
pageFrame.fills = bepSolid(BEP_C.white);
figma.currentPage.appendChild(pageFrame);

var title = bepText('文本域 Textarea', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:32 });
pageFrame.appendChild(title);

var defaultArea = bepTextarea('请输入', 682, 134);
defaultArea.x = 40; defaultArea.y = 80;
pageFrame.appendChild(defaultArea);

var valueArea = bepTextarea('请输入', 682, 134, {
  value:'这是一段多行输入内容，用于备注、说明、规则内容等较长文本录入。',
  maxLength:100
});
valueArea.x = 40; valueArea.y = 246;
pageFrame.appendChild(valueArea);

var hoverArea = bepTextarea('请输入', 320, 104, { state:'hover' });
hoverArea.x = 40; hoverArea.y = 412;
pageFrame.appendChild(hoverArea);

var disabledArea = bepTextarea('请输入', 320, 104, { disabled:true });
disabledArea.x = 390; disabledArea.y = 412;
pageFrame.appendChild(disabledArea);

var errorArea = bepTextarea('请输入', 682, 104, {
  value:'超出最大长度的内容示例',
  error:true,
  errorText:'异常说明提示',
  count:120,
  maxLength:100
});
errorArea.x = 40; errorArea.y = 548;
pageFrame.appendChild(errorArea);
