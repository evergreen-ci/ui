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

// @ts-ignore: FIXME. This comment was added by an automated script.
export type BaseTask = BaseVersionAndTaskQuery["task"]["baseTask"];

export type CommitTask =
  // @ts-ignore: FIXME. This comment was added by an automated script.
  LastMainlineCommitQuery["mainlineCommits"]["versions"][number]["version"]["buildVariants"][number]["tasks"][number];
