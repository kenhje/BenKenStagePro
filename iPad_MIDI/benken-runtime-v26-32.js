// BenKen V26.32: one versioned runtime prevents mixed helper versions.

// stage-core.js
(function (root) {
  'use strict';
  const sectionColors={verse:'#7cd9ed',chorus:'#ffd073',bridge:'#cfacff',intro:'#8bdeac',solo:'#ffa579',outro:'#f0a9cf',melody:'#82c4ff'};
  function songColor(song){return typeof song?.songColor==='string'&&/^#[0-9a-f]{6}$/i.test(song.songColor)?song.songColor.toLowerCase():undefined}
  function englishDefaults(state){
    const opts=state.opts||{};
    if(Array.isArray(opts.audioBuses))for(const bus of opts.audioBuses){if(bus.name==='Klikk')bus.name='Click';else if(bus.name==='Buss '+bus.id)bus.name='Bus '+bus.id}
    if(Array.isArray(opts.muteGroupNames)){const names=[...opts.muteGroupNames];opts.muteGroupNames=names.map((name,i)=>{if(name!=='Gruppe '+(i+1))return name;let next='Group '+(i+1),suffix=2;while(names.some((n,j)=>j!==i&&String(n).toLowerCase()===next.toLowerCase()))next='Group '+(i+1)+' ('+(suffix++)+')';names[i]=next;return next})}
    return state
  }
  function valid(s){return !!(s&&Array.isArray(s.songs)&&s.songs.length<=10000&&s.sets&&typeof s.sets==='object'&&!Array.isArray(s.sets)&&s.songs.every(x=>x&&typeof x.title==='string'&&typeof x.text==='string'&&(x.ui24rCue==null||root.StageUi24R?.validLink(x.ui24rCue))&&(x.songColor==null||!!songColor(x))&&(x.playback?.tempo==null||(()=>{try{root.StageTempo?.config(x);return true}catch{return false}})())&&(x.playback?.transpose==null||(()=>{try{root.StageTranspose?.config(x);return !!root.StageTranspose}catch{return false}})())&&(x.scrollSpeed==null||(Number.isFinite(x.scrollSpeed)&&x.scrollSpeed>=2&&x.scrollSpeed<=120)))&&(s.setAutoplay==null||root.StageLive?.validSetAutoplay(s))&&s.songs.every(x=>x.playback?.click==null||(()=>{try{root.StageClick?.settings(x);return !!root.StageClick}catch{return false}})())&&Object.entries(s.sets).every(([n,a])=>n.length<=200&&Array.isArray(a)&&a.every(i=>Number.isInteger(i)&&i>=0&&i<s.songs.length)));}
  function normalize(s){
    if(!valid(s))throw Error('Invalid song library or setlist. No data has been replaced.');
    s=structuredClone(s);s.idx=Math.max(0,Math.min(Math.floor(Number(s.idx)||0),s.songs.length-1));s.set=Object.hasOwn(s.sets,s.set)?s.set:'';s.opts=s.opts&&typeof s.opts==='object'&&!Array.isArray(s.opts)?s.opts:{};
    s.songs.forEach(x=>{x.refBente=x.refBente??x.bente??0});return englishDefaults(s);
  }
  function cloud(s){s=normalize(s);delete s.idx;delete s.set;delete s.opts.view;s.songs.forEach(x=>delete x.lastOpened);return s;}
  const signature=s=>JSON.stringify(cloud(s));
  function withSession(remote,local){
    const s=normalize(remote);if(local){s.idx=Math.max(0,Math.min(local.idx||0,s.songs.length-1));s.set=Object.hasOwn(s.sets,local.set)?local.set:'';if(local.opts?.view!=null)s.opts.view=local.opts.view;s.songs.forEach((x,i)=>{if(local.songs[i]?.title===x.title&&local.songs[i].lastOpened)x.lastOpened=local.songs[i].lastOpened})}return s;
  }
  function importBackup(current,raw){
    if(Array.isArray(raw)){if(!raw.every(s=>s&&typeof s.title==='string'&&typeof s.text==='string'))throw Error('The file contains invalid songs.');return normalize({...current,songs:[...current.songs,...raw]});}
    if(raw&&Array.isArray(raw.songs)&&!raw.sets)return importBackup(current,raw.songs);return normalize(raw);
  }
  function swipe(a,b){if(!a||!b)return 0;const dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>=75&&Math.abs(dx)>Math.abs(dy)*1.7&&b.time-a.time<1200?(dx<0?1:-1):0;}
  const sectionType=v=>/melody|melodi/i.test(v)?'melody':/chorus|refreng/i.test(v)?'chorus':/bridge|bro/i.test(v)?'bridge':/intro/i.test(v)?'intro':/solo|instrumental/i.test(v)?'solo':/outro|ending|slutt/i.test(v)?'outro':'verse';
  root.StageCore={songColor,englishDefaults,valid,normalize,cloud,signature,withSession,importBackup,swipe,sectionColors,sectionType};
})(typeof window!=='undefined'?window:globalThis);


// stage-theme.js
(function(root){
 'use strict';
 const defaults={bg:'#19232e',title:'#a7bd74',chord:'#f1bf67',section:'#62dfce',verse:'#62dfce',chorus:'#62dfce',bridge:'#62dfce',intro:'#62dfce',solo:'#62dfce',melody:'#82c4ff',outro:'#62dfce',text:'#f1f3f6'};
 const presets={
  classic:{name:'Classic',colors:defaults,appearance:{panel:'#202b37',raised:'#303e4b',border:'#53687a',accent:'#57d7c9'}},
  graphite:{name:'Graphite',colors:{...defaults,bg:'#141518',text:'#edf1f7',title:'#f0d8a7',chord:'#83d9d1',verse:'#a8cbe8',chorus:'#ecc777',bridge:'#c5a2ed',intro:'#a3cfa4',solo:'#eaa786',outro:'#e5a2c1',melody:'#a0caff'},appearance:{panel:'#23252a',raised:'#343941',border:'#596271',accent:'#b6c8e1'}},
  midnight:{name:'Navy & Copper',colors:{...defaults,bg:'#081426',text:'#e9f3ff',title:'#afd9ff',chord:'#ffd18a',verse:'#7cd9ed',chorus:'#ffd073',bridge:'#cfacff',intro:'#8bdeac',solo:'#ffa579',outro:'#f0a9cf',melody:'#82c4ff'},appearance:{panel:'#11243b',raised:'#1b3654',border:'#426e96',accent:'#e5ad83'}},
  forest:{name:'Teal & Coral',colors:{...defaults,bg:'#0b1c16',text:'#e6f4eb',title:'#d2dfa4',chord:'#f2cc84',verse:'#93d6b6',chorus:'#f3d58c',bridge:'#c2afe6',intro:'#a8dfa3',solo:'#f3af89',outro:'#e6a9c3',melody:'#94cce7'},appearance:{panel:'#17342a',raised:'#24493b',border:'#4f826c',accent:'#f0a892'}},
  violet:{name:'Plum & Gold',colors:{...defaults,bg:'#1a1026',text:'#f7efff',title:'#e7bdff',chord:'#ffd983',verse:'#96d8fb',chorus:'#ffbeef',bridge:'#d2b4ff',intro:'#b4e4ae',solo:'#ffb17c',outro:'#f5a4bc',melody:'#8af0dd'},appearance:{panel:'#302044',raised:'#46305d',border:'#9168ad',accent:'#e8c97e'}},
  sunset:{name:'Sunset',colors:{...defaults,bg:'#241315',text:'#fff0e9',title:'#ffdaaa',chord:'#9bf1d4',verse:'#f2bd9c',chorus:'#ffd56f',bridge:'#d6b5ff',intro:'#aadba0',solo:'#ffb68c',outro:'#efacc8',melody:'#9bd8f3'},appearance:{panel:'#43272b',raised:'#623b41',border:'#ac737d',accent:'#ffbf76'}}
 };
 const visible=['classic','dark','light','midnight','forest','violet'];
 // Retain the saved Graphite/Sunset IDs and palettes for existing devices.
 presets.dark={name:'Dark',colors:{...defaults,bg:'#111318',text:'#edf1f5',title:'#d9e4ef',chord:'#e3bf83'},appearance:{panel:'#1b1f26',raised:'#292f39',border:'#637183',accent:'#9eb8ca'}};
 presets.light={name:'Light',colors:{bg:'#f5f7fa',text:'#17232f',title:'#253b50',chord:'#875000',section:'#145d63',verse:'#145d63',chorus:'#875000',bridge:'#704876',intro:'#306347',solo:'#854629',melody:'#255b85',outro:'#814b69'},appearance:{panel:'#ffffff',raised:'#e8edf3',border:'#78899b',accent:'#075e69'}};
 function luminance(color){return [1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)}
 function ink(color){return luminance(color)>.179?'#000000':'#ffffff'}
 const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v),shapes=['soft','square','outline'];
 function id(opts){return typeof opts?.skin==='string'&&(Object.hasOwn(presets,opts.skin)||opts.skin==='custom')?opts.skin:'classic'}
 function appearance(opts){const base=(typeof opts?.skinBase==='string'&&Object.hasOwn(presets,opts.skinBase)?presets[opts.skinBase]:null)||presets[id(opts)]||presets.classic;return Object.fromEntries(Object.entries(base.appearance).map(([k,v])=>[k,hex(opts?.skinAppearance?.[k])?opts.skinAppearance[k]:v]))}
 function snapshot(opts){return {colors:{...defaults,...opts.colors},appearance:appearance(opts),shape:shapes.includes(opts.skinShape)?opts.skinShape:'soft'}}
 function choose(opts,value){
  if(value==='custom'){
   const saved=opts.customSkin||snapshot(opts),colors=Object.fromEntries(Object.entries({...defaults,...saved.colors}).filter(([,v])=>hex(v)));
   return {...opts,skin:'custom',skinBase:opts.skinBase||'classic',colors,skinAppearance:{...presets.classic.appearance,...saved.appearance},skinShape:shapes.includes(saved.shape)?saved.shape:'soft'};
  }
  const selected=presets[value];if(!selected)throw Error('Choose a valid skin.');
  return {...opts,skin:value,skinBase:value,skinShape:'soft',skinAppearance:{...selected.appearance},colors:{...defaults,...selected.colors}};
 }
 function customize(opts,key,value,{surface=false,shape=false}={}){
  if(shape?!shapes.includes(value):!hex(value))throw Error('Choose a valid appearance value.');
  const current=snapshot(opts),next={...opts,skin:'custom',skinBase:id(opts)==='custom'?opts.skinBase||'classic':id(opts),colors:{...current.colors},skinAppearance:{...current.appearance},skinShape:current.shape};
  if(shape)next.skinShape=value;else if(surface){if(!Object.hasOwn(current.appearance,key))throw Error('Unknown appearance color.');next.skinAppearance[key]=value.toLowerCase()}else next.colors[key]=value.toLowerCase();
  next.customSkin=snapshot(next);return next;
 }
 function apply(opts){
  const body=root.document.body,style=root.document.documentElement.style;
  const palette=snapshot(opts);body.setAttribute('data-color-mode',luminance(hex(palette.colors.bg)?palette.colors.bg:defaults.bg)>.45?'light':'dark');style.colorScheme=body.getAttribute('data-color-mode');const light=body.getAttribute('data-color-mode')==='light';style.setProperty('--ui-error',light?'#9d3024':'#ffb69e');style.setProperty('--ui-warning',light?'#805000':'#f1bf67');style.setProperty('--ui-backdrop',light?'#10182088':'#030a10ce');const chrome=root.document.querySelector('meta[name=theme-color]');if(chrome)chrome.setAttribute('content',palette.colors.bg);style.setProperty('--app-ink',ink(palette.appearance.accent));style.setProperty('--app-muted',palette.colors.text);style.setProperty('--panel',palette.appearance.panel);style.setProperty('--line',palette.appearance.border);style.setProperty('--accent',palette.appearance.accent);body.setAttribute('data-skin',id(opts));body.setAttribute('data-button-shape',shapes.includes(opts.skinShape)?opts.skinShape:'soft');
  for(const [k,v]of Object.entries(appearance(opts)))style.setProperty('--app-'+k,v);
 }
 function markup(opts){
  const colors=appearance(opts);return '<section class="skin-settings"><div class="setting-title">APP SKIN</div><select id="skinSelect" aria-label="App skin">'+[...visible,...(!visible.includes(id(opts))&&id(opts)!=='custom'?[id(opts)]:[])].map(key=>[key,presets[key]]).map(([key,p])=>'<option value="'+key+'"'+(id(opts)===key?' selected':'')+'>'+p.name+'</option>').join('')+'<option value="custom"'+(id(opts)==='custom'?' selected':'')+'>Custom / My skin</option></select><p class="foot">Dark, Light and complementary color palettes set app and lyric colors. Track, bus and song colors stay separate. Your own color edits are remembered under Custom / My skin.</p><div class="skin-previews">'+visible.map(key=>[key,presets[key]]).map(([key,p])=>'<button type="button" data-skin-preset="'+key+'" aria-label="Choose '+p.name+' skin" aria-pressed="'+(id(opts)===key)+'" style="--preview-bg:'+p.colors.bg+';--preview-panel:'+p.appearance.panel+';--preview-accent:'+p.appearance.accent+';--preview-text:'+p.colors.text+'"><span>'+p.name+'</span><i aria-hidden="true"></i></button>').join('')+'</div><label class="skin-shape">Button style<select id="skinShape"><option value="soft">Soft corners</option><option value="square">Square corners</option><option value="outline">Outline</option></select></label><details class="skin-custom"><summary>Customize app colors</summary>'+Object.entries({panel:'Panels',raised:'Buttons & fields',border:'Borders',accent:'All active buttons'}).map(([key,label])=>'<div class="color-setting-row"><label for="skinColor-'+key+'">'+label+'</label><input id="skinColor-'+key+'" data-skin-color="'+key+'" type="color" value="'+colors[key]+'"></div>').join('')+'</details></section>';
 }
 root.StageTheme={VERSION:'26.32',presets,visible,ink,id,appearance,choose,customize,snapshot,apply,markup};
})(typeof window!=='undefined'?window:globalThis);


// stage-ui24r.js
(function(root){
 'use strict';
 const LIBRARY_URL='https://cdn.jsdelivr.net/npm/soundcraft-ui-connection@7.0.3/index.mjs',LIBRARY_CACHE='ui24r-library-v1';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const name=v=>typeof v==='string'&&v.length>0&&v.length<=256&&!/[\x00-\x1f\x7f^]/.test(v);
 const validLink=v=>!!v&&name(v.show)&&name(v.cue);
 function address(value){
  const text=String(value||'').trim(),parts=text.split('.');
  if(parts.length!==4||parts.some(p=>!/^\d{1,3}$/.test(p)||+p>255||String(+p)!==p))throw Error('Enter the mixer’s local IPv4 address, without http:// or a port.');
  const [a,b]=parts.map(Number);if(!(a===10||a===192&&b===168||a===172&&b>=16&&b<=31||a===169&&b===254))throw Error('Use a private LAN address for the Ui24R.');return text
 }
 let libraryPromise=null;
 async function loadLibrary(){
  if(libraryPromise)return libraryPromise;
  libraryPromise=(async()=>{
   let cache,response,offlineReady=false;try{cache=await root.caches?.open(LIBRARY_CACHE);response=await cache?.match(LIBRARY_URL);offlineReady=!!response}catch{}
   if(!response){response=await root.fetch(LIBRARY_URL,{mode:'cors',cache:'force-cache'});if(!response.ok)throw Error('Could not download the Ui24R connection library.');try{await cache?.put(LIBRARY_URL,response.clone());offlineReady=!!cache}catch{}}
   const code=await response.text(),url=root.URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
   try{const module=await import(url);if(typeof module.SoundcraftUI!=='function')throw Error('Invalid Ui24R connection library.');return {...module,benkenOfflineReady:offlineReady}}catch(error){try{await cache?.delete(LIBRARY_URL)}catch{}throw error}finally{root.URL.revokeObjectURL(url)}
  })().catch(error=>{libraryPromise=null;throw Error('Ui24R setup needs internet once to cache its connection library. '+error.message)});
  return libraryPromise
 }
 function nativeWebSocket(bridge){
  let counter=0;const sockets=new Map();
  class Socket{
   static CONNECTING=0;static OPEN=1;static CLOSING=2;static CLOSED=3;
   constructor(url){this.url=String(url);this.readyState=0;this.protocol='';this.extensions='';this.bufferedAmount=0;this.binaryType='blob';this.listeners={};this.id='ui24r-'+(++counter);sockets.set(this.id,this);bridge.post({command:'open',id:this.id,url:this.url})}
   addEventListener(type,fn){(this.listeners[type]??=new Set()).add(fn)}
   removeEventListener(type,fn){this.listeners[type]?.delete(fn)}
   dispatch(type,detail={}){const event={type,target:this,...detail};this['on'+type]?.(event);for(const fn of this.listeners[type]||[])fn(event)}
   send(data){if(this.readyState!==1)throw Error('Ui24R socket is not open.');if(typeof data!=='string')throw Error('Only text mixer messages are supported.');bridge.post({command:'send',id:this.id,text:data})}
   close(code=1000,reason=''){if(this.readyState>=2)return;this.readyState=2;bridge.post({command:'close',id:this.id,code,reason})}
  }
  for(const [key,value]of Object.entries({CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3}))Socket.prototype[key]=value;
  bridge.receive=message=>{const socket=sockets.get(message?.id);if(!socket)return;
   if(message.type==='open'){if(socket.readyState!==0)return;socket.readyState=1;socket.dispatch('open')}
   else if(message.type==='message'&&socket.readyState===1)socket.dispatch('message',{data:message.text});
   else if(message.type==='error')socket.dispatch('error',{message:message.message||'Local network connection failed.'});
   else if(message.type==='close'){socket.readyState=3;sockets.delete(socket.id);socket.dispatch('close',{code:message.code||1006,reason:message.reason||'',wasClean:message.code===1000})}
  };return Socket
 }
 function create(o){
  const schedule=o.setTimeout||root.setTimeout.bind(root),clear=o.clearTimeout||root.clearTimeout.bind(root);
  let generation=0,connection=null,subscriptions=[],timer=null,pending=null,request=0,view={phase:'disconnected',catalog:{},show:'',cue:'',message:'Not connected.'};
  const publish=()=>o.changed?.({...view}),report=message=>{view.message=message;publish()};
  function cancelPending(){if(pending){clear(pending.timer);pending.resolve(false);pending=null}}
  function disconnect(){generation++;request++;cancelPending();if(timer!==null){clear(timer);timer=null}subscriptions.forEach(s=>s?.unsubscribe?.());subscriptions=[];const old=connection;connection=null;if(old)Promise.resolve(old.disconnect()).catch(()=>{});view={phase:'disconnected',catalog:{},show:'',cue:'',message:'Not connected.'};publish()}
  function catalog(raw){
   const result={};if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const [show,value]of Object.entries(raw).slice(0,500))if(name(show)&&Array.isArray(value?.cues))Object.defineProperty(result,show,{value:[...new Set(value.cues.filter(name))].slice(0,5000),enumerable:true});return result
  }
  async function connect(value){
   disconnect();const token=generation;let host;try{host=address(value)}catch(error){report(error.message);return false}
   const previous=o.state().opts.ui24rHost;o.state().opts.ui24rHost=host;if(o.save()===false){o.state().opts.ui24rHost=previous;report('Mixer address could not be saved.');return false}
   if(!o.library&&!root.BenKenNativeNetwork&&root.location?.protocol==='https:'){report('Direct mixer access needs the BenKen app in this version. Use its local-network bridge.');return false}
   view={phase:'connecting',catalog:{},show:'',cue:'',message:'Connecting to Ui24R…'};publish();
   timer=schedule(()=>{if(token===generation){disconnect();report('Ui24R connection timed out. Check Wi-Fi, mixer IP and Local Network permission.')}},15000);
   try{
    const module=await (o.library||loadLibrary)();if(token!==generation)return false;
    const ctor=root.BenKenNativeNetwork?(root.BenKenUi24RSocket??=nativeWebSocket(root.BenKenNativeNetwork)):root.WebSocket;
    const current=new module.SoundcraftUI({targetIP:host,...(ctor?{webSocketCtor:ctor}:{})});connection=current;let started=false;
    const listen=(stream,fn)=>subscriptions.push(stream.subscribe(value=>{if(token===generation&&current===connection)fn(value)}));
    listen(current.status$,status=>{
     if(status.type==='OPEN'){clear(timer);timer=null;view.phase='connected';view.message='Connected. Reading cues…'}
     else if(['ERROR','CLOSE','RECONNECTING','CLOSING'].includes(status.type)){if(!started&&status.type==='CLOSE')return;view.phase=status.type==='RECONNECTING'?'reconnecting':'disconnected';view.catalog={};view.show='';view.cue='';cancelPending();view.message=status.type==='RECONNECTING'?'Reconnecting. No cues will be replayed automatically.':'Ui24R disconnected. Playback is independent.'}
     publish()
    });
    listen(current.shows.shows$,raw=>{view.catalog=catalog(raw);publish()});
    listen(current.shows.currentShow$,value=>{view.show=typeof value==='string'?value:'';publish()});
    listen(current.shows.currentCue$,value=>{
     view.cue=typeof value==='string'?value:'';
     if(pending&&view.show===pending.link.show&&view.cue===pending.link.cue){const done=pending;clear(done.timer);pending=null;view.message='Mixer confirmed cue: '+view.cue;done.resolve(true)}publish()
    });
    started=true;Promise.resolve(current.connect()).then(()=>{if(token===generation&&view.phase==='connected')current.shows.refreshShows()}).catch(error=>{if(token===generation){disconnect();report('Ui24R connection failed: '+error.message)}});return true
   }catch(error){if(token===generation){disconnect();report(error.message)}return false}
  }
  function refresh(){if(view.phase!=='connected'||!connection){report('Connect to Ui24R first.');return false}try{connection.shows.refreshShows();report('Reading cues from Ui24R…');return true}catch(error){report(error.message);return false}}
  async function prepareOffline(){report('Preparing the connection library…');try{const module=await (o.library||loadLibrary)();const ready=module.benkenOfflineReady!==false;report(ready?'Connection library ready. You can now use the local mixer network.':'Library loaded for this session, but could not be cached. Offline setup is incomplete.');return ready}catch(error){report(error.message);return false}}
  function link(song,value){
   if(!song||!o.state().songs.includes(song))throw Error('Select a song first.');if(value!==null&&!validLink(value))throw Error('Choose a show and cue. Names cannot contain control characters or ^.');
   const previous=song.ui24rCue;if(value===null)delete song.ui24rCue;else song.ui24rCue={show:value.show,cue:value.cue};
   if(o.save()===false){if(previous===undefined)delete song.ui24rCue;else song.ui24rCue=previous;throw Error('The cue link could not be saved.')}
   request++;cancelPending();report(value?'Cue link saved for '+song.title+'.':'Cue link removed.');return true
  }
  function setAuto(value){const previous=o.state().opts.ui24rAutoCue;o.state().opts.ui24rAutoCue=value===true;if(o.save()===false){o.state().opts.ui24rAutoCue=previous;throw Error('Auto-cue setting could not be saved.')}request++;cancelPending();report(value?'Auto-cue enabled for subsequent song selections.':'Auto-cue off.');return true}
  async function recall(song,{manual=false}={}){
   const serial=++request;cancelPending();const target=song?.ui24rCue;if(!target)return true;
   if(!validLink(target)){report('This song has an invalid Ui24R cue link.');return false}
   if(view.phase!=='connected'||!connection){report('Cue not sent: Ui24R is not connected.');return false}
   if(view.show!==target.show){report('Cue not sent: first open show “'+target.show+'” on the mixer.');return false}
   if(!Object.hasOwn(view.catalog,target.show)||!view.catalog[target.show].includes(target.cue)){report('Cue not sent: saved cue is missing. READ CUES and relink this song.');return false}
   if(!manual&&view.cue===target.cue){report('Linked cue is already active: '+target.cue);return true}
   const alreadyActive=view.cue===target.cue;
   return new Promise(resolve=>{
    pending={serial,link:{...target},resolve,timer:schedule(()=>{if(pending?.serial===serial){pending=null;report('Cue sent but not confirmed by Ui24R: '+target.cue);resolve(false)}},4000)};
    try{connection.shows.loadCue(target.show,target.cue);if(pending?.serial===serial){report('Cue sent: '+target.cue+(alreadyActive?' (already reported active).':' — waiting for mixer.'));if(alreadyActive){clear(pending.timer);pending=null;resolve(true)}}}
    catch(error){cancelPending();report('Cue not sent: '+error.message)}
   })
  }
  function selected(song){request++;cancelPending();if(o.state().opts.ui24rAutoCue===true)return recall(song);return Promise.resolve(true)}
  return {connect,disconnect,refresh,prepareOffline,link,setAuto,recall,selected,snapshot:()=>structuredClone(view)}
 }
 function mount(o){
  const $=id=>document.getElementById(id);let lastOptions='',lastSong=null,selection=0;const controller=create({...o,changed:()=>draw()});
  function draw(force=false){
   const view=controller.snapshot(),song=o.song(),saved=validLink(song?.ui24rCue)?song.ui24rCue:null;
   $('ui24rStatus').textContent=view.message;$('ui24rCurrent').textContent='Mixer: '+(view.show||'—')+' / '+(view.cue||'—');$('ui24rSong').textContent=song?.title||'Select a song';$('ui24rSaved').textContent=saved?'Linked: '+saved.show+' / '+saved.cue:'No cue linked to this song.';
   if(document.activeElement!==$('ui24rHost'))$('ui24rHost').value=o.state().opts.ui24rHost||'';$('ui24rAuto').checked=o.state().opts.ui24rAutoCue===true;
   $('ui24rConnect').disabled=['connecting','connected','reconnecting'].includes(view.phase);$('ui24rDisconnect').disabled=view.phase==='disconnected';$('ui24rRead').disabled=view.phase!=='connected';$('ui24rLoad').disabled=!saved||view.phase!=='connected';$('ui24rSave').disabled=!song;$('ui24rRemove').disabled=!saved;
   const key=JSON.stringify([view.catalog,saved]),editing=[$('ui24rShow'),$('ui24rCue')].includes(document.activeElement);
   if(!force&&song===lastSong&&(key===lastOptions||editing))return;lastSong=song;lastOptions=key;
   const showNames=Object.keys(view.catalog);if(saved&&!showNames.includes(saved.show))showNames.push(saved.show);
   const oldShow=$('ui24rShow').value,chosen=force?oldShow:(saved?.show||oldShow||view.show);
   $('ui24rShow').innerHTML='<option value="">Choose show</option>'+showNames.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');$('ui24rShow').value=showNames.includes(chosen)?chosen:'';
   const cues=[...(view.catalog[$('ui24rShow').value]||[])];if(saved?.show===$('ui24rShow').value&&!cues.includes(saved.cue))cues.push(saved.cue);
   $('ui24rCue').innerHTML='<option value="">Choose cue</option>'+cues.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');$('ui24rCue').value=!force&&saved&&saved.show===$('ui24rShow').value?saved.cue:''
  }
  function run(fn){try{const result=fn();if(result?.catch)result.catch(error=>{$('ui24rStatus').textContent=error.message});draw()}catch(error){draw();$('ui24rStatus').textContent=error.message}}
  $('ui24rConnect').onclick=()=>controller.connect($('ui24rHost').value);$('ui24rOffline').onclick=()=>controller.prepareOffline();$('ui24rDisconnect').onclick=()=>controller.disconnect();$('ui24rRead').onclick=()=>controller.refresh();$('ui24rShow').onchange=()=>draw(true);
  $('ui24rSave').onclick=()=>run(()=>controller.link(o.song(),{show:$('ui24rShow').value,cue:$('ui24rCue').value}));$('ui24rRemove').onclick=()=>run(()=>controller.link(o.song(),null));$('ui24rAuto').onchange=e=>run(()=>controller.setAuto(e.target.checked));$('ui24rLoad').onclick=()=>run(()=>controller.recall(o.song(),{manual:true}));
  root.addEventListener('pagehide',()=>controller.disconnect());draw();return {refresh:draw,selected:song=>{const token=++selection;return controller.selected(song).then(ok=>{if(!ok&&token===selection)o.report?.('Ui24R: '+controller.snapshot().message);return ok})},controller}
 }
 root.StageUi24R={VERSION:'26.32',LIBRARY_URL,LIBRARY_CACHE,address,validLink,create,nativeWebSocket,mount};
})(typeof window!=='undefined'?window:globalThis);


// stage-settings.js
(function(root){
 'use strict';
 function geometry({width=1024,height=768,left=0,top=0,headerBottom=100,footer=0}){
  width=Math.max(1,Number(width)||1);height=Math.max(1,Number(height)||1);left=Number(left)||0;top=Number(top)||0;
  const edge=Math.min(10,width/20,height/20),bottom=top+height-edge-Math.max(0,Math.min(Number(footer)||0,height*.4));
  // Keep the close button and an editable area reachable when a keyboard opens.
  const y=Math.max(top+edge,Math.min(Number(headerBottom)||top+edge,bottom-Math.min(220,height*.6)));
  const panelWidth=Math.min(1200,Math.max(1,width-edge*2));
  return {left:left+(width-panelWidth)/2,top:y,width:panelWidth,height:Math.max(1,bottom-y)};
 }
 function mount(o={}){
  const doc=root.document,panel=doc.getElementById('settings'),button=doc.getElementById('settingsBtn'),close=doc.getElementById('settingsClose'),content=doc.getElementById('settingsContent');let last='';
  const isOpen=()=>!panel.classList.contains('hidden');
  function pin(){
   if(!isOpen())return;const vv=root.visualViewport,rect=doc.querySelector('header')?.getBoundingClientRect(),box=geometry({width:vv?.width||root.innerWidth,height:vv?.height||root.innerHeight,left:vv?.offsetLeft,top:vv?.offsetTop,headerBottom:rect?.bottom,footer:o.footer?.()||0}),key=JSON.stringify(box);
   if(key===last)return;last=key;for(const [k,v]of Object.entries(box))panel.style.setProperty('--settings-'+k,v+'px');
  }
  function setOpen(open){
   open=!!open;panel.classList.toggle('hidden',!open);doc.body.classList.toggle('settings-open',open);button.setAttribute('aria-pressed',String(open));
   if(open){pin();close.focus()}else if(panel.contains?.(doc.activeElement))button.focus();o.changed?.();return open;
  }
  close.onclick=()=>setOpen(false);
  for(const event of ['resize','scroll','pageshow'])root.addEventListener(event,pin,{passive:true});
  for(const event of ['resize','scroll'])root.visualViewport?.addEventListener(event,pin,{passive:true});
  if(root.ResizeObserver){const observer=new root.ResizeObserver(pin);observer.observe(doc.querySelector('header'));const bar=doc.getElementById('performanceBar');if(bar)observer.observe(bar)}
  return {isOpen,setOpen,pin,content,resetScroll:()=>{content.scrollTop=0}};
 }
 root.StageSettings={VERSION:'26.32',geometry,mount};
})(typeof window!=='undefined'?window:globalThis);


