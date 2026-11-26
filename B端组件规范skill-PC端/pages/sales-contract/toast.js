// ── T-01 + T-02 + T-03 销售管理·合同管理·全局提示 Message ──────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-28  rev.2
// 规范来源：Figma node 741:18424（实测，非推断）
//   高度 40px · 圆角 2px · 浅色背景 + 1px 边框 · 16px Fill 图标 · 深色文字
// rev.2：面包屑分隔符改为 Line/Right-Arrow 12×12 #666666（BeP 实测规范）

// BeP Fill 图标（16×16，currentColor，来自 BeP icon library Fill 系列）
const FILL_ICONS = {
  'Fill/Tips':    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 3.5a.75.75 0 110 1.5.75.75 0 010-1.5zM7.25 7a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0V7z" fill="currentColor"/></svg>`,
  'Fill/Success': `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm3.53 5.53a.75.75 0 00-1.06-1.06L7 8.94 5.53 7.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" fill="currentColor"/></svg>`,
  'Fill/Fail':    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zM5.47 5.47a.75.75 0 011.06 0L8 6.94l1.47-1.47a.75.75 0 111.06 1.06L9.06 8l1.47 1.47a.75.75 0 11-1.06 1.06L8 9.06l-1.47 1.47a.75.75 0 01-1.06-1.06L6.94 8 5.47 6.53a.75.75 0 010-1.06z" fill="currentColor"/></svg>`,
};

