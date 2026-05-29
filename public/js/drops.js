"use strict";

/* â”€â”€ XP & levelling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function gainXP(n){
  P.xp+=Math.floor(n);
  while(P.xp>=P.level*70){
    P.xp-=P.level*70; P.level++;
    P.maxHp+=8; P.maxMana+=4; P.maxStamina+=3;
    P.hp=P.maxHp; P.mana=P.maxMana; P.stamina=P.maxStamina;
    showBanner("NIVEL "+P.level);
    msg("Subiste a nivel "+P.level,"#fbbf24");
    sfx.level();
  }
}

/* â”€â”€ Equipment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function equipWeapon(id){
  const w=WEAPONS[id]||ENEMY_SPECIAL_DROPS[id]; if(!w) return;
  P.weaponId=w.id; P.weaponName=w.name; P.weaponTier=w.tier||0; P.damage=w.damage||6;
  msg("Arma: "+w.name,"#38bdf8");
}
function equipArmor(id){
  const a=ARMORS[id]||ENEMY_SPECIAL_DROPS[id]; if(!a) return;
  P.armorId=a.id; P.armorName=a.name; P.armorTier=a.tier||0; P.defense=a.defense||0;
  if(a.id==="exosuit") P.hasExo=true;
  msg("Armadura: "+a.name,"#a5f3fc");
}

/* â”€â”€ Drop panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function showDrop(item,type){
  if(!item) return;
  pendingDrop={ item:item, type:type||"weapon" };
  document.getElementById("dropIcon").textContent=item.icon||"âœ¨";
  document.getElementById("dropName").textContent=item.name||"Objeto raro";
  document.getElementById("dropStat").textContent=
    type==="armor"?"Defensa "+(item.defense||0)+" Â· Tier "+(item.tier||0)
                  :"DaÃ±o "+(item.damage||0)+" Â· Tier "+(item.tier||0);
  document.getElementById("dropPanel").style.display="block";
  sfx.drop();
}
function acceptDrop(){
  if(!pendingDrop) return;
  pendingDrop.type==="armor"?equipArmor(pendingDrop.item.id):equipWeapon(pendingDrop.item.id);
  pendingDrop=null; document.getElementById("dropPanel").style.display="none"; updateHUD();
}

/* â”€â”€ Block drops â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function blockDrop(id,x,y){
  const b=biomeAt(x);
  if(id===TILE.TOP||id===TILE.SOIL) inv.carbono+=1;
  else if(id===TILE.STONE||id===TILE.DEEP||id===TILE.CORE) inv.ferrita+=id===TILE.CORE?2:1;
  else if(id===TILE.FERRITE) inv.ferrita+=2+Math.floor(Math.random()*2);
  else if(id===TILE.CRYSTAL) inv.cristal+=2;
  else if(id===TILE.PLASMA)  inv.plasma+=2;
  else if(id===TILE.ESSENCE) inv.esencia+=1;
  else if(id===TILE.WOOD)    inv.carbono+=2;
  else if(id===TILE.BRICK){ inv.ferrita+=1; if(chance(.25)) inv.cristal+=1; }
  else if(id===TILE.CHEST){ openChest(x,y); return; }
  else if(id===TILE.STATION){ toggleCraft(true); msg("EstaciÃ³n activada","#67e8f9"); return; }
  if(chance(.04+(b.danger||1)*.01)){ inv.esencia+=1; msg("Esencia rara encontrada","#c084fc"); }
}

function openChest(x,y){
  const b=biomeAt(x), danger=b.danger||1;
  const ferr=4+Math.floor(Math.random()*8);
  const cris=Math.floor(Math.random()*(3+danger));
  const plas=Math.floor(Math.random()*danger);
  const ess=chance(.18+danger*.05)?1:0;
  inv.ferrita+=ferr; inv.cristal+=cris; inv.plasma+=plas; inv.esencia+=ess;
  coins+=25+Math.floor(Math.random()*60);
  msg("Cofre: +"+ferr+" ferrita +"+cris+" cristal +"+plas+" plasma","#fbbf24");
  if(chance(.14+danger*.04)){
    const pool=["crystal_sword","prism_bow","gaia_hammer","ferrite_armor","crystal_armor"];
    if(danger>=3) pool.push("astral_blade","void_staff","exosuit");
    if(danger>=4) pool.push("plasma_lance","astral_armor");
    const id=pool[Math.floor(Math.random()*pool.length)];
    const item=ENEMY_SPECIAL_DROPS[id];
    const type=id.includes("armor")||id==="exosuit"?"armor":"weapon";
    showDrop(item,type);
  }
}
