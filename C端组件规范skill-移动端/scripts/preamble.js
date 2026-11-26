// ─────────────────────────────────────────────────────────────────────
// C 端商城组件规范 → Scripter 标准模板
// 用法：把 (async () => { ... })() 中间的"# 在此填入页面代码"替换为页面布局
// ─────────────────────────────────────────────────────────────────────

(async () => {
  // ─── ① 字体加载 ───
  try {
    await figma.loadFontAsync({ family:'PingFang SC', style:'Regular' });
    await figma.loadFontAsync({ family:'PingFang SC', style:'Medium' });
    await figma.loadFontAsync({ family:'PingFang SC', style:'Semibold' });
  } catch(e) {
    await figma.loadFontAsync({ family:'Inter', style:'Regular' });
    await figma.loadFontAsync({ family:'Inter', style:'Medium' });
    await figma.loadFontAsync({ family:'Inter', style:'Bold' });
  }

  // ─── ② C 端商城 Design Token (RGB 0-1) ── 官方色板（橙色主导） ───
  const C = {
    // 背景
    bg:        { r:.949, g:.953, b:.961 },  // #F2F3F5 灰色背景（终稿变量「背景色」）
    white:     { r:1,    g:1,    b:1    },  // #FFFFFF 白色背景

    // 主色 / 辅色
    primary:   { r:1,    g:.408, b:.082 },  // #FF6815 品牌主色（橙）
    brand2:    { r:.416, g:.294, b:.122 },  // #6A4B1F 品牌辅色（深棕）

    // 功能色
    success:   { r:.067, g:.780, b:.439 },  // #11C770 成功
    warning:   { r:1,    g:.541, b:.114 },  // #FF8A1D 警告/次橙
    danger:    { r:.929, g:.224, b:.169 },  // #ED392B 危险/错误
    info:      { r:.071, g:.749, b:.918 },  // #12BFEA 信息/链接

    // 文字/图标灰阶（终稿设计变量）
    t1:        { r:.149, g:.149, b:.149 },  // #262626 一级文字（主标题）
    t2:        { r:.392, g:.396, b:.4   },  // N7 #646566 主文字2（旧 #666666 作废）
    t3:        { r:.588, g:.592, b:.6   },  // #969799 三级文字（次要文本）
    t4:        { r:.733, g:.733, b:.733 },  // #BBBBBB 引导文本/placeholder
    placeholder:{ r:.784, g:.788, b:.8  },  // #C8C9CC 提示文字（chip/输入描边）
    disabled:  { r:.784, g:.788, b:.8   },  // N5 #C8C9CC 禁用/提示（旧 #CCCCCC 作废）
    divColor:  { r:.922, g:.929, b:.941 },  // #EBEDF0 分割线
    gray2:     { r:.969, g:.973, b:.98  },  // N1 #F7F8FA 内容背景/三级按钮底（旧 #F5F5F5 作废）

    // 分段控件（送货上门 / 到店自提）
    segTextOn: { r:.145, g:.129, b:.122 },  // #25211F 选中文字
    segTextOff:{ r:.392, g:.396, b:.4   },  // #646566 未选文字

    // 点缀 / 权益色
    teal:      { r:0,    g:.765, b:.816 },  // #00C3D0 Accents/Teal
    cream:     { r:1,    g:.894, b:.725 },  // #FFE4B9 奶油字（配深底佣金标签）

    // 装饰/辅助
    tan:       { r:.812, g:.569, b:.412 },  // #CF9169 焦糖色（暖辅色，头像/装饰）

    // 拓展色（浅色底，标签/多层图标）
    chipBg:     { r:1,    g:.965, b:.941 },  // #FFF6F0 规格 chip 选中底（主色 4% 叠白）
    ext_cream:  { r:1,    g:.945, b:.875 },  // #FFF1DF 浅奶油底（配 primary 橙）
    ext_orange: { r:1,    g:.945, b:.875 },  // #FFF1DF 别名，兼容旧代码
    ext_green:  { r:.878, g:.984, b:.933 },  // #E0FBEE 浅绿（配 success）
    ext_blue:   { r:.878, g:.973, b:.996 },  // #E0F8FE 浅蓝（配 info）
    ext_red:    { r:.996, g:.918, b:.918 },  // #FEEAEA 浅红（配 danger）
  };

  // ─── ③ 工具函数 ───
  const pos = (n, x, y) => { if(n){n.x=x; n.y=y;} return n; };
  const vc  = (h, rowH) => Math.round((rowH - h) / 2);
  const cx  = (n, w) => Math.round((w - n.width) / 2);

  // ─── ④ Frame / Rectangle ───
  const mkF = (name, w, h, bg, clip, parent) => {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.clipsContent = clip !== false;
    f.fills = bg ? [{ type:'SOLID', color:bg }] : [];
    if (parent) parent.appendChild(f);
    return f;
  };
  const mkR = (w, h, color, radius, parent) => {
    const r = figma.createRectangle();
    r.resize(w, h); r.fills = [{ type:'SOLID', color }];
    if (radius !== undefined) r.cornerRadius = radius;
    if (parent) parent.appendChild(r);
    return r;
  };

  // ─── ⑤ 单行文字 ───
  const mkT = async (str, sz, weight, color, parent) => {
    const tx = figma.createText();
    tx.fontName = { family:'PingFang SC',
      style: weight>=600?'Semibold':weight>=500?'Medium':'Regular' };
    tx.fontSize = sz;
    tx.textAutoResize = 'WIDTH_AND_HEIGHT';
    tx.characters = String(str);
    tx.fills = [{ type:'SOLID', color }];
    if (parent) parent.appendChild(tx);
    return tx;
  };

  // ─── ⑥ 多行文字（关键 trick：WIDTH_AND_HEIGHT 测真实宽 → 超宽切 HEIGHT 触发重排）───
  const mkTW = async (str, sz, weight, color, maxW, lh, parent) => {
    const tx = figma.createText();
    tx.fontName = { family:'PingFang SC',
      style: weight>=600?'Semibold':weight>=500?'Medium':'Regular' };
    tx.fontSize = sz;
    if (lh) tx.lineHeight = { unit:'PIXELS', value:lh };
    tx.textAutoResize = 'WIDTH_AND_HEIGHT';
    tx.characters = String(str);
    if (tx.width > maxW) {
      tx.textAutoResize = 'HEIGHT';
      tx.resize(maxW, tx.height);
    }
    tx.fills = [{ type:'SOLID', color }];
    if (parent) parent.appendChild(tx);
    return tx;
  };

  // ─── ⑦ 真实图片（picsum.photos 占位）───
  const mkImage = async (url, w, h, radius, parent) => {
    try {
      const data = await figma.createImageAsync(url);
      const rect = figma.createRectangle();
      rect.resize(w, h);
      if (radius !== undefined) rect.cornerRadius = radius;
      rect.fills = [{ type:'IMAGE', imageHash:data.hash, scaleMode:'FILL' }];
      if (parent) parent.appendChild(rect);
      return rect;
    } catch(e) {
      return mkR(w, h, { r:.85, g:.85, b:.85 }, radius, parent);
    }
  };

  // ─── ⑧ 分割线（统一 0.5px 粗，#EBEDF0 = N3）───
  // mkDiv:     359×0.5  左 16 右顶 main 右边  → Cell 内分割
  // mkDivFull: 375×0.5  全宽                  → 区块跨界 (顶栏/底栏)
  // mkCardDiv: 327×0.5  左 16 右顶 card 右边  → 343 宽 Card 内部分区
  // ★ 分割线必须放在父节点内部最后添加，避免被后续白底覆盖（z-order）
  const mkDiv = (parent) => mkR(359, 0.5, C.divColor, undefined, parent);
  const mkDivFull = (parent) => mkR(375, 0.5, C.divColor, undefined, parent);
  const mkCardDiv = (parent) => mkR(327, 0.5, C.divColor, undefined, parent);

  // ─── ⑨ Iconify 图标（Lucide 集合）───
  // ⚠️ 反馈类图标 (success/fail/warning/info) 禁用 lucide，改用 mkFeedbackIcon
  const _iconCache = {};
  const mkIcon = async (iconId, size, color, parent) => {
    const hex = Math.round(color.r*255).toString(16).padStart(2,'0')
              + Math.round(color.g*255).toString(16).padStart(2,'0')
              + Math.round(color.b*255).toString(16).padStart(2,'0');
    const key = iconId + '|' + hex;
    let svgText = _iconCache[key];
    if (!svgText) {
      try {
        const url = 'https://api.iconify.design/' + iconId.replace(':', '/') + '.svg?color=%23' + hex;
        const resp = await fetch(url);
        svgText = await resp.text();
        _iconCache[key] = svgText;
      } catch(e) {
        console.warn('图标加载失败:', iconId);
        return mkR(size, size, C.gray2, 2, parent);
      }
    }
    const node = figma.createNodeFromSvg(svgText);
    node.name = 'Icon/' + iconId;
    node.resize(size, size);
    if (parent) parent.appendChild(node);
    return node;
  };

  // ─── ⑩ 反馈图标 (success/fail/warning/info，自绘 SVG) ───
  // 用法：mkFeedbackIcon('success', 56, parent)
  // 弹窗内 56，inline 提示 24-32
  const mkFeedbackIcon = (type, size, parent) => {
    const svgMap = {
      success: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#11C770"/>
        <path d="M19 32 L28 41 L46 23" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>`,
      fail: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#ED392B"/>
        <path d="M22 22 L42 42 M42 22 L22 42" stroke="white" stroke-width="5" stroke-linecap="round" fill="none"/>
      </svg>`,
      warning: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#FF8A1D"/>
        <rect x="29" y="16" width="6" height="22" rx="3" fill="white"/>
        <circle cx="32" cy="46" r="3.5" fill="white"/>
      </svg>`,
      info: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#12BFEA"/>
        <circle cx="32" cy="20" r="3.5" fill="white"/>
        <rect x="29" y="28" width="6" height="22" rx="3" fill="white"/>
      </svg>`,
    };
    const node = figma.createNodeFromSvg(svgMap[type]);
    node.name = 'FeedbackIcon/' + type;
    if (parent) parent.appendChild(node);
    return node;
  };

  // ─── ⑪ 状态栏图标 (信号 + WiFi + 电池) ───
  const mkStatusBarIcons = async (parent, color) => {
    color = color || { r:0, g:0, b:0 };
    const startX = 375 - 16 - 68;
    const topY = 17;
    const sigH = [3, 5, 7, 9];
    for (let i = 0; i < 4; i++) {
      const bar = mkR(3, sigH[i], color, 1, parent);
      bar.x = startX + i * 4;
      bar.y = topY + (10 - sigH[i]);
    }
    const hex = '#' + Math.round(color.r*255).toString(16).padStart(2,'0')
                    + Math.round(color.g*255).toString(16).padStart(2,'0')
                    + Math.round(color.b*255).toString(16).padStart(2,'0');
    try {
      const svg = '<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C5 0 2.2 1.1 0 2.9l1.5 1.8C3.3 3.3 5.5 2.4 8 2.4s4.7.9 6.5 2.3L16 2.9C13.8 1.1 11 0 8 0zm0 4.7c-1.8 0-3.4.6-4.7 1.7l1.5 1.8c.9-.7 2-1.1 3.2-1.1s2.3.4 3.2 1.1l1.5-1.8C11.4 5.3 9.8 4.7 8 4.7zm0 4.7c-.6 0-1.1.2-1.5.5L8 11l1.5-1.1c-.4-.3-.9-.5-1.5-.5z" fill="' + hex + '"/></svg>';
      const wifi = figma.createNodeFromSvg(svg);
      parent.appendChild(wifi);
      wifi.resize(16, 11);
      wifi.x = startX + 22; wifi.y = topY - 1;
    } catch(e) {}
    const battX = startX + 44;
    const bo = figma.createRectangle();
    bo.resize(24, 11); bo.fills = []; bo.cornerRadius = 3;
    bo.strokes = [{ type:'SOLID', color }]; bo.strokeWeight = 1; bo.opacity = 0.5;
    parent.appendChild(bo); bo.x = battX; bo.y = topY;
    const bf = mkR(18, 7, color, 1.5, parent); bf.x = battX + 2; bf.y = topY + 2;
    const bn = mkR(1.5, 4, color, 0.5, parent); bn.x = battX + 24.5; bn.y = topY + 3.5;
  };

  // ─── ⑫ TopBar 90h (状态栏 + 导航栏) ───
  // cfg: { title?, showBack=true, showMore=true }
  const mkTopBar = async (cfg, parent) => {
    cfg = cfg || {};
    const top = mkF('TopBar', 375, 90, C.white, false, parent);
    pos(top, 0, 0);
    const timeT = await mkT('9:41', 15, 600, C.t1, top);
    pos(timeT, 30, vc(timeT.height, 44));
    await mkStatusBarIcons(top, C.t1);
    if (cfg.showBack !== false) {
      const back = await mkIcon('solar:alt-arrow-left-outline', 24, C.t1, top);
      pos(back, 12, 44 + vc(24, 46));
    }
    if (cfg.title) {
      const navTitle = await mkT(cfg.title, 16, 500, C.t1, top);
      pos(navTitle, cx(navTitle, 375), 44 + vc(navTitle.height, 46));
    }
    if (cfg.showMore !== false) {
      const more = await mkIcon('solar:menu-dots-outline', 22, C.t1, top);
      pos(more, 375 - 16 - 22, 44 + vc(22, 46));
    }
    return top;
  };

  // ─── ⑬ PageHeader (大标题 24Medium + 副信息行 12 + chevron) ───
  // cfg: { title, subtitle?, showSubArrow=true }
  const mkPageHeader = async (cfg, parent) => {
    const pageTitle = await mkT(cfg.title, 24, 500, C.t1, parent);
    pos(pageTitle, 20, 104);
    if (cfg.subtitle) {
      const locRow = mkF('LocationRow', 335, 20, null, false, parent);
      pos(locRow, 20, 144);
      const locText = await mkT(cfg.subtitle, 12, 400, C.t2, locRow);
      pos(locText, 0, vc(locText.height, 20));
      if (cfg.showSubArrow !== false) {
        const locArrow = await mkIcon('solar:alt-arrow-right-outline', 14, C.t3, locRow);
        pos(locArrow, locText.width + 4, vc(14, 20));
      }
    }
  };

  // ─── ⑭ Inset Card (343 宽白底圆角 12，浮于 page bg) ───
  const mkInsetCard = (name, h, parent) => {
    const card = mkF(name, 343, h, C.white, true, parent);
    card.cornerRadius = 12;
    return card;
  };

  // ─── ⑮ Tag (小标签胶囊/圆角，带 plain 描边款) ───
  // ─── ⑮ Tag（语义标签，2026-11-05 规范系统设计实读定稿 104:1869~104:1918）───
  // 骨架统一：h18 / r4 / 左右 pad 4 / 10px PingFang SC（商品标签 Semibold，其余 Medium）
  // 新语法 mkTag(text, 'kind:variant', parent)：
  //   service:green|blue    服务/配送：同色 8% 底 + 0.86px 同色 24% 描边 + 全彩字（代发绿 / 门店蓝）
  //   promo:red|gold        营销：无描边！促销=8%红底 #ED392B 字；会员/专项=#FFF2DF 底 #6A4B1F 字
  //   shop:brand|join       店铺：实心白字无描边。自营/官方=#FF6815；入驻=#D38D61
  //   product:red|gold|blue 商品：渐变实心白字 10px Semibold（新品红橙/爆款橙金/当季蓝），全限 3 组
  //   plain:gray            中性弱提示（倒计时等），非规范标签
  // 旧语法 mkTag(text, colorKey, plain, parent) 兼容保留
  const TAG_SPEC = {
    'service:green': { fill:{ r:.067, g:.78, b:.439, a:.08 }, stroke:{ r:.067, g:.78, b:.439, a:.24 }, text:C.success, w:400 },
    'service:blue':  { fill:{ r:.071, g:.749, b:.918, a:.08 }, stroke:{ r:.071, g:.749, b:.918, a:.24 }, text:C.info, w:400 },
    'promo:red':     { fill:{ r:.929, g:.224, b:.169, a:.08 }, text:C.danger, w:400 },
    'promo:gold':    { fill:C.ext_cream, text:{ r:.416, g:.294, b:.122 }, w:400 },
    'shop:brand':    { fill:C.primary, text:C.white, w:400 },
    'shop:join':     { fill:{ r:.827, g:.553, b:.38 }, text:C.white, w:400 },
    'product:red':   { grad:[{ position:0, color:{ r:1, g:.31, b:.294, a:1 } }, { position:1, color:{ r:1, g:.522, b:.224, a:1 } }], text:C.white, w:600 },
    'product:gold':  { grad:[{ position:0, color:{ r:1, g:.541, b:.114, a:1 } }, { position:1, color:{ r:1, g:.776, b:.114, a:1 } }], text:C.white, w:600 },
    'product:blue':  { grad:[{ position:0, color:{ r:.075, g:.749, b:.918, a:1 } }, { position:1, color:{ r:.349, g:.894, b:.988, a:1 } }], text:C.white, w:600 },
    'plain:gray':    { fill:{ r:.588, g:.592, b:.6, a:.08 }, stroke:{ r:.588, g:.592, b:.6, a:.24 }, text:C.t3, w:400 },
  };
  const mkTag = async (text, spec, a3, a4) => {
    let key = spec, parent = a3;
    if (typeof spec === 'string' && spec.indexOf(':') < 0) {
      // 旧语法兼容：mkTag(text, colorKey, plain, parent)
      parent = a4;
      const legacyMap = { success:'service:green', info:'service:blue', danger:'promo:red',
        warning:'promo:red', primary:'promo:red', default:'plain:gray' };
      key = a3 ? (legacyMap[spec] || 'plain:gray') : (spec === 'primary' ? 'shop:brand' : 'shop:join');
    }
    const s = TAG_SPEC[key] || TAG_SPEC['plain:gray'];
    const tag = mkF('Tag/'+text, 1, 18, null, true, parent);
    tag.cornerRadius = 4;
    if (s.grad) {
      tag.fills = [{ type:'GRADIENT_LINEAR', gradientTransform:[[1,0,0],[0,1,0]], gradientStops:s.grad }];
    } else {
      const f = s.fill;
      // SOLID 色带 alpha 时用 paint opacity 表达，避免非法 color
      if (f && typeof f.a === 'number') {
        tag.fills = [{ type:'SOLID', color:{ r:f.r, g:f.g, b:f.b }, opacity:f.a }];
      } else {
        tag.fills = [{ type:'SOLID', color:f }];
      }
      if (s.stroke) {
        tag.strokes = [{ type:'SOLID', color:{ r:s.stroke.r, g:s.stroke.g, b:s.stroke.b }, opacity:s.stroke.a }];
        tag.strokeWeight = 0.86;
        tag.strokeAlign = 'INSIDE';
      }
    }
    const tx = await mkT(text, 10, s.w, s.text, tag);
    tag.resize(tx.width + 8, 18);
    pos(tx, 4, vc(tx.height, 18));
    return tag;
  };

  // ─── ⑮b TagNameRow（品名首行前挂标签，registry §2 应用规范 1164:2727 实测）───
  // 顺序：商品标签 → 4px → 服务标签 → 4px → 品名首行
  // ⚠️ 标签只与【第一行】文字垂直居中（tag h18 = 行高 18，锁 y0~18），绝不随两行文本块整体居中
  // 品名续行与信息区左缘对齐（不缩进）
  // tags: [{ text, kind }]（kind 用 mkTag 新语法，如 'product:gold' / 'service:green'）
  // lines: ['品名首行', '续行1', ...]（人工断行，保证续行 flush 左）
  // 返回总高（18 × lines.length）
  const mkTagNameRow = async (tags, lines, infoW, parent) => {
    let x = 0;
    for (let i = 0; i < tags.length; i++) {
      const tag = await mkTag(tags[i].text, tags[i].kind, parent);
      pos(tag, x, 0);                       // tag h18 = 行高 18，首行垂直居中
      x += tag.width + 4;
    }
    for (let j = 0; j < lines.length; j++) {
      const ln = await mkT(lines[j], 13, 600, C.t1, parent);
      if (j === 0) {
        ln.textAutoResize = 'NONE';
        ln.resize(Math.max(infoW - x, 40), 18);
        pos(ln, x, 0);
      } else {
        pos(ln, 0, j * 18);
      }
    }
    return lines.length * 18;
  };

  // ─── ⑯ SelTag (规格 chip，终稿 §4.3：描边款 34h / radius 18 / 12pt) ───
  // 选中：底 #FFF6F0 + 描边 主色 0.5px + 橙字 Semibold；未选：白底 + 描边 #C8C9CC + 深字 Regular
  const mkSelTag = async (text, selected, parent) => {
    const tag = mkF('SelTag/'+text, 1, 34, selected ? C.chipBg : C.white, true, parent);
    tag.cornerRadius = 18;
    tag.strokes = [{ type:'SOLID', color:selected ? C.primary : C.placeholder }];
    tag.strokeWeight = 0.5;
    tag.strokeAlign = 'INSIDE';
    const tx = await mkT(text, 12, selected ? 500 : 400, selected ? C.primary : C.t1, tag);
    tag.resize(tx.width + 27, 34);
    pos(tx, 13.5, vc(tx.height, 34));
    return tag;
  };

  // ─── ⑰ TagGroup (流式 chip 布局，自动换行，行距 12) ───
  // tags: [{ text, selected }], 返回总高度
  const mkTagGroup = async (tags, maxW, parent) => {
    let x = 0, y = 0;
    const gap = 8, rowGap = 12;
    for (let i = 0; i < tags.length; i++) {
      const tag = await mkSelTag(tags[i].text, tags[i].selected, parent);
      if (x > 0 && x + tag.width > maxW) {
        x = 0; y += 34 + rowGap;
      }
      pos(tag, x, y);
      x += tag.width + gap;
    }
    return y + 34;
  };

  // ─── ⑰a DuoTag (双段胶囊，终稿实测：预估佣金 标签) ───
  // 左段 #333333 深底 + 奶油字 #FFE4B9 10pt；右段 #FFF1DF 浅底 + 深字 10pt Medium
  // 高 14.5→15，radius 2。例：mkDuoTag('预估佣金', '¥5.2', parent)
  const mkDuoTag = async (label, value, parent) => {
    const wrap = mkF('DuoTag/' + label, 1, 15, null, false, parent);
    const left = mkF('DuoL', 1, 15, { r:.2, g:.2, b:.2 }, true, wrap);   // #333333 实测
    const right = mkF('DuoR', 1, 15, C.ext_cream, true, wrap);          // #FFF1DF
    left.cornerRadius = 2; right.cornerRadius = 2;
    const lt = await mkT(label, 10, 400, C.cream, left);
    pos(lt, 3, vc(lt.height, 15));
    left.resize(Math.max(lt.width + 6, 40), 15);
    const rt = await mkT(value, 10, 500, { r:.067, g:.067, b:.067 }, right);  // #111
    pos(rt, 4, vc(rt.height, 15));
    right.resize(rt.width + 8, 15);
    pos(left, 0, 0);
    pos(right, left.width, 0);
    wrap.resize(left.width + right.width, 15);
    return wrap;
  };

  // ─── ⑰a-2 FilterTab（快捷筛选 Tabs，2026-11-05 实读 1:6155 白底版 / 1:6868 灰底版）───
  // h28 / r16 胶囊 / 左右 pad 11 / 12px；选中 Semibold 主色。按页面底色选变体：
  //   pageBg='white'（白底页面）：未选 #F7F8FA 灰底无边框；选中 橙10%底无边框
  //   pageBg='gray'（灰底页面）：未选 纯白无边框；选中 白底 + #F86B1D 0.5px 描边
  const mkFilterTab = async (text, selected, pageBg, parent) => {
    const tag = mkF('FilterTab/'+text, 1, 28, null, true, parent);
    tag.cornerRadius = 16;
    if (selected && pageBg === 'gray') {
      tag.fills = [{ type:'SOLID', color:C.white }];
      tag.strokes = [{ type:'SOLID', color:{ r:.973, g:.42, b:.114 } }];  // #F86B1D
      tag.strokeWeight = 0.5;
      tag.strokeAlign = 'INSIDE';
    } else if (selected) {
      tag.fills = [{ type:'SOLID', color:C.primary, opacity:0.1 }];
    } else {
      tag.fills = [{ type:'SOLID', color: pageBg === 'gray' ? C.white : { r:.969, g:.973, b:.98 } }];  // #F7F8FA
    }
    const tx = await mkT(text, 12, selected ? 600 : 400, selected ? C.primary : C.t1, tag);
    tag.resize(tx.width + 22, 28);
    pos(tx, 11, vc(tx.height, 28));
    return tag;
  };

  // ─── ⑰b Check (复选/单选，20×20，终稿 registry §7) ───
  const mkCheck = (checked, parent, size) => {
    const s = size || 20;
    const box = mkF('Check', s, s, checked ? C.primary : C.white, false, parent);
    box.cornerRadius = s / 2;
    if (!checked) {
      box.strokes = [{ type:'SOLID', color:C.placeholder }];
      box.strokeWeight = 0.5;
      box.strokeAlign = 'INSIDE';
    } else {
      const svg = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M5 10.5 L8.5 14 L15 6.5" stroke="white" stroke-width="2" stroke-linecap="round" '
        + 'stroke-linejoin="round" fill="none"/></svg>';
      const chk = figma.createNodeFromSvg(svg);
      chk.name = 'CheckMark';
      box.appendChild(chk);
      chk.x = 0; chk.y = 0;
    }
    return box;
  };

  // ─── ⑰c Stepper (数量步进器，79×27，终稿 registry §4.4) ───
  const mkStepper = async (value, parent) => {
    const box = mkF('Stepper', 79, 27, C.gray2, true, parent);
    box.cornerRadius = 4;
    const icons = ['solar:minus-outline', 'solar:add-outline'];
    const xs = [0, 54];
    for (let i = 0; i < 2; i++) {
      const cell = mkF('StepBtn', 25, 27, null, true, box);
      pos(cell, xs[i], 0);
      const ic = await mkIcon(icons[i], 14, i === 0 && value <= 1 ? C.disabled : C.t1, cell);
      pos(ic, 5.5, 6.5);
    }
    const vt = await mkT(String(value), 13, 500, C.t1, box);
    pos(vt, 25 + (29 - vt.width) / 2, vc(vt.height, 27));
    return box;
  };

  // ─── ⑰d Seg (分段控件，375×50 两段，终稿 registry §4.5) ───
  const mkSeg = async (items, activeIndex, parent) => {
    const wrap = mkF('Segmented', 375, 50, C.bg, true, parent);
    const w = 375 / items.length;
    for (let i = 0; i < items.length; i++) {
      const on = i === activeIndex;
      const cell = mkF('Seg/' + items[i], w, 50, on ? C.white : C.bg, true, wrap);
      pos(cell, i * w, 0);
      if (on) {
        cell.cornerRadius = i === 0 ? 9 : 13;
      }
      const tx = await mkT(items[i], 14, on ? 600 : 400, on ? C.segTextOn : C.segTextOff, cell);
      pos(tx, cx(tx, w), vc(tx.height, 50));
    }
    return wrap;
  };

  // ─── ⑰e Btn (单个按钮，40h pill，终稿 registry §4.1) ───
  // type: 'outline' 次要（主色描边） | 'primary' 主要 | 'default' 灰底 | 'danger'
  // ─── ⑱ Btn（按钮组件，registry §4；**纯文字**，禁止 icon+文字组合）───
  // mkBtn(text, type, w, parent)       → 标准款 h40 / 15pt Semibold（Figma「按钮/加入购物车·立即购买」106×40 实测）
  // mkBtn(text, type, w, h, parent)    → 紧凑款 h34（121×34 / 90×34 变体）/ 列表卡内加购 h26（等比缩放款）
  // type: outline（白底+主色0.5px描边+主色字）| primary（主色底白字）| default（灰底深字）| danger（红底白字）
  const mkBtn = async (text, type, w, a4, a5) => {
    let h = 40, parent = a4;
    if (typeof a4 === 'number') { h = a4; parent = a5; }
    const p = {
      outline: { bg:C.white,   fg:C.primary, stroke:true },
      primary: { bg:C.primary, fg:C.white,   stroke:false },
      default: { bg:C.gray2,   fg:C.t1,      stroke:false },
      danger:  { bg:C.danger,  fg:C.white,   stroke:false },
    }[type || 'primary'];
    const btn = mkF('Btn/' + text, w || 106, h, p.bg, true, parent);
    btn.cornerRadius = h / 2;
    if (p.stroke) {
      btn.strokes = [{ type:'SOLID', color:C.primary }];
      btn.strokeWeight = 0.5;
      btn.strokeAlign = 'INSIDE';
    }
    // 字号随高度：40h=15pt Semibold（实测）；34h/26h=13pt Medium（紧凑款推断值，Figma 打开后复核）
    const fs = h >= 40 ? 15 : 13;
    const fw = h >= 40 ? 600 : 500;
    const tx = await mkT(text, fs, fw, p.fg, btn);
    pos(tx, cx(tx, btn.width), vc(tx.height, h));
    return btn;
  };

  // ─── ⑰f AddBtn（商品流加购圆钮，registry §4.9；2026-11-06 Figma 1:6053 实测定稿）───
  // 18×18 橙实心圆 + 白「+」10.9×11（笔画粗 2.23，几乎撑满圆）。**纯图标组件，无文字**。
  // ⚠️ 加号是【全圆角胶囊臂】——用 rect rx=笔画/2 实现，禁用 stroke-linecap（圆头会超出 viewBox 被裁成平头），
  //    也禁用 solar:add-outline 缩放（笔画稀释到 <1px）
  const mkAddBtn = async (parent) => {
    const svg = '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">'
      + '<circle cx="9" cy="9" r="9" fill="#FF6815"/>'
      + '<rect x="7.885" y="3.5" width="2.23" height="11" rx="1.115" fill="#FFFFFF"/>'
      + '<rect x="3.5" y="7.885" width="11" height="2.23" rx="1.115" fill="#FFFFFF"/></svg>';
    const node = figma.createNodeFromSvg(svg);
    node.name = 'AddBtn';
    parent.appendChild(node);
    pos(node, 0, 0);
    return node;
  };

  // ─── ⑱ Textarea (多行输入，可选计数 + 上传 tile) ───
  // cfg: { width, height, placeholder, showCounter, counterText, showUpload, uploadText }
  const mkTextarea = async (cfg, parent) => {
    const ta = mkF('Textarea', cfg.width, cfg.height, C.gray2, true, parent);
    ta.cornerRadius = 8;
    const ph = await mkT(cfg.placeholder, 14, 400, C.t4, ta);
    pos(ph, 12, 12);
    if (cfg.showUpload) {
      const tile = mkF('UploadTile', 64, 64, C.white, true, ta);
      tile.cornerRadius = 4;
      tile.strokes = [{ type:'SOLID', color:C.t4 }];
      tile.strokeWeight = 1;
      tile.dashPattern = [4, 4];
      const plus = await mkIcon('solar:add-outline', 20, C.t3, tile);
      pos(plus, cx({width:20}, 64), 14);
      const cnt = await mkT(cfg.uploadText || '0/4', 11, 400, C.t3, tile);
      pos(cnt, cx(cnt, 64), 40);
      pos(tile, 12, cfg.height - 12 - 64);
    }
    if (cfg.showCounter) {
      const counter = await mkT(cfg.counterText || '0/200', 12, 400, C.t3, ta);
      pos(counter, cfg.width - 12 - counter.width, cfg.height - 12 - counter.height);
    }
    return ta;
  };

  // ─── ⑲ Switch (iOS 风开关 50×30) ───
  const mkSwitch = (on, parent) => {
    const sw = mkF('Switch/'+(on?'on':'off'), 50, 30, on ? C.primary : C.disabled, true, parent);
    sw.cornerRadius = 15;
    const knob = figma.createEllipse();
    knob.resize(26, 26);
    knob.fills = [{ type:'SOLID', color:C.white }];
    knob.effects = [{
      type:'DROP_SHADOW', color:{ r:0, g:0, b:0, a:.15 },
      offset:{ x:0, y:1 }, radius:3, spread:0,
      visible:true, blendMode:'NORMAL',
    }];
    sw.appendChild(knob);
    knob.x = on ? 22 : 2; knob.y = 2;
    return sw;
  };

  // ─── ⑳ CellRow (带可选右箭头 + 底部分割线) ───
  const mkCellRow = async (title, value, showArrow, withDivider, parent) => {
    const row = mkF('Cell/'+title, 375, 50, C.white, true, parent);
    const tt = await mkT(title, 14, 400, C.t1, row);
    pos(tt, 16, vc(tt.height, 50));
    let arrowSpace = 0;
    if (showArrow) {
      const ar = await mkIcon('solar:alt-arrow-right-outline', 16, C.t4, row);
      pos(ar, 375 - 16 - 16, vc(16, 50));
      arrowSpace = 16 + 4;
    }
    if (value) {
      const vt = await mkT(value, 14, 400, C.t2, row);
      pos(vt, 375 - 16 - arrowSpace - vt.width, vc(vt.height, 50));
    }
    if (withDivider) pos(mkDiv(row), 16, 49.5);
    return row;
  };

  // ─── ㉑ BottomActionBar (白底 + 顶部分割线 + 可选热线 + 按钮组) ───
  // cfg: {
  //   height: 92|110|130,
  //   hotline: { prefix, num } | null,
  //   buttons: [{ text, type, width? }]   type: 'default'|'outline'|'primary'|'danger'
  //   buttonHeight?: 40 (默认，终稿 §4.1)
  // }
  const mkBottomActionBar = async (cfg, parent) => {
    const wrap = mkF('BottomWrap', 375, cfg.height, C.white, true, parent);
    pos(mkDivFull(wrap), 0, 0);
    let contentY = 14;
    if (cfg.hotline) {
      const pre = await mkT(cfg.hotline.prefix, 12, 400, C.t2, wrap);
      const num = await mkT(cfg.hotline.num, 12, 500, C.primary, wrap);
      const totalW = pre.width + num.width;
      pos(pre, (375 - totalW) / 2, 14);
      pos(num, (375 - totalW) / 2 + pre.width, 14);
      contentY = 46;
    }
    if (cfg.buttons && cfg.buttons.length) {
      // 终稿 §4.1：双按钮 106×40，radius 20(pill)，15pt Semibold；主次必须可分
      const btnH = cfg.buttonHeight || 40, btnGap = 8;
      let totalFixedW = 0, flexCount = 0;
      cfg.buttons.forEach(b => { if (b.width) totalFixedW += b.width; else flexCount++; });
      const flexW = flexCount > 0 ? (343 - totalFixedW - btnGap * (cfg.buttons.length - 1)) / flexCount : 0;
      let cursorX = 16;
      for (let i = 0; i < cfg.buttons.length; i++) {
        const b = cfg.buttons[i];
        const palette = {
          default: { bg:C.gray2,   fg:C.t1,    weight:400, stroke:false },
          outline: { bg:C.white,   fg:C.primary, weight:600, stroke:true },
          primary: { bg:C.primary, fg:C.white, weight:600, stroke:false },
          danger:  { bg:C.danger,  fg:C.white, weight:600, stroke:false },
        }[b.type || 'default'];
        const w = b.width || flexW;
        const btn = mkF('Btn/'+b.text, w, btnH, palette.bg, true, wrap);
        pos(btn, cursorX, contentY);
        btn.cornerRadius = btnH / 2;
        if (palette.stroke) {
          btn.strokes = [{ type:'SOLID', color:C.primary }];
          btn.strokeWeight = 0.5;
          btn.strokeAlign = 'INSIDE';
        }
        const tx = await mkT(b.text, 15, palette.weight, palette.fg, btn);
        pos(tx, cx(tx, w), vc(tx.height, btnH));
        cursorX += w + btnGap;
      }
    }
    return wrap;
  };

  // ─── ㉒ Dialog 弹窗 ───
  // cfg: {
  //   icon: 'success'|'fail'|'warning'|'info' | null,
  //   iconSize: 56,
  //   title: string,           // 主标题（与 icon 同色）
  //   subtitle: string | null, // 副标题（深字 18 Medium）
  //   message: string,
  //   buttons: [{ text, type }]   type: 'default'|'primary'|'danger'
  // }
  // 返回 dialog 节点；外部自己加 backdrop + 居中定位
  const mkDialog = async (cfg, parent) => {
    const dW = 320, dPad = 24, innerW = dW - dPad * 2;
    const dialog = mkF('Dialog/'+(cfg.title || 'dialog'), dW, 100, C.white, true, parent);
    dialog.cornerRadius = 16;
    dialog.effects = [{
      type:'DROP_SHADOW', color:{ r:0, g:0, b:0, a:.08 },
      offset:{ x:0, y:8 }, radius:32, spread:0,
      visible:true, blendMode:'NORMAL',
    }];

    let y = dPad;
    if (cfg.icon) {
      const sz = cfg.iconSize || 56;
      const ic = mkFeedbackIcon(cfg.icon, sz, dialog);
      pos(ic, cx({ width:sz }, dW), y);
      y += sz + 12;
    }
    if (cfg.title) {
      const colorMap = { success:C.success, fail:C.danger, warning:C.warning, info:C.primary };
      const titleColor = cfg.icon ? (colorMap[cfg.icon] || C.t1) : C.t1;
      const t = await mkT(cfg.title, 20, 500, titleColor, dialog);
      pos(t, cx(t, dW), y);
      y += t.height + (cfg.subtitle ? 20 : 16);
    }
    if (cfg.subtitle) {
      const st = await mkT(cfg.subtitle, 18, 500, C.t1, dialog);
      pos(st, cx(st, dW), y);
      y += st.height + 12;
    }
    if (cfg.message) {
      const m = await mkTW(cfg.message, 14, 400, C.t2, innerW, 22, dialog);
      m.textAlignHorizontal = 'CENTER';
      pos(m, dPad, y);
      y += m.height + 24;
    }
    if (cfg.buttons && cfg.buttons.length) {
      // 终稿 registry §4.1/§4.7：40h / 15pt / Semibold
      const btnH = 40, btnGap = 10;
      for (let i = 0; i < cfg.buttons.length; i++) {
        const b = cfg.buttons[i];
        const palette = {
          default: { bg:C.gray2,   fg:C.t1,    weight:400 },
          outline: { bg:C.white,   fg:C.primary, weight:600 },
          primary: { bg:C.primary, fg:C.white, weight:600 },
          danger:  { bg:C.danger,  fg:C.white, weight:600 },
        }[b.type || 'default'];
        const btn = mkF('Btn/'+b.text, innerW, btnH, palette.bg, true, dialog);
        pos(btn, dPad, y);
        btn.cornerRadius = btnH / 2;
        if (b.type === 'outline') {
          btn.strokes = [{ type:'SOLID', color:C.primary }];
          btn.strokeWeight = 0.5;
          btn.strokeAlign = 'INSIDE';
        }
        const tx = await mkT(b.text, 15, palette.weight, palette.fg, btn);
        pos(tx, cx(tx, innerW), vc(tx.height, btnH));
        y += btnH + (i < cfg.buttons.length - 1 ? btnGap : 0);
      }
    }
    y += dPad;
    dialog.resize(dW, y);
    return dialog;
  };

  // ─── ㉓ Backdrop (弹窗遮罩，全屏 50% 黑) ───
  const mkBackdrop = (parent) => {
    const bd = mkF('Backdrop', 375, 812, null, true, parent);
    pos(bd, 0, 0);
    bd.fills = [{ type:'SOLID', color:{ r:0, g:0, b:0 }, opacity:0.5 }];
    return bd;
  };

  const pg = figma.currentPage;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  # 在此填入页面代码
  //
  //  典型表单页骨架：
  //    const main = mkF('商城/页面名', 375, 990, C.bg, true, pg);
  //    await mkTopBar({ showMore:true }, main);
  //    await mkPageHeader({ title:'公共区域报修', subtitle:'凤凰会...' }, main);
  //    const card1 = mkInsetCard('Card/问题1', 308, main); pos(card1, 16, 186);
  //    // ...
  //    const bottomWrap = await mkBottomActionBar({
  //      height: 130,
  //      hotline: { prefix:'24小时热线 ', num:'4009-688-888' },
  //      buttons: [
  //        { text:'历史记录', type:'default', width:116 },
  //        { text:'提交',     type:'primary' },   // flex 充满剩余
  //      ],
  //    }, main);
  //    pos(bottomWrap, 0, 990 - 130);
  //
  //  典型弹窗骨架：
  //    mkBackdrop(main);
  //    const dialog = await mkDialog({
  //      icon:'success', title:'提交成功',
  //      subtitle:'紧急情况确认',
  //      message:'系统检测到您描述的情况可能较为紧急，请问该情况是否正在发生？',
  //      buttons:[
  //        { text:'不是正在发生', type:'default' },
  //        { text:'正在发生',     type:'danger' },
  //      ],
  //    }, main);
  //    pos(dialog, (375-320)/2, (812-dialog.height)/2 - 30);
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ─── 收尾：定位到刚生成的顶层 Frame ───
  try {
    const _roots = figma.currentPage.children;
    if (_roots && _roots.length) {
      figma.viewport.scrollAndZoomIntoView([_roots[_roots.length - 1]]);
    }
    figma.notify('✅ 页面生成完成', { timeout: 4000 });
  } catch (e) {
    console.warn('收尾定位跳过:', e && e.message);
  }
})();
