"use strict";

let cv, cx;

const P={
  x:260,y:120,w:15,h:30,vx:0,vy:0,onGround:false,facingR:true,iframes:0,
  hp:100,maxHp:100,mana:60,maxMana:60,stamina:100,maxStamina:100,oxygen:100,food:100,fuel:90,
  xp:0,level:1,planet:"Lumora",gravity:PLANETS.Lumora.gravity,
  speed:3.15,jumpPow:11.4,jumpHeld:false,
  weaponId:"fists",weaponName:"PuÃ±os",weaponTier:0,damage:6,
  armorId:"none",armorName:"Sin armadura",armorTier:0,defense:0,
  attacking:false,attackFrame:0,shipLevel:1,timeOnPlanet:0,
  hasExo:false,exoCharge:0,poison:0
};

const inv={ ferrita:14, carbono:18, cristal:8, plasma:4, esencia:3 };
let coins=120;

let sessionSeed=Math.floor(Math.random()*999999);
let planetSeed=0;
let tick=0, dayTick=0;
let camX=0, camY=0;
let gameState="menu";
let selectedSlot=0;
let currentCraftTab="survival";
let boss=null, bossFight=false;
let activeEvent=null, eventTimer=0, nextEvent=2200;
let pendingDrop=null;
let travelMode=false, travelTimer=0, targetPlanet="";
const TRAVEL_DUR=480;
let shipShield=100;
let shipEnemies=[], shipLasers=[];

const keys={};
const mouse={ x:0, y:0, down:false, used:false };

const world=new Map();
const surfaceCache=new Map();
const tileCache=new Map();
const enemies=[], projectiles=[], particles=[], meteors=[];
