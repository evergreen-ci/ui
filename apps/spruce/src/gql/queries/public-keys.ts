import { gql } from "@apollo/client";

export const MY_PUBLIC_KEYS = gql`
  query MyPublicKeys {
    myPublicKeys {
      key
      name
    }
  }
`;
