/* Test #64/#65: Barrierefreiheit (jsdom). Prüft: setFarbsymbole toggelt body-Klasse + persistiert, Default
   AUS, Apply beim Laden; svgBox setzt role=img + aria-label nur bei S.ariaAltTexte; svgAltFuer generisch je
   Typ; Render-Integration (bild-Frage bekommt beschriftetes SVG); CSS-Ziele (.opt richtig/falsch) existieren. */
const { t: check, boot, report, sleep, LS_KEY } = require("./_harness.js");

(async () => {
  const w = await boot();
  const D = w.document;

  // Default AUS
  check("S.farbsymbole default false", w.S.farbsymbole === false);
  check("S.ariaAltTexte default false", w.S.ariaAltTexte === false);
  check("body ohne farbsymbole-Klasse", !D.body.classList.contains("farbsymbole"));

  // Toggle Farbsymbole
  w.setFarbsymbole(true);
  check("setFarbsymbole(true): body-Klasse", D.body.classList.contains("farbsymbole"));
  check("setFarbsymbole(true): S true", w.S.farbsymbole === true);
  check("setFarbsymbole(true): persistiert", JSON.parse(w.localStorage.getItem(LS_KEY)).farbsymbole === true);
  w.setFarbsymbole(false);
  check("setFarbsymbole(false): Klasse weg", !D.body.classList.contains("farbsymbole"));

  // svgBox aria off/on
  const svgStr = "<svg viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='10' height='10'/></svg>";
  w.S.ariaAltTexte = false;
  let box = w.svgBox(svgStr, "Testgrafik");
  check("aria AUS: kein role auf svg", box.querySelector("svg").getAttribute("role") === null);
  w.S.ariaAltTexte = true;
  box = w.svgBox(svgStr, "Testgrafik");
  check("aria AN: role=img", box.querySelector("svg").getAttribute("role") === "img");
  check("aria AN: aria-label gesetzt", box.querySelector("svg").getAttribute("aria-label") === "Testgrafik");
  box = w.svgBox(svgStr, null);
  check("aria AN aber ohne alt: kein aria-label", box.querySelector("svg").getAttribute("aria-label") === null);
  w.S.ariaAltTexte = false;

  // svgAltFuer generisch je Typ
  check("svgAltFuer hotspot", w.svgAltFuer({ typ:"hotspot", thema:"Netze" }) === "Hotspot-Grafik zum Anklicken zum Thema Netze");
  check("svgAltFuer beschriftung", w.svgAltFuer({ typ:"beschriftung" }).indexOf("Beschriftungs-Grafik") === 0);
  check("svgAltFuer bild-Fallback", w.svgAltFuer({ typ:"bild", unterTyp:"mc" }).indexOf("Aufgaben-Grafik") === 0);

  // Render-Integration: bild-Frage bekommt beschriftetes SVG bei aria AN
  const rawBild = (w.FRAGEN || []).find(f => f.typ === "bild" && f.svg);
  if (rawBild) {
    const w2 = await boot({ version:5, ariaAltTexte:true });
    const host = w2.document.createElement("div"); w2.document.body.appendChild(host);
    const fb = w2.L.instanziiere(rawBild);
    w2.loeseFrage(fb, host, { onGraded:function(){}, onNext:function(){} });
    const svg = host.querySelector(".svgbox svg");
    check("Render bild: svg vorhanden", !!svg);
    check("Render bild: aria-label gesetzt", !!svg && svg.getAttribute("role") === "img" && !!svg.getAttribute("aria-label"));
  } else {
    /* ⚠️ 2026-07-26 GESCHAERFT (Nutzer-Entscheid „hart scheitern"): Hier standen zwei
       `check(..., true)` – zwei Gratis-Punkte, falls keine bild-Frage mit svg existiert. Der Pool
       hat 30 davon; ihr Verschwinden waere ein echter Rueckschritt bei der Barrierefreiheit und
       soll AUFFALLEN, statt als gruene Suite durchzurutschen. Die Zaehlung bleibt bei 2, damit
       der Sollwert unveraendert gilt – nur das Ergebnis kippt jetzt auf ROT. */
    check("Render bild: es gibt ueberhaupt eine bild-Frage mit svg im Pool", false,
      "keine Frage mit typ='bild' und svg gefunden – frueher wurde das still uebersprungen");
    check("Render bild: aria-Pruefung konnte laufen", false,
      "ohne bild-Frage kann die aria-Beschriftung nicht geprueft werden");
  }

  // CSS-Ziel existiert: mc-Antwort markiert Optionen mit .richtig/.falsch (Hook für ✓/✗)
  const hostMc = D.createElement("div"); D.body.appendChild(hostMc);
  const rawMc = (w.FRAGEN || []).find(f => f.typ === "mc");
  const fm = w.L.instanziiere(rawMc);
  w.loeseFrage(fm, hostMc, { onGraded:function(){}, onNext:function(){} });
  const opts = hostMc.querySelectorAll(".opt");
  // falsche Option wählen, falls möglich (sonst erste)
  const wrongIdx = Array.prototype.findIndex.call(opts, (b,i)=>i !== fm.loesungIndex);
  opts[wrongIdx >= 0 ? wrongIdx : 0].click();
  D.getElementById("btnAktion").click();   // "Lösung prüfen" → bewertet + markiert
  check("mc-Feedback markiert .opt.richtig (CSS-Ziel für ✓)", hostMc.querySelector(".opt.richtig") !== null);
  check("mc-Feedback erzeugt .fb (CSS-Ziel)", hostMc.querySelector(".fb") !== null);

  // Einstellungen: beide Checkboxen vorhanden
  w.seite = "einst"; w.render();
  const einstTxt = D.getElementById("main").textContent;
  check("Einstellungen: Farbsymbole-Option da", einstTxt.indexOf("Farbsymbole") >= 0);
  check("Einstellungen: ARIA/Alt-Texte-Option da", einstTxt.indexOf("ARIA") >= 0 && einstTxt.indexOf("Screenreader") >= 0);

  // Apply beim Laden aus Bestandsstate
  const w3 = await boot({ version:5, farbsymbole:true });
  check("Laden: body.farbsymbole aus Bestandsstate", w3.document.body.classList.contains("farbsymbole"));

  // R10 (b): fbHost hat aria-live=polite (Feedback wird angesagt) – hostMc stammt aus mc-Render oben
  check("R10: fbHost aria-live=polite", hostMc.querySelector("[aria-live='polite']") !== null);

  // R10 (a): zuordnung-Chips sind fokussier- und tastaturbedienbar
  const hostZu = D.createElement("div"); D.body.appendChild(hostZu);
  const rawZu = (w.FRAGEN || []).find(f => f.typ === "zuordnung");
  w.loeseFrage(w.L.instanziiere(rawZu), hostZu, { onGraded:function(){}, onNext:function(){} });
  const chip = hostZu.querySelector(".zu-item");
  check("R10: Chip hat tabindex=0 + role=button", chip.getAttribute("tabindex") === "0" && chip.getAttribute("role") === "button");
  chip.dispatchEvent(new w.KeyboardEvent("keydown", { key:"Enter", bubbles:true, cancelable:true }));
  check("R10: Enter wählt Chip an (gewaehlt nach Re-Render)", hostZu.querySelector(".zu-item.gewaehlt") !== null);

  // R10 (d): reihenfolge-Nummerierung nutzt var(--text2) statt var(--gelb-hover)
  const hostRf = D.createElement("div"); D.body.appendChild(hostRf);
  const rawRf = (w.FRAGEN || []).find(f => f.typ === "reihenfolge");
  w.loeseFrage(w.L.instanziiere(rawRf), hostRf, { onGraded:function(){}, onNext:function(){} });
  const nrSpan = hostRf.querySelector(".opt span");
  check("R10: Nummerierung color var(--text2)", !!nrSpan && (nrSpan.getAttribute("style") || "").indexOf("var(--text2)") >= 0);

  /* ---- #31 Schriftgroesse in drei Stufen (2026-07-21) ----
     Umgesetzt ueber die Basisgroesse am <html>-Element (data-schrift), damit alle rem-Werte
     mitskalieren. Geprueft werden Mechanik, Persistenz und Bedienung. */
  const htmlEl = D.documentElement;
  check("#31: Startzustand ist 'normal'", htmlEl.getAttribute("data-schrift") === "normal");
  check("#31: drei Stufen definiert",
    Array.isArray(w.SCHRIFT_STUFEN) && w.SCHRIFT_STUFEN.length === 3);
  w.setSchrift("gross");
  check("#31: setSchrift setzt Attribut und State",
    htmlEl.getAttribute("data-schrift") === "gross" && w.S.schriftStufe === "gross");
  check("#31: Stufe ist persistiert",
    JSON.parse(w.localStorage.getItem("ap1v2_state")).schriftStufe === "gross");
  w.setSchrift("unsinn");
  check("#31: unbekannte Stufe faellt auf 'normal' zurueck",
    htmlEl.getAttribute("data-schrift") === "normal");
  w.gotoSeite("einst");
  await sleep(50);
  const schriftBtns = Array.prototype.slice.call(D.querySelectorAll("#main button"))
    .filter(function (b) { return ["Normal", "Groß", "Sehr groß"].indexOf(b.textContent.trim()) >= 0; });
  check("#31: drei Bedien-Buttons in den Einstellungen", schriftBtns.length === 3);
  check("#31: aktive Stufe ist per aria-pressed ausgezeichnet",
    schriftBtns[0].getAttribute("aria-pressed") === "true" &&
    schriftBtns[1].getAttribute("aria-pressed") === "false");
  schriftBtns[2].dispatchEvent(new w.MouseEvent("click", { bubbles:true }));
  await sleep(40);
  check("#31: Klick schaltet auf die dritte Stufe",
    htmlEl.getAttribute("data-schrift") === "sehrgross");
  w.setSchrift("normal");

  /* ---- #30 Druckaufbereitung (2026-07-21) ----
     Die Route steht als data-seite am <html>-Element – nur darueber kann das Print-CSS gezielt
     Spickzettel und Statistik aufbereiten. Zugeklappte <details> werden vor dem Druck geoeffnet
     und danach zurueckgesetzt; rein per CSS ist das nicht verlaesslich. */
  w.gotoSeite("spickzettel");
  await sleep(60);
  check("#30: data-seite folgt der Route", htmlEl.getAttribute("data-seite") === "spickzettel");
  const zuVor = D.querySelectorAll("details:not([open])").length;
  check("#30: es gibt ueberhaupt zugeklappte Abschnitte (sonst ist der Test wertlos)", zuVor > 0);
  w.dispatchEvent(new w.Event("beforeprint"));
  check("#30: vor dem Druck ist alles aufgeklappt",
    D.querySelectorAll("details:not([open])").length === 0);
  w.dispatchEvent(new w.Event("afterprint"));
  check("#30: nach dem Druck ist der vorherige Zustand wieder da",
    D.querySelectorAll("details:not([open])").length === zuVor);
  /* Gegenprobe: ein vom Nutzer bewusst geoeffneter Abschnitt darf NICHT zugeklappt werden. */
  const ersteDetails = D.querySelector("details");
  ersteDetails.open = true;
  w.dispatchEvent(new w.Event("beforeprint"));
  w.dispatchEvent(new w.Event("afterprint"));
  check("#30: bewusst geoeffneter Abschnitt bleibt offen", ersteDetails.open === true);

  process.exit(report());
})();
