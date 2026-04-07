import { gql } from "@apollo/client";

const REMOVE_VOLUME = gql`
  mutation RemoveVolume($volumeId: String!) {
    removeVolume(volumeId: $volumeId)
  }
`;

export default REMOVE_VOLUME;
