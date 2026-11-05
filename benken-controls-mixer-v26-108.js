/* BenKen V26.108: UI helpers. No audio graph or playback commands here. */
(function(root){
 'use strict';
 const $=id=>document.getElementById(id),app=root.BenKenApp;
 if(!app)return;
 const dialog=$('performanceSettings'),back=$('performanceSettingsBack'),title=$('performanceSettingsTitle');
 const originalBack=back.onclick;
 const paths={controls:'M3 5h18M3 12h18M3 19h18M8 3v4M16 10v4M10 17v4',fullscreen:'M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6',lyrics:'M6 3h9l4 4v14H6zM9 12h7M9 16h7',buttons:'M3 4h7v6H3zM14 4h7v6h-7zM3 14h7v6H3zM14 14h7v6h-7z',groups:'M3 6h18M3 12h18M3 18h18M8 3v18'};
 const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[name]+'"/></svg>';
 const grid=dialog.querySelector('.controls-options-grid'),advanced=[...dialog.querySelectorAll('.controls-advanced')];
 const sections=[grid.children[0],grid.children[1],...advanced];
 const names=['Control bar & side shortcuts','Fullscreen','Playback & lyrics','Available buttons','Mute group names'];
 const icons=['controls','fullscreen','lyrics','buttons','groups'];
 const nav=document.createElement('nav');nav.className='controls-category-menu';nav.setAttribute('aria-label','Controls categories');
 nav.innerHTML=names.map((name,i)=>'<button type="button" data-controls-category="'+i+'">'+svg(icons[i])+'<span>'+name+'</span><span aria-hidden="true">›</span></button>').join('');
 grid.before(nav);
 let category=null;
 function page(index){
  category=index;nav.hidden=index!==null;
  grid.hidden=index!==0&&index!==1;
  sections.forEach((section,i)=>{section.hidden=index!==i;if(section.tagName==='DETAILS'&&i!==0)section.open=index===i;});
  title.textContent=index===null?'Controls & fullscreen':names[index];
  back.hidden=index===null?dialog.dataset.fromSettings!=='true':false;
  back.textContent=index===null?'‹ Settings':'‹ Controls';back.setAttribute('aria-label',index===null?'Back to Settings':'Back to Controls');
  dialog.querySelector('.controls-intro').hidden=true;
  dialog.scrollTop=0;
 }
 root.BenKenControlMenus={home:()=>{dialog.dataset.fromSettings=String(!back.hidden);page(null)}};
 nav.onclick=e=>{const row=e.target.closest('[data-controls-category]');if(row)page(Number(row.dataset.controlsCategory))};
 back.onclick=()=>category===null?originalBack?.():page(null);
 // A reminder never changes routing and never starts audio.
 const notice=document.createElement('dialog');notice.id='playReadinessNotice';notice.innerHTML='<div class="performance-settings-heading"><h2>Check Stereo / USB</h2><button type="button" aria-label="Close playback reminder">Done</button></div><p>Choose Practice / Stereo for speakers or headphones, or Live / USB for your audio interface. Check the connected device and output buses.</p><p id="playReadinessReason"></p><button type="button" data-open-audio>OPEN AUDIO & PLAYBACK</button>';
 document.body.append(notice);notice.querySelector('button').onclick=()=>notice.close();
 notice.querySelector('[data-open-audio]').onclick=()=>{notice.close();if($('mixerDialog').open)$('closeMixer').click();$('settingsBtn').click();document.querySelector('[data-tab="PLAYBACK"]')?.click()};
 root.BenKenPlayNotice=status=>{if(notice.open)return;$('playReadinessReason').textContent=status?.text||'Audio is not ready. Select a song and prepare its audio before pressing Play.';notice.showModal()};
 // The original disabled transport stays disabled; its overlay only explains readiness.
 const play=$('audioPlay'),hit=document.createElement('span'),explain=document.createElement('button');hit.className='play-reminder-hit';play.before(hit);hit.append(play);explain.type='button';explain.className='play-reminder-overlay';explain.setAttribute('aria-label','Play unavailable: check Stereo / USB');explain.onclick=()=>root.BenKenPlayNotice(app.mixer.readiness());hit.append(explain);
 const syncPlay=()=>{explain.hidden=!play.disabled};new MutationObserver(syncPlay).observe(play,{attributes:true,attributeFilter:['disabled']});syncPlay();
 // Pack side shortcuts without empty gaps when any one is hidden.
 const dock=document.createElement('div');dock.className='dock-left-tools';const compact=document.querySelector('.compact-navigation');compact.prepend(dock);
 for(const id of ['metronomeDockButton','tunerDockButton','songKeyButton','view'])dock.append($(id));
 // Next-song preview follows the lyric scroll, not a timer that moves the UI.
 function preview(){const options=app.state().opts,node=$('scrollNextSong');
  if(!options.showNextWhenScrolling||document.hidden){if(!node.hidden)node.hidden=true;return}
  const next=$('nextName'),top=next.getBoundingClientRect().bottom,header=document.querySelector('header').getBoundingClientRect().bottom;
  const visible=top<Math.max(0,header)&&!$('settings').classList.contains('settings-open')&&!$('settings').classList.contains('open')&&$('settings').classList.contains('hidden')&&!document.querySelector('dialog[open]');
  if(node.hidden===visible)node.hidden=!visible;if(!visible)return;if(node.textContent!==next.textContent)node.textContent=next.textContent;const y=Math.max(8,header+8)+'px';if(node.style.top!==y)node.style.top=y;
 }
 root.addEventListener('scroll',preview,{passive:true});root.addEventListener('resize',preview,{passive:true});
 // Auto-scroll uses transforms, so native scroll events alone are insufficient.
 root.setInterval(preview,250);preview();
 page(null);
})(window);
