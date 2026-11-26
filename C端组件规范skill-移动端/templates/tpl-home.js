// ===== 模板 01 · 首页 / 会场页 =====
// 用法：先粘 scripts/preamble.js 全文，再把 "# 在此填入页面代码" 替换为本文件内容
// 结构依据：templates/01-home.md（终稿 375×1424 实测）
// 改文案只改 D，改区块只改下面标号段落

const D = {
  location: '华南碧桂园',
  search: '搜商品',
  entries: [
    { icon:'solar:lightning-outline',          label:'极速达' },
    { icon:'solar:like-outline',    label:'推荐'   },
    { icon:'solar:leaf-outline',        label:'生鲜'   },
    { icon:'solar:bottle-outline',         label:'母婴'   },
    { icon:'solar:heart-pulse-outline',  label:'银发健康' },
    { icon:'solar:crown-outline',        label:'积分会员' },
    { icon:'solar:t-shirt-outline',        label:'洗衣'   },
    { icon:'solar:wineglass-triangle-outline',         label:'精品酒' },
    { icon:'solar:gift-outline',         label:'商圈福利' },
    { icon:'solar:battery-full-minimalistic-outline', label:'充电' },
  ],
  market: { title:'邻里好福利', sub:'低至5折 · 每日10点开抢' },
  banner: { title:'凤凰严选·小酒馆上新', sub:'把酒言欢 · 会员再减20', cta:'立即抢购',
            img:'https://picsum.photos/seed/homebanner1/720/230' },
  goods: [
    { name:'品质纯钛保温杯1L 316不锈钢', price:'41.9',  origin:'481.9', commission:'¥5.2' },
    { name:'鲜榨胡萝卜汁 300ml×6瓶',     price:'35.5',  origin:'59.9',  commission:'¥3.1' },
    { name:'夏日清凉小家电 便携风扇',     price:'53.29', origin:'249.6', commission:'¥6.8' },
    { name:'当季黄金奶油富士 5斤装',      price:'78.0',  origin:'118.0', commission:'¥9.4' },
  ],
};

const GAP = 12;
const screen = mkF('首页', 375, 1424, C.bg, true);
pos(screen, 0, 0);

// ─── ① Hero（透明状态栏） ───
const HERO_H = 260;
const heroImg = await mkImage('https://picsum.photos/seed/homehero1/750/520', 375, HERO_H, 0, screen);
pos(heroImg, 0, 0);
const shade = mkR(375, 150, C.t1, 0, screen);
shade.fills = [{ type:'SOLID', color:C.t1, opacity:0.35 }];
pos(shade, 0, 0);
const timeT = await mkT('9:41', 15, 600, C.white, screen);
pos(timeT, 30, vc(timeT.height, 44));
await mkStatusBarIcons(screen, C.white);

const loc = await mkT(D.location, 15, 600, C.white, screen);
pos(loc, 20, 56);
const locArrow = await mkIcon('solar:alt-arrow-down-outline', 14, C.white, screen);
pos(locArrow, 20 + loc.width + 2, 56 + vc(14, loc.height));

const searchBar = mkR(288, 32, C.white, 16, screen);
pos(searchBar, 16, 88);
const sIcon = await mkIcon('solar:magnifier-outline', 15, C.t3, screen);
pos(sIcon, 28, 88 + vc(15, 32));
const sPh = await mkT(D.search, 13, 400, C.t3, screen);
pos(sPh, 50, 88 + vc(sPh.height, 32));
const scan = await mkIcon('solar:scanner-outline', 22, C.white, screen);
pos(scan, 375 - 16 - 22, 88 + vc(22, 32));

// ─── ② 金刚区（白卡浮在 Hero 上，2 行 × 5 列） ───
let y = 180;
const entryCard = mkInsetCard('金刚区', 174, screen);
pos(entryCard, 16, y);
const cellW = 343 / 5;
for (let i = 0; i < D.entries.length; i++) {
  const cx0 = (i % 5) * cellW, cy0 = Math.floor(i / 5) * 87;
  const ic = await mkIcon(D.entries[i].icon, 44, C.primary, entryCard);
  pos(ic, cx0 + (cellW - 44) / 2, cy0 + 14);
  const lb = await mkT(D.entries[i].label, 10, 400, C.t2, entryCard);
  pos(lb, cx0 + (cellW - lb.width) / 2, cy0 + 62);
}
y += 174 + GAP;

