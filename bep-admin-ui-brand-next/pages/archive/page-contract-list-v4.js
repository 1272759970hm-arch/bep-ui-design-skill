// ── 合同管理列表页 v4 ──────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-22
// 2 行筛选（均满列）→ 操作按钮单独一行 → 工具行 → 分割线 → 表格 → 分页
// Canvas 1440 × 769

// ── 图标 SVG ─────────────────────────────────────────────────────────
const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,

  "PutAway-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,

  "Add": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,

  "bell": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "briefcase": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "chevron-right": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "download": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "file-text": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0068 8.82849H9.00684H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "grid": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "home": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "layers": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923V1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "menu": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5032H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 5.50317H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 17.5032H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "repeat": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L21 5L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9C3 6.79086 4.79086 5 7 5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 23L3 19L7 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13V15C21 17.2091 19.2091 19 17 19H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  "search": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ── 入口 ─────────────────────────────────────────────────────────────
async function buildPage() {

  // ── 字体预加载 ───────────────────────────────────────────────────
  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular'  }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium'   }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Semibold' }),
  ]);

  // ── 工具 ─────────────────────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 };
  }
  function solid(color, a=1) { return [{type:'SOLID', color, opacity:a}]; }
  // 简单文字宽度估算（CJK ≈ fontSize, ASCII ≈ fontSize×0.6）
  function measureText(str, size=14) {
    let w = 0;
    for (const ch of str) w += ch.charCodeAt(0) > 255 ? size : Math.round(size * 0.6);
    return Math.ceil(w);
  }

  // ── 颜色 Token ───────────────────────────────────────────────────
  const C = {
    pageBg:     hex('#F0F2F5'),
    white:      hex('#FFFFFF'),
    sidebarBg:  hex('#002138'),
    sidebarSub: hex('#00182A'),
    primary:    hex('#006D9B'),
    primaryL20: hex('#338AAF'),
    primaryL90: hex('#E6F0F5'),
    success:    hex('#3BBB3E'),
    successL90: hex('#EBF8EC'),
    warning:    hex('#FFA645'),
    warningL90: hex('#FFF6EC'),
    danger:     hex('#FE5E54'),
    dangerL90:  hex('#FFEEEE'),
    black:      hex('#000000'),
    tagGrayBg:  hex('#F5F5F5'),
    tableHead:  hex('#F5F5F5'),
  };

  // ── 布局常量 ─────────────────────────────────────────────────────
  const CANVAS_W  = 1440;
  const SIDE_W    = 208,  MAIN_W  = 1232;
  const NAV_H     = 56,   TITLE_H = 48;
  const OUTER_PAD = 16,   PAD     = 24;
  const CARD_W    = 1200, TBL_W   = 1152; // CARD_W - 2*PAD
  const HEADER_H  = 48,   ROW_H   = 48;
  const FROZEN_X  = 992;  // 操作列左边界（非操作列宽之和）

  // 卡片内垂直布局（2 行筛选均满列 → 操作按钮单独一行）
  const FILTER_ACT_Y = 120; // 24 + 2*48
  const TOOLBAR_Y    = 168; // FILTER_ACT_Y + 48
  const DIVIDER_Y    = 208; // TOOLBAR_Y + 40
  const TBL_Y        = 217; // DIVIDER_Y + 9
  const NUM_ROWS     = 6;
  const PAGER_Y      = TBL_Y + HEADER_H + NUM_ROWS * ROW_H + 16; // 569
  const CARD_H       = PAGER_Y + 32 + 32; // 633

  const CANVAS_H = NAV_H + TITLE_H + OUTER_PAD + CARD_H + OUTER_PAD; // 769

  // ── 基础工厂函数 ─────────────────────────────────────────────────
  function frame(name, w, h, bg, opts={}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA||1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r       !== undefined) f.cornerRadius = opts.r;
    if (opts.x       !== undefined) f.x = opts.x;
    if (opts.y       !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes      = solid(opts.stroke, opts.strokeA||1);
      f.strokeWeight = opts.strokeW||1;
      f.strokeAlign  = 'INSIDE';
    }
    return f;
  }

  function rect(w, h, color, opts={}) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a||1) : [];
    if (opts.r  !== undefined) r.cornerRadius = opts.r;
    if (opts.x  !== undefined) r.x = opts.x;
    if (opts.y  !== undefined) r.y = opts.y;
    if (opts.stroke) {
      r.strokes      = solid(opts.stroke, opts.strokeA||1);
      r.strokeWeight = opts.strokeW||1;
      r.strokeAlign  = 'INSIDE';
    }
    return r;
  }

  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName   = { family: 'PingFang SC', style: opts.style||'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? { value: opts.lh, unit: 'PIXELS' } : { unit: 'AUTO' };
    t.characters = chars;
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }

  // 固定宽截断文本（表格单元格用）
  function truncText(chars, color, maxW, opts={}) {
    const t = figma.createText();
    t.fontName   = { family: 'PingFang SC', style: opts.style||'Regular' };
    t.fontSize   = 14;
    t.lineHeight = { value: 22, unit: 'PIXELS' };
    t.characters = String(chars);
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize   = 'NONE';
    t.resize(Math.max(maxW, 8), 22);
    t.textTruncation   = 'ENDING';
    if (opts.alignH) t.textAlignHorizontal = opts.alignH;
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }

  // 从 ICONS 创建图标节点
  function icon(key, size, color, opacity=1) {
    const svg = ICONS[key];
    if (!svg) { console.warn(`⚠️ icon not found: ${key}`); return null; }
    const node = figma.createNodeFromSvg(svg);
    node.name   = key;
    node.resize(size, size);
    node.opacity = opacity;
    node.findAll(n => n.fills  && n.fills.length  > 0 && n.fills[0].type  === 'SOLID')
        .forEach(n => { n.fills   = solid(color, 1); });
    node.findAll(n => n.strokes && n.strokes.length > 0)
        .forEach(n => { n.strokes = solid(color, 1); });
    return node;
  }

  // ── 侧边栏函数（规范已锁定，勿改）──────────────────────────────
  function buildLogo(sidebar) {
    const row = frame('Logo', SIDE_W, 64, null);
    row.fills = [];
    sidebar.appendChild(row);
    row.appendChild(rect(32, 32, C.primary, {r:6, x:24, y:16}));
    row.appendChild(text('BeP设计平台', C.white, 16, {lh:20, style:'Medium', x:64, y:14}));
    row.appendChild(text('COUNTRY GARDEN SERVICES', C.white, 6, {lh:10, a:0.6, x:64, y:37}));
  }

  function addSideL1(parent, label, iconKey, y, opts={}) {
    const {active=false, expanded=false} = opts;
    const op  = active ? 1 : 0.5;
    const row = frame(`L1·${label}`, SIDE_W, 48, C.sidebarBg);
    row.y = y; parent.appendChild(row);
    const ic = icon(iconKey, 16, C.white, op);
    if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    row.appendChild(text(label, C.white, 14, {lh:22, a:op, x:52, y:13}));
    const arr = icon(expanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, op);
    if (arr) { arr.x = 186; arr.y = 18; row.appendChild(arr); }
  }

  function addSideL2(parent, label, y, opts={}) {
    const {active=false} = opts;
    const op  = active ? 1 : 0.5;
    const row = frame(`L2·${label}`, SIDE_W, 48, C.sidebarSub);
    row.y = y; parent.appendChild(row);
    // 选中项加左侧蓝色指示条
    if (active) {
      row.appendChild(rect(3, 22, C.primary, {a:1, x:0, y:13}));
    }
    row.appendChild(text(label, C.white, 14, {lh:22, a:op, x:40, y:13}));
  }

  function addSideDivider(parent, y) {
    parent.appendChild(rect(160, 1, C.white, {a:0.08, x:24, y}));
  }

  // ── 顶部导航栏 ───────────────────────────────────────────────────
  function buildTopNav(main) {
    const nav = frame('顶部导航', MAIN_W, NAV_H, C.white,
      {stroke: C.black, strokeA: 0.06, strokeW: 1});
    main.appendChild(nav);

    // 左：菜单图标
    const icMenu = icon('menu', 20, C.black, 0.45);
    if (icMenu) { icMenu.x = 16; icMenu.y = 18; nav.appendChild(icMenu); }

    // 左：业务系统切换框
    const SYS_W = 200;
    const sysBox = frame('系统切换', SYS_W, 32, C.white,
      {r:4, x:44, y:12, stroke:C.black, strokeA:0.15, strokeW:1});
    nav.appendChild(sysBox);
    sysBox.appendChild(text('业务系统切换', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
    const icSw = icon('repeat', 14, C.black, 0.45);
    if (icSw) { icSw.x = SYS_W - 22; icSw.y = 9; sysBox.appendChild(icSw); }

    // 右：从右向左
    let rx = MAIN_W - 16;

    // DropDown-Arrow（用户菜单）
    const uArr = icon('DropDown-Arrow', 12, C.black, 0.45);
    if (uArr) { uArr.x = rx - 12; uArr.y = 22; nav.appendChild(uArr); rx = uArr.x - 4; }

    // 用户名
    const uName = text('碧小园', C.black, 14, {lh:22, a:0.85});
    uName.textAutoResize = 'WIDTH_AND_HEIGHT';
    uName.x = rx - uName.width; uName.y = 17; nav.appendChild(uName); rx = uName.x - 8;

    // 头像（圆形色块）
    nav.appendChild(rect(28, 28, C.primary, {r:14, x:rx-28, y:14}));
    const uT = text('碧', C.white, 12, {lh:20, style:'Medium'});
    uT.x = rx - 28 + Math.round((28 - uT.width) / 2); uT.y = 18; nav.appendChild(uT);
    rx = rx - 28 - 16;

    // 竖线分隔
    nav.appendChild(rect(1, 24, C.black, {a:0.12, x:rx, y:16})); rx -= 16;

    // bell
    const icBell = icon('bell', 20, C.black, 0.45);
    if (icBell) { icBell.x = rx - 20; icBell.y = 18; nav.appendChild(icBell); rx = icBell.x - 12; }

    // download
    const icDl = icon('download', 20, C.black, 0.45);
    if (icDl) { icDl.x = rx - 20; icDl.y = 18; nav.appendChild(icDl); rx = icDl.x - 12; }

    // search
    const icSearch = icon('search', 20, C.black, 0.45);
    if (icSearch) { icSearch.x = rx - 20; icSearch.y = 18; nav.appendChild(icSearch); }
  }

  // ── 页面标题栏 ───────────────────────────────────────────────────
  function buildTitleBar(main, title, crumbs) {
    const bar = frame('标题栏', MAIN_W, TITLE_H, C.white,
      {stroke: C.black, strokeA: 0.06, strokeW: 1, y: NAV_H});
    main.appendChild(bar);

    const titleNode = text(title, C.black, 16, {lh:24, style:'Medium', x:PAD, y:12});
    bar.appendChild(titleNode);

    let bx = PAD + titleNode.width + 16;
    crumbs.forEach((c, i) => {
      const cn = text(c.label, C.black, 12, {lh:18, a:0.65});
      cn.x = bx; cn.y = 15; bar.appendChild(cn); bx += cn.width;
      if (i < crumbs.length - 1) {
        const sep = icon('chevron-right', 12, C.black, 0.25);
        if (sep) { sep.x = bx + 2; sep.y = 18; bar.appendChild(sep); bx += 16; }
      }
    });
  }

  // ── 筛选字段 ─────────────────────────────────────────────────────
  const FCOL_W  = 379;
  const LABEL_W = 112;
  const LABEL_GAP = 12;
  const INPUT_W = FCOL_W - LABEL_W - LABEL_GAP; // 255
  const COL_X   = [24, 411, 798];

  function addFilter(parent, label, col, rowIdx, fieldType) {
    const x0 = COL_X[col];
    const y0 = 24 + rowIdx * 48;
    parent.appendChild(text(label, C.black, 14, {lh:22, a:0.65, x:x0, y:y0+5}));
    const inputX = x0 + LABEL_W + LABEL_GAP;

    if (fieldType === 'select') {
      const sel = frame(`sel-${label}`, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      parent.appendChild(sel);
      sel.appendChild(text('请选择', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
      const arr = icon('DropDown-Arrow', 12, C.black, 0.35);
      if (arr) { arr.x = INPUT_W - 20; arr.y = 10; sel.appendChild(arr); }
    } else {
      const box = frame(`inp-${label}`, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      parent.appendChild(box);
      box.appendChild(text('请输入', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
    }
  }

  // ── 筛选操作按钮（查询 / 重置 / 收起）──────────────────────────
  function buildFilterActions(mainCard, y) {
    let bx = CARD_W - PAD;

    // 收起
    const colT = text('收起', C.primary, 14, {lh:22});
    const arrUp = icon('PutAway-Arrow', 16, C.primary, 0.85);
    const colW  = colT.width + (arrUp ? 4 + 16 : 0);
    colT.x = bx - colW; colT.y = y + 5;
    mainCard.appendChild(colT);
    if (arrUp) { arrUp.x = bx - 16; arrUp.y = y + 8; mainCard.appendChild(arrUp); }
    bx = bx - colW - 16;

    // 重置
    const rstW = measureText('重置', 14) + 32;
    const rstBtn = frame('btn-重置', rstW, 32, C.white,
      {r:4, x:bx-rstW, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(rstBtn);
    const rstT = text('重置', C.black, 14, {lh:22, a:0.65});
    rstT.x = Math.round((rstW - rstT.width) / 2); rstT.y = 5;
    rstBtn.appendChild(rstT);
    bx = bx - rstW - 8;

    // 查询
    const qryW = measureText('查询', 14) + 32;
    const qryBtn = frame('btn-查询', qryW, 32, C.primary,
      {r:4, x:bx-qryW, y});
    mainCard.appendChild(qryBtn);
    const qryT = text('查询', C.white, 14, {lh:22});
    qryT.x = Math.round((qryW - qryT.width) / 2); qryT.y = 5;
    qryBtn.appendChild(qryT);
  }

  // ── 表格工具行 ───────────────────────────────────────────────────
  function buildTableToolbar(mainCard, y) {
    let bx = CARD_W - PAD;

    // 新增合同（primary，含 Add 图标）
    const addLblW = measureText('新增合同', 14);
    const addBtnW = 12 + 16 + 8 + addLblW + 12;
    bx -= addBtnW;
    const addBtn = frame('btn-新增合同', addBtnW, 32, C.primary, {r:4, x:bx, y});
    mainCard.appendChild(addBtn);
    const icAdd = icon('Add', 16, C.white, 1);
    if (icAdd) { icAdd.x = 12; icAdd.y = 8; addBtn.appendChild(icAdd); }
    addBtn.appendChild(text('新增合同', C.white, 14, {lh:22, x:36, y:5}));
    bx -= 8;

    // 导出（secondary）
    const expW = measureText('导出', 14) + 32;
    bx -= expW;
    const expBtn = frame('btn-导出', expW, 32, C.white,
      {r:4, x:bx, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(expBtn);
    const expT = text('导出', C.black, 14, {lh:22, a:0.65});
    expT.x = Math.round((expW - expT.width) / 2); expT.y = 5;
    expBtn.appendChild(expT);
  }

  // ── 表格表头 ─────────────────────────────────────────────────────
  const COLS = [
    {label:'合同编号',    w:100, type:'link'     },
    {label:'客户名称',    w: 92, type:'plain'    },
    {label:'合同名称',    w: 96, type:'plain'    },
    {label:'合同场景',    w: 64, type:'sceneTag' },
    {label:'合同类型',    w: 64, type:'typeTag'  },
    {label:'合同状态',    w: 72, type:'statusTag'},
    {label:'BIP审批编号', w: 96, type:'plain'    },
    {label:'合同总金额',  w:100, type:'amount'   },
    {label:'已下单金额',  w:100, type:'amount'   },
    {label:'销售人员',    w: 52, type:'plain'    },
    {label:'生效日期',    w: 78, type:'plain'    },
    {label:'到期日期',    w: 78, type:'plain'    },
    {label:'操作',        w:160, type:'ops'      },
  ];

  function buildTableHeader(mainCard) {
    const thead = frame('表头', TBL_W, HEADER_H, C.tableHead,
      {x:PAD, y:TBL_Y, stroke:C.black, strokeA:0.06, strokeW:1});
    mainCard.appendChild(thead);

    let cx = 0;
    COLS.forEach(col => {
      const isAmount = col.type === 'amount';
      const lbl = text(col.label, C.black, 14,
        {lh:22, style:'Medium', a:0.85,
         x: isAmount ? cx + col.w - measureText(col.label,14) - 8 : cx + 16,
         y: Math.round((HEADER_H - 22) / 2)});
      thead.appendChild(lbl);
      cx += col.w;
    });

    // 冻结列分割线
    thead.appendChild(rect(1, HEADER_H, C.black, {a:0.18, x:FROZEN_X, y:0}));
  }

  // ── 状态/场景/类型 Tag ───────────────────────────────────────────
  function makeTag(label, bg, txtColor, parent, x, y) {
    const g = frame(`tag-${label}`, 60, 22, bg, {r:4, x, y});
    parent.appendChild(g);
    const t = text(label, txtColor, 12, {lh:20, x:8, y:1});
    g.appendChild(t);
    g.resize(t.width + 16, 22);
    return g.width;
  }

  const STATUS_CFG = {
    '已生效':    { bg: C.successL90, txt: C.success  },
    '待财务审核':{ bg: C.warningL90, txt: C.warning  },
    '草稿':      { bg: C.tagGrayBg,  txt: C.black, ta:0.65 },
    '已终止':    { bg: C.dangerL90,  txt: C.danger   },
    '已到期':    { bg: C.tagGrayBg,  txt: C.black, ta:0.45 },
    '审核驳回':  { bg: C.dangerL90,  txt: C.danger   },
  };

  // 合同场景/类型用蓝色 tag
  const BLUE_TAG = { bg: C.primaryL90, txt: C.primary };

  // ── 操作列按状态返回按钮列表 ────────────────────────────────────
  function getOps(status) {
    const pri = C.primary;
    const suc = hex('#00875A');
    const dng = hex('#CF1322');
    const wrn = hex('#D46B08');
    return ({
      '已生效':    [[' 详情',pri],['终止',wrn]],
      '待财务审核':[[' 详情',pri],['财务通过',suc],['财务驳回',dng]],
      '草稿':      [[' 详情',pri],['编辑',pri],['提交审核',suc]],
      '审核驳回':  [[' 详情',pri],['编辑',pri],['提交审核',suc]],
      '已终止':    [[' 详情',pri]],
      '已到期':    [[' 详情',pri]],
    })[status] || [[' 详情',pri]];
  }

  // ── 数据行 ───────────────────────────────────────────────────────
  function buildDataRow(mainCard, row, rowIdx) {
    const rowY = TBL_Y + HEADER_H + rowIdx * ROW_H;
    const tr   = frame(`row-${rowIdx}`, TBL_W, ROW_H, C.white,
      {x:PAD, y:rowY, stroke:C.black, strokeA:0.06, strokeW:1});
    mainCard.appendChild(tr);

    const cellY = Math.round((ROW_H - 22) / 2); // 13
    let cx = 0;

    COLS.forEach(col => {
      if (col.type === 'link') {
        tr.appendChild(truncText(row.id, C.primary, col.w-16-8, {x:cx+16, y:cellY}));

      } else if (col.type === 'plain') {
        let val = '';
        if (col.label === '客户名称')  val = row.client;
        if (col.label === '合同名称')  val = row.name;
        if (col.label === 'BIP审批编号') val = row.bip;
        if (col.label === '销售人员')  val = row.sales;
        if (col.label === '生效日期')  val = row.start;
        if (col.label === '到期日期')  val = row.end;
        tr.appendChild(truncText(val, C.black, col.w-16-8, {a:0.85, x:cx+16, y:cellY}));

      } else if (col.type === 'amount') {
        let val = col.label === '合同总金额' ? row.total : row.ordered;
        const t = text(val, C.black, 14, {lh:22, a:0.85});
        t.x = cx + col.w - t.width - 8; t.y = cellY;
        tr.appendChild(t);

      } else if (col.type === 'sceneTag') {
        makeTag(row.scene, BLUE_TAG.bg, BLUE_TAG.txt, tr, cx+8, Math.round((ROW_H-22)/2));

      } else if (col.type === 'typeTag') {
        makeTag(row.type, BLUE_TAG.bg, BLUE_TAG.txt, tr, cx+8, Math.round((ROW_H-22)/2));

      } else if (col.type === 'statusTag') {
        const cfg = STATUS_CFG[row.status] || STATUS_CFG['草稿'];
        const tagBg  = cfg.bg;
        const tagTxt = cfg.txt;
        const g = frame(`tag-${row.status}`, 60, 22, tagBg, {r:4, x:cx+8, y:Math.round((ROW_H-22)/2)});
        tr.appendChild(g);
        const t = text(row.status, tagTxt, 12, {lh:20, x:8, y:1,
          a: cfg.ta !== undefined ? cfg.ta : 1});
        g.appendChild(t);
        g.resize(t.width + 16, 22);

      } else if (col.type === 'ops') {
        const ops = getOps(row.status);
        let ox = cx + 8;
        ops.forEach(([label, color]) => {
          const ot = text(label.trim(), color, 14, {lh:22, x:ox, y:cellY});
          tr.appendChild(ot);
          ox += ot.width + 10;
        });
      }
      cx += col.w;
    });

    // 冻结列分割线
    tr.appendChild(rect(1, ROW_H, C.black, {a:0.18, x:FROZEN_X, y:0}));
  }

  // ── 完整分页（全右对齐）─────────────────────────────────────────
  function buildFullPagination(mainCard, y, total, currentPage, pageCount) {
    const BTN = 32, GAP = 4;
    let px = CARD_W - PAD;

    // "页"
    const tPage = text('页', C.black, 14, {lh:22, a:0.85});
    tPage.x = px - tPage.width; tPage.y = y + 5;
    mainCard.appendChild(tPage);
    px = tPage.x - 4;

    // 跳转输入框
    const jumpBox = frame('jump-input', 40, BTN, C.white,
      {r:4, x:px-40, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(jumpBox);
    const tJ = text(String(currentPage), C.black, 14, {lh:22, a:0.65});
    tJ.x = Math.round((40-tJ.width)/2); tJ.y = 5;
    jumpBox.appendChild(tJ);
    px = px - 40 - 4;

    // "跳转至"
    const tGoto = text('跳转至', C.black, 14, {lh:22, a:0.65});
    tGoto.x = px - tGoto.width; tGoto.y = y + 5;
    mainCard.appendChild(tGoto);
    px = tGoto.x - 12;

    // 翻页器（右→左：> [页码] <）
    function mkBtn(label, isActive) {
      const b = frame('pgbtn-'+label, BTN, BTN,
        isActive ? C.primary : C.white,
        {r:4, x:px-BTN, y,
         stroke: isActive ? undefined : C.black,
         strokeA: 0.15, strokeW: 1});
      mainCard.appendChild(b);
      const t = text(label, isActive ? C.white : C.black, 14,
        {lh:22, a: isActive ? 1 : 0.85});
      t.x = Math.round((BTN - t.width) / 2);
      t.y = Math.round((BTN - 22) / 2);
      b.appendChild(t);
      px -= BTN + GAP;
    }
    mkBtn('›', false);
    for (let p = pageCount; p >= 1; p--) mkBtn(String(p), p === currentPage);
    mkBtn('‹', false);
    px -= (8 - GAP);

    // 每页条数下拉
    const PS_W = 96;
    const psBox = frame('page-size', PS_W, BTN, C.white,
      {r:4, x:px-PS_W, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(psBox);
    psBox.appendChild(text('20条/页', C.black, 14, {lh:22, a:0.65, x:10, y:5}));
    const psArr = icon('DropDown-Arrow', 12, C.black, 0.35);
    if (psArr) { psArr.x = PS_W - 20; psArr.y = 10; psBox.appendChild(psArr); }
    px = px - PS_W - 16;

    // 共 N 条
    const tTotal = text(`共 ${total} 条`, C.black, 14, {lh:22, a:0.65});
    tTotal.x = px - tTotal.width; tTotal.y = y + 5;
    mainCard.appendChild(tTotal);
  }

  // ────────────────────────────────────────────────────────────────
  //  开始构建页面
  // ────────────────────────────────────────────────────────────────

  // 根 Frame
  const root = figma.createFrame();
  root.name = '合同管理列表页';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg);
  root.clipsContent = true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name = '合同管理';

  // ── 侧边栏 ───────────────────────────────────────────────────────
  const sidebar = frame('侧边栏', SIDE_W, CANVAS_H, C.sidebarBg, {clip:false});
  root.appendChild(sidebar);
  buildLogo(sidebar);
  addSideDivider(sidebar, 64);
  addSideL1(sidebar, '首页',     'home',      65);
  addSideL1(sidebar, '工作台',   'grid',     113);
  addSideDivider(sidebar, 161);
  addSideL1(sidebar, '合同管理', 'file-text', 162, {active:true, expanded:true});
  addSideL2(sidebar, '合同列表', 210, {active:true});
  addSideL2(sidebar, '收款管理', 258);
  addSideL1(sidebar, '销售管理', 'briefcase', 306);
  addSideL1(sidebar, '系统管理', 'layers',    354);

  // ── 主区域 ───────────────────────────────────────────────────────
  const main = frame('主区域', MAIN_W, CANVAS_H, null);
  main.x = SIDE_W;
  root.appendChild(main);

  buildTopNav(main);
  buildTitleBar(main, '合同管理', [
    {label:'首页'},
    {label:'销售管理'},
    {label:'合同管理'},
  ]);

  // ── 内容卡片 ─────────────────────────────────────────────────────
  const cardY = NAV_H + TITLE_H + OUTER_PAD; // 120
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white,
    {r:8, x:OUTER_PAD, y:cardY});
  main.appendChild(mainCard);

  // 筛选行 0
  addFilter(mainCard, '合同编号', 0, 0, 'text');
  addFilter(mainCard, '客户名称', 1, 0, 'text');
  addFilter(mainCard, '合同状态', 2, 0, 'select');
  // 筛选行 1
  addFilter(mainCard, '合同名称', 0, 1, 'text');
  addFilter(mainCard, '合同场景', 1, 1, 'select');
  addFilter(mainCard, '合同类型', 2, 1, 'select');

  // 筛选操作（查询/重置/收起）→ y=120（新行，因两行均满列）
  buildFilterActions(mainCard, FILTER_ACT_Y);

  // 表格工具行 → y=168
  buildTableToolbar(mainCard, TOOLBAR_Y);

  // 分割线 → y=208
  mainCard.appendChild(rect(CARD_W, 1, C.black, {a:0.06, y:DIVIDER_Y}));

  // 表格表头 → y=217
  buildTableHeader(mainCard);

  // 数据行
  const rows = [
    {
      id:'BJ-2026-00001', client:'碧桂园集团',
      name:'万科碧桂园战略合作协议', scene:'销售', type:'框架合同',
      status:'已生效', bip:'BIP-2026-001',
      total:'¥1,200,000.00', ordered:'¥800,000.00',
      sales:'张伟', start:'2026-01-01', end:'2026-12-31',
    },
    {
      id:'BJ-2026-00002', client:'华润置地',
      name:'房屋维修服务合同', scene:'服务', type:'单项合同',
      status:'待财务审核', bip:'BIP-2026-002',
      total:'¥350,000.00', ordered:'¥0.00',
      sales:'李芳', start:'2026-02-15', end:'2026-08-14',
    },
    {
      id:'BJ-2026-00003', client:'万科企业',
      name:'物业管理服务协议', scene:'物管', type:'框架合同',
      status:'草稿', bip:'-',
      total:'¥2,800,000.00', ordered:'¥1,500,000.00',
      sales:'王强', start:'2026-03-01', end:'2027-02-28',
    },
    {
      id:'BJ-2026-00004', client:'中海地产',
      name:'安保服务合同', scene:'安保', type:'单项合同',
      status:'已终止', bip:'BIP-2026-004',
      total:'¥180,000.00', ordered:'¥180,000.00',
      sales:'陈梅', start:'2025-06-01', end:'2026-05-31',
    },
    {
      id:'BJ-2026-00005', client:'保利发展',
      name:'绿化养护合同', scene:'绿化', type:'框架合同',
      status:'已到期', bip:'BIP-2026-005',
      total:'¥95,000.00', ordered:'¥95,000.00',
      sales:'赵刚', start:'2025-01-01', end:'2025-12-31',
    },
    {
      id:'BJ-2026-00006', client:'龙湖集团',
      name:'设备维护服务合同', scene:'维修', type:'单项合同',
      status:'审核驳回', bip:'BIP-2026-006',
      total:'¥460,000.00', ordered:'¥0.00',
      sales:'刘静', start:'2026-04-01', end:'2026-09-30',
    },
  ];

  rows.forEach((row, i) => buildDataRow(mainCard, row, i));

  // 分页 → y=569
  buildFullPagination(mainCard, PAGER_Y, 68, 1, 3);

  // 完成
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin('✅ 合同管理列表页 v4 已生成（1440×' + CANVAS_H + '）');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
