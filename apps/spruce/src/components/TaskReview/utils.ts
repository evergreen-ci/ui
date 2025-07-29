import { gql } from "@apollo/client";

export const REVIEWED_TASK_FRAGMENT = gql`
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
