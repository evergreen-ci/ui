import { gql } from "@apollo/client";

export const OTHER_USER = gql`
  query OtherUser($userId: String) {
    currentUser: user {
      userId
    }
    otherUser: user(userId: $userId) {
      displayName
      userId
    }
  }
`;
