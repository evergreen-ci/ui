import { Unpacked } from "@evg-ui/lib/types/utils";
import { WaterfallOptions, WaterfallQuery } from "gql/generated/types";

export type Pagination = WaterfallQuery["waterfall"]["pagination"];

export type ServerFilters = Pick<
  WaterfallOptions,
  "requesters" | "statuses" | "tasks" | "variants"
>;

export type Version = Omit<
  Unpacked<WaterfallQuery["waterfall"]["flattenedVersions"]>,
  "buildVariants"
>;

export type GroupedVersion = {
  inactiveVersions: Version[] | null;
  version: Version | null;
};

export type Build = {
  activated: boolean;
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
