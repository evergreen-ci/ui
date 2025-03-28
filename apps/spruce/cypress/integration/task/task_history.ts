describe("task history", () => {
  it("can view the task history tab", () => {
    cy.visit(
      "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history",
    );
    cy.dataCy("task-history-tab").should("have.attr", "aria-selected", "true");
    cy.dataCy("task-history").should("be.visible");
  });

  describe("task timeline", () => {
    it("can expand/collapse tasks", () => {
      cy.visit(
        "task/spruce_ubuntu1604_e2e_test_b0c52a750150b4f1f67e501bd3351a808939815c_1f7cf49f4ce587c74212d8997da171c4_22_03_10_15_19_05/history",
      );
      cy.dataCy("expanded-option").click();
      cy.get("[data-collapsed='true']").should("not.exist");
      cy.dataCy("collapsed-option").click();
      cy.get("[data-collapsed='true']").should("be.visible");
    });
  });
});
