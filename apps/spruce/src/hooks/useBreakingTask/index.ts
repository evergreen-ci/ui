import { FetchPolicy } from "@apollo/client";
import { useQuery, skipToken } from "@apollo/client/react";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { LAST_MAINLINE_COMMIT } from "gql/queries";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { useTaskData } from "hooks/useTaskData";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";
import { isFailedTaskStatus } from "utils/statuses";

export const useBreakingTask = (taskId: string, fetchPolicy?: FetchPolicy) => {
  const { bvOptionsBase, displayStatus, projectIdentifier } = useTaskData(
    taskId,
    fetchPolicy,
  );

  const { task: parentTask } = useParentTask(taskId, fetchPolicy);

  const { loading: lastPassingTaskLoading, task: lastPassingTask } =
    useLastPassingTask(taskId, fetchPolicy);
  const passingOrderNumber = lastPassingTask?.order || 0;

  // Skip the breaking task query if:
  // 1. Current task isn't failing (no breaking task to find)
  // 2. Parent task is failing AND there's no last passing task (can't determine breaking commit)
  const shouldSkipQuery =
    !isFailedTaskStatus(displayStatus) ||
    (parentTask &&
      isFailedTaskStatus(parentTask.displayStatus) &&
      !lastPassingTask);

  // The breaking commit is the first failing commit after the last passing commit.
  // The skip order number should be the last passing commit's order number + 1.
  // We use + 2 because internally the query does a less than comparison.
  // https://github.com/evergreen-ci/evergreen/blob/f6751ac3194452d457c0a6fe1a9f9b30dd674c60/model/version.go#L518
  const { data: breakingTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(
    LAST_MAINLINE_COMMIT,
    projectIdentifier && !shouldSkipQuery
      ? {
          variables: {
            projectIdentifier,
            skipOrderNumber: passingOrderNumber + 2,
            buildVariantOptions: {
              ...bvOptionsBase,
              statuses: [TaskStatus.Failed],
            },
          },
          fetchPolicy,
        }
      : skipToken,
  );

  const task = breakingTaskData
    ? getTaskFromMainlineCommitsQuery(breakingTaskData)
    : undefined;

  return {
    loading: lastPassingTaskLoading || loading,
    task,
  };
};
