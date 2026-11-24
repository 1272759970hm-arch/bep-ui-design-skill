#!/usr/bin/env node
// Static checks for BeP page scripts. Run after build.js:
//   node tools/validate-page.js <module>/<page>

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '../..');
var PAGES_DIR = path.join(ROOT, 'pages');
var COMPONENTS = path.join(ROOT, 'scripts', 'bep-components.js');

function failUsage() {
  console.error('用法：node tools/validate-page.js <模块>/<页面>');
  console.error('例：node tools/validate-page.js hr/list');
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function lineOf(src, index) {
  return src.slice(0, index).split(/\r?\n/).length;
}

function add(list, type, msg, line) {
  list.push({ type: type, msg: msg, line: line || null });
}

function stripRequiredMark(label) {
  return String(label || '').replace(/\*/g, '').trim();
}

function labelCharCount(label) {
  return Array.from(stripRequiredMark(label)).length;
}

var arg = process.argv[2];
if (!arg) failUsage();

var parts = arg.replace(/\.js$/, '').split('/');
if (parts.length !== 2 || !parts[0] || !parts[1]) failUsage();

var modName = parts[0];
var pageBase = parts[1];
var pagePath = path.join(PAGES_DIR, modName, pageBase + '.js');
var distPath = path.join(PAGES_DIR, modName, 'dist', pageBase + '.js');

var findings = [];

if (!fs.existsSync(pagePath)) {
  add(findings, 'error', '找不到页面源码：pages/' + modName + '/' + pageBase + '.js');
} else if (fs.statSync(pagePath).size === 0) {
  add(findings, 'error', '页面源码为空：pages/' + modName + '/' + pageBase + '.js');
}

if (!fs.existsSync(COMPONENTS)) {
  add(findings, 'error', '找不到组件库：scripts/bep-components.js');
}

if (findings.some(function(f) { return f.type === 'error'; })) {
  printAndExit(findings);
}

var src = read(pagePath);
var clean = stripComments(src);
var components = read(COMPONENTS);

var knownIconKeys = {};
var iconKeyRe = /^\s*'([^']+)'\s*:/gm;
var iconKeyMatch;
while ((iconKeyMatch = iconKeyRe.exec(components))) {
  knownIconKeys[iconKeyMatch[1]] = true;
}

function collectReferencedIconKeys(code) {
  var keys = {};
  var match;
  var direct = /\bbepIcon\s*\(\s*['"]([^'"]+)['"]/g;
  while ((match = direct.exec(code))) keys[match[1]] = true;

  var optionIcon = /\b(?:iconKey|iconSvg|icon)\s*:\s*['"]([^'"]+)['"]/g;
  while ((match = optionIcon.exec(code))) keys[match[1]] = true;

  // 覆盖标准组件参数和数据数组中的图标 key，如 bepSidebarItem(..., item[3])
  // 搭配 ['商品管理', 1, 'expanded', 'Line/box'] 这类数据驱动写法。
  var literalIconKey = /['"]((?:Fill|Line)\/[^'"]+)['"]/g;
  while ((match = literalIconKey.exec(code))) keys[match[1]] = true;

  return Object.keys(keys);
}

function collectDistIconKeys(code) {
  var keys = {};
  var match;
  var re = /^\s*'([^']+)'\s*:/gm;
  while ((match = re.exec(code))) keys[match[1]] = true;
  return keys;
}

var referencedIconKeys = collectReferencedIconKeys(clean);
referencedIconKeys.forEach(function(iconKey) {
  if (!knownIconKeys[iconKey]) {
    add(findings, 'error', '引用了 BeP 图标库不存在的图标：' + iconKey + '；请先提出缺口并补进 BEP_ICONS');
  }
});

if (!/\bvar\s+pageFrame\s*=|\blet\s+pageFrame\s*=|\bconst\s+pageFrame\s*=/.test(clean)) {
  add(findings, 'error', '必须声明 pageFrame 作为页面根容器');
}

var appendRe = /figma\.currentPage\.appendChild\s*\(\s*([^)]+?)\s*\)/g;
var appendMatch;
while ((appendMatch = appendRe.exec(clean))) {
  var target = appendMatch[1].trim();
  if (target !== 'pageFrame') {
    add(findings, 'error', '禁止直接向 currentPage 添加非 pageFrame 节点：' + target, lineOf(clean, appendMatch.index));
  }
}

if (!/figma\.currentPage\.appendChild\s*\(\s*pageFrame\s*\)/.test(clean)) {
  add(findings, 'error', '必须将 pageFrame 添加到 figma.currentPage');
}

