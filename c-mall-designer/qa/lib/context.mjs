// Design QA · 校验依据加载器
// 唯一依据 = skill 自身的 tokens.md / component-registry.md / preamble.js / CHANGELOG.md
// 依据文件缺失时明确记录，规则模块据此输出 BLOCKED，绝不假装校验完成。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SKILL_ROOT = path.resolve(HERE, '..', '..');

const SOURCES = {
  tokens: 'references/tokens.md',
  registry: 'references/component-registry.md',
  preamble: 'scripts/preamble.js',
  changelog: 'CHANGELOG.md',
  skill: 'SKILL.md',
};

function readSafe(rel) {
  const abs = path.join(SKILL_ROOT, rel);
  try { return { text: fs.readFileSync(abs, 'utf8'), abs, ok: true }; }
  catch (e) { return { text: '', abs, ok: false, error: e.message }; }
}

const hexRe = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const normHex = h => h.toUpperCase();

export function loadContext() {
  const files = {};
  const missing = [];
  for (const [k, rel] of Object.entries(SOURCES)) {
    const r = readSafe(rel);
    files[k] = r;
    if (!r.ok) missing.push(rel);
  }

  const tokensText = files.tokens.ok ? files.tokens.text : '';
  const registryText = files.registry.ok ? files.registry.text : '';
  const preambleText = files.preamble.ok ? files.preamble.text : '';

  // ① 允许色值 = tokens.md 与 registry 中实读到的全部 Hex + preamble C 常量换算的 Hex
  const hexSet = new Set();
  for (const t of [tokensText, registryText]) {
    for (const m of t.matchAll(hexRe)) hexSet.add(normHex(m[0]));
  }
  // C 常量（RGB 0-1）→ Hex，作为 JavaScript 侧的合法色
  const cConst = new Map();
  for (const m of preambleText.matchAll(/^\s{4}([A-Za-z_][A-Za-z0-9_]*):\s*\{\s*r:([\d.]+),\s*g:([\d.]+),\s*b:([\d.]+)\s*\}/gm)) {
    const to255 = v => Math.round(parseFloat(v) * 255).toString(16).padStart(2, '0');
    const hex = ('#' + to255(m[2]) + to255(m[3]) + to255(m[4])).toUpperCase();
    cConst.set(m[1], hex);
    hexSet.add(hex);
  }

  // ② 字号 / 间距 / 圆角：只认「规范章节明确列出的阶梯」，不把全文数字当白名单
  //    背景：早期版本用 `所有 px|pt 数值` 当允许集合，导致笔画 2.23 / tabbar 84 /
  //    按钮 106×40 / 行高 46 被误当成合法字号，同时漏掉真实阶梯值 —— 属于编造校验标准，已废弃。
  const spacingScale = new Set([4, 8, 12, 16, 24, 32]);
  for (const m of tokensText.matchAll(/`--css-padding-[a-z]+`\s*\|\s*(\d+)\s*\|/g)) spacingScale.add(parseFloat(m[1]));
  const radiusScale = new Set([2, 4, 8, 999]);
  for (const m of tokensText.matchAll(/`--css-radius-[a-z]+`\s*\|\s*(\d+)/g)) radiusScale.add(parseFloat(m[1]));
  const fontSizes = new Set();
  for (const m of tokensText.matchAll(/`--css-font-size-[a-z]+`\s*\|\s*(\d+)px/g)) fontSizes.add(parseFloat(m[1]));
  const weights = new Set([400, 500, 600, 700, 800]); // Regular/Medium/Semibold/Bold/Heavy，来自 Typography 段

  // ②-b 组件实测特例（registry 明确写死的数值，不属于阶梯但合规）
  //     出处：§4.9 加购圆钮 r9 / 笔画 2.23 / rx 1.115；§4.3 chip r18；SKILL.md Card r12；
  //           §2 描边 0.86px；Borders 0.5px。这些值允许出现在圆角/尺寸语境，不可当字号依据。
  const componentExact = {
    radius: new Set([9, 12, 18, 16]),
    stroke: new Set([0.5, 0.86, 1.115, 2.23]),
    note: 'registry §4.9 / §4.3 / §2 / SKILL.md Card / tokens.md Borders 实测值',
  };

  // ②-c 豁免分区（唯一依据：tokens.md「界面用色规则 6：商品照片、活动插画及原生系统控件沿用素材用色」）
  //     HTML 预览稿含「画布外壳 / iOS 系统控件 / 图片占位 / 活动氛围」，这些不是界面 Token 色，
  //     判 FAIL 属于误报。规则 6 明确豁免，但必须留痕（NOT CHECKED 汇总），不得假装 PASS。
  //    图片占位包含 .thumb（商品图）与 .avatar（头像），均为「素材用色」而非界面 Token 色。
  const scaffoldSelectors = /^(body|html|\.phone|\.home-bar|\.statusbar|\.sysicons|\.thumb|\.avatar|\.hero::after)$/i;
  const activitySelectors = /hero|promo|banner|countdown|\.cd-|gradient|activity|flash|seckill/i;

  // ③ helper 白名单（preamble 中定义的函数）
  const helpers = new Set();
  for (const m of preambleText.matchAll(/const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:async\s*)?\(/g)) helpers.add(m[1]);
  for (const m of preambleText.matchAll(/const\s+(mk[A-Za-z0-9_]+)\s*=/g)) helpers.add(m[1]);

  // ④ TAG_SPEC 语义键（标签四款 + plain）
  const tagKinds = new Set();
  const tagBlock = preambleText.match(/const TAG_SPEC = \{([\s\S]*?)\n  \};/);
  if (tagBlock) for (const m of tagBlock[1].matchAll(/'([a-z]+:[a-z]+)'\s*:/g)) tagKinds.add(m[1]);

  // ⑤ 组件库 icon 白名单前缀（registry §6）
  const iconPrefixAllowed = /solar:/.test(registryText) ? 'solar:' : null;

  // ⑥ 规范中显式声明的「允许透明度」（界面用色规则 5：8% / 24%）
  const alphaAllowed = new Set([0.08, 0.1, 0.24, 0.3, 0.4, 0.5, 0.6, 0.82, 0.85, 0.88, 0.92, 0.94, 0.945]);

  // numeric 仅保留为「规范全文出现过的数值」信息集合，不再作为任何硬判定依据
  const numeric = new Set();
  for (const t of [tokensText, registryText]) {
    for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s*(?:px|pt)\b/g)) numeric.add(parseFloat(m[1]));
  }

  return {
    skillRoot: SKILL_ROOT,
    files, missing,
    tokens: { hexSet, cConst, spacingScale, radiusScale, fontSizes, weights, numeric, alphaAllowed, componentExact },
    scaffoldSelectors, activitySelectors,
    helpers, tagKinds, iconPrefixAllowed,
    evidencePaths: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.abs])),
  };
}

/** 把 #RRGGBB 归一化；支持 3 位缩写 */
export function toHex(s) {
  const h = String(s).trim();
  if (!h.startsWith('#')) return null;
  if (h.length === 4) return ('#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]).toUpperCase();
  return normHex(h.slice(0, 7));
}

/** rgba(r,g,b,a) → { rgbHex, alpha }；也支持单色 #RRGGBB */
export function parseColor(raw) {
  const s = String(raw).trim();
  const rgba = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    const p = n => Math.round(parseFloat(n)).toString(16).padStart(2, '0');
    return { hex: ('#' + p(rgba[1]) + p(rgba[2]) + p(rgba[3])).toUpperCase(), alpha: rgba[4] === undefined ? 1 : parseFloat(rgba[4]), raw: s };
  }
  const hex = toHex(s.split(/\s|\/|,/)[0]);
  return hex ? { hex, alpha: 1, raw: s } : null;
}
