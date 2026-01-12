import { ApolloLink } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { deleteNestedKey } from "@evg-ui/lib/utils/object";

export const reportingFn =
  (secretFields: string[], operation: ApolloLink.Operation) =>
  (gqlErr: GraphQLFormattedError) => {
    const fingerprint: string[] = [];
    if (operation.operationName) {
      fingerprint.push(operation.operationName);
    }
    const path = gqlErr?.path?.map((v) => v.toString());
    if (path) {
      fingerprint.push(...path);
    }

    // Look for ApolloServerErrorCode magic string
    // https://github.com/apollographql/apollo-server/blob/265dda9d96265ca2aa81ed1e18b326ee21fe18a2/packages/server/src/errors/index.ts#L6
    const isValidationError =
      gqlErr.extensions?.code === "GRAPHQL_VALIDATION_FAILED";

    const err = isValidationError
      ? new GraphQLError(
          `GraphQL validation error in '${operation.operationName}': ${gqlErr.message}`,
        )
      : new Error(
          `Error occurred in '${operation.operationName}': ${gqlErr.message}`,
        );

    const sendError = reportError(err, {
      context: {
        gqlErr,
        variables: deleteNestedKey(
          operation.variables,
          secretFields,
          "REDACTED",
        ),
      },
      fingerprint,
      tags: { operationName: operation.operationName },
    });

    if (isValidationError) {
      sendError.severe();
    } else {
      sendError.warning();
    }
  };

export const logGQLErrorsLink = (secretFields: string[]) =>
  new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(() => reportingFn(secretFields, operation));
    }
  });
