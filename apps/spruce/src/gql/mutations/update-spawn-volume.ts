import { gql } from "@apollo/client";

const UPDATE_SPAWN_VOLUME = gql`
  mutation UpdateVolume($updateVolumeInput: UpdateVolumeInput!) {
    updateVolume(updateVolumeInput: $updateVolumeInput)
  }
`;

export default UPDATE_SPAWN_VOLUME;
