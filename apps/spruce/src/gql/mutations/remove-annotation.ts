import { gql } from "@apollo/client";

const REMOVE_ANNOTATION = gql`
  mutation RemoveAnnotationIssue(
    $taskId: String!
    $execution: Int!
    $apiIssue: IssueLinkInput!
    $isIssue: Boolean!
  ) {
    removeAnnotationIssue(
      taskId: $taskId
      execution: $execution
      apiIssue: $apiIssue
      isIssue: $isIssue
    )
  }
`;

export default REMOVE_ANNOTATION;
