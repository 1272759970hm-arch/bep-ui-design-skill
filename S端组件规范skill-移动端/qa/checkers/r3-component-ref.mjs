/** R3 组件引用校验：存在性 / status 诚实性 / NOT_FOUND 冒充 / 变形使用 / Scripter 代码 */
import { normalizeName, enSig } from '../lib/evidence.mjs';
import { begin, ev, issue, finish, cap } from '../lib/checker.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

function annotations(ctx) {
  if (ctx.art.type !== 'html') return [];
  const list = [];
  for (const t of ctx.art.tags) {
    const comp = t.attrs['data-bep-component'];
    const status = t.attrs['data-bep-status'];
    if (!comp && !status) continue;
    list.push({
      name: comp || '', status: status || '', line: t.line,
      selector: `${t.tag}${t.attrs.class ? '.' + String(t.attrs.class).split(/\s+/)[0] : ''}`
    });
  }
  return list;
}

function resolve(ctx, name) {
  const R = ctx.evidence.registry;
  const M = ctx.evidence.missingComponents;
  const base = String(name).replace(/\s*\(.*?\)\s*$/, '').trim();
  const n = normalizeName(base);
  const sig = enSig(base);
  const hit = R.byNorm.get(n) || R.alias.get(n) || R.byName.get(base)
    || (sig ? R.en.get(sig) : null);
  const isMissing = M.norm.has(n) || M.names.has(base) || (sig ? M.en.has(sig) : false);
  return { hit, isMissing, base };
}

