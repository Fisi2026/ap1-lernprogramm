// @vitest-environment jsdom
/* ⚠️ N24: ALLE Staende hier tragen `abrufAn: false`. Die Abruf-Uebung ist
   Voreinstellung (alte App, Nutzer-Entscheid 23.07.) und verdeckt mc/mehrfach/
   dropdown hinter einem Knopf — diese Datei prueft etwas anderes. Die Abruf-
   Uebung selbst prueft schalter.jsdom.test.tsx. */
/* ============================================================================
   DIE NAHT: bucht die Karte wirklich, und landet es wirklich im Speicher?

   ⛔ `verbuchen.gleichheit.test.ts` beweist die Rechnung, `urteil.test.ts` die
      Regel — beide OHNE Oberflaeche. Genau so war der Fehler vom 11.09. gebaut:
      161 gruene Tests, und die App startete nicht, weil keiner von ihnen die Naht
      ging, an der es brach.
   ►► Dieser Test geht sie: echter Schirm, echter Klick, echter localStorage.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
/* ⚠️ Gezeichnet wird die GANZE App, nicht nur der Schirm: seit dem 14.09.2026
   kommt der Lernstand von oben (App.tsx). Ein Testaufbau, der ihn selbst
   zusammensteckt, waere eine zweite Verdrahtung neben der echten — und genau
   die koennte auseinanderlaufen. So wird die echte mitgeprueft. */
import App from "@/App";
import { Karteikarte } from "./Karteikarte";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { leererStand } from "@/kern/stand";
import type { Lernstand } from "@/kern/stand";
import { serienKandidaten } from "@/kern/serie";

function gespeichert(): Record<string, unknown> | null {
  const roh = localStorage.getItem(LS_SCHLUESSEL);
  return roh ? (JSON.parse(roh) as Record<string, unknown>) : null;
}

/** Erzwingt, WELCHE Frage gezogen wird — ueber den Fehler-Deck-Takt.
    ⛔ Noetig, weil die Ziehung wuerfelt: ein Test, der "die erste Karte" nimmt,
       prueft bei jedem Lauf einen anderen Fragetyp und flackert. */
