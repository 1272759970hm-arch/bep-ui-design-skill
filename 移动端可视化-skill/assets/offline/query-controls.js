(function(global){
'use strict';
let uid=0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const modes=['year','month','day'];
const daysInMonth=(y,m)=>new Date(Date.UTC(y,m,0)).getUTCDate();
function validateDate(value){
 if(!value||!modes.includes(value.granularity)||!Number.isInteger(value.year)||value.year<1900||value.year>9999||!Number.isInteger(value.month)||value.month<1||value.month>12||!Number.isInteger(value.day)||value.day<1||value.day>daysInMonth(value.year,value.month))throw Error('日期字段或粒度无效');
 return {granularity:value.granularity,year:value.year,month:value.month,day:value.day};
}
function changeDate(value,patch){const v={...value,...patch};v.day=Math.min(v.day,daysInMonth(v.year,v.month));return validateDate(v);}
function dateLabel(v){return `${v.year}年${v.granularity==='year'?'':v.month+'月'}${v.granularity==='day'?v.day+'日':''}`;}
function dateKey(v){return v.year*10000+v.month*100+v.day;}
function withinBounds(v,config){
 const key=x=>v.granularity==='year'?x.year:v.granularity==='month'?x.year*100+x.month:dateKey(x);
 return (!config.min||key(v)>=key(config.min))&&(!config.max||key(v)<=key(config.max));
}
function dateControl({value,years,granularities=modes,min=null,max=null,today=null,picker='sheet',dataPeriods=[]}={}){
 if(!['sheet','calendar'].includes(picker)||!Array.isArray(dataPeriods))throw Error('日期选择配置无效');
 value=validateDate(value);if(!granularities.length||granularities.some(x=>!modes.includes(x))||!granularities.includes(value.granularity))throw Error('日期粒度配置无效');
 if(min)min=validateDate({...min,granularity:'day'});if(max)max=validateDate({...max,granularity:'day'});if(min&&max&&dateKey(min)>dateKey(max))throw Error('日期上下界倒置');
 years=years||Array.from({length:9},(_,i)=>Math.max(1900,Math.min(9991,value.year-4))+i);if(!years.length||years.some(x=>!Number.isInteger(x)||x<1900||x>9999)||!years.includes(value.year))throw Error('年份列表无效或不含当前值');years=[...new Set(years)].sort((a,b)=>a-b);
 if(today)today=validateDate({...today,granularity:'day'});
 const config={years,granularities,min,max,today,picker,dataPeriods:dataPeriods.map(validateDate)};if(!withinBounds(value,config))throw Error('初始日期超出可选范围');
 return `<section class="yk-date-control" data-component="date-control" data-source="${picker==='calendar'?'6671:132073/132304/132460':'6695:311818/311834/311850'}" data-value="${esc(JSON.stringify(value))}" id="qc${++uid}"><button type="button" data-date-open aria-label="选择查询日期">${dateLabel(value)} <span aria-hidden="true">⌄</span></button><div class="yk-date-shortcuts">${granularities.map(g=>`<button type="button" data-date-quick="${g}" aria-pressed="${g===value.granularity}">${{year:'年度',month:'月度',day:'按日'}[g]}</button>`).join('')}</div><script type="application/json" class="yk-date-config">${JSON.stringify(config).replace(/</g,'\\u003c')}</script></section>`;
}
const calendarSources={year:'6671:132304',month:'6671:132073',day:'6671:132460'};
const calendarLabels={year:'年',month:'月',day:'日'};
const calendarDetails={
 year:['本日当前的累计值','本月至今的累计值','本年至今的累计值'],
 month:['当日每小时累计值','当月每日累计值','当年每月累计值'],
 day:['当日每小时数据','当月每天数据','当年每月数据']
};
function localToday(){
 const now=new Date();
 return {year:now.getFullYear(),month:now.getMonth()+1,day:now.getDate()};
}
function calendarPeriodKey(v){
 return v.granularity+':'+v.year+(v.granularity==='year'?'':'-'+v.month)+(v.granularity==='day'?'-'+v.day:'');
}
function openCalendar({config,selected,dialog,commit}){
 const mode=selected.granularity;
 const yearChoices=config.years.filter(year=>withinBounds(changeDate(selected,{year,granularity:'year'}),config));
 const today=changeDate(selected,config.today||localToday());
 const hasData=new Set(config.dataPeriods.map(calendarPeriodKey));
 const icons=global.YikanAssets?.calendarIcons||{};
 let visibleYear=selected.year;
 const choose=value=>{commit(value);dialog.close();};
 function option(value,label,fullLabel=dateLabel(value)){
  const enabled=withinBounds(value,config),active=calendarPeriodKey(selected)===calendarPeriodKey(value);
  const available=enabled&&hasData.has(calendarPeriodKey(value));
  return `<button type="button" data-calendar-value="${dateKey(value)}" aria-label="${fullLabel}${available?'，有数据':''}" aria-pressed="${active}" ${enabled?'':'disabled'}><span>${label}</span>${available?'<i class="yk-calendar-dot" aria-hidden="true"></i>':''}</button>`;
 }
 function monthSection(month){
  const first=new Date(Date.UTC(visibleYear,month-1,1));
  const offset=(first.getUTCDay()+6)%7;
  const length=daysInMonth(visibleYear,month);
  const cells=Array.from({length:Math.ceil((offset+length)/7)*7},(_,index)=>{
   const day=index-offset+1;
   if(day<1||day>length){
    const adjacent=new Date(Date.UTC(visibleYear,month-1,day));
    return `<span class="yk-calendar-other" aria-hidden="true">${adjacent.getUTCDate()}</span>`;
   }
   return option({granularity:mode,year:visibleYear,month,day},day);
  }).join('');
  return `<section class="yk-calendar-month" data-calendar-month="${month}"><h3><small>${visibleYear}</small> ${month}月</h3><div class="yk-calendar-grid days">${cells}</div></section>`;
 }
 function render({focusYear=false,initial=false}={}){
  let periods;
  if(mode==='year'){
   periods=`<div class="yk-calendar-grid years">${config.years.map(year=>option(changeDate(selected,{year}),year+'年')).join('')}</div>`;
  }else if(mode==='month'){
   periods=config.years.map(year=>`<section class="yk-calendar-month" data-calendar-year="${year}"><h3>${year}年</h3><div class="yk-calendar-grid months">${Array.from({length:12},(_,index)=>{const month=index+1;return option(changeDate(selected,{year,month}),month+'月');}).join('')}</div></section>`).join('');
  }else{
   periods=`<div class="yk-calendar-week" aria-hidden="true">${[...'一二三四五六日'].map(label=>`<span>${label}</span>`).join('')}</div>${Array.from({length:12},(_,index)=>monthSection(index+1)).join('')}`;
  }
  const yearControl=mode==='day'&&yearChoices.length>1?`<select data-calendar-year-select aria-label="浏览年份">${yearChoices.map(year=>`<option value="${year}" ${year===visibleYear?'selected':''}>${year}年</option>`).join('')}</select>`:'';
  const guide=['day','month','year'].map((grain,index)=>`<div class="${grain===mode?'active':''}">${icons[grain]||''}<strong>${calendarLabels[grain]}视图</strong><small>${calendarDetails[mode][index]}</small></div>`).join('');
  dialog.innerHTML=`<header class="yk-calendar-nav"><button type="button" data-calendar-close aria-label="返回">${global.Yikan?.icon('back',20)||'‹'}</button><h2>请选择</h2></header><div class="yk-calendar-context"><h3>历史数据</h3><span>${dateLabel(selected)}</span>${yearControl}</div><div class="yk-calendar-guide">${guide}</div><div class="yk-calendar-scroll">${periods}</div><footer class="yk-calendar-footer"><button type="button" data-calendar-today ${config.years.includes(today.year)&&withinBounds(today,config)?'':'disabled'}>回到本${calendarLabels[mode]}</button></footer>`;
  const scroll=dialog.querySelector('.yk-calendar-scroll');
  const yearSelect=dialog.querySelector('[data-calendar-year-select]');
  if(yearSelect)yearSelect.onchange=()=>{visibleYear=Number(yearSelect.value);render({focusYear:true});};
  const back=dialog.querySelector('[data-calendar-close]');
  back.onclick=()=>dialog.close();
  dialog.querySelector('[data-calendar-today]').onclick=()=>choose(today);
  scroll.onclick=event=>{
   const optionButton=event.target.closest('[data-calendar-value]:enabled');
   if(!optionButton)return;
   const key=Number(optionButton.dataset.calendarValue);
   choose({granularity:mode,year:Math.floor(key/10000),month:Math.floor(key/100)%100,day:key%100});
  };
  if(focusYear){dialog.querySelector('[data-calendar-year-select]').focus({preventScroll:true});}
  if(initial){
   const active=scroll.querySelector('[data-calendar-value][aria-pressed="true"]');
   const section=active?.closest('section')||active;
   if(section){
    const start=section.offsetTop-(mode==='day'?38:0);
    const activeBottom=active.offsetTop+active.offsetHeight;
    scroll.scrollTop=Math.max(start,activeBottom-scroll.clientHeight+8);
   }
   if(active&&!active.disabled)active.focus({preventScroll:true});else back.focus();
  }
 }
 dialog.className='yk-calendar-dialog yk-root';
 dialog.dataset.source=calendarSources[mode];
 dialog.showModal();
 render({initial:true});
}
function hydrateDates(root=document){root.querySelectorAll('.yk-date-control').forEach(control=>{
 const config=JSON.parse(control.querySelector('.yk-date-config').textContent),trigger=control.querySelector('[data-date-open]');
 const current=()=>JSON.parse(control.dataset.value);
 const commit=value=>{control.dataset.value=JSON.stringify(value);trigger.innerHTML=esc(dateLabel(value))+' <span aria-hidden="true">⌄</span>';control.querySelectorAll('[data-date-quick]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dateQuick===value.granularity)));control.dispatchEvent(new CustomEvent('yikan:datechange',{bubbles:true,detail:{value:{...value}}}));};
 control.querySelectorAll('[data-date-quick]').forEach(b=>b.onclick=()=>{const today=config.today||localToday(),next=changeDate(current(),{...today,granularity:b.dataset.dateQuick});if(!config.years.includes(next.year)||!withinBounds(next,config)){control.dispatchEvent(new CustomEvent('yikan:queryerror',{bubbles:true,detail:{reason:'当前日期不在配置的可选范围内'}}));return;}commit(next);});
 trigger.onclick=()=>{
  let draft=current();const dialog=document.createElement('dialog');dialog.className='yk-date-dialog yk-root';dialog.setAttribute('aria-label','选择查询日期');
  const previousOverflow=document.body.style.overflow;document.body.append(dialog);document.body.style.overflow='hidden';
  dialog.addEventListener('close',()=>{dialog.remove();document.body.style.overflow=previousOverflow;trigger.focus();},{once:true});
  if(config.picker==='calendar'){openCalendar({config,selected:draft,dialog,commit});return;}
  function render(){
   const columns=[['year',config.years,'年'],...(draft.granularity!=='year'?[['month',Array.from({length:12},(_,i)=>i+1),'月']]:[]),...(draft.granularity==='day'?[['day',Array.from({length:daysInMonth(draft.year,draft.month)},(_,i)=>i+1),'日']]:[])];
   dialog.innerHTML=`<div class="yk-date-sheet"><div class="yk-date-grains" role="tablist">${config.granularities.map(g=>`<button type="button" role="tab" data-date-grain="${g}" aria-selected="${g===draft.granularity}">${{year:'选择年份',month:'选择月份',day:'选择日期'}[g]}</button>`).join('')}</div><div class="yk-date-wheels">${columns.map(([field,values,suffix])=>`<div class="yk-date-wheel" role="listbox" aria-label="${field}">${values.map(v=>{const candidate=changeDate(draft,{[field]:v});const possible=field==='year'?(!config.min||v>=config.min.year)&&(!config.max||v<=config.max.year):field==='month'?(!config.min||candidate.year*100+v>=config.min.year*100+config.min.month)&&(!config.max||candidate.year*100+v<=config.max.year*100+config.max.month):withinBounds(candidate,config);return `<button type="button" role="option" data-date-field="${field}" data-date-option="${v}" aria-selected="${v===draft[field]}" ${possible?'':'disabled'}>${v}${suffix}</button>`;}).join('')}</div>`).join('')}</div><div class="yk-date-actions"><button type="button" data-date-cancel>取消</button><button type="button" data-date-confirm ${withinBounds(draft,config)?'':'disabled'}>确定</button></div><div class="yk-date-safe"></div></div>`;
   dialog.querySelectorAll('[data-date-grain]').forEach(b=>b.onclick=()=>{draft=changeDate(draft,{granularity:b.dataset.dateGrain});render();});
   dialog.querySelectorAll('[data-date-option]').forEach(b=>b.onclick=()=>{draft=changeDate(draft,{[b.dataset.dateField]:+b.dataset.dateOption});render();});
   dialog.querySelector('[data-date-cancel]').onclick=()=>dialog.close();dialog.querySelector('[data-date-confirm]').onclick=()=>{if(withinBounds(draft,config)){commit({...draft});dialog.close();}};
   dialog.querySelectorAll('.yk-date-wheel').forEach(wheel=>{
    const selected=wheel.querySelector('[aria-selected="true"]');
    wheel.scrollTop=selected.offsetTop-(wheel.clientHeight-selected.offsetHeight)/2;
    wheel.addEventListener('scrollend',()=>{
     if(!wheel.isConnected)return;
     const center=wheel.scrollTop+wheel.clientHeight/2;
     const options=[...wheel.querySelectorAll('[data-date-option]:enabled')];
     const distance=option=>Math.abs(option.offsetTop+option.offsetHeight/2-center);
     const nearest=options.reduce((best,option)=>!best||distance(option)<distance(best)?option:best,null);
     if(nearest&&nearest!==selected)nearest.click();
     else if(nearest&&distance(nearest)>1)wheel.scrollTop=nearest.offsetTop-(wheel.clientHeight-nearest.offsetHeight)/2;
    });
   });
  }
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close();}},true);
  render();dialog.showModal();render();dialog.querySelector('[data-date-grain][aria-selected="true"]').focus();
 };
});}
function organizationModel(nodes,value=null){
 if(!Array.isArray(nodes)||!nodes.length)throw Error('组织列表不能为空');const map=new Map();
 for(const n of nodes){if(!n||typeof n.id!=='string'||!n.id||typeof n.name!=='string'||typeof n.selectable!=='boolean'||map.has(n.id))throw Error('组织ID、名称、可选权限必须明确且唯一');map.set(n.id,{id:n.id,name:n.name,parentId:n.parentId??null,selectable:n.selectable,level:n.level||'组织'});}
 for(const n of map.values()){let p=n,seen=new Set();while(p){if(seen.has(p.id))throw Error('组织树存在循环');seen.add(p.id);if(p.parentId!==null&&!map.has(p.parentId))throw Error('缺少授权路径节点');p=map.get(p.parentId);}}
 if(value!==null&&(!map.has(value)||!map.get(value).selectable))throw Error('初始组织不存在或不可选');
 return {nodes:[...map.values()],value};
}
function organizationControl({nodes,value=null,searchTrigger=false}={}){const model=organizationModel(nodes,value);return `<section class="yk-org-control" data-component="organization-control" data-source="6671:131690" data-value="${esc(value||'')}"><button type="button" data-org-open${searchTrigger?' aria-label="搜索组织"':''}>${searchTrigger?global.Yikan?.icon('search',24)||'搜索':esc(model.nodes.find(n=>n.id===value)?.name||'请选择组织')+' '+(global.Yikan?.icon('down')||'')}</button><script type="application/json" class="yk-org-config">${JSON.stringify(model).replace(/</g,'\\u003c')}</script></section>`;}
function hydrateOrganizations(root=document){root.querySelectorAll('.yk-org-control').forEach(control=>{const config=JSON.parse(control.querySelector('.yk-org-config').textContent),map=new Map(config.nodes.map(n=>[n.id,n])),trigger=control.querySelector('[data-org-open]');trigger.onclick=()=>{
 let parent=map.get(control.dataset.value)?.parentId??null;const dialog=document.createElement('dialog');dialog.className='yk-org-dialog yk-root';dialog.setAttribute('aria-label','选择组织');const previousOverflow=document.body.style.overflow;document.body.append(dialog);document.body.style.overflow='hidden';
 const path=id=>{const result=[];let n=map.get(id);while(n){result.unshift(n);n=map.get(n.parentId);}return result;};
 const commit=n=>{if(!n.selectable)return;control.dataset.value=n.id;if(!trigger.hasAttribute('aria-label'))trigger.innerHTML=esc(n.name)+(global.Yikan?.icon('down')||'');control.dispatchEvent(new CustomEvent('yikan:organizationchange',{bubbles:true,detail:{value:{...n},path:path(n.id)}}));dialog.close();};
 function render(query='',focusSearch=false){const list=query?config.nodes.filter(n=>n.name.includes(query)):config.nodes.filter(n=>n.parentId===parent),current=map.get(parent);dialog.innerHTML=`<div class="yk-org-toolbar"><button type="button" data-org-cancel aria-label="取消组织选择">${global.Yikan?.icon('back',24)||'返回'}</button><span>请选择</span></div><div class="yk-org-search"><input type="search" aria-label="组织搜索" placeholder="请输入区域或项目名称查询" value="${esc(query)}"></div><nav class="yk-org-path" aria-label="当前访问位置"><button type="button" data-org-path="">当前访问位置</button>${path(parent).map(n=>`<button type="button" data-org-path="${esc(n.id)}">${esc(n.name)}</button>`).join('')}</nav><div class="yk-org-divider"></div><div class="yk-org-heading">${query?'搜索结果':current?'选择下辖组织':'选择组织'}${current?.selectable?'<button type="button" data-org-current>选择本级</button>':''}</div><div class="yk-org-list">${list.map(n=>{const branch=config.nodes.some(c=>c.parentId===n.id);return `<button type="button" data-org-id="${esc(n.id)}" ${!branch&&!n.selectable?'disabled':''}><span>${esc(n.name)}${query?`<small>${esc(path(n.id).map(x=>x.name).join(' / '))}</small>`:''}</span>${branch?global.Yikan?.icon('down')||'':n.id===control.dataset.value?global.Yikan?.icon('check')||'':''}</button>`;}).join('')||'<p class="yk-missing">暂无匹配组织</p>'}</div>`;
 dialog.querySelector('[data-org-cancel]').onclick=()=>dialog.close();dialog.querySelector('input').oninput=e=>render(e.target.value,true);dialog.querySelectorAll('[data-org-path]').forEach(b=>b.onclick=()=>{parent=b.dataset.orgPath||null;render();});const choose=dialog.querySelector('[data-org-current]');if(choose)choose.onclick=()=>commit(current);
 dialog.querySelectorAll('[data-org-id]').forEach(b=>b.onclick=()=>{const n=map.get(b.dataset.orgId);if(config.nodes.some(c=>c.parentId===n.id)){parent=n.id;render();}else commit(n);});if(focusSearch){const input=dialog.querySelector('input');input.focus();input.setSelectionRange?.(input.value.length,input.value.length);}}
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close();}},true);dialog.addEventListener('close',()=>{dialog.remove();document.body.style.overflow=previousOverflow;trigger.focus();},{once:true});render();dialog.showModal();dialog.querySelector('input').focus();
};});}

