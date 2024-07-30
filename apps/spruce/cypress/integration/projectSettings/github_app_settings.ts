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

  // TODO: Add test for deletion in DEVPROD-9282.

  it("should be able to save app credentials", () => {
    cy.visit(getAppSettingsRoute("logkeeper"));
    cy.contains("Token Permission Restrictions");

    cy.dataCy("github-app-credentials-banner").should("be.visible");
    cy.dataCy("github-app-id-input").type("12345");
    cy.dataCy("github-private-key-input").type("secret");
    cy.dataCy("save-settings-button").scrollIntoView();
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");

    cy.dataCy("github-app-credentials-banner").should("not.exist");
    cy.dataCy("github-app-id-input").should("have.value", "12345");
    cy.dataCy("github-private-key-input").should("have.value", "{REDACTED}");
    cy.dataCy("github-app-id-input").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("github-private-key-input").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    cy.reload();
    cy.dataCy("github-app-credentials-banner").should("not.exist");
    cy.dataCy("github-app-id-input").should("have.value", "12345");
    cy.dataCy("github-private-key-input").should("have.value", "{REDACTED}");
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
