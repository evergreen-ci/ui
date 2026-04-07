import { gql } from "@apollo/client";

const LAST_MAINLINE_COMMIT = gql`
  query LastMainlineCommit(
    $projectIdentifier: String!
    $skipOrderNumber: Int!
    $buildVariantOptions: BuildVariantOptions!
  ) {
    mainlineCommits(
      options: {
        projectIdentifier: $projectIdentifier
        limit: 1
        skipOrderNumber: $skipOrderNumber
        shouldCollapse: true
      }
      buildVariantOptions: $buildVariantOptions
    ) {
      versions {
        version {
          id
          buildVariants(options: $buildVariantOptions) {
            tasks {
              id
              displayStatus
              execution
              order
            }
          }
        }
      }
    }
  }
`;

export default LAST_MAINLINE_COMMIT;
