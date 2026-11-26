// 维度 4 · 组件使用校验
// 依据：registry §2/§3/§4/§5 + CHANGELOG legacy 黑名单。
// 检查：重复造轮子、错误组合、滥用自定义样式、legacy 形态、结构硬约束。

import { issue, STATUS, SEVERITY } from '../lib/issue.mjs';
import { LEGACY } from './legacy.mjs';

export const meta = { id: '04', key: 'component-use', name: '组件使用校验', requires: ['registry', 'changelog'] };

export function check(ctx, target, opts = {}) {
  const issues = [];
  const stats = { legacyHits: 0, structureChecks: 0, structureFail: 0 };
  const seen = new Set();
  let note = '';

  if (!ctx.files.registry.ok || !ctx.files.changelog.ok) {
    return { issues: [issue({ id: 'U-000', dimension: meta.name,
      description: '组件使用规范依据缺失（registry / CHANGELOG）',
      location: ctx.evidencePaths.registry, spec: 'Design QA 唯一依据', severity: SEVERITY.MAJOR,
      suggestion: '补齐依据文件', result: STATUS.BLOCKED, evidence: 'missing' })],
      note: '校验条件不足', stats, blocked: true };
  }

  const applies = target.type === 'html' ? 'html' : 'js';
  const raw = target.raw;

  // ① Legacy 黑名单（已作废形态）
  for (const rule of LEGACY) {
    if (!rule.applies.includes(applies)) continue;
    rule.pattern.lastIndex = 0;
    let m;
    while ((m = rule.pattern.exec(raw))) {
      const line = raw.slice(0, m.index).split('\n').length;
      const key = rule.id + ':' + line;
      if (seen.has(key)) continue;
      seen.add(key);
      stats.legacyHits++;
      const conflict = rule.conflictNote ? '\n[规范冲突] ' + rule.conflictNote : '';
      issues.push(issue({
        id: 'U-L-' + rule.id + '-' + line, dimension: meta.name,
        description: rule.desc + conflict, location: `${target.path}:${line} 「${m[0].slice(0, 60)}」`,
        spec: rule.spec, severity: rule.severity,
        suggestion: rule.fixable ? (rule.fixNote || ('自动替换为 ' + (rule.fixMap || [])[0]?.[1])) : '按规范重构该组件（结构改动，需人工确认，不得自动改业务逻辑）',
        result: rule.severity === 'MINOR' ? STATUS.WARNING : STATUS.FAIL,
        evidence: 'legacy 命中: ' + m[0].slice(0, 60),
        autoFixable: !!rule.fixable,
      }));
    }
  }

  // ② 结构硬约束（HTML）
  if (target.type === 'html') {
    const ex = target.html;
    const cssText = raw;
    const checkStruct = (cond, o) => {
      stats.structureChecks++;
      if (!cond) { stats.structureFail++; issues.push(issue({ ...o, dimension: meta.name,
        id: 'U-S-' + stats.structureChecks, severity: o.severity || SEVERITY.MAJOR })); }
    };

    // 商品卡价格结构：有原价（.old）的价格行必须有到手价前缀（.lbl），秒杀卡走小步阶豁免
    const priceBlocks = [...raw.matchAll(/<div class="price">([\s\S]*?)<\/div>/g)];
    for (const pb of priceBlocks) {
      const line = raw.slice(0, pb.index).split('\n').length;
      const isFlash = /秒杀|距结束/.test(pb[1]);
      checkStruct(!/class="old"/.test(pb[1]) || isFlash || /class="lbl"/.test(pb[1]), {
        description: '常规商品卡价格行缺少「到手价」前缀（固定三段：到手价+现价+原价）',
        location: `${target.path}:${line} .price`, spec: 'registry §3 到手价规则 / 01-home.md',
        severity: SEVERITY.MAJOR, suggestion: '加 <span class="lbl">到手价</span>，与现价同色、基线对齐',
        result: STATUS.FAIL, evidence: 'price 块含原价但无 lbl' });
    }

    // 标签与品名首行对齐：.nameflow .tag 必须 vertical-align:top（禁 middle）
    const nfRule = ex.decls.find(d => /\.nameflow\s+\.tag/.test(d.selector) && d.prop === 'vertical-align');
    checkStruct(!nfRule || /top/.test(nfRule.value), {
      description: '品名首行标签未与第一行文字对齐（禁与两行文本块整体居中）',
      location: `${target.path}${nfRule ? ':' + nfRule.line : ''} .nameflow .tag`,
      spec: 'registry §2 应用规范 / SKILL.md 标签摆放硬约束',
      severity: SEVERITY.MAJOR, suggestion: '改 vertical-align:top + 标签高=行高，或行内流布局',
      result: STATUS.FAIL, evidence: nfRule ? nfRule.value : '未声明 vertical-align' });

    // 服务标签每卡 1 个
    const nameflows = [...raw.matchAll(/<div class="nameflow">([\s\S]*?)<\/div>/g)];
    for (const nf of nameflows) {
      const tint = (nf[1].match(/class="[^"]*\btint\b/g) || []).length;
      const line = raw.slice(0, nf.index).split('\n').length;
      checkStruct(tint <= 1, {
        description: `同一商品卡并列了 ${tint} 个服务标签（每卡仅 1 个）`,
        location: `${target.path}:${line} .nameflow`, spec: 'registry §2 应用规范（服务标签）',
        severity: SEVERITY.MAJOR, suggestion: '按实际履约方式只保留 1 个服务标签',
        result: STATUS.FAIL, evidence: 'tint 数=' + tint });
    }

    // 到手价前缀与现价同色
    const lblDecls = ex.decls.filter(d => /\.lbl|\.price\s+\.cur/.test(d.selector) && d.prop === 'color');
    if (lblDecls.length >= 2) {
      const vals = new Set(lblDecls.map(d => d.value.trim()));
      checkStruct(vals.size === 1, {
        description: '到手价前缀与现价颜色不一致', location: `${target.path} .lbl / .cur`,
        spec: 'registry §3 到手价规则（前缀与现价同色同变体）', severity: SEVERITY.MAJOR,
        suggestion: '统一为 var(--primary)（订单页统一 #262626）', result: STATUS.FAIL,
        evidence: [...vals].join(' | ') });
    }

    // 加购圆钮规格（18×18 / r9 / rect+rx 胶囊臂）
    if (/\.addbtn/.test(cssText)) {
      const w = ex.decls.find(d => /\.addbtn/.test(d.selector) && d.prop === 'width');
      const h = ex.decls.find(d => /\.addbtn/.test(d.selector) && d.prop === 'height');
      const r = ex.decls.find(d => /\.addbtn/.test(d.selector) && d.prop === 'border-radius');
      checkStruct(w && h && parseFloat(w.value) === 18 && parseFloat(h.value) === 18, {
        description: '加购圆钮尺寸不是实测 18×18', location: `${target.path} .addbtn`,
        spec: 'registry §4.9（Figma 1:6053 实测）', severity: SEVERITY.MAJOR,
        suggestion: '改 width/height:18px；border-radius:9px', result: STATUS.FAIL,
        evidence: `w=${w?.value} h=${h?.value}` });
      checkStruct(r && parseFloat(r.value) === 9, {
        description: '加购圆钮圆角不是 r9', location: `${target.path} .addbtn`,
        spec: 'registry §4.9', severity: SEVERITY.MINOR, suggestion: 'border-radius:9px',
        result: STATUS.WARNING, evidence: 'radius=' + r?.value });
      checkStruct(/<rect[^>]*rx="1\.115"/.test(raw) || !/class="addbtn"/.test(raw), {
        description: '加购圆钮加号未用全圆角胶囊臂（rect rx=笔画/2）',
        location: `${target.path} .addbtn svg`, spec: 'registry §4.9 笔画',
        severity: SEVERITY.MAJOR, suggestion: '用两个 rect + rx=1.115 画 +，禁 stroke-linecap',
        result: STATUS.FAIL, evidence: '未检出 rx="1.115"' });
    }

    // 筛选 Tabs 白底变体：白 sheet 内 chip 必须灰底（#F7F8FA）
    const chipBg = ex.decls.find(d => /\.chip\b(?!\.on|:)/.test(d.selector) && d.prop === 'background');
    if (chipBg) {
      checkStruct(/F7F8FA|247,\s*248,\s*250/.test(chipBg.value) || /#fff/i.test(chipBg.value), {
        description: '快捷筛选 chip 底色与所在容器底色变体不匹配',
        location: `${target.path}:${chipBg.line} .chip`, spec: 'registry §4.8 双变体 / INDEX.md 通用约束',
        severity: SEVERITY.MAJOR, suggestion: '白底页用 #F7F8FA 灰 chip；灰底页用白 chip + 橙 0.5px 描边选中',
        result: STATUS.FAIL, evidence: chipBg.value });
    }

    // 按钮纯文字（icon+文字），排除加购圆钮
    for (const t of ex.tags) {
      const cls = t.attrs.class || '';
      if (!/\bbtn\b|\bcta\b|addbtn/.test(cls) || /addbtn/.test(cls)) continue;
      const after = raw.slice(t.offset || 0, (t.offset || 0) + 200);
      // 简化：检查按钮标签后紧跟 svg 的模式
      if (/class="[^"]*\b(btn|cta)\b[^"]*"[^>]*>\s*<svg/.test(raw)) {
        checkStruct(false, { description: '文字按钮内混入 SVG 图标（icon+文字 违规）',
          location: target.path, spec: 'SKILL.md Hard Rules / registry §4 通用硬约束',
          severity: SEVERITY.MAJOR, suggestion: '去掉图标，只留文字；纯图标圆钮是独立组件', result: STATUS.FAIL,
          evidence: '按钮内检出 <svg>' });
        break;
      }
    }

    // Tabbar 84 = 50 + 34
    const tb = ex.decls.find(d => /\.tabbar/.test(d.selector) && d.prop === 'height');
    if (tb) checkStruct(parseFloat(tb.value) === 84, {
      description: '底部标签栏高度不是 84（50 内容 + 34 安全区）', location: `${target.path}:${tb.line} .tabbar`,
      spec: 'registry §5 / tokens.md iPhone safe-area', severity: SEVERITY.MAJOR,
      suggestion: 'height:84px + padding-bottom:34px', result: STATUS.FAIL, evidence: tb.value });
  } else {
    // JS：重复造轮子（手拼按钮）
    const ex = target.js;
    const handMade = /name\s*:\s*['"]Btn\/|createFrame\(\)[\s\S]{0,200}createText\(\)/.test(raw)
      && !/mkBtn\(/.test(raw);
    stats.structureChecks++;
    if (handMade) {
      stats.structureFail++;
      issues.push(issue({ id: 'U-S-JS-1', dimension: meta.name,
        description: '手写 frame+text 拼按钮（重复造轮子）', location: target.path,
        spec: 'registry §4「按钮是组件，不是临时拼的」', severity: SEVERITY.BLOCKER,
        suggestion: '改用 mkBtn / mkBottomActionBar / mkDialog', result: STATUS.FAIL, evidence: '检出手工按钮结构' }));
    }
  }
  return { issues, note, stats, blocked: false };
}
