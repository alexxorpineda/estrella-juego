"use strict";

function fit(){ cv.width=innerWidth; cv.height=innerHeight; cx.imageSmoothingEnabled=false; }

function key(x,y){ return x+","+y; }
function setBlock(x,y,id){ world.set(key(x,y),id); }
function getModified(x,y){ const k=key(x,y); return world.has(k)?world.get(k):null; }

function planetObj(){ return PLANETS[P.planet]; }
function setPlanetSeed(){ planetSeed=PLANETS[P.planet].seed+sessionSeed; surfaceCache.clear(); tileCache.clear(); }
function depthLayer(d){
  if(d<0) return "cielo"; if(d<=3) return "superficie"; if(d<=12) return "subsuelo";
  if(d<=30) return "cuevas poco profundas"; if(d<=58) return "cuevas profundas";
  if(d<=88) return "zona peligrosa"; return "nÃºcleo";
}

function biomeIdAt(x){
  const planet=planetObj();
  const zone=Math.floor(x/86);
  let idx=Math.floor(iRand(zone,planetSeed,22)*planet.biomes.length);
  if(iRand(zone,0,777)>.72) idx=(idx+1+Math.floor(iRand(zone,1,778)*3))%planet.biomes.length;
  const local=((x%86)+86)%86;
  if(local<10&&iRand(zone,2,779)>.55){
    const prev=Math.floor(iRand(zone-1,planetSeed,22)*planet.biomes.length);
    return planet.biomes[prev%planet.biomes.length];
  }
  return planet.biomes[idx%planet.biomes.length];
}
function biomeAt(x){ return BIOMES[biomeIdAt(x)]||BIOMES.crystal_forest; }

function surfaceAt(x){
  const ck=P.planet+":"+planetSeed+":"+x;
  if(surfaceCache.has(ck)) return surfaceCache.get(ck);
  const b=biomeAt(x);
  const n1=fbm(x*.024,1.2,4),n2=fbm(x*.007,8.5,5),n3=Math.sin((x+planetSeed)*.031)*9;
  const mountain=(n2-.5)*48*b.rough,hills=(n1-.5)*24*b.rough;
  let base=49+b.height+mountain+hills+n3;
  if(P.planet==="Zephyrion") base-=12;
  if(P.planet==="Abyssalon") base+=10;
  if(P.planet==="Vulkar") base+=3;
  const out=Math.floor(base);
  surfaceCache.set(ck,out);
  return out;
}

function lakeMask(x){
  const bId=biomeIdAt(x);
  const watery=["crystal_lake","swamp_glow","coral_reef","abyss_trench","kelp_forest","pressure_caves"];
  if(!watery.includes(bId)) return false;
  const reg=Math.floor(x/66);
  const center=reg*66+18+Math.floor(iRand(reg,6,700)*30);
  const w=12+iRand(reg,7,701)*18;
  return Math.abs(x-center)<w;
}

function caveEntranceOpen(x,y,d){
  if(d<0||d>18) return false;
  const reg=Math.floor(x/42);
  if(iRand(reg,0,303)<.66) return false;
  const center=reg*42+9+Math.floor(iRand(reg,1,304)*24);
  const w=2.4+d*.36+iRand(reg,2,305)*2;
  return Math.abs(x-center)<w&&d>0;
}
function caveOpen(x,y,d){
  if(d<4) return false;
  if(caveEntranceOpen(x,y,d)) return true;
  const depthBoost=Math.min(.18,d*.003);
  const cellular=fbm(x*.072,y*.072,90);
  const chamber=fbm(x*.028,y*.028,123)>(.67-depthBoost);
  const longTunnel=Math.abs(Math.sin(x*.062+y*.026+planetSeed*.013))<(.075+depthBoost);
  const verticalShaft=Math.abs(Math.sin(x*.19+planetSeed*.017))<(.035+Math.min(.05,d*.001));
  if(d>12&&chamber&&cellular>.48) return true;
  if(d>8&&longTunnel&&cellular>.34) return true;
  if(d>15&&verticalShaft&&cellular>.28) return true;
  return false;
}

function islandTile(x,y){
  const bId=biomeIdAt(x);
  const rare=P.planet==="Zephyrion"||bId==="sky_cliffs"||bId==="cloud_fields"||bId==="floating_ruins";
  const reg=Math.floor(x/95);
  if(iRand(reg,0,900)<(rare ? .48 : .88)) return null;
  const center=reg*95+20+Math.floor(iRand(reg,2,902)*55);
  const surf=surfaceAt(center);
  const cy=surf-18-Math.floor(iRand(reg,3,903)*18);
  const rx=14+iRand(reg,4,904)*22,ry=4+iRand(reg,5,905)*6;
  const dx=(x-center)/rx,dy=(y-cy)/ry;
  const score=dx*dx+dy*dy;
  if(score>1) return null;
  if(score<.25&&y===cy-Math.floor(ry*.6)&&iRand(x,y,909)>.94) return TILE.CHEST;
  if(y<cy-ry*.35) return TILE.TOP;
  if(score>.72) return TILE.SOIL;
  return TILE.STONE;
}

