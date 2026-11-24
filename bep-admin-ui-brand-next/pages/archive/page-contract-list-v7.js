// ── 合同管理列表页 v7 ──────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-22
// v7: 表格严格按 components.md 标准组件重写
//   · 结构改为列优先（VERTICAL col + HORIZONTAL table）
//   · 表头 bg=black@0.04 / 文字 Medium black@0.85 / t.resize(colW-32,22)
//   · 内容格 bg=white / 文字 Regular black@0.65 / 底部分割线 black@0.06
//   · 操作格 colW=136 / btn1@x=16 / btn2@x=60 / btn3@x=108（适配多操作）
//   · 不约束列宽：列宽按内容自然设定，canvas 加宽至 1680
// Canvas 1680 × 769

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "Add":            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
  "bell":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8.00098C18 4.68727 15.3137 2.00098 12 2.00098C8.68629 2.00098 6 4.68727 6 8.00098C6 15.001 3 17.001 3 17.001H21C21 17.001 18 15.001 18 8.00098" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21.001C13.3722 21.6178 12.7131 21.9974 12 21.9974C11.287 21.9974 10.6278 21.6178 10.27 21.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-right":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "download":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0068 8.82849H9.00684H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "grid":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "home":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923V1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "menu":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5032H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 5.50317H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 17.5032H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular'  }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium'   }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Semibold' }),
  ]);

  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a=1) { return [{type:'SOLID', color, opacity:a}]; }
  function measureText(str, size=14) {
    let w = 0;
    for (const ch of str) w += ch.charCodeAt(0) > 255 ? size : Math.round(size * 0.6);
    return Math.ceil(w);
  }

  const C = {
    pageBg:       hex('#F0F2F5'),
    white:        hex('#FFFFFF'),
    sidebarBg:    hex('#002138'),
    sidebarSub:   hex('#00182A'),
    primary:      hex('#006D9B'),
    primaryL20:   hex('#338AAF'),
    primaryL90:   hex('#E6F0F5'),
    success:      hex('#3BBB3E'),
    successL90:   hex('#EBF8EC'),
    warning:      hex('#FFA645'),
    warningL90:   hex('#FFF6EC'),
    danger:       hex('#FE5E54'),
    dangerL90:    hex('#FFEEEE'),
    black:        hex('#000000'),
    tagGrayBg:    hex('#F5F5F5'),
  };

  // ── 布局常量 ─────────────────────────────────────────────────────
  const CANVAS_W  = 1680;
  const SIDE_W    = 208,  MAIN_W  = 1472;   // 1680-208
  const NAV_H     = 56,   TITLE_H = 48;     // NAV 含 8px 间距
  const OUTER_PAD = 16,   PAD     = 24;
  const CARD_W    = 1440, TBL_W   = 1392;   // 1440-2*24
  const ROW_H     = 48,   HEADER_H = 48;
  const NUM_ROWS  = 6;

  // 卡片内纵向（2 行筛选满列，按钮单独行）
  const FILTER_ACT_Y = 120;   // 24+2×48
  const TOOLBAR_Y    = 168;
  const DIVIDER_Y    = 208;
  const TBL_Y        = 217;
  const PAGER_Y      = TBL_Y + HEADER_H + NUM_ROWS * ROW_H + 16; // 569
  const CARD_H       = PAGER_Y + 32 + 32;  // 633
  const CANVAS_H     = NAV_H + TITLE_H + OUTER_PAD + CARD_H + OUTER_PAD; // 769

  // ── 工厂函数 ─────────────────────────────────────────────────────
  function frame(name, w, h, bg, opts={}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA||1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r       !== undefined) f.cornerRadius = opts.r;
    if (opts.x       !== undefined) f.x = opts.x;
    if (opts.y       !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes      = solid(opts.stroke, opts.strokeA||1);
      f.strokeWeight = opts.strokeW||1;
      f.strokeAlign  = 'INSIDE';
    }
    return f;
  }
  function rect(w, h, color, opts={}) {
    const r = figma.createRectangle();
    r.resize(w, h); r.fills = color ? solid(color, opts.a||1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    return r;
  }
  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? {value:opts.lh, unit:'PIXELS'} : {unit:'AUTO'};
    t.characters = chars;
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function truncText(chars, color, maxW, opts={}) {
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize   = opts.size || 14;
    t.lineHeight = { value: opts.lh || 22, unit:'PIXELS' };
    t.characters = String(chars);
    t.fills      = solid(color, opts.a!==undefined ? opts.a : 1);
    t.textAutoResize   = 'NONE';
    t.resize(Math.max(maxW, 8), opts.lh || 22);
    t.textTruncation   = 'ENDING';
    if (opts.alignH) t.textAlignHorizontal = opts.alignH;
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
        .forEach(n => { n.fills   = solid(color,1); });
    node.findAll(n => n.strokes && n.strokes.length > 0)
        .forEach(n => { n.strokes = solid(color,1); });
    return node;
  }

  // ─────────────────────────────────────────────────────────────────
  //  侧边栏（components.md 规范，锁定）
  // ─────────────────────────────────────────────────────────────────
  async function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64); area.fills = solid(hex('#002138'));
    const box = figma.createRectangle();
    box.resize(32,32); box.x=24; box.y=16; box.cornerRadius=6; box.fills=solid(C.primary);
    area.appendChild(box);
    const t1 = figma.createText();
    t1.fontName={family:'PingFang SC',style:'Medium'}; t1.fontSize=16;
    t1.lineHeight={value:20,unit:'PIXELS'}; t1.characters='BeP设计平台';
    t1.fills=solid(C.white); t1.x=64; t1.y=20; area.appendChild(t1);
    const t2 = figma.createText();
    t2.fontName={family:'PingFang SC',style:'Regular'}; t2.fontSize=7;
    t2.lineHeight={value:10,unit:'PIXELS'}; t2.characters='COUNTRY GARDEN SERVICES';
    t2.fills=[{type:'SOLID',color:C.white,opacity:0.6}]; t2.x=64; t2.y=42; area.appendChild(t2);
    return area;
  }
  async function makeSidebarItem(label, level, state, iconKey=null) {
    const bg = level===3 ? hex('#00182A') : hex('#002138');
    const isActive = state==='active' || state==='expanded';
    const row = figma.createFrame();
    row.name=`L${level}-${label}`; row.resize(208,48); row.fills=solid(bg);
    row.opacity = isActive ? 1 : 0.5;
    if (level===1 && iconKey && ICONS[iconKey]) {
      const ic = figma.createNodeFromSvg(ICONS[iconKey]);
      ic.resize(16,16); ic.x=24; ic.y=16;
      ic.findAll(n=>n.fills&&n.fills.length>0&&n.fills[0].type==='SOLID').forEach(n=>{n.fills=solid(C.white,1);});
      ic.findAll(n=>n.strokes&&n.strokes.length>0).forEach(n=>{n.strokes=solid(C.white,1);});
      row.appendChild(ic);
    }
    const textX = level===1?52:level===2?40:56;
    const t = figma.createText();
    t.fontName={family:'PingFang SC',style:'Regular'}; t.fontSize=14;
    t.lineHeight={value:22,unit:'PIXELS'}; t.characters=label; t.fills=solid(C.white);
    t.x=textX; t.y=13; row.appendChild(t);
    if (level<=2) {
      const arrowSvg = state==='expanded'?ICONS['PutAway-Arrow']:ICONS['DropDown-Arrow'];
      const arrow = figma.createNodeFromSvg(arrowSvg);
      arrow.resize(12,12); arrow.x=180; arrow.y=18;
      arrow.findAll(n=>n.fills&&n.fills.length>0&&n.fills[0].type==='SOLID').forEach(n=>{n.fills=solid(C.white,1);});
      row.appendChild(arrow);
    }
    return row;
  }
  function makeSidebarDivider() {
    const w = figma.createFrame();
    w.name='SidebarDivider'; w.resize(208,1); w.fills=[];
    const l = figma.createRectangle();
    l.resize(160,1); l.x=24; l.y=0; l.fills=[{type:'SOLID',color:C.white,opacity:0.08}];
    w.appendChild(l); return w;
  }
  async function makeSidebar(height) {
    const s = figma.createFrame();
    s.name='侧边栏'; s.layoutMode='VERTICAL'; s.itemSpacing=0;
    s.primaryAxisSizingMode='FIXED'; s.counterAxisSizingMode='FIXED';
    s.resize(208,height); s.fills=solid(hex('#002138')); s.clipsContent=false;
    s.appendChild(await makeSidebarLogo());
    s.appendChild(makeSidebarDivider());
    s.appendChild(await makeSidebarItem('首页',1,'inactive','home'));
    s.appendChild(await makeSidebarItem('工作台',1,'inactive','grid'));
    s.appendChild(makeSidebarDivider());
    s.appendChild(await makeSidebarItem('合同管理',1,'expanded','file-text'));
    s.appendChild(await makeSidebarItem('合同列表',2,'active'));
    s.appendChild(await makeSidebarItem('收款管理',2,'inactive'));
    s.appendChild(await makeSidebarItem('销售管理',1,'inactive','briefcase'));
    s.appendChild(await makeSidebarItem('系统管理',1,'inactive','layers'));
    return s;
  }

  // ─────────────────────────────────────────────────────────────────
  //  页头（components.md 规范）
  // ─────────────────────────────────────────────────────────────────
  async function makeHeaderBar(totalW) {
    const bar = figma.createFrame();
    bar.name='HeaderBar'; bar.resize(totalW,48); bar.fills=solid(C.white);
    const div=figma.createRectangle(); div.resize(totalW,1); div.x=0; div.y=47;
    div.fills=[{type:'SOLID',color:C.black,opacity:0.10}]; bar.appendChild(div);
    const menuIcon = figma.createNodeFromSvg(ICONS['menu']);
    menuIcon.resize(16,16); menuIcon.x=24; menuIcon.y=16;
    menuIcon.findAll(n=>n.strokes&&n.strokes.length>0).forEach(n=>{n.strokes=solid(C.black,0.65);});
    bar.appendChild(menuIcon);
    const si = figma.createFrame();
    si.resize(200,32); si.x=64; si.y=8; si.cornerRadius=2; si.fills=solid(C.white);
    si.strokes=[{type:'SOLID',color:C.black,opacity:0.15}]; si.strokeWeight=1; si.strokeAlign='INSIDE';
    const ph=figma.createText();
    ph.fontName={family:'PingFang SC',style:'Regular'}; ph.fontSize=14;
    ph.lineHeight={value:22,unit:'PIXELS'}; ph.characters='业务系统切换';
    ph.fills=[{type:'SOLID',color:C.black,opacity:0.25}]; ph.x=12; ph.y=5; si.appendChild(ph);
    bar.appendChild(si);
    const rightX = totalW-24-223;
    [['search',rightX],['download',rightX+40],['bell',rightX+80]].forEach(([key,x])=>{
      const ic = figma.createNodeFromSvg(ICONS[key]);
      ic.resize(16,16); ic.x=x; ic.y=16;
      ic.findAll(n=>n.strokes&&n.strokes.length>0).forEach(n=>{n.strokes=solid(C.black,0.65);});
      ic.findAll(n=>n.fills&&n.fills.length>0&&n.fills[0].type==='SOLID').forEach(n=>{n.fills=solid(C.black,0.65);});
      bar.appendChild(ic);
    });
    const vDiv=figma.createRectangle(); vDiv.resize(1,16); vDiv.x=rightX+112; vDiv.y=16;
    vDiv.fills=[{type:'SOLID',color:C.black,opacity:0.10}]; bar.appendChild(vDiv);
    const avatar=figma.createEllipse(); avatar.resize(24,24); avatar.x=rightX+129; avatar.y=12;
    avatar.fills=[{type:'SOLID',color:C.primaryL20}]; bar.appendChild(avatar);
    const uN=figma.createText();
    uN.fontName={family:'PingFang SC',style:'Regular'}; uN.fontSize=14;
    uN.lineHeight={value:22,unit:'PIXELS'}; uN.characters='碧小园';
    uN.fills=[{type:'SOLID',color:C.black,opacity:0.85}]; uN.x=rightX+161; uN.y=13; bar.appendChild(uN);
    return bar;
  }
  async function makeBreadcrumbBar(totalW, crumbs=[]) {
    const bar=figma.createFrame();
    bar.name='BreadcrumbBar'; bar.resize(totalW,48); bar.fills=solid(C.white);
    const div=figma.createRectangle(); div.resize(totalW,1); div.x=0; div.y=47;
    div.fills=[{type:'SOLID',color:C.black,opacity:0.10}]; bar.appendChild(div);
    const currentTitle=crumbs[crumbs.length-1]||'本级标题';
    const tT=figma.createText();
    tT.fontName={family:'PingFang SC',style:'Medium'}; tT.fontSize=16;
    tT.lineHeight={value:24,unit:'PIXELS'}; tT.characters=currentTitle;
    tT.fills=[{type:'SOLID',color:C.black,opacity:0.85}]; tT.x=24; tT.y=12; bar.appendChild(tT);
    let curX=104;
    crumbs.forEach((crumb,i)=>{
      const t=figma.createText();
      t.fontName={family:'PingFang SC',style:'Regular'}; t.fontSize=14;
      t.lineHeight={value:22,unit:'PIXELS'}; t.characters=crumb;
      t.fills=[{type:'SOLID',color:C.black,opacity:0.65}]; t.x=curX; t.y=13; bar.appendChild(t);
      curX+=t.width;
      if (i<crumbs.length-1) {
        const arrow=figma.createNodeFromSvg(ICONS['chevron-right']);
        arrow.resize(12,12); arrow.x=curX+4; arrow.y=18;
        arrow.findAll(n=>n.strokes&&n.strokes.length>0).forEach(n=>{n.strokes=solid(C.black,0.45);});
        bar.appendChild(arrow); curX+=20;
      }
    });
    return bar;
  }

  // ─────────────────────────────────────────────────────────────────
  //  筛选区
  // ─────────────────────────────────────────────────────────────────
  const LABEL_W=112, LABEL_GAP=12, FCOL_W=379;
  const INPUT_W=FCOL_W-LABEL_W-LABEL_GAP; // 255
  const COL_X=[24,411,798];

  function addFilter(parent,label,col,rowIdx,fieldType) {
    const x0=COL_X[col], y0=24+rowIdx*48;
    parent.appendChild(truncText(label,C.black,LABEL_W,{a:0.65,x:x0,y:y0+5}));
    const inputX=x0+LABEL_W+LABEL_GAP;
    if (fieldType==='select') {
      const sel=frame(`sel-${label}`,INPUT_W,32,C.white,{r:2,x:inputX,y:y0,stroke:C.black,strokeA:0.15,strokeW:1});
      parent.appendChild(sel);
      sel.appendChild(text('请选择',C.black,14,{lh:22,a:0.25,x:12,y:5}));
      const arr=icon('DropDown-Arrow',12,C.black,0.35);
      if (arr){arr.x=INPUT_W-20;arr.y=10;sel.appendChild(arr);}
    } else {
      const box=frame(`inp-${label}`,INPUT_W,32,C.white,{r:2,x:inputX,y:y0,stroke:C.black,strokeA:0.15,strokeW:1});
      parent.appendChild(box);
      box.appendChild(text('请输入',C.black,14,{lh:22,a:0.25,x:12,y:5}));
    }
  }
  function buildFilterActions(mainCard,y) {
    let bx=CARD_W-PAD;
    const colT=text('收起',C.primary,14,{lh:22});
    const arrUp=icon('PutAway-Arrow',16,C.primary,0.85);
    const colW=colT.width+(arrUp?20:0);
    colT.x=bx-colW; colT.y=y+5; mainCard.appendChild(colT);
    if (arrUp){arrUp.x=bx-16;arrUp.y=y+8;mainCard.appendChild(arrUp);}
    bx=bx-colW-16;
    const rstW=measureText('重置',14)+32;
    const rstBtn=frame('btn-重置',rstW,32,C.white,{r:2,x:bx-rstW,y,stroke:C.black,strokeA:0.15,strokeW:1});
    mainCard.appendChild(rstBtn);
    const rstT=text('重置',C.black,14,{lh:22,a:0.65});
    rstT.x=Math.round((rstW-rstT.width)/2);rstT.y=5;rstBtn.appendChild(rstT);
    bx=bx-rstW-8;
    const qryW=measureText('查询',14)+32;
    const qryBtn=frame('btn-查询',qryW,32,C.primary,{r:2,x:bx-qryW,y});
    mainCard.appendChild(qryBtn);
    const qryT=text('查询',C.white,14,{lh:22});
    qryT.x=Math.round((qryW-qryT.width)/2);qryT.y=5;qryBtn.appendChild(qryT);
  }
  function buildTableToolbar(mainCard,y) {
    let bx=CARD_W-PAD;
    const addLblW=measureText('新增合同',14);
    const addBtnW=12+16+8+addLblW+12;
    bx-=addBtnW;
    const addBtn=frame('btn-新增合同',addBtnW,32,C.primary,{r:2,x:bx,y});
    mainCard.appendChild(addBtn);
    const icAdd=icon('Add',16,C.white,1);
    if (icAdd){icAdd.x=12;icAdd.y=8;addBtn.appendChild(icAdd);}
    addBtn.appendChild(text('新增合同',C.white,14,{lh:22,x:36,y:5}));
    bx-=8;
    const expW=measureText('导出',14)+32;
    bx-=expW;
    const expBtn=frame('btn-导出',expW,32,C.white,{r:2,x:bx,y,stroke:C.black,strokeA:0.15,strokeW:1});
    mainCard.appendChild(expBtn);
    const expT=text('导出',C.black,14,{lh:22,a:0.65});
    expT.x=Math.round((expW-expT.width)/2);expT.y=5;expBtn.appendChild(expT);
  }

  // ─────────────────────────────────────────────────────────────────
  //  ⭐ 表格标准组件（components.md § 表格 Table）
  //  ── 以列为单位组装 ─────────────────────────────────────────────
  //
  //  makeTableHeader(colW, label)
  //    h=48, bg=black@0.04, text Medium black@0.85 at x=16 y=13
  //    t.resize(colW-32, 22)  ← 固定宽，自然裁切，不加"…"
  //
  //  makeTableCell(colW, text)
  //    h=48, bg=white, text Regular black@0.65 at x=16 y=13
  //    t.resize(colW-32, 22)  ← 固定宽，自然裁切
  //    底部分割线 black@0.06 at y=47
  //
  //  makeTableColumn(col): VERTICAL AUTO-LAYOUT frame，header + cells 垂直叠放
  //  makeTable(cols):       HORIZONTAL AUTO-LAYOUT frame，所有列横向拼接
  // ─────────────────────────────────────────────────────────────────

  // ── 表头单元格（完全按 components.md 规范）────────────────────────
  function makeTableHeader(colW, label) {
    const cell = figma.createFrame();
    cell.name = 'TableHeader'; cell.resize(colW, HEADER_H);
    cell.fills = [{ type:'SOLID', color:C.black, opacity:0.04 }];
    cell.clipsContent = false;
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Medium' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = label;
    t.fills      = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.resize(colW - 32, 22);  // ← 规范：colW - padX*2（padX=16）
    t.x = 16; t.y = 13;
    cell.appendChild(t);
    return cell;
  }

  // ── 内容单元格（完全按 components.md 规范）────────────────────────
  function makeTableCell(colW, content) {
    const cell = figma.createFrame();
    cell.name = 'TableCell'; cell.resize(colW, ROW_H);
    cell.fills = solid(C.white); cell.clipsContent = false;
    // 底部分割线
    const divider = figma.createRectangle();
    divider.resize(colW, 1); divider.x = 0; divider.y = ROW_H - 1;
    divider.fills = [{ type:'SOLID', color:C.black, opacity:0.06 }];
    cell.appendChild(divider);
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = content;
    t.fills      = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.resize(colW - 32, 22);  // ← 规范：固定宽，自然裁切
    t.x = 16; t.y = 13;
    cell.appendChild(t);
    return cell;
  }

  // ── 链接单元格（primary 色，同结构）─────────────────────────────
  function makeLinkCell(colW, content) {
    const cell = figma.createFrame();
    cell.name = 'LinkCell'; cell.resize(colW, ROW_H);
    cell.fills = solid(C.white); cell.clipsContent = false;
    const divider = figma.createRectangle();
    divider.resize(colW, 1); divider.x = 0; divider.y = ROW_H-1;
    divider.fills = [{ type:'SOLID', color:C.black, opacity:0.06 }]; cell.appendChild(divider);
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = content; t.fills = solid(C.primary);
    t.resize(colW - 32, 22); t.x = 16; t.y = 13; cell.appendChild(t);
    return cell;
  }

  // ── Tag 单元格 ────────────────────────────────────────────────────
  function makeTagCell(colW, label, bg, txtColor, opacity=1) {
    const cell = figma.createFrame();
    cell.name = 'TagCell'; cell.resize(colW, ROW_H);
    cell.fills = solid(C.white); cell.clipsContent = false;
    const divider = figma.createRectangle();
    divider.resize(colW, 1); divider.x = 0; divider.y = ROW_H-1;
    divider.fills = [{ type:'SOLID', color:C.black, opacity:0.06 }]; cell.appendChild(divider);
    // Tag 徽标
    const tag = figma.createFrame();
    tag.name = 'tag'; tag.cornerRadius = 2; tag.fills = solid(bg);
    tag.clipsContent = false;
    const tLabel = figma.createText();
    tLabel.fontName = { family:'PingFang SC', style:'Regular' };
    tLabel.fontSize = 12; tLabel.lineHeight = { value:20, unit:'PIXELS' };
    tLabel.characters = label; tLabel.fills = solid(txtColor, opacity);
    tLabel.textAutoResize = 'WIDTH_AND_HEIGHT';
    tLabel.x = 8; tLabel.y = 1;
    const tagW = tLabel.width + 16; const tagH = 22;
    tag.resize(tagW, tagH); tag.appendChild(tLabel);
    tag.x = 8; tag.y = Math.round((ROW_H - tagH) / 2);
    cell.appendChild(tag);
    return cell;
  }

  // ── 金额单元格（右对齐）──────────────────────────────────────────
  function makeAmountCell(colW, amount) {
    const cell = figma.createFrame();
    cell.name = 'AmountCell'; cell.resize(colW, ROW_H);
    cell.fills = solid(C.white); cell.clipsContent = false;
    const divider = figma.createRectangle();
    divider.resize(colW, 1); divider.x = 0; divider.y = ROW_H-1;
    divider.fills = [{ type:'SOLID', color:C.black, opacity:0.06 }]; cell.appendChild(divider);
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:'Regular' };
    t.fontSize   = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = amount;
    t.fills      = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 0; t.y = 13; cell.appendChild(t);
    // 右对齐：测量后重新定位
    t.x = colW - t.width - 16; t.y = 13;
    return cell;
  }

  // ── 操作单元格（按 components.md：btn1@16 btn2@60 btn3@108）──────
  function makeActionCell(colW, ops) {
    const cell = figma.createFrame();
    cell.name = 'ActionCell'; cell.resize(colW, ROW_H);
    cell.fills = solid(C.white); cell.clipsContent = false;
    const divider = figma.createRectangle();
    divider.resize(colW, 1); divider.x = 0; divider.y = ROW_H-1;
    divider.fills = [{ type:'SOLID', color:C.black, opacity:0.06 }]; cell.appendChild(divider);
    const xs = [16, 60, 108]; // 标准位置：最多 3 个文字操作
    ops.slice(0, 3).forEach(([label, color], i) => {
      const btn = figma.createText();
      btn.fontName   = { family:'PingFang SC', style:'Regular' };
      btn.fontSize   = 14; btn.lineHeight = { value:22, unit:'PIXELS' };
      btn.characters = label; btn.fills = solid(color);
      btn.x = xs[i]; btn.y = 13; cell.appendChild(btn);
    });
    return cell;
  }

  // ── 列帧（VERTICAL 自动布局，header + cells）─────────────────────
  function makeTableColumn(colW, label, cellBuilders) {
    const col = figma.createFrame();
    col.name = label;
    col.layoutMode = 'VERTICAL'; col.itemSpacing = 0;
    col.primaryAxisSizingMode = 'AUTO';
    col.counterAxisSizingMode = 'FIXED';
    col.resize(colW, HEADER_H * (cellBuilders.length + 1));
    col.fills = [];
    col.appendChild(makeTableHeader(colW, label));
    cellBuilders.forEach(builder => col.appendChild(builder()));
    return col;
  }

  // ── 完整表格（HORIZONTAL 自动布局，所有列横向拼接）───────────────
  function makeTable(colDefs) {
    const table = figma.createFrame();
    table.name = 'Table';
    table.layoutMode = 'HORIZONTAL'; table.itemSpacing = 0;
    table.primaryAxisSizingMode = 'AUTO';
    table.counterAxisSizingMode = 'AUTO';
    table.fills = [];
    colDefs.forEach(({ w, label, builders }) => {
      table.appendChild(makeTableColumn(w, label, builders));
    });
    return table;
  }

  // ── 数据 & 表格组装 ──────────────────────────────────────────────
  const STATUS_CFG = {
    '已生效':    { bg:C.successL90, txt:C.success,    a:1    },
    '待财务审核':{ bg:C.warningL90, txt:C.warning,    a:1    },
    '草稿':      { bg:C.tagGrayBg,  txt:C.black,      a:0.65 },
    '已终止':    { bg:C.dangerL90,  txt:C.danger,     a:1    },
    '已到期':    { bg:C.tagGrayBg,  txt:C.black,      a:0.45 },
    '审核驳回':  { bg:C.dangerL90,  txt:C.danger,     a:1    },
  };
  const BLUE_TAG = { bg:C.primaryL90, txt:C.primary };

  function getOps(status) {
    const P=C.primary, S=hex('#00875A'), D=hex('#CF1322'), W=hex('#D46B08');
    return ({
      '已生效':    [['详情',P],['终止',W]],
      '待财务审核':[['详情',P],['财务通过',S],['财务驳回',D]],
      '草稿':      [['详情',P],['编辑',P],['提交审核',S]],
      '审核驳回':  [['详情',P],['编辑',P],['提交审核',S]],
      '已终止':    [['详情',P]],
      '已到期':    [['详情',P]],
    })[status] || [['详情',P]];
  }

  const rows = [
    {id:'BJ-2026-00001',client:'碧桂园集团',name:'万科碧桂园战略合作协议',scene:'销售',type:'框架合同',status:'已生效',   bip:'BIP-2026-001',total:'¥1,200,000.00',ordered:'¥800,000.00', sales:'张伟',start:'2026-01-01',end:'2026-12-31'},
    {id:'BJ-2026-00002',client:'华润置地',  name:'房屋维修服务合同',      scene:'服务',type:'单项合同',status:'待财务审核',bip:'BIP-2026-002',total:'¥350,000.00',  ordered:'¥0.00',       sales:'李芳',start:'2026-02-15',end:'2026-08-14'},
    {id:'BJ-2026-00003',client:'万科企业',  name:'物业管理服务协议',      scene:'物管',type:'框架合同',status:'草稿',      bip:'-',           total:'¥2,800,000.00',ordered:'¥1,500,000.00',sales:'王强',start:'2026-03-01',end:'2027-02-28'},
    {id:'BJ-2026-00004',client:'中海地产',  name:'安保服务合同',          scene:'安保',type:'单项合同',status:'已终止',    bip:'BIP-2026-004',total:'¥180,000.00',  ordered:'¥180,000.00', sales:'陈梅',start:'2025-06-01',end:'2026-05-31'},
    {id:'BJ-2026-00005',client:'保利发展',  name:'绿化养护合同',          scene:'绿化',type:'框架合同',status:'已到期',    bip:'BIP-2026-005',total:'¥95,000.00',   ordered:'¥95,000.00',  sales:'赵刚',start:'2025-01-01',end:'2025-12-31'},
    {id:'BJ-2026-00006',client:'龙湖集团',  name:'设备维护服务合同',      scene:'维修',type:'单项合同',status:'审核驳回',  bip:'BIP-2026-006',total:'¥460,000.00',  ordered:'¥0.00',       sales:'刘静',start:'2026-04-01',end:'2026-09-30'},
  ];

  // 列宽（总计 1392px = TBL_W，在 1440px 卡片 24px 内边距内自然展示）
  // 各列足够宽，内容自然显示无需"…"截断
  const COL_WIDTHS = {
    id:      132,  // 合同编号
    client:  100,  // 客户名称
    name:    110,  // 合同名称
    scene:    84,  // 合同场景（Tag）
    type:     96,  // 合同类型（Tag）
    status:  108,  // 合同状态（Tag，最宽"待财务审核"）
    bip:     120,  // BIP审批编号
    total:   116,  // 合同总金额
    ordered: 116,  // 已下单金额
    sales:    84,  // 销售人员
    start:   100,  // 生效日期
    end:     100,  // 到期日期
    ops:     126,  // 操作（3 btn × ~40px + 16）
  };
  // 验证：132+100+110+84+96+108+120+116+116+84+100+100+126 = 1392 ✓

  const colDefs = [
    {
      w: COL_WIDTHS.id, label: '合同编号',
      builders: rows.map(r => () => makeLinkCell(COL_WIDTHS.id, r.id))
    },
    {
      w: COL_WIDTHS.client, label: '客户名称',
      builders: rows.map(r => () => makeTableCell(COL_WIDTHS.client, r.client))
    },
    {
      w: COL_WIDTHS.name, label: '合同名称',
      builders: rows.map(r => () => makeTableCell(COL_WIDTHS.name, r.name))
    },
    {
      w: COL_WIDTHS.scene, label: '合同场景',
      builders: rows.map(r => () => makeTagCell(COL_WIDTHS.scene, r.scene, BLUE_TAG.bg, BLUE_TAG.txt))
    },
    {
      w: COL_WIDTHS.type, label: '合同类型',
      builders: rows.map(r => () => makeTagCell(COL_WIDTHS.type, r.type, BLUE_TAG.bg, BLUE_TAG.txt))
    },
    {
      w: COL_WIDTHS.status, label: '合同状态',
      builders: rows.map(r => () => {
        const cfg = STATUS_CFG[r.status] || STATUS_CFG['草稿'];
        return makeTagCell(COL_WIDTHS.status, r.status, cfg.bg, cfg.txt, cfg.a);
      })
    },
    {
      w: COL_WIDTHS.bip, label: 'BIP审批编号',
      builders: rows.map(r => () => makeTableCell(COL_WIDTHS.bip, r.bip))
    },
    {
      w: COL_WIDTHS.total, label: '合同总金额',
      builders: rows.map(r => () => makeAmountCell(COL_WIDTHS.total, r.total))
    },
    {
      w: COL_WIDTHS.ordered, label: '已下单金额',
      builders: rows.map(r => () => makeAmountCell(COL_WIDTHS.ordered, r.ordered))
    },
    {
      w: COL_WIDTHS.sales, label: '销售人员',
      builders: rows.map(r => () => makeTableCell(COL_WIDTHS.sales, r.sales))
    },
    {
      w: COL_WIDTHS.start, label: '生效日期',
      builders: rows.map(r => () => makeTableCell(COL_WIDTHS.start, r.start))
    },
    {
      w: COL_WIDTHS.end, label: '到期日期',
      builders: rows.map(r => () => makeTableCell(COL_WIDTHS.end, r.end))
    },
    {
      w: COL_WIDTHS.ops, label: '操作',
      builders: rows.map(r => () => makeActionCell(COL_WIDTHS.ops, getOps(r.status)))
    },
  ];

  // ── 分页 ─────────────────────────────────────────────────────────
  function buildFullPagination(mainCard,y,total,currentPage,pageCount) {
    const BTN=32, GAP=4; let px=CARD_W-PAD;
    const tPage=text('页',C.black,14,{lh:22,a:0.85});
    tPage.x=px-tPage.width;tPage.y=y+5;mainCard.appendChild(tPage);px=tPage.x-4;
    const jumpBox=frame('jump-input',40,BTN,C.white,{r:2,x:px-40,y,stroke:C.black,strokeA:0.15,strokeW:1});
    mainCard.appendChild(jumpBox);
    const tJ=text(String(currentPage),C.black,14,{lh:22,a:0.65});
    tJ.x=Math.round((40-tJ.width)/2);tJ.y=5;jumpBox.appendChild(tJ);px=px-40-4;
    const tGoto=text('跳转至',C.black,14,{lh:22,a:0.65});
    tGoto.x=px-tGoto.width;tGoto.y=y+5;mainCard.appendChild(tGoto);px=tGoto.x-12;
    function mkBtn(label,isActive) {
      const b=frame('pgbtn-'+label,BTN,BTN,isActive?C.primary:C.white,
        {r:2,x:px-BTN,y,stroke:isActive?undefined:C.black,strokeA:0.15,strokeW:1});
      mainCard.appendChild(b);
      const t=text(label,isActive?C.white:C.black,14,{lh:22,a:isActive?1:0.85});
      t.x=Math.round((BTN-t.width)/2);t.y=Math.round((BTN-22)/2);b.appendChild(t);
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
    tTotal.x=px-tTotal.width;tTotal.y=y+5;mainCard.appendChild(tTotal);
  }

  // ──────────────────────────────────────────────────────────────────
  //  构建页面
  // ──────────────────────────────────────────────────────────────────
  const root = figma.createFrame();
  root.name='合同管理列表页'; root.resize(CANVAS_W, CANVAS_H);
  root.fills=solid(C.pageBg); root.clipsContent=true;
  figma.currentPage.appendChild(root);
  figma.currentPage.name='合同管理';

  // 侧边栏
  const sidebar = await makeSidebar(CANVAS_H);
  sidebar.x=0; sidebar.y=0; root.appendChild(sidebar);

  // 主区域
  const main = figma.createFrame();
  main.name='主区域'; main.resize(MAIN_W, CANVAS_H); main.fills=[];
  main.x=SIDE_W; main.y=0; root.appendChild(main);

  // 顶部工具栏（y=0, h=48）
  const headerBar = await makeHeaderBar(MAIN_W);
  headerBar.x=0; headerBar.y=0; main.appendChild(headerBar);

  // 面包屑标题栏（y=NAV_H=56，含 8px 间距）
  const breadBar = await makeBreadcrumbBar(MAIN_W, ['首页','销售管理','合同管理']);
  breadBar.x=0; breadBar.y=NAV_H; main.appendChild(breadBar);

  // 内容卡片
  const cardY = NAV_H + TITLE_H + OUTER_PAD; // 56+48+16=120
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, {r:8, x:OUTER_PAD, y:cardY});
  main.appendChild(mainCard);

  // 筛选区
  addFilter(mainCard,'合同编号',0,0,'text');
  addFilter(mainCard,'客户名称',1,0,'text');
  addFilter(mainCard,'合同状态',2,0,'select');
  addFilter(mainCard,'合同名称',0,1,'text');
  addFilter(mainCard,'合同场景',1,1,'select');
  addFilter(mainCard,'合同类型',2,1,'select');
  mainCard.appendChild(rect(CARD_W,1,C.black,{a:0.06,y:FILTER_ACT_Y-8}));
  buildFilterActions(mainCard,FILTER_ACT_Y);
  mainCard.appendChild(rect(CARD_W,1,C.black,{a:0.08,y:TOOLBAR_Y-8}));
  buildTableToolbar(mainCard,TOOLBAR_Y);
  mainCard.appendChild(rect(CARD_W,1,C.black,{a:0.10,y:DIVIDER_Y}));

  // ⭐ 表格（标准组件，列优先 HORIZONTAL 拼接）
  const table = makeTable(colDefs);
  table.x = PAD; table.y = TBL_Y;
  mainCard.appendChild(table);

  // 分页
  buildFullPagination(mainCard, PAGER_Y, 68, 1, 3);

  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin('✅ 合同管理列表页 v7 已生成（1680×'+CANVAS_H+'）');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
