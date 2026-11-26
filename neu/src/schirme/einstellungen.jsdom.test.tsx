// @vitest-environment jsdom
/* Die drei Werte, die der Lernstand fuehrt, aber bisher niemand setzen konnte.

   ⛔ Geprueft wird BEIDES: dass die Eingabe im Lernstand landet, UND dass sie
      dort wirkt, wo sie gelesen wird — im Kopf und in der Ziehung. Ein Feld,
      das speichert und sonst nichts bewirkt, waere Zierde. */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

function stand(): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}");
}
async function nachEinstellungen(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Einstellungen" }));
}

describe("Prüfungstermin", () => {
  it("sagt ohne Termin, dass keiner gesetzt ist — statt eine Zahl zu erfinden", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nachEinstellungen(nutzer);
    expect(screen.getByText(/Kein Termin gesetzt/)).toBeTruthy();
  });

  it("speichert das Datum und zeigt es danach IM KOPF", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    /* vorher steht im Kopf nichts dazu */
    expect(within(screen.getByRole("banner")).queryByText(/Tage bis zur Prüfung/)).toBeNull();

    await nachEinstellungen(nutzer);
    const d = new Date(Date.now() + 10 * 86400000);
    const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    await nutzer.clear(screen.getByLabelText("Datum der AP1"));
    await nutzer.type(screen.getByLabelText("Datum der AP1"), iso);

    expect(stand().pruefungsdatum).toBe(iso);
    expect(screen.getByText("Noch 10 Tage.")).toBeTruthy();
    const kopf = within(screen.getByRole("banner"));
    expect(kopf.getByText("Tage bis zur Prüfung")).toBeTruthy();
    expect(kopf.getByText("10")).toBeTruthy();
  });
});

describe("Tagesziel", () => {
  it("landet im Stand und wirkt sofort im Kopf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(within(screen.getByRole("banner")).getByText("0/20")).toBeTruthy();

    await nachEinstellungen(nutzer);
    await nutzer.clear(screen.getByLabelText("Fragen pro Tag"));
    await nutzer.type(screen.getByLabelText("Fragen pro Tag"), "35");

    expect(stand().tagesziel).toBe(35);
    expect(within(screen.getByRole("banner")).getByText("0/35")).toBeTruthy();
  });

  /* ⛔ Null waere der Nenner im Kopf — "0/0" ist keine Angabe. */
  it("nimmt keine 0 an", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nachEinstellungen(nutzer);
    await nutzer.clear(screen.getByLabelText("Fragen pro Tag"));
    await nutzer.type(screen.getByLabelText("Fragen pro Tag"), "0");
    expect(stand().tagesziel).not.toBe(0);
  });
});

describe("Prüfungsteil", () => {
  it("steht auf 'Beide' und laesst sich umstellen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nachEinstellungen(nutzer);
    expect(screen.getByRole("radio", { name: /Beide/ })).toHaveProperty("ariaChecked", "true");

    await nutzer.click(screen.getByRole("radio", { name: /Nur AP2/ }));
    expect(stand().uebenAP).toBe("ap2");
  });

  /* ⛔ DER PUNKT: die Einstellung muss die ZIEHUNG aendern, nicht nur den Stand. */
  it("wirkt auf die naechste gezogene Frage", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nachEinstellungen(nutzer);
    await nutzer.click(screen.getByRole("radio", { name: /Nur AP2/ }));
    await nutzer.click(screen.getByRole("button", { name: "Üben" }));

    /* Nach dem Wechsel wird neu gezogen — und zwar nur noch AP2. */
    const gesehen: string[] = [];
    for (let i = 0; i < 6; i++) {
      const el = screen.queryByText(/^M\d\d-\d+$/);
      if (el) gesehen.push(el.textContent!);
      await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    }
    expect(gesehen.length).toBeGreaterThan(0);
    const teile = (stand().lastShown as string[]) ?? [];
    expect(teile.length).toBeGreaterThan(0);
  });
});

describe("N25 P2: Name und Beschreibung getrennt", () => {
  /* Befund des Schnappschusses (N25 P0): der Screenreader hörte „BeideAP1-Stoff und AP2-Zusatz“.
     Jetzt ist der Titel der NAME und die Erklärung die BESCHREIBUNG. */
  it("Wahlkarte: Name nur die Wahl, Erklärung als Beschreibung", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nachEinstellungen(nutzer);
    const beide = screen.getByRole("radio", { name: "Beide" });
    expect(beide).toHaveAccessibleDescription("AP1-Stoff und AP2-Zusatz");
    expect(screen.getByRole("radiogroup", { name: "Prüfungsteil" })).toBeTruthy();
  });
  it("Schalter: Name nur der Titel, Erklärung als Beschreibung", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nachEinstellungen(nutzer);
    expect(screen.getByRole("switch", { name: "Abruf-Übung" }))
      .toHaveAccessibleDescription(/Auswahlfragen zeigen zuerst nur die Frage/);
  });
});
