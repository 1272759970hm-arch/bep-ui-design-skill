// BeP Admin Kit · 提醒弹窗组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 704:28546 / 对话框 POP

var CANVAS_W = 1360;
var CANVAS_H = 530;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Alert Modal Variants', clip:true });
pageFrame.fills = bepSolid(BEP_C.white);
figma.currentPage.appendChild(pageFrame);

var title = bepText('对话框 POP', B, 16, { style:'Medium', lh:24, a:0.85, x:40, y:40 });
pageFrame.appendChild(title);

var danger = bepAlertModal('删除数据', '删除后数据将不可恢复，是否删除？', {
  type:'danger',
  confirmLabel:'删 除',
  overlay:false
});
danger.x = 242;
danger.y = 88;
pageFrame.appendChild(danger);

var warning = bepAlertModal('禁用数据', '禁用后，该数据将不会同步，是否禁用？', {
  type:'warning',
  confirmLabel:'禁 用',
  overlay:false
});
warning.x = 690;
warning.y = 88;
pageFrame.appendChild(warning);

var exit = bepAlertModal('退出编辑', '禁用后，该数据将不会同步，是否禁用？', {
  type:'info',
  confirmLabel:'退 出',
  overlay:false
});
exit.x = 242;
exit.y = 298;
pageFrame.appendChild(exit);

var info = bepAlertModal('普通标题', '这是一条普通提示内容表述，这是一条普通提示内容表述，这是一条普通提示内容表述。', {
  type:'info',
  confirmLabel:'知道了',
  showCancel:false,
  overlay:false
});
info.x = 690;
info.y = 298;
pageFrame.appendChild(info);
