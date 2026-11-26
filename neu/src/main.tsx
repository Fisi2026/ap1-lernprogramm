import { createRoot } from "react-dom/client";
import "./index.css";
import { starte } from "./huelle/start.tsx";
import { aktualisierung } from "./huelle/aktualisierung";

/* N32/E31: erst die Hülle, dann der Pool (eigener Chunk), dann die App – `huelle/start.tsx`. */
void starte(createRoot(document.getElementById("root")!));

/* N33 (E33): Offline ueber den eigenen Service Worker – nur im Bau (der Dev-Server hat keinen). ⛔ `app-sw.js`, NICHT `sw.js` –
   dort liegt seit N29 der Abschalt-SW fuer die alte App (`neu/sw/abschalten.js`). */
if (import.meta.env.PROD) void aktualisierung.registriere(`${import.meta.env.BASE_URL}app-sw.js`, import.meta.env.BASE_URL).catch(() => undefined);
