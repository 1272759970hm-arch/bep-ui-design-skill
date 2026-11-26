// BeP Admin Kit · 警告提示 Alert 样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 704:28544 / 警告提示 Alert

var CANVAS_W = 1120;
var CANVAS_H = 760;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Alert Variants', clip:true });
pageFrame.fills = bepSolid(BEP_C.white);
figma.currentPage.appendChild(pageFrame);

var title = bepText('警告提示 Alert', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:40 });
pageFrame.appendChild(title);

var normalAlerts = [
  bepAlert('这是一条普通提示的文案', null, { type:'info', width:680 }),
  bepAlert('这是一条成功提示的文案', null, { type:'success', width:680 }),
  bepAlert('这是一条警告提示的文案', null, { type:'warning', width:680 }),
  bepAlert('这是一条失败提示的文案', null, { type:'error', width:680 })
];

for (var i = 0; i < normalAlerts.length; i++) {
  var item = normalAlerts[i];
  item.x = 40;
  item.y = 88 + i * 56;
  pageFrame.appendChild(item);
}

var desc = '文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字说明。';
var largeAlerts = [
  bepAlert('普通提示', desc, { type:'info', variant:'large', width:959 }),
  bepAlert('成功提示', desc, { type:'success', variant:'large', width:959 }),
  bepAlert('警告提示', desc, { type:'warning', variant:'large', width:959 }),
  bepAlert('出错提示', desc + ' 文字说明文字说明。', {
    type:'error',
    variant:'large',
    width:959,
    actions:[{ label:'查看详情' }, { label:'立即处理' }]
  })
];

for (var j = 0; j < largeAlerts.length; j++) {
  var alert = largeAlerts[j];
  alert.x = 40;
  alert.y = 336 + j * 98;
  pageFrame.appendChild(alert);
}
