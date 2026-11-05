(function(root){
'use strict';
const VERSION='26.112',NOTES=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
function pitch(samples,sampleRate){
 if(samples.length>4096){const recent=samples.subarray?samples.subarray(samples.length-4096):samples.slice(-4096),fast=pitchWindow(recent,sampleRate);if(fast>=65)return fast;}
 return pitchWindow(samples,sampleRate);
}
function pitchWindow(samples,sampleRate){
 if(samples.length>8192)samples=samples.subarray?samples.subarray(samples.length-8192):samples.slice(-8192);
 const stride=Math.max(1,Math.floor(sampleRate/12000)),n=Math.floor(samples.length/stride),data=new Float64Array(n);let mean=0;
 if(n<128||!Number.isFinite(sampleRate)||sampleRate<=0)return null;
 for(let i=0;i<n;i++){let sum=0;for(let j=0;j<stride;j++)sum+=samples[i*stride+j];data[i]=sum/stride;mean+=data[i]}mean/=n;
 let energy=0;for(let i=0;i<n;i++){data[i]-=mean;energy+=data[i]*data[i]}if(Math.sqrt(energy/n)<.0003)return null;
 const rate=sampleRate/stride,window=Math.min(768,Math.floor(n/2)),max=Math.min(window-1,Math.floor(rate/30)),min=Math.max(2,Math.floor(rate/2000)),difference=new Float64Array(max+1),coarseOffset=n-window-max-1;let running=0;difference[0]=1;
 for(let tau=1;tau<=max;tau++){let sum=0;for(let i=0;i<window;i++){const d=data[coarseOffset+i]-data[coarseOffset+i+tau];sum+=d*d}running+=sum;difference[tau]=running?sum*tau/running:1;}
 let tau=min;for(;tau<max;tau++)if(difference[tau]<.20){while(tau+1<max&&difference[tau+1]<difference[tau])tau++;break}if(tau>=max||difference[tau]>.20)return null;
 const a=difference[tau-1],b=difference[tau],c=difference[tau+1],denominator=a-2*b+c,adjustment=denominator?(a-c)/(2*denominator):0,coarse=rate/(tau+Math.max(-1,Math.min(1,adjustment)));
 // Refine using a multi-period lag at the original sample rate, avoiding decimation bias.
 const period=sampleRate/coarse,cycles=Math.max(1,Math.min(4,Math.floor(samples.length*.3/period))),expected=period*cycles,radius=Math.max(3,Math.ceil(stride*cycles*.65)),center=Math.round(expected),length=Math.min(Math.floor(samples.length/2),Math.max(1024,Math.ceil(period*6))),scores=[];
 const sampleOffset=Math.max(0,samples.length-length-Math.min(samples.length-length-1,center+radius)-1);let best=center,bestScore=-Infinity;
 for(let lag=Math.max(1,center-radius);lag<=Math.min(samples.length-length-1,center+radius);lag++){let xy=0,xx=0,yy=0;for(let i=0;i<length;i++){const x=samples[sampleOffset+i]-mean,y=samples[sampleOffset+i+lag]-mean;xy+=x*y;xx+=x*x;yy+=y*y}const value=xy/Math.sqrt(xx*yy||1);scores[lag]=value;if(value>bestScore){bestScore=value;best=lag}}
 if(bestScore<.75)return null;const left=scores[best-1],middle=scores[best],right=scores[best+1],curve=left-2*middle+right,offset=Number.isFinite(curve)&&curve?(left-right)/(2*curve):0;
 const frequency=sampleRate*cycles/(best+Math.max(-1,Math.min(1,offset)));
 return Number.isFinite(frequency)&&frequency>=30&&frequency<=2000?frequency:null;
}
function note(frequency,reference=440){if(!Number.isFinite(frequency)||frequency<=0||!Number.isFinite(reference)||reference<400||reference>480)return null;const value=69+12*Math.log2(frequency/reference),midi=Math.round(value);return {name:NOTES[((midi%12)+12)%12],octave:Math.floor(midi/12)-1,cents:100*(value-midi),frequency,midi};}
function mount(o){
 const dialog=document.createElement('dialog');dialog.id='tunerDialog';dialog.className='tool-dialog';dialog.setAttribute('aria-labelledby','tunerTitle');dialog.innerHTML='<div class="tool-heading"><h2 id="tunerTitle">Tuner</h2><button type="button" id="tunerClose">Done</button></div><div class="tuner-card"><div class="tuner-reading"><div><strong id="tunerNote">—</strong><span id="tunerOctave"></span></div><div id="tunerFrequency">Microphone is off</div></div><div class="tuner-meter" aria-hidden="true"><div class="tuner-scale"><span></span><div id="tunerNeedle"></div></div><div class="tuner-scale-labels"><span>♭ FLAT</span><span>IN TUNE</span><span>SHARP ♯</span></div></div><output id="tunerCents">Play one note</output><div id="tunerDirection">One string at a time</div></div><label class="tuner-shortcut menu-toggle-row"><input id="tunerShortcut" type="checkbox"> Show Tuner above Capo &amp; Key</label><div class="tuner-reference"><button type="button" id="tunerReferenceDown" aria-label="Lower reference pitch">−</button><label>A4 <input type="number" id="tunerReference" min="400" max="480" step="1" value="440" aria-label="Reference pitch in Hz"> Hz</label><button type="button" id="tunerReferenceUp" aria-label="Higher reference pitch">+</button></div><div id="tunerStatus" role="status" aria-live="polite">Uses the microphone. Audio is analysed on this device and is not recorded or uploaded.</div><div class="tuner-method">YIN + full-rate refinement · Play one string at a time. Stop song playback before tuning.</div>';
 document.body.append(dialog);const $=id=>document.getElementById(id);let context=null,stream=null,source=null,analyser=null,timer=null,serial=0,starting=false,nativeMode=false,silentGain=null,history=[],pending=null,stable=null,lastGood=0,lastSequence=null;
 function reading(result){const tuned=!!result&&Math.abs(result.cents)<=(dialog.dataset.tuned==='true'?3.5:2.5);$('tunerNote').textContent=result?.name||'—';$('tunerOctave').textContent=result?.octave??'';$('tunerCents').textContent=result?(result.cents>0?'+':'')+result.cents.toFixed(1)+' cents':'Play one note';$('tunerFrequency').textContent=result?result.frequency.toFixed(1)+' Hz':(stream||nativeMode)?'Listening…':'Microphone is off';$('tunerNeedle').style.left=(50+Math.max(-48,Math.min(48,(result?.cents||0)*.96)))+'%';dialog.dataset.tuned=tuned?'true':'false';$('tunerDirection').textContent=result?(tuned?'In tune':result.cents<0?'Tune up ↑':'Tune down ↓'):'One string at a time';}
 const nativePost=payload=>root.webkit.messageHandlers.benkenNativePlayer.postMessage(payload);
 async function stop(message='Microphone is off.'){
  const wasActive=!!(context||stream||starting||nativeMode),wasNative=nativeMode;serial++;starting=false;nativeMode=false;root.clearTimeout(timer);timer=null;source?.disconnect();source=null;silentGain?.disconnect();silentGain=null;analyser=null;stream?.getTracks().forEach(t=>t.stop());stream=null;const previous=context;context=null;
  await previous?.close().catch(()=>{});if(wasNative)await nativePost({command:'tunerStop'}).catch(()=>{});else if(wasActive)root.webkit?.messageHandlers?.benkenMIDI?.postMessage?.({command:'restorePlaybackAudio'});
  history=[];pending=null;stable=null;lastSequence=null;reading(null);$('tunerStatus').textContent=message;
 }
 function showSample(hz,level,sequence){
 if(sequence!=null&&sequence===lastSequence)return;lastSequence=sequence;
 const ref=Number($('tunerReference').value),result=hz?note(hz,ref):null,now=Date.now();
 if(!result){if(now-lastGood>250){history=[];stable=null;pending=null;reading(null);}return;}
 if(!pending||pending.midi!==result.midi)pending={midi:result.midi,count:0};pending.count++;
 const required=stable&&Math.abs(stable.midi-result.midi)===12?3:2;if(pending.count<required)return;
 history=history.filter(r=>r.midi===result.midi);history.push(result);history=history.slice(-3);const sorted=history.map(r=>r.frequency).sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];
 const close=stable?.midi===result.midi&&Math.abs(result.cents-stable.cents)<8;const smoothed=close?stable.frequency*.15+result.frequency*.85:stable?.midi===result.midi?stable.frequency*.2+median*.8:median;stable=note(smoothed,ref);lastGood=now;reading(stable);
 }
 function sample(){if(!analyser||!context||!stream||!dialog.open)return;const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);const level=Math.sqrt(data.reduce((sum,v)=>sum+v*v,0)/data.length);showSample(pitch(data,context.sampleRate),level);timer=root.setTimeout(sample,50);}
 async function nativeSample(token){if(!nativeMode||token!==serial||!dialog.open)return;try{const status=await nativePost({command:'tunerStatus'});if(token!==serial)return;if(!status.running){await stop('Native microphone stopped. Close and reopen the tuner to reconnect.');return;}showSample(Number(status.frequency)||0,Number(status.level)||0,status.sequence);$('tunerStatus').textContent='Microphone access OK · '+(status.input||'Native microphone')+(status.channel?' · channel '+status.channel:'');if(!Number(status.frequency)&&Number(status.level)>.0003)$('tunerFrequency').textContent='Signal received — hold one steady note';timer=root.setTimeout(()=>nativeSample(token),50);}catch(error){if(token===serial)await stop(error.message);}}
 async function start(){if(starting||stream||nativeMode)return;const token=++serial;try{
  if(o.busy())throw Error('Stop playback and wait for audio preparation first.');starting=true;$('tunerStatus').textContent='Requesting microphone access…';
  if(root.BenKenMainAudio?.nativeTuner===true){nativeMode=true;await nativePost({command:'tunerStart'});if(token!==serial||!dialog.open)return;starting=false;nativeSample(token);return;}
  if(root.BenKenMainAudio?.available)throw Error('Microphone tuner requires the newer Xcode app. Installed Native: '+(root.BenKenMainAudio.appVersion||'unknown')+'. Build Native V27.16 on this device; updating web files alone does not update microphone support.');
  if(!root.navigator?.mediaDevices?.getUserMedia)throw Error('Microphone access is unavailable. Open the secure app address in Safari.');
  // Ask for microphone access before awaiting AudioContext.resume (which can stall in WebKit).
  const captured=await root.navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  if(token!==serial||!dialog.open){captured.getTracks().forEach(t=>t.stop());return;}stream=captured;
  const AudioContext=root.AudioContext||root.webkitAudioContext;context=new AudioContext();source=context.createMediaStreamSource(stream);analyser=context.createAnalyser();analyser.fftSize=8192;silentGain=context.createGain();silentGain.gain.value=0;source.connect(analyser);analyser.connect(silentGain);silentGain.connect(context.destination);await context.resume();if(token!==serial)return;
  starting=false;$('tunerStatus').textContent='Listening · '+(stream.getAudioTracks()[0]?.label||'Microphone');stream.getAudioTracks()[0]?.addEventListener('ended',()=>{if(stream)stop('Microphone disconnected. Close and reopen the tuner to reconnect.')},{once:true});sample();
 }catch(error){if(token===serial)await stop(error.name==='NotAllowedError'?'Microphone access was not allowed. Open Settings → Privacy & Security → Microphone and enable BenKen, then try again.':error.message);}}
 function reference(value){const v=Math.max(400,Math.min(480,Math.round(Number(value)||440)));$('tunerReference').value=v;const opts=o.state().opts,previous=opts.tunerReference;opts.tunerReference=v;if(o.save()===false){opts.tunerReference=previous;$('tunerReference').value=previous||440;}history=[];stable=null;pending=null;}
 $('tunerReference').onchange=e=>reference(e.target.value);$('tunerReferenceDown').onclick=()=>reference(Number($('tunerReference').value)-1);$('tunerReferenceUp').onclick=()=>reference(Number($('tunerReference').value)+1);$('tunerShortcut').onchange=e=>{const opts=o.state().opts,old=opts.tunerShortcut;opts.tunerShortcut=e.target.checked;if(o.save()===false){opts.tunerShortcut=old;e.target.checked=old===true;}o.shortcutChanged?.();};$('tunerClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>stop());dialog.addEventListener('cancel',()=>stop());root.addEventListener('pagehide',()=>stop());root.document.addEventListener('visibilitychange',()=>{if(root.document.hidden&&(stream||starting||nativeMode))stop('Tuner stopped while the app was in the background.')});o.subscribe?.(()=>{if((stream||starting||nativeMode)&&o.busy())stop('Tuner stopped because playback or audio preparation started.');});
 return {open(){if(o.busy()){root.alert('Stop playback and wait for audio preparation first.');return;}$('tunerReference').value=o.state().opts.tunerReference||440;$('tunerShortcut').checked=o.state().opts.tunerShortcut===true;reading(null);if(!dialog.open)dialog.showModal();return start();},stop};
}
root.StageTuner={VERSION,pitch,note,mount};
})(typeof window!=='undefined'?window:globalThis);
