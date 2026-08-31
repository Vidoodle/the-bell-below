import type { GroupId } from "../groups/model.js";
import type { LocationId } from "../locations/model.js";
import type { NpcId } from "../npcs/model.js";

declare const sceneIdBrand: unique symbol;

export type SceneId = string & { readonly [sceneIdBrand]: "scene" };

export const sceneId = <Value extends string>(value: Value) => value as Value & SceneId;

export type SceneGroupParticipation = Readonly<{
  groupId: GroupId;
  observableDescription: string;
  initialDisposition: string;
}>;

export type SceneDefinition = Readonly<{
  id: SceneId;
  locationId: LocationId;
  title: string;
  description: string;
  initialNpcIds: readonly NpcId[];
  groupParticipations: readonly SceneGroupParticipation[];
}>;
