/* Test #53: Tooltip-Glossar (jsdom). Prüft: Default-Toggle, glossarWrap (Treffer, max 2, Leak-Schutz,
   esc-Sicherheit, Toggle aus), DOM-Integration in loeseFrage (non-sim wrappt, Simulation nicht),
   Popover show/hide + Tap/Außenklick, Listener-Guard (Popover einmalig), Migrations-Default. */
const { t: check, boot, report, LS_KEY } = require("./_harness.js");

function mcFrage(over){
  return Object.assign({ id:"TST-1", typ:"mc", modul:"M03", thema:"Netze", schwierigkeit:2,
    frage:"Das OSI-Modell beschreibt die Netzkommunikation.", optionen:["Antwort A","Antwort B"],
    loesungIndex:0, erklaerungKurz:"kurz" }, over || {});
}

(async () => {
  const w = await boot();
  const D = w.document;

  // 1) Default-Zustand
  check("S.glossarTip default true", w.S.glossarTip === true);
  check("glossarListe längster Begriff zuerst", w.glossarListe()[0].term.length >= w.glossarListe()[w.glossarListe().length-1].term.length);

  // 2) glossarWrap markiert bekannten Begriff
  const h1 = w.glossarWrap({ frage:"Das OSI-Modell hat sieben Schichten." });
  check("wrap: glossar-term-Span vorhanden", h1.indexOf('class="glossar-term"') >= 0);
  check("wrap: data-term gesetzt", h1.indexOf('data-term="OSI-Modell"') >= 0);
  check("wrap: data-def gesetzt", h1.indexOf('data-def="') >= 0);

  // 3) max. 2 Treffer
  const h2 = w.glossarWrap({ frage:"OSI, DHCP, DNS, VPN und Firewall im Netz." });
  const cnt = (h2.match(/class="glossar-term"/g) || []).length;
  check("wrap: höchstens 2 Treffer (ist " + cnt + ")", cnt === 2);

  // 4) Leak-Schutz: Begriff in einer Antwortoption → nicht gewrappt
  const hLeak = w.glossarWrap({ frage:"Wozu dient DHCP im Netz?", optionen:["DHCP vergibt IP-Adressen automatisch","Etwas anderes"] });
  check("leak: Begriff aus Option nicht markiert", hLeak.indexOf('class="glossar-term"') === -1);

  // 5) Leak-Schutz: Begriff in Musterlösung → nicht gewrappt
  const hLeak2 = w.glossarWrap({ frage:"Erkläre VPN.", musterloesung:"VPN ist ein verschlüsselter Tunnel." });
  check("leak: Begriff aus Musterlösung nicht markiert", hLeak2.indexOf('class="glossar-term"') === -1);

  // 6) esc-Sicherheit
  const hEsc = w.glossarWrap({ frage:"<script>alert(1)</script> Das OSI-Modell erklärt Schichten." });
  check("esc: kein rohes <script", hEsc.indexOf("<script") === -1);
  check("esc: escapte Entität vorhanden", hEsc.indexOf("&lt;script&gt;") >= 0);
  check("esc: Begriff trotzdem markiert", hEsc.indexOf('class="glossar-term"') >= 0);

  // 7) Toggle aus → kein Wrap
  w.S.glossarTip = false;
  const hOff = w.glossarWrap({ frage:"Das OSI-Modell hat Schichten." });
  check("toggle aus: kein Span", hOff.indexOf("glossar-term") === -1 && hOff.indexOf("OSI-Modell") >= 0);
  w.S.glossarTip = true;

  // 8) DOM-Integration: loeseFrage (non-sim) erzeugt Term-Span
  const host = D.createElement("div"); D.body.appendChild(host);
  w.loeseFrage(mcFrage(), host, { onGraded:function(){}, onNext:function(){} });
  const term = host.querySelector(".glossar-term");
  check("loeseFrage non-sim: Term im DOM", !!term);
  check("loeseFrage non-sim: Term nur im Aufgaben-Panel", !!term && term.closest(".aufgabe") !== null);

  // 9) Simulation: kein Term-Span
  const hostSim = D.createElement("div"); D.body.appendChild(hostSim);
  w.loeseFrage(mcFrage(), hostSim, { simulation:true, onGraded:function(){}, onNext:function(){}, antwortRein:function(){} });
  check("Simulation: kein Term-Span", hostSim.querySelector(".glossar-term") === null);

  // 10) Popover show/hide
  w.glossarShow("OSI", "Definition OSI", term);
  check("popover: erzeugt", !!w.glossarPop);
  check("popover: sichtbar nach show", w.glossarPop.style.display === "block");
  check("popover: enthält Begriff", w.glossarPop.innerHTML.indexOf("OSI") >= 0);
  w.glossarHide();
  check("popover: versteckt nach hide", w.glossarPop.style.display === "none");

  // 11) Tap (Klick auf Term) öffnet, Außenklick schließt
  term.dispatchEvent(new w.MouseEvent("click", { bubbles:true }));
  check("tap: Klick auf Term öffnet Popover", w.glossarPop.style.display === "block");
  D.body.dispatchEvent(new w.MouseEvent("click", { bubbles:true }));
  check("tap: Außenklick schließt Popover", w.glossarPop.style.display === "none");

  // 12) Listener-Guard: Popover-Element bleibt dieselbe Instanz (kein Leak/Doppel)
  const p1 = w.glossarPopEl(), p2 = w.glossarPopEl();
  check("guard: glossarPopEl idempotent", p1 === p2);
  check("guard: genau ein .glossar-pop im DOM", D.querySelectorAll(".glossar-pop").length === 1);

  // 13) Migrations-Default für Bestandsstate ohne glossarTip
  const w2 = await boot({ version:5, seen:{} });
  check("migration: glossarTip default true für Altstate", w2.S.glossarTip === true);

  process.exit(report());
})();
