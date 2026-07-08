import { gql } from "@apollo/client";

export const TEST_ANALYSIS = gql`
  query TestAnalysis(
    $versionId: String!
    $options: TaskFilterOptions!
    $opts: TestFilterOptions
  ) {
    version(versionId: $versionId) {
      id
      tasks(options: $options) {
        count
        data {
          id
          buildVariant
          buildVariantDisplayName
          displayName
          displayStatus
          execution
          tests(opts: $opts) {
            filteredTestCount
            testResults {
              id
              logs {
                urlParsley
              }
              status
              testFile
            }
          }
        }
      }
    }
  }
`;
