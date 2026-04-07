import { gql } from "@apollo/client";

const ADD_ANNOTATION = gql`
  mutation AddAnnotationIssue(
    $taskId: String!
    $execution: Int!
    $apiIssue: IssueLinkInput!
    $isIssue: Boolean!
  ) {
    addAnnotationIssue(
      taskId: $taskId
      execution: $execution
      apiIssue: $apiIssue
      isIssue: $isIssue
    )
  }
`;

export default ADD_ANNOTATION;
