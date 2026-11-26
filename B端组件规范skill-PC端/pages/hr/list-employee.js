// ── 人员管理·员工列表页 ───────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-06-03
// 功能：筛选区（6字段3列2行）+ 冻结列表格（左冻：工号/姓名，右冻：操作）+ 分页器
// 使用方式：直接粘贴到 Figma Scripter 并运行（本文件已自包含，无需额外依赖）
// ═══════════════════════════════════════════════════════════════════════

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular'  }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium'   }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Semibold' }),
  ]);

  // ── SVG 图标 ───────────────────────────────────────────────────────────
  const ICONS = {
    'DropDown-Arrow': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
    'PutAway-Arrow':  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
    'Arrow-Open':     `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.9194 6.375C19.7579 6.375 20.2241 7.34493 19.7002 7.99969L12.7809 16.6489C12.3805 17.1493 11.6195 17.1493 11.2191 16.6489L4.29975 7.99969C3.77594 7.34493 4.24212 6.375 5.08062 6.375H18.9194Z" fill="currentColor"/></svg>`,
    'Switch':         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0142 3.86587C14.7138 3.67557 14.3112 3.7211 14.0618 3.99194L13.9794 4.0993C13.7891 4.39968 13.8346 4.80229 14.1055 5.05171L17.5785 8.25H4.50004L4.36523 8.26209C4.01536 8.32559 3.75004 8.63181 3.75004 9C3.75004 9.41422 4.08583 9.75 4.50004 9.75H19.5L19.6318 9.73918C20.2232 9.63982 20.4771 8.88024 20.0081 8.4483L15.1216 3.9483L15.0142 3.86587ZM20.25 15C20.25 14.5858 19.9143 14.25 19.5 14.25H4.50004L4.3683 14.2608C3.77691 14.3602 3.52295 15.1198 3.99198 15.5517L8.87851 20.0517L8.98587 20.1341C9.28625 20.3244 9.68886 20.2789 9.93827 20.0081L10.0207 19.9007C10.211 19.6003 10.1655 19.1977 9.89463 18.9483L6.42154 15.75H19.5L19.6349 15.7379C19.9847 15.6744 20.25 15.3682 20.25 15Z" fill="currentColor"/></svg>`,
    'Date':           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.99644 3.44662C8.93293 3.09675 8.62671 2.83144 8.25852 2.83144C7.84431 2.83144 7.50852 3.16722 7.50852 3.58144V4.70223H5.45233C4.00491 4.70223 2.83154 5.87559 2.83154 7.32302V18.5478C2.83154 19.9952 4.00491 21.1686 5.45233 21.1686H18.5479C19.9953 21.1686 21.1687 19.9952 21.1687 18.5478V7.32302C21.1687 5.87559 19.9953 4.70223 18.5479 4.70223H16.4917V3.58144L16.4796 3.44662C16.4161 3.09675 16.1099 2.83144 15.7417 2.83144C15.3275 2.83144 14.9917 3.16722 14.9917 3.58144V4.70223H9.00852V3.58144L8.99644 3.44662ZM7.50852 6.20223V7.32302L7.5206 7.45783C7.58411 7.8077 7.89033 8.07302 8.25852 8.07302C8.67273 8.07302 9.00852 7.73723 9.00852 7.32302V6.20223H14.9917V7.32302L15.0038 7.45783C15.0673 7.8077 15.3735 8.07302 15.7417 8.07302C16.1559 8.07302 16.4917 7.73723 16.4917 7.32302V6.20223H18.5479C19.1669 6.20223 19.6687 6.70402 19.6687 7.32302V18.5478C19.6687 19.1668 19.1669 19.6686 18.5479 19.6686H5.45233C4.83334 19.6686 4.33154 19.1668 4.33154 18.5478V7.32302C4.33154 6.70402 4.83334 6.20223 5.45233 6.20223H7.50852ZM16.6771 10.3146C17.0913 10.3146 17.4271 10.6504 17.4271 11.0646C17.4271 11.4328 17.1618 11.739 16.8119 11.8025L16.6771 11.8146H7.32312C6.90891 11.8146 6.57312 11.4788 6.57312 11.0646C6.57312 10.6964 6.83844 10.3902 7.18831 10.3267L7.32312 10.3146H16.6771Z" fill="currentColor"/></svg>`,
    'Add':            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
    'sidebar':        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'briefcase':      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'users':          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'bell':           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'search':         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'download':       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'chevron-left':   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'chevron-right':  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'settings':       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };

  // ── 颜色 ───────────────────────────────────────────────────────────────
  function hex(h) {
    var n = parseInt(h.slice(1), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
  }
  function solid(color, a) {
    if (a === undefined) { a = 1; }
    return [{ type: 'SOLID', color: color, opacity: a }];
  }

  var C = {
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
    warningL90: hex('#FFF4E6'),
    danger:     hex('#FE5E54'),
    dangerL90:  hex('#FFEEEE'),
    tagGrayBg:  hex('#F5F5F5'),
    black:      hex('#000000'),
    red:        hex('#CF1322'),
  };

  // ── 布局常量 ───────────────────────────────────────────────────────────
  var CANVAS_W   = 1440, CANVAS_H = 864;
  var SIDE_W     = 208,  MAIN_W   = 1232;
  var NAV_H      = 48,   TITLE_H  = 48;
  var OUTER_PAD  = 16,   PAD      = 24;
  var CARD_W     = 1200, TBL_W    = 1152;
  var ROW_H      = 48,   HEADER_H = 48;
  var NUM_ROWS   = 8;

  // ── 列宽 ────────────────────────────────────────────────────────────────
  // 全部列总宽 = 120+120+136+96+120+128+128+120+104 = 1072px（含冻结）
  // + 操作列 96px → 合计 1168px > TBL_W(1152) ← 需冻结列
  var CW = {
    empNo:      120,  // 工号        ← 左冻结
    name:       120,  // 姓名        ← 左冻结
    dept:       136,  // 所属部门
    position:    96,  // 岗位
    entryDate:  120,  // 入职日期
    contractType:128, // 合同类型
    expireDate: 128,  // 合同到期日
    phone:      128,  // 联系电话
    status:     104,  // 状态
    ops:        112,  // 操作        ← 右冻结
  };

  // 高度推导
  var FILTER_ROWS    = 2;                                      // 筛选行数（6字段3列）
  var FILTER_BTN_Y   = PAD + FILTER_ROWS * 48;                 // 120 = 24+96
  var TOOLBAR_Y      = FILTER_BTN_Y + 32 + 16;                 // 168
  var TBL_Y          = TOOLBAR_Y + ROW_H;                      // 216
  var TABLE_CONTENT_H = HEADER_H + NUM_ROWS * ROW_H;           // 432
  var SCROLLBAR_H    = 16;
  var TABLE_WRAPPER_H = TABLE_CONTENT_H + SCROLLBAR_H;         // 448
  var PAGER_Y        = TBL_Y + TABLE_WRAPPER_H + 16;           // 680
  var CARD_H         = PAGER_Y + 32 + 24;                      // 736

  // 冻结阴影
  var SHADOW_L = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:2,y:0},  radius:4, spread:-1 };
  var SHADOW_R = { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.10}, offset:{x:-2,y:0}, radius:4, spread:-1 };

  // ── 基础工厂 ───────────────────────────────────────────────────────────
  function mkRect(w, h, color, opts) {
    if (!opts) opts = {};
    var r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a || 1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    return r;
  }
  function mkText(chars, color, size, opts) {
    if (!opts) opts = {};
    var t = figma.createText();
    t.fontName   = { family: 'PingFang SC', style: opts.style || 'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? { value: opts.lh, unit: 'PIXELS' } : { unit: 'AUTO' };
    t.characters = chars;
    t.fills      = solid(color, opts.a !== undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function mkIcon(key, size, color, opacity) {
    if (opacity === undefined) opacity = 1;
    var svg = ICONS[key];
    if (!svg) return null;
    var node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(function(n) { return n.fills && n.fills.length && n.fills[0].type === 'SOLID'; })
        .forEach(function(n) { n.fills = solid(color, 1); });
    node.findAll(function(n) { return n.strokes && n.strokes.length; })
        .forEach(function(n) { n.strokes = solid(color, 1); });
    return node;
  }

  // ── 基础控件 ───────────────────────────────────────────────────────────
  function mkBtn(label, type, iconNode) {
    if (!type) type = 'primary';
    var btn = figma.createFrame();
    btn.name = 'Btn/' + type;
    btn.cornerRadius = 4; btn.clipsContent = false;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO'; btn.counterAxisSizingMode = 'AUTO';
    btn.paddingLeft = 16; btn.paddingRight = 16; btn.paddingTop = 5; btn.paddingBottom = 5;
    btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER'; btn.itemSpacing = 4;
    if (type === 'primary') {
      btn.fills = solid(C.primary); btn.strokes = [];
    } else {
      btn.fills = solid(C.white);
      btn.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
      btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
    }
    if (iconNode) { iconNode.resize(16, 16); iconNode.layoutAlign = 'CENTER'; btn.appendChild(iconNode); }
    if (label) {
      var t = figma.createText();
      t.fontName = { family: 'PingFang SC', style: 'Regular' };
      t.fontSize = 14; t.lineHeight = { value: 22, unit: 'PIXELS' };
      t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
      t.fills = type === 'primary' ? solid(C.white) : [{ type: 'SOLID', color: C.black, opacity: 0.65 }];
      t.characters = label;
      btn.appendChild(t);
    }
    return btn;
  }
  function mkInput(placeholder, x, y, width) {
    if (!width) width = 255;
    var w = figma.createFrame();
    w.name = 'Input'; w.x = x; w.y = y; w.cornerRadius = 2; w.clipsContent = false;
    w.layoutMode = 'HORIZONTAL'; w.primaryAxisSizingMode = 'FIXED'; w.counterAxisSizingMode = 'AUTO';
    w.resize(width, 32); w.paddingLeft = 12; w.paddingRight = 12; w.paddingTop = 5; w.paddingBottom = 5;
    w.primaryAxisAlignItems = 'MIN'; w.counterAxisAlignItems = 'CENTER';
    w.fills = solid(C.white);
    w.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
    w.strokeWeight = 1; w.strokeAlign = 'INSIDE';
    var t = figma.createText();
    t.fontName = { family: 'PingFang SC', style: 'Regular' }; t.fontSize = 14;
    t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = placeholder;
    t.fills = [{ type: 'SOLID', color: C.black, opacity: 0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    w.appendChild(t);
    return w;
  }
  function mkSelect(placeholder, x, y, width) {
    if (!width) width = 255;
    var w = figma.createFrame();
    w.name = 'Select'; w.x = x; w.y = y; w.cornerRadius = 2; w.clipsContent = false;
    w.layoutMode = 'HORIZONTAL'; w.primaryAxisSizingMode = 'FIXED'; w.counterAxisSizingMode = 'AUTO';
    w.resize(width, 32); w.paddingLeft = 12; w.paddingRight = 8; w.paddingTop = 5; w.paddingBottom = 5;
    w.primaryAxisAlignItems = 'SPACE_BETWEEN'; w.counterAxisAlignItems = 'CENTER'; w.itemSpacing = 4;
    w.fills = solid(C.white);
    w.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
    w.strokeWeight = 1; w.strokeAlign = 'INSIDE';
    var t = figma.createText();
    t.fontName = { family: 'PingFang SC', style: 'Regular' }; t.fontSize = 14;
    t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = placeholder;
    t.fills = [{ type: 'SOLID', color: C.black, opacity: 0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    w.appendChild(t);
    var arr = mkIcon('DropDown-Arrow', 16, C.black, 0.45);
    if (arr) { arr.layoutAlign = 'CENTER'; w.appendChild(arr); }
    return w;
  }
  function mkDateRange(x, y) {
    var w = figma.createFrame();
    w.name = 'DateRange'; w.x = x; w.y = y; w.cornerRadius = 2; w.clipsContent = false;
    w.layoutMode = 'HORIZONTAL'; w.primaryAxisSizingMode = 'FIXED'; w.counterAxisSizingMode = 'AUTO';
    w.resize(255, 32); w.paddingLeft = 12; w.paddingRight = 12; w.paddingTop = 5; w.paddingBottom = 5;
    w.primaryAxisAlignItems = 'MIN'; w.counterAxisAlignItems = 'CENTER'; w.itemSpacing = 6;
    w.fills = solid(C.white);
    w.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
    w.strokeWeight = 1; w.strokeAlign = 'INSIDE';
    var ic = mkIcon('Date', 16, C.black, 0.25);
    if (ic) { ic.layoutAlign = 'CENTER'; w.appendChild(ic); }
    ['开始日期', '至', '结束日期'].forEach(function(s, i) {
      var t = figma.createText();
      t.fontName = { family: 'PingFang SC', style: 'Regular' }; t.fontSize = 14;
      t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = s;
      t.fills = [{ type: 'SOLID', color: C.black, opacity: i === 1 ? 0.45 : 0.25 }];
      t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
      w.appendChild(t);
    });
    return w;
  }

  // ── 筛选区 ─────────────────────────────────────────────────────────────
  var LABEL_W = 112, LABEL_GAP = 8, INPUT_W = 255;
  var COL_X = [PAD, PAD + 387, PAD + 387 * 2];  // 3列

  function addFilter(parent, label, col, rowIdx, fieldType) {
    var x0 = COL_X[col], y0 = PAD + rowIdx * 48;
    var lbl = figma.createText();
    lbl.fontName = { family: 'PingFang SC', style: 'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value: 22, unit: 'PIXELS' };
    lbl.characters = label;
    lbl.fills = [{ type: 'SOLID', color: C.black, opacity: 0.65 }];
    lbl.textAutoResize = 'HEIGHT'; lbl.resize(LABEL_W, 22);
    lbl.textAlignHorizontal = 'RIGHT';
    lbl.x = x0; lbl.y = y0 + 5;
    parent.appendChild(lbl);
    var inputX = x0 + LABEL_W + LABEL_GAP;
    if (fieldType === 'select') {
      parent.appendChild(mkSelect('请选择', inputX, y0, INPUT_W));
    } else if (fieldType === 'date') {
      parent.appendChild(mkDateRange(inputX, y0));
    } else {
      parent.appendChild(mkInput('请输入', inputX, y0, INPUT_W));
    }
  }

  function buildFilterActions(parent, y) {
    var row = figma.createFrame();
    row.name = 'FilterActions'; row.fills = []; row.clipsContent = false;
    row.layoutMode = 'HORIZONTAL'; row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 8; row.counterAxisAlignItems = 'CENTER';
    row.appendChild(mkBtn('查询', 'primary'));
    row.appendChild(mkBtn('重置', 'secondary'));
    parent.appendChild(row);
    row.x = CARD_W - PAD - row.width; row.y = y;
  }

  // ── 工具栏 ─────────────────────────────────────────────────────────────
  function buildToolbar(parent, y) {
    var row = figma.createFrame();
    row.name = 'Toolbar'; row.fills = []; row.clipsContent = false;
    row.layoutMode = 'HORIZONTAL'; row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 8; row.counterAxisAlignItems = 'CENTER';
    row.appendChild(mkBtn('导出', 'secondary'));
    var icAdd = mkIcon('Add', 16, C.white, 1);
    row.appendChild(mkBtn('新增员工', 'primary', icAdd));
    parent.appendChild(row);
    row.x = CARD_W - PAD - row.width; row.y = y;
  }

  // ── 表格单元格 ─────────────────────────────────────────────────────────
  function mkThCell(colW, label) {
    var cell = figma.createFrame();
    cell.name = 'Th/' + label; cell.resize(colW, HEADER_H);
    cell.fills = [{ type: 'SOLID', color: C.black, opacity: 0.04 }]; cell.clipsContent = false;
    var t = figma.createText();
    t.fontName = { family: 'PingFang SC', style: 'Medium' }; t.fontSize = 14;
    t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = label;
    t.fills = [{ type: 'SOLID', color: C.black, opacity: 0.85 }];
    t.textAutoResize = 'NONE'; t.resize(colW - 32, 22);
    t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }
  function mkTdText(colW, content, truncate) {
    var cell = figma.createFrame();
    cell.name = 'Td'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(mkRect(colW, 1, C.black, { a: 0.06, x: 0, y: ROW_H - 1 }));
    var t = figma.createText();
    t.fontName = { family: 'PingFang SC', style: 'Regular' }; t.fontSize = 14;
    t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = content;
    t.fills = [{ type: 'SOLID', color: C.black, opacity: 0.65 }];
    if (truncate) {
      t.textAutoResize = 'NONE'; t.resize(colW - 32, 22); t.textTruncation = 'ENDING';
    } else {
      t.textAutoResize = 'WIDTH_AND_HEIGHT';
    }
    t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }
  function mkTdLink(colW, content) {
    var cell = figma.createFrame();
    cell.name = 'TdLink'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(mkRect(colW, 1, C.black, { a: 0.06, x: 0, y: ROW_H - 1 }));
    var t = figma.createText();
    t.fontName = { family: 'PingFang SC', style: 'Regular' }; t.fontSize = 14;
    t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = content;
    t.fills = solid(C.primary);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }
  function mkTdTag(colW, label, bgColor, txtColor, opacity) {
    if (opacity === undefined) opacity = 1;
    var cell = figma.createFrame();
    cell.name = 'TdTag/' + label; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(mkRect(colW, 1, C.black, { a: 0.06, x: 0, y: ROW_H - 1 }));
    var tLabel = figma.createText();
    tLabel.fontName = { family: 'PingFang SC', style: 'Regular' }; tLabel.fontSize = 12;
    tLabel.lineHeight = { value: 20, unit: 'PIXELS' }; tLabel.characters = label;
    tLabel.fills = solid(txtColor, opacity); tLabel.textAutoResize = 'WIDTH_AND_HEIGHT';
    tLabel.x = 8; tLabel.y = 1;
    var tagW = tLabel.width + 16, tagH = 22;
    var tag = figma.createFrame();
    tag.name = 'Tag'; tag.cornerRadius = 2; tag.clipsContent = false;
    tag.resize(tagW, tagH); tag.fills = solid(bgColor);
    tag.x = 8; tag.y = Math.round((ROW_H - tagH) / 2);
    tag.appendChild(tLabel); cell.appendChild(tag);
    return cell;
  }
  function mkTdAction(colW, ops) {
    var cell = figma.createFrame();
    cell.name = 'TdAct'; cell.resize(colW, ROW_H); cell.fills = solid(C.white); cell.clipsContent = false;
    cell.appendChild(mkRect(colW, 1, C.black, { a: 0.06, x: 0, y: ROW_H - 1 }));
    ops.forEach(function(op) {
      var t = figma.createText();
      t.fontName = { family: 'PingFang SC', style: 'Regular' }; t.fontSize = 14;
      t.lineHeight = { value: 22, unit: 'PIXELS' }; t.characters = op.label;
      t.fills = solid(op.color); t.x = op.x; t.y = 13;
      cell.appendChild(t);
    });
    return cell;
  }

  // 将一列垂直堆叠（表头 + 所有数据行）
  function makeVCol(colW, label, cellBuilderList) {
    var col = figma.createFrame(); col.name = 'Col/' + label;
    col.layoutMode = 'VERTICAL'; col.itemSpacing = 0;
    col.primaryAxisSizingMode = 'AUTO'; col.counterAxisSizingMode = 'FIXED';
    col.resize(colW, HEADER_H + cellBuilderList.length * ROW_H); col.fills = [];
    col.appendChild(mkThCell(colW, label));
    cellBuilderList.forEach(function(b) { col.appendChild(b()); });
    return col;
  }

  // ── 数据 ───────────────────────────────────────────────────────────────
  var STATUS_CFG = {
    '在职': { bg: C.successL90, txt: C.success,  a: 1 },
    '试用': { bg: C.warningL90, txt: C.warning,  a: 1 },
    '离职': { bg: C.tagGrayBg,  txt: C.black,    a: 0.45 },
    '停薪留职': { bg: C.dangerL90, txt: C.danger, a: 1 },
  };
  var CONTRACT_CFG = {
    '固定期限': { bg: C.primaryL90, txt: C.primary, a: 1 },
    '无固定期限': { bg: C.successL90, txt: C.success, a: 1 },
    '实习协议': { bg: C.warningL90, txt: C.warning, a: 1 },
  };

  function getOps(status) {
    var P = C.primary, R = C.red;
    var map = {
      '在职':   [{ label: '详情', color: P, x: 8 }, { label: '编辑', color: P, x: 44 }, { label: '离职', color: R, x: 80 }],
      '试用':   [{ label: '详情', color: P, x: 8 }, { label: '编辑', color: P, x: 44 }, { label: '转正', color: P, x: 80 }],
      '离职':   [{ label: '详情', color: P, x: 8 }],
      '停薪留职': [{ label: '详情', color: P, x: 8 }, { label: '复职', color: P, x: 44 }],
    };
    return map[status] || [{ label: '详情', color: P, x: 8 }];
  }

  var rows = [
    { empNo: 'EMP20240101', name: '张明远', dept: '技术研发部', position: '高级工程师', entryDate: '2022-03-01', contractType: '固定期限',  expireDate: '2025-03-01', phone: '138****8001', status: '在职' },
    { empNo: 'EMP20240102', name: '李思琦', dept: '产品设计中心', position: 'UI设计师', entryDate: '2023-07-15', contractType: '固定期限',  expireDate: '2026-07-15', phone: '139****8002', status: '在职' },
    { empNo: 'EMP20240103', name: '王晓峰', dept: '销售运营部',   position: '客户经理',  entryDate: '2024-01-10', contractType: '试用协议',  expireDate: '2024-04-10', phone: '137****8003', status: '试用' },
    { empNo: 'EMP20230088', name: '陈思远', dept: '财务管理部',   position: '财务专员',  entryDate: '2021-06-01', contractType: '无固定期限', expireDate: '—',          phone: '136****8004', status: '在职' },
    { empNo: 'EMP20230076', name: '刘雨桐', dept: '人力资源部',   position: 'HR专员',    entryDate: '2022-09-20', contractType: '固定期限',  expireDate: '2025-09-20', phone: '135****8005', status: '在职' },
    { empNo: 'EMP20220045', name: '赵建国', dept: '技术研发部',   position: '架构师',    entryDate: '2020-11-01', contractType: '无固定期限', expireDate: '—',          phone: '134****8006', status: '停薪留职' },
    { empNo: 'EMP20210023', name: '孙丽华', dept: '市场营销部',   position: '市场专员',  entryDate: '2019-04-15', contractType: '固定期限',  expireDate: '2022-04-15', phone: '133****8007', status: '离职' },
    { empNo: 'EMP20240215', name: '吴浩然', dept: '客服支持部',   position: '客服代表',  entryDate: '2024-03-01', contractType: '实习协议',  expireDate: '2024-09-01', phone: '132****8008', status: '试用' },
  ];

  // ── 冻结表格 ────────────────────────────────────────────────────────────
  function buildFrozenTable() {
    // 外层裁切容器
    var wrapper = figma.createFrame();
    wrapper.name = 'FrozenTable'; wrapper.resize(TBL_W, TABLE_WRAPPER_H);
    wrapper.fills = []; wrapper.clipsContent = true;

    // 所有列横向排列（总宽 > TBL_W，超出部分被裁切，体现水平滚动）
    var allCols = figma.createFrame(); allCols.name = 'AllColumns';
    allCols.layoutMode = 'HORIZONTAL'; allCols.itemSpacing = 0;
    allCols.primaryAxisSizingMode = 'AUTO'; allCols.counterAxisSizingMode = 'AUTO';
    allCols.fills = []; allCols.x = 0; allCols.y = 0;

    allCols.appendChild(makeVCol(CW.empNo,        '工号',       rows.map(function(r) { return function() { return mkTdLink(CW.empNo, r.empNo); }; })));
    allCols.appendChild(makeVCol(CW.name,         '姓名',       rows.map(function(r) { return function() { return mkTdText(CW.name, r.name); }; })));
    allCols.appendChild(makeVCol(CW.dept,         '所属部门',   rows.map(function(r) { return function() { return mkTdText(CW.dept, r.dept, true); }; })));
    allCols.appendChild(makeVCol(CW.position,     '岗位',       rows.map(function(r) { return function() { return mkTdText(CW.position, r.position, true); }; })));
    allCols.appendChild(makeVCol(CW.entryDate,    '入职日期',   rows.map(function(r) { return function() { return mkTdText(CW.entryDate, r.entryDate); }; })));
    allCols.appendChild(makeVCol(CW.contractType, '合同类型',   rows.map(function(r) {
      return function() {
        var cfg = CONTRACT_CFG[r.contractType] || { bg: C.tagGrayBg, txt: C.black, a: 0.65 };
        return mkTdTag(CW.contractType, r.contractType, cfg.bg, cfg.txt, cfg.a);
      };
    })));
    allCols.appendChild(makeVCol(CW.expireDate,   '合同到期日', rows.map(function(r) { return function() { return mkTdText(CW.expireDate, r.expireDate); }; })));
    allCols.appendChild(makeVCol(CW.phone,        '联系电话',   rows.map(function(r) { return function() { return mkTdText(CW.phone, r.phone); }; })));
    allCols.appendChild(makeVCol(CW.status,       '状态',       rows.map(function(r) {
      return function() {
        var sc = STATUS_CFG[r.status] || { bg: C.tagGrayBg, txt: C.black, a: 0.65 };
        return mkTdTag(CW.status, r.status, sc.bg, sc.txt, sc.a);
      };
    })));
    allCols.appendChild(makeVCol(CW.ops,          '操作',       rows.map(function(r) { return function() { return mkTdAction(CW.ops, getOps(r.status)); }; })));

    wrapper.appendChild(allCols);

    // ── 左冻结覆盖层：工号 + 姓名 ──────────────────────────────────────
    var leftFrozen = figma.createFrame(); leftFrozen.name = 'LeftFrozen';
    leftFrozen.layoutMode = 'HORIZONTAL'; leftFrozen.itemSpacing = 0;
    leftFrozen.primaryAxisSizingMode = 'AUTO'; leftFrozen.counterAxisSizingMode = 'AUTO';
    leftFrozen.fills = solid(C.white);
    leftFrozen.effects = [SHADOW_L];
    leftFrozen.x = 0; leftFrozen.y = 0;

    leftFrozen.appendChild(makeVCol(CW.empNo, '工号', rows.map(function(r) { return function() { return mkTdLink(CW.empNo, r.empNo); }; })));
    leftFrozen.appendChild(makeVCol(CW.name,  '姓名', rows.map(function(r) { return function() { return mkTdText(CW.name, r.name); }; })));
    wrapper.appendChild(leftFrozen);

    // ── 右冻结覆盖层：操作 ─────────────────────────────────────────────
    var rightFrozen = makeVCol(CW.ops, '操作', rows.map(function(r) {
      return function() { return mkTdAction(CW.ops, getOps(r.status)); };
    }));
    rightFrozen.name = 'RightFrozen'; rightFrozen.fills = solid(C.white);
    rightFrozen.effects = [SHADOW_R];
    rightFrozen.x = TBL_W - CW.ops; rightFrozen.y = 0;
    wrapper.appendChild(rightFrozen);

    // ── 水平滚动条（示意）──────────────────────────────────────────────
    var sbTrack = figma.createFrame(); sbTrack.name = 'ScrollbarTrack';
    sbTrack.resize(TBL_W, SCROLLBAR_H); sbTrack.fills = solid(hex('#FAFAFA'));
    sbTrack.x = 0; sbTrack.y = TABLE_CONTENT_H; sbTrack.clipsContent = false;
    sbTrack.appendChild(mkRect(TBL_W, 1, hex('#EDEDED'), { x: 0, y: 0 }));
    // 滑块宽度按 (TBL_W / 全部列总宽) 比例估算
    var totalColsW = CW.empNo + CW.name + CW.dept + CW.position + CW.entryDate + CW.contractType + CW.expireDate + CW.phone + CW.status + CW.ops;
    var thumbW = Math.round(TBL_W * TBL_W / totalColsW);
    sbTrack.appendChild(mkRect(thumbW, 8, hex('#D8D8D8'), { r: 4, x: CW.empNo + CW.name, y: 4 }));
    sbTrack.appendChild(mkRect(TBL_W, 1, hex('#EDEDED'), { x: 0, y: SCROLLBAR_H - 1 }));
    wrapper.appendChild(sbTrack);

    return wrapper;
  }

  // ── 分页器 ─────────────────────────────────────────────────────────────
  function buildPagination(parent, y, total, currentPage, pageCount) {
    var pRow = figma.createFrame();
    pRow.name = 'PaginationRow'; pRow.fills = [];
    pRow.layoutMode = 'HORIZONTAL'; pRow.primaryAxisSizingMode = 'AUTO'; pRow.counterAxisSizingMode = 'AUTO';
    pRow.itemSpacing = 8; pRow.counterAxisAlignItems = 'CENTER';

    // 每页条数选择
    var psBox = figma.createFrame();
    psBox.name = 'PageSize'; psBox.resize(90, 32); psBox.cornerRadius = 2; psBox.clipsContent = false;
    psBox.fills = solid(C.white);
    psBox.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
    psBox.strokeWeight = 1; psBox.strokeAlign = 'INSIDE';
    psBox.layoutMode = 'HORIZONTAL'; psBox.primaryAxisSizingMode = 'FIXED'; psBox.counterAxisSizingMode = 'FIXED';
    psBox.paddingLeft = 10; psBox.paddingRight = 8; psBox.paddingTop = 5; psBox.paddingBottom = 5;
    psBox.primaryAxisAlignItems = 'SPACE_BETWEEN'; psBox.counterAxisAlignItems = 'CENTER';
    var psT = figma.createText();
    psT.fontName = { family: 'PingFang SC', style: 'Regular' }; psT.fontSize = 14;
    psT.lineHeight = { value: 22, unit: 'PIXELS' }; psT.characters = '20条/页';
    psT.fills = [{ type: 'SOLID', color: C.black, opacity: 0.85 }];
    psT.textAutoResize = 'WIDTH_AND_HEIGHT'; psT.layoutAlign = 'CENTER';
    psBox.appendChild(psT);
    var psArr = mkIcon('DropDown-Arrow', 16, C.black, 0.45);
    if (psArr) { psArr.layoutAlign = 'CENTER'; psBox.appendChild(psArr); }
    pRow.appendChild(psBox);

    // 总条数
    var tTotal = figma.createText();
    tTotal.fontName = { family: 'PingFang SC', style: 'Regular' }; tTotal.fontSize = 14;
    tTotal.lineHeight = { value: 22, unit: 'PIXELS' }; tTotal.characters = '共 ' + total + ' 条';
    tTotal.fills = [{ type: 'SOLID', color: C.black, opacity: 0.65 }];
    tTotal.textAutoResize = 'WIDTH_AND_HEIGHT'; tTotal.layoutAlign = 'CENTER';
    pRow.appendChild(tTotal);

    // 翻页按钮
    function mkPageBtn(key) {
      var b = figma.createFrame(); b.name = 'PgBtn/' + key;
      b.layoutMode = 'HORIZONTAL'; b.primaryAxisAlignItems = 'CENTER'; b.counterAxisAlignItems = 'CENTER';
      b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'FIXED';
      b.resize(32, 32); b.cornerRadius = 2;
      b.fills = solid(C.white);
      b.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
      b.strokeWeight = 1; b.strokeAlign = 'INSIDE';
      var ic = mkIcon(key, 12, C.black, 0.65);
      if (ic) { ic.layoutAlign = 'CENTER'; b.appendChild(ic); }
      return b;
    }
    pRow.appendChild(mkPageBtn('chevron-left'));

    for (var p = 1; p <= pageCount; p++) {
      var isSel = p === currentPage;
      var btn = figma.createFrame(); btn.name = 'PgBtn/' + p;
      btn.layoutMode = 'HORIZONTAL'; btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER';
      btn.primaryAxisSizingMode = 'FIXED'; btn.counterAxisSizingMode = 'FIXED';
      btn.resize(32, 32); btn.cornerRadius = 2;
      if (isSel) { btn.fills = solid(C.primary); btn.strokes = []; }
      else { btn.fills = solid(C.white); btn.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }]; btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE'; }
      var tP = figma.createText();
      tP.fontName = { family: 'PingFang SC', style: 'Regular' }; tP.fontSize = 14;
      tP.lineHeight = { value: 22, unit: 'PIXELS' }; tP.characters = String(p);
      tP.fills = isSel ? solid(C.white) : [{ type: 'SOLID', color: C.black, opacity: 0.85 }];
      tP.textAutoResize = 'WIDTH_AND_HEIGHT'; tP.layoutAlign = 'CENTER';
      btn.appendChild(tP); pRow.appendChild(btn);
    }

    pRow.appendChild(mkPageBtn('chevron-right'));

    // 跳转
    var tGoto = figma.createText();
    tGoto.fontName = { family: 'PingFang SC', style: 'Regular' }; tGoto.fontSize = 14;
    tGoto.lineHeight = { value: 22, unit: 'PIXELS' }; tGoto.characters = '跳转至';
    tGoto.fills = [{ type: 'SOLID', color: C.black, opacity: 0.65 }];
    tGoto.textAutoResize = 'WIDTH_AND_HEIGHT'; tGoto.layoutAlign = 'CENTER';
    pRow.appendChild(tGoto);

    var jumpBox = figma.createFrame(); jumpBox.name = 'JumpInput';
    jumpBox.layoutMode = 'HORIZONTAL'; jumpBox.primaryAxisAlignItems = 'CENTER'; jumpBox.counterAxisAlignItems = 'CENTER';
    jumpBox.primaryAxisSizingMode = 'FIXED'; jumpBox.counterAxisSizingMode = 'FIXED';
    jumpBox.resize(40, 32); jumpBox.cornerRadius = 2;
    jumpBox.fills = solid(C.white);
    jumpBox.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
    jumpBox.strokeWeight = 1; jumpBox.strokeAlign = 'INSIDE';
    var tJ = figma.createText();
    tJ.fontName = { family: 'PingFang SC', style: 'Regular' }; tJ.fontSize = 14;
    tJ.lineHeight = { value: 22, unit: 'PIXELS' }; tJ.characters = String(currentPage);
    tJ.fills = [{ type: 'SOLID', color: C.black, opacity: 0.65 }];
    tJ.textAutoResize = 'WIDTH_AND_HEIGHT'; tJ.layoutAlign = 'CENTER';
    jumpBox.appendChild(tJ); pRow.appendChild(jumpBox);

    var tPg = figma.createText();
    tPg.fontName = { family: 'PingFang SC', style: 'Regular' }; tPg.fontSize = 14;
    tPg.lineHeight = { value: 22, unit: 'PIXELS' }; tPg.characters = '页';
    tPg.fills = [{ type: 'SOLID', color: C.black, opacity: 0.85 }];
    tPg.textAutoResize = 'WIDTH_AND_HEIGHT'; tPg.layoutAlign = 'CENTER';
    pRow.appendChild(tPg);

    parent.appendChild(pRow);
    pRow.x = CARD_W - PAD - pRow.width; pRow.y = y;
  }

  // ── 侧边栏 ─────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    var area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64); area.fills = solid(C.sidebarBg); area.clipsContent = false;
    var box = mkRect(32, 32, C.primary, { r: 6, x: 24, y: 16 });
    area.appendChild(box);
    var tM = mkText('HR', C.white, 12, { style: 'Medium', lh: 20 });
    tM.x = 24 + Math.round((32 - tM.width) / 2); tM.y = 22; area.appendChild(tM);
    area.appendChild(mkText('人力资源管理系统', C.white, 14, { style: 'Medium', lh: 22, x: 64, y: 12 }));
    area.appendChild(mkText('HR MANAGEMENT', C.white, 7, { lh: 10, a: 0.6, x: 64, y: 38 }));
    return area;
  }
  function makeSidebarDivider() {
    var w = figma.createFrame(); w.name = 'SidebarDivider'; w.resize(208, 1); w.fills = []; w.clipsContent = false;
    w.appendChild(mkRect(160, 1, C.white, { a: 0.08, x: 24, y: 0 }));
    return w;
  }
  function makeSidebarItem(label, level, state, iconKey) {
    var bgColor = level === 2 ? C.sidebarSub : C.sidebarBg;
    var isActive = state === 'active', isExpanded = state === 'expanded';
    var op = (isActive || isExpanded) ? 1 : 0.5;
    var row = figma.createFrame();
    row.name = 'L' + level + '·' + label;
    row.resize(208, 48); row.fills = solid(bgColor); row.opacity = op; row.clipsContent = false;
    if (level === 1 && iconKey) {
      var ic = mkIcon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }
    var textX = level === 1 ? 52 : 40;
    row.appendChild(mkText(label, C.white, 14, { lh: 22, x: textX, y: 13 }));
    if (level === 1) {
      var arrowKey = isExpanded ? 'PutAway-Arrow' : 'DropDown-Arrow';
      var arr = mkIcon(arrowKey, 12, C.white, 1);
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
    s.appendChild(makeSidebarItem('员工管理', 1, 'expanded', 'users'));
    s.appendChild(makeSidebarItem('员工列表', 2, 'active',   null));
    s.appendChild(makeSidebarItem('组织架构', 2, 'inactive', null));
    s.appendChild(makeSidebarItem('薪酬福利', 1, 'collapsed', 'briefcase'));
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('系统设置', 1, 'collapsed', 'settings'));
    return s;
  }

  // ── 顶栏 + 面包屑 ──────────────────────────────────────────────────────
  function makeHeaderBar(w) {
    var bar = figma.createFrame();
    bar.name = 'HeaderBar'; bar.resize(w, 48); bar.fills = solid(C.white); bar.clipsContent = false;
    bar.appendChild(mkRect(w, 1, C.black, { a: 0.10, x: 0, y: 47 }));
    var icSide = mkIcon('sidebar', 16, C.black, 0.65);
    if (icSide) { icSide.x = 24; icSide.y = 16; bar.appendChild(icSide); }
    // 租户选择
    var sw = figma.createFrame();
    sw.name = '租户切换'; sw.resize(200, 32); sw.x = 64; sw.y = 8;
    sw.cornerRadius = 2; sw.clipsContent = false;
    sw.fills = solid(C.white);
    sw.strokes = [{ type: 'SOLID', color: C.black, opacity: 0.15 }];
    sw.strokeWeight = 1; sw.strokeAlign = 'INSIDE';
    sw.layoutMode = 'HORIZONTAL'; sw.primaryAxisSizingMode = 'FIXED'; sw.counterAxisSizingMode = 'FIXED';
    sw.paddingLeft = 12; sw.paddingRight = 8; sw.paddingTop = 5; sw.paddingBottom = 5;
    sw.primaryAxisAlignItems = 'SPACE_BETWEEN'; sw.counterAxisAlignItems = 'CENTER';
    var swT = figma.createText();
    swT.fontName = { family: 'PingFang SC', style: 'Regular' }; swT.fontSize = 14;
    swT.lineHeight = { value: 22, unit: 'PIXELS' }; swT.characters = '碧桂园物业';
    swT.fills = [{ type: 'SOLID', color: C.black, opacity: 0.85 }];
    swT.textAutoResize = 'WIDTH_AND_HEIGHT'; swT.layoutAlign = 'CENTER';
    sw.appendChild(swT);
    var icSw = mkIcon('Switch', 14, C.black, 0.45);
    if (icSw) { icSw.layoutAlign = 'CENTER'; sw.appendChild(icSw); }
    bar.appendChild(sw);
    // 右侧图标
    var rs = w - 24 - 223;
    [['search', 0], ['download', 40], ['bell', 80]].forEach(function(pair) {
      var ic = mkIcon(pair[0], 16, C.black, 0.65);
      if (ic) { ic.x = rs + pair[1]; ic.y = 16; bar.appendChild(ic); }
    });
    bar.appendChild(mkRect(1, 16, C.black, { a: 0.10, x: rs + 112, y: 16 }));
    var avatar = figma.createEllipse(); avatar.resize(24, 24);
    avatar.x = rs + 129; avatar.y = 12; avatar.fills = solid(C.primaryL20);
    bar.appendChild(avatar);
    bar.appendChild(mkText('总', C.white, 12, { lh: 18, x: rs + 135, y: 15 }));
    bar.appendChild(mkText('碧小园', C.black, 14, { lh: 22, a: 0.85, x: rs + 161, y: 13 }));
    var icArr = mkIcon('Arrow-Open', 16, C.black, 0.65);
    if (icArr) { icArr.x = rs + 207; icArr.y = 16; bar.appendChild(icArr); }
    return bar;
  }
  function makeTitleBar(w, title, crumbs) {
    var bar = figma.createFrame();
    bar.name = 'TitleBar'; bar.resize(w, 48); bar.fills = solid(C.white); bar.clipsContent = false;
    bar.appendChild(mkRect(w, 1, C.black, { a: 0.10, x: 0, y: 47 }));
    bar.appendChild(mkText(title, C.black, 16, { style: 'Medium', lh: 24, a: 0.85, x: 24, y: 12 }));
    var cx = 104;
    crumbs.forEach(function(crumb, i) {
      var t = mkText(crumb, C.black, 14, { lh: 22, a: i === crumbs.length - 1 ? 0.85 : 0.45, x: cx, y: 13 });
      bar.appendChild(t); cx += t.width;
      if (i < crumbs.length - 1) {
        var arr = mkIcon('chevron-right', 12, C.black, 0.45);
        if (arr) { arr.x = cx + 4; arr.y = 18; bar.appendChild(arr); cx += 20; }
      }
    });
    return bar;
  }

  // ── 页面组装 ────────────────────────────────────────────────────────────
  var root = figma.createFrame();
  root.name = '员工管理-列表页'; root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name = '员工管理';

  // 侧边栏
  root.appendChild(makeSidebar(CANVAS_H));

  // 主区域
  var main = figma.createFrame();
  main.name = '主区域'; main.resize(MAIN_W, CANVAS_H); main.fills = []; main.x = SIDE_W; main.y = 0;
  root.appendChild(main);

  main.appendChild(makeHeaderBar(MAIN_W));

  var titleBar = makeTitleBar(MAIN_W, '员工列表', ['首页', '员工管理', '员工列表']);
  titleBar.x = 0; titleBar.y = NAV_H;
  main.appendChild(titleBar);

  // 内容卡片
  var mainCard = figma.createFrame();
  mainCard.name = '内容卡片'; mainCard.resize(CARD_W, CARD_H);
  mainCard.fills = solid(C.white); mainCard.cornerRadius = 8; mainCard.clipsContent = false;
  mainCard.x = OUTER_PAD; mainCard.y = NAV_H + TITLE_H + OUTER_PAD;
  main.appendChild(mainCard);

  // 筛选字段（2行 × 3列 = 6字段）
  // 行0：工号 | 姓名 | 所属部门
  addFilter(mainCard, '工号',     0, 0, 'text');
  addFilter(mainCard, '姓名',     1, 0, 'text');
  addFilter(mainCard, '所属部门', 2, 0, 'select');
  // 行1：岗位 | 状态 | 入职日期
  addFilter(mainCard, '岗位',     0, 1, 'select');
  addFilter(mainCard, '状态',     1, 1, 'select');
  addFilter(mainCard, '入职日期', 2, 1, 'date');

  // 查询 / 重置 按钮
  buildFilterActions(mainCard, FILTER_BTN_Y);

  // 工具栏（导出 + 新增员工）
  buildToolbar(mainCard, TOOLBAR_Y);

  // 冻结表格（左冻：工号+姓名，右冻：操作）
  var frozenTable = buildFrozenTable();
  frozenTable.x = PAD; frozenTable.y = TBL_Y;
  mainCard.appendChild(frozenTable);

  // 分页器
  buildPagination(mainCard, PAGER_Y, 256, 1, 5);

  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify('✅ 员工列表页（含冻结列）生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message, { error: true }); });
