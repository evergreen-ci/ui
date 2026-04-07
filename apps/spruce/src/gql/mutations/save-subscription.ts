import { gql } from "@apollo/client";

const SAVE_SUBSCRIPTION = gql`
  mutation SaveSubscriptionForUser($subscription: SubscriptionInput!) {
    saveSubscription(subscription: $subscription)
  }
`;

export default SAVE_SUBSCRIPTION;
