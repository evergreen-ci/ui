import { gql } from "@apollo/client";

const UPDATE_HOST_STATUS = gql`
  mutation UpdateHostStatus(
    $hostIds: [String!]!
    $status: String!
    $notes: String
  ) {
    updateHostStatus(hostIds: $hostIds, status: $status, notes: $notes)
  }
`;

export default UPDATE_HOST_STATUS;
