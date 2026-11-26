// Design QA · HTML/CSS 静态提取器（零第三方依赖）
// 只做确定性文本提取：CSS 声明、色值、字号、字重、间距、圆角、阴影、class、交互属性、可见文本。
// 不做渲染；渲染相关一律交给视觉比对（visual-diff.py）或标 BLOCKED。

export function extractHtml(text) {
  const lines = text.split('\n');
  const lineOf = idx => text.slice(0, idx).split('\n').length;

  // ── CSS 声明 ──
  const decls = [];
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = styleRe.exec(text))) {
    const css = sm[1];
    const cssOffset = sm.index + sm[0].indexOf(css);
    // 逐块解析简单 CSS（本 skill 输出无嵌套 @media 复杂度）
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    let bm;
    while ((bm = blockRe.exec(css))) {
      const selector = bm[1].trim().replace(/\s+/g, ' ');
      const body = bm[2];
      const bodyStart = cssOffset + bm.index + bm[0].indexOf(body);
      let cursor = bodyStart;
      for (const part of body.split(';')) {
        const colon = part.indexOf(':');
        if (colon < 0) { cursor += part.length + 1; continue; }
        const prop = part.slice(0, colon).trim().toLowerCase();
        const value = part.slice(colon + 1).trim();
        if (prop && value) decls.push({
          selector, prop, value,
          line: lineOf(cursor + part.indexOf(':')),
          offset: cursor + part.indexOf(':'),
        });
        cursor += part.length + 1;
      }
    }
  }

  // ── 标签 / 属性 ──
  const tags = [];
  const tagRe = /<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g;
  let tm;
  while ((tm = tagRe.exec(text))) {
    const name = tm[1].toLowerCase();
    const attrText = tm[2];
    const attrs = {};
    for (const am of attrText.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      attrs[am[1].toLowerCase()] = am[2] !== undefined ? am[2] : am[3];
    }
    tags.push({ name, attrs, line: lineOf(tm.index), raw: tm[0] });
  }

  // ── 可见文本（去标签、去 script/style）──
  const body = text.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const visible = body.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  // ── 色值 / 数值（全文件，含 inline style 与 SVG）──
  const colors = [];
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)/g)) {
    colors.push({ raw: m[0], line: lineOf(m.index), offset: m.index });
  }

  // ── class 集合 ──
  const classes = new Set();
  for (const t of tags) if (t.attrs.class) for (const c of t.attrs.class.split(/\s+/)) if (c) classes.add(c);

  // ── 交互相关静态证据 ──
  const interaction = {
    disabledSelectors: (text.match(/:disabled\b/g) || []).length,
    activeSelectors: (text.match(/:active\b/g) || []).length,
    hoverSelectors: (text.match(/:hover\b/g) || []).length,
    stateClasses: [...text.matchAll(/class="[^"]*\b(on|active|selected|disabled|checked)\b[^"]*"/g)].length,
    dataState: (text.match(/data-state\s*=|data-status\s*=/g) || []).length,
    forms: tags.filter(t => ['input', 'textarea', 'select'].includes(t.name)).length,
    buttons: tags.filter(t => t.name === 'button' || /\b(addbtn|btn|cta)\b/.test(t.attrs.class || '')).length,
    dialogs: tags.filter(t => /\b(sheet|modal|dialog|popup|mask)\b/.test(t.attrs.class || '')).length,
    paginations: tags.filter(t => /\b(page|pagination|pager)\b/.test(t.attrs.class || '')).length,
    tables: tags.filter(t => t.name === 'table').length,
    selects: tags.filter(t => t.name === 'select').length,
  };

  return { text, lines, decls, tags, colors, visible, classes, interaction };
}

/** 取指定属性的所有声明 */
export const declsOf = (ex, prop) => ex.decls.filter(d => d.prop === prop);
