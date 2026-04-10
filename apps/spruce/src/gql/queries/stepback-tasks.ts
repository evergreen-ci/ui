import { gql } from "@apollo/client";

export const STEPBACK_TASKS = gql`
  query StepbackTasks($taskId: String!, $execution: Int, $isPassing: Boolean!) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      prevTask {
        id
        displayStatus
        execution
        revision
      }
      prevTaskCompleted {
        id
        displayStatus
        execution
        revision
      }
      prevTaskPassing {
        id
        displayStatus
        execution
        nextTaskFailing @skip(if: $isPassing) {
          id
          displayStatus
          execution
          revision
        }
        revision
      }
    }
  }
`;
