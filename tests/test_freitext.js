/* Node-Testskript: node test_freitext.js – Qualitaet der Freitext-Bewertung (gradeTeilpunkte).
   Haelt die Messbasis fest, die am 2026-07-19 beim Kalibrieren der schluesselbegriffe entstand.

   Geprueft werden drei Eigenschaften, die alle aus dem Pool selbst reproduzierbar sind
   (keine externen Fixtures, keine handgeschriebenen Antworten – daher stabil):

   1. SANITY   – Die Musterloesung einer Frage muss ihre eigenen Schluesselbegriffe treffen.
                 Schlaegt das fehl, sind die Begriffe falsch gewaehlt (Tippfehler, Wort steht
                 gar nicht in der Musterloesung, Mehrwort-Phrase mit anderer Wortstellung).
   2. NEGATIV A – Die Musterloesung einer FREMDEN Frage darf nie als „richtig" gelten.
   3. NEGATIV B – Inhaltsleere Floskeln, die nach Fachsprache klingen, duerfen nie „richtig" sein.

   Negativ A und B sichern die Trennschaerfe. Sie sind der Grund, warum die Erkennung gefahrlos
   gelockert werden darf: Solange diese Tests gruen bleiben, erzeugt eine grosszuegigere
   Begriffserkennung keine falsch-positiven Bewertungen. */
"use strict";
const H = require("./_harness.js");

/* Klingt nach Fachsprache, sagt inhaltlich nichts – darf nirgends punkten. */
const FLOSKELN = "Das ist ein wichtiger Aspekt im Unternehmen. Man muss das sorgfaeltig pruefen und " +
  "dokumentieren, damit die Mitarbeiter gut arbeiten koennen und die Qualitaet stimmt. Auch die " +
  "Kosten und der Nutzen sollten dabei beachtet werden.";

