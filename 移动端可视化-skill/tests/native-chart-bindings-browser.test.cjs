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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/阶段转化与现金流-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const stage=page.locator('[data-component="stage-conversion"]');
  const stageHeights=await stage.locator('svg rect').evaluateAll(bars=>bars.map(bar=>Number(bar.getAttribute('height'))));
  [162,129.6,38.88].forEach((height,index)=>assert.ok(Math.abs(stageHeights[index]-height)<1e-8));
  assert.deepEqual(await stage.locator('figcaption b').allTextContents(),['80%','30%','24%']);
  const cashflow=page.locator('[data-component="cashflow-inline"]');
  const geometry=await cashflow.locator('.yk-cashflow-track').evaluateAll(tracks=>tracks.filter(track=>track.querySelector('i')).map(track=>{
   const box=track.getBoundingClientRect(),bar=track.querySelector('i').getBoundingClientRect();
   return {half:box.width/2,width:bar.width,side:track.firstElementChild.dataset.direction,delta:bar.left-box.left-box.width/2,end:bar.right-box.left-box.width/2};
  }));
  assert.ok(Math.abs(geometry[0].width-geometry[0].half*(60/90))<1);
  assert.ok(Math.abs(geometry[0].delta)<1);
  assert.ok(Math.abs(geometry[4].width-geometry[4].half/3)<1);
  assert.ok(Math.abs(geometry[4].end)<1);
  assert.equal(geometry[4].side,'negative');
  assert.equal(await cashflow.locator('[data-sign="zero"]').innerText(),'0万元');
  assert.equal(await cashflow.locator('[data-sign="missing"]').innerText(),'—');
  assert.equal(await cashflow.locator(':is([data-direction="zero"],[data-direction="missing"]) i').count(),0);
  assert.ok(await page.locator('.phone').evaluateAll(phones=>phones.every(phone=>phone.scrollWidth<=phone.clientWidth)));
  if(process.env.YIKAN_CHART_SCREENSHOT)await page.screenshot({path:process.env.YIKAN_CHART_SCREENSHOT,fullPage:true});
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline browser check: stage heights and rates, signed geometry around zero, missing and zero amounts, no network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
