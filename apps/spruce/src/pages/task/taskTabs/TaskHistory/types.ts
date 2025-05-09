import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskHistoryQuery } from "gql/generated/types";

export type TaskHistoryTask = Unpacked<
  TaskHistoryQuery["taskHistory"]["tasks"]
>;

export type GroupedTask =
  | {
      inactiveTasks: TaskHistoryTask[];
      task: null;
      shouldShowDateSeparator: boolean;
      isMatching: false;
    }
  | {
      inactiveTasks: null;
      task: TaskHistoryTask;
      shouldShowDateSeparator: boolean;
      isMatching: boolean;
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
