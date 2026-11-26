// ── 合同管理列表页 v8 ──────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-22
// v8 修复清单：
//   · LOGO: "SC" + "供应链管理平台"（对应原型）
//   · 侧边栏导航按原型分组重写，叶节点不加箭头，L2 无下级不加箭头
//   · Header：收起按钮改用 sidebar 图标；租户切换改用 repeat 图标；
//     username 后补 DropDown-Arrow
//   · BreadcrumbBar y=48（紧贴 HeaderBar，无 8px 间距）
//   · 删除筛选/工具栏/表格间多余分割线
//   · 筛选区扩展至 10 个字段（4 行）
//   · 表格改用"带冻结表格"组件：左冻结合同编号 + 右冻结操作 + 横向滚动条
//   · 列宽按 max(表头,最长数据)+32px 规则计算；>15字截断
//   · 操作列按合同状态显示对应按钮，位置精确到字符宽度
// Canvas 1440 × 864

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "sidebar":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "repeat":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 1L21 5L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9C3 6.79086 4.79086 5 7 5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 23L3 19L7 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13V15C21 17.2091 19.2091 19 17 19H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "package":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 9.36925L7.5 4.1994" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21 15.9436V7.97466C20.9993 7.26364 20.6182 6.60689 20 6.25138L13 2.26691C12.3812 1.91103 11.6188 1.91103 11 2.26691L4 6.25138C3.38183 6.60689 3.00073 7.26364 3 7.97466V15.9436C3.00073 16.6546 3.38183 17.3114 4 17.6669L11 21.6514C11.6188 22.0072 12.3812 22.0072 13 21.6514L20 17.6669C20.6182 17.3114 20.9993 16.6546 21 15.9436Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.27002 6.93872L12 11.9691L20.73 6.93872" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V11.9591" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "archive":        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8V21H3V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="3" width="22" height="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "Add":            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
  "bell":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "download":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-right":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular'  }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'   }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Semibold' }),
  ]);

  // ── 工具函数 ────────────────────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a=1) { return [{ type:'SOLID', color, opacity:a }]; }

  // ── 颜色 ────────────────────────────────────────────────────────────
  const C = {
    pageBg:      hex('#F0F2F5'),
    white:       hex('#FFFFFF'),
    sidebarBg:   hex('#002138'),
    sidebarSub:  hex('#00182A'),
    primary:     hex('#006D9B'),
    primaryL20:  hex('#338AAF'),
    primaryL90:  hex('#E6F0F5'),
    success:     hex('#3BBB3E'),
    successL90:  hex('#EBF8EC'),
    warning:     hex('#FFA645'),
    warningL90:  hex('#FFF6EC'),
    danger:      hex('#FE5E54'),
    dangerL90:   hex('#FFEEEE'),
    black:       hex('#000000'),
    tagGrayBg:   hex('#F5F5F5'),
    green:       hex('#00875A'),
    red:         hex('#CF1322'),
  };

  // ── 布局常量 ─────────────────────────────────────────────────────────
  const CANVAS_W = 1440, CANVAS_H = 864;
  const SIDE_W = 208,   MAIN_W  = 1232;   // 1440 - 208
  const NAV_H  = 48,    TITLE_H = 48;     // 两栏各 48px，紧贴
  const OUTER_PAD = 16, PAD = 24;
  const CARD_W = 1200,  TBL_W = 1152;     // 1200 - 2*24
  const ROW_H = 48,     HEADER_H = 48;
  const NUM_ROWS = 6;

  // 纵向节点位置（卡片内坐标）
  // 筛选 4 行：y=24,72,120,168；操作行：y=216；工具栏：y=264；表格：y=312
  const FILTER_ACT_Y  = 216;
  const TOOLBAR_Y     = 264;
  const TBL_Y         = 312;
  const TABLE_CONTENT_H = HEADER_H + NUM_ROWS * ROW_H;   // 48 + 288 = 336
  const SCROLLBAR_H   = 16;
  const TABLE_WRAPPER_H = TABLE_CONTENT_H + SCROLLBAR_H; // 352
  const PAGER_Y       = TBL_Y + TABLE_WRAPPER_H + 16;    // 680
  const CARD_H        = PAGER_Y + 32 + 24;               // 736

  // 冻结阴影（components.md 规范）
  const SHADOW_FREEZE_LEFT = {
    type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
    color:{ r:0, g:0, b:0, a:0.10 },
    offset:{ x:2, y:0 }, radius:4, spread:-1,
  };
  const SHADOW_FREEZE_RIGHT = {
    type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
    color:{ r:0, g:0, b:0, a:0.10 },
    offset:{ x:-2, y:0 }, radius:4, spread:-1,
  };

  // ── 工厂函数 ─────────────────────────────────────────────────────────
  function frame(name, w, h, bg, opts={}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA||1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r  !== undefined) f.cornerRadius = opts.r;
    if (opts.x  !== undefined) f.x = opts.x;
    if (opts.y  !== undefined) f.y = opts.y;
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
    node.findAll(n => n.fills  && n.fills.length  > 0 && n.fills[0].type==='SOLID')
        .forEach(n => { n.fills   = solid(color, 1); });
    node.findAll(n => n.strokes && n.strokes.length > 0)
        .forEach(n => { n.strokes = solid(color, 1); });
    return node;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  侧边栏
  // ─────────────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    const area = frame('SidebarLogo', 208, 64, C.sidebarBg);
    // 蓝色方块 Logo
    const box = rect(32, 32, C.primary, { r:6, x:24, y:16 });
    area.appendChild(box);
    // "SC" 文字居中于方块
    const tSC = text('SC', C.white, 14, { style:'Medium', lh:20 });
    tSC.x = 24 + Math.round((32 - tSC.width) / 2);
    tSC.y = 16 + Math.round((32 - 20) / 2);
    area.appendChild(tSC);
    // 系统名称
    area.appendChild(text('供应链管理平台', C.white, 14, { style:'Medium', lh:20, x:64, y:14 }));
    const sub = text('SUPPLY CHAIN MGMT', C.white, 6, { lh:10, a:0.6, x:64, y:38 });
    area.appendChild(sub);
    return area;
  }

  // hasChildren: 是否渲染展开/收起箭头（叶节点不需要）
  function makeSidebarItem(label, level, state, iconKey=null, hasChildren=false) {
    const bg = level === 2 ? C.sidebarSub : C.sidebarBg;
    const isActive = state === 'active' || state === 'expanded';
    const op = isActive ? 1 : 0.5;

    const row = frame(`L${level}·${label}`, 208, 48, bg);
    row.opacity = op;

    // L1 图标
    if (level === 1 && iconKey) {
      const ic = icon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }

    const textX = level === 1 ? 52 : 40;
    row.appendChild(text(label, C.white, 14, { lh:22, x:textX, y:13 }));

    // 仅 hasChildren 时添加箭头
    if (hasChildren) {
      const arrowKey = state === 'expanded' ? 'PutAway-Arrow' : 'DropDown-Arrow';
      const arr = icon(arrowKey, 12, C.white, 1);
      if (arr) { arr.x = 184; arr.y = 18; row.appendChild(arr); }
    }
    return row;
  }

  function makeSidebarDivider() {
    const w = frame('SidebarDivider', 208, 1, null);
    w.clipsContent = false;
    w.appendChild(rect(160, 1, C.white, { a:0.08, x:24, y:0 }));
    return w;
  }

  function makeSidebar(height) {
    const s = figma.createFrame();
    s.name = '侧边栏';
    s.layoutMode = 'VERTICAL'; s.itemSpacing = 0;
    s.primaryAxisSizingMode = 'FIXED'; s.counterAxisSizingMode = 'FIXED';
    s.resize(208, height); s.fills = solid(C.sidebarBg); s.clipsContent = false;

    s.appendChild(makeSidebarLogo());
    s.appendChild(makeSidebarDivider());
    // 订单管理（折叠，无子项展示）
    s.appendChild(makeSidebarItem('订单管理', 1, 'inactive', 'package', true));
    // 销售管理（展开，active）
    s.appendChild(makeSidebarItem('销售管理', 1, 'expanded', 'briefcase', true));
    s.appendChild(makeSidebarItem('合同管理', 2, 'active', null, false));
    s.appendChild(makeSidebarDivider());
    // 基础档案（折叠）
    s.appendChild(makeSidebarItem('基础档案', 1, 'inactive', 'archive', true));
    return s;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  页头（components.md 标准规范）
  // ─────────────────────────────────────────────────────────────────────
  function makeHeaderBar(totalW) {
    const bar = frame('HeaderBar', totalW, 48, C.white);
    // 底部分割线
    bar.appendChild(rect(totalW, 1, C.black, { a:0.10, x:0, y:47 }));

    // 左：侧边栏收起图标（sidebar，非 menu）
    const icSide = icon('sidebar', 16, C.black, 0.65);
    if (icSide) { icSide.x = 24; icSide.y = 16; bar.appendChild(icSide); }

    // 左：租户切换框（repeat 图标在右侧）
    const sw = frame('租户切换', 200, 32, C.white, {
      r:2, x:48, y:8,
      stroke:C.black, strokeA:0.15, strokeW:1,
    });
    bar.appendChild(sw);
    sw.appendChild(text('租户切换', C.black, 14, { lh:22, a:0.25, x:12, y:5 }));
    const icRepeat = icon('repeat', 14, C.black, 0.45);
    if (icRepeat) { icRepeat.x = 200 - 22; icRepeat.y = 9; sw.appendChild(icRepeat); }

    // 右区域起点
    const rightStart = totalW - 24 - 223;

    // Search / Download / Bell
    [['search', 0], ['download', 40], ['bell', 80]].forEach(([key, dx]) => {
      const ic = icon(key, 16, C.black, 0.65);
      if (ic) { ic.x = rightStart + dx; ic.y = 16; bar.appendChild(ic); }
    });

    // 竖线分隔
    bar.appendChild(rect(1, 16, C.black, { a:0.10, x:rightStart + 112, y:16 }));

    // 头像
    const avatar = figma.createEllipse();
    avatar.resize(24, 24);
    avatar.x = rightStart + 129; avatar.y = 12;
    avatar.fills = solid(C.primaryL20);
    bar.appendChild(avatar);

    // 用户名
    bar.appendChild(text('碧小园', C.black, 14, { lh:22, a:0.85, x:rightStart+161, y:13 }));

    // 下拉箭头（DropDown-Arrow，x=207 相对右区域）
    const icArr = icon('DropDown-Arrow', 12, C.black, 0.45);
    if (icArr) { icArr.x = rightStart + 207; icArr.y = 18; bar.appendChild(icArr); }

    return bar;
  }

  function makeBreadcrumbBar(totalW, crumbs=[]) {
    const bar = frame('BreadcrumbBar', totalW, 48, C.white);
    bar.appendChild(rect(totalW, 1, C.black, { a:0.10, x:0, y:47 }));

    // 当前页标题（最后一个面包屑）
    const currentTitle = crumbs[crumbs.length - 1] || '';
    bar.appendChild(text(currentTitle, C.black, 16, { style:'Medium', lh:24, a:0.85, x:24, y:12 }));

    // 面包屑路径（在标题右侧）
    let cx = 24 + 2 + 16 * (currentTitle.length) + 8; // 粗估标题后位置，用 x=104 起
    cx = 104;
    crumbs.forEach((crumb, i) => {
      const t = text(crumb, C.black, 14, { lh:22, a:0.65, x:cx, y:13 });
      bar.appendChild(t);
      cx += t.width;
      if (i < crumbs.length - 1) {
        const arr = icon('chevron-right', 12, C.black, 0.45);
        if (arr) { arr.x = cx + 4; arr.y = 18; bar.appendChild(arr); cx += 20; }
      }
    });
    return bar;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  筛选区（10 个字段，4 行布局）
  // ─────────────────────────────────────────────────────────────────────
  const LABEL_W  = 112;
  const LABEL_GAP = 12;
  const INPUT_W  = 255;   // 379 - 112 - 12
  const COL_X    = [24, 411, 798];   // 3列起点

  function addFilter(parent, label, col, row, fieldType) {
    const x0 = COL_X[col], y0 = 24 + row * 48;
    parent.appendChild(text(label, C.black, 14, { lh:22, a:0.65, x:x0, y:y0+5 }));
    const inputX = x0 + LABEL_W + LABEL_GAP;
    if (fieldType === 'select') {
      const sel = frame(`sel-${label}`, INPUT_W, 32, C.white, {
        r:2, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1,
      });
      parent.appendChild(sel);
      sel.appendChild(text('请选择', C.black, 14, { lh:22, a:0.25, x:12, y:5 }));
      const arr = icon('DropDown-Arrow', 12, C.black, 0.35);
      if (arr) { arr.x = INPUT_W - 20; arr.y = 10; sel.appendChild(arr); }
    } else {
      const inp = frame(`inp-${label}`, INPUT_W, 32, C.white, {
        r:2, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1,
      });
      parent.appendChild(inp);
      inp.appendChild(text('请输入', C.black, 14, { lh:22, a:0.25, x:12, y:5 }));
    }
  }

  // 日期/金额区间：label + [input1][至][input2]
  // singleInputW：每个小输入框的宽度
  function addRangeFilter(parent, label, x0, row, singleW=110, placeholder='请选择') {
    const y0 = 24 + row * 48;
    parent.appendChild(text(label, C.black, 14, { lh:22, a:0.65, x:x0, y:y0+5 }));
    const inputX = x0 + LABEL_W + LABEL_GAP;
    const inp1 = frame(`inp-${label}-1`, singleW, 32, C.white, {
      r:2, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1,
    });
    parent.appendChild(inp1);
    inp1.appendChild(text(placeholder, C.black, 14, { lh:22, a:0.25, x:8, y:5 }));
    parent.appendChild(text('至', C.black, 14, { lh:22, a:0.45, x:inputX+singleW+6, y:y0+5 }));
    const inp2 = frame(`inp-${label}-2`, singleW, 32, C.white, {
      r:2, x:inputX+singleW+22, y:y0, stroke:C.black, strokeA:0.15, strokeW:1,
    });
    parent.appendChild(inp2);
    inp2.appendChild(text(placeholder, C.black, 14, { lh:22, a:0.25, x:8, y:5 }));
  }

  function buildFilterActions(mainCard, y) {
    let bx = CARD_W - PAD;
    // 收起
    const colT = text('收起', C.primary, 14, { lh:22 });
    const arrUp = icon('PutAway-Arrow', 16, C.primary, 0.85);
    const colW = colT.width + (arrUp ? 20 : 0);
    colT.x = bx - colW; colT.y = y + 5; mainCard.appendChild(colT);
    if (arrUp) { arrUp.x = bx - 16; arrUp.y = y + 8; mainCard.appendChild(arrUp); }
    bx = bx - colW - 16;
    // 重置
    const rstW = 64;
    const rstBtn = frame('btn-重置', rstW, 32, C.white, {
      r:2, x:bx - rstW, y, stroke:C.black, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(rstBtn);
    const rstT = text('重置', C.black, 14, { lh:22, a:0.65 });
    rstT.x = Math.round((rstW - rstT.width) / 2); rstT.y = 5; rstBtn.appendChild(rstT);
    bx = bx - rstW - 8;
    // 查询
    const qryW = 64;
    const qryBtn = frame('btn-查询', qryW, 32, C.primary, { r:2, x:bx - qryW, y });
    mainCard.appendChild(qryBtn);
    const qryT = text('查询', C.white, 14, { lh:22 });
    qryT.x = Math.round((qryW - qryT.width) / 2); qryT.y = 5; qryBtn.appendChild(qryT);
  }

  function buildTableToolbar(mainCard, y) {
    // 左：记录总数
    mainCard.appendChild(text('合同记录 6 条', C.black, 14, { lh:22, a:0.65, x:PAD, y:y+5 }));
    // 右：导出 + 新增合同
    let bx = CARD_W - PAD;
    const addLbl = '新增合同';
    const addW   = 12 + 16 + 8 + 56 + 12; // icon+gap+text+padding ≈ 104
    bx -= addW;
    const addBtn = frame('btn-新增合同', addW, 32, C.primary, { r:2, x:bx, y });
    mainCard.appendChild(addBtn);
    const icAdd = icon('Add', 16, C.white, 1);
    if (icAdd) { icAdd.x = 12; icAdd.y = 8; addBtn.appendChild(icAdd); }
    addBtn.appendChild(text(addLbl, C.white, 14, { lh:22, x:36, y:5 }));
    bx -= 8;
    const expW = 72;
    bx -= expW;
    const expBtn = frame('btn-导出', expW, 32, C.white, {
      r:2, x:bx, y, stroke:C.black, strokeA:0.15, strokeW:1,
    });
    mainCard.appendChild(expBtn);
    const expT = text('导出', C.black, 14, { lh:22, a:0.65 });
    expT.x = Math.round((expW - expT.width) / 2); expT.y = 5; expBtn.appendChild(expT);
  }

  // ─────────────────────────────────────────────────────────────────────
  //  表格单元格工厂
  // ─────────────────────────────────────────────────────────────────────
  function makeTableHeader(colW, label) {
    const cell = frame('TableHeader', colW, HEADER_H, null);
    cell.fills = [{ type:'SOLID', color:C.black, opacity:0.04 }];
    cell.clipsContent = false;
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Medium' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = label;
    t.fills      = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'NONE';
    t.resize(colW - 32, 22);
    t.textTruncation = 'ENDING';
    t.x = 16; t.y = 13;
    cell.appendChild(t);
    return cell;
  }

  function makeTableCell(colW, content, truncate=false) {
    const cell = frame('TableCell', colW, ROW_H, C.white);
    cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H-1 }));
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = content;
    t.fills      = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'NONE';
    t.resize(colW - 32, 22);
    if (truncate) t.textTruncation = 'ENDING';
    t.x = 16; t.y = 13;
    cell.appendChild(t);
    return cell;
  }

  function makeLinkCell(colW, content) {
    const cell = frame('LinkCell', colW, ROW_H, C.white);
    cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H-1 }));
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = content; t.fills = solid(C.primary);
    t.textAutoResize = 'NONE';
    t.resize(colW - 32, 22);
    t.x = 16; t.y = 13;
    cell.appendChild(t);
    return cell;
  }

  function makeTagCell(colW, label, bg, txtColor, opacity=1) {
    const cell = frame('TagCell', colW, ROW_H, C.white);
    cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H-1 }));
    const tLabel = figma.createText();
    tLabel.fontName = { family:'PingFang SC', style:'Regular' };
    tLabel.fontSize = 12; tLabel.lineHeight = { value:20, unit:'PIXELS' };
    tLabel.characters = label; tLabel.fills = solid(txtColor, opacity);
    tLabel.textAutoResize = 'WIDTH_AND_HEIGHT';
    tLabel.x = 8; tLabel.y = 1;
    const tagW = tLabel.width + 16, tagH = 22;
    const tag = frame('tag', tagW, tagH, bg);
    tag.cornerRadius = 2; tag.clipsContent = false;
    tag.x = 8; tag.y = Math.round((ROW_H - tagH) / 2);
    tag.appendChild(tLabel);
    cell.appendChild(tag);
    return cell;
  }

  function makeAmountCell(colW, amount) {
    const cell = frame('AmountCell', colW, ROW_H, C.white);
    cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H-1 }));
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = amount;
    t.fills      = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 0; t.y = 13;
    cell.appendChild(t);
    t.x = colW - t.width - 16;   // 右对齐
    return cell;
  }

  // ops: [{ label, color, x }]
  function makeActionCell(colW, ops) {
    const cell = frame('ActionCell', colW, ROW_H, C.white);
    cell.clipsContent = false;
    cell.appendChild(rect(colW, 1, C.black, { a:0.06, x:0, y:ROW_H-1 }));
    ops.forEach(({ label, color, x }) => {
      const btn = figma.createText();
      btn.fontName   = { family:'PingFang SC', style:'Regular' };
      btn.fontSize   = 14; btn.lineHeight = { value:22, unit:'PIXELS' };
      btn.characters = label; btn.fills = solid(color);
      btn.x = x; btn.y = 13;
      cell.appendChild(btn);
    });
    return cell;
  }

  // 竖向列帧（VERTICAL AUTO + FIXED 宽度）
  function makeVCol(colW, label, cellBuilders) {
    const col = figma.createFrame();
    col.name = label;
    col.layoutMode = 'VERTICAL'; col.itemSpacing = 0;
    col.primaryAxisSizingMode = 'AUTO'; col.counterAxisSizingMode = 'FIXED';
    col.resize(colW, HEADER_H + cellBuilders.length * ROW_H);
    col.fills = [];
    col.appendChild(makeTableHeader(colW, label));
    cellBuilders.forEach(b => col.appendChild(b()));
    return col;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  数据 & 配置
  // ─────────────────────────────────────────────────────────────────────
  const STATUS_CFG = {
    '已生效':    { bg:C.successL90, txt:C.success,  a:1    },
    '待财务审核':{ bg:C.warningL90, txt:C.warning,  a:1    },
    '草稿':      { bg:C.tagGrayBg,  txt:C.black,    a:0.65 },
    '已终止':    { bg:C.dangerL90,  txt:C.danger,   a:1    },
    '已到期':    { bg:C.tagGrayBg,  txt:C.black,    a:0.45 },
    '审核驳回':  { bg:C.dangerL90,  txt:C.danger,   a:1    },
  };
  const BLUE_TAG = { bg:C.primaryL90, txt:C.primary };

  function getOps(status) {
    const P = C.primary, G = C.green, R = C.red;
    const map = {
      '待财务审核': [
        { label:'详情',        color:P, x:16  },
        { label:'查看BIP审批信息', color:P, x:60  },
        { label:'财务通过',    color:G, x:184 },
        { label:'财务驳回',    color:R, x:256 },
      ],
      '已生效':    [{ label:'详情', color:P, x:16 }, { label:'终止', color:R, x:60 }],
      '草稿':      [
        { label:'详情', color:P, x:16 },
        { label:'编辑', color:P, x:60 },
        { label:'提交审核', color:G, x:104 },
      ],
      '审核驳回':  [
        { label:'详情', color:P, x:16 },
        { label:'编辑', color:P, x:60 },
        { label:'提交审核', color:G, x:104 },
      ],
      '已终止':    [{ label:'详情', color:P, x:16 }],
      '已到期':    [{ label:'详情', color:P, x:16 }],
    };
    return map[status] || [{ label:'详情', color:P, x:16 }];
  }

  // 表格数据（贴近原型真实数据）
  const rows = [
    { id:'HT202605180001', client:'碧桂园物业广州区域', name:'碧桂园物业广州区域综合服务合同', scene:'企业订单', ctype:'标准合同',   status:'待财务审核', bip:'BIP202605180021', total:'¥2,800,000.00', ordered:'¥1,500,000.00', sales:'王明（GH001）',  start:'2026-05-18', end:'2027-05-17' },
    { id:'HT202605170002', client:'万科物业深圳公司',   name:'万科物业园区安全管理服务协议',   scene:'标准服务', ctype:'无金额合同', status:'已生效',    bip:'BIP202605170015', total:'¥0.00',         ordered:'¥0.00',         sales:'李华（GH002）',  start:'2026-05-17', end:'2027-05-16' },
    { id:'HT202605160003', client:'龙湖物业重庆分公司', name:'龙湖物业重庆绿化养护服务合同',   scene:'企业订单', ctype:'标准合同',   status:'草稿',      bip:'-',               total:'¥480,000.00',   ordered:'¥0.00',         sales:'张磊（GH003）',  start:'2026-05-16', end:'2026-11-15' },
    { id:'HT202605150004', client:'保利物业北京区域',   name:'保利物业北京区域设备维护合同',   scene:'标准服务', ctype:'标准合同',   status:'审核驳回',  bip:'BIP202605150008', total:'¥320,000.00',   ordered:'¥0.00',         sales:'陈静（GH004）',  start:'2026-05-15', end:'2026-11-14' },
    { id:'HT202605140005', client:'中海物业上海公司',   name:'中海物业上海区域清洁服务合同',   scene:'企业订单', ctype:'无金额合同', status:'已终止',    bip:'BIP202605140003', total:'¥0.00',         ordered:'¥0.00',         sales:'刘洋（GH005）',  start:'2026-05-14', end:'2026-11-13' },
    { id:'HT202605130006', client:'金地物业西安分公司', name:'金地物业西安智能安防服务合同',   scene:'标准服务', ctype:'标准合同',   status:'已到期',    bip:'BIP202605130001', total:'¥150,000.00',   ordered:'¥150,000.00',   sales:'赵敏（GH006）',  start:'2025-05-13', end:'2026-05-12' },
  ];

  // ── 列宽（max(表头, 最长数据) + 32px；>15字截断）────────────────────
  // 合同编号: "HT202605180001"(14 ASCII×8.4=118) → 118+32=150 → 取 148（表头"合同编号"4CJK=56 < 118）
  // 客户名称: "碧桂园物业广州区域"(9CJK×14=126) → 126+32=158 → 160
  // 合同名称: >15字截断，显示宽取 15×14=210 → 210+32=242 → 220（截断）
  // 合同场景: "企业订单"(4CJK=56) → 56+32=88
  // 合同类型: "无金额合同"(5CJK=70) → 70+32=102 → 104
  // 合同状态: "待财务审核"(5CJK=70) → 70+32=102 → 104
  // BIP审批编号: "BIP202605180021"(15ASCII=126) → 126+32=158 → 160
  // 合同总金额: "¥2,800,000.00"(13ASCII=109) → 109+32=141 → 144
  // 已下单金额: 同上 → 144
  // 销售人员: "王明（GH001）"(≈96) → 96+32=128
  // 生效日期: "2026-05-18"(10ASCII=84) → 84+32=116
  // 到期日期: 同上 → 116
  // 操作: 4 按钮最宽 256+"财务驳回"4CJK=312 → 320
  const CW = {
    id:      148,
    client:  160,
    name:    220,   // 截断列
    scene:    88,
    ctype:   104,
    status:  104,
    bip:     160,
    total:   144,
    ordered: 144,
    sales:   128,
    start:   116,
    end:     116,
    ops:     320,   // 右冻结
  };
  // 中间列总宽：160+220+88+104+104+160+144+144+128+116+116 = 1484
  // 全部列总宽：148+1484+320 = 1952 > TBL_W(1152) → 启用冻结表格 ✓

  // ─────────────────────────────────────────────────────────────────────
  //  带冻结表格
  //  结构：
  //    TableWrapper (w=TBL_W=1152, h=TABLE_WRAPPER_H, clipsContent=true)
  //    ├── AllCols   (HORIZONTAL, 1952px, 含全部13列，x=0,y=0)
  //    ├── LeftFrozen  (VERTICAL, w=148, x=0, y=0, SHADOW_FREEZE_LEFT)
  //    ├── RightFrozen (VERTICAL, w=320, x=832, y=0, SHADOW_FREEZE_RIGHT)
  //    └── Scrollbar   (w=TBL_W, h=16, y=TABLE_CONTENT_H)
  // ─────────────────────────────────────────────────────────────────────
  function buildFrozenTable() {
    const wrapper = figma.createFrame();
    wrapper.name = 'FrozenTable';
    wrapper.resize(TBL_W, TABLE_WRAPPER_H);
    wrapper.fills = []; wrapper.clipsContent = true;

    // ── 全量列帧（HORIZONTAL，1952px，被 clipsContent 裁剪至 1152）
    const allCols = figma.createFrame();
    allCols.name = 'AllColumns';
    allCols.layoutMode = 'HORIZONTAL'; allCols.itemSpacing = 0;
    allCols.primaryAxisSizingMode = 'AUTO'; allCols.counterAxisSizingMode = 'AUTO';
    allCols.fills = [];
    allCols.x = 0; allCols.y = 0;

    // 合同编号（也是 LeftFrozen 来源，在 AllCols 内占位即可，被冻结层覆盖）
    allCols.appendChild(makeVCol(CW.id,      '合同编号',   rows.map(r => () => makeLinkCell(CW.id, r.id))));
    allCols.appendChild(makeVCol(CW.client,  '客户名称',   rows.map(r => () => makeTableCell(CW.client, r.client))));
    allCols.appendChild(makeVCol(CW.name,    '合同名称',   rows.map(r => () => makeTableCell(CW.name, r.name, true))));
    allCols.appendChild(makeVCol(CW.scene,   '合同场景',   rows.map(r => () => makeTagCell(CW.scene,  r.scene,  BLUE_TAG.bg, BLUE_TAG.txt))));
    allCols.appendChild(makeVCol(CW.ctype,   '合同类型',   rows.map(r => () => makeTagCell(CW.ctype,  r.ctype,  BLUE_TAG.bg, BLUE_TAG.txt))));
    allCols.appendChild(makeVCol(CW.status,  '合同状态',   rows.map(r => () => {
      const cfg = STATUS_CFG[r.status] || STATUS_CFG['草稿'];
      return makeTagCell(CW.status, r.status, cfg.bg, cfg.txt, cfg.a);
    })));
    allCols.appendChild(makeVCol(CW.bip,     'BIP审批编号', rows.map(r => () => makeTableCell(CW.bip, r.bip))));
    allCols.appendChild(makeVCol(CW.total,   '合同总金额', rows.map(r => () => makeAmountCell(CW.total, r.total))));
    allCols.appendChild(makeVCol(CW.ordered, '已下单金额', rows.map(r => () => makeAmountCell(CW.ordered, r.ordered))));
    allCols.appendChild(makeVCol(CW.sales,   '销售人员',   rows.map(r => () => makeTableCell(CW.sales, r.sales))));
    allCols.appendChild(makeVCol(CW.start,   '生效日期',   rows.map(r => () => makeTableCell(CW.start, r.start))));
    allCols.appendChild(makeVCol(CW.end,     '到期日期',   rows.map(r => () => makeTableCell(CW.end, r.end))));
    allCols.appendChild(makeVCol(CW.ops,     '操作',       rows.map(r => () => makeActionCell(CW.ops, getOps(r.status)))));

    wrapper.appendChild(allCols);

    // ── 左冻结列覆盖（白底 + 向右阴影）
    const leftFrozen = makeVCol(CW.id, '合同编号-冻结', rows.map(r => () => makeLinkCell(CW.id, r.id)));
    leftFrozen.name = 'LeftFrozen';
    leftFrozen.fills = solid(C.white);  // 确保覆盖底层
    leftFrozen.effects = [SHADOW_FREEZE_LEFT];
    leftFrozen.x = 0; leftFrozen.y = 0;
    wrapper.appendChild(leftFrozen);

    // ── 右冻结列覆盖（白底 + 向左阴影）
    const rightFrozen = makeVCol(CW.ops, '操作-冻结', rows.map(r => () => makeActionCell(CW.ops, getOps(r.status))));
    rightFrozen.name = 'RightFrozen';
    rightFrozen.fills = solid(C.white);
    rightFrozen.effects = [SHADOW_FREEZE_RIGHT];
    rightFrozen.x = TBL_W - CW.ops;  // 1152 - 320 = 832
    rightFrozen.y = 0;
    wrapper.appendChild(rightFrozen);

    // ── 水平滚动条（components.md 规范）
    const sbTrack = frame('ScrollbarTrack', TBL_W, SCROLLBAR_H, hex('#FAFAFA'), {
      x:0, y:TABLE_CONTENT_H,
    });
    sbTrack.clipsContent = false;
    // 上边框
    sbTrack.appendChild(rect(TBL_W, 1, hex('#EDEDED'), { x:0, y:0 }));
    // 滑块（宽度约 30% 表示当前滚动位置，h=8 r=4 垂直居中 y=4）
    sbTrack.appendChild(rect(Math.round(TBL_W * 0.3), 8, hex('#D8D8D8'), { r:4, x:16, y:4 }));
    // 下边框
    sbTrack.appendChild(rect(TBL_W, 1, hex('#EDEDED'), { x:0, y:SCROLLBAR_H-1 }));
    wrapper.appendChild(sbTrack);

    return wrapper;
  }

  // ─────────────────────────────────────────────────────────────────────
  //  分页
  // ─────────────────────────────────────────────────────────────────────
  function buildFullPagination(mainCard, y, total, currentPage, pageCount) {
    const BTN=32, GAP=4; let px=CARD_W-PAD;
    const tPage=text('页',C.black,14,{lh:22,a:0.85});
    tPage.x=px-tPage.width; tPage.y=y+5; mainCard.appendChild(tPage); px=tPage.x-4;
    const jumpBox=frame('jump-input',40,BTN,C.white,{r:2,x:px-40,y,stroke:C.black,strokeA:0.15,strokeW:1});
    mainCard.appendChild(jumpBox);
    const tJ=text(String(currentPage),C.black,14,{lh:22,a:0.65});
    tJ.x=Math.round((40-tJ.width)/2); tJ.y=5; jumpBox.appendChild(tJ); px=px-40-4;
    const tGoto=text('跳转至',C.black,14,{lh:22,a:0.65});
    tGoto.x=px-tGoto.width; tGoto.y=y+5; mainCard.appendChild(tGoto); px=tGoto.x-12;
    function mkBtn(label,isActive) {
      const b=frame('pgbtn-'+label,BTN,BTN,isActive?C.primary:C.white,
        {r:2,x:px-BTN,y,stroke:isActive?undefined:C.black,strokeA:0.15,strokeW:1});
      mainCard.appendChild(b);
      const t=text(label,isActive?C.white:C.black,14,{lh:22,a:isActive?1:0.85});
      t.x=Math.round((BTN-t.width)/2); t.y=Math.round((BTN-22)/2); b.appendChild(t);
      px-=BTN+GAP;
    }
    mkBtn('›',false);
    for (let p=pageCount;p>=1;p--) mkBtn(String(p),p===currentPage);
    mkBtn('‹',false); px-=(8-GAP);
    const PS_W=96;
    const psBox=frame('page-size',PS_W,BTN,C.white,{r:2,x:px-PS_W,y,stroke:C.black,strokeA:0.15,strokeW:1});
    mainCard.appendChild(psBox);
    psBox.appendChild(text('20条/页',C.black,14,{lh:22,a:0.65,x:10,y:5}));
    const psArr=icon('DropDown-Arrow',12,C.black,0.35);
    if (psArr){psArr.x=PS_W-20;psArr.y=10;psBox.appendChild(psArr);}
    px=px-PS_W-16;
    const tTotal=text(`共 ${total} 条`,C.black,14,{lh:22,a:0.65});
    tTotal.x=px-tTotal.width; tTotal.y=y+5; mainCard.appendChild(tTotal);
  }

  // ─────────────────────────────────────────────────────────────────────
  //  页面组装
  // ─────────────────────────────────────────────────────────────────────
  const root = figma.createFrame();
  root.name = '合同管理列表页';
  root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name = '合同管理';

  // 侧边栏
  const sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0; root.appendChild(sidebar);

  // 主区域
  const main = figma.createFrame();
  main.name = '主区域'; main.resize(MAIN_W, CANVAS_H);
  main.fills = []; main.x = SIDE_W; main.y = 0;
  root.appendChild(main);

  // ── HeaderBar（y=0, h=48）
  const headerBar = makeHeaderBar(MAIN_W);
  headerBar.x = 0; headerBar.y = 0; main.appendChild(headerBar);

  // ── BreadcrumbBar（y=48，紧贴 HeaderBar，无间距）
  const breadBar = makeBreadcrumbBar(MAIN_W, ['首页', '销售管理', '合同管理']);
  breadBar.x = 0; breadBar.y = NAV_H; main.appendChild(breadBar);

  // ── 内容卡片
  const cardY = NAV_H + TITLE_H + OUTER_PAD; // 48+48+16=112
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, {
    r:8, x:OUTER_PAD, y:cardY, clip:false,
  });
  main.appendChild(mainCard);

  // ── 筛选区（10 个字段，4 行，无额外分割线）
  // Row 0
  addFilter(mainCard, '合同编号', 0, 0, 'text');
  addFilter(mainCard, '客户名称', 1, 0, 'text');
  addFilter(mainCard, '合同场景', 2, 0, 'select');
  // Row 1
  addFilter(mainCard, '合同类型', 0, 1, 'select');
  addFilter(mainCard, '合同状态', 1, 1, 'select');
  addFilter(mainCard, '销售人员', 2, 1, 'text');
  // Row 2：BIP审批编号（普通），签订日期区间（范围）
  addFilter(mainCard, 'BIP审批编号', 0, 2, 'text');
  addRangeFilter(mainCard, '签订日期', COL_X[1], 2, 110, '请选择日期');
  // Row 3：到期日期区间（范围），合同金额区间（范围，x=600）
  addRangeFilter(mainCard, '到期日期', COL_X[0], 3, 110, '请选择日期');
  addRangeFilter(mainCard, '合同金额', 600, 3, 100, '请输入金额');

  // 筛选操作按钮
  buildFilterActions(mainCard, FILTER_ACT_Y);

  // ── 工具栏（无分割线）
  buildTableToolbar(mainCard, TOOLBAR_Y);

  // ── 带冻结表格
  const frozenTable = buildFrozenTable();
  frozenTable.x = PAD; frozenTable.y = TBL_Y;
  mainCard.appendChild(frozenTable);

  // ── 分页
  buildFullPagination(mainCard, PAGER_Y, 68, 1, 4);

  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin('✅ 合同管理列表页 v8 已生成（1440×864）');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
