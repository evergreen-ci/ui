import { getProjectSettingsRoute, project } from "./constants";
import { clickSaveAndConfirmDiff } from "./utils";

describe("Attaching Spruce to a repo", () => {
  const origin = getProjectSettingsRoute(project);

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Saves and attaches new repo and shows warnings on the relevant Github pages", () => {
    cy.dataCy("repo-input").as("repoInput").clear();
    cy.get("@repoInput").type("evergreen");
    cy.dataCy("attach-repo-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    clickSaveAndConfirmDiff();
    cy.validateToast("success", "Successfully updated project");
    cy.dataCy("attach-repo-button").click();
    cy.dataCy("attach-repo-modal").contains("button", "Attach").click();
    cy.validateToast("success", "Successfully attached to repo");

    cy.contains("button", "GitHub").click();
    cy.dataCy("navitem-pull-requests").click();
    cy.dataCy("pr-testing-enabled-radio-box")
      .prev()
      .dataCy("warning-banner")
      .should("exist");
    cy.dataCy("manual-pr-testing-enabled-radio-box")
      .prev()
      .dataCy("warning-banner")
      .should("exist");

    cy.dataCy("navitem-commit-checks").click();
    cy.dataCy("github-checks-enabled-radio-box").prev().should("not.exist");

    cy.dataCy("navitem-merge-queue").click();
    cy.dataCy("mq-card").dataCy("warning-banner").should("exist");
    cy.dataCy("mq-enabled-radio-box").within(($el) => {
      cy.wrap($el).getInputByLabel("Enabled").parent().click();
    });
    cy.dataCy("mq-card").dataCy("error-banner").should("exist");
  });
});
