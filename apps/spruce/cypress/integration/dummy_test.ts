describe("Downstream Projects Tab", () => {
  const DOWNSTREAM_ROUTE = `/version/5f74d99ab2373627c047c5e5/downstream-projects`;

  beforeEach(() => {
    cy.visit(DOWNSTREAM_ROUTE);
  });

  it("shows number of failed patches in the Downstream tab label", () => {
    cy.dataCy("downstream-tab-badge").should("exist");
    cy.dataCy("downstream-tab-badge").should("contain.text", "1");
  });
});
