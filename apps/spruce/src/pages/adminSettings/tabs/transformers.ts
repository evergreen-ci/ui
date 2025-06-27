import { AdminSettingsTabRoutes } from "constants/routes";
import * as announcements from "./GeneralTab/AnnouncementsTab/transformers";
import * as authentication from "./GeneralTab/AuthenticationTab/transformers";
import * as backgroundProcessing from "./GeneralTab/BackgroundProcessingTab/transformers";
import * as externalCommunications from "./GeneralTab/ExternalCommunicationsTab/transformers";
import * as featureFlags from "./GeneralTab/FeatureFlagsTab/transformers";
import * as other from "./GeneralTab/OtherTab/transformers";
import * as providers from "./GeneralTab/ProvidersTab/transformers";
import * as runners from "./GeneralTab/RunnersTab/transformers";
import * as web from "./GeneralTab/WebTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableAdminSettingsType,
} from "./types";

export const formToGqlMap: {
  [T in WritableAdminSettingsType]: FormToGqlFunction<T>;
} = {
  [AdminSettingsTabRoutes.Announcements]: announcements.formToGql,
  [AdminSettingsTabRoutes.FeatureFlags]: featureFlags.formToGql,
  [AdminSettingsTabRoutes.Runners]: runners.formToGql,
  [AdminSettingsTabRoutes.Web]: web.formToGql,
  [AdminSettingsTabRoutes.Authentication]: authentication.formToGql,
  [AdminSettingsTabRoutes.ExternalCommunications]:
    externalCommunications.formToGql,
  [AdminSettingsTabRoutes.BackgroundProcessing]: backgroundProcessing.formToGql,
  [AdminSettingsTabRoutes.Providers]: providers.formToGql,
  [AdminSettingsTabRoutes.Other]: other.formToGql,
};
export const gqlToFormMap: {
  [T in WritableAdminSettingsType]?: GqlToFormFunction<T>;
} = {
  [AdminSettingsTabRoutes.Announcements]: announcements.gqlToForm,
  [AdminSettingsTabRoutes.FeatureFlags]: featureFlags.gqlToForm,
  [AdminSettingsTabRoutes.Runners]: runners.gqlToForm,
  [AdminSettingsTabRoutes.Web]: web.gqlToForm,
  [AdminSettingsTabRoutes.Authentication]: authentication.gqlToForm,
  [AdminSettingsTabRoutes.ExternalCommunications]:
    externalCommunications.gqlToForm,
  [AdminSettingsTabRoutes.BackgroundProcessing]: backgroundProcessing.gqlToForm,
  [AdminSettingsTabRoutes.Providers]: providers.gqlToForm,
  [AdminSettingsTabRoutes.Other]: other.gqlToForm,
};
