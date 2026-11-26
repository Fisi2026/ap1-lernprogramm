/* Meldung 13 (M07-717, 25.11.2026): Knopf „Vorlesen“ über dem Fragetext der Karteikarte.
   Nutzer-Entscheide: Frage + Antworten in der angezeigten Reihenfolge, Knopf immer sichtbar –
   sofern der Browser die Sprachausgabe (Web Speech API, `speechSynthesis`) UND eine deutsche
   Stimme hat. Ohne Bibliothek, ohne eigene Netzanfrage; die CSP bleibt unveraendert.
   ⚠️ Die angezeigte Reihenfolge der Optionen kennt nur die Eingabe-Komponente (eigener Mischer je
      Einhaengen, `fragetypen/mischung.ts`). Darum liest der Knopf sie beim Klick von der Karte
      (`[aria-label="Antwortmöglichkeiten"]`, Texte unter `id$="-t"`, vgl. `Karte` in Auswahl.tsx).
   ⚠️ Die Karteikarte wird je Frage neu eingehaengt: das Aushaengen bricht das Sprechen ab. */
import { useEffect, useState } from "react";
import { Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vorleseTeile, deutscheStimme } from "./vorlesetext";

function sprachausgabe(): SpeechSynthesis | null {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window
    ? window.speechSynthesis : null;
}

/** Ob eine deutsche Stimme da ist – Chrome liefert die Stimmen erst nach `voiceschanged`. */
function useDeutscheStimme(): boolean {
  const [da, setDa] = useState(() => deutscheStimme(sprachausgabe()?.getVoices() ?? []));
  useEffect(() => {
    const s = sprachausgabe();
    const pruefe = () => setDa(deutscheStimme(s?.getVoices() ?? []));
    s?.addEventListener("voiceschanged", pruefe);
    return () => s?.removeEventListener("voiceschanged", pruefe);
  }, []);
  return da;
}

export function Vorlesen({ fragetext }: { fragetext: string }) {
  const da = useDeutscheStimme();
  const [spricht, setSpricht] = useState(false);
  useEffect(() => () => { if (spricht) sprachausgabe()?.cancel(); }, [spricht]);
  if (!da) return null;

  function start(knopf: HTMLElement) {
    const s = sprachausgabe();
    if (!s) return;
    const karte = knopf.closest('[data-slot="card"]');
    const optionen = [...(karte?.querySelectorAll('[aria-label="Antwortmöglichkeiten"] [id$="-t"]') ?? [])]
      .map((e) => e.textContent ?? "");
    const teile = vorleseTeile(fragetext, optionen);
    if (teile.length === 0) return;
    s.cancel();
    teile.forEach((t, i) => {
      const a = new SpeechSynthesisUtterance(t);
      a.lang = "de-DE";
      if (i === teile.length - 1) { a.onend = () => setSpricht(false); a.onerror = () => setSpricht(false); }
      s.speak(a);
    });
    setSpricht(true);
  }
  function stopp() {
    sprachausgabe()?.cancel();
    setSpricht(false);
  }

  return spricht ? (
    <Button type="button" variant="ghost" size="sm" aria-label="Vorlesen beenden" onClick={stopp}
            className="ml-auto h-6 gap-1 px-2 text-xs" data-teil="vorlesen">
      <Square aria-hidden /> Stopp
    </Button>
  ) : (
    <Button type="button" variant="ghost" size="sm" aria-label="Frage vorlesen"
            onClick={(e) => start(e.currentTarget)}
            className="ml-auto h-6 gap-1 px-2 text-xs" data-teil="vorlesen">
      <Volume2 aria-hidden /> Vorlesen
    </Button>
  );
}
