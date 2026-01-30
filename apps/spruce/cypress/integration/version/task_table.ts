import { SEEN_TASK_REVIEW_TOOLTIP } from "constants/cookies";
import {
  clickOnPageSizeBtnAndAssertURLandTableSize,
  waitForTaskTable,
} from "../../utils";

const pathTasks = "/version/5e4ff3abe3c3317e352062e4/tasks";
const patchDescriptionTasksExist = "dist";

describe("Task table", () => {
  it("Loading skeleton does not persist when you navigate to Patch page from My Patches and adjust a filter", () => {
    cy.visit("user/patches");
    cy.dataCy("patch-card-patch-link")
      .filter(`:contains(${patchDescriptionTasksExist})`)
      .click();
    cy.dataCy("tasks-table").should("exist");
  });

  it("Updates sorting in the url when column headers are clicked", () => {
    cy.visit(pathTasks);
    waitForTaskTable();
    cy.dataCy("tasks-table-row").should("be.visible");

    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
    );

    const nameSortControl = "button[aria-label='Sort by Name']";
    const statusSortControl = "button[aria-label='Sort by Task Status']";
    const baseStatusSortControl =
      "button[aria-label='Sort by Previous Status']";
    const variantSortControl = "button[aria-label='Sort by Variant']";

    cy.get(nameSortControl).click();
    cy.location("search").should("contain", "BASE_STATUS%3ADESC%3BNAME%3AASC");

    cy.get(variantSortControl).click();
    cy.location("search").should("contain", "sorts=NAME%3AASC%3BVARIANT%3AASC");

    cy.get(statusSortControl).click();
    cy.location("search").should(
      "contain",
      "sorts=VARIANT%3AASC%3BSTATUS%3AASC",
    );

    cy.get(baseStatusSortControl).click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3AASC",
    );

    cy.get(baseStatusSortControl).click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
    );

    cy.get(baseStatusSortControl).click();
    cy.location("search").should("contain", "sorts=STATUS%3AASC");
  });

  it("Clicking task name goes to task page for that task", () => {
    cy.visit(pathTasks);
    cy.dataCy("tasks-table-row")
      .eq(0)
      .within(() => {
        cy.get("a").should("have.attr", "href").and("include", "/task");
      });
  });

  it("Task count displays total tasks", () => {
    cy.visit(pathTasks);
    cy.dataCy("total-count").first().contains("49");
  });

  describe("Changing page number", () => {
    // Instead of checking the entire table rows lets just check if the elements on the table have changed
    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      cy.visit(`${pathTasks}?page=0`);
      cy.dataCy(dataCyTableRows).should("be.visible");

      const firstPageRows = tableRowToText(dataCyTableRows);
      cy.dataCy(dataCyNextPage).click();
      cy.dataCy(dataCyTableRows).should("be.visible");

      const secondPageRows = tableRowToText(dataCyTableRows);

      expect(firstPageRows).to.not.eq(secondPageRows);
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      cy.visit(`${pathTasks}?page=1`);
      cy.dataCy(dataCyTableRows).should("be.visible");
      const secondPageRows = tableRowToText(dataCyTableRows);
      cy.dataCy(dataCyPrevPage).click();
      cy.dataCy(dataCyTableRows).should("be.visible");
      const firstPageRows = tableRowToText(dataCyTableRows);
      expect(firstPageRows).to.not.eq(secondPageRows);
    });

    it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
      cy.visit(`${pathTasks}?page=0`);
      cy.dataCy(dataCyTableRows).should("be.visible");
      cy.dataCy(dataCyPrevPage).should("have.attr", "aria-disabled", "true");
    });

    it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      cy.visit(`${pathTasks}?page=4`);
      cy.dataCy(dataCyTableRows).should("be.visible");
      cy.dataCy(dataCyNextPage).should("have.attr", "aria-disabled", "true");
    });
  });

  describe("Changing page limit", () => {
    it("Changing page size updates URL and renders less than or equal to that many rows", () => {
      [20, 50, 100].forEach((pageSize) => {
        it(`when the page size is set to ${pageSize}`, () => {
          cy.visit(pathTasks);
          cy.dataCy("tasks-table").should("exist");
          cy.dataCy(dataCyTableRows).should("be.visible");
          clickOnPageSizeBtnAndAssertURLandTableSize(
            pageSize,
            dataCyTableDataRows,
          );
        });
      });
    });
  });

  describe("blocked tasks", () => {
    beforeEach(() => {
      cy.visit(`${pathTasks}?limit=100`);
      waitForTaskTable();
    });

    it("shows the blocking tasks when hovering over status badge", () => {
      cy.dataCy("depends-on-tooltip").should("not.exist");
      cy.dataCy("task-status-badge").contains("Blocked").trigger("mouseover");
      cy.dataCy("depends-on-tooltip").should("be.visible");
      cy.dataCy("depends-on-tooltip").contains(
        "Depends on tasks: “test-migrations”, “test-graphql”",
      );
    });
  });

  describe("task review", () => {
    it("marks tasks as viewed and preserves their state on reload", () => {
      cy.visit(pathTasks);
      cy.dataCy(`reviewed-${firstTaskId}`).check({ force: true });
      cy.dataCy(`reviewed-${firstTaskId}`).should("be.checked");

      cy.get(`button[aria-label='Expand row']`).click();
      cy.dataCy(`reviewed-${executionTaskId1}`).should(
        "have.attr",
        "aria-disabled",
        "true",
      );
      cy.dataCy(`reviewed-${executionTaskId2}`).check({ force: true });
      cy.dataCy(`reviewed-${displayTaskId}`).should("be.checked");
      cy.dataCy(`reviewed-${displayTaskId}`).uncheck({ force: true });
      cy.dataCy(`reviewed-${displayTaskId}`).should("not.be.checked");
      cy.dataCy(`reviewed-${executionTaskId2}`).should("not.be.checked");
      cy.dataCy(`reviewed-${displayTaskId}`).check({ force: true });
      cy.dataCy(`reviewed-${displayTaskId}`).should("be.checked");
      cy.dataCy(`reviewed-${executionTaskId2}`).should("be.checked");

      cy.reload();

      cy.dataCy(`reviewed-${firstTaskId}`).should("be.checked");
      cy.dataCy(`reviewed-${displayTaskId}`).should("be.checked");
      cy.get(`button[aria-label='Expand row']`).click();
      cy.dataCy(`reviewed-${executionTaskId2}`).should("be.checked");
    });

    describe("announcement tooltip", () => {
      const resetDate = (d: Date) => {
        cy.clock().then((clock) => {
          // Need to restore to set a new system date
          clock.restore();
        });
        cy.clock(d, ["Date"]);
        // Reload to apply clock changes
        cy.reload();
      };

      beforeEach(() => {
        cy.clearCookie(SEEN_TASK_REVIEW_TOOLTIP);
        cy.visit(pathTasks);
        waitForTaskTable();
      });

      it("shows the announcement tooltip open on the first viewing", () => {
        cy.contains("New feature: Task Review").should("be.visible");
      });

      it("shows the info icon one day after the initial close and hides it after one week", () => {
        const now = new Date(2025, 1, 1); // month is 0-indexed
        resetDate(now);
        cy.contains("New feature: Task Review").should("be.visible");
        cy.contains("button", "Got it").click();

        const tomorrow = new Date(2025, 1, 2);
        resetDate(tomorrow);
        cy.contains("Reviewed").should("be.visible");
        cy.contains("New feature: Task Review").should("not.exist");
        cy.dataCy("announcement-tooltip-trigger").click({ force: true });

        const nextWeek = new Date(2025, 1, 9);
        resetDate(nextWeek);
        cy.contains("Reviewed").should("be.visible");
        cy.contains("New feature: Task Review").should("not.exist");
        cy.dataCy("announcement-tooltip-trigger").should("not.exist");
      });
    });
  });
});

const firstTaskId =
  "evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
const displayTaskId = "evergreen_ubuntu1604_89";
const executionTaskId1 = "exec1";
const executionTaskId2 = "exec2";

const dataCyTableDataRows = "[data-cy=tasks-table-row]";
const dataCyTableRows = "tasks-table-row";

const dataCyNextPage = "next-page-button";
const dataCyPrevPage = "prev-page-button";

const tableRowToText = (selector: string) =>
  new Cypress.Promise((resolve) => {
    cy.dataCy(selector)
      .invoke("text")
      .then((txt) => resolve(txt.toString()));
  });
