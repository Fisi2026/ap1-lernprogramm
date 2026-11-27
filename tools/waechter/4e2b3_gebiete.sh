# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2b3) GEBIETSVERTEILUNG IN docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md
  # ⚠️ ANLASS 02.09.2026: Die Datei fuehrte ZWEI von Hand gepflegte Gebietstabellen. Beide waren
  #    veraltet und widersprachen einander (A1 127 gegen 142, gemessen 148; A4 22 gegen 44,
  #    gemessen 47; B3 54, gemessen 103). Der dort angekuendigte Neu-Messpunkt "nach Etappe 2"
  #    wurde nie gesetzt. Heikel, weil test_didaktik.js mit SCHWELLE_GEBIET_MIN = 4.8 an A4 haengt:
  #    gemessen 5,03 % - 0,23 Punkte Luft. Wer die Lage aus der Datei beurteilte, las 22 oder 44.
  #    ►► Die Zahlen werden jetzt gemessen statt gepflegt; Begruendung in tools/gebiete_stand.py.
  #    Geprueft am 02.09. an drei Faellen mit bekannter Antwort: A4 von Hand auf 44 -> ABWEICHUNG
  #    mit Zahl; Block geleert -> ABWEICHUNG ohne Absturz; neu gesetzt -> OK 8.
  if [ -f tools/gebiete_stand.py ] && [ -f docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md ]; then
    local GEB
    GEB="$(python3 tools/gebiete_stand.py --pruefe 2>/dev/null)"
    case "${GEB:-KEINBLOCK}" in
      OK*)         ok "Gebietsverteilung (${GEB#OK } Gebiete gemessen, docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md buendig)" ;;
      ABWEICHUNG*) melde "Gebiets-Guard: ${GEB#ABWEICHUNG } - 'python3 tools/gebiete_stand.py --setze'" ;;
      # ⚠️ ANLASS 06.09.2026: "IP-Adressierung & Subnetting" war EIN Thema mit ZWEI Pruefungsteilen
      #    (3 Fragen AP1, 12 AP2). Vier Fragen, die der Katalog ausdruecklich unter Teil 1 fuehrt,
      #    erschienen dadurch nur im AP2-Modus - der Lerner uebte fuer Teil 1 und bekam sie nie zu
      #    sehen. Am 02.09. VON HAND gefunden, in v1.22.0 repariert, danach durch nichts bewacht.
      #    Heute 0 von 86 Themen; die Ratsche steht auf null. Begruendung in gebiete_stand.py.
      GEMISCHT*)   melde "Teil-Guard: ${GEB#GEMISCHT } - ein Gebiet und ein Thema gehoeren zu genau EINEM Pruefungsteil" ;;
      *)           melde "Gebiets-Guard: der erzeugte Block fehlt in docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md" ;;
    esac
  fi

