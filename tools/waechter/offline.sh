# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 3) Offline-Audit (nur w3.org-SVG-Namespaces erlaubt)
  #    index.html (Landing, #39) und manifest/sw sind seit 2026-07-21 MIT drin: eine Landing-Seite
  #    verleitet zu externen Fonts/Icons – genau das muss der Audit fangen.
  #    FB-R3.12: Suche auf dem entkommentierten Stand – eine URL in einem Kommentar ist offline
  #    unschädlich und darf keinen Fehlalarm auslösen.
  local NCL=""
  for f in referenz/lernprogramm_ap1.html referenz/index.html referenz/manifest.webmanifest referenz/sw.js referenz/logik.js referenz/app_*.js referenz/styles.css; do
    ohne_kommentare "$f"; NCL="$NCL $NC_DATEI"
  done
  # shellcheck disable=SC2086  # gewollt: NCL ist eine Dateiliste (N45 W1)
  TREFFER=$(grep -oa "https\?://[a-zA-Z0-9./-]*" $NCL | grep -vc "www.w3.org")
  if [ "$TREFFER" -eq 0 ]; then ok "Offline-Audit (keine externen URLs im Code)"; else melde "Offline-Audit: $TREFFER externe URL(s)"; fi

