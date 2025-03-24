import { useEffect, useState } from "react";
import { HttpLink, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
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
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";

export const useCreateGQLClient = ():
  | ApolloClient<NormalizedCacheObject>
  | undefined => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthProviderContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGQLClient] =
    useState<ApolloClient<NormalizedCacheObject>>();

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
          SentryBreadcrumb.HTTP,
        );

        if (shouldLogoutAndRedirect(err?.cause?.statusCode)) {
          logoutAndRedirect();
        }
      });
  }, [dispatchAuthenticated, logoutAndRedirect]);

  useEffect(() => {
    if (secretFields && !gqlClient) {
      const client = new ApolloClient({
        cache,
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
      setGQLClient(client);
    }
  }, [secretFields, gqlClient, dispatchAuthenticated, logoutAndRedirect]);

  return gqlClient;
};
