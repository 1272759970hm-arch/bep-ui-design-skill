#!/usr/bin/env node
// Design QA 报告生成器：Markdown（人读）+ JSON（机器读）
// 严格按用户要求的 8 个部分 + 每个问题的 6 个字段输出。

var fs = require('fs');
var path = require('path');
var core = require('./qa-core');
var STATUS = core.STATUS;

var DIM_META = {
  D1: { name: '需求还原', report: '1. 需求还原情况' },
  D2: { name: '设计规范', report: '2. 设计规范符合情况' },
  D3: { name: '组件引用', report: '3. 组件引用正确率' },
  D4: { name: '组件使用', report: '4. 组件使用合规情况' },
  D5: { name: '视觉还原', report: '5. 视觉还原评估' },
  D6: { name: '交互逻辑', report: '6. 交互逻辑完整性' }
};

function icon(status) {
  return {
    PASS: '✅', FAIL: '❌', WARNING: '⚠️',
    BLOCKED: '🚫', 'NOT CHECKED': '⬜'
  }[status] || '·';
}

function dimFindings(all, d) {
  return all.filter(function(f) { return f.dimension === d; });
}

function buildReport(result) {
  var all = result.findings;
  var lines = [];
  var m = result.meta;

  lines.push('# Design QA 报告 · ' + m.page);
  lines.push('');
  lines.push('> 生成时间：' + m.timestamp + '　|　校验轮次：' + result.rounds.length + '　|　总体结论：**' + icon(result.overall) + ' ' + result.overall + '**');
  lines.push('');
  lines.push('校验依据：`scripts/bep-components.js`（组件/图标）、`references/design-tokens.md`（Token）、`references/components-*.md`（公开 API）、`scripts/tools/validate-page.js`（执行层规则）。');
  lines.push('');
  lines.push('| 校验状态 | 含义 |');
  lines.push('|---|---|');
  lines.push('| PASS | 已实际检查且通过 |');
  lines.push('| FAIL | 已实际检查且发现违规 |');
  lines.push('| WARNING | 已检查，发现建议项或证据有限 |');
  lines.push('| BLOCKED | 缺少真源/条件，无法执行（不计为 PASS） |');
  lines.push('| ⬜ NOT CHECKED | 明确未检查，不得当作 PASS |');
  lines.push('');
  lines.push('---');
  lines.push('');

  // 六个维度摘要表
  lines.push('## 维度总览');
  lines.push('');
  lines.push('| 维度 | 状态 | 违规 | 建议 | 阻塞 | 未检查 |');
  lines.push('|---|---|---|---|---|---|');
  core.DIMENSIONS.forEach(function(d) {
    var fs = dimFindings(all, d.id);
    lines.push('| ' + d.id + ' ' + d.name + ' | ' + icon(result.dimStatus[d.id]) + ' ' + result.dimStatus[d.id] + ' | ' +
      core.countBy(fs, STATUS.FAIL) + ' | ' + core.countBy(fs, STATUS.WARNING) + ' | ' +
      core.countBy(fs, STATUS.BLOCKED) + ' | ' + core.countBy(fs, STATUS.NOT_CHECKED) + ' |');
  });
  lines.push('');

  // 8 个部分
  core.DIMENSIONS.forEach(function(d) {
    var meta = DIM_META[d.id];
    lines.push('## ' + meta.report);
    lines.push('');
    var fs = dimFindings(all, d.id);
    if (!fs.length) { lines.push('_无记录_'); lines.push(''); return; }
    fs.forEach(function(f) { lines.push(formatFinding(f)); lines.push(''); });

    // 组件引用维度附带正确率
    if (d.id === 'D3' && result.metrics) {
      var acc = result.metrics.componentAccuracy;
      lines.push('> 组件引用正确率：' + (acc === undefined ? 'N/A' : (acc * 100).toFixed(1) + '%') +
        '（合法调用 ' + result.metrics.componentLegal + ' / 总调用 ' + result.metrics.componentCalls + '）');
      lines.push('');
    }
  });

  // 7. 问题及修复记录
  lines.push('## 7. 发现的问题及修复记录');
  lines.push('');
  var problems = all.filter(function(f) { return f.status === STATUS.FAIL || f.status === STATUS.WARNING; });
  if (!problems.length) {
    lines.push('未发现违规项或建议项。');
  } else {
    lines.push('| 规则 | 维度 | 严重程度 | 状态 | 问题 | 位置 | 修复 |');
    lines.push('|---|---|---|---|---|---|---|');
    problems.forEach(function(f) {
      var fixLabel = f.fixed ? '✅ 已自动修复' : (f.recheck ? f.recheck : (f.fixable ? '可自动修复（未应用）' : '需人工修复'));
      lines.push('| ' + (f.code || '-') + ' | ' + f.dimension + ' | ' + f.severity + ' | ' + f.status + ' | ' +
        esc(f.problem) + ' | ' + esc(locText(f.location)) + ' | ' + fixLabel + ' |');
    });
  }
  lines.push('');

  // 8. 未解决问题及原因
  lines.push('## 8. 尚未解决的问题及原因');
  lines.push('');
  var unresolved = all.filter(function(f) {
    return (f.status === STATUS.FAIL || f.status === STATUS.BLOCKED || f.status === STATUS.WARNING) && !f.fixed;
  });
  if (!unresolved.length) {
    lines.push('无未解决问题。');
  } else {
    unresolved.forEach(function(f) {
      lines.push('- **[' + f.code + '] ' + f.severity + ' / ' + f.status + '**：' + f.problem);
      if (f.suggestion) lines.push('  - 原因/建议：' + f.suggestion);
    });
  }
  lines.push('');

  // 闭环记录
  lines.push('## 校验与修复闭环记录');
  lines.push('');
  result.rounds.forEach(function(r, i) {
    lines.push('### 第 ' + (i + 1) + ' 轮');
    lines.push('- FAIL：' + r.counts.FAIL + '，WARNING：' + r.counts.WARNING + '，BLOCKED：' + r.counts.BLOCKED + '，NOT CHECKED：' + r.counts['NOT CHECKED']);
    if (r.fix && r.fix.applied.length) {
      lines.push('- 自动修复：' + r.fix.applied.map(function(a) { return a.code + '（' + a.note + '）'; }).join('；'));
    } else {
      lines.push('- 自动修复：无');
    }
  });
  lines.push('');
  lines.push('> 闭环终止条件：无**可自动修复**的 FAIL 项，或达到最大轮次。剩余 FAIL/BLOCKED 不得通过修改业务逻辑或降低设计要求来消除。');
  lines.push('');

  return lines.join('\n');
}

