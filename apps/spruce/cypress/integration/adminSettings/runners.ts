import { clickSave } from "../../utils";

describe("runners", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Notify section.
    cy.getInputByLabel("SES Email").as("sesInput");
    cy.get("@sesInput").clear();
    cy.get("@sesInput").type("new_email@email.com");

    // Task Limits section.
    cy.getInputByLabel("Max Hourly Patch Tasks Per User").as("taskLimitInput");
    cy.get("@taskLimitInput").clear();
    cy.get("@taskLimitInput").type("9999");

    // Host Init section.
    cy.getInputByLabel("Max Total Dynamic Hosts").as("hostInitInput");
    cy.get("@hostInitInput").clear();
    cy.get("@hostInitInput").type("8888");

    // Pod Lifecycle section.
    cy.getInputByLabel("Max Parallel Pod Requests").as("podLifecycleInput");
    cy.get("@podLifecycleInput").clear();
    cy.get("@podLifecycleInput").type("7777");

    // Scheduler section.
    cy.getInputByLabel("Rounding Rule").as("schedulerSelect");
    cy.selectLGOption("Rounding Rule", "Round up");

    cy.getInputByLabel("Default Future Host Fraction").as("schedulerInput");
    cy.get("@schedulerInput").clear();
    cy.get("@schedulerInput").type("0.6");

    cy.getInputByLabel("Group Versions").as("schedulerCheckbox");
    cy.get("@schedulerCheckbox").uncheck({ force: true });

    // Repotracker section.
    cy.getInputByLabel("New Revisions to Fetch").as("repotrackerInput");
    cy.get("@repotrackerInput").clear();
    cy.get("@repotrackerInput").type("5");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");

    cy.reload();
    cy.get("@sesInput").should("have.value", "new_email@email.com");
    cy.get("@taskLimitInput").should("have.value", "9999");
    cy.get("@hostInitInput").should("have.value", "8888");
    cy.get("@podLifecycleInput").should("have.value", "7777");
    cy.get("@schedulerSelect").should("have.value", "UP");
    cy.get("@schedulerInput").should("have.value", "0.6");
    cy.get("@schedulerCheckbox").should("not.be.checked");
    cy.get("@repotrackerInput").should("have.value", "5");
  });
});
