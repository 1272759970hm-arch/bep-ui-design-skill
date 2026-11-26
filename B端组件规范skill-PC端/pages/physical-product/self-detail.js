// ── 实物商品·自营商品详情页 ────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-07
// 说明：完整页查看详情；仅做自营商家商品；编辑、下架、下发门店保留入口，下发门店明细暂不展开。

Object.assign(BEP_ICONS, {
  'package':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.25L12 3L3 8.25M21 8.25V15.75L12 21M21 8.25L12 13.5M3 8.25V15.75L12 21M3 8.25L12 13.5M12 13.5V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'store':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10H20L18.8 4H5.2L4 10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 10V20H18V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 20V15H15V20" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  'chart':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 19V11M12 19V5M19 19V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  'message':
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V14.5C20 15.3284 19.3284 16 18.5 16H9L5 20V16H5.5C4.67157 16 4 15.3284 4 14.5V5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
});

var CANVAS_W  = 1440, CANVAS_H = 980;
var SIDE_W    = 208,  HDR_H    = 96;
var OUTER_PAD = 16,   CARD_PAD = 24;
var CARD_W    = CANVAS_W - SIDE_W - OUTER_PAD * 2;
var CONTENT_W = CARD_W - CARD_PAD * 2;

var DETAIL_ACTIONS = [
  { label:'编辑', type:'primary' },
  { label:'下架', type:'primary' },
  { label:'下发门店', type:'primary' },
];

var PRODUCT = {
  name:'品质棉质卫衣',
  spu:'SPU-20260626-00841',
  scm:'SCM-MAIN-2026-00841',
  type:'实物商品',
  category:'服饰配件 / 上装 / 卫衣',
  brand:'优质纺织品供应商A',
  status:'审核中',
  statusType:'warning',
  source:'供应链统一下发',
  delivery:'门店自提、同城配送',
  cost:'¥155.00 起',
  salePrice:'¥299.00 起',
  stock:'155',
  skuCount:'4',
  shopCategory:'门店热销 / 春秋上新',
  requiredInfo:'收货人姓名、手机号、配送地址',
  detailStatus:'已配置商品详情',
  note:'有 2 家门店改价审批中；审核通过后自动同步到已下发门店。',
  auditNote:'门店改价审批中，预计 1 个工作日内完成。',
  updatedAt:'2026-07-28 15:42',
};

var SKU_ROWS = [
  { sku:'SKU-00841-01', spec:'雾蓝 / M', barcode:'6971526084101', cost:'¥155.00', price:'¥299.00', stock:'42', status:'审核中', statusType:'warning' },
  { sku:'SKU-00841-02', spec:'雾蓝 / L', barcode:'6971526084102', cost:'¥155.00', price:'¥299.00', stock:'38', status:'审核中', statusType:'warning' },
  { sku:'SKU-00841-03', spec:'米白 / M', barcode:'6971526084103', cost:'¥158.00', price:'¥309.00', stock:'36', status:'已上架', statusType:'success' },
  { sku:'SKU-00841-04', spec:'米白 / L', barcode:'6971526084104', cost:'¥158.00', price:'¥309.00', stock:'39', status:'已上架', statusType:'success' },
];

var SKU_COLS = [];
var COL_WIDTH_AUDIT = [];

function measureTextWidth(chars, opts) {
  opts = opts || {};
  var t = bepText(String(chars), B, 14, { style:opts.style || 'Regular', lh:22 });
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
      label:label,
      header:label,
      maxContent:sample.text,
      calcW:contentW + ' + 32',
      finalW:finalW,
      reason:opts.reason || '按表头与最长内容实测'
    }
  };
}

