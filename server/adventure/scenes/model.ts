import type { LocationId } from "../locations/model.js";
import type { NpcId } from "../npcs/model.js";

declare const sceneIdBrand: unique symbol;
declare const scenePhaseIdBrand: unique symbol;

export type SceneId = string & { readonly [sceneIdBrand]: "scene" };
export type ScenePhaseId = string & { readonly [scenePhaseIdBrand]: "scene-phase" };

export const sceneId = <Value extends string>(value: Value) => value as Value & SceneId;
export const scenePhaseId = <Value extends string>(value: Value) => (
  value as Value & ScenePhaseId
);

export type SceneNpcParticipation = Readonly<{
  npcId: NpcId;
  observableDescription: string;
  initialDisposition: string;
}>;

export type SceneDefinition = Readonly<{
  id: SceneId;
  locationId: LocationId;
  title: string;
  description: string;
  initialNpcParticipations: readonly SceneNpcParticipation[];
  initialPhaseId: ScenePhaseId;
  phaseIds: readonly ScenePhaseId[];
}>;
