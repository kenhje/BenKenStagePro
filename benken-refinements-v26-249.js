/* Common settings navigation and home profile. Keeps audio routing untouched. */
(function(root){
 'use strict';const app=root.BenKenApp,$=id=>document.getElementById(id);if(!app)return;
 const icon=()=>root.BenKenMenuIcon('back');
 // Keep set time with the setlist instead of the retired top toolbar.
 const menus=['settingsContent','performanceSettings','mixerSetupDialog','tempoPanel','clickSettings','shareDialog','songLoudnessDialog','midiDialog','midiClockDialog','concertDialog','fullBackupDialog','songKeyDialog','tunerDialog','notesDialog','songCreator','lyricsEditor','sectionTimingDialog','setlistAddDialog'];for(const id of menus)$(id)?.classList.add('benken-menu-surface');document.querySelectorAll('dialog').forEach(d=>d.classList.add('benken-menu-surface'));const clock=$('timeBox');clock.classList.add('setlist-time-card');$('setTitle').after(clock);
 clock.querySelector('.progress').setAttribute('role','progressbar');clock.querySelector('.progress').setAttribute('aria-label','Setlist progress');
 const progress=()=>{const node=clock.querySelector('.progress');node.setAttribute('aria-valuemin','0');node.setAttribute('aria-valuemax','100');node.setAttribute('aria-valuenow',String(Math.round(parseFloat($('progressFill').style.width)||0)))};
 new MutationObserver(progress).observe($('progressFill'),{attributes:true,attributeFilter:['style']});progress();
 // V26.249: the band / artist logo and name take the place of the BenKen name in the top bar when chosen.
 const profile=document.createElement('div'),brand=document.querySelector('header .brand');profile.id='homeBandProfile';profile.hidden=true;const appName=brand.querySelector(':scope>strong');if(appName)appName.before(profile);else brand.prepend(profile);
 function updateProfile(){const db=app.state(),p=db.opts.bandProfile||{},name=String(p.name||p.displayName||'').trim(),logo=typeof p.logo==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.logo)&&p.logo.length<3000000?p.logo:'';profile.replaceChildren();clock.hidden=!db.songs.length;profile.hidden=db.opts.showBandOnHome!==true||(!name&&!logo);brand.classList.toggle('band-brand',!profile.hidden);if(profile.hidden)return;if(logo){const img=document.createElement('img');img.src=logo;img.alt='Band / artist logo';profile.append(img)}if(name){const strong=document.createElement('strong');strong.textContent=name;profile.append(strong)}}
 root.BenKenRefinements={profile:updateProfile};updateProfile();
 function backToSettings(dialog){const busy=dialog.querySelector('[aria-busy="true"]');if(busy)return;const done=dialog.querySelector('[id$="Close"],[id$="close"],#closeMixer');done?.click();if(dialog.open)return;app.openSettings()}
 const definitions=[['shareDialog','.tool-heading'],['songLoudnessDialog','.loudness-header'],['mixerDialog','.mixer-heading'],['midiDialog','.midi-heading']];
 for(const id of ['midiClose','shareClose','closeMixer','songLoudnessClose'])if($(id))$(id).textContent='Done';for(const [id,selector]of definitions){const dialog=$(id);if(!dialog)continue;const header=dialog.querySelector(selector)||dialog.querySelector('h2')?.parentElement;if(!header)continue;header.classList.add('unified-tool-heading');const button=document.createElement('button');button.type='button';button.className='tool-settings-back';button.innerHTML=icon()+'<span>Settings</span>';button.setAttribute('aria-label','Back to Settings');button.onclick=()=>backToSettings(dialog);header.prepend(button)}
 // Top-level dialog back buttons must respect ongoing uploads / loudness jobs.
 for(const id of ['shareDialog','songLoudnessDialog']){const dialog=$(id);if(!dialog)continue;const close=dialog.querySelector('[id$="Close"]'),back=dialog.querySelector('.tool-settings-back');if(close&&back){const sync=()=>back.disabled=close.disabled;new MutationObserver(sync).observe(close,{attributes:true,attributeFilter:['disabled']});sync()}}

 // Size the fader against the actual workspace left above docked Controls.
 const mixerDialog=$('mixerDialog'),workspace=$('mixerWorkspace');let layoutFrame=0;
 function fitMixer(){layoutFrame=0;if(!mixerDialog.open||mixerDialog.classList.contains('mixer-config-open'))return;
  const strip=[$('mixerTracks'),$('mixerBuses')].find(el=>el&&!el.classList.contains('hidden'))?.querySelector('.stem-strip'),console=$('mixerConsole'),bank=strip?.querySelector('.fader-bank');
  if(!bank||!console||!strip.getBoundingClientRect().height||!console.getBoundingClientRect().height)return;
  const room=workspace.getBoundingClientRect().bottom-console.getBoundingClientRect().top;
  const overhead=strip.getBoundingClientRect().height-bank.getBoundingClientRect().height+28;
  const height=Math.max(96,Math.floor(room-overhead));
  if(mixerDialog.style.getPropertyValue('--fader-height')!==height+'px')mixerDialog.style.setProperty('--fader-height',height+'px');
 }
 function scheduleMixerFit(){if(!layoutFrame)layoutFrame=requestAnimationFrame(fitMixer)}
 const mixerSize=new ResizeObserver(scheduleMixerFit);for(const el of [workspace,$('mixerControlsDock'),mixerDialog])if(el)mixerSize.observe(el);
 new MutationObserver(scheduleMixerFit).observe(mixerDialog,{attributes:true,attributeFilter:['open','class']});
 for(const id of ['mixerTracks','mixerBuses'])if($(id))new MutationObserver(scheduleMixerFit).observe($(id),{childList:true,attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',scheduleMixerFit);

 const overview=$('songSectionBar');if(overview)new ResizeObserver(()=>document.documentElement.style.setProperty('--arrangement-height',Math.ceil(overview.getBoundingClientRect().height)+6+'px')).observe(overview);
})(window);

/* V26.249: rows, buttons and list choices in the menus use normal sentence case ("Save click settings") like the
   Settings menu. Only text written in capitals is changed; short names (USB, MIDI, BPM, PDF …) stay in capitals.
   Section headings stay in small capitals. The page code never reads these labels back, so behaviour is unchanged. */
(function(root){
 'use strict';const doc=root.document;if(!doc)return;
 const keep=new Set(['USB','MIDI','BPM','PDF','EQ','FX','LUFS','DB','ID','OK','PA','IEM','SSL','RC-600','UI24R','REAPER','LED','QR','URL','CPU','AUX','DAW','AI','LTC','MTC','CC','PC','RMS','HZ','KHZ','MS','A4','A5','US','UK','BT','HTML','JSON','CSV','ZIP','MP3','WAV','M4A','AAC','FLAC','AIFF','IOS','IPAD','IPHONE','MAC','BENKEN','TM','II','III','IV','ABC','PIN','LAN','WI-FI','WIFI','NFC','GB','MB','KB','CHORDPRO','UI24']);
 const nice={IOS:'iOS',IPAD:'iPad',IPHONE:'iPhone',MAC:'Mac',BENKEN:'BenKen',HZ:'Hz',KHZ:'kHz',MS:'ms',DB:'dB',UI24R:'Ui24R','WI-FI':'Wi-Fi',WIFI:'Wi-Fi',CHORDPRO:'ChordPro',UI24:'Ui24'};
 const word=w=>{const core=w.replace(/^[^A-Z0-9]+|[^A-Z0-9-]+$/g,'');if(!core)return w.toLowerCase();if(keep.has(core)){const fixed=nice[core]||core;return w.replace(core,fixed)}return w.toLowerCase()};
 function sentence(text){
  if(!/[A-Z]{2}/.test(text)||text!==text.toUpperCase())return text;
  let out=text.split(/(\s+)/).map(p=>/\s/.test(p)?p:word(p)).join('');
  out=out.replace(/^(\W*)([a-zæøå])/,(m,a,b)=>a+b.toUpperCase());
  // capital after a full stop, a colon or a dot separator
  out=out.replace(/([.:·•]\s+)([a-zæøå])/g,(m,a,b)=>a+b.toUpperCase());
  return out;
 }
 const cards='.settings-section,.settings-tool-section,.doc-card,.band-card,.plan-card,.tool-card,.loudness-card,.controls-card,.backup-card,.click-card,.tempo-simple,.tempo-speed,.transpose-panel,.original-tempo-key,.web-sync,#settingsContent section,#audioDeviceBox';
 const skip='h1,h2,h3,h4,h5,.setting-title,.click-countin-heading,#mixerConsole,#performanceBar,.stem-strip,.chord-chart,textarea,input,code,pre,.dock-tools,[role=tablist],.mixer-tabs,#mixerTabs,.mixer-heading,.lyrics-preview,.song-list,#libraryResults,#setlistAddResults,.setlist-entries,.about-app,.backup-report';
 const holders='button,label,summary,option,span,small';
 // V26.249: never change a song, setlist or artist name the user wrote in capitals.
 let names=null,namesAt=0;
 function userText(text){
  if(!names||Date.now()-namesAt>5000){namesAt=Date.now();names=new Set();try{const db=root.BenKenApp?.state?.();for(const s of db?.songs||[])for(const v of [s.title,s.artist,s.name])if(v)names.add(String(v).trim().toUpperCase());for(const v of Object.keys(db?.setlists||{}))names.add(String(v).trim().toUpperCase());const p=db?.opts?.bandProfile||{};for(const v of [p.name,p.displayName])if(v)names.add(String(v).trim().toUpperCase())}catch(e){}}
  const t=text.trim().toUpperCase().replace(/^\d+\.\s*/,'');for(const n of names)if(n&&(t===n||t.includes(n)))return true;return false;
 }
 let queued=false;
 function run(){queued=false;segments();
  for(const card of doc.querySelectorAll(cards+',dialog,.benken-menu-surface')){
   if(!card.closest('dialog,.benken-menu-surface'))continue;
   const walker=doc.createTreeWalker(card,NodeFilter.SHOW_TEXT);let node;
   while((node=walker.nextNode())){
    const el=node.parentElement;if(!el||el.closest(skip)||!el.matches(holders))continue;
    const before=node.nodeValue;if(before.length<2||userText(before))continue;const after=sentence(before);if(after!==before)node.nodeValue=after;
   }
  }
 }
 // V26.249: a row of choice buttons (one is pressed) becomes one dropdown list, like iOS Settings. Choosing an item
 // presses the matching button, so every existing handler keeps working; the list follows the buttons.
 function segments(){
  const parents=new Set([...doc.querySelectorAll(':is(dialog,.benken-menu-surface) button[aria-pressed]')].map(b=>b.parentElement));
  for(const p of parents){
   if(!p||p.closest('#mixerConsole,#performanceBar,.stem-strip,.dock-tools,[role=tablist],nav,#nav,.settings-hub,.mixer-tabs,#mixerTabs,.chord-chart'))continue;
   const buttons=[...p.children].filter(c=>c.matches('button[aria-pressed]'));if(buttons.length<2)continue;
   // The skin buttons repeat the App skin list right above them.
   if(p.querySelector('[data-skin-preset]')&&doc.getElementById('skinSelect')){p.classList.add('bk-choice-hidden');continue}
   let select=p.previousElementSibling?.classList?.contains('bk-choice')?p.previousElementSibling:null;
   if(!select){select=doc.createElement('select');select.className='bk-choice';select.setAttribute('aria-label',p.getAttribute('aria-label')||p.closest('section,.settings-section,.doc-card')?.querySelector('h3,h4,.setting-title')?.textContent?.trim()||'Choose');p.before(select);p.classList.add('bk-choice-hidden');
    select.addEventListener('change',()=>{const b=[...p.children].filter(c=>c.matches('button[aria-pressed]'))[Number(select.value)];b?.click()})}
   const labels=buttons.map(b=>sentence(b.textContent.trim().replace(/\s+/g,' ')));
   if(select.options.length!==labels.length||[...select.options].some((o,i)=>o.text!==labels[i]))select.replaceChildren(...labels.map((t,i)=>new Option(t,String(i))));
   const on=buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true');if(on>=0&&select.value!==String(on))select.value=String(on);
   select.disabled=buttons.every(b=>b.disabled);
  }
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(run)}};
 new MutationObserver(schedule).observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-pressed','open']});schedule();
 root.BenKenSentenceCase=sentence;
})(window);
