import { gql } from "@apollo/client";

export const MIGRATE_VOLUME = gql`
  mutation MigrateVolume($volumeId: String!, $spawnHostInput: SpawnHostInput!) {
    migrateVolume(volumeId: $volumeId, spawnHostInput: $spawnHostInput)
  }
`;
