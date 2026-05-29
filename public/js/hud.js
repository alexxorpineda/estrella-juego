"use strict";

/* â”€â”€ Messages & banners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function msg(text,col){
  col=col||"#e2e8f0";
  const log=document.getElementById("msgLog"); if(!log) return;
  const el=document.createElement("div");
  el.className="msg"; el.style.color=col; el.style.borderLeftColor=col; el.textContent=text;
  log.appendChild(el);
  while(log.children.length>8) log.removeChild(log.firstChild);
  setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },3300);
}

function showBanner(text){
  const b=document.getElementById("banner"); if(!b) return;
  b.textContent=text; b.style.display="block";
  clearTimeout(showBanner._t);
  showBanner._t=setTimeout(function(){ b.style.display="none"; },2400);
}

/* â”€â”€ HUD update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function pct(v,m){ return(Math.max(0,Math.min(1,v/Math.max(1,m)))*100).toFixed(1)+"%"; }

function updateHUD(){
  document.getElementById("hpB").style.width=pct(P.hp,P.maxHp);
  document.getElementById("hpV").textContent=Math.ceil(Math.max(0,P.hp));
  document.getElementById("mpB").style.width=pct(P.mana,P.maxMana);
  document.getElementById("mpV").textContent=Math.ceil(Math.max(0,P.mana));
  document.getElementById("stB").style.width=pct(P.stamina,P.maxStamina);
  document.getElementById("oxB").style.width=pct(P.oxygen,100);
  document.getElementById("fuB").style.width=pct(P.fuel,100);

  document.getElementById("mFerrita").textContent=inv.ferrita||0;
  document.getElementById("mCarbono").textContent=inv.carbono||0;
  document.getElementById("mCristal").textContent=inv.cristal||0;
  document.getElementById("mPlasma").textContent=inv.plasma||0;
  document.getElementById("mEsencia").textContent=inv.esencia||0;

  const tx=Math.floor((P.x+P.w/2)/T),ty=Math.floor((P.y+P.h/2)/T);
  const depth=Math.max(0,ty-surfaceAt(tx)), b=biomeAt(tx);
  document.getElementById("iPlanet").textContent=PLANETS[P.planet].icon+" "+P.planet+" Â· "+P.gravity+"g";
  document.getElementById("iBiome").textContent="BIOMA: "+b.name;
  document.getElementById("iDepth").textContent="CAPA: "+depthLayer(depth)+" Â· Prof. "+depth;
  document.getElementById("iLvl").textContent="â˜… LVL "+P.level+" Â· "+P.xp+"/"+(P.level*70)+" XP";
  document.getElementById("iCoins").textContent="ðŸª™ "+coins;
  document.getElementById("iGear").textContent="âš” "+P.weaponName+" Â· ðŸ›¡ "+P.armorName;
  const dayText=dayTick<1350||dayTick>2200?"â˜€ DÃ­a":"ðŸŒ™ Noche";
  document.getElementById("iTime").textContent=dayText+(activeEvent?" Â· âš  "+activeEvent.toUpperCase():"");
}
