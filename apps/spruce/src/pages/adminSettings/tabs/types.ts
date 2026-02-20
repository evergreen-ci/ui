import { AdminSettingsGeneralSection } from "constants/routes";
import { AdminSettingsInput, AdminSettingsQuery } from "gql/generated/types";
import { AnnouncementsFormState } from "./GeneralTab/AnnouncementsTab/types";
import { AuthenticationFormState } from "./GeneralTab/AuthenticationTab/types";
import { BackgroundProcessingFormState } from "./GeneralTab/BackgroundProcessingTab/types";
import { ExternalCommunicationsFormState } from "./GeneralTab/ExternalCommunicationsTab/types";
import { OtherFormState } from "./GeneralTab/OtherTab/types";
import { ProvidersFormState } from "./GeneralTab/ProvidersTab/types";
import { RunnersFormState } from "./GeneralTab/RunnersTab/types";
import { WebFormState } from "./GeneralTab/WebTab/types";

export type AdminSettingsData = NonNullable<
  AdminSettingsQuery["adminSettings"]
>;

const { ...WritableAdminSettingsTabs } = AdminSettingsGeneralSection;
export { WritableAdminSettingsTabs };

export type WritableAdminSettingsType =
  (typeof WritableAdminSettingsTabs)[keyof typeof WritableAdminSettingsTabs];

export type FormStateMap = {
  [T in WritableAdminSettingsType]: {
    [AdminSettingsGeneralSection.Announcements]: AnnouncementsFormState;
    [AdminSettingsGeneralSection.Runners]: RunnersFormState;
    [AdminSettingsGeneralSection.Web]: WebFormState;
    [AdminSettingsGeneralSection.Authentication]: AuthenticationFormState;
    [AdminSettingsGeneralSection.ExternalCommunications]: ExternalCommunicationsFormState;
    [AdminSettingsGeneralSection.BackgroundProcessing]: BackgroundProcessingFormState;
    [AdminSettingsGeneralSection.Providers]: ProvidersFormState;
    [AdminSettingsGeneralSection.Other]: OtherFormState;
  }[T];
};

export type FormStates = FormStateMap[WritableAdminSettingsType];

export type FormToGqlFunction<T extends WritableAdminSettingsType> = (
  form: FormStateMap[T],
  data?: AdminSettingsData, // Use if you need access to other admin settings fields.
) => AdminSettingsInput;

export type GqlToFormFunction<T extends WritableAdminSettingsType> = (
  data: AdminSettingsData,
) => FormStateMap[T] | null;
