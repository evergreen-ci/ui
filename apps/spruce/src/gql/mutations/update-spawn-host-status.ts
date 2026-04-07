import { gql } from "@apollo/client";

const UPDATE_SPAWN_HOST_STATUS = gql`
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

export default UPDATE_SPAWN_HOST_STATUS;
