import { ApolloLink, ServerParseError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import {
  leaveBreadcrumb,
  SentryBreadcrumbTypes,
} from "@evg-ui/lib/utils/errorReporting";
import { shouldLogoutAndRedirect } from "@evg-ui/lib/utils/request";

export { logGQLToSentryLink } from "./logGQLToSentryLink";
export { logGQLErrorsLink } from "./logGQLErrorsLink";
export { pausePollingLink } from "./pausePollingLink";

export const authLink = (logoutAndRedirect: () => void): ApolloLink =>
  // TODO DEVPROD-25262: Remove this eslint-disable when upgrading to Apollo Client 4.0 - networkError will be consolidated to error property

  onError(({ networkError }) => {
    if (
      shouldLogoutAndRedirect((networkError as ServerParseError)?.statusCode)
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
  new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      if (response && response.data) {
        // if there is data in response then server responded with 200; therefore, is authenticated.
        dispatchAuthenticated();
      }
      leaveBreadcrumb(
        "Graphql Request",
        {
          operationName: operation.operationName,
          variables: operation.variables,
          status: !response.errors ? "OK" : "ERROR",
          errors: response.errors,
        },
        SentryBreadcrumbTypes.HTTP,
      );
      return response;
    }),
  );

export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error): boolean =>
      error && error.response && error.response.status >= 500,
  },
});
