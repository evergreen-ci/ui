import { useEffect, useRef, useState } from "react";
import { HttpLink, ApolloClient } from "@apollo/client";
import { LocalState } from "@apollo/client/local-state";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import {
  leaveBreadcrumb,
  SentryBreadcrumbTypes,
} from "@evg-ui/lib/utils/errorReporting";
import {
  fetchWithRetry,
  getUserStagingHeader,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import { cache } from "gql/client/cache";
import {
  authenticateIfSuccessfulLink,
  authLink,
  logGQLToSentryLink,
  logGQLErrorsLink,
  retryLink,
  pausePollingLink,
} from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { SecretFieldsQuery } from "gql/generated/types";
import { getGQLUrl } from "utils/environmentVariables";

export const useCreateGQLClient = (): ApolloClient | undefined => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthProviderContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGqlClient] = useState<ApolloClient>();

  // Store auth callbacks in refs so the Apollo Client and its link chain
  // don't need to be recreated when the AuthProvider context changes.
  const dispatchAuthenticatedRef = useRef(dispatchAuthenticated);
  const logoutAndRedirectRef = useRef(logoutAndRedirect);

  useEffect(() => {
    dispatchAuthenticatedRef.current = dispatchAuthenticated;
  }, [dispatchAuthenticated]);

  useEffect(() => {
    logoutAndRedirectRef.current = logoutAndRedirect;
  }, [logoutAndRedirect]);

  useEffect(() => {
    fetchWithRetry<SecretFieldsQuery>(getGQLUrl(), secretFieldsReq)
      .then(({ data }) => {
        setSecretFields(data?.spruceConfig?.secretFields);
      })
      .catch((err) => {
        leaveBreadcrumb(
          "SecretFields Query Error",
          {
            err,
          },
          SentryBreadcrumbTypes.HTTP,
        );

        if (shouldLogoutAndRedirect(err?.cause?.statusCode)) {
          logoutAndRedirectRef.current();
        }
      });
  }, []);

  useEffect(() => {
    if (!secretFields) return;

    setGqlClient(
      new ApolloClient({
        cache,
        localState: new LocalState(), // Must define if using @client fields.
        defaultOptions: {
          watchQuery: {
            // TODO DEVPROD-26582: It's probably better to use the new default of 'true', but this avoids many errors for now.
            notifyOnNetworkStatusChange: false,
          },
        },
        link: authenticateIfSuccessfulLink(() =>
          dispatchAuthenticatedRef.current(),
        )
          .concat(authLink(() => logoutAndRedirectRef.current()))
          .concat(logGQLToSentryLink(secretFields))
          .concat(logGQLErrorsLink(secretFields))
          .concat(retryLink)
          .concat(pausePollingLink)
          .concat(
            new HttpLink({
              uri: getGQLUrl(),
              credentials: "include",
              headers: getUserStagingHeader(),
            }),
          ),
      }),
    );
  }, [secretFields]);

  return gqlClient;
};