// stage-prepared.js
(function(root){
 'use strict';
 const DB='benken-prepared-v1',STORE='entries',CHUNK=262144,MAX_BYTES=512*1024*1024;
 const aborted=()=>Object.assign(Error('Audio preparation cancelled.'),{name:'AbortError'});
 function check(cancelled){if(cancelled())throw aborted()}
 function timed(promise,ms,message){return new Promise((resolve,reject)=>{const timer=root.setTimeout(()=>reject(Error(message)),ms);Promise.resolve(promise).then(value=>{root.clearTimeout(timer);resolve(value)},error=>{root.clearTimeout(timer);reject(error)})})}
 class IndexedStore{
  constructor(){this.connection=null}
  db(){
   if(this.connection)return this.connection;
   this.connection=new Promise((resolve,reject)=>{
    if(!root.indexedDB){reject(Error('Prepared audio storage is unavailable.'));return}
    let finished=false;const request=root.indexedDB.open(DB,1),timer=root.setTimeout(()=>{finished=true;this.connection=null;reject(Error('Prepared audio storage did not open.'))},3000);
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE)};
    request.onsuccess=()=>{root.clearTimeout(timer);if(finished){request.result.close();return}finished=true;const db=request.result;db.onversionchange=()=>{db.close();this.connection=null};resolve(db)};
    request.onerror=request.onblocked=()=>{if(finished)return;finished=true;root.clearTimeout(timer);this.connection=null;reject(request.error||Error('Prepared audio storage is blocked.'))};
   });return this.connection;
  }
  async run(mode,actions){
   const db=await this.db();return new Promise((resolve,reject)=>{let value;const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE),timer=root.setTimeout(()=>{try{tx.abort()}catch{}reject(Error('Prepared audio storage timed out.'))},3000);
    try{for(const [kind,key,data]of actions){const request=kind==='get'?store.get(key):kind==='delete'?store.delete(key):store.put(data,key);request.onsuccess=()=>{value=request.result}}}catch(error){root.clearTimeout(timer);reject(error);return}
    tx.oncomplete=()=>{root.clearTimeout(timer);resolve(value)};tx.onerror=tx.onabort=()=>{root.clearTimeout(timer);reject(tx.error||Error('Prepared audio storage failed.'))};
   });
  }
  get(key){return this.run('readonly',[['get',key]])}
  put(key,value){return this.run('readwrite',[['put',key,value]])}
  putMany(entries){return this.run('readwrite',entries.map(([key,value])=>['put',key,value]))}
  remove(key){return this.run('readwrite',[['delete',key]])}
 }
 class Cache{
  constructor({store=new IndexedStore(),maxBytes=MAX_BYTES}={}){this.store=store;this.maxBytes=maxBytes;this.disabled=false}
  async key(assetId,data,parameters){
   if(this.disabled||!root.crypto?.subtle)return null;
   try{const digest=await timed(root.crypto.subtle.digest('SHA-256',data),12000,'Audio fingerprint timed out.'),hash=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');return 'pitch-pcm-1:'+JSON.stringify([assetId,hash,parameters])}catch{this.disabled=true;return null}
  }
  async read(key,context,{reservedBytes=0,limit=256*1024*1024,cancelled=()=>false,progress=()=>{}}={}){
   if(!key||this.disabled)return null;let manifest;
   try{
    check(cancelled);manifest=await this.store.get(key);check(cancelled);if(!manifest)return null;
    const invalid=()=>{throw Object.assign(Error('Invalid prepared audio cache.'),{cacheInvalid:true})};
    if(manifest.version!==1||manifest.key!==key||!Array.isArray(manifest.outputs)||!manifest.outputs.length||manifest.outputs.length>2||!manifest.info||!(manifest.info.duration>0))invalid();
    let bytes=0,totalParts=0;
    for(const out of manifest.outputs){if(!Number.isSafeInteger(out.length)||out.length<1||![1,2].includes(out.channels)||out.rate!==context.sampleRate||!Array.isArray(out.parts))invalid();bytes+=out.length*out.channels*4;totalParts+=out.parts.length;if(out.parts.length!==Math.ceil(out.length/CHUNK)*out.channels)invalid()}
    if(bytes!==manifest.bytes||reservedBytes+bytes>limit)invalid();
    const buffers=[];let partNumber=0;
    for(const out of manifest.outputs){
     check(cancelled);const buffer=context.createBuffer(out.channels,out.length,out.rate);let index=0;
     for(let channel=0;channel<out.channels;channel++)for(let offset=0;offset<out.length;offset+=CHUNK){
      const part=out.parts[index++],length=Math.min(CHUNK,out.length-offset);if(!part||part.channel!==channel||part.offset!==offset||part.length!==length||typeof part.key!=='string'||!part.key.startsWith(key+'#'))invalid();
      const data=await this.store.get(part.key);check(cancelled);if(!data||data.byteLength!==length*4)invalid();buffer.getChannelData(channel).set(new Float32Array(data),offset);
      progress('Loading saved key · '+Math.round(++partNumber/totalParts*100)+'%');
     }buffers.push(buffer);
    }
    // LRU bookkeeping is optional; a failed bookkeeping write cannot discard valid PCM.
    try{const index=await this.store.get('index')||[];if(Array.isArray(index))await this.store.put('index',index.map(entry=>entry.key===key?{...entry,touched:Date.now()}:entry))}catch{}
    return {buffers,info:{...manifest.info}};
   }catch(error){if(error.name==='AbortError')throw error;if(error.cacheInvalid){await this.store.remove(key).catch(()=>{})}else this.disabled=true;return null}
  }
  async evict(entry){
   await this.store.remove(entry.key);for(const key of entry.parts||[])await this.store.remove(key);
  }
  async write(key,buffers,info,{cancelled=()=>false,progress=()=>{}}={}){
   if(!key||this.disabled||buffers.some(b=>!b?.getChannelData||b.getChannelData(0).length!==b.length))return false;
   const bytes=[...new Set(buffers)].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0);if(bytes>this.maxBytes)return false;
   const token=root.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2),created=[];let committed=false;
   try{
    check(cancelled);let index=await this.store.get('index')||[];if(!Array.isArray(index))index=[];
    const previous=index.find(e=>e.key===key);index=index.filter(e=>e.key!==key).sort((a,b)=>a.touched-b.touched);
    let retained=index.reduce((n,e)=>n+(Number(e.bytes)||0),0);
    while(index.length&&retained+bytes>this.maxBytes){const entry=index.shift();await this.evict(entry);retained-=Number(entry.bytes)||0;check(cancelled)}
    const outputs=[];let done=0;
    for(let i=0;i<buffers.length;i++){
     const buffer=buffers[i],out={length:buffer.length,channels:buffer.numberOfChannels,rate:buffer.sampleRate,parts:[]};
     for(let channel=0;channel<buffer.numberOfChannels;channel++)for(let offset=0;offset<buffer.length;offset+=CHUNK){
      check(cancelled);const data=buffer.getChannelData(channel).slice(offset,Math.min(buffer.length,offset+CHUNK)),partKey=key+'#'+token+':'+i+':'+channel+':'+offset;
      created.push(partKey);await this.store.put(partKey,data.buffer);check(cancelled);out.parts.push({key:partKey,channel,offset,length:data.length});done+=data.byteLength;progress('Saving prepared key · '+Math.min(100,Math.round(done/bytes*100))+'%');
     }outputs.push(out);
    }
    check(cancelled);const manifest={version:1,key,bytes,outputs,info:{...info}},entry={key,bytes,touched:Date.now(),parts:[...created]};
    await this.store.putMany([[key,manifest],['index',[...index,entry]]]);committed=true;
    if(previous)for(const old of previous.parts||[])await this.store.remove(old).catch(()=>{});
    return true;
   }catch(error){if(!committed)for(const part of created)await this.store.remove(part).catch(()=>{});if(error.name==='AbortError')throw error;this.disabled=true;return false}
  }
 }
 root.StagePrepared={VERSION:'26.32',Cache,IndexedStore,timed,CHUNK,MAX_BYTES};
})(typeof window!=='undefined'?window:globalThis);


// stage-setlist.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function sidebarGeometry({height,top=0,headerBottom=0,footer=0}){
  height=Math.max(0,Number(height)||0);top=Math.max(0,Number(top)||0);
  const start=Math.min(top+height,Math.max(top,Number(headerBottom)||0)+8),end=top+height-Math.min(height,Math.max(0,Number(footer)||0))-8;
  return {top:start,height:Math.max(0,end-start)}
 }
 function mountSidebar(o){
  const side=document.getElementById('side'),header=document.querySelector('header');let last='';
  function pin(){
   const viewport=root.visualViewport,box=sidebarGeometry({height:Number(viewport?.height)||root.innerHeight,top:viewport?.offsetTop,headerBottom:header?.getBoundingClientRect().bottom??header?.offsetHeight,footer:o.footer?.()||0}),key=JSON.stringify(box);
   if(key===last)return;last=key;
   side.style.setProperty('--setlist-top',box.top+'px');side.style.setProperty('--setlist-height',box.height+'px')
  }
  root.addEventListener('resize',pin,{passive:true});root.addEventListener('scroll',pin,{passive:true});root.addEventListener('pageshow',pin,{passive:true});
  root.visualViewport?.addEventListener('resize',pin,{passive:true});root.visualViewport?.addEventListener('scroll',pin,{passive:true});
  if(root.ResizeObserver){const observer=new root.ResizeObserver(pin);observer.observe(header)}
  pin();return {pin}
 }
 function mount(o){
  const $=id=>document.getElementById(id),dialog=$('setlistAddDialog');let selected=new Set(),snapshot=[];
  const names=()=>Object.keys(o.state().sets);
  function target(){return $('setlistNewName').value.trim()||$('setlistAddTarget').value}
  function draw(){
   const state=o.state(),q=$('setlistAddSearch').value.trim().toLocaleLowerCase(),inSet=Object.hasOwn(state.sets,target())?state.sets[target()]:[];
   const matches=state.songs.map((s,i)=>({s,i})).filter(({s})=>[s.title,o.artist(s),...o.tags(s)].join(' ').toLocaleLowerCase().includes(q)).sort((a,b)=>a.s.title.localeCompare(b.s.title));
   $('setlistAddResults').innerHTML=matches.map(({s,i})=>'<label class="setlist-add-row"'+(root.StageCore.songColor(s)?' style="--song-color:'+root.StageCore.songColor(s)+'"':'')+'><input type="checkbox" data-setlist-pick="'+i+'"'+(selected.has(i)?' checked':'')+'><span><strong>'+esc(s.title)+'</strong><small>'+esc(o.artist(s))+(inSet.includes(i)?' · Already in this setlist':'')+'</small></span></label>').join('')||'<p>No songs found. Import or create songs in the library first.</p>';
   $('setlistAddCount').textContent=selected.size+' selected';$('setlistAddSave').disabled=!selected.size||!target();
  }
  function open(){
   const state=o.state();snapshot=state.songs.slice();selected=new Set();$('setlistAddSearch').value='';$('setlistNewName').value='';$('setlistAddStatus').textContent='';
   $('setlistAddTarget').innerHTML='<option value="">Choose a setlist</option>'+names().map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');$('setlistAddTarget').value=state.set||names()[0]||'';
   dialog.showModal();draw();$('setlistAddSearch').focus();
  }
  function close(){dialog.close();selected.clear()}
  function add(){
   const state=o.state(),name=target();if(!name||!selected.size)return false;
   if(state.songs.length!==snapshot.length||snapshot.some((s,i)=>s!==state.songs[i])){$('setlistAddStatus').textContent='The library changed. Close and reopen Add songs.';return false}
   if(name.length>100){$('setlistAddStatus').textContent='Use a setlist name of up to 100 characters.';return false}
   const previous={sets:state.sets,flags:state.setAutoplay,set:state.set,view:state.opts.view,position:o.position?.()},order=Object.hasOwn(state.sets,name)?state.sets[name]:[],flags=order.map((_,i)=>state.setAutoplay?.[name]?.[i]??null),added=[...selected];
   // Selection order becomes performance order; existing entries and their autoplay choices stay intact.
   state.sets={...state.sets,[name]:[...order,...added]};state.setAutoplay={...state.setAutoplay,[name]:[...flags,...added.map(()=>null)]};state.set=name;state.opts.view=1;
   if(o.save()===false){state.sets=previous.sets;state.setAutoplay=previous.flags;state.set=previous.set;state.opts.view=previous.view;$('setlistAddStatus').textContent='The setlist could not be saved. Your selections are kept. Try again.';return false}
   close();o.changed({name,previousSet:previous.set,position:previous.position});return true;
  }
  $('setlistAddClose').onclick=$('setlistAddCancel').onclick=close;
  $('setlistAddSave').onclick=add;dialog.addEventListener('cancel',()=>selected.clear());
  $('setlistAddSearch').addEventListener('input',draw);$('setlistNewName').addEventListener('input',draw);$('setlistAddTarget').addEventListener('change',draw);
  $('setlistAddResults').addEventListener('change',e=>{const el=e.target.closest('[data-setlist-pick]');if(!el)return;const i=Number(el.dataset.setlistPick);if(!snapshot[i])return;el.checked?selected.add(i):selected.delete(i);$('setlistAddCount').textContent=selected.size+' selected';$('setlistAddSave').disabled=!selected.size||!target()});
  return {open,close};
 }
 root.StageSetlist={VERSION:'26.32',mount,sidebarGeometry,mountSidebar};
})(typeof window!=='undefined'?window:globalThis);


// stage-live.js
(function(root){
 'use strict';
 function doubleTap({options,now=()=>Date.now()}){
  let pending=null,lastToggle=-Infinity;
  function clear(){pending=null}
  function current(){if(pending&&now()-pending.time>1000)pending=null;return pending}
  function accept(action,command=action){
   const time=now();if(command==='toggle'&&time-lastToggle<300)return false;
   const required=action==='play'?options().doubleTapPlay===true:options().doubleTapStop===true;
   if(!required){clear();return true}
   const armed=current();if(armed&&armed.action===action&&armed.command===command&&time-armed.time>=80){clear();if(command==='toggle')lastToggle=time;return true}
   pending={action,command,time};return false
  }
  return {accept,clear,current}
 }
 function validSetAutoplay(state){const map=state.setAutoplay;if(map==null)return true;return !!(map&&typeof map==='object'&&!Array.isArray(map)&&Object.entries(map).every(([name,flags])=>Object.hasOwn(state.sets,name)&&Array.isArray(state.sets[name])&&Array.isArray(flags)&&flags.length<=state.sets[name].length&&flags.every(v=>v===null||typeof v==='boolean')))}
 function setFlags(state,name){return (state.sets[name]||[]).map((_,i)=>state.setAutoplay?.[name]?.[i]??null)}
 function setEnabled(state,name,position){const value=state.setAutoplay?.[name]?.[position];return typeof value==='boolean'?value:state.opts?.autoPlayNext===true}
 function writeFlag(state,name,position,value){if(!Object.hasOwn(state.sets,name)||!Number.isInteger(position)||position<0||position>=state.sets[name].length||value!==null&&typeof value!=='boolean')throw Error('Invalid setlist autoplay entry.');const flags=setFlags(state,name);flags[position]=value;state.setAutoplay={...state.setAutoplay,[name]:flags}}
 function dropSet(state,name){if(state.setAutoplay){const next={...state.setAutoplay};delete next[name];state.setAutoplay=next}}
 function autoplay({state,song,next,load,start,entry=()=>null,enabled=()=>state().opts.autoPlayNext===true,report=()=>{}}){
  let serial=0,busy=false;
  const signature=()=>JSON.stringify([state().set,state().sets[state().set],state().setAutoplay?.[state().set]]);
  function cancel(){serial++;busy=false;report('')}
  async function ended(){
   const source=entry();if(busy||!enabled(source)||!state().set)return false;
   const target=next();if(!target){report('End of setlist.');return false}
   const mine=++serial,sequence=signature();busy=true;
   const valid=()=>mine===serial&&enabled(source)&&signature()===sequence;
   try{
    await Promise.resolve();if(!valid())return false;
    report('Autoplay: preparing '+target.song.title+'…');
    const ready=await load(target);if(!valid()||song()!==target.song)return false;
    if(!ready){report('Autoplay stopped: the next song is not ready. Open Mixer for details.');return false}
    if(!await start()){report('Autoplay stopped: playback could not start.');return false}
    report('');return true
   }catch(error){if(valid())report('Autoplay stopped: '+error.message);return false}
   finally{if(mine===serial)busy=false}
  }
  return {ended,cancel,busy:()=>busy}
 }
 class DraftStore{
  constructor(storage,key='benken-ipad-v4-editor-drafts',report=()=>{}){this.storage=storage;this.key=key;this.report=report;this.active=new Map();this.lastCapture=-Infinity;try{const data=JSON.parse(storage.getItem(key)||'{}');this.entries=data&&typeof data==='object'&&!Array.isArray(data)?data:{}}catch{this.entries={}}}
  persist(){try{const text=JSON.stringify(this.entries);if(text.length>1048576)throw Error('Editor drafts exceed local draft space. Press SAVE in the editor.');this.storage.setItem(this.key,text);return true}catch(error){this.report('Draft save failed: '+error.message);return false}}
  open(key,scope,read,restore,isOpen=()=>true){
   const base=structuredClone(read()),saved=this.entries[key];this.active.set(key,{scope,base,read,isOpen});
   if(saved&&saved.scope===scope&&JSON.stringify(saved.base)===JSON.stringify(base)){try{restore(structuredClone(saved.value));return true}catch{this.clear(key)}}return false
  }
  capture(key){const entry=this.active.get(key);if(!entry||!entry.isOpen())return;let value;try{value=structuredClone(entry.read())}catch{return}const old=this.entries[key];if(JSON.stringify(value)===JSON.stringify(entry.base)){if(old?.scope===entry.scope){delete this.entries[key];this.persist()}return}const next={scope:entry.scope,base:entry.base,value};if(JSON.stringify(old)!==JSON.stringify(next)){this.entries[key]=next;this.persist()}}
  captureAll(){for(const key of this.active.keys())this.capture(key)}
  tick(time=Date.now()){if(time>=this.lastCapture&&time-this.lastCapture<750)return;this.lastCapture=time;this.captureAll()}
  reset(){this.active.clear();this.entries={};this.persist()}
  clear(key){this.active.delete(key);if(Object.hasOwn(this.entries,key)){delete this.entries[key];this.persist()}}
 }
 let drafts=null;
 try{if(root.localStorage)drafts=new DraftStore(root.localStorage,undefined,text=>{const node=root.document?.getElementById('status');if(node)node.textContent=text})}catch{}
 if(drafts&&root.addEventListener){root.addEventListener('pagehide',()=>drafts.captureAll());root.document?.addEventListener('visibilitychange',()=>drafts.captureAll())}
 root.StageLive={VERSION:'26.32',validSetAutoplay,setFlags,setEnabled,writeFlag,dropSet,doubleTap,autoplay,DraftStore,drafts};
})(typeof window!=='undefined'?window:globalThis);


// stage-backup.js
(function(root){
 'use strict';
 const MAGIC='BKBK0001',MAX_HEADER=8*1024*1024,PART_BYTES=32*1024*1024;
 function bytes(file){return file.data instanceof Blob?file.data.size:file.data?.byteLength}
 async function plan(state,repo,{partBytes=PART_BYTES}={}){
  root.StageProject.validateState(state);state=structuredClone(state);
  const assets=[],groups=[[]];let size=0;
  for(const id of root.StageProject.assets(state)){
   const file=await repo.get(id),length=file&&bytes(file);if(!length)throw Error('Audio file missing locally: '+id);
   if(length>160*1024*1024)throw Error('A backup audio file exceeds 160 MiB.');
   if(size&&size+length>partBytes){groups.push([]);size=0}
   const entry={id,name:String(file.name||id),type:String(file.type||'application/octet-stream'),size:length,part:groups.length-1};assets.push(entry);groups[groups.length-1].push(entry);size+=length
  }
  return {id:root.crypto.randomUUID(),state,assets,groups,partCount:groups.length,version:3}
 }
 async function part(plan,index,repo){
  const entries=plan.groups[index];if(!entries)throw Error('Unknown backup part.');const parts=[];
  for(const a of entries){const file=await repo.get(a.id);if(!file||bytes(file)!==a.size)throw Error('Audio changed during backup. Create a new backup.');parts.push(file.data instanceof Blob?file.data:new Blob([file.data]))}
  const manifest={format:'BenKen Full Backup',version:3,appVersion:'26.32',id:plan.id,index,count:plan.partCount,assets:entries};if(index===0){manifest.state=plan.state;manifest.catalog=plan.assets}
  const metadata=new TextEncoder().encode(JSON.stringify(manifest));if(metadata.length>MAX_HEADER)throw Error('The backup metadata is too large.');const header=new Uint8Array(12);header.set(new TextEncoder().encode(MAGIC));new DataView(header.buffer).setUint32(8,metadata.length,true);return new Blob([header,metadata,...parts],{type:'application/x-benken-backup'})
 }
 async function header(file){
  const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());if(bytes.length!==12||new TextDecoder().decode(bytes.slice(0,8))!==MAGIC)throw Error('Choose the .benkenbackup parts from one full backup.');const length=new DataView(bytes.buffer).getUint32(8,true);if(!length||length>MAX_HEADER||length+12>file.size)throw Error('Damaged backup header.');let meta;try{meta=JSON.parse(await file.slice(12,12+length).text())}catch{throw Error('Invalid backup metadata.')}
  if(meta.format!=='BenKen Full Backup'||![1,2,3].includes(meta.version)||!/^[-a-zA-Z0-9]{1,120}$/.test(meta.id)||!Number.isInteger(meta.index)||!Number.isInteger(meta.count)||meta.count<1||meta.count>20000||meta.index<0||meta.index>=meta.count||!Array.isArray(meta.assets))throw Error('Invalid backup part.');let offset=12+length;const seen=new Set();
  for(const a of meta.assets){if(!/^[-a-zA-Z0-9]{1,120}$/.test(a.id)||seen.has(a.id)||a.part!==meta.index||!Number.isSafeInteger(a.size)||a.size<1||a.size>160*1024*1024)throw Error('Invalid backup audio entry.');seen.add(a.id);a.start=offset;offset+=a.size}
  if(offset!==file.size)throw Error('Incomplete or damaged backup part.');return {...meta,file}
 }
 async function inspect(files){
  const parts=[];for(const file of files)parts.push(await header(file));const first=parts.find(p=>p.index===0);if(!first)throw Error('Backup part 1 is missing.');if(parts.length!==first.count)throw Error('Select all '+first.count+' parts of this backup.');if(new Set(parts.map(p=>p.index)).size!==parts.length)throw Error('A backup part was selected more than once.');if(parts.some(p=>p.id!==first.id||p.count!==first.count))throw Error('The selected parts belong to different backups.');root.StageProject.validateState(first.state);
  if(!Array.isArray(first.catalog)||new Set(first.catalog.map(a=>a.id)).size!==first.catalog.length)throw Error('The backup catalog is missing.');const actual=parts.flatMap(p=>p.assets),ids=new Set(actual.map(a=>a.id));if(ids.size!==actual.length||actual.length!==first.catalog.length)throw Error('The backup contains duplicate or missing audio.');for(const expected of first.catalog){const a=actual.find(a=>a.id===expected.id);if(!a||a.size!==expected.size||a.part!==expected.part||a.name!==expected.name||a.type!==expected.type)throw Error('The backup audio catalog does not match its parts.')}
  const required=root.StageProject.assets(first.state);if(required.length!==ids.size||required.some(id=>!ids.has(id)))throw Error('An audio file is missing from the backup.');return {state:first.state,parts:parts.sort((a,b)=>a.index-b.index),id:first.id}
 }
 async function unpack(files,repo){
  const backup=await inspect(files),created=[],mapping=new Map();try{
   for(const part of backup.parts)for(const a of part.assets){const id=root.crypto.randomUUID();await repo.put(id,{name:a.name,type:a.type,data:await part.file.slice(a.start,a.start+a.size).arrayBuffer()});created.push(id);mapping.set(a.id,id)}
   const state=structuredClone(backup.state);for(const song of state.songs){if(song.audioId)song.audioId=mapping.get(song.audioId)||song.audioId;for(const t of song.playback?.tracks||[])t.assetId=mapping.get(t.assetId)}return {state:root.StageCore.normalize(state),created}
  }catch(error){for(const id of created)await repo.remove(id).catch(()=>{});throw error}
 }
 function mount(o){
  const $=id=>document.getElementById(id);let snapshot=null,index=0,current=null,url=null,busy=false,downloaded=false;
  function status(text){$('fullBackupStatus').textContent=text}
  function release(){current=null;if(url){URL.revokeObjectURL(url);url=null}}
  function buttons(){$('fullBackupPrepare').disabled=busy||!snapshot||!!current;$('fullBackupDownload').disabled=busy||!current;$('fullBackupNext').disabled=busy||!downloaded||!snapshot||index+1>=snapshot.partCount;$('fullBackupClose').disabled=busy;$('fullBackupPrepare').textContent=snapshot?'PREPARE PART '+(index+1)+' OF '+snapshot.partCount:'PREPARING…'}
  async function open(){if(o.mixer.player.playing||o.mixer.player.click?.running||o.mixer.busy())return o.report('Stop playback before creating a full backup.');if(!o.mixer.flushSettings())return;if($('mixerDialog').hasAttribute('open'))$('closeMixer').click();snapshot=null;index=0;downloaded=false;release();$('fullBackupDialog').showModal();busy=true;buttons();status('Checking the library and local audio files…');o.mixer.suspend();try{snapshot=await plan(o.state(),o.mixer.repo);status(snapshot.state.songs.length+' songs · '+snapshot.assets.length+' audio files · '+snapshot.partCount+' backup part(s). Prepare and save every part. Keep all parts together.')}catch(error){status(error.message)}finally{busy=false;buttons()}}
  $('fullBackupPrepare').onclick=async()=>{if(busy||!snapshot||current)return;busy=true;buttons();status('Preparing backup part '+(index+1)+'…');try{const blob=await part(snapshot,index,o.mixer.repo);current=new File([blob],'BenKen_Backup_'+snapshot.id+'_part_'+String(index+1).padStart(3,'0')+'_of_'+String(snapshot.partCount).padStart(3,'0')+'.benkenbackup',{type:blob.type});url=URL.createObjectURL(current);status('Part '+(index+1)+' of '+snapshot.partCount+' is ready. Press DOWNLOAD PART, then save it before preparing the next part.')}catch(error){status(error.message)}finally{busy=false;buttons()}};
  $('fullBackupDownload').onclick=()=>{if(!current||busy)return;const a=document.createElement('a');a.href=url;a.download=current.name;a.click();downloaded=true;status(index+1===snapshot.partCount?'Last part offered for download. Make sure every part is saved.':'Save this part, then choose NEXT PART.');buttons()};
  $('fullBackupNext').onclick=()=>{if(!downloaded||busy||index+1>=snapshot.partCount)return;index++;downloaded=false;release();status('Ready to prepare part '+(index+1)+' of '+snapshot.partCount+'.');buttons()};
  $('fullBackupClose').onclick=()=>{if(busy)return;release();snapshot=null;$('fullBackupDialog').close()};$('fullBackupDialog').addEventListener('cancel',e=>{if(busy)e.preventDefault()});$('fullBackupDialog').addEventListener('close',()=>{release();snapshot=null});
  async function restore(files,restoreDevice=false){if(!files?.length)return;if(o.mixer.player.playing||o.mixer.player.click?.running||o.mixer.busy())return o.report('Stop playback before restoring a full backup.');if(!o.mixer.flushSettings())return;try{await inspect(files)}catch(error){o.report(error.message);return false}if(!root.confirm('Restore this full backup and replace the current library and setlists? A text backup of the current library will download first.'))return false;o.backup?.();
   if($('mixerDialog').hasAttribute('open'))$('closeMixer').click();$('fullBackupDialog').showModal();snapshot=null;release();busy=true;buttons();status('Restoring audio and library…');o.mixer.suspend();let restored,committed=false;
   try{restored=await unpack(files,o.mixer.repo);o.apply(restored.state,{restoreDevice});committed=true;root.StageLive.drafts?.reset();o.changed();await o.mixer.load();status('Full backup restored. Your previous local audio copies are kept.');return true}catch(error){if(restored&&!committed)for(const id of restored.created)await o.mixer.repo.remove(id).catch(()=>{});status(error.message);return false}finally{busy=false;buttons()}}
  return {open,restore,busy:()=>busy,isOpen:()=>$('fullBackupDialog').hasAttribute('open')}
 }
 root.StageBackup={VERSION:'26.32',PART_BYTES,plan,part,inspect,unpack,mount};
})(typeof window!=='undefined'?window:globalThis);


// stage-lyrics.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 function colorRange(text,start,end,color){
  if(!hex(color))throw Error('Choose a valid text color.');text=String(text);start=Math.max(0,Math.min(text.length,Number(start)||0));end=Math.max(start,Math.min(text.length,Number(end)||0));if(start===end)return null;
  const pattern=/\{\s*(color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}/gi,stack=[];let before=[],after=[],m;
  while((m=pattern.exec(text))){if(m.index>=end)break;if(m.index<start&&pattern.lastIndex>start||m.index<end&&pattern.lastIndex>end)throw Error('Select complete words, outside the color tags.');if(m.index<start){const tag=m[1].toLowerCase();tag[0]==='/'?stack.pop():stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0]);before=[...stack]}else{if(after.length===0)after=[...stack];const tag=m[1].toLowerCase();tag[0]==='/'?stack.pop():stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0])}}
  after=[...stack];const prefix='{/color}'.repeat(before.length)+'{color: '+color.toLowerCase()+'}',selected=text.slice(start,end).replace(pattern,''),suffix='{/color}'+after.map(c=>'{color: '+c+'}').join('');
  return {text:text.slice(0,start)+prefix+selected+suffix+text.slice(end),start:start+prefix.length,end:start+prefix.length+selected.length};
 }
 function header(raw){
  const m=raw.trim().match(/^\{\s*([^}:]+?)\s*(?::\s*(.*?))?\s*\}$/);if(!m)return null;
  const k=m[1].trim().toLowerCase(),labels={soc:'CHORUS',start_of_chorus:'CHORUS',sov:'VERSE',start_of_verse:'VERSE',sob:'BRIDGE',start_of_bridge:'BRIDGE',som:'MELODY',start_of_melody:'MELODY'};
  if(['c','comment','section'].includes(k))return {label:m[2]||'',type:root.StageCore.sectionType(m[2]||'')};
  if(labels[k])return {label:m[2]||labels[k],type:root.StageCore.sectionType(labels[k])};return null
 }
 function sections(text){const out=[];String(text||'').split(/\r?\n/).forEach((line,i)=>{const h=header(line);if(h)out.push({...h,line:i,index:out.length})});return out}
 const signature=text=>JSON.stringify(sections(text).map(s=>[s.label,s.type]));
 function inline(raw,stack=[],transpose=v=>v){
  let plain='',html='',marks=[],last=0;const rx=/\{\s*(color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}|\[([A-G](?:#|b)?[a-zA-Z0-9+#/()\-]*)\]/gi;
  const add=value=>{plain+=value;const content=esc(value);html+=stack.length?'<span class="lyric-color" style="color:'+stack[stack.length-1]+'">'+content+'</span>':content};let m;
  while((m=rx.exec(raw))){add(raw.slice(last,m.index));last=rx.lastIndex;
   if(m[2]){marks.push({pos:[...plain].length,chord:transpose(m[2])});continue}
   const tag=m[1].toLowerCase();if(tag[0]==='/')stack.pop();else stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0].toLowerCase())
  }add(raw.slice(last));return {plain,html,marks}
 }
 function render(text,{hideChords=false,transpose=v=>v}={}){
  const stack=[],out=[];let sectionIndex=0;
  for(const raw of String(text||'').split(/\r?\n/)){
   const h=header(raw);if(h){out.push('<div class="lyric-line section '+h.type+'" data-section-index="'+sectionIndex+++'">'+esc(h.label)+'</div>');continue}
   const trimmed=raw.trim(),colorOnly=/^\{\s*(?:color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}$/i.test(trimmed);
   if(/^\{\s*[^{}]+\s*\}$/.test(trimmed)&&!colorOnly)continue;
   const line=inline(raw,stack,transpose);if(colorOnly)continue;
   if(hideChords&&line.marks.length){if(line.plain.trim())out.push('<div class="lyric-line">'+line.html+'</div>');continue}
   if(line.marks.length){let chords='',end=0;for(const mark of line.marks){const col=Math.max(mark.pos,end);chords+=' '.repeat(Math.max(0,col-[...chords].length))+mark.chord;end=col+[...mark.chord].length+1}out.push('<div class="lyric-line chord-pair"><div class="chord-line">'+esc(chords)+'</div><div class="lyric-text">'+(line.html||'&nbsp;')+'</div></div>')}
   else out.push('<div class="lyric-line'+(line.plain?'':' blank-line')+'">'+(line.html||'&nbsp;')+'</div>')
  }return out.join('')
 }
 function validateSaved(timing){
  if(timing==null)return;
  if(!timing||timing.version!==1||typeof timing.signature!=='string'||timing.signature.length>200000||!Array.isArray(timing.starts)||timing.starts.length>2048||timing.starts.some(n=>n!==null&&(!Number.isFinite(n)||n<0||n>86400)))throw Error('Invalid section timing in the song.');
 }
 function saved(song){const list=sections(song?.text),timing=song?.sectionTiming;try{validateSaved(timing)}catch{return {list,stale:true,starts:list.map(()=>null)}}const stale=!!timing&&timing.signature!==signature(song.text);return {list,stale,starts:timing&&!stale&&timing.starts.length===list.length?[...timing.starts]:list.map(()=>null)}}
 function validateStarts(starts,length=0){let prev=-1;for(const n of starts){if(n===null)continue;if(!Number.isFinite(n)||n<0||n>86400)throw Error('Enter the start as mm:ss or seconds.');if(length>0&&n>=length)throw Error('Sections must start before the end of the song.');if(n<=prev)throw Error('Start times must follow the lyric order and be different.');prev=n}return starts}
 function segments(song,length){
  if(!(length>0))return [];const data=saved(song),{list,stale}=data,rate=root.StageTempo?.ratio(song)||1,starts=data.starts.map(n=>n===null?null:n/rate);if(stale||!list.length||starts.some(n=>n===null))return [];
  try{validateStarts(starts,length)}catch{return []}
  return list.map((s,i)=>({...s,start:starts[i],end:starts[i+1]??length}))
 }
 function sectionColor(type,opts){const value=opts?.colors?.[type];return hex(value)&&value.toLowerCase()!=='#62dfce'?value:root.StageCore.sectionColors[type]||root.StageCore.sectionColors.verse}
 function parseTime(value){const v=String(value).trim().replace(',','.');if(!v)return null;const m=v.match(/^(\d{1,4}):([0-5]\d(?:\.\d{1,3})?)$/);if(m)return Number(m[1])*60+Number(m[2]);if(/^\d+(?:\.\d{1,3})?$/.test(v))return Number(v);throw Error('Use mm:ss, for example 01:24, or seconds.')}
 function time(value){if(value===null||!Number.isFinite(value))return '';const n=Math.round(value*100)/100,whole=Math.floor(n);return String(Math.floor(whole/60)).padStart(2,'0')+':'+String(whole%60).padStart(2,'0')+(n%1?'.'+String(Math.round((n%1)*100)).padStart(2,'0'):'')}
 function interpolate(time,anchors){if(!anchors.length)return 0;if(time<=anchors[0].time)return anchors[0].y;for(let i=1;i<anchors.length;i++)if(time<=anchors[i].time){const a=anchors[i-1],b=anchors[i];return b.time===a.time?b.y:a.y+(b.y-a.y)*Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time)))}return anchors[anchors.length-1].y}
 root.StageLyrics={VERSION:'26.32',esc,hex,colorRange,header,sections,signature,inline,render,validateSaved,saved,validateStarts,segments,sectionColor,parseTime,time,interpolate};
})(typeof window!=='undefined'?window:globalThis);


