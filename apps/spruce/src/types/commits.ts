import { Unpacked } from "@evg-ui/lib/types/utils";
import { MainlineCommitsQuery } from "gql/generated/types";

export enum ProjectFilterOptions {
  BuildVariant = "buildVariants",
  Task = "taskNames",
  Status = "statuses",
  Test = "tests",
  View = "view",
}

export enum ChartToggleQueryParams {
  chartType = "chartType",
  chartOpen = "chartOpen",
}

export enum MainlineCommitQueryParams {
  Requester = "requester",
  SkipOrderNumber = "skipOrderNumber",
  Revision = "revision",
}

export enum ChartTypes {
  Absolute = "absolute",
  Percentage = "percentage",
}

export enum CommitRequesterTypes {
  RepotrackerVersionRequester = "gitter_request",
  TriggerRequester = "trigger_request",
  GitTagRequester = "git_tag_request",
  AdHocRequester = "ad_hoc",
}

export type Commits = NonNullable<
  MainlineCommitsQuery["mainlineCommits"]
>["versions"];
export type Commit = Unpacked<Commits>;
export type CommitVersion = NonNullable<Commit["version"]>;
export type CommitRolledUpVersions = NonNullable<Commit["rolledUpVersions"]>;
export type BuildVariantDict = {
  [buildVariant: string]: {
    priority: number;
    iconHeight: number;
    badgeHeight: number;
  };
};
