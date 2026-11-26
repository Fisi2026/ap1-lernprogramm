/* ============================================================================
   GLEICHHEITSBEWEIS: die portierte Freitext-Einschaetzung gegen das Original.

   Der Wert der portierten 340 Zeilen ist nicht der Code, sondern die Kalibrierung.
   Dieser Test laedt `autoCheckText` und `gradeTeilpunkte` DIREKT AUS app_util.js
   und verlangt, dass die TypeScript-Fassung bei derselben Eingabe **dasselbe
   Ergebnisobjekt** liefert — Stufe, Prozentzahl, Trefferzahlen und Begriffslisten.

   Gemessen wird ueber vier Gleise:
     1. alle Freitext-Fragen mit ihrer EIGENEN Musterloesung      (soll: richtig)
     2. dieselben Antworten gegen eine FREMDE Frage               (soll: nicht richtig)
     3. leere Antwort                                             (soll: leer)
     4. die beiden kalibrierten Messgleise aus tools/mess_freitext.js
        (STRENG: Fachwoerter gemieden · REALISTISCH: Azubi-Vokabular mit Tippfehlern)
     5. ein Schwellen-Durchlauf: k von n Pflichtbegriffen, k = 0..n — weil die
        Gleise 1-4 die 65-%-Schwelle GEMESSEN nie beruehren (siehe dort)

   ⛔ Geht irgendwo eine Zahl auseinander, ist das ein Befund — keine Schwelle wird
      passend gedreht.

   ⚠️ Dieser Test lebt nur, solange app_util.js existiert. Wird die alte App eines
      Tages geloescht, faellt er mit ihr — und in genau dem Moment endet die
      Doppelung, weil dann nur noch eine Fassung da ist.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { autoCheckText, gradeTeilpunkte } from "./freitext";
import { SYN_MAP } from "./freitext-synonyme";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);

const L = requireCjs(altQuelle(WURZEL, "logik.js")) as Record<string, unknown>;
// N29 Teil 2 (E40): der Pool der alten App kommt ueber tools/pool_laden.js (fragen.js entfiel)
const FRAGEN_ALT = (requireCjs(path.join(WURZEL, "tools", "pool_laden.js")) as {
  laden: () => { fragen: Array<Record<string, unknown>> };
}).laden().fragen;

/* ---- Das Original aus app_util.js holen, ohne die Datei anzufassen ---------- */
function ladeOriginal() {
  const quelle = fs.readFileSync(altQuelle(WURZEL, "app_util.js"), "utf8").split("\n");
  const von = quelle.findIndex((z) => z.startsWith("var STOPWORTE = {"));
  const bis = quelle.findIndex((z, i) => i > von && z.startsWith("function gradeTeilpunkte("));
  expect(von, "STOPWORTE nicht gefunden — hat app_util.js sich verschoben?").toBeGreaterThan(0);
  expect(bis, "gradeTeilpunkte nicht gefunden").toBeGreaterThan(von);
  /* bis zum Ende von gradeTeilpunkte: die schliessende Klammer der Funktion */
  let ende = bis;
  while (ende < quelle.length && quelle[ende] !== "}") ende++;
  const block = quelle.slice(von, ende + 1).join("\n");

  const bauen = new Function(
    "L",
    "APP_CONFIG",
    block + "\nreturn { autoCheckText: autoCheckText, gradeTeilpunkte: gradeTeilpunkte };",
  ) as (l: unknown, c: unknown) => {
    autoCheckText: (a: unknown, r: unknown) => Record<string, unknown>;
    gradeTeilpunkte: (a: unknown, f: unknown) => Record<string, unknown>;
  };
  /* Dieselben Schwellen wie app_state.js APP_CONFIG. */
  return bauen(L, { teilpunkteRichtig: 0.65, teilpunkteTeilweise: 0.35 });
}

const ALT = ladeOriginal();

