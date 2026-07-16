import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.Authentication;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { authConfig } = data;
  const {
    allowServiceUsers,
    backgroundReauthMinutes,
    github,
    kanopy,
    multi,
    naive,
    oauth,
    okta,
    preferredType,
  } = authConfig ?? {};

  return {
    authentication: {
      github: {
        appId: github?.appId ?? undefined,
        clientId: github?.clientId ?? "",
        clientSecret: github?.clientSecret ?? "",
        defaultOwner: github?.defaultOwner ?? undefined,
        defaultRepo: github?.defaultRepo ?? undefined,
        organization: github?.organization ?? "",
        users: github?.users ?? [],
      },
      globalConfig: {
        allowServiceUsers: allowServiceUsers ?? false,
        backgroundReauthMinutes: backgroundReauthMinutes ?? 0,
        preferredType: preferredType ?? null,
      },
      kanopy: {
        headerName: kanopy?.headerName ?? "",
        issuer: kanopy?.issuer ?? "",
        keysetURL: kanopy?.keysetURL ?? "",
      },
      multi: {
        readOnly: multi?.readOnly ?? [],
        readWrite: multi?.readWrite ?? [],
      },
      naive: {
        users:
          naive?.users?.map((user) => ({
            displayName: user?.displayName ?? "",
            email: user?.email ?? "",
            password: user?.password ?? "",
            username: user?.username ?? "",
          })) ?? [],
      },
      oauth: {
        clientId: oauth?.clientId ?? "",
        connectorId: oauth?.connectorId ?? "",
        issuer: oauth?.issuer ?? "",
      },
      okta: {
        clientId: okta?.clientId ?? "",
        clientSecret: okta?.clientSecret ?? "",
        expireAfterMinutes: okta?.expireAfterMinutes ?? 0,
        issuer: okta?.issuer ?? "",
        scopes: okta?.scopes ?? [],
        userGroup: okta?.userGroup ?? "",
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ authentication }) => {
  if (!authentication) return {};

  const { github, globalConfig, kanopy, multi, naive, oauth, okta } =
    authentication;

  return {
    authConfig: {
      allowServiceUsers: globalConfig.allowServiceUsers,
      backgroundReauthMinutes: globalConfig.backgroundReauthMinutes,
      github: {
        appId: github.appId,
        clientId: github.clientId,
        clientSecret: github.clientSecret,
        defaultOwner: github.defaultOwner,
        defaultRepo: github.defaultRepo,
        organization: github.organization,
        users: github.users,
      },
      kanopy: {
        headerName: kanopy.headerName,
        issuer: kanopy.issuer,
        keysetURL: kanopy.keysetURL,
      },
      multi: {
        readOnly: multi.readOnly,
        readWrite: multi.readWrite,
      },
      naive: {
        users: naive.users?.map((user) => ({
          displayName: user.displayName,
          email: user.email,
          password: user.password,
          username: user.username,
        })),
      },
      oauth: {
        clientId: oauth.clientId,
        connectorId: oauth.connectorId,
        issuer: oauth.issuer,
      },
      okta: {
        clientId: okta.clientId,
        clientSecret: okta.clientSecret,
        expireAfterMinutes: okta.expireAfterMinutes,
        issuer: okta.issuer,
        scopes: okta.scopes,
        userGroup: okta.userGroup,
      },
      preferredType: globalConfig.preferredType,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
