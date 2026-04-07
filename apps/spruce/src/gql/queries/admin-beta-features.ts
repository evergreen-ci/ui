import { gql } from "@apollo/client";

export const ADMIN_BETA_FEATURES = gql`
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
