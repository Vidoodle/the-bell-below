import type { CharacterProfile } from "../content/characters";
import { publicLore } from "../content/prologue";

type PrologueScreenProps = {
  character: CharacterProfile;
  continuing: boolean;
  error?: string;
  onBack: () => void;
  onContinue: () => void;
};

export function PrologueScreen({
  character,
  continuing,
  error,
  onBack,
  onContinue,
}: PrologueScreenProps) {
  return <main className="game prologue">
    <section className="scene prologue-sheet">
      <button className="back" onClick={onBack}>← Title</button>
      <p className="eyebrow">Before the final toll</p>
      <h1>The Bell Below</h1>
      <div className="lore-copy">
        {publicLore.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="character-prologue">
        <p className="eyebrow">{character.title}</p>
        <h2>{character.name}</h2>
        <p>{character.background}</p>
        {character.prologue.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h3>What draws {character.shortName} below</h3>
        <p>{character.motivation}</p>
      </div>
      {error && <p className="run-error" role="alert">{error}</p>}
      <button className="choose" disabled={continuing} onClick={onContinue}>
        {continuing ? "Approaching the stair…" : "Approach the Drowned Stair"}
      </button>
    </section>
  </main>;
}
