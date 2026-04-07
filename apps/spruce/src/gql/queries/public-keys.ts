import { gql } from "@apollo/client";

const PUBLIC_KEYS = gql`
  query MyPublicKeys {
    myPublicKeys {
      key
      name
    }
  }
`;

export default PUBLIC_KEYS;
