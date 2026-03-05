import { useQuery, skipToken } from "@apollo/client/react";
import { finishedTaskStatuses } from "constants/task";
import {
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { LAST_MAINLINE_COMMIT } from "gql/queries";
import { useParentTask } from "hooks/useParentTask";
import { useTaskData } from "hooks/useTaskData";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";
import { isFinishedTaskStatus } from "utils/statuses";

export const useLastExecutedTask = (taskId: string) => {
  const { bvOptionsBase, projectIdentifier, skipOrderNumber } =
    useTaskData(taskId);

  const { task: parentTask } = useParentTask(taskId);

  const { data: lastExecutedTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(
    LAST_MAINLINE_COMMIT,
    projectIdentifier &&
      skipOrderNumber !== undefined &&
      parentTask &&
      !isFinishedTaskStatus(parentTask.displayStatus)
      ? {
          variables: {
            projectIdentifier,
            skipOrderNumber,
            buildVariantOptions: {
              ...bvOptionsBase,
              statuses: finishedTaskStatuses,
            },
          },
        }
      : skipToken,
  );

  const task = lastExecutedTaskData
    ? getTaskFromMainlineCommitsQuery(lastExecutedTaskData)
    : undefined;

  return {
    loading,
    task,
  };
};
