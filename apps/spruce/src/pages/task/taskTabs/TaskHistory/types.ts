import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskHistoryQuery } from "gql/generated/types";

export type TaskHistoryTask = Unpacked<
  TaskHistoryQuery["taskHistory"]["tasks"]
>;

export type GroupedTask =
  | {
      inactiveTasks: TaskHistoryTask[];
      task: null;
    }
  | {
      inactiveTasks: null;
      task: TaskHistoryTask;
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
  Date = "date",
}
