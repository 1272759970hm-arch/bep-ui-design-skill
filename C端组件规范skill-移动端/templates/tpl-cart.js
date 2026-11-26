// ===== 模板 04 · 购物车 =====
// 用法：先粘 scripts/preamble.js 全文，再替换 "# 在此填入页面代码"
// 结构依据：templates/04-cart.md（终稿 375×1245）

const D = {
  stores: [
    {
      name: '凤凰严选·社区店',
      shopTag: { t:'自营', kind:'shop:brand' },     // 店铺标签：自营/官方 shop:brand；入驻 shop:join
      svcTag:  { t:'极速达', kind:'service:blue' },  // 服务标签：快递代发 green / 门店履约 blue
      coupon: '领券',
      items: [
        { name:'茅凤凰庄园赤霞珠干红葡萄酒 老藤精酿', spec:'单瓶装 · 750ml', price:'247', qty:1, checked:true, promo:{ t:'满199减20', kind:'promo:red' } },
        { name:'邻里家宴礼盒 传统馅饼家庭装', spec:'家庭装 · 8 只', price:'68', qty:1, checked:true },
      ],
    },
    {
      name: '黔味坊·官方旗舰店',
      shopTag: { t:'入驻', kind:'shop:join' },
      svcTag:  { t:'快递邮', kind:'service:green' },
      coupon: null,
      items: [
        { name:'品质纯钛保温杯1L 316不锈钢', spec:'银色 · 1L', price:'41.9', qty:2, checked:false, promo:{ t:'立省¥22', kind:'promo:red' } },
      ],
    },
  ],
  discount: '已优惠 ¥20（满199减20）',
  total: '247',
  checkedCount: 2,
};

const screen = mkF('购物车', 375, 812, C.bg, true);
pos(screen, 0, 0);

// ─── ① 顶栏 ───
await mkTopBar({ title:'购物车', showBack:false, showMore:false }, screen);
const edit = await mkT('编辑', 14, 400, C.t2, screen);
pos(edit, 375 - 16 - edit.width, 44 + vc(edit.height, 46));

let y = 88 + 12;

// ─── ② 门店分组 ───
for (let s = 0; s < D.stores.length; s++) {
  const store = D.stores[s];
  const cardH = 52 + store.items.length * 120 + 8;
  const card = mkInsetCard('StoreCard' + s, cardH, screen);
  pos(card, 16, y);

  // 组头（应用规范 1164:2725）：复选 → 8 → 店铺标签 → 2 → 门店名 → 4 → 服务标签 ｜ 右侧领券
  const headCk = mkCheck(true, card, 20);
  pos(headCk, 14, 16);
  let hx = 14 + 20 + 8;
  const shopTag = await mkTag(store.shopTag.t, store.shopTag.kind, card);
  pos(shopTag, hx, 17);
  hx += shopTag.width + 2;
  const sName = await mkT(store.name, 14, 600, C.t1, card);
  pos(sName, hx, 16);
  hx += sName.width + 4;
  if (store.svcTag) {
    const svcTag = await mkTag(store.svcTag.t, store.svcTag.kind, card);
    pos(svcTag, hx, 17);
  }
  if (store.coupon) {
    const cp = await mkT(store.coupon, 12, 500, C.primary, card);
    pos(cp, 343 - 14 - cp.width, 17);
  }

  // 商品行
  for (let i = 0; i < store.items.length; i++) {
    const it = store.items[i], iy = 52 + i * 120;
    const itCk = mkCheck(it.checked, card, 20);
    pos(itCk, 14, iy + vc(20, 88));
    await mkImage('https://picsum.photos/seed/cart' + s + i + '/176/176', 88, 88, 8, card);
    const img = card.children[card.children.length - 1];
    pos(img, 42, iy);
    const nm = await mkTW(it.name, 13, 400, C.t1, 195, 18, card);
    pos(nm, 142, iy);
    const sp = await mkT(it.spec, 11, 400, C.t3, card);
    pos(sp, 142, iy + nm.height + 4);
    // 营销标签：规格行右侧同行，间隔 6（行高 88 内不再竖向堆叠）
    if (it.promo) {
      const pt = await mkTag(it.promo.t, it.promo.kind, card);
      pos(pt, 142 + sp.width + 6, iy + nm.height + 2);
    }
    const pr = await mkT('¥' + it.price, 14, 600, C.t1, card);
    pos(pr, 142, iy + 88 - pr.height);
    const step = await mkStepper(it.qty, card);
    pos(step, 343 - 14 - 79, iy + 88 - 27);
    if (i < store.items.length - 1) pos(mkCardDiv(card), 14, iy + 112);
  }
  y += cardH + 12;
}

// ─── ③ 猜你喜欢 ───
const guessTitle = await mkT('猜你喜欢', 16, 600, C.t1, screen);
pos(guessTitle, 16, y);
y += guessTitle.height + 12;
const cardW = (375 - 32 - 8) / 2;
for (let i = 0; i < 2; i++) {
  const card = mkF('GuessCard' + i, cardW, 240, C.white, true, screen);
  pos(card, 16 + i * (cardW + 8), y);
  card.cornerRadius = 8;
  const gi = await mkImage('https://picsum.photos/seed/guess' + i + '/360/360', cardW, cardW, 0, card);
  pos(gi, 0, 0);
  const nm = await mkTW(i === 0 ? '当季黄金奶油富士 5斤装' : '鲜榨胡萝卜汁 300ml×6瓶', 13, 400, C.t1, cardW - 20, 18, card);
  pos(nm, 10, cardW + 10);
  const pr = await mkT(i === 0 ? '¥78.0' : '¥35.5', 18, 600, C.primary, card);
  pos(pr, 10, cardW + 10 + nm.height + 6);
}
y += 240 + 12;

// ─── ④ 结算栏（贴底，含 34 安全区） ───
const BAR_H = 140;
screen.resize(375, Math.max(1245, y + BAR_H));
const bar = mkF('SettleBar', 375, BAR_H, C.white, true, screen);
pos(bar, 0, screen.height - BAR_H);
pos(mkDivFull(bar), 0, 0);

const allCk = mkCheck(true, bar, 20);
pos(allCk, 16, 14 + vc(20, 40));
const allT = await mkT('全选', 13, 400, C.t2, bar);
pos(allT, 42, 14 + vc(allT.height, 40));

const lb = await mkT('合计', 13, 400, C.t2, bar);
pos(lb, 130, 14 + 4);
const yen = await mkT('¥', 14, 600, C.primary, bar);
pos(yen, lb.x + lb.width + 6, 14 + 2);
const amt = await mkT(D.total, 20, 600, C.primary, bar);
pos(amt, yen.x + yen.width, 14);
const dis = await mkT(D.discount, 11, 400, C.danger, bar);
pos(dis, 130, 44);

const settle = await mkBtn('结算(' + D.checkedCount + ')', 'primary', 126, bar);
pos(settle, 375 - 16 - 126, 14);
