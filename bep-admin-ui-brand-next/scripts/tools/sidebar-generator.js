// ======================================================
// BeP Admin Kit — 完整侧边栏生成器
// 所有图标均从 icons.md 调取，独立运行无需外部依赖
// 规范：BeP 页面中涉及的全部图标必须来自 icons.md
// ======================================================

// ── 所有用到的图标（直接内联自 icons.md）─────────────
const ICONS = {
  // 一级菜单图标
  "home": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "bar-chart-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "layers": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923V1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "file-text": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M10.0068 8.82849H9.00684H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "tool": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6982 6.30265C14.3171 6.69139 14.3171 7.31353 14.6982 7.70227L16.2977 9.30184C16.6865 9.68288 17.3086 9.68288 17.6974 9.30184L21.4663 5.53286C22.4957 7.80751 22.0084 10.4819 20.2429 12.2473C18.4775 14.0128 15.8031 14.5 13.5285 13.4707L6.62034 20.3788C5.79214 21.2071 4.44936 21.2071 3.62115 20.3788C2.79295 19.5506 2.79295 18.2079 3.62115 17.3797L10.5293 10.4715C9.49996 8.19687 9.98724 5.5225 11.7527 3.75706C13.5181 1.99162 16.1925 1.50434 18.4671 2.53367L14.7082 6.29265L14.6982 6.30265Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "pie-chart": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21.2104 15.89C19.4603 20.0289 15.1643 22.4921 10.7082 21.9116C6.25216 21.331 2.73058 17.8495 2.09923 13.4003C1.46787 8.95119 3.88181 4.62732 8.00044 2.83002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.0005 12C22.0005 9.34784 20.9469 6.8043 19.0716 4.92893C17.1962 3.05357 14.6527 2 12.0005 2V12H22.0005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
  "settings": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,

  // BeP 折叠展开箭头（来自 icons.md BeP 自定义图标）
  // 收起状态（菜单已折叠）→ 显示向下箭头，提示可展开
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/> </svg>`,
  // 展开状态（菜单已展开）→ 显示向上箭头，提示可收起
  "PutAway-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/> </svg>`,
};

