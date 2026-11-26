/* Test #66/#67: Onboarding-Tour + Kontext-Hilfe je Aufgabentyp (jsdom). Prüft: Auto-Overlay beim 1. Start,
   Schrittsteuerung, Überspringen/Fertig setzen onboardingDone + Persistenz, kein Auto-Overlay wenn schon
   gesehen, Reaktivierung; Typ-Hilfe erscheint bei interaktiven Typen, „nicht mehr zeigen" persistiert und
   entfernt, kein Hinweis für einfache Typen / in Simulation. */
const { t: check, boot, report, LS_KEY, sleep } = require("./_harness.js");

function btn(root, text){
  return Array.prototype.find.call(root.querySelectorAll("button"), b => b.textContent.trim() === text) || null;
}

(async () => {
  // ---- #66 Onboarding: Auto-Overlay beim ersten Start ----
  const w = await boot();               // onboardingDone default false → setTimeout(0) hat gefeuert
  const D = w.document;
  check("S.onboardingDone default false", w.S.onboardingDone === false);
  let ov = D.querySelector(".onb-overlay");
  check("Auto-Overlay beim 1. Start vorhanden", !!ov);
  check("Overlay zeigt Schritt 1/7", ov.textContent.indexOf("Schritt 1 / 7") >= 0);   // 7 seit Werkzeuge-Schritt (FB-R3 Punkt 7, 2026-07-23)
  check("Schritt 1 hat Weiter-Button", !!btn(ov, "Weiter"));

  // Durchklicken bis zum letzten Schritt (7 Schritte -> 5x Weiter bis Schritt 6, dann noch 1x)
  btn(ov, "Weiter").click(); btn(ov, "Weiter").click(); btn(ov, "Weiter").click(); btn(ov, "Weiter").click(); btn(ov, "Weiter").click();
  check("Schritt 6: Zurück-Button vorhanden", !!btn(ov, "Zurück"));
  btn(ov, "Weiter").click();
  check("Letzter Schritt: 'Los geht's'-Button", !!btn(ov, "Los geht's"));
  btn(ov, "Los geht's").click();
  check("nach Abschluss: Overlay entfernt", D.querySelector(".onb-overlay") === null);
  check("nach Abschluss: onboardingDone true", w.S.onboardingDone === true);
  check("nach Abschluss: persistiert", JSON.parse(w.localStorage.getItem(LS_KEY)).onboardingDone === true);

  // Reaktivierung trotz onboardingDone
  w.starteOnboarding();
  check("Reaktivierung: Overlay wieder da", !!D.querySelector(".onb-overlay"));
  // Überspringen schließt
  btn(D.querySelector(".onb-overlay"), "Überspringen").click();
  check("Überspringen: Overlay zu", D.querySelector(".onb-overlay") === null);

  // Kein Auto-Overlay wenn schon gesehen
  const w2 = await boot({ version:5, onboardingDone:true });
  check("kein Auto-Overlay bei onboardingDone true", w2.document.querySelector(".onb-overlay") === null);

  // ---- #67 Kontext-Hilfe je Typ ----
  const D2 = w2.document;
  const keys = Object.keys(w2.TYP_HILFE);
  const rawT = (w2.FRAGEN || []).find(f => keys.indexOf(f.typ === "bild" ? f.unterTyp : f.typ) >= 0);
  check("interaktiver Typ im Pool vorhanden", !!rawT);
  const typ = rawT.typ === "bild" ? rawT.unterTyp : rawT.typ;

  const host = D2.createElement("div"); D2.body.appendChild(host);
  w2.loeseFrage(w2.L.instanziiere(rawT), host, { onGraded:function(){}, onNext:function(){} });
  let hilfe = host.querySelector(".typ-hilfe");
  check("Typ-Hilfe erscheint (" + typ + ")", !!hilfe);
  check("Typ-Hilfe hat Abschalt-Häkchen", !!hilfe.querySelector("input[type=checkbox]"));

  // "nicht mehr zeigen" → persistiert + entfernt
  hilfe.querySelector("input[type=checkbox]").click();
  check("Abschalten: S.typHilfeAus[typ] true", w2.S.typHilfeAus[typ] === true);
  check("Abschalten: persistiert", JSON.parse(w2.localStorage.getItem(LS_KEY)).typHilfeAus[typ] === true);
  check("Abschalten: Box entfernt", host.querySelector(".typ-hilfe") === null);

  // erneut rendern → keine Hilfe mehr
  const host2 = D2.createElement("div"); D2.body.appendChild(host2);
  w2.loeseFrage(w2.L.instanziiere(rawT), host2, { onGraded:function(){}, onNext:function(){} });
  check("nach Abschalten: keine Typ-Hilfe mehr", host2.querySelector(".typ-hilfe") === null);

  // einfacher Typ (mc) → keine Typ-Hilfe
  const host3 = D2.createElement("div"); D2.body.appendChild(host3);
  const rawMc = (w2.FRAGEN || []).find(f => f.typ === "mc");
  w2.loeseFrage(w2.L.instanziiere(rawMc), host3, { onGraded:function(){}, onNext:function(){} });
  check("mc ohne Typ-Hilfe", host3.querySelector(".typ-hilfe") === null);

  // Simulation → keine Typ-Hilfe: der echte Sim-Renderer renderFrage ruft renderTypHilfe gar nicht auf
  const host4 = D2.createElement("div"); D2.body.appendChild(host4);
  w2.S.typHilfeAus = {};
  w2.renderFrage(w2.L.instanziiere(rawT), host4, function(){}, { simulation:true, antwortRein:function(){}, antwortVor:null });
  check("Simulation (renderFrage): keine Typ-Hilfe", host4.querySelector(".typ-hilfe") === null);

  process.exit(report());
})();
