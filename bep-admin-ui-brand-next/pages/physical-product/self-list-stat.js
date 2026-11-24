// ── 实物商品·自营商家列表页 ────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-07
// 说明：复制版，去掉 Tabs，增加统计卡片，表格行高调整为 66。

Object.assign(BEP_ICONS, {
  'package':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.25L12 3L3 8.25M21 8.25V15.75L12 21M21 8.25L12 13.5M3 8.25V15.75L12 21M3 8.25L12 13.5M12 13.5V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'store':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10H20L18.8 4H5.2L4 10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 10V20H18V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 20V15H15V20" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  'chart':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 19V11M12 19V5M19 19V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  'message':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V14.5C20 15.3284 19.3284 16 18.5 16H9L5 20V16H5.5C4.67157 16 4 15.3284 4 14.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  'download':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V15M12 15L7 10M12 15L17 10M5 19H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
});

var CANVAS_W  = 1440, CANVAS_H = 900;
var SIDE_W    = 208,  HDR_H    = 96;
var OUTER_PAD = 16,   CARD_PAD = 24;
var TABLE_W   = CANVAS_W - SIDE_W - OUTER_PAD * 2 - CARD_PAD * 2;  // 1152
var TABLE_HEADER_H = 48;
var TABLE_ROW_H = 66;

var ACTIONS = [
  { label:'编辑', type:'primary' },
  { label:'下架', type:'primary' },
  { label:'下发门店', type:'primary' },
];

// 运行时按真实文本测量后填充。表格必须先按列建模，再把行数据填入列。
var COL_WIDTH_AUDIT = [];
var MAIN_COLS = [];
var ACTION_COLS = [
  { label:'操作',           w:   0, align:'left'   },
];
var MAIN_TABLE_W = MAIN_COLS.reduce(function(sum, col) { return sum + col.w; }, 0);

var STAT_CARDS = [
  { title:'全部商品数量', value:'12', color:BEP_C.primary, bg:'F0F8FC', border:'D7EEF7', icon:'Line/package' },
  { title:'已上架商品数量', value:'2', color:BEP_C.success, bg:'F1FAF1', border:'D9F1DA', icon:'Line/shopping-bag' },
  { title:'待处理商品数量', value:'2', color:BEP_C.warning, bg:'FFF8EF', border:'FFE6C7', icon:'Line/activity' },
  { title:'异常商品数量', value:'2', color:BEP_C.danger, bg:'FFF3F2', border:'FFD8D5', icon:'Line/alert-triangle' },
];

var ROWS = [
  {
    name:'品质棉质卫衣', code:'SPU-20260626-00841',
    scm:'SCM-MAIN-2026-00841', sku:'4', cost:'¥155.00', price:'¥299.00', stock:'155',
    status:'审核中', statusType:'warning',
    note:'有 2 家门店改价审批中'
  },
  {
    name:'商务休闲T恤', code:'SPU-20260621-00792',
    scm:'SCM-MAIN-2026-00792', sku:'6', cost:'¥88.00', price:'¥168.00', stock:'8',
    status:'已上架', statusType:'success',
    note:'已连续62天无动销，约28天后自动下架'
  },
  {
    name:'精纺羊毛围巾', code:'SPU-20260618-00750',
    scm:'SCM-MAIN-2026-00750', sku:'3', cost:'¥120.00', price:'¥239.00', stock:'210',
    status:'待上架', statusType:'disabled',
    note:''
  },
  {
    name:'商务西装外套', code:'SPU-20260610-00698',
    scm:'SCM-MAIN-2026-00698', sku:'8', cost:'¥380.00', price:'-', stock:'320',
    status:'自动下架', statusType:'warning',
    note:'下架原因：系统自动下架（无动销）'
  },
  {
    name:'精选有机棉衬衫', code:'SPU-20260612-00733',
    scm:'SCM-MAIN-2026-00733', sku:'5', cost:'¥129.00', price:'-', stock:'88',
    status:'强制下架', statusType:'danger',
    note:'下架原因：平台违规下架｜价格欺诈'
  },
];

function measureTextWidth(chars, opts) {
  opts = opts || {};
  var t = bepText(String(chars), B, 14, { style: opts.style || 'Regular', lh:22 });
  var w = Math.ceil(t.width);
  t.remove();
  return w;
}

function measureTagWidth(label, type) {
  var tag = bepTag(label, type || 'info', 'outline');
  var w = Math.ceil(tag.width);
  tag.remove();
  return w;
}

function maxMeasuredText(items, opts) {
  var max = 0;
  var maxText = '';
  items.forEach(function(text) {
    var w = measureTextWidth(text, opts);
    if (w > max) {
      max = w;
      maxText = text;
    }
  });
  return { text:maxText, w:max };
}

