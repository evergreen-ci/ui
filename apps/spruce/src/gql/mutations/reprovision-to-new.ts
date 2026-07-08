import { gql } from "@apollo/client";

export const REPROVISION_TO_NEW = gql`
  mutation ReprovisionToNew($hostIds: [String!]!) {
    reprovisionToNew(hostIds: $hostIds)
  }
`;
