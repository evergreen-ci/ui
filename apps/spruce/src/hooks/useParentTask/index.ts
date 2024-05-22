import { useQuery } from "@apollo/client";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";

export const useParentTask = (taskId: string) => {
  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const {
    baseTask,
    buildVariant,
    displayName,
    projectIdentifier,
    versionMetadata,
  } = taskData?.task ?? {};
  const { order: skipOrderNumber } = versionMetadata?.baseVersion ?? {};

  const bvOptionsBase = {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    tasks: [string.applyStrictRegex(displayName)],
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variants: [string.applyStrictRegex(buildVariant)],
  };

  const { data: parentTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    skip: !versionMetadata || versionMetadata.isPatch,
    variables: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      projectIdentifier,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      skipOrderNumber,
      buildVariantOptions: {
        ...bvOptionsBase,
      },
    },
  });
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const task = getTaskFromMainlineCommitsQuery(parentTaskData);

  return {
    task: task ?? baseTask,
    loading,
  };
};
