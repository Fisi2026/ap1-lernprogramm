/* Test #98: Abruf-Übung (jsdom). Prüft: bei abrufAn werden mc/dropdown/mehrfach-Optionen zunächst verdeckt
   (Aufdeck-Button), Klick deckt auf; Grade unverändert; andere Typen + Simulation unberührt; Toggle setzt abrufAn. */
const { t: check, boot, report } = require("./_harness.js");

(async () => {
  const w = await boot();
  const D = w.document;
  const host = D.createElement("div"); D.body.appendChild(host);
  function mkOpts(sim){ return { onGraded: function (k) { mkOpts._k = k; mkOpts._graded = true; }, onNext: function () {}, simulation: !!sim }; }

  const mc = w.POOL.find(function (f) { return f.typ === "mc"; });
  const dd = w.POOL.find(function (f) { return f.typ === "dropdown"; });
  const mf = w.POOL.find(function (f) { return f.typ === "mehrfach"; });
  const lt = w.POOL.find(function (f) { return f.typ === "freitext"; });
  check("Fragetypen vorhanden (mc/dropdown/mehrfach/freitext)", !!(mc && dd && mf && lt));

  // FB-R3 Punkt 7: Abruf ist jetzt VOREINSTELLUNG (persistiert in S.abrufAn, Default an).
  check("Voreinstellung: defaultState().abrufAn === true", w.defaultState().abrufAn === true);

  // S.abrufAn = false -> keine Verdeckung, Optionen direkt sichtbar
  w.S.abrufAn = false;
  w.loeseFrage(mc, host, mkOpts());
  check("aus: keine Verdeckung", !host.querySelector(".abruf-verdeckt"));
  check("aus: Optionen direkt vorhanden", host.querySelectorAll(".opt").length === 4);

  // S.abrufAn = true -> mc verdeckt
  w.S.abrufAn = true;
  w.loeseFrage(mc, host, mkOpts());
  const wrap = host.querySelector(".abruf-verdeckt");
  check("an/mc: Verdeck-Container vorhanden", !!wrap);
  check("an/mc: Container versteckt", wrap.style.display === "none");
  check("an/mc: Optionen liegen IM Container", host.querySelectorAll(".abruf-verdeckt .opt").length === 4);
  const btn = Array.prototype.find.call(host.querySelectorAll("button"), function (b) { return /Optionen zeigen/.test(b.textContent); });
  check("an/mc: Aufdeck-Button vorhanden", !!btn);

  btn.click();
  check("an/mc: nach Klick aufgedeckt", wrap.style.display === "" );
  check("an/mc: Aufdeck-Button entfernt", !Array.prototype.find.call(host.querySelectorAll("button"), function (b) { return /Optionen zeigen/.test(b.textContent); }));

  // Grade unverändert: richtige Option wählen + prüfen
  mkOpts._graded = false;
  const richtig = Array.prototype.find.call(host.querySelectorAll(".opt"), function (b) { return b.textContent === mc.optionen[mc.loesungIndex]; });
  richtig.click();
  const act = D.getElementById("btnAktion");
  check("an/mc: Aktion nach Auswahl aktiv", !act.disabled);
  act.click();
  check("an/mc: Grade lief (korrekt)", mkOpts._graded === true && mkOpts._k === true);

  // dropdown + mehrfach verdeckt
  w.loeseFrage(dd, host, mkOpts());
  check("an/dropdown: verdeckt", !!host.querySelector(".abruf-verdeckt"));
  w.loeseFrage(mf, host, mkOpts());
  check("an/mehrfach: verdeckt", !!host.querySelector(".abruf-verdeckt"));

  // R6: Typ-Bedienhilfe (#67) wird NICHT mitverdeckt. Kein Abruf-Typ hat aktuell eine TYP_HILFE
  // (Guard ist defensiv/zukunftssicher) -> temporären Eintrag setzen, um den Guard zu testen.
  w.TYP_HILFE.dropdown = "Testhilfe (R6)";
  w.S.typHilfeAus = {};
  w.loeseFrage(dd, host, mkOpts());
  check("R6: Typ-Hilfe sichtbar, Optionen verdeckt",
    !!host.querySelector(".typ-hilfe") && !host.querySelector(".abruf-verdeckt .typ-hilfe") && !!host.querySelector(".abruf-verdeckt"));
  delete w.TYP_HILFE.dropdown;

  // Andere Typen unberührt
  w.loeseFrage(lt, host, mkOpts());
  check("an/freitext: NICHT verdeckt", !host.querySelector(".abruf-verdeckt"));

  // Simulation unberührt
  w.loeseFrage(mc, host, mkOpts(true));
  check("Simulation: mc NICHT verdeckt", !host.querySelector(".abruf-verdeckt"));

  // FB-R3 Punkt 7: M09-Klausur (opts.klausur) unberührt – opts.klausur setzt in loeseFrage
  // opts.simulation=true, die Klausur zeigt also prüfungsnah sofort die Optionen. Frische, noch
  // nicht beantwortete mc-Frage + eigener host, damit kein Alt-Zustand das Ergebnis verfälscht.
  const mcK = w.POOL.filter(function (f) { return f.typ === "mc"; })[1] || mc;
  w.S.abrufAn = true;
  const hostK = D.createElement("div"); D.body.appendChild(hostK);
  w.loeseFrage(Object.assign({}, mcK), hostK, { onGraded: function(){}, onNext: function(){}, klausur: true });
  check("Klausur: mc NICHT verdeckt (klausur ⇒ simulation)", !hostK.querySelector(".abruf-verdeckt"));
  // Kontrast: dieselbe frische Frage im normalen Üben (S.abrufAn) IST verdeckt – beweist, dass die
  // Verdeckung greift und die Ausnahme wirklich am Klausur-/Sim-Pfad hängt.
  const hostN = D.createElement("div"); D.body.appendChild(hostN);
  w.loeseFrage(Object.assign({}, mcK), hostN, { onGraded: function(){}, onNext: function(){} });
  check("Kontrast: dieselbe Frage im Üben IST verdeckt", !!hostN.querySelector(".abruf-verdeckt"));

  // Toggle (jetzt in den Einstellungen) setzt S.abrufAn (persistiert via setS)
  w.S.abrufAn = false;
  const tgl = w.abrufToggle();
  const cb = tgl.querySelector("input");
  check("Toggle: Checkbox spiegelt Zustand (aus)", cb.checked === false);
  cb.checked = true; cb.onchange({ target: cb });
  check("Toggle: schaltet S.abrufAn an", w.S.abrufAn === true);

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
