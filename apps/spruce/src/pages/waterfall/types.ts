import { WaterfallVersionFragment } from "gql/generated/types";

// Although this is pretty much a duplicate of the GraphQL type, it is
// necessary to resolve type errors.
// We will need this anyway if we end up relying on the flattenedVersions
// field instead.
export type WaterfallVersion = {
  inactiveVersions: WaterfallVersionFragment[] | null;
  version: WaterfallVersionFragment | null;
};

export type Build = {
  id: string;
  tasks: Array<{
    displayName: string;
    displayStatusCache: string;
    execution: number;
    id: string;
    status: string;
  }>;
  version: string;
};

export type BuildVariant = {
  builds: Build[];
  displayName: string;
  id: string;
};

export enum WaterfallFilterOptions {
  BuildVariant = "buildVariants",
  MaxOrder = "maxOrder",
  MinOrder = "minOrder",
  Requesters = "requesters",
  Revision = "revision",
  Statuses = "statuses",
  Task = "tasks",
  Date = "date",
}
