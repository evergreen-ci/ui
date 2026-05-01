import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
} from "./constants";
import { clickSaveAndConfirmDiff } from "./utils";

describe("Project Settings when defaulting to repo", () => {
  const origin = getProjectSettingsRoute(projectUseRepoEnabled);

  beforeEach(() => {
    cy.visit(origin);
  });

  describe("General Settings page", () => {
    it("Save button is disabled on load and shows a link to the repo", () => {
      saveButtonEnabled(false);
      cy.dataCy("attached-repo-link")
        .should("have.attr", "href")
        .and("eq", `/${getRepoSettingsRoute(repo)}`);
    });

    it("Preserves edits to the form when navigating between settings tabs and does not show a warning modal", () => {
      cy.dataCy("spawn-host-input").should("have.value", "/path");
      cy.dataCy("spawn-host-input").type("/test");
      saveButtonEnabled();
      cy.dataCy("navitem-access").click();
      cy.dataCy("navigation-warning-modal").should("not.exist");
      cy.dataCy("navitem-general").click();
      cy.dataCy("spawn-host-input").should("have.value", "/path/test");
      saveButtonEnabled();
    });

    it("Shows a 'Default to Repo' button on page", () => {
      cy.dataCy("default-to-repo-button").should("exist");
    });

    it("Shows only two radio boxes even when rendering a project that inherits from repo", () => {
      cy.dataCy("enabled-radio-box").children().should("have.length", 2);
    });

    it("Does not default to repo value for display name", () => {
      cy.dataCy("display-name-input").should("not.have.attr", "placeholder");
    });

    it("Shows a navigation warning modal that lists the general page when navigating away from project settings", () => {
      cy.dataCy("spawn-host-input").type("/test");
      saveButtonEnabled();
      cy.contains("My Patches").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.dataCy("unsaved-pages").within(() => {
        cy.get("li").should("have.length", 1);
      });
      cy.get("body").type("{esc}");
    });

    it("Shows the repo value for Batch Time", () => {
      cy.dataCy("batch-time-input").should("have.attr", "placeholder");
    });

    it("Clicking on save button should show a success toast", () => {
      cy.dataCy("spawn-host-input").type("/test");
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
    });

    it("Saves when batch time is updated", () => {
      cy.dataCy("batch-time-input").clear();
      cy.dataCy("batch-time-input").type("12");
      clickSaveAndConfirmDiff();
      cy.dataCy("batch-time-input").should("have.value", 12);
      cy.validateToast("success", "Successfully updated project");
      // Check if clearing attached project defaults batchtime to repo value
      cy.dataCy("batch-time-input").clear();
      clickSaveAndConfirmDiff();
      cy.dataCy("batch-time-input")
        .invoke("attr", "placeholder")
        .should("equal", "60 (Default from repo)");
      cy.validateToast("success", "Successfully updated project");
      // Update repo batch time and check if project batch time placeholder is updated
      cy.dataCy("attached-repo-link").click();
      cy.dataCy("batch-time-input").should("have.value", 60);
      cy.dataCy("batch-time-input").clear();
      clickSaveAndConfirmDiff();
      cy.dataCy("batch-time-input").should("have.value", 0);
      cy.validateToast("success", "Successfully updated repo");
      cy.visit(origin);
      cy.dataCy("batch-time-input")
        .invoke("attr", "placeholder")
        .should("equal", "0 (Default from repo)");
      // Check if clearing project batch time saves as 0 instead of null
      cy.visit(getProjectSettingsRoute(project));
      cy.dataCy("batch-time-input").should("have.value", 60);
      cy.dataCy("batch-time-input").clear();
      clickSaveAndConfirmDiff();
      cy.dataCy("batch-time-input").should("have.value", 0);
      cy.validateToast("success", "Successfully updated project");
    });
  });

  describe("Variables page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-variables").click();
      saveButtonEnabled(false);
    });

    it("Successfully saves variables and then promotes them using the promote variables modal", () => {
      // Save variables
      cy.dataCy("add-button").should("be.visible").click();
      cy.dataCy("var-name-input").type("a");
      cy.dataCy("var-value-input").type("1");
      cy.dataCy("var-description-input").type("Description for variable a");
      cy.contains("label", "Private").click();

      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("b");
      cy.dataCy("var-value-input").first().type("2");
      cy.dataCy("var-description-input")
        .first()
        .type("Description for variable b");

      cy.dataCy("add-button").click();
      cy.dataCy("var-name-input").first().type("c");
      cy.dataCy("var-value-input").first().type("3");
      cy.dataCy("var-description-input")
        .first()
        .type("Description for variable c");

      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
      // Promote variables
      cy.dataCy("promote-vars-modal").should("not.exist");
      cy.dataCy("promote-vars-button").click();
      cy.dataCy("promote-vars-modal").should("be.visible");
      cy.dataCy("promote-var-checkbox").first().check({ force: true });
      cy.contains("button", "Move 1 variable").click();
      cy.validateToast("success", "Successfully moved variables to repo");
    });
  });

  describe("Patch Aliases page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-patch-aliases").click();
      saveButtonEnabled(false);
    });

    it("Defaults to repo patch aliases", () => {
      cy.getInputByLabel("Default to Repo Patch Aliases").should(
        "have.attr",
        "checked",
      );
    });

    it("Patch aliases added before defaulting to repo patch aliases are cleared", () => {
      // Override repo patch alias and add a patch alias.
      cy.contains("label", "Override Repo Patch Aliases")
        .should("be.visible")
        .click();
      cy.getInputByLabel("Override Repo Patch Aliases").should(
        "have.attr",
        "aria-checked",
        "true",
      );
      saveButtonEnabled(false);
      cy.dataCy("add-button")
        .contains("Add Patch Alias")
        .parent()
        .click({ force: true });
      saveButtonEnabled(false);
      cy.dataCy("alias-input").type("my overriden alias name");
      cy.dataCy("variant-tags-input").first().type("alias variant tag 2");
      cy.dataCy("task-tags-input").first().type("alias task tag 2");
      cy.dataCy("add-button").contains("Add Task Tag").parent().click();
      cy.dataCy("task-tags-input").first().type("alias task tag 3");
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
      // Default to repo patch alias
      cy.contains("label", "Default to Repo Patch Aliases").click();
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
      saveButtonEnabled(false);
      // Aliases are cleared
      cy.contains("label", "Override Repo Patch Aliases").click();
      cy.dataCy("alias-row").should("have.length", 0);
    });
  });

  describe("Virtual Workstation page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-virtual-workstation").click();
    });

    it("Enable git clone", () => {
      cy.contains("label", "Enabled").click();
      cy.getInputByLabel("Enabled").should("be.checked");
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
    });
    it("Add commands", () => {
      // Repo commands should be visible on project page based on button selection
      cy.getInputByLabel("Default to repo (disabled)").should("be.checked");
      cy.dataCy("command-row").should("not.exist");
      cy.dataCy("attached-repo-link").click();
      cy.location("pathname").should(
        "equal",
        `/${getRepoSettingsRoute(repo, ProjectSettingsTabRoutes.VirtualWorkstation)}`,
      );
      cy.contains("button", "Add Command").click();
      cy.dataCy("command-input").type("a repo command");
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated repo");
      // Go to project page
      cy.visit(origin);
      cy.dataCy("navitem-virtual-workstation").click();
      cy.dataCy("command-row")
        .contains("textarea", "a repo command")
        .should("have.attr", "aria-disabled", "true");
      // Override commands, add a command, default to repo then show override commands are cleared
      cy.contains("label", "Override Repo Commands")
        .as("overrideRepoCommandsButton")
        .click();
      cy.dataCy("command-row").should("not.exist");
      cy.contains("button", "Add Command").click();
      cy.dataCy("command-input").type("a project command");
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("command-row")
        .contains("textarea", "a project command")
        .should("have.attr", "aria-disabled", "false");
      cy.contains("label", "Default to Repo Commands").click();
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("command-row")
        .contains("textarea", "a repo command")
        .should("have.attr", "aria-disabled", "true");
      cy.get("@overrideRepoCommandsButton").click();
      cy.dataCy("command-row").should("not.exist");
    });

    it("Allows overriding without adding a command", () => {
      cy.contains("label", "Override Repo Commands").click();
      clickSaveAndConfirmDiff();
      cy.validateToast("success", "Successfully updated project");
      cy.getInputByLabel("Override Repo Commands").should("be.checked");
    });
  });
});