// stage-display.js
(function(root){
 'use strict';
 const css=':root{color-scheme:dark;--bg:#19232e;--text:#f1f3f6;--chord:#f1bf67;--title:#a7bd74}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}#displayViewport{position:fixed;inset:0;overflow:auto;padding:24px 5vw}#displayContent{padding-bottom:40vh;transform-origin:top left}h1{font-size:1.35em;color:var(--title);font-weight:500;text-align:center;margin:0 0 12px}#displayArtist{text-align:center;font-size:.55em;color:#b6c9c2;margin-bottom:22px}.lyric-line{min-height:1.5em;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5}.chord-pair{margin-bottom:.3em}.chord-line,.lyric-text{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre;overflow-wrap:normal}.chord-line{color:var(--chord);font-weight:700;line-height:1.2}.section{font-weight:700;margin-top:.65em}.section.verse{color:var(--verse)}.section.chorus{color:var(--chorus)}.section.bridge{color:var(--bridge)}.section.intro{color:var(--intro)}.section.solo{color:var(--solo)}.section.outro{color:var(--outro)}.section.melody{color:var(--melody)}';
 function mount(o){
  let screen=null,contentKey='',lastY=null,style=null,viewport=null,content=null,title=null,artist=null,lyrics=null;
  const status=text=>o.status?.(text);
  function isOpen(){return !!screen&&!screen.closed}
  function close(){if(isOpen())try{screen.close()}catch{}screen=null;contentKey='';lastY=null;status('Lyrics window closed.')}
  function refresh(){
   if(!isOpen())return false;
   try{
    const value=o.snapshot(),key=JSON.stringify(value);if(key===contentKey)return true;contentKey=key;
    title.textContent=value.title||'Select a song';artist.textContent=value.artist||'';lyrics.innerHTML=value.html||'';screen.document.title=(value.title||'BenKen')+' · Lyrics';
    const variables=Object.entries(value.colors||{}).filter(([k,v])=>['bg','text','title','chord','verse','chorus','bridge','intro','solo','outro','melody'].includes(k)&&root.StageLyrics.hex(v)).map(([k,v])=>'--'+k+':'+v).join(';');
    style.textContent=css+'\nbody{'+variables+';font-size:'+Math.max(14,Math.min(72,Number(value.font)||30))+'px}';
    viewport.style.overflow=value.follow?'hidden':'auto';if(!value.follow){content.style.transform='none';lastY=null}
    frame();return true;
   }catch{screen=null;contentKey='';status('Lyrics window is unavailable. Open it again.');return false}
  }
  function open(){
   if(isOpen()){try{screen.focus()}catch{}refresh();return true}
   try{
    screen=root.open('about:blank','BenKenLyricsDisplay','popup,width=1000,height=760');if(!screen){status('Allow pop-ups for BenKen, then press OPEN LYRICS WINDOW again.');return false}
    const doc=screen.document;doc.documentElement.setAttribute('lang','en');doc.head.innerHTML='';doc.body.innerHTML='';
    style=doc.createElement('style');doc.head.appendChild(style);
    const meta=doc.createElement('meta');meta.setAttribute('name','viewport');meta.setAttribute('content','width=device-width,initial-scale=1');doc.head.appendChild(meta);
    viewport=doc.createElement('main');viewport.setAttribute('id','displayViewport');content=doc.createElement('div');content.setAttribute('id','displayContent');title=doc.createElement('h1');artist=doc.createElement('div');artist.setAttribute('id','displayArtist');lyrics=doc.createElement('article');lyrics.setAttribute('id','displayLyrics');
    for(const node of [title,artist,lyrics])content.appendChild(node);viewport.appendChild(content);doc.body.appendChild(viewport);contentKey='';lastY=null;
    refresh();status('Lyrics window open. On Mac, move it to your external screen.');return true;
   }catch{screen=null;status('This browser could not open a separate lyrics window. Use screen mirroring on iPad.');return false}
  }
  function frame(){
   if(!screen)return;if(screen.closed){screen=null;contentKey='';status('Lyrics window closed.');return}
   try{if(!o.follow())return;const progress=Math.max(0,Math.min(1,Number(o.progress())||0)),extent=Math.max(0,(content.scrollHeight||content.offsetHeight||0)-(screen.innerHeight||0)+48),y=progress*extent;
    if(lastY!==null&&Math.abs(lastY-y)<.02)return;lastY=y;content.style.transform='translate3d(0,'+(-y).toFixed(3)+'px,0)';
   }catch{screen=null;contentKey='';status('Lyrics window is unavailable. Open it again.')}
  }
  root.addEventListener('pagehide',close);
  return {open,close,refresh,frame,isOpen};
 }
 root.StageDisplay={VERSION:'26.32',mount};
})(typeof window!=='undefined'?window:globalThis);


// stage-reading.js
(function(root){
 'use strict';
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 function frame({height,offset=0,header=0,footer=0,font=22}){
  height=Math.max(1,Number(height)||1);offset=Number(offset)||0;
  const margin=Math.max(16,Math.min(32,(Number(font)||22)*.75)),bottom=Math.max(offset+margin,offset+height-Math.max(0,footer)-margin),top=Math.min(offset+Math.max(0,header)+margin,bottom-Math.min(64,height/3));
  return {top:Math.max(offset,top),bottom,height:Math.max(1,bottom-Math.max(offset,top))}
 }
 function position(section,progress,viewport,maxScroll){
  const h=Math.max(0,section.bottom-section.top),space=viewport.height??Math.max(1,viewport.bottom-viewport.top),p=clamp(Number(progress)||0,0,1);
  const target=h<=space?(section.top+section.bottom-viewport.top-viewport.bottom)/2:section.top-viewport.top+(h-space)*p;
  return clamp(target,0,Math.max(0,maxScroll))
 }
 function timeAt(y,plans,viewport,maxScroll,reference=0){
  let best={distance:Infinity,time:0,near:Infinity};
  for(const s of plans){const a=position(s,0,viewport,maxScroll),b=position(s,1,viewport,maxScroll),p=b>a?clamp((y-a)/(b-a),0,1):0,time=b>a?s.start+p*(s.end-s.start):(reference>=s.start&&reference<s.end?reference:s.start),distance=Math.abs(y-position(s,p,viewport,maxScroll)),near=Math.abs(time-reference);
   if(distance<best.distance-.5||(Math.abs(distance-best.distance)<=.5&&near<best.near))best={distance,time,near}
  }return best.time
 }
 // Monotone cubic interpolation joins section boundaries with a continuous scroll velocity.
 function anchors(plans,viewport){
  const center=(viewport.top+viewport.bottom)/2,points=plans.map((p,i)=>({time:p.start,y:(i?(plans[i-1].bottom+p.top)/2:p.top)-center}));
  if(plans.length)points.push({time:plans.at(-1).end,y:plans.at(-1).bottom-center});
  for(let i=1;i<points.length;i++)points[i].y=Math.max(points[i-1].y,points[i].y);
  const slopes=points.slice(1).map((p,i)=>(p.y-points[i].y)/(p.time-points[i].time));
  return points.map((p,i)=>({...p,slope:i===0?slopes[0]||0:i===points.length-1?slopes[i-1]||0:slopes[i-1]>0&&slopes[i]>0?2/(1/slopes[i-1]+1/slopes[i]):0}))
 }
 function continuousPosition(at,plans,viewport,maxScroll){
  const points=anchors(plans,viewport);if(!points.length)return 0;if(at<=points[0].time)return clamp(points[0].y,0,maxScroll);if(at>=points.at(-1).time)return clamp(points.at(-1).y,0,maxScroll);
  const i=points.findIndex((p,j)=>j<points.length-1&&at>=p.time&&at<points[j+1].time),a=points[i],b=points[i+1],dt=b.time-a.time,t=(at-a.time)/dt;
  return clamp((2*t*t*t-3*t*t+1)*a.y+(t*t*t-2*t*t+t)*dt*a.slope+(-2*t*t*t+3*t*t)*b.y+(t*t*t-t*t)*dt*b.slope,0,maxScroll)
 }
 function continuousTime(y,plans,viewport,maxScroll,reference=0){
  if(Math.abs(continuousPosition(reference,plans,viewport,maxScroll)-y)<.5)return reference;
  let lo=0,hi=plans.at(-1)?.end||0;for(let i=0;i<40;i++){const mid=(lo+hi)/2;if(continuousPosition(mid,plans,viewport,maxScroll)<y)lo=mid;else hi=mid}return (lo+hi)/2
 }
 // Keep the fractional part in a compositor layer when native scrolling rounds to pixels.
 function createScroller({read,write,move}){
  let offset=0;
  return {get offset(){return offset},position:()=>read()-offset,
   place(target){if(!Number.isFinite(target))return read()-offset;target=Math.max(0,target);write(Math.round(target));const actual=read(),next=Math.abs(actual-target)<=1?actual-target:0;if(Math.abs(next-offset)>1e-7){offset=next;move(offset)}return actual-offset},
   reset(){offset=0;move(0)}
  }
 }
 function createFollower({speed=240,response=4}={}){
  let value=null,velocity=0,target=null;
  function reset(next=null){value=Number.isFinite(next)?next:null;velocity=0;target=value}
  function advance(next,seconds){
   if(!Number.isFinite(next))return value??0;target=next;if(value===null){reset(next);return value}
   let left=Math.max(0,Math.min(1,Number(seconds)||0));
   while(left>1e-8){const dt=Math.min(.04,left),offset=value-next,exponent=Math.exp(-response*dt),term=(velocity+response*offset)*dt,candidate=next+(offset+term)*exponent;
    velocity=clamp((velocity-response*term)*exponent,-speed,speed);const previous=value;value+=clamp(candidate-value,-speed*dt,speed*dt);
    if((previous-next)*(value-next)<0){value=next;velocity=0}left-=dt
   }
   if(Math.abs(value-next)<.15&&Math.abs(velocity)<.5){value=next;velocity=0}return value
  }
  return {advance,reset,settled:()=>value===null||(Math.abs(value-target)<.15&&Math.abs(velocity)<.5)}
 }
 root.StageReading={VERSION:'26.32',frame,position,timeAt,anchors,continuousPosition,continuousTime,createScroller,createFollower};
})(typeof window!=='undefined'?window:globalThis);


// stage-project.js
(function(root){
 'use strict';
 const MAGIC='BKSP0001', MAX_MANIFEST=8*1024*1024, MAX_TRACKS=32, MAX_BUSES=16;
 const clamp=(v,a,b,d)=>Number.isFinite(Number(v))?Math.min(b,Math.max(a,Number(v))):d;
 const id=()=>root.crypto.randomUUID();
 const assetKey=v=>typeof v==='string'&&/^[-a-zA-Z0-9]{1,120}$/.test(v);
 function color(value){if(value==null||value==='')return undefined;if(typeof value!=='string'||!/^#[0-9a-f]{6}$/i.test(value))throw Error('Choose a valid channel color.');return value.toLowerCase()}
 function muteGroups(value){if(value==null)return [];if(!Array.isArray(value)||value.length>6||value.some(g=>!Number.isInteger(g)||g<1||g>6))throw Error('Mute groups must be numbered 1–6.');return [...new Set(value)].sort((a,b)=>a-b)}
 function groupNames(state){const names=state?.opts?.muteGroupNames;if(names!=null&&(!Array.isArray(names)||names.length>6))throw Error('Invalid mute group names.');const out=Array.from({length:6},(_,i)=>String(names?.[i]||'Group '+(i+1)).trim().slice(0,24)||'Group '+(i+1));if(new Set(out.map(n=>n.toLocaleLowerCase())).size!==6)throw Error('Give the mute groups different names.');return out}
 function track(t){if(!t||!assetKey(t.assetId))throw Error('This track needs a valid audio file.');const out={id:assetKey(t.id)?t.id:id(),assetId:t.assetId,name:String(t.name||'Audio track').slice(0,160),gain:clamp(t.gain,0,2,1),pan:clamp(t.pan,-1,1,0),mute:!!t.mute,solo:!!t.solo,output:Math.floor(clamp(t.output,1,64,1)),stereo:t.stereo!==false};const tint=color(t.color);if(tint)out.color=tint;if(t.fileName)out.fileName=String(t.fileName).slice(0,255);if(t.fileBytes!=null){if(!Number.isSafeInteger(t.fileBytes)||t.fileBytes<0||t.fileBytes>2147483648)throw Error('Invalid audio file size.');out.fileBytes=t.fileBytes}if(t.followTranspose!=null&&typeof t.followTranspose!=='boolean')throw Error('Follow song transpose must be on or off.');out.followTranspose=root.StageTranspose?root.StageTranspose.follows(t):t.followTranspose??true;out.muteGroups=muteGroups(t.muteGroups);if(t.bus!=null){if(!Number.isInteger(t.bus)||t.bus<1||t.bus>MAX_BUSES)throw Error('Invalid track output bus.');out.bus=t.bus}return out;}
 function bus(b){if(!b||!Number.isInteger(b.id)||b.id<1||b.id>MAX_BUSES)throw Error('Invalid output bus.');const out={id:b.id,name:String(b.name||'Bus '+b.id).slice(0,24),gain:clamp(b.gain??1,0,2,1),mute:!!b.mute,stereo:b.stereo!==false,output:Math.floor(clamp(b.output??1,1,64,1))};const tint=color(b.color);if(tint)out.color=tint;return out}
 function buses(state){const defaults=Array.from({length:MAX_BUSES},(_,i)=>bus({id:i+1,name:i===0?'Backing':i===1?'Click':'Bus '+(i+1),stereo:i!==1,output:i===0?1:i===1?3:i*2+1})),saved=state?.opts?.audioBuses;if(saved!=null){if(!Array.isArray(saved)||saved.length>MAX_BUSES)throw Error('Invalid bus configuration.');const ids=new Set();for(const b of saved){const value=bus(b);if(ids.has(value.id))throw Error('An output bus is listed more than once.');ids.add(value.id);defaults[value.id-1]=value}}return defaults}
 function clickBus(song){return song?.playback?.click?(root.StageClick?.settings(song).bus??song.playback.click.bus??2):undefined}
 function usedBuses(song){
  const values=tracks(song).map(t=>t.bus).filter(Boolean),generated=clickBus(song);if(generated)values.push(generated);return [...new Set(values)]
 }
 function mergeSong(current,incoming){
  if(incoming.songs.length!==1)throw Error('A song project must contain exactly one song.');
  const next=structuredClone(current),song=structuredClone(incoming.songs[0]),target=buses(current),source=buses(incoming),used=new Set(current.songs.flatMap(usedBuses)),mapping=new Map();
  const same=(a,b)=>['name','gain','mute','stereo','output','color'].every(k=>a[k]===b[k]);
  for(const t of [...tracks(song),...(clickBus(song)?[{bus:clickBus(song)}]:[])])if(t.bus&&!mapping.has(t.bus)){const from=source[t.bus-1];let to=target.find(b=>same(b,from));if(!to){to=!used.has(from.id)?target[from.id-1]:(target.find(b=>b.id>2&&!used.has(b.id))||target.find(b=>!used.has(b.id)));if(!to)throw Error('This project needs a free output bus. All 16 are in use. No songs have been changed.');target[to.id-1]={...from,id:to.id}}used.add(to.id);mapping.set(t.bus,to.id)}
  if(song.playback?.tracks)for(const t of song.playback.tracks)if(t.bus)t.bus=mapping.get(t.bus);if(song.playback?.click)song.playback.click.bus=mapping.get(clickBus(incoming.songs[0]));
  const targetNames=groupNames(current),sourceNames=groupNames(incoming),groupUsed=new Set(current.songs.flatMap(s=>tracks(s).flatMap(t=>t.muteGroups))),groupMapping=new Map();
  for(const t of tracks(song))for(const g of t.muteGroups)if(!groupMapping.has(g)){let index=targetNames.findIndex(n=>n.toLocaleLowerCase()===sourceNames[g-1].toLocaleLowerCase());if(index<0){index=!groupUsed.has(g)?g-1:targetNames.findIndex((_,i)=>!groupUsed.has(i+1));if(index<0)throw Error('All six mute groups are in use with other names. No songs have been changed.');targetNames[index]=sourceNames[g-1]}groupUsed.add(index+1);groupMapping.set(g,index+1)}
  if(song.playback?.tracks)for(const t of song.playback.tracks)t.muteGroups=muteGroups(t.muteGroups).map(g=>groupMapping.get(g)).sort((a,b)=>a-b);
  next.opts={...next.opts,audioBuses:target,muteGroupNames:targetNames};next.songs.push(song);next.idx=next.songs.length-1;next.set='';return next
 }
 function tracks(song){const a=song?.playback?.tracks;if(a){if(!Array.isArray(a)||a.length>MAX_TRACKS)throw Error('A song can contain up to 32 audio tracks.');return a.map(track)}return song?.audioId?[track({id:'legacy-'+song.audioId,assetId:song.audioId,name:'Backing track'})]:[];}
 function masterGain(song){return clamp(song?.playback?.masterGain??1,0,2,1)}
 function routeDirect(state,song,selectedTracks=tracks(song)){
  const outputs=buses(state),used=new Set(state.songs.flatMap(usedBuses)),planned=selectedTracks.map(t=>({...t}));let changed=0;
  for(const t of planned){if(t.bus)continue;let b=outputs.find(b=>b.output===t.output&&b.stereo===t.stereo&&b.gain===1&&!b.mute);
   if(!b){b=outputs.find(b=>b.id>2&&!used.has(b.id))||outputs.find(b=>!used.has(b.id));if(!b)throw Error('No free bus for USB '+t.output+'. Routing is unchanged.');outputs[b.id-1]=b=bus({id:b.id,name:t.name,output:t.output,stereo:t.stereo,gain:1,mute:false})}
   t.bus=b.id;if(!t.stereo)t.pan=0;used.add(b.id);changed++
  }return {tracks:planned,buses:outputs,changed}
 }
 function assets(state){const keys=new Set();for(const s of state.songs){for(const t of tracks(s))keys.add(t.assetId)}return [...keys];}
 function validateState(s){if(!root.StageCore.valid(s))throw Error('Invalid song library.');for(const song of s.songs){tracks(song);root.StageTempo?.config(song);root.StageTranspose?.config(song);root.StageClick?.settings(song);root.StageLyrics?.validateSaved(song.sectionTiming)}buses(s);groupNames(s);return s;}
 async function pack(state,repo,onProgress=()=>{},options={}){
  validateState(state);state=structuredClone(state);state.opts={...state.opts,audioBuses:buses(state),muteGroupNames:groupNames(state)};for(const key of ['doubleTapPlay','doubleTapStop','autoPlayNext','newTrackFormat','masterGain','masterHidden','masterMuted','mutedGroups','midiBindings','midiInputId','stageControls','stageBarVisible','setlistHidden','pinSetlist','stageControlsWrap','controlsButtonsOnly','controlsIconsOnly','mixerWidth','mixerView','busShowAll','waveformVisible','allowSeekDuringPlayback','seekStepSeconds','externalDisplayChords','externalDisplayFollow','externalDisplayFont','toolsCollapsed','ui24rHost','ui24rAutoCue'])delete state.opts[key];const entries=[],parts=[];let total=0;for(const key of assets(state)){const value=await repo.get(key);if(!value)throw Error('Audio file missing on this device: '+key+'. Import the file before making a full backup.');if(!value.data)throw Error('The audio file has no data: '+key);const data=value.data instanceof Blob?value.data:new Blob([value.data]);total+=data.size;if(total>256*1024*1024)throw Error('The project exceeds 256 MiB of stored audio. Choose Current song and save songs separately.');entries.push({id:key,name:value.name||key,type:value.type||'application/octet-stream',size:data.size});parts.push(data);onProgress(entries.length)}
  for(const song of state.songs)if(song.playback?.tracks)for(const t of song.playback.tracks){const file=entries.find(a=>a.id===t.assetId);if(file){t.fileBytes=file.size;if(!t.fileName)t.fileName=file.name}}
  const metadata=new TextEncoder().encode(JSON.stringify({format:'BenKen Stage Pro',version:6,appVersion:"26.32",scope:options.scope||"library",state,assets:entries}));if(metadata.length>MAX_MANIFEST)throw Error('The project manifest is too large.');const header=new Uint8Array(12);header.set(new TextEncoder().encode(MAGIC));new DataView(header.buffer).setUint32(8,metadata.length,true);return new Blob([header,metadata,...parts],{type:'application/x-benken-project'});
 }
 async function inspect(blob){
  const header=new Uint8Array(await blob.slice(0,12).arrayBuffer());if(header.length!==12||new TextDecoder().decode(header.slice(0,8))!==MAGIC)throw Error('This is not a BenKen project.');const length=new DataView(header.buffer).getUint32(8,true);if(!length||length>MAX_MANIFEST||12+length>blob.size)throw Error('The project file is damaged.');let manifest;try{manifest=JSON.parse(await blob.slice(12,12+length).text())}catch{throw Error('The project manifest could not be read.')}
  if(manifest.format!=='BenKen Stage Pro'||![1,2,3,4,5,6].includes(manifest.version)||!Array.isArray(manifest.assets)||manifest.assets.length>20000)throw Error('This project format is not supported.');validateState(manifest.state);const keys=new Set();let cursor=12+length;const entries=[];for(const a of manifest.assets){if(!assetKey(a.id)||keys.has(a.id)||!Number.isSafeInteger(a.size)||a.size<=0||a.size>2147483648)throw Error('Invalid audio file in the project.');keys.add(a.id);entries.push({...a,start:cursor});cursor+=a.size}if(cursor!==blob.size)throw Error('The project file is incomplete or damaged.');for(const key of assets(manifest.state))if(!keys.has(key))throw Error('An audio file is missing from the project.');return {...manifest,assets:entries};
 }
 async function unpack(blob,repo){
  const manifest=await inspect(blob),mapping=new Map(),created=[];try{for(const a of manifest.assets){const key=id();mapping.set(a.id,key);await repo.put(key,{name:a.name,type:a.type,data:await blob.slice(a.start,a.start+a.size).arrayBuffer()});created.push(key)}}catch(e){for(const key of created)await repo.remove(key).catch(()=>{});throw e}
  const state=structuredClone(manifest.state);for(const song of state.songs){if(song.audioId){if(mapping.has(song.audioId))song.audioId=mapping.get(song.audioId);else delete song.audioId;}if(song.playback?.tracks)for(const t of song.playback.tracks){const original=t.assetId,entry=manifest.assets.find(a=>a.id===original);if(entry){t.fileBytes=entry.size;if(!t.fileName)t.fileName=entry.name}t.assetId=mapping.get(original)}}return root.StageCore.normalize(state);
 }
 root.StageProject={VERSION:'26.32',MAGIC,MAX_TRACKS,MAX_BUSES,clickBus,usedBuses,color,track,bus,buses,muteGroups,groupNames,mergeSong,routeDirect,tracks,masterGain,assets,validateState,pack,inspect,unpack,id};
})(typeof window!=='undefined'?window:globalThis);


// stage-tempo.js
(function(root){
 'use strict';
 function config(song){const value=song?.playback?.tempo;if(value==null)return null;const originalBpm=Number(value.originalBpm),targetBpm=Number(value.targetBpm);if(!Number.isFinite(originalBpm)||!Number.isFinite(targetBpm)||originalBpm<20||originalBpm>300||targetBpm<20||targetBpm>300||targetBpm/originalBpm<.75||targetBpm/originalBpm>1.25)throw Error('Enter the original and playback BPM (20–300). Playback tempo can be 75–125% of the original.');return {originalBpm,targetBpm}}
 function ratio(song){const c=config(song);return c?c.targetBpm/c.originalBpm:1}
 const abort=()=>Object.assign(Error('Tempo preparation cancelled.'),{name:'AbortError'});
 const yieldTask=()=>new Promise(resolve=>root.setTimeout(resolve,0));
 // A shared WSOLA analysis map keeps every stem and stereo channel on the same sample positions.
 // Analysis is done once; rendering happens before playback, with no real-time processing cost.
 async function plan(buffer,rate,duration,{cancelled=()=>false}={}){
  const sr=buffer.sampleRate,hop=Math.max(64,Math.round(sr*.02)),window=hop*2,search=Math.round(sr*.008),length=Math.ceil(duration*sr/rate),count=Math.ceil(length/hop)+1,starts=new Int32Array(count),data=buffer.getChannelData(0);let previous=0;
  for(let k=1;k<count;k++){
   if(cancelled())throw abort();const nominal=Math.round(k*hop*rate),expected=previous+hop;let best=nominal,score=-Infinity;
   if(expected+hop<data.length&&nominal+hop+search<data.length){
    const start=Math.max(previous+1,nominal-search),end=Math.min(data.length-window,nominal+search);
    for(let candidate=start;candidate<=end;candidate+=8){let dot=0,a=0,b=0;for(let j=0;j<hop;j+=16){const x=data[expected+j]||0,y=data[candidate+j]||0;dot+=x*y;a+=x*x;b+=y*y}const value=a*b>1e-12?dot/Math.sqrt(a*b):-Infinity;if(value>score){score=value;best=candidate}}
    if(score===-Infinity)best=nominal;
   }
   starts[k]=best;previous=best;if(k%100===0)await yieldTask()
  }return {sampleRate:sr,rate,hop,window,length,starts}
 }
 async function render(buffer,map,context,{cancelled=()=>false}={}){
  if(buffer.sampleRate!==map.sampleRate)throw Error('All audio stems must use the same sample rate for tempo preparation.');
  const length=Math.max(1,Math.ceil(buffer.length/map.rate)),out=context.createBuffer(buffer.numberOfChannels,length,map.sampleRate),h=map.hop;
  for(let c=0;c<buffer.numberOfChannels;c++){
   const source=buffer.getChannelData(c),target=out.getChannelData(c);
   for(let k=0;k<map.starts.length;k++){
    if(cancelled())throw abort();const from=map.starts[k],to=k*h;if(to>=length)break;
    for(let j=0;j<map.window&&to+j<length;j++){
     // Complementary raised-cosine windows sum to one; first/last half-grains stay full level.
     const w=k===0&&j<h?1:j<h?.5-.5*Math.cos(Math.PI*j/h):.5+.5*Math.cos(Math.PI*(j-h)/h);
     target[to+j]+=(source[from+j]||0)*w
    }
    if(k%150===0)await yieldTask()
   }
  }return out
 }
 async function prepare(buffers,rate,context,{limit=256*1024*1024,cancelled=()=>false,progress=()=>{}}={}){
  if(rate===1||!buffers.length)return buffers;
  if(!Number.isFinite(rate)||rate<.75||rate>1.25)throw Error('Playback tempo must be 75–125% of the original.');
  const unique=[...new Set(buffers)],original=unique.reduce((n,b)=>n+b.length*b.numberOfChannels*4,0),rendered=unique.reduce((n,b)=>n+Math.ceil(b.length/rate)*b.numberOfChannels*4,0),peak=original+rendered;
  if(peak>limit)throw Error('Tempo preparation needs '+Math.ceil(peak/1048576)+' MiB including temporary audio. The limit is '+Math.floor(limit/1048576)+' MiB. Reset to the original BPM or use fewer, shorter or mono stems.');
  const reference=unique.reduce((a,b)=>b.length>a.length?b:a),duration=Math.max(...unique.map(b=>b.duration));progress('Preparing pitch-preserving tempo…');const map=await plan(reference,rate,duration,{cancelled}),cache=new Map();
  for(let i=0;i<unique.length;i++){if(cancelled())throw abort();progress('Preparing tempo · audio file '+(i+1)+' / '+unique.length);cache.set(unique[i],await render(unique[i],map,context,{cancelled}))}
  if(cancelled())throw abort();return buffers.map(b=>cache.get(b))
 }
 function metadata(song){
  const value=Number(song?.originalBpm??song?.bpm??String(song?.text||'').match(/^\s*\{\s*(?:tempo|bpm)\s*:\s*([0-9]+(?:[.,][0-9]+)?)\s*\}/im)?.[1]?.replace(',','.'));
  return Number.isFinite(value)&&value>=20&&value<=300?value:null
 }
 function bpmLimits(original){return {min:Math.ceil(Math.max(20,original*.75)*10-1e-8)/10,max:Math.floor(Math.min(300,original*1.25)*10+1e-8)/10}}
 function stepBpm(value,original,direction){if(!(original>=20&&original<=300))return null;const limits=bpmLimits(original);return Math.max(limits.min,Math.min(limits.max,Math.round(((Number(value)||original)+direction)*10)/10))}
 const median=values=>{const a=[...values].sort((a,b)=>a-b);return a.length?(a[Math.floor((a.length-1)/2)]+a[Math.ceil((a.length-1)/2)])/2:0};
 function clickTempo(peaks,fps){
  if(peaks.length<6)return null;const gaps=peaks.slice(1).map((p,i)=>p-peaks[i]),period=median(gaps),deviation=median(gaps.map(g=>Math.abs(g-period)))/period;if(!(period>0)||deviation>.08)return null;
  let index=0;const beat=peaks.map((p,i)=>i?(index+=Math.max(1,Math.round((p-peaks[i-1])/period))):0),meanX=beat.reduce((a,b)=>a+b,0)/beat.length,meanY=peaks.reduce((a,b)=>a+b,0)/peaks.length;let xy=0,xx=0;for(let i=0;i<peaks.length;i++){xy+=(beat[i]-meanX)*(peaks[i]-meanY);xx+=(beat[i]-meanX)**2}const fitted=xy/xx,bpm=60*fps/fitted,error=Math.sqrt(peaks.reduce((sum,p,i)=>sum+(p-(meanY+(beat[i]-meanX)*fitted))**2,0)/peaks.length)/fitted;
  return bpm>=20&&bpm<=300&&error<.06?{bpm,confidence:Math.max(0,1-error*10),method:'click'}:null
 }
 async function detect(buffer,{click=false,cancelled=()=>false}={}){
  if(!buffer?.getChannelData||!(buffer.sampleRate>0)||buffer.duration<6)return null;
  const sr=buffer.sampleRate,hop=Math.max(1,Math.round(sr/200)),fps=sr/hop,channels=Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c)),windowSeconds=Math.min(24,buffer.duration),last=Math.max(0,buffer.duration-windowSeconds),starts=[...new Set([0,last/2,last])],windows=[],clicks=[];
  for(const start of starts){
   const first=Math.floor(start*sr),count=Math.floor(Math.min(windowSeconds,buffer.duration-start)*fps),levels=new Float32Array(count);let sum=0,square=0,max=0;
   for(let i=0;i<count;i++){
    if(cancelled())throw abort();let energy=0,n=0;const from=first+i*hop,end=Math.min(buffer.length,from+hop);for(const channel of channels)for(let p=from;p<end;p+=4){energy+=channel[p]*channel[p];n++}const level=Math.sqrt(energy/Math.max(1,n));levels[i]=level;sum+=level;square+=level*level;max=Math.max(max,level);if(i&&i%2000===0)await yieldTask()
   }
   const mean=sum/count,variation=mean?Math.sqrt(Math.max(0,square/count-mean*mean))/mean:0;if(max<1e-4||variation<.12)continue;
   const envelope=new Float32Array(count);let previous=levels[0],peak=0;
   for(let i=1;i<count;i++){const smooth=((levels[i-1]||0)+2*levels[i]+(levels[i+1]??levels[i]))/4;envelope[i]=Math.max(0,smooth-previous-mean*.05);previous=smooth;peak=Math.max(peak,envelope[i])}
   const peaks=[];for(let i=1;i<count-1;i++)if(envelope[i]>=peak*.18&&envelope[i]>envelope[i-1]&&envelope[i]>=envelope[i+1]){if(peaks.length&&i-peaks.at(-1)<fps*.12){if(envelope[i]>envelope[peaks.at(-1)])peaks[peaks.length-1]=i}else peaks.push(i)}
   if(peaks.length<6)continue;
   if(click){const result=clickTempo(peaks,fps);if(result)clicks.push(result)}
   const baseline=envelope.reduce((a,b)=>a+b,0)/envelope.length;for(let i=0;i<envelope.length;i++)envelope[i]-=baseline;windows.push(envelope);await yieldTask()
  }
  if(cancelled())throw abort();
  if(clicks.length){const bpm=median(clicks.map(x=>x.bpm));return {bpm:Math.round(bpm*10)/10,confidence:median(clicks.map(x=>x.confidence)),method:'click'}}
  if(!windows.length)return null;
  let best={bpm:0,score:0,raw:0};
  for(let bpm=60;bpm<=200;bpm+=.25){
   if(cancelled())throw abort();const lag=60*fps/bpm,whole=Math.floor(lag),fraction=lag-whole;let score=0;
   for(const data of windows){let dot=0,a=0,b=0;for(let i=whole+1;i<data.length;i++){const x=data[i],y=data[i-whole]*(1-fraction)+data[i-whole-1]*fraction;dot+=x*y;a+=x*x;b+=y*y}score+=a*b>1e-16?dot/Math.sqrt(a*b):0}
   score/=windows.length;const weighted=score*(1-.025*Math.abs(Math.log2(bpm/120)));if(weighted>best.score)best={bpm,score:weighted,raw:score};if(Number.isInteger(bpm)&&bpm%20===0)await yieldTask()
  }
  return best.raw>=.16?{bpm:Math.round(best.bpm*10)/10,confidence:Math.min(.85,best.raw),method:'music'}:null
 }
 root.StageTempo={VERSION:'26.32',config,ratio,metadata,bpmLimits,stepBpm,detect,plan,render,prepare};
})(typeof window!=='undefined'?window:globalThis);


