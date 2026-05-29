"use strict";

function drawTileTop(o,p,v){
  rect(o,0,0,T,T,p.soil);
  for(let i=0;i<18;i++){const x=(i*7+Math.floor(v*11))%T,y=5+((i*5)%15);rect(o,x,y,2,1,mix(p.soil,"#000000",.35));rect(o,x,y-1,1,1,mix(p.soil,"#ffffff",.22));}
  rect(o,0,0,T,3,p.top);rect(o,0,0,T,1,mix(p.top,"#ffffff",.45));
  for(let i=0;i<7;i++){const x=(i*4+Math.floor(v*9))%T,h=3+((i+Math.floor(v*10))%5);rect(o,x,0,2,h,p.glow);if(i%3===0) rect(o,x,0,1,1,p.glow2);}
  rect(o,0,T-2,T,2,"rgba(0,0,0,.42)");rect(o,T-2,0,2,T,"rgba(0,0,0,.28)");rect(o,0,0,1,T,"rgba(255,255,255,.08)");
}
function drawTileSoil(o,p,v){
  rect(o,0,0,T,T,p.soil);
  for(let i=0;i<22;i++){const x=(i*11+Math.floor(v*100))%T,y=(i*7+Math.floor(v*50))%T;rect(o,x,y,2,1,i%2?mix(p.soil,"#000",.28):mix(p.soil,"#fff",.12));}
  rect(o,0,0,T,1,"rgba(255,255,255,.1)");rect(o,0,T-2,T,2,"rgba(0,0,0,.46)");rect(o,T-2,0,2,T,"rgba(0,0,0,.32)");
}
function drawTileStone(o,p,v){
  rect(o,0,0,T,T,p.stone);
  for(let i=0;i<8;i++){const x=(i*9+Math.floor(v*70))%T,y=(i*13+Math.floor(v*40))%T;o.fillStyle=i%2?mix(p.stone,"#000",.25):mix(p.stone,"#fff",.14);o.beginPath();o.moveTo(x,y);o.lineTo(x+5,y-1);o.lineTo(x+7,y+4);o.lineTo(x+1,y+6);o.closePath();o.fill();}
  rect(o,0,0,T,1,"rgba(255,255,255,.08)");rect(o,0,0,1,T,"rgba(255,255,255,.06)");rect(o,0,T-2,T,2,"rgba(0,0,0,.48)");rect(o,T-2,0,2,T,"rgba(0,0,0,.34)");
}
function drawTileDeep(o,p,v){
  rect(o,0,0,T,T,p.deep);
  for(let i=0;i<24;i++){const x=(i*5+Math.floor(v*33))%T,y=(i*7+Math.floor(v*18))%T;rect(o,x,y,1,1,i%2?mix(p.deep,"#fff",.22):mix(p.deep,"#000",.24));}
  rect(o,0,0,T,1,"rgba(255,255,255,.06)");rect(o,0,T-2,T,2,"rgba(0,0,0,.55)");rect(o,T-2,0,2,T,"rgba(0,0,0,.38)");
}
function drawTileCore(o,p,v){
  rect(o,0,0,T,T,mix(p.deep,"#000000",.45));
  for(let i=0;i<7;i++){const x=(i*8+Math.floor(v*19))%T;rect(o,x,0,1,T,rgba(p.accent,.12));}
  rect(o,0,T-2,T,2,"rgba(0,0,0,.65)");
}
function drawTileOre(o,p,v,c1,c2){ drawTileDeep(o,p,v);crystalPoly(o,12,20,7,17,c1);crystalPoly(o,6,21,4,11,mix(c1,"#000",.16));crystalPoly(o,18,22,4,12,c2);o.fillStyle=rgba(c1,.12);o.fillRect(0,0,T,T); }
function drawTileEssence(o,p,v){
  drawTileDeep(o,p,v);
  const g=o.createRadialGradient(12,12,1,12,12,15);g.addColorStop(0,rgba(p.accent,.8));g.addColorStop(1,"rgba(0,0,0,0)");
  o.fillStyle=g;o.fillRect(0,0,T,T);
  o.strokeStyle=p.accent;o.lineWidth=1.4;o.beginPath();o.arc(12,12,6,0,Math.PI*1.65);o.stroke();
  rect(o,11,4,2,16,rgba(p.glow2,.8));rect(o,4,11,16,2,rgba(p.glow2,.6));rect(o,9,9,6,6,p.glow2);
}
function drawTileWood(o,p,v){
  rect(o,0,0,T,T,mix(p.soil,"#5b2a0b",.6));
  for(let x=2;x<T;x+=5){rect(o,x,0,1,T,"rgba(0,0,0,.22)");rect(o,x+1,0,1,T,"rgba(255,255,255,.08)");}
  rect(o,0,T-2,T,2,"rgba(0,0,0,.42)");
}
function drawTileBrick(o,p,v){
  rect(o,0,0,T,T,mix(p.stone,"#64748b",.35));
  const bw=12,bh=6;
  for(let row=0;row<4;row++){const off=row%2?6:0;for(let x=-off;x<T;x+=bw){rect(o,x+1,row*bh+1,bw-2,bh-2,mix(p.stone,"#94a3b8",.35));rect(o,x,row*bh,bw,1,"rgba(0,0,0,.35)");rect(o,x,row*bh,1,bh,"rgba(0,0,0,.32)");rect(o,x+1,row*bh+1,bw-2,1,"rgba(255,255,255,.18)");}}
  rect(o,0,T-2,T,2,"rgba(0,0,0,.48)");
}
function drawTileChest(o,p,v){
  rect(o,2,6,20,15,"#713f12");rect(o,2,4,20,6,"#a16207");rect(o,2,9,20,2,"#451a03");rect(o,2,18,20,2,"#451a03");
  rect(o,10,8,5,7,p.glow);rect(o,11,9,3,3,p.glow2);rect(o,2,4,20,1,"rgba(255,255,255,.16)");
}
function drawTileStation(o,p,v){ drawTileBrick(o,p,v);crystalPoly(o,12,11,7,10,p.glow);rect(o,5,17,14,4,p.glow2);rect(o,8,14,8,2,"rgba(255,255,255,.6)"); }
function drawPlatform(o,p,v){ rect(o,0,10,T,5,p.soil);rect(o,0,10,T,1,"rgba(255,255,255,.22)");rect(o,0,14,T,1,"rgba(0,0,0,.45)"); }

