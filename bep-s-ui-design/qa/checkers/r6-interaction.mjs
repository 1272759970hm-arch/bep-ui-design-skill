/** R6 交互逻辑校验：死链 / 悬空目标 / 12 条契约 / 空态 / 禁止清单 / 热区 */
import { begin, ev, issue, finish, cap } from '../lib/checker.mjs';

const CONTRACT_BASES = [
  'data-screen', 'data-screen-go', 'data-back', 'data-sheet-open', 'data-sheet-close',
  'data-mask', 'data-toast', 'data-order', 'data-id', 'data-active', 'data-open', 'data-bep-status'
];
const INTERACTION_ATTRS = new Set([
  'data-screen-go', 'data-back', 'data-sheet-open', 'data-sheet-close',
  'data-mask', 'data-toast', 'onclick', 'href'
]);
/** 纯业务主键：只带这些不算已声明交互反馈 */
const KEY_ATTRS = new Set(['data-id', 'data-order', 'data-cat', 'data-type', 'data-src', 'data-value']);

export function run(ctx) {
  const out = [];
  const art = ctx.art;
  const D = ctx.browser?.ok ? ctx.browser.data : null;
  const isHtml = art.type === 'html';
  // 产物形态判定：只有带 data-* 契约层的可点击原型才适用 P0 级交互硬性规则。
  // 静态视觉稿 / 多机展示板 / 纯 JS 演示页没有契约层，不能判「死链」，须标条件不足。
  const hasContracts = /data-screen=|data-screen-go|data-sheet-open|data-sheet-close|data-mask=|data-toast=|data-back/.test(art.raw || '');
  const hasDelegation = /addEventListener\(\s*['"]click/.test(art.raw || '');
  const mode = hasContracts ? 'prototype' : hasDelegation ? 'demo' : 'static';
  const modeNote = mode === 'prototype'
    ? '可点击原型（含 data-* 契约层）'
    : mode === 'demo' ? 'JS 演示页（有事件代理但无 data-* 契约层）' : '静态视觉稿 / 多机展示板（无交互契约层）';

  // ---- R6-01 死链 ----
  {
    const c = begin(ctx, 'R6-01');
    if (D && Array.isArray(D.pointers)) {
      const pointers = D.pointers.filter((p) => !p.inherited);
      c.checkedCount = pointers.length;
      ev(c, 'headless Chrome DOM', `实测 ${D.pointers.length} 个 cursor:pointer 元素，排除继承父级 pointer 后剩 ${pointers.length} 个独立可点元素`);
      ev(c, 'html-prototype.md §5 / C-84', '任何 cursor:pointer 元素都必须有交互反馈');
      for (const p of pointers) {
        const names = Object.keys(p.attrs || {});
        const hasData = names.some((n) => n.startsWith('data-'));
        const hasContract = names.some((n) => INTERACTION_ATTRS.has(n)
          || (n.startsWith('data-') && !KEY_ATTRS.has(n) && !n.startsWith('data-bep')));
        const label = `${p.tag}${p.id ? '#' + p.id : ''}${p.cls ? '.' + String(p.cls).split(/\s+/)[0] : ''} · ${cap(p.text, 24)}`;
        if (!hasData && !hasContract) issue(c, ctx, {
          description: mode === 'prototype'
            ? `死链：${label} 可点击但没有任何 data-* 契约、onclick 或 href`
            : `[${modeNote}] ${label} 带 cursor:pointer 但无交互契约；若作为可点击原型交付须补契约`,
          selector: label, detail: JSON.stringify(p.rect),
          suggestion: mode === 'prototype'
            ? '补 data-screen-go / data-sheet-open / data-toast 等契约；功能未实现时用 data-toast="文案"，别留死链'
            : '当前为静态稿，cursor:pointer 仅作视觉示意；如需校验交互，请提供带 data-* 契约层的可点击原型',
          severity: mode === 'prototype' ? 'P0' : 'P2'
        });
        else if (!hasContract) issue(c, ctx, {
          description: `交互反馈未声明：${label} 只有业务主键类 data-*，未绑定交互契约`,
          selector: label, detail: names.filter((n) => n.startsWith('data-')).join(','),
          suggestion: '确认事件代理确实覆盖该元素；建议显式补 data-toast 或 data-screen-go 便于验收',
          severity: 'P2'
        });
      }
    } else {
      c.checkedCount = 0;
      c.note = ctx.browser?.reason || '无浏览器运行态数据，无法实测可点击元素';
    }
    out.push(finish(ctx, c));
  }

  // ---- R6-02 data-screen-go 悬空 ----
  {
    const c = begin(ctx, 'R6-02');
    if (D && Array.isArray(D.screenGo)) {
      c.checkedCount = D.screenGo.length;
      const screens = new Set([...(D.screens || []), ...(D.sheets || [])]);
      ev(c, 'headless Chrome DOM', `实测 ${D.screenGo.length} 个跳转目标 / ${screens.size} 个屏幕定义`);
      ev(c, 'html-prototype.md §4', '一屏一 section data-screen，hash 当路由');
      for (const g of D.screenGo) {
        if (!screens.has(g.target)) issue(c, ctx, {
          description: `悬空跳转：data-screen-go="${g.target}" 找不到对应 data-screen`,
          selector: `${g.el.tag}.${String(g.el.cls).split(/\s+/)[0]}`, detail: g.target,
          suggestion: '补出目标屏，或修正跳转 id。禁止为了让校验通过而删除跳转（会改变业务逻辑）',
          severity: 'P0'
        });
      }
    } else {
      c.checkedCount = 0;
      c.note = '无浏览器运行态数据，或产物没有 data-screen-go';
    }
    out.push(finish(ctx, c));
  }

  // ---- R6-03 弹层 / 遮罩目标 ----
  {
    const c = begin(ctx, 'R6-03');
    if (D) {
      const opens = D.sheetOpen || [], masks = D.masks || [], closes = D.sheetClose || [];
      c.checkedCount = opens.length + masks.length + closes.length;
      const sheets = new Set(D.sheets || []);
      ev(c, 'headless Chrome DOM', `实测 ${opens.length} 个打开触发器 / ${masks.length} 个遮罩 / ${closes.length} 个关闭触发器 / ${sheets.size} 个 sheet`);
      ev(c, 'html-prototype.md §11', '弹层三种关法：关闭按钮 / 点遮罩 / 浏览器后退');
      for (const o of [...opens, ...masks, ...closes]) {
        if (o.target && !sheets.has(o.target)) issue(c, ctx, {
          description: `弹层目标悬空：${o.target} 找不到对应 data-sheet`,
          selector: `${o.el.tag}.${String(o.el.cls).split(/\s+/)[0]}`, detail: o.target,
          suggestion: '补 data-sheet 定义或修正 id；不要删除触发器来消除问题',
          severity: 'P1'
        });
      }
      if (opens.length && !closes.length && !masks.length) issue(c, ctx, {
        description: '存在弹层打开触发器，但没有任何关闭触发器或遮罩，弹层关不掉',
        selector: 'sheet', detail: `opens=${opens.length}`,
        suggestion: '补齐 data-sheet-close + data-mask，并接上浏览器后退',
        severity: 'P1'
      });
    } else {
      c.checkedCount = 0;
      c.note = '无浏览器运行态数据';
    }
    out.push(finish(ctx, c));
  }

  // ---- R6-04 12 条交互契约 ----
  {
    const c = begin(ctx, 'R6-04');
    if (!isHtml) {
      c.checkedCount = 0;
      c.note = `产物类型 ${art.type}，HTML 交互契约不适用`;
    } else if (mode !== 'prototype') {
      c.checkedCount = 0;
      c.note = `${modeNote}：无 data-* 契约层，12 条交互契约不适用，实际未检查（不得标 PASS）`;
    } else {
      const screens = D?.screens || [];
      const multi = screens.length >= 2 || /data-screen-go|data-sheet-open/.test(art.raw);
      c.checkedCount = CONTRACT_BASES.length;
      ev(c, 'html-prototype.md §5', `契约清单：${CONTRACT_BASES.join(' / ')}`);
      ev(c, ctx.fileLabel, `产物屏幕数 ${screens.length}，${multi ? '按多屏原型验收' : '按单屏视觉稿处理'}`);
      c.metrics = { multiScreen: multi, screens: screens.length };
      for (const b of CONTRACT_BASES) {
        const present = new RegExp(`\\b${b.replace(/[-]/g, '\\-')}(?:=|\\s|>|/)`, 'i').test(art.raw);
        if (!present && multi) issue(c, ctx, {
          description: `交互契约缺失：${b} 未在多屏原型中出现`,
          selector: 'DOM', detail: b,
          suggestion: '逐条实现 html-prototype.md §5 的 12 条契约，事件代理统一走 document click',
          severity: 'P1'
        });
      }
      if (!multi) c.note = '产物为单屏视觉稿，12 条多屏契约不适用；已逐条扫描但仅记录不判定失败';
    }
    out.push(finish(ctx, c));
  }

  // ---- R6-05 列表页空态 ----
  {
    const c = begin(ctx, 'R6-05');
    if (isHtml && mode !== 'prototype') {
      c.checkedCount = 0;
      c.note = `${modeNote}：空态可达性依赖交互契约层 / 状态切换，静态稿无法实测，条件不足`;
    } else if (isHtml) {
      const screens = D?.screens || [];
      const listScreens = screens.filter((s) => /list|列表|工单|订单|记录|巡检|搜索/i.test(s));
      const hasListMarkup = /data-order|data-id|\.list\b|list-item|工单列表/.test(art.raw);
      if (listScreens.length || hasListMarkup) {
        c.checkedCount = 1;
        ev(c, 'html-prototype.md §6/§11', '列表页必须有可达空态');
        ev(c, 'headless Chrome DOM', `检测到 ${D?.emptyStates?.length || 0} 个空态元素 / 列表屏 ${listScreens.join(',') || '（未命名）'}`);
        const hasEmpty = (D?.emptyStates?.length || 0) > 0 || /data-empty|empty-state|空状态|暂无|无数据/.test(art.raw);
        if (!hasEmpty) issue(c, ctx, {
          description: '列表页没有空态实现',
          selector: 'list', detail: `列表屏 ${listScreens.join(',')}`,
          suggestion: '按 component-library.md §6.17 选 8 场景插画之一，透明底 + base64 内嵌',
          severity: 'P1'
        });
      } else {
        c.checkedCount = 0;
        c.note = '产物中未检测到列表页，空态规则未检查到对象';
      }
    } else {
      c.checkedCount = 0;
      c.note = `产物类型 ${art.type}，不适用`;
    }
    out.push(finish(ctx, c));
  }

  // ---- R6-06 禁止清单 ----
  {
    const c = begin(ctx, 'R6-06');
    if (isHtml) {
      const patterns = [
        ['<script[^>]+src\\s*=\\s*["\']https?://', '外部脚本（CDN）'],
        ['<link[^>]+href\\s*=\\s*["\']https?://', '外部样式 / 外链字体'],
        ['@import\\s+url\\(', 'CSS @import 外链'],
        ['\\b(?:unpkg|jsdelivr|cdnjs|cdn\\.)', 'CDN 域名'],
        ['\\balert\\s*\\(', 'alert() 弹窗'],
        ['\\bconfirm\\s*\\(', 'confirm() 弹窗'],
        ['\\b(?:React|Vue|createApp|ReactDOM)\\b', '前端框架 / 构建产物'],
        ['<img[^>]+src\\s*=\\s*["\']https?://', '外部图片']
      ];
      c.checkedCount = patterns.length;
      ev(c, 'html-prototype.md §8', '禁止 CDN / 外链字体 / 外链图片 / React-Vue / alert() / confirm()');
      ev(c, 'constraints.md', 'C-80 单文件交付，CSS/JS 内联，零外部依赖');
      for (const [re, label] of patterns) {
        const m = art.raw.match(new RegExp(re, 'i'));
        if (m) issue(c, ctx, {
          description: `命中禁止清单：${label}`,
          line: art.lineOf(m.index), selector: label,
          detail: cap(m[0], 80),
          suggestion: '改为内联实现；断网 file:// 下必须可用',
          severity: 'P0'
        });
      }
    } else {
      c.checkedCount = 0;
      c.note = `产物类型 ${art.type}，HTML 禁止清单不适用`;
    }
    out.push(finish(ctx, c));
  }

  // ---- R6-07 触摸热区（EXTERNAL_STANDARD，仅提示） ----
  {
    const c = begin(ctx, 'R6-07');
    if (D && Array.isArray(D.pointers)) {
      const pointers = D.pointers.filter((p) => !p.inherited);
      c.checkedCount = pointers.length;
      const min = ctx.config.thresholds.touchTargetMinPx;
      const small = pointers.filter((p) => !p.touchOk);
      ev(c, 'interaction-adaptive-tokens.json', `touchTarget.minSize.appleHIG 44×44pt / materialDesign 48×48dp（EXTERNAL_STANDARD，非 BEP-S 正式规范）`);
      ev(c, 'headless Chrome DOM', `实测 ${pointers.length} 个独立可点元素，${small.length} 个小于 ${min}px`);
      c.metrics = { smallCount: small.length };
      for (const p of small.slice(0, 8)) issue(c, ctx, {
        description: `触摸热区偏小：${p.tag}.${String(p.cls).split(/\s+/)[0]} 实测 ${p.rect.w}×${p.rect.h}px < ${min}px（外部标准提示，不是 BEP-S 硬性规则）`,
        selector: `${p.tag}.${String(p.cls).split(/\s+/)[0]}`, detail: JSON.stringify(p.rect),
        suggestion: '如需遵循 Apple HIG / Material Design 3，可扩大 padding 或点击区域；不得因此改动 BEP-S 视觉 Token',
        severity: 'ADVISORY'
      });
    } else {
      c.checkedCount = 0;
      c.note = ctx.browser?.reason || '无浏览器运行态数据';
    }
    out.push(finish(ctx, c));
  }

  return out;
}
