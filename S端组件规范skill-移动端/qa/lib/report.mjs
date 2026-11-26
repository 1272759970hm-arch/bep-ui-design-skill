/**
 * Design QA 报告生成器：结构化 JSON + 中文 Markdown + 单文件 HTML。
 * 报告固定 8 个章节；每个问题固定 6 个字段；条件不足单独成章。
 */
import fs from 'node:fs';
import path from 'node:path';

export const SECTION_DEFS = [
  { id: 'R1', title: '需求还原情况' },
  { id: 'R2', title: '设计规范符合情况' },
  { id: 'R3', title: '组件引用正确率' },
  { id: 'R4', title: '组件使用合规情况' },
  { id: 'R5', title: '视觉还原评估' },
  { id: 'R6', title: '交互逻辑完整性' },
  { id: 'R7', title: '发现的问题及修复记录' },
  { id: 'R8', title: '尚未解决的问题及原因' }
];

const DIM_NAME = {
  R1: '需求还原校验', R2: '设计规范校验', R3: '组件引用校验',
  R4: '组件使用校验', R5: '视觉还原校验', R6: '交互逻辑校验'
};

function worst(checks) {
  const order = ['FAIL', 'WARNING', 'BLOCKED', 'NOT CHECKED', 'PASS'];
  for (const s of order) if (checks.some((c) => c.status === s)) return s;
  return 'PASS';
}

function sectionSummary(id, checks, report) {
  const cs = checks.filter((c) => c.dimension === id);
  const counts = {};
  for (const c of cs) counts[c.status] = (counts[c.status] || 0) + 1;
  const parts = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(' / ') || '无规则';
  if (id === 'R3') {
    const c = cs.find((x) => x.ruleId === 'R3-01');
    const total = c?.metrics?.total ?? null;
    const valid = c?.metrics?.valid ?? null;
    if (total !== null) return `组件引用 ${valid}/${total} 条命中真值库；${parts}`;
  }
  if (id === 'R5') {
    const c = cs.find((x) => x.ruleId === 'R5-03');
    if (c?.metrics?.diffRatio !== undefined) return `参考图差异率 ${(c.metrics.diffRatio * 100).toFixed(2)}%；${parts}`;
    if (c?.status === 'BLOCKED') return `未提供 Figma 参考图，截图比对条件不足；${parts}`;
  }
  if (id === 'R1') {
    const c = cs.find((x) => x.ruleId === 'R1-01');
    if (c?.metrics?.coverage !== undefined) return `PRD 功能点覆盖率 ${(c.metrics.coverage * 100).toFixed(1)}%；${parts}`;
    if (c?.status === 'BLOCKED') return `未提供 PRD / 需求卡，需求还原校验条件不足；${parts}`;
  }
  return parts;
}

export function buildReport(ctx) {
  const { checks, catalog, meta, iterations, fixRecords, art } = ctx;
  const summary = ctx.summary;

  const sections = SECTION_DEFS.map((def, idx) => {
    const cs = checks.filter((c) => c.dimension === def.id);
    let status, ruleIds;
    if (def.id === 'R7') {
      ruleIds = [];
      const recs = fixRecords || [];
      status = recs.length ? 'PASS' : 'NOT CHECKED';
    } else if (def.id === 'R8') {
      ruleIds = [];
      status = ctx.unresolved.length ? 'FAIL' : 'PASS';
    } else {
      ruleIds = cs.map((c) => c.ruleId);
      status = worst(cs);
    }
    const metrics = {};
    for (const c of cs) if (c.metrics) Object.assign(metrics, c.metrics);
    return {
      id: def.id, title: def.title, status,
      summary: def.id === 'R7'
        ? `共 ${(fixRecords || []).length} 条修复记录；未解决 ${ctx.unresolved.length} 项`
        : def.id === 'R8'
          ? ctx.unresolved.length
            ? `${ctx.unresolved.length} 项未解决，原因见下方清单`
            : '无未解决问题'
          : sectionSummary(def.id, checks, null),
      metrics, ruleIds
    };
  });

  const issues = checks.flatMap((c) => c.issues);
  const conditionGaps = checks
    .filter((c) => c.status === 'BLOCKED' || c.status === 'NOT CHECKED')
    .map((c) => ({
      ruleId: c.ruleId,
      status: c.status,
      title: catalog.rules.find((r) => r.id === c.ruleId)?.title || '',
      reason: c.note,
      requiredEvidence: catalog.rules.find((r) => r.id === c.ruleId)?.requiredEvidence || []
    }));

  return {
    meta: {
      target: meta.target,
      artifactType: art.type,
      generatedAt: new Date().toISOString(),
      engineVersion: '1.0.0',
      truthSourcesUsed: ctx.evidence.used,
      truthSourcesMissing: ctx.evidence.missing.map((m) => `${m.key}: ${m.path}`),
      inputs: meta.inputs,
      ruleCatalogHash: meta.ruleCatalogHash,
      ruleTitles: Object.fromEntries(catalog.rules.map((r) => [r.id, r.title])),
      dimensions: catalog.dimensions.map((d) => ({ id: d.id, name: d.name }))
    },
    statusSummary: summary,
    sections,
    checks,
    issues,
    iterations: iterations || [],
    unresolved: ctx.unresolved,
    conditionGaps,
    fixRecords: fixRecords || []
  };
}

