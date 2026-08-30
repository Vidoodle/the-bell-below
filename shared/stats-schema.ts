import { Type } from "@sinclair/typebox";

export const BaseStatsSchema = Type.Object({
  Might: Type.Integer({ minimum: 1, maximum: 5 }),
  Grace: Type.Integer({ minimum: 1, maximum: 5 }),
  Wits: Type.Integer({ minimum: 1, maximum: 5 }),
  Presence: Type.Integer({ minimum: 1, maximum: 5 }),
}, { additionalProperties: false });
