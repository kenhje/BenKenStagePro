(function(root){
 'use strict';const song=document.getElementById('song');if(!song)return;let queued=false;
 function visible(el){
  for(let node=el;node&&node!==document;node=node.parentElement){const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false}
  const box=el.getBoundingClientRect();return box.width>0&&box.height>0&&box.top<root.innerHeight&&box.bottom>0;
 }
 function set(name,value){const next=value+'px';if(song.style.getPropertyValue(name)!==next)song.style.setProperty(name,next)}
 function update(){
  queued=false;song.style.removeProperty('clip-path');
  const area=song.getBoundingClientRect(),middle=root.innerWidth/2;let left=0,right=0;
  const buttons=document.querySelectorAll('#performanceHome>#performanceBar.side-rail .performance-action');
  for(const el of buttons){
   if(!visible(el))continue;const box=el.getBoundingClientRect();
   if(box.right<=middle)left=Math.max(left,box.right+8-area.left);
   else if(box.left>=middle)right=Math.max(right,area.right-box.left+8);
  }
  set('--phone-lyrics-left',Math.max(0,Math.ceil(left)));set('--phone-lyrics-right',Math.max(0,Math.ceil(right)));
 }
 function schedule(){if(!queued){queued=true;root.requestAnimationFrame(update)}}
 root.addEventListener('resize',schedule);document.addEventListener('scroll',schedule,true);root.visualViewport?.addEventListener('resize',schedule);
 const resize=new ResizeObserver(schedule);for(const el of [song,document.getElementById('performanceBar'),document.querySelector('.dock-tools')])if(el)resize.observe(el);
 const changes=new MutationObserver(schedule);changes.observe(document.body,{attributes:true,attributeFilter:['class','data-controls-placement']});
 for(const el of [document.querySelector('.compact-navigation'),document.getElementById('performanceBar')])if(el)changes.observe(el,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
 root.StagePhoneReading={refresh:schedule};schedule();
})(window);
