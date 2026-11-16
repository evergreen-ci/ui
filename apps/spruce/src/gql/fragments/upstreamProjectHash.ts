import { gql } from "@apollo/client";

export const UPSTREAM_PROJECT_HASH = gql`
  fragment UpstreamProjectHash on Version {
    id
    upstreamProject {
      revision
    }
  }
`;
