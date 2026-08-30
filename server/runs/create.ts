import type { CharacterId } from "../../shared/character.js";
import type { CreateRunRequest, RunId, RunSnapshot } from "../../shared/run.js";
import { createCharacter } from "../characters/model.js";
import { createRun } from "./model.js";
import type { RunWriter } from "./writer.js";

export type CreateRun = (input: CreateRunRequest) => Promise<RunSnapshot>;

type CreateRunOptions = {
  writer: RunWriter;
  createCharacterId: () => CharacterId;
  createRunId: () => RunId;
};

export function buildCreateRun(options: CreateRunOptions): CreateRun {
  return async (input) => {
    const run = createRun(options.createRunId());
    const character = createCharacter(options.createCharacterId(), run.id, input);
    await options.writer.create(run, character);
    return run;
  };
}
