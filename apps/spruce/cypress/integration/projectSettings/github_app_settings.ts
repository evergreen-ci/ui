import { clickSave } from "../../utils";
import { getAppSettingsRoute, saveButtonEnabled } from "./constants";

describe("GitHub app settings", () => {
  const destination = getAppSettingsRoute("spruce");
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

  it("should be able to save different permission groups for requesters, then return to defaults", () => {
    cy.dataCy("permission-group-input").should("have.length", 7);
    cy.dataCy("permission-group-input").eq(0).as("permission-group-input-0");
    cy.dataCy("permission-group-input").eq(4).as("permission-group-input-4");

    // Save different permission groups.
    cy.get("@permission-group-input-0").click();
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.readPRs).click();
    });
    cy.get("@permission-group-input-4").click();
    cy.get(selectMenu).within(() => {
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
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.all).click();
    });
    cy.get("@permission-group-input-4").click();
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.all).click();
    });
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
});
