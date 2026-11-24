# -*- coding: utf-8 -*-
"""Validate generated HTML against local runtime and measured component contracts.
No network; stdlib static checks, optional Playwright browser checks. Not a pixel-parity certificate.
"""
import argparse, hashlib, json, math, re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]

def digest(text): return hashlib.sha256(text.encode()).hexdigest()
class Document(HTMLParser):
    def __init__(self):
        super().__init__(); self.scripts=[];self.styles=[];self.external=[];self.capture=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='script': self.scripts.append({'attrs':a,'text':''}); self.capture=self.scripts[-1]
        elif tag=='style': self.styles.append({'attrs':a,'text':''}); self.capture=self.styles[-1]
        if tag in ('script','img','link','iframe','source','video','audio','use'):
            for k in ('src','href','srcset','xlink:href'):
                v=a.get(k,'')
                if v and not v.startswith(('data:','#')): self.external.append({'tag':tag,'attribute':k,'value':v})
    def handle_data(self,s):
        if self.capture is not None:self.capture['text']+=s
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.capture=None

def components(config):
    for si,s in enumerate(config.get('screens',[])):
        for i,c in enumerate(s.get('components',[])):yield f'screens[{si}].components[{i}]',c
        for name,profile in s.get('homeProfiles',{}).items():
            for i,c in enumerate(profile.get('cards',[])):yield f'screens[{si}].homeProfiles.{name}.cards[{i}]',c

