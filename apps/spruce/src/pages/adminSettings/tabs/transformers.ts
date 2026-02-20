import { AdminSettingsGeneralSection } from "constants/routes";
import * as announcements from "./GeneralTab/AnnouncementsTab/transformers";
import * as authentication from "./GeneralTab/AuthenticationTab/transformers";
import * as backgroundProcessing from "./GeneralTab/BackgroundProcessingTab/transformers";
import * as externalCommunications from "./GeneralTab/ExternalCommunicationsTab/transformers";
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
  [AdminSettingsGeneralSection.Announcements]: announcements.formToGql,
  [AdminSettingsGeneralSection.Runners]: runners.formToGql,
  [AdminSettingsGeneralSection.Web]: web.formToGql,
  [AdminSettingsGeneralSection.Authentication]: authentication.formToGql,
  [AdminSettingsGeneralSection.ExternalCommunications]:
    externalCommunications.formToGql,
  [AdminSettingsGeneralSection.BackgroundProcessing]:
    backgroundProcessing.formToGql,
  [AdminSettingsGeneralSection.Providers]: providers.formToGql,
  [AdminSettingsGeneralSection.Other]: other.formToGql,
};
export const gqlToFormMap: {
  [T in WritableAdminSettingsType]?: GqlToFormFunction<T>;
} = {
  [AdminSettingsGeneralSection.Announcements]: announcements.gqlToForm,
  [AdminSettingsGeneralSection.Runners]: runners.gqlToForm,
  [AdminSettingsGeneralSection.Web]: web.gqlToForm,
  [AdminSettingsGeneralSection.Authentication]: authentication.gqlToForm,
  [AdminSettingsGeneralSection.ExternalCommunications]:
    externalCommunications.gqlToForm,
  [AdminSettingsGeneralSection.BackgroundProcessing]:
    backgroundProcessing.gqlToForm,
  [AdminSettingsGeneralSection.Providers]: providers.gqlToForm,
  [AdminSettingsGeneralSection.Other]: other.gqlToForm,
};
