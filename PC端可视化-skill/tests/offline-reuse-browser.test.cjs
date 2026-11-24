const {chromium}=require(process.env.YIKAN_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});
 try {
  const p=await b.newPage({viewport:{width:375,height:812},offline:true});
  const errors=[],external=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
  const go=async file=>{await p.goto(pathToFileURL(resolve(__dirname,'../assets/offline',file)).href);assert.deepEqual(await p.evaluate(()=>yikanRenderErrors),[]);};
  await go('主页与预警-离线核对.html');
  assert.equal(await p.locator('[data-home-layout]').count(),6);
  assert.equal(await p.locator('.yk-home-base').count(),1);
  const home=await p.locator('[data-home-layout]').evaluateAll(cards=>cards.map(c=>({h:c.offsetHeight,background:getComputedStyle(c).backgroundImage.startsWith('url("data:'),overflow:c.scrollWidth-c.clientWidth})));
  assert.deepEqual(home.map(c=>c.h),[178,92,176,92,92,92]);assert.ok(home.every(c=>c.background&&c.overflow<=2),JSON.stringify(home));
  const gradient=p.locator('[data-ranking-appearance]');
  assert.match(await gradient.evaluate(c=>getComputedStyle(c).backgroundImage),/57\.043px/);
  const rank=p.locator('.yk-warning-ranking');
  assert.deepEqual(await rank.locator(':scope > .yk-warning-scroll [data-warning-red-count]').allTextContents(),['2','1','1','0','—']);
  await rank.locator('[data-warning-dialog="fullscreen"]').click();
  const full=p.locator('dialog[data-warning-target="fullscreen"]');
  assert.ok(await full.isVisible());
  assert.ok(await full.locator('.yk-warning-scroll').evaluate(el=>{el.scrollLeft=999;return el.scrollLeft>0;}));
  await p.keyboard.press('Escape');await full.waitFor({state:'hidden'});
  await rank.locator('[data-warning-dialog="rules"]').click();
  const rules=p.locator('dialog[data-warning-target="rules"]');
  assert.ok(await rules.locator('img').evaluate(el=>el.complete&&el.naturalWidth===383&&el.naturalHeight===1250));
  assert.ok(await rules.locator('.yk-warning-rules-body').evaluate(el=>{el.scrollTop=999;return el.scrollTop>0;}));
  await rules.locator('[data-warning-close]').click();await rules.waitFor({state:'hidden'});
  await go('日期组织-离线交互.html');
  await p.locator('[data-date-open]').click();
  const months=p.locator('.yk-date-wheel').nth(1);
  await months.hover();await p.mouse.wheel(0,120);
  await p.waitForFunction(()=>document.querySelector('[data-date-field="month"][aria-selected="true"]')?.dataset.dateOption==='3');
  assert.match(await p.locator('.yk-date-control').getAttribute('data-value'),/"month":1/);
  await p.locator('[data-date-confirm]').click();
  assert.match(await p.locator('.yk-date-control').getAttribute('data-value'),/"month":3/);
  await go('两轮充电-离线六态.html');
  for(const width of [320,375,414]){
   await p.setViewportSize({width,height:812});
   await p.locator('.yk-actual-range').first().evaluate(range=>{
    const a=range.getBoundingClientRect(),b=range.lastElementChild.getBoundingClientRect(),style=getComputedStyle(range);
    if(Math.abs(a.right-b.right-parseFloat(style.paddingRight))>1)throw Error('收益段未对齐实际区末端');
   });
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('Offline browser: six homepage source layouts; detail ranking gradient; warning count, scroll, fullscreen and original rules; wheel draft and confirm; funding segment geometry at 320/375/414; no page errors or network.');
 } finally {await b.close();}
})().catch(e=>{console.error(e);process.exit(1);});
