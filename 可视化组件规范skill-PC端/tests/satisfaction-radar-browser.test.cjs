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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/满意度雷达-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const five=page.locator('[data-dimensions="5"]');
  assert.equal(await five.locator('polygon[data-satisfaction-shape]').count(),3);
  assert.deepEqual(await five.locator('dl:visible dd').allTextContents(),['79.42%','94%','76.5%']);
  await five.locator('[data-satisfaction-axis="2"]').click();
  assert.deepEqual(await five.locator('dl:visible dd').allTextContents(),['88.5%','96%','80.1%']);
  const six=page.locator('[data-dimensions="6"]');
  assert.match(await six.evaluate(node=>getComputedStyle(node).backgroundImage),/data:image\/svg\+xml;base64/);
  const partial=six.locator('path[data-satisfaction-shape="current"]');
  const path=await partial.getAttribute('d');
  assert.equal((path.match(/M/g)||[]).length,4);
  assert.equal(await six.locator('polygon[data-satisfaction-shape="current"]').count(),0);
  await six.locator('[data-satisfaction-axis="5"]').click();
  assert.equal(await six.locator('[data-satisfaction-value].is-current dd').textContent(),'—');
  assert.ok(await page.locator('[data-satisfaction-axis]').evaluateAll(labels=>labels.every(label=>label.scrollWidth<=label.clientWidth)));
  assert.ok(await page.locator('.phone').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth)));
  if(process.env.YIKAN_RADAR_SCREENSHOT)await page.screenshot({path:process.env.YIKAN_RADAR_SCREENSHOT,fullPage:true});
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: 5D benchmarks, 6D missing-axis gap, embedded original background, selection, wrapped labels and zero network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
