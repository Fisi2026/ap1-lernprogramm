#!/usr/bin/env node
/* pool_query.js – Pool-Abfragen als Einzeiler (Token-Sparregel 7)
   Aufruf im Training-Ordner:  node tools/pool_query.js <kommando> [arg]
   Kommandos:
     themen                 Themen je Modul mit Fragenzahl
     typen                  Typverteilung
     frage <id>             Eine Frage komplett (JSON)
     ohne <feld> [typ,typ]  IDs ohne dieses Feld (optional auf Typen gefiltert)
     ids-frei <praefix>     Belegte IDs mit Präfix (z. B. M03-9) → Lücken selbst ablesen
     freeids <praefix> [n]  Nächste n FREIE IDs im Band des Präfix (z. B. "M03-9" → 900–999, Default n=5)
     idcheck                Audit aller IDs: Dubletten, Formfehler (≠ M0X-NNN), Präfix≠modul, je Modul Anzahl+Min/Max
     duenn [n]              Themen mit weniger als n Fragen (Default 8)
     stufe <1-4>            Fragenzahl je Modul in dieser Schwierigkeit
     suche <regex>          IDs, deren JSON auf das Muster passt (max 40)
     kontext <regex> [n]    wie 'suche', zeigt aber die FUNDSTELLE mit n Zeichen Umfeld
                            (Default 90). Dafuer gedacht, dieselbe Sachaussage an mehreren
                            Stellen des Pools nebeneinander zu legen.
                            ⚠️ EINGEFUEHRT 26.08.2026: An einem Tag dreimal derselbe Befundtyp -
                            der Pool sagt an einer Stelle etwas anderes als an einer zweiten
                            (M06-120 gegen M06-304, M04-401 gegen M04-105, M04-005/318 gegen
                            M04-920). Sichtbar wird das nur, wenn man die Stellen nebeneinander
                            sieht - mit einer reinen ID-Liste nicht.
     coverage               Abdeckungsmatrix je Modul (Markdown) – live aus pool/*.json
                            (Abschnitt 1 der alten COVERAGE.md). Umleiten: > COVERAGE_GEN.md
     verweise [modul]       E2-Zählung (Fragen ohne Abschnittsnummer) UND die Matrix
                            thema → Abschnitt mit Ausreißer-Liste. Grundlage des E3-Laufs.
                            ⚠️ Kandidatenfilter, kein Urteil – jeder Ausreißer wird einzeln
                            gegen die Kursdatei gelesen (Lehre aus E3_M01_VERWEISE.md).
     firmen [modul]         Firmen-Eigennamen im Pool: (A) Namen in ASCII-Umschrift, wo ein
                            Umlaut hingehört (Nutzer-Entscheid 27.07.: „Umlaute werden auch in
                            Firmen-Eigennamen korrigiert") und (B) dieselbe Firma in ZWEI
                            Schreibweisen. ⚠️ Kandidatenfilter, kein Urteil.
     zufall                 DETERMINISTISCHE Probe aller rechenassistent-Aufgaben: rechnet jede
                            Aufgabe ueber ihren Variablenraum durch (vollstaendig, wo er klein
                            genug ist, sonst ueber alle Eckpunkte) und meldet negative oder
                            ungueltige Zwischenergebnisse. Ausnahmen stehen sichtbar im Werkzeug.
                            ⚠️ EINGEFUEHRT 26.08.2026: M07-760 nannte das Ergebnis fest
                            "Kostenueberschreitung", war aber in 47 % der Ziehungen negativ.
                            ⚠️ WUERFELT NICHT - die Lehre "eine Pruefung, die wuerfelt, ist keine
                            Pruefung" gilt auch hier.
     zitate                 Woertliche Gesetzeszitate im Pool (Text in Anfuehrungszeichen
                            neben einer Paragrafen-/Artikelangabe) UND Absatzangaben zu
                            Vorschriften, die keine Absaetze haben. Beleg- und Ausnahmeliste:
                            zitate_belegt.json - dieselbe Quelle wie check.sh 4e4.
                            ⚠️ EINGEFUEHRT 26.08.2026: von fuenf Zitatstellen im Pool waren DREI
                            keine Zitate, sondern Paraphrasen im Zitatgewand.
     verrat [modul] [n]     KANDIDATENFILTER: dropdown-Lücken, deren Lösungswort wörtlich im
                            Aufgabentext steht (Mindestlänge n, Standard 6). Eine Aufgabe, die
                            ihre eigene Lösung nennt, misst nichts – sie sieht nur so aus.
                            ⚠️ EINGEFÜHRT 27.08.2026: FALL-01 b) nannte „KundenID (Primär-
                            schlüssel)" und fragte danach, was KundenID sei; FALL-03 d) schrieb
                            „(alle Änderungen seit letzter VOLLsicherung)" und fragte nach
                            „differentiell". Im Fragenpool fanden sich 12 weitere.
                            ⚠️ NUR DROPDOWN – bei mc ist die Lösung ein ganzer Satz, ein Wort
                            daraus im Text sagt nichts. Kandidatenfilter, KEIN Urteil.
     antworttell [k3]       KANDIDATENFILTER (K3-E66, 24.11.2026, Lerner-Meldungen 14/17) fuer mc,
                            mehrfach, szenario2: A ECHO – die richtige Antwort teilt >= 2 Inhaltswoerter
                            MEHR mit dem Fragetext als jede falsche · B KLAMMER – der Fragetext nennt
                            in Klammern die Anfangswoerter der richtigen Antworten (M05-401) · D
                            THEMENFREMD – eine falsche Antwort teilt kein Wort mit Frage und richtiger
                            Antwort. `k3` = nur das Set klausur_k3. Kein Urteil (K3: A 5 = Fehlalarme).
     abdeckung              Welche inhaltliche Prüfung liest welchen Inhaltsträger? Liest
                            inhaltstraeger.json, meldet unausgefüllte Zellen UND zählt jedes
                            „gelesen" nach. Dieselbe Quelle wie check.sh 4e7.
                            ⚠️ EINGEFÜHRT 27.08.2026, weil an EINEM Tag fünfmal derselbe Fehler
                            auftrat: eine Prüfung meldet grün über ein Gebiet, das sie nicht
                            betritt. Anlass und Grenzen: inhaltstraeger.json.
     laengen [modul]        Längenbefund aller mc-Fragen: Tell-Treffer (richtige = längste) UND
                            überlange Distraktoren (> max_faktor). Grenzwerte und Bestandsent-
                            scheide kommen aus laengen_ausnahmen.json – dieselbe Quelle wie
                            tests/test_didaktik.js und tools/apply_batch.py.
                            ⚠️ EINGEFÜHRT 28.07.2026, weil genau diese Messung an einem einzigen
                            Tag ACHTMAL als Wegwerf-Skript neu geschrieben wurde. Jede Fassung
                            war minimal anders – und eine davon zählte falsch, weil sie die
                            Kurzoptionen-Ausnahme vergaß. Eine Messung, die man nachbaut, ist
                            eine Messung, die abweicht.
*/
const path = require("path");
const POOL = require(path.join(__dirname, "pool_laden.js")).laden();  // N29 Teil 2 (E40): pool/*.json ueber den Lader
/** @type {any[]} */
const F = POOL.fragen;

/* ===================================================================
   DIE FALL-TEILAUFGABEN GEHOEREN ZUM BESTAND.  (B80, 27.08.2026)

   Bis heute las pool_query.js ausschliesslich fragen.js. In `firmen`
   stand sogar der Satz "faelle.js ist NICHT dabei - FALL-* getrennt
   pruefen." Diesen getrennten Lauf hat es nie gegeben.

   Was das gekostet hat: Am 27.08. wurde der Waechter `begriffe`
   gebaut, weil BITV falsch aufgeloest worden war. Er meldete
   "BITV: 0". Zur selben Zeit stand in FALL-02 Teil c) die BITV als
   Rechtsgrundlage fuer Stuhl und Schreibtisch - zweimal, in der
   Zuordnung und in der Erklaerung. Der Waechter konnte den Treffer
   nicht sehen, weil er die Datei nicht betritt.

   Das war der VIERTE Fall derselben Klasse an einem Tag: eine
   Pruefung, die gruen meldet ueber einen Bereich, den sie nicht liest.

   B enthaelt darum Fragen UND Fall-Teilaufgaben. Jede Teilaufgabe
   wird zu einem Eintrag mit der ID FALL-0N-tM; Titel und Szenario
   haengen an t1, damit jeder Text GENAU EINMAL im Bestand steht und
   Firmennamen aus dem Szenario nicht fuenffach gezaehlt werden.

   ⚠️ B ist NICHT ueberall richtig. Die strukturellen Kommandos
   (idcheck, freeids, coverage, themen, typen, duenn, stufe, zufall)
   lesen weiter F: FALL-0N-tM ist keine ID der Form M0X-NNN, und ein
   Fall ist keine Frage im Sinne der Poolgroesse. Wer ein neues
   Kommando ergaenzt, entscheidet bewusst zwischen F und B.
   =================================================================== */
const FAELLE_ROH = POOL.faelle;
const FALLTEILE = /** @type {any[]} */ ([]);
FAELLE_ROH.forEach(/** @param {any} fall */ fall => {
  (fall.teilaufgaben || []).forEach(/** @param {any} t @param {number} i */ (t, i) => {
    const e = Object.assign({}, t, {
      id: fall.id + "-t" + (i + 1),
      modul: fall.modul,
      thema: fall.thema,
      pruefungsteil: fall.pruefungsteil,
      _fall: fall.id
    });
    if (i === 0) { e._titel = fall.titel; e._szenario = fall.szenario; }
    FALLTEILE.push(e);
  });
});
const B = F.concat(FALLTEILE);

