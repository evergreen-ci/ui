import { gql } from "@apollo/client";
import { BASE_HOST } from "./baseHost";

export const BASE_SPAWN_HOST = gql`
  fragment BaseSpawnHost on Host {
    ...BaseHost
    availabilityZone
    displayName
    distro {
      id
      isVirtualWorkStation
      isWindows
      user
      workDir
    }
    expiration
    homeVolume {
      id
      displayName
    }
    homeVolumeID
    instanceTags {
      canBeModified
      key
      value
    }
    instanceType
    noExpiration
    volumes {
      id
      displayName
      migrating
    }
  }
  ${BASE_HOST}
`;
