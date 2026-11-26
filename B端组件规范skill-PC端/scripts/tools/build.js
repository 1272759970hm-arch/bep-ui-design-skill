#!/usr/bin/env node
// ── build.js ──────────────────────────────────────────────────────────────────
// 将 bep-components.js + 页面源脚本合并为单文件，粘贴到 Figma Scripter 直接运行
//
// 用法：
//   node tools/build.js <模块>/<页面>        # 例：hr/list
//   node tools/build.js hr/list             # .js 后缀可省略
//   node tools/build.js --list              # 列出所有可构建的页面
//
// 源文件：pages/<模块>/<页面>.js
// 输出  ：pages/<模块>/dist/<页面>.js
// ─────────────────────────────────────────────────────────────────────────────

var fs   = require('fs');
var path = require('path');

var ROOT        = path.resolve(__dirname, '../..');   // bep-admin-ui-brand/
var SCRIPTS_DIR = path.resolve(ROOT, 'scripts');
var PAGES_DIR   = path.resolve(ROOT, 'pages');
var COMPONENTS  = path.join(SCRIPTS_DIR, 'bep-components.js');

// ── --list：列出所有可构建页面 ─────────────────────────────────────────────────
if (process.argv[2] === '--list') {
  console.log('\n可构建页面（pages/ 目录）：');
  var modules = fs.readdirSync(PAGES_DIR).filter(function(f) {
    return fs.statSync(path.join(PAGES_DIR, f)).isDirectory() && f !== 'archive';
  });
  modules.forEach(function(mod) {
    var modPath = path.join(PAGES_DIR, mod);
    fs.readdirSync(modPath)
      .filter(function(f) { return f.endsWith('.js'); })
      .forEach(function(f) {
        console.log('  ' + mod + '/' + f.replace('.js', ''));
      });
  });
  console.log('');
  process.exit(0);
}

// ── 参数检查 ──────────────────────────────────────────────────────────────────
var arg = process.argv[2];
if (!arg) {
  console.error('用法：node tools/build.js <模块>/<页面>');
  console.error('      node tools/build.js --list  （查看所有页面）');
  process.exit(1);
}

var parts    = arg.replace('.js', '').split('/');
if (parts.length !== 2) {
  console.error('❌ 格式错误，请使用 <模块>/<页面>，例：hr/list');
  process.exit(1);
}

var modName  = parts[0];
var pageName = parts[1] + '.js';
var pagePath = path.join(PAGES_DIR, modName, pageName);

if (!fs.existsSync(pagePath)) {
  console.error('❌ 找不到源文件：' + pagePath);
  process.exit(1);
}
if (!fs.existsSync(COMPONENTS)) {
  console.error('❌ 找不到组件库：' + COMPONENTS);
  process.exit(1);
}

// ── 合并 ─────────────────────────────────────────────────────────────────────
var componentsCode = fs.readFileSync(COMPONENTS, 'utf8');
var pageCode       = fs.readFileSync(pagePath,   'utf8');
componentsCode = slimBepIcons(componentsCode, pageCode);

function collectIconKeys(code) {
  var keys = new Set();
  var direct = /bepIcon\(\s*['"]([^'"]+)['"]/g;
  var match;
  while ((match = direct.exec(code))) keys.add(match[1]);

  var optionIcon = /\b(?:iconKey|iconSvg|icon)\s*:\s*['"]([^'"]+)['"]/g;
  while ((match = optionIcon.exec(code))) keys.add(match[1]);

  // 标准组件可能通过参数接收图标 key，例如：
  // bepSidebarItem(label, level, state, 'Line/box')。
  // 页面也常先把 key 放入数据数组再传给组件，因此扫描所有 BeP 图标 key 字符串。
  var literalIconKey = /['"]((?:Fill|Line)\/[^'"]+)['"]/g;
  while ((match = literalIconKey.exec(code))) keys.add(match[1]);

  return keys;
}

function slimBepIcons(componentsCode, pageCode) {
  var iconBlockMatch = componentsCode.match(/var BEP_ICONS = \{[\s\S]*?\n\};\n\n\/\/ ── § 2/);
  if (!iconBlockMatch) return componentsCode;

  var iconBlock = iconBlockMatch[0];
  var iconMap = {};
  var entry = /\n\s*'([^']+)':\s*'([^']*)',?/g;
  var match;
  while ((match = entry.exec(iconBlock))) iconMap[match[1]] = match[2];

  var required = collectIconKeys(componentsCode + '\n' + pageCode);
  [
    'Fill/Abnormal',
    'Fill/Arrow-Open',
    'Fill/Fail',
    'Fill/MenuOpen',
    'Fill/Success',
    'Fill/Tips',
    'Fill/play',
    'Line/Close',
    'Line/Date',
    'Line/DropDown-Arrow',
    'Line/Left-Arrow',
    'Line/Loading',
    'Line/More',
    'Line/Paperclip',
    'Line/PutAway-Arrow',
    'Line/Right-Arrow',
    'Line/Switch',
    'Line/bell',
    'Line/camera',
    'Line/check',
    'Line/chevron-down',
    'Line/chevron-left',
    'Line/chevron-right',
    'Line/chevron-up',
    'Line/download',
    'Line/search',
    'Line/upload-cloud',
  ].forEach(function(key) { required.add(key); });

  var missing = [];
  var lines = ['var BEP_ICONS = {'];
  Array.from(required).sort().forEach(function(key) {
    if (!iconMap[key]) {
      missing.push(key);
      return;
    }
    lines.push("  '" + key + "': '" + iconMap[key] + "',");
  });
  lines.push('};');

  if (missing.length) {
    console.warn('⚠️  BEP_ICONS 缺少以下图标，将由 bepIcon 降级占位：' + missing.join(', '));
  }

  return componentsCode.replace(
    /var BEP_ICONS = \{[\s\S]*?\n\};\n\n\/\/ ── § 2/,
    lines.join('\n') + '\n\n// ── § 2'
  );
}

var now    = new Date().toISOString().slice(0, 16).replace('T', ' ');
var banner = [
  '// ════════════════════════════════════════════════════════════════════════',
  '// BeP Admin Kit · 合并构建产物 · ' + now,
  '// 源文件：bep-components.js + pages/' + modName + '/' + pageName,
  '// 直接粘贴到 Figma Scripter 运行，无需任何前置操作',
  '// ════════════════════════════════════════════════════════════════════════',
  '',
].join('\n');

var divider = [
  '',
  '// ════════════════════════════════════════════════════════════════════════',
  '// 页面脚本：pages/' + modName + '/' + pageName,
  '// ════════════════════════════════════════════════════════════════════════',
  '',
].join('\n');

var output = banner + componentsCode + divider + pageCode;

// ── 写出 ─────────────────────────────────────────────────────────────────────
var outDir = path.join(PAGES_DIR, modName, 'dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

var outPath = path.join(outDir, pageName);
fs.writeFileSync(outPath, output, 'utf8');

var kb = (output.length / 1024).toFixed(1);
console.log('✅ 构建完成：pages/' + modName + '/dist/' + pageName + '  (' + kb + ' KB)');
console.log('   → 将 pages/' + modName + '/dist/' + pageName + ' 全文粘贴到 Figma Scripter 运行');
