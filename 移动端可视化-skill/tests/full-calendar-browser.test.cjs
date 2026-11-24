const assert=require('node:assert/strict');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.YIKAN_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:375,height:812},offline:true});
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()))external.push(request.url());});
  await page.goto(pathToFileURL(resolve(__dirname,'../assets/offline/完整日历-离线交互.html')).href);
  assert.deepEqual(await page.evaluate(()=>yikanRenderErrors),[]);
  await page.evaluate(()=>{
   window.dates=[];
   document.addEventListener('yikan:datechange',event=>dates.push(event.detail.value));
  });
  const controls=page.locator('.yk-date-control');
  const dialog=page.locator('.yk-calendar-dialog');
  const open=async(index,source)=>{
   await controls.nth(index).locator('[data-date-open]').click();
   assert.equal(await dialog.getAttribute('data-source'),source);
  };
  const close=()=>dialog.waitFor({state:'detached'});
  const pick=key=>dialog.locator(`[data-calendar-value="${key}"]`);
  await open(0,'6671:132304');
  assert.equal(await dialog.locator('.years button').count(),3);
  assert.ok(await pick(20250228).isDisabled());
  await pick(20230228).click();await close();
  assert.match(await controls.nth(0).innerText(),/2023年/);
  await open(1,'6671:132073');
  assert.equal(await dialog.locator('.months button').count(),36);
  assert.ok(await pick(20241029).isDisabled());
  await pick(20240429).click();await close();
  assert.match(await controls.nth(1).innerText(),/2024年4月/);
  await open(2,'6671:132460');
  assert.equal(await dialog.locator('.yk-calendar-month[data-calendar-month="2"] .days button').count(),29);
  assert.ok(await pick(20240229).locator('.yk-calendar-dot').count());
  assert.ok(await pick(20240913).isDisabled());
  await dialog.locator('[data-calendar-year-select]').selectOption('2023');
  assert.equal(await dialog.locator('.yk-calendar-month[data-calendar-month="2"] .days button').count(),28);
  assert.ok(await pick(20231214).isDisabled());
  await page.keyboard.press('Escape');await close();
  assert.match(await controls.nth(2).innerText(),/2024年2月29日/);
  assert.equal(await page.evaluate(()=>dates.length),2);
  await page.setViewportSize({width:320,height:568});
  await open(2,'6671:132460');
  assert.ok(await dialog.evaluate(node=>node.scrollWidth<=node.clientWidth));
  const bounds=await dialog.evaluate(node=>{
   const active=node.querySelector('[data-calendar-value][aria-pressed="true"]').getBoundingClientRect();
   const scroll=node.querySelector('.yk-calendar-scroll').getBoundingClientRect();
   const week=node.querySelector('.yk-calendar-week').getBoundingClientRect();
   return {visible:active.top>=week.bottom&&active.bottom<=scroll.bottom};
  });
  assert.ok(bounds.visible,'Selected day must be visible on a short mobile screen');
  if(process.env.YIKAN_CALENDAR_SCREENSHOT)await dialog.screenshot({path:process.env.YIKAN_CALENDAR_SCREENSHOT});
  await dialog.locator('[data-calendar-today]').click();await close();
  const dates=await page.evaluate(()=>window.dates);
  assert.deepEqual(dates.map(x=>x.granularity),['year','month','day']);
  assert.deepEqual(dates[2],{granularity:'day',year:2024,month:4,day:9});
  assert.deepEqual(errors,[]);
  assert.deepEqual(external,[]);
  console.log('Full calendar: year/month/day source variants, leap days, explicit date bounds, cancel, current date, 320px fit, zero network requests.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
