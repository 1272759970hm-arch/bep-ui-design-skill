#!/usr/bin/env node
// Design QA 自动修复器
// 原则：只修复"确定性"问题；不得改业务逻辑、不得降低设计要求、不得绕过规范。
// 每条 fix 必须是可逆的机械替换，并在修复后记录，供二次校验验证。

var core = require('./qa-core');

// 可自动修复的规则清单：code -> { apply(src) -> {src, changed, note} }
var FIXERS = {
  // PingFang TC → PingFang SC（规范强制 SC）
  'D2-TOKEN-FAMILY-001': function(src) {
    var changed = false;
    var out = src.replace(/family\s*:\s*(['"])PingFang\s*TC\1/g, function(m, q) {
      changed = true;
      return 'family: ' + q + 'PingFang SC' + q;
    });
    return { src: out, changed: changed, note: '字体族 PingFang TC → PingFang SC' };
  },
  // 按钮文案汉字间空格：'查 询' → '查询'（validate-page.js 同类规则）
  'D4-VALIDATE-ERROR': function(src, finding) {
    if (!/汉字间空格/.test(finding.problem)) return { src: src, changed: false, note: null };
    var out = src.replace(/(['"])([\u4e00-\u9fa5])\s+([\u4e00-\u9fa5])([^'"]*)\1/g, function(m, q, a, b, rest) {
      return q + a + b + rest + q;
    });
    return { src: out, changed: out !== src, note: '去除按钮文案汉字间空格' };
  }
};

// 对一组 findings 执行自动修复，返回 { src, applied[], skipped[] }
function applyFixes(src, findings) {
  var applied = [];
  var skipped = [];
  var cur = src;

  findings.forEach(function(f) {
    if (!f.fixable) return;
    var fixer = FIXERS[f.code];
    if (!fixer) {
      skipped.push({ code: f.code, reason: '无确定性修复策略，需人工处理' });
      return;
    }
    var result = fixer(cur, f);
    if (result.changed) {
      cur = result.src;
      f.fixed = true;
      applied.push({ code: f.code, note: result.note, location: f.location });
    } else {
      skipped.push({ code: f.code, reason: '未匹配到可安全替换的目标，需人工确认' });
    }
  });

  return { src: cur, applied: applied, skipped: skipped, changed: cur !== src };
}

module.exports = { applyFixes: applyFixes, FIXERS: FIXERS };
