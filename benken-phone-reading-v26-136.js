(function(root){
 'use strict';const song=document.getElementById('song');if(!song)return;let queued=false,top=Infinity;
 function update(){
  queued=false;const height=root.visualViewport?.height||root.innerHeight;
  if(root.innerWidth>700){top=Infinity;song.style.removeProperty('clip-path');return}
  const controls=[...document.querySelectorAll('.compact-navigation button,#performanceBar')];
  top=controls.reduce((edge,el)=>{const box=el.getBoundingClientRect(),style=getComputedStyle(el);return box.width&&box.height&&style.visibility!=='hidden'&&style.display!=='none'&&Number(style.opacity)!==0&&box.top<height&&box.bottom>0?Math.min(edge,box.top):edge},height);
  const box=song.getBoundingClientRect(),bottom=Math.min(box.height,Math.max(0,box.bottom-(top-8))),clip=bottom>0?'inset(0px 0px '+bottom+'px 0px)':'';
  if(song.style.clipPath!==clip)song.style.clipPath=clip;
 }
 function schedule(){if(!queued){queued=true;root.requestAnimationFrame(update)}}
 root.addEventListener('resize',schedule);document.addEventListener('scroll',schedule,true);root.visualViewport?.addEventListener('resize',schedule);root.visualViewport?.addEventListener('scroll',schedule);
 const observer=new ResizeObserver(schedule);for(const el of [song,document.getElementById('performanceBar'),document.querySelector('.dock-tools')])if(el)observer.observe(el);
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class','data-controls-placement']});
 root.StagePhoneReading={controlTop:()=>top};schedule();
})(window);
