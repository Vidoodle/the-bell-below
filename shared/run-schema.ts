import { Type, type Static } from "@sinclair/typebox";

const BaseStatsSchema = Type.Object({
  Might: Type.Integer({ minimum: 1, maximum: 5 }),
  Grace: Type.Integer({ minimum: 1, maximum: 5 }),
  Wits: Type.Integer({ minimum: 1, maximum: 5 }),
  Presence: Type.Integer({ minimum: 1, maximum: 5 }),
}, { additionalProperties: false });

export const CreateRunRequestSchema = Type.Object({
  protagonistId: Type.Union([
    Type.Literal("seren"),
    Type.Literal("veyra"),
    Type.Literal("cael"),
    Type.Literal("riona"),
  ]),
  baseStats: BaseStatsSchema,
}, { additionalProperties: false });

export const RunParamsSchema = Type.Object({
  id: Type.String({ minLength: 1 }),
});

export type CreateRunRequest = Static<typeof CreateRunRequestSchema>;
export type RunParams = Static<typeof RunParamsSchema>;
