import { clickSave } from "../../utils";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
  saveButtonEnabled,
} from "./constants";

describe("Repo Settings", () => {
  const origin = getRepoSettingsRoute(repo);

  beforeEach(() => {
    cy.visit(origin);
  });

  describe("General settings page", () => {
    it("Should have the save button disabled on load", () => {
      saveButtonEnabled(false);
    });

    it("Does not show a 'Default to Repo' button on page", () => {
      cy.dataCy("default-to-repo-button").should("not.exist");
    });

    it("Does not show a 'Move to New Repo' button on page", () => {
      cy.dataCy("move-repo-button").should("not.exist");
    });

    it("Does not show an Attach/Detach to Repo button on page", () => {
      cy.dataCy("attach-repo-button").should("not.exist");
    });

    it("Does not show a 'Go to repo settings' link on page", () => {
      cy.dataCy("attached-repo-link").should("not.exist");
    });
    it("Inputting a display name then clicking save shows a success toast", () => {
      cy.dataCy("display-name-input").type("evg");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
    });
  });

  describe("GitHub page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-github-commitqueue").click();
      saveButtonEnabled(false);
    });
    describe("GitHub section", () => {
      it("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", () => {
        cy.dataCy("github-checks-enabled-radio-box")
          .contains("label", "Enabled")
          .click();
        cy.dataCy("error-banner")
          .contains(
            "A Commit Check Definition must be specified for this feature to run.",
          )
          .as("errorBanner");
        cy.get("@errorBanner").should("be.visible");
        cy.dataCy("github-checks-enabled-radio-box")
          .contains("label", "Disabled")
          .click();
        cy.get("@errorBanner").should("not.exist");
      });

      it("Allows enabling manual PR testing", () => {
        cy.dataCy("manual-pr-testing-enabled-radio-box")
          .children()
          .first()
          .click();
      });
      it("Saving a patch defintion should hide the error banner, success toast and displays disable patch definitions for the repo", () => {
        cy.contains(
          "A GitHub Patch Definition must be specified for this feature to run.",
        ).as("errorBanner");
        cy.get("@errorBanner").should("be.visible");
        cy.contains("button", "Add Patch Definition").click();
        cy.get("@errorBanner").should("not.exist");
        saveButtonEnabled(false);
        cy.dataCy("variant-tags-input").first().type("vtag");
        cy.dataCy("task-tags-input").first().type("ttag");
        saveButtonEnabled(true);
        clickSave();
        cy.validateToast("success", "Successfully updated repo");
        cy.visit(getProjectSettingsRoute(projectUseRepoEnabled));
        cy.dataCy("navitem-github-commitqueue").click();
        cy.contains("Repo Patch Definition 1")
          .as("patchDefAccordion")
          .scrollIntoView();
        cy.get("@patchDefAccordion").click();
        cy.dataCy("variant-tags-input").should("have.value", "vtag");
        cy.dataCy("variant-tags-input").should(
          "have.attr",
          "aria-disabled",
          "true",
        );
        cy.dataCy("task-tags-input").should("have.value", "ttag");
        cy.dataCy("task-tags-input").should(
          "have.attr",
          "aria-disabled",
          "true",
        );
        cy.contains(
          "A GitHub Patch Definition must be specified for this feature to run.",
        ).should("not.exist");
      });
    });

    describe("Merge Queue section", () => {
      beforeEach(() => {
        cy.dataCy("cq-enabled-radio-box")
          .contains("label", "Enabled")
          .as("enableCQButton")
          .scrollIntoView();
      });
      it("Enabling merge queue shows hidden inputs and error banner", () => {
        cy.dataCy("cq-card")
          .children()
          .as("cqCardFields")
          .should("have.length", 2);

        cy.get("@enableCQButton").click();
        cy.get("@cqCardFields").should("have.length", 3);
        cy.contains("Merge Queue Patch Definitions").scrollIntoView();
        cy.dataCy("error-banner")
          .contains(
            "A Merge Queue Patch Definition must be specified for this feature to run.",
          )
          .should("be.visible");
      });

      it("Does not show override buttons for merge queue patch definitions", () => {
        cy.get("@enableCQButton").click();
        cy.dataCy("cq-override-radio-box").should("not.exist");
      });

      it("Saves a merge queue definition", () => {
        cy.get("@enableCQButton").click();
        cy.contains("button", "Add Patch Definition").click();
        cy.dataCy("variant-tags-input").first().type("vtag");
        cy.dataCy("task-tags-input").first().type("ttag");
        saveButtonEnabled(false);
        cy.contains("button", "Add merge queue patch definition").click();
        cy.dataCy("variant-tags-input").last().type("cqvtag");
        cy.dataCy("task-tags-input").last().type("cqttag");
        cy.dataCy("warning-banner").should("not.exist");
        cy.dataCy("error-banner").should("not.exist");
        clickSave();
        cy.validateToast("success", "Successfully updated repo");
      });
    });
  });

  describe("Patch Aliases page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-patch-aliases").click();
      saveButtonEnabled(false);
      cy.dataCy("patch-aliases-override-radio-box").should("not.exist");
    });

    it("Saving a patch alias shows a success toast, the alias name in the card title and in the repo defaulted project", () => {
      cy.dataCy("add-button").contains("Add Patch Alias").parent().click();
      cy.dataCy("expandable-card-title").contains("New Patch Alias");
      cy.dataCy("alias-input").type("my alias name");
      saveButtonEnabled(false);
      cy.dataCy("variant-tags-input").first().type("alias variant tag");
      cy.dataCy("task-tags-input").first().type("alias task tag");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.dataCy("expandable-card-title").contains("my alias name");
      // Verify persistence
      cy.reload();
      cy.dataCy("expandable-card-title").contains("my alias name");
      cy.visit(
        getProjectSettingsRoute(
          projectUseRepoEnabled,
          ProjectSettingsTabRoutes.Access,
        ),
      );
      cy.dataCy("default-to-repo-button").should(
        "have.attr",
        "aria-disabled",
        "false",
      );
      cy.dataCy("default-to-repo-button").click();
      cy.dataCy("default-to-repo-modal").should("be.visible");
      cy.getInputByLabel('Type "confirm" to confirm your action').type(
        "confirm",
      );
      cy.dataCy("default-to-repo-modal").contains("Confirm").click();
      cy.validateToast("success", "Successfully defaulted page to repo");
      cy.dataCy("navitem-patch-aliases").click();
      cy.dataCy("expandable-card-title").contains("my alias name");
      cy.dataCy("expandable-card-title")
        .parentsUntil("div")
        .first()
        .click({ force: true });
      cy.dataCy("expandable-card")
        .find("input")
        .should("have.attr", "aria-disabled", "true");
      cy.dataCy("expandable-card").find("button").should("be.disabled");
    });

    it("Saving a Patch Trigger Alias shows a success toast and updates the Github page", () => {
      cy.dataCy("add-button")
        .contains("Add Patch Trigger Alias")
        .parent()
        .click();
      cy.dataCy("pta-alias-input").type("my-alias");
      cy.dataCy("project-input").type("spruce");
      cy.dataCy("module-input").type("module_name");
      cy.contains("button", "Variant/Task").click();
      cy.dataCy("variant-regex-input").type(".*");
      cy.dataCy("task-regex-input").type(".*");
      cy.getInputByLabel("Schedule in GitHub Pull Requests").as(
        "pullRequestCheckbox",
      );
      cy.get("@pullRequestCheckbox").should("not.be.checked");
      cy.get("@pullRequestCheckbox").check({ force: true });
      cy.get("@pullRequestCheckbox").should("be.checked");
      cy.getInputByLabel("Schedule in GitHub Merge Queue").as(
        "mergeQueueCheckbox",
      );
      cy.get("@mergeQueueCheckbox").should("not.be.checked");
      cy.get("@mergeQueueCheckbox").check({ force: true });
      cy.get("@mergeQueueCheckbox").should("be.checked");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      saveButtonEnabled(false);
      // Demonstrate Wait on field is optional
      cy.selectLGOption("Wait on", "Success");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false",
      );
      saveButtonEnabled(true);
      cy.selectLGOption("Wait on", "Select event…");
      cy.getInputByLabel("Wait on").should(
        "have.attr",
        "aria-invalid",
        "false",
      );
      saveButtonEnabled(false);
      // Verify information on Github page
      cy.dataCy("navitem-github-commitqueue").click();

      cy.contains("Pull Request Trigger Aliases").scrollIntoView();
      cy.dataCy("github-pr-trigger-aliases").within(() => {
        cy.dataCy("pta-item").should("have.length", 1);
        cy.contains("my-alias").should("be.visible");
        cy.dataCy("pta-item").trigger("mouseover");
      });
      // The tooltip is rendered in a different part of the DOM so we can't chain the 'within' command.
      cy.dataCy("pta-tooltip").should("be.visible");
      cy.dataCy("pta-tooltip").contains("spruce");
      cy.dataCy("pta-tooltip").contains("module_name");
      cy.dataCy("pta-tooltip").contains("Variant/Task Regex Pairs");
      cy.dataCy("github-pr-trigger-aliases").within(() => {
        cy.dataCy("pta-item").trigger("mouseout");
      });

      cy.contains("Merge Queue Trigger Aliases").scrollIntoView();
      cy.dataCy("github-mq-trigger-aliases").within(() => {
        cy.dataCy("pta-item").should("have.length", 1);
        cy.contains("my-alias").should("be.visible");
        cy.dataCy("pta-item").trigger("mouseover");
      });
      cy.dataCy("pta-tooltip").should("be.visible");
      cy.dataCy("pta-tooltip").contains("spruce");
      cy.dataCy("pta-tooltip").contains("module_name");
      cy.dataCy("pta-tooltip").contains("Variant/Task Regex Pairs");
    });
  });

  describe("Virtual Workstation page", () => {
    beforeEach(() => {
      cy.dataCy("navitem-virtual-workstation").click();
    });

    it("Adds two commands and then reorders them", () => {
      saveButtonEnabled(false);
      cy.dataCy("add-button").click();
      cy.dataCy("command-input").type("command 1");
      cy.dataCy("directory-input").type("mongodb.user.directory");

      cy.dataCy("add-button").click();
      cy.dataCy("command-input").eq(1).type("command 2");
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.dataCy("array-down-button").click();
      cy.dataCy("save-settings-button").scrollIntoView();
      clickSave();
      cy.validateToast("success", "Successfully updated repo");
      cy.dataCy("command-input").first().should("have.value", "command 2");
      cy.dataCy("command-input").eq(1).should("have.value", "command 1");
    });
  });
});
