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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/单曲线与多曲线-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const single=page.locator('[data-source="6695:314803"]');
  assert.deepEqual(await single.locator('tbody:visible td').allTextContents(),['70万元','65万元']);
  const guide=await single.locator('[data-curve-guide]').getAttribute('x1');
  assert.equal(((await single.locator('[data-curve-main]').getAttribute('d')).match(/M/g)||[]).length,2);
  await single.locator('[data-curve-hit="2"]').click();
  assert.equal(await single.locator('select').inputValue(),'2');
  assert.deepEqual(await single.locator('tbody:visible td').allTextContents(),['—','55万元']);
  assert.notEqual(await single.locator('[data-curve-guide]').getAttribute('x1'),guide);
  await single.locator('[data-curve-toggle]').uncheck();
  assert.ok(await single.locator('[data-curve-previous]').isHidden());
  assert.deepEqual(await single.locator('tbody:visible td').allTextContents(),['—','55万元']);
  const multi=page.locator('[data-source="6695:314937"]');
  assert.equal(await multi.locator('[data-curve-main]').count(),4);
  assert.equal(await multi.locator('[data-curve-toggle]').count(),0);
  await multi.locator('select').selectOption('6');
  assert.deepEqual(await multi.locator('tbody:visible td').allTextContents(),['113万元','56万元','27万元','30万元']);
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: single and multi shapes, selected point, comparisons, missing data and zero network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
