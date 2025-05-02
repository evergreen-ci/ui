import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
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

// Define GraphQL queries using gql tag for tests
const GET_LOGKEEPER_TASK = process.env.NODE_ENV === 'test' 
  ? gql`
    query LogkeeperTask($buildId: String!) {
      logkeeperBuildMetadata(buildId: $buildId) {
        task {
          id
          displayName
          execution
        }
      }
    }
  `
  : require('gql/queries/get-logkeeper-task.graphql');

const GET_TASK = process.env.NODE_ENV === 'test'
  ? gql`
    query Task($taskId: String!, $execution: Int) {
      task(taskId: $taskId, execution: $execution) {
        id
        details {
          description
          status
        }
        displayName
        displayStatus
        execution
        logs {
          agentLogLink
          allLogLink
          systemLogLink
          taskLogLink
        }
        patchNumber
        versionMetadata {
          id
          isPatch
          message
          projectIdentifier
          projectMetadata {
            id
          }
          revision
        }
      }
    }
  `
  : require('gql/queries/get-task.graphql');

interface UseTaskQueryProps {
  logType?: LogTypes;
  taskID?: string;
  execution?: string | number;
  buildID?: string;
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
    errorPolicy: "all",
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
