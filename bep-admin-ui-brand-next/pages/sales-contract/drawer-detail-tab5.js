// ── D-07 销售管理·合同详情·Tab5 附件 ────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-27
// 独立 Frame：800px 合同详情抽屉，6 标签页，Tab5 附件（有/无两种状态）
// 画布高度拉到 1280px 以垂直并排两种状态，方便设计标注对比

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "close":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "paperclip":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.44 11.05L12.25 20.24C11.1218 21.3682 9.59383 22.0006 8.00003 22.0006C6.40623 22.0006 4.87826 21.3682 3.75003 20.24C2.6218 19.1118 1.98938 17.5838 1.98938 16C1.98938 14.4162 2.6218 12.8882 3.75003 11.76L12.94 2.57C13.6888 1.82122 14.6948 1.40007 15.745 1.40007C16.7952 1.40007 17.8012 1.82122 18.55 2.57C19.2988 3.31878 19.72 4.32479 19.72 5.375C19.72 6.42521 19.2988 7.43122 18.55 8.18L9.35003 17.37C8.97562 17.7444 8.46782 17.9549 7.93803 17.9549C7.40824 17.9549 6.90044 17.7444 6.52603 17.37C6.15162 16.9956 5.94111 16.4878 5.94111 15.958C5.94111 15.4282 6.15162 14.9204 6.52603 14.546L15.07 6.00001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "inbox":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
  // 画布纵向拉伸以容纳两种状态
  const CANVAS_W  = 1440;
  const CANVAS_H  = 1360; // 加高：两个抽屉状态垂直排布 + 间距
  const SIDE_W    = 208;
  const DRAWER_W  = 800;
  const DRW_HDR_H = 56;
  const TAB_H     = 44;
  const DRW_FTR_H = 64;
  const BODY_PAD  = 24;
  const CONTENT_W = DRAWER_W - BODY_PAD * 2; // 752

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

  // ── 区块标题 ──────────────────────────────────────────────────────────────
  function makeSectionTitle(title) {
    var f = figma.createFrame();
    f.name = 'SectionTitle/' + title;
    f.resize(CONTENT_W, 24); f.fills = []; f.clipsContent = false;
    var bar = figma.createRectangle();
    bar.resize(3, 16); bar.fills = solid(C.primary);
    bar.x = 0; bar.y = 4;
    f.appendChild(bar);
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Medium' };
    t.fontSize = 16; t.lineHeight = { value:24, unit:'PIXELS' };
    t.characters = title;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 11; t.y = 0;
    f.appendChild(t);
    return f;
  }

  // ── 附件行（单条文件，含预览 + 下载操作）────────────────────────────────
  function makeFileItem(filename) {
    var FILE_ROW_H = 44;
    var row = figma.createFrame();
    row.name = 'FileItem/' + filename;
    row.resize(CONTENT_W, FILE_ROW_H);
    row.fills = []; row.clipsContent = false;
    // 底部分隔线
    row.appendChild(rect(CONTENT_W, 1, C.black, { a:0.06, x:0, y:FILE_ROW_H - 1 }));

    // 回形针图标
    var ic = icon('paperclip', 16, C.primary, 1);
    if (ic) { ic.x = 0; ic.y = Math.round((FILE_ROW_H - 16) / 2); row.appendChild(ic); }

    // 文件名
    var fname = figma.createText();
    fname.fontName = { family:'PingFang SC', style:'Regular' };
    fname.fontSize = 14; fname.lineHeight = { value:22, unit:'PIXELS' };
    fname.characters = filename;
    fname.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    fname.textAutoResize = 'WIDTH_AND_HEIGHT';
    fname.x = 24; fname.y = Math.round((FILE_ROW_H - 22) / 2);
    row.appendChild(fname);

    // 下载 操作（最右）
    var btnDl = figma.createText();
    btnDl.fontName = { family:'PingFang SC', style:'Regular' };
    btnDl.fontSize = 14; btnDl.lineHeight = { value:22, unit:'PIXELS' };
    btnDl.characters = '下载';
    btnDl.fills = solid(C.primary);
    btnDl.textAutoResize = 'WIDTH_AND_HEIGHT';
    btnDl.x = CONTENT_W - btnDl.width;
    btnDl.y = Math.round((FILE_ROW_H - 22) / 2);
    row.appendChild(btnDl);

    // 预览 操作（下载左侧，间距 16px）
    var btnPv = figma.createText();
    btnPv.fontName = { family:'PingFang SC', style:'Regular' };
    btnPv.fontSize = 14; btnPv.lineHeight = { value:22, unit:'PIXELS' };
    btnPv.characters = '预览';
    btnPv.fills = solid(C.primary);
    btnPv.textAutoResize = 'WIDTH_AND_HEIGHT';
    btnPv.x = btnDl.x - 16 - btnPv.width;
    btnPv.y = btnDl.y;
    row.appendChild(btnPv);

    return row;
  }

  // ── 空状态（暂无附件）────────────────────────────────────────────────────
  function makeEmptyState() {
    var EMPTY_H = 160;
    var f = figma.createFrame();
    f.name = 'EmptyState/附件';
    f.resize(CONTENT_W, EMPTY_H);
    f.fills = []; f.clipsContent = false;

    // 中心 inbox 图标
    var ic = icon('inbox', 40, C.black, 0.15);
    if (ic) {
      ic.x = Math.round((CONTENT_W - 40) / 2);
      ic.y = 44;
      f.appendChild(ic);
    }

    // 文字
    var lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = '暂无附件';
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    lbl.x = Math.round((CONTENT_W - lbl.width) / 2);
    lbl.y = 92;
    f.appendChild(lbl);

    return f;
  }

  // ── 标签页栏 ──────────────────────────────────────────────────────────────
  function makeTabBar(activeLabel) {
    var bar = figma.createFrame();
    bar.name = 'TabBar'; bar.resize(DRAWER_W, TAB_H);
    bar.fills = solid(C.white); bar.clipsContent = false;
    bar.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:TAB_H - 1 }));

    var tabDefs = [
      '基本信息', '金额信息', '结算条款', '关联订单 (2)', '附件', '操作日志',
    ];

    var xCursor = BODY_PAD;
    tabDefs.forEach(function(label) {
      var isActive = label === activeLabel;
      var TAB_PH = 12;
      var lbl = figma.createText();
      lbl.fontName = { family:'PingFang SC', style:isActive ? 'Medium' : 'Regular' };
      lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
      lbl.characters = label;
      lbl.fills = isActive ? solid(C.primary) : [{ type:'SOLID', color:C.black, opacity:0.65 }];
      lbl.textAutoResize = 'WIDTH_AND_HEIGHT';

      var tabW = Math.ceil(lbl.width) + TAB_PH * 2;
      var tabItem = figma.createFrame();
      tabItem.name = 'Tab/' + label;
      tabItem.resize(tabW, TAB_H); tabItem.fills = []; tabItem.clipsContent = false;
      lbl.x = TAB_PH; lbl.y = Math.round((TAB_H - 22) / 2);
      tabItem.appendChild(lbl);

      if (isActive) {
        var ind = figma.createRectangle();
        ind.resize(tabW, 2); ind.fills = solid(C.primary);
        ind.x = 0; ind.y = TAB_H - 2;
        tabItem.appendChild(ind);
      }

      tabItem.x = xCursor; tabItem.y = 0;
      xCursor += tabW;
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

  // ── 抽屉构建（stateType = 'hasFile' | 'empty'）──────────────────────────
  function buildDrawer(stateType) {
    var drawer = figma.createFrame();
    drawer.name = '抽屉/合同详情/' + (stateType === 'hasFile' ? '有附件' : '空状态');
    drawer.resize(DRAWER_W, CANVAS_H / 2 - 24);
    drawer.fills = solid(C.white); drawer.clipsContent = false;
    drawer.effects = [{
      type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
      color:{r:0,g:0,b:0,a:0.15}, offset:{x:-4,y:0}, radius:16, spread:0
    }];

    // 标题栏
    var header = figma.createFrame();
    header.name = 'DrawerHeader'; header.resize(DRAWER_W, DRW_HDR_H);
    header.fills = solid(C.white); header.clipsContent = false;
    header.appendChild(text('合同详情', C.black, 16, { style:'Medium', lh:24, a:0.85, x:24, y:16 }));
    var closeIc = icon('close', 16, C.black, 0.45);
    if (closeIc) { closeIc.x = DRAWER_W - 36; closeIc.y = 20; header.appendChild(closeIc); }
    header.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:DRW_HDR_H - 1 }));
    header.x = 0; header.y = 0;
    drawer.appendChild(header);

    // 标签页栏（Tab5 激活）
    var tabBar = makeTabBar('附件');
    tabBar.x = 0; tabBar.y = DRW_HDR_H;
    drawer.appendChild(tabBar);

    // ── body ──────────────────────────────────────────────────────────────
    var body = figma.createFrame();
    body.name = 'DrawerBody'; body.fills = solid(C.white); body.clipsContent = false;

    var yPos = BODY_PAD; // 24

    // 区块标题
    var secTitle = makeSectionTitle('附件');
    secTitle.x = 0; secTitle.y = yPos;
    body.appendChild(secTitle);
    yPos += 24 + 24; // → 72

    var bodyH;
    if (stateType === 'hasFile') {
      // 有附件状态：文件列表
      var fileItem = makeFileItem('万科桶装水采购框架协议.pdf');
      fileItem.x = 0; fileItem.y = yPos; // 72
      body.appendChild(fileItem);
      yPos += 44; // → 116

      bodyH = yPos + BODY_PAD; // 140
    } else {
      // 空状态
      var emptyState = makeEmptyState();
      emptyState.x = 0; emptyState.y = yPos; // 72
      body.appendChild(emptyState);
      yPos += 160; // → 232

      bodyH = yPos + BODY_PAD; // 256
    }

    body.resize(CONTENT_W, bodyH);
    body.x = BODY_PAD;
    body.y = DRW_HDR_H + TAB_H; // 100
    drawer.appendChild(body);

    // 底部操作栏
    var drawerH = drawer.height;
    var footer = figma.createFrame();
    footer.name = 'DrawerFooter'; footer.resize(DRAWER_W, DRW_FTR_H);
    footer.fills = solid(C.white); footer.clipsContent = false;
    footer.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:0 }));

    var footerBtns = figma.createFrame();
    footerBtns.name = 'FooterBtns'; footerBtns.fills = []; footerBtns.clipsContent = false;
    footerBtns.layoutMode = 'HORIZONTAL';
    footerBtns.primaryAxisSizingMode = 'AUTO'; footerBtns.counterAxisSizingMode = 'AUTO';
    footerBtns.counterAxisAlignItems = 'CENTER'; footerBtns.itemSpacing = 8;
    footerBtns.appendChild(makeBtn('关闭',    'secondary'));
    footerBtns.appendChild(makeBtn('终止合同', 'secondary'));
    footerBtns.appendChild(makeBtn('创建订单', 'primary'));
    footer.appendChild(footerBtns);
    footerBtns.x = DRAWER_W - BODY_PAD - footerBtns.width;
    footerBtns.y = Math.round((DRW_FTR_H - footerBtns.height) / 2);

    footer.x = 0; footer.y = drawerH - DRW_FTR_H;
    drawer.appendChild(footer);

    return drawer;
  }

  // ── 页面组装 ──────────────────────────────────────────────────────────────
  var root = figma.createFrame();
  root.name = 'D-07 合同详情·Tab5 附件';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = false;
  figma.currentPage.appendChild(root);

  // 侧边栏（全高）
  var sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  // 遮罩层
  var overlay = rect(CANVAS_W - SIDE_W, CANVAS_H, C.black, { a:0.40, x:SIDE_W, y:0 });
  root.appendChild(overlay);

  // ─ 状态一：有附件 ─────────────────────────────────────────────────────
  var stateLabel1 = text('状态一：有附件', hex('#006D9B'), 12, { lh:20, a:0.65 });
  stateLabel1.x = CANVAS_W - DRAWER_W;
  stateLabel1.y = 0;
  root.appendChild(stateLabel1);

  var drawer1 = buildDrawer('hasFile');
  drawer1.x = CANVAS_W - DRAWER_W;
  drawer1.y = 20;
  root.appendChild(drawer1);

  // ─ 状态二：空状态 ─────────────────────────────────────────────────────
  var gap = 24;
  var state2Y = drawer1.y + drawer1.height + gap;

  var stateLabel2 = text('状态二：无附件（空状态）', hex('#006D9B'), 12, { lh:20, a:0.65 });
  stateLabel2.x = CANVAS_W - DRAWER_W;
  stateLabel2.y = state2Y - 20;
  root.appendChild(stateLabel2);

  var drawer2 = buildDrawer('empty');
  drawer2.x = CANVAS_W - DRAWER_W;
  drawer2.y = state2Y;
  root.appendChild(drawer2);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
