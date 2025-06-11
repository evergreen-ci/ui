import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskHistoryQuery } from "gql/generated/types";

export type TaskHistoryTask = Unpacked<
  TaskHistoryQuery["taskHistory"]["tasks"]
>;

export type TaskHistoryPagination =
  TaskHistoryQuery["taskHistory"]["pagination"];

export type GroupedTask =
  | {
      date: null;
      inactiveTasks: TaskHistoryTask[];
      task: null;
      isMatching: false;
    }
  | {
      date: null;
      inactiveTasks: null;
      task: TaskHistoryTask;
      isMatching: boolean;
    }
  | {
      date: Date;
      inactiveTasks: null;
      task: null;
      isMatching: false;
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
