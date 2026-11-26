// ── BeP 图标 SVG 提取脚本 v3 ─────────────────────────────────────────────────
// 修正：递归搜索整个当前页面，不限于"图标"画板直接子节点
// 输出：在画布上创建文字节点 + 列出所有找到的图标名（便于排查命名差异）
// ─────────────────────────────────────────────────────────────────────────────

async function extractIconsV3() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  figma.notify('v3 开始提取…递归搜索全页面图标节点');

  // ── 步骤1：列出所有包含 "Fill/" 或 "Line/" 的节点名 ──
  var allMatches = figma.currentPage.findAll(function(n) {
    // 匹配名称中含 Fill/ 或 Line/ 的节点（INSTANCE、COMPONENT、FRAME 等）
    return /(?:Fill|Line)\//.test(n.name);
  });

  // 去重：按名称最后一部分（去前缀路径）分组
  var nameMap = {};
  allMatches.forEach(function(n) {
    // 提取 "Fill/XXX" 或 "Line/XXX" 部分（忽略前面的路径前缀如 "1.Basics//2.Icon图标/"）
    var m = n.name.match(/((?:Fill|Line)\/[\w\-]+)/);
    if (m && !nameMap[m[1]]) {
      nameMap[m[1]] = n;
    }
  });

  var foundKeys = Object.keys(nameMap).sort();
  figma.notify('找到 ' + foundKeys.length + ' 个不重复图标节点，开始导出…');

  // ── 步骤2：逐个导出 SVG ──
  var result = {};
  var errors = [];

  for (var i = 0; i < foundKeys.length; i++) {
    var key = foundKeys[i];
    var node = nameMap[key];
    try {
      var bytes = await node.exportAsync({ format: 'SVG' });
      var svg = String.fromCharCode.apply(null, new Uint8Array(bytes));
      svg = svg
        .replace(/<\?xml[^>]*\?>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/> </g, '><')
        .trim();
      result[key] = svg;
    } catch(e) {
      errors.push(key + ': ' + e.message);
    }
  }

  // ── 步骤3：与 bep-components.js 中的目标列表对比 ──
  var TARGETS = [
    'Fill/Abnormal', 'Fill/Tips', 'Fill/Arrow-Open', 'Fill/Arrow-PutAway',
    'Fill/Fail', 'Fill/Success', 'Fill/Search', 'Fill/Download',
    'Fill/Notice', 'Fill/MenuOpen', 'Fill/Add', 'Fill/Close',
    'Fill/FolderOpened', 'Fill/Document', 'Fill/Aim',
    'Line/Left-Arrow', 'Line/Right-Arrow', 'Line/DoubleLeft', 'Line/DoubleRight',
    'Line/Field', 'Line/Filter', 'Line/Close', 'Line/Add',
    'Line/Loading', 'Line/DropDown-Arrow', 'Line/PutAway-Arrow',
    'Line/Search', 'Line/Download', 'Line/Notice', 'Line/Menu',
    'Line/Date', 'Line/upload-cloud', 'Line/MenuOpen',
  ];
  var stillMissed = TARGETS.filter(function(t) { return !result[t]; });

  // ── 步骤4：输出结果到画布文字节点 ──
  var output = {
    total_found: foundKeys.length,
    target_matched: TARGETS.length - stillMissed.length,
    still_missed: stillMissed,
    all_icon_names: foundKeys,  // ← 完整列表，用于排查命名差异
    errors: errors,
    icons: result,
  };
  var jsonStr = JSON.stringify(output, null, 2);

  // 放置在画布 (0, 0)
  var outNode = figma.createText();
  outNode.characters = jsonStr;
  outNode.fontSize = 10;
  outNode.x = 0;
  outNode.y = 0;
  figma.currentPage.appendChild(outNode);
  figma.viewport.scrollAndZoomIntoView([outNode]);

  figma.notify(
    'v3 完成！找到 ' + foundKeys.length + ' 个图标，目标匹配 ' +
    (TARGETS.length - stillMissed.length) + '/' + TARGETS.length +
    (stillMissed.length ? '。仍缺：' + stillMissed.slice(0,3).join(', ') + (stillMissed.length > 3 ? '…' : '') : '，全部覆盖！') +
    ' · 请复制画布文字发给 Claude'
  );
}

extractIconsV3().catch(function(e) { figma.notify('❌ 脚本错误：' + e.message); });
