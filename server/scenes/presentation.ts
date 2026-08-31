import type { CurrentScenePresentation } from "../../shared/current-scene.js";
import type { ProtagonistId } from "../../shared/protagonist.js";
import type { Adventure } from "../adventure/model.js";
import type { SceneId } from "../adventure/scenes/model.js";

export function createScenePresentation(
  adventure: Adventure,
  sceneId: SceneId,
  protagonistId: ProtagonistId,
): CurrentScenePresentation {
  const scene = adventure.scenes.get(sceneId);
  if (!scene) throw new Error(`Unknown scene ${sceneId}.`);

  const location = adventure.locations.get(scene.locationId);
  if (!location) throw new Error(`Unknown location ${scene.locationId}.`);

  const npcs = scene.initialNpcIds.map((npcId) => {
    const npc = adventure.npcs.get(npcId);
    if (!npc) throw new Error(`Unknown NPC ${npcId}.`);
    return {
      name: npc.name,
      description: npc.description,
      reputation: npc.initialReputationByProtagonist[protagonistId],
    };
  });

  const groups = scene.groupParticipations.map((participation) => {
    const group = adventure.groups.get(participation.groupId);
    if (!group) throw new Error(`Unknown group ${participation.groupId}.`);
    return {
      name: group.name,
      description: participation.observableDescription,
    };
  });

  return {
    location: { name: location.name, description: location.description },
    scene: { title: scene.title, description: scene.description },
    npcs,
    groups,
  };
}
