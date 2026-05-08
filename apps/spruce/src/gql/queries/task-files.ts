import { gql } from "@apollo/client";

export const TASK_FILES = gql`
  query TaskFiles($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      files {
        fileCount
        groupedFiles {
          files {
            associatedLinks {
              link
              name
            }
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
