import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  repo,
  saveButtonEnabled,
} from "./constants";

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
  it("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", () => {
    const origin = getRepoSettingsRoute(repo);
    cy.visit(origin);
    cy.dataCy("navitem-commit-checks").click();
    saveButtonEnabled(false);
    cy.dataCy("github-checks-enabled-radio-box").children().first().click();
    cy.contains(
      "A Commit Check Definition must be specified for this feature to run.",
    ).as("errorBanner");
    cy.get("@errorBanner").should("be.visible");
    cy.dataCy("github-checks-enabled-radio-box").children().last().click();
    cy.get("@errorBanner").should("not.exist");
  });
});
