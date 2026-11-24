/** R4 组件使用校验：标签 tint 档位 / 已知冲突 / 缺省资产外链与透明底 / 重复造轮子 */
import { canonColor } from '../lib/evidence.mjs';
import { begin, ev, issue, finish, cap } from '../lib/checker.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function alphaOf(v) {
  const s = String(v).trim();
  if (s.startsWith('#') && s.length === 9) return parseInt(s.slice(7, 9), 16) / 255;
  const m = s.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
  if (m) return Number(m[1]);
  const p = s.match(/^#([0-9a-f]{6})$/i);
  return p ? 1 : null;
}

export function run(ctx) {
  const out = [];
  const art = ctx.art;
  const T = ctx.evidence.tokens;
  const isHtml = art.type === 'html';

  // ---- R4-01 标签 tint 三档 ----
  {
    const c = begin(ctx, 'R4-01');
    let checked = 0;
    if (isHtml) {
      const tagVars = [...art.rootVars.entries()].filter(([k]) => /^--tag-.*-bg$/.test(k));
      for (const [k, v] of tagVars) {
        checked++;
        const a = alphaOf(v);
        if (a !== null && Math.abs(a - 0.10) > 0.005) issue(c, ctx, {
          description: `语义标签底色 ${k} = ${v} 透明度 ${a}，应为 10%（2026-11-05 实测更正，原记 16%）`,
          line: art.rootVarLines.get(k), selector: ':root', detail: k,
          suggestion: '改为 10% 浅底 + 同色相实色文字；14% 只用于页面筛选胶囊，16% 只用于二级胶囊 Tab',
          severity: 'P1', evidenceValue: { varName: k, value: v, targetAlpha: 0.10 }
        });
      }
      // --brand-tint16 不得用于标签
      for (const b of art.cssBlocks) {
        if (!/tag|badge|角标/i.test(b.selector)) continue;
        for (const d of b.decls) {
          checked++;
          if (/tint16|0\.16|16%/.test(d.value + ' ' + d.prop)) issue(c, ctx, {
            description: `标签样式 ${b.selector} 使用了 16% tint，违反 C-04（16% 只给二级胶囊 Tab）`,
            line: d.line, selector: b.selector, detail: `${d.prop}:${d.value}`,
            suggestion: '标签统一 10%；筛选胶囊 14%', severity: 'P1'
          });
          const hard = String(d.value).match(/rgba?\([^)]*\)/g) || [];
          for (const col of hard) {
            const a = alphaOf(col);
            if (a !== null && Math.abs(a - 0.10) > 0.005 && Math.abs(a - 0.14) > 0.005 && /tag|badge/i.test(b.selector))
              issue(c, ctx, {
                description: `标签浅底硬编码 ${col}，透明度 ${a} 不符合 10% 档位`,
                line: d.line, selector: b.selector, detail: d.value,
                suggestion: '改用 --tag-*-bg 变量（10%）', severity: 'P1'
              });
          }
        }
      }
    }
    c.checkedCount = checked;
    ev(c, 'design-tokens.json', `tint10=${T.brandTint10} / tint14=${T.brandTint14} / tint16=${T.brandTint16}（tint16 注明不用于标签）`);
    ev(c, 'constraints.md', 'C-04 语义标签浅底一律 10%');
    if (!isHtml) c.note = `产物类型 ${art.type} 无 CSS，标签档位规则未执行`;
    out.push(finish(ctx, c));
  }

  // ---- R4-02 已知规范冲突需人工裁决 ----
  {
    const c = begin(ctx, 'R4-02');
    const conflicts = ctx.evidence.conflicts;
    c.checkedCount = conflicts.length;
    const raw = String(ctx.art.raw || '').toLowerCase();
    const alias = ['navbar', 'tabbar', 'card', 'tag', 'sheet', 'popup', 'popup', 'tab', 'input', 'cell', 'empty', '弹层', '标签', '卡片', '导航', '空状态'];
    let relevant = 0;
    for (const cf of conflicts) {
      const name = String(cf.component || '').toLowerCase();
      const words = name.split(/[\s/（）()·_\-—]+/).filter((t) => t.length >= 2);
      const hit = words.some((w) => raw.includes(w)) || alias.some((a) => raw.includes(a) && name.includes(a));
      if (!hit) continue;
      relevant++;
      issue(c, ctx, {
        description: `已知规范冲突待裁决：${cf.component || ''} · ${cf.field || ''}`,
        selector: 'design-system-conflicts.json',
        detail: `文档 ${String(cf.globalValue || '').slice(0, 90)} / 组件 ${String(cf.componentValue || '').slice(0, 90)} / 裁决 ${String(cf.decision || '').slice(0, 90)}`,
        suggestion: `按冲突优先级 ${ctx.evidence.data.conflicts?.conflictPriorityOrder?.[0] || 'REAL_COMPONENT_CURRENT_IMPLEMENTATION'} 采用，并在本次报告里引用该记录；不得静默统一`,
        severity: 'ADVISORY'
      });
    }
    ev(c, 'design-system-conflicts.json', `${conflicts.length} 条已登记冲突，其中 ${relevant} 条与本次产物相关；优先级 ${(ctx.evidence.data.conflicts?.conflictPriorityOrder || []).join(' > ')}`);
    ev(c, 'constraints.md', '§0 冲突裁决优先级 P(-1)…P5');
    c.metrics = { totalConflicts: conflicts.length, relevantConflicts: relevant };
    out.push(finish(ctx, c));
  }

  // ---- R4-03 缺省插画禁止外链 ----
  {
    const c = begin(ctx, 'R4-03');
    const imgs = isHtml ? art.imgs : [];
    c.checkedCount = imgs.length;
    for (const im of imgs) {
      const src = im.src || '';
      // JS 模板表达式（如 '+v.img+' / ${...}）不是实际资源路径，跳过并留证据
      if (/\+\s*[a-zA-Z_$]|\$\{|`/.test(src)) {
        ev(c, ctx.fileLabel, `第 ${im.line} 行 src 为 JS 模板表达式「${src.slice(0, 40)}」，非实际资源路径，不计入外链违规`);
        continue;
      }
      if (/^(https?:)?\/\//i.test(src)) issue(c, ctx, {
        description: `图片外链：${cap(src, 90)}，违反 C-98（Figma 链接带登录态会过期，第三方图床禁止）`,
        line: im.line, selector: 'img', detail: cap(src, 90),
        suggestion: '改用 assets/empty-states/ 本地透明底 PNG，base64 内嵌（可自动修复：按同名资产内联）',
        severity: 'P0', evidenceValue: { src, line: im.line }
      });
      else if (!/^data:image\//i.test(src) && src && !/^#/.test(src)) issue(c, ctx, {
        description: `图片使用了相对/外部路径 ${cap(src, 80)}，断网 file:// 下不可用`,
        line: im.line, selector: 'img', detail: src,
        suggestion: '改为 base64 内嵌或内联 SVG 占位 + data-placeholder="true"',
        severity: 'P1'
      });
    }
    ev(c, 'constraints.md', 'C-98 缺省插画禁止外链，必须 base64 内嵌');
    ev(c, 'assets/empty-states/', `${(ctx.evidence.emptyAssets?.files || []).filter((f) => f.endsWith('.png')).length} 张本地透明底 PNG 可用`);
    if (!imgs.length) c.note = '产物中没有 <img>，未检查到插画资产';
    out.push(finish(ctx, c));
  }

  // ---- R4-04 缺省插画透明底 ----
  {
    const c = begin(ctx, 'R4-04');
    let checked = 0;
    const imgs = isHtml ? art.imgs.filter((im) => /^data:image\/(png|webp);base64,/i.test(im.src || '')) : [];
    if (imgs.length) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bep-qa-img-'));
      const files = [];
      for (let i = 0; i < imgs.length; i++) {
        const b64 = imgs[i].src.replace(/^data:image\/\w+;base64,/i, '');
        if (Buffer.byteLength(b64, 'base64') > ctx.config.thresholds.emptyAssetBase64MaxKB * 1024) continue;
        const p = path.join(dir, `img${i}.png`);
        fs.writeFileSync(p, Buffer.from(b64, 'base64'));
        files.push(p);
      }
      checked = files.length;
      if (files.length) {
        const helper = path.join(ctx.qaRoot, 'lib', 'img_probe.py');
        let res = [];
        try {
          res = JSON.parse(execFileSync(ctx.config.python, [helper, 'alpha', ...files], { encoding: 'utf8' }));
        } catch (e) { ev(c, 'img_probe.py', `执行失败：${String(e.message).slice(0, 100)}`); }
        for (let i = 0; i < res.length; i++) {
          const r = res[i];
          if (r.error) continue;
          if (!r.transparent) issue(c, ctx, {
            description: `缺省插画 ${r.file} 四角 alpha = [${r.cornerAlpha.join(',')}]，带不透明白底；贴在 #F7F8FA 页面底会出现白色方块`,
            line: imgs[i]?.line, selector: 'img(base64)', detail: `${r.size.join('×')} / 不透明占比 ${r.opaqueRatio}`,
            suggestion: '用 assets/empty-states/keyout.py 边缘 flood fill 抠白底后再内嵌；保留插画内部白色高光',
            severity: 'P0'
          });
        }
        ev(c, 'img_probe.py', `实测 ${files.length} 张内嵌 PNG 的四角 alpha`);
      }
    }
    c.checkedCount = checked;
    ev(c, 'constraints.md', 'C-97 缺省插画必须是透明底');
    if (!imgs.length) c.note = '产物中没有 base64 内嵌 PNG，未检查到透明底对象';
    out.push(finish(ctx, c));
  }

  // ---- R4-05 重复造轮子 ----
  {
    const c = begin(ctx, 'R4-05');
    let checked = 0;
    if (isHtml) {
      const candidates = ['tag', 'btn', 'button', 'cell', 'input', 'card', 'navbar', 'tabbar', 'sheet', 'empty'];
      const annNames = new Set(art.tags.map((t) => (t.attrs['data-bep-component'] || '').toLowerCase()));
      for (const name of candidates) {
        const blocks = art.cssBlocks.filter((b) => new RegExp(`\\.${name}\\b`, 'i').test(b.selector));
        if (!blocks.length) continue;
        const hard = blocks.some((b) => b.decls.some((d) => /#[0-9a-f]{3,8}|rgba?\(/i.test(d.value)));
        if (!hard) continue;
        checked++;
        const declared = [...annNames].some((n) => n.includes(name));
        if (!declared) issue(c, ctx, {
          description: `疑似重复造轮子：定义了自定义 .${name} 样式（含硬编码色值），但产物没有任何 data-bep-component 标注`,
          line: blocks[0].line, selector: blocks[0].selector,
          detail: `检查 ${candidates.length} 类标准组件样式`,
          suggestion: '优先复用 component-registry.json 中该组件的 visualRecipe；若确为手工搭建，补 data-bep-status + data-bep-component 诚实标注',
          severity: 'P2'
        });
      }
    }
    c.checkedCount = checked;
    ev(c, 'component-registry.json', `${ctx.evidence.registry.entries.filter((x) => x.visualRecipe).length} 个组件带 visualRecipe`);
    ev(c, 'SKILL.md', 'Component Reuse 是约束不是目标；禁止相似组件魔改');
    if (!isHtml) c.note = `产物类型 ${art.type}，未执行 CSS 层重复造轮子扫描`;
    out.push(finish(ctx, c));
  }

  // ---- R4-06 图标来源校验 ----
  {
    const c = begin(ctx, 'R4-06');
    const lib = ctx.evidence.data.iconLibrary;
    const libPaths = new Set();
    if (lib?.icons) {
      for (const [key, v] of Object.entries(lib.icons)) {
        for (const m of String(v.innerSVG || '').matchAll(/\bd\s*=\s*"([^"]+)"/g)) {
          libPaths.add(m[1].replace(/\s+/g, ' ').trim());
        }
        c.metricsSource = c.metricsSource || [];
        c.metricsSource.push(key);
      }
    }
    let checked = 0, declared = 0, matched = 0;
    if (art.type === 'html' && art.svgs?.length) {
      for (const s of art.svgs) {
        checked++;
        const src = s.attrs['data-icon-source'];
        if (src) {
          declared++;
          ev(c, ctx.fileLabel, `第 ${s.line} 行 SVG 已声明图标来源：${String(src).slice(0, 90)}`);
          continue;
        }
        const ok = s.paths.some((p) => libPaths.has(p.d));
        if (ok) { matched++; continue; }
        issue(c, ctx, {
          description: `SVG 图标 path 未命中 icon-library.json（${s.paths.length} 条 path 均不匹配），疑似手绘近似图标`,
          line: s.line, selector: 'svg',
          detail: String(s.paths[0]?.d || '').slice(0, 80),
          suggestion: libPaths.size
            ? '改用 icon-library.json 里的原始 innerSVG（禁止转述/回忆/近似画）；库内没有的图标先确认缺口再声明 data-icon-source'
            : 'icon-library.json 未加载成功，无法核对图标来源',
          severity: 'ADVISORY'
        });
      }
    }
    c.checkedCount = checked;
    c.metrics = { svgCount: checked, libraryMatched: matched, declaredSource: declared, libraryPathCount: libPaths.size };
    ev(c, 'icon-library.json', `${libPaths.size} 条官方原始 path（IconPark outline，stroke-width 6 为唯一偏离官方的参数）`);
    ev(c, 'icon-library.json rule', '每条都是从开源库官方源文件直接拉取的原始 SVG path，不是转述/回忆/近似画的');
    ev(c, 'SKILL.md', 'icon-library：禁止再用 AI 手绘近似图形冒充');
    if (checked) ev(c, ctx.fileLabel, `产物含 ${checked} 个内联 SVG：${matched} 个命中图标库 / ${declared} 个已声明来源 / ${checked - matched - declared} 个未命中`);
    out.push(finish(ctx, c));
  }

  return out;
}
