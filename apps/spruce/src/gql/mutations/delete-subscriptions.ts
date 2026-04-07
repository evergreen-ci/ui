import { gql } from "@apollo/client";

const DELETE_SUBSCRIPTIONS = gql`
  mutation DeleteSubscriptions($subscriptionIds: [String!]!) {
    deleteSubscriptions(subscriptionIds: $subscriptionIds)
  }
`;

export default DELETE_SUBSCRIPTIONS;
