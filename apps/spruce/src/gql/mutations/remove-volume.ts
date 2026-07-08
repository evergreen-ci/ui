import { gql } from "@apollo/client";

export const REMOVE_VOLUME = gql`
  mutation RemoveVolume($volumeId: String!) {
    removeVolume(volumeId: $volumeId)
  }
`;
