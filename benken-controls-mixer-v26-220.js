/* BenKen V26.169: UI helpers. No audio graph or playback commands here. */
(function(root){
 'use strict';
 const $=id=>document.getElementById(id),app=root.BenKenApp;
 if(!app)return;
 const dialog=$('performanceSettings'),back=$('performanceSettingsBack'),title=$('performanceSettingsTitle');
 const originalBack=back.onclick;
 const paths={controls:'M3 5h18M3 12h18M3 19h18M8 3v4M16 10v4M10 17v4',fullscreen:'M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6',lyrics:'M6 3h9l4 4v14H6zM9 12h7M9 16h7',buttons:'M3 4h7v6H3zM14 4h7v6h-7zM3 14h7v6H3zM14 14h7v6h-7z',groups:'M3 6h18M3 12h18M3 18h18M8 3v18'};
 const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[name]+'"/></svg>';
 const grid=dialog.querySelector('.controls-options-grid'),advanced=[...dialog.querySelectorAll('.controls-advanced')];
 const sections=[grid.children[0],grid.children[1],...advanced.slice(0,2)];if(advanced[2])advanced[2].hidden=true;
 const names=['Control bar','Fullscreen','Playback & lyrics','Available buttons'];
 const icons=['controls','fullscreen','lyrics','buttons'];
 const nav=document.createElement('nav');nav.className='controls-category-menu';nav.setAttribute('aria-label','Controls categories');
 nav.innerHTML=names.map((name,i)=>'<button type="button" data-controls-category="'+i+'">'+svg(icons[i])+'<span>'+name+'</span><svg class="ui-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>').join('');
 grid.before(nav);
 let category=null;
 function page(index){
  category=index;nav.hidden=index!==null;
  grid.hidden=index!==0&&index!==1;
  sections.forEach((section,i)=>{section.hidden=index!==i;if(section.tagName==='DETAILS'&&i!==0)section.open=index===i;});
  title.textContent=index===null?'Controls & fullscreen':names[index];
  back.hidden=index===null?dialog.dataset.fromSettings!=='true':false;
  back.innerHTML='<svg class="ui-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg><span>'+(index===null?'Settings':'Controls')+'</span>';back.setAttribute('aria-label',index===null?'Back to Settings':'Back to Controls');
  dialog.querySelector('.controls-intro').hidden=true;
  dialog.scrollTop=0;
 }
 root.BenKenControlMenus={home:()=>{dialog.dataset.fromSettings=String(!back.hidden);page(null)}};
 nav.onclick=e=>{const row=e.target.closest('[data-controls-category]');if(row)page(Number(row.dataset.controlsCategory))};
 back.onclick=()=>category===null?originalBack?.():page(null);
 // V26.220: the play notice says what is wrong: Stereo / USB, no audio, or missing files.
 // It never changes routing on its own and never starts audio; PLAY WITHOUT AUDIO only starts lyric scrolling.
 const notice=document.createElement('dialog');notice.id='playReadinessNotice';notice.setAttribute('aria-labelledby','playNoticeTitle');
 notice.innerHTML='<div class="performance-settings-heading"><h2 id="playNoticeTitle">Play cannot start</h2><button type="button" data-notice-close aria-label="Close playback notice">Done</button></div>'+
  '<section class="play-notice-part" data-part="output"><h3><span>STEREO / USB</span><b data-output-state></b></h3><p data-output-text></p><div class="play-notice-actions"><button type="button" data-use-stereo hidden>USE STEREO (OUTPUTS 1–2)</button><button type="button" data-open-audio>OPEN AUDIO & PLAYBACK</button></div></section>'+
  '<section class="play-notice-part" data-part="files"><h3><span>AUDIO FILES</span><b data-files-state></b></h3><p data-files-text></p><ul data-files-list hidden></ul>'+
  '<div class="play-notice-actions" data-files-actions hidden><button type="button" data-add-files>ADD AUDIO FILE</button><button type="button" data-no-audio>PLAY WITHOUT AUDIO · SCROLL LYRICS</button></div>'+
  '<label class="play-notice-remember" data-remember-row hidden><input type="checkbox" data-remember> Remember for this song: always play it without audio and do not show this box again. The song is left out of the missing-audio lists. Turn it off with LYRICS ONLY in the song.</label></section>'+
  '<p id="playReadinessReason" data-other hidden></p>';
 document.body.append(notice);
 const q=sel=>notice.querySelector(sel);let check=null,serial=0;
 q('[data-notice-close]').onclick=()=>notice.close();
 const openAudio=()=>{notice.close();if($('mixerDialog').open)$('closeMixer').click();$('settingsBtn').click();document.querySelector('[data-tab="PLAYBACK"]')?.click()};
 q('[data-open-audio]').onclick=openAudio;
 q('[data-use-stereo]').onclick=()=>{if(app.mixer.setOutputMode?.('stereo')!==false){notice.close();root.setTimeout(()=>{if($('audioPlay').disabled)root.BenKenPlayNotice(app.mixer.readiness())},400)}};
 q('[data-add-files]').onclick=()=>{const relink=check?.missing.length>0&&$('relinkMissingAudio');notice.close();if(relink)$('relinkMissingAudio').click();else app.openFiles()};
 q('[data-no-audio]').onclick=()=>{const remember=q('[data-remember]').checked;notice.close();if(remember&&app.setLyricsOnly?.(true)===false)return;if(!remember||!app.setLyricsOnly){$('autoBtn')?.click();return}root.setTimeout(()=>$('autoBtn')?.click(),60)};
 function fill(c){
  check=c;const files=c.tracks===0||c.missing.length>0,usbBad=c.mode==='usb'&&!!c.outputError;
  q('#playNoticeTitle').textContent=files&&!usbBad?(c.tracks===0?'No audio in this song':'Audio files are missing'):usbBad&&!files?'No sound: check USB':'Play cannot start';
  // Stereo / USB
  q('[data-output-state]').textContent=c.outputError?'CHECK':c.tracks?'OK':'';q('[data-output-state]').dataset.state=c.outputError?'bad':c.tracks?'ok':'';
  q('[data-output-text]').textContent=c.mode==='stereo'?(c.outputError||'Practice / Stereo: all tracks, including the click, go to outputs 1–2 (speakers or headphones).'):
   c.outputError||('Live / USB'+(c.device?' · '+c.device:'')+(c.channels?' · '+c.channels+' outputs':'')+(c.tracks?' · this song needs '+c.needed+'.':'.'));
  q('[data-use-stereo]').hidden=!usbBad;
  // Audio files
  const list=q('[data-files-list]');
  q('[data-files-state]').textContent=files?(c.tracks===0?'NONE':c.missing.length+' MISSING'):'OK';q('[data-files-state]').dataset.state=files?'bad':'ok';
  q('[data-files-text]').textContent=c.tracks===0?'This song has no audio files. Add a file, or play the song without audio and only scroll the lyrics.':c.missing.length?c.missing.length+' of '+c.tracks+' audio file'+(c.tracks===1?' is':'s are')+' not on this device. Add the file'+(c.missing.length===1?'':'s')+' (matched by file name), or play without audio and only scroll the lyrics.':(c.tracks===1?'The audio file is':'All '+c.tracks+' audio files are')+' on this device.';
  list.hidden=!c.missing.length;list.innerHTML='';for(const m of c.missing.slice(0,12)){const li=document.createElement('li');li.textContent=m.name+(m.file&&m.file!==m.name?' · '+m.file:'');list.append(li)}if(c.missing.length>12){const li=document.createElement('li');li.textContent='… '+(c.missing.length-12)+' more';list.append(li)}
  q('[data-files-actions]').hidden=q('[data-remember-row]').hidden=!files;q('[data-remember]').checked=false;
  q('[data-add-files]').textContent=c.missing.length?'FIND MISSING FILES':'ADD AUDIO FILE';
  // Anything else (preparing, transpose, click …)
  const other=!files&&!c.outputError&&c.status?.text?c.status.text:'';const reason=q('[data-other]');reason.hidden=!other;reason.textContent=other;
 }
 root.BenKenPlayNotice=async status=>{
  if(status?.lyricsOnly){$('autoBtn')?.click();return}
  const mine=++serial;q('#playNoticeTitle').textContent='Checking…';for(const sel of ['[data-output-text]','[data-files-text]'])q(sel).textContent='Checking…';q('[data-files-list]').hidden=q('[data-files-actions]').hidden=q('[data-remember-row]').hidden=q('[data-use-stereo]').hidden=q('[data-other]').hidden=true;for(const sel of ['[data-output-state]','[data-files-state]'])q(sel).textContent='';
  if(!notice.open)notice.showModal();
  try{const c=await app.mixer.playCheck();if(mine===serial)fill(c)}catch(error){if(mine===serial){q('[data-other]').hidden=false;q('[data-other]').textContent=status?.text||error.message}}
 };
 // The original disabled transport stays disabled; its overlay only explains readiness.
 const play=$('audioPlay'),hit=document.createElement('span'),explain=document.createElement('button');hit.className='play-reminder-hit';play.before(hit);hit.append(play);explain.type='button';explain.className='play-reminder-overlay';explain.setAttribute('aria-label','Play unavailable: show why');explain.onclick=()=>root.BenKenPlayNotice(app.mixer.readiness());hit.append(explain);
 const syncPlay=()=>{explain.hidden=!play.disabled};new MutationObserver(syncPlay).observe(play,{attributes:true,attributeFilter:['disabled']});syncPlay();
 // Pack side shortcuts without empty gaps when any one is hidden.
 const dock=document.createElement('div');dock.className='dock-left-tools';const compact=document.querySelector('.compact-navigation');compact.prepend(dock);
 for(const id of ['view'])dock.append($(id));
 // Next-song preview follows the lyric scroll, not a timer that moves the UI.
 // V26.220: Ready and NEXT live in the top bar (where STANDALONE · OFFLINE READY was) while the top bar is shown
 // and the screen is wide enough. When the top bar is hidden (fullscreen) or on a narrow phone they go back under it,
 // so NEXT still shows the way it did before. The status line now only shows real messages (for example Save failed).
 const stack=document.querySelector('#songOverview .song-next-stack'),overview=$('songOverview'),statusLine=$('status'),homeHelp=document.querySelector('header .home-help');
 const IDLE_STATUS=/^\s*(STANDALONE · OFFLINE READY)?\s*$/i,wide=root.matchMedia?.('(min-width: 700px)');
 function placeStatus(){
  if(!stack||!overview||!homeHelp)return;
  const header=document.querySelector('body > header'),shown=header&&getComputedStyle(header).display!=='none'&&!document.body.classList.contains('stage-fullscreen'),inHeader=!!(shown&&(wide?wide.matches:root.innerWidth>=700));
  if(inHeader&&stack.parentElement!==homeHelp){homeHelp.append(stack);stack.classList.add('header-song-status')}
  else if(!inHeader&&stack.parentElement!==overview){overview.append(stack);stack.classList.remove('header-song-status')}
  document.body.classList.toggle('song-status-in-header',inHeader);
  if(statusLine){const idle=IDLE_STATUS.test(statusLine.textContent);if(statusLine.hidden!==idle)statusLine.hidden=idle}
 }
 if(statusLine)new MutationObserver(placeStatus).observe(statusLine,{childList:true,characterData:true,subtree:true});
 new MutationObserver(placeStatus).observe(document.body,{attributes:true,attributeFilter:['class']});
 wide?.addEventListener?.('change',placeStatus);root.addEventListener('resize',placeStatus,{passive:true});placeStatus();
 // V26.220: while the sticky section bar covers the top bar, hide the top bar so its lower edge does not show as a thin line.
 function coverTopBar(){const bar=$('songSectionBar'),header=document.querySelector('body > header');if(!header)return;const box=bar&&!bar.hidden&&getComputedStyle(bar).display!=='none'?bar.getBoundingClientRect():null,hb=header.getBoundingClientRect();const covered=!!box&&box.height>0&&box.top<hb.bottom-4&&box.top<=hb.top+2;document.body.classList.toggle('section-bar-covers-top',covered)}
 function preview(){coverTopBar();const options=app.state().opts,node=$('scrollNextSong');
  if(!options.showNextWhenScrolling||document.hidden){if(!node.hidden)node.hidden=true;return}
  const next=$('nextName'),inHeader=document.body.classList.contains('song-status-in-header'),bar=$('songSectionBar'),barBox=bar&&!bar.hidden&&getComputedStyle(bar).display!=='none'?bar.getBoundingClientRect():null;
  let top=next.getBoundingClientRect().bottom,header=document.querySelector('header').getBoundingClientRect().bottom;
  // V26.220: with NEXT in the top bar, show the framed NEXT when the section bar covers the top bar (it sticks to the top while scrolling).
  if(inHeader){const covered=!!barBox&&barBox.height>0&&barBox.top<header-4;top=covered?-1:Infinity;header=covered?barBox.bottom:header}
  const visible=top<Math.max(0,header)&&!$('settings').classList.contains('settings-open')&&!$('settings').classList.contains('open')&&$('settings').classList.contains('hidden')&&!document.querySelector('dialog[open]');
  if(node.hidden===visible)node.hidden=!visible;if(!visible)return;if(node.textContent!==next.textContent)node.textContent=next.textContent;const y=Math.max(8,header+8)+'px';if(node.style.top!==y)node.style.top=y;
 }
 root.addEventListener('scroll',preview,{passive:true});root.addEventListener('resize',preview,{passive:true});
 // Auto-scroll uses transforms, so native scroll events alone are insufficient.
 root.setInterval(preview,250);preview();
 page(null);
})(window);
