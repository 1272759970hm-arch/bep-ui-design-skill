// ======================================================
// BeP Admin Kit — 合同列表完整页面生成器
// 1440×900，含侧边栏 + 顶部面包屑 + 筛选区 + 表格区
// 所有图标来自 icons.md
// ======================================================

const ICONS = {
  // 侧边栏菜单图标
  "home":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "bar-chart-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "layers":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923V1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "file-text":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M10.0068 8.82849H9.00684H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "tool":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6982 6.30265C14.3171 6.69139 14.3171 7.31353 14.6982 7.70227L16.2977 9.30184C16.6865 9.68288 17.3086 9.68288 17.6974 9.30184L21.4663 5.53286C22.4957 7.80751 22.0084 10.4819 20.2429 12.2473C18.4775 14.0128 15.8031 14.5 13.5285 13.4707L6.62034 20.3788C5.79214 21.2071 4.44936 21.2071 3.62115 20.3788C2.79295 19.5506 2.79295 18.2079 3.62115 17.3797L10.5293 10.4715C9.49996 8.19687 9.98724 5.5225 11.7527 3.75706C13.5181 1.99162 16.1925 1.50434 18.4671 2.53367L14.7082 6.29265L14.6982 6.30265Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "pie-chart":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21.2104 15.89C19.4603 20.0289 15.1643 22.4921 10.7082 21.9116C6.25216 21.331 2.73058 17.8495 2.09923 13.4003C1.46787 8.95119 3.88181 4.62732 8.00044 2.83002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.0005 12C22.0005 9.34784 20.9469 6.8043 19.0716 4.92893C17.1962 3.05357 14.6527 2 12.0005 2V12H22.0005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "settings":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  // BeP 折叠箭头
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/> </svg>`,
  "PutAway-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/> </svg>`,
  // 顶部导航图标
  "menu":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M3 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "bell":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  // 页面功能图标
  "search":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "plus":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 5V19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "download":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "trash-2":     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6H5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M10 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "more-horizontal": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "check-circle":`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.0001 11.0862V12.0062C21.9975 16.4349 19.0824 20.3344 14.8354 21.5901C10.5885 22.8458 6.02145 21.1585 3.61101 17.4433C1.20057 13.7281 1.52092 8.86987 4.39833 5.50331C7.27574 2.13674 12.0248 1.06376 16.0701 2.86623" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M22 4.00623L12 14.0162L9 11.0162" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "clock":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "x-circle":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 9L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
};

// ======================================================

async function buildPage() {
  // ── 颜色 & 尺寸 ────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 };
  }
  function solid(color, a=1) { return [{type:'SOLID',color,opacity:a}]; }

  const C = {
    pageBg:      hex('#F0F2F5'),
    white:       hex('#FFFFFF'),
    sidebarBg:   hex('#002138'),
    sidebarSub:  hex('#00182a'),
    primary:     hex('#006D9B'),
    danger:      hex('#FE5E54'),
    warning:     hex('#FFA645'),
    success:     hex('#3BBB3E'),
    textTitle:   hex('#000000'),
    textBody:    hex('#000000'),
    textSec:     hex('#000000'),
    textPH:      hex('#000000'),
    border:      hex('#000000'),
    tableHeader: hex('#000000'),
    divider:     hex('#000000'),
    tagBlue:     hex('#E6F4FF'),
    tagBlueTxt:  hex('#006D9B'),
    tagGreen:    hex('#F0FFF0'),
    tagGreenTxt: hex('#3BBB3E'),
    tagOrange:   hex('#FFF7E6'),
    tagOrangeTxt:hex('#FFA645'),
    tagGray:     hex('#F5F5F5'),
    tagGrayTxt:  hex('#000000'),
    tagRed:      hex('#FFF1F0'),
    tagRedTxt:   hex('#FE5E54'),
  };

  // 字体
  await Promise.all([
    figma.loadFontAsync({family:'PingFang TC',style:'Regular'}),
    figma.loadFontAsync({family:'PingFang TC',style:'Medium'}),
    figma.loadFontAsync({family:'PingFang TC',style:'Semibold'}),
  ]);

  // ── 工具函数 ────────────────────────────────────────────

  function frame(name, w, h, bg, opts={}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA||1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r !== undefined) f.cornerRadius = opts.r;
    if (opts.x !== undefined) f.x = opts.x;
    if (opts.y !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes = solid(opts.stroke, opts.strokeA||1);
      f.strokeWeight = opts.strokeW||1;
      f.strokeAlign = 'INSIDE';
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
      r.strokes = solid(opts.stroke, opts.strokeA||1);
      r.strokeWeight = opts.strokeW||1;
      r.strokeAlign = 'INSIDE';
    }
    return r;
  }

  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName = {family:'PingFang TC', style: opts.style||'Regular'};
    t.fontSize = size;
    t.lineHeight = {value: opts.lh || (size+8), unit:'PIXELS'};
    t.characters = chars;
    t.fills = solid(color, opts.a||1);
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    return t;
  }

  // SVG 图标，染为指定颜色
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

  // 状态 Tag
  function statusTag(label, bgColor, txtColor, parent, x, y) {
    const g = figma.createFrame();
    g.name = `tag-${label}`;
    g.fills = solid(bgColor);
    g.cornerRadius = 4;
    g.resize(68, 22); g.x = x; g.y = y;
    parent.appendChild(g);
    const t = text(label, txtColor, 12, {lh:20, style:'Regular'});
    t.x = 8; t.y = 1;
    g.appendChild(t);
    g.resize(t.width + 16, 22);
    return g;
  }

  // ═══════════════════════════════════════════════════════
  // 根页面 Frame  1440 × 900
  // ═══════════════════════════════════════════════════════
  const page = frame('合同列表', 1440, 900, C.pageBg);
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
    const logoRect = rect(32, 32, C.primary, {r:6, x:24, y:16});
    logoRow.appendChild(logoRect);
    const t1 = text('BeP设计平台', C.white, 16, {lh:20, style:'Medium', x:64, y:14});
    logoRow.appendChild(t1);
    const t2 = text('COUNTRY GARDEN SERVICES', C.white, 6, {lh:10, a:0.6, x:64, y:37});
    logoRow.appendChild(t2);
  }

  // 侧边栏菜单辅助
  function sideIcon(key, size, opacity) {
    return icon(key, size, C.white, opacity);
  }
  function sideArrow(key, size, opacity) {
    const ic = icon(key, size, C.white, opacity);
    return ic;
  }

  function addSideL1(parent, label, iconKey, y, {active=false, expanded=false}={}) {
    const op = active ? 1 : 0.5;
    const row = frame(`L1·${label}`, 208, 48, C.sidebarBg);
    row.y = y;
    parent.appendChild(row);
    const ic = sideIcon(iconKey, 16, op);
    if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    const lbl = text(label, C.white, 14, {lh:22, a:op, x:52, y:13});
    row.appendChild(lbl);
    const arrowKey = expanded ? 'PutAway-Arrow' : 'DropDown-Arrow';
    const arr = sideArrow(arrowKey, 12, op);
    if (arr) { arr.x = 186; arr.y = 18; row.appendChild(arr); }
    return row;
  }
  function addSideL2(parent, label, y, {active=false, expanded=false}={}) {
    const op = active ? 1 : 0.5;
    const row = frame(`L2·${label}`, 208, 48, C.sidebarSub);
    row.y = y;
    parent.appendChild(row);
    const lbl = text(label, C.white, 14, {lh:22, a:op, x:40, y:13});
    row.appendChild(lbl);
    const arrowKey = expanded ? 'PutAway-Arrow' : 'DropDown-Arrow';
    const arr = sideArrow(arrowKey, 12, op);
    if (arr) { arr.x = 186; arr.y = 18; row.appendChild(arr); }
    return row;
  }
  function addSideL3(parent, label, y, {selected=false}={}) {
    const op = selected ? 1 : 0.5;
    const row = frame(`L3·${label}`, 208, 48, C.sidebarSub);
    row.y = y;
    parent.appendChild(row);
    const lbl = text(label, C.white, 14, {lh:22, a:op, x:56, y:13});
    row.appendChild(lbl);
    return row;
  }
  function addSideDivider(parent, y) {
    const d = rect(160, 1, C.white, {a:0.08, x:24, y});
    parent.appendChild(d);
  }

  // 菜单结构
  let sy = 64;
  addSideL1(sidebar, '首页',     'home',        sy); sy+=48;
  addSideL1(sidebar, '数据看板', 'bar-chart-2', sy); sy+=48;
  addSideDivider(sidebar, sy); sy+=1;
  addSideL1(sidebar, '房产管理', 'layers',      sy); sy+=48;
  addSideL1(sidebar, '合同管理', 'file-text',   sy, {active:true, expanded:true}); sy+=48;
  addSideL2(sidebar, '合同列表', sy, {active:true, expanded:false}); sy+=48;
  addSideL2(sidebar, '合同审核', sy); sy+=48;
  addSideL1(sidebar, '工单管理', 'tool',        sy); sy+=48;
  addSideL1(sidebar, '报表中心', 'pie-chart',   sy); sy+=48;
  addSideDivider(sidebar, sy); sy+=1;
  addSideL1(sidebar, '系统设置', 'settings',    sy); sy+=48;

  // ═══════════════════════════════════════════════════════
  // 2. 主区域  1232 × 900
  // ═══════════════════════════════════════════════════════
  const main = frame('主区域', 1232, 900, C.pageBg, {clip:true});
  main.x = 208;
  page.appendChild(main);

  // ── 顶部导航栏  1232 × 56（对应模板"页头"）─────────────────
  {
    const nav = frame('顶部导航', 1232, 56, C.white, {
      stroke: C.border, strokeA: 0.08, strokeW: 1,
    });
    main.appendChild(nav);

    // 左侧：汉堡图标 + 系统名
    const icMenu = icon('menu', 20, C.textBody, 0.45);
    if (icMenu) { icMenu.x = 16; icMenu.y = 18; nav.appendChild(icMenu); }
    nav.appendChild(text('合同管理系统', C.textBody, 14, {lh:22, a:0.65, x:44, y:17}));

    // 右侧：搜索框 + bell + 用户头像
    const SEARCH_W = 160;
    const searchBox = frame('search-input', SEARCH_W, 32, C.white, {
      r:4, x:1232-24-28-12-20-8-SEARCH_W, y:12,
      stroke:C.border, strokeA:0.12, strokeW:1,
    });
    nav.appendChild(searchBox);
    const icS = icon('search', 14, C.textBody, 0.35);
    if (icS) { icS.x = 10; icS.y = 9; searchBox.appendChild(icS); }
    searchBox.appendChild(text('搜索', C.textBody, 14, {lh:22, a:0.25, x:28, y:5}));

    const icBell = icon('bell', 20, C.textBody, 0.45);
    if (icBell) { icBell.x = 1232-24-28-12-20; icBell.y = 18; nav.appendChild(icBell); }

    nav.appendChild(rect(28, 28, C.primary, {r:14, x:1232-24-28, y:14}));
    const uT = text('管', C.white, 12, {lh:28, style:'Medium'});
    uT.x = 1232-24-28+8; uT.y = 14;
    nav.appendChild(uT);
  }

  // ── 页面标题栏  1232 × 56（标题 + 面包屑同侧左对齐）
  {
    const titleBar = frame('标题栏', 1232, 56, C.white, {
      stroke: C.border, strokeA: 0.06, strokeW: 1,
    });
    titleBar.y = 56;
    main.appendChild(titleBar);

    // 标题
    const titleNode = text('合同列表', C.textBody, 18, {lh:24, style:'Medium', x:24, y:16});
    titleBar.appendChild(titleNode);

    // 面包屑：紧跟标题右侧，左对齐，垂直居中（12px lh=18, y=(56-18)/2=19）
    const crumbs = [
      {label:'首页', link:true},
      {label:'合同管理', link:true},
      {label:'合同列表', link:false},
    ];
    const crumbNodes = [], sepNodes = [];
    crumbs.forEach((c, i) => {
      crumbNodes.push(text(c.label, C.textBody, 12, {lh:18, a: c.link ? 0.65 : 0.45}));
      if (i < crumbs.length - 1) sepNodes.push(text(' › ', C.textBody, 12, {lh:18, a:0.25}));
    });
    let bx = 24 + titleNode.width + 16; // 标题右侧 16px 间距
    const bY = 19;
    crumbs.forEach((c, i) => {
      crumbNodes[i].x = bx; crumbNodes[i].y = bY;
      titleBar.appendChild(crumbNodes[i]);
      bx += crumbNodes[i].width;
      if (i < crumbs.length - 1) {
        sepNodes[i].x = bx; sepNodes[i].y = bY;
        titleBar.appendChild(sepNodes[i]);
        bx += sepNodes[i].width;
      }
    });
  }

  // ── 内容区（模板"带冻结表格"位置）  1232 × 788，y=112 ──────
  const HEADER_H = 112;
  const content = frame('内容区', 1232, 900 - HEADER_H, C.pageBg);
  content.y = HEADER_H;
  main.appendChild(content);

  const OUTER_PAD = 16; // 内容区到卡片外边距
  const PAD = 24;       // 卡片内部左右内边距
  const CARD_W = 1232 - OUTER_PAD * 2;
  const CARD_H = (900 - HEADER_H) - OUTER_PAD * 2;

  // 主内容卡片（筛选 + 表格同一张卡）
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, {r:8, x:OUTER_PAD, y:OUTER_PAD});
  content.appendChild(mainCard);

  // ─ 筛选区（3列网格布局，超过3个字段自动换行）────────────────
  const FCOL_W = Math.floor((CARD_W - PAD * 2 - 16 * 2) / 3); // ≈368px/列
  const FCOL_GAP = 16;
  function fColX(col) { return PAD + col * (FCOL_W + FCOL_GAP); }

  function filterFieldAt(label, col, rowY) {
    const lbl = text(label, C.textBody, 14, {lh:22, a:0.65, x:fColX(col), y:rowY+5});
    mainCard.appendChild(lbl);
    const inputX = fColX(col) + lbl.width + 8;
    const inputW = FCOL_W - lbl.width - 8;
    const box = frame(`input-${label}`, inputW, 32, C.white, {
      r:4, x:inputX, y:rowY, stroke:C.border, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(box);
    box.appendChild(text('请输入', C.textPH, 14, {lh:22, a:0.25, x:12, y:5}));
  }
  function filterSelectAt(label, col, rowY) {
    const lbl = text(label, C.textBody, 14, {lh:22, a:0.65, x:fColX(col), y:rowY+5});
    mainCard.appendChild(lbl);
    const selX = fColX(col) + lbl.width + 8;
    const selW = FCOL_W - lbl.width - 8;
    const sel = frame(`select-${label}`, selW, 32, C.white, {
      r:4, x:selX, y:rowY, stroke:C.border, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(sel);
    sel.appendChild(text('请选择', C.textPH, 14, {lh:22, a:0.25, x:12, y:5}));
    const arr = icon('DropDown-Arrow', 12, C.textPH, 0.35);
    if (arr) { arr.x = selW-20; arr.y = 10; sel.appendChild(arr); }
  }

  // 第一行：合同编号 | 合同名称 | 合同状态
  const FROW0_Y = 20;
  filterFieldAt('合同编号', 0, FROW0_Y);
  filterFieldAt('合同名称', 1, FROW0_Y);
  filterSelectAt('合同状态', 2, FROW0_Y);

  // 第二行：签订日期（列0） + 查询/重置（列1）
  const FROW1_Y = FROW0_Y + 32 + 16; // = 68
  {
    const lbl = text('签订日期', C.textBody, 14, {lh:22, a:0.65, x:fColX(0), y:FROW1_Y+5});
    mainCard.appendChild(lbl);
    const dpX = fColX(0) + lbl.width + 8;
    const dpW = FCOL_W - lbl.width - 8;
    const dp = frame('daterange', dpW, 32, C.white, {
      r:4, x:dpX, y:FROW1_Y, stroke:C.border, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(dp);
    dp.appendChild(text('开始日期', C.textPH, 14, {lh:22, a:0.25, x:10, y:5}));
    dp.appendChild(text('~', C.textPH, 14, {lh:22, a:0.3, x:Math.round(dpW/2)-6, y:5}));
    dp.appendChild(text('结束日期', C.textPH, 14, {lh:22, a:0.25, x:Math.round(dpW/2)+6, y:5}));
  }
  // 查询/重置：右对齐（从右向左：重置→查询）
  {
    let bx = CARD_W - PAD;
    // 重置（最右）
    bx -= 56;
    const rBtn = frame('btn-重置', 56, 32, C.white,
      {r:4, x:bx, y:FROW1_Y, stroke:C.border, strokeA:0.12, strokeW:1});
    mainCard.appendChild(rBtn);
    rBtn.appendChild(text('重置', C.textBody, 14, {lh:22, a:0.5, x:12, y:5}));
    // 查询
    bx -= 8 + 72;
    const qBtn = frame('btn-查询', 72, 32, C.white,
      {r:4, x:bx, y:FROW1_Y, stroke:C.border, strokeA:0.15, strokeW:1});
    mainCard.appendChild(qBtn);
    const icS = icon('search', 14, C.textBody, 0.55);
    if (icS) { icS.x=10; icS.y=9; qBtn.appendChild(icS); }
    qBtn.appendChild(text('查询', C.textBody, 14, {lh:22, a:0.8, x:28, y:5}));
  }

  const FILTER_END_Y = FROW1_Y + 32; // = 100

  // ─ 操作按钮行（独立一行，右对齐，顺序：批量删除→批量导出→新建合同）
  const ACTION_Y = FILTER_END_Y + 16; // = 116
  {
    let bx = CARD_W - PAD; // 从右向左排列

    // 新建合同（最右，primary）
    const NEW_W = 100;
    bx -= NEW_W;
    const btnNew = frame('btn-新建合同', NEW_W, 32, C.primary, {r:4, x:bx, y:ACTION_Y});
    mainCard.appendChild(btnNew);
    const icPlus = icon('plus', 14, C.white, 1);
    if (icPlus) { icPlus.x = 10; icPlus.y = 9; btnNew.appendChild(icPlus); }
    btnNew.appendChild(text('新建合同', C.white, 14, {lh:22, x:28, y:5}));

    // 批量导出（中，secondary）
    const EXP_W = 90;
    bx -= 8 + EXP_W;
    const btnExp = frame('btn-批量导出', EXP_W, 32, C.white, {
      r:4, x:bx, y:ACTION_Y, stroke:C.border, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(btnExp);
    const icDl = icon('download', 14, C.textBody, 0.55);
    if (icDl) { icDl.x = 8; icDl.y = 9; btnExp.appendChild(icDl); }
    btnExp.appendChild(text('批量导出', C.textBody, 14, {lh:22, a:0.7, x:26, y:5}));

    // 批量删除（最左，danger）
    const DEL_W = 90;
    bx -= 8 + DEL_W;
    const btnDel = frame('btn-批量删除', DEL_W, 32, C.white, {
      r:4, x:bx, y:ACTION_Y, stroke:C.danger, strokeA:0.4, strokeW:1,
    });
    mainCard.appendChild(btnDel);
    const icTr = icon('trash-2', 14, C.danger, 0.75);
    if (icTr) { icTr.x = 8; icTr.y = 9; btnDel.appendChild(icTr); }
    btnDel.appendChild(text('批量删除', C.danger, 14, {lh:22, a:0.8, x:26, y:5}));
  }

  // 操作区与表格之间分割线
  const DIVIDER_Y = ACTION_Y + 32 + 16; // = 164
  mainCard.appendChild(rect(CARD_W, 1, C.border, {a:0.08, x:0, y:DIVIDER_Y}));

  // ─ 表格 ────────────────────────────────────────────────────
  const TBL_Y = DIVIDER_Y + 12; // = 177
  const TBL_W = CARD_W - PAD * 2;
  const COL_H = 48;
  // 列宽合计必须 = TBL_W = 1152
  // 48+160+328+120+120+140+100+136 = 1152 ✓
  const COLS = [
    {label:'', w:48},
    {label:'合同编号', w:160},
    {label:'合同名称', w:328},
    {label:'合同类型', w:120},
    {label:'签订日期', w:120},
    {label:'合同金额（元）', w:140},
    {label:'合同状态', w:100},
    {label:'操作', w:136},
  ];

  // 表头（只有底部 1px 分割线，无四周外框）
  {
    const thead = frame('表头', TBL_W, COL_H, hex('#F5F5F5'), {x:PAD, y:TBL_Y});
    mainCard.appendChild(thead);
    thead.appendChild(rect(TBL_W, 1, C.border, {a:0.06, x:0, y:COL_H-1}));
    let cx = 0;
    COLS.forEach((col, i) => {
      const cell = frame(`th-${col.label||'cb'}`, col.w, COL_H, null);
      cell.fills = []; cell.x = cx; cell.y = 0;
      thead.appendChild(cell);
      if (i === 0) {
        cell.appendChild(rect(14, 14, C.white, {r:2, x:17, y:17, stroke:C.border, strokeA:0.2, strokeW:1}));
      } else {
        const t = text(col.label, C.textBody, 14, {lh:22, a:0.85, style:'Medium'});
        t.x = i === COLS.length-1 ? Math.round((col.w - t.width)/2) : 16;
        t.y = 13;
        cell.appendChild(t);
      }
      // 无竖向列分隔线（BeP 规范：仅水平行分隔线）
      cx += col.w;
    });
  }

  // 计算可填充行数：(CARD_H - TBL_Y - COL_H表头 - 16间距 - 32分页 - PAD底部) / COL_H
  // (756 - 177 - 48 - 16 - 32 - 24) / 48 = 459/48 ≈ 9 行
  const rows = [
    { no:'HT-2024-001', name:'碧桂园智慧社区运维服务合同', type:'服务合同', date:'2024-01-15', amount:'1,280,000.00', status:'已生效',  statusType:'active' },
    { no:'HT-2024-002', name:'物业设备维保合同',           type:'维保合同', date:'2024-02-01', amount:'360,000.00',   status:'审核中',  statusType:'reviewing' },
    { no:'HT-2024-003', name:'安保服务外包合同',           type:'服务合同', date:'2024-02-10', amount:'480,000.00',   status:'草稿',    statusType:'draft' },
    { no:'HT-2024-004', name:'绿化养护服务合同',           type:'服务合同', date:'2024-03-01', amount:'240,000.00',   status:'已生效',  statusType:'active' },
    { no:'HT-2024-005', name:'智能停车系统采购合同',       type:'采购合同', date:'2024-03-15', amount:'860,000.00',   status:'已终止',  statusType:'terminated' },
    { no:'HT-2024-006', name:'公共区域清洁服务合同',       type:'服务合同', date:'2024-04-01', amount:'180,000.00',   status:'已生效',  statusType:'active' },
    { no:'HT-2024-007', name:'消防设施检测维护合同',       type:'维保合同', date:'2024-04-10', amount:'96,000.00',    status:'审核中',  statusType:'reviewing' },
    { no:'HT-2024-008', name:'电梯年度保养服务合同',       type:'维保合同', date:'2024-04-15', amount:'320,000.00',   status:'草稿',    statusType:'draft' },
    { no:'HT-2024-009', name:'社区文化活动策划合同',       type:'服务合同', date:'2024-05-01', amount:'60,000.00',    status:'已生效',  statusType:'active' },
  ];
  const STATUS_STYLE = {
    active:     { bg:C.tagGreen,  txt:C.tagGreenTxt  },
    reviewing:  { bg:C.tagOrange, txt:C.tagOrangeTxt },
    draft:      { bg:C.tagGray,   txt:C.tagGrayTxt   },
    terminated: { bg:C.tagRed,    txt:C.tagRedTxt    },
  };

  rows.forEach((row, ri) => {
    const tr = frame(`tr-${ri}`, TBL_W, COL_H, C.white, {
      x:PAD, y: TBL_Y + COL_H * (ri + 1),
    });
    mainCard.appendChild(tr);
    tr.appendChild(rect(TBL_W, 1, C.border, {a:0.06, x:0, y:COL_H-1}));

    const vals = ['', row.no, row.name, row.type, row.date, row.amount, row.status, ''];
    let cx = 0;
    COLS.forEach((col, ci) => {
      const cell = frame(`td-${ri}-${ci}`, col.w, COL_H, null);
      cell.fills = []; cell.x = cx; cell.y = 0;
      tr.appendChild(cell);

      if (ci === 0) {
        cell.appendChild(rect(14, 14, C.white, {r:2, x:17, y:17, stroke:C.border, strokeA:0.2, strokeW:1}));
      } else if (ci === 6) {
        const st = STATUS_STYLE[row.statusType] || STATUS_STYLE.draft;
        const tag = frame('tag', 68, 22, st.bg, {r:4, y:13});
        cell.appendChild(tag);
        const tagT = text(row.status, st.txt, 12, {lh:20, x:8, y:1});
        tag.appendChild(tagT);
        tag.resize(tagT.width + 16, 22);
        tag.x = 8;
      } else if (ci === 7) {
        // 操作列：text 按钮直接并排，间距 8px，无 " | " 分隔符
        const ops = [{label:'查看',color:C.primary},{label:'编辑',color:C.primary},{label:'删除',color:C.danger}];
        let ox = 8;
        ops.forEach(op => {
          const ot = text(op.label, op.color, 14, {lh:22, x:ox, y:13});
          cell.appendChild(ot);
          ox += ot.width + 8;
        });
      } else if (ci === 5) {
        const tv = text(vals[ci], C.textBody, 14, {lh:22, a:0.85});
        cell.appendChild(tv);
        tv.x = col.w - tv.width - 16; tv.y = 13;
      } else {
        cell.appendChild(text(vals[ci], C.textBody, 14, {lh:22, a:0.85, x:16, y:13}));
      }
      cx += col.w;
    });
  });

  // 分页栏
  {
    const PAGER_Y = TBL_Y + COL_H * (rows.length + 1) + 16;
    const totalT = text('共 128 条', C.textBody, 14, {lh:22, a:0.45, x:PAD, y:PAGER_Y});
    mainCard.appendChild(totalT);

    const pages = ['1','2','3','...','13'];
    let pgx = CARD_W - PAD - (pages.length * 32 + (pages.length-1)*4) - 8 - 80;
    pages.forEach(p => {
      const isActive = p === '1';
      const pgBtn = frame(`pg-${p}`, 32, 32, isActive ? C.primary : C.white, {
        r:4, x:pgx, y:PAGER_Y-4,
        stroke: isActive ? null : C.border, strokeA:0.15, strokeW:1,
      });
      mainCard.appendChild(pgBtn);
      const pt = text(p, isActive ? C.white : C.textBody, 14, {lh:22, a: isActive ? 1 : 0.65});
      pt.x = Math.round((32 - pt.width) / 2); pt.y = 5;
      pgBtn.appendChild(pt);
      pgx += 36;
    });

    const perPage = frame('perpage', 80, 32, C.white, {
      r:4, x:CARD_W-PAD-80, y:PAGER_Y-4,
      stroke:C.border, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(perPage);
    perPage.appendChild(text('20条/页', C.textBody, 14, {lh:22, a:0.65, x:12, y:5}));
    const ppArr = icon('DropDown-Arrow', 12, C.textBody, 0.35);
    if (ppArr) { ppArr.x = 56; ppArr.y = 10; perPage.appendChild(ppArr); }
  }

  figma.currentPage.selection = [page];
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin('✅ 合同列表页面已生成');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
