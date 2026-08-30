import type { ProtagonistId } from "../../shared/protagonist";
import type { Stat } from "../../shared/stats";

export type CharacterProfile = {
  id: ProtagonistId;
  name: string;
  shortName: string;
  title: string;
  background: string;
  motivation: string;
  prologue: string;
  benefit: Stat;
};

export const characters: CharacterProfile[] = [
  {
    id: "seren", name: "Seren Holt", shortName: "Seren", title: "The Oathbreaker",
    background: "A former siege captain who helped seal the cathedral and left refugees below. He still knows the old soldiers and the lie they agreed to preserve.",
    motivation: "Confront the choice that saved Grayhaven before the bell exposes it.",
    prologue: "Seren remembers the order that closed the cathedral and the voices on its other side. Some of the soldiers now guarding the Breach Stair once served beneath him; others know only the honored version of his name.",
    benefit: "Might",
  },
  {
    id: "veyra", name: "Veyra Sable", shortName: "Veyra", title: "The Relic Thief",
    background: "A relic thief hired to recover the clapper before a city captain can turn the bell into a weapon. Her client expects delivery, and Veyra's contacts have already shown her routes the city insists do not exist.",
    motivation: "Finish the job, survive the cathedral, and decide who deserves the weapon.",
    prologue: "Veyra's patron paid half in advance and supplied a rubbing of the clapper's seal. The official entrance is watched, but smugglers once used the cellars along the buried cathedral wall—and Veyra knows where to look for their marks.",
    benefit: "Grace",
  },
  {
    id: "cael", name: "Brother Cael", shortName: "Cael", title: "The Heretic",
    background: "A priest and scholar censured for claiming Saint Orra's miracle was manufactured. His research taught him to recognize rituals the priesthood denies ever practicing.",
    motivation: "Find proof beneath the cathedral and force Grayhaven to face its history.",
    prologue: "Cael carries copied fragments the church ordered destroyed: burial tallies that do not match the city's memorials and ritual diagrams scratched out of later editions. His censure is public, and the watch has been warned about his interest in the cathedral.",
    benefit: "Wits",
  },
  {
    id: "riona", name: "Dame Riona Voss", shortName: "Riona", title: "The Bell-Warden",
    background: "A paladin of Grayhaven's civic order, formally commissioned by the council to stop the bell before midnight. She carries the city's authority and complete faith in her duty.",
    motivation: "Fulfill her oath and protect Grayhaven from the final toll.",
    prologue: "Riona bears the council's sealed commission and the watch has orders to admit her. Grayhaven expects its Bell-Warden to descend where others cannot and return before the final toll.",
    benefit: "Presence",
  },
];

export function findCharacter(id: ProtagonistId): CharacterProfile {
  const character = characters.find((candidate) => candidate.id === id);
  if (!character) throw new Error(`Missing character content for ${id}.`);
  return character;
}
