import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Stat = "Might" | "Grace" | "Wits" | "Presence";
type Character = {
  name: string; shortName: string; title: string; background: string;
  motivation: string; benefit: Stat;
};

const statNames: Stat[] = ["Might", "Grace", "Wits", "Presence"];
const statDescriptions: Record<Stat, string> = {
  Might: "Force, endurance, and close combat.",
  Grace: "Speed, precision, and stealth.",
  Wits: "Perception, deduction, and occult or technical knowledge.",
  Presence: "Persuasion, deception, intimidation, and composure.",
};
const freshStats = (): Record<Stat, number> => ({ Might: 1, Grace: 1, Wits: 1, Presence: 1 });
const characters: Character[] = [
  {
    name: "Seren Holt", shortName: "Seren", title: "The Oathbreaker",
    background: "A former siege captain who helped seal the abbey and left refugees below. He still knows the old soldiers and the lie they agreed to preserve.",
    motivation: "Confront the choice that saved Grayhaven before the bell exposes it.",
    benefit: "Might",
  },
  {
    name: "Veyra Sable", shortName: "Veyra", title: "The Relic Thief",
    background: "A relic thief hired to recover the clapper before a city captain can turn the bell into a weapon. Her client expects delivery, and Veyra's contacts have already shown her routes the city insists do not exist.",
    motivation: "Finish the job, survive the abbey, and decide who deserves the weapon.",
    benefit: "Grace",
  },
  {
    name: "Brother Cael", shortName: "Cael", title: "The Heretic",
    background: "A priest and scholar censured for claiming Saint Orra's miracle was manufactured. His research taught him to recognize rituals the priesthood denies ever practicing.",
    motivation: "Find proof beneath the abbey and force Grayhaven to face its history.",
    benefit: "Wits",
  },
  {
    name: "Dame Riona Voss", shortName: "Riona", title: "The Bell-Warden",
    background: "A paladin of Grayhaven's civic order, formally commissioned by the council to stop the bell before midnight. She carries the city's authority and complete faith in her duty.",
    motivation: "Fulfill her oath and protect Grayhaven from the final toll.",
    benefit: "Presence",
  },
];

function App() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Character>();
  const [assigned, setAssigned] = useState(freshStats);
  const [started, setStarted] = useState(false);
  const character = characters[index];
  const remaining = 12 - Object.values(assigned).reduce((total, value) => total + value, 0);
  const score = (stat: Stat) => assigned[stat] + (chosen?.benefit === stat ? 1 : 0);
  const adjust = (stat: Stat, change: number) => setAssigned((current) => ({
    ...current, [stat]: current[stat] + change,
  }));

  if (started && chosen) return (
    <main className="game"><section className="scene">
      <p className="eyebrow">The Breach Stair</p><h1>{chosen.name} descends.</h1>
      <p>Beneath Grayhaven, black water laps against the abbey steps. Far below, the Bell of Mercy waits for midnight.</p>
      <dl className="final-stats">{statNames.map((stat) => <div key={stat}><dt>{stat}</dt><dd>{score(stat)}</dd></div>)}</dl>
      <button className="back" onClick={() => setStarted(false)}>← Rebuild character</button>
    </section></main>
  );

  if (chosen) return (
    <main className="builder"><section className="sheet">
      <button className="back" onClick={() => setChosen(undefined)}>← Characters</button>
      <p className="eyebrow">{chosen.title}</p><h1>Build {chosen.shortName}</h1>
      <p className="intro">Spend 8 points across your stats. Raise each from 1 to 5; your character's bonus is added on top. Higher stats improve your chances on related checks.</p>
      <p className="benefit"><strong>{chosen.shortName}'s benefit:</strong> +1 {chosen.benefit}. {chosen.benefit} can reach 6.</p>
      <div className="allocation">{statNames.map((stat) => <article key={stat} className={chosen.benefit === stat ? "favored" : undefined}>
        <span>{stat}</span><small>{statDescriptions[stat]}</small><strong>{score(stat)}</strong><div className="stepper">
          <button aria-label={`Lower ${stat}`} disabled={assigned[stat] === 1} onClick={() => adjust(stat, -1)}>−</button>
          <button aria-label={`Raise ${stat}`} disabled={remaining === 0 || assigned[stat] === 5} onClick={() => adjust(stat, 1)}>+</button>
        </div>
      </article>)}</div>
      <p className="remaining">{remaining} points remaining</p>
      <button className="choose" disabled={remaining !== 0} onClick={() => setStarted(true)}>Enter the abbey</button>
    </section></main>
  );

  return (
    <main className="select"><header><p className="eyebrow">The Bell Below</p><h1>Who answers the final toll?</h1></header>
      <section className="carousel" aria-label="Choose a protagonist">
        <div className="portrait" role="img" aria-label={`${character.name} portrait placeholder`}>Portrait forthcoming</div>
        <article className="profile"><p className="eyebrow">{character.title}</p><h2>{character.name}</h2>
          <h3>Background</h3><p>{character.background}</p><h3>Motivation</h3><p>{character.motivation}</p>
          <nav className="controls" aria-label="Browse protagonists">
            <button onClick={() => setIndex((index + characters.length - 1) % characters.length)} aria-label="Previous protagonist">←</button>
            <span>{index + 1} / {characters.length}</span><button onClick={() => setIndex((index + 1) % characters.length)} aria-label="Next protagonist">→</button>
          </nav>
          <button className="choose" onClick={() => { setChosen(character); setAssigned(freshStats()); }}>Choose {character.shortName}</button>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
