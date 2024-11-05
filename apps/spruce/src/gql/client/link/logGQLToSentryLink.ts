import { Operation, FetchResult, ApolloLink } from "@apollo/client";
import { deleteNestedKey } from "@evg-ui/lib/utils/object";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";

export const leaveBreadcrumbMapFn =
  (operation: Operation, secretFields: string[]) => (response: FetchResult) => {
    leaveBreadcrumb(
      "Graphql Request",
      {
        operationName: operation.operationName,
        variables: deleteNestedKey(
          operation.variables,
          secretFields,
          "REDACTED",
        ),
        status: !response.errors ? "OK" : "ERROR",
        errors: response.errors,
      },
      SentryBreadcrumb.HTTP,
    );
    return response;
  };

export const logGQLToSentryLink = (secretFields: string[]): ApolloLink =>
  new ApolloLink((operation, forward) =>
    forward(operation).map(leaveBreadcrumbMapFn(operation, secretFields)),
  );
