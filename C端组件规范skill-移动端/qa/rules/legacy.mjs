// Design QA · Legacy 黑名单（唯一依据：CHANGELOG.md「已作废 / 已替换」条目）
// 每条都标注来源章节；新增规范变更时只需在本文件追加，不需要改 checker。

export const LEGACY = [
  // ── 2026.11.09 图标体系 ──
  { id: 'L-ICON-001', pattern: /lucide:[a-z0-9-]+/g, applies: ['html', 'js'],
    desc: '使用了已禁用的 lucide 图标（直线尖角风，与组件库 Solar 圆润风不匹配）',
    spec: 'CHANGELOG 2026.11.09「图标体系全量切换 Solar」/ SKILL.md Hard Rules 图标节 / registry §6',
    severity: 'MAJOR', fixable: true, fix: 'solar', fixNote: '按 registry §6 lucide→Solar 对照表替换（部分需人工确认图标语义）' },

  // ── 2026.11.06 加购圆钮 ──
  { id: 'L-ADD-001', pattern: /class="[^"]*\baddbtn\b[^"]*"[^>]*>\s*[^<\s][^<]*<\/span>/g, applies: ['html'],
    desc: '加购按钮内含文字（应为纯图标 + 圆钮）',
    spec: 'registry §4.9 / CHANGELOG 2026.11.06 第三轮', severity: 'BLOCKER', fixable: false },
  { id: 'L-ADD-002', pattern: /stroke-linecap\s*=\s*"round"[^>]*>[^<]*<path\s+d="M12 5v14M5 12h14"/g, applies: ['html'],
    desc: '加号使用 stroke-linecap 线性笔画（圆头出 viewBox 被裁平），应为 rect+rx 全圆角胶囊臂',
    spec: 'registry §4.9 笔画 / CHANGELOG 2026.11.06 第三次指正', severity: 'MAJOR', fixable: false },
  { id: 'L-ADD-003', pattern: /width="32"\s+height="32"[^>]*border-radius:16px|border-radius:16px[^}]{0,80}width:\s*32px/g, applies: ['html'],
    desc: '加购圆钮为 32×32（第一版错误尺寸，定稿 18×18）',
    spec: 'registry §4.9 / CHANGELOG 2026.11.06', severity: 'MAJOR', fixable: false },
  { id: 'L-ADD-004', pattern: /\.addbtn\s*\{[^}]*border\s*:\s*[^;]*solid/g, applies: ['html'],
    desc: '加购按钮使用描边 pill（已作废形态）',
    spec: 'registry §4.0 场景映射 / CHANGELOG 2026.11.06', severity: 'BLOCKER', fixable: false },

  // ── 2026.11.06 到手价 / 标签 ──
  // 到手价前缀的结构化检查在 04-component-use.mjs 中按商品卡结构判断（秒杀卡走小步阶，不误伤）
  // 只匹配「rgba 颜色函数第 4 位」为旧 alpha 的写法。
  // 早期裸正则 /0\.09|0\.45/ 会命中 SVG path 坐标与 opacity=".45"，且全局替换会破坏 SVG —— 已废弃。
  { id: 'L-TAG-001',
    pattern: /rgba\(([^)]*,\s*)(0?\.?(?:09|45))\s*\)/g, applies: ['html', 'js'],
    desc: '标签 tinted 款使用旧 9% 底 / 45% 描边透明度（定稿 8% / 24%）',
    spec: 'registry §2 四种款式（8% 底 + 同色 24% 描边）/ CHANGELOG 2026.11.05 标签四款定稿',
    severity: 'MAJOR', fixable: true,
    fixNote: '把 rgba 第 4 位 .09→.08 / .45→.24（仅颜色函数内；不影响 SVG 坐标与 opacity 属性）',
    // 精确修复回调：保证不误伤 SVG path 里的 0.45 与 opacity=".45"
    fixer: (m, prefix, alpha) => {
      const lead = alpha.startsWith('0.') ? '0.' : alpha.startsWith('.') ? '.' : '';
      return `rgba(${prefix}${lead}${/09$/.test(alpha) ? '08' : '24'})`;
    } },
  { id: 'L-TAG-002', pattern: /mkTag\([^)]*,\s*(?:true|false)\s*,/g, applies: ['js'],
    desc: 'mkTag 旧 4 参调用（helper 兼容保留，但模板代码须用语义语法）',
    spec: 'CHANGELOG 2026.11.05 第五轮 / SKILL.md 标签速查', severity: 'MAJOR', fixable: false },
  { id: 'L-TAG-003', pattern: /class="[^"]*\bbadge\b/g, applies: ['html'],
    desc: '图上角标（商品标签应挂品名首行前，不压图）',
    spec: 'registry §2 应用规范 / CHANGELOG 2026.11.05', severity: 'MAJOR', fixable: false },

  // ── 2026.11.05 配色 N 系列 ──
  ...[
    ['#666666', '#646566'], ['#CCCCCC', '#C8C9CC'], ['#F5F5F5', '#F7F8FA'],
    ['#333333', '#262626'], ['#999999', '#969799'], ['#F8F8F8', '#F2F3F5'],
    ['#EEEEEE', '#EBEDF0'],
  ].map(([old, next], i) => ({
    id: 'L-COLOR-' + String(i + 1).padStart(3, '0'),
    pattern: new RegExp(old.replace('#', '#'), 'gi'), applies: ['html', 'js'],
    desc: `使用了已作废旧色值 ${old}（定稿 ${next}）`,
    spec: 'references/tokens.md 旧值替换记录 / CHANGELOG 2026.11.05 第四轮、2026.11.04 终稿对齐',
    // #333333 在 registry §2「双段胶囊（预估佣金）」是实测特例，不能一刀切自动替换 → 降级 WARNING + 人工确认
    severity: old === '#333333' ? 'MINOR' : 'MAJOR',
    fixable: old !== '#333333', fixMap: old === '#333333' ? undefined : [[old, next]],
    conflictNote: old === '#333333' ? '规范冲突：tokens.md 标记为旧一级文字，但 registry §2 双段胶囊左段实测为 #333333，需人工裁决上下文' : '',
  })),

  // ── 2026.11.04 其它 ──
  { id: 'L-TECH-001', pattern: /demo-product-detail/g, applies: ['js'],
    desc: '引用已删除的旧演示脚本', spec: 'CHANGELOG 2026.11.04', severity: 'BLOCKER', fixable: false },
  { id: 'L-TECH-002', pattern: /\bpg\b\s*(?:\.|;|\))/g, applies: ['js'],
    desc: 'preamble 结尾引用未定义变量 pg（运行时 ReferenceError）', spec: 'CHANGELOG 2026.11.04 修正', severity: 'BLOCKER', fixable: false },
  { id: 'L-TECH-003', pattern: /height:\s*50px[^}]{0,120}tabbar|tabbar[^}]{0,120}height:\s*50px/g, applies: ['html'],
    desc: '底部标签栏高度 50（定稿 84 = 50 + 34 安全区）', spec: 'registry §5 / tokens.md iPhone safe-area', severity: 'MAJOR', fixable: false },
];

export const ICON_FIX_MAP = {
  'lucide:chevron-left': 'solar:alt-arrow-left-outline',
  'lucide:chevron-right': 'solar:alt-arrow-right-outline',
  'lucide:chevron-down': 'solar:alt-arrow-down-outline',
  'lucide:share-2': 'solar:share-outline',
  'lucide:shopping-cart': 'solar:cart-outline',
  'lucide:headphones': 'solar:headphones-round-sound-outline',
  'lucide:star': 'solar:star-outline',
  'lucide:more-horizontal': 'solar:menu-dots-outline',
  'lucide:x': 'solar:close-circle-outline',
  'lucide:search': 'solar:magnifier-outline',
  'lucide:scan-line': 'solar:scanner-outline',
  'lucide:minus': 'solar:minus-outline',
  'lucide:plus': 'solar:add-outline',
};
