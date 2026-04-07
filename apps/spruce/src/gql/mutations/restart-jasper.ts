import { gql } from "@apollo/client";

const RESTART_JASPER = gql`
  mutation RestartJasper($hostIds: [String!]!) {
    restartJasper(hostIds: $hostIds)
  }
`;

export default RESTART_JASPER;
