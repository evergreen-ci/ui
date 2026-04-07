import { gql } from "@apollo/client";

const SPAWN_HOST = gql`
  mutation SpawnHost($spawnHostInput: SpawnHostInput) {
    spawnHost(spawnHostInput: $spawnHostInput) {
      id
      status
    }
  }
`;

export default SPAWN_HOST;
