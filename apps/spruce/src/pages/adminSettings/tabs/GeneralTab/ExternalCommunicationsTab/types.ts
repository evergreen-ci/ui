import { PriorityLevel } from "gql/generated/types";

export interface ExternalCommunicationsFormState {
  jira: {
    email: string;
    host: string;
    personalAccessToken: string;
  };
  slack: {
    token: string;
    name: string;
    level: PriorityLevel;
    channel: string;
    hostname: string;
    optionsName: string;
    username: string;
    basicMetadata: boolean;
    fields: boolean;
    allFields: boolean;
    fieldsSet: string[];
  };
  splunk: {
    splunkConnectionInfo: {
      serverUrl: string;
      token: string;
      channel: string;
    };
  };
  runtimeEnvironments: {
    baseUrl: string;
    apiKey: string;
  };
  testSelection: {
    url: string;
  };
  fws: {
    url: string;
  };
  graphite: {
    ciOptimizationToken: string;
    serverUrl: string;
  };
  cedar: {
    dbUrl: string;
    dbName: string;
    spsUrl: string;
    spsKanopyUrl: string;
  };
  sage: {
    baseUrl: string;
  };
}

export type TabProps = {
  ExternalCommunicationsData: ExternalCommunicationsFormState;
};