function tileCacheKey(id,bId,v){ return P.planet+":"+bId+":"+id+":"+Math.floor(v*12); }
function tileCanvas(id,bId,v){
  if(id===TILE.WATER||id===TILE.LAVA) return null;
  const k=tileCacheKey(id,bId,v);
  if(tileCache.has(k)) return tileCache.get(k);
  const pal=BIOMES[bId]||BIOMES.crystal_forest;
  const oc=document.createElement("canvas"); oc.width=T; oc.height=T;
  const o=oc.getContext("2d"); o.imageSmoothingEnabled=false;
  if(id===TILE.TOP) drawTileTop(o,pal,v);
  else if(id===TILE.SOIL) drawTileSoil(o,pal,v);
  else if(id===TILE.STONE) drawTileStone(o,pal,v);
  else if(id===TILE.DEEP) drawTileDeep(o,pal,v);
  else if(id===TILE.CORE) drawTileCore(o,pal,v);
  else if(id===TILE.FERRITE) drawTileOre(o,pal,v,"#a3a3a3","#e5e7eb");
  else if(id===TILE.CRYSTAL) drawTileOre(o,pal,v,pal.glow,pal.glow2);
  else if(id===TILE.PLASMA) drawTileOre(o,pal,v,"#f97316","#fde047");
  else if(id===TILE.ESSENCE) drawTileEssence(o,pal,v);
  else if(id===TILE.WOOD) drawTileWood(o,pal,v);
  else if(id===TILE.BRICK) drawTileBrick(o,pal,v);
  else if(id===TILE.CHEST) drawTileChest(o,pal,v);
  else if(id===TILE.STATION) drawTileStation(o,pal,v);
  else if(id===TILE.PLATFORM) drawPlatform(o,pal,v);
  else drawTileStone(o,pal,v);
  tileCache.set(k,oc);
  return oc;
}

