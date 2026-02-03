import { skipToken, useQuery } from "@apollo/client/react";
import { TaskStatus } from "@evg-ui/lib/types";
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

export const useLastPassingTask = (taskId: string) => {
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
        }
      : skipToken,
  );

  if (shouldSkip && parentTask?.displayStatus === TaskStatus.Succeeded) {
    return { task: parentTask, loading: false };
  }

  const task = lastPassingTaskData
    ? getTaskFromMainlineCommitsQuery(lastPassingTaskData)
    : undefined;

  return {
    task,
    loading,
  };
};
