import { gql } from "@apollo/client";

const RESTART_VERSIONS = gql`
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
      patch {
        id
        childPatches {
          id
          status
        }
        status
      }
      status
      taskStatuses
    }
  }
`;

export default RESTART_VERSIONS;