// 侧边栏 & 面包屑线框图标（24×24，用 lineIcon() 缩放至目标尺寸）
const LINE_ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  // BeP Line/Right-Arrow：面包屑分隔符，实测 12×12，#666666
  "Right-Arrow":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  function hex(h) {
    var n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a) {
    if (a === undefined) { a = 1; }
    return [{ type:'SOLID', color:color, opacity:a }];
  }
  function rect(w, h, color, opts) {
    if (opts === undefined) { opts = {}; }
    var r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a || 1) : [];
    if (opts.r  !== undefined) r.cornerRadius = opts.r;
    if (opts.x  !== undefined) r.x = opts.x;
    if (opts.y  !== undefined) r.y = opts.y;
    return r;
  }
  function text(chars, color, size, opts) {
    if (opts === undefined) { opts = {}; }
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:opts.style || 'Regular' };
    t.fontSize = size;
    t.lineHeight = opts.lh ? { value:opts.lh, unit:'PIXELS' } : { unit:'AUTO' };
    t.characters = chars;
    t.fills = solid(color, opts.a !== undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function lineIcon(key, size, color, opacity) {
    if (opacity === undefined) { opacity = 1; }
    var svg = LINE_ICONS[key];
    if (!svg) { return null; }
    var node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(function(n) { return n.fills  && n.fills.length  > 0 && n.fills[0].type  === 'SOLID'; }).forEach(function(n) { n.fills   = solid(color, 1); });
    node.findAll(function(n) { return n.strokes && n.strokes.length > 0; }).forEach(function(n) { n.strokes = solid(color, 1); });
    return node;
  }

  // ── 颜色 ──────────────────────────────────────────────────────────────────
  var C = {
    pageBg:    hex('#F0F2F5'),
    white:     hex('#FFFFFF'),
    black:     hex('#000000'),
    primary:   hex('#006D9B'),
    sidebarBg: hex('#002138'),
    sidebarSub:hex('#00182A'),
    // Message 浅色背景（Figma 实测）
    infoBg:    hex('#e6f0f5'), infoBorder:    hex('#cce2eb'), infoIcon:    hex('#006d9b'),
    successBg: hex('#ebf8ec'), successBorder: hex('#d8f1d8'), successIcon: hex('#3bbb3e'),
    errorBg:   hex('#ffefee'), errorBorder:   hex('#ffdfdd'), errorIcon:   hex('#fe5e54'),
  };

  // ── BeP Message 规格（来自 Figma node 741:18424） ─────────────────────────
  var MSG_H     = 40;  // 固定高度
  var MSG_R     = 2;   // 圆角 2px
  var ICON_X    = 16;  // 图标左边距
  var ICON_SZ   = 16;  // 图标尺寸
  var ICON_Y    = 12;  // (40-16)/2 = 12，垂直居中
  var TXT_X     = 40;  // 16(icon_x) + 16(icon) + 8(gap)
  var TXT_Y     = 9;   // (40-22)/2 = 9，垂直居中
  var TXT_PAD_R = 16;  // 右侧内边距

  // type: 'info' | 'success' | 'error'
  function makeMessage(content, type) {
    var bgColor     = type === 'success' ? C.successBg  : type === 'error' ? C.errorBg  : C.infoBg;
    var borderColor = type === 'success' ? C.successBorder : type === 'error' ? C.errorBorder : C.infoBorder;
    var iconColor   = type === 'success' ? C.successIcon : type === 'error' ? C.errorIcon : C.infoIcon;
    var iconKey     = type === 'success' ? 'Fill/Success' : type === 'error' ? 'Fill/Fail' : 'Fill/Tips';

    // 1. 量文字宽度（自动宽）
    var txtNode = figma.createText();
    txtNode.fontName = { family:'PingFang SC', style:'Regular' };
    txtNode.fontSize = 14;
    txtNode.lineHeight = { value:22, unit:'PIXELS' };
    txtNode.characters = content;
    txtNode.fills = solid(C.black, 0.65);
    txtNode.textAutoResize = 'WIDTH_AND_HEIGHT';
    var MSG_W = TXT_X + txtNode.width + TXT_PAD_R;

    // 2. 容器
    var msg = figma.createFrame();
    msg.name = 'Message/' + type;
    msg.resize(MSG_W, MSG_H);
    msg.fills = solid(bgColor);
    msg.strokes = [{ type:'SOLID', color:borderColor, opacity:1 }];
    msg.strokeWeight = 1;
    msg.strokeAlign = 'INSIDE';
    msg.cornerRadius = MSG_R;
    msg.clipsContent = false;

    // 3. Fill 图标（16×16，type 对应颜色）
    var ic = figma.createNodeFromSvg(FILL_ICONS[iconKey]);
    ic.name = iconKey;
    ic.resize(ICON_SZ, ICON_SZ);
    ic.findAll(function(n) {
      return n.fills && n.fills.length > 0;
    }).forEach(function(n) {
      n.fills = solid(iconColor, 1);
    });
    ic.x = ICON_X;
    ic.y = ICON_Y;
    msg.appendChild(ic);

    // 4. 文字
    txtNode.x = TXT_X;
    txtNode.y = TXT_Y;
    msg.appendChild(txtNode);

    return msg;
  }

  // ── 布局常量 ──────────────────────────────────────────────────────────────
  var CANVAS_W = 1440, CANVAS_H = 420;
  var SIDE_W   = 208;
  var HDR_H    = 56;

  // ── 侧边栏 ────────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    var area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64);
    area.fills = solid(C.sidebarBg); area.clipsContent = false;
    area.appendChild(rect(32, 32, C.primary, { r:6, x:24, y:16 }));
    area.appendChild(text('M', C.white, 14, { style:'Medium', lh:20, x:33, y:22 }));
    area.appendChild(text('Mall 管理后台', C.white, 16, { style:'Medium', lh:22, x:64, y:12 }));
    area.appendChild(text('MALL MANAGEMENT', C.white, 7, { lh:10, a:0.6, x:64, y:38 }));
    return area;
  }
  function makeSidebarDivider() {
    var w = figma.createFrame();
    w.name = 'SidebarDivider'; w.resize(208, 1); w.fills = []; w.clipsContent = false;
    w.appendChild(rect(160, 1, C.white, { a:0.08, x:24, y:0 }));
    return w;
  }
  function makeSidebarItem(label, level, state, iconKey) {
    var bgColor = level === 2 ? C.sidebarSub : C.sidebarBg;
    var isExpanded = state === 'expanded';
    var op = (state === 'active' || isExpanded) ? 1 : 0.5;
    var row = figma.createFrame();
    row.name = 'L' + level + '·' + label;
    row.resize(208, 48); row.fills = solid(bgColor); row.opacity = op; row.clipsContent = false;
    if (level === 1 && iconKey) {
      var ic = lineIcon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }
    var textX = level === 1 ? 52 : 40;
    row.appendChild(text(label, C.white, 14, { lh:22, x:textX, y:13 }));
    if (level === 1) {
      var arr = lineIcon(isExpanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, 1);
      if (arr) { arr.x = 186; arr.y = 18; row.appendChild(arr); }
    }
    return row;
  }
  function makeSidebar(height) {
    var s = figma.createFrame(); s.name = '侧边栏';
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
  function makeHeader() {
    var hdr = figma.createFrame();
    hdr.name = 'Header'; hdr.resize(CANVAS_W - SIDE_W, HDR_H);
    hdr.fills = solid(C.white); hdr.clipsContent = false;
    hdr.appendChild(rect(CANVAS_W - SIDE_W, 1, C.black, { a:0.06, x:0, y:HDR_H - 1 }));

    // 面包屑：BeP 实测规范 —— 14px Regular rgba(0,0,0,0.65)，间距 [文字]—5px—[箭头 12×12]—6px—[文字]
    hdr.appendChild(text('销售管理', C.black, 14, { lh:22, a:0.65, x:24, y:17 }));
    // 分隔符：Line/Right-Arrow 12×12，#666666，y = (56-12)/2 = 22
    //   "销售管理" 4字 × ~14px = 56px → 结束 x≈80，gap 5px → 箭头 x=85
    var sep = lineIcon('Right-Arrow', 12, hex('#666666'), 1);
    if (sep) { sep.x = 85; sep.y = 22; hdr.appendChild(sep); }
    // 箭头宽 12px + gap 6px → 当前页 x = 85+12+6 = 103
    hdr.appendChild(text('合同管理', C.primary, 14, { lh:22, x:103, y:17 }));
    return hdr;
  }

  // ── 页面组装 ──────────────────────────────────────────────────────────────
  var root = figma.createFrame();
  root.name = 'T-01 + T-02 + T-03  全局提示 Message';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = false;
  figma.currentPage.appendChild(root);

  var sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  root.appendChild(rect(CANVAS_W - SIDE_W, CANVAS_H, C.white, { x:SIDE_W, y:0 }));
  root.appendChild(rect(CANVAS_W - SIDE_W, CANVAS_H - HDR_H, C.pageBg, { x:SIDE_W, y:HDR_H }));

  var hdr = makeHeader();
  hdr.x = SIDE_W; hdr.y = 0;
  root.appendChild(hdr);

  // ── 三条 Message 顶部居中叠放 ─────────────────────────────────────────────
  var contentCX = SIDE_W + Math.round((CANVAS_W - SIDE_W) / 2);
  var MSG_GAP = 8;
  var curY = HDR_H + 16;

  // T-01 成功
  var lbl01 = text('T-01  成功提示', C.primary, 12, { lh:20, a:0.65 });
  var t01 = makeMessage('合同 HT20260301001 已成功提交审批', 'success');
  lbl01.x = contentCX - Math.round(t01.width / 2); lbl01.y = curY;
  root.appendChild(lbl01);
  curY += 20 + 4;
  t01.x = contentCX - Math.round(t01.width / 2); t01.y = curY;
  root.appendChild(t01);
  curY += MSG_H + MSG_GAP + 24;

  // T-02 失败
  var lbl02 = text('T-02  失败提示', C.primary, 12, { lh:20, a:0.65 });
  var t02 = makeMessage('操作失败，网络异常，请稍后重试', 'error');
  lbl02.x = contentCX - Math.round(t02.width / 2); lbl02.y = curY;
  root.appendChild(lbl02);
  curY += 20 + 4;
  t02.x = contentCX - Math.round(t02.width / 2); t02.y = curY;
  root.appendChild(t02);
  curY += MSG_H + MSG_GAP + 24;

  // T-03 消息提示
  var lbl03 = text('T-03  消息提示', C.primary, 12, { lh:20, a:0.65 });
  var t03 = makeMessage('合同审批流程已启动，请等待审核', 'info');
  lbl03.x = contentCX - Math.round(t03.width / 2); lbl03.y = curY;
  root.appendChild(lbl03);
  curY += 20 + 4;
  t03.x = contentCX - Math.round(t03.width / 2); t03.y = curY;
  root.appendChild(t03);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
