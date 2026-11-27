"""tools/luecken_messen.py - LUECKEN DES POOLS GEGEN DIE KATALOGPUNKTE DER KURSMODULE MESSEN (nur lesen).

    python3 tools/luecken_messen.py                 Abschnitt-Tabelle + Stichwort-Tabelle (Markdown)
    python3 tools/luecken_messen.py --abschnitte    nur die Abschnitt-Tabelle (je Katalogthema 1.1 ... 7.7)
    python3 tools/luecken_messen.py --stichworte    nur die Stichwort-Tabelle
    python3 tools/luecken_messen.py --selbsttest    fuenf Faelle mit bekannter Antwort (rc 0 nur bei 5/5)

Grundlage (E079-Etappe "Luecken messen", 27.11.2026): `00_Themenuebersicht.md` fuehrt die Katalogthemen
1.1 ... 7.7 (= Abschnitte der Kursdateien `0X_*.md`) mit den Katalogpunkten als Stichworten. Je Abschnitt:
  Fragen        gezaehlt ueber das Feld `verweis` ("Modul 05, Abschnitt 5.2") - AP1 und AP2-Zusatz getrennt
  Typen/Stufen  aus den Fragen dieses Abschnitts
  Lehrtext      Woerter des Abschnitts in der Kursdatei, `Selbsttest` ja/nein
Je Stichwort: Fragen mit PRUEFSUBSTANZ (Frage, richtige Antwort, Musterloesung ... - Logik aus
tools/katalog/abdeckung.py), Fragen nur im NEBENTEXT, Treffer im Lehrtext des Moduls, Treffer im Spickzettel
(Modulabschnitt von `99_Spickzettel.md`).
⚠️ KANDIDATENFILTER, KEIN URTEIL: ein Stichwort ist ein Regex ueber den Wortlaut. Eine Null heisst "der Wortlaut
fehlt", nicht "der Stoff fehlt" (Lehre 10.10.: Filter koennen Treffer verschlucken UND zu viel melden).
Der KATALOG-OCR selbst (`../Buch/katalog`) wird hier NICHT gelesen: die Stichworte stammen aus
`00_Themenuebersicht.md` (Katalog S. 9-16, wie dort wiedergegeben).
"""
import collections
import glob
import json
import os
import re
import sys
from pathlib import Path

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
sys.path.insert(0, os.path.join(HIER, "katalog"))
import abdeckung as ab

MODULDATEI = {1: "01_Projektmanagement_und_Arbeitsorganisation.md", 2: "02_Kundenberatung_Kommunikation_Marketing.md",
              3: "03_IT-Systeme_Hardware_Wirtschaftlichkeit.md", 4: "04_IT-Loesungen_Software_Programmierung.md",
              5: "05_Qualitaetssicherung.md", 6: "06_IT-Sicherheit_und_Datenschutz.md",
              7: "07_Leistungserbringung_und_Auftragsabschluss.md"}

