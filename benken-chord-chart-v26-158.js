(function(root){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.replace(/♯/g,'#').replace(/♭/g,'b'),marker=s=>['%','/','N.C.','NC','-'].includes(s.toUpperCase());
function isChord(s){const value=normalize(s);return !!root.StageChords?.spec(value)||/^[A-G](?:#|b)?(?:(?:maj|min|dim|aug|sus|add|alt|omit|no|m|M|Δ|ø|°|\+|-)|[0-9#b()])*(?:\/[A-G](?:#|b)?)?$/.test(value)}
function source(song){return String(song?.chordChart||'').trim()?song.chordChart:fromLyrics(song?.text)}
function settingsMarkup(opts,song){return '<section class="settings-section chord-sheet-settings"><h3>CHORDS LAYOUT</h3><div class="tool-segments"><button type="button" data-chord-view="chart" aria-pressed="'+String(opts.chordView!=='positions')+'">Chord sheet</button><button type="button" data-chord-view="positions" aria-pressed="'+String(opts.chordView==='positions')+'">Lyric positions</button></div><label>Bars per row<select id="chartBarsPerRow">'+[2,4,8].map(n=>'<option value="'+n+'"'+(Number(opts.chartBarsPerRow||4)===n?' selected':'')+'>'+n+'</option>').join('')+'</select></label><label class="menu-toggle-row">Follow synced bars<input type="checkbox" id="chartFollow" '+(opts.chartFollow!==false?'checked':'')+'></label><p class="foot">Uses song BPM, beats per bar from Tempo &amp; metronome, and exact synced section starts or REAPER regions. Match section names and write | bars in played order. Estimated timing and written repeat signs do not create extra playback bars.</p><p class="foot">A saved chart is used first. Otherwise the song’s existing chords and sections are shown. Edit chord chart can generate an editable suggestion from the lyrics. Listen and correct its suggested chord changes.</p></section>'}
function chordHTML(value){
 const m=String(value).match(/^([A-G](?:#|b)?)(.*?)(?:\/([A-G](?:#|b)?))?$/);if(!m)return esc(value);
 const minor=m[2].match(/^(m(?!aj)|min)(.*)$/),base=minor?'m':'',quality=minor?minor[2]:m[2];
 return '<span class="chart-root">'+esc(m[1])+base+'</span>'+(quality?'<sup class="chart-quality">'+esc(quality)+'</sup>':'')+(m[3]?'<span class="chart-bass">/'+esc(m[3])+'</span>':'');
}
function chartHeading(line){return root.StageLyrics?.header(line)||(/^coda(?:\s+\d+)?$/i.test(line.trim())?{label:line.trim(),type:'outro'}:null)}
function parse(text){
 const blocks=[],errors=[];let count=0,chordCount=0;
 String(text||'').split(/\r?\n/).forEach((raw,i)=>{
  const line=raw.trim().replace(/[│┃]/g,'|');if(!line)return;
  const h=chartHeading(line);if(h){blocks.push({kind:'heading',label:h.label,type:h.type});return}
  if(/^\{\s*(?:end_of_\w+|eo[cvb]|title|t|artist|a|key)\b[^}]*\}$/i.test(line))return;
  if(!line.includes('|')){const tokens=line.replace(/\[([^\]]+)\]/g,'$1').split(/\s+/).filter(Boolean);if(tokens.length&&tokens.every(t=>isChord(t)||marker(t))){blocks.push({kind:'chords',chords:tokens});chordCount+=tokens.length}else blocks.push({kind:'note',text:line});return}
  const parts=line.split('|');if(!parts[0].trim())parts.shift();if(parts.length&&!parts[parts.length-1].trim())parts.pop();
  const bars=parts.map(part=>{let value=part.trim(),start=value.startsWith(':'),end=value.endsWith(':');if(start)value=value.slice(1).trim();if(end)value=value.slice(0,-1).trim();const bar=value.replace(/\[([^\]]+)\]/g,'$1').split(/\s+/).filter(Boolean);if(start)bar.repeatStart=true;if(end)bar.repeatEnd=true;return bar});
  for(const bar of bars)for(const token of bar)if(!isChord(token)&&!marker(token))errors.push('Line '+(i+1)+': “'+token+'” is not a supported chord. Put notes on a separate line.');
  if(bars.length){blocks.push({kind:'bars',bars});count+=bars.length;chordCount+=bars.flat().length}
 });return {blocks,errors,count,chordCount};
}
// Copy known musical information only. Lyric positions do not imply bar timing.
function fromLyrics(text){
 const out=[];
 for(const raw of String(text||'').split(/\r?\n/)){
  const line=raw.trim(),heading=chartHeading(line);
  if(heading){if(out.length&&out[out.length-1]!=='')out.push('');out.push(root.StageLyrics.header(heading.label)?heading.label:'{section: '+heading.label+'}');continue}
  if(!line||/^\{[^{}]*\}$/.test(line))continue;
  const parsed=parse(line);
  if(parsed.blocks.length===1&&parsed.blocks[0].kind==='bars'&&!parsed.errors.length){out.push(line);continue}
  const marks=root.StageLyrics?.inline(raw).marks||[];
  if(marks.length){out.push(marks.map(m=>m.chord).join('  '));continue}
  if(parsed.blocks.length===1&&parsed.blocks[0].kind==='chords')out.push(parsed.blocks[0].chords.join('  '));
 }
 return out.join('\n').trim();
}
// These are deliberately suggestions: written chord positions do not establish musical time.
function generate(song,length=0,{barsPerRow=4}={}){
 const seed=fromLyrics(song?.text),parsed=parse(seed),groups=[];let group={heading:null,blocks:[]};groups.push(group);
 for(const block of parsed.blocks){if(block.kind==='heading'){group={heading:block,blocks:[]};groups.push(group)}else group.blocks.push(block)}
 const timing=plan({...song,chordChart:seed},length),rowSize=[2,4,8].includes(Number(barsPerRow))?Number(barsPerRow):4;
 const result={text:'',bars:0,timed:0,fallback:0,explicit:0,empty:0,partial:0,error:''},output=[];let section=-1;
 const barText=bar=>(bar.repeatStart?': ':'')+bar.join(' ')+(bar.repeatEnd?' :':'');
 function addBars(bars){result.bars+=bars.length;if(result.bars>4096){result.error='The suggested chart is too long. Check the song timing and tempo.';return}for(let i=0;i<bars.length;i+=rowSize)output.push('| '+bars.slice(i,i+rowSize).map(barText).join(' | ')+' |')}
 function beatsIn(segment){
  if(!segment||segment.start===null)return null;let bpm=(timing.tempoMap||[]).filter(p=>p.time<=segment.start).at(-1)?.bpm||timing.bpm,cursor=segment.start,beats=0;if(!bpm)return null;
  for(const point of timing.tempoMap||[]){if(point.time<=segment.start)continue;if(point.time>=segment.end)break;beats+=(point.time-cursor)*bpm/60;cursor=point.time;bpm=point.bpm}return beats+(segment.end-cursor)*bpm/60;
 }
 for(const group of groups){
  if(group.heading){section++;if(output.length)output.push('');const h=group.heading;output.push(root.StageLyrics?.header(h.label)?h.label:'{section: '+h.label+'}')}
  const lines=group.blocks.filter(b=>b.kind==='chords').map(b=>b.chords),explicit=group.blocks.some(b=>b.kind==='bars');
  if(!group.heading&&!lines.length&&!explicit)continue;
  if(explicit){result.explicit++;for(const block of group.blocks){if(block.kind==='bars')addBars(block.bars);else if(block.kind==='chords'){addBars(block.chords.map(ch=>[ch]));result.fallback++}}continue}
  const segment=timing.groups.find(g=>g.section===section),beats=beatsIn(segment),count=beats===null?null:Math.max(1,Math.ceil((beats-1e-7)/timing.beats));
  if(count!==null&&count>512){result.error='This section would need more than 512 bars. Check its tempo and synced region length.';return result}
  if(count!==null){
   result.timed++;if(Math.abs(beats/timing.beats-Math.round(beats/timing.beats))>1e-5)result.partial++;
   const bars=Array.from({length:count},()=>[]),events=[];
   lines.forEach((chords,line)=>chords.forEach((chord,i)=>events.push({bar:Math.min(count-1,Math.floor((line+i/chords.length)*count/lines.length)),chord})));
   for(const event of events)bars[event.bar].push(event.chord);
   let previous=null;for(const bar of bars){if(bar.length)previous=bar.at(-1);else if(previous)bar.push(previous);else result.empty++}addBars(bars);
  }else if(lines.length){result.fallback++;addBars(lines.flat().map(ch=>[ch]))}
  if(result.bars>4096){result.error='The suggested chart is too long. Check the song timing and tempo.';return result}
 }
 result.text=output.join('\n').trim();if(!result.bars){result.error='No chords or timed sections found. Add chords above the lyrics or in [brackets] first.';return result}
 if(result.text.length>200000)result.error='The suggested chart is too long.';return result;
}
function generationNote(result){
 return 'Suggested chart: '+result.bars+' bars. '+(result.timed?'Synced sections and tempo set the bar count; chords are spread across their lines. ':'')+(result.fallback?'Without section timing, one bar per chord is suggested. ':'')+(result.explicit?'Existing | bars kept. ':'')+(result.empty?result.empty+' empty bars need chords. ':'')+(result.partial?'A partial final bar is included. ':'')+'Listen and correct chord changes before saving.';
}

function chords(text){return [...new Set(parse(text).blocks.flatMap(b=>b.kind==='bars'?b.bars.flat():b.kind==='chords'?b.chords:[]).filter(isChord).map(normalize))]}
function rewrite(text,transpose){return String(text||'').split(/(\r?\n)/).map(line=>!line.includes('|')&&!parse(line).blocks.some(b=>b.kind==='chords')?line:line.replace(/\[([^\]]+)\]|[^\s|]+/g,token=>{const bracket=token.startsWith('[')&&token.endsWith(']'),plain=bracket?token.slice(1,-1):token;return isChord(plain)?(bracket?'[':'')+transpose(normalize(plain))+(bracket?']':''):token})).join('')}
function render(text,{transpose=v=>v,barsPerRow=4,colors={}}={}){
 const chart=parse(text),cols=[2,4,8].includes(Number(barsPerRow))?Number(barsPerRow):4;
 if(!chart.count&&!chart.chordCount)return '<div class="chart-empty"><p>No chord chart for this song yet.</p><button type="button" data-edit-chord-chart>CREATE CHORD CHART</button><p>Write bars such as | G | D/F# | Em7 Cadd9 | C |</p></div>';
 let n=0,section=-1,local=0;return '<div class="chord-chart chart-columns-'+cols+'" style="--chart-columns:'+cols+'" aria-label="Chord chart">'+chart.blocks.map(b=>{
  if(b.kind==='heading'){section++;local=0;const color=colors[b.type];return '<h2 class="chart-section" data-chart-section="'+section+'"'+(/^#[0-9a-f]{6}$/i.test(color||'')?' style="color:'+color+'"':'')+'>'+esc(b.label)+'</h2>'}
  if(b.kind==='chords')return '<div class="chart-chord-sequence" aria-label="Chords without bar lines">'+b.chords.map(ch=>'<span class="chart-chord">'+chordHTML(isChord(ch)?transpose(normalize(ch)):ch)+'</span>').join('')+'</div>';
  if(b.kind==='note')return '<p class="chart-note">'+esc(b.text)+'</p>';
  return '<div class="chart-bars">'+b.bars.map(bar=>'<div class="chart-bar'+(bar.repeatStart?' chart-repeat-start':'')+(bar.repeatEnd?' chart-repeat-end':'')+'" data-chart-section="'+section+'" data-chart-local-bar="'+(local++)+'" data-chart-bar="'+(++n)+'" aria-label="Bar '+n+'"><span class="chart-bar-number">'+n+'</span><div class="chart-bar-chords">'+(bar.map(ch=>'<span class="chart-chord">'+chordHTML(isChord(ch)?transpose(normalize(ch)):ch)+'</span>').join('')||'<span class="chart-rest" aria-label="Empty bar">&nbsp;</span>')+'</div><span class="chart-beat-marker" aria-hidden="true"></span></div>').join('')+'</div>';
 }).join('')+'</div>';
}
const timingCache=new WeakMap();
const labelKey=value=>String(value||'').trim().toLocaleLowerCase().replace(/\s+/g,' ');
function plan(song,length){
 if(!song||!(length>0))return {groups:[],bpm:null,beats:4};
 let click,tempo,bpm,rate;try{click=root.StageClick.settings(song);tempo=root.StageTempo.config(song);rate=root.StageTempo.ratio(song);const known=tempo?.targetBpm||root.StageTempo.metadata(song);bpm=click.followSongBpm?(known||(Number.isFinite(song.playback?.click?.bpm)?click.bpm:null)):(Number.isFinite(song.playback?.click?.bpm)?click.bpm:null)}catch{return {groups:[],bpm:null,beats:4}}
 const keys=[song.chordChart,song.text,song.sectionTiming,song.reaperSource,length,bpm,click.beatsPerBar,rate],cached=timingCache.get(song);if(cached&&keys.every((v,i)=>v===cached.keys[i]))return cached.value;
 let imported=[],exact=[];try{imported=root.StageReaper.timedRegions(song,length)||[];exact=root.StageLyrics.segments(song,length).filter(s=>!s.estimated).map(s=>{const region=imported.find(r=>r.index>=0&&r.index===s.index);return region?{...s,end:region.end}:s})}catch{}
 const pool=[...exact,...imported].filter(s=>Number.isFinite(s.start)&&Number.isFinite(s.end)&&s.end>s.start),groups=[];let current={section:-1,label:'',bars:[]},section=-1,n=0;
 groups.push(current);for(const block of parse(source(song)).blocks){if(block.kind==='heading'){current={section:++section,label:block.label,bars:[]};groups.push(current)}else if(block.kind==='bars')for(const bar of block.bars)current.bars.push(++n)}
 let previous=-1;const timed=groups.filter(g=>g.label||g.bars.length).map(group=>{const candidates=pool.filter(s=>s.start>previous+1e-7&&labelKey(s.label)===labelKey(group.label)),segment=candidates.sort((a,b)=>a.start-b.start)[0]||(!group.label&&groups.length===1&&pool.length===1?pool[0]:null);if(!segment)return {...group,start:null,end:null};previous=segment.start;return {...group,start:segment.start,end:segment.end}});
 const tempoMap=click.followSongBpm&&imported.length?(song.reaperSource.tempoMap||[]).filter(p=>Number.isFinite(p.time)&&Number.isFinite(p.bpm)&&p.bpm>=20&&p.bpm<=300).map(p=>({time:p.time/rate,bpm:p.bpm*rate})).sort((a,b)=>a.time-b.time):[];
 const value={groups:timed,bpm:bpm||(tempoMap[0]?.time===0?tempoMap[0].bpm:null),beats:click.beatsPerBar,tempoMap};timingCache.set(song,{keys,value});return value;
}
function active(song,at,length){
 if(!Number.isFinite(at)||at<0||at>=length)return null;const timing=plan(song,length),group=timing.groups.find(g=>g.start!==null&&at>=g.start&&at<g.end);if(!group)return null;
 let currentBpm=(timing.tempoMap||[]).filter(p=>p.time<=group.start).at(-1)?.bpm||timing.bpm,position=currentBpm?0:null,cursor=group.start;for(const point of timing.tempoMap||[]){if(point.time<=group.start)continue;if(point.time>at)break;if(position!==null)position+=(point.time-cursor)*currentBpm/60;cursor=point.time;currentBpm=point.bpm}if(position!==null)position+=(at-cursor)*currentBpm/60;const index=position===null?null:Math.floor((position+1e-7)/timing.beats),bar=index===null?null:group.bars[index]??null;
 return {section:group.section,label:group.label,bar,beat:position===null?0:Math.floor(position+1e-7)%timing.beats,beats:timing.beats,bpm:currentBpm};
}
// Written ranges are kept separate from the saved song; playback never moves the typing caret.
function barRanges(text){
 const ranges=[];let offset=0;
 for(const raw of String(text||'').split(/(?<=\n)/)){
  const line=raw.replace(/\r?\n$/,''),parsed=parse(line);
  if(parsed.blocks[0]?.kind==='bars'){
   const parts=line.replace(/[│┃]/g,'|').split('|');let at=0;
   parts.forEach((part,i)=>{const first=i===0,last=i===parts.length-1;if(!(first&&!part.trim())&&!(last&&!part.trim())){const left=part.search(/\S|$/),right=part.trimEnd().length;ranges.push({start:offset+at+left,end:offset+at+Math.max(left,right)})}at+=part.length+1});
  }
  offset+=raw.length;
 }
 return ranges;
}
// Inverse of the same beat integration used by active(), including imported tempo changes.
function barTime(song,bar,length){
 const timing=plan(song,length),group=timing.groups.find(g=>g.bars.includes(Number(bar)));if(!group||group.start===null)return null;
 let bpm=(timing.tempoMap||[]).filter(p=>p.time<=group.start).at(-1)?.bpm||timing.bpm;if(!bpm)return null;
 let remaining=group.bars.indexOf(Number(bar))*timing.beats,cursor=group.start;
 for(const point of timing.tempoMap||[]){if(point.time<=group.start)continue;if(point.time>=group.end)break;const beats=(point.time-cursor)*bpm/60;if(remaining<beats-1e-7)return cursor+remaining*60/bpm;remaining-=beats;cursor=point.time;bpm=point.bpm}
 const time=cursor+remaining*60/bpm;return time<group.end-1e-7?time:null;
}

const followCache=new WeakMap();
function follow(container,song,at,length,{enabled=true,counting=false}={}){
 if(!container)return;const state=enabled&&!counting&&container.querySelector('.chord-chart')?active(song,at,length):null,key=state?JSON.stringify(state):'',previous=followCache.get(container);
 if(previous?.key===key&&(!previous.bar||previous.bar.isConnected)&&(!previous.heading||previous.heading.isConnected))return state;
 for(const node of container.querySelectorAll('.chart-current,.chart-current-section')){node.classList.remove('chart-current','chart-current-section');node.removeAttribute('aria-current')}
 const bar=state?.bar!=null?container.querySelector('[data-chart-bar="'+state.bar+'"]'):null,heading=state?container.querySelector('.chart-section[data-chart-section="'+state.section+'"]'):null;
 if(bar){bar.classList.add('chart-current');bar.setAttribute('aria-current','step');bar.style.setProperty('--chart-beat',state.beat);bar.style.setProperty('--chart-beats',state.beats)}
 heading?.classList.add('chart-current-section');followCache.set(container,{key,bar,heading});return state;
}
function fit(scope=root.document){
 const charts=scope.matches?.('.chord-chart')?[scope]:scope.querySelectorAll?.('.chord-chart')||[];
 for(const chart of charts){const width=chart.clientWidth;if(!(width>0))continue;const font=parseFloat(root.getComputedStyle(chart).fontSize)||22,requested=Number(chart.style.getPropertyValue('--chart-columns'))||4,longest=[...chart.querySelectorAll('.chart-chord')].reduce((n,node)=>Math.max(n,node.textContent.length),1),minimum=font*1.25*Math.max(3.6,longest*.58+1),limit=Math.max(1,Math.floor(width/minimum)),cols=[8,4,2,1].find(n=>n<=requested&&n<=limit)||1;if(chart.style.getPropertyValue('--chart-effective-columns')!==String(cols))chart.style.setProperty('--chart-effective-columns',String(cols));for(const chord of chart.querySelectorAll('.chart-chord')){chord.style.removeProperty('font-size');const cell=chord.closest('.chart-bar-chords,.chart-chord-sequence'),room=(cell?.clientWidth||width)-4,natural=chord.getBoundingClientRect().width;if(natural>room&&room>0)chord.style.fontSize=(parseFloat(root.getComputedStyle(chord).fontSize)*room/natural)+'px'}}
}

let controller=null;
function mount(o){
 const doc=root.document,$=id=>doc.getElementById(id);let session=null;
 const dialog=doc.createElement('dialog');dialog.id='chordChartEditor';dialog.className='lyrics-editor hidden';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Edit chord chart');
 dialog.innerHTML='<div class="lyrics-editor-box"><div class="lyrics-edit-heading"><h3 id="chartEditorTitle">EDIT CHORD CHART</h3><div class="lyrics-edit-actions"><button id="chartEditorCancel" type="button">CANCEL</button><button id="chartEditorSave" type="button">SAVE</button></div></div><div class="tool-segments chart-editor-tabs" role="tablist" aria-label="Chord chart editor"><button id="chartWriteTab" type="button" role="tab" aria-selected="true">WRITE</button><button id="chartListenTab" type="button" role="tab" aria-selected="false">LISTEN &amp; EDIT</button><button id="chartPreviewTab" type="button" role="tab" aria-selected="false">PREVIEW</button></div><section class="chart-audio" aria-label="Listen while editing"><div class="chart-audio-buttons"><button id="chartAudioPlay" type="button">PLAY</button><button id="chartAudioStop" type="button">STOP</button><button id="chartAudioBack" type="button" aria-label="Back five seconds">−5s</button><button id="chartAudioForward" type="button" aria-label="Forward five seconds">+5s</button><button id="chartAudioPrepare" class="hidden" type="button">PREPARE AUDIO</button><output id="chartAudioTime">0:00 / 0:00</output></div><input id="chartAudioSeek" type="range" min="0" max="1" step="0.1" value="0" aria-label="Song playback position"><p id="chartAudioStatus" role="status"></p><div class="chart-playback-position"><span id="chartPlaybackPosition" role="status"></span><div><button id="chartEditCurrent" type="button">EDIT CURRENT BAR</button><button id="chartPlaySelected" type="button">PLAY SELECTED BAR</button></div></div></section><div id="chartWritingTools"><div class="chart-generation-tools"><button id="chartGenerate" type="button">GENERATE FROM LYRICS</button><button id="chartRestore" type="button" class="hidden">RESTORE PREVIOUS DRAFT</button></div><p id="chartGenerationNote" role="status"></p><p class="chart-editor-help">Put | between bars. Example: | G | D/F# | Em7 Cadd9 | C |<br>Use |: and :| for repeats. Copied chord lines have no bar timing until you add |.</p><details class="chart-quick-tools" open><summary>Chords &amp; sections</summary><div class="chart-used-chords"><span class="quick-label">CHORDS IN THIS SONG</span><div id="chartQuickChords"></div></div><div class="chart-new-chord"><input id="chartNewChord" aria-label="New chord" placeholder="G, Dm7, C/E…" autocomplete="off" autocapitalize="off"><button id="chartAddChord" type="button">+ CHORD</button></div><div class="chart-editor-tools" aria-label="Chord chart shortcuts"><button type="button" data-chart-insert=" | ">+ BAR</button><button type="button" data-chart-insert=" |: ">REPEAT START</button><button type="button" data-chart-insert=" :| ">REPEAT END</button>'+['INTRO','VERSE','PRE-CHORUS','CHORUS','BRIDGE','MELODY','SOLO','CODA','OUTRO'].map(s=>'<button type="button" data-chart-insert="\n'+s+'\n">'+s+'</button>').join('')+'</div></details></div><div id="chartEditorWorkspace"><textarea id="chartEditorText" aria-label="Chord chart" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" placeholder="VERSE 1\n| G | D/F# | Em7 | Cadd9 |\n\nCHORUS\n| G D | Em7 C | G | D |"></textarea><div id="chartEditorPreview" class="hidden" role="region" aria-label="Chord sheet preview"></div></div><p id="chartEditorStatus" role="status" aria-live="polite"></p></div>';
 doc.body.append(dialog);
 function viewport(){if(!session)return;const vv=root.visualViewport;dialog.style.setProperty('--chart-editor-height',(vv?.height||root.innerHeight)+'px');dialog.style.setProperty('--chart-editor-top',(vv?.offsetTop||0)+'px')}
 function close(){if(!session)return;const prev=session;if(prev.startedPlayback&&!prev.wasPlaying&&prev.song===o.song())player?.pause();seeking=false;root.StageLive?.drafts?.clear(prev.draft);session=null;dialog.close();dialog.classList.add('hidden');for(const parent of prev.parents){parent.inert=false;parent.removeAttribute('aria-hidden')}o.resume?.();if(prev.focus?.isConnected)prev.focus.focus({preventScroll:true})}
 function open(fromCreator=false){
  if(o.locked?.()||session)return;const creator=fromCreator?o.creator?.():null,song=creator?null:o.song();if(!creator&&!song)return;
  const saved=creator?creator.text:song.chordChart||'',source=creator?creator.lyrics:song.text,seed=fromLyrics(source),generated=!saved.trim()?generate(creator?{text:source}:song,chartLength(song),{barsPerRow:o.state().opts.chartBarsPerRow}):null,text=saved.trim()?saved:generated&&!generated.error?generated.text:seed,draft=creator?'creatorChordChart':'chordChart';
  const parents=[creator?.element,...doc.querySelectorAll('#settings:not(.hidden),dialog[open]')].filter(Boolean);
  session={song,creator,parents,previousDraft:generated&&!generated.error?seed:null,previewSong:{},startedPlayback:false,wasPlaying:!!(player?.playing||player?.seekResume),focus:doc.activeElement,draft,sourceChords:chords(fromLyrics(source))};o.suspend?.();
  $('chartEditorTitle').textContent='EDIT CHORD CHART — '+(creator?creator.title||'NEW SONG':song.title);$('chartEditorText').value=text;$('chartEditorStatus').textContent='';$('chartGenerationNote').textContent=generated&&!generated.error?generationNote(generated):'';$('chartRestore').classList.toggle('hidden',session.previousDraft===null);dialog.classList.remove('hidden');dialog.showModal();
  for(const parent of parents){parent.inert=true;parent.setAttribute('aria-hidden','true')}
  viewport();root.StageLive?.drafts?.open(draft,JSON.stringify([creator?.session,song?.title,text]),()=>$('chartEditorText').value,v=>{if(typeof v!=='string')throw Error('Invalid chart draft');$('chartEditorText').value=v},()=>!!session);$('chartNewChord').value='';caret={start:0,end:0};$('chartEditorText').setSelectionRange(0,0);refreshEditor();showPreview(creator?'write':'listen');dialog.querySelector('.chart-quick-tools').open=!!creator;refreshPlayback();if(creator)$('chartEditorText').focus();else $('chartListenTab').focus();
 }
 $('chartEditorCancel').onclick=close;
 $('chartEditorSave').onclick=()=>{
  if(!session)return;const text=$('chartEditorText').value,parsed=parse(text);
  if(text.length>200000){$('chartEditorStatus').textContent='This chart is too long.';return}
  if(parsed.errors.length||text.trim()&&!parsed.count&&!parsed.chordCount){$('chartEditorStatus').textContent=parsed.errors[0]||'Add chords, for example G D, or bars: | G | D |. Clear the field to remove this chart.';return}
  if(session.creator){if(o.saveCreator(text,session.creator.session)===false){$('chartEditorStatus').textContent='The song draft changed. Reopen the chart editor.';return}}
  else{const song=session.song;if(song!==o.song()){$('chartEditorStatus').textContent='The selected song changed. Reopen the chart editor.';return}const old=song.chordChart;song.chordChart=text;if(o.save()===false){if(old===undefined)delete song.chordChart;else song.chordChart=old;return}}
  close();o.render();refreshControls();
 };
 let caret={start:0,end:0};const editor=$('chartEditorText');
 function chartLength(song){if(!song)return 0;return (!o.mixer?.busy()?Number(o.mixer?.player?.duration):0)||Number(song.duration)/(root.StageTempo?.ratio(song)||1)||0}
 $('chartGenerate').onclick=()=>{
  if(!session)return;const original=session.creator?{text:session.creator.lyrics}:session.song;
  if(!session.creator&&original!==o.song()){$('chartEditorStatus').textContent='The selected song changed. Reopen the chart editor.';return}
  const result=generate(original,session.creator?0:chartLength(original),{barsPerRow:o.state().opts.chartBarsPerRow});
  if(result.error){$('chartEditorStatus').textContent=result.error;return}
  session.previousDraft=editor.value;editor.value=result.text;caret={start:0,end:0};editor.setSelectionRange(0,0);$('chartRestore').classList.remove('hidden');$('chartGenerationNote').textContent=generationNote(result);$('chartEditorStatus').textContent='';refreshEditor();root.StageLive?.drafts?.capture(session.draft);
 };
 $('chartRestore').onclick=()=>{if(!session||session.previousDraft===null)return;editor.value=session.previousDraft;session.previousDraft=null;caret={start:0,end:0};editor.setSelectionRange(0,0);$('chartRestore').classList.add('hidden');$('chartGenerationNote').textContent='Previous draft restored.';refreshEditor();root.StageLive?.drafts?.capture(session.draft)};
 function refreshEditor(){
  const used=[...new Set([...chords(editor.value),...(session?.sourceChords||[])])];
  $('chartQuickChords').innerHTML=used.length?used.map(ch=>'<button type="button" data-chart-chord="'+esc(ch)+'">'+esc(ch)+'</button>').join(''):'<span class="foot">Add a chord below to create a shortcut.</span>';
  const top=preview.scrollTop,parsed=parse(editor.value);preview.innerHTML=parsed.count||parsed.chordCount?render(editor.value,{transpose:ch=>session?.song?root.StageKey.displayChord(ch,session.song):ch,barsPerRow:o.state().opts.chartBarsPerRow||4,colors:o.state().opts.colors}):'<p>Enter chords in Write to preview your sheet.</p>';preview.scrollTop=top;fit(preview);refreshPlayback();
 }
 function showPreview(mode){
  editMode=mode===true?'preview':mode===false?'write':mode;dialog.dataset.mode=editMode;
  for(const [id,value]of [['chartWriteTab','write'],['chartPreviewTab','preview'],['chartListenTab','listen']])$(id).setAttribute('aria-selected',String(editMode===value));
  $('chartWritingTools').classList.toggle('hidden',editMode==='preview');editor.classList.toggle('hidden',editMode==='preview');preview.classList.toggle('hidden',editMode==='write');fit(preview);refreshPlayback();
 }
 $('chartWriteTab').onclick=()=>{showPreview('write');editor.focus()};$('chartPreviewTab').onclick=()=>showPreview('preview');$('chartListenTab').onclick=()=>showPreview('listen');
 for(const type of ['select','keyup','click','input'])editor.addEventListener(type,()=>{caret={start:editor.selectionStart,end:editor.selectionEnd};if(type==='input')refreshEditor();else refreshPlayback()});
 function insert(value){
  const start=Math.max(0,Math.min(caret.start,editor.value.length)),end=Math.max(start,Math.min(caret.end,editor.value.length));editor.setRangeText(value,start,end,'end');caret={start:editor.selectionStart,end:editor.selectionEnd};editor.focus();editor.dispatchEvent(new Event('input',{bubbles:true}));
 }
 function insertChord(chord){
  const value=normalize(chord.trim());if(!isChord(value)){$('chartEditorStatus').textContent='Enter a chord such as G, Dm7 or C/E.';return}
  const start=Math.min(caret.start,editor.value.length),end=Math.min(caret.end,editor.value.length),before=editor.value[start-1],after=editor.value[end];
  insert((before&&!/[\s|:]/.test(before)?' ':'')+value+' ');$('chartEditorStatus').textContent='';
 }
 $('chartAddChord').onclick=()=>insertChord($('chartNewChord').value);$('chartNewChord').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();insertChord(e.target.value)}});
 dialog.addEventListener('click',e=>{const chord=e.target.closest('[data-chart-chord]');if(chord){insertChord(chord.dataset.chartChord);return}const button=e.target.closest('[data-chart-insert]');if(button)insert(button.dataset.chartInsert)});
 dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}});
 let editMode='write',seeking=false,transportBusy=false;
 const preview=$('chartEditorPreview'),player=o.mixer?.player;
 const clock=n=>{n=Math.max(0,Math.floor(Number(n)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')};
 function currentSong(){return session&&!session.creator&&session.song===o.song()}
 function draftSong(){if(!currentSong())return null;Object.assign(session.previewSong,session.song,{chordChart:editor.value});return session.previewSong}
 function selectBar(number){
  const range=barRanges(editor.value)[Number(number)-1];if(!range)return;
  if(editMode==='preview')showPreview('listen');editor.focus({preventScroll:true});editor.setSelectionRange(range.start,range.end);caret={...range};
  const line=editor.value.slice(0,range.start).split('\n').length-1,height=parseFloat(root.getComputedStyle(editor).lineHeight)||26;editor.scrollTop=Math.max(0,line*height-editor.clientHeight/3);refreshPlayback();
 }
 function selectedBar(){const ranges=barRanges(editor.value),at=editor.selectionStart;return ranges.findIndex(r=>at>=r.start&&at<=r.end)+1||null}
 function refreshPlayback(){
  if(!session)return;const valid=currentSong(),ready=valid?o.mixer?.readiness():null,length=valid?Number(player?.duration)||0:0,at=valid?Number(player?.currentTime)||0:0,running=valid&&(player?.playing||player?.seekResume),song=draftSong();
  $('chartAudioPlay').textContent=running?'PAUSE':'PLAY';$('chartAudioPlay').disabled=transportBusy||!valid||!ready?.ready;
  $('chartAudioStop').disabled=transportBusy||!valid||!length;
  for(const id of ['chartAudioBack','chartAudioForward','chartAudioSeek'])$(id).disabled=transportBusy||!valid||!length||!ready?.ready;
  $('chartAudioPrepare').classList.toggle('hidden',!valid||ready?.action!=='prepare');$('chartAudioPrepare').disabled=transportBusy;
  const slider=$('chartAudioSeek');if(!seeking){slider.max=String(length||1);slider.value=String(at)}$('chartAudioTime').textContent=clock(seeking?slider.value:at)+' / '+clock(length);
  $('chartAudioStatus').textContent=session.creator?'Save the song with audio to listen here.':!valid?'The selected song changed. Close and reopen this editor.':ready?.text||'';
  const state=follow(preview,song,at,length,{enabled:valid,counting:!!player?.countingIn}),selected=selectedBar(),selectedTime=selected&&song?barTime(song,selected,length):null;
  $('chartEditCurrent').disabled=!state?.bar;$('chartPlaySelected').disabled=transportBusy||!ready?.ready||selectedTime===null;
  const position=state?(state.label+' · '+(state.bar?'Bar '+state.bar+' · Beat '+(state.beat+1)+' / '+state.beats:state.bpm?'No chart bar here — add missing | bars.':'Set the song tempo to follow bars.')):valid&&length?'Bar tracking needs matching sections synced to playback or REAPER regions.':'';
  $('chartPlaybackPosition').textContent=player?.countingIn?'Count-in…':position;
  if(running&&state?.bar&&session.followBar!==state.bar&&editMode!=='write'){
   const node=preview.querySelector('[data-chart-bar="'+state.bar+'"]');if(node){const box=node.getBoundingClientRect(),view=preview.getBoundingClientRect();if(box.top<view.top||box.bottom>view.bottom)preview.scrollTop+=box.top-view.top-preview.clientHeight*.25}
  }
  session.followBar=state?.bar??null;
 }
 async function transport(action){
  if(!currentSong()||transportBusy)return;const owner=session;transportBusy=true;const wasRunning=!!(player.playing||player.seekResume);
  try{await action();if(!wasRunning&&(player.playing||player.seekResume)){owner.startedPlayback=true;if(session!==owner&&o.song()===owner.song)player.pause()}}
  catch(error){if(session===owner)$('chartEditorStatus').textContent=error.message||'Playback could not start.'}
  finally{transportBusy=false;refreshPlayback()}
 }
 $('chartAudioPlay').onclick=()=>transport(()=>o.mixer.playPause());$('chartAudioStop').onclick=()=>transport(()=>o.mixer.stop());
 $('chartAudioBack').onclick=()=>transport(()=>o.mixer.seek(Math.max(0,player.currentTime-5)));
 $('chartAudioForward').onclick=()=>transport(()=>o.mixer.seek(Math.min(player.duration,player.currentTime+5)));
 $('chartAudioPrepare').onclick=()=>transport(()=>o.mixer.prepare());
 $('chartAudioSeek').addEventListener('input',()=>{seeking=true;refreshPlayback()});
 $('chartAudioSeek').addEventListener('change',e=>{const at=Number(e.target.value);seeking=false;transport(()=>o.mixer.seek(at))});
 $('chartAudioSeek').addEventListener('pointercancel',()=>{seeking=false;refreshPlayback()});
 $('chartEditCurrent').onclick=()=>{const song=draftSong(),state=song?active(song,player.currentTime,player.duration):null;if(state?.bar)selectBar(state.bar)};
 $('chartPlaySelected').onclick=()=>{const song=draftSong(),bar=selectedBar(),at=bar&&song?barTime(song,bar,player.duration):null;if(at!==null)transport(()=>o.mixer.startAt(at))};
 preview.addEventListener('click',e=>{const bar=e.target.closest('[data-chart-bar]');if(bar)selectBar(bar.dataset.chartBar)});
 o.mixer?.subscribe(refreshPlayback);

 function refreshControls(){const state=o.state().opts,mode=state.readingMode||(state.hideChords?'lyrics':'both');doc.querySelectorAll('[data-chart-reading]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chartReading===mode)));doc.querySelectorAll('[data-chord-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chordView===(state.chordView||'chart'))));if($('chartBarsPerRow'))$('chartBarsPerRow').value=String(state.chartBarsPerRow||4)}
 let demoLoading=false;
 async function addDemo(button){
  const status=$('chartDemoStatus');if(demoLoading||session)return;if(o.locked?.()||player?.playing||o.mixer?.click?.running||o.mixer?.busy()){if(status)status.textContent='Stop playback and wait for audio preparation before adding the demo.';return}
  demoLoading=true;button.disabled=true;if(status)status.textContent='Adding demo and audio…';
  try{const response=await root.fetch('./BenKen_Chord_Chart_Demo.benken');if(!response.ok)throw Error('The chord chart demo could not be downloaded. Try again when online.');const file=await response.blob();if(o.locked?.()||session)throw Error('Close the editor and unlock editing before adding the demo.');const added=await o.mixer.importProject(file);if(!added)throw Error($('mixerStatus')?.textContent||'The demo could not be added.');if(status)status.textContent='Demo added.';o.render();open(false)}catch(error){if(status)status.textContent=error.message}
  finally{demoLoading=false;button.disabled=false}
 }
 doc.addEventListener('click',e=>{
  const demo=e.target.closest('[data-chart-demo]');if(demo){void addDemo(demo);return}
  if(e.target.closest('#creatorEditChart')){open(true);return}
  if(!dialog.contains(e.target)&&e.target.closest('[data-edit-chord-chart],#editChordChart')){open(false);return}
  const reading=e.target.closest('[data-chart-reading]');if(reading){o.setReadingMode(reading.dataset.chartReading);refreshControls();return}
  const style=e.target.closest('[data-chord-view]');if(style){const opts=o.state().opts,old=opts.chordView;opts.chordView=style.dataset.chordView;if(o.save()===false){opts.chordView=old;return}o.render();refreshControls()}
 });
 doc.addEventListener('change',e=>{if(e.target.id!=='chartBarsPerRow')return;const opts=o.state().opts,old=opts.chartBarsPerRow;opts.chartBarsPerRow=Number(e.target.value);if(o.save()===false)opts.chartBarsPerRow=old;o.render();refreshControls()});
 new MutationObserver(refreshControls).observe($('performanceSettings'),{attributes:true,attributeFilter:['open']});
 const resizeCharts=()=>fit(doc);new ResizeObserver(resizeCharts).observe($('song'));new MutationObserver(resizeCharts).observe($('song'),{childList:true});new MutationObserver(resizeCharts).observe($('chartEditorPreview'),{childList:true});root.addEventListener('resize',resizeCharts,{passive:true});resizeCharts();
 for(const event of ['resize','scroll'])root.visualViewport?.addEventListener(event,viewport,{passive:true});root.addEventListener('resize',viewport,{passive:true});refreshControls();controller={open,close,refreshControls,isOpen:()=>!!session};return controller;
}
root.StageChordChart={VERSION:'26.158',parse,fromLyrics,generate,source,settingsMarkup,chords,rewrite,render,plan,active,barTime,barRanges,follow,fit,mount,isOpen:()=>controller?.isOpen()||false,refreshControls:()=>controller?.refreshControls()};
})(typeof window!=='undefined'?window:globalThis);
