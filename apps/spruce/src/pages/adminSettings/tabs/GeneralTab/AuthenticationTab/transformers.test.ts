import {
  AdminSettings,
  AdminSettingsInput,
  PreferredAuthType,
} from "gql/generated/types";
import { formToGql, gqlToForm } from "./transformers";
import { AuthenticationFormState } from "./types";

describe("authentication section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(mockAdminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form)).toStrictEqual(gql);
  });
});

const mockAdminSettings: AdminSettings = {
  authConfig: {
    allowServiceUsers: true,
    backgroundReauthMinutes: 60,
    preferredType: PreferredAuthType.Github,
    okta: {
      clientId: "okta-client-id",
      clientSecret: "okta-client-secret",
      issuer: "https://example.okta.com",
      userGroup: "evg-users",
      expireAfterMinutes: 480,
      scopes: ["openid", "profile", "email"],
    },
    naive: {
      users: [
        {
          displayName: "Test User",
          email: "test@example.com",
          password: "password123",
          username: "testuser",
        },
        {
          displayName: "Admin User",
          email: "admin@example.com",
          password: "admin123",
          username: "admin",
        },
      ],
    },
    github: {
      appId: 12345,
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
      defaultOwner: "evergreen-ci",
      defaultRepo: "evergreen",
      organization: "evergreen-ci",
      users: ["user1", "user2", "admin"],
    },
    multi: {
      readWrite: ["admin", "developer"],
      readOnly: ["viewer", "guest"],
    },
    kanopy: {
      headerName: "X-Auth-Token",
      issuer: "https://kanopy.example.com",
      keysetURL: "https://kanopy.example.com/.well-known/jwks.json",
    },
    oauth: {
      clientId: "oauth-client-id",
      connectorId: "oauth-connector-id",
      issuer: "https://oauth.example.com",
    },
  },
  disabledGQLQueries: [],
};

const form: AuthenticationFormState = {
  authentication: {
    globalConfig: {
      allowServiceUsers: true,
      backgroundReauthMinutes: 60,
      preferredType: PreferredAuthType.Github,
    },
    okta: {
      clientId: "okta-client-id",
      clientSecret: "okta-client-secret",
      issuer: "https://example.okta.com",
      userGroup: "evg-users",
      expireAfterMinutes: 480,
      scopes: ["openid", "profile", "email"],
    },
    naive: {
      users: [
        {
          displayName: "Test User",
          email: "test@example.com",
          password: "password123",
          username: "testuser",
        },
        {
          displayName: "Admin User",
          email: "admin@example.com",
          password: "admin123",
          username: "admin",
        },
      ],
    },
    github: {
      appId: 12345,
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
      defaultOwner: "evergreen-ci",
      defaultRepo: "evergreen",
      organization: "evergreen-ci",
      users: ["user1", "user2", "admin"],
    },
    multi: {
      readWrite: ["admin", "developer"],
      readOnly: ["viewer", "guest"],
    },
    kanopy: {
      headerName: "X-Auth-Token",
      issuer: "https://kanopy.example.com",
      keysetURL: "https://kanopy.example.com/.well-known/jwks.json",
    },
    oauth: {
      clientId: "oauth-client-id",
      connectorId: "oauth-connector-id",
      issuer: "https://oauth.example.com",
    },
  },
};

const gql: AdminSettingsInput = {
  authConfig: {
    allowServiceUsers: true,
    backgroundReauthMinutes: 60,
    github: {
      appId: 12345,
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
      defaultOwner: "evergreen-ci",
      defaultRepo: "evergreen",
      organization: "evergreen-ci",
      users: ["user1", "user2", "admin"],
    },
    kanopy: {
      headerName: "X-Auth-Token",
      issuer: "https://kanopy.example.com",
      keysetURL: "https://kanopy.example.com/.well-known/jwks.json",
    },
    oauth: {
      clientId: "oauth-client-id",
      connectorId: "oauth-connector-id",
      issuer: "https://oauth.example.com",
    },
    multi: {
      readOnly: ["viewer", "guest"],
      readWrite: ["admin", "developer"],
    },
    naive: {
      users: [
        {
          displayName: "Test User",
          email: "test@example.com",
          password: "password123",
          username: "testuser",
        },
        {
          displayName: "Admin User",
          email: "admin@example.com",
          password: "admin123",
          username: "admin",
        },
      ],
    },
    okta: {
      clientId: "okta-client-id",
      clientSecret: "okta-client-secret",
      expireAfterMinutes: 480,
      issuer: "https://example.okta.com",
      userGroup: "evg-users",
      scopes: ["openid", "profile", "email"],
    },
    preferredType: PreferredAuthType.Github,
  },
};
