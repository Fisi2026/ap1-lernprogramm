/* Der Kasten „Richtig wäre" unter einer gesperrten Eingabe.

   Gebaut zuerst in Bausteine.tsx (beschriftung, baukasten); seit N47 B (10.10.2026) auch
   unter dropdown und zuordnung – Anlass Lerner-Meldung 5 (M01-486): nach einer falschen
   Antwort stand rechts nur „Nicht richtig.", die Loesung lag in der Rueckseite unter dem
   Bild ausser Sicht. Er steht IMMER nach dem Pruefen, auch nach einer richtigen Antwort
   (Nutzer-Entscheid 10.10.). */
export function RichtigWaere({ zeilen }: { zeilen: readonly string[] }) {
  return (
    <div className="rounded-md border border-input px-4 py-3 text-[0.8125rem]" data-teil="richtig-waere">
      <b className="mb-1 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Richtig wäre
      </b>
      {zeilen.length > 1 && zeilen.some((z) => z.length > 40) ? (
        <ul className="list-disc space-y-0.5 pl-5 text-foreground">
          {zeilen.map((z) => <li key={z}>{z}</li>)}
        </ul>
      ) : (
        <span className="text-foreground">{zeilen.join(" · ")}</span>
      )}
    </div>
  );
}
