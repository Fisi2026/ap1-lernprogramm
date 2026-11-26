/* Test #90/#91: Robustheit (jsdom). #90 render()-Fehlerfänger: Absturz einer Route → erholbares Fehler-Panel
   statt Weißbild, „Zur Startseite" stellt wieder her; unbekannte Route → Fallback auf Start. #91 loeseFrage-
   Guard: fehlende/kaputte Frage → „übersprungen"-Panel + Weiter, kein Crash. */
const { t: check, boot, report } = require("./_harness.js");

function btn(root, text){
  return Array.prototype.find.call(root.querySelectorAll("button"), b => b.textContent.trim() === text) || null;
}

(async () => {
  const w = await boot();
  const D = w.document;
  const main = () => D.getElementById("main");

  // #90: Route stürzt ab → Fehler-Panel
  const orig = w.sStatistik;
  w.sStatistik = function(){ throw new Error("BOOM-Testfehler"); };
  w.seite = "stat"; w.render();
  check("Absturz → Fehler-Panel (Überschrift)", main().textContent.indexOf("Etwas ist schiefgelaufen") >= 0);
  check("Fehler-Panel zeigt technische Details", main().textContent.indexOf("BOOM-Testfehler") >= 0);
  check("Fehler-Panel: 'Zur Startseite'-Button", !!btn(main(), "Zur Startseite"));
  check("Fehler-Panel: 'Neu laden'-Button", !!btn(main(), "Neu laden"));

  // Recovery: Zur Startseite (sStart intakt) → normaler Start, kein Panel mehr
  btn(main(), "Zur Startseite").click();
  check("Recovery: seite=start", w.seite === "start");
  check("Recovery: kein Fehler-Panel mehr", main().textContent.indexOf("Etwas ist schiefgelaufen") < 0);
  check("Recovery: Startseite gerendert", main().textContent.indexOf("Was möchtest du tun?") >= 0);
  w.sStatistik = orig;

  // #90: unbekannte Route → Fallback auf Start (kein Crash, kein Panel)
  w.seite = "gibtsnicht"; w.render();
  check("Unbekannte Route → Fallback Start", main().textContent.indexOf("Was möchtest du tun?") >= 0);
  check("Unbekannte Route → kein Fehler-Panel", main().textContent.indexOf("Etwas ist schiefgelaufen") < 0);

  // #91: loeseFrage mit fehlender Frage → Skip-Panel + Weiter
  let weiterGeklickt = false;
  const host = D.createElement("div"); D.body.appendChild(host);
  w.loeseFrage(null, host, { onGraded:function(){}, onNext:function(){ weiterGeklickt = true; } });
  check("loeseFrage(null): Skip-Panel", host.textContent.indexOf("übersprungen") >= 0);
  check("loeseFrage(null): kein split/aufgabe gerendert", host.querySelector(".aufgabe") === null);
  const bW = D.getElementById("btnAktion");
  check("loeseFrage(null): Weiter-Aktion gesetzt", bW && bW.textContent.trim() === "Weiter");
  bW.click();
  check("loeseFrage(null): Weiter ruft onNext", weiterGeklickt === true);

  // #91: f ohne typ → ebenfalls Skip
  const host2 = D.createElement("div"); D.body.appendChild(host2);
  w.loeseFrage({ id:"X", frage:"?" }, host2, { onGraded:function(){}, onNext:function(){} });
  check("loeseFrage(ohne typ): Skip-Panel", host2.textContent.indexOf("übersprungen") >= 0);

  // #91: gültige Frage rendert weiterhin normal (kein Fehlalarm)
  const host3 = D.createElement("div"); D.body.appendChild(host3);
  const mc = w.L.instanziiere((w.FRAGEN || []).find(f => f.typ === "mc"));
  w.loeseFrage(mc, host3, { onGraded:function(){}, onNext:function(){} });
  check("loeseFrage(gültig): normal gerendert (.aufgabe da)", host3.querySelector(".aufgabe") !== null);
  check("loeseFrage(gültig): kein Skip-Panel", host3.textContent.indexOf("übersprungen") < 0);

  // R2: localStorage.setItem wirft -> speichere() ohne Exception + fixierter Banner nach render()
  const origSetItem = w.localStorage.setItem;
  w.localStorage.setItem = function(){ throw new Error("QuotaExceededError (Test)"); };
  let speichereOk = true;
  try { w.speichere(); } catch(_) { speichereOk = false; }
  check("R2: speichere bei setItem-Throw ohne Exception + Flag", speichereOk && w.LS_SPEICHER_FEHLER === true);
  w.seite = "start"; w.render();
  const banner = D.getElementById("lsbanner");
  check("R2: Speicher-Banner nach render() sichtbar", !!banner && banner.textContent.indexOf("NICHT gespeichert") >= 0);
  w.localStorage.setItem = origSetItem;
  w.speichere(); w.render();
  check("R2: Banner verschwindet nach erfolgreichem Speichern", D.getElementById("lsbanner") === null);

  // R2: korruptes JSON im LS_KEY -> ladeState liefert Default + Lade-Banner
  const origGetItem = w.localStorage.getItem;
  w.localStorage.getItem = function(){ return "{kaputt"; };
  const st = w.ladeState();
  check("R2: korruptes JSON -> Default-State + Flag", st && st.version === 5 && st.tagesziel === 20 && w.LS_LADE_FEHLER === true);
  w.localStorage.getItem = origGetItem;
  w.render();
  check("R2: Lade-Banner nach render() sichtbar", (D.getElementById("lsbanner") || {textContent:""}).textContent.indexOf("leerem Stand") >= 0);

  // R4: esc() escapt Single-Quotes (Härtung dynamischer Attribut-Stellen, z. B. value='…')
  check("R4: esc escapt Single-Quote", w.esc("a'b") === "a&#39;b");

  // R11: datumDE – ISO-dayKey wird zu TT.MM.JJJJ, Fremdwerte unverändert
  check("R11: datumDE happy", w.datumDE("2026-07-16") === "16.07.2026");
  check("R11: datumDE ungültig unverändert", w.datumDE("kein-datum") === "kein-datum" && w.datumDE("") === "");

  process.exit(report());
})();
