/** R2 设计规范校验：颜色 / 字号 / 圆角 / 行高 / 字重 / 裸值，全部对照 design-tokens.json */
import { allDeclarations, COLOR_RE, NUM_RE } from '../lib/artifact.mjs';
import { canonColor, colorRGB } from '../lib/evidence.mjs';
import { begin, ev, issue, finish, cap } from '../lib/checker.mjs';

const FONT_PROPS = new Set(['font-size', 'font']);
const RADIUS_PROPS = new Set(['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius']);
const WEIGHT_PROPS = new Set(['font-weight']);
const LINE_PROPS = new Set(['line-height']);

function num(v) {
  const m = String(v).match(/(-?\d+(?:\.\d+)?)px/);
  return m ? Number(m[1]) : null;
}

/**
 * 从 design-system-conflicts.json 读取「已裁决」的圆角例外。
 * 这些值不是新标准，而是真实帧实读优先于全局 Token 的裁决结果，
 * 校验器不得把它们当违规、更不得自动改成全局值（会降低设计要求）。
 */
function conflictRadiusAllowances(ctx) {
  const set = new Set();
  const refs = [];
  for (const cf of ctx.evidence.conflicts) {
    const scope = `${cf.component || ''} ${cf.field || ''}`;
    if (!/弹出层|Popup|Sheet|底部通栏/i.test(scope)) continue;
    if (!/圆角|radius/i.test(scope)) continue;
    const text = `${cf.decision || ''} ${cf.componentValue || ''}`;
    for (const m of text.matchAll(/\br(\d+)|radius\s*(\d+)|(\d+)px\b/gi)) {
      const n = Number(m[1] || m[2] || m[3]);
      if (n > 0 && n < 100) set.add(n);
    }
    refs.push(`${cf.component} · ${cf.field}：${cf.decision}`);
  }
  return { set, refs };
}

