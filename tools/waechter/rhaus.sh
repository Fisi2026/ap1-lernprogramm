# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4d) Rhaus-Guard (FB-R3): die alte Beispielfirma wurde pool-weit ersetzt. Muster gezielt auf die
  #     Firma (Rhaus-Metall / Wort Rhaus), damit legitime -haus-Wörter (Systemhaus, Autohaus,
  #     Ortsnamen wie Wallhausen) NICHT anschlagen. pool/*.json ist JSON und kennt keine Kommentare.
  local RH=0
  grep -aqE "[Rr]haus-[Mm]et|\bRhaus\b" pool/*.json && RH=1   # N29 Teil 2: pool/*.json ist die einzige Fassung
  if [ "$RH" -eq 0 ]; then ok "Rhaus-Guard (Beispielfirma restlos ersetzt)"; else melde "Rhaus-Guard: alte Beispielfirma Rhaus-Metall/Rhaus noch im Pool - FB-R3 verlangt 0 Treffer"; fi

