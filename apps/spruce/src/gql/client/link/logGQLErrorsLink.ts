import { Operation } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { reportError } from "utils/errorReporting";
import { deleteNestedKey } from "utils/object";

export const reportingFn =
  (secretFields: string[], operation: Operation) => (gqlErr: GraphQLError) => {
    const fingerprint = [operation.operationName];
    const path = gqlErr?.path?.map((v) => v.toString());
    if (path) {
      fingerprint.push(...path);
    }

    const isValidationError =
      gqlErr.extensions?.code ===
      ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED;

    const err = isValidationError
      ? new GraphQLError(
          `GraphQL validation error in '${operation.operationName}': ${gqlErr.message}`,
        )
      : new Error(
          `Error occurred in '${operation.operationName}': ${gqlErr.message}`,
        );

    const sendError = reportError(err, {
      fingerprint,
      tags: { operationName: operation.operationName },
      context: {
        gqlErr,
        variables: deleteNestedKey(
          operation.variables,
          secretFields,
          "REDACTED",
        ),
      },
    });

    if (isValidationError) {
      sendError.severe();
    } else {
      sendError.warning();
    }
  };

export const logGQLErrorsLink = (secretFields: string[]) =>
  onError(({ graphQLErrors, operation }) =>
    graphQLErrors?.forEach(reportingFn(secretFields, operation)),
  );
