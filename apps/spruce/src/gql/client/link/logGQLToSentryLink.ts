import { ApolloLink, Observable } from "@apollo/client";
import {
  leaveBreadcrumb,
  SentryBreadcrumbTypes,
  deleteNestedKey,
} from "@evg-ui/lib/utils";

export const leaveBreadcrumbMapFn =
  (operation: ApolloLink.Operation, secretFields: string[]) =>
  (response: ApolloLink.Result) => {
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
      SentryBreadcrumbTypes.HTTP,
    );
    return response;
  };

export const logGQLToSentryLink = (secretFields: string[]): ApolloLink =>
  new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        const subscription = forward(operation).subscribe({
          next: (result) => {
            observer.next(
              leaveBreadcrumbMapFn(operation, secretFields)(result),
            );
          },
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
        return () => subscription.unsubscribe();
      }),
  );
