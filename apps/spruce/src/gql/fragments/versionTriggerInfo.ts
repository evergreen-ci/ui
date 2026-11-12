import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT } from "./upstreamProject";

export const VERSION_TRIGGER_INFO = gql`
  fragment VersionTriggerInfo on Version {
    ...UpstreamProject
    id
    upstreamProject {
      baseVersion {
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
