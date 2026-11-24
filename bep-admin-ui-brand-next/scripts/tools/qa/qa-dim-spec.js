#!/usr/bin/env node
// D2 设计规范校验 · 颜色/字号/圆角/间距/字体族 Token 合规
// 唯一依据：references/design-tokens.md（动态解析）+ scripts/bep-components.js BEP_C
// 只校验页面源码中"页面自己写死"的样式值；组件库内部实现不重复校验。

var core = require('./qa-core');
var STATUS = core.STATUS, SEVERITY = core.SEVERITY, finding = core.finding;

function check(ctx) {
  var findings = [];
  var src = ctx.src;           // 页面源码（原始，含注释用于定位）
  var clean = ctx.clean;       // 去注释源码
  var file = ctx.pageRel;
  var tokens = ctx.basis.tokens;

  if (!tokens || Object.keys(tokens.colorHex).length === 0) {
    findings.push(finding({
      dimension: 'D2', code: 'D2-BASIS-000', status: STATUS.BLOCKED, severity: SEVERITY.BLOCKER,
      problem: '无法从 references/design-tokens.md 解析颜色 Token，设计规范校验的依据不足',
      spec: 'references/design-tokens.md',
      suggestion: '确认 design-tokens.md 存在且颜色章节格式正确后重试'
    }));
    return findings;
  }

  // ── D2-1 硬编码 hex 颜色：页面自己写死的颜色必须来自 Token ──────────────
  // 允许：BEP_C.xxx、bepHex('...')、B/W、bepSolid(BEP_C.x) 等 Token 引用形式
  // 禁止：页面脚本里直接写 '#RRGGBB' 或 'RRGGBB' 字面量作为颜色
  // 只在"颜色上下文"中匹配 hex：bepHex('...')、fills/stroke/color/background 赋值等。
  // 禁止用裸 6 位 hex 字面量匹配——示例数据（如库存 '999999'、编号）会被误判为颜色。
  var hexRe = /(?:bepHex\s*\(\s*['"]#?|\b(?:fills|stroke|color|background|fill)\b[^\n]{0,40}?['"]#?)([0-9A-Fa-f]{6})['"]/g;
  var m;
  var seen = {};
  while ((m = hexRe.exec(clean))) {
    var hex = m[1].toUpperCase();
    var tokenName = tokens.colorHex['#' + hex];
    // 若该 hex 恰好等于某个规范 Token 值，仍视为"硬编码未走 Token"→ WARNING
    // 若不在 Token 中 → FAIL（非规范值）
    var line = core.lineOf(clean, m.index);
    var key = line + ':' + hex;
    if (seen[key]) continue;
    seen[key] = true;
    if (!tokenName) {
      findings.push(finding({
        dimension: 'D2', code: 'D2-TOKEN-COLOR-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: '页面使用非规范颜色值 #' + hex + '，该值不在 design-tokens.md 定义中',
        location: core.loc(file, line, m[0].trim()),
        spec: 'references/design-tokens.md §颜色',
        suggestion: '改用 BEP_C 语义色（如 BEP_C.primary）或 bepHex Token；若确需新增颜色，先补 design-tokens.md 与 BEP_C',
        fixable: false
      }));
    } else {
      findings.push(finding({
        dimension: 'D2', code: 'D2-TOKEN-COLOR-002', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '颜色 #' + hex + ' 是规范值（' + tokenName + '）但被硬编码，未通过 Token 引用',
        location: core.loc(file, line, m[0].trim()),
        spec: 'references/design-tokens.md §颜色',
        suggestion: '改为 BEP_C.' + tokenName + ' 或对应语义 Token，避免设计变更时遗漏',
        fixable: true
      }));
    }
  }

  // ── D2-2 字号合规：页面 fontSize: N 必须属于规范字号集合 ────────────────
  var fsRe = /\bfontSize\s*:\s*(\d+)/g;
  while ((m = fsRe.exec(clean))) {
    var size = parseInt(m[1], 10);
    if (tokens.fontSizes.indexOf(size) === -1) {
      findings.push(finding({
        dimension: 'D2', code: 'D2-TOKEN-FONT-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '字号 ' + size + 'px 不在规范字号集合 [' + tokens.fontSizes.join(', ') + '] 中',
        location: core.loc(file, core.lineOf(clean, m.index), m[0].trim()),
        spec: 'references/design-tokens.md §字体',
        suggestion: '改用规范字号 ' + tokens.fontSizes.join('/') + 'px；如为组件库内部值请在组件库层使用',
        fixable: false
      }));
    }
  }

  // ── D2-3 字体族合规：必须是 PingFang SC，禁止 TC ─────────────────────────
  var famRe = /family\s*:\s*['"]([^'"]+)['"]/g;
  while ((m = famRe.exec(clean))) {
    var fam = m[1];
    if (/PingFang\s*TC/i.test(fam)) {
      findings.push(finding({
        dimension: 'D2', code: 'D2-TOKEN-FAMILY-001', status: STATUS.FAIL, severity: SEVERITY.BLOCKER,
        problem: '字体族使用了 ' + fam + '，BeP 规范强制要求 PingFang SC（简体）',
        location: core.loc(file, core.lineOf(clean, m.index), m[0].trim()),
        spec: 'references/design-tokens.md §字体',
        suggestion: '改为 family:\'PingFang SC\'',
        fixable: true
      }));
    } else if (fam !== 'PingFang SC' && !ctx.isComponentLib) {
      findings.push(finding({
        dimension: 'D2', code: 'D2-TOKEN-FAMILY-002', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '字体族 ' + fam + ' 不在规范字体族清单中',
        location: core.loc(file, core.lineOf(clean, m.index), m[0].trim()),
        spec: 'references/design-tokens.md §字体',
        suggestion: '统一使用 PingFang SC'
      }));
    }
  }

  // ── D2-4 圆角合规：页面 r: N 必须属于规范圆角集合 ────────────────────────
  var rRe = /\br\s*:\s*(\d+)/g;
  while ((m = rRe.exec(clean))) {
    var r = parseInt(m[1], 10);
    if (tokens.radii.indexOf(r) === -1) {
      findings.push(finding({
        dimension: 'D2', code: 'D2-TOKEN-RADIUS-001', status: STATUS.WARNING, severity: SEVERITY.SUGGESTION,
        problem: '圆角 r=' + r + ' 不在规范圆角集合 [' + tokens.radii.join(', ') + '] 中',
        location: core.loc(file, core.lineOf(clean, m.index), m[0].trim()),
        spec: 'references/design-tokens.md §圆角',
        suggestion: '页面级 Card r=4，按钮 r=4，Input/Tag/Modal/Drawer r=2，头像 r=12',
        fixable: false
      }));
    }
  }

  // ── D2-5 布局常量合规：页面声明的 CANVAS_W/SIDE_W 等必须与 Token 一致 ────
  Object.keys(tokens.layouts).forEach(function(name) {
    var re = new RegExp('\\b' + name + '\\s*=\\s*(\\d+)');
    var mm = re.exec(clean);
    if (mm) {
      var val = parseInt(mm[1], 10);
      if (val !== tokens.layouts[name]) {
        // CANVAS_W / CANVAS_H 是画布尺寸：组件变体展示页（variants）常用自定义画板，
        // 且 design-tokens.md 明确"实际按屏幕和布局计算"，故降为 WARNING；
        // SIDE_W/HDR_H/OUTER_PAD/CARD_PAD/TABLE_W/ROW_H 是结构常量，不一致仍为 FAIL。
        var isCanvas = (name === 'CANVAS_W' || name === 'CANVAS_H');
        var isVariantShowcase = /variants|变体|组件展示/.test(ctx.modName + ctx.pageBase + ctx.src.slice(0, 300));
        var soft = isCanvas || isVariantShowcase;
        findings.push(finding({
          dimension: 'D2', code: soft ? 'D2-TOKEN-LAYOUT-002' : 'D2-TOKEN-LAYOUT-001',
          status: soft ? STATUS.WARNING : STATUS.FAIL, severity: soft ? SEVERITY.SUGGESTION : SEVERITY.BLOCKER,
          problem: '布局常量 ' + name + '=' + val + ' 与规范值 ' + tokens.layouts[name] + ' 不一致' + (isVariantShowcase ? '（组件展示页，允许自定义画布）' : ''),
          location: core.loc(file, core.lineOf(clean, mm.index), mm[0].trim()),
          spec: 'references/design-tokens.md §间距 / references/page-layouts.md',
          suggestion: soft
            ? ('完整业务页应为 ' + name + ' = ' + tokens.layouts[name] + '；组件展示页可自定义，确认场景即可')
            : ('改为 ' + name + ' = ' + tokens.layouts[name] + '；如需适配特殊屏幕按 page-layouts.md 计算，不得直接改常量'),
          fixable: false
        }));
      }
    }
  });

  // 实际执行了检查（即使无违规）→ 记录一条 PASS 汇总，避免空 findings 被误判为 NOT CHECKED
  if (!findings.length) {
    findings.push(finding({
      dimension: 'D2', code: 'D2-SUMMARY', status: STATUS.PASS, severity: SEVERITY.INFO,
      problem: '颜色/字号/字体族/圆角/布局常量均符合 design-tokens.md（依据已加载并实际比对）',
      spec: 'references/design-tokens.md'
    }));
  }
  return findings;
}

module.exports = { check: check };
