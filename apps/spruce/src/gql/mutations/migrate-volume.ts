import { gql } from "@apollo/client";

const MIGRATE_VOLUME = gql`
  mutation MigrateVolume($volumeId: String!, $spawnHostInput: SpawnHostInput!) {
    migrateVolume(volumeId: $volumeId, spawnHostInput: $spawnHostInput)
  }
`;

export default MIGRATE_VOLUME;
