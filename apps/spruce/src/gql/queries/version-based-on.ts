import { gql } from "@apollo/client";

export const VERSION_BASED_ON = gql`
  query VersionBasedOn($versionId: String!) {
    version(versionId: $versionId) {
      id
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
`;
