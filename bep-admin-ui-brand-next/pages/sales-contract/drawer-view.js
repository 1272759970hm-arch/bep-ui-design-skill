// ── D-02 销售管理·查看合同抽屉 ─────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-27
// 标签页（基本信息/关联订单/操作日志）+ 描述列表 + 状态标签

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "close":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
  const DRAWER_W   = 680;
  const DRW_HDR_H  = 56;
  const TAB_H      = 40;
  const DRW_FTR_H  = 64;
  const FORM_PAD   = 24;
  const LBL_GAP    = 12;
  const DESC_ROW_H = 40; // 9+22+9，视觉间距与表单字段保持一致

  // ── 标签列宽测量 ─────────────────────────────────────────────────────────
  var _tmpLbls = ['合同状态','合同类型','合同编号','合同名称','客户名称',
                  '客户签约主体','销售人员','生效日期','到期日期',
                  '合同总金额','结算方式','付款条款','合同附件'].map(function(l) {
    return text(l, C.black, 14, { lh:22 });
  });
  var MAX_LBL_TEXT_W = Math.max.apply(null, _tmpLbls.map(function(t) { return t.width; }));
  _tmpLbls.forEach(function(t) { t.remove(); });
  var LBL_W = MAX_LBL_TEXT_W + 12;

  // ── makeBtn（含 danger 类型）─────────────────────────────────────────────
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
      btn.fills = solid(C.white);
      btn.strokes = [{ type:'SOLID', color:C.danger }];
      btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
      tFills = solid(C.danger);
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

  // ── 状态标签 ─────────────────────────────────────────────────────────────
  function makeTag(label, type) {
    var palettes = {
      success: { bg:hex('#F6FFED'), text:hex('#3BBB3E'), border:hex('#B7EB8F') },
      warning: { bg:hex('#FFFBE6'), text:hex('#FFA645'), border:hex('#FFE58F') },
      error:   { bg:hex('#FFF2F0'), text:hex('#FE5E54'), border:hex('#FFCCC7') },
      default: { bg:hex('#FAFAFA'), text:hex('#000000'), border:hex('#D9D9D9') },
    };
    var p = palettes[type] || palettes.default;
    var tag = figma.createFrame();
    tag.name = 'Tag/' + label; tag.cornerRadius = 2; tag.clipsContent = false;
    tag.layoutMode = 'HORIZONTAL';
    tag.primaryAxisSizingMode = 'AUTO'; tag.counterAxisSizingMode = 'AUTO';
    tag.paddingLeft = 7; tag.paddingRight = 7; tag.paddingTop = 1; tag.paddingBottom = 1;
    tag.counterAxisAlignItems = 'CENTER';
    tag.fills = [{ type:'SOLID', color:p.bg }];
    tag.strokes = [{ type:'SOLID', color:p.border }];
    tag.strokeWeight = 1; tag.strokeAlign = 'INSIDE';
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 12; t.lineHeight = { value:20, unit:'PIXELS' };
    t.characters = label;
    t.fills = [{ type:'SOLID', color:p.text }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    tag.appendChild(t);
    return tag;
  }

  // ── 描述列表值节点 ───────────────────────────────────────────────────────
  function makeDescVal(str) {
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = str;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    return t;
  }

  function makeDescFileLink(filename) {
    var f = figma.createFrame();
    f.name = 'FileLink'; f.fills = []; f.clipsContent = false;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    f.counterAxisAlignItems = 'CENTER'; f.itemSpacing = 4;
    var ic = icon('file-text', 14, C.primary, 1);
    if (ic) { ic.layoutAlign = 'CENTER'; f.appendChild(ic); }
    var t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = filename;
    t.fills = solid(C.primary);
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    f.appendChild(t);
    return f;
  }

  // ── 描述行（单行，标签 45% 透明度，值 85% 透明度）────────────────────────
  function makeDescRow(labelText, valueNode) {
    var contentW = DRAWER_W - FORM_PAD * 2;
    var f = figma.createFrame();
    f.name = 'DescRow/' + labelText;
    f.resize(contentW, DESC_ROW_H); f.fills = []; f.clipsContent = false;
    var lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = labelText;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.45 }];
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    lbl.x = LBL_W - lbl.width;
    lbl.y = Math.round((DESC_ROW_H - 22) / 2);
    f.appendChild(lbl);
    valueNode.x = LBL_W + LBL_GAP;
    valueNode.y = Math.round((DESC_ROW_H - valueNode.height) / 2);
    f.appendChild(valueNode);
    return f;
  }

  // ── 标签页栏 ─────────────────────────────────────────────────────────────
  function makeTabBar() {
    var bar = figma.createFrame();
    bar.name = 'TabBar'; bar.resize(DRAWER_W, TAB_H);
    bar.fills = solid(C.white); bar.clipsContent = false;
    bar.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:TAB_H - 1 }));
    var tabDefs = [
      { label:'基本信息', active:true  },
      { label:'关联订单', active:false },
      { label:'操作日志', active:false },
    ];
    var xCursor = FORM_PAD;
    tabDefs.forEach(function(def) {
      var TAB_PH = 12;
      var lbl = figma.createText();
      lbl.fontName = { family:'PingFang SC', style:def.active ? 'Medium' : 'Regular' };
      lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
      lbl.characters = def.label;
      lbl.fills = def.active ? solid(C.primary) : [{ type:'SOLID', color:C.black, opacity:0.65 }];
      lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
      var tabW = Math.ceil(lbl.width) + TAB_PH * 2;
      var tabItem = figma.createFrame();
      tabItem.name = 'Tab/' + def.label;
      tabItem.resize(tabW, TAB_H); tabItem.fills = []; tabItem.clipsContent = false;
      lbl.x = TAB_PH;
      lbl.y = Math.round((TAB_H - 22) / 2);
      tabItem.appendChild(lbl);
      if (def.active) {
        var ind = figma.createRectangle();
        ind.resize(tabW, 2); ind.fills = solid(C.primary);
        ind.x = 0; ind.y = TAB_H - 2;
        tabItem.appendChild(ind);
      }
      tabItem.x = xCursor; tabItem.y = 0;
      xCursor += tabW;
      bar.appendChild(tabItem);
    });
    return bar;
  }

  // ── 侧边栏（与 D-01 相同）────────────────────────────────────────────────
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

  // ── 抽屉 ──────────────────────────────────────────────────────────────────
  function buildDrawer() {
    var drawer = figma.createFrame();
    drawer.name = '抽屉/查看合同'; drawer.resize(DRAWER_W, CANVAS_H);
    drawer.fills = solid(C.white); drawer.clipsContent = false;
    drawer.effects = [{
      type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
      color:{r:0,g:0,b:0,a:0.15}, offset:{x:-4,y:0}, radius:16, spread:0
    }];

    // 标题栏
    var header = figma.createFrame();
    header.name = 'DrawerHeader'; header.resize(DRAWER_W, DRW_HDR_H);
    header.fills = solid(C.white); header.clipsContent = false;
    header.appendChild(text('查看合同', C.black, 16, { style:'Medium', lh:24, a:0.85, x:24, y:16 }));
    var closeIc = icon('close', 16, C.black, 0.45);
    if (closeIc) { closeIc.x = DRAWER_W - 36; closeIc.y = 20; header.appendChild(closeIc); }
    header.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:DRW_HDR_H - 1 }));
    header.x = 0; header.y = 0;
    drawer.appendChild(header);

    // 标签页栏
    var tabBar = makeTabBar();
    tabBar.x = 0; tabBar.y = DRW_HDR_H;
    drawer.appendChild(tabBar);

    // 描述列表区域
    var body = figma.createFrame();
    body.name = 'DrawerBody'; body.fills = solid(C.white); body.clipsContent = false;

    var rows = [];
    rows.push(makeDescRow('合同状态',    makeTag('生效中', 'success')));
    rows.push(makeDescRow('合同类型',    makeDescVal('框架合同')));
    rows.push(makeDescRow('合同编号',    makeDescVal('HT-2026-001234')));
    rows.push(makeDescRow('合同名称',    makeDescVal('碧桂园物业服务合作合同')));
    rows.push(makeDescRow('客户名称',    makeDescVal('深圳市某置业有限公司')));
    rows.push(makeDescRow('客户签约主体', makeDescVal('碧桂园服务控股有限公司')));
    rows.push(makeDescRow('销售人员',    makeDescVal('李明')));
    rows.push(makeDescRow('生效日期',    makeDescVal('2026-01-01')));
    rows.push(makeDescRow('到期日期',    makeDescVal('2026-12-31')));
    rows.push(makeDescRow('合同总金额',  makeDescVal('1,200,000.00 元')));
    rows.push(makeDescRow('结算方式',    makeDescVal('月结')));
    rows.push(makeDescRow('付款条款',    makeDescVal('合同签订后30日内支付首期款，余款按月结算')));
    rows.push(makeDescRow('合同附件',    makeDescFileLink('碧桂园服务合作合同.pdf')));

    var yPos = FORM_PAD;
    var totalH = 0;
    rows.forEach(function(r) { totalH += r.height; });
    body.resize(DRAWER_W, FORM_PAD + totalH + FORM_PAD);
    rows.forEach(function(r) { r.x = FORM_PAD; r.y = yPos; yPos += r.height; body.appendChild(r); });
    body.x = 0; body.y = DRW_HDR_H + TAB_H;
    drawer.appendChild(body);

    // 底部操作栏：关闭 / 终止合同（danger）/ 编辑（primary）
    var footer = figma.createFrame();
    footer.name = 'DrawerFooter'; footer.resize(DRAWER_W, DRW_FTR_H);
    footer.fills = solid(C.white); footer.clipsContent = false;
    footer.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:0 }));
    var footerBtns = figma.createFrame();
    footerBtns.name = 'FooterBtns'; footerBtns.fills = []; footerBtns.clipsContent = false;
    footerBtns.layoutMode = 'HORIZONTAL';
    footerBtns.primaryAxisSizingMode = 'AUTO'; footerBtns.counterAxisSizingMode = 'AUTO';
    footerBtns.counterAxisAlignItems = 'CENTER'; footerBtns.itemSpacing = 8;
    footerBtns.appendChild(makeBtn('关闭',    'secondary'));
    footerBtns.appendChild(makeBtn('终止合同', 'danger'));
    footerBtns.appendChild(makeBtn('编辑',    'primary'));
    footer.appendChild(footerBtns);
    footerBtns.x = DRAWER_W - FORM_PAD - footerBtns.width;
    footerBtns.y = Math.round((DRW_FTR_H - footerBtns.height) / 2);
    footer.x = 0; footer.y = CANVAS_H - DRW_FTR_H;
    drawer.appendChild(footer);

    return drawer;
  }

  // ── 页面组装 ──────────────────────────────────────────────────────────────
  var root = figma.createFrame();
  root.name = 'D-02 查看合同抽屉'; root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = false;
  figma.currentPage.appendChild(root);

  var sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  var overlay = rect(CANVAS_W - SIDE_W, CANVAS_H, C.black, { a:0.40, x:SIDE_W, y:0 });
  root.appendChild(overlay);

  var drawer = buildDrawer();
  drawer.x = CANVAS_W - DRAWER_W; drawer.y = 0;
  root.appendChild(drawer);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
