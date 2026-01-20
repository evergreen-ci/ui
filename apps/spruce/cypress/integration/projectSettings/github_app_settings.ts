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

  it("should be able to delete & save app credentials", () => {
    cy.dataCy("github-app-id-input").as("appId");
    cy.dataCy("github-private-key-input").as("privateKey");

    // Delete GitHub app credentials.
    cy.dataCy("delete-app-credentials-button").should("be.visible");
    cy.dataCy("delete-app-credentials-button").click();
    cy.dataCy("delete-github-credentials-modal").should("be.visible");
    cy.dataCy("delete-github-credentials-modal")
      .find("button")
      .contains("Delete")
      .parent()
      .click();
    cy.validateToast(
      "success",
      "GitHub app credentials were successfully deleted.",
    );

    cy.dataCy("github-app-credentials-banner").should("be.visible");
    cy.get("@appId").should("have.value", "");
    cy.get("@privateKey").should("have.value", "");
    cy.get("@appId").should("have.attr", "aria-disabled", "false");
    cy.get("@privateKey").should("have.attr", "aria-disabled", "false");

    cy.reload();
    cy.dataCy("github-app-credentials-banner").should("be.visible");
    cy.get("@appId").should("have.value", "");
    cy.get("@privateKey").should("have.value", "");

    // Add GitHub app credentials.
    cy.get("@appId").type("12345");
    cy.get("@privateKey").type("secret");
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    cy.dataCy("github-app-credentials-banner").should("not.exist");
    cy.get("@appId").should("have.value", "12345");
    cy.get("@privateKey").should("have.value", "{REDACTED}");
    cy.get("@appId").should("have.attr", "aria-disabled", "true");
    cy.get("@privateKey").should("have.attr", "aria-disabled", "true");

    cy.reload();
    cy.dataCy("github-app-credentials-banner").should("not.exist");
    cy.get("@appId").should("have.value", "12345");
    cy.get("@privateKey").should("have.value", "{REDACTED}");
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
