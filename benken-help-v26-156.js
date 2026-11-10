/* Offline lookup of the bundled manual. No AI, network requests or playback actions. */
(function(root){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normal=s=>String(s||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ø/g,'o').replace(/æ/g,'ae').replace(/[^a-z0-9]+/g,' ').trim();
const stop=new Set(normal('hvordan hvor finner jeg kan man du det den de til for fra er en et og med som min mitt mine har hva hvorfor ikke fungerer how where can i find do does the a an is are to from for my with and it work works please').split(' '));
const topics=[
 ['Band & planning','BAND','Band & planning','band medlemmer member invite invitasjon innkalling ovelse oving konsert arrangement rsvp deltakelse svar going contract kontrakt honorar administrator admin pakkeliste planning'],
 ['Profile & documents','PROFILE','Profile & document details','profil band logo contact artist adresse kontakt PDF design papir paper'],
 ['Getting started','SETLIST','Setlists & library','kom i gang getting started library bibliotek sang song'],
 ['Song library & editing','SETLIST','Setlists & library','library bibliotek redigere edit legge til add song tags tagger'],
 ['Setlists','SETLIST','Setlists & library','set setlist setliste rekkefolge order neste next previous forrige autoplay'],
 ['Import from REAPER','MIXER_SETTINGS','Mixer settings','reaper import update erstatte eksport region overlap'],
 ['Audio & Files','MIXER_SETTINGS','Mixer settings','missing files mangler lydfil manglende filer replace file delete all audio files'],
 ['Find duplicates','SETLIST','Setlists & library','duplikater duplicates double doble kopier'],
 ['Choose an audio engine','PLAYBACK','Audio & playback','native browser motor engine ready preparing not ready klargjoring'],
 ['Stereo, USB & Ui24R outputs','PLAYBACK','Audio & playback','ingen lyd no sound stille silent usb ui24r utgang output routing patching stereo practice live'],
 ['Mixer, buses & mute groups','MIXER_SETTINGS','Mixer settings','mixer mikser bus buss buses mute group grupper fader master volume volum'],
 ['Tempo & transposition','TEMPO','Tempo & metronome','tempo bpm transpose transponering tonehoyde pitch speed hastighet'],
 ['Capo & Key — song key','CAPO','Capo & Key','capo key toneart song key grep chords transpose hjul wheel'],
 ['My capo & Bandmate capo','CAPO','Capo & Key','bente kenneth capo am cm grep reminder paminnelse'],
 ['Lyrics, chords & diagrams','LYRICS','Lyrics & scrolling','lyrics akkorder chords hide show skjul tekst diagrammer both'],
 ['Autoscroll & section timing','LYRICS','Lyrics & scrolling','scroll autoscroll rulling scrolle timing sync lyrics seksjoner sections'],
 ['Practice mode & count-in','TEMPO','Tempo & metronome','count in countin inntelling telling for sang opptelling metronome metronom click klikk blink flash practice oving region'],
 ['Controls & fullscreen','CONTROLS','Controls & fullscreen','controls knapper buttons fullscreen fullskjerm side venstre hoyre large live buttons'],
 ['Tuner','TUNER','Tuner settings','tuner stemming stemme mikrofon microphone pitch hoy lav inaccurate unoyaktig cents'],
 ['Device volume & buffer','PLAYBACK','Audio & playback','buffer device volume volum lydniva 256 512 1024 latency forsinkelse'],
 ['MIDI & foot controls','MIDI','MIDI & pedals','midi clock sync looper rc600 fcb1010 pedal fotkontroll start stop'],
 ['Ui24R cues','UI24R','Cues & Show','ui24r cues cue show scene mixer connection nettverk'],
 ['Concert & sync between devices','CONCERT','Concert & sync','sync synk synkronisering mappe folder concert konsert mac ipad iphone backup reserve overforing fra til'],
 ['Full backup & restore','BACKUP','Import, export & backup','backup sikkerhetskopi restore gjenopprette full lyd audio filer json eksport export'],
 ['Weekly local backup','BACKUP','Import, export & backup','autobackup auto backup weekly ukentlig automatisk lokal gjenopprettingskopi'],
 ['Share songs & sets with audio','SHARE','Share songs & setlists','dele deling share sharing qr link lenke sett setlist audio lyd supabase'],
 ['Share lyrics & external display','NETWORK','Share lyrics','host follow folg vert lyrics tekst ekstern skjerm external display deling'],
 ['Skins, notes & information','PERSONALIZATION','Appearance','skin theme tema farger colors palette appearance warm paper navy studio black show info notes notater'],
 ['Ask BenKen','HELP','About & help','ask benken hjelp help guide manual bruksanvisning'],
 ['Apple & Google Calendar','CALENDAR','Calendar','apple google ios kalender calendar sync synk'],
 ['Microphone permission','TUNER','Tuner settings','mikrofon tilgang microphone permission iphone ipad tuner'],
 ['Background playback & MIDI Clock','PLAYBACK','Audio & playback','background bakgrunn mixing station stopp hakk hakker hjem appbytte midi clock'],
 ['Song Loudness','LOUDNESS','Song Loudness','lufs loudness normalize normalisering niva level song master progress fremdrift'],
 ['Calendar — rehearsals & concerts','CALENDAR','Calendar','calendar kalender oving konsert rehearsal gig ios google dato'],
 ['Venues','VENUES','Venues','venue venues spillested sted adresse maps kart kontakt'],
 ['Packing lists','PACKING','Packing list','packing pakkeliste pakke utstyr bring home hjem'],
 ['Contract drafts','CALENDAR','Calendar','contract kontrakt honorar avtale fee organiser arrangor']
];
const aliases=[[/\b(count ?in|inntelling|opptelling|telling for sang)\b/,'Practice mode & count-in'],[/\b(bente|kenneth)\b/,'My capo & Bandmate capo'],[/\b(ingen lyd|no sound|silent|stille)\b/,'Stereo, USB & Ui24R outputs'],[/\b(lufs|loudness|normalisering)\b/,'Song Loudness'],[/\b(pakkeliste|packing)\b/,'Packing lists'],[/\b(autobackup|ukentlig|weekly)\b/,'Weekly local backup'],[/\b(duplikater|duplicates)\b/,'Find duplicates']];
function build(sections){return sections.map(([title,steps],index)=>{const topic=topics.find(t=>normal(t[0])===normal(title));return {index,title,steps:[...steps],destination:topic?.[1]||'MANUAL',label:topic?.[2]||'Manual',titleText:normal(title),keywords:normal(topic?.[3]||''),body:normal(steps.join(' '))}})}
function search(index,query){const q=normal(String(query).slice(0,250));if(!q)return [];const words=[...new Set(q.split(' ').filter(w=>w.length>1&&!stop.has(w)))];if(!words.length)return [];return index.map(row=>{let score=0,matched=0;for(const word of words){const hitTitle=(' '+row.titleText+' ').includes(' '+word+' '),hitKeywords=(' '+row.keywords+' ').includes(' '+word+' '),hitBody=row.body.includes(word);if(hitTitle||hitKeywords||hitBody)matched++;score+=hitTitle?10:hitKeywords?7:hitBody?1:0}if(row.titleText.includes(q))score+=20;if(words.length>1&&matched===words.length)score+=8;for(const [pattern,title] of aliases)if(pattern.test(q)&&row.title===title)score+=35;return {...row,score}}).filter(row=>row.score>=5).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,5)}
function markup(){return '<section class="ask-benken"><div class="ask-intro"><h3>Ask BenKen</h3><div>Search the user manual · Works offline · No AI</div></div><form id="askBenKenForm" role="search"><label for="askBenKenQuery">What do you need help with?</label><div class="ask-input-row"><input id="askBenKenQuery" type="search" maxlength="250" placeholder="For example: Where can I find count-in?" autocomplete="off" aria-controls="askBenKenResults"><button type="submit">SEARCH</button></div></form><div class="ask-examples" aria-label="Common questions">'+['Where can I find count-in?','No sound in USB','Bandmate capo','Share a setlist with audio','Tuner','Backup'].map(q=>'<button type="button" data-ask-example="'+esc(q)+'">'+esc(q)+'</button>').join('')+'</div><div id="askBenKenStatus" role="status" aria-live="polite">Ask a question or enter a feature name. Answers come from the included English manual.</div><div id="askBenKenResults"></div></section>'}
let lastQuery='';
function mount(container,{sections,open,manual}){const index=build(sections);let timer;const input=container.querySelector('#askBenKenQuery'),results=container.querySelector('#askBenKenResults'),status=container.querySelector('#askBenKenStatus');input.value=lastQuery;function update(){const q=input.value.trim();lastQuery=input.value;const found=search(index,q);if(!q){results.innerHTML='';status.textContent='Ask a question or enter a feature name. Answers come from the included English manual.';return}status.textContent=found.length?found.length+' manual topic'+(found.length===1?'':'s')+' found.':'No matching topic. Try a shorter feature name, such as count-in, USB, capo or backup.';results.innerHTML=found.length?found.map(row=>'<article class="ask-result"><h3>'+esc(row.title)+'</h3><div class="ask-source">From the BenKen user manual</div><ol>'+row.steps.map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol><div class="ask-result-actions"><button type="button" data-ask-open="'+row.index+'">Open '+esc(row.label)+'</button><button type="button" data-ask-manual="'+row.index+'">Read in manual</button></div></article>').join(''):'<button type="button" data-ask-manual="-1">Browse the full manual</button>'}
container.querySelector('#askBenKenForm').onsubmit=e=>{e.preventDefault();clearTimeout(timer);update()};input.oninput=()=>{clearTimeout(timer);timer=setTimeout(update,160)};container.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-ask-example')){input.value=b.dataset.askExample;clearTimeout(timer);update()}if(b.hasAttribute('data-ask-open')){const row=index.find(row=>row.index===Number(b.dataset.askOpen));if(row)open(row.destination)}if(b.hasAttribute('data-ask-manual'))manual(Number(b.dataset.askManual))};if(lastQuery)update();return {dispose(){clearTimeout(timer);container.onclick=null;input.oninput=null}}}
root.StageHelp={VERSION:'26.156',normal,build,search,markup,mount};
})(typeof window!=='undefined'?window:globalThis);
