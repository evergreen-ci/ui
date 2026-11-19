import { VersionQuery } from "gql/generated/types";

export type Version = NonNullable<VersionQuery["version"]>;
