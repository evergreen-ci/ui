import { gql } from "@apollo/client";

export const UPDATE_USER_BETA_FEATURES = gql`
  mutation UpdateUserBetaFeatures($opts: UpdateBetaFeaturesInput!) {
    updateBetaFeatures(opts: $opts) {
      betaFeatures {
        spruceWaterfallEnabled
      }
    }
  }
`;
