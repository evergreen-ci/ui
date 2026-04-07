import { gql } from "@apollo/client";

const SPRUCE_CONFIG = gql`
  query SpruceConfig {
    spruceConfig {
      banner
      bannerTheme
      containerPools {
        pools {
          id
          distro
          maxContainers
          port
        }
      }
      jira {
        email
        host
      }
      providers {
        aws {
          maxVolumeSizePerUser
        }
      }
      serviceFlags {
        debugSpawnHostDisabled
        jwtTokenForCLIDisabled
      }
      slack {
        name
      }
      spawnHost {
        spawnHostsPerUser
        unexpirableHostsPerUser
        unexpirableVolumesPerUser
      }
      ui {
        defaultProject
      }
    }
  }
`;

export default SPRUCE_CONFIG;
