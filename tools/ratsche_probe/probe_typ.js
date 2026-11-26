"use strict";
// Probe fuer tools/qualitaet_ratsche.py --selbsttest (tsc): genau zwei bekannte Typfehler.
const fs = require("fs");
const n = 1;
n.toUpperCase(); // TS2339: Methode gibt es auf einer Zahl nicht
fs.readFileSync("x", "utf8", 3); // TS2554: ein Argument zu viel