/* ===================================================================
   DIE LERNUNTERLAGEN SIND AUCH BESTAND.  (B87-B89, 27.08.2026)

   5207 Zeilen Lehrtext in 0*.md und 99_Spickzettel.md - und bis heute
   las sie KEIN inhaltlicher Waechter. Geprueft wurde an ihnen nur, ob
   ein verwiesener Abschnitt EXISTIERT (tools/e3_gegenprobe.py), nie,
   was darin steht. Dabei zeigen 959 Verweise aus dem Fragenpool hinein.

   Die erste Probe fand sofort:
     04_IT-Loesungen Z.452  Pay-per-Use als "monatliche Gebuehr je
                            Nutzer" - GENAU der Fehler, der am 27.08.
                            in M04-008/M04-120 korrigiert wurde und
                            wegen dem der begriffe-Waechter entstand.
     04_IT-Loesungen Z.449  GPL-Offenlegung ohne die Weitergabe-
                            Bedingung - genau der Fehler aus FALL-01 c).
     03_IT-Systeme   Z.308  "Arbeitsplatz-IT muss nach BITV zugaenglich
                            sein" - die BITV bindet oeffentliche Stellen.

   ►► DAS IST DIE KLASSE VON B80 EINE EBENE HOEHER: Wird ein Fachfehler
      im Pool korrigiert, prueft nichts, ob derselbe Fehler im Lehrtext
      sitzt, auf den die Frage verweist. Korrektur und Quelle laufen
      auseinander.

   spickzettel.js steht NICHT extra hier - es wird von tools/build_spick.py
   aus 99_Spickzettel.md erzeugt und ist damit ueber die .md abgedeckt.
   =================================================================== */
const LEHRTEXT = (function () {
  const fs = require("fs");
  const wurzel = path.join(__dirname, "..");
  const raus = /** @type {any[]} */ ([]);
  fs.readdirSync(wurzel)
    .filter(n => /^(0\d|99)_.*\.md$/.test(n))
    .sort()
    .forEach(datei => {
      const roh = fs.readFileSync(path.join(wurzel, datei), "utf8").split("\n");
      let titel = "(Kopf)", puffer = /** @type {any[]} */ ([]), ab = 1;
      const schliesse = () => {
        if (puffer.join("").trim())
          raus.push({ id: datei.slice(0, 2) + "#" + ab + " " + titel,
                      quelle: datei, text: puffer.join("\n") });
      };
      roh.forEach((z, i) => {
        if (/^#{2,4}\s/.test(z)) { schliesse(); titel = z.replace(/^#+\s*/, "").trim();
                                    puffer = []; ab = i + 1; }
        else puffer.push(z);
      });
      schliesse();
    });
  return raus;
})();
/* T = Fragen + Fall-Teilaufgaben + Lehrtext. Nur die TEXT-Pruefungen lesen T:
   begriffe, zitate, firmen, kontext, suche. Nicht: laengen (Lehrtext hat keine
   Optionen), verweise (der Lehrtext IST das Ziel), alle strukturellen. */
const T = B.concat(LEHRTEXT);
const [cmd, a1, a2] = process.argv.slice(2);
const out = console.log;

