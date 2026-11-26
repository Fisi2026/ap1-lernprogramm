/* Test #54: Swipe-Gesten über die dedizierte Wisch-Leiste (jsdom, .ontouch* mit Mock-Events).
   Prüft: Rechts=zurück / Links=vor, vertikaler + zu kurzer Swipe ignoriert, KEIN Handler am #main
   (kein Drag&Drop-Konflikt), Vorwärts am Ende nur wenn beantwortet, Fehler-Deck-Leiste ist "nur vor". */
const { t: check, boot, report } = require("./_harness.js");

function touch(bar, x0, y0, x1, y1) {
  bar.ontouchstart({ changedTouches: [{ clientX: x0, clientY: y0 }] });
  bar.ontouchend({ changedTouches: [{ clientX: x1, clientY: y1 }] });
}

(async () => {
  const w = await boot();
  const D = w.document;
  const qa = () => D.getElementById("qa");
  const bar = () => D.querySelector("#qa .wischleiste");

  check("Kein ontouchstart am #main (dedizierte Leiste)", !D.getElementById("main").ontouchstart);

  w.seite = "ueben"; w.render();
  check("Wisch-Leiste im Üben vorhanden", !!bar());
  w.naechsteFrage(qa()); const id1 = w.aktFrage.id;
  w.naechsteFrage(qa());
  check("3 Fragen, idx 2", w.uebenVerlauf.length === 3 && w.uebenIdx === 2);

  touch(bar(), 60, 100, 200, 108);   // dx +140 -> rechts -> zurück
  check("Rechts-Swipe: idx 1 (zurück)", w.uebenIdx === 1 && w.aktFrage.id === id1);
  touch(bar(), 200, 100, 60, 108);   // dx -140 -> links -> vor
  check("Links-Swipe: idx 2 (vor)", w.uebenIdx === 2);

  const idxV = w.uebenIdx;
  touch(bar(), 100, 60, 108, 260);   // vertikal dominiert
  check("Vertikaler Swipe ignoriert", w.uebenIdx === idxV);
  touch(bar(), 100, 100, 140, 100);  // dx 40 < 60
  check("Kurzer Swipe (<60px) ignoriert", w.uebenIdx === idxV);

  // Links am Ende, unbeantwortet -> keine neue Frage (kein Überspringen)
  const lenBefore = w.uebenVerlauf.length;
  delete w.uebenVerlauf[w.uebenIdx]._beantwortet; w.uebenRender(qa());
  touch(bar(), 200, 100, 60, 108);
  check("Links am Ende unbeantwortet -> keine neue Frage", w.uebenVerlauf.length === lenBefore);
  // beantwortet -> Links zieht neue Frage
  w.uebenVerlauf[w.uebenIdx]._beantwortet = true; w.uebenRender(qa());
  touch(bar(), 200, 100, 60, 108);
  check("Links am Ende beantwortet -> neue Frage", w.uebenVerlauf.length === lenBefore + 1);

  /* ===== 2026-08-25: NACHWISCH DER ABGEHAENGTEN LEISTE (BUILD_LOG 25.08. (7)) =====
     Die Handler haengen als Eigenschaften am Element; `host.innerHTML = ""` nimmt das Element
     aus dem DOM, nicht den Handler. Wer den Weiter-Knopf drueckt und den Finger noch auf der
     Leiste hat, feuerte eine Leiste, die es nicht mehr gibt - mit dem ALTEN `f` - und zog ein
     ZWEITES Mal. Folge: eine Frage landete im Verlauf, ohne je angezeigt worden zu sein.
     Gemessen mit `tools/probe_doppelziehung.js`: Ziehungen=2, Verlauf 2->4. */
  w.uebenVerlauf[w.uebenIdx]._beantwortet = true; w.uebenRender(qa());
  const alteLeiste = bar();
  const lenNach = w.uebenVerlauf.length;
  w.uebenRender(qa());                                  // baut die Leiste neu auf
  check("Alte Leiste ist nach dem Neuaufbau wirklich abgehaengt",
    !!alteLeiste && !D.contains(alteLeiste) && !!bar() && bar() !== alteLeiste);
  touch(alteLeiste, 200, 100, 60, 108);                 // Nachwisch nach vorn
  check("Nachwisch der abgehaengten Leiste zieht KEINE Frage",
    w.uebenVerlauf.length === lenNach);
  /* GEGENPROBE IM SELBEN LAUF: ohne sie waere der Test auch dann gruen, wenn die Wischleiste
     gar nichts mehr taete. Die LEBENDE Leiste muss weiterhin ziehen. */
  w.uebenVerlauf[w.uebenIdx]._beantwortet = true; w.uebenRender(qa());
  touch(bar(), 200, 100, 60, 108);
  check("Gegenprobe: die lebende Leiste zieht sehr wohl",
    w.uebenVerlauf.length === lenNach + 1);

  // Fehler-Deck: Leiste "nur vor" (zurueck=null), Rechts-Swipe harmlos
  const q = w.POOL.find(function (f) { return f.typ === "mc" && f.pruefungsteil !== "AP2"; });
  w.S.fehlerDeck = {}; w.S.fehlerDeck[q.id] = { due: 0 };
  w.seite = "fd"; w.render();
  const fdbar = D.querySelector("#qa .wischleiste") || D.querySelector(".wischleiste");
  check("Fehler-Deck: Wisch-Leiste vorhanden", !!fdbar);
  /* ⚠️ 2026-07-26 GESCHAERFT: Hier stand `check("FD: Rechts-Swipe harmlos", true)` – das war auch
     dann gruen, wenn die Wischleiste gar nicht gefunden wurde und der Swipe nie stattfand. Die
     Zusicherung haengt jetzt an fdbar: kein Swipe ausgefuehrt = kein Freispruch. Dass der Swipe
     nicht wirft, sichert weiterhin der aeussere catch (Rueckgabewert 1). */
  if (fdbar) { touch(fdbar, 60, 100, 200, 108); }   // Rechts -> null, darf nicht crashen
  check("FD: Rechts-Swipe ausgefuehrt und harmlos", !!fdbar);

  w.seite = "start"; w.render();
  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
