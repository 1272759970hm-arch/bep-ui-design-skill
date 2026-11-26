/** 六大维度检查器编排：新增维度只需在此注册 */
import * as R1 from './r1-requirement.mjs';
import * as R2 from './r2-design-token.mjs';
import * as R3 from './r3-component-ref.mjs';
import * as R4 from './r4-component-usage.mjs';
import * as R5 from './r5-visual.mjs';
import * as R6 from './r6-interaction.mjs';

const MODULES = [R1, R2, R3, R4, R5, R6];

export function runAllCheckers(ctx) {
  const checks = [];
  for (const mod of MODULES) {
    const res = mod.run(ctx);
    checks.push(...res);
  }
  // 保证目录里登记的每条规则都产出了结果，未实现的显式标 NOT CHECKED（绝不假装 PASS）
  for (const rule of ctx.catalog.rules) {
    if (!checks.some((c) => c.ruleId === rule.id)) {
      checks.push({
        ruleId: rule.id, dimension: rule.dimension, status: 'NOT CHECKED',
        checkedCount: 0, evidence: [], issues: [],
        note: `规则 ${rule.id} 已在目录登记但检查器尚未实现，实际未执行`
      });
    }
  }
  const order = new Map(ctx.catalog.rules.map((r, i) => [r.id, i]));
  checks.sort((a, b) => (order.get(a.ruleId) ?? 999) - (order.get(b.ruleId) ?? 999));
  return checks;
}
