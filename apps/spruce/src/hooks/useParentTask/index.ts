import { FetchPolicy } from "@apollo/client";
import { skipToken, useQuery } from "@apollo/client/react";
import {
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { LAST_MAINLINE_COMMIT } from "gql/queries";
import { useTaskData } from "hooks/useTaskData";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";

export const useParentTask = (taskId: string, fetchPolicy?: FetchPolicy) => {
  const {
    baseTask,
    bvOptionsBase,
    projectIdentifier,
    skipOrderNumber,
    versionMetadata,
  } = useTaskData(taskId, fetchPolicy);

  const shouldSkip = !versionMetadata || versionMetadata.isPatch;

  const { data: parentTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(
    LAST_MAINLINE_COMMIT,
    projectIdentifier && skipOrderNumber !== undefined && !shouldSkip
      ? {
          variables: {
            projectIdentifier,
            skipOrderNumber,
            buildVariantOptions: {
              ...bvOptionsBase,
            },
          },
          fetchPolicy,
        }
      : skipToken,
  );

  if (shouldSkip) {
    return { loading: false, task: baseTask };
  }

  const task = parentTaskData
    ? getTaskFromMainlineCommitsQuery(parentTaskData)
    : undefined;

  return {
    loading,
    task: task ?? baseTask,
  };
};
