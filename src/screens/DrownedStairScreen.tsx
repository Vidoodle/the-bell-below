import type { CharacterSnapshot } from "../../shared/character";

type DrownedStairScreenProps = {
  character: CharacterSnapshot;
  onStartNewCharacter: () => void;
};

export function DrownedStairScreen({
  character,
  onStartNewCharacter,
}: DrownedStairScreenProps) {
  return <main className="game with-character-hud"><section className="scene">
    <p className="eyebrow">The Drowned Stair</p>
    <h1>{character.protagonist.name} reaches the cordon.</h1>
    <p>The city watch holds the reopened gate while a restless crowd gathers at the upper landing. Beyond them, the old stair descends into black water.</p>
    <button className="back" onClick={onStartNewCharacter}>← Start a new character</button>
  </section></main>;
}
