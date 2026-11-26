/* Zwei Typen, die dieselbe Frage stellen: welcher Baustein gehoert an welche Stelle?

     beschriftung -> {zielIndex: labelText}     (Stellen in einer Zeichnung)
     baukasten    -> {zielIndex: bausteinText}  (Luecken in einem Geruest)

   ⛔ Beide Bewerter vergleichen den TEXT, nicht den Index:
        frage.ziele.every((z, i) => zuordnung[i] === z.loesung)
      Der Schluessel ist also die Position im `ziele`-Feld, der Wert der Text des
      Bausteins. Nicht die angezeigte Nummer — die steht in `z.nr` und ist NICHT
      immer i+1: eine Frage im Bestand nummeriert ihre Stellen 7,6,5,4,3,2,1.

   ⚠️ Bedient wird ueber ein Auswahlfeld je Stelle, nicht ueber Ziehen — dieselbe
      Entscheidung wie bei `zuordnung` und aus demselben Grund: Ziehen braucht auf
      dem Handy und mit Tastatur je einen eigenen Ersatzweg.
      Ein Baustein, der schon woanders liegt, steht weiter in der Liste, ist aber
      abgeschaltet. Das haelt die Hilfe der alten App (dort verschwand er aus dem
      Vorrat), ohne die Liste unter den Fingern springen zu lassen. */
import { useMemo } from "react";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { EingabeProps } from "./vertrag";
import { istText, tabelleVon } from "@/kern/pruefe";
import { zerlegeZeile } from "./zeilen";
import { RichtigWaere } from "./RichtigWaere";
import { inReihenfolge } from "@/kern/anzeige";
import { useMischer } from "./mischung";

/* N25 P3: die Auswahl ist shadcns NativeSelect (Grund wie in Dropdown.tsx); schmal
   im Satz (size="sm"), breit darunter. Die Namen sind Vertrag (eingabe.test.tsx). */

interface Ziel {
  nr?: number;
  loesung: string;
}

/** Ein Auswahlfeld, das weiss, was anderswo schon vergeben ist. */
function Bausteinwahl({
  bausteine, stand, ziel, wert, name, gesperrt, breit, aufWahl,
}: {
  bausteine: string[];
  stand: Record<number, string>;
  ziel: number;
  wert: string;
  name: string;
  gesperrt: boolean;
  breit: boolean;
  aufWahl: (text: string) => void;
}) {
  const vergeben = useMemo(() => {
    const m = new Set<string>();
    Object.entries(stand).forEach(([k, v]) => { if (Number(k) !== ziel && v) m.add(v); });
    return m;
  }, [stand, ziel]);

  return (
    <NativeSelect
      aria-label={name}
      disabled={gesperrt}
      value={wert}
      onChange={(e) => aufWahl(e.target.value)}
      size={breit ? "default" : "sm"}
      className={breit ? "w-full" : "inline-block min-w-[7rem] align-baseline"}
    >
      <NativeSelectOption value="">— wählen —</NativeSelectOption>
      {bausteine.map((b) => (
        <NativeSelectOption key={b} value={b} disabled={vergeben.has(b)}>
          {b}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}

function ausStand(antwort: unknown): Record<number, string> {
  return tabelleVon(antwort, istText);   // N38 Q1: vorher behauptet
}

/* -------------------------------------------------------------- beschriftung */
export function Beschriftung({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"beschriftung">) {
  const ziele = (Array.isArray(frage.ziele) ? frage.ziele : []) as Ziel[];
  const roh = Array.isArray(frage.labels) ? frage.labels : [];
  /* N47 A: gemessen 10.10. – die Begriffe standen in Loesungsreihenfolge (alte App: L.shuffle). */
  const labels = inReihenfolge(roh, useMischer().reihenfolge(frage.id + ":labels", roh.length)).map((x) => x.wert);
  const stand = ausStand(antwort);

  function setze(i: number, text: string) {
    const neu = { ...stand };
    if (text === "") delete neu[i];
    else neu[i] = text;
    aufAntwort(neu);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[0.8125rem] text-muted-foreground">
        Ordne jeder markierten Stelle den passenden Begriff zu. Nicht jeder Begriff kommt vor.
      </p>

      {ziele.map((z, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
        <div key={i} className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3">
          <span aria-hidden className="text-right font-mono text-[0.8125rem] text-muted-foreground tabular-nums">
            {z.nr ?? i + 1}.
          </span>
          <Bausteinwahl
            bausteine={labels} stand={stand} ziel={i} wert={stand[i] ?? ""}
            name={`Stelle ${z.nr ?? i + 1}`} gesperrt={gesperrt} breit
            aufWahl={(t) => setze(i, t)}
          />
        </div>
      ))}

      {gesperrt && <RichtigWaere zeilen={ziele.map((z, i) => `${z.nr ?? i + 1}. ${z.loesung}`)} />}
    </div>
  );
}

/* ----------------------------------------------------------------- baukasten */

export function Baukasten({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"baukasten">) {
  /* N32: stabil, sonst war das useMemo auf `ziele` darunter wirkungslos (oxlint exhaustive-deps). */
  const ziele = useMemo(() => (Array.isArray(frage.ziele) ? frage.ziele : []) as Ziel[], [frage.ziele]);
  const roh = Array.isArray(frage.bausteine) ? frage.bausteine : [];
  /* N47 A: gemessen 10.10. – die Bausteine standen in Loesungsreihenfolge (alte App: L.shuffle). */
  const bausteine = inReihenfolge(roh, useMischer().reihenfolge(frage.id + ":bausteine", roh.length)).map((x) => x.wert);
  const geruest = Array.isArray(frage.geruest) ? frage.geruest : [];
  const stand = ausStand(antwort);

  /* Von der angezeigten Nummer zurueck auf die Stelle im ziele-Feld — das ist der
     Schluessel, den gradeBaukasten liest. */
  const nachIndex = useMemo(() => {
    const m = new Map<string, number>();
    ziele.forEach((z, i) => m.set(String(z.nr ?? i + 1), i));
    return m;
  }, [ziele]);
  const nummern = useMemo(() => new Set(nachIndex.keys()), [nachIndex]);

  function setze(i: number, text: string) {
    const neu = { ...stand };
    if (text === "") delete neu[i];
    else neu[i] = text;
    aufAntwort(neu);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[0.8125rem] text-muted-foreground">
        Setz die passenden Bausteine in die Lücken.
      </p>

      <div className="overflow-x-auto rounded-md border border-input px-3 py-2.5">
        {geruest.map((zeile, r) => (
          // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
          <div key={r} className="flex min-h-8 flex-wrap items-center font-mono text-[0.8125rem] leading-7 whitespace-pre">
            {zerlegeZeile(zeile, nummern).map((t, k) =>
              "text" in t ? (
                // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                <span key={k}>{t.text}</span>
              ) : (
                <Bausteinwahl
                  // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                  key={k}
                  bausteine={bausteine}
                  stand={stand}
                  ziel={nachIndex.get(t.marke)!}
                  wert={stand[nachIndex.get(t.marke)!] ?? ""}
                  name={`Lücke ${t.marke}`}
                  gesperrt={gesperrt}
                  breit={false}
                  aufWahl={(text) => setze(nachIndex.get(t.marke)!, text)}
                />
              ),
            )}
          </div>
        ))}
      </div>

      {gesperrt && <RichtigWaere zeilen={ziele.map((z, i) => `${z.nr ?? i + 1}. ${z.loesung}`)} />}
    </div>
  );
}