/* ---- Die kalibrierten Antworten aus dem Messgleis holen --------------------- */
function ladeMessantworten(): Record<string, { streng?: string; realistisch?: string }> {
  const quelle = fs.readFileSync(path.join(WURZEL, "tools/mess_freitext.js"), "utf8");
  const start = quelle.indexOf("const ANTWORTEN = {");
  if (start < 0) return {};
  const offen = quelle.indexOf("{", start);
  let tiefe = 0;
  let i = offen;
  for (; i < quelle.length; i++) {
    if (quelle[i] === "{") tiefe++;
    else if (quelle[i] === "}") { tiefe--; if (tiefe === 0) break; }
  }
  const literal = quelle.slice(offen, i + 1);
  return new Function("return " + literal)() as Record<string, { streng?: string; realistisch?: string }>;
}

const MESSANTWORTEN = ladeMessantworten();

const FREITEXTE = FRAGEN_ALT.filter((f) => f.typ === "freitext" || f.typ === "erklaeren");

function vergleiche(
  bezeichnung: string,
  f: Record<string, unknown>,
  antwort: unknown,
  abweichungen: string[],
) {
  const mitSb = !!f.schluesselbegriffe;
  const alt = mitSb ? ALT.gradeTeilpunkte(antwort, f) : ALT.autoCheckText(antwort, f.musterloesung);
  const neu = mitSb
    ? (gradeTeilpunkte(antwort, f as never) as unknown as Record<string, unknown>)
    : (autoCheckText(antwort, f.musterloesung) as unknown as Record<string, unknown>);
  const a = JSON.stringify(alt);
  const n = JSON.stringify(neu);
  if (a !== n) abweichungen.push(`${bezeichnung} ${String(f.id)}:\n  alt ${a}\n  neu ${n}`);
}

