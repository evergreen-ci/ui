import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT } from "../fragments/upstreamProject";

const VERSION_UPSTREAM_PROJECT = gql`
  query VersionUpstreamProject($versionId: String!) {
    version(versionId: $versionId) {
      ...UpstreamProject
      id
    }
  }
  ${UPSTREAM_PROJECT}
`;

export default VERSION_UPSTREAM_PROJECT;