function stelleFrage(frage: (typeof FRAGEN)[number]) {
  localStorage.setItem(
    LS_SCHLUESSEL,
    JSON.stringify({
      version: 1, abrufAn: false,
      uebenZaehler: 4,                       // +1 = 5 -> Fehler-Deck-Takt
      fehlerDeck: { [frage.id]: { streak: 0, due: Date.now() - 86400000 } },
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
  cleanup();
  history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */
});

describe("Der Uebungsschirm bucht in den Lernstand", () => {
  it("speichert nach einer richtigen Antwort Statistik und Tageszaehler", async () => {
    /* Eine BESTIMMTE mc-Frage, damit der Test nicht vom Wuerfel abhaengt. */
    const frage = FRAGEN.find((f) => f.typ === "mc")!;
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);

    /* ⚠️ SEIT N6c: der Schirm ZIEHT beim Betreten, und Ziehen schreibt bereits
       (seen, lastShown, uebenZaehler) — genau wie die alte App. */
    const vorAntwort = gespeichert()!;
    expect(vorAntwort.uebenZaehler).toBe(5);
    expect(vorAntwort.statistik, "gezogen ist nicht gebucht").toEqual({});

    const optionen = frage.optionen as string[];
    await nutzer.click(screen.getByRole("radio", { name: optionen[frage.loesungIndex as number] }));
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));

    const s = gespeichert()!;
    const statistik = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(statistik[frage.modul]).toEqual({ richtig: 1, gesamt: 1 });
    expect(statistik["T:" + frage.modul + ":" + frage.thema]).toEqual({ richtig: 1, gesamt: 1 });
    expect(Object.keys(s.dailyCounts as object)).toHaveLength(1);
    /* richtig beantwortet -> raus aus dem Fehler-Deck bzw. Streak hoch */
    expect((s.antworten as unknown[]).length).toBe(1);
  });

  /* ⛔⛔ DIESER TEST HAT GEFLACKERT, UND DER GRUND WAR KEIN FEHLER, SONDERN EINE
     ENTSCHEIDUNG: welche Frage gezogen wird, entscheidet der Zufall — und bei
     `freitext`/`erklaeren` bucht "Aufgeben" ABSICHTLICH nichts (urteilAus gibt
     dort null zurueck: der Mensch urteilt, und "Aufgeben" nimmt ihm das nicht ab).
     Traf die Ziehung so eine Frage, fiel der Test.
     ►► Statt den Zufall zu bekaempfen, wird eine BESTIMMTE Frage erzwungen: ueber
        den Fehler-Deck-Takt. Damit ist der Typ bekannt, und beide Faelle koennen
        ausdruecklich geprueft werden. */
  it('bucht "Aufgeben" bei einem maschinell bewerteten Typ als falsch', async () => {
    const frage = FRAGEN.find((f) => f.typ === "mc")!;
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(frage.id);

    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));

    const s = gespeichert()!;
    expect(s.fehlerDeck).toHaveProperty(frage.id);
    const statistik = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(statistik[frage.modul]).toEqual({ richtig: 0, gesamt: 1 });
  });

  it('bucht "Aufgeben" bei freitext NICHT — dort urteilt der Mensch', async () => {
    const frage = FRAGEN.find((f) => f.typ === "freitext")!;
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(frage.id);

    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(gespeichert()!.statistik, "ohne Selbsteinschaetzung wird nichts gebucht").toEqual({});

    /* erst der Knopf des Menschen bucht */
    await nutzer.click(screen.getByRole("button", { name: /Wusste ich nicht/ }));
    const s = gespeichert()!;
    const statistik = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(statistik[frage.modul]).toEqual({ richtig: 0, gesamt: 1 });
    expect(s.fehlerDeck).toHaveProperty(frage.id);
  });

  /* ⛔ DER FALL, DEN N6c NEU MACHT: eine Frage aus dem VERLAUF darf nicht noch
     einmal buchen. In der alten App ist das #52 ("Live" = die neueste, noch
     unbeantwortete Frage); hier bekommt die Karte dann gar kein `buche`. */
  it("eine Frage aus dem Verlauf zaehlt nicht noch einmal", async () => {
    /* ⚠️ Erste Frage erzwungen (mc), zweite beliebig — die zweite wird
       ABSICHTLICH nicht beantwortet, sonst haengt der Test wieder am Wuerfel. */
    const erste = FRAGEN.find((f) => f.typ === "mc")!;
    stelleFrage(erste);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);

    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    const summe = (s: Record<string, unknown>) =>
      Object.entries(s.statistik as Record<string, { gesamt: number }>)
        .filter(([k]) => !k.startsWith("T:"))
        .reduce((n, [, e]) => n + e.gesamt, 0);
    expect(summe(gespeichert()!), "eine beantwortete Frage").toBe(1);

    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    await nutzer.click(screen.getByRole("button", { name: "← Zurück" }));

    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(erste.id);
    expect(screen.getByText(/aus dem Verlauf/)).toBeTruthy();
    expect(summe(gespeichert()!), "im Verlauf wird nichts gebucht").toBe(1);
    /* und die Karte bietet gar keinen Weg mehr an, es doch zu tun */
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
  });

  it("liest einen vorhandenen Stand und schreibt ihn nicht platt", async () => {
    /* ⛔ Der Fall, der den Fortschritt kosten wuerde: ein gefuellter Stand liegt
       da, die neue Oberflaeche startet — und der Stand ist danach noch ganz.
       ⚠️ Die gezogene Frage ist erzwungen (mc, bekanntes Modul), sonst haengt die
          letzte Zusage am Wuerfel: bei `freitext` bucht "Aufgeben" absichtlich
          nichts, und der Test flackerte in einem von fuenf Laeufen. */
    const frage = FRAGEN.find((f) => f.typ === "mc" && f.modul === "M01")!;
    const vorher = {
      version: 1, abrufAn: false,
      seen: { "M01-001": true },
      statistik: { M01: { richtig: 12, gesamt: 20 } },
      uebenZaehler: 4,                       // +1 = 5 -> Fehler-Deck-Takt
      fehlerDeck: { [frage.id]: { streak: 0, due: Date.now() - 86400000 } },
      einFeldAusDerZukunft: "bleibt",
    };
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify(vorher));

    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(frage.id);
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));

    const s = gespeichert()!;
    /* `seen` waechst beim Ziehen — gefordert ist, dass der ALTE Eintrag bleibt. */
    expect(s.seen).toHaveProperty("M01-001", true);
    expect(s.uebenZaehler, "4 + eine gezogene Frage").toBe(5);
    /* N31/E25: ein unbekanntes Feld wird beim Laden verworfen (und gesichert, stand.test.ts). */
    expect(s).not.toHaveProperty("einFeldAusDerZukunft");
    const statistik = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    /* M01 stand bei 12/20 — die neue Antwort kommt OBEN DRAUF, ersetzt nicht. */
    expect(statistik.M01).toEqual({ richtig: 12, gesamt: 21 });
  });
});

