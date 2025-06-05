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

  it("is redirected to the waterfall page when a user visits a legacy route", () => {
    cy.visit("/commits/evergreen");
    cy.location("pathname").should("equal", "/project/evergreen/waterfall");
    cy.visit("/commits/evergreen?taskNames=test");
    cy.location("pathname").should("equal", "/project/evergreen/waterfall");
    cy.location("search").should("contain", "tasks=test");
    cy.visit("/commits/evergreen?buildVariants=Ubuntu");
    cy.location("pathname").should("equal", "/project/evergreen/waterfall");
    cy.location("search").should("contain", "buildVariants=Ubuntu");
  });
});
