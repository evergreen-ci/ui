import { gql } from "@apollo/client";

const REPOTRACKER_ERROR = gql`
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

export default REPOTRACKER_ERROR;
