import { gql } from "@apollo/client";

export const SET_SERVICE_FLAGS = gql`
  mutation SetServiceFlags($updatedFlags: [ServiceFlagInput!]!) {
    setServiceFlags(updatedFlags: $updatedFlags) {
      enabled
      name
    }
  }
`;
