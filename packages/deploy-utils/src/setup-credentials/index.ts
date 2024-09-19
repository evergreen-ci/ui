import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { TargetEnvironment } from "../utils/types";

export const setupCredentials = (target: TargetEnvironment) => {
  const filePath = join(process.cwd(), ".env-cmdrc.json");

  const envJson = JSON.parse(readFileSync(filePath, "utf8"));

  const envVars = {
    ...envJson[target],
    ...sharedKeys,
  };

  writeFileSync(filePath, JSON.stringify({ [target]: envVars }));
};

const sharedKeys = {
  NODE_ENV: "production",

  PARSLEY_SENTRY_AUTH_TOKEN: process.env.PARSLEY_SENTRY_AUTH_TOKEN,
  REACT_APP_PARSLEY_SENTRY_DSN: process.env.REACT_APP_PARSLEY_SENTRY_DSN,

  REACT_APP_SPRUCE_SENTRY_DSN: process.env.REACT_APP_SPRUCE_SENTRY_DSN,
  SPRUCE_SENTRY_AUTH_TOKEN: process.env.SPRUCE_SENTRY_AUTH_TOKEN,

  REACT_APP_HONEYCOMB_ENDPOINT: process.env.REACT_APP_HONEYCOMB_ENDPOINT,
  REACT_APP_HONEYCOMB_INGEST_KEY: process.env.REACT_APP_HONEYCOMB_INGEST_KEY,
};
