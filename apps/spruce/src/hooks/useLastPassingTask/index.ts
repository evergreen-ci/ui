import { FetchPolicy } from "@apollo/client";
import { skipToken, useQuery } from "@apollo/client/react";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { LAST_MAINLINE_COMMIT } from "gql/queries";
import { useParentTask } from "hooks/useParentTask";
import { useTaskData } from "hooks/useTaskData";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";

export const useLastPassingTask = (
  taskId: string,
  fetchPolicy?: FetchPolicy,
) => {
  const { bvOptionsBase, projectIdentifier, skipOrderNumber } = useTaskData(
    taskId,
    fetchPolicy,
  );

  const { task: parentTask } = useParentTask(taskId, fetchPolicy);

  const shouldSkip =
    !parentTask || parentTask.displayStatus === TaskStatus.Succeeded;

  const { data: lastPassingTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(
    LAST_MAINLINE_COMMIT,
    projectIdentifier &&
      skipOrderNumber !== undefined &&
      parentTask &&
      !shouldSkip
      ? {
          variables: {
            projectIdentifier,
            skipOrderNumber,
            buildVariantOptions: {
              ...bvOptionsBase,
              statuses: [TaskStatus.Succeeded],
            },
          },
          fetchPolicy,
        }
      : skipToken,
  );

  if (shouldSkip && parentTask?.displayStatus === TaskStatus.Succeeded) {
    return { loading: false, task: parentTask };
  }

  const task = lastPassingTaskData
    ? getTaskFromMainlineCommitsQuery(lastPassingTaskData)
    : undefined;

  return {
    loading,
    task,
  };
};
