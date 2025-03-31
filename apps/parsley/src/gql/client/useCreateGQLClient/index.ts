import { useEffect, useState } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import {
  SentryBreadcrumbTypes,
  leaveBreadcrumb,
} from "@evg-ui/lib/utils/errorReporting";
import {
  fetchWithRetry,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import { logGQLErrorsLink, retryLink } from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { SecretFieldsQuery } from "gql/generated/types";
import { graphqlURL } from "utils/environmentVariables";

export const useCreateGQLClient = ():
  | ApolloClient<NormalizedCacheObject>
  | undefined => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthProviderContext();
  const [gqlClient, setGQLClient] =
    useState<ApolloClient<NormalizedCacheObject>>();

  const [secretFields, setSecretFields] = useState<string[]>();

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
          SentryBreadcrumbTypes.HTTP,
        );
        if (shouldLogoutAndRedirect(err?.cause?.statusCode)) {
          logoutAndRedirect();
        }
      });
  }, [logoutAndRedirect, dispatchAuthenticated]);

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
