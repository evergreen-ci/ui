import { clickOnPageSizeBtnAndAssertURLandTableSize } from "../../utils";

describe("Version Timing Tab without a variant selected", () => {
  beforeEach(() => {
    cy.visit("/version/5e4ff3abe3c3317e352062e4/version-timing");
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
  it("allows the user to select a variant and see the tasks in it", () => {
    cy.get("[id^=reactgooglegraph]").within(() => {
      cy.contains("Ubuntu 16.04").click();
    });
    cy.url().should(
      "include",
      "/version/5e4ff3abe3c3317e352062e4/version-timing?variant=%5Eubuntu1604%24",
    );
  });

  it("has disabled pagination functionality", () => {
    cy.get("button[aria-labelledby='page-size-select']").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.dataCy("next-page-button").should("have.attr", "aria-disabled", "true");
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
    cy.dataCy("clear-all-filters").should("have.attr", "aria-disabled", "true");
  });
});

describe("Version Timing Tab with a variant selected", () => {
  beforeEach(() => {
    cy.visit(
      "/version/5e4ff3abe3c3317e352062e4/version-timing?variant=^ubuntu1604%24",
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

  it("respects the task filter", () => {
    cy.visit(
      "/version/5e4ff3abe3c3317e352062e4/version-timing?taskName=agent&variant=^ubuntu1604%24",
    );
    cy.dataCy("next-page-button").should("have.attr", "aria-disabled", "true");
    cy.get("svg > g > text").then(($items) => {
      const textFound = Array.from($items, (item) => item.innerHTML);
      expectedTasks.flat().forEach((task) => {
        if (task.includes("agent")) {
          expect(textFound).to.include(task);
        } else {
          expect(textFound).to.not.include(task);
        }
      });
    });
  });

  it("allows the user to clear all filters", () => {
    cy.get('[data-cy="clear-all-filters"]').click();

    cy.url().should(
      "equal",
      "http://localhost:3000/version/5e4ff3abe3c3317e352062e4/version-timing?sorts=DURATION%3ADESC",
    );

    const expectedVariants = ["Ubuntu 16.04", "Lint", "Race Detector"];
    cy.get("svg > g > text").then(($items) => {
      const textFound = Array.from($items, (item) => item.innerHTML);
      expectedVariants.forEach((variant) => {
        expect(textFound).to.include(variant);
      });
    });
  });

  it("allows the user to change the page size", () => {
    clickOnPageSizeBtnAndAssertURLandTableSize(50, "");
    cy.get("svg > g > text").then(($items) => {
      const textFound = Array.from($items, (item) => item.innerHTML);
      expectedTasks.flat().forEach((task) => {
        expect(textFound).to.include(task);
      });
    });
  });

  it("allows the user to select a task and navigate to it", () => {
    cy.get("[id^=reactgooglegraph]").within(() => {
      cy.contains("test-agent").click();
    });
    cy.url().should(
      "include",
      "task/evergreen_ubuntu1604_test_agent_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs?execution=0",
    );
  });
});
