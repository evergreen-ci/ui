import { BuildBaronQuery } from "gql/generated/types";

export type BuildBaronSuggestions = NonNullable<
  BuildBaronQuery["task"]
>["buildBaronSuggestions"];
