import { gql } from "@apollo/client";

export const REPOTRACKER_ERROR = gql`
  query RepotrackerError($projectIdentifier: String!) {
    project(projectIdentifier: $projectIdentifier) {
      id
      branch
      repotrackerError {
        exists
        invalidRevision
      }
    }
  }
`;
