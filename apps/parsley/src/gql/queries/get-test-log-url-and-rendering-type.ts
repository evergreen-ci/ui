import { gql } from "@apollo/client";

export const GET_TEST_LOG_URL_AND_RENDERING_TYPE = gql`
  query TestLogURLAndRenderingType(
    $taskID: String!
    $testName: String!
    $execution: Int!
  ) {
    task(taskId: $taskID, execution: $execution) {
      id
      tests(opts: { testName: $testName, excludeDisplayNames: true }) {
        testResults {
          id
          groupID
          logs {
            logPath: testName
            logsToMerge
            renderingType
            url
            urlRaw
          }
          status
          testFile
        }
      }
    }
  }
`;
