"""Trial release behavior and computed-slot checks; no claim of full Figma parity."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'chart-skill-试用版-v1.3.4-trial.1-2026-11-18'
REPORT=ROOT/'audit/2026-11-18/trial-browser-validation.json'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True)
    page=browser.new_page(viewport={'width':375,'height':900},device_scale_factor=1)
    errors=[]; external=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:external.append(r.url) if r.url.startswith(('https:','http:')) else None)
    page.goto((OUT/'01-两轮充电经营情况.html').resolve().as_uri())
    page.wait_for_function('window.yikanRenderErrors !== undefined')
    assert page.evaluate('window.yikanRenderErrors')==[]
    assert page.locator('.yk-detail-header [data-component="date-control"]').count()==1
    assert abs(float(page.locator('.yk-funding').get_attribute('data-percent'))-66.6)<1e-8
    percent=page.locator('.yk-funding').get_attribute('data-percent')
    page.locator('[data-category="added"]').click()
    assert page.locator('.yk-funding').get_attribute('data-current-category')=='added'
    assert page.locator('.yk-funding').get_attribute('data-percent')==percent
    assert '1005.84' in page.locator('.yk-category-detail').inner_text()
    page.locator('[data-category="charging"]').click()
    page.locator('.yk-ai summary').click();assert page.locator('.yk-ai').get_attribute('open') is not None
    page.locator('.yk-ai summary').click()
    before=page.locator('.yk-date-control').get_attribute('data-value')
    page.locator('[data-date-open]').click()
    assert page.locator('.yk-date-dialog[open]').count()==1
    page.locator('[data-date-grain="month"]').click()
    page.locator('[data-date-cancel]').click()
    assert page.locator('.yk-date-control').get_attribute('data-value')==before
    page.locator('[data-date-open]').click()
    page.locator('[data-date-grain="month"]').click()
    page.locator('[data-date-confirm]').click()
    assert json.loads(page.locator('.yk-date-control').get_attribute('data-value'))['granularity']=='month'
    page.locator('[data-date-quick="year"]').click()
    card=page.locator('.yk-detail-ranking');peer=page.locator('[data-ranking-kind="peers"]')
    assert peer.locator('tbody tr').count()==4
    names=peer.locator('tbody tr td:nth-child(2)').all_inner_texts()
    assert names==['***','***','康桥碧桂园','***']
    assert peer.locator('[data-detail-rank-drill]').count()==0
    peer.locator('[data-detail-rank-search-toggle]').click()
    peer.locator('[data-detail-rank-search]').fill('康桥')
    assert peer.locator('tbody tr:visible').count()==1
    peer.locator('[data-detail-rank-search]').fill('')
    peer.locator('[data-detail-rank-search-toggle]').click()
    peer.locator('[data-detail-rank-sort="2"]').click()
    values=peer.locator('tbody tr').evaluate_all('(rows)=>rows.map(r=>JSON.parse(r.dataset.values)[2])')
    assert values==sorted(values)
    peer.locator('[data-detail-rank-sort="2"]').click()
    assert peer.locator('tbody tr').evaluate_all('(rows)=>rows.map(r=>JSON.parse(r.dataset.values)[2])')==sorted(values,reverse=True)
    card.locator('[data-detail-sub-scope]').select_option('project')
    assert page.locator('[data-detail-sub-panel="project"] tbody tr:visible').count()==2
    card.locator('[data-detail-sub-scope]').select_option('steward')
    page.evaluate("window.drills=[];document.addEventListener('yikan:rankingdrill',e=>drills.push(e.detail))")
    page.locator('[data-detail-sub-panel="steward"] [data-detail-rank-drill]').first.click()
    assert page.evaluate('window.drills.length')==1
    card.locator('[data-ranking-group-expand]').click()
    assert page.locator('dialog[open] .yk-detail-peer-summary').count()==1
    assert page.locator('dialog[open] .yk-detail-subordinates').count()==1
    page.keyboard.press('Escape')
    page.wait_for_selector('.yk-detail-ranking-dialog',state='detached')
    assert page.locator('dialog[open]').count()==0
    assert page.evaluate('document.activeElement.hasAttribute("data-ranking-group-expand")')
    metrics=page.evaluate('''()=>{const style=s=>{const e=document.querySelector(s),c=getComputedStyle(e);return {width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,font:c.fontFamily,size:c.fontSize,line:c.lineHeight,background:c.backgroundColor,color:c.color}};return {summary:style('.yk-detail-summary-face'),amount:style('.yk-detail-metric-line>strong'),rankAmount:style('.yk-detail-rank-scroll tbody td:nth-child(3)'),rankNumber:style('.yk-detail-rank-scroll .yk-rank-number'),header:style('.yk-detail-rank-scroll thead th'),row:style('.yk-detail-rank-scroll tbody td'),columns:[...document.querySelectorAll('[data-ranking-kind="peers"] col')].map(c=>c.style.width),aiHeight:getComputedStyle(document.querySelector('.yk-ai summary'),'::before').height,aiEntry:style('.yk-ai summary b')}}''')
    assert metrics['summary']['background']=='rgba(255, 255, 255, 0.48)'
    assert metrics['amount']['size']=='36px' and metrics['amount']['line']=='44px'
    assert metrics['rankAmount']['size']=='14px' and metrics['rankAmount']['line']=='22px'
    assert 'PingFang' in metrics['rankAmount']['font']
    assert metrics['rankNumber']['size']=='16px' and 'DIN' in metrics['rankNumber']['font']
    assert metrics['header']['height']==32 and metrics['row']['height']==40
    assert metrics['columns']==['44px','90px','94px','94px']
    assert metrics['aiHeight']=='40px'
    page.evaluate('document.activeElement.blur(); window.scrollTo(0,0)')
    box=page.locator('.phone').bounding_box()
    page.screenshot(path=str(OUT/'01-经营情况-首屏.png'),full_page=True,clip={**box,'height':min(812,box['height'])})
    card.screenshot(path=str(OUT/'02-排名组件-预览.png'))
    # Inspect the actual rendered fonts via Chrome, rather than treating CSS declarations as proof.
    cdp=page.context.new_cdp_session(page);cdp.send('DOM.enable');cdp.send('CSS.enable')
    document=cdp.send('DOM.getDocument');fonts={}
    for name,selector in [('summaryAmount','.yk-detail-metric-line>strong'),('rankingAmount','.yk-detail-rank-scroll tbody td:nth-child(3)')]:
        node=cdp.send('DOM.querySelector',{'nodeId':document['root']['nodeId'],'selector':selector})
        fonts[name]=cdp.send('CSS.getPlatformFontsForNode',{'nodeId':node['nodeId']})['fonts']
    for name in ['02-排名组件.html','03-主页卡片.html']:
        page.goto((OUT/name).resolve().as_uri());page.wait_for_function('window.yikanRenderErrors !== undefined')
        assert page.evaluate('window.yikanRenderErrors')==[]
    child=page.locator('.yk-home-children .yk-comparison').first
    assert child.count()>0
    home_metrics=child.evaluate('(e)=>({height:e.getBoundingClientRect().height,size:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight})')
    assert home_metrics['height']==18
    box=page.locator('.phone').bounding_box()
    page.screenshot(path=str(OUT/'03-主页卡片-首屏.png'),full_page=True,clip={**box,'height':min(812,box['height'])})
    from PIL import Image
    sample=Image.open(OUT/'03-主页卡片-首屏.png').convert('RGB').crop((4,180,370,280))
    dark=sum(1 for rgb in sample.getdata() if sum(rgb)<60)/(sample.width*sample.height)
    assert dark<0.1,'组织曲面不应出现大面积默认黑色填充'
    assert errors==[] and external==[]
    report={'version':'1.3.4-trial.1','pageErrors':errors,'externalRequests':external,'metrics':metrics,'homeComparison':home_metrics,'actualFonts':fonts,'behavior':['funding category switch with stable total','AI expand','date cancel and confirm','peer neighborhood and masking','name search','numeric sorting','subordinate scope and drill event','whole-card fullscreen and focus restore'],'limits':['Not full-library pixel parity','Date controls do not fetch backend data','Commercial fonts are not bundled','Production permission and routes not implemented']}
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    browser.close();print(json.dumps({'passed':True,'report':str(REPORT),'fonts':fonts},ensure_ascii=False))
