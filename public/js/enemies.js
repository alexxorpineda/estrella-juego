"use strict";

/* â”€â”€ Spawning â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function chooseEnemyDef(planet,bId,depth){
  let pool=ENEMY_DB.filter(function(e){ return e.planet===planet&&depth>=e.depthMin&&depth<=e.depthMax&&(!e.biomes||e.biomes.includes(bId)); });
  if(!pool.length) pool=ENEMY_DB.filter(function(e){ return e.planet===planet; });
  if(!pool.length) return ENEMY_DB[0];
  const weights=pool.map(function(e){ return e.rare; });
  const total=weights.reduce(function(a,b){ return a+b; },0);
  let r=Math.random()*total;
  for(let i=0;i<pool.length;i++){ r-=weights[i]; if(r<=0) return pool[i]; }
  return pool[pool.length-1];
}
function findEnemySpawn(planet,bId,depth){
  for(let i=0;i<16;i++){
    const ox=(Math.random()-.5)*cv.width*1.2, oy=(Math.random()-.5)*cv.height*.9;
    const ex=P.x+ox, ey=P.y+oy;
    if(Math.hypot(ox,oy)<140) continue;
    const tx=Math.floor(ex/T), ty=Math.floor(ey/T);
    if(!solid(getBlock(tx,ty))&&solid(getBlock(tx,ty+1))) return{ x:ex, y:ey };
    if(!solid(getBlock(tx,ty))) return{ x:ex, y:ey };
  }
  return null;
}
function buildEnemy(def,x,y){
  const elite=Math.random()<.06;
  return{
    x:x,y:y,vx:0,vy:0,onGround:false,
    hp:def.hp*(elite?1.9:1), maxHp:def.hp*(elite?1.9:1),
    damage:def.damage*(elite?1.45:1), speed:def.speed*(elite?1.22:1), size:def.size*(elite?1.3:1),
    color:def.color, glow:def.glow, move:def.move, ai:def.ai, attack:def.attack,
    planet:def.planet, biome:biomeIdAt(Math.floor(x/T)),
    elite:elite, isMiniBoss:def.ai==="miniboss",
    xp:def.xp*(elite?2:1), drops:def.drops,
    provoked:false, hitFlash:0, phase:Math.random()*Math.PI*2,
    atkCool:0, projCool:0, chargeTimer:0, chargeDir:1, def:def, name:def.name
  };
}
function spawnEnemyNearPlayer(){
  const tx=Math.floor(P.x/T), bId=biomeIdAt(tx), depth=Math.max(0,Math.floor(P.y/T)-surfaceAt(tx));
  const def=chooseEnemyDef(P.planet,bId,depth);
  const pos=findEnemySpawn(P.planet,bId,depth); if(!pos) return;
  enemies.push(buildEnemy(def,pos.x,pos.y));
}
function seedInitialEnemies(){
  const count=4+Math.floor(P.level*.6);
  for(let i=0;i<count;i++) spawnEnemyNearPlayer();
}

/* â”€â”€ Update loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function updateEnemies(){
  if(tick%85===0&&enemies.length<14+Math.floor(P.level*.8)) spawnEnemyNearPlayer();
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];
    if(e.hitFlash>0) e.hitFlash--;
    e.phase+=.028+e.speed*.008;
    e.atkCool=Math.max(0,e.atkCool-1); e.projCool=Math.max(0,e.projCool-1);
    const dx=(P.x+P.w/2)-e.x, dy=(P.y+P.h/2)-e.y, dist=Math.hypot(dx,dy);
    if(dist<420) e.provoked=true;
    if(dist>1800){ enemies.splice(i,1); continue; }
    if(e.provoked){
      if(e.ai==="walker")       aiWalker(e,dx,dy,dist);
      else if(e.ai==="chaser")  aiChaser(e,dx,dy,dist);
      else if(e.ai==="jumper")  aiJumper(e,dx,dy,dist);
      else if(e.ai==="flyer"||e.ai==="aquatic") aiFlyer(e,dx,dy,dist);
      else if(e.ai==="cave")    aiCave(e,dx,dy,dist);
      else if(e.ai==="guardian") aiGuardian(e,dx,dy,dist);
      else if(e.ai==="elite")   aiElite(e,dx,dy,dist);
      else if(e.ai==="turret")  aiTurret(e,dx,dy,dist);
      else if(e.ai==="flee_shooter") aiFleeShooter(e,dx,dy,dist);
      else if(e.ai==="miniboss") aiMiniBoss(e,dx,dy,dist);
      else aiChaser(e,dx,dy,dist);
    }else{ e.vx*=.96; if(Math.random()<.012) e.vx=(Math.random()-.5)*e.speed*1.8; }
    moveEnemy(e);
    if(dist<e.size+13){
      let poison=0; if(e.attack==="poison"||e.attack==="burn") poison=180;
      damagePlayer(e.damage,e); if(poison>0) P.poison=Math.max(P.poison||0,poison);
    }
    if(e.hp<=0) killEnemy(i);
  }
}

/* â”€â”€ Combat results â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function hurtEnemy(e,dmg,dir){
  dir=dir||1;
  const crit=Math.random()<.08+Math.min(.12,P.level*.006), final=crit?Math.floor(dmg*1.75):dmg;
  e.hp-=final; e.hitFlash=8; e.provoked=true; e.vx+=dir*2.2; e.vy-=1.5;
  burst(e.x,e.y,crit?10:5,crit?"#fbbf24":e.glow);
  if(crit) msg("CRÃTICO "+final,"#fbbf24");
  sfx.hit();
}
function killEnemy(i){
  const e=enemies[i]; if(!e) return;
  const danger=BIOMES[e.biome]?.danger||1;
  burst(e.x,e.y,e.isMiniBoss?42:16,e.glow);
  coins+=(e.isMiniBoss?120:5)+Math.floor(Math.random()*8)+danger*4;
  gainXP(e.xp||8);
  for(const drop of e.drops){ const mat=drop[0],amount=drop[1],ch=drop[2]; if(Math.random()<ch) inv[mat]=(inv[mat]||0)+amount; }
  if(e.isMiniBoss){ inv.esencia+=4; inv.plasma+=3; rollEnemySpecialDrop(e,true); showBanner(e.name+" derrotado"); msg("Mini-boss derrotado","#fbbf24"); sfx.level(); }
  else{ rollEnemySpecialDrop(e,false); sfx.mine(); }
  enemies.splice(i,1); updateHUD();
}
function rollEnemySpecialDrop(e,force){
  force=force||false;
  const ch=force?.85:(e.elite?.11:.035);
  if(Math.random()>ch) return;
  const pools={Lumora:["crystal_sword","prism_bow","astral_blade"],Vulkar:["plasma_lance","astral_blade"],Noctara:["void_staff","astral_blade"],Auroria:["gaia_hammer","prism_bow"],Zephyrion:["prism_bow","astral_blade"],Abyssalon:["plasma_lance","void_staff"]};
  const pool=pools[e.planet]||[]; if(!pool.length) return;
  const id=pool[Math.floor(Math.random()*pool.length)], item=ENEMY_SPECIAL_DROPS[id];
  if(item) showDrop(item,"weapon");
}

/* â”€â”€ Projectiles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function updateProjectiles(){
  for(let i=projectiles.length-1;i>=0;i--){
    const pr=projectiles[i]; pr.x+=pr.vx; pr.y+=pr.vy; pr.life--;
    if(pr.life<=0){ projectiles.splice(i,1); continue; }
    if(solid(getBlock(Math.floor(pr.x/T),Math.floor(pr.y/T)))){ burst(pr.x,pr.y,5,pr.col); projectiles.splice(i,1); continue; }
    if(pr.type==="player"){
      if(boss&&Math.hypot(pr.x-boss.x,pr.y-boss.y)<boss.size+pr.r){ boss.hp-=pr.damage; burst(pr.x,pr.y,9,pr.col); projectiles.splice(i,1); continue; }
      let consumed=false;
      for(let j=enemies.length-1;j>=0;j--){
        const e=enemies[j];
        if(Math.hypot(pr.x-e.x,pr.y-e.y)<e.size+pr.r){ hurtEnemy(e,pr.damage,Math.sign(pr.vx)||1); if(e.hp<=0) killEnemy(j); burst(pr.x,pr.y,7,pr.col); projectiles.splice(i,1); consumed=true; break; }
      }
      if(consumed) continue;
    }else{
      const px=P.x+P.w/2, py=P.y+P.h/2;
      if(Math.hypot(pr.x-px,pr.y-py)<pr.r+13){ if(pr.poison>0) P.poison=Math.max(P.poison||0,pr.poison); damagePlayer(pr.damage,{x:pr.x,y:pr.y}); burst(pr.x,pr.y,7,pr.col); projectiles.splice(i,1); continue; }
    }
  }
  if(projectiles.length>360) projectiles.splice(0,projectiles.length-360);
}
function drawProjectiles(){
  for(const pr of projectiles){
    const sx=pr.x-camX, sy=pr.y-camY;
    if(sx<-50||sx>cv.width+50||sy<-50||sy>cv.height+50) continue;
    cx.shadowColor=pr.col; cx.shadowBlur=pr.r*3; cx.fillStyle=pr.col; cx.beginPath(); cx.arc(sx,sy,pr.r,0,Math.PI*2); cx.fill();
    cx.strokeStyle=rgba(pr.col,.45); cx.lineWidth=2; cx.beginPath(); cx.moveTo(sx,sy); cx.lineTo(sx-pr.vx*2,sy-pr.vy*2); cx.stroke();
    cx.shadowBlur=0;
  }
}

/* â”€â”€ Boss â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function spawnBoss(){
  if(bossFight||boss) return;
  const tx=Math.floor(P.x/T)+22, b=biomeAt(tx), ground=surfaceAt(tx)*T;
  boss={
    name:"TITÃN DEL BIOMA", x:tx*T, y:ground-90, vx:0, vy:0,
    hp:900+(b.danger||1)*220+P.level*40, maxHp:900+(b.danger||1)*220+P.level*40,
    size:58+(b.danger||1)*5, damage:20+(b.danger||1)*4,
    color:b.accent, glow:b.glow2, phase:0, enraged:false, cool:90, slamCool:160
  };
  bossFight=true;
  document.getElementById("bossWrap").style.display="block";
  document.getElementById("bossName").textContent="âš  TITÃN â€” "+(b.name||"").toUpperCase();
  showBanner("BOSS DESPERTADO"); msg("El TitÃ¡n del bioma ha aparecido","#fbbf24"); sfx.boom();
}
function updateBoss(){
  if(!boss) return; boss.phase+=.035;
  const px=P.x+P.w/2, py=P.y+P.h/2, dx=px-boss.x, dy=py-boss.y, dist=Math.hypot(dx,dy);
  if(!boss.enraged&&boss.hp<boss.maxHp*.45){ boss.enraged=true; boss.damage+=7; boss.size+=6; showBanner("FASE 2"); msg("TitÃ¡n en furia","#ef4444"); sfx.boom(); }
  const sp=boss.enraged?1.55:1.05, nx=dx/Math.max(1,dist), ny=dy/Math.max(1,dist);
  boss.vx=boss.vx*.92+nx*sp; boss.vy=boss.vy*.92+ny*sp*.45; boss.vy+=.20; boss.x+=boss.vx; boss.y+=boss.vy;
  const ground=surfaceAt(Math.floor(boss.x/T))*T;
  if(boss.y>ground-boss.size*.70){ boss.y=ground-boss.size*.70; boss.vy=-4.5-Math.random()*2; }
  boss.cool--; boss.slamCool--;
  if(boss.cool<=0){
    const shots=boss.enraged?8:5, a0=Math.atan2(dy,dx);
    for(let i=0;i<shots;i++){
      const a=a0+(i-(shots-1)/2)*.24;
      projectiles.push({ x:boss.x,y:boss.y-boss.size*.18, vx:Math.cos(a)*6.2, vy:Math.sin(a)*6.2, type:"boss", damage:Math.max(3,boss.damage-P.defense), r:7, col:boss.glow, life:115, poison:0 });
    }
    boss.cool=boss.enraged?52:78; sfx.shoot();
  }
  if(boss.slamCool<=0&&dist<190){ burst(boss.x,boss.y,32,boss.glow); if(dist<170) damagePlayer(boss.damage*1.6,{x:boss.x,y:boss.y}); boss.slamCool=boss.enraged?90:135; sfx.boom(); }
  if(dist<boss.size+18) damagePlayer(boss.damage,{x:boss.x,y:boss.y});
  const bf=document.getElementById("bossFill"); if(bf) bf.style.width=clamp(boss.hp/boss.maxHp,0,1)*100+"%";
  if(boss.hp<=0){
    burst(boss.x,boss.y,90,boss.glow); coins+=360; inv.esencia+=10; inv.plasma+=8; inv.cristal+=8; gainXP(220);
    showBanner("TITÃN DERROTADO"); msg("+360 monedas Â· +10 esencia Â· +8 plasma","#fbbf24");
    if(chance(.85)){ const pool=["plasma_lance","void_staff","astral_blade","gaia_hammer"]; showDrop(ENEMY_SPECIAL_DROPS[pool[Math.floor(Math.random()*pool.length)]],"weapon"); }
    boss=null; bossFight=false; document.getElementById("bossWrap").style.display="none"; sfx.level();
  }
}