function drawSky(){
  const planet=planetObj(),centerBiome=biomeAt(Math.floor((camX+cv.width/2)/T));
  const night=dayTick>1350?Math.min(1,(dayTick-1350)/420):dayTick<220?Math.max(0,1-dayTick/220):0;
  const g=cx.createLinearGradient(0,0,0,cv.height);
  g.addColorStop(0,mix(planet.skyTop,"#000208",night*.8));
  g.addColorStop(.52,mix(planet.skyMid,"#020617",night*.55));
  g.addColorStop(1,mix(planet.skyBot,"#030712",night*.55));
  cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);
  cx.save();cx.globalAlpha=.16;
  const ng=cx.createRadialGradient(cv.width*.72-camX*.012,cv.height*.18,0,cv.width*.72-camX*.012,cv.height*.18,220);
  ng.addColorStop(0,centerBiome.glow);ng.addColorStop(1,"rgba(0,0,0,0)");
  cx.fillStyle=ng;cx.fillRect(0,0,cv.width,cv.height*.6);
  const ng2=cx.createRadialGradient(cv.width*.24-camX*.008,cv.height*.25,0,cv.width*.24-camX*.008,cv.height*.25,280);
  ng2.addColorStop(0,centerBiome.accent);ng2.addColorStop(1,"rgba(0,0,0,0)");
  cx.fillStyle=ng2;cx.fillRect(0,0,cv.width,cv.height*.6);cx.restore();
  for(let i=0;i<220;i++){
    const x=(i*97+Math.sin(i*12.7)*2000)%cv.width,y=(i*53+Math.cos(i*5.3)*1200)%Math.floor(cv.height*.68);
    const pulse=(Math.sin(tick*.028+i)+1)*.5;
    cx.fillStyle="rgba(255,255,255,"+(.22+night*.55)*(.45+pulse*.55)+")";
    cx.beginPath();cx.arc(x,y,.6+(i%3)*.45,0,Math.PI*2);cx.fill();
  }
  if(P.planet==="Lumora"||P.planet==="Zephyrion"||activeEvent==="aurora") drawAurora(centerBiome);
  if(activeEvent==="storm") drawStorm();
  drawParallax(centerBiome);
}
function drawAurora(b){
  cx.save();const cols=[b.glow,b.glow2,b.accent];
  for(let i=0;i<4;i++){
    cx.globalAlpha=.07+i*.016;
    const grad=cx.createLinearGradient(0,0,0,cv.height*.45);
    grad.addColorStop(0,"rgba(0,0,0,0)");grad.addColorStop(.5,cols[i%cols.length]);grad.addColorStop(1,"rgba(0,0,0,0)");
    cx.fillStyle=grad;cx.beginPath();cx.moveTo(0,cv.height*.08);
    for(let x=0;x<=cv.width+80;x+=60) cx.lineTo(x,cv.height*(.15+.08*Math.sin(x*.007+tick*.008+i)));
    cx.lineTo(cv.width,0);cx.lineTo(0,0);cx.closePath();cx.fill();
  }
  cx.restore();
}
function drawStorm(){
  cx.strokeStyle="rgba(180,220,255,.26)";cx.lineWidth=1;
  for(let i=0;i<60;i++){const x=(tick*4+i*73)%cv.width,y=(tick*9+i*131)%cv.height;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x-4,y+14);cx.stroke();}
  if(tick%120<8){cx.fillStyle="rgba(255,255,255,.08)";cx.fillRect(0,0,cv.width,cv.height);}
}
function drawParallax(b){
  for(let layer=0;layer<4;layer++){
    const speed=.025+layer*.032,alpha=.24-layer*.035,baseY=cv.height*(.66+layer*.055),height=105+layer*45;
    cx.fillStyle="rgba(2,8,20,"+alpha+")";
    for(let i=-3;i<10;i++){const x=i*240-(camX*speed%240),peak=baseY-height-Math.sin(i*1.7+planetSeed)*36;cx.beginPath();cx.moveTo(x,baseY);cx.lineTo(x+118,peak);cx.lineTo(x+270,baseY);cx.closePath();cx.fill();}
  }
}

