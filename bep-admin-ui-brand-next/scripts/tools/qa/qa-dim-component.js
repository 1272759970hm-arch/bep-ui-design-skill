#!/usr/bin/env node
// D3 组件引用 + D4 组件使用校验
// 唯一依据：scripts/bep-components.js（函数定义/图标）、references/components-*.md（公开入口）
// 复用 validate-page.js 的执行层结果作为证据（不重复实现其 891 行规则）。

var core = require('./qa-core');
var STATUS = core.STATUS, SEVERITY = core.SEVERITY, finding = core.finding;

function check(ctx) {
  var out = { D3: [], D4: [] };
  var clean = ctx.clean;
  var file = ctx.pageRel;
  var basis = ctx.basis;

  if (!basis.ok || Object.keys(basis.functions).length === 0) {
    ['D3', 'D4'].forEach(function(d) {
      out[d].push(finding({
        dimension: d, code: d + '-BASIS-000', status: STATUS.BLOCKED, severity: SEVERITY.BLOCKER,
        problem: '缺少组件库依据，组件校验无法执行',
        spec: 'scripts/bep-components.js',
        suggestion: '确认组件库文件存在后重试'
      }));
    });
    return out;
  }

  // ── D3-1 未定义的 bep* 函数调用（虚构组件）─────────────────────────────
  var called = {};
  var callRe = /\b(bep[A-Za-z0-9_]*)\s*\(/g;
  var m;
  while ((m = callRe.exec(clean))) called[m[1]] = true;
  Object.keys(called).sort().forEach(function(fn) {
    if (!basis.functions[fn]) {
      out.D3.push(finding({
        dimension: 'D3', code: 'D3-COMP-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: '调用了组件库中不存在的函数 ' + fn + '()（疑似虚构组件/拼写错误）',
        location: core.loc(file, null, fn + '()'),
        spec: 'scripts/bep-components.js',
        suggestion: '改用组件库已有的标准组件；若确需新组件，按 scripter-rules.md §新增组件流程补齐实现与文档',
        fixable: false
      }));
    }
  });

  // ── D3-2 调用了内部函数（非公开入口）─────────────────────────────────
  // 内部函数：组件库有定义，但文档未列为公开入口，且非已知的页面级工具
  var pageLevelAllow = {
    bepFrame: true, bepRect: true, bepText: true, bepTableText: true, bepTruncText: true,
    bepIcon: true, bepHex: true, bepSolid: true
  };
  Object.keys(called).sort().forEach(function(fn) {
    if (basis.functions[fn] && !basis.publicComponents[fn] && !pageLevelAllow[fn]) {
      out.D3.push(finding({
        dimension: 'D3', code: 'D3-COMP-002', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '调用了未登记为公开入口的函数 ' + fn + '()，可能是组件内部函数',
        location: core.loc(file, null, fn + '()'),
        spec: 'references/components-core.md / components-layout.md §公开入口',
        suggestion: '优先调用公开组件入口；确认该函数确为页面级工具则忽略本条'
      }));
    }
  });

  // ── D3-3 图标 key 合法性 ──────────────────────────────────────────────
  var iconKeys = {};
  var direct = /\bbepIcon\s*\(\s*['"]([^'"]+)['"]/g;
  while ((m = direct.exec(clean))) iconKeys[m[1]] = true;
  var optIcon = /\b(?:iconKey|iconSvg|icon)\s*:\s*['"]([^'"]+)['"]/g;
  while ((m = optIcon.exec(clean))) iconKeys[m[1]] = true;
  var litIcon = /['"]((?:Fill|Line)\/[^'"]+)['"]/g;
  while ((m = litIcon.exec(clean))) iconKeys[m[1]] = true;
  Object.keys(iconKeys).sort().forEach(function(k) {
    if (!basis.icons[k]) {
      out.D3.push(finding({
        dimension: 'D3', code: 'D3-ICON-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: '引用了 BeP 图标库不存在的图标：' + k,
        location: core.loc(file, null, k),
        spec: 'scripts/bep-components.js BEP_ICONS / references/icons.md',
        suggestion: '改用已有图标 key；缺失则按 icons.md §缺口流程提出并补进图标库，禁止手绘 SVG',
        fixable: false
      }));
    }
  });

  // ── D3-4 组件引用正确率统计（报告用）──────────────────────────────────
  var bepCalls = Object.keys(called).length;
  var legalCalls = Object.keys(called).filter(function(fn) { return basis.functions[fn]; }).length;
  ctx.metrics = ctx.metrics || {};
  ctx.metrics.componentCalls = bepCalls;
  ctx.metrics.componentLegal = legalCalls;
  ctx.metrics.componentAccuracy = bepCalls ? (legalCalls / bepCalls) : 1;
  ctx.metrics.iconRefs = Object.keys(iconKeys).length;

  if (!out.D3.length) {
    out.D3.push(finding({
      dimension: 'D3', code: 'D3-SUMMARY', status: STATUS.PASS, severity: SEVERITY.INFO,
      problem: '所有 bep* 调用（' + bepCalls + ' 个）均为组件库已定义函数，图标引用（' + Object.keys(iconKeys).length + ' 个）均在图标库中',
      spec: 'scripts/bep-components.js'
    }));
  }

  // ── D4 组件使用：复用 validate-page.js 的执行层结果作为证据 ──────────
  if (ctx.validate && ctx.validate.ran) {
    var parsed = ctx.validate;
    // error → D4 FAIL（阻塞）；warning → D4 WARNING（建议）
    parsed.errors.forEach(function(e) {
      out.D4.push(finding({
        dimension: 'D4', code: 'D4-VALIDATE-ERROR', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: e.msg,
        location: core.loc(file, e.line, null),
        spec: 'scripts/tools/validate-page.js（执行层规则）',
        suggestion: '按 validate-page.js 报错修复；对应规范见 SKILL.md 执行铁律与 references/',
        fixable: /汉字间空格|PingFang\s*TC/.test(e.msg)
      }));
    });
    parsed.warnings.forEach(function(w) {
      out.D4.push(finding({
        dimension: 'D4', code: 'D4-VALIDATE-WARN', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: w.msg,
        location: core.loc(file, w.line, null),
        spec: 'scripts/tools/validate-page.js（执行层规则）',
        suggestion: '建议修复以消除 warning；如为合理例外请在交付说明中标注'
      }));
    });
  } else {
    out.D4.push(finding({
      dimension: 'D4', code: 'D4-VALIDATE-BLOCKED', status: STATUS.BLOCKED, severity: SEVERITY.BLOCKER,
      problem: '未能获取 validate-page.js 校验结果，组件使用合规性的执行层证据不足',
      location: null,
      spec: 'scripts/tools/validate-page.js',
      suggestion: '先运行 node tools/build.js 再运行 node tools/validate-page.js'
    }));
  }

  // ── D4 复用：检测"自造组件替身"的补充规则（function make*/build*）────
  var mimicRe = /\bfunction\s+(make|build)(Btn|Button|Table|Row|Cell|Tag|Modal|Drawer|Input|Sidebar|Header|Card|Select|Tree|Timeline|Log)\w*\s*\(/g;
  while ((m = mimicRe.exec(clean))) {
    out.D4.push(finding({
      dimension: 'D4', code: 'D4-REUSE-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
      problem: '页面内定义了疑似标准组件替身函数 ' + m[1] + m[2] + '()，违反"已有组件优先复用"铁律',
      location: core.loc(file, core.lineOf(clean, m.index), m[0].trim()),
      spec: 'SKILL.md 执行铁律 #1 / references/scripter-rules.md §分层',
      suggestion: '删除该局部函数，改用 bep-components.js 中的对应标准组件',
      fixable: false
    }));
  }

  if (!out.D4.length) {
    out.D4.push(finding({
      dimension: 'D4', code: 'D4-SUMMARY', status: STATUS.PASS, severity: SEVERITY.INFO,
      problem: '组件使用符合规范：无自造替身、无执行层 error/warning',
      spec: 'SKILL.md 执行铁律 / scripts/tools/validate-page.js'
    }));
  }

  return out;
}

module.exports = { check: check };
