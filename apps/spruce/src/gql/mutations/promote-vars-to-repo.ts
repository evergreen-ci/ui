import { gql } from "@apollo/client";

const PROMOTE_VARS_TO_REPO = gql`
  mutation PromoteVarsToRepo($projectId: String!, $varNames: [String!]!) {
    promoteVarsToRepo(opts: { projectId: $projectId, varNames: $varNames })
  }
`;

export default PROMOTE_VARS_TO_REPO;
