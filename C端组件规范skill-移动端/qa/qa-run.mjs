#!/usr/bin/env node
// Design QA · 主入口（校验 → 修复 → 二次校验 → 报告）
//
// 用法:
//   node qa/qa-run.mjs --target <file|dir> [--target <file>...] \
//        [--spec qa/specs/xxx.json] [--reference <png>] [--screenshot <png>] \
//        [--reference-source figma-final|approved-design|product-prototype] \
//        [--fix] [--max-rounds 3] [--max-diff 0.05] [--python python3] \
//        [--out qa/reports] [--strict]
//
// 设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付（SKILL.md Step 14-17）

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext, SKILL_ROOT } from './lib/context.mjs';
import { extractHtml } from './lib/html-extract.mjs';
import { extractJs } from './lib/js-extract.mjs';
import { dimensionStatus, STATUS } from './lib/issue.mjs';
import { RULES, missingEvidence } from './rules/index.mjs';
import { QA_PARAMS } from './rules/05-visual.mjs';
import { planFixes, applyFixes } from './fixes/auto-fix.mjs';
import { buildReport } from './lib/report.mjs';
import { buildScript, codeCheckIssues } from './lib/code-check.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const a = { targets: [], spec: null, specPath: null, reference: null, screenshot: null,
    referenceSource: null, fix: false, maxRounds: 3, out: path.join(HERE, 'reports'),
    strict: false, python: 'python3', maxDiff: QA_PARAMS.maxDiff, jsonOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = argv[i + 1];
    switch (k) {
      case '--target': a.targets.push(v); i++; break;
      case '--spec': a.specPath = v; i++; break;
      case '--reference': a.reference = v; i++; break;
      case '--screenshot': a.screenshot = v; i++; break;
      case '--reference-source': a.referenceSource = v; i++; break;
      case '--fix': a.fix = true; break;
      case '--max-rounds': a.maxRounds = parseInt(v, 10); i++; break;
      case '--max-diff': a.maxDiff = parseFloat(v); i++; break;
      case '--python': a.python = v; i++; break;
      case '--out': a.out = v; i++; break;
      case '--strict': a.strict = true; break;
      case '--json-only': a.jsonOnly = true; break;
      default: if (k.startsWith('--')) { console.error('未知参数: ' + k); process.exit(2); }
    }
  }
  return a;
}

function expandTargets(list) {
  const out = [];
  for (const t of list) {
    const abs = path.resolve(t);
    if (!fs.existsSync(abs)) { console.error('目标不存在: ' + abs); continue; }
    if (fs.statSync(abs).isDirectory()) {
      for (const f of fs.readdirSync(abs)) if (/\.(html|js|mjs)$/.test(f)) out.push(path.join(abs, f));
    } else out.push(abs);
  }
  return [...new Set(out)];
}

function buildTarget(abs, ctx) {
  const ext = path.extname(abs).toLowerCase();
  const type = ext === '.html' || ext === '.htm' ? 'html' : 'js';
  const raw = fs.readFileSync(abs, 'utf8');
  // 静态提取始终针对「交付物原文件」本身，避免 preamble 内容污染组件引用/legacy 判定。
  const target = { path: abs, type, raw, composed: false };
  if (type === 'html') target.html = extractHtml(raw);
  else target.js = extractJs(raw);
  // 代码检查/构建阶段才按 INDEX.md 把模板插入 preamble IIFE 占位符
  if (type === 'js' && /tpl-.*\.js$/.test(path.basename(abs)) && ctx.files.preamble.ok) {
    target.composed = true;
    target.buildMode = 'placeholder';
    target.builtCode = buildScript(ctx.files.preamble.text, raw).code;
  }
  return target;
}

function runOnce(ctx, target, opts) {
  const issues = [];
  const dimensions = [];
  const conditions = [];
  for (const rule of RULES) {
    const miss = missingEvidence(ctx, rule);
    if (miss) {
      dimensions.push({ ...rule.meta, status: STATUS.BLOCKED, note: '依据缺失: ' + miss.join(','), stats: {} });
      conditions.push(`${rule.meta.name}：依据文件缺失 ${miss.join(',')}`);
      continue;
    }
    let r;
    try { r = rule.check(ctx, target, opts); }
    catch (e) {
      r = { issues: [{ id: 'X-' + rule.meta.id, dimension: rule.meta.name,
        description: '校验器执行异常: ' + e.message, location: target.path,
        spec: 'Design QA 引擎', severity: 'MAJOR', suggestion: '修复校验器',
        result: STATUS.BLOCKED, evidence: e.stack?.split('\n')[1] || '' }], note: '校验器异常', stats: {} };
    }
    issues.push(...r.issues);
    const st = dimensionStatus(r.issues, { hasChecked: !r.blocked, conditionNote: r.note || '' });
    dimensions.push({ ...rule.meta, status: st.status, note: st.note, stats: r.stats || {} });
    if (r.note) conditions.push(`${rule.meta.name}：${r.note}`);
  }
  return { issues, dimensions, conditions };
}