describe("Der gefaehrliche Fall: zweimal auf eine Selbsteinschaetzung klicken", () => {
  /* ⛔ Bei `freitext` bucht nicht das Pruefen, sondern der Knopf danach. Wer sich
     umentscheidet, klickt einen zweiten — ohne Sperre stuenden dann ZWEI Antworten
     im Stand, und die Statistik waere nach einem Abend Unsinn.
     ⚠️ Der erste Anlauf dieses Tests fuhr ueber "Aufgeben" und Blaettern und war
        damit blind: die Karte wird beim Blaettern ohnehin neu gebaut. Die Sabotage
        (Sperre entfernt) lief gruen durch. Erst dieser Weg trifft die Stelle. */
  it("zaehlt nur die erste Einschaetzung", async () => {
    const frage = FRAGEN.find((f) => f.typ === "freitext")!;
    expect(frage, "kein freitext im Bestand").toBeDefined();

    const gebucht: Array<{ korrekt: boolean; keinFehlerDeck?: boolean | undefined }> = [];
    const nutzer = userEvent.setup({ delay: null });
    render(
      <Karteikarte
        frage={frage}
        nummer={1}
        buche={(_f, korrekt, opt) => gebucht.push({ korrekt, keinFehlerDeck: opt?.keinFehlerDeck })}
      />,
    );

    await nutzer.type(screen.getByLabelText("Deine Antwort"), "eine Antwort");
    await nutzer.click(screen.getByRole("button", { name: "Antwort prüfen" }));
    expect(gebucht, "vor der Selbsteinschaetzung darf nichts gebucht sein").toEqual([]);

    await nutzer.click(screen.getByRole("button", { name: /Wusste ich$/ }));
    await nutzer.click(screen.getByRole("button", { name: /Teilweise/ }));
    await nutzer.click(screen.getByRole("button", { name: /Wusste ich nicht/ }));

    expect(gebucht).toEqual([{ korrekt: true, keinFehlerDeck: false }]);
  });

  it('"Teilweise" als ERSTE Wahl kommt nicht ins Fehler-Deck', async () => {
    const frage = FRAGEN.find((f) => f.typ === "freitext")!;
    const gebucht: Array<{ korrekt: boolean; keinFehlerDeck?: boolean | undefined }> = [];
    const nutzer = userEvent.setup({ delay: null });
    render(
      <Karteikarte
        frage={frage}
        nummer={1}
        buche={(_f, korrekt, opt) => gebucht.push({ korrekt, keinFehlerDeck: opt?.keinFehlerDeck })}
      />,
    );
    await nutzer.type(screen.getByLabelText("Deine Antwort"), "halb gewusst");
    await nutzer.click(screen.getByRole("button", { name: "Antwort prüfen" }));
    await nutzer.click(screen.getByRole("button", { name: /Teilweise/ }));
    expect(gebucht).toEqual([{ korrekt: false, keinFehlerDeck: true }]);
  });
});

