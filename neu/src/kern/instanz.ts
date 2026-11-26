/* ============================================================================
   AUS EINER POOL-FRAGE WIRD EINE GESTELLTE FRAGE

   ⛔⛔ GEMESSEN AM 14.09.2026, und bis dahin schlicht uebersehen: 27 Fragen im
      Bestand tragen `variablen` und 2 tragen `varianten` — alle vom Typ
      `rechenassistent`. Ihre Schritte tragen KEINE Werte, sondern FORMELN
      (`s1+dauerB`), und ihr Fragetext traegt Platzhalter (`{dauerA}`).
      Ohne Instanziierung stuende im Text woertlich "{dauerA}", die Schritte
      haetten kein `wert`, und `gradeRechenassistent` koennte keine Eingabe
      als richtig werten. **Die neue Oberflaeche hat bisher rohe Pool-Fragen
      gezeichnet.** Fuer die anderen 19 Typen war das folgenlos — sie tragen
      weder `variablen` noch `varianten` (gemessen, nicht vermutet).

   ►► `instanziiere(f, rng)` erledigt alles davon. Bis N34 T5 stand es nur in logik.js
      (`L.instanziiere`); seit T5 (26.09.2026) steht es wortgleich in `rechenaufgabe.ts`.

   ⚠️ ZWEI Fragen tragen geschweifte Klammern im Text, die KEINE Platzhalter sind:
      M04-209 (`{abstract}`) und M04-210 (`{static, final}`) — das ist
      UML-Schreibweise. Beide haben keine `variablen`, laufen also gar nicht erst
      durch die Textfuellung. `instanz.test.ts` haelt genau das fest.
   ============================================================================ */
import { instanziiere as instanziiereRoh } from "./rechenaufgabe.ts";
import type { SimKarte } from "@/daten/typen";

/** Ein Zufall mit Gedaechtnis: dieselbe Saat liefert dieselbe Folge.
    ⛔ Notwendig, nicht schoen: `Math.random` wuerde die Frage bei JEDEM Neuzeichnen
       neu wuerfeln — der Text im Kopf der Karte und die Werte in der Eingabe
       liefen auseinander, und eine gerade abgegebene Antwort waere ploetzlich
       falsch. Die Saat haengt an der Frage und am Versuch, nicht an der Uhr. */
export function zufallMitSaat(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => {
    /* xorshift32 — klein, schnell, und vor allem: nachvollziehbar. */
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

export function saatAus(text: string, versuch = 0): number {
  let h = 2166136261;
  const roh = text + "#" + versuch;
  for (let i = 0; i < roh.length; i++) {
    h ^= roh.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Braucht diese Frage ueberhaupt eine Instanziierung? */
export function istVeraenderlich(f: SimKarte): boolean {
  const hatVariablen =
    "variablen" in f && !!f.variablen && typeof f.variablen === "object" && !Array.isArray(f.variablen);
  const hatVarianten = Array.isArray(f.varianten) && f.varianten.length > 0;
  return hatVariablen || hatVarianten;
}

/** Die gestellte Fassung einer Frage. Fuer alles ohne `variablen`/`varianten`
    ist das die Frage selbst — dann wird NICHTS angefasst. */
export function instanziiere<F extends SimKarte>(f: F, versuch = 0): F {
  if (!istVeraenderlich(f)) return f;
  const rng = zufallMitSaat(saatAus(f.id, versuch));
  return instanziiereRoh(f, rng);
}
