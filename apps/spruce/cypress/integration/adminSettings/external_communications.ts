import { clickSave } from "../../utils";

describe("external communications", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Navigate to External Communications tab if it exists
    cy.contains("External Communications").click();

    // JIRA section
    cy.dataCy("jira").within(() => {
      cy.getInputByLabel("Email").as("jiraEmailInput");
      cy.get("@jiraEmailInput").clear();
      cy.get("@jiraEmailInput").type("test@example.com");

      const jiraHost = "Host";
      cy.getInputByLabel(jiraHost).as("jiraHostInput");
      cy.get("@jiraHostInput").clear();
      cy.get("@jiraHostInput").type("jira.test.com");

      const jiraPat = "Personal Access Token";
      cy.getInputByLabel(jiraPat).as("jiraPat");
      cy.get("@jiraPat").clear();
      cy.get("@jiraPat").type("password");
    });

    // Slack section.
    cy.dataCy("slack").within(() => {
      const slackToken = "Token";
      cy.getInputByLabel(slackToken).as("slackTokenInput");
      cy.get("@slackTokenInput").clear();
      cy.get("@slackTokenInput").type("xoxb-test-token");

      const slackAppName = "App Name";
      cy.getInputByLabel(slackAppName).as("slackAppNameInput");
      cy.get("@slackAppNameInput").clear();
      cy.get("@slackAppNameInput").type("test-app");

      const slackChannel = "Channel";
      cy.getInputByLabel(slackChannel).as("slackChannelInput");
      cy.get("@slackChannelInput").clear();
      cy.get("@slackChannelInput").type("#test-channel");

      const slackFieldsSet = "Fields To Set";
      cy.getInputByLabel(slackFieldsSet).as("slackFieldsSetInput");
      cy.get("@slackFieldsSetInput").type("field1{enter}");
      cy.get("@slackFieldsSetInput").type("field2{enter}");
    });

    // Splunk section.
    cy.dataCy("splunk").within(() => {
      const splunkServerUrl = "Server URL";
      cy.getInputByLabel(splunkServerUrl).as("splunkServerUrlInput");
      cy.get("@splunkServerUrlInput").clear();
      cy.get("@splunkServerUrlInput").type("splunk.test.com");

      const splunkChannel = "Channel";
      cy.getInputByLabel(splunkChannel).as("splunkChannelInput");
      cy.get("@splunkChannelInput").clear();
      cy.get("@splunkChannelInput").type("test-logs");
    });

    // // Runtime Environments section.
    cy.dataCy("runtime-environments").within(() => {
      const runtimeBaseUrl = "Base URL";
      cy.getInputByLabel(runtimeBaseUrl).as("runtimeBaseUrlInput");
      cy.get("@runtimeBaseUrlInput").clear();
      cy.get("@runtimeBaseUrlInput").type("runtime.test.com");
    });
    // // Test Selection section.
    cy.dataCy("test-selection").within(() => {
      const testSelectionUrl = "URL";
      cy.getInputByLabel(testSelectionUrl).as("testSelectionUrlInput");
      cy.get("@testSelectionUrlInput").clear();
      cy.get("@testSelectionUrlInput").type("testselection.test.com");
    });

    // // FWS section.
    cy.dataCy("fws").within(() => {
      const fwsUrl = "URL";
      cy.getInputByLabel(fwsUrl).as("fwsUrlInput");
      cy.get("@fwsUrlInput").clear();
      cy.get("@fwsUrlInput").type("fws.test.com");
    });

    // // Cedar section.
    cy.dataCy("cedar").within(() => {
      const cedarDbUrl = "Database URL";
      cy.getInputByLabel(cedarDbUrl).as("cedarDbUrlInput");
      cy.get("@cedarDbUrlInput").clear();
      cy.get("@cedarDbUrlInput").type("cedar-db.test.com");

      const cedarDbName = "Database Name";
      cy.getInputByLabel(cedarDbName).as("cedarDbNameInput");
      cy.get("@cedarDbNameInput").clear();
      cy.get("@cedarDbNameInput").type("test-cedar-db");

      const cedarSpsUrl = "SPS URL (Vanity, for hosts only)";
      cy.getInputByLabel(cedarSpsUrl).as("cedarSpsUrlInput");
      cy.get("@cedarSpsUrlInput").clear();
      cy.get("@cedarSpsUrlInput").type("sps.test.com");

      const cedarSpsKanopyUrl = "SPS Kanopy URL";
      cy.getInputByLabel(cedarSpsKanopyUrl).as("cedarSpsKanopyUrlInput");
      cy.get("@cedarSpsKanopyUrlInput").clear();
      cy.get("@cedarSpsKanopyUrlInput").type("sps-kanopy.test.com");
    });

    // Sage section.
    cy.dataCy("sage").within(() => {
      const sageBaseUrl = "Base URL";
      cy.getInputByLabel(sageBaseUrl).as("sageBaseUrlInput");
      cy.get("@sageBaseUrlInput").clear();
      cy.get("@sageBaseUrlInput").type("sage.test.com");
    });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");

    cy.reload();

    // Verify all changes were saved.
    // JIRA section.
    cy.dataCy("jira").within(() => {
      cy.getInputByLabel("Email").should("have.value", "test@example.com");
      cy.getInputByLabel("Host").should("have.value", "jira.test.com");
    });

    // Slack section.
    cy.dataCy("slack").within(() => {
      cy.getInputByLabel("Token").should("have.value", "xoxb-test-token");
      cy.getInputByLabel("App Name").should("have.value", "test-app");
      cy.getInputByLabel("Channel").should("have.value", "#test-channel");

      // Check chip inputs for fields set.
      cy.dataCy("filter-chip").should("have.length", 2);
      cy.contains("field1").should("exist");
      cy.contains("field2").should("exist");
    });

    // Splunk section.
    cy.dataCy("splunk").within(() => {
      cy.getInputByLabel("Server URL").should("have.value", "splunk.test.com");
      cy.getInputByLabel("Channel").should("have.value", "test-logs");
    });

    // Runtime Environments section.
    cy.dataCy("runtime-environments").within(() => {
      cy.getInputByLabel("Base URL").should("have.value", "runtime.test.com");
    });

    // Test Selection section.
    cy.dataCy("test-selection").within(() => {
      cy.getInputByLabel("URL").should("have.value", "testselection.test.com");
    });

    // FWS section.
    cy.dataCy("fws").within(() => {
      cy.getInputByLabel("URL").should("have.value", "fws.test.com");
    });

    // Cedar section.
    cy.dataCy("cedar").within(() => {
      cy.getInputByLabel("Database URL").should(
        "have.value",
        "cedar-db.test.com",
      );
      cy.getInputByLabel("Database Name").should("have.value", "test-cedar-db");
      cy.getInputByLabel("SPS URL (Vanity, for hosts only)").should(
        "have.value",
        "sps.test.com",
      );
      cy.getInputByLabel("SPS Kanopy URL").should(
        "have.value",
        "sps-kanopy.test.com",
      );
    });

    // Sage section.
    cy.dataCy("sage").within(() => {
      cy.getInputByLabel("Base URL").should("have.value", "sage.test.com");
    });
  });
});
