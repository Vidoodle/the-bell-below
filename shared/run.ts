import { Type, type Static } from "@sinclair/typebox";
import {
  CharacterCreationSchema,
  type CharacterCreation,
} from "./character.js";
import { sidSchema, type Sid } from "./sid.js";

export type RunId = Sid<"runs">;

export const RunIdSchema = sidSchema("runs");

export const CreateRunRequestSchema = CharacterCreationSchema;

export const RunParamsSchema = Type.Object({ id: RunIdSchema });

export type CreateRunRequest = CharacterCreation;
export type RunParams = Static<typeof RunParamsSchema>;
export type RunSnapshot = {
  id: RunId;
  prologueCompletedAt: string | null;
};
