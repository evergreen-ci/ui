import { Unpacked } from "@evg-ui/lib/types/utils";
import { WaterfallVersionFragment, WaterfallQuery } from "gql/generated/types";

// Although this is pretty much a duplicate of the GraphQL type, it is
// necessary to resolve type errors.
// We will need this anyway if we end up relying on the flattenedVersions
// field instead.
export type WaterfallVersion = {
  inactiveVersions: WaterfallVersionFragment[] | null;
  version: WaterfallVersionFragment | null;
};

export type Build = Unpacked<
  Unpacked<WaterfallQuery["waterfall"]["buildVariants"]>["builds"]
>;

export type BuildVariant = Unpacked<
  WaterfallQuery["waterfall"]["buildVariants"]
>;

export enum WaterfallFilterOptions {
  BuildVariant = "buildVariants",
  MaxOrder = "maxOrder",
  MinOrder = "minOrder",
  Requesters = "requesters",
  Revision = "revision",
  Task = "tasks",
}
