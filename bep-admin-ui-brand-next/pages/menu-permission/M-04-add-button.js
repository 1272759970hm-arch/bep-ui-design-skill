// ── M-04  菜单权限管理·新增菜单（按钮类型）抽屉 ──────────────────────────────
// BeP Admin Kit · Figma Scripter · 2026-06-01（重写版，全量使用标准组件）
// 字段：菜单类型/菜单名称/上级菜单/权限标识/排序/状态
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件并运行

var CANVAS_W = 1440, CANVAS_H = 900;
var DRW_W    = 640;
var LBL_W    = 90;
var LBL_GAP  = 12;
var FORM_PAD = 24;
var CTRL_W   = DRW_W - FORM_PAD * 2 - LBL_W - LBL_GAP;  // 490
var FIELD_GAP = 20;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  var bg = bepRect(CANVAS_W, CANVAS_H, BEP_C.pageBg);
  bg.name = 'Canvas/M-04'; bg.x = 0; bg.y = 0;
  figma.currentPage.appendChild(bg);

  var fields = [
    { label:'菜单类型', required:true,  ctrl: bepSelect('按钮', CTRL_W, 32),                 tip: null },
    { label:'菜单名称', required:true,  ctrl: bepInput('请输入菜单名称', CTRL_W, 32),          tip: null },
    { label:'上级菜单', required:false, ctrl: bepSelect('请选择上级菜单', CTRL_W, 32),          tip: null },
    { label:'权限标识', required:true,  ctrl: bepInput('如 admin:menu:create', CTRL_W, 32),   tip: '格式：模块:资源:操作，如 admin:menu:create' },
    { label:'排序',     required:false, ctrl: bepInput('1', CTRL_W, 32),                     tip: null },
    { label:'状态',     required:false, ctrl: bepSwitch(true, '启用', '停用'),                 tip: null },
  ];

  var formContent = bepFrame(DRW_W - FORM_PAD * 2, 100, { name:'FormContent' });
  formContent.fills = [];
  var fy = 0;

  fields.forEach(function(f, i) {
    var item = bepFormItem(f.label, f.ctrl, { labelW: LBL_W, gap: LBL_GAP, required: f.required });
    item.x = 0; item.y = fy;
    formContent.appendChild(item);
    fy += item.height;
    if (f.tip) {
      var tipTxt = bepText(f.tip, bepHex('8C8C8C'), 12, { lh:20 });
      tipTxt.x = LBL_W + LBL_GAP; tipTxt.y = fy + 4;
      formContent.appendChild(tipTxt);
      fy += 24;
    }
    if (i < fields.length - 1) fy += FIELD_GAP;
  });
  formContent.resize(formContent.width, fy);

  var drawer = bepDrawer('新增菜单', formContent, {
    width: DRW_W, canvasW: CANVAS_W, canvasH: CANVAS_H,
    confirmLabel: '确 定', cancelLabel: '取 消',
  });
  drawer.x = 0; drawer.y = 0;
  figma.currentPage.appendChild(drawer);
  figma.viewport.scrollAndZoomIntoView([drawer]);
  figma.notify('✅ M-04 新增菜单·按钮类型 生成完成');
}
buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