function drawBackgroundWalls(){
  const startX=Math.floor(camX/T)-3,endX=startX+Math.ceil(cv.width/T)+7;
  const startY=Math.floor(camY/T)-3,endY=startY+Math.ceil(cv.height/T)+7;
  for(let x=startX;x<endX;x++){
    const s=surfaceAt(x),b=biomeAt(x);
    for(let y=startY;y<endY;y++){
      if(y<s) continue;
      const id=getBlock(x,y);
      if(id!==TILE.AIR&&!liquid(id)) continue;
      const d=y-s,sx=x*T-camX,sy=y*T-camY,dep=Math.min(1,d/70);
      cx.globalAlpha=.42+dep*.18;
      cx.fillStyle=dep>.55?mix(b.deep,"#000",.45):mix(b.stone,b.deep,.4);
      cx.fillRect(sx,sy,T,T);
      if(iRand(x,y,333)>.88){cx.fillStyle=rgba(b.glow,.05);cx.fillRect(sx+3,sy+4,5,3);}
    }
  }
  cx.globalAlpha=1;
}

function drawBiomeLargeProps(){
  const start=Math.floor((camX-300)/80)*80,end=camX+cv.width+360;
  for(let wx=start;wx<end;wx+=80){
    const tx=Math.floor(wx/T),bId=biomeIdAt(tx),b=BIOMES[bId]||BIOMES.crystal_forest,r=iRand(tx,0,680);
    if(r<.56) continue;
    const surface=surfaceAt(tx)*T,sx=wx-camX,sy=surface-camY;
    if(sy<-180||sy>cv.height+180) continue;
    const d=b.decor;
    if(d==="crystal"||d==="lake"||d==="ice"||d==="sky"||d==="glow") drawCrystalCluster(sx,sy,.65+r*.7,b.glow,b.glow2,b.accent);
    else if(d==="jungle"||d==="roots"||d==="swamp"||d==="flower") drawAlienTree(sx,sy,.7+r*.7,b);
    else if(d==="fungus") drawHugeMushrooms(sx,sy,.7+r*.75,b);
    else if(d==="lava"||d==="ember"||d==="ash") drawLavaVent(sx,sy,.7+r*.6,b);
    else if(d==="ruins") drawRuinsProp(sx,sy,.75+r*.55,b);
    else if(d==="coral"||d==="kelp"||d==="abyss") drawCoralProp(sx,sy,.8+r*.65,b);
    else if(d==="void"||d==="wind"||d==="cloud") drawVoidObelisk(sx,sy,.8+r*.6,b);
    else drawCrystalCluster(sx,sy,.55+r*.45,b.glow,b.glow2,b.accent);
  }
}
function drawCrystalCluster(sx,sy,sc,c1,c2,c3){cx.save();cx.shadowColor=c1;cx.shadowBlur=18;crystalPoly(cx,sx,sy,18*sc,70*sc,c1);crystalPoly(cx,sx+20*sc,sy+5*sc,13*sc,52*sc,c2);crystalPoly(cx,sx-18*sc,sy+8*sc,11*sc,42*sc,c3);crystalPoly(cx,sx+38*sc,sy+12*sc,9*sc,34*sc,c1);cx.restore();}
function drawAlienTree(sx,sy,sc,b){cx.save();cx.strokeStyle=mix(b.soil,"#2a1608",.45);cx.lineWidth=6*sc;cx.beginPath();cx.moveTo(sx,sy);cx.quadraticCurveTo(sx-16*sc,sy-48*sc,sx+12*sc,sy-95*sc);cx.stroke();cx.shadowColor=b.glow;cx.shadowBlur=16;cx.fillStyle=b.glow;for(let i=0;i<7;i++){cx.beginPath();cx.arc(sx-32*sc+i*11*sc,sy-98*sc+Math.sin(i+tick*.01)*10*sc,10*sc+(i%3)*3*sc,0,Math.PI*2);cx.fill();}cx.restore();}
function drawHugeMushrooms(sx,sy,sc,b){cx.save();cx.fillStyle=mix(b.soil,"#ffffff",.2);cx.fillRect(sx-5*sc,sy-45*sc,10*sc,45*sc);cx.shadowColor=b.glow;cx.shadowBlur=16;cx.fillStyle=b.accent;cx.beginPath();cx.ellipse(sx,sy-50*sc,38*sc,18*sc,0,0,Math.PI*2);cx.fill();cx.fillStyle="rgba(255,255,255,.45)";for(let i=0;i<5;i++){cx.beginPath();cx.arc(sx-20*sc+i*10*sc,sy-55*sc+(i%2)*5*sc,3.2*sc,0,Math.PI*2);cx.fill();}cx.restore();}
function drawLavaVent(sx,sy,sc,b){cx.save();cx.fillStyle="#3b0a04";cx.fillRect(sx-6*sc,sy-50*sc,18*sc,50*sc);cx.shadowColor="#f97316";cx.shadowBlur=18;cx.fillStyle="#f97316";cx.fillRect(sx-1*sc,sy-48*sc,8*sc,48*sc);cx.fillStyle="#fde047";cx.fillRect(sx+2*sc,sy-42*sc,3*sc,25*sc);cx.restore();}
function drawRuinsProp(sx,sy,sc,b){cx.save();cx.fillStyle=rgba(mix(b.stone,"#94a3b8",.4),.65);cx.fillRect(sx-28*sc,sy-82*sc,16*sc,82*sc);cx.fillRect(sx+16*sc,sy-64*sc,16*sc,64*sc);cx.shadowColor=b.glow;cx.shadowBlur=12;cx.fillStyle=b.glow;cx.fillRect(sx-21*sc,sy-48*sc,4*sc,20*sc);cx.fillRect(sx+23*sc,sy-39*sc,4*sc,17*sc);cx.restore();}
function drawCoralProp(sx,sy,sc,b){cx.save();cx.shadowColor=b.glow;cx.shadowBlur=13;cx.strokeStyle=b.glow;cx.lineWidth=3*sc;for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(sx,sy);cx.quadraticCurveTo(sx-25*sc+i*12*sc,sy-28*sc-i*6*sc,sx-36*sc+i*18*sc,sy-55*sc-i*3*sc);cx.stroke();}cx.fillStyle=b.accent;for(let i=0;i<5;i++){cx.beginPath();cx.arc(sx-28*sc+i*13*sc,sy-48*sc-i*3*sc,4*sc,0,Math.PI*2);cx.fill();}cx.restore();}
function drawVoidObelisk(sx,sy,sc,b){cx.save();cx.shadowColor=b.accent;cx.shadowBlur=18;cx.fillStyle=mix(b.deep,"#000",.4);cx.beginPath();cx.moveTo(sx,sy-92*sc);cx.lineTo(sx-15*sc,sy-8*sc);cx.lineTo(sx+17*sc,sy-8*sc);cx.closePath();cx.fill();cx.fillStyle=b.glow;cx.fillRect(sx-3*sc,sy-65*sc,6*sc,34*sc);cx.restore();}

