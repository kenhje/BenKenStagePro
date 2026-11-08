(function(root){
'use strict';
const VERSION='26.141',RATE=48000,CHUNK=48000,MAX_PCM=192*1024*1024;
const excluded=t=>/(^|[\s_\-.])(click|cue|cues|metronome|count[ -]?in)([\s_\-.]|$)/i.test(t.name+' '+(t.fileName||''));
function included(song,tracks){const saved=song.playback?.loudnessInclude;return new Set(Array.isArray(saved)?saved:tracks.filter(t=>!excluded(t)).map(t=>t.id))}
function fingerprint(song,state){return JSON.stringify({tracks:root.StageProject.tracks(song),include:[...included(song,root.StageProject.tracks(song))],buses:root.StageProject.buses(state)})}
function setSongs(state){if(!state.set||!Array.isArray(state.sets?.[state.set]))throw Error('Select a setlist first.');const ids=[...new Set(state.sets[state.set])];if(!ids.length)throw Error('The selected setlist is empty.');if(ids.some(id=>!Number.isInteger(id)||!state.songs[id]))throw Error('The setlist contains a missing song.');return ids.map(id=>state.songs[id])}
function commit(song,state,result,target,save,signature){if(fingerprint(song,state)!==signature)throw Error('Song mix changed during analysis. Analyse it again.');const before=song.playback,previousGain=before?.loudness?.previousGain??root.StageProject.masterGain(song);song.playback={...before,masterGain:result.gain,loudness:{...result,target,previousGain,signature,date:new Date().toISOString(),version:VERSION}};if(save()===false){song.playback=before;throw Error('Song level could not be saved.')}return song.playback.loudness}
function reset(song,save){const before=song.playback;if(!before?.loudness)return false;song.playback={...before,masterGain:before.loudness.previousGain??1};delete song.playback.loudness;if(save()===false){song.playback=before;throw Error('Song level could not be reset.')}return true}
async function missingTracks(tracks,repo,check=()=>{}){const missing=[];for(const track of tracks){check();const entry=await repo.get(track.assetId);if(!entry?.data)missing.push(track.name+' — '+(track.fileName||'audio file'))}return missing}
function mount(o){
 const $=id=>root.document.getElementById(id),esc=root.StageLyrics.esc;let running=false,cancelled=false,activeWorker=null,workerFailed=false,sequence=0,pending=new Map(),jobName='',currentSongIndex=0,totalSongs=1,progressValue=0,returnFocus=null;
 const dialog=root.document.createElement('dialog');dialog.id='songLoudnessDialog';dialog.setAttribute('aria-labelledby','songLoudnessTitle');dialog.innerHTML='<div class="loudness-header"><h2 id="songLoudnessTitle">Song loudness</h2><button id="songLoudnessClose" type="button">Done</button></div><section class="loudness-card"><h3 id="songLoudnessSong"></h3><label class="loudness-target">Target LUFS<input id="songLoudnessTarget" type="number" min="-60" max="-5" step="0.1" value="-14" inputmode="decimal"></label><p id="songLoudnessSaved"></p><div class="loudness-actions"><button id="songLoudnessAnalyze" type="button">ANALYZE & APPLY</button><button id="songLoudnessReset" type="button">RESET SONG</button></div></section><section class="loudness-card"><h3>Selected setlist</h3><p id="songLoudnessSet"></p><button id="songLoudnessAnalyzeSet" type="button">ANALYZE SETLIST</button></section><details class="loudness-card"><summary>Tracks & measurement</summary><p>Reference stereo mix at original tempo, before track EQ, master compression and global Master. Uses saved track and bus levels; ignores temporary mute/solo. Select the musical tracks to measure. Click/cue tracks are excluded by name initially, but all file tracks are checked for peaks.</p><div id="songLoudnessTracks"></div><p>Peak headroom: −3 dBFS sample ceiling. Peaks or the Song Master limit (+6 dB) may prevent the target being reached. Mixer effects, generated metronome, tempo and transpose can change the final level. This does not limit live peaks.</p></details><div id="songLoudnessProgressBox" hidden><div class="loudness-progress-heading"><label for="songLoudnessProgress">Overall progress</label><output id="songLoudnessPercent">0%</output></div><progress id="songLoudnessProgress" max="100" value="0" aria-label="Loudness analysis progress"></progress></div><p id="songLoudnessStatus" role="status" aria-live="polite"></p><button id="songLoudnessCancel" type="button" hidden>CANCEL ANALYSIS</button><ol id="songLoudnessResults"></ol>';
 root.document.body.append(dialog);
 function playbackBusy(){return o.mixer.busy({ignoreLoudness:true})||o.mixer.player.playing||o.mixer.player.preparing||o.mixer.player.seekResume||o.mixer.click.running}
 function check(){if(cancelled)throw Error('Analysis cancelled.');if(playbackBusy())throw Error('Playback or audio preparation started. Analysis stopped.');if(root.document.hidden)throw Error('Analysis paused by leaving the app. Keep BenKen open and try again.');}
 function progressSong(part){
  const value=Math.min(100,Math.max(progressValue,(currentSongIndex+Math.max(0,Math.min(1,part)))/totalSongs*100));progressValue=value;
  $('songLoudnessProgress').value=value;$('songLoudnessProgress').setAttribute('aria-valuetext',Math.floor(value)+'% · Song '+Math.min(totalSongs,currentSongIndex+1)+' of '+totalSongs);$('songLoudnessPercent').textContent=Math.floor(value)+'%';
 }
 function status(text){$('songLoudnessStatus').textContent=text}
 function refresh(){const song=o.song(),tracks=root.StageProject.tracks(song),selected=included(song,tracks),saved=song?.playback?.loudness;
  $('songLoudnessSong').textContent=song?.title||'Select a song';$('songLoudnessSet').textContent=o.state().set||'No setlist selected';
  const stale=saved&&(saved.signature!==fingerprint(song,o.state())||Math.abs(root.StageProject.masterGain(song)-saved.gain)>1e-6);
  $('songLoudnessSaved').textContent=saved?(stale?'Mix changed — analyse again. Last result: ':'Saved: ')+saved.achieved.toFixed(1)+' LUFS · target '+saved.target.toFixed(1)+' · Song Master '+(20*Math.log10(saved.gain)).toFixed(1)+' dB'+(saved.limited?' · Limited: '+saved.reason:''):'No saved loudness analysis.';
  $('songLoudnessTracks').innerHTML=tracks.map(t=>'<label class="loudness-track"><input type="checkbox" data-loudness-track="'+esc(t.id)+'"'+(selected.has(t.id)?' checked':'')+'><span>'+esc(t.name)+'</span></label>').join('');
  $('songLoudnessTracks').querySelectorAll('[data-loudness-track]').forEach(el=>el.onchange=()=>{const before=song.playback,ids=[...$('songLoudnessTracks').querySelectorAll('input:checked')].map(e=>e.dataset.loudnessTrack);song.playback={...before,loudnessInclude:ids};if(o.save()===false){song.playback=before;status('Track selection could not be saved.')}refresh()});
  $('songLoudnessReset').disabled=running||!saved;$('songLoudnessAnalyze').disabled=running||!song||!tracks.length;$('songLoudnessAnalyzeSet').disabled=running||!o.state().set;dialog.querySelectorAll('input').forEach(el=>el.disabled=running);$('songLoudnessClose').disabled=running;$('songLoudnessCancel').hidden=!running;
 }
 function ask(command,data={},transfer=[]){if(workerFailed||!activeWorker)return Promise.reject(Error('Analysis worker is unavailable.'));return new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});try{activeWorker.postMessage({id,command,...data},transfer)}catch(error){pending.delete(id);reject(error)}})}
 async function dispose(){if(activeWorker){try{await ask('cleanup')}catch{}activeWorker.terminate();activeWorker=null}pending.forEach(p=>p.reject(Error('Analysis ended.')));pending.clear();if(jobName){root.indexedDB.deleteDatabase(jobName);jobName=''}}
 async function analyze(song,target){
  check();const state=o.state(),initialGain=root.StageProject.masterGain(song),signature=fingerprint(song,state),tracks=root.StageProject.tracks(song),selected=included(song,tracks),buses=root.StageProject.buses(state);
  if(!tracks.length)throw Error('No audio tracks.');if(!tracks.some(t=>selected.has(t.id)))throw Error('Select at least one musical track under Tracks & measurement.');
  if(Number(song.duration)>520)throw Error('This song is too long for on-device analysis. Analyse a shorter stereo export instead.');
  const missing=await missingTracks(tracks,o.mixer.repo,check);if(missing.length)throw Error('Missing audio: '+missing.join('; '));
  jobName='benken-loudness-temp-'+root.crypto.randomUUID();workerFailed=false;activeWorker=new root.Worker('./benken-loudness-worker-v26-141.js');
  activeWorker.onmessage=e=>{if(typeof e.data.progress==='number'){progressSong(.85+.14*e.data.progress);return}const p=pending.get(e.data.id);if(!p)return;pending.delete(e.data.id);e.data.error?p.reject(Error(e.data.error)):p.resolve(e.data.value)};
  activeWorker.onerror=e=>{workerFailed=true;pending.forEach(p=>p.reject(Error(e.message||'Loudness worker failed.')));pending.clear()};
  try{
   await ask('init',{name:jobName});
   for(let ti=0;ti<tracks.length;ti++){
    check();progressSong(.85*ti/tracks.length);const t=tracks[ti],bus=t.bus?buses[t.bus-1]:null;status(song.title+' · File '+(ti+1)+'/'+tracks.length+' · '+t.name);
    let entry=await o.mixer.repo.get(t.assetId);if(!entry?.data)throw Error('Missing audio: '+t.name);
    const bytes=entry.data instanceof root.Blob?entry.data.size:entry.data.byteLength;if(bytes>64*1024*1024)throw Error(t.name+': file exceeds the on-device analysis limit (64 MiB).');
    let data=entry.data instanceof root.Blob?await entry.data.arrayBuffer():entry.data.slice(0);entry=null;check();
    // Offline decode never starts an audio device or changes the live output route.
    let decoder=new root.OfflineAudioContext(2,1,RATE),buffer=await decoder.decodeAudioData(data);decoder=null;data=null;check();
    if(buffer.numberOfChannels>2||buffer.length*buffer.numberOfChannels*4>MAX_PCM)throw Error(t.name+': decoded audio exceeds the on-device analysis limit (192 MiB / max stereo).');
    if(buffer.sampleRate!==RATE)throw Error('Audio decoder did not provide 48 kHz.');
    progressSong(.85*(ti+.2)/tracks.length);let l=buffer.getChannelData(0),r=buffer.numberOfChannels>1?buffer.getChannelData(1):null;
    for(let offset=0;offset<buffer.length;offset+=CHUNK){check();const left=l.slice(offset,offset+CHUNK),right=r?.slice(offset,offset+CHUNK),transfer=[left.buffer,...(right?[right.buffer]:[])];await ask('add',{offset,left:left.buffer,right:right?.buffer,include:selected.has(t.id),stereo:t.stereo,pan:t.pan,gain:t.gain*(bus?.gain??1),output:bus?.output??t.output,hasBus:!!bus,routeStereo:bus?bus.stereo:t.stereo},transfer);progressSong(.85*(ti+.2+.8*Math.min(1,(offset+CHUNK)/buffer.length))/tracks.length)}
    buffer=null;l=null;r=null;await new Promise(resolve=>root.setTimeout(resolve,0));
   }
   check();progressSong(.85);status(song.title+' · Measuring integrated LUFS…');const measured=await ask('finish');check();const result={...measured,...root.BenKenLoudnessDSP.plan(measured.integrated,measured.samplePeak,target)};
   if(o.state()!==state||!state.songs.includes(song))throw Error('Library changed during analysis. No level was applied.');if(root.StageProject.masterGain(song)!==initialGain)throw Error('Song Master changed during analysis. Analyse again.');commit(song,state,result,target,o.save,signature);
   if(song===o.song()){o.mixer.changeSongLevel(result.gain);o.mixer.draw()}return result;
  }finally{await dispose()}
 }
 async function run(all){if(running)return;try{
  if(playbackBusy())throw Error('Stop playback and wait until the song is ready before analysis.');
  const target=Number($('songLoudnessTarget').value);if(!Number.isFinite(target)||target< -60||target> -5||!$('songLoudnessTarget').value.trim())throw Error('Choose Target LUFS between −60 and −5.');
  const songs=all?setSongs(o.state()):[o.song()];if(songs.some(s=>!s))throw Error('Select a song first.');
  const before=o.state().opts.loudnessTarget;o.state().opts.loudnessTarget=target;if(o.save()===false){o.state().opts.loudnessTarget=before;throw Error('Target LUFS could not be saved.')}
  root.BenKenTuner?.stop();root.document.activeElement?.blur?.();running=true;cancelled=false;currentSongIndex=0;totalSongs=songs.length;progressValue=0;$('songLoudnessProgressBox').hidden=false;progressSong(0);refresh();$('songLoudnessResults').replaceChildren();let completed=0,failed=0;
  try{for(const [songIndex,song] of songs.entries()){currentSongIndex=songIndex;check();progressSong(0);const row=root.document.createElement('li');$('songLoudnessResults').append(row);row.textContent=song.title+' · Analysing…';
   try{const r=await analyze(song,target);completed++;row.textContent=song.title+' · '+r.achieved.toFixed(1)+' LUFS · '+(20*Math.log10(r.gain)).toFixed(1)+' dB'+(r.limited?' · Limited: '+r.reason:' · Saved')}
   catch(error){failed++;row.textContent=song.title+' · '+error.message;if(cancelled||playbackBusy()||root.document.hidden)break}
   progressSong(1);
  }status((cancelled?'Cancelled. ':'Finished. ')+completed+' saved · '+failed+' skipped.'+(completed<songs.length?' Completed songs keep their saved levels.':''))}
  finally{running=false;refresh()}
 }catch(error){running=false;status(error.message);refresh()}}
 function cancel(){cancelled=true;status('Cancelling after the current decode or audio chunk…')}
 function open(){if(running)return;const focused=root.document.activeElement;returnFocus=focused?.getClientRects?.().length?focused:$('settingsBtn');focused?.blur?.();root.BenKenTuner?.stop();$('songLoudnessTarget').value=o.song()?.playback?.loudness?.target??o.state().opts.loudnessTarget??-14;$('songLoudnessProgressBox').hidden=true;status('Analyse before the show. Keep BenKen open until finished.');$('songLoudnessResults').replaceChildren();refresh();dialog.showModal()}
 $('songLoudnessOpen').onclick=open;
 dialog.addEventListener('close',()=>{const target=returnFocus?.isConnected&&returnFocus.getClientRects().length?returnFocus:$('settingsBtn');target?.focus({preventScroll:true})});
 $('songLoudnessAnalyze').onclick=()=>run(false);$('songLoudnessAnalyzeSet').onclick=()=>run(true);$('songLoudnessClose').onclick=()=>{if(!running)dialog.close()};$('songLoudnessCancel').onclick=cancel;
 $('songLoudnessReset').onclick=()=>{try{if(playbackBusy())throw Error('Stop playback before resetting.');const song=o.song();if(reset(song,o.save)){o.mixer.changeSongLevel(root.StageProject.masterGain(song));o.mixer.draw();$('songLoudnessResults').replaceChildren();$('songLoudnessProgressBox').hidden=true;status('Restored the Song Master level from before normalization.')}refresh()}catch(error){status(error.message)}};
 dialog.addEventListener('cancel',e=>{if(running){e.preventDefault();cancel()}});root.addEventListener('pagehide',()=>{cancelled=true;if(activeWorker){activeWorker.terminate();activeWorker=null}pending.forEach(p=>p.reject(Error('Analysis cancelled when leaving BenKen.')));pending.clear();if(jobName){root.indexedDB.deleteDatabase(jobName);jobName=''}});
 return {busy:()=>running,open};
}
root.StageLoudness={VERSION,included,fingerprint,setSongs,commit,reset,missingTracks,mount};
})(typeof window!=='undefined'?window:globalThis);
