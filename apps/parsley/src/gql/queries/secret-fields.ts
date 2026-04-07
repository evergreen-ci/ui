import { gql } from "@apollo/client";

const SECRET_FIELDS = gql`
  query SecretFields {
    spruceConfig {
      secretFields
    }
  }
`;

export default SECRET_FIELDS;
