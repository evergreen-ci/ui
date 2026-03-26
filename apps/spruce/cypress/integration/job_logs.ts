describe("Job logs page", () => {
  const taskIdWithResmokeLogs =
    "mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29";

  describe("Evergreen job logs page", () => {
    beforeEach(() => {
      cy.visit(`job-logs/${taskIdWithResmokeLogs}/0/job0`);
    });
    it("renders a table with test links", () => {
      cy.dataCy("leafygreen-table-row").should("have.length", 655);

      cy.dataCy("complete-test-logs-link")
        .should("have.attr", "href")
        .then((href) => {
          cy.wrap(href).should(
            "contain",
            "resmoke/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/job0/all",
          );
        });
    });
    it("visiting an invalid job logs page shows an error toast", () => {
      cy.visit(`job-logs/DNE/0/job0`);
      cy.validateToast(
        "error",
        "There was an error retrieving logs for this task",
      );
    });
  });
});
