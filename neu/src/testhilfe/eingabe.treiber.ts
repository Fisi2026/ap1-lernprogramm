/* testhilfe/eingabe.treiber.tsx – Treiber und Pruefschleife fuer `fragetypen/eingabe.*.test.tsx`.

   N42 (18.10.2026): `eingabe.test.tsx` war mit 56-63 s die laengste Datei und der Engpass der CI (vitest
   verteilt nur DATEIEN auf Worker). Sie ist in vier Dateien geteilt (`eingabe.1..4.test.tsx`), gleiche Pruefungen;
   was gemeinsam ist, steht hier. Liegt unter `testhilfe/` – kein Test, nicht in der Coverage.
   ⚠️ GRUPPEN verteilt die Typen nach gemessener Dauer (18.10., lokal, Summe ~28 s: trace 4,5 · kreuztabelle 2,9 ·
      reihenfolge 2,3 · mehrfach 2,0 · kalkulation 1,5 · Rest je 0,5-1,4 s). Ein neuer Typ muss in genau EINE Gruppe –
      `eingabe.1.test.tsx` prueft das (jeder gebaute Typ genau einmal). */
import { describe, it, expect } from "vitest";
import { createElement, useState } from "react";
import { render, screen, cleanup, within, configure } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import { altQuelle } from "./altquelle";
import { eingabeFuer } from "../fragetypen/register";
import { STICHPROBE } from "../fragetypen/eingabe.stichprobe";
import { instanziiere } from "@/kern/instanz";
import type { EingabeProps } from "../fragetypen/vertrag";
import type { Frage, FrageVon, Fragetyp } from "@/daten/typen";

const hier = path.dirname(fileURLToPath(import.meta.url));
const requireCjs = createRequire(import.meta.url);
/* N34 T6c: das Orakel ist die eingefrorene `referenz/logik.js` (die Wurzel-Fassung ist entfernt). */
const L = requireCjs(altQuelle(path.resolve(hier, "../../.."), "logik.js")) as {
  grade: (f: unknown, a: unknown) => unknown;
};

const HOECHSTENS = 25;

/** Feste Auswahl je Typ; fehlende IDs werden genannt statt still uebergangen. */
function stichprobe(typ: Fragetyp, fragen: Frage[]): { probe: Frage[]; fehlt: string[] } {
  const ids = STICHPROBE[typ] ?? [];
  const nachId = new Map(fragen.map((f) => [f.id, f]));
  return {
    probe: ids.flatMap((id) => nachId.get(id) ?? []),
    fehlt: ids.filter((id) => !nachId.has(id)),
  };
}

/** Haelt den Antwortstand, wie es die Karte spaeter auch tut. */
function Pruefstand({ frage, melde }: { frage: Frage; melde: (a: unknown) => void }) {
  const [antwort, setAntwort] = useState<unknown>(undefined);
  const Eingabe = eingabeFuer(frage)!;
  const props: EingabeProps = {
    frage,
    antwort,
    gesperrt: false,
    aufAntwort: (a) => { setAntwort(a); melde(a); },
  };
  return createElement(Eingabe, props);
}

/* ⛔ GEMESSEN 19.10.2026 (BUILD_LOG 228), NICHT GERATEN: im vollen `check.sh` fielen `trace` und
   `kreuztabelle` in die 60-s-Grenze, `kalkulation` und `mehrfach` mit
   "Unable to find a label with the text of: FEZ, Zelle 1". ALLEIN waren dieselben Dateien gruen
   (29/29, `trace` 19,8 s). Ursache ist die Maschinenlast: die Treiber fragten das DOM SYNCHRON ab
   (`screen.getBy*`), also bevor React nach der vorigen Bedienung nachgezeichnet hatte.
   ►► Alle Abfragen auf `screen.findBy*` umgestellt - sie warten, statt zu raten. `within(feld).getBy*`
      bleibt synchron: dort ist das Elternelement schon gefunden.
   ⚠️ Die Vorgabe von `findBy*` ist 1 s. Auf einem 3-fach ueberbuchten Rechner ist das knapp, darum 5 s -
      eine Grenze, die einen echten Haenger weiterhin faengt (ein Nachzeichnen dauert Millisekunden).
      Wer sie senkt, misst vorher einen vollen Lauf, nicht eine Datei. */
