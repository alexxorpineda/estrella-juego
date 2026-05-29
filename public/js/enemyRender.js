"use strict";

function drawEnemies(){
  for(const e of enemies){
    const sx=e.x-camX, sy=e.y-camY;
    if(sx<-160||sx>cv.width+160||sy<-160||sy>cv.height+160) continue;
    cx.save();
    if(e.hitFlash>0) cx.globalAlpha=.55;
    cx.fillStyle="rgba(0,0,0,.25)"; cx.beginPath(); cx.ellipse(sx,sy+e.size*.7,e.size*.9,3,0,0,Math.PI*2); cx.fill();
    cx.shadowColor=e.glow; cx.shadowBlur=e.isMiniBoss?28:14;
    cx.fillStyle=e.color; cx.beginPath(); cx.arc(sx,sy,e.size,0,Math.PI*2); cx.fill();
    cx.fillStyle=rgba(e.glow,.55); cx.beginPath(); cx.arc(sx,sy,e.size*.6,0,Math.PI*2); cx.fill();
    cx.shadowBlur=0;
    cx.fillStyle="#fff"; cx.beginPath(); cx.arc(sx+e.size*.3,sy-e.size*.15,e.size*.18,0,Math.PI*2); cx.fill();
    cx.fillStyle="#000"; cx.beginPath(); cx.arc(sx+e.size*.35,sy-e.size*.15,e.size*.09,0,Math.PI*2); cx.fill();
    if(e.isMiniBoss){
      for(let k=0;k<5;k++){
        const a=e.phase+k*Math.PI*2/5;
        crystalPoly(cx,sx+Math.cos(a)*e.size*1.1,sy+Math.sin(a)*e.size*.7,e.size*.14,e.size*.42,e.glow);
      }
    }
    cx.globalAlpha=1; cx.restore();
    if(e.hp<e.maxHp||e.isMiniBoss){
      const bw=e.size*2+12, x=sx-bw/2, y=sy-e.size-16;
      cx.fillStyle="rgba(0,0,0,.65)"; cx.fillRect(x,y,bw,5);
      const ratio=clamp(e.hp/e.maxHp,0,1);
      cx.fillStyle=ratio>.55?"#22c55e":ratio>.25?"#f59e0b":"#ef4444"; cx.fillRect(x,y,bw*ratio,5);
      if(e.isMiniBoss){
        cx.fillStyle="#fbbf24"; cx.font="bold 8px Courier New"; cx.textAlign="center";
        cx.fillText("âš  "+e.name,sx,y-4); cx.textAlign="left";
      }
    }
  }
}

function drawBoss(){
  if(!boss) return;
  const sx=boss.x-camX, sy=boss.y-camY, s=boss.size;
  if(sx<-220||sx>cv.width+220||sy<-220||sy>cv.height+220) return;
  cx.save(); cx.shadowColor=boss.glow; cx.shadowBlur=boss.enraged?48:34;
  cx.fillStyle=boss.color; cx.beginPath(); cx.ellipse(sx,sy,s,s*.68,Math.sin(boss.phase)*.08,0,Math.PI*2); cx.fill();
  cx.fillStyle=mix(boss.color,"#020617",.36); cx.beginPath(); cx.ellipse(sx,sy+s*.12,s*.72,s*.46,0,0,Math.PI*2); cx.fill();
  for(let i=0;i<8;i++){ const a=boss.phase+i*Math.PI*2/8; crystalPoly(cx,sx+Math.cos(a)*s*.78,sy+Math.sin(a)*s*.48,s*.16,s*.52,boss.glow); }
  if(boss.enraged){
    cx.fillStyle=rgba(boss.glow,.65);
    cx.beginPath(); cx.moveTo(sx-s*.5,sy-s*.25); cx.lineTo(sx-s*1.9,sy-s*1.05); cx.lineTo(sx-s*.85,sy+s*.10); cx.closePath(); cx.fill();
    cx.beginPath(); cx.moveTo(sx+s*.5,sy-s*.25); cx.lineTo(sx+s*1.9,sy-s*1.05); cx.lineTo(sx+s*.85,sy+s*.10); cx.closePath(); cx.fill();
  }
  cx.fillStyle="#fff"; cx.beginPath(); cx.arc(sx-s*.28,sy-s*.15,s*.13,0,Math.PI*2); cx.fill();
  cx.fillStyle="#000"; cx.beginPath(); cx.arc(sx-s*.25,sy-s*.15,s*.06,0,Math.PI*2); cx.fill();
  cx.fillStyle="#fff"; cx.beginPath(); cx.arc(sx+s*.28,sy-s*.15,s*.13,0,Math.PI*2); cx.fill();
  cx.fillStyle="#000"; cx.beginPath(); cx.arc(sx+s*.31,sy-s*.15,s*.06,0,Math.PI*2); cx.fill();
  cx.restore(); cx.shadowBlur=0;
}
