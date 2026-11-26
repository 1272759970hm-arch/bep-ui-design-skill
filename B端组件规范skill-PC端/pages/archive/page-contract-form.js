// ======================================================
// BeP Admin Kit — 合同录入表单页面
// 1440×900，含侧边栏 + 顶部导航 + 标题栏 + 表单卡片
// 两列表单布局 + 分组标题 + 文本域 + 上传区 + 底部操作按钮
// ======================================================

const ICONS = {
  // 侧边栏菜单图标
  "home":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text":     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0068 8.82849H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "tool":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.6982 6.30265C14.3171 6.69139 14.3171 7.31353 14.6982 7.70227L16.2977 9.30184C16.6865 9.68288 17.3086 9.68288 17.6974 9.30184L21.4663 5.53286C22.4957 7.80751 22.0084 10.4819 20.2429 12.2473C18.4775 14.0128 15.8031 14.5 13.5285 13.4707L6.62034 20.3788C5.79214 21.2071 4.44936 21.2071 3.62115 20.3788C2.79295 19.5506 2.79295 18.2079 3.62115 17.3797L10.5293 10.4715C9.49996 8.19687 9.98724 5.5225 11.7527 3.75706C13.5181 1.99162 16.1925 1.50434 18.4671 2.53367L14.7082 6.29265L14.6982 6.30265Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "pie-chart":     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2104 15.89C19.4603 20.0289 15.1643 22.4921 10.7082 21.9116C6.25216 21.331 2.73058 17.8495 2.09923 13.4003C1.46787 8.95119 3.88181 4.62732 8.00044 2.83002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.0005 12C22.0005 9.34784 20.9469 6.8043 19.0716 4.92893C17.1962 3.05357 14.6527 2 12.0005 2V12H22.0005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // 导航箭头
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  // 顶部导航
  "menu":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bell":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // 表单专用图标
  "calendar":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "upload-cloud":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 16L12 12L8 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.39 18.39A5 5 0 0 0 18 9H16.74A8 8 0 1 0 3 16.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ======================================================

async function buildPage() {
  // ── 颜色工具 ──────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 };
  }
  function solid(color, a=1) { return [{type:'SOLID', color, opacity:a}]; }

  const C = {
    pageBg:    hex('#F0F2F5'),
    white:     hex('#FFFFFF'),
    sidebarBg: hex('#002138'),
    sidebarSub:hex('#00182a'),
    primary:   hex('#006D9B'),
    danger:    hex('#FE5E54'),
    textBody:  hex('#000000'),
    border:    hex('#000000'),
    uploadBg:  hex('#FAFAFA'),
  };

  await Promise.all([
    figma.loadFontAsync({family:'PingFang TC', style:'Regular'}),
    figma.loadFontAsync({family:'PingFang TC', style:'Medium'}),
    figma.loadFontAsync({family:'PingFang TC', style:'Semibold'}),
  ]);

  // ── 基础工厂 ──────────────────────────────────────────
  function frame(name, w, h, bg, opts={}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA||1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r  !== undefined) f.cornerRadius = opts.r;
    if (opts.x  !== undefined) f.x = opts.x;
    if (opts.y  !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes    = solid(opts.stroke, opts.strokeA||1);
      f.strokeWeight = opts.strokeW||1;
      f.strokeAlign  = 'INSIDE';
    }
    return f;
  }
  function rect(w, h, color, opts={}) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a||1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    if (opts.stroke) {
      r.strokes    = solid(opts.stroke, opts.strokeA||1);
      r.strokeWeight = opts.strokeW||1;
      r.strokeAlign  = 'INSIDE';
    }
    return r;
  }
  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName = {family:'PingFang TC', style: opts.style||'Regular'};
    t.fontSize = size;
    t.lineHeight = {value: opts.lh||(size+8), unit:'PIXELS'};
    t.characters = chars;
    t.fills = solid(color, opts.a||1);
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    return t;
  }
  function icon(key, size, color, opacity=1) {
    const svg = ICONS[key];
    if (!svg) return null;
    const node = figma.createNodeFromSvg(svg);
    node.resize(size, size);
    node.opacity = opacity;
    node.findAll(n => n.fills  && n.fills.length>0  && n.fills[0].type==='SOLID').forEach(n=>{ n.fills=solid(color,1); });
    node.findAll(n => n.strokes && n.strokes.length>0).forEach(n=>{ n.strokes=solid(color,1); });
    return node;
  }

  // ═══════════════════════════════════════════════════════
  // 根页面 1440 × 900
  // ═══════════════════════════════════════════════════════
  const page = frame('新建合同', 1440, 900, C.pageBg);
  figma.currentPage.appendChild(page);
  page.x = 100; page.y = 100;

  // ═══════════════════════════════════════════════════════
  // 1. 侧边栏  208 × 900
  // ═══════════════════════════════════════════════════════
  const sidebar = frame('侧边栏', 208, 900, C.sidebarBg, {clip:true});
  page.appendChild(sidebar);

  // Logo
  {
    const logoRow = frame('Logo', 208, 64, null);
    logoRow.fills = [];
    sidebar.appendChild(logoRow);
    logoRow.appendChild(rect(32, 32, C.primary, {r:6, x:24, y:16}));
    logoRow.appendChild(text('BeP设计平台', C.white, 16, {lh:20, style:'Medium', x:64, y:14}));
    logoRow.appendChild(text('COUNTRY GARDEN SERVICES', C.white, 6, {lh:10, a:0.6, x:64, y:37}));
  }

  function addSideL1(parent, label, iconKey, y, {active=false, expanded=false}={}) {
    const op = active ? 1 : 0.5;
    const row = frame(`L1·${label}`, 208, 48, C.sidebarBg);
    row.y = y; parent.appendChild(row);
    const ic = icon(iconKey, 16, C.white, op);
    if (ic) { ic.x=24; ic.y=16; row.appendChild(ic); }
    row.appendChild(text(label, C.white, 14, {lh:22, a:op, x:52, y:13}));
    const arr = icon(expanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, op);
    if (arr) { arr.x=186; arr.y=18; row.appendChild(arr); }
  }
  function addSideL2(parent, label, y, {active=false}={}) {
    const op = active ? 1 : 0.5;
    const row = frame(`L2·${label}`, 208, 48, C.sidebarSub);
    row.y = y; parent.appendChild(row);
    row.appendChild(text(label, C.white, 14, {lh:22, a:op, x:40, y:13}));
    const arr = icon('DropDown-Arrow', 12, C.white, op);
    if (arr) { arr.x=186; arr.y=18; row.appendChild(arr); }
  }
  function addSideDivider(parent, y) {
    parent.appendChild(rect(160, 1, C.white, {a:0.08, x:24, y}));
  }

  let sy = 64;
  addSideL1(sidebar, '首页',     'home',        sy); sy+=48;
  addSideL1(sidebar, '数据看板', 'bar-chart-2', sy); sy+=48;
  addSideDivider(sidebar, sy); sy+=1;
  addSideL1(sidebar, '房产管理', 'layers',      sy); sy+=48;
  addSideL1(sidebar, '合同管理', 'file-text',   sy, {active:true, expanded:true}); sy+=48;
  addSideL2(sidebar, '合同列表', sy, {active:true}); sy+=48;
  addSideL2(sidebar, '合同审核', sy); sy+=48;
  addSideL1(sidebar, '工单管理', 'tool',        sy); sy+=48;
  addSideL1(sidebar, '报表中心', 'pie-chart',   sy); sy+=48;
  addSideDivider(sidebar, sy); sy+=1;
  addSideL1(sidebar, '系统设置', 'settings',    sy);

  // ═══════════════════════════════════════════════════════
  // 2. 主区域  1232 × 900
  // ═══════════════════════════════════════════════════════
  const main = frame('主区域', 1232, 900, C.pageBg, {clip:true});
  main.x = 208;
  page.appendChild(main);

  // 顶部导航栏
  {
    const nav = frame('顶部导航', 1232, 56, C.white, {stroke:C.border, strokeA:0.08, strokeW:1});
    main.appendChild(nav);
    const icMenu = icon('menu', 20, C.textBody, 0.45);
    if (icMenu) { icMenu.x=16; icMenu.y=18; nav.appendChild(icMenu); }
    nav.appendChild(text('合同管理系统', C.textBody, 14, {lh:22, a:0.65, x:44, y:17}));
    const SW = 160;
    const searchBox = frame('search-input', SW, 32, C.white,
      {r:4, x:1232-24-28-12-20-8-SW, y:12, stroke:C.border, strokeA:0.12, strokeW:1});
    nav.appendChild(searchBox);
    const icS = icon('search', 14, C.textBody, 0.35);
    if (icS) { icS.x=10; icS.y=9; searchBox.appendChild(icS); }
    searchBox.appendChild(text('搜索', C.textBody, 14, {lh:22, a:0.25, x:28, y:5}));
    const icBell = icon('bell', 20, C.textBody, 0.45);
    if (icBell) { icBell.x=1232-24-28-12-20; icBell.y=18; nav.appendChild(icBell); }
    nav.appendChild(rect(28, 28, C.primary, {r:14, x:1232-24-28, y:14}));
    const uT = text('管', C.white, 12, {lh:28, style:'Medium'});
    uT.x=1232-24-28+8; uT.y=14; nav.appendChild(uT);
  }

  // 页面标题栏（标题 + 面包屑左对齐）
  {
    const titleBar = frame('标题栏', 1232, 56, C.white, {stroke:C.border, strokeA:0.06, strokeW:1});
    titleBar.y = 56; main.appendChild(titleBar);
    const titleNode = text('新建合同', C.textBody, 18, {lh:24, style:'Medium', x:24, y:16});
    titleBar.appendChild(titleNode);
    const crumbs = [
      {label:'首页',   link:true},
      {label:'合同管理', link:true},
      {label:'合同列表', link:true},
      {label:'新建合同', link:false},
    ];
    const crumbNodes = [], sepNodes = [];
    crumbs.forEach((c, i) => {
      crumbNodes.push(text(c.label, C.textBody, 12,
        {lh:18, a: c.link ? 0.65 : 0.45}));
      if (i < crumbs.length-1) sepNodes.push(text(' › ', C.textBody, 12, {lh:18, a:0.25}));
    });
    let bx = 24 + titleNode.width + 16;
    crumbs.forEach((c, i) => {
      crumbNodes[i].x=bx; crumbNodes[i].y=19; titleBar.appendChild(crumbNodes[i]);
      bx += crumbNodes[i].width;
      if (i < crumbs.length-1) {
        sepNodes[i].x=bx; sepNodes[i].y=19; titleBar.appendChild(sepNodes[i]);
        bx += sepNodes[i].width;
      }
    });
  }

  // ═══════════════════════════════════════════════════════
  // 内容区  y=112  h=788
  // ═══════════════════════════════════════════════════════
  const HEADER_H = 112;
  const content = frame('内容区', 1232, 900-HEADER_H, C.pageBg);
  content.y = HEADER_H;
  main.appendChild(content);

  const OUTER_PAD = 16;
  const PAD = 24;
  const CARD_W = 1232 - OUTER_PAD*2;   // 1200
  const CARD_H = (900-HEADER_H) - OUTER_PAD*2; // 756

  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, {r:8, x:OUTER_PAD, y:OUTER_PAD});
  content.appendChild(mainCard);

  // ─ 表单布局常量 ────────────────────────────────────────────
  // 两列：各 564px，间距 24px
  const COL_W   = Math.floor((CARD_W - PAD*2 - 24) / 2); // 564
  const COL_GAP = 24;
  const ROW_H   = 56; // 32(控件) + 24(行间距)

  function colX(col) { return PAD + col * (COL_W + COL_GAP); }

  // ── 预量所有标签，以最宽者为基准，全部右对齐 ─────────────
  // 先创建临时文字节点量宽，量完移除，不 append 到画布
  // 合同金额的（元）改为后缀标签，label 只写"合同金额"
  const ALL_LABELS = ['合同编号','合同名称','合同类型','合同金额',
                      '签订日期','合同期限','签约甲方','签约乙方',
                      '合同摘要','上传附件','备注'];
  const _tmp = ALL_LABELS.map(l => text(l, C.textBody, 14, {lh:22, a:0.65}));
  const LABEL_AREA  = Math.max(..._tmp.map(n => n.width)); // 最宽标签的宽度
  _tmp.forEach(n => n.remove());                           // 清理临时节点
  const CTRL_OFFSET = LABEL_AREA + 8;                     // 控件统一起始偏移

  // 分组标题 + 下划线
  function sectionTitle(y, title) {
    mainCard.appendChild(text(title, C.textBody, 14, {lh:22, style:'Medium', a:0.85, x:PAD, y}));
    mainCard.appendChild(rect(CARD_W, 1, C.border, {a:0.08, x:0, y:y+30}));
    return y + 47;
  }

  // ── 带后缀/前缀输入框 ─────────────────────────────────────
  // 规范：外层容器统一边框 r=4，内部分隔线 1px，附件区背景 #F5F5F5
  // addonW = addonText.width + 24（左右各 12px padding）
  function makeAddonInput(parent, ctrlW, ctrlX, y, {suffix=null, prefix=null}={}) {
    const ADDON_BG = hex('#F5F5F5');
    const H = 32;

    // 量 addon 文字宽度
    const addonStr = suffix || prefix;
    const addonT = text(addonStr, C.textBody, 14, {lh:22, a:0.65});
    const ADDON_W = addonT.width + 24; // 左右各 12px
    addonT.remove(); // 临时节点，量完即删

    const INPUT_W = ctrlW - ADDON_W;

    // 外层容器（统一外框）
    const container = frame(`addon-inp-${addonStr}`, ctrlW, H, C.white,
      {r:4, x:ctrlX, y, stroke:C.border, strokeA:0.15, strokeW:1});
    parent.appendChild(container);

    if (suffix) {
      // 输入区域（左侧）
      container.appendChild(text('请输入', C.textBody, 14, {lh:22, a:0.25, x:12, y:5}));
      // 分隔线
      container.appendChild(rect(1, H, C.border, {a:0.15, x:INPUT_W, y:0}));
      // 后缀区域（右侧，灰色背景）
      const addonBox = frame(`suffix-${addonStr}`, ADDON_W, H, ADDON_BG);
      addonBox.x = INPUT_W; addonBox.y = 0;
      container.appendChild(addonBox);
      const at = text(addonStr, C.textBody, 14, {lh:22, a:0.65});
      at.x = Math.round((ADDON_W - at.width) / 2); at.y = 5;
      addonBox.appendChild(at);

    } else {
      // 前缀区域（左侧，灰色背景）
      const addonBox = frame(`prefix-${addonStr}`, ADDON_W, H, ADDON_BG);
      addonBox.x = 0; addonBox.y = 0;
      container.appendChild(addonBox);
      const at = text(addonStr, C.textBody, 14, {lh:22, a:0.65});
      at.x = Math.round((ADDON_W - at.width) / 2); at.y = 5;
      addonBox.appendChild(at);
      // 分隔线
      container.appendChild(rect(1, H, C.border, {a:0.15, x:ADDON_W, y:0}));
      // 输入区域（右侧）
      container.appendChild(text('请输入', C.textBody, 14, {lh:22, a:0.25, x:ADDON_W+12, y:5}));
    }
  }

  // 在指定列放置一个表单字段
  // label 右对齐到 colX + LABEL_AREA，控件从 colX + CTRL_OFFSET 开始
  // opts.suffix / opts.prefix：带附件标签的输入框
  function placeField(label, type, col, y, opts={}) {
    const x = colX(col);
    const lbl = text(label, C.textBody, 14, {lh:22, a:0.65});
    lbl.x = x + LABEL_AREA - lbl.width; // 右对齐
    lbl.y = y + 5;
    mainCard.appendChild(lbl);

    const ctrlX = x + CTRL_OFFSET;
    const ctrlW = COL_W - CTRL_OFFSET;

    if (opts.suffix || opts.prefix) {
      makeAddonInput(mainCard, ctrlW, ctrlX, y, opts);

    } else if (type === 'select') {
      const sel = frame(`sel-${label}`, ctrlW, 32, C.white,
        {r:4, x:ctrlX, y, stroke:C.border, strokeA:0.15, strokeW:1});
      mainCard.appendChild(sel);
      sel.appendChild(text('请选择', C.textBody, 14, {lh:22, a:0.25, x:12, y:5}));
      const arr = icon('DropDown-Arrow', 12, C.textBody, 0.35);
      if (arr) { arr.x=ctrlW-20; arr.y=10; sel.appendChild(arr); }

    } else if (type === 'date') {
      const dp = frame(`dp-${label}`, ctrlW, 32, C.white,
        {r:4, x:ctrlX, y, stroke:C.border, strokeA:0.15, strokeW:1});
      mainCard.appendChild(dp);
      const icCal = icon('calendar', 14, C.textBody, 0.35);
      if (icCal) { icCal.x=10; icCal.y=9; dp.appendChild(icCal); }
      dp.appendChild(text('请选择日期', C.textBody, 14, {lh:22, a:0.25, x:28, y:5}));

    } else if (type === 'daterange') {
      const dp = frame(`dpr-${label}`, ctrlW, 32, C.white,
        {r:4, x:ctrlX, y, stroke:C.border, strokeA:0.15, strokeW:1});
      mainCard.appendChild(dp);
      dp.appendChild(text('开始日期', C.textBody, 14, {lh:22, a:0.25, x:10, y:5}));
      dp.appendChild(text('~', C.textBody, 14, {lh:22, a:0.3, x:Math.round(ctrlW/2)-6, y:5}));
      dp.appendChild(text('结束日期', C.textBody, 14, {lh:22, a:0.25, x:Math.round(ctrlW/2)+6, y:5}));

    } else {
      const box = frame(`inp-${label}`, ctrlW, 32, C.white,
        {r:4, x:ctrlX, y, stroke:C.border, strokeA:0.15, strokeW:1});
      mainCard.appendChild(box);
      box.appendChild(text('请输入', C.textBody, 14, {lh:22, a:0.25, x:12, y:5}));
    }
  }

  // 全宽文本域：label 右对齐到 PAD+LABEL_AREA，控件从 PAD+CTRL_OFFSET 延伸至右
  function placeTextarea(label, y, h) {
    const lbl = text(label, C.textBody, 14, {lh:22, a:0.65});
    lbl.x = PAD + LABEL_AREA - lbl.width; // 右对齐
    lbl.y = y + 5;
    mainCard.appendChild(lbl);
    const ctrlX = PAD + CTRL_OFFSET;
    const ctrlW = CARD_W - PAD - ctrlX;
    const ta = frame(`ta-${label}`, ctrlW, h, C.white,
      {r:4, x:ctrlX, y, stroke:C.border, strokeA:0.15, strokeW:1});
    mainCard.appendChild(ta);
    ta.appendChild(text('请输入', C.textBody, 14, {lh:22, a:0.25, x:12, y:10}));
    return y + h + 16;
  }

  // 全宽上传区（虚线框）：同上对齐规则
  function placeUpload(label, y, h) {
    const lbl = text(label, C.textBody, 14, {lh:22, a:0.65});
    lbl.x = PAD + LABEL_AREA - lbl.width; // 右对齐
    lbl.y = y + 5;
    mainCard.appendChild(lbl);
    const ctrlX = PAD + CTRL_OFFSET;
    const ctrlW = CARD_W - PAD - ctrlX;

    const zone = frame(`upload-${label}`, ctrlW, h, C.uploadBg, {r:4, x:ctrlX, y});
    zone.strokes = solid(C.border, 0.2);
    zone.strokeWeight = 1;
    zone.strokeAlign = 'INSIDE';
    zone.dashPattern = [6, 4];
    mainCard.appendChild(zone);

    // 三行内容整体垂直居中
    const BLOCK_H = 20 + 8 + 22 + 6 + 18; // icon + gap + 主文 + gap + 提示 = 74px
    const blockY  = Math.round((h - BLOCK_H) / 2);

    const icUp = icon('upload-cloud', 20, C.textBody, 0.35);
    if (icUp) { icUp.x=Math.round(ctrlW/2)-10; icUp.y=blockY; zone.appendChild(icUp); }

    const upT = text('点击或拖拽文件至此处上传', C.textBody, 14, {lh:22, a:0.45});
    upT.x = Math.round((ctrlW - upT.width) / 2);
    upT.y = blockY + 20 + 8;
    zone.appendChild(upT);

    const upHint = text('支持 PDF、Word、Excel，单文件不超过 20MB', C.textBody, 12, {lh:18, a:0.3});
    upHint.x = Math.round((ctrlW - upHint.width) / 2);
    upHint.y = blockY + 20 + 8 + 22 + 6;
    zone.appendChild(upHint);

    return y + h + 16;
  }

  // ═══════════════════════════════════════════════════════
  // 表单内容
  // ═══════════════════════════════════════════════════════
  let curY = PAD; // = 24

  // ── 第一组：基本合同信息 ────────────────────────────────
  curY = sectionTitle(curY, '基本合同信息'); // → 71

  // 行1：合同编号 | 合同名称
  placeField('合同编号', 'text',   0, curY);
  placeField('合同名称', 'text',   1, curY);
  curY += ROW_H; // → 127

  // 行2：合同类型 | 合同金额（元）
  placeField('合同类型',    'select', 0, curY);
  placeField('合同金额', 'text', 1, curY, {suffix:'元'});
  curY += ROW_H; // → 183

  // 行3：签订日期 | 合同期限
  placeField('签订日期', 'date',      0, curY);
  placeField('合同期限', 'daterange', 1, curY);
  curY += ROW_H; // → 239

  // 行4：签约甲方 | 签约乙方
  placeField('签约甲方', 'text', 0, curY);
  placeField('签约乙方', 'text', 1, curY);
  curY += ROW_H; // → 295

  // ── 第二组：合同详情 ────────────────────────────────────
  curY += 16; // 组间距 → 311
  curY = sectionTitle(curY, '合同详情'); // → 358

  // 合同摘要（文本域 h=80）
  curY = placeTextarea('合同摘要', curY, 80); // → 454

  // 上传附件（虚线上传区 h=80）
  curY = placeUpload('上传附件', curY, 100); // h=100 保证三行内容不被裁切

  // 备注（文本域 h=60）
  curY = placeTextarea('备注', curY, 60); // → 626

  // ── 底部操作按钮（卡片水平居中，取消 → 确定）────────────
  // y = CARD_H - PAD - 32 = 756 - 24 - 32 = 700
  {
    const BTN_Y = CARD_H - PAD - 32;
    const BTN_PAD = 16; // 按钮文字两侧各 16px
    const GAP = 12;

    // 先创建文字节点获取宽度，再由此计算按钮宽度
    const cancelT = text('取消', C.textBody, 14, {lh:22, a:0.65});
    const CANCEL_W = cancelT.width + BTN_PAD * 2;

    const okT = text('确定', C.white, 14, {lh:22});
    const OK_W = okT.width + BTN_PAD * 2;

    // 两个按钮整体水平居中
    const totalW = CANCEL_W + GAP + OK_W;
    const startX = Math.round((CARD_W - totalW) / 2);

    // 取消（白色+边框，左）
    const btnCancel = frame('btn-取消', CANCEL_W, 32, C.white,
      {r:4, x:startX, y:BTN_Y, stroke:C.border, strokeA:0.15, strokeW:1});
    mainCard.appendChild(btnCancel);
    cancelT.x = BTN_PAD; cancelT.y = 5;
    btnCancel.appendChild(cancelT);

    // 确定（primary，右）
    const btnOk = frame('btn-确定', OK_W, 32, C.primary,
      {r:4, x:startX + CANCEL_W + GAP, y:BTN_Y});
    mainCard.appendChild(btnOk);
    okT.x = BTN_PAD; okT.y = 5;
    btnOk.appendChild(okT);
  }

  figma.currentPage.selection = [page];
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin('✅ 合同录入表单已生成');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
