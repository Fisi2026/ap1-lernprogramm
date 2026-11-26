/* Eine Textdatei zum Speichern anbieten — wie `downloadDatei` in app_frage.js.
   ⚠️ Ein Fehler wird zurueckgegeben, nicht per alert() gemeldet: der Aufrufer
      zeigt ihn dort an, wo geklickt wurde. */
export function bieteDateiAn(name: string, text: string, mime = "text/plain;charset=utf-8"): string | null {
  try {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}
