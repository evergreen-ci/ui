import { SEEN_WATERFALL_ONBOARDING_TUTORIAL } from "constants/cookies";

describe("onboarding", () => {
  it("can go through all steps of the walkthrough", () => {
    cy.clearCookie(SEEN_WATERFALL_ONBOARDING_TUTORIAL);
    cy.visit("/project/evergreen/waterfall");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.dataCy("build-variant-label").should("be.visible");

    cy.dataCy("walkthrough-backdrop").should("be.visible");
    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("New Layout").should("be.visible");
    cy.contains("button", "Next").click();

    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("Reimagined Task Statuses").should("be.visible");
    cy.contains("button", "Next").click();

    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("Pin Build Variants").should("be.visible");
    cy.contains("button", "Next").click();

    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("Jump to Date").should("be.visible");
    cy.contains("button", "Next").click();

    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("Search by Git Hash").should("be.visible");
    cy.contains("button", "Next").click();

    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("Summary View").should("be.visible");
    cy.contains("button", "Get started").click();

    cy.dataCy("walkthrough-guide-cue").should("not.exist");
    cy.dataCy("walkthrough-backdrop").should("not.exist");
  });

  it("can restart the walkthrough", () => {
    cy.visit("/project/evergreen/waterfall");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.dataCy("build-variant-label").should("be.visible");
    cy.dataCy("walkthrough-backdrop").should("not.exist");
    cy.dataCy("walkthrough-guide-cue").should("not.exist");

    cy.dataCy("restart-walkthrough-button").click();
    cy.dataCy("walkthrough-backdrop").should("be.visible");
    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("New Layout").should("be.visible");
    cy.contains("button", "Next").should("be.visible");
  });

  it("can end walkthrough early using the dismiss button", () => {
    cy.clearCookie(SEEN_WATERFALL_ONBOARDING_TUTORIAL);
    cy.visit("/project/evergreen/waterfall");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.dataCy("build-variant-label").should("be.visible");

    cy.dataCy("walkthrough-backdrop").should("be.visible");
    cy.dataCy("walkthrough-guide-cue").should("be.visible");
    cy.contains("New Layout").should("be.visible");

    cy.get("[aria-label='Close Tooltip']").click();
    cy.dataCy("walkthrough-guide-cue").should("not.exist");
    cy.dataCy("walkthrough-backdrop").should("not.exist");
  });
});
