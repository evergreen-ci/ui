import { gql } from "@apollo/client";

const SERVICE_FLAGS_LIST = gql`
  query ServiceFlagsList {
    adminSettings {
      serviceFlagsList {
        enabled
        name
      }
    }
  }
`;

export default SERVICE_FLAGS_LIST;
