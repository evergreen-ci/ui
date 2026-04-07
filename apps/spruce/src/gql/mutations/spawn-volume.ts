import { gql } from "@apollo/client";

const SPAWN_VOLUME = gql`
  mutation SpawnVolume($spawnVolumeInput: SpawnVolumeInput!) {
    spawnVolume(spawnVolumeInput: $spawnVolumeInput)
  }
`;

export default SPAWN_VOLUME;
