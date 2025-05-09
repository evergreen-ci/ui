describe("variant history", () => {
  it("shows an error message if mainline commit history could not be retrieved", () => {
    cy.visit("/variant-history/bogus-project/bogus-variant");
    cy.dataCy("loading-cell").should("have.length", 0);
    cy.validateToast("error", "There was an error loading the variant history");
  });

  it("should link to variant history from the waterfall page", () => {
    cy.visit("/project/spruce/waterfall");
    cy.dataCy("build-variant-link").should("exist");
    cy.dataCy("build-variant-link")
      .first()
      .should("contain.text", "Ubuntu 16.04");
    cy.dataCy("build-variant-link").first().click();
    cy.location("pathname").should("eq", "/variant-history/spruce/ubuntu1604");
  });
  it(
    "should be able to paginate column headers",
    {
      viewportHeight: 600,
      viewportWidth: 1000,
    },
    () => {
      cy.visit("/variant-history/spruce/ubuntu1604");
      cy.dataCy("header-cell").should("have.length", 4);
      cy.dataCy("next-page-button").click();
      cy.dataCy("header-cell").should("have.length", 4);
      cy.dataCy("prev-page-button").click();
      cy.dataCy("header-cell").should("have.length", 4);
    },
  );
  it("should be able expand and collapse inactive commits", () => {
    cy.visit("/variant-history/spruce/ubuntu1604?selectedCommit=1238");
    // Expand
    cy.contains("EVG-16356").should("not.exist");
    cy.contains("Expand 1 inactive").should("be.visible");
    cy.contains("Expand 1 inactive").click();
    cy.contains("EVG-16356").should("be.visible");

    // Collapse
    cy.contains("Collapse 1 inactive").should("be.visible");
    cy.contains("Collapse 1 inactive").click();
    cy.contains("EVG-16356").should("not.be.visible");
  });
  it("should be able to filter column headers", () => {
    cy.visit("/variant-history/spruce/ubuntu1604");
    cy.dataCy("header-cell").should("have.length", 9);

    cy.getInputByLabel("Tasks").click();
    cy.get("[aria-label='compile']").click();
    cy.get("[aria-label='e2e_test']").click();

    cy.getInputByLabel("Tasks").click();
    cy.dataCy("header-cell").should("have.length", 2);

    // removing column header filters should restore all columns
    cy.getInputByLabel("Tasks").click();
    cy.get("[aria-label='compile']").click();
    cy.get("[aria-label='e2e_test']").click();

    cy.getInputByLabel("Tasks").click();
    cy.dataCy("header-cell").should("have.length", 9);
  });
  it("hovering over a failing task should show test results", () => {
    cy.visit(
      "/variant-history/spruce/ubuntu1604?failed=JustAFakeTestInALonelyWorld&selectedCommit=1236",
    );
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .should("have.length", 3);
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .should("be.visible");
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .first()
      .trigger("mouseover");
    cy.dataCy("test-tooltip").should("be.visible");
    cy.dataCy("test-tooltip").contains("JustAFakeTestInALonelyWorld");
    cy.dataCy("history-table-icon")
      .get("[data-status=failed]")
      .first()
      .trigger("mouseout");
  });
  describe("applying a test filter", () => {
    beforeEach(() => {
      cy.visit("/variant-history/spruce/ubuntu1604");
      cy.getInputByLabel("Filter by Failed Tests").should("exist");
      cy.getInputByLabel("Filter by Failed Tests").focus();
      cy.getInputByLabel("Filter by Failed Tests").type("JustA{enter}");
      cy.dataCy("filter-chip").should("exist");
      cy.dataCy("filter-chip").should("contain.text", "JustA");
    });
    it("should disable non matching tasks", () => {
      cy.dataCy("history-table-icon")
        .get("[data-status=success]")
        .each(($el) => {
          cy.wrap($el).should("have.attr", "aria-disabled", "true");
        });
    });
    it("should display a message and tooltip on matching tasks with test results", () => {
      cy.contains("1 / 1 Failing Tests").should("exist");
      cy.contains("1 / 1 Failing Tests").trigger("mouseover");
      cy.dataCy("test-tooltip").should("be.visible");
      cy.dataCy("test-tooltip").contains("JustAFakeTestInALonelyWorld");
    });
  });
});
