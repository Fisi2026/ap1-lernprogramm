/* Test (FB-R3 Punkt 12): tools/entkommentiere.js – der Kommentar-Stripper, auf dem seit dieser
   Runde VIER Waechter in check.sh aufsetzen (Offline-Audit, UTF-8, Anti-Pattern, Rhaus).
   Warum diese Suite existiert: der erste CI-Lauf von v1.3.0 scheiterte an einem Kommentar, der
   vor der Tabellen-DOM-Falle WARNTE. Der Stripper loest das – darf dabei aber unter keinen
   Umstaenden echten Code ausblenden, sonst pruefen die Waechter still gar nichts mehr (genau die
   Falle, die in R2a schon einmal zugeschlagen hat).
   Geprueft wird deshalb ZWEISEITIG: Kommentare MUESSEN verschwinden UND Strings/Regex/Templates
   MUESSEN unangetastet bleiben. Dazu am Schluss der Realbestand: jede app_*.js bleibt nach dem
   Strippen syntaktisch gueltiges JavaScript. */
const { t: check, report } = require("./_harness.js");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

/* Die Suite laeuft im FLACHEN Arbeitsverzeichnis (check.sh kopiert tools/entkommentiere.js
   dorthin); beim Direktaufruf aus tests/ liegt sie unter ../tools/. */
function ladeModul() {
  const kandidaten = ["./entkommentiere.js", "../tools/entkommentiere.js"];
  for (const k of kandidaten) { try { return require(k); } catch (e) { /* naechster */ } }
  throw new Error("entkommentiere.js nicht gefunden (weder flach noch unter ../tools/)");
}
const EK = ladeModul();
const strip = (s, typ) => EK.entkommentiere(s, typ || "js");

/* Hilfen: enthaelt / enthaelt nicht – bewusst auf den STRING geprueft, nicht auf Zeilennummern. */
const drin = (s, teil) => s.indexOf(teil) >= 0;

// ---------------------------------------------------------------- Invariante
{
  const q = 'var a = 1; // weg\n/* auch weg */\nvar b = 2;\n';
  const r = strip(q);
  check("Invariante: Laenge unveraendert", r.length === q.length);
  check("Invariante: Zeilenzahl unveraendert", r.split("\n").length === q.split("\n").length);
  check("Invariante: nur Leerzeichen ersetzt",
    [...q].every((c, i) => r[i] === c || r[i] === " "));
  check("pruefeInvariante meldet gleiche Fassung als sauber", EK.pruefeInvariante(q, q) === null);
  check("pruefeInvariante faengt Laengenaenderung", /Laenge/.test(EK.pruefeInvariante(q, q + "x") || ""));
  check("pruefeInvariante faengt fremdes Zeichen",
    /Offset/.test(EK.pruefeInvariante("abc", "aXc") || ""));
}

