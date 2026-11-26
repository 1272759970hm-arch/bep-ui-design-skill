/**
 * 真实运行态探针：用 headless Chrome 实际渲染产物，把 DOM 实测结果回传。
 * 这不是读代码猜，是真的在浏览器里跑一遍。
 * 浏览器不可用时返回 ok:false，由状态机把相关规则判为 BLOCKED。
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PROBE_SCRIPT = `
<script>
(function(){
  function b64(s){ return btoa(unescape(encodeURIComponent(s))); }
  function emit(){
    if (document.getElementById('__qa_out')) return;
    var out = { ok:true, url:location.href, viewport:[innerWidth,innerHeight],
      screens:[], sheets:[], screenGo:[], sheetOpen:[], sheetClose:[], masks:[], toasts:[], backs:[],
      pointers:[], imgs:[], overflow:[], implContracts:[], emptyStates:[] };
    try {
      function attrs(el){
        var a={}; for(var i=0;i<el.attributes.length;i++){var x=el.attributes[i];a[x.name]=x.value;}
        return a;
      }
      function desc(el){
        var a=attrs(el);
        return { tag:el.tagName.toLowerCase(), id:el.id||'', cls:(el.className&&el.className.toString?el.className.toString():'')||'',
          attrs:a, text:(el.textContent||'').trim().slice(0,40),
          rect:(function(){var r=el.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.left),y:Math.round(r.top)};})() };
      }
      var all = document.querySelectorAll('*');
      for (var i=0;i<all.length;i++){
        var el=all[i], a=attrs(el), d;
        if ('data-screen' in a) out.screens.push(a['data-screen']);
        if ('data-sheet' in a) out.sheets.push(a['data-sheet']);
        if ('data-screen-go' in a) out.screenGo.push({target:a['data-screen-go'], el:desc(el)});
        if ('data-sheet-open' in a) out.sheetOpen.push({target:a['data-sheet-open'], el:desc(el)});
        if ('data-sheet-close' in a) out.sheetClose.push({target:a['data-sheet-close'], el:desc(el)});
        if ('data-mask' in a) out.masks.push({target:a['data-mask'], el:desc(el)});
        if ('data-toast' in a) out.toasts.push(desc(el));
        if ('data-back' in a) out.backs.push(desc(el));
        if (el.tagName==='IMG' || el.tagName==='IMAGE') out.imgs.push({src:a.src||'', el:desc(el)});
        if (/empty|blank|no-data|缺省|空状态/i.test((a.class||'')+' '+(a['data-empty']||''))) out.emptyStates.push(desc(el));
        var cur=''; try { cur=getComputedStyle(el).cursor; } catch(e){}
        if (cur==='pointer' || /pointer/.test(a.style||'')){
          d=desc(el); d.cursor=cur;
          // cursor 是继承属性：父级已经是 pointer 的子元素只是继承，不是独立可点元素
          var pc=''; try { pc = el.parentElement ? getComputedStyle(el.parentElement).cursor : ''; } catch(e){}
          d.inherited = (pc==='pointer');
          out.pointers.push(d);
        }
      }
      // 水平溢出：可滚动容器与 document
      var de=document.documentElement;
      out.overflow.push({ selector:'html', scrollWidth:de.scrollWidth, clientWidth:de.clientWidth });
      var cands=document.querySelectorAll('section, .screen, .phone, .device, .board, body');
      for(var j=0;j<cands.length;j++){
        var c=cands[j];
        if (c.scrollWidth > c.clientWidth + 2) out.overflow.push({selector:(c.tagName+'.'+c.className).slice(0,80), scrollWidth:c.scrollWidth, clientWidth:c.clientWidth});
      }
      // 触摸热区
      out.pointers.forEach(function(p){ p.touchOk = p.rect.w>=44 && p.rect.h>=44; });
      out.implContracts = Object.keys((function(){
        var set={}; for(var k=0;k<all.length;k++){var at=all[k].attributes;for(var q=0;q<at.length;q++){if(at[q].name.indexOf('data-')===0)set[at[q].name]=true;}}
        return set;})());
    } catch(e){ out.ok=false; out.error=String(e&&e.message||e); }
    var pre=document.createElement('pre'); pre.id='__qa_out';
    pre.style.cssText='display:none!important';
    pre.textContent = b64(JSON.stringify(out));
    (document.body||document.documentElement).appendChild(pre);
  }
  if (document.readyState==='complete') setTimeout(emit, 60);
  else window.addEventListener('load', function(){ setTimeout(emit,60); });
  setTimeout(emit, 900);
})();
</script>`;

function chromeBin(cfg) {
  // 不写死任何机器路径：优先环境变量，再自动探测常见安装位置，最后找 PATH。
  // 也允许在 qa.config.json 的 browser.chrome 里显式指定绝对路径（团队协作时各自覆盖）。
  const configured = (cfg.browser && cfg.browser.chrome) || 'auto';
  if (configured !== 'auto') {
    return fs.existsSync(configured) ? configured : null;
  }
  const env = process.env.CHROME_PATH || process.env.CHROMIUM_PATH;
  if (env && fs.existsSync(env)) return env;
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/opt/google/chrome/chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  try {
    const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'];
    for (const d of (process.env.PATH || '').split(path.delimiter)) {
      for (const n of names) {
        const p = path.join(d, n);
        if (fs.existsSync(p)) return p;
      }
    }
  } catch (_) { /* PATH 探测失败不算错误，继续走条件不足分支 */ }
  return null;
}

