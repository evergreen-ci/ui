describe("status filtering", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("filters on failed tasks", () => {
    cy.dataCy("inactive-versions-button").first().contains("1");
    cy.dataCy("status-filter").click();
    cy.dataCy("failed-option").click();
    cy.get("a[data-tooltip]").should("have.length", 1);
    cy.dataCy("version-label-active").should("have.length", 5);
  });
});
