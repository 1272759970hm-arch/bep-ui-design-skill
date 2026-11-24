/** R5 视觉还原校验：真实渲染 / 溢出 / Figma 截图比对 / 原型边界 / 基准尺寸 / 组件比例 */
import { begin, ev, issue, finish } from '../lib/checker.mjs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

function pyCompare(ctx, a, b) {
  const helper = path.join(ctx.qaRoot, 'lib', 'img_probe.py');
  return JSON.parse(execFileSync(ctx.config.python, [helper, 'compare', a, b], { encoding: 'utf8' }));
}
function pyBlank(ctx, a) {
  const helper = path.join(ctx.qaRoot, 'lib', 'img_probe.py');
  return JSON.parse(execFileSync(ctx.config.python, [helper, 'blank', a], { encoding: 'utf8' }));
}

export function run(ctx) {
  const out = [];
  const art = ctx.art;
  const B = ctx.browser;
  const D = B?.ok ? B.data : null;

  // ---- R5-01 真实渲染非空 ----
  {
    const c = begin(ctx, 'R5-01');
    if (B?.ok && B.screenshot) {
      c.checkedCount = 1;
      const r = pyBlank(ctx, B.screenshot);
      ev(c, 'headless Chrome', `渲染截图 ${r.size?.join('×') || ''} / 颜色数 ${r.uniqueColors ?? 'N/A'}`);
      ev(c, 'html-prototype.md', '§1 双击即开，file:// 断网可用');
      c.metrics = { uniqueColors: r.uniqueColors, size: r.size };
      if (r.blank) issue(c, ctx, {
        description: `渲染结果为空白/纯色（颜色数 ${r.uniqueColors}），页面可能整体没画出来`,
        selector: 'screenshot', detail: JSON.stringify(r),
        suggestion: '检查脚本运行时异常（历史 Scripter 空白事故：mkF 传 fills 数组）、CSS 显隐、容器高度',
        severity: 'P0'
      });
    } else {
      c.checkedCount = 0;
      c.note = B?.ok ? 'Chrome 已运行但未生成截图，无法实测渲染结果' : (B?.reason || '浏览器不可用');
    }
    out.push(finish(ctx, c));
  }

  // ---- R5-02 水平溢出 ----
  {
    const c = begin(ctx, 'R5-02');
    if (D && Array.isArray(D.overflow)) {
      // 多机展示板（board）本来就是横向排布，html/body 溢出不是手机内的溢出；
      // 只校验单台设备 / 单屏容器是否横向滚动。
      const deviceContainers = D.overflow.filter((o) => !/^(html|body)\b|board/i.test(o.selector));
      c.checkedCount = deviceContainers.length + 1;
      ev(c, 'headless Chrome DOM', `实测 ${D.overflow.length} 个容器，其中单屏/设备容器 ${deviceContainers.length} 个；已排除展示板级横向排布`);
      for (const o of deviceContainers) {
        if (o.scrollWidth > o.clientWidth + 2) issue(c, ctx, {
          description: `水平溢出：${o.selector} scrollWidth=${o.scrollWidth} > clientWidth=${o.clientWidth}`,
          selector: o.selector, detail: `${o.scrollWidth} / ${o.clientWidth}`,
          suggestion: '检查多屏横排容器宽度、胶囊 nowrap、卡片负 margin；375 基准内不得出现横向滚动',
          severity: 'P1'
        });
      }
    } else {
      c.checkedCount = 0;
      c.note = B?.reason || '无浏览器运行态数据';
    }
    out.push(finish(ctx, c));
  }

  // ---- R5-03 Figma 参考图比对 ----
  {
    const c = begin(ctx, 'R5-03');
    if (ctx.reference && ctx.referenceKind === 'figma' && B?.screenshot) {
      c.checkedCount = 1;
      const r = pyCompare(ctx, B.screenshot, ctx.reference);
      ev(c, '--reference', path.basename(ctx.reference));
      ev(c, 'headless Chrome', `产物截图与参考图逐像素比对（阈值 ${r.thresholdPx}px）`);
      c.metrics = { diffRatio: r.diffRatio, topRegions: r.topRegions, size: r.size };
      if (r.error) issue(c, ctx, {
        description: `截图比对失败：${r.error}`, selector: 'compare',
        suggestion: '确认参考图为 PNG 且尺寸可读', severity: 'P1'
      });
      else if (r.diffRatio > ctx.config.thresholds.visualDiffWarn) issue(c, ctx, {
        description: `视觉偏差过大：差异率 ${(r.diffRatio * 100).toFixed(2)}%（阈值 ${(ctx.config.thresholds.visualDiffWarn * 100).toFixed(0)}%），主要差异区域 ${JSON.stringify(r.topRegions)}`,
        selector: 'screenshot diff', detail: JSON.stringify(r.topRegions),
        suggestion: '按差异网格逐块核对布局 / 尺寸 / 间距 / 对齐 / 组件比例；只改视觉，不得照搬产品原型的模块堆叠',
        severity: 'P1'
      });
      else if (r.diffRatio > ctx.config.thresholds.visualDiffPass) issue(c, ctx, {
        description: `视觉存在偏差：差异率 ${(r.diffRatio * 100).toFixed(2)}%，主要区域 ${JSON.stringify(r.topRegions)}`,
        selector: 'screenshot diff', detail: JSON.stringify(r.topRegions),
        suggestion: '逐块核对差异区域，确认是否属于可接受的设计自主判断',
        severity: 'P2'
      });
    } else {
      c.checkedCount = 0;
      c.note = ctx.reference && ctx.referenceKind !== 'figma'
        ? `参考图类型为 ${ctx.referenceKind}，不是 Figma 设计稿，禁止作为视觉比对基准`
        : '未提供 Figma 参考图（--reference ... --reference-kind figma），截图比对条件不足';
    }
    out.push(finish(ctx, c));
  }

  // ---- R5-04 产品原型只作需求依据 ----
  {
    const c = begin(ctx, 'R5-04');
    c.checkedCount = 1;
    ev(c, 'prd-to-prototype.md / SKILL.md 核心原则', '原型不是最终设计，只代表业务需求和功能集合');
    ev(c, 'constraints.md', 'C-95 不得照抄 PRD 附带原型的信息架构与模块堆叠');
    if (ctx.referenceKind === 'prd-prototype') issue(c, ctx, {
      description: '把产品原型 / 修改版 H5 原型当作视觉比对基准，违反「原型只作为需求依据」边界',
      selector: '--reference-kind=prd-prototype',
      detail: ctx.reference || '',
      suggestion: '该输入只能进 R1 需求还原校验；视觉必须严格按 Figma 设计稿，另用 --reference-kind figma 提供真实设计稿',
      severity: 'P0'
    });
    out.push(finish(ctx, c));
  }

  // ---- R5-05 375×812 基准 ----
  {
    const c = begin(ctx, 'R5-05');
    if (art.type === 'html') {
      c.checkedCount = 1;
      const hay = art.raw;
      const w375 = /\b375px\b|--w\s*:\s*375|width\s*:\s*375/.test(hay);
      const h812 = /\b812px\b|--h\s*:\s*812|height\s*:\s*812/.test(hay);
      c.metrics = { width375: w375, height812: h812 };
      ev(c, 'mobile-ui-rules.md', 'BEP-S 单一固定设计基准 375×812px（FOUND_IN_FIGMA）');
      ev(c, ctx.fileLabel, `扫描产物是否声明 375 / 812 基准：${w375}/${h812}`);
      if (!w375) issue(c, ctx, {
        description: '产物未声明 375px 设计基准宽度', selector: ':root / .phone',
        suggestion: '按 mobile-ui-rules.md 固定 375px 基准；多屏横排时每台手机壳保持 375',
        severity: 'P2'
      });
      if (!h812) issue(c, ctx, {
        description: '产物未声明 812px 视口高度', selector: ':root / .phone',
        suggestion: '视觉稿按 812 视口；可滚动内容用 estimatedHeight 表达，不要改基准高度',
        severity: 'P2'
      });
    } else {
      c.checkedCount = 0;
      c.note = `产物类型 ${art.type}，无 CSS 基准可查`;
    }
    out.push(finish(ctx, c));
  }

  // ---- R5-06 组件比例命中 registry ----
  {
    const c = begin(ctx, 'R5-06');
    const expected = { '--nav-h': 44, '--status-h': 44, '--tabbar-h': 50, '--cell-h': 60, '--input-h': 60, '--btn-h': 48, '--tag-h': 22, '--safe-b': 34 };
    let checked = 0;
    if (art.type === 'html') {
      for (const [k, want] of Object.entries(expected)) {
        const v = art.rootVars.get(k);
        if (!v) continue;
        checked++;
        const got = parseFloat(v);
        if (got !== want) issue(c, ctx, {
          description: `结构尺寸变量 ${k} = ${v}，registry 实值为 ${want}`,
          line: art.rootVarLines.get(k), selector: ':root', detail: k,
          suggestion: '按 component-registry.json dimensions / design-tokens.json componentSize 校正',
          severity: 'ADVISORY'
        });
      }
    }
    c.checkedCount = checked;
    ev(c, 'component-registry.json / design-tokens.json', `核对 ${Object.keys(expected).length} 个结构尺寸变量（44/44/50/60/60/48/22/34）`);
    if (!checked) c.note = '产物未声明以上结构尺寸变量，未检查到对象';
    out.push(finish(ctx, c));
  }

  return out;
}
