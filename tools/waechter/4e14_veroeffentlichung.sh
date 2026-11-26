# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e14) NICHTS IM BAUM, DAS NICHT OEFFENTLICH SEIN DARF (neu 09.10.2026, PLAN N40 V1, E66)
  # ⚠️ ANLASS: das Repo zieht in ein OEFFENTLICHES Repo mit frischer Historie (E66). Gemessen 09.10.:
  #    die Katalog-OCR trug den ©-Vermerk des Katalog-Herausgebers (fremdes Werk, alle Rechte vorbehalten),
  #    die Gmail-Adresse stand als Autor in 33 Commits. Der Katalog liegt seither privat in ../Buch/katalog.
  # ►► Gesucht wird in allen verfolgten UND neuen, nicht ignorierten Dateien - wie 4e13:
  #    (1) Sperrliste: Pfade, die nur privat liegen duerfen (Katalog-Daten, jede Tesseract-TSV, PDFs)
  #        und M09_FAKTEN.md (Westermann Kap. 4 fast woertlich, Gegenpruefung BUILD_LOG 113)
  #    (2) Fremdtext: ©-Vermerk des Katalog-Herausgebers, Kopfzeile einer Tesseract-TSV
  #    (3) private E-Mail: jede @gmail-Adresse; git user.email und Autor von HEAD nur noreply
  #    (4) Benutzerpfade und Geraetename (Platzhalter <benutzer1>/<benutzer2>/<rechner>)
  # ⚠️ Die web.de-Adresse ist ERLAUBT: sie steht als Verantwortlicher im Datenschutzhinweis (E66-Rueckfrage).
  # ⚠️ Die Muster stehen hier so, dass sie sich selbst NICHT treffen (Gegenprobe 09.10.).
  # ⚠️ WO ER NICHTS MISST: ignorierte Dateien, die Git-Historie (Antwort darauf: frische Historie, V3),
  #    Bilder (ein abfotografiertes Fremdwerk sieht er nur ueber die Sperrliste), sinngemaess
  #    uebernommener Fremdtext. Den Rest sucht der Gegenpruef-Agent aus V1 (BUILD_LOG 113).
  local VO_DATEIEN VO_RC VO_FUND="" VO_T VO_M VO_E
  VO_DATEIEN="$(git ls-files --cached --others --exclude-standard 2>/dev/null)"; VO_RC=$?
  if [ "$VO_RC" -ne 0 ] || [ -z "$VO_DATEIEN" ]; then
    melde "Veroeffentlichung: 'git ls-files' mit Rueckgabewert $VO_RC oder leer - nichts geprueft"
  else
    VO_T="$(printf '%s\n' "$VO_DATEIEN" | grep -E '^tools/katalog/(tsv/|pruefungskatalog|katalog_teil[0-9]*\.json$|teilbegriffe\.json$|aufzaehlungszeichen\.json$)|^referenz/batches_m09/M09_FAKTEN\.md$|\.(pdf|tsv)$' | head -5)"
    [ -n "$VO_T" ] && VO_FUND="$VO_FUND Sperrliste: $(printf '%s' "$VO_T" | tr '\n' ' ')·"
    VO_M='©[[:space:]]*ZPA|^level[[:space:]]page_num[[:space:]]block_num'
    VO_T="$(git grep --untracked -I -l -E "$VO_M" 2>/dev/null | head -5)"
    [ -n "$VO_T" ] && VO_FUND="$VO_FUND Fremdtext in: $(printf '%s' "$VO_T" | tr '\n' ' ')·"
    VO_T="$(git grep --untracked -I -l -i -E '[a-z0-9._%+-]+@g(oogle)?mail\.com' 2>/dev/null | head -5)"
    [ -n "$VO_T" ] && VO_FUND="$VO_FUND Gmail-Adresse in: $(printf '%s' "$VO_T" | tr '\n' ' ')·"
    # (4) Benutzerpfad/Geraetename (09.10. V2b): X:\Users\<name>, /x/Users/<name>, desktop-<7 Zeichen> -> <benutzer1>/<benutzer2>/<rechner>
    VO_T="$(git grep --untracked -I -l -E '[A-Za-z]:.Users.[A-Za-z0-9]|/[a-z]/Users/[A-Za-z0-9]|desktop-[a-z0-9]{7}' 2>/dev/null | head -5)"
    [ -n "$VO_T" ] && VO_FUND="$VO_FUND Benutzerpfad in: $(printf '%s' "$VO_T" | tr '\n' ' ')·"
    for VO_E in "config:$(git config user.email 2>/dev/null)" "HEAD:$(git log -1 --format=%ae 2>/dev/null)"; do
      case "${VO_E#*:}" in ""|*@users.noreply.github.com) ;; *) VO_FUND="$VO_FUND ${VO_E%%:*}-Autor ist keine noreply-Adresse·";; esac
    done
    if [ -n "$VO_FUND" ]; then
      melde "Veroeffentlichung:$VO_FUND - privat nach ../Buch, noreply-Adresse bzw. Platzhalter <benutzer1>/<rechner> (PLAN N40)"
    else
      ok "Veroeffentlichung ($(printf '%s\n' "$VO_DATEIEN" | wc -l | tr -d ' ') Dateien: keine Sperrliste, kein ©-Fremdtext, keine Gmail, kein Benutzerpfad, Autor noreply)"
    fi
  fi
