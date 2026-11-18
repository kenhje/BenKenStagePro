// BenKen Stage Pro V26.199 — MIDI commands in the lyrics ({midi …}), as in Stage Traxx.
// Commands are lines in the song text, so they scroll with the lyrics and are saved with the song.
// While a song plays, each command is sent when playback reaches it: the start of the section it sits in,
// the song start (above the first heading), or an exact @mm:ss. Sending needs Native V27.39 (midiSend) and
// goes to the output chosen under MIDI & pedals → MIDI Clock (the RC-600).
(function(root){
 'use strict';
 const VERSION='26.199',LOOKAHEAD=0.5;
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
   +'<li><b>Choose the output once:</b> Settings → MIDI &amp; pedals → MIDI Clock → choose the RC-600 (or U2MIDI Pro) as MIDI output. Commands go to the same output as MIDI Clock, even when the clock itself is off. Use the Native engine (Native V27.39 or newer).</li>'
   +'<li><b>Add a command:</b> press and hold a lyric line → MIDI COMMAND, or use the + MIDI button in the control bar. The command is placed in the lyrics below that line.</li>'
   +'<li><b>When it is sent:</b> <i>At the start of this section</i> sends it when playback reaches the section heading above it. A command above the first heading is sent when the song starts. <i>At a time</i> sends it at an exact point, e.g. 1:32. Sections need REAPER regions or SYNC LYRICS timing.</li>'
   +'<li><b>LEARN:</b> press LEARN, then press the pedal or button on your MIDI device. BenKen fills in the command it receives. Or type the values yourself.</li>'
   +'<li><b>TEST</b> sends the command now, so you can check that the RC-600 reacts.</li>'
   +'</ol><h3>RC-600: start and stop loops</h3><p>On the RC-600, open MENU → ASSIGN. Choose an assign, set SOURCE to a CC number (e.g. CC#80) and TARGET to what it should do, e.g. TRACK1 REC/PLAY, TRACK1 STOP or ALL START/STOP. Set the RC-600 MIDI receive channel to the same channel as here (ch 1 by default). Then add CC 80 with value 127 here.</p>'
   +'<p>PC (Program Change) chooses an RC-600 memory. START and STOP control all tracks when the RC-600 follows MIDI Clock.</p>'
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
  return {open,close,events:()=>list(),tick};
 }
 root.StageMIDICues={VERSION,events,editText,mount};
})(typeof window!=='undefined'?window:globalThis);
