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
      globalConfig: {
        allowServiceUsers: allowServiceUsers ?? false,
        backgroundReauthMinutes: backgroundReauthMinutes ?? 0,
        preferredType: preferredType ?? null,
      },
      okta: {
        clientId: okta?.clientId ?? "",
        clientSecret: okta?.clientSecret ?? "",
        issuer: okta?.issuer ?? "",
        userGroup: okta?.userGroup ?? "",
        expireAfterMinutes: okta?.expireAfterMinutes ?? 0,
        scopes: okta?.scopes ?? [],
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
      github: {
        appId: github?.appId ?? undefined,
        clientId: github?.clientId ?? "",
        clientSecret: github?.clientSecret ?? "",
        defaultOwner: github?.defaultOwner ?? undefined,
        defaultRepo: github?.defaultRepo ?? undefined,
        organization: github?.organization ?? "",
        users: github?.users ?? [],
      },
      multi: {
        readWrite: multi?.readWrite ?? [],
        readOnly: multi?.readOnly ?? [],
      },
      kanopy: {
        headerName: kanopy?.headerName ?? "",
        issuer: kanopy?.issuer ?? "",
        keysetURL: kanopy?.keysetURL ?? "",
      },
      oauth: {
        clientId: oauth?.clientId ?? "",
        connectorId: oauth?.connectorId ?? "",
        issuer: oauth?.issuer ?? "",
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
      oauth: {
        clientId: oauth.clientId,
        connectorId: oauth.connectorId,
        issuer: oauth.issuer,
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
      okta: {
        clientId: okta.clientId,
        clientSecret: okta.clientSecret,
        expireAfterMinutes: okta.expireAfterMinutes,
        issuer: okta.issuer,
        userGroup: okta.userGroup,
        scopes: okta.scopes,
      },
      preferredType: globalConfig.preferredType,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
