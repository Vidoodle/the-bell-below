declare const locationIdBrand: unique symbol;

export type LocationId = string & { readonly [locationIdBrand]: "location" };

export const locationId = <Value extends string>(value: Value) => value as Value & LocationId;

export type LocationDefinition = Readonly<{
  id: LocationId;
  name: string;
  description: string;
}>;
