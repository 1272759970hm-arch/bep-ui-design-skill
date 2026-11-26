const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.YIKAN_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:780},offline:true});
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/月份经营仪表-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const cards=page.locator('.yk-monthly-gauge');
  const card=cards.first(),view=card.locator('[data-gauge-panel]:visible');
  assert.equal(await view.locator('[data-gauge-month]').count(),12);
  assert.equal(await view.locator('[data-gauge-sector]').count(),3);
  assert.equal(await view.locator('[data-gauge-reference]').getAttribute('data-gauge-reference'),'0.93');
  assert.match(await view.locator('.yk-gauge-reference-value').textContent(),/军令状 46.5亿元/);
  assert.equal(await view.locator('[data-gauge-month="8"]').getAttribute('data-status'),'below');
  await card.locator('[data-gauge-select]').selectOption('9');
  assert.equal(await view.locator('[data-gauge-rate]').textContent(),'125%');
  assert.equal(await view.locator('[data-gauge-progress]').getAttribute('data-gauge-progress'),'100');
  assert.deepEqual((await view.locator('dd').allTextContents()).slice(0,2),['62.5亿元','50亿元']);
  await card.locator('[data-gauge-select]').selectOption('12');
  assert.equal(await view.locator('[data-gauge-rate]').textContent(),'—');
  assert.equal(await view.locator('[data-gauge-progress]').count(),0);
  const zero=cards.last().locator('[data-gauge-panel]:visible');
  assert.equal(await zero.locator('[data-gauge-rate]').textContent(),'—');
  assert.deepEqual((await zero.locator('dd').allTextContents()).slice(0,2),['-2亿元','0亿元']);
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: explicit month status, annual-target rate, above target, missing, zero target and zero network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
