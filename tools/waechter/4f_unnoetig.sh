# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4f-unnoetig) UEBERFLUESSIGE TYP-UMWANDLUNGEN (`as`, `!`) im App-Code von neu/src.
#    Hat der Ausdruck den Zieltyp schon, behauptet die Umwandlung nichts, deckt aber eine kuenftige
#    Typluecke still zu. Soll: 0.
#    ⛔ Seit TS 7 (28.09.2026, BUILD_LOG 86, Nutzer-Entscheid): gefunden von der oxlint-Regel
#    `typescript/no-unnecessary-type-assertion` (typgestuetzt, tsgolint) im Lauf von 4f-umbau - das alte
#    tools/unnoetige_as.cjs brauchte die TS-6-Compiler-API und ist stillgelegt. Dieser Waechter prueft nur,
#    dass die Regel SCHARF bleibt: im App-Code "error", abgeschaltet hoechstens fuer Tests/Testhilfe/Generat.
if [ -d neu ]; then
  UA="$(node -e '
    const c = JSON.parse(require("fs").readFileSync("neu/.oxlintrc.json", "utf8"));
    const R = "typescript/no-unnecessary-type-assertion";
    if (!(c.options && c.options.typeAware)) { console.log("typeAware aus - Regel waere stumm"); process.exit(3); }
    if ((c.rules || {})[R] !== "error") { console.log(R + " nicht \"error\""); process.exit(3); }
    const erlaubt = new Set(["src/**/*.test.ts", "src/**/*.test.tsx", "src/testhilfe/**", "src/pruefstand.ts", "src/daten/frage.generiert.ts"]);
    for (const o of c.overrides || []) {
      if (o.rules && R in o.rules && o.rules[R] !== "error") {
        const fremd = (o.files || []).filter((f) => !erlaubt.has(f));
        if (fremd.length) { console.log("abgeschaltet fuer App-Code: " + fremd.join(", ")); process.exit(3); }
      }
    }
    console.log("scharf");
  ' 2>&1)"; UA_RC=$?
  if [ "$UA_RC" -eq 3 ]; then
    melde "Unnoetige Umwandlungen neu/: $UA - neu/.oxlintrc.json"
  elif [ "$UA_RC" -ne 0 ] || [ "$UA" != "scharf" ]; then
    melde "Unnoetige Umwandlungen neu/: Werkzeug stumm (rc $UA_RC: $(printf '%s' "$UA" | head -1 | cut -c1-200))"
  else
    ok "Unnoetige Umwandlungen neu/ (oxlint-Regel scharf; Funde zaehlt 4f-umbau)"
  fi
fi
