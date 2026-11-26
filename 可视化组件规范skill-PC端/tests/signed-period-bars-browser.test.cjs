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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/本期与同期正负柱-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const chart=page.locator('.yk-signed-period').first();
  const zero=Number((await chart.locator('[data-period-zero]').getAttribute('d')).match(/ ([\d.]+)H/)[1]);
  const negative=chart.locator('[data-signed-period="1"] [data-period-series="current"]');
  const positive=chart.locator('[data-signed-period="1"] [data-period-series="previous"]');
  assert.equal(Number(await negative.getAttribute('y')),zero);
  assert.ok(Math.abs(Number(await positive.getAttribute('y'))+Number(await positive.getAttribute('height'))-zero)<.001);
  await chart.locator('[data-signed-select]').selectOption('1');
  assert.deepEqual(await chart.locator('tbody tr:visible td').allTextContents(),['−40万元','20万元','−60万元']);
  await chart.locator('[data-signed-previous]').uncheck();
  assert.ok(await positive.isHidden());
  assert.equal(Number((await chart.locator('[data-period-zero]').getAttribute('d')).match(/ ([\d.]+)H/)[1]),zero);
  const edge=page.locator('.yk-signed-period').last();
  await edge.locator('[data-signed-select]').selectOption('1');
  assert.deepEqual(await edge.locator('tbody tr:visible td').allTextContents(),['0万元','—','—']);
  assert.equal(await edge.locator('[data-signed-period="1"] [data-period-series]').count(),0);
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: both signs use one baseline, period selection, stable scale with comparison hidden, no network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