// stage-transpose.js
(function(root){
 'use strict';
 function config(song){const value=song?.playback?.transpose??0;if(!Number.isInteger(value)||value<-2||value>2)throw Error('Transpose must be a whole number from −2 to +2 semitones.');return value}
 function follows(track){if(track.followTranspose!=null){if(typeof track.followTranspose!=='boolean')throw Error('Follow song transpose must be on or off.');return track.followTranspose}return !/(?:click|clix|klikk|metronom|drums?|tromm|percussion)/i.test((track.fileName||'')+' '+(track.name||''))}
 const factor=semitones=>2**(config({playback:{transpose:semitones}})/12);
 const abort=()=>Object.assign(Error('Transpose preparation cancelled.'),{name:'AbortError'});
 const principal=phase=>phase-2*Math.PI*Math.round(phase/(2*Math.PI));
 function sample(data,at){const i=Math.floor(at),t=at-i,b=data[i]||0;if(!t)return b;const a=data[i-1]||0,c=data[i+1]||0,d=data[i+2]||0;return b+.5*t*(c-a+t*(2*a-5*b+4*c-d+t*(3*(b-c)+d-a)))}
 function fftPlan(size){
  const reverse=new Uint16Array(size),cos=new Float64Array(size/2),sin=new Float64Array(size/2),bits=Math.log2(size);
  for(let i=0;i<size;i++){let n=i,r=0;for(let b=0;b<bits;b++){r=r*2+(n&1);n>>=1}reverse[i]=r}
  for(let i=0;i<size/2;i++){cos[i]=Math.cos(2*Math.PI*i/size);sin[i]=Math.sin(2*Math.PI*i/size)}
  return function transform(re,im,inverse=false){
   for(let i=0;i<size;i++){const j=reverse[i];if(j>i){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]]}}
   for(let span=2;span<=size;span*=2){const half=span/2,step=size/span;for(let base=0;base<size;base+=span)for(let j=0;j<half;j++){const index=j*step,wr=cos[index],wi=sin[index]*(inverse?1:-1),a=base+j,b=a+half,x=re[b]*wr-im[b]*wi,y=re[b]*wi+im[b]*wr;re[b]=re[a]-x;im[b]=im[a]-y;re[a]+=x;im[a]+=y}}
   if(inverse)for(let i=0;i<size;i++){re[i]/=size;im[i]/=size}
  }
 }
 async function renderPitch(buffer,rate,pitch,context,{cancelled=()=>false,progress=()=>{}}={}){
  // A centered, streaming STFT keeps only one frame in memory. Virtual source
  // resampling sets pitch; phase propagation sets output duration separately.
  const size=buffer.sampleRate>=32000?2048:1024,half=size/2,hop=size/4,analysisHop=hop*rate/pitch,length=Math.max(1,Math.ceil(buffer.length/rate)),out=context.createBuffer(buffer.numberOfChannels,length,buffer.sampleRate),transform=fftPlan(size),window=Float64Array.from({length:size},(_,j)=>.5-.5*Math.cos(2*Math.PI*j/size));
  // Canonicalize global polarity so an inverted recording follows exactly the
  // same phase history, including near-zero FFT bins. Restore it on output.
  let polarity=1,found=false;
  for(let c=0;c<buffer.numberOfChannels&&!found;c++){const source=buffer.getChannelData(c);for(let i=0;i<source.length;i++){if(Math.abs(source[i])>1e-9){polarity=source[i]<0?-1:1;found=true;break}if(i&&i%262144===0){if(cancelled())throw abort();await new Promise(resolve=>root.setTimeout(resolve,0))}}}
  const re=new Float64Array(size),im=new Float64Array(size),phase=new Float64Array(half+1),previous=new Float64Array(half+1),sum=new Float64Array(half+1),outputPhase=new Float64Array(half+1),magnitude=new Float64Array(half+1),channels=Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c)),targets=channels.map((_,c)=>out.getChannelData(c));
  let reported=-1;for(let k=-2;k<=Math.ceil(length/hop)+2;k++){
   if(cancelled())throw abort();
   for(let c=0;c<channels.length;c++){
    for(let j=0;j<size;j++){re[j]=sample(channels[c],k*hop*rate+(j-half)*pitch)*polarity*window[j];im[j]=0}transform(re,im);
    if(c===0){
     for(let j=0;j<=half;j++){const current=Math.atan2(im[j],re[j]),omega=2*Math.PI*j/size;magnitude[j]=Math.hypot(re[j],im[j]);phase[j]=current;sum[j]=k===-2?current:sum[j]+omega*hop+principal(current-previous[j]-omega*analysisHop)*hop/analysisHop;previous[j]=current}
     // Lock each spectral peak's neighboring bins to its instantaneous phase.
     // This preserves vertical phase relationships in polyphonic material.
     const peaks=[];for(let j=1;j<half;j++)if(magnitude[j]>magnitude[j-1]&&magnitude[j]>=magnitude[j+1])peaks.push(j);let p=0;
     for(let j=0;j<=half;j++){while(p+1<peaks.length&&j>(peaks[p]+peaks[p+1])/2)p++;const anchor=peaks[p]??j;outputPhase[j]=sum[anchor]+principal(phase[j]-phase[anchor])}
    }
    for(let j=0;j<=half;j++){const angle=c?outputPhase[j]+principal(Math.atan2(im[j],re[j])-phase[j]):outputPhase[j],mag=Math.hypot(re[j],im[j]);re[j]=mag*Math.cos(angle);im[j]=j===0||j===half?0:mag*Math.sin(angle);if(j>0&&j<half){re[size-j]=re[j];im[size-j]=-im[j]}}
    transform(re,im,true);const target=targets[c];for(let j=0;j<size;j++){const to=k*hop+j-half;if(to>=0&&to<length)target[to]+=re[j]*window[j]*polarity*(2/3)}
   }
   if(k%16===0){const percent=Math.min(100,Math.max(0,Math.floor(k*hop/length*50)*2));if(percent!==reported){reported=percent;progress('Preparing key · '+percent+'%')}await new Promise(resolve=>root.setTimeout(resolve,0))}
  }
  if(cancelled())throw abort();return out
 }
 async function prepare(buffers,tracks,rate,semitones,context,{limit=256*1024*1024,reservedBytes=0,cancelled=()=>false,progress=()=>{}}={}){
  config({playback:{transpose:semitones}});if(!Number.isFinite(rate)||rate<.75||rate>1.25)throw Error('Playback tempo must be 75–125% of the original.');
  if(!buffers.length)return buffers;if(!semitones)return root.StageTempo.prepare(buffers,rate,context,{limit,cancelled,progress});if(buffers.length!==tracks.length)throw Error('Pitch preparation needs one track per audio buffer.');
  const unique=[...new Set(buffers)],bytes=b=>b.length*b.numberOfChannels*4,groups=new Map(),items=[];
  for(let i=0;i<buffers.length;i++){const source=buffers[i],pitch=follows(tracks[i])?factor(semitones):1;let variants=groups.get(source);if(!variants)groups.set(source,variants=new Map());if(!variants.has(pitch))variants.set(pitch,{source,pitch,output:null});items.push(variants.get(pitch))}
  const work=[...groups.values()].flatMap(m=>[...m.values()]),selected=work.filter(x=>x.pitch!==1);if(!selected.length)return root.StageTempo.prepare(buffers,rate,context,{limit:Math.max(0,limit-reservedBytes),cancelled,progress});
  const needs=work.filter(x=>rate!==1||x.pitch!==1),original=unique.reduce((n,b)=>n+bytes(b),0),rendered=needs.reduce((n,x)=>n+Math.ceil(x.source.length/rate)*x.source.numberOfChannels*4,0),workspace=(Math.max(...unique.map(b=>b.sampleRate))>=32000?2048:1024)*128,peak=reservedBytes+original+rendered+workspace;
  if(peak>limit)throw Error('Transposing needs '+Math.ceil(peak/1048576)+' MiB including temporary audio. The limit is '+Math.floor(limit/1048576)+' MiB. Keep the original key or use fewer, shorter or mono tracks.');
  for(let i=0;i<work.length;i++){
   if(cancelled())throw abort();const item=work[i];if(item.pitch===1&&rate===1){item.output=item.source;continue}
   progress('Preparing key '+(semitones>0?'+':'')+semitones+' · audio '+(i+1)+' / '+work.length);
   item.output=await renderPitch(item.source,rate,item.pitch,context,{cancelled,progress})
  }
  if(cancelled())throw abort();return items.map(x=>x.output)
 }
 root.StageTranspose={VERSION:'26.32',config,follows,factor,prepare};
})(typeof window!=='undefined'?window:globalThis);


// stage-audio.js
(function(root){
 'use strict';
 const MAX_DECODED=256*1024*1024;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function monoBuffer(source,context){
  const result=context.createBuffer(1,source.length,source.sampleRate||context.sampleRate),out=result.getChannelData(0),left=source.getChannelData(0),right=source.getChannelData(1);
  for(let i=0;i<out.length;i++)out[i]=(left[i]+right[i])*.5;
  return result
 }
 function waveInfo(data,sampleRate){
  if(data.byteLength<44)return null;const d=new DataView(data),tag=p=>String.fromCharCode(d.getUint8(p),d.getUint8(p+1),d.getUint8(p+2),d.getUint8(p+3));if(tag(0)!=='RIFF'||tag(8)!=='WAVE')return null;let format=null,size=null;
  for(let p=12;p+8<=d.byteLength;){const name=tag(p),length=d.getUint32(p+4,true);if(length>d.byteLength-p-8)return null;if(name==='fmt '&&length>=16){let code=d.getUint16(p+8,true);if(code===65534&&length>=40)code=d.getUint16(p+32,true);format={code,channels:d.getUint16(p+10,true),rate:d.getUint32(p+12,true),align:d.getUint16(p+20,true)}}if(name==='data')size=length;p+=8+length+(length%2)}
  if(!format||![1,3].includes(format.code)||!format.rate||!format.align||!format.channels||size===null)return null;const frames=Math.floor(size/format.align),duration=frames/format.rate;return {channels:format.channels,duration,decodedBytes:Math.ceil(duration*sampleRate)*format.channels*4}
 }
 function level(peak){const db=peak>0?20*Math.log10(peak):-Infinity;return {db,label:Number.isFinite(db)?db.toFixed(1):'−∞',percent:Number.isFinite(db)?clamp((db+60)/60*100,0,100):0,clip:peak>=1}}
 class MediaRepository{
  db(){return new Promise((resolve,reject)=>{const r=root.indexedDB.open('benken-audio-v1',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('tracks'))r.result.createObjectStore('tracks')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
  async transaction(mode,key,value,remove=false){const db=await this.db();return new Promise((resolve,reject)=>{let result;const tx=db.transaction('tracks',mode),store=tx.objectStore('tracks'),r=mode==='readonly'?store.get(key):remove?store.delete(key):store.put(value,key);r.onsuccess=()=>{result=r.result};tx.oncomplete=()=>{db.close();resolve(result)};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error||r.error||Error('The audio file could not be saved locally.'))}})}
  async get(key){const v=await this.transaction('readonly',key);if(v?.blob&&!v.data)return {...v,data:await v.blob.arrayBuffer()};return v}
  put(key,value){return this.transaction('readwrite',key,value)}
  remove(key){return this.transaction('readwrite',key,null,true)}
 }
 class BrowserPlayer{
  constructor(options={}){this.context=options.context||null;this.notify=options.notify||(()=>{});this.mode=options.mode==='stereo'?'stereo':'usb';this.tracks=[];this.buffers=[];this.info=new Map();this.nodes=[];this.busNodes=new Map();this.duration=0;this.position=0;this.playing=false;this.transportState='stopped';this.preparing=false;this.loadError='';this.generation=0;this.playRequest=0;this.master=1;this.globalMaster=1;this.tempoRatio=1;this.sourceDuration=0;this.channels=0;this.reportedChannels=0;this.samples=new Float32Array(256);this.decodedBytes=0;this.waits=new Set();this.preparedCache=options.preparedCache===false?null:options.preparedCache||(root.StagePrepared?new root.StagePrepared.Cache():null);this.cacheHits=0;this.cacheWrites=0;this.cacheWarning='';this.preparationMessage='';this.retryableError=false}
  ensure(){
   if(!this.context){const Context=root.AudioContext||root.webkitAudioContext;if(!Context)throw Error('This browser does not support multitrack audio.');this.context=new Context({latencyHint:'playback'});this.context.onstatechange=()=>{if((this.playing||this.click?.running)&&this.context.state!=='running'){this.pause();this.notify({error:'Audio was interrupted. Check your audio interface and press Play to continue.'})}}}
   return this.context
  }
  configure(){
   const ctx=this.ensure(),destination=ctx.destination;
   this.reportedChannels=Math.max(1,Math.floor(Number(destination.maxChannelCount)||Number(destination.channelCount)||2));
   const requested=Math.min(this.mode==='stereo'?2:32,this.reportedChannels);
   try{destination.channelCount=requested}catch{}
   const count=Math.max(1,Math.min(32,Number(destination.channelCount)||2));
   if(this.mode==='stereo'&&count>2)throw Error('The browser could not select a stereo output.');
   destination.channelInterpretation='discrete';
   if(this.masterBus&&count===this.channels)return;
   this.releaseBuses();if(this.masterBus){this.masterBus.disconnect();this.songBus.disconnect();this.merger.disconnect();this.masterSplitter.disconnect();this.songSplitter.disconnect();this.songAnalysers.forEach(a=>a.disconnect());this.masterAnalysers.forEach(a=>a.disconnect())}
   this.channels=count;this.merger=ctx.createChannelMerger(count);this.merger.channelInterpretation='discrete';
   this.masterBus=ctx.createGain();this.masterBus.channelCount=count;this.masterBus.channelCountMode='explicit';this.masterBus.channelInterpretation='discrete';this.masterBus.gain.value=this.masterMuted?0:this.globalMaster;
   this.songBus=ctx.createGain();this.songBus.channelCount=count;this.songBus.channelCountMode='explicit';this.songBus.channelInterpretation='discrete';this.songBus.gain.value=this.master;this.merger.connect(this.songBus);this.songBus.connect(this.masterBus);this.masterBus.connect(destination);
   this.songSplitter=ctx.createChannelSplitter(count);this.songBus.connect(this.songSplitter);this.songAnalysers=Array.from({length:count},(_,i)=>{const a=ctx.createAnalyser();a.fftSize=256;this.songSplitter.connect(a,i);return a});
   this.masterSplitter=ctx.createChannelSplitter(count);this.masterBus.connect(this.masterSplitter);
   this.masterAnalysers=Array.from({length:count},(_,i)=>{const a=ctx.createAnalyser();a.fftSize=256;this.masterSplitter.connect(a,i);return a})
  }
  setBuses(buses){this.buses=buses;for(const node of this.busNodes?.values()||[]){const b=buses.find(b=>b.id===node.id);if(b)node.volume.gain.setTargetAtTime(b.mute?0:b.gain,this.context.currentTime,.012)}}
  routeError(tracks=this.tracks){
   for(const t of tracks){const route=t.bus?this.buses?.find(b=>b.id===t.bus):t;if(!route)return '«'+t.name+'» is missing output bus '+t.bus+'.';if(this.mode==='stereo')continue;if(route.output<1||route.output>this.channels||(route.stereo&&route.output+1>this.channels))return '«'+(t.bus?route.name:t.name)+'» requires USB output '+route.output+(route.stereo?'–'+(route.output+1):'')+'. This browser provides '+this.channels+' channels. Check your interface or change the routing.'}return ''
  }
  createBus(bus){
   const ctx=this.context,count=bus.stereo?2:1,input=ctx.createGain(),volume=ctx.createGain(),splitter=ctx.createChannelSplitter(count),analysers=[];
   input.channelCount=count;input.channelCountMode='explicit';input.channelInterpretation='speakers';volume.gain.value=bus.mute?0:bus.gain;input.connect(volume);volume.connect(splitter);
   const route=(source,channel)=>{const a=ctx.createAnalyser();a.fftSize=256;splitter.connect(a,source);a.connect(this.merger,0,channel);analysers.push(a)};
   route(0,this.mode==='stereo'?0:bus.output-1);
   if(bus.stereo&&(this.mode!=='stereo'||this.channels>1))route(1,this.mode==='stereo'?1:bus.output);else if(!bus.stereo&&this.mode==='stereo'&&this.channels>1)route(0,1);
   const node={id:bus.id,input,volume,splitter,analysers};this.busNodes.set(bus.id,node);return node
  }
  report(message,gen=this.generation){if(gen!==this.generation)return;this.preparationMessage=message;this.notify({message})}
  wait(promise,gen,message,ms=90000){
   return new Promise((resolve,reject)=>{let finished=false;const finish=(fn,value)=>{if(finished)return;finished=true;root.clearTimeout(timer);this.waits.delete(cancel);fn(value)},cancel=()=>finish(reject,Object.assign(Error('Audio preparation cancelled.'),{name:'AbortError'})),timer=root.setTimeout(()=>finish(reject,Object.assign(Error(message+' timed out. Press PREPARE AUDIO to try again.'),{retryable:true})),ms);this.waits.add(cancel);Promise.resolve(promise).then(value=>gen===this.generation?finish(resolve,value):cancel(),error=>finish(reject,error))})
  }
  async load(tracks,repo,tempoRatio=1,transpose=0){
   this.cancel();const gen=this.generation;this.tracks=tracks;if(transpose&&!root.StageTranspose)throw Error('Reload the complete update before transposing.');this.tempoRatio=tempoRatio;this.transpose=transpose;this.preparing=true;this.notify({loading:true});
   try{
    if(!tracks.length){this.preparing=false;this.notify({ready:true});return true}
    let configured=false,bytes=0,originalDuration=0;const writes=[],buffers=[],info=new Map(),decoded=new Map(),stereoAssets=new Set(tracks.filter(t=>t.stereo).map(t=>t.assetId));this.info=info;
    for(const track of tracks){
     if(decoded.has(track.assetId)){const cached=decoded.get(track.assetId);buffers.push(transpose?cached.get(root.StageTranspose.follows(track)):cached);continue}
     this.report('Reading '+track.name+' · '+(buffers.length+1)+' / '+tracks.length,gen);const file=await this.wait(repo.get(track.assetId),gen,'Reading «'+track.name+'»');if(gen!==this.generation)return false;
     if(!file?.data)throw Error('Audio file «'+track.name+'» is missing locally. Open Mixer Settings > Audio & Files > REPLACE FILE, or restore a project/backup with audio.');
     const data=file.data instanceof Blob?await file.data.arrayBuffer():file.data;
     if(data.byteLength>160*1024*1024)throw Error('«'+track.name+'» exceeds the 160 MiB file limit in this web version.');
     if(!configured){this.configure();configured=true}
     const mono=!stereoAssets.has(track.assetId),variants=transpose?[...new Map(tracks.filter(t=>t.assetId===track.assetId).map(t=>[root.StageTranspose.follows(t),t])).entries()].sort((a,b)=>Number(a[0])-Number(b[0])):[],cache=this.preparedCache;
     let cacheKey=null;
     if(transpose&&cache&&variants.some(v=>v[0])){
      cacheKey=await this.wait(cache.key(track.assetId,data,{sampleRate:this.context.sampleRate,mono,rate:tempoRatio,semitones:transpose,variants:variants.map(v=>v[0])}),gen,'Checking the saved key',15000);if(gen!==this.generation)return false;
      this.report('Loading saved key · '+track.name,gen);let saved=null;try{saved=await this.wait(cache.read(cacheKey,this.context,{reservedBytes:bytes,limit:MAX_DECODED,cancelled:()=>gen!==this.generation,progress:message=>this.report(track.name+' · '+message,gen)}),gen,'Loading the saved key',300000)}catch(error){if(gen!==this.generation)return false;cache.disabled=true}if(gen!==this.generation)return false;
      if(saved&&saved.buffers.length===variants.length){const cached=new Map(variants.map((v,i)=>[v[0],saved.buffers[i]]));bytes+=[...new Set(saved.buffers)].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0);originalDuration=Math.max(originalDuration,saved.info.duration);info.set(track.assetId,{...saved.info,name:file.name||track.name,bytes:data.byteLength});buffers.push(cached.get(root.StageTranspose.follows(track)));decoded.set(track.assetId,cached);this.requiredBytes=bytes;this.cacheHits++;continue}
     }
     const estimate=waveInfo(data,this.context.sampleRate);if(estimate){info.set(track.assetId,{name:file.name||track.name,bytes:data.byteLength,...estimate,estimated:true});if(estimate.channels>2)throw Error('«'+track.name+'» has more than two channels. Import separate mono or stereo files.');this.requiredBytes=bytes+estimate.decodedBytes+(mono&&estimate.channels===2?estimate.decodedBytes/2:0);if(this.requiredBytes>MAX_DECODED)throw Error(mono&&estimate.channels===2?'Preparing mono audio needs at least '+Math.ceil(this.requiredBytes/1048576)+' MiB temporarily. The limit is 256 MiB. Use fewer, shorter or original mono files. Your files are kept locally.':'This song needs at least '+Math.ceil(this.requiredBytes/1048576)+' MiB of decoded audio. The limit is 256 MiB. WAV and MP3 use the same working memory at the same duration, sample rate and channel count. Use fewer, shorter or mono tracks. Your files are kept locally.')}
     let buffer;try{buffer=await this.wait(this.context.decodeAudioData(data.slice(0)),gen,'Decoding «'+track.name+'»')}catch(error){if(error.name==='AbortError'||error.retryable)throw error;throw Error('Audio file «'+track.name+'» could not be read. Try WAV, MP3 or M4A.')}
     if(gen!==this.generation)return false;
     if(buffer.numberOfChannels>2)throw Error('«'+track.name+'» has more than two channels. Import separate mono or stereo files.');
     const sourceChannels=buffer.numberOfChannels,sourceBytes=buffer.length*sourceChannels*4,fold=mono&&sourceChannels===2,memory=fold?sourceBytes/2:sourceBytes;
     this.requiredBytes=bytes+sourceBytes+(fold?memory:0);
     if(fold&&this.requiredBytes>MAX_DECODED)throw Error('Preparing mono audio needs at least '+Math.ceil(this.requiredBytes/1048576)+' MiB temporarily. The limit is 256 MiB. Use fewer, shorter or original mono files. Your files are kept locally.');
     if(fold)buffer=monoBuffer(buffer,this.context);
     originalDuration=Math.max(originalDuration,buffer.duration);if(!transpose)bytes+=memory;this.requiredBytes=bytes+(!transpose?0:memory);info.set(track.assetId,{name:file.name||track.name,bytes:data.byteLength,channels:sourceChannels,playbackChannels:buffer.numberOfChannels,duration:buffer.duration,decodedBytes:memory});
     if(bytes+(!transpose?0:memory)>MAX_DECODED)throw Error('This song needs at least '+Math.ceil(bytes/1048576)+' MiB of decoded audio. The limit is 256 MiB. MP3 saves storage space, but not decoded memory. Use fewer, shorter or mono tracks. Your files are kept locally.');
     if(transpose){
      const options={limit:MAX_DECODED,reservedBytes:bytes,cancelled:()=>gen!==this.generation,progress:message=>this.report(track.name+' · '+message,gen)};
      const outputs=await this.wait(root.StageTranspose.prepare(variants.map(()=>buffer),variants.map(v=>v[1]),tempoRatio,transpose,this.context,options),gen,'Preparing the key for «'+track.name+'»',300000);if(gen!==this.generation)return false;
      const cached=new Map(variants.map((v,i)=>[v[0],outputs[i]]));bytes+=[...new Set(outputs)].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0);this.requiredBytes=bytes;
      if(bytes>MAX_DECODED)throw Error('Prepared audio exceeds the 256 MiB working-memory limit.');
      buffer=cached.get(root.StageTranspose.follows(track));buffers.push(buffer);decoded.set(track.assetId,cached);if(cacheKey)writes.push({key:cacheKey,outputs,info:info.get(track.assetId),name:track.name});else if(variants.some(v=>v[0])&&cache)this.cacheWarning='Prepared audio could not be saved locally; reopening will prepare it again.'
     }else{buffers.push(buffer);decoded.set(track.assetId,buffer)}
    }
    if(gen!==this.generation)return false;
    this.sourceDuration=originalDuration;const options={limit:MAX_DECODED,cancelled:()=>gen!==this.generation,progress:message=>this.report(message,gen)};if(transpose&&!root.StageTranspose)throw Error('Reload the complete update before transposing.');const readyBuffers=transpose||tempoRatio===1?buffers:await this.wait(root.StageTempo.prepare(buffers,tempoRatio,this.context,options),gen,'Preparing the song tempo',300000);if(gen!==this.generation)return false;const total=[...new Set(readyBuffers)].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0);
    for(const entry of writes){if(gen!==this.generation)return false;if(total+2*root.StagePrepared.CHUNK*4>MAX_DECODED){this.cacheWarning='Prepared audio is ready, but there is not enough temporary memory to keep a local prepared copy.';break}let kept=false,stopCache=false;try{kept=await this.wait(this.preparedCache.write(entry.key,entry.outputs,entry.info,{cancelled:()=>stopCache||gen!==this.generation,progress:message=>this.report(entry.name+' · '+message,gen)}),gen,'Saving the prepared key',300000)}catch(error){stopCache=true;if(gen!==this.generation)return false;this.preparedCache.disabled=true}if(kept)this.cacheWrites++;else this.cacheWarning='Prepared audio could not be saved locally; reopening will prepare it again.'}
    if(gen!==this.generation)return false;this.buffers=readyBuffers;this.info=info;this.duration=Math.max(0,...readyBuffers.map(b=>b.duration));this.decodedBytes=[...new Set(readyBuffers)].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0);this.requiredBytes=this.decodedBytes;this.preparing=false;this.notify({ready:true});return true
   }catch(error){if(gen!==this.generation)return false;if(gen===this.generation){this.generation++;for(const cancel of [...this.waits])cancel();this.retryableError=error.retryable===true;this.buffers=[];this.decodedBytes=0;this.duration=0;this.preparing=false;this.loadError=error.message;this.notify({error:error.message})}throw error}
  }
  groupMuted(track){return (track.muteGroups||[]).some(g=>this.muteGroups?.has(g))}
  setMuteGroups(groups){this.muteGroups=new Set(groups);this.update(this.tracks)}
  effective(track){return track.mute||this.groupMuted(track)||(this.tracks.some(t=>t.solo)&&!track.solo)?0:track.gain}
  addPath(node,input,channel,gain,target=this.merger){
   const ctx=this.context,volume=ctx.createGain(),analyser=ctx.createAnalyser();volume.gain.value=gain;analyser.fftSize=256;
   node.splitter.connect(volume,input);volume.connect(analyser);analyser.connect(target,0,channel);node.paths.push({gain:volume,analyser})
  }
  async play({delay=0,onScheduled}={}){
   if(this.playing||this.preparing||!this.buffers.length)return;
   const ctx=this.ensure(),gen=this.generation,request=++this.playRequest;await ctx.resume();
   if(gen!==this.generation||request!==this.playRequest||this.playing)return;
   if(ctx.state!=='running')throw Error('Audio engine state: '+ctx.state+'. Press Play again.');
   this.configure();const error=this.routeError();if(error)throw Error(error);
   if(this.position>=this.duration)this.position=0;
   const when=ctx.currentTime+.05+Math.max(0,delay);this.startTime=when;this.countInStart=delay>0?ctx.currentTime+.05:null;this.startOffset=this.position;
   try{
    this.click?.stop();this.releaseBuses();this.nodes=[];this.busNodes=new Map();this.buffers.forEach((buffer,i)=>{
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
    onScheduled?.(when);this.playing=true;this.transportState='playing';this.notify({playing:true})
   }catch(error){this.pause();throw error}
  }
  get countingIn(){return this.playing&&this.countInStart!==null&&this.context.currentTime<this.startTime}
  get currentTime(){return this.playing?Math.min(this.duration,this.startOffset+Math.max(0,this.context.currentTime-this.startTime)):this.position}
  releaseBuses(){for(const b of this.busNodes?.values()||[]){b.input.disconnect();b.volume.disconnect();b.splitter.disconnect();b.analysers.forEach(a=>a.disconnect())}this.busNodes=new Map()}
  pause(){
   this.click?.stop();this.countInStart=null;
   this.seekSerial=(this.seekSerial||0)+1;this.seekResume=false;this.playRequest++;if(this.playing)this.position=this.currentTime;this.playing=false;this.transportState='paused';
   for(const n of this.nodes){try{n.source.stop()}catch{}n.source.disconnect();n.splitter.disconnect();n.mono?.disconnect();n.busMerger?.disconnect();for(const path of n.paths){path.gain.disconnect();path.analyser.disconnect()}}
   this.releaseBuses();
   this.nodes=[];this.notify({playing:false})
  }
  async seek(seconds,resume=this.playing||!!this.seekResume,playOptions={}){
   const value=Number(seconds);if(!Number.isFinite(value)||!this.buffers.length||this.preparing||this.buffers.length!==this.tracks.length)return false;
   this.pause();const serial=this.seekSerial,gen=this.generation;this.position=clamp(value,0,this.duration);this.seekResume=resume;this.notify({seeked:true,position:this.position});
   try{if(resume&&this.position<this.duration)await this.play(playOptions);return serial===this.seekSerial&&gen===this.generation}finally{if(serial===this.seekSerial)this.seekResume=false}
  }
  stop(){this.pause();this.position=0;this.transportState='stopped';this.notify({stopped:true})}
  cancel(){this.generation++;for(const cancel of [...this.waits])cancel();this.cacheHits=this.cacheWrites=0;this.cacheWarning='';this.preparationMessage='';this.retryableError=false;this.stop();this.buffers=[];this.tracks=[];this.info.clear();this.duration=0;this.sourceDuration=0;this.decodedBytes=0;this.requiredBytes=0;this.preparing=false;this.loadError=''}
  update(tracks){this.tracks=tracks;this.nodes.forEach((node,i)=>{const t=tracks[i];if(!t)return;const base=this.effective(t);node.paths.forEach((path,p)=>path.gain.gain.setTargetAtTime(t.stereo||t.bus?base*(p===0?(t.pan>0?1-t.pan:1):(t.pan<0?1+t.pan:1)):base,this.context.currentTime,.012))})}
  setMaster(value){this.master=clamp(Number(value)||0,0,2);if(this.songBus)this.songBus.gain.setTargetAtTime(this.master,this.context.currentTime,.012)}
  setGlobalMaster(value){this.globalMaster=clamp(Number(value)||0,0,2);if(this.masterBus)this.masterBus.gain.setTargetAtTime(this.masterMuted?0:this.globalMaster,this.context.currentTime,.012)}
  meterSong(){return this.playing||this.click?.active?this.peak(this.songAnalysers):0}
  setMasterMuted(value){this.masterMuted=!!value;if(this.masterBus)this.masterBus.gain.setTargetAtTime(this.masterMuted?0:this.globalMaster,this.context.currentTime,.012)}
  setMode(mode){if(this.playing||this.click?.running)throw Error('Stop playback and metronome before changing output mode.');this.mode=mode==='stereo'?'stereo':'usb';this.configure()}
  peak(analysers){let peak=0;for(const a of analysers){a.getFloatTimeDomainData(this.samples);for(const n of this.samples)peak=Math.max(peak,Math.abs(n))}return peak}
  meters(){return this.nodes.map(n=>this.peak(n.paths.map(p=>p.analyser)))}
  meterBuses(){return new Map(Array.from(this.busNodes?.values()||[],b=>[b.id,this.peak(b.analysers)]))}
  meterMaster(){return this.playing||this.click?.active?this.peak(this.masterAnalysers):0}
  tick(){if(!this.playing)return;if(this.context.state!=='running'){this.pause();return}const max=Number(this.context.destination.maxChannelCount);if(max>0&&max!==this.reportedChannels){this.pause();this.notify({error:'The audio device changed. Check the outputs and prepare the audio again.'});return}if(this.currentTime>=this.duration){this.pause();this.position=this.duration;this.transportState='stopped';this.notify({ended:true})}}
 }
 root.StageAudio={VERSION:'26.32',level,waveInfo,MAX_DECODED,MediaRepository,BrowserPlayer};
})(typeof window!=='undefined'?window:globalThis);


// stage-click.js
(function(root){
 'use strict';
 function settings(song){
  const raw=song?.playback?.click;if(raw!=null&&(typeof raw!=='object'||Array.isArray(raw)))throw Error('Invalid metronome settings.');const r=raw||{};
  const value={bpm:r.bpm??120,followSongBpm:r.followSongBpm!==false,beatsPerBar:r.beatsPerBar??4,countInBars:r.countInBars??0,countInSound:r.countInSound===true,continuous:r.continuous===true,bus:r.bus??2,volume:r.volume??.12};
  if(!Number.isFinite(value.bpm)||value.bpm<20||value.bpm>300)throw Error('Metronome BPM must be between 20 and 300.');
  if(!Number.isInteger(value.beatsPerBar)||value.beatsPerBar<2||value.beatsPerBar>12)throw Error('Choose 2–12 beats per bar.');
  if(![0,2,4].includes(value.countInBars))throw Error('Choose count-in OFF, 2 bars or 4 bars.');
  if(!Number.isInteger(value.bus)||value.bus<1||value.bus>16)throw Error('Choose a metronome output bus from 1–16.');
  if(!Number.isFinite(value.volume)||value.volume<0||value.volume>1)throw Error('Choose a click level between 0 and 100%.');
  for(const k of ['followSongBpm','countInSound','continuous'])if(r[k]!=null&&typeof r[k]!=='boolean')throw Error('Invalid metronome setting.');
  return value
 }
 function config(song){const s=settings(song),songBpm=root.StageTempo?.config(song)?.targetBpm||root.StageTempo?.metadata(song);return {...s,bpm:s.followSongBpm&&songBpm?songBpm:s.bpm,songBpm:songBpm||null}}
 class Engine{
  constructor(player,{notify=()=>{}}={}){this.player=player;this.notify=notify;this.serial=0;this.clock=null;this.starting=false;this.nodes=new Set();this.route=null}
  get active(){return !!this.clock}
  get running(){return this.starting||this.active}
  error(config){return this.player.routeError([{name:'Metronome',bus:config.bus}])}
  routeTo(config){const p=this.player,error=this.error(config);if(error)throw Error(error);const bus=p.buses?.find(b=>b.id===config.bus);if(!bus)throw Error('The metronome output bus is missing.');const target=p.busNodes.get(bus.id)||p.createBus(bus),merger=p.context.createChannelMerger(2);merger.channelInterpretation='discrete';merger.connect(target.input);this.route=merger}
  pulse(index,at,config){
   const ctx=this.player.context,osc=ctx.createOscillator(),gain=ctx.createGain(),node={osc,gain,end:at+.045};osc.type='sine';osc.frequency.value=index%config.beatsPerBar===0?1320:880;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(config.volume*(index%config.beatsPerBar===0?1:.65),at+.002);gain.gain.linearRampToValueAtTime(0,at+.035);osc.connect(gain);gain.connect(this.route,0,0);gain.connect(this.route,0,1);this.nodes.add(node);osc.onended=()=>this.release(node);osc.start(at);osc.stop(node.end)
  }
  release(node){if(!this.nodes.delete(node))return;node.osc.onended=null;try{node.osc.disconnect()}catch{}try{node.gain.disconnect()}catch{}}
  beginMusic(config,startTime,countBeats,offset=0){
   this.stop();if(!countBeats&&!config.continuous)return;
   const period=60/config.bpm,start=countBeats?startTime-countBeats*period:startTime-offset,audible=(countBeats>0&&config.countInSound)||config.continuous;
   try{if(audible)this.routeTo(config);this.clock={config,start,period,count:countBeats,kind:'music',next:countBeats||Math.max(0,Math.ceil((this.player.context.currentTime+.01-start)/period)),continuous:config.continuous};
    if(config.countInSound)for(let n=0;n<countBeats;n++)this.pulse(n,start+n*period,config);this.tick()
   }catch(error){this.stop();throw error}
  }
  async start(config){
   this.stop();const serial=++this.serial,gen=this.player.generation;this.starting=true;
   try{if(!this.player.playing)this.player.releaseBuses();const ctx=this.player.ensure();await ctx.resume();if(serial!==this.serial||gen!==this.player.generation)return false;if(ctx.state!=='running')throw Error('Audio engine state: '+ctx.state+'. Press METRONOME again.');this.player.configure();this.routeTo(config);const linked=this.player.playing,start=linked?this.player.startTime-this.player.startOffset:ctx.currentTime+.05,period=60/config.bpm,next=linked?Math.max(0,Math.ceil((ctx.currentTime+.01-start)/period)):0;this.clock={config,start,period,count:0,kind:linked?'linked':'standalone',next,continuous:true};this.starting=false;this.tick();return true}
   catch(error){if(serial===this.serial)this.stop();throw error}finally{if(serial===this.serial)this.starting=false}
  }
  stop(){this.serial++;this.starting=false;this.clock=null;for(const node of [...this.nodes]){try{node.osc.stop()}catch{}this.release(node)}if(this.route){try{this.route.disconnect()}catch{}this.route=null}}
  tick(){
   const clock=this.clock;if(!clock)return;const ctx=this.player.context,now=ctx.currentTime;
   const maximum=Number(ctx.destination.maxChannelCount);if(ctx.state!=='running'||maximum>0&&maximum!==this.player.reportedChannels){this.player.pause();this.notify('Metronome stopped: the audio device was interrupted or changed.');return}
   for(const n of [...this.nodes])if(n.end<=now)this.release(n);
   if(clock.kind==='music'&&!clock.continuous){if(now>=clock.start+clock.count*clock.period)this.stop();return}
   let at=clock.start+clock.next*clock.period;
   // Do not emit a burst of old clicks after the browser was suspended.
   if(at<now-.025){clock.next=Math.max(clock.next,Math.ceil((now+.01-clock.start)/clock.period));at=clock.start+clock.next*clock.period}
   while(at<=now+.25+1e-7){this.pulse(clock.next,at,clock.config);clock.next++;at=clock.start+clock.next*clock.period}
  }
  frame(){
   const c=this.clock;if(!c)return null;const elapsed=this.player.context.currentTime-c.start;if(elapsed<0)return {waiting:true,beats:c.config.beatsPerBar,bpm:c.config.bpm};const n=Math.floor((elapsed+1e-7)/c.period),counting=c.kind==='music'&&n<c.count;if(c.kind==='music'&&!counting&&!c.continuous)return null;
   return {counting,beat:n%c.config.beatsPerBar,beats:c.config.beatsPerBar,bar:Math.floor(n/c.config.beatsPerBar)+1,bars:c.config.countInBars,bpm:c.config.bpm,flash:elapsed-n*c.period<Math.min(.16,c.period*.65)}
  }
 }
 root.StageClick={VERSION:'26.32',settings,config,Engine};
})(typeof window!=='undefined'?window:globalThis);