function drawWorld(){
  drawBackgroundWalls();drawBiomeLargeProps();
  const startX=Math.floor(camX/T)-2,endX=startX+Math.ceil(cv.width/T)+5;
  const startY=Math.floor(camY/T)-2,endY=startY+Math.ceil(cv.height/T)+5;
  for(let x=startX;x<endX;x++){
    for(let y=startY;y<endY;y++){
      const id=getBlock(x,y);if(id===TILE.AIR) continue;
      const sx=x*T-camX,sy=y*T-camY,bId=biomeIdAt(x),b=BIOMES[bId]||BIOMES.crystal_forest,v=iRand(x,y,515);
      if(id===TILE.WATER){drawWater(sx,sy,b,x,y);continue;}
      if(id===TILE.LAVA){drawLava(sx,sy,x,y);continue;}
      const tc=tileCanvas(id,bId,v);if(tc) cx.drawImage(tc,sx,sy);
      if(id===TILE.TOP&&!solid(getBlock(x,y-1))) drawSurfaceEdge(sx,sy,b,x);
      if(id===TILE.CRYSTAL||id===TILE.PLASMA||id===TILE.ESSENCE){
        cx.save();cx.globalCompositeOperation="lighter";
        const col=id===TILE.PLASMA?"#f97316":id===TILE.ESSENCE?b.accent:b.glow;
        const g=cx.createRadialGradient(sx+12,sy+12,0,sx+12,sy+12,54);
        g.addColorStop(0,rgba(col,.25));g.addColorStop(1,"rgba(0,0,0,0)");
        cx.fillStyle=g;cx.fillRect(sx-42,sy-42,108,108);cx.restore();
      }
    }
  }
}
function drawSurfaceEdge(sx,sy,b,x){
  cx.fillStyle=rgba(b.glow,.18);cx.fillRect(sx,sy,T,2);
  if(iRand(x,0,82)>.72){cx.shadowColor=b.glow;cx.shadowBlur=8;crystalPoly(cx,sx+8,sy+3,4,16,b.glow);cx.shadowBlur=0;}
}
function drawWater(sx,sy,b,x,y){
  cx.fillStyle=rgba(b.water,.65);cx.fillRect(sx,sy,T,T);
  const off=Math.sin(tick*.04+x*.3+y)*3;
  cx.fillStyle="rgba(255,255,255,.25)";cx.fillRect(sx+off,sy+4,T-5,1);cx.fillRect(sx-off*.5,sy+12,T-8,1);
}
function drawLava(sx,sy,x,y){
  cx.fillStyle="#7c1d12";cx.fillRect(sx,sy,T,T);
  for(let ix=0;ix<T;ix+=3){const h=5+Math.sin(tick*.08+ix+x)*3;cx.fillStyle="#f97316";cx.fillRect(sx+ix,sy,3,h);}
  cx.shadowColor="#f97316";cx.shadowBlur=16;cx.fillStyle="#fde047";cx.beginPath();cx.arc(sx+8+Math.sin(tick*.05+x)*4,sy+13,3,0,Math.PI*2);cx.fill();cx.shadowBlur=0;
}

