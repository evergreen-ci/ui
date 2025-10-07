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

  it("saves Okta Client Secret parameter store value independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial Okta Client Secret value
    cy.dataCy("okta").within(() => {
      const oktaClientSecret = "Client Secret";
      cy.getInputByLabel(oktaClientSecret).as("oktaClientSecretInput");
      cy.get("@oktaClientSecretInput").clear();
      cy.get("@oktaClientSecretInput").type("test-okta-secret");
    });
    // Set Kanopy Authentication values (for auth validation to work)
    cy.dataCy("kanopy").within(() => {
      const headerName = "Header Name";
      const issuer = "Issuer";
      const keysetUrl = "Keyset URL";
      cy.getInputByLabel(headerName).as("headerNameInput");
      cy.get("@headerNameInput").clear();
      cy.get("@headerNameInput").type("test-header-name");

      cy.getInputByLabel(issuer).as("issuerInput");
      cy.get("@issuerInput").clear();
      cy.get("@issuerInput").type("test-issuer");

      cy.getInputByLabel(keysetUrl).as("keysetUrlInput");
      cy.get("@keysetUrlInput").clear();
      cy.get("@keysetUrlInput").type("test-keyset-url");
    });
    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store value persisted
    cy.dataCy("okta").within(() => {
      cy.getInputByLabel("Client Secret").should(
        "have.value",
        "test-okta-secret",
      );
    });

    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("Okta param store test");

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "Okta param store test",
    );

    // Verify parameter store value remained unchanged
    cy.dataCy("okta").within(() => {
      cy.getInputByLabel("Client Secret").should(
        "have.value",
        "test-okta-secret",
      );
    });
  });

  it("saves Jira Personal Access Token parameter store value independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial Jira PAT value
    cy.dataCy("jira").within(() => {
      const jiraPat = "Personal Access Token";
      cy.getInputByLabel(jiraPat).as("jiraPat");
      cy.get("@jiraPat").clear();
      cy.get("@jiraPat").type("test-jira-pat");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store value persisted
    cy.dataCy("jira").within(() => {
      cy.getInputByLabel("Personal Access Token").should(
        "have.value",
        "test-jira-pat",
      );
    });

    // Change banner message
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("Jira param store test");

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "Jira param store test",
    );

    // Verify parameter store value remained unchanged
    cy.dataCy("jira").within(() => {
      cy.getInputByLabel("Personal Access Token").should(
        "have.value",
        "test-jira-pat",
      );
    });
  });

  it("saves Slack and Splunk token parameter store values independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial Slack Token value
    cy.dataCy("slack").within(() => {
      const slackToken = "Token";
      cy.getInputByLabel(slackToken).as("slackTokenInput");
      cy.get("@slackTokenInput").clear();
      cy.get("@slackTokenInput").type("xoxb-test-slack-token");
    });

    // Set initial Splunk Token value
    cy.dataCy("splunk").within(() => {
      const splunkToken = "Token";
      cy.getInputByLabel(splunkToken).as("splunkTokenInput");
      cy.get("@splunkTokenInput").clear();
      cy.get("@splunkTokenInput").type("test-splunk-token");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store values persisted
    cy.dataCy("slack").within(() => {
      cy.getInputByLabel("Token").should("have.value", "xoxb-test-slack-token");
    });

    cy.dataCy("splunk").within(() => {
      cy.getInputByLabel("Token").should("have.value", "test-splunk-token");
    });

    // Change banner message
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("Tokens param store test");

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "Tokens param store test",
    );

    // Verify parameter store values remained unchanged
    cy.dataCy("slack").within(() => {
      cy.getInputByLabel("Token").should("have.value", "xoxb-test-slack-token");
    });

    cy.dataCy("splunk").within(() => {
      cy.getInputByLabel("Token").should("have.value", "test-splunk-token");
    });
  });

  it("saves Runtime Environments API Key parameter store value independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial Runtime Environments API Key value
    cy.dataCy("runtime-environments").within(() => {
      const apiKey = "API Key";
      cy.getInputByLabel(apiKey).as("runtimeEnvApiKey");
      cy.get("@runtimeEnvApiKey").clear();
      cy.get("@runtimeEnvApiKey").type("test-runtime-env-key");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store value persisted
    cy.dataCy("runtime-environments").within(() => {
      cy.getInputByLabel("API Key").should(
        "have.value",
        "test-runtime-env-key",
      );
    });

    // Change banner message
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type(
      "Runtime Environments param store test",
    );

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "Runtime Environments param store test",
    );

    // Verify parameter store value remained unchanged
    cy.dataCy("runtime-environments").within(() => {
      cy.getInputByLabel("API Key").should(
        "have.value",
        "test-runtime-env-key",
      );
    });
  });

  it("saves AWS EC2 Keys parameter store values independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial AWS EC2 Keys values
    cy.dataCy("aws-configuration").within(() => {
      cy.getInputByLabel("EC2 Key").as("ec2KeyInput");
      cy.get("@ec2KeyInput").clear();
      cy.get("@ec2KeyInput").type("test-ec2-key");

      cy.getInputByLabel("EC2 Secret").as("ec2SecretInput");
      cy.get("@ec2SecretInput").clear();
      cy.get("@ec2SecretInput").type("test-ec2-secret");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store values persisted
    cy.dataCy("aws-configuration").within(() => {
      cy.getInputByLabel("EC2 Key").should("have.value", "test-ec2-key");
      cy.getInputByLabel("EC2 Secret").should("have.value", "test-ec2-secret");
    });

    // Change banner message
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("AWS EC2 param store test");

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "AWS EC2 param store test",
    );

    // Verify parameter store values remained unchanged
    cy.dataCy("aws-configuration").within(() => {
      cy.getInputByLabel("EC2 Key").should("have.value", "test-ec2-key");
      cy.getInputByLabel("EC2 Secret").should("have.value", "test-ec2-secret");
    });
  });

  it("saves S3 Keys parameter store values independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial S3 Keys values
    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("S3 Key").as("s3KeyInput");
      cy.get("@s3KeyInput").clear();
      cy.get("@s3KeyInput").type("test-s3-key");

      cy.getInputByLabel("S3 Secret").as("s3SecretInput");
      cy.get("@s3SecretInput").clear();
      cy.get("@s3SecretInput").type("test-s3-secret");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store values persisted
    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("S3 Key").should("have.value", "test-s3-key");
      cy.getInputByLabel("S3 Secret").should("have.value", "test-s3-secret");
    });

    // Change banner message
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("S3 Keys param store test");

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "S3 Keys param store test",
    );

    // Verify parameter store values remained unchanged
    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("S3 Key").should("have.value", "test-s3-key");
      cy.getInputByLabel("S3 Secret").should("have.value", "test-s3-secret");
    });
  });

  it.only("saves GitHub Webhook Secret parameter store value independently", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Set initial GitHub Webhook Secret value
    cy.dataCy("misc-settings").within(() => {
      cy.getInputByLabel("Webhook Secret").as("webhookSecretInput");
      cy.get("@webhookSecretInput").clear();
      cy.get("@webhookSecretInput").type("test-webhook-secret");
    });

    // Save initial changes
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify parameter store value persisted
    cy.dataCy("misc-settings").within(() => {
      cy.getInputByLabel("Webhook Secret").should(
        "have.value",
        "test-webhook-secret",
      );
    });

    // Change banner message
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type(
      "GitHub Webhook Secret param store test",
    );

    // Save banner change
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify banner message changed
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "GitHub Webhook Secret param store test",
    );

    // Verify parameter store value remained unchanged
    cy.dataCy("misc-settings").within(() => {
      cy.getInputByLabel("Webhook Secret").should(
        "have.value",
        "test-webhook-secret",
      );
    });
  });
});
