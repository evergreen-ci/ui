import { FieldReadFunction } from "@apollo/client";
import { TaskHistoryTask } from "../types";

export const isAllInactive = (
  tasks: TaskHistoryTask[],
  readField: FieldReadFunction,
): boolean =>
  // @ts-expect-error: This line works perfectly fine despite type errors.
  tasks.every((t) => !readField<boolean>("activated", t));
