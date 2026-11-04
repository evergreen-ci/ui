import { gql } from "@apollo/client";

export const PROJECT_COMMIT_HISTORY = gql`
  query ProjectCommitHistory(
    $projectIdentifier: String!
    $options: ProjectCommitsOptions!
  ) {
    project(projectIdentifier: $projectIdentifier) {
      id
      commits(options: $options) {
        pagination {
          hasNextPage
          nextPageOrder
        }
        versions {
          id
          createTime
          message
          order
          revision
          taskStatusStats {
            counts {
              count
              status
            }
          }
          user {
            displayName
            userId: id
          }
        }
      }
    }
  }
`;
