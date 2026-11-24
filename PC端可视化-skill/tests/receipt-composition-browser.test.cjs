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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/三类实收构成环-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const cards=page.locator('.yk-receipt-composition');
  const first=cards.first();
  await first.locator('[data-receipt-category="1"]').click();
  assert.equal(await first.locator('[data-receipt-share]').textContent(),'25%');
  assert.equal(await first.locator('[data-receipt-selected-amount]').textContent(),'25万元');
  assert.equal(await first.locator('[data-receipt-selected-name]').textContent(),'追缴');
  assert.equal(await first.locator('[data-receipt-total]').textContent(),'100万元');
  assert.equal(await first.locator('[data-receipt-slice].is-current').getAttribute('data-receipt-slice'),'1');
  for(const [i,total] of [[1,'—'],[2,'0万元']]){
   const card=cards.nth(i);
   await card.locator('[data-receipt-category="1"]').click();
   assert.equal(await card.locator('[data-receipt-total]').textContent(),total);
   assert.equal(await card.locator('[data-receipt-share]').textContent(),'—');
   assert.equal(await card.locator('[data-receipt-slice]').count(),0);
  }
  assert.equal(await cards.nth(1).locator('[data-receipt-selected-amount]').textContent(),'20万元');
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: selection, total, share, missing/zero handling and zero network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
