/* „Meldungen aller Lerner" – die geschützte Ansicht (N20b, Entscheid E8).

   ⛔ Nur mit dem Schlüssel, der als Worker-Secret `MELDE_SCHLUESSEL` gesetzt ist.
      Er wird je Gerät EINMAL eingegeben und nur auf diesem Gerät gemerkt.
   ⚠️ Nicht in der Schiene: Lerner brauchen diesen Bereich nicht. Erreichbar über
      die Einstellungen. */
import { Kennung } from "./Kennung";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Empty, EmptyDescription, EmptyHeader } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { FRAGEN } from "@/daten/laden";
import type { Sende } from "@/kern/meldeversand";
import { istObjekt, istText, istZahl, listeVon, oderNull } from "@/kern/pruefe";

export const S_SCHLUESSEL = "ap1v2_meldeschluessel";

interface Zeile {
  nr: number; frage_id: string; grund: string; text: string; erstellt: number;
  fassung: string; version: string; status: "offen" | "erledigt"; erledigt: number | null;
}
const FILTER = ["offen", "erledigt", "alle"] as const;
type Filter = (typeof FILTER)[number];
/* N38 Q1: die Antwort des Servers wird geprueft statt behauptet (vorher `r.json() as …`). */
const istZeile = (x: unknown): x is Zeile =>
  istObjekt(x) && istZahl(x.nr) && istText(x.frage_id) && istText(x.grund) && istText(x.text)
  && istZahl(x.erstellt) && istText(x.fassung) && istText(x.version)
  && (x.status === "offen" || x.status === "erledigt") && oderNull(istZahl)(x.erledigt);

const netz: Sende = (url, init) => fetch(url, init);

function liesSchluessel(): string {
  try { return localStorage.getItem(S_SCHLUESSEL) ?? ""; } catch { return ""; }
}
function merkeSchluessel(k: string) {
  try { if (k) localStorage.setItem(S_SCHLUESSEL, k); else localStorage.removeItem(S_SCHLUESSEL); } catch { /* egal */ }
}

const FEHLERTEXT: Record<number, string> = {
  401: "Der Schlüssel ist falsch.",
  503: "Die Ansicht ist auf dem Server noch nicht eingerichtet (kein Schlüssel hinterlegt).",
};

interface Seite { zeilen: Zeile[] | null; weitere: boolean; fehler: string | null }

/** Eine Abfrage der Liste, ohne Zustand: Zeilen ODER Fehlertext. `vor` = die kleinste schon
    gezeigte Nummer – dann kommt die naechste, aeltere Seite (Audit 26.09.2026, AUD-C5). */
async function hole(sende: Sende, schluessel: string, filter: Filter, vor?: number): Promise<Seite> {
  try {
    const r = await sende(`/api/meldungen?status=${filter}` + (vor ? `&vor=${vor}` : ""),
      { headers: { authorization: `Bearer ${schluessel}` } });
    if (!r.ok) return { zeilen: null, weitere: false, fehler: FEHLERTEXT[r.status] ?? `Fehler ${r.status}` };
    const d: unknown = await r.json();
    const zeilen = istObjekt(d) ? listeVon(d.meldungen, istZeile) : null;
    if (!istObjekt(d) || zeilen === null) return { zeilen: null, weitere: false, fehler: "Antwort des Servers unlesbar." };
    return { zeilen, weitere: d.weitere === true, fehler: null };
  } catch {
    return { zeilen: null, weitere: false, fehler: "Keine Verbindung zum Server." };
  }
}

