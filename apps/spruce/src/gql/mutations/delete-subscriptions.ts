import { gql } from "@apollo/client";

export const DELETE_SUBSCRIPTIONS = gql`
  mutation DeleteSubscriptions($subscriptionIds: [String!]!) {
    deleteSubscriptions(subscriptionIds: $subscriptionIds)
  }
`;
