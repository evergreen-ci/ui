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
    betaFeatures: {
      parsleyAIEnabled: true,
    },
    disabledGQLQueries: {
      queryNames: ["query1", "query2"],
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
    betaFeatures: {
      parsleyAIEnabled: true,
    },
  },
  disabledGQLQueries: ["query1", "query2"],
};
