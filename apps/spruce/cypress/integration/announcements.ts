import { CY_DISABLE_COMMITS_WELCOME_MODAL } from "constants/cookies";

describe("Announcement overlays", () => {
  it("Should not show a Sitewide banner after it has been dismissed", () => {
    cy.clearCookie("This is an important notification");
    cy.visit("/");
    cy.dataCy("sitewide-banner-success").should("exist");
    cy.closeBanner("sitewide-banner-success");
    cy.dataCy("sitewide-banner-success").should("not.exist");
    cy.visit("/");
    cy.dataCy("sitewide-banner-success").should("not.exist");
  });

  it("Should close the announcement toast if one exists", () => {
    cy.visit("/");
    cy.get("body").then(($body) => {
      if ($body.find("div[data-cy=toast]").length > 0) {
        cy.dataCy("toast").should("exist");
        cy.visit("/");
        cy.dataCy("toast").find("button").click();
        cy.visit("/");
        cy.dataCy("toast").should("not.exist");
      }
    });
  });

  it("visiting the commits page for the first time should show the waterfall beta modal", () => {
    cy.clearCookie(CY_DISABLE_COMMITS_WELCOME_MODAL);
    cy.visit("/commits/spruce");
    cy.dataCy("waterfall-modal").should("be.visible");
    cy.contains("Maybe later, continue to Project Health").click();
    cy.reload();
    cy.dataCy("waterfall-modal").should("not.exist");
  });
});
