import { ApolloLink, Observable } from "@apollo/client";
import {
  SentryBreadcrumbTypes,
  leaveBreadcrumb,
} from "@evg-ui/lib/utils/errorReporting";
import { deleteNestedKey } from "@evg-ui/lib/utils/object";

export const leaveBreadcrumbMapFn =
  (operation: ApolloLink.Operation, secretFields: string[]) =>
  (response: ApolloLink.Result) => {
    leaveBreadcrumb(
      "Graphql Request",
      {
        errors: response.errors,
        operationName: operation.operationName,
        status: !response.errors ? "OK" : "ERROR",
        variables: deleteNestedKey(
          operation.variables,
          secretFields,
          "REDACTED",
        ),
      },
      SentryBreadcrumbTypes.HTTP,
    );
    return response;
  };

export const logGQLToSentryLink = (secretFields: string[]): ApolloLink =>
  new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        const subscription = forward(operation).subscribe({
          complete: observer.complete.bind(observer),
          error: observer.error.bind(observer),
          next: (result) => {
            observer.next(
              leaveBreadcrumbMapFn(operation, secretFields)(result),
            );
          },
        });
        return () => subscription.unsubscribe();
      }),
  );