if (cmd === "themen") {
  /** @type {Record<string, any>} */ const t = {};
  F.forEach(f => { const k = f.modul + " | " + f.thema; t[k] = (t[k] || 0) + 1; });
  Object.keys(t).sort().forEach(k => out(String(t[k]).padStart(3) + "  " + k));
} else if (cmd === "typen") {
  /** @type {Record<string, any>} */ const t = {};
  F.forEach(f => { t[f.typ] = (t[f.typ] || 0) + 1; });
  Object.entries(t).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => out(String(v).padStart(3) + "  " + k));
} else if (cmd === "frage") {
  const f = B.find(x => x.id === a1);
  out(f ? JSON.stringify(f, null, 1) : "nicht gefunden: " + a1);
} else if (cmd === "ohne") {
  const typen = a2 ? a2.split(",") : null;
  const sel = F.filter(f => (!typen || typen.includes(f.typ)) &&
    (f[a1] === undefined || (Array.isArray(f[a1]) && !f[a1].length)));
  out(sel.length + " ohne '" + a1 + "':"); out(sel.map(f => f.id).join(", "));
} else if (cmd === "ids-frei") {
  out(F.map(f => f.id).filter(id => id.startsWith(a1)).sort().join(", ") || "keine belegt");
} else if (cmd === "freeids") {
  // Nächste freie IDs im Zahlen-Band, das der Präfix aufspannt (z. B. "M03-9" -> 900..999).
  const m = (a1 || "").match(/^(M0\d-)(\d*)$/);
  if (!m) { out("Präfix ungültig – Format M0X- oder M0X-<ziffern>, z. B. M03-9"); process.exit(1); }
  const modPre = m[1], dg = m[2];
  const lo = dg ? +(dg + "0".repeat(Math.max(0, 3 - dg.length))) : 0;
  const hi = dg ? +(dg + "9".repeat(Math.max(0, 3 - dg.length))) : 999;
  const n = +a2 || 5;
  const belegt = new Set(F.map(f => f.id).filter(id => id.startsWith(modPre))
    .map(id => +id.slice(modPre.length)).filter(x => x >= lo && x <= hi));
  const frei = [];
  for (let i = lo; i <= hi && frei.length < n; i++) if (!belegt.has(i)) frei.push(i);
  const w = String(hi).length;
  out(frei.length ? frei.map(i => modPre + String(i).padStart(w, "0")).join(", ")
    : "keine freie ID im Band " + lo + "–" + hi);
} else if (cmd === "idcheck") {
  const ids = F.map(f => f.id);
  const dupl = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))].sort();
  const form = F.filter(f => !/^M0\d-\d{3}$/.test(String(f.id))).map(f => f.id);
  const praefix = F.filter(f => !String(f.id).startsWith(f.modul + "-")).map(f => f.id + " (modul " + f.modul + ")");
  out("Fragen gesamt: " + F.length);
  out("Dubletten:      " + (dupl.length ? dupl.join(", ") : "keine"));
  out("Formfehler:     " + (form.length ? form.join(", ") : "keine"));
  out("Präfix≠modul:   " + (praefix.length ? praefix.join(", ") : "keine"));
  out("--- je Modul (Anzahl · Min–Max-ID) ---");
  [...new Set(F.map(f => f.modul))].sort().forEach(m => {
    const mid = F.filter(f => f.modul === m).map(f => f.id).sort();
    out("  " + m + ": " + String(mid.length).padStart(3) + " · " + mid[0] + "–" + mid[mid.length - 1]);
  });
  const problem = dupl.length + form.length + praefix.length;
  out(problem ? "\n" + problem + " PROBLEM(E)" : "\nOK – keine ID-Probleme");
  process.exit(problem ? 1 : 0);
} else if (cmd === "duenn") {
  const n = +a1 || 8, t = /** @type {Record<string, any>} */ ({});
  F.forEach(f => { const k = f.modul + " | " + f.thema; t[k] = (t[k] || 0) + 1; });
  Object.entries(t).filter(([, v]) => v < n).sort((a, b) => a[1] - b[1])
    .forEach(([k, v]) => out(String(v).padStart(3) + "  " + k));
} else if (cmd === "stufe") {
  /** @type {Record<string, any>} */ const t = {};
  F.filter(f => f.schwierigkeit === +a1).forEach(f => { t[f.modul] = (t[f.modul] || 0) + 1; });
  Object.keys(t).sort().forEach(k => out(String(t[k]).padStart(3) + "  " + k));
} else if (cmd === "suche") {
  const re = new RegExp(a1, "i");
  const hits = T.filter(f => re.test(JSON.stringify(f))).map(f => f.id);
  out(hits.length + " Treffer:"); out(hits.slice(0, 40).join(", ") + (hits.length > 40 ? " …" : ""));
} else if (cmd === "coverage") {
  // Modul-Titel wie in der App (var MODULE in lernprogramm_ap1.html)
  /** @type {Record<string, string>} */ const TITEL = {
    M01: "Projektmanagement", M02: "Kundenberatung & Marketing", M03: "IT-Systeme & Hardware",
    M04: "IT-Lösungen & Programmierung", M05: "Qualitätssicherung", M06: "IT-Sicherheit & Datenschutz",
    M07: "Leistungserbringung & Verträge", M08: "WiSo"
  };
  const module = [...new Set(F.map(f => f.modul))].sort();
  const themen = new Set(F.map(f => f.modul + "|" + f.thema));
  const ap1 = F.filter(f => f.pruefungsteil === "AP1").length;
  const ap2 = F.length - ap1;
  const heute = new Date().toISOString().slice(0, 10);
  const L = [];
  L.push("# Themen-Abdeckungsmatrix AP1-Lernprogramm (generiert)");
  L.push("");
  L.push("**Stand:** " + heute + " | **Poolgröße:** " + F.length + " Fragen (" + ap1 +
    " AP1, " + ap2 + " AP2-Zusatz) | **" + themen.size + " Themen** in " + module.length + " Modulen");
  L.push("");
  L.push("Automatisch erzeugt via `node tools/pool_query.js coverage`. Nicht von Hand pflegen – " +
    "bei Bedarf neu generieren. Parametrisierte Rechen-Generatoren und Fallaufgaben (faelle.js) " +
    "sind hier NICHT mitgezählt und verstärken die Rechen-/Netzplanthemen zusätzlich.");
  L.push("");
  L.push("Bewertungslegende: **OK** = breit | **DÜNN** = weniger als 5 Fragen | " +
    "**EINSEITIG** = nur 1 Format oder nur 1 Schwierigkeitsstufe. Stufen als St.1/St.2/St.3/St.4.");
  L.push("");
  L.push("## Matrix je Modul");
  module.forEach(m => {
    L.push(""); L.push("### " + m + " " + (TITEL[m] || ""));
    L.push(""); L.push("| Thema | Fragen | Stufen 1/2/3/4 | Formate | Bewertung |");
    L.push("|---|---:|---|---|---|");
    const mf = F.filter(f => f.modul === m);
    const themenListe = [...new Set(mf.map(f => f.thema))].sort((a, b) => a.localeCompare(b, "de"));
    themenListe.forEach(th => {
      const tf = mf.filter(f => f.thema === th);
      const st = [0, 0, 0, 0];
      tf.forEach(f => { if (f.schwierigkeit >= 1 && f.schwierigkeit <= 4) st[f.schwierigkeit - 1]++; });
      /** @type {Record<string, any>} */ const typZ = {};
      tf.forEach(f => { typZ[f.typ] = (typZ[f.typ] || 0) + 1; });
      const typen = Object.entries(typZ)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([k, v]) => k + "(" + v + ")").join(", ");
      const nFormate = Object.keys(typZ).length;
      const nStufen = st.filter(x => x > 0).length;
      let bew = "OK";
      if (tf.length < 5) bew = "**DÜNN**";
      else if (nFormate === 1) bew = "**EINSEITIG** (nur 1 Format)";
      else if (nStufen === 1) bew = "**EINSEITIG** (nur 1 Stufe)";
      L.push("| " + th + " | " + tf.length + " | " + st.join("/") + " | " + typen + " | " + bew + " |");
    });
  });
  L.push("");
  out(L.join("\n"));
} else if (cmd === "laengen") {
  /* Beide Richtungen in EINER Ausgabe – sie haengen zusammen: Wer einen ueberlangen Distraktor
     kuerzt, erzeugt leicht einen Tell. Am 28.07. neunmal passiert. */
  const KONF = require(path.join(__dirname, "..", "laengen_ausnahmen.json"));
  const MINL = KONF.grenzwerte.min_optionslaenge, MAXF = KONF.grenzwerte.max_faktor;
  const AUSN = KONF.ausnahmen || {};
  const nurModul = a1 || null;
  let gesamt = 0;
  const tells = /** @type {any[]} */ ([]), ueber = /** @type {any[]} */ ([]);
  B.forEach(f => {
    if (f.typ !== "mc") return;
    if (nurModul && f.modul !== nurModul) return;
    const opt = f.optionen, i = f.loesungIndex;
    if (!Array.isArray(opt) || opt.length < 2 || typeof i !== "number" || !opt[i]) return;
    const len = opt.map(o => String(o).length), max = Math.max(...len);
    if (max < MINL) return;                       // Kurzoptionen-Ausnahme, wie im Waechter
    gesamt++;
    if (len[i] === max) tells.push(f.id);         // Gleichstand zaehlt
    else if (!AUSN[f.id] && max > len[i] * MAXF)
      ueber.push({ id: f.id, fak: max / len[i], r: len[i], d: max });
  });
  ueber.sort((x, y) => y.fak - x.fak);
  out("Grundmenge (mc, laengste Option >= " + MINL + " Zeichen): " + gesamt +
      (nurModul ? "   [nur " + nurModul + "]" : ""));
  out("");
  out("1) TELL – richtige Antwort ist die laengste (Gleichstand zaehlt): " + tells.length +
      " = " + (gesamt ? (100 * tells.length / gesamt).toFixed(2) : "0") + " %");
  out("   " + (tells.join(", ") || "keine"));
  out("");
  out("2) UEBERLANG – ein Distraktor ueber " + MAXF + "x (ohne die " +
      Object.keys(AUSN).length + " Bestandsentscheide): " + ueber.length);
  ueber.forEach(u => out("   " + u.fak.toFixed(2) + "x  " + u.id +
                         "   richtig=" + u.r + " laengster=" + u.d +
                         "   Zielfenster " + (u.r + 1) + ".." + Math.floor(u.r * MAXF)));
  if (!ueber.length) out("   keine");
} else if (cmd === "firmen") {
  /* firmen [modul] – EINGEFUEHRT 25.08.2026.
     Der Nutzer hat am 27.07. entschieden: „Umlaute werden auch in Firmen-Eigennamen korrigiert."
     Der grosse Firmennamen-Lauf (FB-R3, „Rhaus-Metall" -> 254 verschiedene Namen) hat einen Teil
     in ASCII-Umschrift stehen lassen. Diese Messung findet sie.
     ⚠️⚠️ DIE FALLE STEHT IM ARCHIV: „ue" kommt auch aus „eu"/„au" (Steuerung, dauert, Brauerei,
     Bauelemente). Ein blosses /ue/ meldet 47 Faelle, von denen 10 richtig geschrieben sind.
     ►► Deshalb ZWEI Filter, beide sichtbar: (1) steht vor dem ae/oe/ue ein Vokal, ist es eine
     Silbengrenze, kein Umlaut. (2) Ortsableitungen auf -er (Itzehoe->Itzehoer, Lohra->Lohraer)
     stehen in AUSNAHMEN und werden mitgezaehlt AUSGEWIESEN, nicht still verschluckt. */
  /* ⚠️ NACHGEZOGEN AM 25.08.2026, NOCH AM SELBEN TAG: die erste Fassung kannte nur
     GmbH/AG/KG/OHG/SE/e.K. und uebersah damit "Bad Kissinger Kurverwaltung AoeR",
     "Kaltensundheim Sparkasse AoeR", "Suederelbe Wohnungsgenossenschaft eG" und
     "Amoeneburger Bildungszentrum gGmbH". Gefunden hat sie ein Mensch beim Nachlesen einer
     ganz anderen Frage - NICHT dieses Werkzeug. ►► Eine Messung ist nur so vollstaendig wie
     ihre Aufzaehlung; wer eine Liste von Kuerzeln pflegt, prueft sie gegen den echten Bestand. */
  const RE_FIRMA = /[A-ZÄÖÜ][A-Za-zÄÖÜäöüß0-9]+(?:[- ][A-ZÄÖÜ][A-Za-zÄÖÜäöüß0-9]+)*\s+(?:GmbH(?:\s*&\s*Co\.\s*KG)?|gGmbH|AG|KGaA|KG|OHG|GbR|eG|e\.\s?V\.|e\.\s?K\.|AöR|AoeR|SE|UG)\b/g;
  const VORSATZ = /^(Die|Der|Das|Eine|Ein|Bei|Und|Als|Im|In|Am|Von|Für|Mit|Nach|Vor|Zur|Zum|Diese|Dieser|Jede|Jeder|Wenn|Da|So|Auch|Nur|Sie|Er|Es|Wertschöpfungskette)\s+/;
  const RECHTSFORM = /^(GmbH|AG|KG|OHG|SE|UG|e\.\s?K\.|GmbH\s*&\s*Co\.\s*KG)$/;
  const AUSNAHMEN = ["Itzehoer", "Lohraer"];          // Ort + -er, richtig geschrieben
  const saeubere = /** @param {string} n */ n => n.replace(VORSATZ, "").trim();
  /* Umlaut-Verdacht: ae/oe/ue, dem KEIN Vokal vorausgeht und dem ein Buchstabe folgt. */
  /* ⚠️⚠️ RECHTSFORM-KUERZEL BRAUCHEN EINE EIGENE, HARTE LISTE - die Silbenregel greift dort NICHT.
     "AoeR" (Anstalt oeffentlichen Rechts, richtig: AöR) rutschte ZWEIMAL durch: erst weil nach
     dem "oe" ein grosses R steht, dann weil davor ein "A" steht - also ein Vokal, den die
     Silbenregel als "eu/au"-Fall wertet. Erst die dritte Gegenprobe war rot.
     ►► Ein Kuerzel ist kein Wort: hier gibt es nichts zu heuristisch zu erraten, es ist
        entweder richtig geschrieben oder nicht. */
  const FALSCHE_RECHTSFORM = { "AoeR": "AöR", "aoeR": "AöR", "AOER": "AöR" };
  const umlautVerdacht = /** @param {string} n */ n => {
    if (Object.keys(FALSCHE_RECHTSFORM).some(k => n.indexOf(k) >= 0)) return true;
    let rest = n;
    AUSNAHMEN.forEach(a => { rest = rest.split(a).join(""); });
    /* ⚠️ KEIN Wortanfang-Fall: deutsche Ortsnamen auf Ae-/Oe-/Ue- tragen echte Digraphen
       (Uetersen, Uelzen, Oelde, Aerzen) - eine erste Fassung meldete "Uetersener Schlosserei"
       als Fehler. Am 25.08. gegen die Stadt Uetersen (Kreis Pinneberg) nachgeschlagen. */
    /* ⚠️ FOLGEZEICHEN AUCH GROSS: "AoeR" (Anstalt oeffentlichen Rechts) rutschte durch, weil
       nach dem "oe" ein grosses R steht. Am 25.08. bei der Gegenprobe aufgefallen - der
       Waechter meldete die sabotierte Stelle NICHT. Eine Gegenprobe, die schweigt, ist ein
       Befund ueber den Waechter, nicht ueber den Pool. */
    return /[^aeiouäöüAEIOUÄÖÜ](ae|oe|ue)[a-zßA-ZÄÖÜ]/.test(rest);
  };
  const schluessel = /** @param {string} n */ n => n.toLowerCase()
    .replace(/ä|ae/g, "a").replace(/ö|oe/g, "o").replace(/ü|ue/g, "u")
    .replace(/ß|ss/g, "s").replace(/[^a-z0-9]/g, "");

  const auswahl = a1 ? T.filter(f => f.modul === a1.toUpperCase()) : T;
  if (!auswahl.length) { out("Keine Fragen fuer " + a1); process.exit(1); }
  const orte = new Map();
  auswahl.forEach(f => {
    (JSON.stringify(f).match(RE_FIRMA) || []).forEach(m => {
      const n = saeubere(m);
      if (!n || RECHTSFORM.test(n)) return;
      if (!orte.has(n)) orte.set(n, new Set());
      orte.get(n).add(f.id);
    });
  });
  out("Firmen-Eigennamen in der Auswahl: " + orte.size +
      (a1 ? "  (Modul " + a1.toUpperCase() + ")" : "  (ganzer Fragenpool)"));
  out("Fall-Teilaufgaben sind seit 27.08.2026 mitgezaehlt (B80).");

  const treffer = [...orte.keys()].filter(umlautVerdacht).sort();
  out("");
  out("A) ASCII-Umschrift, wo ein Umlaut hingehoert: " + treffer.length);
  treffer.forEach(n => out("   " + n + "   ->  " + [...orte.get(n)].join(" ")));
  const wegAusnahme = [...orte.keys()].filter(n => AUSNAHMEN.some(a => n.includes(a))).sort();
  out("   ausgenommen (Ort + -er, richtig): " + (wegAusnahme.join(" | ") || "keine"));

  const gruppen = new Map();
  [...orte.keys()].forEach(n => {
    const k = schluessel(n);
    if (!gruppen.has(k)) gruppen.set(k, []);
    gruppen.get(k).push(n);
  });
  const uneinheitlich = [...gruppen.values()].filter(g => new Set(g).size > 1);
  out("");
  out("B) DIESELBE FIRMA IN ZWEI SCHREIBWEISEN: " + uneinheitlich.length);
  uneinheitlich.forEach(g => out("   " + g.map(/** @param {string} n */ n => n + " [" + [...orte.get(n)].join(",") + "]").join("   VS   ")));

} else if (cmd === "verweise") {
  /* verweise [modul] – E2-Zaehlung und die Matrix thema -> Abschnitt.
     EINGEFUEHRT 24.08.2026: Der E3-Lauf misst je Frage das Paar `thema` -> verwiesener
     Abschnitt; ein Thema, das ueberwiegend auf 4.6 zeigt und dreimal auf 4.3, hat entweder
     eine Ausnahme oder drei Fehler. Diese Messung wurde bis heute jedes Mal als Wegwerf-
     Einzeiler nachgebaut – genau das verbietet TASKLIST Sparregel 6.
     ⚠️ Die Matrix ist ein KANDIDATENFILTER, kein Urteil. Jeder Ausreisser wird einzeln gegen
     die Kursdatei gelesen, nie nach Mehrheit entschieden (Lehre aus E3_M01_VERWEISE.md). */
  /* ⚠️ NACHGESCHAERFT 24.08.2026: Die erste Fassung las JEDE Zahl der Form n.m als Abschnitt –
     und fand deshalb in „WCAG 2.1, BITV 2.0" einen Abschnitt 2.1. Genau der Fehlertyp, vor dem
     START_PROMPT bei „(Option 42)" warnt. Es zaehlt nur, was hinter „Abschnitt(e)" steht.
     Ausserdem gibt es Verweise auf MEHRERE Abschnitte („Abschnitt 3.1 und 3.3") – 24 im Pool,
     22 davon in M03. Die duerfen nicht als Ausreisser des ersten Abschnitts gelten. */
  const abschnitte = /** @param {any} v */ v => {
    const s = String(v || ""), erg = [];
    const kopf = /Abschnitte?\s+(\d\.\d)((?:\s*(?:,|und|bis|\/)\s*\d\.\d)*)/gi;
    let m;
    while ((m = kopf.exec(s))) {
      erg.push(m[1]);
      (m[2] || "").replace(/\d\.\d/g, x => { erg.push(x); return x; });
    }
    return [...new Set(erg)];
  };
  const sel = a1 ? B.filter(f => f.modul === a1.toUpperCase()) : B;
  if (!sel.length) { out("Keine Fragen fuer " + a1); process.exit(1); }
  const ohne = sel.filter(f => abschnitte(f.verweis).length === 0);
  const mit  = sel.filter(f => abschnitte(f.verweis).length === 1);
  const multi = sel.filter(f => abschnitte(f.verweis).length > 1);
  const NUM = /\b(\d\.\d)\b/;
  const schein = ohne.filter(f => NUM.test(String(f.verweis || "")));
  out("Fragen in der Auswahl: " + sel.length + "   mit EINEM Abschnitt: " + mit.length +
      "   mit MEHREREN: " + multi.length + "   ohne Abschnitt: " + ohne.length);
  if (multi.length) out("  mehrere Abschnitte (kein Fehler, nicht in der Matrix): " +
                        multi.map(f => f.id).join(", "));
  if (schein.length) out("\u26a0 " + schein.length + " davon enthalten eine Zahl n.m, die KEIN Abschnitt " +
                         "ist (Versionsnummer): " + schein.map(f => f.id).join(", "));
  /** @type {Record<string, any>} */ const jeM = {};
  ohne.forEach(f => jeM[f.modul] = (jeM[f.modul] || 0) + 1);
  /* ⚠️ NUTZER-ENTSCHEID 24.08.2026: M08 ist B3/WiSo und hat bewusst KEINE Kursdatei – es gibt
     keine 08_*.md und es soll auch keine geben. Seine Fragen KOENNEN keinen Abschnitt nennen.
     Sie zaehlen deshalb NICHT zu E2, sondern werden getrennt ausgewiesen. Vorher las sich E2
     als „238 offen", davon waren 103 gar nicht offen. **Nicht wieder zusammenzaehlen.** */
  const m08 = jeM["M08"] || 0;
  const e2 = ohne.length - m08;
  out("E2 (ohne M08): " + e2 + "   +  M08 ausgenommen: " + m08);
  out("E2 je Modul: " + (Object.keys(jeM).filter(k => k !== "M08").sort()
        .map(k => k + " " + jeM[k]).join(" \u00b7 ") || "keine"));
  out("\u26a0 M08 ist per Nutzer-Entscheid 24.08. dauerhaft ausgenommen (B3/WiSo, keine Kursdatei).");
  out("");
  out("--- MATRIX thema -> Abschnitt (Ausreisser sind Kandidaten, kein Urteil) ---");
  /** @type {Record<string, any>} */ const m = {};
  mit.forEach(f => {
    const k = f.modul + " | " + f.thema, ab = abschnitte(f.verweis)[0];
    (m[k] = m[k] || {})[ab] = ((m[k] || {})[ab] || 0) + 1;
  });
  Object.keys(m).sort().forEach(k => {
    const e = Object.entries(m[k]).sort((x, y) => y[1] - x[1]);
    const summe = e.reduce((s, [, v]) => s + v, 0), top = e[0][1];
    const streu = e.length > 1 ? "  <== " + (summe - top) + " Ausreisser" : "";
    out(String(summe).padStart(3) + "  " + k);
    out("     " + e.map(([ab, v]) => ab + ":" + v).join("  ") + streu);
  });
  out("");
  out("--- AUSREISSER-LISTE (IDs, die nicht auf den haeufigsten Abschnitt ihres Themas zeigen) ---");
  let n = 0;
  Object.keys(m).sort().forEach(k => {
    const e = Object.entries(m[k]).sort((x, y) => y[1] - x[1]);
    if (e.length < 2) return;
    const haupt = e[0][0];
    mit.filter(f => f.modul + " | " + f.thema === k &&
                    abschnitte(f.verweis)[0] !== haupt)
       .forEach(f => { n++; out("  " + f.id + "  " + abschnitte(f.verweis)[0] +
                                " (Thema zeigt sonst auf " + haupt + ")  " + f.verweis); });
  });
  out("Summe Ausreisser: " + n);
} else if (cmd === "kontext") {
  // Wie "suche", aber mit Umfeld: legt dieselbe Sachaussage aus mehreren Fragen nebeneinander.
  const umfeld = Math.max(20, Math.min(400, parseInt(a2, 10) || 90));
  const re = new RegExp(a1, "g");
  let treffer = 0, fragen = 0;
  T.forEach(f => {
    const s = JSON.stringify(f);
    re.lastIndex = 0;
    let m, erste = true;
    while ((m = re.exec(s)) !== null) {
      if (!m[0].length) { re.lastIndex++; continue; }
      if (erste) { fragen++; erste = false; }
      treffer++;
      const von = Math.max(0, m.index - umfeld), bis = Math.min(s.length, m.index + m[0].length + umfeld);
      out("  " + f.id + " :: …" + s.slice(von, bis).replace(/\\n/g, " ") + "…");
      if (treffer >= 120) { out("  … abgeschnitten bei 120 Fundstellen"); return; }
    }
  });
  out("");
  out(treffer + " Fundstelle(n) in " + fragen + " Frage(n)");
} else if (cmd === "zufall") {
  // ⚠️ SICHTBARE AUSNAHMELISTE - dieselbe Bauart wie beim Firmen-Waechter.
  //    Ein negatives Zwischenergebnis ist nicht immer ein Fehler: Eine Abweichung DARF negativ
  //    sein, wenn der Aufgabentext das Vorzeichen erklaert statt es zu unterstellen. Genau das
  //    war der Befund an M07-760 - nicht die negative Zahl, sondern das Wort davor.
  /** @type {Record<string, string>} */ const AUSNAHMEN = {
    "M07-760": "Soll-Ist-Abweichung darf negativ sein (Kostenunterschreitung); der Merksatz " +
               "erklaert das Vorzeichen seit 26.08. ausdruecklich."
  };
  const GRENZE = 20000;   // bis hierhin wird der Variablenraum VOLLSTAENDIG durchgerechnet
  const L = require(path.join(__dirname, "kern.js"));   // N34 T6a (E56): Rechenkern aus neu/src/kern/*.ts, nicht mehr logik.js
  const aufgaben = F.filter(f => f.typ === "rechenassistent" && f.variablen &&
                                 Array.isArray(f.schritte));
  let auff = 0, gesamtFaelle = 0;
  const meldungen = /** @type {any[]} */ ([]);

  aufgaben.forEach(f => {
    const namen = Object.keys(f.variablen);
    const stufen = namen.map(k => {
      const d = f.variablen[k];
      return Math.floor((d.max - d.min) / (d.schritt || 1) + 1e-9) + 1;
    });
    const raum = stufen.reduce((a, b) => a * b, 1);
    // Index-Kombinationen: vollstaendig, wenn der Raum klein ist - sonst alle Eckpunkte + Mitte.
    let kombis = /** @type {any[]} */ ([]);
    if (raum <= GRENZE) {
      const bau = /** @param {number} i @param {number[]} acc */ (i, acc) => {
        if (i === namen.length) { kombis.push(acc.slice()); return; }
        for (let v = 0; v < stufen[i]; v++) { acc.push(v); bau(i + 1, acc); acc.pop(); }
      };
      bau(0, []);
    } else {
      const kand = stufen.map(n => (n > 2 ? [0, Math.floor(n / 2), n - 1] : [0, n - 1]));
      const bau = /** @param {number} i @param {number[]} acc */ (i, acc) => {
        if (i === namen.length) { kombis.push(acc.slice()); return; }
        kand[i].forEach(v => { acc.push(v); bau(i + 1, acc); acc.pop(); });
      };
      bau(0, []);
    }
    gesamtFaelle += kombis.length;

    let schlecht = 0, bsp = /** @type {any} */ (null);
    kombis.forEach(idx => {
      let z = 0;
      // rng, die zieheWert genau auf den gewuenschten Index zwingt: floor(rng()*n) == idx
      const rng = () => { const i = z++; return (idx[i] + 0.5) / stufen[i]; };
      let r;
      try { r = L.rechneAufgabe(f, rng); } catch (e) { schlecht++; if (!bsp) bsp = "Ausnahme: " + /** @type {Error} */ (e).message; return; }
      const werte = r.schritte.map(/** @param {any} x */ x => x.wert).filter(/** @param {any} x */ x => x !== undefined);
      if (werte.some(/** @param {any} w */ w => !isFinite(w)) || werte.some(/** @param {any} w */ w => w < 0)) {
        schlecht++;
        if (!bsp) bsp = JSON.stringify(r.werte);
      }
    });

    if (schlecht) {
      const grund = AUSNAHMEN[f.id];
      const zeile = "   " + (grund ? "ausgenommen " : "FEHLER      ") + f.id +
        ": " + schlecht + " von " + kombis.length +
        (raum <= GRENZE ? " (vollstaendig)" : " (Eckpunkte von " + raum + ")") +
        "  " + (grund ? grund : bsp);
      meldungen.push(zeile);
      if (!grund) auff++;
    }
  });

  out("ZUFALLSAUFGABEN (rechenassistent): " + aufgaben.length +
      ", gepruefte Faelle: " + gesamtFaelle);
  meldungen.forEach(m => out(m));
  out("AUFFAELLIG: " + auff);
} else if (cmd === "zitate") {
  // ⚠️ KANDIDATENFILTER MIT BELEGLISTE, KEIN URTEIL UEBER DEN WORTLAUT.
  //    Das Muster findet Text in Anfuehrungszeichen in der Naehe einer Paragrafen- oder
  //    Artikelangabe. Ob der Wortlaut stimmt, kann kein Skript wissen - deshalb verlangt es
  //    einen EINTRAG mit Quelle und Datum in zitate_belegt.json. Wer ein neues Zitat schreibt,
  //    schlaegt es einmal nach und traegt es ein; alles andere meldet check.sh als FEHLER.
  const fs = /** @type {typeof import("fs")} */ (require("fs"));
  const cfgPfad = path.join(__dirname, "..", "zitate_belegt.json");
  const cfg = JSON.parse(fs.readFileSync(cfgPfad, "utf8"));
  const belegt = new Set((cfg.belegte_zitate || []).map(/** @param {any} z */ z => z.id));
  // ⚠️⚠️ WORTLAUT-PRUEFUNG (27.08.2026). Bis dahin genuegte die ID: Stand eine Frage in der Liste,
  //    galt ihr Zitat als belegt - fuer immer. GEMESSEN an diesem Tag: der Wortlaut von Art. 32
  //    DSGVO in M06-203 wurde zur Probe verfaelscht ("Unter Beachtung des jeweiligen Stands der
  //    Technik"), und diese Probe meldete weiter UNBELEGT: 0.
  //    ►►► Der Beleg galt der FRAGE, nicht dem geprueften Text. Damit war genau die Fundstelle
  //        blind, an der am 26.08. drei erfundene Zitate gefunden wurden.
  //    Das Feld `zitat_beginnt` stand seit dem 26.08. in der Datei und wurde nie gelesen -
  //    die Antwort lag vor, nur gefragt hat niemand.
  // ⚠️ Verglichen wird UMLAUT-UNEMPFINDLICH: die Belegdatei ist in ASCII-Umschrift gepflegt
  //    ("Beruecksichtigung"), der Pool traegt echte Umlaute. Ein naiver Vergleich meldete alle fuenf.
  const normZ = /** @param {string} t */ t => t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe")
    .replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
  const geaendert = (cfg.belegte_zitate || []).filter(/** @param {any} z */ z => {
    if (!z.zitat_beginnt) return false;
    const f = T.filter(x => x.id === z.id)[0];
    return f && !normZ(JSON.stringify(f)).includes(normZ(z.zitat_beginnt));
  }).map(/** @param {any} z */ z => z.id);
  const zitatMuster = /(Art\. ?[0-9]+|§ ?[0-9]+)[^']{0,150}'[^']{60,}'/;
  const treffer = T.filter(f => zitatMuster.test(JSON.stringify(f))).map(f => f.id);
  const unbelegt = treffer.filter(id => !belegt.has(id));
  const verwaist = [...belegt].filter(id => !treffer.includes(id));

  out("A) GESETZESZITATE IM POOL: " + treffer.length);
  out("   " + (treffer.join(", ") || "keine"));
  out("A) WORTLAUT GEAENDERT: " + geaendert.length);
  if (geaendert.length) out("   " + geaendert.join(", ") +
    "  -> der belegte Wortlaut steht nicht mehr in der Frage: neu nachschlagen und zitat_beginnt anpassen");
  out("A) UNBELEGT: " + unbelegt.length);
  if (unbelegt.length) out("   " + unbelegt.join(", ") +
    "  -> Wortlaut nachschlagen und in zitate_belegt.json eintragen");
  out("A) EINTRAEGE OHNE FUNDSTELLE: " + verwaist.length);
  if (verwaist.length) out("   " + verwaist.join(", ") +
    "  -> Zitat entfernt oder umgeschrieben? Eintrag pflegen.");

  let abTreffer = 0;
  out("");
  out("B) ABSATZANGABEN ZU VORSCHRIFTEN OHNE ABSAETZE:");
  (cfg.absatzlose_vorschriften || []).forEach(/** @param {any} v */ v => {
    const re = new RegExp(v.muster, "g");
    const ids = T.filter(f => re.test(JSON.stringify(f)) && (re.lastIndex = 0) === 0).map(f => f.id);
    abTreffer += ids.length;
    out("   " + (ids.length ? "FEHLER " : "ok     ") + v.vorschrift +
        " (" + v.beleg.split(" - ")[0] + "): " + ids.length +
        (ids.length ? "  -> " + ids.join(", ") : ""));
  });
  out("B) SUMME: " + abTreffer);
} else if (cmd === "begriffe") {
  // ══════════ FACHBEGRIFFE, DIE SCHON EINMAL GEGENSAETZLICH BENUTZT WURDEN (27.08.2026) ══════════
  // ⚠️ ANLASS: "Pay-per-Use" stand in M03-713/714 richtig und in M04-008/M04-120 genau umgekehrt.
  //    Erster Widerspruch UEBER MODULGRENZEN. Innerhalb eines Moduls faellt so etwas beim Lesen
  //    auf, ueber zwei Module hinweg nie - er wurde nur durch einen zufaelligen kontext-Aufruf
  //    gefunden.
  // ⛔⛔ DIESE PROBE MISST KEINE BEDEUTUNG. "Widerspricht" ist nicht mechanisch entscheidbar.
  //    Geprueft wird ausschliesslich: steht der Begriff im selben Textfenster neben einem Wort,
  //    das seiner Definition widerspricht? Das faengt den Pay-per-Use-Fall - und sonst nichts.
  //    ►► Ein Waechter, der vorgibt, Bedeutung zu pruefen, ist schlimmer als keiner: man verlaesst
  //       sich auf ihn und liest nicht mehr selbst.
  // ⚠️ Begriffe mit leerer Liste "verbotene_nachbarn" sind ABSICHTLICH nicht maschinell pruefbar
  //    (MAC hat drei richtige Bedeutungen). Sie stehen in der Datei, damit der Mensch sie kennt.
  const fs = /** @type {typeof import("fs")} */ (require("fs"));
  const bPfad = path.join(__dirname, "..", "begriffe_belegt.json");
  if (!fs.existsSync(bPfad)) { out("begriffe_belegt.json fehlt"); process.exit(1); }
  const bcfg = JSON.parse(fs.readFileSync(bPfad, "utf8"));
  let treffer = 0, geprueft = 0, nurDoku = 0;
  (bcfg.begriffe || []).forEach(/** @param {any} b */ b => {
    const nach = b.verbotene_nachbarn || [];
    if (!nach.length) { nurDoku++; out("   --     " + b.begriff + " (nur dokumentiert, nicht maschinell pruefbar)"); return; }
    geprueft++;
    // ⚠️ KEINE AUSNAHMELISTE JE FRAGE. Die erste Fassung nahm M04-008 und M04-120 pauschal aus -
    //    also genau die zwei Fragen, in denen der Fehler gesessen hatte. Dort haette der Waechter
    //    nie wieder anschlagen koennen. ►► Eine Ausnahme, die die Fundstelle des Fehlers
    //    stillstellt, ist kein Sonderfall, sondern ein blinder Fleck.
    //    Erkannt wird stattdessen der ABGRENZUNGSSATZ im selben Fenster.
    const entw = b.entwarnung || [];
    const fenster = b.fenster || 200;
    const ids = /** @type {any[]} */ ([]);
    T.forEach(f => {
      const t = JSON.stringify(f);
      let i = t.indexOf(b.begriff);
      while (i >= 0) {
        const um = t.slice(Math.max(0, i - fenster), i + b.begriff.length + fenster);
        // ⚠️ 31.08.2026: Hier stand kurzzeitig ein Sonderweg "harte Nachbarn", der die
        //    Entwarnung uebersteuerte. Er meldete prompt M04-008 und 04#453 - beides Stellen,
        //    die RICHTIG abgrenzen. Zurueckgebaut: der Waechter hatte kein Logik-, sondern
        //    ein Wortschatzproblem. Die Produktnamen stehen jetzt schlicht in der Nachbarliste.
        if (nach.some(/** @param {string} n */ n => um.indexOf(n) >= 0) && !entw.some(/** @param {string} e */ e => um.indexOf(e) >= 0)) { ids.push(f.id); break; }
        i = t.indexOf(b.begriff, i + 1);
      }
    });
    treffer += ids.length;
    out("   " + (ids.length ? "FEHLER " : "ok     ") + b.begriff +
        ": " + ids.length + (ids.length ? "  -> " + ids.join(", ") : "") +
        (entw.length ? "   (Abgrenzungssatz erkannt)" : ""));
  });
  out("SUMME: " + treffer + "   (" + geprueft + " maschinell geprueft, " + nurDoku + " nur dokumentiert)");
} else if (cmd === "svg" || cmd === "ueberlauf") {
  // ══════════ IST DIE GRAFIK ueberhaupt HEIL? (27.08.2026) ══════════
  // A) WOHLGEFORMTHEIT - EXAKT, keine Schaetzung. Ein Tag-Stapel ueber das Markup.
  // ⚠️ ANLASS: M06-120 endete mit "</text></rect></svg>" - ein schliessendes </rect> ohne
  //    oeffnendes Gegenstueck. Die Grafik laesst sich NICHT rendern ("mismatched tag").
  //    Gefunden wurde das nur, weil der Kontaktbogen an dieser Stelle rot "RENDERT NICHT"
  //    hinschrieb. Kein Waechter des Projekts hatte je das SVG-Markup angesehen: check.sh
  //    prueft die JS-Syntax der Dateien und das Pool-Schema, aber nie den Inhalt des svg-Feldes.
  //    ►► Eine kaputte Grafik ist kein Schoenheitsfehler. Sie erscheint dem Lerner gar nicht.
  const BEKANNT_LEER = ["br", "img", "hr", "input", "meta", "link", "use", "path", "circle",
                        "rect", "line", "polygon", "polyline", "ellipse", "stop", "image"];
  /** @param {string} svg */
  function wohlgeformt(svg) {
    const stapel = [];
    const re = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
    let m;
    while ((m = re.exec(svg))) {
      const zu = m[1] === "/", name = m[2].toLowerCase(), selbst = m[4] === "/";
      if (zu) {
        if (!stapel.length) return "schliessendes </" + name + "> ohne oeffnendes";
        const oben = stapel.pop();
        if (oben !== name) return "</" + name + "> schliesst <" + oben + ">";
      } else if (!selbst) {
        if (BEKANNT_LEER.indexOf(name) >= 0 && !/<\/\s*" + name + "/.test(svg)) continue;
        stapel.push(name);
      }
    }
    return stapel.length ? "nicht geschlossen: <" + stapel.join("> <") + ">" : "";
  }
  const alleSvg = (a1 ? B.filter(f => f.modul === String(a1).toUpperCase()) : B).filter(f => f.svg);
  const kaputt = /** @type {any[]} */ ([]);
  alleSvg.forEach(f => { const w = wohlgeformt(f.svg); if (w) kaputt.push(f.id + "   " + w); });
  out("SVGs geprueft: " + alleSvg.length + (a1 ? "  (Modul " + String(a1).toUpperCase() + ")" : ""));
  out("");
  out("A) NICHT WOHLGEFORMT (rendert nicht): " + kaputt.length);
  kaputt.forEach(k => out("   " + k));
  out("");

  // ══════════ C) ELEMENT AUSSERHALB DER ZEICHENFLAECHE ══════════
  // ⚠️ Das ist die Klasse von M04-119. Am 27.08. lief dafuer ein WEGWERF-SKRIPT ueber alle 96
  //    (0 Treffer) - und danach gab es keinen Waechter mehr. Am selben Abend habe ich beim
  //    Neuzeichnen von M03-019 einen Kasten 8 Einheiten ueber den rechten Rand geschoben, und
  //    NICHTS hat es gemeldet.
  //    ►► Eine Messung, die einmal lief, ist keine Pruefung. Sie ist ein Zeitpunkt.
  const raus = /** @type {any[]} */ ([]);
  alleSvg.forEach(f => {
    const vb = (f.svg.match(/viewBox=['"]\s*(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)/) || []);
    if (!vb.length) { raus.push(f.id + "   keine viewBox"); return; }
    const vx = +vb[1], vy = +vb[2], vw = +vb[3], vh = +vb[4];
    let m, re = /<(rect|circle|ellipse)\b([^>]*)>/g, schlimm = null;
    while ((m = re.exec(f.svg))) {
      const a = m[2], z = /** @param {string} n */ n => +((a.match(new RegExp(n + "=['\"](-?[\\d.]+)")) || [])[1]);
      let l, r, o, u;
      if (m[1] === "rect") { l = z("x"); o = z("y"); r = l + z("width"); u = o + z("height"); }
      else { const cx = z("cx"), cy = z("cy"), rx = z("rx") || z("r"), ry = z("ry") || z("r");
             l = cx - rx; r = cx + rx; o = cy - ry; u = cy + ry; }
      if ([l, r, o, u].some(isNaN)) continue;
      const weg = Math.max(vx - l, r - (vx + vw), vy - o, u - (vy + vh));
      if (weg > 0.5 && (!schlimm || weg > schlimm.weg)) schlimm = { weg: Math.round(weg), tag: m[1] };
    }
    if (schlimm) raus.push(f.id + "   <" + schlimm.tag + "> ragt " + schlimm.weg +
                           " Einheiten hinaus (viewBox " + vw + "x" + vh + ")");
  });
  out("C) ELEMENT AUSSERHALB DER ZEICHENFLAECHE: " + raus.length);
  raus.forEach(r => out("   " + r));
  out("");

  // ══════════ D) KLICKFLAECHE DECKT SICH NICHT MIT IHREM KASTEN ══════════
  // ⚠️ ANLASS - EIN EIGENER FEHLER, 27.08. abends: tools/svg_breiter.py hat sechs
  //    hotspot-Grafiken waagerecht gedehnt (M03-980/981/982, M04-999, M06-970/971), die
  //    `zonen` aber stehen lassen. Danach deckten die Klickflaechen nur noch die linken drei
  //    Viertel jedes Kastens ab.
  //    ►►► KEINE der bisherigen Pruefungen sieht das: Die Grafik ist wohlgeformt, liegt in der
  //        Flaeche, der Text passt - und die Aufgabe ist trotzdem kaputt. Ein Fehler, der erst
  //        beim Klicken auffaellt, also beim Lerner.
  // ⛔ EXAKT, KEINE SCHAETZUNG: Zu jeder Zone muss es ein <rect> geben, dessen Kanten auf
  //    2 Einheiten genau passen. Zonen ohne Kasten (freie Klickflaechen auf einer Zeichnung,
  //    etwa in einer Topologie) werden NICHT gemeldet - dort gibt es nichts zu vergleichen.
  const schief = /** @type {any[]} */ ([]);
  alleSvg.forEach(f => {
    if (f.typ !== "hotspot" || !Array.isArray(f.zonen)) return;
    const rects = /** @type {any[]} */ ([]);
    let m, re = /<rect\b[^>]*?x=['"](-?[\d.]+)['"][^>]*?y=['"](-?[\d.]+)['"][^>]*?width=['"]([\d.]+)['"][^>]*?height=['"]([\d.]+)['"]/g;
    while ((m = re.exec(f.svg))) rects.push({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] });
    f.zonen.forEach(/** @param {any} z @param {number} i */ (z, i) => {
      if (![z.x, z.y, z.w, z.h].every(v => typeof v === "number")) return;
      const nah = rects.filter(r => Math.abs(r.y - z.y) <= 2 && Math.abs(r.h - z.h) <= 2);
      if (!nah.length) return;                     // kein Kasten auf dieser Hoehe: freie Zone
      const passt = nah.some(r => Math.abs(r.x - z.x) <= 2 && Math.abs(r.w - z.w) <= 2);
      if (!passt) {
        const r = nah[0];
        schief.push(f.id + "   Zone " + (i + 1) + " x=" + z.x + " w=" + z.w +
                    "   Kasten x=" + r.x + " w=" + r.w);
      }
    });
  });
  out("D) KLICKFLAECHE DECKT SICH NICHT MIT IHREM KASTEN: " + schief.length);
  schief.forEach(x => out("   " + x));
  out("");

  // ══════════ TEXT LAEUFT AUS SEINEM KASTEN (27.08.2026) ══════════
  // ⚠️ ANLASS: Die drei kaputten Grafiken dieser Runde waren nur im GERENDERTEN Zustand sichtbar.
  //    Am 27.08. lief eine Probe auf "Element ausserhalb der viewBox" (der M04-119-Fehler) ueber
  //    alle 96 - 0 Treffer, Klasse ausgeschlossen. Beim Ansehen von M03 fanden sich dann FUENF
  //    Grafiken, in denen Text aus seinem Kasten laeuft: M03-054, M03-980, M03-981, M03-982,
  //    M03-992. Bei M03-982 fehlt links und rechts je ein Stueck des Textes.
  //    ►► Sie lagen INNERHALB der viewBox und ausserhalb ihres Rechtecks. Die erste Probe hat
  //       nach dem falschen Rand gesucht. Eine ausgeschlossene Klasse ist nur die Klasse, die
  //       man gemessen hat - nicht die, die man gemeint hat.
  // ⛔⛔ KANDIDATENFILTER, KEIN URTEIL. Die Textbreite wird GESCHAETZT (Zeichenzahl x Schriftgroesse
  //    x FAKTOR), weil eine Proportionalschrift ohne Rendern nicht exakt vermessbar ist. Breite
  //    Grossbuchstaben und schmale i/l verschieben das Ergebnis in beide Richtungen.
  //    ►► Jeder Treffer wird gerendert und angesehen: python3 tools/svg_bilder.py --id <ID>
  /* ⚠️ DER FAKTOR IST GEMESSEN, NICHT GERATEN (27.08. abends, an den Kontaktboegen):
       0.52  meldete M06-972 NICHT, obwohl der Text dort sichtbar beidseitig herauslaeuft
       0.54  meldet genau M06-972 - den einzigen Fall, der im Bild wirklich ueberlaeuft
       0.56  meldet zusaetzlich M03-982, das im Bild bequem passt -> Fehlalarm
       0.58  meldet 13, 0.60 meldet 26 - fast alles davon passt.
     Deshalb 0.54. ⚠️ Der Kontaktbogen rendert mit DejaVu Sans, der Browser des Lerners meist
     mit einer schmaleren Schrift - die Schaetzung ist also eher zu streng als zu lax. */
  const FAKTOR = +(a2 || 0.54);
  const LUFT = 2;                 // Toleranz in Nutzereinheiten
  const auswahl = a1 ? B.filter(f => f.modul === String(a1).toUpperCase()) : B;
  const mitSvg = auswahl.filter(f => f.svg);
  const treffer = /** @type {any[]} */ ([]);
  mitSvg.forEach(f => {
    const svg = f.svg;
    const grund = (svg.match(/<svg[^>]*font-size=['"](\d+(?:\.\d+)?)/) || [])[1];
      /* ⚠️ DIE ERSTE FASSUNG LAS DIE CSS-KLASSEN NICHT und meldete deshalb M03-019 (dreimal)
         und M03-483 als Ueberlauf. Ohne die Regel `.label { text-anchor: middle }` wurde der
         Ankerpunkt als LINKE Kante gelesen, und jede zentrierte Beschriftung lief scheinbar
         nach rechts heraus. Vier Fehlalarme aus einer Annahme ueber die Formatierung.
         ►► Umgekehrt hat derselbe Filter eine Fehlmeldung von mir korrigiert: M03-992 sah beim
            Ansehen zu eng aus, passt aber ("Cat 6a UTP" braucht 57 von 65). */
      /** @type {Record<string, any>} */ var klassen = {};
      var stil = (svg.match(/<style[^>]*>([\s\S]*?)<\/style>/) || [])[1] || "";
      stil.replace(/\.([\w-]+)\s*\{([^}]*)\}/g, /** @param {string} _ @param {string} name @param {string} rumpf */ function (_, name, rumpf) {
        klassen[name] = {
          gr: (rumpf.match(/font-size\s*:\s*(\d+(?:\.\d+)?)/) || [])[1],
          anker: (rumpf.match(/text-anchor\s*:\s*([\w-]+)/) || [])[1]
        };
        return "";
      });
    const vb2 = (svg.match(/viewBox=['"]\s*(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)/) || []);
    const vbX = +(vb2[1] || 0), vbW = +(vb2[3] || 1e9);
    const kaesten = [];
    let m, reRect = /<rect[^>]*?x=['"](-?[\d.]+)['"][^>]*?y=['"](-?[\d.]+)['"][^>]*?width=['"]([\d.]+)['"][^>]*?height=['"]([\d.]+)['"]/g;
    while ((m = reRect.exec(svg))) kaesten.push({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] });
    const reText = /<text([^>]*)>([^<]*)<\/text>/g;
    while ((m = reText.exec(svg))) {
      const attr = m[1], inhalt = m[2].trim();
      if (!inhalt) continue;
      /* ⛔ GEDREHTE TEXTE UEBERSPRINGEN. Bei transform='rotate(-90 ...)' ist x der Drehpunkt,
         nicht der Textanfang - die waagerechte Schaetzung ist dort sinnlos. Sie meldete prompt
         "Stromverbrauch (Watt)" in M03-118 und "Preis (EUR)" in M02-117: beides senkrechte
         Achsenbeschriftungen, beide voellig in Ordnung. Zwei Fehlalarme aus einer Annahme
         ueber die Schreibrichtung. */
      if (/transform=/.test(attr)) continue;
      const tx = +((attr.match(/x=['"](-?[\d.]+)/) || [])[1]);
      const ty = +((attr.match(/y=['"](-?[\d.]+)/) || [])[1]);
      if (isNaN(tx) || isNaN(ty)) continue;
      var kl = klassen[(attr.match(/class=['"]([\w-]+)/) || [])[1]] || {};
      const gr = +((attr.match(/font-size=['"](\d+(?:\.\d+)?)/) || [])[1] || kl.gr || grund || 16);
      const anker = (attr.match(/text-anchor=['"](\w+)/) || [])[1] || kl.anker || "start";
      const breite = inhalt.length * gr * FAKTOR;
      const links = anker === "middle" ? tx - breite / 2 : anker === "end" ? tx - breite : tx;
      const rechts = links + breite;
      // umschliessender Kasten = der kleinste, der den Ankerpunkt enthaelt
      let k = /** @type {any} */ (null);
      kaesten.forEach(r => {
        if (tx >= r.x && tx <= r.x + r.w && ty >= r.y && ty <= r.y + r.h)
          if (!k || r.w * r.h < k.w * k.h) k = r;
      });
      /* ⛔ GRENZE DIESER PROBE: Text OHNE umschliessenden Kasten wird gar nicht geprueft -
         Ueberschriften, Achsenbeschriftungen und Etiketten an Pfeilen. Genau dort ist mir am
         27.08. beim Neuzeichnen von M06-120 ein Etikett in die Nachbarkaesten gelaufen
         ("RSA, oeffentlicher Schluessel" ueber einer 60 Einheiten breiten Luecke), und diese
         Probe schwieg dazu. Eine Kollisionspruefung gegen NACHBARkaesten waere moeglich,
         wuerde aber jede absichtlich ueberlappende Beschriftung melden.
         ►► Wer eine Grafik aendert, sieht sie an. Der Filter sortiert vor, er ersetzt nicht. */
      if (!k) {
        /* ⚠️ NACHGESCHAERFT 27.08. ABENDS: Erst stand hier nur "continue" - Text ohne Kasten
           wurde gar nicht geprueft. Das hat SOFORT etwas gekostet: In M01-991 stand die
           Kopfzeile "Vorgang Serverkonfiguration: FAZ=8, Dauer=6, GP=3" mittig in einer nur
           260 Einheiten breiten Flaeche und lief BEIDSEITIG heraus - dem Lerner fehlte damit
           "GP=3", also genau die Angabe, ohne die SAZ nicht zu berechnen ist. Kein
           Schoenheitsfehler, sondern eine unloesbare Aufgabe.
           ►► Gegen die viewBox laesst sich auch ohne Kasten pruefen: was darueber hinausragt,
              ist abgeschnitten. Ueberschriften und Achsentitel bleiben unauffaellig, solange
              sie in der Flaeche stehen. */
        const b = links < vbX ? vbX - links : rechts > vbX + vbW ? rechts - (vbX + vbW) : 0;
        if (b >= 3)
          treffer.push({ id: f.id, ueber: Math.round(b), kasten: Math.round(vbW),
                         gebraucht: Math.round(breite), text: inhalt.slice(0, 46),
                         wo: "die Zeichenflaeche" });
        continue;
      }
      const ueber = Math.max(k.x + LUFT - links, rechts - (k.x + k.w - LUFT));
      /* ⚠️ ERST AB 3 EINHEITEN MELDEN. Bei +0 und +1 liegt der Ausschlag unter dem Fehler der
         Schaetzung selbst - M01-992 ("D - 2 Tage", 57 von 60) und M02-117 ("Start") standen so
         in der Liste und waren beide in Ordnung. Ein Filter, der seinen eigenen Messfehler
         meldet, kostet Lesezeit ohne Ertrag. */
      if (ueber >= 3)
        treffer.push({ id: f.id, ueber: Math.round(ueber), kasten: Math.round(k.w),
                       gebraucht: Math.round(breite), text: inhalt.slice(0, 46) });
    }
  });
  treffer.sort((a, b) => b.ueber - a.ueber);
  out("   (Breitenfaktor " + FAKTOR + ")");
  out("B) TEXT LAEUFT AUS SEINEM KASTEN: " + treffer.length);
  treffer.forEach(t => out("   " + t.id + "   +" + String(t.ueber).padStart(3) +
      " ueber " + (t.wo || "den Kasten") + " (" + t.kasten + "), gebraucht ~" + t.gebraucht + "   \"" + t.text + "\""));
  out("");
  out("\u26a0 Geschaetzte Breite - Kandidatenfilter, kein Urteil.");
  out("  Ansehen: python3 tools/svg_bilder.py --id <ID>");

} else if (cmd === "verrat") {
  // ══════════ DIE LOESUNG STEHT IM AUFGABENTEXT (27.08.2026) ══════════
  // ⚠️ ANLASS: Beim Lesen der 45 Fall-Teilaufgaben zweimal derselbe Griff. FALL-01 b) nannte die
  //    Attribute "KundenID (Primaerschluessel), Name, E-Mail" und fragte danach, was KundenID
  //    sei. FALL-03 d) schrieb "eine ___ Sicherung (alle Aenderungen seit letzter VOLLsicherung)"
  //    - der Klammerzusatz IST die Definition von differentiell. Beides Schwierigkeit 3.
  //    ►► Eine Aufgabe, die ihre eigene Loesung nennt, misst nichts. Sie sieht nur so aus.
  // ⛔⛔ KANDIDATENFILTER, KEIN URTEIL - wie firmen, laengen und verweise. Dasselbe Wort im
  //    Aufgabentext kann voellig in Ordnung sein: M07-304 nennt "Abnahme" im Sachverhalt und
  //    fragt in der Luecke nach etwas anderem. JEDER Treffer wird einzeln gelesen.
  // ⛔ GRENZE: GEPRUEFT WIRD NUR DER FRAGETEXT, NICHT DAS BILD. Bei M08-335 steht die Loesung
  //    "Abteilung B" im Handelsregister-Auszug der Grafik - und das ist RICHTIG SO, die Aufgabe
  //    heisst "Lies den Auszug". Wuerde die Probe das svg-Feld mitlesen, meldete sie jede
  //    Dokument-Leseaufgabe. Wo eine Grafik eine ZEICHNUNG ist und die Loesung trotzdem
  //    danebensteht, faellt das nur beim Ansehen auf (tools/svg_bilder.py).
  // ⚠️ NUR DROPDOWN. Bei mc ist die richtige Antwort ein ganzer Satz; ein Wort daraus im
  //    Aufgabentext sagt nichts. Bei dropdown ist die Loesung EIN Begriff - nur dort traegt die
  //    Messung. Wer sie auf mc ausdehnt, bekommt Rauschen statt Kandidaten.
  const MIN = +(a2 || 6);   // kuerzere Loesungswoerter ("Lage", "2") sind zu haeufig
  const saubere = /** @param {any} x */ x => String(x).toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "");
  const auswahl = a1 ? B.filter(f => f.modul === String(a1).toUpperCase()) : B;
  const treffer = /** @type {any[]} */ ([]);
  auswahl.forEach(f => {
    if (f.typ !== "dropdown" || !Array.isArray(f.luecken)) return;
    const text = saubere(f.frage || "");
    f.luecken.forEach(/** @param {any} l @param {number} j */ (l, j) => {
      const r = l.optionen && l.optionen[l.loesung];
      if (!r) return;
      const k = saubere(r);
      if (k.length >= MIN && text.indexOf(k) >= 0)
        treffer.push({ id: f.id, luecke: j + 1, wort: r, modul: f.modul });
    });
  });
  out("dropdown-Luecken geprueft in " + auswahl.filter(f => f.typ === "dropdown").length +
      " Fragen" + (a1 ? "  (Modul " + String(a1).toUpperCase() + ")" : "") +
      "   Mindestlaenge des Loesungsworts: " + MIN);
  out("");
  out("LOESUNGSWORT STEHT WOERTLICH IM AUFGABENTEXT: " + treffer.length);
  treffer.forEach(t => out("   " + t.id + "  L" + t.luecke + "  \"" + t.wort + "\""));
  out("");
  out("\u26a0 Kandidatenfilter, kein Urteil - jeden Treffer einzeln lesen.");

} else if (cmd === "antworttell") {
  // ══════════ DIE ANTWORTEN VERRATEN SICH (K3-E66, 24.11.2026) ══════════
  // ⚠️ ANLASS: Lerner-Meldung 14 (M05-401 nennt „(Plan-Do-Check-Act)“ und fragt nach den Phasen) und 17 (M03-909:
  //    „die falschen Antwortmoeglichkeiten sind zu eindeutig falsch“). `verrat` sieht nur dropdown – hier mc/mehrfach/szenario2.
  // ⛔ KANDIDATENFILTER, KEIN URTEIL, wie verrat. Gemessen beim Bau (K3-Set, 164 Auswahlstellen): A 5 Treffer, alle gelesen,
  //    0 zum Umformulieren (die falschen Antworten greifen dieselben Angaben auf); B im ganzen Pool 1 = M05-401 (echt);
  //    D 24, Stichprobe M04-570 Fehlalarm. Verworfen: Absolutwoerter in falschen Antworten (60 von 164 – Rauschen).
  const L = require("./kern.js");
  const fs = /** @type {typeof import("fs")} */ (require("fs"));
  const nurK3 = a1 === "k3";
  const k3 = new Set(nurK3 ? JSON.parse(fs.readFileSync(path.join(__dirname, "..", "pool", "sets", "klausur_k3.json"), "utf8"))
    .themen.flatMap(/** @param {any} t */ t => t.ids) : []);
  const STOP = new Set(("der die das ein eine einer eines einem einen und oder ist sind wird werden mit von zu im in am an auf fuer fur " +
    "bei den dem des als auch nicht nur sich es er sie wie was wer welche welcher welches dass da so nach aus vor durch ueber unter " +
    "bzw usw kann koennen muss muessen hat haben wenn dann man jede jeder alle").split(" "));
  const woerter = /** @param {any} t */ t => new Set(String(L.normFreitext(t)).split(" ")
    .filter(x => x.length >= 5 && !STOP.has(x)).map(x => x.slice(0, Math.max(5, x.length - 2))));
  /** @param {any} f @returns {Array<[string, string[], number[], string]>} */
  const stellen = f => {
    if (f.typ === "mc") return [[f.frage, f.optionen, [f.loesungIndex], ""]];
    if (f.typ === "mehrfach") return [[f.frage, f.optionen, f.loesungIndizes, ""]];
    if (f.typ === "szenario2") return ["schritt1", "schritt2"].filter(k => f[k])
      .map(k => /** @type {[string, string[], number[], string]} */ ([f.frage + " " + f[k].frage, f[k].optionen, [f[k].loesungIndex], k === "schritt1" ? " S1" : " S2"]));
    return [];
  };
  const A = /** @type {string[]} */ ([]), KL = /** @type {string[]} */ ([]), D = /** @type {string[]} */ ([]);
  let n = 0;
  F.filter(f => !nurK3 || k3.has(f.id)).forEach(f => stellen(f).forEach(([frage, opt, ok, wo]) => {
    if (!Array.isArray(opt) || !Array.isArray(ok) || opt.length < 2) return;
    n++;
    const Q = woerter(frage);
    const ov = opt.map(o => [...woerter(o)].filter(x => Q.has(x)).length);
    const falsch = opt.map((_, i) => i).filter(i => !ok.includes(i));
    const rOv = Math.min(...ok.map(i => ov[i])), fOv = Math.max(...falsch.map(i => ov[i]));
    if (rOv >= 2 && rOv >= fOv + 2) A.push(f.id + wo + "  (" + rOv + " gegen " + fOv + ")");
    const kl = [...String(f.frage).matchAll(/\(([^)]{3,80})\)/g)].map(m => m[1]).join(" ");
    if (kl) {
      const T = new Set(String(L.normFreitext(kl)).split(" ").filter(x => x.length >= 2));
      const kopf = /** @param {string} o */ o => String(L.normFreitext(o.split(/[–:-]/)[0])).split(" ")[0] || "";
      if (ok.filter(i => T.has(kopf(opt[i]))).length >= 2 && !falsch.some(i => T.has(kopf(opt[i])))) KL.push(f.id + wo);
    }
    const R = new Set(ok.flatMap(i => [...woerter(opt[i])]));
    if (ok.every(i => ov[i] >= 1) && falsch.some(i => [...woerter(opt[i])].every(x => !Q.has(x) && !R.has(x)))) D.push(f.id + wo);
  }));
  out("Auswahlstellen geprueft: " + n + (nurK3 ? "  (Set klausur_k3)" : ""));
  out("");
  out("A) ECHO - RICHTIGE ANTWORT WIEDERHOLT DEN FRAGETEXT: " + A.length);
  A.forEach(x => out("   " + x));
  out("B) KLAMMER - FRAGETEXT NENNT DIE RICHTIGEN ANTWORTEN: " + KL.length);
  KL.forEach(x => out("   " + x));
  out("D) THEMENFREMDE FALSCHE ANTWORT: " + D.length);
  D.forEach(x => out("   " + x));
  out("");
  out("\u26a0 Kandidatenfilter, kein Urteil - jeden Treffer einzeln lesen; Fragetext umformulieren, nie die Antwort aendern.");

} else if (cmd === "abdeckung") {
  // ══════════ WELCHE PRUEFUNG LIEST WELCHEN INHALTSTRAEGER (27.08.2026) ══════════
  // ⚠️ ANLASS: An einem Tag FUENFMAL derselbe Fehler - eine Pruefung meldet gruen ueber ein
  //    Gebiet, das sie nicht betritt. Der ausfuehrliche Anlass steht in inhaltstraeger.json.
  // ⛔ 'gelesen' ist hier eine PRUEFBARE BEHAUPTUNG. Diese Probe zaehlt nach, ob der Bestand,
  //    den die Pruefung laut Matrix liest, tatsaechlich Eintraege mit dem id_muster des
  //    Traegers enthaelt. Wer eine Zelle auf 'gelesen' setzt, ohne den Lader zu aendern,
  //    bekommt einen Fehler - genau der Fall, der bei faelle.js monatelang unbemerkt blieb.
  // ⚠️ GEPRUEFT WIRD ABDECKUNG, NICHT QUALITAET. Dass eine Pruefung einen Traeger liest, sagt
  //    nichts darueber, ob sie darin das Richtige sucht.
  const fs = /** @type {typeof import("fs")} */ (require("fs"));
  const mPfad = path.join(__dirname, "..", "inhaltstraeger.json");
  if (!fs.existsSync(mPfad)) { out("FEHLER inhaltstraeger.json fehlt"); process.exit(1); }
  const M = JSON.parse(fs.readFileSync(mPfad, "utf8"));
  /** @type {Record<string, any[]>} */ const BESTAND = { F: F, B: B, T: T };
  let fehler = 0;

  // 1) Jede Zelle muss ausgefuellt sein.
  const luecken = /** @type {any[]} */ ([]);
  M.traeger.forEach(/** @param {any} tr */ tr => {
    const zeile = M.matrix[tr.name] || {};
    Object.keys(M.pruefungen).forEach(pr => {
      const z = zeile[pr];
      if (!z || !String(z).trim()) luecken.push(tr.name + " x " + pr);
    });
  });
  out("A) UNAUSGEFUELLTE ZELLEN: " + luecken.length +
      (luecken.length ? "   -> " + luecken.join(", ") : ""));
  fehler += luecken.length;

  // 2) Jedes 'gelesen' wird nachgezaehlt.
  const falsch = /** @type {any[]} */ ([]);
  M.traeger.forEach(/** @param {any} tr */ tr => {
    if (!tr.id_muster) return;                       // Traeger ohne eigene IDs im Bestand
    const re = new RegExp(tr.id_muster);
    Object.keys(M.pruefungen).forEach(pr => {
      if (String((M.matrix[tr.name] || {})[pr]) !== "gelesen") return;
      const best = BESTAND[M.pruefungen[pr]] || [];
      const n = best.filter(/** @param {any} x */ x => re.test(String(x.id))).length;
      out("   " + (n ? "ok    " : "FEHLER") + " " + pr.padEnd(9) + " liest " +
          tr.name.padEnd(16) + " (" + M.pruefungen[pr] + "): " + n + " Eintraege");
      if (!n) falsch.push(pr + " behauptet " + tr.name + " zu lesen, findet aber 0 Eintraege");
    });
  });
  out("B) BEHAUPTET, ABER NICHT GELESEN: " + falsch.length);
  falsch.forEach(f => out("   " + f));
  fehler += falsch.length;

  out("SUMME: " + fehler);
  if (fehler) process.exit(1);

} else if (!cmd) {
  /* ⚠️ 2026-09-10: START_PROMPT Abschnitt 8 schreibt vor „VOR JEDEM MESSSKRIPT: pool_query.js
     OHNE ARGUMENT AUFRUFEN". Bis heute kam darauf genau eine Zeile („Unbekanntes Kommando")
     und Rueckgabewert 1 - die Doku nannte einen Aufruf, den das Werkzeug nicht kannte.
     Gemessen am 10.09. beim Vorablauf einer Messrunde.
     ⛔ DIE LISTE WIRD NICHT ABGETIPPT, sondern aus dem EIGENEN Kopf gelesen (alles zwischen
     „Kommandos:" und dem schliessenden Kommentarende). Zwei Listen fuer dieselbe Sache
     driften immer - dieselbe Lehre wie „diese Liste ist die einzige" in START_PROMPT 7. */
  const kopf = require("fs").readFileSync(__filename, "utf8").split(/\r?\n/);
  const von = kopf.findIndex(z => /^\s*Kommandos:\s*$/.test(z));
  const bis = kopf.findIndex(z => /^\s*\*\/\s*$/.test(z));
  out("Aufruf im Training-Ordner:  node tools/pool_query.js <kommando> [arg]");
  if (von >= 0 && bis > von) kopf.slice(von, bis).forEach(z => out(z.replace(/^ {3}/, "")));
  else out("⚠️ Kopfblock nicht gefunden - Kommandoliste steht im Kopf dieser Datei.");
  process.exit(0);

} else {
  out("Unbekanntes Kommando. Siehe Kopf der Datei."); process.exit(1);
}
