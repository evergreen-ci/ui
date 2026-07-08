import { gql } from "@apollo/client";

export const SPAWN_HOST = gql`
  mutation SpawnHost($spawnHostInput: SpawnHostInput) {
    spawnHost(spawnHostInput: $spawnHostInput) {
      id
      status
    }
  }
`;
