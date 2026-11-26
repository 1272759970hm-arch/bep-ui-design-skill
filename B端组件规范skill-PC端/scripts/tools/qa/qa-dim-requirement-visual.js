#!/usr/bin/env node
// D1 需求还原 + D5 视觉还原校验
// 这两个维度依赖"外部真源"：PRD/需求清单（D1）、Figma 设计稿/标准参考（D5）。
// 无真源时必须标记 BLOCKED，绝不假装 PASS。有真源时做可执行的字段/结构比对。

var fs = require('fs');
var path = require('path');
var core = require('./qa-core');
var STATUS = core.STATUS, SEVERITY = core.SEVERITY, finding = core.finding;

// 证据文件查找顺序：显式传入 > evidence 目录约定文件名
function findEvidence(ctx, filename, explicit) {
  if (explicit && fs.existsSync(explicit)) return explicit;
  // 约定：evidence/<模块>/<页面>.<ext> 或 evidence/<页面>.<ext>
  var candidates = [
    path.join(core.EVIDENCE_DIR, ctx.modName, ctx.pageBase + '.' + filename),
    path.join(core.EVIDENCE_DIR, ctx.pageBase + '.' + filename),
    path.join(core.EVIDENCE_DIR, filename)
  ];
  for (var i = 0; i < candidates.length; i++) {
    // filename 可能是 'prd'/'figma'，需拼扩展名
  }
  return null;
}

function locateRequirement(ctx) {
  if (ctx.prdFile && fs.existsSync(ctx.prdFile)) return ctx.prdFile;
  var exts = ['prd.md', 'requirements.md', 'prd.txt'];
  var dirs = [
    path.join(core.EVIDENCE_DIR, ctx.modName, ctx.pageBase),
    path.join(core.EVIDENCE_DIR, ctx.modName),
    path.join(core.EVIDENCE_DIR, ctx.pageBase)
  ];
  var i, j, f;
  for (i = 0; i < dirs.length; i++) {
    for (j = 0; j < exts.length; j++) {
      f = path.join(dirs[i], exts[j]);
      if (fs.existsSync(f)) return f;
    }
  }
  return null;
}

function locateVisualRef(ctx) {
  if (ctx.figmaFile && fs.existsSync(ctx.figmaFile)) return ctx.figmaFile;
  var exts = ['figma.json', 'reference.json', 'visual.json', 'figma.md', 'reference.md'];
  var dirs = [
    path.join(core.EVIDENCE_DIR, ctx.modName, ctx.pageBase),
    path.join(core.EVIDENCE_DIR, ctx.modName),
    path.join(core.EVIDENCE_DIR, ctx.pageBase)
  ];
  var i, j, f;
  for (i = 0; i < dirs.length; i++) {
    for (j = 0; j < exts.length; j++) {
      f = path.join(dirs[i], exts[j]);
      if (fs.existsSync(f)) return f;
    }
  }
  return null;
}

// ── D1 需求还原 ──────────────────────────────────────────────────────────────
function checkRequirement(ctx) {
  var findings = [];
  var file = ctx.pageRel;
  var prd = locateRequirement(ctx);

  if (!prd) {
    findings.push(finding({
      dimension: 'D1', code: 'D1-EVIDENCE-000', status: STATUS.BLOCKED, severity: SEVERITY.BLOCKER,
      problem: '未提供 PRD/需求清单真源，无法校验需求还原（功能/字段/流程/交互是否遗漏或擅自增加）',
      location: null,
      spec: 'references/design-process.md §二 八问',
      suggestion: '将 PRD 放到 evidence/<模块>/<页面>/prd.md，或用 --prd <文件> 指定；否则本维度记为 BLOCKED，禁止标 PASS'
    }));
    return findings;
  }

  var prdSrc = fs.readFileSync(prd, 'utf8');
  // 抽取 PRD 中的字段关键词（以反引号、粗体、或"字段："标注的短词）
  var fields = {};
  var m;
  var fRe = /[`*]{1,2}([一-龥A-Za-z][一-龥A-Za-z0-9]{1,12})[`*]{1,2}/g;
  while ((m = fRe.exec(prdSrc))) fields[m[1]] = true;
  var labelRe = /(?:字段|列名|表单项)[：:]\s*([一-龥A-Za-z][一-龥A-Za-z0-9]{1,12})/g;
  while ((m = labelRe.exec(prdSrc))) fields[m[1]] = true;

  var fieldList = Object.keys(fields);
  var missing = fieldList.filter(function(f) { return ctx.src.indexOf(f) === -1; });
  ctx.metrics = ctx.metrics || {};
  ctx.metrics.prdFields = fieldList.length;
  ctx.metrics.prdFieldsCovered = fieldList.length - missing.length;
  ctx.metrics.prdSource = core.rel(core.ROOT, prd);

  if (missing.length) {
    findings.push(finding({
      dimension: 'D1', code: 'D1-FIELD-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
      problem: 'PRD 中提及的字段未在页面源码中找到：' + missing.slice(0, 10).join('、') + (missing.length > 10 ? ' 等 ' + missing.length + ' 项' : ''),
      location: core.loc(file, null, null),
      spec: 'references/design-process.md §二 / SKILL.md 执行铁律 #7',
      suggestion: '逐项确认：确为字段则补齐；若为说明性文案则不计入业务字段（避免把提示文案包装成字段）'
    }));
  }
  findings.push(finding({
    dimension: 'D1', code: 'D1-SUMMARY', status: STATUS.PASS, severity: SEVERITY.INFO,
    problem: '已基于 PRD 执行字段比对：' + (fieldList.length - missing.length) + '/' + fieldList.length + ' 项字段在页面中出现（基于文本匹配，需人工确认语义）',
    location: null,
    spec: core.rel(core.ROOT, prd)
  }));
  return findings;
}

