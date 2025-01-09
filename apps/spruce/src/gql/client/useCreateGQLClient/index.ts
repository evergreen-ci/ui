import { useEffect, useState } from "react";
import { HttpLink, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  fetchWithRetry,
  getUserStagingHeader,
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

const { getGQLUrl } = environmentVariables;

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
          .concat(authLink(logoutAndRedirect))
          .concat(logGQLToSentryLink(secretFields))
          .concat(logGQLErrorsLink(secretFields))
          .concat(retryLink)
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
