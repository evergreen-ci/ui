describe("navigation", () => {
  it("can view the waterfall page", () => {
    cy.visit("/project/evergreen/waterfall");
    cy.dataCy("waterfall-page").should("be.visible");
  });
});
