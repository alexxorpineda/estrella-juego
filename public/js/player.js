"use strict";

/* â”€â”€ Damage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function damagePlayer(dmg,src){
  if(P.iframes>0) return;
  const def=P.defense||0;
  const actual=Math.max(1,dmg-Math.floor(def*.55));
  P.hp-=actual; P.iframes=22;
  if(src){ const dx=P.x-(src.x||P.x),dy=P.y-(src.y||P.y),d=Math.max(1,Math.hypot(dx,dy)); P.vx+=dx/d*3.5; P.vy+=dy/d*2.2; }
  burst(P.x+P.w/2,P.y+P.h/2,6,"#ef4444"); sfx.hurt(); updateHUD();
}

/* â”€â”€ Collision â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function boxCollides(x,y,w,h){
  const left=Math.floor(x/T),right=Math.floor((x+w-1)/T),top=Math.floor(y/T),bot=Math.floor((y+h-1)/T);
  for(let ty=top;ty<=bot;ty++) for(let tx=left;tx<=right;tx++) if(solid(getBlock(tx,ty))) return true;
  return false;
}
function playerLiquid(){ return getBlock(Math.floor((P.x+P.w/2)/T),Math.floor((P.y+P.h/2)/T)); }
function movePlayerAxis(dx,dy){
  if(dx!==0){ const steps=Math.ceil(Math.abs(dx)),step=dx/Math.max(1,steps); for(let i=0;i<steps;i++){ if(!boxCollides(P.x+step,P.y,P.w,P.h)) P.x+=step; else{ P.vx=0; break; } } }
  if(dy!==0){ const steps=Math.ceil(Math.abs(dy)),step=dy/Math.max(1,steps); for(let i=0;i<steps;i++){ if(!boxCollides(P.x,P.y+step,P.w,P.h)){ P.y+=step; P.onGround=false; } else{ if(step>0) P.onGround=true; P.vy=0; break; } } }
}

/* â”€â”€ Physics update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function updatePlayer(){
  if(P.iframes>0) P.iframes--;
  const left=keys.a||keys.arrowleft, right=keys.d||keys.arrowright, jump=keys.w||keys.arrowup||keys[" "];
  let move=0; if(left) move-=1; if(right) move+=1; if(move!==0) P.facingR=move>0;

  const liq=playerLiquid(), inWater=liq===TILE.WATER, inLava=liq===TILE.LAVA;
  const accel=inWater?.20:.42, maxSpeed=P.speed*(inWater?.55:1);
  P.vx+=move*accel; P.vx*=P.onGround?.82:.94; P.vx=clamp(P.vx,-maxSpeed,maxSpeed);

  if(jump&&!P.jumpHeld&&P.onGround&&P.stamina>5){
    P.vy=-P.jumpPow*(inWater?.55:1); P.onGround=false; P.stamina-=5; sfx.jump();
  }
  P.jumpHeld=!!jump;

  const gravityMul=inWater?.24:P.gravity;
  P.vy+=GRAV*gravityMul; P.vy=clamp(P.vy,-22,inWater?6:18);

  if(inWater){ P.vx*=.94; P.vy*=.92; P.oxygen-=.05; if(P.oxygen<=0&&tick%25===0) damagePlayer(3,{x:P.x,y:P.y}); }
  else P.oxygen=Math.min(100,P.oxygen+.10);
  if(inLava&&tick%12===0) damagePlayer(8,{x:P.x,y:P.y});

  movePlayerAxis(P.vx,0); movePlayerAxis(0,P.vy);

  if(P.onGround){ P.stamina=Math.min(P.maxStamina,P.stamina+.35); if(Math.abs(P.vx)>.8&&tick%22===0) sfx.step(); }
  else P.stamina=Math.min(P.maxStamina,P.stamina+.12);

  if(P.poison>0){ P.poison--; if(tick%40===0){ P.hp-=2; burst(P.x+P.w/2,P.y+P.h/2,4,"#84cc16"); } }
  if(P.hasExo){ P.exoCharge=Math.max(0,P.exoCharge-.05); if(P.exoCharge<=0){ P.hasExo=false; msg("Exotraje descargado","#64748b"); } }
  P.timeOnPlanet++;
  if(P.y>5200) damagePlayer(999,{x:P.x,y:P.y});
  if(P.attacking){ P.attackFrame++; if(P.attackFrame>12){ P.attacking=false; P.attackFrame=0; } }

  camX+=(P.x+P.w/2-cv.width/2-camX)*.10;
  camY+=(P.y+P.h/2-cv.height/2-camY)*.10;
  if(P.hp<=0){ P.hp=0; gameState="gameover"; showBanner("HAS CAÃDO"); sfx.boom(); }
}

function regen(){
  if(P.hp<P.maxHp&&tick%90===0) P.hp+=.7;
  if(P.mana<P.maxMana) P.mana+=.045+P.level*.002;
  P.hp=clamp(P.hp,0,P.maxHp); P.mana=clamp(P.mana,0,P.maxMana);
  P.stamina=clamp(P.stamina,0,P.maxStamina); P.fuel=clamp(P.fuel,0,100); P.oxygen=clamp(P.oxygen,0,100);
}

/* â”€â”€ Draw player â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function drawPlayer(){
  const px=P.x-camX, py=P.y-camY;
  if(P.iframes>0&&Math.floor(P.iframes/3)%2===0) cx.globalAlpha=.35;
  cx.save();
  if(!P.facingR){ cx.translate(px+P.w/2,0); cx.scale(-1,1); cx.translate(-(px+P.w/2),0); }
  const armor=ARMORS[P.armorId]||ARMORS.none;
  const walk=P.onGround&&Math.abs(P.vx)>.2?Math.sin(tick*.22)*3:0;

  cx.fillStyle="rgba(0,0,0,.25)"; cx.beginPath(); cx.ellipse(px+P.w/2,py+P.h+3,P.w*.8,3,0,0,Math.PI*2); cx.fill();
  const skin="#d69b72",hair="#4a2a15",shirt=armor.id==="none"?"#3b82f6":armor.color,pants=armor.id==="none"?"#1e3a5f":mix(armor.color,"#0f172a",.55);
  cx.fillStyle="#3f2d20"; cx.fillRect(px+1,py+P.h-5+walk,5,5); cx.fillRect(px+P.w-6,py+P.h-5-walk,5,5);
  cx.fillStyle=pants; cx.fillRect(px+2,py+P.h-13+walk*.4,5,8); cx.fillRect(px+P.w-7,py+P.h-13-walk*.4,5,8);
  cx.fillStyle=shirt; cx.fillRect(px+1,py+P.h-23,P.w-2,12);
  cx.fillStyle=skin; cx.fillRect(px-2,py+P.h-22+walk*.2,4,10); cx.fillRect(px+P.w-1,py+P.h-22-walk*.2,4,10);
  drawWeaponInHand(px,py);
  cx.fillStyle=skin; cx.fillRect(px+P.w/2-2,py+P.h-28,4,5);
  cx.fillStyle=skin; cx.fillRect(px+2,py+P.h-39,P.w-4,12);
  cx.fillStyle=hair; cx.fillRect(px+2,py+P.h-39,P.w-4,3); cx.fillRect(px+2,py+P.h-39,2,7); cx.fillRect(px+P.w-4,py+P.h-39,2,5);
  cx.fillStyle="#1e1b4b"; cx.fillRect(px+5,py+P.h-34,2,2); cx.fillRect(px+9,py+P.h-34,2,2);
  cx.fillStyle="rgba(255,255,255,.7)"; cx.fillRect(px+5,py+P.h-34,1,1); cx.fillRect(px+9,py+P.h-34,1,1);
  cx.fillStyle=mix(skin,"#000",.22); cx.fillRect(px+7,py+P.h-31,1,2); cx.fillRect(px+6,py+P.h-28,3,1);
  if(armor.id!=="none"){
    cx.fillStyle=mix(armor.color,"#0f172a",.2); cx.fillRect(px+1,py+P.h-41,P.w-2,14);
    cx.shadowColor=armor.color; cx.shadowBlur=8;
    cx.fillStyle="rgba(224,242,254,.85)"; cx.fillRect(px+4,py+P.h-36,P.w-8,3); cx.shadowBlur=0;
  }
  cx.restore(); cx.globalAlpha=1;
  if(P.poison>0){ cx.shadowColor="#84cc16"; cx.shadowBlur=10; cx.strokeStyle="rgba(132,204,22,.65)"; cx.strokeRect(px-4,py-11,P.w+8,P.h+15); cx.shadowBlur=0; }
}

function drawWeaponInHand(px,py){
  const w=WEAPONS[P.weaponId]||WEAPONS.fists;
  if(w.id==="fists"){ cx.fillStyle="#5b3a24"; cx.fillRect(px+P.w+1,py+P.h-14,4,4); return; }
  const angle=P.attacking?(-55+P.attackFrame*7)*Math.PI/180:-15*Math.PI/180;
  cx.save(); cx.translate(px+P.w+3,py+P.h-12); cx.rotate(angle);
  if(w.id==="crystal_sword"||w.id==="astral_blade"){
    cx.shadowColor=w.color; cx.shadowBlur=10; cx.fillStyle=w.color; cx.fillRect(-1,-3,3,22);
    cx.fillStyle="rgba(255,255,255,.75)"; cx.fillRect(0,-2,1,9);
    cx.fillStyle="#fbbf24"; cx.fillRect(-5,10,10,3); cx.fillStyle="#713f12"; cx.fillRect(-1,12,3,7);
  }else if(w.id==="plasma_lance"){
    cx.shadowColor=w.color; cx.shadowBlur=14; cx.fillStyle="#e2e8f0"; cx.fillRect(-1,-4,2,28);
    cx.fillStyle=w.color; cx.beginPath(); cx.moveTo(-5,-9); cx.lineTo(0,-18); cx.lineTo(5,-9); cx.closePath(); cx.fill();
  }else if(w.id==="void_staff"){
    cx.fillStyle="#7c3aed"; cx.fillRect(-1,-2,2,25);
    cx.shadowColor=w.color; cx.shadowBlur=16; cx.fillStyle=w.color; cx.beginPath(); cx.arc(0,-8,6,0,Math.PI*2); cx.fill();
  }else if(w.id==="gaia_hammer"){
    cx.fillStyle="#713f12"; cx.fillRect(-1,1,2,24);
    cx.shadowColor=w.color; cx.shadowBlur=10; cx.fillStyle=w.color; cx.fillRect(-7,-7,14,9);
  }else if(w.id==="prism_bow"){
    cx.strokeStyle=w.color; cx.shadowColor=w.color; cx.shadowBlur=8; cx.lineWidth=2;
    cx.beginPath(); cx.arc(0,8,11,-1,1); cx.stroke();
    cx.strokeStyle="rgba(255,255,255,.7)"; cx.lineWidth=1; cx.beginPath(); cx.moveTo(0,-2); cx.lineTo(0,18); cx.stroke();
  }
  cx.restore(); cx.shadowBlur=0;
}
