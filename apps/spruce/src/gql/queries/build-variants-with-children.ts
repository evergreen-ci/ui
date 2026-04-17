import { gql } from "@apollo/client";

export const BUILD_VARIANTS_WITH_CHILDREN = gql`
  query BuildVariantsWithChildren($id: String!, $statuses: [String!]!) {
    version(versionId: $id) {
      id
      buildVariants(options: { statuses: $statuses }) {
        displayName
        tasks {
          id
          baseStatus
          displayName
          displayStatus
          execution
        }
        variant
      }
      childVersions {
        id
        buildVariants(options: { statuses: $statuses }) {
          displayName
          tasks {
            id
            baseStatus
            displayName
            displayStatus
            execution
          }
          variant
        }
        generatedTaskCounts {
          estimatedTasks
          taskId
        }
        project
        projectIdentifier
      }
      generatedTaskCounts {
        estimatedTasks
        taskId
      }
    }
  }
`;
