// ── HR-员工列表.js ─────────────────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 2026-06
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件并运行
// ═══════════════════════════════════════════════════════════════════════════════

// ── 页面常量 ──────────────────────────────────────────────────────────────────
var CANVAS_W  = 1440, CANVAS_H = 900;
var SIDE_W    = 208,  HDR_H    = 96;
var OUTER_PAD = 16,   CARD_PAD = 24;
var TABLE_W   = CANVAS_W - SIDE_W - OUTER_PAD * 2 - CARD_PAD * 2;  // 1152

// ── 表列定义 ──────────────────────────────────────────────────────────────────
// 列宽规则：基础宽 = max(表头宽, 数据最宽) + 左16 + 右16
// 字符宽参考（PingFang SC 14px）：数字9px、大写字母10px、小写字母8px、短横5px、空格5px
// 固定列基础宽：序号60 + 工号136 + 在职状态88 + 入职日期116 + 联系方式144 + 操作148 = 692
// 弹性列基础宽：姓名74 + 部门102 + 职位102 = 278  合计970
// 弹性剩余：1152 - 970 = 182 ÷ 3 ≈ 61px each
var COLS = [
  { label: '序号',     w:  60, align: 'center' },  // 固定："序号"28 + 32
  { label: '姓名',     w: 134, align: 'left'   },  // 弹性：74基础 + 60
  { label: '工号',     w: 136, align: 'left'   },  // 固定："EMP-2024-001"103 + 32 = 135 → 136
  { label: '部门',     w: 163, align: 'left'   },  // 弹性：102基础 + 61
  { label: '职位',     w: 163, align: 'left'   },  // 弹性：102基础 + 61
  { label: '在职状态', w:  88, align: 'center' },  // 固定：表头"在职状态"56 + 32
  { label: '入职日期', w: 116, align: 'left'   },  // 固定："2021-03-15"82 + 32 = 114 → 116
  { label: '联系方式', w: 144, align: 'left'   },  // 固定："138 0000 1111"109 + 32 = 141 → 144
  { label: '操作',     w:   0, align: 'left'   },  // 构建时由 ACTION_METRICS 回填
];
// 合计：60+134+136+163+163+88+116+144+148 = 1152 ✓
// 验证：56+140+140+160+148+100+140+148+120 = 1152 ✓

// ── 示例数据 ──────────────────────────────────────────────────────────────────
var ROW_DATA = [
  { idx:'001', name:'张伟',   no:'EMP-2024-001', dept:'产品设计部', pos:'高级设计师', status:'active',   date:'2021-03-15', tel:'138 0000 1111' },
  { idx:'002', name:'李娜',   no:'EMP-2024-002', dept:'技术研发部', pos:'前端工程师', status:'active',   date:'2020-06-01', tel:'139 0000 2222' },
  { idx:'003', name:'王芳',   no:'EMP-2024-003', dept:'人力资源部', pos:'HR 专员',    status:'active',   date:'2022-01-10', tel:'137 0000 3333' },
  { idx:'004', name:'刘洋',   no:'EMP-2024-004', dept:'产品设计部', pos:'UX 研究员',  status:'leave',    date:'2019-09-20', tel:'136 0000 4444' },
  { idx:'005', name:'陈静',   no:'EMP-2024-005', dept:'市场推广部', pos:'品牌策划',   status:'active',   date:'2023-04-08', tel:'135 0000 5555' },
  { idx:'006', name:'赵磊',   no:'EMP-2024-006', dept:'技术研发部', pos:'后端工程师', status:'inactive', date:'2018-11-30', tel:'134 0000 6666' },
  { idx:'007', name:'孙丽',   no:'EMP-2024-007', dept:'财务管理部', pos:'财务分析师', status:'active',   date:'2022-07-22', tel:'133 0000 7777' },
  { idx:'008', name:'周建国', no:'EMP-2024-008', dept:'运营管理部', pos:'运营总监',   status:'active',   date:'2017-05-16', tel:'132 0000 8888' },
];

var ACTION_ROWS = ROW_DATA.map(function() {
  return [
    { label:'查看', type:'primary' },
    { label:'编辑', type:'primary' },
    { label:'删除', type:'danger'  },
  ];
});
var ACTION_METRICS = null;

