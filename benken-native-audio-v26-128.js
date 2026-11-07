(function(root){
 'use strict';
 const available=()=>(root.BenKenMainAudio?.protocol===1||['27.6','27.7','27.8'].includes(root.BenKenMainAudio?.version))&&!!root.webkit?.messageHandlers?.benkenNativePlayer;
 const post=payload=>root.webkit.messageHandlers.benkenNativePlayer.postMessage(payload);
 const now=()=>Date.now()/1000;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number(v)||0));
 class NativePlayer {
  constructor({notify=()=>{},mode,host}){
   this.native=true;this.supportsTrackEQ=root.BenKenMainAudio?.trackEQ===true;this.notify=notify;this.host=host;this.mode=mode==='stereo'?'stereo':'usb';this.tracks=[];this.buffers=[];this.info=new Map();this.duration=0;this.sourceDuration=0;this.position=0;this.playing=false;this.preparing=false;this.preparationProgress=null;this.preparationStarted=0;this.loadError='';this.generation=0;this.channels=2;this.reportedChannels=2;this.master=1;this.globalMaster=1;this.masterMuted=false;this.muteGroups=new Set();this.buses=[];this.busNodes=new Map();this.nodes=[];this.decodedBytes=0;this.requiredBytes=0;this.cacheHits=0;this.masterFX={enabled:false};this.compressorReduction=0;this.startOffset=0;this.startTime=0;this.transportState='stopped';this.sampledAt=now();this._token='';this._control=Promise.resolve();this._polling=false;this._mixKey='';this._endSerial=0;this._counting=false;this._playSerial=0;this._metersAvailable=false;this._outputPeak=0;this._trackPeaks=new Map();this._meterSampledAt=0;this._lastPoll=0;
   this.regions={active:null,pending:null,clear(){this.active=null},snapshot(){return {active:null,queued:null,finishing:false,at:null}},tick(){},settle(){},arm(value){if(value)throw Error('Region looping is not available in the main native test yet.');this.active=null},prepare(){return null},windows(){return []}};
   root.document?.addEventListener?.('visibilitychange',()=>{if(root.document.hidden&&this._token&&available())post({command:'audioState',meters:false}).catch(()=>{})});
   const self=this;this.context={get currentTime(){return now()},state:'running',sampleRate:48000,resume:async()=>{},destination:{get maxChannelCount(){return self.reportedChannels},get channelCount(){return self.channels}}};
  }
  configure(){return this.context}
  ensure(){return this.context}
  get currentTime(){return this.playing?Math.min(this.stopAt??this.duration,this.position+Math.max(0,now()-this.sampledAt-(this._countRemaining||0))):this.position}
  get countingIn(){return this.playing&&now()<this.sampledAt+(this._countRemaining||0)}
  routeError(tracks=this.tracks){for(const t of tracks){const b=t.bus?this.buses.find(b=>b.id===t.bus):t;if(!b)return 'Missing output bus for '+t.name;if(this.mode==='usb'&&(b.output<1||b.output+(b.stereo?1:0)>this.reportedChannels))return 'The audio device does not provide the selected USB outputs.'}return ''}
  preparedAudio(){return null}
  async waveform(index){
   if(!root.BenKenMainAudio?.waveform)throw Error('Install Native V27.28 to display the waveform.');
   const token=this._token,generation=this.generation,track=this.tracks[index];if(!track||this.playing||this.preparing)return null;
   const value=await post({command:'audioWaveform',token,track:track.id});
   if(token!==this._token||generation!==this.generation||value.token!==token||this.playing)return null;
   const peaks=value.peaks;if(!Array.isArray(peaks)||peaks.length<2||peaks.length>2000||peaks.some(v=>!Number.isFinite(v)||v<0))throw Error('Native waveform data is invalid.');return peaks;
  }

  _accept(state,token=this._token){
   if(!token||token!==this._token||state.token!==token)return false;
   this.click?.accept?.(state);const wasPlaying=this.playing;this.position=state.position||0;this.duration=state.duration||0;this.sourceDuration=state.sourceDuration||this.sourceDuration;this.sampledAt=now();this._countRemaining=state.countRemaining||0;this.playing=!!state.playing;this.channels=state.channels||2;this.reportedChannels=state.availableChannels||this.channels;
   this._trackPeaks=new Map((Array.isArray(state.trackMeters)?state.trackMeters:[]).filter(t=>typeof t.id==='string'&&Number.isFinite(t.peak)&&t.peak>=0).map(t=>[t.id,t.fresh===false?0:t.peak]));
   this._metersAvailable=state.meters?.available===true;this._outputPeak=state.meters?.fresh===false?0:Number.isFinite(Number(state.meters?.peak))?Math.max(0,Number(state.meters.peak)):0;this._meterSampledAt=now();
   if(state.error){this.loadError=state.error;this.playing=false;this.notify({error:state.error})}
   if(state.ended&&state.endSerial!==this._endSerial){this._endSerial=state.endSerial;this.transportState='stopped';this.notify({playing:false,ended:true,practiceEnd:!!state.practiceEnd})}
   else if(wasPlaying!==this.playing)this.notify({playing:this.playing});
   return true;
  }
  async load(tracks,repo,ratio=1,transpose=0){
   this.cancel();const generation=this.generation,token=root.crypto.randomUUID();this._token=token;this.tracks=tracks;this.tempoRatio=ratio;this.transpose=transpose;this.preparing=true;this.preparationProgress=null;this.preparationStarted=now();this.notify({loading:true});
   const current=()=>generation===this.generation&&token===this._token;
   try{
    if(!available())throw Error('Install Native Test V27.6 to use the native audio engine.');
    if(!tracks.length){this.preparing=false;return true}
    const song=structuredClone(this.host.song()||{title:'Audio test'}),opts=structuredClone(this.host.state().opts),original=song.playback?.tempo?.originalBpm||root.StageTempo.metadata(song)||120;
    song.playback={...song.playback,tracks:structuredClone(tracks),tempo:{originalBpm:original,targetBpm:original*ratio},transpose};
    const state={songs:[song],sets:{},set:'',idx:0,opts};const assets=[];let copied=0;
    for(const id of new Set(tracks.map(t=>t.assetId))){const file=await repo.get(id);if(!current())return false;const size=file?.data?.byteLength??file?.data?.size;if(!size){const track=tracks.find(t=>t.assetId===id);throw Object.assign(Error('Audio file «'+track.name+'» is missing locally.'),{code:'MISSING_AUDIO_FILE',assetId:id,trackId:track.id})}assets.push({id,name:file.name||'audio.mp3',size});this.info.set(id,{name:file.name,bytes:size})}
    const totalBytes=assets.reduce((n,a)=>n+a.size,0);
    await post({command:'audioBegin',token,state:JSON.stringify(state),assets});if(!current())return false;
    for(let i=0;i<assets.length;i++){
     const asset=assets[i],file=await repo.get(asset.id);if(!current())return false;
     const blob=file.data instanceof Blob?file.data:new Blob([file.data]);if(blob.size!==asset.size)throw Error('Audio changed while loading. Prepare the song again.');
     this.preparationMessage='Native: copying '+(i+1)+' / '+assets.length;this.notify({message:this.preparationMessage});
     for(let offset=0;offset<blob.size;offset+=262144){if(!current())return false;const bytes=new Uint8Array(await blob.slice(offset,offset+262144).arrayBuffer());let binary='';for(let n=0;n<bytes.length;n+=8192)binary+=String.fromCharCode(...bytes.subarray(n,n+8192));await post({command:'audioChunk',token,asset:asset.id,offset,data:root.btoa(binary)});if(!current())return false;copied+=bytes.length;this.preparationProgress=copied/totalBytes;this.preparationMessage='Copying local audio · file '+(i+1)+' / '+assets.length;this.notify({message:this.preparationMessage})}
    }
    if(!current())return false;this.preparationProgress=null;this.preparationMessage='Verifying local audio…';this.notify({message:this.preparationMessage});
    let progressBusy=false;const timer=root.setInterval(async()=>{if(progressBusy||!current())return;progressBusy=true;try{const state=await post({command:'audioState',meters:false});if(current()&&state.token===token&&state.preparing){this.preparationProgress=state.preparationPhase&&Number.isFinite(state.preparationProgress)?clamp(state.preparationProgress,0,1):null;this.preparationMessage=state.preparationPhase||'Preparing tempo and key…';this.notify({message:this.preparationMessage})}}catch{}finally{progressBusy=false}},400);
    let result;try{result=await post({command:'audioFinish',token,stereo:this.mode==='stereo'})}finally{root.clearInterval(timer)};if(!current())return false;this._accept(result,token);if(!result.ready)throw Error(result.error||'Native audio could not be prepared.');
    this.buffers=tracks.map(t=>({duration:this.duration,numberOfChannels:t.stereo?2:1,native:true}));this.preparing=false;this.preparationProgress=null;this.preparationMessage='';this._mixKey='';await this.flushMix();this.notify({ready:true});return true;
   }catch(error){if(current()){this.preparing=false;this.preparationProgress=null;this.retryableError=true;this.playing=false;this.loadError=error.message;this.buffers=[];this.duration=0;this.notify({error:error.message});post({command:'audioCancel',token}).catch(()=>{});throw error}return false}
  }
  async refreshOutputs(){
   if(this.playing||this.preparing)throw Error('Stop playback before refreshing outputs.');
   if(parseFloat(root.BenKenMainAudio?.appVersion||'0')<27.25)throw Error('Install Native V27.25 to refresh USB outputs.');
   this.preparing=true;this.preparationProgress=null;this.preparationStarted=now();this.preparationMessage='Refreshing audio outputs…';this.notify({loading:true});
   try{const state=await post({command:'audioRefreshOutput',token:this._token});this.reportedChannels=state.availableChannels||state.channels||2;if(this._token&&state.token===this._token)this._accept(state);this.loadError='';this.retryableError=false;this._mixKey='';}
   catch(e){this.loadError=e.message;this.retryableError=true;throw e}
   finally{this.preparing=false;this.preparationProgress=null;this.preparationMessage='';this.notify({updated:true})}
   await this.flushMix();
  }
  _mix(){return {tracks:this.tracks,master:this.master,opts:{audioBuses:this.buses,masterGain:this.globalMaster,masterMuted:this.masterMuted,mutedGroups:[...this.muteGroups]}}}
  async flushMix(){
   if(this.preparing||!this.buffers.length||!this._token)return;
   const mix=this._mix(),key=JSON.stringify(mix);if(key===this._mixKey)return;const token=this._token;
   await post({command:'audioMix',token,...mix});if(token===this._token)this._mixKey=key;
  }
  _queueMix(){if(this._mixTimer)return;this._mixTimer=root.setTimeout(()=>{this._mixTimer=null;this._control=this._control.catch(()=>{}).then(()=>this.flushMix()).catch(error=>{this.pause();this.loadError=error.message;this.notify({error:error.message})})},50)}
  async play({delay=0,onScheduled,stopAt=null}={}){
   if(this.preparing||!this.buffers.length||this.loadError)return;
   const serial=++this._playSerial,token=this._token;await this._control.catch(()=>{});await this.flushMix();if(serial!==this._playSerial||token!==this._token)return;
   const cfg=root.StageClick.config(this.host.song()),bus=this.buses.find(b=>b.id===cfg.bus),count=delay>0?Math.round(delay*cfg.bpm/60/cfg.beatsPerBar):0;
   const click={...cfg,countInBars:count,output:bus?.output||3,volume:(bus?.mute||this.masterMuted)?0:clamp(cfg.volume*(bus?.gain??1)*this.master*this.globalMaster,0,1)};
   this.startOffset=this.position>=this.duration?0:this.position;this.stopAt=stopAt;const state=await post({command:'audioPlay',token,position:this.startOffset,stopAt,click,midiBpm:root.StageTempo.config(this.host.song())?.targetBpm||root.StageTempo.metadata(this.host.song())||cfg.bpm});
   if(serial!==this._playSerial||token!==this._token)return;this._accept(state,token);this.startTime=now()+(state.countRemaining||0);this.transportState='playing';onScheduled?.(this.startTime);this.notify({playing:this.playing});
  }
  _command(command,position){
   const token=this._token;if(!token)return;const serial=++this._playSerial;this.seekSerial=(this.seekSerial||0)+1;this.playing=false;this._outputPeak=0;this.position=position;this.sampledAt=now();this._countRemaining=0;
   const work=post({command,token});this._control=work.then(state=>{if(serial===this._playSerial)this._accept(state,token)}).catch(error=>{if(token===this._token){this.loadError=error.message;this.notify({error:error.message})}});return this._control;
  }
  pause(){const at=this.currentTime;this.click?.stop();this.transportState='paused';this._command('audioPause',at);this.notify({playing:false})}
  stop(){this.click?.stop();this.stopAt=null;this.regions.clear();this.transportState='stopped';this._command('audioStop',0);this.notify({stopped:true})}
  cancel(){const token=this._token;this._playSerial++;this.generation++;this._token='';this.playing=false;this._outputPeak=0;this._metersAvailable=false;this.preparing=false;this.position=0;this.duration=0;this.sourceDuration=0;this.buffers=[];this.tracks=[];this.info.clear();this.loadError='';this.preparationMessage='';this._mixKey='';this._countRemaining=0;this.click?.stop();if(token&&available())post({command:'audioCancel',token}).catch(()=>{});this.notify({stopped:true})}
  async seek(seconds,resume=this.playing,{stopAt=null,countInBars=0,delay=0,onScheduled}={}){const value=Number(seconds);if(!Number.isFinite(value)||this.preparing||!this.buffers.length)return false;await this._command('audioPause',clamp(value,0,this.duration));this.position=clamp(value,0,this.duration);this.notify({seeked:true,position:this.position});if(resume&&this.position<this.duration)await this.play({stopAt,delay,onScheduled});return true}
  update(tracks){this.tracks=tracks;this._queueMix()}
  setBuses(buses){this.buses=buses;this._queueMix()}
  setMaster(value){this.master=clamp(value,0,2);this._queueMix()}
  setGlobalMaster(value){this.globalMaster=clamp(value,0,2);this._queueMix()}
  setMasterMuted(value){this.masterMuted=!!value;this._queueMix()}
  setMuteGroups(value){this.muteGroups=new Set(value);this._queueMix()}
  groupMuted(track){return (track.muteGroups||[]).some(g=>this.muteGroups.has(g))}
  setMasterFX(value){this.masterFX={...value,enabled:false};return this.masterFX}
  setMode(mode){if(this.playing)throw Error('Stop playback first.');this.mode=mode==='stereo'?'stereo':'usb';this.buffers=[];this.duration=0;this.loadError='Output changed. Press PREPARE AUDIO.'}
  meters(){return this.tracks.map(t=>this.playing&&now()-this._meterSampledAt<.6?this._trackPeaks.get(t.id)||0:0)} meterBuses(){const levels=this.meters(),buses=new Map();this.tracks.forEach((t,i)=>buses.set(t.bus,Math.max(buses.get(t.bus)||0,levels[i])));return buses} meterAvailable(){return this._metersAvailable} meterMaster(){return this.playing&&this._metersAvailable&&now()-this._meterSampledAt<.6?this._outputPeak:0} meterSong(){return Math.max(0,...this.meters())}
  releaseMeters(){this._outputPeak=0;} releaseBuses(){}
  tick(){if(root.document?.hidden&&root.BenKenMainAudio?.backgroundAudio===true)return;if(this._polling||!this._token||this.preparing)return;const token=this._token,serial=this._playSerial;this._polling=true;const mixer=root.document?.getElementById?.('mixerDialog'),meters=!root.document?.hidden&&!!(mixer?.open||mixer?.hasAttribute?.('open'));post({command:'audioState',meters}).then(state=>{if(serial===this._playSerial)this._accept(state,token)}).catch(error=>{if(token===this._token){this.playing=false;this.loadError=error.message;this.notify({error:error.message})}}).finally(()=>{this._polling=false})}
 }
 class NativeClick {
  constructor(player,{notify=()=>{}}={}){this.player=player;this.notify=notify;this.clock=null;this.starting=false;this.nativeRunning=false;this.serial=0}
  get active(){return this.nativeRunning||!!this.clock&&(this.clock.standalone||this.player.playing||this.player.countingIn)}
  get running(){return this.starting||this.active}
  error(cfg){return this.player.routeError([{name:'Metronome',bus:cfg.bus}])}
  accept(state){if(this.starting||this.stopping||!Object.hasOwn(state,'metronomeRunning'))return;this.nativeRunning=state.metronomeRunning===true;if(!this.nativeRunning)this.clock=null}
  beginMusic(config,start,count,offset=0){if(!count&&!config.continuous){this.clock=null;return}this.clock={config,start:start-count*60/config.bpm,count,offset};this.nativeRunning=true}
  async start(config){
   if(root.BenKenMainAudio?.metronomeToggle!==true)throw Error('Install Native V27.29 for metronome on/off.');
   if(!this.player._token||!this.player.buffers.length)throw Error('Prepare the selected song before starting the metronome.');
   const error=this.error(config);if(error)throw Error(error);
   const token=this.player._token,serial=++this.serial,bus=this.player.buses.find(b=>b.id===config.bus);this.starting=true;this.stopping=false;
   try{const state=await post({command:'audioMetronomeStart',token,click:{...config,output:bus?.output||1,volume:bus?.mute||this.player.masterMuted?0:clamp(config.volume*(bus?.gain??1)*this.player.master*this.player.globalMaster,0,1)}});
    if(serial!==this.serial||token!==this.player._token)return false;
    this.nativeRunning=state.metronomeRunning===true;this.clock=this.nativeRunning?{config,start:now()+(state.metronomeDelay||0),count:0,standalone:!this.player.playing}:null;return this.nativeRunning;
   }finally{if(serial===this.serial)this.starting=false}
  }
  stop(){const was=this.running,token=this.player._token,serial=++this.serial;this.clock=null;this.nativeRunning=false;this.starting=false;if(!was||!token||root.BenKenMainAudio?.metronomeToggle!==true)return;this.stopping=true;return post({command:'audioMetronomeStop',token}).catch(e=>{if(token===this.player._token&&serial===this.serial)this.notify(e.message||String(e))}).finally(()=>{this.stopping=false})}
  tick(){if(!root.BenKenMainAudio?.metronomeToggle&&(!this.player.playing||this.clock&&!this.clock.config.continuous&&!this.player.countingIn))this.clock=null}
  frame(){if(!this.active||!this.clock)return null;const {config,start,count}=this.clock,t=Math.max(0,now()-start),beats=Math.floor(t*config.bpm/60);return {beats:config.beatsPerBar,beat:beats%config.beatsPerBar,bar:Math.floor(beats/config.beatsPerBar)+1,bars:count/config.beatsPerBar,counting:this.player.countingIn,waiting:now()<start,flash:(t*config.bpm/60)%1<.25}}
 }
 function mountAudioStatus({state}){
  const $=id=>document.getElementById(id),dialog=$('nativeAudioStatusDialog');let report=null;
  $('nativeAudioStatusClose').onclick=()=>dialog.close();
  $('nativeAudioStatusDownload').onclick=()=>{if(!report)return;const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='BenKen_Audio_Status.json';a.click();root.setTimeout(()=>URL.revokeObjectURL(url),30000)};
  const install=()=>{const slot=$('nativeAudioStatusSlot');if(!slot||$('nativeAudioStatusOpen')||!root.BenKenMainAudio?.diagnostics||state().opts.nativeAudioEnabled!==true)return;
   const button=document.createElement('button');button.id='nativeAudioStatusOpen';button.type='button';button.textContent='NATIVE AUDIO STATUS';slot.appendChild(button);
   button.onclick=async()=>{report=null;$('nativeAudioStatusSummary').textContent='Reading audio status…';$('nativeAudioStatusData').textContent='';$('nativeAudioStatusDownload').disabled=true;dialog.showModal();try{report=await post({command:'audioDiagnostics'});const peak=Number(report.macStereoMixer?report.outputMixerPeak:report.mixerPeak)||0,routes=(report.route||[]).map(r=>r.name).join(', ');$('nativeAudioStatusSummary').textContent=['Native '+(report.nativeVersion||''),...(report.lastAudioError?['Last audio error: '+report.lastAudioError]:[]),'Output: '+(routes||'Not reported'),'Engine: '+(report.engineRunning?'running':'stopped'),'Playback: '+(report.playing?'playing':'stopped'),report.countingIn?'Count-in is running':report.signalProbesEnabled===false?'Continuous signal measurement is off to reduce playback load.':'Signal after Native output mix (sampled): '+(peak>0.000001?(20*Math.log10(peak)).toFixed(1)+' dBFS':'no signal measured'),...(report.macStereoMixer&&Object.hasOwn(report,'outputMixerPeak')?['Signal after Mac mixer: '+(report.outputMixerPeak>0.000001?(20*Math.log10(report.outputMixerPeak)).toFixed(1)+' dBFS':'no signal measured')]:[]),'Rendered frames: '+((report.macStereoMixer?report.outputRenderedFrames:report.renderedFrames)||0)].join('\n');$('nativeAudioStatusData').textContent=JSON.stringify(report,null,2);$('nativeAudioStatusDownload').disabled=false}catch(e){$('nativeAudioStatusSummary').textContent=e.message||String(e)}};
  };
  new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});install();
 }
 root.StageNativeAudio={VERSION:'26.128',available,Player:NativePlayer,Click:NativeClick,mountAudioStatus};
})(typeof window!=='undefined'?window:globalThis);
