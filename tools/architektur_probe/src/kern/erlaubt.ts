// erlaubt: nur Typ aus der Oberflaeche, Kern untereinander
import type { S } from "@/schirme/seite";
import { P } from "./pruefe";
export type K = typeof S;
export const OK = P;
