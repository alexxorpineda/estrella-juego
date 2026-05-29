"use strict";

/* â”€â”€ Craft helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function canCraft(r){
  return Object.entries(r.cost).every(function(kv){ return(inv[kv[0]]||0)>=kv[1]; });
}
function payCost(r){
  for(const[k,v]of Object.entries(r.cost)) inv[k]-=v;
}

/* â”€â”€ Craft panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderCraft(){
  const grid=document.getElementById("recipeGrid"); if(!grid) return;
  grid.innerHTML="";
  for(const r of RECIPES[currentCraftTab]||[]){
    const ok=canCraft(r), div=document.createElement("div");
    div.className="recipe"+(ok?" ok":"");
    const cost=Object.entries(r.cost).map(function(kv){ return kv[0]+":"+kv[1]; }).join(" ");
    div.innerHTML="<div class=\"ri\">"+r.icon+"</div><div class=\"rn\">"+r.name+"</div><div class=\"rc\">"+cost+"</div>";
    div.onclick=(function(recipe){ return function(){
      const craftMsg=document.getElementById("craftMsg");
      if(!canCraft(recipe)){ if(craftMsg) craftMsg.textContent="Faltan materiales."; sfx.hurt(); return; }
      payCost(recipe); recipe.fn(); sfx.craft();
      if(craftMsg) craftMsg.textContent="âœ“ "+recipe.name+" fabricado";
      renderCraft(); updateHUD();
    }; })(r);
    grid.appendChild(div);
  }
}

function toggleCraft(force){
  const p=document.getElementById("craftPanel"); if(!p) return;
  const open=typeof force==="boolean"?force:p.style.display!=="block";
  p.style.display=open?"block":"none";
  if(open) renderCraft();
}

function setupCraftTabs(){
  document.querySelectorAll(".tab").forEach(function(t){
    t.onclick=function(){
      document.querySelectorAll(".tab").forEach(function(x){ x.classList.remove("on"); });
      t.classList.add("on"); currentCraftTab=t.dataset.tab||"survival"; renderCraft();
    };
  });
}

/* â”€â”€ Drill a cave opening â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function drillCave(){
  const tx=Math.floor(P.x/T), ty=Math.floor(P.y/T);
  for(let y=ty;y<ty+22;y++)
    for(let x=tx-3;x<=tx+3;x++)
      if(iRand(x,y,987)>.18) setBlock(x,y,TILE.AIR);
  burst(P.x,P.y,35,"#94a3b8"); sfx.boom();
}
