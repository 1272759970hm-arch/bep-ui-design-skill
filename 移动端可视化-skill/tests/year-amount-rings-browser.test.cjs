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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/预存小金额环-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const modules=page.locator('.yk-year-amount-module');
  const composition=modules.first();
  assert.equal(await composition.locator('.yk-year-amount-ring strong').innerText(),'994.6亿元');
  assert.deepEqual(await composition.locator('dd small').allTextContents(),['44.69%','55.31%']);
  assert.deepEqual(await composition.locator('[data-amount-arc]').evaluateAll(paths=>paths.map(path=>getComputedStyle(path).stroke)),await composition.locator('dt i').evaluateAll(items=>items.map(item=>getComputedStyle(item).backgroundColor)));
  assert.equal(await modules.nth(1).locator('.yk-year-amount-ring strong').innerText(),'100万元');
  assert.equal(await modules.nth(2).locator('.yk-year-amount-ring strong').innerText(),'0万元');
  assert.equal(await modules.nth(3).locator('.yk-year-amount-ring strong').innerText(),'—');
  assert.equal(await modules.nth(3).locator('dd').first().innerText(),'16万元—');
  assert.equal(await modules.nth(2).locator('[data-amount-arc]').count(),0);
  assert.equal(await modules.nth(3).locator('[data-amount-arc]').count(),0);
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: proportions and independent totals, matched arcs and legend, zero and incomplete data, no network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
