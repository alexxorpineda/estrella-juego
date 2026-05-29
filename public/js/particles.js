"use strict";

function burst(x,y,n,col){
  n=n||10; col=col||"#ffffff";
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, sp=.8+Math.random()*4.4;
    particles.push({
      x:x, y:y,
      vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-Math.random()*1.2,
      r:1+Math.random()*3, life:24+Math.floor(Math.random()*36),
      maxLife:60, col:col, grav:.04+Math.random()*.08
    });
  }
}

function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.grav;
    p.vx*=.985; p.vy*=.985; p.life--;
    if(p.life<=0) particles.splice(i,1);
  }
  if(particles.length>650) particles.splice(0,particles.length-650);
}

function drawParticles(){
  cx.save();
  for(const p of particles){
    const sx=p.x-camX, sy=p.y-camY;
    if(sx<-30||sx>cv.width+30||sy<-30||sy>cv.height+30) continue;
    const a=clamp(p.life/60,0,1);
    cx.globalAlpha=a; cx.shadowColor=p.col; cx.shadowBlur=p.r*3;
    cx.fillStyle=p.col; cx.beginPath(); cx.arc(sx,sy,p.r,0,Math.PI*2); cx.fill();
  }
  cx.restore(); cx.globalAlpha=1;
}
