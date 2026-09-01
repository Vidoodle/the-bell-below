import type { LocationDefinition, LocationId } from "./locations/model.js";
import type { NpcDefinition, NpcId } from "./npcs/model.js";
import type { SceneDefinition, SceneId } from "./scenes/model.js";

export type AdventureContent = Readonly<{
  initialSceneId: SceneId;
  locations: readonly LocationDefinition[];
  scenes: readonly SceneDefinition[];
  npcs: readonly NpcDefinition[];
}>;

export type Adventure = Readonly<{
  initialSceneId: SceneId;
  locations: ReadonlyMap<LocationId, LocationDefinition>;
  scenes: ReadonlyMap<SceneId, SceneDefinition>;
  npcs: ReadonlyMap<NpcId, NpcDefinition>;
}>;

export class AdventureValidationError extends Error {}

function indexDefinitions<Id extends string, Definition extends { id: Id }>(
  kind: string,
  definitions: readonly Definition[],
): Map<Id, Definition> {
  const indexed = new Map<Id, Definition>();
  for (const definition of definitions) {
    if (indexed.has(definition.id)) {
      throw new AdventureValidationError(`Duplicate ${kind} ID: ${definition.id}.`);
    }
    indexed.set(definition.id, definition);
  }
  return indexed;
}

export function createAdventure(content: AdventureContent): Adventure {
  const locations = indexDefinitions<LocationId, LocationDefinition>(
    "location",
    content.locations,
  );
  const scenes = indexDefinitions<SceneId, SceneDefinition>("scene", content.scenes);
  const npcs = indexDefinitions<NpcId, NpcDefinition>("NPC", content.npcs);

  if (!scenes.has(content.initialSceneId)) {
    throw new AdventureValidationError(`Unknown initial scene: ${content.initialSceneId}.`);
  }
  for (const scene of content.scenes) {
    if (!locations.has(scene.locationId)) {
      throw new AdventureValidationError(
        `Scene ${scene.id} references unknown location ${scene.locationId}.`,
      );
    }
    for (const participation of scene.initialNpcParticipations) {
      if (!npcs.has(participation.npcId)) {
        throw new AdventureValidationError(
          `Scene ${scene.id} references unknown NPC ${participation.npcId}.`,
        );
      }
    }
    const phaseIds = new Set(scene.phaseIds);
    if (phaseIds.size !== scene.phaseIds.length) {
      throw new AdventureValidationError(`Scene ${scene.id} has duplicate phase IDs.`);
    }
    if (!phaseIds.has(scene.initialPhaseId)) {
      throw new AdventureValidationError(
        `Scene ${scene.id} does not include initial phase ${scene.initialPhaseId}.`,
      );
    }
  }

  return {
    initialSceneId: content.initialSceneId,
    locations,
    scenes,
    npcs,
  };
}