export function Meldungsliste({ sende = netz, oeffneFrage }: { sende?: Sende; oeffneFrage?: (id: string) => void }) {
  const [schluessel, setSchluessel] = useState(liesSchluessel);
  const [entwurf, setEntwurf] = useState("");
  const [filter, setFilter] = useState<Filter>("offen");
  const [zeilen, setZeilen] = useState<Zeile[] | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [weitere, setWeitere] = useState(false);

  const lade = useCallback(async () => {
    if (!schluessel) return;
    const e = await hole(sende, schluessel, filter);
    setZeilen(e.zeilen);
    setWeitere(e.weitere);
    setFehler(e.fehler);
  }, [schluessel, filter, sende]);

  async function ladeAeltere() {
    const letzte = zeilen?.at(-1)?.nr;
    if (!schluessel || !letzte) return;
    const e = await hole(sende, schluessel, filter, letzte);
    if (e.fehler) { setFehler(e.fehler); return; }
    setZeilen((alt) => [...(alt ?? []), ...(e.zeilen ?? [])]);
    setWeitere(e.weitere);
  }

  /* N32: der Effekt setzt erst in der Antwort (oxlint set-state-in-effect) und verwirft eine
     ueberholte - wer schnell den Filter wechselt, sah sonst die Liste der LANGSAMEREN Anfrage. */
  useEffect(() => {
    if (!schluessel) return undefined;
    let aktiv = true;
    void hole(sende, schluessel, filter).then((e) => {
      if (!aktiv) return;
      setZeilen(e.zeilen);
      setWeitere(e.weitere);
      setFehler(e.fehler);
    });
    return () => { aktiv = false; };
  }, [schluessel, filter, sende]);

  async function setzeStatus(nr: number, status: Zeile["status"]) {
    try {
      const r = await sende(`/api/meldungen/${nr}/status`, {
        method: "POST",
        headers: { authorization: `Bearer ${schluessel}`, "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) { setFehler(FEHLERTEXT[r.status] ?? `Fehler ${r.status}`); return; }
      await lade();
    } catch { setFehler("Keine Verbindung zum Server."); }
  }

  if (!schluessel) {
    return (
      <div className="grid min-h-0 auto-rows-max content-start gap-5 overflow-auto p-6">
        <Card className="max-w-xl gap-3 p-5">
          <div className="text-[0.9375rem] font-semibold">Meldungen aller Lerner</div>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            Diese Ansicht ist geschützt. Den Schlüssel gibst du auf jedem Gerät einmal ein; er bleibt nur hier gespeichert.
          </p>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); merkeSchluessel(entwurf.trim()); setSchluessel(entwurf.trim()); }}>
            <Input type="password" aria-label="Schlüssel" autoComplete="off" value={entwurf}
                   onChange={(e) => setEntwurf(e.target.value)} className="w-72" />
            <Button type="submit" disabled={!entwurf.trim()}>Öffnen</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 auto-rows-max content-start gap-5 overflow-auto p-6">
      <Card className="gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[0.9375rem] font-semibold">Meldungen aller Lerner</div>
          <div className="flex gap-2">
            {/* Vertrag: `radio` je Filter (meldungen.jsdom). ToggleGroup `single`
                vergibt das; ein zweiter Klick liefert "" – der Filter bleibt stehen. */}
            <ToggleGroup type="single" variant="outline" size="sm" spacing={1} aria-label="Filter"
                         value={filter} onValueChange={(f) => { const g = FILTER.find((x) => x === f); if (g) setFilter(g); }}>
              {FILTER.map((f) => (
                <ToggleGroupItem key={f} value={f} className="data-[state=on]:border-ring data-[state=on]:bg-accent">
                  {f}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button size="sm" variant="secondary" onClick={() => void lade()}>Neu laden</Button>
            <Button size="sm" variant="secondary" onClick={() => { merkeSchluessel(""); setSchluessel(""); setZeilen(null); }}>
              Schlüssel vergessen
            </Button>
          </div>
        </div>
        {fehler && <p className="text-[0.8125rem] text-destructive" data-teil="fehler">{fehler}</p>}
        {zeilen && zeilen.length === 0 && (
          <Empty className="border p-4">
            <EmptyHeader><EmptyDescription>Keine Meldungen in dieser Auswahl.</EmptyDescription></EmptyHeader>
          </Empty>
        )}
        {zeilen && zeilen.length > 0 && (
          <ItemGroup className="gap-2" data-teil="meldungsliste">
            {zeilen.map((z) => {
              const f = FRAGEN.find((x) => x.id === z.frage_id);
              return (
                <Item key={z.nr} asChild variant="outline" size="sm" className="items-start">
                  <li>
                  <ItemContent className="min-w-0 text-[0.8125rem]">
                    <div className="flex flex-wrap gap-x-3 text-muted-foreground">
                      <span className="tabular-nums">#{z.nr}</span>
                      <span>{new Date(z.erstellt).toLocaleString("de-DE")}</span>
                      <Kennung id={z.frage_id} oeffne={f ? oeffneFrage : undefined} className="text-foreground" />
                      <span>{f?.thema ?? "(nicht im Pool)"}</span>
                      <span>v{z.version || "?"}</span>
                    </div>
                    <ItemTitle className="font-normal"><span><b className="font-medium">{z.grund}</b>{z.text ? `: ${z.text}` : ""}</span></ItemTitle>
                    {f && <ItemDescription className="truncate">{(f.frage ?? "")}</ItemDescription>}
                  </ItemContent>
                  <ItemActions>
                  <Button size="sm" variant={z.status === "offen" ? "default" : "secondary"}
                          aria-label={`Meldung ${z.nr} ${z.status === "offen" ? "erledigt" : "wieder offen"}`}
                          onClick={() => void setzeStatus(z.nr, z.status === "offen" ? "erledigt" : "offen")}>
                    {z.status === "offen" ? "Erledigt" : "Wieder offen"}
                  </Button>
                  </ItemActions>
                  </li>
                </Item>
              );
            })}
          </ItemGroup>
        )}
        {zeilen && weitere && (
          <Button size="sm" variant="secondary" className="justify-self-start" onClick={() => void ladeAeltere()}>
            Ältere laden
          </Button>
        )}
      </Card>
    </div>
  );
}
