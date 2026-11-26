// ======================================================
// BeP Admin Kit — 合同列表页面 v2
// 1440×900，含侧边栏 + 顶部导航 + 标题栏 + 筛选区（3行×3列）
// + 操作行 + 表格区（10列 1152px）+ 分页
// ======================================================

const ICONS = {
  "home":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0068 8.82849H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "tool":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.6982 6.30265C14.3171 6.69139 14.3171 7.31353 14.6982 7.70227L16.2977 9.30184C16.6865 9.68288 17.3086 9.68288 17.6974 9.30184L21.4663 5.53286C22.4957 7.80751 22.0084 10.4819 20.2429 12.2473C18.4775 14.0128 15.8031 14.5 13.5285 13.4707L6.62034 20.3788C5.79214 21.2071 4.44936 21.2071 3.62115 20.3788C2.79295 19.5506 2.79295 18.2079 3.62115 17.3797L10.5293 10.4715C9.49996 8.19687 9.98724 5.5225 11.7527 3.75706C13.5181 1.99162 16.1925 1.50434 18.4671 2.53367L14.7082 6.29265L14.6982 6.30265Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "pie-chart":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2104 15.89C19.4603 20.0289 15.1643 22.4921 10.7082 21.9116C6.25216 21.331 2.73058 17.8495 2.09923 13.4003C1.46787 8.95119 3.88181 4.62732 8.00044 2.83002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.0005 12C22.0005 9.34784 20.9469 6.8043 19.0716 4.92893C17.1962 3.05357 14.6527 2 12.0005 2V12H22.0005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "DropDown-Arrow":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "menu":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 18H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bell":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "search":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ======================================================
// Data
// ======================================================
const DATA = [
  {no:'HT202605180001', customer:'碧桂园物业广州区域', name:'广州区域设施设备年度框架采购合同', type:'框架合同', status:'已生效', total:'¥1,200,000.00', sales:'王明', effective:'2026-05-18', expire:'2027-05-17'},
  {no:'HT202605160002', customer:'碧桂园物业深圳区域', name:'深圳区域监控设备专项采购合同', type:'具体合同', status:'待财务审核', total:'¥280,000.00', sales:'李娜', effective:'2026-05-16', expire:'2026-07-15'},
  {no:'HT202605140003', customer:'碧桂园物业佛山区域', name:'佛山区战略合作意向协议', type:'无金额合同', status:'已生效', total:'—', sales:'王明', effective:'2026-05-14', expire:'—'},
  {no:'HT202605120004', customer:'碧桂园物业江门区域', name:'江门区域智慧门禁框架采购合同', type:'框架合同', status:'草稿', total:'¥500,000.00', sales:'刘芳', effective:'2026-06-01', expire:'2027-05-31'},
  {no:'HT202605100005', customer:'碧桂园物业珠海区域', name:'珠海区域厨电年度框架采购合同', type:'框架合同', status:'审核驳回', total:'¥800,000.00', sales:'陈强', effective:'2026-05-10', expire:'2027-05-31'},
  {no:'HT202604010006', customer:'保利物业华南区域', name:'保利华南清洁设备专项采购合同', type:'具体合同', status:'已终止', total:'¥150,000.00', sales:'张涛', effective:'2026-04-01', expire:'2026-08-18'},
  {no:'HT202605150007', customer:'碧桂园物业北京区域', name:'北京区域电梯维保年度框架合同', type:'框架合同', status:'已生效', total:'¥960,000.00', sales:'王明', effective:'2026-05-15', expire:'2027-05-14'},
  {no:'HT202605130008', customer:'碧桂园物业上海区域', name:'上海区域智能安防设备采购合同', type:'具体合同', status:'待财务审核', total:'¥320,000.00', sales:'李娜', effective:'2026-05-13', expire:'2026-09-12'},
  {no:'HT202605110009', customer:'碧桂园物业成都区域', name:'成都区域绿化养护服务合同', type:'具体合同', status:'已生效', total:'¥180,000.00', sales:'刘芳', effective:'2026-05-11', expire:'2026-11-10'},
  {no:'HT202605090010', customer:'碧桂园物业武汉区域', name:'武汉区域消防设施年度维保合同', type:'框架合同', status:'草稿', total:'¥420,000.00', sales:'陈强', effective:'2026-06-01', expire:'2027-05-31'},
  {no:'HT202605070011', customer:'万科物业华南区域', name:'万科华南区域安保服务框架合同', type:'框架合同', status:'已生效', total:'¥1,500,000.00', sales:'张涛', effective:'2026-05-07', expire:'2027-05-06'},
  {no:'HT202605050012', customer:'碧桂园物业重庆区域', name:'重庆区域停车管理系统采购合同', type:'具体合同', status:'审核驳回', total:'¥245,000.00', sales:'王明', effective:'2026-05-05', expire:'2026-08-04'},
  {no:'HT202605030013', customer:'碧桂园物业杭州区域', name:'杭州区域物业管理系统年度服务合同', type:'框架合同', status:'已生效', total:'¥680,000.00', sales:'李娜', effective:'2026-05-03', expire:'2027-05-02'},
  {no:'HT202605010014', customer:'碧桂园物业南京区域', name:'南京区域环境整治专项服务合同', type:'具体合同', status:'待财务审核', total:'¥195,000.00', sales:'刘芳', effective:'2026-05-01', expire:'2026-07-31'},
  {no:'HT202604280015', customer:'华润物业广州区域', name:'华润广州区域清洁外包服务合同', type:'无金额合同', status:'已生效', total:'—', sales:'陈强', effective:'2026-04-28', expire:'—'},
  {no:'HT202604250016', customer:'碧桂园物业长沙区域', name:'长沙区域智慧停车设备采购合同', type:'具体合同', status:'已到期', total:'¥168,000.00', sales:'张涛', effective:'2025-04-25', expire:'2026-04-24'},
  {no:'HT202604200017', customer:'碧桂园物业天津区域', name:'天津区域暖通设备维保年度合同', type:'框架合同', status:'已生效', total:'¥540,000.00', sales:'王明', effective:'2026-04-20', expire:'2027-04-19'},
  {no:'HT202604150018', customer:'碧桂园物业西安区域', name:'西安区域门禁系统升级改造合同', type:'具体合同', status:'已终止', total:'¥298,000.00', sales:'李娜', effective:'2026-04-15', expire:'2026-07-14'},
  {no:'HT202604100019', customer:'中海物业华南区域', name:'中海华南区域设施设备维保框架合同', type:'框架合同', status:'已生效', total:'¥2,100,000.00', sales:'刘芳', effective:'2026-04-10', expire:'2027-04-09'},
  {no:'HT202604050020', customer:'碧桂园物业郑州区域', name:'郑州区域物业服务年度框架采购合同', type:'框架合同', status:'草稿', total:'¥750,000.00', sales:'陈强', effective:'2026-06-01', expire:'2027-05-31'},
];

// ======================================================

async function buildPage() {

  // ── Color helpers ─────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.replace('#',''), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
  }
  function solid(color, a) {
    return [{ type: 'SOLID', color, opacity: (a === undefined ? 1 : a) }];
  }

  // ── Colors ────────────────────────────────────────────
  const C = {
    pageBg:       hex('#F0F2F5'),
    white:        hex('#FFFFFF'),
    black:        hex('#000000'),
    sidebarBg:    hex('#002138'),
    sidebarSub:   hex('#00182A'),
    primary:      hex('#006D9B'),
    // Status tag colors
    statusGreenBg:  hex('#E6F7EF'),
    statusGreenFg:  hex('#00875A'),
    statusOrangeBg: hex('#FFF7E6'),
    statusOrangeFg: hex('#D46B08'),
    statusGrayBg:   hex('#F5F5F5'),
    statusGrayFg:   hex('#595959'),
    statusRedBg:    hex('#FFF1F0'),
    statusRedFg:    hex('#CF1322'),
    statusGray2Fg:  hex('#8C8C8C'),
    // Type tag colors
    typeBlueBg:   hex('#E6F4FF'),
    typeBlueFg:   hex('#0958D9'),
    typeGreenBg:  hex('#F6FFED'),
    typeGreenFg:  hex('#389E0D'),
    typeGrayBg:   hex('#F5F5F5'),
    typeGrayFg:   hex('#595959'),
    // Table header bg
    tblHeaderBg:  hex('#F5F5F5'),
  };

  // ── Font loading ──────────────────────────────────────
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
    figma.loadFontAsync({ family: 'PingFang TC', style: 'Regular' }),
    figma.loadFontAsync({ family: 'PingFang TC', style: 'Medium' }),
    figma.loadFontAsync({ family: 'PingFang TC', style: 'Semibold' }),
  ]);

  // ── Utility: frame ────────────────────────────────────
  function frame(name, w, h, bg, opts) {
    opts = opts || {};
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA !== undefined ? opts.bgA : 1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r !== undefined) f.cornerRadius = opts.r;
    if (opts.x !== undefined) f.x = opts.x;
    if (opts.y !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes = solid(opts.stroke, opts.strokeA !== undefined ? opts.strokeA : 1);
      f.strokeWeight = opts.strokeW || 1;
      f.strokeAlign = 'INSIDE';
    }
    return f;
  }

  // ── Utility: rect ─────────────────────────────────────
  function rect(w, h, color, opts) {
    opts = opts || {};
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a !== undefined ? opts.a : 1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    if (opts.stroke) {
      r.strokes = solid(opts.stroke, opts.strokeA !== undefined ? opts.strokeA : 1);
      r.strokeWeight = opts.strokeW || 1;
      r.strokeAlign = 'INSIDE';
    }
    return r;
  }

  // ── Utility: text ─────────────────────────────────────
  function text(chars, color, size, opts) {
    opts = opts || {};
    const t = figma.createText();
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.fontName = { family: 'PingFang TC', style: opts.style || 'Regular' };
    t.fontSize = size;
    t.lineHeight = { value: opts.lh || (size + 8), unit: 'PIXELS' };
    t.characters = String(chars);
    t.fills = solid(color, opts.a !== undefined ? opts.a : 1);
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }

  // ── Utility: icon ─────────────────────────────────────
  function icon(key, size, color, opacity) {
    if (opacity === undefined) opacity = 1;
    const svg = ICONS[key];
    if (!svg) return null;
    const node = figma.createNodeFromSvg(svg);
    node.resize(size, size);
    node.opacity = opacity;
    node.findAll(n => n.fills && n.fills.length > 0 && n.fills[0].type === 'SOLID').forEach(n => { n.fills = solid(color, 1); });
    node.findAll(n => n.strokes && n.strokes.length > 0).forEach(n => { n.strokes = solid(color, 1); });
    return node;
  }

  // ── Utility: tag pill ─────────────────────────────────
  // Returns frame with text inside; pill width = textNode.width + 12
  function tagPill(label, bgColor, fgColor, parent, x, y) {
    const pill = frame('tag-' + label, 60, 22, bgColor, { r: 4 });
    pill.x = x; pill.y = y;
    parent.appendChild(pill);
    const t = text(label, fgColor, 12, { lh: 20, style: 'Regular' });
    pill.appendChild(t);
    const pillW = t.width + 12;
    pill.resize(pillW, 22);
    t.x = 6; t.y = 1;
    return pill;
  }

  // ── Resolve status tag colors ─────────────────────────
  function statusColors(status) {
    const map = {
      '已生效':    { bg: C.statusGreenBg,  fg: C.statusGreenFg  },
      '待财务审核': { bg: C.statusOrangeBg, fg: C.statusOrangeFg },
      '草稿':      { bg: C.statusGrayBg,   fg: C.statusGrayFg   },
      '审核驳回':  { bg: C.statusRedBg,    fg: C.statusRedFg    },
      '已终止':    { bg: C.statusGrayBg,   fg: C.statusGray2Fg  },
      '已到期':    { bg: C.statusGrayBg,   fg: C.statusGray2Fg  },
    };
    return map[status] || { bg: C.statusGrayBg, fg: C.statusGrayFg };
  }

  // ── Resolve type tag colors ───────────────────────────
  function typeColors(type) {
    const map = {
      '框架合同':  { bg: C.typeBlueBg,  fg: C.typeBlueFg  },
      '具体合同':  { bg: C.typeGreenBg, fg: C.typeGreenFg },
      '无金额合同':{ bg: C.typeGrayBg,  fg: C.typeGrayFg  },
    };
    return map[type] || { bg: C.typeGrayBg, fg: C.typeGrayFg };
  }

  // ══════════════════════════════════════════════════════
  // Layout constants
  // ══════════════════════════════════════════════════════
  const SIDEBAR_W  = 208;
  const CANVAS_W   = 1440;
  const CANVAS_H   = 900;
  const MAIN_W     = CANVAS_W - SIDEBAR_W; // 1232
  const OUTER_PAD  = 16;
  const PAD        = 24;
  const CARD_W     = 1200;
  const CARD_H     = 756;
  const TBL_W      = CARD_W - PAD * 2;  // 1152

  // Filter grid
  const FCOL_W     = 373;
  const COL_X      = [24, 413, 802];
  const FROW0_Y    = 20;
  const FROW1_Y    = 68;
  const FROW2_Y    = 116;
  const FILTER_END_Y = 148;
  const ACTION_Y   = 164;
  const DIVIDER_Y  = 212;
  const TBL_Y      = 225;

  // Table
  const ROW_H      = 48;
  const HEADER_H   = 48;

  // Pagination y
  const PAGER_Y = TBL_Y + HEADER_H + 8 * ROW_H + 16; // = 225+48+384+16 = 673

  // ══════════════════════════════════════════════════════
  // Root 1440×900 frame
  // ══════════════════════════════════════════════════════
  const page = frame('合同列表 v2', CANVAS_W, CANVAS_H, C.pageBg);
  figma.currentPage.appendChild(page);
  page.x = 100; page.y = 100;

  // ══════════════════════════════════════════════════════
  // 1. Sidebar  208×900
  // ══════════════════════════════════════════════════════
  const sidebar = frame('侧边栏', SIDEBAR_W, CANVAS_H, C.sidebarBg, { clip: true });
  page.appendChild(sidebar);

  // ── Logo（BeP 规范：32×32 色块 + 系统名）────────────────
  {
    const logoRow = frame('Logo', SIDEBAR_W, 64, null);
    logoRow.fills = [];
    sidebar.appendChild(logoRow);
    // 主色方块 32×32 r=6，内有缩写"SC"
    const markBox = frame('mark', 32, 32, C.primary, { r: 6, x: 24, y: 16 });
    logoRow.appendChild(markBox);
    const markT = text('SC', C.white, 13, { lh: 18, style: 'Medium' });
    markT.x = Math.round((32 - markT.width) / 2); markT.y = 7;
    markBox.appendChild(markT);
    logoRow.appendChild(text('供应链管理平台', C.white, 16, { lh: 20, style: 'Medium', x: 64, y: 14 }));
    logoRow.appendChild(text('SUPPLY CHAIN MANAGEMENT PLATFORM', C.white, 6, { lh: 10, a: 0.6, x: 64, y: 37 }));
  }

  // ── BeP 侧边栏辅助函数 ────────────────────────────────
  // L1：一级菜单（带图标 + 展开箭头）
  function sideL1(parent, label, iconKey, y, opts) {
    opts = opts || {};
    const op = opts.active ? 1 : 0.5;
    const row = frame('L1·' + label, SIDEBAR_W, ROW_H, C.sidebarBg);
    row.y = y; parent.appendChild(row);
    const ic = icon(iconKey, 16, C.white, op);
    if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    row.appendChild(text(label, C.white, 14, { lh: 22, a: op, x: 52, y: 13 }));
    if (opts.hasArrow !== false) {
      const arr = icon(opts.expanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, op);
      if (arr) { arr.x = 182; arr.y = 18; row.appendChild(arr); }
    }
  }
  // L2：二级菜单（缩进，无图标，无左侧指示条）
  function sideL2(parent, label, y, opts) {
    opts = opts || {};
    const op = opts.active ? 1 : 0.5;
    const row = frame('L2·' + label, SIDEBAR_W, ROW_H, C.sidebarSub);
    row.y = y; parent.appendChild(row);
    row.appendChild(text(label, C.white, 14, { lh: 22, a: op, x: 40, y: 13 }));
  }

  // ── 导航内容（原型内容，BeP L1/L2 规范，L1之间无分割线）
  let sy = 64;
  sideL1(sidebar, '订单管理', 'layers',      sy, { expanded: false });               sy += ROW_H;
  sideL2(sidebar, '企业订单管理', sy);                                                sy += ROW_H;
  sideL2(sidebar, '订单履约',     sy);                                                sy += ROW_H;
  sideL1(sidebar, '销售管理', 'bar-chart-2', sy, { active: true, expanded: true });  sy += ROW_H;
  sideL2(sidebar, '合同管理', sy, { active: true });                                  sy += ROW_H;
  sideL1(sidebar, '基础档案', 'settings',    sy, { expanded: false });                sy += ROW_H;
  sideL2(sidebar, '客户管理',   sy);                                                  sy += ROW_H;
  sideL2(sidebar, '供应商管理', sy);

  // ══════════════════════════════════════════════════════
  // 2. Main area  1232×900  (x=208)
  // ══════════════════════════════════════════════════════
  const main = frame('主区域', MAIN_W, CANVAS_H, C.pageBg, { clip: true });
  main.x = SIDEBAR_W;
  page.appendChild(main);

  // ── 2a. Top nav  1232×56 ────────────────────────────
  {
    const nav = frame('顶部导航', MAIN_W, 56, C.white, {
      stroke: C.black, strokeA: 0.06, strokeW: 1,
    });
    main.appendChild(nav);

    // Left: menu + system name
    const icMenu = icon('menu', 20, C.black, 0.45);
    if (icMenu) { icMenu.x = 16; icMenu.y = 18; nav.appendChild(icMenu); }
    nav.appendChild(text('合同管理系统', C.black, 14, { lh: 22, a: 0.65, x: 44, y: 17 }));

    // Right: search box + bell + avatar
    const SEARCH_W = 160;
    // positions from right: avatar(28) + gap(12) + bell(20) + gap(8) + search(160)
    const avatarX = MAIN_W - PAD - 28;
    const bellX   = avatarX - 12 - 20;
    const searchX = bellX - 8 - SEARCH_W;

    const searchBox = frame('search-input', SEARCH_W, 32, C.white, {
      r: 4, x: searchX, y: 12,
      stroke: C.black, strokeA: 0.12, strokeW: 1,
    });
    nav.appendChild(searchBox);
    const icS = icon('search', 14, C.black, 0.35);
    if (icS) { icS.x = 10; icS.y = 9; searchBox.appendChild(icS); }
    searchBox.appendChild(text('搜索', C.black, 14, { lh: 22, a: 0.25, x: 28, y: 5 }));

    const icBell = icon('bell', 20, C.black, 0.45);
    if (icBell) { icBell.x = bellX; icBell.y = 18; nav.appendChild(icBell); }

    nav.appendChild(rect(28, 28, C.primary, { r: 14, x: avatarX, y: 14 }));
    const uT = text('管', C.white, 12, { lh: 28, style: 'Medium' });
    uT.x = avatarX + Math.round((28 - uT.width) / 2);
    uT.y = 14;
    nav.appendChild(uT);
  }

  // ── 2b. Title bar  1232×56  (y=56) ─────────────────
  {
    const titleBar = frame('标题栏', MAIN_W, 56, C.white, {
      stroke: C.black, strokeA: 0.06, strokeW: 1,
    });
    titleBar.y = 56;
    main.appendChild(titleBar);

    const titleNode = text('合同管理', C.black, 18, { lh: 24, style: 'Medium', x: PAD, y: 16 });
    titleBar.appendChild(titleNode);

    // Breadcrumb: 首页 › 销售管理 › 合同管理
    const crumbs = [
      { label: '首页',   link: true },
      { label: '销售管理', link: true },
      { label: '合同管理', link: false },
    ];
    const sep = ' › '; // ' › '
    let bx = PAD + titleNode.width + 16;
    const bY = Math.round((56 - 18) / 2);

    crumbs.forEach((c, i) => {
      const cNode = text(c.label, C.black, 12, { lh: 18, a: c.link ? 0.65 : 0.45 });
      cNode.x = bx; cNode.y = bY;
      titleBar.appendChild(cNode);
      bx += cNode.width;
      if (i < crumbs.length - 1) {
        const sepNode = text(sep, C.black, 12, { lh: 18, a: 0.25 });
        sepNode.x = bx; sepNode.y = bY;
        titleBar.appendChild(sepNode);
        bx += sepNode.width;
      }
    });
  }

  // ── 2c. Content area  1232×788  (y=112) ─────────────
  const NAV_H = 112; // 56 top nav + 56 title bar
  const content = frame('内容区', MAIN_W, CANVAS_H - NAV_H, C.pageBg);
  content.y = NAV_H;
  main.appendChild(content);

  // Card inside content area
  // CARD_W=1200, CARD_H=756, centered with OUTER_PAD=16 on each side
  const cardX = OUTER_PAD;
  const cardY = OUTER_PAD;
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, { r: 8, x: cardX, y: cardY });
  content.appendChild(mainCard);

  // ══════════════════════════════════════════════════════
  // Filter rows  (inside mainCard)
  // ══════════════════════════════════════════════════════

  // Helper to measure text width via temp node
  function measureText(chars, size, style) {
    const tmp = figma.createText();
    tmp.textAutoResize = 'WIDTH_AND_HEIGHT';
    tmp.fontName = { family: 'PingFang TC', style: style || 'Regular' };
    tmp.fontSize = size || 14;
    tmp.lineHeight = { value: 22, unit: 'PIXELS' };
    tmp.characters = String(chars);
    const w = tmp.width;
    tmp.remove();
    return w;
  }

  // Build a text input box (type=text)
  function buildTextInput(name, parent, x, y, w) {
    const box = frame(name, w, 32, C.white, {
      r: 4, x, y,
      stroke: C.black, strokeA: 0.15, strokeW: 1,
    });
    parent.appendChild(box);
    const ph = text('请输入', C.black, 14, { lh: 22, a: 0.25, x: 12, y: 5 });
    box.appendChild(ph);
    return box;
  }

  // Build a select input box
  function buildSelectInput(name, parent, x, y, w, placeholder) {
    placeholder = placeholder || '请选择';
    const box = frame(name, w, 32, C.white, {
      r: 4, x, y,
      stroke: C.black, strokeA: 0.15, strokeW: 1,
    });
    parent.appendChild(box);
    const ph = text(placeholder, C.black, 14, { lh: 22, a: 0.25, x: 12, y: 5 });
    box.appendChild(ph);
    const arr = icon('DropDown-Arrow', 12, C.black, 0.35);
    if (arr) { arr.x = w - 20; arr.y = 10; box.appendChild(arr); }
    return box;
  }

  // Build a daterange input: two pickers side by side with '至' separator
  function buildDateRange(name, parent, x, y, inputW) {
    const box = frame(name, inputW, 32, C.white, {
      r: 4, x, y,
      stroke: C.black, strokeA: 0.15, strokeW: 1,
    });
    parent.appendChild(box);
    const pickerW = Math.floor((inputW - 20) / 2);
    // left picker
    const leftPh = text('开始日期', C.black, 12, { lh: 22, a: 0.25, x: 8, y: 5 });
    box.appendChild(leftPh);
    // separator
    const sepTxt = text('至', C.black, 12, { lh: 22, a: 0.45 });
    sepTxt.x = pickerW + 4; sepTxt.y = 5;
    box.appendChild(sepTxt);
    // right picker
    const rightPh = text('结束日期', C.black, 12, { lh: 22, a: 0.25 });
    rightPh.x = pickerW + 4 + sepTxt.width + 4; rightPh.y = 5;
    box.appendChild(rightPh);
    return box;
  }

  // Filter field builder for each field spec
  // fieldType: 'text' | 'select' | 'multiselect' | 'daterange'
  function addFilterField(label, col, rowY, fieldType) {
    const x0 = COL_X[col];
    const lblW = measureText(label, 14, 'Regular');
    const lblNode = text(label, C.black, 14, { lh: 22, a: 0.65, x: x0, y: rowY + 5 });
    mainCard.appendChild(lblNode);
    const inputX = x0 + lblW + 8;
    const inputW = FCOL_W - lblW - 8;

    if (fieldType === 'text') {
      buildTextInput('input-' + label, mainCard, inputX, rowY, inputW);
    } else if (fieldType === 'select') {
      buildSelectInput('select-' + label, mainCard, inputX, rowY, inputW);
    } else if (fieldType === 'multiselect') {
      buildSelectInput('multisel-' + label, mainCard, inputX, rowY, inputW, '请选择（可多选）');
    } else if (fieldType === 'daterange') {
      buildDateRange('daterange-' + label, mainCard, inputX, rowY, inputW);
    }
  }

  // Row 0 (y=20): 合同编号(text) | 客户名称(text) | 合同场景(select)
  addFilterField('合同编号', 0, FROW0_Y, 'text');
  addFilterField('客户名称', 1, FROW0_Y, 'text');
  addFilterField('合同场景', 2, FROW0_Y, 'select');

  // Row 1 (y=68): 合同类型(select) | 合同状态(multiselect) | 销售人员(select)
  addFilterField('合同类型', 0, FROW1_Y, 'select');
  addFilterField('合同状态', 1, FROW1_Y, 'multiselect');
  addFilterField('销售人员', 2, FROW1_Y, 'select');

  // Row 2 (y=116): BIP审批编号(text) | 签订日期(daterange) | 到期日期(daterange)
  addFilterField('BIP审批编号', 0, FROW2_Y, 'text');
  addFilterField('签订日期',   1, FROW2_Y, 'daterange');
  addFilterField('到期日期',   2, FROW2_Y, 'daterange');

  // ══════════════════════════════════════════════════════
  // Action row  (y=164, h=32)
  // ══════════════════════════════════════════════════════
  {
    // Left: 查询 + 重置
    // 查询 button
    const qLblW = measureText('查询', 14, 'Regular');
    const qBtnW = qLblW + 16 * 2;
    const qBtn = frame('btn-查询', qBtnW, 32, C.primary, { r: 4, x: PAD, y: ACTION_Y });
    mainCard.appendChild(qBtn);
    const qT = text('查询', C.white, 14, { lh: 22, style: 'Regular' });
    qT.x = 16; qT.y = 5;
    qBtn.appendChild(qT);

    // 重置 button
    const rLblW = measureText('重置', 14, 'Regular');
    const rBtnW = rLblW + 16 * 2;
    const rBtn = frame('btn-重置', rBtnW, 32, C.white, {
      r: 4, x: PAD + qBtnW + 8, y: ACTION_Y,
      stroke: C.black, strokeA: 0.15, strokeW: 1,
    });
    mainCard.appendChild(rBtn);
    const rT = text('重置', C.black, 14, { lh: 22, a: 0.65 });
    rT.x = 16; rT.y = 5;
    rBtn.appendChild(rT);

    // Right side (right-aligned from CARD_W - PAD)
    // 新增合同 (primary, rightmost)
    const newLblW = measureText('新增合同', 14, 'Regular');
    const newBtnW = newLblW + 16 * 2;
    const newBtn = frame('btn-新增合同', newBtnW, 32, C.primary, {
      r: 4, x: CARD_W - PAD - newBtnW, y: ACTION_Y,
    });
    mainCard.appendChild(newBtn);
    const newT = text('新增合同', C.white, 14, { lh: 22 });
    newT.x = 16; newT.y = 5;
    newBtn.appendChild(newT);

    // 导出 (white, 8px left of 新增合同)
    const expLblW = measureText('导出', 14, 'Regular');
    const expBtnW = expLblW + 16 * 2;
    const expBtn = frame('btn-导出', expBtnW, 32, C.white, {
      r: 4, x: CARD_W - PAD - newBtnW - 8 - expBtnW, y: ACTION_Y,
      stroke: C.black, strokeA: 0.15, strokeW: 1,
    });
    mainCard.appendChild(expBtn);
    const expT = text('导出', C.black, 14, { lh: 22, a: 0.65 });
    expT.x = 16; expT.y = 5;
    expBtn.appendChild(expT);
  }

  // ══════════════════════════════════════════════════════
  // Divider at y=212
  // ══════════════════════════════════════════════════════
  mainCard.appendChild(rect(CARD_W, 1, C.black, { a: 0.06, x: 0, y: DIVIDER_Y }));

  // ══════════════════════════════════════════════════════
  // Table columns  (sum = 1152 = TBL_W)
  // 130+150+180+80+80+110+100+95+95+132 = 1152
  // ══════════════════════════════════════════════════════
  const COLS = [
    { label: '合同编号',   w: 130, align: 'left',  type: 'link'    },
    { label: '客户名称',   w: 150, align: 'left',  type: 'plain'   },
    { label: '合同名称',   w: 180, align: 'left',  type: 'plain'   },
    { label: '合同类型',   w:  80, align: 'left',  type: 'typeTag' },
    { label: '合同状态',   w:  80, align: 'left',  type: 'statusTag'},
    { label: '合同总金额', w: 110, align: 'right', type: 'amount'  },
    { label: '销售人员',   w: 100, align: 'left',  type: 'plain'   },
    { label: '生效日期',   w:  95, align: 'left',  type: 'plain'   },
    { label: '到期日期',   w:  95, align: 'left',  type: 'plain'   },
    { label: '操作',       w: 132, align: 'center',type: 'ops'     },
  ];

  // ── Table header ──────────────────────────────────────
  {
    const thead = frame('表头', TBL_W, HEADER_H, C.tblHeaderBg, { x: PAD, y: TBL_Y });
    mainCard.appendChild(thead);
    // bottom border
    thead.appendChild(rect(TBL_W, 1, C.black, { a: 0.06, x: 0, y: HEADER_H - 1 }));

    let cx = 0;
    COLS.forEach(col => {
      const t = text(col.label, C.black, 14, { lh: 22, a: 0.85, style: 'Medium' });
      if (col.align === 'right') {
        t.x = cx + col.w - t.width - 16;
      } else if (col.align === 'center') {
        t.x = cx + Math.round((col.w - t.width) / 2);
      } else {
        t.x = cx + 16;
      }
      t.y = Math.round((HEADER_H - t.height) / 2);
      thead.appendChild(t);
      cx += col.w;
    });
  }

  // ── Data rows (first 8) ────────────────────────────────
  DATA.slice(0, 8).forEach((row, ri) => {
    const trFrame = frame('tr-' + ri, TBL_W, ROW_H, C.white, {
      x: PAD, y: TBL_Y + HEADER_H + ri * ROW_H,
    });
    mainCard.appendChild(trFrame);
    // bottom divider
    trFrame.appendChild(rect(TBL_W, 1, C.black, { a: 0.06, x: 0, y: ROW_H - 1 }));

    // cell data values
    const cellVals = [
      row.no,
      row.customer,
      row.name,
      row.type,
      row.status,
      row.total,
      row.sales,
      row.effective,
      row.expire,
      'ops',
    ];

    let cx = 0;
    COLS.forEach((col, ci) => {
      const val = cellVals[ci];
      const cellY = Math.round((ROW_H - 22) / 2); // vertical center for 22px lh text

      if (col.type === 'link') {
        // 合同编号: primary color, clickable look
        const t = text(val, C.primary, 14, { lh: 22, x: cx + 16, y: cellY });
        trFrame.appendChild(t);

      } else if (col.type === 'plain') {
        // plain text, opacity 0.85
        const t = text(val, C.black, 14, { lh: 22, a: 0.85 });
        if (col.align === 'right') {
          t.x = cx + col.w - t.width - 16;
        } else {
          t.x = cx + 16;
        }
        t.y = cellY;
        trFrame.appendChild(t);

      } else if (col.type === 'amount') {
        // right-aligned amount
        const t = text(val, C.black, 14, { lh: 22, a: 0.85 });
        t.x = cx + col.w - t.width - 16;
        t.y = cellY;
        trFrame.appendChild(t);

      } else if (col.type === 'statusTag') {
        const sc = statusColors(val);
        const tagY = Math.round((ROW_H - 22) / 2);
        tagPill(val, sc.bg, sc.fg, trFrame, cx + 16, tagY);

      } else if (col.type === 'typeTag') {
        const tc = typeColors(val);
        const tagY = Math.round((ROW_H - 22) / 2);
        tagPill(val, tc.bg, tc.fg, trFrame, cx + 16, tagY);

      } else if (col.type === 'ops') {
        // 详情 + 编辑 text buttons, primary color, 8px apart
        const ops = ['详情', '编辑'];
        let ox = cx + 16;
        ops.forEach(label => {
          const ot = text(label, C.primary, 14, { lh: 22, x: ox, y: cellY });
          trFrame.appendChild(ot);
          ox += ot.width + 8;
        });
      }

      cx += col.w;
    });
  });

  // ══════════════════════════════════════════════════════
  // Pagination  (y = PAGER_Y = 673)
  // ══════════════════════════════════════════════════════
  {
    // Left: "共 20 条"
    const totalT = text('共 20 条', C.black, 14, { lh: 22, a: 0.45, x: PAD, y: PAGER_Y });
    mainCard.appendChild(totalT);

    // Right: page buttons [1][2][3]...
    // Active = page 1, then 2, 3
    const pages = ['1', '2', '3'];
    const BTN_SIZE = 32;
    const BTN_GAP  = 4;
    const totalPageBtnW = pages.length * BTN_SIZE + (pages.length - 1) * BTN_GAP;
    let pgx = CARD_W - PAD - totalPageBtnW;

    pages.forEach(p => {
      const isActive = p === '1';
      const pgBtn = frame('pg-' + p, BTN_SIZE, BTN_SIZE, isActive ? C.primary : C.white, {
        r: 4, x: pgx, y: PAGER_Y,
        stroke: isActive ? undefined : C.black,
        strokeA: 0.15,
        strokeW: 1,
      });
      mainCard.appendChild(pgBtn);
      const pt = text(p, isActive ? C.white : C.black, 14, { lh: 22, a: isActive ? 1 : 0.65 });
      pt.x = Math.round((BTN_SIZE - pt.width) / 2);
      pt.y = Math.round((BTN_SIZE - 22) / 2);
      pgBtn.appendChild(pt);
      pgx += BTN_SIZE + BTN_GAP;
    });
  }

  // ══════════════════════════════════════════════════════
  // Finalize
  // ══════════════════════════════════════════════════════
  figma.currentPage.selection = [page];
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin('✅ 合同列表 v2 页面已生成');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