if (/\bcard\.resize\s*\(/.test(clean) && /pageFrame\s*=\s*bepFrame\s*\([^)]*clip\s*:\s*true/.test(clean) && !/\bpageFrame\.resize\s*\(/.test(clean)) {
  add(findings, 'error', '动态内容页面必须在 card.resize 后用 pageFrame.resize 反推根容器高度，避免 pageFrame.clip=true 裁切底部内容');
}

var rawCreateRe = /figma\.create(?:Frame|Rectangle|Text|Line|Ellipse|NodeFromSvg)\s*\(/g;
var rawCreateMatch;
while ((rawCreateMatch = rawCreateRe.exec(clean))) {
  add(findings, 'error', '页面脚本禁止直接 figma.create* 绘制节点；请使用标准 bep* 组件或先补组件库', lineOf(clean, rawCreateMatch.index));
}

var injectIconsRe = /Object\.assign\s*\(\s*BEP_ICONS\s*,/g;
var injectIconsMatch;
while ((injectIconsMatch = injectIconsRe.exec(clean))) {
  add(findings, 'error', '页面脚本禁止注入 BEP_ICONS；缺图标必须先提出并补进 BeP 图标库', lineOf(clean, injectIconsMatch.index));
}

var localIconMapRe = /\b(?:var|let|const)\s+[A-Za-z0-9_]*(?:ICONS|Icons|icons)\s*=\s*{/g;
var localIconMapMatch;
while ((localIconMapMatch = localIconMapRe.exec(clean))) {
  add(findings, 'error', '页面脚本禁止定义本地图标 SVG 映射；必须使用 BeP 图标（bepIcon）', lineOf(clean, localIconMapMatch.index));
}

var inlineSvgRe = /['"`]\s*<svg\b/g;
var inlineSvgMatch;
while ((inlineSvgMatch = inlineSvgRe.exec(clean))) {
  add(findings, 'error', '页面脚本禁止写自定义 SVG 图标；缺图标必须先提出并补进 BeP 图标库', lineOf(clean, inlineSvgMatch.index));
}

var localReplacementRe = /function\s+((?:make|build)(?=[A-Z])[A-Za-z0-9_]*(?:Btn|Button|Sidebar|SidebarItem|Table|DashboardTable|TableHeader|TableCell|ActionCell|ComplexTreePicker|ComplexTree|TreeSelect|Tree|TreeNode|Tag|Modal|Drawer|Input|Textarea|TextArea|Select|Cascader|Cascade|Date|Time|Switch|Rate|Radio|Checkbox|Upload|Step|Steps|Pagination|Header|TitleBar|TabBar|Tabs|Card|ChartCard|ChartPanel|Chart|RankList|Ranking|Rank|Description|Desc|FormItem|Filter|Message|Toast|Alert|Icon|Ico)[A-Za-z0-9_]*)\s*\(/g;
var localReplacementMatch;
while ((localReplacementMatch = localReplacementRe.exec(clean))) {
  add(findings, 'error', '页面内疑似自造标准组件替身：' + localReplacementMatch[1] + '；已有标准组件必须直接调用，缺组件先补 bep-components.js', lineOf(clean, localReplacementMatch.index));
}

var sidebarReplacementRe = /function\s+((?:sidebarL3|addSideL[123]|makeSideL[123]|buildSideL[123]))\s*\(/g;
var sidebarReplacementMatch;
while ((sidebarReplacementMatch = sidebarReplacementRe.exec(clean))) {
  add(findings, 'error', '页面内禁止自造侧边栏菜单替身：' + sidebarReplacementMatch[1] + '；一级/二级/三级菜单统一使用 bepSidebarItem(label, level, state, iconKey)', lineOf(clean, sidebarReplacementMatch.index));
}

if (modName !== 'header' && /\bbepHeader\s*\(/.test(clean) && /\bbepTabs\s*\(/.test(clean)) {
  add(findings, 'error', '同一页面不得混用 TopBar + Breadcrumb（bepHeader）与 TopBar + PageTabs（bepTabs）两种系统打开机制；页头系统模式必须二选一');
}

if (modName !== 'header' && /\bbepTabs\s*\(/.test(clean) && !/TopBar\s*\+\s*PageTabs|PageTabs\s*模式|系统页签|页面页签/.test(clean)) {
  add(findings, 'warning', 'bepTabs 是系统级 PageTabs，仅用于 TopBar + PageTabs 打开机制；业务状态/业务视图切换应使用 bepHeaderTitle 内置 Tabs 或 bepCardTabs');
}

if (/详情|描述列表|字段详情|基础信息/.test(clean) && /\b(?:make|build|append)[A-Za-z0-9_]*(?:Desc|Description|Field|LabelValue|Attachment|LinkValue|MediaValue|TagValue)[A-Za-z0-9_]*\s*\(/.test(clean) && !/\bbepDescriptions\s*\(/.test(clean)) {
  add(findings, 'error', '详情页描述信息必须使用描述列表 bepDescriptions；不得页面内手写 label/value、链接、附件、标签或媒体 value 结构');
}

if (/\bbepDescriptions\s*\(/.test(clean) && /\b(?:make|build)[A-Za-z0-9_]*(?:DescTag|DescLink|DescAttachment|DescMedia|AttachmentRow|MediaThumb|LinkText)[A-Za-z0-9_]*\s*\(/.test(clean)) {
  add(findings, 'error', '描述列表 value 类型必须通过 value/tags/link/links/attachments/media 数据或 bepDesc* 标准子组件承载；不得页面内自造 value 子结构');
}

var descSubComponentCallRe = /\b(bepDescTags|bepDescLink|bepDescLinks|bepDescAttachments|bepDescMedia)\s*\(/g;
var descSubComponentCallMatch;
while ((descSubComponentCallMatch = descSubComponentCallRe.exec(clean))) {
  if (!/\bbepDescriptions\s*\(/.test(clean) && modName !== 'description-list') {
    add(findings, 'warning', descSubComponentCallMatch[1] + ' 是描述列表 value 子组件；业务页面优先通过 bepDescriptions 的 tags/link/links/attachments/media 数据字段使用', lineOf(clean, descSubComponentCallMatch.index));
  }
}

var literalBepIconRe = /\bbepIcon\s*\(\s*['"]([^'"]+)['"]/g;
var literalBepIconMatch;
while ((literalBepIconMatch = literalBepIconRe.exec(clean))) {
  var iconKey = literalBepIconMatch[1];
  if (!knownIconKeys[iconKey]) {
    add(findings, 'error', '引用了 BeP 图标库不存在的图标：' + iconKey + '；请先提出缺口并补进 BEP_ICONS', lineOf(clean, literalBepIconMatch.index));
  }
}

['bepHeaderTitleTabs'].forEach(function(name) {
  var re = new RegExp('\\b' + name + '\\s*\\(', 'g');
  var m;
  while ((m = re.exec(clean))) {
    add(findings, 'error', '禁止页面脚本直接调用组件库内部子组件：' + name + '；请调用对应公开组件入口', lineOf(clean, m.index));
  }
});

var buttonCallRe = /\bbepButton\s*\(([^)]*)\)/g;
var buttonCallMatch;
while ((buttonCallMatch = buttonCallRe.exec(clean))) {
  var args = buttonCallMatch[1];
  var line = lineOf(clean, buttonCallMatch.index);
  var labelMatch = args.match(/^\s*['"]([^'"]*)['"]/);
  if (labelMatch && /[\u4e00-\u9fa5]\s+[\u4e00-\u9fa5]/.test(labelMatch[1])) {
    add(findings, 'error', '按钮文案不得用空格撑宽度，请使用正常文案：' + labelMatch[1], line);
  }
  if (/iconOnly\s*:\s*true/.test(args) && !/iconKey\s*:\s*['"](?:Fill|Line)\//.test(args) && !/loading\s*:\s*true/.test(args)) {
    add(findings, 'error', '纯图标按钮必须传 iconKey，且只能引用 BeP 图标库中的 Fill/ 或 Line/ key', line);
  }
  if (/state\s*:\s*['"](?:hover|highlight)['"]/.test(args) && modName !== 'button') {
    add(findings, 'warning', '业务页面默认不得绘制按钮 hover/highlight 静态态；除非用户明确要求展示特殊状态，否则使用 default 态', line);
  }
}

var inputCallRe = /\bbepInput\s*\(([^)]*)\)/g;
var inputCallMatch;
while ((inputCallMatch = inputCallRe.exec(clean))) {
  var inputArgs = inputCallMatch[1];
  var inputLine = lineOf(clean, inputCallMatch.index);
  if (/readonly\s*:\s*true/.test(inputArgs)) {
    add(findings, 'error', '输入框未公开 readonly 状态；只读信息优先使用描述列表 bepDescriptions，或先补 readonly 真源', inputLine);
  }
  if (/state\s*:\s*['"]hover['"]/.test(inputArgs) && modName !== 'input') {
    add(findings, 'warning', '业务页面默认不得绘制输入框 hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/error/disabled', inputLine);
  }
  var suffixIconMatch = inputArgs.match(/suffixIconKey\s*:\s*['"]([^'"]+)['"]/);
  if (suffixIconMatch && !knownIconKeys[suffixIconMatch[1]]) {
    add(findings, 'error', '输入框 suffixIconKey 引用了 BeP 图标库不存在的图标：' + suffixIconMatch[1], inputLine);
  }
}

var inputNumberCallRe = /\bbepInputNumber\s*\(([^)]*)\)/g;
var inputNumberCallMatch;
while ((inputNumberCallMatch = inputNumberCallRe.exec(clean))) {
  var inputNumberArgs = inputNumberCallMatch[1];
  var inputNumberLine = lineOf(clean, inputNumberCallMatch.index);
  if (/readonly\s*:\s*true/.test(inputNumberArgs)) {
    add(findings, 'error', '数字输入框未公开 readonly 状态；只读数值优先使用描述列表或表格文字', inputNumberLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(inputNumberArgs) && modName !== 'input-number') {
    add(findings, 'warning', '业务页面默认不得绘制数字输入框 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/error/disabled', inputNumberLine);
  }
}

var textareaCallRe = /\bbepTextarea\s*\(([^)]*)\)/g;
var textareaCallMatch;
while ((textareaCallMatch = textareaCallRe.exec(clean))) {
  var textareaArgs = textareaCallMatch[1];
  var textareaLine = lineOf(clean, textareaCallMatch.index);
  if (/readonly\s*:\s*true/.test(textareaArgs)) {
    add(findings, 'error', '文本域未公开 readonly 状态；只读长文本优先使用描述列表 bepDescriptions', textareaLine);
  }
  if (/state\s*:\s*['"](?:focus|active|selected|open)['"]/.test(textareaArgs)) {
    add(findings, 'error', '文本域 state 只支持 default / hover / complete / error；focus/active/selected/open 未公开', textareaLine);
  }
  if (/state\s*:\s*['"]hover['"]/.test(textareaArgs) && modName !== 'textarea') {
    add(findings, 'warning', '业务页面默认不得绘制文本域 hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/error/disabled', textareaLine);
  }
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:Textarea|TextArea)\s*\(/.test(clean) && !/\bbepTextarea\s*\(/.test(clean)) {
  add(findings, 'error', '多行文本输入必须使用标准文本域 bepTextarea；不得页面内自造 Textarea 结构');
}

var inputNumberGroupCallRe = /\bbepInputNumberGroup\s*\(([^)]*)\)/g;
var inputNumberGroupCallMatch;
while ((inputNumberGroupCallMatch = inputNumberGroupCallRe.exec(clean))) {
  var inputNumberGroupArgs = inputNumberGroupCallMatch[1];
  var inputNumberGroupLine = lineOf(clean, inputNumberGroupCallMatch.index);
  if (/readonly\s*:\s*true/.test(inputNumberGroupArgs)) {
    add(findings, 'error', '组合数字输入框未公开 readonly 状态；只读数值优先使用描述列表或表格文字', inputNumberGroupLine);
  }
}

var selectCallRe = /\bbepSelect\s*\(([^)]*)\)/g;
var selectCallMatch;
while ((selectCallMatch = selectCallRe.exec(clean))) {
  var selectArgs = selectCallMatch[1];
  var selectLine = lineOf(clean, selectCallMatch.index);
  if (/readonly\s*:\s*true/.test(selectArgs)) {
    add(findings, 'error', '选择器未公开 readonly 状态；只读信息优先使用描述列表 bepDescriptions', selectLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover|selected|open)['"]/.test(selectArgs) && modName !== 'select') {
    add(findings, 'warning', '业务页面默认不得绘制选择器 hover/selected/open 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', selectLine);
  }
}

var multiSelectCallRe = /\bbepMultiSelect\s*\(([^)]*)\)/g;
var multiSelectCallMatch;
while ((multiSelectCallMatch = multiSelectCallRe.exec(clean))) {
  var multiSelectArgs = multiSelectCallMatch[1];
  var multiSelectLine = lineOf(clean, multiSelectCallMatch.index);
  if (/readonly\s*:\s*true/.test(multiSelectArgs)) {
    add(findings, 'error', '多选选择器未公开 readonly 状态；只读信息优先使用描述列表 bepDescriptions', multiSelectLine);
  }
  if (/state\s*:\s*['"](?:hover|selected|open)['"]/.test(multiSelectArgs) && modName !== 'select') {
    add(findings, 'warning', '业务页面默认不得绘制多选选择器 hover/selected/open 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', multiSelectLine);
  }
}

var cascaderCallRe = /\bbepCascader\s*\(([^)]*)\)/g;
var cascaderCallMatch;
while ((cascaderCallMatch = cascaderCallRe.exec(clean))) {
  var cascaderArgs = cascaderCallMatch[1];
  var cascaderLine = lineOf(clean, cascaderCallMatch.index);
  if (/readonly\s*:\s*true/.test(cascaderArgs)) {
    add(findings, 'error', '级联选择器未公开 readonly 状态；只读层级路径优先使用描述列表 bepDescriptions', cascaderLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover|selected|open)['"]/.test(cascaderArgs) && modName !== 'cascader') {
    add(findings, 'warning', '业务页面默认不得绘制级联选择器 hover/selected/open 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', cascaderLine);
  }
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:Cascader|Cascade)\s*\(/.test(clean) && !/\bbepCascader\s*\(/.test(clean)) {
  add(findings, 'error', '级联选择器必须使用标准组件 bepCascader / bepCascaderPanel；不得页面内自造级联列或展开面板');
}

var treeCallRe = /\bbepTree\s*\(([^)]*)\)/g;
var treeCallMatch;
while ((treeCallMatch = treeCallRe.exec(clean))) {
  var treeArgs = treeCallMatch[1];
  var treeLine = lineOf(clean, treeCallMatch.index);
  if (/readonly\s*:\s*true/.test(treeArgs)) {
    add(findings, 'error', '树形组件不公开 readonly 参数；只读层级结构直接使用基础树形，不需要 readonly', treeLine);
  }
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:Tree|TreeNode)\s*\(/.test(clean) && !/\bbepTree\s*\(/.test(clean) && !/\bbepTreeRow\s*\(/.test(clean)) {
  add(findings, 'error', '普通树形必须使用标准树形组件 bepTree；不得页面内自造树节点、缩进或箭头');
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:ComplexTree|OrgTree|BusinessTree)\s*\(/.test(clean) && !/\bbepComplexTree\s*\(/.test(clean)) {
  add(findings, 'error', '复杂树形/组织树容器必须使用标准组件 bepComplexTree；不得页面内自造标题栏、搜索框、加载态或标题下拉');
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:TreeSelect|TreeSelector)\s*\(/.test(clean) && !/\bbepTreeSelect\s*\(/.test(clean)) {
  add(findings, 'error', '树形选择器必须使用标准组件 bepTreeSelect / bepTreeSelectPanel；不得用输入框或选择器加手写树浮层近似');
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:ComplexTreePicker|TreePicker|TreeChooser|TreeSelectModal)\s*\(/.test(clean) && !/\bbepComplexTreePicker\s*\(/.test(clean)) {
  add(findings, 'error', '复杂树形选择面板必须使用标准组件 bepComplexTreePicker；不得页面内自造左右分栏树选择弹窗、详情列表或已选区');
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:AddCard|CreateCard)\s*\(/.test(clean) && !/\bbepAddCard\s*\(/.test(clean)) {
  add(findings, 'error', '新增卡片必须使用标准组件 bepAddCard；不得页面内手写加号入口卡片');
}

if (/\b(?:make|build)[A-Za-z0-9_]*(?:ContentCard|InfoCard|EntryCard|AppCard)\s*\(/.test(clean) && !/\bbepCard\s*\(/.test(clean)) {
  add(findings, 'error', '内容卡片必须使用标准组件 bepCard；不得页面内手写图标圆、描述区、底部操作区或操作分隔线');
}

var dateCallRe = /\bbepDate\s*\(([^)]*)\)/g;
var dateCallMatch;
while ((dateCallMatch = dateCallRe.exec(clean))) {
  var dateArgs = dateCallMatch[1];
  var dateLine = lineOf(clean, dateCallMatch.index);
  if (/readonly\s*:\s*true/.test(dateArgs)) {
    add(findings, 'error', '单日期未公开 readonly 状态；只读日期优先使用描述列表 bepDescriptions 或表格文字', dateLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(dateArgs) && modName !== 'date') {
    add(findings, 'warning', '业务页面默认不得绘制单日期 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', dateLine);
  }
}

var dateRangeCallRe = /\bbepDateRange\s*\(([^)]*)\)/g;
var dateRangeCallMatch;
while ((dateRangeCallMatch = dateRangeCallRe.exec(clean))) {
  var dateRangeArgs = dateRangeCallMatch[1];
  var dateRangeLine = lineOf(clean, dateRangeCallMatch.index);
  if (/readonly\s*:\s*true/.test(dateRangeArgs)) {
    add(findings, 'error', '日期区间未公开 readonly 状态；只读日期范围优先使用描述列表 bepDescriptions 或表格文字', dateRangeLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(dateRangeArgs) && modName !== 'date') {
    add(findings, 'warning', '业务页面默认不得绘制日期区间 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', dateRangeLine);
  }
}

var timeCallRe = /\bbepTime\s*\(([^)]*)\)/g;
var timeCallMatch;
while ((timeCallMatch = timeCallRe.exec(clean))) {
  var timeArgs = timeCallMatch[1];
  var timeLine = lineOf(clean, timeCallMatch.index);
  if (/readonly\s*:\s*true/.test(timeArgs)) {
    add(findings, 'error', '时间选择器未公开 readonly 状态；只读时间优先使用描述列表 bepDescriptions 或表格文字', timeLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(timeArgs) && modName !== 'time') {
    add(findings, 'warning', '业务页面默认不得绘制时间选择器 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', timeLine);
  }
}

var timeRangeCallRe = /\bbepTimeRange\s*\(([^)]*)\)/g;
var timeRangeCallMatch;
while ((timeRangeCallMatch = timeRangeCallRe.exec(clean))) {
  var timeRangeArgs = timeRangeCallMatch[1];
  var timeRangeLine = lineOf(clean, timeRangeCallMatch.index);
  if (/readonly\s*:\s*true/.test(timeRangeArgs)) {
    add(findings, 'error', '时间区间未公开 readonly 状态；只读时间范围优先使用描述列表 bepDescriptions 或表格文字', timeRangeLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(timeRangeArgs) && modName !== 'time') {
    add(findings, 'warning', '业务页面默认不得绘制时间区间 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', timeRangeLine);
  }
}

var dateTimeCallRe = /\bbepDateTime\s*\(([^)]*)\)/g;
var dateTimeCallMatch;
while ((dateTimeCallMatch = dateTimeCallRe.exec(clean))) {
  var dateTimeArgs = dateTimeCallMatch[1];
  var dateTimeLine = lineOf(clean, dateTimeCallMatch.index);
  if (/readonly\s*:\s*true/.test(dateTimeArgs)) {
    add(findings, 'error', '日期时间选择器未公开 readonly 状态；只读日期时间优先使用描述列表 bepDescriptions 或表格文字', dateTimeLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(dateTimeArgs) && modName !== 'date-time') {
    add(findings, 'warning', '业务页面默认不得绘制日期时间选择器 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', dateTimeLine);
  }
}

var dateTimeRangeCallRe = /\bbepDateTimeRange\s*\(([^)]*)\)/g;
var dateTimeRangeCallMatch;
while ((dateTimeRangeCallMatch = dateTimeRangeCallRe.exec(clean))) {
  var dateTimeRangeArgs = dateTimeRangeCallMatch[1];
  var dateTimeRangeLine = lineOf(clean, dateTimeRangeCallMatch.index);
  if (/readonly\s*:\s*true/.test(dateTimeRangeArgs)) {
    add(findings, 'error', '日期时间区间未公开 readonly 状态；只读日期时间范围优先使用描述列表 bepDescriptions 或表格文字', dateTimeRangeLine);
  }
  if (/state\s*:\s*['"](?:hover|complete-hover)['"]/.test(dateTimeRangeArgs) && modName !== 'date-time') {
    add(findings, 'warning', '业务页面默认不得绘制日期时间区间 hover/complete-hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/complete/disabled', dateTimeRangeLine);
  }
}

var switchCallRe = /\bbepSwitch\s*\(([^)]*)\)/g;
var switchCallMatch;
while ((switchCallMatch = switchCallRe.exec(clean))) {
  var switchArgs = switchCallMatch[1];
  var switchLine = lineOf(clean, switchCallMatch.index);
  if (/readonly\s*:\s*true/.test(switchArgs)) {
    add(findings, 'error', '开关未公开 readonly 状态；只读二元状态优先使用描述列表 bepDescriptions 或状态标签 bepTag', switchLine);
  }
  if (/state\s*:/.test(switchArgs)) {
    add(findings, 'error', '开关不通过 state 参数表达 hover/focus/active；只支持 isOn、disabled、loading、size、showText', switchLine);
  }
}

var rateCallRe = /\bbepRate\s*\(([^)]*)\)/g;
var rateCallMatch;
while ((rateCallMatch = rateCallRe.exec(clean))) {
  var rateArgs = rateCallMatch[1];
  var rateLine = lineOf(clean, rateCallMatch.index);
  if (/readonly\s*:\s*true/.test(rateArgs)) {
    add(findings, 'error', '评分未公开 readonly 参数；只读评分仍使用 bepRate(value, {text}) 默认静态形态，不写 readonly', rateLine);
  }
  if (/state\s*:|disabled\s*:\s*true|half\s*:\s*true/.test(rateArgs)) {
    add(findings, 'error', '评分 Figma 真源未公开 state/disabled/half 状态；只支持 value、count、text、showText', rateLine);
  }
}

var radioCallRe = /\bbepRadioGroup\s*\(([^)]*)\)/g;
var radioCallMatch;
while ((radioCallMatch = radioCallRe.exec(clean))) {
  var radioArgs = radioCallMatch[1];
  var radioLine = lineOf(clean, radioCallMatch.index);
  if (/readonly\s*:\s*true|loading\s*:\s*true/.test(radioArgs)) {
    add(findings, 'error', '单选组未公开 readonly/loading 状态；只读单选结果优先使用描述列表或状态标签', radioLine);
  }
  if (/state\s*:\s*['"]hover['"]/.test(radioArgs) && modName !== 'radio-checkbox') {
    add(findings, 'warning', '业务页面默认不得绘制单选组 hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/selected/disabled', radioLine);
  }
  if (/variant\s*:\s*['"]button['"]/.test(radioArgs) && /\bbepButton\s*\(/.test(radioArgs)) {
    add(findings, 'error', '按钮式单选组必须通过 bepRadioGroup(..., {variant:\"button\"}) 内部生成，不得传入或拼接 bepButton 模拟', radioLine);
  }
}

var checkboxCallRe = /\bbepCheckboxGroup\s*\(([^)]*)\)/g;
var checkboxCallMatch;
while ((checkboxCallMatch = checkboxCallRe.exec(clean))) {
  var checkboxArgs = checkboxCallMatch[1];
  var checkboxLine = lineOf(clean, checkboxCallMatch.index);
  if (/readonly\s*:\s*true|loading\s*:\s*true|indeterminate\s*:\s*true/.test(checkboxArgs)) {
    add(findings, 'error', '多选组未公开 readonly/loading/indeterminate 状态；只读多选结果优先使用描述列表或 Tag', checkboxLine);
  }
  if (/state\s*:\s*['"]hover['"]/.test(checkboxArgs) && modName !== 'radio-checkbox') {
    add(findings, 'warning', '业务页面默认不得绘制多选组 hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/selected/disabled', checkboxLine);
  }
}

var tagCallRe = /\bbepTag\s*\(([^)]*)\)/g;
var tagCallMatch;
while ((tagCallMatch = tagCallRe.exec(clean))) {
  var tagArgs = tagCallMatch[1];
  var tagLine = lineOf(clean, tagCallMatch.index);
  var styleLiteral = tagArgs.match(/,\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/);
  var styleObject = tagArgs.match(/style\s*:\s*['"]([^'"]+)['"]/);
  var tagStyle = styleLiteral ? styleLiteral[1] : (styleObject ? styleObject[1] : null);
  if (tagStyle && !/^(outline|solid|dot|closable|add)$/.test(tagStyle)) {
    add(findings, 'error', '标示 / 标签 style 只支持 outline / solid / dot / closable / add', tagLine);
  }
  var typeLiteral = tagArgs.match(/^\s*['"][^'"]*['"]\s*,\s*['"]([^'"]+)['"]/);
  if (typeLiteral && !/^(enabled|disabled|info|success|warning|danger|inactive)$/.test(typeLiteral[1])) {
    add(findings, 'error', '标示 / 标签 type 只支持 enabled / disabled / info / success / warning / danger / inactive', tagLine);
  }
  if (/state\s*:|hover\s*:\s*true|focus\s*:\s*true|loading\s*:\s*true/.test(tagArgs)) {
    add(findings, 'error', '标示 / 标签未公开 hover/focus/loading 或手动 state 参数；请使用 type/style 表达视觉类型', tagLine);
  }
}

[
  { name:'bepUploadBtn', label:'上传按钮' },
  { name:'bepUploadClick', label:'点击上传' },
  { name:'bepUploadFileRow', label:'上传条' },
  { name:'bepUploadFileList', label:'上传文件列表' },
  { name:'bepUploadDragger', label:'拖拽上传' },
  { name:'bepImageUpload', label:'图片上传' }
].forEach(function(component) {
  var re = new RegExp('\\b' + component.name + '\\s*\\(([^)]*)\\)', 'g');
  var m;
  while ((m = re.exec(clean))) {
    var args = m[1];
    var line = lineOf(clean, m.index);
    if (/readonly\s*:\s*true|disabled\s*:\s*true/.test(args)) {
      add(findings, 'error', component.label + '未公开 readonly/disabled 状态；只读附件优先使用描述列表附件 value', line);
    }
    if (/state\s*:\s*['"][^'"]*hover['"]/.test(args) && modName !== 'upload') {
      add(findings, 'warning', '业务页面默认不得绘制' + component.label + ' hover 静态态；除非用户明确要求展示特殊状态，否则使用 default/uploading/success/error', line);
    }
  }
});

var customTimelinePatterns = [
  /\bTimelineItem\b/g,
  /\bLogRow\b/g,
  /\bmakeLog(?:Header|Row)\s*\(/g,
  /\b(?:make|build|append)[A-Za-z0-9_]*(?:Operation|Record|Log|Timeline)[A-Za-z0-9_]*\s*\(/g
];
customTimelinePatterns.forEach(function(re) {
  var m;
  while ((m = re.exec(clean))) {
    if (!/\bbepTimeline\s*\(/.test(clean)) {
      add(findings, 'error', '动态记录类内容必须使用标准时间轴组件 bepTimeline；组件库暂无时先补组件，禁止页面内自造 TimelineItem/LogRow/操作记录结构', lineOf(clean, m.index));
      break;
    }
  }
});

var stepsCallRe = /\bbepSteps\s*\(([^)]*)\)/g;
var stepsCallMatch;
while ((stepsCallMatch = stepsCallRe.exec(clean))) {
  var stepsArgs = stepsCallMatch[1];
  var stepsLine = lineOf(clean, stepsCallMatch.index);
  if (/state\s*:|hover\s*:\s*true|focus\s*:\s*true|disabled\s*:\s*true/.test(stepsArgs)) {
    add(findings, 'error', '步骤条未公开 hover/focus/disabled 或手动 state 参数；只通过 currentIdx 自动推导 done/current/pending', stepsLine);
  }
  if (/variant\s*:\s*['"][^'"]+['"]/.test(stepsArgs) && !/variant\s*:\s*['"](?:basic|description|vertical)['"]/.test(stepsArgs)) {
    add(findings, 'error', '步骤条 variant 只支持 basic / description / vertical', stepsLine);
  }
}

var paginationCallRe = /\bbepPagination\s*\(([^)]*)\)/g;
var paginationCallMatch;
while ((paginationCallMatch = paginationCallRe.exec(clean))) {
  var paginationArgs = paginationCallMatch[1];
  var paginationLine = lineOf(clean, paginationCallMatch.index);
  if (/state\s*:|hover\s*:\s*true|focus\s*:\s*true|loading\s*:\s*true/.test(paginationArgs)) {
    add(findings, 'error', '分页器未公开 hover/focus/loading 或手动 state 参数；当前只支持 current、pages、pageSize 和 showPageSize/showJump', paginationLine);
  }
}

var treeRowCallRe = /\bbepTreeRow\s*\(([^)]*)\)/g;
var treeRowCallMatch;
while ((treeRowCallMatch = treeRowCallRe.exec(clean))) {
  var treeRowArgs = treeRowCallMatch[1];
  var treeRowLine = lineOf(clean, treeRowCallMatch.index);
  if (/['"](?:open|opened|close|closed|expand|collapse|parent|child)['"]/.test(treeRowArgs) && !/['"](?:expanded|collapsed|leaf)['"]/.test(treeRowArgs)) {
    add(findings, 'error', '树状表格 state 只支持 expanded / collapsed / leaf', treeRowLine);
  }
  if (/state\s*:|hover\s*:\s*true|focus\s*:\s*true|disabled\s*:\s*true|loading\s*:\s*true/.test(treeRowArgs)) {
    add(findings, 'error', '树状表格行未公开 hover/focus/disabled/loading 或对象 state 参数；状态只能通过 bepTreeRow 第五参数传 expanded/collapsed/leaf', treeRowLine);
  }
}

var customTreePatterns = [
  /\bTreeRow\b/g,
  /\bTreeNode\b/g,
  /\bmakeTree(?:Row|Cell|Node)\s*\(/g,
  /\bbuildTree(?:Row|Cell|Node)\s*\(/g,
  /\bappendTree(?:Row|Cell|Node)\s*\(/g
];
customTreePatterns.forEach(function(re) {
  var m;
  while ((m = re.exec(clean))) {
    if (!/\bbepTreeRow\s*\(/.test(clean)) {
      add(findings, 'error', '树状表格必须使用标准组件 bepTreeRow；禁止页面内自造 TreeRow/TreeNode/树状缩进结构', lineOf(clean, m.index));
      break;
    }
  }
});

if (/activeTab\s*:\s*0[\s\S]{0,4000}操作记录/.test(clean) && /\b(?:append|build|make)[A-Za-z0-9_]*(?:Operation|Record|Log|Timeline)[A-Za-z0-9_]*\s*\(/.test(clean)) {
  add(findings, 'error', 'activeTab:0 的商品信息页签不得渲染操作记录内容；Tabs 内容必须按 activeTab 分支渲染');
}

if (/\bbepTableRow\s*\(|\bbepTreeRow\s*\(/.test(clean)) {
  if (!/\bCOL_WIDTH_AUDIT\b/.test(clean)) {
    add(findings, 'error', '表格页面必须编写 COL_WIDTH_AUDIT，列出每列表头、最长内容、计算宽、最终宽');
  }

  if (/tableW\s*=\s*[^;]*\.reduce\s*\([^;]*\+\s*col\.w/.test(clean) && !/grow\s*:\s*true|finalTableW|CONTENT_W\s*-\s*baseTableW|TABLE_W\s*-\s*baseTableW|横向滚动|冻结/.test(clean)) {
    add(findings, 'warning', '表格宽度仅由列宽累加得到；非横向滚动表格必须把剩余宽度分配给 grow:true 列并填满 TABLE_W/CONTENT_W');
  }

	  var contentTextRe = /content\s*:\s*bepText\s*\(/g;
	  var contentMatch;
	  while ((contentMatch = contentTextRe.exec(clean))) {
	    add(findings, 'error', '表格单元格 content 必须使用 bepTableText / bepTruncText，不得使用 bepText', lineOf(clean, contentMatch.index));
	  }
	  if (!/\bbepTableText\s*\(|\bbepTruncText\s*\(/.test(clean) && !/content\s*:\s*['"]/.test(clean)) {
	    add(findings, 'warning', '页面使用表格行，但未发现 bepTableText / bepTruncText；请确认数据单元格固定在列宽内');
	  }

	  ['金额', '价格', '供货价', '售价', '在售价', '库存', '数量', '成本', '单价', '总价'].forEach(function(label) {
	    if (clean.indexOf(label) !== -1 && !/alignH\s*:\s*['"]RIGHT['"]/.test(clean)) {
	      add(findings, 'error', '数值列使用 bepTableText / bepTruncText 时必须传 alignH:\'RIGHT\'：' + label);
	    }
	  });

  if (/\bBEP_SHADOW_FREEZE_LEFT\b/.test(clean) && /右侧|right|Right|操作列|FrozenAction|冻结操作列/.test(clean)) {
    add(findings, 'error', '右侧冻结列必须使用 BEP_SHADOW_FREEZE_RIGHT，阴影应落在左侧');
  }

	  if (/\bbepActionCell\s*\(/.test(clean) && !/\bbepActionMetrics\s*\(|\.width\s*\+\s*32/.test(clean)) {
	    add(findings, 'error', '操作列宽必须由 bepActionMetrics(actionRows).width + 32 或 bepActionCell(...).width + 32 得出，不得手写估算');
	  }

  if (/\{[^{}]*label\s*:\s*['"]操作['"][^{}]*(?:^|[,{])\s*w\s*:\s*[1-9]\d*/m.test(clean)) {
	    add(findings, 'error', '操作列 w 不得硬编码数字，必须由 bepActionMetrics(actionRows).width + 32 回填');
	  }
	}

if (/多级表头|rowSpan\s*:|children\s*:\s*\[/.test(clean) && !/\bbepMultiLevelTableHeader\s*\(/.test(clean)) {
  add(findings, 'error', '多级表头必须使用 bepMultiLevelTableHeader；不得用两个普通表头或页面内手写 rowSpan/colSpan');
}

if (/快速新增|新增一行|QuickAdd/.test(clean) && /\bbepTableRow\s*\(/.test(clean) && !/\bbepQuickAddRow\s*\(/.test(clean)) {
  add(findings, 'error', '表格内快速新增入口必须使用 bepQuickAddRow；不得做成工具栏按钮或手写虚线按钮');
}

if (/展开面板|折叠面板|ExpandPanel|expandedPanel/.test(clean) && /\bbepTableRow\s*\(/.test(clean) && !/\bbepTableExpandPanel\s*\(/.test(clean)) {
  add(findings, 'error', '表格行展开详情必须使用 bepTableExpandPanel；不得做成独立 Card 或手写浅色详情块');
}

if (/DragHandle|拖拽|Line\/Drag/.test(clean) && !/\bbepTableDragHandle\s*\(/.test(clean)) {
  add(findings, 'error', '可拖拽表格必须使用 bepTableDragHandle；不得手写拖拽点阵或直接拼 Line/Drag');
}

if (/TableCheckbox|表格多选|checkbox\s*列|多选框/.test(clean) && !/\bbepTableCheckbox\s*\(/.test(clean) && !/\bbepCheckboxGroup\s*\(/.test(clean)) {
  add(findings, 'warning', '表格 checkbox 列应使用 bepTableCheckbox；请确认没有手写勾选框');
}

if (/\bbepFormItem\s*\(/.test(clean)) {
  var formLiteralRe = /\bbepFormItem\s*\(\s*['"]([^'"]+)['"]/g;
  var formLiteralMatch;
  while ((formLiteralMatch = formLiteralRe.exec(clean))) {
    var label = formLiteralMatch[1];
    if (labelCharCount(label) > 8) {
      add(findings, 'error', '表单字段标题超过 8 个汉字，必须要求产品/业务简化：' + label, lineOf(clean, formLiteralMatch.index));
    }
  }

  var labelPropRe = /label\s*:\s*['"]([^'"]+)['"]/g;
  var labelPropMatch;
  while ((labelPropMatch = labelPropRe.exec(clean))) {
    var propLabel = labelPropMatch[1];
    if (labelCharCount(propLabel) > 8) {
      add(findings, 'error', '表单字段标题超过 8 个汉字，必须要求产品/业务简化：' + propLabel, lineOf(clean, labelPropMatch.index));
    }
  }

  if (!/\bLABEL_W\s*=\s*90\b|labelW\s*:\s*90\b|labelW\s*:\s*LABEL_W\b/.test(clean)) {
    add(findings, 'warning', '表单字段标题 label 区应固定为 8 个汉字 + 必填星号宽度（LABEL_W = 90）');
  }
}

if (/\bcard\.effects\s*=/.test(clean)) {
  add(findings, 'warning', '页面级 Card 默认无阴影；如确需阴影，请在交付说明中解释');
}

if (/删除数据|删除确认|禁用数据|退出编辑|对话框\s*POP|提醒弹窗/.test(clean) && !/\bbepAlertModal\s*\(/.test(clean)) {
  add(findings, 'error', '删除/禁用/退出编辑/普通提示等轻量确认必须使用提醒弹窗 bepAlertModal；不得用通用弹窗或页面内手写 POP 结构');
}

if (/\bbepModal\s*\(\s*['"][^'"]*(删除|禁用|退出编辑|普通标题)/.test(clean)) {
  add(findings, 'error', '轻量确认不应使用通用弹窗 bepModal；请改用提醒弹窗 bepAlertModal');
}

var messageCallRe = /\bbepMessage\s*\(([^)]*)\)/g;
var messageCallMatch;
while ((messageCallMatch = messageCallRe.exec(clean))) {
  var messageArgs = messageCallMatch[1];
  var messageLine = lineOf(clean, messageCallMatch.index);
  var typeMatch = messageArgs.match(/,\s*['"]([^'"]+)['"]\s*(?:,|\))/);
  if (typeMatch && !/^(info|success|error|danger|loading)$/.test(typeMatch[1])) {
    if (typeMatch[1] === 'warning') {
      add(findings, 'error', '全局提示 Message 不公开 warning；警告类块状提示必须使用 bepAlert，不得用 bepMessage 近似', messageLine);
    } else {
      add(findings, 'error', 'bepMessage type 只支持 info / success / error / danger / loading：' + typeMatch[1], messageLine);
    }
  }
}

var alertCallRe = /\bbepAlert\s*\(([^)]*)\)/g;
var alertCallMatch;
while ((alertCallMatch = alertCallRe.exec(clean))) {
  var alertArgs = alertCallMatch[1];
  var alertLine = lineOf(clean, alertCallMatch.index);
  var typeProp = alertArgs.match(/type\s*:\s*['"]([^'"]+)['"]/);
  if (typeProp && !/^(info|success|warning|error|danger)$/.test(typeProp[1])) {
    add(findings, 'error', 'bepAlert type 只支持 info / success / warning / error / danger：' + typeProp[1], alertLine);
  }
  var variantProp = alertArgs.match(/variant\s*:\s*['"]([^'"]+)['"]/);
  if (variantProp && !/^(normal|large)$/.test(variantProp[1])) {
    add(findings, 'error', 'bepAlert variant 只支持 normal / large：' + variantProp[1], alertLine);
  }
}

if (/警告提示\s+Alert|普通提示|成功提示|出错提示|这是一条警告提示的文案/.test(clean) && !/\bbepAlert\s*\(/.test(clean) && modName !== 'message') {
  add(findings, 'error', '页面内块状警告提示必须使用 bepAlert；不得手写 Alert 或用 bepMessage / bepAlertModal 近似');
}

var metricCardCallRe = /\bbepMetricCard\s*\(([^)]*)\)/g;
var metricCardCallMatch;
while ((metricCardCallMatch = metricCardCallRe.exec(clean))) {
  var metricArgs = metricCardCallMatch[1];
  var metricLine = lineOf(clean, metricCardCallMatch.index);
  if (/state\s*:|hover\s*:\s*true|selected\s*:\s*true|disabled\s*:\s*true|loading\s*:\s*true/.test(metricArgs)) {
    add(findings, 'error', '指标数据卡片未公开 hover/selected/disabled/loading 或手动 state 参数；只用于静态 KPI 摘要展示', metricLine);
  }
  var miniChartProp = metricArgs.match(/miniChart\s*:\s*['"]([^'"]+)['"]/);
  if (miniChartProp && !/^(bars|sparkline|donut)$/.test(miniChartProp[1])) {
    add(findings, 'error', 'bepMetricCard miniChart 只支持 bars / sparkline / donut：' + miniChartProp[1], metricLine);
  }
}

if (/指标一（万）|日环比|日同比|KPI|数据看板|统计概览/.test(clean) && !/\bbepMetricCard\s*\(/.test(clean) && /MetricCard|makeMetric|buildMetric|指标卡|数据卡片/.test(clean)) {
  add(findings, 'error', '数据看板 KPI 摘要必须使用指标数据卡片 bepMetricCard；不得页面内手写指标卡结构');
}

var chartCardCallRe = /\bbepChartCard\s*\(([^)]*)\)/g;
var chartCardCallMatch;
while ((chartCardCallMatch = chartCardCallRe.exec(clean))) {
  var chartArgs = chartCardCallMatch[1];
  var chartLine = lineOf(clean, chartCardCallMatch.index);
  if (/state\s*:|hover\s*:\s*true|selected\s*:\s*true|disabled\s*:\s*true|loading\s*:\s*true/.test(chartArgs)) {
    add(findings, 'error', '图表容器未公开 hover/selected/disabled/loading 或手动 state 参数；业务页面只使用 default 静态展示', chartLine);
  }
  var chartTypeProp = chartArgs.match(/type\s*:\s*['"]([^'"]+)['"]/);
  if (chartTypeProp && !/^(line|bar|horizontal-bar|donut|gauge|word-cloud|placeholder)$/.test(chartTypeProp[1])) {
    add(findings, 'error', 'bepChartCard type 只支持 line / bar / horizontal-bar / donut / gauge / word-cloud / placeholder：' + chartTypeProp[1], chartLine);
  }
}

if (/趋势分析|图表标题|数据统计|市场趋势|排行榜|环形图|仪表盘|词云/.test(clean) && !/\bbepChartCard\s*\(/.test(clean) && /ChartCard|ChartPanel|makeChart|buildChart|图表容器|图表卡片/.test(clean)) {
  add(findings, 'error', '数据看板完整图表区域必须使用图表容器 bepChartCard；不得页面内手写图表卡片结构');
}

var dashboardTableCallRe = /\bbepDashboardTableCard\s*\(([^)]*)\)/g;
var dashboardTableCallMatch;
while ((dashboardTableCallMatch = dashboardTableCallRe.exec(clean))) {
  var dashboardTableArgs = dashboardTableCallMatch[1];
  var dashboardTableLine = lineOf(clean, dashboardTableCallMatch.index);
  if (/state\s*:|hover\s*:\s*true|selected\s*:\s*true|disabled\s*:\s*true|loading\s*:\s*true/.test(dashboardTableArgs)) {
    add(findings, 'error', '看板表格未公开 hover/selected/disabled/loading 或手动 state 参数；业务页面只使用 default 静态展示', dashboardTableLine);
  }
}

if (/销售明细|明细排行|Top 明细|看板表格|统计表格/.test(clean) && !/\bbepDashboardTableCard\s*\(/.test(clean) && /DashboardTable|TableCard|makeDashboardTable|buildDashboardTable|看板表格/.test(clean)) {
  add(findings, 'error', '数据看板表格型模块必须使用看板表格 bepDashboardTableCard；不得页面内手写看板表格卡片');
}

var rankListCallRe = /\bbepRankListCard\s*\(([^)]*)\)/g;
var rankListCallMatch;
while ((rankListCallMatch = rankListCallRe.exec(clean))) {
  var rankListArgs = rankListCallMatch[1];
  var rankListLine = lineOf(clean, rankListCallMatch.index);
  if (/state\s*:|hover\s*:\s*true|selected\s*:\s*true|disabled\s*:\s*true|loading\s*:\s*true/.test(rankListArgs)) {
    add(findings, 'error', '排行榜未公开 hover/selected/disabled/loading 或手动 state 参数；业务页面只使用 default 静态展示', rankListLine);
  }
}

if (/排行榜|Top N|排行模块|门店排行|商品排行/.test(clean) && !/\bbepRankListCard\s*\(/.test(clean) && /RankList|Ranking|makeRank|buildRank|排行榜/.test(clean)) {
  add(findings, 'error', '数据看板列表型排行榜必须使用排行榜 bepRankListCard；不得页面内手写排名徽标、排行行或进度条');
}

var detailModalRe = /\bbepModal\s*\([\s\S]{0,500}?variant\s*:\s*['"]detail['"][\s\S]{0,300}?showFooter\s*:\s*true/g;
var detailModalMatch;
while ((detailModalMatch = detailModalRe.exec(clean))) {
  add(findings, 'error', "详情弹窗默认不需要底部按钮，只保留右上关闭；不得在 variant:'detail' 中设置 showFooter:true", lineOf(clean, detailModalMatch.index));
}

var modalPaddingRe = /\bbepModal\s*\([\s\S]{0,600}?(?:24\s*\*\s*2|-\s*48)[\s\S]{0,160}?(?:24\s*\*\s*2|-\s*48)/g;
var modalPaddingMatch;
while ((modalPaddingMatch = modalPaddingRe.exec(clean))) {
  add(findings, 'warning', '弹窗框架已内置上下左右 24px 内容边距；请确认 contentNode 没有重复包 24px padding', lineOf(clean, modalPaddingMatch.index));
}

var detailDrawerRe = /\bbepDrawer\s*\([\s\S]{0,500}?variant\s*:\s*['"]detail['"][\s\S]{0,300}?showFooter\s*:\s*true/g;
var detailDrawerMatch;
while ((detailDrawerMatch = detailDrawerRe.exec(clean))) {
  add(findings, 'error', "详情抽屉默认不需要底部按钮，只保留右上关闭；不得在 variant:'detail' 中设置 showFooter:true", lineOf(clean, detailDrawerMatch.index));
}

var drawerPaddingRe = /\bbepDrawer\s*\([\s\S]{0,600}?(?:24\s*\*\s*2|-\s*48)[\s\S]{0,160}?(?:24\s*\*\s*2|-\s*48)/g;
var drawerPaddingMatch;
while ((drawerPaddingMatch = drawerPaddingRe.exec(clean))) {
  add(findings, 'warning', '抽屉框架已内置上下左右 24px 内容边距；请确认 contentNode 没有重复包 24px padding', lineOf(clean, drawerPaddingMatch.index));
}

var defined = {};
var defRe = /function\s+(bep[A-Za-z0-9_]+)\s*\(/g;
var defMatch;
while ((defMatch = defRe.exec(components))) {
  defined[defMatch[1]] = true;
}

var localDefRe = /function\s+(bep[A-Za-z0-9_]+)\s*\(/g;
while ((defMatch = localDefRe.exec(clean))) {
  add(findings, 'warning', '页面内定义了 bep* 函数，标准组件应放在 bep-components.js：' + defMatch[1], lineOf(clean, defMatch.index));
  defined[defMatch[1]] = true;
}

var callRe = /\b(bep[A-Za-z0-9_]+)\s*\(/g;
var seenMissing = {};
var callMatch;
while ((callMatch = callRe.exec(clean))) {
  var name = callMatch[1];
  if (!defined[name] && !seenMissing[name]) {
    seenMissing[name] = true;
    add(findings, 'error', '调用了未定义的组件函数：' + name, lineOf(clean, callMatch.index));
  }
}

if (!fs.existsSync(distPath)) {
  add(findings, 'error', '找不到构建产物，请先运行：node tools/build.js ' + modName + '/' + pageBase);
} else if (fs.statSync(distPath).size === 0) {
  add(findings, 'error', '构建产物为空：pages/' + modName + '/dist/' + pageBase + '.js');
} else {
  var distIconKeys = collectDistIconKeys(read(distPath));
  referencedIconKeys.forEach(function(iconKey) {
    if (knownIconKeys[iconKey] && !distIconKeys[iconKey]) {
      add(findings, 'error', '构建产物 dist 未保留源码引用图标：' + iconKey + '；请修复 build.js 的图标收集规则');
    }
  });
}

printAndExit(findings);

function printAndExit(items) {
  var errors = items.filter(function(f) { return f.type === 'error'; });
  var warnings = items.filter(function(f) { return f.type === 'warning'; });

  if (items.length === 0) {
    console.log('✅ 静态校验通过：' + modName + '/' + pageBase);
    process.exit(0);
  }

  errors.forEach(function(f) {
    console.error('❌ error' + (f.line ? ':' + f.line : '') + ' ' + f.msg);
  });
  warnings.forEach(function(f) {
    console.warn('⚠️  warning' + (f.line ? ':' + f.line : '') + ' ' + f.msg);
  });

  if (errors.length > 0) {
    console.error('\n校验失败：' + errors.length + ' error, ' + warnings.length + ' warning');
    process.exit(1);
  }

  console.warn('\n校验通过但有 warning：' + warnings.length + ' warning');
  process.exit(0);
}
