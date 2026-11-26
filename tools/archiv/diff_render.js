"use strict";
// T2-Verifikation: rendert identische Inhalte in ORIG- und NEU-App und vergleicht getComputedStyle
// elementweise. Fängt Kaskaden-/Spezifitäts-Regressionen durch style→class-Umbau.
const { JSDOM } = require("jsdom");
const path = require("path");
const fs = require("fs");

const PROPS = ["color","background","background-color","margin","margin-top","margin-bottom","margin-left",
  "margin-right","padding","padding-top","padding-bottom","padding-left","padding-right","width","height",
  "min-width","min-height","max-width","display","border","border-color","border-radius","border-left",
  "flex","flex-wrap","gap","font-family","font-size","font-weight","text-align","align-items","align-self",
  "justify-content","position","opacity","outline","white-space","overflow","transform","z-index",
  "grid-template-columns","grid-template-rows","inset","cursor","writing-mode","touch-action","user-select"];

function makeLS(){ const s={}; return {getItem:k=>Object.prototype.hasOwnProperty.call(s,k)?s[k]:null,
  setItem:(k,v)=>{s[k]=String(v);},removeItem:k=>{delete s[k];},clear:()=>{Object.keys(s).forEach(k=>delete s[k]);},
  key:i=>Object.keys(s)[i]||null,get length(){return Object.keys(s).length;},_store:s}; }

async function boot(dir){
  const dom = await JSDOM.fromFile(path.join(dir,"app.html"), {
    runScripts:"dangerously", resources:"usable", pretendToBeVisual:true,
    url:"file://"+dir+"/app.html",
    beforeParse(w){ w.confirm=()=>true; w.alert=()=>{};
      Object.defineProperty(w,"localStorage",{configurable:true,value:makeLS()}); }
  });
  await new Promise(r=>setTimeout(r,2600));
  return dom.window;
}

function walk(node){ // Reihenfolge-stabiler DFS über Elementknoten
  const out=[]; (function rec(n){ if(n.nodeType!==1) return; out.push(n);
    for(let c=n.firstChild;c;c=c.nextSibling) rec(c); })(node); return out;
}

(async function(){
  const dirO="/tmp/t2orig", dirN="/tmp/t2new";
  const wO=await boot(dirO), wN=await boot(dirN);
  // Determinismus: shuffle=Identität in beiden, damit Struktur/Reihenfolge exakt gleich
  wO.L.shuffle=a=>a.slice(); wN.L.shuffle=a=>a.slice();

  let mism=0, verglichen=0, szenarien=0;
  function vergleiche(label, hostO, hostN){
    const eO=walk(hostO), eN=walk(hostN);
    if(eO.length!==eN.length){ console.log("STRUKTUR-DIFF ["+label+"]: orig="+eO.length+" neu="+eN.length+" Elemente"); mism++; return; }
    szenarien++;
    for(let i=0;i<eO.length;i++){
      const csO=wO.getComputedStyle(eO[i]), csN=wN.getComputedStyle(eN[i]);
      for(const p of PROPS){
        const a=csO.getPropertyValue(p), b=csN.getPropertyValue(p);
        verglichen++;
        if(a!==b){ mism++; if(mism<=20) console.log("STYLE-DIFF ["+label+"] <"+eO[i].tagName.toLowerCase()+
          " class='"+(eN[i].getAttribute("class")||"")+"'> "+p+": orig='"+a+"' neu='"+b+"'"); }
      }
    }
  }

  // 1) Alle Aufgabentypen via loeseFrage
  const typen={}; wO.POOL.forEach(f=>{const it=f.typ==="bild"?f.unterTyp:f.typ; if(it&&!typen[it])typen[it]=f.id;});
  for(const it of Object.keys(typen)){
    const id=typen[it];
    const fO=wO.POOL.find(f=>f.id===id), fN=wN.POOL.find(f=>f.id===id);
    const hO=wO.document.createElement("div"), hN=wN.document.createElement("div");
    wO.document.body.appendChild(hO); wN.document.body.appendChild(hN);
    try{ wO.loeseFrage(fO,hO,{onGraded(){},onNext(){}}); wN.loeseFrage(fN,hN,{onGraded(){},onNext(){}}); }
    catch(e){ console.log("RENDER-FEHLER "+it+": "+e.message); mism++; continue; }
    vergleiche("typ:"+it, hO, hN);
  }

  // 2) Kernrouten über render()
  for(const seite of ["start","einst","stat","glossar","spickzettel"]){
    wO.S.seite=seite; wN.S.seite=seite;
    try{ wO.render(); wN.render(); }catch(e){ console.log("ROUTE-FEHLER "+seite+": "+e.message); mism++; continue; }
    vergleiche("route:"+seite, wO.document.getElementById("main"), wN.document.getElementById("main"));
  }

  console.log("\nSzenarien="+szenarien+", Property-Vergleiche="+verglichen+", Abweichungen="+mism);
  console.log(mism===0?"DIFFERENTIAL OK: computed styles orig==neu überall":"DIFFERENTIAL: "+mism+" Abweichung(en) – s.o.");
  process.exit(mism===0?0:1);
})();
