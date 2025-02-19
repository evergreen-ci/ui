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
import { getCorpLoginURL } from "utils/environmentVariables";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";

const { getGQLUrl } = environmentVariables;

export const useCreateGQLClient = ():
  | ApolloClient<NormalizedCacheObject>
  | undefined => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthDispatchContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGQLClient] =
    useState<ApolloClient<NormalizedCacheObject>>();

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
        } else if (getCorpLoginURL() !== "") {
          // If we can't get a response from the server, we likely hit the corp secure redirect.
          // We should manually redirect to the corp login page.
          const encodedRedirect = encodeURIComponent(window.location.href);
          window.location.href = `${getCorpLoginURL}?redirect=${encodedRedirect}`;
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
