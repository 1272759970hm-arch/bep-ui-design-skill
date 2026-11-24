// ── description-list/value-types.js ───────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 描述列表 value 类型样例
// 使用方式：运行 node tools/build.js description-list/value-types
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

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'描述列表 value 类型样例', clip:false });
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
    { label:'描述列表', level:2, state:'active' },
    { label:'表格', level:2, state:'default' },
    { label:'表单', level:2, state:'default' },
  ].forEach(function(m) {
    var item = bepSidebarItem(m.label, m.level, m.state, m.icon);
    item.y = menuY;
    sidebar.appendChild(item);
    menuY += 48;
  });

  var header = bepHeader('描述列表 value 类型', ['组件规范', '描述列表'], CANVAS_W - SIDE_W);
  header.x = SIDE_W;
  header.y = 0;
  pageFrame.appendChild(header);

  var cardW = CANVAS_W - SIDE_W - OUTER_PAD * 2;
  var card = bepFrame(cardW, 100, { name:'Card', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD;
  card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var desc = bepDescriptions([
    {
      title:'基础 value 类型',
      items:[
        { label:'普通文本', value:'项目已完成初步验收' },
        { label:'内容标签', value:'已完成', tags:[{ label:'重点', type:'warning' }] },
        { label:'纯标签', tags:[
          { label:'启用', type:'success' },
          { label:'核心', type:'info' },
        ] },
        { label:'单链接', link:{ label:'查看合同详情' } },
        { label:'多链接', links:[
          { label:'付款记录' },
          { label:'审批流' },
          { label:'操作日志' },
        ], span:2 },
        { label:'附件', attachments:[
          { name:'合同扫描件.pdf', size:'2.4MB' },
          { name:'验收确认单.xlsx', size:'680KB' },
        ], span:2 },
      ],
    },
    {
      title:'媒体与长内容',
      items:[
        { label:'图片视频', media:[
          { label:'门头照片', type:'image' },
          { label:'现场照片', type:'image' },
          { label:'巡检视频', type:'video' },
        ], span:3 },
        { label:'长文本', value:'描述列表仍保持 label + value 的信息结构，附件、链接、标签、图片和视频只是 value 的不同承载类型。', long:true },
      ],
    },
  ], TABLE_W);
  desc.x = CARD_PAD;
  desc.y = CARD_PAD;
  card.appendChild(desc);

  card.resize(cardW, desc.y + desc.height + CARD_PAD);
  var totalH = card.y + card.height + OUTER_PAD;
  pageFrame.resize(CANVAS_W, Math.max(CANVAS_H, totalH));
  sidebar.resize(SIDE_W, pageFrame.height);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 描述列表 value 类型样例生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
