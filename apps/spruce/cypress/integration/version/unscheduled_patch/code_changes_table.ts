describe("Code Changes Table", () => {
  const patchId = "5ecedafb562343215a7ff297";

  beforeEach(() => {
    cy.visit(`/version/${patchId}/changes`);
  });

  it("Should display at least one table when there are code changes", () => {
    cy.dataCy("code-changes-table").should("exist");
  });

  it("Should link to code changes for the whole diff", () => {
    cy.dataCy("html-diff-btn")
      .should("have.attr", "href")
      .and("include", `filediff/${patchId}`);
    cy.dataCy("raw-diff-btn")
      .should("have.attr", "href")
      .and("include", `rawdiff/${patchId}`);
  });

  it("Should display collapsed code changes in table", () => {
    cy.get("button[aria-label='Expand row']").should("have.length", 4);
  });
});
