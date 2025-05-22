import { AdminSettingsTabRoutes } from "constants/routes";
import { AdminSettings } from "gql/generated/types";
import { AnnouncementsFormState } from "./AnnouncementsTab/types";
import { AuthenticationFormState } from "./AuthenticationTab/types";
import { BackgroundProcessingFormState } from "./BackgroundProcessingTab/types";
import { EventLogsFormState } from "./EventLogsTab/types";
import { ExternalCommunicationsFormState } from "./ExternalCommunicationsTab/types";
import { FeatureFlagsFormState } from "./FeatureFlagsTab/types";
import { OtherFormState } from "./OtherTab/types";
import { ProvidersFormState } from "./ProvidersTab/types";
import { RestartTasksFormState } from "./RestartTasksTab/types";
import { RunnersFormState } from "./RunnersTab/types";
import { WebFormState } from "./WebTab/types";

const { EventLog, RestartTasks, ...WritableAdminSettingsTabs } =
  AdminSettingsTabRoutes;
export { WritableAdminSettingsTabs };

export type WritableAdminSettingsType =
  (typeof WritableAdminSettingsTabs)[keyof typeof WritableAdminSettingsTabs];

export type FormStateMap = {
  [T in WritableAdminSettingsType]: {
    [AdminSettingsTabRoutes.Announcements]: AnnouncementsFormState;
    [AdminSettingsTabRoutes.FeatureFlags]: FeatureFlagsFormState;
    [AdminSettingsTabRoutes.Runners]: RunnersFormState;
    [AdminSettingsTabRoutes.Web]: WebFormState;
    [AdminSettingsTabRoutes.Authentication]: AuthenticationFormState;
    [AdminSettingsTabRoutes.ExternalCommunications]: ExternalCommunicationsFormState;
    [AdminSettingsTabRoutes.BackgroundProcessing]: BackgroundProcessingFormState;
    [AdminSettingsTabRoutes.Providers]: ProvidersFormState;
    [AdminSettingsTabRoutes.Other]: OtherFormState;
    [AdminSettingsTabRoutes.RestartTasks]: RestartTasksFormState;
    [AdminSettingsTabRoutes.EventLog]: EventLogsFormState;
  }[T];
};

export type FormToGqlFunction<T extends WritableAdminSettingsType> = (
  form: FormStateMap[T],
) => AdminSettings;

export type GqlToFormFunction<T extends WritableAdminSettingsType> = (
  data: AdminSettings,
) => FormStateMap[T];
