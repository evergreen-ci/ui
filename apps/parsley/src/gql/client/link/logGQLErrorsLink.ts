import { Operation } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { deleteNestedKey } from "@evg-ui/lib/utils/object";

export const reportingFn =
  (secretFields: string[], operation: Operation) =>
  (gqlErr: GraphQLFormattedError) => {
    const fingerprint = [operation.operationName];
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
  // TODO DEVPROD-25262: Remove this when upgrading, graphQLErrors will be consolidated to error property
  onError(({ graphQLErrors, operation }) => { // eslint-disable-line
    return graphQLErrors?.forEach(reportingFn(secretFields, operation));
  });
