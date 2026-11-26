// ===== 模板 07 · 底部弹层（购买弹窗） =====
// 用法：先粘 scripts/preamble.js 全文，再替换 "# 在此填入页面代码"
// 结构依据：templates/07-sheet.md（终稿 375×812，sheet 从 y=512 起，高 300）

const D = {
  product: { name:'茅凤凰庄园赤霞珠干红葡萄酒 老藤精酿', price:'35.5', commission:'¥4.4' },
  specs: [{ t:'单瓶装', on:true }, { t:'双瓶礼盒', on:false }, { t:'宴请整箱', on:false }],
  qty: 3,
  cta: '加入购物车',
  ctaType: 'outline',   // 购买弹窗用 outline；加购面板改 'primary' + cta:'立即支付 ¥399'
};

const screen = mkF('购买弹窗', 375, 812, C.bg, true);
pos(screen, 0, 0);

// ─── ① 背景页（简化占位，实际应保留原页面） ───
const bgShot = mkF('BackgroundPage', 375, 812, C.bg, true, screen);
pos(bgShot, 0, 0);
const ph = await mkT('（背景页面：详情页/加购页）', 13, 400, C.t4, bgShot);
pos(ph, cx(ph, 375), 300);

// ─── ② 遮罩 ───
const mask = mkR(375, 812, { r:0, g:0, b:0 }, 0, screen);
mask.fills = [{ type:'SOLID', color:{ r:0, g:0, b:0 }, opacity:0.4 }];
pos(mask, 0, 0);

// ─── ③ 弹层 ───
const SHEET_H = 300, SHEET_Y = 812 - SHEET_H;
const sheet = mkF('Sheet', 375, SHEET_H, C.white, true, screen);
pos(sheet, 0, SHEET_Y);
sheet.topLeftRadius = 16;
sheet.topRightRadius = 16;

// 商品摘要行
const thumb = await mkImage('https://picsum.photos/seed/sheet1/176/176', 88, 88, 8, sheet);
pos(thumb, 16, 16);
const price = await mkT('¥' + D.product.price, 20, 600, C.primary, sheet);
pos(price, 118, 16);
// 佣金：双段胶囊（左深底「预估佣金」+ 右浅底金额）
const cm = await mkDuoTag('预估佣金', D.product.commission, sheet);
pos(cm, 118, 46);
const chosen = await mkT('已选：' + D.specs.filter(s => s.on).map(s => s.t).join(' / '), 12, 400, C.t3, sheet);
pos(chosen, 118, 70);
const close = await mkIcon('solar:close-circle-outline', 16, C.t3, sheet);
pos(close, 375 - 16 - 16, 16);

// 规格区
const specLb = await mkT('规格', 13, 600, C.t1, sheet);
pos(specLb, 16, 116);
const chipWrap = mkF('ChipWrap', 343, 34, null, false, sheet);
pos(chipWrap, 16, 144);
await mkTagGroup(D.specs.map(s => ({ text: s.t, selected: s.on })), 343, chipWrap);

// 数量区
const qtyLb = await mkT('数量', 13, 600, C.t1, sheet);
pos(qtyLb, 16, 196);
const step = await mkStepper(D.qty, sheet);
pos(step, 375 - 16 - 79, 190);

// 动作按钮
const cta = await mkBtn(D.cta, D.ctaType, D.ctaType === 'primary' ? 351 : 106, sheet);
pos(cta, D.ctaType === 'primary' ? 12 : 16, 240);
if (D.ctaType !== 'primary') {
  const tip = await mkT('库存紧张', 11, 400, C.danger, sheet);
  pos(tip, 130, 240 + vc(tip.height, 40));
}