export function run(ctx) {
  const out = [];
  const art = ctx.art;
  const T = ctx.evidence.tokens;
  if (art.type !== 'html') {
    // 非 HTML 产物，Token 类规则无 CSS 可查，诚实标记 NOT CHECKED
    for (const id of ['R2-01', 'R2-02', 'R2-03', 'R2-04', 'R2-05', 'R2-06', 'R2-07']) {
      const c = begin(ctx, id);
      c.checkedCount = 0;
      c.note = `产物类型 ${art.type} 无 CSS 声明，Token 规则未执行（请改用 page.json 的结构化 tokenRef 校验）`;
      out.push(finish(ctx, c));
    }
    return out;
  }

  const decls = allDeclarations(art);
  const rootVars = art.rootVars;
  const radiusExceptions = conflictRadiusAllowances(ctx);

  // ---- R2-01 :root 变量色值命中 Token ----
  {
    const c = begin(ctx, 'R2-01');
    let checked = 0;
    for (const [name, value] of rootVars) {
      const col = canonColor(value);
      if (!col) continue;
      checked++;
      const rgb = colorRGB(value);
      const exact = T.colorsCanon.has(col);
      const derived = rgb && T.colorsRGB.has(rgb);
      if (!exact && !derived) issue(c, ctx, {
        description: `:root 变量 ${name} = ${value}，色值不在 design-tokens.json 真值表中`,
        line: art.rootVarLines.get(name),
        selector: ':root',
        detail: name,
        suggestion: '改用 design-tokens.json 里已定义的 Token，或先补登记 Token 再使用（禁止自造官方色）',
        severity: 'P1',
        evidence: value
      });
    }
    c.checkedCount = checked;
    ev(c, 'design-tokens.json', `合法色值 ${T.colorsCanon.size} 条 / RGB 族 ${T.colorsRGB.size} 组`);
    ev(c, ctx.fileLabel, `:root 共 ${rootVars.size} 个变量，其中色值变量 ${checked} 个`);
    out.push(finish(ctx, c));
  }

  // ---- R2-02 裸色值 ----
  {
    const c = begin(ctx, 'R2-02');
    let checked = 0;
    for (const d of decls) {
      const colors = String(d.value).match(COLOR_RE) || [];
      for (const col of colors) {
        if (/^(transparent|currentcolor|inherit|initial|unset)$/i.test(col)) continue;
        checked++;
        const canon = canonColor(col);
        const rgb = colorRGB(col);
        const inTokens = canon && (T.colorsCanon.has(canon) || (rgb && T.colorsRGB.has(rgb)));
        const hasVar = [...rootVars.values()].some((v) => canonColor(v) === canon);
        const overlayToken = T.raw?.shadow?.['overlay.mask']?.value || '';
        const isOverlay = /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,/.test(col) && /60%|0\.6/.test(overlayToken);
        const qualifier = inTokens ? '（虽命中 Token 但未走 CSS 变量）'
          : isOverlay ? '（派生自 shadow.overlay.mask，但仍未走 CSS 变量）'
            : '（且不在 Token 真值表）';
        issue(c, ctx, {
          description: `页面内出现裸色值 ${col}${qualifier}`,
          line: d.line,
          selector: d.selector,
          detail: `${d.prop}: ${cap(d.value, 60)}`,
          suggestion: hasVar
            ? '替换为对应的 :root CSS 变量（可自动修复，值不变）'
            : '先在 :root 按 design-tokens.json 登记变量，再改用 var()',
          severity: 'P1',
          evidenceValue: col
        });
      }
    }
    c.checkedCount = decls.length; // 实检对象数 = 扫描的声明数，不是违规数
    ev(c, 'constraints.md', 'C-82 颜色/尺寸只走 :root CSS 变量，页面内无裸色值');
    ev(c, ctx.fileLabel, `扫描 ${decls.length} 条 CSS 声明，命中 ${checked} 处裸色值`);
    c.metrics = { declarations: decls.length, nakedColors: checked };
    out.push(finish(ctx, c));
  }

  // ---- R2-03 字号档位 ----
  {
    const c = begin(ctx, 'R2-03');
    let checked = 0;
    for (const d of decls) {
      if (!FONT_PROPS.has(d.prop)) continue;
      const n = num(d.value);
      if (n === null) continue;
      checked++;
      if (!T.fontSizes.has(n) && !T.fontSizesCare.has(n)) issue(c, ctx, {
        description: `font-size: ${d.value} 不在合法档位 [${[...T.fontSizes].join(',')}] 中`,
        line: d.line, selector: d.selector, detail: d.value,
        suggestion: `改用 design-tokens.json font.size 中的档位（${c.rule.specSource}）`,
        severity: 'P1'
      });
    }
    c.checkedCount = checked;
    ev(c, 'design-tokens.json', `font.size = [${[...T.fontSizes].join(', ')}]`);
    ev(c, ctx.fileLabel, `扫描到 ${checked} 条 font-size 声明`);
    out.push(finish(ctx, c));
  }

  // ---- R2-04 圆角档位 ----
  {
    const c = begin(ctx, 'R2-04');
    let checked = 0;
    const allowed = T.radii;
    for (const d of decls) {
      if (!RADIUS_PROPS.has(d.prop)) continue;
      for (const m of String(d.value).matchAll(NUM_RE)) {
        const n = Number(m[1]);
        checked++;
        if (n >= 100) continue; // radius.pill = 高度÷2，大圆角合法
        if (radiusExceptions.set.has(n)) continue; // 已裁决冲突，不能自动改回全局值
        if (!allowed.has(n)) issue(c, ctx, {
          description: `${d.prop}: ${d.value} 中的 ${n}px 不在合法圆角 [${[...allowed].sort((a, b) => a - b).join(',')}] 中${n >= 16 ? '（≥16px 疑似胶囊/圆形，按 radius.pill = 高度÷2，需人工确认）' : ''}`,
          line: d.line, selector: d.selector, detail: d.value,
          suggestion: n >= 16
            ? '若确为胶囊/圆形，按 radius.pill 公式保留并在报告说明；否则改用 radius 档位'
            : '改用 design-tokens.json radius 档位；卡片统一 8px（USER_OVERRIDE）',
          severity: n >= 16 ? 'P2' : 'P1'
        });
      }
    }
    c.checkedCount = checked;
    ev(c, 'design-tokens.json', `radius = {${[...allowed].sort((a, b) => a - b).join(', ')}}`);
    if (radiusExceptions.set.size) {
      ev(c, 'design-system-conflicts.json', `已裁决圆角例外 [${[...radiusExceptions.set].join(',')}]：${radiusExceptions.refs.join('；')}`);
      c.note = `命中 ${radiusExceptions.set.size} 个已裁决冲突圆角（如底部弹层 r12），按真实帧优先保留，不自动修正`;
    }
    out.push(finish(ctx, c));
  }

  // ---- R2-05 裸圆角 ----
  {
    const c = begin(ctx, 'R2-05');
    let checked = 0, violations = 0;
    for (const d of decls) {
      if (!RADIUS_PROPS.has(d.prop)) continue;
      checked++; // 实检对象数
      if (/var\(/.test(d.value)) continue;
      if (!/\d/.test(d.value)) continue;
      const n = num(d.value);
      if (n === 0 || (n !== null && radiusExceptions.set.has(n))) continue; // 0 = radius.inputField；已裁决冲突不得自动改
      violations++;
      const matchVar = [...rootVars.entries()].find(([, v]) => num(v) === n && String(v).includes('px'));
      issue(c, ctx, {
        description: `圆角写裸值 ${cap(d.value, 40)}，未走 CSS 变量`,
        line: d.line, selector: d.selector, detail: d.value,
        suggestion: matchVar ? `替换为 var(${matchVar[0]})（可自动修复，值不变）` : '在 :root 登记 --r-* 变量后改用 var()',
        severity: 'P2',
        fixable: !!matchVar,
        evidenceValue: d.value
      });
    }
    c.checkedCount = checked;
    ev(c, 'constraints.md', 'C-82 禁止裸圆角/裸尺寸');
    ev(c, ctx.fileLabel, `扫描 ${checked} 条圆角声明，其中 ${violations} 条写裸值`);
    c.metrics = { radiusDeclarations: checked, nakedRadius: violations };
    out.push(finish(ctx, c));
  }

  // ---- R2-06 行高 ×1.4 ----
  {
    const c = begin(ctx, 'R2-06');
    let checked = 0;
    const allowedRatio = new Set([1, 1.2, 1.4, 1.5, 1.6]); // 1 为 Tag 专用（html-prototype.md §9.1b）
    for (const d of decls) {
      if (!LINE_PROPS.has(d.prop)) continue;
      const v = String(d.value).trim();
      if (/px|%|var\(/.test(v)) continue;
      const r = Number(v);
      if (!Number.isFinite(r)) continue;
      checked++;
      if (!allowedRatio.has(Number(r.toFixed(2)))) issue(c, ctx, {
        description: `line-height: ${v} 既不是 Token 规定的 1.4，也不是 Tag 专用的 1`,
        line: d.line, selector: d.selector, detail: v,
        suggestion: '正文按 字号 × 1.4；行内 Tag 用 line-height:1（§9.1b）',
        severity: 'P2'
      });
    }
    c.checkedCount = checked;
    ev(c, 'design-tokens.json', `font.lineHeight.ratio = ${T.lineHeightRatio}`);
    out.push(finish(ctx, c));
  }

  // ---- R2-07 字重 ----
  {
    const c = begin(ctx, 'R2-07');
    let checked = 0;
    const allowed = new Set(['400', '500', '600', 'regular', 'normal', 'medium', 'semibold']);
    for (const d of decls) {
      if (!WEIGHT_PROPS.has(d.prop)) continue;
      const v = String(d.value).trim().toLowerCase();
      checked++;
      if (!allowed.has(v)) issue(c, ctx, {
        description: `font-weight: ${v} 超出 Regular / Medium / Semibold 三档`,
        line: d.line, selector: d.selector, detail: v,
        suggestion: '改用 400 / 500 / 600（对应 Regular / Medium / Semibold）',
        severity: 'P2'
      });
    }
    c.checkedCount = checked;
    ev(c, 'design-tokens.json', `font.weight = ${[...T.fontWeights].join(' / ')}`);
    out.push(finish(ctx, c));
  }

  return out;
}