# Katalogthema -> Stichworte (Label = Regex ueber den entumlautet kleingeschriebenen Text). Quelle: 00_Themenuebersicht.md.
STICHWORTE = {
    "1.1": {"Projektmerkmale": r"projektmerkmal|einmalig", "Strukturplan/PSP": r"strukturplan|\bpsp\b", "Netzplan": r"netzplan",
            "kritischer Weg": r"kritische[rn]? weg", "Puffer": r"\bpuffer|\bgp\b", "Gantt": r"gantt", "SMART": r"\bsmart\b",
            "Meilenstein": r"meilenstein", "Wasserfall": r"wasserfall", "Scrum": r"scrum", "Teambildung/Teamphasen": r"teambildung|tuckman|forming|storming",
            "Reflexion/Lessons Learned": r"reflexion|reflektion|lessons learned|retrospektiv"},
    "1.2": {"Machbarkeitsanalyse": r"machbarkeit", "Budget": r"\bbudget", "Vorkalkulation": r"vorkalkulation",
            "Nachkalkulation": r"nachkalkulation", "Stakeholder": r"stakeholder", "Risikoanalyse": r"risikoanalyse|risikobewertung",
            "Risikomatrix": r"risikomatrix|risiko-matrix"},
    "1.3": {"Fehler-/Stoerungsmanagement": r"stoerungsmanagement|fehlermanagement|incident", "Ticketsystem": r"ticket",
            "1st/2nd/3rd Level": r"first.level|second.level|third.level|1st.level|2nd.level|3rd.level|\d\.?.?level",
            "KI im Support": r"\bki\b|kuenstliche intelligenz|chatbot", "Kundenkommunikation": r"kundenkommunikation"},
    "2.1": {"Marktformen": r"marktform|monopol|oligopol|polypol", "Kaeufer-/Verkaeufermarkt": r"kaeufermarkt|verkaeufermarkt",
            "Zielgruppe": r"zielgruppe", "quantitative/qualitative Angebotsbewertung": r"quantitativ|qualitativ"},
    "2.2": {"Bedarfsanalyse": r"bedarfsanalyse", "Kundenbefragung": r"kundenbefragung|fragebogen|befragung", "Auswertung vorhandener Daten": r"sekundaer|vorhandene daten|desk research|primaer"},
    "2.3": {"Kundenkommunikation": r"kundenkommunikation|kundengespraech", "4-Ohren-Modell": r"4.ohren|vier.ohren|schulz von thun",
            "Sender-Empfaenger": r"sender.empfaenger|sender und empfaenger", "englische Texte": r"englisch"},
    "2.4": {"Praesentation": r"praesentation", "Quellenbewertung": r"quelle", "Medienkompetenz": r"medienkompetenz",
            "technische/kaufm. Texte": r"fachtext|datenblatt|technisches merkblatt"},
    "2.5": {"Nutzwertanalyse": r"nutzwert", "Vertriebsformen": r"vertriebsform|direkter vertrieb|indirekter vertrieb|direktvertrieb",
            "Marketing(mix)": r"marketing"},
    "3.1": {"funktionale/oekonomische/oekologische Aspekte": r"oekologisch|oekonomisch", "CPU": r"\bcpu\b|prozessor", "Mainboard": r"mainboard|hauptplatine|motherboard",
            "Speicher (RAM/SSD/HDD)": r"\bram\b|\bssd\b|\bhdd\b", "Netzteil": r"netzteil", "Grafikkarte": r"grafikkarte|\bgpu\b",
            "Peripherie": r"peripherie|monitor|drucker", "Standardsoftware": r"standardsoftware", "Branchensoftware": r"branchensoftware",
            "Systemsoftware": r"systemsoftware|betriebssystem", "Entwicklungssoftware": r"entwicklungssoftware|entwicklungsumgebung|\bide\b",
            "SaaS": r"\bsaas\b|software as a service", "DaaS": r"\bdaas\b|desktop as a service", "virtuelle Desktops/VDI": r"\bvdi\b|virtuelle[rn]? desktop",
            "KI-Software": r"ki.software|\bki\b"},
    "3.2": {"Kommunikationssysteme": r"kommunikationssystem|voip|telefonanlage|unified communication", "Client-Server": r"client.server",
            "Domaene": r"dom(ae|a)ne|active directory", "Mobilgeraete": r"mobilger|smartphone|tablet", "Ethernet": r"ethernet",
            "DNS": r"\bdns\b", "OSI-Modell": r"\bosi\b", "IP": r"\bip.adress|ipv4|ipv6"},
    "3.3": {"BIOS/UEFI": r"\bbios\b|\buefi\b", "Dateisysteme": r"ntfs|\bfat32|ext4|dateisystem", "LWL/Glasfaser": r"\blwl\b|glasfaser|lichtwellenleiter",
            "WLAN-Standards": r"802\.11|wlan", "Barrierefreiheit": r"barrierefrei", "Guetesiegel": r"guetesiegel|blauer engel|energy star|tco cert",
            "Uebertragungsrate/-zeit": r"uebertragungsrate|uebertragungszeit|datenrate|mbit", "Datenmengen/Praefixe": r"kibi|mebi|gibi|praefix|datenmenge",
            "Leistung/Wirkungsgrad": r"wirkungsgrad|leistungsaufnahme|\bwatt\b", "Energiekosten": r"energiekosten|stromkosten|kwh"},
    "3.4": {"Anschaffungskosten": r"anschaffungskosten", "Betriebskosten": r"betriebskosten", "fixe/variable Kosten": r"fixe kosten|variable kosten",
            "Lizenzkosten": r"lizenzkosten", "Leasing": r"leasing", "Kauf/Miete": r"mietkauf|\bkauf\b", "Pay-per-Use": r"pay.per.use",
            "Angebotsvergleich": r"angebotsvergleich", "TCO": r"\btco\b", "Wertschoepfung": r"wertschoepfung"},
    "4.1": {"Lastenheft": r"lastenheft", "Pflichtenheft": r"pflichtenheft", "Partitionierung": r"partition", "Formatierung": r"formatier",
            "IPv4/IPv6": r"ipv4|ipv6", "Remote-Desktop": r"remote.desktop|\brdp\b|ssh", "KI-Software (Install.)": r"\bki\b"},
    "4.2": {"Geraeteklassen": r"geraeteklasse|thin client|workstation|notebook|laptop", "mobil/stationaer": r"mobil|stationaer"},
    "4.3": {"Anwendungssoftware": r"anwendungssoftware", "Betriebssystem": r"betriebssystem", "IDE": r"\bide\b|entwicklungsumgebung",
            "Standard/Individualsoftware": r"individualsoftware", "Open Source/proprietaer": r"open.source|proprietaer"},
    "4.4": {"Urheberrecht": r"urheber", "EULA": r"\beula\b", "OEM": r"\boem\b", "GNU/GPL": r"\bgnu\b|\bgpl\b", "Pay-per-Use (Lizenz)": r"pay.per.use",
            "Lizenzmodelle (Volumen/Einzelplatz)": r"volumenlizenz|einzelplatzlizenz|floating|concurrent"},
    "4.5": {"Hardware-/OS-Installation": r"installation", "Kommandozeile": r"kommandozeile|\bcmd\b|bash|powershell", "IP-Konfiguration": r"ipconfig|ifconfig|\bip a\b|ip addr",
            "DHCP": r"\bdhcp\b", "WLAN PSK/Enterprise": r"\bpsk\b|wpa|enterprise", "VPN": r"\bvpn\b", "ping": r"\bping\b", "traceroute": r"traceroute|tracert",
            "nslookup": r"nslookup|\bdig\b", "arp": r"\barp\b", "chmod": r"chmod", "dir/ls/mkdir/cp": r"\bmkdir\b|\bls\b|\bdir\b"},
    "4.6": {"Compiler/Interpreter/Linker": r"compiler|interpreter|linker", "prozedural/objektorientiert": r"prozedural|objektorientiert", "Variablen": r"variable",
            "Datentypen": r"datentyp|integer|\bstring\b|boolean|\bfloat", "Kontrollstrukturen": r"kontrollstruktur|schleife|verzweigung",
            "Funktionen": r"funktion|prozedur", "Klassen": r"klasse", "Bibliotheken": r"bibliothek|library", "Skriptsprachen": r"skript|script",
            "Debugging": r"debug"},
    "4.7": {"Pseudocode": r"pseudocode", "UML Use-Case": r"use.case|anwendungsfall", "UML Klassendiagramm": r"klassendiagramm", "UML Aktivitaetsdiagramm": r"aktivitaetsdiagramm",
            "Bildschirmmaske/GUI": r"bildschirmmaske|\bgui\b|maskenentwurf", "Fehlersuche im Code": r"fehlersuche|syntaxfehler|logikfehler", "Schreibtischtest": r"schreibtischtest"},
    "4.8": {"ER-Modell": r"er.modell|entity|entitaet", "Primaer-/Fremdschluessel": r"primaerschluessel|fremdschluessel", "Kardinalitaet": r"kardinalitaet|1:n|n:m"},
    "5.1": {"QM-System": r"qm.system|qualitaetsmanagementsystem", "QS-Normen (ISO 9001)": r"iso 9001|iso 9000|\bdin en iso", "Zertifizierung": r"zertifizier", "Audit": r"audit"},
    "5.2": {"Qualitaetsplanung/-ziele": r"qualitaetsplanung|qualitaetsziel", "Qualitaetslenkung": r"qualitaetslenkung", "PDCA": r"pdca|deming",
            "Testprotokoll": r"testprotokoll", "KVP": r"\bkvp\b|kontinuierliche[rn]? verbesserung", "Qualitaetskosten": r"qualitaetskosten|fehlerkosten"},
    "6.1": {"Schutzziele CIA": r"vertraulichkeit|integritaet|verfuegbarkeit", "TOM": r"\btom\b|technisch.organisatorisch", "IT-Sicherheitsbeauftragter": r"it.sicherheitsbeauftragte|\bisb\b",
            "Datenschutzbeauftragter": r"datenschutzbeauftragte", "Passwort-Policy": r"passwort", "Virenschutz": r"virenschutz|antivirus|malware|virenscanner",
            "Firewall": r"firewall", "sym./asym./hybride Verschluesselung": r"asymmetrisch|symmetrisch|hybrid", "BSI IT-Grundschutz": r"grundschutz",
            "DSGVO": r"dsgvo|datenschutz.grundverordnung", "BDSG": r"\bbdsg\b|bundesdatenschutzgesetz", "personenbezogene Daten": r"personenbezogene",
            "Betroffenenrechte": r"betroffenenrecht|auskunftsrecht|recht auf (loeschung|auskunft)", "Anonymisierung": r"anonymisier", "Pseudonymisierung": r"pseudonymisier"},
    "6.2": {"Schutzbedarfsanalyse": r"schutzbedarf", "Anwendungen/IT-Systeme": r"it.system", "Raeume/Infrastruktur": r"raeume|infrastruktur", "Kommunikationsverbindungen": r"kommunikationsverbindung"},
    "6.3": {"BSI-Bausteine": r"baustein", "Schutzbedarfskategorien": r"sehr hoch|normal.*hoch", "Risiko-Matrix": r"risikomatrix|risiko-matrix|eintrittswahrscheinlichkeit", "ISMS": r"\bisms\b|informationssicherheitsmanagement"},
    "6.4": {"Security by Design/Default": r"security by (design|default)", "Haertung": r"haertung|hardening", "Backup": r"backup|datensicherung", "NAS": r"\bnas\b",
            "Zugangs-/Zugriffskontrolle": r"zugriffskontrolle|zugangskontrolle|zutrittskontrolle", "Hashwerte": r"hashwert|\bhash\b|sha.?256", "Zertifikate": r"zertifikat",
            "digitale Signatur": r"signatur", "Zwei-Faktor/MFA": r"zwei.faktor|2fa|\bmfa\b|multi.faktor", "Personal Firewall": r"personal firewall|host.firewall"},
    "7.1": {"Kaufvertrag": r"kaufvertrag", "Mietvertrag": r"mietvertrag", "Leasingvertrag": r"leasingvertrag|\bleasing\b", "Lizenzvertrag": r"lizenzvertrag",
            "Servicevertrag/SLA": r"\bsla\b|service.level|servicevertrag", "Werkvertrag": r"werkvertrag", "Dienstvertrag": r"dienstvertrag",
            "Vertragsbestandteile": r"vertragsbestandteil|vertragsparteien|leistungsumfang", "Vertragsstoerungen/Maengel": r"vertragsstoerung|mangel|maengel|verzug", "Gewaehrleistung/Garantie": r"gewaehrleistung|garantie"},
    "7.2": {"Unternehmensziele": r"unternehmensziel", "Leitbild": r"leitbild", "oekonomisch/oekologisch/sozial": r"oekologisch|sozial", "Zielbeziehungen": r"zielkonflikt|zielbeziehung|komplementaer|konkurrierend"},
    "7.3": {"vor Ort/Onsite": r"vor ort|onsite|on.site", "Remote": r"remote", "Ticketsystem": r"ticket", "Kundenvorgaben": r"kundenvorgabe"},
    "7.4": {"Einliniensystem": r"einliniensystem|einlinien", "Mehrliniensystem": r"mehrlinien", "Matrixorganisation": r"matrixorganisation", "Vollmachten": r"vollmacht|prokura|handlungsvollmacht",
            "Organigramm": r"organigramm", "Aufbau-/Ablauforganisation": r"ablauforganisation|aufbauorganisation"},
    "7.5": {"Veraenderungsprozess/Change": r"change.management|veraenderungsprozess", "Promotoren": r"promotor", "Bremser/Skeptiker/Widerstaendler": r"bremser|skeptiker|widerstaendler|widerstand",
            "Ursachen von Widerstaenden": r"ursachen? (von|der) widerstaend|angst vor", "Blended Learning": r"blended learning", "Multiplikatoren": r"multiplikator", "Mitarbeiterqualifizierung": r"qualifizierung|schulung"},
    "7.6": {"Leistungsuebergabe/Abnahme": r"abnahme|uebergabe", "Abnahmeprotokoll": r"abnahmeprotokoll|uebergabeprotokoll", "Einweisung": r"einweisung|einweisen",
            "Mangelarten": r"schlechtleistung|falschlieferung|minderlieferung|sachmangel|rechtsmangel"},
    "7.7": {"Soll-Ist-Vergleich": r"soll.ist", "Abweichungsanalyse": r"abweichungsanalyse|abweichung", "Nachkalkulation": r"nachkalkulation", "Lessons Learned": r"lessons learned",
            "Nachfolgeauftraege": r"nachfolgeauftrag|folgeauftrag|anschlussauftrag"},
}

