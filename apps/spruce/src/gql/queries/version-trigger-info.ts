import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT } from "../fragments/upstreamProject";

export const VERSION_TRIGGER_INFO = gql`
  query VersionTriggerInfo($versionId: String!) {
    version(versionId: $versionId) {
      ...UpstreamProject
      id
      repotrackerBaseVersion: baseVersion(repotrackerOnly: true) {
        id
        createTime
        message
        projectMetadata {
          id
          owner
          repo
        }
        revision
        user {
          id
          displayName
        }
      }
    }
  }
  ${UPSTREAM_PROJECT}
`;
