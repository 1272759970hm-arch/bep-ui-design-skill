// ── 销售管理·合同管理列表页 v1 ───────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-26
// 来源：销售管理-合同管理-标注版.html
// Canvas 1440 × 864

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "Arrow-Open":     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.9194 6.375C19.7579 6.375 20.2241 7.34493 19.7002 7.99969L12.7809 16.6489C12.3805 17.1493 11.6195 17.1493 11.2191 16.6489L4.29975 7.99969C3.77594 7.34493 4.24212 6.375 5.08062 6.375H18.9194Z" fill="currentColor"/></svg>`,
  "Switch":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0142 3.86587C14.7138 3.67557 14.3112 3.7211 14.0618 3.99194L13.9794 4.0993C13.7891 4.39968 13.8346 4.80229 14.1055 5.05171L17.5785 8.25H4.50004L4.36523 8.26209C4.01536 8.32559 3.75004 8.63181 3.75004 9C3.75004 9.41422 4.08583 9.75 4.50004 9.75H19.5L19.6318 9.73918C20.2232 9.63982 20.4771 8.88024 20.0081 8.4483L15.1216 3.9483L15.0142 3.86587ZM20.25 15C20.25 14.5858 19.9143 14.25 19.5 14.25H4.50004L4.3683 14.2608C3.77691 14.3602 3.52295 15.1198 3.99198 15.5517L8.87851 20.0517L8.98587 20.1341C9.28625 20.3244 9.68886 20.2789 9.93827 20.0081L10.0207 19.9007C10.211 19.6003 10.1655 19.1977 9.89463 18.9483L6.42154 15.75H19.5L19.6349 15.7379C19.9847 15.6744 20.25 15.3682 20.25 15Z" fill="currentColor"/></svg>`,
  "Date":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.99644 3.44662C8.93293 3.09675 8.62671 2.83144 8.25852 2.83144C7.84431 2.83144 7.50852 3.16722 7.50852 3.58144V4.70223H5.45233C4.00491 4.70223 2.83154 5.87559 2.83154 7.32302V18.5478C2.83154 19.9952 4.00491 21.1686 5.45233 21.1686H18.5479C19.9953 21.1686 21.1687 19.9952 21.1687 18.5478V7.32302C21.1687 5.87559 19.9953 4.70223 18.5479 4.70223H16.4917V3.58144L16.4796 3.44662C16.4161 3.09675 16.1099 2.83144 15.7417 2.83144C15.3275 2.83144 14.9917 3.16722 14.9917 3.58144V4.70223H9.00852V3.58144L8.99644 3.44662ZM7.50852 6.20223V7.32302L7.5206 7.45783C7.58411 7.8077 7.89033 8.07302 8.25852 8.07302C8.67273 8.07302 9.00852 7.73723 9.00852 7.32302V6.20223H14.9917V7.32302L15.0038 7.45783C15.0673 7.8077 15.3735 8.07302 15.7417 8.07302C16.1559 8.07302 16.4917 7.73723 16.4917 7.32302V6.20223H18.5479C19.1669 6.20223 19.6687 6.70402 19.6687 7.32302V18.5478C19.6687 19.1668 19.1669 19.6686 18.5479 19.6686H5.45233C4.83334 19.6686 4.33154 19.1668 4.33154 18.5478V7.32302C4.33154 6.70402 4.83334 6.20223 5.45233 6.20223H7.50852ZM16.6771 10.3146C17.0913 10.3146 17.4271 10.6504 17.4271 11.0646C17.4271 11.4328 17.1618 11.739 16.8119 11.8025L16.6771 11.8146H7.32312C6.90891 11.8146 6.57312 11.4788 6.57312 11.0646C6.57312 10.6964 6.83844 10.3902 7.18831 10.3267L7.32312 10.3146H16.6771Z" fill="currentColor"/></svg>`,
  "Add":            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
  "sidebar":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bell":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "download":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-left":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-right":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "shopping-cart":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "users":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "user":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "lock":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular'  }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'   }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Semibold' }),
  ]);

  // ── 工具函数 ──────────────────────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a) {
    if (a === undefined) { a = 1; }
    return [{ type:'SOLID', color:color, opacity:a }];
  }

  // ── 颜色 ──────────────────────────────────────────────────────────────
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
    green:      hex('#00875A'),
    red:        hex('#CF1322'),
  };

  // ── 布局常量 ──────────────────────────────────────────────────────────
  const CANVAS_W = 1440, CANVAS_H = 864;
  const SIDE_W = 208, MAIN_W = 1232;
  const NAV_H = 48, TITLE_H = 48;
  const OUTER_PAD = 16, PAD = 24;
  const CARD_W = 1200, TBL_W = 1152;
  const ROW_H = 48, HEADER_H = 48;
  const NUM_ROWS = 8;

  // 筛选：Row0(col0,1,2) Row1(col0,1,2) — 最后一行满3列 → 按钮新行（rowIdx=2）
  const FILTER_ACT_Y = 24 + 2 * 48;  // 120
  const TOOLBAR_Y    = FILTER_ACT_Y + 32 + 16; // 168
  const TBL_Y        = TOOLBAR_Y + ROW_H;       // 216
  const TABLE_CONTENT_H = HEADER_H + NUM_ROWS * ROW_H; // 432
  const SCROLLBAR_H  = 16;
  const TABLE_WRAPPER_H = TABLE_CONTENT_H + SCROLLBAR_H; // 448
  const PAGER_Y      = TBL_Y + TABLE_WRAPPER_H + 16; // 680
  const CARD_H       = PAGER_Y + 32 + 24;            // 736

  const SHADOW_FREEZE_LEFT  = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:2,y:0},  radius:4, spread:-1 };
  const SHADOW_FREEZE_RIGHT = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:-2,y:0}, radius:4, spread:-1 };

  // ── 基础工厂 ──────────────────────────────────────────────────────────
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
    t.fills      = solid(color, opts.a !== undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function icon(key, size, color, opacity) {
    if (opacity === undefined) { opacity = 1; }
    const svg = ICONS[key];
    if (!svg) { console.warn('icon not found: ' + key); return null; }
    const node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(function(n) { return n.fills && n.fills.length > 0 && n.fills[0].type === 'SOLID'; }).forEach(function(n) { n.fills = solid(color, 1); });
    node.findAll(function(n) { return n.strokes && n.strokes.length > 0; }).forEach(function(n) { n.strokes = solid(color, 1); });
    return node;
  }

  // ── Button ────────────────────────────────────────────────────────────
  function makeBtn(label, type, iconNode) {
    if (type === undefined) { type = 'primary'; }
    const PX = 16, PY = 5;
    const btn = figma.createFrame();
    btn.name = 'Btn/' + type + '/' + (label || 'icon');
    btn.cornerRadius = 4; btn.clipsContent = false;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO';
    btn.counterAxisSizingMode = 'AUTO';
    btn.paddingLeft = PX; btn.paddingRight = PX;
    btn.paddingTop  = PY; btn.paddingBottom = PY;
    btn.primaryAxisAlignItems = 'CENTER';
    btn.counterAxisAlignItems = 'CENTER';
    btn.itemSpacing = 4;
    if (type === 'primary') {
      btn.fills = solid(C.primary); btn.strokes = [];
    } else {
      btn.fills = solid(C.white);
      btn.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
      btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
    }
    if (iconNode) { iconNode.resize(16, 16); iconNode.layoutAlign = 'CENTER'; btn.appendChild(iconNode); }
    if (label) {
      const t = figma.createText();
      t.fontName = { family:'PingFang SC', style:'Regular' };
      t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
      t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
      t.fills = type === 'primary' ? solid(C.white) : [{ type:'SOLID', color:C.black, opacity:0.65 }];
      t.characters = label;
      btn.appendChild(t);
    }
    return btn;
  }

  // ── Input ─────────────────────────────────────────────────────────────
  function makeInput(placeholder, x, y, width) {
    if (width === undefined) { width = 255; }
    const wrap = figma.createFrame();
    wrap.name = 'Input/default'; wrap.x = x; wrap.y = y;
    wrap.cornerRadius = 2; wrap.clipsContent = false;
    wrap.layoutMode = 'HORIZONTAL';
    wrap.primaryAxisSizingMode = 'FIXED'; wrap.counterAxisSizingMode = 'AUTO';
    wrap.resize(width, 32);
    wrap.paddingLeft = 12; wrap.paddingRight = 12;
    wrap.paddingTop  = 5;  wrap.paddingBottom = 5;
    wrap.primaryAxisAlignItems = 'MIN';
    wrap.counterAxisAlignItems = 'CENTER';
    wrap.itemSpacing = 8;
    wrap.fills   = solid(C.white);
    wrap.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    wrap.strokeWeight = 1; wrap.strokeAlign = 'INSIDE';
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = placeholder;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    wrap.appendChild(t);
    return wrap;
  }

  // ── Select ────────────────────────────────────────────────────────────
  function makeSelect(placeholder, x, y, width) {
    if (width === undefined) { width = 255; }
    const wrap = figma.createFrame();
    wrap.name = 'Select/default'; wrap.x = x; wrap.y = y;
    wrap.cornerRadius = 2; wrap.clipsContent = false;
    wrap.layoutMode = 'HORIZONTAL';
    wrap.primaryAxisSizingMode = 'FIXED'; wrap.counterAxisSizingMode = 'AUTO';
    wrap.resize(width, 32);
    wrap.paddingLeft = 12; wrap.paddingRight = 8;
    wrap.paddingTop  = 5;  wrap.paddingBottom = 5;
    wrap.primaryAxisAlignItems = 'SPACE_BETWEEN';
    wrap.counterAxisAlignItems = 'CENTER';
    wrap.itemSpacing = 4;
    wrap.fills   = solid(C.white);
    wrap.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    wrap.strokeWeight = 1; wrap.strokeAlign = 'INSIDE';
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = placeholder;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    wrap.appendChild(t);
    const arr = icon('DropDown-Arrow', 16, C.black, 0.45);
    if (arr) { arr.layoutAlign = 'CENTER'; wrap.appendChild(arr); }
    return wrap;
  }

  // ── DateRange 单框 ────────────────────────────────────────────────────
  function makeDateRange(startPH, endPH, x, y) {
    const wrap = figma.createFrame();
    wrap.name = 'DateRange/default';
    wrap.x = x; wrap.y = y;
    wrap.cornerRadius = 2; wrap.clipsContent = false;
    wrap.layoutMode = 'HORIZONTAL';
    wrap.primaryAxisSizingMode = 'FIXED'; wrap.counterAxisSizingMode = 'AUTO';
    wrap.resize(255, 32);
    wrap.paddingLeft  = 12; wrap.paddingRight = 12;
    wrap.paddingTop   = 5;  wrap.paddingBottom = 5;
    wrap.primaryAxisAlignItems = 'MIN';
    wrap.counterAxisAlignItems = 'CENTER';
    wrap.itemSpacing = 8;
    wrap.fills   = solid(C.white);
    wrap.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    wrap.strokeWeight = 1; wrap.strokeAlign = 'INSIDE';
    const ic = icon('Date', 16, C.black, 0.25);
    if (ic) { ic.layoutAlign = 'CENTER'; wrap.appendChild(ic); }
    const t1 = figma.createText();
    t1.fontName = { family:'PingFang SC', style:'Regular' };
    t1.fontSize = 14; t1.lineHeight = { value:22, unit:'PIXELS' };
    t1.characters = startPH;
    t1.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t1.textAutoResize = 'WIDTH_AND_HEIGHT'; t1.layoutAlign = 'CENTER';
    wrap.appendChild(t1);
    const t2 = figma.createText();
    t2.fontName = { family:'PingFang SC', style:'Regular' };
    t2.fontSize = 14; t2.lineHeight = { value:22, unit:'PIXELS' };
    t2.characters = '至';
    t2.fills = [{ type:'SOLID', color:C.black, opacity:0.45 }];
    t2.textAutoResize = 'WIDTH_AND_HEIGHT'; t2.layoutAlign = 'CENTER';
    wrap.appendChild(t2);
    const t3 = figma.createText();
    t3.fontName = { family:'PingFang SC', style:'Regular' };
    t3.fontSize = 14; t3.lineHeight = { value:22, unit:'PIXELS' };
    t3.characters = endPH;
    t3.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t3.textAutoResize = 'WIDTH_AND_HEIGHT'; t3.layoutAlign = 'CENTER';
    wrap.appendChild(t3);
    return wrap;
  }

  // ── 筛选行字段 ────────────────────────────────────────────────────────
  const LABEL_W = 112, LABEL_GAP = 12, INPUT_W = 255;
  const COL_X   = [24, 411, 798];

  function addFilter(parent, label, col, rowIdx, fieldType) {
    var x0 = COL_X[col], y0 = 24 + rowIdx * 48;
    const lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = label;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    lbl.textAutoResize = 'HEIGHT'; lbl.resize(LABEL_W, 22);
    lbl.textAlignHorizontal = 'RIGHT';
    lbl.x = x0; lbl.y = y0 + 5;
    parent.appendChild(lbl);
    var inputX = x0 + LABEL_W + LABEL_GAP;
    if (fieldType === 'select') {
      parent.appendChild(makeSelect('请选择', inputX, y0, INPUT_W));
    } else if (fieldType === 'date') {
      parent.appendChild(makeDateRange('开始日期', '结束日期', inputX, y0));
    } else {
      parent.appendChild(makeInput('请输入', inputX, y0, INPUT_W));
    }
  }

  // 筛选操作按钮（查询+重置，无收起）
  function buildFilterActions(parent, y) {
    const row = figma.createFrame();
    row.name = 'FilterActions'; row.fills = []; row.clipsContent = false;
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 8; row.counterAxisAlignItems = 'CENTER';
    row.appendChild(makeBtn('查询', 'primary'));
    row.appendChild(makeBtn('重置', 'secondary'));
    parent.appendChild(row);
    row.x = CARD_W - PAD - row.width; row.y = y;
  }

  // ── 工具栏 ────────────────────────────────────────────────────────────
  function buildTableToolbar(parent, y) {
    parent.appendChild(text('合同列表', C.black, 14, { style:'Medium', lh:22, a:0.85, x:PAD, y:y + 5 }));
    const row = figma.createFrame();
    row.name = 'ToolbarButtons'; row.fills = []; row.clipsContent = false;
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 8; row.counterAxisAlignItems = 'CENTER';
    row.appendChild(makeBtn('导出', 'secondary'));
    const icAdd = icon('Add', 16, C.white, 1);
    row.appendChild(makeBtn('新增合同', 'primary', icAdd));
    parent.appendChild(row);
    row.x = CARD_W - PAD - row.width; row.y = y;
  }

  // ── 表格单元格 ────────────────────────────────────────────────────────
  function makeTableHeader(colW, label) {
    const cell = figma.createFrame();
    cell.name = 'TableHeader'; cell.resize(colW, HEADER_H);
    cell.fills = [{ type:'SOLID', color:C.black, opacity:0.04 }]; cell.clipsContent = false;
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Medium' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = label;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'NONE'; t.resize(colW - 32, 22); t.textTruncation = 'ENDING';
    t.x = 16; t.y = 13; cell.appendChild(t); return cell;
  }
  function makeTableCell(colW, content, truncate) {
    if (truncate === undefined) { truncate = false; }
    const cell = figma.createFrame();
    cell.name = 'TableCell'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = content;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'NONE'; t.resize(colW - 32, 22);
    if (truncate) { t.textTruncation = 'ENDING'; }
    t.x = 16; t.y = 13; cell.appendChild(t); return cell;
  }
  function makeLinkCell(colW, content) {
    const cell = figma.createFrame();
    cell.name = 'LinkCell'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = content;
    t.fills = solid(C.primary);
    t.textAutoResize = 'NONE'; t.resize(colW - 32, 22);
    t.x = 16; t.y = 13; cell.appendChild(t); return cell;
  }
  function makeTagCell(colW, label, bg, txtColor, opacity) {
    if (opacity === undefined) { opacity = 1; }
    const cell = figma.createFrame();
    cell.name = 'TagCell'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const tLabel = figma.createText();
    tLabel.fontName = { family:'PingFang SC', style:'Regular' }; tLabel.fontSize = 12;
    tLabel.lineHeight = { value:20, unit:'PIXELS' }; tLabel.characters = label;
    tLabel.fills = solid(txtColor, opacity); tLabel.textAutoResize = 'WIDTH_AND_HEIGHT';
    tLabel.x = 8; tLabel.y = 1;
    const tagW = tLabel.width + 16, tagH = 22;
    const tag = figma.createFrame();
    tag.name = 'tag'; tag.cornerRadius = 2; tag.clipsContent = false;
    tag.resize(tagW, tagH); tag.fills = solid(bg);
    tag.x = 8; tag.y = Math.round((ROW_H - tagH) / 2);
    tag.appendChild(tLabel); cell.appendChild(tag); return cell;
  }
  function makeAmountCell(colW, amount) {
    const cell = figma.createFrame();
    cell.name = 'AmountCell'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = amount;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = 0; t.y = 13;
    cell.appendChild(t); t.x = colW - t.width - 16; return cell;
  }
  function makeActionCell(colW, ops) {
    const cell = figma.createFrame();
    cell.name = 'ActionCell'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    ops.forEach(function(op) {
      const btn = figma.createText();
      btn.fontName = { family:'PingFang SC', style:'Regular' }; btn.fontSize = 14;
      btn.lineHeight = { value:22, unit:'PIXELS' }; btn.characters = op.label;
      btn.fills = solid(op.color); btn.x = op.x; btn.y = 13; cell.appendChild(btn);
    });
    return cell;
  }
  function makeVCol(colW, label, cellBuilders) {
    const col = figma.createFrame(); col.name = label;
    col.layoutMode = 'VERTICAL'; col.itemSpacing = 0;
    col.primaryAxisSizingMode = 'AUTO'; col.counterAxisSizingMode = 'FIXED';
    col.resize(colW, HEADER_H + cellBuilders.length * ROW_H); col.fills = [];
    col.appendChild(makeTableHeader(colW, label));
    cellBuilders.forEach(function(b) { col.appendChild(b()); });
    return col;
  }

  // ── 数据 & 状态配置 ───────────────────────────────────────────────────
  const STATUS_CFG = {
    '已生效': { bg:C.successL90, txt:C.success,  a:1    },
    '草稿':   { bg:C.tagGrayBg,  txt:C.black,    a:0.65 },
    '已到期': { bg:C.tagGrayBg,  txt:C.black,    a:0.45 },
    '已终止': { bg:C.dangerL90,  txt:C.danger,   a:1    },
  };
  const TYPE_CFG = {
    '框架': { bg:C.primaryL90, txt:C.primary, a:1 },
    '具体': { bg:C.successL90, txt:C.success, a:1 },
  };

  function getOps(status) {
    var P = C.primary, R = C.red;
    var map = {
      '已生效': [{ label:'详情', color:P, x:16 }, { label:'终止', color:R, x:60 }],
      '草稿':   [{ label:'详情', color:P, x:16 }, { label:'编辑', color:P, x:60 }],
      '已到期': [{ label:'详情', color:P, x:16 }],
      '已终止': [{ label:'详情', color:P, x:16 }],
    };
    return map[status] || [{ label:'详情', color:P, x:16 }];
  }

  const rows = [
    { id:'HT2026030001', client:'万科物业服务集团', name:'2026年度桶装水采购框架协议',      ctype:'框架', status:'已生效', total:'¥580,000.00',    ordered:'¥226,800.00', sales:'王明',   start:'2026-01-01', end:'2026-12-31' },
    { id:'HT2026030002', client:'保利物业服务',     name:'2026 Q1 清洁用品一次性采购合同',  ctype:'具体', status:'已生效', total:'¥128,500.00',   ordered:'¥128,500.00', sales:'李娜',   start:'2026-02-15', end:'2026-03-15' },
    { id:'HT2026040001', client:'金地物业',         name:'2026年度安防设备维护服务框架协议', ctype:'框架', status:'已生效', total:'¥1,200,000.00', ordered:'¥432,000.00', sales:'张涛',   start:'2026-03-01', end:'2027-02-28' },
    { id:'HT2026040002', client:'中海物业',         name:'2026年办公用品采购框架协议',       ctype:'框架', status:'草稿',   total:'¥350,000.00',   ordered:'¥0.00',       sales:'刘芳',   start:'2026-04-15', end:'2026-10-31' },
    { id:'HT2026040003', client:'融创服务',         name:'2026 Q2 园林绿化耗材一次采购',    ctype:'具体', status:'已生效', total:'¥86,600.00',    ordered:'¥86,600.00',  sales:'陈强',   start:'2026-04-01', end:'—'          },
    { id:'HT2025090005', client:'万科物业服务集团', name:'2025年度桶装水采购框架协议',       ctype:'框架', status:'已到期', total:'¥450,000.00',   ordered:'¥435,200.00', sales:'王明',   start:'2025-01-01', end:'2025-12-31' },
    { id:'HT2026020008', client:'保利物业服务',     name:'2026年消防设备维护合作框架',       ctype:'框架', status:'已终止', total:'¥680,000.00',   ordered:'¥120,000.00', sales:'李娜',   start:'2026-02-01', end:'2027-01-31' },
    { id:'HT2026050001', client:'金地物业',         name:'2026 Q3 办公耗材采购',            ctype:'具体', status:'草稿',   total:'¥42,800.00',    ordered:'¥0.00',       sales:'张涛',   start:'2026-06-01', end:'—'          },
  ];

  const CW = { id:180, client:200, name:280, ctype:110, status:110, total:140, ordered:140, sales:110, start:130, end:130, ops:220 };

  // ── 带冻结表格 ────────────────────────────────────────────────────────
  function buildFrozenTable() {
    const wrapper = figma.createFrame();
    wrapper.name = 'FrozenTable'; wrapper.resize(TBL_W, TABLE_WRAPPER_H);
    wrapper.fills = []; wrapper.clipsContent = true;

    const allCols = figma.createFrame(); allCols.name = 'AllColumns';
    allCols.layoutMode = 'HORIZONTAL'; allCols.itemSpacing = 0;
    allCols.primaryAxisSizingMode = 'AUTO'; allCols.counterAxisSizingMode = 'AUTO';
    allCols.fills = []; allCols.x = 0; allCols.y = 0;

    allCols.appendChild(makeVCol(CW.id,     '合同编号',   rows.map(function(r) { return function() { return makeLinkCell(CW.id, r.id); }; })));
    allCols.appendChild(makeVCol(CW.client, '客户名称',   rows.map(function(r) { return function() { return makeTableCell(CW.client, r.client); }; })));
    allCols.appendChild(makeVCol(CW.name,   '合同名称',   rows.map(function(r) { return function() { return makeTableCell(CW.name, r.name, true); }; })));
    allCols.appendChild(makeVCol(CW.ctype,  '合同类型',   rows.map(function(r) { return function() { var tc = TYPE_CFG[r.ctype] || TYPE_CFG['框架']; return makeTagCell(CW.ctype, r.ctype, tc.bg, tc.txt, tc.a); }; })));
    allCols.appendChild(makeVCol(CW.status, '合同状态',   rows.map(function(r) { return function() { var sc = STATUS_CFG[r.status] || STATUS_CFG['草稿']; return makeTagCell(CW.status, r.status, sc.bg, sc.txt, sc.a); }; })));
    allCols.appendChild(makeVCol(CW.total,  '合同总金额', rows.map(function(r) { return function() { return makeAmountCell(CW.total, r.total); }; })));
    allCols.appendChild(makeVCol(CW.ordered,'已下单金额', rows.map(function(r) { return function() { return makeAmountCell(CW.ordered, r.ordered); }; })));
    allCols.appendChild(makeVCol(CW.sales,  '销售人员',   rows.map(function(r) { return function() { return makeTableCell(CW.sales, r.sales); }; })));
    allCols.appendChild(makeVCol(CW.start,  '生效日期',   rows.map(function(r) { return function() { return makeTableCell(CW.start, r.start); }; })));
    allCols.appendChild(makeVCol(CW.end,    '到期日期',   rows.map(function(r) { return function() { return makeTableCell(CW.end, r.end); }; })));
    allCols.appendChild(makeVCol(CW.ops,    '操作',       rows.map(function(r) { return function() { return makeActionCell(CW.ops, getOps(r.status)); }; })));
    wrapper.appendChild(allCols);

    const leftFrozen = makeVCol(CW.id, '合同编号-冻结', rows.map(function(r) { return function() { return makeLinkCell(CW.id, r.id); }; }));
    leftFrozen.name = 'LeftFrozen'; leftFrozen.fills = solid(C.white);
    leftFrozen.effects = [SHADOW_FREEZE_LEFT]; leftFrozen.x = 0; leftFrozen.y = 0;
    wrapper.appendChild(leftFrozen);

    const rightFrozen = makeVCol(CW.ops, '操作-冻结', rows.map(function(r) { return function() { return makeActionCell(CW.ops, getOps(r.status)); }; }));
    rightFrozen.name = 'RightFrozen'; rightFrozen.fills = solid(C.white);
    rightFrozen.effects = [SHADOW_FREEZE_RIGHT]; rightFrozen.x = TBL_W - CW.ops; rightFrozen.y = 0;
    wrapper.appendChild(rightFrozen);

    const sbTrack = figma.createFrame(); sbTrack.name = 'ScrollbarTrack';
    sbTrack.resize(TBL_W, SCROLLBAR_H); sbTrack.fills = solid(hex('#FAFAFA'));
    sbTrack.x = 0; sbTrack.y = TABLE_CONTENT_H; sbTrack.clipsContent = false;
    sbTrack.appendChild(rect(TBL_W, 1, hex('#EDEDED'), { x:0, y:0 }));
    sbTrack.appendChild(rect(Math.round(TBL_W * 0.3), 8, hex('#D8D8D8'), { r:4, x:16, y:4 }));
    sbTrack.appendChild(rect(TBL_W, 1, hex('#EDEDED'), { x:0, y:SCROLLBAR_H - 1 }));
    wrapper.appendChild(sbTrack);
    return wrapper;
  }

  // ── 分页器 ────────────────────────────────────────────────────────────
  function buildFullPagination(parent, y, total, currentPage, pageCount) {
    const pRow = figma.createFrame();
    pRow.name = 'PaginationRow';
    pRow.layoutMode = 'HORIZONTAL';
    pRow.primaryAxisSizingMode = 'AUTO'; pRow.counterAxisSizingMode = 'AUTO';
    pRow.itemSpacing = 8; pRow.counterAxisAlignItems = 'CENTER';
    pRow.fills = [];

    const psBox = figma.createFrame();
    psBox.name = 'PageSize'; psBox.resize(90, 32); psBox.cornerRadius = 2; psBox.clipsContent = false;
    psBox.fills = solid(C.white);
    psBox.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    psBox.strokeWeight = 1; psBox.strokeAlign = 'INSIDE';
    psBox.layoutMode = 'HORIZONTAL'; psBox.primaryAxisSizingMode = 'FIXED'; psBox.counterAxisSizingMode = 'FIXED';
    psBox.paddingLeft = 10; psBox.paddingRight = 8; psBox.paddingTop = 5; psBox.paddingBottom = 5;
    psBox.primaryAxisAlignItems = 'SPACE_BETWEEN'; psBox.counterAxisAlignItems = 'CENTER';
    psBox.itemSpacing = 4;
    const psT = figma.createText();
    psT.fontName = { family:'PingFang SC', style:'Regular' }; psT.fontSize = 14;
    psT.lineHeight = { value:22, unit:'PIXELS' }; psT.characters = '20条/页';
    psT.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    psT.textAutoResize = 'WIDTH_AND_HEIGHT'; psT.layoutAlign = 'CENTER';
    psBox.appendChild(psT);
    const psArr = icon('DropDown-Arrow', 16, C.black, 0.45);
    if (psArr) { psArr.layoutAlign = 'CENTER'; psBox.appendChild(psArr); }
    pRow.appendChild(psBox);

    const tTotal = figma.createText();
    tTotal.fontName = { family:'PingFang SC', style:'Regular' }; tTotal.fontSize = 14;
    tTotal.lineHeight = { value:22, unit:'PIXELS' }; tTotal.characters = '共 ' + total + ' 条';
    tTotal.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    tTotal.textAutoResize = 'WIDTH_AND_HEIGHT'; tTotal.layoutAlign = 'CENTER';
    pRow.appendChild(tTotal);

    function makePgArrow(key) {
      const b = figma.createFrame(); b.name = 'PgArrow/' + key;
      b.layoutMode = 'HORIZONTAL'; b.primaryAxisAlignItems = 'CENTER'; b.counterAxisAlignItems = 'CENTER';
      b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'FIXED';
      b.resize(32, 32); b.cornerRadius = 2;
      b.fills = solid(C.white);
      b.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
      b.strokeWeight = 1; b.strokeAlign = 'INSIDE';
      const ic = icon(key, 12, C.black, 0.65);
      if (ic) { ic.layoutAlign = 'CENTER'; b.appendChild(ic); }
      return b;
    }
    pRow.appendChild(makePgArrow('chevron-left'));

    for (var p = 1; p <= pageCount; p++) {
      var isSelected = p === currentPage;
      const btn = figma.createFrame(); btn.name = 'PgBtn/' + p;
      btn.layoutMode = 'HORIZONTAL'; btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER';
      btn.primaryAxisSizingMode = 'FIXED'; btn.counterAxisSizingMode = 'FIXED';
      btn.resize(32, 32); btn.cornerRadius = 2;
      if (isSelected) { btn.fills = solid(C.primary); btn.strokes = []; }
      else { btn.fills = solid(C.white); btn.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }]; btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE'; }
      const tP = figma.createText();
      tP.fontName = { family:'PingFang SC', style:'Regular' }; tP.fontSize = 14;
      tP.lineHeight = { value:22, unit:'PIXELS' }; tP.characters = String(p);
      tP.fills = isSelected ? solid(C.white) : [{ type:'SOLID', color:C.black, opacity:0.85 }];
      tP.textAutoResize = 'WIDTH_AND_HEIGHT'; tP.layoutAlign = 'CENTER';
      btn.appendChild(tP); pRow.appendChild(btn);
    }

    pRow.appendChild(makePgArrow('chevron-right'));

    const tGoto = figma.createText();
    tGoto.fontName = { family:'PingFang SC', style:'Regular' }; tGoto.fontSize = 14;
    tGoto.lineHeight = { value:22, unit:'PIXELS' }; tGoto.characters = '跳转至';
    tGoto.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    tGoto.textAutoResize = 'WIDTH_AND_HEIGHT'; tGoto.layoutAlign = 'CENTER';
    pRow.appendChild(tGoto);

    const jumpBox = figma.createFrame(); jumpBox.name = 'JumpInput';
    jumpBox.layoutMode = 'HORIZONTAL'; jumpBox.primaryAxisAlignItems = 'CENTER'; jumpBox.counterAxisAlignItems = 'CENTER';
    jumpBox.primaryAxisSizingMode = 'FIXED'; jumpBox.counterAxisSizingMode = 'FIXED';
    jumpBox.resize(40, 32); jumpBox.cornerRadius = 2;
    jumpBox.fills = solid(C.white);
    jumpBox.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    jumpBox.strokeWeight = 1; jumpBox.strokeAlign = 'INSIDE';
    const tJ = figma.createText();
    tJ.fontName = { family:'PingFang SC', style:'Regular' }; tJ.fontSize = 14;
    tJ.lineHeight = { value:22, unit:'PIXELS' }; tJ.characters = String(currentPage);
    tJ.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    tJ.textAutoResize = 'WIDTH_AND_HEIGHT'; tJ.layoutAlign = 'CENTER';
    jumpBox.appendChild(tJ); pRow.appendChild(jumpBox);

    const tPage = figma.createText();
    tPage.fontName = { family:'PingFang SC', style:'Regular' }; tPage.fontSize = 14;
    tPage.lineHeight = { value:22, unit:'PIXELS' }; tPage.characters = '页';
    tPage.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    tPage.textAutoResize = 'WIDTH_AND_HEIGHT'; tPage.layoutAlign = 'CENTER';
    pRow.appendChild(tPage);

    parent.appendChild(pRow);
    pRow.x = CARD_W - PAD - pRow.width;
    pRow.y = y;
  }

  // ── 侧边栏 ────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64); area.fills = solid(C.sidebarBg);
    area.clipsContent = false;
    const box = rect(32, 32, C.primary, { r:6, x:24, y:16 });
    area.appendChild(box);
    const tM = text('M', C.white, 14, { style:'Medium', lh:20 });
    tM.x = 24 + Math.round((32 - tM.width) / 2); tM.y = 22;
    area.appendChild(tM);
    area.appendChild(text('Mall 管理后台', C.white, 14, { style:'Medium', lh:20, x:64, y:14 }));
    return area;
  }
  function makeSidebarGroupTitle(label, y) {
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 11; t.lineHeight = { value:16, unit:'PIXELS' };
    t.characters = label;
    t.fills = [{ type:'SOLID', color:C.white, opacity:0.45 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 24; t.y = y;
    return t;
  }
  function makeSidebarItem(label, level, state, iconKey) {
    var bg = level === 2 ? C.sidebarSub : C.sidebarBg;
    var isActive = state === 'active' || state === 'expanded';
    var op = isActive ? 1 : 0.5;
    const row = figma.createFrame();
    row.name = 'L' + level + '·' + label; row.resize(208, 48);
    row.fills = solid(bg); row.opacity = op; row.clipsContent = false;
    if (level === 1 && iconKey) {
      const ic = icon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }
    row.appendChild(text(label, C.white, 14, { lh:22, x:level === 1 ? 52 : 40, y:13 }));
    return row;
  }
  function makeSidebarDivider() {
    const w = figma.createFrame(); w.name = 'SidebarDivider'; w.resize(208, 1); w.fills = []; w.clipsContent = false;
    w.appendChild(rect(160, 1, C.white, { a:0.08, x:24, y:0 })); return w;
  }
  function makeSidebar(height) {
    const s = figma.createFrame(); s.name = '侧边栏';
    s.layoutMode = 'VERTICAL'; s.itemSpacing = 0;
    s.primaryAxisSizingMode = 'FIXED'; s.counterAxisSizingMode = 'FIXED';
    s.resize(208, height); s.fills = solid(C.sidebarBg); s.clipsContent = false;
    s.appendChild(makeSidebarLogo());
    s.appendChild(makeSidebarDivider());

    // 商城运营
    const gt1 = makeSidebarGroupTitle('商城运营', 8);
    const g1 = figma.createFrame(); g1.name = '商城运营'; g1.resize(208, 40 + 3 * 48);
    g1.fills = []; g1.clipsContent = false;
    g1.appendChild(gt1);
    g1.appendChild(makeSidebarItem('数据看板', 1, 'inactive', 'bar-chart-2'));
    g1.appendChild(makeSidebarItem('商品管理', 1, 'inactive', 'shopping-cart'));
    g1.appendChild(makeSidebarItem('订单管理', 1, 'inactive', 'briefcase'));
    s.appendChild(g1);
    s.appendChild(makeSidebarDivider());

    // 销售管理
    const gt2 = makeSidebarGroupTitle('销售管理', 8);
    const g2 = figma.createFrame(); g2.name = '销售管理'; g2.resize(208, 40 + 3 * 48);
    g2.fills = []; g2.clipsContent = false;
    g2.appendChild(gt2);
    g2.appendChild(makeSidebarItem('合同管理', 1, 'active', 'file-text'));
    g2.appendChild(makeSidebarItem('客户管理', 1, 'inactive', 'users'));
    g2.appendChild(makeSidebarItem('报价单',   1, 'inactive', 'archive'));
    s.appendChild(g2);
    s.appendChild(makeSidebarDivider());

    // 系统管理
    const gt3 = makeSidebarGroupTitle('系统管理', 8);
    const g3 = figma.createFrame(); g3.name = '系统管理'; g3.resize(208, 40 + 2 * 48);
    g3.fills = []; g3.clipsContent = false;
    g3.appendChild(gt3);
    g3.appendChild(makeSidebarItem('用户管理', 1, 'inactive', 'user'));
    g3.appendChild(makeSidebarItem('角色管理', 1, 'inactive', 'lock'));
    s.appendChild(g3);

    return s;
  }

  // ── Header ────────────────────────────────────────────────────────────
  function makeHeaderBar(totalW) {
    const bar = figma.createFrame();
    bar.name = 'HeaderBar'; bar.resize(totalW, 48); bar.fills = solid(C.white); bar.clipsContent = false;
    bar.appendChild(rect(totalW, 1, C.black, { a:0.10, x:0, y:47 }));
    const icSide = icon('sidebar', 16, C.black, 0.65);
    if (icSide) { icSide.x = 24; icSide.y = 16; bar.appendChild(icSide); }
    const sw = figma.createFrame();
    sw.name = '租户切换'; sw.resize(200, 32); sw.x = 64; sw.y = 8;
    sw.cornerRadius = 2; sw.clipsContent = false;
    sw.fills = solid(C.white);
    sw.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    sw.strokeWeight = 1; sw.strokeAlign = 'INSIDE';
    sw.layoutMode = 'HORIZONTAL'; sw.primaryAxisSizingMode = 'FIXED'; sw.counterAxisSizingMode = 'FIXED';
    sw.paddingLeft = 12; sw.paddingRight = 8; sw.paddingTop = 5; sw.paddingBottom = 5;
    sw.primaryAxisAlignItems = 'SPACE_BETWEEN'; sw.counterAxisAlignItems = 'CENTER';
    const swPh = figma.createText();
    swPh.fontName = { family:'PingFang SC', style:'Regular' }; swPh.fontSize = 14;
    swPh.lineHeight = { value:22, unit:'PIXELS' }; swPh.characters = '碧桂园物业';
    swPh.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    swPh.textAutoResize = 'WIDTH_AND_HEIGHT'; swPh.layoutAlign = 'CENTER';
    sw.appendChild(swPh);
    const icSw = icon('Switch', 14, C.black, 0.45);
    if (icSw) { icSw.layoutAlign = 'CENTER'; sw.appendChild(icSw); }
    bar.appendChild(sw);
    const rightStart = totalW - 24 - 223;
    [['search', 0], ['download', 40], ['bell', 80]].forEach(function(pair) {
      var ic = icon(pair[0], 16, C.black, 0.65);
      if (ic) { ic.x = rightStart + pair[1]; ic.y = 16; bar.appendChild(ic); }
    });
    bar.appendChild(rect(1, 16, C.black, { a:0.10, x:rightStart + 112, y:16 }));
    const avatar = figma.createEllipse(); avatar.resize(24, 24);
    avatar.x = rightStart + 129; avatar.y = 12; avatar.fills = solid(C.primaryL20);
    bar.appendChild(avatar);
    bar.appendChild(text('总', C.white, 12, { lh:20, x:rightStart + 135, y:14 }));
    bar.appendChild(text('碧小园', C.black, 14, { lh:22, a:0.85, x:rightStart + 161, y:13 }));
    const icArr = icon('Arrow-Open', 16, C.black, 0.65);
    if (icArr) { icArr.x = rightStart + 207; icArr.y = 16; bar.appendChild(icArr); }
    return bar;
  }

  function makeBreadcrumbBar(totalW, crumbs) {
    const bar = figma.createFrame();
    bar.name = 'BreadcrumbBar'; bar.resize(totalW, 48); bar.fills = solid(C.white); bar.clipsContent = false;
    bar.appendChild(rect(totalW, 1, C.black, { a:0.10, x:0, y:47 }));
    var currentTitle = crumbs[crumbs.length - 1] || '';
    bar.appendChild(text(currentTitle, C.black, 16, { style:'Medium', lh:24, a:0.85, x:24, y:12 }));
    var cx = 104;
    crumbs.forEach(function(crumb, i) {
      const t = text(crumb, C.black, 14, { lh:22, a:0.65, x:cx, y:13 });
      bar.appendChild(t); cx += t.width;
      if (i < crumbs.length - 1) {
        const arr = icon('chevron-right', 12, C.black, 0.45);
        if (arr) { arr.x = cx + 4; arr.y = 18; bar.appendChild(arr); cx += 20; }
      }
    });
    return bar;
  }

  // ── 页面组装 ──────────────────────────────────────────────────────────
  const root = figma.createFrame();
  root.name = '合同管理列表页'; root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name = '合同管理';

  const sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0; root.appendChild(sidebar);

  const main = figma.createFrame();
  main.name = '主区域'; main.resize(MAIN_W, CANVAS_H); main.fills = []; main.x = SIDE_W; main.y = 0;
  root.appendChild(main);

  const headerBar = makeHeaderBar(MAIN_W);
  headerBar.x = 0; headerBar.y = 0; main.appendChild(headerBar);

  const breadBar = makeBreadcrumbBar(MAIN_W, ['首页', '销售管理', '合同管理']);
  breadBar.x = 0; breadBar.y = NAV_H; main.appendChild(breadBar);

  const cardY = NAV_H + TITLE_H + OUTER_PAD;
  const mainCard = figma.createFrame();
  mainCard.name = '内容卡片'; mainCard.resize(CARD_W, CARD_H);
  mainCard.fills = solid(C.white); mainCard.cornerRadius = 8;
  mainCard.clipsContent = false; mainCard.x = OUTER_PAD; mainCard.y = cardY;
  main.appendChild(mainCard);

  // 筛选分割线
  const divider = rect(CARD_W - PAD * 2, 1, C.black, { a:0.08, x:PAD, y:FILTER_ACT_Y + 48 });
  mainCard.appendChild(divider);

  // Row 0: 合同编号 | 客户名称 | 合同类型
  addFilter(mainCard, '合同编号', 0, 0, 'text');
  addFilter(mainCard, '客户名称', 1, 0, 'text');
  addFilter(mainCard, '合同类型', 2, 0, 'select');

  // Row 1: 合同状态 | 销售人员 | 签订日期（满3列）
  addFilter(mainCard, '合同状态', 0, 1, 'select');
  addFilter(mainCard, '销售人员', 1, 1, 'select');
  addFilter(mainCard, '签订日期', 2, 1, 'date');

  // 筛选操作按钮（新行，无收起）
  buildFilterActions(mainCard, FILTER_ACT_Y);

  // 工具栏
  buildTableToolbar(mainCard, TOOLBAR_Y);

  // 带冻结表格
  const frozenTable = buildFrozenTable();
  frozenTable.x = PAD; frozenTable.y = TBL_Y;
  mainCard.appendChild(frozenTable);

  // 分页
  buildFullPagination(mainCard, PAGER_Y, 8, 1, 1);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