configure({ asyncUtilTimeout: 5000 });

/* N37 U4: je Typ ein Treiber, der GENAU die Frage seines Typs bekommt. */
type Treiber<T extends Fragetyp> = (f: FrageVon<T>, nutzer: ReturnType<typeof userEvent.setup>) => Promise<void>;

/* Die Treiber bedienen ueber die Beschriftung — so, wie ein Mensch es tut. */
const TREIBER: { [T in Fragetyp]?: Treiber<T> } = {
  async mc(f, nutzer) {
    const optionen = f.optionen as string[];
    const richtig = optionen[f.loesungIndex as number];
    await nutzer.click(await screen.findByRole("radio", { name: richtig }));
  },
  async mehrfach(f, nutzer) {
    const optionen = f.optionen as string[];
    for (const i of (f.loesungIndizes as number[]) ?? []) {
      await nutzer.click(await screen.findByRole("checkbox", { name: optionen[i] }));
    }
  },
  async dropdown(f, nutzer) {
    const luecken = f.luecken as Array<{ optionen: string[]; loesung: number }>;
    for (let i = 0; i < luecken.length; i++) {
      const feld = await screen.findByLabelText(`Lücke ${i + 1}`) as HTMLSelectElement;
      /* Per ELEMENT waehlen, nicht per Text: selectOptions prueft zuerst den value, und der ist
         der Options-Index. Eine Option mit dem Text "1" traf sonst Index 1 (M04-110, 11.10.2026). */
      const text = luecken[i].optionen[luecken[i].loesung];
      const ziel = Array.from(feld.options).find((o) => o.textContent === text);
      if (!ziel) throw new Error(`Option "${text}" fehlt in Lücke ${i + 1}`);
      await nutzer.selectOptions(feld, ziel);
    }
  },
  async zuordnung(f, nutzer) {
    const paare = f.paare as Array<[string, string]>;
    for (let i = 0; i < paare.length; i++) {
      const feld = await screen.findByLabelText(`Zuordnung ${i + 1}`) as HTMLSelectElement;
      /* Per ELEMENT waehlen: selectOptions vergleicht mit value (= Index) und innerHTML - ein ">"
         steht dort als "&gt;" und wurde nicht gefunden (M02-008 "Angebot > Nachfrage", 11.10.2026). */
      const ziel = Array.from(feld.options).find((o) => o.textContent === paare[i][1]);
      if (!ziel) throw new Error(`Option "${paare[i][1]}" fehlt in Zuordnung ${i + 1}`);
      await nutzer.selectOptions(feld, ziel);
    }
  },
  async fehlersuche(f, nutzer) {
    const zeilen = f.zeilen as string[];
    const nr = f.fehlerZeile as number;
    const knoepfe = await screen.findAllByRole("radio");
    expect(knoepfe.length, `${f.id}: ${zeilen.length} Zeilen erwartet`).toBe(zeilen.length);
    await nutzer.click(knoepfe[nr]);
  },
  async mtf(f, nutzer) {
    const aussagen = f.aussagen as Array<{ wahr: boolean }>;
    for (let i = 0; i < aussagen.length; i++) {
      const wort = aussagen[i].wahr ? "wahr" : "falsch";
      await nutzer.click(await screen.findByRole("radio", { name: `Aussage ${i + 1}: ${wort}` }));
    }
  },
  async szenario2(f, nutzer) {
    for (const [nr, feld] of [["Schritt 1", "schritt1"], ["Schritt 2", "schritt2"]] as const) {
      const s = f[feld] as { optionen: string[]; loesungIndex: number };
      const gruppe = await screen.findByRole("radiogroup", { name: nr });
      /* N47 A: nach Beschriftung, nicht nach Stelle – die Anzeige ist seit 2.3.3 gemischt. */
      await nutzer.click(within(gruppe).getByRole("radio", { name: s.optionen[s.loesungIndex] }));
    }
  },
  async hotspot(f, nutzer) {
    const zonen = f.zonen as Array<{ richtig?: boolean; label?: string }>;
    const i = zonen.findIndex((z) => z.richtig === true);
    const name = zonen[i].label ? zonen[i].label : `Zone ${i + 1}`;
    await nutzer.click(await screen.findByRole("button", { name }));
  },
  /* reihenfolge wird ueber die Pfeilknoepfe sortiert — so, wie ein Mensch es tut.
     Selection Sort: den kleinsten verbleibenden Original-Index nach vorn holen. */
  async reihenfolge(f, nutzer) {
    const anzahl = (f.schritte as string[]).length;
    for (let ziel = 0; ziel < anzahl - 1; ziel++) {
      for (let n = 0; n < anzahl * 2; n++) {
        const liste = await screen.findAllByRole("listitem");
        const texte = f.schritte as string[];
        /* Der Text des Schritts steht im <li> zusammen mit der Platznummer und den
           Knopf-Beschriftungen ("Schritt N nach oben"). Statt daran herumzuschneiden
           wird gesucht, WELCHER Schritt in dieser Zeile steht — der laengste
           enthaltene gewinnt, falls ein Schritttext im anderen steckt. */
        const jetzt = liste.map((li) => {
          const inhalt = li.textContent ?? "";
          let treffer = -1;
          for (let k = 0; k < texte.length; k++) {
            if (!inhalt.includes(texte[k])) continue;
            if (treffer < 0 || texte[k].length > texte[treffer].length) treffer = k;
          }
          return treffer;
        });
        if (jetzt.some((x) => x < 0)) throw new Error(`${f.id}: Schritt nicht wiedererkannt`);
        let kleinsterPlatz = ziel;
        for (let p = ziel + 1; p < anzahl; p++) if (jetzt[p] < jetzt[kleinsterPlatz]) kleinsterPlatz = p;
        if (kleinsterPlatz === ziel) break;
        await nutzer.click(
          await screen.findByRole("button", { name: `Schritt ${kleinsterPlatz + 1} nach oben` }),
        );
      }
    }
  },

  /* ⚠️ GEMESSEN: in keinem Text dieser vier Typen steht `{`, `}`, `[` oder `]` —
     userEvent.type deutet die sonst als Tastenfolge. Faellt das kuenftig, faellt
     der Test, nicht die App. */
  async lueckentext(f, nutzer) {
    const luecken = f.luecken as string[][];
    for (let i = 0; i < luecken.length; i++) {
      await nutzer.type(
        await screen.findByLabelText(`Lücke ${i + 1} von ${luecken.length}`),
        luecken[i][0],
      );
    }
  },
  async konsole(f, nutzer) {
    const aufgaben = f.aufgaben as Array<{ prompt: string; akzeptiert: string[] }>;
    for (let i = 0; i < aufgaben.length; i++) {
      await nutzer.type(
        await screen.findByLabelText(`Befehl ${i + 1}: ${aufgaben[i].prompt}`),
        aufgaben[i].akzeptiert[0],
      );
    }
  },
  async trace(f, nutzer) {
    const spalten = f.spalten as string[];
    const zeilen = f.zeilen as string[][];
    for (let r = 0; r < zeilen.length; r++) {
      for (let c = 0; c < zeilen[r].length; c++) {
        await nutzer.type(
          await screen.findByLabelText(`${spalten[c]}, Zelle ${r + 1}`),
          zeilen[r][c],
        );
      }
    }
  },
  async kreuztabelle(f, nutzer) {
    const zeilen = f.zeilen as string[];
    const spalten = f.spalten as string[];
    const loesung = f.loesung as boolean[][];
    for (let r = 0; r < zeilen.length; r++) {
      for (let c = 0; c < spalten.length; c++) {
        if (!loesung[r][c]) continue;
        await nutzer.click(
          await screen.findByRole("checkbox", { name: `${zeilen[r]} — ${spalten[c]}` }),
        );
      }
    }
  },

  /* Die drei Auswahl-Typen werden ueber die SICHTBARE Beschriftung der Option
     bedient, nicht ueber ihren Wert — bei `matrix` ist der Wert der Index, und
     ein Test, der Indizes waehlt, prueft die Umsetzung gegen sich selbst. */
  async beschriftung(f, nutzer) {
    const ziele = f.ziele as Array<{ nr?: number; loesung: string }>;
    for (let i = 0; i < ziele.length; i++) {
      const feld = await screen.findByLabelText(`Stelle ${ziele[i].nr ?? i + 1}`);
      await nutzer.selectOptions(
        feld,
        within(feld).getByRole("option", { name: ziele[i].loesung }),
      );
    }
  },
  async baukasten(f, nutzer) {
    const ziele = f.ziele as Array<{ nr?: number; loesung: string }>;
    for (let i = 0; i < ziele.length; i++) {
      const feld = await screen.findByLabelText(`Lücke ${ziele[i].nr ?? i + 1}`);
      await nutzer.selectOptions(
        feld,
        within(feld).getByRole("option", { name: ziele[i].loesung }),
      );
    }
  },
  async matrix(f, nutzer) {
    const quadranten = f.quadranten as string[];
    const elemente = f.elemente as Array<{ quadrant: number }>;
    for (let i = 0; i < elemente.length; i++) {
      const feld = await screen.findByLabelText(`Element ${i + 1}`);
      await nutzer.selectOptions(
        feld,
        within(feld).getByRole("option", { name: quadranten[elemente[i].quadrant] }),
      );
    }
  },

  /* ⛔ Diese beiden bekommen die GESTELLTE Frage (siehe unten: der Bestand wird
     instanziiert). Bei `rechenassistent` steht der richtige Wert erst dann im
     Schritt; die rohe Pool-Frage traegt nur eine Formel. */
  async rechenassistent(f, nutzer) {
    const schritte = f.schritte as Array<{ text: string; einheit?: string; wert?: number; loesung?: string[] }>;
    for (let i = 0; i < schritte.length; i++) {
      const s = schritte[i];
      const name = `Schritt ${i + 1}: ${s.text}${s.einheit ? ` (${s.einheit})` : ""}`;
      const wert = s.loesung?.[0] ?? String(s.wert ?? "");
      await nutzer.type(await screen.findByLabelText(name), wert);
    }
  },
  async kalkulation(f, nutzer) {
    const kopf = f.kopf as string[];
    const zeilen = f.zeilen as Array<Array<{ v?: string; loesung?: string[] }>>;
    for (let r = 0; r < zeilen.length; r++) {
      for (let c = 0; c < zeilen[r].length; c++) {
        const zelle = zeilen[r][c];
        if (!Array.isArray(zelle.loesung)) continue;
        await nutzer.type(
          await screen.findByLabelText(`${kopf[c]}, Zelle ${r + 1}`),
          zelle.loesung[0],
        );
      }
    }
  },
};

