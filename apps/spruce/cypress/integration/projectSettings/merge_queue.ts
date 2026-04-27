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
  const origin = getRepoSettingsRoute(
    repo,
    ProjectSettingsTabRoutes.MergeQueue,
  );
  beforeEach(() => {
    cy.visit(origin);
    saveButtonEnabled(false);

    cy.dataCy("mq-enabled-radio-box")
      .contains("label", "Enabled")
      .as("enableMQButton");
  });

  it("Enabling merge queue shows hidden inputs and error banner", () => {
    cy.dataCy("mq-card").children().as("mqCardFields").should("have.length", 2);
    cy.get("@enableMQButton").click();
    cy.get("@mqCardFields").should("have.length", 3);
    cy.contains("Merge Queue Patch Definitions").scrollIntoView();
    cy.dataCy("error-banner")
      .contains(
        "A Merge Queue Patch Definition must be specified for this feature to run.",
      )
      .should("be.visible");
  });

  it("Does not show override buttons for merge queue patch definitions", () => {
    cy.get("@enableMQButton").click();
    cy.dataCy("mq-override-radio-box").should("not.exist");
  });

  it("Saves a merge queue definition", () => {
    cy.get("@enableMQButton").click();
    cy.contains("button", "Add Patch Definition").click();
    cy.dataCy("variant-tags-input").first().type("vtag");
    cy.dataCy("task-tags-input").first().type("ttag");
    saveButtonEnabled(false);

    cy.contains("button", "Add merge queue patch definition").click();
    cy.dataCy("variant-tags-input").last().type("mqvtag");
    cy.dataCy("task-tags-input").last().type("mqttag");
    cy.dataCy("warning-banner").should("not.exist");
    cy.dataCy("error-banner").should("not.exist");
    clickSave();
    cy.validateToast("success", "Successfully updated repo");
  });
});
