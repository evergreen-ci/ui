import { useQuery } from "@apollo/client/react";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK } from "gql/queries";
import { string } from "utils";

/**
 * Shared hook that fetches BASE_VERSION_AND_TASK query for useBreakingTask, useLastPassingTask, useLastExecutedTask, and useParentTask hooks
 * @param taskId - task ID
 * @returns task data and loading state
 */
export const useTaskData = (taskId: string) => {
  const { data: taskData, loading } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
    fetchPolicy: "cache-first",
  });

  const task = taskData?.task;
  const {
    baseTask,
    buildVariant,
    displayName,
    displayStatus,
    projectIdentifier,
    versionMetadata,
  } = task ?? {};

  const { order: skipOrderNumber } = versionMetadata?.baseVersion ?? {};

  const bvOptionsBase = {
    tasks: displayName ? [string.applyStrictRegex(displayName)] : undefined,
    variants: buildVariant
      ? [string.applyStrictRegex(buildVariant)]
      : undefined,
  };

  return {
    baseTask,
    buildVariant,
    bvOptionsBase,
    displayName,
    displayStatus,
    loading,
    projectIdentifier,
    skipOrderNumber,
    task,
    versionMetadata,
  };
};
