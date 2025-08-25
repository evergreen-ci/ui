import { clickSave } from "../../utils";

describe("other", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save misc settings changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Misc Settings section.
    const configDir = "Config Directory";
    cy.getInputByLabel(configDir).as("configDirInput");
    cy.get("@configDirInput").clear();
    cy.get("@configDirInput").type("/new/config/dir");

    const githubPrCreatorOrg = "GitHub PR Creator Organization";
    cy.getInputByLabel(githubPrCreatorOrg).as("githubPrCreatorOrg");
    cy.get("@githubPrCreatorOrg").clear();
    cy.get("@githubPrCreatorOrg").type("new.example.com");

    const shutdownWaitSeconds = "Shutdown Wait Time (secs)";
    cy.getInputByLabel(shutdownWaitSeconds).as("shutdownWaitInput");
    cy.get("@shutdownWaitInput").clear();
    cy.get("@shutdownWaitInput").type("45");

    cy.getInputByLabel("GitHub Organizations").as("githubOrgsInput");
    cy.get("@githubOrgsInput").type("neworg{enter}");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.getInputByLabel(configDir).should("have.value", "/new/config/dir");
    cy.getInputByLabel(githubPrCreatorOrg).should(
      "have.value",
      "new.example.com",
    );
    cy.getInputByLabel(shutdownWaitSeconds).should("have.value", "45");

    cy.dataCy("misc-settings").within(() => {
      cy.dataCy("filter-chip").contains("neworg").should("exist");
    });
  });

  it("can save single task host changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Single Task Host section.
    const projectTasksList = "project-tasks-pairs-list";
    cy.dataCy(projectTasksList).as("projectTasksList");
    cy.contains("Add project tasks pair").click();

    cy.getInputByLabel("Project ID / Repo").click({ force: true });
    cy.get('[role="listbox"]').should("be.visible");
    cy.get('[role="option"]').last().click();

    cy.getInputByLabel("Allowed Tasks").type("compile{enter}test{enter}");
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy(projectTasksList).children().should("have.length.at.least", 1);
  });

  it("can save bucket config changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Bucket Config section.
    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("Name").as("logBucketNameInput");
      cy.get("@logBucketNameInput").clear();
      cy.get("@logBucketNameInput").type("new-log-bucket");
    });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("bucket-config").within(() => {
      cy.getInputByLabel("Name").should("have.value", "new-log-bucket");
    });
  });

  it("can save SSH pairs changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // SSH Pairs section.
    cy.dataCy("ssh-pairs").within(() => {
      cy.contains("Task Host Key");
      cy.getInputByLabel("Name").as("taskHostKeyInput");
      cy.get("@taskHostKeyInput").clear();
      cy.get("@taskHostKeyInput").type("new-task-host-key");

      cy.getInputByLabel("Secret ARN").as("taskHostSecretARN");
      cy.get("@taskHostSecretARN").clear();
      cy.get("@taskHostSecretARN").type("new-task-host-secret-arn");
    });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("ssh-pairs").within(() => {
      cy.getInputByLabel("Name").should("have.value", "new-task-host-key");
      cy.getInputByLabel("Secret ARN").should(
        "have.value",
        "new-task-host-secret-arn",
      );
    });
  });

  it("can save expansions changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Expansions section.
    cy.dataCy("expansions-list").within(() => {
      cy.contains("Add").click();
    });

    cy.dataCy("expansions-list")
      .children()
      .last()
      .within(() => {
        cy.getInputByLabel("Key").type("NEW_VAR");
        cy.getInputByLabel("Value").type("new_value");
      });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("expansions-list").children().should("have.length.at.least", 1);
  });

  it("can save host jasper changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Host Jasper section.
    const binaryName = "Binary Name";
    cy.dataCy("host-jasper").within(() => {
      cy.getInputByLabel(binaryName).as("binaryNameInput");
      cy.get("@binaryNameInput").clear();
      cy.get("@binaryNameInput").type("new-jasper");
    });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("host-jasper").within(() => {
      cy.getInputByLabel("Binary Name").should("have.value", "new-jasper");
    });
  });

  it("can save JIRA notifications changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // JIRA Notifications section.
    const jiraNotifications = "jira-notifications";
    cy.dataCy(jiraNotifications).as("jiraNotifications");
    cy.get("@jiraNotifications").within(() => {
      cy.contains("Add new Jira project").click();
    });

    cy.get("@jiraNotifications")
      .children()
      .last()
      .within(() => {
        cy.getInputByLabel("Project").type("TEST");
        cy.getInputByLabel("Components").type("backend{enter}");
        cy.getInputByLabel("Labels").type("feature{enter}");
      });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy(jiraNotifications).children().should("have.length.at.least", 1);
  });

  it("can save spawn host changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Spawn Host section.
    const unexpirableHosts = "Unexpirable Hosts Per User";
    cy.getInputByLabel(unexpirableHosts).as("unexpirableHostsInput");
    cy.get("@unexpirableHostsInput").clear();
    cy.get("@unexpirableHostsInput").type("5");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.getInputByLabel(unexpirableHosts).should("have.value", "5");
  });

  it("can save sleep schedule changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Sleep Schedule section.
    cy.getInputByLabel("Permanently Exempt Hosts").as("exemptHostsInput");
    cy.get("@exemptHostsInput").type("exempt-host-1{enter}");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("sleep-schedule").within(() => {
      cy.dataCy("filter-chip").contains("exempt-host-1").should("exist");
    });
  });

  it("can save tracer configuration changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Tracer Configuration section.
    const tracerEnabled = "Enable tracer";
    cy.dataCy("tracer-configuration").within(() => {
      cy.getInputByLabel(tracerEnabled).as("tracerEnabledInput");
      cy.get("@tracerEnabledInput").check({ force: true });
    });

    const collectorEndpoint = "Collector Endpoint";
    cy.getInputByLabel(collectorEndpoint).as("collectorEndpointInput");
    cy.get("@collectorEndpointInput").clear();
    cy.get("@collectorEndpointInput").type("https://new-collector.example.com");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("tracer-configuration").within(() => {
      cy.getInputByLabel(tracerEnabled).should("be.checked");
    });
    cy.getInputByLabel(collectorEndpoint).should(
      "have.value",
      "https://new-collector.example.com",
    );
  });

  it("can save project creation changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Project Creation section.
    const totalProjectLimit = "Total Project Limit";
    cy.getInputByLabel(totalProjectLimit).as("totalProjectLimitInput");
    cy.get("@totalProjectLimitInput").clear();
    cy.get("@totalProjectLimitInput").type("150");

    const projectCreationSettings = "project-creation-settings";
    cy.dataCy(projectCreationSettings).as("projectCreationSettings");
    cy.get("@projectCreationSettings").within(() => {
      cy.contains("Add repository exception").click();
    });

    cy.get("@projectCreationSettings")
      .children()
      .last()
      .within(() => {
        cy.getInputByLabel("Owner").type("test-owner");
        cy.getInputByLabel("Repository").type("test-repo");
      });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.getInputByLabel(totalProjectLimit).should("have.value", "150");
    cy.dataCy(projectCreationSettings)
      .children()
      .should("have.length.at.least", 1);
  });

  it("can save GitHub check run changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // GitHub Check Run section.
    const checkRunLimit = "Check Run Limit";
    cy.getInputByLabel(checkRunLimit).as("checkRunLimitInput");
    cy.get("@checkRunLimitInput").clear();
    cy.get("@checkRunLimitInput").type("25");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify GitHub check run value persisted.
    cy.getInputByLabel(checkRunLimit).should("have.value", "25");
  });
});
