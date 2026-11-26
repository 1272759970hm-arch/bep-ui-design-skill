/**
 * 真值源加载器
 * 唯一校验依据 = 本 Skill 既有文件。任何真值源缺失都显式返回 missing，
 * 由状态机把依赖它的规则判为 BLOCKED，绝不假装完成校验。
 */
import fs from 'node:fs';
import path from 'node:path';

const JSON_SOURCES = new Set([
  'tokens', 'registry', 'missing', 'conflicts', 'externalStandards', 'pageSchema', 'iconLibrary'
]);
const TEXT_SOURCES = new Set(['constraints', 'htmlPrototype', 'prdSpec']);

export function normalizeColor(v) {
  if (typeof v !== 'string') return null;
  const s = v.trim().toLowerCase().replace(/\s+/g, '');
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(s)) return s;
  if (/^rgba?\(/.test(s)) return s;
  return null;
}

/** 颜色规范化：#fff→#ffffff、rgba(...,.1)→rgba(...,0.1)、去掉空格，便于精确比对 */
export function canonColor(v) {
  if (v === null || v === undefined) return null;
  let s = String(v).trim().toLowerCase().replace(/\s+/g, '');
  let m = s.match(/^#([0-9a-f]{3})$/);
  if (m) return '#' + m[1].split('').map((c) => c + c).join('');
  if (/^#([0-9a-f]{6}|[0-9a-f]{8})$/.test(s)) return s;
  m = s.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const p = m[1].split(',').map((x) => parseFloat(x));
    if (p.some((x) => Number.isNaN(x))) return null;
    const body = p.map((x, i) => (i < 3 ? String(Math.round(x)) : String(Number(x.toFixed(4))))).join(',');
    return `${p.length > 3 ? 'rgba' : 'rgb'}(${body})`;
  }
  return null;
}

/** 取出颜色的 RGB 三元组（忽略透明度），用于判断是否为 Token 允许的派生 tint */
export function colorRGB(v) {
  const c = canonColor(v);
  if (!c) return null;
  if (c.startsWith('#')) {
    const h = c.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',');
  }
  const m = c.match(/^rgba?\(([^)]*)\)$/);
  if (!m) return null;
  return m[1].split(',').slice(0, 3).join(',');
}

function walkValues(node, acc, keyPath = '') {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) {
    for (const v of node) {
      if (typeof v === 'number') acc.numbers.add(v);
      else walkValues(v, acc, keyPath);
    }
    return;
  }
  if (typeof node === 'number') { acc.numbers.add(node); return; }
  if (typeof node === 'string') {
    const c = normalizeColor(node);
    if (c) acc.colors.add(c);
    const m = node.match(/^(\d+(?:\.\d+)?)px$/);
    if (m) acc.numbers.add(Number(m[1]));
    return;
  }
  if (typeof node === 'object') {
    if ('value' in node) walkValues(node.value, acc, keyPath);
    for (const [k, v] of Object.entries(node)) {
      if (k === 'value' || k === 'note' || k === 'source' || k === 'status') continue;
      if (k === 'aiProposedExtra') continue; // AI 建议值不是正式规范，不能当校验依据
      walkValues(v, acc, keyPath ? `${keyPath}.${k}` : k);
    }
  }
}

/** 英文词签名（词序无关）：「Primary Button」与「Button / Primary」都归一为 buttonprimary */
export function enSig(s) {
  const toks = String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length >= 2);
  return toks.length ? toks.sort().join('') : null;
}

export function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\s/（）()·_\-—]/g, '')
    .replace(/组件$/, '');
}

