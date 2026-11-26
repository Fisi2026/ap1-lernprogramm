/* ============================================================================
   N48 P3 (11.10.2026): BEWERTUNG AN DEN RAENDERN – MESSUNG, KEIN WAECHTER.
   Aufruf: cd neu && MESSUNG=1 NO_COLOR=1 npx vitest run src/messung/raender --reporter=dot
   ⛔ Ohne MESSUNG=1 uebersprungen (wie rundlauf.messung). Schreibt
      ../_to_delete/helfer/n48_p3.json und eine Kurzfassung auf stdout.
   Geprueft wird ueber die ECHTEN Bewertungsfunktionen (`grade`, `gradeLuecke` …),
   nie ueber einen Nachbau:
   R1 rechenassistent – richtige Zahl in anderer Schreibweise (gerundet mit Komma,
      Tausenderpunkt, mit Einheit) wird angenommen? Generatoren je 50 Ziehungen:
      Text ohne Platzhalter/NaN, richtige Antwort richtig.
   R2 kalkulation – Loesungszellen in anderer Schreibweise (",00", Tausenderpunkt, "€").
   R3 lueckentext – nimmt die Tippfehler-Toleranz die Antwort einer ANDEREN Luecke an?
   R4 mehrfach – Loesungsmenge gueltig (eindeutig, im Bereich, nicht alle, nicht keine).
   R5 freitext/erklaeren – erreicht die eigene Musterloesung die Stufe „richtig"?
   R6 konsole – Gross-/Kleinschreibung wird ignoriert: welche Antworten tragen
      Grossbuchstaben (dort kann ein falscher Schalter als richtig durchgehen)?
   ============================================================================ */
