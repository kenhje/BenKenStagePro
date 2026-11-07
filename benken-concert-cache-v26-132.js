(function(root){
 'use strict';const app=root.BenKenApp;if(!app)return;
 const dialog=document.createElement('dialog');dialog.id='prepareConcertDialog';dialog.className='offline-setlist-dialog';dialog.setAttribute('aria-labelledby','prepareConcertTitle');
 dialog.innerHTML='<div class="offline-heading"><h2 id="prepareConcertTitle">Prepare concert</h2><button type="button" id="prepareConcertClose">Done</button></div><p>Prepare a whole setlist before your rehearsal or show. Audio stays on this device, ready to reuse when you change songs.</p><label>Setlist<select id="prepareConcertSet"></select></label><p id="prepareConcertRequirement"></p><div class="offline-actions"><button type="button" id="prepareConcertRun">PREPARE SETLIST</button><button type="button" id="prepareConcertCancel" hidden>CANCEL</button></div><progress id="prepareConcertProgress" max="1" value="0" hidden aria-label="Concert preparation progress"></progress><p id="prepareConcertStatus" role="status" aria-live="polite">Choose a setlist to prepare.</p><div id="prepareConcertRows"></div><p class="offline-foot">Run this before performing, with playback stopped. The first preparation can take time and uses device storage. New files, tempo, key or track-format changes need preparation again. This prepares disk files; it does not promise a gapless transition. Test your set and audio output before the show.</p>';
 document.body.append(dialog);const $=id=>document.getElementById(id);let running=false,cancelled=false;
 const supported=()=>root.BenKenMainAudio?.concertCache===true&&app.mixer.player.native===true;
 function controls(){ $('prepareConcertRun').disabled=running||!supported();$('prepareConcertClose').disabled=running;$('prepareConcertSet').disabled=running;$('prepareConcertCancel').hidden=!running;$('prepareConcertCancel').disabled=cancelled;$('prepareConcertProgress').hidden=!running }
 function open(){if(dialog.open)return;app.closeSettings();if(document.querySelector('dialog[open]'))return;const state=app.state(),select=$('prepareConcertSet');select.replaceChildren();for(const name of Object.keys(state.sets||{})){const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option)}select.value=state.set||Object.keys(state.sets||{})[0]||'';cancelled=false;controls();$('prepareConcertRows').replaceChildren();$('prepareConcertStatus').textContent='Choose a setlist to prepare.';$('prepareConcertRequirement').textContent=supported()?'Native V27.30 · local concert preparation':'Requires Native V27.30 or newer with the native audio engine enabled. Existing songs and playback remain available.';dialog.showModal()}
 async function run(){
  if(running||!supported())return;const mixer=app.mixer;if(mixer.busy()||mixer.player.playing||mixer.click?.running){$('prepareConcertStatus').textContent='Stop playback and wait for the current song to finish preparing first.';return}
  const snapshot=structuredClone(app.state()),signature=JSON.stringify(snapshot),name=$('prepareConcertSet').value,order=snapshot.sets?.[name];
  if(!order?.length){$('prepareConcertStatus').textContent='Choose a setlist with songs first.';return}
  running=true;cancelled=false;controls();$('prepareConcertProgress').value=0;$('prepareConcertRows').replaceChildren();let ready=0;
  try {
   const indices=[...new Set(order)];
   for(let i=0;i<indices.length;i++){
    if(cancelled)throw Error('Preparation cancelled. Completed songs remain saved on this device.');
    if(signature!==JSON.stringify(app.state()))throw Error('The library or playback settings changed. Run preparation again.');
    const song=snapshot.songs[indices[i]];if(!song)throw Error('This setlist contains a missing song.');
    const row=document.createElement('p');row.textContent=song.title+' · Preparing…';$('prepareConcertRows').append(row);
    const tracks=root.StageProject.tracks(song);
    if(tracks.length)await root.StageNativeAudio.warm(song,mixer.repo,snapshot.opts,{mode:mixer.player.mode,cancelled:()=>cancelled,progress:text=>{$('prepareConcertStatus').textContent=(i+1)+' / '+indices.length+' · '+song.title+' · '+text}});
    if(cancelled)throw Error('Preparation cancelled. Completed songs remain saved on this device.');
    if(signature!==JSON.stringify(app.state()))throw Error('The library or playback settings changed. Run preparation again.');
    row.textContent=song.title+(tracks.length?' · Ready on this device':' · Lyrics only');ready++;$('prepareConcertProgress').value=ready/indices.length;
   }
   $('prepareConcertStatus').textContent=name+' · '+ready+' songs ready on this device. New or changed audio/settings need preparation again.';
  }catch(error){$('prepareConcertStatus').textContent=cancelled?'Preparation cancelled. Completed songs remain saved on this device.':error.message}
  finally{running=false;cancelled=false;controls()}
 }
 $('prepareConcertRun').onclick=run;$('prepareConcertClose').onclick=()=>dialog.close();$('prepareConcertCancel').onclick=()=>{cancelled=true;$('prepareConcertStatus').textContent='Cancelling…';controls()};
 dialog.addEventListener('cancel',e=>{if(running){e.preventDefault();cancelled=true;controls()}});
 document.addEventListener('click',e=>{if(e.target.closest('[data-prepare-concert]'))open()});root.StageConcertCache={VERSION:'26.132',open,busy:()=>running};
})(window);
