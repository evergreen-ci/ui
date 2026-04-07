import { gql } from "@apollo/client";

const ADMIN_BETA_FEATURES = gql`
  query AdminBetaFeatures {
    spruceConfig {
      ui {
        betaFeatures {
          spruceWaterfallEnabled
        }
      }
    }
  }
`;

export default ADMIN_BETA_FEATURES;
