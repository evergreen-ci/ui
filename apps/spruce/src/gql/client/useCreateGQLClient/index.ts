import { useEffect, useState, useMemo } from "react";
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
          logoutAndRedirect();
        }
      });
  }, [dispatchAuthenticated, logoutAndRedirect]);

  const gqlClient = useMemo(() => {
    if (!secretFields) return undefined;

    return new ApolloClient({
      cache,
      localState: new LocalState(), // Must define if using @client fields.
      link: authenticateIfSuccessfulLink(dispatchAuthenticated)
        .concat(authLink(logoutAndRedirect))
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
    });
  }, [secretFields, dispatchAuthenticated, logoutAndRedirect]);

  return gqlClient;
};
