// ── D-03 销售管理·合同详情·Tab1 基本信息 ────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-27
// 独立 Frame：800px 合同详情抽屉，6 标签页，2 列描述列表

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "close":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular'  }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'   }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Semibold' }),
  ]);

  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a) {
    if (a === undefined) { a = 1; }
    return [{ type:'SOLID', color:color, opacity:a }];
  }

  const C = {
    pageBg:    hex('#F0F2F5'),
    white:     hex('#FFFFFF'),
    black:     hex('#000000'),
    primary:   hex('#006D9B'),
    danger:    hex('#FE5E54'),
    sidebarBg: hex('#002138'),
    sidebarSub:hex('#00182A'),
  };

  function rect(w, h, color, opts) {
    if (opts === undefined) { opts = {}; }
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a || 1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    return r;
  }
  function text(chars, color, size, opts) {
    if (opts === undefined) { opts = {}; }
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:opts.style || 'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? { value:opts.lh, unit:'PIXELS' } : { unit:'AUTO' };
    t.characters = chars;
    t.fills = solid(color, opts.a !== undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function icon(key, size, color, opacity) {
    if (opacity === undefined) { opacity = 1; }
    const svg = ICONS[key];
    if (!svg) { return null; }
    const node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(function(n) { return n.fills && n.fills.length > 0 && n.fills[0].type === 'SOLID'; }).forEach(function(n) { n.fills = solid(color, 1); });
    node.findAll(function(n) { return n.strokes && n.strokes.length > 0; }).forEach(function(n) { n.strokes = solid(color, 1); });
    return node;
  }

  // ── 布局常量 ──────────────────────────────────────────────────────────────
  const CANVAS_W  = 1440, CANVAS_H = 920;
  const SIDE_W    = 208;
  const DRAWER_W  = 800;
  const DRW_HDR_H = 56;
  const TAB_H     = 44;
  const DRW_FTR_H = 64;
  const BODY_PAD  = 24;
  const CONTENT_W = DRAWER_W - BODY_PAD * 2;   // 752
  const COL_GAP   = 24;
  const COL_W     = (CONTENT_W - COL_GAP) / 2; // 364
  const LBL_VAL_GAP = 16; // BeP 标准：label→value 间距 16px（同 autoLayout gap）
  const ROW_STEP  = 38;  // BeP 标准：22px 行高 + 16px 行间距

  // ── 按钮 ─────────────────────────────────────────────────────────────────
  function makeBtn(label, type) {
    if (type === undefined) { type = 'primary'; }
    const btn = figma.createFrame();
    btn.name = 'Btn/' + label;
    btn.cornerRadius = 4; btn.clipsContent = false;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO'; btn.counterAxisSizingMode = 'AUTO';
    btn.paddingLeft = 16; btn.paddingRight = 16;
    btn.paddingTop  = 5;  btn.paddingBottom = 5;
    btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER';
    btn.itemSpacing = 4;
    var tFills;
    if (type === 'primary') {
      btn.fills = solid(C.primary); btn.strokes = [];
      tFills = solid(C.white);
    } else if (type === 'danger') {
      btn.fills = solid(C.white);
      btn.strokes = [{ type:'SOLID', color:C.danger }];
      btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
      tFills = solid(C.danger);
    } else {
      btn.fills = solid(C.white);
      btn.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
      btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
      tFills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    }
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = label; t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    t.fills = tFills;
    btn.appendChild(t);
    return btn;
  }

  // ── 状态标签 ─────────────────────────────────────────────────────────────
  // 调色板：success / warning / danger / primary / default
  function makeTag(label, type) {
    var palettes = {
      success: { bg:hex('#F6FFED'), text:hex('#3BBB3E'), border:hex('#B7EB8F') },
      warning: { bg:hex('#FFFBE6'), text:hex('#FFA645'), border:hex('#FFE58F') },
      danger:  { bg:hex('#FFF2F0'), text:hex('#FE5E54'), border:hex('#FFCCC7') },
      primary: { bg:hex('#E6F4FB'), text:hex('#006D9B'), border:hex('#91C9DE') },
      default: { bg:hex('#FAFAFA'), text:hex('#000000'), border:hex('#D9D9D9') },
    };
    var p = palettes[type] || palettes.default;
    var tag = figma.createFrame();
    tag.name = 'Tag/' + label; tag.cornerRadius = 2; tag.clipsContent = false;
    tag.layoutMode = 'HORIZONTAL';
    tag.primaryAxisSizingMode = 'AUTO'; tag.counterAxisSizingMode = 'AUTO';
    tag.paddingLeft = 7; tag.paddingRight = 7; tag.paddingTop = 1; tag.paddingBottom = 1;
    tag.counterAxisAlignItems = 'CENTER';
    tag.fills = [{ type:'SOLID', color:p.bg }];
    tag.strokes = [{ type:'SOLID', color:p.border }];
    tag.strokeWeight = 1; tag.strokeAlign = 'INSIDE';
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 12; t.lineHeight = { value:20, unit:'PIXELS' };
    t.characters = label;
    t.fills = [{ type:'SOLID', color:p.text }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    tag.appendChild(t);
    return tag;
  }

  // ── 描述列表条目 ──────────────────────────────────────────────────────────
  // itemW: COL_W（双列）或 CONTENT_W（全宽）
  // valueNode: text node（makeDescTextVal）或 tag node（makeTag）
  // BeP 标准：value 颜色 rgba(0,0,0,0.65)，fontSize=14
  function makeDescTextVal(str) {
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = str;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    return t;
  }

  // BeP 标准：
  //   Label = 14px Regular rgba(0,0,0,0.85)，末尾带英文冒号，左对齐，宽度自动
  //   Value = 14px Regular rgba(0,0,0,0.65)，x = lbl.width + 16
  function makeDescItem(labelText, valueNode, isFullWidth) {
    var itemW = isFullWidth ? CONTENT_W : COL_W;
    var f = figma.createFrame();
    f.name = 'DescItem/' + labelText;
    f.resize(itemW, 22); f.fills = []; f.clipsContent = false;
    var lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = labelText + ':'; // BeP 标准：英文冒号
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }]; // label 更深
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    lbl.x = 0; lbl.y = 0;
    f.appendChild(lbl);
    valueNode.x = lbl.width + LBL_VAL_GAP; // 16px gap
    valueNode.y = 0;
    f.appendChild(valueNode);
    return f;
  }

  // ── 区块标题（左侧竖线 + 文字）────────────────────────────────────────────
  // BeP 标准：16px/24px Medium rgba(0,0,0,0.85)；左侧 3×16px 主色竖条
  function makeSectionTitle(title) {
    var f = figma.createFrame();
    f.name = 'SectionTitle/' + title;
    f.resize(CONTENT_W, 24); f.fills = []; f.clipsContent = false;
    // 左侧 3×16px 主色竖条，竖直居中于 24px 行高
    var bar = figma.createRectangle();
    bar.resize(3, 16); bar.fills = solid(C.primary);
    bar.x = 0; bar.y = 4; // (24-16)/2 = 4
    f.appendChild(bar);
    // 标题文字 16px Medium
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Medium' };
    t.fontSize = 16; t.lineHeight = { value:24, unit:'PIXELS' };
    t.characters = title;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 11; t.y = 0; // 3px bar + 8px gap
    f.appendChild(t);
    return f;
  }

  // ── 标签页栏（6 标签，Tab1 激活）──────────────────────────────────────────
  function makeTabBar() {
    var bar = figma.createFrame();
    bar.name = 'TabBar'; bar.resize(DRAWER_W, TAB_H);
    bar.fills = solid(C.white); bar.clipsContent = false;
    // 底部分割线
    bar.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:TAB_H - 1 }));

    var tabDefs = [
      { label:'基本信息',     active:true  },
      { label:'金额信息',     active:false },
      { label:'结算条款',     active:false },
      { label:'关联订单 (2)', active:false },
      { label:'附件',         active:false },
      { label:'操作日志',     active:false },
    ];

    var xCursor = BODY_PAD; // 24，与内容左边距对齐
    tabDefs.forEach(function(def) {
      var TAB_PH = 12; // 标签内水平内边距
      var lbl = figma.createText();
      lbl.fontName = { family:'PingFang SC', style:def.active ? 'Medium' : 'Regular' };
      lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
      lbl.characters = def.label;
      lbl.fills = def.active
        ? solid(C.primary)
        : [{ type:'SOLID', color:C.black, opacity:0.65 }];
      lbl.textAutoResize = 'WIDTH_AND_HEIGHT';

      var tabW = Math.ceil(lbl.width) + TAB_PH * 2;
      var tabItem = figma.createFrame();
      tabItem.name = 'Tab/' + def.label;
      tabItem.resize(tabW, TAB_H); tabItem.fills = []; tabItem.clipsContent = false;
      lbl.x = TAB_PH;
      lbl.y = Math.round((TAB_H - 22) / 2);
      tabItem.appendChild(lbl);

      if (def.active) {
        var ind = figma.createRectangle();
        ind.resize(tabW, 2); ind.fills = solid(C.primary);
        ind.x = 0; ind.y = TAB_H - 2;
        tabItem.appendChild(ind);
      }

      tabItem.x = xCursor; tabItem.y = 0;
      xCursor += tabW; // 相邻标签紧贴，内边距提供视觉间隔
      bar.appendChild(tabItem);
    });
    return bar;
  }

  // ── 侧边栏 ────────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64);
    area.fills = solid(C.sidebarBg); area.clipsContent = false;
    const box = rect(32, 32, C.primary, { r:6, x:24, y:16 });
    area.appendChild(box);
    area.appendChild(text('M', C.white, 14, { style:'Medium', lh:20, x:33, y:22 }));
    area.appendChild(text('Mall 管理后台', C.white, 16, { style:'Medium', lh:22, x:64, y:12 }));
    area.appendChild(text('MALL MANAGEMENT', C.white, 7, { lh:10, a:0.6, x:64, y:38 }));
    return area;
  }
  function makeSidebarDivider() {
    const w = figma.createFrame();
    w.name = 'SidebarDivider'; w.resize(208, 1); w.fills = []; w.clipsContent = false;
    w.appendChild(rect(160, 1, C.white, { a:0.08, x:24, y:0 }));
    return w;
  }
  function makeSidebarItem(label, level, state, iconKey) {
    var bgColor = level === 2 ? C.sidebarSub : C.sidebarBg;
    var isExpanded = state === 'expanded';
    var op = (state === 'active' || isExpanded) ? 1 : 0.5;
    const row = figma.createFrame();
    row.name = 'L' + level + '·' + label;
    row.resize(208, 48); row.fills = solid(bgColor); row.opacity = op; row.clipsContent = false;
    if (level === 1 && iconKey) {
      const ic = icon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }
    const textX = level === 1 ? 52 : 40;
    row.appendChild(text(label, C.white, 14, { lh:22, x:textX, y:13 }));
    if (level === 1) {
      const arr = icon(isExpanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, 1);
      if (arr) { arr.x = 186; arr.y = 18; row.appendChild(arr); }
    }
    return row;
  }
  function makeSidebar(height) {
    const s = figma.createFrame(); s.name = '侧边栏';
    s.layoutMode = 'VERTICAL'; s.itemSpacing = 0;
    s.primaryAxisSizingMode = 'FIXED'; s.counterAxisSizingMode = 'FIXED';
    s.resize(208, height); s.fills = solid(C.sidebarBg); s.clipsContent = false;
    s.appendChild(makeSidebarLogo());
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('商城运营', 1, 'collapsed', 'bar-chart-2'));
    s.appendChild(makeSidebarItem('销售管理', 1, 'expanded',  'briefcase'));
    s.appendChild(makeSidebarItem('合同管理', 2, 'active',    null));
    s.appendChild(makeSidebarItem('客户管理', 2, 'inactive',  null));
    s.appendChild(makeSidebarItem('报价单',   2, 'inactive',  null));
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('系统管理', 1, 'collapsed', 'settings'));
    return s;
  }

  // ── 抽屉主体 ──────────────────────────────────────────────────────────────
  function buildDrawer() {
    var drawer = figma.createFrame();
    drawer.name = '抽屉/合同详情'; drawer.resize(DRAWER_W, CANVAS_H);
    drawer.fills = solid(C.white); drawer.clipsContent = false;
    drawer.effects = [{
      type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
      color:{r:0,g:0,b:0,a:0.15}, offset:{x:-4,y:0}, radius:16, spread:0
    }];

    // ── 标题栏 ────────────────────────────────────────────────────────────
    var header = figma.createFrame();
    header.name = 'DrawerHeader'; header.resize(DRAWER_W, DRW_HDR_H);
    header.fills = solid(C.white); header.clipsContent = false;
    header.appendChild(text('合同详情', C.black, 16, { style:'Medium', lh:24, a:0.85, x:24, y:16 }));
    var closeIc = icon('close', 16, C.black, 0.45);
    if (closeIc) { closeIc.x = DRAWER_W - 36; closeIc.y = 20; header.appendChild(closeIc); }
    header.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:DRW_HDR_H - 1 }));
    header.x = 0; header.y = 0;
    drawer.appendChild(header);

    // ── 标签页栏 ──────────────────────────────────────────────────────────
    var tabBar = makeTabBar();
    tabBar.x = 0; tabBar.y = DRW_HDR_H;
    drawer.appendChild(tabBar);

    // ── 描述列表体 ────────────────────────────────────────────────────────
    var body = figma.createFrame();
    body.name = 'DrawerBody'; body.fills = solid(C.white); body.clipsContent = false;

    var yPos = BODY_PAD; // 24

    // 区块标题（16px/24px Medium，BeP 标准）
    var secTitle = makeSectionTitle('基本信息');
    secTitle.x = 0; secTitle.y = yPos;
    body.appendChild(secTitle);
    // title 高 24px + title→首行间距 24px（BeP 实测）
    yPos += 24 + 24; // → 72

    // Row 1：合同编号 | 合同类型
    var r1c1 = makeDescItem('合同编号', makeDescTextVal('HT2026030001'));
    r1c1.x = 0; r1c1.y = yPos;
    body.appendChild(r1c1);
    var r1c2 = makeDescItem('合同类型', makeTag('框架合同', 'primary'));
    r1c2.x = COL_W + COL_GAP; r1c2.y = yPos;
    body.appendChild(r1c2);
    yPos += ROW_STEP; // → 110

    // Row 2：合同名称（全宽）
    var r2 = makeDescItem('合同名称', makeDescTextVal('2026年度桶装水采购框架协议'), true);
    r2.x = 0; r2.y = yPos;
    body.appendChild(r2);
    yPos += ROW_STEP; // → 148

    // Row 3：客户名称 | 签约主体
    var r3c1 = makeDescItem('客户名称', makeDescTextVal('万科物业服务集团'));
    r3c1.x = 0; r3c1.y = yPos;
    body.appendChild(r3c1);
    var r3c2 = makeDescItem('签约主体', makeDescTextVal('万科物业服务集团有限公司'));
    r3c2.x = COL_W + COL_GAP; r3c2.y = yPos;
    body.appendChild(r3c2);
    yPos += ROW_STEP; // → 186

    // Row 4：销售人员 | 合同状态
    var r4c1 = makeDescItem('销售人员', makeDescTextVal('王明'));
    r4c1.x = 0; r4c1.y = yPos;
    body.appendChild(r4c1);
    var r4c2 = makeDescItem('合同状态', makeTag('已生效', 'success'));
    r4c2.x = COL_W + COL_GAP; r4c2.y = yPos;
    body.appendChild(r4c2);
    yPos += ROW_STEP; // → 224

    // Row 5：生效日期 | 到期日期
    var r5c1 = makeDescItem('生效日期', makeDescTextVal('2026-01-01'));
    r5c1.x = 0; r5c1.y = yPos;
    body.appendChild(r5c1);
    var r5c2 = makeDescItem('到期日期', makeDescTextVal('2026-12-31'));
    r5c2.x = COL_W + COL_GAP; r5c2.y = yPos;
    body.appendChild(r5c2);
    yPos += 22; // 最后一行内容高

    var bodyH = yPos + BODY_PAD; // 224+22+24 = 270
    // ⚠️ body 宽度必须是 CONTENT_W（752），不能是 DRAWER_W（800）
    // body.x=BODY_PAD=24，若 body.resize(800)，右侧会溢出抽屉 24px
    body.resize(CONTENT_W, bodyH);
    body.x = BODY_PAD;
    body.y = DRW_HDR_H + TAB_H; // 100
    drawer.appendChild(body);

    // ── 底部操作栏（合同已生效）─────────────────────────────────────────
    var footer = figma.createFrame();
    footer.name = 'DrawerFooter'; footer.resize(DRAWER_W, DRW_FTR_H);
    footer.fills = solid(C.white); footer.clipsContent = false;
    footer.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:0 }));

    var footerBtns = figma.createFrame();
    footerBtns.name = 'FooterBtns'; footerBtns.fills = []; footerBtns.clipsContent = false;
    footerBtns.layoutMode = 'HORIZONTAL';
    footerBtns.primaryAxisSizingMode = 'AUTO'; footerBtns.counterAxisSizingMode = 'AUTO';
    footerBtns.counterAxisAlignItems = 'CENTER'; footerBtns.itemSpacing = 8;
    // 从左到右：关闭（次要）→ 终止合同（次要）→ 创建订单（主要）
    footerBtns.appendChild(makeBtn('关闭',    'secondary'));
    footerBtns.appendChild(makeBtn('终止合同', 'secondary'));
    footerBtns.appendChild(makeBtn('创建订单', 'primary'));
    footer.appendChild(footerBtns);
    footerBtns.x = DRAWER_W - BODY_PAD - footerBtns.width;
    footerBtns.y = Math.round((DRW_FTR_H - footerBtns.height) / 2);

    footer.x = 0; footer.y = CANVAS_H - DRW_FTR_H;
    drawer.appendChild(footer);

    return drawer;
  }

  // ── 页面组装 ──────────────────────────────────────────────────────────────
  var root = figma.createFrame();
  root.name = 'D-03 合同详情·Tab1 基本信息';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = false;
  figma.currentPage.appendChild(root);

  var sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  // 半透明遮罩（抽屉弹出时列表页背景）
  var overlay = rect(CANVAS_W - SIDE_W, CANVAS_H, C.black, { a:0.40, x:SIDE_W, y:0 });
  root.appendChild(overlay);

  var drawer = buildDrawer();
  drawer.x = CANVAS_W - DRAWER_W; drawer.y = 0;
  root.appendChild(drawer);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