// ── D5 视觉还原 ──────────────────────────────────────────────────────────────
function checkVisual(ctx) {
  var findings = [];
  var file = ctx.pageRel;
  var ref = locateVisualRef(ctx);

  if (!ref) {
    findings.push(finding({
      dimension: 'D5', code: 'D5-EVIDENCE-000', status: STATUS.BLOCKED, severity: SEVERITY.BLOCKER,
      problem: '未提供 Figma 设计稿数据/标准参考，无法执行截图比对与偏差分析',
      location: null,
      spec: 'references/page-layouts.md / references/design-tokens.md',
      suggestion: '用 figma-devmode-read 读取设计稿节点并导出参考 JSON 到 evidence/<模块>/<页面>/figma.json，或用 --figma <文件> 指定；否则本维度记为 BLOCKED'
    }));
    // 无参考时，仍可做"可程序化的视觉结构代理检查"：布局常量、卡片阴影等
    var cardShadow = /bepFrame\([^)]*\)[\s\S]{0,120}?\.effects\s*=|card\.effects\s*=/.test(ctx.clean);
    if (cardShadow) {
      findings.push(finding({
        dimension: 'D5', code: 'D5-PROXY-SHADOW-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '页面级 Card 设置了 effects 阴影（疑似），规范要求页面级卡片默认无阴影',
        location: core.loc(file, null, null),
        spec: 'SKILL.md §页面结构 页面级 Card 默认无阴影',
        suggestion: '仅弹窗/抽屉/冻结列/悬浮层允许显式 effects；普通页面 Card 去掉阴影'
      }));
    }
    return findings;
  }

  var refSrc = fs.readFileSync(ref, 'utf8');
  var refData = null;
  try { refData = JSON.parse(refSrc); } catch (e) { /* 允许 Markdown 描述 */ }

  // 有参考：做尺寸/节点结构的可执行比对（若参考 JSON 含 dimensions）
  if (refData && refData.dimensions) {
    var dims = refData.dimensions;
    var mismatches = [];
    Object.keys(dims).forEach(function(k) {
      var want = dims[k];
      var re = new RegExp('\\b' + k + '\\s*=\\s*(\\d+)');
      var m = re.exec(ctx.clean);
      if (m && parseInt(m[1], 10) !== want) {
        mismatches.push(k + ': 页面=' + m[1] + ' 参考=' + want);
      }
    });
    if (mismatches.length) {
      findings.push(finding({
        dimension: 'D5', code: 'D5-DIM-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: '页面尺寸与 Figma 参考不一致：' + mismatches.join('；'),
        location: core.loc(file, null, null),
        spec: core.rel(core.ROOT, ref) + ' / references/page-layouts.md',
        suggestion: '按参考尺寸修正布局常量；如为适配差异请更新参考并说明'
      }));
    } else {
      findings.push(finding({
        dimension: 'D5', code: 'D5-SUMMARY', status: STATUS.PASS, severity: SEVERITY.INFO,
        problem: '已基于 Figma 参考执行尺寸比对，布局常量一致（像素级视觉比对仍需人工截图确认）',
        location: null,
        spec: core.rel(core.ROOT, ref)
      }));
    }
  } else {
    findings.push(finding({
      dimension: 'D5', code: 'D5-LIMITED-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
      problem: '参考文件已读取但无可解析的 dimensions 数据，无法自动比对；像素级截图比对不在脚本能力内',
      location: null,
      spec: core.rel(core.ROOT, ref),
      suggestion: '提供含 dimensions 节点的 Figma JSON，或人工截图比对后在交付说明中记录偏差'
    }));
  }

  // 原型≠视觉真源：提醒不得照搬原型布局
  findings.push(finding({
    dimension: 'D5', code: 'D5-PRINCIPLE-001', status: STATUS.NOT_CHECKED, severity: SEVERITY.INFO,
    problem: '视觉还原度（间距/对齐/信息层级/组件比例的像素级一致）需人工截图比对，脚本不作自动 PASS 判定',
    location: null,
    spec: 'SKILL.md §内置 RAG / references/page-layouts.md',
    suggestion: '产品原型仅作需求依据，不得照搬其布局视觉；以 Figma 设计稿为真源做走查'
  }));
  return findings;
}

module.exports = {
  checkRequirement: checkRequirement,
  checkVisual: checkVisual
};
