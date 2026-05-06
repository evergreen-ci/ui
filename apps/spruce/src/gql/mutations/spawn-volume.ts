import { gql } from "@apollo/client";

export const SPAWN_VOLUME = gql`
  mutation SpawnVolume($spawnVolumeInput: SpawnVolumeInput!) {
    spawnVolume(spawnVolumeInput: $spawnVolumeInput)
  }
`;
