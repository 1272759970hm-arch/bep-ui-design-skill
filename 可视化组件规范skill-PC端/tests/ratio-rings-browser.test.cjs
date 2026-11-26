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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/独立比率单环与多环-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const cards=page.locator('.yk-ratio-rings');
  const single=cards.first();
  assert.equal(await single.locator('[data-ratio-value]').textContent(),'82.68%');
  assert.deepEqual(await single.locator('dd').allTextContents(),['463户','560户']);
  const multi=cards.nth(1);
  await multi.locator('[data-ratio-select="1"]').click();
  assert.equal(await multi.locator('[data-ratio-value]').textContent(),'90%');
  assert.deepEqual(await multi.locator('[data-ratio-panel]:visible dd').allTextContents(),['72万元','80万元']);
  assert.equal(await multi.locator('[data-ratio-track].is-current').getAttribute('data-ratio-track'),'1');
  assert.equal(await multi.locator('[data-ratio-fill]').count(),3);
  const edge=cards.last();
  assert.equal(await edge.locator('[data-ratio-value]').textContent(),'120%');
  await edge.locator('[data-ratio-select="1"]').click();
  assert.equal(await edge.locator('[data-ratio-value]').textContent(),'-10%');
  assert.equal(await edge.locator('[data-ratio-track="1"] [data-ratio-fill]').count(),0);
  assert.equal(await edge.locator('[data-ratio-overflow="0"]').count(),1);
  assert.equal(await edge.locator('[data-ratio-overflow="0"]').getAttribute('stroke-opacity'),'.36');
  await edge.locator('[data-ratio-select="2"]').click();
  assert.equal(await edge.locator('[data-ratio-value]').textContent(),'—');
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: independent scaling, selection and detailed bases, negative/over-limit/zero-denominator, no network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
