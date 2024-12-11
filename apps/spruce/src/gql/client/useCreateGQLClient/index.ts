import { useEffect, useState } from "react";
import { HttpLink, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  fetchWithRetry,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import { useAuthDispatchContext } from "context/Auth";
import { cache } from "gql/client/cache";
import {
  authenticateIfSuccessfulLink,
  authLink,
  logGQLToSentryLink,
  logGQLErrorsLink,
  retryLink,
} from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { SecretFieldsQuery } from "gql/generated/types";
import { environmentVariables } from "utils";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";

const { getGQLUrl, isStaging } = environmentVariables;

const setStagingLink = setContext(() =>
  isStaging() && process.env.REACT_APP_USER_KEY
    ? {
        headers: { "X-Evergreen-Environment": process.env.REACT_APP_USER_KEY },
      }
    : {},
);

export const useCreateGQLClient = (): ApolloClient<NormalizedCacheObject> => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthDispatchContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGQLClient] = useState<any>();

  useEffect(() => {
    fetchWithRetry<SecretFieldsQuery>(getGQLUrl(), secretFieldsReq)
      .then(({ data }) => {
        dispatchAuthenticated();
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
          .concat(setStagingLink)
          .concat(authLink(logoutAndRedirect))
          .concat(logGQLToSentryLink(secretFields))
          .concat(logGQLErrorsLink(secretFields))
          .concat(retryLink)
          .concat(
            new HttpLink({
              uri: getGQLUrl(),
              credentials: "include",
            }),
          ),
      });
      setGQLClient(client);
    }
  }, [secretFields, gqlClient, dispatchAuthenticated, logoutAndRedirect]);

  return gqlClient;
};
