import type { ProtagonistId } from "../../shared/protagonist";
import type { BaseStats, Stat } from "../../shared/stats";

export type CharacterProfile = {
  id: ProtagonistId;
  name: string;
  shortName: string;
  title: string;
  background: string;
  motivation: string;
  prologue: string[];
  benefit: Stat;
  recommendedStats: BaseStats;
};

export const characters: CharacterProfile[] = [
  {
    id: "seren", name: "Seren Holt", shortName: "Seren", title: "The Oathbreaker",
    background: "A former siege captain remembered as one of the heroes who saved Grayhaven. He helped seal the cathedral with refugees inside and has spent forty years living with what the city chose to forget.",
    motivation: "Confront the choice that saved Grayhaven before the bell exposes it.",
    prologue: [
      "Forty years ago, Seren Holt commanded the city guard in Grayhaven's Lower Ward. While Orra's priests laid the ward, his soldiers kept the cathedral shut with refugees inside. Seren knew their confinement was part of the ritual. He obeyed.",
      "When the Bell rang, dying soldiers rose and returned to the fighting. By morning, the raiders were retreating and the Lower Ward was underwater. Seren signed the report declaring the refugees lost in the flood and helped seal the remaining entrances. Grayhaven called him a hero. He began drinking to sleep.",
      "At the first toll tonight, pain returns to the place where Seren was wounded during the siege. No scar remains. He cannot tell whether the Bell is calling him or guilt is drawing him back. Before the next toll, he is on his way to the Drowned Stair.",
    ],
    benefit: "Might",
    recommendedStats: { Might: 5, Grace: 2, Wits: 2, Presence: 3 },
  },
  {
    id: "veyra", name: "Veyra Sable", shortName: "Veyra", title: "The Relic Thief",
    background: "A relic thief hired to recover a jeweled reliquary from the drowned cathedral. The council has opened the Drowned Stair for the first time since the siege, giving Veyra one chance to reach what Grayhaven buried forty years ago.",
    motivation: "Steal the reliquary, deliver it to her client, and collect the rest of her fee.",
    prologue: [
      "After the first toll, the council announced that the Drowned Stair would be opened. Within the hour, a collector sent Veyra an offer: recover a jeweled reliquary from the old cathedral treasury. Half the fee came with the message. The rest would be paid on delivery.",
      "Veyra has stolen from chapels, tombs, and private collections. Her clients pay for objects, not opinions, and she delivers what the contract names. A drowned cathedral should be no different from any other locked room.",
      "The city watch controls the newly opened stair and admits only those carrying council orders. Veyra has none. She joins the crowd outside the barricade and studies the guards. Somewhere below them, the reliquary is waiting.",
    ],
    benefit: "Grace",
    recommendedStats: { Might: 2, Grace: 5, Wits: 3, Presence: 2 },
  },
  {
    id: "cael", name: "Brother Cael", shortName: "Cael", title: "The Heretic",
    background: "An excommunicated priest and former church archivist who found evidence that Grayhaven falsified the history of Saint Orra's miracle. Cael believes the missing truth remains inside the drowned cathedral.",
    motivation: "Find the records that prove the church altered the history of Saint Orra's miracle.",
    prologue: [
      "Cael found the first discrepancy in burial rolls he had been assigned to catalogue. Refugees recorded entering the cathedral during the siege appeared nowhere on Grayhaven's memorials. He later found an older copy of the Bell's funerary rite with passages missing from every subsequent edition.",
      "The church ordered him to end the investigation. Cael instead accused it publicly and was excommunicated. It took his position and his title, but not the copies he had made. Cael wants the missing people restored to Grayhaven's history. He also wants the church to admit what it did to him.",
      "Opening the Drowned Stair gives Cael his first chance to search the cathedral itself. The church has already sent his name to the city watch with orders to turn him away. Cael arrives carrying his copied records and nothing that grants him passage.",
    ],
    benefit: "Wits",
    recommendedStats: { Might: 2, Grace: 2, Wits: 5, Presence: 3 },
  },
  {
    id: "riona", name: "Dame Riona Voss", shortName: "Riona", title: "The Bell-Warden",
    background: "A paladin of Grayhaven's civic order, formally commissioned by the council to stop the bell before midnight. She carries the city's authority and complete faith in her duty.",
    motivation: "Fulfill her oath and protect Grayhaven from the final toll.",
    prologue: [
      "Riona Voss grew up hearing that Saint Orra gave her life to save Grayhaven. She believed every word of it. When she came of age, she joined the civic order.",
      "She swore to protect Grayhaven's people and has spent her adult life keeping that oath. The council makes the city's laws, the church tends its dead, and the watch guards its streets. Riona has served beside all three and trusts them because she has seen their duties carried out.",
      "After the first toll, the council summons her. They name her Bell-Warden and give her a sealed commission ordering her to enter the cathedral and stop the Bell before midnight. The guards at the Drowned Stair are waiting for her. Their captain has orders to admit the Bell-Warden and assist her if asked. The entrance stands open behind them.",
    ],
    benefit: "Presence",
    recommendedStats: { Might: 3, Grace: 2, Wits: 2, Presence: 5 },
  },
];

export function findCharacter(id: ProtagonistId): CharacterProfile {
  const character = characters.find((candidate) => candidate.id === id);
  if (!character) throw new Error(`Missing character content for ${id}.`);
  return character;
}
