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
    logUrl,
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
        httpListenAddr: apiHttpListenAddr ?? "",
        url: apiUrl ?? "",
        corpUrl: corpUrl ?? "",
      },
      ui: {
        cacheTemplates: cacheTemplates ?? false,
        corsOrigins: corsOrigins ?? [],
        csrfKey: csrfKey ?? "",
        defaultProject: defaultProject ?? "",
        fileStreamingContentTypes: fileStreamingContentTypes ?? [],
        httpListenAddr: uiHttpListenAddr ?? "",
        loginDomain: loginDomain ?? "",
        logUrl: logUrl ?? "",
        parsleyUrl: parsleyUrl ?? "",
        secret: secret ?? "",
        stagingEnvironment: stagingEnvironment ?? "",
        uiv2Url: uiv2Url ?? "",
        url: uiUrl ?? "",
        userVoice: userVoice ?? "",
      },
      betaFeatures: {},
      disabledGQLQueries: {
        queryNames: disabledGQLQueries ?? [],
      },
      rateLimitConfig: {
        restLimits: {
          restUserPerHour: rateLimit?.restUserPerHour ?? 0,
          restUserBurst: rateLimit?.restUserBurst ?? 0,
          restServicePerHour: rateLimit?.restServicePerHour ?? 0,
          restServiceBurst: rateLimit?.restServiceBurst ?? 0,
        },
        graphqlLimits: {
          graphqlUserPerHour: rateLimit?.graphqlUserPerHour ?? 0,
          graphqlUserBurst: rateLimit?.graphqlUserBurst ?? 0,
          graphqlServicePerHour: rateLimit?.graphqlServicePerHour ?? 0,
          graphqlServiceBurst: rateLimit?.graphqlServiceBurst ?? 0,
        },
        graphqlComplexity: {
          graphqlComplexityBurst: rateLimit?.graphqlComplexityBurst ?? 0,
          graphqlComplexityLimit: rateLimit?.graphqlComplexityLimit ?? 0,
          graphqlComplexityPerHour: rateLimit?.graphqlComplexityPerHour ?? 0,
        },
        elevatedUsers: {
          elevatedUserIds: rateLimit?.elevatedUserIds ?? [],
        },
        exemptUsers: {
          exemptUserIds: rateLimit?.exemptUserIds ?? [],
        },
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ web }) => {
  const { api, betaFeatures, disabledGQLQueries, rateLimitConfig, ui } = web;
  return {
    api,
    ui: {
      ...ui,
      betaFeatures,
    },
    disabledGQLQueries: disabledGQLQueries.queryNames,
    rateLimit: {
      restUserPerHour: rateLimitConfig.restLimits.restUserPerHour,
      restUserBurst: rateLimitConfig.restLimits.restUserBurst,
      restServicePerHour: rateLimitConfig.restLimits.restServicePerHour,
      restServiceBurst: rateLimitConfig.restLimits.restServiceBurst,
      graphqlUserPerHour: rateLimitConfig.graphqlLimits.graphqlUserPerHour,
      graphqlUserBurst: rateLimitConfig.graphqlLimits.graphqlUserBurst,
      graphqlServicePerHour:
        rateLimitConfig.graphqlLimits.graphqlServicePerHour,
      graphqlServiceBurst: rateLimitConfig.graphqlLimits.graphqlServiceBurst,
      graphqlComplexityBurst:
        rateLimitConfig.graphqlComplexity.graphqlComplexityBurst,
      graphqlComplexityLimit:
        rateLimitConfig.graphqlComplexity.graphqlComplexityLimit,
      graphqlComplexityPerHour:
        rateLimitConfig.graphqlComplexity.graphqlComplexityPerHour,
      elevatedUserIds: rateLimitConfig.elevatedUsers.elevatedUserIds,
      exemptUserIds: rateLimitConfig.exemptUsers.exemptUserIds,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
