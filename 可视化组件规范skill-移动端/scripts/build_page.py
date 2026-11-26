# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""Build a standalone offline page from local component configuration. Python stdlib only."""
import argparse,json,html,copy,base64,hashlib
from validate_page import validate, components
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def build(config,out,browser="auto",browser_path=None):
    config=copy.deepcopy(config)
    for screen in config.get('screens',[]):
        for component in screen.get('components',[]):
            props = component.get('props', {})
            if component.get('type') == 'businessRanking':
                scopes = props.get('scopes', [])
            elif component.get('type') == 'detailRanking':
                scopes = ([props['peer']] if props.get('peer') else []) + props.get('subordinates', [])
            elif component.get('type') == 'withholdingRankings':
                scopes = [scope for key in ('payment', 'signing', 'cancellation')
                          for scope in (props.get(key) or {}).get('scopes', [])]
            else:
                continue
            for scope in scopes:
                if scope.get('kind')=='peers':
                    if scope.get('complete'):
                        ordered=sorted(scope.get('rows',[]),key=lambda row:row['rank'])
                        if len(ordered)!=scope.get('totalPeers') or [row['rank'] for row in ordered]!=list(range(1,len(ordered)+1)):raise ValueError('Complete peer ranks must be continuous')
                        own=next((i for i,row in enumerate(ordered) if row['id']==scope.get('selfId')),None)
                        if own is None:raise ValueError('Missing self in peer ranking')
                        positions=sorted({i for i in [0,own-1,own,own+1] if 0<=i<len(ordered)})
                        scope['rows']=[ordered[i] for i in positions]
                        scope['complete']=False
                        scope['neighborhoodProvided']=True
                    for row in scope.get('rows',[]):
                        if row.get('id')!=scope.get('selfId'):row['name']='***'
                        row['canDrill']=False
    for screen in config.get('screens', []):
        if 'homeProfiles' not in screen:
            continue
        header = screen.get('homeHeader', {})
        allowed = {node['id'] for node in header.get('organizations', []) if node.get('selectable')}
        profiles = screen['homeProfiles']
        if not isinstance(profiles, dict) or profiles.keys() - allowed:
            raise ValueError('主页数据只能配置给可选组织')
    sdk=ROOT/'assets/offline'
    data=json.dumps(config,ensure_ascii=False).replace('<','\\u003c')
    manifest=json.loads((sdk/'runtime-manifest.json').read_text())
    css='\n'.join((sdk/path).read_text() for path in manifest['css'])
    js='\n'.join((sdk/path).read_text() for path in manifest['javascriptInOrder'])
    if any(component.get('type') == 'warningRanking' and component.get('props', {}).get('showRules')
           for screen in config.get('screens', []) for component in screen.get('components', [])):
        rules = sdk / 'native/warning-source-6671-171633-outlined.svg'
        records = json.loads((sdk / 'evidence/warning-source-6671-171633.json').read_text())['records']
        transcript = [''.join(segment['characters'] for segment in record['segments'])
                      for record in records if record.get('segments')]
        source = {'image': 'data:image/svg+xml;base64,' + base64.b64encode(rules.read_bytes()).decode(),
                  'transcript': transcript}
        js += '\nglobalThis.YikanWarningRules = ' + json.dumps(source, ensure_ascii=False) + ';'
    if any(component.get('type') == 'chargeRateTarget'
           for screen in config.get('screens', []) for component in screen.get('components', [])):
        background = (sdk / 'native/charge-rate-target-background-6695-316799.svg').read_bytes()
        uri = base64.b64encode(background).decode()
        css += f'\n.yk-card.yk-charge-rate-target{{background-image:url("data:image/svg+xml;base64,{uri}")}}'
    if any(component.get('type') == 'satisfactionRadar' and len(component.get('props', {}).get('dimensions', [])) == 6
           for screen in config.get('screens', []) for component in screen.get('components', [])):
        background = (sdk / 'native/satisfaction-background-6695-316438.svg').read_bytes()
        uri = base64.b64encode(background).decode()
        css += f'\n.yk-card.yk-satisfaction[data-dimensions="6"]{{background-image:url("data:image/svg+xml;base64,{uri}")}}'
    home_card_lists = [screen.get('components', []) for screen in config.get('screens', [])]
    home_card_lists.extend(profile.get('cards', [])
                           for screen in config.get('screens', [])
                           for profile in screen.get('homeProfiles', {}).values())
    if any(component.get('type') == 'homePerformanceCard' and component.get('props', {}).get('source') == '6671:164095'
           for cards in home_card_lists for component in cards):
        background = (sdk / 'native/home-income-background-6671-164095.svg').read_bytes()
        uri = base64.b64encode(background).decode()
        css += f'\n.yk-home-performance[data-performance-kind="income"]{{background-image:url("data:image/svg+xml;base64,{uri}")}}'
    if any(screen.get('homeHeader') for screen in config.get('screens', [])):
        surface = (sdk / 'native/home-organization-surface-4424-66054.svg').read_bytes()
        uri = base64.b64encode(surface).decode()
        css += f'\n.yk-home-org-rail::before{{background-image:url("data:image/svg+xml;base64,{uri}")}}'
    if any(screen.get('homeHeader', {}).get('showBrand') for screen in config.get('screens', [])):
        uri = base64.b64encode((sdk / 'native-resources/home-brand-4424-66204.png').read_bytes()).decode()
        css += f'\n.yk-home-brand{{background-image:url("data:image/png;base64,{uri}")}}'
    if any(screen.get('homeNavigation') for screen in config.get('screens', [])):
        import xml.etree.ElementTree as ET
        for index in range(3):
            original = (sdk / f'native/home-tab-{index}.svg').read_text()
            for selected in (False, True):
                tab = ET.fromstring(original)
                paths = list(tab)
                for path_index, path in enumerate(paths):
                    if path.get('fill') not in (None, 'none'):
                        color = '#00B2B2' if selected else '#757D8A' if path_index == 0 else '#9199A2'
                        path.set('fill', color)
                uri = base64.b64encode(ET.tostring(tab)).decode()
                state = '[aria-current="page"]' if selected else ':not([aria-current])'
                css += f'\n[data-home-nav="{index}"]{state} .yk-home-tab-image{{background-image:url("data:image/svg+xml;base64,{uri}")}}'
    js=js.replace('</script','<\\/script')
    title=html.escape(config.get('title','一看移动端页面'))
    layout='''body{margin:0;background:#eaf0f2;color:#444F60;font-family:-apple-system,"PingFang SC",sans-serif}.delivery{max-width:1240px;padding:24px;margin:auto}.delivery>h1{font-size:22px;margin:0 0 8px}.delivery>p{font-size:13px;line-height:22px;margin:8px 0 20px;color:#657080}.screens{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,375px));gap:24px;align-items:start}.screen-wrap{min-width:0}.screen-title{font-size:13px;margin-bottom:8px;color:#657080}.phone{max-width:375px;min-height:500px;overflow:hidden;border-radius:12px;border:1px solid #d8e3e7}.component-section{margin:16px;padding:16px;background:white;border-radius:12px}.component-section>h2{font-size:16px;line-height:24px;color:#22262F;font-weight:500;margin:0 0 16px}.component-caption{font-size:12px;line-height:20px;color:#9199A2;margin-top:12px}.screen-note{font-size:12px;line-height:20px;color:#9199A2;padding:8px 16px}.font-status{font-size:12px;line-height:20px;padding:8px 12px;background:#fff9ec;border-radius:4px;max-width:780px;margin:12px 0}.font-status.good{background:#e7f7f1}button:focus-visible,summary:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #00B2B2;outline-offset:2px}@media(max-width:420px){.delivery{padding:12px 0}.delivery>h1,.delivery>p,.font-status{margin-left:12px;margin-right:12px}.screens{display:block}.phone{border:0;border-radius:0;margin:auto;width:100%}.screen-wrap{margin-bottom:24px}.screen-title{padding:0 12px}.component-section{margin:16px}}'''
    runtime='''const config=JSON.parse(document.getElementById('page-data').textContent);const y=Yikan;const registry={detailRanking:y.detailRanking,statusTag:y.statusTag,businessRanking:y.businessRanking,filterControl:y.filterControl,organizationControl:y.organizationControl,dateControl:y.dateControl,nativeRingState:y.nativeRingState,fundingBar:y.fundingBar,comparison:y.comparison,aiHint:y.aiHint,progressRing:y.progressRing,multiRing:y.multiRing,donut:y.donut,deviceComposition:y.deviceComposition,trend:y.trend,ranking:y.ranking,homeCard:y.homeCard,warning:y.warning,warningRanking:y.warningRanking,bars:y.bars,horizontalBars:y.horizontalBars,funnel:y.funnel,stageConversion:y.stageConversion,cashflowInline:y.cashflowInline,actualTarget:y.actualTarget,chargeRateTarget:y.chargeRateTarget,contractTrend:y.contractTrend,withholdingAnalysis:y.withholdingAnalysis,withholdingPayment:y.withholdingPayment,withholdingRankings:y.withholdingRankings,satisfactionRadar:y.satisfactionRadar,signedPeriodBars:y.signedPeriodBars,yearAmountRings:y.yearAmountRings,receiptComposition:y.receiptComposition,monthlyRevenueGauge:y.monthlyRevenueGauge,categoryColumns:y.categoryColumns,periodCurves:y.periodCurves,ratioRings:y.ratioRings,homePerformanceCard:y.homePerformanceCard,homeProfitExplanation:y.homeProfitExplanation,homeCashflowTargets:y.homeCashflowTargets,radar:y.radar};let failures=[];
const renderHome=(screen,value)=>{
 try{return y.homeDashboard(Object.hasOwn(screen.homeProfiles,value)?screen.homeProfiles[value]:{});}
 catch(error){failures.push(error.message);return '<p class="yk-missing">'+y.esc(error.message)+'</p>';}
};
document.querySelector('.screens').innerHTML=config.screens.map(s=>'<div class="screen-wrap"><div class="screen-title">'+y.esc(s.name||'')+'</div><main class="yk-root phone'+(s.homeHeader?' yk-home-base'+(s.homeNavigation?' yk-home-viewport':''):s.background==='home'?' yk-home-background':s.background==='homeBase'?' yk-home-base':'')+'">'+(s.homeHeader?y.homeHeader(s.homeHeader):s.header?y.header(s.header):'')+(s.tabs?y.tabs(s.tabs.items,{selected:s.tabs.selected||0}):'')+(s.homeProfiles?'<section data-home-content aria-label="主页指标" aria-live="polite">'+renderHome(s,s.homeHeader.value)+'</section>':'')+s.components.map(c=>{try{if(!registry[c.type])throw Error('未知组件 '+c.type);const body=registry[c.type](c.props||{});return c.section?'<section class="component-section"><h2>'+y.esc(c.section)+'</h2>'+body+(c.caption?'<p class="component-caption">'+y.esc(c.caption)+'</p>':'')+'</section>':body;}catch(e){failures.push(e.message);return '<p class="yk-missing">'+y.esc(e.message)+'</p>';}}).join('')+'<p class="screen-note">'+y.esc(s.note||'示例/模拟数据；组件代码移植，非真实后端')+'</p>'+(s.homeNavigation?y.homeNavigation(s.homeNavigation===true?{}:s.homeNavigation):'<div class="yk-safe-area"></div>')+'</main></div>').join('');Yikan.hydrate();
document.querySelectorAll('.phone').forEach((phone,index)=>{
 const screen=config.screens[index],content=phone.querySelector('[data-home-content]');
 if(content)phone.addEventListener('yikan:organizationchange',event=>{
  content.innerHTML=renderHome(screen,event.detail.value.id);
 });
});
window.yikanRenderErrors=failures;document.fonts.ready.then(()=>{const required=[['PingFang SC','16px "PingFang SC"'],['DIN Bold','700 24px \"Yikan DIN\"'],['DIN Medium','500 16px \"Yikan DIN\"']];const missing=required.filter(x=>!document.fonts.check(x[1])).map(x=>x[0]);const el=document.querySelector('.font-status');el.textContent=missing.length?'字体提示：当前环境未确认 '+missing.join('、')+' 可用；显示可能回退，请核对字形，不能判为完全一致。':'字体待核验：浏览器未报告字体加载失败，但这不能证明实际使用了DIN或PingFang SC；需核对渲染字体与字形。';window.yikanFontCheck={browserCheck:required.map(x=>({family:x[0],available:document.fonts.check(x[1])})),note:'浏览器check不单独证明实际字形来自原字体'};});'''
    css_payload=css+'\n'+layout
    js_payload=js+'\n'+runtime
    sha=lambda value:hashlib.sha256(value.encode()).hexdigest()
    proof={'schemaVersion':1,'version':manifest.get('version'),'cssSha256':sha(css_payload),'jsSha256':sha(js_payload),'configSha256':sha(json.dumps(config,ensure_ascii=False,sort_keys=True)),'resources':{path:sha((sdk/path).read_text()) for path in manifest['css']+manifest['javascriptInOrder']},'components':[{'path':pos,'type':c.get('type')} for pos,c in components(config)]}
    proof_data=json.dumps(proof,ensure_ascii=False).replace('<','\\u003c')
    page='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style id="yikan-page-style">'+css_payload+'</style><div class="delivery"><h1>'+title+'</h1><p>'+html.escape(config.get('description',''))+'</p><div class="font-status">检查字体中…</div><div class="screens"></div></div><script id="page-data" type="application/json">'+data+'</script><script id="yikan-build-proof" type="application/json">'+proof_data+'</script><script id="yikan-page-runtime">'+js_payload+'</script></html>'
    out=Path(out);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(page)
    report=validate(out,browser=browser,browser_path=browser_path)
    if report['status']=='fail':raise ValueError('页面校验失败，请查看 '+str(out.with_suffix('.validation.json')))
    return out
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--data',required=True,help='本地页面组件配置JSON');p.add_argument('--out',required=True,help='输出单文件HTML路径');p.add_argument('--browser',choices=['auto','off','required'],default='auto',help='自动尝试浏览器；off仍执行静态校验；required要求浏览器成功');p.add_argument('--browser-path');a=p.parse_args();print(build(json.loads(Path(a.data).read_text()),a.out,a.browser,a.browser_path))
