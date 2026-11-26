# E074 – Hotspot-Zonen mindestens 24 px, auch wenn die Zeichnung dann rollt
**Status:** angenommen (11.10.2026, Nutzer „Ziele groesser zeichnen“, dann „so lassen“) · **Quelle:** BUILD_LOG 140

## Kontext
N48 P4 (`tools/sichtpruefung/n48p4.js`, 390 px): M01-483 hatte 7 Zonen je 7 px hoch, M03-980…982 je 5 Zonen 17 px –
unter WCAG 2.2 SC 2.5.8 (24 px) und ohne Abstands-Ausnahme. Groessere Trefferflaechen haetten sich ueberlappt.

## Entscheid
Die Hotspot-Zeichnung bekommt eine Mindestbreite = viewBox-Breite x 24 / kleinste Zonenseite; ist der Kasten schmaler,
rollt er waagerecht.

## Folgen
Bei 390 px rollen 15 von 39 Hotspot-Zeichnungen, bei 1280 px 3 (M01-483, M01-510, M03-701) – bewusst in Kauf genommen.
Overlay und Zeichnung decken sich pixelgleich (gemessen). Wer eine Hotspot-Frage mit kleineren Zonen anlegt, verbreitert damit die Zeichnung.
