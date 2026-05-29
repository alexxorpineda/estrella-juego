"use strict";

function aiWalker(e,dx,dy,dist){
  const dir=Math.sign(dx)||1; e.vx=lerp(e.vx,dir*e.speed,.06);
  if(e.onGround&&Math.random()<.008) e.vy=-5;
}
function aiChaser(e,dx,dy,dist){
  const dir=Math.sign(dx)||1; e.vx=lerp(e.vx,dir*e.speed*1.15,.08);
  if(e.onGround&&dy<-30&&Math.random()<.06) e.vy=-8;
}
function aiJumper(e,dx,dy,dist){
  const dir=Math.sign(dx)||1; e.vx=lerp(e.vx,dir*e.speed,.05);
  if(e.onGround&&e.atkCool<=0&&dist<260){
    e.vx=dir*e.speed*2.8; e.vy=-9.5-Math.random()*3; e.atkCool=80+Math.floor(Math.random()*45); sfx.jump();
  }
}
function aiFlyer(e,dx,dy,dist){
  const nx=dx/Math.max(1,dist),ny=dy/Math.max(1,dist);
  e.vx+=nx*e.speed*.10; e.vy+=ny*e.speed*.08; e.vx*=.94; e.vy*=.94;
  if(e.attack==="ranged"&&e.projCool<=0&&dist<420){ fireEnemyProjectile(e,dx,dy,dist); e.projCool=88+Math.floor(Math.random()*55); }
  if(e.attack==="ram"&&e.atkCool<=0&&dist<290){ e.vx+=nx*e.speed*5.5; e.vy+=ny*e.speed*3.8; e.atkCool=120; }
}
function aiCave(e,dx,dy,dist){
  const dir=Math.sign(dx)||1; e.vx=lerp(e.vx,dir*e.speed*.9,.07);
  if(e.onGround&&dy<-22&&Math.random()<.04) e.vy=-7.5;
  if(dist<140&&e.atkCool<=0){ damagePlayer(e.damage+2,e); P.poison=Math.max(P.poison||0,180); e.atkCool=120; }
}
function aiGuardian(e,dx,dy,dist){
  const dir=Math.sign(dx)||1; e.vx=lerp(e.vx,dir*e.speed*.72,.05);
  if(e.onGround&&dy<-34&&Math.random()<.035) e.vy=-8.5;
  if(e.atkCool<=0&&dist<95){
    const px=P.x+P.w/2,py=P.y+P.h/2;
    if(Math.hypot(px-e.x,py-e.y)<90) damagePlayer(e.damage*1.45,e);
    burst(e.x,e.y,18,e.glow); e.atkCool=125; sfx.boom();
  }
}
function aiElite(e,dx,dy,dist){
  const dir=Math.sign(dx)||1;
  if(e.move==="fly"||e.move==="swim") aiFlyer(e,dx,dy,dist);
  else{ e.vx=lerp(e.vx,dir*e.speed*.95,.07); if(e.onGround&&dy<-30&&Math.random()<.05) e.vy=-8.8; }
  if(e.attack==="ranged"&&e.projCool<=0&&dist<480){ fireEnemyProjectile(e,dx,dy,dist); e.projCool=70+Math.floor(Math.random()*50); }
  if(e.attack==="area"&&e.atkCool<=0&&dist<105){
    const px=P.x+P.w/2,py=P.y+P.h/2;
    if(Math.hypot(px-e.x,py-e.y)<105) damagePlayer(e.damage*1.35,e);
    burst(e.x,e.y,14,e.glow); e.atkCool=110;
  }
}
function aiTurret(e,dx,dy,dist){
  e.vx*=.82;
  if(e.projCool<=0&&dist<420){ fireEnemyProjectile(e,dx,dy,dist); e.projCool=95+Math.floor(Math.random()*60); }
}
function aiFleeShooter(e,dx,dy,dist){
  const nx=dx/Math.max(1,dist),ny=dy/Math.max(1,dist);
  if(dist<230){ e.vx-=nx*e.speed*.16; e.vy-=ny*e.speed*.14; }
  else{ e.vx+=nx*e.speed*.05; e.vy+=ny*e.speed*.04; }
  e.vx*=.95; e.vy*=.95;
  if(e.projCool<=0&&dist<500){ fireEnemyProjectile(e,dx,dy,dist); e.projCool=62+Math.floor(Math.random()*45); }
}
function aiMiniBoss(e,dx,dy,dist){
  const nx=dx/Math.max(1,dist),ny=dy/Math.max(1,dist);
  if(e.chargeTimer>0){ e.vx+=e.chargeDir*e.speed*.38; e.chargeTimer--; }
  else{
    if(e.move==="fly"||e.move==="swim"){ e.vx+=nx*e.speed*.08; e.vy+=ny*e.speed*.07; }
    else{ e.vx=lerp(e.vx,Math.sign(dx)*e.speed*.92,.06); if(e.onGround&&dy<-38&&Math.random()<.05) e.vy=-10; }
  }
  if(e.projCool<=0&&dist<620){
    const shots=3+Math.floor(P.level/3);
    for(let i=0;i<shots;i++){ const spread=(i-(shots-1)/2)*.22; fireEnemyProjectile(e,dx+Math.sin(spread)*110,dy+Math.cos(spread)*80,dist); }
    e.projCool=90; sfx.shoot();
  }
  if(e.atkCool<=0){
    if(dist<135){
      const px=P.x+P.w/2,py=P.y+P.h/2;
      if(Math.hypot(px-e.x,py-e.y)<145) damagePlayer(e.damage*1.65,e);
      burst(e.x,e.y,22,e.glow); e.atkCool=145;
    }else if(dist<340){ e.chargeDir=Math.sign(dx)||1; e.chargeTimer=26; e.atkCool=155; sfx.boom(); }
  }
  if(e.hp<e.maxHp*.45) e.speed=e.def.speed*1.25;
}

