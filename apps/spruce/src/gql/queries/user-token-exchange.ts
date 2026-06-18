import { gql } from "@apollo/client";

export const USER_TOKEN_EXCHANGE = gql`
  query UserTokenExchange {
    user: userLite {
      hasTokenExchangePending
      tokenAccessTokenExpiresAt
      userId: id
    }
  }
`;