describe("Der Schirm ZIEHT, statt zu blaettern", () => {
  it("liefert ueber mehrere Zuege verschiedene Fragen und zaehlt mit", async () => {
    /* ⚠️ ZWEI Bedingungen an das Thema, beide gemessen:
       1. OHNE Generator-Art — sonst faellt jede vierte Runde eine Zufallsaufgabe
          hinein, und die traegt keine Bestands-Kennung.
       2. Mindestens sechs Fragen AUF STUFE 1 — der Stufenfilter greift vor der
          Ziehung. "Netzplan & Puffer" hat 29 Fragen, aber nur EINE auf Stufe 1;
          der erste Anlauf zog deshalb sechsmal dieselbe, voellig zu Recht.
       `M03|Wirtschaftlichkeit & TCO` hat 8 von 30 auf Stufe 1. */
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1, abrufAn: false, themen: ["M03|Wirtschaftlichkeit & TCO"],
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const gesehen: string[] = [];
    for (let i = 0; i < 6; i++) {
      gesehen.push(screen.getByText(/^M\d\d-\d+$/).textContent!);
      if (i < 5) await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    }
    /* ⛔ Der alte Platzhalter lieferte immer dieselbe Folge in Bestandsreihenfolge.
       Die Ziehung wuerfelt gewichtet — verlangt wird nicht Zufall, sondern dass
       es NICHT stur der Reihe nach geht und jede Frage nur einmal kommt. */
    expect(new Set(gesehen).size, `Wiederholung in ${gesehen.join(",")}`).toBe(6);
    expect(gespeichert()!.uebenZaehler).toBe(6);
    expect((gespeichert()!.lastShown as string[]).slice(-6)).toEqual(gesehen);
  });

  /* ⛔ DER KERN DER GANZEN ETAPPE: eine falsch beantwortete Frage kommt wieder.
     Ohne das ist es kein Lernprogramm, sondern ein Fragenblaetterer. */
  it("holt eine faellige Frage aus dem Fehler-Deck zurueck — im Fuenfer-Takt", async () => {
    const faellig = FRAGEN.find((f) => f.modul === "M03")!;
    localStorage.setItem(
      LS_SCHLUESSEL,
      JSON.stringify({
        version: 1, abrufAn: false,
        uebenZaehler: 4,                       // +1 = 5, also der Fehler-Deck-Takt
        fehlerDeck: { [faellig.id]: { streak: 0, due: Date.now() - 86400000 } },
      }),
    );
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(faellig.id);
    expect(screen.getByText(/Wiederholung \(Fehler-Deck\)/)).toBeTruthy();
  });

  it("ausserhalb des Taktes kommt sie NICHT — sonst waere der Takt Zierde", async () => {
    const faellig = FRAGEN.find((f) => f.modul === "M03")!;
    localStorage.setItem(
      LS_SCHLUESSEL,
      JSON.stringify({
        version: 1, abrufAn: false,
        uebenZaehler: 5,                       // +1 = 6, kein Fehler-Deck-Takt
        fehlerDeck: { [faellig.id]: { streak: 0, due: Date.now() - 86400000 } },
      }),
    );
    render(<App />);
    expect(screen.queryByText(/Wiederholung \(Fehler-Deck\)/)).toBeNull();
  });
});

