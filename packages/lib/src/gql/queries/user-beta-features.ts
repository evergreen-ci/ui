import { gql } from "@apollo/client";

export const USER_BETA_FEATURES = gql`
  query UserBetaFeatures {
    user: userLite {
      betaFeatures {
        __typename
      }
      userId: id
    }
  }
`;
