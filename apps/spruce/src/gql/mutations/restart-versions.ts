import { gql } from "@apollo/client";

export const RESTART_VERSIONS = gql`
  mutation RestartVersions(
    $versionId: String!
    $abort: Boolean!
    $versionsToRestart: [VersionToRestart!]!
  ) {
    restartVersions(
      versionId: $versionId
      abort: $abort
      versionsToRestart: $versionsToRestart
    ) {
      id
      childVersions {
        id
        status
      }
      status
      taskStatuses
    }
  }
`;
