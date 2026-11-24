#!/usr/bin/env node
// D6 交互逻辑校验 · 状态完整性与交互组件齐备性（可程序化部分）
// 唯一依据：references/interaction-design.md §二状态矩阵、references/design-review.md §三/§六
// 说明：交互"是否合理"属判断层，无法程序化；本模块只查可静态判定的硬性项。

var core = require('./qa-core');
var STATUS = core.STATUS, SEVERITY = core.SEVERITY, finding = core.finding;

// 依据页面类型推断应有的交互能力（与 page-type-rules.md 对齐）
var PAGE_TYPE_EXPECT = {
  list:    { needsPagination: true,  needsEmpty: true, needsModal: true,  label: '列表页' },
  table:   { needsPagination: true,  needsEmpty: true, needsModal: true,  label: '表格页' },
  detail:  { needsDescriptions: true, label: '详情页' },
  form:    { needsFormItem: true, needsMessage: true, label: '表单页' },
  drawer:  { needsFormItem: true, label: '抽屉' },
  modal:   { needsFormItem: true, label: '弹窗' },
  default: { label: '通用页面' }
};

function detectPageType(ctx) {
  var name = (ctx.modName + '/' + ctx.pageBase).toLowerCase();
  var clean = ctx.clean;
  if (/list|table/.test(name) || /bepPagination|COL_WIDTH_AUDIT/.test(clean)) return 'list';
  if (/detail/.test(name) || /bepDescriptions/.test(clean)) return 'detail';
  if (/form/.test(name) || /bepFormItem/.test(clean)) return 'form';
  if (/drawer/.test(name)) return 'drawer';
  if (/modal/.test(name)) return 'modal';
  return 'default';
}

function check(ctx) {
  var findings = [];
  var clean = ctx.clean;
  var file = ctx.pageRel;
  var type = detectPageType(ctx);
  var expect = PAGE_TYPE_EXPECT[type];
  ctx.metrics = ctx.metrics || {};
  ctx.metrics.pageType = type;

  // ── D6-1 状态完整性：列表/表格页必须具备空态、加载态、失败提示 ────────
  if (expect.needsEmpty) {
    var hasEmpty = /\bbepEmptyState\s*\(/.test(clean);
    if (!hasEmpty) {
      findings.push(finding({
        dimension: 'D6', code: 'D6-STATE-EMPTY-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: expect.label + '未渲染空状态（未调用 bepEmptyState），无数据时可能白屏',
        location: core.loc(file, null, null),
        spec: 'references/design-review.md §六 状态完整性 / references/interaction-design.md §二',
        suggestion: '为表格/列表补充 bepEmptyState 空态分支',
        fixable: false
      }));
    }
  }

  // ── D6-2 分页：列表/表格页数据量大时应有分页 ───────────────────────────
  if (expect.needsPagination) {
    var hasPage = /\bbepPagination\s*\(/.test(clean);
    if (!hasPage) {
      findings.push(finding({
        dimension: 'D6', code: 'D6-STATE-PAGE-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: expect.label + '未发现分页器 bepPagination，大数据量场景需分页策略',
        location: core.loc(file, null, null),
        spec: 'references/design-review.md §八 大数据策略 / references/pc-ux-principles.md',
        suggestion: '确认数据量；超过一屏应补充 bepPagination 或明确说明一次性加载策略',
        fixable: false
      }));
    }
  }

  // ── D6-3 危险操作二次确认：出现删除/作废但无 bepAlertModal ─────────────
  var dangerOps = /['"](删除|作废|停用|驳回|撤销|清空|销毁)['"]/.test(clean);
  var hasConfirm = /\bbepAlertModal\s*\(/.test(clean);
  if (dangerOps && !hasConfirm) {
    findings.push(finding({
      dimension: 'D6', code: 'D6-INTERACTION-CONFIRM-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
      problem: '页面含删除/作废等危险操作，但未见二次确认弹窗（bepAlertModal）',
      location: core.loc(file, null, null),
      spec: 'references/design-review.md §三 危险操作有二次确认',
      suggestion: '为危险操作补充 bepAlertModal 二次确认；若为纯展示样例可忽略'
    }));
  }

  // ── D6-4 提交防重复：表单/弹窗类应有 loading 态或提交反馈 ───────────────
  if (type === 'form' || type === 'drawer' || type === 'modal') {
    var hasFeedback = /\bloading\s*:|\bbepMessage\s*\(|showFooter/.test(clean);
    if (!hasFeedback) {
      findings.push(finding({
        dimension: 'D6', code: 'D6-INTERACTION-FEEDBACK-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '表单类页面未见提交反馈或 loading 态（bepMessage / loading / showFooter）',
        location: core.loc(file, null, null),
        spec: 'references/design-review.md §三 提交防重复、反馈明确',
        suggestion: '补充提交 loading 与 bepMessage 反馈，防止重复提交'
      }));
    }
  }

  // ── D6-5 交互"合理性"判断层：无法程序化，诚实标记 NOT CHECKED ──────────
  findings.push(finding({
    dimension: 'D6', code: 'D6-JUDGEMENT-001', status: STATUS.NOT_CHECKED, severity: SEVERITY.INFO,
    problem: '交互形态合理性（弹窗 vs 抽屉 vs 页面、状态流转闭合、异常场景穷尽）属设计判断，脚本不作自动判定',
    location: null,
    spec: 'references/interaction-design.md §三/§四',
    suggestion: '生成方需按 design-review.md §三/§六人工逐项确认，并在交付说明中写明结论'
  }));

  return findings;
}

module.exports = { check: check, detectPageType: detectPageType };