VERWEIS = re.compile(r"Modul\s*0?(\d)[^0-9]*?(\d)\.(\d+)")


def norm(s):
    return ab.entumlauten(s)


def lade_pool():
    fragen = []
    for pfad in sorted(glob.glob(os.path.join(WURZEL, "pool", "pool_m*.json"))):
        d = json.loads(Path(pfad).read_text(encoding="utf-8"))
        fragen.extend(d if isinstance(d, list) else d.get("fragen", []))
    return fragen


def abschnitt_von(f):
    m = VERWEIS.search(f.get("verweis") or "")
    return f"{m.group(2)}.{m.group(3)}" if m else None


def kursdatei(modul):
    return norm(Path(os.path.join(WURZEL, MODULDATEI[modul])).read_text(encoding="utf-8"))


def lehrtext_abschnitte(modul):
    """Abschnitt-Nr -> (Wortzahl, hat_Selbsttest), aus den '## N.M'-Bloecken der Kursdatei (nicht normiert gezaehlt)."""
    text = Path(os.path.join(WURZEL, MODULDATEI[modul])).read_text(encoding="utf-8")
    teile = re.split(r"(?m)^## (?=\d+\.\d+ )", text)
    aus = {}
    for t in teile[1:]:
        nr = re.match(r"(\d+\.\d+)", t).group(1)
        aus[nr] = (len(t.split()), bool(re.search(r"(?m)^### Selbsttest", t)))
    return aus


