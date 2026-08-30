import { Type, type TString } from "@sinclair/typebox";

declare const sidBrand: unique symbol;

export type Sid<Prefix extends string> = string & { readonly [sidBrand]: Prefix };

type SidSchema<Prefix extends string> = TString & { static: Sid<Prefix> };

export function sidSchema<Prefix extends string>(prefix: Prefix): SidSchema<Prefix> {
  return Type.String({ pattern: `^${prefix}[0-9a-f]{30}$` }) as SidSchema<Prefix>;
}
