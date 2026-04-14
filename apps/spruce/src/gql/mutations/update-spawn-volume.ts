import { gql } from "@apollo/client";

export const UPDATE_SPAWN_VOLUME = gql`
  mutation UpdateVolume($updateVolumeInput: UpdateVolumeInput!) {
    updateVolume(updateVolumeInput: $updateVolumeInput)
  }
`;
