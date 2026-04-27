import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
  project,
  saveButtonEnabled,
} from "./constants";
import { clickSaveAndConfirmDiff } from "./utils";

describe("A project that has GitHub webhooks disabled", () => {
  const origin = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.MergeQueue,
  );
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Merge Queue page shows a disabled webhooks banner when webhooks are disabled", () => {
    cy.dataCy("disabled-webhook-banner")
      .contains(
        "GitHub features are disabled because the Evergreen GitHub App is not",
      )
      .should("be.visible");
  });

  it("Disables all interactive elements on the page", () => {
    cy.dataCy("project-settings-page")
      .find("button")
      .should("have.attr", "aria-disabled", "true");
    cy.get("input").should("have.attr", "aria-disabled", "true");
  });
});

describe("A project that has GitHub webhooks enabled", () => {
  const origin = getProjectSettingsRoute(
    project,
    ProjectSettingsTabRoutes.MergeQueue,
  );

  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Enabling merge queue shows hidden inputs and error banner", () => {
    cy.dataCy("mq-enabled-radio-box").contains("label", "Enabled").click();
    cy.contains("Merge Queue Patch Definitions").should("be.visible");
    cy.dataCy("error-banner")
      .contains(
        "A Merge Queue Patch Definition must be specified for this feature to run.",
      )
      .should("be.visible");
  });

  it("Saves a merge queue definition", () => {
    cy.dataCy("mq-enabled-radio-box").contains("label", "Enabled").click();
    cy.contains("button", "Add merge queue patch definition").click();
    saveButtonEnabled(false);

    cy.dataCy("variant-tags-input").first().type("vtag");
    cy.dataCy("task-tags-input").first().type("ttag");
    clickSaveAndConfirmDiff();
    cy.validateToast("success", "Successfully updated project");
  });
});