// ── 主函数 ────────────────────────────────────────────────────────────────────
async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  ACTION_METRICS = bepActionMetrics(ACTION_ROWS);
  COLS[8].w = ACTION_METRICS.width + 32;

  var fixedWithoutElastic = COLS[0].w + COLS[2].w + COLS[5].w + COLS[6].w + COLS[7].w + COLS[8].w;
  var elasticBase = [
    { idx:1, base:74 },
    { idx:3, base:102 },
    { idx:4, base:102 },
  ];
  var extra = Math.floor((TABLE_W - fixedWithoutElastic - 74 - 102 - 102) / elasticBase.length);
  elasticBase.forEach(function(col) { COLS[col.idx].w = col.base + extra; });
  COLS[4].w += TABLE_W - COLS.reduce(function(sum, col) { return sum + col.w; }, 0);

  var COL_WIDTH_AUDIT = [
    { label:'序号',     longest:'008',          calc:60, final:COLS[0].w },
    { label:'姓名',     longest:'周建国',       calc:74, final:COLS[1].w },
    { label:'工号',     longest:'EMP-2024-008', calc:136, final:COLS[2].w },
    { label:'部门',     longest:'产品设计部',   calc:102, final:COLS[3].w },
    { label:'职位',     longest:'后端工程师',   calc:102, final:COLS[4].w },
    { label:'在职状态', longest:'在职状态',     calc:88, final:COLS[5].w },
    { label:'入职日期', longest:'2021-03-15',   calc:116, final:COLS[6].w },
    { label:'联系方式', longest:'138 0000 1111', calc:144, final:COLS[7].w },
    { label:'操作',     longest:'查看/编辑/删除', calc:ACTION_METRICS.width + 32, final:COLS[8].w },
  ];
  console.log('COL_WIDTH_AUDIT', COL_WIDTH_AUDIT);

  // ── 1. 页面主框架（所有内容统一放在这一个 Frame 内）────────────────────────
  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'员工列表页', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  // ── 2. 侧边栏 ────────────────────────────────────────────────────────────────
  var sidebar = bepFrame(SIDE_W, CANVAS_H, { name:'侧边栏', clip:true });
  sidebar.fills = bepSolid(bepHex('002138'));
  pageFrame.appendChild(sidebar);

  var sY = 0;

  // Logo 区
  var logo = bepSidebarLogo('BeP设计平台', 'COUNTRY GARDEN SERVICES', SIDE_W);
  logo.y = sY; sidebar.appendChild(logo); sY += 64;

  // ── 菜单结构（当前路径：组件管理 > 人员管理 > 员工列表）──────────────────────
  var m1 = bepSidebarItem('工作台',   1, 'default',  'Line/home');        m1.y = sY; sidebar.appendChild(m1); sY += 48;
  var m2 = bepSidebarItem('数据分析', 1, 'default',  'Line/bar-chart-2'); m2.y = sY; sidebar.appendChild(m2); sY += 48;
  var m3 = bepSidebarItem('组件管理', 1, 'expanded', 'Line/layers');      m3.y = sY; sidebar.appendChild(m3); sY += 48;

  var m3a = bepSidebarItem('设计规范', 2, 'default'); m3a.y = sY; sidebar.appendChild(m3a); sY += 48;

  // 人员管理：L2 展开父级（opacity 1，右侧 ∧ 箭头）
  var m3b = bepSidebarItem('人员管理', 2, 'default'); m3b.y = sY;
  m3b.children.forEach(function(c) { c.opacity = 1; });
  var m3bArrow = bepIcon('Line/PutAway-Arrow', 12, BEP_C.white);
  if (m3bArrow) { m3bArrow.x = 186; m3bArrow.y = 18; m3b.appendChild(m3bArrow); }
  sidebar.appendChild(m3b); sY += 48;

  var m3b1 = bepSidebarItem('员工列表', 3, 'active');  m3b1.y = sY; sidebar.appendChild(m3b1); sY += 48;
  var m3b2 = bepSidebarItem('部门管理', 3, 'default'); m3b2.y = sY; sidebar.appendChild(m3b2); sY += 48;
  var m3b3 = bepSidebarItem('角色权限', 3, 'default'); m3b3.y = sY; sidebar.appendChild(m3b3); sY += 48;

  var m3c = bepSidebarItem('资产库', 2, 'default'); m3c.y = sY; sidebar.appendChild(m3c); sY += 48;
  var m4 = bepSidebarItem('合同管理', 1, 'default', 'Line/file-text'); m4.y = sY; sidebar.appendChild(m4); sY += 48;
  var m5 = bepSidebarItem('系统工具', 1, 'default', 'Line/tool');      m5.y = sY; sidebar.appendChild(m5); sY += 48;
  var m6 = bepSidebarItem('报表中心', 1, 'default', 'Line/pie-chart'); m6.y = sY; sidebar.appendChild(m6); sY += 48;
  var m7 = bepSidebarItem('系统设置', 1, 'default', 'Line/settings');  m7.y = sY; sidebar.appendChild(m7); sY += 48;

  // ── 3. 页头 ──────────────────────────────────────────────────────────────────
  var header = bepHeader('员工列表', ['人员管理', '员工列表'], CANVAS_W - SIDE_W);
  header.x = SIDE_W; header.y = 0;
  pageFrame.appendChild(header);

  // ── 4. 内容卡片 ──────────────────────────────────────────────────────────────
  var CARD_W = CANVAS_W - SIDE_W - OUTER_PAD * 2;  // 1200
  var card   = bepFrame(CARD_W, 100, { name:'员工列表卡片', r:4, clip:true });
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD;
  card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var cy = CARD_PAD;  // 卡片内 y 游标

  // ── 5. 筛选区（4条件 → 2行，按钮组第2行右对齐，无折叠）────────────────────
  var filterGrid = bepFilterGrid([
    { label:'姓名 / 工号', placeholder:'请输入姓名或工号' },
    { label:'所属部门',     placeholder:'请选择部门',       type:'select'    },
    { label:'在职状态',     placeholder:'请选择状态',       type:'select'    },
    { label:'入职日期',     placeholder:'',                  type:'daterange' },
  ], TABLE_W, false);
  filterGrid.x = CARD_PAD; filterGrid.y = cy;
  card.appendChild(filterGrid);
  cy += filterGrid.height;

  // ── 6. 工具栏（操作按钮与筛选区分离，右对齐）────────────────────────────────
  cy += 24;  // 筛选区 → 工具栏：24px
  var exportBtn = bepButton('导出数据', 'secondary', 32);
  var addBtn    = bepButton('+ 新增员工', 'primary', 32);
  addBtn.x    = CARD_PAD + TABLE_W - addBtn.width;
  addBtn.y    = cy;
  exportBtn.x = addBtn.x - exportBtn.width - 8;
  exportBtn.y = cy;
  card.appendChild(exportBtn);
  card.appendChild(addBtn);
  cy += 32;

  // ── 7. 工具栏 → 表格：16px ───────────────────────────────────────────────────
  cy += 16;

  // ── 8. 表头 ──────────────────────────────────────────────────────────────────
  var tHeader = bepTableHeader(COLS, TABLE_W);
  tHeader.x = CARD_PAD; tHeader.y = cy;
  card.appendChild(tHeader);
  cy += 48;

  // ── 9. 数据行（铁律：单元格用固定宽表格文字）────────────────────────────────
  ROW_DATA.forEach(function(row, i) {
    var bgColor = null;  // 规范：无斑马纹

    // 状态 Tag
    var tagType = { active:'enabled', leave:'danger', inactive:'warning' }[row.status];
    var tagLbl  = { active:'在职',   leave:'离职',   inactive:'停职'    }[row.status];
    var tag = bepTag(tagLbl, tagType, 'outline');

    var cells = [
      { content: bepTableText(row.idx,  B, COLS[0].w - 32, { a:0.65, alignH:'CENTER', truncate:false }), align:'center' },
      { content: bepTableText(row.name, B, COLS[1].w - 32, { a:0.85 }) },
      { content: bepTableText(row.no,   B, COLS[2].w - 32, { a:0.65, truncate:false }) },
      { content: bepTableText(row.dept, B, COLS[3].w - 32, { a:0.65 }) },
      { content: bepTableText(row.pos,  B, COLS[4].w - 32, { a:0.65 }) },
      { content: tag, align:'center' },
      { content: bepTableText(row.date, B, COLS[6].w - 32, { a:0.65, truncate:false }) },
      { content: bepTableText(row.tel,  B, COLS[7].w - 32, { a:0.65, truncate:false }) },
      { content: bepActionCell(ACTION_ROWS[i], { slotWidths: ACTION_METRICS.slotWidths }) },
    ];

    var dataRow = bepTableRow(cells, COLS, TABLE_W, bgColor);
    dataRow.x = CARD_PAD; dataRow.y = cy;
    card.appendChild(dataRow);
    cy += 48;
  });

  // ── 10. 分页器（右对齐）────────────────────────────────────────────────────
  cy += 16;
  var pagination = bepPagination('共 156 条', 3, [1, 2, 3, '…', 16]);
  pagination.x = CARD_PAD + TABLE_W - pagination.width;
  pagination.y = cy;
  card.appendChild(pagination);
  cy += 32 + CARD_PAD;

  // 调整卡片实际高度
  card.resize(CARD_W, cy);
  pageFrame.resize(CANVAS_W, Math.max(CANVAS_H, card.y + card.height + OUTER_PAD));
  sidebar.resize(SIDE_W, pageFrame.height);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 员工列表页生成完成');
}

buildPage().catch(function(e) {
  figma.notify('❌ ' + e.message, { error: true });
  console.error(e);
});
