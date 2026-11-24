// BeP Admin Kit · 全局提示 Message 样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 704:28544 / 全局提示 Message

var CANVAS_W = 520;
var CANVAS_H = 360;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Message Variants', clip:true });
pageFrame.fills = bepSolid(BEP_C.white);
figma.currentPage.appendChild(pageFrame);

var title = bepText('全局提示 Message', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:40 });
pageFrame.appendChild(title);

var messages = [
  bepMessage('消息提示', 'info'),
  bepMessage('成功提示', 'success'),
  bepMessage('失败提示', 'error'),
  bepMessage('加载中', 'loading')
];

for (var i = 0; i < messages.length; i++) {
  var msg = messages[i];
  msg.x = 40;
  msg.y = 88 + i * 72;
  pageFrame.appendChild(msg);
}