function structureTile(x,y){
  const reg=Math.floor(x/78);
  if(iRand(reg,0,410)>.74){
    const center=reg*78+16+Math.floor(iRand(reg,1,411)*44);
    const bId=biomeIdAt(center);
    const base=surfaceAt(center);
    const half=7+Math.floor(iRand(reg,2,412)*8);
    const h=8+Math.floor(iRand(reg,3,413)*9);
    const dx=x-center,top=base-h;
    if(Math.abs(dx)<=half&&y>=top&&y<=base){
      const border=Math.abs(dx)===half||y===top||y===base;
      const column=Math.abs(dx)===Math.floor(half*.55)&&y>top+1;
      const broken=iRand(x,y,414)>.88&&y<base-1;
      if(broken) return TILE.AIR;
      if(border||column){
        if(["alien_jungle","overgrowth_ruins","root_caves","swamp_glow"].includes(bId)) return TILE.WOOD;
        return TILE.BRICK;
      }
      if(y===base-1&&dx===0&&iRand(reg,4,414)>.38) return TILE.CHEST;
      if(y===base-1&&dx===-3&&iRand(reg,5,415)>.72) return TILE.STATION;
      return TILE.AIR;
    }
  }
  const ureg=Math.floor(x/92);
  if(iRand(ureg,9,500)>.78){
    const center=ureg*92+18+Math.floor(iRand(ureg,10,501)*50);
    const base=surfaceAt(center)+22+Math.floor(iRand(ureg,11,502)*34);
    const half=8+Math.floor(iRand(ureg,12,503)*10);
    const h=8+Math.floor(iRand(ureg,13,504)*10);
    const dx=x-center,top=base-h;
    if(Math.abs(dx)<=half&&y>=top&&y<=base){
      const border=Math.abs(dx)===half||y===top||y===base;
      const doorway=Math.abs(dx)<=1&&y>base-4;
      const crack=iRand(x,y,505)>.93;
      if(doorway||crack) return TILE.AIR;
      if(border||Math.abs(dx)===Math.floor(half*.5)) return TILE.BRICK;
      if(y===base-1&&dx===0) return TILE.CHEST;
      if(y===base-1&&dx===4&&iRand(ureg,17,506)>.60) return TILE.STATION;
      return TILE.AIR;
    }
  }
  return null;
}

function oreForDepth(x,y,d,bId){
  const n=iRand(x,y,999),r=iRand(x,y,1000);
  if(d<4) return null;
  if(d<15){
    if(n>.925) return TILE.FERRITE;
    if(["crystal_forest","purple_crystal","ice_crystals","coral_reef"].includes(bId)&&n>.88) return TILE.CRYSTAL;
    return null;
  }
  if(d<34){
    if(n>.91) return TILE.FERRITE;
    if(r>.93) return TILE.CRYSTAL;
    if(["magma_fields","lava_caves","obsidian_ruins"].includes(bId)&&r>.89) return TILE.PLASMA;
    return null;
  }
  if(d<65){
    if(n>.90) return TILE.CRYSTAL;
    if(r>.92) return TILE.PLASMA;
    if(["void_wastes","gravity_rift","shadow_temple","pressure_caves","abyss_trench"].includes(bId)&&r>.88) return TILE.ESSENCE;
    return null;
  }
  if(n>.87) return TILE.PLASMA;
  if(r>.90) return TILE.ESSENCE;
  if(r>.80&&["lava_caves","abyss_trench","gravity_rift"].includes(bId)) return TILE.ESSENCE;
  return null;
}

function getBlock(x,y){
  const m=getModified(x,y);
  if(m!==null) return m;
  const st=structureTile(x,y);
  if(st!==null) return st;
  const it=islandTile(x,y);
  if(it!==null) return it;
  const s=surfaceAt(x),d=y-s,bId=biomeIdAt(x);
  if(y<0) return TILE.AIR;
  if(d<0) return TILE.AIR;
  if(lakeMask(x)&&d>=0&&d<=5) return TILE.WATER;
  if(caveEntranceOpen(x,y,d)) return TILE.AIR;
  if(caveOpen(x,y,d)){
    if(d>44&&P.planet==="Vulkar"&&iRand(x,y,1200)>.76) return TILE.LAVA;
    if(d>55&&["lava_caves","magma_fields"].includes(bId)&&iRand(x,y,1201)>.64) return TILE.LAVA;
    if(d>26&&["crystal_lake","swamp_glow","coral_reef","abyss_trench","kelp_forest","pressure_caves","drowned_ruins"].includes(bId)&&iRand(x,y,1202)>.76) return TILE.WATER;
    return TILE.AIR;
  }
  const ore=oreForDepth(x,y,d,bId);
  if(ore!==null) return ore;
  if(d===0) return TILE.TOP;
  if(d<=3) return TILE.SOIL;
  if(d<=22) return TILE.STONE;
  if(d<=76) return TILE.DEEP;
  if(d>96&&iRand(x,y,1600)>.88) return TILE.ESSENCE;
  return TILE.CORE;
}
