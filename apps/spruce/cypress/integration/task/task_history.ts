describe("task history", () => {
  it("can view the task history tab", () => {
    cy.visit(
      "task/evergreen_ubuntu1604_js_test_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/history",
    );
    cy.dataCy("task-history-tab").should("have.attr", "aria-selected", "true");
    cy.dataCy("task-history").should("be.visible");
  });
});
