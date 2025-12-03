describe("Code Changes Table", () => {
  const patchId = "5ecedafb562343215a7ff297";

  beforeEach(() => {
    cy.visit(`/version/${patchId}/changes`);
  });

  it("Should display at least one table when there are code changes", () => {
    cy.dataCy("code-changes-table").should("exist");
  });
  it("Should link to code changes when they exist", () => {
    cy.dataCy("fileLink")
      .should("have.attr", "href")
      .and("include", `/version/${patchId}/file-diff`)
      .and("include", "commit_number=")
      .and("include", "file_name=")
      .and("include", "patch_number=");
    cy.dataCy("html-diff-btn")
      .should("have.attr", "href")
      .and("include", `/version/${patchId}/diff`)
      .and("include", "patch_number=");
    cy.dataCy("raw-diff-btn")
      .should("have.attr", "href")
      .and("include", `rawdiff/${patchId}`);
  });
});
