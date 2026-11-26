/* konsole — je Aufgabe ein Befehl. gradeKonsole vergleicht ueber normBefehl:
   Klein/Gross egal, Leerzeichen zusammengefasst, Leerzeichen um `/` und `|`
   entfernt. Verglichen wird gegen `aufgaben[i].akzeptiert` — mehrere
   Schreibweisen sind ausdruecklich erlaubt (`ping 127.0.0.1` / `ping localhost`).

   ⚠️ Das `>` vor dem Feld ist reine Optik und traegt keinen Namen. Der Name des
      Feldes ist die Aufgabenstellung — sonst sagt der Screenreader nur
      "Eingabefeld". Die alte App hat dafuer einen eigenen Befund (27.07.).
   ⚠️ Die dunkle Flaeche hier ist KEIN Token-Verstoss, sondern die Sache selbst:
      ein Terminal sieht so aus. Der Wert stammt aus der alten App
      (app_loeser.js: #15171C) und wird uebernommen, nicht neu erfunden.
   N25 P3: Feld und Prompt sind eine InputGroup, das `>` ihr Addon. */
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { FieldDescription } from "@/components/ui/field";
import type { EingabeProps } from "./vertrag";
import { istText, listeVon } from "@/kern/pruefe";

/** Aus app_loeser.js R_TYP.konsole — dieselbe Flaeche wie in der alten App. */
const TERMINALGRUND = "#15171C";
const TERMINALSCHRIFT = "#d6f5d6";

interface Aufgabe {
  prompt: string;
  akzeptiert: string[];
}

export function Konsole({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"konsole">) {
  const aufgaben = (Array.isArray(frage.aufgaben) ? frage.aufgaben : []) as Aufgabe[];
  const stand: string[] = listeVon(antwort, istText) ?? aufgaben.map(() => "");

  function setze(i: number, wert: string) {
    aufAntwort(aufgaben.map((_, k) => (k === i ? wert : (stand[k] ?? ""))));
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldDescription>Schreib je Schritt den passenden Befehl.</FieldDescription>

      {aufgaben.map((a, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
        <div key={i} className="flex flex-col gap-1.5">
          <div className="flex gap-2 text-[0.875rem] leading-snug">
            <span aria-hidden className="flex-none font-mono text-muted-foreground tabular-nums">
              {i + 1}.
            </span>
            <span>{a.prompt}</span>
          </div>
          <InputGroup style={{ background: TERMINALGRUND }} className="h-10 border-transparent dark:bg-transparent">
            <InputGroupAddon aria-hidden>
              <InputGroupText className="font-mono text-[0.875rem] text-[#7a8290]">&gt;</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              autoComplete="off"
              spellCheck={false}
              disabled={gesperrt}
              value={stand[i] ?? ""}
              onChange={(e) => setze(i, e.target.value)}
              aria-label={`Befehl ${i + 1}: ${a.prompt}`}
              style={{ color: TERMINALSCHRIFT }}
              className="font-mono text-[0.875rem] placeholder:text-[#4d5460]"
              placeholder={gesperrt ? "" : "Befehl …"}
            />
          </InputGroup>
          {gesperrt && (
            <div className="pl-6 font-mono text-[0.8125rem] text-muted-foreground">
              akzeptiert: {a.akzeptiert.join("  ·  ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
