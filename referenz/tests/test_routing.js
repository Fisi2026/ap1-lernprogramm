/* Node-Testskript: node test_routing.js – G4.2 (#29) Hash-Routing, Deep-Links, Zurück-Button.
   Prüft hashLesen/hashSchreiben/gotoSeite, den hashchange-Pfad (= Browser-Zurück), die
   Einzelfrage-Route #frage=ID und dass unbekannte Routen still auf „start" fallen. */
"use strict";
const H = require("./_harness.js");

(async () => {
  const w = await H.boot();

  /* ---- Grundzustand ---- */
  H.t("Startseite ist 'start'", w.seite === "start");
  H.t("gotoSeite ist vorhanden", typeof w.gotoSeite === "function");
  H.t("hashLesen ist vorhanden", typeof w.hashLesen === "function");
  H.t("ROUTEN_NAMEN enthält alle Nav-Routen",
    w.SEITEN.every(s => w.ROUTEN_NAMEN.indexOf(s[0]) >= 0));
  H.t("ROUTEN_NAMEN enthält auch die Nicht-Nav-Routen (markiert/serie/frage)",
    ["markiert", "serie", "frage"].every(r => w.ROUTEN_NAMEN.indexOf(r) >= 0));

  /* ---- hashLesen ---- */
  const leer = w.hashLesen();
  H.t("leerer Hash -> start", leer.seite === "start" && leer.frageId === null);

  w.location.hash = "#stat";
  H.t("hashLesen erkennt #stat", w.hashLesen().seite === "stat");

  w.location.hash = "#gibtesnicht";
  H.t("unbekannte Route -> start", w.hashLesen().seite === "start");

  w.location.hash = "#frage=M03-907";
  const zf = w.hashLesen();
  H.t("hashLesen erkennt #frage=ID", zf.seite === "frage" && zf.frageId === "M03-907");

  w.location.hash = "#frage=";
  H.t("#frage ohne ID -> start", w.hashLesen().seite === "start");

  w.location.hash = "";

  /* ---- gotoSeite setzt Seite UND Hash ---- */
  w.gotoSeite("stat");
  H.t("gotoSeite('stat') setzt seite", w.seite === "stat");
  H.t("gotoSeite('stat') setzt den Hash", w.location.hash === "#stat");
  H.t("gotoSeite rendert die Seite", (w.document.getElementById("main").innerHTML || "").length > 0);

  w.gotoSeite("einst");
  H.t("Seitenwechsel aktualisiert den Hash", w.location.hash === "#einst" && w.seite === "einst");

  w.gotoSeite("quatsch");
  H.t("unbekannter Name fällt auf start zurück", w.seite === "start" && w.location.hash === "#start");

  /* ---- Deep-Link auf eine Einzelfrage ---- */
  const pool = w.FRAGEN || [];
  const eineId = pool.length ? pool[0].id : null;
  if (eineId) {
    w.gotoSeite("frage", { frageId: eineId });
    H.t("Einzelfrage: seite ist 'frage'", w.seite === "frage");
    H.t("Einzelfrage: frageDirekt gesetzt", w.frageDirekt === eineId);
    H.t("Einzelfrage: Hash trägt die ID", w.location.hash === "#frage=" + encodeURIComponent(eineId));
    const html = w.document.getElementById("main").innerHTML || "";
    H.t("Einzelfrage: ID wird angezeigt", html.indexOf(eineId) >= 0);
    H.t("Einzelfrage: Hinweis 'zählt nicht' sichtbar",
      html.indexOf("zählen nicht") >= 0 || html.indexOf("zaehlen nicht") >= 0);

    /* Verlassen der Route räumt frageDirekt wieder ab */
    w.gotoSeite("start");
    H.t("frageDirekt wird beim Verlassen zurückgesetzt", w.frageDirekt === null);
  } else {
    H.t("Pool nicht leer (Vorbedingung Einzelfrage)", false);
  }

  /* ---- unbekannte Frage-ID: keine Ausnahme, freundlicher Hinweis ---- */
  let exc = null;
  try { w.gotoSeite("frage", { frageId: "GIBT-ES-NICHT" }); } catch (e) { exc = e; }
  H.t("unbekannte Frage-ID wirft nicht", !exc);
  H.t("unbekannte Frage-ID zeigt Hinweis",
    (w.document.getElementById("main").innerHTML || "").indexOf("nicht") >= 0);

  /* ---- Browser-Zurück (hashchange) ---- */
  w.gotoSeite("start");
  w.location.hash = "#glossar";          // simuliert den Klick auf „Zurück"/„Vor"
  w.hashGeaendert();
  H.t("hashchange übernimmt die Route", w.seite === "glossar");
  H.t("hashchange rendert neu", (w.document.getElementById("main").innerHTML || "").length > 0);

  w.location.hash = "#start";
  w.hashGeaendert();
  H.t("hashchange zurück auf start", w.seite === "start");

  /* Kein Doppel-Render, wenn sich nichts geändert hat */
  const vorher = w.seite;
  w.hashGeaendert();
  H.t("hashchange ohne Änderung ist folgenlos", w.seite === vorher);

  /* ---- Nav-Buttons nutzen den zentralen Weg ---- */
  const navBtns = Array.from(w.document.querySelectorAll("#nav .nav-item"));
  H.t("Nav-Buttons vorhanden", navBtns.length >= 5);
  const uebenBtn = navBtns.find(b => /Üben/i.test(b.textContent));
  if (uebenBtn) {
    uebenBtn.click();
    H.t("Klick auf 'Üben' setzt Seite und Hash", w.seite === "ueben" && w.location.hash === "#ueben");
  } else {
    H.t("Üben-Button gefunden", false);
  }

  H.report();
})();
