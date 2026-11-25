/* Common settings navigation and home profile. Keeps audio routing untouched. */
(function(root){
 'use strict';const app=root.BenKenApp,$=id=>document.getElementById(id);if(!app)return;
 const icon=()=>root.BenKenMenuIcon('back');
 // Keep set time with the setlist instead of the retired top toolbar.
 const menus=['settingsContent','performanceSettings','mixerSetupDialog','tempoPanel','clickSettings','shareDialog','songLoudnessDialog','midiDialog','midiClockDialog','concertDialog','fullBackupDialog','songKeyDialog','tunerDialog','notesDialog','songCreator','lyricsEditor','sectionTimingDialog','setlistAddDialog'];for(const id of menus)$(id)?.classList.add('benken-menu-surface');document.querySelectorAll('dialog').forEach(d=>d.classList.add('benken-menu-surface'));const clock=$('timeBox');clock.classList.add('setlist-time-card');$('setTitle').after(clock);
 clock.querySelector('.progress').setAttribute('role','progressbar');clock.querySelector('.progress').setAttribute('aria-label','Setlist progress');
 const progress=()=>{const node=clock.querySelector('.progress');node.setAttribute('aria-valuemin','0');node.setAttribute('aria-valuemax','100');node.setAttribute('aria-valuenow',String(Math.round(parseFloat($('progressFill').style.width)||0)))};
 new MutationObserver(progress).observe($('progressFill'),{attributes:true,attributeFilter:['style']});progress();
 // V26.273: the band / artist logo and name take the place of the BenKen name in the top bar when chosen.
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

/* V26.273: rows, buttons and list choices in the menus use normal sentence case ("Save click settings") like the
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
 const cards='.settings-section,.settings-tool-section,.doc-card,.band-card,.plan-card,.tool-card,.loudness-card,.controls-card,.backup-card,.click-card,.tempo-simple,.tempo-speed,.transpose-panel,.original-tempo-key,.web-sync,#settingsContent section,#audioDeviceBox,#mixerSetupDialog section,#mixerSetupDialog .setup-footer';
 const skip='.controls-advanced,#midiDialog,#midiClockDialog,h1,h2,h3,h4,h5,.setting-title,.click-countin-heading,#mixerConsole,#performanceBar,.stem-strip,.chord-chart,textarea,input,code,pre,.dock-tools,[role=tablist],.mixer-tabs,#mixerTabs,.mixer-heading,.lyrics-preview,.song-list,#libraryResults,#setlistAddResults,.setlist-entries,.about-app,.backup-report';
 const holders='button,label,summary,option,span,small';
 // V26.273: never change a song, setlist or artist name the user wrote in capitals.
 let names=null,namesAt=0;
 function userText(text){
  if(!names||Date.now()-namesAt>5000){namesAt=Date.now();names=new Set();try{const db=root.BenKenApp?.state?.();for(const s of db?.songs||[])for(const v of [s.title,s.artist,s.name])if(v)names.add(String(v).trim().toUpperCase());for(const v of Object.keys(db?.setlists||{}))names.add(String(v).trim().toUpperCase());const p=db?.opts?.bandProfile||{};for(const v of [p.name,p.displayName])if(v)names.add(String(v).trim().toUpperCase())}catch(e){}}
  const t=text.trim().toUpperCase().replace(/^\d+\.\s*/,'');for(const n of names)if(n&&(t===n||t.includes(n)))return true;return false;
 }
 let queued=false;
 function run(){queued=false;segments();
  for(const card of doc.querySelectorAll(cards+',dialog,.benken-menu-surface')){
   if(!card.closest('dialog,.benken-menu-surface')||card.closest('.controls-advanced,#midiDialog,#midiClockDialog'))continue;
   const walker=doc.createTreeWalker(card,NodeFilter.SHOW_TEXT);let node;
   while((node=walker.nextNode())){
    const el=node.parentElement;if(!el||el.closest(skip)||!el.matches(holders))continue;
    const before=node.nodeValue;if(before.length<2||userText(before))continue;const after=sentence(before);if(after!==before)node.nodeValue=after;
   }
  }
 }
 // V26.273: a row of choice buttons (one is pressed) becomes one dropdown list, like iOS Settings. Choosing an item
 // presses the matching button, so every existing handler keeps working; the list follows the buttons.
 function segments(){
  const parents=new Set([...doc.querySelectorAll(':is(dialog,.benken-menu-surface) button[aria-pressed]')].map(b=>b.parentElement));
  for(const p of parents){
   if(!p||p.closest('.controls-advanced,#midiDialog,#midiClockDialog,#mixerConsole,#performanceBar,.stem-strip,.dock-tools,[role=tablist],nav,#nav,.settings-hub,.mixer-tabs,#mixerTabs,.chord-chart,.song-color-picker,#mixerTrackGroups,.bk-keep-buttons,.plan-tabs,.plan-calendar-grid,.calendar-grid,.calendar-month,.calendar-week'))continue;
   const buttons=[...p.children].filter(c=>c.matches('button[aria-pressed]'));if(buttons.length<2||buttons.some(b=>!b.textContent.trim()))continue;
   // The skin buttons repeat the App skin list right above them.
   if(p.querySelector('[data-skin-preset]')&&doc.getElementById('skinSelect')){p.classList.add('bk-choice-hidden');continue}
   // Other buttons in the same row (Export, Save …) stay; only the choice buttons fold into the list.
   const mixed=[...p.children].some(c=>!c.matches('button[aria-pressed],select.bk-choice'));const first=buttons[0];
   const anchor=mixed?first:p;let select=anchor.previousElementSibling?.classList?.contains('bk-choice')?anchor.previousElementSibling:null;
   if(!select){select=doc.createElement('select');select.className='bk-choice';select.setAttribute('aria-label',p.getAttribute('aria-label')||p.closest('section,.settings-section,.doc-card')?.querySelector('h3,h4,.setting-title')?.textContent?.trim()||'Choose');anchor.before(select);if(mixed){p.classList.add('bk-choice-mixed');for(const b of buttons)b.classList.add('bk-choice-hidden')}else p.classList.add('bk-choice-hidden');
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

/* V26.273: rows you can press look pressable, like iPad and iPhone Settings — a small icon in the skin's accent colour
   on the left, an arrow on the right for actions, red for delete / remove / reset. Lists without a name get one.
   Only adds a decorative icon and classes; every button keeps its own handler. */
(function(root){
 'use strict';const doc=root.document;if(!doc)return;
 const P={
  plus:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  copy:'<path d="M8 8h12v12H8zM4 16V4h12"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/>',
  play:'<path d="M7 4v16l13-8z"/>',
  stop:'<path d="M6 6h12v12H6z"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
  download:'<path d="M12 4v12M7 11l5 5 5-5M4 16v4h16v-4"/>',
  save:'<path d="m5 12 5 5 9-10"/>',
  tempo:'<path d="M6 21 10 3h4l4 18zM12 15l6-8M8 15h8"/>',
  midi:'<circle cx="12" cy="12" r="9"/><path d="M7 14h.1M7 10h.1M10 7h.1M14 7h.1M17 10h.1M17 14h.1"/>',
  audio:'<path d="M4 9h4l5-5v16l-5-5H4zM17 8a6 6 0 0 1 0 8"/>',
  lyrics:'<path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.1M4 12h.1M4 18h.1"/>',
  sync:'<path d="M4 9a8 8 0 0 1 14-4l2 2M20 3v4h-4M20 15a8 8 0 0 1-14 4l-2-2M4 21v-4h4"/>',
  theme:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 3a9 9 0 0 1 0 18"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  calendar:'<path d="M4 5h16v16H4zM4 10h16M8 3v4M16 3v4"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  link:'<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
  repeat:'<path d="M4 12V9a3 3 0 0 1 3-3h12l-3-3M20 12v3a3 3 0 0 1-3 3H5l3 3"/>',
  alert:'<path d="M12 3 2 21h20zM12 10v5M12 18h.1"/>',
  pin:'<path d="M9 4h6l-1 6 4 3H6l4-3zM12 13v8"/>',
  sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  switch:'<rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="16" cy="12" r="2.5"/>',
  more:'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>',
  dot:'<circle cx="12" cy="12" r="3"/>',
  file:'<path d="M6 3h9l4 4v14H6zM14 3v5h5"/>',
  mic:'<path d="M9 4a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3"/>',
  text:'<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
  hand:'<path d="M8 13V5a2 2 0 0 1 4 0v6M12 11V4a2 2 0 0 1 4 0v8M16 9a2 2 0 0 1 4 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-4l-2-4a2 2 0 0 1 3-2l1 2"/>',
  display:'<path d="M3 4h18v12H3zM8 20h8M12 16v4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
 };
 const rules=[
  [/\b(delete|remove|erase|forget|sign out|log out|clear)\b/,'trash',true],
  [/\b(restore|relink)\b/,'upload'],
  [/\b(back up|backup)\b/,'download'],
  [/\b(keep|pin|lock)\b/,'pin'],
  [/\b(show|display|visible|view|hide|info|warning)\b/,'eye'],
  [/\breset\b/,'sync',true],
  [/^\+|\b(new|add|create)\b/,'plus'],
  [/\b(import|upload|choose file|open file|load)\b/,'upload'],
  [/\b(export|download|backup|pdf)\b/,'download'],
  [/\bsave\b/,'save'],
  [/\b(duplicate|copy)\b/,'copy'],
  [/\b(find|search|scan|detect|measure|test)\b/,'search'],
  [/\b(edit|rename|change)\b/,'edit'],
  [/\b(stop|pause)\b/,'stop'],
  [/\b(play|start|preview|listen)\b/,'play'],
  [/\b(metronome|click|tempo|bpm|count-in|count in|beat|bars?)\b/,'tempo'],
  [/\b(midi|pedal|looper|clock)\b/,'midi'],
  [/\b(tap|double-tap|swipe|touch|gesture|button)\b/,'hand'],
  [/\b(mic|input|record)\b/,'mic'],
  [/\b(audio|sound|volume|output|track|bus|mixer|device|engine|buffer|cache|eq|compressor|loudness)\b/,'audio'],
  [/\b(font|text size|size|bold)\b/,'text'],
  [/\b(lyrics|chord|chords|song|songs|title|section|region)\b/,'lyrics'],
  [/\b(setlist|set|sets|list|layout|library)\b/,'list'],
  [/\b(sync|refresh|reload|update|apply)\b/,'sync'],
  [/\b(colou?r|theme|skin|style|corners?)\b/,'theme'],
  [/\b(calendar|date|day)\b/,'calendar'],
  [/\b(time|duration|seconds|delay)\b/,'clock'],
  [/\b(band|member|artist|profile|user|name|account)\b/,'user'],
  [/\b(share|send|email|link|sign in|web|network|lan)\b/,'link'],
  [/\b(key|capo|transpose)\b/,'key'],
  [/\b(autoplay|next|continue|loop|repeat|follow)\b/,'repeat'],
  [/\b(missing|error)\b/,'alert'],
  [/\b(screen|fullscreen|external)\b/,'display'],
  [/\b(file|files|document)\b/,'file'],
  [/\b(open|settings|options|more)\b/,'sliders']
 ];
 const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(P[name]||P.dot)+'</svg>';
 const cards='#mixerSetupDialog :is(.mixer-file-actions,.song-files-tools,.audio-file-menu,.mixer-readiness),.settings-section,.settings-tool-section,.doc-card,.band-card,.plan-card,.tool-card,.loudness-card,.controls-card,.backup-card,.click-card,.tempo-simple,.tempo-speed,.transpose-panel,.web-sync,#settingsContent section:not(:has(section)):not(.device-audio-settings):not(.about-app):not(.help-hub),.chord-demo-tools,.settings-card-grid>div:not([class*=section]):not(:has(section)),#songCreator .creator-section-heading,#songCreator .creator-audio,#songCreator .creator-details,#audioDeviceBox';
 const skip='.controls-advanced,#midiDialog,#midiClockDialog,#mixerConsole,#performanceBar,.stem-strip,.dock-tools,.chord-chart,.tempo-stepper,.bk-choice-hidden,.plan-calendar-grid,[role=tablist],nav,#nav,.settings-hub,.setting-title,h3,h4,.color-setting-row,.song-color-custom,#creatorColorPresets,.tag-suggestions,.tool-segments,.setlist-entries,#libraryResults,#setlistAddResults,.device-buffer-card,.device-audio-card,.size-stepper,.bk-keep-buttons,.audio-device-row,#settingsAudioApply,#settingsContent form button,.song-file-actions,.song-file-card,.mixer-import-rule';
 const textOf=el=>[...el.childNodes].filter(n=>n.nodeType===3||n.nodeName==='SPAN'&&!n.classList.contains('bk-icon')).map(n=>n.textContent).join(' ').replace(/\s+/g,' ').trim();
 function pick(text,fallback){const t=text.toLowerCase();for(const [re,name,danger] of rules)if(re.test(t))return [name,!!danger];return [fallback,false]}
 function decorate(row,fallback,action){
  if(row.dataset.bkIcon)return;const text=textOf(row)||row.textContent.replace(/\s+/g,' ').trim();if(!text||!/[a-z]{2}/i.test(text))return;
  // V26.273: buttons that do something right away (Apply, Save …, Sign in, Send …, Refresh) are buttons, not rows with an arrow.
  // V26.273: Song color: No song color and Reset to classic are buttons on the same line as the colour.
  if(/^(clearSongColor|resetColors)$/.test(row.id)){row.dataset.bkIcon='button';row.classList.add('bk-button');return}
  if(action&&/^(apply|save\b.*|sign in|send sign-in email|refresh|use transpose)$/i.test(text)){row.dataset.bkIcon='button';row.classList.add('bk-button');if(/^(apply|sign in|use transpose)$/i.test(text))row.classList.add('bk-button-primary');return}
  // Rows that bring their own icon and arrow (Import, Sync & sharing): use them, add nothing twice.
  const kids=[...row.children];if(kids[0]?.matches('svg')){const own=doc.createElement('span');own.className='bk-icon';kids[0].before(own);own.append(kids[0]);row.dataset.bkIcon='own';row.classList.add('bk-row');if(kids.length>1&&kids.at(-1).matches('svg')){kids.at(-1).classList.add('bk-own-arrow');if(action)row.classList.add('bk-action')}return}
  const [name,danger]=pick(text,fallback);row.dataset.bkIcon=name;
  if(name==='plus')for(const n of row.childNodes)if(n.nodeType===3&&/^\s*\+\s*/.test(n.nodeValue)){n.nodeValue=n.nodeValue.replace(/^\s*\+\s*/,'');break}
  const icon=doc.createElement('span');icon.className='bk-icon';icon.innerHTML=svg(name);row.prepend(icon);
  row.classList.add('bk-row');if(action&&!danger)row.classList.add('bk-action');if(danger&&action)row.classList.add('bk-danger');
 }
 function nameLists(card){
  for(const select of card.querySelectorAll('select:not(.bk-choice)')){
   const holder=select.parentElement;if(!holder||holder.closest(skip)||select.dataset.bkNamed)continue;
   const own=[...holder.childNodes].some(n=>n!==select&&(n.nodeType===3?n.textContent.trim():n.nodeType===1&&!n.matches('select,button,input')&&n.textContent.trim()));
   select.dataset.bkNamed='1';if(own)continue;
   const name=select.id==='setSelect'?'Current set':(select.getAttribute('aria-label')||'').replace(/^choose\s+/i,'').replace(/^./,c=>c.toUpperCase());
   if(!name)continue;const row=doc.createElement('div');row.className='bk-list-row';const label=doc.createElement('span');label.className='bk-list-name';label.textContent=name;
   select.before(row);row.append(label,select);
  }
 }
 let queued=false;
 function run(){queued=false;
  for(const card of doc.querySelectorAll(cards)){
   if(!card.closest('dialog,.benken-menu-surface')||card.closest('#mixerConsole,#performanceBar,.controls-advanced,#midiDialog,#midiClockDialog'))continue;
   nameLists(card);
   for(const b of card.querySelectorAll('button'))if(!b.closest(skip)&&!b.matches('[role=switch],[aria-pressed],.tool-settings-back,[id$=Close]'))decorate(b,'dot',true);
   for(const l of card.querySelectorAll('label:has(>input[type=checkbox])'))if(!l.closest(skip))decorate(l,'switch',false);
   for(const l of card.querySelectorAll('label:has(>select),label:has(>input[type=number]),.bk-list-row'))if(!l.closest(skip))decorate(l,'list',false);
   for(const s of card.querySelectorAll('details>summary'))if(!s.closest(skip))decorate(s,'more',false);
  }
  // Sub-page hubs (Sync & sharing): same rows and icons as the other pages.
  for(const b of doc.querySelectorAll('#settingsContent .settings-guide~.settings-hub .settings-category-rows>button'))decorate(b,'dot',true);
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(run)}};
 new MutationObserver(schedule).observe(doc.body,{subtree:true,childList:true});schedule();
})(window);
