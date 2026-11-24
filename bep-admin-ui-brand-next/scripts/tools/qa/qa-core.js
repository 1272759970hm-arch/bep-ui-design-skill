#!/usr/bin/env node
// Design QA 公共工具与数据结构
// 依赖：仅 Node 内置 fs/path。所有脚本遵循零依赖约定，与 validate-page.js 一致。

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '../../..');        // skill 根目录（本文件在 scripts/tools/qa/ 下）
var TOOLS = path.join(ROOT, 'scripts', 'tools');
var PAGES_DIR = path.join(ROOT, 'pages');
var REFERENCES_DIR = path.join(ROOT, 'references');
var COMPONENTS = path.join(ROOT, 'scripts', 'bep-components.js');
var QA_DIR = path.join(TOOLS, 'qa');
var EVIDENCE_DIR = path.join(QA_DIR, 'evidence');      // 视觉参考/PRD 证据目录

// ── 校验状态（五态）────────────────────────────────────────────────────────
var STATUS = {
  PASS: 'PASS',           // 实际执行检查且通过
  FAIL: 'FAIL',           // 实际执行检查且发现违规
  WARNING: 'WARNING',     // 实际执行检查，发现建议项或证据不足的观察
  BLOCKED: 'BLOCKED',     // 缺少校验条件，无法执行（如无 PRD / 无 Figma 真源）
  NOT_CHECKED: 'NOT CHECKED' // 明确未检查（不得当作 PASS）
};

// 严重度：沿用 design-review.md 的「阻塞 / 建议」两级
var SEVERITY = { BLOCKER: '阻塞', SUGGESTION: '建议', INFO: '提示' };

var DIMENSIONS = [
  { id: 'D1', name: '需求还原', enabled: true },
  { id: 'D2', name: '设计规范', enabled: true },
  { id: 'D3', name: '组件引用', enabled: true },
  { id: 'D4', name: '组件使用', enabled: true },
  { id: 'D5', name: '视觉还原', enabled: true },
  { id: 'D6', name: '交互逻辑', enabled: true }
];

// 创建一条 finding。所有维度必须用本函数产出，保证报告字段统一。
function finding(opts) {
  return {
    dimension: opts.dimension,          // D1..D6
    code: opts.code || null,            // 规则编码，如 D2-TOKEN-COLOR-001
    status: opts.status,                // STATUS.*
    severity: opts.severity || SEVERITY.INFO,
    problem: opts.problem || '',        // 问题描述
    location: opts.location || null,    // { file, line, detail }
    spec: opts.spec || null,            // 对应规范来源（文件 §章节）
    suggestion: opts.suggestion || null,// 修复建议
    fixable: opts.fixable === true,     // 是否可被自动修复器处理
    fixed: false,                       // 闭环中是否被自动修复
    recheck: null                       // 二次校验结论
  };
}

function read(file) {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

function stripComments(src) {
  return String(src || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function lineOf(src, index) {
  return String(src || '').slice(0, index).split(/\r?\n/).length;
}

function loc(file, line, detail) {
  return { file: file, line: line || null, detail: detail || null };
}

// 维度状态聚合：FAIL > BLOCKED > WARNING > PASS > NOT CHECKED
// 规则：有 FAIL 则 FAIL；否则有 BLOCKED 则 BLOCKED；否则有 WARNING 则 WARNING；
//       否则只要有任意实际检查项（PASS/FAIL/WARNING）即 PASS；全为 NOT CHECKED 则 NOT CHECKED。
function aggregateStatus(findings) {
  var hasFail = findings.some(function(f) { return f.status === STATUS.FAIL; });
  var hasBlocked = findings.some(function(f) { return f.status === STATUS.BLOCKED; });
  var hasWarn = findings.some(function(f) { return f.status === STATUS.WARNING; });
  var hasChecked = findings.some(function(f) {
    return f.status === STATUS.PASS || f.status === STATUS.FAIL || f.status === STATUS.WARNING;
  });
  if (hasFail) return STATUS.FAIL;
  if (hasBlocked) return STATUS.BLOCKED;
  if (hasWarn) return STATUS.WARNING;
  if (hasChecked) return STATUS.PASS;
  return STATUS.NOT_CHECKED;
}

function countBy(findings, status) {
  return findings.filter(function(f) { return f.status === status; }).length;
}

function writeReport(outDir, filename, content) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  var file = path.join(outDir, filename);
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

function rel(root, file) {
  if (!file) return null;
  return path.relative(root, file).replace(/\\/g, '/');
}

module.exports = {
  ROOT: ROOT, TOOLS: TOOLS, PAGES_DIR: PAGES_DIR, REFERENCES_DIR: REFERENCES_DIR,
  COMPONENTS: COMPONENTS, QA_DIR: QA_DIR, EVIDENCE_DIR: EVIDENCE_DIR,
  STATUS: STATUS, SEVERITY: SEVERITY, DIMENSIONS: DIMENSIONS,
  finding: finding, read: read, stripComments: stripComments, lineOf: lineOf,
  loc: loc, aggregateStatus: aggregateStatus, countBy: countBy,
  writeReport: writeReport, rel: rel
};
