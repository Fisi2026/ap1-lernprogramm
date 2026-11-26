// @vitest-environment jsdom
/* Klausurvorbereitung mit einem GEBAUTEN Set (Prop `set`): Kopfzeile, Themenwahl, "Alle Themen",
   Leer-Zustand, Serien-Angebot nur aus dem Set, Buchung beim Ziehen. Das echte Set pruefen
   klausurvorbereitung.jsdom.test.tsx und kern/klausur.test.ts. */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Klausurvorbereitung } from "./Klausurvorbereitung";
import { useLernstand } from "@/huelle/useLernstand";
import { FRAGEN } from "@/daten/laden";
import { LS_SCHLUESSEL } from "@/kern/stand";
import type { KlausurSet } from "@/kern/klausur";
import type { Frage } from "@/daten/typen";

type Mc = Frage & { typ: "mc"; optionen: string[]; loesungIndex: number };
const istMc = (f: Frage): f is Mc =>
  f.typ === "mc" && Array.isArray(f.optionen) && new Set(f.optionen as string[]).size === (f.optionen as string[]).length;

/** Zwei Gruppen mc-Fragen mit gleichem Modul und Thema (je vier), damit ein Serien-Angebot moeglich ist. */
function gruppen(): [Mc[], Mc[]] {
  const je = new Map<string, Mc[]>();
  for (const f of FRAGEN.filter(istMc)) {
    if (!f.thema) continue;
    const k = f.modul + "|" + f.thema;
    je.set(k, [...(je.get(k) ?? []), f]);
  }
  const voll = [...je.values()].filter((l) => l.length >= 4);
  return [voll[0]!.slice(0, 4), voll[1]!.slice(0, 4)];
}
const [A, B] = gruppen();
const IDS_A = A.map((f) => f.id);
const IDS_B = B.map((f) => f.id);

function baue(extra: Partial<KlausurSet> = {}): KlausurSet {
  return {
    name: "Probeklausur", datum: "2026-10-20",
    themen: [
      { nr: 1, titel: "Alpha", generator: null, ids: IDS_A },
      { nr: 2, titel: "Beta", generator: null, ids: IDS_B },
    ],
    ...extra,
  };
}

function Buehne({ set }: { set: KlausurSet }) {
  const lernstand = useLernstand();
  return <Klausurvorbereitung lernstand={lernstand} set={set} />;
}
const angezeigt = () => screen.getByText(/^M\d\d-\d+$/).textContent!;
const gruppe = () => screen.getByRole("group", { name: "Themen der Klausur" });
const knopf = (name: string | RegExp) => within(gruppe()).getByRole("button", { name });
const gespeichert = () => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}") as Record<string, unknown>;

beforeEach(() => { localStorage.clear(); localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, abrufAn: false })); });
afterEach(cleanup);

describe("Kopfzeile", () => {
  it("Name, deutsches Datum und die Menge der Fragen", () => {
    render(<Buehne set={baue()} />);
    expect(screen.getByRole("heading", { name: "Probeklausur" })).toBeTruthy();
    expect(screen.getByText((_, el) => el?.tagName === "SPAN" && el.textContent === "Klausur ca. 20.10.2026 · 8 Fragen aus dem Pool")).toBeTruthy();
  });

  it("ein Datum, das keine drei Teile hat, bleibt unveraendert stehen", () => {
    render(<Buehne set={baue({ datum: "2026-10" })} />);
    expect(screen.getByText(/Klausur ca\. 2026-10 /)).toBeTruthy();
    cleanup();
    render(<Buehne set={baue({ datum: "2026--20" })} />);
    expect(screen.getByText(/Klausur ca\. 2026--20 /)).toBeTruthy();
    cleanup();
    render(<Buehne set={baue({ datum: "" })} />);
    expect(screen.getByText(/Klausur ca\.\s+·/)).toBeTruthy();
  });
});

describe("K3-E40: Punkte und Fortschritt", () => {
  it("mit Punkten: Summe in der Kopfzeile, je Knopf Punkte und geuebt/gesamt; die gezogene Frage zaehlt als geuebt", () => {
    const set = baue({ themen: [
      { nr: 1, titel: "Alpha", generator: null, punkte: 21, ids: IDS_A },
      { nr: 2, titel: "Beta", generator: null, punkte: 6, ids: IDS_B },
    ] });
    render(<Buehne set={set} />);
    expect(screen.getByText((_, el) => el?.tagName === "SPAN" && el.textContent === "Klausur ca. 20.10.2026 · 27 Punkte · 8 Fragen aus dem Pool")).toBeTruthy();
    const gezogen = angezeigt();
    const inA = IDS_A.includes(gezogen);
    expect(knopf(`Alpha, 21 Punkte, 4 Fragen, ${inA ? 1 : 0} geübt`).textContent).toBe(`Alpha21 P.${inA ? 1 : 0}/4`);
    expect(knopf(`Beta, 6 Punkte, 4 Fragen, ${inA ? 0 : 1} geübt`)).toBeTruthy();
  });
});

