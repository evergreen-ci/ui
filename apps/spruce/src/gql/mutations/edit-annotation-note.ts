import { gql } from "@apollo/client";

export const EDIT_ANNOTATION_NOTE = gql`
  mutation EditAnnotationNote(
    $taskId: String!
    $execution: Int!
    $originalMessage: String!
    $newMessage: String!
  ) {
    editAnnotationNote(
      taskId: $taskId
      execution: $execution
      originalMessage: $originalMessage
      newMessage: $newMessage
    )
  }
`;
