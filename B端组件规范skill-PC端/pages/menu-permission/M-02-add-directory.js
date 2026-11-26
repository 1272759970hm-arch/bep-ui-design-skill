// ── M-02  菜单权限管理·新增菜单（目录类型）抽屉 ──────────────────────────────
// BeP Admin Kit · Figma Scripter · 2026-06-01（重写版，全量使用标准组件）
// 抽屉宽度：640px（Medium）  字段：菜单类型/菜单名称/上级菜单/排序/状态/图标
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件并运行
// ═══════════════════════════════════════════════════════════════════════════════

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

  // ── 画布背景 + 侧边栏 + 页头（同 M-01，提供完整页面上下文）───────────────
  var bg = bepRect(CANVAS_W, CANVAS_H, BEP_C.pageBg);
  bg.name = 'Canvas/M-02'; bg.x = 0; bg.y = 0;
  figma.currentPage.appendChild(bg);

  // ── 表单内容区 ────────────────────────────────────────────────────────────
  var fields = [
    { label:'菜单类型', required:true,  ctrl: bepSelect('目录', CTRL_W, 32) },
    { label:'菜单名称', required:true,  ctrl: bepInput('请输入菜单名称', CTRL_W, 32) },
    { label:'上级菜单', required:false, ctrl: bepSelect('请选择上级菜单', CTRL_W, 32) },
    { label:'排序',     required:false, ctrl: bepInput('1', CTRL_W, 32) },
    { label:'状态',     required:false, ctrl: bepSwitch(true, '启用', '停用') },
    { label:'图标',     required:false, ctrl: bepSelect('请选择图标', CTRL_W, 32) },
  ];

  var formH = fields.reduce(function(h, f, i) {
    return h + (f.ctrl.height || 32) + (i < fields.length - 1 ? FIELD_GAP : 0);
  }, 0);

  var formContent = bepFrame(DRW_W - FORM_PAD * 2, formH, { name:'FormContent' });
  formContent.fills = [];

  var fy = 0;
  fields.forEach(function(f, i) {
    var item = bepFormItem(f.label, f.ctrl, { labelW: LBL_W, gap: LBL_GAP, required: f.required });
    item.x = 0; item.y = fy;
    formContent.appendChild(item);
    fy += item.height + (i < fields.length - 1 ? FIELD_GAP : 0);
  });

  // ── 抽屉（含遮罩）────────────────────────────────────────────────────────
  var drawer = bepDrawer('新增菜单', formContent, {
    width: DRW_W, canvasW: CANVAS_W, canvasH: CANVAS_H,
    confirmLabel: '确 定', cancelLabel: '取 消',
  });
  drawer.x = 0; drawer.y = 0;
  figma.currentPage.appendChild(drawer);

  figma.viewport.scrollAndZoomIntoView([drawer]);
  figma.notify('✅ M-02 新增菜单·目录类型 生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
