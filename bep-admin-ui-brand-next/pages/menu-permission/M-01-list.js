// ── M-01  菜单权限管理·主列表页 ──────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 2026-06-01（重写版，全量使用标准组件）
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件内容并运行
// ═══════════════════════════════════════════════════════════════════════════════

// ── 业务特有：侧边栏 Feather 图标（不在 BEP_ICONS 中）─────────────────────────
var M01_ICONS = {
  package:      '<svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L1.5 5 8 8.5 14.5 5 8 1.5z" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/><path d="M1.5 11L8 14.5 14.5 11M1.5 8L8 11.5 14.5 8" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  briefcase:    '<svg viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5" width="13" height="9.5" rx="1.5" stroke="#fff" stroke-width="1.2"/><path d="M10.5 5V4a2.5 2.5 0 00-5 0v1" stroke="#fff" stroke-width="1.2"/></svg>',
  'trending-up':'<svg viewBox="0 0 16 16" fill="none"><polyline points="1.5,11.5 6,7 9,10 14.5,4.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="10,4.5 14.5,4.5 14.5,9" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  settings:     '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="#fff" stroke-width="1.2"/><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.57 3.57l1.27 1.27M11.16 11.16l1.27 1.27M3.57 12.43l1.27-1.27M11.16 4.84l1.27-1.27" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>',
};

// 菜单类型图标（12×12，嵌入名称列）
var TYPE_SVG = {
  directory: '<svg viewBox="0 0 12 12" fill="none"><path d="M1 4.5C1 3.948 1.448 3.5 2 3.5h2.5L5.5 4.5H10c.552 0 1 .448 1 1v4c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V4.5z" fill="#006D9B"/></svg>',
  menu:      '<svg viewBox="0 0 12 12" fill="none"><rect x="1.5" y="0.5" width="9" height="11" rx="1" stroke="#3BBB3E" stroke-width="1.1"/><path d="M3.5 4h5M3.5 6.5h5M3.5 9H7" stroke="#3BBB3E" stroke-width="1.1" stroke-linecap="round"/></svg>',
  button:    '<svg viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#FFA645" stroke-width="1.1"/><circle cx="6" cy="6" r="1.8" fill="#FFA645"/></svg>',
};

// ── 布局常量 ──────────────────────────────────────────────────────────────────
var CANVAS_W = 1440, CANVAS_H = 900;
var SIDE_W   = 208;
var OUTER_PAD = 16;
var CARD_PAD  = 24;
var HDR_H     = 96;
var TABLE_W   = CANVAS_W - SIDE_W - OUTER_PAD * 2 - CARD_PAD * 2;  // 1152
var ROW_H     = 48;

// 列定义（总宽 = 1152）
var COLS = [
  { label:'菜单名称', w:260, align:'left'   },
  { label:'图标',     w:70,  align:'center' },
  { label:'排序',     w:60,  align:'center' },
  { label:'权限标识', w:180, align:'left'   },
  { label:'组件路径', w:180, align:'left'   },
  { label:'状态',     w:80,  align:'center' },
  { label:'创建时间', w:154, align:'left'   },
  { label:'操作',     w:168, align:'left'   },
];

// 树表格数据
var ROWS = [
  { name:'商品管理',     type:'directory', sort:'1',  perm:'—',                comp:'—',                      status:'enabled', ctime:'2026-01-15 10:00', level:0, hasChildren:true,  expanded:false },
  { name:'订单管理',     type:'directory', sort:'2',  perm:'—',                comp:'—',                      status:'enabled', ctime:'2026-01-10 08:00', level:0, hasChildren:true,  expanded:false },
  { name:'营销管理',     type:'directory', sort:'3',  perm:'—',                comp:'—',                      status:'enabled', ctime:'2026-01-20 08:00', level:0, hasChildren:true,  expanded:false },
  { name:'系统管理',     type:'directory', sort:'99', perm:'—',                comp:'—',                      status:'enabled', ctime:'2026-01-05 08:00', level:0, hasChildren:true,  expanded:true  },
  { name:'菜单权限管理', type:'menu',      sort:'1',  perm:'admin:menu:list',   comp:'system/menu/index.vue',  status:'enabled', ctime:'2026-01-05 08:05', level:1, hasChildren:true,  expanded:true  },
  { name:'新增菜单',     type:'button',    sort:'1',  perm:'admin:menu:create', comp:'—',                      status:'enabled', ctime:'2026-01-05 08:10', level:2, hasChildren:false, expanded:false },
  { name:'编辑菜单',     type:'button',    sort:'2',  perm:'admin:menu:update', comp:'—',                      status:'enabled', ctime:'2026-01-05 08:15', level:2, hasChildren:false, expanded:false },
  { name:'删除菜单',     type:'button',    sort:'3',  perm:'admin:menu:delete', comp:'—',                      status:'enabled', ctime:'2026-01-05 08:20', level:2, hasChildren:false, expanded:false },
  { name:'角色管理',     type:'menu',      sort:'2',  perm:'admin:role:list',   comp:'system/role/index.vue',  status:'enabled', ctime:'2026-01-05 09:00', level:1, hasChildren:true,  expanded:false },
  { name:'用户管理',     type:'menu',      sort:'3',  perm:'admin:user:list',   comp:'system/user/index.vue',  status:'enabled', ctime:'2026-01-05 10:00', level:1, hasChildren:true,  expanded:false },
  { name:'操作日志',     type:'menu',      sort:'4',  perm:'admin:log:list',    comp:'system/log/index.vue',   status:'enabled', ctime:'2026-01-05 11:00', level:1, hasChildren:false, expanded:false },
];

