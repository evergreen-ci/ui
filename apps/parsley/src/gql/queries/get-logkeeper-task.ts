import { gql } from "@apollo/client";

export const GET_LOGKEEPER_TASK = gql`
  #import "../fragments/base-task.graphql"

  query LogkeeperTask($buildId: String!) {
    logkeeperBuildMetadata(buildId: $buildId) {
      id
      task {
        ...BaseTask
        tests(opts: null) {
          testResults {
            id
            logs {
              urlRaw
            }
            status
            testFile
          }
        }
      }
    }
  }
`;
