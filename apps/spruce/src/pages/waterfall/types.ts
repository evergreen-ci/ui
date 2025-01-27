import { Unpacked } from "@evg-ui/lib/types/utils";
import { WaterfallVersionFragment } from "gql/generated/types";

// Although this is pretty much a duplicate of the GraphQL type, it is
// necessary to resolve type errors.
// We will need this anyway if we end up relying on the flattenedVersions
// field instead.
export type WaterfallVersion = {
  inactiveVersions: WaterfallVersionFragment[] | null;
  version: WaterfallVersionFragment | null;
};

type B = {
  buildVariants: Array<{
    displayName: string;
    id: string;
    version: string;
    builds: Array<{
      activated?: boolean | null;
      displayName: string;
      id: string;
      version: string;
      tasks: Array<{
        displayName: string;
        displayStatusCache: string;
        execution: number;
        id: string;
        status: string;
      }>;
    }>;
  }>;
};

export type Build = Unpacked<Unpacked<B["buildVariants"]>["builds"]>;

export type BuildVariant = Unpacked<B["buildVariants"]>;

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
