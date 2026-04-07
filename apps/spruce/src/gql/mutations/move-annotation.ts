import { gql } from "@apollo/client";

const MOVE_ANNOTATION = gql`
  mutation MoveAnnotationIssue(
    $taskId: String!
    $execution: Int!
    $apiIssue: IssueLinkInput!
    $isIssue: Boolean!
  ) {
    moveAnnotationIssue(
      taskId: $taskId
      execution: $execution
      apiIssue: $apiIssue
      isIssue: $isIssue
    )
  }
`;

export default MOVE_ANNOTATION;