function filterSchema(fields){
 if(!Array.isArray(fields)||!fields.length)throw Error('筛选字段不能为空');const keys=new Set();
 for(const f of fields){if(!f||typeof f.key!=='string'||!/^[-a-zA-Z0-9_]+$/.test(f.key)||['__proto__','constructor','prototype'].includes(f.key)||keys.has(f.key)||!['single','multi'].includes(f.mode)||typeof f.label!=='string'||!Array.isArray(f.options)||!f.options.length)throw Error('筛选字段、模式或选项无效');keys.add(f.key);const options=new Set();for(const o of f.options){if(typeof o.value!=='string'||!o.value||typeof o.label!=='string'||options.has(o.value))throw Error('筛选选项需唯一');options.add(o.value);}}
 const map=new Map(fields.map(f=>[f.key,f])),visiting=new Set(),done=new Set(),ordered=[];
 function visit(f){if(done.has(f.key))return;if(visiting.has(f.key))throw Error('筛选依赖循环');visiting.add(f.key);if(f.showWhen){const p=map.get(f.showWhen.field);if(!p||!Array.isArray(f.showWhen.values)||!f.showWhen.values.length||f.showWhen.values.some(v=>!p.options.some(o=>o.value===v)))throw Error('筛选依赖无效');visit(p);}visiting.delete(f.key);done.add(f.key);ordered.push(f);}
 fields.forEach(visit);return ordered;
}
function filterVisible(field,value){return !field.showWhen||field.showWhen.values.some(v=>(value[field.showWhen.field]||[]).includes(v));}
function filterValue(fields,value={}){
 const ordered=filterSchema(fields);if(!value||Array.isArray(value)||typeof value!=='object'||Object.keys(value).some(k=>!fields.some(f=>f.key===k)))throw Error('筛选值包含未知字段');const result={};
 for(const f of ordered){const selected=value[f.key]??[];if(!Array.isArray(selected)||selected.some(v=>!f.options.some(o=>o.value===v))||new Set(selected).size!==selected.length||f.mode==='single'&&selected.length>1)throw Error('筛选值不符合字段合同');result[f.key]=filterVisible(f,result)?selected.slice():[];}
 return result;
}
function propertyFilterFields(){return [
 {key:'nature',label:'单位性质',mode:'multi',options:[{value:'owned',label:'自有区域'},{value:'equity',label:'股权公司'},{value:'other',label:'其他'}]},
 {key:'region',label:'区域分类',mode:'multi',options:['A','B','C','D','E'].map(value=>({value,label:value+'类'}))},
 {key:'subject',label:'账单主体类型',mode:'multi',options:[{value:'small',label:'小业主'},{value:'large',label:'大业主'}]},
 {key:'risk',label:'风险客商类型',mode:'multi',showWhen:{field:'subject',values:['large']},options:[{value:'nonrisk',label:'非风险客商'},{value:'risk',label:'风险客商'}]}
 ];}
