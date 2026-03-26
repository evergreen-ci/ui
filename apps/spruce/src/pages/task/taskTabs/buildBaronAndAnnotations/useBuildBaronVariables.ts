import { skipToken, useQuery } from "@apollo/client/react";
import {
  BuildBaronConfiguredQuery,
  BuildBaronConfiguredQueryVariables,
} from "gql/generated/types";
import { BUILD_BARON_CONFIGURED } from "gql/queries";
import { statuses } from "utils";

const { isFailedTaskStatus } = statuses;
interface UseBuildBaronVariablesType {
  task: {
    id: string;
    execution: number;
    status: string;
    hasAnnotation: boolean;
    canModifyAnnotation: boolean;
  };
}
const useBuildBaronVariables = ({ task }: UseBuildBaronVariablesType) => {
  const { canModifyAnnotation, execution, hasAnnotation, id, status } = task;
  const isFailedTask = isFailedTaskStatus(status);
  const { data: buildBaronData } = useQuery<
    BuildBaronConfiguredQuery,
    BuildBaronConfiguredQueryVariables
  >(
    BUILD_BARON_CONFIGURED,
    isFailedTask || (hasAnnotation && canModifyAnnotation)
      ? {
          variables: {
            taskId: id,
            execution,
          },
        }
      : skipToken,
  );

  const buildBaronConfigured =
    buildBaronData?.buildBaron?.buildBaronConfigured || false;

  const showBuildBaron =
    isFailedTask &&
    (buildBaronConfigured || hasAnnotation || canModifyAnnotation);

  return {
    showBuildBaron,
  };
};

export default useBuildBaronVariables;
