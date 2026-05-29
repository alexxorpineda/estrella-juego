"use strict";

/* â”€â”€ Ship laser firing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function shootShip(){
  if(!travelMode) return;
  shipLasers.push({ x:cv.width/2, y:cv.height*.68-34, vx:0, vy:-13.5, friend:true, life:70 });
  sfx.shoot();
}

/* â”€â”€ Update ship enemies & lasers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function updateSpaceCombat(){
  const sx=cv.width/2, sy=cv.height*.68;

  for(const se of shipEnemies){
    se.x+=se.vx; se.y+=se.vy;
    if(se.x<24||se.x>cv.width-24) se.vx*=-1;
    se.cool--;
    if(se.cool<=0){
      const dx=sx-se.x, dy=sy-se.y, d=Math.max(1,Math.hypot(dx,dy));
      shipLasers.push({ x:se.x, y:se.y, vx:dx/d*5.2, vy:dy/d*5.2, friend:false, life:90 });
      se.cool=65+Math.floor(Math.random()*70);
    }
  }

  for(let i=shipLasers.length-1;i>=0;i--){
    const l=shipLasers[i]; l.x+=l.vx; l.y+=l.vy; l.life--;
    if(l.life<=0){ shipLasers.splice(i,1); continue; }
    if(l.friend){
      let hit=false;
      for(let j=shipEnemies.length-1;j>=0;j--){
        const se=shipEnemies[j];
        if(Math.hypot(l.x-se.x,l.y-se.y)<24){
          se.hp-=22+P.shipLevel*3; burst(l.x,l.y,8,"#22d3ee");
          if(se.hp<=0){ burst(se.x,se.y,18,"#f97316"); coins+=12; P.fuel=Math.min(100,P.fuel+4); shipEnemies.splice(j,1); }
          shipLasers.splice(i,1); hit=true; break;
        }
      }
      if(hit) continue;
    }else if(Math.hypot(l.x-sx,l.y-sy)<30){
      shipShield=Math.max(0,shipShield-8); P.hp-=2;
      burst(sx,sy,6,"#ef4444"); shipLasers.splice(i,1);
    }
  }

  for(let i=shipEnemies.length-1;i>=0;i--){
    const se=shipEnemies[i];
    if(Math.hypot(se.x-sx,se.y-sy)<34){ shipShield=Math.max(0,shipShield-14); burst(se.x,se.y,18,"#f97316"); shipEnemies.splice(i,1); sfx.boom(); }
    else if(se.y>cv.height+90) shipEnemies.splice(i,1);
  }
  if(shipShield<=0) P.hp-=.08;
}

/* â”€â”€ Draw space combat layer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function drawSpaceCombat(sx,sy){
  for(const se of shipEnemies){
    cx.shadowColor="#ef4444"; cx.shadowBlur=10;
    cx.fillStyle="#7f1d1d"; cx.fillRect(se.x-15,se.y-8,30,16);
    cx.fillStyle="#f97316"; cx.fillRect(se.x-8,se.y-15,16,7);
    cx.fillStyle="#020617"; cx.fillRect(se.x-4,se.y-4,8,8);
    cx.shadowBlur=0;
    cx.fillStyle="rgba(0,0,0,.55)"; cx.fillRect(se.x-16,se.y+14,32,4);
    cx.fillStyle="#22c55e"; cx.fillRect(se.x-16,se.y+14,32*clamp(se.hp/se.maxHp,0,1),4);
  }
  for(const l of shipLasers){
    cx.shadowColor=l.friend?"#22d3ee":"#ef4444"; cx.shadowBlur=10;
    cx.fillStyle=l.friend?"#22d3ee":"#ef4444"; cx.fillRect(l.x-2,l.y-8,4,16); cx.shadowBlur=0;
  }
}