function filterControl({fields,value={},defaults={},available=true,version='configured'}={}){if(!available)return '';filterSchema(fields);value=filterValue(fields,value);defaults=filterValue(fields,defaults);const config={fields,defaults,version};return `<section class="yk-filter-control" data-component="advanced-filter" data-source="6671:145683/145744" data-version="${esc(version)}" data-value="${esc(JSON.stringify(value))}"><button type="button" data-filter-open>高级筛选</button><script type="application/json" class="yk-filter-config">${JSON.stringify(config).replace(/</g,'\\u003c')}</script></section>`;}
function hydrateFilters(root=document){root.querySelectorAll('.yk-filter-control').forEach(control=>{const config=JSON.parse(control.querySelector('.yk-filter-config').textContent),trigger=control.querySelector('[data-filter-open]');trigger.onclick=()=>{
 let draft=filterValue(config.fields,JSON.parse(control.dataset.value));const dialog=document.createElement('dialog');dialog.className='yk-filter-dialog yk-root';dialog.setAttribute('aria-label','高级筛选');const previousOverflow=document.body.style.overflow;document.body.append(dialog);document.body.style.overflow='hidden';
 function render(){dialog.innerHTML=`<header><h2>高级筛选</h2><button type="button" data-filter-cancel aria-label="取消高级筛选">${global.Yikan?.icon('close',20)||'关闭'}</button></header><div class="yk-filter-fields">${config.fields.filter(f=>filterVisible(f,draft)).map(f=>`<fieldset data-filter-field="${esc(f.key)}"><legend>${esc(f.label)}</legend><div>${f.options.map(o=>`<button type="button" data-filter-key="${esc(f.key)}" data-filter-option="${esc(o.value)}" aria-pressed="${draft[f.key].includes(o.value)}">${esc(o.label)}</button>`).join('')}</div></fieldset>`).join('')}</div><footer><button type="button" data-filter-reset>重置</button><button type="button" data-filter-confirm>确定</button></footer><div class="yk-date-safe"></div>`;
 dialog.querySelector('[data-filter-cancel]').onclick=()=>dialog.close();dialog.querySelector('[data-filter-reset]').onclick=()=>{draft=filterValue(config.fields,config.defaults);render();};dialog.querySelector('[data-filter-confirm]').onclick=()=>{const value=filterValue(config.fields,draft);control.dataset.value=JSON.stringify(value);control.dispatchEvent(new CustomEvent('yikan:filterchange',{bubbles:true,detail:{value,version:config.version}}));dialog.close();};
 dialog.querySelectorAll('[data-filter-option]').forEach(b=>b.onclick=()=>{const f=config.fields.find(f=>f.key===b.dataset.filterKey),v=b.dataset.filterOption,selected=draft[f.key];draft[f.key]=f.mode==='single'?[v]:selected.includes(v)?selected.filter(x=>x!==v):[...selected,v];draft=filterValue(config.fields,draft);render();});}
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close();}},true);dialog.addEventListener('close',()=>{dialog.remove();document.body.style.overflow=previousOverflow;trigger.focus();},{once:true});render();dialog.showModal();dialog.querySelector('[data-filter-cancel]').focus();
};});}

const api={filterSchema,filterValue,filterVisible,propertyFilterFields,filterControl,hydrateFilters,organizationModel,organizationControl,hydrateOrganizations,validateDate,changeDate,dateLabel,withinBounds,dateControl,hydrateDates};if(typeof module!=='undefined')module.exports=api;global.YikanQueryControls=api;
})(globalThis);
