import { useQuery, skipToken } from "@apollo/client/react";
import { finishedTaskStatuses } from "constants/task";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useParentTask } from "hooks/useParentTask";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";
import { isFinishedTaskStatus } from "utils/statuses";

export const useLastExecutedTask = (taskId: string) => {
  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const { buildVariant, displayName, projectIdentifier, versionMetadata } =
    taskData?.task ?? {};
  const { order: skipOrderNumber } = versionMetadata?.baseVersion ?? {};

  const bvOptionsBase = {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    tasks: [string.applyStrictRegex(displayName)],
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variants: [string.applyStrictRegex(buildVariant)],
  };

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
    task,
    loading,
  };
};
