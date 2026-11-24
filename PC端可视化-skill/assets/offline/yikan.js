(function(global){
'use strict';
const A=typeof module!=='undefined'?require('./assets.js'):global.YikanAssets;
const N=typeof module!=='undefined'?require('./native-rings.js'):global.YikanNativeRings;
const Q=typeof module!=='undefined'?require('./query-controls.js'):global.YikanQueryControls;
const B=typeof module!=='undefined'?require('./business-ranking.js'):global.YikanBusinessRanking;
const T=typeof module!=='undefined'?require('./trial-components.js'):global.YikanTrial;
const C={blue:'#66A6FF',teal:'#33C1C1',cyan:'#3DC7F8',purple:'#959CF9',pale:'#8EAAD4',green:'#0FD486',red:'#FF375F',yellow:'#FFAC46'};
const SERIES_PALETTES=[null, ["#66A6FF"], ["#33C1C1", "#66A6FF"], ["#33C1C1", "#66A6FF", "#3DC7F8"], ["#33C1C1", "#66A6FF", "#3DC7F8", "#8EAAD4"], ["#33C1C1", "#66A6FF", "#3DC7F8", "#56B8FF", "#8EAAD4"], ["#33C1C1", "#66A6FF", "#3DC7F8", "#56B8FF", "#949CF8", "#8EAAD4"], ["#33C1C1", "#66A6FF", "#3DC7F8", "#56B8FF", "#2DCAE0", "#949CF8", "#8EAAD4"]];
function seriesPalette(count){const palette=SERIES_PALETTES[count];return palette?palette.slice():null;}
let uid=0;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const valid=x=>typeof x==='number'&&Number.isFinite(x);
const num=(x,n=2)=>valid(x)?x.toFixed(n):'—';
function icon(name,size=16){const id={'close':'6671-145689','back':'1515-514','more':'1515-873','info':'1564-502','trophy':'1564-500','expand':'1564-509','down':'1564-411','search':'1515-485','sort':'1564-543','asc':'1564-545','desc':'1564-548','up':'4424-46309','fall':'4424-46307','zero':'4424-48857','empty':'4424-48859','medal':'1515-809','check':'4424-46314'}[name]||name;return `<span class="yk-icon" style="width:${size}px;height:${size}px" aria-hidden="true">${A.icons[id]||''}</span>`;}
function statusTag({status,tone,label}={}){
 const states={高户效:'normal',低户效:'severe'};
 const resolved=Object.hasOwn(states,status)?states[status]:tone;
 if(!['inactive','info','normal','severe','danger'].includes(resolved))throw Error('状态标签需要已确认的状态或tone');
 const text=Object.hasOwn(states,status)?status:label;
 if(typeof text!=='string'||!text.trim())throw Error('状态标签需要文案');
 return `<span class="yk-status-tag" data-component="status-tag" data-source="7952:98702" data-tone="${resolved}">${esc(text)}</span>`;
}
function comparison({value=null,label='环',variant='detail',digits=2,unit='%'}={}){const state=!valid(value)?'empty':value===0?'zero':value>0?'up':'fall';return `<span class="yk-comparison ${esc(variant)} ${state}" data-state="${state}"><span>${esc(label)}</span><span>${valid(value)?num(Math.abs(value),digits)+esc(unit):'-'+esc(unit)}</span>${icon(state,variant==='mini'?10:variant==='compact'?12:14)}</span>`;}
function relativeChange(x,p){return valid(x)&&valid(p)&&p>0?(x/p-1)*100:null;}
function fundingModel(data){const {funding:T,charging:C,added:V}=data||{};if(![T,C,V].every(valid)||T<=0||C<0||V<0||C+V>T+1e-7)throw Error('资金口径未定义：需T>0、C/V非负且C+V≤T；不得改分母或裁切');const R=+(C+V).toFixed(8),U=+(T-R).toFixed(8);return {total:T,charging:C,added:V,actual:R,excluded:U,percent:R/T*100,excludedPercent:U/T*100};}
function money(x){return num(x,2)+'<small>万元</small>';}
function fundingBar({cumulative,current,category='charging'}={}){const m=fundingModel(cumulative);if(!['charging','added'].includes(category))throw Error('未知收益分类');const key='f'+(++uid),p=m.percent,first=category==='charging';const segments=[[m.charging,C.blue],[m.added,'#00C3D0']].filter(([value])=>value>0).map(([value,color])=>`<i style="flex-grow:${value/m.actual};background:${color}"></i>`).join('');const detail=cat=>`<div class="yk-funding-detail"><div><span>本期<br>${cat==='charging'?'充电收益':'增值收益'}</span><b>${money(current?.[cat])}</b></div><div><span>累计<br>${cat==='charging'?'充电收益':'增值收益'}</span><b>${money(cumulative[cat])}</b></div></div>`;
return `<section class="yk-funding yk-card" data-component="funding-bar" data-source="10044:65926/10044:66027" data-percent="${p}" data-excluded="${m.excludedPercent}" data-current-category="${category}"><div class="yk-funding-chart"><div class="yk-actual"><span>实际值（${num(m.actual/10000,5)}亿元）</span><div><strong>${num(p,1)}</strong><small>%</small></div></div><div class="yk-track" role="img" aria-label="实际收益合计占总流水${num(p,1)}%，未计入${num(m.excludedPercent,1)}%"><div class="yk-actual-range" style="width:${p}%;padding-inline:min(4px,${p/5}%) min(6px,${p/5}%);gap:min(2px,${p/8}%)">${segments}</div><span class="yk-range-marker" style="left:${p}%"></span></div><div class="yk-funding-total"><span>资金流水</span><b>${num(m.total/10000,2)}<small>亿</small></b></div></div><div class="yk-category-panel ${first?'charging':'added'}" id="${key}"><div class="yk-category-tabs" role="tablist" aria-label="收益分类">${['charging','added'].map((cat,i)=>`<button type="button" role="tab" aria-selected="${category===cat}" data-category="${cat}"><i style="background:${i?C.teal:'#66A7FF'}"></i>${i?'增值收益':'充电收益'}</button>`).join('')}</div><div class="yk-category-detail" role="tabpanel">${detail(category)}</div></div><template data-detail="charging">${detail('charging')}</template><template data-detail="added">${detail('added')}</template><details class="yk-data-note"><summary>数据口径</summary>总流水${money(m.total)}＝实际收益${money(m.actual)}＋未计入${money(m.excluded)}。两个色块合计占${num(p,1)}%，灰色占${num(m.excludedPercent,1)}%。<br>分类切换不改变合计比例和总流水。</details></section>`;}
function aiHint({text='',detail='',demo=false}={}){return `<details class="yk-ai" data-component="ai-hint"><summary style="--yk-ai-background:url('${A.aiBackground}')"><img src="${A.aiImage}" alt="AI解读"><span>${demo?'演示解读 · ':''}${esc(text)}</span><b>查看</b></summary><div class="yk-ai-detail">${esc(detail||text)}</div></details>`;}
function warning({status='yellow',text}={}){if(!['green','yellow','red','neutral'].includes(status))throw Error('未知状态');return `<p class="yk-warning ${status}"><span aria-hidden="true">●</span>${esc(text)}</p>`;}
const warningLightNames={green:'绿灯',yellow:'黄灯',red:'红灯'};
function warningRanking({title='预警排名',metrics,rows,showRules=false}={}){
 if(!Array.isArray(metrics)||!metrics.length||metrics.some(m=>!m?.label||!m?.name)||new Set(metrics.map(m=>m.label)).size!==metrics.length)throw Error('预警列需要独立的简称与完整指标名称');
 if(!Array.isArray(rows)||rows.some(r=>!Number.isInteger(r?.rank)||r.rank<1||typeof r.name!=='string'||!Array.isArray(r.lights)||r.lights.length!==metrics.length||r.lights.some(l=>l!==null&&!Object.hasOwn(warningLightNames,l))))throw Error('预警排名需要明确序位和已确认的亮灯状态');
 const key='warning-'+(++uid);
 const tableRows=rows.map(row=>{
  const lights=row.lights.map((light,i)=>`<span class="yk-warning-light ${light||'unknown'}" role="img" aria-label="${esc(metrics[i].name)}：${warningLightNames[light]||'无数据'}">${light?'':'—'}</span>`).join('');
  const redCount=row.lights.includes(null)?'—':row.lights.filter(light=>light==='red').length;
  return `<tr><td>${row.rank}</td><td>${esc(row.category||'—')}</td><th scope="row">${esc(row.name)}</th><td><div class="yk-warning-lights">${lights}</div></td><td data-warning-red-count>${redCount}</td></tr>`;
 }).join('');
 const names=metrics.map(m=>`<span title="${esc(m.name)}">${esc(m.label)}</span>`).join('');
 const scroll=`<div class="yk-warning-scroll" tabindex="0" aria-label="预警排名，左右滚动"><table><thead><tr><th scope="col">排名</th><th scope="col">分类</th><th scope="col">区域名称</th><th scope="col"><div class="yk-warning-lights" aria-label="预警指标">${names}</div></th><th scope="col">红灯数</th></tr></thead><tbody>${tableRows}</tbody></table></div>`;
 const rules=showRules?global.YikanWarningRules:null;
 return `<section class="yk-card yk-warning-ranking" data-component="warning-ranking" data-source="6671:171367">
  <header><h3>${esc(title)}</h3><div>${rules?`<button type="button" data-warning-dialog="rules" aria-haspopup="dialog">亮灯说明</button>`:''}<button type="button" data-warning-dialog="fullscreen" aria-label="全屏查看预警排名" aria-haspopup="dialog">${icon('expand',20)}</button></div></header>
  ${rows.length?scroll:'<p class="yk-missing">暂无预警排名</p>'}
  <dialog class="yk-warning-full-dialog yk-root" data-warning-target="fullscreen" data-source="6671:170726" aria-label="全屏预警排名"><button type="button" data-warning-close>退出全屏</button>${rows.length?scroll:'<p class="yk-missing">暂无预警排名</p>'}</dialog>
  ${rules?`<dialog class="yk-warning-rules-dialog yk-root" data-warning-target="rules" data-source="6671:171178/171633" aria-labelledby="${key}"><header><h3 id="${key}">亮灯说明</h3><button type="button" data-warning-close>关闭</button></header><div class="yk-warning-rules-body"><img src="${rules.image}" alt=""><div class="yk-warning-sr-only">${rules.transcript.map(line=>`<p>${esc(line)}</p>`).join('')}</div></div></dialog>`:''}
 </section>`;
}
function hydrateWarningRankings(root){
 root.querySelectorAll('.yk-warning-ranking').forEach(card=>{
  card.querySelectorAll('[data-warning-dialog]').forEach(button=>{
   const dialog=card.querySelector(`[data-warning-target="${button.dataset.warningDialog}"]`);
   button.onclick=()=>{
    const previousOverflow=document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow='hidden';
    dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;button.focus();},{once:true});
   };
   dialog.querySelector('[data-warning-close]').onclick=()=>dialog.close();
  });
 });
}
function risk({metric,value}={}){if(!valid(value))return null;let low,high;if(metric==='inflow')return value>=100?'green':value>=98?'yellow':'red';if(metric==='outflow')return value<=100?'green':value<=102?'yellow':'red';if(metric==='propertyGrowth'){low=60;high=95;}else if(metric==='livingRevenue'){low=80;high=95;}else if(metric==='profit'){low=85;high=95;}else return null;return value>=high?'green':value>=low?'yellow':'red';}
function point(cx,cy,r,a){return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
function arc(cx,cy,r,start,end){const delta=end-start;if(delta>=Math.PI*2-1e-7){const a=point(cx,cy,r,start),b=point(cx,cy,r,start+Math.PI);return `M${a} A${r},${r} 0 1 1 ${b} A${r},${r} 0 1 1 ${a}`;}const a=point(cx,cy,r,start),b=point(cx,cy,r,end);return `M${a} A${r},${r} 0 ${delta>Math.PI?1:0} 1 ${b}`;}
function nativeRingState({kind='single',state='normal',outlined=true}={}){const sample=N?.[kind]?.[state];if(!sample)throw Error('Unknown native ring state');return `<div class="yk-native-ring" data-component="native-ring-state" data-source="${esc(sample.id)}" data-kind="${kind}" data-state="${state}" data-provenance="original-svg">${outlined?sample.outlinedSvg:sample.svg}</div>`;}
function signedRingArc(value){const angle=Math.PI*2*Math.abs(value)/100,start=-Math.PI/2,sweep=value>=0?1:0,r=71.931803;const a=point(156,97,r,start);if(angle>=Math.PI*2-1e-8){const b=point(156,97,r,start+Math.PI);return `M${a} A${r},${r} 0 1 ${sweep} ${b} A${r},${r} 0 1 ${sweep} ${a}`;}const b=point(156,97,r,start+(sweep?angle:-angle));return `M${a} A${r},${r} 0 ${angle>Math.PI?1:0} ${sweep} ${b}`;}
function progressRing({value,name='',size=311}={}){
 if(!valid(value))return `<div class="yk-missing">${esc(name)}：—（缺少数据）</div>`;
 if(value < -100 || value > 200)return `<div class="yk-missing">${esc(name)}：${num(value)}%（多圈图形尚无确认规则，保留原值）</div>`;
 const state=value<0?'negative':value===0?'zero':value<100?'normal':value===100?'hundred':'over';
 const exact=Object.values(N?.single||{}).find(s=>s.value===value);
 if(exact&&name==='收费率')return `<div class="yk-single-ring" data-component="progress-ring" data-source="${esc(exact.id)}" data-state="${state}" data-provenance="original-sample-paths" role="img" aria-label="${esc(name)} ${num(value)}%" style="width:${valid(size)&&size>0?size:311}px;max-width:100%;margin:auto">${exact.outlinedSvg}</div>`;
 // Original sample paths are reused unchanged when its exact value is requested.
 const paths=exact?exact.svg.match(/<path\b[^>]*\/>/g).join(''):`<circle cx="156" cy="97" r="72" fill="none" stroke="#66A7FF" stroke-width="16" opacity=".1"/>${value!==0?`<path d="${signedRingArc(value>100?100:value)}" fill="none" stroke="#66A7FF" stroke-width="12.136394" stroke-linecap="round"/>`:''}${value>100?`<path d="${signedRingArc(value-100)}" fill="none" stroke="black" stroke-opacity=".36" style="mix-blend-mode:overlay" stroke-width="12.136394" stroke-linecap="round"/>`:''}`;
 return `<div class="yk-single-ring" data-component="progress-ring" data-source="4424:69842" data-state="${state}" data-provenance="${exact?'original-sample-paths':'parameter-binding'}"><svg viewBox="0 0 311 192" width="${valid(size)&&size>0?size:311}" role="img" aria-label="${esc(name)} ${num(value)}%">${paths}<text x="156" y="105.08" text-anchor="middle" fill="#22262F" font-family="PingFang SC,sans-serif"><tspan font-size="28" font-weight="600">${num(value)}</tspan><tspan font-size="14" font-weight="500">%</tspan></text><text x="156" y="125.04" text-anchor="middle" font-family="PingFang SC,sans-serif" font-size="14" fill="#9199A2">${esc(name)}</text></svg></div>`;
}
function multiRing({items=[]}={}){if(items.length>3)throw Error('本独立多环变体最多3轨，不能强行挤入');const colors=[C.teal,'#56B8FF',C.purple],centers=[81,81,81],radii=[72.9,53.1,33.1],widths=[16.2,15.86,13.12];const rings=items.map((it,i)=>{if(!valid(it.value)||it.value<0||it.value>100)return '';const start=Math.PI*1.5;return `<path d="${arc(81,81,radii[i],start,start+Math.PI*1.5)}" fill="none" stroke="${colors[i]}" stroke-width="${widths[i]}" opacity=".14"/><path d="${arc(81,81,radii[i],start,start+Math.PI*1.5*it.value/100)}" fill="none" stroke="${colors[i]}" stroke-width="${[9.36,9.28,7.6][i]}" stroke-linecap="round"/>`;}).join('');return `<div class="yk-multi" data-component="independent-rings" data-source="4424:74002"><svg viewBox="0 0 162 162" width="162" height="162" aria-label="三个独立比率">${rings}</svg><div class="yk-ring-readings">${items.map((it,i)=>`<div><span><i style="background:${colors[i]}"></i>${esc(it.name)}</span><strong>${num(it.value)}<small>%</small></strong>${valid(it.value)&&(it.value<0||it.value>100)?'<small>范围图形待定义</small>':''}</div>`).join('')}</div></div>`;}
function donut({items=[],center='',label='',selected=-1}={}){if(items.some(x=>!valid(x.value)||x.value<0))throw Error('构成环要求非负且完整数据');const total=items.reduce((a,x)=>a+x.value,0);if(total===0)return '<div class="yk-missing">暂无构成数据（总量为0）</div>';let a=-Math.PI/2;const colors=[C.blue,C.teal,C.cyan,'#56B8FF',C.purple,C.pale];const paths=items.map((it,i)=>{const b=a+Math.PI*2*it.value/total;const p=`<path d="${arc(90,90,i===selected?75:70,a,b)}" stroke="${it.color||colors[i%colors.length]}" stroke-width="${i===selected?30:25}" fill="none"/>`;a=b;return p;}).join('');return `<div class="yk-donut-group" data-component="composition-ring" data-source="5533:66598"><svg viewBox="0 0 180 180" width="180" height="180" aria-label="${esc(label)}构成"><g>${paths}</g><text x="90" y="90" text-anchor="middle" class="yk-ring-value">${esc(center||num(total,0))}</text><text x="90" y="116" text-anchor="middle" class="yk-chart-label">${esc(label)}</text></svg><div class="yk-legend-list">${items.map((it,i)=>`<div><i style="background:${it.color||colors[i%colors.length]}"></i><span>${esc(it.name)}</span><b>${num(it.value/total*100)}%<small>${esc(it.display??num(it.value))}</small></b></div>`).join('')}</div></div>`;}
function deviceComposition({current,cumulative,category='owned'}={}){if(!current||!cumulative||![cumulative.total,cumulative.owned,cumulative.external].every(valid)||cumulative.owned+cumulative.external!==cumulative.total)throw Error('设备总量需等于两来源合计');if(!['owned','external'].includes(category))throw Error('未知设备分类');const detail=cat=>`<div class="yk-funding-detail"><div><span>本期新增<br>${cat==='owned'?'自有项目':'外拓项目'}</span><b>${num(current[cat+'_new'],0)}<small>桩</small></b></div><div><span>累计<br>${cat==='owned'?'自有项目':'外拓项目'}</span><b>${num(cumulative[cat],0)}<small>桩</small></b></div></div>`;return `<section class="yk-card yk-device" data-component="device-composition" data-source="5790:97172" data-current-category="${category}">${donut({items:[{name:'自有项目',value:cumulative.owned},{name:'外拓项目',value:cumulative.external}],center:num(cumulative.total,0),label:'设备总数（桩）'})}<div class="yk-category-panel ${category==='owned'?'charging':'added'}"><div class="yk-category-tabs" role="tablist" aria-label="设备来源">${['owned','external'].map((cat,i)=>`<button type="button" role="tab" aria-selected="${cat===category}" data-category="${cat}"><i style="background:${i?C.teal:C.blue}"></i>${i?'外拓项目':'自有项目'}</button>`).join('')}</div><div class="yk-category-detail" role="tabpanel">${detail(category)}</div></div><template data-detail="owned">${detail('owned')}</template><template data-detail="external">${detail('external')}</template></section>`;}
function safeRange(values,includeZero=false){const v=values.filter(valid);if(!v.length)return [0,1];let a=Math.min(...v),b=Math.max(...v);if(includeZero){a=Math.min(a,0);b=Math.max(b,0);}if(a===b){a-=Math.abs(a)*.1||1;b+=Math.abs(b)*.1||1;}return [a,b];}
// Formatting rules: source 6671:132763. Nice bounds are a local implementation policy.
function axisModel(values,{unit='',range}={}){
 const input=values.filter(valid), raw=range||safeRange(input);let [a,b]=raw;
 if(!valid(a)||!valid(b)||a>=b)throw Error('Invalid axis range');
 const prefix=unit.startsWith('亿')?1e8:unit.startsWith('万')?1e4:1;
 const magnitude=Math.max(Math.abs(a),Math.abs(b))*prefix;
 const scale=unit==='%'?1:magnitude>=1e8?1e8:magnitude>=1e4?1e4:1;
 const suffix=unit==='%'?'%':scale===1e8?'亿':scale===1e4?'万':'';
 const ratio=prefix/scale;let lo=a*ratio,hi=b*ratio;
 const rough=(hi-lo)/5,power=10**Math.floor(Math.log10(rough));
 let step,start;for(const k of [1,2,2.5,4,5,10,20]){step=k*power;start=Math.floor(lo/step+1e-10)*step;if(start+5*step>=hi-1e-9)break;}
 const ticks=Array.from({length:6},(_,i)=>+(start+i*step).toPrecision(12));
 let digits=0;while(digits<8&&Math.abs(step*10**digits-Math.round(step*10**digits))>1e-7)digits++;
 const labels=ticks.map(v=>(Math.abs(v)<1e-10?0:v).toFixed(digits)+suffix);
 return {range:[ticks[0]/ratio,ticks[5]/ratio],ticks,labels,digits,scale,suffix,unit:unit.replace(/^[万亿]/,'')};
}
function trendValue(value,series){if(!valid(value))return '—';const digits=series.digits??(series.unit==='%'||/[元米]|万|亿/.test(series.unit||'')?2:0);return num(value,digits)+esc(series.unit||'');}
function trend({time=[],series=[],selectedIndex=time.length-1}={}){if(series.some(s=>s.values.length!==time.length))throw Error('趋势数据必须对齐时间轴');const key='t'+(++uid);let n=time.length;if(!n||!series.length)return '<div class="yk-missing">暂无趋势数据</div>';let i=Math.max(0,Math.min(n-1,selectedIndex));const axes={};for(const side of ['left','right']){const group=series.filter(s=>(s.axis==='right'?'right':'left')===side);const units=[...new Set(group.map(s=>s.unit||''))];if(units.length>1)throw Error('同轴系列须先统一单位，不能混用'+units.join('/'));axes[side]=axisModel(group.flatMap(s=>s.values),{unit:units[0]||''});}const ranges={left:axes.left.range,right:axes.right.range};const plotLeft=Math.max(34,...axes.left.labels.map(t=>t.length*6.5+6)),plotRight=311-(series.some(s=>s.axis==="right")?Math.max(34,...axes.right.labels.map(t=>t.length*6.5+6)):12);const X=j=>plotLeft+(n===1?.5:j/(n-1))*(plotRight-plotLeft),Y=(v,axis)=>{const [a,b]=ranges[axis==='right'?'right':'left'];return 148-(v-a)/(b-a)*124;};const palette=seriesPalette(series.length)||[];if(!palette.length&&series.some(s=>!s.color))throw Error('超过规范候选色序的系列需明确指定颜色或分组方案');const grid=[0,.2,.4,.6,.8,1].map((t,tickIndex)=>{const y=148-t*124;return `<line x1="${plotLeft}" x2="${plotRight}" y1="${y}" y2="${y}" stroke="#E5E6EB" stroke-width=".5" stroke-dasharray="2 2"/><text x="${plotLeft-4}" y="${y+4}" text-anchor="end" class="yk-axis">${esc(axes.left.labels[tickIndex])}</text>${series.some(s=>s.axis==='right')?`<text x="${plotRight+4}" y="${y+4}" class="yk-axis">${esc(axes.right.labels[tickIndex])}</text>`:''}`;}).join('');const paths=series.map((s,j)=>{let d='',open=false;for(let k=0;k<n;k++){if(!valid(s.values[k])){open=false;continue;}d+=`${open?'L':'M'}${X(k)},${Y(s.values[k],s.axis)} `;open=true;}return `<g data-series="${j}"><path d="${d}" stroke="${s.color||palette[j]}" stroke-width="1.5" fill="none" stroke-linejoin="round"/>${valid(s.values[i])?`<circle cx="${X(i)}" cy="${Y(s.values[i],s.axis)}" r="2.65" fill="white" stroke="${s.color||palette[j]}" stroke-width="1.5"/>`:''}</g>`;}).join('');return `<section class="yk-trend" data-component="trend" data-source="5635:74035/5635:73983" id="${key}"><div class="yk-axis-units">左：${esc(axes.left.unit||'数值')}${series.some(s=>s.axis==='right')?'　右：%':''}</div><svg viewBox="0 0 311 192" role="img" aria-label="联合趋势">${grid}${paths}<line x1="${X(i)}" x2="${X(i)}" y1="18" y2="155" stroke="black" opacity=".1" stroke-dasharray="2 2"/>${[...new Set([0,Math.floor((n-1)/2),n-1])].map(k=>`<text x="${X(k)}" y="176" text-anchor="middle" class="yk-axis">${esc(time[k])}</text>`).join('')}</svg><div class="yk-trend-legends">${series.map((s,j)=>`<label><input type="checkbox" checked data-toggle-series="${j}"><i style="background:${s.color||palette[j]}"></i>${esc(s.name)}</label>`).join('')}</div><label class="yk-time-select">选中时点 <select data-time-select>${time.map((t,j)=>`<option value="${j}" ${i===j?'selected':''}>${esc(t)}</option>`).join('')}</select></label><div class="yk-no-series" hidden>请选择要查看的系列</div><table class="yk-table yk-trend-table"><thead><tr><th>类型</th><th>实际值</th><th>上期</th><th>环比</th></tr></thead><tbody>${series.map((s,j)=>`<tr data-series="${j}"><td><i style="background:${s.color||palette[j]}"></i>${esc(s.name)}</td><td>${trendValue(s.values[i],s)}</td><td>${trendValue(s.values[i-1],s)}</td><td>${valid(relativeChange(s.values[i],s.values[i-1]))?num(relativeChange(s.values[i],s.values[i-1]))+'%':'—'}</td></tr>`).join('')}</tbody></table><script type="application/json" class="yk-trend-data">${JSON.stringify({time,series,selectedIndex:i}).replace(/</g,'\\u003c')}</script></section>`;}
function ranking({title='自身排名',columns=[],rows=[],selfRank,totalPeers,firstColumnWidth=140,rowIds=[],drillable=[],searchColumn=1,appearance,rateColumn}={}){if(rows.some(r=>r.length!==columns.length))throw Error('排名字段数量不一致');const rankNumber=chartNumberFormatter(2);return `<section class="yk-card yk-ranking" data-component="ranking" data-source="5721:75298"${Number.isInteger(rateColumn)?' data-rate-column="'+rateColumn+'"':''}${appearance==='indicatorDetail'?' data-ranking-appearance="indicatorDetail" data-background-source="4424:69091"':''}><header><h3>${esc(title)}</h3><span>${icon('trophy',20)}<strong>${valid(selfRank)?esc(selfRank):''}</strong><small>${valid(selfRank)?'/'+esc(totalPeers):''}</small><button type="button" data-ranking-expand aria-label="全屏查看排名">${icon('expand',20)}</button></span></header><label class="yk-search">${icon('search')}<select data-rank-search-column aria-label="搜索列">${columns.map((c,i)=>`<option value="${i}" ${i===searchColumn?'selected':''}>${esc(c)}</option>`).join('')}</select><input aria-label="排名搜索" placeholder="请输入项目名称查询" type="search" data-rank-search></label><div class="yk-table-scroll" tabindex="0" aria-label="完整排名，左右滚动"><table class="yk-table" style="width:${64+firstColumnWidth+Math.max(0,columns.length-2)*120}px;min-width:100%;table-layout:fixed"><colgroup>${columns.map((c,i)=>`<col style="width:${i===0?64:i===1?firstColumnWidth:120}px">`).join('')}</colgroup><thead><tr>${columns.map((c,i)=>`<th><button type="button" data-sort-column="${i}">${esc(c)}${icon('sort')}</button></th>`).join('')}</tr></thead><tbody>${rows.map((r,rowIndex)=>`<tr class="${r[0]===selfRank?'self':''}" data-self="${r[0]===selfRank}" data-values="${esc(JSON.stringify(r))}">${r.map((v,i)=>`<td>${i===0&&v===1?icon('medal',18):''}${i===1&&drillable[rowIndex]===true&&typeof rowIds[rowIndex]==='string'?`<button type="button" class="yk-ranking-drill" data-ranking-drill="${esc(rowIds[rowIndex])}">${esc(v)}</button>`:i===rateColumn?(valid(v)?rankNumber.format(v)+'%':'—'):esc(v)}${i===1&&r[0]===selfRank?'<small class="yk-self-tag">自身</small>':''}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="yk-table-hint">左右滑动查看全部指标 · 测试交互不代表生产权限</p></section>`;}
const homeSourceLayouts={
 '6671:152733':'children',
 '6671:152767':'single',
 '6671:152778':'double',
 '6671:152800':'single',
 '6671:152814':'single',
 '6671:152825':'single',
};
function homeCard({name,value,unit='',updated='',comparisonValue=null,comparisonLabel,children=[],theme='blue',second=null,source}={}){
 const layout=source?homeSourceLayouts[source]:null;
 if(source&&(!Object.hasOwn(homeSourceLayouts,source)||layout==='children'&&(children.length!==3||second)||layout==='double'&&(!second||children.length)||layout==='single'&&(second||children.length)))throw Error('主页指标配置与一看源卡槽位不符');
 const label=comparisonLabel??(layout?'同':'环');
 const row=homeCardRow({name,value,unit,updated,comparisonValue,comparisonLabel:label,main:true});
 const childRows=children.map(c=>`<div><span>${esc(c.name)}</span><b>${esc(c.value)}<small>${esc(c.unit||'')}</small></b>${comparison({value:c.change,label:c.comparisonLabel??label,variant:'home compact'})}</div>`).join('');
 return `<section class="yk-home-card ${esc(theme)}" data-component="home-card" data-source="${layout?source:'4424:66070/66104/66115'}"${layout?' data-home-layout="'+layout+'"':''}>${row}${childRows?`<div class="yk-home-children">${childRows}</div>`:''}${second?`<div class="yk-home-divider"></div>${homeCardRow({...second,comparisonLabel:second.comparisonLabel??label})}`:''}</section>`;
}
function homeCardRow({name,value,unit='',updated='',comparisonValue=null,comparisonLabel,main=false}){
 return `<div class="yk-home-row"><div><h3>${esc(name)}</h3><small>更新${main?' ':''}${esc(updated)}</small></div><div class="yk-home-number"><strong>${esc(value)}<small>${esc(unit)}</small></strong>${comparison({value:comparisonValue,label:comparisonLabel,variant:'home'})}</div></div>`;
}
function tabs(items,{selected=0}={}){return `<div class="yk-tabs" role="tablist">${items.map((n,i)=>`<button type="button" role="tab" aria-selected="${i===selected}" data-basic-tab="${i}">${esc(n)}</button>`).join('')}</div>`;}
function homeOrganizationRail(nodes,value,peers){
 const current=nodes.find(node=>node.id===value);
 const items=peers.filter(id=>id!==value).map(id=>nodes.find(node=>node.id===id));
 return `<strong tabindex="-1" data-home-selected>${esc(current.name)}</strong>${items.length?`<div class="yk-home-peers" aria-label="同级组织">${items.map(node=>`<button type="button" data-home-peer="${esc(node.id)}">${esc(node.name)}</button>`).join('')}</div>`:''}`;
}
function homeHeader({title='一看',organizations=[],value,peerIds=[],showBrand=false}={}){
 const control=Q.organizationControl({nodes:organizations,value,searchTrigger:true});
 const current=organizations.find(node=>node.id===value);
 if(!current||new Set(peerIds).size!==peerIds.length||peerIds.some(id=>!organizations.some(node=>node.id===id&&node.selectable&&(node.parentId??null)===(current.parentId??null))))throw Error('主页需提供当前组织及授权同级组织');
 const peers=[value,...peerIds.filter(id=>id!==value)];
 return `<header class="yk-home-header" data-component="home-header" data-source="4424:66053">
 <div class="yk-navbar">${icon('back',24)}<h1>${esc(title)}</h1>${icon('more',24)}</div>
 <div class="yk-home-actions">${control}</div>${showBrand?'<div class="yk-home-brand" role="img" aria-label="一看品牌形象"></div>':''}
 <div class="yk-home-org-rail">${homeOrganizationRail(organizations,value,peers)}</div>
 <script type="application/json" class="yk-home-peers-config">${JSON.stringify(peers).replace(/</g,'\\u003c')}</script></header>`;
}
function hydrateHomeHeaders(root){
 root.querySelectorAll('.yk-home-header').forEach(header=>{
  const control=header.querySelector('.yk-org-control');
  const nodes=JSON.parse(control.querySelector('.yk-org-config').textContent).nodes;
  const peers=JSON.parse(header.querySelector('.yk-home-peers-config').textContent);
  const rail=header.querySelector('.yk-home-org-rail');
  if(rail.onclick)return;
  header.addEventListener('yikan:organizationchange',event=>{
   const value=event.detail.value.id;
   rail.innerHTML=homeOrganizationRail(nodes,value,peers.includes(value)?peers:[]);
  });
  rail.onclick=event=>{
   const id=event.target.closest('[data-home-peer]')?.dataset.homePeer;
   if(!id)return;
   const map=new Map(nodes.map(node=>[node.id,node])),path=[];
   for(let node=map.get(id);node;node=map.get(node.parentId))path.unshift(node);
   control.dataset.value=id;
   control.dispatchEvent(new CustomEvent('yikan:organizationchange',{bubbles:true,detail:{value:map.get(id),path}}));
   rail.querySelector('[data-home-selected]').focus();
  };
 });
}
function homeNavigation({selected=0}={}){
 if(![0,1,2].includes(selected))throw Error('底部导航选中项应为 0、1 或 2');
 return `<footer class="yk-home-bottom" data-component="home-navigation" data-source="4424:66066" aria-label="主导航"><nav class="yk-home-bottom-tabs">${['首页','指标','我的'].map((name,index)=>`<button type="button" aria-label="${name}" ${index===selected?'aria-current="page"':''} data-home-nav="${index}"><span class="yk-home-tab-image" data-tab-image="${index}" aria-hidden="true"></span></button>`).join('')}</nav><div class="yk-home-indicator" aria-hidden="true"></div></footer>`;
}
function hydrateHomeNavigation(root){
 root.querySelectorAll('[data-component="home-navigation"]').forEach(nav=>{
  nav.onclick=event=>{
   const button=event.target.closest('[data-home-nav]');
   if(!button||button.getAttribute('aria-current')==='page')return;
   nav.querySelectorAll('[data-home-nav]').forEach(item=>item.removeAttribute('aria-current'));
   button.setAttribute('aria-current','page');
   nav.dispatchEvent(new CustomEvent('yikan:navigationchange',{bubbles:true,detail:{index:Number(button.dataset.homeNav),name:button.getAttribute('aria-label')}}));
  };
 });
}
function homeDashboard({project,highlight,cards=[]}={}){
 const renderers={homeCard,homePerformanceCard,homeProfitExplanation,homeCashflowTargets};
 const fields=[['项目来源','origin'],['建筑面积','area'],['收费标准','fee']];
 const projectInfo=project?`<dl class="yk-home-project-info">${fields.map(([label,key])=>`<div><dt>${label}</dt><dd>${esc(project[key]??'—')}</dd></div>`).join('')}</dl>`:'';
 const focus=highlight?`<p class="yk-home-highlight"><span>${esc(highlight.label)}</span><strong>${esc(highlight.value??'—')}</strong></p>`:'';
 const metrics=cards.map(({type,props})=>{
  if(!Object.hasOwn(renderers,type))throw Error('主页卡类型未登记');
  return renderers[type](props);
 }).join('');
 return projectInfo+focus+(metrics||'<p class="yk-home-empty">暂无指标数据</p>');
}
function header(options={}){
 if(options.layout==='indicatorDetail')return T.indicatorHeader(options);
 const {title='一看',date='2026年10月',value='',unit='',metricName='资金流水',yoy=null,mom=null,ai=null,summaryBackground}=options;
 const variant=['detail','compact'].includes(summaryBackground)?summaryBackground:null;
 const body=`${value!==''?`<div class="yk-summary"><span>${esc(metricName)} ${icon('info')}</span><div><strong>${esc(value)}</strong><small>${esc(unit)}</small></div><div class="yk-summary-comparisons">${comparison({value:yoy,label:'同'})}${comparison({value:mom,label:'环'})}</div></div>`:''}${ai?aiHint(ai):''}`;
 return `<header class="yk-header"><div class="yk-navbar">${icon('back',24)}<h1>${esc(title)}</h1>${icon('more',24)}</div><div class="yk-date"><span>${esc(date)}${icon('down')}</span><span>年度 · 月度 · 按日</span></div>${variant&&body?`<div class="yk-header-summary" data-summary-background="${variant}">${body}</div>`:body}</header>`;
}
function bars({labels=[],series=[],unit='',stacked=false}={}){if(series.some(s=>s.values.length!==labels.length))throw Error('柱图序列需对齐');const n=labels.length;if(!n)return '<div class="yk-missing">暂无数据</div>';const vals=stacked?labels.map((_,i)=>series.reduce((a,s)=>a+(valid(s.values[i])?s.values[i]:0),0)):series.flatMap(s=>s.values);if(stacked&&series.some(s=>s.values.some(v=>valid(v)&&v<0)))throw Error('负数堆叠需业务规则');let [min,max]=safeRange(vals,true);const y=v=>150-(v-min)/(max-min)*126,zero=y(0),bw=Math.min(12,220/n/(stacked?1:Math.max(1,series.length))-2);let marks='';labels.forEach((l,i)=>{let sum=0;series.forEach((s,j)=>{const v=s.values[i];if(!valid(v))return;const x=40+i*240/n+(stacked?0:j*(bw+2));const hi=stacked?sum+v:v,lo=stacked?sum:0;marks+=`<rect x="${x}" y="${Math.min(y(hi),y(lo))}" width="${bw}" height="${Math.abs(y(hi)-y(lo))}" rx="4" fill="${s.color||(v<0?C.red:C.teal)}" opacity="${s.period==='previous'?.5:1}"/>`;sum+=v;});marks+=`<text x="${40+i*240/n}" y="175" class="yk-axis">${esc(l)}</text>`;});return `<div data-component="${stacked?'stacked-bars':'grouped-bars'}"><p class="yk-axis-units">${esc(unit)}</p><svg viewBox="0 0 311 192" role="img" aria-label="类别比较"><line x1="28" x2="290" y1="${zero}" y2="${zero}" stroke="#E5E6EB"/>${marks}</svg><div class="yk-trend-legends">${series.map((s,i)=>`<span><i style="background:${s.color||C.teal}"></i>${esc(s.name)}</span>`).join('')}</div></div>`;}
function horizontalBars({items=[],unit=''}={}){const max=Math.max(1,...items.map(i=>Math.abs(i.value||0)));return `<div class="yk-horizontal" data-component="horizontal-bars">${items.map(i=>`<div><span>${esc(i.name)}</span><div class="yk-inline-track"><i style="width:${Math.abs(i.value||0)/max*100}%;background:${i.value<0?C.red:C.teal}"></i></div><b>${num(i.value)}${esc(unit)}</b></div>`).join('')}</div>`;}
function funnel({items=[]}={}){if(items.some(i=>!valid(i.value)||i.value<0))throw Error('阶段数值需非负');const max=Math.max(1,...items.map(i=>i.value));return `<div class="yk-funnel" data-component="funnel" data-provenance="documented-suggestion">${items.map((i,j)=>`<div style="width:${Math.max(20,i.value/max*100)}%;background:${[C.teal,C.cyan,C.blue,C.purple][j%4]}">${esc(i.name)} ${num(i.value,0)}</div>`).join('')}</div>`;}
function chartNumberFormatter(digits){
 if(!Number.isInteger(digits)||digits<0||digits>6)throw Error('精度应为 0–6 位小数');
 return new Intl.NumberFormat('zh-CN',{maximumFractionDigits:digits,useGrouping:false});
}
function stageConversion({items=[],unit='',valueDigits=2,rateDigits=2}={}){
 if(items.length!==3||items.some(item=>!item?.name||item.value!==null&&(!valid(item.value)||item.value<0))){
  throw Error('阶段图需三个有序阶段，阶段值为非负数或 null');
 }
 const known=items.map(item=>item.value).filter(valid);
 if(known.some((value,index)=>index&&value>known[index-1]))throw Error('圈选、触达、完成应保持同批客户的包含关系');
 const formatValue=chartNumberFormatter(valueDigits);
 const formatRate=chartNumberFormatter(rateDigits);
 const rate=(previous,next)=>previous>0&&valid(next)?formatRate.format(next/previous*100)+'%':'—';
 const rates=[rate(items[0].value,items[1].value),rate(items[1].value,items[2].value)];
 const overall=rate(items[0].value,items[2].value);
 const max=Math.max(0,...known);
 const stageColors=[C.teal,'#56B8FF',C.cyan];
 const x=[63.5,146.5,225.5],barWidth=42,baseline=249;
 const top=items.map(item=>valid(item.value)&&max>0?baseline-(item.value/max)*162:baseline);
 const links=rates.map((_,index)=>valid(items[index].value)&&valid(items[index+1].value)
  ?`<path d="M${x[index]+barWidth} ${top[index]}L${x[index+1]} ${top[index+1]}V${baseline}H${x[index]+barWidth}Z" fill="#F7F8FA"/>`:'').join('');
 const bars=items.map((item,index)=>{
  if(!valid(item.value))return '';
  return `<rect x="${x[index]}" y="${top[index]}" width="${barWidth}" height="${baseline-top[index]}" fill="${stageColors[index]}"/><line x1="${x[index]-.25}" x2="${x[index]-.25}" y1="63" y2="${top[index]}" stroke="#CCCFD6" stroke-width=".5" stroke-dasharray="2 2"/>`;
 }).join('');
 const tags=rates.map((value,index)=>{
  const left=x[index]+barWidth, textX=left+29;
  return `<path d="M${left} 209h54l6.5 10-6.5 10H${left}Z" fill="white" fill-opacity=".96"/><text x="${textX}" y="224" text-anchor="middle" fill="#22262F" font-size="13">${value}</text>`;
 }).join('');
 const labels=items.map((item,index)=>`<li><span style="color:${stageColors[index]}">${esc(item.name)}</span><strong>${valid(item.value)?esc(formatValue.format(item.value)+unit):'—'}</strong></li>`).join('');
 const details=rates.map((value,index)=>`<li><span>${esc(items[index].name)} → ${esc(items[index+1].name)}</span><b>${value}</b></li>`).join('');
 return `<figure class="yk-card yk-stage-conversion" data-component="stage-conversion" data-source="6695:316711"><ol class="yk-stage-labels">${labels}</ol><svg viewBox="0 63 343 186" aria-hidden="true">${links}${bars}${tags}</svg><figcaption><ul>${details}<li><span>全链路转化</span><b>${overall}</b></li></ul></figcaption></figure>`;
}
function cashflowInline({groups=[],unit='',digits=2,scope=''}={}){
 if(groups.some(group=>!group?.name||!Array.isArray(group.rows)||group.rows.some(row=>!row?.name||row.value!==null&&!valid(row.value)))){
  throw Error('现金流行内条需分组、行名称与有限数值或 null');
 }
 if(!groups.some(group=>group.rows.length))return '<p class="yk-missing">暂无现金流数据</p>';
 const format=chartNumberFormatter(digits);
 const extent=groups.reduce((max,group)=>group.rows.reduce((largest,{value})=>valid(value)?Math.max(largest,Math.abs(value)):largest,max),0);
 const tableRows=groups.map(group=>`<tbody><tr class="yk-cashflow-group"><th colspan="3" scope="rowgroup">${esc(group.name)}</th></tr>${group.rows.map(row=>{
  const value=row.value,direction=value===null?'missing':value===0?'zero':value>0?'positive':'negative';
  const exact=value===null?'—':(value>0?'+':value<0?'−':'')+format.format(Math.abs(value))+unit;
  const fill=value!==null&&value!==0?`<i style="width:${Math.abs(value)/extent*100}%"></i>`:'';
  return `<tr><th scope="row">${esc(row.name)}</th><td class="yk-cashflow-value" data-sign="${direction}">${esc(exact)}</td><td><span class="yk-cashflow-track" aria-hidden="true"><span data-direction="${direction}">${fill}</span></span></td></tr>`;
 }).join('')}</tbody>`).join('');
 return `<section class="yk-card yk-cashflow-inline" data-component="cashflow-inline" data-source="6695:315631">${scope?`<h3>${esc(scope)}</h3>`:''}<table><thead><tr><th scope="col">类型</th><th scope="col">实际值</th><th scope="col">图示</th></tr></thead>${tableRows}</table></section>`;
}
function actualTarget({actual=null,target=null,unit='',targetLabel='军令状',segments=[],digits=2}={}){
 if([actual,target].some(value=>value!==null&&(!valid(value)||value<0)))throw Error('目标条要求非负、同单位的实际值和目标，缺失填 null');
 if(!Array.isArray(segments)||segments.length>2||segments.some(value=>!valid(value)||value<0))throw Error('目标条支持最多两段非负组成');
 const sum=segments.reduce((total,value)=>total+value,0);
 if(segments.length&&(!valid(actual)||Math.abs(sum-actual)>Math.max(1e-10,actual*1e-10)))throw Error('目标条组成合计须等于实际值');
 const format=chartNumberFormatter(digits);
 const formatAmount=value=>value===null?'—':format.format(value)+unit;
 const rate=target>0&&actual!==null?actual/target*100:null;
 const completion=valid(rate)?format.format(rate)+'%':'—';
 const range=Math.max(actual??0,target??0);
 const position=value=>range>0?value/range*100:0;
 const parts=segments.length?segments:[actual];
 const segmentColors=['#66A6FF','#3DC7F8'];
 const bar=actual>0?`<span class="yk-target-fill" style="width:${position(actual)}%;padding-inline:min(4px,${position(actual)/6}%) min(6px,${position(actual)/6}%)">${parts.map((value,index)=>value>0?`<i style="flex-grow:${value/actual};background:${segmentColors[index]}"></i>`:'').join('')}</span>`:'';
 const actualMarker=actual===null?'':`<i data-actual-marker style="left:${position(actual)}%"></i>`;
 const targetMarker=target===null?'':`<i data-target-marker style="left:${position(target)}%"></i>`;
 return `<section class="yk-card yk-actual-target" data-component="actual-target" data-source="6695:316767">
 <div class="yk-target-summary"><span>实际值（${esc(formatAmount(actual))}）</span><strong aria-label="完成率：${completion}">${completion}</strong></div>
 <div class="yk-target-bottom"><div class="yk-target-track" aria-hidden="true">${bar}${actualMarker}${targetMarker}</div><div class="yk-target-label"><span>${esc(targetLabel)}</span><b>${esc(formatAmount(target))}</b></div></div>
 </section>`;
}
function chargeRateTarget({title='',rows=[],digits=2}={}){
 if(!Array.isArray(rows)||rows.length<1||rows.length>2||rows.some(row=>!row?.name||[row.actual,row.target].some(value=>value!==null&&(!valid(value)||value<0||value>100)))){
  throw Error('收费率目标卡需要 1–2 项指标，实际与目标使用 0–100 的百分数或 null');
 }
 const format=chartNumberFormatter(digits);
 const percent=value=>value===null?'—':format.format(value)+'%';
 const items=rows.map(row=>{
  const difference=row.actual!==null&&row.target!==null?Number((row.actual-row.target).toFixed(10)):null;
  const change=difference===null?'—':difference<0?`缺口 ${format.format(-difference)} 个百分点`:difference>0?`超目标 ${format.format(difference)} 个百分点`:'已达到目标';
  const tone=difference===null?'':difference<0?'below':'met';
  const fill=row.actual===null?'':`<i style="width:${row.actual}%"></i>`;
  const marker=row.target===null?'':`<b style="left:${row.target}%"></b>`;
  return `<div class="yk-charge-rate-row">
   <div class="yk-charge-rate-label"><span>${esc(row.name)}</span><strong>${percent(row.actual)}</strong><small>/ 目标 ${percent(row.target)}</small><em class="${tone}">${change}</em></div>
   <div class="yk-charge-rate-track" aria-hidden="true">${fill}${marker}</div>
  </div>`;
 }).join('');
 return `<section class="yk-card yk-charge-rate-target" data-component="charge-rate-target" data-source="6695:316799">${title?`<h3>${esc(title)}</h3>`:''}${items}</section>`;
}
function contractTrend({periods=[],eligibleLabel='已收楼户数',signedLabel='已签约户数',rateLabel='签约率',selectedIndex=periods.length-1}={},{withSummary=false,expanded=true}={}){
 if(!Array.isArray(periods)||periods.some(period=>typeof period?.label!=='string'||!period.label.trim()||[period.eligible,period.signed].some(value=>value!==null&&(!Number.isSafeInteger(value)||value<0)))){
  throw Error('户数柱线图需要期间标签以及非负整数户数，空值填 null');
 }
 if(!periods.length)return '<p class="yk-missing">暂无期间数据</p>';
 if(periods.some(period=>period.eligible!==null&&period.signed!==null&&period.signed>period.eligible)){
  throw Error('同期间签约率的分子不能超过分母');
 }
 if(!Number.isInteger(selectedIndex)||selectedIndex<0||selectedIndex>=periods.length)throw Error('无效的柱线图期间索引');
 const units=chartNumberFormatter(0);
 const percentages=chartNumberFormatter(2);
 const rates=periods.map(period=>period.eligible>0&&period.signed!==null?period.signed/period.eligible*100:null);
 const counts=periods.flatMap(period=>[period.eligible,period.signed]);
 const countMax=counts.reduce((max,value)=>valid(value)?Math.max(max,value):max,5);
 const axis=axisModel([],{range:[0,countMax],unit:'户'});
 const labelWidth=periods.reduce((width,period)=>Math.max(width,[...period.label].reduce((sum,char)=>sum+(/^[ -~]$/.test(char)?6:11),0)+4),21);
 const plotWidth=Math.max(311,88+labelWidth*periods.length),left=44,right=plotWidth-43;
 const top=24,bottom=154,height=bottom-top;
 const step=(right-left)/periods.length;
 const x=index=>left+step*(index+.5);
 const countY=value=>bottom-value/axis.range[1]*height;
 const rateY=value=>bottom-value/100*height;
 const grid=axis.labels.map((label,index)=>{
  const y=bottom-index*height/5;
  return `<path d="M${left} ${y} H${right}" class="yk-contract-grid"${index?' stroke-dasharray="2 2"':''}/><text x="${left-5}" y="${y+4}" text-anchor="end">${label}</text><text x="${right+5}" y="${y+4}">${index*20}%</text>`;
 }).join('');
 const marks=periods.map((period,index)=>{
  const leftX=x(index)-7,rightX=x(index)+1;
  const rect=(value,position,series)=>valid(value)?`<rect data-contract-series="${series}" x="${position}" y="${countY(value)}" height="${bottom-countY(value)}" width="6" rx="3"/>`:'';
  return `<g data-contract-period="${index}" class="${index===selectedIndex?'is-current':''}"><rect class="yk-contract-selection" x="${x(index)-step/2+1}" y="${top}" width="${step-2}" height="${height}" rx="3"/>${rect(period.eligible,leftX,'eligible')}${rect(period.signed,rightX,'signed')}<text x="${x(index)}" y="172" text-anchor="middle">${esc(period.label)}</text></g>`;
 }).join('');
 let previous=null;
 const line=rates.map((rate,index)=>{
  const point=rate===null?'':`${previous===null?'M':'L'}${x(index)} ${rateY(rate)}`;
  previous=rate;
  return point;
 }).join('');
 const points=rates.map((rate,index)=>rate===null?'':`<circle cx="${x(index)}" cy="${rateY(rate)}" r="2.5"/>`).join('');
 const amount=value=>valid(value)?units.format(value)+'户':'—';
 const percentage=value=>valid(value)?percentages.format(value)+'%':'—';
 const series=[['eligible',eligibleLabel],['signed',signedLabel],['rate',rateLabel]];
 const options=periods.map((period,index)=>`<option value="${index}" ${index===selectedIndex?'selected':''}>${esc(period.label)}</option>`).join('');
 const detail=periods.map((period,index)=>`<tr data-contract-row="${index}" ${index===selectedIndex?'':'hidden'}><td>${amount(period.eligible)}</td><td>${amount(period.signed)}</td><td>${percentage(rates[index])}</td></tr>`).join('');
 const plot=`<div class="yk-contract-scroll" tabindex="0" aria-label="户数与比率双轴图，可横向滚动"><svg aria-hidden="true" viewBox="0 0 ${plotWidth} 184" style="min-width:${plotWidth>311?plotWidth:0}px">
 <text x="${left-5}" y="12" text-anchor="end">户</text><text x="${right+5}" y="12">%</text>
 ${grid}${marks}<g data-contract-series="rate"><path data-contract-rate d="${line}"/>${points}</g></svg></div>
 <div class="yk-contract-legend">${series.map(([key,label])=>`<label><input type="checkbox" data-contract-toggle="${key}" checked>${esc(label)}</label>`).join('')}</div>`;
 const table=`<table class="yk-contract-detail"><thead><tr>${series.map(([,label])=>`<th scope="col">${esc(label)}</th>`).join('')}</tr></thead><tbody>${detail}</tbody></table>`;
 const picker=`<label class="yk-contract-period-picker">查看期间 <select data-contract-select>${options}</select></label>`;
 const summary=index=>{
  const period=periods[index];
  return progressRing({value:rates[index],name:rateLabel})+`<dl class="yk-withholding-metrics"><div><dt>${esc(eligibleLabel)}</dt><dd>${amount(period.eligible)}</dd></div><div><dt>${esc(signedLabel)}</dt><dd>${amount(period.signed)}</dd></div></dl>`;
 };
 const content=withSummary
  ?`<div data-contract-summary>${summary(selectedIndex)}</div>${periods.map((_,index)=>`<template data-contract-summary-template="${index}">${summary(index)}</template>`).join('')}${picker}<details class="yk-withholding-trend" ${expanded?'open':''}><summary>趋势分析</summary>${plot}${table}</details>`
  :`${plot}${picker}${table}`;
 return `<section class="yk-card yk-contract-trend" data-component="contract-trend" data-source="6695:316197">${content}</section>`;
}
function withholdingAnalysis({title='微信代扣签约与解约',signing,cancellation,initialView,expanded=true}={}){
 const views=[
  {key:'signing',data:signing,eligibleLabel:'已收楼户数',signedLabel:'已签约户数',rateLabel:'签约率',source:'4424:71307/71453'},
  {key:'cancellation',data:cancellation,eligibleLabel:'已签约户数',signedLabel:'已解约户数',rateLabel:'解约率',source:'4424:71596'}
 ].filter(view=>view.data!=null);
 if(!views.length)throw Error('代扣分析至少需要签约或解约数据');
 const selected=initialView??views[0].key;
 if(!views.some(view=>view.key===selected))throw Error('代扣分析的初始视图缺少数据定义');
 const buttons=views.length>1?`<div class="yk-withholding-switch" role="group" aria-label="代扣分析视图">${views.map(({key,rateLabel})=>`<button type="button" data-withholding-view="${key}" aria-pressed="${key===selected}">${rateLabel}</button>`).join('')}</div>`:'';
 const panels=views.map(({key,data,eligibleLabel,signedLabel,rateLabel,source})=>{
  const trend=contractTrend({periods:data.periods,selectedIndex:data.selectedIndex,eligibleLabel,signedLabel,rateLabel},{withSummary:true,expanded});
  return `<div data-withholding-panel="${key}" ${key===selected?'':'hidden'} data-source="${source}">${trend}</div>`;
 }).join('');
 return `<section class="yk-card yk-withholding" data-component="withholding-analysis"><header><h3>${esc(title)}</h3>${buttons}</header>${panels}</section>`;
}
function withholdingPayment({expected=null,paid=null,unit='',successRate=null,basis}={}){
 if(basis!==undefined&&basis!=='amount')throw Error('扣费率使用明确的金额口径或上游提供的成功率');
 if([expected,paid].some(value=>value!==null&&(!valid(value)||value<0)))throw Error('扣费金额须为非负数或 null');
 if(basis==='amount'&&valid(expected)&&valid(paid)&&paid>expected)throw Error('同口径的已扣金额不能超过应扣金额');
 if(successRate!==null&&(!valid(successRate)||successRate<0||successRate>100))throw Error('扣费成功率须为 0–100 或 null');
 if(basis==='amount'&&successRate!==null)throw Error('扣费成功率需选择一种计算口径');
 const rate=basis==='amount'&&expected>0&&paid!==null?paid/expected*100:successRate;
 const format=chartNumberFormatter(2);
 const amount=value=>value===null?'—':esc(format.format(value)+unit);
 return `<section class="yk-card yk-withholding yk-withholding-payment" data-component="withholding-payment" data-source="4424:71313"><header><h3>微信代扣金额分析</h3></header>
 <div data-contract-summary>${progressRing({value:rate,name:'扣费成功率'})}</div><dl class="yk-withholding-metrics"><div><dt>应代扣金额</dt><dd>${amount(expected)}</dd></div><div><dt>已代扣金额</dt><dd>${amount(paid)}</dd></div></dl></section>`;
}
function withholdingRankings({payment,signing,cancellation,initialView}={}){
 const views=[
  {key:'payment',label:'扣费成功率',data:payment},
  {key:'signing',label:'签约率',data:signing},
  {key:'cancellation',label:'解约率',data:cancellation}
 ].filter(view=>view.data!=null);
 if(!views.length)throw Error('代扣排名至少需要一套排名');
 const selected=initialView??views[0].key;
 if(!views.some(view=>view.key===selected))throw Error('代扣排名初始指标缺少数据');
 const buttons=views.length>1?`<div class="yk-withholding-switch" role="group" aria-label="代扣排名指标">${views.map(({key,label})=>`<button type="button" data-withholding-rank-view="${key}" aria-pressed="${key===selected}">${label}</button>`).join('')}</div>`:'';
 const panels=views.map(({key,label,data})=>{
  const scopes=(data.scopes??[]).map(scope=>{
   if(!scope.columns||scope.columns.length<3||scope.rows?.some(row=>row.values[0]!==null&&(!valid(row.values[0])||row.values[0]<0||row.values[0]>100))){
    throw Error('代扣排名第一个指标需为 0–100 的百分数或 null');
   }
   return {...scope,columns:[...scope.columns.slice(0,2),label,...scope.columns.slice(3)],rateColumn:2,title:scope.title||label+'排名',appearance:'indicatorDetail'};
  });
  return `<div data-withholding-rank-panel="${key}" ${key===selected?'':'hidden'}>${scopes.length?B.businessRanking({scopes,selectedScope:data.selectedScope}):'<p class="yk-missing">暂无排名数据</p>'}</div>`;
 }).join('');
 return `<section class="yk-withholding-rankings" data-component="withholding-rankings">${buttons}${panels}</section>`;
}
function hydrateWithholdingRankings(root){
 root.querySelectorAll('.yk-withholding-rankings').forEach(ranking=>{
  const buttons=ranking.querySelectorAll('[data-withholding-rank-view]');
  const panels=ranking.querySelectorAll('[data-withholding-rank-panel]');
  buttons.forEach(button=>button.onclick=()=>{
   buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
   panels.forEach(panel=>panel.hidden=panel.dataset.withholdingRankPanel!==button.dataset.withholdingRankView);
  });
 });
}
function hydrateWithholdingAnalyses(root){
 root.querySelectorAll('.yk-withholding').forEach(analysis=>{
  const buttons=analysis.querySelectorAll('[data-withholding-view]');
  const panels=analysis.querySelectorAll('[data-withholding-panel]');
  buttons.forEach(button=>button.onclick=()=>{
   buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
   panels.forEach(panel=>panel.hidden=panel.dataset.withholdingPanel!==button.dataset.withholdingView);
  });
 });
}

function hydrateContractTrends(root){
 root.querySelectorAll('.yk-contract-trend').forEach(card=>{
  const select=card.querySelector('[data-contract-select]');
  select.onchange=()=>{
   card.querySelectorAll('[data-contract-period]').forEach(group=>group.classList.toggle('is-current',group.dataset.contractPeriod===select.value));
   card.querySelectorAll('[data-contract-row]').forEach(row=>row.hidden=row.dataset.contractRow!==select.value);
   const summary=card.querySelector('[data-contract-summary]');
   if(summary){
    const template=card.querySelector(`[data-contract-summary-template="${select.value}"]`);
    if(template)summary.replaceChildren(template.content.cloneNode(true));
   }
  };
  card.querySelectorAll('[data-contract-toggle]').forEach(toggle=>{
   toggle.onchange=()=>card.querySelectorAll(`[data-contract-series="${toggle.dataset.contractToggle}"]`).forEach(element=>{
    element.style.display=toggle.checked?'':'none';
   });
  });
 });
}
function satisfactionRadar({title='满意度概览',subtitle='',dimensions=[],max=100,unit='%',selectedIndex=0}={}){
 if(!Array.isArray(dimensions)||![5,6].includes(dimensions.length))throw Error('满意度雷达需要五或六项维度');
 if(!valid(max)||max<=0||!Number.isInteger(selectedIndex)||selectedIndex<0||selectedIndex>=dimensions.length)throw Error('满意度雷达需要有效的共同量程及选中维度');
 const six=dimensions.length===6;
 const fields=six?['current']:['current','highest','average'];
 const names=new Set();
 for(const dimension of dimensions){
  if(typeof dimension?.name!=='string'||!dimension.name.trim()||names.has(dimension.name.trim()))throw Error('满意度维度名称须唯一');
  if(fields.some(key=>dimension[key]!=null&&(!valid(dimension[key])||dimension[key]<0||dimension[key]>max)))throw Error('满意度数值须在共同量程内，缺失填 null');
  if(six&&(dimension.highest!=null||dimension.average!=null))throw Error('六维满意度概览只展示当前数据，参照组请使用适用的比较模板');
  names.add(dimension.name.trim());
 }
 const coords=(index,radius)=>point(80,80,radius,(-.5+2*index/dimensions.length)*Math.PI);
 const grid=[.2,.4,.6,.8,1].map(scale=>`<polygon points="${dimensions.map((_,index)=>coords(index,69*scale).join(',')).join(' ')}"/>`).join('');
 const spokes=dimensions.map((_,index)=>{
  const [x,y]=coords(index,69);
  return `<line x1="80" y1="80" x2="${x}" y2="${y}"/>`;
 }).join('');
 const shapes=fields.slice().reverse().map(field=>{
  const points=dimensions.map((dim,index)=>dim[field]==null?null:coords(index,69*dim[field]/max));
  if(points.every(p=>p===null))return '';
  if(points.every(Boolean))return `<polygon data-satisfaction-shape="${field}" points="${points.map(p=>p.join(',')).join(' ')}"/>`;
  const path=points.map((p,index)=>{
   const next=points[(index+1)%points.length];
   return p&&next?`M${p.join(',')} L${next.join(',')}`:'';
  }).join('');
  const dots=points.map(p=>p?`<circle cx="${p[0]}" cy="${p[1]}" r="2.4"/>`:'').join('');
  return `<path data-satisfaction-shape="${field}" d="${path}"/><g data-satisfaction-points="${field}">${dots}</g>`;
 }).join('');
 const format=chartNumberFormatter(2);
 const display=value=>value==null?'—':esc(format.format(value)+unit);
 const axes=dimensions.map((dimension,index)=>`<button type="button" data-satisfaction-axis="${index}" aria-pressed="${index===selectedIndex}"><span>${esc(dimension.name)}</span>${six?'':`<strong>${display(dimension.current)}</strong>`}</button>`).join('');
 const keys=[['current','当前值'],['highest','项目最高'],['average','项目平均']];
 const readings=six
  ?`<dl class="yk-satisfaction-six-values">${dimensions.map((dimension,index)=>`<div data-satisfaction-value="${index}" class="${index===selectedIndex?'is-current':''}"><dt>${esc(dimension.name)}</dt><dd>${display(dimension.current)}</dd></div>`).join('')}</dl>`
  :dimensions.map((dimension,index)=>`<dl class="yk-satisfaction-compare" data-satisfaction-reading="${index}" aria-label="${esc(dimension.name)}读数" ${index===selectedIndex?'':'hidden'}>${keys.map(([key,label])=>`<div><dt>${label}</dt><dd>${display(dimension[key])}</dd></div>`).join('')}</dl>`).join('');
 return `<section class="yk-card yk-satisfaction" data-component="satisfaction-radar" data-dimensions="${dimensions.length}" data-source="${six?'6695:316438':'6695:316308'}"><header><h3>${esc(title)}</h3>${subtitle?`<span>${esc(subtitle)}</span>`:''}</header>
 <div class="yk-satisfaction-layout"><svg viewBox="0 0 160 160" aria-hidden="true"><g class="yk-satisfaction-grid">${grid}${spokes}</g>${shapes}</svg>${axes}</div>${readings}</section>`;
}
function hydrateSatisfactionRadars(root){
 root.querySelectorAll('.yk-satisfaction').forEach(card=>{
  const axes=card.querySelectorAll('[data-satisfaction-axis]');
  const readings=card.querySelectorAll('[data-satisfaction-reading]');
  const values=card.querySelectorAll('[data-satisfaction-value]');
  axes.forEach(axis=>axis.onclick=()=>{
   axes.forEach(button=>button.setAttribute('aria-pressed',String(button===axis)));
   readings.forEach(reading=>reading.hidden=reading.dataset.satisfactionReading!==axis.dataset.satisfactionAxis);
   values.forEach(value=>value.classList.toggle('is-current',value.dataset.satisfactionValue===axis.dataset.satisfactionAxis));
  });
 });
}
function signedPeriodBars({title='当月净额',unit='',periods=[],currentLabel='本期',previousLabel='同期',digits=2,selectedIndex}={}){
 if(!Array.isArray(periods)||periods.some(period=>typeof period?.label!=='string'||!period.label.trim()||
   [period.current,period.previous].some(value=>value!==null&&!valid(value)))){
  throw Error('本期／同期柱图需要有序的时间标签及有限数值，缺失填 null');
 }
 if(!periods.length)return '<p class="yk-missing">暂无期间数据</p>';
 selectedIndex??=periods.length-1;
 if(!Number.isInteger(selectedIndex)||selectedIndex<0||selectedIndex>=periods.length)throw Error('无效的选中期间');
 const values=periods.flatMap(period=>[period.current,period.previous]).filter(valid);
 const [min,max]=values.reduce(([a,b],value)=>[Math.min(a,value),Math.max(b,value)],[0,0]);
 const axis=axisModel([],{unit,range:min===max?[0,1]:[min,max]});
 const left=Math.max(28,...axis.labels.map(label=>[...label].length*6+8));
 const labelWidth=periods.reduce((width,period)=>Math.max(width,[...period.label].length*11+4),21);
 const width=Math.max(311,left+8+labelWidth*periods.length),right=width-8;
 const top=20,bottom=150;
 const [lower,upper]=axis.range;
 const y=value=>bottom-(value-lower)/(upper-lower)*(bottom-top);
 const zero=y(0);
 const grid=axis.labels.map((label,index)=>{
  const level=bottom-index*(bottom-top)/5;
  return `<path d="M${left} ${level}H${right}" stroke-dasharray="2 2"/><text x="${left-4}" y="${level+4}" text-anchor="end">${esc(label)}</text>`;
 }).join('');
 const step=(right-left)/periods.length;
 const groups=periods.map((period,index)=>{
  const x=left+step*(index+.5);
  const bars=['current','previous'].map((key,seriesIndex)=>{
   const value=period[key];
   if(value===null||value===0)return '';
   const level=y(value), sign=value>0?'positive':'negative';
   return `<rect data-period-series="${key}" data-sign="${sign}" x="${x-7+seriesIndex*8}" y="${Math.min(level,zero)}" height="${Math.abs(level-zero)}" width="6" rx="3"/>`;
  }).join('');
  return `<g data-signed-period="${index}" class="${index===selectedIndex?'is-current':''}"><rect class="yk-period-selection" x="${x-step/2+1}" y="${top}" width="${step-2}" height="${bottom-top}" rx="3"/>${bars}<text x="${x}" y="168" text-anchor="middle">${esc(period.label)}</text></g>`;
 }).join('');
 const format=chartNumberFormatter(digits);
 const amount=(value,signed=false)=>{
  if(!valid(value))return '—';
  const printed=format.format(Math.abs(value));
  const sign=value<0?'−':signed&&value>0?'+':'';
  return esc(sign+printed+unit);
 };
 const options=periods.map((period,index)=>`<option value="${index}" ${index===selectedIndex?'selected':''}>${esc(period.label)}</option>`).join('');
 const rows=periods.map((period,index)=>{
  const delta=period.current===null||period.previous===null?null:period.current-period.previous;
  return `<tr data-signed-reading="${index}" ${index===selectedIndex?'':'hidden'}><td>${amount(period.current)}</td><td>${amount(period.previous)}</td><td>${amount(delta,true)}</td></tr>`;
 }).join('');
 const legends=[['current','positive',currentLabel,'正值'],['previous','positive',previousLabel,'正值'],['current','negative',currentLabel,'负值'],['previous','negative',previousLabel,'负值']];
 return `<section class="yk-card yk-signed-period" data-component="signed-period-bars" data-source="6695:315326"><h3>${esc(title)}</h3>
 <div class="yk-signed-plot" tabindex="0" aria-label="本期与同期分组柱，可横向滚动"><svg viewBox="0 0 ${width} 180" style="min-width:${width>311?width:0}px" aria-hidden="true">
 <text x="${left-4}" y="10" text-anchor="end">${esc(axis.unit)}</text><g class="yk-signed-grid">${grid}</g>${groups}<path data-period-zero d="M${left} ${zero}H${right}"/></svg></div>
 <ul class="yk-signed-legend">${legends.map(([key,sign,label,signLabel])=>`<li><i data-period-series="${key}" data-sign="${sign}"></i>${esc(label)}（${signLabel}）</li>`).join('')}</ul>
 <div class="yk-signed-controls"><label>时间 <select data-signed-select>${options}</select></label><label><input type="checkbox" data-signed-previous checked>显示${esc(previousLabel)}</label></div>
 <table class="yk-contract-detail"><thead><tr><th scope="col">${esc(currentLabel)}</th><th scope="col">${esc(previousLabel)}</th><th scope="col">差额</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}
function hydrateSignedPeriodBars(root){
 root.querySelectorAll('.yk-signed-period').forEach(card=>{
  const select=card.querySelector('[data-signed-select]');
  select.onchange=()=>{
   card.querySelectorAll('[data-signed-period]').forEach(group=>group.classList.toggle('is-current',group.dataset.signedPeriod===select.value));
   card.querySelectorAll('[data-signed-reading]').forEach(reading=>reading.hidden=reading.dataset.signedReading!==select.value);
  };
  const toggle=card.querySelector('[data-signed-previous]');
  toggle.onchange=()=>card.classList.toggle('is-current-only',!toggle.checked);
 });
}
function yearAmountRings({modules=[]}={}){
 if(!Array.isArray(modules)||modules.length<1||modules.length>2)throw Error('预存小金额环需要一至两个指标');
 const colors=['#949CF8','#66A6FF'];
 const blocks=modules.map(({title,current,previous,unit,comparisonValue=null})=>{
  if(typeof title!=='string'||!title.trim()||typeof unit!=='string'||!unit.trim())throw Error('预存小金额环需要指标名称及金额单位');
  const values=[current,previous];
  if(values.some(value=>value!==null&&(!valid(value)||value<0)))throw Error('预存构成金额需为非负有限数值，缺失填 null');
  const total=values.some(value=>value===null)?null:current+previous;
  if(total!==null&&!valid(total))throw Error('合计须为有限数值');
  const format=chartNumberFormatter(2);
  const amount=value=>value===null?'—':esc(format.format(value)+unit);
  const segments=values.map((value,index)=>{
   const share=total>0?value/total:null;
   if(!share)return '';
   const start=-Math.PI/2+(index?current/total*Math.PI*2:0);
   const span=share*Math.PI*2;
   const gap=share===1?0:Math.min(.095,span/3);
   return `<path data-amount-arc="${index}" d="${arc(59,59,50,start+gap, start+span-gap)}" stroke="${colors[index]}" stroke-width="14" stroke-linecap="${share<.04?'butt':'round'}" opacity=".98" fill="none"/>`;
  }).join('');
  const rows=values.map((value,index)=>{
   const share=total>0?format.format(value/total*100)+'%':'—';
   const label=(index===0?'本年':'往年')+title;
   return `<div><dt><i style="background:${colors[index]}"></i>${esc(label)}</dt><dd>${amount(value)}<small aria-label="占比 ${share}">${share}</small></dd></div>`;
  }).join('');
  const previousComparison=valid(comparisonValue)?comparison({value:comparisonValue,label:'同',variant:'compact'}):'';
  return `<div class="yk-year-amount-module"><div class="yk-year-amount-info"><h3>${esc(title)}</h3><p class="yk-year-amount-total"><strong>${amount(total)}</strong>${previousComparison}</p><dl>${rows}</dl></div>
  <div class="yk-year-amount-ring"><svg viewBox="0 0 118 118" aria-hidden="true"><circle cx="59" cy="59" r="53" stroke="#66A6FF" stroke-opacity=".14" stroke-width="12" fill="none"/>${segments}</svg><div><strong>${amount(total)}</strong><span>${esc(title)}</span></div></div></div>`;
 }).join('');
 return `<section class="yk-card yk-year-amount" data-component="year-amount-rings" data-source="6695:316042">${blocks}</section>`;
}
function receiptComposition({title='实收构成',items=[],unit='',selectedIndex=0,digits=2}={}){
 if(!Array.isArray(items)||items.length!==3)throw Error('实收构成环需要三个共同整体的分类');
 const names=new Set();
 for(const item of items){
  if(typeof item?.name!=='string'||!item.name.trim()||names.has(item.name.trim()))throw Error('构成分类名称须非空且唯一');
  if(item.value!==null&&(!valid(item.value)||item.value<0))throw Error('构成金额须为非负有限数值或 null');
  names.add(item.name.trim());
 }
 if(typeof unit!=='string'||!unit.trim())throw Error('实收构成环需要共同金额单位');
 if(!Number.isInteger(selectedIndex)||selectedIndex<0||selectedIndex>=items.length)throw Error('无效的选中分类');
 const sum=items.reduce((total,item)=>total+(item.value??0),0);
 if(!valid(sum))throw Error('构成合计须为有限数值');
 const total=items.some(item=>item.value===null)?null:sum;
 const format=chartNumberFormatter(digits),formatShare=chartNumberFormatter(2);
 const amount=value=>value===null?'—':format.format(value)+unit;
 const shades=['#33C1C1','#66A6FF','#3DC7F8'];
 const records=items.map((item,index)=>({...item,amount:amount(item.value),share:total>0?formatShare.format(item.value/total*100)+'%':'—',color:shades[index]}));
 let angle=-Math.PI/2;
 const slices=total>0?records.map((item,index)=>{
  if(!item.value)return '';
  const span=item.value/total*Math.PI*2;
  const gap=item.value===total?0:Math.min(.018,span/4);
  const shape=arc(90,90,65,angle+gap,angle+span-gap);
  angle+=span;
  return `<path data-receipt-slice="${index}" class="${index===selectedIndex?'is-current':''}" d="${shape}" fill="none" stroke="${item.color}"/>`;
 }).join(''):'';
 const active=records[selectedIndex];
 const options=records.map((item,index)=>{
  const badge=valid(item.comparisonValue)?comparison({value:item.comparisonValue,label:'环',variant:'compact'}):'';
  return `<button type="button" data-receipt-category="${index}" data-receipt-name="${esc(item.name)}" data-receipt-amount="${esc(item.amount)}" data-receipt-piece-share="${item.share}" aria-pressed="${index===selectedIndex}">
   <span><i style="background:${item.color}"></i>${esc(item.name)}</span><strong>${esc(item.amount)}</strong><small>占比 ${item.share}</small>${badge}</button>`;
 }).join('');
 return `<section class="yk-card yk-receipt-composition" data-component="receipt-composition" data-source="6695:315962"><header><h3>${esc(title)}</h3><span>合计 <b data-receipt-total>${esc(amount(total))}</b></span></header>
 <div class="yk-receipt-overview" aria-live="polite"><div class="yk-receipt-ring"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="65" fill="none" stroke="#EBF1F5" stroke-width="32"/>${slices}</svg><strong data-receipt-share>${active.share}</strong></div>
 <div class="yk-receipt-selection"><span data-receipt-selected-name>${esc(active.name)}</span><strong data-receipt-selected-amount>${esc(active.amount)}</strong></div></div>
 <div class="yk-receipt-options" role="group" aria-label="构成分类">${options}</div></section>`;
}
function hydrateReceiptCompositions(root){
 root.querySelectorAll('.yk-receipt-composition').forEach(card=>{
  const buttons=card.querySelectorAll('[data-receipt-category]');
  const slices=card.querySelectorAll('[data-receipt-slice]');
  buttons.forEach(button=>button.onclick=()=>{
   buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
   slices.forEach(slice=>slice.classList.toggle('is-current',slice.dataset.receiptSlice===button.dataset.receiptCategory));
   card.querySelector('[data-receipt-share]').textContent=button.dataset.receiptPieceShare;
   card.querySelector('[data-receipt-selected-name]').textContent=button.dataset.receiptName;
   card.querySelector('[data-receipt-selected-amount]').textContent=button.dataset.receiptAmount;
  });
 });
}
function monthlyRevenueGauge({title='月份经营收入',annualTarget=null,unit='',months=[],selectedMonth}={}){
 if(typeof unit!=='string'||!unit.trim())throw Error('月份仪表需要实际值和年度目标的共同金额单位');
 if(annualTarget!==null&&(!valid(annualTarget)||annualTarget<0))throw Error('年度目标须为非负有限金额或 null');
 const statuses={met:'达预定节奏',below:'低于预定节奏',unrated:'无已确认状态'};
 if(!Array.isArray(months))throw Error('月份仪表需要月份数据数组');
 const byMonth=new Map();
 for(const {month,actual=null,yoy=null,status='unrated',sectors,referenceValue=null,referenceLabel='参照值'} of months){
  if(!Number.isInteger(month)||month<1||month>12||byMonth.has(month))throw Error('月份须为 1–12 且唯一');
  if((actual!==null&&!valid(actual))||(yoy!==null&&!valid(yoy))||!Object.hasOwn(statuses,status))throw Error('月份仪表的实际、同比或状态不符合数据约定');
  if(referenceValue!==null&&(!valid(referenceValue)||referenceValue<0))throw Error('仪表参照值须为非负有限数值或 null');
  if(sectors!==undefined){
   if(!Array.isArray(sectors)||!sectors.length||sectors.length>3||sectors.some(item=>!item.name||!valid(item.value)||item.value<0))throw Error('仪表分段需一至三项名称与非负金额');
   if(!valid(actual)||Math.abs(sectors.reduce((sum,item)=>sum+item.value,0)-actual)>Math.max(1,Math.abs(actual))*1e-8)throw Error('仪表各分段合计须等于该月累计实际');
  }
  byMonth.set(month,{actual,yoy,status,sectors,referenceValue,referenceLabel});
 }
 const initial=selectedMonth??[...byMonth.keys()].reduce((max,month)=>Math.max(max,month),1);
 if(!Number.isInteger(initial)||initial<1||initial>12)throw Error('选中月份须为 1–12');
 const year=Array.from({length:12},(_,index)=>index+1);
 const format=chartNumberFormatter(2);
 const amount=value=>value===null?'—':esc(format.format(value)+unit);
 const start=Math.PI*.9,sweep=Math.PI*1.2,cx=155.5,cy=126;
 const gaugeArc=(radius,from,to)=>arc(cx,cy,radius,start+sweep*from,start+sweep*to);
 const segments=year.map((month,index)=>{
  const status=byMonth.get(month)?.status??'unrated';
  const [x,y]=point(cx,cy,119,start+sweep*(index+.5)/12);
  return `<g data-gauge-month="${month}" data-status="${status}"><path d="${gaugeArc(101,index/12+.003,(index+1)/12-.003)}"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${month}</text></g>`;
 }).join('');
 const panels=year.map(month=>{
  const {actual=null,yoy=null,status='unrated',sectors,referenceValue=null,referenceLabel='参照值'}=byMonth.get(month)||{};
  const computed=annualTarget>0&&actual!==null?actual/annualTarget*100:null;
  const rate=valid(computed)?computed:null;
  const drawnRate=rate!==null&&rate>=0?Math.min(rate,100):null;
  const shades=['#66A7FF','#33C1C1','#56B8FF'];
  let segmentOffset=0;
  const segmented=annualTarget>0&&sectors?sectors.map((item,index)=>{
   const from=Math.min(1,segmentOffset/annualTarget);
   segmentOffset+=item.value;
   const to=Math.min(1,segmentOffset/annualTarget);
   return to>from?`<path class="yk-gauge-sector" data-gauge-sector="${index}" d="${gaugeArc(78,from,to)}" stroke="${shades[index]}"/>`:'';
  }).join(''):'';
  const referenceRatio=annualTarget>0&&referenceValue!==null?referenceValue/annualTarget:null;
  const referenceAngle=referenceRatio===null?null:Math.max(0,Math.min(1,referenceRatio));
  const marker=referenceAngle===null?'':`<line class="yk-gauge-reference" data-gauge-reference="${referenceRatio}" x1="${point(cx,cy,62,start+sweep*referenceAngle)[0]}" y1="${point(cx,cy,62,start+sweep*referenceAngle)[1]}" x2="${point(cx,cy,94,start+sweep*referenceAngle)[0]}" y2="${point(cx,cy,94,start+sweep*referenceAngle)[1]}"/>`;
  const progress=drawnRate>0?`<path class="yk-gauge-actual" data-gauge-progress="${drawnRate}" d="${gaugeArc(78,0,drawnRate/100)}"/>`:'';
  const guide=rate>100?'弧形显示至 100%，保留实际完成率':rate<0?'负值保留实际完成率，弧形留空':'';
  return `<div data-gauge-panel="${month}" ${month===initial?'':'hidden'}>
   <div class="yk-gauge-face"><svg viewBox="0 0 311 173" aria-hidden="true">${segments}<path class="yk-gauge-track" d="${gaugeArc(78,0,1)}"/>${sectors?segmented:progress}${marker}</svg>
   <div class="yk-gauge-rate"><strong data-gauge-rate>${rate===null?'—':format.format(rate)+'%'}</strong><span>年度目标完成率</span></div></div>
   ${sectors?`<ul class="yk-gauge-sectors">${sectors.map((item,index)=>`<li><i style="background:${shades[index]}"></i>${esc(item.name)} <strong>${amount(item.value)}</strong></li>`).join('')}</ul>`:''}
   ${referenceValue!==null?`<p class="yk-gauge-reference-value">${esc(referenceLabel)} ${amount(referenceValue)}${referenceRatio>1?'（超出年度目标范围）':''}</p>`:''}
   <p class="yk-gauge-status">${month}月 · ${statuses[status]}</p>
   <dl class="yk-gauge-detail"><div><dt>累计实际</dt><dd>${amount(actual)}</dd></div><div><dt>年度目标</dt><dd>${amount(annualTarget)}</dd></div><div><dt>同比</dt><dd>${yoy===null?'—':comparison({value:yoy,label:'同',variant:'compact'})}</dd></div></dl>
   ${guide?`<p class="yk-gauge-note">${guide}</p>`:''}</div>`;
 }).join('');
 return `<section class="yk-card yk-monthly-gauge" data-component="monthly-revenue-gauge" data-source="6695:316886"><header><h3>${esc(title)}</h3>
 <label>查看月份 <select data-gauge-select>${year.map(month=>`<option value="${month}" ${month===initial?'selected':''}>${month}月</option>`).join('')}</select></label></header>
 <div aria-live="polite">${panels}</div><ul class="yk-gauge-legend">${Object.entries(statuses).map(([key,label])=>`<li data-status="${key}"><i></i>${label}</li>`).join('')}</ul></section>`;
}
function hydrateMonthlyRevenueGauges(root){
 root.querySelectorAll('.yk-monthly-gauge').forEach(card=>{
  const select=card.querySelector('[data-gauge-select]');
  select.onchange=()=>card.querySelectorAll('[data-gauge-panel]').forEach(panel=>{
   panel.hidden=panel.dataset.gaugePanel!==select.value;
  });
 });
}
function categoryColumns({title='',labels=[],unit='',series=[],selectedIndex,digits=2}={}){
 if(!Array.isArray(labels)||labels.some(label=>typeof label!=='string'||!label.trim())||new Set(labels).size!==labels.length)throw Error('柱图类别须明确且唯一');
 if(!Array.isArray(series)||series.length<1||series.length>3)throw Error('基础柱与分组柱支持一至三组系列');
 if(series.some(entry=>!entry?.name||!Array.isArray(entry.values)||entry.values.length!==labels.length))throw Error('同一系列的数值需与类别对齐');
 if(series.some(entry=>entry.unit!==undefined&&entry.unit!==unit))throw Error('分组柱需使用同一量纲');
 if(series.some(entry=>entry.values.some(value=>value!==null&&(!valid(value)||value<0))))throw Error('此柱图支持非负数值，缺失填 null');
 if(!labels.length)return '<p class="yk-missing">暂无类别数据</p>';
 const selected=selectedIndex??0;
 if(!Number.isInteger(selected)||selected<0||selected>=labels.length)throw Error('柱图选中类别无效');
 const grouped=series.length>1;
 const shades=grouped?['#33C1C1','#66A6FF','#3DC7F8']:['#33C1C1','#56B8FF','#8EAAD4','#3DC7F8','#66A6FF','#949CF8'];
 const color=(category,index)=>shades[grouped?index:category%shades.length];
 const max=series.reduce((highest,entry)=>entry.values.reduce((valueMax,value)=>Math.max(valueMax,value??0),highest),unit==='%'?100:0)||1;
 const axis=axisModel([],{range:[0,max],unit});
 const left=Math.max(32,...axis.labels.map(label=>label.length*6+8));
 const minStep=labels.reduce((size,label)=>Math.max(size,[...label].length*11+4),grouped?series.length*16+8:28);
 const width=Math.max(311,left+8+labels.length*minStep),right=width-8;
 const top=16,bottom=156;
 const step=(right-left)/labels.length;
 const chartGrid=axis.labels.map((label,index)=>{
  const y=bottom-index*(bottom-top)/5;
  return `<path d="M${left} ${y}H${right}"${index?' stroke-dasharray="2 2"':''}/><text x="${left-5}" y="${y+4}" text-anchor="end">${esc(label)}</text>`;
 }).join('');
 const groups=labels.map((label,index)=>{
  const middle=left+step*(index+.5);
  const base=middle-(series.length*16-4)/2;
  const columns=series.map((entry,seriesIndex)=>{
   const value=entry.values[index];
   if(value===null||value===0)return '';
   const height=value/axis.range[1]*(bottom-top);
   return `<rect data-category-column="${seriesIndex}" x="${base+seriesIndex*16}" y="${bottom-height}" width="12" height="${height}" fill="${color(index,seriesIndex)}"/>`;
  }).join('');
  const highlight=grouped?Math.min(step-2,series.length*16):Math.min(step-2,32);
  return `<g data-category-column-group="${index}" class="${index===selected?'is-current':''}"><rect class="yk-category-column-highlight" x="${middle-highlight/2}" y="${top}" width="${highlight}" height="${bottom-top}"/>${columns}<text x="${middle}" y="173" text-anchor="middle">${esc(label)}</text></g>`;
 }).join('');
 const format=chartNumberFormatter(digits);
 const readings=labels.map((_,index)=>`<dl class="yk-category-column-readings" data-category-column-reading="${index}" ${index===selected?'':'hidden'}>${series.map((entry,seriesIndex)=>{
  const value=entry.values[index];
  return `<div><dt><i style="background:${color(index,seriesIndex)}"></i>${esc(entry.name)}</dt><dd>${value===null?'—':esc(format.format(value)+unit)}</dd></div>`;
 }).join('')}</dl>`).join('');
 return `<section class="yk-card yk-category-columns" data-component="category-columns" data-source="${grouped?'6695:315240':'6695:315115'}">
 <header>${title?`<h3>${esc(title)}</h3>`:''}<label>查看类别 <select data-category-column-select>${labels.map((label,index)=>`<option value="${index}" ${index===selected?'selected':''}>${esc(label)}</option>`).join('')}</select></label></header>
 <div aria-live="polite">${readings}</div>
 <div class="yk-category-column-scroll" tabindex="0" aria-label="柱图，可横向滚动"><svg viewBox="0 0 ${width} 184" style="min-width:${width>311?width:0}px" aria-hidden="true">
 <g class="yk-category-column-grid">${chartGrid}</g>${groups}</svg></div></section>`;
}
function hydrateCategoryColumns(root){
 root.querySelectorAll('.yk-category-columns').forEach(card=>{
  const select=card.querySelector('[data-category-column-select]');
  const groups=card.querySelectorAll('[data-category-column-group]');
  const update=()=>{
   groups.forEach(group=>group.classList.toggle('is-current',group.dataset.categoryColumnGroup===select.value));
   card.querySelectorAll('[data-category-column-reading]').forEach(reading=>reading.hidden=reading.dataset.categoryColumnReading!==select.value);
  };
  select.onchange=update;
  groups.forEach(group=>group.onclick=()=>{select.value=group.dataset.categoryColumnGroup;update();});
 });
}
function periodCurves({title='',time=[],unit='',series=[],selectedIndex,digits=2}={}){
 if(!Array.isArray(time)||time.some(label=>typeof label!=='string'||!label.trim())||new Set(time).size!==time.length)throw Error('趋势需要唯一、有序的时点标签');
 if(!Array.isArray(series)||series.length<1||series.length>7)throw Error('单轴曲线需要一至七组系列');
 for(const entry of series){
  if(!entry?.name||!Array.isArray(entry.values)||entry.values.length!==time.length||
   entry.previous!==undefined&&(!Array.isArray(entry.previous)||entry.previous.length!==time.length)){
   throw Error('本期与同期均须对齐同一组时点');
  }
  if(entry.unit!==undefined&&entry.unit!==unit)throw Error('同一曲线图的各系列须同量纲');
  if([...entry.values,...(entry.previous??[])].some(value=>value!==null&&!valid(value)))throw Error('趋势值须为有限数值或 null');
 }
 if(!time.length)return '<p class="yk-missing">暂无期间数据</p>';
 const selected=selectedIndex??time.length-1;
 if(!Number.isInteger(selected)||selected<0||selected>=time.length)throw Error('无效的选中时间');
 const allValues=series.flatMap(entry=>[...entry.values,...(entry.previous??[])]).filter(valid);
 const [min,max]=allValues.reduce(([lo,hi],value)=>[Math.min(lo,value),Math.max(hi,value)],[0,0]);
 const axis=axisModel([],{range:min===max?[0,1]:[min,max],unit});
 const hasPrevious=series.some(entry=>entry.previous!==undefined);
 const colors=series.length===4?['#66A6FF','#33C1C1','#3DC7F8','#8EAAD4']:seriesPalette(series.length);
 const plotLeft=Math.max(32,...axis.labels.map(label=>label.length*6+7));
 const plotRight=294,top=15,bottom=155;
 const step=(plotRight-plotLeft)/Math.max(1,time.length-1);
 const x=index=>time.length===1?(plotLeft+plotRight)/2:plotLeft+step*index;
 const y=value=>bottom-(value-axis.range[0])/(axis.range[1]-axis.range[0])*(bottom-top);
 const grid=axis.labels.map((label,index)=>{
  const level=bottom-index*(bottom-top)/5;
  return `<path d="M${plotLeft} ${level}H${plotRight}"${index?' stroke-dasharray="2 2"':''}/><text x="${plotLeft-4}" y="${level+4}" text-anchor="end">${esc(label)}</text>`;
 }).join('');
 const line=values=>values.map((value,index)=>{
  if(value===null)return '';
  const previous=values[index-1],end=x(index);
  if(!valid(previous))return `M${end} ${y(value)}`;
  const first=y(previous),last=y(value);
  return `C${end-step*2/3} ${first} ${end-step/3} ${last} ${end} ${last}`;
 }).join('');
 const marks=(values,color)=>values.map((value,index)=>{
  if(value===null)return '';
  const solo=!valid(values[index-1])&&!valid(values[index+1]);
  return `<circle data-curve-dot="${index}" class="${solo?'is-isolated ':''}${index===selected?'is-current':''}" cx="${x(index)}" cy="${y(value)}" r="3" stroke="${color}"/>`;
 }).join('');
 const drawings=series.map((entry,index)=>{
  const color=colors[index],strokeWidth=series.length===1?2:1.5;
  return `<g data-curve-series="${index}"><path data-curve-main d="${line(entry.values)}" stroke="${color}" stroke-width="${strokeWidth}"/>${marks(entry.values,color)}
  ${entry.previous?`<g data-curve-previous><path d="${line(entry.previous)}" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="4 3"/>${marks(entry.previous,color)}</g>`:''}</g>`;
 }).join('');
 const longestLabel=time.reduce((longest,label)=>Math.max(longest,[...label].length),1);
 const interval=Math.max(1,Math.ceil((longestLabel*9+8)/step));
 const captionIndexes=time.map((_,index)=>index).filter(index=>index===time.length-1||index%interval===0&&time.length-1-index>=interval);
 const caption=captionIndexes.map(index=>`<text x="${x(index)}" y="174" text-anchor="${index===time.length-1&&time.length>1?'end':index===0&&time.length>1?'start':'middle'}">${esc(time[index])}</text>`).join('');
 const hitAreas=time.map((_,index)=>{
  const left=index===0?plotLeft:(x(index-1)+x(index))/2;
  const right=index===time.length-1?plotRight:(x(index)+x(index+1))/2;
  return `<rect data-curve-hit="${index}" x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/>`;
 }).join('');
 const format=chartNumberFormatter(digits);
 const val=value=>valid(value)?esc(format.format(value)+unit):'—';
 const readings=time.map((_,index)=>`<tbody data-curve-reading="${index}" ${index===selected?'':'hidden'}>${series.map((entry,seriesIndex)=>`<tr><th scope="row"><i style="background:${colors[seriesIndex]}"></i>${esc(entry.name)}</th><td>${val(entry.values[index])}</td>${hasPrevious?`<td>${val(entry.previous?.[index])}</td>`:''}</tr>`).join('')}</tbody>`).join('');
 return `<section class="yk-card yk-period-curves" data-component="period-curves" data-source="${series.length===1?'6695:314803':'6695:314937'}">
 <header>${title?`<h3>${esc(title)}</h3>`:''}<label>查看时点 <select data-curve-select>${time.map((label,index)=>`<option value="${index}" ${index===selected?'selected':''}>${esc(label)}</option>`).join('')}</select></label></header>
 <svg viewBox="0 0 311 184" aria-hidden="true"><g class="yk-curve-grid">${grid}</g>
 <line data-curve-guide x1="${x(selected)}" x2="${x(selected)}" y1="${top}" y2="${bottom}"/>${drawings}${caption}${hitAreas}</svg>
 ${hasPrevious?'<label class="yk-curve-toggle"><input type="checkbox" data-curve-toggle checked>显示同期虚线</label>':''}
 <table class="yk-contract-detail"><thead><tr><th scope="col">指标</th><th scope="col">本期</th>${hasPrevious?'<th scope="col">同期</th>':''}</tr></thead>${readings}</table>
 <script type="application/json" class="yk-curve-coordinates">${JSON.stringify(time.map((_,index)=>x(index)))}</script></section>`;
}
function hydratePeriodCurves(root){
 root.querySelectorAll('.yk-period-curves').forEach(card=>{
  const select=card.querySelector('[data-curve-select]');
  const coordinates=JSON.parse(card.querySelector('.yk-curve-coordinates').textContent);
  const update=()=>{
   const guide=card.querySelector('[data-curve-guide]');
   for(const attribute of ['x1','x2'])guide.setAttribute(attribute,coordinates[Number(select.value)]);
   card.querySelectorAll('[data-curve-dot]').forEach(dot=>dot.classList.toggle('is-current',dot.dataset.curveDot===select.value));
   card.querySelectorAll('[data-curve-reading]').forEach(reading=>reading.hidden=reading.dataset.curveReading!==select.value);
  };
  select.onchange=update;
  card.querySelectorAll('[data-curve-hit]').forEach(hit=>hit.onclick=()=>{select.value=hit.dataset.curveHit;update();});
  const toggle=card.querySelector('[data-curve-toggle]');
  if(toggle)toggle.onchange=()=>card.classList.toggle('hide-previous',!toggle.checked);
 });
}
function ratioRings({title='',items=[],selectedIndex=0}={}){
 if(!Array.isArray(items)||items.length<1||items.length>3)throw Error('独立比率环支持一至三项');
 if(!Number.isInteger(selectedIndex)||selectedIndex<0||selectedIndex>=items.length)throw Error('选中轨道无效');
 const single=items.length===1;
 const format=chartNumberFormatter(2);
 const colors=single?['#66A6FF']:['#33C1C1','#56B8FF','#949CF8'];
 const records=items.map((item,index)=>{
  if(typeof item?.name!=='string'||!item.name.trim())throw Error('比率名称不能为空');
  if([item.numerator,item.denominator].some(value=>value!==null&&!valid(value))||item.denominator<0)throw Error('分子与分母须为有限数值或 null，分母不得为负');
  const calculated=item.denominator>0&&item.numerator!==null?item.numerator/item.denominator*100:null;
  const rate=valid(calculated)?calculated:null;
  const display=value=>value===null?'—':esc(format.format(value)+(item.unit||''));
  const unsupported=rate!==null&&(single?(rate<-100||rate>200):(rate<0||rate>200));
  const reason=rate===null?'缺少有效分母或分子':unsupported?'弧形规则待确认，保留实际比率':'';
  return {...item,color:colors[index],rate,label:rate===null?'—':format.format(rate)+'%',reason,display,unsupported};
 });
 const start=-Math.PI/2,sweep=Math.PI*(single?2:1.5);
 const tracks=records.map((item,index)=>{
  const radius=single?73:[72.9,53.1,33.1][index];
  const thickness=single?16:[16.2,15.86,13.12][index];
  const foreground=single?14:[9.36,9.28,8.46][index];
  const track=arc(81,81,radius,start,start+sweep);
  const sourceStart=single?start:[4.764353275299072, 4.77548360824585, 4.822603702545166][index];
  const sourceEnd=single?start+sweep:[9.379283905029297, 9.360002517700195, 9.34649658203125][index];
  const foregroundSweep=sourceEnd-sourceStart;
  const segment=(value,extra='')=>`<path data-ratio-fill="${index}" d="${arc(81,81,radius,sourceStart,sourceStart+foregroundSweep*value/100)}" stroke="${item.color}" stroke-width="${foreground}" ${extra}/>`;
  const rate=item.rate;
  let fills='';
  if(rate&& !item.unsupported){
   fills=segment(Math.min(Math.abs(rate),100),rate<0?'transform="translate(162 0) scale(-1 1)"':'');
   if(rate>100)fills+=single?segment(rate-100,'class="yk-ratio-overflow"'):`<path data-ratio-overflow="${index}" d="${arc(81,81,radius,sourceStart,sourceStart+foregroundSweep*(rate-100)/100)}" stroke="#000" stroke-opacity=".36" stroke-width="${foreground}" style="mix-blend-mode:overlay"/>`;
  }
  return `<g data-ratio-track="${index}" class="${index===selectedIndex?'is-current':''}" fill="none" stroke-linecap="round"><path d="${track}" stroke="${item.color}" stroke-opacity=".14" stroke-width="${thickness}"/>${fills}</g>`;
 }).join('');
 const active=records[selectedIndex];
 const panel=records.map((item,index)=>`<div data-ratio-panel="${index}" ${index===selectedIndex?'':'hidden'}><dl><div><dt>${esc(item.numeratorLabel||'分子')}</dt><dd>${item.display(item.numerator)}</dd></div><div><dt>${esc(item.denominatorLabel||'分母')}</dt><dd>${item.display(item.denominator)}</dd></div></dl>
 ${item.reason?`<p>${item.reason}</p>`:''}</div>`).join('');
 const switches=single?'':`<div class="yk-ratio-options" role="group" aria-label="独立比率">${records.map((item,index)=>`<button type="button" data-ratio-select="${index}" data-rate="${item.label}" data-rate-name="${esc(item.name)}" aria-pressed="${index===selectedIndex}"><span><i style="background:${item.color}"></i>${esc(item.name)}</span><b>${item.label}</b></button>`).join('')}</div>`;
 const change=valid(active.comparisonValue)&&single?comparison({value:active.comparisonValue,label:'环',variant:'compact'}):'';
 return `<section class="yk-card yk-ratio-rings" data-component="ratio-rings" data-source="${single?'6695:315922':'6695:316135'}" data-ratio-mode="${single?'single':'multi'}">${title?`<h3>${esc(title)}</h3>`:''}
 <div class="yk-ratio-face"><svg viewBox="0 0 162 162" aria-hidden="true">${tracks}</svg><div class="yk-ratio-center" aria-live="polite"><span data-ratio-name>${esc(active.name)}</span><strong data-ratio-value>${active.label}</strong>${change}</div></div>
 ${switches}<div class="yk-ratio-panel" aria-live="polite">${panel}</div></section>`;
}
function hydrateRatioRings(root){
 root.querySelectorAll('.yk-ratio-rings').forEach(card=>{
  const choices=card.querySelectorAll('[data-ratio-select]');
  choices.forEach(button=>button.onclick=()=>{
   const index=button.dataset.ratioSelect;
   choices.forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
   card.querySelectorAll('[data-ratio-panel]').forEach(panel=>panel.hidden=panel.dataset.ratioPanel!==index);
   card.querySelectorAll('[data-ratio-track]').forEach(track=>track.classList.toggle('is-current',track.dataset.ratioTrack===index));
   card.querySelector('[data-ratio-name]').textContent=button.dataset.rateName;
   card.querySelector('[data-ratio-value]').textContent=button.dataset.rate;
  });
 });
}
const homePerformanceSources={
 '6671:164095':{title:'经营性收入',kind:'income'},
 '6671:164148':{title:'税前利润',kind:'profit'},
 '6671:164196':{title:'现金流净额',kind:'cashflow'}
};
function homePerformanceCard({source,scope='',value=null,unit='',completion=null,comparisonValue=null,gap,yoyDelta}={}){
 if(!Object.hasOwn(homePerformanceSources,source))throw Error('未识别的主页经营卡原稿');
 const {title,kind}=homePerformanceSources[source];
 const fields=[value,completion,comparisonValue,gap?.value??null,yoyDelta?.value??null];
 if(fields.some(amount=>amount!==null&&!valid(amount)))throw Error('主页经营卡须输入有限数值或 null');
 if(typeof unit!=='string'||!unit.trim())throw Error('主页主值需要金额单位');
 if(kind==='cashflow'&&(completion!==null||comparisonValue!==null))throw Error('现金流卡缺口和同比金额变动须单独输入');
 const format=chartNumberFormatter(2);
 const amount=(number,suffix,sign=false)=>number===null?'—':esc((number<0?'−':sign&&number>0?'+':'')+format.format(Math.abs(number))+suffix);
 const badge=valid(comparisonValue)?comparison({value:comparisonValue,label:'同',variant:'home'}):'';
 const progress=completion===null?0:Math.min(100,Math.max(0,completion));
 const delta=(item,signed=false)=>{
  if(item?.value==null)return '—';
  if(typeof item.unit!=='string'||!item.unit.trim())throw Error('现金流缺口与变动需要各自的金额单位');
  return amount(item.value,item.unit,signed);
 };
 const footer=kind==='cashflow'
  ?`<dl class="yk-performance-deltas"><div><dt>目标缺口</dt><dd>${delta(gap)}</dd></div><div><dt>同比金额变动</dt><dd>${delta(yoyDelta,true)}</dd></div></dl>`
  :`<div class="yk-performance-progress"><span>完成率</span><div class="yk-performance-track" style="--yk-completion:${progress}%"><i data-performance-fill style="width:${progress}%" aria-hidden="true"></i><b data-performance-rate>${completion===null?'—':format.format(completion)+'%'}</b></div></div>`;
 return `<section class="yk-home-card yk-home-performance" data-component="home-performance-card" data-source="${source}" data-performance-kind="${kind}"><div class="yk-performance-head"><div><h3>${title}</h3>${scope?`<p>${esc(scope)}</p>`:''}</div><div><strong data-performance-value>${amount(value,unit)}</strong>${badge}</div></div>${footer}</section>`;
}
function homeProfitExplanation({updated='',rate=null,profit=null,revenue=null,unit='',yoy=null,mom=null}={}){
 const fields=[rate,profit,revenue,yoy,mom];
 if(fields.some(value=>value!==null&&!valid(value)))throw Error('税前利润率解释卡须输入有限数值或 null');
 if((profit!==null||revenue!==null)&&(typeof unit!=='string'||!unit.trim()))throw Error('解释项需要统一金额单位');
 const format=chartNumberFormatter(2);
 const value=(amount,suffix)=>amount===null?'—':format.format(amount)+'<small>'+esc(suffix)+'</small>';
 const comparisons=[[yoy,'同'],[mom,'环']].filter(([change])=>change!==null)
  .map(([change,label])=>comparison({value:change,label,variant:'home compact'})).join('');
 return `<section class="yk-home-card yk-home-profit-explanation" data-component="home-profit-explanation" data-source="4424:72991">
 <div class="yk-home-row"><div><h3>税前利润率</h3>${updated?`<small>更新 ${esc(updated)}</small>`:''}</div>
 <div class="yk-home-number"><strong data-profit-rate>${value(rate,'%')}</strong>${comparisons?`<div class="yk-profit-comparisons">${comparisons}</div>`:''}</div></div>
 <dl class="yk-home-explanation"><div><dt>税前利润（权责）</dt><dd>${value(profit,unit)}</dd></div><div><dt>经营性收入（权责）</dt><dd>${value(revenue,unit)}</dd></div></dl></section>`;
}
function homeCashflowTargets({updated='',unit='',month={},halfYear={},year={}}={}){
 const amounts=[month.net,month.yoyDelta,halfYear.net,halfYear.target,halfYear.yoyDelta,year.net,year.target,year.yoyDelta];
 if([...amounts,halfYear.rate,year.rate].some(value=>value!=null&&!valid(value)))throw Error('现金流目标卡须输入有限数值或 null');
 if(amounts.some(valid)&&(typeof unit!=='string'||!unit.trim()))throw Error('现金流目标卡需要统一金额单位');
 const format=new Intl.NumberFormat('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2,useGrouping:false});
 const reading=(value,suffix)=>valid(value)?format.format(value)+'<small>'+esc(suffix)+'</small>':'—';
 const change=delta=>valid(delta)?comparison({value:delta,label:'同',variant:'home',unit}):'';
 const period=(label,{rate,net,target,yoyDelta})=>`
 <section class="yk-cashflow-period">
  <div class="yk-home-row"><h4>${label}达成率</h4><div class="yk-home-number"><strong>${reading(rate,'%')}</strong>${change(yoyDelta)}</div></div>
  <dl class="yk-home-explanation"><div><dt>${label}累计达成（净额）</dt><dd>${reading(net,unit)}</dd></div><div><dt>${label}目标</dt><dd>${reading(target,unit)}</dd></div></dl>
 </section>`;
 return `<section class="yk-home-card purple yk-home-cashflow-targets" data-component="home-cashflow-targets" data-source="4424:72760">
 <div class="yk-home-row"><div><h3>现金流当月净额</h3>${updated?`<small>更新 ${esc(updated)}</small>`:''}</div>
  <div class="yk-home-number"><strong data-cashflow-current>${reading(month.net,unit)}</strong>${change(month.yoyDelta)}</div></div>
 <div class="yk-home-divider" aria-hidden="true"></div>${period('半年度',halfYear)}
 <div class="yk-home-divider" aria-hidden="true"></div>${period('年度',year)}</section>`;
}
function radar({items=[],max=100}={}){if(max<=0||items.length<3||items.some(i=>!valid(i.value)||i.value<0||i.value>max))throw Error('雷达需至少3个同量纲非负维度');const P=(j,r)=>point(155,130,r,-Math.PI/2+j/items.length*Math.PI*2);return `<div data-component="radar" data-provenance="documented-suggestion"><svg viewBox="0 0 311 270" aria-label="多维对比">${[.25,.5,.75,1].map(r=>`<polygon points="${items.map((_,j)=>P(j,95*r).join(',')).join(' ')}" fill="none" stroke="#E5E6EB"/>`).join('')}<polygon points="${items.map((it,j)=>P(j,95*it.value/max).join(',')).join(' ')}" fill="${C.teal}" fill-opacity=".14" stroke="${C.teal}" stroke-width="1.5"/>${items.map((it,j)=>{const [x,y]=P(j,116);return `<text x="${x}" y="${y}" text-anchor="middle" class="yk-axis">${esc(it.name)}</text>`;}).join('')}</svg></div>`;}
function hydrate(root=document){T.hydrate(root);hydrateWarningRankings(root);hydrateContractTrends(root);hydrateRatioRings(root);hydratePeriodCurves(root);hydrateCategoryColumns(root);hydrateMonthlyRevenueGauges(root);hydrateReceiptCompositions(root);hydrateSignedPeriodBars(root);hydrateSatisfactionRadars(root);hydrateWithholdingAnalyses(root);hydrateWithholdingRankings(root);Q.hydrateDates(root);Q.hydrateOrganizations(root);hydrateHomeHeaders(root);hydrateHomeNavigation(root);Q.hydrateFilters(root);B.hydrateBusinessRankings(root);root.querySelectorAll('[data-category]').forEach(btn=>btn.onclick=()=>{const panel=btn.closest('.yk-category-panel'),card=panel.closest('.yk-funding,.yk-device'),cat=btn.dataset.category;panel.classList.toggle('charging',cat==='charging'||cat==='owned');panel.classList.toggle('added',cat==='added'||cat==='external');card.dataset.currentCategory=cat;panel.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String(b===btn)));panel.querySelector('.yk-category-detail').innerHTML=card.querySelector(`template[data-detail="${cat}"]`).innerHTML;});root.querySelectorAll('[data-basic-tab]').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));});root.querySelectorAll('.yk-trend').forEach(card=>{card.querySelectorAll('[data-toggle-series]').forEach(cb=>cb.onchange=()=>{card.querySelectorAll(`[data-series="${cb.dataset.toggleSeries}"]`).forEach(el=>el.style.display=cb.checked?'':'none');card.querySelector('.yk-no-series').hidden=Array.from(card.querySelectorAll('input')).some(x=>x.checked);});card.querySelector('[data-time-select]').onchange=e=>{const data=JSON.parse(card.querySelector('.yk-trend-data').textContent);const enabled=Array.from(card.querySelectorAll('[data-toggle-series]')).map(x=>x.checked);const wrap=document.createElement('div');wrap.innerHTML=trend({...data,selectedIndex:+e.target.value});const next=wrap.firstElementChild;card.replaceWith(next);hydrate(next.parentElement);next.querySelectorAll('[data-toggle-series]').forEach((cb,i)=>{cb.checked=enabled[i];cb.onchange();});};});root.querySelectorAll('.yk-ranking').forEach(card=>{
 const scroll=card.querySelector('.yk-table-scroll');const edges=()=>{card.classList.toggle('yk-shadow-left',scroll.scrollLeft>1);card.classList.toggle('yk-shadow-right',scroll.scrollLeft+scroll.clientWidth<scroll.scrollWidth-1);};scroll.onscroll=edges;if(!card._edgeObserver&&typeof ResizeObserver!=='undefined'){card._edgeObserver=new ResizeObserver(edges);card._edgeObserver.observe(scroll);}edges();
 const expand=card.querySelector('[data-ranking-expand]');if(expand)expand.onclick=()=>{const placeholder=document.createComment('ranking-origin'),dialog=document.createElement('dialog'),close=document.createElement('button');dialog.className='yk-ranking-dialog yk-root';dialog.setAttribute('aria-label',card.querySelector('h3').textContent);close.type='button';close.textContent='退出全屏';close.className='yk-ranking-close';const previousOverflow=document.body.style.overflow;card.before(placeholder);dialog.append(close,card);document.body.append(dialog);document.body.style.overflow='hidden';expand.hidden=true;dialog.addEventListener('close',()=>{placeholder.replaceWith(card);dialog.remove();document.body.style.overflow=previousOverflow;expand.hidden=false;edges();expand.focus();},{once:true});close.onclick=()=>dialog.close();dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dialog.close();}},true);dialog.showModal();close.focus();edges();};const applySearch=()=>{const val=card.querySelector('[data-rank-search]').value.trim(),column=+card.querySelector('[data-rank-search-column]').value;card.querySelectorAll('tbody tr').forEach(tr=>tr.hidden=!String(column===Number(card.dataset.rateColumn)?tr.cells[column].textContent:JSON.parse(tr.dataset.values)[column]??'').includes(val));};card.querySelector('[data-rank-search]').oninput=applySearch;card.querySelector('[data-rank-search-column]').onchange=applySearch;card.querySelectorAll('[data-sort-column]').forEach(b=>b.onclick=()=>{const i=+b.dataset.sortColumn,asc=b.dataset.order!=='asc';card.querySelectorAll('[data-sort-column]').forEach(x=>{x.dataset.order='';x.setAttribute('aria-sort','none');});b.dataset.order=asc?'asc':'desc';b.setAttribute('aria-sort',asc?'ascending':'descending');const body=card.querySelector('tbody');Array.from(body.rows).sort((a,b)=>{const x=JSON.parse(a.dataset.values)[i],y=JSON.parse(b.dataset.values)[i];if(i===Number(card.dataset.rateColumn)&&(x===null||y===null))return Number(x===null)-Number(y===null);return(typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'zh-CN'))*(asc?1:-1);}).forEach(tr=>body.appendChild(tr));});});}
const api={detailRanking:T.detailRanking,statusTag,businessRanking:B.businessRanking,filterControl:Q.filterControl,organizationControl:Q.organizationControl,dateControl:Q.dateControl,nativeRingState,axisModel,seriesPalette,icon,comparison,relativeChange,fundingModel,fundingBar,aiHint,warning,warningRanking,risk,progressRing,multiRing,donut,deviceComposition,trend,ranking,homeCard,tabs,header,homeHeader,homeDashboard,homeNavigation,bars,horizontalBars,funnel,stageConversion,cashflowInline,actualTarget,chargeRateTarget,contractTrend,withholdingAnalysis,withholdingPayment,withholdingRankings,satisfactionRadar,signedPeriodBars,yearAmountRings,receiptComposition,monthlyRevenueGauge,categoryColumns,periodCurves,ratioRings,homePerformanceCard,homeProfitExplanation,homeCashflowTargets,radar,hydrate,esc,num,assetBundle:JSON.stringify(A)};
if(typeof module!=='undefined')module.exports=api;global.Yikan=api;
})(globalThis);
