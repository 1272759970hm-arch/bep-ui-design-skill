// 维度 2 · 设计规范校验
// 依据：references/tokens.md（色板 / 字号阶梯 / 间距阶梯 / 圆角阶梯 / 字重）
//      + references/component-registry.md（组件实测特例）
//      + references/tokens.md「界面用色规则 6」（素材/系统控件豁免）
//
// 判定原则（2026-11-19 修正）：
//  · 只对「规范明确声明的唯一真值」判 FAIL（色板外界面色、未定义 C 常量、渐变缺 alpha…）。
//  · 规范只给出「阶梯」而非「穷举白名单」的项目（字号/间距/圆角），阶梯外数值
//    无法程序化判定是否违规 → 分类汇总为 WARNING 并列出明细，交人工确认，绝不编造标准。
//  · 组件实测特例（registry §4.9 r9 / 0.86 描边 / 2.23 笔画…）明确允许。
//  · 画布外壳 / iOS 系统控件 / 图片占位 / 活动素材按「界面用色规则 6」豁免，留痕但不判违规。
//  · 规范未定义 Shadow Token → BLOCKED（条件不足），不假 PASS。

import { issue, STATUS, SEVERITY } from '../lib/issue.mjs';
import { parseColor } from '../lib/context.mjs';

export const meta = {
  id: '02', key: 'tokens', name: '设计规范校验',
  requires: ['tokens', 'registry', 'preamble'],
};

const COLOR_PROPS = /^(color|background|background-color|border-color|border-top|border-bottom|border-left|border-right|fill|stroke)$/;
const SPACING_PROPS = /^(padding|margin|gap|row-gap|column-gap|padding-top|padding-bottom|padding-left|padding-right|margin-top|margin-bottom)$/;

