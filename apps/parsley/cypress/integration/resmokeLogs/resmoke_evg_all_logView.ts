describe("Basic resmoke log view", () => {
    const logLink =
      "/resmoke/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/job0/all";
    beforeEach(() => {
      cy.visit(logLink);
    });
    
    it("should render resmoke lines", () => {
      cy.dataCy("resmoke-row").should("be.visible");
      cy.dataCy("ansii-row").should("not.exist");
    });

    it("should show the group ID in the breadcrumb", () => {
        cy.dataCy("group-breadcrumb").should("be.visible").contains("job0");
    });
  });
  