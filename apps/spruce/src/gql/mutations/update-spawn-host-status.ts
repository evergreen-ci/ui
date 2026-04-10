import { gql } from "@apollo/client";

export const UPDATE_SPAWN_HOST_STATUS = gql`
  mutation UpdateSpawnHostStatus(
    $updateSpawnHostStatusInput: UpdateSpawnHostStatusInput!
  ) {
    updateSpawnHostStatus(
      updateSpawnHostStatusInput: $updateSpawnHostStatusInput
    ) {
      id
      status
    }
  }
`;
