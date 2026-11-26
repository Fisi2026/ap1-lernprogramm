// @vitest-environment jsdom
/* ⚠️ N24: ALLE Staende hier tragen `abrufAn: false`. Die Abruf-Uebung ist
   Voreinstellung (alte App, Nutzer-Entscheid 23.07.) und verdeckt mc/mehrfach/
   dropdown hinter einem Knopf — diese Datei prueft etwas anderes. Die Abruf-
   Uebung selbst prueft schalter.jsdom.test.tsx. */
/* ============================================================================
   N21: DER SCHIRM „TAGESSERIE" — durch die echte App und an einem festen Lauf

   ⚠️ Durch die App ist die Ziehung zufällig; dort wird gemessen, was für JEDE
      Ziehung gilt (Gebiet, fünf Karten, gebucht, `serieDone`, Wiedereinstieg).
      Das Zählen der richtigen Antworten braucht bekannte Fragen — dafür ein
      fester Lauf aus zwei mc-Fragen (gebauter Fall).
   ============================================================================ */
import { useState } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { istTyp, type Frage } from "@/daten/typen";
import { gebietName } from "@/kern/lernen";
import { useLernstand } from "@/huelle/useLernstand";
import { tagVon } from "@/kern/tagesserie";
import { Tagesserie, type SerienLauf } from "./Tagesserie";

const POOL: Record<string, Frage> = {};
for (const f of FRAGEN) POOL[f.id] = f;
const gespeichert = (): Record<string, any> => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
const legeStand = (extra: Record<string, unknown>) =>
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, abrufAn: false, ...extra }));
const kennung = () => screen.getByText(/^M\d\d-\d+$/).textContent!;
const A4 = gebietName("A4");
/** Antworten, egal welcher Typ gezogen wurde: „Aufgeben", und wo der Mensch urteilt
    (`freitext`/`erklaeren` buchen „Aufgeben" absichtlich nicht), „Wusste ich nicht". */
async function antworte(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
  const selbst = screen.queryByRole("button", { name: /^Wusste ich nicht/ });  /* der Vorschlag hängt „(Vorschlag)" an */
  if (selbst) await nutzer.click(selbst);
}

