(function(root){
'use strict';
let majAs7=true;
const VERSION='26.226',mod=n=>(n%12+12)%12,tuning=[4,9,2,7,11,4],notes={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,Fb:4,'E#':5,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11,Cb:11,'B#':0};
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
const aliases={maj:'',Maj:'',MAJ:'',major:'',Major:'',M:'',major7:'maj7',major9:'maj9',major11:'maj11',major13:'maj13',MAJ7:'maj7',MAJ9:'maj9',MAJ11:'maj11',MAJ13:'maj13',min:'m',minor:'m','-':'m',dom:'7',dom7:'7',dom9:'9',dom11:'11',dom13:'13',M7:'maj7',M9:'maj9',M11:'maj11',M13:'maj13',Maj7:'maj7',Maj9:'maj9',Maj11:'maj11',Maj13:'maj13','Δ':'maj7','Δ7':'maj7','Δ9':'maj9','ø':'m7b5','ø7':'m7b5','°':'dim','°7':'dim7','+':'aug','+7':'7#5',sus:'sus4',min7:'m7',min9:'m9',min11:'m11',min13:'m13','m(maj7)':'mMaj7','maj7#11':'maj7sharp11','69':'6/9','m69':'m6/9','△':'maj7','△7':'maj7','△9':'maj9',ma7:'maj7',Ma7:'maj7',ma9:'maj9',ma:'',ma6:'6',mi:'m',mi7:'m7',maj6:'6','2':'add9',add2:'add9',madd2:'madd9','7M':'maj7'};
function spec(label){const text=String(label||'').trim().replace(/♭/g,'b').replace(/♯/g,'#'),m=text.match(/^([A-G](?:#|b)?)(.*)$/);if(!m)return null;let quality=m[2],bass=null;const slash=quality.match(/\/([A-G](?:#|b)?)$/);if(slash){bass=notes[slash[1]];quality=quality.slice(0,-slash[0].length)}// V26.226: many chord sheets write Dmaj for Dmaj7. With majAsMaj7 on (default), maj without a number reads as maj7.
 if(majAs7&&/^\s*(maj|Maj|MAJ|major|Major)\s*$/.test(quality))quality='maj7';
 quality=aliases[quality]??quality.replace(/[()]/g,'');quality=aliases[quality]??quality;const intervals=patterns[quality];if(!intervals||notes[m[1]]==null)return null;const r=notes[m[1]],tones=[...new Set(intervals.map(i=>mod(r+i)))];
 // Six strings cannot contain seven distinct pitches. For 13ths omit the fifth and eleventh.
 let required=tones.length>6?intervals.filter(i=>i!==7&&i!==17).map(i=>mod(r+i)):tones;
 // V26.226: the fifth may be left out of chords with four or more notes (C7 x32310, C6 x32210, Cmaj9 x3243x).
 if(intervals.length>=4&&intervals.includes(7))required=required.filter(p=>p!==mod(r+7));
 return {root:r,rootName:m[1],bass,quality,intervals:[...intervals],tones,required:[...new Set([...required,...(bass==null?[]:[bass])])],allowed:[...new Set([...tones,...(bass==null?[]:[bass])])]};}
function valid(f,s){if(!s||f.length!==6||f.some(n=>!Number.isInteger(n)||n< -1||n>18))return false;const played=f.flatMap((v,i)=>v<0?[]:[mod(tuning[i]+v)]);return played.length>0&&played[0]===(s.bass??s.root)&&played.every(p=>s.allowed.includes(p))&&s.required.every(p=>played.includes(p));}
// V26.226: standard guitar voicings come first: common open shapes, then barre shapes with the root on the
// low E string (E shape) or the A string (A shape). The search below is only a fallback for rarer chords.
const OPEN={
 '0|':['x32010'],'2|':['xx0232'],'4|':['022100'],'7|':['320003'],'9|':['x02220'],
 '2|m':['xx0231'],'4|m':['022000'],'9|m':['x02210'],
 '0|7':['x32310'],'2|7':['xx0212'],'4|7':['020100'],'7|7':['320001'],'9|7':['x02020'],'11|7':['x21202'],
 '2|m7':['xx0211'],'4|m7':['022030','020000'],'9|m7':['x02010'],
 '0|maj7':['x32000'],'2|maj7':['xx0222'],'4|maj7':['021100'],'5|maj7':['xx3210'],'7|maj7':['320002'],'9|maj7':['x02120'],
 '0|6':['x32210'],'2|6':['xx0202'],'4|6':['022120'],'7|6':['320000'],'9|6':['x02222'],
 '2|m6':['xx0201'],'4|m6':['022020'],'9|m6':['x02212'],
 '0|sus2':['x30033'],'2|sus2':['xx0230'],'4|sus2':['024400'],'7|sus2':['300033'],'9|sus2':['x02200'],
 '0|sus4':['x33011'],'2|sus4':['xx0233'],'4|sus4':['022200'],'7|sus4':['330013'],'9|sus4':['x02230'],
 '0|add9':['x32030'],'4|add9':['024100'],'7|add9':['320203'],'9|add9':['x02420'],
 '0|9':['x32333'],'4|9':['020102'],'7|9':['320201'],'9|9':['x02423'],'9|m9':['x02413'],'4|m9':['022032'],
 '0|aug':['x32110'],'4|aug':['032110'],'7|aug':['321003'],'9|aug':['x03221'],
 '2|7sus4':['xx0213'],'4|7sus4':['020200'],'9|7sus4':['x02030'],
 '4|5':['022xxx'],'9|5':['x022xx'],'2|5':['xx023x']
};
const E_SHAPE={'':[0,2,2,1,0,0],m:[0,2,2,0,0,0],'7':[0,2,0,1,0,0],m7:[0,2,0,0,0,0],maj7:[0,null,1,1,0,null],'6':[0,null,2,1,2,0],m6:[0,null,2,0,2,0],
 sus4:[0,2,2,2,0,0],sus2:[0,2,4,4,0,0],add9:[0,2,4,1,0,0],'9':[0,2,0,1,0,2],dim:[0,1,2,0,null,null],dim7:[0,1,2,0,2,0],aug:[0,3,2,1,1,0],
 m7b5:[0,null,0,0,-1,null],'5':[0,2,2,null,null,null],mMaj7:[0,2,1,0,0,0],'7sus4':[0,2,0,2,0,0],m9:[0,2,0,0,0,2]};
const A_SHAPE={'':[null,0,2,2,2,0],m:[null,0,2,2,1,0],'7':[null,0,2,0,2,0],m7:[null,0,2,0,1,0],maj7:[null,0,2,1,2,0],'6':[null,0,2,2,2,2],m6:[null,0,2,2,1,2],
 sus2:[null,0,2,2,0,0],sus4:[null,0,2,2,3,0],add9:[null,0,2,4,2,0],'9':[null,0,-1,0,0,0],dim:[null,0,1,2,1,null],dim7:[null,0,1,2,1,2],aug:[null,0,3,2,2,1],
 m7b5:[null,0,1,0,1,null],'5':[null,0,2,2,null,null],mMaj7:[null,0,2,1,1,0],'7sus4':[null,0,2,0,3,0],m9:[null,0,-2,0,0,0],maj9:[null,0,-1,1,0,null],'7#9':[null,0,-1,0,1,null]};
const parseShape=t=>[...t].map(c=>c==='x'?-1:parseInt(c,36));
function standard(s){
 if(!s||s.bass!=null)return [];const out=[],add=f=>{if(f&&valid(f,s)&&!out.some(x=>x.join(',')===f.join(',')))out.push(f)};
 for(const t of OPEN[s.root+'|'+s.quality]||[])add(parseShape(t));
 const cands=[];
 for(const [open,shape] of [[4,E_SHAPE[s.quality]],[9,A_SHAPE[s.quality]]]){if(!shape)continue;const r=mod(s.root-open);
  for(const base of [r,r+12]){if(base>14)continue;const f=shape.map(o=>o==null?-1:base+o);if(f.some(v=>v<-1)||shape.some((o,i)=>o!=null&&f[i]<0))continue;cands.push({f,base})}}
 cands.sort((a,b)=>a.base-b.base).forEach(c=>add(c.f));
 return out;
}
const cache=new Map();
function guitar(label){if(cache.has(label))return cache.get(label);const s=spec(label);if(!s)return [];let all=[],seen=new Set();
 for(let start=0;start<=13;start++){let found=0;const choices=tuning.map(open=>[-1,...Array.from({length:5},(_,i)=>start+i).filter(f=>f<=17&&s.allowed.includes(mod(open+f)))]);const walk=(f,mask)=>{if(found>=100)return;const i=f.length,missing=s.required.filter(p=>!(mask&(1<<p))).length;if(missing>6-i)return;if(i===6){if(!valid(f,s))return;const key=f.join(',');if(seen.has(key))return;const fretted=f.filter(v=>v>0);if(fretted.length&&Math.max(...fretted)-Math.min(...fretted)>4)return;
 // Estimate four fingers, allowing a barre at one fret across higher fretted notes.
 let fingers=0;for(const fret of new Set(fretted)){let group=false;for(const v of f){if(v>=0&&v<fret)group=false;if(v===fret&&!group){fingers++;group=true}}}if(fingers>4)return;seen.add(key);all.push([...f]);found++;return;}
 for(const fret of choices[i]){if(fret>=0&&s.bass!=null&&!f.some(v=>v>=0)&&mod(tuning[i]+fret)!==s.bass)continue;f.push(fret);walk(f,fret<0?mask:mask|(1<<mod(tuning[i]+fret)));f.pop();}};walk([],0);}
 const score=f=>{const v=f.filter(n=>n>0),played=f.map((n,i)=>n>=0?i:-1).filter(i=>i>=0),first=played[0],last=played[played.length-1],gaps=f.filter((n,i)=>n<0&&i>first&&i<last).length;return (v.length?Math.max(...v)-Math.min(...v):0)*2+(v.length?Math.min(...v):0)*.3+f.filter(n=>n<0).length*.6+gaps*6+(played.length<4?6:played.length<5?2:0)};all.sort((a,b)=>score(a)-score(b));const fixed=standard(s),result=[...fixed,...all.filter(f=>!fixed.some(x=>x.join(',')===f.join(',')))].slice(0,16);cache.set(label,result);return result;}
function piano(label,width=270){const s=spec(label);if(!s)return '';const rootNote=60+s.root,keys=s.intervals.map(i=>rootNote+i),bass=s.bass==null?null:rootNote-1-mod(rootNote-1-s.bass);if(bass!=null)keys.push(bass);const start=Math.floor(Math.min(...keys)/12)*12,end=Math.max(start+24,Math.ceil((Math.max(...keys)+1)/12)*12),white=[0,2,4,5,7,9,11],whites=Array.from({length:end-start},(_,i)=>start+i).filter(n=>white.includes(mod(n))),keyW=16,total=whites.length*keyW,isOn=n=>keys.includes(n);let svg='<svg class="piano-diagram" viewBox="0 0 '+total+' 90" width="'+width+'" role="img" aria-label="Piano chord '+String(label).replace(/[&<>"']/g,'')+'">';
 for(let i=0;i<whites.length;i++){const n=whites[i];svg+='<rect x="'+i*keyW+'" y="0" width="16" height="78" rx="2" fill="'+(isOn(n)?'var(--app-accent)':'#f4f2eb')+'" stroke="#555"/>';if(isOn(n))svg+='<circle cx="'+(i*keyW+8)+'" cy="66" r="3" fill="#15202a"/>';}
 for(let n=start;n<end;n++){if(white.includes(mod(n)))continue;const x=whites.filter(k=>k<n).length*keyW-5;svg+='<rect x="'+x+'" y="0" width="10" height="46" rx="1" fill="'+(isOn(n)?'var(--app-accent)':'#242424')+'" stroke="#555"/>';if(isOn(n))svg+='<circle cx="'+(x+5)+'" cy="37" r="2" fill="#15202a"/>';}
 return svg+'</svg>';}
function configure(o={}){if(typeof o.majAsMaj7==='boolean'&&o.majAsMaj7!==majAs7){majAs7=o.majAsMaj7;cache.clear();return true}return false}
root.StageChords={VERSION,patterns,aliases,spec,valid,guitar,piano,standard,configure};
})(typeof window!=='undefined'?window:globalThis);