const badge = (s) => ({
  PASS: '✅ PASS', FAIL: '❌ FAIL', WARNING: '⚠️ WARNING',
  BLOCKED: '⛔ BLOCKED', 'NOT CHECKED': '⬜ NOT CHECKED'
}[s] || s);

function issueTable(issues, includeFix = false) {
  if (!issues.length) return '_无_\n';
  let s = '| 编号 | 问题描述 | 问题位置 | 对应规范 | 严重程度 | 修复建议 | 校验结果 |\n';
  s += '|---|---|---|---|---|---|---|\n';
  for (const i of issues) {
    const loc = `${i.location.file || ''}${i.location.line ? ':' + i.location.line : ''}${i.location.selector ? ' · ' + i.location.selector : ''}${i.location.detail ? ' · ' + i.location.detail : ''}`;
    const cell = (t) => String(t || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 220);
    s += `| ${i.id} | ${cell(i.description)} | ${cell(loc)} | ${cell(i.spec.source + ' ' + i.spec.clause)} | ${i.severity} | ${cell(i.suggestion)} | ${badge(i.verification.status)}${includeFix && i.fixApplied ? ' · 已修复' : ''} |\n`;
  }
  return s + '\n';
}

export function renderMarkdown(rep) {
  const m = rep.meta, s = rep.statusSummary;
  let o = `# Design QA 报告 · BEP-S\n\n`;
  o += `- **目标产物**：\`${m.target}\`（${m.artifactType}）\n`;
  o += `- **生成时间**：${m.generatedAt}\n`;
  o += `- **引擎版本**：${m.engineVersion} · 规则目录校验和 \`${m.ruleCatalogHash}\`\n`;
  o += `- **真值源**：${m.truthSourcesUsed.join('、') || '无'}\n`;
  if (m.truthSourcesMissing.length) o += `- **缺失真值源**：${m.truthSourcesMissing.join('、')}\n`;
  o += `- **本次输入**：PRD \`${m.inputs.prd || '未提供'}\` · 视觉参考 \`${m.inputs.reference || '未提供'}\`（${m.inputs.referenceKind || '无'}）\n\n`;
  o += `## 总览\n\n`;
  o += `**总体状态 ${badge(s.overall)}** · PASS ${s.counts.PASS} / FAIL ${s.counts.FAIL} / WARNING ${s.counts.WARNING} / BLOCKED ${s.counts.BLOCKED} / NOT CHECKED ${s.counts['NOT CHECKED']}\n\n`;
  o += `- 问题总数 ${s.issueCount}，其中 P0 ${s.p0Count}\n`;
  o += `- 可宣称「校验通过」：**${s.canClaimPass ? '是' : '否'}**（存在 BLOCKED / NOT CHECKED 时不得宣称通过）\n`;
  o += `- 可交付：**${s.deliverable ? '是' : '否'}**\n\n`;
  o += `| 章节 | 状态 | 结论 |\n|---|---|---|\n`;
  for (const sec of rep.sections) o += `| ${sec.id} ${sec.title} | ${badge(sec.status)} | ${sec.summary} |\n`;
  o += `\n---\n\n`;

  const dims = rep.sections.filter((x) => ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].includes(x.id));
  dims.forEach((sec, idx) => {
    o += `## ${idx + 1}. ${sec.title}\n\n状态 ${badge(sec.status)} · ${sec.summary}\n\n`;
    const cs = rep.checks.filter((c) => c.dimension === sec.id);
    o += `| 规则 | 名称 | 状态 | 实检对象数 | 问题数 | 说明 |\n|---|---|---|---|---|---|\n`;
    for (const c of cs) {
      const more = c.truncated ? ` (+${c.truncated})` : '';
      o += `| ${c.ruleId} | ${rep.meta.ruleTitles?.[c.ruleId] || ''} | ${badge(c.status)} | ${c.checkedCount} | ${c.issues.length}${more} | ${(c.note || '').replace(/\|/g, '\\|').slice(0, 120)} |\n`;
    }
    o += `\n`;
  });

  o += `## 7. 发现的问题及修复记录\n\n`;
  o += `共 ${rep.issues.length} 项问题，${rep.fixRecords.length} 条修复记录。\n\n`;
  o += issueTable(rep.issues, true);
  if (rep.fixRecords.length) {
    o += `### 修复闭环记录\n\n| 轮次 | 规则 | 修复类型 | 修复内容 | 结果 |\n|---|---|---|---|---|\n`;
    for (const f of rep.fixRecords) {
      o += `| ${f.round} | ${f.ruleId} | ${f.kind} | ${String(f.detail).replace(/\|/g, '\\|').slice(0, 160)} | ${f.ok ? '已应用' : '跳过'} |\n`;
    }
    o += `\n`;
  }
  if (rep.iterations.length) {
    o += `### 校验 / 修复迭代\n\n| 轮次 | 阶段 | FAIL | WARNING | BLOCKED | NOT CHECKED | 应用修复 | 跳过修复 |\n|---|---|---|---|---|---|---|---|\n`;
    for (const it of rep.iterations) {
      const c = it.statusSummary.counts || {};
      o += `| ${it.round} | ${it.phase} | ${c.FAIL || 0} | ${c.WARNING || 0} | ${c.BLOCKED || 0} | ${c['NOT CHECKED'] || 0} | ${it.fixesApplied.length} | ${it.fixesSkipped.length} |\n`;
    }
    o += `\n`;
  }

  o += `## 8. 尚未解决的问题及原因\n\n`;
  o += issueTable(rep.unresolved);

  o += `## 校验条件不足清单（禁止假装完成校验）\n\n`;
  if (!rep.conditionGaps.length) o += `_无_\n`;
  else {
    o += `| 规则 | 名称 | 状态 | 原因 | 需要补齐的证据 |\n|---|---|---|---|---|\n`;
    for (const g of rep.conditionGaps) {
      o += `| ${g.ruleId} | ${g.title} | ${badge(g.status)} | ${String(g.reason).replace(/\|/g, '\\|').slice(0, 180)} | ${g.requiredEvidence.join('、') || '—'} |\n`;
    }
  }
  o += `\n---\n\n> 依据：\`qa/rules/rule-catalog.json\` · 状态语义见 \`qa/qa.config.json\`。所有 PASS 均通过「实检对象数 > 0 且有证据」守卫。\n`;
  return o;
}

