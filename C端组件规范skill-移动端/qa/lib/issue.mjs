// Design QA · 公共数据结构与状态枚举
// 状态语义严格定义：没有实际执行检查的内容，不得标记为 PASS。

export const STATUS = Object.freeze({
  PASS: 'PASS',                 // 已实际执行检查，且全部通过
  FAIL: 'FAIL',                 // 已实际执行检查，发现硬性违规
  WARNING: 'WARNING',           // 已实际执行检查，发现非阻断偏差 / 依据为样例
  BLOCKED: 'BLOCKED',           // 校验条件不足（缺 PRD / Token / 参考图 / 渲染环境）或需人工裁决
  NOT_CHECKED: 'NOT_CHECKED',   // 该条目本次未执行检查（动态行为、审美判断等）
});

export const SEVERITY = Object.freeze({
  BLOCKER: 'BLOCKER',
  MAJOR: 'MAJOR',
  MINOR: 'MINOR',
  INFO: 'INFO',
});

/**
 * 构造一条问题记录。每个问题必须包含用户要求的 6 个字段。
 * id 形如 'T-003'（维度前缀 T/C/R/U/V/I/L）
 */
export function issue(opts) {
  const required = ['id', 'dimension', 'description', 'location', 'spec', 'severity', 'suggestion', 'result'];
  for (const k of required) if (!opts[k]) throw new Error('issue 缺少字段: ' + k);
  return {
    id: opts.id,
    dimension: opts.dimension,
    description: opts.description,
    location: opts.location,                 // 文件 + 行号 / CSS 选择器 / 组件名
    spec: opts.spec,                        // 对应规范（文件 + 章节 + 具体条款）
    severity: opts.severity,
    suggestion: opts.suggestion,
    result: opts.result,                    // STATUS
    evidence: opts.evidence || '',           // 实际检查到的值 / 检查方式
    autoFixable: !!opts.autoFixable,
    fixApplied: opts.fixApplied || null,
  };
}

/** 从 issues 列表推导维度状态
 *  优先级：FAIL > WARNING > BLOCKED > NOT_CHECKED > PASS。
 *  · FAIL 最重：已检查并发现硬性违规。
 *  · WARNING 优先于 BLOCKED：维度内只要「实际执行过检查并有发现」，就不该因个别
 *    条件不足条目把整个维度抹成 BLOCKED；那条 BLOCKED 仍在问题表中如实列出。
 *  · 纯 BLOCKED（缺 PRD / 缺 Figma 参考图 / 依据缺失）的维度 → BLOCKED，
 *    绝不能被 hasChecked=false 短路成 NOT_CHECKED（不得假装「本次没检查」）。
 */
export function dimensionStatus(issues, { hasChecked = true, conditionNote = '' } = {}) {
  const relevant = issues || [];
  if (relevant.some(i => i.result === STATUS.FAIL)) return { status: STATUS.FAIL, note: conditionNote };
  if (relevant.some(i => i.result === STATUS.WARNING)) return { status: STATUS.WARNING, note: conditionNote };
  if (relevant.some(i => i.result === STATUS.BLOCKED)) return { status: STATUS.BLOCKED, note: conditionNote };
  if (!hasChecked) return { status: STATUS.NOT_CHECKED, note: conditionNote };
  if (relevant.length === 0) return { status: STATUS.PASS, note: conditionNote };
  // 没有任何实质问题，但存在未检查条目 → 不得标 PASS
  if (relevant.every(i => i.result === STATUS.NOT_CHECKED)) return { status: STATUS.NOT_CHECKED, note: conditionNote };
  if (relevant.some(i => i.result === STATUS.NOT_CHECKED)) return { status: STATUS.WARNING, note: (conditionNote + ' 部分条目未执行检查').trim() };
  return { status: STATUS.PASS, note: conditionNote };
}
