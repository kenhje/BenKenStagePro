// benken-arrangement.js – section playlist (V26.281, needs Native V27.75 with BenKenMainAudio.arrangementPlan).
// Each section of a song can be Normal, Repeat once, Loop or Skip (saved with the song). The page sends the sections
// with their modes to the native engine when playback starts; the engine itself picks the next section shortly before
// each boundary (no page timing involved, also with the screen locked). Tapping a section either queues it for the
// next boundary (default) or jumps at once; tapping a looping section leaves the loop after the current pass.
(function(root){
 'use strict';
 const MODES=['normal','repeat','loop','skip'];
 const LABELS={normal:'Normal',repeat:'Repeat once',loop:'Loop',skip:'Skip'};
 const app=()=>root.BenKenApp,player=()=>app()?.mixer?.player;
 const state={status:'',statusAt:0};
 const listeners=new Set(),events=[];
 function log(text){events.push(new Date().toISOString().slice(11,23)+' '+text);if(events.length>40)events.shift()}
 function emit(){for(const fn of listeners)try{fn()}catch{}}
 function supported(){const p=player();return !!root.BenKenMainAudio?.arrangementPlan&&p?.native===true&&typeof p.updateArrangement==='function'}
 function opts(){return app()?.state()?.opts||{}}
 function song(){return app()?.song?.()||null}
 function segments(s=song()){const p=player();if(!s||!p)return [];const length=p.duration||(Number(s.duration)||0)/(root.StageTempo?.ratio(s)||1);return length>0?root.StageLyrics.segments(s,length):[]}
 const keyOf=(segment,i)=>i+'|'+String(segment?.label||'').trim().toLowerCase();
 function modes(s){const value=s?.sectionModes;return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
 function modeOf(s,segment,i){const value=modes(s)[keyOf(segment,i)];return MODES.includes(value)?value:'normal'}
 function planOf(s,list=segments(s)){return list.map((x,i)=>[x.start,x.end,modeOf(s,x,i)])}
 function say(text){state.status=text;state.statusAt=Date.now();log('say: '+text);emit()}
 function status(){return Date.now()-state.statusAt<6000?state.status:''}
 function tapMode(){return opts().sectionTapMode==='now'?'now':opts().sectionTapMode==='off'?'off':'end'}
 function arrangedNow(){const p=player();return !!(p?.playing&&p.arranged&&p.arrangementInfo?.range)}
 function current(){const p=player(),info=p?.arrangementInfo;if(!info?.range)return null;let index=info.range.index;if(!Number.isInteger(index))index=segments().findIndex(x=>Math.abs(x.start-info.range.start)<1e-6&&Math.abs(x.end-info.range.end)<1e-6);return index>=0?{index,info}:null}
 function nextAfter(s,list,from){for(let k=from+1;k<list.length;k++)if(modeOf(s,list[k],k)!=='skip')return k;return null}
 function firstFrom(s,list,at){const inside=list.findIndex(x=>x.start<=at+.001&&x.end>at+.001);if(inside>=0&&modeOf(s,list[inside],inside)!=='skip')return inside;if(inside>=0)return nextAfter(s,list,inside);const later=list.findIndex(x=>x.start>at);return later<0?null:modeOf(s,list[later],later)!=='skip'?later:nextAfter(s,list,later)}
 const range=(s,list,i)=>({start:list[i].start,end:list[i].end,key:keyOf(list[i],i),label:list[i].label,index:i,plan:planOf(s,list)});
 // Play from the current position: the playlist starts with the section that contains it (or the next one not skipped).
 function startPlan(s,p){
  if(!supported()||!s||!p){log('startPlan: not supported');return null}const list=segments(s);if(!list.length){log('startPlan: no sections');return null}
  const at=p.position>=p.duration?0:p.position,i=firstFrom(s,list,at);if(i==null){log('startPlan: only skipped sections left');return null}
  const from=list[i].start<=at+.001&&list[i].end>at+.001?at:list[i].start;
  log('startPlan: section '+i+' '+list[i].label+' from '+from.toFixed(2));return {position:from,play:{arranged:true,stopAt:list[i].end,range:range(s,list,i)}};
 }
 function setMode(i,mode){
  const s=song(),list=segments(s),segment=list[i];if(!s||!segment||!MODES.includes(mode))return false;
  const previous=s.sectionModes,next={...modes(s)};if(mode==='normal')delete next[keyOf(segment,i)];else next[keyOf(segment,i)]=mode;
  s.sectionModes=next;if(!Object.keys(next).length)delete s.sectionModes;
  if(app().save()===false){s.sectionModes=previous;return false}
  if(arrangedNow())player().updateArrangement({plan:planOf(s,list),...(mode!=='loop'&&current()?.index===i?{release:false}:{})}).catch(error=>log('plan update failed: '+error.message));
  say(segment.label+': '+LABELS[mode]+'.');return true;
 }
 // Tap on a section (section bar, waveform sections or a lyric heading).
 async function tap(i){
  const s=song(),list=segments(s),segment=list[i],p=player(),mixer=app()?.mixer;if(!segment||!p||!mixer)return false;
  if(tapMode()==='off'){say('Tapping sections is off. Turn it on in Settings → Scrolling & sync.');return false}
  const cur=current();
  if(arrangedNow()&&tapMode()==='end'&&cur){
   try{
    if(i===cur.index&&modeOf(s,list[i],i)==='loop'&&p.arrangementPending<0&&!p.arrangementRelease){await p.updateArrangement({release:true});say('Leaving the '+segment.label+' loop after this pass.');return true}
    if(p.arrangementPending===i){await p.updateArrangement({pending:-1});say('Cancelled. '+(list[cur.index]?.label||'This section')+' continues as planned.');return true}
    await p.updateArrangement({pending:i,release:false});say(segment.label+' plays when '+(list[cur.index]?.label||'this section')+' has finished.');return true;
   }catch(error){log('tap failed: '+error.message);say(error.message);return false}
  }
  if(modeOf(s,segment,i)==='skip')say(segment.label+' is set to Skip. Hold it to change.');
  const moved=await mixer.startAt(segment.start,{stopAt:segment.end,arranged:true,range:range(s,list,i),confirmed:p.playing});
  if(moved)say('Playing '+segment.label+'.');return moved;
 }
 function queuedIndex(){const p=player();return arrangedNow()&&Number.isInteger(p.arrangementPending)&&p.arrangementPending>=0?p.arrangementPending:null}
 function playingIndex(){return current()?.index??null}
 root.StageArrangement={VERSION:'26.281',MODES,LABELS,supported,
  diagnostics:()=>{const p=player(),info=p?.arrangementInfo;return {supported:supported(),tapMode:tapMode(),playing:!!p?.playing,arranged:!!p?.arranged,current:info?.range?{index:info.range.index,label:info.range.label,remaining:+info.remaining.toFixed(2),queued:info.queued.map(r=>r.index)}:null,playlist:(p?._arrangement||[]).map(r=>(r.index??'?')+':'+(r.label||'')),pending:p?.arrangementPending??-1,release:!!p?.arrangementRelease,modes:song()?.sectionModes||null,events:[...events]}},
  modeOf:(i)=>{const s=song(),list=segments(s);return list[i]?modeOf(s,list[i],i):'normal'},setMode,startPlan,tap,status,queuedIndex,playingIndex,releasing:()=>!!player()?.arrangementRelease,tapMode,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn)}};
 root.setInterval(emit,500);
})(window);
