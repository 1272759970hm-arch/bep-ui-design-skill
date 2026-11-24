// ===== 模板 03 · 商品详情 =====
// 用法：先粘 scripts/preamble.js 全文，再替换 "# 在此填入页面代码"
// 结构依据：templates/03-detail.md（终稿 375×812 一屏 / 长图 3433）

const D = {
  name: '茅凤凰庄园赤霞珠干红葡萄酒 老藤精酿 750ml 单瓶装',
  price: '42',
  origin: '128',
  commission: '¥5.2',
  // 价格区标签：服务标签（tinted 描边）+ 营销标签（tinted 无描边），顺序 服务 → 营销
  tags: [{ t:'极速达', kind:'service:blue' }, { t:'满199减20', kind:'promo:red' }],
  specs: [{ t:'单瓶装', on:true }, { t:'礼盒装', on:false }],
  specNote: '750ml｜单瓶装 · 日常小酌',
  services: [
    { k:'配送', v:'快递邮 · 48小时内发货' },
    { k:'服务', v:'7天无理由 · 破损包赔' },
  ],
  detailImgs: [
    'https://picsum.photos/seed/dt1/750/900',
    'https://picsum.photos/seed/dt2/750/900',
  ],
};

const screen = mkF('商品详情', 375, 812, C.bg, true);
pos(screen, 0, 0);

// ─── ① 主图 + 透明导航 ───
const IMG_H = 375;
const mainImg = await mkImage('https://picsum.photos/seed/detail1/750/750', 375, IMG_H, 0, screen);
pos(mainImg, 0, 0);
const navShade = mkR(375, 90, C.t1, 0, screen);
navShade.fills = [{ type:'SOLID', color:C.t1, opacity:0.28 }];
pos(navShade, 0, 0);
const tT = await mkT('9:41', 15, 600, C.white, screen);
pos(tT, 30, vc(tT.height, 44));
await mkStatusBarIcons(screen, C.white);
const back = await mkIcon('solar:alt-arrow-left-outline', 24, C.white, screen);
pos(back, 12, 44 + vc(24, 46));
const share = await mkIcon('solar:share-outline', 22, C.white, screen);
pos(share, 375 - 16 - 22 - 34, 44 + vc(22, 46));
const cart = await mkIcon('solar:cart-outline', 22, C.white, screen);
pos(cart, 375 - 16 - 22, 44 + vc(22, 46));
// 图片计数
const cnt = await mkT('1/5', 11, 400, C.white, screen);
const cntBg = mkR(cnt.width + 16, 20, C.t1, 10, screen);
pos(cntBg, 375 - 16 - (cnt.width + 16), IMG_H - 12 - 20);
cntBg.fills = [{ type:'SOLID', color:C.t1, opacity:0.4 }];
pos(cnt, cntBg.x + 8, cntBg.y + vc(cnt.height, 20));

// ─── ② 价格区（特大步阶：文字14 / 符号16 / 现价28） ───
let y = IMG_H;
const priceBlock = mkF('PriceBlock', 375, 96, C.white, true, screen);
pos(priceBlock, 0, y);
const yen = await mkT('¥', 16, 600, C.primary, priceBlock);
pos(yen, 16, 18);
const price = await mkT(D.price, 28, 600, C.primary, priceBlock);
pos(price, 16 + yen.width, 10);
const org = await mkT('¥' + D.origin, 16, 400, C.t3, priceBlock);
pos(org, 16 + yen.width + price.width + 8, 18 + 6);
org.textDecoration = 'STRIKETHROUGH';
// 佣金：双段胶囊（左深底「预估佣金」+ 右浅底金额），终稿实测 mkDuoTag
const cm = await mkDuoTag('预估佣金', D.commission, priceBlock);
pos(cm, 16, 50);
// 标签行（新语义语法，间隔 4）
let tx0 = 16;
for (let i = 0; i < D.tags.length; i++) {
  const tg = await mkTag(D.tags[i].t, D.tags[i].kind, priceBlock);
  pos(tg, tx0, 70);
  tx0 += tg.width + 4;
}
y += 96;

