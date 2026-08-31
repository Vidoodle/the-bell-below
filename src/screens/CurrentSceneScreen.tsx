import type { CurrentScenePresentation } from "../../shared/current-scene";

const reputationLabels = {
  hostile: "Hostile",
  unfriendly: "Unfriendly",
  neutral: "Neutral",
  friendly: "Friendly",
  trusted: "Trusted",
} as const;

type CurrentSceneScreenProps = {
  currentScene: CurrentScenePresentation;
  onStartNewCharacter: () => void;
};

export function CurrentSceneScreen({
  currentScene,
  onStartNewCharacter,
}: CurrentSceneScreenProps) {
  return <main className="game with-character-hud"><section className="scene current-scene">
    <p className="eyebrow">{currentScene.location.name}</p>
    <h1>{currentScene.scene.title}</h1>
    <p>{currentScene.location.description}</p>
    <p>{currentScene.scene.description}</p>

    <div className="scene-participants">
      <section>
        <h2>People present</h2>
        {currentScene.npcs.map((npc) => <article key={npc.name}>
          <h3>{npc.name}</h3>
          <p className="participant-reputation">
            Reputation: {reputationLabels[npc.reputation]}
          </p>
          <p>{npc.description}</p>
        </article>)}
      </section>
      <section>
        <h2>Groups present</h2>
        {currentScene.groups.map((group) => <article key={group.name}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
        </article>)}
      </section>
    </div>

    <button className="back" onClick={onStartNewCharacter}>← Start a new character</button>
  </section></main>;
}
