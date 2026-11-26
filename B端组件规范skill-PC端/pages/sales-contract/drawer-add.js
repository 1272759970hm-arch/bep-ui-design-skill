// ── D-01 销售管理·新增合同抽屉 v2 ─────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-26
// Fix: 标签右对齐+统一宽度测量 / 标准日历图标 / 金额后缀 / 标准上传 / 按钮顺序修正

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "close":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // ── 标准图标（替换 v1 的非规范图标）────────────────────────────────────
  "calendar":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "upload-cloud":   `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 16L12 12L8 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.39 18.39A5 5 0 0 0 18 9H16.74A8 8 0 1 0 3 16.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular'  }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'   }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Semibold' }),
  ]);

  // ── helpers ───────────────────────────────────────────────────────────────
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a) {
    if (a === undefined) { a = 1; }
    return [{ type:'SOLID', color:color, opacity:a }];
  }

  // ── colors ────────────────────────────────────────────────────────────────
  const C = {
    pageBg:    hex('#F0F2F5'),
    white:     hex('#FFFFFF'),
    black:     hex('#000000'),
    primary:   hex('#006D9B'),
    sidebarBg: hex('#002138'),
    sidebarSub:hex('#00182A'),
    required:  hex('#FF4D4F'),
    addonBg:   hex('#F5F5F5'),
    uploadBg:  hex('#FAFAFA'),
  };

  // ── 基础工具函数 ──────────────────────────────────────────────────────────
  function rect(w, h, color, opts) {
    if (opts === undefined) { opts = {}; }
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a || 1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    return r;
  }
  function text(chars, color, size, opts) {
    if (opts === undefined) { opts = {}; }
    const t = figma.createText();
    t.fontName   = { family:'PingFang SC', style:opts.style || 'Regular' };
    t.fontSize   = size;
    t.lineHeight = opts.lh ? { value:opts.lh, unit:'PIXELS' } : { unit:'AUTO' };
    t.characters = chars;
    t.fills = solid(color, opts.a !== undefined ? opts.a : 1);
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function icon(key, size, color, opacity) {
    if (opacity === undefined) { opacity = 1; }
    const svg = ICONS[key];
    if (!svg) { return null; }
    const node = figma.createNodeFromSvg(svg);
    node.name = key; node.resize(size, size); node.opacity = opacity;
    node.findAll(function(n) { return n.fills && n.fills.length > 0 && n.fills[0].type === 'SOLID'; }).forEach(function(n) { n.fills = solid(color, 1); });
    node.findAll(function(n) { return n.strokes && n.strokes.length > 0; }).forEach(function(n) { n.strokes = solid(color, 1); });
    return node;
  }

  // ── 布局常量 ──────────────────────────────────────────────────────────────
  const CANVAS_W  = 1440, CANVAS_H = 920;
  const SIDE_W    = 208;
  const DRAWER_W  = 680;
  const DRW_HDR_H = 56;
  const DRW_FTR_H = 64;
  const FORM_PAD  = 24;
  const LBL_GAP   = 12;
  const FIELD_H   = 52;  // 10px 上间距 + 32px 控件 + 10px 下间距

  // ── 标签列宽测量（全部标签取最宽值，右对齐基准）─────────────────────────
  // 规范：先创建临时文字节点量宽，取最大值，再销毁临时节点
  // LBL_W = max标签文字宽度 + 12px（必填星号空间）
  var _tmpLbls = ['合同类型','合同编号','合同名称','客户名称','客户签约主体',
                  '销售人员','生效日期','到期日期','合同总金额','结算方式',
                  '付款条款','合同附件'].map(function(l) {
    return text(l, C.black, 14, { lh:22 });
  });
  var MAX_LBL_TEXT_W = Math.max.apply(null, _tmpLbls.map(function(t) { return t.width; }));
  _tmpLbls.forEach(function(t) { t.remove(); });
  var LBL_W   = MAX_LBL_TEXT_W + 12; // +12 为必填星号预留
  var INPUT_W = DRAWER_W - FORM_PAD * 2 - LBL_W - LBL_GAP;

  // ── makeBtn ───────────────────────────────────────────────────────────────
  function makeBtn(label, type, iconNode) {
    if (type === undefined) { type = 'primary'; }
    const btn = figma.createFrame();
    btn.name = 'Btn/' + label;
    btn.cornerRadius = 4; btn.clipsContent = false;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO'; btn.counterAxisSizingMode = 'AUTO';
    btn.paddingLeft = 16; btn.paddingRight = 16;
    btn.paddingTop  = 5;  btn.paddingBottom = 5;
    btn.primaryAxisAlignItems = 'CENTER'; btn.counterAxisAlignItems = 'CENTER';
    btn.itemSpacing = 4;
    if (type === 'primary') {
      btn.fills = solid(C.primary); btn.strokes = [];
    } else {
      btn.fills = solid(C.white);
      btn.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
      btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
    }
    if (iconNode) { iconNode.resize(16, 16); iconNode.layoutAlign = 'CENTER'; btn.appendChild(iconNode); }
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = label; t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    t.fills = type === 'primary' ? solid(C.white) : [{ type:'SOLID', color:C.black, opacity:0.65 }];
    btn.appendChild(t);
    return btn;
  }

  // ── 表单组件 ──────────────────────────────────────────────────────────────

  // 普通文本输入框
  function makeFormInput(w, placeholder) {
    const f = figma.createFrame();
    f.resize(w, 32); f.cornerRadius = 2; f.clipsContent = false;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED';
    f.paddingLeft = 12; f.paddingRight = 12; f.paddingTop = 5; f.paddingBottom = 5;
    f.counterAxisAlignItems = 'CENTER';
    f.fills = solid(C.white);
    f.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = placeholder;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    f.appendChild(t);
    return f;
  }

  // 下拉选择框
  function makeFormSelect(w, placeholder) {
    const f = figma.createFrame();
    f.resize(w, 32); f.cornerRadius = 2; f.clipsContent = false;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED';
    f.paddingLeft = 12; f.paddingRight = 8; f.paddingTop = 5; f.paddingBottom = 5;
    f.primaryAxisAlignItems = 'SPACE_BETWEEN'; f.counterAxisAlignItems = 'CENTER';
    f.fills = solid(C.white);
    f.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = placeholder;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    f.appendChild(t);
    const arr = icon('DropDown-Arrow', 16, C.black, 0.45);
    if (arr) { arr.layoutAlign = 'CENTER'; f.appendChild(arr); }
    return f;
  }

  // 标准日期选择框（calendar 图标左置）
  function makeFormDate(w, placeholder) {
    const f = figma.createFrame();
    f.resize(w, 32); f.cornerRadius = 2; f.clipsContent = false;
    f.fills = solid(C.white);
    f.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    const ic = icon('calendar', 14, C.black, 0.35);
    if (ic) { ic.x = 10; ic.y = 9; f.appendChild(ic); }
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = placeholder;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 28; t.y = 5; // 10(icon_x) + 14(icon_size) + 4(gap)
    f.appendChild(t);
    return f;
  }

  // 后缀输入框（标准规范：单位/货币作后缀，不用前缀）
  // 外层统一边框，内部分隔线，右侧灰色附件区
  function makeFormSuffixInput(w, suffixText, placeholder) {
    var H = 32;
    // 量后缀文字宽度，临时节点用完即删
    var tmpS = text(suffixText, C.black, 14, { lh:22 });
    var ADDON_W = tmpS.width + 24; // 左右各 12px
    tmpS.remove();
    var inputAreaW = w - ADDON_W;

    var container = figma.createFrame();
    container.resize(w, H); container.cornerRadius = 2; container.clipsContent = true;
    container.fills = solid(C.white);
    container.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    container.strokeWeight = 1; container.strokeAlign = 'INSIDE';

    var ph = figma.createText();
    ph.fontName = { family:'PingFang SC', style:'Regular' };
    ph.fontSize = 14; ph.lineHeight = { value:22, unit:'PIXELS' };
    ph.characters = placeholder;
    ph.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    ph.textAutoResize = 'WIDTH_AND_HEIGHT';
    ph.x = 12; ph.y = 5;
    container.appendChild(ph);

    var sep = figma.createRectangle();
    sep.resize(1, H);
    sep.fills = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    sep.x = inputAreaW; sep.y = 0;
    container.appendChild(sep);

    var suffixBox = figma.createFrame();
    suffixBox.resize(ADDON_W, H);
    suffixBox.fills = [{ type:'SOLID', color:C.addonBg }];
    suffixBox.x = inputAreaW; suffixBox.y = 0;
    container.appendChild(suffixBox);

    var st = figma.createText();
    st.fontName = { family:'PingFang SC', style:'Regular' };
    st.fontSize = 14; st.lineHeight = { value:22, unit:'PIXELS' };
    st.characters = suffixText;
    st.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    st.textAutoResize = 'WIDTH_AND_HEIGHT';
    st.x = Math.round((ADDON_W - st.width) / 2);
    st.y = 5;
    suffixBox.appendChild(st);

    return container;
  }

  // 单选按钮
  function makeFormRadio(labelText, selected) {
    const f = figma.createFrame();
    f.name = 'Radio/' + labelText; f.fills = []; f.clipsContent = false;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    f.counterAxisAlignItems = 'CENTER'; f.itemSpacing = 8;
    const circle = figma.createFrame();
    circle.resize(16, 16); circle.cornerRadius = 8; circle.clipsContent = false;
    if (selected) {
      circle.fills = solid(C.white);
      circle.strokes = solid(C.primary); circle.strokeWeight = 1.5; circle.strokeAlign = 'INSIDE';
      const dot = figma.createFrame();
      dot.resize(8, 8); dot.cornerRadius = 4; dot.fills = solid(C.primary); dot.x = 4; dot.y = 4;
      circle.appendChild(dot);
    } else {
      circle.fills = solid(C.white);
      circle.strokes = [{ type:'SOLID', color:C.black, opacity:0.25 }];
      circle.strokeWeight = 1.5; circle.strokeAlign = 'INSIDE';
    }
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = labelText;
    t.fills = selected ? solid(C.primary) : [{ type:'SOLID', color:C.black, opacity:0.85 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    f.appendChild(circle); f.appendChild(t);
    return f;
  }

  function makeFormRadioGroup(options, selectedIdx) {
    const f = figma.createFrame();
    f.name = 'RadioGroup'; f.fills = []; f.clipsContent = false;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    f.counterAxisAlignItems = 'CENTER'; f.itemSpacing = 24;
    options.forEach(function(opt, i) { f.appendChild(makeFormRadio(opt, i === selectedIdx)); });
    return f;
  }

  // 多行文本框
  function makeFormTextarea(w, h, placeholder) {
    const f = figma.createFrame();
    f.resize(w, h); f.cornerRadius = 2; f.clipsContent = false;
    f.fills = solid(C.white);
    f.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = placeholder;
    t.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = 12; t.y = 8;
    f.appendChild(t);
    return f;
  }

  // 上传按钮（标准按钮样式，非拖拽区）+ 格式提示
  function makeFormUpload() {
    var wrapper = figma.createFrame();
    wrapper.name = 'UploadArea'; wrapper.fills = []; wrapper.clipsContent = false;

    // 上传按钮
    var btn = figma.createFrame();
    btn.name = 'UploadBtn'; btn.cornerRadius = 2; btn.clipsContent = false;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO'; btn.counterAxisSizingMode = 'AUTO';
    btn.paddingLeft = 12; btn.paddingRight = 12;
    btn.paddingTop = 5; btn.paddingBottom = 5;
    btn.counterAxisAlignItems = 'CENTER'; btn.itemSpacing = 6;
    btn.fills = solid(C.white);
    btn.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    btn.strokeWeight = 1; btn.strokeAlign = 'INSIDE';
    var ic = icon('upload-cloud', 14, C.black, 0.65);
    if (ic) { ic.layoutAlign = 'CENTER'; btn.appendChild(ic); }
    var btnTxt = figma.createText();
    btnTxt.fontName = { family:'PingFang SC', style:'Regular' };
    btnTxt.fontSize = 14; btnTxt.lineHeight = { value:22, unit:'PIXELS' };
    btnTxt.characters = '点击上传';
    btnTxt.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    btnTxt.textAutoResize = 'WIDTH_AND_HEIGHT'; btnTxt.layoutAlign = 'CENTER';
    btn.appendChild(btnTxt);
    btn.x = 0; btn.y = 0;
    wrapper.appendChild(btn);

    // 格式提示文字
    var hint = figma.createText();
    hint.fontName = { family:'PingFang SC', style:'Regular' };
    hint.fontSize = 12; hint.lineHeight = { value:18, unit:'PIXELS' };
    hint.characters = '支持 PDF / Word / Excel 格式，单个文件不超过 20MB';
    hint.fills = [{ type:'SOLID', color:C.black, opacity:0.45 }];
    hint.textAutoResize = 'WIDTH_AND_HEIGHT';
    hint.x = 0; hint.y = 36; // btn(32px) + gap(4px)
    wrapper.appendChild(hint);

    wrapper.resize(INPUT_W, 54); // btn(32) + gap(4) + hint(18)
    return wrapper;
  }

  // ── 表单行（标签右对齐，统一 LBL_W 列宽）────────────────────────────────
  // 规范：所有标签文字右边缘对齐到 LBL_W，必填星号紧贴标签左侧

  // 标准行（FIELD_H=56，标签垂直居中）
  function makeFormRow(labelText, inputNode, required) {
    if (required === undefined) { required = false; }
    const contentW = DRAWER_W - FORM_PAD * 2;
    const f = figma.createFrame();
    f.name = 'FormRow/' + labelText;
    f.resize(contentW, FIELD_H); f.fills = []; f.clipsContent = false;

    var lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = labelText;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    lbl.x = LBL_W - lbl.width; // 右对齐
    lbl.y = Math.round((FIELD_H - 22) / 2);
    f.appendChild(lbl);

    if (required) {
      var star = figma.createText();
      star.fontName = { family:'PingFang SC', style:'Regular' };
      star.fontSize = 14; star.lineHeight = { value:22, unit:'PIXELS' };
      star.characters = '*';
      star.fills = solid(C.required);
      star.textAutoResize = 'WIDTH_AND_HEIGHT';
      star.x = lbl.x - star.width - 2;
      star.y = lbl.y;
      f.appendChild(star);
    }

    inputNode.x = LBL_W + LBL_GAP;
    inputNode.y = Math.round((FIELD_H - inputNode.height) / 2);
    f.appendChild(inputNode);
    return f;
  }

  // 高度可变的行（textarea / upload，标签顶部对齐）
  function makeFormRowTall(labelText, inputNode, required, rowH) {
    if (required === undefined) { required = false; }
    const contentW = DRAWER_W - FORM_PAD * 2;
    const f = figma.createFrame();
    f.name = 'FormRow/' + labelText;
    f.resize(contentW, rowH); f.fills = []; f.clipsContent = false;

    var lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = labelText;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    lbl.x = LBL_W - lbl.width;
    lbl.y = 10;
    f.appendChild(lbl);

    if (required) {
      var star = figma.createText();
      star.fontName = { family:'PingFang SC', style:'Regular' };
      star.fontSize = 14; star.lineHeight = { value:22, unit:'PIXELS' };
      star.characters = '*';
      star.fills = solid(C.required);
      star.textAutoResize = 'WIDTH_AND_HEIGHT';
      star.x = lbl.x - star.width - 2;
      star.y = lbl.y;
      f.appendChild(star);
    }

    inputNode.x = LBL_W + LBL_GAP;
    inputNode.y = 10;
    f.appendChild(inputNode);
    return f;
  }

  // ── 侧边栏 ────────────────────────────────────────────────────────────────
  function makeSidebarLogo() {
    const area = figma.createFrame();
    area.name = 'SidebarLogo'; area.resize(208, 64);
    area.fills = solid(C.sidebarBg); area.clipsContent = false;
    const box = rect(32, 32, C.primary, { r:6, x:24, y:16 });
    area.appendChild(box);
    area.appendChild(text('M', C.white, 14, { style:'Medium', lh:20, x:24 + 9, y:22 }));
    area.appendChild(text('Mall 管理后台', C.white, 16, { style:'Medium', lh:22, x:64, y:12 }));
    area.appendChild(text('MALL MANAGEMENT', C.white, 7, { lh:10, a:0.6, x:64, y:38 }));
    return area;
  }
  function makeSidebarDivider() {
    const w = figma.createFrame();
    w.name = 'SidebarDivider'; w.resize(208, 1); w.fills = []; w.clipsContent = false;
    w.appendChild(rect(160, 1, C.white, { a:0.08, x:24, y:0 }));
    return w;
  }
  function makeSidebarItem(label, level, state, iconKey) {
    var bgColor = level === 2 ? C.sidebarSub : C.sidebarBg;
    var isExpanded = state === 'expanded';
    var op = (state === 'active' || isExpanded) ? 1 : 0.5;
    const row = figma.createFrame();
    row.name = 'L' + level + '·' + label;
    row.resize(208, 48); row.fills = solid(bgColor); row.opacity = op; row.clipsContent = false;
    if (level === 1 && iconKey) {
      const ic = icon(iconKey, 16, C.white, 1);
      if (ic) { ic.x = 24; ic.y = 16; row.appendChild(ic); }
    }
    const textX = level === 1 ? 52 : 40;
    row.appendChild(text(label, C.white, 14, { lh:22, x:textX, y:13 }));
    if (level === 1) {
      const arr = icon(isExpanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, 1);
      if (arr) { arr.x = 186; arr.y = 18; row.appendChild(arr); }
    }
    return row;
  }
  function makeSidebar(height) {
    const s = figma.createFrame(); s.name = '侧边栏';
    s.layoutMode = 'VERTICAL'; s.itemSpacing = 0;
    s.primaryAxisSizingMode = 'FIXED'; s.counterAxisSizingMode = 'FIXED';
    s.resize(208, height); s.fills = solid(C.sidebarBg); s.clipsContent = false;
    s.appendChild(makeSidebarLogo());
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('商城运营', 1, 'collapsed', 'bar-chart-2'));
    s.appendChild(makeSidebarItem('销售管理', 1, 'expanded',  'briefcase'));
    s.appendChild(makeSidebarItem('合同管理', 2, 'active',    null));
    s.appendChild(makeSidebarItem('客户管理', 2, 'inactive',  null));
    s.appendChild(makeSidebarItem('报价单',   2, 'inactive',  null));
    s.appendChild(makeSidebarDivider());
    s.appendChild(makeSidebarItem('系统管理', 1, 'collapsed', 'settings'));
    return s;
  }

  // ── 抽屉 ──────────────────────────────────────────────────────────────────
  function buildDrawer() {
    const drawer = figma.createFrame();
    drawer.name = '抽屉/新增合同'; drawer.resize(DRAWER_W, CANVAS_H);
    drawer.fills = solid(C.white); drawer.clipsContent = false;
    drawer.effects = [{
      type:'DROP_SHADOW', visible:true, blendMode:'NORMAL',
      color:{r:0,g:0,b:0,a:0.15}, offset:{x:-4,y:0}, radius:16, spread:0
    }];

    // 标题栏
    const header = figma.createFrame();
    header.name = 'DrawerHeader'; header.resize(DRAWER_W, DRW_HDR_H);
    header.fills = solid(C.white); header.clipsContent = false;
    header.appendChild(text('新增合同', C.black, 16, { style:'Medium', lh:24, a:0.85, x:24, y:16 }));
    const closeIc = icon('close', 16, C.black, 0.45);
    if (closeIc) { closeIc.x = DRAWER_W - 36; closeIc.y = 20; header.appendChild(closeIc); }
    header.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:DRW_HDR_H - 1 }));
    header.x = 0; header.y = 0;
    drawer.appendChild(header);

    // 表单区域
    const body = figma.createFrame();
    body.name = 'DrawerBody'; body.fills = solid(C.white); body.clipsContent = false;

    const fields = [];
    // 1. 合同类型（单选）
    fields.push(makeFormRow('合同类型', makeFormRadioGroup(['框架合同', '具体合同'], 0), true));
    // 2. 合同编号
    fields.push(makeFormRow('合同编号', makeFormInput(INPUT_W, '请输入合同编号'), true));
    // 3. 合同名称
    fields.push(makeFormRow('合同名称', makeFormInput(INPUT_W, '请输入合同名称'), true));
    // 4. 客户名称
    fields.push(makeFormRow('客户名称', makeFormSelect(INPUT_W, '请选择客户'), true));
    // 5. 客户签约主体
    fields.push(makeFormRow('客户签约主体', makeFormInput(INPUT_W, '请输入签约主体名称'), true));
    // 6. 销售人员
    fields.push(makeFormRow('销售人员', makeFormSelect(INPUT_W, '请选择销售人员'), true));
    // 7. 生效日期（标准日历图标）
    fields.push(makeFormRow('生效日期', makeFormDate(INPUT_W, '请选择生效日期'), true));
    // 8. 到期日期（标准日历图标）
    fields.push(makeFormRow('到期日期', makeFormDate(INPUT_W, '请选择到期日期'), true));
    // 9. 合同总金额（后缀输入框，单位：元）
    fields.push(makeFormRow('合同总金额', makeFormSuffixInput(INPUT_W, '元', '请输入合同金额'), true));
    // 10. 结算方式
    fields.push(makeFormRow('结算方式', makeFormSelect(INPUT_W, '请选择结算方式'), true));
    // 11. 付款条款（textarea，选填）10+80+10=100
    fields.push(makeFormRowTall('付款条款', makeFormTextarea(INPUT_W, 80, '请输入付款条款说明'), false, 100));
    // 12. 合同附件（上传按钮+提示，选填）10+54+10=74
    fields.push(makeFormRowTall('合同附件', makeFormUpload(), false, 74));

    var yPos = FORM_PAD;
    var totalH = 0;
    fields.forEach(function(f) { totalH += f.height; });
    body.resize(DRAWER_W, FORM_PAD + totalH + FORM_PAD);
    fields.forEach(function(f) { f.x = FORM_PAD; f.y = yPos; yPos += f.height; body.appendChild(f); });

    body.x = 0; body.y = DRW_HDR_H;
    drawer.appendChild(body);

    // 底部操作栏（顺序修正：取消 / 暂存草稿 / 提交）
    const footer = figma.createFrame();
    footer.name = 'DrawerFooter'; footer.resize(DRAWER_W, DRW_FTR_H);
    footer.fills = solid(C.white); footer.clipsContent = false;
    footer.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:0 }));
    const footerBtns = figma.createFrame();
    footerBtns.name = 'FooterBtns'; footerBtns.fills = []; footerBtns.clipsContent = false;
    footerBtns.layoutMode = 'HORIZONTAL';
    footerBtns.primaryAxisSizingMode = 'AUTO'; footerBtns.counterAxisSizingMode = 'AUTO';
    footerBtns.counterAxisAlignItems = 'CENTER'; footerBtns.itemSpacing = 8;
    footerBtns.appendChild(makeBtn('取消', 'secondary'));
    footerBtns.appendChild(makeBtn('暂存草稿', 'secondary'));
    footerBtns.appendChild(makeBtn('提交', 'primary'));
    footer.appendChild(footerBtns);
    footerBtns.x = DRAWER_W - FORM_PAD - footerBtns.width;
    footerBtns.y = Math.round((DRW_FTR_H - footerBtns.height) / 2);
    footer.x = 0; footer.y = CANVAS_H - DRW_FTR_H;
    drawer.appendChild(footer);

    return drawer;
  }

  // ── 页面组装 ──────────────────────────────────────────────────────────────
  const root = figma.createFrame();
  root.name = 'D-01 新增合同抽屉'; root.resize(CANVAS_W, CANVAS_H);
  root.fills = solid(C.pageBg); root.clipsContent = false;
  figma.currentPage.appendChild(root);

  const sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  const overlay = rect(CANVAS_W - SIDE_W, CANVAS_H, C.black, { a:0.40, x:SIDE_W, y:0 });
  root.appendChild(overlay);

  const drawer = buildDrawer();
  drawer.x = CANVAS_W - DRAWER_W; drawer.y = 0;
  root.appendChild(drawer);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