describe("Themenknoepfe", () => {
  it("jeder Knopf nennt Titel und Zahl der vorhandenen Fragen (eine Kennung ohne Frage zaehlt nicht); 'Alle Themen' steht gedrueckt", () => {
    const set = baue();
    set.themen[0]!.ids = [...IDS_A, "M99-999"];
    render(<Buehne set={set} />);
    expect(knopf(/^Alpha, 4 Fragen, [01] geübt$/)).toBeTruthy();
    expect(knopf(/^Beta, 4 Fragen, [01] geübt$/)).toBeTruthy();
    expect(knopf(/Alle Themen/).getAttribute("aria-pressed")).toBe("true");
    expect(knopf(/^Alpha, 4 Fragen, /).getAttribute("aria-pressed")).toBe("false");
  });

  it("an- und abwaehlen: der Knopf wechselt, 'Alle Themen' folgt, gezogen wird nur aus der Wahl", async () => {
    const n = userEvent.setup({ delay: null });
    render(<Buehne set={baue()} />);
    await n.click(knopf(/^Beta, 4 Fragen, /));
    expect(knopf(/^Beta, 4 Fragen, /).getAttribute("aria-pressed")).toBe("true");
    expect(knopf(/Alle Themen/).getAttribute("aria-pressed")).toBe("false");
    expect(IDS_B).toContain(angezeigt());
    await n.click(knopf(/^Alpha, 4 Fragen, /));
    expect(knopf(/^Alpha, 4 Fragen, /).getAttribute("aria-pressed")).toBe("true");
    expect(knopf(/^Beta, 4 Fragen, /).getAttribute("aria-pressed")).toBe("true");
    await n.click(knopf(/^Beta, 4 Fragen, /));
    expect(knopf(/^Beta, 4 Fragen, /).getAttribute("aria-pressed")).toBe("false");
    expect(knopf(/^Alpha, 4 Fragen, /).getAttribute("aria-pressed")).toBe("true");
    expect(IDS_A).toContain(angezeigt());
    await n.click(knopf(/^Alpha, 4 Fragen, /));
    expect(knopf(/Alle Themen/).getAttribute("aria-pressed")).toBe("true");
  });

  it("'Alle Themen' hebt die Wahl auf und zieht neu", async () => {
    const n = userEvent.setup({ delay: null });
    render(<Buehne set={baue()} />);
    await n.click(knopf(/^Alpha, 4 Fragen, /));
    await n.click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
    await n.click(knopf(/Alle Themen/));
    expect(knopf(/^Alpha, 4 Fragen, /).getAttribute("aria-pressed")).toBe("false");
    expect(knopf(/Alle Themen/).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Aufgeben" }), "neue Frage steht offen da").toBeTruthy();
  });

  it("'Alle Themen' bei schon gewaehltem 'alle' aendert nichts: die beantwortete Karte bleibt", async () => {
    const n = userEvent.setup({ delay: null });
    render(<Buehne set={baue()} />);
    const id = angezeigt();
    await n.click(screen.getByRole("button", { name: "Aufgeben" }));
    await n.click(knopf(/Alle Themen/));
    expect(angezeigt()).toBe(id);
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
  });
});

describe("Auswahl sichtbar", () => {
  it("gewaehlte Themen sind 'secondary' mit Ring, ungewaehlte 'outline' ohne; 'Alle Themen' umgekehrt", async () => {
    const n = userEvent.setup({ delay: null });
    render(<Buehne set={baue()} />);
    const sicht = (name: string | RegExp) => [knopf(name).getAttribute("data-variant"), knopf(name).classList.contains("ring-1")];
    expect(sicht(/Alle Themen/)).toEqual(["secondary", false]);
    expect(sicht(/^Alpha, 4 Fragen, /)).toEqual(["outline", false]);
    await n.click(knopf(/^Alpha, 4 Fragen, /));
    expect(sicht(/Alle Themen/)).toEqual(["outline", false]);
    expect(sicht(/^Alpha, 4 Fragen, /)).toEqual(["secondary", true]);
    expect(sicht(/^Beta, 4 Fragen, /)).toEqual(["outline", false]);
  });

  it("ein anderes Set (neu uebergeben) baut die Knoepfe neu", () => {
    const { rerender } = render(<Buehne set={baue()} />);
    expect(knopf(/^Alpha, 4 Fragen, /)).toBeTruthy();
    rerender(<Buehne set={baue({ themen: [{ nr: 7, titel: "Gamma", generator: null, ids: IDS_B }] })} />);
    expect(knopf(/^Gamma, 4 Fragen, /)).toBeTruthy();
    expect(within(gruppe()).queryByRole("button", { name: /Alpha/ })).toBeNull();
  });
});

describe("Leerer Stoff", () => {
  it("ein Set ohne Themen sagt es und zeigt keine Karte", () => {
    render(<Buehne set={baue({ themen: [] })} />);
    expect(screen.getByText("Gerade kein Klausurstoff.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
    expect(screen.getByText(/0 Fragen aus dem Pool/)).toBeTruthy();
    expect(gespeichert().uebenZaehler ?? 0, "nichts gezogen, nichts gebucht").toBe(0);
  });

  it("ein Set mit Stoff zeigt die Karte und nicht den Leer-Hinweis", () => {
    render(<Buehne set={baue()} />);
    expect(screen.queryByText("Gerade kein Klausurstoff.")).toBeNull();
    expect(screen.getByRole("button", { name: "Aufgeben" })).toBeTruthy();
  });
});

describe("Ziehen bucht", () => {
  it("die gezogene Frage steht als gesehen im Speicher, der Zaehler laeuft", () => {
    render(<Buehne set={baue()} />);
    const s = gespeichert();
    expect(s.uebenZaehler).toBe(1);
    expect(Object.keys(s.seen as object)).toContain(angezeigt());
  });
});

describe("Serien-Angebot (#60) nur aus dem Set", () => {
  async function antworte(n: ReturnType<typeof userEvent.setup>, id: string, richtig: boolean) {
    const f = FRAGEN.find((x) => x.id === id) as Mc;
    const wahl = richtig ? f.loesungIndex : (f.loesungIndex + 1) % f.optionen.length;
    await n.click(screen.getByRole("radio", { name: f.optionen[wahl]! }));
    await n.click(screen.getByRole("button", { name: "Lösung prüfen" }));
  }

  it("falsch beantwortet: Angebot mit Thema; Klick startet die Serie", async () => {
    const n = userEvent.setup({ delay: null });
    render(<Buehne set={baue()} />);
    const id = angezeigt();
    expect(screen.queryByRole("button", { name: /Mehr zu diesem Thema/ })).toBeNull();
    await antworte(n, id, false);
    const angebot = screen.getByRole("button", { name: /Mehr zu diesem Thema/ });
    expect(angebot.textContent).toContain((FRAGEN.find((x) => x.id === id) as Mc).thema);
    await n.click(angebot);
    expect(screen.getByText(/Themen-Serie läuft — noch 3 Fragen/)).toBeTruthy();
  });

  it("richtig beantwortet: kein Angebot", async () => {
    const n = userEvent.setup({ delay: null });
    render(<Buehne set={baue()} />);
    await antworte(n, angezeigt(), true);
    expect(screen.queryByRole("button", { name: /Mehr zu diesem Thema/ })).toBeNull();
  });

  it("steht im Set nur EINE Frage, gibt es kein Angebot - auch wenn der Pool Nachbarn kennt", async () => {
    const n = userEvent.setup({ delay: null });
    const eine = A[0]!;
    render(<Buehne set={{ name: "Eins", datum: "2026-10-20", themen: [{ nr: 1, titel: "Nur", generator: null, ids: [eine.id] }] }} />);
    expect(angezeigt()).toBe(eine.id);
    await antworte(n, eine.id, false);
    expect(screen.queryByRole("button", { name: /Mehr zu diesem Thema/ })).toBeNull();
  });
});

/* „Kann ich schon“ auch hier (Nutzer-Wunsch 25.11.2026, BUILD_LOG 275). */
describe("Kann ich schon in der Klausurvorbereitung", () => {
  it("der Knopf steht an der Karte; Klick blendet die Frage aus, bucht sie richtig und zieht eine andere", async () => {
    render(<Buehne set={baue()} />);
    const erste = angezeigt();
    await userEvent.setup().click(screen.getByRole("button", { name: "Kann ich schon" }));
    const s = gespeichert() as { gekonnt?: Record<string, number>; stats?: Record<string, unknown> };
    expect(Object.keys(s.gekonnt ?? {})).toEqual([erste]);
    expect(angezeigt()).not.toBe(erste);
  });
  it("uebersprungene Fragen zieht die Klausurvorbereitung nicht mehr (alle bis auf eine ausgeblendet)", () => {
    const rest = [...IDS_A, ...IDS_B];
    const bleibt = rest.pop()!;
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 2, abrufAn: false, gekonnt: Object.fromEntries(rest.map((id) => [id, 1])),
    }));
    render(<Buehne set={baue()} />);
    expect(angezeigt()).toBe(bleibt);
  });
  it("sind alle Fragen der Auswahl uebersprungen, nennt die Leer-Anzeige „Markierte Fragen“", () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 2, abrufAn: false, gekonnt: Object.fromEntries([...IDS_A, ...IDS_B].map((id) => [id, 1])),
    }));
    render(<Buehne set={baue()} />);
    expect(screen.getByText(/mit „Kann ich schon“ übersprungen.*„Markierte Fragen“/)).toBeTruthy();
    expect(screen.queryByText(/Wähle ein anderes Fach/)).toBeNull();
  });
});