import { describe, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import { instanziiere, istVeraenderlich } from "@/kern/instanz";
import { richtigeAntwort } from "@/kern/antwortform";
import { grade, gradeLuecke, gradeLueckeTolerant } from "@/kern/bewertung";
import { rundeAuf, zahlAusText } from "@/kern/zahlen";
import { einschaetzen } from "@/kern/freitext";
import type { Frage } from "@/daten/typen";

const hier = path.dirname(fileURLToPath(import.meta.url));
type Befund = { id: string; typ: string; klasse: string; text: string };
type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj => (x && typeof x === "object" ? (x as Obj) : {});
const strs = (x: unknown): string[] => (Array.isArray(x) ? x.map(String) : []);

function deutsch(x: number, d: number, tausender: boolean): string {
  const teile = x.toFixed(d).split(".");
  let ganz = teile[0] ?? "";
  const nach = teile[1] ?? "";
  const neg = ganz.startsWith("-");
  if (neg) ganz = ganz.slice(1);
  if (tausender) {
    let o = "";
    while (ganz.length > 3) { o = "." + ganz.slice(-3) + o; ganz = ganz.slice(0, -3); }
    ganz += o;
  }
  return (neg ? "-" : "") + ganz + (nach ? "," + nach : "");
}
function istZahlText(s: string): boolean {
  if (!s.trim()) return false;
  for (const c of s) if (!"0123456789,.-".includes(c)) return false;
  return true;
}

describe.skipIf(!process.env.MESSUNG)("N48 P3 Messung", () => {
  it("Raender der Bewertung ueber alle betroffenen Fragen", () => {
    const befunde: Befund[] = [];
    const gesehen = new Set<string>();
    const zaehler: Record<string, number> = {};
    const melde = (id: string, typ: string, klasse: string, text: string) => {
      zaehler[klasse] = (zaehler[klasse] ?? 0) + 1;
      const k = id + "|" + klasse;
      if (gesehen.has(k)) return;
      gesehen.add(k);
      befunde.push({ id, typ, klasse, text: text.slice(0, 160) });
    };
    const geprueft: Record<string, number> = {};
    const zaehle = (k: string) => { geprueft[k] = (geprueft[k] ?? 0) + 1; };

    for (const roh of FRAGEN as Frage[]) {
      const typ = roh.typ;
      if (typ === "rechenassistent") {
        const versuche = istVeraenderlich(roh) ? 50 : 1;
        for (let v = 0; v < versuche; v++) {
          const f = instanziiere(roh, v);
          const o = obj(f);
          const text = String(o["frage"] ?? "") + JSON.stringify(o["schritte"] ?? "");
          for (const schlecht of ["{", "NaN", "undefined", "Infinity"])
            if (String(o["frage"] ?? "").includes(schlecht)) melde(f.id, typ, "R1 Fragetext enthaelt " + schlecht, String(o["frage"]));
          if (text.includes("NaN")) melde(f.id, typ, "R1 NaN in den Schritten", "");
          const r = richtigeAntwort(f);
          const basis = Array.isArray(r?.wert) ? (r.wert as unknown[]) : null;
          if (!basis) { melde(f.id, typ, "R1 keine richtige Antwort ableitbar", ""); continue; }
          if (grade(f, basis) !== true) melde(f.id, typ, "R1 richtige Antwort nicht richtig", JSON.stringify(basis));
          const schritte = Array.isArray(o["schritte"]) ? (o["schritte"] as unknown[]) : [];
          schritte.forEach((s0, i) => {
            const s = obj(s0);
            const w = s["wert"];
            if (typeof w !== "number" || !isFinite(w)) return;
            const d = typeof s["dezimalen"] === "number" ? (s["dezimalen"] as number) : 2;
            const probe = (art: string, eingabe: string) => {
              zaehle("R1 " + art);
              const e = basis.slice(); e[i] = eingabe;
              if (grade(f, e) !== true) melde(f.id, typ, "R1 nicht angenommen: " + art, "Schritt " + (i + 1) + ": " + eingabe + " (wert " + w + ", einheit " + String(s["einheit"] ?? "-") + ")");
            };
            const g = rundeAuf(w, d);
            if (g !== w) melde(f.id, typ, "R1 wert feiner als dezimalen", "Schritt " + (i + 1) + ": " + w + " bei " + d);
            probe("gerundet mit Komma", deutsch(g, d, false));
            if (Math.abs(g) >= 1000) probe("Tausenderpunkt", deutsch(g, d, true));
            const einheit = typeof s["einheit"] === "string" ? (s["einheit"] as string).trim() : "";
            if (einheit) probe("mit Einheit", deutsch(g, d, false) + " " + einheit);
            if (w < 0) melde(f.id, typ, "R1 negativer Wert (Info)", "Schritt " + (i + 1) + ": " + w);
          });
        }
      } else if (typ === "kalkulation") {
        const r = richtigeAntwort(roh);
        const basis = obj(r?.wert);
        if (grade(roh, basis) !== true) melde(roh.id, typ, "R2 richtige Antwort nicht richtig", JSON.stringify(basis).slice(0, 120));
        const zeilen = Array.isArray(obj(roh)["zeilen"]) ? (obj(roh)["zeilen"] as unknown[]) : [];
        zeilen.forEach((zeile, zi) => (Array.isArray(zeile) ? zeile : []).forEach((zelle, si) => {
          const l = strs(obj(zelle)["loesung"]);
          const x = l[0];
          if (!x || !istZahlText(x)) return;
          const n = zahlAusText(x);
          if (!isFinite(n)) return;
          const d = Number.isInteger(n) ? 0 : 2;
          const probe = (art: string, eingabe: string) => {
            zaehle("R2 " + art);
            const e2: Obj = { ...basis, [zi + "," + si]: eingabe };
            if (grade(roh, e2) !== true) melde(roh.id, typ, "R2 nicht angenommen: " + art, eingabe + " (Loesung " + l.join(" | ") + ")");
          };
          probe("mit zwei Nachkommastellen", deutsch(n, 2, false));
          if (Math.abs(n) >= 1000) probe("Tausenderpunkt mit Komma", deutsch(n, 2, true));
          probe("mit Euro-Zeichen", deutsch(n, d, false) + " €");
        }));
      }
      else if (typ === "lueckentext") {
        const luecken = Array.isArray(obj(roh)["luecken"]) ? (obj(roh)["luecken"] as unknown[]).map(strs) : [];
        luecken.forEach((li, i) => luecken.forEach((lj, j) => {
          if (i === j) return;
          for (const a of lj) {
            zaehle("R3 fremde Antwort");
            if (!gradeLuecke(li, a) && gradeLueckeTolerant(li, a))
              melde(roh.id, typ, "R3 Toleranz nimmt Antwort einer anderen Luecke an", "Luecke " + (i + 1) + " nimmt '" + a + "' (aus Luecke " + (j + 1) + ")");
            else if (gradeLuecke(li, a))
              melde(roh.id, typ, "R3 dieselbe Antwort in zwei Luecken (Info)", "Luecke " + (i + 1) + " und " + (j + 1) + ": '" + a + "'");
          }
        }));
      } else if (typ === "mehrfach") {
        zaehle("R4 Frage");
        const o = obj(roh);
        const n = Array.isArray(o["optionen"]) ? (o["optionen"] as unknown[]).length : 0;
        const li = Array.isArray(o["loesungIndizes"]) ? (o["loesungIndizes"] as unknown[]) : [];
        const zahlen = li.filter((x): x is number => typeof x === "number" && Number.isInteger(x));
        const ok = zahlen.length === li.length && new Set(zahlen).size === zahlen.length
          && zahlen.every((x) => x >= 0 && x < n) && zahlen.length >= 1 && zahlen.length < n;
        if (!ok) melde(roh.id, typ, "R4 Loesungsmenge ungueltig", JSON.stringify(li) + " bei " + n + " Optionen");
      } else if (typ === "freitext" || typ === "erklaeren") {
        zaehle("R5 Frage");
        const o = obj(roh);
        const m = o["musterloesung"];
        const muster = Array.isArray(m) ? m.map(String).join(" ") : String(m ?? "");
        if (!muster.trim()) { melde(roh.id, typ, "R5 keine Musterloesung", ""); continue; }
        const b = einschaetzen(muster, roh as Parameters<typeof einschaetzen>[1]);
        if (b.stufe !== "richtig") melde(roh.id, typ, "R5 Musterloesung erreicht nicht 'richtig'", b.stufe + ": " + muster);
      } else if (typ === "konsole") {
        const aufgaben = Array.isArray(obj(roh)["aufgaben"]) ? (obj(roh)["aufgaben"] as unknown[]) : [];
        aufgaben.forEach((a, i) => {
          for (const ok of strs(obj(a)["akzeptiert"])) {
            zaehle("R6 akzeptierte Antwort");
            if (ok !== ok.toLowerCase()) melde(roh.id, typ, "R6 Antwort mit Grossbuchstaben (Gross/Klein wird ignoriert)", "Aufgabe " + (i + 1) + ": " + ok);
          }
        });
      }
    }
    const kurz = {
      geprueft,
      vorkommen: zaehler,
      fragen_je_klasse: befunde.reduce<Record<string, number>>((a, b) => { a[b.klasse] = (a[b.klasse] ?? 0) + 1; return a; }, {}),
    };
    const ziel = path.resolve(hier, "../../../_to_delete/helfer");
    mkdirSync(ziel, { recursive: true });
    writeFileSync(path.join(ziel, "n48_p3.json"), JSON.stringify({ kurz, befunde }, null, 1));
    console.log(JSON.stringify(kurz, null, 1));
  }, 600_000);
});
