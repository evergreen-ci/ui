import { gql } from "@apollo/client";

const CLEAR_MY_SUBSCRIPTIONS = gql`
  mutation ClearMySubscriptions {
    clearMySubscriptions
  }
`;

export default CLEAR_MY_SUBSCRIPTIONS;
