// ── timeline/variants.js ─────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 时间轴标准组件样例
// 使用方式：运行 node tools/build.js timeline/variants
// ═══════════════════════════════════════════════════════════════════════════

var CANVAS_W  = 1440;
var CANVAS_H  = 900;
var SIDE_W    = 208;
var HDR_H     = 96;
var OUTER_PAD = 16;
var CARD_PAD  = 24;
var TABLE_W   = CANVAS_W - SIDE_W - OUTER_PAD * 2 - CARD_PAD * 2;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'时间轴标准组件样例', clip:false });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var sidebar = bepFrame(SIDE_W, CANVAS_H, { name:'Sidebar' });
  sidebar.fills = bepSolid(bepHex('002138'));
  pageFrame.appendChild(sidebar);

  var logo = bepSidebarLogo('BeP Admin', 'BEP ADMIN SYSTEM', SIDE_W);
  sidebar.appendChild(logo);

  var menuY = 80;
  [
    { label:'组件规范', level:1, state:'expanded', icon:'Line/Menu' },
    { label:'时间轴', level:2, state:'active' },
    { label:'描述列表', level:2, state:'default' },
    { label:'表格', level:2, state:'default' },
  ].forEach(function(m) {
    var item = bepSidebarItem(m.label, m.level, m.state, m.icon);
    item.y = menuY;
    sidebar.appendChild(item);
    menuY += 48;
  });

  var header = bepHeader('时间轴 Timeline', ['组件规范', '时间轴'], CANVAS_W - SIDE_W);
  header.x = SIDE_W;
  header.y = 0;
  pageFrame.appendChild(header);

  var cardW = CANVAS_W - SIDE_W - OUTER_PAD * 2;
  var card = bepFrame(cardW, 100, { name:'Card', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD;
  card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var titleA = bepText('带描述样式', B, 16, { style:'Medium', lh:24, a:0.85 });
  titleA.x = CARD_PAD;
  titleA.y = CARD_PAD;
  card.appendChild(titleA);

  var descTimeline = bepTimeline([
    {
      title:'提交申请',
      time:'2022/09/08 09:32:08',
      desc:'发起商品上架申请，等待运营审核。',
      status:'success',
    },
    {
      title:'不通过',
      time:'2022/09/08 10:12:31',
      desc:'商品主图不符合平台规范，请调整后重新提交。',
      status:'error',
      lineType:'dashed',
    },
    {
      title:'再次审批',
      time:'2022/09/08 14:08:22',
      desc:'运营重新进入审批流程，当前等待复核。',
      status:'processing',
    },
    {
      title:'结束流程',
      time:'2022/09/08 15:32:08',
      status:'end',
    },
  ], { width:624, variant:'description' });
  descTimeline.x = CARD_PAD;
  descTimeline.y = CARD_PAD + 48;
  card.appendChild(descTimeline);

  var titleB = bepText('基础样式', B, 16, { style:'Medium', lh:24, a:0.85 });
  titleB.x = CARD_PAD + 720;
  titleB.y = CARD_PAD;
  card.appendChild(titleB);

  var basicTimeline = bepTimeline([
    { title:'提交申请', time:'2022/09/08 09:32:08', status:'success' },
    { title:'不通过', time:'2022/09/08 10:12:31', status:'error' },
    { title:'再次审批', time:'2022/09/08 14:08:22', status:'processing', lineType:'dashed' },
    { title:'结束流程', time:'2022/09/08 15:32:08', status:'end' },
  ], { width:360, variant:'basic' });
  basicTimeline.x = CARD_PAD + 720;
  basicTimeline.y = CARD_PAD + 48;
  card.appendChild(basicTimeline);

  var contentH = Math.max(descTimeline.y + descTimeline.height, basicTimeline.y + basicTimeline.height);
  card.resize(cardW, contentH + CARD_PAD);
  var totalH = card.y + card.height + OUTER_PAD;
  pageFrame.resize(CANVAS_W, Math.max(CANVAS_H, totalH));
  sidebar.resize(SIDE_W, pageFrame.height);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 时间轴标准组件样例生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
