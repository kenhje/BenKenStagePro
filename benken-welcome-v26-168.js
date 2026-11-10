/* BenKen V26.168: local first-start guide and direct offline help. */
(function(root){
 'use strict';
 const app=root.BenKenApp;if(!app)return;
 const seenKey='benken-welcome-v2',get=id=>document.getElementById(id);
 const steps=[
  ['#settingsBtn','Settings','Open Songs & Setlists to create or import a song. Audio, Lyrics & Chords, Appearance and Controls each have their own category. Turn on Show info for short explanations.'],
  ['#askBenKenHome','Ask BenKen','The question mark searches the built-in user manual. You can reopen this tour under Settings → Help & Info → Getting started.'],
  ['#view','Library & setlists','The lower-left button opens your songs and setlists. Choose Library to find a song, or Setlist to arrange the order for your show.'],
  ['#controlsBtn','Show or hide Controls','The lower-right button shows or hides the playback bar. Choose your buttons and their position under Settings → Controls → Buttons & fullscreen. The mixer is under Audio or can be added to Controls.'],
  ['#songSectionBar','Song sections','These are your song regions, such as Intro, Verse and Chorus. With synced timing and prepared audio, tap a region to play from there.'],
  ['#song','Lyrics, chords and playback','Read lyrics, chords or both. Select your reading view in Controls. Adjust text and title sizes under Lyrics & Chords. The demo includes audio so you can try Play.'],
  ['#settingsBtn','Bring in your own song','Choose Songs & Setlists → Create a song for audio and lyrics together. Use Import songs & projects for audio files, Lyrics / ChordPro, or a .benken project containing a song or library with audio. Show info explains the file types.'],
  ['#settingsBtn','Edit on your computer','Web song editor lets you edit lyrics and inline chords on PC or Mac. Sign in, select a song and send it to the web first. After editing online, compare and receive the changes here. Show info explains each step.']
 ];
 const dialog=document.createElement('dialog');dialog.id='benkenWelcome';dialog.setAttribute('aria-labelledby','welcomeTitle');dialog.setAttribute('aria-describedby','welcomeText');
 dialog.innerHTML='<div id="welcomeHighlight" aria-hidden="true" hidden></div><section id="welcomeCard"><span id="welcomeProgress"></span><h2 id="welcomeTitle"></h2><p id="welcomeText"></p><button type="button" id="welcomeDemo">Add demo song</button><p id="welcomeDemoStatus" role="status"></p><label class="welcome-options"><input id="welcomeDismiss" type="checkbox"> Don’t show automatically again</label><div class="welcome-actions"><button type="button" id="welcomeSkip">Skip</button><span></span><button type="button" id="welcomeBack">Back</button><button type="button" id="welcomeNext">Start tour</button></div></section>';
 document.body.append(dialog);
 let current=-1,visibleSteps=[],previousFocus=null,previousView=null;
 function visible(selector){const el=document.querySelector(selector);if(!el)return false;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&r.bottom>0&&r.top<innerHeight}
 function remember(){try{if(get('welcomeDismiss').checked)localStorage.setItem(seenKey+'-dismissed','yes')}catch{}}
 function finish(){if(!dialog.open)return;remember();dialog.close();document.body.classList.remove('welcome-open');get('welcomeHighlight').hidden=true;if(previousView!==null){app.state().opts.view=previousView;previousView=null;app.render()}if(previousFocus?.isConnected&&!previousFocus.closest('[inert]'))previousFocus.focus({preventScroll:true})}
 function position(){
  if(!dialog.open)return;const card=get('welcomeCard'),highlight=get('welcomeHighlight');
  const vw=dialog.clientWidth,vh=dialog.clientHeight,pad=12;
  card.style.maxHeight=Math.max(120,vh-2*pad)+'px';
  if(current<0){highlight.hidden=true;card.style.left=Math.max(pad,(vw-card.offsetWidth)/2)+'px';card.style.top=Math.max(pad,(vh-card.offsetHeight)/2)+'px';return}
  const target=document.querySelector(visibleSteps[current][0]);if(!target){finish();return}const r=target.getBoundingClientRect(),cr=dialog.getBoundingClientRect();
  const left=Math.max(4,r.left-cr.left-4),top=Math.max(4,r.top-cr.top-4),right=Math.min(vw-4,r.right-cr.left+4),bottom=Math.min(vh-4,r.bottom-cr.top+4);
  highlight.hidden=false;Object.assign(highlight.style,{left:left+'px',top:top+'px',width:Math.max(0,right-left)+'px',height:Math.max(0,bottom-top)+'px'});
  const x=Math.max(pad,Math.min(vw-card.offsetWidth-pad,(left+right-card.offsetWidth)/2));
  const y=bottom+12+card.offsetHeight<=vh-pad?bottom+12:top-12-card.offsetHeight>=pad?top-12-card.offsetHeight:Math.max(pad,(vh-card.offsetHeight)/2);
  card.style.left=x+'px';card.style.top=y+'px';
 }
 function draw(){
  const welcome=current<0;get('welcomeProgress').textContent=welcome?'WELCOME TO BENKEN':(current+1)+' of '+visibleSteps.length;
  get('welcomeTitle').textContent=welcome?'Ready to get started?':visibleSteps[current][1];
  get('welcomeText').textContent=welcome?'Try the demo and take a short tour of the home screen. This guide is offered on your first three starts. You can skip it or reopen it under Settings → Help & Info → Getting started.':visibleSteps[current][2];
  get('welcomeBack').hidden=welcome;get('welcomeDemo').hidden=!welcome;get('welcomeDemoStatus').hidden=!welcome;get('welcomeNext').textContent=welcome?'Start tour':current===visibleSteps.length-1?'Done':'Next';
  get('welcomeSkip').textContent=welcome?'Not now':'Skip';position();get('welcomeNext').focus({preventScroll:true});
 }
 function open(){
  if(dialog.open)return;app.closeSettings();if(document.querySelector('dialog[open]'))return;
  previousFocus=document.activeElement;previousView=null;
  if(app.state().opts.view===3){previousView=3;app.state().opts.view=1;app.render()}
  visibleSteps=steps.filter(step=>visible(step[0]));current=-1;document.body.classList.add('welcome-open');dialog.showModal();draw();
 }
 get('welcomeSkip').onclick=finish;
 get('welcomeBack').onclick=()=>{current=Math.max(-1,current-1);draw()};
 get('welcomeNext').onclick=()=>{if(current>=visibleSteps.length-1){finish();return}current++;draw()};
 dialog.addEventListener('cancel',e=>{e.preventDefault();finish()});
 root.addEventListener('resize',position);root.visualViewport?.addEventListener('resize',position);root.visualViewport?.addEventListener('scroll',position);
 get('askBenKenHome').onclick=()=>app.openHelp('ASK');
 root.StageWelcome={VERSION:'26.168',open};
 let addingDemo=false;
 async function addDemo(){
  const button=get('welcomeDemo'),status=get('welcomeDemoStatus');
  if(addingDemo)return;
  if(app.mixer.busy?.()||app.mixer.player?.playing||app.mixer.click?.running||root.StageConcert?.locked?.()){status.textContent='Stop playback and wait for preparation before adding the demo.';return}
  addingDemo=true;button.disabled=true;status.textContent='Preparing your demo…';
  try{
   const response=await fetch('./BenKen_Chord_Chart_Demo.benken');if(!response.ok)throw Error('Demo unavailable. Connect to the internet and try Add demo song again.');
   const file=await response.blob(),manifest=await root.StageProject.inspect(file),song=manifest.state.songs[0];
   if(manifest.scope!=='song'||manifest.state.songs.length!==1)throw Error('The demo package is invalid.');
   const exists=app.state().songs.some(s=>s.title===song.title&&s.artist===song.artist);
   if(exists){status.textContent='The demo is already in your Library.';return}
   if(!await app.mixer.importProject(file))throw Error(get('mixerStatus')?.textContent||'Could not add the demo. Try again.');
   localStorage.setItem(seenKey+'-demo','added');status.textContent='Demo ready in your Library. Close the guide and press Play.';app.render();if(current<0)visibleSteps=steps.filter(step=>visible(step[0]));
  }catch(error){status.textContent=error.message}finally{addingDemo=false;button.disabled=false;position()}
 }
 get('welcomeDemo').onclick=()=>void addDemo();
 async function firstStart(){
  let count=0,dismissed=false,added=false;try{count=Number(localStorage.getItem(seenKey+'-starts'))||0;dismissed=localStorage.getItem(seenKey+'-dismissed')==='yes';added=!!localStorage.getItem(seenKey+'-demo')}catch{}
  if(dismissed||count>=3)return;
  open();if(!dialog.open)return;
  try{localStorage.setItem(seenKey+'-starts',String(count+1))}catch{}
  if(!app.state().songs.length&&!added)await addDemo();
 }
 if(document.readyState==='complete')firstStart();else root.addEventListener('load',firstStart,{once:true});
})(window);
