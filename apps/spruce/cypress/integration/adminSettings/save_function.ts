import { clickSave } from "../../utils";

describe("admin settings save properly", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("saves changes in each section independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial values for all settings sections
    const configDir = "Config Directory";
    cy.getInputByLabel(configDir).as("configDirInput");
    cy.get("@configDirInput").clear();
    cy.get("@configDirInput").type("/test/config/dir");
    cy.getInputByLabel("GitHub Organizations").type("testorg{enter}");

    const financeFormula = "Finance Formula";
    cy.getInputByLabel(financeFormula).as("financeFormulaInput");
    cy.get("@financeFormulaInput").clear();
    cy.get("@financeFormulaInput").type("0.75");

    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("Default Log Bucket").as("logBucketInput");
      cy.get("@logBucketInput").clear();
      cy.get("@logBucketInput").type("test-logs");
    });

    cy.dataCy("ssh-pairs").within(() => {
      cy.getInputByLabel("Legacy SSH Key").as("sshKeyInput");
      cy.get("@sshKeyInput").clear();
      cy.get("@sshKeyInput").type("/test/ssh/key");
    });

    cy.dataCy("expansions-list").within(() => {
      cy.contains("Add").click();
      cy.getInputByLabel("Key").type("TEST_KEY");
      cy.getInputByLabel("Value").type("test_value");
    });

    cy.dataCy("host-jasper").within(() => {
      cy.getInputByLabel("Binary Name").as("binaryNameInput");
      cy.get("@binaryNameInput").clear();
      cy.get("@binaryNameInput").type("test-jasper");
    });

    cy.getInputByLabel("Total Spawn Hosts Per User").as("spawnHostInput");
    cy.get("@spawnHostInput").clear();
    cy.get("@spawnHostInput").type("10");

    cy.getInputByLabel("Permanently Exempt Hosts").type("test-host{enter}");

    cy.dataCy("tracer-configuration").within(() => {
      cy.getInputByLabel("Enable tracer").check({ force: true });
      cy.getInputByLabel("Collector Endpoint").as("collectorEndpointInput");
      cy.get("@collectorEndpointInput").clear();
      cy.get("@collectorEndpointInput").type("https://test-collector.com");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify initial changes persisted
    cy.getInputByLabel(configDir).should("have.value", "/test/config/dir");
    cy.dataCy("misc-settings").within(() => {
      cy.dataCy("filter-chip").contains("testorg").should("exist");
    });
    cy.getInputByLabel(financeFormula).should("have.value", "0.75");
    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("Default Log Bucket").should(
        "have.value",
        "test-logs",
      );
    });
    cy.dataCy("ssh-pairs").within(() => {
      cy.getInputByLabel("Legacy SSH Key").should(
        "have.value",
        "/test/ssh/key",
      );
    });
    cy.dataCy("expansions-list").within(() => {
      cy.getInputByLabel("Key").should("have.value", "TEST_KEY");
      cy.getInputByLabel("Value").should("have.value", "test_value");
    });
    cy.dataCy("host-jasper").within(() => {
      cy.getInputByLabel("Binary Name").should("have.value", "test-jasper");
    });
    cy.getInputByLabel("Total Spawn Hosts Per User").should("have.value", "10");
    cy.dataCy("sleep-schedule").within(() => {
      cy.dataCy("filter-chip").contains("test-host").should("exist");
    });
    cy.dataCy("tracer-configuration").within(() => {
      cy.getInputByLabel("Enable tracer").should("be.checked");
      cy.getInputByLabel("Collector Endpoint").should(
        "have.value",
        "https://test-collector.com",
      );
    });

    // Modify single section
    cy.getInputByLabel("Total Project Limit").as("projectLimitInput");
    cy.get("@projectLimitInput").clear();
    cy.get("@projectLimitInput").type("200");
    cy.dataCy("project-creation-settings").within(() => {
      cy.contains("Add repository exception").click();
      cy.getInputByLabel("Jira Project").type("test-project");
      cy.getInputByLabel("Repository").clear();
      cy.getInputByLabel("Repository").type("5");
    });

    // Save single section change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify changes
    cy.getInputByLabel("Total Project Limit").should("have.value", "200");
    cy.dataCy("project-creation-settings").within(() => {
      cy.getInputByLabel("Jira Project").should("have.value", "test-project");
      cy.getInputByLabel("Repository").should("have.value", "5");
    });

    // Verify other sections unchanged
    cy.getInputByLabel(configDir).should("have.value", "/test/config/dir");
    cy.dataCy("misc-settings").within(() => {
      cy.dataCy("filter-chip").contains("testorg").should("exist");
    });
    cy.getInputByLabel(financeFormula).should("have.value", "0.75");
    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("Default Log Bucket").should(
        "have.value",
        "test-logs",
      );
    });
    cy.dataCy("ssh-pairs").within(() => {
      cy.getInputByLabel("Legacy SSH Key").should(
        "have.value",
        "/test/ssh/key",
      );
    });
    cy.dataCy("expansions-list").within(() => {
      cy.getInputByLabel("Key").should("have.value", "TEST_KEY");
      cy.getInputByLabel("Value").should("have.value", "test_value");
    });
    cy.dataCy("host-jasper").within(() => {
      cy.getInputByLabel("Binary Name").should("have.value", "test-jasper");
    });
    cy.getInputByLabel("Total Spawn Hosts Per User").should("have.value", "10");
    cy.dataCy("sleep-schedule").within(() => {
      cy.dataCy("filter-chip").contains("test-host").should("exist");
    });
    cy.dataCy("tracer-configuration").within(() => {
      cy.getInputByLabel("Enable tracer").should("be.checked");
      cy.getInputByLabel("Collector Endpoint").should(
        "have.value",
        "https://test-collector.com",
      );
    });
  });
});
