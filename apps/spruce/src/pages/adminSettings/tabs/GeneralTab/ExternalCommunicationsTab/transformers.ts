import { AdminSettingsGeneralSection } from "constants/routes";
import { PriorityLevel } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../../types";

type Tab = AdminSettingsGeneralSection.ExternalCommunications;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    cedar,
    fws,
    graphite,
    jira,
    runtimeEnvironments,
    slack,
    splunk,
    testSelection,
  } = data;

  return {
    jira: {
      email: jira?.email ?? "",
      host: jira?.host ?? "",
      personalAccessToken: jira?.personalAccessToken ?? "",
    },
    slack: {
      token: slack?.token ?? "",
      name: slack?.name ?? "",
      level: slack?.level ?? PriorityLevel.Info,
      channel: slack?.options?.channel ?? "",
      hostname: slack?.options?.hostname ?? "",
      optionsName: slack?.options?.name ?? "",
      username: slack?.options?.username ?? "",
      basicMetadata: slack?.options?.basicMetadata ?? false,
      fields: slack?.options?.fields ?? false,
      allFields: slack?.options?.allFields ?? false,
      fieldsSet: slack?.options?.fieldsSet
        ? Object.keys(slack.options.fieldsSet)
        : [],
    },
    splunk: {
      splunkConnectionInfo: {
        serverUrl: splunk?.splunkConnectionInfo?.serverUrl ?? "",
        token: splunk?.splunkConnectionInfo?.token ?? "",
        channel: splunk?.splunkConnectionInfo?.channel ?? "",
      },
    },
    runtimeEnvironments: {
      baseUrl: runtimeEnvironments?.baseUrl ?? "",
      apiKey: runtimeEnvironments?.apiKey ?? "",
    },
    testSelection: {
      url: testSelection?.url ?? "",
    },
    fws: {
      url: fws?.url ?? "",
    },
    graphite: {
      ciOptimizationToken: graphite?.ciOptimizationToken ?? "",
      serverUrl: graphite?.serverUrl ?? "",
    },
    cedar: {
      dbUrl: cedar?.dbUrl ?? "",
      dbName: cedar?.dbName ?? "",
      spsKanopyUrl: data.perfMonitoringKanopyURL ?? "",
      spsUrl: data.perfMonitoringURL ?? "",
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((form) => {
  const {
    cedar,
    fws,
    graphite,
    jira,
    runtimeEnvironments,
    slack,
    splunk,
    testSelection,
  } = form;

  return {
    jira: {
      email: jira.email,
      host: jira.host,
      personalAccessToken: jira.personalAccessToken,
    },
    slack: {
      token: slack.token,
      name: slack.name,
      level:
        slack.level &&
        Object.values(PriorityLevel).includes(slack.level as PriorityLevel)
          ? slack.level
          : undefined,
      options: {
        channel: slack.channel,
        hostname: slack.hostname,
        name: slack.optionsName,
        username: slack.username,
        basicMetadata: slack.basicMetadata,
        fields: slack.fields,
        allFields: slack.allFields,
        fieldsSet: slack.fieldsSet.reduce(
          (acc, field) => {
            acc[field] = true;
            return acc;
          },
          {} as { [key: string]: boolean },
        ),
      },
    },
    splunk: {
      splunkConnectionInfo: {
        serverUrl: splunk.splunkConnectionInfo.serverUrl,
        token: splunk.splunkConnectionInfo.token,
        channel: splunk.splunkConnectionInfo.channel,
      },
    },
    runtimeEnvironments: {
      baseUrl: runtimeEnvironments.baseUrl,
      apiKey: runtimeEnvironments.apiKey,
    },
    testSelection: {
      url: testSelection.url,
    },
    fws: {
      url: fws.url,
    },
    graphite: {
      ciOptimizationToken: graphite.ciOptimizationToken,
      serverUrl: graphite.serverUrl,
    },
    cedar: {
      dbUrl: cedar.dbUrl,
      dbName: cedar.dbName,
    },
    perfMonitoringKanopyURL: cedar.spsKanopyUrl,
    perfMonitoringURL: cedar.spsUrl,
  };
}) satisfies FormToGqlFunction<Tab>;