describe("Zufallsaufgaben auf dem Schirm", () => {
  /** Der Generator-Takt: uebenZaehler+1 muss %4===2 sein, und kein Fehler-Deck-Takt. */
  function stelleGeneratorTakt(zaehler = 1) {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, abrufAn: false, uebenZaehler: zaehler }));
  }

  it("zeichnet im Generator-Takt eine Zufallsaufgabe statt einer Pool-Frage", () => {
    stelleGeneratorTakt(1);          // +1 = 2 -> %4===2
    render(<App />);
    expect(screen.getByText("Zufallsaufgabe")).toBeTruthy();
    expect(screen.getByText(/^GEN-/)).toBeTruthy();
    /* ⚠️ getAllBy…: `subnetting` fragt ZWEI Werte ab (antwort2). Der erste Anlauf
       nahm getBy… und fiel in einem von fuenf Laeufen — je nachdem, welche Art
       gezogen wurde. */
    expect(screen.getAllByLabelText(/^Antwort/).length).toBeGreaterThan(0);
  });

  it("bucht richtig: eigene GEN-Zeile UND normale Statistik, aber NIE ins Fehler-Deck", async () => {
    stelleGeneratorTakt(1);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);

    /* Die Loesung steht nach dem Pruefen als "richtig: …" da — also erst
       aufgeben, ablesen, und dann in einem zweiten Lauf richtig antworten waere
       umstaendlich. Hier genuegt: aufgeben, und pruefen was gebucht wurde. */
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));

    const s = gespeichert()!;
    const st = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    const genZeilen = Object.keys(st).filter((k) => k.startsWith("GEN:"));
    expect(genZeilen, "die eigene GEN-Zeile fehlt").toHaveLength(1);
    expect(st[genZeilen[0]]).toEqual({ richtig: 0, gesamt: 1 });
    /* und die normale Statistik ist ebenfalls gefuehrt — so macht es die alte App */
    const module = Object.keys(st).filter((k) => !k.startsWith("GEN:") && !k.startsWith("T:"));
    expect(module, "die Modul-Statistik fehlt").toHaveLength(1);
    /* ⛔ aber nie ins Fehler-Deck */
    expect(s.fehlerDeck).toEqual({});
  });

  it("zeigt nach dem Pruefen den Loesungsweg", async () => {
    stelleGeneratorTakt(1);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.queryByText(/Lösungsweg/)).toBeNull();
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(screen.getByText(/Lösungsweg Schritt für Schritt/)).toBeTruthy();
  });

  /* ⛔ Rauchtest 17.09.2026: als ERSTE Karte der Sitzung gibt es kein „Zurück“ –
     vorher nahm der Knopf die Aufgabe weg und der Schirm hing bei „Wird gezogen …“. */
  it("als erste Karte der Sitzung ist „Zurück“ gesperrt", () => {
    stelleGeneratorTakt(1);
    render(<App />);
    expect(screen.getByText("Zufallsaufgabe")).toBeTruthy();
    const zurueck = screen.getByRole("button", { name: "← Zurück" }) as HTMLButtonElement;
    expect(zurueck.disabled).toBe(true);
  });

  it("nach einer echten Frage fuehrt „Zurück“ von der Zufallsaufgabe auf diese Frage", async () => {
    /* uebenZaehler 0 -> +1 = 1: echte Frage; danach +1 = 2: Generator-Takt */
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, abrufAn: false, uebenZaehler: 0 }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const erste = screen.getByText(/^M\d\d-\d+$/).textContent;
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    await nutzer.click(screen.getByRole("button", { name: /Nächste Frage/ }));
    expect(screen.getByText("Zufallsaufgabe")).toBeTruthy();
    const zurueck = screen.getByRole("button", { name: "← Zurück" }) as HTMLButtonElement;
    expect(zurueck.disabled).toBe(false);
    await nutzer.click(zurueck);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(erste);
    expect(screen.queryByText("Wird gezogen …")).toBeNull();
  });

  it("ausserhalb des Taktes kommt keine Zufallsaufgabe", () => {
    stelleGeneratorTakt(2);          // +1 = 3 -> kein Generator-Takt
    render(<App />);
    expect(screen.queryByText("Zufallsaufgabe")).toBeNull();
  });

  /* ⛔ Der Fall, der die Runde verschenken wuerde: der Takt sagt Generator, aber
     zur Auswahl passt keine Art. Dann muss trotzdem eine Frage kommen. */
  it("faellt auf eine echte Frage zurueck, wenn keine Generator-Art zur Auswahl passt", () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1, abrufAn: false, uebenZaehler: 1,
      themen: ["M01|Projektmerkmale & Meilensteine"],     // kein Generator-Thema
    }));
    render(<App />);
    expect(screen.queryByText("Zufallsaufgabe")).toBeNull();
    expect(screen.getByText(/^M\d\d-\d+$/)).toBeTruthy();
  });
});

