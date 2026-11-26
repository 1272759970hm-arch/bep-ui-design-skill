const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.YIKAN_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:780},offline:true});
  const errors=[],requests=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))requests.push(request.url());});
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/主页头部-离线交互.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  const headers=page.locator('.yk-home-header');
  const first=headers.first();
  const rail=first.locator('.yk-home-org-rail');
  assert.match(await rail.evaluate(node=>getComputedStyle(node,'::before').backgroundImage),/data:image\/svg\+xml;base64/);
  const peers=rail.locator('.yk-home-peers');
  assert.ok(await peers.evaluate(node=>node.scrollWidth>node.clientWidth));
  await peers.getByRole('button',{name:'潮州碧桂园西区'}).click();
  assert.equal(await rail.locator('[data-home-selected]').textContent(),'潮州碧桂园西区');
  assert.deepEqual(await peers.getByRole('button').allTextContents(),['安庆碧桂园','紫蓝湾一期','清溪花园']);
  await first.getByRole('button',{name:'搜索组织'}).click();
  await page.getByRole('searchbox').fill('潮州西区');
  await page.getByRole('button',{name:/^潮州西区一期/}).click();
  assert.equal(await rail.locator('[data-home-selected]').textContent(),'潮州西区一期');
  assert.equal(await peers.count(),0);
  assert.equal(await headers.last().locator('.yk-home-peers').count(),0);
  assert.deepEqual(errors,[]);
  assert.deepEqual(requests,[]);
  console.log('320px offline: native organization surface, peer scroll, selection and search passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
