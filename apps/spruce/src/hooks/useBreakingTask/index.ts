import { useQuery } from "@apollo/client";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { TaskStatus } from "types/task";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";
import { isFailedTaskStatus } from "utils/statuses";

export const useBreakingTask = (taskId: string) => {
  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const { buildVariant, displayName, projectIdentifier, status } =
    taskData?.task ?? {};

  const bvOptionsBase = {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    tasks: [string.applyStrictRegex(displayName)],
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variants: [string.applyStrictRegex(buildVariant)],
  };

  const { task: parentTask } = useParentTask(taskId);

  const { task: lastPassingTask } = useLastPassingTask(taskId);
  const passingOrderNumber = lastPassingTask?.order;

  // The breaking commit is the first failing commit after the last passing commit.
  // The skip order number should be the last passing commit's order number + 1.
  // We use + 2 because internally the query does a less than comparison.
  // https://github.com/evergreen-ci/evergreen/blob/f6751ac3194452d457c0a6fe1a9f9b30dd674c60/model/version.go#L518
  const { data: breakingTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    skip: !parentTask || !lastPassingTask || !isFailedTaskStatus(status),
    variables: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      projectIdentifier,
      skipOrderNumber: passingOrderNumber + 2,
      buildVariantOptions: {
        ...bvOptionsBase,
        statuses: [TaskStatus.Failed],
      },
    },
  });
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const task = getTaskFromMainlineCommitsQuery(breakingTaskData);

  return {
    task,
    loading,
  };
};
