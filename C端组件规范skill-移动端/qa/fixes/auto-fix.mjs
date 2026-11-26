// Design QA · 自动修复器（确定性修复闭环）
// 严格限制：只允许「样式/Token/组件名」的确定性字符串替换。
// 严禁修改业务文案、区块结构、交互逻辑 —— 不得为了通过校验降低设计要求。

import fs from 'node:fs';
import path from 'node:path';
import { LEGACY, ICON_FIX_MAP } from '../rules/legacy.mjs';

export function planFixes(issues, raw) {
  const edits = [];   // { from, to, count, ruleId }
  const skipped = []; // { ruleId, reason }
  const seen = new Set();

  for (const it of issues) {
    if (!it.autoFixable) continue;
    if (it.result !== 'FAIL' && it.result !== 'WARNING') continue;

    // ① 旧色值 → 定稿色值（legacy L-COLOR-*）
    if (it.id.includes('L-COLOR')) {
      const rule = LEGACY.find(r => it.id.includes(r.id));
      if (!rule || !rule.fixMap) { skipped.push({ ruleId: it.id, reason: '未登记修复映射' }); continue; }
      for (const [from, to] of rule.fixMap) {
        const re = new RegExp(from.replace('#', '#'), 'gi');
        const count = (raw.match(re) || []).length;
        if (count > 0 && !seen.has(from + to)) { seen.add(from + to); edits.push({ from, to, count, ruleId: it.id }); }
      }
      continue;
    }
    // ② lucide → Solar（仅替换 registry §6 已登记映射；未登记 → 不自动修，避免编造图标）
    if (it.id.includes('L-ICON-001')) {
      const names = [...new Set((raw.match(/lucide:[a-z0-9-]+/g) || []))];
      for (const n of names) {
        if (ICON_FIX_MAP[n]) {
          const count = raw.split(n).length - 1;
          edits.push({ from: n, to: ICON_FIX_MAP[n], count, ruleId: it.id });
        } else {
          skipped.push({ ruleId: it.id, reason: `${n} 不在 registry §6 对照表中，不自动编造图标名` });
        }
      }
      continue;
    }
    // ③ 标签 tinted 旧透明度：用规则自带的精确回调，只改 rgba 的 alpha 位
    //    严禁 split/join 全局替换 0.09 / 0.45 —— 会破坏 SVG path 坐标与 opacity 属性。
    if (it.id.includes('L-TAG-001')) {
      const rule = LEGACY.find(r => it.id.includes(r.id));
      if (!rule || !rule.fixer) { skipped.push({ ruleId: it.id, reason: '未登记精确修复回调' }); continue; }
      const re = new RegExp(rule.pattern.source, rule.pattern.flags);
      const count = (raw.match(re) || []).length;
      if (count > 0 && !seen.has('L-TAG-001')) {
        seen.add('L-TAG-001');
        edits.push({ from: 'rgba(...,.09 / .45)', to: 'rgba(...,.08 / .24)', count, ruleId: it.id,
          regex: { source: re.source, flags: re.flags }, fixerId: rule.id });
      }
      continue;
    }
    skipped.push({ ruleId: it.id, reason: '该规则标记为不可自动修复（结构/语义变更需人工确认）' });
  }
  return { edits, skipped };
}

export function applyFixes(targetPath, edits, backupDir) {
  let raw = fs.readFileSync(targetPath, 'utf8');
  const applied = [];
  // 备份（保留原始文件，便于回滚 / 人工复核）
  fs.mkdirSync(backupDir, { recursive: true });
  const bak = path.join(backupDir, path.basename(targetPath) + '.' + Date.now() + '.bak');
  fs.writeFileSync(bak, raw, 'utf8');
  for (const e of edits) {
    const before = raw;
    if (e.regex && e.fixerId) {
      const rule = LEGACY.find(r => r.id === e.fixerId);
      if (rule && rule.fixer) {
        const re = new RegExp(e.regex.source, e.regex.flags);
        raw = raw.replace(re, rule.fixer);
      }
    } else {
      raw = raw.split(e.from).join(e.to);
    }
    if (raw !== before) applied.push({ from: e.from, to: e.to, count: e.count, ruleId: e.ruleId,
      actually: e.regex ? e.count : before.split(e.from).length - 1 });
  }
  if (applied.length) fs.writeFileSync(targetPath, raw, 'utf8');
  return { applied, backup: bak, changed: applied.length > 0 };
}
