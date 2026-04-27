import { clickSave } from "../../utils";
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
    ProjectSettingsTabRoutes.GitTags,
  );
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);
  });

  it("Git tags page shows a disabled webhooks banner when webhooks are disabled", () => {
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
  it("Saves successfully when Git Tags are enabled and a Git Tag Definition is provided", () => {
    const origin = getRepoSettingsRoute(repo, ProjectSettingsTabRoutes.GitTags);
    cy.visit(origin);
    saveButtonEnabled(false);

    cy.dataCy("git-tag-enabled-radio-box").children().first().click();
    cy.dataCy("git-tag-enabled-radio-box").contains("label", "Enabled").click();
    cy.contains(
      "A Git Tag Version Definition must be specified for this feature to run.",
    ).as("errorBanner");
    cy.dataCy("errorBanner").should("be.visible");

    cy.dataCy("add-button").contains("Add Git Tag").parent().click();
    cy.dataCy("git-tag-input").type("v*");
    cy.dataCy("remote-path-input").type("./evergreen.yml");

    cy.dataCy("error-banner").should("not.exist");
    clickSave();
    cy.validateToast("success", "Successfully updated repo");
  });
});