/** Stand, in dem A4 das schwächste Gebiet ist. */
function a4Schwach() {
  const st: Record<string, unknown> = {};
  for (const g of ["A1", "A2", "A3", "A5", "A4"]) {
    const f = FRAGEN.find((x) => x.gebiet === g)!;
    st["T:" + f.modul + ":" + f.thema] = g === "A4" ? { richtig: 1, gesamt: 6 } : { richtig: 5, gesamt: 6 };
  }
  legeStand({ statistik: st });
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

describe("Tagesserie durch die App", () => {
  it("fünf Karten aus A4, weiter erst nach der Antwort, gebucht, serieDone gesetzt", async () => {
    a4Schwach();
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Tagesserie" }));
    expect(screen.getByRole("heading", { name: A4 })).toBeTruthy();
    const gesehen: string[] = [];
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Frage ${i + 1} von 5 · bisher 0 richtig`)).toBeTruthy();
      const id = kennung();
      gesehen.push(id);
      expect(POOL[id].gebiet).toBe("A4");
      const weiter = screen.getByRole("button", { name: i < 4 ? "Nächste Frage" : "Serie abschließen" });
      expect((weiter as HTMLButtonElement).disabled, "vor der Antwort gesperrt").toBe(true);
      expect(gespeichert().serieDone ?? "").toBe("");
      await antworte(nutzer);
      expect((weiter as HTMLButtonElement).disabled, "nach der Antwort frei").toBe(false);
      await nutzer.click(weiter);
    }
    expect(new Set(gesehen).size).toBe(5);
    expect(screen.getByText("0 von 5")).toBeTruthy();
    const s = gespeichert();
    expect(s.serieDone).toBe(tagVon(Date.now()));
    expect((s.antworten as unknown[]).length).toBe(5);
    /* ⚠️ 40 s statt der 20 s aus vitest.config: fünf Karten mit Antwort und Blättern
       liefen im vollen Lauf (12 Worker) in die Zeitgrenze, allein in 0,6 s. Eine
       Zeitgrenze soll einen Hänger fangen, nicht die Auslastung messen. */
  }, 40000);

  it("Bereichswechsel mitten in der Serie: dieselbe Karte an derselben Stelle", async () => {
    a4Schwach();
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Tagesserie" }));
    await antworte(nutzer);
    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage" }));
    const zweite = kennung();
    await nutzer.click(screen.getByRole("button", { name: "Statistik" }));
    await nutzer.click(screen.getByRole("button", { name: "Tagesserie" }));
    expect(kennung()).toBe(zweite);
    expect(screen.getByText("Frage 2 von 5 · bisher 0 richtig")).toBeTruthy();
  });

  it("das Gebiet bleibt, auch wenn die Antworten die Statistik kippen", async () => {
    /* Neuer Lerner: A1 ist nur das am wenigsten geübte Gebiet. Schon nach der ersten
       Antwort ist es das nicht mehr — die alte App wechselte hier (gemessen 17.09.). */
    const A1 = gebietName("A1");
    legeStand({ serieDone: tagVon(Date.now()) });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Tagesserie" }));
    expect(screen.getByText(/Heute schon absolviert/)).toBeTruthy();
    for (let i = 0; i < 5; i++) {
      expect(screen.getByRole("heading", { name: A1 })).toBeTruthy();
      expect(POOL[kennung()].gebiet).toBe("A1");
      await antworte(nutzer);
      await nutzer.click(screen.getByRole("button", { name: i < 4 ? "Nächste Frage" : "Serie abschließen" }));
    }
    expect(screen.getByText(/richtig im Gebiet/)).toBeTruthy();
    /* nach Abschluss: beim nächsten Betreten eine NEUE Serie */
    await nutzer.click(screen.getByRole("button", { name: "Zum Üben" }));
    await nutzer.click(screen.getByRole("button", { name: "Tagesserie" }));
    expect(screen.getByText("Frage 1 von 5 · bisher 0 richtig")).toBeTruthy();
  }, 40000);
});

describe("Tagesserie an einem festen Lauf (gebauter Fall)", () => {
  const MC = FRAGEN.filter((f) => istTyp(f, "mc")).filter((f) => typeof f.loesungIndex === "number").slice(0, 2);
  function Buehne() {
    const lernstand = useLernstand();
    const [lauf, setLauf] = useState<SerienLauf | null>({
      gebiet: MC[0].gebiet, ids: MC.map((f) => f.id), pos: 0, richtig: 0, beantwortet: false, fertig: false,
    });
    return lauf ? <Tagesserie lernstand={lernstand} lauf={lauf} setzeLauf={setLauf} zumUeben={() => {}} /> : null;
  }
  it("zählt richtig beantwortete Karten genau einmal", async () => {
    expect(MC.length).toBe(2);
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, abrufAn: false }));
    const nutzer = userEvent.setup({ delay: null });
    render(<Buehne />);
    for (const [i, f] of MC.entries()) {
      const optionen = f.optionen as string[];
      if (i === 0) await nutzer.click(screen.getByRole("radio", { name: optionen[f.loesungIndex as number] }));
      await nutzer.click(screen.getByRole("button", { name: i === 0 ? "Lösung prüfen" : "Aufgeben" }));
      expect(screen.getByText(`Frage ${i + 1} von 2 · bisher 1 richtig`)).toBeTruthy();
      await nutzer.click(screen.getByRole("button", { name: i === 0 ? "Nächste Frage" : "Serie abschließen" }));
    }
    expect(screen.getByText("1 von 2")).toBeTruthy();
    expect(screen.getByText(/Dranbleiben/)).toBeTruthy();
  });
});
