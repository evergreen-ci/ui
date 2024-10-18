describe("Test Analysis", () => {
  beforeEach(() => {
    cy.visit("/version/5e4ff3abe3c3317e352062e4/test-analysis");
  });

  it("should group together all matching failing tests in a version and present a stat", () => {
    cy.contains("1 test failed across more than one task").should("be.visible");
    cy.contains("JustAFakeTestInALonelyWorld").should("be.visible");
    cy.contains("JustAnotherFakeFailingTestInALonelyWorld").should(
      "be.visible",
    );
  });
  it("clicking on a test should show the test details", () => {
    cy.contains("JustAFakeTestInALonelyWorld").click();
    cy.dataCy("failed-test-grouped-table").should("be.visible");
  });
  it("filtering by test name should only show matching tests", () => {
    cy.getInputByLabel("Search Test Failures").type(
      "JustAFakeTestInALonelyWorld{enter}",
    );
    cy.contains("1 test failed across more than one task").should("be.visible");
    cy.contains("JustAFakeTestInALonelyWorld").should("be.visible");
    cy.contains("JustAnotherFakeFailingTestInALonelyWorld").should("not.exist");
  });
  it("filtering by task status should only show matching tests", () => {
    cy.getInputByLabel("Failure Type").click();
    cy.dataCy("task-status-known-issue-option").should("be.visible");
    cy.dataCy("task-status-known-issue-option").click();

    cy.contains("0 tests failed across more than one task").should(
      "be.visible",
    );
    cy.contains("JustAFakeTestInALonelyWorld").should("be.visible");
    cy.contains("JustAnotherFakeFailingTestInALonelyWorld").should("not.exist");
  });
  it("clearing the filters should reset the view", () => {
    cy.getInputByLabel("Search Test Failures").type(
      "JustAFakeTestInALonelyWorld{enter}",
    );
    cy.getInputByLabel("Failure Type").click();
    cy.dataCy("task-status-known-issue-option").should("be.visible");
    cy.dataCy("task-status-known-issue-option").click();
    cy.get("body").type("{esc}");

    cy.contains("0 tests failed across more than one task").should(
      "be.visible",
    );
    cy.dataCy("clear-filter-button").should("not.be.disabled");
    cy.dataCy("clear-filter-button").click({ force: true });
    cy.getInputByLabel("Search Test Failures").should("have.value", "");
    cy.contains("1 test failed across more than one task").should("be.visible");
  });
});
