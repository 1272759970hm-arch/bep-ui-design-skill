// ── header/variants.js ────────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 页头相关组件样例
// 使用方式：运行 node tools/build.js header/variants
// ═══════════════════════════════════════════════════════════════════════════

var CANVAS_W = 1440;
var CANVAS_H = 900;
var SIDE_W = 208;
var OUTER_PAD = 16;
var CONTENT_W = CANVAS_W - SIDE_W - OUTER_PAD * 2;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'页头组件形式', clip:false });
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

  function sectionLabel(text, y) {
    var t = bepText(text, B, 16, { style:'Medium', lh:24, a:0.85 });
    t.x = SIDE_W + OUTER_PAD;
    t.y = y;
    pageFrame.appendChild(t);
    return t;
  }

  var y = 32;

  sectionLabel('1. bepTopBar(totalWidth) - 页头第一行', y);
  y += 36;
  var topBar = bepTopBar(CONTENT_W);
  topBar.x = SIDE_W + OUTER_PAD;
  topBar.y = y;
  pageFrame.appendChild(topBar);
  y += topBar.height + 48;

  sectionLabel('2. bepTitleBar(title, crumbs, totalWidth, opts) - 标题栏，可带右侧操作', y);
  y += 36;
  var titleBar = bepTitleBar('页面标题', ['模块', '当前页'], CONTENT_W, {
    rightActions:[
      { label:'次要操作', type:'secondary' },
      { label:'主要操作', type:'primary' },
    ],
  });
  titleBar.x = SIDE_W + OUTER_PAD;
  titleBar.y = y;
  pageFrame.appendChild(titleBar);
  y += titleBar.height + 48;

  sectionLabel('3. bepHeader(title, crumbs, totalWidth) - 标准完整页头', y);
  y += 36;
  var header = bepHeader('标准完整页头', ['组件规范', '页头组件'], CONTENT_W);
  header.x = SIDE_W + OUTER_PAD;
  header.y = y;
  pageFrame.appendChild(header);
  y += header.height + 48;

  sectionLabel('4. bepTabs(tabs, activeIdx, totalWidth) - 替代 TitleBar 的页头页签', y);
  y += 36;
  var topBarForTabs = bepTopBar(CONTENT_W);
  topBarForTabs.x = SIDE_W + OUTER_PAD;
  topBarForTabs.y = y;
  pageFrame.appendChild(topBarForTabs);
  y += topBarForTabs.height;

  var tabs = bepTabs(
    ['选项一', '选项二', '选项三', '选项四', '选项五', '选项六', '选项七', '选项八', '选项九', '选项十', '选项十一', '选项十二'],
    1,
    CONTENT_W,
    { hoverIdx:2 }
  );
  tabs.x = SIDE_W + OUTER_PAD;
  tabs.y = y;
  pageFrame.appendChild(tabs);
  y += tabs.height + OUTER_PAD;

  pageFrame.resize(CANVAS_W, Math.max(CANVAS_H, y));
  sidebar.resize(SIDE_W, pageFrame.height);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 页头组件形式样例生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
