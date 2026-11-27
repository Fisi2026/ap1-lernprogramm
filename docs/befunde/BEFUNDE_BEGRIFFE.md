# BEFUNDE – Etappe II: Begriffs-Konsistenz poolweit (27.08.2026)

⚠️ **WOZU DIESE DATEI.** Am 26.08. fiel auf, dass „Pay-per-Use" in M03 richtig und in M04 genau
umgekehrt benutzt wurde – **der erste Widerspruch über Modulgrenzen**. Gefunden wurde er nicht
durch ein Verfahren, sondern durch einen zufälligen `kontext`-Aufruf. Diese Etappe hat gefragt:
**wie viele solcher Fälle gibt es noch?**

## DAS ERGEBNIS ZUERST
**Über drei Suchwege und mehrere hundert Begriffe war Pay-per-Use der EINZIGE echte Widerspruch
über Modulgrenzen** – und der war bereits korrigiert. Was übrig blieb, sind Abkürzungen und ein
Sachbefund. ►► **Die Klasse ist seltener als die sechs Fälle der Vorrunde vermuten ließen.** Jene
sechs saßen fast alle *innerhalb* eines Moduls oder sogar innerhalb eines Datensatzes; das ist eine
andere und deutlich häufigere Klasse.

## DIE DREI SUCHWEGE

### Weg 1 · `zuordnung`-Paare (Begriff → Beschreibung)
Dort saß Pay-per-Use. **96 Fragen, 440 Paare, 406 verschiedene Begriffe.** 32 kommen mehrfach vor,
**nur einer über Modulgrenzen**: „Skonto" (M02-102 „Zahlungsrabatt für schnelle Bezahlung" gegen
M07-106 „Rabatt bei frühzeitiger Zahlung") – dieselbe Sache, andere Worte. **Sauber.**

### Weg 2 · Inline-Erklärungen `(ABC = Langform, deutsche Erklärung)`
**274 Fundstellen, 85 Abkürzungen.** 48 Treffer wurden als Formel verworfen.
► Fünf Befunde, alle korrigiert (B42–B46 unten).

### Weg 3 · Definitionssätze im Fließtext
**351 Kandidatenbegriffe** (aus `zuordnung`-Paaren und dem Glossar), Muster „X ist/heißt/bedeutet/
=/:". **6 mit abweichendem Wortlaut in mehreren Modulen**, nach dem Lesen **4 davon Rauschen**:
„Verfügbarkeit", „Integrität", „Leasing", „Garantie" werden verschieden *verwendet*, nicht
verschieden *definiert*. Zwei echte: B45 (BITV) und B47 (BSI).

## ⚠️⚠️ DAS WERKZEUG IST BEI DER PFLICHTPROBE DURCHGEFALLEN
Weg 3 wurde gegen den Fall geprüft, dessen Antwort bekannt ist – Pay-per-Use. **Ergebnis: null
Treffer.** Ursache: im JSON steht vor dem Begriff ein Anführungszeichen (`"erklaerungLang":"Pay-per-Use
ist …"`), das mein Präfix-Zeichensatz nicht zuließ. Nach der Reparatur findet es M03-713 sofort.
►►► **Ohne diese Probe wäre „6 Kandidaten" als beruhigendes Ergebnis durchgegangen.** Zweite Lehre:
eine zweite Lücke (Definitionen mit Doppelpunkt) fiel erst beim nächsten Anlauf auf – **ein Werkzeug
ist nicht nach der ersten Kalibrierung fertig, sondern nach der letzten, die noch etwas findet.**

---

## BEFUNDE

### B42 · MAC hat drei Bedeutungen, das Glossar kannte eine (mittel)
**M04-912** Media Access Control · **M06-102** Message Authentication Code · **M06-306** Mandatory
Access Control. **Alle drei fachlich richtig** – der Pool ist hier nicht der Fehler.
⚠️ **`abkuerzungen.js` führte nur „Media Access Control (Adresse)".** Wer MAC in der Krypto-Frage
trifft und im Glossar nachschlägt, bekommt die falsche Bedeutung.
✅ Ein Eintrag mit allen drei Bedeutungen. **Nicht drei Einträge** – `test_abk` verbietet Dubletten
in `kurz`, und das zu Recht: die Suche würde dreimal dasselbe Kürzel anzeigen.

### B43 · PIN und MFA: deutsch gegen englisch (klein)
`PIN = persönliche Identifikationsnummer` (M04-111) gegen dreimal `Personal Identification Number`;
`MFA = Multi-Faktor-Authentifizierung` (M06-016/302/402) gegen die englische Langform im Glossar.
✅ Auf die Pool-Konvention gezogen: **englische Langform, danach die deutsche Erklärung** – so wie
es 274 andere Fundstellen halten (`OSI = Open Systems Interconnection, Referenzmodell …`).

### B44 · GPL heißt GNU General Public License (klein)
Fünf Fundstellen lösten `GPL = General Public License` auf, **eine einzige (M04-310) korrekt mit
GNU**. Der amtliche Name der Lizenz trägt das GNU. ✅ Alle fünf plus Glossar angeglichen.

