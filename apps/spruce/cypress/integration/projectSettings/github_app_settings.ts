import { clickSave } from "../../utils";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
  saveButtonEnabled,
} from "./constants";

describe("GitHub app settings", () => {
  const destination = getProjectSettingsRoute(
    "spruce",
    ProjectSettingsTabRoutes.GithubAppSettings,
  );
  const selectMenu = "[role='listbox']";
  const permissionGroups = {
    all: "All app permissions",
    readPRs: "Read Pull Requests",
    writeIssues: "Write Issues",
  };

  beforeEach(() => {
    cy.visit(destination);
    // Wait for page content to finish loading.
    cy.contains("Token Permission Restrictions");
  });

  it("save button should be disabled by default", () => {
    saveButtonEnabled(false);
  });

  it("should be able to replace app credentials", () => {
    // Replace button should be visible when app is defined.
    cy.dataCy("replace-app-credentials-button").should("be.visible");
    cy.dataCy("replace-app-credentials-button").click();
    cy.dataCy("replace-github-credentials-modal").should("be.visible");

    // Replace button in modal should be disabled without input.
    cy.dataCy("replace-github-credentials-modal")
      .find("button")
      .contains("Replace")
      .parent()
      .should("have.attr", "aria-disabled", "true");

    // Fill in new credentials.
    cy.dataCy("replace-app-id-input").type("99999");
    cy.dataCy("replace-private-key-input").type("new-private-key");

    // Replace button should now be enabled.
    cy.dataCy("replace-github-credentials-modal")
      .find("button")
      .contains("Replace")
      .parent()
      .should("not.have.attr", "aria-disabled", "true");

    cy.dataCy("replace-github-credentials-modal")
      .find("button")
      .contains("Replace")
      .parent()
      .click();
    cy.validateToast(
      "success",
      "GitHub app credentials were successfully replaced.",
    );
  });

  it("should be able to save different permission groups for requesters, then return to defaults", () => {
    cy.dataCy("permission-group-input").should("have.length", 8);
    cy.dataCy("permission-group-input").eq(0).as("permission-group-input-0");
    cy.dataCy("permission-group-input").eq(4).as("permission-group-input-4");

    // Save different permission groups.
    cy.get("@permission-group-input-0").click();
    cy.get(selectMenu)
      .first()
      .within(() => {
        cy.contains(permissionGroups.readPRs).click();
      });
    cy.get("@permission-group-input-4").click();
    cy.get(selectMenu)
      .first()
      .within(() => {
        cy.contains(permissionGroups.writeIssues).click();
      });
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    // Changes should persist on the page.
    cy.reload();
    cy.get("@permission-group-input-0").contains(permissionGroups.readPRs);
    cy.get("@permission-group-input-4").contains(permissionGroups.writeIssues);

    // Return to and save defaults.
    cy.get("@permission-group-input-0").click();
    cy.get(selectMenu)
      .first()
      .within(() => {
        cy.contains(permissionGroups.all).click();
      });
    cy.get("@permission-group-input-4").click();
    cy.get(selectMenu)
      .first()
      .within(() => {
        cy.contains(permissionGroups.all).click();
      });
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
});
