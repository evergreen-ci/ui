import { palette } from "@leafygreen-ui/palette";

const { green, gray, blue } = palette;

export const hexToRGB = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

describe("task history", () => {
  const spruceTaskHistoryLink =
    "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history";

  const mciTaskHistoryLink =
    "/task/evg_lint_generate_lint_c6672b24d14c6d8cd51ce2c4b2b88b424aaacd64_25_03_27_14_56_09/history?execution=0";

  describe("navigation", () => {
    it("can view the task history tab", () => {
      cy.visit(spruceTaskHistoryLink);
      cy.dataCy("task-history-tab").should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.dataCy("task-history").should("be.visible");
    });
  });

  describe("task timeline", () => {
    it("can expand/collapse tasks", () => {
      cy.visit(spruceTaskHistoryLink);
      cy.dataCy("expanded-option").click();
      cy.dataCy("timeline-box").should("have.length", 13);
      cy.dataCy("task-timeline").within(() => {
        cy.dataCy("collapsed-box").should("not.exist");
      });

      cy.dataCy("collapsed-option").click();
      cy.dataCy("timeline-box").should("have.length", 10);
      cy.dataCy("task-timeline").within(() => {
        cy.dataCy("collapsed-box").should("be.visible");
      });
    });
  });

  describe("commit details list", () => {
    beforeEach(() => {
      cy.visit(spruceTaskHistoryLink);
    });
    it("can expand/collapse tasks", () => {
      cy.dataCy("expanded-option").click();
      cy.dataCy("commit-details-card").should("have.length", 13);
      cy.dataCy("commit-details-list").within(() => {
        cy.dataCy("collapsed-card").should("not.exist");
      });

      cy.dataCy("collapsed-option").click();
      cy.dataCy("commit-details-card").should("have.length", 10);
      cy.dataCy("commit-details-list").within(() => {
        cy.dataCy("collapsed-card").should("be.visible");
      });
    });
    it("can expand/collapse inactive tasks with the inactive commits button", () => {
      cy.dataCy("commit-details-card").should("have.length", 10);
      cy.dataCy("commit-details-card")
        .contains("Order: 12380")
        .should("not.exist");
      cy.dataCy("collapsed-card").first().eq(0).as("collapsedCardButton");
      cy.get("@collapsedCardButton").contains("1 Inactive Commit");
      cy.get("@collapsedCardButton").click();
      cy.get("@collapsedCardButton").contains("1 Expanded");
      cy.dataCy("commit-details-card").should("have.length", 11);
      cy.dataCy("commit-details-card")
        .contains("Order: 1238")
        .should("be.visible");
      cy.get("@collapsedCardButton").click();
      cy.get("@collapsedCardButton").contains("1 Inactive Commit");
      cy.dataCy("commit-details-card").should("have.length", 10);
      cy.dataCy("commit-details-card")
        .contains("Order: 1238")
        .should("not.exist");
    });
  });

  describe("restarting tasks", () => {
    const successColor = hexToRGB(green.dark1);
    const willRunColor = hexToRGB(gray.dark1);

    it("restarting the task that is currently being viewed should reflect changes on UI and update the URL", () => {
      cy.visit(spruceTaskHistoryLink);
      cy.location("search").should("include", "execution=0");
      cy.dataCy("commit-details-card").eq(0).as("firstTaskCard");
      cy.dataCy("timeline-box").eq(0).as("firstTaskBox");

      cy.get("@firstTaskBox").should(
        "have.css",
        "background-color",
        successColor,
      );
      cy.get("@firstTaskCard").within(() => {
        cy.dataCy("restart-button").should(
          "have.attr",
          "aria-disabled",
          "false",
        );
        cy.dataCy("restart-button").click();
      });
      cy.validateToast("success", "Task scheduled to restart");

      cy.location("search").should("include", "execution=1");
      cy.get("@firstTaskBox").should(
        "have.css",
        "background-color",
        willRunColor,
      );
      cy.get("@firstTaskCard").within(() => {
        cy.dataCy("restart-button").should(
          "have.attr",
          "aria-disabled",
          "true",
        );
      });
    });

    it("restarting a task that is not currently being viewed should reflect changes on UI, but not update the URL", () => {
      cy.visit(spruceTaskHistoryLink);
      cy.location("search").should("include", "execution=0");
      cy.dataCy("commit-details-card").eq(1).as("secondTaskCard");
      cy.dataCy("timeline-box").eq(1).as("secondTaskBox");

      cy.get("@secondTaskBox").should(
        "have.css",
        "background-color",
        successColor,
      );
      cy.get("@secondTaskCard").within(() => {
        cy.dataCy("restart-button").should(
          "have.attr",
          "aria-disabled",
          "false",
        );
        cy.dataCy("restart-button").click();
      });
      cy.validateToast("success", "Task scheduled to restart");

      cy.location("search").should("not.include", "execution=1");
      cy.get("@secondTaskBox").should(
        "have.css",
        "background-color",
        willRunColor,
      );
      cy.get("@secondTaskCard").within(() => {
        cy.dataCy("restart-button").should(
          "have.attr",
          "aria-disabled",
          "true",
        );
      });
    });
  });

  describe("scheduling tasks", () => {
    const willRunColor = hexToRGB(gray.dark1);

    it("scheduling a task should reflect the changes on the UI", () => {
      cy.visit(spruceTaskHistoryLink);

      // We are targeting the 2nd task element in the task timeline and asserting that it state changes from an inactive collapsed task to an active will-run task
      cy.dataCy("task-timeline")
        .children()
        // Filter out date-separators
        .filter(
          (index, el) =>
            !el.hasAttribute("data-cy") ||
            el.getAttribute("data-cy") !== "date-separator",
        )
        .eq(2)
        .as("taskBox");
      cy.get("@taskBox").should("have.attr", "data-cy", "collapsed-box");

      cy.contains("1 Inactive Commit").click();
      cy.dataCy("commit-details-card").eq(2).as("taskCard");
      cy.get("@taskCard").within(() => {
        cy.dataCy("schedule-button").should(
          "have.attr",
          "aria-disabled",
          "false",
        );
        cy.dataCy("schedule-button").click();
      });
      cy.validateToast("success", "Task scheduled to run");

      cy.get("@taskBox").should("have.attr", "data-cy", "timeline-box");
      cy.get("@taskBox").should("have.css", "background-color", willRunColor);

      cy.contains("1 Inactive Commit").should("not.exist");
      cy.get("@taskCard").within(() => {
        cy.dataCy("restart-button").should("be.visible");
        cy.dataCy("restart-button").should(
          "have.attr",
          "aria-disabled",
          "true",
        );
      });
    });
  });

  describe("pagination", () => {
    describe("can paginate forwards and backwards", () => {
      beforeEach(() => {
        // Change the viewport size so that tasks overflow to the next page. CI environment has a large scrollbar due to
        // Linux, which distorts the viewport size, so adjustments are made here.
        cy.viewport(Cypress.env("CI") ? 1410 : 1400, 1080);
      });

      it("collapsed view", () => {
        cy.visit(mciTaskHistoryLink);
        cy.get("button[aria-label='Previous page']").as("prevPageButton");
        cy.get("button[aria-label='Next page']").as("nextPageButton");

        const collapsedViewPages = {
          first: { order: "12305", date: "Mar 27, 2025" },
          next: { order: "12224", date: "Mar 7, 2025" },
        };

        // Previous page should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(collapsedViewPages.first.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(collapsedViewPages.first.date);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(collapsedViewPages.next.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(collapsedViewPages.next.date);

        // Reached last page, next button should be disabled.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "true");

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(collapsedViewPages.first.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(collapsedViewPages.first.date);
        // Reached first page, previous button should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
      });

      it("expanded view", () => {
        cy.visit(mciTaskHistoryLink);
        cy.dataCy("expanded-option").click();

        cy.get("button[aria-label='Previous page']").as("prevPageButton");
        cy.get("button[aria-label='Next page']").as("nextPageButton");

        const expandedViewPages = {
          first: { order: "12306", date: "Mar 27, 2025" },
          second: { order: "12262", date: "Mar 17, 2025" },
          third: { order: "12218", date: "Mar 5, 2025" },
          last: { order: "12174", date: "Feb 25, 2025" },
        };

        // Previous page should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.first.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(expandedViewPages.first.date);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.log("Going to next page");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.second.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(expandedViewPages.second.date);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.log("Going to next page");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.third.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(expandedViewPages.third.date);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.log("Going to next page");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.last.order);
        cy.dataCy("horizontal-date-separator")
          .first()
          .contains(expandedViewPages.last.date);

        // Reached last page, next button should be disabled.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "true");

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.third.order);

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.second.order);

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card")
          .eq(0)
          .contains(expandedViewPages.first.order);

        // Reached first page, previous button should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
      });
    });

    it("paging backwards to the first page should show a full page of results", () => {
      cy.visit(
        "/task/evg_lint_generate_lint_14499175e85a5b550dfb5bb6067fce4ecf7fcd15_25_03_26_19_23_35/history?execution=0",
      );
      cy.get("button[aria-label='Previous page']").as("prevPageButton");
      cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
      cy.get("@prevPageButton").click();

      // We shouldn't just show the single activated task that appears before this one.
      cy.dataCy("timeline-box").should("have.length.above", 1);
      cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
    });
  });

  describe("date filter", () => {
    it("can filter by date correctly with default timezone", () => {
      cy.visit(mciTaskHistoryLink);
      cy.dataCy("expanded-option").click();

      cy.dataCy("date-picker").click();
      cy.get("[aria-label^='Select year']").click();
      cy.contains("li", "2025").click({ force: true });
      cy.get("[aria-label^='Select month']").click();
      cy.contains("li", "Feb").click({ force: true });
      cy.get("[data-iso='2025-02-28']").click();

      cy.location("search").should("contain", "2025-02-28");
      cy.validateDatePickerDate("date-picker", {
        year: "2025",
        month: "02",
        day: "28",
      });
      cy.dataCy("commit-details-card")
        .eq(0)
        .should("contain", "Remove userSettings query");
    });

    it("can filter by date correctly with different timezone", () => {
      cy.visit("/preferences");
      cy.contains("Select a timezone").click();
      cy.contains("Japan, South Korea").click({ force: true });
      cy.contains("button", "Save changes").click();

      cy.visit(mciTaskHistoryLink);
      cy.dataCy("expanded-option").click();

      cy.dataCy("date-picker").click();
      cy.get("[aria-label^='Select year']").click();
      cy.contains("li", "2025").click({ force: true });
      cy.get("[aria-label^='Select month']").click();
      cy.contains("li", "Feb").click({ force: true });
      cy.get("[data-iso='2025-02-28']").click();

      cy.location("search").should("contain", "2025-02-28");
      cy.validateDatePickerDate("date-picker", {
        year: "2025",
        month: "02",
        day: "28",
      });
      cy.dataCy("commit-details-card")
        .eq(0)
        .should("contain", "Flush logger after running check run");
    });

    it("date is cleared when paginating", () => {
      cy.visit(`${mciTaskHistoryLink}&date=2025-02-28`);
      cy.dataCy("expanded-option").click();
      cy.validateDatePickerDate("date-picker", {
        year: "2025",
        month: "02",
        day: "28",
      });
      cy.dataCy("commit-details-card")
        .eq(0)
        .should("contain", "Remove userSettings query");

      cy.get("button[aria-label='Previous page']").as("prevPageButton");
      cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
      cy.get("@prevPageButton").click();
      cy.dataCy("commit-details-card")
        .eq(0)
        .should("not.contain", "Remove userSettings query");

      cy.dataCy("date-picker").should("not.have.text");
      cy.validateDatePickerDate("date-picker");
      cy.location("search").should("not.contain", "date");
    });
  });

  describe("jumping to current task", () => {
    it("can return to the current task after paginating", () => {
      cy.visit(mciTaskHistoryLink);
      cy.dataCy("expanded-option").click();
      cy.dataCy("commit-details-card").eq(0).as("firstTaskCard");
      cy.get("@firstTaskCard").should("contain", "Order: 12306");

      cy.get("button[aria-label='Next page']").click();
      cy.get("@firstTaskCard").should("not.contain", "Order: 12306");

      cy.dataCy("jump-to-this-task-button").click();
      cy.get("@firstTaskCard").should("contain", "Order: 12306");
    });

    it("can return to the current task after filtering by date", () => {
      cy.visit(mciTaskHistoryLink);
      cy.dataCy("expanded-option").click();
      cy.dataCy("commit-details-card").eq(0).as("firstTaskCard");
      cy.get("@firstTaskCard").should("contain", "Order: 12306");

      cy.dataCy("date-picker").click();
      cy.get("[aria-label^='Select year']").click();
      cy.contains("li", "2025").click({ force: true });
      cy.get("[aria-label^='Select month']").click();
      cy.contains("li", "Feb").click({ force: true });
      cy.get("[data-iso='2025-02-28']").click();
      cy.get("@firstTaskCard").should("not.contain", "Order: 12306");

      cy.dataCy("jump-to-this-task-button").click();
      cy.get("@firstTaskCard").should("contain", "Order: 12306");
    });
  });

  describe("test failure search", () => {
    beforeEach(() => {
      cy.visit(
        "task/evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/history",
      );
      cy.get('input[placeholder="Search failed test"]').as("searchInput");
    });

    it("should update the URL correctly", () => {
      cy.get("@searchInput").type("faketest");
      cy.location("search").should("contain", "failing_test=faketest");
    });

    it("unmatching search results are opaque", () => {
      cy.get("@searchInput").type("faketest");
      cy.dataCy("commit-details-card")
        .first()
        .should("have.css", "opacity", "1");
      cy.dataCy("commit-details-card")
        .eq(1)
        .should("have.css", "opacity", "0.4");
      cy.dataCy("commit-details-card")
        .eq(2)
        .should("have.css", "opacity", "0.4");
      cy.get("@searchInput").clear();
      cy.dataCy("commit-details-card").should("have.css", "opacity", "1");
    });

    it("no results found message is shown when no tasks match the search term", () => {
      cy.get("@searchInput").type("artseinrst");
      cy.contains("No results on this page").should("be.visible");
    });
  });

  describe("failing tests table", () => {
    const failingTestLink =
      "/task/evg_lint_generate_lint_ecbbf17f49224235d43416ea55566f3b1894bbf7_25_03_21_21_09_20/history?execution=0";

    beforeEach(() => {
      cy.visit(failingTestLink);
    });

    it("table can be expanded", () => {
      cy.dataCy("commit-details-card")
        .eq(0)
        .within(() => {
          cy.dataCy("failing-tests-changes-table").should("not.be.visible");
          cy.get("[aria-label='Accordion icon']").click();
          cy.dataCy("failing-tests-changes-table").should("be.visible");
          cy.dataCy("failing-tests-table-row").should("have.length", 3);
        });
    });

    it("can filter within the table", () => {
      cy.dataCy("failing-tests-changes-table").should("not.be.visible");
      cy.get("[aria-label='Accordion icon']").click();
      cy.dataCy("failing-tests-changes-table").should("be.visible");
      cy.dataCy("failing-tests-table-row").should("have.length", 3);

      cy.dataCy("test-name-filter").click();

      cy.get('input[placeholder="Test name"]').type("test_lint_1{enter}");
      cy.dataCy("failing-tests-table-row").should("have.length", 1);

      cy.dataCy("test-name-filter").click();
      cy.get('input[placeholder="Test name"]').clear();
      cy.get('input[placeholder="Test name"]').type("{enter}");
      cy.dataCy("failing-tests-table-row").should("have.length", 3);
    });

    it("clicking 'Search Failure' button'", () => {
      cy.dataCy("commit-details-card")
        .eq(0)
        .within(() => {
          cy.dataCy("failing-tests-changes-table").should("not.be.visible");
          cy.get("[aria-label='Accordion icon']").click();
          cy.dataCy("failing-tests-changes-table").should("be.visible");
          cy.dataCy("failing-tests-table-row").should("have.length", 3);
          cy.dataCy("failing-tests-table-row")
            .eq(0)
            .within(() => {
              cy.contains("button", "Search Failure").click();
            });
        });
      cy.location("search").should("contain", "failing_test=test_lint_1");
      cy.get('input[placeholder="Search failed test"]').should(
        "have.value",
        "test_lint_1",
      );
    });
  });

  describe("hover and click interactions", () => {
    const selectedColor = hexToRGB(blue.base);

    it("hovering on commit cards highlight the corresponding task box", () => {
      cy.visit(mciTaskHistoryLink);
      cy.dataCy("commit-details-card").eq(35).as("thirdTaskCard");
      cy.dataCy("timeline-box").eq(35).as("thirdTaskBox");

      cy.get("@thirdTaskCard").trigger("mouseover");
      cy.get("@thirdTaskBox").should("have.css", "border-color", selectedColor);
    });

    it("clicking on task box should highlight and scroll to the commit card", () => {
      cy.visit(mciTaskHistoryLink);
      cy.dataCy("commit-details-card").eq(16).as("oldTaskCard");
      cy.dataCy("timeline-box").eq(16).as("oldTaskBox");

      cy.get("@oldTaskBox").click();
      cy.get("@oldTaskBox").should("have.css", "border-color", selectedColor);
      cy.get("@oldTaskCard").should("be.visible");
      cy.get("@oldTaskCard").should("have.css", "border-color", selectedColor);
    });
  });
});