// ─── ③ 标题 + 规格 chip ───
const titleBlock = mkF('TitleBlock', 375, 100, C.white, true, screen);
pos(titleBlock, 0, y);
const nm = await mkTW(D.name, 16, 500, C.t1, 343, 24, titleBlock);
pos(nm, 16, 16);
const note = await mkT(D.specNote, 12, 400, C.t3, titleBlock);
pos(note, 16, 16 + nm.height + 8);
pos(mkDiv(titleBlock), 16, 99.5);
y += 100;

// ─── ④ 规格选择（chip 描边款） ───
const specBlock = mkF('SpecBlock', 375, 64, C.white, true, screen);
pos(specBlock, 0, y);
const specLb = await mkT('规格', 13, 400, C.t3, specBlock);
pos(specLb, 16, 16);
const chipWrap = mkF('ChipWrap', 300, 34, null, false, specBlock);
pos(chipWrap, 60, 15);
await mkTagGroup(D.specs.map(s => ({ text: s.t, selected: s.on })), 300, chipWrap);
y += 64;

// ─── ⑤ 服务行 ───
const svcBlock = mkF('ServiceBlock', 375, 44 * D.services.length + 16, C.white, true, screen);
pos(svcBlock, 0, y);
for (let i = 0; i < D.services.length; i++) {
  const yy = 16 + i * 44;
  const k = await mkT(D.services[i].k, 13, 400, C.t3, svcBlock);
  pos(k, 16, yy);
  const v = await mkT(D.services[i].v, 13, 400, C.t2, svcBlock);
  pos(v, 60, yy);
  const ar = await mkIcon('solar:alt-arrow-right-outline', 14, C.t4, svcBlock);
  pos(ar, 375 - 16 - 14, yy + 1);
  if (i < D.services.length - 1) pos(mkDiv(svcBlock), 16, yy + 33);
}
y += svcBlock.height;

// ─── ⑥ 分享佣金条 ───
const shareBar = mkF('ShareBar', 375, 40, C.ext_cream, true, screen);
pos(shareBar, 0, y);
const sbIcon = await mkIcon('solar:share-outline', 14, C.primary, shareBar);
pos(sbIcon, 16, vc(14, 40));
const sbTx = await mkT('分享商品｜成交后得 ' + D.commission, 12, 400, C.primary, shareBar);
pos(sbTx, 16 + 14 + 6, vc(sbTx.height, 40));
y += 40;

// ─── ⑦ 详情图文 ───
const dtTitle = mkF('DetailTitle', 375, 48, C.white, true, screen);
pos(dtTitle, 0, y);
const dtT = await mkT('商品详情', 15, 600, C.t1, dtTitle);
pos(dtT, cx(dtT, 375), vc(dtT.height, 48));
y += 48;
for (let i = 0; i < D.detailImgs.length; i++) {
  const img = await mkImage(D.detailImgs[i], 375, 450, 0, screen);
  pos(img, 0, y);
  y += 450;
}

// ─── ⑧ 底栏（图标组 + 双按钮，组 90 = 12 + 40 + 12 + 34） ───
screen.resize(375, Math.max(812, y + 90));
const barY = screen.height - 90;
const bar = mkF('BottomWrap', 375, 90, C.white, true, screen);
pos(bar, 0, barY);
pos(mkDivFull(bar), 0, 0);
const iconDefs = [
  { icon:'solar:headphones-round-sound-outline', label:'客服'   },
  { icon:'solar:star-outline',       label:'收藏'   },
  { icon:'solar:cart-outline', label:'购物车' },
];
for (let i = 0; i < iconDefs.length; i++) {
  const x0 = 12 + i * 46;
  const ic = await mkIcon(iconDefs[i].icon, 20, C.t2, bar);
  pos(ic, x0 + (44 - 20) / 2, 12);
  const lb = await mkT(iconDefs[i].label, 10, 400, C.t3, bar);
  pos(lb, x0 + (44 - lb.width) / 2, 36);
}
const b1 = await mkBtn('加入购物车', 'outline', 106, bar);
pos(b1, 375 - 12 - 106 - 8 - 106, 25);
const b2 = await mkBtn('立即购买', 'primary', 106, bar);
pos(b2, 375 - 12 - 106, 25);
