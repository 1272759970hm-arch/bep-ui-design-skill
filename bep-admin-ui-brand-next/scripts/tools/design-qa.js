#!/usr/bin/env node
// Design QA 主编排器
// 用法：
//   node tools/design-qa.js <模块>/<页面> [选项]
// 选项：
//   --prd <文件>        PRD/需求清单真源（D1 需求还原）
//   --figma <文件>      Figma 设计稿数据/标准参考（D5 视觉还原）
//   --max-rounds <N>    自动修复闭环最大轮次（默认 3）
//   --no-fix            只校验不自动修复
//   --json              仅输出 JSON 路径
//
// 流程：六维检查 → 识别违规 → 分析规范 → 自动修复 → 二次校验 → 报告（循环至收敛）

var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var core = require('./qa/qa-core');
var basisMod = require('./qa/qa-basis');
var dimSpec = require('./qa/qa-dim-spec');
var dimComponent = require('./qa/qa-dim-component');
var dimInteraction = require('./qa/qa-dim-interaction');
var dimRV = require('./qa/qa-dim-requirement-visual');
var fixer = require('./qa/qa-fix');
var reporter = require('./qa/qa-report');

var STATUS = core.STATUS;

function usage(msg) {
  if (msg) console.error('错误：' + msg);
  console.error('用法：node tools/design-qa.js <模块>/<页面> [--prd 文件] [--figma 文件] [--max-rounds N] [--no-fix] [--json]');
  console.error('例：node tools/design-qa.js hr/list');
  process.exit(1);
}

// 解析参数
function parseArgs(argv) {
  var opts = { maxRounds: 3, noFix: false, jsonOnly: false, prdFile: null, figmaFile: null, target: null };
  for (var i = 0; i < argv.length; i++) {
    var a = argv[i];
    if (a === '--prd') { opts.prdFile = argv[++i]; }
    else if (a === '--figma') { opts.figmaFile = argv[++i]; }
    else if (a === '--max-rounds') { opts.maxRounds = parseInt(argv[++i], 10) || 3; }
    else if (a === '--no-fix') { opts.noFix = true; }
    else if (a === '--json') { opts.jsonOnly = true; }
    else if (a.indexOf('--') === 0) { usage('未知选项：' + a); }
    else if (!opts.target) { opts.target = a; }
  }
  if (!opts.target) usage('缺少目标页面');
  var parts = opts.target.replace(/\.js$/, '').split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) usage('目标格式必须为 <模块>/<页面>');
  opts.modName = parts[0];
  opts.pageBase = parts[1];
  return opts;
}

// 调用现有 validate-page.js，解析其输出为结构化证据
function runValidate(modName, pageBase) {
  var script = path.join(core.TOOLS, 'validate-page.js');
  var res = { ran: false, errors: [], warnings: [], exitCode: null, raw: '' };
  try {
    var out = cp.spawnSync(process.execPath, [script, modName + '/' + pageBase], {
      encoding: 'utf8', cwd: core.TOOLS, timeout: 30000
    });
    res.ran = true;
    res.exitCode = out.status;
    res.raw = ((out.stdout || '') + '\n' + (out.stderr || ''));
    res.raw.split(/\r?\n/).forEach(function(line) {
      var em = line.match(/❌\s*error(?::(\d+))?\s+(.*)/);
      if (em) { res.errors.push({ line: em[1] ? parseInt(em[1], 10) : null, msg: em[2] }); return; }
      var wm = line.match(/⚠️\s*warning(?::(\d+))?\s+(.*)/);
      if (wm) { res.warnings.push({ line: wm[1] ? parseInt(wm[1], 10) : null, msg: wm[2] }); }
    });
  } catch (e) {
    res.ran = false;
    res.raw = String(e && e.message || e);
  }
  return res;
}

// 执行一轮六维检查
function runRound(ctx) {
  var all = [];
  var dimStatus = {};

  all = all.concat(dimRV.checkRequirement(ctx));
  all = all.concat(dimSpec.check(ctx));
  var comp = dimComponent.check(ctx);
  all = all.concat(comp.D3).concat(comp.D4);
  all = all.concat(dimRV.checkVisual(ctx));
  all = all.concat(dimInteraction.check(ctx));

  core.DIMENSIONS.forEach(function(d) {
    dimStatus[d.id] = core.aggregateStatus(all.filter(function(f) { return f.dimension === d.id; }));
  });

  var counts = {};
  Object.keys(STATUS).forEach(function(k) { counts[STATUS[k]] = core.countBy(all, STATUS[k]); });
  return { findings: all, dimStatus: dimStatus, counts: counts };
}

