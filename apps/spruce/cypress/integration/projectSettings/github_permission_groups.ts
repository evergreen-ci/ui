import { clickSave } from "../../utils";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
  saveButtonEnabled,
} from "./constants";

describe("GitHub permission groups", () => {
  const destination = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.GithubPermissionGroups,
  );
  beforeEach(() => {
    cy.visit(destination);
    // Wait for page content to finish loading.
    cy.contains("Token Permission Groups");
  });

  it("should not have any permission groups defined", () => {
    cy.dataCy("permission-group-list").children().should("have.length", 0);
    saveButtonEnabled(false);
  });

  it("should throw an error if permission group definitions are invalid", () => {
    cy.contains("button", /^Add permission group$/).should("be.visible");
    cy.contains("button", /^Add permission group$/).click();
    cy.dataCy("permission-group-list").children().should("have.length", 1);

    const invalidGithubPermission = "invalid_github_permission";
    cy.dataCy("permission-group-title-input").type("test permission group");
    cy.dataCy("add-permission-button").should("be.visible");
    cy.dataCy("add-permission-button").click();
    cy.dataCy("permission-type-input").type(invalidGithubPermission);
    cy.dataCy("permission-value-input").click();
    cy.contains("Write").click({ force: true });
    saveButtonEnabled(true);
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("error", "There was an error saving the project");
  });

  it("should be able to save permission group, then delete it", () => {
    // Add permission group.
    cy.contains("button", /^Add permission group$/).should("be.visible");
    cy.contains("button", /^Add permission group$/).click();
    cy.dataCy("permission-group-list").children().should("have.length", 1);

    cy.dataCy("permission-group-title-input").type("test permission group");
    cy.dataCy("add-permission-button").should("be.visible");
    cy.dataCy("add-permission-button").click();
    cy.dataCy("permission-type-input").type("actions");
    cy.dataCy("permission-value-input").click();
    cy.contains("Read").click();
    saveButtonEnabled(true);
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    // Delete permission group.
    cy.reload();
    cy.dataCy("permission-group-list").children().should("have.length", 1);
    cy.dataCy("delete-item-button").click();
    cy.dataCy("permission-group-list").children().should("have.length", 0);
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
});