describe("Der Verlauf behaelt die gegebene Antwort", () => {
  /* ⛔ Vorher stand beim Zurueckblaettern nur die Loesung da. Bei `freitext` ist
     das genau das Falsche: was man selbst geschrieben hat, ist der Lerninhalt. */
  it("zeigt bei freitext wieder, was man eingetragen hatte", async () => {
    const frage = FRAGEN.find((f) => f.typ === "freitext")!;
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(frage.id);

    await nutzer.type(screen.getByLabelText("Deine Antwort"), "meine eigene Antwort");
    await nutzer.click(screen.getByRole("button", { name: "Antwort prüfen" }));
    await nutzer.click(screen.getByRole("button", { name: /Teilweise/ }));

    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    await nutzer.click(screen.getByRole("button", { name: "← Zurück" }));

    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(frage.id);
    expect(screen.getByText("meine eigene Antwort")).toBeTruthy();
    expect(screen.getByText(/oben steht, was du eingetragen hattest/)).toBeTruthy();
  });

  it("sagt es, wenn damals nichts eingetragen wurde", async () => {
    const frage = FRAGEN.find((f) => f.typ === "mc")!;
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    await nutzer.click(screen.getByRole("button", { name: "← Zurück" }));
    expect(screen.getByText(/nichts eingetragen/)).toBeTruthy();
  });

  it("zeigt bei mc die damals gewaehlte Option wieder als gewaehlt", async () => {
    const frage = FRAGEN.find((f) => f.typ === "mc")!;
    stelleFrage(frage);
    const optionen = frage.optionen as string[];
    const gewaehlt = optionen[frage.loesungIndex as number];
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);

    await nutzer.click(screen.getByRole("radio", { name: gewaehlt }));
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));
    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    await nutzer.click(screen.getByRole("button", { name: "← Zurück" }));

    expect(screen.getByRole("radio", { name: gewaehlt })).toHaveProperty("ariaChecked", "true");
  });
});


/* ============================================================================
   #60: DIE THEMEN-SERIE

   ⛔⛔ `ziehen.ts` nahm eine Serie seit dem ersten Tag entgegen und gab ihr
      Vorrang vor allem anderen — nur GEFUELLT hat sie nie jemand. Der Zweig war
      gruen getestet (ziehen.test.ts fuettert ihn von Hand) und trotzdem tot:
      ►► **Ein Zweig, den kein Aufrufer erreicht, ist kein Feature.** Dieser Test
         geht deshalb ueber den SCHIRM: falsch antworten, Angebot anklicken,
         weiterziehen — und nachsehen, ob wirklich das Thema kommt.
   ============================================================================ */
