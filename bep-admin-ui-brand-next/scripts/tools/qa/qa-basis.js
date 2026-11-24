#!/usr/bin/env node
// Design QA 依据加载器
// 唯一校验依据来源：scripts/bep-components.js（组件/图标/颜色实现）
//                  references/design-tokens.md（颜色/字号/间距/圆角真源）
//                  references/components-*.md（公开组件 API 签名）
// 禁止在本文件硬编码任何"新的"标准值——只解析、不发明。

var fs = require('fs');
var path = require('path');
var core = require('./qa-core');

// 从 bep-components.js 解析"实际存在"的函数定义集合（含公开与内部）
function loadDefinedFunctions(componentsSrc) {
  var set = {};
  var re = /\bfunction\s+(bep[A-Za-z0-9_]*)\s*\(/g;
  var m;
  while ((m = re.exec(componentsSrc))) set[m[1]] = true;
  return set;
}

// 从组件文档解析"公开组件"清单（公开入口 = 允许页面脚本直接调用）
// 依据三类来源合并：① 文档"公开入口："行 ② 组件章节标题 ## bepXxx ③ SKILL.md 速查表
// 这三类都是"宣称公开"的权威来源，缺一会导致误报内部函数。
function loadPublicComponents() {
  var set = {};
  var files = ['components-core.md', 'components-layout.md'];
  files.forEach(function(f) {
    var src = core.read(path.join(core.REFERENCES_DIR, f));
    if (!src) return;
    // ① **公开入口：** `bepXxx(...)`（兼容星号加粗与可选反引号）
    var re = /公开入口[：:]?\s*\*{0,2}\s*`?\s*(bep[A-Za-z0-9_]*)\s*\(/g;
    var m;
    while ((m = re.exec(src))) set[m[1]] = true;
    // ② 章节标题 ## bepXxx — 中文名（每个组件文档的标准标题格式）
    var hRe = /^##\s+(bep[A-Za-z0-9_]*)\s+[—\-]/gm;
    while ((m = hRe.exec(src))) set[m[1]] = true;
  });
  // ③ SKILL.md 速查表：所有在速查表中出现的 bep*() 调用均为公开组件
  var skill = core.read(path.join(core.ROOT, 'SKILL.md'));
  if (skill) {
    var m2;
    var sRe = /\b(bep[A-Za-z0-9_]*)\s*\(/g;
    while ((m2 = sRe.exec(skill))) set[m2[1]] = true;
  }
  return set;
}

// 从 bep-components.js 解析 BEP_ICONS 的 key 集合
function loadIconKeys(componentsSrc) {
  var keys = {};
  var re = /^\s*'([^']+)'\s*:/gm;
  var m;
  while ((m = re.exec(componentsSrc))) keys[m[1]] = true;
  return keys;
}

// 从 BEP_C 定义块解析颜色实现值（hex），作为 design-tokens.md 的交叉验证
function loadComponentColors(componentsSrc) {
  var colors = {};
  var m = componentsSrc.match(/var\s+BEP_C\s*=\s*\{([\s\S]*?)\n\};/);
  if (!m) {
    // 兼容 const BEP_C = {...}
    m = componentsSrc.match(/BEP_C\s*=\s*\{([\s\S]*?)\n\};/);
  }
  if (!m) return colors;
  // bepHex 接受带 # 或不带 # 的 6 位 hex（实现中多为不带 #）
  var re = /([A-Za-z][A-Za-z0-9]*)\s*:\s*bepHex\s*\(\s*['"]#?([0-9A-Fa-f]{6})['"]\s*\)/g;
  var x;
  while ((x = re.exec(m[1]))) colors[x[1]] = '#' + x[2].toUpperCase();
  return colors;
}

// 从 design-tokens.md 解析 Token 真源
function loadDesignTokens() {
  var src = core.read(path.join(core.REFERENCES_DIR, 'design-tokens.md'));
  var tokens = { colors: {}, colorHex: {}, fontSizes: [], lineHeights: [], radii: [], layouts: {}, fontFamilies: [], source: 'references/design-tokens.md' };
  if (!src) return tokens;

  // 颜色：primary: '#006D9B' 形式（JS 代码块内）
  var colorRe = /^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*'?(#[0-9A-Fa-f]{6})'?(?:\s|\/)/gm;
  var m;
  while ((m = colorRe.exec(src))) {
    tokens.colors[m[1]] = m[2].toUpperCase();
    tokens.colorHex[m[2].toUpperCase()] = m[1];
  }

  // 透明度体系 Token（T85/T65/...）也纳入已知集合
  var tRe = /\b(T\d{2,3})\b/g;
  while ((m = tRe.exec(src))) tokens.colors[m[1]] = tokens.colors[m[1]] || 'opacity';

  // 字号/行高：匹配 "标题：16px / 24px" 等
  var fontBlock = src.match(/常用字号\/行高组合：([\s\S]*?)```/);
  if (fontBlock) {
    var fRe = /(\d+)px\s*\/\s*(\d+)px/g;
    while ((m = fRe.exec(fontBlock[1]))) {
      tokens.fontSizes.push(parseInt(m[1], 10));
      tokens.lineHeights.push(parseInt(m[2], 10));
    }
  }
  // 字体族
  var famRe = /字体族[：:]\s*([A-Za-z\s]+)/;
  if ((m = famRe.exec(src))) tokens.fontFamilies.push(m[1].trim());

  // 间距/布局常量：NAME = number
  var lRe = /^\s*(CANVAS_W|CANVAS_H|SIDE_W|HDR_H|OUTER_PAD|CARD_PAD|TABLE_W|ROW_H|LABEL_W|LABEL_GAP|FIELD_GAP|CTRL_H)\s*=\s*(\d+)/gm;
  while ((m = lRe.exec(src))) tokens.layouts[m[1]] = parseInt(m[2], 10);

  // 圆角：r = N 或 "r = N"
  var rRe = /r\s*=\s*(\d+)/g;
  while ((m = rRe.exec(src))) {
    if (tokens.radii.indexOf(parseInt(m[1], 10)) === -1) tokens.radii.push(parseInt(m[1], 10));
  }

  return tokens;
}

// 汇总加载全部依据；返回 { ok, errors, components, icons, colors, tokens }
function loadBasis() {
  var basis = { ok: true, errors: [], componentsSrc: null };
  var componentsSrc = core.read(core.COMPONENTS);
  if (!componentsSrc) {
    basis.ok = false;
    basis.errors.push('缺少组件库：scripts/bep-components.js，无法执行组件相关校验');
    basis.functions = {}; basis.icons = {}; basis.componentColors = {};
  } else {
    basis.componentsSrc = componentsSrc;
    basis.functions = loadDefinedFunctions(componentsSrc);
    basis.icons = loadIconKeys(componentsSrc);
    basis.componentColors = loadComponentColors(componentsSrc);
  }
  basis.publicComponents = loadPublicComponents();
  basis.tokens = loadDesignTokens();

  // 依据自洽性检查：design-tokens.md 颜色与 BEP_C 实现值必须一致
  basis.tokenMismatches = [];
  Object.keys(basis.componentColors).forEach(function(k) {
    var t = basis.tokens.colors[k];
    if (t && t !== 'opacity' && t !== basis.componentColors[k]) {
      basis.tokenMismatches.push({ token: k, doc: t, impl: basis.componentColors[k] });
    }
  });

  // 组件文档是否可读（影响"公开入口"判定的可信度）
  if (Object.keys(basis.publicComponents).length === 0) {
    basis.errors.push('未能从 references/components-*.md 解析出任何公开组件，组件引用校验的证据不足');
  }
  return basis;
}

module.exports = {
  loadBasis: loadBasis,
  loadDefinedFunctions: loadDefinedFunctions,
  loadPublicComponents: loadPublicComponents,
  loadIconKeys: loadIconKeys,
  loadDesignTokens: loadDesignTokens,
  loadComponentColors: loadComponentColors
};