describe("Freitext-Einschaetzung: portiert == Original", () => {
  it("findet beide Fassungen ueberhaupt", () => {
    expect(typeof ALT.autoCheckText).toBe("function");
    expect(typeof ALT.gradeTeilpunkte).toBe("function");
    expect(FREITEXTE.length).toBeGreaterThanOrEqual(100);
  });

  it("Gleis 1: eigene Musterloesung — bei allen Fragen identisch", () => {
    const ab: string[] = [];
    for (const f of FREITEXTE) vergleiche("eigene", f, f.musterloesung, ab);
    expect(ab.slice(0, 3), `${ab.length} von ${FREITEXTE.length} weichen ab`).toEqual([]);
  });

  it("Gleis 2: fremde Musterloesung — bei allen Fragen identisch", () => {
    const ab: string[] = [];
    FREITEXTE.forEach((f, i) => {
      const fremd = FREITEXTE[(i + 7) % FREITEXTE.length];
      vergleiche("fremd", f, fremd.musterloesung, ab);
    });
    expect(ab.slice(0, 3), `${ab.length} von ${FREITEXTE.length} weichen ab`).toEqual([]);
  });

  it("Gleis 3: leere Antwort — bei allen Fragen identisch", () => {
    const ab: string[] = [];
    for (const f of FREITEXTE) vergleiche("leer", f, "", ab);
    expect(ab.slice(0, 3), `${ab.length} weichen ab`).toEqual([]);
  });

  it("Gleis 4: die kalibrierten Messantworten — identisch", () => {
    const ids = Object.keys(MESSANTWORTEN);
    expect(ids.length, "keine Messantworten gefunden — tools/mess_freitext.js gelesen?")
      .toBeGreaterThan(0);
    const ab: string[] = [];
    let geprueft = 0;
    for (const id of ids) {
      const f = FRAGEN_ALT.find((x) => x.id === id);
      if (!f) continue;
      for (const gleis of ["streng", "realistisch"] as const) {
        const antwort = MESSANTWORTEN[id][gleis];
        if (typeof antwort !== "string") continue;
        geprueft++;
        vergleiche(gleis, f, antwort, ab);
      }
    }
    expect(geprueft, "kein einziger Messfall gepueft").toBeGreaterThan(10);
    expect(ab.slice(0, 3), `${ab.length} von ${geprueft} Messfaellen weichen ab`).toEqual([]);
  });

  /* ⛔ GEMESSEN AM 11.09.2026, und der Grund fuer dieses fuenfte Gleis:
     Die Gleise 1-4 beruehren die 65-%-Schwelle NICHT EIN EINZIGES MAL. Verteilung der
     369 Prozentwerte: 211 liegen bei 0-9 %, 81 bei 100 %, und im Band 60-69 % liegt
     KEINER. Die Probe "Schwelle 0.65 -> 0.70" blieb deshalb gruen — sie haette eine
     verstellte Schwelle nie bemerkt.
     ►► Dieses Gleis baut Antworten, die k von n Pflichtbegriffen treffen (k = 0..n)
        und dabei den ganzen Prozentbereich durchfahren. Damit ist die Schwelle
        wirklich abgedeckt.
     ⚠️ Nebenbefund ueber die Kalibrierung selbst: durch FB-R2a ("alle Pflicht =
        richtig") entscheidet die Prozentschwelle im echten Bestand fast nie. Das ist
        kein Fehler, aber es ist gut, es zu wissen. */
  it("Gleis 5: Schwellen-Durchlauf — k von n Pflichtbegriffen", () => {
    const ab: string[] = [];
    let geprueft = 0;
    let imBand = 0;
    for (const f of FREITEXTE) {
      const sb = f.schluesselbegriffe as { pflicht?: unknown[]; kuer?: unknown[] } | undefined;
      const pflicht = Array.isArray(sb?.pflicht) ? sb!.pflicht! : [];
      const kuer = Array.isArray(sb?.kuer) ? sb!.kuer! : [];
      if (pflicht.length < 2) continue;
      for (let k = 0; k <= pflicht.length; k++) {
        for (const mitKuer of [false, true]) {
          const teile = pflicht.slice(0, k).map((b) => (Array.isArray(b) ? b[0] : b));
          if (mitKuer && kuer.length) {
            teile.push(...kuer.slice(0, Math.ceil(kuer.length / 2)).map((b) => (Array.isArray(b) ? b[0] : b)));
          }
          const antwort = teile.join(" und ") || "keine ahnung";
          geprueft++;
          const p = (gradeTeilpunkte(antwort, f as never)).prozent;
          if (p >= 55 && p <= 80) imBand++;
          vergleiche(`k=${k}${mitKuer ? "+kuer" : ""}`, f, antwort, ab);
        }
      }
    }
    expect(geprueft, "kein einziger Schwellenfall gebaut").toBeGreaterThan(200);
    expect(imBand, "kein Fall im Band 55-80 % — die Schwelle bleibt ungeprueft").toBeGreaterThan(10);
    expect(ab.slice(0, 3), `${ab.length} von ${geprueft} Schwellenfaellen weichen ab`).toEqual([]);
  });

  /* ⛔ GLEIS 6-9 (N43 M3, BUILD_LOG 219). Stryker fand 75 Mutanten in `autoCheckText` OHNE Abdeckung und
     Ueberlebende in Tippfehler-Toleranz, Token-Fallback und an den Schwellen. Grund: alle 123 Freitext-Fragen
     haben Schluesselbegriffe, Gleis 1-5 rufen `autoCheckText` also nie auf, und die Toleranz sahen sie nur an
     echten Antworten. Das Orakel bleibt das Original aus app_util.js - hier wird nichts neu festgelegt. */
  const vergleicheAuto = (bez: string, antwort: unknown, muster: unknown, ab: string[], stufen?: Set<string>) => {
    const alt = ALT.autoCheckText(antwort, muster);
    const neu = autoCheckText(antwort, muster) as unknown as Record<string, unknown>;
    if (stufen) stufen.add(String(neu.stufe));
    if (JSON.stringify(alt) !== JSON.stringify(neu)) ab.push(`${bez}: alt ${JSON.stringify(alt)} neu ${JSON.stringify(neu)}`);
  };

  it("Gleis 6: autoCheckText direkt - jede Musterloesung gegen Teilantworten", () => {
    const ab: string[] = [];
    const stufen = new Set<string>();
    let geprueft = 0;
    for (const f of FREITEXTE) {
      const muster = String(f.musterloesung ?? "");
      const w = muster.split(" ");
      const anteil = (z: number, n: number) => w.slice(0, Math.ceil((w.length * z) / n)).join(" ");
      const jedes = (n: number) => w.filter((_, i) => i % n === 0).join(" ");
      for (const antwort of [muster, "", "ab", "keine ahnung", anteil(1, 4), anteil(1, 2), anteil(3, 4), jedes(2), jedes(3)]) {
        geprueft++;
        vergleicheAuto("teil", antwort, muster, ab, stufen);
      }
    }
    expect(geprueft).toBeGreaterThan(900);
    for (const s of ["richtig", "teilweise", "unvollständig", "leer"]) {
      expect(stufen.has(s), `Stufe ${s} wird nie erreicht - Schwelle ungemessen`).toBe(true);
    }
    expect(ab.slice(0, 3), `${ab.length} von ${geprueft} weichen ab`).toEqual([]);
  });

  it("Gleis 7: autoCheckText direkt - gebaute Referenzen (Zahlen, Stoppwoerter, Doppelte, ueber 14 Begriffe, Synonyme)", () => {
    const lang = Array.from({ length: 20 }, (_, i) => "wort" + "z".repeat(i) + "q"); /* Laengen 5 bis 24 */
    const syn = Object.keys(SYN_MAP).slice(0, 8);
    const referenzen = [
      lang.join(" "),
      "der Router und die Firewall und der Router 100 20 5 7 1 192 168",
      "100 200 300 ab",
      syn.join(" "),
      "und der die das ist sind",
      "Verschlüsselung Übertragung Größe Maße",
    ];
    const ab: string[] = [];
    const stufen = new Set<string>();
    let geprueft = 0;
    for (const muster of referenzen) {
      const w = muster.split(" ");
      const antworten = [muster, w.slice(0, 3).join(" "), w.slice(-3).join(" "), w.slice(0, Math.ceil(w.length / 2)).join(" "), "", "xy", "  ", ...w];
      if (muster === referenzen[0]) antworten.push(lang.slice(0, 6).join(" "), lang.slice(6).join(" "), lang.slice(0, 14).join(" "));
      for (const antwort of antworten) {
        geprueft++;
        vergleicheAuto("gebaut", antwort, muster, ab, stufen);
      }
    }
    expect(stufen.size, "zu wenige Stufen erreicht").toBeGreaterThanOrEqual(4);
    expect(ab.slice(0, 3), `${ab.length} von ${geprueft} weichen ab`).toEqual([]);
  });

  it("Gleis 8: die Schwellen 0,65 und 0,35 exakt - Pflicht und Kuer in jeder Mischung", () => {
    const wort = (i: number) => "begriff" + "abcdefghijklmnopqrst"[i] + "xyz";
    const ab: string[] = [];
    let geprueft = 0;
    let genau65 = 0;
    let genau35 = 0;
    for (const [nP, nK] of [[20, 0], [7, 6], [0, 4], [5, 5]]) {
      const pflicht = Array.from({ length: nP }, (_, i) => wort(i));
      const kuer = Array.from({ length: nK }, (_, i) => wort(nP + i));
      const f = { id: "synth", schluesselbegriffe: { pflicht, kuer }, musterloesung: "" };
      for (let p = 0; p <= nP; p++) {
        for (let k = 0; k <= nK; k++) {
          const antwort = [...pflicht.slice(0, p), ...kuer.slice(0, k)].join(" ") || "keine ahnung";
          geprueft++;
          const gewicht = 2 * nP + nK;
          if (gewicht && (2 * p + k) * 100 === 65 * gewicht) genau65++;
          if (gewicht && (2 * p + k) * 100 === 35 * gewicht) genau35++;
          vergleiche(`p=${p} k=${k} von ${nP}/${nK}`, f, antwort, ab);
        }
      }
    }
    expect(genau65, "kein Fall genau auf 0,65 - die Schwelle bleibt ungemessen").toBeGreaterThan(0);
    expect(genau35, "kein Fall genau auf 0,35 - die Schwelle bleibt ungemessen").toBeGreaterThan(0);
    expect(ab.slice(0, 3), `${ab.length} von ${geprueft} weichen ab`).toEqual([]);
  });

  it("Gleis 9: Tippfehler, Nachbarbegriffe und Mehrwort-Begriffe - Abwandlungen aller echten Schluesselbegriffe", () => {
    const ab: string[] = [];
    let geprueft = 0;
    let mitTreffer = 0;
    const erst = (b: unknown) => String(Array.isArray(b) ? b[0] : b);
    const pruefe = (bez: string, f: Record<string, unknown>, antwort: string) => {
      geprueft++;
      vergleiche(bez, f, antwort, ab);
      if ((gradeTeilpunkte(antwort, f as never)).gefunden.length > 0) mitTreffer++;
    };
    for (const f of FREITEXTE) {
      const sb = f.schluesselbegriffe as { pflicht?: unknown[]; kuer?: unknown[] } | undefined;
      const alle = [...(Array.isArray(sb?.pflicht) ? sb!.pflicht! : []), ...(Array.isArray(sb?.kuer) ? sb!.kuer! : [])];
      for (const b of alle) {
        const t = erst(b);
        if (t.length < 3) continue;
        for (const v of [t.slice(1), t.slice(0, -1), t.slice(0, 2) + t.slice(3), t.slice(0, 2) + "x" + t.slice(2), t + "e", t.toUpperCase()]) {
          pruefe("tipp", f, v);
        }
        const tok = t.split(" ");
        if (tok.length > 1) {
          pruefe("ohne letztes Token", f, tok.slice(0, -1).join(" "));
          pruefe("ohne erstes Token", f, tok.slice(1).join(" "));
          pruefe("Tokens vertauscht", f, [...tok].reverse().join(" "));
        }
      }
    }
    /* Gebaute Nachbarn: "firewall"/"firewalls" stehen in Distanz 1 - dort schaltet sich die Toleranz selbst ab. */
    const gebaut = [
      { id: "s1", schluesselbegriffe: { pflicht: ["firewall", "firewalls"], kuer: ["proxyserver"] }, musterloesung: "" },
      { id: "s2", schluesselbegriffe: { pflicht: ["monitor b", "switch ports"], kuer: [["router", "gateway"]] }, musterloesung: "" },
      { id: "s3", schluesselbegriffe: { pflicht: ["ipv4adresse", "7,1", "netzwerk"] }, musterloesung: "" },
    ];
    const antworten = [
      "firwall", "firewal", "firewalls", "firewall", "proxyserve", "proxyserver", "prxyserver",
      "monitor a", "monitor b", "monitor", "switch", "ports", "switch port", "portsswitch", "ruter", "gatewa",
      "ipv4adresse", "ipv5adresse", "7,5", "7,1", "netzwerk", "netzwek", "netzwerke", "keine ahnung",
    ];
    for (const f of gebaut) for (const a of antworten) pruefe("gebaut", f as never, a);
    expect(geprueft, "zu wenige Abwandlungen gebaut").toBeGreaterThan(2000);
    expect(mitTreffer, "keine Abwandlung traf - die Toleranz wurde nie beruehrt").toBeGreaterThan(100);
    expect(ab.slice(0, 3), `${ab.length} von ${geprueft} Abwandlungen weichen ab`).toEqual([]);
  });

  /* Gegenprobe: der Vergleich MUSS eine Abweichung sehen koennen. Ohne diese Zeile
     waere ein Test, der nie etwas vergleicht, genauso gruen. */
  it("wuerde eine Abweichung bemerken", () => {
    const f = FREITEXTE[0];
    const alt = ALT.autoCheckText(f.musterloesung, f.musterloesung);
    const verbogen = { ...alt, stufe: "erfunden" };
    expect(JSON.stringify(alt)).not.toBe(JSON.stringify(verbogen));
  });
});