export function renderHtml(rep) {
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cls = (s) => ({ PASS: 'pass', FAIL: 'fail', WARNING: 'warn', BLOCKED: 'block', 'NOT CHECKED': 'na' }[s] || 'na');
  const s = rep.statusSummary;
  let rows = '';
  for (const c of rep.checks) {
    rows += `<tr><td>${esc(c.ruleId)}</td><td>${esc(c.dimension)}</td><td><span class="b ${cls(c.status)}">${esc(c.status)}</span></td><td>${c.checkedCount}</td><td>${c.issues.length}</td><td>${esc(c.note)}</td></tr>`;
  }
  let issues = '';
  for (const i of rep.issues) {
    issues += `<tr><td>${esc(i.id)}</td><td>${esc(i.description)}</td><td>${esc(i.location.file)}:${esc(i.location.line ?? '')} ${esc(i.location.selector)}</td><td>${esc(i.spec.source)} ${esc(i.spec.clause)}</td><td>${esc(i.severity)}</td><td>${esc(i.suggestion)}</td><td><span class="b ${cls(i.verification.status)}">${esc(i.verification.status)}</span>${i.fixApplied ? ' · 已修复' : ''}</td></tr>`;
  }
  let gaps = '';
  for (const g of rep.conditionGaps) {
    gaps += `<tr><td>${esc(g.ruleId)}</td><td>${esc(g.title)}</td><td><span class="b ${cls(g.status)}">${esc(g.status)}</span></td><td>${esc(g.reason)}</td><td>${esc(g.requiredEvidence.join('、'))}</td></tr>`;
  }
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Design QA 报告</title>
<style>body{font:14px/1.6 -apple-system,'PingFang SC',sans-serif;background:#F7F8FA;color:#22262F;margin:0;padding:32px}
.wrap{max-width:1180px;margin:auto}h1{font-size:24px;margin:0 0 8px}h2{font-size:17px;margin:28px 0 10px}
.meta{color:#6F879E;font-size:13px}.card{background:#fff;border-radius:8px;padding:18px 20px;margin:14px 0}
table{border-collapse:collapse;width:100%;font-size:12px;background:#fff;border-radius:8px;overflow:hidden}
th,td{border-bottom:1px solid #EEEEEE;padding:8px 10px;text-align:left;vertical-align:top}th{background:#F2F3F5;font-weight:600}
.b{display:inline-block;padding:1px 7px;border-radius:2px;font-size:11px;font-weight:600}
.pass{background:rgba(0,180,42,.10);color:#00A82A}.fail{background:rgba(245,63,63,.10);color:#F53F3F}
.warn{background:rgba(255,166,69,.10);color:#C26A1E}.block{background:rgba(69,132,255,.10);color:#4584FF}
.na{background:rgba(111,135,158,.10);color:#6F879E}
.big{font-size:20px;font-weight:600}</style><div class="wrap">
<h1>Design QA 报告 · BEP-S</h1>
<div class="meta">${esc(rep.meta.target)} · ${esc(rep.meta.generatedAt)} · 引擎 ${esc(rep.meta.engineVersion)}</div>
<div class="card"><span class="big">${esc(s.overall)}</span> &nbsp; PASS ${s.counts.PASS} / FAIL ${s.counts.FAIL} / WARNING ${s.counts.WARNING} / BLOCKED ${s.counts.BLOCKED} / NOT CHECKED ${s.counts['NOT CHECKED']}<br>
问题 ${s.issueCount} 项（P0 ${s.p0Count}） · 可宣称通过 <b>${s.canClaimPass ? '是' : '否'}</b> · 可交付 <b>${s.deliverable ? '是' : '否'}</b></div>
<h2>六大维度</h2><table><tr><th>章节</th><th>状态</th><th>结论</th></tr>${rep.sections.slice(0,6).map(x=>`<tr><td>${esc(x.id)} ${esc(x.title)}</td><td><span class="b ${cls(x.status)}">${esc(x.status)}</span></td><td>${esc(x.summary)}</td></tr>`).join('')}</table>
<h2>规则明细</h2><table><tr><th>规则</th><th>维度</th><th>状态</th><th>实检</th><th>问题</th><th>说明</th></tr>${rows}</table>
<h2>发现的问题及修复记录</h2><table><tr><th>编号</th><th>问题描述</th><th>问题位置</th><th>对应规范</th><th>严重度</th><th>修复建议</th><th>校验结果</th></tr>${issues||'<tr><td colspan="7">无</td></tr>'}</table>
<h2>尚未解决的问题及原因</h2><table><tr><th>编号</th><th>描述</th><th>位置</th><th>规范</th><th>严重度</th><th>建议</th><th>状态</th></tr>${rep.unresolved.length?rep.unresolved.map(i=>`<tr><td>${esc(i.id)}</td><td>${esc(i.description)}</td><td>${esc(i.location.file)}:${esc(i.location.line??'')}</td><td>${esc(i.spec.source)} ${esc(i.spec.clause)}</td><td>${esc(i.severity)}</td><td>${esc(i.suggestion)}</td><td><span class="b ${cls(i.verification.status)}">${esc(i.verification.status)}</span></td></tr>`).join(''):'<tr><td colspan="7">无</td></tr>'}</table>
<h2>校验条件不足清单</h2><table><tr><th>规则</th><th>名称</th><th>状态</th><th>原因</th><th>需补齐证据</th></tr>${gaps||'<tr><td colspan="5">无</td></tr>'}</table>
</div></html>`;
}

export function writeReports(rep, outDir, basename) {
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, `${basename}.qa.json`);
  const mdPath = path.join(outDir, `${basename}.qa.md`);
  const htmlPath = path.join(outDir, `${basename}.qa.html`);
  fs.writeFileSync(jsonPath, JSON.stringify(rep, null, 2), 'utf8');
  fs.writeFileSync(mdPath, renderMarkdown(rep), 'utf8');
  fs.writeFileSync(htmlPath, renderHtml(rep), 'utf8');
  return { jsonPath, mdPath, htmlPath };
}
