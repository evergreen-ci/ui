import { gql } from "@apollo/client";

const CLIENT_CONFIG = gql`
  query ClientConfig {
    clientConfig {
      clientBinaries {
        arch
        displayName
        os
        url
      }
      latestRevision
    }
  }
`;

export default CLIENT_CONFIG;