// stage-mixer-settings.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function signature(tracks,buses,names){return JSON.stringify([tracks.map(t=>[t.id,t.assetId,t.name,t.color||null,t.bus||0,t.stereo,t.followTranspose,t.output,t.muteGroups]),buses.map(b=>[b.id,b.name,b.color||null,b.stereo,b.output]),names])}
 function mount(o){
  const $=id=>document.getElementById(id),expandedGroups=new Set();let draft=null,tab='tracks',dirty=false;
  function routeLabel(b){return b.id+' · '+b.name+' → USB '+b.output+(b.stereo?'–'+(b.output+1):'')}
  function outputs(route){const limit=32-(route.stereo?1:0);return Array.from({length:limit},(_,i)=>'<option value="'+(i+1)+'"'+(route.output===i+1?' selected':'')+'>'+(i+1)+(route.stereo?'–'+(i+2):'')+'</option>').join('')+(route.output>limit?'<option selected value="'+route.output+'">'+route.output+' · outside the 32-channel range</option>':'')}
  function format(route,field){return '<select '+field+' aria-label="Mono or stereo"><option value="true"'+(route.stereo?' selected':'')+'>Stereo</option><option value="false"'+(!route.stereo?' selected':'')+'>Mono</option></select>'}
  function groupChecks(track){return draft.names.map((name,i)=>'<label class="setup-group-check"><input type="checkbox" data-setup-track-group="'+(i+1)+'"'+(track.muteGroups.includes(i+1)?' checked':'')+'><span>'+esc(name)+'</span></label>').join('')}
  function refreshGroupButtons(){
   if(!draft||tab!=='tracks')return;
   $('mixerSetupBody').querySelectorAll('[data-setup-groups-toggle]').forEach(button=>{
    const track=draft.tracks.find(t=>t.id===button.dataset.setupGroupsToggle),expanded=expandedGroups.has(track.id);
    button.textContent=(expanded?'HIDE MUTE GROUPS':'MUTE GROUPS')+(track.muteGroups.length?' · '+track.muteGroups.length:'');
    button.setAttribute('aria-expanded',String(expanded));
    $(button.getAttribute('aria-controls')).classList.toggle('hidden',!expanded);
   });
  }
  function render(){
   if(!draft)return;
   const panel=$('mixerSetupBody');$('mixerSetupBody').classList.toggle('hidden',tab==='audio');$('mixerSetupAudio').classList.toggle('hidden',tab!=='audio');
   $('mixerSetupSong').textContent=draft.song?.title||'No song selected';
   $('mixerSetupTabs').querySelectorAll('[data-setup-tab]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.setupTab===tab)));
   if(tab==='tracks'){
    $('mixerSetupHelp').textContent='Changes save automatically on this device. Choose playback format, bus and mute groups for this song. Mono reduces audio memory; Stereo preserves left and right. Format/key changes prepare the audio again. Turn off Follow song key to keep a drum or click track at its original pitch.';
    panel.innerHTML=draft.tracks.length?'<div class="setup-track-heading"><span>Track name / color</span><span>Output bus and format</span></div>'+draft.tracks.map((t,i)=>{
     const tint=o.trackColor(t,i,draft.buses);
     return '<section class="setup-track-row" data-setup-track="'+esc(t.id)+'" style="--channel-color:'+tint+'"><div class="setup-identity"><span class="setup-index">'+String(i+1).padStart(2,'0')+'</span><label class="setup-name">Track name<input type="text" data-setup-field="name" maxlength="160" value="'+esc(t.name)+'"></label><label class="setup-color">Color<input type="color" data-setup-field="color" value="'+tint+'" aria-label="Track color '+esc(t.name)+'"></label><button type="button" data-setup-auto-color title="Use the bus color">AUTO</button><small>'+esc(t.fileName||t.name)+'</small><button type="button" class="setup-groups-toggle" data-setup-groups-toggle="'+esc(t.id)+'" aria-expanded="false" aria-controls="setupTrackGroups'+i+'">MUTE GROUPS</button></div><div class="setup-routing"><label>Output bus<select data-setup-field="bus"><option value="0"'+(!t.bus?' selected':'')+'>Direct USB</option>'+draft.buses.map(b=>'<option value="'+b.id+'"'+(t.bus===b.id?' selected':'')+'>'+esc(routeLabel(b))+'</option>').join('')+'</select></label><div><label>Playback format'+format(t,'data-setup-field="stereo"')+'</label>'+(t.bus?'':'<label>USB output<select data-setup-field="output">'+outputs(t)+'</select></label>')+'</div><label class="setup-group-check"><input type="checkbox" data-setup-field="followTranspose"'+(t.followTranspose?' checked':'')+'>Follow song key</label></div><fieldset class="setup-memberships hidden" id="setupTrackGroups'+i+'" aria-label="Mute groups for '+esc(t.name)+'"><legend>Mute groups</legend>'+groupChecks(t)+'</fieldset></section>'
    }).join(''):'<p class="setup-empty">No audio tracks in this song. Open AUDIO & FILES to add tracks.</p>'
   }else if(tab==='buses'){
    $('mixerSetupHelp').textContent='Buses are shared by all songs. Bus names, colors and USB outputs apply throughout the app. Tracks with AUTO color follow their bus color.';
    panel.innerHTML=draft.buses.map(b=>{
     const tint=o.busColor(b),members=draft.tracks.filter(t=>t.bus===b.id),others=o.state().songs.filter(s=>s!==draft.song).flatMap(s=>root.StageProject.tracks(s)).filter(t=>t.bus===b.id).length;
     return '<section class="setup-bus-row" data-setup-bus="'+b.id+'" style="--channel-color:'+tint+'"><div class="setup-identity"><span class="setup-index">B'+String(b.id).padStart(2,'0')+'</span><label class="setup-name">Bus name<input type="text" data-setup-bus-field="name" maxlength="24" value="'+esc(b.name)+'"></label><label class="setup-color">Color<input type="color" data-setup-bus-field="color" value="'+tint+'" aria-label="Bus color '+esc(b.name)+'"></label><button type="button" data-setup-auto-color>AUTO</button></div><div class="setup-routing"><div><label>Format'+format(b,'data-setup-bus-field="stereo"')+'</label><label>USB output<select data-setup-bus-field="output">'+outputs(b)+'</select></label></div><p>This song: '+(members.length?members.map(t=>esc(t.name)).join(', '):'No tracks')+'</p><small>'+others+' tracks from other songs use this bus.</small></div></section>'
    }).join('')
   }else if(tab==='groups'){
    $('mixerSetupHelp').textContent='Name the six groups and choose which tracks they mute together. Names apply to all songs; track assignments apply to this song.';
    panel.innerHTML='<div class="setup-group-grid">'+draft.names.map((name,i)=>'<section class="setup-group-card" data-setup-group="'+(i+1)+'"><label class="setup-name">Mute group '+(i+1)+'<input type="text" data-setup-group-name="'+i+'" maxlength="24" value="'+esc(name)+'"></label><div>'+draft.tracks.map((t,n)=>'<label class="setup-member"><input type="checkbox" data-setup-member="'+esc(t.id)+'"'+(t.muteGroups.includes(i+1)?' checked':'')+'><span class="setup-color-dot" style="background:'+o.trackColor(t,n,draft.buses)+'"></span><span>'+esc(t.name)+'</span></label>').join('')+'</div></section>').join('')+'</div>'
   }
   if(tab==='audio'){$('mixerSetupHelp').textContent='Names save automatically. Replace missing or updated audio here; track settings stay in place. Projects and output options are in the main Settings.';panel.innerHTML='';o.drawFiles(draft.tracks)}
   // Explicit values also keep selection predictable after a draft changes format.
   panel.querySelectorAll('select[data-setup-field]').forEach(el=>{const t=draft.tracks.find(t=>t.id===el.closest('[data-setup-track]').dataset.setupTrack);el.value=String(el.dataset.setupField==='bus'?(t.bus||0):t[el.dataset.setupField])});
   panel.querySelectorAll('select[data-setup-bus-field]').forEach(el=>{const b=draft.buses.find(b=>b.id===Number(el.closest('[data-setup-bus]').dataset.setupBus));el.value=String(b[el.dataset.setupBusField])});
   panel.querySelectorAll('input,select').forEach(el=>{el.dataset.renderValue=el.value;el.dataset.renderChecked=String(el.checked===true)});
  }
  function snapshot(){const tracks=o.tracks(),buses=o.buses(),names=root.StageProject.groupNames(o.state());return {song:o.song(),state:o.state(),tracks,buses,names,base:tracks.map(t=>[t.id,t.assetId]),signature:signature(tracks,buses,names)}}
  function stale(){return draft&&(draft.song!==o.song()||draft.state!==o.state()||draft.signature!==signature(o.tracks(),o.buses(),root.StageProject.groupNames(o.state())))}
  function locked(){return o.busy()||o.player.playing||o.player.click?.running||!!o.player.seekResume||stale()}
  function refresh(){
   if(!draft)return;
   if(!dirty&&stale()){draft=snapshot();render()}
   const blocked=!!locked(),explanation=stale()?'The song or tracks changed. Reopen Mixer Settings.':o.busy()?'Wait for audio preparation to finish.':blocked?'Stop playback to edit names, colors and routing.':'';
   $('mixerSetupLock').textContent=explanation;$('mixerSetupLock').classList.toggle('hidden',!explanation);
   $('mixerSetupBody').querySelectorAll('input,select,button').forEach(el=>el.disabled=blocked&&!el.hasAttribute('data-setup-groups-toggle'));$('mixerSongFiles').querySelectorAll('[data-file-alias],[data-file-delete],[data-file-replace]').forEach(el=>el.disabled=blocked);$('mixerSetupSave').disabled=blocked||!draft.song;
   $('mixerSetupSave').textContent=tab==='audio'?'SAVE NAMES':'SAVE MIXER SETTINGS';
   $('mixerSetupCancel').textContent='BACK TO MIXER';refreshGroupButtons()
  }
  function watchDraft(){return root.StageLive.drafts?.open('mixer',draft.signature,()=>{capture();return {tracks:draft.tracks,buses:draft.buses,names:draft.names}},value=>{if(!Array.isArray(value.tracks)||value.tracks.length!==draft.tracks.length||value.tracks.some((t,i)=>t.id!==draft.tracks[i].id||t.assetId!==draft.tracks[i].assetId))throw Error('Stale draft');value.tracks.forEach(root.StageProject.track);value.buses.forEach(root.StageProject.bus);root.StageProject.groupNames({opts:{muteGroupNames:value.names}});draft={...draft,...value};dirty=true;render();refresh()},()=>!!draft&&!$('mixerSetupDialog').classList.contains('hidden'))}
  function open(target){
   if(draft){capture();tab=target?.tab||(target?.busId?'buses':'tracks');render();refresh();return true}
   const trackId=typeof target==='string'?target:target?.trackId,busId=target?.busId;
   expandedGroups.clear();draft=snapshot();dirty=false;tab=target?.tab||(busId?'buses':draft.song?'tracks':'audio');$('mixerSetupStatus').textContent='';render();
   $('mixerMain').classList.add('hidden');$('mixerSetupDialog').classList.remove('hidden');$('mixerDialog').classList.add('mixer-config-open');$('mixerSettingsBtn').setAttribute('aria-pressed','true');for(const id of ['mixerTrackTab','mixerBusTab','mixerGroupTab','tempoToggle'])$(id).setAttribute('aria-pressed','false');refresh();
   const recovered=watchDraft();if(recovered)$('mixerSetupStatus').textContent='Recovered editor draft. Review and press SAVE to apply.';
   if(trackId||busId){const row=[...$('mixerSetupBody').querySelectorAll(trackId?'[data-setup-track]':'[data-setup-bus]')].find(el=>trackId?el.dataset.setupTrack===trackId:Number(el.dataset.setupBus)===busId);row?.scrollIntoView({block:'nearest'});if(!locked())row?.querySelector('input[type="text"]')?.focus()}
   return true
  }
  function close(){const recover=!!(draft&&dirty&&stale());if(recover)root.StageLive.drafts?.capture('mixer');else if(draft&&!flush())return false;const wasOpen=!!draft;if(draft&&!recover)root.StageLive.drafts?.clear('mixer');draft=null;dirty=false;$('mixerSetupBody').innerHTML='';$('mixerSetupDialog').classList.add('hidden');$('mixerMain').classList.remove('hidden');$('mixerDialog').classList.remove('mixer-config-open');$('mixerSettingsBtn').setAttribute('aria-pressed','false');if(wasOpen)o.closed?.();return true}
  function write(el){
   if(!draft)return;const field=el.dataset.setupField,busField=el.dataset.setupBusField;
   if(el.dataset.fileAlias){const t=draft.tracks.find(t=>t.id===el.dataset.fileAlias);if(t)t.name=el.value.slice(0,160)}
   else if(field){const t=draft.tracks.find(t=>t.id===el.closest('[data-setup-track]').dataset.setupTrack);if(field==='bus'){if(Number(el.value))t.bus=Number(el.value);else delete t.bus}else t[field]=field==='followTranspose'?el.checked:field==='stereo'?el.value==='true':field==='output'?Number(el.value):field==='color'?root.StageProject.color(el.value):el.value}
   else if(busField){const b=draft.buses.find(b=>b.id===Number(el.closest('[data-setup-bus]').dataset.setupBus));b[busField]=busField==='stereo'?el.value==='true':busField==='output'?Number(el.value):busField==='color'?root.StageProject.color(el.value):el.value}
   else if(el.dataset.setupTrackGroup){const t=draft.tracks.find(t=>t.id===el.closest('[data-setup-track]').dataset.setupTrack),g=Number(el.dataset.setupTrackGroup),groups=new Set(t.muteGroups);el.checked?groups.add(g):groups.delete(g);t.muteGroups=[...groups].sort((a,b)=>a-b)}
   else if(el.dataset.setupMember){const t=draft.tracks.find(t=>t.id===el.dataset.setupMember),g=Number(el.closest('[data-setup-group]').dataset.setupGroup),groups=new Set(t.muteGroups);el.checked?groups.add(g):groups.delete(g);t.muteGroups=[...groups].sort((a,b)=>a-b)}
   else if(el.hasAttribute('data-setup-group-name'))draft.names[Number(el.dataset.setupGroupName)]=el.value;
  }
  function capture(){if(!draft||locked())return;const before=JSON.stringify([draft.tracks,draft.buses,draft.names]),inputs=tab==='audio'?$('mixerSongFiles').querySelectorAll('[data-file-alias]'):$('mixerSetupBody').querySelectorAll('input,select');inputs.forEach(el=>{if(el.getAttribute('type')==='checkbox'?String(el.checked)!==el.dataset.renderChecked:el.value!==el.dataset.renderValue)write(el)});if(JSON.stringify([draft.tracks,draft.buses,draft.names])!==before)dirty=true}
  function flush(){
   if(!draft)return true;
   try{capture();if(!dirty)return true;if(locked())throw Error('Stop playback and reopen the settings before saving changes.');o.apply(draft,{quiet:true});draft=snapshot();dirty=false;root.StageLive.drafts?.clear('mixer');$('mixerSetupBody').querySelectorAll('input,select').forEach(el=>{el.dataset.renderValue=el.value;el.dataset.renderChecked=String(el.checked===true)});$('mixerSongFiles').querySelectorAll('[data-file-alias]').forEach(el=>el.dataset.renderValue=el.value);watchDraft();$('mixerSetupStatus').textContent='Saved on this device.';refresh();return true}catch(error){$('mixerSetupStatus').textContent=error.message;o.message(error.message,true);return false}
  }
  function change(e){
   if(!draft||locked())return;
   try{capture();write(e.target);dirty=true;const field=e.target.dataset.setupField||e.target.dataset.setupBusField;if(!flush()){root.StageLive.drafts?.capture('mixer');return}if(['bus','stereo'].includes(field))render();else if(field==='color')e.target.closest('[data-setup-track],[data-setup-bus]').style.setProperty('--channel-color',e.target.value);refresh()}catch(error){$('mixerSetupStatus').textContent=error.message}
  }
  $('mixerSetupBody').addEventListener('input',e=>{if(e.target.tagName==='INPUT'&&e.target.getAttribute('type')!=='checkbox')change(e)});
  $('mixerSetupBody').addEventListener('change',change);
  $('mixerSongFiles').addEventListener('input',change);$('mixerSongFiles').addEventListener('change',change);
  $('mixerSetupBody').addEventListener('click',e=>{const toggle=e.target.closest('[data-setup-groups-toggle]');if(toggle&&draft){const id=toggle.dataset.setupGroupsToggle;expandedGroups.has(id)?expandedGroups.delete(id):expandedGroups.add(id);refreshGroupButtons();return}const button=e.target.closest('[data-setup-auto-color]');if(!button||!draft||locked())return;capture();const tr=button.closest('[data-setup-track]'),br=button.closest('[data-setup-bus]');if(tr)delete draft.tracks.find(t=>t.id===tr.dataset.setupTrack).color;else if(br)delete draft.buses.find(b=>b.id===Number(br.dataset.setupBus)).color;dirty=true;if(flush()){render();refresh()}});
  $('mixerSetupTabs').addEventListener('click',e=>{const button=e.target.closest('[data-setup-tab]');if(button&&draft){capture();tab=button.dataset.setupTab;render();refresh()}});
  $('mixerSetupSave').onclick=()=>{if(!draft)return;try{if(flush())close()}catch(error){$('mixerSetupStatus').textContent=error.message}};
  $('mixerSetupClose').onclick=$('mixerSetupCancel').onclick=close;
  return {open,close,refresh,flush,fileTracks:()=>draft?.tracks,isOpen:()=>!!draft}
 }
 root.StageMixerSettings={VERSION:'26.32',mount,signature};
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
 root.StageFaderGestures={VERSION:'26.32',mount};
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
  $('masterFaderMount').innerHTML=faderMarkup({gain:1,field:'id="masterGain"',meter:'id="masterMeter"',label:'Song volume for all tracks'});
  $('globalMasterFaderMount').innerHTML=faderMarkup({gain:1,field:'id="globalMasterGain"',meter:'id="globalMasterMeter"',label:'Master volume for all songs'});
  let generation=0,loading=false,importing=false,prepared=null,pendingLoad=null,view=['tracks','buses','groups','tempo'].includes(o.state().opts.mixerView)?o.state().opts.mixerView:'tracks',showAllBuses=o.state().opts.busShowAll===true,heldPeak=0,heldSongPeak=0,setup=null,gestures=null;const absentLegacy=new WeakSet(),fileInfo=new Map();
  const gate=root.StageLive.doubleTap({options:()=>o.state().opts});
  const player=new root.StageAudio.BrowserPlayer({mode:o.state().opts.audioOutputMode,notify:state=>{if(state.error)message(state.error,true);else if(state.message)message(state.message);o.transport?.(state);updateTransport()}});
  const click=new root.StageClick.Engine(player,{notify:text=>{clickError=text;message(text,true)}});player.click=click;let clickSong=null,clickKey='',clickError='',clickBusesKey='',lightBeats=0;
  function message(text,error=false){$('mixerStatus').textContent=text;$('mixerStatus').dataset.error=String(error);for(const id of ['projectStatus','outputStatus'])$(id).textContent=text;$('mixerQuickStatus').textContent=error?text:'';$('mixerQuickStatus').classList.toggle('hidden',!error)}
  function getTracks(){const song=o.song();return song&&!song.playback?.tracks&&absentLegacy.has(song)?[]:root.StageProject.tracks(song)}
  function getBuses(){return root.StageProject.buses(o.state())}
  function groupState(){return {names:root.StageProject.groupNames(o.state()),active:Array.from({length:6},(_,i)=>!!player.muteGroups?.has(i+1))}}
  function drawGroups(){const state=groupState();$('mixerGroups').innerHTML='<span>MUTE GROUPS</span>'+state.names.map((name,i)=>'<button type="button" data-global-group="'+(i+1)+'" aria-pressed="'+state.active[i]+'">'+(i+1)+' · '+esc(name)+'</button>').join('');$('mixerTracks').querySelectorAll('[data-track]').forEach(strip=>{const t=getTracks()[Number(strip.dataset.track)],button=strip.querySelector('[data-toggle="mute"]'),group=t&&player.groupMuted(t);if(button){button.textContent=group?'GROUP':'MUTE';button.setAttribute('aria-pressed',String(!!t.mute||group));button.classList.toggle('mute-on',!!t.mute||group)}});$('mixerGroupMembers').innerHTML=state.names.map((name,i)=>'<article><b>'+esc(name)+'</b><p>'+esc(getTracks().filter(t=>(t.muteGroups||[]).includes(i+1)).map(t=>t.name).join(' · ')||'No tracks assigned')+'</p></article>').join('');$('mixerMasterMute').textContent=player.masterMuted?'UNMUTE':'MUTE';$('mixerMasterMute').setAttribute('aria-pressed',String(!!player.masterMuted))}
  const fileSize=bytes=>bytes==null?'—':bytes<1000?bytes+' B':bytes<1000000?(bytes/1000).toFixed(1)+' kB':(bytes/1000000).toFixed(1)+' MB';
  const fileTime=seconds=>{const n=Math.max(0,Math.round(seconds||0));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
  function drawFiles(selected){
   for(const [id,info] of player.info)fileInfo.set(id,{...info});
   const tracks=selected||setup?.fileTracks()||getTracks(),buses=getBuses(),unique=new Map(tracks.map(t=>[t.assetId,t.fileBytes??fileInfo.get(t.assetId)?.bytes]));
   $('mixerFilesSummary').textContent=tracks.length+' tracks · '+unique.size+' audio files'+([...unique.values()].every(n=>Number.isFinite(n))&&unique.size?' · '+fileSize([...unique.values()].reduce((a,b)=>a+b,0)):'');
   $('mixerSongFiles').innerHTML=tracks.length?tracks.map((t,i)=>{const file=player.info.get(t.assetId)||fileInfo.get(t.assetId),original=t.fileName||file?.name||'Original filename unavailable',bytes=t.fileBytes??file?.bytes,format=(original.match(/\.([a-z0-9]+)$/i)?.[1]||'AUDIO FILE').toUpperCase(),route=t.bus?buses[t.bus-1]:t,tint=trackColor(t,i,buses),details=[format,file?.channels?(file.channels===1?'Mono':'Stereo'):'',file?.duration?fileTime(file.duration):'',fileSize(bytes)].filter(Boolean).join(' · ');
    return '<article class="song-file-card" data-file-track="'+esc(t.id)+'" style="--channel-color:'+tint+'"><span class="song-file-number">'+String(i+1).padStart(2,'0')+'</span><div class="song-file-identity"><label>App name<input type="text" data-file-alias="'+esc(t.id)+'" maxlength="160" value="'+esc(t.name)+'" aria-label="Audio track name '+(i+1)+'"></label><small class="song-file-original">Original file: '+esc(original)+'</small></div><div class="song-file-info"><span>'+esc(details)+'</span><small>Playback: '+(t.stereo?'Stereo':'Mono')+' · '+(t.bus?esc(route.name)+' · ':'')+'USB '+route.output+(route.stereo?'–'+(route.output+1):'')+'</small><button type="button" data-file-replace="'+esc(t.id)+'" aria-label="Replace audio for '+esc(t.name)+'"'+(loading||importing||player.playing||click.running||player.seekResume?' disabled':'')+'>REPLACE FILE</button><button type="button" data-file-delete="'+esc(t.id)+'" aria-label="Delete '+esc(t.name)+'"'+(loading||importing||player.playing||click.running||player.seekResume?' disabled':'')+'>DELETE</button></div></article>'
   }).join(''):'<p class="song-files-empty">No audio files yet. Choose + AUDIO FILES to add tracks for this song.</p>';
   $('mixerSongFiles').querySelectorAll('[data-file-alias]').forEach(input=>{input.dataset.renderValue=input.value;input.disabled=loading||importing||player.playing||click.running||!!player.seekResume})
  }
  function toggleGroup(id){if(!Number.isInteger(id)||id<1||id>6)return;const active=new Set(player.muteGroups||[]),opts=o.state().opts,previous=opts.mutedGroups;active.has(id)?active.delete(id):active.add(id);opts.mutedGroups=[...active].sort((a,b)=>a-b);if(o.save()===false){opts.mutedGroups=previous;message('Mute groups could not be saved.',true);return false}player.setMuteGroups(active);drawGroups();updateTransport();return true}
  function toggleMasterMute(){const opts=o.state().opts,previous=opts.masterMuted;opts.masterMuted=!player.masterMuted;if(o.save()===false){opts.masterMuted=previous;message('Master mute could not be saved.',true);return false}player.setMasterMuted(opts.masterMuted);drawGroups();updateTransport();return true}
  async function seek(seconds,resume){o.manualTransport?.();gate.clear();if(loading||importing||!player.duration)return false;const mine=generation;try{const moved=await player.seek(seconds,resume,{onScheduled:when=>click.beginMusic(root.StageClick.config(o.song()),when,0,player.startOffset)});if(moved&&mine===generation)o.seek?.(player.currentTime,player.duration);updateTransport();return moved}catch(error){message(error.message,true);updateTransport();return false}}
  function commitBuses(buses){const previous=o.state().opts.audioBuses;o.state().opts.audioBuses=buses.map(root.StageProject.bus);if(o.save()===false){o.state().opts.audioBuses=previous;throw Error('Output buses could not be saved.')}invalidateProject();player.setBuses(getBuses())}
  const gainText=gain=>gain>0?(20*Math.log10(gain)).toFixed(1)+' dB':'−∞ dB';
  function outputOptions(route){const limit=Math.max(0,(player.channels||32)-(route.stereo?1:0));return Array.from({length:limit},(_,n)=>'<option value="'+(n+1)+'"'+(route.output===n+1?' selected':'')+'>'+(n+1)+(route.stereo?'–'+(n+2):'')+'</option>').join('')+(route.output>limit?'<option value="'+route.output+'" selected>'+route.output+' · unavailable</option>':'')}
  function drawBuses(){
   const tracks=getTracks(),used=new Set(tracks.map(t=>t.bus).filter(Boolean)),cfg=root.StageClick.config(o.song());if(click.running||cfg.countInBars||cfg.continuous)used.add(cfg.bus);const busy=loading||importing,locked=busy||player.playing||click.running;
   $('mixerBuses').innerHTML=getBuses().filter(b=>showAllBuses||used.has(b.id)||(!used.size&&b.id<=2)).map(b=>{
    const members=tracks.filter(t=>t.bus===b.id),color=busColor(b);
    return '<section class="stem-strip bus-strip" data-bus="'+b.id+'" style="--channel-color:'+color+';--channel-ink:'+ink(color)+'"><div class="strip-header"><span>BUS '+String(b.id).padStart(2,'0')+'</span><span class="strip-kind">'+(b.stereo?'ST':'M')+'</span></div><button type="button" class="route-badge" data-edit-bus="'+b.id+'"'+(locked?' disabled':'')+' title="Edit bus settings">USB '+b.output+(b.stereo?'–'+(b.output+1):'')+' · ⚙</button><small class="stem-file" title="'+esc(members.map(t=>t.name).join(', '))+'">'+(members.length?members.length+' tracks connected':'No tracks connected')+'</small><div class="stem-switches"><button data-bus-mute aria-pressed="'+b.mute+'" class="'+(b.mute?'mute-on':'')+'"'+(busy?' disabled':'')+'>MUTE</button><button data-bus-reset'+(busy?' disabled':'')+'>0 dB</button></div><div class="fader-value"><output data-bus-gain="'+b.id+'">'+gainText(b.gain)+'</output></div>'+faderMarkup({gain:b.gain,field:'data-bus-field="gain"',meter:'data-bus-meter="'+b.id+'"',label:'Bus volume '+b.name,disabled:busy})+'<div class="level-readout"><span>PEAK</span><output data-bus-peak="'+b.id+'">−∞ dBFS</output></div><div class="bus-members" title="'+esc(members.map(t=>t.name).join(', '))+'">'+(members.length?members.map(t=>esc(t.name)).join(' · '):'No tracks')+'</div><button type="button" class="channel-setup" data-edit-bus="'+b.id+'"'+(locked?' disabled':'')+'>⚙ BUS SETTINGS</button><label class="channel-label"><span>BUS NAME</span><input data-bus-field="name" value="'+esc(b.name)+'" maxlength="24" aria-label="Bus name"'+(busy?' disabled':'')+'></label></section>'
   }).join('')
  }
  function invalidateProject(){prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true}
  function commit(tracks,song=o.song()){
   if(!song)return;const previous=song.playback;song.playback={...previous,tracks:tracks.map(root.StageProject.track)};
   if(o.save()===false){song.playback=previous;throw Error('Mixer settings could not be saved. No audio tracks have been replaced.')}
   invalidateProject();if(song===o.song())player.update(song.playback.tracks)
  }
  function readiness(){
   const tracks=getTracks();if(transposeError)return {ready:tracks.length>0&&!loading&&!importing&&player.buffers.length===tracks.length&&!player.routeError(),show:true,error:true,text:transposeError,action:'transposeSettings'};const prompt=gate.current();if(clickError)return {ready:tracks.length>0&&!loading&&!importing&&player.buffers.length===tracks.length&&!player.routeError(),show:true,error:true,text:clickError,action:'metronomeSettings'};if(!tracks.length&&click.running&&prompt)return {ready:false,show:true,text:'Tap STOP again to confirm.'};
   if(!tracks.length)return {ready:false,show:false,text:'Add audio files to this song.',action:'files'};
   if(importing)return {ready:false,show:true,text:'Copying audio files to this device…'};
   if(loading||player.preparing)return {ready:false,show:true,text:player.preparationMessage||'Preparing audio…',action:'cancelPrepare'};
   if(player.loadError)return {ready:false,show:true,error:true,text:'Audio not ready: '+player.loadError,action:player.retryableError?'prepare':root.StageTranspose.config(o.song())?'transposeSettings':'files'};
   if(player.buffers.length!==tracks.length||!player.duration)return {ready:false,show:true,text:'Audio is not prepared. Choose PREPARE AUDIO.',action:'prepare'};
   const cfg=root.StageClick.config(o.song()),atStart=player.position<=.001||player.position>=player.duration,error=player.routeError();if(error)return {ready:false,show:true,error:true,text:error,action:'files'};
   if(cfg.continuous||cfg.countInBars&&cfg.countInSound&&atStart){const error=click.error(cfg);if(error)return {ready:false,show:true,error:true,text:error,action:'metronomeSettings'}}
   const pending=gate.current();return {ready:true,show:!!pending,text:pending?'Tap '+(pending.action==='play'?'PLAY':pending.action==='pause'?'PAUSE':'STOP')+' again to confirm.':''}
  }
  function updateTransport(){
   drawTempo();drawClick();drawOutputMode();
   const tracks=getTracks(),status=readiness(),ready=status.ready;
   $('audioPlay').disabled=!ready;$('audioPlay').title=ready?'Play or pause audio':status.text;$('newTrackFormat').value=o.state().opts.newTrackFormat==='stereo'?'stereo':'mono';$('newTrackFormat').disabled=loading||importing||player.playing||click.running;$('audioStop').disabled=!tracks.length&&!click.running;
   $('audioPlay').setAttribute('aria-pressed',String(player.playing||!!player.seekResume));
   for(const id of ['stemAdd','prepareAudio','outputMode','refreshOutputs','projectImport','projectDemo'])$(id).disabled=loading||importing||player.playing||click.running;
   $('stemAdd').disabled=loading||importing||player.playing||click.running||!o.song();
   if($('routeDirect'))$('routeDirect').disabled=loading||importing||player.playing||click.running;
   $('audioName').textContent=tracks.length?tracks.length+' audio tracks':'No audio file';$('prepareAudio').classList.toggle('hidden',!tracks.length||player.buffers.length===tracks.length||loading||importing);setup?.refresh();for(const listener of listeners)listener()
  }
  function drawMemory(){
   const bytes=player.requiredBytes||player.decodedBytes||0,limit=root.StageAudio.MAX_DECODED,over=bytes>limit;
   $('mixerMemoryText').textContent=(over?'At least ':'')+(bytes/1048576).toFixed(1)+' / '+(limit/1048576)+' MiB working memory';$('mixerMemory').dataset.over=String(over);$('mixerMemoryFill').style.width=Math.min(100,bytes/limit*100)+'%';$('mixerMemory').setAttribute('aria-valuenow',String(Math.min(limit/1048576,bytes/1048576)));$('mixerMemoryHelp').textContent=over?'Too much decoded audio. Your files are kept. Remove tracks or use shorter or mono files. MP3 alone does not reduce this memory requirement.':'MP3 saves storage space. Working memory depends on duration, sample rate and channel count.'
  }
  let tempoSong=null,tempoKey='',tempoDirty=false,tempoTargetEdited=false,tempoDetecting=false,tempoDetectSerial=0,tempoEstimate=null;
  function tempoBase(){const value=Number($('tempoOriginal').value);return Number.isFinite(value)&&value>=20&&value<=300?value:null}
  function drawTempo(){
   drawTranspose();
   const song=o.song(),config=root.StageTempo.config(song),metadata=root.StageTempo.metadata(song),key=JSON.stringify([config,metadata]);
   if(tempoSong!==song||tempoKey!==key){tempoSong=song;tempoKey=key;tempoDirty=false;tempoTargetEdited=false;tempoEstimate=null;tempoDetectSerial++;tempoDetecting=false;$('tempoOriginal').value=config?.originalBpm??metadata??'';$('tempoTarget').value=config?.targetBpm??metadata??'';$('tempoDetectResult').textContent='';$('tempoStatus').textContent='';$('tempoEstimateActions').classList.add('hidden');if(!config&&!metadata)$('tempoSource').setAttribute('open','');else $('tempoSource').removeAttribute('open');const scope=JSON.stringify([song?.title,song?.text,config,metadata]);if(root.StageLive.drafts?.open('tempo',scope,()=>({original:$('tempoOriginal').value,target:$('tempoTarget').value}),value=>{if(typeof value.original!=='string'||typeof value.target!=='string')throw Error('Invalid draft');$('tempoOriginal').value=value.original;$('tempoTarget').value=value.target;tempoDirty=tempoTargetEdited=true;$('tempoStatus').textContent='Recovered BPM draft. Press APPLY to save and prepare.'},()=>tempoSong===o.song()&&!$('tempoPanel').classList.contains('hidden')))tempoDirty=true;}
   const locked=loading||importing||player.playing||click.running||!!player.seekResume||tempoDetecting,base=tempoBase(),target=Number($('tempoTarget').value),limits=base?root.StageTempo.bpmLimits(base):{min:20,max:300};
   for(const id of ['tempoOriginal','tempoTarget','tempoApply','tempoReset','tempoHalf','tempoDouble','tempoUseEstimate'])$(id).disabled=locked||!song;
   $('tempoMinus').disabled=locked||!song||!base||(target>0&&target<=limits.min);$('tempoPlus').disabled=locked||!song||!base||target>=limits.max;
   $('tempoTarget').min=String(limits.min);$('tempoTarget').max=String(limits.max);$('tempoDetect').disabled=locked||!song||!player.buffers.length;$('tempoToggle').textContent='TEMPO';
   $('tempoSourceInfo').textContent=base?'Original: '+base+' BPM · playback '+(tempoDirty?'changes pending':config?.targetBpm||base)+' BPM':'Set or detect the original BPM below.';
  }
  let transposeSong=null,transposeKey=null,transposeJob=null,transposeError='';
  function drawTranspose(){
   const song=o.song(),value=root.StageTranspose.config(song);
   if(transposeSong!==song||transposeKey!==value){transposeSong=song;transposeKey=value;$('transposeValue').value=value;$('transposeStatus').textContent='';root.StageLive.drafts?.open('transpose',JSON.stringify([song?.title,song?.text,value]),()=>({value:$('transposeValue').value}),draft=>{root.StageTranspose.config({playback:{transpose:Number(draft.value)}});$('transposeValue').value=draft.value;$('transposeStatus').textContent='Recovered key change. Review and APPLY KEY.'},()=>transposeSong===o.song()&&!$('tempoPanel').classList.contains('hidden'))}
   const locked=loading||importing||player.playing||click.running||!!player.seekResume||tempoDetecting||transposeJob?.song===o.song(),pending=Number($('transposeValue').value);
   for(const id of ['transposeValue','transposeApply','transposeReset'])$(id).disabled=locked||!song;
   $('transposeMinus').disabled=locked||!song||pending<=-2;$('transposePlus').disabled=locked||!song||pending>=2;
   $('transposeInfo').textContent='Saved key change: '+(value>0?'+':'')+value+' semitones · '+getTracks().filter(t=>root.StageTranspose.follows(t)).length+' audio tracks follow this key'
  }
  function editTranspose(step=0){if(loading||importing||player.playing||click.running||player.seekResume||transposeJob?.song===o.song())return;const value=Number($('transposeValue').value);if(step)$('transposeValue').value=String(Math.max(-2,Math.min(2,(Number.isFinite(value)?value:0)+step)));drawTranspose();root.StageLive.drafts?.capture('transpose')}
  async function applyTranspose(target=Number($('transposeValue').value)){
   const song=o.song();if(!song||loading||importing||player.playing||click.running||player.seekResume||tempoDetecting||transposeJob?.song===o.song()||setup?.flush()===false)return false;
   try{root.StageTranspose.config({playback:{transpose:target}})}catch(error){$('transposeStatus').textContent=error.message;return false}
   transposeError='';const job={song};transposeJob=job;o.manualTransport?.();drawTranspose();
   try{
    const ready=await load(undefined,target);if(song!==o.song()||transposeJob!==job)return false;if(!ready)throw Error(player.loadError||'Audio could not be prepared.');
    const previous=song.playback;song.playback={...previous,transpose:target};if(o.save()===false){song.playback=previous;throw Error('The key change could not be saved.')}
    root.StageLive.drafts?.clear('transpose');invalidateProject();transposeKey=null;o.transposeChanged?.();draw();$('transposeStatus').textContent=(target?'Key changed by '+(target>0?'+':'')+target+' semitones.':'Original key restored.')+' Tempo is unchanged.';return true
   }catch(error){
    if(song===o.song()&&transposeJob===job){await load();if(song===o.song()&&transposeJob===job){root.StageLive.drafts?.clear('transpose');transposeKey=null;drawTranspose();transposeError='Key change was not applied. '+error.message;$('transposeStatus').textContent=transposeError;message(transposeError,true);updateTransport()}}return false
   }finally{if(transposeJob===job)transposeJob=null;drawTranspose()}
  }
  function editTempo(targetEdited=false){tempoDirty=true;if(targetEdited)tempoTargetEdited=true;else if(!tempoTargetEdited)$('tempoTarget').value=$('tempoOriginal').value;drawTempo();root.StageLive.drafts?.capture('tempo')}
  function changeBpm(direction){if(loading||importing||player.playing||click.running||player.seekResume||tempoDetecting)return;const next=root.StageTempo.stepBpm($('tempoTarget').value,tempoBase(),direction);if(next===null)return;$('tempoTarget').value=String(next);editTempo(true);$('tempoStatus').textContent='Press APPLY to prepare and save this BPM.'}
  function estimateText(){const result=tempoEstimate;if(!result)return;$('tempoDetectResult').textContent='Estimated original: '+result.bpm+' BPM · '+result.name+(result.method==='click'?' · regular click':' · check the beat and half/double tempo');$('tempoEstimateActions').classList.remove('hidden');$('tempoHalf').disabled=result.bpm/2<20;$('tempoDouble').disabled=result.bpm*2>300}
  async function detectTempo(){
   const song=o.song();if(!song||loading||importing||player.playing||click.running||player.seekResume||tempoDetecting)return;const serial=++tempoDetectSerial,gen=player.generation,tracks=getTracks();tempoDetecting=true;tempoEstimate=null;$('tempoEstimateActions').classList.add('hidden');drawTempo();
   const cancelled=()=>serial!==tempoDetectSerial||song!==o.song()||gen!==player.generation||player.playing||click.running;
   try{
    const candidates=tracks.map((track,i)=>({track,buffer:player.buffers[i],click:/click|clix|klikk|metronom/i.test(track.name+' '+(track.fileName||''))})).filter(x=>x.buffer?.getChannelData&&x.buffer.sampleRate>0).sort((a,b)=>Number(b.click)-Number(a.click)||Number(/drum|tromm|perc/i.test(b.track.name))-Number(/drum|tromm|perc/i.test(a.track.name))||b.buffer.duration-a.buffer.duration);
    for(const item of candidates.slice(0,3)){
     $('tempoDetectResult').textContent='Analyzing '+item.track.name+'…';const result=await root.StageTempo.detect(item.buffer,{click:item.click,cancelled});if(cancelled())return;if(!result)continue;const bpm=Math.round(result.bpm/(player.tempoRatio||1)*10)/10;if(bpm<20||bpm>300)continue;tempoEstimate={...result,bpm,name:item.track.name};break
    }
    if(!cancelled()){if(tempoEstimate)estimateText();else $('tempoDetectResult').textContent='No clear beat found. Enter the original BPM manually, or add a click/drum track.'}
   }catch(error){if(!cancelled()&&error.name!=='AbortError')$('tempoDetectResult').textContent='BPM detection failed: '+error.message}
   finally{if(serial===tempoDetectSerial){tempoDetecting=false;drawTempo();if(tempoEstimate)estimateText()}}
  }
  function drawAppearance(){
   $('globalMasterStrip').classList.toggle('hidden',o.state().opts.masterHidden===true);$('masterVisible').checked=o.state().opts.masterHidden!==true;$('mixerDialog').classList.toggle('mixer-narrow',o.state().opts.mixerWidth==='narrow');$('mixerWidth').value=o.state().opts.mixerWidth==='narrow'?'narrow':'normal';
  }
  function draw(){
   drawAppearance();
   const song=o.song(),tracks=getTracks(),master=root.StageProject.masterGain(song),buses=getBuses(),busy=loading||importing,locked=busy||player.playing||click.running;player.setBuses(buses);
   const groupDock=$(view==='groups'?'mixerGroupDock':'mixerTrackGroups'),groupButtons=$('mixerGroups');if(groupButtons.parentNode!==groupDock){groupButtons.remove();groupDock.appendChild(groupButtons)}
   $('tempoPanel').classList.toggle('hidden',view!=='tempo');$('tempoToggle').setAttribute('aria-pressed',String(view==='tempo'));$('mixerTrackGroups').classList.toggle('hidden',view!=='tracks');
   $('mixerGroupView').classList.toggle('hidden',view!=='groups');$('mixerConsole').classList.toggle('hidden',!['tracks','buses'].includes(view));$('mixerGroupTab').setAttribute('aria-pressed',String(view==='groups'));$('mixerTracks').classList.toggle('hidden',view!=='tracks');$('mixerBuses').classList.toggle('hidden',view!=='buses');$('busViewOptions').classList.toggle('hidden',view!=='buses');$('mixerTrackTab').setAttribute('aria-pressed',String(view==='tracks'));$('mixerBusTab').setAttribute('aria-pressed',String(view==='buses'));$('busShowAll').checked=showAllBuses;
   $('mixerSong').textContent=song?.title||'Select a song';$('outputMode').value=player.mode;
   $('mixerOutputs').textContent=player.channels?(player.mode==='stereo'?'Stereo practice: all tracks, including the click, are mixed to outputs 1–2.':'Ui24R / USB · '+player.channels+' channels · '+Math.round(player.context.sampleRate)+' Hz'):'Connect the Ui24R and press READ OUTPUTS.';
   $('mixerEmpty').classList.toggle('hidden',!!tracks.length||view!=='tracks');
   const direct=tracks.filter(t=>!t.bus).length,used=new Set(tracks.map(t=>t.bus).filter(Boolean));$('routingSummary').textContent=tracks.length+' tracks · '+used.size+' buses'+(direct?' · '+direct+' tracks route directly to USB without a bus':'');$('routingSummary').dataset.direct=String(direct>0);$('routeDirect').classList.toggle('hidden',!direct);$('routeDirect').disabled=locked;
   const globalMaster=Math.max(0,Math.min(2,Number(o.state().opts.masterGain??1)));$('globalMasterGain').value=gainToFader(globalMaster);$('globalMasterGain').setAttribute('aria-valuetext',gainText(globalMaster));$('globalMasterGainText').textContent=gainText(globalMaster);$('globalMasterGain').disabled=$('globalMasterReset').disabled=busy;player.setGlobalMaster(globalMaster);
   drawTempo();
   $('masterGain').value=gainToFader(master);$('masterGain').setAttribute('aria-valuetext',gainText(master));$('masterGainText').textContent=gainText(master);$('masterGain').disabled=$('masterReset').disabled=!song||busy;
   $('mixerTracks').innerHTML=tracks.map((t,i)=>{
    const info=player.info.get(t.assetId),route=t.bus?buses[t.bus-1]:t,color=trackColor(t,i,buses),names=root.StageProject.groupNames(o.state()),groups=(t.muteGroups||[]).map(g=>names[g-1]).join(' · ');
    return '<section class="stem-strip" data-track="'+i+'" style="--channel-color:'+color+';--channel-ink:'+ink(color)+'"><div class="strip-header"><span>TRACKS '+String(i+1).padStart(2,'0')+'</span><button data-remove="'+i+'"'+(locked?' disabled':'')+' aria-label="Remove '+esc(t.name)+'">✕</button></div><button type="button" class="route-badge '+(!t.bus?'direct-route':'')+'" data-edit-track="'+esc(t.id)+'"'+(locked?' disabled':'')+' title="Edit bus and groups">'+(t.bus?'B'+String(t.bus).padStart(2,'0')+' '+esc(route.name):'DIRECT')+' · USB '+route.output+(route.stereo?'–'+(route.output+1):'')+'</button><small class="stem-file">'+(info?(t.stereo&&info.playbackChannels!==1?'STEREO PLAYBACK':'MONO PLAYBACK')+' · '+Math.round(info.duration)+' s · '+((info.decodedBytes||0)/1048576).toFixed(1)+' MiB':'Not prepared')+'</small><label class="stem-pan"><span>PAN</span><input type="range" data-field="pan" min="-1" max="1" step="0.01" value="'+t.pan+'"'+(busy||(!t.stereo&&!t.bus)?' disabled':'')+' aria-label="Pan '+esc(t.name)+'"><span>L / R</span></label><div class="stem-switches"><button data-toggle="mute"'+(busy?' disabled':'')+' aria-pressed="'+t.mute+'" class="'+(t.mute?'mute-on':'')+'">MUTE</button><button data-toggle="solo"'+(busy?' disabled':'')+' aria-pressed="'+t.solo+'" class="'+(t.solo?'solo-on':'')+'">SOLO</button></div><div class="fader-value"><output data-gain="'+i+'">'+gainText(t.gain)+'</output><button data-track-reset title="Reset to 0 dB"'+(busy?' disabled':'')+'>0</button></div>'+faderMarkup({gain:t.gain,field:'data-field="gain"',meter:'data-meter="'+i+'"',label:'Volume '+t.name,disabled:busy})+'<div class="level-readout"><span>PEAK</span><output data-peak="'+i+'">−∞ dBFS</output></div><button type="button" class="group-summary" data-edit-track="'+esc(t.id)+'" title="Mute groups: '+esc(groups||'None')+'"'+(locked?' disabled':'')+'><small>MUTE GROUPS</small><span>'+esc(groups||'No groups')+'</span></button><button type="button" class="channel-setup" data-edit-track="'+esc(t.id)+'"'+(locked?' disabled':'')+'>⚙ TRACK SETTINGS</button><label class="channel-label"><span>TRACK NAME</span><input data-field="name" value="'+esc(t.name)+'" aria-label="Track name"'+(busy?' disabled':'')+'></label></section>'
   }).join('');drawBuses();drawGroups();drawFiles();drawMemory();updateTransport()
  }
  function load(autoIds,transpose){return pendingLoad=loadAudio(autoIds,transpose)}
  async function loadAudio(autoIds=new Set(),transpose=root.StageTranspose.config(o.song())){
   transposeError='';view=['tracks','buses','groups','tempo'].includes(o.state().opts.mixerView)?o.state().opts.mixerView:'tracks';showAllBuses=o.state().opts.busShowAll===true;   clickError='';gate.clear();tempoDetectSerial++;tempoDetecting=false;tempoEstimate=null;$('tempoEstimateActions').classList.add('hidden');gestures?.clear();const mine=++generation,song=o.song();let tracks=getTracks();loading=true;heldPeak=heldSongPeak=0;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;draw();
   player.setMasterMuted(o.state().opts.masterMuted===true);player.setMuteGroups(new Set((Array.isArray(o.state().opts.mutedGroups)?o.state().opts.mutedGroups:[]).filter(g=>Number.isInteger(g)&&g>=1&&g<=6)));player.setMaster(root.StageProject.masterGain(song));message(tracks.length?'Preparing local audio files…':'Add backing, click or other audio stems.');
   try{
    if(song&&!song.playback?.tracks&&song.audioId){const legacy=await repo.get(song.audioId);if(mine!==generation||song!==o.song())return false;if(legacy?.data)absentLegacy.delete(song);else absentLegacy.add(song);tracks=getTracks()}
    const ready=await player.load(tracks,repo,root.StageTempo.ratio(song),transpose);if(mine!==generation||song!==o.song()||!ready)return false;
    for(let i=0;i<tracks.length;i++)if(autoIds.has(tracks[i].id)&&player.buffers[i]?.numberOfChannels===1)tracks[i].stereo=false;
    if(autoIds.size)commit(tracks,song);
    loading=false;if(tracks.length){o.ready?.(song);o.duration?.(player.sourceDuration)}
    const error=player.routeError();message(error||('Locally ready · '+tracks.length+' tracks'+(player.decodedBytes?' · '+Math.ceil(player.decodedBytes/1048576)+' MiB audio in memory':'')+(player.cacheHits?' · saved key loaded':'')+(player.cacheWarning?' · '+player.cacheWarning:'')),!!error);draw();return true
   }catch(error){if(mine===generation){loading=false;message(error.message,true);draw()}return false}
  }
  function cancel(){transposeJob=null;gate.clear();gestures?.clear();generation++;player.cancel();loading=false;prepared=null;$('projectShare').disabled=$('projectDownload').disabled=true;updateTransport()}
  async function removeFile(trackId){
   const song=o.song();if(!song||loading||importing||player.playing||click.running||player.seekResume)return;
   if(setup?.flush()===false)return;
   const tracks=getTracks(),selected=tracks.find(t=>t.id===trackId);if(!selected)return;
   if(!root.confirm('Delete «'+selected.name+'» from this song?\n\nThe local audio copy is deleted only if no other tracks or songs use it. The original file in Files/iCloud/Drive is kept.'))return;
   try{commit(tracks.filter(t=>t.id!==trackId),song)}catch(error){message(error.message,true);return}
   importing=true;draw();let failed=false;
   try{if(!root.StageProject.assets(o.state()).includes(selected.assetId)){await repo.remove(selected.assetId);fileInfo.delete(selected.assetId)}}catch(error){failed=true}
   importing=false;
   if(song!==o.song()){updateTransport();return}
   const ready=await load();if(ready&&!player.routeError())message(failed?'The track was removed from the song. The unused local audio copy could not be deleted.':'The track was deleted from the song.',failed)
  }
  let fileSwipe=null,replacementTarget=null;
  function chooseReplacement(trackId){
   if(loading||importing||player.playing||click.running||player.seekResume||setup?.flush()===false)return false;
   const track=getTracks().find(t=>t.id===trackId);if(!track)return false;
   replacementTarget={song:o.song(),id:track.id,assetId:track.assetId,generation};$('stemReplaceFile').value='';$('stemReplaceFile').click();return true;
  }
  async function replaceFile(trackId,file,target){
   if(!file)return false;
   const song=o.song(),mine=generation;
   if(!song||loading||importing||player.playing||click.running||player.seekResume)return false;
   if(target&&(target.song!==song||target.generation!==mine)){message('The selected song changed. Choose REPLACE FILE again.',true);return false}
   if(setup?.flush()===false)return false;
   const tracks=getTracks(),index=tracks.findIndex(t=>t.id===trackId),track=tracks[index];if(!track||target&&track.assetId!==target.assetId)return false;
   let assetId=null,committed=false;const stillCurrent=()=>song===o.song()&&mine===generation;
   importing=true;draw();message('Checking replacement audio for «'+track.name+'»…');
   try{
    if(!/\.(wav|mp3|m4a|aif|aiff|caf)$/i.test(file.name))throw Error('Choose WAV, MP3, M4A, AIFF or CAF.');
    const data=await file.arrayBuffer();if(!data.byteLength)throw Error('The replacement file is empty.');
    if(data.byteLength>160*1024*1024)throw Error('The replacement exceeds the 160 MiB file limit in this web version.');
    if(!stillCurrent())throw Error('The selected song changed. File replacement was cancelled.');
    assetId=root.StageProject.id();await repo.put(assetId,{data,name:file.name,type:file.type||'application/octet-stream'});
    if(!stillCurrent())throw Error('The selected song changed. File replacement was cancelled.');
    const next=root.StageProject.track({...track,assetId,fileName:file.name,fileBytes:data.byteLength});
    // Release the previous PCM and validate only the new file first. Other missing stems can be relinked one by one.
    const valid=await player.load([next],repo,1,0);
    if(!stillCurrent())throw Error('The selected song changed. File replacement was cancelled.');
    if(!valid)throw Error('The replacement file could not be prepared.');
    tracks[index]=next;commit(tracks,song);committed=true;
    let cleanupFailed=false;
    try{if(!root.StageProject.assets(o.state()).includes(track.assetId)){await repo.remove(track.assetId);fileInfo.delete(track.assetId)}}catch{cleanupFailed=true}
    importing=false;
    if(!stillCurrent()){updateTransport();return true}
    const ready=await load();
    if(song===o.song()&&ready)message('Replaced «'+track.name+'» with '+file.name+'. Track settings and mute groups kept.'+(cleanupFailed?' The unused previous local copy could not be removed.':''),cleanupFailed);
    else if(song===o.song())message('Replacement saved for «'+track.name+'». '+$('mixerStatus').textContent,true);
    return true;
   }catch(error){
    if(assetId&&!committed)await repo.remove(assetId).catch(()=>{});
    importing=false;
    if(stillCurrent()){await load();if(song===o.song())message(error.name==='QuotaExceededError'?'There is not enough storage for the replacement. The previous file is kept.':error.message,true)}else updateTransport();
    return false;
   }
  }
  $('stemReplaceFile').onchange=e=>{const target=replacementTarget,file=e.target.files?.[0];replacementTarget=null;e.target.value='';if(file&&target)return replaceFile(target.id,file,target)};
  $('stemReplaceFile').addEventListener('cancel',()=>replacementTarget=null);
  $('mixerSongFiles').addEventListener('click',e=>{const replace=e.target.closest('[data-file-replace]');if(replace&&!replace.disabled)return chooseReplacement(replace.dataset.fileReplace);const button=e.target.closest('[data-file-delete]');if(button&&!button.disabled)return removeFile(button.dataset.fileDelete)});
  $('mixerSongFiles').addEventListener('pointerdown',e=>{fileSwipe=null;const card=e.target.closest('[data-file-track]');if(!card||e.target.closest('input,button,select')||e.isPrimary===false||(e.button!=null&&e.button!==0)||loading||importing||player.playing||click.running||player.seekResume)return;fileSwipe={song:o.song(),id:card.dataset.fileTrack,pointer:e.pointerId,x:e.clientX,y:e.clientY,time:e.timeStamp}}, {passive:true});
  document.addEventListener('pointercancel',()=>fileSwipe=null,{passive:true});
  document.addEventListener('pointerup',e=>{const swipe=fileSwipe;fileSwipe=null;if(!swipe||swipe.song!==o.song()||swipe.pointer!==e.pointerId||e.isPrimary===false)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;if(dx>=80&&dx>Math.abs(dy)*1.7&&e.timeStamp-swipe.time<1200)return removeFile(swipe.id)}, {passive:true});
  async function addFiles(files){
   const list=[...files||[]],song=o.song(),mine=generation;if(!list.length)return;
   if(!song||player.playing||click.running||importing)return message('Select a song and stop playback before importing.',true);
   if(setup?.flush()===false)return;
   let tracks=getTracks();const created=[],autoIds=new Set(),stereoNew=o.state().opts.newTrackFormat==='stereo';let committed=false;
   importing=true;draw();message('Copying audio files to this device…');
   try{
    if(!song.playback?.tracks&&song.audioId){const legacy=await repo.get(song.audioId);if(!legacy?.data)tracks=[]}
    if(tracks.length+list.length>32)throw Error('A song can contain up to 32 tracks.');
    if(list.some(f=>!/^.*\.(wav|mp3|m4a|aif|aiff|caf)$/i.test(f.name)))throw Error('Choose WAV, MP3, M4A, AIFF or CAF.');
    for(const file of list){
     const data=await file.arrayBuffer();if(!data.byteLength)throw Error('«'+file.name+'» is empty.');
     if(song!==o.song()||mine!==generation)throw Error('The selected song changed. Import was cancelled.');
     const assetId=root.StageProject.id();await repo.put(assetId,{data,name:file.name,type:file.type||'application/octet-stream'});created.push(assetId);
     if(song!==o.song()||mine!==generation)throw Error('The selected song changed. Import was cancelled.');
     const click=/(?:click|klikk|clix|metronom)/i.test(file.name),track=root.StageProject.track({assetId,name:file.name.replace(/\.[^.]+$/,''),fileName:file.name,fileBytes:data.byteLength,stereo:!click&&stereoNew,output:click?3:1,bus:click?2:1});
     tracks.push(track);if(track.stereo)autoIds.add(track.id)
    }
    commit(tracks,song);committed=true;importing=false;await load(autoIds)
   }catch(error){
    if(!committed)for(const key of created)await repo.remove(key).catch(()=>{});
    importing=false;message(error.name==='QuotaExceededError'?'There is not enough storage for the audio files. Free some space and import again.':error.message,true);draw()
   }
  }
  async function beginPlayback(){
   clickError='';if(view==='tempo'&&!player.playing&&!click.running&&!saveClick())return;const cfg=root.StageClick.config(o.song()),atStart=player.position<=.001||player.position>=player.duration,count=atStart?cfg.countInBars*cfg.beatsPerBar:0;
   o.beforePlay?.();await player.play({delay:count*60/cfg.bpm,onScheduled:when=>click.beginMusic(cfg,when,count,player.startOffset)})
  }
  async function toggleMetronome(){
   o.manualTransport?.();if(loading||importing||!o.song())return false;if(player.countingIn){message('Use STOP to cancel the count-in.');return false}
   clickError='';try{if(click.running)click.stop();else{if(setup?.flush()===false)return false;if(view==='tempo'&&!player.playing&&!saveClick())return false;o.beforePlay?.();const pending=click.start(root.StageClick.config(o.song()));updateTransport();await pending}draw();return click.running}catch(error){clickError=error.message;$('clickStatus').textContent=error.message;message(error.message,true);draw();return false}
  }
  function clickFields(){return {bpm:Number($('clickBpm').value),followSongBpm:$('clickFollow').checked,beatsPerBar:Number($('clickBeats').value),countInBars:Number($('clickBars').value),countInSound:$('clickCountSound').checked,continuous:$('clickContinuous').checked,bus:Number($('clickBus').value),volume:Number($('clickVolume').value)/100}}
  function putClickFields(c){$('clickBpm').value=c.bpm;$('clickFollow').checked=c.followSongBpm;$('clickBeats').value=c.beatsPerBar;$('clickBars').value=c.countInBars;$('clickCountSound').checked=c.countInSound;$('clickContinuous').checked=c.continuous;$('clickBus').value=c.bus;$('clickVolume').value=Math.round(c.volume*100)}
  function drawClick(){
   const song=o.song(),cfg=root.StageClick.config(song),key=JSON.stringify([song?.playback?.click,cfg.songBpm]),buses=getBuses(),busKey=JSON.stringify(buses.map(b=>[b.id,b.name,b.output,b.stereo]));if(busKey!==clickBusesKey){const selected=$('clickBus').value;clickBusesKey=busKey;$('clickBus').innerHTML=buses.map(b=>'<option value="'+b.id+'">'+esc(b.name)+' · USB '+b.output+(b.stereo?'–'+(b.output+1):'')+'</option>').join('');$('clickBus').value=selected||String(cfg.bus)}
   if(clickSong!==song||clickKey!==key){clickSong=song;clickKey=key;const buses=getBuses();$('clickBus').innerHTML=buses.map(b=>'<option value="'+b.id+'">'+esc(b.name)+' · USB '+b.output+(b.stereo?'–'+(b.output+1):'')+'</option>').join('');putClickFields(cfg);$('clickStatus').textContent='';root.StageLive.drafts?.open('click',JSON.stringify([song?.title,song?.text,key]),clickFields,c=>{root.StageClick.settings({playback:{click:c}});putClickFields(c);$('clickStatus').textContent='Recovered click settings. Review and SAVE CLICK SETTINGS.'},()=>clickSong===o.song()&&!$('tempoPanel').classList.contains('hidden'))}
   const locked=loading||importing||player.playing||click.running||!!player.seekResume;
   for(const id of ['clickFollow','clickBeats','clickBars','clickCountSound','clickContinuous','clickBus','clickVolume','clickSave'])$(id).disabled=locked||!song;
   $('clickBpm').disabled=locked||!song||($('clickFollow').checked&&!!cfg.songBpm);if($('clickFollow').checked&&cfg.songBpm)$('clickBpm').value=cfg.songBpm;
   $('clickToggle').disabled=loading||importing||!song||player.countingIn;$('clickToggle').textContent=click.running?'STOP METRONOME':'START METRONOME';$('clickToggle').setAttribute('aria-pressed',String(click.running));$('clickVolumeText').textContent=$('clickVolume').value+'%';clickFrame()
  }
  function saveClick(value=clickFields()){
   const song=o.song();if(!song||loading||importing||player.playing||click.running)return false;const previous=song.playback;
   try{root.StageClick.settings({playback:{click:value}});song.playback={...previous,click:value};if(o.save()===false){song.playback=previous;throw Error('Click settings could not be saved.')}root.StageLive.drafts?.clear('click');clickError='';invalidateProject();clickKey='';draw();$('clickStatus').textContent='Click settings saved for this song.';return true}catch(error){song.playback=previous;$('clickStatus').textContent=error.message;return false}
  }
  function cycleCountIn(){if(loading||importing||player.playing||click.running)return false;const cfg=view==='tempo'?clickFields():root.StageClick.settings(o.song());cfg.countInBars=({0:2,2:4,4:0})[cfg.countInBars];return saveClick(cfg)}
  function clickFrame(){
   const frame=click.frame(),container=$('clickVisual');container.classList.toggle('hidden',!frame);$('performanceBar').classList.toggle('counting-in',player.countingIn);
   if(!frame)return;if(frame.beats!==lightBeats){lightBeats=frame.beats;$('clickLights').innerHTML=Array.from({length:lightBeats},(_,i)=>'<span class="beat-light" data-beat="'+i+'" aria-hidden="true"></span>').join('')}
   $('clickLights').querySelectorAll('[data-beat]').forEach((node,i)=>{node.classList.toggle('lit',!frame.waiting&&frame.flash&&i===frame.beat);node.classList.toggle('downbeat',i===0)});
   $('clickPhase').textContent=frame.waiting?'GET READY':frame.counting?'COUNT-IN '+frame.bar+' / '+frame.bars+' · BEAT '+(frame.beat+1)+' / '+frame.beats:'METRONOME · BEAT '+(frame.beat+1)+' / '+frame.beats;
  }
  $('clickToggle').onclick=toggleMetronome;$('clickSave').onclick=()=>saveClick();for(const id of ['clickBpm','clickFollow','clickBeats','clickBars','clickCountSound','clickContinuous','clickBus','clickVolume'])$(id).oninput=$(id).onchange=()=>{drawClick();root.StageLive.drafts?.capture('click')};
  async function playPause(){
   o.manualTransport?.();if(loading||importing)return;const action=player.playing||player.seekResume?'pause':'play';if(!gate.accept(action,'toggle')){updateTransport();return}
   try{if(player.playing||player.seekResume)player.pause();else{await beginPlayback()}draw()}catch(error){message(error.message,true);draw()}
  }
  async function start({automatic=false}={}){if(!automatic)o.manualTransport?.();if(loading||importing)return false;if(player.playing||player.seekResume)return true;if(!automatic&&!gate.accept('play','start')){updateTransport();return false}try{await beginPlayback();draw();return player.playing}catch(error){message(error.message,true);return false}}
  function stop(){o.manualTransport?.();if(loading&&!importing)return cancelPreparation();if(!gate.accept('stop')){updateTransport();return false}player.stop();draw();return true}
  function cancelPreparation(){if(importing)return false;cancel();message('Audio preparation cancelled. Choose PREPARE AUDIO to try again.');draw();return true}
  function pause(){o.manualTransport?.();if(!gate.accept('pause')){updateTransport();return false}player.pause();draw();return true}
  function changeMaster(value){const song=o.song();if(!song)return;const gain=Number(value);if(!Number.isFinite(gain))return;const previous=song.playback;song.playback={...previous,tracks:getTracks(),masterGain:Math.max(0,Math.min(2,gain))};if(o.save()===false){song.playback=previous;message('Song level could not be saved.',true);draw();return}invalidateProject();player.setMaster(song.playback.masterGain);$('masterGain').value=gainToFader(song.playback.masterGain);$('masterGain').setAttribute('aria-valuetext',gainText(song.playback.masterGain));$('masterGainText').textContent=song.playback.masterGain>0?(20*Math.log10(song.playback.masterGain)).toFixed(1)+' dB':'−∞ dB'}
  function changeGlobalMaster(value){const gain=Number(value);if(!Number.isFinite(gain))return;const previous=o.state().opts.masterGain,next=Math.max(0,Math.min(2,gain));o.state().opts.masterGain=next;if(o.save()===false){o.state().opts.masterGain=previous;message('Master level could not be saved.',true);draw();return}player.setGlobalMaster(next);$('globalMasterGain').value=gainToFader(next);$('globalMasterGain').setAttribute('aria-valuetext',gainText(next));$('globalMasterGainText').textContent=gainText(next)}
  async function applyTempo(reset=false){
   const song=o.song();if(!song||loading||importing||player.playing||click.running||player.seekResume)return;if(tempoDetecting||setup?.flush()===false)return;
   try{const previous=song.playback,current=root.StageTempo.config(song),next=reset?(current?{originalBpm:current.originalBpm,targetBpm:current.originalBpm}:null):{originalBpm:Number($('tempoOriginal').value),targetBpm:Number($('tempoTarget').value)};root.StageTempo.config({playback:{tempo:next}});song.playback={...previous,tracks:getTracks(),tempo:next};if(o.save()===false){song.playback=previous;throw Error('Song tempo could not be saved.')}root.StageLive.drafts?.clear('tempo');invalidateProject();const success=await load();if(song!==o.song())return;$('tempoStatus').textContent=success?(reset?'Original tempo restored.':'Playback BPM saved. Pitch is preserved.'):'Tempo saved, but audio is not ready. See the audio error above. Reset to ORIGINAL TEMPO if memory is insufficient.';o.tempoChanged?.()}
   catch(error){$('tempoStatus').textContent=error.message}
  }
  function download(file){const a=document.createElement('a'),url=URL.createObjectURL(file);a.href=url;a.download=file.name||'BenKen.benken';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
  async function exportProject(){
   o.manualTransport?.();
   if(loading||importing||player.playing||click.running)return message('Stop playback before creating a project file.',true);
   if(setup?.flush()===false)return;
   const scope=$('projectScope').value==='all'?'library':'song',state=structuredClone(o.state()),song=o.song();if(scope==='song'&&!song)return;
   delete state.opts.audioOutputMode;if(scope==='song'){state.songs=[structuredClone(song)];state.sets={};delete state.setAutoplay;state.set='';state.idx=0}
   player.cancel();updateTransport();drawMemory();$('projectBackup').disabled=true;message('Creating a project with local audio files…');
   try{for(const item of state.songs)if(!item.playback?.tracks&&item.audioId){const legacy=await repo.get(item.audioId);if(!legacy?.data)item.playback={...item.playback,tracks:[]}}const blob=await root.StageProject.pack(state,repo,()=>{},{scope});const title=scope==='song'?song.title:'Library';prepared=new File([blob],'BenKen_'+title.replace(/[<>:"/\\|?*]/g,'_')+'.benken',{type:'application/x-benken-project'});$('projectDownload').disabled=false;$('projectShare').disabled=!(root.navigator.share&&root.navigator.canShare?.({files:[prepared]}));message('Project file ready. Choose SHARE / SAVE TO FILES or DOWNLOAD.')}catch(error){message(error.message,true)}finally{$('projectBackup').disabled=false}
  }
  async function importProject(file){
   if(player.playing||loading||importing)return message('Stop playback and wait for audio preparation to finish before importing a project.',true);
   let restored=null,committed=false;
   try{
    const manifest=await root.StageProject.inspect(file),single=manifest.scope==='song';
    if(single&&manifest.state.songs.length!==1)throw Error('A song project must contain exactly one song.');
    if(setup?.flush()===false)return;
    if(!single&&o.state().songs.length&&!root.confirm('Replace the library and setlists with this project? A backup of the current text library will download first.'))return;
    if(!single&&o.state().songs.length)o.backup?.();
    importing=true;draw();message('Importing project and copying audio locally…');
    restored=await root.StageProject.unpack(file,repo);
    const next=single?root.StageProject.mergeSong(o.state(),restored):restored;
    o.importState(next);committed=true;importing=false;o.imported?.();const ready=await load();if(ready&&!player.routeError())message(single?'The song and local audio files have been added. Press PLAY.':'Library, setlists and audio files imported. Press PLAY.')
   }catch(error){if(restored&&!committed)for(const key of root.StageProject.assets(restored))await repo.remove(key).catch(()=>{});importing=false;message(committed?'The song and audio files are saved. Press PREPARE AUDIO. '+error.message:error.message,true);draw()}
  }
  function selectView(next){if(setup?.close()===false)return false;const previous=o.state().opts.mixerView;o.state().opts.mixerView=next;if(o.save()===false){o.state().opts.mixerView=previous;message('Mixer view could not be saved.',true);return false}view=next;draw();return true}
  function dockControls(docked){const bar=$('performanceBar'),parent=$(docked?'mixerControlsDock':'performanceHome');if(bar.parentNode===parent)return;bar.remove();parent.appendChild(bar);o.controlsDockChanged?.(docked)}
  $('mixerControlsToggle').onclick=()=>o.toggleControls?.();
  $('mixerBtn').onclick=()=>{setup?.close();try{if(!player.playing){player.configure();const error=player.routeError();if(error)message(error,true)}}catch(error){message(error.message,true)}draw();$('mixerDialog').showModal();dockControls(true)};
  $('closeMixer').onclick=()=>{if(setup?.close()===false)return;gestures?.clear();dockControls(false);$('mixerDialog').close()};
  $('mixerDialog').addEventListener('close',()=>{setup?.close();gestures?.clear();dockControls(false)});
  $('audioPlay').onclick=playPause;$('audioStop').onclick=stop;
  $('stemAdd').onclick=()=>$('stemFiles').click();$('stemFiles').onchange=e=>{const files=[...e.target.files];e.target.value='';return addFiles(files)};
  $('audioChoose').onclick=()=>$('mixerBtn').click();$('audioFile').onchange=e=>{const files=[...e.target.files];e.target.value='';return addFiles(files)};
  function prepare(){const mine=generation;if(setup?.flush()!==false)return mine===generation?load():pendingLoad}
  $('newTrackFormat').onchange=e=>{const previous=o.state().opts.newTrackFormat;o.state().opts.newTrackFormat=e.target.value==='stereo'?'stereo':'mono';if(o.save()===false){o.state().opts.newTrackFormat=previous;e.target.value=previous==='stereo'?'stereo':'mono';message('The default track format could not be saved.',true)}};
  $('prepareAudio').onclick=prepare;$('refreshOutputs').onclick=()=>{try{player.configure();const error=player.routeError();message(error||'Outputs read. Check the USB routing.',!!error);draw()}catch(error){message(error.message,true)}};
  function drawOutputMode(){
   const stereo=player.mode==='stereo',locked=loading||importing||player.playing||click.running||!!player.seekResume;
   for(const button of document.querySelectorAll('[data-output-mode]')){button.setAttribute('aria-pressed',String(button.dataset.outputMode===(stereo?'stereo':'usb')));button.disabled=locked}
   $('outputMode').value=player.mode;$('mixerModeBadge').textContent=stereo?'PRACTICE · STEREO':'LIVE · USB';$('mixerModeBadge').dataset.mode=player.mode;
  }
  function setOutputMode(mode){
   if(loading||importing||player.playing||click.running||player.seekResume){message('Stop playback before changing Practice / Live mode.',true);drawOutputMode();return false}
   o.manualTransport?.();const previous=o.state().opts.audioOutputMode,old=player.mode;
   try{player.setMode(mode);o.state().opts.audioOutputMode=player.mode;if(o.save()===false)throw Error('The output mode could not be saved.');clickError='';const error=player.routeError();message(error||(player.mode==='stereo'?'Practice / Stereo: all tracks, including click, go to outputs 1–2. Live routing is kept.':'Live / USB: saved output routing restored.'),!!error);$('mixerOutputs').textContent=player.mode==='stereo'?'Stereo practice: all tracks, including the click, are mixed to outputs 1–2.':'Ui24R / USB · '+player.channels+' channels · '+Math.round(player.context.sampleRate)+' Hz';updateTransport();return true}
   catch(error){o.state().opts.audioOutputMode=previous;try{player.setMode(old)}catch{}message(error.message,true);updateTransport();return false}
  }
  $('outputMode').onchange=e=>setOutputMode(e.target.value);$('mixerPractice').onclick=()=>setOutputMode('stereo');$('mixerLive').onclick=()=>setOutputMode('usb');
  $('globalMasterGain').addEventListener('input',e=>changeGlobalMaster(faderToGain(e.target.value)));$('globalMasterReset').onclick=()=>changeGlobalMaster(1);
  $('masterVisible').onchange=e=>{const previous=o.state().opts.masterHidden;o.state().opts.masterHidden=!e.target.checked;if(o.save()===false){o.state().opts.masterHidden=previous;message('Master visibility could not be saved.',true)}drawAppearance()};
  $('transposeMinus').onclick=()=>{editTranspose(-1);return applyTranspose()};$('transposePlus').onclick=()=>{editTranspose(1);return applyTranspose()};$('transposeValue').oninput=()=>editTranspose();$('transposeValue').onchange=()=>applyTranspose();$('transposeApply').onclick=()=>applyTranspose();$('transposeReset').onclick=()=>applyTranspose(0);
  $('tempoMinus').onclick=()=>changeBpm(-1);$('tempoPlus').onclick=()=>changeBpm(1);$('tempoOriginal').oninput=()=>editTempo();$('tempoTarget').oninput=()=>editTempo(true);$('tempoDetect').onclick=detectTempo;$('tempoUseEstimate').onclick=async()=>{if(!tempoEstimate||tempoDetecting||songChanged())return;const bpm=tempoEstimate.bpm;$('tempoOriginal').value=String(bpm);editTempo();if(!saveClick())return;await applyTempo()};function songChanged(){return tempoSong!==o.song()}
  for(const [id,factor] of [['tempoHalf',.5],['tempoDouble',2]])$(id).onclick=()=>{if(!tempoEstimate||tempoDetecting||songChanged())return;const bpm=Math.round(tempoEstimate.bpm*factor*10)/10;if(bpm>=20&&bpm<=300){tempoEstimate.bpm=bpm;estimateText()}};
  $('tempoToggle').onclick=()=>selectView('tempo');$('tempoApply').onclick=()=>applyTempo();$('tempoReset').onclick=()=>applyTempo(true);
  $('masterGain').addEventListener('input',e=>changeMaster(faderToGain(e.target.value)));$('masterReset').onclick=()=>changeMaster(1);
  $('routeDirect').onclick=()=>{
   const song=o.song();if(!song||loading||importing||player.playing||click.running)return;
   const previous=song.playback,oldBuses=o.state().opts.audioBuses;
   try{const plan=root.StageProject.routeDirect(o.state(),song,getTracks());if(!plan.changed)return;song.playback={...previous,tracks:plan.tracks};o.state().opts.audioBuses=plan.buses;
    if(o.save()===false){song.playback=previous;o.state().opts.audioBuses=oldBuses;throw Error('Bus routing could not be saved. Routing is unchanged.')}
    invalidateProject();player.setBuses(getBuses());player.update(plan.tracks);const error=player.routeError();message(error||plan.changed+' tracks connected to buses. USB outputs and levels are unchanged.',!!error);draw()
   }catch(error){message(error.message,true);draw()}
  };
  function resetTrack(e){const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks();tracks[Number(strip.dataset.track)].gain=1;commit(tracks);draw()}catch(error){message(error.message,true);draw()}}
  $('mixerTracks').addEventListener('click',e=>{if(e.target.closest('[data-track-reset]'))resetTrack(e)});
  gestures=root.StageFaderGestures.mount({element:$('mixerDialog'),song:o.song,reset:input=>{
   if(input.disabled||loading||importing||!o.song())return;
   if(input.id==='globalMasterGain'){changeGlobalMaster(1);return}
   if(input.id==='masterGain'){changeMaster(1);return}
   try{const track=input.closest('[data-track]'),bus=input.closest('[data-bus]');
    if(track){const tracks=getTracks();tracks[Number(track.dataset.track)].gain=1;commit(tracks)}
    else if(bus){const buses=getBuses();buses[Number(bus.dataset.bus)-1].gain=1;commitBuses(buses)}
    else return;draw()
   }catch(error){message(error.message,true);draw()}
  }});
  $('mixerTracks').addEventListener('input',e=>{const input=e.target.closest('input[data-field]'),strip=e.target.closest('[data-track]');if(!input||!strip)return;if(loading||importing){draw();return}try{const tracks=getTracks(),i=Number(strip.dataset.track),field=input.dataset.field;tracks[i][field]=field==='name'?input.value:field==='gain'?faderToGain(input.value):Number(input.value);commit(tracks);if(field==='gain'){input.setAttribute('aria-valuetext',gainText(tracks[i].gain));$('mixerTracks').querySelector('[data-gain="'+i+'"]').textContent=gainText(tracks[i].gain)}}catch(error){message(error.message,true);draw()}});
  $('mixerTracks').addEventListener('click',e=>{const strip=e.target.closest('[data-track]');if(!strip||loading||importing)return;try{const tracks=getTracks(),i=Number(strip.dataset.track),toggle=e.target.closest('[data-toggle]'),remove=e.target.closest('[data-remove]');if(toggle&&toggle.dataset.toggle==='mute'&&player.groupMuted(tracks[i]))return message('An active mute group is muting this track. Turn off the group to hear the track.');if(toggle){tracks[i][toggle.dataset.toggle]=!tracks[i][toggle.dataset.toggle];commit(tracks);draw()}if(remove&&!player.playing&&!loading&&!importing&&root.confirm('Remove this track from the song? The audio file will be kept locally.')){tracks.splice(i,1);commit(tracks);load()}}catch(error){message(error.message,true)}});
  $('projectScope').addEventListener('change',()=>{invalidateProject();message('Choose CREATE PROJECT FILE for the selected content.')});$('projectBackup').onclick=exportProject;$('projectDownload').onclick=()=>{if(prepared)download(prepared)};
  $('projectShare').onclick=()=>{if(prepared)root.navigator.share({files:[prepared],title:'BenKen project with audio'}).catch(error=>{if(error.name!=='AbortError')message(error.message,true)})};
  $('projectImport').onclick=()=>$('projectFile').click();$('projectFile').onchange=e=>{const file=e.target.files?.[0];e.target.value='';if(file)return importProject(file)};
  $('mixerTrackTab').onclick=()=>selectView('tracks');$('mixerBusTab').onclick=()=>selectView('buses');$('mixerGroupTab').onclick=()=>selectView('groups');$('mixerEditGroups').onclick=()=>openSettings({tab:'groups'});$('busShowAll').onchange=e=>{const previous=o.state().opts.busShowAll,old=showAllBuses;o.state().opts.busShowAll=e.target.checked;if(o.save()===false){o.state().opts.busShowAll=previous;e.target.checked=old;message('Bus display could not be saved.',true);return}showAllBuses=e.target.checked;drawBuses()};
  function busInput(e){const input=e.target.closest('[data-bus-field]'),strip=e.target.closest('[data-bus]');if(!input||!strip)return;const field=input.dataset.busField;if((e.type==='change'&&input.tagName==='INPUT')||(e.type==='input'&&input.tagName==='SELECT'))return;if(loading||importing||(player.playing&&['stereo','output'].includes(field))){draw();return}try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];b[field]=field==='name'?input.value:field==='stereo'?input.value==='true':field==='gain'?faderToGain(input.value):Number(input.value);commitBuses(buses);if(field==='gain'){input.setAttribute('aria-valuetext',gainText(b.gain));strip.querySelector('[data-bus-gain]').textContent=gainText(b.gain)};if(field==='stereo'||field==='output'){const error=player.routeError();message(error||'Bus routing saved for all songs.',!!error);draw()}else updateTransport()}catch(error){message(error.message,true);draw()}}
  $('mixerTracks').addEventListener('change',e=>{if(e.target.dataset.field==='name')draw()});
  $('mixerBuses').addEventListener('change',e=>{if(e.target.dataset.busField==='name')draw()});
  $('mixerBuses').addEventListener('input',busInput);$('mixerBuses').addEventListener('change',busInput);
  $('mixerBuses').addEventListener('click',e=>{const strip=e.target.closest('[data-bus]');if(!strip||loading||importing)return;const mute=e.target.closest('[data-bus-mute]'),reset=e.target.closest('[data-bus-reset]');if(!mute&&!reset)return;try{const buses=getBuses(),b=buses[Number(strip.dataset.bus)-1];if(mute)b.mute=!b.mute;else b.gain=1;commitBuses(buses);draw()}catch(error){message(error.message,true)}});
  $('resetMasterPeak').onclick=()=>{heldPeak=heldSongPeak=0;$('masterPeakHoldText').textContent=$('globalMasterPeakHoldText').textContent='−∞ dBFS'};
  $('mixerGroups').addEventListener('click',e=>{const button=e.target.closest('[data-global-group]');if(button)toggleGroup(Number(button.dataset.globalGroup))});
  $('mixerMasterMute').onclick=toggleMasterMute;
  function applySetup(draft,{quiet=false}={}){
   if(loading||importing||player.playing||click.running||player.seekResume)throw Error('Stop playback and wait for the audio to be ready before saving settings.');
   const song=o.song(),state=o.state(),current=getTracks();
   if(song!==draft.song||state!==draft.state||root.StageMixerSettings.signature(current,getBuses(),root.StageProject.groupNames(state))!==draft.signature)throw Error('The song or tracks changed. Close and reopen Mixer Settings.');
   const tracks=current.map((t,i)=>{const next={...t};for(const key of ['name','color','bus','stereo','followTranspose','output','muteGroups']){if(draft.tracks[i][key]===undefined)delete next[key];else next[key]=draft.tracks[i][key]}return root.StageProject.track(next)});
   const currentBuses=getBuses(),buses=draft.buses.map((b,i)=>root.StageProject.bus({...b,gain:currentBuses[i].gain,mute:currentBuses[i].mute})),names=root.StageProject.groupNames({opts:{muteGroupNames:draft.names}}),previousPlayback=song.playback,previousOpts=state.opts;
   song.playback={...previousPlayback,tracks};state.opts={...previousOpts,audioBuses:buses,muteGroupNames:names};
   if(o.save()===false){song.playback=previousPlayback;state.opts=previousOpts;throw Error('Mixer settings could not be saved. No settings have been changed.')}
   invalidateProject();player.setBuses(buses);player.update(tracks);if(tracks.some((t,i)=>t.stereo!==current[i].stereo||t.followTranspose!==current[i].followTranspose)){load();return}const error=player.routeError();message(error||'Names, colors, buses and mute groups saved.',!!error);if(!quiet)draw()
  }
  setup=root.StageMixerSettings.mount({state:o.state,song:o.song,player,tracks:getTracks,buses:getBuses,busy:()=>loading||importing,message,trackColor,busColor,drawFiles,closed:()=>draw(),apply:applySetup});
  function openSettings(target){if(!$('mixerDialog').hasAttribute('open'))$('mixerBtn').click();return setup.open(target)}
  $('mixerSettingsBtn').onclick=()=>setup.isOpen()?setup.close():openSettings();
  $('mixerAddFromEmpty').onclick=()=>openSettings({tab:'audio'});
  $('mixerWidth').onchange=e=>{const previous=o.state().opts.mixerWidth,next=e.target.value==='narrow'?'narrow':'normal';o.state().opts.mixerWidth=next;if(o.save()===false){o.state().opts.mixerWidth=previous;e.target.value=previous==='narrow'?'narrow':'normal';message('Mixer width could not be saved.',true);return}$('globalMasterStrip').classList.toggle('hidden',o.state().opts.masterHidden===true);$('masterVisible').checked=o.state().opts.masterHidden!==true;$('mixerDialog').classList.toggle('mixer-narrow',next==='narrow')};
  $('mixerTracks').addEventListener('click',e=>{const button=e.target.closest('[data-edit-track]');if(button&&!button.disabled)openSettings(button.dataset.editTrack)});
  $('mixerBuses').addEventListener('click',e=>{const button=e.target.closest('[data-edit-bus]');if(button&&!button.disabled)openSettings({busId:Number(button.dataset.editBus)})});
  $('projectDemo').onclick=async()=>{if(loading||importing||player.playing||click.running)return;$('projectDemo').disabled=true;message('Loading demo song…');try{const response=await root.fetch('./demo/BenKen_Ui24R_Busstest.benken');if(!response.ok)throw Error('The demo song is missing. Upload the demo folder from V26.32 to GitHub.');await importProject(await response.blob())}catch(error){message(error.message,true)}finally{updateTransport()}};
  function meter(bar,out,peak){const info=root.StageAudio.level(peak||0);bar.style.height=info.percent+'%';bar.parentNode.setAttribute('aria-valuenow',String(Number.isFinite(info.db)?Math.max(-60,Math.min(0,info.db)):-60));bar.parentNode.dataset.zone=info.clip?'clip':info.db>=-6?'high':'normal';out.textContent=info.label+' dBFS'+(info.clip?' · CLIP':'')}
  setInterval(()=>{root.StageLive.drafts?.tick();player.tick();click.tick();clickFrame();o.time?.(player.currentTime,player.duration);const peak=player.meterMaster(),songPeak=player.meterSong();heldPeak=Math.max(heldPeak,peak);heldSongPeak=Math.max(heldSongPeak,songPeak);if($('mixerDialog').open||$('mixerDialog').hasAttribute('open')){const levels=player.meters();$('mixerTracks').querySelectorAll('[data-meter]').forEach((bar,i)=>meter(bar,$('mixerTracks').querySelector('[data-peak="'+i+'"]'),levels[i]||0));const busLevels=player.meterBuses();$('mixerBuses').querySelectorAll('[data-bus-meter]').forEach(bar=>meter(bar,$('mixerBuses').querySelector('[data-bus-peak="'+bar.dataset.busMeter+'"]'),busLevels.get(Number(bar.dataset.busMeter))||0));meter($('globalMasterMeter'),$('globalMasterPeakText'),peak);$('globalMasterPeakHoldText').textContent=root.StageAudio.level(heldPeak).label+' dBFS';meter($('masterMeter'),$('masterPeakText'),songPeak);$('masterPeakHoldText').textContent=root.StageAudio.level(heldSongPeak).label+' dBFS';$('mixerPosition').textContent=Math.floor(player.currentTime)+' / '+Math.ceil(player.duration)+' s'}setup?.refresh();for(const listener of listeners)listener()},100);
  return {player,repo,click,applyTranspose,openTempo:()=>{if(!$('mixerDialog').hasAttribute('open'))$('mixerBtn').click();selectView('tempo')},toggleMetronome,cycleCountIn,clickFrame,saveClick,load,prepare,cancel,suspend:()=>{o.manualTransport?.();cancel()},draw,openSettings,addFiles,removeFile,replaceFile,exportProject,importProject,playPause,start,applyTempo,changeSongLevel:changeMaster,changeGlobalMaster,seek,toggleGroup,toggleMasterMute,groupState,readiness,cancelPreparation,whenReady:()=>pendingLoad,setOutputMode,stop,pause,clearTransportProtection:()=>gate.clear(),restoreLibrary:(state,options)=>{const result=o.importState(state,options);player.mode=o.state().opts.audioOutputMode==='stereo'?'stereo':'usb';return result},tracks:getTracks,busy:()=>loading||importing,flushSettings:()=>setup?.flush()!==false,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn)}}
 }
 root.StageMixer={VERSION:'26.32',mount,gainToFader,faderToGain,faderMarkup};
})(typeof window!=='undefined'?window:globalThis);


