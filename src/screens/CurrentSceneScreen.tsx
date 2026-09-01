import type { CurrentScenePresentation } from "../../shared/current-scene";
import { RoleplayComposer, type RoleplayComposerProps } from "../components/RoleplayComposer";
import { SceneTranscript, type TranscriptEntry } from "../components/SceneTranscript";
import { roleplayCopy } from "../content/roleplay";

const reputationLabels = {
  hostile: "Hostile",
  unfriendly: "Unfriendly",
  neutral: "Neutral",
  friendly: "Friendly",
  trusted: "Trusted",
} as const;

type CurrentSceneScreenProps = {
  currentScene: CurrentScenePresentation;
  interaction?: Readonly<{
    entries: readonly TranscriptEntry[];
    pending: boolean;
    error?: string;
    onSubmit: RoleplayComposerProps["onSubmit"];
  }>;
  onStartNewCharacter: () => void;
};

const inactiveInteraction = {
  entries: [],
  pending: false,
  onSubmit: () => false,
} as const;

export function CurrentSceneScreen({
  currentScene,
  interaction = inactiveInteraction,
  onStartNewCharacter,
}: CurrentSceneScreenProps) {
  return <main className="game with-character-hud"><section className="scene current-scene">
    <p className="eyebrow">{currentScene.location.name}</p>
    <h1>{currentScene.scene.title}</h1>
    <p>{currentScene.location.description}</p>
    <p>{currentScene.scene.description}</p>

    <section className="scene-people">
      <h2>People present</h2>
      {currentScene.people.map((person) => <article key={person.name}>
          <h3>{person.name}</h3>
          <p className="participant-reputation">
            Reputation: {reputationLabels[person.reputation]}
          </p>
          <p>{person.description}</p>
        </article>)}
    </section>

    <div className="roleplay-surface">
      <SceneTranscript
        entries={interaction.entries}
        pending={interaction.pending}
        heading={roleplayCopy.historyHeading}
        emptyMessage={roleplayCopy.emptyHistory}
        pendingMessage={roleplayCopy.pendingResponse}
      />
      <RoleplayComposer
        pending={interaction.pending}
        error={interaction.error}
        label={roleplayCopy.composerLabel}
        placeholder={roleplayCopy.placeholder}
        submitLabel={roleplayCopy.submit}
        keyboardHint={roleplayCopy.keyboardHint}
        onSubmit={interaction.onSubmit}
      />
    </div>

    <button className="back" onClick={onStartNewCharacter}>← Start a new character</button>
  </section></main>;
}
