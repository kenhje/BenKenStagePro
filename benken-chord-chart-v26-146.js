(function(root){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.replace(/♯/g,'#').replace(/♭/g,'b'),marker=s=>['%','/','N.C.','NC','-'].includes(s.toUpperCase());
function isChord(s){const value=normalize(s);return !!root.StageChords?.spec(value)||/^[A-G](?:#|b)?(?:(?:maj|min|dim|aug|sus|add|alt|omit|no|m|M|Δ|ø|°|\+|-)|[0-9#b()])*(?:\/[A-G](?:#|b)?)?$/.test(value)}
function source(song){return String(song?.chordChart||'').trim()?song.chordChart:fromLyrics(song?.text)}
function settingsMarkup(opts,song){return '<section class="settings-section chord-sheet-settings"><h3>CHORDS LAYOUT</h3><div class="tool-segments"><button type="button" data-chord-view="chart" aria-pressed="'+String(opts.chordView!=='positions')+'">Chord sheet</button><button type="button" data-chord-view="positions" aria-pressed="'+String(opts.chordView==='positions')+'">Lyric positions</button></div><label>Bars per row<select id="chartBarsPerRow">'+[2,4,8].map(n=>'<option value="'+n+'"'+(Number(opts.chartBarsPerRow||4)===n?' selected':'')+'>'+n+'</option>').join('')+'</select></label><p class="foot">A saved chart is used first. Otherwise the song’s existing chords and sections are shown. Add | in Edit chord chart to define bars.</p></section>'}
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
function chords(text){return [...new Set(parse(text).blocks.flatMap(b=>b.kind==='bars'?b.bars.flat():b.kind==='chords'?b.chords:[]).filter(isChord).map(normalize))]}
function rewrite(text,transpose){return String(text||'').split(/(\r?\n)/).map(line=>!line.includes('|')&&!parse(line).blocks.some(b=>b.kind==='chords')?line:line.replace(/\[([^\]]+)\]|[^\s|]+/g,token=>{const bracket=token.startsWith('[')&&token.endsWith(']'),plain=bracket?token.slice(1,-1):token;return isChord(plain)?(bracket?'[':'')+transpose(normalize(plain))+(bracket?']':''):token})).join('')}
function render(text,{transpose=v=>v,barsPerRow=4,colors={}}={}){
 const chart=parse(text),cols=[2,4,8].includes(Number(barsPerRow))?Number(barsPerRow):4;
 if(!chart.count&&!chart.chordCount)return '<div class="chart-empty"><p>No chord chart for this song yet.</p><button type="button" data-edit-chord-chart>CREATE CHORD CHART</button><p>Write bars such as | G | D/F# | Em7 Cadd9 | C |</p></div>';
 let n=0;return '<div class="chord-chart chart-columns-'+cols+'" style="--chart-columns:'+cols+'" aria-label="Chord chart">'+chart.blocks.map(b=>{
  if(b.kind==='heading'){const color=colors[b.type];return '<h2 class="chart-section"'+(/^#[0-9a-f]{6}$/i.test(color||'')?' style="color:'+color+'"':'')+'>'+esc(b.label)+'</h2>'}
  if(b.kind==='chords')return '<div class="chart-chord-sequence" aria-label="Chords without bar lines">'+b.chords.map(ch=>'<span class="chart-chord">'+chordHTML(isChord(ch)?transpose(normalize(ch)):ch)+'</span>').join('')+'</div>';
  if(b.kind==='note')return '<p class="chart-note">'+esc(b.text)+'</p>';
  return '<div class="chart-bars">'+b.bars.map(bar=>'<div class="chart-bar'+(bar.repeatStart?' chart-repeat-start':'')+(bar.repeatEnd?' chart-repeat-end':'')+'" aria-label="Bar '+(++n)+'"><span class="chart-bar-number">'+n+'</span><div class="chart-bar-chords">'+(bar.map(ch=>'<span class="chart-chord">'+chordHTML(isChord(ch)?transpose(normalize(ch)):ch)+'</span>').join('')||'<span class="chart-rest" aria-label="Empty bar">&nbsp;</span>')+'</div></div>').join('')+'</div>';
 }).join('')+'</div>';
}
let controller=null;
function mount(o){
 const doc=root.document,$=id=>doc.getElementById(id);let session=null;
 const dialog=doc.createElement('dialog');dialog.id='chordChartEditor';dialog.className='lyrics-editor hidden';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Edit chord chart');
 dialog.innerHTML='<div class="lyrics-editor-box"><div class="lyrics-edit-heading"><h3 id="chartEditorTitle">EDIT CHORD CHART</h3><div class="lyrics-edit-actions"><button id="chartEditorCancel" type="button">CANCEL</button><button id="chartEditorSave" type="button">SAVE</button></div></div><div class="tool-segments chart-editor-tabs" role="tablist" aria-label="Chord chart editor"><button id="chartWriteTab" type="button" role="tab" aria-selected="true">WRITE</button><button id="chartPreviewTab" type="button" role="tab" aria-selected="false">PREVIEW</button></div><div id="chartWritingTools"><p class="chart-editor-help">Put | between bars. Example: | G | D/F# | Em7 Cadd9 | C |<br>Use |: and :| for repeats. Copied chord lines have no bar timing until you add |.</p><details class="chart-quick-tools" open><summary>Chords &amp; sections</summary><div class="chart-used-chords"><span class="quick-label">CHORDS IN THIS SONG</span><div id="chartQuickChords"></div></div><div class="chart-new-chord"><input id="chartNewChord" aria-label="New chord" placeholder="G, Dm7, C/E…" autocomplete="off" autocapitalize="off"><button id="chartAddChord" type="button">+ CHORD</button></div><div class="chart-editor-tools" aria-label="Chord chart shortcuts"><button type="button" data-chart-insert=" | ">+ BAR</button><button type="button" data-chart-insert=" |: ">REPEAT START</button><button type="button" data-chart-insert=" :| ">REPEAT END</button>'+['INTRO','VERSE','PRE-CHORUS','CHORUS','BRIDGE','MELODY','SOLO','CODA','OUTRO'].map(s=>'<button type="button" data-chart-insert="\n'+s+'\n">'+s+'</button>').join('')+'</div></details></div><textarea id="chartEditorText" aria-label="Chord chart" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" placeholder="VERSE 1\n| G | D/F# | Em7 | Cadd9 |\n\nCHORUS\n| G D | Em7 C | G | D |"></textarea><div id="chartEditorPreview" class="hidden" role="region" aria-label="Chord sheet preview"></div><p id="chartEditorStatus" role="status" aria-live="polite"></p></div>';
 doc.body.append(dialog);
 function viewport(){if(!session)return;const vv=root.visualViewport;dialog.style.setProperty('--chart-editor-height',(vv?.height||root.innerHeight)+'px');dialog.style.setProperty('--chart-editor-top',(vv?.offsetTop||0)+'px')}
 function close(){if(!session)return;const prev=session;root.StageLive?.drafts?.clear(prev.draft);session=null;dialog.close();dialog.classList.add('hidden');for(const parent of prev.parents){parent.inert=false;parent.removeAttribute('aria-hidden')}o.resume?.();if(prev.focus?.isConnected)prev.focus.focus({preventScroll:true})}
 function open(fromCreator=false){
  if(o.locked?.()||session)return;const creator=fromCreator?o.creator?.():null,song=creator?null:o.song();if(!creator&&!song)return;
  const saved=creator?creator.text:song.chordChart||'',source=creator?creator.lyrics:song.text,text=saved.trim()?saved:fromLyrics(source),copied=!saved.trim()&&!!text,draft=creator?'creatorChordChart':'chordChart';
  const parents=[creator?.element,...doc.querySelectorAll('#settings:not(.hidden),dialog[open]')].filter(Boolean);
  session={song,creator,parents,focus:doc.activeElement,draft,sourceChords:chords(fromLyrics(source))};o.suspend?.();
  $('chartEditorTitle').textContent='EDIT CHORD CHART — '+(creator?creator.title||'NEW SONG':song.title);$('chartEditorText').value=text;$('chartEditorStatus').textContent=copied?'Copied sections and chords from the song. Add | where bars begin; no bar lengths have been guessed.':'';dialog.classList.remove('hidden');dialog.showModal();
  for(const parent of parents){parent.inert=true;parent.setAttribute('aria-hidden','true')}
  viewport();root.StageLive?.drafts?.open(draft,JSON.stringify([creator?.session,song?.title,text]),()=>$('chartEditorText').value,v=>{if(typeof v!=='string')throw Error('Invalid chart draft');$('chartEditorText').value=v},()=>!!session);$('chartNewChord').value='';caret={start:0,end:0};$('chartEditorText').setSelectionRange(0,0);refreshEditor();showPreview(false);$('chartEditorText').focus();
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
 function refreshEditor(){
  const used=[...new Set([...chords(editor.value),...(session?.sourceChords||[])])];
  $('chartQuickChords').innerHTML=used.length?used.map(ch=>'<button type="button" data-chart-chord="'+esc(ch)+'">'+esc(ch)+'</button>').join(''):'<span class="foot">Add a chord below to create a shortcut.</span>';
  const parsed=parse(editor.value);$('chartEditorPreview').innerHTML=parsed.count||parsed.chordCount?render(editor.value,{barsPerRow:o.state().opts.chartBarsPerRow||4,colors:o.state().opts.colors}):'<p>Enter chords in Write to preview your sheet.</p>';
 }
 function showPreview(preview){
  $('chartWriteTab').setAttribute('aria-selected',String(!preview));$('chartPreviewTab').setAttribute('aria-selected',String(preview));
  $('chartWritingTools').classList.toggle('hidden',preview);editor.classList.toggle('hidden',preview);$('chartEditorPreview').classList.toggle('hidden',!preview);if(preview)refreshEditor();
 }
 $('chartWriteTab').onclick=()=>{showPreview(false);editor.focus()};$('chartPreviewTab').onclick=()=>showPreview(true);
 for(const type of ['select','keyup','click','input'])editor.addEventListener(type,()=>{caret={start:editor.selectionStart,end:editor.selectionEnd};if(type==='input')refreshEditor()});
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
 function refreshControls(){const state=o.state().opts,mode=state.readingMode||(state.hideChords?'lyrics':'both');doc.querySelectorAll('[data-chart-reading]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chartReading===mode)));doc.querySelectorAll('[data-chord-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chordView===(state.chordView||'chart'))));if($('chartBarsPerRow'))$('chartBarsPerRow').value=String(state.chartBarsPerRow||4)}
 doc.addEventListener('click',e=>{
  if(e.target.closest('#creatorEditChart')){open(true);return}
  if(!dialog.contains(e.target)&&e.target.closest('[data-edit-chord-chart],#editChordChart')){open(false);return}
  const reading=e.target.closest('[data-chart-reading]');if(reading){o.setReadingMode(reading.dataset.chartReading);refreshControls();return}
  const style=e.target.closest('[data-chord-view]');if(style){const opts=o.state().opts,old=opts.chordView;opts.chordView=style.dataset.chordView;if(o.save()===false){opts.chordView=old;return}o.render();refreshControls()}
 });
 doc.addEventListener('change',e=>{if(e.target.id!=='chartBarsPerRow')return;const opts=o.state().opts,old=opts.chartBarsPerRow;opts.chartBarsPerRow=Number(e.target.value);if(o.save()===false)opts.chartBarsPerRow=old;o.render();refreshControls()});
 new MutationObserver(refreshControls).observe($('performanceSettings'),{attributes:true,attributeFilter:['open']});
 for(const event of ['resize','scroll'])root.visualViewport?.addEventListener(event,viewport,{passive:true});root.addEventListener('resize',viewport,{passive:true});refreshControls();controller={open,close,refreshControls,isOpen:()=>!!session};return controller;
}
root.StageChordChart={VERSION:'26.146',parse,fromLyrics,source,settingsMarkup,chords,rewrite,render,mount,isOpen:()=>controller?.isOpen()||false,refreshControls:()=>controller?.refreshControls()};
})(typeof window!=='undefined'?window:globalThis);
