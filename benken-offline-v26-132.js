(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function check(state,repo,{set=state.set||'',cancelled=()=>false,progress=()=>{}}={}){
  const songs=state.songs||[],order=set?state.sets?.[set]:songs.map((_,i)=>i);
  if(!Array.isArray(order)||!order.length)throw Error('This setlist is empty. Add songs before checking.');
  const indices=[...new Set(order)];if(indices.some(i=>!Number.isInteger(i)||!songs[i]))throw Error('This setlist contains an unavailable song. Check the library.');
  const tracks=indices.flatMap(i=>root.StageProject.tracks(songs[i])),assets=[...new Set(tracks.map(t=>t.assetId))],cache=new Map();let done=0;
  for(const id of assets){
   if(cancelled())throw Error('Check cancelled. No availability result was saved.');
   let result;try{if(!id)result={available:false,reason:'No audio file linked'};else{const local=repo.inspectLocal?await repo.inspectLocal(id):null;result=local?.available?{available:true,size:local.size}:{available:false,reason:'Missing or empty local file'}}}catch{result={available:false,reason:'Local file could not be read'}}
   cache.set(id,result);progress({done:++done,total:assets.length});await new Promise(resolve=>root.setTimeout(resolve,0));
  }
  if(cancelled())throw Error('Check cancelled. Run it again when playback and editing have stopped.');
  const rows=indices.map(index=>{const song=songs[index],tracks=root.StageProject.tracks(song),missing=tracks.filter(t=>!cache.get(t.assetId)?.available).map(t=>({track:t.name||'Audio track',file:t.fileName||'',reason:cache.get(t.assetId)?.reason||'No audio file linked'}));return {index,title:song.title||'Untitled song',tracks:tracks.length,missing,status:missing.length?'missing':tracks.length?'local':'lyrics'}});
  return {set,name:set||'All songs',checkedAt:new Date().toISOString(),rows,files:assets.length,missing:rows.reduce((n,r)=>n+r.missing.length,0),lyricsOnly:rows.filter(r=>r.status==='lyrics').length};
 }
 function mount(o){
  const doc=root.document;let serial=0,running=false,snapshot=null;
  const dialog=doc.createElement('dialog');dialog.id='offlineSetlistDialog';dialog.className='offline-setlist-dialog';dialog.setAttribute('aria-labelledby','offlineSetlistTitle');
  dialog.innerHTML='<div class="offline-heading"><h2 id="offlineSetlistTitle">Check offline availability</h2><button type="button" id="offlineClose">Done</button></div><p>Check that the audio for your rehearsal or concert is stored inside BenKen on this device. No internet or mixer connection is needed.</p><label>Setlist<select id="offlineSetlist"></select></label><div class="offline-actions"><button type="button" id="offlineRun">CHECK NOW</button><button type="button" id="offlineCancel" hidden>CANCEL</button></div><progress id="offlineProgress" max="1" value="0" hidden aria-label="Local audio check progress"></progress><p id="offlineSummary" role="status" aria-live="polite">Choose a setlist and press CHECK NOW.</p><div id="offlineRows"></div><p class="offline-foot">Files that are only in iCloud do not count as imported. If audio is missing, download the original files and import or replace them in BenKen under Mixer settings → Audio &amp; files, or restore a full backup with audio. This check confirms local original files; it does not decode every track or verify USB routing. Test playback without internet before you leave.</p>';
  doc.body.appendChild(dialog);const $=id=>doc.getElementById(id);
  function stop(){serial++;running=false;$('offlineRun').disabled=false;$('offlineSetlist').disabled=false;$('offlineCancel').hidden=true;$('offlineProgress').hidden=true;}
  async function run(){
   if(o.busy()){$('offlineSummary').textContent='Stop playback and wait for audio preparation before checking.';return}
   stop();const token=serial;running=true;snapshot=structuredClone(o.state());const signature=JSON.stringify(snapshot);$('offlineRows').innerHTML='';$('offlineRun').disabled=true;$('offlineSetlist').disabled=true;$('offlineCancel').hidden=false;$('offlineProgress').hidden=false;$('offlineProgress').value=0;$('offlineSummary').textContent='Checking files stored on this device…';
   try{const result=await check(snapshot,o.repo,{set:$('offlineSetlist').value,cancelled:()=>token!==serial||o.busy(),progress:({done,total})=>{if(token!==serial)return;$('offlineProgress').value=total?done/total:1;$('offlineSummary').textContent='Checking local audio · '+done+' / '+total+' files'}});if(token!==serial)return;if(signature!==JSON.stringify(o.state()))throw Error('The library changed during the check. Run it again.');
    const audioSongs=result.rows.length-result.lyricsOnly;$('offlineSummary').textContent=result.missing?result.name+' · '+result.missing+' audio file(s) missing on this device.':audioSongs?result.name+' · All '+result.files+' required audio files are stored locally.':result.name+' · Lyrics only: no backing audio files to check.';$('offlineSummary').dataset.result=result.missing?'missing':audioSongs?'local':'lyrics';
    $('offlineRows').innerHTML=result.rows.map(r=>'<section class="offline-song" data-status="'+r.status+'"><h3>'+esc(r.title)+'</h3><strong>'+({local:'✓ Audio stored locally',lyrics:'Lyrics only · no audio attached',missing:'Audio missing'}[r.status])+'</strong>'+(r.missing.length?'<ul>'+r.missing.map(m=>'<li>'+esc(m.track)+(m.file?' · '+esc(m.file):'')+' — '+esc(m.reason)+'</li>').join('')+'</ul>':'<p>'+r.tracks+' audio track(s)</p>')+'</section>').join('');
   }catch(e){if(token===serial){$('offlineSummary').textContent=e.message;$('offlineSummary').dataset.result='missing'}}finally{if(token===serial)stop()}
  }
  function open(){if(!dialog.open){stop();const state=o.state();$('offlineSetlist').innerHTML='<option value="">ALL SONGS</option>'+Object.keys(state.sets||{}).map(name=>'<option value="'+esc(name)+'">'+esc(name)+'</option>').join('');$('offlineSetlist').value=state.set||'';$('offlineRows').innerHTML='';$('offlineSummary').textContent='Choose a setlist and press CHECK NOW.';delete $('offlineSummary').dataset.result;dialog.showModal()}}
  $('offlineRun').onclick=run;$('offlineClose').onclick=()=>dialog.close();$('offlineCancel').onclick=()=>{stop();$('offlineSummary').textContent='Check cancelled. Run it again when you are ready.'};dialog.addEventListener('close',stop);$('offlineSetlist').onchange=()=>{$('offlineRows').innerHTML='';$('offlineSummary').textContent='Press CHECK NOW to check this setlist.';delete $('offlineSummary').dataset.result};doc.addEventListener('click',e=>{if(e.target.closest('[data-offline-check]'))open()});return {open,check:run};
 }
 root.StageOffline={check,mount};
})(typeof window!=='undefined'?window:globalThis);