function makeMeasuredCol(label, samples, align, opts) {
  opts = opts || {};
  var headerW = measureTextWidth(label, { style:'Medium' });
  var sample = maxMeasuredText(samples);
  var contentW = Math.max(headerW, sample.w);
  var finalW = Math.max(opts.minW || 0, contentW + 32);
  return {
    col: { label:label, w:finalW, align:align || 'left' },
    audit: {
      label:label || 'checkbox',
      header:label,
      maxContent:sample.text,
      calcW:contentW + ' + 32',
      finalW:finalW,
      reason:opts.reason || '按表头与最长内容实测'
    }
  };
}

function buildMeasuredColumns(actionW) {
  var infoSamples = ROWS.reduce(function(list, row) {
    list.push(row.name);
    list.push(row.code);
    return list;
  }, []);
  var infoSample = maxMeasuredText(infoSamples);
  var infoContentW = Math.max(measureTextWidth('商品信息', { style:'Medium' }), 40 + 12 + infoSample.w);
  var infoW = infoContentW + 32;
  var statusMax = ROWS.reduce(function(max, row) {
    return Math.max(max, measureTagWidth(row.status, row.statusType));
  }, measureTextWidth('商品状态', { style:'Medium' }));
  var statusW = statusMax + 32;

  var measured = [
    { col:{ label:'', w:48, align:'center' }, audit:{ label:'checkbox', header:'', maxContent:'16px checkbox', calcW:48, finalW:48, reason:'BeP checkbox列固定48' } },
    {
      col:{ label:'商品信息', w:infoW, align:'left' },
      audit:{ label:'商品信息', header:'商品信息', maxContent:infoSample.text, calcW:'40图片 + 12间距 + ' + infoSample.w + '文本 + 32', finalW:infoW, reason:'图片加商品名/商品编码两行文本实测' }
    },
    makeMeasuredCol('供应链主编号', ROWS.map(function(row) { return row.scm; }), 'left', { reason:'完整展示最长供应链主编号' }),
    makeMeasuredCol('SKU数', ROWS.map(function(row) { return row.sku; }), 'right', { reason:'数值列右对齐' }),
    makeMeasuredCol('供货价', ROWS.map(function(row) { return row.cost; }), 'right', { reason:'金额列右对齐' }),
    makeMeasuredCol('在售价', ROWS.map(function(row) { return row.price; }), 'right', { reason:'金额列右对齐；无价格展示-' }),
    makeMeasuredCol('库存', ROWS.map(function(row) { return row.stock; }), 'right', { reason:'库存数值列右对齐' }),
    {
      col:{ label:'商品状态', w:statusW, align:'center' },
      audit:{ label:'商品状态', header:'商品状态', maxContent:'审核中/已上架/待上架/自动下架/强制下架', calcW:statusMax + ' + 32', finalW:statusW, reason:'合并审核状态与上架状态，状态Tag按最大Tag宽实测' }
    },
    makeMeasuredCol('备注', ROWS.map(function(row) { return row.note || '-'; }), 'left', { reason:'商品编码后的说明拆为独立备注列' }),
  ];

  MAIN_COLS = measured.map(function(item) { return item.col; });
  MAIN_TABLE_W = MAIN_COLS.reduce(function(sum, col) { return sum + col.w; }, 0);
  COL_WIDTH_AUDIT = measured.map(function(item) { return item.audit; });
  COL_WIDTH_AUDIT.push({
    label:'操作',
    header:'操作',
    maxContent:'编辑 / 下架 / 下发门店',
    calcW:'bepActionCell(actions).width + 32',
    finalW:actionW,
    reason:'自然流复合操作列：16 + 编辑 + 16 + 下架 + 16 + 下发门店 + 16'
  });
}