// ── 主函数 ─────────────────────────────────────────────
async function buildSidebar() {

  const W = 208, LOGO_H = 64, ROW_H = 48;

  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
  }
  const BG     = hex('#002138');
  const BG_SUB = hex('#00182a');
  const WHITE  = { r: 1, g: 1, b: 1 };
  const BLUE   = hex('#006D9B');

  function solid(color, opacity = 1) {
    return [{ type: 'SOLID', color, opacity }];
  }

  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang TC', style: 'Regular' }),
    figma.loadFontAsync({ family: 'PingFang TC', style: 'Medium'  }),
  ]);

  // ── 工具函数 ──────────────────────────────────────────

  function makeText(chars, { x=0, y=0, w=160, h=22, size=14, lineH=22, opacity=1, style='Regular' } = {}) {
    const t = figma.createText();
    t.fontName   = { family: 'PingFang TC', style };
    t.fontSize   = size;
    t.lineHeight = { value: lineH, unit: 'PIXELS' };
    t.characters = chars;
    t.fills      = solid(WHITE, opacity);
    t.resize(w, h);
    t.x = x; t.y = y;
    t.textAutoResize = 'HEIGHT';
    return t;
  }

  function makeRect(w, h, color, opts = {}) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color) : [];
    if (opts.corner !== undefined) r.cornerRadius = opts.corner;
    if (opts.x      !== undefined) r.x = opts.x;
    if (opts.y      !== undefined) r.y = opts.y;
    return r;
  }

  function makeRow(name, rowW, rowH, bg, offsetY) {
    const f = figma.createFrame();
    f.name  = name;
    f.resize(rowW, rowH);
    f.fills = bg ? solid(bg) : [];
    f.clipsContent = false;
    f.x = 0; f.y = offsetY;
    return f;
  }

  // SVG → Figma 节点，统一染白，居中放置
  function placeIcon(parent, key, size, opacity, cx, cy) {
    const svgStr = ICONS[key];
    if (!svgStr) { console.error('Icon not found:', key); return null; }

    const node = figma.createNodeFromSvg(svgStr);
    node.resize(size, size);
    node.opacity = opacity;
    node.x = Math.round(cx - size / 2);
    node.y = Math.round(cy - size / 2);

    // fill 图标（BeP 箭头）：染白
    node.findAll(n => n.fills && n.fills.length > 0 && n.fills[0].type === 'SOLID').forEach(n => {
      n.fills = solid(WHITE, 1);
    });
    // stroke 图标（Feather）：描边染白
    node.findAll(n => n.strokes && n.strokes.length > 0).forEach(n => {
      n.strokes = solid(WHITE, 1);
    });

    parent.appendChild(node);
    return node;
  }

  // ── 主侧边栏 Frame ─────────────────────────────────────
  const sidebar = figma.createFrame();
  sidebar.name         = '完整侧边栏';
  sidebar.resize(W, 768);
  sidebar.fills        = solid(BG);
  sidebar.clipsContent = true;
  figma.currentPage.appendChild(sidebar);
  sidebar.x = 200;
  sidebar.y = 100;

  let curY = 0;

  // ── Logo 区域 ──────────────────────────────────────────
  {
    const row = makeRow('Logo', W, LOGO_H, null, curY);
    curY += LOGO_H;
    sidebar.appendChild(row);

    row.appendChild(makeRect(32, 32, BLUE, { corner: 6, x: 24, y: 16 }));
    row.appendChild(makeText('BeP设计平台',
      { x: 64, y: 14, w: 128, h: 20, size: 16, lineH: 20, style: 'Medium' }));
    row.appendChild(makeText('COUNTRY GARDEN SERVICES',
      { x: 64, y: 37, w: 136, h: 10, size: 7, lineH: 10, opacity: 0.6 }));
  }

  // ── 菜单行函数 ─────────────────────────────────────────

  // 一级菜单：左侧 16px 图标 + 标签 + 右侧折叠箭头
  // active/expanded 均通过透明度区分，不加竖线
  function addL1(label, iconKey, { active = false, expanded = false } = {}) {
    const op  = active ? 1 : 0.5;
    const row = makeRow(`L1·${label}`, W, ROW_H, BG, curY);
    curY += ROW_H;
    sidebar.appendChild(row);

    // 菜单图标（来自 icons.md Feather）
    placeIcon(row, iconKey, 16, op, 32, ROW_H / 2);

    // 标签文字
    row.appendChild(makeText(label, { x: 52, y: 13, w: 116, opacity: op }));

    // 折叠箭头（BeP 自有 DropDown-Arrow / PutAway-Arrow）
    // 已展开 → PutAway-Arrow（向上）；已折叠 → DropDown-Arrow（向下）
    const arrowKey = expanded ? 'PutAway-Arrow' : 'DropDown-Arrow';
    placeIcon(row, arrowKey, 12, op, 192, ROW_H / 2);
  }

  // 二级菜单：文本 + 折叠箭头，深色背景
  function addL2(label, { active = false, expanded = false } = {}) {
    const op  = active ? 1 : 0.5;
    const row = makeRow(`L2·${label}`, W, ROW_H, BG_SUB, curY);
    curY += ROW_H;
    sidebar.appendChild(row);

    row.appendChild(makeText(label, { x: 40, y: 13, w: 130, opacity: op }));

    const arrowKey = expanded ? 'PutAway-Arrow' : 'DropDown-Arrow';
    placeIcon(row, arrowKey, 12, op, 192, ROW_H / 2);
  }

  // 三级菜单：缩进文本，无箭头，选中/未选中仅通过透明度区分
  function addL3(label, { selected = false } = {}) {
    const op  = selected ? 1 : 0.5;
    const row = makeRow(`L3·${label}`, W, ROW_H, BG_SUB, curY);
    curY += ROW_H;
    sidebar.appendChild(row);

    row.appendChild(makeText(label, { x: 56, y: 13, w: 120, opacity: op }));
  }

  // 细分隔线
  function addDivider() {
    const d = makeRect(W - 48, 1, WHITE, { x: 24, y: curY });
    d.opacity = 0.08;
    sidebar.appendChild(d);
    curY += 1;
  }

  // ── 菜单结构 ───────────────────────────────────────────
  addL1('首页',     'home',        { active: false });
  addL1('数据看板', 'bar-chart-2', { active: false, expanded: false });
  addDivider();
  addL1('房产管理', 'layers',      { active: true,  expanded: true  });
    addL2('房源信息', { active: true,  expanded: true  });
      addL3('房源列表', { selected: true  });
      addL3('房源审核', { selected: false });
      addL3('房源统计', { selected: false });
    addL2('项目管理', { active: false, expanded: false });
  addL1('合同管理', 'file-text',   { active: false, expanded: false });
  addL1('工单管理', 'tool',        { active: false, expanded: false });
  addL1('报表中心', 'pie-chart',   { active: false, expanded: false });
  addDivider();
  addL1('系统设置', 'settings',    { active: false });

  sidebar.resize(W, Math.max(curY, 768));
  figma.currentPage.selection = [sidebar];
  figma.viewport.scrollAndZoomIntoView([sidebar]);
  figma.closePlugin(`✅ 侧边栏已生成（${curY}px）`);
}

buildSidebar().catch(e => figma.closePlugin('❌ ' + e.message));
