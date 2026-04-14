import { gql } from "@apollo/client";

export const SAVE_SUBSCRIPTION = gql`
  mutation SaveSubscriptionForUser($subscription: SubscriptionInput!) {
    saveSubscription(subscription: $subscription)
  }
`;
