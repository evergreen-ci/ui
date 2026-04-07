import { gql } from "@apollo/client";

const ATTACH_VOLUME = gql`
  mutation AttachVolumeToHost($volumeAndHost: VolumeHost!) {
    attachVolumeToHost(volumeAndHost: $volumeAndHost)
  }
`;

export default ATTACH_VOLUME;
