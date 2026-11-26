// ── D-01 销售管理·新增合同抽屉 v1 ─────────────────────────────────────────
// BeP Admin Kit · Figma Scripter JS · 2026-05-26
// 680px 右侧抽屉，BeP 规范，主区域半透明遮罩

const ICONS = {
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "briefcase":      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6.5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 20.5V4.5C16 3.39543 15.1046 2.5 14 2.5H10C8.89543 2.5 8 3.39543 8 4.5V20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2":    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":       `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "close":          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "Date":           `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.99644 3.44662C8.93293 3.09675 8.62671 2.83144 8.25852 2.83144C7.84431 2.83144 7.50852 3.16722 7.50852 3.58144V4.70223H5.45233C4.00491 4.70223 2.83154 5.87559 2.83154 7.32302V18.5478C2.83154 19.9952 4.00491 21.1686 5.45233 21.1686H18.5479C19.9953 21.1686 21.1687 19.9952 21.1687 18.5478V7.32302C21.1687 5.87559 19.9953 4.70223 18.5479 4.70223H16.4917V3.58144L16.4796 3.44662C16.4161 3.09675 16.1099 2.83144 15.7417 2.83144C15.3275 2.83144 14.9917 3.16722 14.9917 3.58144V4.70223H9.00852V3.58144L8.99644 3.44662ZM7.50852 6.20223V7.32302L7.5206 7.45783C7.58411 7.8077 7.89033 8.07302 8.25852 8.07302C8.67273 8.07302 9.00852 7.73723 9.00852 7.32302V6.20223H14.9917V7.32302L15.0038 7.45783C15.0673 7.8077 15.3735 8.07302 15.7417 8.07302C16.1559 8.07302 16.4917 7.73723 16.4917 7.32302V6.20223H18.5479C19.1669 6.20223 19.6687 6.70402 19.6687 7.32302V18.5478C19.6687 19.1668 19.1669 19.6686 18.5479 19.6686H5.45233C4.83334 19.6686 4.33154 19.1668 4.33154 18.5478V7.32302C4.33154 6.70402 4.83334 6.20223 5.45233 6.20223H7.50852Z" fill="currentColor"/></svg>`,
  "upload":         `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular'  }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'   }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Semibold' }),
  ]);

  // ── helpers ──────────────────────────────────────────────────────────────
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
  };

  // ── layout constants ──────────────────────────────────────────────────────
  const CANVAS_W  = 1440, CANVAS_H = 920;
  const SIDE_W    = 208;
  const DRAWER_W  = 680;
  const DRW_HDR_H = 56;
  const DRW_FTR_H = 64;
  const FORM_PAD  = 24;
  const LBL_W     = 100;
  const LBL_GAP   = 12;
  const FIELD_H   = 56;
  const INPUT_W   = DRAWER_W - FORM_PAD * 2 - LBL_W - LBL_GAP; // 520

  // ── utility ───────────────────────────────────────────────────────────────
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
    if (iconNode) { iconNode.resize(16,16); iconNode.layoutAlign = 'CENTER'; btn.appendChild(iconNode); }
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:'Regular' };
    t.fontSize = 14; t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = label; t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutAlign = 'CENTER';
    t.fills = type === 'primary' ? solid(C.white) : [{ type:'SOLID', color:C.black, opacity:0.65 }];
    btn.appendChild(t);
    return btn;
  }

  // ── form input components ─────────────────────────────────────────────────

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

  // 日期选择框
  function makeFormDate(w, placeholder) {
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
    const ic = icon('Date', 16, C.black, 0.35);
    if (ic) { ic.layoutAlign = 'CENTER'; f.appendChild(ic); }
    return f;
  }

  // ¥前缀金额输入框（绝对定位）
  function makeFormAmountInput(w) {
    const f = figma.createFrame();
    f.resize(w, 32); f.cornerRadius = 2; f.clipsContent = true;
    f.fills = solid(C.white);
    f.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    // 灰色前缀背景
    const prefixBg = rect(40, 30, C.black, { a:0.04, x:1, y:1 });
    f.appendChild(prefixBg);
    // ¥符号
    const prefixT = figma.createText();
    prefixT.fontName = { family:'PingFang SC', style:'Regular' };
    prefixT.fontSize = 14; prefixT.lineHeight = { value:22, unit:'PIXELS' };
    prefixT.characters = '¥';
    prefixT.fills = [{ type:'SOLID', color:C.black, opacity:0.65 }];
    prefixT.textAutoResize = 'WIDTH_AND_HEIGHT';
    f.appendChild(prefixT);
    prefixT.x = 1 + Math.round((40 - prefixT.width) / 2); prefixT.y = 5;
    // 分隔线
    f.appendChild(rect(1, 16, C.black, { a:0.15, x:41, y:8 }));
    // 占位文字
    const ph = figma.createText();
    ph.fontName = { family:'PingFang SC', style:'Regular' };
    ph.fontSize = 14; ph.lineHeight = { value:22, unit:'PIXELS' };
    ph.characters = '请输入合同金额';
    ph.fills = [{ type:'SOLID', color:C.black, opacity:0.25 }];
    ph.textAutoResize = 'WIDTH_AND_HEIGHT';
    ph.x = 52; ph.y = 5;
    f.appendChild(ph);
    return f;
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
    t.fills = selected
      ? solid(C.primary)
      : [{ type:'SOLID', color:C.black, opacity:0.85 }];
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

  // 文件上传区域
  function makeFormUpload(w) {
    const f = figma.createFrame();
    f.resize(w, 64); f.cornerRadius = 2; f.clipsContent = false;
    f.fills = [{ type:'SOLID', color:hex('#FAFAFA') }];
    f.strokes = [{ type:'SOLID', color:C.black, opacity:0.15 }];
    f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    // 图标+文字行
    const row = figma.createFrame();
    row.name = 'UploadRow'; row.fills = []; row.clipsContent = false;
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO'; row.counterAxisSizingMode = 'AUTO';
    row.counterAxisAlignItems = 'CENTER'; row.itemSpacing = 6;
    const ic = icon('upload', 14, C.primary, 1);
    if (ic) { ic.layoutAlign = 'CENTER'; row.appendChild(ic); }
    const uploadT = figma.createText();
    uploadT.fontName = { family:'PingFang SC', style:'Regular' };
    uploadT.fontSize = 14; uploadT.lineHeight = { value:22, unit:'PIXELS' };
    uploadT.characters = '点击上传';
    uploadT.fills = solid(C.primary);
    uploadT.textAutoResize = 'WIDTH_AND_HEIGHT'; uploadT.layoutAlign = 'CENTER';
    row.appendChild(uploadT);
    f.appendChild(row);
    row.x = Math.round((w - row.width) / 2); row.y = 10;
    // 提示文字
    const hint = figma.createText();
    hint.fontName = { family:'PingFang SC', style:'Regular' };
    hint.fontSize = 12; hint.lineHeight = { value:18, unit:'PIXELS' };
    hint.characters = '支持 PDF、Word 格式，不超过 20MB';
    hint.fills = [{ type:'SOLID', color:C.black, opacity:0.35 }];
    hint.textAutoResize = 'WIDTH_AND_HEIGHT';
    f.appendChild(hint);
    hint.x = Math.round((w - hint.width) / 2); hint.y = 38;
    return f;
  }

  // ── 标签组（支持必填红色*）───────────────────────────────────────────────
  function makeLabelGroup(labelText, required) {
    if (required === undefined) { required = false; }
    const f = figma.createFrame();
    f.name = 'LabelGroup'; f.fills = []; f.clipsContent = false;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    f.counterAxisAlignItems = 'CENTER'; f.itemSpacing = 2;
    if (required) {
      const star = figma.createText();
      star.fontName = { family:'PingFang SC', style:'Regular' };
      star.fontSize = 14; star.lineHeight = { value:22, unit:'PIXELS' };
      star.characters = '*'; star.fills = solid(C.required);
      star.textAutoResize = 'WIDTH_AND_HEIGHT';
      f.appendChild(star);
    }
    const lbl = figma.createText();
    lbl.fontName = { family:'PingFang SC', style:'Regular' };
    lbl.fontSize = 14; lbl.lineHeight = { value:22, unit:'PIXELS' };
    lbl.characters = labelText;
    lbl.fills = [{ type:'SOLID', color:C.black, opacity:0.85 }];
    lbl.textAutoResize = 'WIDTH_AND_HEIGHT';
    f.appendChild(lbl);
    return f;
  }

  // 标准表单行（label左，input右，高度FIELD_H=56）
  function makeFormRow(labelText, inputNode, required) {
    if (required === undefined) { required = false; }
    const contentW = DRAWER_W - FORM_PAD * 2;
    const f = figma.createFrame();
    f.name = 'FormRow/' + labelText;
    f.resize(contentW, FIELD_H); f.fills = []; f.clipsContent = false;
    const lblGrp = makeLabelGroup(labelText, required);
    lblGrp.x = 0; lblGrp.y = Math.round((FIELD_H - 22) / 2);
    inputNode.x = LBL_W + LBL_GAP;
    inputNode.y = Math.round((FIELD_H - inputNode.height) / 2);
    f.appendChild(lblGrp);
    f.appendChild(inputNode);
    return f;
  }

  // 高度可变的表单行（textarea / upload，label顶部对齐）
  function makeFormRowTall(labelText, inputNode, required, rowH) {
    if (required === undefined) { required = false; }
    const contentW = DRAWER_W - FORM_PAD * 2;
    const f = figma.createFrame();
    f.name = 'FormRow/' + labelText;
    f.resize(contentW, rowH); f.fills = []; f.clipsContent = false;
    const lblGrp = makeLabelGroup(labelText, required);
    lblGrp.x = 0; lblGrp.y = 8;
    inputNode.x = LBL_W + LBL_GAP; inputNode.y = 0;
    f.appendChild(lblGrp);
    f.appendChild(inputNode);
    return f;
  }

  // ── 侧边栏（与列表页一致）────────────────────────────────────────────────
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

  // ── 抽屉组装 ──────────────────────────────────────────────────────────────
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
    // 1. 合同类型（单选，框架合同默认选中）
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
    // 7. 生效日期
    fields.push(makeFormRow('生效日期', makeFormDate(INPUT_W, '请选择生效日期'), true));
    // 8. 到期日期（框架合同必填）
    fields.push(makeFormRow('到期日期', makeFormDate(INPUT_W, '请选择到期日期'), true));
    // 9. 合同总金额
    fields.push(makeFormRow('合同总金额', makeFormAmountInput(INPUT_W), true));
    // 10. 结算方式
    fields.push(makeFormRow('结算方式', makeFormSelect(INPUT_W, '请选择结算方式'), true));
    // 11. 付款条款（textarea，选填）
    fields.push(makeFormRowTall('付款条款', makeFormTextarea(INPUT_W, 80, '请输入付款条款说明'), false, 96));
    // 12. 合同附件（upload，选填）
    fields.push(makeFormRowTall('合同附件', makeFormUpload(INPUT_W), false, 80));

    var yPos = FORM_PAD;
    var totalH = 0;
    fields.forEach(function(f) { totalH += f.height; });
    body.resize(DRAWER_W, FORM_PAD + totalH + FORM_PAD);
    fields.forEach(function(f) { f.x = FORM_PAD; f.y = yPos; yPos += f.height; body.appendChild(f); });

    body.x = 0; body.y = DRW_HDR_H;
    drawer.appendChild(body);

    // 底部操作栏（固定底部）
    const footer = figma.createFrame();
    footer.name = 'DrawerFooter'; footer.resize(DRAWER_W, DRW_FTR_H);
    footer.fills = solid(C.white); footer.clipsContent = false;
    footer.appendChild(rect(DRAWER_W, 1, C.black, { a:0.06, x:0, y:0 }));
    const footerBtns = figma.createFrame();
    footerBtns.name = 'FooterBtns'; footerBtns.fills = []; footerBtns.clipsContent = false;
    footerBtns.layoutMode = 'HORIZONTAL';
    footerBtns.primaryAxisSizingMode = 'AUTO'; footerBtns.counterAxisSizingMode = 'AUTO';
    footerBtns.counterAxisAlignItems = 'CENTER'; footerBtns.itemSpacing = 8;
    footerBtns.appendChild(makeBtn('暂存草稿', 'secondary'));
    footerBtns.appendChild(makeBtn('取消', 'secondary'));
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

  // 侧边栏
  const sidebar = makeSidebar(CANVAS_H);
  sidebar.x = 0; sidebar.y = 0;
  root.appendChild(sidebar);

  // 主区域遮罩（半透明黑色）
  const overlay = rect(CANVAS_W - SIDE_W, CANVAS_H, C.black, { a:0.40, x:SIDE_W, y:0 });
  root.appendChild(overlay);

  // 抽屉
  const drawer = buildDrawer();
  drawer.x = CANVAS_W - DRAWER_W; drawer.y = 0;
  root.appendChild(drawer);

  figma.viewport.scrollAndZoomIntoView([root]);
}

buildPage();