// ─── ③ 营销位 ───
const market = mkInsetCard('邻里好福利', 180, screen);
pos(market, 16, y);
const mTitle = await mkT(D.market.title, 17, 600, C.t1, market);
pos(mTitle, 16, 16);
const mSub = await mkT(D.market.sub, 12, 400, C.t3, market);
pos(mSub, 16, 16 + mTitle.height + 4);
for (let i = 0; i < 2; i++) {
  const tile = mkF('MarketTile' + i, 152, 100, C.gray2, true, market);
  pos(tile, 16 + i * 160, 64);
  const mt = await mkImage('https://picsum.photos/seed/market' + i + '/304/200', 152, 100, 8, tile);
  pos(mt, 0, 0);
}
y += 180 + GAP;

// ─── ④ 活动横幅 ───
const banner = mkF('Banner', 343, 113, C.gray2, true, screen);
pos(banner, 16, y);
banner.cornerRadius = 12;
const bnImg = await mkImage(D.banner.img, 343, 113, 12, banner);
pos(bnImg, 0, 0);
const bTitle = await mkT(D.banner.title, 15, 600, C.white, banner);
pos(bTitle, 16, 20);
const bSub = await mkT(D.banner.sub, 11, 400, C.white, banner);
pos(bSub, 16, 20 + bTitle.height + 4);
const cta = mkR(62, 24, C.primary, 12, banner);
pos(cta, 16, 113 - 16 - 24);
const ctaT = await mkT(D.banner.cta, 11, 600, C.white, banner);
pos(ctaT, 16 + (62 - ctaT.width) / 2, 113 - 16 - 24 + vc(ctaT.height, 24));
y += 113 + GAP + 4;

// ─── ⑤ 商品流（双列） ───
const streamTitle = await mkT('凤凰严选 · 为你推荐', 16, 600, C.t1, screen);
pos(streamTitle, 16, y);
y += streamTitle.height + 12;

const cardW = (375 - 32 - 8) / 2;
for (let i = 0; i < D.goods.length; i++) {
  const g = D.goods[i];
  const col = i % 2, row = Math.floor(i / 2);
  const cx0 = 16 + col * (cardW + 8), cy0 = y + row * 268;
  const card = mkF('GoodsCard' + i, cardW, 256, C.white, true, screen);
  pos(card, cx0, cy0);
  card.cornerRadius = 8;
  const gImg = await mkImage('https://picsum.photos/seed/goods' + i + '/360/360', cardW, cardW, 0, card);
  pos(gImg, 0, 0);
  const nm = await mkTW(g.name, 13, 400, C.t1, cardW - 20, 18, card);
  pos(nm, 10, cardW + 10);
  const pr = await mkT('¥' + g.price, 18, 600, C.primary, card);
  pos(pr, 10, cardW + 10 + nm.height + 6);
  const or = await mkT('¥' + g.origin, 12, 400, C.t3, card);
  pos(or, 10 + pr.width + 4, cardW + 10 + nm.height + 6 + (pr.height - or.height));
  // 预估佣金双段胶囊（终稿实测样式）
  const cTag = await mkDuoTag('预估佣金', g.commission, card);
  pos(cTag, 10, cardW + 10 + nm.height + 6 + pr.height + 6);
  // 「抢」
  const grab = mkR(46, 22, C.primary, 11, card);
  pos(grab, cardW - 10 - 46, cardW + 10 + nm.height + 6 + 4);
  const gTx = await mkT('抢', 11, 600, C.white, card);
  pos(gTx, grab.x + (46 - gTx.width) / 2, grab.y + vc(gTx.height, 22));
}
y += 268 * 2 + GAP;

// ─── ⑥ 底部标签栏（距底 84） ───
const TAB_H = 84;
screen.resize(375, Math.max(1424, y + TAB_H));
const tabY = screen.height - TAB_H;
const tab = mkF('TabBar', 375, TAB_H, C.white, true, screen);
pos(tab, 0, tabY);
pos(mkDivFull(tab), 0, 0);
const tabs = [
  { icon:'solar:home-smile-bold',     label:'首页',  on:true  },
  { icon:'solar:compass-outline',     label:'圈子',  on:false },
  { icon:'solar:cart-large-2-outline',label:'购物车',on:false },
  { icon:'solar:user-outline',        label:'我的',  on:false },
];
for (let i = 0; i < tabs.length; i++) {
  const t = tabs[i], tx0 = i * 93.75;
  const ic = await mkIcon(t.icon, 24, t.on ? C.primary : C.t3, tab);
  pos(ic, tx0 + (93.75 - 24) / 2, 10);
  const lb = await mkT(t.label, 10, t.on ? 600 : 400, t.on ? C.primary : C.t3, tab);
  pos(lb, tx0 + (93.75 - lb.width) / 2, 38);
}
