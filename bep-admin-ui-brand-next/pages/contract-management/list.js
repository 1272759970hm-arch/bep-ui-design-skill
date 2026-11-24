// ── 合同管理·列表页 ───────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-06-26
// 使用方式：运行 node tools/build.js contract-management/list
// ═══════════════════════════════════════════════════════════════

var CANVAS_W = 1440, CANVAS_H = 900;
var SIDE_W = 208, HDR_H = 96;
var OUTER_PAD = 16, CARD_PAD = 24;
var TABLE_W = CANVAS_W - SIDE_W - OUTER_PAD * 2 - CARD_PAD * 2;  // 1152

function makeSidebar(h) {
  var side = bepFrame(SIDE_W, h, { name:'Sidebar', clip:true });
  side.fills = bepSolid(bepHex('002138'));

  var logo = bepSidebarLogo('合同管理', 'CONTRACT ADMIN', SIDE_W);
  logo.x = 0; logo.y = 0;
  side.appendChild(logo);

  var divider = bepRect(160, 1, BEP_C.white, { a:0.08, x:24, y:64 });
  side.appendChild(divider);

  var items = [
    { label:'首页',       level:1, state:'default',  icon:'Line/home' },
    { label:'合同中心',   level:1, state:'expanded', icon:'Line/file-text' },
    { label:'合同管理',   level:2, state:'active' },
    { label:'审批管理',   level:2, state:'default' },
    { label:'归档管理',   level:2, state:'default' },
    { label:'客户管理',   level:1, state:'default',  icon:'Line/users' },
    { label:'统计分析',   level:1, state:'default',  icon:'Line/bar-chart-2' },
    { label:'系统设置',   level:1, state:'default',  icon:'Line/settings' }
  ];

  var y = 72;
  items.forEach(function(it) {
    var row = bepSidebarItem(it.label, it.level, it.state, it.icon, SIDE_W);
    row.x = 0; row.y = y;
    side.appendChild(row);
    y += 48;
  });

  return side;
}

function makeStatCard(title, value, tone) {
  var card = bepFrame(176, 64, { name:'StatCard/' + title, r:4, clip:false });
  card.fills = bepSolid(tone.bg);
  card.strokes = bepSolid(tone.border, 1);
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  var label = bepText(title, B, 12, { lh:18, a:0.45, x:16, y:10 });
  card.appendChild(label);

  var val = bepText(value, tone.color, 20, { style:'Medium', lh:28, x:16, y:30 });
  card.appendChild(val);
  return card;
}

function makeStatusTag(status) {
  if (status === '履约中') return bepTag('履约中', 'success');
  if (status === '待审批') return bepTag('待审批', 'warning');
  if (status === '即将到期') return bepTag('即将到期', 'warning');
  if (status === '已终止') return bepTag('已终止', 'danger');
  if (status === '已归档') return bepTag('已归档', 'disabled');
  return bepTag(status, 'info');
}

