import { ApolloLink, Observable } from "@apollo/client";
import { ServerError, ServerParseError } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import {
  SentryBreadcrumbTypes,
  leaveBreadcrumb,
} from "@evg-ui/lib/utils/errorReporting";
import { shouldLogoutAndRedirect } from "@evg-ui/lib/utils/request";

export { logGQLToSentryLink } from "./logGQLToSentryLink";
export { logGQLErrorsLink } from "./logGQLErrorsLink";
export { pausePollingLink } from "./pausePollingLink";

export const authLink = (logoutAndRedirect: () => void): ApolloLink =>
  new ErrorLink(({ error }) => {
    if (
      ServerParseError.is(error) &&
      shouldLogoutAndRedirect(error.statusCode)
    ) {
      leaveBreadcrumb(
        "Not Authenticated",
        { status_code: 401 },
        SentryBreadcrumbTypes.User,
      );
      logoutAndRedirect();
    }
  });

export const authenticateIfSuccessfulLink = (
  dispatchAuthenticated: () => void,
): ApolloLink =>
  new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        const subscription = forward(operation).subscribe({
          complete: observer.complete.bind(observer),
          error: observer.error.bind(observer),
          next: (response) => {
            if (response && response.data) {
              // If there is data in response, then server responded with 200; therefore, is authenticated.
              dispatchAuthenticated();
            }
            leaveBreadcrumb(
              "Graphql Request",
              {
                errors: response.errors,
                operationName: operation.operationName,
                status: !response.errors ? "OK" : "ERROR",
                variables: operation.variables,
              },
              SentryBreadcrumbTypes.HTTP,
            );
            observer.next(response);
          },
        });
        return () => subscription.unsubscribe();
      }),
  );

export const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: (error): boolean => {
      if (ServerError.is(error)) {
        // Retry for server errors (5xx).
        return error.response && error.response.status >= 500;
      }
      return false;
    },
  },
  delay: {
    initial: 300,
    jitter: true,
    max: 3000,
  },
});
