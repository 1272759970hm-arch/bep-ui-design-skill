// BeP Admin Kit · 内容卡片样例
// Figma 真源：BeP Admin Kit Sketch V1.1.0 1 / 87:67004 / 模板/6.数据看板/3.卡片页

var CANVAS_W = 1240, CANVAS_H = 760;

function sampleCard(iconKey, iconColor, actions) {
  return bepCard({
    width:288,
    height:255,
    title:'卡片标题',
    iconKey:iconKey,
    iconColor:iconColor,
    descs:[
      { label:'描述项目', value:'项目名称' },
      { label:'描述项目', value:'项目文案' },
      { label:'描述项目', value:'这是一段详细的项目描述文案内容' }
    ],
    actions:actions || ['操作一', '操作二']
  });
}

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'内容卡片公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Card Variants', r:4, clip:false });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('内容卡片 Card', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var cards = [
    bepAddCard({ width:288, height:255, title:'新增卡片', desc:'卡片描述卡片描述卡片描述' }),
    sampleCard('Line/database', BEP_C.primary, ['操作一', '操作二', '更多']),
    sampleCard('Line/box', bepHex('#FFB75E'), ['操作一', '操作二', '更多']),
    sampleCard('Line/briefcase', bepHex('#3AA0C7'), ['操作一', '操作二']),
    sampleCard('Line/server', bepHex('#FF7875'), ['操作一', '操作二']),
    sampleCard('Line/bar-chart', bepHex('#65D66E'), ['操作一', '操作二']),
  ];

  cards.forEach(function(node, idx) {
    node.x = 24 + (idx % 3) * 312;
    node.y = 76 + Math.floor(idx / 3) * 279;
    card.appendChild(node);
  });

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('内容卡片公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
