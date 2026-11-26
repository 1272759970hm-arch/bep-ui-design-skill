// 维度 3 · 组件引用校验
// 依据：scripts/preamble.js 中真实定义的 helper（31 个）、TAG_SPEC 语义键、registry §6 图标源规则、§4 按钮 API。
// 虚构组件 / 错误引用 / 编造属性一律 FAIL。
//
// 2026-11-19 修正：模板大量使用「数据驱动」写法（mkTag(t, store.shopTag.kind, card)），
// 语义键的真实候选值写在文件头部 DATA 里（kind:'shop:brand'）。旧版只认调用处的字面量，
// 把变量引用一律判「缺少语义键 / 编造变体」→ 误报。现改为：
//   · 调用处是字面量 → 直接核对
//   · 调用处是变量 → 核对全文件 DATA 中所有 `kind:` / `ctaType:` 字面量候选值
//   · 找不到任何候选值 → NOT_CHECKED（条件不足，不假装 PASS，也不误判 FAIL）

import { issue, STATUS, SEVERITY } from '../lib/issue.mjs';

export const meta = { id: '03', key: 'component-ref', name: '组件引用校验', requires: ['preamble', 'registry'] };

const BTN_TYPES = new Set(['outline', 'primary', 'default', 'danger']);
const BUILTIN = new Set([
  'if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof', 'parseInt', 'parseFloat',
  'Math', 'String', 'Number', 'Array', 'Object', 'JSON', 'Promise', 'await', 'console', 'require',
  'figma', 'fetch', 'pos', 'vc', 'cx', 'ga', 'hex2rgb', 'setTimeout', 'encodeURIComponent',
]);

