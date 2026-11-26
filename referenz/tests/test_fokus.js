/* Test #55: Fokus-/Konzentrationsmodus (jsdom). Prüft: Umschalter in Sidebar + Verlassen-Button vorhanden,
   Toggle setzt body.fokus + S.fokus, persistiert in localStorage, reiner CSS-Toggle (kein Re-Render),
   Zustand wird beim Laden aus S.fokus angewandt. */
const { t: check, boot, report, LS_KEY } = require("./_harness.js");

(async () => {
  const w = await boot();
  const D = w.document;

  check("initial kein body.fokus", !D.body.classList.contains("fokus"));
  check("S.fokus initial false", w.S.fokus === false);
  const bf = D.getElementById("btnFokus");
  const ex = D.getElementById("btnFokusExit");
  check("Umschalter in Sidebar vorhanden", !!bf && bf.closest(".sidebar") !== null);
  check("Verlassen-Button im Inhalt vorhanden", !!ex && ex.closest(".content") !== null);
  check("Umschalter-Label 'Fokus'", bf.textContent === "Fokus");

  bf.click();
  check("nach Klick: body.fokus gesetzt", D.body.classList.contains("fokus"));
  check("nach Klick: S.fokus true", w.S.fokus === true);
  check("nach Klick: Label 'Fokus: an'", bf.textContent === "Fokus: an");
  check("persistiert in localStorage", JSON.parse(w.localStorage.getItem(LS_KEY)).fokus === true);

  ex.click();
  check("Verlassen-Button: body.fokus entfernt", !D.body.classList.contains("fokus"));
  check("Verlassen-Button: S.fokus false", w.S.fokus === false);

  bf.click(); bf.click();
  check("Doppel-Toggle wieder aus", !D.body.classList.contains("fokus") && w.S.fokus === false);

  // Reiner CSS-Toggle: kein Re-Render / kein Reset des Üben-Verlaufs
  w.seite = "ueben"; w.render();
  const len = w.uebenVerlauf.length;
  w.setFokus(true);
  check("Umschalten rendert Frage nicht neu (Verlauf unverändert)", w.uebenVerlauf.length === len);
  check("alle Routen erreichbar: stat rendert im Fokus", (function(){ try { w.seite = "stat"; w.render(); return D.body.classList.contains("fokus"); } catch(e){ return false; } })());
  w.setFokus(false);

  // Zustand wird beim Laden angewandt
  const w2 = await boot({ fokus: true, version: 5 });
  check("Laden mit S.fokus=true wendet body.fokus an", w2.document.body.classList.contains("fokus"));

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
