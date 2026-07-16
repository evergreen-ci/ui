import { AdminSettingsInput, PreferredAuthType } from "gql/generated/types";
import { AdminSettingsData } from "pages/adminSettings/tabs/types";
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

const mockAdminSettings: AdminSettingsData = {
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
    oauth: {
      clientId: "oauth-client-id",
      connectorId: "oauth-connector-id",
      issuer: "https://oauth.example.com",
    },
    okta: {
      clientId: "okta-client-id",
      clientSecret: "okta-client-secret",
      expireAfterMinutes: 480,
      issuer: "https://example.okta.com",
      scopes: ["openid", "profile", "email"],
      userGroup: "evg-users",
    },
    preferredType: PreferredAuthType.Github,
  },
  disabledGQLQueries: [],
};

const form: AuthenticationFormState = {
  authentication: {
    github: {
      appId: 12345,
      clientId: "github-client-id",
      clientSecret: "github-client-secret",
      defaultOwner: "evergreen-ci",
      defaultRepo: "evergreen",
      organization: "evergreen-ci",
      users: ["user1", "user2", "admin"],
    },
    globalConfig: {
      allowServiceUsers: true,
      backgroundReauthMinutes: 60,
      preferredType: PreferredAuthType.Github,
    },
    kanopy: {
      headerName: "X-Auth-Token",
      issuer: "https://kanopy.example.com",
      keysetURL: "https://kanopy.example.com/.well-known/jwks.json",
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
    oauth: {
      clientId: "oauth-client-id",
      connectorId: "oauth-connector-id",
      issuer: "https://oauth.example.com",
    },
    okta: {
      clientId: "okta-client-id",
      clientSecret: "okta-client-secret",
      expireAfterMinutes: 480,
      issuer: "https://example.okta.com",
      scopes: ["openid", "profile", "email"],
      userGroup: "evg-users",
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
    oauth: {
      clientId: "oauth-client-id",
      connectorId: "oauth-connector-id",
      issuer: "https://oauth.example.com",
    },
    okta: {
      clientId: "okta-client-id",
      clientSecret: "okta-client-secret",
      expireAfterMinutes: 480,
      issuer: "https://example.okta.com",
      scopes: ["openid", "profile", "email"],
      userGroup: "evg-users",
    },
    preferredType: PreferredAuthType.Github,
  },
};
