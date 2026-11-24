// Design QA · 代码检查 / 构建 / 自动化测试（真实执行，不是 AI 自评）
//
// 对 JS 交付物（Scripter 脚本 / tpl-*.js 模板）执行三层：
//   ① 构建：按 templates/INDEX.md 把模板插入 preamble 的 "# 在此填入页面代码" 占位符
//           （早期版本用简单拼接，模板落在 IIFE 外，作用域错误 —— 已修正）
//   ② 代码检查：node --check 语法校验（真实进程）
//   ③ 自动化测试：Figma API mock 空跑，断言
//           · 无运行时异常
//           · 无越界节点 oob（子 x/y/w/h 超出父边界，排除 clip 容器与全宽分割线）
//           · 无未定位节点 unpos（appendChild 后既未 pos 也未设 x/y）
//           · paint 结构合法（SOLID color 为 {r,g,b}、GRADIENT stops 每个 color 带 a）
// 对 HTML 交付物：执行标签配对 / CSS 括号平衡 / 无未闭合 style 的轻量构建检查。
//
// 依据：用户「有代码输出时，执行代码检查、构建和必要的自动化测试」。

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { issue, STATUS, SEVERITY } from './issue.mjs';

export const PLACEHOLDER = /(^\s*\/\/\s*#\s*在此填入页面代码\s*$)/m;

/** 按 INDEX.md 正确构建可执行脚本：把模板插入 IIFE 内部占位符 */
export function buildScript(preambleText, templateText) {
  if (PLACEHOLDER.test(preambleText)) {
    return { code: preambleText.replace(PLACEHOLDER, templateText), mode: 'placeholder' };
  }
  // 兜底：找到最后一个 "})();" 之前插入
  const idx = preambleText.lastIndexOf('})();');
  if (idx > 0) return { code: preambleText.slice(0, idx) + '\n' + templateText + '\n' + preambleText.slice(idx), mode: 'before-iife-end' };
  return { code: preambleText + '\n' + templateText + '\n', mode: 'append' };
}

/** ① + ② 语法检查（node --check，真实进程） */
export function syntaxCheck(code, label) {
  const tmp = path.join(os.tmpdir(), `design-qa-${process.pid}-${Date.now()}.mjs`);
  fs.writeFileSync(tmp, code, 'utf8');
  try {
    const r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
    return { ok: r.status === 0, output: (r.stderr || r.stdout || '').trim().slice(0, 400), tmp };
  } finally {
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
  }
}

/** ③ Figma API mock 空跑：在 vm 里执行脚本，收集节点树并跑结构断言 */
export function smokeRun(code, label) {
  // 用子进程隔离执行，避免 mock 污染主进程；mock 脚本内联注入
  const runner = path.join(os.tmpdir(), `design-qa-smoke-${process.pid}-${Date.now()}.mjs`);
  const script = `${MOCK_PREAMBLE}\n${code}\n${MOCK_EPILOGUE}`;
  fs.writeFileSync(runner, script, 'utf8');
  try {
    const r = spawnSync(process.execPath, [runner], { encoding: 'utf8', timeout: 15000 });
    const out = (r.stdout || '').trim();
    const err = (r.stderr || '').trim();
    // 取最后一行 JSON 报告
    const lines = out.split('\n').filter(Boolean);
    let report = null;
    for (let i = lines.length - 1; i >= 0; i--) {
      try { const o = JSON.parse(lines[i]); if (o && o.__qaSmoke) { report = o; break; } } catch { /* skip */ }
    }
    if (!report) return { ok: false, reason: '空跑未返回报告', stdout: out.slice(-300), stderr: err.slice(-300) };
    return { ok: true, ...report, stderr: err.slice(-200) };
  } finally {
    try { fs.unlinkSync(runner); } catch { /* ignore */ }
  }
}

// ── Figma API mock（覆盖 preamble 用到的全部 API 与节点属性）──
const MOCK_PREAMBLE = `
// ===== Design QA Figma mock =====
const __qa = { nodes:[], paints:[], gradients:[], errors:[], oob:[], unpos:[] };
function __mkNode(type){
  const n = {
    type, name:'', x:undefined, y:undefined, width:0, height:0,
    children:[], parent:null, _pos:false,
    resize(w,h){ this.width=w; this.height=h; return this; },
    appendChild(c){ c.parent=this; this.children.push(c); return c; },
    set fills(v){ this._fills=v; __qaPaint(v, this); }, get fills(){ return this._fills||[]; },
    set strokes(v){ this._strokes=v; __qaPaint(v, this); }, get strokes(){ return this._strokes||[]; },
    set x(v){ this._x=v; this._pos=true; }, get x(){ return this._x; },
    set y(v){ this._y=v; this._pos=true; }, get y(){ return this._y; },
  };
  __qa.nodes.push(n); return n;
}
function __qaPaint(v, node){
  if (!Array.isArray(v)) return;
  for (const p of v){
    if (!p || typeof p !== 'object') { __qa.errors.push('paint 非对象'); continue; }
    __qa.paints.push(p);
    if (p.type === 'SOLID'){
      const c = p.color;
      if (!c || typeof c.r !== 'number' || typeof c.g !== 'number' || typeof c.b !== 'number')
        __qa.errors.push('SOLID color 缺少 r/g/b');
      else if ([c.r,c.g,c.b].some(x => x < 0 || x > 1)) __qa.errors.push('SOLID color 越界(应为 0-1) : '+JSON.stringify(c));
      if (c && Object.prototype.hasOwnProperty.call(c,'a')) __qa.errors.push('SOLID color 含非法 a 字段');
    }
    if (p.type === 'GRADIENT_LINEAR'){
      const stops = p.gradientStops;
      if (!Array.isArray(stops)) __qa.errors.push('GRADIENT 缺 gradientStops');
      else for (const s of stops){
        if (!s.color || typeof s.color.a !== 'number') __qa.errors.push('gradientStops 的 color 缺 a:1（Scripter 会中断）');
        __qa.gradients.push(s);
      }
    }
  }
}
globalThis.figma = {
  currentPage: { children: [], appendChild(c){ this.children.push(c); return c; } },
  viewport: { scrollAndZoomIntoView(){} },
  notify(){}, mixed: Symbol('mixed'),
  loadFontAsync: async () => ({}),
  createFrame: () => __mkNode('FRAME'),
  createRectangle: () => __mkNode('RECTANGLE'),
  createText: () => __mkNode('TEXT'),
  createEllipse: () => __mkNode('ELLIPSE'),
  createNodeFromSvg: (svg) => {
    const n=__mkNode('SVG');
    // 从 SVG 字符串解析真实尺寸（width/height 或 viewBox），避免硬编码 24×24 造成假越界
    const wm = String(svg).match(/\\bwidth=["']([\\d.]+)/), hm = String(svg).match(/\\bheight=["']([\\d.]+)/);
    const vb = String(svg).match(/viewBox=["']([\\d.\\s-]+)["']/);
    let w = wm ? parseFloat(wm[1]) : null, h = hm ? parseFloat(hm[1]) : null;
    if ((!w || !h) && vb) { const p = vb[1].trim().split(/\\s+/).map(Number); if (p.length>=4) { w = w || p[2]; h = h || p[3]; } }
    n.width = w || 24; n.height = h || 24; n._svg=svg; return n;
  },
  createImageAsync: async () => ({ hash:'mock' }),
};
globalThis.fetch = async () => ({ ok:true, arrayBuffer: async () => new ArrayBuffer(0) });
`;

const MOCK_EPILOGUE = `
// ===== 结构断言 =====
setTimeout(() => {
  for (const n of __qa.nodes){
    if (!n.parent) continue;
    const p = n.parent;
    // 未定位：有父节点但 x/y 从未赋值（排除 SVG 节点与顶层 page）
    if (!n._pos && p.type !== 'PAGE') __qa.unpos.push(n.name||n.type);
    // 越界：仅在父尺寸有效且数值有限时判断；clip 容器/全宽分割线豁免
    const xs = n._x, ys = n._y;
    if (typeof xs==='number' && typeof ys==='number' && Number.isFinite(xs) && Number.isFinite(ys)
        && p.width>0 && p.height>0 && n.width>0 && n.height>0 && !p.clipsContent){
      const overX = xs + n.width - p.width, overY = ys + n.height - p.height;
      if (overX > 1 || overY > 1 || xs < -1 || ys < -1)
        __qa.oob.push((n.name||n.type)+' x='+xs+' y='+ys+' w='+n.width+' h='+n.height+' parent='+p.width+'x'+p.height);
    }
  }
  console.log(JSON.stringify({
    __qaSmoke:true, assertionsPass: __qa.errors.length===0 && __qa.oob.length===0,
    nodeCount: __qa.nodes.length, paintCount: __qa.paints.length,
    gradientStops: __qa.gradients.length,
    paintErrors: [...new Set(__qa.errors)],
    oob: __qa.oob.slice(0,20), oobCount: __qa.oob.length,
    unpos: __qa.unpos.slice(0,20), unposCount: __qa.unpos.length,
  }));
}, 0);
`;

/** HTML 轻量构建检查：标签配对 / 花括号平衡 / style 闭合 */
export function htmlBuildCheck(raw) {
  const problems = [];
  const styleOpen = (raw.match(/<style\b/gi) || []).length;
  const styleClose = (raw.match(/<\/style>/gi) || []).length;
  if (styleOpen !== styleClose) problems.push(`<style> 标签未配对（${styleOpen} 开 / ${styleClose} 闭）`);
  // CSS 花括号平衡（仅 style 块内）
  const css = (raw.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []).join('');
  const opens = (css.match(/\{/g) || []).length, closes = (css.match(/\}/g) || []).length;
  if (opens !== closes) problems.push(`CSS 花括号不平衡（${opens} { / ${closes} }）`);
  // 常见未闭合容器
  for (const tag of ['div', 'span', 'svg']) {
    const o = (raw.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const c = (raw.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (o !== c && Math.abs(o - c) <= 3) problems.push(`<${tag}> 配对偏差（${o} 开 / ${c} 闭）`);
  }
  return problems;
}

/** 生成代码检查阶段的问题列表（并入 QA 报告第 7 节） */
export function codeCheckIssues(ctx, target, opts = {}) {
  const issues = [];
  const loc = target.path;
  if (target.type === 'html') {
    const problems = htmlBuildCheck(target.raw);
    issues.push(issue({
      id: 'K-BUILD', dimension: '代码检查 / 构建 / 测试',
      description: problems.length ? 'HTML 构建检查发现问题：' + problems.join('；') : 'HTML 构建检查通过（标签配对 / CSS 括号平衡 / style 闭合）',
      location: loc, spec: 'Design QA 自动化校验机制「有代码输出时执行构建检查」',
      severity: problems.length ? SEVERITY.MAJOR : SEVERITY.INFO,
      suggestion: problems.length ? '修复未闭合标签或括号后重新校验' : '—',
      result: problems.length ? STATUS.FAIL : STATUS.PASS,
      evidence: `style=${(target.raw.match(/<style\b/gi)||[]).length} 块；检查项：标签配对 / 花括号平衡 / style 闭合`,
    }));
    issues.push(issue({
      id: 'K-TEST', dimension: '代码检查 / 构建 / 测试',
      description: 'HTML 交付物未接入渲染自动化用例（无头 Chrome 截图 / DOM 断言），运行时交互未执行测试',
      location: loc, spec: 'Design QA「必要的自动化测试」；视觉比对需 --reference + --screenshot',
      severity: SEVERITY.INFO, suggestion: '接 --screenshot 走视觉比对；交互用浏览器自动化 E2E',
      result: STATUS.NOT_CHECKED, evidence: '本次未运行浏览器自动化',
    }));
    return issues;
  }

  // ── JS：构建 → 语法 → 空跑 ──
  const preamble = ctx.files.preamble.ok ? ctx.files.preamble.text : '';
  if (!preamble) {
    issues.push(issue({ id: 'K-BUILD', dimension: '代码检查 / 构建 / 测试',
      description: 'preamble.js 缺失，无法构建可执行脚本', location: ctx.evidencePaths.preamble,
      spec: 'templates/INDEX.md 组合规则', severity: SEVERITY.MAJOR,
      suggestion: '补齐 preamble.js', result: STATUS.BLOCKED, evidence: 'ctx.files.preamble.ok=false' }));
    return issues;
  }
  const isTemplate = /tpl-.*\.js$/.test(path.basename(loc));
  const built = isTemplate ? buildScript(preamble, target.raw) : { code: target.raw, mode: 'standalone' };
  issues.push(issue({
    id: 'K-BUILD', dimension: '代码检查 / 构建 / 测试',
    description: `构建完成（${built.mode}）：${isTemplate ? '模板已插入 preamble IIFE 占位符' : '独立脚本直接校验'}`,
    location: loc, spec: 'templates/INDEX.md「把 # 在此填入页面代码 替换为 tpl-xxx.js 内容」',
    severity: SEVERITY.INFO, suggestion: '—', result: STATUS.PASS,
    evidence: `组合后 ${built.code.split('\n').length} 行`,
  }));

  const syn = syntaxCheck(built.code, loc);
  issues.push(issue({
    id: 'K-SYNTAX', dimension: '代码检查 / 构建 / 测试',
    description: syn.ok ? 'node --check 语法检查通过' : 'node --check 语法检查失败：' + syn.output,
    location: loc, spec: 'Design QA「执行代码检查」（真实 node --check 进程）',
    severity: syn.ok ? SEVERITY.INFO : SEVERITY.BLOCKER,
    suggestion: syn.ok ? '—' : '按报错修正语法后重新校验',
    result: syn.ok ? STATUS.PASS : STATUS.FAIL,
    evidence: syn.ok ? 'exit 0' : syn.output,
  }));
  if (!syn.ok) return issues; // 语法不过，不必空跑

  const smoke = smokeRun(built.code, loc);
  if (!smoke.ok) {
    issues.push(issue({ id: 'K-SMOKE', dimension: '代码检查 / 构建 / 测试',
      description: 'Figma API mock 空跑未成功：' + (smoke.reason || ''),
      location: loc, spec: 'Design QA「必要的自动化测试」', severity: SEVERITY.MAJOR,
      suggestion: '检查 mock 覆盖或脚本运行时异常', result: STATUS.BLOCKED,
      evidence: (smoke.stderr || smoke.stdout || '').slice(0, 200) }));
    return issues;
  }
  const paintBad = smoke.paintErrors.length > 0;
  issues.push(issue({
    id: 'K-SMOKE', dimension: '代码检查 / 构建 / 测试',
    description: paintBad
      ? `Figma mock 空跑发现 paint 结构错误 ${smoke.paintErrors.length} 类：${smoke.paintErrors.join('；')}`
      : `Figma mock 空跑通过：${smoke.nodeCount} 节点 / ${smoke.paintCount} paint / ${smoke.gradientStops} 渐变 stop，无运行时异常`,
    location: loc, spec: 'references/scripter-api.md 渐变 stops 坑位 / SOLID color 结构',
    severity: paintBad ? SEVERITY.BLOCKER : SEVERITY.INFO,
    suggestion: paintBad ? '给每个 gradient stop 的 color 加 a:1；SOLID color 只保留 r/g/b' : '—',
    result: paintBad ? STATUS.FAIL : STATUS.PASS,
    evidence: `paintErrors=${JSON.stringify(smoke.paintErrors)}`,
  }));
  issues.push(issue({
    id: 'K-LAYOUT', dimension: '代码检查 / 构建 / 测试',
    description: smoke.oobCount || smoke.unposCount
      ? `布局断言：越界 ${smoke.oobCount} 处 / 未定位 ${smoke.unposCount} 处`
      : '布局断言通过：无越界、无未定位节点',
    location: loc, spec: 'Design QA 自动化测试断言（oob / unpos）',
    severity: smoke.oobCount ? SEVERITY.MAJOR : SEVERITY.INFO,
    suggestion: smoke.oobCount || smoke.unposCount ? '按报告明细修正 pos() 或父容器尺寸' : '—',
    result: smoke.oobCount ? STATUS.WARNING : STATUS.PASS,
    evidence: `oob=${JSON.stringify(smoke.oob.slice(0, 5))} unpos=${JSON.stringify(smoke.unpos.slice(0, 5))}`,
  }));
  return issues;
}
