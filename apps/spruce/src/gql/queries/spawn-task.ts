import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/baseTask";

const SPAWN_TASK = gql`
  query SpawnTask($taskId: String!) {
    task(taskId: $taskId, execution: 0) {
      ...BaseTask
      details {
        description
      }
      executionSteps {
        blockType
        commandName
        displayName
        functionName
        isFunction
        stepNumber
      }
      project {
        id
        debugSpawnHostsDisabled
        spawnHostScriptPath
      }
    }
  }
  ${BASE_TASK}
`;

export default SPAWN_TASK;
