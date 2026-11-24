#!/usr/bin/env node
/**
 * BEP-S Design QA Engine · CLI
 *
 *   node qa/qa.mjs run   --target <产物> [--prd <需求卡.json>] [--reference <figma.png>] [--reference-kind figma|prd-prototype] [--out <目录>] [--max-iterations 3]
 *   node qa/qa.mjs check --target <产物> [...]        # 只校验，不修复
 *   node qa/qa.mjs fix   --target <产物> [...]        # 单轮修复 + 二次校验
 *   node qa/qa.mjs selftest                            # 用内置样例验证引擎本身
 *
 * 设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import { loadEvidence } from './lib/evidence.mjs';
import { loadArtifact } from './lib/artifact.mjs';
import { runBrowserProbe } from './lib/browser.mjs';
import { runAllCheckers } from './checkers/index.mjs';
import { applyFixers } from './fixers/index.mjs';
import { summarize } from './lib/status.mjs';
import { buildReport, writeReports, renderMarkdown } from './lib/report.mjs';

const qaRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(qaRoot, '..');

function parseArgs(argv) {
  const a = { mode: 'run', target: null, prd: null, reference: null, referenceKind: null, out: null, maxIterations: null, viewport: null, json: false };
  if (argv[0] && !argv[0].startsWith('--')) { a.mode = argv.shift(); }
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--json') { a.json = true; continue; }
    const v = argv[i + 1];
    if (k === '--target') a.target = v;
    else if (k === '--prd') a.prd = v;
    else if (k === '--reference') a.reference = v;
    else if (k === '--reference-kind') a.referenceKind = v;
    else if (k === '--out') a.out = v;
    else if (k === '--max-iterations') a.maxIterations = Number(v);
    else if (k === '--viewport') a.viewport = v.split(',').map(Number);
    else continue;
    i++;
  }
  return a;
}

function readJson(p) {
  if (!p) return null;
  const abs = path.resolve(p);
  if (!fs.existsSync(abs)) throw new Error(`输入文件不存在：${abs}`);
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function sha256(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0, 16);
}

function buildCtx(base) {
  const { args, config, catalog, evidence, art, prd, catalogHash, qaRoot } = base;
  const browser = runBrowserProbe(art, config, { viewport: args.viewport || undefined });

  const availableSources = [
    ...evidence.used, 'artifact',
    ...(prd ? ['prd'] : []),
    ...(args.reference && args.referenceKind === 'figma' ? ['reference'] : []),
    ...(browser.ok ? ['browser'] : []),
    ...(browser.screenshot ? ['screenshot'] : [])
  ];

  return {
    qaRoot, skillRoot, args, config, catalog, evidence, art, prd, browser,
    reference: args.reference ? path.resolve(args.reference) : null,
    referenceKind: args.referenceKind,
    availableSources,
    rulesById: new Map(catalog.rules.map((r) => [r.id, r])),
    fileLabel: path.basename(art.abs),
    catalogHash,
    inputs: {
      prd: prd ? path.basename(path.resolve(args.prd)) : null,
      reference: args.reference ? path.basename(path.resolve(args.reference)) : null,
      referenceKind: args.referenceKind || null
    }
  };
}

export function runQA(args) {
  const config = JSON.parse(fs.readFileSync(path.join(qaRoot, 'qa.config.json'), 'utf8'));
  const catalogPath = path.join(qaRoot, 'rules', 'rule-catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const catalogHash = sha256(catalogPath);

  if (!args.target) throw new Error('必须指定 --target <产物文件>');
  const target = path.resolve(args.target);
  const prd = readJson(args.prd);
  const evidence = loadEvidence(config, skillRoot);
  let art = loadArtifact(target);

  const maxIterations = args.maxIterations ?? (args.mode === 'fix' ? 1 : config.thresholds.maxIterations);
  const doFix = args.mode !== 'check';
  const base = { args, config, catalog, evidence, prd, catalogHash, qaRoot };

  const iterations = [];
  const fixRecords = [];
  let ctx, checks, summary, lastApplied = [], lastSkipped = [];
  let round = 1;
  let backupWritten = false;

  while (round <= maxIterations + 1) {
    ctx = buildCtx({ ...base, art });
    checks = runAllCheckers(ctx);
    summary = summarize(checks);
    iterations.push({
      round,
      phase: round === 1 ? 'check' : 'recheck',
      statusSummary: summary,
      fixesApplied: lastApplied.map((f) => f.detail),
      fixesSkipped: lastSkipped.map((s) => `${s.ruleId}: ${s.reason}`),
      ruleCatalogHash: catalogHash
    });

    // 规则目录防篡改：修复过程不得改动阈值/规则来"通过"校验
    if (sha256(catalogPath) !== catalogHash) throw new Error('规则目录在校验过程中被改动，已中止（禁止通过改规则来通过校验）');

    if (!doFix || round > maxIterations) break;

    const fixRes = applyFixers({ ...ctx, checks }, art);
    lastApplied = fixRes.applied;
    lastSkipped = fixRes.skipped;
    if (!fixRes.applied.length || !fixRes.changed) {
      iterations.push({ round, phase: 'fix', statusSummary: summary, fixesApplied: [], fixesSkipped: lastSkipped.map((s) => `${s.ruleId}: ${s.reason}`), note: '无可自动修复项或本轮无进展，闭环停止' });
      break;
    }

    if (!backupWritten) {
      fs.writeFileSync(`${target}.bak`, fs.readFileSync(target));
      backupWritten = true;
    }
    fs.writeFileSync(target, fixRes.raw, 'utf8');
    for (const f of fixRes.applied) fixRecords.push({ ...f, round: round + 1, ok: true });
    art = loadArtifact(target);
    round++;
  }

  const unresolved = checks.flatMap((c) => c.issues).filter((i) => !i.fixApplied).map((i) => ({
    ...i,
    unresolvedReason: i.fixable
      ? '规则允许自动修复，但未找到确定性的真值映射，按 fixPolicy 禁止猜测'
      : '不可自动修复：修复会改变业务逻辑 / 需求范围 / 组件真值，或缺少必要输入，需人工处理并补齐条件',
    verification: { ...i.verification, detail: `${i.verification.detail}；未自动修复` }
  }));

  const report = buildReport({
    checks, catalog, art, evidence, summary, iterations, fixRecords, unresolved,
    meta: { target, ruleCatalogHash: catalogHash, inputs: ctx.inputs }
  });
  report.meta.ruleCatalogHash = catalogHash;

  const outDir = args.out ? path.resolve(args.out) : path.join(qaRoot, 'reports');
  const basename = path.basename(target).replace(/\.[^.]+$/, '');
  const files = writeReports(report, outDir, basename);
  return { report, files, iterations, fixRecords };
}

function selftest() {
  const config = JSON.parse(fs.readFileSync(path.join(qaRoot, 'qa.config.json'), 'utf8'));
  const cases = [
    { name: 'bad.html', file: path.join(qaRoot, 'fixtures', 'bad.html'), expectFail: ['R2-02', 'R6-06'] },
    { name: 'good.html', file: path.join(qaRoot, 'fixtures', 'good.html'), expectNoFail: ['R6-06'] }
  ];
  const results = [];
  for (const t of cases) {
    const r = runQA({ mode: 'check', target: t.file, prd: null, reference: null, referenceKind: null, out: path.join(qaRoot, 'reports', 'selftest'), maxIterations: 0, viewport: null });
    const fails = r.report.checks.filter((c) => c.status === 'FAIL').map((c) => c.ruleId);
    const ok = (!t.expectFail || t.expectFail.every((x) => fails.includes(x)))
      && (!t.expectNoFail || t.expectNoFail.every((x) => !fails.includes(x)));
    results.push({ case: t.name, ok, fails, overall: r.report.statusSummary.overall,
      blocked: r.report.statusSummary.counts.BLOCKED, notChecked: r.report.statusSummary.counts['NOT CHECKED'] });
  }
  const pass = results.every((r) => r.ok);
  return { pass, results };
}

const args = parseArgs(process.argv.slice(2));
try {
  if (args.mode === 'selftest') {
    const r = selftest();
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.pass ? 0 : 1);
  }
  const { report, files, iterations, fixRecords } = runQA(args);
  const s = report.statusSummary;
  console.log(`\nDesign QA · ${path.basename(args.target)}`);
  console.log(`总体 ${s.overall} | PASS ${s.counts.PASS} FAIL ${s.counts.FAIL} WARNING ${s.counts.WARNING} BLOCKED ${s.counts.BLOCKED} NOT CHECKED ${s.counts['NOT CHECKED']}`);
  console.log(`问题 ${s.issueCount} 项（P0 ${s.p0Count}）| 可宣称通过 ${s.canClaimPass ? '是' : '否'} | 可交付 ${s.deliverable ? '是' : '否'}`);
  console.log(`迭代 ${iterations.length} 轮 | 自动修复 ${fixRecords.length} 项 | 未解决 ${report.unresolved.length} 项 | 条件不足 ${report.conditionGaps.length} 项`);
  console.log(`\n报告：\n  ${files.jsonPath}\n  ${files.mdPath}\n  ${files.htmlPath}`);
  if (args.json) console.log('\n' + JSON.stringify(report, null, 2));
} catch (e) {
  console.error(`\n[Design QA] 执行失败：${e.message}\n${e.stack || ''}`);
  process.exit(1);
}
