import { clickSave } from "../../utils";
import { getAppSettingsRoute, saveButtonEnabled } from "./constants";

describe("GitHub app settings", () => {
  const destination = getAppSettingsRoute("spruce");
  const selectMenu = "[role='listbox']";
  const permissionGroups = {
    all: "All app permissions",
    readPullRequests: "Read Pull Requests",
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

    // Save different permission groups.
    cy.dataCy("permission-group-input").eq(0).click();
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.readPullRequests).click();
    });
    cy.dataCy("permission-group-input").eq(4).click();
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.writeIssues).click();
    });
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    // Changes should persist on the page.
    cy.reload();
    cy.dataCy("permission-group-input")
      .eq(0)
      .contains(permissionGroups.readPullRequests);
    cy.dataCy("permission-group-input")
      .eq(4)
      .contains(permissionGroups.writeIssues);

    // Return to and save defaults.
    cy.dataCy("permission-group-input").eq(0).click();
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.all).click();
    });
    cy.dataCy("permission-group-input").eq(4).click();
    cy.get(selectMenu).within(() => {
      cy.contains(permissionGroups.all).click();
    });
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");
  });
});
