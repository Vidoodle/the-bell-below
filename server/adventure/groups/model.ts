declare const groupIdBrand: unique symbol;

export type GroupId = string & { readonly [groupIdBrand]: "group" };

export const groupId = <Value extends string>(value: Value) => value as Value & GroupId;

export type GroupDefinition = Readonly<{
  id: GroupId;
  name: string;
  protectedFacts: readonly string[];
}>;
