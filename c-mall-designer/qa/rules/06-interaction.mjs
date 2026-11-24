// 维度 6 · 交互逻辑校验
// 静态可查：按钮/弹窗/表单/下拉/表格/分页/状态切换的存在性与状态定义。
// 动态行为（点击跳转、异步加载、动效时序）明确标 NOT CHECKED，不假装 PASS。
// 通过的检查项只计入 stats，不进入「问题清单」——报告的问题表只列 FAIL/WARNING/BLOCKED/NOT_CHECKED。

import { issue, STATUS, SEVERITY } from '../lib/issue.mjs';

export const meta = { id: '06', key: 'interaction', name: '交互逻辑校验', requires: ['registry', 'skill'] };

export function check(ctx, target, opts = {}) {
  const issues = [];
  const stats = { checked: 0, pass: 0, fail: 0, warning: 0, notChecked: 0 };
  const notes = [];

  if (!ctx.files.registry.ok || !ctx.files.skill.ok) {
    return { issues: [issue({ id: 'I-000', dimension: meta.name,
      description: '交互规范依据缺失（registry / SKILL.md）', location: ctx.evidencePaths.registry,
      spec: 'Design QA 唯一依据', severity: SEVERITY.MAJOR, suggestion: '补齐依据文件',
      result: STATUS.BLOCKED, evidence: 'missing' })], note: '校验条件不足', stats, blocked: true };
  }

  const raw = target.raw;
  // 只有非 PASS 的结果才生成 issue；PASS 仅累加统计
  const record = (o) => {
    stats.checked++;
    if (o.result === STATUS.PASS) { stats.pass++; return; }
    issues.push(issue({ ...o, dimension: meta.name, id: o.id || 'I-' + stats.checked }));
    if (o.result === STATUS.FAIL) stats.fail++;
    else if (o.result === STATUS.WARNING) stats.warning++;
    else if (o.result === STATUS.NOT_CHECKED) stats.notChecked++;
  };

  if (target.type === 'html') {
    const ex = target.html;
    const it = ex.interaction;

    // ① 按钮状态与反馈
    if (it.buttons > 0) {
      const stateTotal = it.disabledSelectors + it.activeSelectors + it.hoverSelectors + it.dataState + it.stateClasses;
      const ok = stateTotal > 0;
      record({ description: ok ? '按钮交互状态定义已检出' : '按钮缺少 disabled / active / hover 任一交互状态定义',
        location: target.path, spec: 'registry §4 按键组 / tokens.md Animation',
        severity: ok ? SEVERITY.INFO : SEVERITY.MAJOR,
        suggestion: ok ? '—' : '补 :disabled / :active 样式；主次状态用 .on / data-state 标记',
        result: ok ? STATUS.PASS : STATUS.WARNING,
        evidence: `按钮 ${it.buttons} 个，状态定义 disabled=${it.disabledSelectors} active=${it.activeSelectors} hover=${it.hoverSelectors} stateClass=${it.stateClasses}` });
    }

    // ② 状态切换：筛选 Tabs 必须有选中态
    const hasChips = /class="chip/.test(raw);
    if (hasChips) {
      const on = /class="[^"]*\bchip on\b|class="[^"]*\bon\b[^"]*\bchip\b|data-state="[^"]*(selected|active|on)/.test(raw);
      record({ description: on ? '快捷筛选 Tabs 选中态已检出' : '快捷筛选 Tabs 缺少选中态（.on / data-state）',
        location: target.path + ' .chips', spec: 'registry §4.8 双变体（选中橙 / 描边）',
        severity: on ? SEVERITY.INFO : SEVERITY.MAJOR,
        suggestion: on ? '—' : '给选中 chip 加 .on 状态与对应样式',
        result: on ? STATUS.PASS : STATUS.FAIL,
        evidence: on ? '检出 .chip.on / data-state 选中态' : '未检出选中态' });
    }

    // ③ 弹窗：仅当存在明确弹窗信号时检查；内容容器 .sheet 不算弹窗（2026-11-19 修正误报）
    const dialogSignal = /class="[^"]*\b(mask|modal|dialog|popup|overlay)\b|role="dialog"|aria-modal="true"/i.test(raw);
    if (dialogSignal) {
      const hasMask = /class="[^"]*\b(mask|overlay)\b/.test(raw);
      const hasClose = /class="[^"]*\bclose\b|aria-label="关闭"|data-action="close"/.test(raw);
      const ok = hasMask && hasClose;
      record({ description: ok ? '弹窗遮罩与关闭入口完整' : '弹窗缺少遮罩或关闭入口（打开/关闭状态不完整）',
        location: target.path, spec: 'registry §4.6 关闭按钮 / 07-sheet.md',
        severity: ok ? SEVERITY.INFO : SEVERITY.MAJOR,
        suggestion: ok ? '—' : '补遮罩 + 右上角关闭按钮（热区 ≥32×32）',
        result: ok ? STATUS.PASS : STATUS.FAIL,
        evidence: `mask=${hasMask} close=${hasClose}` });
    } else {
      notes.push('本页未检出弹窗组件（.sheet 为内容容器，不作弹窗判定）；弹窗交互未检查');
    }

    // ④ 表单元素基础属性
    if (it.forms > 0) {
      const inputs = ex.tags.filter(t => t.name === 'input');
      const missingPh = inputs.filter(t => !t.attrs.placeholder && !t.attrs['aria-label']);
      const ok = missingPh.length === 0;
      record({ description: ok ? '表单输入可访问性标签完整' : `${missingPh.length} 个 input 缺少 placeholder / aria-label（反馈缺失）`,
        location: target.path, spec: 'decision/03-information-architecture.md 表单可理解性 / SKILL.md 表单四件套',
        severity: ok ? SEVERITY.INFO : SEVERITY.MINOR,
        suggestion: ok ? '—' : '补 placeholder 或显式 label',
        result: ok ? STATUS.PASS : STATUS.WARNING,
        evidence: `input 总数 ${inputs.length}，缺失 ${missingPh.length}` });
    }

    // ⑤ 主 CTA 唯一（禁止两个实心橙）
    const primaryBtns = (raw.match(/type="submit"|class="[^"]*\bprimary\b[^"]*"|background:\s*var\(--primary\)/g) || []).length;
    const ok = primaryBtns <= 3;
    record({ description: ok ? '主 CTA 数量在静态阈值内' : '疑似存在多个主 CTA（主次应一眼可分）',
      location: target.path, spec: 'SKILL.md Hard Rules「主 CTA 唯一」/ registry §4.1',
      severity: SEVERITY.INFO, suggestion: ok ? '—' : '人工确认主次层级（静态计数仅提示）',
      result: ok ? STATUS.PASS : STATUS.WARNING,
      evidence: '主色/提交按钮特征计数=' + primaryBtns });

    // ⑥ 表格 / 分页 / 下拉：页面存在时检查状态反馈；未出现不强行判 FAIL
    for (const [name, count] of [['表格', it.tables], ['分页', it.paginations], ['下拉框', it.selects]]) {
      if (count > 0) {
        record({ description: `${name}存在，但空态/加载态/选中态等交互状态无法从静态源码验证`,
          location: target.path, spec: 'Design QA 交互完整性', severity: SEVERITY.INFO,
          suggestion: '用浏览器自动化或 E2E 用例验证', result: STATUS.NOT_CHECKED,
          evidence: `检出 ${name} ${count} 处；动态状态未执行检查` });
      }
    }
  } else {
    const ex = target.js;
    const hasDialog = ex.calls.some(c => c.name === 'mkDialog');
    if (hasDialog) record({ description: 'Dialog 交互（确认/取消回调逻辑）无法从静态源码验证',
      location: target.path, spec: 'registry §4.7', severity: SEVERITY.INFO,
      suggestion: '执行 E2E 或人工走查', result: STATUS.NOT_CHECKED,
      evidence: 'mkDialog 存在，回调内容不可静态判定' });
  }

  // 所有交付物：点击后跳转 / 异步加载 / 动效时序 → 统一 NOT CHECKED
  record({ description: '点击后跳转、异步数据加载、倒计时动效时序等运行时交互未执行检查',
    location: target.path, spec: 'Design QA：静态源码无法验证运行时行为',
    severity: SEVERITY.INFO,
    suggestion: '接入 Playwright/浏览器自动化用例（本次不具备该条件）',
    result: STATUS.NOT_CHECKED, evidence: '未运行浏览器自动化' });

  return { issues, note: notes.join(' '), stats, blocked: false };
}
