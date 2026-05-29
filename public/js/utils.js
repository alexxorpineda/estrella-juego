"use strict";

/* â”€â”€ Noise & Hash â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function hash2(x,y,s){
  s=s||0;
  return fract(Math.sin(x*127.1+y*311.7+s*74.7+planetSeed*17.13)*43758.5453123);
}
function noise2(x,y,s){
  s=s||0;
  const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
  const a=hash2(xi,yi,s),b=hash2(xi+1,yi,s),c=hash2(xi,yi+1,s),d=hash2(xi+1,yi+1,s);
  return lerp(lerp(a,b,smooth(xf)),lerp(c,d,smooth(xf)),smooth(yf));
}
function fbm(x,y,s){
  s=s||0;
  let v=0,amp=.5,freq=1;
  for(let i=0;i<5;i++){ v+=noise2(x*freq,y*freq,s+i*19)*amp; freq*=2; amp*=.5; }
  return v;
}
function iRand(x,y,s){ s=s||0; return hash2(Math.floor(x),Math.floor(y),s); }

/* â”€â”€ Color helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function hexToRgb(hex){
  hex=hex.replace("#","");
  if(hex.length===3) hex=hex.split("").map(function(c){ return c+c; }).join("");
  return{ r:parseInt(hex.slice(0,2),16)||0, g:parseInt(hex.slice(2,4),16)||0, b:parseInt(hex.slice(4,6),16)||0 };
}
function rgba(hex,a){ const c=hexToRgb(hex); return"rgba("+c.r+","+c.g+","+c.b+","+a+")"; }
function mix(a,b,t){
  const ca=hexToRgb(a),cb=hexToRgb(b);
  return"rgb("+Math.floor(lerp(ca.r,cb.r,t))+","+Math.floor(lerp(ca.g,cb.g,t))+","+Math.floor(lerp(ca.b,cb.b,t))+")";
}

/* â”€â”€ Canvas primitives â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function rect(o,x,y,w,h,c){ o.fillStyle=c; o.fillRect(x,y,w,h); }
function crystalPoly(o,x,y,w,h,c){
  o.fillStyle=c;
  o.beginPath(); o.moveTo(x,y-h); o.lineTo(x-w*.45,y-h*.62); o.lineTo(x-w*.32,y-3);
  o.lineTo(x,y); o.lineTo(x+w*.32,y-3); o.lineTo(x+w*.45,y-h*.62); o.closePath(); o.fill();
  o.fillStyle="rgba(255,255,255,.45)";
  o.beginPath(); o.moveTo(x,y-h+3); o.lineTo(x-w*.12,y-h*.5); o.lineTo(x,y-h*.18); o.closePath(); o.fill();
}
