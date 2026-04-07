import { gql } from "@apollo/client";

export const CLIENT_CONFIG = gql`
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