/* Object.keys liefert `string[]` – die Schluessel sind aber genau die Typen, die TREIBER traegt. */

/* Object.keys liefert `string[]` – die Schluessel sind aber genau die Typen, die TREIBER traegt. */
export const GEBAUT = Object.keys(TREIBER) as Fragetyp[];

/** Die vier Gruppen, ausgeglichen nach gemessener Dauer (~6,5-7 s je Gruppe). */
export const GRUPPEN: Fragetyp[][] = [
  ["trace", "kalkulation", "hotspot", "lueckentext"],
  ["kreuztabelle", "mehrfach", "rechenassistent"],
  ["reihenfolge", "konsole", "zuordnung", "szenario2", "baukasten"],
  ["matrix", "mtf", "mc", "beschriftung", "dropdown", "fehlersuche"],
];

/** Die Pruefungen je Typ – jede Datei `eingabe.N.test.tsx` ruft sie mit ihrer Gruppe auf. */
export function eingabeSuite(typen: Fragetyp[]): void {
  describe("Eingaben liefern die Form, die L.grade erwartet", () => {
  describe.each(typen)("Typ %s", (typ) => {
    /* ⛔ Der Bestand wird INSTANZIIERT, so wie die Karte ihn auch bekommt.
       Fuer 1102 Fragen ist das ein Durchreicher; fuer die 29 mit `variablen`
       entsteht hier erst die Aufgabe, die L.grade bewerten kann. */
    const alle = FRAGEN.filter((f) => f.typ === typ).map((f) => instanziiere(f));
    const { probe, fehlt } = stichprobe(typ, alle);

    it(`hat eine Eingabe und Fragen im Bestand (${alle.length})`, () => {
      expect(alle.length).toBeGreaterThan(0);
      expect(eingabeFuer(alle[0])).toBeDefined();
    });

    it("hat eine feste Stichprobe, deren Fragen alle im Bestand stehen", () => {
      expect(STICHPROBE[typ], `Typ ${typ} ohne feste Stichprobe – Liste in eingabe.stichprobe.ts anlegen`).toBeDefined();
      expect(fehlt, `IDs nicht mehr im Pool – in eingabe.stichprobe.ts ersetzen`).toEqual([]);
      expect(probe.length).toBeGreaterThan(0);
      expect(probe.length).toBeLessThanOrEqual(HOECHSTENS);
      expect(new Set(probe.map((f) => f.id)).size, "doppelte ID in der Stichprobe").toBe(probe.length);
    });

    it(`wird bei ${probe.length} Fragen richtig bedient und richtig gewertet`, async () => {
      /* delay: null — userEvent legt sonst zwischen jeden Tastendruck eine echte
         Pause. Gemessen: 17 s fuer 100 Fragen. Die Pausen pruefen nichts. */
      const nutzer = userEvent.setup({ delay: null });
      const durchgefallen: string[] = [];

      for (const f of probe) {
        let letzte: unknown = undefined;
        render(createElement(Pruefstand, { frage: f, melde: (a) => { letzte = a; } }));
        try {
          /* EINE Umwandlung, begruendet wie `eingabeFuer`: `f` ist per Filter vom Typ `typ` (korrelierte Union). */
          await (TREIBER[typ] as Treiber<Fragetyp>)(f, nutzer);
          if (!L.grade(f, letzte)) {
            durchgefallen.push(`${f.id}: gewertet als falsch (${JSON.stringify(letzte).slice(0, 80)})`);
          }
        } catch (e) {
          durchgefallen.push(`${f.id}: Bedienung schlug fehl — ${(e as Error).message.split("\n")[0]}`);
        }
        cleanup();
      }

      expect(
        durchgefallen.slice(0, 5),
        `${durchgefallen.length} von ${probe.length} Fragen des Typs ${typ}`,
      ).toEqual([]);
    /* ⛔ GEMESSEN 19.10.2026 (BUILD_LOG 228/229), NICHT GERATEN: nach der Umstellung auf `findBy*`
       blieben im vollen `check.sh` genau die ZEITUEBERSCHREITUNGEN uebrig (4 Fehler -> 2). ALLEIN
       braucht der schwerste Test dieser Suite (`trace`, 24 Fragen) 21,8 s - `findBy*` kostet dabei
       rund 10 % (vorher 19,8 s). Der volle Lauf bucht die Maschine knapp dreifach ueber (12 Kerne;
       vitest plus 7 Suiten, tsc, oxlint und Bau), und 60 s lagen damit auf der Kante.
       ►► 180 s ist das Achtfache der gemessenen Alleinzeit und bleibt eine Grenze: ein echter
          Haenger laeuft nie fertig und faellt weiterhin auf. Nach der eigenen Regel in
          `vitest.config.ts` misst eine SENKUNG vorher 5 volle Laeufe. */
    }, 180_000);

    /* Gegenprobe: ohne jede Bedienung darf NICHTS als richtig durchgehen.
       Sonst koennte der Test gruen sein, weil grade immer true sagt. */
    it("wertet eine unbediente Eingabe nicht als richtig", () => {
      const f = probe[0];
      let letzte: unknown = "NICHTS_GEMELDET";
      render(createElement(Pruefstand, { frage: f, melde: (a) => { letzte = a; } }));
      expect(letzte).toBe("NICHTS_GEMELDET");
      expect(L.grade(f, undefined)).toBeFalsy();
      cleanup();
    });
  });
  });
}
