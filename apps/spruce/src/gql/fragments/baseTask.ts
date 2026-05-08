import { gql } from "@apollo/client";

export const BASE_TASK = gql`
  fragment BaseTask on Task {
    id
    buildVariant
    buildVariantDisplayName
    displayName
    displayStatus
    execution
    revision
  }
`;
