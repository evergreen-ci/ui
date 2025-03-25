import { Unpacked } from "@evg-ui/lib/types/utils";
import { TaskHistoryQuery } from "gql/generated/types";

export type TaskHistoryTask = Unpacked<
  TaskHistoryQuery["taskHistory"]["tasks"]
>;

export type GroupedTask = {
  inactiveTasks: TaskHistoryTask[] | null;
  task: TaskHistoryTask | null;
};

export enum ViewOptions {
  Collapsed = "collapsed",
  Expanded = "expanded",
}

export enum TaskHistoryOptions {
  After = "after",
  Before = "before",
  IncludeCursor = "includeCursor",
}