function main() {
  var opts = parseArgs(process.argv.slice(2));
  var pagePath = path.join(core.PAGES_DIR, opts.modName, opts.pageBase + '.js');
  var pageRel = 'pages/' + opts.modName + '/' + opts.pageBase + '.js';

  if (!fs.existsSync(pagePath)) {
    console.error('❌ 找不到页面源码：' + pageRel);
    process.exit(1);
  }

  var basis = basisMod.loadBasis();
  var validate = runValidate(opts.modName, opts.pageBase);
  var originalSrc = fs.readFileSync(pagePath, 'utf8');
  var ctx = {
    modName: opts.modName, pageBase: opts.pageBase, pageRel: pageRel,
    src: originalSrc, clean: core.stripComments(originalSrc),
    basis: basis, validate: validate,
    prdFile: opts.prdFile, figmaFile: opts.figmaFile,
    metrics: {}, isComponentLib: false
  };

  var rounds = [];
  var currentSrc = originalSrc;
  var finalRound = null;
  var fixHistory = [];

  for (var r = 1; r <= opts.maxRounds; r++) {
    ctx.src = currentSrc;
    ctx.clean = core.stripComments(currentSrc);
    var round = runRound(ctx);
    var roundRec = { round: r, counts: round.counts, fix: null };
    finalRound = round; // 每轮都是"当前源码"的完整检查，最后一轮即最终结果

    // 自动修复：只对 FAIL 项中的可修复规则应用
    var changed = false;
    if (!opts.noFix) {
      var fixableFails = round.findings.filter(function(f) {
        return f.status === STATUS.FAIL && f.fixable;
      });
      var fixResult = fixer.applyFixes(currentSrc, fixableFails);
      roundRec.fix = fixResult;
      if (fixResult.changed) {
        currentSrc = fixResult.src;
        fixResult.applied.forEach(function(a) {
          fixHistory.push({ code: a.code, note: a.note, location: a.location, round: r });
        });
        changed = true;
      }
    }
    rounds.push(roundRec);
    if (!changed) break; // 源码未变 → 已收敛
  }

  // 最终结果 = 最后一轮检查（反映所有修复后的真实状态）
  var finalAll = finalRound.findings;

  // 把历史修复项补入最终 findings：若该项在最终轮已消失，记为"已修复并通过复检"
  fixHistory.forEach(function(h) {
    var stillFailing = finalAll.some(function(f) {
      return f.code === h.code && f.status === STATUS.FAIL;
    });
    if (!stillFailing) {
      finalAll.push(findingWithRecheck(h));
    }
  });

  function findingWithRecheck(h) {
    return core.finding({
      dimension: h.code.split('-')[0], code: h.code, status: STATUS.PASS, severity: core.SEVERITY.INFO,
      problem: '历史违规项已在本轮前自动修复（' + h.note + '）',
      location: h.location, spec: null,
      suggestion: null, fixable: false
    });
  }

  // 总体结论：FAIL > BLOCKED > WARNING > PASS；全 NOT CHECKED 则 NOT CHECKED
  var overall = core.aggregateStatus(finalAll);
  var result = {
    meta: {
      page: opts.pageRel || (opts.modName + '/' + opts.pageBase),
      pageRel: pageRel,
      modName: opts.modName,
      pageBase: opts.pageBase,
      timestamp: new Date().toISOString(),
      maxRounds: opts.maxRounds,
      noFix: opts.noFix,
      prd: ctx.metrics.prdSource || null,
      figma: opts.figmaFile || null,
      basis: {
        functions: Object.keys(basis.functions).length,
        icons: Object.keys(basis.icons).length,
        publicComponents: Object.keys(basis.publicComponents).length,
        tokenMismatches: basis.tokenMismatches,
        errors: basis.errors
      }
    },
    overall: overall,
    dimStatus: finalRound.dimStatus,
    metrics: ctx.metrics,
    findings: finalAll,
    fixHistory: fixHistory,
    rounds: rounds.map(function(rr) {
      return { round: rr.round, counts: rr.counts, fix: rr.fix ? {
        applied: rr.fix.applied, skipped: rr.fix.skipped, changed: rr.fix.changed
      } : null };
    })
  };

  // 保存修复后的源码（如果有变更）
  if (currentSrc !== originalSrc) {
    fs.writeFileSync(pagePath, currentSrc, 'utf8');
    // 重新 build 以保证 dist 与源码一致
    try {
      cp.spawnSync(process.execPath, [path.join(core.TOOLS, 'build.js'), opts.modName + '/' + opts.pageBase], {
        encoding: 'utf8', cwd: core.TOOLS, timeout: 60000
      });
    } catch (e) { /* build 失败会在报告中体现 */ }
    result.meta.sourceModified = true;
  } else {
    result.meta.sourceModified = false;
  }

  var report = reporter.generate(result);

  if (opts.jsonOnly) {
    console.log(report.json);
  } else {
    console.log('Design QA 完成 · ' + result.meta.page);
    console.log('');
    core.DIMENSIONS.forEach(function(d) {
      var s = result.dimStatus[d.id];
      console.log('  ' + ({ PASS: '✅', FAIL: '❌', WARNING: '⚠️', BLOCKED: '🚫', 'NOT CHECKED': '⬜' }[s]) +
        ' ' + d.id + ' ' + d.name + '：' + s);
    });
    console.log('');
    console.log('  总体结论：' + result.overall + '　|　修复轮次：' + rounds.length);
    console.log('  报告：' + core.rel(core.ROOT, report.md));
    console.log('  数据：' + core.rel(core.ROOT, report.json));
  }

  // 退出码：FAIL = 1；BLOCKED/WARNING/PASS = 0（不阻断交付但需说明）
  process.exit(result.overall === STATUS.FAIL ? 1 : 0);
}

main();