/* â”€â”€ Movement physics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function moveEnemy(e){
  const flying=e.move==="fly"||e.move==="swim"||e.move==="rooted";
  if(!flying) e.vy=Math.min(e.vy+GRAV*.48,18); else e.vy+=Math.sin(e.phase)*.025;
  if(e.move==="rooted"){ e.vx*=.4; e.vy*=.3; }
  e.vx=clamp(e.vx,-7,7); e.vy=clamp(e.vy,-14,14);
  e.x+=e.vx;
  if(!flying){
    const dir=Math.sign(e.vx);
    if(dir!==0){
      const tx=Math.floor((e.x+dir*e.size*.72)/T),ty1=Math.floor((e.y-e.size*.55)/T),ty2=Math.floor((e.y+e.size*.35)/T);
      if(solid(getBlock(tx,ty1))||solid(getBlock(tx,ty2))){ e.x-=e.vx; e.vx*=-.35; if(e.onGround) e.vy=-5.5; }
    }
  }
  e.y+=e.vy;
  if(!flying){
    const footY=Math.floor((e.y+e.size*.65)/T),leftX=Math.floor((e.x-e.size*.42)/T),rightX=Math.floor((e.x+e.size*.42)/T);
    if(e.vy>=0&&(solid(getBlock(leftX,footY))||solid(getBlock(rightX,footY)))){ e.y=footY*T-e.size*.66; e.vy=0; e.onGround=true; }
    else e.onGround=false;
  }
}

/* â”€â”€ Projectile firing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function fireEnemyProjectile(e,dx,dy,dist){
  const d=Math.max(1,dist), spd=e.isMiniBoss?5.8:e.elite?5.1:4.3;
  projectiles.push({
    x:e.x,y:e.y, vx:(dx/d)*spd, vy:(dy/d)*spd,
    type:"enemy", damage:Math.max(1,Math.floor(e.damage*.75)),
    r:e.isMiniBoss?7:5, col:e.glow, life:e.isMiniBoss?110:85,
    poison:e.attack==="poison"?160:0
  });
  sfx.shoot();
}
