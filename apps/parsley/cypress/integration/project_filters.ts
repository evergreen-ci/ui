describe("project filters", () => {
  const spruceLogLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  const resmokeLogLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e17b99558fd9c5e2faf70a00d15d";

  const getTableCheckbox = (index: number) =>
    cy.get(`[aria-label="Select row ${index}"]`);
  beforeEach(() => {
    cy.resetDrawerState();
  });

  it("should show a message if there are no filters", () => {
    cy.visit(spruceLogLink);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    cy.dataCy("project-filter").should("not.exist");
    cy.dataCy("no-filters-message").should("be.visible");
  });

  it("should be able to apply a filter", () => {
    cy.visit(resmokeLogLink);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    getTableCheckbox(0).check({ force: true });
    cy.contains("button", "Apply filters").click();
    cy.location("search").should(
      "contain",
      "111%28NETWORK%257CASIO%257CEXECUTOR%257CCONNPOOL%257CREPL_HB%29",
    );
    cy.get("[data-cy^='skipped-lines-row-']").should("exist");
  });

  it("properly processes filters with commas", () => {
    cy.visit(resmokeLogLink);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    getTableCheckbox(3).check({ force: true });
    cy.contains("button", "Apply filters").click();
    cy.location("search").should(
      "contain",
      "110%2522Connection%2520accepted%2522%252C%2522attr%2522",
    );
    cy.get("[data-cy^='skipped-lines-row-']").should("exist");
  });

  it("should disable checkbox if filter is already applied", () => {
    cy.visit(`${resmokeLogLink}?filters=111D%255Cd`);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    getTableCheckbox(1).should("have.attr", "aria-disabled", "true");
  });
});
