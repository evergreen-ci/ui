import { gql } from "@apollo/client";

const REMOVE_PUBLIC_KEY = gql`
  mutation RemovePublicKey($keyName: String!) {
    removePublicKey(keyName: $keyName) {
      key
      name
    }
  }
`;

export default REMOVE_PUBLIC_KEY;
