import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.Web;

export const gqlToForm = ((data) => {
  if (!data) return null;
  const { api, disabledGQLQueries, rateLimit, ui } = data;
  const { corpUrl, httpListenAddr: apiHttpListenAddr, url: apiUrl } = api ?? {};

  const {
    cacheTemplates,
    corsOrigins,
    csrfKey,
    defaultProject,
    fileStreamingContentTypes,
    httpListenAddr: uiHttpListenAddr,
    loginDomain,
    parsleyUrl,
    secret,
    stagingEnvironment,
    uiv2Url,
    url: uiUrl,
    userVoice,
  } = ui ?? {};

  return {
    web: {
      api: {
        corpUrl: corpUrl ?? "",
        httpListenAddr: apiHttpListenAddr ?? "",
        url: apiUrl ?? "",
      },
      betaFeatures: {},
      disabledGQLQueries: {
        queryNames: disabledGQLQueries ?? [],
      },
      rateLimitConfig: {
        elevatedUsers: {
          elevatedUserIds: rateLimit?.elevatedUserIds ?? [],
        },
        graphqlComplexity: {
          graphqlComplexityLimit: rateLimit?.graphqlComplexityLimit ?? 0,
        },
        graphqlLimits: {
          graphqlServiceBurst: rateLimit?.graphqlServiceBurst ?? 0,
          graphqlServicePerHour: rateLimit?.graphqlServicePerHour ?? 0,
          graphqlUserBurst: rateLimit?.graphqlUserBurst ?? 0,
          graphqlUserPerHour: rateLimit?.graphqlUserPerHour ?? 0,
        },
        restLimits: {
          restServiceBurst: rateLimit?.restServiceBurst ?? 0,
          restServicePerHour: rateLimit?.restServicePerHour ?? 0,
          restUserBurst: rateLimit?.restUserBurst ?? 0,
          restUserPerHour: rateLimit?.restUserPerHour ?? 0,
        },
      },
      ui: {
        cacheTemplates: cacheTemplates ?? false,
        corsOrigins: corsOrigins ?? [],
        csrfKey: csrfKey ?? "",
        defaultProject: defaultProject ?? "",
        fileStreamingContentTypes: fileStreamingContentTypes ?? [],
        httpListenAddr: uiHttpListenAddr ?? "",
        loginDomain: loginDomain ?? "",
        parsleyUrl: parsleyUrl ?? "",
        secret: secret ?? "",
        stagingEnvironment: stagingEnvironment ?? "",
        uiv2Url: uiv2Url ?? "",
        url: uiUrl ?? "",
        userVoice: userVoice ?? "",
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ web }) => {
  const { api, betaFeatures, disabledGQLQueries, rateLimitConfig, ui } = web;
  return {
    api,
    disabledGQLQueries: disabledGQLQueries.queryNames,
    rateLimit: {
      elevatedUserIds: rateLimitConfig.elevatedUsers.elevatedUserIds,
      graphqlComplexityLimit:
        rateLimitConfig.graphqlComplexity.graphqlComplexityLimit,
      graphqlServiceBurst: rateLimitConfig.graphqlLimits.graphqlServiceBurst,
      graphqlServicePerHour:
        rateLimitConfig.graphqlLimits.graphqlServicePerHour,
      graphqlUserBurst: rateLimitConfig.graphqlLimits.graphqlUserBurst,
      graphqlUserPerHour: rateLimitConfig.graphqlLimits.graphqlUserPerHour,
      restServiceBurst: rateLimitConfig.restLimits.restServiceBurst,
      restServicePerHour: rateLimitConfig.restLimits.restServicePerHour,
      restUserBurst: rateLimitConfig.restLimits.restUserBurst,
      restUserPerHour: rateLimitConfig.restLimits.restUserPerHour,
    },
    ui: {
      ...ui,
      betaFeatures,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