// ════════════════════════════════════════════════════════════════════════════
async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  // ── 1. 画布背景 ───────────────────────────────────────────────────────────
  var bg = bepRect(CANVAS_W, CANVAS_H, BEP_C.pageBg);
  bg.name = 'Canvas/M-01'; bg.x = 0; bg.y = 0;
  figma.currentPage.appendChild(bg);

  // ── 2. 侧边栏 ─────────────────────────────────────────────────────────────
  var sidebar = buildSidebar();
  sidebar.x = 0; sidebar.y = 0;
  figma.currentPage.appendChild(sidebar);

  // ── 3. 页头 ───────────────────────────────────────────────────────────────
  var header = bepHeader('菜单权限管理', ['系统管理', '菜单权限管理'], CANVAS_W - SIDE_W);
  header.x = SIDE_W; header.y = 0;
  figma.currentPage.appendChild(header);

  // ── 4. 内容卡片 ───────────────────────────────────────────────────────────
  var cardY = HDR_H + OUTER_PAD;
  var card  = bepFrame(CANVAS_W - SIDE_W - OUTER_PAD * 2, 0, { name:'Card', clip:true });
  card.fills = bepSolid(BEP_C.white);
  card.cornerRadius = 8;
  card.effects = [
    { type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.05}, offset:{x:0,y:9}, radius:28, spread:8,  visible:true, blendMode:'NORMAL' },
    { type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.08}, offset:{x:0,y:6}, radius:16, spread:0,  visible:true, blendMode:'NORMAL' },
    { type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.12}, offset:{x:0,y:3}, radius:6,  spread:-4, visible:true, blendMode:'NORMAL' },
  ];
  card.x = SIDE_W + OUTER_PAD; card.y = cardY;

  // ── 5. 筛选行（单条件，右侧新增按钮）────────────────────────────────────
  var filterRow = bepFilterRow(
    [{ label:'菜单名称', placeholder:'请输入菜单名称', width:200 }],
    '+ 新增', TABLE_W
  );
  filterRow.x = CARD_PAD; filterRow.y = CARD_PAD;
  card.appendChild(filterRow);

  // 分隔线
  card.appendChild(bepRect(TABLE_W, 1, B, { a:0.06, x:CARD_PAD, y:CARD_PAD + 64 }));

  // ── 6. 表格 ───────────────────────────────────────────────────────────────
  var tblY = CARD_PAD + 65;
  var tblH = ROW_H * (ROWS.length + 1) + 1;
  var tbl  = bepFrame(TABLE_W, tblH, { name:'Table', clip:true });
  tbl.fills = bepSolid(BEP_C.white);
  tbl.strokes = bepSolid(B, 0.15);
  tbl.strokeWeight = 1; tbl.strokeAlign = 'INSIDE';
  tbl.x = CARD_PAD; tbl.y = tblY;

  // 表头
  tbl.appendChild(bepTableHeader(COLS, TABLE_W));

  // 数据行
  ROWS.forEach(function(rowData, idx) {
    var tr = makeTreeRow(rowData);
    tr.y = ROW_H * (idx + 1);
    tbl.appendChild(tr);
  });

  card.appendChild(tbl);

  // ── 7. 分页器 ─────────────────────────────────────────────────────────────
  var pg = bepPagination('共11条', 1, [1, 2]);
  pg.x = CARD_PAD; pg.y = tblY + tblH + 16;
  card.appendChild(pg);

  // 调整卡片高度
  card.resize(card.width, pg.y + 32 + CARD_PAD);
  figma.currentPage.appendChild(card);

  figma.viewport.scrollAndZoomIntoView([bg]);
  figma.notify('✅ M-01 菜单权限管理列表 生成完成');
}

