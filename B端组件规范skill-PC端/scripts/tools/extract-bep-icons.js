// ── BeP 图标 SVG 提取脚本 v2 ─────────────────────────────────────────────────
// 修正：BeP 文件是单页面+多画板结构，"图标"是 Frame 不是 Page
// 输出方式：在画布上创建文字节点（避免控制台不可见的问题）
// ─────────────────────────────────────────────────────────────────────────────

async function extractIcons() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  figma.notify('开始提取图标 SVG，请稍候...');

  // ── 1. 找"图标"画板（Frame）──
  // BeP 文件是单 Page，画板是 Page 的子节点
  const iconFrame = figma.currentPage.children.find(
    n => n.type === 'FRAME' && n.name === '图标'
  );

  if (!iconFrame) {
    // 如果当前页面找不到，列出所有顶级节点名称帮助排查
    const names = figma.currentPage.children.map(n => `${n.type}:${n.name}`).join('\n');
    const errNode = figma.createText();
    errNode.characters = '❌ 未找到"图标"画板\n当前页面顶级节点：\n' + names;
    errNode.x = 0; errNode.y = 0;
    figma.currentPage.appendChild(errNode);
    figma.viewport.scrollAndZoomIntoView([errNode]);
    figma.notify('❌ 未找到图标画板，已在画布输出节点列表');
    return;
  }

  figma.notify('✅ 找到图标画板，共 ' + iconFrame.children.length + ' 个节点');

  // ── 2. 要提取的图标（Fill 系列 + BeP 特有 Line 系列）──
  const TARGETS = [
    'Fill/Abnormal',   'Fill/Tips',      'Fill/Arrow-Open', 'Fill/Arrow-PutAway',
    'Fill/Fail',       'Fill/Success',   'Fill/Search',     'Fill/Download',
    'Fill/Notice',     'Fill/MenuOpen',  'Fill/Add',        'Fill/Close',
    'Fill/FolderOpened', 'Fill/Document', 'Fill/Aim',
    'Line/Left-Arrow', 'Line/Right-Arrow', 'Line/DoubleLeft', 'Line/DoubleRight',
    'Line/Field',      'Line/Filter',    'Line/Close',      'Line/Add',
    'Line/Loading',    'Line/DropDown-Arrow', 'Line/PutAway-Arrow',
    'Line/Search',     'Line/Download',  'Line/Notice',     'Line/Menu',
    'Line/Date',       'Line/upload-cloud', 'Line/MenuOpen',
  ];

  // ── 3. 在画板中匹配节点 ──
  const nodeMap = {};
  for (const node of iconFrame.children) {
    const name = node.name.trim();
    for (const t of TARGETS) {
      if (name.endsWith(t.trim()) || name.endsWith(t.trim() + ' ') || name.endsWith(t.trim() + '  ')) {
        if (!nodeMap[t]) nodeMap[t] = node;
        break;
      }
    }
  }

  const matched = Object.keys(nodeMap);
  const missed  = TARGETS.filter(t => !nodeMap[t]);
  figma.notify(`匹配 ${matched.length}/${TARGETS.length} 个图标，开始导出...`);

  // ── 4. 逐个导出 SVG ──
  const result = {};
  const errors = [];

  for (const [key, node] of Object.entries(nodeMap)) {
    try {
      const bytes = await node.exportAsync({ format: 'SVG' });
      let svg = String.fromCharCode(...new Uint8Array(bytes));
      // 精简 SVG
      svg = svg
        .replace(/<\?xml[^>]*\?>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/> </g, '><')
        .trim();
      result[key] = svg;
    } catch (e) {
      errors.push(key + ': ' + e.message);
    }
  }

  // ── 5. 将结果写入画布文字节点（方便复制）──
  const output = {
    matched: matched.length,
    missed: missed,
    errors: errors,
    icons: result,
  };
  const jsonStr = JSON.stringify(output, null, 2);

  const outNode = figma.createText();
  outNode.characters = jsonStr;
  outNode.fontSize = 11;
  // 放在图标画板右侧
  outNode.x = iconFrame.x + iconFrame.width + 100;
  outNode.y = iconFrame.y;
  figma.currentPage.appendChild(outNode);
  figma.viewport.scrollAndZoomIntoView([outNode]);

  figma.notify(
    `✅ 完成！提取 ${Object.keys(result).length} 个图标。` +
    (missed.length ? ` 未匹配：${missed.join(', ')}` : '') +
    ' 请复制画布上的文字发给 Claude'
  );
}

extractIcons().catch(e => figma.notify('❌ 脚本错误：' + e.message));
