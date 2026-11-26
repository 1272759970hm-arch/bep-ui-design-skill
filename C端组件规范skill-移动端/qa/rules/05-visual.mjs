// 维度 5 · 视觉还原校验
// 依据：Figma 终稿 / 已批准设计稿的截图（reference）+ 实际渲染截图（screenshot）。
// 产品原型只作需求依据，禁止作为视觉基准（用户明确要求）。
// 没有参考图 / 没有渲染环境 → BLOCKED，绝不标 PASS。

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { issue, STATUS, SEVERITY } from '../lib/issue.mjs';

export const meta = { id: '05', key: 'visual', name: '视觉还原校验', requires: ['registry'] };

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIFF_SCRIPT = path.join(HERE, '..', 'lib', 'visual-diff.py');

// QA 过程参数（不是设计规范）：可用 --max-diff 覆盖；仅用于像素比对判定
export const QA_PARAMS = { maxDiff: 0.05, warnDiff: 0.02, canvasWidth: 375 };

export function check(ctx, target, opts = {}) {
  const issues = [];
  const stats = { screenshots: 0, compared: 0 };
  let note = '';
  const ref = opts.reference, shot = opts.screenshot;
  const src = opts.referenceSource || (ref ? 'unspecified' : null);

  if (!ref || !shot) {
    return {
      issues: [issue({
        id: 'V-000', dimension: meta.name,
        description: '缺少 Figma 终稿参考截图或实际渲染截图，视觉还原校验未执行',
        location: `reference=${ref || '未提供'} / screenshot=${shot || '未提供'}`,
        spec: 'Design QA 机制：有视觉参考时必须做截图比对；条件不足不得标 PASS',
        severity: SEVERITY.MAJOR,
        suggestion: '提供 --reference <figma-final.png> --screenshot <render.png>；渲染用无头 Chrome 截图',
        result: STATUS.BLOCKED, evidence: '文件参数缺失',
      })],
      note: '校验条件不足：缺少参考图 / 渲染截图', stats, blocked: true,
    };
  }

  if (src === 'product-prototype' || /prototype|原型/i.test(src)) {
    return {
      issues: [issue({
        id: 'V-001', dimension: meta.name,
        description: '参考来源是产品原型，禁止作为视觉还原基准',
        location: ref, spec: 'Design QA 工作流要求：产品原型只作为需求依据，不得直接照搬其布局和视觉',
        severity: SEVERITY.BLOCKER, suggestion: '换成 Figma 终稿 / 已批准设计稿截图',
        result: STATUS.BLOCKED, evidence: 'referenceSource=' + src,
      })],
      note: '参考来源不合规：产品原型', stats, blocked: true,
    };
  }

  if (!fs.existsSync(ref) || !fs.existsSync(shot)) {
    return { issues: [issue({ id: 'V-002', dimension: meta.name,
      description: '参考图或渲染图文件不存在', location: `${ref} / ${shot}`,
      spec: 'Design QA 视觉比对', severity: SEVERITY.MAJOR, suggestion: '检查文件路径',
      result: STATUS.BLOCKED, evidence: 'fs.existsSync=false' })],
      note: '校验条件不足：文件不存在', stats, blocked: true };
  }

  const py = opts.python || 'python3';
  const r = spawnSync(py, [DIFF_SCRIPT, ref, shot], { encoding: 'utf8' });
  let data;
  try { data = JSON.parse(r.stdout.trim()); }
  catch (e) {
    return { issues: [issue({ id: 'V-003', dimension: meta.name,
      description: '视觉比对脚本未返回有效结果（可能缺少 Pillow）',
      location: DIFF_SCRIPT, spec: 'Design QA 视觉比对',
      severity: SEVERITY.MAJOR, suggestion: '安装 Pillow 或指定 --python',
      result: STATUS.BLOCKED, evidence: (r.stderr || r.stdout || '').slice(0, 200) })],
      note: '校验条件不足：比对脚本不可用', stats, blocked: true };
  }
  if (!data.ok) {
    return { issues: [issue({ id: 'V-004', dimension: meta.name,
      description: '视觉比对失败：' + (data.reason || ''), location: `${ref} / ${shot}`,
      spec: 'Design QA 视觉比对', severity: SEVERITY.MAJOR, suggestion: data.reason,
      result: STATUS.BLOCKED, evidence: JSON.stringify(data) })],
      note: '校验条件不足：' + (data.reason || ''), stats, blocked: true };
  }
  stats.screenshots = 2;
  if (!data.sizeMatch) {
    issues.push(issue({ id: 'V-SIZE', dimension: meta.name,
      description: `参考图与渲染图尺寸不一致（${data.refSize} vs ${data.shotSize}）`,
      location: `${ref} / ${shot}`, spec: 'registry §5 画布 375×auto / 截图比对前提',
      severity: SEVERITY.BLOCKER, suggestion: '统一渲染视口与缩放倍数后重新比对',
      result: STATUS.FAIL, evidence: JSON.stringify(data) }));
    return { issues, note: '尺寸不一致，差异率不可用', stats, blocked: false, metrics: data };
  }
  stats.compared = 1;
  if (data.shotSize[0] !== QA_PARAMS.canvasWidth * 2 && data.shotSize[0] !== QA_PARAMS.canvasWidth) {
    issues.push(issue({ id: 'V-CANVAS', dimension: meta.name,
      description: `渲染画布宽 ${data.shotSize[0]} 不是规范 375（或 2x = 750）`,
      location: shot, spec: 'SKILL.md Hard Rules「Screen 宽固定 375」',
      severity: SEVERITY.MAJOR, suggestion: '用 375 宽（2x 截图 = 750）重新渲染',
      result: STATUS.WARNING, evidence: 'shotSize=' + JSON.stringify(data.shotSize) }));
  }
  const ratio = data.diffRatio;
  issues.push(issue({
    id: 'V-DIFF', dimension: meta.name,
    description: `像素差异率 ${(ratio * 100).toFixed(2)}%（阈值 QA 参数：>${(QA_PARAMS.maxDiff * 100)}% FAIL，>${(QA_PARAMS.warnDiff * 100)}% WARNING）`,
    location: `${ref} ↔ ${shot}`, spec: 'Design QA 视觉比对（阈值属 QA 过程参数，非设计规范；可用 --max-diff 覆盖）',
    severity: ratio > QA_PARAMS.maxDiff ? SEVERITY.MAJOR : SEVERITY.MINOR,
    suggestion: ratio > QA_PARAMS.maxDiff
      ? '按差异最大的分区逐项核对布局/尺寸/间距/对齐（报告附 top 区域），修完二次校验'
      : '差异在容忍范围内；如需像素级还原请继续收敛',
    result: ratio > QA_PARAMS.maxDiff ? STATUS.FAIL : ratio > QA_PARAMS.warnDiff ? STATUS.WARNING : STATUS.PASS,
    evidence: `mae=${data.mae}, top=${JSON.stringify(data.regions.slice(0, 3))}`,
  }));
  // 布局/对齐/信息层级：静态源码无法验证整体视觉一致性 → 明确 NOT CHECKED
  issues.push(issue({ id: 'V-SEM', dimension: meta.name,
    description: '信息层级、视觉节奏、审美一致性未执行检查（需视觉模型或人工走查）',
    location: target.path, spec: 'decision/05-visual-strategy.md（焦点/节奏/运营感等定性规则）',
    severity: SEVERITY.INFO, suggestion: '人工走查或用视觉模型评审；本次不判定',
    result: STATUS.NOT_CHECKED, evidence: '静态像素差异不等价于视觉一致性判断' }));
  return { issues, note, stats, blocked: false, metrics: data };
}
