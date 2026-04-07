import { gql } from "@apollo/client";

const UPDATE_USER_BETA_FEATURES = gql`
  mutation UpdateUserBetaFeatures($opts: UpdateBetaFeaturesInput!) {
    updateBetaFeatures(opts: $opts) {
      betaFeatures {
        spruceWaterfallEnabled
      }
    }
  }
`;

export default UPDATE_USER_BETA_FEATURES;