// stage-performance.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const MAX_CONTROLS=40;
 const defaults=['prev','play','stop','next','mute','back','forward','mixer','notes'];
 const actions={notes:'Song notes',metronome:'Metronome start / stop',countIn:'Count-in off / 2 / 4 bars',practice:'Practice / Stereo or Live / USB',autoplay:'Default autoplay for setlist entries',backup:'Full backup and restore',midi:'MIDI settings',fontDown:'Text size − (A−)',fontUp:'Text size + (A+)',sections:'Sync lyric sections',none:'Hide',prev:'Previous song',play:'Play / pause',stop:'Stop',next:'Next song',mute:'Mute all app tracks',back:'Back in song',forward:'Forward in song',begin:'Go to beginning',mixer:'Mixer',files:'Song audio files',scroll:'Autoscroll',fullscreen:'Fullscreen',group1:'Mute group 1',group2:'Mute group 2',group3:'Mute group 3',group4:'Mute group 4',group5:'Mute group 5',group6:'Mute group 6',setlist:'Show / hide setlist',library:'Library',settings:'Settings',page:'Two lyric columns',resetScroll:'Lyrics to top',controls:'Customize controls',mixerSetup:'Mixer Settings',waveform:'Show / hide waveform',prepare:'Prepare audio',controlsToggle:'Show / hide control bar'};
 function controls(value){const list=Array.isArray(value)?value:defaults.map(action=>({action}));return list.slice(0,MAX_CONTROLS).map(v=>({action:Object.hasOwn(actions,v?.action)?v.action:'none',label:String(v?.label||'').slice(0,18)}))}
 async function peaks(buffer,bins=600,cancelled=()=>false){
  if(!buffer?.getChannelData||!buffer.length)return null;bins=Math.max(2,Math.min(2000,Math.floor(Number(bins)||600)));const channels=Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c)),out=new Float32Array(bins);let work=0;
  for(let b=0;b<bins;b++){if(cancelled())return null;const start=Math.floor(b*buffer.length/bins),end=Math.min(buffer.length,Math.max(start+1,Math.floor((b+1)*buffer.length/bins)));let peak=0;for(const data of channels)for(let i=start;i<end;i++)peak=Math.max(peak,Math.abs(data[i]));out[b]=Number.isFinite(peak)?peak:0;work+=(end-start)*channels.length;if(work>250000){work=0;await new Promise(resolve=>root.setTimeout(resolve,0))}}
  return out
 }
 function wavePath(values){let max=0;for(const v of values)max=Math.max(max,v);const n=values.length,scale=max?44/max:0;return 'M '+Array.from(values,(v,i)=>(i/(n-1)*1000).toFixed(2)+','+(50-v*scale).toFixed(2)).join(' L ')+' L '+Array.from(values,(v,i)=>((n-1-i)/(n-1)*1000).toFixed(2)+','+(50+values[n-1-i]*scale).toFixed(2)).join(' L ')+' Z'}
 function icon(action){if(action==='fontDown'||action==='fontUp')return '<span class="action-font-symbol" aria-hidden="true">A'+(action==='fontDown'?'−':'+')+'</span>';const path={notes:'M7 3H21L27 9V27H7ZM21 3V10H27M11 15H23M11 20H23',metronome:'M8 26 12 4H21L25 26ZM16 20 26 7M12 20H21',countIn:'M7 9V23M15 5V23M23 9V23M3 26H28',practice:'M4 16V12A12 12 0 0 1 28 12V16M4 14H9V25H4ZM23 14H28V25H23Z',autoplay:'M3 7H20M16 3 21 7 16 11M29 23H12M16 19 11 23 16 27M9 12 21 17 9 22Z',backup:'M4 5H28V25H4ZM9 5V12H23V5M10 25V17H22V25',sections:'M3 6H29M3 15H29M3 24H29M10 4V26M21 4V26',play:'M8 4 23 14 8 24Z',pause:'M8 5H12V23H8ZM18 5H22V23H18Z',stop:'M7 6H24V23H7Z',prev:'M6 5V24M24 5 10 14 24 24Z',next:'M24 5V24M6 5 20 14 6 24Z',mute:'M5 11H11L18 5V24L11 18H5ZM22 10 28 19M28 10 22 19',unmute:'M5 11H11L18 5V24L11 18H5ZM22 9Q29 14 22 20',back:'M14 6 4 14 14 22ZM26 6 16 14 26 22Z',forward:'M4 6 14 14 4 22ZM16 6 26 14 16 22Z',begin:'M6 5V24M25 6 10 14 25 23Z',mixer:'M6 4V25M15 4V25M24 4V25M3 10H9M12 20H18M21 13H27',files:'M3 7H13L16 10H28V24H3Z',scroll:'M7 5H23M7 11H23M7 17H18M21 16V26M17 22 21 26 25 22',fullscreen:'M4 11V5H11M19 5H26V11M26 19V25H19M11 25H4V19',setlist:'M8 7H27M8 14H27M8 21H27M3 7H4M3 14H4M3 21H4',library:'M4 5H13V25H4ZM17 5H26V25H17Z',settings:'M16 4V9M16 21V26M5 15H10M22 15H27M8 7 12 11M20 19 24 23M8 23 12 19M20 11 24 7M16 9A6 6 0 1 0 16 21A6 6 0 1 0 16 9',page:'M3 5H14V25H3ZM18 5H29V25H18Z',resetScroll:'M5 7H27M16 25V12M10 18 16 12 22 18',controls:'M3 7H29M3 15H29M3 23H29M9 4V10M22 12V18M13 20V26',mixerSetup:'M6 4V25M15 4V25M24 4V25M3 10H9M12 20H18M21 13H27',waveform:'M2 15H5L8 5 11 25 15 8 18 22 21 11 24 19 27 15H30',prepare:'M16 4V19M10 13 16 19 22 13M5 21V26H27V21',controlsToggle:'M3 6H29V25H3ZM3 17H29M11 6V17M21 6V17'}[action];return path?'<svg viewBox="0 0 32 30" aria-hidden="true"><path d="'+path+'"/></svg>':'<span class="action-group-number">'+action.replace('group','')+'</span>'}
 function mount(o){
  const $=id=>document.getElementById(id),mixer=o.mixer,player=mixer.player;
  let scrub=null,waveBuffer=null,waveData=null,waveToken=0,controlsKey='',trackKey='',lastMessage='',undockedHeight=0,sectionsKey='';
  const suspended=new Set();const visible=()=>o.state().opts.stageBarVisible!==false&&!suspended.size;
  const opts=()=>o.state().opts,step=()=>Math.max(1,Math.min(120,Number(opts().seekStepSeconds)||10)),ready=()=>!mixer.busy()&&player.duration>0&&player.buffers.length>0&&player.buffers.length===player.tracks.length&&!player.preparing;
  function report(message){lastMessage=message||'';$('performanceStatus').textContent=lastMessage}
  const time=t=>{const value=Math.max(0,Math.floor(t||0));return String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0')};
  function setting(key,value){const previous=opts()[key];opts()[key]=value;if(o.save()===false){opts()[key]=previous;report('The setting could not be saved.');return false}refresh();return true}
  function position(value=player.currentTime){const duration=player.duration||0,at=Math.max(0,Math.min(duration,value||0)),fraction=duration?at/duration:0;$('performanceElapsed').textContent=time(at);$('performanceDuration').textContent=time(duration);$('performanceRemaining').textContent='−'+time(duration-at);$('performanceSeek').max=String(duration||1);if(!scrub)$('performanceSeek').value=String(at);$('performanceSeek').setAttribute('aria-valuetext',time(at)+' of '+time(duration));$('performanceProgress').style.width=(fraction*100)+'%';$('performanceCursor').style.left=(fraction*100)+'%'}
  function canSeek(){return ready()&&(opts().allowSeekDuringPlayback!==false||(!player.playing&&!player.seekResume))}
  function beginScrub(){if(scrub||!canSeek())return;const resume=player.playing||!!player.seekResume,original=player.currentTime;player.pause();scrub={song:o.song(),generation:player.generation,serial:player.seekSerial,resume,original,preview:original};o.activity?.()}
  function clearScrub(){scrub=null}
  async function commitScrub(){const pending=scrub;if(!pending)return;clearScrub();if(pending.song!==o.song()||pending.generation!==player.generation||pending.serial!==player.seekSerial){refresh();return}await mixer.seek(pending.preview,pending.resume);o.activity?.();refresh()}
  async function cancelScrub(){const pending=scrub;clearScrub();if(pending&&pending.song===o.song()&&pending.generation===player.generation&&pending.serial===player.seekSerial)await mixer.seek(pending.original,pending.resume);o.activity?.();refresh()}
  async function act(action){
   if(o.blocked?.()&&action!=='stop')return;const wasSeeking=scrub;clearScrub();
   if(['midi','setlist','library','settings','fullscreen','page'].includes(action)&&$('mixerDialog').hasAttribute('open'))$('closeMixer').click();
   if(action==='midi')o.openMIDI?.();else if(action==='play'){if(wasSeeking){await mixer.seek(wasSeeking.preview,false)}await mixer.playPause()}
   else if(action==='stop'){mixer.stop();report('')}
   else if(action==='prev'||action==='next')$(action).click();
   else if(action==='mute')mixer.toggleMasterMute();
   else if(/^group[1-6]$/.test(action))mixer.toggleGroup(Number(action.slice(-1)));
   else if(['back','forward','begin'].includes(action)&&canSeek()){const from=wasSeeking?.preview??player.currentTime;await mixer.seek(action==='begin'?0:from+(action==='back'?-step():step()),wasSeeking?wasSeeking.resume:undefined)}
   else if(action==='mixer'){if($('mixerDialog').hasAttribute('open'))$('closeMixer').click();else $('mixerBtn').click()}
   else if(action==='sections')o.openTiming?.();
   else if(action==='fontDown'||action==='fontUp'){if(o.changeFont?.(action==='fontDown'?-2:2)===false)report('Text size could not be saved.')}
   else if(action==='metronomeSettings'||action==='transposeSettings')mixer.openTempo();
   else if(action==='metronome')await mixer.toggleMetronome();
   else if(action==='countIn')mixer.cycleCountIn();
   else if(action==='practice')mixer.setOutputMode(player.mode==='stereo'?'usb':'stereo');
   else if(action==='autoplay'){if(setting('autoPlayNext',opts().autoPlayNext!==true)){o.cancelAutoplay?.();report(opts().autoPlayNext?'Autoplay on: current setlist only.':'Autoplay off.')}}
   else if(action==='notes')o.openNotes?.();
   else if(action==='cancelPrepare')mixer.cancelPreparation();
   else if(action==='backup')o.openBackup?.();
   else if(action==='files')mixer.openSettings({tab:'audio'});
   else if(action==='scroll')$('autoBtn').click();else if(action==='fullscreen')$('stageToggle').click();
   else if(action==='controlsToggle')$('controlsBtn').click();else if(action==='setlist')$('view').click();else if(action==='library')o.openLibrary?.();else if(action==='settings')$('settingsBtn').click();else if(action==='page')$('pageBtn').click();else if(action==='resetScroll')o.resetScroll?.();else if(action==='controls')openSettings();else if(action==='mixerSetup')mixer.openSettings();else if(action==='waveform')$('performanceWaveToggle').click();else if(action==='prepare'&&!player.playing&&!mixer.busy())await mixer.prepare();
   if(wasSeeking&&!['play','stop','prev','next','back','forward','begin'].includes(action)&&wasSeeking.generation===player.generation)await mixer.seek(wasSeeking.preview,wasSeeking.resume);
   o.activity?.();refresh()
  }
  function renderControls(){
   const groups=mixer.groupState(),layout=controls(opts().stageControls),running=player.playing||!!player.seekResume||!!scrub?.resume;
   const key=JSON.stringify([layout,groups,!!player.masterMuted,running,player.transportState,ready(),$('audioPlay').disabled,$('prev').disabled,$('next').disabled,step(),opts().allowSeekDuringPlayback,$('autoBtn').getAttribute('aria-pressed'),$('stageToggle').getAttribute('aria-pressed'),$('view').getAttribute('aria-pressed'),$('settingsBtn').getAttribute('aria-pressed'),$('pageBtn').classList.contains('active'),opts().waveformVisible,opts().font,player.mode,opts().autoPlayNext,mixer.busy(),player.playing,!!player.click?.running,player.countingIn,root.StageClick.config(o.song()).countInBars]);if(key===controlsKey)return;controlsKey=key;
   $('performanceControls').innerHTML=layout.filter(c=>c.action!=='none').map(c=>{const group=/^group[1-6]$/.test(c.action)?Number(c.action.slice(-1)):0,active=c.action==='metronome'?!!player.click?.running:c.action==='countIn'?root.StageClick.config(o.song()).countInBars>0:c.action==='practice'?player.mode==='stereo':c.action==='autoplay'?opts().autoPlayNext===true:group?groups.active[group-1]:c.action==='mute'?!!player.masterMuted:c.action==='play'?running:c.action==='stop'?!running&&!player.click?.running&&player.transportState==='stopped':c.action==='scroll'?$('autoBtn').getAttribute('aria-pressed')==='true':c.action==='fullscreen'?$('stageToggle').getAttribute('aria-pressed')==='true':c.action==='setlist'?$('view').getAttribute('aria-pressed')==='true':c.action==='settings'?$('settingsBtn').getAttribute('aria-pressed')==='true':c.action==='page'?$('pageBtn').classList.contains('active'):c.action==='waveform'?opts().waveformVisible===true:false;
    const label=c.label||(group?groups.names[group-1]:c.action==='play'?(running?'PAUSE':'PLAY'):c.action==='mute'?(active?'UNMUTE':'MUTE'):c.action==='back'?'−'+step()+' s':c.action==='forward'?'+'+step()+' s':{notes:'NOTES',metronome:'METRONOME',countIn:'COUNT-IN '+(root.StageClick.config(o.song()).countInBars?root.StageClick.config(o.song()).countInBars+' BARS':'OFF'),practice:player.mode==='stereo'?'PRACTICE · STEREO':'LIVE · USB',autoplay:'AUTO DEFAULT',backup:'BACKUP',midi:'MIDI',fontDown:'SMALLER TEXT',fontUp:'LARGER TEXT',prev:'PREVIOUS',next:'NEXT',stop:'STOP',begin:'START',mixer:'MIXER',files:'AUDIO FILES',scroll:'SCROLL',fullscreen:'FULLSCREEN',setlist:'SETLIST',library:'LIBRARY',settings:'SETTINGS',page:'COLUMNS',resetScroll:'LYRICS TO TOP',controls:'CUSTOMIZE',sections:'SYNC LYRICS',mixerSetup:'MIXER SETTINGS',waveform:'WAVEFORM',prepare:'PREPARE AUDIO',controlsToggle:'HIDE CONTROLS'}[c.action]);
    const disabled=c.action==='metronome'?mixer.busy()||!o.song()||player.countingIn:c.action==='countIn'?mixer.busy()||running||!!player.click?.running:c.action==='practice'?mixer.busy()||running||!!player.click?.running:c.action==='backup'?mixer.busy()||running||!!player.click?.running:c.action==='fontDown'?Number(opts().font)<=14:c.action==='fontUp'?Number(opts().font)>=52:c.action==='play'?$('audioPlay').disabled:c.action==='prev'?$('prev').disabled:c.action==='next'?$('next').disabled:['back','forward','begin'].includes(c.action)?!canSeek():c.action==='prepare'?mixer.busy()||player.playing||!!player.seekResume:false;
    return '<button type="button" class="performance-action action-'+c.action+(active?' action-active':'')+'" data-action="'+c.action+'" title="'+esc(label)+'" aria-label="'+esc(label)+'"'+(['metronome','countIn','practice','autoplay','play','stop','mute','scroll','fullscreen','setlist','settings','page','waveform'].includes(c.action)||group?' aria-pressed="'+active+'"':'')+(disabled?' disabled':'')+'>'+icon(c.action==='play'&&running?'pause':c.action==='mute'&&active?'unmute':c.action)+'<span>'+esc(label)+'</span></button>'
   }).join('')
  }
  function refreshWave(tracks){
   const song=o.song(),id=song?.playback?.waveformTrackId;let index=tracks.findIndex(t=>t.id===id);if(index<0)index=Math.max(0,tracks.findIndex(t=>!/(click|klikk|clix|metronom)/i.test(t.name)));const selected=tracks[index],key=JSON.stringify(tracks.map(t=>[t.id,t.name]));
   if(key!==trackKey){trackKey=key;$('performanceWaveTrack').innerHTML=tracks.map(t=>'<option value="'+esc(t.id)+'">'+esc(t.name)+'</option>').join('')}$('performanceWaveTrack').value=selected?.id||'';
   const enabled=opts().waveformVisible===true&&!buttonsOnly();$('performanceWaveTrack').classList.toggle('hidden',!enabled||!tracks.length);$('performanceWaveToggle').setAttribute('aria-pressed',String(enabled));$('performanceTimeline').classList.toggle('has-waveform',enabled);$('performanceWaveGraphic').classList.toggle('hidden',!enabled);
   const buffer=ready()?player.buffers[index]:null;
   if(buffer!==waveBuffer){waveToken++;waveBuffer=buffer;waveData=null;$('performanceWaveGraphic').innerHTML='';$('performanceWaveState').textContent=''}
   refreshSections(enabled);if(!enabled||!buffer||waveData)return;
   const token=waveToken;waveData='pending';$('performanceWaveState').textContent='Reading waveform…';
   peaks(buffer,600,()=>token!==waveToken).then(values=>{if(token!==waveToken)return;waveData=values||'unavailable';$('performanceWaveState').textContent=values?'':'Waveform is unavailable.';if(values)$('performanceWaveGraphic').innerHTML='<svg viewBox="0 0 1000 100" preserveAspectRatio="none" role="img" aria-label="Waveform '+esc(selected.name)+'"><path d="'+wavePath(values)+'"/></svg>'}).catch(error=>{if(token===waveToken){waveData='unavailable';$('performanceWaveState').textContent='Could not draw the waveform.'}})
  }
  function buttonsOnly(){return opts().controlsButtonsOnly===true||!!$('performanceBar').closest('#mixerControlsDock')}
  function refreshSections(enabled){
   const length=player.duration||(Number(o.song()?.duration)||0)/(root.StageTempo?.ratio(o.song())||1),segments=root.StageLyrics.segments(o.song(),length),key=JSON.stringify([enabled,segments,opts().colors]);if(key===sectionsKey)return;sectionsKey=key;
   $('performanceSections').innerHTML=enabled?segments.map(s=>'<span class="wave-section" title="'+esc(s.label+' · '+root.StageLyrics.time(s.start)+'–'+root.StageLyrics.time(s.end))+'" style="left:'+s.start/length*100+'%;width:'+(s.end-s.start)/length*100+'%;--section-color:'+root.StageLyrics.sectionColor(s.type,opts())+'"><b>'+esc(s.label)+'</b></span>').join(''):'';
  }
  function height(){if(!visible())return 0;return $('performanceBar').closest('#mixerDialog')?undockedHeight:Number($('performanceBar').offsetHeight)||0}
  let viewportKey='';
  function pinToViewport(){
   // iPad Safari's visible viewport can differ from its layout viewport while
   // the browser bars, keyboard or zoom change. Keep the controls at its bottom;
   // document scrollY belongs to the lyrics and must never enter this geometry.
   if($('performanceBar').closest('#mixerDialog'))return;
   const vv=root.visualViewport,h=Number(vv?.height)||Number(root.innerHeight)||0,w=Number(vv?.width)||Number(root.innerWidth)||0;
   if(h<=0||w<=0)return;
   const top=Math.max(0,Number(vv?.offsetTop)||0)+Math.max(0,h-Math.min(h,undockedHeight)),left=Math.max(0,Number(vv?.offsetLeft)||0),key=[top,left,w,h].join(',');
   if(key===viewportKey)return;viewportKey=key;const style=$('performanceHome').style;
   for(const [name,value] of Object.entries({top,left,width:w,height:h}))style.setProperty('--controls-'+name,value+'px');style.setProperty('--controls-bottom','auto')
  }
  function measure(){if(!$('performanceBar').closest('#mixerDialog')&&visible())undockedHeight=Number($('performanceBar').offsetHeight)||0;pinToViewport();document.documentElement.style.setProperty('--performance-space',height()+'px');o.layoutChanged?.()}
  function audioNotice(){
   const status=mixer.readiness(),notice=$('performanceAudioNotice'),button=$('performanceAudioAction');
   notice.classList.toggle('hidden',!status.show);notice.dataset.error=String(!!status.error);
   if($('performanceAudioMessage').textContent!==status.text)$('performanceAudioMessage').textContent=status.text;
   button.classList.toggle('hidden',!status.action);button.dataset.action=status.action||'';button.textContent=status.action==='cancelPrepare'?'CANCEL':status.action==='transposeSettings'?'TRANSPOSE':status.action==='prepare'?'PREPARE AUDIO':status.action==='metronomeSettings'?'TEMPO / CLICK':'AUDIO & FILES'
  }
  function refresh(){
   if(scrub&&(scrub.song!==o.song()||scrub.generation!==player.generation||scrub.serial!==player.seekSerial))clearScrub();
   $('mixerControlsToggle').setAttribute('aria-pressed',String(visible()));
   $('performanceBar').classList.toggle('buttons-only',buttonsOnly());$('performanceBar').classList.toggle('icons-only',opts().controlsIconsOnly===true);$('controlsBtn').setAttribute('aria-pressed',String(visible()));$('performanceControls').classList.toggle('controls-wrap',opts().stageControlsWrap===true);$('performanceBar').classList.toggle('hidden',!visible());document.body.classList.toggle('has-performance-bar',visible());$('performanceSong').textContent=o.song()?.title||'Select a song';$('performanceSong').title=$('performanceSong').textContent;
   const next=$('nextName'),preview=$('performanceNext');preview.textContent=next.textContent;preview.title=next.textContent;preview.setAttribute('style',next.getAttribute('style')||'');$('performanceSeek').disabled=!canSeek()&&!scrub;
   audioNotice();refreshWave(mixer.tracks());position(scrub?.preview??player.currentTime);renderControls();measure()
  }
  function readControlRows(){return Array.from($('performanceControlRows').querySelectorAll('[data-slot]'),(el,i)=>({action:el.value,label:$('performanceControlRows').querySelector('[data-slot-label="'+i+'"]').value}))}
  function drawControlRows(layout,count=Math.max(12,layout.length)){
   count=Math.min(MAX_CONTROLS,count);$('performanceControlRows').innerHTML=Array.from({length:count},(_,i)=>{const c=layout[i]||{action:'none',label:''};return '<label class="control-config-row"><span>'+(i+1)+'</span><select data-slot="'+i+'">'+Object.entries(actions).map(([value,label])=>'<option value="'+value+'"'+(value===c.action?' selected':'')+'>'+esc(label)+'</option>').join('')+'</select><input data-slot-label="'+i+'" maxlength="18" value="'+esc(c.label)+'" placeholder="Optional button label"></label>'}).join('');
   $('performanceControlRows').querySelectorAll('[data-slot]').forEach((el,i)=>el.value=layout[i]?.action||'none');$('performanceControlsAdd').disabled=count>=MAX_CONTROLS
  }
  function openSettings(){
   $('performanceSyncDuration').checked=opts().syncScrollDuration===true;$('performanceAutoScroll').checked=opts().autoScrollOnPlay===true;
   $('performanceButtonsOnly').checked=opts().controlsButtonsOnly===true;$('performanceIconsOnly').checked=opts().controlsIconsOnly===true;$('performanceBarEnabled').checked=opts().stageBarVisible!==false;$('performanceWrapEnabled').checked=opts().stageControlsWrap===true;$('performanceWaveEnabled').checked=opts().waveformVisible===true;$('performanceAllowSeek').checked=opts().allowSeekDuringPlayback!==false;$('performanceSeekStep').value=String(step());
   drawControlRows(controls(opts().stageControls));$('performanceGroupNames').innerHTML=mixer.groupState().names.map((name,i)=>'<label>Group '+(i+1)+'<input data-group-name="'+i+'" maxlength="24" value="'+esc(name)+'"></label>').join('');$('performanceSettingsStatus').textContent='';$('performanceSettings').showModal();if(root.StageLive.drafts?.open('controls',JSON.stringify([controls(opts().stageControls),mixer.groupState().names,opts().controlsButtonsOnly,opts().controlsIconsOnly,opts().stageBarVisible,opts().stageControlsWrap,opts().waveformVisible,opts().allowSeekDuringPlayback,step(),opts().syncScrollDuration,opts().autoScrollOnPlay]),()=>({controls:readControlRows(),flags:Object.fromEntries(['performanceSyncDuration','performanceAutoScroll','performanceButtonsOnly','performanceIconsOnly','performanceBarEnabled','performanceWrapEnabled','performanceWaveEnabled','performanceAllowSeek'].map(id=>[id,$(id).checked])),step:$('performanceSeekStep').value,names:[...$('performanceGroupNames').querySelectorAll('[data-group-name]')].map(el=>el.value)}),value=>{if(!Array.isArray(value.controls)||!Array.isArray(value.names)||value.names.length!==6)throw Error('Invalid draft');drawControlRows(controls(value.controls),Math.max(12,value.controls.length));for(const [id,checked] of Object.entries(value.flags||{}))if($(id)&&id.startsWith('performance'))$(id).checked=checked===true;$('performanceSeekStep').value=value.step;$('performanceGroupNames').querySelectorAll('[data-group-name]').forEach((el,i)=>el.value=value.names[i])},()=>$('performanceSettings').hasAttribute('open')))$('performanceSettingsStatus').textContent='Recovered controls draft. Review and SAVE CONTROLS.';o.activity?.()
  }
  function toggleVisible(){if(scrub)cancelScrub();const saved=setting('stageBarVisible',opts().stageBarVisible===false);o.activity?.();return saved}
  function saveSettings(){
   const previous=o.state().opts,next={...previous,syncScrollDuration:$('performanceSyncDuration').checked,scrollTimingVersion:1,autoScrollOnPlay:$('performanceAutoScroll').checked,stageBarVisible:$('performanceBarEnabled').checked,stageControlsWrap:$('performanceWrapEnabled').checked,controlsButtonsOnly:$('performanceButtonsOnly').checked,controlsIconsOnly:$('performanceIconsOnly').checked,waveformVisible:$('performanceWaveEnabled').checked,allowSeekDuringPlayback:$('performanceAllowSeek').checked,seekStepSeconds:Math.max(1,Math.min(120,Number($('performanceSeekStep').value)||10)),stageControls:controls(Array.from($('performanceControlRows').querySelectorAll('[data-slot]'),(el,i)=>({action:el.value,label:$('performanceControlRows').querySelector('[data-slot-label="'+i+'"]').value}))),muteGroupNames:Array.from($('performanceGroupNames').querySelectorAll('[data-group-name]'),el=>el.value)};
   try{root.StageProject.groupNames({opts:next});o.state().opts=next;if(o.save()===false){o.state().opts=previous;throw Error('Control settings could not be saved.')}mixer.draw();o.settingsChanged?.();root.StageLive.drafts?.clear('controls');$('performanceSettings').close();refresh();o.activity?.()}catch(error){$('performanceSettingsStatus').textContent=error.message}
  }
  $('performanceAudioAction').onclick=()=>act($('performanceAudioAction').dataset.action);
  $('performanceControls').addEventListener('click',e=>{const button=e.target.closest('[data-action]');if(button&&!button.disabled)return act(button.dataset.action)});
  $('performanceSeek').addEventListener('pointerdown',beginScrub);
  $('performanceSeek').addEventListener('input',e=>{const value=Number(e.target.value)||0;if(!scrub)beginScrub();if(!scrub)return;scrub.preview=Math.max(0,Math.min(player.duration,value));e.target.value=String(scrub.preview);position(scrub.preview);o.activity?.()});
  $('performanceSeek').addEventListener('change',commitScrub);
  document.addEventListener('pointerup',()=>{if(scrub)Promise.resolve().then(commitScrub)});document.addEventListener('pointercancel',()=>{if(scrub)cancelScrub()});
  $('performanceWaveToggle').onclick=()=>{const previous=o.state().opts,visible=previous.controlsButtonsOnly===true||previous.waveformVisible!==true;o.state().opts={...previous,waveformVisible:visible,...(visible?{controlsButtonsOnly:false}:{})};if(o.save()===false){o.state().opts=previous;report('The setting could not be saved.')}refresh()};
  $('performanceWaveTrack').onchange=e=>{const song=o.song();if(!song)return;const previous=song.playback;song.playback={...previous,waveformTrackId:e.target.value};if(o.save()===false){song.playback=previous;report('Track selection could not be saved.')}refresh()};
  $('performanceSectionsEdit').onclick=()=>o.openTiming?.();$('performanceConfig').onclick=openSettings;$('performanceSettingsClose').onclick=()=>{root.StageLive.drafts?.clear('controls');$('performanceSettings').close();o.activity?.()};$('performanceSettingsSave').onclick=saveSettings;
  $('performanceControlsReset').onclick=()=>drawControlRows(defaults.map(action=>({action})));
  $('performanceControlsAll').onclick=()=>drawControlRows(Object.keys(actions).filter(action=>action!=='none').map(action=>({action})));
  $('performanceControlsAdd').onclick=()=>{const layout=readControlRows();if(layout.length<MAX_CONTROLS)drawControlRows([...layout,{action:'none',label:''}],layout.length+1)};
  $('performanceSettings').addEventListener('close',()=>o.activity?.());
  const unsubscribe=mixer.subscribe(refresh);if(root.ResizeObserver){const observer=new root.ResizeObserver(measure);observer.observe($('performanceBar'))}
  root.addEventListener('resize',measure,{passive:true});root.addEventListener('scroll',pinToViewport,{passive:true});root.addEventListener('pageshow',measure,{passive:true});
  root.visualViewport?.addEventListener('resize',measure,{passive:true});root.visualViewport?.addEventListener('scroll',pinToViewport,{passive:true});refresh();
  return {refresh,report,openSettings,toggleVisible,suspend:reason=>{suspended.add(reason);refresh()},resume:reason=>{suspended.delete(reason);refresh()},act,isScrubbing:()=>!!scrub,height,cancelScrub,unsubscribe}
 }
 root.StagePerformance={VERSION:'26.32',MAX_CONTROLS,mount,peaks,wavePath,controls,actions};
})(typeof window!=='undefined'?window:globalThis);