function buildStats(stats, totalW) {
  var gap = 16;
  var cardW = Math.floor((totalW - gap * (stats.length - 1)) / stats.length);
  var wrap = bepFrame(totalW, 72, { name:'商品统计卡片组', clip:false });
  wrap.fills = [];

  stats.forEach(function(item, i) {
    var card = bepFrame(cardW, 72, { name:'StatCard/' + item.title, r:4, clip:true });
    card.x = i * (cardW + gap);
    card.y = 0;
    card.fills = bepSolid(bepHex(item.bg));
    card.strokes = bepSolid(bepHex(item.border), 1);
    card.strokeWeight = 1;
    card.strokeAlign = 'INSIDE';

    var label = bepText(item.title, B, 12, { lh:18, a:0.45, x:16, y:12 });
    card.appendChild(label);

    var value = bepText(item.value, item.color, 24, { style:'Medium', lh:32, x:16, y:32 });
    card.appendChild(value);

    var iconBg = bepFrame(44, 44, { name:'StatIconBg', r:22, clip:true });
    iconBg.x = cardW - 60;
    iconBg.y = 14;
    iconBg.fills = bepSolid(item.color, 0.12);
    card.appendChild(iconBg);

    var icon = bepIcon(item.icon, 24, item.color);
    icon.x = iconBg.x + 10;
    icon.y = iconBg.y + 10;
    card.appendChild(icon);

    wrap.appendChild(card);
  });

  return wrap;
}

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'实物商品-自营商家列表-统计卡版', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var sidebar = buildSidebar();
  pageFrame.appendChild(sidebar);

  var pageHeader = bepHeader('实物商品', ['商品管理', '实物商品'], CANVAS_W - SIDE_W);
  pageHeader.x = SIDE_W; pageHeader.y = 0;
  pageFrame.appendChild(pageHeader);

  var card = bepFrame(CANVAS_W - SIDE_W - OUTER_PAD * 2, 100, { name:'自营商家商品列表', r:8, clip:true });
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD;
  card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var cy = CARD_PAD;

  var statCards = buildStats(STAT_CARDS, TABLE_W);
  statCards.x = CARD_PAD; statCards.y = cy;
  card.appendChild(statCards);
  cy += statCards.height + 24;

  var filters = bepFilterGrid([
    { label:'商品名称/编码', placeholder:'搜索商品名称或 SPU 编码' },
    { label:'商品状态',     placeholder:'全部状态', type:'select' },
    { label:'商品类型',     placeholder:'实物商品', type:'select' },
    { label:'品牌',         placeholder:'输入品牌名称' },
    { label:'标准类目',     placeholder:'全部类目', type:'select' },
  ], TABLE_W, false);
  filters.x = CARD_PAD; filters.y = cy;
  card.appendChild(filters);
  cy += filters.height + 16;

  var warning = buildSupplyWarning(TABLE_W);
  warning.x = CARD_PAD; warning.y = cy;
  card.appendChild(warning);
  cy += warning.height + 24;

  var countText = bepText('共 12 件实物商品', B, 14, { lh:22, a:0.65 });
  countText.x = CARD_PAD; countText.y = cy + 5;
  card.appendChild(countText);

  var exportBtn = bepButton('导出列表', 'secondary', 32);
  exportBtn.x = CARD_PAD + TABLE_W - exportBtn.width;
  exportBtn.y = cy;
  card.appendChild(exportBtn);
  cy += 32 + 16;

  var actionProbe = bepActionCell(ACTIONS);
  var ACTION_W = actionProbe.width + 32;
  actionProbe.remove();
  ACTION_COLS[0].w = ACTION_W;
  buildMeasuredColumns(ACTION_W);
  var MAIN_VIEW_W = TABLE_W - ACTION_W;

  var tableStartY = cy;
  var mainViewport = bepFrame(MAIN_VIEW_W, TABLE_HEADER_H + ROWS.length * TABLE_ROW_H, { name:'内容表格视窗/横向可滚动', clip:true });
  mainViewport.x = CARD_PAD; mainViewport.y = tableStartY;
  mainViewport.fills = [];
  card.appendChild(mainViewport);

  var mainHeader = bepTableHeader(MAIN_COLS, MAIN_TABLE_W);
  mainHeader.x = 0; mainHeader.y = 0;
  mainViewport.appendChild(mainHeader);

  ROWS.forEach(function(row, i) {
    var r = buildTableRowH(makeMainCells(row), MAIN_COLS, MAIN_TABLE_W, TABLE_ROW_H, null);
    r.name = 'Row/点击查看/' + row.name;
    r.x = 0; r.y = TABLE_HEADER_H + i * TABLE_ROW_H;
    mainViewport.appendChild(r);
  });

  var frozenActions = bepFrame(ACTION_W, TABLE_HEADER_H + ROWS.length * TABLE_ROW_H, { name:'冻结操作列', clip:true });
  frozenActions.x = CARD_PAD + TABLE_W - ACTION_W;
  frozenActions.y = tableStartY;
  frozenActions.fills = bepSolid(BEP_C.white);
  frozenActions.effects = [BEP_SHADOW_FREEZE_RIGHT];
  card.appendChild(frozenActions);

  var actionHeader = bepTableHeader(ACTION_COLS, ACTION_W);
  actionHeader.x = 0; actionHeader.y = 0;
  frozenActions.appendChild(actionHeader);

  ROWS.forEach(function(row, i) {
    var actionRow = buildTableRowH(makeActionCells(row), ACTION_COLS, ACTION_W, TABLE_ROW_H, null);
    actionRow.name = 'FrozenAction/' + row.name;
    actionRow.x = 0; actionRow.y = TABLE_HEADER_H + i * TABLE_ROW_H;
    frozenActions.appendChild(actionRow);
  });

  cy += TABLE_HEADER_H + ROWS.length * TABLE_ROW_H;

  cy += 16;
  var pagination = bepPagination('共 12 条', 1, [1, 2], '10条/页');
  pagination.x = CARD_PAD + TABLE_W - pagination.width;
  pagination.y = cy;
  card.appendChild(pagination);
  cy += 32 + CARD_PAD;
  card.resize(card.width, cy);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 实物商品自营商家列表统计卡版生成完成');
}

