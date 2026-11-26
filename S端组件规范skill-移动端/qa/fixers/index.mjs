/**
 * 自动修复器：只做「可确定」的、语义不变的修复。
 * 允许：TOKEN_SUBSTITUTION / SPEC_VALUE_NORMALIZATION / ASSET_INLINING
 * 禁止：改业务逻辑、增删屏幕/功能点、把虚构组件改名、调阈值、把 BLOCKED 改 PASS。
 */
import { canonColor } from '../lib/evidence.mjs';
import { allDeclarations, COLOR_RE, NUM_RE } from '../lib/artifact.mjs';
import fs from 'node:fs';
import path from 'node:path';

const RADIUS_PROPS = new Set(['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius']);

function alphaOf(v) {
  const s = String(v).trim();
  if (/^#[0-9a-f]{8}$/i.test(s)) return parseInt(s.slice(7, 9), 16) / 255;
  const m = s.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
  return m ? Number(m[1]) : 1;
}

function normalizeTint(v, target = 0.10) {
  const s = String(v).trim();
  if (/^#[0-9a-f]{8}$/i.test(s)) return s.slice(0, 7) + Math.round(target * 255).toString(16).padStart(2, '0').toUpperCase();
  const m = s.match(/^(rgba?\([^,]+,[^,]+,[^,]+,)\s*[\d.]+\s*(\))$/);
  if (m) return `${m[1]}${target}${m[2]}`;
  return null;
}

function findLiteral(raw, from, lit) {
  const seg = raw.slice(from, from + 400);
  const semi = seg.indexOf(';'), brace = seg.indexOf('}');
  const stop = Math.min(seg.length, semi >= 0 ? semi : seg.length, brace >= 0 ? brace : seg.length);
  const idx = seg.slice(0, Math.max(0, stop)).toLowerCase().indexOf(lit.toLowerCase());
  return idx < 0 ? -1 : from + idx;
}

export function applyFixers(ctx, art) {
  const applied = [];
  const skipped = [];
  const raw = art.raw;
  const repls = []; // {start, end, text, ruleId, kind, detail}

  if (art.type === 'html') {
    // ---- 真值映射：色值 → :root 变量；数值 → :root 变量 ----
    const canonMap = new Map();
    const numMap = new Map();
    for (const [name, value] of art.rootVars) {
      const c = canonColor(value);
      if (c && !canonMap.has(c)) canonMap.set(c, name);
      const n = String(value).match(/^(-?\d+(?:\.\d+)?)px$/);
      if (n && /r-|radius|r[0-9]/.test(name) && !numMap.has(Number(n[1]))) numMap.set(Number(n[1]), name);
    }

    // ---- R2-02 裸色值 → var()（值不变，仅换成变量） ----
    for (const b of art.cssBlocks) {
      if (/^:root\b/.test(b.selector)) continue;
      for (const d of b.decls) {
        for (const lit of String(d.value).match(COLOR_RE) || []) {
          if (/^(transparent|currentcolor|inherit|initial|unset)$/i.test(lit)) continue;
          const v = canonMap.get(canonColor(lit));
          if (!v) continue;
          const at = findLiteral(raw, d.offset, lit);
          if (at < 0) continue;
          repls.push({ start: at, end: at + lit.length, text: `var(${v})`, ruleId: 'R2-02', kind: 'TOKEN_SUBSTITUTION', detail: `${lit} → var(${v})（第 ${d.line} 行）` });
        }
      }
    }
    // 行内 style=""
    for (const m of raw.matchAll(/style\s*=\s*"([^"]*)"/g)) {
      const val = m[1];
      for (const lit of val.match(COLOR_RE) || []) {
        const v = canonMap.get(canonColor(lit));
        if (!v) continue;
        const at = m.index + m[0].indexOf(lit);
        repls.push({ start: at, end: at + lit.length, text: `var(${v})`, ruleId: 'R2-02', kind: 'TOKEN_SUBSTITUTION', detail: `行内 ${lit} → var(${v})` });
      }
    }

    // ---- R2-05 裸圆角 → var() ----
    for (const b of art.cssBlocks) {
      if (/^:root\b/.test(b.selector)) continue;
      for (const d of b.decls) {
        if (!RADIUS_PROPS.has(d.prop) || /var\(/.test(d.value)) continue;
        for (const nm of String(d.value).matchAll(NUM_RE)) {
          const v = numMap.get(Number(nm[1]));
          if (!v) continue;
          const at = findLiteral(raw, d.offset, nm[0]);
          if (at < 0) continue;
          repls.push({ start: at, end: at + nm[0].length, text: `var(${v})`, ruleId: 'R2-05', kind: 'TOKEN_SUBSTITUTION', detail: `${nm[0]} → var(${v})（第 ${d.line} 行）` });
        }
      }
    }

    // ---- R4-01 标签 tint 归一到 10%（值来自 design-tokens.json） ----
    for (const m of raw.matchAll(/(--tag-[a-z0-9-]*-bg\s*:\s*)([^;]+)/gi)) {
      const value = m[2].trim();
      const a = alphaOf(value);
      if (a === null || Math.abs(a - 0.10) <= 0.005) continue;
      const fixed = normalizeTint(value, 0.10);
      if (!fixed) continue;
      const start = m.index + m[1].length;
      repls.push({ start, end: start + m[2].length, text: fixed, ruleId: 'R4-01', kind: 'SPEC_VALUE_NORMALIZATION', detail: `${m[1].trim()} ${value} → ${fixed}（C-04）` });
    }

    // ---- R4-03 外链插画 → 本地透明底 PNG base64 内嵌（必须能找到同名资产） ----
    const assetDir = ctx.evidence.emptyAssets?.path;
    const localPngs = assetDir ? fs.readdirSync(assetDir).filter((f) => f.toLowerCase().endsWith('.png')) : [];
    for (const m of raw.matchAll(/<img\b[^>]*\bsrc\s*=\s*"((?:https?:)?\/\/[^"]+)"/gi)) {
      const src = m[1];
      const base = path.basename(src.split('?')[0]).replace(/\.(png|jpg|jpeg|webp)$/i, '').toLowerCase();
      const hit = localPngs.find((f) => path.basename(f).toLowerCase().replace(/\.png$/, '') === base)
        || (localPngs.length === 1 ? localPngs[0] : null);
      if (!hit) { skipped.push({ ruleId: 'R4-03', reason: `外链 ${src} 在 assets/empty-states/ 中找不到同名本地资产，禁止猜测替换` }); continue; }
      const buf = fs.readFileSync(path.join(assetDir, hit));
      const b64 = `data:image/png;base64,${buf.toString('base64')}`;
      const at = m.index + m[0].lastIndexOf(src);
      repls.push({ start: at, end: at + src.length, text: b64, ruleId: 'R4-03', kind: 'ASSET_INLINING', detail: `${src} → 内嵌 ${hit}（${Math.round(buf.length / 1024)}KB，透明底）` });
    }
  }

  // ---- 非可自动修复问题：显式记录原因，绝不静默忽略 ----
  for (const c of ctx.checks) {
    for (const i of c.issues) {
      if (i.fixable) continue;
      const rule = ctx.rulesById.get(c.ruleId);
      skipped.push({
        ruleId: c.ruleId, issueId: i.id, severity: i.severity,
        reason: rule?.fixable
          ? '规则允许自动修复，但本条未找到确定性的真值映射，禁止猜测'
          : '不可自动修复：修复会改变业务逻辑 / 需求范围 / 组件真值，或缺少必要输入，须人工处理'
      });
    }
  }

  // ---- 去重 + 逆序应用 ----
  const seen = new Set();
  const clean = [];
  for (const r of repls.sort((a, b) => b.start - a.start)) {
    const key = `${r.start}:${r.end}`;
    if (seen.has(key) || r.start < 0 || r.end <= r.start) continue;
    if (clean.some((x) => r.start < x.end && r.end > x.start)) continue; // 重叠保留靠后的（先应用）
    seen.add(key);
    clean.push(r);
  }
  let newRaw = raw;
  for (const r of clean) {
    newRaw = newRaw.slice(0, r.start) + r.text + newRaw.slice(r.end);
    applied.push({ ruleId: r.ruleId, kind: r.kind, detail: r.detail });
  }

  // 可修复但本轮没产出替换的，记为跳过
  const fixedRules = new Set(applied.map((a) => a.ruleId));
  for (const c of ctx.checks) {
    if (!ctx.rulesById.get(c.ruleId)?.fixable) continue;
    if (c.issues.length && !fixedRules.has(c.ruleId)) {
      skipped.push({ ruleId: c.ruleId, reason: `本轮 ${c.issues.length} 个问题均无可确定的真值映射，按 fixPolicy 跳过，保留 ${c.status}` });
    }
  }

  return { raw: newRaw, applied, skipped, changed: newRaw !== raw };
}
