// Design QA · 规则注册表（模块化扩展点）
// 新增维度：在 rules/ 下新增 NN-xxx.mjs 导出 { meta, check }，然后在 RULES 中登记即可。

import * as r01 from './01-requirements.mjs';
import * as r02 from './02-tokens.mjs';
import * as r03 from './03-component-ref.mjs';
import * as r04 from './04-component-use.mjs';
import * as r05 from './05-visual.mjs';
import * as r06 from './06-interaction.mjs';

export const RULES = [r01, r02, r03, r04, r05, r06];

export const DIMENSIONS = RULES.map(r => r.meta);

/** 依据缺失检查：返回某规则应直接 BLOCKED 的原因 */
export function missingEvidence(ctx, rule) {
  const miss = (rule.meta.requires || []).filter(k => !ctx.files[k] || !ctx.files[k].ok);
  return miss.length ? miss : null;
}
