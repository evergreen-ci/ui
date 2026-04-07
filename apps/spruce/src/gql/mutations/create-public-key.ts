import { gql } from "@apollo/client";

const CREATE_PUBLIC_KEY = gql`
  mutation CreatePublicKey($publicKeyInput: PublicKeyInput!) {
    createPublicKey(publicKeyInput: $publicKeyInput) {
      key
      name
    }
  }
`;

export default CREATE_PUBLIC_KEY;