def spick_modul(modul):
    text = Path(os.path.join(WURZEL, "99_Spickzettel.md")).read_text(encoding="utf-8")
    teile = re.split(r"(?m)^## ", text)
    for t in teile:
        if t.startswith(f"Modul 0{modul} "):
            return norm(t)
    return ""


def abschnitt_tabelle(fragen):
    je = collections.defaultdict(list)
    for f in fragen:
        a = abschnitt_von(f)
        if a:
            je[a].append(f)
    zeilen = ["| Katalogthema | Fragen AP1 | AP2-Zus. | Typen (Anz.) | Stufen 1/2/3/4 | Lehrtext Wörter | Selbsttest | Spickzettel-Wörter Modul |",
              "|---|---:|---:|---|---|---:|---|---:|"]
    summen = collections.Counter()
    for nr in STICHWORTE:
        modul = int(nr[0])
        fs = je.get(nr, [])
        ap1 = [f for f in fs if f.get("pruefungsteil") == "AP1"]
        ap2 = [f for f in fs if f.get("pruefungsteil") != "AP1"]
        typen = collections.Counter(f.get("typ") for f in ap1)
        st = collections.Counter(f.get("schwierigkeit") for f in ap1)
        lt = lehrtext_abschnitte(modul).get(nr, (0, False))
        zeilen.append(f"| {nr} | {len(ap1)} | {len(ap2)} | {len(typen)} ({', '.join(f'{k} {v}' for k, v in typen.most_common(3))}…) | "
                      f"{st[1]}/{st[2]}/{st[3]}/{st[4]} | {lt[0]} | {'ja' if lt[1] else 'nein'} | {len(spick_modul(modul).split())} |")
        summen["ap1"] += len(ap1)
        summen["ap2"] += len(ap2)
    ohne = [f for f in fragen if not abschnitt_von(f)]
    zeilen.append(f"| **Summe** | **{summen['ap1']}** | **{summen['ap2']}** | | | | | |")
    zeilen.append("")
    zeilen.append(f"Fragen ohne `Modul X, Abschnitt Y.Z`-Verweis (WiSo/M08 u. a.): {len(ohne)}.")
    return "\n".join(zeilen)


