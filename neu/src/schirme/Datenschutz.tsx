/* DATENSCHUTZHINWEIS (Audit 26.09.2026, AUD-A2; Art. 13 DSGVO).
   Inhalt vom Nutzer freigegeben am 26.09.2026 (Verantwortlicher: „J. Winterberg", web.de-Adresse).
   ⛔ Die Fristen stehen hier als Text – `datenschutz.jsdom.test.tsx` vergleicht sie mit
      `AUFBEWAHRUNG` in server/api.ts. Den Server hier zu importieren zoege die 1131 Kennungen
      ins Buendel.
   ⛔ Wer an Melden, Fehlerbericht, Worker oder Hosting etwas aendert, liest diesen Text mit. */
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { FRIST_TEXT, VERANTWORTLICH } from "@/kern/datenschutz";

export function DatenschutzHinweis() {
  return (
    <>
      <Field>
        <FieldTitle>Verantwortlich</FieldTitle>
        <FieldDescription>
          {VERANTWORTLICH.name},{" "}
          <a className="underline underline-offset-2" href={`mailto:${VERANTWORTLICH.mail}`}>{VERANTWORTLICH.mail}</a>
        </FieldDescription>
      </Field>
      <Field>
        <FieldTitle>Auf diesem Gerät</FieldTitle>
        <FieldDescription>
          Lernstand und Einstellungen liegen nur im Speicher dieses Browsers – sie gehen an keinen Server.
        </FieldDescription>
      </Field>
      <Field data-teil="datenschutz-server">
        <FieldTitle>An den Server – nur wenn es ausgelöst wird</FieldTitle>
        <FieldDescription>
          „Frage melden“: Frage-Kennung, Grund, dein Text, App-Version, Zeitpunkt und eine zufällige
          Gerätekennung (nur gegen Massen-Meldungen). Kein Name. Offene Meldungen bleiben bis zur
          Bearbeitung, erledigte werden nach {FRIST_TEXT.erledigtTage} Tagen gelöscht. Schreib nichts
          Persönliches in den Text.
        </FieldDescription>
        <FieldDescription>
          Absturzbericht (automatisch, wenn ein Bereich abstürzt): Bereich, Fehlermeldung ohne Frage und
          Adresse, App-Version, Zeitpunkt, Gerätekennung. Gelöscht nach {FRIST_TEXT.fehlerTage} Tagen.
        </FieldDescription>
      </Field>
      <Field>
        <FieldTitle>Hosting</FieldTitle>
        <FieldDescription>
          Cloudflare, Inc. (USA, zertifiziert nach dem EU-U.S. Data Privacy Framework) liefert die App aus
          und verarbeitet dabei technisch deine IP-Adresse, auch für die Mengenbremse. Die App selbst
          speichert keine IP-Adresse.
        </FieldDescription>
      </Field>
      <Field>
        <FieldTitle>Rechtsgrundlage und Rechte</FieldTitle>
        <FieldDescription>
          Berechtigtes Interesse an einer funktionierenden, fehlerarmen Lern-App (Art. 6 Abs. 1 lit. f DSGVO).
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch
          (Art. 15–21 DSGVO) – per E-Mail an die Adresse oben – und auf Beschwerde bei einer
          Datenschutz-Aufsichtsbehörde.
        </FieldDescription>
      </Field>
    </>
  );
}