function makeMainCells(row) {
  var info = bepFrame(MAIN_COLS[1].w - 32, 40, { name:'商品信息Cell', clip:true });
  info.fills = [];
  var image = buildProductImage(row.name);
  image.x = 0; image.y = 0;
  info.appendChild(image);
  var textW = MAIN_COLS[1].w - 32 - 40 - 12;
  var name = bepTruncText(row.name, B, textW, { a:0.85 });
  name.x = 52; name.y = 0;
  info.appendChild(name);
  var sub = bepTruncText(row.code, B, textW, { a:0.45 });
  sub.x = 52; sub.y = 20;
  info.appendChild(sub);

  return [
    { content: buildCheckbox(), align:'center' },
    { content: info },
    { content: bepTruncText(row.scm, BEP_C.primary, MAIN_COLS[2].w - 32, { a:1 }) },
    { content: bepTruncText(row.sku, B, MAIN_COLS[3].w - 32, { a:0.65, alignH:'RIGHT' }), align:'right' },
    { content: bepTruncText(row.cost, B, MAIN_COLS[4].w - 32, { a:0.45, alignH:'RIGHT' }), align:'right' },
    { content: bepTruncText(row.price, B, MAIN_COLS[5].w - 32, { a:0.85, alignH:'RIGHT' }), align:'right' },
    { content: bepTruncText(row.stock, B, MAIN_COLS[6].w - 32, { a:0.65, alignH:'RIGHT' }), align:'right' },
    { content: bepTag(row.status, row.statusType, 'outline'), align:'center' },
    { content: bepTruncText(row.note || '-', B, MAIN_COLS[8].w - 32, { a: row.note ? 0.65 : 0.35 }) },
  ];
}

function makeActionCells(row) {
  return [
    { content: bepActionCell(ACTIONS) },
  ];
}

function buildSupplyWarning(w) {
  var wrap = bepFrame(w, 56, { name:'供应链提示', r:2, clip:true });
  wrap.fills = bepSolid(bepHex('FFF6EC'));
  wrap.strokes = bepSolid(bepHex('FFEDDA'), 1);
  wrap.strokeWeight = 1;
  wrap.strokeAlign = 'INSIDE';

  var ico = bepIcon('Line/alert-circle', 16, BEP_C.warning);
  ico.x = 16; ico.y = 12;
  wrap.appendChild(ico);

  var title = bepText('自营商品由供应链统一下发，商家不可自主创建', B, 14, { style:'Medium', lh:22, a:0.85 });
  title.x = 40; title.y = 8;
  wrap.appendChild(title);

  var desc = bepText('名称、主图、供货价、库存与配送方式来自供应链；商家可配置售价、店铺分类、商品详情与下单必填信息。', B, 12, { lh:18, a:0.65 });
  desc.x = 40; desc.y = 31;
  wrap.appendChild(desc);
  return wrap;
}

function buildTableRowH(cells, cols, tableW, rowH, bgColor) {
  var row = bepFrame(tableW, rowH, { name:'Row', clip:true });
  row.fills = bgColor ? bepSolid(bgColor) : [];
  row.appendChild(bepRect(tableW, 1, B, { a:0.06, x:0, y:rowH - 1 }));

  var cx = 0;
  cells.forEach(function(cell, i) {
    var col = cols[i] || { w:100, align:'left' };
    var cellFrame = bepFrame(col.w, rowH, { name:'TD' + i });
    cellFrame.x = cx;

    var content = cell.content !== undefined ? cell.content : cell;
    var node = typeof content === 'string'
      ? bepTruncText(content, B, col.w - 32, { a:0.65 })
      : content;

    var align = cell.align || col.align || 'left';
    node.y = Math.round((rowH - (node.height || 22)) / 2);
    if (align === 'center') node.x = Math.round((col.w - (node.width || 60)) / 2);
    else if (align === 'right') node.x = col.w - (node.width || 60) - 16;
    else node.x = 16;

    cellFrame.appendChild(node);
    row.appendChild(cellFrame);
    cx += col.w;
  });

  return row;
}

