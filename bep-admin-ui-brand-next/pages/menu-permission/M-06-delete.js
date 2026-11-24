// ── M-06  菜单权限管理·删除确认弹窗 ──────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 2026-06-01（重写版，全量使用标准组件）
// 场景：点击操作列"删除"链接，弹出确认弹窗
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件并运行

var CANVAS_W = 1440, CANVAS_H = 900;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  var bg = bepRect(CANVAS_W, CANVAS_H, BEP_C.pageBg);
  bg.name = 'Canvas/M-06'; bg.x = 0; bg.y = 0;
  figma.currentPage.appendChild(bg);

  // 弹窗内容：警告图标 + 提示文案
  var CONTENT_W = 400 - 24 * 2;  // 弹窗宽 - 左右padding
  var content = bepFrame(CONTENT_W, 48, { name:'DeleteContent' });
  content.fills = [];

  // 警告图标
  var warnIco = bepIcon('Fill/Abnormal', 20, bepHex('FFA645'));
  if (warnIco) { warnIco.x = 0; warnIco.y = 0; content.appendChild(warnIco); }

  // 提示文字（两行）
  var line1 = bepText('确定删除该菜单吗？', B, 14, { lh:22, a:0.85 });
  line1.x = 28; line1.y = 0;
  content.appendChild(line1);

  var line2 = bepText('删除后数据将无法恢复，请谨慎操作。', B, 14, { lh:22, a:0.45 });
  line2.x = 28; line2.y = 26;
  content.appendChild(line2);

  // 调整内容区高度
  content.resize(CONTENT_W, 48);

  var modal = bepModal('删除确认', content, {
    width: 400,
    confirmLabel: '确认删除',
    cancelLabel:  '取 消',
    canvasW: CANVAS_W,
    canvasH: CANVAS_H,
  });
  modal.x = 0; modal.y = 0;
  figma.currentPage.appendChild(modal);

  figma.viewport.scrollAndZoomIntoView([modal]);
  figma.notify('✅ M-06 删除确认弹窗 生成完成');
}
buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
