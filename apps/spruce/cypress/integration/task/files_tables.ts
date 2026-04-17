describe("files table", () => {
  const FILES_ROUTE = "/task/evergreen_ubuntu1604_89/files";
  const FILES_ROUTE_WITHOUT_FILES =
    "/task/evergreen_ubuntu1604_test_model_commitqueue_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/files";
  const FILES_ROUTE_WITH_ASSOCIATED_LINKS =
    "/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/files?execution=0";

  it("Searching for a non existent value yields 0 results, tables will not render and will display 'No files found'", () => {
    cy.visit(FILES_ROUTE);
    cy.dataCy("file-search-input").type("Hello world");
    cy.dataCy("files-table").should("not.exist");
    cy.dataCy("file-link").should("not.exist");
    cy.contains("No files found");
  });

  it("Searching for a value yields results across multiple tables", () => {
    cy.visit(FILES_ROUTE);
    cy.dataCy("file-search-input").type("458");
    cy.dataCy("file-link").should("have.length", 4);
  });

  it("Should display 'No files found' after loading a task without files", () => {
    cy.visit(FILES_ROUTE_WITHOUT_FILES);
    cy.contains("No files found");
  });

  it("Should display associated links when a file has them", () => {
    cy.visit(FILES_ROUTE_WITH_ASSOCIATED_LINKS);
    cy.dataCy("file-link").contains("sample file").should("be.visible");

    cy.dataCy("associated-links-container").should("be.visible");
    cy.dataCy("associated-links-container").contains("Associated Links");
    cy.dataCy("associated-link").contains("Documentation").should("be.visible");
    cy.dataCy("associated-link").contains("Test Results").should("be.visible");
  });
});
