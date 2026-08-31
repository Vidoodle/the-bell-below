import { useEffect, useState } from "react";
import type { CharacterSnapshot } from "../shared/character";
import type { CreateRunRequest, RunSnapshot } from "../shared/run";
import type { BaseStats, Stat } from "../shared/stats";
import { getRunCharacter } from "./api/characters";
import { completePrologue, createRun, getRun } from "./api/runs";
import { CharacterStatsHud } from "./components/CharacterStatsHud";
import { characters, findCharacter, type CharacterProfile } from "./content/characters";
import { DrownedStairScreen } from "./screens/DrownedStairScreen";
import { CharacterSelectionScreen } from "./screens/CharacterSelectionScreen";
import { PrologueScreen } from "./screens/PrologueScreen";
import { SettingIntroductionScreen } from "./screens/SettingIntroductionScreen";
import { StatAllocationScreen } from "./screens/StatAllocationScreen";
import { TitleScreen } from "./screens/TitleScreen";

const runStorageKey = "the-bell-below.run";
type View = "title" | "introduction" | "characters" | "stats" | "prologue" | "drowned-stair";
const freshStats = (): BaseStats => ({ Might: 1, Grace: 1, Wits: 1, Presence: 1 });

export function App() {
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
    setView("introduction");
  };

  const resumeRun = () => {
    if (!run || !activeCharacter) return;
    setView(run.prologueCompletedAt ? "drowned-stair" : "prologue");
  };

  const approachDrownedStair = async () => {
    if (!run) return;
    setContinuing(true);
    setRunError(undefined);
    try {
      const updatedRun = await completePrologue(run.id);
      setRun(updatedRun);
      setView("drowned-stair");
    } catch (error) {
      setRunError(error instanceof Error ? error.message : "The approach could not begin.");
    } finally {
      setContinuing(false);
    }
  };

  const adjustStat = (stat: Stat, change: number) => setAssigned((current) => ({
    ...current,
    [stat]: current[stat] + change,
  }));

  if (view === "title") return <TitleScreen
    canResume={Boolean(run && activeCharacter)}
    recovering={resuming}
    recoveryError={recoveryError}
    onNewGame={beginNewGame}
    onResume={resumeRun}
  />;

  if (view === "introduction") return <SettingIntroductionScreen
    onBack={() => setView("title")}
    onContinue={() => setView("characters")}
  />;

  if (view === "prologue" && run && activeCharacter) return <>
    <CharacterStatsHud stats={activeCharacter.effectiveStats} />
    <PrologueScreen
      character={findCharacter(activeCharacter.protagonist.id)}
      continuing={continuing}
      error={runError}
      onBack={() => setView("title")}
      onContinue={approachDrownedStair}
    />
  </>;

  if (view === "drowned-stair" && run && activeCharacter) return <>
    <CharacterStatsHud stats={activeCharacter.effectiveStats} />
    <DrownedStairScreen character={activeCharacter} onStartNewCharacter={beginNewGame} />
  </>;

  if (view === "stats" && chosen) return <StatAllocationScreen
    assigned={assigned}
    character={chosen}
    creating={creating}
    error={runError}
    onAdjust={adjustStat}
    onBack={() => {
      setChosen(undefined);
      setRunError(undefined);
      setView("characters");
    }}
    onStart={startRun}
  />;

  return <CharacterSelectionScreen
    character={character}
    index={index}
    total={characters.length}
    onBack={() => setView("introduction")}
    onNext={() => setIndex((index + 1) % characters.length)}
    onPrevious={() => setIndex((index + characters.length - 1) % characters.length)}
    onSelect={() => {
      setChosen(character);
      setAssigned(freshStats());
      setView("stats");
    }}
  />;
}
