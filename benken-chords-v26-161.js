(function(root){
'use strict';
const VERSION='26.161',mod=n=>(n%12+12)%12,tuning=[4,9,2,7,11,4],notes={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,Fb:4,'E#':5,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11,Cb:11,'B#':0};
const patterns={
 '':[0,4,7],m:[0,3,7],'5':[0,7],dim:[0,3,6],aug:[0,4,8],sus2:[0,2,7],sus4:[0,5,7],
 '6':[0,4,7,9],m6:[0,3,7,9],'6/9':[0,4,7,9,14],'m6/9':[0,3,7,9,14],
 '7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10],mMaj7:[0,3,7,11],dim7:[0,3,6,9],m7b5:[0,3,6,10],
 '9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],mMaj9:[0,3,7,11,14],
 '11':[0,4,7,10,14,17],maj11:[0,4,7,11,14,17],m11:[0,3,7,10,14,17],
 '13':[0,4,7,10,14,17,21],maj13:[0,4,7,11,14,17,21],m13:[0,3,7,10,14,17,21],
 add9:[0,4,7,14],madd9:[0,3,7,14],add11:[0,4,7,17],madd11:[0,3,7,17],
 '7sus2':[0,2,7,10],'7sus4':[0,5,7,10],'9sus4':[0,5,7,10,14],
 '7b5':[0,4,6,10],'7#5':[0,4,8,10],'7b9':[0,4,7,10,13],'7#9':[0,4,7,10,15],
 '7#11':[0,4,7,10,18],maj7sharp11:[0,4,7,11,18],'9#11':[0,4,7,10,14,18],'7b13':[0,4,7,10,20]
};
const aliases={maj:'',Maj:'',MAJ:'',major:'',Major:'',M:'',major7:'maj7',major9:'maj9',major11:'maj11',major13:'maj13',MAJ7:'maj7',MAJ9:'maj9',MAJ11:'maj11',MAJ13:'maj13',min:'m',minor:'m','-':'m',dom:'7',dom7:'7',dom9:'9',dom11:'11',dom13:'13',M7:'maj7',M9:'maj9',M11:'maj11',M13:'maj13',Maj7:'maj7',Maj9:'maj9',Maj11:'maj11',Maj13:'maj13','Δ':'maj7','Δ7':'maj7','Δ9':'maj9','ø':'m7b5','ø7':'m7b5','°':'dim','°7':'dim7','+':'aug','+7':'7#5',sus:'sus4',min7:'m7',min9:'m9',min11:'m11',min13:'m13','m(maj7)':'mMaj7','maj7#11':'maj7sharp11','69':'6/9','m69':'m6/9'};
function spec(label){const text=String(label||'').trim().replace(/♭/g,'b').replace(/♯/g,'#'),m=text.match(/^([A-G](?:#|b)?)(.*)$/);if(!m)return null;let quality=m[2],bass=null;const slash=quality.match(/\/([A-G](?:#|b)?)$/);if(slash){bass=notes[slash[1]];quality=quality.slice(0,-slash[0].length)}quality=aliases[quality]??quality.replace(/[()]/g,'');quality=aliases[quality]??quality;const intervals=patterns[quality];if(!intervals||notes[m[1]]==null)return null;const r=notes[m[1]],tones=[...new Set(intervals.map(i=>mod(r+i)))];
 // Six strings cannot contain seven distinct pitches. For 13ths omit the fifth and eleventh.
 const required=tones.length>6?intervals.filter(i=>i!==7&&i!==17).map(i=>mod(r+i)):tones;
 return {root:r,rootName:m[1],bass,quality,intervals:[...intervals],tones,required:[...new Set([...required,...(bass==null?[]:[bass])])],allowed:[...new Set([...tones,...(bass==null?[]:[bass])])]};}
function valid(f,s){if(!s||f.length!==6||f.some(n=>!Number.isInteger(n)||n< -1||n>18))return false;const played=f.flatMap((v,i)=>v<0?[]:[mod(tuning[i]+v)]);return played.length>0&&played[0]===(s.bass??s.root)&&played.every(p=>s.allowed.includes(p))&&s.required.every(p=>played.includes(p));}
const cache=new Map();
function guitar(label){if(cache.has(label))return cache.get(label);const s=spec(label);if(!s)return [];let all=[],seen=new Set();
 for(let start=0;start<=13;start++){let found=0;const choices=tuning.map(open=>[-1,...Array.from({length:5},(_,i)=>start+i).filter(f=>f<=17&&s.allowed.includes(mod(open+f)))]);const walk=(f,mask)=>{if(found>=100)return;const i=f.length,missing=s.required.filter(p=>!(mask&(1<<p))).length;if(missing>6-i)return;if(i===6){if(!valid(f,s))return;const key=f.join(',');if(seen.has(key))return;const fretted=f.filter(v=>v>0);if(fretted.length&&Math.max(...fretted)-Math.min(...fretted)>4)return;
 // Estimate four fingers, allowing a barre at one fret across higher fretted notes.
 let fingers=0;for(const fret of new Set(fretted)){let group=false;for(const v of f){if(v>=0&&v<fret)group=false;if(v===fret&&!group){fingers++;group=true}}}if(fingers>4)return;seen.add(key);all.push([...f]);found++;return;}
 for(const fret of choices[i]){if(fret>=0&&s.bass!=null&&!f.some(v=>v>=0)&&mod(tuning[i]+fret)!==s.bass)continue;f.push(fret);walk(f,fret<0?mask:mask|(1<<mod(tuning[i]+fret)));f.pop();}};walk([],0);}
 const score=f=>{const v=f.filter(n=>n>0);return (v.length?Math.max(...v)-Math.min(...v):0)*2+(v.length?Math.min(...v):0)*.3+f.filter(n=>n<0).length*.2};all.sort((a,b)=>score(a)-score(b));const result=all.slice(0,16);cache.set(label,result);return result;}
function piano(label,width=270){const s=spec(label);if(!s)return '';const rootNote=60+s.root,keys=s.intervals.map(i=>rootNote+i),bass=s.bass==null?null:rootNote-1-mod(rootNote-1-s.bass);if(bass!=null)keys.push(bass);const start=Math.floor(Math.min(...keys)/12)*12,end=Math.max(start+24,Math.ceil((Math.max(...keys)+1)/12)*12),white=[0,2,4,5,7,9,11],whites=Array.from({length:end-start},(_,i)=>start+i).filter(n=>white.includes(mod(n))),keyW=16,total=whites.length*keyW,isOn=n=>keys.includes(n);let svg='<svg class="piano-diagram" viewBox="0 0 '+total+' 90" width="'+width+'" role="img" aria-label="Piano chord '+String(label).replace(/[&<>"']/g,'')+'">';
 for(let i=0;i<whites.length;i++){const n=whites[i];svg+='<rect x="'+i*keyW+'" y="0" width="16" height="78" rx="2" fill="'+(isOn(n)?'var(--app-accent)':'#f4f2eb')+'" stroke="#555"/>';if(isOn(n))svg+='<circle cx="'+(i*keyW+8)+'" cy="66" r="3" fill="#15202a"/>';}
 for(let n=start;n<end;n++){if(white.includes(mod(n)))continue;const x=whites.filter(k=>k<n).length*keyW-5;svg+='<rect x="'+x+'" y="0" width="10" height="46" rx="1" fill="'+(isOn(n)?'var(--app-accent)':'#242424')+'" stroke="#555"/>';if(isOn(n))svg+='<circle cx="'+(x+5)+'" cy="37" r="2" fill="#15202a"/>';}
 return svg+'</svg>';}
root.StageChords={VERSION,patterns,aliases,spec,valid,guitar,piano};
})(typeof window!=='undefined'?window:globalThis);
