// ── header/title-type.js ─────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 页头标题型四种组合样例
// 使用方式：运行 node scripts/tools/build.js header/title-type
// ═══════════════════════════════════════════════════════════════════════════

var CANVAS_W = 1440;
var CANVAS_H = 900;
var SIDE_W = 208;
var OUTER_PAD = 16;
var HEADER_W = CANVAS_W - SIDE_W;
var CONTENT_W = CANVAS_W - SIDE_W - OUTER_PAD * 2;

function makeProductImage(label) {
  var img = bepFrame(56, 56, { name:'ProductImage/' + label, r:8, clip:true });
  img.fills = bepSolid(bepHex('F5F7FA'));
  img.strokes = bepSolid(B, 0.10);
  img.strokeWeight = 1;
  img.strokeAlign = 'INSIDE';

  var block = bepRect(34, 28, bepHex('D9E8EF'), { x:11, y:12, r:4 });
  img.appendChild(block);
  var t = bepText(label, BEP_C.primary, 12, { lh:20 });
  t.x = Math.round((56 - t.width) / 2);
  t.y = 30;
  img.appendChild(t);
  return img;
}

function makeSectionLabel(text) {
  return bepText(text, B, 16, { style:'Medium', lh:24, a:0.85 });
}

function makeTitleOpts(label) {
  return {
    width: HEADER_W,
    title: '品质棉质卫衣',
    subtitle: 'SPU-20260626-00841 · 服装 / 男装 / 卫衣',
    imageNode: makeProductImage(label),
    status: { label:'已上架', type:'success' },
    tags: [{ label:'实物商品', type:'warning', style:'solid' }],
  };
}

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'页头标题型', clip:false });
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
    { label:'页头组件', level:2, state:'active' },
    { label:'描述列表', level:2, state:'default' },
  ].forEach(function(m) {
    var item = bepSidebarItem(m.label, m.level, m.state, m.icon);
    item.y = menuY;
    sidebar.appendChild(item);
    menuY += 48;
  });

  var header = bepHeader('页头标题型', ['组件规范', '页头组件'], HEADER_W);
  header.x = SIDE_W;
  header.y = 0;
  pageFrame.appendChild(header);

  var y = 96 + OUTER_PAD;
  var examples = [
    {
      label: '1. 标题',
      opts: makeTitleOpts('A'),
    },
    {
      label: '2. 标题 + 操作按钮',
      opts: Object.assign(makeTitleOpts('B'), {
        actions: [
          { label:'下架', type:'secondary' },
          { label:'编辑', type:'primary-outline' },
          { label:'下发门店', type:'primary' },
        ],
      }),
    },
    {
      label: '3. 标题 + Tabs',
      opts: Object.assign(makeTitleOpts('C'), {
        tabs: ['商品信息', '操作记录'],
        activeTab: 0,
      }),
    },
    {
      label: '4. 标题 + 操作按钮 + Tabs',
      opts: Object.assign(makeTitleOpts('D'), {
        actions: [
          { label:'下架', type:'secondary' },
          { label:'编辑', type:'primary-outline' },
          { label:'下发门店', type:'primary' },
        ],
        tabs: ['商品信息', '操作记录'],
        activeTab: 0,
      }),
    },
  ];

  examples.forEach(function(ex) {
    var label = makeSectionLabel(ex.label);
    label.x = SIDE_W + OUTER_PAD;
    label.y = y;
    pageFrame.appendChild(label);
    y += 32;

    var headerTitle = bepHeaderTitle(ex.opts);
    headerTitle.x = SIDE_W;
    headerTitle.y = y;
    pageFrame.appendChild(headerTitle);
    y += headerTitle.height + 32;
  });

  pageFrame.resize(CANVAS_W, Math.max(CANVAS_H, y));
  sidebar.resize(SIDE_W, pageFrame.height);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 页头标题型样例生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
