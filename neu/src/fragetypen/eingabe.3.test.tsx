// @vitest-environment jsdom
/* Eingaben liefern die Form, die L.grade erwartet – Teil 3 von 4 (Gruppe 3 in testhilfe/eingabe.treiber.tsx).
   Schliesst den Kreis von der Bedienung bis zur Bewertung; Begruendung, Stichprobe und Treiber: dort.
   Geteilt am 18.10.2026 (N42), weil vitest nur Dateien parallelisiert. */
import { GRUPPEN, eingabeSuite } from "../testhilfe/eingabe.treiber";

eingabeSuite(GRUPPEN[2]);
