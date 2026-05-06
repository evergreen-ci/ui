import { gql } from "@apollo/client";

export const USER_TOKEN_EXCHANGE = gql`
  query UserTokenExchange {
    user {
      hasTokenExchangePending
      tokenAccessTokenExpiresAt
      userId
    }
  }
`;
