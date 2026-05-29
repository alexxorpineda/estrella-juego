"use strict";

const _AudioCtx = window.AudioContext||window.webkitAudioContext;
let AC=null;

function unlockAudio(){
  if(!AC) AC=new _AudioCtx();
  if(AC.state==="suspended") AC.resume();
}

function tone(freq,type,dur,vol){
  type=type||"sine"; dur=dur||.08; vol=vol||.08;
  if(!AC||AC.state==="suspended") return;
  const o=AC.createOscillator(), g=AC.createGain();
  o.type=type; o.frequency.value=freq;
  g.gain.setValueAtTime(vol,AC.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+dur);
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur);
}

const sfx={
  mine(){ tone(140+Math.random()*80,"square",.06,.12); },
  jump(){ tone(330,"sine",.1,.08); },
  hurt(){ tone(80,"sawtooth",.16,.16); },
  hit(){ tone(250,"triangle",.07,.1); },
  shoot(){ tone(760,"sawtooth",.05,.07); },
  step(){ tone(120+Math.random()*40,"square",.04,.05); },
  drop(){ tone(880,"sine",.12,.10); },
  craft(){ [520,720,980].forEach(function(f,i){ setTimeout(function(){ tone(f,"sine",.08,.1); }, i*60); }); },
  level(){ [330,440,550,770,990].forEach(function(f,i){ setTimeout(function(){ tone(f,"sine",.13,.11); }, i*70); }); },
  boom(){ for(let i=0;i<5;i++) setTimeout(function(){ tone(55+Math.random()*80,"sawtooth",.13,.18); }, i*35); }
};
