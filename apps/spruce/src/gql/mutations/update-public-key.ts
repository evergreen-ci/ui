import { gql } from "@apollo/client";

const UPDATE_PUBLIC_KEY = gql`
  mutation UpdatePublicKey(
    $targetKeyName: String!
    $updateInfo: PublicKeyInput!
  ) {
    updatePublicKey(targetKeyName: $targetKeyName, updateInfo: $updateInfo) {
      key
      name
    }
  }
`;

export default UPDATE_PUBLIC_KEY;