function buildCheckbox() {
  var box = bepFrame(16, 16, { name:'Checkbox', r:2, clip:true });
  box.fills = bepSolid(BEP_C.white);
  box.strokes = bepSolid(B, 0.15);
  box.strokeWeight = 1;
  box.strokeAlign = 'INSIDE';
  return box;
}

function buildProductImage(name) {
  var wrap = bepFrame(40, 40, { name:'商品图片/' + name, r:4, clip:true });
  wrap.fills = bepSolid(bepHex('F7F9FB'));
  wrap.strokes = bepSolid(B, 0.06);
  wrap.strokeWeight = 1;
  wrap.strokeAlign = 'INSIDE';

  var svg;
  if (name.indexOf('T恤') >= 0) {
    svg = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="4" fill="#EEF7FA"/><path d="M14 11L10 14L7 20L12 22L14 18V31H26V18L28 22L33 20L30 14L26 11L23 13H17L14 11Z" fill="#8ED0E3"/><path d="M17 13C17.8 14.3 22.2 14.3 23 13" stroke="#4A9CB8" stroke-width="1.2"/><path d="M14 31H26" stroke="#4A9CB8" stroke-width="1.2"/></svg>';
  } else if (name.indexOf('围巾') >= 0) {
    svg = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="4" fill="#F8F5FF"/><path d="M14 8H24C27 8 29 10 29 13C29 17 26 19 22 19H16V31H10V12C10 10 12 8 14 8Z" fill="#BFA6F2"/><path d="M16 19H26V31H20V24H16V19Z" fill="#8F73D9"/><path d="M12 14H28M12 20H26M12 26H24" stroke="#FFFFFF" stroke-width="1" opacity=".75"/></svg>';
  } else if (name.indexOf('外套') >= 0) {
    svg = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="4" fill="#F3F6F8"/><path d="M14 10L9 15V31H18V15L20 19L22 15V31H31V15L26 10L22 13H18L14 10Z" fill="#5F7388"/><path d="M20 19V31M16 13L20 19L24 13" stroke="#DDE6EE" stroke-width="1.2"/><path d="M12 21H17M23 21H28" stroke="#DDE6EE" stroke-width="1.2"/></svg>';
  } else if (name.indexOf('衬衫') >= 0) {
    svg = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="4" fill="#F3FAF5"/><path d="M14 10L10 15V31H30V15L26 10L22 13H18L14 10Z" fill="#9BD4A8"/><path d="M18 13L20 17L22 13M20 17V31" stroke="#4F9B61" stroke-width="1.2"/><circle cx="20" cy="21" r="1" fill="#4F9B61"/><circle cx="20" cy="25" r="1" fill="#4F9B61"/></svg>';
  } else {
    svg = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="4" fill="#F4F7FF"/><path d="M15 10L10 15L8 23L13 25L15 20V31H25V20L27 25L32 23L30 15L25 10L22 13H18L15 10Z" fill="#7FAAF4"/><path d="M18 13C18.8 14.3 21.2 14.3 22 13M15 31H25" stroke="#4778C8" stroke-width="1.2"/></svg>';
  }

  var node = figma.createNodeFromSvg(svg);
  node.x = 0; node.y = 0;
  wrap.appendChild(node);
  return wrap;
}

function buildSidebar() {
  var sidebar = bepFrame(SIDE_W, CANVAS_H, { name:'侧边栏', clip:true });
  sidebar.fills = bepSolid(bepHex('002138'));

  var y = 0;
  var logo = bepSidebarLogo('商家中心', 'MERCHANT CENTER', SIDE_W);
  logo.y = y; sidebar.appendChild(logo); y += 64;

  var items = [
    ['商品管理', 1, 'expanded', 'package'],
    ['实物商品', 2, 'active', null],
    ['店铺管理', 1, 'default', 'store'],
    ['数据中心', 1, 'default', 'chart'],
    ['消息中心', 1, 'default', 'message'],
  ];

  items.forEach(function(item) {
    var node = bepSidebarItem(item[0], item[1], item[2], item[3], SIDE_W);
    node.y = y;
    sidebar.appendChild(node);
    y += 48;
  });

  return sidebar;
}

buildPage().catch(function(e) {
  figma.notify('❌ ' + e.message, { error:true });
  console.error(e);
});
