// Design QA · 报告生成器（Markdown + JSON 双份）
// 没有实际检查的内容不得标 PASS：所有 NOT CHECKED / BLOCKED 都显式列出原因。

import { STATUS } from './issue.mjs';

const STATUS_ICON = {
  PASS: '✅ PASS', FAIL: '❌ FAIL', WARNING: '⚠️ WARNING',
  BLOCKED: '⛔ BLOCKED', NOT_CHECKED: '⬜ NOT CHECKED',
};

export function buildReport(result) {
  const { target, ctx, rounds, dimensions, issues, codeIssues = [], fixLog, conditions, startedAt, finishedAt, verdict } = result;
  const L = [];
  L.push('# Design QA 校验报告');
  L.push('');
  L.push(`- **校验对象**：\`${target.path}\`（类型：${target.type}${target.composed ? '，已按 INDEX.md 组合 preamble' : ''}）`);
  L.push(`- **执行时间**：${startedAt} → ${finishedAt}`);
  L.push(`- **校验轮次**：${rounds.length} 轮（含自动修复后的二次校验）`);
  L.push(`- **最终判定**：**${verdict.status}** — ${verdict.reason}`);
  L.push('');
  L.push('## 校验依据（唯一真值）');
  L.push('');
  for (const [k, v] of Object.entries(ctx.evidencePaths)) {
    L.push(`- ${k}: \`${v}\` ${ctx.files[k].ok ? '✅ 已读取' : '⛔ 缺失'}`);
  }
  if (target.specPath) L.push(`- PRD/规格: \`${target.specPath}\`（source=${target.specSource || '未提供'}）`);
  if (target.reference) L.push(`- 视觉参考: \`${target.reference}\`（source=${target.referenceSource || 'unspecified'}）`);
  L.push('');
  if (conditions.length) {
    L.push('> **校验条件不足声明**：');
    for (const c of conditions) L.push(`> - ${c}`);
    L.push('');
  }

  L.push('## 六大维度校验结果');
  L.push('');
  L.push('| # | 维度 | 状态 | 检查统计 | 说明 |');
  L.push('|---|---|---|---|---|');
  for (const d of dimensions) {
    const st = STATUS_ICON[d.status] || d.status;
    const stat = d.stats ? Object.entries(d.stats).map(([k, v]) => `${k}=${v}`).join(' / ') : '—';
    L.push(`| ${d.id} | ${d.name} | ${st} | ${stat} | ${(d.note || '—').replace(/\|/g, '\\|')} |`);
  }
  L.push('');

  // 用户要求的 8 个章节（逐维度展开）
  const dimById = Object.fromEntries(dimensions.map(d => [d.id, d]));
  const sections = [
    ['01', '1. 需求还原情况', '需求覆盖 = 已命中/应命中；语义条目与未提供真实 PRD 的条目不判 PASS'],
    ['02', '2. 设计规范符合情况', '颜色/字号/字重/间距/圆角/阴影，依据 tokens.md 实读色板与数值集合'],
    ['03', '3. 组件引用正确率', '组件名、引用路径、API、属性、变体、插槽是否合法'],
    ['04', '4. 组件使用合规情况', '是否复用标准组件、是否重复造轮子 / 错误组合 / 使用已作废形态'],
    ['05', '5. 视觉还原评估', '有终稿参考时做像素比对；布局/层级等定性判断明确标注'],
    ['06', '6. 交互逻辑完整性', '按钮/弹窗/表单/状态切换的静态证据；运行时交互如实标注'],
  ];
  for (const [id, title, hint] of sections) {
    const d = dimById[id];
    L.push(`## ${title}`);
    L.push('');
    L.push(`> ${hint}`);
    L.push('');
    L.push(`- 状态：**${STATUS_ICON[d?.status] || '—'}**`);
    if (d?.stats) L.push(`- 统计：${Object.entries(d.stats).map(([k, v]) => `${k}=${v}`).join(' / ')}`);
    if (d?.note) L.push(`- 说明：${d.note}`);
    const dimIssues = issues.filter(i => i.dimension === (d?.name || ''));
    L.push(`- 本维度问题数：${dimIssues.length}`);
    L.push('');
  }

  L.push('## 7. 发现的问题及修复记录');
  L.push('');
  L.push(`共 ${issues.length} 条问题（FAIL / WARNING / BLOCKED / NOT CHECKED）。每条含：问题描述、问题位置、对应规范、严重程度、修复建议、校验结果。`);
  L.push('');
  if (issues.length === 0) {
    L.push('（无）');
  } else {
    L.push('| ID | 维度 | 问题描述 | 问题位置 | 对应规范 | 严重程度 | 修复建议 | 校验结果 | 证据 |');
    L.push('|---|---|---|---|---|---|---|---|---|');
    for (const i of issues) {
      const cell = s => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      L.push(`| ${cell(i.id)} | ${cell(i.dimension)} | ${cell(i.description)} | ${cell(i.location)} | ${cell(i.spec)} | ${cell(i.severity)} | ${cell(i.suggestion)} | ${STATUS_ICON[i.result]} | ${cell(i.evidence)} |`);
    }
  }
  L.push('');
  // ── 代码检查 / 构建 / 自动化测试（独立阶段）──
  L.push('### 代码检查 / 构建 / 自动化测试');
  L.push('');
  L.push('> 依据：Design QA 自动化校验机制「有代码输出时，执行代码检查、构建和必要的自动化测试」。JS 交付物执行 `node --check` + 按 INDEX.md 构建 + Figma API mock 空跑（paint 结构 / 越界 / 未定位断言）；HTML 执行标签配对与 CSS 括号平衡构建检查。');
  L.push('');
  if (!codeIssues.length) L.push('（未执行）');
  else {
    L.push('| ID | 检查项 | 结果 | 校验结果 | 证据 |');
    L.push('|---|---|---|---|---|');
    for (const i of codeIssues) {
      const cell = s => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      L.push(`| ${cell(i.id)} | ${cell(i.description)} | ${cell(i.suggestion === '—' ? '通过' : '见建议')} | ${STATUS_ICON[i.result]} | ${cell(i.evidence)} |`);
    }
  }
  L.push('');
  L.push('### 自动修复记录');
  L.push('');
  if (!fixLog.length) L.push('（本轮未执行自动修复，或没有可确定性修复的问题）');
  else {
    L.push('| 轮次 | 目标 | 替换 | 次数 | 对应问题 | 备份 |');
    L.push('|---|---|---|---|---|---|');
    for (const f of fixLog) for (const a of f.applied) {
      L.push(`| ${f.round} | ${f.target} | \`${a.from}\` → \`${a.to}\` | ${a.actually} | ${a.ruleId} | \`${f.backup}\` |`);
    }
    for (const s of fixLog.flatMap(f => (f.skipped || []).map(x => ({ round: f.round, ...x })))) {
      L.push(`| ${s.round} | — | 跳过 | — | ${s.ruleId}（${s.reason}） | — |`);
    }
  }
  L.push('');
  L.push('### 逐轮结果');
  L.push('');
  L.push('| 轮次 | 问题总数 | FAIL | WARNING | BLOCKED | NOT CHECKED | 自动修复数 |');
  L.push('|---|---|---|---|---|---|---|');
  rounds.forEach((r, idx) => {
    L.push(`| ${idx + 1} | ${r.issues.length} | ${r.issues.filter(i => i.result === STATUS.FAIL).length} | ${r.issues.filter(i => i.result === STATUS.WARNING).length} | ${r.issues.filter(i => i.result === STATUS.BLOCKED).length} | ${r.issues.filter(i => i.result === STATUS.NOT_CHECKED).length} | ${r.fixCount} |`);
  });
  L.push('');

  L.push('## 8. 尚未解决的问题及原因');
  L.push('');
  const unresolved = [...issues, ...codeIssues].filter(i =>
    i.result === STATUS.FAIL || i.result === STATUS.BLOCKED || i.result === STATUS.NOT_CHECKED);
  if (!unresolved.length) L.push('（无：所有适用的硬性规则均已通过）');
  else {
    L.push('| ID | 状态 | 原因 / 阻塞条件 | 建议 |');
    L.push('|---|---|---|---|');
    for (const i of unresolved) {
      const reason = i.result === STATUS.BLOCKED || i.result === STATUS.NOT_CHECKED
        ? (i.evidence || '校验条件不足 / 未执行检查')
        : '需结构性改动，超出确定性自动修复范围（不得擅自改动业务逻辑）';
      L.push(`| ${i.id} | ${STATUS_ICON[i.result]} | ${String(reason).replace(/\|/g, '\\|').replace(/\n/g, ' ')} | ${String(i.suggestion).replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`);
    }
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push('> 状态定义：PASS=已实际检查且通过；FAIL=已实际检查发现硬性违规；WARNING=已检查发现非阻断偏差/依据为样例；BLOCKED=校验条件不足或需人工裁决；NOT CHECKED=本次未执行检查。**未实际检查的内容一律不标 PASS。**');
  L.push('> 自动修复仅覆盖样式/Token/组件名的确定性替换，不改动业务文案、区块结构与交互逻辑。');
  return L.join('\n');
}