// stage-song-tools.js
(function(root){
 'use strict';
 function mount(o){
  const $=id=>document.getElementById(id),L=root.StageLyrics,player=o.mixer.player;let draft=null,cache=null,seeking=false;
  const follower=root.StageReading.createFollower();let followSong=null;
  const length=()=>player.duration>0?player.duration:(Number(o.song()?.duration)||0)/(root.StageTempo?.ratio(o.song())||1);
  function message(text){$('sectionTimingStatus').textContent=text||''}
  function capture(){if(!draft)return;$('sectionTimingRows').querySelectorAll('[data-section-time]').forEach(el=>{draft.starts[Number(el.dataset.sectionTime)]=L.parseTime(el.value)})}
  function current(){if(!draft)return false;if(draft.song!==o.song()||draft.signature!==L.signature(o.song()?.text)){message('The song or sections changed. Close and reopen section sync.');return false}return true}
  function draw(){
   $('sectionTimingRows').innerHTML=draft.list.map((s,i)=>'<div class="section-time-row" style="--section-color:'+L.sectionColor(s.type,o.state().opts)+'"><label><span>'+L.esc(s.label)+'</span><input data-section-time="'+i+'" type="text" inputmode="decimal" placeholder="mm:ss" value="'+L.time(draft.starts[i])+'" aria-label="Start '+L.esc(s.label)+' '+(i+1)+'"></label><button type="button" data-section-now="'+i+'">SET NOW</button><button type="button" data-section-clear="'+i+'" aria-label="Clear start time '+(i+1)+'">×</button></div>').join('');refresh()
  }
  function open(){
   const song=o.song();if(!song)return;const data=L.saved(song);draft={song,list:data.list,starts:data.starts.map(n=>n===null?null:n/root.StageTempo.ratio(song)),signature:L.signature(song.text)};
   $('sectionTimingSong').textContent=song.title;$('sectionTimingHelp').textContent=data.list.length?'Play the song and press SET NOW at each section start, or enter mm:ss / seconds. Set every start time before sections appear in the waveform.':'Add INTRO, VERSE, CHORUS or MELODY sections to your lyrics first. Use the section buttons in the lyrics editor.';
   message(data.stale?'The lyric sections changed. Set their start times again.':'');draw();$('sectionTimingDialog').showModal();if(root.StageLive.drafts?.open('timing',JSON.stringify([song.title,draft.signature,draft.starts,root.StageTempo.ratio(song)]),()=>[...$('sectionTimingRows').querySelectorAll('[data-section-time]')].map(el=>el.value),values=>{const inputs=$('sectionTimingRows').querySelectorAll('[data-section-time]');if(!Array.isArray(values)||values.length!==inputs.length||values.some(v=>typeof v!=='string'))throw Error('Invalid draft');inputs.forEach((el,i)=>el.value=values[i])},()=>!!draft&&$('sectionTimingDialog').hasAttribute('open')))message('Recovered section timing draft. Review and SAVE.');o.activity?.()
  }
  function refresh(){
   if(!draft)return;const valid=current(),running=player.playing||!!player.seekResume,total=length();
   $('sectionTimingPlay').textContent=running?'PAUSE':'PLAY';$('sectionTimingPlay').disabled=!valid||$('audioPlay').disabled;$('sectionTimingStop').disabled=!valid||!player.buffers.length;
   $('sectionTimingPosition').textContent=L.time(player.currentTime)+' / '+L.time(total);$('sectionTimingSeek').max=String(total||1);if(!seeking)$('sectionTimingSeek').value=String(player.currentTime);$('sectionTimingSeek').disabled=!valid||o.mixer.busy()||!player.buffers.length;
   $('sectionTimingSave').disabled=!valid||!draft.list.length||o.mixer.busy();$('sectionTimingRows').querySelectorAll('input,button').forEach(el=>{el.disabled=!valid||(el.hasAttribute('data-section-now')&&(!total||o.mixer.busy()))});
  }
  $('sectionTimingRows').addEventListener('click',e=>{const now=e.target.closest('[data-section-now]'),clear=e.target.closest('[data-section-clear]');if(!(now||clear)||!current())return;try{capture();const index=Number((now||clear).dataset[now?'sectionNow':'sectionClear']);draft.starts[index]=now?Math.round(player.currentTime*100)/100:null;message('');draw()}catch(error){message(error.message)}});
  $('sectionTimingSave').onclick=()=>{if(!current()||o.mixer.busy())return;try{capture();L.validateStarts(draft.starts,length());const song=draft.song,previous=song.sectionTiming,next={version:1,signature:draft.signature,starts:draft.starts.map(n=>n===null?null:n*root.StageTempo.ratio(song))};L.validateSaved(next);song.sectionTiming=next;if(o.save()===false){if(previous===undefined)delete song.sectionTiming;else song.sectionTiming=previous;throw Error('Section timing could not be saved.')}cache=null;root.StageLive.drafts?.clear('timing');$('sectionTimingDialog').close();draft=null;o.changed?.();o.activity?.()}catch(error){message(error.message)}};
  $('sectionTimingClose').onclick=$('sectionTimingCancel').onclick=()=>{root.StageLive.drafts?.clear('timing');$('sectionTimingDialog').close();draft=null;seeking=false;o.activity?.()};$('sectionTimingDialog').addEventListener('close',()=>{draft=null;seeking=false;o.activity?.()});
  $('sectionTimingPlay').onclick=()=>o.mixer.playPause();$('sectionTimingStop').onclick=()=>o.mixer.stop();$('sectionTimingSeek').addEventListener('pointerdown',()=>seeking=true);$('sectionTimingSeek').addEventListener('input',()=>seeking=true);$('sectionTimingSeek').onchange=async e=>{const value=Number(e.target.value);seeking=false;if(current())await o.mixer.seek(value);refresh()};document.addEventListener('pointercancel',()=>{seeking=false;refresh()});
  o.mixer.subscribe(refresh);
  function geometry(total,bounds){
   const song=o.song(),segments=L.segments(song,total),viewport=o.viewport(),maxScroll=Number.isFinite(bounds.max)?bounds.max:bounds.bottom;
   const key=JSON.stringify([song?.text,song?.sectionTiming,total,viewport,maxScroll,o.state().opts.font,o.state().opts.page,o.state().opts.hideChords,root.innerWidth,root.innerHeight,$('song').offsetHeight,$('song').offsetWidth,Math.round(($('song').getBoundingClientRect().top+root.scrollY-(o.readingOffset?.()||0))*10)/10]);
   if(cache?.key!==key){
    const rows=[...$('song').querySelectorAll('.lyric-line')],plans=[];let index=-1;
    for(const row of rows){if(row.hasAttribute('data-section-index')){index=Number(row.dataset.sectionIndex);const s=segments.find(s=>s.index===index);if(s)plans.push({...s,top:Infinity,bottom:-Infinity})}
     const section=plans[plans.length-1];if(!section||section.index!==index||row.classList.contains('blank-line'))continue;
     const rects=row.getClientRects?[...row.getClientRects()]:[row.getBoundingClientRect()];
     for(const rect of rects){const top=Number(rect.top)+root.scrollY-(o.readingOffset?.()||0),bottom=Number.isFinite(rect.bottom)?rect.bottom+root.scrollY-(o.readingOffset?.()||0):top+(Number(rect.height)||Number(row.offsetHeight)||0);if(!Number.isFinite(top)||!(bottom>top))continue;section.top=Math.min(section.top,top);section.bottom=Math.max(section.bottom,bottom)}
    }
    cache={key,viewport,maxScroll,plans:plans.filter(s=>Number.isFinite(s.top)&&s.bottom>s.top)}
   }return cache
  }
  function scrollPosition(at,total,bounds){
   const map=geometry(total,bounds);if(!map.plans.length)return bounds.top+bounds.travel*Math.min(1,Math.max(0,at/total));
   return root.StageReading.continuousPosition(at,map.plans,map.viewport,map.maxScroll)
  }
  function followPosition(at,total,bounds,dt){const target=scrollPosition(at,total,bounds);followSong=o.song();follower.reset(target);return target}
  function resetFollow(value=null){followSong=o.song();follower.reset(value)}
  function scrollTime(y,total,bounds,reference=0){const map=geometry(total,bounds);return map.plans.length?root.StageReading.continuousTime(y,map.plans,map.viewport,map.maxScroll,reference):(bounds.travel?Math.max(0,Math.min(1,(y-bounds.top)/bounds.travel))*total:0)}
  function captureAnchor(){const viewport=o.viewport(),rows=[...$('song').querySelectorAll('.lyric-line')];for(let i=0;i<rows.length;i++){const rect=rows[i].getBoundingClientRect(),bottom=Number.isFinite(rect.bottom)?rect.bottom:rect.top+(rows[i].offsetHeight||0);if(bottom>viewport.top)return {index:i,offset:rect.top-viewport.top}}return null}
  function restoreAnchor(anchor){if(!anchor)return;const row=$('song').querySelectorAll('.lyric-line')[anchor.index];if(row)(o.scrollTo||((y)=>root.scrollTo(0,y)))(Math.max(0,row.getBoundingClientRect().top+root.scrollY-(o.readingOffset?.()||0)-o.viewport().top-anchor.offset))}
  return {open,refresh,scrollPosition,followPosition,resetFollow,followSettled:follower.settled,scrollTime,captureAnchor,restoreAnchor}
 }
 root.StageSongTools={VERSION:'26.32',mount};
})(typeof window!=='undefined'?window:globalThis);


