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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/基础柱与分组柱-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const basic=page.locator('[data-source="6695:315115"]');
  assert.equal(await basic.locator('[data-category-column]').count(),6);
  await basic.locator('[data-category-column-group="2"] [data-category-column]').click();
  assert.equal(await basic.locator('select').inputValue(),'2');
  assert.equal(await basic.locator('dl:visible dd').textContent(),'67%');
  const grouped=page.locator('[data-source="6695:315240"]');
  assert.deepEqual(await grouped.locator('dl:visible dd').allTextContents(),['80万元','50万元','0万元']);
  await grouped.locator('select').selectOption('2');
  assert.deepEqual(await grouped.locator('dl:visible dd').allTextContents(),['65万元','—','31万元']);
  assert.equal(await grouped.locator('[data-category-column-group].is-current').getAttribute('data-category-column-group'),'2');
  assert.equal(await grouped.locator('[data-category-column-group].is-current [data-category-column]').count(),2);
  const bottoms=await grouped.locator('[data-category-column]').evaluateAll(nodes=>nodes.map(node=>+node.getAttribute('y')+(+node.getAttribute('height'))));
  assert.ok(bottoms.every(y=>Math.abs(y-156)<.0001));
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: basic and grouped variants, point selection, shared zero, zero/missing, no overflow or network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
