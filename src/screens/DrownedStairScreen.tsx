import type { CharacterSnapshot } from "../../shared/character";
import { statNames } from "../../shared/stats";

type DrownedStairScreenProps = {
  character: CharacterSnapshot;
  onStartNewCharacter: () => void;
};

export function DrownedStairScreen({
  character,
  onStartNewCharacter,
}: DrownedStairScreenProps) {
  return <main className="game"><section className="scene">
    <p className="eyebrow">The Drowned Stair</p>
    <h1>{character.protagonist.name} reaches the cordon.</h1>
    <p>The city watch holds the reopened gate while a restless crowd gathers at the upper landing. Beyond them, the old stair descends into black water.</p>
    <dl className="final-stats">{statNames.map((stat) => <div key={stat}>
      <dt>{stat}</dt><dd>{character.effectiveStats[stat]}</dd>
    </div>)}</dl>
    <button className="back" onClick={onStartNewCharacter}>← Start a new character</button>
  </section></main>;
}
