import { gql } from "@apollo/client";

export const ALIAS = gql`
  fragment Alias on ProjectAlias {
    id
    alias
    description
    gitTag
    parameters {
      key
      value
    }
    remotePath
    requiredLabels
    task
    taskTags
    variant
    variantTags
  }
`;
