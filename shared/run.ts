export const statNames = ["Might", "Grace", "Wits", "Presence"] as const;
export type Stat = typeof statNames[number];
export type BaseStats = Record<Stat, number>;
export type ProtagonistId = "seren" | "veyra" | "cael" | "riona";

export type ProtagonistSnapshot = {
  id: ProtagonistId;
  name: string;
  benefit: Stat;
};

export type RunSnapshot = {
  id: string;
  protagonist: ProtagonistSnapshot;
  baseStats: BaseStats;
  effectiveStats: BaseStats;
};
