(function(root){
 'use strict';
 const MAGIC='BKSP0001', MAX_MANIFEST=8*1024*1024, MAX_TRACKS=32;
 const clamp=(v,a,b,d)=>Number.isFinite(Number(v))?Math.min(b,Math.max(a,Number(v))):d;
 const id=()=>root.crypto.randomUUID();
 const assetKey=v=>typeof v==='string'&&/^[-a-zA-Z0-9]{1,120}$/.test(v);
 function track(t){if(!t||!assetKey(t.assetId))throw Error('Sporet mangler en gyldig lydfil.');return {id:assetKey(t.id)?t.id:id(),assetId:t.assetId,name:String(t.name||'Lydspor').slice(0,160),gain:clamp(t.gain,0,2,1),pan:clamp(t.pan,-1,1,0),mute:!!t.mute,solo:!!t.solo,output:Math.floor(clamp(t.output,1,64,1)),stereo:t.stereo!==false};}
 function tracks(song){const a=song?.playback?.tracks;if(a){if(!Array.isArray(a)||a.length>MAX_TRACKS)throw Error('Maksimalt 32 lydspor per låt.');return a.map(track)}return song?.audioId?[track({id:'legacy-'+song.audioId,assetId:song.audioId,name:'Backingtrack'})]:[];}
 function masterGain(song){return clamp(song?.playback?.masterGain??1,0,2,1)}
 function assets(state){const keys=new Set();for(const s of state.songs){for(const t of tracks(s))keys.add(t.assetId)}return [...keys];}
 function validateState(s){if(!root.StageCore.valid(s))throw Error('Ugyldig sangbibliotek.');for(const song of s.songs)tracks(song);return s;}
 async function pack(state,repo,onProgress=()=>{},options={}){
  validateState(state);const entries=[],parts=[];let total=0;for(const key of assets(state)){const value=await repo.get(key);if(!value)throw Error('Lydfil mangler på denne enheten: '+key+'. Hent filen før du lager full backup.');if(!value.data)throw Error('Lydfilen mangler data: '+key);const data=value.data instanceof Blob?value.data:new Blob([value.data]);total+=data.size;if(total>256*1024*1024)throw Error('Denne prosjektfilen overstiger 256 MB. Velg Aktuell låt og lagre låtene hver for seg.');entries.push({id:key,name:value.name||key,type:value.type||'application/octet-stream',size:data.size});parts.push(data);onProgress(entries.length)}
  const metadata=new TextEncoder().encode(JSON.stringify({format:'BenKen Stage Pro',version:1,appVersion:"26.5",scope:options.scope||"library",state,assets:entries}));if(metadata.length>MAX_MANIFEST)throw Error('Prosjektbeskrivelsen er for stor.');const header=new Uint8Array(12);header.set(new TextEncoder().encode(MAGIC));new DataView(header.buffer).setUint32(8,metadata.length,true);return new Blob([header,metadata,...parts],{type:'application/x-benken-project'});
 }
 async function inspect(blob){
  const header=new Uint8Array(await blob.slice(0,12).arrayBuffer());if(header.length!==12||new TextDecoder().decode(header.slice(0,8))!==MAGIC)throw Error('Dette er ikke et BenKen-prosjekt.');const length=new DataView(header.buffer).getUint32(8,true);if(!length||length>MAX_MANIFEST||12+length>blob.size)throw Error('Prosjektfilen er skadet.');let manifest;try{manifest=JSON.parse(await blob.slice(12,12+length).text())}catch{throw Error('Prosjektbeskrivelsen kan ikke leses.')}
  if(manifest.format!=='BenKen Stage Pro'||manifest.version!==1||!Array.isArray(manifest.assets)||manifest.assets.length>20000)throw Error('Prosjektformatet støttes ikke.');validateState(manifest.state);const keys=new Set();let cursor=12+length;const entries=[];for(const a of manifest.assets){if(!assetKey(a.id)||keys.has(a.id)||!Number.isSafeInteger(a.size)||a.size<=0||a.size>2147483648)throw Error('Ugyldig lydfil i prosjektet.');keys.add(a.id);entries.push({...a,start:cursor});cursor+=a.size}if(cursor!==blob.size)throw Error('Prosjektfilen er ufullstendig eller skadet.');for(const key of assets(manifest.state))if(!keys.has(key))throw Error('Prosjektet mangler en lydfil.');return {...manifest,assets:entries};
 }
 async function unpack(blob,repo){
  const manifest=await inspect(blob),mapping=new Map(),created=[];try{for(const a of manifest.assets){const key=id();mapping.set(a.id,key);await repo.put(key,{name:a.name,type:a.type,data:await blob.slice(a.start,a.start+a.size).arrayBuffer()});created.push(key)}}catch(e){for(const key of created)await repo.remove(key).catch(()=>{});throw e}
  const state=structuredClone(manifest.state);for(const song of state.songs){if(song.audioId){if(mapping.has(song.audioId))song.audioId=mapping.get(song.audioId);else delete song.audioId;}if(song.playback?.tracks)for(const t of song.playback.tracks)t.assetId=mapping.get(t.assetId)}return root.StageCore.normalize(state);
 }
 root.StageProject={MAGIC,MAX_TRACKS,track,tracks,masterGain,assets,validateState,pack,inspect,unpack,id};
})(typeof window!=='undefined'?window:globalThis);
