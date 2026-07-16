import { AdminSettingsInput, PriorityLevel } from "gql/generated/types";
import { AdminSettingsData } from "pages/adminSettings/tabs/types";
import { formToGql, gqlToForm } from "./transformers";
import { ExternalCommunicationsFormState } from "./types";

describe("external communications section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(mockAdminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form)).toStrictEqual(gql);
  });
});

const form: ExternalCommunicationsFormState = {
  cedar: {
    dbName: "cedar-db",
    dbUrl: "cedar-db.example.com",
    spsKanopyUrl: "sps-kanopy.example.com",
    spsUrl: "sps.example.com",
  },
  fws: {
    url: "fws.example.com",
  },
  graphite: {
    ciOptimizationToken: "graphite-token",
    serverUrl: "graphite.example.com",
  },
  jira: {
    email: "jira@example.com",
    host: "jira.example.com",
    personalAccessToken: "jira-token",
  },
  runtimeEnvironments: {
    apiKey: "runtime-api-key",
    baseUrl: "runtime.example.com",
  },
  sage: {
    baseUrl: "https://sage.devprod.prod.corp.mongodb.com",
  },
  slack: {
    allFields: true,
    basicMetadata: true,
    channel: "#evergreen",
    fields: false,
    fieldsSet: ["field1", "field2"],
    hostname: "slack.example.com",
    level: PriorityLevel.Warning,
    name: "slack-app",
    optionsName: "slack-options",
    token: "slack-token",
    username: "evg-bot",
  },
  splunk: {
    splunkConnectionInfo: {
      channel: "evergreen",
      serverUrl: "splunk.example.com",
      token: "splunk-token",
    },
  },
  testSelection: {
    url: "testselection.example.com",
  },
};

const gql: AdminSettingsInput = {
  cedar: {
    dbName: "cedar-db",
    dbUrl: "cedar-db.example.com",
  },
  fws: {
    url: "fws.example.com",
  },
  graphite: {
    ciOptimizationToken: "graphite-token",
    serverUrl: "graphite.example.com",
  },
  jira: {
    email: "jira@example.com",
    host: "jira.example.com",
    personalAccessToken: "jira-token",
  },
  perfMonitoringKanopyURL: "sps-kanopy.example.com",
  perfMonitoringURL: "sps.example.com",
  runtimeEnvironments: {
    apiKey: "runtime-api-key",
    baseUrl: "runtime.example.com",
  },
  sage: {
    baseUrl: "https://sage.devprod.prod.corp.mongodb.com",
  },
  slack: {
    level: PriorityLevel.Warning,
    name: "slack-app",
    options: {
      allFields: true,
      basicMetadata: true,
      channel: "#evergreen",
      fields: false,
      fieldsSet: {
        field1: true,
        field2: true,
      },
      hostname: "slack.example.com",
      name: "slack-options",
      username: "evg-bot",
    },
    token: "slack-token",
  },
  splunk: {
    splunkConnectionInfo: {
      channel: "evergreen",
      serverUrl: "splunk.example.com",
      token: "splunk-token",
    },
  },
  testSelection: {
    url: "testselection.example.com",
  },
};

const mockAdminSettings: AdminSettingsData = {
  cedar: {
    dbName: "cedar-db",
    dbUrl: "cedar-db.example.com",
  },
  disabledGQLQueries: [],
  fws: {
    url: "fws.example.com",
  },
  graphite: {
    ciOptimizationToken: "graphite-token",
    serverUrl: "graphite.example.com",
  },
  jira: {
    email: "jira@example.com",
    host: "jira.example.com",
    personalAccessToken: "jira-token",
  },
  perfMonitoringKanopyURL: "sps-kanopy.example.com",
  perfMonitoringURL: "sps.example.com",
  runtimeEnvironments: {
    apiKey: "runtime-api-key",
    baseUrl: "runtime.example.com",
  },
  sage: {
    baseUrl: "https://sage.devprod.prod.corp.mongodb.com",
  },
  slack: {
    level: PriorityLevel.Warning,
    name: "slack-app",
    options: {
      allFields: true,
      basicMetadata: true,
      channel: "#evergreen",
      fields: false,
      fieldsSet: {
        field1: true,
        field2: true,
      },
      hostname: "slack.example.com",
      name: "slack-options",
      username: "evg-bot",
    },
    token: "slack-token",
  },
  splunk: {
    splunkConnectionInfo: {
      channel: "evergreen",
      serverUrl: "splunk.example.com",
      token: "splunk-token",
    },
  },
  testSelection: {
    url: "testselection.example.com",
  },
};
