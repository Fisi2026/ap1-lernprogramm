/* ============================================================================
   N38 Q1 (30.09.2026): EIN WERT, DER NACH DER LOGIK DER STELLE DA SEIN MUSS.
   Ersetzt `x as T` bei `T | undefined` dort, wo die Annahme ECHT ist (Knoten per ID aus
   derselben Liste, Zufallswahl aus einer Liste, die nie leer ist). Die Umwandlung behauptete
   nur; `da` prueft und meldet laut mit Klartext, statt spaeter an einem `undefined` zu scheitern.
   ⛔ Kein Pflaster fuer jede Stelle: wo sich der Code so bauen laesst, dass TS den Wert sieht
      (for-of, Typwaechter, nicht-leere Tupel), wird umgebaut (Nutzer-Entscheid, BUILD_LOG 92).
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49). Diese Datei importiert nichts.
   ============================================================================ */
export function da<T>(x: T | undefined, was: string): T {
  if (x === undefined) throw new Error("[kern] fehlt: " + was);
  return x;
}

/* N38 Q4 (30.09.2026): der `default` eines vollstaendigen switch. TS beweist, dass er nie erreicht
   wird (`x: never`); zur Laufzeit – etwa mit Daten, die am Typ vorbei kamen – meldet er laut, statt
   still `undefined` zurueckzugeben (vorher fiel die Funktion unten heraus; oxlint consistent-return). */
export function unerreichbar(x: never, was: string): never {
  throw new Error("[kern] unerwartet in " + was + ": " + String(x));
}
