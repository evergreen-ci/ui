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
    sage,
    slack,
    splunk,
    testSelection,
  } = data;

  return {
    cedar: {
      dbName: cedar?.dbName ?? "",
      dbUrl: cedar?.dbUrl ?? "",
      spsKanopyUrl: data.perfMonitoringKanopyURL ?? "",
      spsUrl: data.perfMonitoringURL ?? "",
    },
    fws: {
      url: fws?.url ?? "",
    },
    graphite: {
      ciOptimizationToken: graphite?.ciOptimizationToken ?? "",
      serverUrl: graphite?.serverUrl ?? "",
    },
    jira: {
      email: jira?.email ?? "",
      host: jira?.host ?? "",
      personalAccessToken: jira?.personalAccessToken ?? "",
    },
    runtimeEnvironments: {
      apiKey: runtimeEnvironments?.apiKey ?? "",
      baseUrl: runtimeEnvironments?.baseUrl ?? "",
    },
    sage: {
      baseUrl: sage?.baseUrl ?? "",
    },
    slack: {
      allFields: slack?.options?.allFields ?? false,
      basicMetadata: slack?.options?.basicMetadata ?? false,
      channel: slack?.options?.channel ?? "",
      fields: slack?.options?.fields ?? false,
      fieldsSet: slack?.options?.fieldsSet
        ? Object.keys(slack.options.fieldsSet)
        : [],
      hostname: slack?.options?.hostname ?? "",
      level: slack?.level ?? PriorityLevel.Info,
      name: slack?.name ?? "",
      optionsName: slack?.options?.name ?? "",
      token: slack?.token ?? "",
      username: slack?.options?.username ?? "",
    },
    splunk: {
      splunkConnectionInfo: {
        channel: splunk?.splunkConnectionInfo?.channel ?? "",
        serverUrl: splunk?.splunkConnectionInfo?.serverUrl ?? "",
        token: splunk?.splunkConnectionInfo?.token ?? "",
      },
    },
    testSelection: {
      url: testSelection?.url ?? "",
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
    sage,
    slack,
    splunk,
    testSelection,
  } = form;

  return {
    cedar: {
      dbName: cedar.dbName,
      dbUrl: cedar.dbUrl,
    },
    fws: {
      url: fws.url,
    },
    graphite: {
      ciOptimizationToken: graphite.ciOptimizationToken,
      serverUrl: graphite.serverUrl,
    },
    jira: {
      email: jira.email,
      host: jira.host,
      personalAccessToken: jira.personalAccessToken,
    },
    perfMonitoringKanopyURL: cedar.spsKanopyUrl,
    perfMonitoringURL: cedar.spsUrl,
    runtimeEnvironments: {
      apiKey: runtimeEnvironments.apiKey,
      baseUrl: runtimeEnvironments.baseUrl,
    },
    sage: {
      baseUrl: sage.baseUrl || undefined,
    },
    slack: {
      level:
        slack.level &&
        Object.values(PriorityLevel).includes(slack.level as PriorityLevel)
          ? slack.level
          : undefined,
      name: slack.name,
      options: {
        allFields: slack.allFields,
        basicMetadata: slack.basicMetadata,
        channel: slack.channel,
        fields: slack.fields,
        fieldsSet: slack.fieldsSet.reduce(
          (acc, field) => {
            acc[field] = true;
            return acc;
          },
          {} as { [key: string]: boolean },
        ),
        hostname: slack.hostname,
        name: slack.optionsName,
        username: slack.username,
      },
      token: slack.token,
    },
    splunk: {
      splunkConnectionInfo: {
        channel: splunk.splunkConnectionInfo.channel,
        serverUrl: splunk.splunkConnectionInfo.serverUrl,
        token: splunk.splunkConnectionInfo.token,
      },
    },
    testSelection: {
      url: testSelection.url,
    },
  };
}) satisfies FormToGqlFunction<Tab>;