function drawLighting(){
  const b=biomeAt(Math.floor(P.x/T));
  cx.save();cx.globalCompositeOperation="lighter";
  const px=P.x-camX+P.w/2,py=P.y-camY+P.h/2;
  const pg=cx.createRadialGradient(px,py,0,px,py,130);
  pg.addColorStop(0,rgba(b.glow,.18));pg.addColorStop(1,"rgba(0,0,0,0)");
  cx.fillStyle=pg;cx.fillRect(px-130,py-130,260,260);cx.restore();
  const depth=Math.floor((P.y+P.h/2)/T)-surfaceAt(Math.floor((P.x+P.w/2)/T));
  if(depth>10){const darkness=clamp((depth-10)/90,0,.62);cx.fillStyle="rgba(0,0,0,"+darkness+")";cx.fillRect(0,0,cv.width,cv.height);}
  const vg=cx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.22,cv.width/2,cv.height/2,cv.width*.78);
  vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(.66,"rgba(0,0,0,.10)");vg.addColorStop(1,"rgba(0,0,0,.65)");
  cx.fillStyle=vg;cx.fillRect(0,0,cv.width,cv.height);
}
function drawAtmosphere(){
  const b=biomeAt(Math.floor((camX+cv.width/2)/T));cx.save();
  for(let i=0;i<7;i++){const x=-280+((tick*(.15+i*.065))%(cv.width+560)),y=cv.height*(.23+i*.11)+Math.sin(tick*.008+i)*18;cx.globalAlpha=.055;cx.fillStyle=b.glow;cx.beginPath();cx.ellipse(x,y,260,30,0,0,Math.PI*2);cx.fill();}
  for(let i=0;i<55;i++){const x=(i*83+tick*.20)%cv.width,y=(i*47+Math.sin(tick*.015+i)*35)%cv.height;cx.globalAlpha=.06+(i%5)*.022;cx.fillStyle=i%2?b.glow:b.glow2;cx.beginPath();cx.arc(x,y,1+(i%3),0,Math.PI*2);cx.fill();}
  cx.restore();cx.globalAlpha=1;
}

