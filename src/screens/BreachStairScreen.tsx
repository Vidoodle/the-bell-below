import type { CharacterSnapshot } from "../../shared/character";
import { statNames } from "../../shared/stats";

type BreachStairScreenProps = {
  character: CharacterSnapshot;
  onStartNewCharacter: () => void;
};

export function BreachStairScreen({
  character,
  onStartNewCharacter,
}: BreachStairScreenProps) {
  return <main className="game"><section className="scene">
    <p className="eyebrow">The Breach Stair</p>
    <h1>{character.protagonist.name} descends.</h1>
    <p>Beneath Grayhaven, black water laps against the abbey steps. Far below, the Bell of Mercy waits for midnight.</p>
    <dl className="final-stats">{statNames.map((stat) => <div key={stat}>
      <dt>{stat}</dt><dd>{character.effectiveStats[stat]}</dd>
    </div>)}</dl>
    <button className="back" onClick={onStartNewCharacter}>← Start a new character</button>
  </section></main>;
}
