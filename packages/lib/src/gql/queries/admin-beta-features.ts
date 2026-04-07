import { gql } from "@apollo/client";

const ADMIN_BETA_FEATURES = gql`
  query AdminBetaFeatures {
    spruceConfig {
      ui {
        betaFeatures {
          __typename
        }
      }
    }
  }
`;

export default ADMIN_BETA_FEATURES;
