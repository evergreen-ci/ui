import { gql } from "@apollo/client";

export const FORCE_REPOTRACKER_RUN = gql`
  mutation ForceRepotrackerRun($projectId: String!) {
    forceRepotrackerRun(projectId: $projectId)
  }
`;
