import { WaterfallVersionFragment } from "gql/generated/types";

// Although this is pretty much a duplicate of the GraphQL type, it is
// necessary to resolve type errors.
// We will need this anyway if we end up relying on the flattenedVersions
// field instead.
export type WaterfallVersion = {
  inactiveVersions: WaterfallVersionFragment[] | null;
  version: WaterfallVersionFragment | null;
};
