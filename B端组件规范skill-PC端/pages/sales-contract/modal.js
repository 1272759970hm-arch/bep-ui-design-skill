// ── M-01 + M-02 销售管理·合同管理·确认弹窗 ──────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-28
// 按 BeP 对话框 POP 规范：彩色圆形图标 + 标题同行，正文缩进对齐，无分隔线
//   M-01 放弃编辑（warning 橙色 !）
//   M-02 终止合同（danger 红色 ×）

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
    warning:   hex('#FA8C16'), // BeP 橙色 warning
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
  const CANVAS_W   = 1440, CANVAS_H = 920;
  const SIDE_W     = 208;

  // BeP 对话框 POP 规范
  const MODAL_W      = 380;   // 弹窗宽度
  const MODAL_R      = 8;     // 圆角
  const MODAL_PAD    = 24;    // 上下左右内边距
  const CIRCLE_D     = 28;    // 图标圆直径
  const CIRCLE_GAP   = 12;    // 圆 → 标题间距
  const TITLE_INDENT = CIRCLE_D + CIRCLE_GAP; // 40px，正文与标题左对齐
  const MSG_W        = MODAL_W - MODAL_PAD * 2 - TITLE_INDENT; // 正文可用宽度
  const TITLE_MSG_GAP = 8;   // 标题 → 正文间距
  const MSG_BTN_GAP  = 20;   // 正文 → 按钮间距

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
      btn.fills = solid(C.danger); btn.strokes = [];
      tFills = solid(C.white);
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

  // ── 带彩色圆形图标的弹窗（BeP POP 对话框风格）──────────────────────────
  // iconType: 'warning' | 'danger' | 'primary'
  // confirmType: 'primary' | 'danger'
  function makeModal(title, message, confirmLabel, confirmType, iconType) {
    // 1. 先建 message 文字节点，自动计算高度
    var msgNode = figma.createText();
    msgNode.fontName = { family:'PingFang SC', style:'Regular' };
    msgNode.fontSize = 14; msgNode.lineHeight = { value:22, unit:'PIXELS' };
    msgNode.resize(MSG_W, 300);
    msgNode.textAutoResize = 'HEIGHT';
    msgNode.characters = message;
    msgNode.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    var msgH = msgNode.height;

    // 2. 计算总高度
    // PAD(top) + CIRCLE_D(title行) + TITLE_MSG_GAP + msgH + MSG_BTN_GAP + btn_h(32) + PAD(bottom)
    var MODAL_H = MODAL_PAD + CIRCLE_D + TITLE_MSG_GAP + msgH + MSG_BTN_GAP + 32 + MODAL_PAD;

    // 3. 建弹窗容器
    var modal = figma.createFrame();
    modal.name = 'Modal/' + title;
    modal.resize(MODAL_W, MODAL_H);
    modal.fills = solid(C.white);
    modal.cornerRadius = MODAL_R;
    modal.clipsContent = false;
    modal.effects = [
      { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
        color:{r:0,g:0,b:0,a:0.12}, offset:{x:0,y:6}, radius:16, spread:0 },
      { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
        color:{r:0,g:0,b:0,a:0.08}, offset:{x:0,y:3}, radius:6,  spread:0 },
    ];

    // 4. 关闭 × 按钮（右上角）
    var closeIc = icon('close', 14, C.black, 0.35);
    if (closeIc) {
      closeIc.x = MODAL_W - MODAL_PAD - 14;
      closeIc.y = MODAL_PAD + Math.round((CIRCLE_D - 14) / 2);
      modal.appendChild(closeIc);
    }

    // 5. 彩色圆形图标
    var circleColor = iconType === 'danger' ? C.danger
                    : iconType === 'warning' ? C.warning
                    : C.primary;
    var circle = figma.createEllipse();
    circle.name = 'IconCircle';
    circle.resize(CIRCLE_D, CIRCLE_D);
    circle.fills = solid(circleColor);
    circle.strokes = [];
    circle.x = MODAL_PAD;
    circle.y = MODAL_PAD;
    modal.appendChild(circle);

    // 圆内文字（! 或 ×）
    var iconChar = iconType === 'danger' ? '×' : '!';
    var iconTxt = figma.createText();
    iconTxt.fontName = { family:'PingFang SC', style:'Semibold' };
    iconTxt.fontSize = 14;
    iconTxt.lineHeight = { value:20, unit:'PIXELS' };
    iconTxt.characters = iconChar;
    iconTxt.fills = solid(C.white);
    iconTxt.textAutoResize = 'WIDTH_AND_HEIGHT';
    // 水平垂直居中于圆内
    iconTxt.x = MODAL_PAD + Math.round((CIRCLE_D - iconTxt.width) / 2);
    iconTxt.y = MODAL_PAD + Math.round((CIRCLE_D - 20) / 2);
    modal.appendChild(iconTxt);

    // 6. 标题（与圆形同行，垂直居中对齐）
    var titleNode = figma.createText();
    titleNode.fontName = { family:'PingFang SC', style:'Medium' };
    titleNode.fontSize = 16; titleNode.lineHeight = { value:24, unit:'PIXELS' };
    titleNode.characters = title;
    titleNode.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    titleNode.textAutoResize = 'WIDTH_AND_HEIGHT';
    titleNode.x = MODAL_PAD + TITLE_INDENT;
    titleNode.y = MODAL_PAD + Math.round((CIRCLE_D - 24) / 2);
    modal.appendChild(titleNode);

    // 7. 正文（与标题左对齐，缩进 TITLE_INDENT）
    msgNode.x = MODAL_PAD + TITLE_INDENT;
    msgNode.y = MODAL_PAD + CIRCLE_D + TITLE_MSG_GAP;
    modal.appendChild(msgNode);

    // 8. 按钮组（右对齐）
    var btns = figma.createFrame();
    btns.name = 'Btns'; btns.fills = []; btns.clipsContent = false;
    btns.layoutMode = 'HORIZONTAL';
    btns.primaryAxisSizingMode = 'AUTO'; btns.counterAxisSizingMode = 'AUTO';
    btns.counterAxisAlignItems = 'CENTER'; btns.itemSpacing = 8;
    btns.appendChild(makeBtn('取 消', 'secondary'));
    btns.appendChild(makeBtn(confirmLabel, confirmType));
    modal.appendChild(btns);
    btns.x = MODAL_W - MODAL_PAD - btns.width;
    btns.y = MODAL_PAD + CIRCLE_D + TITLE_MSG_GAP + msgH + MSG_BTN_GAP;

    return modal;
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

  // ── 页面组装 ──────────────────────────────────────────────────────────────
  var root = figma.createFrame();
  root.name = 'M-01 + M-02 确认弹窗';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = false;
  figma.currentPage.appendChild(root);

  var sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  // 遮罩
  var overlay = rect(CANVAS_W - SIDE_W, CANVAS_H, C.black, { a:0.45, x:SIDE_W, y:0 });
  root.appendChild(overlay);

  // 定位：两弹窗水平居中于内容区
  var MODAL_GAP  = 40;
  var totalW     = MODAL_W * 2 + MODAL_GAP;
  var contentCX  = SIDE_W + Math.round((CANVAS_W - SIDE_W) / 2);
  var startX     = contentCX - Math.round(totalW / 2);
  var modalY     = 280;

  // M-01：放弃编辑（warning 橙色 !，确认按钮 primary）
  var lbl01 = text('M-01  放弃编辑', C.primary, 12, { lh:20, a:0.65 });
  lbl01.x = startX; lbl01.y = modalY - 24;
  root.appendChild(lbl01);

  var m01 = makeModal(
    '放弃编辑',
    '确认放弃本次编辑？已填写的内容将不会被保存。',
    '确  认',
    'primary',
    'warning'
  );
  m01.x = startX; m01.y = modalY;
  root.appendChild(m01);

  // M-02：终止合同（danger 红色 ×，确认按钮 danger）
  var lbl02 = text('M-02  终止合同', C.primary, 12, { lh:20, a:0.65 });
  lbl02.x = startX + MODAL_W + MODAL_GAP; lbl02.y = modalY - 24;
  root.appendChild(lbl02);

  var m02 = makeModal(
    '终止合同',
    '确认终止合同 HT20260301001？终止后将无法继续创建订单，且合同状态不可恢复。',
    '终止合同',
    'danger',
    'danger'
  );
  m02.x = startX + MODAL_W + MODAL_GAP; m02.y = modalY;
  root.appendChild(m02);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
