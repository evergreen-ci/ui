describe("Execution Tasks Timing", () => {
  const taskRoute =
    "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47";
  const executionTasksTimingRoute = `${taskRoute}/execution-tasks-timing`;

  describe("Tab Navigation", () => {
    it("Should be able to navigate to the Execution Tasks Timing tab", () => {
      cy.visit(taskRoute);
      cy.dataCy("execution-tasks-timing-tab").click();
      cy.location("pathname").should("eq", executionTasksTimingRoute);
    });
  });

  describe("Chart Rendering", () => {
    beforeEach(() => {
      cy.visit(executionTasksTimingRoute);
    });

    it("Should render the Gantt chart container", () => {
      cy.get("[id^=reactgooglegraph]").should("exist");
    });

    it("Should display task name in the description", () => {
      cy.contains(
        "This page shows a timeline view of execution task run times for asdf",
      ).should("be.visible");
    });

    it("Should render chart with execution tasks", () => {
      cy.get("[id^=reactgooglegraph]").should("exist");

      // Check that specific task names are rendered in the chart
      const expectedTasks = ["test-command", "test-db", "test-util"];

      cy.get("svg > g > text").then(($items) => {
        const textFound = Array.from($items, (item) => item.innerHTML);

        // Verify each expected task is present
        expectedTasks.forEach((task) => {
          expect(textFound).to.include(task);
        });
      });
    });
  });

  describe("Tab Visibility", () => {
    it("Should not show the Execution Tasks Timing tab for non-display tasks", () => {
      // Visit a regular task (not a display task)
      const regularTaskRoute =
        "/task/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
      cy.visit(regularTaskRoute);

      // The execution tasks timing tab should not be visible
      cy.dataCy("execution-tasks-timing-tab").should("not.exist");
    });
  });

  describe("Interaction", () => {
    beforeEach(() => {
      cy.visit(executionTasksTimingRoute);
    });

    it("Should allow clicking on tasks to navigate", () => {
      // Wait for chart to load
      cy.get("[id^=reactgooglegraph]").should("exist");

      // Google Charts makes tasks clickable within the chart
      cy.get("[id^=reactgooglegraph]").within(() => {
        // Find and click on "test-command" task
        cy.contains("test-command").click();
      });

      // Should navigate to the test-command task page
      cy.url().should(
        "equal",
        "http://localhost:3000/task/mci_ubuntu1604_test_command_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/logs?execution=0",
      );
    });
  });
});
