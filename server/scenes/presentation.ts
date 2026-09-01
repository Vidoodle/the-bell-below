import type { CurrentScenePresentation } from "../../shared/current-scene.js";
import type { ProtagonistId } from "../../shared/protagonist.js";
import type { Adventure } from "../adventure/model.js";
import type { SceneId, ScenePhaseId } from "../adventure/scenes/model.js";

export function createScenePresentation(
  adventure: Adventure,
  sceneId: SceneId,
  phaseId: ScenePhaseId,
  protagonistId: ProtagonistId,
): CurrentScenePresentation {
  const scene = adventure.scenes.get(sceneId);
  if (!scene) throw new Error(`Unknown scene ${sceneId}.`);

  const location = adventure.locations.get(scene.locationId);
  if (!location) throw new Error(`Unknown location ${scene.locationId}.`);

  const people = scene.initialNpcParticipations.map((participation) => {
    const npc = adventure.npcs.get(participation.npcId);
    if (!npc) throw new Error(`Unknown NPC ${participation.npcId}.`);
    return {
      name: npc.name,
      description: participation.observableDescription,
      reputation: npc.initialReputationByProtagonist[protagonistId],
    };
  });

  return {
    location: { name: location.name, description: location.description },
    scene: { title: scene.title, description: scene.description, phase: phaseId },
    people,
  };
}
