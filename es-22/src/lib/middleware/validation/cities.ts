import { Static, Type } from "@sinclair/typebox";

//the object we expect:
export const citySchema = Type.Object(
  {
    name: Type.String(),
    european: Type.Boolean(),
    country: Type.String(),
    inhabitans: Type.Integer(),
    region: Type.Optional(Type.String()),
  },
  { additionalProperties: false }
);

export type CityData = Static<typeof citySchema>;
//we have inferred a CityData type that can be used in our code.
