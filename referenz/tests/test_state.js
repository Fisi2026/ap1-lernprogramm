/* Test A1 (#56): Schema-Migration v5 – Alt-State, Teil-State, Idempotenz, Roundtrip, Render */
const { t: check, boot, report } = require("./_harness.js");

(async () => {
  // 1) Alter v3-State: Level-Shift + Alt-Felder weg + v5-Defaults + Bestandsdaten erhalten
  const altV3 = { level: 2, tts: true, streak: 5, simLastIds: ["M01-001"],
    fehlerDeck: { "M03-001": { stufe: 1 } }, notizen: { "M01-002": "test" },
    statistik: { M01: { richtig: 3, gesamt: 5 } } };
  let w = await boot(altV3), S = w.S;
  check("v3: level 2->3 verschoben", S.level === 3);
  check("v3: tts entfernt", !("tts" in S));
  check("v3: simLastIds -> simUsedIds", JSON.stringify(S.simUsedIds) === '["M01-001"]');
  check("v3: version=5", S.version === 5);
  check("v3: markiert-Default", JSON.stringify(S.markiert) === "{}");
  check("v3: simDauerMin=90", S.simDauerMin === 90);
  check("v3: fokus=false", S.fokus === false);
  check("v3: meldungen-Default", JSON.stringify(S.meldungen) === "{}");
  check("v3: relevanzGewichtung=true (A3-Default, Nutzer-Entscheid)", S.relevanzGewichtung === true);
  check("v3: farbsymbole/ariaAltTexte/onboardingDone false", S.farbsymbole === false && S.ariaAltTexte === false && S.onboardingDone === false);
  check("v3: typHilfeAus-Default", JSON.stringify(S.typHilfeAus) === "{}");
  check("v3: fehlerDeck erhalten", S.fehlerDeck["M03-001"].stufe === 1);
  check("v3: notizen erhalten", S.notizen["M01-002"] === "test");
  check("v3: statistik erhalten", S.statistik.M01.gesamt === 5);
  check("v3: App rendert", w.document.getElementById("main").innerHTML.length > 500);

  // 2) v4-State (_v4 gesetzt): KEIN Doppel-Shift, Bestandsfeld bleibt
  w = await boot({ _v4: true, level: 3, markiert: { "M01-001": 1 } }); S = w.S;
  check("v4: level bleibt 3 (kein Doppel-Shift)", S.level === 3);
  check("v4: vorhandenes markiert bleibt", S.markiert["M01-001"] === 1);
  check("v4: version=5", S.version === 5);

  // 3) Idempotenz von migriereState
  const a = w.migriereState({ level: 2 });
  const b = w.migriereState(JSON.parse(JSON.stringify(a)));
  check("Idempotenz: 2. Lauf ändert nichts, level nur 1x geschoben", JSON.stringify(a) === JSON.stringify(b) && a.level === 3);

  // 4) v5-State bleibt unverändert
  w = await boot({ version: 5, _v4: true, level: 4, simDauerMin: 60, fokus: true }); S = w.S;
  check("v5: simDauerMin 60 / fokus true / level 4 bleiben", S.simDauerMin === 60 && S.fokus === true && S.level === 4);

  // 5) Frischer State
  w = await boot(undefined); S = w.S;
  check("frisch: version=5 + alle v5-Felder", S.version === 5 && "markiert" in S && "typHilfeAus" in S && "meldungen" in S && "simDauerMin" in S);

  // 6) Roundtrip: speichere() -> localStorage -> Neuladen
  w = await boot(altV3);
  w.S.markiert["M02-001"] = 1; w.speichere();
  const saved = JSON.parse(w.localStorage.getItem("ap1v2_state"));
  check("Roundtrip: version+markiert persistiert", saved.version === 5 && saved.markiert["M02-001"] === 1);
  const w2 = await boot(saved);
  check("Roundtrip: Neuladen konsistent", w2.S.markiert["M02-001"] === 1 && w2.S.version === 5 && w2.S.level === 3);

  // 7) R5 State-Hygiene: tote fehlerDeck-/markiert-IDs werden nach Pool-Init entfernt, echte (inkl. AP2) bleiben
  w = await boot({ version: 5, _v4: true,
    fehlerDeck: { "M03-001": { stufe: 1 }, "FALL-01-t2": { stufe: 1 } },
    markiert: { "M04-002": 1, "TOT-999": 1 } });
  S = w.S;
  check("R5: tote IDs entfernt, echte + AP2-ID bleiben",
    !S.fehlerDeck["FALL-01-t2"] && S.fehlerDeck["M03-001"].stufe === 1 &&
    !S.markiert["TOT-999"] && S.markiert["M04-002"] === 1);

  // 8) R5 migriereState-Early-Exit: version==STATE_VERSION -> Objekt unverändert zurück
  const v5direkt = { version: 5, _v4: true, level: 4, simLastIds: ["marker"] };
  check("R5: Early-Exit bei version=5 (gleiches Objekt, keine Feld-Änderung)",
    w.migriereState(v5direkt) === v5direkt && v5direkt.simLastIds[0] === "marker");

  process.exit(report());
})().catch(e => { console.log("ABBRUCH:", e); process.exit(1); });
