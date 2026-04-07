import { gql } from "@apollo/client";

const DETACH_VOLUME = gql`
  mutation DetachVolumeFromHost($volumeId: String!) {
    detachVolumeFromHost(volumeId: $volumeId)
  }
`;

export default DETACH_VOLUME;
