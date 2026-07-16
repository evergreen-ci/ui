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
      corpUrl: "http://corp.example.com",
      httpListenAddr: "http://localhost:8080",
      url: "http://localhost:9090",
    },
    betaFeatures: {},
    disabledGQLQueries: {
      queryNames: ["query1", "query2"],
    },
    rateLimitConfig: {
      elevatedUsers: {
        elevatedUserIds: [],
      },
      graphqlComplexity: {
        graphqlComplexityLimit: 0,
      },
      graphqlLimits: {
        graphqlServiceBurst: 0,
        graphqlServicePerHour: 0,
        graphqlUserBurst: 0,
        graphqlUserPerHour: 0,
      },
      restLimits: {
        restServiceBurst: 0,
        restServicePerHour: 0,
        restUserBurst: 0,
        restUserPerHour: 0,
      },
    },
    ui: {
      cacheTemplates: true,
      corsOrigins: ["http://example.com"],
      csrfKey: "csrf-secret-key",
      defaultProject: "default",
      fileStreamingContentTypes: ["application/json"],
      httpListenAddr: "http://localhost:8081",
      loginDomain: "example.com",
      parsleyUrl: "http://parsley.example.com",
      secret: "supersecret",
      stagingEnvironment: "staging",
      uiv2Url: "http://uiv2.example.com",
      url: "http://ui.example.com",
      userVoice: "http://uservoice.example.com",
    },
  },
};

const gql: AdminSettingsInput = {
  api: {
    corpUrl: "http://corp.example.com",
    httpListenAddr: "http://localhost:8080",
    url: "http://localhost:9090",
  },
  disabledGQLQueries: ["query1", "query2"],
  rateLimit: {
    elevatedUserIds: [],
    graphqlComplexityLimit: 0,
    graphqlServiceBurst: 0,
    graphqlServicePerHour: 0,
    graphqlUserBurst: 0,
    graphqlUserPerHour: 0,
    restServiceBurst: 0,
    restServicePerHour: 0,
    restUserBurst: 0,
    restUserPerHour: 0,
  },
  ui: {
    betaFeatures: {},
    cacheTemplates: true,
    corsOrigins: ["http://example.com"],
    csrfKey: "csrf-secret-key",
    defaultProject: "default",
    fileStreamingContentTypes: ["application/json"],
    httpListenAddr: "http://localhost:8081",
    loginDomain: "example.com",
    parsleyUrl: "http://parsley.example.com",
    secret: "supersecret",
    stagingEnvironment: "staging",
    uiv2Url: "http://uiv2.example.com",
    url: "http://ui.example.com",
    userVoice: "http://uservoice.example.com",
  },
};