// ------------------------------------------------------- Kommentare MUESSEN weg
{
  const r = strip('var a = 1; // GEHEIMWORT\n');
  check("Zeilenkommentar ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("Code vor dem Zeilenkommentar bleibt", drin(r, "var a = 1;"));
}
{
  const r = strip('var a = /* GEHEIMWORT */ 1;\n');
  check("Blockkommentar ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("Code um den Blockkommentar bleibt", drin(r, "var a =") && drin(r, "1;"));
}
{
  const q = '/* Zeile1 GEHEIMWORT\n   Zeile2 GEHEIMWORT\n   Zeile3 */\nvar a = 1;\n';
  const r = strip(q);
  check("mehrzeiliger Blockkommentar ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("mehrzeiliger Blockkommentar: Umbrueche bleiben", r.split("\n").length === q.split("\n").length);
}
{
  const r = strip('var a = 1; // aussen\nvar t = `text ${ 1 /* GEHEIMWORT */ + 2 } ende`;\n');
  check("Kommentar im Template-Ausdruck ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("Template-Text bleibt", drin(r, "text ${") && drin(r, "ende`"));
}

// ------------------------------------- Strings/Regex MUESSEN unangetastet bleiben
{
  const r = strip('var u = "https://beispiel.example/pfad";\n');
  check("URL im String bleibt (Doppel-Slash ist KEIN Kommentar)", drin(r, "https://beispiel.example/pfad"));
}
{
  const r = strip("var s = 'a//b';\n");
  check("Doppel-Slash im einfach-quotierten String bleibt", drin(r, "a//b"));
}
{
  const r = strip('var s = "/* kein Kommentar */";\n');
  check("Kommentar-Zeichen im String bleiben", drin(r, "/* kein Kommentar */"));
}
{
  const r = strip('var s = "a\\"//b";\n');
  check("maskiertes Anfuehrungszeichen bricht den String nicht", drin(r, '//b'));
}
{
  const r = strip('var t = `pfad //x ${ y } /* z */ ende`;\n');
  check("Kommentar-Zeichen im Template-TEXT bleiben", drin(r, "//x") && drin(r, "/* z */"));
}
{
  const r = strip('var re = /a\\/\\/b/g;\n');
  check("Regex mit maskierten Slashes bleibt", drin(r, "a\\/\\/b"));
}
{
  const r = strip('var re = /[abc/]/;\nvar x = 1; // weg\n');
  check("Slash in der Regex-Zeichenklasse beendet das Literal nicht", drin(r, "[abc/]"));
  check("Kommentar nach der Regex trotzdem weg", !drin(r, "weg"));
}
{
  const r = strip('var q = a / b; // GEHEIMWORT\n');
  check("Division wird nicht als Regex gelesen", drin(r, "a / b;") && !drin(r, "GEHEIMWORT"));
}
{
  const r = strip('function f(s){ return /x\\/y/.test(s); } // GEHEIMWORT\n');
  check("Regex nach return erkannt", drin(r, "x\\/y") && !drin(r, "GEHEIMWORT"));
}

// -------------------------------------------- die beiden konkreten Waechter-Fallen
{
  // v1.3.0-Fehlalarm: der WARNENDE Kommentar darf den Anti-Pattern-Guard nicht ausloesen.
  const q = 'function f(){ var d = document.createElement("tr"); return d; }\n'
          + '// NIEMALS el("<tr>") schreiben - der HTML-Parser verwirft das.\n';
  const muster = /el\((["'])<t[rdh]/;
  check("Anti-Pattern-Muster trifft die ROHE Datei (alter Waechter waere rot)", muster.test(q));
  check("Anti-Pattern-Muster trifft die gestrippte Datei NICHT mehr", !muster.test(strip(q)));
}
{
  // ... der ECHTE Verstoss muss weiterhin gefunden werden.
  const q = 'function f(){ return el("<tr>"); }\n';
  check("echter el-Verstoss ueberlebt das Strippen", /el\((["'])<t[rdh]/.test(strip(q)));
}
{
  const q = '// Hintergrund: https://developer.mozilla.org/docs\nvar x = 1;\n';
  check("URL im Kommentar verschwindet (Offline-Audit)", !/https?:\/\//.test(strip(q)));
}
{
  const q = 'var u = fetch("https://cdn.example/font.woff2");\n';
  check("URL im Code bleibt (Offline-Audit bleibt scharf)", /https?:\/\//.test(strip(q)));
}

// ---------------------------------------------------------------------- CSS
{
  const r = strip('.a { color: red; } /* GEHEIMWORT */\n.b { color: blue; }\n', "css");
  check("CSS: Blockkommentar ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("CSS: Regeln bleiben", drin(r, ".a { color: red; }") && drin(r, ".b { color: blue; }"));
}
{
  const r = strip('.a::after { content: "/* kein Kommentar */"; }\n', "css");
  check("CSS: Kommentar-Zeichen im String bleiben", drin(r, "/* kein Kommentar */"));
}

// --------------------------------------------------------------------- HTML
{
  const r = strip('<p>sichtbar</p>\n<!-- GEHEIMWORT -->\n<p>auch sichtbar</p>\n', "html");
  check("HTML: Kommentar ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("HTML: Markup bleibt", drin(r, "<p>sichtbar</p>") && drin(r, "<p>auch sichtbar</p>"));
}
{
  const r = strip('<script>\nvar a = 1; // GEHEIMWORT\nvar u = "https://x.example";\n</script>\n', "html");
  check("HTML: Kommentar im inline-script ausgeblendet", !drin(r, "GEHEIMWORT"));
  check("HTML: String im inline-script bleibt", drin(r, "https://x.example"));
}
{
  const r = strip('<style>\n.a { color: red; } /* GEHEIMWORT */\n</style>\n', "html");
  check("HTML: Kommentar im inline-style ausgeblendet", !drin(r, "GEHEIMWORT"));
}
{
  const r = strip('<script src="app.js"></script>\n<!-- GEHEIMWORT -->\n', "html");
  check("HTML: leeres script-Tag stoert nicht", !drin(r, "GEHEIMWORT") && drin(r, 'src="app.js"'));
}

// ------------------------------------------------------------- Typ-Erkennung
check("typFuer(.css) = css", EK.typFuer("styles.css") === "css");
check("typFuer(.html) = html", EK.typFuer("index.html") === "html");
check("typFuer(.js) = js", EK.typFuer("app_ui.js") === "js");
check("typFuer(unbekannt) = js", EK.typFuer("sw.webmanifest") === "js");

// --------------------------------------------- REALBESTAND: nichts kaputtstrippen
{
  const dateien = fs.readdirSync(".").filter(f => /^(app_.*|logik)\.js$/.test(f)).sort();
  check("Realbestand: app_*.js + logik.js gefunden (>= 12)", dateien.length >= 12);
  let invOk = 0, syntaxOk = 0, hatteKommentare = 0;
  for (const f of dateien) {
    const src = fs.readFileSync(f, "utf8");
    let res = null;
    try { res = strip(src); } catch (e) { continue; }
    if (EK.pruefeInvariante(src, res) === null) invOk++;
    if (res !== src) hatteKommentare++;
    /* Dateiname mit PID – seit die Suiten parallel laufen, duerfen Temp-Namen nicht kollidieren. */
    const tmp = path.join(require("os").tmpdir(), "nc_pruef_" + process.pid + "_" + f);
    fs.writeFileSync(tmp, res, "utf8");
    try { execFileSync(process.execPath, ["--check", tmp], { stdio: "ignore" }); syntaxOk++; } catch (e) { /* faellt unten auf */ }
    try { fs.unlinkSync(tmp); } catch (e) { /* egal */ }
  }
  check("Realbestand: Invariante haelt fuer JEDE Datei", invOk === dateien.length);
  check("Realbestand: gestrippte Fassung bleibt fuer JEDE Datei gueltiges JS", syntaxOk === dateien.length);
  check("Realbestand: es wurde ueberhaupt etwas ausgeblendet", hatteKommentare === dateien.length);
}

process.exit(report());
