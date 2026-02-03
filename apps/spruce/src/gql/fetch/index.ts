import { OperationDefinitionNode } from "graphql";
import { getUserStagingHeader } from "@evg-ui/lib/utils";
import { SECRET_FIELDS } from "gql/queries";

export const secretFieldsReq: RequestInit = {
  credentials: "include" as RequestCredentials,
  headers: {
    ...getUserStagingHeader(),
    "content-type": "application/json",
  },
  body: JSON.stringify({
    operationName: (SECRET_FIELDS.definitions[0] as OperationDefinitionNode)
      ?.name?.value,
    query: SECRET_FIELDS.loc?.source.body,
    variables: {},
  }),
  method: "POST",
  mode: "cors" as RequestMode,
};
