// ── 合同管理列表页 v10 ─────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-22
// v10 修正（基于 v9）:
//   · DateRange / AmountRange 改为单框 [图标][开始][至][结束] w=255
//   · 按钮定位改用 auto-layout 容器整体右对齐
//   · 合同金额区间调整至 COL_X[1]
// Canvas 1440 × 864

const ICONS = {
  // ── BeP 自定义图标 ──────────────────────────────────────────────────
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "Arrow-Open":     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.9194 6.375C19.7579 6.375 20.2241 7.34493 19.7002 7.99969L12.7809 16.6489C12.3805 17.1493 11.6195 17.1493 11.2191 16.6489L4.29975 7.99969C3.77594 7.34493 4.24212 6.375 5.08062 6.375H18.9194Z" fill="currentColor"/></svg>`,
  "Switch":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0142 3.86587C14.7138 3.67557 14.3112 3.7211 14.0618 3.99194L13.9794 4.0993C13.7891 4.39968 13.8346 4.80229 14.1055 5.05171L17.5785 8.25H4.50004L4.36523 8.26209C4.01536 8.32559 3.75004 8.63181 3.75004 9C3.75004 9.41422 4.08583 9.75 4.50004 9.75H19.5L19.6318 9.73918C20.2232 9.63982 20.4771 8.88024 20.0081 8.4483L15.1216 3.9483L15.0142 3.86587ZM20.25 15C20.25 14.5858 19.9143 14.25 19.5 14.25H4.50004L4.3683 14.2608C3.77691 14.3602 3.52295 15.1198 3.99198 15.5517L8.87851 20.0517L8.98587 20.1341C9.28625 20.3244 9.68886 20.2789 9.93827 20.0081L10.0207 19.9007C10.211 19.6003 10.1655 19.1977 9.89463 18.9483L6.42154 15.75H19.5L19.6349 15.7379C19.9847 15.6744 20.25 15.3682 20.25 15Z" fill="currentColor"/></svg>`,
  "Date":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.99644 3.44662C8.93293 3.09675 8.62671 2.83144 8.25852 2.83144C7.84431 2.83144 7.50852 3.16722 7.50852 3.58144V4.70223H5.45233C4.00491 4.70223 2.83154 5.87559 2.83154 7.32302V18.5478C2.83154 19.9952 4.00491 21.1686 5.45233 21.1686H18.5479C19.9953 21.1686 21.1687 19.9952 21.1687 18.5478V7.32302C21.1687 5.87559 19.9953 4.70223 18.5479 4.70223H16.4917V3.58144L16.4796 3.44662C16.4161 3.09675 16.1099 2.83144 15.7417 2.83144C15.3275 2.83144 14.9917 3.16722 14.9917 3.58144V4.70223H9.00852V3.58144L8.99644 3.44662ZM7.50852 6.20223V7.32302L7.5206 7.45783C7.58411 7.8077 7.89033 8.07302 8.25852 8.07302C8.67273 8.07302 9.00852 7.73723 9.00852 7.32302V6.20223H14.9917V7.32302L15.0038 7.45783C15.0673 7.8077 15.3735 8.07302 15.7417 8.07302C16.1559 8.07302 16.4917 7.73723 16.4917 7.32302V6.20223H18.5479C19.1669 6.20223 19.6687 6.70402 19.6687 7.32302V18.5478C19.6687 19.1668 19.1669 19.6686 18.5479 19.6686H5.45233C4.83334 19.6686 4.33154 19.1668 4.33154 18.5478V7.32302C4.33154 6.70402 4.83334 6.20223 5.45233 6.20223H7.50852ZM16.6771 10.3146C17.0913 10.3146 17.4271 10.6504 17.4271 11.0646C17.4271 11.4328 17.1618 11.739 16.8119 11.8025L16.6771 11.8146H7.32312C6.90891 11.8146 6.57312 11.4788 6.57312 11.0646C6.57312 10.6964 6.83844 10.3902 7.18831 10.3267L7.32312 10.3146H16.6771Z" fill="currentColor"/></svg>`,
  "Add":            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
  // ── Feather 图标 ─────────────────────────────────────────────────────
  "sidebar":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "package":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 9.36925L7.5 4.1994" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21 15.9436V7.97466C20.9993 7.26364 20.6182 6.60689 20 6.25138L13 2.26691C12.3812 1.91103 11.6188 1.91103 11 2.26691L4 6.25138C3.38183 6.60689 3.00073 7.26364 3 7.97466V15.9436C3.00073 16.6546 3.38183 17.3114 4 17.6669L11 21.6514C11.6188 22.0072 12.3812 22.0072 13 21.6514L20 17.6669C20.6182 17.3114 20.9993 16.6546 21 15.9436Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.27002 6.93872L12 11.9691L20.73 6.93872" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V11.9591" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "archive":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8V21H3V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="3" width="22" height="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bell":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "download":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-left":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-right":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
  function solid(color, a=1) { return [{ type:'SOLID', color, opacity:a }]; }

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
  const SIDE_W = 208,   MAIN_W  = 1232;
  const NAV_H  = 48,    TITLE_H = 48;
  const OUTER_PAD = 16, PAD = 24;
  const CARD_W = 1200,  TBL_W = 1152;
  const ROW_H  = 48,    HEADER_H = 48;
  const NUM_ROWS = 6;

  // 布局规则：最后一行未满3列 → 按钮与该行同行（y=168=row3）
  // 最后一行满3列 → 按钮单独下一行
  // 当前：row3只有合同金额1格，按钮同行
  const FILTER_ACT_Y    = 168;   // row3 顶部 y（24+3×48=168）
  const TOOLBAR_Y       = 216;   // 168+32+16=216
  const TBL_Y           = 264;   // 216+48=264
  const TABLE_CONTENT_H = HEADER_H + NUM_ROWS * ROW_H;   // 336
  const SCROLLBAR_H     = 16;
  const TABLE_WRAPPER_H = TABLE_CONTENT_H + SCROLLBAR_H; // 352
  const PAGER_Y         = TBL_Y + TABLE_WRAPPER_H + 16;  // 632
  const CARD_H          = PAGER_Y + 32 + 24;             // 688

  const SHADOW_FREEZE_LEFT  = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:2,y:0},  radius:4, spread:-1 };
  const SHADOW_FREEZE_RIGHT = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:-2,y:0}, radius:4, spread:-1 };

  // ── 基础工厂 ──────────────────────────────────────────────────────────
  function rect(w, h, color, opts={}) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a||1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    return r;
  }
  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? { value:opts.lh, unit:'PIXELS' } : { unit:'AUTO' };
    t.characters = chars;
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function icon(key, size, color, opacity=1) {
    const svg = ICONS[key];
    if (!svg) { console.warn('icon not found: '+key); return null; }
    const node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(n => n.fills  && n.fills.length  > 0 && n.fills[0].type==='SOLID').forEach(n => { n.fills   = solid(color,1); });
    node.findAll(n => n.strokes && n.strokes.length > 0).forEach(n => { n.strokes = solid(color,1); });
    return node;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  标准组件函数（components.md 规范）
  // ─────────────────────────────────────────────────────────────────────

  // ── Button（cornerRadius=4，HORIZONTAL auto-layout）────────────────
  // type: 'primary' | 'secondary'
  function makeBtn(label, type, iconNode) {
    if (type === undefined) { type = 'primary'; }
    const PX = 16, PY = 5;
    const btn = figma.createFrame();
    btn.name = 'Btn/' + type + '/' + (label || 'icon');
    btn.cornerRadius = 4;
    btn.clipsContent = false;
    btn.layoutMode            = 'HORIZONTAL';
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
    if (iconNode) { iconNode.resize(16,16); iconNode.layoutAlign='CENTER'; btn.appendChild(iconNode); }
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

  // ── Input（HORIZONTAL auto-layout，SPACE_BETWEEN，paddingLeft/Right=12）
  function makeInput(placeholder, x, y, width=255) {
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

  // ── Select（HORIZONTAL auto-layout，paddingRight=8，DropDown-Arrow 右侧）
  function makeSelect(placeholder, x, y, width=255) {
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

  // ── DateRange / AmountRange 单框 [图标?][开始][至][结束] w=255 ──────
  function makeDateRange(startPH, endPH, x, y, withIcon) {
    if (withIcon === undefined) { withIcon = true; }
    const wrap = figma.createFrame();
    wrap.name = withIcon ? 'DateRange/default' : 'AmountRange/default';
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
    if (withIcon) {
      const ic = icon('Date', 16, C.black, 0.25);
      if (ic) { ic.layoutAlign = 'CENTER'; wrap.appendChild(ic); }
    }
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

  // ── 区间筛选行（单框，w=255）─────────────────────────────────────────
  function addRangeFilter(parent, label, colX, rowIdx, withIcon) {
    if (withIcon === undefined) { withIcon = true; }
    const y0 = 24 + rowIdx * 48;
    const lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = label;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    lbl.textAutoResize = 'HEIGHT'; lbl.resize(LABEL_W, 22);
    lbl.textAlignHorizontal = 'RIGHT';
    lbl.x = colX; lbl.y = y0 + 5;
    parent.appendChild(lbl);
    const inputX = colX + LABEL_W + LABEL_GAP;
    const startPH = withIcon ? '开始日期' : '最小金额';
    const endPH   = withIcon ? '结束日期' : '最大金额';
    parent.appendChild(makeDateRange(startPH, endPH, inputX, y0, withIcon));
  }

  // ─────────────────────────────────────────────────────────────────────
  //  侧边栏（v8 相同，锁定规范）
  // ─────────────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64); area.fills = solid(C.sidebarBg);
    area.clipsContent = false;
    const box = rect(32, 32, C.primary, { r:6, x:24, y:16 });
    area.appendChild(box);
    const tSC = text('SC', C.white, 14, { style:'Medium', lh:20 });
    tSC.x = 24 + Math.round((32-tSC.width)/2); tSC.y = 16 + 6;
    area.appendChild(tSC);
    area.appendChild(text('供应链管理平台', C.white, 14, { style:'Medium', lh:20, x:64, y:14 }));
    area.appendChild(text('SUPPLY CHAIN MGMT', C.white, 6, { lh:10, a:0.6, x:64, y:38 }));
    return area;
  }
  function makeSidebarItem(label, level, state, iconKey=null, hasChildren=false) {
    const bg = level===2 ? C.sidebarSub : C.sidebarBg;
    const isActive = state==='active'||state==='expanded';
    const op = isActive ? 1 : 0.5;
    const row = figma.createFrame();
    row.name=`L${level}·${label}`; row.resize(208,48); row.fills=solid(bg); row.opacity=op; row.clipsContent=false;
    if (level===1&&iconKey) { const ic=icon(iconKey,16,C.white,1); if(ic){ic.x=24;ic.y=16;row.appendChild(ic);} }
    row.appendChild(text(label, C.white, 14, { lh:22, x:level===1?52:40, y:13 }));
    if (hasChildren) {
      const arr=icon(state==='expanded'?'PutAway-Arrow':'DropDown-Arrow',12,C.white,1);
      if(arr){arr.x=184;arr.y=18;row.appendChild(arr);}
    }
    return row;
  }
  function makeSidebarDivider() {
    const w=figma.createFrame(); w.name='SidebarDivider'; w.resize(208,1); w.fills=[]; w.clipsContent=false;
    w.appendChild(rect(160,1,C.white,{a:0.08,x:24,y:0})); return w;
  }
  function makeSidebar(height) {
    const s=figma.createFrame(); s.name='侧边栏';
    s.layoutMode='VERTICAL'; s.itemSpacing=0;
    s.primaryAxisSizingMode='FIXED'; s.counterAxisSizingMode='FIXED';
    s.resize(208,height); s.fills=solid(C.sidebarBg); s.clipsContent=false;
    s.appendChild(makeSidebarLogo());
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('订单管理',1,'inactive','package',true));
    s.appendChild(makeSidebarItem('销售管理',1,'expanded','briefcase',true));
    s.appendChild(makeSidebarItem('合同管理',2,'active',null,false));
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('基础档案',1,'inactive','archive',true));
    return s;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  页头（components.md 规范修正版）
  // ─────────────────────────────────────────────────────────────────────
  function makeHeaderBar(totalW) {
    const bar = figma.createFrame();
    bar.name='HeaderBar'; bar.resize(totalW,48); bar.fills=solid(C.white); bar.clipsContent=false;
    bar.appendChild(rect(totalW,1,C.black,{a:0.10,x:0,y:47}));

    // 左：sidebar 收起图标（x=24）
    const icSide = icon('sidebar',16,C.black,0.65);
    if (icSide) { icSide.x=24; icSide.y=16; bar.appendChild(icSide); }

    // 左：租户切换框（x=64，标准间距；Switch 图标在右）
    const sw = figma.createFrame();
    sw.name='租户切换'; sw.resize(200,32); sw.x=64; sw.y=8;
    sw.cornerRadius=2; sw.clipsContent=false;
    sw.fills=solid(C.white);
    sw.strokes=[{type:'SOLID',color:C.black,opacity:0.15}];
    sw.strokeWeight=1; sw.strokeAlign='INSIDE';
    sw.layoutMode='HORIZONTAL'; sw.primaryAxisSizingMode='FIXED'; sw.counterAxisSizingMode='FIXED';
    sw.paddingLeft=12; sw.paddingRight=8; sw.paddingTop=5; sw.paddingBottom=5;
    sw.primaryAxisAlignItems='SPACE_BETWEEN'; sw.counterAxisAlignItems='CENTER';
    const ph=figma.createText();
    ph.fontName={family:'PingFang SC',style:'Regular'}; ph.fontSize=14;
    ph.lineHeight={value:22,unit:'PIXELS'}; ph.characters='租户切换';
    ph.fills=[{type:'SOLID',color:C.black,opacity:0.25}];
    ph.textAutoResize='WIDTH_AND_HEIGHT'; ph.layoutAlign='CENTER';
    sw.appendChild(ph);
    const icSw=icon('Switch',14,C.black,0.45);
    if (icSw) { icSw.layoutAlign='CENTER'; sw.appendChild(icSw); }
    bar.appendChild(sw);

    // 右区域（从 rightStart 开始，总宽 223px）
    const rightStart = totalW - 24 - 223;
    [['search',0],['download',40],['bell',80]].forEach(([key,dx])=>{
      const ic=icon(key,16,C.black,0.65);
      if(ic){ic.x=rightStart+dx;ic.y=16;bar.appendChild(ic);}
    });
    bar.appendChild(rect(1,16,C.black,{a:0.10,x:rightStart+112,y:16}));
    const avatar=figma.createEllipse(); avatar.resize(24,24);
    avatar.x=rightStart+129; avatar.y=12; avatar.fills=solid(C.primaryL20);
    bar.appendChild(avatar);
    bar.appendChild(text('碧小园',C.black,14,{lh:22,a:0.85,x:rightStart+161,y:13}));
    // Arrow-Open：16×16（标准规范）
    const icArr=icon('Arrow-Open',16,C.black,0.65);
    if(icArr){icArr.x=rightStart+207;icArr.y=16;bar.appendChild(icArr);}
    return bar;
  }

  function makeBreadcrumbBar(totalW, crumbs=[]) {
    const bar=figma.createFrame();
    bar.name='BreadcrumbBar'; bar.resize(totalW,48); bar.fills=solid(C.white); bar.clipsContent=false;
    bar.appendChild(rect(totalW,1,C.black,{a:0.10,x:0,y:47}));
    const currentTitle=crumbs[crumbs.length-1]||'';
    bar.appendChild(text(currentTitle,C.black,16,{style:'Medium',lh:24,a:0.85,x:24,y:12}));
    let cx=104;
    crumbs.forEach((crumb,i)=>{
      const t=text(crumb,C.black,14,{lh:22,a:0.65,x:cx,y:13});
      bar.appendChild(t); cx+=t.width;
      if(i<crumbs.length-1){
        const arr=icon('chevron-right',12,C.black,0.45);
        if(arr){arr.x=cx+4;arr.y=18;bar.appendChild(arr);cx+=20;}
      }
    });
    return bar;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  筛选区（10 个字段，4 行，全部使用标准组件）
  // ─────────────────────────────────────────────────────────────────────
  const LABEL_W = 112, LABEL_GAP = 12, INPUT_W = 255;
  const COL_X   = [24, 411, 798];

  function addFilter(parent, label, col, rowIdx, fieldType) {
    const x0 = COL_X[col], y0 = 24 + rowIdx*48;
    const lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = label;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    lbl.textAutoResize = 'HEIGHT'; lbl.resize(LABEL_W, 22);
    lbl.textAlignHorizontal = 'RIGHT';
    lbl.x = x0; lbl.y = y0 + 5;
    parent.appendChild(lbl);
    const inputX = x0 + LABEL_W + LABEL_GAP;
    if (fieldType==='select') {
      parent.appendChild(makeSelect('请选择', inputX, y0, INPUT_W));
    } else {
      parent.appendChild(makeInput('请输入', inputX, y0, INPUT_W));
    }
  }

  function buildFilterActions(parent, y) {
    // auto-layout 容器整体右对齐，顺序：查询 | 重置 | 收起^
    const row = figma.createFrame();
    row.name = 'FilterActions'; row.fills = []; row.clipsContent = false;
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 8; row.counterAxisAlignItems = 'CENTER';
    row.appendChild(makeBtn('查询', 'primary'));
    row.appendChild(makeBtn('重置', 'secondary'));
    const tC = figma.createText();
    tC.fontName = { family:'PingFang SC', style:'Regular' };
    tC.fontSize = 14; tC.lineHeight = { value:22, unit:'PIXELS' };
    tC.characters = '收起';
    tC.fills = solid(C.primary);
    tC.textAutoResize = 'WIDTH_AND_HEIGHT'; tC.layoutAlign = 'CENTER';
    row.appendChild(tC);
    const arrUp = icon('PutAway-Arrow', 16, C.primary, 0.85);
    if (arrUp) { arrUp.layoutAlign = 'CENTER'; row.appendChild(arrUp); }
    parent.appendChild(row);
    row.x = CARD_W - PAD - row.width; row.y = y;
  }

  function buildTableToolbar(parent, y) {
    parent.appendChild(text('合同记录 6 条', C.black, 14, { lh:22, a:0.65, x:PAD, y:y+5 }));
    // auto-layout 容器整体右对齐，顺序：导出 | 新增合同
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

  // ─────────────────────────────────────────────────────────────────────
  //  表格单元格工厂（v8 相同）
  // ─────────────────────────────────────────────────────────────────────
  function makeTableHeader(colW, label) {
    const cell = figma.createFrame();
    cell.name='TableHeader'; cell.resize(colW,HEADER_H);
    cell.fills=[{type:'SOLID',color:C.black,opacity:0.04}]; cell.clipsContent=false;
    const t=figma.createText();
    t.fontName={family:'PingFang SC',style:'Medium'}; t.fontSize=14;
    t.lineHeight={value:22,unit:'PIXELS'}; t.characters=label;
    t.fills=[{type:'SOLID',color:C.black,opacity:0.85}];
    t.textAutoResize='NONE'; t.resize(colW-32,22); t.textTruncation='ENDING';
    t.x=16; t.y=13; cell.appendChild(t); return cell;
  }
  function makeTableCell(colW, content, truncate=false) {
    const cell=figma.createFrame();
    cell.name='TableCell'; cell.resize(colW,ROW_H); cell.fills=solid(C.white); cell.clipsContent=false;
    cell.appendChild(rect(colW,1,C.black,{a:0.06,x:0,y:ROW_H-1}));
    const t=figma.createText();
    t.fontName={family:'PingFang SC',style:'Regular'}; t.fontSize=14;
    t.lineHeight={value:22,unit:'PIXELS'}; t.characters=content;
    t.fills=[{type:'SOLID',color:C.black,opacity:0.65}];
    t.textAutoResize='NONE'; t.resize(colW-32,22);
    if(truncate) t.textTruncation='ENDING';
    t.x=16; t.y=13; cell.appendChild(t); return cell;
  }
  function makeLinkCell(colW, content) {
    const cell=figma.createFrame();
    cell.name='LinkCell'; cell.resize(colW,ROW_H); cell.fills=solid(C.white); cell.clipsContent=false;
    cell.appendChild(rect(colW,1,C.black,{a:0.06,x:0,y:ROW_H-1}));
    const t=figma.createText();
    t.fontName={family:'PingFang SC',style:'Regular'}; t.fontSize=14;
    t.lineHeight={value:22,unit:'PIXELS'}; t.characters=content;
    t.fills=solid(C.primary);
    t.textAutoResize='NONE'; t.resize(colW-32,22);
    t.x=16; t.y=13; cell.appendChild(t); return cell;
  }
  function makeTagCell(colW, label, bg, txtColor, opacity=1) {
    const cell=figma.createFrame();
    cell.name='TagCell'; cell.resize(colW,ROW_H); cell.fills=solid(C.white); cell.clipsContent=false;
    cell.appendChild(rect(colW,1,C.black,{a:0.06,x:0,y:ROW_H-1}));
    const tLabel=figma.createText();
    tLabel.fontName={family:'PingFang SC',style:'Regular'}; tLabel.fontSize=12;
    tLabel.lineHeight={value:20,unit:'PIXELS'}; tLabel.characters=label;
    tLabel.fills=solid(txtColor,opacity); tLabel.textAutoResize='WIDTH_AND_HEIGHT';
    tLabel.x=8; tLabel.y=1;
    const tagW=tLabel.width+16,tagH=22;
    const tag=figma.createFrame();
    tag.name='tag'; tag.cornerRadius=2; tag.clipsContent=false;
    tag.resize(tagW,tagH); tag.fills=solid(bg);
    tag.x=8; tag.y=Math.round((ROW_H-tagH)/2);
    tag.appendChild(tLabel); cell.appendChild(tag); return cell;
  }
  function makeAmountCell(colW, amount) {
    const cell=figma.createFrame();
    cell.name='AmountCell'; cell.resize(colW,ROW_H); cell.fills=solid(C.white); cell.clipsContent=false;
    cell.appendChild(rect(colW,1,C.black,{a:0.06,x:0,y:ROW_H-1}));
    const t=figma.createText();
    t.fontName={family:'PingFang SC',style:'Regular'}; t.fontSize=14;
    t.lineHeight={value:22,unit:'PIXELS'}; t.characters=amount;
    t.fills=[{type:'SOLID',color:C.black,opacity:0.65}];
    t.textAutoResize='WIDTH_AND_HEIGHT'; t.x=0; t.y=13;
    cell.appendChild(t); t.x=colW-t.width-16; return cell;
  }
  function makeActionCell(colW, ops) {
    const cell=figma.createFrame();
    cell.name='ActionCell'; cell.resize(colW,ROW_H); cell.fills=solid(C.white); cell.clipsContent=false;
    cell.appendChild(rect(colW,1,C.black,{a:0.06,x:0,y:ROW_H-1}));
    ops.forEach(({label,color,x})=>{
      const btn=figma.createText();
      btn.fontName={family:'PingFang SC',style:'Regular'}; btn.fontSize=14;
      btn.lineHeight={value:22,unit:'PIXELS'}; btn.characters=label;
      btn.fills=solid(color); btn.x=x; btn.y=13; cell.appendChild(btn);
    }); return cell;
  }
  function makeVCol(colW, label, cellBuilders) {
    const col=figma.createFrame(); col.name=label;
    col.layoutMode='VERTICAL'; col.itemSpacing=0;
    col.primaryAxisSizingMode='AUTO'; col.counterAxisSizingMode='FIXED';
    col.resize(colW,HEADER_H+cellBuilders.length*ROW_H); col.fills=[];
    col.appendChild(makeTableHeader(colW,label));
    cellBuilders.forEach(b=>col.appendChild(b())); return col;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  数据 & 配置（v8 相同）
  // ─────────────────────────────────────────────────────────────────────
  const STATUS_CFG = {
    '已生效':    {bg:C.successL90,txt:C.success,a:1},
    '待财务审核':{bg:C.warningL90,txt:C.warning,a:1},
    '草稿':      {bg:C.tagGrayBg, txt:C.black,  a:0.65},
    '已终止':    {bg:C.dangerL90, txt:C.danger,  a:1},
    '已到期':    {bg:C.tagGrayBg, txt:C.black,  a:0.45},
    '审核驳回':  {bg:C.dangerL90, txt:C.danger,  a:1},
  };
  const BLUE_TAG = {bg:C.primaryL90, txt:C.primary};

  function getOps(status) {
    const P=C.primary,G=C.green,R=C.red;
    const map={
      '待财务审核':[{label:'详情',color:P,x:16},{label:'查看BIP审批信息',color:P,x:60},{label:'财务通过',color:G,x:184},{label:'财务驳回',color:R,x:256}],
      '已生效':    [{label:'详情',color:P,x:16},{label:'终止',color:R,x:60}],
      '草稿':      [{label:'详情',color:P,x:16},{label:'编辑',color:P,x:60},{label:'提交审核',color:G,x:104}],
      '审核驳回':  [{label:'详情',color:P,x:16},{label:'编辑',color:P,x:60},{label:'提交审核',color:G,x:104}],
      '已终止':    [{label:'详情',color:P,x:16}],
      '已到期':    [{label:'详情',color:P,x:16}],
    };
    return map[status]||[{label:'详情',color:P,x:16}];
  }

  const rows = [
    {id:'HT202605180001',client:'碧桂园物业广州区域',name:'碧桂园物业广州区域综合服务合同',scene:'企业订单',ctype:'标准合同',  status:'待财务审核',bip:'BIP202605180021',total:'¥2,800,000.00',ordered:'¥1,500,000.00',sales:'王明（GH001）',start:'2026-05-18',end:'2027-05-17'},
    {id:'HT202605170002',client:'万科物业深圳公司',  name:'万科物业园区安全管理服务协议',  scene:'标准服务',ctype:'无金额合同',status:'已生效',   bip:'BIP202605170015',total:'¥0.00',        ordered:'¥0.00',        sales:'李华（GH002）',start:'2026-05-17',end:'2027-05-16'},
    {id:'HT202605160003',client:'龙湖物业重庆分公司',name:'龙湖物业重庆绿化养护服务合同',  scene:'企业订单',ctype:'标准合同',  status:'草稿',     bip:'-',             total:'¥480,000.00', ordered:'¥0.00',        sales:'张磊（GH003）',start:'2026-05-16',end:'2026-11-15'},
    {id:'HT202605150004',client:'保利物业北京区域',  name:'保利物业北京区域设备维护合同',  scene:'标准服务',ctype:'标准合同',  status:'审核驳回', bip:'BIP202605150008',total:'¥320,000.00', ordered:'¥0.00',        sales:'陈静（GH004）',start:'2026-05-15',end:'2026-11-14'},
    {id:'HT202605140005',client:'中海物业上海公司',  name:'中海物业上海区域清洁服务合同',  scene:'企业订单',ctype:'无金额合同',status:'已终止',   bip:'BIP202605140003',total:'¥0.00',        ordered:'¥0.00',        sales:'刘洋（GH005）',start:'2026-05-14',end:'2026-11-13'},
    {id:'HT202605130006',client:'金地物业西安分公司',name:'金地物业西安智能安防服务合同',  scene:'标准服务',ctype:'标准合同',  status:'已到期',   bip:'BIP202605130001',total:'¥150,000.00', ordered:'¥150,000.00',  sales:'赵敏（GH006）',start:'2025-05-13',end:'2026-05-12'},
  ];

  const CW = {id:148,client:160,name:220,scene:88,ctype:104,status:104,bip:160,total:144,ordered:144,sales:128,start:116,end:116,ops:320};

  // ─────────────────────────────────────────────────────────────────────
  //  带冻结表格（v8 相同）
  // ─────────────────────────────────────────────────────────────────────
  function buildFrozenTable() {
    const wrapper=figma.createFrame();
    wrapper.name='FrozenTable'; wrapper.resize(TBL_W,TABLE_WRAPPER_H);
    wrapper.fills=[]; wrapper.clipsContent=true;

    const allCols=figma.createFrame(); allCols.name='AllColumns';
    allCols.layoutMode='HORIZONTAL'; allCols.itemSpacing=0;
    allCols.primaryAxisSizingMode='AUTO'; allCols.counterAxisSizingMode='AUTO';
    allCols.fills=[]; allCols.x=0; allCols.y=0;
    allCols.appendChild(makeVCol(CW.id,     '合同编号',  rows.map(r=>()=>makeLinkCell(CW.id,r.id))));
    allCols.appendChild(makeVCol(CW.client, '客户名称',  rows.map(r=>()=>makeTableCell(CW.client,r.client))));
    allCols.appendChild(makeVCol(CW.name,   '合同名称',  rows.map(r=>()=>makeTableCell(CW.name,r.name,true))));
    allCols.appendChild(makeVCol(CW.scene,  '合同场景',  rows.map(r=>()=>makeTagCell(CW.scene, r.scene, BLUE_TAG.bg,BLUE_TAG.txt))));
    allCols.appendChild(makeVCol(CW.ctype,  '合同类型',  rows.map(r=>()=>makeTagCell(CW.ctype, r.ctype, BLUE_TAG.bg,BLUE_TAG.txt))));
    allCols.appendChild(makeVCol(CW.status, '合同状态',  rows.map(r=>()=>{ const c=STATUS_CFG[r.status]||STATUS_CFG['草稿']; return makeTagCell(CW.status,r.status,c.bg,c.txt,c.a); })));
    allCols.appendChild(makeVCol(CW.bip,    'BIP审批编号',rows.map(r=>()=>makeTableCell(CW.bip,r.bip))));
    allCols.appendChild(makeVCol(CW.total,  '合同总金额',rows.map(r=>()=>makeAmountCell(CW.total,r.total))));
    allCols.appendChild(makeVCol(CW.ordered,'已下单金额',rows.map(r=>()=>makeAmountCell(CW.ordered,r.ordered))));
    allCols.appendChild(makeVCol(CW.sales,  '销售人员',  rows.map(r=>()=>makeTableCell(CW.sales,r.sales))));
    allCols.appendChild(makeVCol(CW.start,  '生效日期',  rows.map(r=>()=>makeTableCell(CW.start,r.start))));
    allCols.appendChild(makeVCol(CW.end,    '到期日期',  rows.map(r=>()=>makeTableCell(CW.end,r.end))));
    allCols.appendChild(makeVCol(CW.ops,    '操作',      rows.map(r=>()=>makeActionCell(CW.ops,getOps(r.status)))));
    wrapper.appendChild(allCols);

    const leftFrozen=makeVCol(CW.id,'合同编号-冻结',rows.map(r=>()=>makeLinkCell(CW.id,r.id)));
    leftFrozen.name='LeftFrozen'; leftFrozen.fills=solid(C.white);
    leftFrozen.effects=[SHADOW_FREEZE_LEFT]; leftFrozen.x=0; leftFrozen.y=0;
    wrapper.appendChild(leftFrozen);

    const rightFrozen=makeVCol(CW.ops,'操作-冻结',rows.map(r=>()=>makeActionCell(CW.ops,getOps(r.status))));
    rightFrozen.name='RightFrozen'; rightFrozen.fills=solid(C.white);
    rightFrozen.effects=[SHADOW_FREEZE_RIGHT]; rightFrozen.x=TBL_W-CW.ops; rightFrozen.y=0;
    wrapper.appendChild(rightFrozen);

    // 水平滚动条
    const sbTrack=figma.createFrame(); sbTrack.name='ScrollbarTrack';
    sbTrack.resize(TBL_W,SCROLLBAR_H); sbTrack.fills=solid(hex('#FAFAFA'));
    sbTrack.x=0; sbTrack.y=TABLE_CONTENT_H; sbTrack.clipsContent=false;
    sbTrack.appendChild(rect(TBL_W,1,hex('#EDEDED'),{x:0,y:0}));
    sbTrack.appendChild(rect(Math.round(TBL_W*0.3),8,hex('#D8D8D8'),{r:4,x:16,y:4}));
    sbTrack.appendChild(rect(TBL_W,1,hex('#EDEDED'),{x:0,y:SCROLLBAR_H-1}));
    wrapper.appendChild(sbTrack);
    return wrapper;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  分页器（标准：itemSpacing=8，chevron 图标，DropDown-Arrow 16×16）
  // ─────────────────────────────────────────────────────────────────────
  function buildFullPagination(parent, y, total, currentPage, pageCount) {
    // 分页整体行：右对齐，使用 HORIZONTAL auto-layout 容器
    const pRow = figma.createFrame();
    pRow.name = 'PaginationRow';
    pRow.layoutMode = 'HORIZONTAL';
    pRow.primaryAxisSizingMode = 'AUTO'; pRow.counterAxisSizingMode = 'AUTO';
    pRow.itemSpacing = 8;
    pRow.counterAxisAlignItems = 'CENTER';
    pRow.fills = [];

    // 条数选择器（90×32，DropDown-Arrow 16×16，text black@0.85）
    const psBox = figma.createFrame();
    psBox.name='PageSize'; psBox.resize(90,32); psBox.cornerRadius=2; psBox.clipsContent=false;
    psBox.fills=solid(C.white);
    psBox.strokes=[{type:'SOLID',color:C.black,opacity:0.15}];
    psBox.strokeWeight=1; psBox.strokeAlign='INSIDE';
    psBox.layoutMode='HORIZONTAL'; psBox.primaryAxisSizingMode='FIXED'; psBox.counterAxisSizingMode='FIXED';
    psBox.paddingLeft=10; psBox.paddingRight=8; psBox.paddingTop=5; psBox.paddingBottom=5;
    psBox.primaryAxisAlignItems='SPACE_BETWEEN'; psBox.counterAxisAlignItems='CENTER';
    psBox.itemSpacing=4;
    const psT=figma.createText();
    psT.fontName={family:'PingFang SC',style:'Regular'}; psT.fontSize=14;
    psT.lineHeight={value:22,unit:'PIXELS'}; psT.characters='20条/页';
    psT.fills=[{type:'SOLID',color:C.black,opacity:0.85}];
    psT.textAutoResize='WIDTH_AND_HEIGHT'; psT.layoutAlign='CENTER';
    psBox.appendChild(psT);
    const psArr=icon('DropDown-Arrow',16,C.black,0.45);
    if(psArr){psArr.layoutAlign='CENTER';psBox.appendChild(psArr);}
    pRow.appendChild(psBox);

    // "共N条"
    const tTotal=figma.createText();
    tTotal.fontName={family:'PingFang SC',style:'Regular'}; tTotal.fontSize=14;
    tTotal.lineHeight={value:22,unit:'PIXELS'}; tTotal.characters=`共 ${total} 条`;
    tTotal.fills=[{type:'SOLID',color:C.black,opacity:0.65}];
    tTotal.textAutoResize='WIDTH_AND_HEIGHT'; tTotal.layoutAlign='CENTER';
    pRow.appendChild(tTotal);

    // 上一页箭头（chevron-left）
    function makePgArrow(key) {
      const b=figma.createFrame(); b.name=`PgArrow/${key}`;
      b.layoutMode='HORIZONTAL'; b.primaryAxisAlignItems='CENTER'; b.counterAxisAlignItems='CENTER';
      b.primaryAxisSizingMode='FIXED'; b.counterAxisSizingMode='FIXED';
      b.resize(32,32); b.cornerRadius=2;
      b.fills=solid(C.white);
      b.strokes=[{type:'SOLID',color:C.black,opacity:0.15}];
      b.strokeWeight=1; b.strokeAlign='INSIDE';
      const ic=icon(key,12,C.black,0.65);
      if(ic){ic.layoutAlign='CENTER';b.appendChild(ic);}
      return b;
    }
    pRow.appendChild(makePgArrow('chevron-left'));

    // 页码按钮
    for(let p=1;p<=pageCount;p++){
      const isSelected=p===currentPage;
      const btn=figma.createFrame(); btn.name=`PgBtn/${p}`;
      btn.layoutMode='HORIZONTAL'; btn.primaryAxisAlignItems='CENTER'; btn.counterAxisAlignItems='CENTER';
      btn.primaryAxisSizingMode='FIXED'; btn.counterAxisSizingMode='FIXED';
      btn.resize(32,32); btn.cornerRadius=2;
      if(isSelected){btn.fills=solid(C.primary);btn.strokes=[];}
      else{btn.fills=solid(C.white);btn.strokes=[{type:'SOLID',color:C.black,opacity:0.15}];btn.strokeWeight=1;btn.strokeAlign='INSIDE';}
      const t=figma.createText();
      t.fontName={family:'PingFang SC',style:'Regular'}; t.fontSize=14;
      t.lineHeight={value:22,unit:'PIXELS'}; t.characters=String(p);
      t.fills=isSelected?solid(C.white):[{type:'SOLID',color:C.black,opacity:0.85}];
      t.textAutoResize='WIDTH_AND_HEIGHT'; t.layoutAlign='CENTER';
      btn.appendChild(t); pRow.appendChild(btn);
    }

    // 下一页箭头（chevron-right）
    pRow.appendChild(makePgArrow('chevron-right'));

    // 跳转至 / 输入框 / 页
    const tGoto=figma.createText();
    tGoto.fontName={family:'PingFang SC',style:'Regular'}; tGoto.fontSize=14;
    tGoto.lineHeight={value:22,unit:'PIXELS'}; tGoto.characters='跳转至';
    tGoto.fills=[{type:'SOLID',color:C.black,opacity:0.65}];
    tGoto.textAutoResize='WIDTH_AND_HEIGHT'; tGoto.layoutAlign='CENTER';
    pRow.appendChild(tGoto);

    const jumpBox=figma.createFrame(); jumpBox.name='JumpInput';
    jumpBox.layoutMode='HORIZONTAL'; jumpBox.primaryAxisAlignItems='CENTER'; jumpBox.counterAxisAlignItems='CENTER';
    jumpBox.primaryAxisSizingMode='FIXED'; jumpBox.counterAxisSizingMode='FIXED';
    jumpBox.resize(40,32); jumpBox.cornerRadius=2;
    jumpBox.fills=solid(C.white);
    jumpBox.strokes=[{type:'SOLID',color:C.black,opacity:0.15}];
    jumpBox.strokeWeight=1; jumpBox.strokeAlign='INSIDE';
    const tJ=figma.createText();
    tJ.fontName={family:'PingFang SC',style:'Regular'}; tJ.fontSize=14;
    tJ.lineHeight={value:22,unit:'PIXELS'}; tJ.characters=String(currentPage);
    tJ.fills=[{type:'SOLID',color:C.black,opacity:0.65}];
    tJ.textAutoResize='WIDTH_AND_HEIGHT'; tJ.layoutAlign='CENTER';
    jumpBox.appendChild(tJ); pRow.appendChild(jumpBox);

    const tPage=figma.createText();
    tPage.fontName={family:'PingFang SC',style:'Regular'}; tPage.fontSize=14;
    tPage.lineHeight={value:22,unit:'PIXELS'}; tPage.characters='页';
    tPage.fills=[{type:'SOLID',color:C.black,opacity:0.85}];
    tPage.textAutoResize='WIDTH_AND_HEIGHT'; tPage.layoutAlign='CENTER';
    pRow.appendChild(tPage);

    // 整体行放入 parent，右对齐
    parent.appendChild(pRow);
    pRow.x = CARD_W - PAD - pRow.width;
    pRow.y = y;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  页面组装
  // ─────────────────────────────────────────────────────────────────────
  const root = figma.createFrame();
  root.name='合同管理列表页'; root.resize(CANVAS_W,CANVAS_H);
  root.fills=solid(C.pageBg); root.clipsContent=true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name='合同管理';

  const sidebar = makeSidebar(CANVAS_H);
  sidebar.x=0; sidebar.y=0; root.appendChild(sidebar);

  const main = figma.createFrame();
  main.name='主区域'; main.resize(MAIN_W,CANVAS_H); main.fills=[]; main.x=SIDE_W; main.y=0;
  root.appendChild(main);

  const headerBar = makeHeaderBar(MAIN_W);
  headerBar.x=0; headerBar.y=0; main.appendChild(headerBar);

  const breadBar = makeBreadcrumbBar(MAIN_W,['首页','销售管理','合同管理']);
  breadBar.x=0; breadBar.y=NAV_H; main.appendChild(breadBar);

  const cardY = NAV_H + TITLE_H + OUTER_PAD;  // 112
  const mainCard = figma.createFrame();
  mainCard.name='内容卡片'; mainCard.resize(CARD_W,CARD_H);
  mainCard.fills=solid(C.white); mainCard.cornerRadius=8;
  mainCard.clipsContent=false; mainCard.x=OUTER_PAD; mainCard.y=cardY;
  main.appendChild(mainCard);

  // ── 筛选区（10 个字段，4 行）
  // Row 0
  addFilter(mainCard,'合同编号',0,0,'text');
  addFilter(mainCard,'客户名称',1,0,'text');
  addFilter(mainCard,'合同场景',2,0,'select');
  // Row 1
  addFilter(mainCard,'合同类型',0,1,'select');
  addFilter(mainCard,'合同状态',1,1,'select');
  addFilter(mainCard,'销售人员',2,1,'text');
  // Row 2：BIP审批编号(col0) | 签订日期(col1) | 到期日期(col2)
  addFilter(mainCard,'BIP审批编号',0,2,'text');
  addRangeFilter(mainCard,'签订日期',COL_X[1],2,true);
  addRangeFilter(mainCard,'到期日期',COL_X[2],2,true);
  // Row 3：合同金额(col0) — 未满3列，按钮与本行同行右对齐
  addRangeFilter(mainCard,'合同金额',COL_X[0],3,false);

  // 筛选操作按钮
  buildFilterActions(mainCard, FILTER_ACT_Y);

  // 工具栏
  buildTableToolbar(mainCard, TOOLBAR_Y);

  // 带冻结表格
  const frozenTable = buildFrozenTable();
  frozenTable.x=PAD; frozenTable.y=TBL_Y;
  mainCard.appendChild(frozenTable);

  // 分页
  buildFullPagination(mainCard, PAGER_Y, 68, 1, 4);

  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin('✅ 合同管理列表页 v10 已生成（1440×864）');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
