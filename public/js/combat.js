"use strict";

/* â”€â”€ Target tile helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function targetTile(){
  const px=P.x+P.w/2, py=P.y+P.h/2;
  if(mouse.used){
    const mx=mouse.x+camX, my=mouse.y+camY;
    if(Math.hypot(mx-px,my-py)<150) return{ x:Math.floor(mx/T), y:Math.floor(my/T) };
  }
  const dir=P.facingR?1:-1;
  return{ x:Math.floor((px+dir*38)/T), y:Math.floor(py/T) };
}

/* â”€â”€ Mining â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function doMine(){
  if(gameState!=="playing"||travelMode) return;
  const t=targetTile(), id=getBlock(t.x,t.y);
  if(id===TILE.AIR||id===TILE.WATER||id===TILE.LAVA){ msg("No hay bloque","#64748b"); return; }
  if(Math.hypot(P.x+P.w/2-t.x*T-T/2,P.y+P.h/2-t.y*T-T/2)>155){ msg("Demasiado lejos","#64748b"); return; }
  blockDrop(id,t.x,t.y); setBlock(t.x,t.y,TILE.AIR);
  burst(t.x*T+T/2,t.y*T+T/2,10,biomeAt(t.x).glow); sfx.mine(); updateHUD();
}

/* â”€â”€ Placement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function placeIdForSlot(){
  if(selectedSlot===3&&inv.ferrita>0) return{ id:TILE.STONE, mat:"ferrita" };
  if(selectedSlot===4&&inv.carbono>0) return{ id:TILE.WOOD,  mat:"carbono" };
  if(selectedSlot===5&&inv.cristal>0) return{ id:TILE.CRYSTAL,mat:"cristal" };
  if(selectedSlot===6&&inv.plasma>0)  return{ id:TILE.PLASMA, mat:"plasma" };
  if(selectedSlot===7&&inv.esencia>0) return{ id:TILE.ESSENCE,mat:"esencia" };
  return{ id:TILE.STONE, mat:"ferrita" };
}
function doPlace(){
  if(gameState!=="playing"||travelMode) return;
  const t=targetTile(), current=getBlock(t.x,t.y);
  if(current!==TILE.AIR&&current!==TILE.WATER){ msg("Espacio ocupado","#64748b"); return; }
  const data=placeIdForSlot();
  if((inv[data.mat]||0)<=0){ msg("Sin material","#ef4444"); return; }
  const bx=t.x*T, by=t.y*T;
  if(P.x<bx+T&&P.x+P.w>bx&&P.y<by+T&&P.y+P.h>by){ msg("No puedes colocarlo aquÃ­","#64748b"); return; }
  setBlock(t.x,t.y,data.id); inv[data.mat]--;
  burst(bx+T/2,by+T/2,6,biomeAt(t.x).glow); sfx.mine(); updateHUD();
}

/* â”€â”€ Attack â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function doAttack(){
  if(gameState!=="playing"||travelMode) return;
  P.attacking=true; P.attackFrame=0;
  const w=WEAPONS[P.weaponId]||WEAPONS.fists;
  const px=P.x+P.w/2, py=P.y+P.h/2-4, dir=P.facingR?1:-1;
  const baseDamage=P.damage+Math.floor(P.level*1.15)+Math.floor(Math.random()*4);

  if(w.id==="prism_bow"||w.id==="void_staff"||w.id==="plasma_lance"){
    const cost=w.id==="void_staff"?6:w.id==="plasma_lance"?4:0;
    if(P.mana<cost){ msg("Mana insuficiente","#818cf8"); return; }
    P.mana-=cost;
    projectiles.push({
      x:px+dir*20,y:py,vx:dir*(w.id==="plasma_lance"?9.5:8.2),vy:(Math.random()-.5)*.35,
      type:"player",damage:baseDamage+(w.id==="plasma_lance"?9:w.id==="void_staff"?7:3),
      r:w.id==="plasma_lance"?5:4,col:w.color,life:95,poison:0
    });
    sfx.shoot();
  }

  const range=50+P.weaponTier*7; let hit=false;
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i], dx=e.x-px, dy=e.y-py;
    if(Math.abs(dx)<range&&Math.abs(dy)<46&&Math.sign(dx||dir)===dir){
      hurtEnemy(e,baseDamage,dir); hit=true; if(e.hp<=0) killEnemy(i);
    }
  }
  if(boss){
    const dx=boss.x-px, dy=boss.y-py;
    if(Math.abs(dx)<range+boss.size&&Math.abs(dy)<boss.size+42&&Math.sign(dx||dir)===dir){
      boss.hp-=baseDamage; burst(boss.x,boss.y,10,boss.glow); hit=true;
    }
  }
  if(hit) sfx.hit(); else sfx.shoot();
  updateHUD();
}
