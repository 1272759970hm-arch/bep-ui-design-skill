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
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/目标条与收费率-离线核对.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const geometry=await page.locator('.yk-target-track').evaluateAll(tracks=>tracks.map(track=>{
   const box=track.getBoundingClientRect();
   function center(selector){
    const marker=track.querySelector(selector).getBoundingClientRect();
    return (marker.x+marker.width/2-box.x)/box.width;
   }
   return [center('[data-actual-marker]'),center('[data-target-marker]')];
  }));
  const expected=[[0.564,1],[1,0.8]];
  geometry.forEach((pair,index)=>pair.forEach((value,marker)=>assert.ok(Math.abs(value-expected[index][marker])<0.001)));
  const charge=page.locator('.yk-charge-rate-target');
  assert.ok(await charge.evaluate(node=>getComputedStyle(node).backgroundImage.startsWith('url("data:image/svg+xml;base64,')));
  assert.deepEqual(await charge.locator('em').allTextContents(),['缺口 2.5 个百分点','缺口 12.7 个百分点']);
  await page.evaluate(()=>{
   document.querySelector('.screens').insertAdjacentHTML('beforeend',Yikan.chargeRateTarget({rows:[{name:'达标',actual:85,target:85},{name:'无数据',actual:null,target:90}]}));
  });
  assert.deepEqual(await page.locator('.yk-charge-rate-target').last().locator('em').allTextContents(),['已达到目标','—']);
  assert.ok(await page.locator('.phone').evaluateAll(phones=>phones.every(phone=>phone.scrollWidth<=phone.clientWidth)));
  if(process.env.YIKAN_TARGET_SCREENSHOT)await page.screenshot({path:process.env.YIKAN_TARGET_SCREENSHOT,fullPage:true});
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('320px offline: actual and target geometry, above target, percentage-point gaps, missing values, embedded SVG, no network.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
