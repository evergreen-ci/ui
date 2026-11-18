import { gql } from "@apollo/client";

export const UPSTREAM_PROJECT = gql`
  fragment UpstreamProject on Version {
    id
    upstreamProject {
      owner
      project
      repo
      revision
      task {
        id
        displayName
        execution
      }
      triggerID
      triggerType
      version {
        id
      }
    }
  }
`;