export function run(ctx) {
  const out = [];
  const ann = annotations(ctx);
  const R = ctx.evidence.registry;

  // ---- R3-01 组件引用存在性 ----
  {
    const c = begin(ctx, 'R3-01');
    c.checkedCount = ann.length;
    let valid = 0;
    for (const a of ann) {
      if (!a.name) continue;
      const { hit, isMissing, base } = resolve(ctx, a.name);
      if (hit || isMissing) valid++;
      else issue(c, ctx, {
        description: `虚构组件：data-bep-component="${a.name}" 既不在 component-registry.json，也不在 missing-components.json`,
        line: a.line, selector: a.selector, detail: a.name,
        suggestion: '改用 registry 里的真实组件名；若确属缺口，先追加进 missing-components.json 再引用',
        severity: 'P0'
      });
    }
    c.metrics = { total: ann.length, valid };
    ev(c, 'component-registry.json', `${R.entries.length} 个组件条目 / ${ctx.evidence.missingComponents.items.length} 个已登记缺口`);
    ev(c, ctx.fileLabel, `扫描到 ${ann.length} 处 data-bep-component 标注`);
    if (!ann.length) c.note = '产物未使用 data-bep-component 标注，无法核验组件引用（SKILL.md Step 7C 要求标注）';
    out.push(finish(ctx, c));
  }

  // ---- R3-02 status 诚实性 ----
  {
    const c = begin(ctx, 'R3-02');
    const withStatus = ann.filter((a) => a.status && a.name);
    c.checkedCount = withStatus.length;
    for (const a of withStatus) {
      const { hit } = resolve(ctx, a.name);
      if (!hit) continue;
      const real = hit.status;
      if (a.status === 'REMOTE_INSTANCE' && real !== 'REMOTE_INSTANCE' && real !== 'REMOTE_COMPONENT' && real !== 'COMPONENT_SET') {
        issue(c, ctx, {
          description: `标注不诚实：${a.name} 标为 REMOTE_INSTANCE，但 registry 实际 status=${real}`,
          line: a.line, selector: a.selector, detail: `声明 ${a.status} / 实际 ${real}`,
          suggestion: `把 data-bep-status 改成 ${real}，并按 SKILL.md Step 7C 加注释说明是手工搭建`,
          severity: 'P0'
        });
      } else if (a.status !== real && a.status !== 'AI_PROPOSED' && real === 'REMOTE_INSTANCE' && !/变形|拉高|改造/.test(a.name)) {
        issue(c, ctx, {
          description: `标注偏保守：${a.name} 是真实组件（${real}），却标注为 ${a.status}`,
          line: a.line, selector: a.selector, detail: `声明 ${a.status} / 实际 ${real}`,
          suggestion: '确认是否确实做了魔改；若直接复用真实实例应标 REMOTE_INSTANCE',
          severity: 'P2'
        });
      }
    }
    ev(c, 'component-registry.json', '逐条比对 component.status 与 data-bep-status');
    if (!withStatus.length) c.note = '产物未同时提供 data-bep-component 与 data-bep-status，无法核验标注诚实性';
    out.push(finish(ctx, c));
  }

  // ---- R3-03 NOT_FOUND 不得冒充真实组件 ----
  {
    const c = begin(ctx, 'R3-03');
    c.checkedCount = ann.length;
    for (const a of ann) {
      if (!a.name) continue;
      const { isMissing, hit } = resolve(ctx, a.name);
      const claimedReal = /REMOTE_INSTANCE|REMOTE_COMPONENT|COMPONENT_SET/.test(a.status);
      if ((isMissing || hit?.status === 'NOT_FOUND') && claimedReal) issue(c, ctx, {
        description: `把缺口组件「${a.name}」标成真实组件（${a.status}），违反「禁止相似组件魔改」`,
        line: a.line, selector: a.selector, detail: a.status,
        suggestion: '改成 SPEC_ONLY / AI_PROPOSED / NOT_FOUND 并写明 fallback 来源',
        severity: 'P0'
      });
    }
    ev(c, 'missing-components.json', `${ctx.evidence.missingComponents.items.length} 条 NOT_FOUND 缺口`);
    if (!ann.length) c.note = '产物无组件标注，实际未检查';
    out.push(finish(ctx, c));
  }

  // ---- R3-04 变形使用标注 ----
  {
    const c = begin(ctx, 'R3-04');
    const deformed = ann.filter((a) => /变形使用|变形|改造|拉高/.test(a.name));
    c.checkedCount = ann.length; // 实检对象数 = 全部组件标注
    c.metrics = { annotations: ann.length, deformed: deformed.length };
    for (const a of deformed) {
      if (!/SPEC_ONLY|AI_PROPOSED|NOT_FOUND/.test(a.status)) issue(c, ctx, {
        description: `「${a.name}」属于变形使用，但 data-bep-status=${a.status || '空'}，未诚实标注`,
        line: a.line, selector: a.selector, detail: a.name,
        suggestion: '变形使用必须同时写「X(变形使用)」+ 非真实组件 status，例如 Input(变形使用) / SPEC_ONLY',
        severity: 'P1'
      });
    }
    ev(c, 'SKILL.md Step 7C', '硬性红线：Input 拉高不得写成 Textarea');
    if (!deformed.length) c.note = '本次产物未出现变形使用，规则未检查到对象';
    out.push(finish(ctx, c));
  }

  // ---- R3-05 Figma Scripter 代码校验 ----
  {
    const c = begin(ctx, 'R3-05');
    if (ctx.art.type === 'scripter-js') {
      const f = ctx.art.jsFeatures;
      c.checkedCount = 1 + f.imports.length + 1;
      ev(c, ctx.fileLabel, `mkF ${f.mkFCalls} 处 / mkFT ${f.mkFTCalls} 处 / tint ${f.tintCalls} 处 / import ${f.imports.length} 处`);

      // 历史空白事故：mkF 第三参传 tint() 返回的 fills 数组
      const badMkF = /\bmkF\s*\([^,]+,[^,]+,[^,]*\btint\s*\(/g;
      const hits = [...ctx.art.raw.matchAll(badMkF)];
      if (hits.length) issue(c, ctx, {
        description: `检测到 ${hits.length} 处 mkF 第三参直接传 tint() 数组，会在真实 Figma 运行时抛错导致整页空白`,
        line: ctx.art.lineOf(hits[0].index), selector: 'mkF(...)',
        detail: '必须改用 mkFT(name,w,h,fillsArr,...) 先建框再赋 fills',
        suggestion: '替换为 mkFT；该规则来自 2026-11 四页 Scripter 空白事故复盘',
        severity: 'P0'
      });

      // 语法检查
      try {
        execFileSync(process.execPath, ['--check', ctx.art.abs], { stdio: 'ignore' });
        ev(c, 'node --check', '语法通过');
      } catch (e) {
        issue(c, ctx, {
          description: 'Figma Scripter 脚本语法检查未通过',
          selector: 'node --check', detail: String(e.message).slice(0, 120),
          suggestion: '先修语法再交付', severity: 'P0'
        });
      }

      // 组件键合法性
      const keys = new Set(R.entries.map((x) => x.componentKey).filter(Boolean));
      for (const k of f.imports) {
        if (!keys.has(k)) issue(c, ctx, {
          description: `importComponentByKeyAsync 使用了未登记的 componentKey "${k}"`,
          selector: 'importComponentByKeyAsync', detail: k,
          suggestion: '源组件库已断开订阅，真实组件应通过克隆 Page 1 实例获得，不得凭 key 导入',
          severity: 'P0'
        });
      }
      ev(c, 'component-registry.json', `${keys.size} 个已登记 componentKey`);
    } else {
      c.checkedCount = 0;
      c.note = `产物类型 ${ctx.art.type}，本规则仅适用 Figma Scripter (.js)，实际未检查`;
    }
    out.push(finish(ctx, c));
  }

  return out;
}
