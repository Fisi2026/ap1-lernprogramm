/* Test #57: „Frage melden" (jsdom). Prüft: ⚑-Formular, Melden schreibt S.meldungen[id]={grund,text,datum},
   Entfernen löscht, Persistenz, kein Melden-Button in Simulation, Export-Builder (JSON/Text),
   Einstellungen-Liste mit Entfernen. Keine Auswirkung auf Wertung. */
const { t: check, boot, report, LS_KEY } = require("./_harness.js");

function byText(root, sel, txt){ return Array.prototype.find.call(root.querySelectorAll(sel), function(b){ return b.textContent.trim() === txt; }); }

(async () => {
  const w = await boot();
  const D = w.document;
  const host = D.createElement("div"); D.body.appendChild(host);
  const f = w.POOL.find(function(x){ return x.typ === "mc"; });

  w.renderMelden(host, f);
  check("Melden-Formular (details.melden) vorhanden", !!host.querySelector("details.melden"));
  check("initial keine Meldung", !w.S.meldungen[f.id]);
  const del0 = byText(host, "button", "Meldung entfernen");
  check("Entfernen initial versteckt", del0 && del0.style.display === "none");

  // Grund wählen + Text + Melden
  byText(host, "button", "Unklar formuliert").click();
  host.querySelector("textarea").value = "Option B ist doppeldeutig";
  byText(host, "button", "Melden").click();
  const m = w.S.meldungen[f.id];
  check("Melden schreibt S.meldungen[id]", !!m);
  check("Grund gespeichert", m && m.grund === "Unklar formuliert");
  check("Text gespeichert", m && m.text === "Option B ist doppeldeutig");
  check("Datum gesetzt", m && typeof m.datum === "number");
  check("Status zeigt 'Gemeldet'", /Gemeldet/.test(host.querySelector("details.melden div.hinweis").textContent));
  check("persistiert in localStorage", !!JSON.parse(w.localStorage.getItem(LS_KEY)).meldungen[f.id]);

  // Default-Grund bei leerer Auswahl
  const host2 = D.createElement("div"); D.body.appendChild(host2);
  const f2 = w.POOL.find(function(x){ return x.typ === "mc" && x.id !== f.id; });
  w.renderMelden(host2, f2);
  byText(host2, "button", "Melden").click();
  check("Ohne Auswahl -> Grund 'Sonstiges'", w.S.meldungen[f2.id].grund === "Sonstiges");

  // Entfernen
  const del = byText(host, "button", "Meldung entfernen");
  del.click();
  check("Entfernen löscht Meldung", !w.S.meldungen[f.id]);

  // Export-Builder
  check("meldungenJSON parst", (function(){ try { JSON.parse(w.meldungenJSON()); return true; } catch(e){ return false; } })());
  check("meldungenText enthält gemeldete ID", w.meldungenText().indexOf(f2.id) >= 0);

  // Simulation: kein Melden-Button
  const hs = D.createElement("div"); D.body.appendChild(hs);
  w.loeseFrage(f, hs, { onGraded: function(){}, onNext: function(){}, simulation: true });
  check("Simulation: kein Melden-Formular", !hs.querySelector("details.melden"));
  const hu = D.createElement("div"); D.body.appendChild(hu);
  w.loeseFrage(f, hu, { onGraded: function(){}, onNext: function(){}, simulation: false });
  check("Üben: Melden-Formular vorhanden", !!hu.querySelector("details.melden"));

  // Einstellungen-Liste
  w.seite = "einst"; w.render();
  const main = D.getElementById("main");
  check("Einstellungen: Abschnitt 'Gemeldete Fragen'", /Gemeldete Fragen/.test(main.textContent));
  check("Einstellungen: gemeldete ID gelistet", main.textContent.indexOf(f2.id) >= 0);
  check("Einstellungen: Download-Buttons vorhanden", !!byText(main, "button", "Als JSON herunterladen") && !!byText(main, "button", "Als Text herunterladen"));
  const anzahlVor = Object.keys(w.S.meldungen).length;
  byText(main, "button", "Entfernen").click();
  check("Einstellungen: Entfernen reduziert Meldungen", Object.keys(w.S.meldungen).length === anzahlVor - 1);

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
