import { RefObject } from "react";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskHistoryQuery } from "gql/generated/types";

export type TaskHistoryTask = Unpacked<
  TaskHistoryQuery["taskHistory"]["tasks"]
>;

export type TaskHistoryPagination =
  TaskHistoryQuery["taskHistory"]["pagination"];

export type GroupedTask =
  | {
      inactiveTasks: TaskHistoryTask[];
      task: null;
      shouldShowDateSeparator: boolean;
      isMatching: false;
      commitCardRef: null;
    }
  | {
      inactiveTasks: null;
      task: TaskHistoryTask;
      shouldShowDateSeparator: boolean;
      isMatching: boolean;
      commitCardRef: RefObject<HTMLDivElement>;
    };

export enum ViewOptions {
  Collapsed = "collapsed",
  Expanded = "expanded",
}

export enum TaskHistoryOptions {
  After = "after",
  Before = "before",
  CursorID = "cursor_id",
  IncludeCursor = "include_cursor",
  Direction = "direction",
  FailingTest = "failing_test",
  Date = "date",
}
