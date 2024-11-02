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
import { graphqlURL } from "utils/environmentVariables";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";

export const useCreateGQLClient = (): ApolloClient<NormalizedCacheObject> => {
  const { logoutAndRedirect } = useAuthContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGQLClient] = useState<any>();

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
        if (shouldLogoutAndRedirect(err?.cause?.statusCode)) {
          logoutAndRedirect();
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
