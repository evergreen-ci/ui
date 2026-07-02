import { AdminSettingsInput } from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formToGql, gqlToForm } from "./transformers";
import { WebFormState } from "./types";

describe("WebTab transformers", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(adminSettings)).toEqual(form);
  });
  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form)).toEqual(gql);
  });
});

const form: WebFormState = {
  web: {
    api: {
      httpListenAddr: "http://localhost:8080",
      url: "http://localhost:9090",
      corpUrl: "http://corp.example.com",
    },
    ui: {
      url: "http://ui.example.com",
      uiv2Url: "http://uiv2.example.com",
      parsleyUrl: "http://parsley.example.com",
      httpListenAddr: "http://localhost:8081",
      secret: "supersecret",
      defaultProject: "default",
      corsOrigins: ["http://example.com"],
      fileStreamingContentTypes: ["application/json"],
      loginDomain: "example.com",
      userVoice: "http://uservoice.example.com",
      csrfKey: "csrf-secret-key",
      cacheTemplates: true,
      stagingEnvironment: "staging",
    },
    betaFeatures: {},
    disabledGQLQueries: {
      queryNames: ["query1", "query2"],
    },
    rateLimitConfig: {
      restLimits: {
        restUserPerHour: 0,
        restUserBurst: 0,
        restServicePerHour: 0,
        restServiceBurst: 0,
      },
      graphqlLimits: {
        graphqlUserPerHour: 0,
        graphqlUserBurst: 0,
        graphqlServicePerHour: 0,
        graphqlServiceBurst: 0,
      },
      graphqlComplexity: {
        graphqlComplexityLimit: 0,
      },
      elevatedUsers: {
        elevatedUserIds: [],
      },
    },
  },
};

const gql: AdminSettingsInput = {
  api: {
    httpListenAddr: "http://localhost:8080",
    url: "http://localhost:9090",
    corpUrl: "http://corp.example.com",
  },
  ui: {
    url: "http://ui.example.com",
    uiv2Url: "http://uiv2.example.com",
    parsleyUrl: "http://parsley.example.com",
    httpListenAddr: "http://localhost:8081",
    secret: "supersecret",
    defaultProject: "default",
    corsOrigins: ["http://example.com"],
    fileStreamingContentTypes: ["application/json"],
    loginDomain: "example.com",
    userVoice: "http://uservoice.example.com",
    csrfKey: "csrf-secret-key",
    cacheTemplates: true,
    stagingEnvironment: "staging",
    betaFeatures: {},
  },
  disabledGQLQueries: ["query1", "query2"],
  rateLimit: {
    restUserPerHour: 0,
    restUserBurst: 0,
    restServicePerHour: 0,
    restServiceBurst: 0,
    graphqlUserPerHour: 0,
    graphqlUserBurst: 0,
    graphqlServicePerHour: 0,
    graphqlServiceBurst: 0,
    graphqlComplexityLimit: 0,
    elevatedUserIds: [],
  },
};
