import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), ".env-cmdrc.json");
const production = {
  BUCKET: process.env.BUCKET,
  DEPLOYS_EMAIL: process.env.DEPLOYS_EMAIL,
  NEW_RELIC_ACCOUNT_ID: process.env.NEW_RELIC_ACCOUNT_ID,
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,
  NEW_RELIC_TRUST_KEY: process.env.NEW_RELIC_TRUST_KEY,
  PARSLEY_NEW_RELIC_AGENT_ID: process.env.PARSLEY_NEW_RELIC_AGENT_ID,
  PARSLEY_NEW_RELIC_APPLICATION_ID:
    process.env.PARSLEY_NEW_RELIC_APPLICATION_ID,
  PARSLEY_SENTRY_AUTH_TOKEN: process.env.PARSLEY_SENTRY_AUTH_TOKEN,
  REACT_APP_EVERGREEN_URL: "https://evergreen.mongodb.com",
  REACT_APP_GRAPHQL_URL: "https://evergreen.mongodb.com/graphql/query",
  REACT_APP_LOGKEEPER_URL: "https://logkeeper2.build.10gen.cc",
  REACT_APP_PARSLEY_SENTRY_DSN: process.env.REACT_APP_PARSLEY_SENTRY_DSN,
  REACT_APP_PARSLEY_URL: "https://parsley.mongodb.com",
  REACT_APP_RELEASE_STAGE: "production",
  REACT_APP_SPRUCE_URL: "https://spruce.mongodb.com",
};

fs.writeFile(file, JSON.stringify({ production }), (err) => {
  if (err) {
    console.error(err);
    throw new Error("Error while creating .env-cmdrc.json file");
  }
});
