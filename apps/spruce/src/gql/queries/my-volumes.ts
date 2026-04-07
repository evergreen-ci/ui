import { gql } from "@apollo/client";

const MY_VOLUMES = gql`
  query MyVolumes {
    myVolumes {
      id
      availabilityZone
      createdBy
      creationTime
      deviceName
      displayName
      expiration
      homeVolume
      host {
        id
        displayName
        noExpiration
      }
      hostID
      migrating
      noExpiration
      size
      type
    }
  }
`;

export default MY_VOLUMES;
