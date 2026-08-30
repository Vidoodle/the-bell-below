import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { CharacterSnapshot } from "../shared/character";
import type { CreateRunRequest, RunSnapshot } from "../shared/run";
import { statNames, type BaseStats, type Stat } from "../shared/stats";
import { getRunCharacter } from "./api/characters";
import { completePrologue, createRun, getRun } from "./api/runs";
import { characters, findCharacter, type CharacterProfile } from "./content/characters";
import { PrologueScreen } from "./screens/PrologueScreen";
import { TitleScreen } from "./screens/TitleScreen";
import "./styles.css";

const runStorageKey = "the-bell-below.run";
type View = "title" | "characters" | "stats" | "prologue" | "breach-stair";
const statDescriptions: Record<Stat, string> = {
  Might: "Force, endurance, and close combat.",
  Grace: "Speed, precision, and stealth.",
  Wits: "Perception, deduction, and occult or technical knowledge.",
  Presence: "Persuasion, deception, intimidation, and composure.",
};
const freshStats = (): BaseStats => ({ Might: 1, Grace: 1, Wits: 1, Presence: 1 });

function App() {
  const [view, setView] = useState<View>("title");
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<CharacterProfile>();
  const [assigned, setAssigned] = useState(freshStats);
  const [run, setRun] = useState<RunSnapshot>();
  const [activeCharacter, setActiveCharacter] = useState<CharacterSnapshot>();
  const [creating, setCreating] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [runError, setRunError] = useState<string>();
  const [recoveryError, setRecoveryError] = useState<string>();
  const [resuming, setResuming] = useState(() => Boolean(sessionStorage.getItem(runStorageKey)));
  const character = characters[index];
  const remaining = 12 - Object.values(assigned).reduce((total, value) => total + value, 0);
  const score = (stat: Stat) => assigned[stat] + (chosen?.benefit === stat ? 1 : 0);
  const adjust = (stat: Stat, change: number) => setAssigned((current) => ({
    ...current, [stat]: current[stat] + change,
  }));

  useEffect(() => {
    const storedRun = sessionStorage.getItem(runStorageKey);
    if (!storedRun) return;
    Promise.all([getRun(storedRun), getRunCharacter(storedRun)])
      .then(([recoveredRun, recoveredCharacter]) => {
        setRun(recoveredRun);
        setActiveCharacter(recoveredCharacter);
      })
      .catch((error: unknown) => setRecoveryError(
        error instanceof Error ? error.message : "The run could not be recovered.",
      ))
      .finally(() => setResuming(false));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const startRun = async () => {
    if (!chosen) return;
    let createdRun: RunSnapshot | undefined;
    setCreating(true);
    setRunError(undefined);
    try {
      const request: CreateRunRequest = { protagonistId: chosen.id, baseStats: assigned };
      createdRun = await createRun(request);
      sessionStorage.setItem(runStorageKey, createdRun.id);
      const createdCharacter = await getRunCharacter(createdRun.id);
      setRun(createdRun);
      setActiveCharacter(createdCharacter);
      setView("prologue");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The run could not be created.";
      if (createdRun) {
        setRun(undefined);
        setActiveCharacter(undefined);
        setRecoveryError(message);
        setView("title");
      } else {
        setRunError(message);
      }
    } finally {
      setCreating(false);
    }
  };

  const beginNewGame = () => {
    if (!run) sessionStorage.removeItem(runStorageKey);
    setChosen(undefined);
    setAssigned(freshStats());
    setRunError(undefined);
    setRecoveryError(undefined);
    setView("characters");
  };

  const resumeRun = () => {
    if (!run || !activeCharacter) return;
    setView(run.prologueCompletedAt ? "breach-stair" : "prologue");
  };

  const enterBreachStair = async () => {
    if (!run) return;
    setContinuing(true);
    setRunError(undefined);
    try {
      const updatedRun = await completePrologue(run.id);
      setRun(updatedRun);
      setView("breach-stair");
    } catch (error) {
      setRunError(error instanceof Error ? error.message : "The descent could not begin.");
    } finally {
      setContinuing(false);
    }
  };

  if (view === "title") return <TitleScreen
    canResume={Boolean(run && activeCharacter)}
    recovering={resuming}
    recoveryError={recoveryError}
    onNewGame={beginNewGame}
    onResume={resumeRun}
  />;

  if (view === "prologue" && run && activeCharacter) return <PrologueScreen
    character={findCharacter(activeCharacter.protagonist.id)}
    continuing={continuing}
    error={runError}
    onBack={() => setView("title")}
    onContinue={enterBreachStair}
  />;

  if (view === "breach-stair" && run && activeCharacter) return (
    <main className="game"><section className="scene">
      <p className="eyebrow">The Breach Stair</p><h1>{activeCharacter.protagonist.name} descends.</h1>
      <p>Beneath Grayhaven, black water laps against the abbey steps. Far below, the Bell of Mercy waits for midnight.</p>
      <dl className="final-stats">{statNames.map((stat) => <div key={stat}><dt>{stat}</dt><dd>{activeCharacter.effectiveStats[stat]}</dd></div>)}</dl>
      <button className="back" onClick={() => {
        setView("characters");
      }}>← Start a new character</button>
    </section></main>
  );

  if (view === "stats" && chosen) return (
    <main className="builder"><section className="sheet">
      <button className="back" onClick={() => {
        setChosen(undefined);
        setRunError(undefined);
        setView("characters");
      }}>← Characters</button>
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
      {runError && <p className="run-error" role="alert">{runError}</p>}
      <button className="choose" disabled={remaining !== 0 || creating} onClick={startRun}>
        {creating ? "Preparing…" : "Begin the adventure"}
      </button>
    </section></main>
  );

  return (
    <main className="select">
      <button className="back select-back" onClick={() => setView("title")}>← Title</button>
      <header><p className="eyebrow">The Bell Below</p><h1>Who answers the final toll?</h1></header>
      <section className="carousel" aria-label="Choose a protagonist">
        <div className="portrait" role="img" aria-label={`${character.name} portrait placeholder`}>Portrait forthcoming</div>
        <article className="profile"><p className="eyebrow">{character.title}</p><h2>{character.name}</h2>
          <h3>Background</h3><p>{character.background}</p><h3>Motivation</h3><p>{character.motivation}</p>
          <nav className="controls" aria-label="Browse protagonists">
            <button onClick={() => setIndex((index + characters.length - 1) % characters.length)} aria-label="Previous protagonist">←</button>
            <span>{index + 1} / {characters.length}</span><button onClick={() => setIndex((index + 1) % characters.length)} aria-label="Next protagonist">→</button>
          </nav>
          <button className="choose" onClick={() => {
            setChosen(character);
            setAssigned(freshStats());
            setView("stats");
          }}>Choose {character.shortName}</button>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
