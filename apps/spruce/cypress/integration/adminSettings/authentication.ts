import { clickSave } from "../../utils";

describe("authentication", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes to authentication settings", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Navigate to Authentication tab if needed
    cy.contains("Authentication").click();

    // Global Config section
    const allowServiceUsers = "Allow Service Users";
    cy.getInputByLabel(allowServiceUsers).as("allowServiceUsersCheckbox");
    cy.get("@allowServiceUsersCheckbox").check({ force: true });

    const backgroundReauth = "Background Reauthentication (Mins)";
    cy.getInputByLabel(backgroundReauth).as("backgroundReauthInput");
    cy.get("@backgroundReauthInput").clear();
    cy.get("@backgroundReauthInput").type("120");

    const preferredAuthType = "Preferred Authentication Type";
    cy.getInputByLabel(preferredAuthType).as("preferredAuthRadio");
    cy.get("@preferredAuthRadio").within(() => {
      cy.contains("Github").click();
    });

    // Okta section
    const oktaClientId = "Client ID";
    cy.dataCy("okta").within(() => {
      cy.getInputByLabel(oktaClientId).as("oktaClientIdInput");
      cy.get("@oktaClientIdInput").clear();
      cy.get("@oktaClientIdInput").type("test-okta-client-id");

      const oktaClientSecret = "Client Secret";
      cy.getInputByLabel(oktaClientSecret).as("oktaClientSecretInput");
      cy.get("@oktaClientSecretInput").clear();
      cy.get("@oktaClientSecretInput").type("test-okta-client-secret");

      const oktaIssuer = "Issuer";
      cy.getInputByLabel(oktaIssuer).as("oktaIssuerInput");
      cy.get("@oktaIssuerInput").clear();
      cy.get("@oktaIssuerInput").type("https://test.okta.com");

      const oktaUserGroup = "User Group";
      cy.getInputByLabel(oktaUserGroup).as("oktaUserGroupInput");
      cy.get("@oktaUserGroupInput").clear();
      cy.get("@oktaUserGroupInput").type("test-users");

      const oktaExpireAfter = "Expire After (Mins)";
      cy.getInputByLabel(oktaExpireAfter).as("oktaExpireAfterInput");
      cy.get("@oktaExpireAfterInput").clear();
      cy.get("@oktaExpireAfterInput").type("480");

      const oktaScopes = "Scopes";
      cy.getInputByLabel(oktaScopes).as("oktaScopesInput");
      cy.get("@oktaScopesInput").type("openid{enter}");
      cy.get("@oktaScopesInput").type("profile{enter}");
      cy.get("@oktaScopesInput").type("email{enter}");
    });

    // GitHub section
    cy.dataCy("github").within(() => {
      const githubAppId = "App ID";
      cy.getInputByLabel(githubAppId).as("githubAppIdInput");
      cy.get("@githubAppIdInput").clear();
      cy.get("@githubAppIdInput").type("54321");

      const githubClientId = "Client ID";
      cy.getInputByLabel(githubClientId).as("githubClientIdInput");
      cy.get("@githubClientIdInput").clear();
      cy.get("@githubClientIdInput").type("test-github-client-id");

      const githubClientSecret = "Client Secret";
      cy.getInputByLabel(githubClientSecret).as("githubClientSecretInput");
      cy.get("@githubClientSecretInput").clear();
      cy.get("@githubClientSecretInput").type("test-github-client-secret");

      const githubDefaultOwner = "Default Owner";
      cy.getInputByLabel(githubDefaultOwner).as("githubDefaultOwnerInput");
      cy.get("@githubDefaultOwnerInput").clear();
      cy.get("@githubDefaultOwnerInput").type("test-owner");

      const githubDefaultRepo = "Default Repository";
      cy.getInputByLabel(githubDefaultRepo).as("githubDefaultRepoInput");
      cy.get("@githubDefaultRepoInput").clear();
      cy.get("@githubDefaultRepoInput").type("test-repo");

      const githubOrganization = "Organization";
      cy.getInputByLabel(githubOrganization).as("githubOrganizationInput");
      cy.get("@githubOrganizationInput").clear();
      cy.get("@githubOrganizationInput").type("test-org");

      const githubUsers = "Users";
      cy.getInputByLabel(githubUsers).as("githubUsersInput");
      cy.get("@githubUsersInput").type("testuser1{enter}");
      cy.get("@githubUsersInput").type("testuser2{enter}");
    });

    // Naive section
    cy.dataCy("naive").within(() => {
      cy.get('[data-cy="add-button"]').as("naiveUsersSection");
      cy.contains("Add").click();
      cy.get('[id="root_authentication_naive_users"]')
        .children()
        .first()
        .within(() => {
          cy.getInputByLabel("Display Name").type("Test User 1");
          cy.getInputByLabel("Email").type("test1@example.com");
          cy.getInputByLabel("Password").type("password123");
          cy.getInputByLabel("Username").type("testuser1");
        });
    });

    // Multi section
    cy.dataCy("multi-read-write").click();
    cy.dataCy("multi-read-write-options").within(() => {
      cy.getInputByLabel("Okta").check({ force: true });
    });
    cy.dataCy("multi-read-write").click({ force: true });

    cy.dataCy("multi-read-only").click();
    cy.dataCy("multi-read-only-options").within(() => {
      cy.getInputByLabel("Naive").check({ force: true });
    });
    cy.dataCy("multi-read-only").click({ force: true });

    // Kanopy section
    cy.dataCy("kanopy").within(() => {
      const kanopyHeaderName = "Header Name";
      cy.getInputByLabel(kanopyHeaderName).as("kanopyHeaderNameInput");
      cy.get("@kanopyHeaderNameInput").clear();
      cy.get("@kanopyHeaderNameInput").type("X-Test-Auth-Token");

      const kanopyIssuer = "Issuer";
      cy.getInputByLabel(kanopyIssuer).as("kanopyIssuerInput");
      cy.get("@kanopyIssuerInput").clear();
      cy.get("@kanopyIssuerInput").type("https://test-kanopy.example.com");

      const kanopyKeysetURL = "Keyset URL";
      cy.getInputByLabel(kanopyKeysetURL).as("kanopyKeysetURLInput");
      cy.get("@kanopyKeysetURLInput").clear();
      cy.get("@kanopyKeysetURLInput").type(
        "https://test-kanopy.example.com/.well-known/jwks.json",
      );
    });

    // OAuth section
    cy.dataCy("oauth").within(() => {
      const oauthClientId = "Client ID";
      cy.getInputByLabel(oauthClientId).as("oauthClientIdInput");
      cy.get("@oauthClientIdInput").clear();
      cy.get("@oauthClientIdInput").type("oauth-client-id");

      const oauthIssuer = "Issuer";
      cy.getInputByLabel(oauthIssuer).as("oauthIssuerInput");
      cy.get("@oauthIssuerInput").clear();
      cy.get("@oauthIssuerInput").type("https://test-oauth.example.com");

      const oauthConnectorId = "Connector ID";
      cy.getInputByLabel(oauthConnectorId).as("oauthConnectorIdInput");
      cy.get("@oauthConnectorIdInput").clear();
      cy.get("@oauthConnectorIdInput").type("oauth-connector-id");
    });

    // Save the changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify all changes were saved correctly
    // Navigate to Authentication tab again after reload
    cy.contains("Authentication").click();

    // Verify Global Config
    cy.getInputByLabel(allowServiceUsers).as("allowServiceUsersCheckbox");
    cy.get("@allowServiceUsersCheckbox").should("be.checked");

    cy.getInputByLabel(backgroundReauth).as("backgroundReauthInput");
    cy.get("@backgroundReauthInput").should("have.value", "120");

    // Verify Okta settings
    cy.dataCy("okta").within(() => {
      cy.getInputByLabel("Client ID").should(
        "have.value",
        "test-okta-client-id",
      );
      cy.getInputByLabel("Client Secret").should(
        "have.value",
        "test-okta-client-secret",
      );
      cy.getInputByLabel("Issuer").should(
        "have.value",
        "https://test.okta.com",
      );
      cy.getInputByLabel("User Group").should("have.value", "test-users");
      cy.getInputByLabel("Expire After (Mins)").should("have.value", "480");

      // Verify scopes chips
      cy.dataCy("filter-chip").should("have.length", 3);
      cy.contains("openid").should("exist");
      cy.contains("profile").should("exist");
      cy.contains("email").should("exist");
    });

    // Verify GitHub settings
    cy.dataCy("github").within(() => {
      cy.getInputByLabel("App ID").should("have.value", "54321");
      cy.getInputByLabel("Client ID").should(
        "have.value",
        "test-github-client-id",
      );
      cy.getInputByLabel("Client Secret").should(
        "have.value",
        "test-github-client-secret",
      );
      cy.getInputByLabel("Default Owner").should("have.value", "test-owner");
      cy.getInputByLabel("Default Repository").should(
        "have.value",
        "test-repo",
      );
      cy.getInputByLabel("Organization").should("have.value", "test-org");

      // Verify users chips
      cy.dataCy("filter-chip").should("have.length", 2);
      cy.get("span[data-cy=filter-chip]").contains("testuser1");
      cy.get("span[data-cy=filter-chip]").contains("testuser2");
    });

    // Verify Naive user was added
    cy.dataCy("naive").within(() => {
      cy.getInputByLabel("Display Name")
        .first()
        .should("have.value", "Test User 1");
      cy.getInputByLabel("Email")
        .first()
        .should("have.value", "test1@example.com");
      cy.getInputByLabel("Password")
        .first()
        .should("have.value", "password123");
      cy.getInputByLabel("Username").first().should("have.value", "testuser1");
    });

    // Verify Multi settings
    cy.dataCy("multi-read-write").click();
    cy.dataCy("multi-read-write-options").within(() => {
      cy.getInputByLabel("Okta").should("be.checked");
    });
    cy.dataCy("multi-read-write").click({ force: true });
    cy.dataCy("multi-read-only").click();
    cy.dataCy("multi-read-only-options").within(() => {
      cy.getInputByLabel("Naive").should("be.checked");
    });
    cy.dataCy("multi-read-only").click({ force: true });

    // Verify Kanopy settings
    cy.dataCy("kanopy").within(() => {
      cy.getInputByLabel("Header Name").should(
        "have.value",
        "X-Test-Auth-Token",
      );
      cy.getInputByLabel("Issuer").should(
        "have.value",
        "https://test-kanopy.example.com",
      );
      cy.getInputByLabel("Keyset URL").should(
        "have.value",
        "https://test-kanopy.example.com/.well-known/jwks.json",
      );
    });

    // Verify OAuth settings
    cy.dataCy("oauth").within(() => {
      cy.getInputByLabel("Client ID").should("have.value", "oauth-client-id");
      cy.getInputByLabel("Issuer").should(
        "have.value",
        "https://test-oauth.example.com",
      );
      cy.getInputByLabel("Connector ID").should(
        "have.value",
        "oauth-connector-id",
      );
    });
  });
});