export function makeProbeFile(art, dir) {
  // 探针副本模拟「断网 file://」：剥离外链 script/link，避免等网络导致渲染挂起。
  // 外链本身由 R6-06 在原始产物里单独判违规，探针不重复判定。
  let raw = art.raw
    .replace(/<script\b[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\/[^>]*>\s*<\/script>/gi, '')
    .replace(/<link\b[^>]*\bhref\s*=\s*["'](?:https?:)?\/\/[^>]*\/?\s*>/gi, '')
    .replace(/<script\b[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\/[^>]*\/\s*>/gi, '');
  const injected = /<\/body\s*>/i.test(raw)
    ? raw.replace(/<\/body\s*>/i, PROBE_SCRIPT + '\n</body>')
    : raw + PROBE_SCRIPT;
  const p = path.join(dir, 'qa-probe.html');
  fs.writeFileSync(p, injected, 'utf8');
  return p;
}

export function runBrowserProbe(art, cfg, opts = {}) {
  const bin = chromeBin(cfg);
  if (!bin) return { ok: false, reason: `headless Chrome 不可用（browser.chrome=${cfg.browser.chrome}）。请安装 Chrome/Chromium，或设置环境变量 CHROME_PATH，或在 qa.config.json 里写 browser.chrome 绝对路径；运行态校验条件不足` };
  if (art.type !== 'html') return { ok: false, reason: `产物类型 ${art.type} 不适用浏览器渲染探针` };

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bep-qa-'));
  const probe = makeProbeFile(art, dir);
  const [w, h] = opts.viewport || cfg.browser.defaultViewport;
  const profile = path.join(dir, 'chrome-profile');
  const shot = path.join(dir, 'shot.png');

  const baseArgs = [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--window-size=${w},${h}`,
    `--virtual-time-budget=${cfg.browser.virtualTimeBudget}`,
    `--user-data-dir=${profile}`,
    '--disable-dev-shm-usage', '--no-first-run', '--disable-extensions'
  ];

  let dom = '', lastErr = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      dom = execFileSync(bin, [...baseArgs, `--user-data-dir=${profile}-${attempt}`, '--dump-dom', `file://${probe}`], {
        encoding: 'utf8', timeout: 90000, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore']
      });
      lastErr = '';
      break;
    } catch (e) { lastErr = e.message; }
  }
  if (lastErr) return { ok: false, reason: `Chrome dump-dom 失败（已重试 1 次）：${lastErr}`, dir };

  const m = dom.match(/<pre[^>]*id="__qa_out"[^>]*>([\s\S]*?)<\/pre>/i);
  if (!m) return { ok: false, reason: '渲染探针未回传结果（页面脚本可能提前阻断 DOM）', dir };

  let probeData;
  try {
    probeData = JSON.parse(Buffer.from(m[1].trim(), 'base64').toString('utf8'));
  } catch (e) {
    return { ok: false, reason: `探针结果解析失败：${e.message}`, dir };
  }

  let screenshot = null, shotErr = '';
  for (let attempt = 0; attempt < 2 && !screenshot; attempt++) {
    try {
      execFileSync(bin, [...baseArgs, `--user-data-dir=${profile}-shot-${attempt}`, `--screenshot=${shot}`, `file://${probe}`], {
        encoding: 'utf8', timeout: 90000, stdio: ['ignore', 'ignore', 'pipe']
      });
      if (fs.existsSync(shot)) screenshot = shot;
    } catch (e) { shotErr = e.message; }
  }
  if (!screenshot && shotErr) {
    return { ok: true, data: probeData, screenshot: null, dir, viewport: [w, h], probe,
      shotError: `截图两次均失败：${shotErr.slice(0, 160)}` };
  }

  return { ok: true, data: probeData, screenshot, dir, viewport: [w, h], probe };
}
