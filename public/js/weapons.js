"use strict";

const WEAPONS={
  fists:{id:"fists",name:"PuÃ±os",icon:"ðŸ‘Š",damage:6,tier:0,color:"#94a3b8"},
  crystal_sword:{id:"crystal_sword",name:"Espada de Cristal",icon:"ðŸ—¡",damage:14,tier:2,color:"#38bdf8"},
  astral_blade:{id:"astral_blade",name:"Hoja Astral",icon:"âš”",damage:20,tier:3,color:"#a5f3fc"},
  plasma_lance:{id:"plasma_lance",name:"Lanza-Plasma",icon:"âš¡",damage:26,tier:4,color:"#f97316"},
  void_staff:{id:"void_staff",name:"BÃ¡culo del VacÃ­o",icon:"ðŸ”®",damage:22,tier:4,color:"#c084fc"},
  gaia_hammer:{id:"gaia_hammer",name:"Martillo Gaia",icon:"ðŸ”¨",damage:24,tier:3,color:"#4ade80"},
  prism_bow:{id:"prism_bow",name:"Arco PrismÃ¡tico",icon:"ðŸ¹",damage:18,tier:3,color:"#bae6fd"}
};

const ARMORS={
  none:{id:"none",name:"Sin armadura",icon:"ðŸ‘•",defense:0,tier:0,color:"#94a3b8"},
  ferrite:{id:"ferrite",name:"Armadura de Ferrita",icon:"ðŸ›¡",defense:4,tier:1,color:"#94a3b8"},
  crystal:{id:"crystal",name:"Armadura de Cristal",icon:"ðŸ’Ž",defense:8,tier:2,color:"#38bdf8"},
  exosuit:{id:"exosuit",name:"Exotraje Gravitacional",icon:"ðŸ¦¾",defense:12,tier:3,color:"#60a5fa"},
  astral:{id:"astral",name:"Armadura Astral",icon:"ðŸŒŒ",defense:16,tier:4,color:"#c084fc"}
};

const ENEMY_SPECIAL_DROPS={
  crystal_sword:{id:"crystal_sword",name:"Espada de Cristal",icon:"ðŸ—¡",damage:14,tier:2,color:"#38bdf8"},
  prism_bow:{id:"prism_bow",name:"Arco PrismÃ¡tico",icon:"ðŸ¹",damage:18,tier:3,color:"#bae6fd"},
  astral_blade:{id:"astral_blade",name:"Hoja Astral",icon:"âš”",damage:22,tier:3,color:"#a78bfa"},
  plasma_lance:{id:"plasma_lance",name:"Lanza Plasma",icon:"âš¡",damage:28,tier:4,color:"#f97316"},
  void_staff:{id:"void_staff",name:"BÃ¡culo del VacÃ­o",icon:"ðŸ”®",damage:24,tier:4,color:"#c084fc"},
  gaia_hammer:{id:"gaia_hammer",name:"Martillo Gaia",icon:"ðŸ”¨",damage:26,tier:4,color:"#4ade80"},
  ferrite_armor:{id:"ferrite",name:"Armadura de Ferrita",icon:"ðŸ›¡",defense:4,tier:1,color:"#94a3b8"},
  crystal_armor:{id:"crystal",name:"Armadura de Cristal",icon:"ðŸ’Ž",defense:8,tier:2,color:"#38bdf8"},
  exosuit:{id:"exosuit",name:"Exotraje Gravitacional",icon:"ðŸ¦¾",defense:12,tier:3,color:"#60a5fa"},
  astral_armor:{id:"astral",name:"Armadura Astral",icon:"ðŸŒŒ",defense:16,tier:4,color:"#c084fc"}
};

