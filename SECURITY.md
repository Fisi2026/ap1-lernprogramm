# Sicherheitshinweise melden

Du hast eine Schwachstelle im AP1-Lernprogramm gefunden? Danke, dass du sie meldest – bitte **nicht
öffentlich** (kein Issue, kein Pull Request), sondern vertraulich.

## So meldest du

Über GitHub **„Private vulnerability reporting“**: im Repository auf den Reiter **Security** →
**Report a vulnerability**. Die Meldung sehen nur die Betreuenden des Repositories.
Es gibt bewusst **keine E-Mail-Adresse** für Sicherheitsmeldungen.

Bitte schreibe mit: was betroffen ist (Adresse, Pfad oder Datei), wie man es nachstellt, und was
passieren kann. Keine echten Daten Dritter verwenden, nichts löschen oder verändern, keine
Lasttests.

## Was im Rahmen ist

- **Die Web-App** unter https://ap1-lernprogramm.fisi2026lernapp.workers.dev (Quelltext in `neu/`,
  ausgelieferter Bau in `v2/`), z. B. Skriptausführung im Browser, Umgehen von Schutzmaßnahmen.
- **Die Worker-API** unter `/api/*` (`neu/src/server/`): `POST /api/meldung`, `POST /api/fehler`
  und die schlüsselgeschützten Zugänge `/api/meldungen` – z. B. Zugriff ohne Schlüssel,
  Umgehen der Eingabeprüfung oder der Ratenbremse, Auslesen gespeicherter Meldungen.
- **Geheimnisse im Repository** (Schlüssel, Tokens) und die Auslieferung über die CI (`.github/`).

## Was nicht im Rahmen ist

- Der Fragenpool und die Lernunterlagen **inhaltlich**: fachliche Fehler sind keine Sicherheitslücke
  – dafür gibt es in der App „Frage melden“.
- Angriffe, die nur mit Zugriff auf das Gerät oder den Browser-Speicher der Lernenden gehen
  (der Lernstand liegt lokal im Browser).
- Denial-of-Service, Lasttests, Spam, Social Engineering, Angriffe auf Cloudflare oder GitHub selbst
  (melde diese bei den jeweiligen Anbietern).
- Fehlende Header oder Einstellungen ohne nachvollziehbare Auswirkung; veraltete Abhängigkeiten
  ohne zeigbaren Angriffsweg.

Unterstützt wird nur der jeweils aktuelle Stand auf `main` (= die Live-Seite).