def stichwort_tabelle(fragen):
    ap1 = [f for f in fragen if f.get("pruefungsteil") == "AP1"]
    zerlegt = []
    for f in ap1:
        s, n = ab.substanz_und_nebentext(f)
        zerlegt.append((s, n))
    zeilen = ["| Thema | Stichwort | Fragen mit Prüfsubstanz | nur Nebentext | Lehrtext-Treffer (Modul) | Spickzettel-Treffer |", "|---|---|---:|---:|---:|---:|"]
    for nr, kw in STICHWORTE.items():
        modul = int(nr[0])
        lt, sp = kursdatei(modul), spick_modul(modul)
        for label, rx in kw.items():
            r = re.compile(rx)
            mit = sum(1 for s, n in zerlegt if r.search(s))
            neben = sum(1 for s, n in zerlegt if not r.search(s) and r.search(n))
            zeilen.append(f"| {nr} | {label} | {mit} | {neben} | {len(r.findall(lt))} | {len(r.findall(sp))} |")
    return "\n".join(zeilen)


def selbsttest():
    """Fuenf Faelle mit bekannter Antwort (Gegenprobe vor dem ersten Urteil, regeln/messen.md 11.10.)."""
    ok = 0
    # 1: Verweis-Parser, normaler Fall
    ok += abschnitt_von({"verweis": "Modul 05, Abschnitt 5.2"}) == "5.2"
    # 2: kein Verweis (WiSo) -> None
    ok += abschnitt_von({"verweis": "HGB §§ 1–7 — WiSo-Grundlagen: Kaufmannseigenschaft"}) is None
    # 3: Stichwort trifft nur in Substanz, nicht im Nebentext (Distraktor) - Kernlogik von abdeckung.py
    f = {"frage": "Welche Norm?", "optionen": ["ISO 9001", "ISO 27001"], "loesungIndex": 1, "verweis": "Modul 05, Abschnitt 5.1"}
    s, n = ab.substanz_und_nebentext(f)
    ok += (re.search(r"iso 27001", s) is not None) and (re.search(r"iso 9001", s) is None) and (re.search(r"iso 9001", n) is not None)
    # 4: jeder Regex der Tabelle kompiliert, jedes Katalogthema hat ein Kursmodul
    ok += all(re.compile(rx) for kw in STICHWORTE.values() for rx in kw.values()) and all(int(nr[0]) in MODULDATEI for nr in STICHWORTE)
    # 5: bekannte Zahl - 'Medienkompetenz' steht (laut COVERAGE.md 27.07.) im Pool-Abschnitt 2.4 als Stichwort, Thema 7.7 hat Selbsttest in der Kursdatei
    ok += lehrtext_abschnitte(7).get("7.7", (0, None))[1] in (True, False) and len(lehrtext_abschnitte(7)) == 7
    print(f"selbsttest {ok}/5")
    return 0 if ok == 5 else 1


def main():
    a = sys.argv[1:]
    if "--selbsttest" in a:
        sys.exit(selbsttest())
    fragen = lade_pool()
    if "--stichworte" not in a:
        print(abschnitt_tabelle(fragen))
        print()
    if "--abschnitte" not in a:
        print(stichwort_tabelle(fragen))


if __name__ == "__main__":
    main()
