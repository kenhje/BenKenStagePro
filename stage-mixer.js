(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mount(o){
  const $=id=>document.getElementById(id),repo=o.repo||new root.StageAudio.MediaRepository();
  let generation=0,loading=false,importing=false,prepared=null;const absentLegacy=new WeakSet();
  const player=new root.StageAudio.BrowserPlayer({mode:o.state().opts.audioOutputMode,notify:state=>{if(state.error)message(state.error,true);o.transport?.(state);updateTransport()}});
  function message(text,error=false){$('mixerStatus').textContent=text;$('mixerStatus').dataset.error=String(error)}
  function getTracks(){const song=o.song();return song&&!song.playback?.tracks&&absentLegacy.has(song)?[]:root.StageProject.tracks(song)}
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
   for(const id of ['stemAdd','prepareAudio','outputMode','refreshOutputs','projectImport'])$(id).disabled=loading||importing||player.playing;
   $('stemAdd').disabled=loading||importing||player.playing||!o.song();
   $('audioName').textContent=tracks.length?tracks.length+' lydspor':'Ingen lydfil'
  }
  function draw(){
   const song=o.song(),tracks=getTracks(),master=root.StageProject.masterGain(song);
   $('mixerSong').textContent=song?.title||'Velg en låt';$('outputMode').value=player.mode;
   $('mixerOutputs').textContent=player.channels?(player.mode==='stereo'?'Stereoøving: alle spor, også klikk, mikses til 1–2.':'USB-ruting: '+player.channels+' kanaler ved '+Math.round(player.context.sampleRate)+' Hz. Utgangsnumrene er USB DAW-kanaler på Ui24R.'):'Koble til Ui24R og velg LES UTGANGER.';
   $('mixerEmpty').classList.toggle('hidden',!!tracks.length);
   $('masterGain').value=master;$('masterGainText').textContent=master>0?(20*Math.log10(master)).toFixed(1)+' dB':'−∞ dB';$('masterGain').disabled=$('masterReset').disabled=!song;
   $('mixerTracks').innerHTML=tracks.map((t,i)=>{
    const info=player.info.get(t.assetId),count=player.channels||32,limit=Math.max(0,count-(t.stereo?1:0));
    const outputs=Array.from({length:limit},(_,n)=>'<option value="'+(n+1)+'"'+(t.output===n+1?' selected':'')+'>'+(n+1)+(t.stereo?'–'+(n+2):'')+'</option>').join('')+(t.output>limit?'<option value="'+t.output+'" selected>'+t.output+' · mangler</option>':'');
    return '<section class="stem-strip" data-track="'+i+'"><div class="stem-heading"><span class="stem-number">'+String(i+1).padStart(2,'0')+'</span><input data-field="name" value="'+esc(t.name)+'" aria-label="Spornavn"'+(loading||importing?' disabled':'')+'><button data-remove="'+i+'"'+(player.playing||loading||importing?' disabled':'')+' aria-label="Fjern '+esc(t.name)+'">✕</button></div><small class="stem-file">'+(info?'Lokalt · '+info.channels+' filkanal'+(info.channels===1?'':'er')+' · '+Math.round(info.duration)+' s':'Lokal fil må klargjøres')+'</small><div class="level-readout"><span>PEAK</span><output data-peak="'+i+'">−∞ dBFS</output></div><div class="stem-meter" role="meter" aria-label="Nivå '+esc(t.name)+'" aria-valuemin="-60" aria-valuemax="0" aria-valuenow="-60"><div data-meter="'+i+'"></div></div><div class="stem-level"><output data-gain="'+i+'">'+(t.gain>0?(20*Math.log10(t.gain)).toFixed(1)+' dB':'−∞ dB')+'</output><input type="range" data-field="gain" min="0" max="2" step="0.005" value="'+t.gain+'" aria-label="Volum '+esc(t.name)+'"'+(loading||importing?' disabled':'')+'></div><div class="stem-switches"><button data-toggle="mute"'+(loading||importing?' disabled':'')+' aria-pressed="'+t.mute+'" class="'+(t.mute?'mute-on':'')+'">MUTE</button><button data-toggle="solo"'+(loading||importing?' disabled':'')+' aria-pressed="'+t.solo+'" class="'+(t.solo?'solo-on':'')+'">SOLO</button></div><label class="stem-pan">BALANSE <input type="range" data-field="pan" min="-1" max="1" step="0.01" value="'+t.pan+'"'+(!t.stereo||loading||importing?' disabled':'')+' aria-label="Balanse '+esc(t.name)+'"></label><div class="stem-routing"><label>FORMAT<select data-field="stereo"'+(player.playing||loading||importing?' disabled':'')+'><option value="true"'+(t.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!t.stereo?' selected':'')+'>Mono</option></select></label><label>USB UT<select data-field="output"'+(player.playing||loading||importing||player.mode==='stereo'?' disabled':'')+'>'+outputs+'</select></label></div></section>'
   }).join('');updateTransport()
  }
  async function load(autoIds=new Set()){
   const mine=++generation,song=o.song();let tracks=getTracks();loading=true;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;draw();
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
     const click=/(?:click|klikk|clix|metronom)/i.test(file.name),track=root.StageProject.track({assetId,name:file.name.replace(/\.[^.]+$/,''),stereo:!click,output:click?3:1});
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
    const next=single?{...o.state(),songs:[...o.state().songs,restored.songs[0]],set:'',idx:o.state().songs.length}:restored;
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
  $('mixerTracks').addEventListener('change',e=>{const input=e.target.closest('select[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(player.playing||loading||importing){draw();return}try{const tracks=getTracks(),track=tracks[Number(strip.dataset.track)];track[input.dataset.field]=input.dataset.field==='stereo'?input.value==='true':Number(input.value);commit(tracks);const error=player.routeError();message(error||'Ruting lagret.',!!error);draw()}catch(error){message(error.message,true)}});
  $('mixerTracks').addEventListener('click',e=>{const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks(),i=Number(strip.dataset.track),toggle=e.target.closest('[data-toggle]'),remove=e.target.closest('[data-remove]');if(toggle){tracks[i][toggle.dataset.toggle]=!tracks[i][toggle.dataset.toggle];commit(tracks);draw()}if(remove&&!player.playing&&!loading&&!importing&&root.confirm('Fjerne sporet fra låten? Lydfilen beholdes lokalt.')){tracks.splice(i,1);commit(tracks);load()}}catch(error){message(error.message,true)}});
  $('projectScope').addEventListener('change',()=>{invalidateProject();message('Velg LAG PROSJEKTFIL for det valgte innholdet.')});$('projectBackup').onclick=exportProject;$('projectDownload').onclick=()=>{if(prepared)download(prepared)};
  $('projectShare').onclick=()=>{if(prepared)root.navigator.share({files:[prepared],title:'BenKen-prosjekt med lyd'}).catch(error=>{if(error.name!=='AbortError')message(error.message,true)})};
  $('projectImport').onclick=()=>$('projectFile').click();$('projectFile').onchange=e=>{const file=e.target.files?.[0];e.target.value='';if(file)return importProject(file)};
  function meter(bar,out,peak){const info=root.StageAudio.level(peak||0);bar.style.width=info.percent+'%';bar.parentNode.setAttribute('aria-valuenow',String(Number.isFinite(info.db)?Math.max(-60,Math.min(0,info.db)):-60));bar.parentNode.dataset.zone=info.clip?'clip':info.db>=-6?'high':'normal';out.textContent=info.label+' dBFS'+(info.clip?' · CLIP':'')}
  setInterval(()=>{player.tick();o.time?.(player.currentTime,player.duration);if($('mixerDialog').open||$('mixerDialog').hasAttribute('open')){const levels=player.meters();$('mixerTracks').querySelectorAll('[data-meter]').forEach((bar,i)=>meter(bar,$('mixerTracks').querySelector('[data-peak="'+i+'"]'),levels[i]||0));meter($('masterMeter'),$('masterPeakText'),player.meterMaster());$('mixerPosition').textContent=Math.floor(player.currentTime)+' / '+Math.ceil(player.duration)+' s'}},100);
  return {player,repo,load,cancel,draw,addFiles,exportProject,importProject,playPause}
 }
 root.StageMixer={mount};
})(typeof window!=='undefined'?window:globalThis);