def validate(path,browser='auto',browser_path=None,output=None):
    path=Path(path).resolve(); checks=[]; artifacts={}
    def add(rule,status,detail):checks.append({'rule':rule,'status':status,'detail':detail})
    def test(rule,condition,detail):add(rule,'pass' if condition else 'fail',detail)
    text=path.read_text(encoding='utf-8');doc=Document();doc.feed(text)
    def payload(id):return next((json.loads(s['text']) for s in doc.scripts if s['attrs'].get('id')==id),None)
    try:config=payload('page-data');proof=payload('yikan-build-proof')
    except (ValueError,TypeError) as e:config=None;proof=None;add('embedded-json','fail',str(e))
    test('page-config',isinstance(config,dict) and bool(config.get('screens')),'必须保留可核对的页面配置')
    test('build-provenance',isinstance(proof,dict),'生成器写入资源指纹与组件调用清单；缺失不能证明规范组件复用')
    config=config or {};sdk=ROOT/'assets/offline';manifest=json.loads((sdk/'runtime-manifest.json').read_text())
    if proof:
        css=next((s['text'] for s in doc.styles if s['attrs'].get('id')=='yikan-page-style'),'')
        js=next((s['text'] for s in doc.scripts if s['attrs'].get('id')=='yikan-page-runtime'),'')
        test('output-integrity',digest(css)==proof.get('cssSha256') and digest(js)==proof.get('jsSha256') and digest(json.dumps(config,ensure_ascii=False,sort_keys=True))==proof.get('configSha256'),'检查生成后样式、脚本及数据是否被修改；修改后须重建复检')
        sources={p:digest((sdk/p).read_text()) for p in manifest['css']+manifest['javascriptInOrder']}
        test('local-resource-references',sources==proof.get('resources'),'按当前包核验全部CSS/JS指纹，过期模板或替换模板不能通过')
        base_css='\n'.join((sdk/p).read_text() for p in manifest['css'])
        base_js='\n'.join((sdk/p).read_text() for p in manifest['javascriptInOrder']).replace('</script','<\\/script')
        test('native-runtime-prefix',css.startswith(base_css) and js.startswith(base_js),'内嵌原始模块的内容与加载顺序必须匹配本地清单')
        test('component-call-manifest',proof.get('components')==[{'path':p,'type':c.get('type')} for p,c in components(config)],'对照实际配置核查组件类型与位置')
    registered={x['type']:x for x in json.loads((sdk/'component-registry.json').read_text())['items']}
    refs=[]
    for pos,c in components(config):
        kind=c.get('type');props=c.get('props',{});test(pos+'.registered',kind in registered,f'组件类型：{kind}')
        if kind in registered:refs.append({'path':pos,'type':kind,'source':registered[kind].get('source'),'knownGap':registered[kind].get('gap')})
        if kind=='fundingBar':
            for period in ['current','cumulative']:
                d=props.get(period) or {};T=d.get('funding');C=d.get('charging');V=d.get('added');ok=all(isinstance(x,(float,int)) and not isinstance(x,bool) and math.isfinite(x) for x in [T,C,V])
                ok=ok and T>0 and C>=0 and V>=0 and C+V<=T+1e-7
                test(pos+'.'+period+'.funding-domain',ok,'T>0；C/V非负；C+V≤T')
                if ok:
                    for key,expected in [('actual_revenue',C+V),('excluded',T-C-V)]:
                        if key in d:test(pos+'.'+period+'.'+key,isinstance(d[key],(int,float)) and abs(d[key]-expected)<1e-6,f'{key}应为{expected}')
                    if 'actual_share_display' in d:
                        try:ok=abs(float(d['actual_share_display'].rstrip('%'))-(C+V)/T*100)<=.051
                        except (ValueError,AttributeError):ok=False
                        test(pos+'.'+period+'.display-percent',ok,'显示百分比必须与R/T一致，允许一位小数舍入')
        if kind=='detailRanking' and props.get('peer'):
            peer=props['peer'];rows=peer.get('rows',[]);own=next((r for r in rows if r.get('id')==peer.get('selfId')),None)
            test(pos+'.peer-self',own is not None,'自身必须存在')
            test(pos+'.peer-masking',all(r.get('name')=='***' and not r.get('canDrill') for r in rows if r.get('id')!=peer.get('selfId')) and all(not r.get('canDrill') for r in rows),'序列化同级名称脱敏且禁止下钻')
            if own:
                rank=own.get('rank');total=peer.get('totalPeers',0);expected={n for n in [1,rank-1,rank,rank+1] if 1<=n<=total}
                test(pos+'.peer-neighborhood',{r.get('rank') for r in rows}==expected and len(rows)==len(expected),'只保留第一/前一/自身/后一，去重')
    if any(c.get('type') not in ('fundingBar','detailRanking') for _,c in components(config)):
        add('business-contract-coverage','pending','当前专项公式检查覆盖资金条与详情同级排名；其他业务组件需依据需求补充数据断言')
    css_text='\n'.join(s['text'] for s in doc.styles)
    css_urls=re.findall(r'url\(\s*[\"\']?([^\)\"\']+)',css_text)
    test('self-contained-resources',not doc.external and all(u.startswith(('data:','#')) for u in css_urls),'HTML资源无外部或相对依赖；远程脚本及运行时请求另由浏览器检查')
    metrics=[];fonts=[]
    if browser=='off':add('browser-render','pending','本次未执行浏览器；不能宣称渲染、实际字体或交互通过')
    else:
        try:
            from playwright.sync_api import sync_playwright
            with sync_playwright() as pw:
                kwargs={'headless':True}
                if browser_path:kwargs['executable_path']=browser_path
                elif Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome').exists():kwargs['executable_path']='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                b=pw.chromium.launch(**kwargs)
                page=b.new_page(viewport={'width':375,'height':812});errors=[];requests=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                def guard(route):
                    if route.request.url.startswith(('http:','https:')):requests.append(route.request.url);route.abort()
                    else:route.continue_()
                page.route('**/*',guard)
                try:
                    page.goto(path.as_uri());page.wait_for_function('window.yikanRenderErrors !== undefined',timeout=10000);page.evaluate('document.fonts.ready');page.wait_for_timeout(100)
                    test('browser-render',not errors and not page.evaluate('window.yikanRenderErrors'),'脚本与组件构造错误：'+str(errors+page.evaluate('window.yikanRenderErrors')))
                    test('offline-requests',not requests,'已阻断并记录外部请求：'+str(requests))
                    # Each screen is checked at its designed width; horizontal scrolling inside ranking is allowed.
                    test('page-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'375px整页不得横向溢出；表格内部横滑允许')
                    source_contracts={'fundingBar':('funding-bar','10044:65926/10044:66027'),'detailRanking':('detail-ranking','7958:123884'),'deviceComposition':('device-composition','5790:97172'),'statusTag':('status-tag','7952:98702'),'homeCard':('home-card',None),'stageConversion':('stage-conversion','6695:316711')}
                    for si,screen in enumerate(config.get('screens',[])):
                        phone=page.locator('.phone').nth(si)
                        if screen.get('header',{}).get('layout')=='indicatorDetail':
                            test(f'header-reference:{si}',phone.locator('[data-component="indicator-header"][data-source="7958:123868/123872"]').count()==1,'指标详情必须引用正确页头组件')
                        for kind in {c.get('type') for c in screen.get('components',[])}:
                            count=sum(c.get('type')==kind for c in screen.get('components',[]))
                            if kind in source_contracts:
                                dom,source=source_contracts[kind];selector=f'[data-component="{dom}"]'+(f'[data-source="{source}"]' if source else '')
                                test(f'component-dom:{si}:{kind}',phone.locator(selector).count()>=count,{'expectedCount':count,'selector':selector})
                            else:add(f'component-dom:{si}:{kind}','pending','当前组件尚无DOM来源专项断言；资源指纹通过不能替代该组件视觉核对')
                    for si,screen in enumerate(config.get('screens',[])):
                        phone=page.locator('.phone').nth(si)
                        for ci,c in enumerate(screen.get('components',[])):
                            if c.get('type')=='fundingBar':
                                bars=[x for x in screen.get('components',[])[:ci] if x.get('type')=='fundingBar'];node=phone.locator('.yk-funding').nth(len(bars));d=c['props']['cumulative'];expected=(d['charging']+d['added'])/d['funding']*100
                                test(f'funding-render-percent:{si}:{ci}',abs(float(node.get_attribute('data-percent'))-expected)<1e-7,'DOM构成占比必须等于配置R/T')
                    contracts=[('.yk-detail-metric-line>strong',{'fontSize':'36px','lineHeight':'44px'}),('.yk-detail-metric-line>small',{'fontSize':'16px','lineHeight':'30px'}),('.yk-detail-summary-face',{'backgroundColor':'rgba(255, 255, 255, 0.48)'}),('.yk-detail-rank-scroll tbody td:nth-child(3)',{'fontSize':'14px','lineHeight':'22px'}),('.yk-detail-rank-scroll .yk-rank-number',{'fontSize':'16px'}),('.yk-detail-rank-scroll thead th',{'height':'32px'}),('.yk-detail-rank-scroll tbody td',{'height':'40px'})]
                    for selector,expected in contracts:
                        for index,node in enumerate(page.locator(selector).all()):
                            if not node.is_visible():continue
                            actual=node.evaluate('(e)=>{let s=getComputedStyle(e);return {fontSize:s.fontSize,lineHeight:s.lineHeight,backgroundColor:s.backgroundColor,height:e.getBoundingClientRect().height+"px"}}')
                            metrics.append({'selector':selector,'index':index,'actual':actual,'expected':expected});test(f'slot:{selector}:{index}',all(actual[k]==v for k,v in expected.items()),{'expected':expected,'actual':actual})
                    for i,node in enumerate(page.locator('.yk-funding').all()):
                        before=node.get_attribute('data-percent');toggle=node.locator('[data-category="added"]')
                        if toggle.count():
                            toggle.click();test(f'funding-switch:{i}',node.get_attribute('data-percent')==before and node.get_attribute('data-current-category')=='added','分类切换保持总占比并更新分类');node.locator('[data-category="charging"]').click()
                    for i,node in enumerate(page.locator('.yk-ai').all()):
                        node.locator('summary').click();test(f'ai-expand:{i}',node.get_attribute('open') is not None,'AI可展开');node.locator('summary').click()
                    session=page.context.new_cdp_session(page);session.send('DOM.enable');session.send('CSS.enable');root=session.send('DOM.getDocument')['root']['nodeId']
                    for selector,family in [('.yk-detail-metric-line>strong','DIN'),('.yk-detail-rank-scroll tbody td:nth-child(3)','PingFang')]:
                        nid=session.send('DOM.querySelector',{'nodeId':root,'selector':selector})['nodeId']
                        if nid:
                            used=session.send('CSS.getPlatformFontsForNode',{'nodeId':nid})['fonts'];fonts.append({'selector':selector,'expected':family,'actual':used})
                            found=any(family.lower() in (f.get('familyName','')+' '+f.get('postScriptName','')).lower() and f.get('glyphCount',0)>0 for f in used)
                            add('actual-font:'+selector,'pass' if found else 'pending',{'expected':family,'actual':used,'note':'未使用规范字体时需处理安装/授权或记录替代，不能认定一致'})
                    dest=Path(output) if output else path.with_suffix('.validation.json');shot=dest.with_suffix('.png');shot.parent.mkdir(parents=True,exist_ok=True);page.screenshot(path=str(shot),full_page=True);artifacts['screenshot']=str(shot)
                except Exception as e:add('browser-execution','fail',str(e))
                finally:b.close()
        except Exception as e:add('browser-environment','fail' if browser=='required' else 'pending',str(e).splitlines()[0])
    add('visual-source-parity','pending','本地模板仍有已知差异；截图须按同数据对照规范原件。自动校验不证明全页逐像素一致、图表选型正确或用户验收通过')
    add('interaction-coverage','pending','自动脚本仅检查已实现的资金分类/AI操作；其余需求中的日期、搜索、排序、权限、下钻和全屏须逐项执行并留证')
    status='fail' if any(x['status']=='fail' for x in checks) else 'partial' if any(x['status']=='pending' for x in checks) else 'pass'
    report={'schemaVersion':1,'status':status,'html':str(path),'htmlSha256':digest(text),'checks':checks,'summary':{s:sum(x['status']==s for x in checks) for s in ['pass','fail','pending']},'componentReferences':refs,'metrics':metrics,'actualFonts':fonts,'artifacts':artifacts,'fullVisualParity':False}
    dest=Path(output) if output else path.with_suffix('.validation.json');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    lines=['# 页面生成后校验','',f'状态：{status}；通过{report["summary"]["pass"]}，失败{report["summary"]["fail"]}，待验证{report["summary"]["pending"]}。','',f'HTML SHA256：{report["htmlSha256"]}','','自动结果不等于全页视觉还原度验收。','', '| 规则 | 状态 | 证据/说明 |','|---|---|---|']
    for c in checks:
        detail=str(c['detail']).replace('|','/').replace('\n',' ')[:900];lines.append(f'| {c["rule"]} | {c["status"]} | {detail} |')
    dest.with_suffix('.md').write_text('\n'.join(lines)+'\n');return report

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--html',required=True);p.add_argument('--out');p.add_argument('--browser',choices=['auto','off','required'],default='auto');p.add_argument('--browser-path');a=p.parse_args()
    result=validate(a.html,a.browser,a.browser_path,a.out);print(json.dumps({'status':result['status'],'summary':result['summary']},ensure_ascii=False));raise SystemExit(2 if result['status']=='fail' else 0)