### B45 · BITV: ein Merksatz, der wie eine Auflösung aussieht (klein)
M03-020 schrieb „**Merke: BITV = Barrierefreiheit in der IT**" – zwei Zeilen darüber löst dieselbe
Frage korrekt „Barrierefreie-Informationstechnik-Verordnung" auf, und M03-008 tut es auch.
⚠️ **Das Gleichheitszeichen macht aus einer Merkhilfe eine Behauptung.** ✅ Umformuliert zu „Die
BITV regelt die Barrierefreiheit in der IT, die WCAG sind die Web-Regeln dazu".

### B46 · 34 Abkürzungen im Pool erklärt, aber nicht im Glossar (mittel)
✅ **Nutzer-Entscheid 27.08.: die prüfungsrelevanten nachtragen.** 18 Einträge ergänzt – APIPA,
FQDN, CNAME, RADIUS, P2P, ISP, WAF, IKE, PBKDF2, ABAC, TOM, PIN, HA, LED, PSA, JVM, PID, KMU.
**Nicht nachgetragen** (kein Prüfungsstoff): CEO, EU, NRW, MIT, SMS, PC, DB, Watt, FAQ, AN, GF, HR.
⚠️ **Offen gelassen und nicht entschieden: AP, AP1, AVE, AWS.** Sie standen in keiner der beiden
Listen der Rückfrage – **eine Lücke in meiner eigenen Frage, nicht in der Antwort.**
Glossar jetzt **131 Einträge**; `test_abk` prüft die Zahl hart, beide Sollwerte nachgezogen.

### B47 · M02-009 – das BSI als Quelle für Datenschutz (fachlich)
Die Frage ließ einen Berater **Datenschutz**richtlinien recherchieren und stellte das BSI als
maßgebliche Quelle dar. **Das BSI ist für IT-Sicherheit zuständig**; für Datenschutz sind es die
Aufsichtsbehörden – die der Pool in M06 (Art. 33 DSGVO) selbst korrekt benennt.
✅ **Nutzer-Entscheid: Szenario auf IT-Sicherheit gedreht.** Die Lehrabsicht (Quellenbewertung nach
Seriosität, Aktualität, Urheber) bleibt unberührt, keine Antwortoption musste ihre Rolle wechseln.

### B48 · M02-009 – ein Distraktor widersprach dem eigenen Szenario (mittel)
**Beim Umschreiben aufgefallen:** Distraktor 2 lautete „Beide Quellen sind gleich geeignet — **der
Blog ist nur etwas neuer**". Die BSI-Seite war mit 2024 angegeben, der Blog mit 2023: **der Blog ist
älter.** Der Distraktor behauptete das Gegenteil dessen, was im Fragetext stand.
✅ Auf „auf den Urheber kommt es nicht an" umgestellt – das trifft den Denkfehler, den die Option
abbilden soll, und die zugehörige Erklärung wurde mitgezogen.
►► **Sechster Fall der Klasse „der Datensatz widerspricht sich selbst"** – und der erste, der nicht
gesucht, sondern beim Anfassen einer anderen Sache gefunden wurde.

### B49 · Alternde Jahreszahlen in M02-009 (klein)
„2024 aktualisiert" gegen „von 2023" in einem Lernmittel für die Prüfung 2026. ✅ Auf relative
Angaben umgestellt („in diesem Jahr", „aus dem Vorjahr"). Gleiche Klasse wie Entrust/Comodo/LastPass.

---

## DER ANKER UND SEIN WÄCHTER

`begriffe_belegt.json` – **vier Einträge, und das ist Absicht** (Nutzer-Entscheid: klein bauen).
Aufgenommen wird ein Begriff erst, wenn ein Widerspruch **belegt** ist: Pay-per-Use, MAC,
Verfügbarkeit, BITV. **Zwei davon sind ausdrücklich nicht maschinell prüfbar** und stehen nur zur
Kenntnis darin – MAC hat drei richtige Bedeutungen, „Verfügbarkeit" zwei richtige Verwendungen.

⛔⛔ **DER WÄCHTER MISST KEINE BEDEUTUNG.** Geprüft wird ausschließlich: steht der Begriff im selben
Fenster neben einem Wort, das seiner Definition widerspricht – und fehlt ein Abgrenzungssatz?
**Das fängt den Pay-per-Use-Fall und sonst nichts.** Ein Wächter, der vorgibt, Bedeutung zu prüfen,
ist schlimmer als keiner: man verlässt sich auf ihn und liest nicht mehr selbst.

⚠️⚠️ **DIE ERSTE FASSUNG HATTE EINEN BLINDEN FLECK.** Sie nahm M04-008 und M04-120 pauschal von der
Prüfung aus – **also genau die zwei Fragen, in denen der Fehler gesessen hatte.** Dort hätte der
Wächter nie wieder anschlagen können. ✅ Umgebaut: statt Fragen auszunehmen, erkennt die Probe den
**Abgrenzungssatz** („Nicht zu verwechseln mit Pay-per-Use …").
►►► **Eine Ausnahme, die die Fundstelle des Fehlers stillstellt, ist kein Sonderfall, sondern ein
blinder Fleck.**

✅ **GEGENGEPROBT:** Ur-Zustand von M04-008 wiederhergestellt → `FEHLER Pay-per-Use: 1 -> M04-008`.
BITV-Merksatz wiederhergestellt → `FEHLER BITV: 1 -> M03-020`. Beide zurückgenommen, wieder grün.