function formatFinding(f) {
  var L = [];
  L.push(icon(f.status) + ' **' + f.dimension + ' / ' + (f.code || '检查项') + '** — ' + f.status + '（' + f.severity + '）');
  L.push('');
  L.push('- **问题描述**：' + f.problem);
  L.push('- **问题位置**：' + locText(f.location));
  L.push('- **对应规范**：' + (f.spec || '未指定'));
  L.push('- **严重程度**：' + f.severity);
  L.push('- **修复建议**：' + (f.suggestion || '—'));
  L.push('- **校验结果**：' + f.status + (f.fixed ? '（已自动修复并进入二次校验）' : (f.recheck ? '（二次校验：' + f.recheck + '）' : '')));
  return L.join('\n');
}

function locText(loc) {
  if (!loc) return '—';
  var s = loc.file || '';
  if (loc.line) s += ':' + loc.line;
  if (loc.detail) s += '（`' + loc.detail + '`）';
  return s || '—';
}

function esc(s) {
  return String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 300);
}

function generate(result) {
  var md = buildReport(result);
  var outDir = path.join(core.ROOT, 'pages', result.meta.modName, 'dist');
  var base = 'design-qa-' + result.meta.pageBase;
  var mdFile = core.writeReport(outDir, base + '.md', md);
  var jsonFile = core.writeReport(outDir, base + '.json', JSON.stringify(result, null, 2));
  return { md: mdFile, json: jsonFile, content: md };
}

module.exports = { generate: generate, buildReport: buildReport };
