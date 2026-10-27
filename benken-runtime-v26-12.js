// BenKen V26.12: one versioned runtime prevents mixed helper versions.

// stage-core.js
(function (root) {
  'use strict';
  const sectionColors={verse:'#7cd9ed',chorus:'#ffd073',bridge:'#cfacff',intro:'#8bdeac',solo:'#ffa579',outro:'#f0a9cf'};
  function valid(s){return !!(s&&Array.isArray(s.songs)&&s.songs.length<=10000&&s.sets&&typeof s.sets==='object'&&!Array.isArray(s.sets)&&s.songs.every(x=>x&&typeof x.title==='string'&&typeof x.text==='string'&&(x.scrollSpeed==null||(Number.isFinite(x.scrollSpeed)&&x.scrollSpeed>=2&&x.scrollSpeed<=120)))&&Object.entries(s.sets).every(([n,a])=>n.length<=200&&Array.isArray(a)&&a.every(i=>Number.isInteger(i)&&i>=0&&i<s.songs.length)));}
  function normalize(s){
    if(!valid(s))throw Error('Ugyldig sangbibliotek eller setliste. Ingen data er erstattet.');
    s=structuredClone(s);s.idx=Math.max(0,Math.min(Math.floor(Number(s.idx)||0),s.songs.length-1));s.set=Object.hasOwn(s.sets,s.set)?s.set:'';s.opts=s.opts&&typeof s.opts==='object'&&!Array.isArray(s.opts)?s.opts:{};
    s.songs.forEach(x=>{x.refBente=x.refBente??x.bente??0});return s;
  }
  function cloud(s){s=normalize(s);delete s.idx;delete s.set;delete s.opts.view;s.songs.forEach(x=>delete x.lastOpened);return s;}
  const signature=s=>JSON.stringify(cloud(s));
  function withSession(remote,local){
    const s=normalize(remote);if(local){s.idx=Math.max(0,Math.min(local.idx||0,s.songs.length-1));s.set=Object.hasOwn(s.sets,local.set)?local.set:'';if(local.opts?.view!=null)s.opts.view=local.opts.view;s.songs.forEach((x,i)=>{if(local.songs[i]?.title===x.title&&local.songs[i].lastOpened)x.lastOpened=local.songs[i].lastOpened})}return s;
  }
  function importBackup(current,raw){
    if(Array.isArray(raw)){if(!raw.every(s=>s&&typeof s.title==='string'&&typeof s.text==='string'))throw Error('Ugyldige sanger i filen.');return normalize({...current,songs:[...current.songs,...raw]});}
    if(raw&&Array.isArray(raw.songs)&&!raw.sets)return importBackup(current,raw.songs);return normalize(raw);
  }
  function swipe(a,b){if(!a||!b)return 0;const dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>=75&&Math.abs(dx)>Math.abs(dy)*1.7&&b.time-a.time<1200?(dx<0?1:-1):0;}
  const sectionType=v=>/chorus|refreng/i.test(v)?'chorus':/bridge|bro/i.test(v)?'bridge':/intro/i.test(v)?'intro':/solo|instrumental/i.test(v)?'solo':/outro|ending|slutt/i.test(v)?'outro':'verse';
  root.StageCore={valid,normalize,cloud,signature,withSession,importBackup,swipe,sectionColors,sectionType};
})(typeof window!=='undefined'?window:globalThis);