export function check(ctx, target, opts = {}) {
  const issues = [];
  const stats = { totalCalls: 0, validCalls: 0, invalidCalls: 0, notChecked: 0, literalCandidates: 0 };
  let note = '';

  if (!ctx.files.preamble.ok || !ctx.files.registry.ok) {
    return { issues: [issue({
      id: 'C-000', dimension: meta.name, description: '组件库依据缺失（preamble.js / registry），无法校验组件引用',
      location: ctx.evidencePaths.preamble, spec: 'Design QA：组件库规范是唯一依据',
      severity: SEVERITY.MAJOR, suggestion: '补齐依据文件', result: STATUS.BLOCKED,
      evidence: 'missing files',
    })], note: '校验条件不足：组件库依据缺失', stats, blocked: true };
  }

  const allowed = ctx.helpers; // preamble 实读
  const raw = target.raw;

  // ── 数据驱动候选值池（全文件 DATA 字面量）──
  const kindLiterals = [...raw.matchAll(/\bkind\s*:\s*['"]([a-z]+:[a-z]+)['"]/g)].map(m => ({ v: m[1], line: raw.slice(0, m.index).split('\n').length }));
  const typeLiterals = [...raw.matchAll(/\b(?:ctaType|btnType|btn_type)\s*:\s*['"]([a-z]+)['"]/g)].map(m => ({ v: m[1], line: raw.slice(0, m.index).split('\n').length }));
  stats.literalCandidates = kindLiterals.length + typeLiterals.length;

  if (target.type === 'js') {
    const ex = target.js;
    const relevant = ex.calls.filter(c => /^mk[A-Z]/.test(c.name));

    // ① 候选字面量统一核对（无论调用处用变量还是字面量，这是真实可查的组件属性值）
    for (const k of kindLiterals) {
      if (!ctx.tagKinds.has(k.v)) issues.push(issue({
        id: 'C-KIND-L-' + k.line, dimension: meta.name, location: `${target.path}:${k.line} kind:'${k.v}'`,
        description: `DATA 中编造了不存在的标签变体 "${k.v}"`,
        spec: 'preamble.js TAG_SPEC 键集合（' + [...ctx.tagKinds].join(' / ') + '）',
        severity: SEVERITY.BLOCKER, suggestion: '只用 TAG_SPEC 已登记变体', result: STATUS.FAIL, evidence: k.v }));
    }
    for (const t of typeLiterals) {
      if (!BTN_TYPES.has(t.v)) issues.push(issue({
        id: 'C-TYPE-L-' + t.line, dimension: meta.name, location: `${target.path}:${t.line} ctaType:'${t.v}'`,
        description: `DATA 中编造了不存在的按钮 type "${t.v}"`,
        spec: 'registry §4 按键组：outline / primary / default / danger',
        severity: SEVERITY.BLOCKER, suggestion: '改用已登记 type', result: STATUS.FAIL, evidence: t.v }));
    }

    for (const c of relevant) {
      stats.totalCalls++;
      const loc = `${target.path}:${c.line} ${c.name}(${c.args.slice(0, 60)})`;
      const base = { dimension: meta.name, location: loc, spec: 'scripts/preamble.js helper 定义 / registry §4', severity: SEVERITY.BLOCKER };

      if (!allowed.has(c.name) && !BUILTIN.has(c.name)) {
        stats.invalidCalls++;
        issues.push(issue({ ...base, id: 'C-DEF-' + stats.invalidCalls,
          description: `虚构组件：调用了未定义的 helper "${c.name}"`,
          spec: 'preamble.js 未定义该 helper / registry §4 组件登记',
          suggestion: '改用 registry §4 已登记组件，禁止虚构', result: STATUS.FAIL, evidence: c.args }));
        continue;
      }
      stats.validCalls++;

      // mkTag 语义键
      if (c.name === 'mkTag') {
        const km = c.args.match(/['"]([a-z]+:[a-z]+)['"]/);
        if (km) {
          if (!ctx.tagKinds.has(km[1])) issues.push(issue({ ...base, id: 'C-TAG-' + c.line,
            description: `编造了不存在的标签变体 "${km[1]}"`,
            spec: 'preamble.js TAG_SPEC 键集合', severity: SEVERITY.BLOCKER,
            suggestion: '只用 TAG_SPEC 已登记变体', result: STATUS.FAIL, evidence: km[1] }));
        } else if (/,\s*(true|false)\s*,/.test(c.args)) {
          issues.push(issue({ ...base, id: 'C-TAG-' + c.line,
            description: 'mkTag 使用旧 4 参调用（应为语义语法 kind:variant）',
            spec: 'CHANGELOG 2026.11.05 第五轮 / SKILL.md 标签速查',
            severity: SEVERITY.MAJOR, suggestion: "改为 mkTag(text,'service:green',parent)",
            result: STATUS.FAIL, evidence: c.args.slice(0, 100) }));
        } else if (/\.kind\b|\bkind\b/i.test(c.args)) {
          // 数据驱动：候选值已在 ① 中核对；此处记录依据，不重复判 FAIL
          stats.notChecked++;
          note = note || `mkTag 使用数据驱动语义键（如 store.shopTag.kind）；已核对 DATA 中 ${kindLiterals.length} 个候选字面量，见 C-KIND-L-* 结果。`;
        } else {
          issues.push(issue({ ...base, id: 'C-TAG-' + c.line,
            description: 'mkTag 缺少合法的语义键参数，且无法从 DATA 找到候选值（静态条件不足）',
            spec: 'preamble.js TAG_SPEC / SKILL.md 标签速查', severity: SEVERITY.INFO,
            suggestion: '改为字面量语义键，或在 DATA 中显式声明 kind 候选值后重新校验',
            result: STATUS.NOT_CHECKED, evidence: c.args.slice(0, 100) }));
          stats.notChecked++;
        }
      }

      // mkIcon 图标来源
      if (c.name === 'mkIcon') {
        const im = c.args.match(/['"]([a-z]+):([a-z0-9-]+)['"]/);
        if (im && im[1] !== 'solar') {
          issues.push(issue({ ...base, id: 'C-ICON-' + c.line,
            description: `引用了非组件库图标源 "${im[0].slice(1, -1)}"`,
            spec: 'registry §6 图标体系（组件库实例 > iconify solar:*；禁 lucide:*）',
            severity: SEVERITY.MAJOR, suggestion: '换成 solar:xxx-outline / -bold（映射表见 registry §6）',
            result: STATUS.FAIL, evidence: im[0] }));
        }
        // 数据驱动图标名（D.entries[i].icon）：核对全文件 iconify 字面量前缀
        else if (!im) {
          const bad = [...raw.matchAll(/['"]((?:lucide|ph|mdi|tabler):[a-z0-9-]+)['"]/g)].map(m => m[1]);
          for (const b of [...new Set(bad)]) issues.push(issue({ ...base, id: 'C-ICON-DATA-' + c.line,
            description: `DATA 中存在非组件库图标源 "${b}"`,
            spec: 'registry §6（禁 lucide:*）', severity: SEVERITY.MAJOR,
            suggestion: '换成 solar:*', result: STATUS.FAIL, evidence: b }));
        }
      }

      // mkBtn 参数合法性
      if (c.name === 'mkBtn') {
        const parts = c.args.split(',').map(s => s.trim());
        const typeArg = (parts[1] || '').replace(/['"]/g, '');
        const isLiteralType = /^['"][a-z]+['"]$/.test((parts[1] || '').trim());
        if (isLiteralType && !BTN_TYPES.has(typeArg)) {
          issues.push(issue({ ...base, id: 'C-BTN-' + c.line,
            description: `编造了按钮 type "${typeArg}"`,
            spec: 'registry §4 按键组：outline / primary / default / danger',
            severity: SEVERITY.BLOCKER, suggestion: '改用已登记 type', result: STATUS.FAIL, evidence: c.args }));
        } else if (!isLiteralType && typeArg) {
          // 数据驱动（D.ctaType）：候选值已在 ① 核对，不重复判 FAIL
          stats.notChecked++;
          note = note || `mkBtn 使用数据驱动 type；已核对 DATA 中 ${typeLiterals.length} 个候选字面量，见 C-TYPE-L-* 结果。`;
        }
      }

      // mkFilterTab 变体参数
      if (c.name === 'mkFilterTab') {
        const vm = c.args.match(/['"](white|gray)['"]/);
        if (!vm && !/\bpageBg\b|\bbg\b/i.test(c.args)) issues.push(issue({ ...base, id: 'C-TAB-' + c.line,
          description: 'mkFilterTab 缺少 pageBg 变体参数（white / gray）',
          spec: 'registry §4.8 快捷筛选 Tabs 双变体', severity: SEVERITY.MAJOR,
          suggestion: "传 'white' 或 'gray'", result: STATUS.FAIL, evidence: c.args }));
      }
    }
    stats.accuracy = stats.totalCalls ? (stats.validCalls / stats.totalCalls * 100).toFixed(1) + '%' : 'N/A';
  } else {
    // HTML 交付物：无组件库引用路径概念，只对显式 data-component 标记做校验；否则明确 NOT CHECKED
    const marked = target.html.tags.filter(t => t.attrs['data-component']);
    for (const t of marked) {
      stats.totalCalls++;
      if (!allowed.has(t.attrs['data-component'])) {
        stats.invalidCalls++;
        issues.push(issue({ id: 'C-HTML-' + t.line, dimension: meta.name,
          description: `data-component 引用了未登记组件 "${t.attrs['data-component']}"`,
          location: `${target.path}:${t.line}`, spec: 'preamble.js helper 清单 / registry §4',
          severity: SEVERITY.BLOCKER, suggestion: '改引用已登记组件', result: STATUS.FAIL,
          evidence: t.attrs['data-component'] }));
      } else stats.validCalls++;
    }
    if (marked.length === 0) {
      stats.notChecked++;
      note = 'HTML 交付物未使用 data-component 标记，组件引用路径/变体/插槽无法程序化校验（需 Figma 组件实例数据）→ 标 NOT CHECKED，不假装 PASS。';
      issues.push(issue({ id: 'C-HTML-000', dimension: meta.name,
        description: '组件名称/引用路径/变体/插槽无结构化数据，未执行检查',
        location: target.path, spec: 'Design QA：组件引用以组件库实例数据为依据',
        severity: SEVERITY.INFO, suggestion: '输出 Figma 脚本或加 data-component 标记后校验',
        result: STATUS.NOT_CHECKED, evidence: 'data-component 标记数 = 0' }));
    }
    stats.accuracy = stats.totalCalls ? (stats.validCalls / stats.totalCalls * 100).toFixed(1) + '%' : 'N/A';
  }
  return { issues, note, stats, blocked: false };
}
