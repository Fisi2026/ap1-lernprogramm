/* Zwei Typen, die als Tabelle gestellt werden:

     trace         -> 2D-Feld aus Text  [zeile][spalte]   (Schreibtischtest)
     kreuztabelle  -> 2D-Feld aus Bool  [zeile][spalte]   ("richtig" nur bei 100 %)

   ⚠️ Bei `trace` sind ALLE Zellen leer — auch die erste Spalte mit dem Namen des
      Vorgangs. Das ist kein Versehen: gradeTrace vergleicht `frage.zeilen`
      vollstaendig, also Zelle fuer Zelle ueber alle Spalten. Die alte App hat es
      genauso gehalten.
   ⚠️ Zwoelf namenlose Eingabefelder in einer Tabelle waren der schwerste der acht
      Befunde vom 27.07. Der Name jeder Zelle ist deshalb Spaltenkopf + Zeile —
      genau die zwei Angaben, die ein Sehender ablesen kann. */
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldDescription } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EingabeProps } from "./vertrag";
import { istText, istWahrheit, listeAus, listeVon } from "@/kern/pruefe";

/* N25 P3: Table + Input (trace), Table + Checkbox (kreuztabelle). Die Namen
   „<Spalte>, Zelle r“ und „<Zeile> — <Spalte>“ sind Vertrag (eingabe.test.tsx).
   shadcns Table bringt den waagrechten Scroll-Rahmen selbst mit. */
const ZELLE = "h-8 min-w-[4.5rem] px-2 font-mono text-[0.8125rem] disabled:opacity-80";

const KOPF =
  "px-2 pb-2 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase";

/* --------------------------------------------------------------------- trace */
export function Trace({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"trace">) {
  const spalten = Array.isArray(frage.spalten) ? frage.spalten : [];
  const zeilen = listeVon(frage.zeilen, listeAus(istText)) ?? [];   // N38 Q1: alle 24 im Bestand bestehen
  const code = Array.isArray(frage.code) ? frage.code : [];

  const stand: string[][] = listeVon(antwort, listeAus(istText)) ?? zeilen.map((r) => r.map(() => ""));

  function setze(r: number, c: number, wert: string) {
    aufAntwort(
      zeilen.map((row, ri) =>
        row.map((_, ci) => (ri === r && ci === c ? wert : (stand[ri]?.[ci] ?? ""))),
      ),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <FieldDescription>Führ das im Kopf aus (Schreibtischtest) und trag die Werte je Schritt ein.</FieldDescription>

      {code.length > 0 && (
        <pre className="overflow-x-auto rounded-md border border-input px-3 py-2 font-mono text-[0.8125rem] leading-relaxed text-foreground">
          {code.join("\n")}
        </pre>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {spalten.map((s, i) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <TableHead key={i} scope="col" className={KOPF}>{s}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
            {zeilen.map((row, r) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <TableRow key={r}>
                {row.map((_, c) => (
                  // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                  <TableCell key={c} className="p-1">
                    <Input
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      disabled={gesperrt}
                      value={stand[r]?.[c] ?? ""}
                      onChange={(e) => setze(r, c, e.target.value)}
                      aria-label={`${spalten[c] ?? `Spalte ${c + 1}`}, Zelle ${r + 1}`}
                      className={ZELLE}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {gesperrt && (
        <div className="rounded-md border border-input px-4 py-3 text-[0.8125rem]">
          <b className="mb-1 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Richtige Werte, zeilenweise
          </b>
          <span className="font-mono text-foreground">
            {zeilen.map((row) => row.join(" | ")).join("   ·   ")}
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- kreuztabelle */
export function Kreuztabelle({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"kreuztabelle">) {
  const zeilen = Array.isArray(frage.zeilen) ? frage.zeilen : [];
  const spalten = Array.isArray(frage.spalten) ? frage.spalten : [];
  const loesung = Array.isArray(frage.loesung) ? frage.loesung : [];

  const stand: boolean[][] = listeVon(antwort, listeAus(istWahrheit)) ?? zeilen.map(() => spalten.map(() => false));

  function kippe(r: number, c: number) {
    aufAntwort(
      zeilen.map((_, ri) =>
        spalten.map((__, ci) =>
          ri === r && ci === c ? !(stand[ri]?.[ci] === true) : stand[ri]?.[ci] === true,
        ),
      ),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <FieldDescription>Kreuz an, was zutrifft. Gewertet wird nur, wenn die ganze Tabelle stimmt.</FieldDescription>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            {spalten.map((s, i) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <TableHead key={i} scope="col" className={cn(KOPF, "text-center")}>{s}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
            {zeilen.map((z, r) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <TableRow key={r}>
                <TableHead scope="row" className="h-auto max-w-[26rem] py-2 pr-3 text-left text-[0.8125rem] leading-snug font-normal whitespace-normal">
                  {z}
                </TableHead>
                {spalten.map((s, c) => {
                  const an = stand[r]?.[c] === true;
                  const richtig = loesung[r]?.[c] === true;
                  return (
                    // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                    <TableCell key={c} className="p-1 text-center">
                      <Checkbox
                        checked={an}
                        aria-label={`${z} — ${s}`}
                        disabled={gesperrt}
                        onCheckedChange={() => kippe(r, c)}
                        className={cn(
                          /* N48 P4 (11.10.2026): 24 px statt 20 – WCAG 2.2 SC 2.5.8; neben „Frage melden“
                             verfehlten 20-px-Zellen die Abstands-Ausnahme (4 Fragen, n48p4.js). */
                          "size-6",
                          /* Nach dem Pruefen zeigt die Zelle, wo sie falsch steht —
                             nicht, was richtig gewesen waere. Das steht darunter. */
                          gesperrt && an !== richtig && "border-destructive data-checked:border-destructive data-checked:bg-destructive",
                        )}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {gesperrt && (
        <div className="rounded-md border border-input px-4 py-3 text-[0.8125rem]">
          <b className="mb-1 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Richtig angekreuzt wäre
          </b>
          <span className="text-foreground">
            {zeilen
              .map((z, r) => {
                const treffer = spalten.filter((_, c) => loesung[r]?.[c] === true);
                return `${z}: ${treffer.length ? treffer.join(", ") : "nichts"}`;
              })
              .join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
