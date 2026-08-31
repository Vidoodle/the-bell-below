import type { Reputation } from "./reputation.js";

export type CurrentScenePresentation = Readonly<{
  location: Readonly<{
    name: string;
    description: string;
  }>;
  scene: Readonly<{
    title: string;
    description: string;
    phase: string;
  }>;
  npcs: readonly Readonly<{
    name: string;
    description: string;
    reputation: Reputation;
  }>[];
  groups: readonly Readonly<{
    name: string;
    description: string;
  }>[];
}>;