function drawMenu(){
  const p=PLANETS.Lumora;
  const g=cx.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,p.skyTop);g.addColorStop(.55,p.skyMid);g.addColorStop(1,p.skyBot);cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);
  for(let i=0;i<240;i++){const x=(i*97+Math.sin(i)*6000+cv.width*6)%cv.width,y=(i*53+tick*(.15+(i%3)*.05))%cv.height,a=(Math.sin(tick*.03+i)+1)*.5;cx.fillStyle="rgba(255,255,255,"+(.25+a*.45)+")";cx.beginPath();cx.arc(x,y,.7+(i%3)*.5,0,Math.PI*2);cx.fill();}
  drawAurora(BIOMES.crystal_forest);
  cx.textAlign="center";
  cx.shadowColor="#38bdf8";cx.shadowBlur=32;cx.fillStyle="#67e8f9";cx.font="bold 66px Courier New";cx.fillText("ESTRELLA",cv.width/2,cv.height*.30);cx.shadowBlur=0;
  cx.fillStyle="#bae6fd";cx.font="14px Courier New";cx.fillText("WORLDS ALIVE EDITION",cv.width/2,cv.height*.37);
  cx.fillStyle="#7ea4c2";cx.font="12px Courier New";cx.fillText("Biomas 路 Cuevas 路 Estructuras 路 Enemigos 煤nicos 路 Viaje espacial",cv.width/2,cv.height*.43);
  cx.fillStyle="rgba(56,189,248,.10)";cx.fillRect(cv.width/2-165,cv.height*.54-24,330,48);cx.strokeStyle="rgba(56,189,248,.45)";cx.strokeRect(cv.width/2-165,cv.height*.54-24,330,48);
  cx.fillStyle="#22d3ee";cx.font="bold 16px Courier New";cx.fillText("PRESIONA ENTER PARA JUGAR",cv.width/2,cv.height*.54+5);
  cx.fillStyle="#64748b";cx.font="10px Courier New";cx.fillText("A/D mover 路 W saltar 路 F minar 路 G atacar 路 B poner 路 C crafting 路 E planetas",cv.width/2,cv.height*.90);
  cx.textAlign="left";
}
function drawGameOver(){
  cx.fillStyle="rgba(0,0,0,.88)";cx.fillRect(0,0,cv.width,cv.height);
  cx.textAlign="center";cx.fillStyle="#ef4444";cx.font="bold 48px Courier New";cx.fillText("GAME OVER",cv.width/2,cv.height*.40);
  cx.fillStyle="#cbd5e1";cx.font="15px Courier New";cx.fillText("LVL "+P.level+" 路 "+coins+" monedas 路 "+P.planet,cv.width/2,cv.height*.50);cx.fillText("Presiona R para reiniciar",cv.width/2,cv.height*.58);cx.textAlign="left";
}
