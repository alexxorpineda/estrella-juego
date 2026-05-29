"use strict";

const T=24, GRAV=.55, DAY_LEN=2400;

const TILE={
  AIR:0,TOP:1,SOIL:2,STONE:3,DEEP:4,
  FERRITE:5,CRYSTAL:6,PLASMA:7,ESSENCE:8,
  WATER:9,LAVA:10,WOOD:11,BRICK:12,
  CHEST:13,STATION:14,PLATFORM:15,CORE:16
};

function solid(id){ return id>0&&id!==TILE.WATER&&id!==TILE.LAVA&&id!==TILE.PLATFORM; }
function liquid(id){ return id===TILE.WATER||id===TILE.LAVA; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function lerp(a,b,t){ return a+(b-a)*t; }
function smooth(t){ return t*t*(3-2*t); }
function fract(n){ return n-Math.floor(n); }
function chance(v){ return Math.random()<v; }
