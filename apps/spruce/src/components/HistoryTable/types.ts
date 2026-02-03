import { Unpacked } from "@evg-ui/lib/types";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";

export interface FoldedCommitsRow {
  type: rowType.FOLDED_COMMITS;
  rolledUpCommits: MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions;
  date: Date;
  selected: boolean;
  expanded: boolean;
}

export interface DateSeparatorRow {
  type: rowType.DATE_SEPARATOR;
  date: Date;
  selected?: boolean;
}

export interface CommitRow {
  type: rowType.COMMIT;
  commit: MainlineCommitsForHistoryMainlineCommitsVersionsVersion;
  date: Date;
  selected: boolean;
}

export type CommitRowType = FoldedCommitsRow | DateSeparatorRow | CommitRow;

export type MainlineCommitsForHistoryMainlineCommits = NonNullable<
  MainlineCommitsForHistoryQuery["mainlineCommits"]
>;

export type MainlineCommitsForHistoryMainlineCommitsVersions = NonNullable<
  MainlineCommitsForHistoryMainlineCommits["versions"]
>;

export type MainlineCommitsForHistoryMainlineCommitsVersionsVersion =
  NonNullable<
    Unpacked<MainlineCommitsForHistoryMainlineCommitsVersions>["version"]
  >;

export type MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions =
  NonNullable<
    Unpacked<MainlineCommitsForHistoryMainlineCommitsVersions>["rolledUpVersions"]
  >;

export enum rowType {
  FOLDED_COMMITS,
  DATE_SEPARATOR,
  COMMIT,
}
