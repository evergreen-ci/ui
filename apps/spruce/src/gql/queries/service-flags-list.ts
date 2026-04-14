import { gql } from "@apollo/client";

export const SERVICE_FLAGS_LIST = gql`
  query ServiceFlagsList {
    adminSettings {
      serviceFlagsList {
        enabled
        name
      }
    }
  }
`;
