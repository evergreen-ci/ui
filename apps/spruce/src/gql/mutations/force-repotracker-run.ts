import { gql } from "@apollo/client";

const FORCE_REPOTRACKER_RUN = gql`
  mutation ForceRepotrackerRun($projectId: String!) {
    forceRepotrackerRun(projectId: $projectId)
  }
`;

export default FORCE_REPOTRACKER_RUN;
