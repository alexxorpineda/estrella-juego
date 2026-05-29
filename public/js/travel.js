"use strict";

/* â”€â”€ Meteors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function spawnMeteors(n){
  n=n||3;
  for(let i=0;i<n;i++) meteors.push({ x:P.x+(Math.random()-.5)*850, y:camY-180-Math.random()*260, vx:(Math.random()-.5)*3.6, vy:5.2+Math.random()*4.5, r:5+Math.random()*9, col:chance(.5)?"#f97316":"#fde047" });
}
function updateMeteors(){
  for(let i=meteors.length-1;i>=0;i--){
    const m=meteors[i]; m.x+=m.vx; m.y+=m.vy;
    const tx=Math.floor(m.x/T), ty=Math.floor(m.y/T);
    if(solid(getBlock(tx,ty))||m.y>camY+cv.height+180){
      burst(m.x,m.y,18,m.col); sfx.boom();
      if(chance(.35)) setBlock(tx,ty,TILE.LAVA); else if(chance(.45)) setBlock(tx,ty,TILE.PLASMA);
      if(Math.hypot(m.x-(P.x+P.w/2),m.y-(P.y+P.h/2))<52) damagePlayer(18,{x:m.x,y:m.y});
      meteors.splice(i,1);
    }
  }
}
function drawMeteors(){
  for(const m of meteors){
    const sx=m.x-camX, sy=m.y-camY;
    cx.shadowColor=m.col; cx.shadowBlur=18; cx.fillStyle=m.col; cx.beginPath(); cx.arc(sx,sy,m.r,0,Math.PI*2); cx.fill();
    cx.fillStyle="rgba(255,255,255,.40)"; cx.beginPath(); cx.arc(sx-m.vx*2,sy-m.vy*2,m.r*.45,0,Math.PI*2); cx.fill();
    cx.strokeStyle=rgba(m.col,.50); cx.lineWidth=3; cx.beginPath(); cx.moveTo(sx,sy); cx.lineTo(sx-m.vx*7,sy-m.vy*7); cx.stroke();
    cx.shadowBlur=0;
  }
}

/* â”€â”€ World events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function triggerEvent(type){
  activeEvent=type; eventTimer=0;
  if(type==="meteor"){ showBanner("â˜„ LLUVIA DE METEORITOS"); for(let i=0;i<6;i++) setTimeout(function(){ spawnMeteors(3); },i*420); }
  else if(type==="invasion"){ showBanner("ðŸ’€ INVASIÃ“N DEL BIOMA"); for(let i=0;i<9;i++) spawnEnemyNearPlayer(); }
  else if(type==="aurora"){ showBanner("ðŸŒŒ AURORA ENERGÃ‰TICA"); P.mana=P.maxMana; inv.esencia+=1; burst(P.x,P.y,40,"#a78bfa"); }
  else if(type==="storm") showBanner("âš¡ TORMENTA CÃ“SMICA");
}
function updateEvents(){
  if(!activeEvent){
    nextEvent--;
    if(nextEvent<=0){ const pool=["meteor","invasion","aurora","storm"]; triggerEvent(pool[Math.floor(Math.random()*pool.length)]); nextEvent=2300+Math.floor(Math.random()*3200); }
    return;
  }
  eventTimer++;
  const dur={ meteor:430, invasion:900, aurora:900, storm:650 }[activeEvent]||700;
  if(activeEvent==="storm"&&eventTimer%120===0){
    const px=P.x+(Math.random()-.5)*600; burst(Math.floor(px/T)*T,surfaceAt(Math.floor(px/T))*T,18,"#e0f2fe");
    if(Math.abs(px-P.x)<70) damagePlayer(10,{x:px,y:P.y}); sfx.boom();
  }
  if(eventTimer>dur) activeEvent=null;
}

/* â”€â”€ Interplanetary travel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function startTravel(planet){
  if(planet===P.planet){ msg("Ya estÃ¡s en "+planet,"#64748b"); return; }
  if(P.fuel<18){ msg("Combustible insuficiente","#ef4444"); return; }
  P.fuel-=18; travelMode=true; travelTimer=0; targetPlanet=planet; shipShield=100;
  shipEnemies.length=0; shipLasers.length=0;
  const amount=4+Math.floor(P.level*.45)+Math.floor(Math.random()*3);
  for(let i=0;i<amount;i++) shipEnemies.push({ x:80+Math.random()*(cv.width-160), y:-80-i*(110+Math.random()*80), vx:(Math.random()-.5)*2.2, vy:1.5+Math.random()*1.4, hp:26+P.level*4, maxHp:26+P.level*4, cool:20+Math.floor(Math.random()*80) });
  togglePlanets(false); showBanner("DESPEGUE"); msg("Rumbo a "+planet,"#22d3ee"); sfx.level();
}
function updateTravel(){
  travelTimer++;
  updateSpaceCombat();
  if(travelTimer>=TRAVEL_DUR) finishTravel();
}
function finishTravel(){
  P.planet=targetPlanet; P.gravity=PLANETS[P.planet].gravity;
  P.x=260; P.y=80; P.vx=0; P.vy=0; P.oxygen=100; P.timeOnPlanet=0; P.fuel=Math.min(100,P.fuel+10);
  world.clear(); setPlanetSeed();
  const h=surfaceAt(12); setBlock(12,h-1,TILE.CHEST); setBlock(16,h-1,TILE.STATION);
  enemies.length=0; projectiles.length=0; meteors.length=0; particles.length=0;
  boss=null; bossFight=false; document.getElementById("bossWrap").style.display="none";
  seedInitialEnemies(); travelMode=false; travelTimer=0;
  showBanner(PLANETS[P.planet].icon+" "+P.planet);
  msg("Bienvenido a "+P.planet+": "+PLANETS[P.planet].desc,"#22d3ee");
}
function drawTravel(){
  const prog=clamp(travelTimer/TRAVEL_DUR,0,1), warp=prog<.18?prog/.18:prog>.84?(1-prog)/.16:1;
  cx.fillStyle="#010610"; cx.fillRect(0,0,cv.width,cv.height);
  const ncols=["#7c3aed","#06b6d4","#f97316","#22c55e"];
  for(let i=0;i<4;i++){
    const col=ncols[i], x=cv.width*(.18+i*.23)+Math.sin(tick*.01+i)*80, y=cv.height*(.16+i*.11);
    const g=cx.createRadialGradient(x,y,0,x,y,160+warp*130);
    g.addColorStop(0,rgba(col,.18)); g.addColorStop(1,"rgba(0,0,0,0)");
    cx.fillStyle=g; cx.fillRect(0,0,cv.width,cv.height);
  }
  cx.save();
  for(let i=0;i<260;i++){
    const x=(i*97+Math.sin(i*5.7)*900+cv.width*4)%cv.width, y=(i*53+tick*(3+warp*9+(i%5)))%cv.height, len=8+warp*(40+(i%4)*20);
    cx.strokeStyle="rgba(255,255,255,"+(.25+warp*.50)+")"; cx.lineWidth=1+warp*.8;
    cx.beginPath(); cx.moveTo(x,y-len); cx.lineTo(x,y); cx.stroke();
  }
  cx.restore();
  drawSpaceCombat(cv.width/2, cv.height*.68);
  const sx=cv.width/2, sy=cv.height*.68+Math.sin(tick*.05)*5;
  cx.fillStyle="#334155";
  cx.beginPath(); cx.moveTo(sx-14,sy+12); cx.lineTo(sx-58,sy+38); cx.lineTo(sx-20,sy-5); cx.closePath(); cx.fill();
  cx.beginPath(); cx.moveTo(sx+14,sy+12); cx.lineTo(sx+58,sy+38); cx.lineTo(sx+20,sy-5); cx.closePath(); cx.fill();
  cx.fillStyle="#e2e8f0";
  cx.beginPath(); cx.moveTo(sx,sy-58); cx.lineTo(sx-26,sy+30); cx.lineTo(sx,sy+45); cx.lineTo(sx+26,sy+30); cx.closePath(); cx.fill();
  cx.shadowColor="#67e8f9"; cx.shadowBlur=16; cx.fillStyle="#67e8f9"; cx.beginPath(); cx.ellipse(sx,sy-18,10,17,0,0,Math.PI*2); cx.fill();
  const flame=62+Math.sin(tick*.30)*15+warp*26;
  cx.shadowColor="#f97316"; cx.shadowBlur=22; cx.fillStyle="#f97316"; cx.beginPath(); cx.moveTo(sx-13,sy+34); cx.lineTo(sx,sy+flame); cx.lineTo(sx+13,sy+34); cx.closePath(); cx.fill();
  cx.fillStyle="#fde047"; cx.beginPath(); cx.moveTo(sx-7,sy+36); cx.lineTo(sx,sy+flame-18); cx.lineTo(sx+7,sy+36); cx.closePath(); cx.fill(); cx.shadowBlur=0;
  const bw=290;
  cx.fillStyle="rgba(2,8,20,.88)"; cx.fillRect(sx-bw/2,cv.height-98,bw,12);
  cx.fillStyle="#0891b2"; cx.fillRect(sx-bw/2,cv.height-98,bw*clamp(shipShield/100,0,1),12);
  cx.strokeStyle="rgba(56,189,248,.45)"; cx.strokeRect(sx-bw/2,cv.height-98,bw,12);
  cx.fillStyle="rgba(2,8,20,.88)"; cx.fillRect(sx-bw/2,cv.height-78,bw,8);
  cx.fillStyle="#d97706"; cx.fillRect(sx-bw/2,cv.height-78,bw*clamp(P.fuel/100,0,1),8);
  cx.fillStyle="rgba(2,8,20,.88)"; cx.fillRect(sx-bw/2,cv.height-64,bw,6);
  cx.fillStyle="#22d3ee"; cx.fillRect(sx-bw/2,cv.height-64,bw*prog,6);
  cx.textAlign="center"; cx.font="14px Courier New"; cx.fillStyle="#e2e8f0";
  let txt="Despegando de "+P.planet; if(prog>.20) txt="Entrando al hiperespacio..."; if(prog>.54) txt="Viajando por el universo..."; if(prog>.82) txt="Descendiendo en "+targetPlanet;
  cx.fillText(txt,sx,cv.height-25); cx.fillStyle="#7ea4c2"; cx.font="10px Courier New";
  cx.fillText("CLICK / ESPACIO = disparar Â· Escudo "+Math.floor(shipShield)+"%",sx,cv.height-8); cx.textAlign="left";
}
