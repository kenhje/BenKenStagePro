(function(root){
 'use strict';const app=root.BenKenApp;if(!app)return;
 const ready=new Set(),retry=new Map();let active=null,work=null,clearing=false,lastInteraction=Date.now(),message='';
 const supported=()=>root.BenKenMainAudio?.automaticCache===true&&app.mixer.player.native===true;
 const post=payload=>root.webkit.messageHandlers.benkenNativePlayer.postMessage(payload);
 const signature=song=>JSON.stringify([root.StageProject.tracks(song),root.StageTempo.ratio(song),root.StageTranspose.config(song),app.mixer.player.mode]);
 function status(){return message||(!supported()?'Automatic audio preparation and Clear cache require Native V27.31 with the Native engine.':'Audio prepares automatically after 15 seconds without interaction, with playback stopped.')}
 function draw(){document.querySelectorAll('[data-audio-cache-status]').forEach(e=>{if(e.textContent!==status())e.textContent=status()});document.querySelectorAll('[data-clear-audio-cache]').forEach(e=>{e.disabled=clearing||!supported()})}
 function pause(){lastInteraction=Date.now();active?.abort()}
 function idle(){return supported()&&!clearing&&!document.hidden&&!app.mixer.player.playing&&!app.mixer.click?.running&&!app.mixer.busy()&&!document.querySelector('dialog[open],body.settings-open')&&Date.now()-lastInteraction>=15000}
 async function tick(){
  draw();if(work||!idle())return;
  const song=app.state().songs.find(song=>{if(!root.StageProject.tracks(song).length)return false;const key=signature(song);return !ready.has(key)&&(retry.get(key)||0)<Date.now()});if(!song)return;
  const copy=structuredClone(song),opts=structuredClone(app.state().opts),key=signature(copy),controller=new AbortController();active=controller;
  work=(async()=>{try{
   message='Preparing '+copy.title+'…';draw();
   await root.StageNativeAudio.warm(copy,app.mixer.repo,opts,{mode:app.mixer.player.mode,automatic:true,signal:controller.signal,cancelled:()=>controller.signal.aborted||!idle()||signature(song)!==key});
   if(!controller.signal.aborted&&signature(song)===key)ready.add(key);
   message='Audio prepares automatically while idle. '+ready.size+' song versions ready this session.';
  }catch(error){if(controller.signal.aborted||error.name==='AbortError'){message='Audio preparation resumes while idle.'}else{retry.set(key,Date.now()+60000);message='Waiting to prepare '+copy.title+'. '+error.message}}
  finally{if(active===controller)active=null;work=null;draw()}})();
 }
 async function clear(){
  if(clearing||!supported())return;
  if(app.mixer.player.playing||app.mixer.click?.running||app.mixer.busy()){message='Stop playback and wait for audio loading before clearing the cache.';draw();return}
  clearing=true;pause();message='Clearing playback copies…';draw();
  try{await work;app.mixer.cancel();const value=await post({command:'audioCacheClear'});if(!value.cleared)throw Error('Cache could not be cleared.');ready.clear();retry.clear();await app.mixer.prepare();message='Cache cleared. Songs, imported audio and setlists are kept. Playback copies rebuild automatically while idle.'}
  catch(error){message=error.message}
  finally{clearing=false;lastInteraction=Date.now();draw()}
 }
 document.addEventListener('pointerdown',pause,true);document.addEventListener('keydown',pause,true);document.addEventListener('visibilitychange',pause);
 root.addEventListener('benken-audio-changed',()=>{pause();ready.clear();retry.clear()});
 document.addEventListener('click',e=>{if(e.target.closest('[data-clear-audio-cache]'))clear()});
 root.setInterval(tick,1000);
 root.StageConcertCache={VERSION:'26.134',busy:()=>clearing,status:()=>({supported:supported(),preparing:!!active,clearing,ready:ready.size,message:status()})};
})(window);
