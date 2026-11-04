/* Offline reference meter. ITU-R BS.1770-5 Annex 1, stereo, 48 kHz.
   Temporary mix chunks live in IndexedDB, never in the library. No live audio processing. */
(function(root){
'use strict';
const RATE=48000,STEP=4800,CHUNK=48000;
class Biquad{
 constructor(b,a){this.b=b;this.a=a;this.x1=this.x2=this.y1=this.y2=0}
 tick(x){const y=this.b[0]*x+this.b[1]*this.x1+this.b[2]*this.x2-this.a[0]*this.y1-this.a[1]*this.y2;this.x2=this.x1;this.x1=x;this.y2=this.y1;this.y1=y;return y}
}
class Meter{
 constructor(){this.filters=Array.from({length:2},()=>[new Biquad([1.53512485958697,-2.69169618940638,1.19839281085285],[-1.69065929318241,.73248077421585]),new Biquad([1,-2,1],[-1.99004745483398,.99007225036621])]);this.blocks=[];this.hops=[];this.sum=0;this.count=0;this.peak=0}
 push(left,right){for(let i=0;i<left.length;i++){const l=Number(left[i]),r=Number(right[i]);if(!Number.isFinite(l)||!Number.isFinite(r))throw Error('Invalid audio sample.');this.peak=Math.max(this.peak,Math.abs(l),Math.abs(r));let e=0;for(let c=0;c<2;c++){const [a,b]=this.filters[c],y=b.tick(a.tick(c?r:l));e+=y*y}this.sum+=e;if(++this.count===STEP){this.hops.push(this.sum);if(this.hops.length>4)this.hops.shift();if(this.hops.length===4)this.blocks.push(this.hops.reduce((a,b)=>a+b,0)/(STEP*4));this.sum=0;this.count=0}}}
 finish(){const loud=e=>-.691+10*Math.log10(e),absolute=this.blocks.filter(e=>loud(e)>-70);if(!absolute.length)throw Error('No measurable audio above −70 LUFS (at least 0.4 seconds required).');const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length,threshold=loud(mean(absolute))-10,gated=absolute.filter(e=>loud(e)>threshold);return {integrated:loud(mean(gated)),samplePeak:this.peak,blocks:gated.length}}
}
function plan(integrated,peak,target){if(![integrated,peak,target].every(Number.isFinite)||peak<=0||target< -60||target> -5)throw Error('Choose Target LUFS between −60 and −5.');const requested=10**((target-integrated)/20),ceiling=10**(-3/20)/peak,gain=Math.min(2,requested,ceiling);if(!(gain>0))throw Error('Invalid loudness adjustment.');return {gain,achieved:integrated+20*Math.log10(gain),limited:gain<requested*(1-1e-6),reason:gain<requested*(1-1e-6)?(ceiling<=2?'Peak headroom (−3 dBFS sample ceiling)':'Song Master maximum (+6 dB)'):''}}
// Same linear balance, mono fold-down and bus gain as BrowserPlayer's reference mix.
function renderChunk(p,l,r){
 const n=l.length,left=new Float32Array(n),right=new Float32Array(n),mono=new Float32Array(n),pan=Math.max(-1,Math.min(1,p.pan)),g=p.gain;
 for(let i=0;i<n;i++){
  const a=l[i],b=r?r[i]:a,source=p.stereo?a:(r?(a+b)*.5:a),sourceRight=p.stereo?b:source;
  let x=source*g*(pan>0?1-pan:1),y=sourceRight*g*(pan<0?1+pan:1);
  if(!p.hasBus&&!p.stereo)x=y=source*g;
  if(p.hasBus&&!p.routeStereo)x=y=(x+y)*.5;
  left[i]=x;right[i]=y;mono[i]=p.hasBus?(x+y)*.5:source*g;
 }
 return {left,right,mono};
}
root.BenKenLoudnessDSP={Meter,plan,renderChunk,RATE,CHUNK};
if(typeof root.postMessage!=='function'||typeof root.document!=='undefined')return;
let db=null,dbName='',maxFrames=0;const outputs=new Set();
const request=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
async function read(key){return request(db.transaction('mix').objectStore('mix').get(key))}
async function write(key,value){return new Promise((resolve,reject)=>{const tx=db.transaction('mix','readwrite');tx.objectStore('mix').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Temporary audio storage failed.'))})}
async function add(key,samples){const saved=await read(key)||new Float32Array(CHUNK);for(let i=0;i<samples.length;i++)saved[i]+=samples[i];await write(key,saved)}
async function cleanup(){if(db)db.close();db=null;if(dbName)await new Promise(resolve=>{const r=indexedDB.deleteDatabase(dbName);r.onsuccess=r.onerror=r.onblocked=resolve});dbName=''}
async function command(p){
 if(p.command==='init'){dbName=p.name;const r=indexedDB.open(dbName,1);r.onupgradeneeded=()=>r.result.createObjectStore('mix');db=await request(r);return true}
 if(p.command==='cleanup'){await cleanup();return true}
 if(p.command==='add'){
  const l=new Float32Array(p.left),r=p.right?new Float32Array(p.right):null,n=l.length,{left:outL,right:outR,mono}=renderChunk(p,l,r);
  const chunk=p.offset/CHUNK;maxFrames=Math.max(maxFrames,p.offset+n);
  if(p.include){await add('L:'+chunk,outL);await add('R:'+chunk,outR)}
  await add('A:'+chunk,outL);await add('B:'+chunk,outR);
  // Also examine discrete routes. Conservative mono summation avoids hidden overloads.
  if(p.routeStereo){await add('U'+p.output+':'+chunk,outL);await add('U'+(p.output+1)+':'+chunk,outR);outputs.add(p.output);outputs.add(p.output+1)}else{await add('U'+p.output+':'+chunk,mono);outputs.add(p.output)}
  return true;
 }
 if(p.command==='finish'){
  const meter=new Meter();let peak=0;for(let offset=0;offset<maxFrames;offset+=CHUNK){const n=Math.min(CHUNK,maxFrames-offset),c=offset/CHUNK,l=await read('L:'+c)||new Float32Array(CHUNK),r=await read('R:'+c)||new Float32Array(CHUNK);meter.push(l.subarray(0,n),r.subarray(0,n));for(const name of ['A:','B:']){const all=await read(name+c);if(all)for(let i=0;i<n;i++)peak=Math.max(peak,Math.abs(all[i]))}for(const output of outputs){const data=await read('U'+output+':'+c);if(data)for(let i=0;i<n;i++)peak=Math.max(peak,Math.abs(data[i]))}}
  const measured=meter.finish();return {...measured,routeSamplePeak:peak,samplePeak:Math.max(peak,measured.samplePeak),seconds:maxFrames/RATE};
 }
 throw Error('Unknown analysis command.');
}
root.onmessage=async event=>{const p=event.data;try{root.postMessage({id:p.id,value:await command(p)})}catch(error){root.postMessage({id:p.id,error:error.message||String(error)})}};
})(typeof self!=='undefined'?self:globalThis);
