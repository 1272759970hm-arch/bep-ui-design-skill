const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.YIKAN_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const url=pathToFileURL(resolve(__dirname,'../assets/offline/项目主页-离线交互.html')).href;
  for(const width of [320,375]){
   const page=await browser.newPage({viewport:{width,height:812},offline:true});
   const errors=[],requests=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('request',request=>{if(/^https?:/.test(request.url()))requests.push(request.url());});
   await page.goto(url);
   assert.match(await page.locator('.yk-home-brand').evaluate(node=>getComputedStyle(node).backgroundImage),/data:image\/png;base64/);
   assert.match(await page.locator('[aria-current="page"] .yk-home-tab-image').evaluate(node=>getComputedStyle(node).backgroundImage),/data:image\/svg\+xml;base64/);
   const home=page.locator('[data-home-content]');
   const income=home.locator('[data-source="6671:164095"]');
   assert.equal(await home.locator('[data-performance-value]').first().textContent(),'9.98亿元');
   assert.match(await income.evaluate(node=>getComputedStyle(node).backgroundImage),/data:image\/svg\+xml;base64/);
   assert.match(await home.locator('.yk-home-highlight').textContent(),/86\.56%/);
   await page.getByRole('button',{name:'潮州碧桂园西区'}).click();
   assert.equal(await home.locator('[data-performance-value]').textContent(),'6.52亿元');
   assert.match(await home.locator('.yk-home-project-info').textContent(),/187402㎡/);
   await page.getByRole('button',{name:'搜索组织'}).click();
   await page.getByRole('searchbox').fill('潮州西区一期');
   await page.getByRole('button',{name:/^潮州西区一期/}).click();
   assert.equal(await home.textContent(),'暂无指标数据');
   await page.getByRole('button',{name:'搜索组织'}).click();
   await page.getByRole('searchbox').fill('安庆碧桂园');
   await page.getByRole('button',{name:/^安庆碧桂园/}).click();
   assert.equal(await home.locator('[data-performance-value]').first().textContent(),'9.98亿元');
   assert.ok(await page.locator('.phone').evaluate(node=>node.scrollWidth<=node.clientWidth));
   assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
   await page.evaluate(()=>document.addEventListener('yikan:navigationchange',event=>window.lastNav=event.detail));
   const nav=page.locator('[data-component="home-navigation"]');
   await nav.getByRole('button',{name:'指标',exact:true}).click();
   assert.equal(await nav.getByRole('button',{name:'指标',exact:true}).getAttribute('aria-current'),'page');
   assert.deepEqual(await page.evaluate(()=>window.lastNav),{index:1,name:'指标'});
   await nav.getByRole('button',{name:'我的',exact:true}).click();
   assert.equal(await nav.getByRole('button',{name:'我的',exact:true}).getAttribute('aria-current'),'page');
   await nav.getByRole('button',{name:'首页',exact:true}).click();
   const phone=page.locator('.phone');
   await phone.evaluate(node=>node.scrollTop=node.scrollHeight);
   assert.ok(await phone.evaluate(node=>{
    const last=node.querySelector('[data-home-content]').lastElementChild.getBoundingClientRect();
    const nav=node.querySelector('.yk-home-bottom').getBoundingClientRect();
    return last.bottom<=nav.top;
   }));
   await phone.screenshot({path:resolve(__dirname,'../assets/offline/项目主页-底部核对.png')});
   assert.deepEqual(errors,[]);
   assert.deepEqual(requests,[]);
   await page.close();
  }
  console.log('320px and 375px offline: scoped project data, missing state and restoration passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
