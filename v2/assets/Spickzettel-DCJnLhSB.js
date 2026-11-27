import{r as e}from"./rolldown-runtime-hePW80VL.js";import{d as t,n,v as r}from"./input-IarGOL-0.js";import{i,n as a,r as o,t as s}from"./accordion-CXxW82Fg.js";import{t as c}from"./search-C6LiXG7o.js";import{A as l,D as u,F as d,M as f,N as p,O as m,P as h,j as g,k as _}from"./index-DNXvsp2W.js";var v=e(r(),1),y=`# AP1-Spickzettel – Die wichtigsten Fakten, Formeln und Merksätze

Kompakte Gesamtzusammenfassung aller Module. Prüfung: „Einrichten eines IT-gestützten Arbeitsplatzes", 90 Minuten, 4 ungebundene Aufgaben, 100 Punkte, 20 % der Gesamtprüfung. **Nicht in AP1:** SQL, RAID, Normalformen, Struktogramm/PAP, WiSo als eigener Bereich.

---

## Modul 01 – Projektmanagement

**Projektmerkmale:** einmalig, klares Ziel, zeitlich begrenzt, begrenzte Ressourcen, komplex, eigene Organisation.

**Netzplan (Zeitpunkt-Methode):**
- FAZ (Frühester Anfangszeitpunkt), FEZ = FAZ + Dauer → Vorwärtsrechnung
- SEZ (Spätester Endzeitpunkt), SAZ = SEZ − Dauer → Rückwärtsrechnung
- **GP (Gesamtpuffer) = SAZ − FAZ** (oder SEZ − FEZ)
- **FP (Freier Puffer) = FAZ(Nachfolger) − FEZ(aktuell)**
- **Kritischer Weg:** alle Vorgänge mit GP = 0 → bestimmt die Projektdauer

**SMART:** Spezifisch, Messbar, Attraktiv/Akzeptiert, Realistisch, Terminiert.

**Gantt-Diagramm (Balkenplan):** Balkenlänge = Dauer, Zeitachse waagerecht, Vorgänge senkrecht.
- **Meilenstein = Raute**, ein Ereignis **ohne eigene Dauer**
- **Abhängigkeitspfeil:** Vorgang startet erst nach seinem Vorgänger
- **Überschneidung:** nur bei *gemeinsamen* Zeitabschnitten – Balken, die sich an der Grenze berühren, überschneiden sich **nicht**
- Gantt zeigt Zeit und Auslastung anschaulich, aber **keine Puffer und keinen kritischen Weg** – dafür der Netzplan

**Managementtechniken:** **MbO** (Führung über vereinbarte Ziele) · **MbE** (Eingriff nur bei Abweichung) · **MbD** (Aufgabe *und* Verantwortung delegieren).

**Eisenhower-Matrix** (Wichtigkeit × Dringlichkeit): wichtig+dringend → sofort selbst · wichtig+nicht dringend → terminieren · nicht wichtig+dringend → delegieren · keins von beidem → weglassen.

**Scrum:** Product Owner (WAS, Backlog), Scrum Master (Prozess), Entwicklungsteam (WIE); Sprint (1–4 Wochen), Daily, Review (Produkt), Retrospektive (Prozess). Wasserfall = sequenziell/planbar, Scrum = iterativ/flexibel.

**Tuckman:** Forming → Storming → Norming → Performing (→ Adjourning).

**Risiko = Eintrittswahrscheinlichkeit × Schadenshöhe.** Maßnahmen: vermeiden, vermindern, übertragen, akzeptieren.

**Support-Level:** 1st Level = Annahme + Standardfälle, 2nd = Spezialisten, 3rd = Entwickler/Hersteller.

> Merke: „Der kritische Weg hat keinen Puffer – jede Verzögerung dort verschiebt das Projektende."

---

## Modul 02 – Kundenberatung, Kommunikation, Marketing

**Marktformen:** Monopol (1 Anbieter) → Oligopol (wenige) → Polypol (viele).
**Käufermarkt:** Angebot > Nachfrage → Preise sinken. **Verkäufermarkt:** umgekehrt.

**4-Ohren-Modell (Schulz von Thun):** Sachebene, Selbstoffenbarung, Beziehung, Appell (SSBA).
**Sender-Empfänger-Modell:** Störungen technisch/semantisch/organisatorisch; Feedback deckt Missverständnisse auf.

**Fragetypen:** offen (kreativ, schwer auswertbar), geschlossen (schnell auswertbar), Skala (abgestuft).
**Primärdaten** = selbst erhoben, **Sekundärdaten** = vorhanden.

**Nutzwertanalyse (DIE Rechenaufgabe!):**
1. Kriterien festlegen → 2. gewichten (Summe 100 %) → 3. Punkte vergeben (z. B. 1–10) → 4. Punkte × Gewicht → 5. Summe je Alternative → höchste Summe gewinnt.

**Vertrieb:** direkt (Hersteller → Kunde: hohe Marge, hohe Kosten) vs. indirekt (über Händler: Reichweite, geringere Marge).

**Quellenbewertung (SAU):** Seriosität, Aktualität, Urheber.

---

## Modul 03 – IT-Systeme, Hardware, Wirtschaftlichkeit

**OSI-Modell (7→1):** Anwendung, Darstellung, Sitzung, Transport, Vermittlung (IP), Sicherung (Ethernet/MAC), Bitübertragung. *„Alle Priester Saufen Tequila Nach Der Predigt."*
DNS/HTTP/SSH = Schicht 7, TCP/UDP = 4, IP/Router = 3, Switch/MAC = 2.

**Dateisysteme:** FAT32 (max. 4-GB-Dateien, kompatibel), NTFS (Windows, Rechte/Journaling), APFS (macOS), ext4 (Linux).

**WLAN:** 802.11n = Wi-Fi 4 (2,4 + 5 GHz), ac = Wi-Fi 5 (nur 5 GHz), ax = Wi-Fi 6 (2,4 + 5 GHz). **6 GHz erst mit Wi-Fi 6E**; alle drei Bänder gleichzeitig erst mit Wi-Fi 7 (802.11be, seit 2024).

**Formeln:**
- **Übertragungszeit = Datenmenge ÷ Übertragungsrate** — Einheiten! 1 Byte = 8 Bit; GB → Mbit: ×8×1000. *Beispiel: 2,5 GB über 50 Mbit/s = 20.000 Mbit ÷ 50 = 400 s ≈ 6:40 min.*
- **Energie: kWh = (Watt ÷ 1000) × Stunden; Kosten = kWh × Preis.** *150 W × 8 h × 220 Tage = 264 kWh × 0,35 € = 92,40 €/Jahr.*
- **Wirkungsgrad η = P_ab ÷ P_auf** (80-PLUS-Stufen für Netzteile).
- **TCO = Anschaffung + Betriebskosten × Jahre + Entsorgung − Restwert.** (Aufgaben ohne Entsorgungsposten rechnen die Kurzform.)

**Kostenarten:** einmalig (CAPEX) vs. laufend (OPEX); fix vs. variabel. Kauf vs. Leasing vs. Pay-per-Use über Laufzeit vergleichen.

**Gütesiegel:** Energy Star, Blauer Engel, EPEAT, 80 PLUS.

**Wertschöpfung = Output − Vorleistungen** — der *neue* Wert, den das Unternehmen selbst schafft.
**Wertschöpfungskette:** Beschaffung → Produktion → Absatz (**Kernprozesse**, direkt wertschöpfend). **Unterstützungsprozesse** (IT, Personal, Verwaltung) wirken nur indirekt – nicht weniger wichtig, aber ohne Wert am Produkt selbst.

---

## Modul 04 – IT-Lösungen, Software, Programmierung

**Lastenheft = WAS (Auftraggeber), Pflichtenheft = WIE (Auftragnehmer, verbindlich).**

**Private IPv4-Bereiche (RFC 1918):** 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16.
**IPv6:** 128 Bit, hexadezimal; Link-Local fe80::/10. **APIPA 169.254.x.x = kein DHCP erreichbar!**

**DHCP-Ablauf: DORA** – Discover, Offer, Request, Acknowledge.

**WLAN-Auth:** PSK (gemeinsames Passwort, privat/KMU) vs. Enterprise (802.1X/RADIUS, pro Benutzer, einzeln sperrbar). RADIUS = AAA: Authentifizierung, Autorisierung, Accounting.

**Konsolenbefehle:** dir/ls, mkdir, del/rm, copy/cp, ipconfig / ip addr, arp, chmod (Linux-Rechte), ping, tracert/traceroute, nslookup.

**Lizenzen:** EULA (Endnutzer), OEM (an Gerät gebunden), GNU GPL (Copyleft: Änderungen müssen offen bleiben), Pay-per-Use. UrhG: Schutz entsteht automatisch mit der Schöpfung.

**Programmierung:**
- Compiler (einmal übersetzen, schnell: C/C++) vs. Interpreter (zeilenweise: Python, JS)
- Schleifen: for/while = kopfgesteuert, do-while = fußgesteuert (läuft mind. 1×)
- Funktion = Rückgabewert, Prozedur = keiner
- Sichtbarkeit: + public, − private, # protected
- Fehler: formal (Syntax, Compiler findet ihn) vs. inhaltlich/logisch (läuft, aber falsch)

**UML:** Use-Case (Akteure + Anwendungsfälle; «include» = immer, «extend» = optional), Klassendiagramm (Attribute/Methoden, Multiplizitäten 1, *, 0..1), Aktivitätsdiagramm (Ablauf, Raute = Entscheidung).

**Schreibtischtest:** Tabelle mit einer Spalte je Variable, Zeile für Zeile den Code durchgehen.

**ER-Modell:** Entität (Rechteck), Attribut (Oval), Beziehung (Raute); Kardinalitäten 1:1, 1:n, m:n — **m:n immer über Zwischentabelle auflösen.**

---

## Modul 05 – Qualitätssicherung

**QM** = Gesamtsystem, **QS** = Teil davon (prüfen/dokumentieren). **KVP** = kontinuierlicher Verbesserungsprozess.

**Normen:** ISO 9000 (Begriffe), **ISO 9001 (zertifizierbar, Anforderungen)**. Zertifikat: externes Audit, gültig i. d. R. 3 Jahre, jährliche Überwachungsaudits.

**PDCA:** Plan (Ist/Ziel/Maßnahmen) → Do (umsetzen) → Check (messen) → Act (anpassen, standardisieren) → wieder Plan.

**Testprotokoll Arbeitsplatz:** Datum, Prüfer, Prüfpunkte (Boot, Netzwerk/Domäne, Peripherie, Software), Ergebnis OK/Fehler, Bemerkung, Unterschrift, Freigabe.

> Merke: „Plan ohne Do ist Theorie, Do ohne Check ist Glücksspiel, Check ohne Act ist sinnlos."

---

## Modul 06 – IT-Sicherheit und Datenschutz

**Schutzziele (CIA):** Vertraulichkeit (Verschlüsselung, Rechte), Integrität (Hashwerte, Signaturen), Verfügbarkeit (Backup, Redundanz).

**TOM (Art. 32 DSGVO):** technische (Firewall, Verschlüsselung, Backup) + organisatorische Maßnahmen (Richtlinien, Schulung, Berechtigungskonzept).

**DSB-Pflicht:** § 38 BDSG — i. d. R. ab 20 Personen mit ständiger automatisierter Verarbeitung. IT-Sicherheitsbeauftragter: meist freiwillig.

**Verschlüsselung:** symmetrisch (1 Schlüssel, schnell, AES) / asymmetrisch (Schlüsselpaar, langsam, RSA) / **hybrid = Daten symmetrisch, Schlüsselaustausch asymmetrisch (TLS)**.

**Hash** = Einwegfunktion (Integrität, SHA-256); **Zertifikat** = Identität von CA bestätigt; **digitale Signatur** = Hash mit privatem Schlüssel → Authentizität + Integrität.

**Authentifizierungsfaktoren:** Wissen, Besitz, Biometrie → 2FA = zwei davon kombinieren.
**Passwort (BSI aktuell):** lang statt komplex, kein anlassloser Wechselzwang, gehasht + Salt speichern.

**Betroffenenrechte (DSGVO):** Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch.
**Anonymisierung** = Personenbezug unumkehrbar weg; **Pseudonymisierung** = mit Schlüssel umkehrbar.

**BSI IT-Grundschutz:** Schutzbedarf je Objekt (Anwendung, System, Raum, Verbindung) und Schutzziel bewerten. Kategorien: **normal / hoch / sehr hoch**. Vererbung: **Maximumprinzip** (höchster Bedarf gewinnt), Kumulationseffekt (viele normale → hoch), Verteilungseffekt (Redundanz senkt).

**Zugangskontrolle** = Wer kommt rein (Login, Tür)? **Zugriffskontrolle** = Wer darf welche Daten (Berechtigungen)?

**Backup:**
- **Voll** = alles (Restore: 1 Satz)
- **Differenziell** = alles seit letzter VOLLsicherung, wächst täglich (Restore: Voll + letzte Diff)
- **Inkrementell** = nur seit letzter Sicherung, klein (Restore: Voll + ALLE Inkremente)
- **3-2-1-Regel:** 3 Kopien, 2 Medientypen, 1 extern.

**Härtung:** unnötige Dienste aus, Patches zeitnah, minimale Rechte. **Security by Design/Default.**

---

## Modul 07 – Leistungserbringung und Auftragsabschluss

**Vertragsarten:**
| Vertrag | geschuldet | IT-Beispiel |
|---|---|---|
| **Werkvertrag** | **Erfolg** (Abnahme!) | fertiges Netzwerk |
| **Dienstvertrag** | **Tätigkeit** | Admin-Stunden |
| Kaufvertrag | Ware + Eigentum | 10 Notebooks |
| Mietvertrag | Nutzung | Serverstellplatz |
| Leasing | Nutzung auf Zeit | PCs; Wartung je nach Vertragsart: Operating = Geber, Finanzierung = Nehmer |
| Lizenzvertrag | Nutzungsrecht | Microsoft 365 |
| Servicevertrag/SLA | messbare Servicewerte | 99,9 % Verfügbarkeit, Reaktionszeit |

**Abnahmeprotokoll (Werkvertrag):** Gefahrenübergang, Gewährleistungsbeginn, Vergütung wird fällig, Beweismittel. Bekannte Mängel immer vorbehalten (§ 640 Abs. 3 BGB)!

**Mängelarten:** Schlechtleistung (schlechte Qualität), Falschlieferung (aliud – etwas anderes), Minderlieferung (zu wenig). Rechte: Nacherfüllung, Minderung, Rücktritt, Schadensersatz.

**Unternehmensziele:** ökonomisch, ökologisch, sozial. Beziehungen: komplementär, konkurrierend, neutral.

**Organisation:** Einlinie (1 Chef, klar, langsam), Mehrlinie (mehrere Chefs, Spezialisierung, Konflikte), **Stablinie** (Linie + beratende Stäbe: Stabsstelle berät, hat **keine Weisungsbefugnis**, im Organigramm gestrichelt), Matrix (Funktion × Projekt, flexibel, Konfliktpotenzial).

**Aufbau = wer. Ablauf = wann.** Aufbauorganisation ist statisch (Stellen, Abteilungen, Instanzen; Werkzeug **Organigramm**), Ablauforganisation ist dynamisch (Reihenfolge und Termine; Werkzeuge **Gantt-Diagramm und Netzplan**). Die Aufbauorganisation entsteht aus **Aufgabenanalyse** (Gesamtaufgabe zerlegen) und **Aufgabensynthese** (Teilaufgaben zu Stellen bündeln).
**Dimensionen der Aufgabenanalyse:** Inhalt · Träger · Menge · Zeit · Rang · Sachmittel. *Der Marktpreis ist keine Dimension.*

**Vollmachten:** Handlungsvollmacht (§ 54 HGB) nur **gewöhnliche** Geschäfte; Prokura (§§ 48 ff. HGB) auch **außergewöhnliche**, aber nie Grundlagengeschäfte (Firma veräußern, Bilanz unterzeichnen, Insolvenzantrag) und Grundstücke nur mit Sondervollmacht (§ 49 II). Prokura erteilt **nur der Kaufmann selbst**; sie wirkt **ab Erteilung**, die Eintragung ins Handelsregister ist **deklaratorisch**.

**Anfrage und Angebot:** Die **Anfrage** ist unverbindlich und nennt Grund, Bedarf nach **Menge und Qualität**, Konditionen und Liefertermin. Das **Angebot** ist ein **Antrag** im Sinne des BGB, wenn es an eine bestimmte Person gerichtet, zugegangen und vollständig ist – der Vertrag entsteht erst durch **Antrag und Annahme**.
**Bindefristen:** unter Anwesenden sofort · per Brief etwa eine Woche · bei gesetzter Frist bis zum Fristablauf.
**Freizeichnungsklauseln** machen es unverbindlich: „freibleibend", „Preisänderung vorbehalten", „solange der Vorrat reicht".

**Change Management:** Promotoren einbinden, Skeptiker informieren, Widerständler ernst nehmen. Widerstandsursachen: Angst vor Kompetenzverlust, Wissenslücken, persönliche Historie. Werkzeuge: Blended Learning, Multiplikatoren.

**Nachkalkulation:** Ist ÷ Soll × 100 % — über 100 % = unwirtschaftlicher als geplant. Danach: Soll-Ist-Vergleich, Abweichungsanalyse, Lessons Learned, Nachfolgeaufträge (Cross-Selling, Wartungsvertrag).

---

## Die 10 häufigsten Rechenaufgaben-Typen der AP1

1. Netzplan: FAZ/FEZ/SAZ/SEZ, Puffer, kritischer Weg
2. Nutzwertanalyse mit Gewichtung
3. Übertragungszeit (Datenmenge ÷ Rate, Bit/Byte!)
4. Energiekosten (W → kWh → €)
5. Wirkungsgrad Netzteil
6. Kostenvergleich Kauf/Leasing/Pay-per-Use
7. Vor-/Nachkalkulation und Abweichung
8. Backup-Speicherbedarf (voll/differenziell/inkrementell)
9. Schreibtischtest (Variablen verfolgen)
10. Lizenzkostenvergleich (Einzel/Volumen/Abo)

**Prüfungstipps:** Einheiten immer mitschreiben und umrechnen (Bit vs. Byte!). Rechenweg zeigen — Teilpunkte! Bei „nennen" reichen Stichworte, bei „erläutern/begründen" ganze Sätze. Operatoren im Aufgabentext beachten.
`,b=/\n(?=#{1,2}\s)/;function x(e=y){return e.split(b).filter(e=>e.trim()).map(e=>({titel:(e.match(/^#{1,6}\s+(.+)/)??[])[1]??`Abschnitt`,koerper:e.replace(/^#{1,6}\s+.+\n?/,``),suchtext:e.toLowerCase()}))}function S(e,t){let n=(t||``).toLowerCase().trim();return n?e.filter(e=>e.suchtext.indexOf(n)>=0):[...e]}var C=/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/;function w(e){let t=[];for(let n of e.split(C))n&&(n.startsWith(`**`)&&n.endsWith(`**`)&&n.length>4?t.push({art:`fett`,text:n.slice(2,-2)}):n.startsWith("`")&&n.endsWith("`")&&n.length>2?t.push({art:`code`,text:n.slice(1,-1)}):n.startsWith(`*`)&&n.endsWith(`*`)&&n.length>2?t.push({art:`kursiv`,text:n.slice(1,-1)}):t.push({art:`text`,text:n}));return t}function T(e){let t=e.split(`
`),n=[],r=0;for(;r<t.length;){let e=t[r];if(/^\s*$/.test(e)||/^-{3,}\s*$/.test(e))r++;else if(/^#{1,6}\s/.test(e))n.push({art:`ueberschrift`,teile:w(e.replace(/^#+\s/,``))}),r++;else if(/^>\s/.test(e))n.push({art:`zitat`,teile:w(e.replace(/^>\s/,``))}),r++;else if(/^\s*[-*]\s/.test(e)){let e=[];for(;r<t.length&&/^\s*[-*]\s/.test(t[r]);)e.push(w(t[r].replace(/^\s*[-*]\s/,``))),r++;n.push({art:`liste`,geordnet:!1,punkte:e})}else if(/^\s*\d+\.\s/.test(e)){let e=[];for(;r<t.length&&/^\s*\d+\.\s/.test(t[r]);)e.push(w(t[r].replace(/^\s*\d+\.\s/,``))),r++;n.push({art:`liste`,geordnet:!0,punkte:e})}else if(/^\s*\|/.test(e)){let e=[];for(;r<t.length&&/^\s*\|/.test(t[r]);)e.push(t[r]),r++;let i=e.map(e=>e.trim().replace(/^\|/,``).replace(/\|\s*$/,``).split(`|`).map(e=>e.trim()));n.push({art:`tabelle`,kopf:(i[0]??[]).map(w),zeilen:i.slice(2).map(e=>e.map(w))})}else n.push({art:`absatz`,teile:w(e)}),r++}return n}var E=t();function D({teile:e}){return(0,E.jsx)(E.Fragment,{children:e.map((e,t)=>e.art===`fett`?(0,E.jsx)(`b`,{className:`font-semibold text-foreground`,children:e.text},t):e.art===`kursiv`?(0,E.jsx)(`i`,{children:e.text},t):e.art===`code`?(0,E.jsx)(`code`,{className:`rounded bg-muted px-1 py-0.5 font-mono text-[0.8125rem]`,children:e.text},t):(0,E.jsx)(`span`,{children:e.text},t))})}function O({liste:e}){return(0,E.jsx)(`div`,{className:`grid gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground`,children:e.map((e,t)=>{if(e.art===`ueberschrift`)return(0,E.jsx)(`h3`,{className:`pt-1 font-semibold text-foreground`,children:(0,E.jsx)(D,{teile:e.teile})},t);if(e.art===`zitat`)return(0,E.jsx)(`blockquote`,{className:`border-l-2 border-primary/60 bg-primary/5 px-3 py-2 text-foreground`,children:(0,E.jsx)(D,{teile:e.teile})},t);if(e.art===`liste`){let n=e.geordnet?`ol`:`ul`;return(0,E.jsx)(n,{className:e.geordnet?`ml-5 list-decimal space-y-1`:`ml-5 list-disc space-y-1`,children:e.punkte.map((e,t)=>(0,E.jsx)(`li`,{children:(0,E.jsx)(D,{teile:e})},t))},t)}return e.art===`tabelle`?(0,E.jsxs)(u,{className:`border-collapse text-[0.8125rem]`,children:[(0,E.jsx)(g,{children:(0,E.jsx)(f,{children:e.kopf.map((e,t)=>(0,E.jsx)(l,{className:`h-auto px-2 py-1.5 font-semibold text-foreground`,children:(0,E.jsx)(D,{teile:e})},t))})}),(0,E.jsx)(m,{children:e.zeilen.map((e,t)=>(0,E.jsx)(f,{children:e.map((e,t)=>(0,E.jsx)(_,{className:`px-2 py-1.5 align-top`,children:(0,E.jsx)(D,{teile:e})},t))},t))})]},t):(0,E.jsx)(`p`,{children:(0,E.jsx)(D,{teile:e.teile})},t)})})}function k(){let e=(0,v.useMemo)(()=>x(),[]),[t,r]=(0,v.useState)(``),l=(0,v.useMemo)(()=>S(e,t),[e,t]),[u,f]=(0,v.useState)(()=>e.length?[e[0].titel]:[]);function m(t){r(t);let n=S(e,t);f(t.trim()===``?n.length?[n[0].titel]:[]:n.map(e=>e.titel))}return(0,E.jsxs)(`div`,{className:`grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 px-6 pt-3.5 pb-6`,children:[(0,E.jsxs)(p,{className:`h-9 bg-card`,children:[(0,E.jsx)(h,{children:(0,E.jsx)(c,{"aria-hidden":`true`})}),(0,E.jsx)(d,{type:`search`,value:t,onChange:e=>m(e.target.value),"aria-label":`Im Spickzettel suchen`,placeholder:`Suchen — Formel, Begriff, Modul …`})]}),(0,E.jsx)(`div`,{className:`min-h-0 overflow-y-auto`,children:l.length===0?(0,E.jsx)(n,{className:`grid place-items-center px-8 py-10 text-center text-sm text-muted-foreground`,children:`Dazu steht nichts im Spickzettel.`}):(0,E.jsx)(s,{type:`multiple`,className:`grid gap-2.5`,value:u,onValueChange:f,children:l.map(e=>(0,E.jsxs)(o,{value:e.titel,className:`rounded-lg border bg-card px-4 py-1`,children:[(0,E.jsx)(i,{className:`font-semibold text-foreground`,children:(0,E.jsx)(`span`,{children:e.titel})}),(0,E.jsx)(a,{children:(0,E.jsx)(O,{liste:T(e.koerper)})})]},e.titel))})})]})}export{k as Spickzettel};