const RECIPES={
  survival:[
    {name:"Combustible x30",icon:"â›½",cost:{carbono:5,ferrita:3,plasma:1},fn(){P.fuel=Math.min(100,P.fuel+30);}},
    {name:"Hipercombustible",icon:"ðŸš€",cost:{plasma:4,cristal:4,esencia:1},fn(){P.fuel=Math.min(100,P.fuel+65);}},
    {name:"Kit MÃ©dico",icon:"ðŸ’Š",cost:{carbono:3,plasma:2},fn(){P.hp=Math.min(P.maxHp,P.hp+55);}},
    {name:"Cartucho Oâ‚‚",icon:"ðŸ’¨",cost:{cristal:3,plasma:1},fn(){P.oxygen=Math.min(100,P.oxygen+60);}},
    {name:"RaciÃ³n OrgÃ¡nica",icon:"ðŸŒ¿",cost:{carbono:4},fn(){P.food=Math.min(100,P.food+55);}},
    {name:"+30 HP MÃ¡x",icon:"â¤",cost:{ferrita:15,esencia:3},fn(){P.maxHp+=30;P.hp=P.maxHp;}},
    {name:"+20 MP MÃ¡x",icon:"âœ¦",cost:{cristal:8,esencia:2},fn(){P.maxMana+=20;P.mana=P.maxMana;}}
  ],
  weapons:[
    {name:"Espada Cristal",icon:"ðŸ—¡",cost:{cristal:10,ferrita:5},fn(){equipWeapon("crystal_sword");}},
    {name:"Arco PrismÃ¡tico",icon:"ðŸ¹",cost:{cristal:10,carbono:8,ferrita:4},fn(){equipWeapon("prism_bow");}},
    {name:"Hoja Astral",icon:"âš”",cost:{cristal:16,plasma:7,esencia:4},fn(){equipWeapon("astral_blade");}},
    {name:"BÃ¡culo VacÃ­o",icon:"ðŸ”®",cost:{esencia:10,cristal:8,plasma:4},fn(){equipWeapon("void_staff");}},
    {name:"Martillo Gaia",icon:"ðŸ”¨",cost:{carbono:18,ferrita:10,esencia:3},fn(){equipWeapon("gaia_hammer");}},
    {name:"Lanza-Plasma",icon:"âš¡",cost:{plasma:16,cristal:12,esencia:8},fn(){equipWeapon("plasma_lance");}}
  ],
  armor:[
    {name:"Ferrita",icon:"ðŸ›¡",cost:{ferrita:24,carbono:8},fn(){equipArmor("ferrite");}},
    {name:"Cristal",icon:"ðŸ’Ž",cost:{cristal:18,ferrita:12,plasma:4},fn(){equipArmor("crystal");}},
    {name:"Exotraje",icon:"ðŸ¦¾",cost:{ferrita:25,plasma:10,cristal:14},fn(){equipArmor("exosuit");P.hasExo=true;P.exoCharge=1600;}},
    {name:"Astral",icon:"ðŸŒŒ",cost:{esencia:12,plasma:12,cristal:20},fn(){equipArmor("astral");}}
  ],
  ship:[
    {name:"NÃºcleo Nave +1",icon:"ðŸ›¸",cost:{ferrita:20,cristal:6,plasma:4},fn(){P.shipLevel++;msg("Nave Nv."+P.shipLevel,"#22d3ee");}},
    {name:"Tanque Extra",icon:"â›½",cost:{ferrita:18,plasma:6},fn(){P.fuel=Math.min(100,P.fuel+45);}},
    {name:"Baliza",icon:"ðŸ“¡",cost:{ferrita:12,cristal:4},fn(){const tx=Math.floor(P.x/T),ty=Math.floor(P.y/T);setBlock(tx,ty,TILE.STATION);}}
  ],
  world:[
    {name:"Invocar Boss",icon:"ðŸ’€",cost:{esencia:5,plasma:5,cristal:5},fn(){spawnBoss();}},
    {name:"Lluvia Meteoro",icon:"â˜„",cost:{plasma:6,esencia:4},fn(){triggerEvent("meteor");}},
    {name:"Aurora",icon:"ðŸŒŒ",cost:{esencia:8,cristal:6},fn(){triggerEvent("aurora");}},
    {name:"Abrir Caverna",icon:"ðŸ•³",cost:{plasma:5,ferrita:8},fn(){drillCave();}}
  ]
};