(async () => {
  const w = await H.boot();
  const mit = w.POOL.filter(f => f.schluesselbegriffe);

  H.t("Es gibt Fragen mit Schluesselbegriffen", mit.length > 0);
  H.t("gradeTeilpunkte ist erreichbar", typeof w.gradeTeilpunkte === "function");

  /* ---- 1. Sanity: eigene Musterloesung trifft die eigenen Begriffe ---- */
  const sanityFehler = [];
  mit.forEach(f => {
    const r = w.gradeTeilpunkte(f.musterloesung, f);
    if (r.stufe !== "richtig") sanityFehler.push(f.id + " (" + r.prozent + "%, fehlt: " + r.fehlendPflicht.join("/") + ")");
  });
  H.t("Jede Musterloesung erreicht ihre eigenen Begriffe" +
    (sanityFehler.length ? " – FEHLER bei: " + sanityFehler.join(", ") : ""), sanityFehler.length === 0);

  /* Schaerfer: kein Pflichtbegriff darf in der eigenen Musterloesung fehlen. */
  const pflichtLuecken = [];
  mit.forEach(f => {
    const r = w.gradeTeilpunkte(f.musterloesung, f);
    if (r.fehlendPflicht.length) pflichtLuecken.push(f.id + ": " + r.fehlendPflicht.join("/"));
  });
  H.t("Kein Pflichtbegriff fehlt in der eigenen Musterloesung" +
    (pflichtLuecken.length ? " – FEHLER bei: " + pflichtLuecken.join(", ") : ""), pflichtLuecken.length === 0);

  /* ---- 2. Negativ A: themenfremde Musterloesung ---- */
  /* ⚠️⚠️ BIS ZUM 08.09.2026 PRUEFTE DIESER BLOCK EINE STICHPROBE: zwei feste Versaetze (7 und 13)
     ueber `mit`, also 246 von 123*122 = 15006 moeglichen Paaren. UND WELCHE 246 DAS SIND,
     ENTSCHEIDET DIE POOL-REIHENFOLGE: nach einem Einsortierlauf stand M02-012 nicht mehr mit
     M02-305 gepaart, sondern mit M02-205 – und ein latenter Bestandsfehler wurde sichtbar, der
     seit Monaten dalag. Ein fester Versatz ueber eine veraenderliche Liste ist eine VERDECKTE
     Stichprobe; das ist die Klasse "eine Pruefung, die wuerfelt, ist keine Pruefung", nur
     wuerfelt hier nicht der Zufall, sondern das Einsortieren.
     ►► GEMESSEN am 08.09.: alle 15006 Paare kosten 1,8 s – die Vollstaendigkeit ist geschenkt.
     ⚠️ NUTZER-ENTSCHEID 08.09.: umstellen und ROT STEHEN LASSEN, bis die betroffenen Fragen
     geschaerft sind. Datengrundlage: docs/archiv/PLAENE.md, "DATENGRUNDLAGE TRENNSCHAERFE FREITEXT". */
  /* ⚠️⚠️ NUTZER-ENTSCHEID 09.09.2026: DIE PRUEFUNG HEISST "THEMENFREMD" UND MISST JETZT AUCH
     THEMENFREMD. Bis heute zaehlte sie ALLE Paare – auch zwei Fragen DESSELBEN Feinthemas, bei
     denen eine inhaltliche Ueberschneidung nicht nur erlaubt, sondern zu erwarten ist: eine
     Stufe-4-Fallanalyse zum Eisbergmodell erklaert das Eisbergmodell zwangslaeufig mit, und ihre
     Musterloesung besteht dann die Stufe-2-Begriffsfrage desselben Themas. Von den 30
     Durchrutschern des 08.09. waren 10 von dieser Art.
     ►► FEHLER ist deshalb nur noch der themenFREMDE Durchrutscher – dort ist ein Treffer immer
     ein Kalibrierungsfehler. Themengleiche Paare werden als HINWEIS mit Zahl UND IDs gemeldet.
     ⛔ DER HINWEIS IST KEIN FREIBRIEF: die Zahl steht im Meldetext, damit ein Anstieg auffaellt.
     Wer sie steigen sieht, sieht zwei Fragen desselben Themas zusammenwachsen – das ist ein
     Redundanz-Befund, kein Formfehler. Stand 09.09.: 2 (M02-011, M02-109).
     ⚠️ Die Trennung laeuft ueber `thema`, nicht ueber `modul`: M03-010 (Ergonomie) und M03-117
     (Wirtschaftlichkeit & TCO) liegen im selben Modul und sind trotzdem verschiedene Themen. */
  let fpFremd = 0, fpGleich = 0; const opfer = {}, opferGleich = {};
  mit.forEach(f => {
    mit.forEach(fremd => {
      if (fremd.id === f.id) return;
      if (w.gradeTeilpunkte(fremd.musterloesung, f).stufe === "richtig") {
        if (fremd.thema === f.thema) { fpGleich++; opferGleich[f.id] = (opferGleich[f.id] || 0) + 1; }
        else { fpFremd++; opfer[f.id] = (opfer[f.id] || 0) + 1; }
      }
    });
  });
  const zeig = o => Object.entries(o).sort((a, b) => b[1] - a[1])
    .map(([id, n]) => id + "(" + n + ")").join(" ");
  H.t("Themenfremde Musterloesung gilt nie als richtig – ALLE " +
    (mit.length * (mit.length - 1)) + " Paare geprueft" +
    (fpFremd ? " – " + fpFremd + " Durchrutscher bei " + Object.keys(opfer).length +
      " Fragen: " + zeig(opfer) : ""), fpFremd === 0);
  H.t("HINWEIS (kein Fehler): " + fpGleich + " Durchrutscher zwischen Fragen DESSELBEN Feinthemas" +
    (fpGleich ? " bei " + Object.keys(opferGleich).length + " Fragen: " + zeig(opferGleich) : "") +
    " – steigt die Zahl, wachsen zwei Fragen eines Themas zusammen", true);

  /* ---- 3. Negativ B: inhaltsleere Floskeln ---- */
  let fpFloskel = 0;
  mit.forEach(f => { if (w.gradeTeilpunkte(FLOSKELN, f).stufe === "richtig") fpFloskel++; });
  H.t("Inhaltsleere Floskeln gelten nie als richtig", fpFloskel === 0);

  /* ---- 4. Leere und unsinnige Eingaben ---- */
  let leerOk = true, unsinnOk = true;
  mit.forEach(f => {
    if (w.gradeTeilpunkte("", f).stufe !== "leer") leerOk = false;
    if (w.gradeTeilpunkte("keine ahnung", f).stufe === "richtig") unsinnOk = false;
  });
  H.t("Leere Antwort wird als 'leer' erkannt", leerOk);
  H.t("Unsinnige Antwort gilt nie als richtig", unsinnOk);

  /* ---- 5. Kalibrierungs-Leitplanke ----
     Befund 2026-07-19: Fragen mit im Schnitt 2,4 Pflichtbegriffen erreichten 80 % Trefferquote bei
     frei formulierten Antworten, solche mit 3,4 nur 13 %. Mehr als 4 Pflichtbegriffe machen eine
     Frage praktisch nur noch mit woertlicher Uebereinstimmung loesbar. */
  const zuStreng = mit.filter(f => (f.schluesselbegriffe.pflicht || []).length > 4)
    .map(f => f.id + " (" + f.schluesselbegriffe.pflicht.length + ")");
  H.t("Keine Frage hat mehr als 4 Pflichtbegriffe" +
    (zuStreng.length ? " – zu streng: " + zuStreng.join(", ") : ""), zuStreng.length === 0);

  /* Struktur der Begriffe – ein Eintrag ist ein String ODER eine Alternativliste (>= 2 Strings) */
  let strukturOk = true;
  const eintragOk = e => (typeof e === "string" && e.length > 0) ||
    (Array.isArray(e) && e.length >= 2 && e.every(x => typeof x === "string" && x.length > 0));
  mit.forEach(f => {
    const sb = f.schluesselbegriffe;
    if (!Array.isArray(sb.pflicht) || !sb.pflicht.length) strukturOk = false;
    if (!(sb.pflicht || []).every(eintragOk)) strukturOk = false;
    if (sb.kuer !== undefined && (!Array.isArray(sb.kuer) || !sb.kuer.every(eintragOk))) strukturOk = false;
  });
  H.t("schluesselbegriffe haben gueltige Struktur (pflicht nicht leer, Eintrag = String oder Alternativliste)", strukturOk);

  /* ---- 6. Wortgrenzen-Regel (2026-07-20) ----
     Vorher wurde jede Variante als nackter Substring gesucht: "OS" traf in "kOSten", "IT" in
     "mITarbeiter". Kurze Begriffe muessen als eigenes Wort vorkommen, lange duerfen weiterhin
     Bestandteil eines Kompositums sein – sonst verloere "Gesamtbetriebskosten" den Treffer auf
     "Betriebskosten" (M03-009). */
  const bt = (ant, begriff) => w.begriffTreffer(" " + w.normText(ant) + " ", begriff);
  H.t("begriffTreffer ist erreichbar", typeof w.begriffTreffer === "function");
  H.t("Kurzbegriff trifft NICHT im Wortinneren (OS nicht in 'Kosten')", !bt("Die Kosten sind gesunken.", "OS"));
  H.t("Kurzbegriff trifft NICHT im Wortinneren (IT nicht in 'Mitarbeiter')", !bt("Die Mitarbeiter wurden geschult.", "IT"));
  H.t("Kurzbegriff trifft als eigenes Wort weiterhin", bt("Wir setzen ein neues OS ein.", "OS"));
  H.t("Langer Begriff trifft weiterhin im Kompositum (Gesamtbetriebskosten)",
    bt("Niedrigere Gesamtbetriebskosten sprechen dafuer.", "Betriebskosten"));

  /* ---- 7. Token-Fallback fuer Mehrwort-Begriffe (2026-07-20) ----
     Ein Mehrwort-Begriff ohne eigene Gruppe wird in Tokens zerlegt; ALLE inhaltstragenden Tokens
     muessen treffen. Die Alles-Bedingung ist der Schutz gegen Falsch-Positive. */
  H.t("Mehrwort-Begriff trifft ueber die Gruppen seiner Tokens (IP-Adresse via Netzadresse)",
    bt("Die Netzadresse wird per DHCP vergeben.", "IP-Adresse"));
  H.t("Mehrwort-Begriff bleibt trennscharf: 'Monitor A' erfuellt NICHT 'Monitor B'",
    !bt("Monitor A erreicht 7,1 Punkte.", "Monitor B"));
  H.t("Abkuerzung trifft die Langform (SSO -> Single Sign-On)", bt("Wir nutzen SSO.", "Single Sign-On"));
  H.t("Kurz-Abkuerzung trifft nicht im Wortinneren (AD nicht in 'Adresse')",
    !bt("Die Adresse wurde geaendert.", "Active Directory"));

  /* ---- 8. Alternativen je Begriff (2026-07-20) ----
     Ein Eintrag darf eine Liste gleichwertiger Formulierungen sein und zaehlt trotzdem als EIN
     Begriff. Das ist der Weg fuer frageindividuelle Formulierungen, die global keine Synonyme sind. */
  const fAlt = { schluesselbegriffe: { pflicht: ["Nutzwert", ["Monitor B", "Angebot B", "Variante B"]], kuer: [] } };
  const rHaupt = w.gradeTeilpunkte("Der Nutzwert von Monitor B ist hoeher.", fAlt);
  const rAlt   = w.gradeTeilpunkte("Der Nutzwert von Variante B ist hoeher.", fAlt);
  const rFalsch= w.gradeTeilpunkte("Der Nutzwert von Monitor A ist hoeher.", fAlt);
  H.t("Alternativliste: Haupt-Formulierung gilt als richtig", rHaupt.stufe === "richtig");
  H.t("Alternativliste: gleichwertige Formulierung gilt ebenfalls als richtig", rAlt.stufe === "richtig");
  H.t("Alternativliste: falsche Auspraegung faellt weiterhin durch", rFalsch.stufe !== "richtig");
  H.t("Alternativliste zaehlt als EIN Begriff (Gewichtung unveraendert)", rHaupt.pflichtGesamt === 2);
  H.t("Alternativliste wird als lesbarer String protokolliert",
    typeof w.gradeTeilpunkte("nichts davon", fAlt).fehlendPflicht[0] === "string" &&
    w.gradeTeilpunkte("nichts davon", fAlt).fehlendPflicht.join(" ").indexOf("Monitor B / Angebot B") >= 0);

  /* ---- 9. Synonymtabelle ohne stille Kollisionen ----
     SYN_MAP wird per Zuweisung aufgebaut: steht ein Mitglied in zwei Gruppen, gewinnt still die
     letzte und die andere Gruppe verliert den Anschluss. Das war real der Fall (ip adresse, kunde,
     dokumentation) und faellt sonst niemandem auf. */
  const gesehen = {}, doppelt = [];
  (w.SYNONYME || []).forEach(g => g.forEach(x => { if (gesehen[x]) doppelt.push(x); gesehen[x] = 1; }));
  H.t("SYNONYME ist erreichbar und nicht leer", Array.isArray(w.SYNONYME) && w.SYNONYME.length > 0);
  H.t("Kein Synonym-Mitglied steht in zwei Gruppen" + (doppelt.length ? " – doppelt: " + doppelt.join(", ") : ""),
    doppelt.length === 0);

  /* ---- 12. TRENNSCHAERFE ueber ALLE Paarungen (FB-R2a, 2026-07-21) ----
     Negativ A oben prueft nur ZWEI feste Versaetze. Das genuegte, solange es 35 Fragen mit
     Begriffen gab – bei 109 ist die Chance gross, dass ein Fehler zwischen den zwei Versaetzen
     hindurchrutscht. Genau das ist passiert: „IST"/„SOLL" als Alternativen (beides zugleich
     Alltagswoerter) liessen die ISMS-Musterloesung eine PDCA-Frage bestehen, und die beiden
     festen Versaetze sahen es nicht. Deshalb hier das VOLLE Kreuzprodukt als KENNZAHL mit
     Obergrenze – eine Ratsche gegen Verschlechterung, kein Nullwert.
     WARUM NICHT NULL: ein Teil der Treffer ist inhaltlich berechtigt. M01-013 und M07-016 fragen
     beide „Lessons Learned", M01-111 und M01-733 beide nach Chancen/Grenzen eines KI-Chatbots.
     Wo zwei Fragen denselben Stoff abfragen, MUSS eine gute Antwort beide erfuellen.
     STAND BEI EINFUEHRUNG: 51 von 11772 Paarungen (0,43 %), davon 7 mit identischem Thema.
     Steigt der Wert deutlich, ist mit hoher Wahrscheinlichkeit ein zu generischer Begriff
     dazugekommen – dann die Liste ansehen, nicht die Grenze anheben. */
  const alleMit = w.POOL.filter(f => f.schluesselbegriffe && f.musterloesung);
  let fpGesamt = 0, fpPaare = 0, beispiele = [];
  alleMit.forEach(f => alleMit.forEach(g => {
    if (f.id === g.id) return;
    fpPaare++;
    if (w.gradeTeilpunkte(g.musterloesung, f).stufe === "richtig") {
      fpGesamt++;
      if (beispiele.length < 5) beispiele.push(f.id + " <- " + g.id);
    }
  }));
  const GRENZE = 60;
  H.t("Trennschaerfe: hoechstens " + GRENZE + " falsch-positive Paarungen (aktuell " + fpGesamt +
    " von " + fpPaare + ")" + (fpGesamt > GRENZE ? " – u. a. " + beispiele.join(", ") : ""),
    fpGesamt <= GRENZE);
  /* GEGENPROBE: die Messung muss ueberhaupt etwas sehen koennen – ein Begriffssatz aus lauter
     Allerweltswoertern MUSS reihenweise durchrutschen. Sonst misst die Schleife nichts. */
  const generisch = { schluesselbegriffe: { pflicht: [["Kosten", "Unternehmen", "Daten"]], kuer: [] } };
  let durch = 0;
  alleMit.slice(0, 40).forEach(g => {
    if (w.gradeTeilpunkte(g.musterloesung, generisch).stufe === "richtig") durch++;
  });
  H.t("Gegenprobe: ein generischer Begriffssatz rutscht messbar durch (" + durch + " von 40)", durch >= 10);

  /* ---- 13. KEIN BEGRIFF DARF EIN STOPPWORT SEIN (FB-R2a, 2026-07-21) ----
     GRUND, WARUM ES DIESEN TEST BRAUCHT, obwohl 12 schon existiert: Der reale Rueckfall dieser
     Runde waren „IST" und „SOLL" als Alternativen – gross geschrieben sehen sie wie Fachbegriffe
     aus, normalisiert sind es die Allerweltswoerter „ist" und „soll", die in fast jedem deutschen
     Satz vorkommen. GEMESSEN: dieser Rueckfall veraendert das Kreuzprodukt aus Test 12 nur von
     51 auf 52 Paarungen. Eine Obergrenze kann ihn also NICHT fangen – Test 12 ist eine Ratsche
     gegen breite Verschlechterung, kein Faenger fuer Einzelfaelle. Deshalb hier die gezielte
     Pruefung: die Stoppwortliste, die die Bewertung ohnehin fuehrt, ist zugleich die Verbotsliste
     fuer Begriffe. Dieselben zwei Woerter waren schon am 20.07. einmal entfernt worden. */
  const stoppTreffer = [];
  alleMit.forEach(f => {
    const sb = f.schluesselbegriffe;
    [].concat(sb.pflicht || [], sb.kuer || []).forEach(eintrag => {
      (Array.isArray(eintrag) ? eintrag : [eintrag]).forEach(v => {
        const n = w.normText(v);
        if (n && n.indexOf(" ") < 0 && w.STOPWORTE[n]) stoppTreffer.push(f.id + ': "' + v + '"');
      });
    });
  });
  H.t("Kein Schluesselbegriff ist ein Stoppwort" +
    (stoppTreffer.length ? " – " + stoppTreffer.slice(0, 6).join(", ") : ""), stoppTreffer.length === 0);
  /* GEGENPROBE: der Test muss den echten Rueckfall erkennen. „IST" ist normalisiert „ist" und
     steht in STOPWORTE – waere es also in einem Pool-Begriff, MUESSTE der Test oben fallen. */
  H.t("Gegenprobe: 'IST' und 'SOLL' wuerden als Stoppwort erkannt",
    !!w.STOPWORTE[w.normText("IST")] && !!w.STOPWORTE[w.normText("SOLL")]);

  /* ---- 11. Pflichtbegriffe muessen VONEINANDER UNABHAENGIG sein (FB-R2a, 2026-07-21) ----
     Befund aus dem Nachruesten: bei M05-306 standen „dokumentiert", „Beleg" und „Nachweis" in drei
     VERSCHIEDENEN Pflichteintraegen – alle drei gehoeren aber derselben Synonymgruppe an
     (nachweis/beleg/dokumentation/protokoll/dokumentieren/...). Ein einziges Wort in der Antwort
     erfuellte damit alle drei Pflichten, und ein inhaltsleerer Fuelltext bestand mit 60 %.
     Die Frage war formal dreifach abgesichert und faktisch einfach. Das faellt bei der Durchsicht
     NICHT auf – die Begriffe sehen verschieden aus. Deshalb hier maschinell geprueft. */
  const kollisionen = [];
  w.POOL.filter(f => f.schluesselbegriffe && Array.isArray(f.schluesselbegriffe.pflicht)).forEach(f => {
    const gruppen = new Map();          // Gruppen-Kennung -> Index des ersten Pflichteintrags
    f.schluesselbegriffe.pflicht.forEach((eintrag, i) => {
      const varianten = Array.isArray(eintrag) ? eintrag : [eintrag];
      varianten.forEach(v => {
        const g = w.SYN_MAP[w.normText(v)];
        if (!g) return;                 // ohne Gruppe keine Kollision moeglich
        const key = g.join("|");
        if (gruppen.has(key) && gruppen.get(key) !== i) {
          kollisionen.push(f.id + ": Pflicht " + (gruppen.get(key) + 1) + " und " + (i + 1) +
            " teilen die Synonymgruppe [" + g.slice(0, 3).join(", ") + " ...]");
        } else if (!gruppen.has(key)) {
          gruppen.set(key, i);
        }
      });
    });
  });
  H.t("Kein Pflichtbegriff teilt seine Synonymgruppe mit einem anderen Pflichtbegriff derselben Frage" +
    (kollisionen.length ? " – " + kollisionen.slice(0, 5).join(" · ") : ""), kollisionen.length === 0);
  /* GEGENPROBE: ein kuenstlicher Fall MUSS von derselben Pruefung erkannt werden – sonst ist der
     Test oben still immer gruen, weil der Pool zufaellig sauber ist. */
  const probe = { schluesselbegriffe: { pflicht: [["Nachweis"], ["Beleg"]], kuer: [] } };
  const gA = w.SYN_MAP[w.normText("Nachweis")], gB = w.SYN_MAP[w.normText("Beleg")];
  H.t("Gegenprobe: die Pruefung erkennt einen kuenstlich gebauten Kollisionsfall",
    !!gA && !!gB && gA.join("|") === gB.join("|") &&
    w.gradeTeilpunkte("Wir haben alles dokumentiert.", probe).pflichtTreffer === 2);

  /* ---- 10. Kuer darf eine vollstaendige Antwort nicht abwerten (FB-R2a, 2026-07-21) ----
     Der Nenner der Prozentrechnung waechst mit jedem Kuer-Begriff. Ohne die Regel „alle Pflicht =
     richtig" sinkt die Note einer FACHLICH VOLLSTAENDIGEN Antwort, sobald man der Frage weitere
     Kuer-Begriffe spendiert – bei 3 Pflicht + 4 Kuer auf 60 % und damit unter die Schwelle.
     Der Test rechnet die Grenze bewusst NACH, statt sie zu glauben. */
  const fKuer0 = { schluesselbegriffe: { pflicht: ["Alpha", "Beta", "Gamma"], kuer: [] } };
  const fKuer4 = { schluesselbegriffe: { pflicht: ["Alpha", "Beta", "Gamma"],
                                         kuer: ["Delta", "Epsilon", "Zeta", "Eta"] } };
  const vollstaendig = "Hier stehen Alpha und Beta und ausserdem Gamma.";
  const r0 = w.gradeTeilpunkte(vollstaendig, fKuer0);
  const r4 = w.gradeTeilpunkte(vollstaendig, fKuer4);
  H.t("Alle Pflichtbegriffe ohne Kuer: richtig", r0.stufe === "richtig" && r0.pflichtTreffer === 3);
  H.t("Alle Pflichtbegriffe trotz vier Kuer-Begriffen: weiterhin richtig", r4.stufe === "richtig");
  /* GEGENPROBE 1: die reine Prozentzahl LIEGT hier tatsaechlich unter der Schwelle – sonst wuerde
     der Test auch ohne die neue Regel gruen (genau die Falle, die in dieser Sitzung zweimal zuschlug). */
  H.t("Gegenprobe: der Prozentwert allein wuerde nicht reichen",
    r4.prozent < Math.round(w.APP_CONFIG.teilpunkteRichtig * 100));
  /* GEGENPROBE 2: die Regel darf NUR bei VOLLSTAENDIGEN Pflichtbegriffen greifen. */
  const rTeil = w.gradeTeilpunkte("Hier stehen nur Alpha und Beta.", fKuer4);
  H.t("Gegenprobe: ein fehlender Pflichtbegriff bleibt unter 'richtig'",
    rTeil.pflichtTreffer === 2 && rTeil.stufe !== "richtig");
  /* GEGENPROBE 3: eine Frage OHNE Pflichtbegriffe darf durch die Regel nicht plötzlich bestehen. */
  H.t("Gegenprobe: leere Pflichtliste macht nichts automatisch richtig",
    w.gradeTeilpunkte("irgendwas", { schluesselbegriffe: { pflicht: [], kuer: ["Delta"] } }).stufe !== "richtig");

  process.exit(H.report() ? 1 : 0);
})();
