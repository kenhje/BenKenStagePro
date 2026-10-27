(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const colors=['#6fbbac','#d5b56c','#849fc9','#c194ac','#97b575','#b69bd3','#cf9677','#79b8c8'];
 const taper=[[0,-60],[250,-30],[500,-12],[750,0],[1000,20*Math.log10(2)]];
 function faderToGain(value){const x=Math.max(0,Math.min(1000,Number(value)||0));if(x===0)return 0;for(let i=1;i<taper.length;i++){const [a,dbA]=taper[i-1],[b,dbB]=taper[i];if(x<=b)return 10**((dbA+(dbB-dbA)*(x-a)/(b-a))/20)}return 2}
 function gainToFader(value){if(!(value>0))return 0;const db=Math.max(-60,Math.min(taper[4][1],20*Math.log10(value)));for(let i=1;i<taper.length;i++){const [a,dbA]=taper[i-1],[b,dbB]=taper[i];if(db<=dbB)return Math.round(a+(b-a)*(db-dbA)/(dbB-dbA))}return 1000}
 function faderMarkup({gain,field,meter,label,disabled=false}){
  const scale=[6,0,-6,-12,-24,-36,-48].map(db=>'<span class="fader-tick '+(db===0?'unity-tick':'')+'" style="bottom:'+gainToFader(10**(db/20))/10+'%">'+(db>0?'+':'')+db+'</span>').join('');
  return '<div class="fader-bank"><div class="fader-scale" aria-hidden="true">'+scale+'<span class="fader-tick" style="bottom:0%">−∞</span></div><div class="fader-axis"><div class="fader-range"><input class="mixer-fader" type="range" '+field+' min="0" max="1000" step="1" value="'+gainToFader(gain)+'" aria-label="'+esc(label)+'" aria-orientation="vertical" aria-valuetext="'+(gain>0?(20*Math.log10(gain)).toFixed(1):'−∞')+' dB"'+(disabled?' disabled':'')+'></div><div class="unity-mark" aria-hidden="true"></div></div><div class="stem-meter vertical-meter" role="meter" aria-label="Signal '+esc(label)+'" aria-valuemin="-60" aria-valuemax="0" aria-valuenow="-60"><div '+meter+'></div></div></div>'
 }
 function mount(o){
  const $=id=>document.getElementById(id),repo=o.repo||new root.StageAudio.MediaRepository(),listeners=new Set();
  $('masterFaderMount').innerHTML=faderMarkup({gain:1,field:'id="masterGain"',meter:'id="masterMeter"',label:'Mastervolum alle spor'});
  let generation=0,loading=false,importing=false,prepared=null,view='tracks',showAllBuses=false,heldPeak=0;const absentLegacy=new WeakSet();
  const player=new root.StageAudio.BrowserPlayer({mode:o.state().opts.audioOutputMode,notify:state=>{if(state.error)message(state.error,true);o.transport?.(state);updateTransport()}});
  function message(text,error=false){$('mixerStatus').textContent=text;$('mixerStatus').dataset.error=String(error)}
  function getTracks(){const song=o.song();return song&&!song.playback?.tracks&&absentLegacy.has(song)?[]:root.StageProject.tracks(song)}
  function getBuses(){return root.StageProject.buses(o.state())}
  function groupState(){return {names:root.StageProject.groupNames(o.state()),active:Array.from({length:6},(_,i)=>!!player.muteGroups?.has(i+1))}}
  function groupAssignment(t,index,open){const names=groupState().names;return '<details class="track-groups" data-owner="'+index+'"'+(open?' open':'')+'><summary>GRUPPER '+(t.muteGroups?.length?t.muteGroups.join(' · '):'—')+'</summary><div class="group-assignment">'+names.map((name,i)=>'<button type="button" data-track-group="'+(i+1)+'" aria-pressed="'+(t.muteGroups||[]).includes(i+1)+'"><b>'+(i+1)+'</b><span>'+esc(name)+'</span></button>').join('')+'</div></details>'}
  function drawGroups(){const state=groupState();$('mixerGroups').innerHTML='<span>MUTEGRUPPER</span>'+state.names.map((name,i)=>'<button type="button" data-global-group="'+(i+1)+'" aria-pressed="'+state.active[i]+'">'+(i+1)+' · '+esc(name)+'</button>').join('');$('mixerTracks').querySelectorAll('[data-track]').forEach(strip=>{const t=getTracks()[Number(strip.dataset.track)],button=strip.querySelector('[data-toggle="mute"]'),group=t&&player.groupMuted(t);if(button){button.textContent=group?'GRUPPE':'MUTE';button.setAttribute('aria-pressed',String(!!t.mute||group));button.classList.toggle('mute-on',!!t.mute||group)}});$('mixerMasterMute').textContent=player.masterMuted?'LYD PÅ':'LYD AV';$('mixerMasterMute').setAttribute('aria-pressed',String(!!player.masterMuted))}
  function drawFiles(){const tracks=getTracks();$('mixerSongFiles').innerHTML=tracks.length?'<table><thead><tr><th>Spor</th><th>Lokal lydfil</th><th>Filplass</th></tr></thead><tbody>'+tracks.map(t=>{const file=player.info.get(t.assetId);return '<tr><td>'+esc(t.name)+'</td><td>'+esc(t.fileName||file?.name||'Lagret lydfil – klargjør for filinformasjon')+'</td><td>'+(file? (file.bytes/1048576).toFixed(1)+' MiB':'—')+'</td></tr>'}).join('')+'</tbody></table>':'Ingen lydfiler er koblet til denne låten.'}
  function toggleGroup(id){if(!Number.isInteger(id)||id<1||id>6)return;const active=new Set(player.muteGroups||[]);active.has(id)?active.delete(id):active.add(id);player.setMuteGroups(active);drawGroups();updateTransport()}
  function toggleMasterMute(){player.setMasterMuted(!player.masterMuted);drawGroups();updateTransport()}
  async function seek(seconds,resume){if(loading||importing||!player.duration)return false;const mine=generation;try{const moved=await player.seek(seconds,resume);if(moved&&mine===generation)o.seek?.(player.currentTime,player.duration);updateTransport();return moved}catch(error){message(error.message,true);updateTransport();return false}}
  function commitBuses(buses){const previous=o.state().opts.audioBuses;o.state().opts.audioBuses=buses.map(root.StageProject.bus);if(o.save()===false){o.state().opts.audioBuses=previous;throw Error('Utgangsbussene kunne ikke lagres.')}invalidateProject();player.setBuses(getBuses())}
  const gainText=gain=>gain>0?(20*Math.log10(gain)).toFixed(1)+' dB':'−∞ dB';
  function outputOptions(route){const limit=Math.max(0,(player.channels||32)-(route.stereo?1:0));return Array.from({length:limit},(_,n)=>'<option value="'+(n+1)+'"'+(route.output===n+1?' selected':'')+'>'+(n+1)+(route.stereo?'–'+(n+2):'')+'</option>').join('')+(route.output>limit?'<option value="'+route.output+'" selected>'+route.output+' · mangler</option>':'')}
  function drawBuses(){
   const tracks=getTracks(),used=new Set(tracks.map(t=>t.bus).filter(Boolean)),busy=loading||importing,locked=busy||player.playing;
   $('mixerBuses').innerHTML=getBuses().filter(b=>showAllBuses||used.has(b.id)||(!used.size&&b.id<=2)).map(b=>{
    const count=tracks.filter(t=>t.bus===b.id).length,color=colors[(b.id-1)%colors.length];
    return '<section class="stem-strip bus-strip" data-bus="'+b.id+'" style="--channel-color:'+color+'"><div class="strip-header"><span>BUSS '+String(b.id).padStart(2,'0')+'</span><span class="strip-kind">'+(b.stereo?'ST':'M')+'</span></div><div class="route-badge">USB '+b.output+(b.stereo?'–'+(b.output+1):'')+'</div><small class="stem-file">'+(count?count+' spor tilkoblet':'Ingen spor tilkoblet')+'</small><div class="stem-switches"><button data-bus-mute aria-pressed="'+b.mute+'" class="'+(b.mute?'mute-on':'')+'"'+(busy?' disabled':'')+'>MUTE</button><button data-bus-reset'+(busy?' disabled':'')+'>0 dB</button></div><div class="fader-value"><output data-bus-gain="'+b.id+'">'+gainText(b.gain)+'</output></div>'+faderMarkup({gain:b.gain,field:'data-bus-field="gain"',meter:'data-bus-meter="'+b.id+'"',label:'Bussvolum '+b.name,disabled:busy})+'<div class="level-readout"><span>PEAK</span><output data-bus-peak="'+b.id+'">−∞ dBFS</output></div><div class="stem-routing"><label>FORMAT<select data-bus-field="stereo"'+(locked?' disabled':'')+'><option value="true"'+(b.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!b.stereo?' selected':'')+'>Mono</option></select></label><label>USB UT<select data-bus-field="output"'+(locked||player.mode==='stereo'?' disabled':'')+'>'+outputOptions(b)+'</select></label></div><label class="channel-label"><span>BUSSNAVN</span><input data-bus-field="name" value="'+esc(b.name)+'" maxlength="24" aria-label="Bussnavn"'+(busy?' disabled':'')+'></label></section>'
   }).join('')
  }
  function invalidateProject(){prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true}
  function commit(tracks,song=o.song()){
   if(!song)return;const previous=song.playback;song.playback={...previous,tracks:tracks.map(root.StageProject.track)};
   if(o.save()===false){song.playback=previous;throw Error('Mikserinnstillingene kunne ikke lagres. Ingen lydspor er erstattet.')}
   invalidateProject();if(song===o.song())player.update(song.playback.tracks)
  }
  function updateTransport(){
   const tracks=getTracks(),ready=!loading&&!importing&&player.buffers.length===tracks.length&&tracks.length>0&&!player.routeError();
   $('audioPlay').disabled=$('mixerPlay').disabled=!ready;$('audioStop').disabled=$('mixerStop').disabled=!tracks.length;
   $('mixerPlay').textContent=player.playing||player.seekResume?'PAUSE':'SPILL';$('mixerPlay').setAttribute('aria-pressed',String(player.playing));
   for(const id of ['stemAdd','prepareAudio','outputMode','refreshOutputs','projectImport','projectDemo'])$(id).disabled=loading||importing||player.playing;
   $('stemAdd').disabled=loading||importing||player.playing||!o.song();
   if($('routeDirect'))$('routeDirect').disabled=loading||importing||player.playing;
   $('audioName').textContent=tracks.length?tracks.length+' lydspor':'Ingen lydfil';for(const listener of listeners)listener()
  }
  function drawMemory(){
   const bytes=player.requiredBytes||player.decodedBytes||0,limit=root.StageAudio.MAX_DECODED,over=bytes>limit;
   $('mixerMemoryText').textContent=(over?'Minst ':'')+(bytes/1048576).toFixed(1)+' / '+(limit/1048576)+' MiB arbeidsminne';$('mixerMemory').dataset.over=String(over);$('mixerMemoryFill').style.width=Math.min(100,bytes/limit*100)+'%';$('mixerMemory').setAttribute('aria-valuenow',String(Math.min(limit/1048576,bytes/1048576)));$('mixerMemoryHelp').textContent=over?'For mye dekodet lyd. Filene er beholdt. Fjern spor eller bruk kortere/mono-filer. MP3 alene reduserer ikke dette minnebehovet.':'MP3 sparer filplass. Arbeidsminnet bestemmes av lengde, samplingsfrekvens og kanaltall.'
  }
  function draw(){
   const song=o.song(),tracks=getTracks(),master=root.StageProject.masterGain(song),buses=getBuses(),busy=loading||importing,locked=busy||player.playing;player.setBuses(buses);
   $('mixerTracks').classList.toggle('hidden',view!=='tracks');$('mixerBuses').classList.toggle('hidden',view!=='buses');$('busViewOptions').classList.toggle('hidden',view!=='buses');$('mixerTrackTab').setAttribute('aria-pressed',String(view==='tracks'));$('mixerBusTab').setAttribute('aria-pressed',String(view==='buses'));$('busShowAll').checked=showAllBuses;
   $('mixerSong').textContent=song?.title||'Velg en låt';$('outputMode').value=player.mode;
   $('mixerOutputs').textContent=player.channels?(player.mode==='stereo'?'Stereoøving: alle spor, også klikk, mikses til 1–2.':'Ui24R / USB · '+player.channels+' kanaler · '+Math.round(player.context.sampleRate)+' Hz'):'Koble til Ui24R og velg LES UTGANGER.';
   $('mixerEmpty').classList.toggle('hidden',!!tracks.length||view!=='tracks');
   const direct=tracks.filter(t=>!t.bus).length,used=new Set(tracks.map(t=>t.bus).filter(Boolean));$('routingSummary').textContent=tracks.length+' spor · '+used.size+' busser'+(direct?' · '+direct+' spor går direkte til USB, utenom bussene':'');$('routingSummary').dataset.direct=String(direct>0);$('routeDirect').classList.toggle('hidden',!direct);$('routeDirect').disabled=locked;
   $('masterGain').value=gainToFader(master);$('masterGain').setAttribute('aria-valuetext',gainText(master));$('masterGainText').textContent=gainText(master);$('masterGain').disabled=$('masterReset').disabled=!song||busy;
   const openGroups=new Set([...$('mixerTracks').querySelectorAll('.track-groups[open]')].map(el=>el.getAttribute('data-owner')));
   $('mixerTracks').innerHTML=tracks.map((t,i)=>{
    const info=player.info.get(t.assetId),route=t.bus?buses[t.bus-1]:t,color=colors[(t.bus?t.bus-1:i)%colors.length];
    const busOptions='<option value="0"'+(!t.bus?' selected':'')+'>Direkte USB</option>'+buses.map(b=>'<option value="'+b.id+'"'+(t.bus===b.id?' selected':'')+'>'+b.id+' · '+esc(b.name)+'</option>').join('');
    return '<section class="stem-strip" data-track="'+i+'" style="--channel-color:'+color+'"><div class="strip-header"><span>SPOR '+String(i+1).padStart(2,'0')+'</span><button data-remove="'+i+'"'+(locked?' disabled':'')+' aria-label="Fjern '+esc(t.name)+'">✕</button></div><div class="route-badge '+(!t.bus?'direct-route':'')+'">'+(t.bus?'B'+String(t.bus).padStart(2,'0')+' '+esc(route.name):'DIREKTE')+' · USB '+route.output+(route.stereo?'–'+(route.output+1):'')+'</div><small class="stem-file">'+(info?(info.channels===1?'MONO':'STEREO')+' · '+Math.round(info.duration)+' s · '+((info.decodedBytes||0)/1048576).toFixed(1)+' MiB':'Ikke klargjort')+'</small><label class="stem-pan"><span>PAN</span><input type="range" data-field="pan" min="-1" max="1" step="0.01" value="'+t.pan+'"'+(busy||(!t.stereo&&!t.bus)?' disabled':'')+' aria-label="Panorering '+esc(t.name)+'"><span>L / R</span></label><div class="stem-switches"><button data-toggle="mute"'+(busy?' disabled':'')+' aria-pressed="'+t.mute+'" class="'+(t.mute?'mute-on':'')+'">MUTE</button><button data-toggle="solo"'+(busy?' disabled':'')+' aria-pressed="'+t.solo+'" class="'+(t.solo?'solo-on':'')+'">SOLO</button></div><div class="fader-value"><output data-gain="'+i+'">'+gainText(t.gain)+'</output><button data-track-reset title="Tilbake til 0 dB"'+(busy?' disabled':'')+'>0</button></div>'+faderMarkup({gain:t.gain,field:'data-field="gain"',meter:'data-meter="'+i+'"',label:'Volum '+t.name,disabled:busy})+'<div class="level-readout"><span>PEAK</span><output data-peak="'+i+'">−∞ dBFS</output></div><label class="stem-bus-choice">UTGANGSBUSS<select data-field="bus"'+(locked?' disabled':'')+'>'+busOptions+'</select></label><div class="stem-routing"><label>FIL<select data-field="stereo"'+(locked?' disabled':'')+'><option value="true"'+(t.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!t.stereo?' selected':'')+'>Mono</option></select></label><label class="'+(t.bus?'hidden':'')+'">USB UT<select data-field="output"'+(locked||player.mode==='stereo'?' disabled':'')+'>'+outputOptions(t)+'</select></label></div>'+groupAssignment(t,i,openGroups.has(String(i)))+'<label class="channel-label"><span>SPORNAVN</span><input data-field="name" value="'+esc(t.name)+'" aria-label="Spornavn"'+(busy?' disabled':'')+'></label></section>'
   }).join('');drawBuses();drawGroups();drawFiles();drawMemory();updateTransport()
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
    const error=player.routeError();message(error||('Lokalt klar · '+tracks.length+' spor'+(player.decodedBytes?' · '+Math.ceil(player.decodedBytes/1048576)+' MiB lyd i minnet':'')),!!error);draw();return true
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
     const click=/(?:click|klikk|clix|metronom)/i.test(file.name),track=root.StageProject.track({assetId,name:file.name.replace(/\.[^.]+$/,''),fileName:file.name,stereo:!click,output:click?3:1,bus:click?2:1});
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
   try{if(player.playing||player.seekResume)player.pause();else{o.beforePlay?.();await player.play()}draw()}catch(error){message(error.message,true);draw()}
  }
  function changeMaster(value){const song=o.song();if(!song)return;const gain=Number(value);if(!Number.isFinite(gain))return;const previous=song.playback;song.playback={...previous,tracks:getTracks(),masterGain:Math.max(0,Math.min(2,gain))};if(o.save()===false){song.playback=previous;message('Masterverdien kunne ikke lagres.',true);draw();return}invalidateProject();player.setMaster(song.playback.masterGain);$('masterGain').value=gainToFader(song.playback.masterGain);$('masterGain').setAttribute('aria-valuetext',gainText(song.playback.masterGain));$('masterGainText').textContent=song.playback.masterGain>0?(20*Math.log10(song.playback.masterGain)).toFixed(1)+' dB':'−∞ dB'}
  function download(file){const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=file.name||'BenKen.benken';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
  async function exportProject(){
   if(loading||importing||player.playing)return message('Stopp avspillingen før du lager prosjektfil.',true);
   const scope=$('projectScope').value==='all'?'library':'song',state=structuredClone(o.state()),song=o.song();if(scope==='song'&&!song)return;
   delete state.opts.audioOutputMode;if(scope==='song'){state.songs=[structuredClone(song)];state.sets={};state.set='';state.idx=0}
   player.cancel();updateTransport();drawMemory();$('projectBackup').disabled=true;message('Lager prosjektfil med lokale lydfiler…');
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
  $('masterGain').addEventListener('input',e=>changeMaster(faderToGain(e.target.value)));$('masterReset').onclick=()=>changeMaster(1);
  $('masterGain').addEventListener('dblclick',()=>{if(!loading&&!importing)changeMaster(1)});
  $('routeDirect').onclick=()=>{
   const song=o.song();if(!song||loading||importing||player.playing)return;
   const previous=song.playback,oldBuses=o.state().opts.audioBuses;
   try{const plan=root.StageProject.routeDirect(o.state(),song,getTracks());if(!plan.changed)return;song.playback={...previous,tracks:plan.tracks};o.state().opts.audioBuses=plan.buses;
    if(o.save()===false){song.playback=previous;o.state().opts.audioBuses=oldBuses;throw Error('Bussrutingen kunne ikke lagres. Ingen ruting er endret.')}
    invalidateProject();player.setBuses(getBuses());player.update(plan.tracks);const error=player.routeError();message(error||plan.changed+' spor er koblet til busser. USB-utganger og nivå er beholdt.',!!error);draw()
   }catch(error){message(error.message,true);draw()}
  };
  function resetTrack(e){const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks();tracks[Number(strip.dataset.track)].gain=1;commit(tracks);draw()}catch(error){message(error.message,true);draw()}}
  $('mixerTracks').addEventListener('click',e=>{if(e.target.closest('[data-track-reset]'))resetTrack(e)});
  $('mixerTracks').addEventListener('dblclick',e=>{if(e.target.closest('.mixer-fader'))resetTrack(e)});
  $('mixerBuses').addEventListener('dblclick',e=>{const strip=e.target.closest('[data-bus]');if(!strip||!e.target.closest('.mixer-fader')||loading||importing)return;try{const buses=getBuses();buses[Number(strip.dataset.bus)-1].gain=1;commitBuses(buses);draw()}catch(error){message(error.message,true);draw()}});
  $('mixerTracks').addEventListener('input',e=>{const input=e.target.closest('input[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(loading||importing){draw();return}try{const tracks=getTracks(),i=Number(strip.dataset.track),field=input.dataset.field;tracks[i][field]=field==='name'?input.value:field==='gain'?faderToGain(input.value):Number(input.value);commit(tracks);if(field==='gain'){input.setAttribute('aria-valuetext',gainText(tracks[i].gain));$('mixerTracks').querySelector('[data-gain="'+i+'"]').textContent=gainText(tracks[i].gain)}}catch(error){message(error.message,true);draw()}});
  $('mixerTracks').addEventListener('change',e=>{const input=e.target.closest('select[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(player.playing||loading||importing){draw();return}try{const tracks=getTracks(),track=tracks[Number(strip.dataset.track)];if(input.dataset.field==='bus'&&Number(input.value)===0)delete track.bus;else track[input.dataset.field]=input.dataset.field==='stereo'?input.value==='true':Number(input.value);commit(tracks);const error=player.routeError();message(error||'Ruting lagret.',!!error);draw()}catch(error){message(error.message,true);draw()}});
  $('mixerTracks').addEventListener('click',e=>{const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks(),i=Number(strip.dataset.track),toggle=e.target.closest('[data-toggle]'),remove=e.target.closest('[data-remove]');if(toggle&&toggle.dataset.toggle==='mute'&&player.groupMuted(tracks[i]))return message('Sporet er mutet av en aktiv mutegruppe. Slå av gruppen for å høre sporet.');if(toggle){tracks[i][toggle.dataset.toggle]=!tracks[i][toggle.dataset.toggle];commit(tracks);draw()}if(remove&&!player.playing&&!loading&&!importing&&root.confirm('Fjerne sporet fra låten? Lydfilen beholdes lokalt.')){tracks.splice(i,1);commit(tracks);load()}}catch(error){message(error.message,true)}});
  $('projectScope').addEventListener('change',()=>{invalidateProject();message('Velg LAG PROSJEKTFIL for det valgte innholdet.')});$('projectBackup').onclick=exportProject;$('projectDownload').onclick=()=>{if(prepared)download(prepared)};
  $('projectShare').onclick=()=>{if(prepared)root.navigator.share({files:[prepared],title:'BenKen-prosjekt med lyd'}).catch(error=>{if(error.name!=='AbortError')message(error.message,true)})};
  $('projectImport').onclick=()=>$('projectFile').click();$('projectFile').onchange=e=>{const file=e.target.files?.[0];e.target.value='';if(file)return importProject(file)};
  $('mixerTrackTab').onclick=()=>{view='tracks';draw()};$('mixerBusTab').onclick=()=>{view='buses';draw()};$('busShowAll').onchange=e=>{showAllBuses=e.target.checked;drawBuses()};
  function busInput(e){const input=e.target.closest('[data-bus-field]'),strip=e.target.closest('[data-bus]');if(!input||!strip)return;const field=input.dataset.busField;if((e.type==='change'&&input.tagName==='INPUT')||(e.type==='input'&&input.tagName==='SELECT'))return;if(loading||importing||(player.playing&&['stereo','output'].includes(field))){draw();return}try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];b[field]=field==='name'?input.value:field==='stereo'?input.value==='true':field==='gain'?faderToGain(input.value):Number(input.value);commitBuses(buses);if(field==='gain'){input.setAttribute('aria-valuetext',gainText(b.gain));strip.querySelector('[data-bus-gain]').textContent=gainText(b.gain)};if(field==='stereo'||field==='output'){const error=player.routeError();message(error||'Bussruting lagret for alle låter.',!!error);draw()}else updateTransport()}catch(error){message(error.message,true);draw()}}
  $('mixerBuses').addEventListener('input',busInput);$('mixerBuses').addEventListener('change',busInput);
  $('mixerBuses').addEventListener('click',e=>{const strip=e.target.closest('[data-bus]');if(!strip||loading||importing)return;const mute=e.target.closest('[data-bus-mute]'),reset=e.target.closest('[data-bus-reset]');if(!mute&&!reset)return;try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];if(mute)b.mute=!b.mute;else b.gain=1;commitBuses(buses);draw()}catch(error){message(error.message,true)}});
  $('resetMasterPeak').onclick=()=>{heldPeak=0;$('masterPeakHoldText').textContent='−∞ dBFS'};
  $('mixerGroups').addEventListener('click',e=>{const button=e.target.closest('[data-global-group]');if(button)toggleGroup(Number(button.dataset.globalGroup))});
  $('mixerMasterMute').onclick=toggleMasterMute;
  $('mixerTracks').addEventListener('click',e=>{const button=e.target.closest('[data-track-group]'),strip=e.target.closest('[data-track]');if(!button||!strip||loading||importing)return;try{const tracks=getTracks(),t=tracks[Number(strip.dataset.track)],group=Number(button.dataset.trackGroup),groups=new Set(t.muteGroups||[]);groups.has(group)?groups.delete(group):groups.add(group);t.muteGroups=[...groups];commit(tracks);draw()}catch(error){message(error.message,true)}});
  $('projectDemo').onclick=async()=>{if(loading||importing||player.playing)return;$('projectDemo').disabled=true;message('Henter testlåten…');try{const response=await root.fetch('./demo/BenKen_Ui24R_Busstest.benken');if(!response.ok)throw Error('Testlåten mangler. Last opp demo-mappen fra V26.8 til GitHub.');await importProject(await response.blob())}catch(error){message(error.message,true)}finally{updateTransport()}};
  function meter(bar,out,peak){const info=root.StageAudio.level(peak||0);bar.style.height=info.percent+'%';bar.parentNode.setAttribute('aria-valuenow',String(Number.isFinite(info.db)?Math.max(-60,Math.min(0,info.db)):-60));bar.parentNode.dataset.zone=info.clip?'clip':info.db>=-6?'high':'normal';out.textContent=info.label+' dBFS'+(info.clip?' · CLIP':'')}
  setInterval(()=>{player.tick();o.time?.(player.currentTime,player.duration);const peak=player.meterMaster();heldPeak=Math.max(heldPeak,peak);if($('mixerDialog').open||$('mixerDialog').hasAttribute('open')){const levels=player.meters();$('mixerTracks').querySelectorAll('[data-meter]').forEach((bar,i)=>meter(bar,$('mixerTracks').querySelector('[data-peak="'+i+'"]'),levels[i]||0));const busLevels=player.meterBuses();$('mixerBuses').querySelectorAll('[data-bus-meter]').forEach(bar=>meter(bar,$('mixerBuses').querySelector('[data-bus-peak="'+bar.dataset.busMeter+'"]'),busLevels.get(Number(bar.dataset.busMeter))||0));meter($('masterMeter'),$('masterPeakText'),peak);$('masterPeakHoldText').textContent=root.StageAudio.level(heldPeak).label+' dBFS';$('mixerPosition').textContent=Math.floor(player.currentTime)+' / '+Math.ceil(player.duration)+' s'}for(const listener of listeners)listener()},100);
  return {player,repo,load,cancel,draw,addFiles,exportProject,importProject,playPause,seek,toggleGroup,toggleMasterMute,groupState,tracks:getTracks,busy:()=>loading||importing,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn)}}
 }
 root.StageMixer={VERSION:'26.8',mount,gainToFader,faderToGain,faderMarkup};
})(typeof window!=='undefined'?window:globalThis);
