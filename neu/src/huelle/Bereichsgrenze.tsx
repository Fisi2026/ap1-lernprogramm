/* ============================================================================
   ERROR BOUNDARY JE BEREICH (N32 Schritt 2, Entscheide E29/E30)

   Wirft ein Schirm beim Zeichnen, fällt NUR dieser Bereich: Schiene, Kopf und
   Lernstand bleiben, der Kasten bietet „Neu laden" und den Weg zur Startseite.
   Der Bericht geht automatisch hinaus (E29), und der Kasten sagt, was damit
   geschah – „wird gesendet", „gesendet" oder „konnte nicht gesendet werden".
   ⛔ App.tsx setzt `key={bereich}`: ein Bereichswechsel beginnt mit einer
      frischen Grenze, ein abgestürzter Bereich bleibt nicht kleben.
   ⚠️ Ohne Wurf zeichnet die Grenze NUR ihre Kinder – der Schnappschuss (N25)
      bleibt deshalb unverändert.
   ⚠️ Eine Klasse, weil React Fehlergrenzen nur als Klasse kennt.
   ============================================================================ */
import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Bereich } from "@/kern/route";
import { sendeFehlerbericht, type Berichtstand } from "@/kern/fehlerbericht";

interface Props {
  bereich: Bereich;
  zurStart: () => void;
  children: ReactNode;
}
interface Zustand { abgestuerzt: boolean; bericht: Berichtstand }

const TEXT: Record<Berichtstand, string> = {
  sendet: "Ein Fehlerbericht wird gesendet – ohne Lernstand, ohne Person …",
  gesendet: "Ein Fehlerbericht wurde gesendet – ohne Lernstand, ohne Person.",
  "nicht gesendet": "Der Fehlerbericht konnte nicht gesendet werden (kein Netz?). Dein Lernstand ist davon nicht berührt.",
};

export class Bereichsgrenze extends Component<Props, Zustand> {
  override state: Zustand = { abgestuerzt: false, bericht: "sendet" };
  private gemeldet = false;

  static getDerivedStateFromError(): Partial<Zustand> {
    return { abgestuerzt: true };
  }

  override componentDidCatch(wurf: unknown): void {
    /* ⛔ Einmal je Grenze – auch wenn React den Wurf im Entwicklungsmodus doppelt meldet. */
    if (this.gemeldet) return;
    this.gemeldet = true;
    void sendeFehlerbericht(this.props.bereich, wurf, localStorage, (u, i) => fetch(u, i), __APP_VERSION__)
      .then((bericht) => this.setState({ bericht }));
  }

  override render(): ReactNode {
    if (!this.state.abgestuerzt) return this.props.children;
    return (
      <div role="alert" className="grid place-items-center p-10">
        <div className="max-w-md space-y-3 rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm">
          <h2 className="text-base font-semibold">Dieser Bereich ist abgestürzt</h2>
          <p className="text-muted-foreground">
            Die anderen Bereiche und dein Lernstand sind davon nicht betroffen.
          </p>
          <p className="text-muted-foreground" aria-live="polite">{TEXT[this.state.bericht]}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={() => window.location.reload()}>Neu laden</Button>
            <Button variant="outline" onClick={this.props.zurStart}>Zur Startseite</Button>
          </div>
        </div>
      </div>
    );
  }
}
