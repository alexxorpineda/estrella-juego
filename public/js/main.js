"use strict";

function placeStarterObjects(){
  const h=surfaceAt(12);
  setBlock(12,h-1,TILE.CHEST);
  setBlock(16,h-1,TILE.STATION);
}

function startGame(){
  if(gameState==="playing") return;
  gameState="playing";
  setPlanetSeed(); placeStarterObjects();
  enemies.length=0; projectiles.length=0; meteors.length=0; particles.length=0;
  seedInitialEnemies(); updateHUD();
  msg("Bienvenido a Lumora","#22d3ee");
  msg("F=Minar Â· G=Atacar Â· B=Poner Â· C=Crafting Â· E=Planetas","#7ea4c2");
}

function restartGame(){
  sessionSeed=Math.floor(Math.random()*999999);
  world.clear(); surfaceCache.clear(); tileCache.clear();
  enemies.length=0; particles.length=0; projectiles.length=0; meteors.length=0;
  boss=null; bossFight=false; activeEvent=null;
  nextEvent=1900+Math.floor(Math.random()*2600);
  shipEnemies.length=0; shipLasers.length=0;
  Object.assign(P,{
    x:260,y:120,w:15,h:30,vx:0,vy:0,onGround:false,facingR:true,iframes:0,jumpHeld:false,
    hp:100,maxHp:100,mana:60,maxMana:60,stamina:100,maxStamina:100,
    oxygen:100,food:100,fuel:90,xp:0,level:1,
    planet:"Lumora",gravity:PLANETS.Lumora.gravity,
    speed:3.15,jumpPow:11.4,
    weaponId:"fists",weaponName:"PuÃ±os",weaponTier:0,damage:6,
    armorId:"none",armorName:"Sin armadura",armorTier:0,defense:0,
    attacking:false,attackFrame:0,shipLevel:1,timeOnPlanet:0,
    hasExo:false,exoCharge:0,poison:0
  });
  Object.assign(inv,{ ferrita:14, carbono:18, cristal:8, plasma:4, esencia:3 });
  coins=120; camX=0; camY=0; dayTick=0; selectedSlot=0;
  document.querySelectorAll(".slot").forEach(function(s,i){ s.classList.toggle("sel",i===0); });
  document.getElementById("bossWrap").style.display="none";
  document.getElementById("dropPanel").style.display="none";
  toggleCraft(false); togglePlanets(false);
  setPlanetSeed(); placeStarterObjects(); seedInitialEnemies();
  gameState="playing"; updateHUD();
  msg("Nueva expediciÃ³n iniciada","#22d3ee");
}

function loop(){
  tick++;
  if(gameState==="menu"){ drawMenu(); requestAnimationFrame(loop); return; }
  if(gameState==="gameover"){ drawGameOver(); requestAnimationFrame(loop); return; }
  if(gameState!=="playing"){ requestAnimationFrame(loop); return; }
  dayTick=(dayTick+1)%DAY_LEN;
  if(travelMode){
    updateTravel(); updateParticles();
    drawTravel(); drawParticles();
    updateHUD(); requestAnimationFrame(loop); return;
  }
  updatePlayer(); regen();
  updateEnemies(); updateBoss();
  updateProjectiles(); updateMeteors();
  updateParticles(); updateEvents();
  updateHUD();
  drawSky(); drawWorld();
  drawEnemies(); drawProjectiles();
  drawBoss(); drawMeteors();
  drawParticles(); drawPlayer();
  drawLighting(); drawAtmosphere();
  requestAnimationFrame(loop);
}

/* â”€â”€ Boot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
cv = document.getElementById("game");
cx = cv.getContext("2d");
cx.imageSmoothingEnabled = false;
fit();
addEventListener("resize", fit);
setupCraftTabs();
bindInputs();
setPlanetSeed();
updateHUD();
requestAnimationFrame(loop);
