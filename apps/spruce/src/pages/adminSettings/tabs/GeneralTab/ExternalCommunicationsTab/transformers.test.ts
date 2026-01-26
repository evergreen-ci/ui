import {
  AdminSettings,
  AdminSettingsInput,
  PriorityLevel,
} from "gql/generated/types";
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
  jira: {
    email: "jira@example.com",
    host: "jira.example.com",
    personalAccessToken: "jira-token",
  },
  slack: {
    token: "slack-token",
    name: "slack-app",
    level: PriorityLevel.Warning,
    channel: "#evergreen",
    hostname: "slack.example.com",
    optionsName: "slack-options",
    username: "evg-bot",
    basicMetadata: true,
    fields: false,
    allFields: true,
    fieldsSet: ["field1", "field2"],
  },
  splunk: {
    splunkConnectionInfo: {
      serverUrl: "splunk.example.com",
      token: "splunk-token",
      channel: "evergreen",
    },
  },
  runtimeEnvironments: {
    baseUrl: "runtime.example.com",
    apiKey: "runtime-api-key",
  },
  testSelection: {
    url: "testselection.example.com",
  },
  fws: {
    url: "fws.example.com",
  },
  graphite: {
    ciOptimizationToken: "graphite-token",
    serverUrl: "graphite.example.com",
  },
  cedar: {
    dbUrl: "cedar-db.example.com",
    dbName: "cedar-db",
    spsUrl: "sps.example.com",
    spsKanopyUrl: "sps-kanopy.example.com",
  },
  sage: {
    baseUrl: "https://sage.devprod.prod.corp.mongodb.com",
  },
};

const gql: AdminSettingsInput = {
  jira: {
    email: "jira@example.com",
    host: "jira.example.com",
    personalAccessToken: "jira-token",
  },
  slack: {
    token: "slack-token",
    name: "slack-app",
    level: PriorityLevel.Warning,
    options: {
      channel: "#evergreen",
      hostname: "slack.example.com",
      name: "slack-options",
      username: "evg-bot",
      basicMetadata: true,
      fields: false,
      allFields: true,
      fieldsSet: {
        field1: true,
        field2: true,
      },
    },
  },
  splunk: {
    splunkConnectionInfo: {
      serverUrl: "splunk.example.com",
      token: "splunk-token",
      channel: "evergreen",
    },
  },
  runtimeEnvironments: {
    baseUrl: "runtime.example.com",
    apiKey: "runtime-api-key",
  },
  testSelection: {
    url: "testselection.example.com",
  },
  fws: {
    url: "fws.example.com",
  },
  graphite: {
    ciOptimizationToken: "graphite-token",
    serverUrl: "graphite.example.com",
  },
  cedar: {
    dbUrl: "cedar-db.example.com",
    dbName: "cedar-db",
  },
  perfMonitoringURL: "sps.example.com",
  perfMonitoringKanopyURL: "sps-kanopy.example.com",
  sage: {
    baseUrl: "https://sage.devprod.prod.corp.mongodb.com",
  },
};

const mockAdminSettings: AdminSettings = {
  disabledGQLQueries: [],
  jira: {
    email: "jira@example.com",
    host: "jira.example.com",
    personalAccessToken: "jira-token",
  },
  slack: {
    token: "slack-token",
    name: "slack-app",
    level: PriorityLevel.Warning,
    options: {
      channel: "#evergreen",
      hostname: "slack.example.com",
      name: "slack-options",
      username: "evg-bot",
      basicMetadata: true,
      fields: false,
      allFields: true,
      fieldsSet: {
        field1: true,
        field2: true,
      },
    },
  },
  splunk: {
    splunkConnectionInfo: {
      serverUrl: "splunk.example.com",
      token: "splunk-token",
      channel: "evergreen",
    },
  },
  runtimeEnvironments: {
    baseUrl: "runtime.example.com",
    apiKey: "runtime-api-key",
  },
  testSelection: {
    url: "testselection.example.com",
  },
  fws: {
    url: "fws.example.com",
  },
  graphite: {
    ciOptimizationToken: "graphite-token",
    serverUrl: "graphite.example.com",
  },
  cedar: {
    dbUrl: "cedar-db.example.com",
    dbName: "cedar-db",
  },
  perfMonitoringURL: "sps.example.com",
  perfMonitoringKanopyURL: "sps-kanopy.example.com",
  sage: {
    baseUrl: "https://sage.devprod.prod.corp.mongodb.com",
  },
};
