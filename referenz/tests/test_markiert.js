/* Test #46: Lesezeichen / markierte Fragen (jsdom).
   Prüft: Stern-Toggle im Üben-Modus persistiert, Route sMarkiert (Leer/Belegt),
   "Markierte üben"-Button, Entfernen, Start-Kachel nur wenn belegt, kein Stern in der Sim. */
const { t: check, boot, report } = require("./_harness.js");

(async () => {
  const w = await boot();
  const main = () => w.document.getElementById("main").innerHTML;
  const btnByText = (re) => [].slice.call(w.document.querySelectorAll("button")).find(function (b) { return re.test(b.textContent); });

  check("S.markiert initial leer", w.S.markiert && Object.keys(w.S.markiert).length === 0);

  /* FB-R1.8 / E3 (2026-07-21): Der Stern-Button ist standardmaessig AUSGEBLENDET, damit „Melden"
     die markante Position bekommt. Feature und Markiert-Seite bleiben unveraendert – deshalb
     wird hier zuerst der Default geprueft und danach fuer die Toggle-Tests eingeschaltet. */
  check("Default: S.markierenAn ist false", w.S.markierenAn === false);
  w.S.markiert = {}; w.seite = "ueben"; w.render();
  check("Default: kein Stern-Button im Üben", !w.document.querySelector(".stern-btn"));
  check("Default: Melden-Button trotzdem da", !!w.document.querySelector("summary.melden-btn"));

  // Üben: Stern-Button vorhanden, Toggle an/aus + Persistenz in S.markiert (mit eingeschalteter Option)
  w.S.markierenAn = true;
  w.S.markiert = {}; w.seite = "ueben"; w.render();
  const stern = w.document.querySelector(".stern-btn");
  check("Üben: Stern-Button vorhanden", !!stern);
  const fid = w.aktFrage && w.aktFrage.id;
  check("aktFrage gesetzt", !!fid);
  if (stern) stern.click();
  check("Toggle AN: S.markiert[fid]==1", !!(fid && w.S.markiert[fid]));
  check("Stern-Label -> Markiert", stern && /Markiert/.test(stern.textContent));
  if (stern) stern.click();
  check("Toggle AUS: S.markiert[fid] entfernt", !(fid && w.S.markiert[fid]));

  const ap1 = w.POOL.find(function (f) { return f.pruefungsteil !== "AP2"; });
  check("AP1-Frage gefunden", !!ap1);

  // Route sMarkiert – Leerzustand
  w.S.markiert = {}; w.seite = "markiert"; w.render();
  check("Leer: Hinweis 'Noch nichts markiert'", /Noch nichts markiert/.test(main()));
  check("Leer: kein 'Markierte üben'-Button", !btnByText(/Markierte üben/));

  // Route sMarkiert – belegt
  w.S.markiert = {}; w.S.markiert[ap1.id] = 1; w.seite = "markiert"; w.render();
  check("Belegt: Anzahl 1 gerendert", /Markiert \(im aktuellen Prüfungsteil-Filter\): <b>1<\/b>/.test(main()));
  check("Belegt: 'Markierte üben'-Button da", !!btnByText(/Markierte üben \(1\)/));
  check("Belegt: Thema in Übersicht", main().indexOf(w.esc ? w.esc(ap1.thema) : ap1.thema) !== -1);

  // Entfernen
  const rm = btnByText(/Entfernen/);
  check("Entfernen-Button vorhanden", !!rm);
  if (rm) rm.click();
  check("Entfernen löscht Markierung", !w.S.markiert[ap1.id]);

  // Start-Kachel: nur wenn belegt
  w.S.markiert = {}; w.seite = "start"; w.render();
  check("Start: keine Markiert-Kachel wenn leer", !/Markiert ★/.test(main()));
  w.S.markiert[ap1.id] = 1; w.render();
  check("Start: Markiert-Kachel sichtbar wenn belegt", /Markiert ★/.test(main()));

  /* FB-R1.8: Der Schalter in den Einstellungen blendet den Stern wieder ein. Gegenprobe steckt im
     selben Lauf: vorher (Default AUS) darf kein .stern-btn existieren, nachher muss er da sein –
     ein Test, der nur eine Richtung prueft, koennte still gruen bleiben. */
  w.S.markierenAn = false; w.seite = "einst"; w.render();
  const schalter = w.document.querySelector("input.markieren-schalter");
  check("Einstellungen: Markieren-Schalter vorhanden", !!schalter);
  check("Schalter spiegelt Default AUS", !!schalter && schalter.checked === false);
  w.seite = "ueben"; w.render();
  check("Gegenprobe AUS: kein Stern-Button", !w.document.querySelector(".stern-btn"));
  w.seite = "einst"; w.render();
  const schalter2 = w.document.querySelector("input.markieren-schalter");
  if (schalter2) { schalter2.checked = true; schalter2.onchange({ target: schalter2 }); }
  check("Schalter AN -> S.markierenAn true", w.S.markierenAn === true);
  w.seite = "ueben"; w.render();
  check("Nach Einschalten: Stern-Button wieder da", !!w.document.querySelector(".stern-btn"));

  // Kein Stern in der Prüfungssimulation
  w.S.simDauerMin = 45; w.seite = "sim"; w.render();
  const startBtn = btnByText(/Prüfung starten/);
  if (startBtn) startBtn.click();
  check("Sim läuft", w.simLaeuft === true);
  check("Sim: kein Stern-Button (.stern-btn)", !w.document.querySelector(".stern-btn"));
  w.seite = "start"; w.render(); // Sim sauber beenden (Leak-Abbruch)

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
