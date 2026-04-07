import { gql } from "@apollo/client";

const REPROVISION_TO_NEW = gql`
  mutation ReprovisionToNew($hostIds: [String!]!) {
    reprovisionToNew(hostIds: $hostIds)
  }
`;

export default REPROVISION_TO_NEW;