/** 组件名别名：全名 + 去括号头 + 逐词，解决「提示横幅 Alert Banner」vs「提示横幅 Alert Banner（页面内嵌式…）」这类对不上 */
function addAliases(map, name, value) {
  const n = String(name || '');
  if (!n) return;
  const keys = new Set([normalizeName(n), normalizeName(n.split(/（|\(/)[0])]);
  for (const t of n.split(/[\s/·、，,（）()\-—]+/)) {
    if (t && t.length >= 2) keys.add(normalizeName(t));
  }
  for (const k of keys) if (k && !map.has(k)) map.set(k, value);
}

export function loadEvidence(config, skillRoot) {
  const data = {};
  const missing = [];
  const used = [];

  for (const [key, rel] of Object.entries(config.truthSources)) {
    const abs = path.resolve(skillRoot, rel);
    if (!fs.existsSync(abs)) {
      data[key] = null;
      missing.push({ key, path: abs });
      continue;
    }
    used.push(key);
    try {
      if (JSON_SOURCES.has(key)) data[key] = JSON.parse(fs.readFileSync(abs, 'utf8'));
      else if (TEXT_SOURCES.has(key)) data[key] = fs.readFileSync(abs, 'utf8');
      else data[key] = { files: fs.readdirSync(abs).filter((f) => !f.startsWith('.')) , path: abs };
    } catch (e) {
      data[key] = null;
      missing.push({ key, path: abs, error: e.message });
      used.pop();
    }
  }

  // ---- 从 design-tokens.json 抽取合法值域 ----
  const acc = { colors: new Set(), numbers: new Set() };
  if (data.tokens) {
    for (const section of ['color', 'typography', 'spacing', 'radius', 'componentSize', 'icon']) {
      if (data.tokens[section]) walkValues(data.tokens[section], acc, section);
    }
  }
  const tokens = {
    colors: acc.colors,
    colorsCanon: new Set([...acc.colors].map(canonColor).filter(Boolean)),
    colorsRGB: new Set([...acc.colors].map(colorRGB).filter(Boolean)),
    numbers: acc.numbers,
    fontSizes: new Set(
      (data.tokens?.typography?.['font.size']?.value || []).map(Number)
    ),
    fontSizesCare: new Set(
      (data.tokens?.typography?.['font.size.careMode']?.value || []).map(Number)
    ),
    fontWeights: new Set(
      (data.tokens?.typography?.['font.weight']?.value || []).map((s) => String(s).toLowerCase())
    ),
    radii: new Set(
      Object.values(data.tokens?.radius || {})
        .map((v) => v?.value)
        .filter((v) => typeof v === 'number')
    ),
    lineHeightRatio: data.tokens?.typography?.['font.lineHeight.ratio']?.value ?? null,
    raw: data.tokens
  };
  // 品牌 tint 三档真值（用于标签档位校验）
  const colorSection = data.tokens?.color || {};
  tokens.brandTint10 = colorSection['color.brand.tint10']?.value || null;
  tokens.brandTint14 = colorSection['color.brand.tint14']?.value || null;
  tokens.brandTint16 = colorSection['color.brand.tint16']?.value || null;
  tokens.tagNeutral = colorSection['color.tag.neutral']?.value || null;
  tokens.brand = colorSection['color.brand.1']?.value || null;
  // shadow.overlay.mask 是 FOUND_IN_FIGMA 的「#000000 60%透明度」描述型 Token，
  // 允许黑色系 alpha 派生（遮罩 / Toast 底），但不把任意黑色当官方色。
  if (data.tokens?.shadow?.['overlay.mask']) {
    tokens.colorsRGB.add('0,0,0');
    tokens.maskToken = data.tokens.shadow['overlay.mask'].value;
  }

  // ---- 组件库索引 ----
  const registry = {
    byName: new Map(),
    byNorm: new Map(),
    alias: new Map(),
    en: new Map(),
    entries: data.registry?.components || [],
    statuses: new Map()
  };
  for (const c of registry.entries) {
    registry.byName.set(c.name, c);
    registry.byName.set(c.nameEn, c);
    registry.byNorm.set(normalizeName(c.name), c);
    registry.byNorm.set(normalizeName(c.nameEn), c);
    registry.statuses.set(c.name, c.status);
    addAliases(registry.alias, c.name, c);
    addAliases(registry.alias, c.nameEn, c);
    const sig = enSig(c.name) || enSig(c.nameEn);
    if (sig && !registry.en.has(sig)) registry.en.set(sig, c);
  }

  const missingComponents = {
    names: new Set((data.missing?.items || []).map((i) => i.name)),
    norm: new Set(),
    en: new Set(),
    items: data.missing?.items || []
  };
  for (const i of missingComponents.items) {
    const tmp = new Map();
    addAliases(tmp, i.name, true);
    for (const k of tmp.keys()) missingComponents.norm.add(k);
    const sig = enSig(i.name);
    if (sig) missingComponents.en.add(sig);
  }

  // ---- 可执行约束 C-xx ----
  const constraints = [];
  if (data.constraints) {
    for (const line of data.constraints.split('\n')) {
      const m = line.match(/^\|\s*(C-\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(P[012])\s*\|/);
      if (m) constraints.push({ id: m[1], text: m[2], how: m[3], severity: m[4] });
    }
  }
  const byConstraint = new Map(constraints.map((c) => [c.id, c]));

  // ---- html-prototype 的 12 条交互契约 ----
  const contracts = new Set();
  if (data.htmlPrototype) {
    for (const m of data.htmlPrototype.matchAll(/\|\s*`([^`]+)`\s*\|/g)) {
      const t = m[1].trim();
      if (t.startsWith('data-')) contracts.add(t);
    }
    // 契约表里 data-sheet-open / -close 是合并写法，展开
    if (contracts.has('data-sheet-open / -close="id"')) {
      contracts.delete('data-sheet-open / -close="id"');
      contracts.add('data-sheet-open="id"');
      contracts.add('data-sheet-close="id"');
    }
  }
  for (const base of [
    'data-screen="id"', 'data-screen-go="id"', 'data-back',
    'data-sheet-open="id"', 'data-sheet-close="id"', 'data-mask="id"',
    'data-toast="文案"', 'data-order / data-id', 'data-active="true"',
    'data-open="false"', 'data-bep-status', 'data-bep-component'
  ]) contracts.add(base);

  // ---- 已知规范冲突 ----
  const conflicts = data.conflicts?.conflicts || [];
  const external = data.externalStandards || null;

  return {
    data, used, missing,
    availableSources: used,
    tokens, registry, missingComponents,
    constraints, byConstraint, contracts, conflicts, external,
    emptyAssets: data.emptyAssets || null
  };
}
