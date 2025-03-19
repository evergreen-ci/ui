import { useEffect, useState } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import {
  fetchWithRetry,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useAuthContext } from "context/auth";
import { logGQLErrorsLink, retryLink } from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { SecretFieldsQuery } from "gql/generated/types";
import { graphqlURL, isDevelopmentBuild } from "utils/environmentVariables";

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
          SentryBreadcrumbTypes.HTTP,
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
