var CANVAS_W = 1040, CANVAS_H = 520;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'按钮公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var card = bepFrame(CANVAS_W - 32, CANVAS_H - 32, { name:'Button Variants', r:4, clip:true });
  card.fills = bepSolid(BEP_C.white);
  card.x = 16;
  card.y = 16;
  pageFrame.appendChild(card);

  var title = bepText('按钮公开 API 样例', B, 16, { style:'Medium', lh:24 });
  title.x = 24;
  title.y = 24;
  card.appendChild(title);

  var rows = [
    [
      bepButton('查询', 'primary', 32),
      bepButton('重置', 'secondary', 32),
      bepButton('编辑', 'primary-outline', 32),
      bepButton('删除', 'danger', 32),
      bepButton('展开', 'text', 32),
    ],
    [
      bepButton('导入', 'dashed', 32),
      bepButton('下载', 'secondary', 32, { iconKey:'Line/Download' }),
      bepButton('', 'secondary', 32, { iconKey:'Line/Search', iconOnly:true }),
      bepButton('保存中', 'primary', 32, { loading:true }),
      bepButton('提交', 'primary', 32, { disabled:true }),
      bepButton('已选', 'primary', 32, { state:'highlight' }),
    ],
    [
      bepButton('大按钮', 'primary', 36),
      bepButton('小按钮', 'secondary', 28),
      bepButton('下载', 'primary', 36, { iconKey:'Line/Download' }),
      bepButton('下载', 'secondary', 28, { iconKey:'Line/Download' }),
      bepButton('Hover', 'primary-outline', 32, { state:'hover' }),
      bepButton('危险高亮', 'danger', 32, { state:'highlight' }),
    ],
    [
      bepButton('基础按钮', 'primary', 32, { disabled:true }),
      bepButton('警示按钮', 'danger', 32, { disabled:true }),
      bepButton('边框按钮', 'primary-outline', 32, { disabled:true }),
      bepButton('边框按钮', 'secondary', 32, { disabled:true }),
      bepButton('虚线按钮', 'dashed', 32, { disabled:true }),
      bepButton('文字按钮', 'text', 32, { disabled:true }),
      bepButton('', 'primary', 32, { iconKey:'Line/Search', iconOnly:true, disabled:true }),
    ],
    [
      bepButton('展开', 'text', 32, { iconKey:'Line/DropDown-Arrow', iconPosition:'right' }),
      bepButton('收起', 'text', 32, { iconKey:'Line/PutAway-Arrow', iconPosition:'right' }),
      bepButtonGroup([
        { label:'重置', type:'secondary' },
        { label:'查询', type:'primary' },
      ]),
      bepButtonGroup([
        { label:'一次按钮', type:'secondary' },
        { label:'主按钮', type:'primary' },
      ], { width:240, align:'right' }),
    ],
  ];

  var y = 72;
  rows.forEach(function(row) {
    var x = 24;
    row.forEach(function(btn) {
      btn.x = x;
      btn.y = y;
      card.appendChild(btn);
      x += btn.width + 8;
    });
    y += 52;
  });

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('按钮公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