function summarize(issues) {
  return {
    total: issues.length,
    fail: issues.filter(i => i.result === STATUS.FAIL).length,
    warning: issues.filter(i => i.result === STATUS.WARNING).length,
    blocked: issues.filter(i => i.result === STATUS.BLOCKED).length,
    notChecked: issues.filter(i => i.result === STATUS.NOT_CHECKED).length,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  QA_PARAMS.maxDiff = opts.maxDiff;
  if (!opts.targets.length) {
    console.log('用法: node qa/qa-run.mjs --target <file|dir> [--spec <json>] [--fix] ...');
    process.exit(0);
  }
  if (opts.specPath) {
    const p = path.resolve(opts.specPath);
    opts.spec = JSON.parse(fs.readFileSync(p, 'utf8'));
    opts.specPath = p;
  }
  const ctx = loadContext();
  const targets = expandTargets(opts.targets);
  fs.mkdirSync(opts.out, { recursive: true });
  const results = [];

  for (const abs of targets) {
    const startedAt = new Date().toISOString();
    let target = buildTarget(abs, ctx);
    const rounds = [];
    const fixLog = [];
    let last;

    for (let round = 1; round <= opts.maxRounds; round++) {
      last = runOnce(ctx, target, { ...opts, spec: opts.spec });
      const fixable = last.issues.filter(i => i.autoFixable && (i.result === STATUS.FAIL || i.result === STATUS.WARNING));
      let fixCount = 0;
      if (opts.fix && fixable.length && round < opts.maxRounds) {
        const plan = planFixes(fixable, target.raw);
        if (plan.edits.length) {
          const applied = applyFixes(abs, plan.edits, path.join(opts.out, 'backups'));
          if (applied.changed) {
            fixCount = applied.applied.length;
            fixLog.push({ round, target: path.basename(abs), applied: applied.applied, skipped: plan.skipped, backup: applied.backup });
            // 二次校验：重新读取 + 重新提取
            target = buildTarget(abs, ctx);
          }
        }
        if (plan.skipped.length && !fixCount) fixLog.push({ round, target: path.basename(abs), applied: [], skipped: plan.skipped, backup: '—' });
      }
      rounds.push({ issues: last.issues, fixCount });
      if (!fixCount) break; // 无新增修复 → 收敛
    }

    // 最终一轮用收敛后的 issues
    const final = last || runOnce(ctx, target, { ...opts, spec: opts.spec });

    // ── 代码检查 / 构建 / 自动化测试（独立阶段，收敛后针对最终状态执行）──
    let codeIssues = [];
    try { codeIssues = codeCheckIssues(ctx, target, opts); }
    catch (e) {
      codeIssues = [{ id: 'K-ERR', dimension: '代码检查 / 构建 / 测试',
        description: '代码检查阶段异常：' + e.message, location: abs, spec: 'Design QA 引擎',
        severity: 'MAJOR', suggestion: '修复检查器', result: STATUS.BLOCKED, evidence: e.stack?.split('\n')[1] || '' }];
    }
    const codeFail = codeIssues.filter(i => i.result === STATUS.FAIL).length;
    const codeBlocked = codeIssues.filter(i => i.result === STATUS.BLOCKED).length;

    const sum = summarize(final.issues);
    const totalFail = sum.fail + codeFail;
    let verdict;
    if (totalFail > 0) verdict = { status: STATUS.FAIL, reason: `仍有 ${totalFail} 项硬性违规未解决（六维 ${sum.fail} + 代码检查 ${codeFail}，见第 8 节）` };
    else if (sum.blocked > 0) verdict = { status: STATUS.BLOCKED, reason: `校验条件不足 ${sum.blocked} 项，需补齐依据或人工裁决` };
    else if (sum.notChecked > 0 || sum.warning > 0) verdict = { status: STATUS.WARNING, reason: `无硬性违规；${sum.notChecked} 项未检查 / ${sum.warning} 项提示，已如实标注` };
    else verdict = { status: STATUS.PASS, reason: '所有适用硬性规则已实际检查并通过' };

    const conditions = [...new Set(final.conditions)];
    if (opts.spec && opts.spec.source !== 'prd') conditions.push(`需求依据 source=${opts.spec.source}（非真实 PRD），需求还原结论不可用于验收`);
    if (!opts.reference || !opts.screenshot) conditions.push('未提供 Figma 终稿参考图与渲染截图，视觉还原维度按 BLOCKED 处理（不假装校验）');
    if (ctx.missing.length) conditions.push('skill 依据文件缺失：' + ctx.missing.join(', '));

    const result = {
      target: { path: abs, type: target.type, composed: target.composed,
        specPath: opts.specPath, specSource: opts.spec?.source || null,
        reference: opts.reference, referenceSource: opts.referenceSource },
      ctx, rounds, dimensions: final.dimensions, issues: final.issues,
      codeIssues, codeFail, codeBlocked, fixLog, conditions,
      startedAt, finishedAt: new Date().toISOString(), verdict, summary: { ...sum, totalFail, codeFail, codeBlocked },
    };
    const base = path.basename(abs).replace(/\.[^.]+$/, '') + '-' + new Date().toISOString().replace(/[:.]/g, '-');
    const mdPath = path.join(opts.out, base + '.md');
    const jsonPath = path.join(opts.out, base + '.json');
    fs.writeFileSync(mdPath, buildReport(result), 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8');
    results.push({ file: abs, verdict, summary: sum, mdPath, jsonPath });

    console.log(`\n[Design QA] ${abs}`);
    console.log(`  轮次=${rounds.length}  六维问题=${sum.total} FAIL=${sum.fail} WARNING=${sum.warning} BLOCKED=${sum.blocked} NOT_CHECKED=${sum.notChecked}`);
    console.log(`  代码检查: ${codeIssues.length} 项（FAIL=${codeFail} BLOCKED=${codeBlocked}）`);
    console.log(`  判定=${verdict.status} — ${verdict.reason}`);
    for (const d of final.dimensions) console.log(`    ${d.id} ${d.name}: ${d.status}`);
    console.log(`  报告: ${mdPath}`);
  }
  const bad = results.some(r => r.verdict.status === STATUS.FAIL || r.verdict.status === STATUS.BLOCKED);
  if (opts.strict && bad) process.exit(1);
}

main().catch(e => { console.error('[Design QA] 引擎异常:', e); process.exit(2); });
