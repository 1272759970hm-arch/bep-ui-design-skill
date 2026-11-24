/**
 * 产物解析：HTML / page.json / Figma Scripter JS
 * 保留行号，保证每个问题都能定位到「文件 + 行 + 选择器」。
 */
import fs from 'node:fs';
import path from 'node:path';

export function loadArtifact(target) {
  const abs = path.resolve(target);
  if (!fs.existsSync(abs)) throw new Error(`目标产物不存在：${abs}`);
  const raw = fs.readFileSync(abs, 'utf8');
  const ext = path.extname(abs).toLowerCase();
  let type = 'unknown';
  if (ext === '.html' || ext === '.htm') type = 'html';
  else if (ext === '.js' || ext === '.mjs') type = 'scripter-js';
  else if (ext === '.json') type = 'page-json';

  const lines = raw.split('\n');
  const lineOf = (offset) => raw.slice(0, offset).split('\n').length;

  const art = {
    abs, raw, type, lines, lineOf,
    cssBlocks: [], rootVars: new Map(), rootVarLines: new Map(),
    inlineStyles: [], tags: [], imgs: [], svgs: [], prdTable: null
  };

  if (type === 'html') parseHtml(art);
  if (type === 'scripter-js') parseJs(art);
  if (type === 'page-json') {
    try { art.json = JSON.parse(raw); } catch (e) { art.jsonError = e.message; }
  }
  return art;
}

function parseHtml(art) {
  const { raw } = art;

  // ---- <style> 块 ----
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  for (const sm of raw.matchAll(styleRe)) {
    const styleContent = sm[1];
    const base = sm.index + sm[0].indexOf(styleContent);
    // 注释用等长空格替换：既不影响 :root 识别，也不破坏任何 offset / 行号定位
    const content = styleContent.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
    const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
    for (const rm of content.matchAll(ruleRe)) {
      const selector = rm[1].trim().replace(/\s+/g, ' ');
      const body = rm[2];
      const ruleOffset = base + rm.index;
      const decls = [];
      const declRe = /([\w-]+)\s*:\s*([^;{}]+)/g;
      for (const dm of body.matchAll(declRe)) {
        decls.push({
          prop: dm[1].trim().toLowerCase(),
          value: dm[2].trim(),
          offset: ruleOffset + rm[1].length + 1 + dm.index,
          line: 0
        });
      }
      for (const d of decls) d.line = art.lineOf(d.offset);
      const block = { selector, body, decls, offset: ruleOffset, end: ruleOffset + rm[0].length, line: art.lineOf(ruleOffset) };
      art.cssBlocks.push(block);

      if (/^:root\b/.test(selector)) {
        for (const d of decls) {
          if (d.prop.startsWith('--')) {
            art.rootVars.set(d.prop, d.value);
            art.rootVarLines.set(d.prop, d.line);
          }
        }
      }
    }
  }

  // ---- 标签、属性、行内样式 ----
  const tagRe = /<([a-zA-Z][\w:-]*)((?:\s+[^>]*?)?)\/?>/g;
  for (const tm of raw.matchAll(tagRe)) {
    const tag = tm[1].toLowerCase();
    const attrText = tm[2] || '';
    const attrs = {};
    for (const am of attrText.matchAll(/([\w:.-]+)\s*=\s*"([^"]*)"/g)) attrs[am[1]] = am[2];
    for (const am of attrText.matchAll(/([\w:.-]+)\s*=\s*'([^']*)'/g)) attrs[am[1]] = am[2];
    const line = art.lineOf(tm.index);
    const rec = { tag, attrs, line, offset: tm.index, text: tm[0], rawAttrs: attrText };
    art.tags.push(rec);

    if (attrs.style) {
      const declRe = /([\w-]+)\s*:\s*([^;]+)/g;
      for (const dm of attrs.style.matchAll(declRe)) {
        art.inlineStyles.push({
          prop: dm[1].trim().toLowerCase(), value: dm[2].trim(),
          line, selector: `${tag}${attrs.class ? '.' + attrs.class.split(/\s+/)[0] : ''}`
        });
      }
    }
    if (tag === 'img' || tag === 'image') {
      art.imgs.push({ src: attrs.src || '', line, alt: attrs.alt || '', attrs });
    }
  }

  // ---- 内联 SVG（用于图标来源校验 R4-06） ----
  const svgRe = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi;
  for (const m of raw.matchAll(svgRe)) {
    const attrs = {};
    for (const am of m[1].matchAll(/([\w:.-]+)\s*=\s*"([^"]*)"/g)) attrs[am[1].toLowerCase()] = am[2];
    const paths = [];
    for (const pm of m[2].matchAll(/\bd\s*=\s*"([^"]+)"/g)) {
      paths.push({ d: pm[1].replace(/\s+/g, ' ').trim(), line: art.lineOf(m.index + m[1].length + pm.index) });
    }
    art.svgs.push({ attrs, paths, line: art.lineOf(m.index), raw: m[0] });
  }

  // ---- PRD 覆盖率核对表（若产物自带） ----
  art.prdTable = /prd-coverage|PRD\s*覆盖率核对表|覆盖率核对表/i.test(raw);
}

function parseJs(art) {
  // Scripter 静态特征：mkF 误用、mkFT、importComponentByKeyAsync、node --check 在 checkers 里跑
  art.jsFeatures = {
    mkFCalls: [...art.raw.matchAll(/\bmkF\s*\(/g)].length,
    mkFTCalls: [...art.raw.matchAll(/\bmkFT\s*\(/g)].length,
    tintCalls: [...art.raw.matchAll(/\btint\s*\(/g)].length,
    imports: [...art.raw.matchAll(/importComponentByKeyAsync\s*\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
    frames: [...art.raw.matchAll(/\bmkF(?:T)?\s*\(\s*['"]([^'"]+)['"]\s*,\s*([\d.]+)\s*,\s*([\d.]+)/g)]
      .map((m) => ({ name: m[1], w: Number(m[2]), h: Number(m[3]) }))
  };
}

export function writeArtifact(art, raw) {
  fs.writeFileSync(art.abs, raw, 'utf8');
  return loadArtifact(art.abs);
}

/** 汇总所有 CSS 声明（含行内），供 Token 类规则扫描 */
export function allDeclarations(art) {
  const out = [];
  for (const b of art.cssBlocks) {
    if (/^:root\b/.test(b.selector)) continue; // :root 单独处理
    for (const d of b.decls) out.push({ ...d, selector: b.selector, origin: 'css' });
  }
  for (const d of art.inlineStyles) out.push({ ...d, offset: 0, origin: 'inline' });
  return out;
}

export const COLOR_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
export const NUM_RE = /(-?\d+(?:\.\d+)?)px\b/g;
