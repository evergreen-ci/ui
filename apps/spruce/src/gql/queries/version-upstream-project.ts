import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT } from "../fragments/upstreamProject";

export const VERSION_UPSTREAM_PROJECT = gql`
  query VersionUpstreamProject($versionId: String!) {
    version(versionId: $versionId) {
      ...UpstreamProject
      id
    }
  }
  ${UPSTREAM_PROJECT}
`;
