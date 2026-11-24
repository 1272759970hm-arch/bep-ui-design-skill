// BeP Admin Kit · 其他高级表格组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:89 / 高级表格

var CANVAS_W = 1440;
var CANVAS_H = 980;
var TABLE_W = 1152;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Advanced Table Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1232, 900, { name:'其他高级表格 Advanced Table', r:4, clip:true });
card.x = 104;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('其他高级表格 Advanced Table', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

function tableText(value, col, opts) {
  opts = opts || {};
  return bepTableText(value, B, col.w - 32, {
    a: opts.alpha || 0.65,
    alignH: opts.alignH,
    truncate: opts.truncate
  });
}

var actionRows = [
  [{ label:'查看' }, { label:'编辑' }, { label:'删除', type:'danger' }],
  [{ label:'查看' }, { label:'提交审核' }, { label:'更多配置' }, { label:'删除', type:'danger' }]
];
var actionMetrics = bepActionMetrics(actionRows);

var COL_WIDTH_AUDIT = [
  { table:'表头功能/展开/快速新增', label:'商品编码', longest:'SPU-20260626-00841', calcW:172, finalW:172 },
  { table:'表头功能/展开/快速新增', label:'商品名称', longest:'品质棉质卫衣', calcW:220, finalW:220 },
  { table:'表头功能/展开/快速新增', label:'分类', longest:'服装 / 男装 / 卫衣', calcW:180, finalW:180 },
  { table:'表头功能/展开/快速新增', label:'库存', longest:'999999', calcW:120, finalW:120, align:'right' },
  { table:'表头功能/展开/快速新增', label:'状态', longest:'待审核', calcW:120, finalW:120 },
  { table:'表头功能/展开/快速新增', label:'操作', longest:'提交审核/更多配置/更多', calcW:'bepActionMetrics(actionRows).width + 32', finalW:actionMetrics.width + 32 },
  { table:'多级表头', label:'多选框', longest:'checked', calcW:48, finalW:48 },
  { table:'多级表头', label:'单位', longest:'华南大区广州分公司', calcW:204, finalW:204 },
  { table:'多级表头', label:'干部数量', longest:'999999', calcW:300, finalW:300, align:'right' },
  { table:'多级表头', label:'MPB/M类人数分布', longest:'999999', calcW:360, finalW:360, align:'right' },
  { table:'多级表头', label:'日期', longest:'2026-08-04', calcW:104, finalW:104 },
  { table:'多级表头', label:'操作', longest:'编辑/删除', calcW:'bepActionMetrics(multiActionRows).width + 32', finalW:96 }
];

var cols = [
  { label:'商品编码', w:172 },
  { label:'商品名称', w:220, filter:true },
  { label:'分类', w:180, filter:true },
  { label:'库存', w:120, align:'right' },
  { label:'状态', w:120, filter:true },
  { label:'操作', w:actionMetrics.width + 32 }
];
var baseW = cols.reduce(function(sum, col) { return sum + col.w; }, 0);

var headerTitle = bepText('带表头功能 / 可拖拽 / 展开面板 / 快速新增', B, 16, { style:'Medium', lh:24, a:0.85, x:32, y:84 });
card.appendChild(headerTitle);

var table = bepFrame(baseW, 48 * 6 + 104, { name:'AdvancedTableBase', clip:true });
table.x = 32;
table.y = 124;
card.appendChild(table);
table.appendChild(bepAdvancedTableHeader(cols, baseW));

var quick = bepQuickAddRow(baseW, { label:'新增商品' });
quick.y = 48;
table.appendChild(quick);

var dragCell = bepFrame(24, 22, { name:'DragAndCheckboxCell', clip:false });
var drag = bepTableDragHandle();
drag.x = 0;
drag.y = 3;
dragCell.appendChild(drag);

var row0 = bepTableRow([
  { content:'SPU-20260626-00841' },
  { content:'品质棉质卫衣' },
  { content:'服装 / 男装 / 卫衣' },
  { content:tableText('999999', cols[3], { alignH:'RIGHT', truncate:false }), align:'right' },
  { content:bepTag('待审核', 'warning', 'outline') },
  { content:bepActionCell(actionRows[0], { slotWidths:actionMetrics.slotWidths }) }
], cols, baseW);
row0.y = 96;
table.appendChild(row0);

var panel = bepTableExpandPanel(baseW, [
  { label:'创建人', value:'张三' },
  { label:'创建时间', value:'2026-08-04 09:30:00' },
  { label:'备注', value:'适用于门店基础陈列商品' },
  { label:'来源', value:'商品中心' }
]);
panel.y = 144;
table.appendChild(panel);

var row1 = bepTableRow([
  { content:'SPU-20260626-00842' },
  { content:'基础款短袖T恤' },
  { content:'服装 / 女装 / T恤' },
  { content:tableText('1200', cols[3], { alignH:'RIGHT', truncate:false }), align:'right' },
  { content:bepTag('已上架', 'success', 'outline') },
  { content:bepActionCell(actionRows[1], { slotWidths:actionMetrics.slotWidths }) }
], cols, baseW);
row1.y = 248;
table.appendChild(row1);

var multiTitle = bepText('多级表头表格', B, 16, { style:'Medium', lh:24, a:0.85, x:32, y:520 });
card.appendChild(multiTitle);

var multiActionRows = [
  [{ label:'编辑' }, { label:'删除', type:'danger' }],
  [{ label:'编辑' }, { label:'删除', type:'danger' }]
];
var multiMetrics = bepActionMetrics(multiActionRows);
var multiCols = [
  { label:'多选框', w:48, rowSpan:2, align:'center' },
  { label:'单位', w:204, rowSpan:2 },
  { label:'干部数量', w:300, children:[
    { label:'子列一', w:100, align:'right' },
    { label:'子列二', w:100, align:'right' },
    { label:'子列三', w:100, align:'right' }
  ]},
  { label:'MPB/M类人数分布', w:360, children:[
    { label:'子列一', w:112, align:'right' },
    { label:'子列二', w:112, align:'right' },
    { label:'子列三', w:136, align:'right' }
  ]},
  { label:'日期', w:104, rowSpan:2 },
  { label:'操作', w:multiMetrics.width + 32, rowSpan:2 }
];
var leafCols = [
  { label:'多选框', w:48, align:'center' },
  { label:'单位', w:204 },
  { label:'子列一', w:100, align:'right' },
  { label:'子列二', w:100, align:'right' },
  { label:'子列三', w:100, align:'right' },
  { label:'子列一', w:112, align:'right' },
  { label:'子列二', w:112, align:'right' },
  { label:'子列三', w:136, align:'right' },
  { label:'日期', w:104 },
  { label:'操作', w:multiMetrics.width + 32 }
];
var multiW = leafCols.reduce(function(sum, col) { return sum + col.w; }, 0);
var multi = bepFrame(multiW, 80 + 48 * 2, { name:'MultiLevelTable', clip:true });
multi.x = 32;
multi.y = 560;
card.appendChild(multi);
multi.appendChild(bepMultiLevelTableHeader(multiCols, multiW));

[
  ['华南大区广州分公司', '120', '36', '84', '18', '12', '6', '2026-08-04'],
  ['华东大区上海分公司', '98', '28', '70', '16', '9', '7', '2026-08-03']
].forEach(function(row, i) {
  var r = bepTableRow([
    { content:bepTableCheckbox(i === 0), align:'center' },
    { content:row[0] },
    { content:tableText(row[1], leafCols[2], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:tableText(row[2], leafCols[3], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:tableText(row[3], leafCols[4], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:tableText(row[4], leafCols[5], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:tableText(row[5], leafCols[6], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:tableText(row[6], leafCols[7], { alignH:'RIGHT', truncate:false }), align:'right' },
    { content:row[7] },
    { content:bepActionCell(multiActionRows[i], { slotWidths:multiMetrics.slotWidths }) }
  ], leafCols, multiW);
  r.y = 80 + i * 48;
  multi.appendChild(r);
});
