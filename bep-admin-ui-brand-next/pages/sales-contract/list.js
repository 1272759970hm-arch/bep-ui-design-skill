// ── 销售管理·合同管理列表页 v4 ───────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-26
// v4 修正：
//   · 单元格文字节点分两类：
//     - 短内容（link/普通/金额）→ textAutoResize='WIDTH_AND_HEIGHT'，不手动resize，Figma自测实际宽度
//     - 可能超长内容（合同名称，truncate=true）→ textAutoResize='NONE'+resize(colW-32,22)+textTruncation='ENDING'
//   · 之前对所有单元格 resize(colW-32,22) 导致短文字右侧出现空白框，现已修复

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
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
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
    danger:     hex('#FE5E54'),
    dangerL90:  hex('#FFEEEE'),
    black:      hex('#000000'),
    tagGrayBg:  hex('#F5F5F5'),
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

  // 筛选：2行均满3列 → 按钮新行（rowIdx=2）
  const FILTER_ACT_Y    = 24 + 2 * 48;                       // 120
  const TOOLBAR_Y       = FILTER_ACT_Y + 32 + 16;            // 168
  const TBL_Y           = TOOLBAR_Y + ROW_H;                  // 216
  const TABLE_CONTENT_H = HEADER_H + NUM_ROWS * ROW_H;       // 432
  const SCROLLBAR_H     = 16;
  const TABLE_WRAPPER_H = TABLE_CONTENT_H + SCROLLBAR_H;     // 448
  const PAGER_Y         = TBL_Y + TABLE_WRAPPER_H + 16;      // 680
  const CARD_H          = PAGER_Y + 32 + 24;                 // 736

  const SHADOW_L = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:2,y:0},  radius:4, spread:-1 };
  const SHADOW_R = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:-2,y:0}, radius:4, spread:-1 };

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
    const btn = figma.createFrame();
    btn.name = 'Btn/' + type + '/' + (label || 'icon');
    btn.cornerRadius = 4; btn.clipsContent = false;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO';
    btn.counterAxisSizingMode = 'AUTO';
    btn.paddingLeft = 16; btn.paddingRight = 16;
    btn.paddingTop  = 5;  btn.paddingBottom = 5;
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
    wrap.name = 'DateRange/default'; wrap.x = x; wrap.y = y;
    wrap.cornerRadius = 2; wrap.clipsContent = false;
    wrap.layoutMode = 'HORIZONTAL';
    wrap.primaryAxisSizingMode = 'FIXED'; wrap.counterAxisSizingMode = 'AUTO';
    wrap.resize(255, 32);
    wrap.paddingLeft = 12; wrap.paddingRight = 12;
    wrap.paddingTop  = 5;  wrap.paddingBottom = 5;
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

  // ── 筛选字段 ──────────────────────────────────────────────────────────
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

  // 筛选操作按钮（仅查询+重置，2行6字段无收起）
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

  // ── 工具栏（无左侧标题）────────────────────────────────────────────────
  function buildTableToolbar(parent, y) {
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
    cell.name = 'Th/' + label; cell.resize(colW, HEADER_H);
    cell.fills = [{ type:'SOLID', color:C.black, opacity:0.04 }]; cell.clipsContent = false;
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Medium' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = label;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'NONE'; t.resize(colW - 32, 22);
    t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }
  function makeTableCell(colW, content, truncate) {
    if (truncate === undefined) { truncate = false; }
    const cell = figma.createFrame();
    cell.name = 'Td'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = content;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    if (truncate) {
      // 可能超出列宽的长文字：固定宽度 + 省略号截断
      t.textAutoResize = 'NONE'; t.resize(colW - 32, 22);
      t.textTruncation = 'ENDING';
    } else {
      // 短内容：自动宽度，Figma实测字符宽度，不产生空白框
      t.textAutoResize = 'WIDTH_AND_HEIGHT';
    }
    t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }
  function makeLinkCell(colW, content) {
    const cell = figma.createFrame();
    cell.name = 'TdLink'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = content;
    t.fills = solid(C.primary);
    // 合同编号为固定格式12位，长度有限，自动宽度即可，不产生空白框
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }
  function makeTagCell(colW, label, bg, txtColor, opacity) {
    if (opacity === undefined) { opacity = 1; }
    const cell = figma.createFrame();
    cell.name = 'TdTag'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
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
    tag.appendChild(tLabel); cell.appendChild(tag);
    return cell;
  }
  function makeAmountCell(colW, amount) {
    const cell = figma.createFrame();
    cell.name = 'TdAmt'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' }; t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' }; t.characters = amount;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = 0; t.y = 13;
    cell.appendChild(t); t.x = colW - t.width - 16;
    return cell;
  }
  function makeActionCell(colW, ops) {
    const cell = figma.createFrame();
    cell.name = 'TdAct'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H - 1 }));
    ops.forEach(function(op) {
      const btn = figma.createText();
      btn.fontName = { family:'PingFang SC', style:'Regular' }; btn.fontSize = 14;
      btn.lineHeight = { value:22, unit:'PIXELS' }; btn.characters = op.label;
      btn.fills = solid(op.color); btn.x = op.x; btn.y = 13;
      cell.appendChild(btn);
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

  // ── 数据 & 状态 ───────────────────────────────────────────────────────
  // 列宽：max(表头文字宽, 最长数据宽) + 32px
  // 中文≈14px/字，英文/数字≈8px/字符（fontSize=14）
  // id:128  client:144  name:200(截断)  ctype:88  status:88
  // total:136  ordered:120  sales:88  start:112  end:112  ops:96
  const CW = { id:134, client:144, name:200, ctype:88, status:88,
               total:136, ordered:120, sales:88, start:112, end:112, ops:96 };
  // id: 134px = max(表头"合同编号"56, 最长数据"HT2026020008"无'1'≈102px) + 32
  //   注：应取8行中最长（最宽）的ID，不含'1'的字符串比"HT2026030001"更宽
  // 总宽 = 1318px > TBL_W(1152) → 需冻结表格

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

  // 操作列 x 坐标（按 ops=96：左16+按钮宽28+间距8=52，右边界52+28+16=96）
  function getOps(status) {
    var P = C.primary, R = C.red;
    var map = {
      '已生效': [{ label:'详情', color:P, x:16 }, { label:'终止', color:R, x:52 }],
      '草稿':   [{ label:'详情', color:P, x:16 }, { label:'编辑', color:P, x:52 }],
      '已到期': [{ label:'详情', color:P, x:16 }],
      '已终止': [{ label:'详情', color:P, x:16 }],
    };
    return map[status] || [{ label:'详情', color:P, x:16 }];
  }

  const rows = [
    { id:'HT2026030001', client:'万科物业服务集团', name:'2026年度桶装水采购框架协议',      ctype:'框架', status:'已生效', total:'¥580,000.00',    ordered:'¥226,800.00', sales:'王明', start:'2026-01-01', end:'2026-12-31' },
    { id:'HT2026030002', client:'保利物业服务',     name:'2026 Q1 清洁用品一次性采购合同',  ctype:'具体', status:'已生效', total:'¥128,500.00',   ordered:'¥128,500.00', sales:'李娜', start:'2026-02-15', end:'2026-03-15' },
    { id:'HT2026040001', client:'金地物业',         name:'2026年度安防设备维护服务框架协议', ctype:'框架', status:'已生效', total:'¥1,200,000.00', ordered:'¥432,000.00', sales:'张涛', start:'2026-03-01', end:'2027-02-28' },
    { id:'HT2026040002', client:'中海物业',         name:'2026年办公用品采购框架协议',       ctype:'框架', status:'草稿',   total:'¥350,000.00',   ordered:'¥0.00',       sales:'刘芳', start:'2026-04-15', end:'2026-10-31' },
    { id:'HT2026040003', client:'融创服务',         name:'2026 Q2 园林绿化耗材一次采购',    ctype:'具体', status:'已生效', total:'¥86,600.00',    ordered:'¥86,600.00',  sales:'陈强', start:'2026-04-01', end:'—'          },
    { id:'HT2025090005', client:'万科物业服务集团', name:'2025年度桶装水采购框架协议',       ctype:'框架', status:'已到期', total:'¥450,000.00',   ordered:'¥435,200.00', sales:'王明', start:'2025-01-01', end:'2025-12-31' },
    { id:'HT2026020008', client:'保利物业服务',     name:'2026年消防设备维护合作框架',       ctype:'框架', status:'已终止', total:'¥680,000.00',   ordered:'¥120,000.00', sales:'李娜', start:'2026-02-01', end:'2027-01-31' },
    { id:'HT2026050001', client:'金地物业',         name:'2026 Q3 办公耗材采购',            ctype:'具体', status:'草稿',   total:'¥42,800.00',    ordered:'¥0.00',       sales:'张涛', start:'2026-06-01', end:'—'          },
  ];

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

    // 左冻结：合同编号
    const leftFrozen = makeVCol(CW.id, '合同编号', rows.map(function(r) { return function() { return makeLinkCell(CW.id, r.id); }; }));
    leftFrozen.name = 'LeftFrozen'; leftFrozen.fills = solid(C.white);
    leftFrozen.effects = [SHADOW_L]; leftFrozen.x = 0; leftFrozen.y = 0;
    wrapper.appendChild(leftFrozen);

    // 右冻结：操作
    const rightFrozen = makeVCol(CW.ops, '操作', rows.map(function(r) { return function() { return makeActionCell(CW.ops, getOps(r.status)); }; }));
    rightFrozen.name = 'RightFrozen'; rightFrozen.fills = solid(C.white);
    rightFrozen.effects = [SHADOW_R]; rightFrozen.x = TBL_W - CW.ops; rightFrozen.y = 0;
    wrapper.appendChild(rightFrozen);

    // 滚动条
    const sbTrack = figma.createFrame(); sbTrack.name = 'ScrollbarTrack';
    sbTrack.resize(TBL_W, SCROLLBAR_H); sbTrack.fills = solid(hex('#FAFAFA'));
    sbTrack.x = 0; sbTrack.y = TABLE_CONTENT_H; sbTrack.clipsContent = false;
    sbTrack.appendChild(rect(TBL_W, 1, hex('#EDEDED'), { x:0, y:0 }));
    sbTrack.appendChild(rect(Math.round(TBL_W * 0.28), 8, hex('#D8D8D8'), { r:4, x:CW.id, y:4 }));
    sbTrack.appendChild(rect(TBL_W, 1, hex('#EDEDED'), { x:0, y:SCROLLBAR_H - 1 }));
    wrapper.appendChild(sbTrack);
    return wrapper;
  }

  // ── 分页器 ────────────────────────────────────────────────────────────
  function buildFullPagination(parent, y, total, currentPage, pageCount) {
    const pRow = figma.createFrame();
    pRow.name = 'PaginationRow'; pRow.fills = [];
    pRow.layoutMode = 'HORIZONTAL';
    pRow.primaryAxisSizingMode = 'AUTO'; pRow.counterAxisSizingMode = 'AUTO';
    pRow.itemSpacing = 8; pRow.counterAxisAlignItems = 'CENTER';

    const psBox = figma.createFrame();
    psBox.name = 'PageSize'; psBox.resize(90, 32); psBox.cornerRadius = 2; psBox.clipsContent = false;
    psBox.fills = solid(C.white);
    psBox.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    psBox.strokeWeight = 1; psBox.strokeAlign = 'INSIDE';
    psBox.layoutMode = 'HORIZONTAL'; psBox.primaryAxisSizingMode = 'FIXED'; psBox.counterAxisSizingMode = 'FIXED';
    psBox.paddingLeft = 10; psBox.paddingRight = 8; psBox.paddingTop = 5; psBox.paddingBottom = 5;
    psBox.primaryAxisAlignItems = 'SPACE_BETWEEN'; psBox.counterAxisAlignItems = 'CENTER';
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
      const b = figma.createFrame(); b.name = 'PgBtn/' + key;
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
      var isSel = p === currentPage;
      const btn = figma.createFrame(); btn.name = 'PgBtn/' + p;
      btn.layoutMode = 'HORIZONTAL'; btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER';
      btn.primaryAxisSizingMode = 'FIXED'; btn.counterAxisSizingMode = 'FIXED';
      btn.resize(32, 32); btn.cornerRadius = 2;
      if (isSel) { btn.fills = solid(C.primary); btn.strokes = []; }
      else { btn.fills = solid(C.white); btn.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }]; btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE'; }
      const tP = figma.createText();
      tP.fontName = { family:'PingFang SC', style:'Regular' }; tP.fontSize = 14;
      tP.lineHeight = { value:22, unit:'PIXELS' }; tP.characters = String(p);
      tP.fills = isSel ? solid(C.white) : [{ type:'SOLID', color:C.black, opacity:0.85 }];
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
    pRow.x = CARD_W - PAD - pRow.width; pRow.y = y;
  }

  // ── 侧边栏 ────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64); area.fills = solid(C.sidebarBg); area.clipsContent = false;
    const box = rect(32, 32, C.primary, { r:6, x:24, y:16 });
    area.appendChild(box);
    const tM = text('M', C.white, 14, { style:'Medium', lh:20 });
    tM.x = 24 + Math.round((32 - tM.width) / 2); tM.y = 22;
    area.appendChild(tM);
    // 主标题 16px Medium
    area.appendChild(text('Mall 管理后台', C.white, 16, { style:'Medium', lh:22, x:64, y:12 }));
    // 英文副标题 7px 60%
    area.appendChild(text('MALL MANAGEMENT', C.white, 7, { lh:10, a:0.6, x:64, y:38 }));
    return area;
  }
  function makeSidebarDivider() {
    const w = figma.createFrame(); w.name = 'SidebarDivider'; w.resize(208, 1); w.fills = []; w.clipsContent = false;
    w.appendChild(rect(160, 1, C.white, { a:0.08, x:24, y:0 }));
    return w;
  }
  // state: 'active' | 'expanded' | 'collapsed' | 'inactive'
  function makeSidebarItem(label, level, state, iconKey) {
    var bgColor = level === 2 ? C.sidebarSub : C.sidebarBg;
    var isActive   = state === 'active';
    var isExpanded = state === 'expanded';
    var op = (isActive || isExpanded) ? 1 : 0.5;
    const row = figma.createFrame();
    row.name = 'L' + level + '·' + label;
    row.resize(208, 48); row.fills = solid(bgColor); row.opacity = op; row.clipsContent = false;
    // L1 图标
    if (level === 1 && iconKey) {
      const ic = icon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }
    // 文字
    var textX = level === 1 ? 52 : 40;
    row.appendChild(text(label, C.white, 14, { lh:22, x:textX, y:13 }));
    // L1 折叠箭头（展开用 PutAway-Arrow，收起用 DropDown-Arrow）
    if (level === 1) {
      var arrowKey = isExpanded ? 'PutAway-Arrow' : 'DropDown-Arrow';
      const arr = icon(arrowKey, 12, C.white, 1);
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

    // 商城运营（L1 collapsed）
    s.appendChild(makeSidebarItem('商城运营', 1, 'collapsed', 'bar-chart-2'));

    // 销售管理（L1 expanded，active parent）
    s.appendChild(makeSidebarItem('销售管理', 1, 'expanded', 'briefcase'));
    s.appendChild(makeSidebarItem('合同管理', 2, 'active',   null));
    s.appendChild(makeSidebarItem('客户管理', 2, 'inactive', null));
    s.appendChild(makeSidebarItem('报价单',   2, 'inactive', null));

    s.appendChild(makeSidebarDivider());

    // 系统管理（L1 collapsed）
    s.appendChild(makeSidebarItem('系统管理', 1, 'collapsed', 'settings'));

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
    const rs = totalW - 24 - 223;
    [['search', 0], ['download', 40], ['bell', 80]].forEach(function(pair) {
      var ic = icon(pair[0], 16, C.black, 0.65);
      if (ic) { ic.x = rs + pair[1]; ic.y = 16; bar.appendChild(ic); }
    });
    bar.appendChild(rect(1, 16, C.black, { a:0.10, x:rs + 112, y:16 }));
    const avatar = figma.createEllipse(); avatar.resize(24, 24);
    avatar.x = rs + 129; avatar.y = 12; avatar.fills = solid(C.primaryL20);
    bar.appendChild(avatar);
    bar.appendChild(text('总', C.white, 12, { lh:18, x:rs + 135, y:15 }));
    bar.appendChild(text('碧小园', C.black, 14, { lh:22, a:0.85, x:rs + 161, y:13 }));
    const icArr = icon('Arrow-Open', 16, C.black, 0.65);
    if (icArr) { icArr.x = rs + 207; icArr.y = 16; bar.appendChild(icArr); }
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

  root.appendChild(makeSidebar(CANVAS_H));

  const main = figma.createFrame();
  main.name = '主区域'; main.resize(MAIN_W, CANVAS_H); main.fills = []; main.x = SIDE_W; main.y = 0;
  root.appendChild(main);

  main.appendChild(makeHeaderBar(MAIN_W));

  const breadBar = makeBreadcrumbBar(MAIN_W, ['首页', '销售管理', '合同管理']);
  breadBar.x = 0; breadBar.y = NAV_H; main.appendChild(breadBar);

  const cardY = NAV_H + TITLE_H + OUTER_PAD;
  const mainCard = figma.createFrame();
  mainCard.name = '内容卡片'; mainCard.resize(CARD_W, CARD_H);
  mainCard.fills = solid(C.white); mainCard.cornerRadius = 8;
  mainCard.clipsContent = false; mainCard.x = OUTER_PAD; mainCard.y = cardY;
  main.appendChild(mainCard);

  // Row 0：合同编号 | 客户名称 | 合同类型（满3列）
  addFilter(mainCard, '合同编号', 0, 0, 'text');
  addFilter(mainCard, '客户名称', 1, 0, 'text');
  addFilter(mainCard, '合同类型', 2, 0, 'select');

  // Row 1：合同状态 | 销售人员 | 签订日期（满3列）
  addFilter(mainCard, '合同状态', 0, 1, 'select');
  addFilter(mainCard, '销售人员', 1, 1, 'select');
  addFilter(mainCard, '签订日期', 2, 1, 'date');

  // 按钮行（新行，查询+重置）
  buildFilterActions(mainCard, FILTER_ACT_Y);

  // 工具栏（仅右侧按钮）
  buildTableToolbar(mainCard, TOOLBAR_Y);

  // 冻结表格
  const frozenTable = buildFrozenTable();
  frozenTable.x = PAD; frozenTable.y = TBL_Y;
  mainCard.appendChild(frozenTable);

  // 分页
  buildFullPagination(mainCard, PAGER_Y, 8, 1, 1);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
