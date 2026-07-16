import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { TaskTableInfo } from "./types";

export const getPreviousRunCell = (({
  getValue,
  row: {
    original: { baseTask },
  },
}) => {
  const baseTaskStatus = baseTask?.displayStatus;
  const isInProgress =
    baseTaskStatus !== TaskStatus.Succeeded &&
    baseTaskStatus !== TaskStatus.Failed;

  const prevTaskCompleted = getValue() as NonNullable<
    TaskTableInfo["baseTask"]
  >["prevTaskCompleted"];

  if (isInProgress && prevTaskCompleted) {
    return (
      <TaskStatusBadgeWithLink
        execution={prevTaskCompleted.execution}
        id={prevTaskCompleted.id}
        status={prevTaskCompleted.displayStatus as TaskStatus}
      />
    );
  }

  return null;
}) satisfies LGColumnDef<TaskTableInfo>["cell"];
