/**
 * Design QA 状态机
 * 状态：PASS / FAIL / WARNING / BLOCKED / NOT CHECKED
 * 核心守卫：没有实际检查的内容绝不标 PASS。
 */

export const STATUSES = ['PASS', 'FAIL', 'WARNING', 'BLOCKED', 'NOT CHECKED'];
export const RANK = {
  'PASS': 0,
  'NOT CHECKED': 1,
  'BLOCKED': 2,
  'WARNING': 3,
  'FAIL': 4
};

export function makeCheck(ruleId, dimension, opts = {}) {
  return {
    ruleId,
    dimension,
    status: 'NOT CHECKED',
    checkedCount: 0,
    evidence: [],
    issues: [],
    note: '',
    ...opts
  };
}

export function addEvidence(check, source, detail) {
  check.evidence.push({ source, detail: String(detail).slice(0, 300) });
}

export function addIssue(check, opts) {
  const issue = {
    id: `Q-${check.ruleId}-${String(check.issues.length + 1).padStart(2, '0')}`,
    ruleId: check.ruleId,
    dimension: check.dimension,
    description: '',
    location: { file: '', line: null, selector: '', detail: '' },
    spec: { source: '', clause: '' },
    severity: 'P2',
    suggestion: '',
    verification: { status: 'FAIL', checkedAt: new Date().toISOString(), detail: '' },
    fixable: false,
    fixKind: null,
    fixApplied: false,
    ...opts
  };
  check.issues.push(issue);
  return issue;
}

/**
 * 依据规则定义与真值源可用性，统一裁定状态。
 * - requiredEvidence 缺失 → BLOCKED（条件不足，规则未执行）
 * - checkedCount === 0   → NOT CHECKED（产物无标注，实际未检查）
 * - 存在 P0/P1 问题      → FAIL
 * - 存在 P2/ADVISORY     → WARNING
 * - 其余，且 PASS 守卫通过 → PASS；守卫不通过 → NOT CHECKED
 */
export function deriveStatus(check, rule, availableSources) {
  const required = rule.requiredEvidence || [];
  const missing = required.filter((k) => !availableSources.includes(k));

  if (missing.length) {
    check.status = 'BLOCKED';
    check.note = `校验条件不足：缺少 ${missing.join(' / ')}，本规则未执行，不得标记 PASS`;
    check.checkedCount = 0;
    check.issues = [];
    return check;
  }

  if (!(check.checkedCount > 0)) {
    check.status = 'NOT CHECKED';
    check.note = check.note || '产物未携带本规则所需的可检查对象，实际未检查任何内容';
    check.issues = [];
    return check;
  }

  const hard = check.issues.filter((i) => i.severity === 'P0' || i.severity === 'P1');
  if (hard.length) {
    check.status = 'FAIL';
    return check;
  }
  if (check.issues.length) {
    check.status = 'WARNING';
    return check;
  }

  // PASS 守卫：必须有证据，且必须真的检查过对象
  if (!check.evidence.length) {
    check.status = 'NOT CHECKED';
    check.note = '命中 PASS 守卫：检查无证据记录，禁止标记 PASS';
    return check;
  }

  check.status = 'PASS';
  return check;
}

export function summarize(checks) {
  const counts = { PASS: 0, FAIL: 0, WARNING: 0, BLOCKED: 0, 'NOT CHECKED': 0 };
  for (const c of checks) counts[c.status] = (counts[c.status] || 0) + 1;

  let overall = 'PASS';
  if (counts.FAIL > 0) overall = 'FAIL';
  else if (counts.WARNING > 0) overall = 'WARNING';
  else if (counts.BLOCKED > 0) overall = 'BLOCKED';
  else if (counts['NOT CHECKED'] > 0) overall = 'NOT CHECKED';

  const issues = checks.flatMap((c) => c.issues);
  const p0 = issues.filter((i) => i.severity === 'P0').length;
  // 「可宣称通过」= 六大维度全部有结论；存在条件不足时只能在报告里显式声明，不能宣称完整通过。
  const canClaimPass = counts.BLOCKED === 0 && counts['NOT CHECKED'] === 0;
  // 「可交付」只由真实违规决定：不适用 / 条件不足的规则不阻碍交付，但必须在 conditionGaps 里逐条列出。
  const deliverable = counts.FAIL === 0 && p0 === 0;

  return {
    overall,
    counts,
    issueCount: issues.length,
    p0Count: p0,
    canClaimPass,
    deliverable
  };
}
