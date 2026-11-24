// ===== 模板 05 · 确认订单 =====
// 用法：先粘 scripts/preamble.js 全文，再替换 "# 在此填入页面代码"
// 结构依据：templates/05-checkout.md（终稿 375×902 / 1144 / 1211 / 1254）

const D = {
  address: { name:'王先生', phone:'138****8888', detail:'华南碧桂园 3栋2单元 1802 室' },
  seg: ['送货上门', '到店自提'],
  segActive: 0,
  store: { name:'凤凰严选·社区店', shopTag:{ t:'自营', kind:'shop:brand' }, svcTag:{ t:'极速达', kind:'service:blue' } },
  items: [
    { name:'茅凤凰庄园赤霞珠干红葡萄酒 老藤精酿', spec:'单瓶装 · 750ml', price:'247.81', qty:2 },
    { name:'邻里家宴礼盒 传统馅饼家庭装',         spec:'家庭装 · 8 只',  price:'68.00',  qty:2 },
  ],
  fees: [
    { k:'商品合计', v:'¥315.81' },
    { k:'配送费',   v:'¥0.00' },
    { k:'优惠',     v:'-¥68.00', danger:true },
  ],
  payable: '247.81',
};

const screen = mkF('确认订单', 375, 812, C.bg, true);
pos(screen, 0, 0);

// ─── ① 顶栏 ───
await mkTopBar({ title:'确认订单', showMore:false }, screen);

// ─── ② 收货地址 ───
let y = 88 + 12;
const addrH = 92;
const addr = mkF('Address', 375, addrH, C.white, true, screen);
pos(addr, 0, y);
const aName = await mkT(D.address.name, 15, 600, C.t1, addr);
pos(aName, 16, 18);
const aPhone = await mkT(D.address.phone, 13, 400, C.t2, addr);
pos(aPhone, 16 + aName.width + 8, 20);
const aDetail = await mkTW(D.address.detail, 13, 400, C.t2, 300, 20, addr);
pos(aDetail, 16, 46);
const aArrow = await mkIcon('solar:alt-arrow-right-outline', 16, C.t4, addr);
pos(aArrow, 375 - 16 - 16, vc(16, addrH - 6));
// 底部花色分隔条（品牌装饰：主色斜纹）
const stripe = mkR(375, 3, C.primary, 0, addr);
pos(stripe, 0, addrH - 3);
const ga = (c) => ({ r:c.r, g:c.g, b:c.b, a:1 });  // 渐变 stops 必须带 alpha
stripe.fills = [{ type:'GRADIENT_LINEAR', gradientStops:[
  { position:0, color:ga(C.primary) }, { position:.5, color:ga(C.warning) }, { position:1, color:ga(C.primary) },
], gradientTransform:[[1,0,0],[0,1,0]] }];
y += addrH + 8;

// ─── ③ 配送方式分段控件 ───
const seg = await mkSeg(D.seg, D.segActive, screen);
pos(seg, 0, y);
y += 50 + 8;

// ─── ④ 商品清单 ───
const storeH = 48 + D.items.length * 96 + 8;
const storeCard = mkInsetCard('StoreCard', storeH, screen);
pos(storeCard, 16, y);
const shopTag = await mkTag(D.store.shopTag.t, D.store.shopTag.kind, storeCard);
pos(shopTag, 14, 16);
const sName = await mkT(D.store.name, 13, 600, C.t1, storeCard);
pos(sName, 14 + shopTag.width + 2, 15);
if (D.store.svcTag) {
  const svcTag = await mkTag(D.store.svcTag.t, D.store.svcTag.kind, storeCard);
  pos(svcTag, 14 + shopTag.width + 2 + sName.width + 4, 16);
}
for (let i = 0; i < D.items.length; i++) {
  const it = D.items[i], iy = 48 + i * 96;
  const thumb = await mkImage('https://picsum.photos/seed/co' + i + '/128/128', 64, 64, 8, storeCard);
  pos(thumb, 14, iy + 8);
  const nm = await mkTW(it.name, 13, 400, C.t1, 190, 18, storeCard);
  pos(nm, 90, iy + 6);
  const sp = await mkT(it.spec, 11, 400, C.t3, storeCard);
  pos(sp, 90, iy + nm.height + 10);
  const pr = await mkT('¥' + it.price, 13, 600, C.t1, storeCard);
  pos(pr, 90, iy + 64);
  const qty = await mkT('×' + it.qty, 12, 400, C.t3, storeCard);
  pos(qty, 343 - 14 - qty.width, iy + 64);
  if (i < D.items.length - 1) pos(mkCardDiv(storeCard), 14, iy + 88);
}
y += storeH + 8;

// ─── ⑤ 费用明细 ───
const feeH = 16 + D.fees.length * 34 + 8;
const feeCard = mkInsetCard('FeeCard', feeH, screen);
pos(feeCard, 16, y);
for (let i = 0; i < D.fees.length; i++) {
  const f = D.fees[i], fy = 16 + i * 34;
  const k = await mkT(f.k, 13, 400, C.t2, feeCard);
  pos(k, 14, fy);
  const v = await mkT(f.v, 13, f.danger ? 400 : 500, f.danger ? C.danger : C.t1, feeCard);
  pos(v, 343 - 14 - v.width, fy);
}
y += feeH + 8;

// ─── ⑥ 备注 / 发票 ───
const rows = [{ k:'订单备注', v:'选填，可备注口味/送达时间' }, { k:'发票信息', v:'不开发票' }];
const noteCard = mkF('ExtraCard', 375, rows.length * 50, C.white, true, screen);
pos(noteCard, 0, y);
for (let i = 0; i < rows.length; i++) {
  const ry = i * 50;
  const k = await mkT(rows[i].k, 14, 400, C.t1, noteCard);
  pos(k, 16, ry + vc(k.height, 50));
  const v = await mkT(rows[i].v, 13, 400, C.t3, noteCard);
  pos(v, 375 - 16 - 14 - v.width, ry + vc(v.height, 50));
  const ar = await mkIcon('solar:alt-arrow-right-outline', 14, C.t4, noteCard);
  pos(ar, 375 - 16 - 14, ry + vc(14, 50));
  if (i < rows.length - 1) pos(mkDiv(noteCard), 16, ry + 49.5);
}
y += noteCard.height + 8;

// ─── ⑦ 底栏：实付款 + 提交订单 ───
const BAR_H = 98;
screen.resize(375, Math.max(902, y + BAR_H));
const bar = mkF('BottomWrap', 375, BAR_H, C.white, true, screen);
pos(bar, 0, screen.height - BAR_H);
pos(mkDivFull(bar), 0, 0);

const payLb = await mkT('实付款', 12, 400, C.t2, bar);
pos(payLb, 16, 16);
const yen = await mkT('¥', 14, 600, C.primary, bar);
pos(yen, 16, 38);
const amt = await mkT(D.payable, 20, 600, C.primary, bar);
pos(amt, 16 + yen.width, 34);

const submit = await mkBtn('提交订单', 'primary', 126, bar);
pos(submit, 375 - 16 - 126, 14);
