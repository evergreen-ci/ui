import { gql } from "@apollo/client";

export const REVIEWED_TASK_FRAGMENT = gql`
  # eslint-disable-next-line @graphql-eslint/no-unused-fragments
  fragment ReviewedTask on Task {
    id
    displayStatus
    execution
    executionTasksFull {
      id
      displayStatus
      execution
      reviewed
    }
    reviewed
  }
`;
