// ── 合同管理列表页 v6 ──────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-22
// v6 修复：侧边栏 & 页头严格对齐 components.md 规范
//   Sidebar: row.opacity on whole frame / L1+L2 bg=#002138 / arrow x=180 / 无蓝色竖线
//   Header:  menu 16×16@(24,16) / switcher x=64 y=8 r=2 / rightX=W-24-223
//            icons 16×16 / vDiv at +112 / avatar Ellipse 24×24 / userName@+161
//   TitleBar: title x=24 y=12 fs=16 Medium / crumbs from x=104 fs=14 Regular
// Canvas 1440 × 769

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "Add":            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
  "bell":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-right":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "download":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0068 8.82849H9.00684H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "grid":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "home":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923V1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "menu":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5032H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 5.50317H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 17.5032H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular'  }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium'   }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Semibold' }),
  ]);

  // ── 工具函数 ─────────────────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a=1) { return [{type:'SOLID', color, opacity:a}]; }
  function measureText(str, size=14) {
    let w = 0;
    for (const ch of str) w += ch.charCodeAt(0) > 255 ? size : Math.round(size * 0.6);
    return Math.ceil(w);
  }

  // ── 设计 Token ───────────────────────────────────────────────────
  const C = {
    pageBg:       hex('#F0F2F5'),
    white:        hex('#FFFFFF'),
    sidebarBg:    hex('#002138'),  // L1 & L2 菜单背景
    sidebarSub:   hex('#00182A'),  // L3 菜单背景
    primary:      hex('#006D9B'),
    primaryL20:   hex('#338AAF'),
    primaryL90:   hex('#E6F0F5'),
    success:      hex('#3BBB3E'),
    successL90:   hex('#EBF8EC'),
    warning:      hex('#FFA645'),
    warningL90:   hex('#FFF6EC'),
    danger:       hex('#FE5E54'),
    dangerL90:    hex('#FFEEEE'),
    black:        hex('#000000'),
    tableHead:    hex('#F5F5F5'),
    tagGrayBg:    hex('#F5F5F5'),
  };

  // ── 布局常量 ─────────────────────────────────────────────────────
  const CANVAS_W  = 1440;
  const SIDE_W    = 208,  MAIN_W  = 1232;
  const NAV_H     = 48,   TITLE_H = 48;   // 每层均 48px
  const OUTER_PAD = 16,   PAD     = 24;
  const CARD_W    = 1200, TBL_W   = 1152;
  const HEADER_H  = 48,   ROW_H   = 48;
  const FROZEN_X  = 992;
  // 卡片内纵向（2 行筛选均满列，按钮单独一行）
  const FILTER_ACT_Y = 120;  // 24 + 2×48
  const TOOLBAR_Y    = 168;
  const DIVIDER_Y    = 208;
  const TBL_Y        = 217;
  const NUM_ROWS     = 6;
  const PAGER_Y      = TBL_Y + HEADER_H + NUM_ROWS * ROW_H + 16; // 569
  const CARD_H       = PAGER_Y + 32 + 32;                         // 633
  // 页面总高：NAV+TITLE+PAD+CARD+PAD
  const CANVAS_H     = NAV_H + TITLE_H + OUTER_PAD + CARD_H + OUTER_PAD; // 769

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
    return r;
  }

  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? {value:opts.lh, unit:'PIXELS'} : {unit:'AUTO'};
    t.characters = chars;
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }

  // 固定宽截断文本（表格单元格 / 筛选标签）
  function truncText(chars, color, maxW, opts={}) {
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize   = opts.size || 14;
    t.lineHeight = { value: opts.lh || 22, unit:'PIXELS' };
    t.characters = String(chars);
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize   = 'NONE';
    t.resize(Math.max(maxW, 8), opts.lh || 22);
    t.textTruncation   = 'ENDING';
    if (opts.alignH) t.textAlignHorizontal = opts.alignH;
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }

  // 图标：染色并返回节点
  function icon(key, size, color, opacity=1) {
    const svg = ICONS[key];
    if (!svg) { console.warn('icon not found: ' + key); return null; }
    const node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(n => n.fills  && n.fills.length  > 0 && n.fills[0].type  === 'SOLID')
        .forEach(n => { n.fills   = solid(color, 1); });
    node.findAll(n => n.strokes && n.strokes.length > 0)
        .forEach(n => { n.strokes = solid(color, 1); });
    return node;
  }

  // ─────────────────────────────────────────────────────────────────
  //  侧边栏（严格按 components.md 规范，锁定样式）
  //  规范要点：
  //   · L1/L2 bg=#002138，L3 bg=#00182A
  //   · row.opacity = active?1:0.5（整行，非逐元素）
  //   · 文字/图标 fills 内部保持全透明，依靠行 opacity 降明度
  //   · 箭头 x=180（非 186）
  //   · 不使用蓝色竖线
  // ─────────────────────────────────────────────────────────────────
  async function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo';
    area.resize(208, 64);
    area.fills = solid(hex('#002138'));

    const box = figma.createRectangle();
    box.resize(32, 32); box.x = 24; box.y = 16;
    box.cornerRadius = 6;
    box.fills = solid(C.primary);
    area.appendChild(box);

    const title = figma.createText();
    title.fontName   = { family:'PingFang SC', style:'Medium' };
    title.fontSize   = 16;
    title.lineHeight = { value:20, unit:'PIXELS' };
    title.characters = 'BeP设计平台';
    title.fills      = solid(C.white);
    title.x = 64; title.y = 20;
    area.appendChild(title);

    const sub = figma.createText();
    sub.fontName   = { family:'PingFang SC', style:'Regular' };
    sub.fontSize   = 7;
    sub.lineHeight = { value:10, unit:'PIXELS' };
    sub.characters = 'COUNTRY GARDEN SERVICES';
    sub.fills      = [{ type:'SOLID', color:C.white, opacity:0.6 }];
    sub.x = 64; sub.y = 42;
    area.appendChild(sub);

    return area;
  }

  // level: 1 | 2 | 3  state: 'active'|'inactive'|'expanded'|'collapsed'
  async function makeSidebarItem(label, level, state, iconKey = null) {
    const bg       = level === 3 ? hex('#00182A') : hex('#002138');
    const isActive = state === 'active' || state === 'expanded';

    const row = figma.createFrame();
    row.name   = `L${level}-${label}`;
    row.resize(208, 48);
    row.fills   = solid(bg);
    row.opacity = isActive ? 1 : 0.5; // ⚑ 整行 opacity，不逐元素

    // 图标（一级菜单）— 内部 fills 全白，整行 opacity 控制明暗
    if (level === 1 && iconKey) {
      const ic = figma.createNodeFromSvg(ICONS[iconKey]);
      ic.resize(16, 16); ic.x = 24; ic.y = 16;
      ic.findAll(n => n.fills  && n.fills.length  > 0 && n.fills[0].type === 'SOLID')
        .forEach(n => { n.fills   = solid(C.white, 1); });
      ic.findAll(n => n.strokes && n.strokes.length > 0)
        .forEach(n => { n.strokes = solid(C.white, 1); });
      row.appendChild(ic);
    }

    // 文字位置：L1=52, L2=40, L3=56
    const textX = level === 1 ? 52 : level === 2 ? 40 : 56;
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14;
    t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = label;
    t.fills      = solid(C.white); // ⚑ 全白，由行 opacity 控制
    t.x = textX; t.y = 13;
    row.appendChild(t);

    // 折叠箭头（L1/L2）— x=180（规范值，非 186）
    if (level <= 2) {
      const arrowSvg = state === 'expanded' ? ICONS['PutAway-Arrow'] : ICONS['DropDown-Arrow'];
      const arrow = figma.createNodeFromSvg(arrowSvg);
      arrow.resize(12, 12);
      arrow.x = 180; arrow.y = 18; // ⚑ x=180
      arrow.findAll(n => n.fills  && n.fills.length  > 0 && n.fills[0].type === 'SOLID')
        .forEach(n => { n.fills   = solid(C.white, 1); });
      row.appendChild(arrow);
    }

    return row;
  }

  // 分隔线（宽 208 包装，内含 160×1 白色线）
  function makeSidebarDivider() {
    const wrapper = figma.createFrame();
    wrapper.name  = 'SidebarDivider';
    wrapper.resize(208, 1);
    wrapper.fills = [];
    const line = figma.createRectangle();
    line.resize(160, 1); line.x = 24; line.y = 0;
    line.fills = [{ type:'SOLID', color:C.white, opacity:0.08 }];
    wrapper.appendChild(line);
    return wrapper;
  }

  // 完整侧边栏（VERTICAL 自动布局）
  async function makeSidebar(height) {
    const sidebar = figma.createFrame();
    sidebar.name = '侧边栏';
    sidebar.layoutMode = 'VERTICAL';
    sidebar.itemSpacing = 0;
    sidebar.primaryAxisSizingMode = 'FIXED';
    sidebar.counterAxisSizingMode = 'FIXED';
    sidebar.resize(208, height);
    sidebar.fills = solid(hex('#002138'));
    sidebar.clipsContent = false;

    sidebar.appendChild(await makeSidebarLogo());
    sidebar.appendChild(makeSidebarDivider());
    sidebar.appendChild(await makeSidebarItem('首页',     1, 'inactive',  'home'));
    sidebar.appendChild(await makeSidebarItem('工作台',   1, 'inactive',  'grid'));
    sidebar.appendChild(makeSidebarDivider());
    sidebar.appendChild(await makeSidebarItem('合同管理', 1, 'expanded',  'file-text'));
    sidebar.appendChild(await makeSidebarItem('合同列表', 2, 'active'));
    sidebar.appendChild(await makeSidebarItem('收款管理', 2, 'inactive'));
    sidebar.appendChild(await makeSidebarItem('销售管理', 1, 'inactive',  'briefcase'));
    sidebar.appendChild(await makeSidebarItem('系统管理', 1, 'inactive',  'layers'));

    return sidebar;
  }

  // ─────────────────────────────────────────────────────────────────
  //  顶部工具栏（严格按 components.md makeHeaderBar 规范）
  //  规范要点：
  //   · menu 16×16 at x=24, y=16
  //   · switchInput x=64 y=8 w=200 h=32 r=2
  //   · rightX = totalW - 24 - 223
  //   · icons 16×16 at rightX+0/+40/+80, y=16
  //   · vDiv 1×16 at rightX+112, y=16
  //   · avatar Ellipse 24×24 at rightX+129, y=12
  //   · userName at rightX+161, y=13
  //   · 底部 1px divider rect at y=47 black@0.10
  // ─────────────────────────────────────────────────────────────────
  async function makeHeaderBar(totalW) {
    const bar = figma.createFrame();
    bar.name = 'HeaderBar';
    bar.resize(totalW, 48);
    bar.fills = solid(C.white);

    // 底部分割线（rect 方式，非 stroke）
    const div = figma.createRectangle();
    div.resize(totalW, 1); div.x = 0; div.y = 47;
    div.fills = [{ type:'SOLID', color:C.black, opacity:0.10 }];
    bar.appendChild(div);

    // ─ 左侧：MenuOpen 图标
    const menuIcon = figma.createNodeFromSvg(ICONS['menu']);
    menuIcon.resize(16, 16); menuIcon.x = 24; menuIcon.y = 16;
    menuIcon.findAll(n => n.strokes && n.strokes.length > 0)
      .forEach(n => { n.strokes = solid(C.black, 0.65); });
    bar.appendChild(menuIcon);

    // ─ 左侧：业务系统切换 Input（x=64, y=8, w=200, h=32, r=2）
    const switchInput = figma.createFrame();
    switchInput.resize(200, 32); switchInput.x = 64; switchInput.y = 8;
    switchInput.cornerRadius = 2;
    switchInput.fills = solid(C.white);
    switchInput.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    switchInput.strokeWeight = 1; switchInput.strokeAlign = 'INSIDE';
    const ph = figma.createText();
    ph.fontName = { family:'PingFang SC', style:'Regular' };
    ph.fontSize = 14; ph.lineHeight = { value:22, unit:'PIXELS' };
    ph.characters = '业务系统切换';
    ph.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    ph.x = 12; ph.y = 5;
    switchInput.appendChild(ph);
    bar.appendChild(switchInput);

    // ─ 右侧功能区：rightX = totalW - 24 - 223
    const rightX = totalW - 24 - 223;

    // Search / Download / Notice 图标（各 16×16，间距 40px）
    [['search', rightX + 0], ['download', rightX + 40], ['bell', rightX + 80]].forEach(([key, x]) => {
      const ic = figma.createNodeFromSvg(ICONS[key]);
      ic.resize(16, 16); ic.x = x; ic.y = 16;
      ic.findAll(n => n.strokes && n.strokes.length > 0)
        .forEach(n => { n.strokes = solid(C.black, 0.65); });
      ic.findAll(n => n.fills && n.fills.length > 0 && n.fills[0].type === 'SOLID')
        .forEach(n => { n.fills = solid(C.black, 0.65); });
      bar.appendChild(ic);
    });

    // 竖向分割线（1×16 at rightX+112, y=16）
    const vDiv = figma.createRectangle();
    vDiv.resize(1, 16); vDiv.x = rightX + 112; vDiv.y = 16;
    vDiv.fills = [{ type:'SOLID', color:C.black, opacity:0.10 }];
    bar.appendChild(vDiv);

    // 头像（圆形 Ellipse 24×24，非矩形）
    const avatar = figma.createEllipse();
    avatar.resize(24, 24); avatar.x = rightX + 129; avatar.y = 12;
    avatar.fills = [{ type:'SOLID', color:C.primaryL20 }];
    bar.appendChild(avatar);

    // 用户名
    const userName = figma.createText();
    userName.fontName   = { family:'PingFang SC', style:'Regular' };
    userName.fontSize   = 14; userName.lineHeight = { value:22, unit:'PIXELS' };
    userName.characters = '碧小园';
    userName.fills      = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    userName.x = rightX + 161; userName.y = 13;
    bar.appendChild(userName);

    return bar;
  }

  // ─────────────────────────────────────────────────────────────────
  //  面包屑标题栏（严格按 components.md makeBreadcrumbBar 规范）
  //  规范要点：
  //   · title x=24 y=12 fs=16 Medium black@0.85
  //   · crumbs 从 x=104 开始（固定，非动态跟随 title）
  //   · 每级文字 fs=14 Regular black@0.65 y=13
  //   · 分隔箭头 chevron-right 12×12
  //   · 底部 1px divider rect at y=47 black@0.10
  // ─────────────────────────────────────────────────────────────────
  async function makeBreadcrumbBar(totalW, crumbs = []) {
    const bar = figma.createFrame();
    bar.name = 'BreadcrumbBar';
    bar.resize(totalW, 48);
    bar.fills = solid(C.white);

    // 底部分割线
    const div = figma.createRectangle();
    div.resize(totalW, 1); div.x = 0; div.y = 47;
    div.fills = [{ type:'SOLID', color:C.black, opacity:0.10 }];
    bar.appendChild(div);

    // 本级标题（取 crumbs 最后一项）
    const currentTitle = crumbs[crumbs.length - 1] || '本级标题';
    const titleT = figma.createText();
    titleT.fontName   = { family:'PingFang SC', style:'Medium' };
    titleT.fontSize   = 16; titleT.lineHeight = { value:24, unit:'PIXELS' };
    titleT.characters = currentTitle;
    titleT.fills      = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    titleT.x = 24; titleT.y = 12;
    bar.appendChild(titleT);

    // 面包屑（从 x=104 开始，固定起点，不随标题宽度变化）
    if (crumbs.length > 0) {
      let curX = 104;
      crumbs.forEach((crumb, i) => {
        const t = figma.createText();
        t.fontName   = { family:'PingFang SC', style:'Regular' };
        t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
        t.characters = crumb;
        t.fills      = [{ type:'SOLID', color:C.black, opacity:0.65 }];
        t.x = curX; t.y = 13;
        bar.appendChild(t);
        curX += t.width;

        if (i < crumbs.length - 1) {
          const arrow = figma.createNodeFromSvg(ICONS['chevron-right']);
          arrow.resize(12, 12); arrow.x = curX + 4; arrow.y = 18;
          arrow.findAll(n => n.strokes && n.strokes.length > 0)
            .forEach(n => { n.strokes = solid(C.black, 0.45); });
          bar.appendChild(arrow);
          curX += 12 + 8; // arrow width + gap
        }
      });
    }

    return bar;
  }

  // ── 筛选区 ───────────────────────────────────────────────────────
  const LABEL_W   = 112;
  const LABEL_GAP = 12;
  const FCOL_W    = 379;
  const INPUT_W   = FCOL_W - LABEL_W - LABEL_GAP; // 255
  const COL_X     = [24, 411, 798];

  function addFilter(parent, label, col, rowIdx, fieldType) {
    const x0 = COL_X[col];
    const y0 = 24 + rowIdx * 48;
    parent.appendChild(truncText(label, C.black, LABEL_W, {a:0.65, x:x0, y:y0+5}));
    const inputX = x0 + LABEL_W + LABEL_GAP;
    if (fieldType === 'select') {
      const sel = frame(`sel-${label}`, INPUT_W, 32, C.white,
        {r:2, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      parent.appendChild(sel);
      sel.appendChild(text('请选择', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
      const arr = icon('DropDown-Arrow', 12, C.black, 0.35);
      if (arr) { arr.x=INPUT_W-20; arr.y=10; sel.appendChild(arr); }
    } else {
      const box = frame(`inp-${label}`, INPUT_W, 32, C.white,
        {r:2, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      parent.appendChild(box);
      box.appendChild(text('请输入', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
    }
  }

  // ── 筛选操作按钮 ─────────────────────────────────────────────────
  function buildFilterActions(mainCard, y) {
    let bx = CARD_W - PAD;
    const colT  = text('收起', C.primary, 14, {lh:22});
    const arrUp = icon('PutAway-Arrow', 16, C.primary, 0.85);
    const colW  = colT.width + (arrUp ? 4+16 : 0);
    colT.x=bx-colW; colT.y=y+5; mainCard.appendChild(colT);
    if (arrUp) { arrUp.x=bx-16; arrUp.y=y+8; mainCard.appendChild(arrUp); }
    bx = bx-colW-16;

    const rstW = measureText('重置',14)+32;
    const rstBtn = frame('btn-重置', rstW, 32, C.white,
      {r:2, x:bx-rstW, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(rstBtn);
    const rstT = text('重置', C.black, 14, {lh:22, a:0.65});
    rstT.x=Math.round((rstW-rstT.width)/2); rstT.y=5; rstBtn.appendChild(rstT);
    bx = bx-rstW-8;

    const qryW = measureText('查询',14)+32;
    const qryBtn = frame('btn-查询', qryW, 32, C.primary, {r:2, x:bx-qryW, y});
    mainCard.appendChild(qryBtn);
    const qryT = text('查询', C.white, 14, {lh:22});
    qryT.x=Math.round((qryW-qryT.width)/2); qryT.y=5; qryBtn.appendChild(qryT);
  }

  // ── 表格工具行 ───────────────────────────────────────────────────
  function buildTableToolbar(mainCard, y) {
    let bx = CARD_W - PAD;
    const addLblW = measureText('新增合同', 14);
    const addBtnW = 12+16+8+addLblW+12;
    bx -= addBtnW;
    const addBtn = frame('btn-新增合同', addBtnW, 32, C.primary, {r:2, x:bx, y});
    mainCard.appendChild(addBtn);
    const icAdd = icon('Add', 16, C.white, 1);
    if (icAdd) { icAdd.x=12; icAdd.y=8; addBtn.appendChild(icAdd); }
    addBtn.appendChild(text('新增合同', C.white, 14, {lh:22, x:36, y:5}));
    bx -= 8;

    const expW = measureText('导出',14)+32;
    bx -= expW;
    const expBtn = frame('btn-导出', expW, 32, C.white,
      {r:2, x:bx, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(expBtn);
    const expT = text('导出', C.black, 14, {lh:22, a:0.65});
    expT.x=Math.round((expW-expT.width)/2); expT.y=5; expBtn.appendChild(expT);
  }

  // ── 表格列定义 ───────────────────────────────────────────────────
  // 总宽 1152，FROZEN_X=992
  const COLS = [
    {label:'合同编号',    w:100, type:'link'     },
    {label:'客户名称',    w: 88, type:'plain'    },
    {label:'合同名称',    w: 96, type:'plain'    },
    {label:'合同场景',    w: 64, type:'sceneTag' },
    {label:'合同类型',    w: 72, type:'typeTag'  },
    {label:'合同状态',    w: 72, type:'statusTag'},
    {label:'BIP审批编号', w: 96, type:'plain'    },
    {label:'合同总金额',  w:100, type:'amount'   },
    {label:'已下单金额',  w:100, type:'amount'   },
    {label:'销售人员',    w: 64, type:'plain'    },
    {label:'生效日期',    w: 80, type:'plain'    },
    {label:'到期日期',    w: 60, type:'plain'    },
    {label:'操作',        w:160, type:'ops'      },
  ];
  // 验证：100+88+96+64+72+72+96+100+100+64+80+60+160 = 1152 ✓

  // ── 表头（仅底部 1px 分割线）────────────────────────────────────
  function buildTableHeader(mainCard) {
    const thead = frame('表头', TBL_W, HEADER_H, C.tableHead, {x:PAD, y:TBL_Y});
    mainCard.appendChild(thead);

    let cx = 0;
    COLS.forEach(col => {
      if (col.type === 'amount') {
        const t = truncText(col.label, C.black, col.w - 8,
          {style:'Medium', a:0.85, alignH:'RIGHT', x:cx, y:Math.round((HEADER_H-22)/2)});
        thead.appendChild(t);
      } else {
        const t = truncText(col.label, C.black, col.w - 24,
          {style:'Medium', a:0.85, x:cx+16, y:Math.round((HEADER_H-22)/2)});
        thead.appendChild(t);
      }
      cx += col.w;
    });

    // 仅底部分割线（黑色 10%）
    thead.appendChild(rect(TBL_W, 1, C.black, {a:0.10, x:0, y:HEADER_H-1}));
    // 冻结列竖线
    thead.appendChild(rect(1, HEADER_H, C.black, {a:0.18, x:FROZEN_X, y:0}));
  }

  // ── Tag 辅助 ─────────────────────────────────────────────────────
  const STATUS_CFG = {
    '已生效':    {bg:C.successL90, txt:C.success, ta:1   },
    '待财务审核':{bg:C.warningL90, txt:C.warning, ta:1   },
    '草稿':      {bg:C.tagGrayBg,  txt:C.black,   ta:0.65},
    '已终止':    {bg:C.dangerL90,  txt:C.danger,  ta:1   },
    '已到期':    {bg:C.tagGrayBg,  txt:C.black,   ta:0.45},
    '审核驳回':  {bg:C.dangerL90,  txt:C.danger,  ta:1   },
  };
  const BLUE_TAG = {bg:C.primaryL90, txt:C.primary};

  function makeTag(label, bg, txtColor, ta, parent, x, y) {
    const g = frame(`tag-${label}`, 60, 22, bg, {r:2, x, y});
    parent.appendChild(g);
    const t = text(label, txtColor, 12, {lh:20, a:ta, x:8, y:1});
    g.appendChild(t);
    g.resize(t.width + 16, 22);
  }

  // ── 操作列（按状态）─────────────────────────────────────────────
  function getOps(status) {
    const pri=C.primary, suc=hex('#00875A'), dng=hex('#CF1322'), wrn=hex('#D46B08');
    return ({
      '已生效':    [['详情',pri],['终止',wrn]],
      '待财务审核':[['详情',pri],['财务通过',suc],['财务驳回',dng]],
      '草稿':      [['详情',pri],['编辑',pri],['提交审核',suc]],
      '审核驳回':  [['详情',pri],['编辑',pri],['提交审核',suc]],
      '已终止':    [['详情',pri]],
      '已到期':    [['详情',pri]],
    })[status] || [['详情',pri]];
  }

  // ── 数据行（仅底部分割线）────────────────────────────────────────
  function buildDataRow(mainCard, row, rowIdx) {
    const rowY = TBL_Y + HEADER_H + rowIdx * ROW_H;
    const tr   = frame(`row-${rowIdx}`, TBL_W, ROW_H, C.white, {x:PAD, y:rowY});
    mainCard.appendChild(tr);

    const cellY = Math.round((ROW_H - 22) / 2); // 13px
    let cx = 0;

    COLS.forEach(col => {
      const availW = col.w - 24; // 16左 + 8右

      if (col.type === 'link') {
        tr.appendChild(truncText(row.id, C.primary, availW, {x:cx+16, y:cellY}));

      } else if (col.type === 'plain') {
        let val = '';
        if (col.label==='客户名称')    val=row.client;
        if (col.label==='合同名称')    val=row.name;
        if (col.label==='BIP审批编号') val=row.bip;
        if (col.label==='销售人员')    val=row.sales;
        if (col.label==='生效日期')    val=row.start;
        if (col.label==='到期日期')    val=row.end;
        tr.appendChild(truncText(val, C.black, availW, {a:0.85, x:cx+16, y:cellY}));

      } else if (col.type === 'amount') {
        const val = col.label==='合同总金额' ? row.total : row.ordered;
        const t = text(val, C.black, 14, {lh:22, a:0.85});
        t.x = cx + col.w - t.width - 8; t.y = cellY;
        tr.appendChild(t);

      } else if (col.type === 'sceneTag') {
        makeTag(row.scene, BLUE_TAG.bg, BLUE_TAG.txt, 1, tr, cx+8, Math.round((ROW_H-22)/2));

      } else if (col.type === 'typeTag') {
        makeTag(row.type, BLUE_TAG.bg, BLUE_TAG.txt, 1, tr, cx+8, Math.round((ROW_H-22)/2));

      } else if (col.type === 'statusTag') {
        const cfg = STATUS_CFG[row.status] || STATUS_CFG['草稿'];
        makeTag(row.status, cfg.bg, cfg.txt, cfg.ta, tr, cx+8, Math.round((ROW_H-22)/2));

      } else if (col.type === 'ops') {
        const ops = getOps(row.status);
        let ox = cx + 8;
        ops.forEach(([label, color]) => {
          const ot = text(label, color, 14, {lh:22, x:ox, y:cellY});
          tr.appendChild(ot);
          ox += ot.width + 10;
        });
      }
      cx += col.w;
    });

    // 仅底部分割线（黑色 6%）
    tr.appendChild(rect(TBL_W, 1, C.black, {a:0.06, x:0, y:ROW_H-1}));
    // 冻结列竖线
    tr.appendChild(rect(1, ROW_H, C.black, {a:0.18, x:FROZEN_X, y:0}));
  }

  // ── 完整分页（右对齐）────────────────────────────────────────────
  function buildFullPagination(mainCard, y, total, currentPage, pageCount) {
    const BTN=32, GAP=4;
    let px = CARD_W - PAD;

    const tPage = text('页', C.black, 14, {lh:22, a:0.85});
    tPage.x=px-tPage.width; tPage.y=y+5; mainCard.appendChild(tPage); px=tPage.x-4;

    const jumpBox = frame('jump-input', 40, BTN, C.white,
      {r:2, x:px-40, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(jumpBox);
    const tJ = text(String(currentPage), C.black, 14, {lh:22, a:0.65});
    tJ.x=Math.round((40-tJ.width)/2); tJ.y=5; jumpBox.appendChild(tJ);
    px = px-40-4;

    const tGoto = text('跳转至', C.black, 14, {lh:22, a:0.65});
    tGoto.x=px-tGoto.width; tGoto.y=y+5; mainCard.appendChild(tGoto); px=tGoto.x-12;

    function mkBtn(label, isActive) {
      const b = frame('pgbtn-'+label, BTN, BTN,
        isActive ? C.primary : C.white,
        {r:2, x:px-BTN, y,
         stroke: isActive ? undefined : C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(b);
      const t = text(label, isActive?C.white:C.black, 14, {lh:22, a:isActive?1:0.85});
      t.x=Math.round((BTN-t.width)/2); t.y=Math.round((BTN-22)/2); b.appendChild(t);
      px -= BTN+GAP;
    }
    mkBtn('›', false);
    for (let p=pageCount; p>=1; p--) mkBtn(String(p), p===currentPage);
    mkBtn('‹', false);
    px -= (8-GAP);

    const PS_W=96;
    const psBox = frame('page-size', PS_W, BTN, C.white,
      {r:2, x:px-PS_W, y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(psBox);
    psBox.appendChild(text('20条/页', C.black, 14, {lh:22, a:0.65, x:10, y:5}));
    const psArr = icon('DropDown-Arrow', 12, C.black, 0.35);
    if (psArr) { psArr.x=PS_W-20; psArr.y=10; psBox.appendChild(psArr); }
    px = px-PS_W-16;

    const tTotal = text(`共 ${total} 条`, C.black, 14, {lh:22, a:0.65});
    tTotal.x=px-tTotal.width; tTotal.y=y+5; mainCard.appendChild(tTotal);
  }

  // ──────────────────────────────────────────────────────────────────
  //  构建页面
  // ──────────────────────────────────────────────────────────────────
  const root = figma.createFrame();
  root.name = '合同管理列表页';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg);
  root.clipsContent = true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name = '合同管理';

  // ─ 侧边栏（VERTICAL 自动布局，精确规范）
  const sidebar = await makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  // ─ 主区域
  const main = figma.createFrame();
  main.name = '主区域';
  main.resize(MAIN_W, CANVAS_H);
  main.fills = [];
  main.x = SIDE_W; main.y = 0;
  root.appendChild(main);

  // 顶部工具栏（48px）
  const headerBar = await makeHeaderBar(MAIN_W);
  headerBar.x = 0; headerBar.y = 0;
  main.appendChild(headerBar);

  // 面包屑标题栏（48px，紧接工具栏）
  const breadBar = await makeBreadcrumbBar(MAIN_W, ['首页', '销售管理', '合同管理']);
  breadBar.x = 0; breadBar.y = NAV_H;
  main.appendChild(breadBar);

  // ─ 内容卡片
  const cardY = NAV_H + TITLE_H + OUTER_PAD; // 112
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, {r:8, x:OUTER_PAD, y:cardY});
  main.appendChild(mainCard);

  // 筛选区（2 行满列）
  addFilter(mainCard, '合同编号', 0, 0, 'text');
  addFilter(mainCard, '客户名称', 1, 0, 'text');
  addFilter(mainCard, '合同状态', 2, 0, 'select');
  addFilter(mainCard, '合同名称', 0, 1, 'text');
  addFilter(mainCard, '合同场景', 1, 1, 'select');
  addFilter(mainCard, '合同类型', 2, 1, 'select');

  // 筛选区与按钮行之间的分割线
  mainCard.appendChild(rect(CARD_W, 1, C.black, {a:0.06, y:FILTER_ACT_Y-8}));
  buildFilterActions(mainCard, FILTER_ACT_Y);

  // 工具行与表格之间分割线
  mainCard.appendChild(rect(CARD_W, 1, C.black, {a:0.08, y:TOOLBAR_Y-8}));
  buildTableToolbar(mainCard, TOOLBAR_Y);

  // 表格上方分割线
  mainCard.appendChild(rect(CARD_W, 1, C.black, {a:0.10, y:DIVIDER_Y}));

  // 表格
  buildTableHeader(mainCard);

  const rows = [
    {id:'BJ-2026-00001',client:'碧桂园集团',name:'万科碧桂园战略合作协议',scene:'销售',type:'框架合同',status:'已生效',   bip:'BIP-2026-001',total:'¥1,200,000.00',ordered:'¥800,000.00', sales:'张伟',start:'2026-01-01',end:'2026-12-31'},
    {id:'BJ-2026-00002',client:'华润置地',  name:'房屋维修服务合同',      scene:'服务',type:'单项合同',status:'待财务审核',bip:'BIP-2026-002',total:'¥350,000.00',  ordered:'¥0.00',       sales:'李芳',start:'2026-02-15',end:'2026-08-14'},
    {id:'BJ-2026-00003',client:'万科企业',  name:'物业管理服务协议',      scene:'物管',type:'框架合同',status:'草稿',      bip:'-',           total:'¥2,800,000.00',ordered:'¥1,500,000.00',sales:'王强',start:'2026-03-01',end:'2027-02-28'},
    {id:'BJ-2026-00004',client:'中海地产',  name:'安保服务合同',          scene:'安保',type:'单项合同',status:'已终止',    bip:'BIP-2026-004',total:'¥180,000.00',  ordered:'¥180,000.00', sales:'陈梅',start:'2025-06-01',end:'2026-05-31'},
    {id:'BJ-2026-00005',client:'保利发展',  name:'绿化养护合同',          scene:'绿化',type:'框架合同',status:'已到期',    bip:'BIP-2026-005',total:'¥95,000.00',   ordered:'¥95,000.00',  sales:'赵刚',start:'2025-01-01',end:'2025-12-31'},
    {id:'BJ-2026-00006',client:'龙湖集团',  name:'设备维护服务合同',      scene:'维修',type:'单项合同',status:'审核驳回',  bip:'BIP-2026-006',total:'¥460,000.00',  ordered:'¥0.00',       sales:'刘静',start:'2026-04-01',end:'2026-09-30'},
  ];
  rows.forEach((row, i) => buildDataRow(mainCard, row, i));

  // 分页
  buildFullPagination(mainCard, PAGER_Y, 68, 1, 3);

  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin('✅ 合同管理列表页 v6 已生成（1440×' + CANVAS_H + '）');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
