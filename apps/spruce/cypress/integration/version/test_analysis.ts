describe("Test Analysis", () => {
  beforeEach(() => {
    cy.visit(
      "/version/spruce_74af23f72da201d5bd7b651161ab8e496bf44ec7/test-analysis",
    );
  });

  it("should group together all matching failing tests in a version and present a stat", () => {
    cy.contains("1 test failed across more than one task").should("be.visible");
    cy.contains("JustAFakeTestInALonelyWorld failed on 2 tasks").should(
      "be.visible",
    );
    cy.contains(
      "JustAnotherFakeFailingTestInALonelyWorld failed on 1 task",
    ).should("be.visible");
  });
  it("clicking on a test should show the test details", () => {
    cy.contains("JustAFakeTestInALonelyWorld failed on 2 tasks").click();
    cy.dataCy("failed-test-grouped-table").should("be.visible");
  });
  it("filtering by test name should only show matching tests", () => {
    cy.getInputByLabel("Search Test Failures").type(
      "JustAFakeTestInALonelyWorld{enter}",
    );
    cy.contains("1 test failed across more than one task").should("be.visible");
    cy.contains("JustAFakeTestInALonelyWorld failed on 2 tasks").should(
      "be.visible",
    );
    cy.contains(
      "JustAnotherFakeFailingTestInALonelyWorld failed on 1 task",
    ).should("not.exist");
  });
});
