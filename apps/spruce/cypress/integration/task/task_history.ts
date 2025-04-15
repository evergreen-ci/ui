describe("task history", () => {
  describe("navigation", () => {
    it("can view the task history tab", () => {
      cy.visit(
        "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history",
      );
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
      cy.visit(
        "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history",
      );
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
    it("can expand/collapse tasks", () => {
      cy.visit(
        "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history",
      );
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
  });

  describe("pagination", () => {
    describe("can paginate forwards and backwards", () => {
      beforeEach(() => {
        // Change the viewport size so that tasks overflow to the next page.
        cy.viewport(1400, 1080);
      });

      it("collapsed view", () => {
        cy.visit(
          "/task/evg_lint_generate_lint_c6672b24d14c6d8cd51ce2c4b2b88b424aaacd64_25_03_27_14_56_09/history?execution=0",
        );
        cy.get("button[aria-label='Previous page']").as("prevPageButton");
        cy.get("button[aria-label='Next page']").as("nextPageButton");

        const firstPageOrder = "12305";
        const nextPageOrder = "12206";

        // Previous page should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(firstPageOrder);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(nextPageOrder);

        // Reached last page, next button should be disabled.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "true");

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(firstPageOrder);

        // Reached first page, previous button should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
      });

      it("expanded view", () => {
        cy.visit(
          "/task/evg_lint_generate_lint_c6672b24d14c6d8cd51ce2c4b2b88b424aaacd64_25_03_27_14_56_09/history?execution=0",
        );
        cy.dataCy("expanded-option").click();

        cy.get("button[aria-label='Previous page']").as("prevPageButton");
        cy.get("button[aria-label='Next page']").as("nextPageButton");

        const firstPageOrder = "12306";
        const nextPageOrder = "12252";
        const lastPageOrder = "12198";

        // Previous page should be disabled.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "true");
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(firstPageOrder);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(nextPageOrder);

        // Go to next page.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@nextPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(lastPageOrder);

        // Reached last page, next button should be disabled.
        cy.get("@nextPageButton").should("have.attr", "aria-disabled", "true");

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(nextPageOrder);

        // Go to previous page.
        cy.get("@prevPageButton").should("have.attr", "aria-disabled", "false");
        cy.get("@prevPageButton").click();
        cy.dataCy("commit-details-card").should("be.visible");
        cy.dataCy("commit-details-card").eq(0).contains(firstPageOrder);

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
});
