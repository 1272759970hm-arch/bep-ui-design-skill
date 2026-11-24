// BeP Admin Kit · 树状表格组件样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 0:353 / 多层级展开表格

var CANVAS_W = 1280;
var CANVAS_H = 620;
var TABLE_W = 960;

var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'Tree Table Variants', clip:true });
pageFrame.fills = bepSolid(bepHex('F2F4F7'));
figma.currentPage.appendChild(pageFrame);

var card = bepFrame(1200, 540, { name:'树状表格 Tree Table', r:4, clip:true });
card.x = 40;
card.y = 40;
card.fills = bepSolid(BEP_C.white);
pageFrame.appendChild(card);

var title = bepText('树状表格 Tree Table', B, 20, { style:'Medium', lh:28, a:0.85, x:32, y:28 });
card.appendChild(title);

var actionRows = [
  [{ label:'查看' }, { label:'编辑' }, { label:'删除', type:'danger' }],
  [{ label:'查看' }, { label:'编辑' }],
  [{ label:'查看' }, { label:'编辑' }],
  [{ label:'查看' }, { label:'新增子项' }, { label:'更多设置' }, { label:'删除', type:'danger' }],
  [{ label:'查看' }, { label:'编辑' }]
];
var actionMetrics = bepActionMetrics(actionRows);

var COL_WIDTH_AUDIT = [
  { label:'科目名称', longest:'办公室租金-华南区域-广州办公室', calcW:360, finalW:360 },
  { label:'科目类型', longest:'三级科目', calcW:120, finalW:120 },
  { label:'预算金额', longest:'999999.00', calcW:140, finalW:140, align:'right' },
  { label:'状态', longest:'启用', calcW:100, finalW:100 },
  { label:'操作', longest:'新增子项/更多设置/更多', calcW:'bepActionMetrics(actionRows).width + 32', finalW:actionMetrics.width + 32 }
];

var cols = [
  { label:'科目名称', w:360 },
  { label:'科目类型', w:120 },
  { label:'预算金额', w:140, align:'right' },
  { label:'状态', w:100 },
  { label:'操作', w:actionMetrics.width + 32 }
];

var table = bepFrame(TABLE_W, 48 * 7, { name:'TreeTable', clip:true });
table.x = 32;
table.y = 84;
card.appendChild(table);
table.appendChild(bepTableHeader(cols, TABLE_W));

function budgetText(value) {
  return bepTableText(value, B, cols[2].w - 32, { a:0.65, alignH:'RIGHT', truncate:false });
}

var rows = [
  { level:0, state:'expanded', name:'办公室租金', type:'一级科目', budget:'999999.00', status:['启用', 'success'], actions:actionRows[0] },
  { level:1, state:'expanded', name:'华南区域', type:'二级科目', budget:'320000.00', status:['启用', 'success'], actions:actionRows[1] },
  { level:2, state:'leaf', name:'广州办公室', type:'三级科目', budget:'120000.00', status:['启用', 'success'], actions:actionRows[2] },
  { level:2, state:'leaf', name:'深圳办公室', type:'三级科目', budget:'200000.00', status:['启用', 'success'], actions:actionRows[3] },
  { level:1, state:'collapsed', name:'华东区域', type:'二级科目', budget:'280000.00', status:['停用', 'disabled'], actions:actionRows[4] }
];

rows.forEach(function(row, i) {
  var cells = [
    { content:row.name },
    { content:row.type },
    { content:budgetText(row.budget), align:'right' },
    { content:bepTag(row.status[0], row.status[1], 'outline') },
    { content:bepActionCell(row.actions, { slotWidths:actionMetrics.slotWidths }) }
  ];
  var r = bepTreeRow(cells, cols, TABLE_W, row.level, row.state);
  r.y = 48 + i * 48;
  table.appendChild(r);
});

var note = bepText('规则：根节点白底；二级/三级子行整行 #F5F7FA；展开/折叠图标必须使用 BeP 图标。', B, 14, {
  lh:22,
  a:0.45,
  x:32,
  y:430
});
card.appendChild(note);
