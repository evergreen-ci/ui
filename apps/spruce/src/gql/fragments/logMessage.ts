import { gql } from "@apollo/client";

export const LOG_MESSAGE = gql`
  fragment LogMessage on LogMessage {
    message
    severity
    timestamp
  }
`;
