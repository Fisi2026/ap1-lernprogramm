# T2 (#84) – Restliste: bewusst inline belassene Styles (für Folge-Refactoring)

Stand 2026-07-15. T2 hat statische Inline-Styles in Utility-Klassen (`.u-…`, ein Block am Ende von
styles.css, je Klasse GENAU eine CSS-Deklaration) ausgelagert. Ziel war **reine Codebereinigung ohne
jede sichtbare UI-Änderung** (verifiziert: jsdom-`getComputedStyle`-Differential orig==neu, 0 Abweichungen;
alle 20 Suiten grün).

## Was migriert wurde
- 135 statische Inline-Styles → 67 wiederverwendbare `.u-…`-Utilities.

## Was BEWUSST inline blieb (54 Stück) – Grund + Folge-Refactoring-Idee
Diese Elemente NICHT einfach in Utilities wandeln, sonst ändert sich das Aussehen/Verhalten:

### A) Spezifitätskonflikt (53) – Bestandsregel schlägt Einzelklassen-Utility
Früher gewann der Inline-Style immer; eine Utility (Spezifität 0,1,0) verliert dagegen gegen Regeln mit
Tag+Klasse/Mehrklassen. Betroffene Regeln v.a.:
- `button.b { … padding:10px 18px; color:#fff; … }` und `button.b.leise { color:var(--text); … }`
  → alle `<button class='b leise' style='padding:…|color:…'>` blieben inline (app_frage/loeser/seiten/pages2).
- `label.check { display:inline-flex; align-items:center; gap:6px; margin:…; font-size:.92rem; }`
  → `<label class='check' style='display:flex|gap|margin|…'>` blieben inline.
- weitere Kontext-/Mehrklassen-Regeln (`.fb.ok`, `.zeile`, `.trend`, `.wischleiste`, `.split .…`, dash-Slots).

**Folge-Refactoring-Optionen:** (a) diese Komponenten-Regeln auf niedrigere Spezifität umstellen (dann
gewinnen Utilities und die Styles lassen sich sauber auslagern); ODER (b) gezielte höher-spezifische
Utility-Varianten (z.B. `button.b.leise.u-…`) definieren. Beides ist ein eigener, testpflichtiger Task.

### B) Laufzeit-getoggelter Style (1)
- `<div class='abruf-verdeckt' style='display:none'>` (#98 Abruf-Übung): wird per `wrap.style.display=""`
  wieder eingeblendet. Als Klasse würde der Reveal brechen. Bleibt inline (oder eigene sichtbar/versteckt-
  Klassenlogik im Folge-Task).

## Nicht Teil von T2 (10) – dynamische Styles
Interpolierte `style='…" + x + "…'` (z.B. `width:<q>%`, `color:var(--<farbe>)`, `left/top:<px>`) – bleiben
grundsätzlich inline.

## Reproduktion / Verifikation (falls erneut nötig)
Deterministischer Bau: `tools/archiv/t2_build.js` (Konversion + Konflikt-Revert + Prune). Visuelle
Gleichheit: `tools/archiv/diff_render.js` (rendert orig vs. neu, vergleicht getComputedStyle über
alle Typen + Kernrouten). ⚠️ Beide am 10.09.2026 nach `tools/archiv/` verschoben (W1 Etappe B).
