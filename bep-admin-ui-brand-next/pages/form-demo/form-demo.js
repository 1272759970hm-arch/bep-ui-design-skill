// ── form-demo.js ───────────────────────────────────────────────────────────
// BeP Admin Kit · Figma Scripter · 2026-06-03
// 示例：员工信息登记 —— 多控件 + 多种校验状态的表单页
// 使用方式：先粘贴 bep-components.js 全文，再追加本文件，在 Figma Scripter 中运行
// ═══════════════════════════════════════════════════════════════════════════

var CANVAS_W  = 1440;
var CANVAS_H  = 1120;   // 表单内容较长，向下延伸
var SIDE_W    = 208;
var HDR_H     = 96;
var OUTER_PAD = 16;
var CARD_PAD  = 24;
var TABLE_W   = CANVAS_W - SIDE_W - OUTER_PAD * 2 - CARD_PAD * 2; // 1152

// 表单布局常量
var LABEL_W  = 90;
var LABEL_GAP = 12;
var FIELD_GAP = 20;
var CTRL_H   = 32;
var COL_GAP  = 24;
var COL_W    = (TABLE_W - COL_GAP) / 2;          // 564
var CTRL_W   = COL_W - LABEL_W - LABEL_GAP;       // 462
var FULL_CTRL_W = TABLE_W - LABEL_W - LABEL_GAP;  // 全宽控件

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular' }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium'  }),
  ]);

  // ── 页面根容器 ─────────────────────────────────────────────────
  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name: '员工信息登记', clip: false });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  // ── 侧边栏 ────────────────────────────────────────────────────
  var sidebar = bepFrame(SIDE_W, CANVAS_H, { name: 'Sidebar' });
  sidebar.fills = bepSolid(bepHex('002138'));
  sidebar.x = 0; sidebar.y = 0;
  pageFrame.appendChild(sidebar);

  var logo = bepSidebarLogo('BeP Admin', 'BEP ADMIN SYSTEM', SIDE_W);
  logo.x = 0; logo.y = 0;
  sidebar.appendChild(logo);

  var menuDefs = [
    { label: '人事管理', level: 1, state: 'expanded', icon: 'Line/users' },
    { label: '员工信息',  level: 2, state: 'active',   icon: null },
    { label: '部门管理',  level: 2, state: 'default',  icon: null },
    { label: '系统管理', level: 1, state: 'default',   icon: 'Line/settings' },
    { label: '数据中心', level: 1, state: 'default',   icon: 'Line/database' },
  ];
  var menuY = 80;
  menuDefs.forEach(function(m) {
    var item = bepSidebarItem(m.label, m.level, m.state, m.icon);
    item.x = 0; item.y = menuY;
    sidebar.appendChild(item);
    menuY += 48;
  });

  // ── 页头 ──────────────────────────────────────────────────────
  var fullHeader = bepHeader('新增员工', ['人事管理', '员工信息', '新增员工'], CANVAS_W - SIDE_W);
  fullHeader.x = SIDE_W; fullHeader.y = 0;
  pageFrame.appendChild(fullHeader);

  // ── 内容卡片 ──────────────────────────────────────────────────
  var CARD_W = CANVAS_W - SIDE_W - OUTER_PAD * 2; // 1200
  var card = bepFrame(CARD_W, 100, { name: 'Card', r: 4, clip: false });
  card.fills = bepSolid(BEP_C.white);
  card.x = SIDE_W + OUTER_PAD;
  card.y = HDR_H + OUTER_PAD;
  pageFrame.appendChild(card);

  var cy = CARD_PAD; // 卡片内累积 Y

  // ── 辅助：分区标题（模板规范：16px Medium，无装饰线）─────────
  function mkSection(title) {
    var wrap = bepFrame(TABLE_W, 32, { name: 'Section_' + title });
    wrap.fills = [];
    var t = bepText(title, bepHex('262626'), 16, { style: 'Medium', lh: 24, x: 0, y: 4 });
    wrap.appendChild(t);
    return wrap;
  }

  // ── 辅助：添加两列表单行 ──────────────────────────────────────
  function addRow(fieldA, fieldB) {
    var itemA = bepFormItem(fieldA.label, fieldA.ctrl, {
      labelW: LABEL_W, gap: LABEL_GAP,
      required: fieldA.required || false,
      error:    fieldA.error    || null,
    });
    itemA.x = CARD_PAD; itemA.y = cy;
    card.appendChild(itemA);

    var itemB = null;
    if (fieldB) {
      itemB = bepFormItem(fieldB.label, fieldB.ctrl, {
        labelW: LABEL_W, gap: LABEL_GAP,
        required: fieldB.required || false,
        error:    fieldB.error    || null,
      });
      itemB.x = CARD_PAD + COL_W + COL_GAP; itemB.y = cy;
      card.appendChild(itemB);
    }

    var rowH = itemA.height;
    if (itemB && itemB.height > rowH) rowH = itemB.height;
    cy += rowH + FIELD_GAP;
  }

  // ── 辅助：添加全宽表单行 ──────────────────────────────────────
  function addFullRow(field) {
    var item = bepFormItem(field.label, field.ctrl, {
      labelW: LABEL_W, gap: LABEL_GAP,
      required: field.required || false,
      error:    field.error    || null,
    });
    item.x = CARD_PAD; item.y = cy;
    card.appendChild(item);
    cy += item.height + FIELD_GAP;
    return item;
  }

  // ══════════════════════════════════════════════════════════════
  // SECTION 1 · 基础信息
  // ══════════════════════════════════════════════════════════════
  var sec1 = mkSection('基础信息');
  sec1.x = CARD_PAD; sec1.y = cy;
  card.appendChild(sec1);
  cy += sec1.height + 20;

  // 行1：员工姓名（必填 + 错误状态） | 工号（只读/自动生成）
  addRow(
    { label: '员工姓名', ctrl: bepInput('请输入员工姓名', CTRL_W, CTRL_H), required: true,  error: '员工姓名不能为空' },
    { label: '工号',     ctrl: bepInput('EMP-2026-XXXX', CTRL_W, CTRL_H), required: false }
  );

  // 行2：所属部门（必填） | 职位（必填 + 错误状态）
  addRow(
    { label: '所属部门', ctrl: bepSelect('请选择部门',   CTRL_W, CTRL_H), required: true  },
    { label: '职位',     ctrl: bepSelect('请选择职位',   CTRL_W, CTRL_H), required: true,  error: '请选择所属职位' }
  );

  // 行3：性别（单选组） | 年龄（数字步进器）
  addRow(
    { label: '性别', ctrl: bepRadioGroup(['男', '女', '保密'], '男'), required: false },
    { label: '年龄', ctrl: bepInputNumber('25', CTRL_W, CTRL_H),      required: false }
  );

  // 行4：联系电话（必填） | 邮箱地址
  addRow(
    { label: '联系电话', ctrl: bepInput('请输入手机号',    CTRL_W, CTRL_H), required: true  },
    { label: '邮箱地址', ctrl: bepInput('请输入电子邮箱',  CTRL_W, CTRL_H), required: false }
  );

  cy += 8; // 分区间距

  // ══════════════════════════════════════════════════════════════
  // SECTION 2 · 工作信息
  // ══════════════════════════════════════════════════════════════
  var sec2 = mkSection('工作信息');
  sec2.x = CARD_PAD; sec2.y = cy;
  card.appendChild(sec2);
  cy += sec2.height + 20;

  // 行5：入职日期（日期区间控件，必填） | 合同类型（下拉）
  addRow(
    { label: '入职日期', ctrl: bepDateRange(CTRL_W, CTRL_H), required: true  },
    { label: '合同类型', ctrl: bepSelect('请选择合同类型', CTRL_W, CTRL_H), required: false }
  );

  // 行6：工作状态（开关） | 月薪区间（数字步进器）
  addRow(
    { label: '工作状态', ctrl: bepSwitch(true, '在职', '离职'),         required: false },
    { label: '月薪(元)', ctrl: bepInputNumber('8000', CTRL_W, CTRL_H), required: false }
  );

  // 行7：擅长技能（多选组，全宽）
  addFullRow({
    label: '擅长技能',
    ctrl: bepCheckboxGroup(
      ['Java', 'Python', '前端开发', '数据分析', '产品设计', '运营推广'],
      ['Java', '前端开发']
    ),
    required: false,
  });

  cy += 8;

  // ══════════════════════════════════════════════════════════════
  // SECTION 3 · 附件上传
  // ══════════════════════════════════════════════════════════════
  var sec3 = mkSection('附件上传');
  sec3.x = CARD_PAD; sec3.y = cy;
  card.appendChild(sec3);
  cy += sec3.height + 20;

  // 行8：证件照（上传按钮 + 右侧提示文字同行）
  var uploadBtn = bepUploadBtn('点击上传', 32);
  var uploadItem = bepFormItem('证件照片', uploadBtn, {
    labelW: LABEL_W, gap: LABEL_GAP, required: false,
  });
  uploadItem.x = CARD_PAD; uploadItem.y = cy;
  card.appendChild(uploadItem);

  // 提示文字跟在上传按钮右侧，垂直居中
  var tipUpload = bepText(
    '支持 JPG / PNG 格式，单文件不超过 2MB，最多上传 3 张',
    bepHex('8C8C8C'), 12, { lh: 20 }
  );
  tipUpload.x = CARD_PAD + LABEL_W + LABEL_GAP + uploadBtn.width + 12;
  tipUpload.y = cy + Math.round((CTRL_H - 20) / 2);
  card.appendChild(tipUpload);
  cy += CTRL_H + FIELD_GAP;

  // 行9：备注说明（全宽输入框）
  addFullRow({
    label: '备注说明',
    ctrl: bepInput('选填，如有特殊说明请在此填写', FULL_CTRL_W, CTRL_H),
    required: false,
  });

  // ── 底部操作按钮（距上方32px，居中对齐）────────────────────────
  // addFullRow/addRow 末尾已含 FIELD_GAP(20)，需补偿使实际间距 = 32px
  var btnReset  = bepButton('重置', 'secondary', 32);
  var btnCancel = bepButton('取消', 'secondary', 32);
  var btnSave   = bepButton('保存', 'primary',   32);

  var btnY = cy - FIELD_GAP + 32; // 32 - 20 = 12，补偿 FIELD_GAP
  var totalBtnW = btnReset.width + 8 + btnCancel.width + 8 + btnSave.width;
  var btnStartX = CARD_PAD + (TABLE_W - totalBtnW) / 2;

  btnReset.x  = btnStartX;                                              btnReset.y  = btnY;
  btnCancel.x = btnStartX + btnReset.width + 8;                         btnCancel.y = btnY;
  btnSave.x   = btnStartX + btnReset.width + 8 + btnCancel.width + 8;  btnSave.y   = btnY;

  card.appendChild(btnReset);
  card.appendChild(btnCancel);
  card.appendChild(btnSave);

  // 卡片底部内边距 24px
  cy = btnY + 32 + CARD_PAD;

  // ── 卡片高度 & 页面高度始终贴合内容 ─────────────────────────────
  card.resize(CARD_W, cy);
  var totalH = card.y + cy + OUTER_PAD;
  pageFrame.resize(CANVAS_W, totalH);
  sidebar.resize(SIDE_W, totalH);

  // ── 成功提示（展示 bepMessage 效果）────────────────────────────
  // 注释掉即可隐藏，展示时放在 pageFrame 右上角
  // var msg = bepMessage('保存成功', 'success');
  // msg.x = CANVAS_W - msg.width - 24; msg.y = 80;
  // pageFrame.appendChild(msg);

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('✅ 员工信息登记页生成完成');
}

buildPage().catch(function(e) { figma.notify('❌ ' + e.message); });
