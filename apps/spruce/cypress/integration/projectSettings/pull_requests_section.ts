import { clickSave } from "../../utils";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
} from "./constants";

describe("A project that has GitHub webhooks disabled", () => {
  const origin = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.PullRequests,
  );
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Pull Requests page shows a disabled webhooks banner when webhooks are disabled", () => {
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
  beforeEach(() => {
    const origin = getRepoSettingsRoute(repo);
    cy.visit(origin);
    cy.dataCy("navitem-pull-requests").click();
    saveButtonEnabled(false);
  });

  it("Allows enabling manual PR testing", () => {
    cy.dataCy("manual-pr-testing-enabled-radio-box").children().first().click();
  });

  it("Saving a patch defintion should hide the error banner, success toast and displays disable patch definitions for the repo", () => {
    cy.contains(
      "A GitHub Patch Definition must be specified for this feature to run.",
    ).as("errorBanner");
    cy.get("@errorBanner").should("be.visible");
    cy.contains("button", "Add Patch Definition").click();
    cy.get("@errorBanner").should("not.exist");
    saveButtonEnabled(false);
    cy.dataCy("variant-tags-input").first().type("vtag");
    cy.dataCy("task-tags-input").first().type("ttag");
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated repo");
    cy.visit(getProjectSettingsRoute(projectUseRepoEnabled));
    cy.dataCy("navitem-pull-requests").click();
    cy.contains("Repo Patch Definition 1")
      .as("patchDefAccordion")
      .scrollIntoView();
    cy.get("@patchDefAccordion").click();
    cy.dataCy("variant-tags-input").should("have.value", "vtag");
    cy.dataCy("variant-tags-input").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("task-tags-input").should("have.value", "ttag");
    cy.dataCy("task-tags-input").should("have.attr", "aria-disabled", "true");
    cy.contains(
      "A GitHub Patch Definition must be specified for this feature to run.",
    ).should("not.exist");
  });
});
