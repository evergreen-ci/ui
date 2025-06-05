import { AdminSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = AdminSettingsTabRoutes.FeatureFlags;

const defaultServices = {
  dispatchtasks: false,
  largeparserprojects: false,
  createandprovisionhosts: false,
  createandprovisionpods: false,
  monitorhostsandtasks: false,
  startagentsonhosts: false,
  scheduletasks: false,
  hostallocator: false,
  autorestartsystemfailures: false,
  allocatepodsforcontainertasks: false,
  cleanupunrecognizedpods: false,
  cloudprovidercleanup: false,
};

const defaultNotifications = {
  processnotificationevents: false,
  alertforspawnhostexpiration: false,
  sendjiranotifications: false,
  sendslacknotifications: false,
  sendemailnotifications: false,
  sendwebhooknotifications: false,
  sendgithubprstatusnotifications: false,
};

const defaultFeatures = {
  trackgithubrepositories: false,
  testgithubpullrequests: false,
  cpudegradedmode: false,
  globalgithubtoken: false,
  checkblockedtasks: false,
  persisttaskandtestlogs: false,
  updatecli: false,
  unexpirablehostsleepschedule: false,
};

const defaultBatchJobs = {
  collectbackgroundstatistics: false,
  cachehistoricalstatistics: false,
  backgrounddatacleanup: false,
};

export const gqlToForm = ((data) => {
  if (!data) {
    return {
      services: defaultServices,
      notifications: defaultNotifications,
      features: defaultFeatures,
      batchJobs: defaultBatchJobs,
      disabledGqlQueries: [],
    };
  }
  return {
    services: defaultServices,
    notifications: defaultNotifications,
    features: defaultFeatures,
    batchJobs: defaultBatchJobs,
    disabledGqlQueries: [],
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (() => ({})) satisfies FormToGqlFunction<Tab>;
