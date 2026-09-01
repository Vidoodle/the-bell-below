import { statNames, type BaseStats, type Stat } from "../../shared/stats";
import type { CharacterProfile } from "../content/characters";

const statDescriptions: Record<Stat, string> = {
  Might: "Force, endurance, and close combat.",
  Grace: "Speed, precision, and stealth.",
  Wits: "Perception, deduction, and occult or technical knowledge.",
  Presence: "Persuasion, deception, intimidation, and composure.",
};

type StatAllocationScreenProps = {
  assigned: BaseStats;
  character: CharacterProfile;
  creating: boolean;
  error?: string;
  onAdjust: (stat: Stat, change: number) => void;
  onBack: () => void;
  onStart: () => void;
};

export function StatAllocationScreen({
  assigned,
  character,
  creating,
  error,
  onAdjust,
  onBack,
  onStart,
}: StatAllocationScreenProps) {
  const remaining = 12 - Object.values(assigned).reduce((total, value) => total + value, 0);
  const score = (stat: Stat) => assigned[stat] + (character.benefit === stat ? 1 : 0);

  return <main className="builder"><section className="sheet">
    <button className="back" onClick={onBack}>← Characters</button>
    <p className="eyebrow">{character.title}</p><h1>Build {character.shortName}</h1>
    <p className="intro">A recommended build based on this character's background is ready. Adjust it freely; each base stat can range from 1 to 5, and the character's bonus is added on top.</p>
    <p className="benefit"><strong>{character.shortName}'s benefit:</strong> +1 {character.benefit}. {character.benefit} can reach 6.</p>
    <div className="allocation">{statNames.map((stat) => <article
      key={stat}
      className={character.benefit === stat ? "favored" : undefined}
    >
      <span>{stat}</span><small>{statDescriptions[stat]}</small><strong>{score(stat)}</strong>
      <div className="stepper">
        <button aria-label={`Lower ${stat}`} disabled={assigned[stat] === 1} onClick={() => onAdjust(stat, -1)}>−</button>
        <button aria-label={`Raise ${stat}`} disabled={remaining === 0 || assigned[stat] === 5} onClick={() => onAdjust(stat, 1)}>+</button>
      </div>
    </article>)}</div>
    <p className="remaining">{remaining} points remaining</p>
    {error && <p className="run-error" role="alert">{error}</p>}
    <button className="choose" disabled={remaining !== 0 || creating} onClick={onStart}>
      {creating ? "Preparing…" : "Begin the adventure"}
    </button>
  </section></main>;
}
