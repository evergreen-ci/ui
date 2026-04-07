import { gql } from "@apollo/client";

export const VARIABLES = gql`
  fragment Variables on ProjectVars {
    adminOnlyVars
    privateVars
    vars
  }
`;
