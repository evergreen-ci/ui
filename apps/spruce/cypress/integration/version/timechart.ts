describe("Timechart Tab without a variant selected", () => {
  beforeEach(() => {
    cy.visit("/version/5e4ff3abe3c3317e352062e4/timechart");
  });
  it("shows a chart of all variants in the version", () => {
    const expectedVariants = ["Ubuntu 16.04", "Lint", "Race Detector"];
    cy.get("svg > g > text").then(($items) => {
      const textFound = Array.from($items, (item) => item.innerHTML);
      expectedVariants.forEach((variant) => {
        expect(textFound).to.include(variant);
      });
    });
  });
});

describe("Timechart Tab with a variant selected", () => {
  beforeEach(() => {
    cy.visit(
      "/version/5e4ff3abe3c3317e352062e4/timechart?variant=^ubuntu1604%24",
    );
  });

  const expectedTasks = [
    [
      "test-agent",
      "test-cloud",
      "test-operations",
      "test-scheduler",
      "js-test",
      "test-units",
      "test-command",
      "test-model",
      "test-model-2",
      "test-model-host",
    ],
    [
      "test-validator",
      "test-thirdparty",
      "test-service",
      "test-rest-model",
      "test-rest-client",
      "test-graphql",
      "test-repotracker",
      "test-trigger",
      "test-rest-data",
      "test-rest-route",
    ],
    [
      "test-model-grid",
      "test-model-user",
      "test-model-testresult",
      "test-model-manifest",
      "test-model-notification",
      "test-model-commitqueue",
      "test-model-patch",
      "test-model-event",
      "test-monitor",
      "test-model-task",
    ],
    [
      "test-migrations",
      "test-model-alertrecord",
      "test-thirdparty-docker",
      "test-model-stats",
      "test-evergreen",
      "test-model-distro",
      "test-util",
      "test-model-artifact",
      "test-model-build",
      "test-plugin",
    ],
    ["test-db", "test-auth"],
  ];

  it("shows a paginated chart of all tasks in the variant", () => {
    // Iterate through each page of results and check the expected tasks are present
    expectedTasks.forEach((page) => {
      cy.get("svg > g > text").then(($items) => {
        const textFound = Array.from($items, (item) => item.innerHTML);
        page.forEach((task) => {
          expect(textFound).to.include(task);
        });
        cy.get('[data-cy="next-page-button"]').click();
      });
    });

    // Reverse and iterate through each page of results and check the expected tasks are present
    expectedTasks.reverse().forEach((page) => {
      cy.get("svg > g > text").then(($items) => {
        const textFound = Array.from($items, (item) => item.innerHTML);
        page.forEach((task) => {
          expect(textFound).to.include(task);
        });
        cy.get('[data-cy="prev-page-button"]').click();
      });
    });
  });

  it("allows the user to change the page size", () => {
    cy.get('[data-cy="tasks-table-page-size-selector"]').click();
    cy.get('[data-cy="styled-select-option-50"]').click();
    cy.get("svg > g > text").then(($items) => {
      const textFound = Array.from($items, (item) => item.innerHTML);
      expectedTasks.flat().forEach((task) => {
        expect(textFound).to.include(task);
      });
    });
  });
});
