describe("project banners", () => {
  const projectWithRepotrackerError = "/project/mongodb-mongo-test/waterfall";

  describe("repoTracker banner", () => {
    beforeEach(() => {
      cy.visit(projectWithRepotrackerError);
    });

    it("should be able to clear the repoTracker error", () => {
      cy.dataCy("repoTracker-error-banner").should("be.visible");
      cy.dataCy("repoTracker-error-trigger").should("be.visible");
      cy.dataCy("repoTracker-error-trigger").click();
      cy.dataCy("repoTracker-error-modal").should("be.visible");
      cy.getInputByLabel("Base Revision").type(
        "7ad0f0571691fa5063b757762a5b103999290fa8",
      );
      cy.contains("button", "Confirm").should(
        "have.attr",
        "aria-disabled",
        "false",
      );
      cy.contains("button", "Confirm").click();
      cy.validateToast("success", "Successfully updated merge base revision");
      cy.dataCy("repoTracker-error-banner").should("not.exist");
    });
  });
});
