import { gql } from "@apollo/client";

const TASK_FILES = gql`
  query TaskFiles($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      files {
        groupedFiles {
          execution
          files {
            link
            name
          }
          taskId
          taskName
        }
      }
    }
  }
`;

export default TASK_FILES;
