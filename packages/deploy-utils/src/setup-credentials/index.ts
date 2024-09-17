import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { TargetEnvironment } from "../utils/types";

export const setupCredentials = (target: TargetEnvironment) => {
  const filePath = join(process.cwd(), ".env-cmdrc.json");

  const envJson = JSON.parse(readFileSync(filePath, "utf8"));

  const envVars = {
    ...envJson[target],
    ...base[target],
  };

  writeFileSync(filePath, JSON.stringify({ [target]: envVars }));
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
    REACT_APP_HONEYCOMB_ENDPOINT: process.env.HONEYCOMB_ENDPOINT_STAGING,
    REACT_APP_HONEYCOMB_INGEST_KEY: process.env.HONEYCOMB_INGEST_KEY_STAGING,
  },
  beta: {
    ...sharedKeys,
  },
  production: {
    ...sharedKeys,
    REACT_APP_DEPLOYS_EMAIL: "evergreen-deploys@10gen.com",
    REACT_APP_HONEYCOMB_ENDPOINT: process.env.HONEYCOMB_ENDPOINT_PROD,
    REACT_APP_HONEYCOMB_INGEST_KEY: process.env.HONEYCOMB_INGEST_KEY_PROD,
  },
};
