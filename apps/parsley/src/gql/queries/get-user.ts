import { gql } from "@apollo/client";

const GET_USER = gql`
  query User {
    user {
      userId
    }
  }
`;

export default GET_USER;
