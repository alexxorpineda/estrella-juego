"use strict";

function bindInputs(){
  if(window.__estrellaInputBound) return; window.__estrellaInputBound=true;

  addEventListener("keydown",function(e){
    const k=e.key.toLowerCase(); keys[k]=true;
    if(e.key===" ") e.preventDefault();
    if(gameState==="menu"){ if(k==="enter"||k===" ") startGame(); return; }
    if(gameState==="gameover"){ if(k==="r") restartGame(); return; }
    if(travelMode){ if(k===" "||k==="f") shootShip(); return; }
    if(k==="f") doMine();
    if(k==="g") doAttack();
    if(k==="b") doPlace();
    if(k==="c") toggleCraft();
    if(k==="e") togglePlanets();
    if(k==="escape"){ toggleCraft(false); togglePlanets(false); document.getElementById("dropPanel").style.display="none"; }
    if(k>="0"&&k<="7"){
      selectedSlot=parseInt(k,10);
      document.querySelectorAll(".slot").forEach(function(s,i){ s.classList.toggle("sel",i===selectedSlot); });
    }
  });
  addEventListener("keyup",function(e){ keys[e.key.toLowerCase()]=false; });
  addEventListener("mousemove",function(e){ mouse.x=e.clientX; mouse.y=e.clientY; mouse.used=true; });
  addEventListener("mousedown",function(e){
    unlockAudio(); mouse.x=e.clientX; mouse.y=e.clientY; mouse.down=true; mouse.used=true;
    if(travelMode){ if(e.button===0) shootShip(); return; }
    if(gameState!=="playing") return;
    const craftOpen=document.getElementById("craftPanel")&&document.getElementById("craftPanel").style.display==="block";
    const planetOpen=document.getElementById("planetPanel")&&document.getElementById("planetPanel").style.display==="block";
    const dropOpen=document.getElementById("dropPanel")&&document.getElementById("dropPanel").style.display==="block";
    if(craftOpen||planetOpen||dropOpen) return;
    if(e.button===0){ if(selectedSlot===0) doMine(); else if(selectedSlot===1) doAttack(); else doPlace(); }
    if(e.button===2) doPlace();
  },true);
  addEventListener("mouseup",function(){ mouse.down=false; });
  addEventListener("contextmenu",function(e){ e.preventDefault(); });

  document.querySelectorAll(".slot").forEach(function(s,i){
    s.onclick=function(){
      selectedSlot=i;
      document.querySelectorAll(".slot").forEach(function(x,j){ x.classList.toggle("sel",j===i); });
    };
  });

  function bindMB(id,down,up){
    const el=document.getElementById(id); if(!el) return;
    el.addEventListener("touchstart",function(e){ e.preventDefault(); unlockAudio(); down(); },{ passive:false });
    el.addEventListener("touchend",function(e){ e.preventDefault(); if(up) up(); },{ passive:false });
  }
  bindMB("mbL",function(){ keys.a=true; keys.arrowleft=true; },function(){ keys.a=false; keys.arrowleft=false; });
  bindMB("mbR",function(){ keys.d=true; keys.arrowright=true; },function(){ keys.d=false; keys.arrowright=false; });
  bindMB("mbJ",function(){ keys.w=true; },function(){ keys.w=false; });
  bindMB("mbF",function(){ if(travelMode) shootShip(); else doMine(); });
  bindMB("mbG",function(){ doAttack(); });
  bindMB("mbE",function(){ togglePlanets(); });
  bindMB("mbC",function(){ toggleCraft(); });
}
