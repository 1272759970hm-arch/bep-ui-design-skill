// Design QA · Scripter JS 静态提取器（零第三方依赖）
// 提取 helper 调用、参数、图标 ID、C 常量引用、技术约束证据。不做执行（执行由 smoke 空跑负责）。

export function extractJs(text) {
  const lineOf = idx => text.slice(0, idx).split('\n').length;

  // helper 调用：捕获标识符 + 括号内首层参数（不解析嵌套，够用于签名/前缀校验）
  const calls = [];
  const callRe = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let m;
  while ((m = callRe.exec(text))) {
    const name = m[1];
    const open = m.index + m[0].length - 1;
    let depth = 0, end = open, inStr = null;
    for (let i = open; i < text.length; i++) {
      const ch = text[i];
      if (inStr) { if (ch === inStr && text[i - 1] !== '\\') inStr = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
      if (ch === '(') depth++;
      else if (ch === ')') { depth--; if (depth === 0) { end = i; break; } }
    }
    calls.push({ name, args: text.slice(open + 1, end).trim(), line: lineOf(m.index), offset: m.index });
  }

  const iconIds = [];
  for (const im of text.matchAll(/['"]((?:solar|lucide|ph|mdi|tabler):[a-z0-9-]+)['"]/g)) {
    iconIds.push({ id: im[1], line: lineOf(im.index), offset: im.index });
  }

  const cRefs = [];
  for (const cm of text.matchAll(/\bC\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
    cRefs.push({ name: cm[1], line: lineOf(cm.index), offset: cm.index });
  }

  const numericLiterals = [];
  for (const nm of text.matchAll(/(?<![\w.])(-?\d+(?:\.\d+)?)\b/g)) {
    numericLiterals.push({ value: parseFloat(nm[1]), line: lineOf(nm.index), offset: nm.index });
  }

  // 技术约束证据
  const tech = {
    hasIIFE: /\(async\s*\(\)\s*=>\s*\{/.test(text),
    fontLoadLine: text.indexOf('loadFontAsync') >= 0 ? lineOf(text.indexOf('loadFontAsync')) : null,
    firstTextLine: (() => { const i = text.search(/\b(characters\s*=|createText\(|mkT\()/); return i >= 0 ? lineOf(i) : null; })(),
    gradientStops: [...text.matchAll(/gradientStops\s*:\s*\[([\s\S]*?)\]/g)].map(g => ({
      line: lineOf(g.index), body: g[1], missingAlpha: /position\s*:\s*[\d.]+\s*,\s*color\s*:\s*\{[^}]*\}(?!\s*,\s*a)/.test(g[1]) && !/a\s*:/.test(g[1]),
    })),
    legacy4ParamTag: [...text.matchAll(/mkTag\([^)]*,\s*(?:true|false)\s*,/g)].map(x => lineOf(x.index)),
    posCalls: calls.filter(c => c.name === 'pos').length,
    definedHelpers: [...text.matchAll(/const\s+(mk[A-Za-z0-9_]+)\s*=/g)].map(x => x[1]),
  };

  return { text, calls, iconIds, cRefs, numericLiterals, tech };
}