// stage-midi.js
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const actions={metronome:'Metronome start / stop',countIn:'Count-in off / 2 / 4 bars',start:'Start playback',stop:'Stop',play:'Play / pause',pause:'Pause',next:'Next song',prev:'Previous song',begin:'Back to start',back:'Seek back',forward:'Seek forward',mute:'Master mute',group1:'Mute group 1',group2:'Mute group 2',group3:'Mute group 3',group4:'Mute group 4',group5:'Mute group 5',group6:'Mute group 6',scroll:'Auto scroll',fontDown:'Smaller text',fontUp:'Larger text',mixer:'Mixer',songVolume:'Song volume (CC pedal)',masterVolume:'Master volume (CC pedal)'};
 function parse(bytes){if(!bytes||bytes.length<2)return null;const [status,number,value]=Array.from(bytes);if(!Number.isInteger(status)||status<128||status>=240||!Number.isInteger(number)||number<0||number>127)return null;const type=({176:'cc',192:'pc',144:'note',128:'off'})[status&240];if(!type)return null;if(type!=='pc'&&(!Number.isInteger(value)||value<0||value>127))return null;return {type,channel:(status&15)+1,number,value:type==='pc'?127:type==='off'?0:value}}
 function bindings(opts){const list=opts?.midiBindings;if(!Array.isArray(list))return [];return list.slice(0,32).filter(b=>b&&actions[b.action]&&['cc','pc','note'].includes(b.type)&&Number.isInteger(b.channel)&&b.channel>=1&&b.channel<=16&&Number.isInteger(b.number)&&b.number>=0&&b.number<=127&&(!/Volume$/.test(b.action)||b.type==='cc')).map(b=>({action:b.action,type:b.type,channel:b.channel,number:b.number}))}
 const same=(a,b)=>a.type===b.type&&a.channel===b.channel&&a.number===b.number;
 function create({state,save,run,status=()=>{},now=()=>Date.now()}){
  let learning=null,last=new Map();
  function store(next){const previous=state().opts.midiBindings;state().opts.midiBindings=next;if(save()===false){state().opts.midiBindings=previous;throw Error('MIDI assignments could not be saved.')}last.clear()}
  function learn(action){if(!actions[action])return;learning=action;status('Press a keyboard key, footswitch or MIDI button…')}
  function cancel(){const wasLearning=learning;learning=null;if(wasLearning)status('MIDI Learn cancelled.')}
  function remove(index){const list=bindings(state().opts);list.splice(index,1);store(list)}
  async function receive(bytes){
   const event=parse(bytes);if(!event)return false;status(event.type.toUpperCase()+' · channel '+event.channel+' · '+(event.type==='pc'?'program '+(event.number+1):'number '+event.number+' · value '+event.value));
   if(learning){if(event.type==='off'||(!/Volume$/.test(learning)&&event.value===0))return false;if(/Volume$/.test(learning)&&event.type!=='cc'){status('Move an expression pedal sending Control Change (CC).');return false}const list=bindings(state().opts),conflict=list.find(b=>same(b,event)&&b.action!==learning);if(conflict){status('Already assigned to '+actions[conflict.action]+'. Remove that assignment first.');return false}const action=learning;store([...list.filter(b=>b.action!==action),{action,type:event.type,channel:event.channel,number:event.number}]);learning=null;status(actions[action]+' assigned.');return true}
   if(event.type==='off')return false;const binding=bindings(state().opts).find(b=>same(b,event));if(!binding)return false;
   if(/Volume$/.test(binding.action)){await run(binding.action,event.value/127);return true}
   if(event.value===0)return false;const key=binding.action,time=now();if(time-(last.get(key)??-Infinity)<180)return false;last.set(key,time);await run(binding.action);return true
  }
  return {learn,cancel,remove,receive,learning:()=>learning,reset:()=>last.clear()}
 }
 function mount(o){
  const $=id=>document.getElementById(id);let access=null,activePorts=[],connecting=false,nativePorts=[];
  const native=()=>root.BenKenNativeMIDI?.connect;
  function message(text){$('midiStatus').textContent=text}
  const controller=create({state:o.state,save:o.save,run:o.run,status:text=>{message(text);drawAssignments()}});
  function label(action){return /^group[1-6]$/.test(action)?'Mute: '+root.StageProject.groupNames(o.state())[Number(action.slice(-1))-1]:actions[action]}
  function drawAssignments(){const list=bindings(o.state().opts);$('midiAssignments').innerHTML=list.length?list.map((b,i)=>'<div class="midi-assignment"><span>'+esc(label(b.action))+'</span><small>'+b.type.toUpperCase()+' · CH '+b.channel+' · '+(b.type==='pc'?'PC '+(b.number+1):b.number)+'</small><button type="button" data-midi-remove="'+i+'" aria-label="Remove '+esc(label(b.action))+'">×</button></div>').join(''):'<p>No MIDI assignments yet.</p>';$('midiLearn').textContent=controller.learning()?'CANCEL LEARN':'LEARN';$('midiAction').disabled=!!controller.learning()}
  function disconnect(){for(const port of activePorts)port.onmidimessage=null;activePorts=[];controller.reset()}
  function attach(){disconnect();if(!access)return;const selected=o.state().opts.midiInputId||'',ports=[...access.inputs.values()].filter(p=>p.state!=='disconnected');$('midiInput').innerHTML='<option value="">All MIDI inputs</option>'+ports.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name||p.id)+'</option>').join('');if(selected&&!ports.some(p=>p.id===selected))$('midiInput').innerHTML+='<option value="'+esc(selected)+'">Selected input (disconnected)</option>';$('midiInput').value=selected;for(const port of ports)if(!selected||port.id===selected){port.onmidimessage=event=>receive(event.data);activePorts.push(port)}message(!ports.length?'No MIDI input found. Connect the interface and press CONNECT.':selected&&!activePorts.length?'The selected MIDI input is disconnected. Choose another input.':activePorts.length+' MIDI input(s) connected.');$('midiConnection').textContent=activePorts.length?'Connected':'Disconnected'}
  async function receive(bytes,source){if(source&&o.state().opts.midiInputId&&String(source)!==o.state().opts.midiInputId)return false;try{return await controller.receive(bytes)}catch(error){message(error.message);return false}finally{drawAssignments()}}
  async function connect(){if(connecting)return;connecting=true;try{Promise.resolve(o.activate?.()).catch(error=>message('Audio activation: '+error.message));if(native()){await root.BenKenNativeMIDI.connect();$('midiConnection').textContent='Native MIDI';message('Native MIDI active. Connect your MIDI interface or pair Bluetooth MIDI in the app.');return}if(!root.navigator.requestMIDIAccess){message('Safari on iPad does not provide Web MIDI. Use the BenKen iPad app with native MIDI support. On Mac, use a browser with Web MIDI, such as Chrome.');return}access=await root.navigator.requestMIDIAccess({sysex:false});access.onstatechange=attach;attach()}catch(error){message('MIDI connection failed: '+error.message)}finally{connecting=false}}
  function nativeSources(ports){nativePorts=Array.isArray(ports)?ports:[];$('midiInput').innerHTML='<option value="">All MIDI inputs</option>'+nativePorts.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('');$('midiInput').value=o.state().opts.midiInputId||'';$('midiConnection').textContent=nativePorts.length+' native MIDI input(s)';controller.reset()}
  function open(){controller.cancel();drawAssignments();$('midiAction').innerHTML=Object.entries(actions).map(([id])=>'<option value="'+id+'">'+esc(label(id))+'</option>').join('');$('midiAction').value='start';$('midiDialog').showModal();if(!access&&!native())message(root.navigator.requestMIDIAccess?'Connect your MIDI interface, then press CONNECT.':'Safari on iPad requires the BenKen app for native MIDI. Web MIDI is available in supported Mac browsers.');o.activity?.()}
  $('midiConnect').onclick=connect;$('midiClose').onclick=()=>{$('midiDialog').close();controller.cancel();o.activity?.()};$('midiDialog').addEventListener('close',()=>controller.cancel());$('midiLearn').onclick=()=>{controller.learning()?controller.cancel():controller.learn($('midiAction').value);drawAssignments()};$('midiAssignments').addEventListener('click',e=>{const b=e.target.closest('[data-midi-remove]');if(b)try{controller.remove(Number(b.dataset.midiRemove));drawAssignments()}catch(error){message(error.message)}});
  $('midiInput').onchange=e=>{const previous=o.state().opts.midiInputId;o.state().opts.midiInputId=e.target.value;if(o.save()===false){o.state().opts.midiInputId=previous;message('MIDI input could not be saved.');return}attach()};
  root.addEventListener('pagehide',()=>{controller.cancel();controller.reset()});document.addEventListener('visibilitychange',()=>controller.reset());
  root.addEventListener('benken-native-midi-sources',e=>nativeSources(e.detail));root.addEventListener('benken-native-midi-error',e=>message(String(e.detail)));$('midiBluetooth').classList.toggle('hidden',!root.BenKenNativeMIDI?.bluetooth);$('midiBluetooth').onclick=()=>root.BenKenNativeMIDI?.bluetooth?.();
  return {open,connect,receive,controller,refresh:()=>{controller.cancel();if(access)attach();else if(native())nativeSources(nativePorts);drawAssignments()}}
 }
 root.StageMIDI={VERSION:'26.32',actions,parse,bindings,create,mount};
})(typeof window!=='undefined'?window:globalThis);

