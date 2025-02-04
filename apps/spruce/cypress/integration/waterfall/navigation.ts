describe("navigation", () => {
  it("can view the waterfall page", () => {
    cy.visit("/project/evergreen/waterfall");
    cy.dataCy("waterfall-page").should("be.visible");
  });

  it("can visit other projects using project select", () => {
    cy.visit("/project/evergreen/waterfall");
    cy.dataCy("waterfall-page").should("be.visible");

    cy.dataCy("project-select").click();
    cy.dataCy("project-display-name").contains("Spruce").click();
    cy.location("pathname").should("equal", "/project/spruce/waterfall");
    cy.dataCy("waterfall-page").should("be.visible");
  });

  it("nav bar items change if opted into beta test", () => {
    cy.visit("/preferences/ui-settings");

    // The beta test is enabled but the user is not opted in.
    cy.dataCy("project-health-link").should("be.visible");
    cy.dataCy("waterfall-link").should("not.exist");
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-waterfall").should("be.visible");
    cy.dataCy("auxiliary-dropdown-project-health").should("not.exist");

    // Opt the user in to the beta test.
    cy.dataCy("spruce-waterfall-enabled").within(() => {
      cy.get('[data-label="Enabled"]').click({ force: true });
    });
    cy.dataCy("save-beta-features-button").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.dataCy("save-beta-features-button").click();
    cy.validateToast("success", "Your changes have been saved.");

    // Nav bar items should have changed.
    cy.dataCy("project-health-link").should("not.exist");
    cy.dataCy("waterfall-link").should("be.visible");
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-waterfall").should("not.exist");
    cy.dataCy("auxiliary-dropdown-project-health").should("be.visible");
  });
});
