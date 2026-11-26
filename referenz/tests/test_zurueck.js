/* Test #52: Zurück-Navigation im Üben-Modus (jsdom).
   Prüft: Session-Verlauf, ← Zurück / Weiter →, Disabled am Anfang, Variant-Identität beim Zurückblättern,
   Wiederholung aus dem Verlauf bucht NICHT erneut (Fehler-Deck/Statistik), live-Frage bucht sehr wohl. */
const { t: check, boot, report } = require("./_harness.js");

function antworteMc(w) {
  var opt = w.document.querySelector("#qa .opt");
  if (opt) opt.click();
  var btn = w.document.getElementById("btnAktion");
  if (btn) btn.click();
}

(async () => {
  const w = await boot();
  const D = w.document;
  const qa = () => D.getElementById("qa");
  const navTxt = () => D.getElementById("uebennav").textContent;
  const navBtn = (re) => [].slice.call(D.querySelectorAll("#uebennav button")).find(function (b) { return re.test(b.textContent); });

  w.seite = "ueben"; w.render();
  check("Verlauf startet mit 1 Frage (idx 0)", w.uebenVerlauf.length === 1 && w.uebenIdx === 0);
  check("← Zurück am Anfang deaktiviert", navBtn(/Zurück/) && navBtn(/Zurück/).disabled === true);
  check("Kein Weiter-Button am Ende", !navBtn(/Weiter/));

  w.naechsteFrage(qa()); const id1 = w.aktFrage.id;
  w.naechsteFrage(qa()); const id2 = w.aktFrage.id;
  check("Verlauf hat 3 Fragen (idx 2)", w.uebenVerlauf.length === 3 && w.uebenIdx === 2);
  check("Zähler zeigt 3 / 3", /Frage 3 \/ 3/.test(navTxt()));

  // Zurück -> Frage 2 (exakt dasselbe instanziierte Objekt = Variant erhalten)
  navBtn(/Zurück/).click();
  check("Zurück: idx 1", w.uebenIdx === 1);
  check("Zurück zeigt exakt Frage-2-Objekt", w.aktFrage === w.uebenVerlauf[1] && w.aktFrage.id === id1);
  check("Wiederholungs-Hinweis sichtbar", /Wiederholung/.test(navTxt()));
  navBtn(/Zurück/).click();
  check("Zurück: idx 0", w.uebenIdx === 0);
  check("← Zurück jetzt deaktiviert", navBtn(/Zurück/).disabled === true);

  // Weiter -> idx 1 (gleiche Id)
  navBtn(/Weiter/).click();
  check("Weiter: idx 1, gleiche Frage-2-Id", w.uebenIdx === 1 && w.aktFrage.id === id1);

  const mcs = w.POOL.filter(function (f) { return f.typ === "mc" && f.pruefungsteil !== "AP2"; });
  check("Genug MC-Fragen für Buchungs-Test", mcs.length >= 3);

  // Review (nicht letzte Frage) -> antworten bucht NICHT
  const a = w.L.instanziiere(mcs[0]), b = w.L.instanziiere(mcs[1]);
  w.uebenVerlauf = [a, b]; w.uebenIdx = 0; w.uebenRender(qa());
  const fdBefore = Object.keys(w.S.fehlerDeck).length;
  const statBefore = JSON.stringify(w.S.statistik);
  antworteMc(w);
  check("Review: Fehler-Deck unverändert", Object.keys(w.S.fehlerDeck).length === fdBefore);
  check("Review: Statistik unverändert", JSON.stringify(w.S.statistik) === statBefore);

  // Live (letzte, unbeantwortete Frage) -> antworten bucht
  const c = w.L.instanziiere(mcs[2]); delete c._beantwortet;
  w.uebenVerlauf = [c]; w.uebenIdx = 0; w.uebenRender(qa());
  const statLiveBefore = JSON.stringify(w.S.statistik);
  antworteMc(w);
  check("Live: Statistik verändert (Buchung erfolgt)", JSON.stringify(w.S.statistik) !== statLiveBefore);
  check("Live: _beantwortet gesetzt", c._beantwortet === true);

  // R1: gleiche varianten-lose Frage 2x „live" beantworten -> beide zählen, POOL bleibt unmutiert
  const raw = mcs.find(function (f) { return !f.varianten && f !== mcs[0] && f !== mcs[1] && f !== mcs[2]; });
  check("R1: instanziiere liefert Kopie (ohne varianten)", w.L.instanziiere(raw) !== raw);
  const modKey = raw.modul;
  const g0 = (w.S.statistik[modKey] || { gesamt: 0 }).gesamt;
  w.uebenVerlauf = [w.L.instanziiere(raw)]; w.uebenIdx = 0; w.uebenRender(qa());
  antworteMc(w);
  w.uebenVerlauf.push(w.L.instanziiere(raw)); w.uebenIdx = 1; w.uebenRender(qa());  // Wiederziehung
  antworteMc(w);
  const g2 = (w.S.statistik[modKey] || { gesamt: 0 }).gesamt;
  check("R1: beide Antworten verbucht (gesamt +2)", g2 === g0 + 2);
  check("R1: POOL-Objekt hat kein _beantwortet", raw._beantwortet === undefined);

  w.seite = "start"; w.render();
  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
