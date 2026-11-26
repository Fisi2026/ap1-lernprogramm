"use strict";
/* T2 (#84) deterministisch: statische Inline-Styles -> Einzeldeklarations-Utility-Klassen,
   danach Elemente mit Spezifitätskonflikt (>1 Klasse) wieder auf inline (0 visuelle Änderung),
   ungenutzte Utilities prunen. Arbeitet in DIR (Default /tmp/t2b), erwartet DIR/orig/ mit Snapshots. */
const fs = require("fs");
const DIR = process.argv[2] || "/tmp/t2b";
const mods = ["app_frage","app_loeser","app_seiten","app_sim","app_pages2","app_ui","app_util","app_state","app_pool"];
// dynamisch (String-Konkatenation) ODER laufzeit-getoggelt (display:none wird per .style.display="" wieder
// eingeblendet -> muss inline bleiben, sonst bricht der Reveal-Toggle, z.B. #98 Abruf-Übung)
const isDyn = v => /"\s*\+|\+\s*"/.test(v) || /(^|;)\s*display\s*:\s*none\s*($|;)/i.test(v);
function slug(decl){ return "u-" + decl.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); }

// ---------- A) KONVERSION: statische style='...' -> class-Utilities ----------
const map = {};                       // u-name -> decl
function utilFor(decl){ const k = slug(decl);
  if (map[k] !== undefined && map[k] !== decl) throw new Error("Slug-Kollision: "+k+" ["+map[k]+"] vs ["+decl+"]");
  map[k] = decl; return k; }
let konvertiert = 0, dynBelassen = 0;
const tagRe = /<([a-z][a-z0-9]*)([^>]*?)\bstyle='([^']*)'([^>]*?)>/gi;
for (const mod of mods){
  const p = DIR+"/"+mod+".js"; if(!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, "utf8");
  src = src.replace(tagRe, function(full, tag, before, style, after){
    if (isDyn(style)) { dynBelassen++; return full; }
    const decls = style.split(";").map(s=>s.trim()).filter(Boolean);
    const utils = decls.map(utilFor);
    let attrs = before + after;
    if (/\bclass='[^']*'/.test(attrs)) attrs = attrs.replace(/\bclass='([^']*)'/, (mm,c)=> "class='"+(c?c+" ":"")+utils.join(" ")+"'");
    else attrs = " class='"+utils.join(" ")+"'" + attrs;
    konvertiert++;
    return "<"+tag+attrs+">";
  });
  fs.writeFileSync(p, src);
}

// ---------- B) KONFLIKT-REVERT: Regeln mit Spezifität > (0,1,0) ----------
const css0 = fs.readFileSync(DIR+"/orig/styles.css","utf8");
function spez(sel){ const ids=(sel.match(/#[\w-]+/g)||[]).length;
  const kl=(sel.match(/\.[\w-]+|\[[^\]]+\]|:[a-z-]+(\([^)]*\))?/gi)||[]).length;
  const tg=(sel.replace(/::?[a-z-]+(\([^)]*\))?/gi,"").match(/\b[a-z][a-z0-9]*\b/gi)||[]).length; return [ids,kl,tg]; }
const gt=(a,b)=>{ for(let i=0;i<3;i++){ if(a[i]!==b[i]) return a[i]>b[i]; } return false; };
const regeln=[]; let rr; const ruleRe=/([^{}]+)\{([^}]*)\}/g;
while((rr=ruleRe.exec(css0))){ const body=rr[2];
  const props=new Set((body.match(/(^|;|\{)\s*([a-z-]+)\s*:/g)||[]).map(x=>x.replace(/[;{]/,"").replace(/:\s*$/,"").trim()));
  for(let sel of rr[1].split(",")){ sel=sel.trim(); if(!sel||sel.startsWith("@")||sel.includes("/*")) continue;
    if(!gt(spez(sel),[0,1,0])) continue;
    const key=sel.split(/\s|>|\+|~/).filter(Boolean).pop();
    const keyClasses=(key.match(/\.[\w-]+/g)||[]).map(s=>s.slice(1));
    const tagM=key.match(/^([a-z][a-z0-9]*)/i); const keyTag=tagM?tagM[1].toLowerCase():null;
    regeln.push({sel,keyClasses,keyTag,props:[...props]}); } }

const genutzt=new Set(); const revList=[]; let revert=0;
const clsRe=/<([a-z][a-z0-9]*)((?:[^>]*?))class='([^']*\bu-[^']*)'/gi;
for(const mod of mods){ const p=DIR+"/"+mod+".js"; if(!fs.existsSync(p)) continue;
  let src=fs.readFileSync(p,"utf8");
  src=src.replace(clsRe, function(full, tag, mid, cls){
    const toks=cls.split(/\s+/).filter(Boolean);
    const orig=toks.filter(t=>!t.startsWith("u-"));
    const utils=toks.filter(t=>t.startsWith("u-"));
    const elProps=new Set(utils.map(u=>map[u]?map[u].split(":")[0].trim():null).filter(Boolean));
    let konflikt=false;
    for(const r of regeln){ if(r.keyTag && r.keyTag!==tag.toLowerCase()) continue;
      if(!r.keyClasses.every(c=>orig.includes(c))) continue;
      if(r.props.some(pp=>elProps.has(pp))){ konflikt=true; break; } }
    if(!konflikt){ utils.forEach(u=>genutzt.add(u)); return full; }
    const decls=utils.map(u=>map[u]).join(";"); revert++;
    revList.push(mod+"|<"+tag+" class='"+orig.join(" ")+"'>|style='"+decls+"'");
    const clsPart = orig.length ? "class='"+orig.join(" ")+"' " : "";
    return "<"+tag+mid+clsPart+"style='"+decls+"'";
  });
  fs.writeFileSync(p, src);
}

// ---------- C) styles.css-Utility-Block schreiben (nur genutzte) ----------
const usedNames = Object.keys(map).filter(k=>genutzt.has(k)).sort();
const blockLines = usedNames.map(k=>"."+k+"{"+map[k]+"}");
const block = "\n/* === T2 Utility-Klassen (#84) BEGIN === */\n"+blockLines.join("\n")+"\n/* === T2 Utility-Klassen (#84) END === */\n";
let css = fs.readFileSync(DIR+"/styles.css","utf8").replace(/\n?\/\* === T2 Utility-Klassen[\s\S]*?END === \*\/\n?/,"");
fs.writeFileSync(DIR+"/styles.css", css.replace(/\s*$/,"\n")+block);
const usedMap={}; usedNames.forEach(k=>usedMap[k]=map[k]);
fs.writeFileSync(DIR+"/util_map.json", JSON.stringify(usedMap,null,0));
fs.writeFileSync(DIR+"/revert_liste.txt", revList.sort().join("\n")+"\n");

console.l