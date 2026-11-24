const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require(process.env.YIKAN_PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:375,height:900}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 await page.goto('file://'+path.resolve(__dirname,'../assets/offline/环图十态-原件与绑定.html'));
 assert.equal(await page.locator('[data-component="native-ring-state"]').count(),10);
 assert.equal(await page.locator('[data-component="progress-ring"]').count(),5);
 assert.equal(await page.locator('[data-component="native-ring-state"] text').count(),0);
 assert.deepEqual(await page.evaluate(()=>window.yikanRenderErrors),[]);
 const overflow=await page.locator('.phone').evaluateAll(xs=>xs.map(x=>({width:x.clientWidth,scroll:x.scrollWidth})));assert.ok(overflow.every(x=>x.scroll<=x.width+1));
 await page.locator('.screen-wrap').nth(8).screenshot({path:path.resolve(__dirname,'../assets/offline/单环超百-原件与绑定核对.png')});
 await page.locator('.screen-wrap').nth(9).screenshot({path:path.resolve(__dirname,'../assets/offline/单环负值-原件与绑定核对.png')});
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const result={date:'2026-11-05',originalOutlinedStates:10,singleBindings:5,noExternalRequests:true,noPageErrors:true,phoneOverflow:overflow,note:'Native reference SVGs are exact exports. Dynamic bindings reuse original sample paths at the five known values; whole-component pixel parity is not asserted.'};fs.writeFileSync(path.resolve(__dirname,'rings-browser-validation.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
