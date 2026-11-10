/* Common settings navigation and home profile. Keeps audio routing untouched. */
(function(root){
 'use strict';const app=root.BenKenApp,$=id=>document.getElementById(id);if(!app)return;
 const icon=()=>root.BenKenMenuIcon('back');
 // Keep set time with the setlist instead of the retired top toolbar.
 const menus=['settingsContent','performanceSettings','mixerSetupDialog','tempoPanel','clickSettings','shareDialog','songLoudnessDialog','midiDialog','midiClockDialog','concertDialog','fullBackupDialog','songKeyDialog','tunerDialog','notesDialog','songCreator','lyricsEditor','sectionTimingDialog','setlistAddDialog'];for(const id of menus)$(id)?.classList.add('benken-menu-surface');document.querySelectorAll('dialog').forEach(d=>d.classList.add('benken-menu-surface'));const clock=$('timeBox');clock.classList.add('setlist-time-card');$('setTitle').after(clock);
 clock.querySelector('.progress').setAttribute('role','progressbar');clock.querySelector('.progress').setAttribute('aria-label','Setlist progress');
 const progress=()=>{const node=clock.querySelector('.progress');node.setAttribute('aria-valuemin','0');node.setAttribute('aria-valuemax','100');node.setAttribute('aria-valuenow',String(Math.round(parseFloat($('progressFill').style.width)||0)))};
 new MutationObserver(progress).observe($('progressFill'),{attributes:true,attributeFilter:['style']});progress();
 const profile=document.createElement('div');profile.id='homeBandProfile';profile.hidden=true;document.querySelector('header .brand').prepend(profile);
 function updateProfile(){const db=app.state(),p=db.opts.bandProfile||{},name=String(p.name||p.displayName||'').trim(),logo=typeof p.logo==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.logo)&&p.logo.length<3000000?p.logo:'';profile.replaceChildren();clock.hidden=!db.songs.length;profile.hidden=db.opts.showBandOnHome!==true||(!name&&!logo);if(profile.hidden)return;if(logo){const img=document.createElement('img');img.src=logo;img.alt='Band / artist logo';profile.append(img)}if(name){const strong=document.createElement('strong');strong.textContent=name;profile.append(strong)}}
 root.BenKenRefinements={profile:updateProfile};updateProfile();
 function backToSettings(dialog){const busy=dialog.querySelector('[aria-busy="true"]');if(busy)return;const done=dialog.querySelector('[id$="Close"],[id$="close"],#closeMixer');done?.click();if(dialog.open)return;app.openSettings()}
 const definitions=[['shareDialog','.tool-heading'],['songLoudnessDialog','.loudness-header'],['mixerDialog','.mixer-heading'],['midiDialog','.midi-heading']];
 for(const id of ['midiClose','shareClose','closeMixer','songLoudnessClose'])if($(id))$(id).textContent='Done';for(const [id,selector]of definitions){const dialog=$(id);if(!dialog)continue;const header=dialog.querySelector(selector)||dialog.querySelector('h2')?.parentElement;if(!header)continue;header.classList.add('unified-tool-heading');const button=document.createElement('button');button.type='button';button.className='tool-settings-back';button.innerHTML=icon()+'<span>Settings</span>';button.setAttribute('aria-label','Back to Settings');button.onclick=()=>backToSettings(dialog);header.prepend(button)}
 // Top-level dialog back buttons must respect ongoing uploads / loudness jobs.
 for(const id of ['shareDialog','songLoudnessDialog']){const dialog=$(id);if(!dialog)continue;const close=dialog.querySelector('[id$="Close"]'),back=dialog.querySelector('.tool-settings-back');if(close&&back){const sync=()=>back.disabled=close.disabled;new MutationObserver(sync).observe(close,{attributes:true,attributeFilter:['disabled']});sync()}}

 // Size the fader against the actual workspace left above docked Controls.
 const mixerDialog=$('mixerDialog'),workspace=$('mixerWorkspace');let layoutFrame=0;
 function fitMixer(){layoutFrame=0;if(!mixerDialog.open||mixerDialog.classList.contains('mixer-config-open'))return;
  const strip=$('mixerTracks')?.querySelector('.stem-strip'),console=$('mixerConsole'),bank=strip?.querySelector('.fader-bank');
  if(!bank||!console||!strip.getBoundingClientRect().height||!console.getBoundingClientRect().height)return;
  const room=workspace.getBoundingClientRect().bottom-console.getBoundingClientRect().top;
  const overhead=strip.getBoundingClientRect().height-bank.getBoundingClientRect().height+26;
  const height=Math.max(96,Math.min(300,Math.floor(room-overhead)));
  if(mixerDialog.style.getPropertyValue('--fader-height')!==height+'px')mixerDialog.style.setProperty('--fader-height',height+'px');
 }
 function scheduleMixerFit(){if(!layoutFrame)layoutFrame=requestAnimationFrame(fitMixer)}
 const mixerSize=new ResizeObserver(scheduleMixerFit);for(const el of [workspace,$('mixerControlsDock'),mixerDialog])if(el)mixerSize.observe(el);
 new MutationObserver(scheduleMixerFit).observe(mixerDialog,{attributes:true,attributeFilter:['open','class']});
 new MutationObserver(scheduleMixerFit).observe($('mixerTracks'),{childList:true});
 window.addEventListener('resize',scheduleMixerFit);

 const overview=$('songSectionBar');if(overview)new ResizeObserver(()=>document.documentElement.style.setProperty('--arrangement-height',Math.ceil(overview.getBoundingClientRect().height)+6+'px')).observe(overview);
})(window);
