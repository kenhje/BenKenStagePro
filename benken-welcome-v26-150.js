/* BenKen V26.150: local first-start guide and direct offline help. */
(function(root){
 'use strict';
 const app=root.BenKenApp;if(!app)return;
 const seenKey='benken-welcome-v1',get=id=>document.getElementById(id);
 const steps=[
  ['#settingsBtn','Settings & import','Start here to import songs, choose Controls, open the mixer, adjust lyrics or create a backup.'],
  ['#askBenKenHome','Ask BenKen','Need a hand? This button searches the included user manual. It works offline.'],
  ['#view','Your library & setlists','Open your songs, choose a setlist and arrange your running order. Tap the button again to return to the song.'],
  ['#controlsBtn','Show your Controls','Show or hide the playback Controls. Hiding them gives you a quieter reading view.'],
  ['#controlsSettingsBtn','Choose your buttons','Choose which actions appear, change their order and place Controls along the bottom or at either side. Fullscreen is also available here.'],
  ['#mixerBtn','The mixer','Balance or mute your tracks and select the playback output for your setup.'],
  ['#performanceControls [data-action="play"]','Play & perform','Start playback here after you have added audio. Your chosen Controls can also include Stop, Next, scrolling and fullscreen.'],
  ['#song','Your reading view','Lyrics and chords appear here. Change text size and alignment in Settings → Lyrics & scrolling. Swipe between songs when song swiping is enabled.']
 ];
 const dialog=document.createElement('dialog');dialog.id='benkenWelcome';dialog.setAttribute('aria-labelledby','welcomeTitle');dialog.setAttribute('aria-describedby','welcomeText');
 dialog.innerHTML='<div id="welcomeHighlight" aria-hidden="true" hidden></div><section id="welcomeCard"><span id="welcomeProgress"></span><h2 id="welcomeTitle"></h2><p id="welcomeText"></p><div class="welcome-actions"><button type="button" id="welcomeSkip">Skip</button><span></span><button type="button" id="welcomeBack">Back</button><button type="button" id="welcomeNext">Start tour</button></div></section>';
 document.body.append(dialog);
 let current=-1,visibleSteps=[],previousFocus=null,previousView=null;
 function visible(selector){const el=document.querySelector(selector);if(!el)return false;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&r.bottom>0&&r.top<innerHeight}
 function remember(){try{localStorage.setItem(seenKey,'seen')}catch{}}
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
  get('welcomeText').textContent=welcome?'Take a quick tour of the buttons you will use to prepare, rehearse and perform. You can skip it now and find Getting started again under Settings → About & help.':visibleSteps[current][2];
  get('welcomeBack').hidden=welcome;get('welcomeNext').textContent=welcome?'Start tour':current===visibleSteps.length-1?'Done':'Next';
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
 root.StageWelcome={VERSION:'26.150',open};
 function firstStart(){let seen=false;try{seen=!!localStorage.getItem(seenKey)}catch{}if(seen)return;if(app.state().songs.length){remember();return}open()}
 if(document.readyState==='complete')firstStart();else root.addEventListener('load',firstStart,{once:true});
})(window);
