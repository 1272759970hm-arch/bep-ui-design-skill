// ======================================================
// BeP Admin Kit — 6种表格类型验证
// 6个 1440×900 画板，垂直排列
// ======================================================

const ICONS = {
  "home": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "tool": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.7 6.3C14.3 6.7 14.3 7.3 14.7 7.7L16.3 9.3C16.7 9.7 17.3 9.7 17.7 9.3L21.5 5.5C22.5 7.8 22 10.5 20.2 12.2C18.5 14 15.8 14.5 13.5 13.5L6.6 20.4C5.8 21.2 4.4 21.2 3.6 20.4C2.8 19.6 2.8 18.2 3.6 17.4L10.5 10.5C9.5 8.2 10 5.5 11.8 3.8C13.5 2 16.2 1.5 18.5 2.5L14.7 6.3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "pie-chart": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.21 15.89C19.46 20.03 15.16 22.49 10.7 21.91C6.25 21.33 2.73 17.85 2.1 13.4C1.47 8.95 3.88 4.63 8 2.83" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 9.35 20.95 6.8 19.07 4.93C17.2 3.05 14.65 2 12 2V12H22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.13 15.62 19.26 16.34 19.73 16.82L19.79 16.88C20.17 17.26 20.38 17.76 20.38 18.3C20.38 18.83 20.17 19.33 19.79 19.71C19.41 20.09 18.91 20.3 18.38 20.3C17.84 20.3 17.34 20.09 16.96 19.71L16.9 19.65C16.42 19.18 15.7 19.05 15.08 19.32C14.48 19.58 14.08 20.17 14.08 20.83V21C14.08 22.1 13.18 23 12.08 23C10.98 23 10.08 22.1 10.08 21V20.91C10.06 20.23 9.64 19.63 9 19.4C8.38 19.13 7.66 19.26 7.18 19.73L7.12 19.79C6.74 20.17 6.24 20.38 5.71 20.38C5.17 20.38 4.67 20.17 4.29 19.79C3.91 19.41 3.7 18.91 3.7 18.38C3.7 17.84 3.91 17.34 4.29 16.96L4.35 16.9C4.82 16.42 4.95 15.7 4.68 15.08C4.42 14.48 3.83 14.08 3.17 14.08H3C1.9 14.08 1 13.18 1 12.08C1 10.98 1.9 10.08 3 10.08H3.09C3.77 10.06 4.37 9.64 4.6 9C4.87 8.38 4.74 7.66 4.27 7.18L4.21 7.12C3.83 6.74 3.62 6.24 3.62 5.71C3.62 5.17 3.83 4.67 4.21 4.29C4.59 3.91 5.09 3.7 5.63 3.7C6.16 3.7 6.66 3.91 7.04 4.29L7.1 4.35C7.58 4.82 8.3 4.95 8.92 4.68H9C9.6 4.42 10 3.83 10 3.17V3C10 1.9 10.9 1 12 1C13.1 1 14 1.9 14 3V3.09C14 3.75 14.4 4.34 15 4.6C15.62 4.87 16.34 4.74 16.82 4.27L16.88 4.21C17.26 3.83 17.76 3.62 18.3 3.62C18.83 3.62 19.33 3.83 19.71 4.21C20.09 4.59 20.3 5.09 20.3 5.63C20.3 6.16 20.09 6.66 19.71 7.04L19.65 7.1C19.18 7.58 19.05 8.3 19.32 8.92V9C19.58 9.6 20.17 10 20.83 10H21C22.1 10 23 10.9 23 12C23 13.1 22.1 14 21 14H20.91C20.25 14 19.66 14.4 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "menu": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bell": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8C18 6.4 17.37 4.88 16.24 3.76C15.12 2.63 13.59 2 12 2C10.41 2 8.88 2.63 7.76 3.76C6.63 4.88 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21C13.55 21.3 13.3 21.55 12.998 21.73C12.69 21.9 12.35 22 12 22C11.65 22 11.31 21.9 11.002 21.73C10.7 21.55 10.45 21.3 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "more-horizontal": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 };
  }
  function solid(c, a=1) { return [{type:'SOLID', color:c, opacity:a}]; }

  const C = {
    pageBg:    hex('#F0F2F5'),
    white:     hex('#FFFFFF'),
    sidebarBg: hex('#002138'),
    sidebarSub:hex('#00182a'),
    primary:   hex('#006D9B'),
    danger:    hex('#FE5E54'),
    textBase:  hex('#000000'),
    border:    hex('#000000'),
    tableHd:   hex('#F5F5F5'),
  };

  await Promise.all([
    figma.loadFontAsync({family:'PingFang TC', style:'Regular'}),
    figma.loadFontAsync({family:'PingFang TC', style:'Medium'}),
  ]);

  // ── 基础工厂 ──────────────────────────────────────────
  function frame(name, w, h, bg, opts={}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA||1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r  !== undefined) f.cornerRadius = opts.r;
    if (opts.x  !== undefined) f.x = opts.x;
    if (opts.y  !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes = solid(opts.stroke, opts.strokeA||1);
      f.strokeWeight = opts.strokeW||1;
      f.strokeAlign = 'INSIDE';
    }
    return f;
  }
  function rect(w, h, color, opts={}) {
    const r = figma.createRectangle();
    r.resize(w, h); r.fills = color ? solid(color, opts.a||1) : [];
    if (opts.r  !== undefined) r.cornerRadius = opts.r;
    if (opts.x  !== undefined) r.x = opts.x;
    if (opts.y  !== undefined) r.y = opts.y;
    if (opts.stroke) {
      r.strokes = solid(opts.stroke, opts.strokeA||1);
      r.strokeWeight = opts.strokeW||1;
      r.strokeAlign = 'INSIDE';
    }
    return r;
  }
  function text(chars, color, size, opts={}) {
    const t = figma.createText();
    t.fontName = {family:'PingFang TC', style:opts.style||'Regular'};
    t.fontSize = size;
    t.lineHeight = {value:opts.lh||(size+8), unit:'PIXELS'};
    t.characters = chars;
    t.fills = solid(color, opts.a||1);
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    return t;
  }
  function icon(key, size, color, opacity=1) {
    const svg = ICONS[key]; if (!svg) return null;
    const node = figma.createNodeFromSvg(svg);
    node.resize(size, size); node.opacity = opacity;
    node.findAll(n=>n.fills&&n.fills.length>0&&n.fills[0].type==='SOLID').forEach(n=>{n.fills=solid(color,1);});
    node.findAll(n=>n.strokes&&n.strokes.length>0).forEach(n=>{n.strokes=solid(color,1);});
    return node;
  }

  // ── 侧边栏 ────────────────────────────────────────────
  function buildSidebar(parent) {
    const sb = frame('侧边栏', 208, 900, C.sidebarBg, {clip:true});
    parent.appendChild(sb);
    // Logo
    const logo = frame('Logo', 208, 64, null); logo.fills=[]; sb.appendChild(logo);
    logo.appendChild(rect(32,32,C.primary,{r:6,x:24,y:16}));
    logo.appendChild(text('BeP设计平台', C.white, 16, {lh:20,style:'Medium',x:64,y:14}));
    logo.appendChild(text('COUNTRY GARDEN SERVICES', C.white, 7, {lh:10,a:0.6,x:64,y:37}));

    function L1(lbl, ikey, y, active=false, expanded=false) {
      const op=active?1:0.5, row=frame(`L1·${lbl}`,208,48,C.sidebarBg);
      row.y=y; sb.appendChild(row);
      const ic=icon(ikey,16,C.white,op); if(ic){ic.x=24;ic.y=16;row.appendChild(ic);}
      row.appendChild(text(lbl,C.white,14,{lh:22,a:op,x:52,y:13}));
      const arr=icon(expanded?'PutAway-Arrow':'DropDown-Arrow',12,C.white,op);
      if(arr){arr.x=186;arr.y=18;row.appendChild(arr);}
    }
    function L2(lbl, y, active=false) {
      const op=active?1:0.5, row=frame(`L2·${lbl}`,208,48,C.sidebarSub);
      row.y=y; sb.appendChild(row);
      row.appendChild(text(lbl,C.white,14,{lh:22,a:op,x:40,y:13}));
      const arr=icon('DropDown-Arrow',12,C.white,op); if(arr){arr.x=186;arr.y=18;row.appendChild(arr);}
    }
    function div(y) { sb.appendChild(rect(160,1,C.white,{a:0.08,x:24,y})); }

    let sy=64;
    L1('首页','home',sy); sy+=48;
    L1('数据看板','bar-chart-2',sy); sy+=48;
    div(sy); sy+=1;
    L1('房产管理','layers',sy); sy+=48;
    L1('合同管理','file-text',sy,true,true); sy+=48;
    L2('合同列表',sy,true); sy+=48;
    L2('合同审核',sy); sy+=48;
    L1('工单管理','tool',sy); sy+=48;
    L1('报表中心','pie-chart',sy); sy+=48;
    div(sy); sy+=1;
    L1('系统设置','settings',sy);
  }

  // ── 顶部导航 ──────────────────────────────────────────
  function buildTopNav(main) {
    const nav = frame('顶部导航',1232,56,C.white,{stroke:C.border,strokeA:0.08,strokeW:1});
    main.appendChild(nav);
    const m=icon('menu',20,C.textBase,0.45); if(m){m.x=16;m.y=18;nav.appendChild(m);}
    nav.appendChild(text('合同管理系统',C.textBase,14,{lh:22,a:0.65,x:44,y:17}));
    const SW=160;
    const sb2=frame('search',SW,32,C.white,{r:4,x:1232-24-28-12-20-8-SW,y:12,stroke:C.border,strokeA:0.12,strokeW:1});
    nav.appendChild(sb2);
    const si=icon('search',14,C.textBase,0.35); if(si){si.x=10;si.y=9;sb2.appendChild(si);}
    sb2.appendChild(text('搜索',C.textBase,14,{lh:22,a:0.25,x:28,y:5}));
    const bl=icon('bell',20,C.textBase,0.45); if(bl){bl.x=1232-24-28-12-20;bl.y=18;nav.appendChild(bl);}
    nav.appendChild(rect(28,28,C.primary,{r:14,x:1232-24-28,y:14}));
    const ut=text('管',C.white,12,{lh:28,style:'Medium'}); ut.x=1232-24-28+8;ut.y=14;nav.appendChild(ut);
  }

  // ── 标题栏 ────────────────────────────────────────────
  function buildTitleBar(main, title) {
    const bar=frame('标题栏',1232,56,C.white,{stroke:C.border,strokeA:0.06,strokeW:1});
    bar.y=56; main.appendChild(bar);
    bar.appendChild(text(title,C.textBase,18,{lh:24,style:'Medium',x:24,y:16}));
    const crumbs=[{label:'首页',link:true},{label:'合同管理',link:true},{label:title,link:false}];
    const cn=[],sn=[];
    crumbs.forEach((c,i)=>{
      cn.push(text(c.label,c.link?C.primary:C.textBase,12,{lh:18,a:c.link?0.7:0.45}));
      if(i<crumbs.length-1) sn.push(text(' / ',C.textBase,12,{lh:18,a:0.25}));
    });
    const tw=cn.reduce((s,n)=>s+n.width,0)+sn.reduce((s,n)=>s+n.width,0);
    let bx=1232-24-tw;
    crumbs.forEach((c,i)=>{
      cn[i].x=bx;cn[i].y=19;bar.appendChild(cn[i]);bx+=cn[i].width;
      if(i<crumbs.length-1){sn[i].x=bx;sn[i].y=19;bar.appendChild(sn[i]);bx+=sn[i].width;}
    });
  }

  // ── 表格构建器 ────────────────────────────────────────
  // cols: [{label, prop, w, type:'selection'|'radio'|'operation', ops, showMore}]
  // type options: 'basic'|'selection'|'mini'|'frozen'|'empty'
  function buildTable(mainCard, cols, rows, opts={}) {
    const {
      rowH = 48,
      showBatchToolbar = false,
      batchBtns = [],
      showEmpty = false,
      frozenLeft = 0,
      frozenRight = 0,
    } = opts;

    const PAD = 24;
    const CARD_W = 1200; // 1232 - 16*2
    const TBL_W = CARD_W - PAD*2; // 1152

    // 计算 flex 列宽
    const fixedW = cols.reduce((s,c)=>s+(c.w||0),0);
    const flexCount = cols.filter(c=>!c.w).length;
    const flexW = flexCount > 0 ? Math.floor((TBL_W - fixedW) / flexCount) : 0;
    const resolvedCols = cols.map(c=>({...c, w: c.w || flexW}));

    let curY = 20;

    // 批量操作工具栏（show-top-expandrow）
    if (showBatchToolbar && batchBtns.length > 0) {
      let bx = CARD_W - PAD;
      [...batchBtns].reverse().forEach(lbl => {
        const bw = 72;
        bx -= bw;
        const b = frame(`batch-${lbl}`, bw, 32, C.white,
          {r:4, x:bx, y:curY, stroke:C.border, strokeA:0.15, strokeW:1});
        mainCard.appendChild(b);
        const bt = text(lbl, C.textBase, 14, {lh:22, a:0.7});
        bt.x = Math.round((bw-bt.width)/2); bt.y=5;
        b.appendChild(bt);
        bx -= 8;
      });
      curY += 32 + 12;
    }

    // 表头（只有底部 1px 分割线，无四周外框）
    const thead = frame('表头', TBL_W, rowH, C.tableHd, {x:PAD, y:curY});
    mainCard.appendChild(thead);
    thead.appendChild(rect(TBL_W, 1, C.border, {a:0.06, x:0, y:rowH-1}));
    let cx = 0;
    resolvedCols.forEach((col, i) => {
      const cell = frame(`th-${i}`, col.w, rowH, null);
      cell.fills=[]; cell.x=cx; cell.y=0;
      thead.appendChild(cell);
      const cy = Math.round((rowH-22)/2);
      if (col.type==='selection') {
        cell.appendChild(rect(14,14,C.white,{r:2,x:17,y:Math.round((rowH-14)/2),stroke:C.border,strokeA:0.2,strokeW:1}));
      } else if (col.type==='radio') {
        cell.appendChild(rect(14,14,C.white,{r:7,x:17,y:Math.round((rowH-14)/2),stroke:C.border,strokeA:0.2,strokeW:1}));
      } else if (col.type==='operation') {
        const t=text(col.label||'操作',C.textBase,14,{lh:22,a:0.85,style:'Medium'});
        t.x=Math.round((col.w-t.width)/2); t.y=cy; cell.appendChild(t);
      } else {
        const t=text(col.label||'',C.textBase,14,{lh:22,a:0.85,style:'Medium'});
        t.x=16; t.y=cy; cell.appendChild(t);
      }
      cx += col.w;
    });

    // 冻结列分隔线（表头）
    if (frozenLeft>0) {
      const lx = resolvedCols.slice(0,frozenLeft).reduce((s,c)=>s+c.w,0);
      thead.appendChild(rect(2,rowH,C.border,{a:0.15,x:lx-1,y:0}));
    }
    if (frozenRight>0) {
      const rx = TBL_W - resolvedCols.slice(-frozenRight).reduce((s,c)=>s+c.w,0);
      thead.appendChild(rect(2,rowH,C.border,{a:0.15,x:rx-1,y:0}));
    }

    curY += rowH;

    // 空状态（Figma 实测：单行 48px，含 icon + 暂无数据）
    if (showEmpty) {
      const emptyH = 48;
      const emptyRow = frame('空状态', TBL_W, emptyH, C.white, {x:PAD, y:curY});
      mainCard.appendChild(emptyRow);
      emptyRow.appendChild(rect(TBL_W, 1, C.border, {a:0.06, x:0, y:emptyH-1}));
      // 暂无数据：icon(16px) + 文字，水平居中，垂直居中（Figma 实测 opacity=0.65）
      const iconW = 16, gap = 8;
      const et = text('暂无数据', C.textBase, 14, {lh:22, a:0.65});
      const totalW = iconW + gap + et.width;
      const startX = Math.round((TBL_W - totalW) / 2);
      const iconY = Math.round((emptyH - 16) / 2);
      emptyRow.appendChild(rect(iconW, iconW, C.border, {a:0.15, r:2, x:startX, y:iconY}));
      et.x = startX + iconW + gap;
      et.y = Math.round((emptyH - 22) / 2);
      emptyRow.appendChild(et);
      curY += emptyH;
      return;
    }

    // 数据行（只有底部 1px 分割线，无四周外框）
    rows.forEach((row, ri) => {
      const tr = frame(`tr-${ri}`, TBL_W, rowH, C.white, {x:PAD, y:curY});
      mainCard.appendChild(tr);
      tr.appendChild(rect(TBL_W, 1, C.border, {a:0.06, x:0, y:rowH-1}));
      let cx2=0;
      const cy = Math.round((rowH-22)/2);
      resolvedCols.forEach((col, ci) => {
        const cell=frame(`td-${ri}-${ci}`,col.w,rowH,null);
        cell.fills=[]; cell.x=cx2; cell.y=0;
        tr.appendChild(cell);
        if (col.type==='selection') {
          cell.appendChild(rect(14,14,C.white,{r:2,x:17,y:Math.round((rowH-14)/2),stroke:C.border,strokeA:0.15,strokeW:1}));
        } else if (col.type==='radio') {
          // 第一行显示选中态
          if (ri===0) {
            const outer=rect(14,14,C.primary,{r:7,x:17,y:Math.round((rowH-14)/2),a:0.15});
            cell.appendChild(outer);
            cell.appendChild(rect(6,6,C.primary,{r:3,x:21,y:Math.round((rowH-6)/2)}));
          } else {
            cell.appendChild(rect(14,14,C.white,{r:7,x:17,y:Math.round((rowH-14)/2),stroke:C.border,strokeA:0.15,strokeW:1}));
          }
        } else if (col.type==='operation') {
          const ops = col.ops || [{label:'查看',color:C.primary},{label:'编辑',color:C.primary}];
          let ox=8;
          ops.forEach(op=>{
            const ot=text(op.label,op.color,14,{lh:22,x:ox,y:cy});
            cell.appendChild(ot); ox+=ot.width+8;
          });
          if (col.showMore) {
            const mi=icon('more-horizontal',16,C.textBase,0.4);
            if(mi){mi.x=ox;mi.y=Math.round((rowH-16)/2);cell.appendChild(mi);}
          }
        } else {
          const val = col.prop ? (row[col.prop]||'') : '';
          const tv=text(val,C.textBase,14,{lh:22,a:0.85,x:16,y:cy});
          cell.appendChild(tv);
        }
        cx2+=col.w;
      });

      // 冻结列分隔线（数据行）
      if (frozenLeft>0) {
        const lx=resolvedCols.slice(0,frozenLeft).reduce((s,c)=>s+c.w,0);
        tr.appendChild(rect(2,rowH,C.border,{a:0.1,x:lx-1,y:0}));
      }
      if (frozenRight>0) {
        const rx=TBL_W-resolvedCols.slice(-frozenRight).reduce((s,c)=>s+c.w,0);
        tr.appendChild(rect(2,rowH,C.border,{a:0.1,x:rx-1,y:0}));
      }

      curY += rowH;
    });
  }

  // ── 数据 ──────────────────────────────────────────────
  const sampleRows = [
    {productName:'碧桂园总部', productID:'952795279527', address:'广东省佛山市顺德区北滘碧桂园总部大楼', productAmount:'9527.27', remarks:''},
    {productName:'碧桂园总部', productID:'952795279527', address:'广东省佛山市顺德区北滘碧桂园总部大楼', productAmount:'9527.27', remarks:'商品备注信息'},
    {productName:'碧桂园总部', productID:'952795279527', address:'广东省佛山市顺德区北滘碧桂园总部大楼', productAmount:'9527.27', remarks:'商品备注信息'},
    {productName:'碧桂园总部', productID:'952795279527', address:'广东省佛山市顺德区北滘碧桂园总部大楼', productAmount:'9527.27', remarks:'商品备注信息'},
    {productName:'碧桂园总部', productID:'952795279527', address:'广东省佛山市顺德区北滘碧桂园总部大楼', productAmount:'9527.27', remarks:'商品备注信息'},
  ];

  // ── 6种表格配置 ───────────────────────────────────────
  const tables = [
    {
      title: '基础表格',
      cols: [
        {label:'商品名称', prop:'productName', w:120},
        {label:'商品ID',   prop:'productID',   w:140},
        {label:'地址',     prop:'address'},
        {label:'商品金额', prop:'productAmount',w:140},
        {label:'备注',     prop:'remarks',     w:140},
      ],
      rows: sampleRows.slice(0,5),
      opts: {},
    },
    {
      title: '带功能表格',
      cols: [
        {label:'商品名称', prop:'productName', w:140},
        {label:'商品ID',   prop:'productID',   w:140},
        {label:'详细地址', prop:'address'},
        {label:'商品金额', prop:'productAmount',w:140},
        {label:'操作', type:'operation', w:136,
          ops:[{label:'查看',color:C.primary},{label:'编辑',color:C.primary}],
          showMore:true},
      ],
      rows: sampleRows.slice(0,3),
      opts: {},
    },
    {
      title: '带表头选择功能表格',
      cols: [
        {type:'selection', w:48},
        {label:'商品名称', prop:'productName', w:120},
        {label:'商品ID',   prop:'productID',   w:140},
        {label:'详细地址', prop:'address'},
        {label:'商品金额', prop:'productAmount',w:140},
        {label:'备注',     prop:'remarks',     w:140},
      ],
      rows: sampleRows.slice(0,3),
      opts: {showBatchToolbar:true, batchBtns:['操作','操作']},
    },
    {
      title: '带冻结功能表格',
      cols: [
        {type:'selection', w:48},
        {label:'商品名称', prop:'productName', w:140},
        {label:'商品ID',   prop:'productID',   w:120},
        {label:'详细地址', prop:'address',     w:140},
        {label:'商品金额', prop:'productAmount'},
        {label:'备注',     prop:'remarks',     w:140},
        {label:'操作', type:'operation', w:136,
          ops:[{label:'查看',color:C.primary},{label:'编辑',color:C.primary}],
          showMore:true},
      ],
      rows: sampleRows.slice(0,5),
      opts: {frozenLeft:1, frozenRight:1},
    },
    {
      title: '表格空状态',
      cols: [
        {label:'商品名称', prop:'productName', w:140},
        {label:'商品ID',   prop:'productID',   w:140},
        {label:'详细地址', prop:'address'},
        {label:'商品金额', prop:'productAmount',w:140},
        {label:'操作', type:'operation', w:136},
      ],
      rows: [],
      opts: {showEmpty:true},
    },
    {
      title: '迷你表格',
      cols: [
        {type:'radio', w:40},
        {label:'商品ID',   prop:'productID',   w:140},
        {label:'地址',     prop:'address'},
        {label:'商品金额', prop:'productAmount',w:140},
        {label:'备注',     prop:'remarks',     w:140},
      ],
      rows: sampleRows.slice(0,3),
      opts: {rowH:40},
    },
  ];

  // ── 生成所有画板 ──────────────────────────────────────
  const pages = [];
  const OUTER_PAD = 16, CARD_H = 756;

  tables.forEach((t, i) => {
    const pageFrame = frame(t.title, 1440, 900, C.pageBg, {x:0, y:i*940});
    figma.currentPage.appendChild(pageFrame);
    pages.push(pageFrame);

    buildSidebar(pageFrame);

    const main = frame('主区域', 1232, 900, C.pageBg, {x:208, clip:true});
    pageFrame.appendChild(main);
    buildTopNav(main);
    buildTitleBar(main, t.title);

    const content = frame('内容区', 1232, 788, C.pageBg);
    content.y = 112; main.appendChild(content);

    const mainCard = frame('内容卡片', 1200, CARD_H, C.white,
      {r:8, x:OUTER_PAD, y:OUTER_PAD});
    content.appendChild(mainCard);

    buildTable(mainCard, t.cols, t.rows, t.opts);
  });

  figma.currentPage.selection = [pages[0]];
  figma.viewport.scrollAndZoomIntoView(pages);
  figma.closePlugin(`✅ 6种表格已生成`);
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