describe("Die Themen-Serie nach einer falschen Antwort", () => {
  /** Eine mc-Frage, deren Feinthema genug Nachbarn fuer eine volle Serie hat —
      und deren Optionen eindeutig sind (sonst ist der Klick mehrdeutig). */
  function serienFrage() {
    const stand = leererStand() as Lernstand;
    const nachId = (id: string) => FRAGEN.find((f) => f.id === id);
    const f = FRAGEN.find(
      (x) =>
        x.typ === "mc" &&
        Array.isArray(x.optionen) &&
        new Set(x.optionen as string[]).size === (x.optionen as string[]).length &&
        serienKandidaten(stand, FRAGEN, nachId, x).length >= 5,
    );
    if (!f) throw new Error("keine mc-Frage mit voller Serie - der Test waere leer");
    return f;
  }

  const angezeigt = () => screen.getByText(/^M\d\d-\d+$/).textContent!;
  const themaVon = (id: string) => {
    const f = FRAGEN.find((x) => x.id === id)!;
    return f.modul + "|" + f.thema;
  };

  async function antworte(
    nutzer: ReturnType<typeof userEvent.setup>,
    frage: (typeof FRAGEN)[number],
    richtig: boolean,
  ) {
    if (frage.typ !== "mc") throw new Error(`${frage.id}: antworte() kann nur mc`);
    const optionen = frage.optionen;
    const loesung = frage.loesungIndex;
    const wahl = richtig ? loesung : (loesung + 1) % optionen.length;
    await nutzer.click(screen.getByRole("radio", { name: optionen[wahl] }));
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));
  }

  it("bietet nach einer FALSCHEN Antwort mehr zum Thema an", async () => {
    const frage = serienFrage();
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.queryByRole("button", { name: /Mehr zu diesem Thema/ })).toBeNull();
    await antworte(nutzer, frage, false);
    const knopf = screen.getByRole("button", { name: /Mehr zu diesem Thema/ });
    expect(knopf.textContent).toContain(frage.thema);
  });

  it("nach einer RICHTIGEN Antwort kommt kein Angebot", async () => {
    const frage = serienFrage();
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await antworte(nutzer, frage, true);
    expect(screen.queryByRole("button", { name: /Mehr zu diesem Thema/ })).toBeNull();
  });

  it("zieht nach dem Klick fuenf Fragen aus genau diesem Thema", async () => {
    const frage = serienFrage();
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await antworte(nutzer, frage, false);
    await nutzer.click(screen.getByRole("button", { name: /Mehr zu diesem Thema/ }));

    /* Die Serie steht, aber sie greift erst beim naechsten Zug — genau wie in
       der alten App ("laeuft ab der naechsten Frage"). */
    expect(screen.getByText(/Themen-Serie läuft/).textContent).toContain("5");
    expect(angezeigt()).toBe(frage.id);

    const gesehen: string[] = [];
    for (let i = 0; i < 5; i++) {
      await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
      gesehen.push(angezeigt());
      expect(screen.getByText("mehr zu diesem Thema")).toBeTruthy();
      expect(themaVon(gesehen[i]), `Zug ${i + 1} kam aus einem fremden Thema`)
        .toBe(themaVon(frage.id));
    }
    /* ⛔ Jede Kennung nur EINMAL: eine Serie, die dieselbe Frage fuenfmal zeigt,
       waere keine. */
    expect(new Set(gesehen).size).toBe(5);
    expect(gesehen).not.toContain(frage.id);
  });

  it("ist nach fuenf Fragen zu Ende und blockiert die Ziehung nicht", async () => {
    const frage = serienFrage();
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await antworte(nutzer, frage, false);
    await nutzer.click(screen.getByRole("button", { name: /Mehr zu diesem Thema/ }));
    for (let i = 0; i < 5; i++) {
      await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    }
    /* Die fuenfte Serienfrage steht noch da, die Warteschlange ist aber leer. */
    expect(screen.queryByText(/Themen-Serie läuft/)).toBeNull();
    expect(screen.getByText("mehr zu diesem Thema")).toBeTruthy();

    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    expect(screen.queryByText("mehr zu diesem Thema")).toBeNull();
  });

  /* ⛔⛔ DIESE ZUSICHERUNG WAR AM 15.09.2026 UNGEDECKT. `wechsle()` leert die
     Serie beim Fachwechsel — die Sabotage „Zeile weg" blieb GRUEN, weil kein Test
     danach sah. Eine Serie aus dem alten Fach haette im neuen weitergezogen und
     die Fachwahl still ausgehebelt. */
  it("eine laufende Serie endet beim Fachwechsel", async () => {
    const frage = serienFrage();
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await antworte(nutzer, frage, false);
    await nutzer.click(screen.getByRole("button", { name: /Mehr zu diesem Thema/ }));
    expect(screen.getByText(/Themen-Serie läuft/)).toBeTruthy();

    /* Das erste echte Fach neben "Alles". */
    await nutzer.click(screen.getAllByRole("tab")[1]);
    expect(screen.queryByText(/Themen-Serie läuft/)).toBeNull();
    expect(screen.queryByText("mehr zu diesem Thema")).toBeNull();
  });

  it("ein zweites Angebot kommt erst, wenn keine Serie mehr laeuft", async () => {
    const frage = serienFrage();
    stelleFrage(frage);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await antworte(nutzer, frage, false);
    await nutzer.click(screen.getByRole("button", { name: /Mehr zu diesem Thema/ }));
    await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    /* Auf der ersten Serienfrage: auch eine falsche Antwort darf die laufende
       Serie nicht ueberschreiben. */
    const jetzt = FRAGEN.find((f) => f.id === angezeigt())!;
    if (jetzt.typ === "mc" && Array.isArray(jetzt.optionen)) {
      await antworte(nutzer, jetzt, false);
      expect(screen.queryByRole("button", { name: /Mehr zu diesem Thema/ })).toBeNull();
    }
    expect(screen.getByText(/Themen-Serie läuft/).textContent).toContain("4");
  });
});
