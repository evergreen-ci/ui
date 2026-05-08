import { skipToken, useQuery } from "@apollo/client/react";
import {
  BaseTaskFragment,
  TaskLogLinks,
  TaskQuery,
  TaskQueryVariables,
  TaskTestResult,
} from "gql/generated/types";
import { GET_TASK } from "gql/queries";

interface UseTaskQueryProps {
  taskID?: string;
  execution?: string | number;
}

type TaskType = BaseTaskFragment & {
  logs?: TaskLogLinks;
  tests?: {
    testResults?: TaskTestResult["testResults"];
  };
  details?:
    | {
        description?: string | null | undefined;
        failingCommand?: string | null | undefined;
        status: string;
      }
    | null
    | undefined;
};

type UseTaskQueryReturnType = {
  task: TaskType | null | undefined;
  loading: boolean;
};

export const useTaskQuery = ({
  execution,
  taskID,
}: UseTaskQueryProps): UseTaskQueryReturnType => {
  const { data: taskData, loading: taskLoading } = useQuery<
    TaskQuery,
    TaskQueryVariables
  >(
    GET_TASK,
    taskID
      ? {
          errorPolicy: "all",
          variables: {
            execution: Number(execution),
            taskId: String(taskID),
          },
        }
      : skipToken,
  );

  const { task } = taskData ?? {};

  return { loading: taskLoading, task };
};
