import {
  getProjectSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
  saveButtonEnabled,
} from "./constants";
import { clickSaveAndConfirmDiff } from "./utils";

describe("A project that has GitHub webhooks disabled", () => {
  const origin = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.CommitChecks,
  );
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Commit Checks page shows a disabled webhooks banner when webhooks are disabled", () => {
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
    ProjectSettingsTabRoutes.CommitChecks,
  );
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", () => {
    cy.dataCy("github-checks-enabled-radio-box").children().first().click();
    cy.contains(
      "A Commit Check Definition must be specified for this feature to run.",
    ).as("errorBanner");
    cy.dataCy("error-banner").should("be.visible");
    cy.dataCy("github-checks-enabled-radio-box").children().last().click();
    cy.dataCy("error-banner").should("not.exist");
  });

  it("Saves successfully when Commit Checks are enabled and a Commit Check Definition is provided", () => {
    cy.dataCy("github-checks-enabled-radio-box").children().first().click();
    cy.contains("button", "Add Definition").click();
    cy.dataCy("variant-tags-input").first().type("vtag");
    cy.dataCy("task-tags-input").first().type("ttag");

    cy.dataCy("error-banner").should("not.exist");
    clickSaveAndConfirmDiff();
    cy.validateToast("success", "Successfully updated project");
  });
});