function buildSkuColumns() {
  var statusMax = SKU_ROWS.reduce(function(max, row) {
    return Math.max(max, measureTagWidth(row.status, row.statusType));
  }, measureTextWidth('商品状态', { style:'Medium' }));
  var measured = [
    makeMeasuredCol('SKU编码', SKU_ROWS.map(function(row) { return row.sku; }), 'left', { minW:132, reason:'完整展示最长SKU编码' }),
    makeMeasuredCol('规格', SKU_ROWS.map(function(row) { return row.spec; }), 'left', { minW:104, reason:'规格文本自然宽度' }),
    makeMeasuredCol('条形码', SKU_ROWS.map(function(row) { return row.barcode; }), 'left', { minW:132, reason:'完整展示条形码' }),
    makeMeasuredCol('供货价', SKU_ROWS.map(function(row) { return row.cost; }), 'right', { minW:96, reason:'金额列右对齐' }),
    makeMeasuredCol('在售价', SKU_ROWS.map(function(row) { return row.price; }), 'right', { minW:96, reason:'金额列右对齐' }),
    makeMeasuredCol('库存', SKU_ROWS.map(function(row) { return row.stock; }), 'right', { minW:80, reason:'库存数值列右对齐' }),
    {
      col:{ label:'商品状态', w:Math.max(96, statusMax + 32), align:'center' },
      audit:{ label:'商品状态', header:'商品状态', maxContent:'审核中/已上架', calcW:statusMax + ' + 32', finalW:Math.max(96, statusMax + 32), reason:'状态Tag按最大Tag宽实测' }
    },
  ];
  SKU_COLS = measured.map(function(item) { return item.col; });
  COL_WIDTH_AUDIT = measured.map(function(item) { return item.audit; });
}

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'实物商品-自营商品详情', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var sidebar = buildSidebar();
  pageFrame.appendChild(sidebar);

  var pageHeader = bepHeader('商品详情', ['商品管理', '实物商品', '商品详情'], CANVAS_W - SIDE_W);
  pageHeader.x = SIDE_W; pageHeader.y = 0;
  pageFrame.appendChild(pageHeader);

  var card = bepFrame(CARD_W, 100, { name:'自营商品详情', r:8, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD;
  card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var tabs = bepCardTabs(['基础信息', '售卖配置', '商品详情', '下单设置', '操作日志'], 0, CARD_W);
  tabs.x = 0; tabs.y = 0;
  card.appendChild(tabs);

  var cy = 54 + CARD_PAD;

  var summary = buildProductSummary(CONTENT_W);
  summary.x = CARD_PAD; summary.y = cy;
  card.appendChild(summary);
  cy += summary.height + 24;

  var warning = buildSupplyWarning(CONTENT_W);
  warning.x = CARD_PAD; warning.y = cy;
  card.appendChild(warning);
  cy += warning.height + 24;

  var desc = bepDescriptions([
    { title:'供应链信息', items:[
      { label:'商品名称', value:PRODUCT.name },
      { label:'SPU编码', value:PRODUCT.spu },
      { label:'供应链主编号', value:PRODUCT.scm },
      { label:'商品类型', value:PRODUCT.type },
      { label:'标准类目', value:PRODUCT.category },
      { label:'品牌', value:PRODUCT.brand },
      { label:'配送方式', value:PRODUCT.delivery },
      { label:'供货价', value:PRODUCT.cost },
      { label:'库存', value:PRODUCT.stock },
    ]},
    { title:'商家配置', items:[
      { label:'在售价', value:PRODUCT.salePrice },
      { label:'商品状态', node:bepTag(PRODUCT.status, PRODUCT.statusType, 'outline') },
      { label:'SKU数', value:PRODUCT.skuCount },
      { label:'店铺分类', value:PRODUCT.shopCategory },
      { label:'下单必填信息', value:PRODUCT.requiredInfo },
      { label:'商品详情', value:PRODUCT.detailStatus },
      { label:'更新时间', value:PRODUCT.updatedAt },
      { label:'审核备注', value:PRODUCT.auditNote, long:true },
      { label:'业务备注', value:PRODUCT.note, long:true },
    ]},
  ], CONTENT_W);
  desc.x = CARD_PAD; desc.y = cy;
  card.appendChild(desc);
  cy += desc.height + 32;

  var skuTitle = bepText('SKU明细', B, 16, { style:'Medium', lh:24, a:0.85 });
  skuTitle.x = CARD_PAD; skuTitle.y = cy;
  card.appendChild(skuTitle);
  cy += 24 + 16;

  buildSkuColumns();
  var skuTable = buildSkuTable(CONTENT_W);
  skuTable.x = CARD_PAD; skuTable.y = cy;
  card.appendChild(skuTable);
  cy += skuTable.height + CARD_PAD;

  card.resize(card.width, cy);
  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 实物商品自营商品详情生成完成');
  console.log('COL_WIDTH_AUDIT', JSON.stringify(COL_WIDTH_AUDIT, null, 2));
}

function buildProductSummary(w) {
  var wrap = bepFrame(w, 128, { name:'商品概览', r:4, clip:true });
  wrap.fills = bepSolid(bepHex('FAFAFA'));
  wrap.strokes = bepSolid(B, 0.06);
  wrap.strokeWeight = 1;
  wrap.strokeAlign = 'INSIDE';

  var image = buildProductHeroImage(PRODUCT.name);
  image.x = 16; image.y = 16;
  wrap.appendChild(image);

  var name = bepText(PRODUCT.name, B, 20, { style:'Medium', lh:28, a:0.85 });
  name.x = 132; name.y = 18;
  wrap.appendChild(name);

  var status = bepTag(PRODUCT.status, PRODUCT.statusType, 'outline');
  status.x = 132 + name.width + 12; status.y = 21;
  wrap.appendChild(status);

  var code = bepText(PRODUCT.spu + '  |  ' + PRODUCT.scm, B, 14, { lh:22, a:0.45 });
  code.x = 132; code.y = 52;
  wrap.appendChild(code);

  var meta = bepText('自营商品 · ' + PRODUCT.category + ' · ' + PRODUCT.source, B, 14, { lh:22, a:0.65 });
  meta.x = 132; meta.y = 82;
  wrap.appendChild(meta);

  var action = bepActionCell(DETAIL_ACTIONS);
  var actionColW = action.width + 32;
  action.x = w - actionColW + 16;
  action.y = 48;
  wrap.appendChild(action);
  return wrap;
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

function buildSkuTable(w) {
  var tableW = SKU_COLS.reduce(function(sum, col) { return sum + col.w; }, 0);
  var wrap = bepFrame(w, 48 + SKU_ROWS.length * 48, { name:'SKU表格视窗', clip:true });
  wrap.fills = [];

  var header = bepTableHeader(SKU_COLS, tableW);
  header.x = 0; header.y = 0;
  wrap.appendChild(header);

  SKU_ROWS.forEach(function(row, i) {
    var r = bepTableRow(makeSkuCells(row), SKU_COLS, tableW, null);
    r.x = 0; r.y = 48 + i * 48;
    wrap.appendChild(r);
  });
  return wrap;
}

function makeSkuCells(row) {
  return [
    { content:bepTruncText(row.sku, BEP_C.primary, SKU_COLS[0].w - 32, { a:1 }) },
    { content:bepTruncText(row.spec, B, SKU_COLS[1].w - 32, { a:0.85 }) },
    { content:bepTruncText(row.barcode, B, SKU_COLS[2].w - 32, { a:0.65 }) },
    { content:bepTruncText(row.cost, B, SKU_COLS[3].w - 32, { a:0.45, alignH:'RIGHT' }), align:'right' },
    { content:bepTruncText(row.price, B, SKU_COLS[4].w - 32, { a:0.85, alignH:'RIGHT' }), align:'right' },
    { content:bepTruncText(row.stock, B, SKU_COLS[5].w - 32, { a:0.65, alignH:'RIGHT' }), align:'right' },
    { content:bepTag(row.status, row.statusType, 'outline'), align:'center' },
  ];
}

function buildProductHeroImage(name) {
  var wrap = bepFrame(96, 96, { name:'商品主图/' + name, r:4, clip:true });
  wrap.fills = bepSolid(bepHex('F4F7FF'));
  wrap.strokes = bepSolid(B, 0.06);
  wrap.strokeWeight = 1;
  wrap.strokeAlign = 'INSIDE';

  var svg = '<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="4" fill="#F4F7FF"/><path d="M36 20L24 31L18 54L31 59L36 46V78H60V46L65 59L78 54L72 31L60 20L54 27H42L36 20Z" fill="#7FAAF4"/><path d="M42 27C44 31 52 31 54 27M36 78H60M28 36L38 42M68 36L58 42" stroke="#4778C8" stroke-width="2.4" stroke-linecap="round"/><path d="M39 35H57V78H39V35Z" fill="#8CB7F7" opacity=".35"/></svg>';
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