// ── 侧边栏（含业务特有 Feather 图标）────────────────────────────────────────
function buildSidebar() {
  var s = bepFrame(SIDE_W, CANVAS_H, { name:'侧边栏', clip:false });
  s.fills = bepSolid(bepHex('002138'));

  var logo = bepSidebarLogo('Mall 管理后台', 'MALL MANAGEMENT', SIDE_W);
  s.appendChild(logo);
  s.appendChild(bepRect(160, 1, BEP_C.white, { a:0.08, x:24, y:64 }));

  var items = [
    { label:'商品管理',     level:1, state:'default',  icon:'package'     },
    { label:'订单管理',     level:1, state:'default',  icon:'briefcase'   },
    { label:'营销管理',     level:1, state:'default',  icon:'trending-up' },
    { label:'系统管理',     level:1, state:'expanded', icon:'settings'    },
    { label:'菜单权限管理', level:2, state:'active',   icon:null          },
    { label:'角色管理',     level:2, state:'default',  icon:null          },
    { label:'用户管理',     level:2, state:'default',  icon:null          },
    { label:'操作日志',     level:2, state:'default',  icon:null          },
  ];

  var sy = 65;
  items.forEach(function(item) {
    var row = makeSidebarItem(item.label, item.level, item.state, item.icon);
    row.x = 0; row.y = sy;
    s.appendChild(row);
    sy += 48;
  });
  return s;
}

function makeSidebarItem(label, level, state, iconKey) {
  var isActive   = state === 'active';
  var isExpanded = state === 'expanded';
  var childOp    = (isActive || isExpanded) ? 1 : 0.5;
  var row = bepFrame(SIDE_W, 48, { name:'L' + level + '·' + label, clip:false });

  if (isActive && level === 2) {
    row.fills = bepSolid(BEP_C.white, 0.08);
    row.appendChild(bepRect(3, 48, BEP_C.primary, { x:0, y:0 }));
  } else {
    row.fills = bepSolid(level === 2 ? bepHex('00182A') : bepHex('002138'));
  }

  var textX = level === 1 ? 24 : 40;
  if (iconKey && M01_ICONS[iconKey]) {
    var ic = figma.createNodeFromSvg(M01_ICONS[iconKey]);
    ic.resize(16, 16); ic.x = 24; ic.y = 16; ic.opacity = childOp;
    row.appendChild(ic);
    textX = 48;
  }

  var lt = bepText(label, BEP_C.white, 14, { lh:22, x:textX, y:13 });
  lt.opacity = childOp;
  row.appendChild(lt);

  if (level === 1) {
    var arrKey = isExpanded ? 'Line/PutAway-Arrow' : 'Line/DropDown-Arrow';
    var arr = bepIcon(arrKey, 12, BEP_C.white);
    if (arr) { arr.x = 186; arr.y = 18; arr.opacity = childOp; row.appendChild(arr); }
  }
  return row;
}

// ── 树表格行（用 bepTreeRow + 自定义名称列）──────────────────────────────────
function makeTreeRow(rowData) {
  var state = rowData.level === 2 ? 'leaf'
            : rowData.expanded    ? 'expanded'
            : 'collapsed';

  // 名称列：类型图标 + 菜单名称文字 组合节点
  var nameNode = makeNameCell(rowData.name, rowData.type);

  // 操作列
  var actions = bepActionCell([
    { label:'新增', type:'primary' },
    { label:'编辑', type:'primary' },
    { label:'删除', type:'danger'  },
  ]);

  var cells = [
    { content: nameNode },
    { content: rowData.type === 'directory' ? '—' : '' },   // 图标列（目录无图标）
    { content: rowData.sort,  align:'center' },
    { content: rowData.perm },
    { content: rowData.comp },
    { content: bepTag('启用', 'enabled'), align:'center' },
    { content: rowData.ctime },
    { content: actions },
  ];

  var bgColor = rowData.level === 0 ? null : undefined;  // null=透明, undefined=用bepTreeRow默认
  return bepTreeRow(cells, COLS, TABLE_W, rowData.level, state, bgColor);
}

function makeNameCell(name, type) {
  var typeSvg  = TYPE_SVG[type];
  var nameTxt  = bepText(name, B, 14, { lh:22, a:0.65 });
  if (!typeSvg) return nameTxt;

  var ico = figma.createNodeFromSvg(typeSvg);
  ico.resize(12, 12);
  var w = bepFrame(12 + 6 + nameTxt.width, 22, { name:'NameCell' });
  w.fills = [];
  ico.x = 0; ico.y = 5;
  nameTxt.x = 18; nameTxt.y = 0;
  w.appendChild(ico);
  w.appendChild(nameTxt);
  return w;
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
