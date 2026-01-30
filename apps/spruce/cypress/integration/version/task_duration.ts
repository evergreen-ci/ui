describe("Task Duration Tab", () => {
  beforeEach(() => {
    cy.visit("/version/5e4ff3abe3c3317e352062e4/task-duration");
  });
  describe("when interacting with the filters on the page", () => {
    it("updates URL appropriately when task name filter is applied", () => {
      const filterText = "test-annotation";
      // Apply text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("task-name-filter-popover-input-filter").type(
        `${filterText}{enter}`,
      );
      cy.dataCy("task-duration-table-row").should("have.length", 1);
      cy.location("search").should(
        "include",
        `page=0&sorts=DURATION%3ADESC&taskName=${filterText}`,
      );
      // Clear text filter.
      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("task-name-filter-popover-input-filter").clear();
      cy.dataCy("task-name-filter-popover-input-filter").type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when status filter is applied", () => {
      // Apply status filter.
      cy.dataCy("status-filter-popover").click();
      cy.dataCy("tree-select-options").within(() =>
        cy.contains("Running").click({ force: true }),
      );
      cy.dataCy("task-duration-table-row").should("have.length", 3);
      cy.location("search").should(
        "include",
        "page=0&sorts=DURATION%3ADESC&statuses=running-umbrella,started,dispatched",
      );
      // Clear status filter.
      cy.dataCy("status-filter-popover").click();
      cy.dataCy("tree-select-options").within(() =>
        cy.contains("Succeeded").click({ force: true }),
      );
      cy.location("search").should("include", "page=0&sorts=DURATION%3ADESC");
    });

    it("updates URL appropriately when build variant filter is applied", () => {
      const filterText = "Lint";
      // Apply text filter.
      cy.dataCy("build-variant-filter-popover").click();
      cy.dataCy("build-variant-filter-popover-input-filter").type(
        `${filterText}{enter}`,
      );
      cy.dataCy("task-duration-table-row").should("have.length", 2);
      cy.location("search").should(
        "include",
        `page=0&sorts=DURATION%3ADESC&variant=${filterText}`,
      );
      // Clear text filter.
      cy.dataCy("build-variant-filter-popover").click();
      cy.dataCy("build-variant-filter-popover-input-filter").clear();
      cy.dataCy("build-variant-filter-popover-input-filter").type("{enter}");
      cy.location("search").should("include", `page=0`);
    });

    it("updates URL appropriately when sort is changing", () => {
      const durationSortControl = "button[aria-label='Sort by Task Duration']";
      const statusSortControl = "button[aria-label='Sort by Status']";
      const variantSortControl = "button[aria-label='Sort by Build Variant']";
      // The default sort (DURATION DESC) should be applied
      cy.location("search").should("include", "sorts=DURATION%3ADESC");
      const longestTask = "test-thirdparty";
      cy.contains(longestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", longestTask);
      cy.get(durationSortControl).click();
      cy.location("search").should("not.include", "duration");
      cy.get(durationSortControl).click();
      cy.location("search").should("include", "sorts=DURATION%3AASC");
      const shortestTask = "clone_test-model";
      cy.contains(shortestTask).should("be.visible");
      cy.dataCy("task-duration-table-row")
        .first()
        .should("contain", shortestTask);
      cy.get(statusSortControl).click();
      cy.location("search").should(
        "include",
        "page=0&sorts=DURATION%3AASC%3BSTATUS%3AASC",
      );
      cy.get(statusSortControl).click();
      cy.location("search").should(
        "include",
        "page=0&sorts=DURATION%3AASC%3BSTATUS%3ADESC",
      );
      cy.get(variantSortControl).click();
      cy.location("search").should(
        "include",
        "page=0&sorts=DURATION%3AASC%3BSTATUS%3ADESC",
      );
    });

    it("clearing all filters resets to the default sort", () => {
      const durationSortControl = "button[aria-label='Sort by Task Duration']";
      cy.get(durationSortControl).click();
      cy.location("search").should("not.include", "duration");
      cy.get(durationSortControl).click();
      cy.location("search").should("include", "sorts=DURATION%3AASC");
      cy.contains("Clear all filters").click();
      cy.location("search").should("include", "sorts=DURATION%3ADESC");
    });

    it("shows message when no test results are found", () => {
      const filterText = "this_does_not_exist";

      cy.dataCy("task-name-filter-popover").click();
      cy.dataCy("task-name-filter-popover-input-filter").type(
        `${filterText}{enter}`,
      );
      cy.dataCy("task-name-filter-popover-task-duration-table-row").should(
        "have.length",
        0,
      );
      cy.contains("No tasks found.").should("exist");
    });
  });
});
