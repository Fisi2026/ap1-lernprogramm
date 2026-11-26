# E073 – START_PROMPT als Kern, Lehren nach Thema in regeln/
**Status:** angenommen (11.10.2026, Nutzer „so umsetzen“) · **Quelle:** BUILD_LOG 142

## Kontext
Pool-Arbeit las START_PROMPT (35 237 Byte, 399 Zeilen) und LEHREN (27 441 Byte) ganz. Claude-Code-Doku: Anweisungsdateien
ueber 200 Zeilen „reduce adherence“; Anthropic „Effective context engineering“: just-in-time laden.

## Entscheid
START_PROMPT bleibt der Kern (< 200 Zeilen: Messen, Standzeilen, Arbeitsregeln, Pflichttabelle); alles andere steht verbatim
in `regeln/pool.md`, `messen.md`, `git.md`, `bruecke.md`, `dateien.md`; `LEHREN.md` ist nur Verzeichnis.

## Folgen
Pool-Arbeit liest 44 791 statt 62 678 Byte. Waechter 4g prueft Kern ≤ 200 Zeilen und jede `regeln/*.md` in der
Pflichttabelle. Neue Lehren ans Ende der passenden Themendatei. Plugin 1.3.1 (Lesetabelle) in beiden Konten.