export function check(ctx, target, opts = {}) {
  const issues = [];
  const stats = { checked: 0, pass: 0, fail: 0, warning: 0, blocked: 0 };
  let note = '';

  const missingRequired = meta.requires.filter(k => !ctx.files[k].ok);
  if (missingRequired.length) {
    return {
      issues: [issue({
        id: 'T-000', dimension: meta.name,
        description: '设计规范依据文件缺失，无法校验颜色/字号/间距/圆角',
        location: missingRequired.map(k => ctx.evidencePaths[k]).join(', '),
        spec: 'Design QA：Token 与组件登记表是唯一校验依据',
        severity: SEVERITY.MAJOR, suggestion: '补齐依据文件后重新校验',
        result: STATUS.BLOCKED, evidence: 'missing: ' + missingRequired.join(','),
      })],
      note: '校验条件不足：' + missingRequired.join('/') + ' 缺失', stats, blocked: true,
    };
  }

  const { hexSet, fontSizes, weights, radiusScale, spacingScale, alphaAllowed, cConst, componentExact } = ctx.tokens;
  const push = (o) => {
    stats.checked++; issues.push(issue(o));
    if (o.result === STATUS.FAIL) stats.fail++;
    else if (o.result === STATUS.WARNING) stats.warning++;
    else if (o.result === STATUS.BLOCKED) stats.blocked++;
    else stats.pass++;
  };

  if (target.type === 'html') {
    const ex = target.html;
    stats.scanned = { cssDeclarations: ex.decls.length, colorLiterals: ex.colors.length };

    // 分类收集：界面色硬违规逐条报；阶梯外数值汇总报（避免 30+ 条噪声刷屏）
    const colorFails = [];
    const exemptHits = [];       // 规则 6 豁免留痕
    const fontOutliers = new Map();
    const spacingOutliers = new Map();
    const radiusOutliers = new Map();
    const shadowHits = [];

    for (const d of ex.decls) {
      const loc = `${target.path}:${d.line} [${d.selector} { ${d.prop} }]`;
      const sel = d.selector.trim();
      const isScaffold = ctx.scaffoldSelectors.test(sel);
      const isActivity = ctx.activitySelectors.test(sel) || ctx.activitySelectors.test(d.value);
      const exempt = isScaffold || isActivity;

      // ① 色值：界面色严格比对色板（唯一真值）；豁免区依据规则 6 放行并留痕
      if (COLOR_PROPS.test(d.prop)) {
        const rawColors = d.value.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)/g) || [];
        for (const rc of rawColors) {
          const c = parseColor(rc);
          if (!c) continue;
          if (hexSet.has(c.hex)) continue;                       // 色板内 → 合规
          if (c.alpha < 1 && alphaAllowed.has(Number(c.alpha.toFixed(3))) && hexSet.has(c.hex)) continue;
          if (exempt) {
            exemptHits.push(`${sel}{${d.prop}:${rc}} → ${isScaffold ? '画布外壳/系统控件/图片占位' : '活动素材'}`);
            continue;
          }
          colorFails.push({ rc, c, loc, sel, prop: d.prop });
        }
      }

      // ② 字号：阶梯外 → 汇总 WARNING（规范只给 4 档 CSS 阶梯，未声明穷举白名单）
      if (d.prop === 'font-size') {
        const m = d.value.match(/(\d+(?:\.\d+)?)px/);
        if (m) {
          const v = parseFloat(m[1]);
          if (!fontSizes.has(v) && !componentExact.stroke.has(v)) {
            if (!fontOutliers.has(v)) fontOutliers.set(v, []);
            fontOutliers.get(v).push(`${sel}:${d.line}`);
          }
        }
      }

      // ③ 字重：规范明确 400/500/600（+ 700/800 兜底）→ 硬判定
      if (d.prop === 'font-weight') {
        const v = parseInt(d.value, 10);
        if (!Number.isNaN(v) && !weights.has(v)) push({
          id: 'T-FW-' + stats.checked, dimension: meta.name,
          description: `非规范字重 ${v}`, spec: 'tokens.md Typography（Regular 400 / Medium 500 / Semibold 600）',
          severity: SEVERITY.MAJOR, suggestion: '改用 400 / 500 / 600',
          result: STATUS.FAIL, location: loc, evidence: d.value });
      }

      // ④ 圆角：阶梯 + 组件实测特例；阶梯外汇总 WARNING
      if (d.prop === 'border-radius') {
        for (const m of d.value.matchAll(/(\d+(?:\.\d+)?)px/g)) {
          const v = parseFloat(m[1]);
          if (!radiusScale.has(v) && !componentExact.radius.has(v) && v <= 100) {
            if (!radiusOutliers.has(v)) radiusOutliers.set(v, []);
            radiusOutliers.get(v).push(`${sel}:${d.line}`);
          }
        }
      }

      // ⑤ 间距：阶梯外汇总 WARNING
      if (SPACING_PROPS.test(d.prop)) {
        for (const m of d.value.matchAll(/(-?\d+(?:\.\d+)?)px/g)) {
          const v = Math.abs(parseFloat(m[1]));
          if (!spacingScale.has(v) && v > 0) {
            if (!spacingOutliers.has(v)) spacingOutliers.set(v, []);
            spacingOutliers.get(v).push(`${sel}{${d.prop}}:${d.line}`);
          }
        }
      }

      // ⑥ 阴影：规范未定义 Shadow Token → BLOCKED（条件不足）
      if (d.prop === 'box-shadow') shadowHits.push(`${sel}:${d.line} → ${d.value.slice(0, 60)}`);
    }

    // ── 生成 issues ──
    for (const f of colorFails) push({
      id: 'T-C-' + stats.checked, dimension: meta.name,
      description: `界面色 ${f.rc} 不在规范色板中（解析为 ${f.c.hex}）`,
      location: f.loc, spec: 'references/tokens.md 中性色 N 系列 / 配色方案 / component-registry.md §1',
      severity: SEVERITY.MAJOR, suggestion: '替换为色板中的等价色值；若为活动素材请移入豁免区并说明依据',
      result: STATUS.FAIL, evidence: `selector=${f.sel}, prop=${f.prop}`, autoFixable: true,
    });

    if (exemptHits.length) push({
      id: 'T-EXEMPT', dimension: meta.name,
      description: `按「界面用色规则 6」豁免 ${exemptHits.length} 处非色板色值（画布外壳 / 系统控件 / 图片占位 / 活动素材），未做 Token 比对`,
      location: target.path, spec: 'references/tokens.md「界面用色规则 6：商品照片、活动插画及原生系统控件沿用素材用色」',
      severity: SEVERITY.INFO, suggestion: '素材用色无 Token 依据，如需一致性校验请补充正式色板；本次按规范豁免，不判违规也不标 PASS',
      result: STATUS.WARNING, evidence: exemptHits.slice(0, 8).join(' | ') + (exemptHits.length > 8 ? ` …共 ${exemptHits.length} 处` : ''),
    });

    const outlierNote = '规范仅给出阶梯值，未声明穷举白名单；且 HTML 预览稿 CSS px 与 Figma 实测 pt 非一一对应，静态无法判定是否违规 → 标 WARNING，交人工核对';
    if (fontOutliers.size) push({
      id: 'T-FS-OUT', dimension: meta.name,
      description: `字号阶梯外数值 ${fontOutliers.size} 种（${[...fontOutliers.keys()].sort((a, b) => a - b).join(' / ')}px）`,
      location: target.path, spec: 'tokens.md Typography（10/12/14/16px）| registry 实测 pt 字号（10/12/13/14/15/20pt）',
      severity: SEVERITY.MINOR, suggestion: '人工确认是否为组件实测字号；如需程序化硬判定，须先把完整字号表写入 tokens.md',
      result: STATUS.WARNING, evidence: outlierNote + '；明细 ' + [...fontOutliers].map(([v, ls]) => `${v}px@${ls.length}处`).join(', '),
    });
    if (spacingOutliers.size) push({
      id: 'T-S-OUT', dimension: meta.name,
      description: `间距阶梯外数值 ${spacingOutliers.size} 种（${[...spacingOutliers.keys()].sort((a, b) => a - b).join(' / ')}px）`,
      location: target.path, spec: 'tokens.md Spacing（4/8/12/16/24/32）',
      severity: SEVERITY.INFO, suggestion: '细调值优先对齐阶梯；确需保留请在设计说明中记录，本次不判违规',
      result: STATUS.WARNING, evidence: outlierNote + '；明细 ' + [...spacingOutliers].map(([v, ls]) => `${v}px@${ls.length}处`).join(', '),
    });
    if (radiusOutliers.size) push({
      id: 'T-R-OUT', dimension: meta.name,
      description: `圆角阶梯外数值 ${radiusOutliers.size} 种（${[...radiusOutliers.keys()].sort((a, b) => a - b).join(' / ')}px）`,
      location: target.path, spec: 'tokens.md Border radius（2/4/8/999）+ registry 组件实测特例（r9/r12/r16/r18）',
      severity: SEVERITY.INFO, suggestion: '人工确认是否为组件实测圆角；组件特例已按 registry 放行',
      result: STATUS.WARNING, evidence: outlierNote + '；明细 ' + [...radiusOutliers].map(([v, ls]) => `${v}px@${ls.length}处`).join(', '),
    });
    if (shadowHits.length) push({
      id: 'T-SH', dimension: meta.name,
      description: `使用 ${shadowHits.length} 处 box-shadow，但规范未定义阴影 Token，无法判定是否合规`,
      location: target.path, spec: 'references/tokens.md（无 Shadow 章节）', severity: SEVERITY.MINOR,
      suggestion: '补充阴影 Token 后校验；本次不得标 PASS',
      result: STATUS.BLOCKED, evidence: shadowHits.slice(0, 4).join(' | '),
    });

    note = '硬判定=色板界面色/字重/C 常量；阶梯类（字号·间距·圆角）按规范局限汇总为 WARNING；素材色按规则 6 豁免留痕';
  } else {
    // ── JS 侧：C.* 引用、渐变 stops alpha、IIFE、字体加载顺序 ──
    // tpl-*.js 是片段：IIFE / 字体加载 / 渐变 stops 属于 preamble 的全局约束，
    // 必须基于「构建后的组合脚本」判断，否则会对片段误报 T-IIFE（2026-11-19 修正）。
    const ex = target.js;
    const techSrc = target.composed && target.builtCode ? target.builtCode : target.raw;
    const tech = {
      hasIIFE: /\(async\s*\(\)\s*=>\s*\{/.test(techSrc),
      fontLoadLine: techSrc.indexOf('loadFontAsync') >= 0
        ? techSrc.slice(0, techSrc.indexOf('loadFontAsync')).split('\n').length : null,
      firstTextLine: (() => { const i = techSrc.search(/\b(characters\s*=|createText\(|mkT\()/); return i >= 0 ? techSrc.slice(0, i).split('\n').length : null; })(),
      gradientStops: [...techSrc.matchAll(/gradientStops\s*:\s*\[([\s\S]*?)\]/g)].map(g => ({
        line: techSrc.slice(0, g.index).split('\n').length, body: g[1],
        missingAlpha: /position\s*:\s*[\d.]+\s*,\s*color\s*:\s*\{[^}]*\}(?!\s*,\s*a)/.test(g[1]) && !/a\s*:/.test(g[1]),
      })),
    };
    for (const ref of ex.cRefs) {
      if (!cConst.has(ref.name)) {
        push({ id: 'T-C-' + stats.checked, dimension: meta.name,
          description: `引用了未定义的 C 常量 C.${ref.name}`, location: `${target.path}:${ref.line}`,
          spec: 'scripts/preamble.js C 常量表（唯一色板）', severity: SEVERITY.MAJOR,
          suggestion: '改用 C 表中的常量或补充规范色值', result: STATUS.FAIL, evidence: `C.${ref.name}` });
      }
    }
    for (const g of tech.gradientStops) {
      if (g.missingAlpha) push({ id: 'T-G-' + stats.checked, dimension: meta.name,
        description: 'GRADIENT_LINEAR 的 gradientStops 颜色缺少 alpha（Scripter 会直接中断）',
        location: `${target.path}:${g.line}`, spec: 'references/scripter-api.md 渐变 stops 坑位 / CHANGELOG 2026.11.04',
        severity: SEVERITY.BLOCKER, suggestion: '给每个 stop 的 color 加 a:1', result: STATUS.FAIL, evidence: g.body.slice(0, 80) });
    }
    if (!tech.hasIIFE) push({ id: 'T-IIFE', dimension: meta.name,
      description: '构建后的脚本缺少 async IIFE 包裹（Scripter 拒绝顶层 await）', location: target.path,
      spec: 'SKILL.md Hard Rules / templates/INDEX.md', severity: SEVERITY.BLOCKER,
      suggestion: '用 (async () => { ... })() 包裹', result: STATUS.FAIL, evidence: '构建产物中未检测到 (async () => {' });
    if (tech.fontLoadLine !== null && tech.firstTextLine !== null && tech.fontLoadLine > tech.firstTextLine) {
      push({ id: 'T-FONT', dimension: meta.name, description: '字体加载晚于首个 Text 节点',
        location: target.path, spec: 'references/scripter-api.md 字体加载顺序',
        severity: SEVERITY.BLOCKER, suggestion: '把 loadFontAsync 放到所有 Text 之前', result: STATUS.FAIL,
        evidence: `loadFontAsync@L${tech.fontLoadLine} > firstText@L${tech.firstTextLine}` });
    }
  }
  return { issues, note, stats, blocked: false };
}
