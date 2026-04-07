import { gql } from "@apollo/client";
import { BASE_TASK } from "../fragments/base-task";

const GET_TASK = gql`
  query Task($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      ...BaseTask
      details {
        description
        failingCommand
        status
      }
      logs {
        agentLogLink
        allLogLink
        systemLogLink
        taskLogLink
      }
    }
  }
  ${BASE_TASK}
`;

export default GET_TASK;
