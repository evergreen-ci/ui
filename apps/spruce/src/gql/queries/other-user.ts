import { gql } from "@apollo/client";

const OTHER_USER = gql`
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

export default OTHER_USER;
