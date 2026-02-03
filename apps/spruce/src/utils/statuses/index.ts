import { TaskStatus } from "@evg-ui/lib/types";
import { failedTaskStatuses, finishedTaskStatuses } from "constants/task";
import { getCurrentStatuses } from "./getCurrentStatuses";
import { groupStatusesByUmbrellaStatus } from "./groupStatusesByUmbrellaStatus";
import { sortTasks } from "./sort";

export { sortTasks, groupStatusesByUmbrellaStatus, getCurrentStatuses };

export const isFinishedTaskStatus = (status: string | undefined): boolean => {
  if (!status) {
    return false;
  }
  return finishedTaskStatuses.includes(status as TaskStatus);
};

export const isFailedTaskStatus = (taskStatus: string | undefined) => {
  if (!taskStatus) {
    return false;
  }
  return failedTaskStatuses.includes(taskStatus as TaskStatus);
};
