// 维度 1 · 需求还原校验
// 依据：调用方提供的 spec（PRD 结构化）。没有真实 PRD 时明确标记条件不足，绝不假装 PASS。
// 只对能静态验证的条目执行检查；业务流程/交互逻辑等语义条目标 NOT CHECKED。

import { issue, STATUS, SEVERITY } from '../lib/issue.mjs';

export const meta = {
  id: '01', key: 'requirements', name: '需求还原校验',
  requires: [], // 需要外部 spec
};

export function check(ctx, target, opts = {}) {
  const spec = opts.spec;
  const issues = [];
  const stats = { total: 0, pass: 0, fail: 0, notChecked: 0, forbiddenHits: 0 };
  let note = '';

  if (!spec || !Array.isArray(spec.requirements)) {
    return {
      issues: [issue({
        id: 'R-000', dimension: meta.name,
        description: '未提供结构化 PRD/需求规格，需求还原校验无法执行',
        location: target.path + '（整体）',
        spec: 'Design QA 机制要求：需求还原以真实 PRD 为唯一依据',
        severity: SEVERITY.MAJOR, suggestion: '提供 qa/specs/*.json（source 标记为 prd）后重新校验',
        result: STATUS.BLOCKED, evidence: 'opts.spec 缺失或非规范格式',
      })],
      note: '校验条件不足：缺少真实 PRD', stats, blocked: true,
    };
  }

  if (spec.source !== 'prd') {
    note = `校验条件不足：spec.source = "${spec.source}"（非真实 PRD）。以下结论仅适用于样例规格，不得视为需求验收通过。`;
    issues.push(issue({
      id: 'R-000', dimension: meta.name,
      description: '需求依据不是真实 PRD（样例规格 / 产品原型），需求还原结论不可用于验收',
      location: opts.specPath || 'qa/specs/',
      spec: 'Design QA 要求：产品原型只作需求依据，需求还原以 PRD 为准',
      severity: SEVERITY.MINOR, suggestion: '换成真实 PRD 结构化文件并把 source 设为 "prd"',
      result: STATUS.WARNING, evidence: 'source=' + spec.source,
    }));
  }

  const ex = target.type === 'html' ? target.html : null;
  const visible = ex ? ex.visible : (target.js ? target.js.text : target.raw);
  const texts = ex ? ex.tags.map(t => t.attrs.class || '') : [];

  for (const req of spec.requirements) {
    stats.total++;
    const loc = `${target.path} :: ${req.id} ${req.text}`;
    const base = { id: 'R-' + req.id, dimension: meta.name, location: loc,
      spec: `PRD ${spec.id || ''} / ${req.id} ${req.text}`, severity: req.required ? SEVERITY.MAJOR : SEVERITY.MINOR };
    if (req.type === 'semantic') {
      stats.notChecked++;
      issues.push(issue({ ...base, description: '该需求属业务流程/交互逻辑语义判断，静态源码无法验证',
        suggestion: '走人工走查或 E2E 用例验证（本次不判定）', result: STATUS.NOT_CHECKED,
        evidence: 'type=semantic，未执行检查' }));
      continue;
    }
    let hit = false, evidence = '';
    if (req.type === 'text') {
      hit = String(visible).includes(req.match);
      evidence = `页面可见文本中检索 "${req.match}" → ${hit ? '命中' : '未命中'}`;
    } else if (req.type === 'css-class') {
      const count = ex ? texts.filter(c => c.split(/\s+/).includes(req.match)).length : 0;
      hit = count >= (req.min || 1);
      evidence = `class="${req.match}" 出现 ${count} 次，要求 ≥${req.min || 1}`;
    } else if (req.type === 'selector') {
      const count = ex ? ex.decls.filter(d => d.selector.includes(req.match)).length : 0;
      hit = count >= (req.min || 1);
      evidence = `CSS 选择器含 "${req.match}" 的声明 ${count} 条，要求 ≥${req.min || 1}`;
    } else if (req.type === 'regex') {
      hit = new RegExp(req.match).test(target.raw);
      evidence = `正则 /${req.match}/ → ${hit}`;
    } else {
      stats.notChecked++;
      issues.push(issue({ ...base, description: '未知需求类型，无法执行检查',
        suggestion: '补充 checker 实现', result: STATUS.NOT_CHECKED, evidence: 'type=' + req.type }));
      continue;
    }
    if (hit) { stats.pass++; continue; } // 通过项不生成 issue，报告里统计
    stats.fail++;
    issues.push(issue({ ...base,
      description: `需求遗漏：${req.text}`,
      suggestion: req.suggestion || '按 PRD 补齐对应功能/字段/区块后重新校验',
      result: req.required ? STATUS.FAIL : STATUS.WARNING, evidence,
    }));
  }

  // 擅自增加内容
  for (const f of spec.forbid || []) {
    if (String(visible).includes(f)) {
      stats.forbiddenHits++;
      issues.push(issue({
        id: 'R-FORBID-' + stats.forbiddenHits, dimension: meta.name,
        description: `擅自增加了 PRD 未要求的内容：「${f}」`,
        location: target.path, spec: `PRD ${spec.id} 禁止项`,
        severity: SEVERITY.MAJOR, suggestion: '删除该内容或补充 PRD 依据',
        result: STATUS.FAIL, evidence: `可见文本命中「${f}」`,
      }));
    }
  }
  return { issues, note, stats, blocked: false };
}
