import { OperationDefinitionNode } from "graphql";
import { gql } from "@apollo/client";

const SECRET_FIELDS = gql`
  query SecretFields {
    secretFields
  }
`;

export const secretFieldsReq: RequestInit = {
  body: JSON.stringify({
    operationName: (SECRET_FIELDS.definitions[0] as OperationDefinitionNode)
      ?.name?.value,
    query: SECRET_FIELDS.loc?.source.body,
    variables: {},
  }),
  credentials: "include" as RequestCredentials,
  headers: {
    "content-type": "application/json",
  },
  method: "POST",
  mode: "cors" as RequestMode,
};
