export const statNames = ["Might", "Grace", "Wits", "Presence"] as const;

export type Stat = typeof statNames[number];
export type BaseStats = Record<Stat, number>;
