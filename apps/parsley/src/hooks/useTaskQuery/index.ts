import { useQuery } from "@apollo/client";
import { LogTypes } from "constants/enums";
import {
  BaseTaskFragment,
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  TaskLogLinks,
  TaskQuery,
  TaskQueryVariables,
  TaskTestResult,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";

interface UseTaskQueryProps {
  logType?: LogTypes;
  taskID?: string;
  execution?: string | number;
  buildID?: string;
}

type UseTaskQueryReturnType = {
  task:
    | (BaseTaskFragment & {
        logs?: TaskLogLinks;
        tests?: {
          testResults?: TaskTestResult["testResults"];
        };
      })
    | undefined
    | null;
  loading: boolean;
};

export const useTaskQuery = ({
  buildID,
  execution,
  logType,
  taskID,
}: UseTaskQueryProps): UseTaskQueryReturnType => {
  const isLogkeeper = logType === LogTypes.LOGKEEPER_LOGS;
  const { data: taskData, loading: taskLoading } = useQuery<
    TaskQuery,
    TaskQueryVariables
  >(GET_TASK, {
    skip: isLogkeeper || !taskID,
    variables: { execution: Number(execution), taskId: String(taskID) },
  });

  const { data: logkeeperData, loading: logkeeperLoading } = useQuery<
    LogkeeperTaskQuery,
    LogkeeperTaskQueryVariables
  >(GET_LOGKEEPER_TASK, {
    skip: !isLogkeeper || !buildID,
    variables: { buildId: String(buildID) },
  });

  const { task } = taskData ?? {};
  const { logkeeperBuildMetadata } = logkeeperData ?? {};
  const loadedTask = logkeeperBuildMetadata?.task ?? task;

  return { loading: taskLoading || logkeeperLoading, task: loadedTask };
};
