"use strict";

/* â”€â”€ Planets panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderPlanets(){
  const wrap=document.getElementById("planetRows"); if(!wrap) return; wrap.innerHTML="";
  Object.entries(PLANETS).forEach(function(kv){
    const name=kv[0], p=kv[1];
    const row=document.createElement("div");
    row.className="planetRow"+(name===P.planet?" cur":"");
    row.innerHTML="<div><div class=\"pn\">"+p.icon+" "+name+"</div><div class=\"pd\">"+p.desc+" Â· "+p.gravity+"g</div></div><div class=\"pg\">"+(name===P.planet?"ACTUAL":"VIAJAR")+"</div>";
    if(name!==P.planet) row.onclick=function(){ startTravel(name); };
    wrap.appendChild(row);
  });
}
function togglePlanets(force){
  const p=document.getElementById("planetPanel"); if(!p) return;
  const open=typeof force==="boolean"?force:p.style.display!=="block";
  p.style.display=open?"block":"none";
  if(open) renderPlanets();
}