function textCell(str, colW, opts) {
  opts = opts || {};
  var color = opts.color || B;
  var t = bepTruncText(str, color, colW - 32, { lh:22, a: opts.a === undefined ? 0.65 : opts.a });
  return t;
}

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  })
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'合同管理界面', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  pageFrame.appendChild(sidebar);

  var header = bepHeader('合同管理', ['合同中心', '合同管理'], CANVAS_W - SIDE_W);
  header.x = SIDE_W; header.y = 0;
  pageFrame.appendChild(header);

  var card = bepFrame(CANVAS_W - SIDE_W - OUTER_PAD * 2, 756, { name:'Card/合同列表', r:8, clip:true });
  card.fills = bepSolid(BEP_C.white);
  card.effects = [
    { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.05}, offset:{x:0,y:9}, radius:28, spread:8 },
    { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.08}, offset:{x:0,y:6}, radius:16, spread:0 },
    { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.12}, offset:{x:0,y:3}, radius:6, spread:-4 }
  ];
  card.x = SIDE_W + OUTER_PAD; card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var filters = [
    { label:'合同编号', placeholder:'请输入合同编号' },
    { label:'合同名称', placeholder:'请输入合同名称' },
    { label:'客户名称', placeholder:'请输入客户名称' },
    { label:'合同类型', placeholder:'请选择合同类型', type:'select' },
    { label:'合同状态', placeholder:'请选择合同状态', type:'select' },
    { label:'签订日期', placeholder:'', type:'daterange' }
  ];
  var filterGrid = bepFilterGrid(filters, TABLE_W, false);
  filterGrid.x = CARD_PAD; filterGrid.y = CARD_PAD;
  card.appendChild(filterGrid);

  var statsY = CARD_PAD + filterGrid.height + 16;
  var tones = [
    { bg:bepHex('E6F0F5'), border:bepHex('CCE2EB'), color:BEP_C.primary },
    { bg:bepHex('EBF8EC'), border:bepHex('D8F1D8'), color:BEP_C.success },
    { bg:bepHex('FFF6EC'), border:bepHex('FFE8CC'), color:BEP_C.warning },
    { bg:bepHex('FFEEEE'), border:bepHex('FFD8D5'), color:BEP_C.danger }
  ];
  var stats = [
    makeStatCard('合同总数', '1,286', tones[0]),
    makeStatCard('履约中', '842', tones[1]),
    makeStatCard('即将到期', '37', tones[2]),
    makeStatCard('逾期未归档', '12', tones[3])
  ];
  var sx = CARD_PAD;
  stats.forEach(function(s) {
    s.x = sx; s.y = statsY;
    card.appendChild(s);
    sx += 192;
  });

  var toolbarY = statsY + 64 + 24;
  var importBtn = bepButton('导 入', 'secondary', 32);
  var exportBtn = bepButton('导 出', 'secondary', 32);
  var addBtn = bepButton('+ 新增合同', 'primary', 32);
  addBtn.x = CARD_PAD + TABLE_W - addBtn.width;
  exportBtn.x = addBtn.x - 8 - exportBtn.width;
  importBtn.x = exportBtn.x - 8 - importBtn.width;
  [importBtn, exportBtn, addBtn].forEach(function(btn) {
    btn.y = toolbarY;
    card.appendChild(btn);
  });

  var cols = [
    { label:'合同编号', w:128 },
    { label:'合同名称', w:210 },
    { label:'客户名称', w:166 },
    { label:'合同类型', w:100 },
    { label:'合同金额', w:116, align:'right' },
    { label:'签订日期', w:116 },
    { label:'到期日期', w:116 },
    { label:'状态',     w:92,  align:'center' },
    { label:'操作',     w:108, align:'center' }
  ];
  var tableY = toolbarY + 32 + 16;
  var headerRow = bepTableHeader(cols, TABLE_W);
  headerRow.x = CARD_PAD; headerRow.y = tableY;
  card.appendChild(headerRow);

  var rows = [
    ['HT20260626001', '碧桂园凤凰城物业服务合同', '广州凤凰城业主委员会', '物业服务', '¥ 1,286,000', '2026-06-01', '2027-05-31', '履约中'],
    ['HT20260618007', '园区保洁外包年度框架协议', '广东洁净环境服务有限公司', '采购合同', '¥ 436,800', '2026-06-18', '2027-06-17', '待审批'],
    ['HT20260530015', '消防维保服务补充协议', '佛山安盾消防工程有限公司', '服务合同', '¥ 96,000', '2026-05-30', '2026-08-30', '即将到期'],
    ['HT20260512009', '智慧停车系统运维合同', '深圳泊云科技有限公司', '运维合同', '¥ 228,500', '2026-05-12', '2027-05-11', '履约中'],
    ['HT20260428023', '电梯日常维保合同', '日立电梯中国有限公司', '维保合同', '¥ 312,000', '2026-04-28', '2027-04-27', '履约中'],
    ['HT20260411018', '社区活动场地租赁协议', '广州市星河文化传媒有限公司', '租赁合同', '¥ 58,000', '2026-04-11', '2026-10-10', '已归档'],
    ['HT20260325032', '安防设备采购合同', '杭州海康威视系统技术有限公司', '采购合同', '¥ 765,400', '2026-03-25', '2026-09-24', '履约中'],
    ['HT20260206004', '商业街广告位合作协议', '广州启明广告有限公司', '合作协议', '¥ 120,000', '2026-02-06', '2026-06-05', '已终止']
  ];

  rows.forEach(function(r, idx) {
    var cells = [
      { content:textCell(r[0], cols[0].w, { color:BEP_C.primary, a:1 }) },
      { content:textCell(r[1], cols[1].w) },
      { content:textCell(r[2], cols[2].w) },
      { content:textCell(r[3], cols[3].w) },
      { content:textCell(r[4], cols[4].w), align:'right' },
      { content:textCell(r[5], cols[5].w) },
      { content:textCell(r[6], cols[6].w) },
      { content:makeStatusTag(r[7]), align:'center' },
      { content:bepActionCell([
        { label:'查看', type:'primary' },
        { label:'编辑', type:'primary' },
        { label:'归档', type:'primary' }
      ]), align:'center' }
    ];
    var row = bepTableRow(cells, cols, TABLE_W);
    row.x = CARD_PAD; row.y = tableY + 48 + idx * 48;
    card.appendChild(row);
  });

  var pager = bepPagination('共1286条', 1, [1, 2, 3, 4, 5, '...', 129], '10条/页');
  pager.x = CARD_PAD + TABLE_W - pager.width;
  pager.y = tableY + 48 + rows.length * 48 + 16;
  card.appendChild(pager);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('合同管理界面生成完成');
}

buildPage().catch(function(e) { figma.notify('生成失败：' + e.message); });
