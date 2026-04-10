import { gql } from "@apollo/client";

export const SECRET_FIELDS = gql`
  query SecretFields {
    spruceConfig {
      secretFields
    }
  }
`;
