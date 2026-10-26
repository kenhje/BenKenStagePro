(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mount(o){
  const $=id=>document.getElementById(id),repo=o.repo||new root.StageAudio.MediaRepository();
  let generation=0,loading=false,importing=false,prepared=null,view='tracks',showAllBuses=false,heldPeak=0;const absentLegacy=new WeakSet();
  const player=new root.StageAudio.BrowserPlayer({mode:o.state().opts.audioOutputMode,notify:state=>{if(state.error)message(state.error,true);o.transport?.(state);updateTransport()}});
  function message(text,error=false){$('mixerStatus').textContent=text;$('mixerStatus').dataset.error=String(error)}
  function getTracks(){const song=o.song();return song&&!song.playback?.tracks&&absentLegacy.has(song)?[]:root.StageProject.tracks(song)}
  function getBuses(){return root.StageProject.buses(o.state())}
  function commitBuses(buses){const previous=o.state().opts.audioBuses;o.state().opts.audioBuses=buses.map(root.StageProject.bus);if(o.save()===false){o.state().opts.audioBuses=previous;throw Error('Utgangsbussene kunne ikke lagres.')}invalidateProject();player.setBuses(getBuses())}
  const gainText=gain=>gain>0?(20*Math.log10(gain)).toFixed(1)+' dB':'−∞ dB';
  function outputOptions(route){const limit=Math.max(0,(player.channels||32)-(route.stereo?1:0));return Array.from({length:limit},(_,n)=>'<option value="'+(n+1)+'"'+(route.output===n+1?' selected':'')+'>'+(n+1)+(route.stereo?'–'+(n+2):'')+'</option>').join('')+(route.output>limit?'<option value="'+route.output+'" selected>'+route.output+' · mangler</option>':'')}
  function drawBuses(){const used=new Set(getTracks().map(t=>t.bus).filter(Boolean)),busy=loading||importing,locked=busy||player.playing;$('mixerBuses').innerHTML=getBuses().filter(b=>showAllBuses||used.has(b.id)||(!used.size&&b.id<=2)).map(b=>'<section class="stem-strip bus-strip" data-bus="'+b.id+'"><div class="stem-heading"><span class="stem-number">B'+b.id+'</span><input data-bus-field="name" value="'+esc(b.name)+'" maxlength="24" aria-label="Bussnavn"'+(busy?' disabled':'')+'></div><small class="stem-file">'+(used.has(b.id)?'I bruk i denne låten':'Ikke i bruk i denne låten')+'</small><div class="level-readout"><span>PEAK</span><output data-bus-peak="'+b.id+'">−∞ dBFS</output></div><div class="stem-meter" role="meter" aria-label="Nivå buss '+b.id+'" aria-valuemin="-60" aria-valuemax="0" aria-valuenow="-60"><div data-bus-meter="'+b.id+'"></div></div><div class="stem-level"><output data-bus-gain="'+b.id+'">'+gainText(b.gain)+'</output><input type="range" data-bus-field="gain" min="0" max="2" step="0.005" value="'+b.gain+'" aria-label="Bussvolum '+esc(b.name)+'"'+(busy?' disabled':'')+'></div><div class="stem-switches"><button data-bus-mute aria-pressed="'+b.mute+'" class="'+(b.mute?'mute-on':'')+'"'+(busy?' disabled':'')+'>MUTE</button><button data-bus-reset'+(busy?' disabled':'')+'>0 dB</button></div><div class="stem-routing"><label>FORMAT<select data-bus-field="stereo"'+(locked?' disabled':'')+'><option value="true"'+(b.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!b.stereo?' selected':'')+'>Mono</option></select></label><label>USB UT<select data-bus-field="output"'+(locked||player.mode==='stereo'?' disabled':'')+'>'+outputOptions(b)+'</select></label></div></section>').join('')}
  function invalidateProject(){prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true}
  function commit(tracks,song=o.song()){
   if(!song)return;const previous=song.playback;song.playback={...previous,tracks:tracks.map(root.StageProject.track)};
   if(o.save()===false){song.playback=previous;throw Error('Mikserinnstillingene kunne ikke lagres. Ingen lydspor er erstattet.')}
   invalidateProject();if(song===o.song())player.update(song.playback.tracks)
  }
  function updateTransport(){
   const tracks=getTracks(),ready=!loading&&!importing&&player.buffers.length===tracks.length&&tracks.length>0&&!player.routeError();
   $('audioPlay').disabled=$('mixerPlay').disabled=!ready;$('audioStop').disabled=$('mixerStop').disabled=!tracks.length;
   $('mixerPlay').textContent=player.playing?'PAUSE':'SPILL';$('mixerPlay').setAttribute('aria-pressed',String(player.playing));
   for(const id of ['stemAdd','prepareAudio','outputMode','refreshOutputs','projectImport','projectDemo'])$(id).disabled=loading||importing||player.playing;
   $('stemAdd').disabled=loading||importing||player.playing||!o.song();
   $('audioName').textContent=tracks.length?tracks.length+' lydspor':'Ingen lydfil'
  }
  function draw(){
   const song=o.song(),tracks=getTracks(),master=root.StageProject.masterGain(song),buses=getBuses();player.setBuses(buses);
   $('mixerTracks').classList.toggle('hidden',view!=='tracks');$('mixerBuses').classList.toggle('hidden',view!=='buses');$('busViewOptions').classList.toggle('hidden',view!=='buses');$('mixerTrackTab').setAttribute('aria-pressed',String(view==='tracks'));$('mixerBusTab').setAttribute('aria-pressed',String(view==='buses'));$('busShowAll').checked=showAllBuses;
   $('mixerSong').textContent=song?.title||'Velg en låt';$('outputMode').value=player.mode;
   $('mixerOutputs').textContent=player.channels?(player.mode==='stereo'?'Stereoøving: alle spor, også klikk, mikses til 1–2.':'USB-ruting: '+player.channels+' kanaler ved '+Math.round(player.context.sampleRate)+' Hz. Utgangsnumrene er USB DAW-kanaler på Ui24R.'):'Koble til Ui24R og velg LES UTGANGER.';
   $('mixerEmpty').classList.toggle('hidden',!!tracks.length||view!=='tracks');
   $('masterGain').value=master;$('masterGainText').textContent=master>0?(20*Math.log10(master)).toFixed(1)+' dB':'−∞ dB';$('masterGain').disabled=$('masterReset').disabled=!song;
   $('mixerTracks').innerHTML=tracks.map((t,i)=>{
    const info=player.info.get(t.assetId),count=player.channels||32,limit=Math.max(0,count-(t.stereo?1:0));
    const outputs=Array.from({length:limit},(_,n)=>'<option value="'+(n+1)+'"'+(t.output===n+1?' selected':'')+'>'+(n+1)+(t.stereo?'–'+(n+2):'')+'</option>').join('')+(t.output>limit?'<option value="'+t.output+'" selected>'+t.output+' · mangler</option>':'');
    return '<section class="stem-strip" data-track="'+i+'"><div class="stem-heading"><span class="stem-number">'+String(i+1).padStart(2,'0')+'</span><input data-field="name" value="'+esc(t.name)+'" aria-label="Spornavn"'+(loading||importing?' disabled':'')+'><button data-remove="'+i+'"'+(player.playing||loading||importing?' disabled':'')+' aria-label="Fjern '+esc(t.name)+'">✕</button></div><small class="stem-file">'+(info?'Lokalt · '+info.channels+' filkanal'+(info.channels===1?'':'er')+' · '+Math.round(info.duration)+' s':'Lokal fil må klargjøres')+'</small><div class="level-readout"><span>PEAK</span><output data-peak="'+i+'">−∞ dBFS</output></div><div class="stem-meter" role="meter" aria-label="Nivå '+esc(t.name)+'" aria-valuemin="-60" aria-valuemax="0" aria-valuenow="-60"><div data-meter="'+i+'"></div></div><div class="stem-level"><output data-gain="'+i+'">'+(t.gain>0?(20*Math.log10(t.gain)).toFixed(1)+' dB':'−∞ dB')+'</output><input type="range" data-field="gain" min="0" max="2" step="0.005" value="'+t.gain+'" aria-label="Volum '+esc(t.name)+'"'+(loading||importing?' disabled':'')+'></div><div class="stem-switches"><button data-toggle="mute"'+(loading||importing?' disabled':'')+' aria-pressed="'+t.mute+'" class="'+(t.mute?'mute-on':'')+'">MUTE</button><button data-toggle="solo"'+(loading||importing?' disabled':'')+' aria-pressed="'+t.solo+'" class="'+(t.solo?'solo-on':'')+'">SOLO</button></div><label class="stem-pan">BALANSE <input type="range" data-field="pan" min="-1" max="1" step="0.01" value="'+t.pan+'"'+(!t.stereo||loading||importing?' disabled':'')+' aria-label="Balanse '+esc(t.name)+'"></label><div class="stem-routing"><label>FORMAT<select data-field="stereo"'+(player.playing||loading||importing?' disabled':'')+'><option value="true"'+(t.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!t.stereo?' selected':'')+'>Mono</option></select></label><label>USB UT<select data-field="output"'+(player.playing||loading||importing||player.mode==='stereo'?' disabled':'')+'>'+outputs+'</select></label></div></section>'
   }).join('');
   $('mixerTracks').querySelectorAll('[data-track]').forEach(strip=>{const t=tracks[Number(strip.dataset.track)],route=strip.querySelector('[data-field="output"]'),stereo=strip.querySelector('[data-field="stereo"]');route.parentNode.classList.toggle('hidden',!!t.bus);stereo.parentNode.classList.toggle('hidden',!!t.bus);const pan=strip.querySelector('[data-field="pan"]');pan.disabled=loading||importing||(!t.stereo&&!t.bus);strip.insertAdjacentHTML('beforeend','<label class="stem-bus-choice">UTGANGSBUSS<select data-field="bus"'+(player.playing||loading||importing?' disabled':'')+'><option value="0"'+(!t.bus?' selected':'')+'>Direkte USB '+t.output+(t.stereo?'–'+(t.output+1):'')+'</option>'+buses.map(b=>'<option value="'+b.id+'"'+(t.bus===b.id?' selected':'')+'>'+b.id+' · '+esc(b.name)+' → '+b.output+(b.stereo?'–'+(b.output+1):'')+'</option>').join('')+'</select></label>')});drawBuses();updateTransport()
  }
  async function load(autoIds=new Set()){
   const mine=++generation,song=o.song();let tracks=getTracks();loading=true;heldPeak=0;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;draw();
   player.setMaster(root.StageProject.masterGain(song));message(tracks.length?'Klargjør lokale lydfiler…':'Legg til backing, klikk eller andre stems.');
   try{
    if(song&&!song.playback?.tracks&&song.audioId){const legacy=await repo.get(song.audioId);if(mine!==generation||song!==o.song())return false;if(legacy?.data)absentLegacy.delete(song);else absentLegacy.add(song);tracks=getTracks()}
    const ready=await player.load(tracks,repo);if(mine!==generation||song!==o.song()||!ready)return false;
    for(let i=0;i<tracks.length;i++)if(autoIds.has(tracks[i].id)&&player.buffers[i]?.numberOfChannels===1)tracks[i].stereo=false;
    if(autoIds.size)commit(tracks,song);
    loading=false;if(tracks.length){o.ready?.(song);o.duration?.(player.duration)}
    const error=player.routeError();message(error||('Lokalt klar · '+tracks.length+' spor'+(player.decodedBytes?' · '+Math.ceil(player.decodedBytes/1048576)+' MB lyd i minnet':'')),!!error);draw();return true
   }catch(error){if(mine===generation){loading=false;message(error.message,true);draw()}return false}
  }
  function cancel(){generation++;player.cancel();loading=false;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;updateTransport()}
  async function addFiles(files){
   const list=[...files||[]],song=o.song(),mine=generation;if(!list.length)return;
   if(!song||player.playing||importing)return message('Velg en låt og stopp avspillingen før import.',true);
   let tracks=getTracks();const created=[],autoIds=new Set();let committed=false;
   importing=true;draw();message('Kopierer lydfilene til enheten…');
   try{
    if(!song.playback?.tracks&&song.audioId){const legacy=await repo.get(song.audioId);if(!legacy?.data)tracks=[]}
    if(tracks.length+list.length>32)throw Error('Maksimalt 32 spor per låt.');
    if(list.some(f=>!/^.*\.(wav|mp3|m4a|aif|aiff|caf)$/i.test(f.name)))throw Error('Velg WAV, MP3, M4A, AIFF eller CAF.');
    for(const file of list){
     const data=await file.arrayBuffer();if(!data.byteLength)throw Error('«'+file.name+'» er tom.');
     if(song!==o.song()||mine!==generation)throw Error('Låtvalget ble endret. Importen er avbrutt.');
     const assetId=root.StageProject.id();await repo.put(assetId,{data,name:file.name,type:file.type||'application/octet-stream'});created.push(assetId);
     if(song!==o.song()||mine!==generation)throw Error('Låtvalget ble endret. Importen er avbrutt.');
     const click=/(?:click|klikk|clix|metronom)/i.test(file.name),track=root.StageProject.track({assetId,name:file.name.replace(/\.[^.]+$/,''),stereo:!click,output:click?3:1,bus:click?2:1});
     tracks.push(track);if(!click)autoIds.add(track.id)
    }
    commit(tracks,song);committed=true;importing=false;await load(autoIds)
   }catch(error){
    if(!committed)for(const key of created)await repo.remove(key).catch(()=>{});
    importing=false;message(error.name==='QuotaExceededError'?'Enheten har ikke plass til lydfilene. Frigjør plass og importer på nytt.':error.message,true);draw()
   }
  }
  async function playPause(){
   if(loading||importing)return;
   try{if(player.playing)player.pause();else{o.beforePlay?.();await player.play()}draw()}catch(error){message(error.message,true);draw()}
  }
  function changeMaster(value){const song=o.song();if(!song)return;const gain=Number(value);if(!Number.isFinite(gain))return;const previous=song.playback;song.playback={...previous,tracks:getTracks(),masterGain:Math.max(0,Math.min(2,gain))};if(o.save()===false){song.playback=previous;return message('Masterverdien kunne ikke lagres.',true)}invalidateProject();player.setMaster(song.playback.masterGain);$('masterGain').value=song.playback.masterGain;$('masterGainText').textContent=song.playback.masterGain>0?(20*Math.log10(song.playback.masterGain)).toFixed(1)+' dB':'−∞ dB'}
  function download(file){const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=file.name||'BenKen.benken';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
  async function exportProject(){
   if(loading||importing||player.playing)return message('Stopp avspillingen før du lager prosjektfil.',true);
   const scope=$('projectScope').value==='all'?'library':'song',state=structuredClone(o.state()),song=o.song();if(scope==='song'&&!song)return;
   delete state.opts.audioOutputMode;if(scope==='song'){state.songs=[structuredClone(song)];state.sets={};state.set='';state.idx=0}
   player.cancel();updateTransport();$('projectBackup').disabled=true;message('Lager prosjektfil med lokale lydfiler…');
   try{for(const item of state.songs)if(!item.playback?.tracks&&item.audioId){const legacy=await repo.get(item.audioId);if(!legacy?.data)item.playback={...item.playback,tracks:[]}}const blob=await root.StageProject.pack(state,repo,()=>{},{scope});const title=scope==='song'?song.title:'Bibliotek';prepared=new File([blob],'BenKen_'+title.replace(/[<>:"/\\|?*]/g,'_')+'.benken',{type:'application/x-benken-project'});$('projectDownload').disabled=false;$('projectShare').disabled=!(root.navigator.share&&root.navigator.canShare?.({files:[prepared]}));message('Prosjektfil klar. Velg DEL / LAGRE I FILER eller LAST NED.')}catch(error){message(error.message,true)}finally{$('projectBackup').disabled=false}
  }
  async function importProject(file){
   if(player.playing||loading||importing)return message('Stopp og vent til lydklargjøringen er ferdig før prosjektimport.',true);
   let restored=null;
   try{
    const manifest=await root.StageProject.inspect(file),single=manifest.scope==='song';
    if(single&&manifest.state.songs.length!==1)throw Error('Låtfilen må inneholde nøyaktig én låt.');
    if(!single&&o.state().songs.length&&!root.confirm('Erstatte biblioteket og setlistene med dette prosjektet? Dagens tekstbackup lastes ned først.'))return;
    if(!single&&o.state().songs.length)o.backup?.();
    importing=true;draw();message('Importerer prosjektet og kopierer lydfiler lokalt…');
    restored=await root.StageProject.unpack(file,repo);
    const next=single?root.StageProject.mergeSong(o.state(),restored):restored;
    o.importState(next);importing=false;const ready=await load();if(ready&&!player.routeError())message(single?'Låten er lagt til med lokale lydfiler.':'Bibliotek, setlister og lydfiler er importert.')
   }catch(error){if(restored)for(const key of root.StageProject.assets(restored))await repo.remove(key).catch(()=>{});importing=false;message(error.message,true);draw()}
  }
  $('mixerBtn').onclick=()=>{try{if(!player.playing){player.configure();const error=player.routeError();if(error)message(error,true)}}catch(error){message(error.message,true)}draw();$('mixerDialog').showModal()};
  $('closeMixer').onclick=()=>$('mixerDialog').close();
  $('mixerPlay').onclick=$('audioPlay').onclick=playPause;$('mixerStop').onclick=$('audioStop').onclick=()=>{player.stop();draw()};
  $('stemAdd').onclick=()=>$('stemFiles').click();$('stemFiles').onchange=e=>{const files=[...e.target.files];e.target.value='';return addFiles(files)};
  $('audioChoose').onclick=()=>$('mixerBtn').click();$('audioFile').onchange=e=>{const files=[...e.target.files];e.target.value='';return addFiles(files)};
  $('prepareAudio').onclick=()=>load();$('refreshOutputs').onclick=()=>{try{player.configure();const error=player.routeError();message(error||'Utganger lest. Kontroller USB-rutingen.',!!error);draw()}catch(error){message(error.message,true)}};
  $('outputMode').onchange=e=>{if(player.playing)return;try{player.setMode(e.target.value);o.state().opts.audioOutputMode=player.mode;o.save();const error=player.routeError();message(error||(player.mode==='stereo'?'Stereoøving: også klikk går til 1–2.':'USB-ruting valgt.'),!!error);draw()}catch(error){message(error.message,true)}};
  $('masterGain').addEventListener('input',e=>changeMaster(e.target.value));$('masterReset').onclick=()=>changeMaster(1);
  $('mixerTracks').addEventListener('input',e=>{const input=e.target.closest('input[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(loading||importing){draw();return}try{const tracks=getTracks(),i=Number(strip.dataset.track),field=input.dataset.field;tracks[i][field]=field==='name'?input.value:Number(input.value);commit(tracks);if(field==='gain')$('mixerTracks').querySelector('[data-gain="'+i+'"]').textContent=tracks[i].gain>0?(20*Math.log10(tracks[i].gain)).toFixed(1)+' dB':'−∞ dB'}catch(error){message(error.message,true)}});
  $('mixerTracks').addEventListener('change',e=>{const input=e.target.closest('select[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(player.playing||loading||importing){draw();return}try{const tracks=getTracks(),track=tracks[Number(strip.dataset.track)];if(input.dataset.field==='bus'&&Number(input.value)===0)delete track.bus;else track[input.dataset.field]=input.dataset.field==='stereo'?input.value==='true':Number(input.value);commit(tracks);const error=player.routeError();message(error||'Ruting lagret.',!!error);draw()}catch(error){message(error.message,true);draw()}});
  $('mixerTracks').addEventListener('click',e=>{const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks(),i=Number(strip.dataset.track),toggle=e.target.closest('[data-toggle]'),remove=e.target.closest('[data-remove]');if(toggle){tracks[i][toggle.dataset.toggle]=!tracks[i][toggle.dataset.toggle];commit(tracks);draw()}if(remove&&!player.playing&&!loading&&!importing&&root.confirm('Fjerne sporet fra låten? Lydfilen beholdes lokalt.')){tracks.splice(i,1);commit(tracks);load()}}catch(error){message(error.message,true)}});
  $('projectScope').addEventListener('change',()=>{invalidateProject();message('Velg LAG PROSJEKTFIL for det valgte innholdet.')});$('projectBackup').onclick=exportProject;$('projectDownload').onclick=()=>{if(prepared)download(prepared)};
  $('projectShare').onclick=()=>{if(prepared)root.navigator.share({files:[prepared],title:'BenKen-prosjekt med lyd'}).catch(error=>{if(error.name!=='AbortError')message(error.message,true)})};
  $('projectImport').onclick=()=>$('projectFile').click();$('projectFile').onchange=e=>{const file=e.target.files?.[0];e.target.value='';if(file)return importProject(file)};
  $('mixerTrackTab').onclick=()=>{view='tracks';draw()};$('mixerBusTab').onclick=()=>{view='buses';draw()};$('busShowAll').onchange=e=>{showAllBuses=e.target.checked;drawBuses()};
  function busInput(e){const input=e.target.closest('[data-bus-field]'),strip=e.target.closest('[data-bus]');if(!input||!strip)return;const field=input.dataset.busField;if((e.type==='change'&&input.tagName==='INPUT')||(e.type==='input'&&input.tagName==='SELECT'))return;if(loading||importing||(player.playing&&['stereo','output'].includes(field))){draw();return}try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];b[field]=field==='name'?input.value:field==='stereo'?input.value==='true':Number(input.value);commitBuses(buses);if(field==='gain')strip.querySelector('[data-bus-gain]').textContent=gainText(b.gain);if(field==='stereo'||field==='output'){const error=player.routeError();message(error||'Bussruting lagret for alle låter.',!!error);draw()}else updateTransport()}catch(error){message(error.message,true);draw()}}
  $('mixerBuses').addEventListener('input',busInput);$('mixerBuses').addEventListener('change',busInput);
  $('mixerBuses').addEventListener('click',e=>{const strip=e.target.closest('[data-bus]');if(!strip||loading||importing)return;const mute=e.target.closest('[data-bus-mute]'),reset=e.target.closest('[data-bus-reset]');if(!mute&&!reset)return;try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];if(mute)b.mute=!b.mute;else b.gain=1;commitBuses(buses);draw()}catch(error){message(error.message,true)}});
  $('resetMasterPeak').onclick=()=>{heldPeak=0;$('masterPeakHoldText').textContent='−∞ dBFS'};
  $('projectDemo').onclick=async()=>{if(loading||importing||player.playing)return;$('projectDemo').disabled=true;message('Henter testlåten…');try{const response=await root.fetch('./demo/BenKen_Ui24R_Busstest.benken');if(!response.ok)throw Error('Testlåten mangler. Last opp demo-mappen fra V26.6 til GitHub.');await importProject(await response.blob())}catch(error){message(error.message,true)}finally{updateTransport()}};
  function meter(bar,out,peak){const info=root.StageAudio.level(peak||0);bar.style.width=info.percent+'%';bar.parentNode.setAttribute('aria-valuenow',String(Number.isFinite(info.db)?Math.max(-60,Math.min(0,info.db)):-60));bar.parentNode.dataset.zone=info.clip?'clip':info.db>=-6?'high':'normal';out.textContent=info.label+' dBFS'+(info.clip?' · CLIP':'')}
  setInterval(()=>{player.tick();o.time?.(player.currentTime,player.duration);const peak=player.meterMaster();heldPeak=Math.max(heldPeak,peak);if($('mixerDialog').open||$('mixerDialog').hasAttribute('open')){const levels=player.meters();$('mixerTracks').querySelectorAll('[data-meter]').forEach((bar,i)=>meter(bar,$('mixerTracks').querySelector('[data-peak="'+i+'"]'),levels[i]||0));const busLevels=player.meterBuses();$('mixerBuses').querySelectorAll('[data-bus-meter]').forEach(bar=>meter(bar,$('mixerBuses').querySelector('[data-bus-peak="'+bar.dataset.busMeter+'"]'),busLevels.get(Number(bar.dataset.busMeter))||0));meter($('masterMeter'),$('masterPeakText'),peak);$('masterPeakHoldText').textContent=root.StageAudio.level(heldPeak).label+' dBFS';$('mixerPosition').textContent=Math.floor(player.currentTime)+' / '+Math.ceil(player.duration)+' s'}},100);
  return {player,repo,load,cancel,draw,addFiles,exportProject,importProject,playPause}
 }
 root.StageMixer={mount};
})(typeof window!=='undefined'?window:globalThis);
