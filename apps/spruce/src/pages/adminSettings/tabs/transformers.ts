import { AdminSettingsTabRoutes } from "constants/routes";
import * as announcements from "./AnnouncementsTab/transformers";
import * as authentication from "./AuthenticationTab/transformers";
import * as backgroundProcessing from "./BackgroundProcessingTab/transformers";
import * as externalCommunications from "./ExternalCommunicationsTab/transformers";
import * as featureFlags from "./FeatureFlagsTab/transformers";
import * as other from "./OtherTab/transformers";
import * as providers from "./ProvidersTab/transformers";
import * as runners from "./RunnersTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableAdminSettingsType,
} from "./types";
import * as web from "./WebTab/transformers";

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
};
