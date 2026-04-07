import { gql } from "@apollo/client";

const SET_SERVICE_FLAGS = gql`
  mutation SetServiceFlags($updatedFlags: [ServiceFlagInput!]!) {
    setServiceFlags(updatedFlags: $updatedFlags) {
      enabled
      name
    }
  }
`;

export default SET_SERVICE_FLAGS;
