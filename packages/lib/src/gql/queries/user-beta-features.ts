import { gql } from "@apollo/client";

const USER_BETA_FEATURES = gql`
  query UserBetaFeatures {
    user {
      betaFeatures {
        __typename
      }
      userId
    }
  }
`;

export default USER_BETA_FEATURES;
