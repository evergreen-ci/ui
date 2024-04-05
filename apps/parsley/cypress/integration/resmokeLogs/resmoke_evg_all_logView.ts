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

    it("the HTML log button is disabled", () => {
        cy.toggleDetailsPanel(true);
        cy.dataCy("html-log-button").should("have.attr", "aria-disabled", "true");
    })

    it("should show the project, patch, task, and group the breadcrumb", () => {
      cy.dataCy("project-breadcrumb").contains("mongodb-mongo-master").should("be.visible");
      cy.dataCy("version-breadcrumb").contains("Patch 1994").should("be.visible");
      cy.dataCy("task-breadcrumb").contains("jsCore").should("be.visible");
      cy.dataCy("group-breadcrumb").contains("job0").should("be.visible");
    });
  });
  