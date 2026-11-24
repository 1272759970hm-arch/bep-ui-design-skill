/** R1 需求还原校验：PRD 功能点覆盖率、范围边界、需求卡完整性、落点核对 */
import { begin, ev, issue, finish, collectScreens, cap } from '../lib/checker.mjs';

const CARD_KEYS = [
  ['goal', '业务目标'], ['roles', '角色权限'], ['screens', '屏幕清单'],
  ['flow', '主流程'], ['blocks', '每屏内容块'], ['fields', '数据字段'],
  ['states', '状态与边界'], ['outOfScope', '不在本期']
];

export function run(ctx) {
  const out = [];
  const prd = ctx.prd;
  const reqs = Array.isArray(prd?.requirements) ? prd.requirements : [];
  const screens = collectScreens(ctx);

  // ---- R1-01 PRD 功能点覆盖率 ----
  {
    const c = begin(ctx, 'R1-01');
    if (prd && reqs.length) {
      c.checkedCount = reqs.length;
      ev(c, '--prd', `${prd.source || 'PRD'} 声明 ${reqs.length} 个功能点`);
      ev(c, ctx.fileLabel, `产物屏幕集合：${[...screens].join(', ') || '（未声明）'}`);
      let covered = 0;
      for (const r of reqs) {
        const target = r.screen || r.targetScreen || '';
        const ok = !target || screens.has(target) || (r.landing && String(r.landing).trim().length > 0);
        if (ok) covered++;
        else issue(c, ctx, {
          description: `需求遗漏：功能点「${cap(r.text || r.id, 60)}」声明的落点屏「${target}」不在产物屏幕清单中`,
          selector: `PRD ${r.id || ''}`,
          detail: `要求落点 ${target}`,
          suggestion: `补回该屏 / 该模块，或在需求卡中明确标注「本期不做 + 谁确认的」（${c.rule.specSource}）`,
          severity: 'P0'
        });
      }
      c.metrics = { total: reqs.length, covered, coverage: covered / reqs.length, screens: [...screens] };
      if (covered === reqs.length) c.note = `PRD 功能点 ${covered}/${reqs.length} 全部有落点`;
    } else {
      c.checkedCount = 0;
      c.note = '未提供 --prd 需求卡，无法核对功能点覆盖率';
    }
    out.push(finish(ctx, c));
  }

  // ---- R1-02 不得擅自增加 ----
  {
    const c = begin(ctx, 'R1-02');
    if (prd && Array.isArray(prd.screens) && prd.screens.length) {
      c.checkedCount = prd.screens.length;
      ev(c, '--prd', `PRD 屏幕清单 ${prd.screens.length} 屏：${prd.screens.join(', ')}`);
      const declared = new Set(prd.screens);
      const extra = [...screens].filter((s) => !declared.has(s));
      for (const s of extra) issue(c, ctx, {
        description: `擅自增加屏幕：产物中出现「${s}」，但不在 PRD 屏幕清单里`,
        selector: `data-screen="${s}"`,
        suggestion: '确认是否属于需求范围；属于则说明依据，不属于则移除，AI 没有新增业务能力的权力',
        severity: 'P1'
      });
      const missing = prd.screens.filter((s) => !screens.has(s));
      for (const s of missing) issue(c, ctx, {
        description: `需求遗漏屏幕：PRD 声明「${s}」，产物中没有对应屏`,
        selector: `PRD screens`,
        suggestion: `补出「${s}」屏，或在需求卡写明「本期不做 + 确认人」`,
        severity: 'P0'
      });
      c.metrics = { declared: prd.screens.length, produced: screens.size, extra, missing };
    } else {
      c.checkedCount = 0;
      c.note = 'PRD 未提供屏幕清单，无法判定是否擅自增加';
    }
    out.push(finish(ctx, c));
  }

  // ---- R1-03 需求卡八项 ----
  {
    const c = begin(ctx, 'R1-03');
    if (prd) {
      c.checkedCount = CARD_KEYS.length;
      ev(c, '--prd', `核对需求卡八项：${CARD_KEYS.map((x) => x[1]).join('/')}`);
      const card = prd.requirementCard || prd;
      for (const [key, label] of CARD_KEYS) {
        const v = card[key];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) {
          issue(c, ctx, {
            description: `需求卡缺项：「${label}」未填写，且未标 ASSUMPTION`,
            selector: `requirementCard.${key}`,
            suggestion: `补填或显式标注 ASSUMPTION（${c.rule.specSource}）`,
            severity: 'P2'
          });
        }
      }
    } else {
      c.checkedCount = 0;
      c.note = '未提供 --prd';
    }
    out.push(finish(ctx, c));
  }

  // ---- R1-04 每条功能点有落点 ----
  {
    const c = begin(ctx, 'R1-04');
    if (prd && reqs.length) {
      c.checkedCount = reqs.length;
      ev(c, '--prd', `逐条核对 ${reqs.length} 个功能点的「屏 + 模块」落点`);
      for (const r of reqs) {
        if (!r.screen || !r.module) issue(c, ctx, {
          description: `功能点「${cap(r.text || r.id, 50)}」缺少明确落点（屏或模块为空）`,
          selector: `PRD ${r.id || ''}`,
          suggestion: '按 PRD 覆盖率核对表补齐「落点（屏 + 模块）」与「处理」两列',
          severity: 'P1'
        });
      }
    } else {
      c.checkedCount = 0;
      c.note = '未提供 --prd';
    }
    out.push(finish(ctx, c));
  }

  return out;
}
