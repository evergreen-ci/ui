import { Unpacked } from "@evg-ui/lib/types";
import {
  BaseVersionAndTaskQuery,
  LastMainlineCommitQuery,
} from "gql/generated/types";

export enum CommitType {
  Base = "base",
  LastPassing = "lastPassing",
  Breaking = "breaking",
  LastExecuted = "lastExecuted",
}

export type BaseTask = NonNullable<BaseVersionAndTaskQuery["task"]>["baseTask"];

type LastMainlineCommitQueryVersions = NonNullable<
  LastMainlineCommitQuery["mainlineCommits"]
>["versions"];

type LastMainlineCommitQueryVersion =
  Unpacked<LastMainlineCommitQueryVersions>["version"];

type LastMainlineCommitQueryVersionBuildVariant = Unpacked<
  NonNullable<LastMainlineCommitQueryVersion>["buildVariants"]
>;

export type CommitTask = Unpacked<
  NonNullable<LastMainlineCommitQueryVersionBuildVariant>
>["tasks"];
