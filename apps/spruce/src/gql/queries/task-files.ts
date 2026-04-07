import { gql } from "@apollo/client";

const TASK_FILES = gql`
  query TaskFiles($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      files {
        fileCount
        groupedFiles {
          files {
            link
            name
            urlParsley
          }
          taskName
        }
      }
    }
  }
`;

export default TASK_FILES;
