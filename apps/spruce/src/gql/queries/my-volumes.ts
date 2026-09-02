import { gql } from "@apollo/client";

export const MY_VOLUMES = gql`
  query MyVolumes {
    myVolumes {
      id
      availabilityZone
      createdBy
      creationTime
      displayName
      expiration
      homeVolume
      host {
        id
        displayName
        noExpiration
      }
      migrating
      noExpiration
      size
      type
    }
  }
`;
