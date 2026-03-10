import { FetchPolicy } from "@apollo/client";
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
 * @param fetchPolicy - fetch policy for the query
 * @returns task data and loading state
 */
export const useTaskData = (taskId: string, fetchPolicy?: FetchPolicy) => {
  const { data: taskData, loading } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
    fetchPolicy,
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
