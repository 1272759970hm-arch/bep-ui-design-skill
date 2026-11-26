/** 规则编写辅助：统一 issue 默认值、规范引用、状态裁定 */
import { makeCheck, addIssue, addEvidence, deriveStatus } from './status.mjs';

export function begin(ctx, ruleId) {
  const rule = ctx.rulesById.get(ruleId);
  if (!rule) throw new Error(`规则未登记：${ruleId}`);
  const c = makeCheck(ruleId, rule.dimension);
  c.rule = rule;
  return c;
}

export function ev(c, source, detail) { addEvidence(c, source, detail); }

export function issue(c, ctx, opts) {
  const rule = c.rule;
  const i = addIssue(c, {
    ...opts,
    spec: opts.spec || { source: rule.specSource, clause: opts.clause || '' },
    severity: opts.severity || rule.severity,
    fixable: opts.fixable ?? rule.fixable,
    fixKind: opts.fixKind ?? rule.fixKind ?? null,
    location: {
      file: ctx.fileLabel,
      line: opts.line ?? null,
      selector: opts.selector || '',
      detail: opts.detail || '',
      ...(opts.location || {})
    },
    suggestion: opts.suggestion || `按 ${rule.specSource} 修正`
  });
  if (opts.evidenceValue !== undefined) i.evidenceValue = opts.evidenceValue;
  return i;
}

export function finish(ctx, c) {
  const rule = c.rule;
  const max = ctx.config.thresholds.maxIssuesPerRule;
  if (c.issues.length > max) {
    const hidden = c.issues.length - max;
    c.truncated = hidden;
    c.issues = c.issues.slice(0, max);
  }
  for (const i of c.issues) {
    if (!i.spec.source) i.spec = { source: rule.specSource, clause: '' };
    i.verification.status = 'FAIL';
    i.verification.checkedAt = new Date().toISOString();
    i.verification.detail = `规则 ${c.ruleId} 实检 ${c.checkedCount} 个对象`;
  }
  delete c.rule;
  return deriveStatus(c, rule, ctx.availableSources);
}

export function collectScreens(ctx) {
  const set = new Set();
  if (ctx.browser?.ok && Array.isArray(ctx.browser.data?.screens)) {
    for (const s of ctx.browser.data.screens) if (s) set.add(s);
  }
  if (ctx.art.type === 'html') {
    for (const t of ctx.art.tags) {
      if (t.attrs['data-screen']) set.add(t.attrs['data-screen']);
      const cls = String(t.attrs.class || '');
      // 只认 class 含 screen 的容器 id；.phone/.device 是设备壳，不是业务屏幕
      if (/\bscreen\b/i.test(cls) && t.attrs.id) set.add(t.attrs.id);
    }
    for (const m of ctx.art.raw.matchAll(/data-screen(?:-go)?\s*=\s*["']([^"']+)["']/g)) set.add(m[1]);
  }
  return set;
}

export const cap = (s, n = 120) => String(s ?? '').replace(/\s+/g, ' ').slice(0, n);
