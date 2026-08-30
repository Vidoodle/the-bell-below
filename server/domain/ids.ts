import { randomBytes } from "node:crypto";
import type { CharacterId } from "../../shared/character.js";
import type { RunId } from "../../shared/run.js";
import type { Sid } from "../../shared/sid.js";

const randomHex = () => randomBytes(15).toString("hex");
const createSid = <Prefix extends string>(prefix: Prefix): Sid<Prefix> => (
  `${prefix}${randomHex()}` as Sid<Prefix>
);

export const createCharacterId = (): CharacterId => createSid("char");
export const createRunId = (): RunId => createSid("runs");
