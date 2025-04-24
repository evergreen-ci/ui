import { AdminSettingsTabRoutes } from "constants/routes";
import { AdminSettings } from "gql/generated/types";
import { EventLogsFormState } from "./EventLogsTab/types";
import { GeneralFormState } from "./GeneralTab/types";
import { RestartTasksFormState } from "./RestartTasksTab/types";

const { EventLogs, RestartTasks, ...WritableAdminSettingsTabs } =
  AdminSettingsTabRoutes;
export { WritableAdminSettingsTabs };

export type WritableAdminSettingsType =
  (typeof WritableAdminSettingsTabs)[keyof typeof WritableAdminSettingsTabs];

export type FormStateMap = {
  [T in WritableAdminSettingsType]: {
    [AdminSettingsTabRoutes.General]: GeneralFormState;
    [AdminSettingsTabRoutes.RestartTasks]: RestartTasksFormState;
    [AdminSettingsTabRoutes.EventLogs]: EventLogsFormState;
  }[T];
};

export type FormToGqlFunction<T extends WritableAdminSettingsType> = (
  form: FormStateMap[T],
) => AdminSettings;

export type GqlToFormFunction<T extends WritableAdminSettingsType> = (
  data: AdminSettings,
) => FormStateMap[T];
