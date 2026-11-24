// BeP Admin Kit · 标准表格组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:988 / 数据展示-表格

var CANVAS_W = 1280;
var CANVAS_H = 780;
var TABLE_W = 960;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Table Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1200, 700, { name:'标准表格 Table', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('标准表格 Table', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

var actionRows = [
  [{ label:'查看' }, { label:'编辑' }, { label:'删除', type:'danger' }],
  [{ label:'查看' }, { label:'提交审核' }, { label:'删除', type:'danger' }],
  [{ label:'查看' }, { label:'编辑' }, { label:'下发门店' }, { label:'删除', type:'danger' }]
];
var actionMetrics = bepActionMetrics(actionRows);

var COL_WIDTH_AUDIT = [
  { label:'商品ID', longest:'SPU-20260626-00841', calcW:172, finalW:172 },
  { label:'商品名称', longest:'品质棉质卫衣', calcW:180, finalW:180 },
  { label:'状态', longest:'已上架', calcW:96, finalW:96 },
  { label:'库存', longest:'999999', calcW:112, finalW:112, align:'right' },
  { label:'更新时间', longest:'2026-08-03 12:30:00', calcW:220, finalW:220 },
  { label:'操作', longest:'提交审核/下发门店/更多', calcW:'bepActionMetrics(actionRows).width + 32', finalW:actionMetrics.width + 32 }
];

var cols = [
  { label:'商品ID', w:172 },
  { label:'商品名称', w:180 },
  { label:'状态', w:96 },
  { label:'库存', w:112, align:'right' },
  { label:'更新时间', w:220 },
  { label:'操作', w:actionMetrics.width + 32 }
];

function tableText(value, col, opts) {
  opts = opts || {};
  return bepTableText(value, B, col.w - 32, {
    a: opts.alpha || 0.65,
    alignH: opts.alignH,
    truncate: opts.truncate
  });
}

var table = bepFrame(TABLE_W, 48 * 4 + 48, { name:'DefaultTable', clip:true });
table.x = 32;
table.y = 84;
card.appendChild(table);

table.appendChild(bepTableHeader(cols, TABLE_W));

var rows = [
  ['SPU-20260626-00841', '品质棉质卫衣', '已上架', '999999', '2026-08-03 12:30:00'],
  ['SPU-20260626-00842', '基础款短袖T恤', '待审核', '1200', '2026-08-02 09:12:30'],
  ['SPU-20260626-00843', '门店联名帆布袋', '已下架', '0', '2026-08-01 18:45:12']
];

rows.forEach(function(row, i) {
  var cells = [
    { content:row[0] },
    { content:row[1] },
    { content:bepTag(row[2], i === 0 ? 'success' : (i === 1 ? 'warning' : 'disabled'), 'outline') },
    { content:tableText(row[3], cols[3], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:row[4] },
    { content:bepActionCell(actionRows[i], { slotWidths:actionMetrics.slotWidths }) }
  ];
  var r = bepTableRow(cells, cols, TABLE_W);
  r.y = 48 + i * 48;
  table.appendChild(r);
});

var pager = bepPagination('共300条', 1, [1, 2, 3, '…', 20], '10条/页', { disabledPrev:true });
pager.x = TABLE_W - pager.width;
pager.y = 48 + rows.length * 48 + 16;
table.appendChild(pager);

var miniTitle = bepText('迷你表格', B, 16, { style:'Medium', lh:24, a:0.85, x:32, y:380 });
card.appendChild(miniTitle);

var miniCols = [
  { label:'商品ID', w:180 },
  { label:'商品名称', w:220 },
  { label:'库存', w:100, align:'right' },
  { label:'状态', w:100 }
];
var miniW = 600;
var mini = bepFrame(miniW, 40 * 4, { name:'MiniTable', clip:true });
mini.x = 32;
mini.y = 420;
card.appendChild(mini);
mini.appendChild(bepTableHeader(miniCols, miniW, { size:'mini' }));
[
  ['SPU-001', '品质棉质卫衣', '120', '已上架'],
  ['SPU-002', '基础款短袖T恤', '86', '已上架'],
  ['SPU-003', '门店联名帆布袋', '0', '已下架']
].forEach(function(row, i) {
  var r = bepTableRow([
    { content:row[0] },
    { content:row[1] },
    { content:bepTableText(row[2], B, miniCols[2].w - 24, { a:0.65, alignH:'RIGHT', truncate:false }), align:'right' },
    { content:row[3] }
  ], miniCols, miniW, null, { size:'mini' });
  r.y = 40 + i * 40;
  mini.appendChild(r);
});

var emptyTitle = bepText('空状态', B, 16, { style:'Medium', lh:24, a:0.85, x:700, y:380 });
card.appendChild(emptyTitle);
var emptyWrap = bepFrame(360, 168, { name:'EmptyTable', clip:true });
emptyWrap.x = 700;
emptyWrap.y = 420;
card.appendChild(emptyWrap);
emptyWrap.appendChild(bepTableHeader([
  { label:'字段一', w:180 },
  { label:'字段二', w:180 }
], 360));
var empty = bepEmptyState(360);
empty.y = 48;
emptyWrap.appendChild(empty);
