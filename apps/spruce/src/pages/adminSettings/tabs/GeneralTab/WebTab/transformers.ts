import { AdminSettingsGeneralSection } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.Web;

export const gqlToForm = ((data) => {
  if (!data) return null;
  const { api, disabledGQLQueries, ui } = data;
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

  const { betaFeatures } = ui ?? {};

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
        parsleyUrl: parsleyUrl ?? "",
        secret: secret ?? "",
        stagingEnvironment: stagingEnvironment ?? "",
        uiv2Url: uiv2Url ?? "",
        url: uiUrl ?? "",
        userVoice: userVoice ?? "",
      },
      betaFeatures: {
        parsleyAIEnabled: betaFeatures?.parsleyAIEnabled ?? false,
      },
      disabledGQLQueries: {
        queryNames: disabledGQLQueries ?? [],
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ web }) => {
  const { api, betaFeatures, disabledGQLQueries, ui } = web;
  const returnVal = {
    api,
    ui: {
      ...ui,
      betaFeatures,
    },
    disabledGQLQueries: disabledGQLQueries.queryNames,
  };
  return returnVal;
}) satisfies FormToGqlFunction<Tab>;
