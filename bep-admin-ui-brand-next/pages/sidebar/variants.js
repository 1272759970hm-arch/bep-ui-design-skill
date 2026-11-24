// BeP Admin Kit · 侧边栏菜单项样例
// 覆盖一级、二级、三级菜单；三级菜单必须使用 bepSidebarItem(label, 3, state)

var CANVAS_W = 520, CANVAS_H = 760;
var SIDE_W = 208;

async function buildPage() {
  await Promise.all([
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium' }),
  ]);

  var pageFrame = bepFrame(CANVAS_W, CANVAS_H, { name:'侧边栏菜单项公开 API 样例', clip:true });
  pageFrame.fills = bepSolid(BEP_C.pageBg);
  figma.currentPage.appendChild(pageFrame);

  var sidebar = bepFrame(SIDE_W, CANVAS_H, { name:'Sidebar Variants', clip:true });
  sidebar.fills = bepSolid(bepHex('002138'));
  pageFrame.appendChild(sidebar);

  var y = 0;
  var logo = bepSidebarLogo('商家中心', 'MERCHANT CENTER', SIDE_W);
  logo.y = y;
  sidebar.appendChild(logo);
  y += 64;

  [
    ['工作台', 1, 'default', 'Line/home'],
    ['商品管理', 1, 'expanded', 'Line/box'],
    ['实物商品', 2, 'default', null],
    ['自营商品', 3, 'active', null],
    ['入驻商品', 3, 'default', null],
    ['商品分类', 2, 'default', null],
    ['店铺管理', 1, 'default', 'Line/shopping-bag'],
    ['数据中心', 1, 'default', 'Line/bar-chart-2'],
    ['消息中心', 1, 'default', 'Line/Notice'],
    ['系统设置', 1, 'default', 'Line/settings']
  ].forEach(function(item) {
    var row = bepSidebarItem(item[0], item[1], item[2], item[3], SIDE_W);
    row.y = y;
    sidebar.appendChild(row);
    y += 48;
  });

  var note = bepFrame(264, 240, { name:'Rules', r:4, clip:true });
  note.fills = bepSolid(BEP_C.white);
  note.x = 232;
  note.y = 24;
  pageFrame.appendChild(note);

  var title = bepText('侧边栏菜单项', B, 16, { style:'Medium', lh:24, x:24, y:24, a:0.85 });
  note.appendChild(title);
  [
    'level 1：一级菜单',
    'level 2：二级菜单',
    'level 3：三级菜单',
    'active 只提高文字透明度',
    'expanded 仅一级显示收起箭头',
    '缺图标先补 BeP 图标库'
  ].forEach(function(text, idx) {
    var t = bepText(text, B, 14, { lh:22, x:24, y:64 + idx * 28, a:0.65 });
    note.appendChild(t);
  });

  figma.viewport.scrollAndZoomIntoView([pageFrame]);
  figma.notify('侧边栏菜单项公开 API 样例完成');
}

buildPage().catch(function(e) { figma.notify('ERROR: ' + e.message); });
