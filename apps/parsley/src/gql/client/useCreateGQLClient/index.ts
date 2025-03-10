import { useEffect, useState } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import {
  fetchWithRetry,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import { useAuthContext } from "context/auth";
import { logGQLErrorsLink, retryLink } from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { SecretFieldsQuery } from "gql/generated/types";
import {
  getCorpLoginURL,
  graphqlURL,
  isDevelopmentBuild,
  isRemoteEnv,
} from "utils/environmentVariables";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";

export const useCreateGQLClient = (): ApolloClient<NormalizedCacheObject> => {
  const { logoutAndRedirect } = useAuthContext();
  const [gqlClient, setGQLClient] = useState<any>();

  // SecretFields are not necessary for development builds because nothing is logged.
  const [secretFields, setSecretFields] = useState<string[] | undefined>(
    isDevelopmentBuild() ? [] : undefined,
  );

  useEffect(() => {
    fetchWithRetry<SecretFieldsQuery>(graphqlURL ?? "", secretFieldsReq)
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
        if (!isRemoteEnv() && shouldLogoutAndRedirect(err?.cause?.statusCode)) {
          logoutAndRedirect();
        } else if (getCorpLoginURL() !== "") {
          // If we can't get a response from the server, we likely hit the corp secure redirect.
          // We should manually redirect to the corp login page.
          const encodedRedirect = encodeURIComponent(window.location.href);
          window.location.href = `${getCorpLoginURL()}?redirect=${encodedRedirect}`;
        }
      });
  }, [logoutAndRedirect]);

  useEffect(() => {
    if (secretFields && !gqlClient) {
      const cache = new InMemoryCache();
      const client = new ApolloClient({
        cache,
        link: from([
          logGQLErrorsLink(secretFields),
          retryLink,
          new HttpLink({
            credentials: "include",
            uri: graphqlURL,
          }),
        ]),
      });
      setGQLClient(client);
    }
  }, [secretFields, gqlClient, logoutAndRedirect]);

  return gqlClient;
};
