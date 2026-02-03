import { useEffect, useMemo, useState } from "react";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { useAuthProviderContext } from "@evg-ui/lib/context";
import {
  SentryBreadcrumbTypes,
  fetchWithRetry,
  leaveBreadcrumb,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils";
import { logGQLErrorsLink, retryLink } from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { SecretFieldsQuery } from "gql/generated/types";
import { graphqlURL } from "utils/environmentVariables";

const cache = new InMemoryCache();

export const useCreateGQLClient = (): ApolloClient | undefined => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthProviderContext();
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

  const gqlClient = useMemo(() => {
    if (!secretFields) return undefined;

    return new ApolloClient({
      cache,
      link: ApolloLink.from([
        logGQLErrorsLink(secretFields),
        retryLink,
        new HttpLink({
          credentials: "include",
          uri: graphqlURL,
        }),
      ]),
    });
  }, [secretFields]);

  return gqlClient;
};
