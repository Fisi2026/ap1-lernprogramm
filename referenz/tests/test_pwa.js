/* G1.6 #11: PWA-Update-Fluss („neue Version → Hinweis, dann Auto-Reload im sicheren Moment").
   Getestet wird die APP-SEITIGE Entscheidungslogik (app_ui.js), NICHT der echte Service Worker:
   jsdom hat keinen SW, und der Inline-Guard in der HTML läuft unter file:// bewusst nicht (Offline-
   Invariante). Der Guard setzt im Echtbetrieb nur _pwaAktiviere und ruft pwaUpdateBereit() – genau
   das wird hier mit einem Stub nachgestellt.
   Nutzer-Entscheide 2026-07-18: Auto-Reload beim nächsten sicheren Moment (kein Button), laufende
   Simulation blockiert ebenfalls. */
const H = require("./_harness.js");

(async () => {
  const w = await H.boot();
  const D = w.document;
  let aktiviert = 0;
  w._pwaAktiviere = function () { aktiviert++; };   // Stub statt postMessage(SKIP_WAITING)

  // --- Ausgangszustand ---
  H.t("Default: kein Update bereit", w.PWA_UPDATE_BEREIT === false);
  H.t("Default: kein Banner", D.getElementById("pwabanner") === null);
  H.t("pwaVersuchReload ohne Update = false", w.pwaVersuchReload() === false);
  H.t("ohne Update nicht aktiviert", aktiviert === 0);

  // --- Fall A: Update meldet sich, während eine Frage offen ist → Hinweis, aber KEIN Reload ---
  w.setFrageOffen(true);
  H.t("frageOffen() true bei offener Frage", w.frageOffen() === true);
  w.pwaUpdateBereit();
  H.t("Update bereit gesetzt", w.PWA_UPDATE_BEREIT === true);
  const ban = D.getElementById("pwabanner");
  H.t("Banner erscheint", !!ban);
  H.t("Banner hat role=status", !!ban && ban.getAttribute("role") === "status");
  H.t("Banner zeigt den TEXTE-Hinweis", !!ban && ban.textContent === w.TEXTE.pwa.updateHinweis);
  H.t("KEIN Reload bei offener Frage", aktiviert === 0);
  w.pwaUpdateBereit();
  H.t("Banner bleibt einmalig (idempotent)", D.querySelectorAll("#pwabanner").length === 1);

  // --- Fall B: laufende Simulation blockiert ebenfalls ---
  w.setFrageOffen(false);
  w.simLaeuft = true;
  H.t("frageOffen() true bei laufender Simulation", w.frageOffen() === true);
  H.t("KEIN Reload während der Simulation", w.pwaVersuchReload() === false && aktiviert === 0);
  w.simLaeuft = false;

  // --- Fall C: sicherer Moment → Übernahme wird ausgelöst ---
  H.t("frageOffen() false wenn nichts offen", w.frageOffen() === false);
  H.t("pwaVersuchReload liefert true", w.pwaVersuchReload() === true);
  H.t("Übernahme genau einmal ausgelöst", aktiviert === 1);

  // --- Fall D: render() prüft selbst (Seitenwechsel = sicherer Moment) ---
  aktiviert = 0;
  w.setFrageOffen(true);
  w.seite = "stat";
  w.render();                                   // render() ruft clearAktion() → setFrageOffen(false)
  H.t("render() setzt offene Frage zurück", w._frageOffen === false);
  H.t("render() löst wartendes Update aus", aktiviert === 1);

  // --- Fall E: loeseFrage markiert wieder als offen, verbucheAntwort gibt frei ---
  aktiviert = 0;
  const f = w.POOL.find(function (q) { return q.typ === "mc"; });
  const host = D.createElement("div"); D.body.appendChild(host);
  w.loeseFrage(w.L.instanziiere(f), host, {});
  H.t("loeseFrage setzt Frage offen", w._frageOffen === true);
  H.t("kein Reload solange Frage offen", w.pwaVersuchReload() === false && aktiviert === 0);
  w.verbucheAntwort(f, true, {});
  H.t("verbucheAntwort gibt frei", w._frageOffen === false);
  H.t("danach greift das Update", w.pwaVersuchReload() === true && aktiviert === 1);

  /* ---- #39 Landing-Page (G5.1, 2026-07-21) ----
     index.html war bis dahin eine reine Meta-Refresh-Weiterleitung. Jetzt eine eigenstaendige
     Seite. Geprueft wird gegen die DATEI, nicht gegen das gebootete Fenster: die Landing laedt
     bewusst OHNE styles.css/app_*.js, damit sie unabhaengig vom App-Stack funktioniert. */
  const fs = require("fs"), path = require("path");
  const landing = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  H.t("#39: index.html ist keine Weiterleitung mehr",
    landing.indexOf("http-equiv=\"refresh\"") === -1);
  H.t("#39: Landing verlinkt die App", landing.indexOf("href=\"lernprogramm_ap1.html\"") >= 0);
  H.t("#39: Landing bindet das Manifest ein", landing.indexOf("manifest.webmanifest") >= 0);
  /* Auf echte EINBINDUNGEN pruefen, nicht auf Textvorkommen: „styles.css" steht auch im
     erklaerenden Kommentar der Datei – ein indexOf-Test schlaegt dort faelschlich an
     (beim Bauen genau so passiert). */
  H.t("#39: Landing laedt NICHT den App-Stack (bleibt unabhaengig)",
    !/<link[^>]+href=["']styles\.css/.test(landing) && !/<script[^>]+src=["']app_/.test(landing));
  H.t("#39: keine externen Ressourcen in der Landing",
    (landing.match(/https?:\/\//g) || []).filter(function (u) { return u.indexOf("w3.org") < 0; }).length === 0);
  /* Die vier vom Nutzer bestellten Inhalte muessen wirklich drinstehen. */
  H.t("#39: Installationsweg fuer Android UND iOS beschrieben",
    landing.indexOf("Android") >= 0 && landing.indexOf("Safari") >= 0);
  H.t("#39: Offline- und Datenschutz-Hinweis vorhanden",
    landing.indexOf("ohne Internet") >= 0 && landing.indexOf("lokal im Browser") >= 0);

  /* Manifest: start_url zeigt seit dem Landing-Umbau DIREKT auf die App – sonst startet die
     installierte App auf der Landing und kostet bei jedem Oeffnen einen zusaetzlichen Klick. */
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.webmanifest"), "utf8"));
  H.t("#39: start_url zeigt auf die App, nicht auf die Landing",
    manifest.start_url === "lernprogramm_ap1.html");
  H.t("#39: scope umfasst weiterhin beide Seiten", manifest.scope === ".");
  /* Beide Einstiege muessen im Offline-Cache liegen, sonst ist die Landing offline tot. */
  const sw = fs.readFileSync(path.join(__dirname, "sw.js"), "utf8");
  H.t("#39: Landing und App stehen im Service-Worker-Cache",
    sw.indexOf("\"index.html\"") >= 0 && sw.indexOf("\"lernprogramm_ap1.html\"") >= 0);

  /* ⚠️⚠️ 2026-07-26 NEU – DIE GEFAEHRLICHSTE LUECKE DIESER SUITE WAR, DASS SIE DIE CACHELISTE NUR
     STICHPROBENARTIG PRUEFTE. `install` macht `cache.addAll(APP_FILES)`, und addAll ist ATOMAR:
     Steht dort EINE Datei, die es nicht gibt, schlaegt die Installation fehl -> der neue Service
     Worker wird nie aktiv -> die Nutzer bekommen das Update NIE, und zwar STILL, weil die App aus
     dem alten Cache munter weiterlaeuft. Gegengeprobt am 26.07.: eine erfundene "gibtsnicht.js" in
     APP_FILES lief mit 32 OK / 0 FEHLER glatt durch.
     Geprueft wird jetzt in BEIDE Richtungen. */
  const appFiles = (function () {
    const m = sw.match(/APP_FILES\s*=\s*\[([\s\S]*?)\]/);
    if (!m) return null;
    return (m[1].match(/"([^"]+)"/g) || []).map(function (s) { return s.slice(1, -1); });
  })();
  /* ⚠️ Das flache Arbeitsverzeichnis kennt die App-Seite unter dem Namen app.html (so kopiert sie
     check.sh, damit _harness.js sie findet). Die Cacheliste nennt sie unter ihrem echten Namen –
     deshalb hier umsetzen, sonst meldet der Waechter einen Fehler, den es im Projekt nicht gibt. */
  const alias = { "lernprogramm_ap1.html": "app.html" };
  const fehlend = (appFiles || []).filter(function (f) {
    if (f === "./") return false;
    return !fs.existsSync(path.join(__dirname, alias[f] || f));
  });
  H.t("SW-Cacheliste: jede gelistete Datei existiert wirklich (sonst schlaegt addAll fehl und es kommt NIE ein Update an)",
    !!appFiles && fehlend.length === 0,
    fehlend.length ? "nicht vorhanden: " + JSON.stringify(fehlend) : (appFiles ? "" : "APP_FILES nicht lesbar"));

  /* ⚠️ 2026-08-25 (Nutzer-Entscheid, BUILD_LOG 25.08. (8)): DIE MANIFEST-SCREENSHOTS SIND
     ABSICHTLICH NICHT IM VORAB-CACHE. 67 kB gzip = 7,6 % der Erstinstallation fuer zwei Bilder,
     die das Programm nie anzeigt - sie gehoeren allein dem Installationsdialog des Betriebs-
     systems, der online erscheint. Ohne diese Zusicherung wandern sie beim naechsten Aufraeumen
     wortlos zurueck in APP_FILES, und niemand merkt, dass die Erstinstallation wieder waechst. */
  const screenshotsImCache = (appFiles || []).filter(function (f) { return /^screenshot-/.test(f); });
  H.t("SW-Cacheliste: die Manifest-Screenshots stehen bewusst NICHT drin (7,6 % der Erstinstallation)",
    screenshotsImCache.length === 0,
    screenshotsImCache.length ? "wieder eingetragen: " + JSON.stringify(screenshotsImCache) : "");
  /* GEGENPROBE IM SELBEN LAUF: die Bilder muessen weiterhin EXISTIEREN und im Manifest stehen -
     entfernt haette sie jemand sonst gleich ganz, und der Installationsdialog waere nackt. */
  const manifestRoh = fs.readFileSync(path.join(__dirname, "manifest.webmanifest"), "utf8");
  H.t("Gegenprobe: die Screenshots liegen weiter im Projekt und im Manifest",
    fs.existsSync(path.join(__dirname, "screenshot-start.png")) &&
    fs.existsSync(path.join(__dirname, "screenshot-ueben.png")) &&
    manifestRoh.indexOf("screenshot-start.png") >= 0 && manifestRoh.indexOf("screenshot-ueben.png") >= 0);

  /* Andere Richtung: was die App laedt, MUSS im Cache stehen – sonst ist sie offline unvollstaendig. */
  const appHtml = fs.readFileSync(path.join(__dirname, "app.html"), "utf8");
  const gebraucht = (appHtml.match(/(?:src|href)="([^"]+\.(?:js|css))"/g) || [])
    .map(function (s) { return s.replace(/^(?:src|href)="/, "").replace(/"$/, ""); });
  const ungecacht = gebraucht.filter(function (f) { return (appFiles || []).indexOf(f) < 0; });
  H.t("SW-Cacheliste: jede von der App geladene Datei ist auch gecacht (sonst offline unvollstaendig)",
    ungecacht.length === 0,
    ungecacht.length ? "fehlt im Cache: " + JSON.stringify(ungecacht) : "");

  const c = H.counts();
  console.log("\n==== " + c.ok + " Tests OK, " + c.fail + " Fehler ====");
  process.exit(c.fail ? 1 : 0);
})();
