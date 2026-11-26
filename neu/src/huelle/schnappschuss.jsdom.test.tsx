// @vitest-environment jsdom
/* ============================================================================
   N25 P0: DER SCHNAPPSCHUSS DES NEUBAUS — je Bereich und je Fragetyp-Karte

   ⛔ Verglichen wird der BEDEUTUNGSBAUM (bedeutungsbaum.ts), nicht das HTML.
      Weicht er ab, wird vitest rot – und damit `check.sh` 4f. Eine gewollte
      Änderung wird mit `npx vitest run src/huelle/schnappschuss -u`
      übernommen, **im Diff gelesen und im BUILD_LOG begründet**.
   ⚠️ DETERMINISMUS IST PFLICHT, sonst misst der Schnappschuss den Zufall:
      feste Uhr (Tage bis zur Prüfung, „heute"), geseedeter Zufall (Ziehung),
      fester Lernstand. Ohne das wäre jede Ziehung eine andere Frage.
   ============================================================================ */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import App from "@/App";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";
import { BEREICHE } from "@/kern/route";
import { FRAGEN } from "@/daten/laden";
import { wirkTyp } from "@/fragetypen/register";
import { bedeutungsbaum } from "./bedeutungsbaum";

const JETZT = new Date("2026-09-21T09:00:00+02:00").getTime();

/** mulberry32 – kleiner, bekannter Zufallsgenerator mit festem Startwert. */
function geseedet(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MC = FRAGEN.filter((f) => f.typ === "mc");
/** Ein Lernstand mit etwas darin – sonst zeigten Listen nur ihren Leerzustand.
    N31: VOLLSTAENDIG wie ihn die App schreibt - ein Teilstand waere ein „reparierter“ (E25). */
const STAND = {
  ...leererStand(),
  pruefungsdatum: "2026-11-25",
  markiert: { [MC[0].id]: 1 },
  fehlerDeck: { [MC[1].id]: { streak: 0, due: JETZT - 86400000 } },
};

beforeEach(() => {
  cleanup();
  localStorage.clear();
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify(STAND));
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(JETZT);
  vi.spyOn(Math, "random").mockImplementation(geseedet(42));
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

async function zeichne(hash: string): Promise<string> {
  history.replaceState(null, "", hash);
  render(<App />);
  await act(async () => {});
  return bedeutungsbaum(document.body);
}

describe("Schnappschuss je Bereich", () => {
  for (const b of BEREICHE.filter((x) => x !== "frage")) {
    it(b, async () => {
      await expect(await zeichne("#" + b)).toMatchFileSnapshot(`./__schnappschuss__/bereich-${b}.txt`);
    });
  }
});

describe("Schnappschuss je Fragetyp (Einzelfrage)", () => {
  /* Die erste Frage je wirkendem Typ, nach Kennung sortiert – stabil, solange der
     Bestand an dieser Stelle gleich bleibt. */
  const jeTyp = new Map<string, string>();
  for (const f of [...FRAGEN].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!jeTyp.has(wirkTyp(f))) jeTyp.set(wirkTyp(f), f.id);
  }
  for (const [typ, id] of [...jeTyp.entries()].sort()) {
    it(`${typ} (${id})`, async () => {
      await expect(await zeichne("#frage=" + id)).toMatchFileSnapshot(`./__schnappschuss__/typ-${typ}.txt`);
    });
  }
});

describe("Der Schnappschuss ist deterministisch", () => {
  it("zweimal derselbe Bereich ergibt zweimal denselben Baum", async () => {
    const a = await zeichne("#ueben");
    cleanup(); localStorage.setItem(LS_SCHLUESSEL, JSON.stringify(STAND));
    vi.spyOn(Math, "random").mockImplementation(geseedet(42));
    const b = await zeichne("#ueben");
    expect(b).toBe(a);
  });
});
