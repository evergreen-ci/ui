import { writeFileSync } from "fs";
import { join } from "path";
import { TargetEnvironment } from "../utils/types";

export const setupCredentials = (target: TargetEnvironment) => {
  const file = join(process.cwd(), ".env-cmdrc.json");
  const envVars = {
    ...base[target],
    BUCKET: process.env.BUCKET,
    REACT_APP_RELEASE_STAGE: target,
  };

  writeFileSync(file, JSON.stringify({ [target]: envVars }));
};

const sharedKeys = {
  NODE_ENV: "production",

  PARSLEY_SENTRY_AUTH_TOKEN: process.env.PARSLEY_SENTRY_AUTH_TOKEN,
  REACT_APP_PARSLEY_SENTRY_DSN: process.env.REACT_APP_PARSLEY_SENTRY_DSN,

  REACT_APP_SPRUCE_SENTRY_DSN: process.env.REACT_APP_SPRUCE_SENTRY_DSN,
  SPRUCE_SENTRY_AUTH_TOKEN: process.env.SPRUCE_SENTRY_AUTH_TOKEN,
};

const base: Record<TargetEnvironment, Record<string, string | undefined>> = {
  staging: {
    ...sharedKeys,
    REACT_APP_API_URL: "https://evergreen-staging.corp.mongodb.com/api",
    REACT_APP_EVERGREEN_URL: "https://evergreen-staging.corp.mongodb.com",

    // TODO: Deduplicate Spruce and Parsley vars
    REACT_APP_GRAPHQL_URL:
      "https://evergreen-staging.corp.mongodb.com/graphql/query",
    REACT_APP_GQL_URL:
      "https://evergreen-staging.corp.mongodb.com/graphql/query",

    REACT_APP_HONEYCOMB_BASE_URL:
      "https://ui.honeycomb.io/mongodb-4b/environments/staging",
    REACT_APP_HONEYCOMB_ENDPOINT: process.env.HONEYCOMB_ENDPOINT_STAGING,
    REACT_APP_HONEYCOMB_INGEST_KEY: process.env.HONEYCOMB_INGEST_KEY_STAGING,
    REACT_APP_LOGKEEPER_URL: "https://logkeeper2.staging.build.10gen.cc",
    REACT_APP_PARSLEY_URL: "https://parsley-staging.corp.mongodb.com",
    REACT_APP_SPRUCE_URL: "https://spruce-staging.corp.mongodb.com",
    REACT_APP_UI_URL: "https://evergreen-staging.corp.mongodb.com",
  },
  beta: {
    ...sharedKeys,
    REACT_APP_API_URL: "https://evergreen.mongodb.com/api",
    REACT_APP_EVERGREEN_URL: "https://evergreen.mongodb.com",

    // TODO: Deduplicate Spruce and Parsley vars
    REACT_APP_GRAPHQL_URL: "https://evergreen.mongodb.com/graphql/query",
    REACT_APP_GQL_URL: "https://evergreen.mongodb.com/graphql/query",

    REACT_APP_HONEYCOMB_BASE_URL:
      "https://ui.honeycomb.io/mongodb-4b/environments/production",
    REACT_APP_LOGKEEPER_URL: "https://logkeeper2.build.10gen.cc",
    REACT_APP_PARSLEY_URL: "https://parsley-beta.corp.mongodb.com",
    REACT_APP_SIGNAL_PROCESSING_URL:
      "https://performance-monitoring-and-analysis.server-tig.prod.corp.mongodb.com",
    REACT_APP_UI_URL: "https://evergreen.mongodb.com",
  },
  production: {
    ...sharedKeys,
    REACT_APP_API_URL: "https://evergreen.mongodb.com/api",
    REACT_APP_DEPLOYS_EMAIL: "evergreen-deploys@10gen.com",
    REACT_APP_EVERGREEN_URL: "https://evergreen.mongodb.com",

    // TODO: Deduplicate Spruce and Parsley vars
    REACT_APP_GRAPHQL_URL: "https://evergreen.mongodb.com/graphql/query",
    REACT_APP_GQL_URL: "https://evergreen.mongodb.com/graphql/query",

    REACT_APP_HONEYCOMB_BASE_URL:
      "https://ui.honeycomb.io/mongodb-4b/environments/production",
    REACT_APP_HONEYCOMB_ENDPOINT: process.env.HONEYCOMB_ENDPOINT_PROD,
    REACT_APP_HONEYCOMB_INGEST_KEY: process.env.HONEYCOMB_INGEST_KEY_PROD,
    REACT_APP_LOGKEEPER_URL: "https://logkeeper2.build.10gen.cc",
    REACT_APP_PARSLEY_URL: "https://parsley.mongodb.com",
    REACT_APP_SIGNAL_PROCESSING_URL:
      "https://performance-monitoring-and-analysis.server-tig.prod.corp.mongodb.com",
    REACT_APP_SPRUCE_URL: "https://spruce.mongodb.com",
    REACT_APP_UI_URL: "https://evergreen.mongodb.com",
  },
};