// stage-project.js
(function(root){
 'use strict';
 const MAGIC='BKSP0001', MAX_MANIFEST=8*1024*1024, MAX_TRACKS=32, MAX_BUSES=16;
 const clamp=(v,a,b,d)=>Number.isFinite(Number(v))?Math.min(b,Math.max(a,Number(v))):d;
 const id=()=>root.crypto.randomUUID();
 const assetKey=v=>typeof v==='string'&&/^[-a-zA-Z0-9]{1,120}$/.test(v);
 function color(value){if(value==null||value==='')return undefined;if(typeof value!=='string'||!/^#[0-9a-f]{6}$/i.test(value))throw Error('Velg en gyldig kanalfarge.');return value.toLowerCase()}
 function muteGroups(value){if(value==null)return [];if(!Array.isArray(value)||value.length>6||value.some(g=>!Number.isInteger(g)||g<1||g>6))throw Error('Mutegrupper må være nummer 1–6.');return [...new Set(value)].sort((a,b)=>a-b)}
 function groupNames(state){const names=state?.opts?.muteGroupNames;if(names!=null&&(!Array.isArray(names)||names.length>6))throw Error('Ugyldige navn på mutegrupper.');const out=Array.from({length:6},(_,i)=>String(names?.[i]||'Gruppe '+(i+1)).trim().slice(0,24)||'Gruppe '+(i+1));if(new Set(out.map(n=>n.toLocaleLowerCase())).size!==6)throw Error('Gi mutegruppene forskjellige navn.');return out}
 function track(t){if(!t||!assetKey(t.assetId))throw Error('Sporet mangler en gyldig lydfil.');const out={id:assetKey(t.id)?t.id:id(),assetId:t.assetId,name:String(t.name||'Lydspor').slice(0,160),gain:clamp(t.gain,0,2,1),pan:clamp(t.pan,-1,1,0),mute:!!t.mute,solo:!!t.solo,output:Math.floor(clamp(t.output,1,64,1)),stereo:t.stereo!==false};const tint=color(t.color);if(tint)out.color=tint;if(t.fileName)out.fileName=String(t.fileName).slice(0,255);if(t.fileBytes!=null){if(!Number.isSafeInteger(t.fileBytes)||t.fileBytes<0||t.fileBytes>2147483648)throw Error('Ugyldig filstørrelse på lydsporet.');out.fileBytes=t.fileBytes}out.muteGroups=muteGroups(t.muteGroups);if(t.bus!=null){if(!Number.isInteger(t.bus)||t.bus<1||t.bus>MAX_BUSES)throw Error('Ugyldig utgangsbuss på sporet.');out.bus=t.bus}return out;}
 function bus(b){if(!b||!Number.isInteger(b.id)||b.id<1||b.id>MAX_BUSES)throw Error('Ugyldig utgangsbuss.');const out={id:b.id,name:String(b.name||'Buss '+b.id).slice(0,24),gain:clamp(b.gain??1,0,2,1),mute:!!b.mute,stereo:b.stereo!==false,output:Math.floor(clamp(b.output??1,1,64,1))};const tint=color(b.color);if(tint)out.color=tint;return out}
 function buses(state){const defaults=Array.from({length:MAX_BUSES},(_,i)=>bus({id:i+1,name:i===0?'Backing':i===1?'Klikk':'Buss '+(i+1),stereo:i!==1,output:i===0?1:i===1?3:i*2+1})),saved=state?.opts?.audioBuses;if(saved!=null){if(!Array.isArray(saved)||saved.length>MAX_BUSES)throw Error('Ugyldig bussoppsett.');const ids=new Set();for(const b of saved){const value=bus(b);if(ids.has(value.id))throw Error('En utgangsbuss er oppført flere ganger.');ids.add(value.id);defaults[value.id-1]=value}}return defaults}
 function mergeSong(current,incoming){
  if(incoming.songs.length!==1)throw Error('Låtfilen må inneholde nøyaktig én låt.');
  const next=structuredClone(current),song=structuredClone(incoming.songs[0]),target=buses(current),source=buses(incoming),used=new Set(current.songs.flatMap(s=>tracks(s).map(t=>t.bus).filter(Boolean))),mapping=new Map();
  const same=(a,b)=>['name','gain','mute','stereo','output','color'].every(k=>a[k]===b[k]);
  for(const t of tracks(song))if(t.bus&&!mapping.has(t.bus)){const from=source[t.bus-1];let to=target.find(b=>same(b,from));if(!to){to=!used.has(from.id)?target[from.id-1]:(target.find(b=>b.id>2&&!used.has(b.id))||target.find(b=>!used.has(b.id)));if(!to)throw Error('Prosjektet trenger en ledig utgangsbuss. Alle 16 er i bruk. Ingen låter er endret.');target[to.id-1]={...from,id:to.id}}used.add(to.id);mapping.set(t.bus,to.id)}
  if(song.playback?.tracks)for(const t of song.playback.tracks)if(t.bus)t.bus=mapping.get(t.bus);
  const targetNames=groupNames(current),sourceNames=groupNames(incoming),groupUsed=new Set(current.songs.flatMap(s=>tracks(s).flatMap(t=>t.muteGroups))),groupMapping=new Map();
  for(const t of tracks(song))for(const g of t.muteGroups)if(!groupMapping.has(g)){let index=targetNames.findIndex(n=>n.toLocaleLowerCase()===sourceNames[g-1].toLocaleLowerCase());if(index<0){index=!groupUsed.has(g)?g-1:targetNames.findIndex((_,i)=>!groupUsed.has(i+1));if(index<0)throw Error('Alle seks mutegrupper er i bruk med andre navn. Ingen låter er endret.');targetNames[index]=sourceNames[g-1]}groupUsed.add(index+1);groupMapping.set(g,index+1)}
  if(song.playback?.tracks)for(const t of song.playback.tracks)t.muteGroups=muteGroups(t.muteGroups).map(g=>groupMapping.get(g)).sort((a,b)=>a-b);
  next.opts={...next.opts,audioBuses:target,muteGroupNames:targetNames};next.songs.push(song);next.idx=next.songs.length-1;next.set='';return next
 }
 function tracks(song){const a=song?.playback?.tracks;if(a){if(!Array.isArray(a)||a.length>MAX_TRACKS)throw Error('Maksimalt 32 lydspor per låt.');return a.map(track)}return song?.audioId?[track({id:'legacy-'+song.audioId,assetId:song.audioId,name:'Backingtrack'})]:[];}
 function masterGain(song){return clamp(song?.playback?.masterGain??1,0,2,1)}
 function routeDirect(state,song,selectedTracks=tracks(song)){
  const outputs=buses(state),used=new Set(state.songs.flatMap(s=>tracks(s).map(t=>t.bus).filter(Boolean))),planned=selectedTracks.map(t=>({...t}));let changed=0;
  for(const t of planned){if(t.bus)continue;let b=outputs.find(b=>b.output===t.output&&b.stereo===t.stereo&&b.gain===1&&!b.mute);
   if(!b){b=outputs.find(b=>b.id>2&&!used.has(b.id))||outputs.find(b=>!used.has(b.id));if(!b)throw Error('Ingen ledig buss for USB '+t.output+'. Ingen ruting er endret.');outputs[b.id-1]=b=bus({id:b.id,name:t.name,output:t.output,stereo:t.stereo,gain:1,mute:false})}
   t.bus=b.id;if(!t.stereo)t.pan=0;used.add(b.id);changed++
  }return {tracks:planned,buses:outputs,changed}
 }
 function assets(state){const keys=new Set();for(const s of state.songs){for(const t of tracks(s))keys.add(t.assetId)}return [...keys];}
 function validateState(s){if(!root.StageCore.valid(s))throw Error('Ugyldig sangbibliotek.');for(const song of s.songs)tracks(song);buses(s);groupNames(s);return s;}
 async function pack(state,repo,onProgress=()=>{},options={}){
  validateState(state);state=structuredClone(state);state.opts={...state.opts,audioBuses:buses(state),muteGroupNames:groupNames(state)};for(const key of ['stageControls','stageBarVisible','setlistHidden','stageControlsWrap','controlsButtonsOnly','controlsIconsOnly','mixerWidth','waveformVisible','allowSeekDuringPlayback','seekStepSeconds'])delete state.opts[key];const entries=[],parts=[];let total=0;for(const key of assets(state)){const value=await repo.get(key);if(!value)throw Error('Lydfil mangler på denne enheten: '+key+'. Hent filen før du lager full backup.');if(!value.data)throw Error('Lydfilen mangler data: '+key);const data=value.data instanceof Blob?value.data:new Blob([value.data]);total+=data.size;if(total>256*1024*1024)throw Error('Prosjektfilen overstiger 256 MiB lagrede lydfiler. Velg Aktuell låt og lagre låtene hver for seg.');entries.push({id:key,name:value.name||key,type:value.type||'application/octet-stream',size:data.size});parts.push(data);onProgress(entries.length)}
  for(const song of state.songs)if(song.playback?.tracks)for(const t of song.playback.tracks){const file=entries.find(a=>a.id===t.assetId);if(file){t.fileBytes=file.size;if(!t.fileName)t.fileName=file.name}}
  const metadata=new TextEncoder().encode(JSON.stringify({format:'BenKen Stage Pro',version:3,appVersion:"26.12",scope:options.scope||"library",state,assets:entries}));if(metadata.length>MAX_MANIFEST)throw Error('Prosjektbeskrivelsen er for stor.');const header=new Uint8Array(12);header.set(new TextEncoder().encode(MAGIC));new DataView(header.buffer).setUint32(8,metadata.length,true);return new Blob([header,metadata,...parts],{type:'application/x-benken-project'});
 }
 async function inspect(blob){
  const header=new Uint8Array(await blob.slice(0,12).arrayBuffer());if(header.length!==12||new TextDecoder().decode(header.slice(0,8))!==MAGIC)throw Error('Dette er ikke et BenKen-prosjekt.');const length=new DataView(header.buffer).getUint32(8,true);if(!length||length>MAX_MANIFEST||12+length>blob.size)throw Error('Prosjektfilen er skadet.');let manifest;try{manifest=JSON.parse(await blob.slice(12,12+length).text())}catch{throw Error('Prosjektbeskrivelsen kan ikke leses.')}
  if(manifest.format!=='BenKen Stage Pro'||![1,2,3].includes(manifest.version)||!Array.isArray(manifest.assets)||manifest.assets.length>20000)throw Error('Prosjektformatet støttes ikke.');validateState(manifest.state);const keys=new Set();let cursor=12+length;const entries=[];for(const a of manifest.assets){if(!assetKey(a.id)||keys.has(a.id)||!Number.isSafeInteger(a.size)||a.size<=0||a.size>2147483648)throw Error('Ugyldig lydfil i prosjektet.');keys.add(a.id);entries.push({...a,start:cursor});cursor+=a.size}if(cursor!==blob.size)throw Error('Prosjektfilen er ufullstendig eller skadet.');for(const key of assets(manifest.state))if(!keys.has(key))throw Error('Prosjektet mangler en lydfil.');return {...manifest,assets:entries};
 }
 async function unpack(blob,repo){
  const manifest=await inspect(blob),mapping=new Map(),created=[];try{for(const a of manifest.assets){const key=id();mapping.set(a.id,key);await repo.put(key,{name:a.name,type:a.type,data:await blob.slice(a.start,a.start+a.size).arrayBuffer()});created.push(key)}}catch(e){for(const key of created)await repo.remove(key).catch(()=>{});throw e}
  const state=structuredClone(manifest.state);for(const song of state.songs){if(song.audioId){if(mapping.has(song.audioId))song.audioId=mapping.get(song.audioId);else delete song.audioId;}if(song.playback?.tracks)for(const t of song.playback.tracks){const original=t.assetId,entry=manifest.assets.find(a=>a.id===original);if(entry){t.fileBytes=entry.size;if(!t.fileName)t.fileName=entry.name}t.assetId=mapping.get(original)}}return root.StageCore.normalize(state);
 }
 root.StageProject={VERSION:'26.12',MAGIC,MAX_TRACKS,MAX_BUSES,color,track,bus,buses,muteGroups,groupNames,mergeSong,routeDirect,tracks,masterGain,assets,validateState,pack,inspect,unpack,id};
})(typeof window!=='undefined'?window:globalThis);


// stage-audio.js
(function(root){
 'use strict';
 const MAX_DECODED=256*1024*1024;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function waveInfo(data,sampleRate){
  if(data.byteLength<44)return null;const d=new DataView(data),tag=p=>String.fromCharCode(d.getUint8(p),d.getUint8(p+1),d.getUint8(p+2),d.getUint8(p+3));if(tag(0)!=='RIFF'||tag(8)!=='WAVE')return null;let format=null,size=null;
  for(let p=12;p+8<=d.byteLength;){const name=tag(p),length=d.getUint32(p+4,true);if(length>d.byteLength-p-8)return null;if(name==='fmt '&&length>=16){let code=d.getUint16(p+8,true);if(code===65534&&length>=40)code=d.getUint16(p+32,true);format={code,channels:d.getUint16(p+10,true),rate:d.getUint32(p+12,true),align:d.getUint16(p+20,true)}}if(name==='data')size=length;p+=8+length+(length%2)}
  if(!format||![1,3].includes(format.code)||!format.rate||!format.align||!format.channels||size===null)return null;const frames=Math.floor(size/format.align),duration=frames/format.rate;return {channels:format.channels,duration,decodedBytes:Math.ceil(duration*sampleRate)*format.channels*4}
 }
 function level(peak){const db=peak>0?20*Math.log10(peak):-Infinity;return {db,label:Number.isFinite(db)?db.toFixed(1):'−∞',percent:Number.isFinite(db)?clamp((db+60)/60*100,0,100):0,clip:peak>=1}}
 class MediaRepository{
  db(){return new Promise((resolve,reject)=>{const r=root.indexedDB.open('benken-audio-v1',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('tracks'))r.result.createObjectStore('tracks')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
  async transaction(mode,key,value,remove=false){const db=await this.db();return new Promise((resolve,reject)=>{let result;const tx=db.transaction('tracks',mode),store=tx.objectStore('tracks'),r=mode==='readonly'?store.get(key):remove?store.delete(key):store.put(value,key);r.onsuccess=()=>{result=r.result};tx.oncomplete=()=>{db.close();resolve(result)};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error||r.error||Error('Lydfilen kunne ikke lagres lokalt.'))}})}
  async get(key){const v=await this.transaction('readonly',key);if(v?.blob&&!v.data)return {...v,data:await v.blob.arrayBuffer()};return v}
  put(key,value){return this.transaction('readwrite',key,value)}
  remove(key){return this.transaction('readwrite',key,null,true)}
 }
 class BrowserPlayer{
  constructor(options={}){this.context=options.context||null;this.notify=options.notify||(()=>{});this.mode=options.mode==='stereo'?'stereo':'usb';this.tracks=[];this.buffers=[];this.info=new Map();this.nodes=[];this.duration=0;this.position=0;this.playing=false;this.preparing=false;this.generation=0;this.playRequest=0;this.master=1;this.channels=0;this.reportedChannels=0;this.samples=new Float32Array(256);this.decodedBytes=0}
  ensure(){
   if(!this.context){const Context=root.AudioContext||root.webkitAudioContext;if(!Context)throw Error('Nettleseren støtter ikke multitrack.');this.context=new Context({latencyHint:'playback'});this.context.onstatechange=()=>{if(this.playing&&this.context.state!=='running'){this.pause();this.notify({error:'Lyden ble avbrutt. Kontroller lydkortet og trykk spill for å fortsette.'})}}}
   return this.context
  }
  configure(){
   const ctx=this.ensure(),destination=ctx.destination;
   this.reportedChannels=Math.max(1,Math.floor(Number(destination.maxChannelCount)||Number(destination.channelCount)||2));
   const requested=Math.min(this.mode==='stereo'?2:32,this.reportedChannels);
   try{destination.channelCount=requested}catch{}
   const count=Math.max(1,Math.min(32,Number(destination.channelCount)||2));
   if(this.mode==='stereo'&&count>2)throw Error('Nettleseren kunne ikke velge vanlig stereoutgang.');
   destination.channelInterpretation='discrete';
   if(this.masterBus&&count===this.channels)return;
   if(this.masterBus){this.masterBus.disconnect();this.merger.disconnect();this.masterSplitter.disconnect();this.masterAnalysers.forEach(a=>a.disconnect())}
   this.channels=count;this.merger=ctx.createChannelMerger(count);this.merger.channelInterpretation='discrete';
   this.masterBus=ctx.createGain();this.masterBus.channelCount=count;this.masterBus.channelCountMode='explicit';this.masterBus.channelInterpretation='discrete';this.masterBus.gain.value=this.masterMuted?0:this.master;
   this.merger.connect(this.masterBus);this.masterBus.connect(destination);
   this.masterSplitter=ctx.createChannelSplitter(count);this.masterBus.connect(this.masterSplitter);
   this.masterAnalysers=Array.from({length:count},(_,i)=>{const a=ctx.createAnalyser();a.fftSize=256;this.masterSplitter.connect(a,i);return a})
  }
  setBuses(buses){this.buses=buses;for(const node of this.busNodes?.values()||[]){const b=buses.find(b=>b.id===node.id);if(b)node.volume.gain.setTargetAtTime(b.mute?0:b.gain,this.context.currentTime,.012)}}
  routeError(tracks=this.tracks){
   for(const t of tracks){const route=t.bus?this.buses?.find(b=>b.id===t.bus):t;if(!route)return '«'+t.name+'» mangler utgangsbuss '+t.bus+'.';if(this.mode==='stereo')continue;if(route.output<1||route.output>this.channels||(route.stereo&&route.output+1>this.channels))return '«'+(t.bus?route.name:t.name)+'» krever USB-utgang '+route.output+(route.stereo?'–'+(route.output+1):'')+'. Nettleseren tilbyr '+this.channels+' kanaler. Kontroller lydkortet eller endre rutingen.'}return ''
  }
  createBus(bus){
   const ctx=this.context,count=bus.stereo?2:1,input=ctx.createGain(),volume=ctx.createGain(),splitter=ctx.createChannelSplitter(count),analysers=[];
   input.channelCount=count;input.channelCountMode='explicit';input.channelInterpretation='speakers';volume.gain.value=bus.mute?0:bus.gain;input.connect(volume);volume.connect(splitter);
   const route=(source,channel)=>{const a=ctx.createAnalyser();a.fftSize=256;splitter.connect(a,source);a.connect(this.merger,0,channel);analysers.push(a)};
   route(0,this.mode==='stereo'?0:bus.output-1);
   if(bus.stereo&&(this.mode!=='stereo'||this.channels>1))route(1,this.mode==='stereo'?1:bus.output);else if(!bus.stereo&&this.mode==='stereo'&&this.channels>1)route(0,1);
   const node={id:bus.id,input,volume,splitter,analysers};this.busNodes.set(bus.id,node);return node
  }
  async load(tracks,repo){
   this.cancel();const gen=this.generation;this.tracks=tracks;this.preparing=true;this.notify({loading:true});
   try{
    if(!tracks.length){this.preparing=false;this.notify({ready:true});return true}
    let configured=false,bytes=0;const buffers=[],info=new Map(),decoded=new Map();this.info=info;
    for(const track of tracks){
     if(decoded.has(track.assetId)){buffers.push(decoded.get(track.assetId));continue}
     const file=await repo.get(track.assetId);if(gen!==this.generation)return false;
     if(!file?.data)throw Error('Lydfilen «'+track.name+'» mangler lokalt. Importer filen eller en prosjektbackup med lyd.');
     const data=file.data instanceof Blob?await file.data.arrayBuffer():file.data;
     if(data.byteLength>160*1024*1024)throw Error('«'+track.name+'» er over filgrensen på 160 MiB i denne nettversjonen.');
     if(!configured){this.configure();configured=true}const estimate=waveInfo(data,this.context.sampleRate);if(estimate){info.set(track.assetId,{name:file.name||track.name,bytes:data.byteLength,...estimate,estimated:true});if(estimate.channels>2)throw Error('«'+track.name+'» har flere enn to kanaler. Importer separate mono-/stereofiler.');this.requiredBytes=bytes+estimate.decodedBytes;if(this.requiredBytes>MAX_DECODED)throw Error('Låten trenger minst '+Math.ceil(this.requiredBytes/1048576)+' MiB dekodet lyd. Grensen er 256 MiB. WAV og MP3 bruker samme arbeidsminne ved lik lengde, samplingsfrekvens og kanaltall. Bruk færre, kortere eller mono-spor. Filene er beholdt lokalt.')}
     let buffer;try{buffer=await this.context.decodeAudioData(data.slice(0))}catch{throw Error('Lydfilen «'+track.name+'» kunne ikke leses. Prøv WAV, MP3 eller M4A.')}
     if(gen!==this.generation)return false;
     if(buffer.numberOfChannels>2)throw Error('«'+track.name+'» har flere enn to kanaler. Importer separate mono-/stereofiler.');
     const memory=buffer.length*buffer.numberOfChannels*4;bytes+=memory;this.requiredBytes=bytes;info.set(track.assetId,{name:file.name||track.name,bytes:data.byteLength,channels:buffer.numberOfChannels,duration:buffer.duration,decodedBytes:memory});
     if(bytes>MAX_DECODED)throw Error('Låten trenger minst '+Math.ceil(bytes/1048576)+' MiB dekodet lyd. Grensen er 256 MiB. MP3 sparer filplass, men ikke dette arbeidsminnet. Bruk færre, kortere eller mono-spor. Filene er beholdt lokalt.');
     buffers.push(buffer);decoded.set(track.assetId,buffer)
    }
    if(gen!==this.generation)return false;
    this.buffers=buffers;this.info=info;this.duration=Math.max(0,...buffers.map(b=>b.duration));this.decodedBytes=bytes;this.preparing=false;this.notify({ready:true});return true
   }catch(error){if(gen===this.generation){this.buffers=[];this.decodedBytes=0;this.duration=0;this.preparing=false;this.notify({error:error.message})}throw error}
  }
  groupMuted(track){return (track.muteGroups||[]).some(g=>this.muteGroups?.has(g))}
  setMuteGroups(groups){this.muteGroups=new Set(groups);this.update(this.tracks)}
  effective(track){return track.mute||this.groupMuted(track)||(this.tracks.some(t=>t.solo)&&!track.solo)?0:track.gain}
  addPath(node,input,channel,gain,target=this.merger){
   const ctx=this.context,volume=ctx.createGain(),analyser=ctx.createAnalyser();volume.gain.value=gain;analyser.fftSize=256;
   node.splitter.connect(volume,input);volume.connect(analyser);analyser.connect(target,0,channel);node.paths.push({gain:volume,analyser})
  }
  async play(){
   if(this.playing||this.preparing||!this.buffers.length)return;
   const ctx=this.ensure(),gen=this.generation,request=++this.playRequest;await ctx.resume();
   if(gen!==this.generation||request!==this.playRequest||this.playing)return;
   if(ctx.state!=='running')throw Error('Lydmotoren er '+ctx.state+'. Trykk spill på nytt.');
   this.configure();const error=this.routeError();if(error)throw Error(error);
   if(this.position>=this.duration)this.position=0;
   const when=ctx.currentTime+.05;this.startTime=when;this.startOffset=this.position;
   try{
    this.nodes=[];this.busNodes=new Map();this.buffers.forEach((buffer,i)=>{
     const track=this.tracks[i],source=ctx.createBufferSource(),splitter=ctx.createChannelSplitter(track.stereo?2:1);
     const node={source,splitter,mono:null,paths:[]};this.nodes.push(node);source.buffer=buffer;
     if(track.stereo)source.connect(splitter);
     else{node.mono=ctx.createGain();node.mono.channelCount=1;node.mono.channelCountMode='explicit';node.mono.channelInterpretation='speakers';source.connect(node.mono);node.mono.connect(splitter)}
     const base=this.effective(track),left=base*(track.pan>0?1-track.pan:1),right=base*(track.pan<0?1+track.pan:1);
     if(track.bus){const bus=this.buses.find(b=>b.id===track.bus),output=this.busNodes.get(bus.id)||this.createBus(bus);node.busMerger=ctx.createChannelMerger(2);node.busMerger.channelInterpretation='discrete';node.busMerger.connect(output.input);this.addPath(node,0,0,left,node.busMerger);this.addPath(node,track.stereo&&buffer.numberOfChannels>1?1:0,1,right,node.busMerger)}
     else if(track.stereo){this.addPath(node,0,this.mode==='stereo'?0:track.output-1,left);if(this.mode!=='stereo'||this.channels>1)this.addPath(node,buffer.numberOfChannels>1?1:0,this.mode==='stereo'?1:track.output,right)}
     else{this.addPath(node,0,this.mode==='stereo'?0:track.output-1,base);if(this.mode==='stereo'&&this.channels>1)this.addPath(node,0,1,base)}
    });
    for(let i=0;i<this.nodes.length;i++)if(this.buffers[i].duration>this.position)this.nodes[i].source.start(when,this.position);
    this.playing=true;this.notify({playing:true})
   }catch(error){this.pause();throw error}
  }
  get currentTime(){return this.playing?Math.min(this.duration,this.startOffset+Math.max(0,this.context.currentTime-this.startTime)):this.position}
  pause(){
   this.seekSerial=(this.seekSerial||0)+1;this.seekResume=false;this.playRequest++;if(this.playing)this.position=this.currentTime;this.playing=false;
   for(const n of this.nodes){try{n.source.stop()}catch{}n.source.disconnect();n.splitter.disconnect();n.mono?.disconnect();n.busMerger?.disconnect();for(const path of n.paths){path.gain.disconnect();path.analyser.disconnect()}}
   for(const b of this.busNodes?.values()||[]){b.input.disconnect();b.volume.disconnect();b.splitter.disconnect();b.analysers.forEach(a=>a.disconnect())}this.busNodes=new Map();
   this.nodes=[];this.notify({playing:false})
  }
  async seek(seconds,resume=this.playing||!!this.seekResume){
   const value=Number(seconds);if(!Number.isFinite(value)||!this.buffers.length||this.preparing||this.buffers.length!==this.tracks.length)return false;
   this.pause();const serial=this.seekSerial,gen=this.generation;this.position=clamp(value,0,this.duration);this.seekResume=resume;this.notify({seeked:true,position:this.position});
   try{if(resume&&this.position<this.duration)await this.play();return serial===this.seekSerial&&gen===this.generation}finally{if(serial===this.seekSerial)this.seekResume=false}
  }
  stop(){this.pause();this.position=0;this.notify({stopped:true})}
  cancel(){this.generation++;this.stop();this.buffers=[];this.tracks=[];this.info.clear();this.duration=0;this.decodedBytes=0;this.requiredBytes=0;this.preparing=false}
  update(tracks){this.tracks=tracks;this.nodes.forEach((node,i)=>{const t=tracks[i];if(!t)return;const base=this.effective(t);node.paths.forEach((path,p)=>path.gain.gain.setTargetAtTime(t.stereo||t.bus?base*(p===0?(t.pan>0?1-t.pan:1):(t.pan<0?1+t.pan:1)):base,this.context.currentTime,.012))})}
  setMaster(value){this.master=clamp(Number(value)||0,0,2);if(this.masterBus)this.masterBus.gain.setTargetAtTime(this.masterMuted?0:this.master,this.context.currentTime,.012)}
  setMasterMuted(value){this.masterMuted=!!value;if(this.masterBus)this.masterBus.gain.setTargetAtTime(this.masterMuted?0:this.master,this.context.currentTime,.012)}
  setMode(mode){if(this.playing)throw Error('Stopp avspillingen før du endrer utgangsmodus.');this.mode=mode==='stereo'?'stereo':'usb';this.configure()}
  peak(analysers){let peak=0;for(const a of analysers){a.getFloatTimeDomainData(this.samples);for(const n of this.samples)peak=Math.max(peak,Math.abs(n))}return peak}
  meters(){return this.nodes.map(n=>this.peak(n.paths.map(p=>p.analyser)))}
  meterBuses(){return new Map(Array.from(this.busNodes?.values()||[],b=>[b.id,this.peak(b.analysers)]))}
  meterMaster(){return this.playing?this.peak(this.masterAnalysers):0}
  tick(){if(!this.playing)return;if(this.context.state!=='running'){this.pause();return}const max=Number(this.context.destination.maxChannelCount);if(max>0&&max!==this.reportedChannels){this.pause();this.notify({error:'Lydutstyret ble endret. Kontroller utgangene og klargjør igjen.'});return}if(this.currentTime>=this.duration){this.pause();this.position=this.duration;this.notify({ended:true})}}
 }
 root.StageAudio={VERSION:'26.12',level,waveInfo,MAX_DECODED,MediaRepository,BrowserPlayer};
})(typeof window!=='undefined'?window:globalThis);


// stage-mixer-settings.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function signature(tracks,buses,names){return JSON.stringify([tracks.map(t=>[t.id,t.assetId,t.name,t.color||null,t.bus||0,t.stereo,t.output,t.muteGroups]),buses.map(b=>[b.id,b.name,b.color||null,b.stereo,b.output]),names])}
 function mount(o){
  const $=id=>document.getElementById(id);let draft=null,tab='tracks',dirty=false;
  function routeLabel(b){return b.id+' · '+b.name+' → USB '+b.output+(b.stereo?'–'+(b.output+1):'')}
  function outputs(route){const limit=32-(route.stereo?1:0);return Array.from({length:limit},(_,i)=>'<option value="'+(i+1)+'"'+(route.output===i+1?' selected':'')+'>'+(i+1)+(route.stereo?'–'+(i+2):'')+'</option>').join('')+(route.output>limit?'<option selected value="'+route.output+'">'+route.output+' · utenfor 32 kanaler</option>':'')}
  function format(route,field){return '<select '+field+' aria-label="Mono eller stereo"><option value="true"'+(route.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!route.stereo?' selected':'')+'>Mono</option></select>'}
  function groupChecks(track){return draft.names.map((name,i)=>'<label class="setup-group-check"><input type="checkbox" data-setup-track-group="'+(i+1)+'"'+(track.muteGroups.includes(i+1)?' checked':'')+'><span>'+esc(name)+'</span></label>').join('')}
  function render(){
   if(!draft)return;
   const panel=$('mixerSetupBody');$('mixerSetupBody').classList.toggle('hidden',tab==='audio');$('mixerSetupAudio').classList.toggle('hidden',tab!=='audio');
   $('mixerSetupSong').textContent=draft.song?.title||'Ingen låt valgt';
   $('mixerSetupTabs').querySelectorAll('[data-setup-tab]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.setupTab===tab)));
   if(tab==='tracks'){
    $('mixerSetupHelp').textContent='Sporoppsettet gjelder denne låten. Velg buss og mutegrupper på samme rad. En buss kan samle flere spor.';
    panel.innerHTML=draft.tracks.length?'<div class="setup-track-heading"><span>Kanalnavn / farge</span><span>Utgangsbuss og format</span><span>Mutegrupper</span></div>'+draft.tracks.map((t,i)=>{
     const tint=o.trackColor(t,i,draft.buses);
     return '<section class="setup-track-row" data-setup-track="'+esc(t.id)+'" style="--channel-color:'+tint+'"><div class="setup-identity"><span class="setup-index">'+String(i+1).padStart(2,'0')+'</span><label class="setup-name">Kanalnavn<input type="text" data-setup-field="name" maxlength="160" value="'+esc(t.name)+'"></label><label class="setup-color">Farge<input type="color" data-setup-field="color" value="'+tint+'" aria-label="Kanalfarge '+esc(t.name)+'"></label><button type="button" data-setup-auto-color title="Bruk bussens farge">AUTO</button><small>'+esc(t.fileName||t.name)+'</small></div><div class="setup-routing"><label>Utgangsbuss<select data-setup-field="bus"><option value="0"'+(!t.bus?' selected':'')+'>Direkte USB</option>'+draft.buses.map(b=>'<option value="'+b.id+'"'+(t.bus===b.id?' selected':'')+'>'+esc(routeLabel(b))+'</option>').join('')+'</select></label><div><label>Filformat'+format(t,'data-setup-field="stereo"')+'</label>'+(t.bus?'':'<label>USB ut<select data-setup-field="output">'+outputs(t)+'</select></label>')+'</div></div><fieldset class="setup-memberships"><legend>Mutegrupper</legend>'+groupChecks(t)+'</fieldset></section>'
    }).join(''):'<p class="setup-empty">Ingen lydspor i denne låten. Velg LYD OG FILER for å legge til spor.</p>'
   }else if(tab==='buses'){
    $('mixerSetupHelp').textContent='Busser er felles for alle låter. Navn, farge og USB-utganger følger bussen overalt. Spor med AUTO-farge følger bussfargen.';
    panel.innerHTML=draft.buses.map(b=>{
     const tint=o.busColor(b),members=draft.tracks.filter(t=>t.bus===b.id),others=o.state().songs.filter(s=>s!==draft.song).flatMap(s=>root.StageProject.tracks(s)).filter(t=>t.bus===b.id).length;
     return '<section class="setup-bus-row" data-setup-bus="'+b.id+'" style="--channel-color:'+tint+'"><div class="setup-identity"><span class="setup-index">B'+String(b.id).padStart(2,'0')+'</span><label class="setup-name">Bussnavn<input type="text" data-setup-bus-field="name" maxlength="24" value="'+esc(b.name)+'"></label><label class="setup-color">Farge<input type="color" data-setup-bus-field="color" value="'+tint+'" aria-label="Bussfarge '+esc(b.name)+'"></label><button type="button" data-setup-auto-color>AUTO</button></div><div class="setup-routing"><div><label>Format'+format(b,'data-setup-bus-field="stereo"')+'</label><label>USB ut<select data-setup-bus-field="output">'+outputs(b)+'</select></label></div><p>Denne låten: '+(members.length?members.map(t=>esc(t.name)).join(', '):'Ingen spor')+'</p><small>'+others+' spor fra andre låter bruker denne bussen.</small></div></section>'
    }).join('')
   }else if(tab==='groups'){
    $('mixerSetupHelp').textContent='Gi de seks gruppene egne navn, og velg sporene som skal mutes sammen. Navnene gjelder alle låter; medlemskapet gjelder denne låten.';
    panel.innerHTML='<div class="setup-group-grid">'+draft.names.map((name,i)=>'<section class="setup-group-card" data-setup-group="'+(i+1)+'"><label class="setup-name">Mutegruppe '+(i+1)+'<input type="text" data-setup-group-name="'+i+'" maxlength="24" value="'+esc(name)+'"></label><div>'+draft.tracks.map((t,n)=>'<label class="setup-member"><input type="checkbox" data-setup-member="'+esc(t.id)+'"'+(t.muteGroups.includes(i+1)?' checked':'')+'><span class="setup-color-dot" style="background:'+o.trackColor(t,n,draft.buses)+'"></span><span>'+esc(t.name)+'</span></label>').join('')+'</div></section>').join('')+'</div>'
   }
   if(tab==='audio'){$('mixerSetupHelp').textContent='Se hvilke filer som hører til låten, og gi sporene egne navn. Backup og lydoppsett finner du nedenfor.';panel.innerHTML='';o.drawFiles(draft.tracks)}
   // Explicit values also keep selection predictable after a draft changes format.
   panel.querySelectorAll('select[data-setup-field]').forEach(el=>{const t=draft.tracks.find(t=>t.id===el.closest('[data-setup-track]').dataset.setupTrack);el.value=String(el.dataset.setupField==='bus'?(t.bus||0):t[el.dataset.setupField])});
   panel.querySelectorAll('select[data-setup-bus-field]').forEach(el=>{const b=draft.buses.find(b=>b.id===Number(el.closest('[data-setup-bus]').dataset.setupBus));el.value=String(b[el.dataset.setupBusField])});
   panel.querySelectorAll('input,select').forEach(el=>{el.dataset.renderValue=el.value;el.dataset.renderChecked=String(el.checked===true)});
  }
  function snapshot(){const tracks=o.tracks(),buses=o.buses(),names=root.StageProject.groupNames(o.state());return {song:o.song(),state:o.state(),tracks,buses,names,base:tracks.map(t=>[t.id,t.assetId]),signature:signature(tracks,buses,names)}}
  function stale(){return draft&&(draft.song!==o.song()||draft.state!==o.state()||draft.signature!==signature(o.tracks(),o.buses(),root.StageProject.groupNames(o.state())))}
  function locked(){return o.busy()||o.player.playing||!!o.player.seekResume||stale()}
  function refresh(){
   if(!draft)return;
   if(!dirty&&stale()){draft=snapshot();render()}
   const blocked=!!locked(),explanation=stale()?'Låt eller spor er endret. Åpne mikserinnstillingene igjen.':o.busy()?'Vent til lydfilene er ferdig klargjort.':blocked?'Stopp avspillingen for å endre kanalnavn, farger og ruting.':'';
   $('mixerSetupLock').textContent=explanation;$('mixerSetupLock').classList.toggle('hidden',!explanation);
   $('mixerSetupBody').querySelectorAll('input,select,button').forEach(el=>el.disabled=blocked);$('mixerSongFiles').querySelectorAll('[data-file-alias]').forEach(el=>el.disabled=blocked);$('mixerSetupSave').disabled=blocked||!draft.song;
   $('mixerSetupSave').textContent=tab==='audio'?'LAGRE NAVN':'LAGRE MIKSEROPPSETT';
   $('mixerSetupCancel').textContent=dirty?'FORKAST ENDRINGER':'TILBAKE TIL MIKSER'
  }
  function open(target){
   if(draft){capture();tab=target?.tab||(target?.busId?'buses':'tracks');render();refresh();return true}
   const trackId=typeof target==='string'?target:target?.trackId,busId=target?.busId;
   draft=snapshot();dirty=false;tab=target?.tab||(busId?'buses':draft.song?'tracks':'audio');$('mixerSetupStatus').textContent='';render();
   $('mixerMain').classList.add('hidden');$('mixerSetupDialog').classList.remove('hidden');$('mixerDialog').classList.add('mixer-config-open');$('mixerSettingsBtn').setAttribute('aria-pressed','true');refresh();
   if(trackId||busId){const row=[...$('mixerSetupBody').querySelectorAll(trackId?'[data-setup-track]':'[data-setup-bus]')].find(el=>trackId?el.dataset.setupTrack===trackId:Number(el.dataset.setupBus)===busId);row?.scrollIntoView({block:'nearest'});if(!locked())row?.querySelector('input[type="text"]')?.focus()}
   return true
  }
  function close(){draft=null;dirty=false;$('mixerSetupBody').innerHTML='';$('mixerSetupDialog').classList.add('hidden');$('mixerMain').classList.remove('hidden');$('mixerDialog').classList.remove('mixer-config-open');$('mixerSettingsBtn').setAttribute('aria-pressed','false')}
  function write(el){
   if(!draft)return;const field=el.dataset.setupField,busField=el.dataset.setupBusField;
   if(el.dataset.fileAlias){const t=draft.tracks.find(t=>t.id===el.dataset.fileAlias);if(t)t.name=el.value.slice(0,160)}
   else if(field){const t=draft.tracks.find(t=>t.id===el.closest('[data-setup-track]').dataset.setupTrack);if(field==='bus'){if(Number(el.value))t.bus=Number(el.value);else delete t.bus}else t[field]=field==='stereo'?el.value==='true':field==='output'?Number(el.value):field==='color'?root.StageProject.color(el.value):el.value}
   else if(busField){const b=draft.buses.find(b=>b.id===Number(el.closest('[data-setup-bus]').dataset.setupBus));b[busField]=busField==='stereo'?el.value==='true':busField==='output'?Number(el.value):busField==='color'?root.StageProject.color(el.value):el.value}
   else if(el.dataset.setupTrackGroup){const t=draft.tracks.find(t=>t.id===el.closest('[data-setup-track]').dataset.setupTrack),g=Number(el.dataset.setupTrackGroup),groups=new Set(t.muteGroups);el.checked?groups.add(g):groups.delete(g);t.muteGroups=[...groups].sort((a,b)=>a-b)}
   else if(el.dataset.setupMember){const t=draft.tracks.find(t=>t.id===el.dataset.setupMember),g=Number(el.closest('[data-setup-group]').dataset.setupGroup),groups=new Set(t.muteGroups);el.checked?groups.add(g):groups.delete(g);t.muteGroups=[...groups].sort((a,b)=>a-b)}
   else if(el.hasAttribute('data-setup-group-name'))draft.names[Number(el.dataset.setupGroupName)]=el.value;
  }
  function capture(){if(!draft||locked())return;const before=JSON.stringify([draft.tracks,draft.buses,draft.names]),inputs=tab==='audio'?$('mixerSongFiles').querySelectorAll('[data-file-alias]'):$('mixerSetupBody').querySelectorAll('input,select');inputs.forEach(el=>{if(el.getAttribute('type')==='checkbox'?String(el.checked)!==el.dataset.renderChecked:el.value!==el.dataset.renderValue)write(el)});if(JSON.stringify([draft.tracks,draft.buses,draft.names])!==before)dirty=true}
  function flush(){
   if(!draft)return true;
   try{capture();if(!dirty)return true;if(locked())throw Error('Stopp avspillingen og åpne innstillingene igjen før du lagrer endringene.');o.apply(draft);draft=snapshot();dirty=false;render();refresh();return true}catch(error){$('mixerSetupStatus').textContent=error.message;o.message(error.message,true);return false}
  }
  function change(e){
   if(!draft||locked())return;
   try{capture();write(e.target);dirty=true;const field=e.target.dataset.setupField||e.target.dataset.setupBusField;if(['bus','stereo'].includes(field))render();else if(field==='color')e.target.closest('[data-setup-track],[data-setup-bus]').style.setProperty('--channel-color',e.target.value);refresh()}catch(error){$('mixerSetupStatus').textContent=error.message}
  }
  $('mixerSetupBody').addEventListener('input',e=>{if(e.target.tagName==='INPUT'&&e.target.getAttribute('type')!=='checkbox')change(e)});
  $('mixerSetupBody').addEventListener('change',change);
  $('mixerSongFiles').addEventListener('input',change);$('mixerSongFiles').addEventListener('change',change);
  $('mixerSetupBody').addEventListener('click',e=>{const button=e.target.closest('[data-setup-auto-color]');if(!button||!draft||locked())return;capture();const tr=button.closest('[data-setup-track]'),br=button.closest('[data-setup-bus]');if(tr)delete draft.tracks.find(t=>t.id===tr.dataset.setupTrack).color;else if(br)delete draft.buses.find(b=>b.id===Number(br.dataset.setupBus)).color;dirty=true;render();refresh()});
  $('mixerSetupTabs').addEventListener('click',e=>{const button=e.target.closest('[data-setup-tab]');if(button&&draft){capture();tab=button.dataset.setupTab;render();refresh()}});
  $('mixerSetupSave').onclick=()=>{if(!draft)return;try{capture();o.apply(draft);close()}catch(error){$('mixerSetupStatus').textContent=error.message}};
  $('mixerSetupClose').onclick=$('mixerSetupCancel').onclick=close;
  return {open,close,refresh,flush,fileTracks:()=>draft?.tracks,isOpen:()=>!!draft}
 }
 root.StageMixerSettings={VERSION:'26.12',mount,signature};
})(typeof window!=='undefined'?window:globalThis);


// stage-fader-gestures.js
(function(root){
 'use strict';
 function mount(o){
  let current=null,previous=null,lastReset=null;
  const clock=e=>Number.isFinite(e.timeStamp)?e.timeStamp:Date.now();
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function clear(){current=null;previous=null}
  function reset(input,time,song){
   if(input.disabled||song!==o.song())return;
   if(lastReset?.input===input&&lastReset.song===song&&time>=lastReset.time&&time-lastReset.time<450)return;
   lastReset={input,time,song};o.reset(input)
  }
  o.element.addEventListener('pointerdown',e=>{
   const input=e.target.closest('.mixer-fader');
   if(e.isPrimary===false){clear();return}
   if(!input||input.disabled||(e.button!=null&&e.button!==0)){clear();return}
   current={input,song:o.song(),id:e.pointerId,time:clock(e),x:e.clientX,y:e.clientY,moved:false}
  },{capture:true,passive:true});
  document.addEventListener('pointermove',e=>{if(current&&e.pointerId===current.id&&distance(current,{x:e.clientX,y:e.clientY})>8)current.moved=true},{capture:true,passive:true});
  document.addEventListener('pointercancel',clear,{capture:true,passive:true});
  document.addEventListener('pointerup',e=>{
   const tap=current;if(!tap||tap.id!==e.pointerId)return;current=null;
   const time=clock(e),end={x:e.clientX,y:e.clientY};
   if(e.isPrimary===false||tap.moved||time<tap.time||time-tap.time>350||distance(tap,end)>8||tap.song!==o.song()){previous=null;return}
   if(previous&&previous.input===tap.input&&previous.song===tap.song&&time>=previous.time&&time-previous.time<=350&&distance(previous,end)<=18){previous=null;reset(tap.input,time,tap.song)}
   else previous={...tap,...end,time}
  },{capture:true,passive:true});
  o.element.addEventListener('dblclick',e=>{const input=e.target.closest('.mixer-fader');if(input)reset(input,clock(e),o.song())},{capture:true});
  return {clear}
 }
 root.StageFaderGestures={VERSION:'26.12',mount};
})(typeof window!=='undefined'?window:globalThis);


// stage-mixer.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const colors=['#6fbbac','#d5b56c','#849fc9','#c194ac','#97b575','#b69bd3','#cf9677','#79b8c8'];
 const busColor=b=>b.color||colors[(b.id-1)%colors.length];
 const trackColor=(t,i,buses)=>t.color||(t.bus?busColor(buses[t.bus-1]):colors[i%colors.length]);
 const ink=tint=>{const rgb=[1,3,5].map(i=>parseInt(tint.slice(i,i+2),16));return rgb[0]*.299+rgb[1]*.587+rgb[2]*.114>145?'#102021':'#f7f9fa'};
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
  let generation=0,loading=false,importing=false,prepared=null,view='tracks',showAllBuses=false,heldPeak=0,setup=null,gestures=null;const absentLegacy=new WeakSet(),fileInfo=new Map();
  const player=new root.StageAudio.BrowserPlayer({mode:o.state().opts.audioOutputMode,notify:state=>{if(state.error)message(state.error,true);o.transport?.(state);updateTransport()}});
  function message(text,error=false){$('mixerStatus').textContent=text;$('mixerStatus').dataset.error=String(error);$('mixerQuickStatus').textContent=error?text:'';$('mixerQuickStatus').classList.toggle('hidden',!error)}
  function getTracks(){const song=o.song();return song&&!song.playback?.tracks&&absentLegacy.has(song)?[]:root.StageProject.tracks(song)}
  function getBuses(){return root.StageProject.buses(o.state())}
  function groupState(){return {names:root.StageProject.groupNames(o.state()),active:Array.from({length:6},(_,i)=>!!player.muteGroups?.has(i+1))}}
  function drawGroups(){const state=groupState();$('mixerGroups').innerHTML='<span>MUTEGRUPPER</span>'+state.names.map((name,i)=>'<button type="button" data-global-group="'+(i+1)+'" aria-pressed="'+state.active[i]+'">'+(i+1)+' · '+esc(name)+'</button>').join('');$('mixerTracks').querySelectorAll('[data-track]').forEach(strip=>{const t=getTracks()[Number(strip.dataset.track)],button=strip.querySelector('[data-toggle="mute"]'),group=t&&player.groupMuted(t);if(button){button.textContent=group?'GRUPPE':'MUTE';button.setAttribute('aria-pressed',String(!!t.mute||group));button.classList.toggle('mute-on',!!t.mute||group)}});$('mixerMasterMute').textContent=player.masterMuted?'LYD PÅ':'LYD AV';$('mixerMasterMute').setAttribute('aria-pressed',String(!!player.masterMuted))}
  const fileSize=bytes=>bytes==null?'—':bytes<1000?bytes+' B':bytes<1000000?(bytes/1000).toFixed(1)+' kB':(bytes/1000000).toFixed(1)+' MB';
  const fileTime=seconds=>{const n=Math.max(0,Math.round(seconds||0));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
  function drawFiles(selected){
   for(const [id,info] of player.info)fileInfo.set(id,{...info});
   const tracks=selected||setup?.fileTracks()||getTracks(),buses=getBuses(),unique=new Map(tracks.map(t=>[t.assetId,t.fileBytes??fileInfo.get(t.assetId)?.bytes]));
   $('mixerFilesSummary').textContent=tracks.length+' spor · '+unique.size+' lydfiler'+([...unique.values()].every(n=>Number.isFinite(n))&&unique.size?' · '+fileSize([...unique.values()].reduce((a,b)=>a+b,0)):'');
   $('mixerSongFiles').innerHTML=tracks.length?tracks.map((t,i)=>{const file=player.info.get(t.assetId)||fileInfo.get(t.assetId),original=t.fileName||file?.name||'Originalfilnavn ikke tilgjengelig',bytes=t.fileBytes??file?.bytes,format=(original.match(/\.([a-z0-9]+)$/i)?.[1]||'LYDFIL').toUpperCase(),route=t.bus?buses[t.bus-1]:t,tint=trackColor(t,i,buses),details=[format,file?.channels?(file.channels===1?'Mono':'Stereo'):'',file?.duration?fileTime(file.duration):'',fileSize(bytes)].filter(Boolean).join(' · ');
    return '<article class="song-file-card" data-file-track="'+esc(t.id)+'" style="--channel-color:'+tint+'"><span class="song-file-number">'+String(i+1).padStart(2,'0')+'</span><div class="song-file-identity"><label>Navn i appen<input type="text" data-file-alias="'+esc(t.id)+'" maxlength="160" value="'+esc(t.name)+'" aria-label="Navn på lydspor '+(i+1)+'"></label><small class="song-file-original">Originalfil: '+esc(original)+'</small></div><div class="song-file-info"><span>'+esc(details)+'</span><small>'+(t.bus?esc(route.name)+' · ':'')+'USB '+route.output+(route.stereo?'–'+(route.output+1):'')+'</small></div></article>'
   }).join(''):'<p class="song-files-empty">Ingen lydfiler ennå. Velg + LYDFILER og legg til sporene som hører til låten.</p>';
   $('mixerSongFiles').querySelectorAll('[data-file-alias]').forEach(input=>{input.dataset.renderValue=input.value;input.disabled=loading||importing||player.playing||!!player.seekResume})
  }
  function toggleGroup(id){if(!Number.isInteger(id)||id<1||id>6)return;const active=new Set(player.muteGroups||[]);active.has(id)?active.delete(id):active.add(id);player.setMuteGroups(active);drawGroups();updateTransport()}
  function toggleMasterMute(){player.setMasterMuted(!player.masterMuted);drawGroups();updateTransport()}
  async function seek(seconds,resume){if(loading||importing||!player.duration)return false;const mine=generation;try{const moved=await player.seek(seconds,resume);if(moved&&mine===generation)o.seek?.(player.currentTime,player.duration);updateTransport();return moved}catch(error){message(error.message,true);updateTransport();return false}}
  function commitBuses(buses){const previous=o.state().opts.audioBuses;o.state().opts.audioBuses=buses.map(root.StageProject.bus);if(o.save()===false){o.state().opts.audioBuses=previous;throw Error('Utgangsbussene kunne ikke lagres.')}invalidateProject();player.setBuses(getBuses())}
  const gainText=gain=>gain>0?(20*Math.log10(gain)).toFixed(1)+' dB':'−∞ dB';
  function outputOptions(route){const limit=Math.max(0,(player.channels||32)-(route.stereo?1:0));return Array.from({length:limit},(_,n)=>'<option value="'+(n+1)+'"'+(route.output===n+1?' selected':'')+'>'+(n+1)+(route.stereo?'–'+(n+2):'')+'</option>').join('')+(route.output>limit?'<option value="'+route.output+'" selected>'+route.output+' · mangler</option>':'')}
  function drawBuses(){
   const tracks=getTracks(),used=new Set(tracks.map(t=>t.bus).filter(Boolean)),busy=loading||importing,locked=busy||player.playing;
   $('mixerBuses').innerHTML=getBuses().filter(b=>showAllBuses||used.has(b.id)||(!used.size&&b.id<=2)).map(b=>{
    const members=tracks.filter(t=>t.bus===b.id),color=busColor(b);
    return '<section class="stem-strip bus-strip" data-bus="'+b.id+'" style="--channel-color:'+color+';--channel-ink:'+ink(color)+'"><div class="strip-header"><span>BUSS '+String(b.id).padStart(2,'0')+'</span><span class="strip-kind">'+(b.stereo?'ST':'M')+'</span></div><button type="button" class="route-badge" data-edit-bus="'+b.id+'"'+(locked?' disabled':'')+' title="Endre bussoppsett">USB '+b.output+(b.stereo?'–'+(b.output+1):'')+' · ⚙</button><small class="stem-file" title="'+esc(members.map(t=>t.name).join(', '))+'">'+(members.length?members.length+' spor tilkoblet':'Ingen spor tilkoblet')+'</small><div class="stem-switches"><button data-bus-mute aria-pressed="'+b.mute+'" class="'+(b.mute?'mute-on':'')+'"'+(busy?' disabled':'')+'>MUTE</button><button data-bus-reset'+(busy?' disabled':'')+'>0 dB</button></div><div class="fader-value"><output data-bus-gain="'+b.id+'">'+gainText(b.gain)+'</output></div>'+faderMarkup({gain:b.gain,field:'data-bus-field="gain"',meter:'data-bus-meter="'+b.id+'"',label:'Bussvolum '+b.name,disabled:busy})+'<div class="level-readout"><span>PEAK</span><output data-bus-peak="'+b.id+'">−∞ dBFS</output></div><div class="bus-members" title="'+esc(members.map(t=>t.name).join(', '))+'">'+(members.length?members.map(t=>esc(t.name)).join(' · '):'Ingen spor')+'</div><button type="button" class="channel-setup" data-edit-bus="'+b.id+'"'+(locked?' disabled':'')+'>⚙ BUSSOPPSETT</button><label class="channel-label"><span>BUSSNAVN</span><input data-bus-field="name" value="'+esc(b.name)+'" maxlength="24" aria-label="Bussnavn"'+(busy?' disabled':'')+'></label></section>'
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
   $('audioName').textContent=tracks.length?tracks.length+' lydspor':'Ingen lydfil';$('prepareAudio').classList.toggle('hidden',!tracks.length||player.buffers.length===tracks.length||loading||importing);setup?.refresh();for(const listener of listeners)listener()
  }
  function drawMemory(){
   const bytes=player.requiredBytes||player.decodedBytes||0,limit=root.StageAudio.MAX_DECODED,over=bytes>limit;
   $('mixerMemoryText').textContent=(over?'Minst ':'')+(bytes/1048576).toFixed(1)+' / '+(limit/1048576)+' MiB arbeidsminne';$('mixerMemory').dataset.over=String(over);$('mixerMemoryFill').style.width=Math.min(100,bytes/limit*100)+'%';$('mixerMemory').setAttribute('aria-valuenow',String(Math.min(limit/1048576,bytes/1048576)));$('mixerMemoryHelp').textContent=over?'For mye dekodet lyd. Filene er beholdt. Fjern spor eller bruk kortere/mono-filer. MP3 alene reduserer ikke dette minnebehovet.':'MP3 sparer filplass. Arbeidsminnet bestemmes av lengde, samplingsfrekvens og kanaltall.'
  }
  function draw(){
   $('mixerDialog').classList.toggle('mixer-narrow',o.state().opts.mixerWidth==='narrow');$('mixerWidth').value=o.state().opts.mixerWidth==='narrow'?'narrow':'normal';
   const song=o.song(),tracks=getTracks(),master=root.StageProject.masterGain(song),buses=getBuses(),busy=loading||importing,locked=busy||player.playing;player.setBuses(buses);
   $('mixerTracks').classList.toggle('hidden',view!=='tracks');$('mixerBuses').classList.toggle('hidden',view!=='buses');$('busViewOptions').classList.toggle('hidden',view!=='buses');$('mixerTrackTab').setAttribute('aria-pressed',String(view==='tracks'));$('mixerBusTab').setAttribute('aria-pressed',String(view==='buses'));$('busShowAll').checked=showAllBuses;
   $('mixerSong').textContent=song?.title||'Velg en låt';$('outputMode').value=player.mode;
   $('mixerOutputs').textContent=player.channels?(player.mode==='stereo'?'Stereoøving: alle spor, også klikk, mikses til 1–2.':'Ui24R / USB · '+player.channels+' kanaler · '+Math.round(player.context.sampleRate)+' Hz'):'Koble til Ui24R og velg LES UTGANGER.';
   $('mixerEmpty').classList.toggle('hidden',!!tracks.length||view!=='tracks');
   const direct=tracks.filter(t=>!t.bus).length,used=new Set(tracks.map(t=>t.bus).filter(Boolean));$('routingSummary').textContent=tracks.length+' spor · '+used.size+' busser'+(direct?' · '+direct+' spor går direkte til USB, utenom bussene':'');$('routingSummary').dataset.direct=String(direct>0);$('routeDirect').classList.toggle('hidden',!direct);$('routeDirect').disabled=locked;
   $('masterGain').value=gainToFader(master);$('masterGain').setAttribute('aria-valuetext',gainText(master));$('masterGainText').textContent=gainText(master);$('masterGain').disabled=$('masterReset').disabled=!song||busy;
   $('mixerTracks').innerHTML=tracks.map((t,i)=>{
    const info=player.info.get(t.assetId),route=t.bus?buses[t.bus-1]:t,color=trackColor(t,i,buses),names=root.StageProject.groupNames(o.state()),groups=(t.muteGroups||[]).map(g=>names[g-1]).join(' · ');
    return '<section class="stem-strip" data-track="'+i+'" style="--channel-color:'+color+';--channel-ink:'+ink(color)+'"><div class="strip-header"><span>SPOR '+String(i+1).padStart(2,'0')+'</span><button data-remove="'+i+'"'+(locked?' disabled':'')+' aria-label="Fjern '+esc(t.name)+'">✕</button></div><button type="button" class="route-badge '+(!t.bus?'direct-route':'')+'" data-edit-track="'+esc(t.id)+'"'+(locked?' disabled':'')+' title="Endre buss og grupper">'+(t.bus?'B'+String(t.bus).padStart(2,'0')+' '+esc(route.name):'DIREKTE')+' · USB '+route.output+(route.stereo?'–'+(route.output+1):'')+'</button><small class="stem-file">'+(info?(info.channels===1?'MONO':'STEREO')+' · '+Math.round(info.duration)+' s · '+((info.decodedBytes||0)/1048576).toFixed(1)+' MiB':'Ikke klargjort')+'</small><label class="stem-pan"><span>PAN</span><input type="range" data-field="pan" min="-1" max="1" step="0.01" value="'+t.pan+'"'+(busy||(!t.stereo&&!t.bus)?' disabled':'')+' aria-label="Panorering '+esc(t.name)+'"><span>L / R</span></label><div class="stem-switches"><button data-toggle="mute"'+(busy?' disabled':'')+' aria-pressed="'+t.mute+'" class="'+(t.mute?'mute-on':'')+'">MUTE</button><button data-toggle="solo"'+(busy?' disabled':'')+' aria-pressed="'+t.solo+'" class="'+(t.solo?'solo-on':'')+'">SOLO</button></div><div class="fader-value"><output data-gain="'+i+'">'+gainText(t.gain)+'</output><button data-track-reset title="Tilbake til 0 dB"'+(busy?' disabled':'')+'>0</button></div>'+faderMarkup({gain:t.gain,field:'data-field="gain"',meter:'data-meter="'+i+'"',label:'Volum '+t.name,disabled:busy})+'<div class="level-readout"><span>PEAK</span><output data-peak="'+i+'">−∞ dBFS</output></div><button type="button" class="group-summary" data-edit-track="'+esc(t.id)+'" title="Mutegrupper: '+esc(groups||'Ingen')+'"'+(locked?' disabled':'')+'><small>MUTEGRUPPER</small><span>'+esc(groups||'Ingen grupper')+'</span></button><button type="button" class="channel-setup" data-edit-track="'+esc(t.id)+'"'+(locked?' disabled':'')+'>⚙ KANALOPPSETT</button><label class="channel-label"><span>SPORNAVN</span><input data-field="name" value="'+esc(t.name)+'" aria-label="Spornavn"'+(busy?' disabled':'')+'></label></section>'
   }).join('');drawBuses();drawGroups();drawFiles();drawMemory();updateTransport()
  }
  async function load(autoIds=new Set()){
   gestures?.clear();const mine=++generation,song=o.song();let tracks=getTracks();loading=true;heldPeak=0;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;draw();
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
  function cancel(){gestures?.clear();generation++;player.cancel();loading=false;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;updateTransport()}
  async function addFiles(files){
   const list=[...files||[]],song=o.song(),mine=generation;if(!list.length)return;
   if(!song||player.playing||importing)return message('Velg en låt og stopp avspillingen før import.',true);
   if(setup?.flush()===false)return;
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
     const click=/(?:click|klikk|clix|metronom)/i.test(file.name),track=root.StageProject.track({assetId,name:file.name.replace(/\.[^.]+$/,''),fileName:file.name,fileBytes:data.byteLength,stereo:!click,output:click?3:1,bus:click?2:1});
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
   if(setup?.flush()===false)return;
   const scope=$('projectScope').value==='all'?'library':'song',state=structuredClone(o.state()),song=o.song();if(scope==='song'&&!song)return;
   delete state.opts.audioOutputMode;if(scope==='song'){state.songs=[structuredClone(song)];state.sets={};state.set='';state.idx=0}
   player.cancel();updateTransport();drawMemory();$('projectBackup').disabled=true;message('Lager prosjektfil med lokale lydfiler…');
   try{for(const item of state.songs)if(!item.playback?.tracks&&item.audioId){const legacy=await repo.get(item.audioId);if(!legacy?.data)item.playback={...item.playback,tracks:[]}}const blob=await root.StageProject.pack(state,repo,()=>{},{scope});const title=scope==='song'?song.title:'Bibliotek';prepared=new File([blob],'BenKen_'+title.replace(/[<>:"/\\|?*]/g,'_')+'.benken',{type:'application/x-benken-project'});$('projectDownload').disabled=false;$('projectShare').disabled=!(root.navigator.share&&root.navigator.canShare?.({files:[prepared]}));message('Prosjektfil klar. Velg DEL / LAGRE I FILER eller LAST NED.')}catch(error){message(error.message,true)}finally{$('projectBackup').disabled=false}
  }
  async function importProject(file){
   if(player.playing||loading||importing)return message('Stopp og vent til lydklargjøringen er ferdig før prosjektimport.',true);
   let restored=null,committed=false;
   try{
    const manifest=await root.StageProject.inspect(file),single=manifest.scope==='song';
    if(single&&manifest.state.songs.length!==1)throw Error('Låtfilen må inneholde nøyaktig én låt.');
    if(setup?.flush()===false)return;
    if(!single&&o.state().songs.length&&!root.confirm('Erstatte biblioteket og setlistene med dette prosjektet? Dagens tekstbackup lastes ned først.'))return;
    if(!single&&o.state().songs.length)o.backup?.();
    importing=true;draw();message('Importerer prosjektet og kopierer lydfiler lokalt…');
    restored=await root.StageProject.unpack(file,repo);
    const next=single?root.StageProject.mergeSong(o.state(),restored):restored;
    o.importState(next);committed=true;importing=false;o.imported?.();const ready=await load();if(ready&&!player.routeError())message(single?'Låten er lagt til med lokale lydfiler. Trykk SPILL.':'Bibliotek, setlister og lydfiler er importert. Trykk SPILL.')
   }catch(error){if(restored&&!committed)for(const key of root.StageProject.assets(restored))await repo.remove(key).catch(()=>{});importing=false;message(committed?'Låten og lydfilene er lagret. Trykk KLARGJØR LYD. '+error.message:error.message,true);draw()}
  }
  function dockControls(docked){const bar=$('performanceBar'),parent=$(docked?'mixerControlsDock':'performanceHome');if(bar.parentNode===parent)return;bar.remove();parent.appendChild(bar);o.controlsDockChanged?.(docked)}
  $('mixerControlsToggle').onclick=()=>o.toggleControls?.();
  $('mixerBtn').onclick=()=>{setup?.close();try{if(!player.playing){player.configure();const error=player.routeError();if(error)message(error,true)}}catch(error){message(error.message,true)}draw();$('mixerDialog').showModal();dockControls(true)};
  $('closeMixer').onclick=()=>{setup?.close();gestures?.clear();dockControls(false);$('mixerDialog').close()};
  $('mixerDialog').addEventListener('close',()=>{setup?.close();gestures?.clear();dockControls(false)});
  $('mixerPlay').onclick=$('audioPlay').onclick=playPause;$('mixerStop').onclick=$('audioStop').onclick=()=>{player.stop();draw()};
  $('stemAdd').onclick=()=>$('stemFiles').click();$('stemFiles').onchange=e=>{const files=[...e.target.files];e.target.value='';return addFiles(files)};
  $('audioChoose').onclick=()=>$('mixerBtn').click();$('audioFile').onchange=e=>{const files=[...e.target.files];e.target.value='';return addFiles(files)};
  function prepare(){if(setup?.flush()!==false)return load()}
  $('prepareAudio').onclick=prepare;$('refreshOutputs').onclick=()=>{try{player.configure();const error=player.routeError();message(error||'Utganger lest. Kontroller USB-rutingen.',!!error);draw()}catch(error){message(error.message,true)}};
  $('outputMode').onchange=e=>{if(player.playing)return;try{player.setMode(e.target.value);o.state().opts.audioOutputMode=player.mode;o.save();const error=player.routeError();message(error||(player.mode==='stereo'?'Stereoøving: også klikk går til 1–2.':'USB-ruting valgt.'),!!error);draw()}catch(error){message(error.message,true)}};
  $('masterGain').addEventListener('input',e=>changeMaster(faderToGain(e.target.value)));$('masterReset').onclick=()=>changeMaster(1);
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
  gestures=root.StageFaderGestures.mount({element:$('mixerDialog'),song:o.song,reset:input=>{
   if(input.disabled||loading||importing||!o.song())return;
   if(input.id==='masterGain'){changeMaster(1);return}
   try{const track=input.closest('[data-track]'),bus=input.closest('[data-bus]');
    if(track){const tracks=getTracks();tracks[Number(track.dataset.track)].gain=1;commit(tracks)}
    else if(bus){const buses=getBuses();buses[Number(bus.dataset.bus)-1].gain=1;commitBuses(buses)}
    else return;draw()
   }catch(error){message(error.message,true);draw()}
  }});
  $('mixerTracks').addEventListener('input',e=>{const input=e.target.closest('input[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(loading||importing){draw();return}try{const tracks=getTracks(),i=Number(strip.dataset.track),field=input.dataset.field;tracks[i][field]=field==='name'?input.value:field==='gain'?faderToGain(input.value):Number(input.value);commit(tracks);if(field==='gain'){input.setAttribute('aria-valuetext',gainText(tracks[i].gain));$('mixerTracks').querySelector('[data-gain="'+i+'"]').textContent=gainText(tracks[i].gain)}}catch(error){message(error.message,true);draw()}});
  $('mixerTracks').addEventListener('click',e=>{const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks(),i=Number(strip.dataset.track),toggle=e.target.closest('[data-toggle]'),remove=e.target.closest('[data-remove]');if(toggle&&toggle.dataset.toggle==='mute'&&player.groupMuted(tracks[i]))return message('Sporet er mutet av en aktiv mutegruppe. Slå av gruppen for å høre sporet.');if(toggle){tracks[i][toggle.dataset.toggle]=!tracks[i][toggle.dataset.toggle];commit(tracks);draw()}if(remove&&!player.playing&&!loading&&!importing&&root.confirm('Fjerne sporet fra låten? Lydfilen beholdes lokalt.')){tracks.splice(i,1);commit(tracks);load()}}catch(error){message(error.message,true)}});
  $('projectScope').addEventListener('change',()=>{invalidateProject();message('Velg LAG PROSJEKTFIL for det valgte innholdet.')});$('projectBackup').onclick=exportProject;$('projectDownload').onclick=()=>{if(prepared)download(prepared)};
  $('projectShare').onclick=()=>{if(prepared)root.navigator.share({files:[prepared],title:'BenKen-prosjekt med lyd'}).catch(error=>{if(error.name!=='AbortError')message(error.message,true)})};
  $('projectImport').onclick=()=>$('projectFile').click();$('projectFile').onchange=e=>{const file=e.target.files?.[0];e.target.value='';if(file)return importProject(file)};
  $('mixerTrackTab').onclick=()=>{view='tracks';draw()};$('mixerBusTab').onclick=()=>{view='buses';draw()};$('busShowAll').onchange=e=>{showAllBuses=e.target.checked;drawBuses()};
  function busInput(e){const input=e.target.closest('[data-bus-field]'),strip=e.target.closest('[data-bus]');if(!input||!strip)return;const field=input.dataset.busField;if((e.type==='change'&&input.tagName==='INPUT')||(e.type==='input'&&input.tagName==='SELECT'))return;if(loading||importing||(player.playing&&['stereo','output'].includes(field))){draw();return}try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];b[field]=field==='name'?input.value:field==='stereo'?input.value==='true':field==='gain'?faderToGain(input.value):Number(input.value);commitBuses(buses);if(field==='gain'){input.setAttribute('aria-valuetext',gainText(b.gain));strip.querySelector('[data-bus-gain]').textContent=gainText(b.gain)};if(field==='stereo'||field==='output'){const error=player.routeError();message(error||'Bussruting lagret for alle låter.',!!error);draw()}else updateTransport()}catch(error){message(error.message,true);draw()}}
  $('mixerTracks').addEventListener('change',e=>{if(e.target.dataset.field==='name')draw()});
  $('mixerBuses').addEventListener('change',e=>{if(e.target.dataset.busField==='name')draw()});
  $('mixerBuses').addEventListener('input',busInput);$('mixerBuses').addEventListener('change',busInput);
  $('mixerBuses').addEventListener('click',e=>{const strip=e.target.closest('[data-bus]');if(!strip||loading||importing)return;const mute=e.target.closest('[data-bus-mute]'),reset=e.target.closest('[data-bus-reset]');if(!mute&&!reset)return;try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];if(mute)b.mute=!b.mute;else b.gain=1;commitBuses(buses);draw()}catch(error){message(error.message,true)}});
  $('resetMasterPeak').onclick=()=>{heldPeak=0;$('masterPeakHoldText').textContent='−∞ dBFS'};
  $('mixerGroups').addEventListener('click',e=>{const button=e.target.closest('[data-global-group]');if(button)toggleGroup(Number(button.dataset.globalGroup))});
  $('mixerMasterMute').onclick=toggleMasterMute;
  function applySetup(draft){
   if(loading||importing||player.playing||player.seekResume)throw Error('Stopp avspillingen og vent til lyden er klar før du lagrer oppsett.');
   const song=o.song(),state=o.state(),current=getTracks();
   if(song!==draft.song||state!==draft.state||root.StageMixerSettings.signature(current,getBuses(),root.StageProject.groupNames(state))!==draft.signature)throw Error('Låt eller spor er endret. Lukk og åpne mikserinnstillingene igjen.');
   const tracks=current.map((t,i)=>{const next={...t};for(const key of ['name','color','bus','stereo','output','muteGroups']){if(draft.tracks[i][key]===undefined)delete next[key];else next[key]=draft.tracks[i][key]}return root.StageProject.track(next)});
   const currentBuses=getBuses(),buses=draft.buses.map((b,i)=>root.StageProject.bus({...b,gain:currentBuses[i].gain,mute:currentBuses[i].mute})),names=root.StageProject.groupNames({opts:{muteGroupNames:draft.names}}),previousPlayback=song.playback,previousOpts=state.opts;
   song.playback={...previousPlayback,tracks};state.opts={...previousOpts,audioBuses:buses,muteGroupNames:names};
   if(o.save()===false){song.playback=previousPlayback;state.opts=previousOpts;throw Error('Mikseroppsettet kunne ikke lagres. Ingen innstillinger er endret.')}
   invalidateProject();player.setBuses(buses);player.update(tracks);const error=player.routeError();message(error||'Navn, farger, busser og mutegrupper er lagret.',!!error);draw()
  }
  setup=root.StageMixerSettings.mount({state:o.state,song:o.song,player,tracks:getTracks,buses:getBuses,busy:()=>loading||importing,message,trackColor,busColor,drawFiles,apply:applySetup});
  function openSettings(target){if(!$('mixerDialog').hasAttribute('open'))$('mixerBtn').click();return setup.open(target)}
  $('mixerSettingsBtn').onclick=()=>setup.isOpen()?setup.close():openSettings();
  $('mixerAddFromEmpty').onclick=()=>openSettings({tab:'audio'});
  $('mixerWidth').onchange=e=>{const previous=o.state().opts.mixerWidth,next=e.target.value==='narrow'?'narrow':'normal';o.state().opts.mixerWidth=next;if(o.save()===false){o.state().opts.mixerWidth=previous;e.target.value=previous==='narrow'?'narrow':'normal';message('Mikserbredden kunne ikke lagres.',true);return}$('mixerDialog').classList.toggle('mixer-narrow',next==='narrow')};
  $('mixerTracks').addEventListener('click',e=>{const button=e.target.closest('[data-edit-track]');if(button&&!button.disabled)openSettings(button.dataset.editTrack)});
  $('mixerBuses').addEventListener('click',e=>{const button=e.target.closest('[data-edit-bus]');if(button&&!button.disabled)openSettings({busId:Number(button.dataset.editBus)})});
  $('projectDemo').onclick=async()=>{if(loading||importing||player.playing)return;$('projectDemo').disabled=true;message('Henter testlåten…');try{const response=await root.fetch('./demo/BenKen_Ui24R_Busstest.benken');if(!response.ok)throw Error('Testlåten mangler. Last opp demo-mappen fra V26.12 til GitHub.');await importProject(await response.blob())}catch(error){message(error.message,true)}finally{updateTransport()}};
  function meter(bar,out,peak){const info=root.StageAudio.level(peak||0);bar.style.height=info.percent+'%';bar.parentNode.setAttribute('aria-valuenow',String(Number.isFinite(info.db)?Math.max(-60,Math.min(0,info.db)):-60));bar.parentNode.dataset.zone=info.clip?'clip':info.db>=-6?'high':'normal';out.textContent=info.label+' dBFS'+(info.clip?' · CLIP':'')}
  setInterval(()=>{player.tick();o.time?.(player.currentTime,player.duration);const peak=player.meterMaster();heldPeak=Math.max(heldPeak,peak);if($('mixerDialog').open||$('mixerDialog').hasAttribute('open')){const levels=player.meters();$('mixerTracks').querySelectorAll('[data-meter]').forEach((bar,i)=>meter(bar,$('mixerTracks').querySelector('[data-peak="'+i+'"]'),levels[i]||0));const busLevels=player.meterBuses();$('mixerBuses').querySelectorAll('[data-bus-meter]').forEach(bar=>meter(bar,$('mixerBuses').querySelector('[data-bus-peak="'+bar.dataset.busMeter+'"]'),busLevels.get(Number(bar.dataset.busMeter))||0));meter($('masterMeter'),$('masterPeakText'),peak);$('masterPeakHoldText').textContent=root.StageAudio.level(heldPeak).label+' dBFS';$('mixerPosition').textContent=Math.floor(player.currentTime)+' / '+Math.ceil(player.duration)+' s'}setup?.refresh();for(const listener of listeners)listener()},100);
  return {player,repo,load,prepare,cancel,draw,openSettings,addFiles,exportProject,importProject,playPause,seek,toggleGroup,toggleMasterMute,groupState,tracks:getTracks,busy:()=>loading||importing,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn)}}
 }
 root.StageMixer={VERSION:'26.12',mount,gainToFader,faderToGain,faderMarkup};
})(typeof window!=='undefined'?window:globalThis);


// stage-performance.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const MAX_CONTROLS=32;
 const defaults=['prev','play','stop','next','mute','back','forward','mixer'];
 const actions={none:'Skjul',prev:'Forrige låt',play:'Spill / pause',stop:'Stopp',next:'Neste låt',mute:'Mute alle app-spor',back:'Bakover i låten',forward:'Fremover i låten',begin:'Til begynnelsen',mixer:'Mikser',files:'Lydfiler for låten',scroll:'Autoscroll',fullscreen:'Fullskjerm',group1:'Mutegruppe 1',group2:'Mutegruppe 2',group3:'Mutegruppe 3',group4:'Mutegruppe 4',group5:'Mutegruppe 5',group6:'Mutegruppe 6',setlist:'Vis / skjul setlist',library:'Bibliotek',settings:'Innstillinger',page:'To tekstkolonner',resetScroll:'Tekst til toppen',controls:'Tilpass kontrollfelt',mixerSetup:'Mikserinnstillinger',waveform:'Vis / skjul bølgeform',prepare:'Klargjør lyd',controlsToggle:'Vis / skjul kontrollfelt'};
 function controls(value){const list=Array.isArray(value)?value:defaults.map(action=>({action}));return list.slice(0,MAX_CONTROLS).map(v=>({action:Object.hasOwn(actions,v?.action)?v.action:'none',label:String(v?.label||'').slice(0,18)}))}
 async function peaks(buffer,bins=600,cancelled=()=>false){
  if(!buffer?.getChannelData||!buffer.length)return null;bins=Math.max(2,Math.min(2000,Math.floor(Number(bins)||600)));const channels=Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c)),out=new Float32Array(bins);let work=0;
  for(let b=0;b<bins;b++){if(cancelled())return null;const start=Math.floor(b*buffer.length/bins),end=Math.min(buffer.length,Math.max(start+1,Math.floor((b+1)*buffer.length/bins)));let peak=0;for(const data of channels)for(let i=start;i<end;i++)peak=Math.max(peak,Math.abs(data[i]));out[b]=Number.isFinite(peak)?peak:0;work+=(end-start)*channels.length;if(work>250000){work=0;await new Promise(resolve=>root.setTimeout(resolve,0))}}
  return out
 }
 function wavePath(values){let max=0;for(const v of values)max=Math.max(max,v);const n=values.length,scale=max?44/max:0;return 'M '+Array.from(values,(v,i)=>(i/(n-1)*1000).toFixed(2)+','+(50-v*scale).toFixed(2)).join(' L ')+' L '+Array.from(values,(v,i)=>((n-1-i)/(n-1)*1000).toFixed(2)+','+(50+values[n-1-i]*scale).toFixed(2)).join(' L ')+' Z'}
 function icon(action){const path={play:'M8 4 23 14 8 24Z',pause:'M8 5H12V23H8ZM18 5H22V23H18Z',stop:'M7 6H24V23H7Z',prev:'M6 5V24M24 5 10 14 24 24Z',next:'M24 5V24M6 5 20 14 6 24Z',mute:'M5 11H11L18 5V24L11 18H5ZM22 10 28 19M28 10 22 19',unmute:'M5 11H11L18 5V24L11 18H5ZM22 9Q29 14 22 20',back:'M14 6 4 14 14 22ZM26 6 16 14 26 22Z',forward:'M4 6 14 14 4 22ZM16 6 26 14 16 22Z',begin:'M6 5V24M25 6 10 14 25 23Z',mixer:'M6 4V25M15 4V25M24 4V25M3 10H9M12 20H18M21 13H27',files:'M3 7H13L16 10H28V24H3Z',scroll:'M7 5H23M7 11H23M7 17H18M21 16V26M17 22 21 26 25 22',fullscreen:'M4 11V5H11M19 5H26V11M26 19V25H19M11 25H4V19',setlist:'M8 7H27M8 14H27M8 21H27M3 7H4M3 14H4M3 21H4',library:'M4 5H13V25H4ZM17 5H26V25H17Z',settings:'M16 4V9M16 21V26M5 15H10M22 15H27M8 7 12 11M20 19 24 23M8 23 12 19M20 11 24 7M16 9A6 6 0 1 0 16 21A6 6 0 1 0 16 9',page:'M3 5H14V25H3ZM18 5H29V25H18Z',resetScroll:'M5 7H27M16 25V12M10 18 16 12 22 18',controls:'M3 7H29M3 15H29M3 23H29M9 4V10M22 12V18M13 20V26',mixerSetup:'M6 4V25M15 4V25M24 4V25M3 10H9M12 20H18M21 13H27',waveform:'M2 15H5L8 5 11 25 15 8 18 22 21 11 24 19 27 15H30',prepare:'M16 4V19M10 13 16 19 22 13M5 21V26H27V21',controlsToggle:'M3 6H29V25H3ZM3 17H29M11 6V17M21 6V17'}[action];return path?'<svg viewBox="0 0 32 30" aria-hidden="true"><path d="'+path+'"/></svg>':'<span class="action-group-number">'+action.replace('group','')+'</span>'}
 function mount(o){
  const $=id=>document.getElementById(id),mixer=o.mixer,player=mixer.player;
  let scrub=null,waveBuffer=null,waveData=null,waveToken=0,controlsKey='',trackKey='',lastMessage='',undockedHeight=0;
  const opts=()=>o.state().opts,step=()=>Math.max(1,Math.min(120,Number(opts().seekStepSeconds)||10)),ready=()=>!mixer.busy()&&player.duration>0&&player.buffers.length>0&&player.buffers.length===player.tracks.length&&!player.preparing;
  function report(message){lastMessage=message||'';$('performanceStatus').textContent=lastMessage}
  const time=t=>{const value=Math.max(0,Math.floor(t||0));return String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0')};
  function setting(key,value){const previous=opts()[key];opts()[key]=value;if(o.save()===false){opts()[key]=previous;report('Innstillingen kunne ikke lagres.');return false}refresh();return true}
  function position(value=player.currentTime){const duration=player.duration||0,at=Math.max(0,Math.min(duration,value||0)),fraction=duration?at/duration:0;$('performanceElapsed').textContent=time(at);$('performanceDuration').textContent=time(duration);$('performanceRemaining').textContent='−'+time(duration-at);$('performanceSeek').max=String(duration||1);if(!scrub)$('performanceSeek').value=String(at);$('performanceSeek').setAttribute('aria-valuetext',time(at)+' av '+time(duration));$('performanceProgress').style.width=(fraction*100)+'%';$('performanceCursor').style.left=(fraction*100)+'%'}
  function canSeek(){return ready()&&(opts().allowSeekDuringPlayback!==false||(!player.playing&&!player.seekResume))}
  function beginScrub(){if(scrub||!canSeek())return;const resume=player.playing||!!player.seekResume,original=player.currentTime;player.pause();scrub={song:o.song(),generation:player.generation,serial:player.seekSerial,resume,original,preview:original};o.activity?.()}
  function clearScrub(){scrub=null}
  async function commitScrub(){const pending=scrub;if(!pending)return;clearScrub();if(pending.song!==o.song()||pending.generation!==player.generation||pending.serial!==player.seekSerial){refresh();return}await mixer.seek(pending.preview,pending.resume);o.activity?.();refresh()}
  async function cancelScrub(){const pending=scrub;clearScrub();if(pending&&pending.song===o.song()&&pending.generation===player.generation&&pending.serial===player.seekSerial)await mixer.seek(pending.original,pending.resume);o.activity?.();refresh()}
  async function act(action){
   const wasSeeking=scrub;clearScrub();
   if(['setlist','library','settings','fullscreen','page'].includes(action)&&$('mixerDialog').hasAttribute('open'))$('closeMixer').click();
   if(action==='play'){if(wasSeeking){await mixer.seek(wasSeeking.preview,false)}await mixer.playPause()}
   else if(action==='stop'){player.stop();report('')}
   else if(action==='prev'||action==='next')$(action).click();
   else if(action==='mute')mixer.toggleMasterMute();
   else if(/^group[1-6]$/.test(action))mixer.toggleGroup(Number(action.slice(-1)));
   else if(['back','forward','begin'].includes(action)&&canSeek()){const from=wasSeeking?.preview??player.currentTime;await mixer.seek(action==='begin'?0:from+(action==='back'?-step():step()),wasSeeking?wasSeeking.resume:undefined)}
   else if(action==='mixer'){if($('mixerDialog').hasAttribute('open'))$('closeMixer').click();else $('mixerBtn').click()}
   else if(action==='files')mixer.openSettings({tab:'audio'});
   else if(action==='scroll')$('autoBtn').click();else if(action==='fullscreen')$('stageToggle').click();
   else if(action==='controlsToggle')$('controlsBtn').click();else if(action==='setlist')$('view').click();else if(action==='library')o.openLibrary?.();else if(action==='settings')$('settingsBtn').click();else if(action==='page')$('pageBtn').click();else if(action==='resetScroll')o.resetScroll?.();else if(action==='controls')openSettings();else if(action==='mixerSetup')mixer.openSettings();else if(action==='waveform')$('performanceWaveToggle').click();else if(action==='prepare'&&!player.playing&&!mixer.busy())await mixer.prepare();
   if(wasSeeking&&!['play','stop','prev','next','back','forward','begin'].includes(action)&&wasSeeking.generation===player.generation)await mixer.seek(wasSeeking.preview,wasSeeking.resume);
   o.activity?.();refresh()
  }
  function renderControls(){
   const groups=mixer.groupState(),layout=controls(opts().stageControls),running=player.playing||!!player.seekResume||!!scrub?.resume;
   const key=JSON.stringify([layout,groups,!!player.masterMuted,running,ready(),$('audioPlay').disabled,$('prev').disabled,$('next').disabled,step(),opts().allowSeekDuringPlayback,$('autoBtn').getAttribute('aria-pressed'),$('stageToggle').getAttribute('aria-pressed'),$('view').getAttribute('aria-pressed'),$('settingsBtn').getAttribute('aria-pressed'),$('pageBtn').classList.contains('active'),opts().waveformVisible]);if(key===controlsKey)return;controlsKey=key;
   $('performanceControls').innerHTML=layout.filter(c=>c.action!=='none').map(c=>{const group=/^group[1-6]$/.test(c.action)?Number(c.action.slice(-1)):0,active=group?groups.active[group-1]:c.action==='mute'?!!player.masterMuted:c.action==='play'?running:c.action==='scroll'?$('autoBtn').getAttribute('aria-pressed')==='true':c.action==='fullscreen'?$('stageToggle').getAttribute('aria-pressed')==='true':c.action==='setlist'?$('view').getAttribute('aria-pressed')==='true':c.action==='settings'?$('settingsBtn').getAttribute('aria-pressed')==='true':c.action==='page'?$('pageBtn').classList.contains('active'):c.action==='waveform'?opts().waveformVisible===true:false;
    const label=c.label||(group?groups.names[group-1]:c.action==='play'?(running?'PAUSE':'SPILL'):c.action==='mute'?(active?'LYD PÅ':'MUTE'):c.action==='back'?'−'+step()+' s':c.action==='forward'?'+'+step()+' s':{prev:'FORRIGE',next:'NESTE',stop:'STOPP',begin:'START',mixer:'MIKSER',files:'LYDFILER',scroll:'SCROLL',fullscreen:'FULLSKJERM',setlist:'SETLIST',library:'BIBLIOTEK',settings:'SETTINGS',page:'KOLONNER',resetScroll:'TEKST TIL TOPP',controls:'TILPASS',mixerSetup:'MIKSEROPPSETT',waveform:'BØLGEFORM',prepare:'KLARGJØR LYD',controlsToggle:'SKJUL KONTROLLER'}[c.action]);
    const disabled=c.action==='play'?$('audioPlay').disabled:c.action==='prev'?$('prev').disabled:c.action==='next'?$('next').disabled:['back','forward','begin'].includes(c.action)?!canSeek():c.action==='prepare'?mixer.busy()||player.playing||!!player.seekResume:false;
    return '<button type="button" class="performance-action action-'+c.action+(active?' action-active':'')+'" data-action="'+c.action+'" title="'+esc(label)+'" aria-label="'+esc(label)+'"'+(['play','mute','scroll','fullscreen','setlist','settings','page','waveform'].includes(c.action)||group?' aria-pressed="'+active+'"':'')+(disabled?' disabled':'')+'>'+icon(c.action==='play'&&running?'pause':c.action==='mute'&&active?'unmute':c.action)+'<span>'+esc(label)+'</span></button>'
   }).join('')
  }
  function refreshWave(tracks){
   const song=o.song(),id=song?.playback?.waveformTrackId;let index=tracks.findIndex(t=>t.id===id);if(index<0)index=Math.max(0,tracks.findIndex(t=>!/(click|klikk|clix|metronom)/i.test(t.name)));const selected=tracks[index],key=JSON.stringify(tracks.map(t=>[t.id,t.name]));
   if(key!==trackKey){trackKey=key;$('performanceWaveTrack').innerHTML=tracks.map(t=>'<option value="'+esc(t.id)+'">'+esc(t.name)+'</option>').join('')}$('performanceWaveTrack').value=selected?.id||'';
   const enabled=opts().waveformVisible===true&&opts().controlsButtonsOnly!==true;$('performanceWaveTrack').classList.toggle('hidden',!enabled||!tracks.length);$('performanceWaveToggle').setAttribute('aria-pressed',String(enabled));$('performanceTimeline').classList.toggle('has-waveform',enabled);$('performanceWaveGraphic').classList.toggle('hidden',!enabled);
   const buffer=opts().controlsButtonsOnly!==true&&ready()?player.buffers[index]:null;
   if(buffer!==waveBuffer){waveToken++;waveBuffer=buffer;waveData=null;$('performanceWaveGraphic').innerHTML='';$('performanceWaveState').textContent=''}
   if(!enabled||!buffer||waveData)return;
   const token=waveToken;waveData='pending';$('performanceWaveState').textContent='Leser bølgeform…';
   peaks(buffer,600,()=>token!==waveToken).then(values=>{if(token!==waveToken)return;waveData=values||'unavailable';$('performanceWaveState').textContent=values?'':'Bølgeform er ikke tilgjengelig.';if(values)$('performanceWaveGraphic').innerHTML='<svg viewBox="0 0 1000 100" preserveAspectRatio="none" role="img" aria-label="Bølgeform '+esc(selected.name)+'"><path d="'+wavePath(values)+'"/></svg>'}).catch(error=>{if(token===waveToken){waveData='unavailable';$('performanceWaveState').textContent='Kunne ikke tegne bølgeform.'}})
  }
  function height(){if(opts().stageBarVisible===false)return 0;return $('performanceBar').closest('#mixerDialog')?undockedHeight:Number($('performanceBar').offsetHeight)||0}
  function measure(){if(!$('performanceBar').closest('#mixerDialog')&&opts().stageBarVisible!==false)undockedHeight=Number($('performanceBar').offsetHeight)||0;document.documentElement.style.setProperty('--performance-space',height()+'px')}
  function refresh(){
   if(scrub&&(scrub.song!==o.song()||scrub.generation!==player.generation||scrub.serial!==player.seekSerial))clearScrub();
   $('mixerControlsToggle').setAttribute('aria-pressed',String(opts().stageBarVisible!==false));
   $('performanceBar').classList.toggle('buttons-only',opts().controlsButtonsOnly===true);$('performanceBar').classList.toggle('icons-only',opts().controlsIconsOnly===true);$('controlsBtn').setAttribute('aria-pressed',String(opts().stageBarVisible!==false));$('performanceControls').classList.toggle('controls-wrap',opts().stageControlsWrap===true);$('performanceBar').classList.toggle('hidden',opts().stageBarVisible===false);document.body.classList.toggle('has-performance-bar',opts().stageBarVisible!==false);$('performanceSong').textContent=o.song()?.title||'Velg en låt';$('performanceSeek').disabled=!canSeek()&&!scrub;
   refreshWave(mixer.tracks());position(scrub?.preview??player.currentTime);renderControls();measure()
  }
  function readControlRows(){return Array.from($('performanceControlRows').querySelectorAll('[data-slot]'),(el,i)=>({action:el.value,label:$('performanceControlRows').querySelector('[data-slot-label="'+i+'"]').value}))}
  function drawControlRows(layout,count=Math.max(12,layout.length)){
   count=Math.min(MAX_CONTROLS,count);$('performanceControlRows').innerHTML=Array.from({length:count},(_,i)=>{const c=layout[i]||{action:'none',label:''};return '<label class="control-config-row"><span>'+(i+1)+'</span><select data-slot="'+i+'">'+Object.entries(actions).map(([value,label])=>'<option value="'+value+'"'+(value===c.action?' selected':'')+'>'+esc(label)+'</option>').join('')+'</select><input data-slot-label="'+i+'" maxlength="18" value="'+esc(c.label)+'" placeholder="Valgfri knappetekst"></label>'}).join('');
   $('performanceControlRows').querySelectorAll('[data-slot]').forEach((el,i)=>el.value=layout[i]?.action||'none');$('performanceControlsAdd').disabled=count>=MAX_CONTROLS
  }
  function openSettings(){
   $('performanceButtonsOnly').checked=opts().controlsButtonsOnly===true;$('performanceIconsOnly').checked=opts().controlsIconsOnly===true;$('performanceBarEnabled').checked=opts().stageBarVisible!==false;$('performanceWrapEnabled').checked=opts().stageControlsWrap===true;$('performanceWaveEnabled').checked=opts().waveformVisible===true;$('performanceAllowSeek').checked=opts().allowSeekDuringPlayback!==false;$('performanceSeekStep').value=String(step());
   drawControlRows(controls(opts().stageControls));$('performanceGroupNames').innerHTML=mixer.groupState().names.map((name,i)=>'<label>Gruppe '+(i+1)+'<input data-group-name="'+i+'" maxlength="24" value="'+esc(name)+'"></label>').join('');$('performanceSettingsStatus').textContent='';$('performanceSettings').showModal();o.activity?.()
  }
  function toggleVisible(){if(scrub)cancelScrub();const saved=setting('stageBarVisible',opts().stageBarVisible===false);o.activity?.();return saved}
  function saveSettings(){
   const previous=o.state().opts,next={...previous,stageBarVisible:$('performanceBarEnabled').checked,stageControlsWrap:$('performanceWrapEnabled').checked,controlsButtonsOnly:$('performanceButtonsOnly').checked,controlsIconsOnly:$('performanceIconsOnly').checked,waveformVisible:$('performanceWaveEnabled').checked,allowSeekDuringPlayback:$('performanceAllowSeek').checked,seekStepSeconds:Math.max(1,Math.min(120,Number($('performanceSeekStep').value)||10)),stageControls:controls(Array.from($('performanceControlRows').querySelectorAll('[data-slot]'),(el,i)=>({action:el.value,label:$('performanceControlRows').querySelector('[data-slot-label="'+i+'"]').value}))),muteGroupNames:Array.from($('performanceGroupNames').querySelectorAll('[data-group-name]'),el=>el.value)};
   try{root.StageProject.groupNames({opts:next});o.state().opts=next;if(o.save()===false){o.state().opts=previous;throw Error('Kontrollinnstillingene kunne ikke lagres.')}mixer.draw();$('performanceSettings').close();refresh();o.activity?.()}catch(error){$('performanceSettingsStatus').textContent=error.message}
  }
  $('performanceControls').addEventListener('click',e=>{const button=e.target.closest('[data-action]');if(button&&!button.disabled)return act(button.dataset.action)});
  $('performanceSeek').addEventListener('pointerdown',beginScrub);
  $('performanceSeek').addEventListener('input',e=>{const value=Number(e.target.value)||0;if(!scrub)beginScrub();if(!scrub)return;scrub.preview=Math.max(0,Math.min(player.duration,value));e.target.value=String(scrub.preview);position(scrub.preview);o.activity?.()});
  $('performanceSeek').addEventListener('change',commitScrub);
  document.addEventListener('pointerup',()=>{if(scrub)Promise.resolve().then(commitScrub)});document.addEventListener('pointercancel',()=>{if(scrub)cancelScrub()});
  $('performanceWaveToggle').onclick=()=>{const previous=o.state().opts,visible=previous.controlsButtonsOnly===true||previous.waveformVisible!==true;o.state().opts={...previous,waveformVisible:visible,...(visible?{controlsButtonsOnly:false}:{})};if(o.save()===false){o.state().opts=previous;report('Innstillingen kunne ikke lagres.')}refresh()};
  $('performanceWaveTrack').onchange=e=>{const song=o.song();if(!song)return;const previous=song.playback;song.playback={...previous,waveformTrackId:e.target.value};if(o.save()===false){song.playback=previous;report('Sporvalget kunne ikke lagres.')}refresh()};
  $('performanceConfig').onclick=openSettings;$('performanceSettingsClose').onclick=()=>{$('performanceSettings').close();o.activity?.()};$('performanceSettingsSave').onclick=saveSettings;
  $('performanceControlsReset').onclick=()=>drawControlRows(defaults.map(action=>({action})));
  $('performanceControlsAll').onclick=()=>drawControlRows(Object.keys(actions).filter(action=>action!=='none').map(action=>({action})));
  $('performanceControlsAdd').onclick=()=>{const layout=readControlRows();if(layout.length<MAX_CONTROLS)drawControlRows([...layout,{action:'none',label:''}],layout.length+1)};
  $('performanceSettings').addEventListener('close',()=>o.activity?.());
  const unsubscribe=mixer.subscribe(refresh);if(root.ResizeObserver){const observer=new root.ResizeObserver(measure);observer.observe($('performanceBar'))}refresh();
  return {refresh,openSettings,toggleVisible,act,isScrubbing:()=>!!scrub,height,cancelScrub,unsubscribe}
 }
 root.StagePerformance={VERSION:'26.12',MAX_CONTROLS,mount,peaks,wavePath,controls,actions};
})(typeof window!=='undefined'?window:globalThis);

