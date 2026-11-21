// BenKen Stage Pro V26.231 — MIDI commands in the lyrics ({midi …}).
// Commands are lines in the song text, so they scroll with the lyrics and are saved with the song.
// While a song plays, each command is sent when playback reaches it: the start of the section it sits in,
// the song start (above the first heading), or an exact @mm:ss. Sending needs Native V27.39 (midiSend) and
// goes to the output chosen under MIDI & pedals → MIDI Clock (looper or other MIDI device).
(function(root){
 'use strict';
 const VERSION='26.231',LOOKAHEAD=0.5;
 const L=()=>root.StageLyrics;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

 // Song time (seconds of playback) for every valid command in the song text. Untimed commands are left out.
 function events(song,length){
  if(!song)return [];const lines=String(song.text||'').split(/\r?\n/),rate=root.StageTempo?.ratio(song)||1;
  const segs=(L().segments(song,length)||[]).filter(s=>Number.isInteger(s.line)&&Number.isFinite(s.start));
  const out=[];let headingSeen=false;
  for(let li=0;li<lines.length;li++){
   if(L().header?.(lines[li]))headingSeen=true;
   const cmd=L().parseMidi(lines[li]);if(!cmd||!cmd.valid)continue;
   let at=null;
   if(cmd.at!=null)at=cmd.at/rate;
   else{let best=null;for(const s of segs)if(s.line<=li&&(!best||s.line>best.line))best=s;if(best)at=best.start;else if(!headingSeen)at=0}
   if(at===null||!(at>=0))continue;
   out.push({key:li+'|'+lines[li].trim(),line:li,time:at,messages:cmd.messages,cmd});
  }
  return out.sort((a,b)=>a.time-b.time||a.line-b.line);
 }
 function editText(text,{line=null,after=null,command='',remove=false}){
  const lines=String(text||'').split(/\r?\n/);
  if(line==null){const at=Math.max(-1,Math.min(lines.length-1,Number(after)));lines.splice(at+1,0,command);return lines.join('\n')}
  if(!Number.isInteger(line)||!L().parseMidi(lines[line]))throw Error('The MIDI command has changed. Close and open the song again.');
  if(remove)lines.splice(line,1);else lines[line]=command;return lines.join('\n');
 }

 function mount(o){
  const doc=root.document,$=id=>doc.getElementById(id);
  const native=()=>root.BenKenMainAudio?.midiSend===true&&!!root.webkit?.messageHandlers?.benkenNativePlayer;
  const post=payload=>root.webkit.messageHandlers.benkenNativePlayer.postMessage(payload);
  let last=null,wasPlaying=false,songRef=null,fired=new Set(),cache={key:'',list:[]},warned=false,lastError='';

  function list(){
   const song=o.song(),length=o.mixer.player.duration||0,rate=root.StageTempo?.ratio(song)||1,key=song?[song.text,length,rate,song.sectionTiming,song.reaperSource?.duration].join('|'):'';
   if(song&&cache.song===song&&cache.key===key)return cache.list;cache={song,key,list:song?events(song,length):[]};return cache.list;
  }
  function send(event){
   if(!native()){if(!warned){warned=true;o.message?.('MIDI commands in the lyrics need the Native engine and Native V27.39 or newer.',true)}return}
   post({command:'midiSend',messages:event.messages,position:event.time}).then(()=>{lastError=''}).catch(error=>{const text=String(error?.message||error);if(text!==lastError){lastError=text;o.message?.('MIDI: '+text,true)}});
  }
  function tick(){
   const p=o.mixer.player,playing=!!(p.playing||p.countingIn);
   if(!playing||o.state().opts.midiCuesEnabled===false){wasPlaying=false;last=null;return}
   const now=Number(p.currentTime)||0,song=o.song();
   if(!wasPlaying||song!==songRef||last===null){wasPlaying=true;songRef=song;fired=new Set();last=now-0.001}
   else if(now<last-0.3||now>last+3){fired=new Set();last=now-0.001} // seek: never replay or catch up skipped commands
   const horizon=now+LOOKAHEAD;
   for(const e of list()){if(e.time>horizon)break;if(e.time>last&&!fired.has(e.key)){fired.add(e.key);send(e)}}
   last=Math.max(last,now);
  }
  root.setInterval(tick,50);o.mixer.subscribe?.(tick);

  // ---------- Editor ----------
  const dialog=doc.createElement('dialog');dialog.id='midiCueDialog';dialog.className='tool-dialog benken-menu-surface midi-cue-dialog';dialog.setAttribute('aria-labelledby','midiCueTitle');
  dialog.innerHTML='<div class="tool-heading"><h2 id="midiCueTitle">ADD MIDI COMMAND</h2><button type="button" id="midiCueInfo" class="midi-cue-info" aria-expanded="false" aria-controls="midiCueHelp" aria-label="How MIDI commands work">i</button></div>'
   +'<div id="midiCueHelp" class="midi-cue-help" hidden>'
   +'<h3>How it works</h3><ol>'
   +'<li><b>Choose the output once:</b> Settings → MIDI &amp; pedals → MIDI Clock → choose your MIDI device or MIDI interface as MIDI output. Commands go to the same output as MIDI Clock, even when the clock itself is off. Use the Native engine (Native V27.39 or newer).</li>'
   +'<li><b>Add a command:</b> press and hold a lyric line → MIDI COMMAND, or use the + MIDI button in the control bar. The command is placed in the lyrics below that line.</li>'
   +'<li><b>When it is sent:</b> <i>At the start of this section</i> sends it when playback reaches the section heading above it. A command above the first heading is sent when the song starts. <i>At a time</i> sends it at an exact point, e.g. 1:32. Sections need REAPER regions or SYNC LYRICS timing.</li>'
   +'<li><b>LEARN:</b> press LEARN, then press the pedal or button on your MIDI device. BenKen fills in the command it receives. Or type the values yourself.</li>'
   +'<li><b>TEST</b> sends the command now, so you can check that the device reacts.</li>'
   +'</ol><h3>Loopers and effects: start and stop loops</h3><p>On the MIDI device, link a CC number (e.g. CC#80) to what it should do, for example record/play, stop or all start/stop. Set the MIDI receive channel on the device to the same channel as here (ch 1 by default). Then add CC 80 with value 127 here.</p><p>Example, BOSS RC-600: MENU → ASSIGN, choose an assign, SOURCE CC#80, TARGET TRACK1 REC/PLAY.</p>'
   +'<p>PC (Program Change) chooses a memory or preset on the device. START and STOP control a looper or sequencer that follows MIDI Clock.</p>'
   +'<h3>Record instead of typing</h3><p>Settings → MIDI &amp; pedals → <b>RECORD MIDI…</b> (or the REC MIDI button): press ARM, then PLAY, and use your pedals. When the song stops, choose quantize (beat or bar) and SAVE TO LYRICS.</p>'
   +'<h3>Typing it in the lyrics</h3><p>You can also type a line in EDIT LYRICS: <code>{midi CC 80 127: Loop 1 REC}</code>, <code>{midi PC 5}</code>, <code>{midi STOP}</code>, <code>{midi @1:32 CC 81 127 ch 2}</code>. Values are 0–127, channel 1–16.</p>'
   +'<p>Starting playback in the middle of a song sends only the commands after that point. Turn sending off under Settings → MIDI &amp; pedals if you only want to see them.</p></div>'
   +'<div class="midi-cue-grid">'
   +'<label>Command<select id="midiCueType"><option value="CC">CC · Control Change</option><option value="PC">PC · Program Change</option><option value="NOTE">Note</option><option value="START">Start (all)</option><option value="STOP">Stop (all)</option><option value="CONTINUE">Continue</option></select></label>'
   +'<label id="midiCueNumberRow"><span id="midiCueNumberLabel">CC number</span><input id="midiCueNumber" type="number" min="0" max="127" inputmode="numeric"></label>'
   +'<label id="midiCueValueRow"><span id="midiCueValueLabel">Value</span><input id="midiCueValue" type="number" min="0" max="127" inputmode="numeric"></label>'
   +'<label id="midiCueChannelRow">Channel<input id="midiCueChannel" type="number" min="1" max="16" inputmode="numeric"></label>'
   +'<label>When<select id="midiCueWhen"><option value="section">At the start of this section</option><option value="time">At a time in the song</option></select></label>'
   +'<label id="midiCueTimeRow">Time (mm:ss)<input id="midiCueTime" type="text" inputmode="decimal" placeholder="1:32"></label>'
   +'<label class="midi-cue-wide">Label (optional)<input id="midiCueLabel" type="text" maxlength="60" placeholder="Loop 1 REC"></label>'
   +'</div><p id="midiCuePreview" class="midi-cue-preview"></p><p id="midiCueStatus" class="midi-cue-status" role="status" aria-live="polite"></p>'
   +'<div class="midi-cue-actions"><button type="button" id="midiCueLearn">LEARN</button><button type="button" id="midiCueTest">TEST</button><button type="button" id="midiCueDelete">DELETE</button><button type="button" id="midiCueCancel">CANCEL</button><button type="button" id="midiCueSave">SAVE</button></div>';
  doc.body.append(dialog);
  let target=null,learnTimer=null,learnRestore=null;

  function read(){
   const type=$('midiCueType').value,n=v=>v===''?NaN:Number(v);
   const cmd={type,number:n($('midiCueNumber').value),value:n($('midiCueValue').value),channel:n($('midiCueChannel').value)||1,label:$('midiCueLabel').value,at:null};
   if($('midiCueWhen').value==='time'){cmd.at=L().midiTime($('midiCueTime').value);if(cmd.at===null)throw Error('Enter the time as mm:ss, for example 1:32.')}
   const ok=v=>Number.isInteger(v)&&v>=0&&v<=127;
   if(['CC','PC','NOTE'].includes(type)){if(!ok(cmd.number))throw Error('Enter a number from 0 to 127.');if(!Number.isInteger(cmd.channel)||cmd.channel<1||cmd.channel>16)throw Error('Channel is 1–16.')}
   if(type==='CC'&&!ok(cmd.value))throw Error('Enter a value from 0 to 127.');
   if(type==='NOTE'&&!(ok(cmd.value)&&cmd.value>0))cmd.value=100;
   const line=L().midiLine(cmd),parsed=L().parseMidi(line);if(!parsed?.valid)throw Error('Check the MIDI command.');return {line,parsed};
  }
  function layout(){
   const type=$('midiCueType').value,hasNumber=['CC','PC','NOTE'].includes(type);
   $('midiCueNumberRow').hidden=!hasNumber;$('midiCueChannelRow').hidden=!hasNumber;$('midiCueValueRow').hidden=!(type==='CC'||type==='NOTE');
   $('midiCueNumberLabel').textContent=type==='PC'?'Program (0–127)':type==='NOTE'?'Note (0–127)':'CC number (0–127)';$('midiCueValueLabel').textContent=type==='NOTE'?'Velocity (1–127)':'Value (0–127)';
   $('midiCueTimeRow').hidden=$('midiCueWhen').value!=='time';
   try{$('midiCuePreview').textContent=read().line}catch(error){$('midiCuePreview').textContent=error.message}
  }
  function fill(cmd){
   $('midiCueType').value=cmd?.type&&['CC','PC','NOTE','START','STOP','CONTINUE'].includes(cmd.type)?cmd.type:'CC';
   $('midiCueNumber').value=cmd?.number??'';$('midiCueValue').value=cmd?.value??(cmd?.type==='NOTE'?100:127);$('midiCueChannel').value=cmd?.channel||o.state().opts.lastMidiCueChannel||1;
   $('midiCueWhen').value=cmd?.at!=null?'time':'section';$('midiCueTime').value=cmd?.at!=null?L().time(cmd.at):'';$('midiCueLabel').value=cmd?.label||'';layout();
  }
  function status(text,error=false){$('midiCueStatus').textContent=text||'';$('midiCueStatus').dataset.error=String(!!error)}
  function open(where){
   if(root.StageConcert?.locked()){alert('LIVE LOCK: unlock editing first.');return}
   const song=o.song();if(!song)return alert('Select a song first.');
   const rows=String(song.text||'').split(/\r?\n/);let cmd=null;
   if(where.line!=null){cmd=L().parseMidi(rows[where.line]);if(!cmd)return}
   target={song,line:where.line??null,after:where.line!=null?null:(where.after??o.readingLine?.()??-1),original:song.text,raw:where.line!=null?rows[where.line]:''};
   $('midiCueTitle').textContent=target.line!=null?'EDIT MIDI COMMAND':'ADD MIDI COMMAND';$('midiCueDelete').hidden=target.line==null;
   fill(cmd);if(cmd&&!cmd.valid)status('This line could not be read: '+target.raw.trim()+'. Choose the command again and SAVE.',true);else status(native()?'':'Sending needs the Native engine and Native V27.39 or newer. You can still add commands.',!native());
   o.suspend?.('midi-cue');dialog.showModal();
  }
  function stopLearn(){if(learnTimer){root.clearTimeout(learnTimer);learnTimer=null}if(learnRestore){learnRestore();learnRestore=null}$('midiCueLearn').setAttribute('aria-pressed','false')}
  function close(){stopLearn();target=null;if(dialog.open)dialog.close();o.resume?.('midi-cue')}
  function save(remove=false){
   const t=target;if(!t)return;const song=o.song();if(t.song!==song||song.text!==t.original){alert('The song changed. Open the command again.');close();return}
   let line='';if(!remove){try{line=read().line}catch(error){status(error.message,true);return}}
   const previous=song.text;try{song.text=editText(previous,{line:t.line,after:t.after,command:line,remove})}catch(error){status(error.message,true);return}
   const ch=Number($('midiCueChannel').value);if(ch>=1&&ch<=16)o.state().opts.lastMidiCueChannel=ch;
   if(o.save()===false){song.text=previous;return}cache={key:'',list:[]};close();o.render();
  }
  $('midiCueInfo').onclick=()=>{const help=$('midiCueHelp'),show=help.hidden;help.hidden=!show;$('midiCueInfo').setAttribute('aria-expanded',String(show))};
  for(const id of ['midiCueType','midiCueWhen'])$(id).onchange=layout;
  for(const id of ['midiCueNumber','midiCueValue','midiCueChannel','midiCueTime','midiCueLabel'])$(id).oninput=layout;
  $('midiCueSave').onclick=()=>save(false);$('midiCueCancel').onclick=close;$('midiCueDelete').onclick=()=>{if(confirm('Delete this MIDI command?'))save(true)};
  dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
  $('midiCueTest').onclick=async()=>{
   let parsed;try{parsed=read().parsed}catch(error){status(error.message,true);return}
   if(!native()){status('TEST needs the Native engine and Native V27.39 or newer.',true);return}
   try{const result=await post({command:'midiSend',messages:parsed.messages});status('Sent to '+(result?.destinationName||'the MIDI Clock output')+'.')}catch(error){status(String(error?.message||error),true)}
  };
  // LEARN: take the next note, CC or program change that arrives from any MIDI input (pedal actions are paused meanwhile).
  $('midiCueLearn').onclick=()=>{
   if(learnRestore){stopLearn();status('LEARN cancelled.');return}
   const previous=root.BenKenReceiveMIDI;
   root.BenKenReceiveMIDI=(bytes,source)=>{
    const b=Array.from(bytes||[]),s=b[0],kind=s&0xF0,ch=(s&0x0F)+1;
    if(kind===0xB0&&b.length>=3)fill({type:'CC',number:b[1],value:b[2],channel:ch,at:currentAt(),label:$('midiCueLabel').value});
    else if(kind===0xC0&&b.length>=2)fill({type:'PC',number:b[1],channel:ch,at:currentAt(),label:$('midiCueLabel').value});
    else if(kind===0x90&&b.length>=3&&b[2]>0)fill({type:'NOTE',number:b[1],value:b[2],channel:ch,at:currentAt(),label:$('midiCueLabel').value});
    else return;
    stopLearn();status('Learned '+L().midiSummary(L().parseMidi(read().line))+'. Press SAVE to add it.');
   };
   learnRestore=()=>{root.BenKenReceiveMIDI=previous};$('midiCueLearn').setAttribute('aria-pressed','true');
   status('LEARN: press the pedal or button on your MIDI device now…');
   learnTimer=root.setTimeout(()=>{stopLearn();status('Nothing received. Check the MIDI cable and that the device sends MIDI, then try again.',true)},15000);
  };
  function currentAt(){return $('midiCueWhen').value==='time'?L().midiTime($('midiCueTime').value):null}

  // ---------- MIDI Record (V26.231) ----------
  // Arm, press PLAY and use the pedals: every CC, PC, Note or Start/Stop that arrives (and is not a BenKen pedal
  // action) is kept with its song time. When the song stops, choose quantize and SAVE TO LYRICS: each command is
  // written as {midi @mm:ss …} under the section heading it belongs to, so it is sent there next time.
  const recDialog=doc.createElement('dialog');recDialog.id='midiRecordDialog';recDialog.className='tool-dialog benken-menu-surface midi-cue-dialog midi-record-dialog';recDialog.setAttribute('aria-labelledby','midiRecordTitle');
  recDialog.innerHTML='<div class="tool-heading"><h2 id="midiRecordTitle">RECORD MIDI</h2><button type="button" id="midiRecordClose">CLOSE</button></div>'
   +'<div id="midiRecordArmView"><p>Press <b>ARM</b>, then <b>PLAY</b> and use your MIDI pedals or controller as you would on stage. BenKen notes every command with its time in the song. Recording stops when the song stops.</p>'
   +'<p class="midi-cue-preview">Pedals that already control BenKen (MIDI &amp; pedals) are not recorded. MIDI commands already in the lyrics are still sent while you record.</p>'
   +'<label class="midi-record-check"><input id="midiRecordThru" type="checkbox"> Also send each command to the MIDI output while recording. Use this when the pedal is connected only to BenKen. Leave it off when the pedal also controls the looper directly.</label>'
   +'<div class="midi-cue-actions"><button type="button" id="midiRecordArm">ARM</button></div></div>'
   +'<div id="midiRecordReview" hidden><p id="midiRecordSummary"></p>'
   +'<div class="midi-cue-grid"><label>Quantize<select id="midiRecordQuantize"><option value="off">Off · exact times</option><option value="half">½ beat</option><option value="beat">Beat</option><option value="bar">Bar</option></select></label>'
   +'<label>Label (optional)<input id="midiRecordLabel" type="text" maxlength="60" placeholder="Loop"></label></div>'
   +'<p id="midiRecordGrid" class="midi-cue-preview"></p><ul id="midiRecordList" class="midi-record-list"></ul>'
   +'<div class="midi-cue-actions"><button type="button" id="midiRecordDiscard">DISCARD</button><button type="button" id="midiRecordAgain">RECORD AGAIN</button><button type="button" id="midiRecordSave">SAVE TO LYRICS</button></div></div>'
   +'<p id="midiRecordStatus" class="midi-cue-status" role="status" aria-live="polite"></p>';
  doc.body.append(recDialog);
  const badge=doc.createElement('button');badge.type='button';badge.id='midiRecordBadge';badge.className='midi-record-badge';badge.hidden=true;doc.body.append(badge);
  let rec=null;
  const recStatus=(text,error=false)=>{$('midiRecordStatus').textContent=text||'';$('midiRecordStatus').dataset.error=String(!!error)};
  function parseIn(bytes){
   const b=Array.from(bytes||[]),s=b[0],kind=s&0xF0,channel=(s&0x0F)+1;
   if(s===0xFA)return {type:'START'};if(s===0xFC)return {type:'STOP'};if(s===0xFB)return {type:'CONTINUE'};
   if(kind===0xB0&&b.length>=3&&b[2]>0)return {type:'CC',number:b[1],value:b[2],channel};
   if(kind===0xC0&&b.length>=2)return {type:'PC',number:b[1],channel};
   if(kind===0x90&&b.length>=3&&b[2]>0)return {type:'NOTE',number:b[1],value:b[2],channel};
   return null;
  }
  function capture(cmd,time,messages){
   const same=rec.events.find(e=>Math.abs(e.time-time)<0.15&&L().midiLine({...e.cmd,at:null})===L().midiLine({...cmd,at:null}));if(same)return;
   rec.events.push({time,cmd,keep:true});drawBadge();
   if(rec.thru&&native())post({command:'midiSend',messages}).catch(()=>{});
  }
  function hook(){
   const previous=root.BenKenReceiveMIDI;
   const wrapped=async(bytes,source)=>{
    const r=rec,p=o.mixer.player,time=Number(p.currentTime)||0,playing=!!p.playing&&!p.countingIn,inputId=o.state().opts.midiInputId;
    let handled=false;try{handled=await previous?.(bytes,source)}catch{}
    if(handled||!r||r!==rec||!r.armed||!playing||o.song()!==r.song)return handled;
    if(source&&inputId&&String(source)!==inputId)return handled;
    const cmd=parseIn(bytes);if(!cmd)return handled;
    const line=L().midiLine(cmd),parsed=L().parseMidi(line);if(!parsed?.valid)return handled;
    r.started=true;capture(cmd,time,parsed.messages);return handled;
   };
   root.BenKenReceiveMIDI=wrapped;return ()=>{if(root.BenKenReceiveMIDI===wrapped)root.BenKenReceiveMIDI=previous};
  }
  function drawBadge(){
   if(!rec?.armed){badge.hidden=true;return}badge.hidden=false;
   badge.textContent=rec.started?'● MIDI REC · '+rec.events.length+' · STOP':'● MIDI REC ARMED · press PLAY';
   badge.dataset.state=rec.started?'recording':'armed';
  }
  function disarm(){if(rec?.unhook){rec.unhook();rec.unhook=null}if(rec)rec.armed=false;drawBadge()}
  function record(){
   if(root.StageConcert?.locked()){alert('LIVE LOCK: unlock editing first.');return}
   const song=o.song();if(!song)return alert('Select a song first.');
   if(rec?.armed&&rec.song===song){finish();return}
   if(rec?.armed)disarm();
   rec=null;$('midiRecordTitle').textContent='RECORD MIDI — '+String(song.title||'Untitled song').toUpperCase();
   $('midiRecordArmView').hidden=false;$('midiRecordReview').hidden=true;$('midiRecordThru').checked=o.state().opts.midiRecordThru===true;
   recStatus(native()?'':'Recording needs the BenKen app with native MIDI (Native V27.39 or newer). In a browser, MIDI input is not passed to the recorder.',!native());
   if(!recDialog.open){o.suspend?.('midi-record');recDialog.showModal()}
  }
  function arm(){
   const song=o.song();if(!song)return;
   const thru=$('midiRecordThru').checked;if(o.state().opts.midiRecordThru!==thru){o.state().opts.midiRecordThru=thru;o.save()}
   rec={song,armed:true,started:false,events:[],thru,unhook:null};rec.unhook=hook();
   recDialog.close();o.resume?.('midi-record');drawBadge();
   o.message?.('MIDI REC armed: press PLAY and use your pedals. Recording stops when the song stops.');
  }
  function finish(){
   if(!rec)return;const had=rec.started;disarm();
   if(!rec.events.length){o.message?.(had?'MIDI REC stopped. No commands were received.':'MIDI REC cancelled.');rec=null;return}
   review();
  }
  function gridSeconds(song,mode){
   if(mode==='off')return {seconds:0,text:'Exact times as played.'};
   let c;try{c=root.StageClick.config(song)}catch{c=null}
   if(!c?.bpm)return {seconds:0,text:'This song has no tempo. Set the song tempo under Mixer > Tempo to quantize.',error:true};
   const beat=60/c.bpm,seconds=mode==='bar'?beat*c.beatsPerBar:mode==='half'?beat/2:beat;
   return {seconds,text:'Grid: '+Math.round(c.bpm*10)/10+' BPM · '+c.beatsPerBar+' beats per bar'+(c.songBpm?'':' (metronome tempo; the song has no BPM)')+' · beat 1 at 0:00.'};
  }
  function planned(){
   const song=rec.song,g=gridSeconds(song,$('midiRecordQuantize').value),rate=root.StageTempo?.ratio(song)||1,label=$('midiRecordLabel').value.trim();
   return {g,rows:rec.events.map(e=>{const t=g.seconds?Math.max(0,Math.round(e.time/g.seconds)*g.seconds):e.time;return {...e,playTime:t,line:L().midiLine({...e.cmd,at:t*rate,label})}})};
  }
  function review(){
   $('midiRecordArmView').hidden=true;$('midiRecordReview').hidden=false;$('midiRecordQuantize').value=o.state().opts.midiRecordQuantize||'beat';
   $('midiRecordSummary').textContent=rec.events.length+' command'+(rec.events.length===1?'':'s')+' recorded in «'+(rec.song.title||'Untitled song')+'». Untick any you do not want, then SAVE TO LYRICS.';
   drawReview();recStatus('');if(!recDialog.open){o.suspend?.('midi-record');recDialog.showModal()}
  }
  function drawReview(){
   const {g,rows}=planned();$('midiRecordGrid').textContent=g.text;$('midiRecordGrid').dataset.error=String(!!g.error);
   const ul=$('midiRecordList');ul.replaceChildren();
   rows.forEach((r,i)=>{const li=doc.createElement('li'),label=doc.createElement('label'),box=doc.createElement('input'),txt=doc.createElement('span');box.type='checkbox';box.checked=r.keep;box.onchange=()=>{rec.events[i].keep=box.checked};
    txt.textContent=L().time(r.time)+(Math.abs(r.playTime-r.time)>0.005?' → '+L().time(r.playTime):'')+' · '+L().midiSummary(L().parseMidi(r.line));label.append(box,txt);li.append(label);ul.append(li)});
  }
  function saveRecording(){
   const r=rec;if(!r)return;const song=o.song();if(song!==r.song){recStatus('Select «'+(r.song.title||'the song')+'» again to save this recording.',true);return}
   if(root.StageConcert?.locked()){recStatus('LIVE LOCK: unlock editing first.',true);return}
   const {rows}=planned(),keep=rows.filter(x=>x.keep);if(!keep.length){recStatus('Tick at least one command, or press DISCARD.',true);return}
   const previous=song.text;song.text=insertTimed(previous,song,keep);
   o.state().opts.midiRecordQuantize=$('midiRecordQuantize').value;
   if(o.save()===false){song.text=previous;return}
   cache={key:'',list:[]};rec=null;recDialog.close();o.resume?.('midi-record');o.render();o.message?.(keep.length+' MIDI command'+(keep.length===1?'':'s')+' added to the lyrics.');
  }
  // Each line goes under the heading of the section it falls in (after any MIDI lines already there), or at the top.
  function insertTimed(text,song,rows){
   const lines=String(text||'').split(/\r?\n/),segs=(L().segments(song,o.mixer.player.duration||0)||[]).filter(s=>Number.isInteger(s.line)&&Number.isFinite(s.start)).sort((a,b)=>a.line-b.line);
   const existing=new Set(lines.map(x=>x.trim()));const groups=new Map();
   for(const r of rows.slice().sort((a,b)=>a.playTime-b.playTime)){if(existing.has(r.line))continue;existing.add(r.line);let best=null;for(const s of segs)if(s.start<=r.playTime+1e-6&&(!best||s.start>=best.start))best=s;const at=best?best.line:-1;if(!groups.has(at))groups.set(at,[]);groups.get(at).push(r.line)}
   for(const at of [...groups.keys()].sort((a,b)=>b-a)){let i=at+1;while(i<lines.length&&L().parseMidi(lines[i]))i++;lines.splice(i,0,...groups.get(at))}
   return lines.join('\n');
  }
  $('midiRecordClose').onclick=()=>{recDialog.close();o.resume?.('midi-record');if(rec&&!rec.armed)rec=null};
  recDialog.addEventListener('cancel',e=>{e.preventDefault();$('midiRecordClose').click()});
  $('midiRecordArm').onclick=arm;$('midiRecordSave').onclick=saveRecording;
  $('midiRecordDiscard').onclick=()=>{if(rec?.events.length&&!confirm('Discard '+rec.events.length+' recorded MIDI command(s)?'))return;rec=null;recDialog.close();o.resume?.('midi-record')};
  $('midiRecordAgain').onclick=()=>{rec=null;record()};
  $('midiRecordQuantize').onchange=drawReview;$('midiRecordLabel').oninput=drawReview;
  badge.onclick=()=>finish();
  // Recording ends when the song stops (or another song is selected).
  root.setInterval(()=>{if(!rec?.armed)return;const p=o.mixer.player;if(o.song()!==rec.song){disarm();o.message?.('MIDI REC stopped: another song was selected.');rec.events.length?review():rec=null;return}if(rec.started&&!p.playing&&!p.countingIn)finish();else if(!rec.started&&p.playing&&!p.countingIn){rec.started=true;drawBadge()}},200);
  if($('midiRecordOpen'))$('midiRecordOpen').onclick=()=>{$('midiDialog')?.open&&$('midiDialog').close();record()};
  return {open,close,events:()=>list(),tick,record,insertTimed,gridSeconds};
 }
 root.StageMIDICues={VERSION,events,editText,mount};
})(typeof window!=='undefined'?window:globalThis);
