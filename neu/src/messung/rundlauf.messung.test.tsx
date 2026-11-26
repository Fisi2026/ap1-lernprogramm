// @vitest-environment jsdom
/* ============================================================================
   N48 P1 + P2 (10.10.2026): MESSUNG, KEIN WAECHTER.
   Aufruf: cd neu && MESSUNG=1 NO_COLOR=1 npx vitest run src/messung --reporter=dot
   ⛔ Ohne MESSUNG=1 wird sie UEBERSPRUNGEN – sie liegt nur unter *.test.tsx, damit tsc und knip sie
      kennen; im normalen Lauf (check.sh, CI) ist sie kein Waechter (PLAN_NEUBAU N48 „Ablauf").
   Schreibt die Befundliste nach ../_to_delete/helfer/n48_befunde.json und eine Kurzfassung auf stdout.

   P1 Rundlauf je Frage (ALLE Fragen): richtige Antwort → grade true · falsche → grade false ·
      die gesperrte Eingabe mit falscher Antwort zeigt die Loesung (Marke `data-urteil="richtig"`,
      `data-teil="richtig-waere"` oder Text „Richtig wäre"/„richtig:"/„Musterlösung") ·
      Rueckseite hat `erklaerungKurz`.
   P2 Verraeterische Darstellung: richtige Option ist die laengste (mc, mehrfach, szenario2,
      dropdown mit Text) – Anteil je Typ gegen den Zufall 1/n.
   ============================================================================ */
import { describe, it } from "vitest";
import { createElement } from "react";
import { cleanup, render } from "@testing-library/react";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import { eingabeFuer, wirkTyp } from "@/fragetypen/register";
import { instanziiere } from "@/kern/instanz";
import { richtigeAntwort, falscheAntwort } from "@/kern/antwortform";
import { grade as bewerte } from "@/kern/bewertung";
import { bleibtGeordnet } from "@/kern/anzeige";
import type { Frage } from "@/daten/typen";

const hier = path.dirname(fileURLToPath(import.meta.url));
type Befund = { id: string; typ: string; klasse: string; text: string };

function zeigtLoesung(): boolean {
  if (document.querySelector('[data-urteil="richtig"], [data-teil="richtig-waere"]')) return true;
  const t = document.body.textContent ?? "";
  return /Richtig wäre|richtig:|Musterlösung|Musterloesung|Lösung:|akzeptiert:|Erwartet war|Richtige Werte|Richtig angekreuzt/i.test(t);
}

function laengsteIstRichtig(optionen: readonly string[], richtig: number): boolean {
  const l = optionen.map((o) => o.length);
  const max = Math.max(...l);
  return l[richtig] === max && l.filter((x) => x === max).length === 1;
}

describe.skipIf(!process.env.MESSUNG)("N48 Messung", () => {
  it("P1 + P2 ueber alle Fragen", () => {
    const befunde: Befund[] = [];
    const p1 = new Map<string, { n: number; ohneLoesung: number; gradeRichtigFalsch: number; gradeFalschRichtig: number; ohneFalsche: number }>();
    const p2 = new Map<string, { n: number; laengste: number; erwartet: number }>();
    for (const roh of FRAGEN as Frage[]) {
      const f = instanziiere(roh);
      const typ = wirkTyp(f);
      const z = p1.get(typ) ?? { n: 0, ohneLoesung: 0, gradeRichtigFalsch: 0, gradeFalschRichtig: 0, ohneFalsche: 0 };
      z.n++;
      const r = richtigeAntwort(f);
      const fa = falscheAntwort(f);
      if (r && bewerte(f, r.wert) === false) { z.gradeRichtigFalsch++; befunde.push({ id: f.id, typ, klasse: "P1 richtige Antwort als falsch gewertet", text: JSON.stringify(r.wert).slice(0, 120) }); }
      if (!fa) z.ohneFalsche++;
      else if (bewerte(f, fa.wert) === true) { z.gradeFalschRichtig++; befunde.push({ id: f.id, typ, klasse: "P1 falsche Antwort als richtig gewertet", text: JSON.stringify(fa.wert).slice(0, 120) }); }
      const E = eingabeFuer(f);
      if (E) {
        render(createElement(E, { frage: f, antwort: fa?.wert, gesperrt: true, aufAntwort: () => {} }));
        if (!zeigtLoesung()) { z.ohneLoesung++; befunde.push({ id: f.id, typ, klasse: "P1 Loesung nach falscher Antwort nicht in der Eingabe", text: "" }); }
        cleanup();
      }
      if (!(typeof f.erklaerungKurz === "string" && f.erklaerungKurz.trim())) befunde.push({ id: f.id, typ, klasse: "P1 keine erklaerungKurz", text: "" });
      p1.set(typ, z);

      const listen: Array<{ o: readonly string[]; r: number }> = [];
      if ((typ === "mc") && "optionen" in f && Array.isArray(f.optionen) && "loesungIndex" in f) listen.push({ o: f.optionen, r: f.loesungIndex });
      if (typ === "szenario2" && "schritt1" in f) for (const s of [f.schritt1, f.schritt2]) listen.push({ o: s.optionen, r: s.loesungIndex });
      if (typ === "dropdown" && "luecken" in f && Array.isArray(f.luecken))
        for (const l of f.luecken) if (typeof l === "object" && !Array.isArray(l) && !bleibtGeordnet(l.optionen)) listen.push({ o: l.optionen, r: l.loesung });
      for (const { o, r: ri } of listen) {
        const q = p2.get(typ) ?? { n: 0, laengste: 0, erwartet: 0 };
        q.n++; q.erwartet += 1 / o.length;
        if (laengsteIstRichtig(o, ri)) { q.laengste++; befunde.push({ id: f.id, typ, klasse: "P2 richtige Option ist die laengste", text: o[ri]?.slice(0, 80) ?? "" }); }
        p2.set(typ, q);
      }
    }
    const kurz = {
      p1: Object.fromEntries([...p1.entries()].sort()),
      p2: Object.fromEntries([...p2.entries()].map(([k, v]) => [k, { ...v, erwartet: Math.round(v.erwartet) }])),
      klassen: befunde.reduce<Record<string, number>>((a, b) => { a[b.klasse] = (a[b.klasse] ?? 0) + 1; return a; }, {}),
    };
    const ziel = path.resolve(hier, "../../../_to_delete/helfer");
    mkdirSync(ziel, { recursive: true });
    writeFileSync(path.join(ziel, "n48_befunde.json"), JSON.stringify({ kurz, befunde }, null, 1));
    console.log(JSON.stringify(kurz, null, 1));
  }, 600_000);
});
